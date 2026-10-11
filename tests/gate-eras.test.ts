/**
 * The write gate over the wire, in both protocol eras, with no credentials.
 *
 * 2025-era clients are asked with `elicitation/create` — the SDK's legacy shim
 * sends it and re-enters the handler with the answer. 2026-07-28 clients get
 * an `input_required` result and call again. One handler serves both, and
 * this suite is what proves it: an answer in either era decides whether the
 * DELETE reaches Apple.
 *
 * Apple is a stubbed fetch. A refused write is one that sent no DELETE.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { generateKeyPairSync } from 'node:crypto';
import { Client, InMemoryTransport } from '@modelcontextprotocol/client';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { createServer } from '../src/server.js';
import { resolveSelection } from '../src/profiles.js';
import type { ServerConfig } from '../src/core/config.js';

const privateKey = generateKeyPairSync('ec', {
  namedCurve: 'P-256',
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  publicKeyEncoding: { type: 'spki', format: 'pem' },
}).privateKey;

const config: ServerConfig = {
  credentials: { keyId: 'TESTKEY123', issuerId: 'issuer', privateKey },
  readOnly: false,
  confirmWrites: 'strong',
  includeDeprecated: false,
  dryRun: false,
};

/** A DESTRUCTIVE write, so the default mode asks and asks for a typed CONFIRM. */
const CALL = { name: 'beta_groups__delete', arguments: { id: 'group-1' } };

type Answer = { action: 'accept' | 'decline' | 'cancel'; content?: Record<string, unknown> };
const CONFIRM: Answer = { action: 'accept', content: { confirmation: 'CONFIRM' } };

/** Every request Apple would have received. */
function stubApple() {
  const sent: string[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string | URL, init?: RequestInit) => {
      const method = init?.method ?? 'GET';
      sent.push(`${method} ${new URL(String(url)).pathname}`);
      if (method === 'DELETE') return new Response(null, { status: 204 });
      return new Response(JSON.stringify({ data: { type: 'betaGroups', id: 'group-1', attributes: { name: 'Gate group' } } }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    })
  );
  return { deletes: () => sent.filter((s) => s.startsWith('DELETE')) };
}

/** A client that answers every prompt with `answer` and records what it was shown. */
async function connect(
  era: 'legacy' | 'modern',
  answer: Answer,
  options: { autoFulfill?: boolean; noElicitation?: boolean; confirmWrites?: ServerConfig['confirmWrites'] } = {}
) {
  const [ct, st] = InMemoryTransport.createLinkedPair();
  const build = () => createServer({ ...config, confirmWrites: options.confirmWrites ?? config.confirmWrites }, resolveSelection('access'));
  if (era === 'modern') {
    serveStdio(build, { transport: st });
  } else {
    await build().connect(st);
  }
  const client = new Client(
    { name: 'gate-eras', version: '0' },
    {
      capabilities: options.noElicitation ? {} : { elicitation: { form: {} } },
      ...(era === 'modern' ? { versionNegotiation: { mode: { pin: '2026-07-28' } } } : {}),
      ...(options.autoFulfill === false ? { inputRequired: { autoFulfill: false } } : {}),
    }
  );
  const prompts: string[] = [];
  if (!options.noElicitation) {
    client.setRequestHandler('elicitation/create', async (req) => {
      prompts.push(String(req.params.message));
      return answer;
    });
  }
  await client.connect(ct);
  return { client, prompts };
}

const textOf = (res: any): string => res.content?.[0]?.text ?? '';

afterEach(() => vi.unstubAllGlobals());

describe.each(['legacy', 'modern'] as const)('the write gate on a %s connection', (era) => {
  it('runs the write once the user types CONFIRM', async () => {
    const apple = stubApple();
    const { client, prompts } = await connect(era, CONFIRM);

    const res: any = await client.callTool(CALL);

    expect(prompts).toHaveLength(1);
    expect(prompts[0]).toMatch(/DESTRUCTIVE/);
    expect(res.isError ?? false).toBe(false);
    expect(apple.deletes()).toEqual(['DELETE /v1/betaGroups/group-1']);
  });

  it.each(['decline', 'cancel'] as const)('sends nothing when the user answers %s', async (action) => {
    const apple = stubApple();
    const { client, prompts } = await connect(era, { action });

    const res: any = await client.callTool(CALL);

    expect(prompts).toHaveLength(1);
    expect(res.isError).toBe(true);
    expect(textOf(res)).toContain(`not confirmed (${action})`);
    expect(apple.deletes()).toEqual([]);
  });

  it('asks with a checkbox for an ordinary write under --confirm, and runs it once ticked', async () => {
    const sent: string[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string | URL, init?: RequestInit) => {
        sent.push(`${init?.method ?? 'GET'} ${new URL(String(url)).pathname}`);
        return new Response(JSON.stringify({ data: { type: 'betaGroups', id: 'group-1', attributes: { name: 'Gate group' } } }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });
      })
    );
    const { client, prompts } = await connect(era, { action: 'accept', content: { confirm: true } }, { confirmWrites: 'all' });

    const res: any = await client.callTool({
      name: 'beta_groups__update',
      arguments: { id: 'group-1', body: { data: { type: 'betaGroups', id: 'group-1', attributes: { name: 'Renamed' } } } },
    });

    expect(prompts).toHaveLength(1);
    expect(prompts[0]).not.toMatch(/Type CONFIRM/);
    expect(res.isError ?? false).toBe(false);
    expect(sent).toContain('PATCH /v1/betaGroups/group-1');
  });

  it('fails closed, without asking, when the client cannot show a prompt', async () => {
    const apple = stubApple();
    const { client } = await connect(era, CONFIRM, { noElicitation: true });

    const res: any = await client.callTool(CALL);

    expect(textOf(res)).toContain('no elicitation support');
    expect(apple.deletes()).toEqual([]);
  });

  it('sends nothing when the user types something other than CONFIRM', async () => {
    const apple = stubApple();
    const { client } = await connect(era, { action: 'accept', content: { confirmation: 'yes' } });

    const res: any = await client.callTool(CALL);

    expect(textOf(res)).toContain('not confirmed (the answer was not CONFIRM)');
    expect(apple.deletes()).toEqual([]);
  });
});

/**
 * The retry is the client's to build, so a client can try to reuse an answer.
 * These drive the modern wire by hand: take the prompt, then send a retry the
 * gate must refuse.
 */
describe('a hand-built retry on a 2026-07-28 connection', () => {
  async function promptFor(client: Client) {
    const asked: any = await client.callTool(CALL, { allowInputRequired: true });
    expect(asked.resultType).toBe('input_required');
    return asked as { requestState: string };
  }
  const retry = (client: Client, args: Record<string, unknown>, requestState?: string) =>
    client.request({
      method: 'tools/call',
      params: {
        name: CALL.name,
        arguments: args,
        inputResponses: { confirm: CONFIRM },
        ...(requestState ? { requestState } : {}),
      },
    } as any, { allowInputRequired: true }) as Promise<any>;

  it('is refused when the arguments differ from the ones the user saw', async () => {
    const apple = stubApple();
    const { client } = await connect('modern', CONFIRM, { autoFulfill: false });
    const { requestState } = await promptFor(client);

    const res = await retry(client, { id: 'group-2' }, requestState);

    expect(textOf(res)).toMatch(/arguments changed after the confirmation prompt/);
    expect(apple.deletes()).toEqual([]);
  });

  it('runs once, then is refused when the same answer is sent again', async () => {
    const apple = stubApple();
    const { client } = await connect('modern', CONFIRM, { autoFulfill: false });
    const { requestState } = await promptFor(client);

    await retry(client, CALL.arguments, requestState);
    const second = await retry(client, CALL.arguments, requestState);

    expect(textOf(second)).toMatch(/already used or has expired/);
    expect(apple.deletes()).toEqual(['DELETE /v1/betaGroups/group-1']);
  });

  it('runs once when the same answer is sent twice at the same moment', async () => {
    const apple = stubApple();
    const { client } = await connect('modern', CONFIRM, { autoFulfill: false });
    const { requestState } = await promptFor(client);

    const results = await Promise.all([
      retry(client, CALL.arguments, requestState),
      retry(client, CALL.arguments, requestState),
    ]);

    expect(results.filter((r) => /already used/.test(textOf(r)))).toHaveLength(1);
    expect(apple.deletes()).toEqual(['DELETE /v1/betaGroups/group-1']);
  });

  it('asks again when an answer arrives without the state', async () => {
    const apple = stubApple();
    const { client } = await connect('modern', CONFIRM, { autoFulfill: false });

    const res = await retry(client, CALL.arguments);

    expect(res.resultType).toBe('input_required');
    expect(apple.deletes()).toEqual([]);
  });

  it('is rejected at the protocol level when the state is forged', async () => {
    const apple = stubApple();
    const { client } = await connect('modern', CONFIRM, { autoFulfill: false });
    const { requestState } = await promptFor(client);

    await expect(retry(client, CALL.arguments, `${requestState.slice(0, -4)}AAAA`)).rejects.toThrow(/requestState/);
    expect(apple.deletes()).toEqual([]);
  });
});
