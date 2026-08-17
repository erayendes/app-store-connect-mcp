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
import { createServer, formatError } from '../src/server.js';
import { AscApiError } from '../src/core/errors.js';
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

/**
 * The half of MIL-192 that was still prose. An agent deciding what to do after
 * a failure needs three things the old text buried: whether trying again could
 * work at all, which field Apple rejected, and what to do about the status.
 * `source` in particular was dropped from the type before it could reach here.
 */
describe('what a failure tells the caller', () => {
  it('turns an Apple rejection into fields, not a sentence', () => {
    const err = new AscApiError(
      'App Store Connect API returned 409',
      409,
      [
        {
          code: 'ENTITY_ERROR',
          title: 'An attribute value is invalid',
          detail: 'versionString must be higher than the released version',
          source: { pointer: '/data/attributes/versionString' },
        },
      ],
      'REQ-123'
    );
    const parsed = JSON.parse(formatError(err, 'app_store_versions__create')).error;

    expect(parsed.status).toBe(409);
    expect(parsed.retryable).toBe(false);
    expect(parsed.appleRequestId).toBe('REQ-123');
    expect(parsed.issues[0].source.pointer).toBe('/data/attributes/versionString');
    // The status hint used to be glued onto the end of the message.
    expect(parsed.suggestedAction).toMatch(/in review or already released/);
  });

  it('marks a rate limit as worth retrying and a bad request as not', () => {
    const retryable = (status: number) =>
      JSON.parse(formatError(new AscApiError('x', status), 'apps__list')).error.retryable;
    expect(retryable(429)).toBe(true);
    expect(retryable(503)).toBe(true);
    expect(retryable(400)).toBe(false);
  });

  // Our own refusals carry hand-written multi-line guidance — register
  // commands, sub-profile names. JSON would turn those into \n escapes.
  it('leaves a local refusal as the prose it was written as', () => {
    const text = formatError(new AscApiError('Loaded read-only. Use asc__load.', 0), 'asc__call');
    expect(text).toBe('asc__call failed: Loaded read-only. Use asc__load.');
  });
});
