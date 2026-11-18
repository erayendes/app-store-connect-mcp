import { describe, it, expect, vi } from 'vitest';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { compareVersions, dailyUpdateNotice, installChannel, newerVersion, refreshDistTags } from '../src/core/update-check.js';

const envWith = () => ({ ASC_STATE_DIR: mkdtempSync(join(tmpdir(), 'heimdall-update-')) }) as NodeJS.ProcessEnv;
const tags = (body: Record<string, string>) => vi.fn().mockResolvedValue({ ok: true, json: async () => body });
const fetched = vi.fn().mockResolvedValue(true);

describe('update check', () => {
  it('orders versions with prereleases below their release', () => {
    const sorted = ['3.2.0', '3.1.1', '3.2.0-beta.10', '3.2.0-beta.2', '3.10.0'].sort(compareVersions);
    expect(sorted).toEqual(['3.1.1', '3.2.0-beta.2', '3.2.0-beta.10', '3.2.0', '3.10.0']);
  });

  it('asks npm at most once a day, and not at all when turned off', async () => {
    const env = envWith();
    const fetchImpl = tags({ latest: '3.2.0', beta: '3.3.0-beta.1' });
    await refreshDistTags('3.1.1', 'latest', env, 1_000, fetchImpl as any, fetched);
    await refreshDistTags('3.1.1', 'latest', env, 2_000, fetchImpl as any, fetched);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(newerVersion('3.1.1', 'latest', env)).toBe('3.2.0');
    expect(newerVersion('3.1.1', 'beta', env)).toBe('3.3.0-beta.1');
    expect(newerVersion('3.2.0', 'latest', env)).toBeUndefined();
    const offEnv = { ...envWith(), ASC_NO_UPDATE_CHECK: '1' };
    await refreshDistTags('3.1.1', 'latest', offEnv, 1_000, fetchImpl as any, fetched);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('survives npm being unreachable', async () => {
    const env = envWith();
    await refreshDistTags('3.1.1', 'latest', env, 1_000, vi.fn().mockRejectedValue(new Error('offline')) as any, fetched);
    expect(newerVersion('3.1.1', 'latest', env)).toBeUndefined();
  });

  it('fetches a newer release into the cache before recording it, and retries if that fails', async () => {
    const env = envWith();
    const failing = vi.fn().mockResolvedValue(false);
    await refreshDistTags('3.1.1', 'latest', env, 1_000, tags({ latest: '3.2.0' }) as any, failing);
    expect(failing).toHaveBeenCalledWith('3.2.0');
    expect(newerVersion('3.1.1', 'latest', env)).toBeUndefined();
    const working = vi.fn().mockResolvedValue(true);
    await refreshDistTags('3.1.1', 'latest', env, 2_000, tags({ latest: '3.2.0' }) as any, working);
    expect(newerVersion('3.1.1', 'latest', env)).toBe('3.2.0');
    const untouched = vi.fn();
    await refreshDistTags('3.2.0', 'latest', envWith(), 1_000, tags({ latest: '3.2.0' }) as any, untouched);
    expect(untouched).not.toHaveBeenCalled();
  });

  it('says it once a day across servers, on the first answer', async () => {
    const env = envWith();
    await refreshDistTags('3.1.1', 'latest', env, 1_000, tags({ latest: '3.2.0' }) as any, fetched);
    const day = new Date('2026-12-01T09:00:00Z');
    expect(dailyUpdateNotice('3.1.1', 'latest', env, day)).toMatch(/3\.2\.0 is out; this is 3\.1\.1.*restart/);
    expect(dailyUpdateNotice('3.1.1', 'latest', env, day)).toBeUndefined();
    expect(dailyUpdateNotice('3.1.1', 'latest', env, new Date('2026-12-02T09:00:00Z'))).toMatch(/restart/);
  });

  it('follows beta from @beta, and nothing when a plug-in pins the version', () => {
    const dir = mkdtempSync(join(tmpdir(), 'heimdall-npx-'));
    const manifest = join(dir, 'package.json');
    writeFileSync(manifest, JSON.stringify({ _npx: { packages: ['@erayendes/asc-mcp@beta'] } }));
    expect(installChannel('3.1.1', manifest)).toBe('beta');
    expect(installChannel('3.2.0-beta.1', join(dir, 'missing.json'))).toBe('beta');
    expect(installChannel('3.1.1', join(dir, 'missing.json'))).toBe('latest');
    writeFileSync(manifest, JSON.stringify({ _npx: { packages: ['@erayendes/asc-mcp@3.1.1'] } }));
    expect(installChannel('3.1.1', manifest)).toBeUndefined();
    expect(newerVersion('3.1.1', undefined)).toBeUndefined();
  });
});
