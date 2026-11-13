/** Real MCP and the real gate; the demo's HTTP handler runs in memory, without a port. */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateKeyPairSync } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { Client, InMemoryTransport } from '@modelcontextprotocol/client';
import { createServer } from '../src/server.js';
import { resolveSelection } from '../src/profiles.js';
import { serverName } from '../src/clients.js';
import { createDemoFixtureHandler } from '../assets/demo/fixture-server.mjs';

const CALL = {
  name: 'pricing__equalize_price',
  arguments: {
    app: 'Nimbus Notes', product_type: 'subscription', product: 'weekly',
    territory: 'USA', price: '4.99', preserve_current_price: true,
  },
};
const READ = {
  name: 'pricing__get_subscription_price',
  arguments: { app: 'Nimbus Notes', subscription: 'weekly' },
};
const privateKey = generateKeyPairSync('ec', {
  namedCurve: 'P-256',
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  publicKeyEncoding: { type: 'spki', format: 'pem' },
}).privateKey;
const cleanup: Array<() => void | Promise<void>> = [];

afterEach(async () => {
  for (const close of cleanup.splice(0).reverse()) await close();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function fixture() {
  const handle = createDemoFixtureHandler();
  const baseUrl = 'http://127.0.0.1:8787';
  const posts: string[] = [];
  vi.stubGlobal('fetch', async (input: string | URL, init?: RequestInit) => {
    const url = new URL(String(input));
    if (url.origin !== baseUrl) throw new Error('The demo must never contact an upstream account');
    const method = init?.method ?? 'GET';
    if (method === 'POST') posts.push(url.pathname);
    const req = Object.assign(Readable.from(init?.body ? [Buffer.from(String(init.body))] : []), {
      method, url: `${url.pathname}${url.search}`,
    });
    let status = 200;
    let headers: Record<string, string> = {};
    let body = '';
    await handle(req, {
      writeHead(code: number, values: Record<string, string>) { status = code; headers = values; },
      end(value: string) { body = value; },
    });
    return new Response(body, { status, headers });
  });
  return { baseUrl, posts };
}

async function connect(baseUrl: string, answer: 'CONFIRM' | 'decline' | 'unsupported') {
  const stateDir = mkdtempSync(join(tmpdir(), 'heimdall-demo-test-'));
  vi.stubEnv('ASC_STATE_DIR', stateDir);
  cleanup.push(() => { rmSync(stateDir, { recursive: true, force: true }); });
  const [ct, st] = InMemoryTransport.createLinkedPair();
  const server = createServer({
    credentials: { keyId: 'DEMO123456', issuerId: 'demo', privateKey },
    baseUrl, readOnly: false, dryRun: false, confirmWrites: 'strong', nativeConfirm: false,
  }, resolveSelection('monetization:subscription'));
  const client = new Client({ name: 'claude-code', version: 'demo-test' }, {
    capabilities: answer === 'unsupported' ? {} : { elicitation: { form: {} } },
  });
  const prompts: any[] = [];
  if (answer !== 'unsupported') {
    client.setRequestHandler('elicitation/create', async (req) => {
      prompts.push(req.params);
      if (answer === 'decline') return { action: 'decline' };
      return { action: 'accept', content: { confirmation: answer } };
    });
  }
  await server.connect(st);
  await client.connect(ct);
  cleanup.push(async () => { await client.close(); await server.close(); });
  return { client, prompts };
}

function data(result: any): any {
  expect(result.isError ?? false, result.content?.[0]?.text).toBe(false);
  return result.structuredContent ?? JSON.parse(result.content[0].text);
}

describe('the pricing recording', () => {
  it('uses the current profile and the case-sensitive Claude tool prefix', () => {
    const config = JSON.parse(readFileSync('assets/demo/mcp-config.json', 'utf8'));
    const name = serverName('monetization');
    expect(Object.keys(config.mcpServers)).toEqual([name]);
    const entry = config.mcpServers[name];
    expect(entry.args).toEqual(['dist/index.js', 'monetization:subscription', '--confirm']);
    expect(entry.env).toMatchObject({
      ASC_BASE_URL: 'http://127.0.0.1:8787', ASC_NATIVE_CONFIRM: '0',
      ASC_PRIVATE_KEY: '', ASC_PRIVATE_KEY_KEYCHAIN: '', ASC_DRY_RUN: 'false', ASC_READ_ONLY: 'false',
    });
    const tape = readFileSync('assets/demo/pricing.tape', 'utf8');
    expect(tape).toContain(`mcp__${name}__pricing__equalize_price`);
    expect(tape).toContain(`mcp__${name}__pricing__get_subscription_price`);
    expect(readFileSync('assets/demo/demo.tape', 'utf8')).toContain(`mcp__${name}__pricing__get_subscription_price`);
  });

  it('requires the real CONFIRM form, writes 22 derived prices and reads the new currencies', async () => {
    const { baseUrl, posts } = fixture();
    const { client, prompts } = await connect(baseUrl, 'CONFIRM');
    const before = data(await client.callTool(READ)).prices[0];
    expect(before.byPrice.find((p: any) => p.currency === 'USD').customerPrice).toBe('3.99');
    const result = data(await client.callTool(CALL));
    expect(prompts).toHaveLength(1);
    expect(prompts[0]).toMatchObject({
      mode: 'form', requestedSchema: {
        required: ['confirmation'], properties: { confirmation: { type: 'string', title: 'Type CONFIRM to proceed' } },
      },
    });
    expect(prompts[0].message).toContain('REVENUE-level write');
    expect(prompts[0].message).toContain('existing subscribers keep their current price');
    expect(result).toMatchObject({ ok: true, written: 22, changed: { anchor: '4.99 (USA)', preserveCurrentPrice: true } });
    expect(posts).toEqual(Array(22).fill('/v1/subscriptionPrices'));
    const after = data(await client.callTool(READ)).prices[0];
    const groups = Object.fromEntries(after.byPrice.map((p: any) => [p.currency, p.customerPrice]));
    expect(groups).toEqual({ USD: '4.99', EUR: '5.99', TRY: '199.99', JPY: '700', AUD: '7.99', AED: '19.99' });
    expect(after.byPrice.flatMap((p: any) => p.territories)).toHaveLength(22);
  });

  it.each(['decline', 'unsupported'] as const)('sends no writes when elicitation is %s', async (answer) => {
    const { baseUrl, posts } = fixture();
    const { client } = await connect(baseUrl, answer);
    const result: any = await client.callTool(CALL);
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain(answer === 'decline' ? 'not confirmed (decline)' : 'no confirmation prompt could be shown');
    expect(result.content[0].text).toContain('Nothing was changed.');
    expect(posts).toEqual([]);
    expect(data(await client.callTool(READ)).prices[0].byPrice.find((p: any) => p.currency === 'USD').customerPrice).toBe('3.99');
  });

  it('rejects malformed writes and never forwards unknown routes', async () => {
    const { baseUrl } = fixture();
    const bad = await fetch(`${baseUrl}/v1/subscriptionPrices`, { method: 'POST', body: '{' });
    expect(bad.status).toBe(400);
    expect((await fetch(`${baseUrl}/v1/not-a-demo-resource`)).status).toBe(404);
    expect((await fetch(`${baseUrl}/v1/apps`, { method: 'DELETE' })).status).toBe(404);
  });
});
