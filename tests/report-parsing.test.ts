/**
 * sales_reports.list / finance_reports.list return Apple's response as a
 * gzipped TSV; the HTTP layer already turns that into an opaque
 * `{ contentType, base64 }` blob (src/core/http.ts). This suite covers the
 * runtime augmentation that lets a caller ask for `parse: true` and get
 * structured rows back instead — both the standalone module
 * (src/core/report-parsing.ts, testable with no HTTP and no registry) and its
 * wiring into ToolRegistry (src/core/registry.ts).
 *
 * No network, no Apple: every fixture is a TSV built and gzipped in-test.
 */
import { describe, it, expect } from 'vitest';
import { gzipSync } from 'node:zlib';
import { OPERATIONS } from '../src/generated/operations.js';
import { ToolRegistry, toMcpTool, toolNameFor } from '../src/core/registry.js';
import {
  augmentReportTableTool,
  maybeParseReportTable,
  REPORT_TABLE_OPERATIONS,
} from '../src/core/report-parsing.js';

const REPORT_OPS = [...REPORT_TABLE_OPERATIONS];

function gzipTsv(headers: string[], rows: string[][]): string {
  const lines = [headers.join('\t'), ...rows.map((r) => r.join('\t'))];
  const tsv = lines.join('\n') + '\n';
  return gzipSync(Buffer.from(tsv, 'utf-8')).toString('base64');
}

const SAMPLE_HEADERS = ['SKU', 'Units', 'Proceeds'];
const SAMPLE_ROWS: string[][] = [
  ['com.example.app.pro', '10', '9.99'],
  ['com.example.app.basic', '5', '4.99'],
  ['com.example.app.pro', '2', '9.99'],
];

const BLOB = {
  contentType: 'application/a-gzip',
  base64: gzipTsv(SAMPLE_HEADERS, SAMPLE_ROWS),
};

describe('report-parsing module (isolation, no HTTP/registry)', () => {
  it('knows about both report tools', () => {
    expect(REPORT_TABLE_OPERATIONS.has('sales_reports.list')).toBe(true);
    expect(REPORT_TABLE_OPERATIONS.has('finance_reports.list')).toBe(true);
  });

  describe('augmentReportTableTool', () => {
    it.each(REPORT_OPS)('adds parse and max_rows to %s', (opName) => {
      const op = OPERATIONS.find((o) => o.name === opName)!;
      const tool = toMcpTool(op);
      expect(tool.inputSchema.properties.parse).toMatchObject({ type: 'boolean' });
      expect(tool.inputSchema.properties.max_rows).toMatchObject({ type: 'number' });
      // Neither is required — parse defaults to false.
      expect(tool.inputSchema.required ?? []).not.toContain('parse');
      expect(tool.inputSchema.required ?? []).not.toContain('max_rows');
    });

    it('leaves an unrelated tool untouched', () => {
      const op = OPERATIONS.find((o) => o.name === 'apps.list')!;
      const before = toMcpTool(op);
      const after = augmentReportTableTool(before, op.name);
      expect(after).toEqual(before);
      expect(after.inputSchema.properties).not.toHaveProperty('parse');
      expect(after.inputSchema.properties).not.toHaveProperty('max_rows');
    });
  });

  describe('maybeParseReportTable', () => {
    it.each(REPORT_OPS)('passes the blob through byte-for-byte when parse is absent (%s)', (opName) => {
      const result = maybeParseReportTable(opName, {}, BLOB);
      expect(result).toEqual(BLOB);
    });

    it.each(REPORT_OPS)('passes the blob through byte-for-byte when parse is explicitly false (%s)', (opName) => {
      const result = maybeParseReportTable(opName, { parse: false }, BLOB);
      expect(result).toEqual(BLOB);
    });

    it('is a no-op for an operation it does not own, even with parse: true', () => {
      const result = maybeParseReportTable('apps.list', { parse: true }, BLOB);
      expect(result).toEqual(BLOB);
    });

    it.each(REPORT_OPS)('decodes headers and rows when parse is true (%s)', (opName) => {
      const result = maybeParseReportTable(opName, { parse: true }, BLOB) as any;
      expect(result.headers).toEqual(SAMPLE_HEADERS);
      expect(result.totalRows).toBe(3);
      expect(result.truncated).toBe(false);
      expect(result.rows).toEqual([
        { SKU: 'com.example.app.pro', Units: '10', Proceeds: '9.99' },
        { SKU: 'com.example.app.basic', Units: '5', Proceeds: '4.99' },
        { SKU: 'com.example.app.pro', Units: '2', Proceeds: '9.99' },
      ]);
      // Not the raw blob shape.
      expect(result.base64).toBeUndefined();
    });

    it('defaults max_rows to 200 and reports truncation past it', () => {
      const headers = ['SKU', 'Units'];
      const rows = Array.from({ length: 250 }, (_, i) => [`sku-${i}`, String(i)]);
      const blob = { contentType: 'application/a-gzip', base64: gzipTsv(headers, rows) };

      const result = maybeParseReportTable('sales_reports.list', { parse: true }, blob) as any;
      expect(result.totalRows).toBe(250);
      expect(result.rows).toHaveLength(200);
      expect(result.truncated).toBe(true);
    });

    it('honors a caller-supplied max_rows', () => {
      const headers = ['SKU'];
      const rows = Array.from({ length: 10 }, (_, i) => [`sku-${i}`]);
      const blob = { contentType: 'application/a-gzip', base64: gzipTsv(headers, rows) };

      const result = maybeParseReportTable(
        'finance_reports.list',
        { parse: true, max_rows: 3 },
        blob
      ) as any;
      expect(result.totalRows).toBe(10);
      expect(result.rows).toHaveLength(3);
      expect(result.truncated).toBe(true);
      expect(result.rows.map((r: any) => r.SKU)).toEqual(['sku-0', 'sku-1', 'sku-2']);
    });

    it('does not report truncation when every row fits', () => {
      const result = maybeParseReportTable(
        'sales_reports.list',
        { parse: true, max_rows: 1000 },
        BLOB
      ) as any;
      expect(result.truncated).toBe(false);
      expect(result.totalRows).toBe(3);
    });

    it('clamps max_rows to the hard cap of 1000', () => {
      const headers = ['SKU'];
      const rows = Array.from({ length: 1500 }, (_, i) => [`sku-${i}`]);
      const blob = { contentType: 'application/a-gzip', base64: gzipTsv(headers, rows) };

      const result = maybeParseReportTable(
        'sales_reports.list',
        { parse: true, max_rows: 999_999 },
        blob
      ) as any;
      expect(result.rows).toHaveLength(1000);
      expect(result.totalRows).toBe(1500);
      expect(result.truncated).toBe(true);
    });

    it('falls back to a blob + parseError on corrupt gzip instead of throwing', () => {
      const notGzip = { contentType: 'application/a-gzip', base64: Buffer.from('not actually gzip').toString('base64') };
      const result = maybeParseReportTable('sales_reports.list', { parse: true }, notGzip) as any;

      expect(() => maybeParseReportTable('sales_reports.list', { parse: true }, notGzip)).not.toThrow();
      expect(result.parseError).toMatch(/gunzip|decode/i);
      // The original data is never lost.
      expect(result.base64).toBe(notGzip.base64);
      expect(result.contentType).toBe(notGzip.contentType);
      expect(result.headers).toBeUndefined();
    });

    it('passes an unexpected result shape through untouched (e.g. no base64 field)', () => {
      const weird = { data: [] };
      const result = maybeParseReportTable('sales_reports.list', { parse: true }, weird);
      expect(result).toEqual(weird);
    });
  });
});

describe('report-table tools wired into ToolRegistry', () => {
  const REQUIRED_ARGS: Record<string, Record<string, string>> = {
    'sales_reports.list': {
      filter_vendorNumber: '123456',
      filter_reportType: 'SALES',
      filter_reportSubType: 'SUMMARY',
      filter_frequency: 'DAILY',
    },
    'finance_reports.list': {
      filter_vendorNumber: '123456',
      filter_reportType: 'FINANCIAL',
      filter_regionCode: 'WW',
      filter_reportDate: '2024-01',
    },
  };

  it.each(REPORT_OPS)('exposes parse/max_rows in the listed tool schema for %s', (opName) => {
    const registry = new ToolRegistry({ domains: ['all'], readOnly: true, includeDeprecated: false });
    const tool = registry.listTools().find((t) => t.name === toolNameFor({ name: opName }))!;
    expect(tool).toBeDefined();
    expect(tool.inputSchema.properties).toHaveProperty('parse');
    expect(tool.inputSchema.properties).toHaveProperty('max_rows');
  });

  it.each(REPORT_OPS)('default (parse omitted) returns the blob unchanged for %s', async (opName) => {
    const registry = new ToolRegistry({ domains: ['all'], readOnly: true, includeDeprecated: false });
    const http = { request: () => Promise.resolve({ ...BLOB }) };

    const result = await registry.execute(toolNameFor({ name: opName }), REQUIRED_ARGS[opName], http as never);
    expect(result).toEqual(BLOB);
  });

  it.each(REPORT_OPS)('parse: true returns structured rows for %s', async (opName) => {
    const registry = new ToolRegistry({ domains: ['all'], readOnly: true, includeDeprecated: false });
    const http = { request: () => Promise.resolve({ ...BLOB }) };

    const result = (await registry.execute(
      toolNameFor({ name: opName }),
      { ...REQUIRED_ARGS[opName], parse: true },
      http as never
    )) as any;

    expect(result.headers).toEqual(SAMPLE_HEADERS);
    expect(result.totalRows).toBe(3);
    expect(result.truncated).toBe(false);
    expect(result.rows[0]).toEqual({ SKU: 'com.example.app.pro', Units: '10', Proceeds: '9.99' });
  });

  it('does not reject parse/max_rows as unknown parameters', async () => {
    const registry = new ToolRegistry({ domains: ['all'], readOnly: true, includeDeprecated: false });
    const http = { request: () => Promise.resolve({ ...BLOB }) };

    await expect(
      registry.execute(
        toolNameFor({ name: 'sales_reports.list' }),
        { ...REQUIRED_ARGS['sales_reports.list'], parse: true, max_rows: 50 },
        http as never
      )
    ).resolves.not.toThrow();
  });

  it('still rejects a genuinely unknown parameter on a report tool', async () => {
    const registry = new ToolRegistry({ domains: ['all'], readOnly: true, includeDeprecated: false });
    const http = { request: () => Promise.resolve({ ...BLOB }) };

    await expect(
      registry.execute(
        toolNameFor({ name: 'sales_reports.list' }),
        { ...REQUIRED_ARGS['sales_reports.list'], not_a_real_param: 'x' },
        http as never
      )
    ).rejects.toThrow(/Unknown parameter/);
  });

  it('surfaces a corrupt gzip as blob + parseError through the registry too', async () => {
    const registry = new ToolRegistry({ domains: ['all'], readOnly: true, includeDeprecated: false });
    const corrupt = { contentType: 'application/a-gzip', base64: Buffer.from('nope').toString('base64') };
    const http = { request: () => Promise.resolve(corrupt) };

    const result = (await registry.execute(
      toolNameFor({ name: 'finance_reports.list' }),
      { ...REQUIRED_ARGS['finance_reports.list'], parse: true },
      http as never
    )) as any;

    expect(result.parseError).toBeDefined();
    expect(result.base64).toBe(corrupt.base64);
  });

  it('an unrelated tool never gains parse/max_rows in its schema', () => {
    const registry = new ToolRegistry({ domains: ['apps'], readOnly: false, includeDeprecated: false });
    const tool = registry.listTools().find((t) => t.name === 'apps__list')!;
    expect(tool.inputSchema.properties).not.toHaveProperty('parse');
    expect(tool.inputSchema.properties).not.toHaveProperty('max_rows');
  });
});
