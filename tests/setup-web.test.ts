/**
 * setup --web: the doors a page on 127.0.0.1 must keep shut, and the dry-run
 * walk through. Dry run never contacts Apple and writes nothing, so this runs
 * anywhere; ASC_CONFIG_DIR points at an empty directory so no saved key on the
 * test machine changes what the page offers.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { request } from 'node:http';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// Listing the AI apps on this machine asks some of them over their CLI, which
// takes seconds; the tests that read the state allow for it.
import { startWebSetup, type WebSetupHandle } from '../src/setup-web.js';

let setup: WebSetupHandle;
let base: string;
let token: string;

beforeEach(async () => {
  process.env.ASC_CONFIG_DIR = mkdtempSync(join(tmpdir(), 'asc-web-'));
  setup = await startWebSetup({ dryRun: true, open: false });
  const url = new URL(setup.url);
  base = url.origin;
  token = url.searchParams.get('t')!;
});

afterEach(() => {
  setup.close();
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

describe('setup --web, the doors', () => {
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

describe('setup --web, a dry run', () => {
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
