import { createRequire } from 'node:module';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { TokenProvider } from './core/jwt.js';
import { AscHttpClient, STATUS_HINTS } from './core/http.js';
import {
  ToolRegistry,
  DEFAULT_DOMAINS,
  toMcpTool,
  toolNameFor,
  type McpToolDefinition,
} from './core/registry.js';
import { AscApiError } from './core/errors.js';
import { ResourceStore } from './core/resources.js';
import {
  confirmWrite,
  buildWritePreview,
  resolveBodyRefs,
  type WriteConfirmer,
} from './core/confirm.js';
import type { ServerConfig } from './core/config.js';
import { META_TOOLS, META_TOOL_NAMES, executeMetaTool } from './tools/meta.js';
import { REVIEWS_AI_TOOLS, REVIEWS_AI_TOOL_NAMES, executeReviewsAiTool } from './tools/reviews-ai.js';
import {
  METADATA_I18N_TOOLS,
  METADATA_I18N_TOOL_NAMES,
  METADATA_I18N_WRITE_TOOLS,
  executeMetadataI18nTool,
} from './tools/metadata-i18n.js';
import { STOREKIT_TOOLS, STOREKIT_TOOL_NAMES, StoreKitService } from './storekit/index.js';
import {
  PRICING_TOOLS,
  PRICING_TOOL_NAMES,
  executePricingTool,
  buildPricingPreview,
} from './tools/pricing.js';
import { SCREENSHOT_TOOLS, executeScreenshotTool } from './tools/screenshots.js';
import { PREFLIGHT_TOOLS, PREFLIGHT_TOOL_NAMES, executePreflightTool } from './tools/preflight.js';
import { ANALYTICS_TOOLS, ANALYTICS_TOOL_NAMES, executeAnalyticsTool } from './tools/analytics.js';
import { OPERATIONS, SPEC_VERSION } from './generated/operations.js';
import type { Operation } from './core/types.js';
import { STRONG_CONFIRM_LEVELS, type RiskLevel } from './core/risk.js';
import {
  CORE_OPERATIONS,
  manualToolsFor,
  deprecatedOperationsFor,
  operationsFor,
  profilesForOperation,
  registerCommand,
  removedProfileMessage,
  subProfileOwning,
  toolCountFor,
  TOKENS_PER_TOOL,
  type ProfileSelection,
  type SubProfile,
} from './profiles.js';
import {
  stripApiNoise,
  redactPii,
  markUntrusted,
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

/**
 * Sent once, at initialize, and carried for the whole session — MCP's own slot
 * for things the client should know before it calls anything. The client does
 * pass them on: asked to quote any instructions it had been given, a live
 * session reproduced this text verbatim, and a build with the field blanked
 * answered "NONE RECEIVED".
 *
 * Every line states a fact about the API. None gives advice about how to
 * behave, and that distinction was expensive to learn. Two advice lines shipped
 * here first — do not search the local disk, take an empty result as the answer
 * — and an A/B against a build without them could not measure any effect: three
 * samples per condition, and the spread within one condition (374k to 1341k
 * tokens on the same task) swamped every difference between conditions. What
 * the runs did show was the agent shelling out to `jq` in all nine of them,
 * under every instruction set, because one response in that task is 264 KB. No
 * sentence fixes a response that does not fit; only a smaller response does.
 *
 * So the bar is: a line belongs here if the model would get it wrong from the
 * schemas alone, and if knowing it changes the call rather than the attitude.
 * Anything a parameter description can carry belongs there instead — those are
 * generated, so `filter[territory]` states its own format on every one of the
 * 23 operations that take it, and this line is the backstop for clients that
 * drop instructions entirely.
 */
export const SERVER_INSTRUCTIONS = [
  'App Store Connect, through Heimdall. Three things the API will not tell you:',
  '',
  '1. Territories are ISO-3166 alpha-3: USA, TUR, DEU — never US, TR, DE. Two letters',
  '   is not rejected; it returns 200 and an empty list that reads as "no data here".',
  '2. List endpoints return relationship stubs, not values: /prices carries no price',
  '   until the price point is included.',
  '3. pricing__* answers a pricing question in one call, in place of the',
  '   app → group → subscription → price chain. Prefer it over walking the chain.',
].join('\n');

/**
 * How many tools each server actually serves, by server.
 *
 * A WeakMap rather than a field on the SDK's `Server`: the count has to be read
 * from outside (index.ts prints the banner) without changing the type every
 * call site depends on, and it must not keep a server alive.
 */
const toolCounts = new WeakMap<Server, () => number>();

/** What `tools/list` will return for this server — the number a client sees. */
export function servedToolCount(server: Server): number | undefined {
  return toolCounts.get(server)?.();
}

export function createServer(config: ServerConfig, selection?: ProfileSelection): Server {
  const tokens = new TokenProvider(config.credentials);
  // ASC_BASE_URL redirects everything to a local fixture server for testing;
  // host-pinning then pins to that origin instead of Apple's.
  const http = new AscHttpClient(tokens, { baseUrl: config.baseUrl, rateLimit: config.rateLimit });

  // In profile mode, "how do I reach that tool" answers name the sibling MCP
  // server; the --domains flag only makes sense on the monolithic server.
  const missingToolHint = selection
    ? (op: Operation): string => {
        const ownSub = subProfileOwning(selection.profile, op.name);
        if (ownSub) {
          // Same server, unselected sub-profile: the remedy is a startup
          // argument here, not a different server.
          return (
            `It belongs to this profile's "${ownSub.name}" sub-profile, which this server ` +
            `did not load. Restart it as \`${selection.profile.name}\` for everything, or ` +
            `\`${selection.profile.name}:${[...selection.subProfiles.map((s) => s.name), ownSub.name]
              .filter(Boolean)
              .join(',')}\` to add just this one.`
          );
        }
        const homes = profilesForOperation(op.name).filter((n) => n !== selection.profile.name);
        return homes.length
          ? `It is served by the "asc-${homes[0]}" MCP server. Register it with:\n` +
            `  ${registerCommand(homes[0])}\n` +
            `(or add the same entry to your MCP client config), then restart your client.`
          : `Run the server without a profile and with --domains=${op.domain} to reach it.`;
      }
    : undefined;

  const registry = new ToolRegistry({
    // A profile carries an explicit, hand-curated list; core (apps.list/get and
    // the four shared relationship listings) is already folded into it.
    operations: selection
      ? [
          ...operationsFor(selection),
          // Deprecated operations are in no profile, so without this the flag
          // was a no-op in profile mode — see deprecatedOperationsFor.
          ...(config.includeDeprecated ? deprecatedOperationsFor(selection) : []),
        ]
      : undefined,
    domains: selection ? undefined : config.domains,
    readOnly: config.readOnly,
    includeDeprecated: config.includeDeprecated,
    paramDefaults: config.vendorNumber
      ? { 'filter[vendorNumber]': config.vendorNumber }
      : undefined,
    missingToolHint,
    dryRun: config.dryRun,
  });

  const loadedDomains = selection
    ? registry.loadedDomains()
    : config.domains?.length
      ? config.domains
      : [...DEFAULT_DOMAINS];

  // Which sub-profiles are live right now. Mutable because `asc__load` can add
  // one mid-session; everything that reports or gates on the selection reads
  // this rather than the startup argument.
  const loadedSubs = new Set(selection?.subProfiles ?? []);
  const unloadedSubs = (): SubProfile[] =>
    selection ? selection.profile.subProfiles.filter((s) => s.name && !loadedSubs.has(s)) : [];

  /** What this server is, in the unit a user configures: profiles. */
  const profileReport = selection
    ? (): Record<string, unknown> => ({
        profile: selection.profile.name,
        subProfiles: selection.profile.subProfiles
          .filter((s) => s.name)
          .map((s) => ({
            name: s.name,
            tools: s.operations.length + s.manualTools.length,
            loaded: loadedSubs.has(s),
            description: s.description,
          })),
        // What this server actually serves, not what the profile maps: the
        // estimate exists to answer "what is this costing my context".
        estimatedTokens: (servedToolCount(server) ?? toolCountFor(selection)) * TOKENS_PER_TOOL,
        ...(unloadedSubs().length
          ? {
              hint:
                `Some sub-profiles are not loaded. Call asc__load to add one for this ` +
                `session, or restart as \`${selection.profile.name}\` for all of them.`,
            }
          : {}),
      })
    : undefined;

  // Which hand-written tool families this selection carries. The curation
  // sheet decides — a sub-profile listing `storekit__*` is what turns them on,
  // so unchecking that sub-profile turns them off with no second switch.
  const manualTools = selection ? new Set(manualToolsFor(selection)) : undefined;
  const wantsFamily = (prefix: string): boolean =>
    manualTools ? [...manualTools].some((t) => t.startsWith(prefix)) : true;

  // StoreKit tools are only offered when a bundle ID is configured, since the
  // App Store Server API is scoped to a single app. A profile additionally has
  // to opt in (monetization's storekit sub-profile does).
  const storekitWanted = wantsFamily('storekit__');
  let storekit: StoreKitService | undefined;
  let storekitError: string | undefined;
  if (config.storekit && storekitWanted) {
    try {
      storekit = new StoreKitService(config);
    } catch (err) {
      storekitError = (err as Error).message;
    }
  }

  const reviewsAiWanted = wantsFamily('reviews_ai__');

  /**
   * Macros: one call in place of a chain the raw tools would make the model
   * walk. Each family opts in through the profile like any other, and a
   * read-only server still offers the read ones — refusing to answer "what does
   * this cost" on a server built to answer questions would be the wrong kind of
   * safe.
   */
  const macroTools = [...PRICING_TOOLS, ...SCREENSHOT_TOOLS, ...ANALYTICS_TOOLS, ...PREFLIGHT_TOOLS, ...METADATA_I18N_TOOLS].filter(
    (t) =>
      wantsFamily(`${t.name.split('__')[0]}__`) &&
      (!config.readOnly || t.annotations?.readOnlyHint === true)
  );
  const macroOffered = (name: string): boolean => macroTools.some((t) => t.name === name);

  /** The macros that declare an outputSchema, so their result can be sent structured. */
  const READ_MACRO_NAMES = new Set(
    [...PRICING_TOOLS, ...SCREENSHOT_TOOLS, ...ANALYTICS_TOOLS, ...PREFLIGHT_TOOLS, ...METADATA_I18N_TOOLS].filter((t) => t.outputSchema).map((t) => t.name)
  );

  const server = new Server(
    { name: selection ? `asc-${selection.profile.name}` : 'app-store-connect-mcp', version: VERSION },
    {
      // listChanged: the tool list can grow mid-session via asc__load, and a
      // resource appears whenever a response is too big to send whole.
      capabilities: { tools: { listChanged: true }, resources: { listChanged: true } },
      instructions: SERVER_INSTRUCTIONS,
    }
  );

  // Overflow from responses the size cap had to cut. Registered here rather
  // than lazily so a client that lists resources at startup gets an empty
  // list instead of "method not found".
  const resources = new ResourceStore();
  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: resources.list().map(({ uri, name, mimeType }) => ({
      uri,
      name,
      mimeType,
      description: 'The complete response of an earlier call, kept because it exceeded the size cap.',
    })),
  }));
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const found = resources.read(request.params.uri);
    if (!found) {
      // Eviction is the usual reason, and it is worth saying so: the caller
      // asked for something that existed, not something that never did.
      throw new Error(
        `No such resource: ${request.params.uri}. Only the ${resources.list().length} most ` +
          `recent oversized responses are kept; re-run the tool to produce it again.`
      );
    }
    return { contents: [{ uri: found.uri, mimeType: found.mimeType, text: found.text }] };
  });

  /**
   * Whether a tool mutates, so the write guard knows what to confirm. Computed
   * per call rather than once: `asc__load` can add write tools after startup,
   * and a set captured at boot would wave them through unconfirmed.
   */
  const isWriteTool = (name: string): boolean => {
    const op = registry.get(name);
    if (op) return !op.readOnly;
    const macro = [...PRICING_TOOLS, ...SCREENSHOT_TOOLS, ...ANALYTICS_TOOLS, ...PREFLIGHT_TOOLS, ...METADATA_I18N_TOOLS].find((t) => t.name === name);
    if (macro) return macro.annotations?.readOnlyHint !== true;
    if (STOREKIT_TOOL_NAMES.has(name) && storekit && !config.readOnly) {
      return STOREKIT_TOOLS.find((t) => t.name === name)?.annotations?.readOnlyHint !== true;
    }
    return false;
  };

  const confirmer: WriteConfirmer = {
    getClientCapabilities: () => server.getClientCapabilities(),
    elicitInput: (params) =>
      server.elicitInput(params as Parameters<typeof server.elicitInput>[0]),
  };

  /**
   * On-demand loading, kept deliberately minimal while we find out whether
   * clients hand a revised tool list to the model within the same turn. If they
   * do, a profile can start small and grow; if they don't, the agent has to say
   * "loaded, ask again", which is worse than starting wide.
   */
  const loadTool = (): McpToolDefinition | undefined => {
    const available = unloadedSubs().filter((s) => s.operations.length);
    if (!available.length) return undefined;
    return {
      name: 'asc__load',
      description:
        `Add one of this server's unloaded sub-profiles to the tool list for the rest of ` +
        `this session, without restarting. Use it when the tool you need belongs to this ` +
        `profile but is not loaded. Available: ` +
        available.map((s) => `${s.name} (${s.operations.length} tools — ${s.description})`).join(' '),
      inputSchema: {
        type: 'object' as const,
        properties: {
          sub_profile: { type: 'string', description: 'Sub-profile to load.', enum: available.map((s) => s.name) },
        },
        required: ['sub_profile'],
      },
      annotations: { readOnlyHint: true },
    };
  };

  /**
   * Every operation this profile owns, whether its sub-profile is loaded or
   * not — the reachable set for the proxy below.
   */
  const profileOperations = (): string[] =>
    selection
      ? [...new Set([...CORE_OPERATIONS, ...selection.profile.subProfiles.flatMap((s) => s.operations)])]
      : [];

  /** Accepts either the dotted operation name or the public `a__b` tool name. */
  const resolveProfileOperation = (raw: string): Operation | undefined => {
    const wanted = String(raw).trim();
    const reachable = new Set(profileOperations());
    return OPERATIONS.find(
      (op) => reachable.has(op.name) && (op.name === wanted || toolNameFor(op) === wanted)
    );
  };

  /**
   * The escape hatch that does not depend on the client.
   *
   * asc__load revises the tool list, and MCP lets a server do that — but the
   * spec says nothing about when a client hands the revised list to the model.
   * Measured: Claude Code does it inside the turn, Codex only between turns,
   * where the model is left naming tools it cannot call and the work stalls.
   *
   * These two tools sidestep the question entirely. They are in the list from
   * the start, so any operation this profile owns is one call away on any
   * client, in the same turn, with no notification involved. asc__call routes
   * through the identical guard as a native call — read-only mode, body
   * validation, dry-run, risk level, typed confirmation — and loads the
   * operation on the way, so it also becomes a native tool for whoever refreshes.
   */
  const PROXY_TOOLS: McpToolDefinition[] = selection
    ? [
        {
          name: 'asc__describe',
          description:
            `Show the exact input schema of any tool this profile owns, including ones not ` +
            `currently loaded. Use it before asc__call to build valid arguments. Find tool ` +
            `names with asc__search_tools.`,
          inputSchema: {
            type: 'object' as const,
            properties: { tool: { type: 'string', description: 'Tool or operation name.' } },
            required: ['tool'],
          },
          annotations: { readOnlyHint: true },
        },
        {
          name: 'asc__call',
          description:
            `Read through any tool this profile owns, even one that is not in your tool list — ` +
            `its sub-profile does not have to be loaded and nothing needs a restart. Use this ` +
            `whenever asc__search_tools names a tool you cannot see. Get its arguments from ` +
            `asc__describe first. Read-only: to change something, load the sub-profile with ` +
            `asc__load and call the tool itself, so the confirmation prompt reaches the user.`,
          inputSchema: {
            type: 'object' as const,
            properties: {
              tool: { type: 'string', description: 'Tool or operation name, e.g. "apps__app_price_schedule__get".' },
              arguments: { type: 'object', description: "The tool's own arguments, as asc__describe reports them." },
            },
            required: ['tool'],
          },
          // Honest, and load-bearing: a client that auto-approves reads and
          // prompts for writes will block anything it cannot classify. Codex
          // refused every proxied read while this tool could also write.
          annotations: { readOnlyHint: true },
        },
      ]
    : [];

  const textResult = (value: unknown) => ({
    content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }],
  });

  /** Why a name the proxy was handed isn't callable here, and where it is. */
  const unreachableMessage = (raw: string): string => {
    const known = OPERATIONS.find((op) => op.name === raw || toolNameFor(op) === raw);
    if (!known) {
      return `Unknown tool "${raw}". Use asc__search_tools to find the right name.`;
    }
    const homes = profilesForOperation(known.name).filter((n) => n !== selection?.profile.name);
    return (
      `"${raw}" is not part of this profile. ` +
      (homes.length
        ? `It is served by the "asc-${homes[0]}" MCP server:\n  ${registerCommand(homes[0])}`
        : `Run the server without a profile and with --domains=${known.domain} to reach it.`)
    );
  };

  /**
   * Exactly what `tools/list` answers.
   *
   * Named rather than inlined so the startup banner can count the same list the
   * client receives. It used to quote `toolCountFor`, which counts the
   * operations the profile MAPS — a number that is stable, easy to put in a
   * changelog, and wrong in every client: `asc__call` and `asc__describe` are
   * always served and mapped nowhere, StoreKit only loads with a bundle id, and
   * since #66 `--include-deprecated` adds tools too. Someone reading "24" and
   * seeing 29 has no way to tell whether they misconfigured something.
   */
  const servedTools = (): McpToolDefinition[] => {
    const onDemand = loadTool();
    const tools: McpToolDefinition[] = [
      ...META_TOOLS,
      ...PROXY_TOOLS,
      ...(onDemand ? [onDemand] : []),
      ...(reviewsAiWanted ? REVIEWS_AI_TOOLS : []),
      ...macroTools,
      ...registry.listTools(),
    ];

    if (storekit) {
      const storekitTools = config.readOnly
        ? STOREKIT_TOOLS.filter((t) => t.annotations?.readOnlyHint)
        : STOREKIT_TOOLS;
      tools.push(...storekitTools);
    }

    return tools;
  };

  toolCounts.set(server, () => servedTools().length);

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: servedTools() }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    let name = request.params.name;
    let args = (request.params.arguments ?? {}) as Record<string, unknown>;

    try {
      if (name === 'asc__describe' && selection) {
        const op = resolveProfileOperation(String(args.tool ?? ''));
        if (!op) throw new Error(unreachableMessage(String(args.tool ?? '')));
        const tool = toMcpTool(op, config.vendorNumber ? { 'filter[vendorNumber]': config.vendorNumber } : undefined);
        return textResult({
          tool: tool.name,
          operation: op.name,
          endpoint: `${op.method} ${op.path}`,
          description: tool.description,
          inputSchema: tool.inputSchema,
          readOnly: op.readOnly,
          ...(op.risk ? { risk: op.risk } : {}),
          loaded: Boolean(registry.get(tool.name)),
          callWith: `asc__call({ tool: "${tool.name}", arguments: { … } })`,
        });
      }

      if (name === 'asc__call' && selection) {
        const op = resolveProfileOperation(String(args.tool ?? ''));
        if (!op) throw new Error(unreachableMessage(String(args.tool ?? '')));
        if (!op.readOnly) {
          // The proxy is one tool standing in for hundreds, so a client can only
          // approve it wholesale. Writes keep their own name, where the client's
          // approval and Heimdall's typed confirmation both still mean something.
          const sub = subProfileOwning(selection.profile, op.name);
          throw new Error(
            `"${op.name}" changes data, and asc__call is read-only.\n` +
              (sub && !loadedSubs.has(sub)
                ? `Load its sub-profile first — asc__load({ sub_profile: "${sub.name}" }) — then call ` +
                  `${toolNameFor(op)} directly. If it still isn't in your tool list, your client ` +
                  `refreshes between turns: say it is ready and ask the user to repeat the request.`
                : `Call ${toolNameFor(op)} directly.`)
          );
        }
        // Load it as well: the call works either way, but a client that does
        // refresh gets the real tool with its own schema from here on.
        registry.loadOperations([op.name]);
        const sub = subProfileOwning(selection.profile, op.name);
        if (sub && !loadedSubs.has(sub)) {
          loadedSubs.add(sub);
          await server.sendToolListChanged();
        }
        name = toolNameFor(op);
        args = (args.arguments ?? {}) as Record<string, unknown>;
      }

      // Dry-run: registry writes return their would-send preview instead of
      // calling Apple, so confirmation would be noise. StoreKit tools bypass
      // the registry and WOULD hit Apple for real — block their writes hard.
      if (config.dryRun && isWriteTool(name) && STOREKIT_TOOL_NAMES.has(name)) {
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

      if (config.confirmWrites !== 'off' && !config.dryRun && isWriteTool(name)) {
        const op = registry.get(name);
        // Decided from the risk level alone, before the preview is built:
        // buildWritePreview resolves reference ids over the network, and a
        // `low` write under the default mode must not pay for a prompt it is
        // never going to show.
        const risk: RiskLevel = PRICING_TOOL_NAMES.has(name)
          ? 'revenue'
          : METADATA_I18N_WRITE_TOOLS.has(name)
            ? // One call rewrites the store listing in every language it names.
              // The raw tool behind it is `public` per operation; doing forty
              // at once is not forty times as reversible.
              'public'
            : ((op?.risk ?? (name.includes('extend_renewal_date') ? 'revenue' : 'low')) as RiskLevel);
        if (config.confirmWrites === 'all' || STRONG_CONFIRM_LEVELS.has(risk)) {
        const preview = PRICING_TOOL_NAMES.has(name)
          ? // Macro parameters are already human language — no lookups needed.
            { message: buildPricingPreview(args, name), strong: true }
          : op
          ? await buildWritePreview(name, op, args, config.credentials.keyId, http)
          : macroOffered(name)
          ? // Other write macros: no spec operation behind them, but their
            // arguments are already the human-readable facts, so the generic
            // preview renders them without any lookups.
            await buildWritePreview(
              name,
              { method: 'POST', path: `${name} (macro)`, risk: 'public' },
              args,
              config.credentials.keyId
            )
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
        const decision = await confirmWrite(confirmer, name, preview);
        if (!decision.allowed) {
          const text =
            decision.reason === 'no-elicitation'
              ? `"${name}" was blocked: it is a ${risk.toUpperCase()}-level write and this ` +
                `client cannot show a confirmation prompt (no elicitation support). ` +
                `Nothing was changed. Set ASC_CONFIRM_WRITES=0 (or --no-confirm) to rely on ` +
                `the client's own tool approval instead, or use --read-only.`
              : `"${name}" was cancelled — the write was not confirmed (${decision.reason}). ` +
                `Nothing was changed. If no confirmation prompt appeared on your screen, ` +
                `this client declared elicitation support but cannot actually show the ` +
                `form, and answered for you — the protocol reports that identically to a ` +
                `real refusal. In that case set ASC_CONFIRM_WRITES=0 (or --no-confirm) and ` +
                `let the client's own tool approval be the gate.`;
          return {
            content: [{ type: 'text' as const, text }],
            isError: true,
          };
        }
        }
      }

      let result: unknown;
      // What the size cap cut, kept so the reply can link to it.
      let uncapped: unknown;
      let structured = false;

      if (name === 'asc__load' && selection) {
        const wanted = String(args.sub_profile ?? '');
        const sub = unloadedSubs().find((s) => s.name === wanted);
        if (!sub) {
          const available = unloadedSubs().filter((s) => s.operations.length).map((s) => s.name);
          throw new Error(
            selection.profile.subProfiles.some((s) => s.name === wanted)
              ? `"${wanted}" is already loaded.`
              : `Unknown sub-profile "${wanted}" for "${selection.profile.name}". ` +
                (available.length ? `Available to load: ${available.join(', ')}.` : 'Everything is loaded.')
          );
        }
        const added = registry.loadOperations(sub.operations);
        loadedSubs.add(sub);
        await server.sendToolListChanged();

        // Measured in two clients: Claude Code hands the revised list to the
        // model inside the same turn, Codex does not — it refreshes between
        // turns and the model is left calling tools it cannot see. So the reply
        // carries the tools itself. A client that refreshed already loses
        // nothing; one that hasn't gets a usable answer instead of a dead end.
        const SHOWN = 25;
        result = {
          loaded: sub.name,
          description: sub.description,
          toolsAdded: added.length,
          tools: added.slice(0, SHOWN).map((name) => ({
            name,
            description: registry.get(name)?.description ?? '',
          })),
          ...(added.length > SHOWN ? { andMore: added.length - SHOWN } : {}),
          nextStep:
            `These tools are live on this server now. If they are not yet in your tool list, ` +
            `your client only refreshes it between turns — say the tools are ready and ask the ` +
            `user to repeat the request, rather than calling a tool you cannot see.`,
          ...(sub.manualTools.length
            ? { note: `${sub.manualTools.join(', ')} need a restart — they are not spec operations.` }
            : {}),
        };
      } else if (META_TOOL_NAMES.has(name)) {
        result = await executeMetaTool(name, args, {
          registry,
          http,
          tokens,
          readOnly: config.readOnly,
          loadedDomains,
          storekitEnabled: Boolean(storekit),
          macroOffered,
          includeDeprecated: config.includeDeprecated,
          profileReport,
          missingToolsHint: selection
            ? (ops) => {
                const own = ops
                  .map((op) => subProfileOwning(selection.profile, op.name)?.name)
                  .filter((n): n is string => Boolean(n));
                const homes = [
                  ...new Set(
                    ops.flatMap((op) => profilesForOperation(op.name)).filter((n) => n !== selection.profile.name)
                  ),
                ];
                const lines: string[] = [];
                if (own.length) {
                  lines.push(
                    `Some are in sub-profiles this server did not load ` +
                      `(${[...new Set(own)].join(', ')}) — restart it as ` +
                      `\`${selection.profile.name}\` to load all of them.`
                  );
                }
                if (homes.length) {
                  lines.push(
                    `The rest live on sibling MCP servers. Register the ones you need — ` +
                      `the command is the same everywhere:\n` +
                      homes.map((n) => `  asc-${n}  ->  npx -y @erayendes/asc-mcp ${n}`).join('\n') +
                      `\nFor example, in Claude Code:\n` +
                      homes.map((n) => `  ${registerCommand(n)}`).join('\n') +
                      `\nOn other clients (Codex, Antigravity, Claude Desktop, …) add the same ` +
                      `command/args to their config. Then restart your client.`
                  );
                }
                return lines.join('\n') || `Run the server without a profile to combine domains freely.`;
              }
            : undefined,
        });
      } else if (macroOffered(name) && METADATA_I18N_TOOL_NAMES.has(name) && !METADATA_I18N_WRITE_TOOLS.has(name)) {
        // The audit and the draft answer with data plus an instruction for the
        // host model, like reviews-ai — not the generic JSON dump below, which
        // would wrap a CallToolResult inside another one. Checked before the
        // general macro branch, which would otherwise take them first.
        return (await executeMetadataI18nTool(name, args, { http })) as CallToolResult;
      } else if (macroOffered(name)) {
        result = PRICING_TOOL_NAMES.has(name)
          ? await executePricingTool(name, args, { http, dryRun: config.dryRun })
          : ANALYTICS_TOOL_NAMES.has(name)
          ? await executeAnalyticsTool(name, args, { http })
          : PREFLIGHT_TOOL_NAMES.has(name)
          ? await executePreflightTool(name, args, { http })
          : METADATA_I18N_WRITE_TOOLS.has(name)
          ? await executeMetadataI18nTool(name, args, { http, dryRun: config.dryRun })
          : await executeScreenshotTool(name, args, { http, dryRun: config.dryRun });
        // Macro results are hand-built and small, so the read ones can also go
        // back as structuredContent against their declared outputSchema. Apple
        // payloads cannot: they are reshaped on the way out (stripApiNoise,
        // capResponseSize), so a schema taken from the spec would describe a
        // response the tool never sends.
        structured = READ_MACRO_NAMES.has(name);
      } else if (reviewsAiWanted && REVIEWS_AI_TOOL_NAMES.has(name)) {
        // Shaped as structuredContent (raw data) + content (instruction for
        // the host model), not the generic JSON-dump result below — return
        // it as-is rather than falling through to the shared finalizer.
        return await executeReviewsAiTool(name, args, { http, brand: config.reviewsBrand });
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
        if (process.env.ASC_REDACT_PII === '1') {
          result = redactPii(result);
        }
        // Before the size cap, so the marker cannot be the thing that gets cut.
        result = markUntrusted(result);
        uncapped = result;
        result = capResponseSize(result, maxResponseChars());
      }

      const text = truncateText(
        JSON.stringify(result ?? { ok: true }, null, 2),
        maxResponseChars()
      );
      // Only when something was actually lost. Comparing the two serialisations
      // catches both ways a response gets cut — rows dropped by capResponseSize
      // and characters dropped by truncateText — without either having to
      // report back that it fired.
      const fullText = JSON.stringify(uncapped ?? result ?? { ok: true }, null, 2);
      const link = fullText.length > text.length ? resources.store(name, fullText) : undefined;

      return {
        content: [
          {
            type: 'text' as const,
            text: link
              ? `${text}\n\nThe complete response (${Math.round(fullText.length / 1024)} KB) is ` +
                `kept as MCP resource ${link.uri}. Read it with resources/read — that returns ` +
                `the rest without re-running the query.`
              : text,
          },
          ...(link
            ? [
                {
                  type: 'resource_link' as const,
                  uri: link.uri,
                  name: link.name,
                  mimeType: link.mimeType,
                  description: `The untruncated result of ${name}.`,
                },
              ]
            : []),
        ],
        // The text block stays either way: a client that ignores structured
        // output must still see the whole answer.
        ...(structured && result !== null && typeof result === 'object' && !Array.isArray(result)
          ? { structuredContent: result as Record<string, unknown> }
          : {}),
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

/**
 * A server for a profile that no longer exists. It starts normally and serves
 * exactly one tool, which explains the split.
 *
 * Exiting with an error would be more honest to a script and useless to a
 * person: the message goes to stderr and all the user sees in their client is
 * `asc-user-management ✗ failed`. Starting instead means the next time they ask
 * for something that profile used to do, the agent calls the one tool available
 * and relays the answer as a sentence. It needs no credentials — a config error
 * would put us back where we started.
 */
export function createRemovedProfileServer(name: string): Server {
  const message = removedProfileMessage(name);
  if (!message) throw new Error(`"${name}" is not a removed profile.`);

  const server = new Server(
    { name: `asc-${name}`, version: VERSION },
    { capabilities: { tools: {} } }
  );

  const tool = {
    name: 'asc__profile_removed',
    description:
      `This MCP server is configured for the App Store Connect profile "${name}", which was ` +
      `removed and split into smaller profiles. It carries no other tools. Call this for the ` +
      `replacement list and the exact config change to tell the user about.`,
    inputSchema: { type: 'object' as const, properties: {} },
    annotations: { readOnlyHint: true },
  };

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: [tool] }));
  server.setRequestHandler(CallToolRequestSchema, async () => ({
    content: [{ type: 'text' as const, text: message }],
  }));

  return server;
}

/**
 * A failure the caller can act on without reading prose.
 *
 * Not `structuredContent`: MCP defines that field as the result matching the
 * tool's `outputSchema`, and five tools declare one — an error object there
 * would fail a validating client on a response that is correctly an error.
 * A JSON text block is what every successful generated call already returns,
 * so this is the same shape rather than a second convention.
 *
 * `summary` leads because a human reads the first line. Everything under it is
 * for the caller deciding what to do next: `retryable` says whether trying
 * again could work at all, `issues[].source` names the field or parameter
 * Apple rejected, and `suggestedAction` carries the status hint that used to be
 * glued onto the end of the message.
 */
export function formatError(err: unknown, toolName: string): string {
  // Status 0 is ours, not Apple's: a validation refusal, a wrong profile, a
  // read-only block. Those messages are hand-written multi-line guidance —
  // register commands, sub-profile names — and JSON would turn them into a
  // wall of \n escapes. Only a real HTTP failure gets the structured shape.
  if (!(err instanceof AscApiError) || !err.status) {
    return `${toolName} failed: ${err instanceof AscApiError ? err.summary : (err as Error).message}`;
  }
  return JSON.stringify(
    {
      error: {
        summary: `${toolName} failed: ${err.summary}`,
        operation: toolName,
        status: err.status || undefined,
        retryable: err.retryable,
        appleRequestId: err.requestId,
        suggestedAction: STATUS_HINTS[err.status],
        issues: err.errors.length ? err.errors : undefined,
      },
    },
    null,
    2
  );
}

export { SPEC_VERSION };
