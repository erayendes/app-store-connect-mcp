import { describe, it, expect } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  PROFILES,
  CORE_OPERATIONS,
  resolveProfile,
  resolveSelection,
  operationsFor,
  profilesForOperation,
} from '../src/profiles.js';
import { ToolRegistry } from '../src/core/registry.js';
import { OPERATIONS } from '../src/generated/operations.js';
import { loadConfig } from '../src/core/config.js';
import { readSharedConfig, writeSharedConfig } from '../src/core/shared-config.js';

describe('profiles', () => {
  it('resolves a known profile and rejects an unknown one', () => {
    expect(resolveProfile('monetization')?.subProfiles.map((s) => s.name)).toContain('subscriptions');
    expect(resolveProfile('nonsense')).toBeUndefined();
    expect(profilesForOperation('game_center_details.get')).toEqual(['game-center']);
  });

  it('exposes the code-signing profile as "provisioning", not the old name', () => {
    expect(resolveProfile('provisioning')).toBeTruthy();
    expect(profilesForOperation('profiles.create')).toEqual(['provisioning']);
    expect(resolveProfile('account-management')).toBeUndefined(); // renamed, no alias
  });

  it('loads the profile tools plus the core set, and nothing else', () => {
    const registry = new ToolRegistry({
      operations: operationsFor(resolveSelection('analytics')),
      readOnly: false,
      includeDeprecated: false,
    });
    const names = new Set(registry.listTools().map((t) => t.name));
    expect(names.has('sales_reports__list')).toBe(true);
    expect(names.has('apps__list')).toBe(true); // core
    expect(names.has('apps__get')).toBe(true); // core
    expect(names.has('game_center_details__get')).toBe(false);
    // core must not drag the whole apps domain in
    expect(names.has('apps__app_infos__list')).toBe(false);
  });

  /**
   * The reason this profile structure exists: `asc-monetization` could not list
   * an app's subscription groups, because the entry point sat in app-info.
   */
  it('reaches an app\'s subscription groups from the monetization profile', () => {
    const ops = operationsFor(resolveSelection('monetization'));
    expect(ops).toContain('apps.subscription_groups.list');
    expect(operationsFor(resolveSelection('marketing'))).toContain('apps.customer_reviews.list');
    expect(operationsFor(resolveSelection('access'))).toContain('apps.beta_groups.list');
    expect(operationsFor(resolveSelection('webhooks'))).toContain('apps.webhooks.list');
  });

  it('narrows a profile to some of its sub-profiles', () => {
    const whole = operationsFor(resolveSelection('monetization'));
    const part = operationsFor(resolveSelection('monetization:subscriptions'));
    expect(part.length).toBeLessThan(whole.length);
    expect(part).toContain('apps.subscription_groups.list');
    expect(part).not.toContain('win_back_offers.create');
    // core rides along whatever is selected
    for (const op of CORE_OPERATIONS) expect(part).toContain(op);
  });

  it('names the available sub-profiles when one is misspelled', () => {
    expect(() => resolveSelection('monetization:subscriptons')).toThrow(/subscriptions/);
    expect(() => resolveSelection('webhooks:anything')).toThrow(/no sub-profiles/);
  });

  it('every profile stays well under the monolith size', () => {
    for (const p of PROFILES) {
      const registry = new ToolRegistry({
        operations: operationsFor(resolveSelection(p.name)),
        readOnly: false,
        includeDeprecated: false,
      });
      expect(registry.size).toBeGreaterThan(0);
      expect(registry.size).toBeLessThan(300);
    }
  });

  it('points at the sibling server when a tool lives elsewhere', async () => {
    const registry = new ToolRegistry({
      operations: operationsFor(resolveSelection('analytics')),
      readOnly: false,
      includeDeprecated: false,
      missingToolHint: (op) =>
        `It is served by the "asc-${profilesForOperation(op.name)[0]}" MCP server.`,
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
