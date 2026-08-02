/**
 * The write gate, end to end.
 *
 * `tests/confirm.test.ts` proves confirmWrite() decides correctly when it is
 * called. Nothing proved the server ever calls it. That gap is exactly where a
 * silent bypass would live: writeToolNames is built from `readOnlyHint`, so one
 * wrong annotation removes a mutating tool from the gate and every test still
 * passes.
 *
 * The agent eval cannot cover this either — it runs every profile with
 * --dry-run, and dry-run skips confirmation outright (server.ts, `!config.dryRun`).
 * So the agent eval's destructive-intent score measures the model's restraint,
 * never the product's. This suite is the only thing that measures the gate.
 *
 * Two layers here:
 *
 *   offline  annotations must not lie — readOnlyHint is true only for GET.
 *            Runs anywhere, no credentials.
 *   live     spawn the real server, declare elicitation, call writes across
 *            every risk level and CANCEL each one. Cancelling is what makes
 *            this safe: the decision is taken before the request is built, so
 *            nothing reaches Apple by construction.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { OPERATIONS } from '../src/generated/operations.js';
import { STOREKIT_TOOLS } from '../src/storekit/index.js';
import { PRICING_TOOLS } from '../src/tools/pricing.js';
import { REVIEWS_AI_TOOLS } from '../src/tools/reviews-ai.js';
import { META_TOOLS } from '../src/tools/meta.js';
import { STRONG_CONFIRM_LEVELS, type RiskLevel } from '../src/core/risk.js';
import { loadConfig } from '../src/core/config.js';

describe('write-gate annotations (offline)', () => {
  it('marks a tool read-only only when its operation is a GET', () => {
    const lying = OPERATIONS.filter((op) => op.readOnly !== (op.method === 'GET'));
    expect(lying.map((op) => `${op.name} ${op.method}`), 'readOnly disagrees with the HTTP method').toEqual([]);
  });

  it('never leaves a mutating operation without a risk stamp', () => {
    // An unstamped write still reaches the gate, but its preview claims the
    // lowest stakes — a checkbox in front of a deletion.
    const unstamped = OPERATIONS.filter((op) => !op.readOnly && !op.risk).map((op) => op.name);
    expect(unstamped, 'mutating operations with no risk level').toEqual([]);
  });

  it('keeps hand-written tools honest about whether they write', () => {
    const shouldWrite = new Set([
      'storekit__extend_renewal_date',
      'storekit__request_test_notification',
      'pricing__set_subscription_price',
    ]);
    const wrong = [...STOREKIT_TOOLS, ...PRICING_TOOLS, ...REVIEWS_AI_TOOLS, ...META_TOOLS]
      .filter((t) => shouldWrite.has(t.name) === (t.annotations?.readOnlyHint === true))
      .map((t) => t.name);
    expect(wrong, 'hand-written tools whose readOnlyHint contradicts what they do').toEqual([]);
  });

  it('puts every irreversible operation behind a typed confirmation', () => {
    const weak = OPERATIONS.filter(
      (op) => op.method === 'DELETE' && !STRONG_CONFIRM_LEVELS.has((op.risk ?? 'low') as RiskLevel)
    ).map((op) => `${op.name} (${op.risk ?? 'low'})`);
    expect(weak, 'deletions that would only ask for a checkbox').toEqual([]);
  });
});

/* ------------------------------------------------------------------------ */

const here = dirname(fileURLToPath(import.meta.url));
const ENTRY = join(here, '..', 'dist', 'index.js');
/**
 * Detect credentials the way the server does, not by reading env vars: `setup`
 * stores them in ~/.config/asc-mcp and the Keychain, so an env-only check
 * skips this suite on exactly the machines that could run it.
 */
const configured = (() => {
  try { loadConfig([]); return true; } catch { return false; }
})();
const live = configured && existsSync(ENTRY);

/** One write per risk level, with ids that match nothing. Every call is cancelled. */
const SAMPLES: Array<{ profile: string; tool: string; args: Record<string, unknown>; risk: RiskLevel }> = [
  { profile: 'access', tool: 'beta_groups__delete', args: { id: 'gate-test-not-a-real-id' }, risk: 'destructive' },
  { profile: 'access', tool: 'users__update', args: { id: 'gate-test-not-a-real-id', body: { data: { type: 'users', id: 'gate-test-not-a-real-id', attributes: { roles: ['ADMIN'] } } } }, risk: 'access' },
  { profile: 'provisioning', tool: 'certificates__delete', args: { id: 'gate-test-not-a-real-id' }, risk: 'infrastructure' },
  { profile: 'app-info', tool: 'apps__update', args: { id: 'gate-test-not-a-real-id', body: { data: { type: 'apps', id: 'gate-test-not-a-real-id', attributes: {} } } }, risk: 'public' },
];

interface Elicitation { message: string; schema: any }

/**
 * Minimal MCP client that answers the server's elicitation requests.
 *
 * The capability must be `elicitation: { form: {} }`. `form` is an object in
 * the SDK schema, so `form: true` fails validation and the whole capability is
 * dropped — the server then reports "this client cannot show a confirmation
 * prompt" and fails closed. That is the correct behaviour, and it is also
 * indistinguishable from the gate never firing, so the first version of this
 * test passed a bug in itself off as a product defect.
 */
function client(profile: string) {
  const child: ChildProcessWithoutNullStreams = spawn(process.execPath, [ENTRY, profile], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: process.env,
  });
  const waiting = new Map<number, (msg: any) => void>();
  const elicitations: Elicitation[] = [];
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

      // Server asking us something — the gate firing.
      if (msg.method === 'elicitation/create') {
        elicitations.push({ message: String(msg.params?.message ?? ''), schema: msg.params?.requestedSchema });
        send({ jsonrpc: '2.0', id: msg.id, result: { action: 'cancel' } });
        continue;
      }
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
    elicitations,
    async start() {
      await request('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: { elicitation: { form: {} } },
        clientInfo: { name: 'gate-test', version: '0' },
      });
      send({ jsonrpc: '2.0', method: 'notifications/initialized' });
    },
    async call(name: string, args: Record<string, unknown>) {
      const msg = await request('tools/call', { name, arguments: args });
      return String(msg.result?.content?.[0]?.text ?? msg.error?.message ?? '');
    },
    stop: () => child.kill(),
  };
}

describe.skipIf(!live)('write gate, end to end (live)', () => {
  const servers = new Map<string, ReturnType<typeof client>>();

  beforeAll(async () => {
    for (const profile of new Set(SAMPLES.map((s) => s.profile))) {
      const c = client(profile);
      await c.start();
      servers.set(profile, c);
    }
  }, 60_000);

  afterAll(() => { for (const c of servers.values()) c.stop(); });

  it.each(SAMPLES)('asks before $tool ($risk) and cancels cleanly', async (sample) => {
    const c = servers.get(sample.profile)!;
    const before = c.elicitations.length;
    const text = await c.call(sample.tool, sample.args);
    const asked = c.elicitations.slice(before);

    expect(asked.length, `${sample.tool} reached Apple without asking anything`).toBeGreaterThan(0);

    // Strong levels demand a typed CONFIRM; anything reversible gets a checkbox.
    const wantsTyped = STRONG_CONFIRM_LEVELS.has(sample.risk);
    const schema = JSON.stringify(asked[0].schema ?? {});
    expect(schema.includes('CONFIRM'), `${sample.tool} (${sample.risk}) prompt strength`).toBe(wantsTyped);

    expect(text, `${sample.tool} did not report the cancellation`).toMatch(/Nothing was changed|cancelled/i);
  }, 60_000);
});
