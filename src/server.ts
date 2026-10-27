import { createRequire } from 'node:module';
import {
  CLIENT_CAPABILITIES_META_KEY,
  CLIENT_INFO_META_KEY,
  Server,
  type CallToolResult,
  type ClientCapabilities,
} from '@modelcontextprotocol/server';
import { TokenProvider } from './core/jwt.js';
import { AscHttpClient, hintFor } from './core/http.js';
import {
  ToolRegistry,
  toMcpTool,
  toolNameFor,
  type McpToolDefinition,
} from './core/registry.js';
import { AscApiError } from './core/errors.js';
import { ResourceStore } from './core/resources.js';
import { buildWritePreview, createWriteGate, resolveBodyRefs, withAppName } from './core/confirm.js';
import { DIALOG_FIRST_CLIENTS, dialogText, nativeConfirm, nativeConfirmAvailable, nativeConfirmFits } from './core/native-confirm.js';
import type { ServerConfig } from './core/config.js';
import { META_TOOLS, META_TOOL_NAMES, executeMetaTool } from './tools/meta.js';
import { MACRO_TOOLS } from './tools/catalog.js';
import { REVIEWS_AI_TOOLS, REVIEWS_AI_TOOL_NAMES, executeReviewsAiTool } from './tools/reviews-ai.js';
import {
  METADATA_I18N_TOOL_NAMES,
  METADATA_I18N_WRITE_TOOLS,
  executeMetadataI18nTool,
} from './tools/metadata-i18n.js';
import { STOREKIT_TOOLS, STOREKIT_TOOL_NAMES, StoreKitService } from './storekit/index.js';
import {
  PRICING_TOOL_NAMES,
  executePricingTool,
  buildPricingPreview,
} from './tools/pricing.js';
import { buildMediaPreview, executeMediaTool, MEDIA_TOOL_NAMES, mediaRisk } from './tools/screenshots.js';
import { PREFLIGHT_TOOL_NAMES, executePreflightTool } from './tools/preflight.js';
import { METADATA_TOOL_NAMES, executeMetadataTool } from './tools/metadata.js';
import { ACCOUNT_TOOL_NAMES, executeAccountTool } from './tools/account.js';
import { availablePrompts } from './prompts.js';
import { RELEASE_TOOL_NAMES, executeReleaseTool, releasePreviewArgs, releaseItemsPreviewArgs } from './tools/release.js';
import { TESTFLIGHT_TOOL_NAMES, executeTestflightTool, buildTestflightPreview } from './tools/testflight.js';
import { ANALYTICS_TOOL_NAMES, executeAnalyticsTool } from './tools/analytics.js';
import { CI_TOOL_NAMES, executeCiTool } from './tools/ci.js';
import { OPERATIONS, SPEC_VERSION } from './generated/operations.js';
import type { Operation } from './core/types.js';
import { PACKAGE, serverName } from './clients.js';
import { ASK_BY_DEFAULT, STRONG_CONFIRM_LEVELS, riskByBody, type RiskLevel } from './core/risk.js';
import {
  CORE_PROFILE,
  manualToolsFor,
  operationsFor,
  profilesForOperation,
  registerCommand,
  resolveProfile,
  resolveSelection,
  subProfileOwning,
  toolCountFor,
  TOKENS_PER_TOOL,
  unknownProfileMessage,
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
 * Added to a profile server that does not carry core. Without it the model
 * looks for `apps__list` here, finds a tool list with no way to turn an app
 * name into an id, and concludes the server cannot do the task.
 */
export const CORE_POINTER =
  'App lookup (apps__list), tool search (asc__search_tools) and the media tools ' +
  '(media__*) live in the ASC-Core server, not here.';

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

export function createServer(config: ServerConfig, selection: ProfileSelection): Server {
  const tokens = new TokenProvider(config.credentials);
  // ASC_BASE_URL redirects everything to a local fixture server for testing;
  // host-pinning then pins to that origin instead of Apple's.
  const http = new AscHttpClient(tokens, { baseUrl: config.baseUrl, rateLimit: config.rateLimit });

  const isCore = selection.profile.name === CORE_PROFILE;
  /**
   * The core profile's tools — app lookup, the meta tools, the media macros.
   * Served by ASC-Core itself, and folded into a profile server started with
   * `--with-core`, for a channel that can run only one process.
   */
  const core = isCore || config.withCore ? resolveSelection(CORE_PROFILE) : undefined;

  // "How do I reach that tool" answers name the sibling MCP server.
  const missingToolHint = (op: Operation): string | undefined => {
        const ownSub = subProfileOwning(selection.profile, op.name);
        if (ownSub) {
          // Same server, unselected sub-profile: the remedy is a startup
          // argument here, not a different server.
          return (
            `It belongs to this profile's "${ownSub.name}" sub-profile, which this server ` +
            `did not load. Read it now through asc__call. For the tool itself, with the ` +
            `user's yes run \`${registerWith(ownSub)}\` and ask them to restart their MCP client.`
          );
        }
        const homes = profilesForOperation(op.name).filter((n) => n !== selection.profile.name);
        return homes.length
          ? `It is served by the "${serverName(homes[0])}" MCP server. Register it with:\n` +
            `  ${registerCommand(homes[0])}\n` +
            `(or add the same entry to your MCP client config), then restart your client.`
          : undefined;
      };

  const registry = new ToolRegistry({
    // A profile carries an explicit, hand-curated list, plus core's when it
    // rides along.
    operations: [...operationsFor(selection), ...(core && !isCore ? operationsFor(core) : [])],
    readOnly: config.readOnly,
    paramDefaults: config.vendorNumber
      ? { 'filter[vendorNumber]': config.vendorNumber }
      : undefined,
    missingToolHint,
    dryRun: config.dryRun,
  });

  const loadedDomains = registry.loadedDomains();

  const loadedSubs = new Set(selection.subProfiles);
  const unloadedSubs = (): SubProfile[] => selection.profile.subProfiles.filter((s) => s.name && !loadedSubs.has(s));
  /**
   * The command that makes `sub` part of this server. There is no way to add
   * it mid-session that works everywhere: a server may revise its tool list,
   * but some clients never hand the revision to the model (the Claude desktop
   * app's Code tab among them). Rewriting the config and restarting does.
   */
  const registerWith = (sub: SubProfile): string =>
    `npx -y ${PACKAGE} register ${selection.profile.name}:` +
    // What the user registered first, in their order, then what was added.
    [...new Set([...loadedSubs, sub])].map((s) => s.name).join(',');

  /** What this server is, in the unit a user configures: profiles. */
  const profileReport = (): Record<string, unknown> => ({
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
                `Some sub-profiles are not loaded. Reads work through asc__call. For the ` +
                `tools themselves, register \`npx -y ${PACKAGE} register ${selection.profile.name}\` ` +
                `and restart the client.`,
            }
          : {}),
      });

  // Which hand-written tool families this selection carries. The curation
  // sheet decides — a sub-profile listing `storekit__*` is what turns them on,
  // so unchecking that sub-profile turns them off with no second switch. Core's
  // rows count when core rides along; leaving them out here is how a core
  // macro ships unreachable while the sheet says otherwise.
  const manualTools = new Set([...manualToolsFor(selection), ...(core ? manualToolsFor(core) : [])]);

  /**
   * The meta tools. Search and discovery answer for the whole catalogue, so
   * they live in core and are not repeated in every profile server; each
   * server keeps `asc__status`, which reports on that server itself. Filtered
   * from one list, so core cannot register `asc__status` twice.
   */
  const metaTools = META_TOOLS.filter(
    (t) => manualTools.has(t.name) || t.name === 'asc__status'
  );
  const metaOffered = (name: string): boolean => metaTools.some((t) => t.name === name);

  /**
   * asc__call and asc__describe stand in for the sub-profiles a server left
   * out, so they exist only where something was left out. On a full profile
   * every tool they could reach is already in the list.
   */
  const proxyOffered = Boolean(selection.partial);
  const wantsFamily = (prefix: string): boolean =>
    [...manualTools].some((t) => t.startsWith(prefix));

  // StoreKit tools come with the profile that opts in (monetization's storekit
  // sub-profile). Apple scopes each call to one app, which the service looks
  // up from the account's app list rather than needing configured.
  const storekitWanted = wantsFamily('storekit__');
  let storekit: StoreKitService | undefined;
  let storekitError: string | undefined;
  if (storekitWanted) {
    try {
      storekit = new StoreKitService(config, http);
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
  const macroTools = MACRO_TOOLS.filter(
    (t) =>
      manualTools.has(t.name) &&
      (!config.readOnly || t.annotations?.readOnlyHint === true)
  );
  const macroOffered = (name: string): boolean => macroTools.some((t) => t.name === name);

  /** The macros that declare an outputSchema, so their result can be sent structured. */
  const READ_MACRO_NAMES = new Set(
    MACRO_TOOLS.filter((t) => t.outputSchema).map((t) => t.name)
  );

  const gate = createWriteGate();

  const server = new Server(
    { name: serverName(selection.profile.name), version: VERSION },
    {
      // listChanged: the tool list can grow mid-session when asc__call loads
      // the operation it proxied, and a resource appears whenever a response
      // is too big to send whole.
      capabilities: {
        tools: { listChanged: true },
        resources: { listChanged: true },
        prompts: {},
      },
      instructions: !core ? `${SERVER_INSTRUCTIONS}\n\n${CORE_POINTER}` : SERVER_INSTRUCTIONS,
      // A confirmation's state comes back through the client: forged, expired
      // or tampered state is refused before the handler ever sees it.
      requestState: { verify: gate.verify },
    }
  );

  // Overflow from responses the size cap had to cut. Registered here rather
  // than lazily so a client that lists resources at startup gets an empty
  // list instead of "method not found".
  const resources = new ResourceStore();
  server.setRequestHandler('resources/list', async () => ({
    resources: resources.list().map(({ uri, name, mimeType }) => ({
      uri,
      name,
      mimeType,
      description: 'The complete response of an earlier call, kept because it exceeded the size cap.',
    })),
  }));
  server.setRequestHandler('resources/read', async (request) => {
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
   * per call rather than once, so a tool added after startup can never be
   * waved through on a set captured at boot.
   */
  const isWriteTool = (name: string): boolean => {
    const op = registry.get(name);
    if (op) return !op.readOnly;
    const macro = MACRO_TOOLS.find((t) => t.name === name);
    if (macro) return macro.annotations?.readOnlyHint !== true;
    if (STOREKIT_TOOL_NAMES.has(name) && storekit && !config.readOnly) {
      return STOREKIT_TOOLS.find((t) => t.name === name)?.annotations?.readOnlyHint !== true;
    }
    return false;
  };

  /**
   * Every operation this profile owns, whether its sub-profile is loaded or
   * not — the reachable set for the proxy below. Its own profile only: core's
   * tools and a sibling profile's are another server's to serve.
   */
  const profileOperations = (): string[] => [...new Set(selection.profile.subProfiles.flatMap((s) => s.operations))];

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
   * MCP lets a server revise its tool list, but the spec says nothing about
   * when a client hands the revised list to the model. Measured: Claude Code in
   * a terminal does it inside the turn, Codex only between turns, and Claude
   * Code in the desktop app's Code tab not at all — the model is left naming
   * tools it cannot call and the work stalls. That is why `asc__load` is gone.
   *
   * These two tools sidestep the question entirely. They are in the list from
   * the start, so any operation this profile owns is one call away on any
   * client, in the same turn, with no notification involved. asc__call routes
   * through the identical guard as a native call — read-only mode, body
   * validation, dry-run, risk level, typed confirmation — and loads the
   * operation on the way, so it also becomes a native tool for whoever refreshes.
   */
  const PROXY_TOOLS: McpToolDefinition[] = proxyOffered
    ? [
        {
          name: 'asc__describe',
          description:
            `Show the exact input schema of any tool this profile owns, including ones in ` +
            `sub-profiles this server did not load. Use it before asc__call to build valid ` +
            `arguments.`,
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
            `whenever a tool of this profile is named that you cannot see. Get its arguments ` +
            `from asc__describe first. Read-only: to change something, the tool itself has to ` +
            `be registered — with the user's yes run \`npx -y ${PACKAGE} register ` +
            `${selection.profile.name}\` and ask them to restart their MCP client, so the ` +
            `confirmation prompt reaches the user.`,
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
      return `Unknown tool "${raw}". Use asc__search_tools (on ASC-Core) to find the right name.`;
    }
    const homes = profilesForOperation(known.name).filter((n) => n !== selection.profile.name);
    return (
      `"${raw}" is not part of this profile.` +
      (homes.length ? ` It is served by the "${serverName(homes[0])}" MCP server:\n  ${registerCommand(homes[0])}` : '')
    );
  };

  /**
   * Exactly what `tools/list` answers.
   *
   * Named rather than inlined so the startup banner can count the same list the
   * client receives. It used to quote `toolCountFor`, which counts the
   * operations the profile MAPS — a number that is stable, easy to put in a
   * changelog, and wrong in every client: `asc__call` and `asc__describe` are
   * served and mapped nowhere, and StoreKit only loads with a bundle id. Someone reading "24" and
   * seeing 29 has no way to tell whether they misconfigured something.
   */
  const servedTools = (): McpToolDefinition[] => {
    const tools: McpToolDefinition[] = [
      ...metaTools,
      ...PROXY_TOOLS,
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

  /**
   * Workflows, offered only where every tool they name is served. Built from
   * the live tool list rather than from the profile, so `--read-only` and a
   * narrowed sub-profile both remove a prompt the same way its tools went.
   */
  const promptsFor = () => availablePrompts(new Set(servedTools().map((t) => t.name)));

  server.setRequestHandler('prompts/list', async () => ({
    prompts: promptsFor().map(({ name, description, arguments: args }) => ({
      name,
      description,
      arguments: args,
    })),
  }));

  server.setRequestHandler('prompts/get', async (request) => {
    const wanted = request.params.name;
    const prompt = promptsFor().find((p) => p.name === wanted);
    if (!prompt) {
      const offered = promptsFor().map((p) => p.name);
      throw new Error(
        `Unknown prompt "${wanted}". This server offers: ${offered.join(', ') || 'none — its tools are in another profile'}.`
      );
    }
    const args = (request.params.arguments ?? {}) as Record<string, string>;
    const missing = prompt.arguments.filter((a) => a.required && !String(args[a.name] ?? '').trim());
    if (missing.length) {
      throw new Error(`"${wanted}" needs ${missing.map((a) => a.name).join(', ')}.`);
    }
    return {
      description: prompt.description,
      messages: [
        { role: 'user' as const, content: { type: 'text' as const, text: prompt.body(args) } },
      ],
    };
  });

  server.setRequestHandler('tools/list', async () => ({ tools: servedTools() }));

  server.setRequestHandler('tools/call', async (request, ctx) => {
    let name = request.params.name;
    let args = (request.params.arguments ?? {}) as Record<string, unknown>;

    try {
      // Refused by name, not left to fall through: the generic "unknown tool"
      // would send the model looking for a spelling mistake.
      if ((name === 'asc__describe' || name === 'asc__call') && !proxyOffered) {
        throw new Error(
          `${name} is not offered here: this server loads every sub-profile of ` +
            `"${selection.profile.name}", so call the tool itself. Tools of other profiles ` +
            `are served by their own ASC server.`
        );
      }
      if (META_TOOL_NAMES.has(name) && !metaOffered(name)) {
        throw new Error(
          `${name} is served by the ASC-Core server, not this one. If it is in your tool ` +
            `list, call it there; otherwise, with the user's yes, run ` +
            `\`npx -y ${PACKAGE} register ${CORE_PROFILE}\` and ask them to restart their MCP client.`
        );
      }
      if (MACRO_TOOLS.some((tool) => tool.name === name) && !macroOffered(name)) {
        throw new Error(`Unknown tool "${name}": this server does not offer it. Nothing was changed.`);
      }

      if (name === 'asc__describe') {
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

      if (name === 'asc__call') {
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
                ? `Its sub-profile "${sub.name}" is not loaded on this server. With the user's ` +
                  `yes, run \`${registerWith(sub)}\` and ask them to restart their MCP client, ` +
                  `then call ${toolNameFor(op)} directly.`
                : `Call ${toolNameFor(op)} directly.`)
          );
        }
        // Load it as well: the call works either way, but a client that does
        // refresh gets the real tool with its own schema from here on.
        if (registry.loadOperations([op.name]).length) await server.sendToolListChanged();
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

      let approvedPlanFingerprint: string | undefined;
      if ((config.confirmWrites !== 'off' || RELEASE_TOOL_NAMES.has(name)) && !config.dryRun && isWriteTool(name)) {
        const op = registry.get(name);
        // Decided from the risk level alone, before the preview is built:
        // buildWritePreview resolves reference ids over the network, and a
        // `low` write under the default mode must not pay for a prompt it is
        // never going to show.
        const bodyRisk = riskByBody(name, args);
        const risk: RiskLevel = bodyRisk
          ? bodyRisk
          : PRICING_TOOL_NAMES.has(name)
          ? 'revenue'
          : MEDIA_TOOL_NAMES.has(name)
            ? mediaRisk(name, args)
          : RELEASE_TOOL_NAMES.has(name) || TESTFLIGHT_TOOL_NAMES.has(name)
            ? // A macro that moves a build or version toward users carries
              // the same release risk as its raw calls.
              'release'
            : METADATA_I18N_WRITE_TOOLS.has(name)
            ? // One call rewrites the store listing in every language it names.
              // The raw tool behind it is `public` per operation; doing forty
              // at once is not forty times as reversible.
              'public'
            : ((op?.risk ??
                (name.includes('extend_renewal_date')
                  ? 'revenue'
                  : // A write macro with no spec operation behind it (the
                    // screenshot upload) changes what customers see.
                    macroOffered(name)
                    ? 'public'
                    : 'low')) as RiskLevel);
        if (
          config.confirmWrites === 'all' ||
          STRONG_CONFIRM_LEVELS.has(risk) ||
          ASK_BY_DEFAULT.has(name)
        ) {
        // Fingerprinted from the request as sent: that is what the client
        // repeats on the retry, and what the user's answer has to match.
        const decision = gate.settle(ctx, request.params.name, request.params.arguments);
        if (!decision) {
          // A 2026-07-28 client declares its capabilities on every request, a
          // 2025 client once at initialize. (The SDK types the envelope as `{}`.)
          const envelope = ctx.mcpReq.envelope as Record<string, ClientCapabilities | undefined> | undefined;
          const caps = envelope?.[CLIENT_CAPABILITIES_META_KEY] ?? server.getClientCapabilities();
          const elicitDeclared = Boolean(caps?.elicitation?.form);
          const info = (ctx.mcpReq.envelope as Record<string, { name?: string } | undefined> | undefined)?.[CLIENT_INFO_META_KEY] ?? server.getClientVersion();
          const dialogAvailable = config.nativeConfirm === true && nativeConfirmAvailable();
          // Some clients declare forms they never show (core/native-confirm.ts);
          // there the dialog goes first. Self-reported, but it only ever trades
          // a form for a dialog the agent can answer even less.
          const dialogFirst = dialogAvailable && DIALOG_FIRST_CLIENTS.has(info?.name ?? '');
          const canElicit = elicitDeclared && !dialogFirst;
          // No prompt from the client: on macOS, ask in a dialog of our own,
          // which the agent can neither see nor answer (core/native-confirm.ts).
          const canDialog = !canElicit && dialogAvailable;
          // No way to ask at all. The user asked for a guard, so say it can't
          // run here rather than proceed under a guard that stopped guarding.
          // Worded for the agent to relay, not to act on: the last version
          // named the env var, and an agent went to edit the user's config.
          const blocked = {
            content: [
              {
                type: 'text' as const,
                text:
                  `"${name}" was blocked: it is a ${risk.toUpperCase()}-level write and no ` +
                  `confirmation prompt could be shown to the user here. Nothing was changed. ` +
                  `A yes in chat does not count, because this server cannot see the chat. Tell ` +
                  (RELEASE_TOOL_NAMES.has(name)
                    ? `the user to use a client with confirmation forms or enable native confirmation on macOS, then retry and approve the item list; they can also submit in App Store Connect. Release tools always require this confirmation. Do not edit `
                    : `the user to make this change in App Store Connect, or to change Heimdall's confirmation setting themselves (docs/CONFIGURATION_en.md). Do not edit `) +
                  `client config, set ASC_CONFIRM_WRITES, or call Apple another way.`,
              },
            ],
            isError: true,
          };
          if (!canElicit && !canDialog) return blocked;
          // What the prompt shows; the fingerprint stays on the arguments as sent.
          const mediaPreview = MEDIA_TOOL_NAMES.has(name) ? await buildMediaPreview(name, args, http) : undefined;
          const shownWithPlan = mediaPreview
            ? { ...args, planFingerprint: mediaPreview.planFingerprint }
            : op
            ? args
            : RELEASE_TOOL_NAMES.has(name)
              ? await (name === 'release__submit_items' ? releaseItemsPreviewArgs(args, http) : releasePreviewArgs(args, http))
              : await withAppName(args, http);
          const planFingerprint = typeof shownWithPlan.planFingerprint === 'string' ? shownWithPlan.planFingerprint : undefined;
          const { planFingerprint: _internalPlanFingerprint, ...shown } = shownWithPlan;
          const preview = PRICING_TOOL_NAMES.has(name)
            ? // Macro parameters are already human language — no lookups needed.
              { message: buildPricingPreview(shown, name), strong: true }
            : TESTFLIGHT_TOOL_NAMES.has(name)
            ? // The generic macro preview drops the group list and calls this PUBLIC.
              { message: buildTestflightPreview(shown), strong: true }
            : mediaPreview
            ? mediaPreview
            : op
            ? await buildWritePreview(name, bodyRisk ? { ...op, risk: bodyRisk } : op, args, config.credentials.keyId, http)
            : macroOffered(name)
            ? // Macros carry readable arguments; review item references still
              // use the same bounded name resolvers as raw writes.
              await buildWritePreview(
                name,
                { method: 'POST', path: `${name} (macro)`, risk },
                shown,
                config.credentials.keyId,
                http
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
                shown
              );
          if (canElicit) return gate.ask(ctx, request.params.name, request.params.arguments, preview, planFingerprint);
          // The tool's own summary, up to the first full stop or dash, says what will happen.
          const what = servedTools()
            .find((t) => t.name === name)
            ?.description?.split(/\.\s| — /)[0]
            ?.replace(/ in one call$/, '')
            ?.replace(/\.$/, '');
          const dialog = dialogText(what, preview.message);
          if (MEDIA_TOOL_NAMES.has(name) && !nativeConfirmFits(dialog)) {
            // Not to a dialog-first client's form: it would be declined unseen.
            if (elicitDeclared && !dialogFirst) return gate.ask(ctx, request.params.name, request.params.arguments, preview, planFingerprint);
            return { content: [{ type: 'text' as const, text: `"${name}" was blocked: the full media preview exceeds the native macOS dialog limit. Use a client that can show the full elicitation prompt, or send fewer items. Nothing was changed.` }], isError: true };
          }
          const answer = await nativeConfirm(dialog, ctx.mcpReq.signal);
          // No GUI session (SSH, a headless Mac): the form it declared is the next best.
          if (answer === 'unavailable' && elicitDeclared) return gate.ask(ctx, request.params.name, request.params.arguments, preview, planFingerprint);
          if (answer === 'unavailable') return blocked;
          if (answer !== 'approved') {
            return {
              content: [
                {
                  type: 'text' as const,
                  text:
                    `"${name}" was not confirmed: the user pressed Don't Allow in the macOS ` +
                    `confirmation dialog. Nothing was changed.`,
                },
              ],
              isError: true,
            };
          }
          approvedPlanFingerprint = planFingerprint;
          // Approved in the dialog: fall through and run the write.
        }
        if (decision && !decision.allowed) {
          const text = decision.stale
            ? `"${name}" was refused: ${decision.reason}.`
            : `"${name}" was cancelled — the write was not confirmed (${decision.reason}). ` +
              `Nothing was changed. If no confirmation prompt appeared on your screen, ` +
              `this client declared elicitation support but cannot actually show the ` +
              `form, and answered for you — the protocol reports that identically to a ` +
              `real refusal. ` +
              (RELEASE_TOOL_NAMES.has(name)
                ? `Use a client that can display Heimdall's confirmation form, or a macOS client with native confirmation enabled, then retry and approve the displayed item list. Release tools always require this confirmation. You can also submit in App Store Connect.`
                : `In that case set ASC_CONFIRM_WRITES=0 (or --no-confirm) and let the client's own tool approval be the gate.`);
          return {
            content: [{ type: 'text' as const, text }],
            isError: true,
          };
        }
        if (decision?.allowed) approvedPlanFingerprint = decision.planFingerprint;
        }
      }

      let result: unknown;
      // What the size cap cut, kept so the reply can link to it.
      let uncapped: unknown;
      let structured = false;

      if (META_TOOL_NAMES.has(name)) {
        result = await executeMetaTool(name, args, {
          registry,
          http,
          tokens,
          readOnly: config.readOnly,
          loadedDomains,
          storekitEnabled: Boolean(storekit),
          macroOffered,
          profileReport,
          ownProfile: selection.profile.name,
          // Core answers for the whole catalogue: it is the one server every
          // setup registers, so "what else is there" is its question to answer.
          catalogue: Boolean(core),
          missingToolsHint: (ops) => {
                const own = ops
                  .map((op) => subProfileOwning(selection.profile, op.name))
                  .filter((s): s is SubProfile => Boolean(s) && !loadedSubs.has(s!));
                // profile:sub, so the command registers the slice that has the
                // tool rather than a whole profile.
                const specs = [
                  ...new Set(
                    ops
                      .filter((op) => !subProfileOwning(selection.profile, op.name))
                      .map((op) => {
                        const home = profilesForOperation(op.name)[0];
                        const sub = home ? subProfileOwning(resolveProfile(home)!, op.name) : undefined;
                        return home ? (sub?.name ? `${home}:${sub.name}` : home) : undefined;
                      })
                      .filter((s): s is string => Boolean(s))
                  ),
                ];
                const lines: string[] = [];
                if (own.length) {
                  lines.push(
                    `Some are in this profile's sub-profiles this server did not load ` +
                      `(${[...new Set(own.map((s) => s.name))].join(', ')}): read them through ` +
                      `asc__call, or register \`npx -y ${PACKAGE} register ${selection.profile.name}\` ` +
                      `for the tools themselves.`
                  );
                }
                if (specs.length) {
                  lines.push(
                    `The rest are served by other ASC servers ` +
                      `(${[...new Set(specs.map((s) => serverName(s)))].join(', ')}). If one is in ` +
                      `your tool list, call it there; otherwise, with the user's yes, run ` +
                      `\`npx -y ${PACKAGE} register ${specs.join(' ')}\` and ask them to restart ` +
                      `their MCP client.`
                  );
                }
                return lines.join('\n');
              },
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
          : CI_TOOL_NAMES.has(name)
          ? await executeCiTool(name, args, { http })
          : PREFLIGHT_TOOL_NAMES.has(name)
          ? await executePreflightTool(name, args, { http })
          : METADATA_TOOL_NAMES.has(name)
          ? await executeMetadataTool(name, args, { http })
          : ACCOUNT_TOOL_NAMES.has(name)
          ? await executeAccountTool(name, args, { http })
          : METADATA_I18N_WRITE_TOOLS.has(name)
          ? await executeMetadataI18nTool(name, args, { http, dryRun: config.dryRun })
          : RELEASE_TOOL_NAMES.has(name)
          ? await executeReleaseTool(name, args, { http, dryRun: config.dryRun, approvedPlanFingerprint,
              requireApprovedPlan: !config.dryRun })
          : TESTFLIGHT_TOOL_NAMES.has(name)
          ? await executeTestflightTool(name, args, { http, dryRun: config.dryRun })
          : await executeMediaTool(name, args, { http, dryRun: config.dryRun, approvedPlanFingerprint });
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
              'App Store Server API tools are unavailable: this profile does not include them.'
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
 * A server for a profile argument that does not resolve — a name from an
 * earlier version (`app-info`) or a typo. It starts normally and serves exactly
 * one tool, which says to run setup and lists the current profiles.
 *
 * Exiting with an error would be more honest to a script and useless to a
 * person: the message goes to stderr and all the user sees in their client is
 * `ASC-AppInfo ✗ failed`. Starting instead means the next time they ask for
 * something that profile used to do, the agent calls the one tool available
 * and relays the answer as a sentence. It needs no credentials — a config error
 * would put us back where we started.
 */
export function createUnknownProfileServer(spec: string, reason?: string): Server {
  const message = unknownProfileMessage(spec, reason);

  const server = new Server(
    { name: spec ? serverName(spec) : 'app-store-connect-mcp', version: VERSION },
    { capabilities: { tools: {} } }
  );

  const tool = {
    name: 'asc__profile_unknown',
    description:
      (spec
        ? `This MCP server is configured for the App Store Connect profile "${spec}", which does ` +
          `not exist — renamed, removed or mistyped.`
        : `This MCP server is configured with no App Store Connect profile, which Heimdall no longer serves.`) +
      ` It carries no other tools. Call this for the current profiles and the fix to tell the user about.`,
    inputSchema: { type: 'object' as const, properties: {} },
    annotations: { readOnlyHint: true },
  };

  server.setRequestHandler('tools/list', async () => ({ tools: [tool] }));
  server.setRequestHandler('tools/call', async () => ({
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
        suggestedAction: hintFor(err.status, err.errors),
        issues: err.errors.length ? err.errors : undefined,
      },
    },
    null,
    2
  );
}

export { SPEC_VERSION };
