import { describe, it, expect, vi } from 'vitest';
import { gzipSync } from 'node:zlib';
import {
  ANALYTICS_TOOLS,
  executeAnalyticsTool,
  type AnalyticsContext,
} from '../src/tools/analytics.js';

/**
 * The chain the macro exists to collapse, and the two states that look like
 * failures from outside: a request that has produced nothing yet, and an
 * instance split across more than one segment.
 */
function fakeHttp(opts: { segments?: number; stopped?: boolean; instances?: any[] } = {}) {
  const segments = opts.segments ?? 2;
  const get = vi.fn(async (path: string, query?: any) => {
    if (path === '/v1/apps') {
      return { data: [{ id: 'app-1', attributes: { name: 'Ask Quran' } }] };
    }
    if (path.endsWith('/analyticsReportRequests')) {
      return {
        data: [
          {
            id: 'req-1',
            attributes: { accessType: 'ONGOING', stoppedDueToInactivity: opts.stopped ?? false },
          },
        ],
      };
    }
    if (path.endsWith('/reports')) {
      const all = [
        { id: 'rep-1', attributes: { name: 'App Store Installations', category: 'APP_USAGE' } },
        { id: 'rep-2', attributes: { name: 'App Store Purchases', category: 'COMMERCE' } },
      ];
      const wanted = query?.['filter[category]'];
      return { data: wanted ? all.filter((r) => r.attributes.category === wanted) : all };
    }
    if (path.endsWith('/instances')) {
      return {
        data:
          opts.instances ??
          // Deliberately out of order: the macro must pick the newest date, not
          // the first row Apple happens to send.
          [
            { id: 'inst-old', attributes: { granularity: 'DAILY', processingDate: '2026-08-01' } },
            { id: 'inst-new', attributes: { granularity: 'DAILY', processingDate: '2026-08-08' } },
          ],
      };
    }
    if (path.endsWith('/segments')) {
      return { data: Array.from({ length: segments }, (_, i) => ({ id: `seg-${i}` })) };
    }
    if (path.includes('/analyticsReportSegments/')) {
      const i = path.split('/').pop();
      return { data: { attributes: { url: `https://data.apple.com/${i}`, sizeInBytes: 10 } } };
    }
    return { data: [] };
  });

  const downloaded: string[] = [];
  const downloadAsset = vi.fn(async (url: string) => {
    downloaded.push(url);
    const n = Number(url.split('-').pop());
    // Each segment carries the same headers and a distinct row, which is how a
    // caller that reads only the first would produce a partial answer.
    return gzipSync(Buffer.from(`Date\tInstalls\n2026-08-0${n + 1}\t${(n + 1) * 100}\n`, 'utf-8'));
  });

  return { http: { get, downloadAsset }, downloaded };
}

const ctx = (http: unknown) => ({ http }) as unknown as AnalyticsContext;

describe('analytics__get_report', () => {
  it('declares a read-only tool with an outputSchema', () => {
    const tool = ANALYTICS_TOOLS[0];
    expect(tool.annotations?.readOnlyHint).toBe(true);
    expect(tool.outputSchema?.type).toBe('object');
  });

  it('walks the whole chain and returns rows, not a URL', async () => {
    const { http, downloaded } = fakeHttp();
    const result: any = await executeAnalyticsTool(
      'analytics__get_report',
      { app: 'Ask Quran', report: 'App Store Installations' },
      ctx(http)
    );

    expect(result.report).toBe('App Store Installations');
    // Newest instance, not the first one in the response.
    expect(result.processingDate).toBe('2026-08-08');
    expect(result.headers).toEqual(['Date', 'Installs']);
    // Both segments stitched — reading only the first is the silent-partial bug.
    expect(result.segments).toBe(2);
    expect(downloaded).toHaveLength(2);
    expect(result.rows).toEqual([
      { Date: '2026-08-01', Installs: '100' },
      { Date: '2026-08-02', Installs: '200' },
    ]);
    expect(result.totalRows).toBe(2);
    expect(result.truncated).toBe(false);
  });

  it('lists what is available when no report is named', async () => {
    const { http, downloaded } = fakeHttp();
    const result: any = await executeAnalyticsTool(
      'analytics__get_report',
      { app: 'Ask Quran' },
      ctx(http)
    );
    expect(result.available).toEqual([
      { name: 'App Store Installations', category: 'APP_USAGE' },
      { name: 'App Store Purchases', category: 'COMMERCE' },
    ]);
    expect(downloaded).toEqual([]);
  });

  it('narrows by category', async () => {
    const { http } = fakeHttp();
    const result: any = await executeAnalyticsTool(
      'analytics__get_report',
      { app: 'Ask Quran', category: 'COMMERCE' },
      ctx(http)
    );
    expect(result.available).toEqual([{ name: 'App Store Purchases', category: 'COMMERCE' }]);
  });

  it('says an ambiguous name is ambiguous instead of guessing', async () => {
    const { http } = fakeHttp();
    await expect(
      executeAnalyticsTool('analytics__get_report', { app: 'Ask Quran', report: 'app store' }, ctx(http))
    ).rejects.toThrow(/matches 2 reports/);
  });

  it('explains that no active request means Apple produces nothing', async () => {
    const { http } = fakeHttp({ stopped: true });
    await expect(
      executeAnalyticsTool('analytics__get_report', { app: 'Ask Quran' }, ctx(http))
    ).rejects.toThrow(/no active analytics report request/);
  });

  it('names the lag when an instance does not exist yet', async () => {
    const { http } = fakeHttp({ instances: [] });
    await expect(
      executeAnalyticsTool(
        'analytics__get_report',
        { app: 'Ask Quran', report: 'App Store Installations' },
        ctx(http)
      )
    ).rejects.toThrow(/lag of a day or more/);
  });

  it('caps rows and says so', async () => {
    const { http } = fakeHttp();
    const result: any = await executeAnalyticsTool(
      'analytics__get_report',
      { app: 'Ask Quran', report: 'App Store Installations', max_rows: 1 },
      ctx(http)
    );
    expect(result.rows).toHaveLength(1);
    expect(result.truncated).toBe(true);
    expect(result.note).toMatch(/Showing 1 of 2 rows/);
  });
});
