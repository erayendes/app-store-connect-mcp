/**
 * Sampling-free reviews_ai tools, pinned at the stdio protocol level.
 *
 * Task 2 (2940446, 4cefc7f) moved draft_response/triage/daily_briefing off
 * MCP Sampling: they now return raw data in `structuredContent` plus an
 * instruction in `content`, and server.ts stopped gating them on the
 * client's sampling capability. tests/reviews-ai.test.ts pins the unit-level
 * behavior — executeReviewsAiTool() called directly, http mocked in-process.
 * That proves the function is right; it cannot prove a real client, one that
 * only speaks JSON-RPC over stdio and never advertises `sampling`, is
 * actually offered these tools, or that --read-only quietly drops them. This
 * file spawns the built server exactly as a client would and checks that.
 *
 * Client pattern lifted from tests/gate.test.ts, the only other suite that
 * spawns dist/index.js and speaks raw JSON-RPC over stdio — reused rather
 * than reinvented, trimmed to what this suite needs (no elicitation).
 *
 * Apple network calls: never happen here, by construction.
 *  - tools/list needs no credentials at all — the private key loads lazily
 *    (jwt.ts), only on the first real API call — so it is never touched by
 *    the two tools/list suites below.
 *  - Every spawned server gets a throwaway EC keypair (mirrors
 *    tests/core.test.ts) so ES256 signing still succeeds locally, plus
 *    ASC_KEY_ID / ASC_ISSUER_ID that are obviously not real. These override
 *    whatever is in the parent shell's env, so this suite behaves the same
 *    on a machine with real Apple credentials configured as on one without.
 *  - ASC_BASE_URL is always pointed away from Apple: at a closed local port
 *    for the tools/list-only suites (nothing there ever gets called, but the
 *    default must not silently mean "Apple" if something changes), and at a
 *    real local fixture HTTP server for the one test that calls a tool all
 *    the way through the data path (2b) — see "real data path" below.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { createServer as createFixtureServer, type Server as FixtureServer } from 'node:http';
import { generateKeyPairSync } from 'node:crypto';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { REVIEWS_AI_TOOL_NAMES, RESPONSE_CHAR_LIMIT } from '../src/tools/reviews-ai.js';

const here = dirname(fileURLToPath(import.meta.url));
const ENTRY = join(here, '..', 'dist', 'index.js');
// Unlike gate.test.ts's live suite, this one needs no real Apple credentials
// on the machine — every spawn below gets its own throwaway ones — so the
// only precondition is that `npm run build` has produced dist/index.js.
const built = existsSync(ENTRY);

const EXPECTED_TOOLS = [
  'reviews_ai__draft_response',
  'reviews_ai__triage',
  'reviews_ai__daily_briefing',
] as const;

// The names this suite pins must match what the source actually registers,
// or a passing test below would be pinning nothing.
it('the three reviews_ai tool names this suite pins match what the source registers', () => {
  expect(new Set(EXPECTED_TOOLS)).toEqual(REVIEWS_AI_TOOL_NAMES);
});

const { privateKey: DUMMY_PRIVATE_KEY } = generateKeyPairSync('ec', {
  namedCurve: 'P-256',
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  publicKeyEncoding: { type: 'spki', format: 'pem' },
});

/**
 * Never Apple's. keyId/issuerId are obviously fake; the EC key is freshly
 * generated per test run so ES256 signing succeeds without ever being a
 * usable Apple credential. ASC_BASE_URL points at a closed local port by
 * default — nothing should ever dial out, but if a future bug made one of
 * the tools/list-only tests reach for the network, this fails loudly and
 * fast instead of quietly reaching Apple.
 */
const DUMMY_ENV: Record<string, string> = {
  ASC_KEY_ID: 'DUMMYKEYID',
  ASC_ISSUER_ID: '00000000-0000-0000-0000-000000000000',
  ASC_PRIVATE_KEY: DUMMY_PRIVATE_KEY,
  ASC_BASE_URL: 'http://127.0.0.1:1',
};

function client(args: string[], opts: { capabilities?: Record<string, unknown>; env?: Record<string, string> } = {}) {
  const child: ChildProcessWithoutNullStreams = spawn(process.execPath, [ENTRY, ...args], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, ...DUMMY_ENV, ...opts.env },
  });
  const waiting = new Map<number, (msg: any) => void>();
  let nextId = 1;
  let buffer = '';

  const send = (obj: unknown) => child.stdin.write(`${JSON.stringify(obj)}\n`);

  child.stdout.on('data', (chunk) => {
    buffer += chunk.toString();
    let nl: number;
    while ((nl = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (!line) continue;
      let msg: any;
      try { msg = JSON.parse(line); } catch { continue; }
      if (msg.id !== undefined) waiting.get(msg.id)?.(msg), waiting.delete(msg.id);
    }
  });

  const request = (method: string, params: unknown, timeoutMs = 30_000) =>
    new Promise<any>((resolve) => {
      const id = nextId++;
      waiting.set(id, resolve);
      send({ jsonrpc: '2.0', id, method, params });
      setTimeout(() => { if (waiting.delete(id)) resolve({ error: { message: `${method} timed out` } }); }, timeoutMs);
    });

  return {
    async start() {
      // capabilities defaults to {} — no `sampling` key at all. That is the
      // whole point of this suite: a client that never advertises sampling
      // must still see and be able to call these three tools.
      await request('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: opts.capabilities ?? {},
        clientInfo: { name: 'reviews-ai-stdio-test', version: '0' },
      });
      send({ jsonrpc: '2.0', method: 'notifications/initialized' });
    },
    async list(): Promise<any[]> {
      const msg = await request('tools/list', {});
      return msg.result?.tools ?? [];
    },
    async call(name: string, args: Record<string, unknown>) {
      return request('tools/call', { name, arguments: args });
    },
    stop: () => child.kill(),
  };
}

describe.skipIf(!built)('reviews_ai tools over stdio — no sampling capability required', () => {
  let c: ReturnType<typeof client>;
  let tools: any[];

  beforeAll(async () => {
    // No positional profile = monolithic mode, no --read-only: the plainest
    // possible client, and the one the old sampling gate used to reject.
    c = client([]);
    await c.start();
    tools = await c.list();
  }, 30_000);

  afterAll(() => c.stop());

  it('sees all three reviews_ai tools in tools/list despite capabilities: {} (no sampling)', () => {
    const names = new Set(tools.map((t) => t.name));
    for (const name of EXPECTED_TOOLS) {
      expect(names.has(name), `${name} missing from tools/list`).toBe(true);
    }
  });

  it('each tool carries an outputSchema over the real wire, not just in source', () => {
    for (const name of EXPECTED_TOOLS) {
      const tool = tools.find((t) => t.name === name);
      expect(tool?.outputSchema, `${name} has no outputSchema in tools/list`).toBeDefined();
    }
  });

  it('regression pin: no longer requires the sampling capability for these tools to appear (the old SEP-2577 gate is gone)', () => {
    // Before Task 2, this exact handshake — capabilities: {}, no `sampling`
    // key — made the server hide all three tools entirely. Re-assert the
    // presence explicitly under that name, and check the "MCP Sampling"
    // wording the old gate's descriptions used is gone too, so a partial
    // revert (tools reappear but still talk about a client model) still
    // fails this test.
    const named = EXPECTED_TOOLS.map((name) => tools.find((t) => t.name === name));
    expect(named.every(Boolean), 'one or more reviews_ai tools absent with no sampling capability declared').toBe(true);
    for (const tool of named) {
      expect(String(tool.description ?? '')).not.toMatch(/MCP Sampling|client's own model/i);
    }
  });
});

describe.skipIf(!built)('reviews_ai tools over stdio — --read-only mode', () => {
  let c: ReturnType<typeof client>;

  beforeAll(async () => {
    c = client(['--read-only']);
    await c.start();
  }, 30_000);

  afterAll(() => c.stop());

  it('keeps all three reviews_ai tools in tools/list under --read-only', async () => {
    const tools = await c.list();
    const names = new Set(tools.map((t) => t.name));
    for (const name of EXPECTED_TOOLS) {
      expect(names.has(name), `${name} missing from tools/list under --read-only`).toBe(true);
    }
  });
});

describe.skipIf(!built)('reviews_ai__draft_response over stdio — real data path, fixture Apple', () => {
  let fixture: FixtureServer;
  let fixtureRequests = 0;
  let c: ReturnType<typeof client>;

  beforeAll(async () => {
    // Stands in for Apple. AscHttpClient (src/core/http.ts) pins requests to
    // whatever ASC_BASE_URL says — same mechanism tests/core.test.ts uses —
    // so pointing it here instead of the real host is enough to get the
    // real tool code (fetch review, pack it, build structuredContent) to run
    // end to end without ever reaching appstoreconnect.apple.com.
    fixture = createFixtureServer((req, res) => {
      fixtureRequests++;
      if (req.url === '/v1/customerReviews/rev-42') {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({
          data: {
            id: 'rev-42',
            attributes: {
              rating: 2,
              title: 'Keeps crashing',
              body: 'App crashes constantly on launch since the last update.',
              territory: 'USA',
              createdDate: '2026-01-01T00:00:00Z',
            },
          },
        }));
        return;
      }
      res.writeHead(404, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ errors: [{ title: 'Not Found' }] }));
    });
    await new Promise<void>((resolve) => fixture.listen(0, '127.0.0.1', resolve));
    const { port } = fixture.address() as { port: number };

    c = client([], { env: { ASC_BASE_URL: `http://127.0.0.1:${port}` } });
    await c.start();
  }, 30_000);

  afterAll(async () => {
    c.stop();
    await new Promise<void>((resolve) => fixture.close(() => resolve()));
  });

  it('returns structuredContent (real review data) plus a text instruction block', async () => {
    const msg = await c.call('reviews_ai__draft_response', { review_id: 'rev-42' });

    expect(msg.error, `tools/call returned a protocol error: ${JSON.stringify(msg.error)}`).toBeUndefined();
    const result = msg.result;
    expect(result?.isError, `tool reported isError: ${JSON.stringify(result)}`).not.toBe(true);

    expect(result.structuredContent?.review?.id).toBe('rev-42');
    expect(result.structuredContent?.review?.body).toContain('crashes constantly');
    expect(result.structuredContent?.characterLimit).toBe(RESPONSE_CHAR_LIMIT);

    // Per the MCP spec (and Task 2's fix in 4cefc7f), structured content is
    // also serialized into a text block, so a text-only client still gets
    // the data even if it never reads structuredContent.
    expect(result.content).toHaveLength(2);
    expect(String(result.content[0].text)).toMatch(/draft/i);
    expect(String(result.content[1].text)).toContain('rev-42');

    // The only request this call could have made went to the fixture above,
    // not Apple — proof this ran the real fetch-and-pack path, not a stub.
    expect(fixtureRequests).toBe(1);
  }, 30_000);
});
