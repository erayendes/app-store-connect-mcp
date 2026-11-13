import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// Any client CLI or accidental credential-loading subprocess fails this suite.
vi.mock('node:child_process', () => ({ execFileSync: vi.fn(() => { throw new Error('Unexpected subprocess'); }) }));
import { execFileSync } from 'node:child_process';
import { doctorReport, credentialPresence, keychainItemPresent } from '../src/doctor.js';
import { readRegistrations, PACKAGE, VERSION, type McpClient } from '../src/clients.js';
import { writeSharedConfig } from '../src/core/shared-config.js';
import { registeredProfileSpecs } from '../src/activation.js';

let dir: string;
let env: NodeJS.ProcessEnv;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'asc-doctor-'));
  env = { ASC_CONFIG_DIR: dir };
  vi.clearAllMocks();
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

const entry = (spec: string, extra: Record<string, unknown> = {}) => ({ command: 'npx', args: ['-y', PACKAGE, spec], ...extra });
function client(servers: unknown): McpClient {
  const path = join(dir, 'mcp.json');
  writeFileSync(path, typeof servers === 'string' ? servers : JSON.stringify({ mcpServers: servers }));
  return { id: 'cursor', label: 'Cursor', targets: [{ kind: 'json', path, where: 'test config', key: 'mcpServers' }] };
}

describe('doctor local report', () => {
  it('reports versions, profiles and missing core without changing any file or starting a CLI', () => {
    const c = client({ 'ASC-Monetization': entry('monetization:subscription', { env: { DEMO_TOKEN: 'do-not-print' } }) });
    const before = readFileSync(join(dir, 'mcp.json'), 'utf8');
    const report = doctorReport([c], env);
    expect(report).toContain(`Node: ${process.version}`);
    expect(report).toContain(`Package: @erayendes/asc-mcp ${VERSION}`);
    expect(report).toContain(`Release channel: ${PACKAGE.endsWith('@beta') ? 'beta' : 'stable'}`);
    expect(report).toContain('ASC-Monetization: monetization:subscription');
    expect(report).toContain('ASC-Core: missing');
    expect(report).toContain(`register monetization:subscription --clients=cursor`);
    expect(report).toContain('restart the client');
    expect(report).toContain('asc__status');
    expect(report).not.toContain('do-not-print');
    expect(readFileSync(join(dir, 'mcp.json'), 'utf8')).toBe(before);
    expect(execFileSync).not.toHaveBeenCalled();
  });

  it('checks ASC-Core separately for each config target', () => {
    const a = client({ 'ASC-General': entry('general'), 'ASC-Core': entry('core') });
    const bPath = join(dir, 'desktop.json');
    writeFileSync(bPath, JSON.stringify({ mcpServers: { 'ASC-General': entry('general') } }));
    a.targets.push({ kind: 'json', path: bPath, where: 'desktop', key: 'mcpServers' });
    const report = doctorReport([a], env);
    expect(report).toContain('ASC-Core: registered');
    expect(report).toContain('ASC-Core: missing');
  });

  it('recognizes embedded core and reports safety reasons for withheld core', () => {
    const embedded = client({ 'ASC-General': entry('general', { args: ['-y', PACKAGE, 'general', '--with-core'] }) });
    expect(doctorReport([embedded], env)).toContain('ASC-Core: included with --with-core');
    const guarded = client({ 'ASC-General': entry('general', { env: { ASC_CONFIG_DIR: '/hidden-config' } }) });
    const report = doctorReport([guarded], env);
    expect(report).toContain('do not add ASC-Core by hand');
    expect(report).not.toContain('/hidden-config');
  });

  it('handles empty, corrupt, retired and cross-channel registrations', () => {
    expect(doctorReport([], env)).toContain('No MCP clients found');
    expect(doctorReport([client({})], env)).toContain('No Heimdall entries');
    expect(doctorReport([client('{ broken')], env)).toContain('Config could not be read in full');
    const other = PACKAGE.endsWith('@beta') ? '@erayendes/asc-mcp' : '@erayendes/asc-mcp@beta';
    const report = doctorReport([client({ 'ASC-AppInfo': entry('app-info', { args: ['-y', other, 'app-info'] }) })], env);
    expect(report).toContain('Unknown profile. Next: run npx -y');
    expect(report).not.toContain('register general');
    expect(report).toContain('Package/channel differs');
  });

  it('reads the Codex inventory locally even when its CLI is absent', () => {
    const path = join(dir, 'config.toml');
    writeFileSync(path, `[mcp_servers."ASC-Monetization"]\ncommand = "npx"\nargs = [\n '-y', # local config\n '${PACKAGE}', 'monetization:transactions',\n]\n[mcp_servers.ASC-Monetization.env]\nTOKEN = "never-print"\n[mcp_servers.ASC-Core]\ncommand = "npx"\nargs = ["-y", "${PACKAGE}", "core"]\n`);
    const c: McpClient = { id: 'codex', label: 'Codex', targets: [{ kind: 'cli', bin: 'absent-cli', where: 'config.toml', localFile: path, add: () => [] }] };
    expect(readRegistrations(c, true).map((r) => r.spec)).toEqual(['monetization:transactions', 'core']);
    const report = doctorReport([c], env);
    expect(report).toContain('ASC-Core: registered');
    expect(report).not.toContain('never-print');
    expect(registeredProfileSpecs([c])).toEqual(['monetization:transactions']);
    expect(execFileSync).not.toHaveBeenCalled();
    writeFileSync(path, '[mcp_servers."ASC-General"]\nargs = [unsupported]\n');
    expect(doctorReport([c], env)).toContain('profile could not be determined');
  });

  it('does not turn TOML examples in multiline instructions into registrations', () => {
    const path = join(dir, 'config.toml');
    writeFileSync(path, `instructions = '''\n[mcp_servers.ASC-Fake]\nargs = ["-y", "${PACKAGE}", "app-info"]\n'''\n[mcp_servers.ASC-General] # actual entry\nargs = ["-y", "${PACKAGE}", "general", "--flag=with]bracket"]\n`);
    const c: McpClient = { id: 'codex', label: 'Codex', targets: [{ kind: 'cli', bin: 'absent-cli', where: 'config.toml', localFile: path, add: () => [] }] };
    expect(readRegistrations(c, true).map((r) => [r.name, r.spec])).toEqual([['ASC-General', 'general']]);
  });
});

describe('credential availability without reading key contents', () => {
  it('checks a key file by access, including missing files and directories', () => {
    const path = join(dir, 'key.p8');
    writeFileSync(path, 'secret-that-must-not-be-read');
    writeSharedConfig({ keyId: 'id', issuerId: 'issuer', privateKeyPath: path }, env);
    expect(credentialPresence(env)).toContain('key file readable');
    expect(credentialPresence(env)).not.toContain('secret-that');
    rmSync(path);
    expect(credentialPresence(env)).toContain('missing or unreadable');
    expect(credentialPresence({ ...env, ASC_KEY_ID: 'id', ASC_ISSUER_ID: 'issuer', ASC_PRIVATE_KEY_PATH: dir })).toContain('missing or unreadable');
  });

  it('honors environment precedence instead of mixing accounts', () => {
    writeSharedConfig({ keyId: 'id', issuerId: 'issuer', privateKeyKeychain: 'svc/account' }, env);
    const hasItem = vi.fn().mockReturnValue(true);
    expect(credentialPresence(env, hasItem)).toContain('Keychain item present');
    expect(hasItem).toHaveBeenCalledWith('svc/account');
    expect(credentialPresence({ ...env, ASC_KEY_ID: 'other' }, hasItem)).toContain('missing Key ID or Issuer ID');
    expect(credentialPresence({ ASC_KEY_ID: 'id', ASC_ISSUER_ID: 'issuer', ASC_PRIVATE_KEY: 'inline-secret' })).toContain('inline key configured');
    expect(credentialPresence(env, () => false)).toContain('Keychain item missing or inaccessible');
    writeFileSync(join(dir, 'config.json'), '{');
    expect(credentialPresence(env)).toContain('shared config could not be read');
  });

  it('asks security for metadata only and discards its output', () => {
    const exec = vi.fn();
    expect(keychainItemPresent('service/team/account', 'darwin', exec)).toBe(true);
    expect(exec).toHaveBeenCalledWith('security', ['find-generic-password', '-s', 'service', '-a', 'team/account'], { stdio: 'ignore' });
    exec.mockImplementation(() => { throw new Error('locked'); });
    expect(keychainItemPresent('service/account', 'darwin', exec)).toBe(false);
    exec.mockClear();
    expect(keychainItemPresent('invalid', 'darwin', exec)).toBe(false);
    expect(keychainItemPresent('service/account', 'linux', exec)).toBe(false);
    expect(exec).not.toHaveBeenCalled();
  });
});
