/**
 * setup --web: the doors a page on 127.0.0.1 must keep shut, and the dry-run
 * walk through. Dry run never contacts Apple and writes nothing, so this runs
 * anywhere; ASC_CONFIG_DIR points at an empty directory so no saved key on the
 * test machine changes what the page offers.
 */
import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest';
import { request } from 'node:http';
import { createServer } from 'node:net';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
// Listing the AI apps on this machine asks some of them over their CLI, which
// takes seconds; the tests that read the state allow for it.
import type { WebSetupHandle } from '../src/setup-web.js';

const priorHome = process.env.HOME;
const priorPath = process.env.PATH;
const isolatedHome = mkdtempSync(join(tmpdir(), 'asc-web-home-'));
process.env.HOME = isolatedHome;
process.env.PATH = '/nonexistent';
const { startWebSetup, planForPage } = await import('../src/setup-web.js');
const { CLIENTS, PACKAGE, readRegistrations } = await import('../src/clients.js');
const { planChanges } = await import('../src/setup.js');
const { SETUP_PAGE } = await import('../src/setup-page.js');
const canListen = await new Promise<boolean>((resolve) => {
  const server = createServer();
  server.once('error', () => resolve(false));
  server.listen(0, '127.0.0.1', () => server.close(() => resolve(true)));
});

afterAll(() => {
  process.env.HOME = priorHome;
  process.env.PATH = priorPath;
  rmSync(isolatedHome, { recursive: true, force: true });
});

let setup: WebSetupHandle;
let base: string;
let token: string;

beforeEach(async () => {
  if (!canListen) return;
  process.env.ASC_CONFIG_DIR = mkdtempSync(join(tmpdir(), 'asc-web-'));
  setup = await startWebSetup({ dryRun: true, open: false });
  const url = new URL(setup.url);
  base = url.origin;
  token = url.searchParams.get('t')!;
});

afterEach(() => {
  setup?.close();
  delete process.env.ASC_CONFIG_DIR;
});

const post = (name: string, body: unknown = {}, headers: Record<string, string> = { 'x-setup-token': token }) =>
  fetch(`${base}/api/${name}`, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });

/** fetch will not send a forged Host header, so this one goes through node:http. */
const withHost = (host: string) =>
  new Promise<number>((resolve, reject) => {
    const u = new URL(base);
    const req = request({ host: u.hostname, port: u.port, path: '/api/state', method: 'POST', headers: { host, 'x-setup-token': token } }, (res) => {
      res.resume();
      resolve(res.statusCode ?? 0);
    });
    req.on('error', reject);
    req.end('{}');
  });

describe.skipIf(!canListen)('setup --web, the doors', () => {
  it('listens on 127.0.0.1 only', () => {
    expect(new URL(setup.url).hostname).toBe('127.0.0.1');
  });

  it('serves the page only with the token from the terminal', async () => {
    expect((await fetch(`${base}/`)).status).toBe(403);
    expect((await fetch(`${base}/?t=wrong`)).status).toBe(403);
    const page = await fetch(setup.url);
    expect(page.status).toBe(200);
    expect(page.headers.get('referrer-policy')).toBe('no-referrer');
    expect(await page.text()).toContain('Heimdall setup');
  });

  it('answers the API only with the token in a header', async () => {
    expect((await post('state', {}, {})).status).toBe(403);
    expect((await post('state', {}, { 'x-setup-token': 'nope' })).status).toBe(403);
    expect((await post('state')).status).toBe(200);
  }, 30_000);

  it('refuses a request addressed to another host name (DNS rebinding)', async () => {
    expect(await withHost('evil.example:80')).toBe(403);
  });

  it('refuses a cross-site request even if it somehow carried the token', async () => {
    expect((await post('state', {}, { 'x-setup-token': token, origin: 'https://evil.example' })).status).toBe(403);
  });

  it('will not apply new credentials that were never checked', async () => {
    expect((await post('apply', { clients: [], picked: [] })).status).toBe(409);
  });
});

describe.skipIf(!canListen)('setup --web, a dry run', () => {
  it('checks the key, plans and finishes without writing anything', async () => {
    const state = await (await post('state')).json();
    expect(state.dryRun).toBe(true);
    expect(state.existing).toBeNull();
    expect(state.rows.length).toBeGreaterThan(0);

    expect((await (await post('verify', { keyId: 'x', issuerId: 'y', pem: '' })).json()).verdict).toBe('bad-key-id');
    const ok = await post('verify', {
      keyId: 'DEMO123456',
      issuerId: '57246e4f-1a2b-4c3d-9e8f-0123456789ab',
      pem: '-----BEGIN PRIVATE KEY-----\nnot-a-real-key\n-----END PRIVATE KEY-----',
    });
    expect((await ok.json()).verdict).toBe('skipped');

    expect((await post('plan', { clients: ['other'], picked: [] })).status).toBe(400);
    expect((await post('apply', { clients: ['other'], picked: [] })).status).toBe(400);

    const analytics = state.rows.find((r: any) => r.name === 'analytics').index;
    const applied = await (await post('apply', { clients: ['other'], picked: [analytics] })).json();
    expect(applied.lines[0]).toMatch(/Dry run/);

    await expect(setup.done).resolves.toBeUndefined();
  }, 30_000);
});

describe('setup --web, registration confirmation', () => {
  it('lists each rewrite with flags while keeping env values out of the page data', () => {
    const cursor = CLIENTS.find((c) => c.id === 'cursor')!;
    const path = join(isolatedHome, '.cursor', 'mcp.json');
    mkdirSync(join(isolatedHome, '.cursor'), { recursive: true });
    const other = PACKAGE.endsWith('@beta') ? '@erayendes/asc-mcp' : '@erayendes/asc-mcp@beta';
    writeFileSync(path, JSON.stringify({ mcpServers: {
      'ASC-AppInfo': { command: 'npx', args: ['-y', other, 'app-info', '--read-only', '--x=secret-flag-value'], env: { DEMO_TOKEN: 'secret-test-value' } },
      'ASC-Analytics': { command: 'npx', args: ['-y', other, 'analytics'], env: { ASC_KEY_ID: 'another-secret-value' } },
    } }));
    const entries = readRegistrations(cursor);
    const plan = planChanges([cursor], ['app-info', 'analytics'], new Map([['cursor', entries]]),
      { prune: true, stale: new Map([['cursor', new Set(['ASC-AppInfo'])]]) });
    const pagePlan = planForPage(plan)[0];
    const pageData = JSON.stringify(pagePlan);
    expect(pageData).toContain('ASC-AppInfo (--read-only --x=<hidden>)');
    expect(pagePlan.userManaged).toContain('ASC-Analytics');
    expect(pagePlan.rewrites).toEqual(['ASC-AppInfo (--read-only --x=<hidden>)']);
    expect(pagePlan.rewrites).not.toContain('ASC-Analytics');
    expect(pageData).not.toContain('secret-test-value');
    expect(pageData).not.toContain('another-secret-value');
    expect(pageData).not.toContain('secret-flag-value');
    expect(SETUP_PAGE).toContain("'rewrite ' + p.rewrites.join(', ')");
    expect(SETUP_PAGE).toContain("el('span', 'mv'");
    expect(SETUP_PAGE).toContain('reuse && !vendorChanged() && !r.plan.some');
    expect(readFileSync(path, 'utf8')).toContain('secret-test-value');
  });

  it('marks a report-only plan as having no action for Apply', () => {
    const cursor = CLIENTS.find((c) => c.id === 'cursor')!;
    const path = join(isolatedHome, '.cursor', 'mcp.json');
    mkdirSync(join(isolatedHome, '.cursor'), { recursive: true });
    writeFileSync(path, JSON.stringify({ mcpServers: {
      'ASC-AppInfo': { command: 'npx', args: ['-y', PACKAGE, 'app-info'],
        env: { ASC_ISSUER_ID: 'test-only' } },
    } }));
    const pagePlan = planForPage(planChanges([cursor], ['app-info'],
      new Map([['cursor', readRegistrations(cursor)]]), { prune: true }));
    expect(pagePlan).toHaveLength(1);
    expect(pagePlan[0]).toMatchObject({ add: [], remove: [], rewrites: [], userManaged: ['ASC-AppInfo'] });
    const expression = SETUP_PAGE.match(/\$\('apply'\)\.disabled = (reuse[\s\S]*?\n      \}\));/)?.[1];
    expect(expression).toBeDefined();
    const disabled = (reuse: boolean, changed: boolean, plan: typeof pagePlan): boolean =>
      runInNewContext(expression!, { reuse, vendorChanged: () => changed, r: { plan } }) as boolean;
    expect(disabled(true, false, pagePlan)).toBe(true);
    expect(disabled(false, false, pagePlan)).toBe(false);
    expect(disabled(true, true, pagePlan)).toBe(false);
    expect(disabled(true, false, [{ ...pagePlan[0], add: ['ASC-Analytics'] }])).toBe(false);
  });
});
