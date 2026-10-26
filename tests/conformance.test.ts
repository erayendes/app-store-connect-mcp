/**
 * Protocol conformance — the shape of what a client receives, not what any one
 * tool does.
 *
 * Everything else in this directory tests behaviour through a client that we
 * also wrote. These assert the contract the SDK and the MCP specification
 * impose, which is the half a passing suite can hide: a tool name that a strict
 * client rejects, a missing inputSchema, an unknown tool answered as a protocol
 * error instead of a tool error. None of it fails loudly in development,
 * because our own client is forgiving.
 */
import { describe, it, expect, vi } from 'vitest';
import { Client, InMemoryTransport } from '@modelcontextprotocol/client';
import { createServer } from '../src/server.js';
import { resolveSelection } from '../src/profiles.js';
import type { ServerConfig } from '../src/core/config.js';
import { AscHttpClient } from '../src/core/http.js';

const config: ServerConfig = {
  credentials: { keyId: 'TESTKEY123', issuerId: 'issuer', privateKey: 'not-used-here' },
  readOnly: false,
  confirmWrites: 'off',
  includeDeprecated: false,
  dryRun: true,
};

async function connect(spec?: string, overrides: Partial<ServerConfig> = {}) {
  const server = createServer({ ...config, ...overrides }, spec ? resolveSelection(spec) : undefined);
  const [ct, st] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'conformance', version: '0' }, { capabilities: {} });
  await Promise.all([server.connect(st), client.connect(ct)]);
  return client;
}

describe('what a client receives', () => {
  it('calls subscription preflight under --read-only and validates its structured result', async () => {
    const get = vi.spyOn(AscHttpClient.prototype, 'get').mockImplementation(async (path) => {
      if (path === '/v1/apps/1') return { data: { id: '1', attributes: { name: 'Example' } } } as any;
      if (path.endsWith('/subscriptionGroups')) return { data: [{ id: 'g1' }] } as any;
      if (path.endsWith('/subscriptions')) return { data: [{ id: 's1', attributes: { productId: 'monthly', name: 'Monthly' } }] } as any;
      return { data: path.endsWith('/appStoreReviewScreenshot') ? null : [] } as any;
    });
    const client = await connect('monetization:subscription', { readOnly: true });
    try {
      // listTools registers output-schema validators in the SDK client.
      const tool = (await client.listTools()).tools.find((t) => t.name === 'preflight__check_subscription')!;
      // No top-level oneOf: several client APIs reject it in a tool schema.
      // The handler enforces exactly one of subscription or group instead.
      expect(tool.inputSchema).not.toHaveProperty('oneOf');
      const result = await client.callTool({ name: 'preflight__check_subscription', arguments: { app: '1', group: 'g1' } });
      expect(result.isError).not.toBe(true);
      expect(result.structuredContent).toMatchObject({ group: { id: 'g1', ready: false }, subscriptions: [{ id: 's1', ready: false }] });
    } finally {
      await client.close();
      get.mockRestore();
    }
  });
  it.each([false, true])('isolates the two preflight macros by exact profile membership (readOnly=%s)', async (readOnly) => {
    for (const [profile, offered, hidden] of [
      ['monetization:subscription', 'preflight__check_subscription', 'preflight__check_version'],
      ['distribution:version', 'preflight__check_version', 'preflight__check_subscription'],
    ]) {
      const client = await connect(profile, { readOnly });
      try {
        const tools = (await client.listTools()).tools;
        expect(tools.map((t) => t.name)).toContain(offered);
        expect(tools.map((t) => t.name)).not.toContain(hidden);
        const tool = tools.find((t) => t.name === offered)!;
        expect(tool.annotations?.readOnlyHint).toBe(true);
        expect(tool.outputSchema).toBeTruthy();
        const res = await client.callTool({ name: hidden, arguments: { app: '1', subscription: 's1' } });
        expect(res.isError).toBe(true);
      } finally {
        await client.close();
      }
    }
  });
  it('advertises the tools capability and identifies itself', async () => {
    const client = await connect('general');
    expect(client.getServerCapabilities()?.tools).toBeDefined();
    const info = client.getServerVersion();
    expect(info?.name).toBe('ASC-General');
    // A version a client can report back is how a bug lands with a number
    // attached instead of "the App Store one".
    expect(info?.version).toMatch(/^\d+\.\d+\.\d+/);
  });

  /**
   * MCP pins tool names to ^[a-zA-Z0-9_-]{1,128}$. Apple's operation ids are
   * dotted, so every name here is encoded on the way out — and a client that
   * enforces the pattern drops the whole list rather than the one bad entry.
   */
  it('gives every tool a name the specification allows', async () => {
    const client = await connect('monetization');
    const bad = (await client.listTools()).tools
      .map((t) => t.name)
      .filter((n) => !/^[a-zA-Z0-9_-]{1,128}$/.test(n));
    expect(bad).toEqual([]);
  });

  it('gives every tool a description and an object input schema', async () => {
    const client = await connect('monetization');
    const wrong = (await client.listTools()).tools
      .filter((t) => !t.description || t.inputSchema?.type !== 'object')
      .map((t) => t.name);
    expect(wrong).toEqual([]);
  });

  /**
   * A tool that fails is a RESULT with isError, not a JSON-RPC error. The
   * difference matters: a protocol error aborts the client's turn, while a tool
   * error is something the model can read and route around.
   */
  it('answers an unknown tool as a tool error, not a protocol error', async () => {
    // Narrowed, so asc__call is offered and has to judge the name itself.
    const client = await connect('general:legal');
    const res: any = await client.callTool({ name: 'asc__call', arguments: { tool: 'nope__nope' } });
    expect(res.isError).toBe(true);
    expect(String(res.content?.[0]?.text ?? '')).toMatch(/nope__nope|not a tool|Unknown/i);
  });

  it('hides every mutating tool under --read-only rather than refusing it later', async () => {
    const client = await connect('monetization', { readOnly: true });
    const mutating = (await client.listTools()).tools.filter(
      (t) => t.annotations?.readOnlyHint === false
    );
    expect(mutating.map((t) => t.name)).toEqual([]);
  });

  it.each([
    ['in-app-purchases', 'pricing__get_iap_price'],
    ['app-price', 'pricing__get_app_price'],
  ])('offers only %s pricing reads in its read-only sub-profile', async (sub, expected) => {
    const client = await connect(`monetization:${sub}`, { readOnly: true });
    const tools = (await client.listTools()).tools.filter((t) => t.name.startsWith('pricing__'));
    expect(tools.map((t) => t.name)).toEqual([expected]);
    expect(tools[0].annotations?.readOnlyHint).toBe(true);
  });

  it('offers the IAP price write only when the server can write', async () => {
    const names = async (readOnly: boolean) =>
      (await (await connect('monetization:in-app-purchases', { readOnly })).listTools()).tools
        .filter((t) => t.name.startsWith('pricing__'))
        .map((t) => t.name)
        .sort();
    expect(await names(false)).toEqual(['pricing__equalize_price', 'pricing__get_iap_price', 'pricing__set_iap_price']);
    expect(await names(true)).toEqual(['pricing__get_iap_price']);
  });

  /**
   * 3.0's split: app lookup, search and the media macros live in ASC-Core and
   * nowhere else, so a profile server is smaller by all of them — and says so
   * once, in its instructions, rather than leaving the model to look for
   * apps__list here.
   */
  it('keeps core tools in core, and points a profile server at it', async () => {
    const profile = await connect('testflight');
    const names = (await profile.listTools()).tools.map((t) => t.name);
    expect(names).toContain('asc__status');
    for (const absent of ['apps__list', 'asc__search_tools', 'asc__discover_domains', 'listing__upload_screenshot']) {
      expect(names).not.toContain(absent);
    }
    expect(profile.getInstructions()).toContain('ASC-Core');

    const core = await connect('core');
    const coreNames = (await core.listTools()).tools.map((t) => t.name);
    expect(core.getServerVersion()?.name).toBe('ASC-Core');
    for (const present of ['apps__list', 'asc__search_tools', 'asc__discover_domains', 'listing__upload_screenshot']) {
      expect(coreNames).toContain(present);
    }
    // Listed once: core's sheet rows name it and every server adds it.
    expect(coreNames.filter((n) => n === 'asc__status')).toHaveLength(1);
    expect(core.getInstructions()).not.toContain('ASC-Core');
  });

  it('folds core into one server with --with-core', async () => {
    const client = await connect('testflight', { withCore: true });
    const names = (await client.listTools()).tools.map((t) => t.name);
    for (const present of ['beta_groups__create', 'apps__list', 'asc__search_tools', 'listing__get_screenshots']) {
      expect(names).toContain(present);
    }
    expect(names.length).toBe(new Set(names).size);
    expect(client.getInstructions()).not.toContain('ASC-Core');
  });

  it('hides the write macros in core under --read-only', async () => {
    const names = (await (await connect('core', { readOnly: true })).listTools()).tools.map((t) => t.name);
    expect(names).toContain('listing__get_screenshots');
    expect(names).not.toContain('listing__upload_screenshot');
    expect(names).not.toContain('listing__upload_asset');
    expect(names).not.toContain('listing__delete_assets');
  });

  it('refuses a meta tool that lives in core, naming core', async () => {
    const client = await connect('testflight');
    const res: any = await client.callTool({ name: 'asc__search_tools', arguments: { query: 'beta group' } });
    expect(res.isError).toBe(true);
    expect(String(res.content?.[0]?.text)).toMatch(/ASC-Core/);
  });

  it('answers discovery in core with every profile', async () => {
    const client = await connect('core');
    const res: any = await client.callTool({ name: 'asc__discover_domains', arguments: {} });
    const body = JSON.parse(res.content[0].text);
    expect(body.profiles.map((p: any) => p.name)).toEqual(expect.arrayContaining(['monetization', 'general', 'core']));
    expect(body.profiles.find((p: any) => p.name === 'testflight')).toMatchObject({ server: 'ASC-TestFlight' });
  });

  it('serves the same list twice — nothing is consumed by being listed', async () => {
    const client = await connect('general');
    const first = (await client.listTools()).tools.map((t) => t.name).sort();
    const second = (await client.listTools()).tools.map((t) => t.name).sort();
    expect(second).toEqual(first);
  });
});
