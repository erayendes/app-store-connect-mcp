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

  it('exposes the code-signing profile as "provisioning", not the old name', () => {
    expect(resolveProfile('provisioning')?.domains).toEqual(['provisioning']);
    expect(profileForDomain('provisioning')?.name).toBe('provisioning');
    expect(resolveProfile('account-management')).toBeUndefined(); // renamed, no alias
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

describe('credential format validators (catch paste errors at the prompt)', () => {
  it('accepts real-shaped Key IDs, rejects obvious mistakes', async () => {
    const { isValidKeyId } = await import('../src/setup.js');
    expect(isValidKeyId('ABC123XYZ9')).toBe(true);
    expect(isValidKeyId('  ABC123XYZ9  ')).toBe(true); // trimmed
    expect(isValidKeyId('')).toBe(false);
    expect(isValidKeyId('short')).toBe(false);
    expect(isValidKeyId('has-a-dash-1')).toBe(false);
    expect(isValidKeyId('me@example.com')).toBe(false);
  });

  it('accepts a UUID Issuer ID, rejects malformed ones', async () => {
    const { isValidIssuerId } = await import('../src/setup.js');
    expect(isValidIssuerId('57246e4f-1a2b-4c3d-9e8f-0123456789ab')).toBe(true);
    expect(isValidIssuerId('')).toBe(false);
    expect(isValidIssuerId('57246e4f1a2b4c3d9e8f0123456789ab')).toBe(false); // no dashes
    expect(isValidIssuerId('57246e4f-1a2b-4c3d-9e8f')).toBe(false); // truncated
    expect(isValidIssuerId('ABC123XYZ9')).toBe(false); // a Key ID, not a UUID
  });
});

describe('classifyVerifyError (offline saves, 401 re-prompts)', () => {
  it('treats 401/403 as invalid and everything else as unreachable', async () => {
    const { classifyVerifyError } = await import('../src/setup.js');
    const { AscApiError } = await import('../src/core/errors.js');
    expect(classifyVerifyError(new AscApiError('unauthorized', 401))).toBe('invalid');
    expect(classifyVerifyError(new AscApiError('forbidden', 403))).toBe('invalid');
    expect(classifyVerifyError(new AscApiError('network', 0))).toBe('unreachable'); // offline
    expect(classifyVerifyError(new AscApiError('server', 500))).toBe('unreachable'); // Apple hiccup
    expect(classifyVerifyError(new Error('bad key'))).toBe('invalid'); // token signing failed
  });
});

import { registerCommand } from '../src/profiles.js';
import { STOREKIT_TOOLS } from '../src/storekit/index.js';

describe('AI-136 improvements', () => {
  it('registerCommand emits a runnable claude mcp add line', () => {
    expect(registerCommand('monetization')).toBe(
      'claude mcp add -s user asc-monetization -- npx -y @erayendes/asc-mcp monetization'
    );
  });

  it('every StoreKit tool accepts an optional environment override', () => {
    for (const t of STOREKIT_TOOLS) {
      const env = (t.inputSchema.properties as Record<string, any>).environment;
      expect(env?.enum).toEqual(['Production', 'Sandbox']);
    }
    // environment is optional — never forced into required
    for (const t of STOREKIT_TOOLS) {
      expect(t.inputSchema.required ?? []).not.toContain('environment');
    }
  });
});
