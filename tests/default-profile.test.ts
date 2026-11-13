import { describe, it, expect, vi } from 'vitest';
import { Client, InMemoryTransport } from '@modelcontextprotocol/client';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createServer, createUnknownProfileServer } from '../src/server.js';
import { DEFAULT_PROFILES, defaultProfileNote, defaultSelection, resolveSelection } from '../src/profiles.js';
import { loadConfig, type ServerConfig } from '../src/core/config.js';
import { PACKAGE } from '../src/clients.js';

const config: ServerConfig = {
  credentials: { keyId: '', issuerId: '' },
  readOnly: false,
  confirmWrites: 'off',
  dryRun: false,
};

async function connect(server: ReturnType<typeof createServer>) {
  const [ct, st] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'default-test', version: '0' }, { capabilities: {} });
  await Promise.all([server.connect(st), client.connect(ct)]);
  return client;
}

describe('the default read-only set', () => {
  it('lists exactly the read tools of core + general + analytics, once, without credentials', async () => {
    const client = await connect(createServer(config, defaultSelection()));
    try {
      const tools = (await client.listTools()).tools;
      const expected = new Set<string>();
      for (const name of DEFAULT_PROFILES) {
        const profile = await connect(createServer({ ...config, readOnly: true }, resolveSelection(name)));
        try {
          for (const tool of (await profile.listTools()).tools) expected.add(tool.name);
        } finally { await profile.close(); }
      }
      expect(tools.map((t) => t.name).sort()).toEqual([...expected].sort());
      expect(tools.every((t) => t.annotations?.readOnlyHint === true)).toBe(true);
      expect(tools.map((t) => t.name)).toEqual(expect.arrayContaining([
        'apps__list', 'asc__search_tools', 'media__list', 'analytics__get_report',
      ]));
      expect(client.getServerVersion()?.name).toBe('ASC-Default');
      expect(client.getInstructions()).toContain(defaultProfileNote());
      expect(config.readOnly).toBe(false);
    } finally { await client.close(); }
  });

  it('reports the default note on status and fails unconfigured reads before any network call', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('No network allowed'));
    const client = await connect(createServer(config, defaultSelection()));
    try {
      const res = await client.callTool({ name: 'asc__status', arguments: {} });
      const status = JSON.parse((res.content as Array<{ text: string }>)[0].text);
      expect(status).toMatchObject({
        profile: 'default', defaultProfiles: [...DEFAULT_PROFILES], readOnly: true,
        note: defaultProfileNote(), connection: { ok: false },
      });
      expect(status.connection.error).toContain(`npx -y ${PACKAGE} setup`);
      const write = await client.callTool({ name: 'apps__update', arguments: { id: 'unused' } });
      expect(write.isError).toBe(true);
      expect(JSON.stringify(write.content)).toContain('asc-mcp setup');
      expect(JSON.stringify(write.content)).not.toContain('Restart without --read-only');
      expect(fetch).not.toHaveBeenCalled();
    } finally { await client.close(); fetch.mockRestore(); }
  });

  it.each(['typo-profile', 'app-info', 'monetization:subscription-pricing', 'default', ''])('%s still serves only the unknown-profile notice', async (spec) => {
    expect(() => resolveSelection(spec)).toThrow();
    const client = await connect(createUnknownProfileServer(spec, 'Unknown profile'));
    try {
      expect((await client.listTools()).tools.map((t) => t.name)).toEqual(['asc__profile_unknown']);
      const reply = await client.callTool({ name: 'asc__profile_unknown', arguments: {} });
      expect(JSON.stringify(reply)).toContain(`${PACKAGE} setup`);
    } finally { await client.close(); }
  });

  it('allows missing configuration only when explicitly requested by the default startup', () => {
    const dir = mkdtempSync(join(tmpdir(), 'asc-default-config-'));
    const saved = process.env;
    process.env = { ASC_CONFIG_DIR: dir };
    try {
      expect(() => loadConfig([])).toThrow(/Missing required configuration/);
      expect(loadConfig([], { allowMissingCredentials: true }).credentials).toMatchObject({ keyId: '', issuerId: '' });
    } finally { process.env = saved; rmSync(dir, { recursive: true, force: true }); }
  });
});

const DIST = resolve(__dirname, '../dist/index.js');
describe.skipIf(!existsSync(DIST))('no-profile binary startup', () => {
  it.each([
    { args: [], credentials: {} },
    { args: ['--no-confirm', '--read-only=false', '--with-core'], credentials: {} },
    { args: [], credentials: { ASC_KEY_ID: 'TESTKEY123', ASC_ISSUER_ID: 'test-issuer', ASC_PRIVATE_KEY: 'not-used' } },
  ])('starts read-only with args $args and credentials $credentials', ({ args, credentials }) => {
    const dir = mkdtempSync(join(tmpdir(), 'asc-default-cli-'));
    const rpc = (msg: object) => JSON.stringify({ jsonrpc: '2.0', ...msg }) + '\n';
    try {
      const res = spawnSync(process.execPath, [DIST, ...args], {
        input: rpc({ id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'test', version: '0' } } }) +
          rpc({ method: 'notifications/initialized' }) +
          rpc({ id: 2, method: 'tools/list', params: {} }) +
          rpc({ id: 3, method: 'tools/call', params: { name: 'asc__status', arguments: { check_connection: false } } }),
        encoding: 'utf8', timeout: 20_000,
        env: { HOME: dir, USERPROFILE: dir, ASC_CONFIG_DIR: dir, ASC_READ_ONLY: 'false', ...credentials },
      });
      expect(res.error).toBeUndefined();
      expect(res.status).toBe(0);
      const messages = res.stdout.trim().split('\n').map((line) => JSON.parse(line));
      expect(messages.find((m) => m.id === 1).result.serverInfo.name).toBe('ASC-Default');
      expect(messages.find((m) => m.id === 1).result.instructions).toContain(defaultProfileNote());
      const tools = messages.find((m) => m.id === 2).result.tools;
      expect(tools.length).toBeGreaterThan(20);
      expect(tools.every((t: any) => t.annotations?.readOnlyHint === true)).toBe(true);
      expect(tools.some((t: any) => t.name === 'asc__profile_unknown')).toBe(false);
      const status = JSON.parse(messages.find((m) => m.id === 3).result.content[0].text);
      expect(status).toMatchObject({ readOnly: true, note: defaultProfileNote() });
      expect(res.stderr).toMatch(/ASC-Default.*read-only/);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});
