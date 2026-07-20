/**
 * Server introspection tools. These never touch Apple's API except for the
 * explicit connection check.
 */
import type { McpToolDefinition } from '../core/registry.js';
import { ALL_DOMAINS, ToolRegistry } from '../core/registry.js';
import { DOMAIN_DESCRIPTIONS } from '../generated/domain-info.js';
import { OPERATIONS, SPEC_VERSION } from '../generated/operations.js';
import type { AscHttpClient } from '../core/http.js';
import type { TokenProvider } from '../core/jwt.js';

export const META_TOOLS: McpToolDefinition[] = [
  {
    name: 'asc__discover_domains',
    description:
      'List every available tool domain, how many tools each contains, and which are ' +
      'currently loaded. Use this when a capability you need is not in the tool list — ' +
      'it tells you which domain to enable via the --domains flag.',
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
      },
    },
    annotations: { readOnlyHint: true },
  },
];

export async function executeMetaTool(
  name: string,
  args: Record<string, unknown>,
  ctx: {
    registry: ToolRegistry;
    http: AscHttpClient;
    tokens: TokenProvider;
    readOnly: boolean;
    loadedDomains: string[];
  }
): Promise<unknown> {
  switch (name) {
    case 'asc__discover_domains': {
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

      const matches = OPERATIONS.filter(
        (op) =>
          op.name.toLowerCase().includes(query) ||
          op.description.toLowerCase().includes(query) ||
          op.path.toLowerCase().includes(query)
      )
        .slice(0, Math.max(1, Math.min(limit, 100)))
        .map((op) => ({
          tool: op.name,
          domain: op.domain,
          endpoint: `${op.method} ${op.path}`,
          description: op.description,
          loaded: Boolean(ctx.registry.get(op.name)),
          deprecated: op.deprecated,
        }));

      // A match the caller cannot invoke is a dead end unless we say how to
      // reach it — the tool only appears after the server restarts.
      const unloadedDomains = [...new Set(matches.filter((m) => !m.loaded).map((m) => m.domain))];

      return {
        matches,
        count: matches.length,
        ...(unloadedDomains.length
          ? {
              hint:
                `${matches.filter((m) => !m.loaded).length} of these are not loaded and cannot be ` +
                `called yet. Restart the server with --domains=${unloadedDomains.join(',')} ` +
                `(added to any domains you already load) to expose them.`,
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

      return result;
    }

    default:
      throw new Error(`Unknown meta tool: ${name}`);
  }
}

export const META_TOOL_NAMES = new Set(META_TOOLS.map((t) => t.name));
