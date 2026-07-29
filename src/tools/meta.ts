/**
 * Server introspection tools. These never touch Apple's API except for the
 * explicit connection check.
 */
import type { McpToolDefinition } from '../core/registry.js';
import { ALL_DOMAINS, ToolRegistry } from '../core/registry.js';
import { DOMAIN_DESCRIPTIONS } from '../generated/domain-info.js';
import { OPERATIONS, SPEC_VERSION } from '../generated/operations.js';
import { expandQueryTokens } from '../core/query-language.js';
import { STOREKIT_TOOLS } from '../storekit/index.js';
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
      'underlying endpoint.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Keyword to match against tool names, descriptions and paths.',
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

/**
 * Keyword search over every operation (loaded or not). Extracted from the
 * asc__search_tools handler so intent coverage is unit-testable — the 20-intent
 * regression suite in tests/search-intents.test.ts runs against this.
 *
 * Multi-word queries are matched token by token and ranked by how many tokens
 * hit: the old whole-phrase `includes` returned nothing for natural queries
 * like "change subscription price territory", because no description contains
 * that exact phrase. Single-word queries behave as before.
 *
 * Words the catalogue has never seen get translated first — see
 * `expandQueryTokens`. Everything else is left exactly as typed.
 */
const CORPUS_TEXT = OPERATIONS.map(
  (op) => `${op.name} ${op.description} ${op.path}`
)
  .join(' ')
  .toLowerCase();

export function searchOperations(query: string): Array<(typeof OPERATIONS)[number]> {
  const tokens = expandQueryTokens(query, CORPUS_TEXT);
  if (!tokens.length) return [];

  const scored = OPERATIONS.map((op) => {
    const haystack = `${op.name} ${op.description} ${op.path}`.toLowerCase();
    const score = tokens.reduce((n, t) => n + (haystack.includes(t) ? 1 : 0), 0);
    return { op, score };
  }).filter((s) => s.score > 0 && s.score >= Math.ceil(tokens.length / 2));

  return scored
    .sort((a, b) => b.score - a.score || a.op.name.localeCompare(b.op.name))
    .map((s) => s.op);
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

      const apiHits = searchOperations(query);
      const apiMatches = apiHits.map((op) => ({
        tool: op.name,
        domain: op.domain,
        endpoint: `${op.method} ${op.path}`,
        description: op.description,
        loaded: Boolean(ctx.registry.get(op.name)),
        deprecated: op.deprecated,
      }));

      // StoreKit tools live outside the OpenAPI spec (App Store Server API), so
      // they'd be invisible to search without this. They belong to the
      // monetization profile and need ASC_BUNDLE_ID.
      const storekitMatches = STOREKIT_TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      ).map((t) => ({
        tool: t.name,
        domain: 'storekit',
        endpoint: 'App Store Server API',
        description: t.description,
        loaded: Boolean(ctx.storekitEnabled),
        deprecated: false,
      }));

      const matches = [...apiMatches, ...storekitMatches].slice(0, Math.max(1, Math.min(limit, 100)));

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
