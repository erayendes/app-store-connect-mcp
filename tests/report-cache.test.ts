/**
 * A cached report is only right if its period can no longer change. The risk
 * is a stale answer served as fact, so what must hold is the boundary: a
 * finished period is cached, today's and last week's never are, and an Apple
 * error is never stored.
 */
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { cachedReport, cacheReport, periodEnd } from '../src/core/report-cache.js';

const env = () => ({ ASC_STATE_DIR: mkdtempSync(join(tmpdir(), 'cache-')) }) as NodeJS.ProcessEnv;
const blob = { contentType: 'application/a-gzip', base64: gzipSync('Units\n1\n').toString('base64') };
const iso = (ms: number) => new Date(ms).toISOString().slice(0, 10);

describe('report cache', () => {
  it('knows where each period ends', () => {
    expect(iso(periodEnd('2026-02')!)).toBe('2026-02-28');
    expect(iso(periodEnd('2025')!)).toBe('2025-12-31');
    expect(iso(periodEnd('2026-03-02', 'WEEKLY')!)).toBe('2026-03-08');
    expect(periodEnd('last month')).toBeUndefined();
  });

  it('keeps a finished period and hands it back', () => {
    const e = env();
    const query = { 'filter[reportDate]': '2025-06', 'filter[frequency]': 'MONTHLY', 'filter[vendorNumber]': '1' };
    cacheReport('A/K1@api', '/v1/salesReports', query, blob, e);
    expect(cachedReport('A/K1@api', '/v1/salesReports', query, e)).toEqual(blob);
    // A different vendor is a different report.
    expect(cachedReport('A/K1@api', '/v1/salesReports', { ...query, 'filter[vendorNumber]': '2' }, e)).toBeUndefined();
    // Another key never reads it, even with the same vendor number.
    expect(cachedReport('B/K2@api', '/v1/salesReports', query, e)).toBeUndefined();
  });

  it('never keeps a body that does not unzip', () => {
    const e = env();
    const query = { 'filter[reportDate]': '2025-06' };
    cacheReport('A/K1@api', '/v1/salesReports', query, { base64: 'not gzip' }, e);
    expect(cachedReport('A/K1@api', '/v1/salesReports', query, e)).toBeUndefined();
  });

  it('never keeps a period that may still change', () => {
    const e = env();
    const query = { 'filter[reportDate]': iso(Date.now() - 3 * 86_400_000), 'filter[frequency]': 'DAILY' };
    cacheReport('A/K1@api', '/v1/salesReports', query, blob, e);
    expect(cachedReport('A/K1@api', '/v1/salesReports', query, e)).toBeUndefined();
  });
});
