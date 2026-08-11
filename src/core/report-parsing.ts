/**
 * Runtime augmentation for the two report-download tools (`sales_reports.list`,
 * `finance_reports.list`).
 *
 * Both operations come straight from the generated spec and return Apple's
 * response as a gzipped TSV — the HTTP layer already detects the non-JSON
 * case and hands back `{ contentType, base64 }` (see `AscHttpClient.request`
 * in `./http.ts`), which is an opaque blob to a model.
 *
 * The generator (`scripts/generate.ts` / `src/generated/*`) knows nothing
 * about parsing and must not be touched here — a parallel work stream owns
 * it. So this module augments the two tools entirely at runtime: it is
 * plugged into `ToolRegistry` (see `./registry.ts`) at exactly two points —
 * `toMcpTool` (schema) and `ToolRegistry.execute` (result) — keyed by
 * operation name, and is fully testable on its own with no HTTP, no registry,
 * and no Apple involved.
 */
import { gunzipSync } from 'node:zlib';
import type { McpToolDefinition } from './registry.js';

/** Dotted operation names this module knows how to augment. */
export const REPORT_TABLE_OPERATIONS: ReadonlySet<string> = new Set([
  'sales_reports.list',
  'finance_reports.list',
]);

/**
 * Extra input-schema keys these tools accept beyond what the generator
 * produced. `ToolRegistry.execute`'s "unknown parameter" guard needs to know
 * about them too, so they are exported rather than duplicated.
 */
export const REPORT_TABLE_EXTRA_PARAMS = ['parse', 'max_rows'] as const;

export function isReportTableOperation(opName: string): boolean {
  return REPORT_TABLE_OPERATIONS.has(opName);
}

const DEFAULT_MAX_ROWS = 200;
const HARD_MAX_ROWS = 1000;

export interface ParsedReportTable {
  headers: string[];
  rows: Record<string, string>[];
  totalRows: number;
  truncated: boolean;
}

/** The blob shape `AscHttpClient` returns for a non-JSON (gzipped TSV) response. */
interface ReportBlob {
  contentType?: string;
  base64?: string;
}

/**
 * Adds `parse` and `max_rows` to a report-table tool's schema. A no-op for
 * every other tool, so it is safe to run over the full tool list
 * unconditionally.
 */
export function augmentReportTableTool(
  tool: McpToolDefinition,
  opName: string
): McpToolDefinition {
  if (!isReportTableOperation(opName)) return tool;

  return {
    ...tool,
    description:
      `${tool.description} Set parse=true to receive decoded rows instead of the raw gzipped ` +
      `blob.`,
    inputSchema: {
      ...tool.inputSchema,
      properties: {
        ...tool.inputSchema.properties,
        parse: {
          type: 'boolean',
          description:
            'When true, gunzip and decode the TSV payload into structured rows ' +
            '({ headers, rows, totalRows, truncated }) instead of returning the raw base64 ' +
            'blob. Defaults to false — unparsed, byte-for-byte identical to the raw response.',
        },
        max_rows: {
          type: 'number',
          description:
            `Maximum number of data rows to include when parse=true (default ${DEFAULT_MAX_ROWS}, ` +
            `hard cap ${HARD_MAX_ROWS}). Ignored when parse is not true. Use truncated/totalRows ` +
            'in the response to tell whether more rows exist.',
        },
      },
    },
  };
}

/**
 * Post-processes the raw HTTP result for a report-table operation.
 *
 * - Any other operation, or `parse` not `true`: returns `result` unchanged —
 *   today's behavior, byte-for-byte.
 * - `parse: true` and the payload gunzips and decodes cleanly: returns
 *   `{ headers, rows, totalRows, truncated }`.
 * - `parse: true` but gunzip/decoding fails (e.g. Apple sent something that
 *   isn't actually gzipped): returns the original blob plus a `parseError`
 *   string, rather than throwing. The data is never lost.
 */
export function maybeParseReportTable(
  opName: string,
  args: Record<string, unknown>,
  result: unknown
): unknown {
  if (!isReportTableOperation(opName)) return result;
  if (args.parse !== true) return result;

  const blob = result as ReportBlob | undefined;
  if (!blob || typeof blob.base64 !== 'string') {
    // Not the {contentType, base64} shape we know how to parse — hand it
    // back untouched rather than guessing.
    return result;
  }

  const maxRows = clampMaxRows(args.max_rows);

  try {
    const gzipped = Buffer.from(blob.base64, 'base64');
    const tsv = gunzipSync(gzipped).toString('utf-8');
    return parseTsv(tsv, maxRows);
  } catch (err) {
    return {
      ...blob,
      parseError:
        `Could not gunzip/decode the payload as TSV: ${(err as Error).message}. ` +
        `Returning the raw blob instead — no data was lost.`,
    };
  }
}

/**
 * Same decode, for a report that arrived as bytes rather than as a tool
 * result — an analytics segment downloaded from a signed URL. Exported so the
 * analytics macro caps and shapes its rows identically to the sales and
 * finance reports, instead of inventing a second row format.
 */
export function parseGzippedTsv(gzipped: Buffer, maxRows?: number): ParsedReportTable {
  return parseTsv(gunzipSync(gzipped).toString('utf-8'), clampMaxRows(maxRows));
}

function clampMaxRows(raw: unknown): number {
  const n = typeof raw === 'number' && Number.isFinite(raw) ? Math.floor(raw) : DEFAULT_MAX_ROWS;
  if (n <= 0) return DEFAULT_MAX_ROWS;
  return Math.min(n, HARD_MAX_ROWS);
}

function parseTsv(tsv: string, maxRows: number): ParsedReportTable {
  // Apple's TSV reports sometimes carry a leading BOM and always end with a
  // trailing newline; neither should become part of the header row or count
  // as a blank data row.
  const withoutBom = tsv.charCodeAt(0) === 0xfeff ? tsv.slice(1) : tsv;
  const lines = withoutBom.split(/\r\n|\n|\r/).filter((line) => line.length > 0);

  if (lines.length === 0) {
    return { headers: [], rows: [], totalRows: 0, truncated: false };
  }

  const headers = lines[0].split('\t');
  const dataLines = lines.slice(1);
  const totalRows = dataLines.length;
  const truncated = totalRows > maxRows;

  const rows = dataLines.slice(0, maxRows).map((line) => {
    const cells = line.split('\t');
    const row: Record<string, string> = {};
    headers.forEach((header, i) => {
      row[header] = cells[i] ?? '';
    });
    return row;
  });

  return { headers, rows, totalRows, truncated };
}
