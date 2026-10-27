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
import { describe, it, expect, vi } from 'vitest';
import { Client, InMemoryTransport } from '@modelcontextprotocol/client';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { createServer, formatError, servedToolCount } from '../src/server.js';
import { AscApiError } from '../src/core/errors.js';
import { resolveSelection, toolCountFor } from '../src/profiles.js';
import type { ServerConfig } from '../src/core/config.js';

const config: ServerConfig = {
  credentials: { keyId: 'TESTKEY123', issuerId: 'issuer', privateKey: 'not-used-here' },
  readOnly: false,
  confirmWrites: 'off',
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
    const client = await connect('monetization:subscription');
    const names = (await client.listTools()).tools.map((t) => t.name);
    expect(names).toContain('asc__describe');
    expect(names).toContain('asc__call');
    // The thing we are proxying to is genuinely absent — otherwise this proves nothing.
    expect(names).not.toContain('apps__app_price_schedule__get');
  });

  it('describes a tool that is not loaded, by either name form', async () => {
    const client = await connect('monetization:subscription');
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
    const client = await connect('monetization:subscription');
    const call = (await client.listTools()).tools.find((t) => t.name === 'asc__call')!;
    expect(call.annotations?.readOnlyHint).toBe(true);
  });

  it('refuses to write through the proxy, and says how to do it properly', async () => {
    const client = await connect('monetization:subscription');
    const res: any = await client.callTool({
      name: 'asc__call',
      arguments: { tool: 'win_back_offers__create', arguments: { body: {} } },
    });
    expect(res.isError).toBe(true);
    expect(textOf(res)).toMatch(/read-only/);
    // Register and restart: the one remedy that works on every client.
    expect(textOf(res)).toMatch(/register monetization:subscription,subscription-win-back`/);
    expect(textOf(res)).not.toMatch(/asc__load/);
  });

  it('is offered only when some sub-profiles were left out, and refused otherwise', async () => {
    for (const spec of ['monetization', 'core', 'webhooks']) {
      const client = await connect(spec);
      const names = (await client.listTools()).tools.map((t) => t.name);
      expect(names, spec).not.toContain('asc__call');
      expect(names, spec).not.toContain('asc__describe');
      // Not in the list is not enough: a model that remembers the name from
      // another server must not get a working proxy here.
      const res: any = await client.callTool({
        name: 'asc__call',
        arguments: { tool: 'apps__app_price_schedule__get', arguments: {} },
      });
      expect(res.isError, spec).toBe(true);
      expect(textOf(res), spec).toMatch(/not offered here/);
    }
  });

  it('reaches only its own profile, not core', async () => {
    const client = await connect('monetization:subscription');
    const res: any = await client.callTool({ name: 'asc__describe', arguments: { tool: 'apps__list' } });
    expect(res.isError).toBe(true);
    expect(textOf(res)).toMatch(/ASC-Core/);
  });

  it('names the sibling server for a tool this profile does not own', async () => {
    const client = await connect('monetization:subscription');
    const res: any = await client.callTool({
      name: 'asc__call',
      arguments: { tool: 'game_center_details__get' },
    });
    expect(res.isError).toBe(true);
    expect(textOf(res)).toMatch(/ASC-GameCenter/);
  });

  it('says so plainly when the name is not a tool at all', async () => {
    const client = await connect('monetization:subscription');
    const res: any = await client.callTool({
      name: 'asc__describe',
      arguments: { tool: 'apps__there_is_no_such_thing__list' },
    });
    expect(res.isError).toBe(true);
    expect(textOf(res)).toMatch(/asc__search_tools/);
  });

  it('promotes what it proxied, so a refreshing client gets the real tool', async () => {
    const client = await connect('monetization:subscription');
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
    // An invalid value is not a locked version (live run, 2026-10-27).
    expect(parsed.suggestedAction).toMatch(/refused a value/);
    const locked = new AscApiError('App Store Connect API returned 409', 409, [{ code: 'STATE_ERROR', title: 'Invalid state' }]);
    expect(JSON.parse(formatError(locked, 'build_uploads__delete')).error.suggestedAction).toMatch(/in review or already released/);
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
    const text = formatError(new AscApiError('Read-only here.\nRegister it instead.', 0), 'asc__call');
    expect(text).toBe('asc__call failed: Read-only here.\nRegister it instead.');
  });
});

/**
 * MIL-214: the startup banner quoted the operations a profile MAPS while the
 * client received a different number, and someone reading "24" against 29 in
 * their client had no way to tell whether they had misconfigured something.
 * The two have to agree by construction, not by anyone remembering to update a
 * count when a tool moves.
 */
describe('the count a client sees', () => {
  it('matches what tools/list returns, including the proxy tools and asc__status', async () => {
    for (const spec of ['monetization:subscription', 'monetization', 'core']) {
      const selection = resolveSelection(spec);
      const server = createServer(config, selection);
      const [ct, st] = InMemoryTransport.createLinkedPair();
      const client = new Client({ name: 'test', version: '0' }, { capabilities: {} });
      await Promise.all([server.connect(st), client.connect(ct)]);

      const listed = (await client.listTools()).tools.length;
      expect(servedToolCount(server), spec).toBe(listed);
      // The mapped count now counts what the server adds on its own — the
      // proxy pair on a narrowed profile, asc__status everywhere — so the two
      // agree instead of differing by an amount nobody could explain.
      expect(toolCountFor(selection), spec).toBe(listed);
    }
  });
});

/**
 * What asc__call announces when it promotes a tool, in both protocol eras. A
 * 2025-era client gets an unsolicited notifications/tools/list_changed; a
 * 2026-07-28 client gets one only on a `subscriptions/listen` stream it opened,
 * and serveStdio routes the server's notification onto that stream. Either way
 * the client must hear it and a fresh tools/list must carry the new tool —
 * this is the server's half of the contract, so a client that still shows the
 * old list is not refreshing (seen in Claude Code in the desktop app).
 */
describe.each(['legacy', 'modern'] as const)('asc__call promotion on a %s connection', (era) => {
  it('declares listChanged, announces the tool it added and lists it after', async () => {
    const [ct, st] = InMemoryTransport.createLinkedPair();
    const build = () => createServer(config, resolveSelection('access:user-management'));
    if (era === 'modern') serveStdio(build, { transport: st });
    else await build().connect(st);
    let announced: string[] | undefined;
    const client = new Client(
      { name: 'test', version: '0' },
      {
        capabilities: {},
        ...(era === 'modern' ? { versionNegotiation: { mode: { pin: '2026-07-28' } } } : {}),
        listChanged: { tools: { onChanged: (_err, tools) => (announced = tools?.map((t) => t.name)) } },
      }
    );
    await client.connect(ct);
    expect(client.getServerCapabilities()?.tools?.listChanged).toBe(true);
    const before = (await client.listTools()).tools.map((t) => t.name);
    expect(before).not.toContain('user_invitations__get');
    expect(before).not.toContain('asc__load');

    // Missing the required id, so nothing reaches the network; the operation
    // is loaded before the call is validated.
    await client.callTool({ name: 'asc__call', arguments: { tool: 'user_invitations__get', arguments: {} } });
    await vi.waitFor(() => expect(announced).toBeDefined());

    expect(announced).toContain('user_invitations__get');
    const after = (await client.listTools()).tools.map((t) => t.name);
    expect(after).toContain('user_invitations__get');
  });
});
