/**
 * What happens to the part of a response that did not fit.
 *
 * The size cap has always been the right call — one localization listing is
 * 264 KB and would otherwise crowd out the conversation. What was wrong was
 * that the cut part was simply gone, so the only way back to it was to run the
 * same query again with narrower parameters and pay for the whole thing twice.
 * It now goes to an MCP resource, which the client can read without any of it
 * passing through the model.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { generateKeyPairSync } from 'node:crypto';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer } from '../src/server.js';
import { resolveSelection } from '../src/profiles.js';
import { ResourceStore } from '../src/core/resources.js';
import type { ServerConfig } from '../src/core/config.js';

// A real ES256 key, because the tools here actually run: an unsignable one
// fails inside the request and is retried as if the network were down, which
// makes every assertion below pass against an error message.
const privateKey = generateKeyPairSync('ec', {
  namedCurve: 'P-256',
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  publicKeyEncoding: { type: 'spki', format: 'pem' },
}).privateKey;

const config: ServerConfig = {
  credentials: { keyId: 'TESTKEY123', issuerId: 'issuer', privateKey },
  readOnly: false,
  confirmWrites: 'off',
  includeDeprecated: false,
  dryRun: false,
};

async function connect() {
  const server = createServer(config, resolveSelection('app-info'));
  const [ct, st] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'resources', version: '0' }, { capabilities: {} });
  await Promise.all([server.connect(st), client.connect(ct)]);
  return client;
}

/** A listing far past any sane cap: 400 territories, each with a long name. */
const bigListing = () =>
  new Response(
    JSON.stringify({
      data: Array.from({ length: 400 }, (_, i) => ({
        type: 'territories',
        id: `T${i}`,
        attributes: { currency: 'USD', name: `Territory number ${i} `.repeat(20) },
      })),
    }),
    { status: 200, headers: { 'content-type': 'application/json' } }
  );

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.ASC_MAX_RESPONSE_CHARS;
});

describe('an oversized response', () => {
  it('is truncated in the text block and kept whole as a resource', async () => {
    process.env.ASC_MAX_RESPONSE_CHARS = '4000';
    vi.stubGlobal('fetch', vi.fn().mockImplementation(bigListing));

    const client = await connect();
    const res: any = await client.callTool({ name: 'territories__list', arguments: {} });

    const link = res.content.find((c: any) => c.type === 'resource_link');
    expect(link).toBeDefined();
    expect(link.uri).toMatch(/^asc-response:\/\/\d+\/territories__list\.json$/);

    // The text block still carries the answer, still under the cap, and says
    // where the rest is — a client that ignores resources is no worse off.
    const text = res.content[0].text;
    expect(text).toContain(link.uri);
    expect(JSON.parse(text.split('\n\nThe complete response')[0]).data.length).toBeLessThan(400);

    // The resource is the whole thing, not another truncation.
    const listed = await client.listResources();
    expect(listed.resources.map((r) => r.uri)).toContain(link.uri);
    const read: any = await client.readResource({ uri: link.uri });
    expect(JSON.parse(read.contents[0].text).data).toHaveLength(400);
  });

  it('adds no resource when the response fits', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ data: [{ type: 'territories', id: 'USA' }] }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      )
    );

    const client = await connect();
    const res: any = await client.callTool({ name: 'territories__list', arguments: {} });
    expect(res.content).toHaveLength(1);
    expect((await client.listResources()).resources).toHaveLength(0);
  });
});

describe('the store is bounded', () => {
  it('evicts the oldest rather than growing without limit', () => {
    const store = new ResourceStore(3);
    const uris = ['a', 'b', 'c', 'd'].map((n) => store.store(n, `{"${n}":1}`).uri);

    expect(store.list()).toHaveLength(3);
    expect(store.read(uris[0])).toBeUndefined();
    expect(store.read(uris[3])?.text).toBe('{"d":1}');
    // Newest first: a client listing resources wants the call it just made.
    expect(store.list()[0].uri).toBe(uris[3]);
  });

  it('evicts on total size too, and always keeps the newest', () => {
    const store = new ResourceStore(100, 50);
    store.store('old', 'x'.repeat(40));
    const newest = store.store('new', 'y'.repeat(40));

    expect(store.list()).toHaveLength(1);
    expect(store.read(newest.uri)).toBeDefined();
  });
});
