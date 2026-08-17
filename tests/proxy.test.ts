/**
 * asc__describe / asc__call — the path that works regardless of when a client
 * refreshes its tool list.
 *
 * Measured before this existed: given a read that lives in an unloaded
 * sub-profile, Claude Code loaded it and used it in the same turn, while Codex
 * loaded it and then reported that "the session tool list never made the new
 * tools callable" — and gave up without an answer. These two tools remove the
 * dependency: they are in the list from the start.
 *
 * Driven through a real MCP client over the in-memory transport, so the tool
 * list and the dispatch are the ones a client actually sees. Nothing here
 * touches the network.
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

async function connect(spec: string) {
  const server = createServer(config, resolveSelection(spec));
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'test', version: '0' }, { capabilities: {} });
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return client;
}

/** The SDK returns errors as isError results, not throws. */
const textOf = (res: any): string => res.content?.[0]?.text ?? '';

describe('the client-independent path', () => {
  it('offers the proxy from the first tool list, before anything is loaded', async () => {
    const client = await connect('monetization:subscription-catalog');
    const names = (await client.listTools()).tools.map((t) => t.name);
    expect(names).toContain('asc__describe');
    expect(names).toContain('asc__call');
    // The thing we are proxying to is genuinely absent — otherwise this proves nothing.
    expect(names).not.toContain('apps__app_price_schedule__get');
  });

  it('describes a tool that is not loaded, by either name form', async () => {
    const client = await connect('monetization:subscription-catalog');
    for (const tool of ['apps__app_price_schedule__get', 'apps.app_price_schedule.get']) {
      const res: any = await client.callTool({ name: 'asc__describe', arguments: { tool } });
      const described = JSON.parse(textOf(res));
      expect(described.tool).toBe('apps__app_price_schedule__get');
      expect(described.loaded).toBe(false);
      expect(described.inputSchema.required).toContain('id');
      expect(described.readOnly).toBe(true);
    }
  });

  it('marks asc__call read-only, which is what keeps clients from blocking it', async () => {
    // Codex refused every proxied read while this tool could also write: a
    // client that auto-approves reads and prompts for writes blocks whatever it
    // cannot classify. The annotation is load-bearing, not decoration.
    const client = await connect('monetization:subscription-catalog');
    const call = (await client.listTools()).tools.find((t) => t.name === 'asc__call')!;
    expect(call.annotations?.readOnlyHint).toBe(true);
  });

  it('refuses to write through the proxy, and says how to do it properly', async () => {
    const client = await connect('monetization:subscription-catalog');
    const res: any = await client.callTool({
      name: 'asc__call',
      arguments: { tool: 'win_back_offers__create', arguments: { body: {} } },
    });
    expect(res.isError).toBe(true);
    expect(textOf(res)).toMatch(/read-only/);
    expect(textOf(res)).toMatch(/asc__load/);
    expect(textOf(res)).toMatch(/subscription-offers/);
  });

  it('names the sibling server for a tool this profile does not own', async () => {
    const client = await connect('monetization:subscription-catalog');
    const res: any = await client.callTool({
      name: 'asc__call',
      arguments: { tool: 'game_center_details__get' },
    });
    expect(res.isError).toBe(true);
    expect(textOf(res)).toMatch(/asc-game-center/);
  });

  it('says so plainly when the name is not a tool at all', async () => {
    const client = await connect('monetization:subscription-catalog');
    const res: any = await client.callTool({
      name: 'asc__describe',
      arguments: { tool: 'apps__there_is_no_such_thing__list' },
    });
    expect(res.isError).toBe(true);
    expect(textOf(res)).toMatch(/asc__search_tools/);
  });

  it('promotes what it proxied, so a refreshing client gets the real tool', async () => {
    const client = await connect('monetization:subscription-catalog');
    const res: any = await client.callTool({
      name: 'asc__call',
      // Deliberately missing the required id, so nothing reaches the network.
      // The call fails; the operation is loaded by then regardless.
      arguments: { tool: 'apps__app_price_schedule__get', arguments: {} },
    });
    expect(res.isError).toBe(true); // missing required id
    const names = (await client.listTools()).tools.map((t) => t.name);
    expect(names).toContain('apps__app_price_schedule__get');
  });
});
