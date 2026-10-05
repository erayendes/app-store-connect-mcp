import type { McpToolDefinition } from '../core/registry.js';
import type { AscHttpClient } from '../core/http.js';
import { AscApiError } from '../core/errors.js';
import { resolveApp } from '../core/resolve-app.js';

export const TESTFLIGHT_TOOLS: McpToolDefinition[] = [{
  name: 'testflight__assign_build_to_groups',
  description: 'Assign one processed, unexpired TestFlight build to named beta groups. Checks existing assignments and reports each group, including partial failures. External groups may need beta app review before testers can install the build. RELEASE-level write.',
  inputSchema: {
    type: 'object',
    properties: {
      app: { type: 'string', description: 'App name, bundle ID, or numeric Apple ID.' },
      build: { type: 'string', description: 'Exact build number (Apple build version) or build ID. Required; ambiguous matches are refused.' },
      groups: { type: 'array', items: { type: 'string' }, minItems: 1, description: 'Exact beta group names or IDs.' },
    },
    required: ['app', 'build', 'groups'],
  },
  annotations: { readOnlyHint: false, destructiveHint: true },
}];

export const TESTFLIGHT_TOOL_NAMES = new Set(TESTFLIGHT_TOOLS.map((tool) => tool.name));

interface Resource { id: string; attributes?: Record<string, unknown> }

export async function executeTestflightTool(
  name: string,
  args: Record<string, unknown>,
  ctx: { http: AscHttpClient; dryRun?: boolean }
): Promise<unknown> {
  if (name !== 'testflight__assign_build_to_groups') throw new Error(`Unknown TestFlight tool: ${name}`);
  if (typeof args.app !== 'string' || !args.app.trim()) throw new AscApiError('"app" is required.', 0);
  if (typeof args.build !== 'string' || !args.build.trim()) throw new AscApiError('"build" is required.', 0);
  if (!Array.isArray(args.groups) || !args.groups.length || args.groups.some((g) => typeof g !== 'string' || !g.trim())) {
    throw new AscApiError('"groups" must be a nonempty array of group names or IDs.', 0);
  }

  const app = await resolveApp(ctx.http, args.app);
  // Build IDs are UUIDs; build numbers are digits and dots, and teams often use
  // long timestamps (2026100412) — so length alone must not decide.
  const buildId = /[a-z-]/i.test(args.build);
  const builds = await ctx.http.collect<Resource>('/v1/builds', {
    'filter[app]': app.id,
    [buildId ? 'filter[id]' : 'filter[version]']: args.build,
    'fields[builds]': 'version,processingState,expired,expirationDate', limit: 200,
  }, 2);
  if (builds.hasMore) throw new AscApiError('Build list is incomplete; refusing to guess which build to assign.', 0);
  const matches = builds.items.filter((b) => buildId ? b.id === args.build : b.attributes?.version === args.build);
  if (matches.length !== 1) throw new AscApiError(
    matches.length ? `Build "${args.build}" is ambiguous; use its build ID.` : `Build "${args.build}" was not found for ${app.name}.`, 0
  );
  const build = matches[0];
  if (build.attributes?.processingState !== 'VALID' || build.attributes?.expired !== false ||
      (typeof build.attributes?.expirationDate === 'string' && Date.parse(build.attributes.expirationDate) <= Date.now())) {
    throw new AscApiError(`Build ${build.id} is not a processed, unexpired VALID build.`, 0);
  }

  const available = await ctx.http.collect<Resource>(`/v1/apps/${encodeURIComponent(app.id)}/betaGroups`, {
    'fields[betaGroups]': 'name,isInternalGroup', limit: 200,
  }, 5);
  if (available.hasMore) throw new AscApiError('Beta group list is incomplete; refusing to assign a build.', 0);
  const selected: Resource[] = [];
  const bad: string[] = [];
  for (const wanted of args.groups as string[]) {
    const hits = available.items.filter((g) => g.id === wanted || g.attributes?.name === wanted);
    if (hits.length !== 1) bad.push(`${wanted} (${hits.length ? 'ambiguous' : 'unknown'})`);
    else if (!selected.some((g) => g.id === hits[0].id)) selected.push(hits[0]);
  }
  if (bad.length) throw new AscApiError(
    `Cannot resolve groups: ${bad.join(', ')}. Available groups: ${available.items.map((g) => `${g.attributes?.name ?? '(unnamed)'} (${g.id})`).join(', ') || '(none)'}.`, 0
  );

  const results: Array<Record<string, unknown>> = [];
  // Finish all reads before writing, so a read failure cannot leave a half-applied request.
  const assigned = await ctx.http.collect<Resource>('/v1/betaGroups', {
    'filter[app]': app.id, 'filter[builds]': build.id, limit: 200,
  }, 1);
  if (assigned.hasMore) throw new AscApiError('Assigned beta group list is incomplete; nothing was assigned.', 0);
  const assignedIds = new Set(assigned.items.map((g) => g.id));
  for (const group of selected) {
    results.push({
      group: String(group.attributes?.name ?? group.id), groupId: group.id,
      status: assignedIds.has(group.id) ? 'already_assigned' : ctx.dryRun ? 'would_assign' : 'pending',
      ...(group.attributes?.isInternalGroup === false ? { note: 'External group: beta app review may be required before testers can install this build.' } : {}),
    });
  }

  if (ctx.dryRun) return { dryRun: true, app: `${app.name} (${app.id})`, build: build.id, groups: results };
  for (const result of results) {
    if (result.status !== 'pending') continue;
    try {
      await ctx.http.post(`/v1/betaGroups/${encodeURIComponent(String(result.groupId))}/relationships/builds`, {
        data: [{ type: 'builds', id: build.id }],
      });
      result.status = 'assigned';
    } catch (error) {
      result.status = 'failed';
      result.error = error instanceof AscApiError ? error.summary : String(error);
    }
  }
  return { app: `${app.name} (${app.id})`, build: build.id, groups: results };
}
