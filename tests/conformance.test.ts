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
import { describe, it, expect } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer } from '../src/server.js';
import { resolveSelection } from '../src/profiles.js';
import type { ServerConfig } from '../src/core/config.js';

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
  it('advertises the tools capability and identifies itself', async () => {
    const client = await connect('app-info');
    expect(client.getServerCapabilities()?.tools).toBeDefined();
    const info = client.getServerVersion();
    expect(info?.name).toBe('asc-app-info');
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
    const client = await connect('app-info');
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

  it('serves the same list twice — nothing is consumed by being listed', async () => {
    const client = await connect('app-info');
    const first = (await client.listTools()).tools.map((t) => t.name).sort();
    const second = (await client.listTools()).tools.map((t) => t.name).sort();
    expect(second).toEqual(first);
  });
});
