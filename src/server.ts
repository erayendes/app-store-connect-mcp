import { createRequire } from 'node:module';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { TokenProvider } from './core/jwt.js';
import { AscHttpClient } from './core/http.js';
import { ToolRegistry, DEFAULT_DOMAINS, type McpToolDefinition } from './core/registry.js';
import { AscApiError } from './core/errors.js';
import {
  confirmWrite,
  buildWritePreview,
  resolveBodyRefs,
  type WriteConfirmer,
} from './core/confirm.js';
import type { ServerConfig } from './core/config.js';
import { META_TOOLS, META_TOOL_NAMES, executeMetaTool } from './tools/meta.js';
import { REVIEWS_AI_TOOLS, REVIEWS_AI_TOOL_NAMES, executeReviewsAiTool } from './tools/reviews-ai.js';
import { STOREKIT_TOOLS, STOREKIT_TOOL_NAMES, StoreKitService } from './storekit/index.js';
import {
  PRICING_TOOLS,
  PRICING_TOOL_NAMES,
  executePricingTool,
  buildPricingPreview,
} from './tools/pricing.js';
import { SPEC_VERSION } from './generated/operations.js';
import { GATEWAY_OPERATIONS, profileForDomain, registerCommand, type Profile } from './profiles.js';
import {
  stripApiNoise,
  capResponseSize,
  truncateText,
  DEFAULT_MAX_RESPONSE_CHARS,
} from './core/shape.js';

/** Configurable response ceiling (chars of pretty-printed JSON). */
function maxResponseChars(): number {
  const raw = Number(process.env.ASC_MAX_RESPONSE_CHARS);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_MAX_RESPONSE_CHARS;
}

// Read from package.json at runtime so the banner can't drift from the published
// version. Not a JSON import: package.json sits outside tsconfig's rootDir.
export const VERSION: string = createRequire(import.meta.url)('../package.json').version;

export function createServer(config: ServerConfig, profile?: Profile): Server {
  const tokens = new TokenProvider(config.credentials);
  // ASC_BASE_URL redirects everything to a local fixture server for testing;
  // host-pinning then pins to that origin instead of Apple's.
  const http = new AscHttpClient(tokens, { baseUrl: config.baseUrl });

  // In profile mode, "how do I reach that tool" answers name the sibling MCP
  // server; the --domains flag only makes sense on the monolithic server.
  const unloadedDomainHint = profile
    ? (domain: string) => {
        const home = profileForDomain(domain);
        return home
          ? `It is served by the "asc-${home.name}" MCP server. Register it with:\n` +
            `  ${registerCommand(home.name)}\n` +
            `(or add the same entry to your MCP client config), then restart your client.`
          : `Run the server without a profile and with --domains=${domain} to reach it.`;
      }
    : undefined;

  const registry = new ToolRegistry({
    domains: profile ? profile.domains : config.domains,
    readOnly: config.readOnly,
    includeDeprecated: config.includeDeprecated,
    paramDefaults: config.vendorNumber
      ? { 'filter[vendorNumber]': config.vendorNumber }
      : undefined,
    // apps.list/apps.get ride along in every profile: nearly every workflow
    // starts from an app ID. The app-info profile has them natively.
    extraOperations: profile ? GATEWAY_OPERATIONS : undefined,
    unloadedDomainHint,
    dryRun: config.dryRun,
  });

  const loadedDomains = profile
    ? profile.domains
    : config.domains?.length
      ? config.domains
      : [...DEFAULT_DOMAINS];

  // StoreKit tools are only offered when a bundle ID is configured, since the
  // App Store Server API is scoped to a single app. A profile additionally has
  // to opt in (monetization does).
  const storekitWanted = profile ? Boolean(profile.storekit) : true;
  let storekit: StoreKitService | undefined;
  let storekitError: string | undefined;
  if (config.storekit && storekitWanted) {
    try {
      storekit = new StoreKitService(config);
    } catch (err) {
      storekitError = (err as Error).message;
    }
  }

  const reviewsAiWanted = profile ? Boolean(profile.reviewsAi) : true;
  const pricingWanted = (profile ? Boolean(profile.pricing) : true) && !config.readOnly;

  const server = new Server(
    { name: profile ? `asc-${profile.name}` : 'app-store-connect-mcp', version: VERSION },
    { capabilities: { tools: {} } }
  );

  // Names of every mutating tool that can actually be called here, so the write
  // guard knows what to confirm. Read-only tools (meta, reviews_ai) never appear.
  const writeToolNames = new Set<string>();
  for (const t of registry.listTools()) {
    if (t.annotations?.readOnlyHint !== true) writeToolNames.add(t.name);
  }
  if (storekit && !config.readOnly) {
    for (const t of STOREKIT_TOOLS) {
      if (t.annotations?.readOnlyHint !== true) writeToolNames.add(t.name);
    }
  }
  if (pricingWanted) {
    for (const t of PRICING_TOOLS) writeToolNames.add(t.name);
  }

  const confirmer: WriteConfirmer = {
    getClientCapabilities: () => server.getClientCapabilities(),
    elicitInput: (params) =>
      server.elicitInput(params as Parameters<typeof server.elicitInput>[0]),
  };
  let warnedNoElicitation = false;
  const warnNoElicitation = () => {
    if (warnedNoElicitation) return;
    warnedNoElicitation = true;
    console.error(
      "Heimdall: this client doesn't support elicitation, and unconfirmed " +
        'writes were explicitly allowed (--allow-unconfirmed-writes) — writes ' +
        "rely on the client's own tool approval only."
    );
  };

  // Reviews-AI tools generate text via MCP Sampling — useless on a client
  // that never declared the capability, so they are hidden from the list
  // there (and guarded again at call time for clients that call blind).
  const clientSupportsSampling = () => Boolean(server.getClientCapabilities()?.sampling);

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools: McpToolDefinition[] = [
      ...META_TOOLS,
      ...(reviewsAiWanted && clientSupportsSampling() ? REVIEWS_AI_TOOLS : []),
      ...(pricingWanted ? PRICING_TOOLS : []),
      ...registry.listTools(),
    ];

    if (storekit) {
      const storekitTools = config.readOnly
        ? STOREKIT_TOOLS.filter((t) => t.annotations?.readOnlyHint)
        : STOREKIT_TOOLS;
      tools.push(...storekitTools);
    }

    return { tools };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name } = request.params;
    const args = (request.params.arguments ?? {}) as Record<string, unknown>;

    try {
      // Dry-run: registry writes return their would-send preview instead of
      // calling Apple, so confirmation would be noise. StoreKit tools bypass
      // the registry and WOULD hit Apple for real — block their writes hard.
      if (config.dryRun && writeToolNames.has(name) && STOREKIT_TOOL_NAMES.has(name)) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `"${name}" is blocked in dry-run mode (App Store Server API calls have no dry-run).`,
            },
          ],
          isError: true,
        };
      }

      if (config.confirmWrites && !config.dryRun && writeToolNames.has(name)) {
        const op = registry.get(name);
        const preview = PRICING_TOOL_NAMES.has(name)
          ? // Macro parameters are already human language — no lookups needed.
            { message: buildPricingPreview(args), strong: true }
          : op
          ? await buildWritePreview(name, op, args, config.credentials.keyId, http)
          : await buildWritePreview(
              name,
              // StoreKit tools live outside the spec; renewal-date extension is
              // the one that moves money.
              {
                method: 'POST',
                path: 'App Store Server API',
                risk: name.includes('extend_renewal_date') ? 'revenue' : 'low',
              },
              args
            );
        const decision = await confirmWrite(
          confirmer,
          name,
          warnNoElicitation,
          config.allowUnconfirmedWrites,
          preview
        );
        if (!decision.allowed) {
          const text =
            decision.reason === 'no-elicitation'
              ? `"${name}" was blocked: write confirmation is on, but this client cannot ` +
                `show a confirmation prompt (no elicitation support). Nothing was changed. ` +
                `To allow writes on this client anyway, restart the server with ` +
                `--allow-unconfirmed-writes (or ASC_ALLOW_UNCONFIRMED_WRITES=1) — writes ` +
                `will then rely on the client's own tool approval. Or use --read-only.`
              : `"${name}" was cancelled — the write was not confirmed (${decision.reason}). Nothing was changed.`;
          return {
            content: [{ type: 'text' as const, text }],
            isError: true,
          };
        }
      }

      let result: unknown;

      if (META_TOOL_NAMES.has(name)) {
        result = await executeMetaTool(name, args, {
          registry,
          http,
          tokens,
          readOnly: config.readOnly,
          loadedDomains,
          storekitEnabled: Boolean(storekit),
          unloadedDomainsHint: profile
            ? (domains) => {
                const homes = [...new Set(
                  domains.map((d) => profileForDomain(d)?.name).filter((n): n is string => Boolean(n))
                )];
                return homes.length
                  ? `These live on sibling MCP servers. Register the ones you need in your ` +
                    `MCP client — the command is the same everywhere:\n` +
                    homes.map((n) => `  asc-${n}  ->  npx -y @erayendes/asc-mcp ${n}`).join('\n') +
                    `\nFor example, in Claude Code:\n` +
                    homes.map((n) => `  ${registerCommand(n)}`).join('\n') +
                    `\nOn other clients (Codex, Antigravity, Claude Desktop, …) add the same ` +
                    `command/args to their config. Then restart your client.`
                  : `Run the server without a profile to combine domains freely.`;
              }
            : undefined,
        });
      } else if (pricingWanted && PRICING_TOOL_NAMES.has(name)) {
        result = await executePricingTool(name, args, { http, dryRun: config.dryRun });
      } else if (reviewsAiWanted && REVIEWS_AI_TOOL_NAMES.has(name)) {
        result = await executeReviewsAiTool(name, args, {
          server,
          http,
          samplingSupported: clientSupportsSampling,
          brand: config.reviewsBrand,
        });
      } else if (STOREKIT_TOOL_NAMES.has(name)) {
        if (!storekit) {
          throw new Error(
            storekitError ??
              'App Store Server API tools are unavailable. Set ASC_BUNDLE_ID to enable them.'
          );
        }
        if (config.readOnly) {
          const tool = STOREKIT_TOOLS.find((t) => t.name === name);
          if (tool && !tool.annotations?.readOnlyHint) {
            throw new Error(`"${name}" is blocked in read-only mode.`);
          }
        }
        result = await storekit.execute(name, args);
      } else {
        result = await registry.execute(name, args, http);
        // Dry-run rehearsals get the same human translation as the live
        // confirmation prompt, so the rehearsal shows what the real run would.
        if ((result as any)?.dryRun === true && args.body !== undefined) {
          const labels = await resolveBodyRefs(http, (args.body as any)?.data);
          if (labels.size) {
            (result as any).humanReadable = Object.fromEntries(labels);
          }
        }
        // Apple payloads are mostly URL noise the model never follows; strip
        // it and cap the size so one listing can't flood the context window.
        if (process.env.ASC_KEEP_RAW_RESPONSES !== '1') {
          result = stripApiNoise(result);
        }
        result = capResponseSize(result, maxResponseChars());
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: truncateText(
              JSON.stringify(result ?? { ok: true }, null, 2),
              maxResponseChars()
            ),
          },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: 'text' as const, text: formatError(err, name) }],
        isError: true,
      };
    }
  });

  return server;
}

function formatError(err: unknown, toolName: string): string {
  if (err instanceof AscApiError) {
    const lines = [`${toolName} failed: ${err.summary}`];
    if (err.status) lines.push(`HTTP status: ${err.status}`);
    if (err.requestId) lines.push(`Apple request ID: ${err.requestId}`);
    return lines.join('\n');
  }
  return `${toolName} failed: ${(err as Error).message}`;
}

export { SPEC_VERSION };
