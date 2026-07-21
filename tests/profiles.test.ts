import { describe, it, expect } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PROFILES, resolveProfile, profileForDomain, GATEWAY_OPERATIONS } from '../src/profiles.js';
import { ToolRegistry, ALL_DOMAINS } from '../src/core/registry.js';
import { OPERATIONS } from '../src/generated/operations.js';
import { loadConfig } from '../src/core/config.js';
import { readSharedConfig, writeSharedConfig } from '../src/core/shared-config.js';

describe('profiles', () => {
  it('covers every domain exactly once across all profiles', () => {
    const covered = PROFILES.flatMap((p) => p.domains);
    expect(new Set(covered).size).toBe(covered.length); // no domain in two profiles
    for (const d of ALL_DOMAINS) {
      if (d === 'meta') continue; // meta tools ship with every server
      expect(covered).toContain(d);
    }
  });

  it('resolves a known profile and rejects an unknown one', () => {
    expect(resolveProfile('monetization')?.domains).toContain('subscriptions');
    expect(resolveProfile('nonsense')).toBeUndefined();
    expect(profileForDomain('game_center')?.name).toBe('game-center');
  });

  it('loads only the profile domains plus gateway tools', () => {
    const p = resolveProfile('analytics')!;
    const registry = new ToolRegistry({
      domains: p.domains,
      readOnly: false,
      includeDeprecated: false,
      extraOperations: GATEWAY_OPERATIONS,
    });
    const names = new Set(registry.listTools().map((t) => t.name));
    expect(names.has('sales_reports__list')).toBe(true);
    expect(names.has('apps__list')).toBe(true); // gateway
    expect(names.has('apps__get')).toBe(true); // gateway
    expect(names.has('game_center_details__get')).toBe(false);
    // gateway must not drag the whole apps domain in
    expect(names.has('apps__app_infos__list')).toBe(false);
  });

  it('every profile stays well under the monolith size', () => {
    for (const p of PROFILES) {
      const registry = new ToolRegistry({
        domains: p.domains,
        readOnly: false,
        includeDeprecated: false,
        extraOperations: GATEWAY_OPERATIONS,
      });
      expect(registry.size).toBeGreaterThan(0);
      expect(registry.size).toBeLessThan(300);
    }
  });

  it('points at the sibling server when a tool lives elsewhere', async () => {
    const p = resolveProfile('analytics')!;
    const registry = new ToolRegistry({
      domains: p.domains,
      readOnly: false,
      includeDeprecated: false,
      extraOperations: GATEWAY_OPERATIONS,
      unloadedDomainHint: (domain) =>
        `It is served by the "asc-${profileForDomain(domain)?.name}" MCP server.`,
    });
    await expect(
      registry.execute('subscriptions__get', { id: 'x' }, {} as never)
    ).rejects.toThrow(/asc-monetization/);
  });
});

describe('shared config fallback', () => {
  const withDir = (fn: (dir: string) => void) => {
    const dir = mkdtempSync(join(tmpdir(), 'asc-shared-'));
    try { fn(dir); } finally { rmSync(dir, { recursive: true, force: true }); }
  };

  it('round-trips through write and read', () => {
    withDir((dir) => {
      const env = { ASC_CONFIG_DIR: dir } as NodeJS.ProcessEnv;
      writeSharedConfig({ keyId: 'K1', issuerId: 'I1', vendorNumber: '9' }, env);
      expect(readSharedConfig(env)).toMatchObject({ keyId: 'K1', vendorNumber: '9' });
    });
  });

  it('feeds loadConfig when the environment is empty', () => {
    withDir((dir) => {
      writeFileSync(join(dir, 'config.json'), JSON.stringify({
        keyId: 'SHAREDKEY', issuerId: 'SHAREDISS', privateKeyPath: '/tmp/x.p8',
        vendorNumber: '424242', bundleId: 'com.example.app',
      }));
      const saved = { ...process.env };
      for (const k of Object.keys(process.env)) if (k.startsWith('ASC_')) delete process.env[k];
      process.env.ASC_CONFIG_DIR = dir;
      try {
        const cfg = loadConfig([]);
        expect(cfg.credentials.keyId).toBe('SHAREDKEY');
        expect(cfg.vendorNumber).toBe('424242');
        expect(cfg.storekit?.bundleId).toBe('com.example.app');
      } finally {
        process.env = saved;
      }
    });
  });

  it('lets the environment win outright over the shared file', () => {
    withDir((dir) => {
      writeFileSync(join(dir, 'config.json'), JSON.stringify({
        keyId: 'SHAREDKEY', issuerId: 'SHAREDISS', privateKeyPath: '/tmp/x.p8',
      }));
      const saved = { ...process.env };
      for (const k of Object.keys(process.env)) if (k.startsWith('ASC_')) delete process.env[k];
      Object.assign(process.env, {
        ASC_CONFIG_DIR: dir, ASC_KEY_ID: 'ENVKEY', ASC_ISSUER_ID: 'ENVISS',
        ASC_PRIVATE_KEY_PATH: '/tmp/env.p8',
      });
      try {
        expect(loadConfig([]).credentials.keyId).toBe('ENVKEY');
      } finally {
        process.env = saved;
      }
    });
  });

  it('suggests setup when nothing is configured', () => {
    withDir((dir) => {
      const saved = { ...process.env };
      for (const k of Object.keys(process.env)) if (k.startsWith('ASC_')) delete process.env[k];
      process.env.ASC_CONFIG_DIR = dir; // empty dir: no config.json
      try {
        expect(() => loadConfig([])).toThrow(/setup/);
      } finally {
        process.env = saved;
      }
    });
  });
});

describe('cleanPath (drag-and-drop friendly .p8 entry)', () => {
  it('strips quotes, unescapes spaces, expands ~', async () => {
    const { cleanPath } = await import('../src/setup.js');
    const home = process.env.HOME ?? '';
    expect(cleanPath('  "/a/App Store Connect/k.p8"  ')).toBe('/a/App Store Connect/k.p8');
    expect(cleanPath("'/a/App Store Connect/k.p8'")).toBe('/a/App Store Connect/k.p8');
    expect(cleanPath('/a/App\\ Store\\ Connect/k.p8')).toBe('/a/App Store Connect/k.p8');
    expect(cleanPath('~/Documents/k.p8')).toBe(`${home}/Documents/k.p8`);
    expect(cleanPath('/plain/no-space.p8')).toBe('/plain/no-space.p8');
  });

  it('does not leak a real key id as the example prompt', () => {
    const src = readFileSync(new URL('../src/setup.ts', import.meta.url), 'utf8');
    expect(src).not.toMatch(/7RDCD6GXG6/);
  });
});
