/**
 * Analytics macro — the one-call answer to "what does this report say?".
 *
 * The raw chain is five hops and ends somewhere the API does not go:
 * app → report request → report → dated instance → segments → a pre-signed URL
 * holding gzipped TSV. Nothing in the tool set fetches that URL, so an agent
 * that walks the whole chain correctly still finishes holding a link rather
 * than rows — and the obvious next move is `curl`, which is the behaviour
 * `scripts/ax-agent.ts` counts as leaving the tools behind.
 *
 * Two things are worth knowing before reading the code, because both look like
 * bugs from the outside:
 *
 *   - A report request is not a report. Creating one starts a pipeline that
 *     produces nothing for a day or more, so "no instances" on a fresh request
 *     is the expected state, not a failure.
 *   - One instance can be split across several segments, and a caller that
 *     reads only the first gets a silently partial answer. They are stitched
 *     here, and the result says how many there were.
 *
 * Read-only, and it will not create a report request: that is an ONGOING
 * commitment on the account, and starting one as a side effect of a question
 * is the kind of surprise a read tool should not spring.
 */
import type { McpToolDefinition } from '../core/registry.js';
import type { AscHttpClient } from '../core/http.js';
import { parseGzippedTsv } from '../core/report-parsing.js';
import { AscApiError } from '../core/errors.js';
import { resolveApp } from '../core/resolve-app.js';

const GRANULARITIES = ['DAILY', 'WEEKLY', 'MONTHLY'] as const;
const CATEGORIES = [
  'APP_USAGE',
  'APP_STORE_ENGAGEMENT',
  'COMMERCE',
  'FRAMEWORK_USAGE',
  'PERFORMANCE',
] as const;

export const ANALYTICS_TOOLS: McpToolDefinition[] = [
  {
    name: 'analytics__get_report',
    description:
      'Read an App Store analytics report as rows, in one step. Give the app (name, bundle ID ' +
      'or Apple ID) and the report name or category; it walks the request → report → instance ' +
      '→ segment chain, downloads the gzipped TSV Apple stores behind a signed link, and ' +
      'returns decoded rows. Use this instead of chaining analytics_report_requests / ' +
      'analytics_reports / analytics_report_instances / analytics_report_segments, which ends ' +
      'holding a URL rather than data. Does not start a new report request.',
    inputSchema: {
      type: 'object',
      properties: {
        app: {
          type: 'string',
          description: 'App name, bundle ID (com.example.app) or numeric Apple ID.',
        },
        report: {
          type: 'string',
          description:
            'Report name, exact or partial, e.g. "App Store Installations". Omit to list what ' +
            'this app has available instead of downloading one.',
        },
        category: {
          type: 'string',
          description: 'Narrow the report search to one category.',
          enum: [...CATEGORIES],
        },
        granularity: {
          type: 'string',
          description: 'Which cadence of instance to read. Defaults to DAILY.',
          enum: [...GRANULARITIES],
        },
        processing_date: {
          type: 'string',
          description:
            'Instance date as YYYY-MM-DD. Defaults to the most recent instance Apple has ' +
            'processed, which is usually not today.',
        },
        max_rows: {
          type: 'number',
          description: 'Cap on returned data rows (default 200, hard cap 1000).',
        },
      },
      required: ['app'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        app: { type: 'string', description: 'Resolved app, as "Name (id)".' },
        report: { type: 'string' },
        category: { type: 'string' },
        granularity: { type: 'string' },
        processingDate: { type: 'string' },
        segments: { type: 'number', description: 'How many segments were stitched together.' },
        headers: { type: 'array', items: { type: 'string' } },
        rows: { type: 'array', items: { type: 'object' } },
        totalRows: { type: 'number' },
        truncated: { type: 'boolean', description: 'True when max_rows cut the rows short.' },
        available: {
          type: 'array',
          description: 'Present when no report was named: what this app can report on.',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              category: { type: 'string' },
            },
          },
        },
        note: { type: 'string' },
      },
      required: ['app'],
    },
    annotations: { readOnlyHint: true, idempotentHint: true },
  },
];

export const ANALYTICS_TOOL_NAMES = new Set(ANALYTICS_TOOLS.map((t) => t.name));

export interface AnalyticsContext {
  http: AscHttpClient;
}

/**
 * The schema documents "default 200, hard cap 1000" and nothing enforced it.
 * `Number(x) || 200` lets a negative through as truthy, and `slice(0, -5)`
 * then drops the last five rows instead of returning five — a wrong answer
 * that looks like a short one.
 */
const MAX_ROWS_CAP = 1000;
function clampRows(raw: unknown): number {
  const n = Math.floor(Number(raw));
  if (!Number.isFinite(n) || n < 1) return 200;
  return Math.min(n, MAX_ROWS_CAP);
}


export async function executeAnalyticsTool(
  name: string,
  args: Record<string, unknown>,
  ctx: AnalyticsContext
): Promise<unknown> {
  if (name !== 'analytics__get_report') throw new Error(`Unknown analytics tool: ${name}`);
  if (!args.app || typeof args.app !== 'string') {
    throw new AscApiError('"app" is required.', 0);
  }

  const app = await resolveApp(ctx.http, String(args.app));
  // Every hop of the chain paginates. Reading one page of any of them turns a
  // report that exists into "no report matching…", which reads like an answer.
  const maxRows = clampRows(args.max_rows);

  const requests = await ctx.http.collect<any>(
    `/v1/apps/${encodeURIComponent(app.id)}/analyticsReportRequests`,
    { 'fields[analyticsReportRequests]': 'accessType,stoppedDueToInactivity', limit: 50 }
  );
  const live = requests.items.filter((r: any) => !r.attributes?.stoppedDueToInactivity);
  if (!live.length) {
    throw new AscApiError(
      `"${app.name}" has no active analytics report request, so Apple is not producing any ` +
        `reports for it. Start one with analytics_report_requests__create (ONE_TIME_SNAPSHOT ` +
        `for the past 365 days, ONGOING to keep producing) — reports appear a day or more later.`,
      0
    );
  }

  // One request can carry many report types; search across all live ones so a
  // report is found regardless of which request happens to produce it.
  const wanted = args.report ? String(args.report).trim().toLowerCase() : undefined;
  const category = args.category ? String(args.category).trim().toUpperCase() : undefined;
  const reports: Array<{ id: string; name: string; category: string }> = [];
  for (const req of live) {
    const res = await ctx.http.collect<any>(
      `/v1/analyticsReportRequests/${encodeURIComponent(req.id)}/reports`,
      {
        ...(category ? { 'filter[category]': category } : {}),
        'fields[analyticsReports]': 'name,category',
        limit: 200,
      }
    );
    for (const r of res.items) {
      reports.push({
        id: r.id,
        name: String(r.attributes?.name ?? ''),
        category: String(r.attributes?.category ?? ''),
      });
    }
  }

  // No report named: answer "what can I ask for?" rather than guessing one.
  if (!wanted) {
    return {
      app: `${app.name} (${app.id})`,
      available: reports.map((r) => ({ name: r.name, category: r.category })),
      note: reports.length
        ? 'Call again with one of these in "report" to download its rows.'
        : 'No reports are available yet. A fresh request produces nothing for a day or more.',
    };
  }

  const exact = reports.filter((r) => r.name.toLowerCase() === wanted);
  const partial = reports.filter((r) => r.name.toLowerCase().includes(wanted));
  const matches = exact.length ? exact : partial;
  if (!matches.length) {
    throw new AscApiError(
      `No report matching "${args.report}" for ${app.name}. Available: ` +
        `${reports.map((r) => r.name).join(', ') || 'none yet'}.`,
      0
    );
  }
  if (matches.length > 1) {
    throw new AscApiError(
      `"${args.report}" matches ${matches.length} reports: ${matches
        .map((r) => r.name)
        .join(' | ')}. Name one exactly.`,
      0
    );
  }
  const report = matches[0];

  const granularity = args.granularity
    ? String(args.granularity).trim().toUpperCase()
    : 'DAILY';
  const instances = await ctx.http.collect<any>(
    `/v1/analyticsReports/${encodeURIComponent(report.id)}/instances`,
    {
      'filter[granularity]': granularity,
      ...(args.processing_date ? { 'filter[processingDate]': String(args.processing_date) } : {}),
      'fields[analyticsReportInstances]': 'granularity,processingDate',
      limit: 50,
    }
  );
  // Apple does not promise an order, so pick the newest date rather than the
  // first row — "most recent" is the whole point of the default.
  const instance = instances.items
    .slice()
    .sort((a: any, b: any) =>
      String(b.attributes?.processingDate ?? '').localeCompare(
        String(a.attributes?.processingDate ?? '')
      )
    )[0];
  if (!instance) {
    throw new AscApiError(
      `"${report.name}" has no ${granularity} instance` +
        (args.processing_date ? ` for ${args.processing_date}` : '') +
        `. Apple processes with a lag of a day or more; try another granularity or date.`,
      0
    );
  }

  const segmentRefs = await ctx.http.collect<any>(
    `/v1/analyticsReportInstances/${encodeURIComponent(instance.id)}/segments`,
    { limit: 100 }
  );
  const refs = segmentRefs.items;
  if (!refs.length) {
    throw new AscApiError(
      `Instance ${instance.attributes?.processingDate} of "${report.name}" has no segments — ` +
        `Apple has not finished producing it.`,
      0
    );
  }

  // Stitch: one instance can be split, and reading only the first segment is a
  // partial answer that looks complete.
  const tables = [];
  for (const ref of refs) {
    const seg: any = await ctx.http.get(
      `/v1/analyticsReportSegments/${encodeURIComponent(String(ref.id))}`,
      { 'fields[analyticsReportSegments]': 'url,checksum,sizeInBytes' }
    );
    const url = seg?.data?.attributes?.url;
    if (!url) continue;
    const bytes = await ctx.http.downloadAsset(String(url));
    tables.push(parseGzippedTsv(bytes, maxRows));
  }
  if (!tables.length) {
    throw new AscApiError(
      `No segment of "${report.name}" carried a download URL. Apple's links expire — read the ` +
        `segments again.`,
      0
    );
  }

  const headers = tables[0].headers;
  const rows = tables.flatMap((t) => t.rows).slice(0, maxRows);
  const totalRows = tables.reduce((n, t) => n + t.totalRows, 0);

  return {
    app: `${app.name} (${app.id})`,
    report: report.name,
    category: report.category,
    granularity,
    processingDate: instance.attributes?.processingDate,
    segments: tables.length,
    headers,
    rows,
    totalRows,
    truncated: totalRows > rows.length,
    ...(totalRows > rows.length
      ? { note: `Showing ${rows.length} of ${totalRows} rows — raise max_rows to see more.` }
      : {}),
  };
}
