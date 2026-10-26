/**
 * The binary has to actually start.
 *
 * `main()` is guarded so that importing this module — a test reading helpText —
 * doesn't open a server on stdio. The first version compared `import.meta.url`
 * to a raw `process.argv[1]`, which is true when you run `node dist/index.js`
 * and false through a symlink. Both `npm install -g` and `npx` go through a
 * symlink, so every installed copy exited 0 with no banner and no error: the
 * client just said "failed to connect" and there was nothing to read.
 *
 * These run the built output, so they only mean something after `npm run build`
 * — which `npm test` does not do. They skip rather than lie when dist is stale.
 */
import { describe, it, expect } from 'vitest';
import { execFileSync, spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, symlinkSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';

const DIST = resolve(__dirname, '../dist/index.js');
const VERSION = createRequire(import.meta.url)('../package.json').version;
const built = existsSync(DIST);

const run = (bin: string, args: string[]): string =>
  execFileSync('node', [bin, ...args], { encoding: 'utf8', timeout: 20_000 });

/**
 * A profile argument that no longer resolves — `app-info` from a 2.x config, or
 * a typo. With no terminal it is almost certainly an MCP client, so the server
 * starts with one tool that tells the agent what to relay. With nothing on the
 * other end it must still fail, not hang.
 */
describe.skipIf(!built)('an unknown profile', () => {
  const runServer = (input: string) =>
    spawnSync(process.execPath, [DIST, 'app-info'], {
      input,
      encoding: 'utf8',
      timeout: 20_000,
      env: { ...process.env, ASC_CONFIG_DIR: mkdtempSync(join(tmpdir(), 'asc-empty-')) },
    });

  it('fails at once when input closes before any client speaks', () => {
    const res = runServer('');
    expect(res.status).toBe(1);
    expect(res.stderr).toContain('npx -y @erayendes/asc-mcp setup');
    expect(res.stderr).toContain('general');
  });

  it('serves the one tool that says to run setup, to a client that does speak', () => {
    const rpc = (msg: object) => JSON.stringify({ jsonrpc: '2.0', ...msg }) + '\n';
    const res = runServer(
      rpc({ id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 't', version: '0' } } }) +
        rpc({ method: 'notifications/initialized' }) +
        rpc({ id: 2, method: 'tools/call', params: { name: 'asc__profile_unknown', arguments: {} } })
    );
    expect(res.stdout).toContain('ASC-AppInfo');
    expect(res.stdout).toContain('asc-mcp setup');
  });
});

describe.skipIf(!built)('the binary starts', () => {
  it('answers --version when run directly', () => {
    expect(run(DIST, ['--version']).trim()).toBe(VERSION);
  });

  it('answers --version through a symlink, the way npx and -g invoke it', () => {
    const dir = mkdtempSync(join(tmpdir(), 'asc-bin-'));
    const link = join(dir, 'asc-mcp');
    try {
      symlinkSync(DIST, link);
      expect(run(link, ['--version']).trim()).toBe(VERSION);
      expect(run(link, ['--help'])).toContain('Profiles:');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

/**
 * `register` is the door an agent uses. It runs with no terminal, so every
 * check the pickers do interactively has to happen up front — and it must not
 * behave like `setup`, which prunes what you unchecked.
 *
 * Runs the real binary against a throwaway HOME so it writes a real config
 * file, because "did the right JSON land on disk" is the only question worth
 * asking here.
 */
describe.skipIf(!built)('register — the non-interactive door', () => {
  const sandbox = (): { home: string; cursor: string } => {
    const home = mkdtempSync(join(tmpdir(), 'asc-register-'));
    mkdirSync(join(home, '.cursor'));
    return { home, cursor: join(home, '.cursor', 'mcp.json') };
  };
  /** Never inherits the real HOME: this writes client configs. */
  const register = (home: string, args: string[], extraEnv: Record<string, string> = {}): { out: string; code: number } => {
    try {
      return {
        out: execFileSync(process.execPath, [DIST, 'register', ...args], {
          encoding: 'utf8',
          timeout: 20_000,
          // A bare PATH so no real `claude`/`codex` on this machine is found
          // and driven: the sandbox HOME only isolates the JSON clients.
          // os.homedir() reads USERPROFILE on Windows, not HOME.
          env: { HOME: home, USERPROFILE: home, PATH: '/nonexistent', ...extraEnv },
        }),
        code: 0,
      };
    } catch (err) {
      const e = err as { stdout?: string; stderr?: string; status?: number };
      return { out: `${e.stdout ?? ''}${e.stderr ?? ''}`, code: e.status ?? 1 };
    }
  };
  const servers = (path: string): string[] =>
    Object.keys(JSON.parse(readFileSync(path, 'utf8')).mcpServers);
  const codeConfig = (home: string): string => process.platform === 'darwin'
    ? join(home, 'Library', 'Application Support', 'Code', 'User', 'mcp.json')
    : process.platform === 'win32'
      ? join(home, 'AppData', 'Roaming', 'Code', 'User', 'mcp.json')
      : join(home, '.config', 'Code', 'User', 'mcp.json');
  const fakeCode = (home: string): Record<string, string> => {
    const bin = join(home, 'code');
    writeFileSync(bin, `#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const args = process.argv.slice(2);
fs.writeFileSync(path.join(process.env.HOME, 'code-argv.json'), JSON.stringify(args));
const file = process.platform === 'darwin'
  ? path.join(process.env.HOME, 'Library', 'Application Support', 'Code', 'User', 'mcp.json')
  : process.platform === 'win32'
    ? path.join(process.env.APPDATA, 'Code', 'User', 'mcp.json')
    : path.join(process.env.HOME, '.config', 'Code', 'User', 'mcp.json');
const entry = JSON.parse(args[1]);
const doc = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { servers: {} };
doc.servers[entry.name] = { ...entry }; delete doc.servers[entry.name].name;
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, JSON.stringify(doc));
`);
    chmodSync(bin, 0o755);
    return { PATH: `${home}:${process.env.PATH}`, APPDATA: join(home, 'AppData', 'Roaming') };
  };

  // shortcut: the fake CLIs are shebang scripts, which Windows will not execute; give them a .cmd shim if Windows CI should cover these.
  const fakeBinIt = process.platform === 'win32' ? it.skip : it;
  it('writes the profiles it was given, sub-profile argument and all', () => {
    const { home, cursor } = sandbox();
    const { out, code } = register(home, ['monetization:transactions', 'analytics', '--clients=cursor']);
    expect(code).toBe(0);
    expect(out).toContain('✓ added ASC-Monetization');
    // Core comes along: app lookup and search live nowhere else.
    expect(out).toContain('✓ added ASC-Core');
    expect(servers(cursor)).toEqual(['ASC-Monetization', 'ASC-Analytics', 'ASC-Core']);
    const args = JSON.parse(readFileSync(cursor, 'utf8')).mcpServers['ASC-Monetization'].args;
    expect(args.at(-1)).toBe('monetization:transactions');
    rmSync(home, { recursive: true, force: true });
  });

  fakeBinIt('registers VS Code through its real client definition with a fake code binary', () => {
    const { home } = sandbox();
    const { out, code } = register(home, ['general', '--clients=vscode'], fakeCode(home));
    const path = codeConfig(home);
    expect(code).toBe(0);
    expect(out).toContain('added ASC-General');
    expect(JSON.parse(readFileSync(join(home, 'code-argv.json'), 'utf8'))[0]).toBe('--add-mcp');
    expect(JSON.parse(readFileSync(path, 'utf8')).servers['ASC-General'].args.at(-1)).toBe('general');
    rmSync(home, { recursive: true, force: true });
  });

  fakeBinIt('reads VS Code JSONC and leaves a credential entry untouched', () => {
    const { home } = sandbox();
    const env = fakeCode(home);
    const path = codeConfig(home);
    mkdirSync(resolve(path, '..'), { recursive: true });
    const jsonc = `{
  // A user entry with a trailing comma and a URL string.
  "servers": {
    "ASC-General": { "command": "npx", "args": ["-y", "@erayendes/asc-mcp", "general", "--url=https://example.test/a/*"],
      "env": { "ASC_KEY_ID": "test-only-secret", }, },
  },
}`;
    writeFileSync(path, jsonc);
    const { out, code } = register(home, ['general', '--clients=vscode'], env);
    expect(code).toBe(0);
    expect(out).toContain('user-managed, unchanged: ASC-General');
    expect(readFileSync(path, 'utf8')).toBe(jsonc);
    expect(existsSync(join(home, 'code-argv.json'))).toBe(false);
    rmSync(home, { recursive: true, force: true });
  });

  fakeBinIt('reports an unreadable VS Code target without calling add', () => {
    const { home } = sandbox();
    const env = fakeCode(home);
    const path = codeConfig(home);
    mkdirSync(resolve(path, '..'), { recursive: true });
    writeFileSync(path, '{ "servers": { "ASC-General": ');
    const { out, code } = register(home, ['general', '--clients=vscode'], env);
    expect(code).toBe(0);
    expect(out).toContain('unreadable');
    expect(existsSync(join(home, 'code-argv.json'))).toBe(false);
    expect(readFileSync(path, 'utf8')).toBe('{ "servers": { "ASC-General": ');
    rmSync(home, { recursive: true, force: true });
  });

  fakeBinIt('uses Claude Code add-json with the full entry as a single argument', () => {
    const { home } = sandbox();
    const bin = join(home, 'claude');
    writeFileSync(bin, `#!/usr/bin/env node
const fs = require('node:fs');
const path = process.env.HOME + '/.claude.json';
const log = process.env.HOME + '/claude-argv.json';
const args = process.argv.slice(2);
const calls = fs.existsSync(log) ? JSON.parse(fs.readFileSync(log, 'utf8')) : [];
calls.push(args); fs.writeFileSync(log, JSON.stringify(calls));
const doc = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path, 'utf8')) : { mcpServers: {} };
const name = args[1] === 'add-json' ? args[4] : args[2];
if (args[1] === 'add-json') {
  if (doc.mcpServers[name]) process.exit(2);
  doc.mcpServers[name] = JSON.parse(args[5]);
}
if (args[1] === 'remove') delete doc.mcpServers[name];
fs.writeFileSync(path, JSON.stringify(doc));
`);
    chmodSync(bin, 0o755);
    const old = { command: 'npx', args: ['-y', '@erayendes/asc-mcp@beta', 'general', '--read-only'],
      env: { DEMO_MODE: 'yes' }, timeout: 19 };
    writeFileSync(join(home, '.claude.json'), JSON.stringify({ mcpServers: { 'ASC-General': old } }));
    const { code } = register(home, ['general', '--clients=claude'],
      { PATH: `${home}:${process.env.PATH}` });
    const calls = JSON.parse(readFileSync(join(home, 'claude-argv.json'), 'utf8'));
    const updated = JSON.parse(readFileSync(join(home, '.claude.json'), 'utf8')).mcpServers['ASC-General'];
    expect(code).toBe(0);
    expect(calls.map((args: string[]) => args[1])).toEqual(['add-json', 'remove', 'add-json', 'add-json']);
    expect(JSON.parse(calls[2][5])).toEqual({ ...old,
      args: ['-y', '@erayendes/asc-mcp', 'general', '--read-only'] });
    expect(updated).toEqual(JSON.parse(calls[2][5]));
    // Core follows the profile's read-only, added as a whole entry too.
    expect(calls[3][4]).toBe('ASC-Core');
    expect(JSON.parse(calls[3][5])).toEqual({ command: 'npx', args: ['-y', '@erayendes/asc-mcp', 'core', '--read-only'] });
    rmSync(home, { recursive: true, force: true });
  });

  it('adds without pruning what was already there', () => {
    // setup reconciles because the user is looking at the list. An agent is
    // not, so asking for one profile must never drop the others.
    const { home, cursor } = sandbox();
    register(home, ['analytics', '--clients=cursor']);
    register(home, ['webhooks', '--clients=cursor']);
    expect(servers(cursor)).toEqual(['ASC-Analytics', 'ASC-Core', 'ASC-Webhooks']);
    rmSync(home, { recursive: true, force: true });
  });

  it('gives core the read-only an entry has in its env', () => {
    const { home, cursor } = sandbox();
    writeFileSync(cursor, JSON.stringify({ mcpServers: {
      'ASC-Analytics': { command: 'npx', args: ['-y', '@erayendes/asc-mcp', 'analytics'], env: { ASC_READ_ONLY: 'true' } },
    } }));
    const { out } = register(home, ['webhooks', '--clients=cursor']);
    expect(out).toContain('✓ added ASC-Core (--read-only)');
    expect(JSON.parse(readFileSync(cursor, 'utf8')).mcpServers['ASC-Core'].args)
      .toEqual(['-y', '@erayendes/asc-mcp', 'core', '--read-only']);
    rmSync(home, { recursive: true, force: true });
  });

  it('deletes a dead entry of ours and names it, and only reports one the user manages', () => {
    const { home, cursor } = sandbox();
    const kept = { command: 'npx', args: ['-y', '@erayendes/asc-mcp', 'access:users'], env: { ASC_KEY_ID: 'kept-secret' } };
    writeFileSync(cursor, JSON.stringify({ mcpServers: {
      'ASC-AppInfo': { command: 'npx', args: ['-y', '@erayendes/asc-mcp', 'app-info', '--read-only'], env: { DEMO_MODE: 'demo-secret' } },
      'ASC-Access': kept,
    } }));
    const { out, code } = register(home, ['general', '--clients=cursor']);
    const entries = JSON.parse(readFileSync(cursor, 'utf8')).mcpServers;
    expect(code).toBe(0);
    expect(out).toContain('✓ removed ASC-AppInfo (app-info; --read-only; env DEMO_MODE) — its profile no longer exists');
    expect(out).toContain('dead entry left as is — ASC-Access (access:users; env ASC_KEY_ID): user-managed');
    expect(out).not.toMatch(/demo-secret|kept-secret/);
    expect(entries['ASC-AppInfo']).toBeUndefined();
    expect(entries['ASC-Access']).toEqual(kept);
    rmSync(home, { recursive: true, force: true });
  });

  it('keeps read-only flags and env on a channel rewrite, and reports credential entries', () => {
    const { home, cursor } = sandbox();
    const other = '@erayendes/asc-mcp@beta';
    const guarded = { command: 'npx', args: ['-y', other, 'analytics'],
      env: { ASC_CONFIG_DIR: '/test-only/config' } };
    writeFileSync(cursor, JSON.stringify({ mcpServers: {
      'ASC-General': { command: 'npx', args: ['-y', other, 'general', '--read-only'],
        env: { DEMO_MODE: 'yes' }, timeout: 10 },
      'ASC-Analytics': guarded,
    } }));
    const { out, code } = register(home, ['general', 'analytics', '--clients=cursor']);
    const entries = JSON.parse(readFileSync(cursor, 'utf8')).mcpServers;
    expect(code).toBe(0);
    expect(entries['ASC-General']).toEqual({ command: 'npx',
      args: ['-y', '@erayendes/asc-mcp', 'general', '--read-only'],
      env: { DEMO_MODE: 'yes' }, timeout: 10 });
    expect(entries['ASC-Analytics']).toEqual(guarded);
    expect(out).toContain('user-managed, unchanged: ASC-Analytics');
    // One entry signs in through its own config dir, the other through the
    // shared one: core cannot be shown to match both, so it is not added.
    expect(out).toContain('ASC-Core not added');
    expect(out).toContain('different App Store Connect accounts');
    expect(entries['ASC-Core']).toBeUndefined();
    expect(out).not.toContain('/test-only/config');
    rmSync(home, { recursive: true, force: true });
  });

  it('moves every pre-2.5.0 name to the new one, and touches nothing else', () => {
    // Claude merges its configs by key: leaving `asc-analytics` beside
    // `ASC-Analytics` lists the same server twice.
    const { home, cursor } = sandbox();
    writeFileSync(
      cursor,
      JSON.stringify({
        mcpServers: {
          'asc-analytics': { command: 'npx', args: ['-y', '@erayendes/asc-mcp', 'analytics'] },
          'asc-webhooks': { command: 'npx', args: ['-y', '@erayendes/asc-mcp', 'webhooks'] },
          github: { command: 'gh' },
        },
      })
    );
    register(home, ['analytics', '--clients=cursor']);
    // register never prunes: webhooks was not asked for, but it moves to the
    // new name rather than being lost.
    expect(servers(cursor).sort()).toEqual(['ASC-Analytics', 'ASC-Core', 'ASC-Webhooks', 'github'].sort());
    rmSync(home, { recursive: true, force: true });
  });

  it('says nothing changed rather than rewriting an identical config', () => {
    const { home, cursor } = sandbox();
    register(home, ['analytics', '--clients=cursor']);
    const before = readFileSync(cursor, 'utf8');
    const { out } = register(home, ['analytics', '--clients=cursor']);
    expect(out).toContain('No changes');
    expect(readFileSync(cursor, 'utf8')).toBe(before);
    rmSync(home, { recursive: true, force: true });
  });

  it('refuses a typo before it writes anything', () => {
    const { home, cursor } = sandbox();
    const { out, code } = register(home, ['monetizaton', '--clients=cursor']);
    expect(code).toBe(1);
    expect(out).toMatch(/Unknown profile/);
    expect(existsSync(cursor)).toBe(false);
    rmSync(home, { recursive: true, force: true });
  });

  it('refuses an unknown client and lists the real ones', () => {
    const { home } = sandbox();
    const { out, code } = register(home, ['analytics', '--clients=notepad']);
    expect(code).toBe(1);
    expect(out).toMatch(/Unknown client: notepad/);
    expect(out).toContain('cursor');
    rmSync(home, { recursive: true, force: true });
  });

  it('points at setup when there are no credentials yet', () => {
    // The agent may register; only the user may hand over the .p8. Without
    // this line they are left with servers that start and cannot authenticate.
    const { home } = sandbox();
    const { out } = register(home, ['analytics', '--clients=cursor']);
    expect(out).toMatch(/No credentials stored yet/);
    expect(out).toContain('asc-mcp setup');
    rmSync(home, { recursive: true, force: true });
  });
});
