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
import type { ServerConfig } from './core/config.js';
import { META_TOOLS, META_TOOL_NAMES, executeMetaTool } from './tools/meta.js';
import { REVIEWS_AI_TOOLS, REVIEWS_AI_TOOL_NAMES, executeReviewsAiTool } from './tools/reviews-ai.js';
import { STOREKIT_TOOLS, STOREKIT_TOOL_NAMES, StoreKitService } from './storekit/index.js';
import { SPEC_VERSION } from './generated/operations.js';
import { GATEWAY_OPERATIONS, profileForDomain, registerCommand, type Profile } from './profiles.js';

// Read from package.json at runtime so the banner can't drift from the published
// version. Not a JSON import: package.json sits outside tsconfig's rootDir.
export const VERSION: string = createRequire(import.meta.url)('../package.json').version;

export function createServer(config: ServerConfig, profile?: Profile): Server {
  const tokens = new TokenProvider(config.credentials);
  const http = new AscHttpClient(tokens);

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

  const server = new Server(
    { name: profile ? `asc-${profile.name}` : 'app-store-connect-mcp', version: VERSION },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools: McpToolDefinition[] = [
      ...META_TOOLS,
      ...(reviewsAiWanted ? REVIEWS_AI_TOOLS : []),
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
      } else if (reviewsAiWanted && REVIEWS_AI_TOOL_NAMES.has(name)) {
        result = await executeReviewsAiTool(name, args, { server, http });
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
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result ?? { ok: true }, null, 2),
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
