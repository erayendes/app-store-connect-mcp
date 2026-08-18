/**
 * Server introspection tools. These never touch Apple's API except for the
 * explicit connection check.
 */
import type { McpToolDefinition } from '../core/registry.js';
import { ALL_DOMAINS, ToolRegistry } from '../core/registry.js';
import { DOMAIN_DESCRIPTIONS } from '../generated/domain-info.js';
import { OPERATIONS, SPEC_VERSION } from '../generated/operations.js';
import { STOREKIT_TOOLS } from '../storekit/index.js';
import { PRICING_TOOLS } from './pricing.js';
import { SCREENSHOT_TOOLS } from './screenshots.js';
import type { AscHttpClient } from '../core/http.js';
import type { TokenProvider } from '../core/jwt.js';

export const META_TOOLS: McpToolDefinition[] = [
  {
    name: 'asc__discover_domains',
    description:
      'List what this server can reach and what it cannot: in profile mode the profiles ' +
      'and sub-profiles that exist, which are loaded here, and how many tools each holds; ' +
      'otherwise the tool domains. Use this when a capability you need is not in the tool list.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'asc__search_tools',
    description:
      'Search all App Store Connect operations by keyword, including domains that are ' +
      'not currently loaded. Returns matching tool names, their domain, and the ' +
      'underlying endpoint. Search in English: tool names and descriptions are ' +
      'generated from Apple’s English spec, so translate the goal before searching.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'English keywords to match against tool names, descriptions and paths. ' +
            'A query in another language matches nothing.',
        },
        limit: { type: 'number', description: 'Maximum results (default 25).' },
      },
      required: ['query'],
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'asc__status',
    description:
      'Report server configuration, spec version, loaded domains, JWT token state ' +
      'and remaining API rate limit. Also verifies credentials against Apple with a ' +
      'single lightweight request.',
    inputSchema: {
      type: 'object',
      properties: {
        check_connection: {
          type: 'boolean',
          description: 'Issue one real API call to verify credentials (default true).',
        },
        check_expirations: {
          type: 'boolean',
          description:
            'Also list signing certificates and provisioning profiles expiring within 30 days ' +
            '(two extra API calls; default false).',
        },
      },
    },
    annotations: { readOnlyHint: true },
  },
];

/** Punctuation-aware split; a typed question arrives with "?" and "'" attached. */
const WORDS = /[\s,.:;!?"'’()[\]]+/;

/**
 * `'İ'.toLowerCase()` is `i` followed by U+0307 COMBINING DOT ABOVE, not `i` —
 * Unicode keeps the marks apart because `i` already carries a dot. A word typed
 * on a Turkish keyboard therefore stops matching the catalogue's lowercase
 * text. Dropping the mark is safe: the catalogue is Apple's English spec and
 * contains no combining marks at all.
 */
const COMBINING_DOT_ABOVE = /̇/g;

const tokenize = (query: string): string[] => [
  ...new Set(query.toLowerCase().replace(COMBINING_DOT_ABOVE, '').split(WORDS).filter(Boolean)),
];

/**
 * A token this short is a fragment of something longer far more often than it
 * is a word: `de` is inside `delete`, `le` inside `role`, `l` inside almost
 * everything. Scoring those as hits let French stopwords outscore real terms —
 * "le de l" ranked 390 operations, none of them about anything.
 *
 * Short tokens are not dropped, because some are the whole query a user means:
 * `ci` is Xcode Cloud. They just have to appear as a word of their own.
 */
const SHORT_TOKEN = 3;

const escapeRegExp = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Build the test for one token once, rather than per operation — a search
 * walks every operation in the catalogue, and compiling the same pattern 982
 * times is the kind of waste that only shows up under a profiler.
 */
function tokenTest(token: string): (haystack: string) => boolean {
  if (token.length >= SHORT_TOKEN) return (haystack) => haystack.includes(token);
  const word = new RegExp(`(?:^|[^a-z0-9])${escapeRegExp(token)}(?:[^a-z0-9]|$)`);
  return (haystack) => word.test(haystack);
}

/**
 * Keyword search over every operation (loaded or not). Extracted from the
 * asc__search_tools handler so intent coverage is unit-testable — the intent
 * regression suite in tests/search-intents.test.ts runs against this.
 *
 * Multi-word queries are matched token by token and ranked by how many tokens
 * hit: the old whole-phrase `includes` returned nothing for natural queries
 * like "change subscription price territory", because no description contains
 * that exact phrase. Single-word queries behave as before.
 *
 * Matching is literal, and the catalogue is English, so a query in another
 * language finds nothing. That is deliberate. It was briefly not: a hand-written
 * Turkish-to-English word list sat here and translated a hundred or so nouns
 * before matching. It worked, and it was the wrong place to solve the problem —
 * every further language meant another hundred hand-typed rows that go stale
 * whenever Apple adds resources, and the caller is a language model that already
 * speaks all of them. The tool description now asks for English and an empty
 * result says so; translation belongs to the client, which is better at it than
 * any table we would maintain.
 *
 * Deprecated operations are excluded unless the server was started with
 * `--include-deprecated`, because the registry refuses to load them either.
 * Returning them looks helpful and is not: the agent reads "deprecated" as
 * "works but discouraged", calls the tool, and gets "no such tool". Measured
 * on "create leaderboard" — two of the top five were unreachable.
 */
/**
 * How much of a tool's name the query did not ask about — the tie-break.
 *
 * Scoring counts how many query tokens land somewhere in name, description and
 * path, so every sibling of a resource ties on a query about the resource:
 * "Create a Game Center achievement" scores full marks on
 * `game_center_achievements_v2.create` and on the achievement's images,
 * localizations and releases alike. Ties then broke alphabetically, which put
 * `game_center_achievement_images.create` first and the tool the query was
 * about fourth — an ordering with no meaning behind it, and one that no
 * description rewrite can beat, because the competitors match the same words
 * for the same good reason.
 *
 * Equal coverage of the query is settled here by which name carries the least
 * material the query never mentioned. `achievements_v2.create` has one such
 * part; `achievement_localizations.create` has two. The query said achievement,
 * not achievement localization, and the shorter name is the more direct answer.
 *
 * Measured on the 265-phrasing corpus: 125 queries found their tool in the top
 * three before this and 136 after, with no query losing one it had.
 */
function unaskedNameParts(name: string, tokens: string[]): number {
  return name
    .toLowerCase()
    .split(/[._]/)
    .filter((part) => !tokens.some((t) => part.includes(t) || t.includes(part))).length;
}

export function searchOperations(
  query: string,
  includeDeprecated = false
): Array<(typeof OPERATIONS)[number]> {
  const tokens = tokenize(query);
  if (!tokens.length) return [];

  const tests = tokens.map(tokenTest);
  const pool = includeDeprecated ? OPERATIONS : OPERATIONS.filter((op) => !op.deprecated);
  const scored = pool
    .map((op) => {
      const haystack = `${op.name} ${op.description} ${op.path}`.toLowerCase();
      const score = tests.reduce((n, hit) => n + (hit(haystack) ? 1 : 0), 0);
      return { op, score, extra: unaskedNameParts(op.name, tokens) };
    })
    .filter((s) => s.score > 0 && s.score >= Math.ceil(tokens.length / 2));

  return scored
    .sort(
      (a, b) => b.score - a.score || a.extra - b.extra || a.op.name.localeCompare(b.op.name)
    )
    .map((s) => s.op);
}

/**
 * The same token rule `searchOperations` uses, for the tool lists that are not
 * generated from the spec. They used to be matched with a whole-phrase
 * `includes`, which meant a real question never found them: "change
 * subscription price" is not a substring of any description.
 */
function matchByToken<T extends { name: string; description: string }>(
  query: string,
  tools: readonly T[]
): T[] {
  const tokens = tokenize(query);
  if (!tokens.length) return [];
  const tests = tokens.map(tokenTest);
  const need = Math.ceil(tokens.length / 2);
  return tools
    .map((t) => {
      const haystack = `${t.name} ${t.description}`.toLowerCase();
      return { t, score: tests.reduce((n, hit) => n + (hit(haystack) ? 1 : 0), 0) };
    })
    .filter((s) => s.score >= need)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.t);
}

/** Days ahead that counts as "expiring soon" for certificates and profiles. */
const EXPIRY_WINDOW_DAYS = 30;

/**
 * Summarises expirations from certificates__list / profiles__list responses.
 * Pure — exported for tests.
 */
export function summarizeExpirations(
  certificates: any[],
  profiles: any[],
  now = Date.now()
): {
  certificates: { total: number; expiringSoon: Array<{ id: string; name: string; expirationDate: string }> };
  profiles: { total: number; expiringSoon: Array<{ id: string; name: string; expirationDate: string }> };
  summary: string;
} {
  const cutoff = now + EXPIRY_WINDOW_DAYS * 86_400_000;
  const pick = (items: any[], nameAttr: string) =>
    items
      .filter((i) => {
        const exp = Date.parse(i?.attributes?.expirationDate ?? '');
        return Number.isFinite(exp) && exp <= cutoff;
      })
      .map((i) => ({
        id: String(i.id),
        name: String(i.attributes?.[nameAttr] ?? i.attributes?.name ?? ''),
        expirationDate: String(i.attributes?.expirationDate ?? ''),
      }))
      .sort((a, b) => a.expirationDate.localeCompare(b.expirationDate));

  const certSoon = pick(certificates, 'displayName');
  const profSoon = pick(profiles, 'name');
  const parts: string[] = [];
  parts.push(
    certSoon.length
      ? `${certSoon.length} certificate(s) expire within ${EXPIRY_WINDOW_DAYS} days`
      : `No certificates expiring within ${EXPIRY_WINDOW_DAYS} days`
  );
  parts.push(
    profSoon.length
      ? `${profSoon.length} provisioning profile(s) expire within ${EXPIRY_WINDOW_DAYS} days`
      : `no profiles either`
  );

  return {
    certificates: { total: certificates.length, expiringSoon: certSoon },
    profiles: { total: profiles.length, expiringSoon: profSoon },
    summary: parts.join('; ') + '.',
  };
}

export async function executeMetaTool(
  name: string,
  args: Record<string, unknown>,
  ctx: {
    registry: ToolRegistry;
    http: AscHttpClient;
    tokens: TokenProvider;
    readOnly: boolean;
    loadedDomains: string[];
    /** In profile mode: how to reach operations this server doesn't carry. */
    missingToolsHint?: (ops: Array<(typeof OPERATIONS)[number]>) => string;
    /**
     * In profile mode: what this server is, in profile terms. Domains are the
     * wrong unit there — one domain is split across as many as four profiles.
     */
    profileReport?: () => Record<string, unknown>;
    /** Whether StoreKit (App Store Server API) tools are active on this server. */
    storekitEnabled?: boolean;
    /** Which macros this server offers — read-only servers hide the writes. */
    macroOffered?: (name: string) => boolean;
    /** Mirrors --include-deprecated: search must offer only what can be loaded. */
    includeDeprecated?: boolean;
  }
): Promise<unknown> {
  switch (name) {
    case 'asc__discover_domains': {
      // Profile mode answers in profiles, not domains: registering a sibling
      // server is the actual remedy, and a domain no longer names one server.
      if (ctx.profileReport) {
        return {
          specVersion: SPEC_VERSION,
          totalOperations: OPERATIONS.length,
          loadedTools: ctx.registry.size,
          ...ctx.profileReport(),
        };
      }

      const counts = OPERATIONS.reduce<Record<string, number>>((acc, op) => {
        acc[op.domain] = (acc[op.domain] ?? 0) + 1;
        return acc;
      }, {});
      const unloaded = new Set(ctx.registry.unloadedDomains());

      return {
        specVersion: SPEC_VERSION,
        totalOperations: OPERATIONS.length,
        loadedTools: ctx.registry.size,
        domains: ALL_DOMAINS.map((domain) => ({
          domain,
          tools: counts[domain] ?? 0,
          loaded: !unloaded.has(domain),
          description: DOMAIN_DESCRIPTIONS[domain] ?? '',
        })),
        hint:
          unloaded.size > 0
            ? `To load more, restart the server with --domains=${[...unloaded].slice(0, 3).join(',')} ` +
              `(or --domains=all for every operation).`
            : 'All domains are loaded.',
      };
    }

    case 'asc__search_tools': {
      const query = String(args.query ?? '').toLowerCase();
      const limit = Number(args.limit ?? 25);
      if (!query) return { matches: [], count: 0 };

      const apiHits = searchOperations(query, ctx.includeDeprecated);
      const apiMatches = apiHits.map((op) => ({
        tool: op.name,
        domain: op.domain,
        endpoint: `${op.method} ${op.path}`,
        description: op.description,
        loaded: Boolean(ctx.registry.get(op.name)),
        deprecated: op.deprecated,
      }));

      // Neither StoreKit nor the macros come from the OpenAPI spec, so both are
      // invisible to a search over OPERATIONS. The macros are the costly half:
      // a model searching "change subscription price" found only the five-call
      // chain, never the one-call tool written to replace it.
      const extras = (
        tools: Array<{ name: string; description: string }>,
        domain: string,
        endpoint: string,
        loaded: (name: string) => boolean
      ) =>
        matchByToken(query, tools).map((t) => ({
          tool: t.name,
          domain,
          endpoint,
          description: t.description,
          loaded: loaded(t.name),
          deprecated: false,
        }));

      // Ahead of the generated tools, not after them. There are twelve of these
      // against 982, so appending buried them below the slice — which is how a
      // macro written to replace a five-call chain lost to the five calls. A
      // macro that matches the query is the answer to it.
      const matches = [
        ...extras([...PRICING_TOOLS, ...SCREENSHOT_TOOLS], 'macro', 'Heimdall macro', (name) =>
          Boolean(ctx.macroOffered?.(name))
        ),
        ...extras(STOREKIT_TOOLS, 'storekit', 'App Store Server API', () =>
          Boolean(ctx.storekitEnabled)
        ),
        ...apiMatches,
      ].slice(0, Math.max(1, Math.min(limit, 100)));

      // An empty list reads as "no such capability", and the agent acts on it —
      // AI-201 ended with a model concluding App Store Connect could not set a
      // price and reaching for a competitor's server instead. Say why nothing
      // matched, because the two likely reasons have opposite remedies.
      if (!matches.length) {
        return {
          matches: [],
          count: 0,
          hint:
            `Nothing matched "${query}". This is a literal keyword search over Apple's ` +
            `English spec: a query in any other language matches nothing, so translate it ` +
            `and search again. If it was already English, search the resource rather than ` +
            `the sentence — "subscription price", "beta group", "screenshot".`,
        };
      }

      // A match the caller cannot invoke is a dead end unless we say how to
      // reach it — the tool only appears after the server restarts.
      const unloaded = matches.filter((m) => !m.loaded);
      const unloadedApiDomains = [...new Set(unloaded.filter((m) => m.domain !== 'storekit').map((m) => m.domain))];
      const storekitUnloaded = unloaded.some((m) => m.domain === 'storekit');

      const hints: string[] = [];
      if (unloadedApiDomains.length) {
        const unloadedOps = apiHits.filter(
          (op) => matches.some((m) => m.tool === op.name && !m.loaded)
        );
        hints.push(
          ctx.missingToolsHint?.(unloadedOps) ??
            `Restart the server with --domains=${unloadedApiDomains.join(',')} ` +
              `(added to any domains you already load) to expose them.`
        );
      }
      if (storekitUnloaded) {
        hints.push(
          'StoreKit tools need the monetization profile with ASC_BUNDLE_ID set ' +
            '(run `npx -y @erayendes/asc-mcp setup` and pick the monetization profile, or set ASC_BUNDLE_ID).'
        );
      }

      return {
        matches,
        count: matches.length,
        ...(hints.length
          ? {
              hint: `${unloaded.length} of these are not loaded and cannot be called from this server. ` +
                hints.join(' '),
            }
          : {}),
      };
    }

    case 'asc__status': {
      const checkConnection = args.check_connection !== false;
      const result: Record<string, unknown> = {
        specVersion: SPEC_VERSION,
        loadedDomains: ctx.loadedDomains,
        loadedTools: ctx.registry.size,
        totalOperations: OPERATIONS.length,
        readOnly: ctx.readOnly,
        // Nobody weighs a context budget during setup; they weigh it when a
        // session starts filling up. That is the moment this answer is read.
        ...(ctx.profileReport?.() ?? {}),
        token: ctx.tokens.status(),
        rateLimit: ctx.http.limiter.status(),
      };

      if (checkConnection) {
        try {
          const res: any = await ctx.http.get('/v1/apps', { limit: 1 });
          result.connection = {
            ok: true,
            appsVisible: res?.meta?.paging?.total ?? res?.data?.length ?? 0,
          };
        } catch (err) {
          result.connection = { ok: false, error: (err as Error).message };
        }
      }

      if (args.check_expirations === true) {
        // Two extra calls, so opt-in only. A key without the provisioning role
        // gets a 403 here — report it instead of failing the whole status.
        try {
          const [certs, profiles] = await Promise.all([
            ctx.http.get<any>('/v1/certificates', { limit: 200 }),
            ctx.http.get<any>('/v1/profiles', { limit: 200 }),
          ]);
          result.expirations = summarizeExpirations(certs?.data ?? [], profiles?.data ?? []);
        } catch (err) {
          result.expirations = { error: (err as Error).message };
        }
      }

      return result;
    }

    default:
      throw new Error(`Unknown meta tool: ${name}`);
  }
}

export const META_TOOL_NAMES = new Set(META_TOOLS.map((t) => t.name));
