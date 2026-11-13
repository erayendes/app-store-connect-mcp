import { describe, it, expect, vi, afterEach } from 'vitest';
import { examplePrompts } from '../src/activation.js';
import { PROFILES, unknownProfileMessage, resolveSelection } from '../src/profiles.js';
import { adminRequestMessage, offerAdminHelp, KEYS_URL } from '../src/setup.js';
import { executeMetaTool } from '../src/tools/meta.js';
import { PACKAGE } from '../src/clients.js';

afterEach(() => vi.restoreAllMocks());

describe('activation prompts', () => {
  it('has three distinct copyable prompts for every profile', () => {
    for (const p of PROFILES) {
      const prompts = examplePrompts([p.name]);
      expect(prompts, p.name).toHaveLength(3);
      expect(new Set(prompts).size, p.name).toBe(3);
      expect(prompts.every((s) => s.length > 20 && !s.includes('\n'))).toBe(true);
    }
  });

  it('spreads the three examples across the registered profiles', () => {
    expect(examplePrompts(['analytics', 'marketing', 'monetization'])).toEqual([
      examplePrompts(['analytics'])[0], examplePrompts(['marketing'])[0], examplePrompts(['monetization'])[0],
    ]);
    expect(examplePrompts(['core', 'analytics'])).toEqual(examplePrompts(['analytics']));
    expect(examplePrompts(['app-info'])).toEqual(examplePrompts(['core']));
  });

  it('uses the selected slice rather than unrelated work in a large profile', () => {
    const prompts = examplePrompts(['monetization:transactions']);
    expect(prompts.every((p) => p.includes('transactions'))).toBe(true);
    expect(prompts.join(' ')).not.toMatch(/prices|preflight|offers/);
  });

  it('adds prompts only to an actually successful status connection check', async () => {
    const get = vi.fn().mockResolvedValue({ data: [{ id: 'app' }] });
    const ctx: any = {
      registry: { size: 1 }, http: { get, limiter: { status: () => ({}) } },
      tokens: { status: () => ({}) }, readOnly: true, loadedDomains: [],
      ownProfile: 'monetization', exampleSpecs: ['monetization:transactions'],
    };
    const result: any = await executeMetaTool('asc__status', {}, ctx);
    expect(result.connection.ok).toBe(true);
    expect(result.examplePrompts).toEqual(examplePrompts(['monetization:transactions']));
    expect(get).toHaveBeenCalledTimes(1);
    const unchecked: any = await executeMetaTool('asc__status', { check_connection: false }, ctx);
    expect(unchecked.examplePrompts).toBeUndefined();
    get.mockRejectedValue(new Error('offline'));
    const failed: any = await executeMetaTool('asc__status', {}, ctx);
    expect(failed.connection.ok).toBe(false);
    expect(failed.examplePrompts).toBeUndefined();
  });
});

describe('setup without an API key', () => {
  it('prints an admin message with the selected role and stops cleanly', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const ask = vi.fn().mockResolvedValue('h');
    expect(await offerAdminHelp(ask, 'Sales')).toBe(true);
    const output = log.mock.calls.flat().join('\n');
    expect(output).toContain(adminRequestMessage('Sales'));
    expect(output).toContain(KEYS_URL);
    expect(output).toContain('Sales role');
    expect(output).toContain('Nothing was changed');
    expect(output).toContain('secure handover');
    expect(ask).toHaveBeenCalledTimes(1);
  });

  it('continues the existing key flow when Enter is chosen', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    expect(await offerAdminHelp(vi.fn().mockResolvedValue(''), 'App Manager')).toBe(false);
    expect(log).not.toHaveBeenCalled();
  });
});
