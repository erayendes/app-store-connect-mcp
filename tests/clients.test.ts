/**
 * The client registry decides where a profile gets registered. Everything it
 * gets wrong is silent — a server written under the wrong key, or into the
 * wrong file, produces a client that starts fine and simply has no tools.
 *
 * The JSON tests run against real temp files rather than a mock, because the
 * failure that matters is what ends up on disk.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  chmodSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  CLIENTS,
  OTHER_CLIENT,
  applyToClient,
  isPresent,
  listRegistered,
  readRegistrations,
  registrationBlock,
  manualBlock,
  serverArgs,
  serverName,
  profileOfServer,
  type McpClient,
  PACKAGE,
  isRunningIn,
} from '../src/clients.js';
import { applyPlan, planChanges, plansForUnticked, printPlan, reconcileRegistration, registeredAcross } from '../src/setup.js';
import { PROFILES } from '../src/profiles.js';

let dir: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'asc-clients-'));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

/** A stand-in for Cursor/Windsurf/Antigravity — same shape, writable path. */
const jsonClient = (file = 'mcp.json', key = 'mcpServers'): McpClient => ({
  id: 'temp',
  label: 'Temp',
  targets: [{ kind: 'json', path: join(dir, file), where: file, key }],
});

describe('the registry itself', () => {
  it('gives every client at least one target, and Other none', () => {
    for (const c of CLIENTS) expect(c.targets.length, c.label).toBeGreaterThan(0);
    // Other exists to print. A target would make it write somewhere real.
    expect(OTHER_CLIENT.targets).toEqual([]);
  });

  it('keeps Claude Code and Claude Desktop on one row but two files', () => {
    // They do not share a config. One row that wrote only one of them would
    // reproduce the exact failure this row exists to prevent.
    const claude = CLIENTS.find((c) => c.id === 'claude')!;
    expect(claude.targets).toHaveLength(2);
    expect(claude.targets.map((t) => t.kind).sort()).toEqual(['cli', 'json']);
  });

  it('writes VS Code servers under "servers", not "mcpServers"', () => {
    // VS Code is the only client that renamed the key. Getting this wrong is
    // invisible: the file is valid JSON and the server never loads.
    const vscode = CLIENTS.find((c) => c.id === 'vscode')!;
    expect(JSON.parse(manualBlock(vscode, ['monetization']))).toHaveProperty('servers');
    const cursor = CLIENTS.find((c) => c.id === 'cursor')!;
    expect(JSON.parse(manualBlock(cursor, ['monetization']))).toHaveProperty('mcpServers');
  });

  it('does not call a leftover config directory an installed client', () => {
    // An uninstalled Cursor leaves ~/.cursor/ behind with rules in it. Testing
    // the directory reported that as Cursor and offered to configure an app
    // that was not on the machine.
    const ghost: McpClient = {
      id: 'ghost',
      label: 'Ghost',
      targets: [
        { kind: 'json', path: join(dir, 'leftovers', 'mcp.json'), where: 'x', key: 'mcpServers', app: 'NoSuchApp' },
      ],
    };
    mkdirSync(join(dir, 'leftovers'));
    writeFileSync(join(dir, 'leftovers', 'rules'), 'left behind');
    expect(isPresent(ghost)).toBe(false);
  });

  it('still writes a client the user checked but detection did not find', () => {
    // The picker leaves undetected clients checkable on purpose — configuring
    // Cursor today and installing it tomorrow is a reasonable thing to want.
    const undetected: McpClient = {
      id: 'later',
      label: 'Later',
      targets: [{ kind: 'json', path: join(dir, 'later', 'mcp.json'), where: 'x', key: 'mcpServers', app: 'NoSuchApp' }],
    };
    expect(isPresent(undetected)).toBe(false);
    const { results } = applyToClient(undetected, ['webhooks'], []);
    expect(results.every((r) => r.ok)).toBe(true);
    expect(existsSync(join(dir, 'later', 'mcp.json'))).toBe(true);
  });

  it('names a server after the profile, never the sub-profile spec', () => {
    expect(serverName('monetization:iap-offers,storekit')).toBe('ASC-Monetization');
    expect(serverName('webhooks')).toBe('ASC-Webhooks');
    // The spec still has to survive into the arguments, or narrowing is lost.
    expect(serverArgs('monetization:storekit').at(-1)).toBe('monetization:storekit');
  });

  it('reads a profile back from either spelling of its server name', () => {
    expect(serverName('app-info')).toBe('ASC-AppInfo');
    expect(serverName('testflight')).toBe('ASC-TestFlight');
    // Every profile survives the round trip, and so does the pre-2.5.0 key:
    // migration finds old entries by it.
    for (const p of PROFILES) {
      expect(profileOfServer(serverName(p.name))).toBe(p.name);
      expect(profileOfServer(`asc-${p.name}`)).toBe(p.name);
    }
    expect(profileOfServer('github')).toBeUndefined();
  });

  it('emits a paste block that parses back to a runnable entry', () => {
    const doc = JSON.parse(manualBlock(CLIENTS[0], ['distribution:version']));
    expect(doc.mcpServers['ASC-Distribution']).toEqual({
      command: 'npx',
      args: ['-y', PACKAGE, 'distribution:version'],
    });
  });
});

describe('what it reports back', () => {
  /** Two files, like Claude: one CLI that is not installed, two JSON configs. */
  const twoTargets = (): McpClient => ({
    id: 'pair',
    label: 'Pair',
    targets: [
      { kind: 'json', path: join(dir, 'a.json'), where: 'a', key: 'mcpServers' },
      { kind: 'json', path: join(dir, 'b.json'), where: 'b', key: 'mcpServers' },
    ],
  });

  it('reports one line per profile, however many files it wrote', () => {
    // Claude writes two configs. Reporting each listed every profile twice —
    // sixteen ticks for eight profiles, next to eight for every other client,
    // which reads as though the others came up short.
    const { results } = applyToClient(twoTargets(), ['analytics', 'webhooks'], []);
    expect(results.map((r) => r.message)).toEqual(['added ASC-Analytics', 'added ASC-Webhooks']);
    // Both files really were written — the collapse is in the reporting only.
    for (const f of ['a.json', 'b.json']) {
      expect(Object.keys(JSON.parse(readFileSync(join(dir, f), 'utf8')).mcpServers)).toEqual([
        'ASC-Analytics',
        'ASC-Webhooks',
      ]);
    }
  });

  it('calls a profile failed when any one of its files failed', () => {
    // Claude Code succeeding while Claude Desktop did not is not a success:
    // the profile is missing from a client the user believes carries it.
    writeFileSync(join(dir, 'b.json'), '{ // comment\n}');
    const { results, needsManual } = applyToClient(twoTargets(), ['analytics'], []);
    expect(results).toHaveLength(1);
    expect(results[0].ok).toBe(false);
    expect(needsManual).toBe(true);
  });
});

describe('writing a JSON client config', () => {
  it('creates the file when the client has never been configured', () => {
    const client = jsonClient();
    const { results, needsManual } = applyToClient(client, ['monetization'], []);
    expect(needsManual).toBe(false);
    expect(results.every((r) => r.ok)).toBe(true);
    const doc = JSON.parse(readFileSync(join(dir, 'mcp.json'), 'utf8'));
    expect(doc.mcpServers['ASC-Monetization'].args).toContain('monetization');
  });

  it('leaves every other server and top-level key alone', () => {
    // The user's file is not ours. Losing an unrelated server here would be
    // the worst possible outcome of a setup run.
    writeFileSync(
      join(dir, 'mcp.json'),
      JSON.stringify({ theme: 'dark', mcpServers: { github: { command: 'gh' } } })
    );
    applyToClient(jsonClient(), ['analytics'], []);
    const doc = JSON.parse(readFileSync(join(dir, 'mcp.json'), 'utf8'));
    expect(doc.theme).toBe('dark');
    expect(doc.mcpServers.github).toEqual({ command: 'gh' });
    expect(doc.mcpServers['ASC-Analytics']).toBeDefined();
  });

  it('backs the file up before rewriting it', () => {
    writeFileSync(join(dir, 'mcp.json'), JSON.stringify({ mcpServers: {} }, null, 4));
    applyToClient(jsonClient(), ['webhooks'], []);
    expect(existsSync(join(dir, 'mcp.json.bak'))).toBe(true);
    // The backup is the only copy of the user's original indentation.
    expect(readFileSync(join(dir, 'mcp.json.bak'), 'utf8')).toContain('    ');
  });

  it('writes through a symlink, keeps the mode, and leaves no temp file', () => {
    // Dotfile managers link these configs; renaming over the link would
    // silently replace it with a plain file and detach it from the repo.
    const real = join(dir, 'real.json');
    writeFileSync(real, JSON.stringify({ mcpServers: {} }));
    chmodSync(real, 0o600);
    symlinkSync(real, join(dir, 'mcp.json'));
    applyToClient(jsonClient(), ['analytics'], []);
    expect(lstatSync(join(dir, 'mcp.json')).isSymbolicLink()).toBe(true);
    expect(JSON.parse(readFileSync(real, 'utf8')).mcpServers['ASC-Analytics']).toBeDefined();
    // Windows has no POSIX modes to keep: chmod only toggles read-only.
    if (process.platform !== 'win32') expect(statSync(real).mode & 0o777).toBe(0o600);
    expect(readdirSync(dir).filter((f) => f.endsWith('.tmp'))).toEqual([]);
  });

  it('removes a server that is no longer chosen', () => {
    writeFileSync(
      join(dir, 'mcp.json'),
      JSON.stringify({ mcpServers: { 'ASC-Analytics': { command: 'npx', args: serverArgs('analytics') }, keep: {} } })
    );
    applyToClient(jsonClient(), [], ['ASC-Analytics']);
    const doc = JSON.parse(readFileSync(join(dir, 'mcp.json'), 'utf8'));
    expect(doc.mcpServers['ASC-Analytics']).toBeUndefined();
    expect(doc.mcpServers.keep).toBeDefined();
  });

  it('re-registers a narrowed profile under the same name', () => {
    applyToClient(jsonClient(), ['monetization'], []);
    applyToClient(jsonClient(), ['monetization:storekit'], []);
    const doc = JSON.parse(readFileSync(join(dir, 'mcp.json'), 'utf8'));
    expect(Object.keys(doc.mcpServers)).toEqual(['ASC-Monetization']);
    expect(doc.mcpServers['ASC-Monetization'].args.at(-1)).toBe('monetization:storekit');
  });

  it('refuses to touch a file it could not parse, and says so', () => {
    // Cursor and VS Code allow comments. JSON.parse does not. Overwriting here
    // would silently delete every server the user had.
    const withComments = '{\n  // my servers\n  "mcpServers": { "github": { "command": "gh" } }\n}';
    writeFileSync(join(dir, 'mcp.json'), withComments);
    const { results, needsManual } = applyToClient(jsonClient(), ['analytics'], []);
    expect(needsManual).toBe(true);
    expect(results[0].ok).toBe(false);
    expect(results[0].message).toMatch(/could not be parsed/);
    expect(readFileSync(join(dir, 'mcp.json'), 'utf8')).toBe(withComments);
  });

  it('honours a client that keys its servers differently', () => {
    applyToClient(jsonClient('vs.json', 'servers'), ['app-info'], []);
    const doc = JSON.parse(readFileSync(join(dir, 'vs.json'), 'utf8'));
    expect(doc.servers['ASC-AppInfo']).toBeDefined();
    expect(doc.mcpServers).toBeUndefined();
  });
});

describe('reading back what is registered', () => {
  it('allows a blind add only through Claude add-json, which refuses duplicates', () => {
    const target = { kind: 'cli' as const, bin: 'claude', where: 'fake',
      add: () => [] as string[], addEntry: () => [] as string[] };
    expect(registrationBlock([{ name: '*', target }]).canAdd('app-info')).toBe(true);
    expect(registrationBlock([{ name: '*', target: { ...target, bin: 'codex' } }]).canAdd('app-info')).toBe(false);
  });

  it('parses the first non-option argument after the package as the spec', () => {
    writeFileSync(join(dir, 'mcp.json'), JSON.stringify({ mcpServers: {
      'ASC-AppInfo': { command: 'npx', args: ['-y', PACKAGE, 'app-info', '--read-only'] },
    } }));
    const first = readRegistrations(jsonClient())[0];
    expect(first.spec).toBe('app-info');
    expect(first.entry?.args).toEqual(['-y', PACKAGE, 'app-info', '--read-only']);
    expect(first.target).toMatchObject({ kind: 'json', path: join(dir, 'mcp.json') });
    writeFileSync(join(dir, 'mcp.json'), JSON.stringify({ mcpServers: {
      'ASC-AppInfo': { command: 'npx', args: ['-y', PACKAGE, '--read-only', 'app-info'] },
    } }));
    expect(readRegistrations(jsonClient())[0].spec).toBe('app-info');
  });

  it('preserves flags, env and other fields when changing release channel', () => {
    const other = PACKAGE.endsWith('@beta') ? '@erayendes/asc-mcp' : '@erayendes/asc-mcp@beta';
    const entry = { command: 'npx', args: ['-y', other, 'app-info', '--read-only', '--x=private-value'],
      env: { DEMO_MODE: 'yes' }, timeout: 12 };
    writeFileSync(join(dir, 'mcp.json'), JSON.stringify({ mcpServers: { 'ASC-AppInfo': entry } }));
    const found = readRegistrations(jsonClient());
    const plan = planChanges([jsonClient()], ['app-info'], new Map([['temp', found]]), { prune: false,
      stale: new Map([['temp', new Set(['ASC-AppInfo'])]]) });
    expect(plan[0].rewrites).toEqual(['ASC-AppInfo (--read-only --x=<hidden>)']);
    const lines: string[] = [];
    printPlan(plan, (line) => lines.push(line));
    expect(lines.join('\n')).toContain('rewrite ASC-AppInfo (--read-only --x=<hidden>)');
    expect(lines.join('\n')).not.toContain('private-value');
    expect(lines.join('\n')).not.toContain('yes');
    applyPlan(plan, () => {});
    const after = JSON.parse(readFileSync(join(dir, 'mcp.json'), 'utf8')).mcpServers['ASC-AppInfo'];
    expect(after).toEqual({ ...entry, args: ['-y', PACKAGE, 'app-info', '--read-only', '--x=private-value'] });
  });

  it('reports and leaves a credential-carrying entry untouched in planning and writing', () => {
    const entry = { command: 'npx', args: ['-y', PACKAGE, 'app-info', '--read-only'],
      env: { ASC_KEY_ID: 'test-only-secret' }, note: 'mine' };
    writeFileSync(join(dir, 'mcp.json'), JSON.stringify({ mcpServers: { 'ASC-AppInfo': entry } }));
    const plan = planChanges([jsonClient()], ['app-info'], new Map([['temp', readRegistrations(jsonClient())]]),
      { prune: true });
    expect(plan[0].userManaged).toEqual(['ASC-AppInfo (--read-only)']);
    expect(plan[0].toAdd).toEqual([]);
    expect(plan[0].toRemove).toEqual([]);
    applyPlan(plan, () => {});
    applyToClient(jsonClient(), ['app-info'], ['ASC-AppInfo']);
    expect(JSON.parse(readFileSync(join(dir, 'mcp.json'), 'utf8')).mcpServers['ASC-AppInfo']).toEqual(entry);
    expect(plansForUnticked([], [jsonClient()])[0].userManaged).toEqual(['ASC-AppInfo (--read-only)']);
  });

  it('does not ask to apply a terminal plan that only reports user-managed entries', async () => {
    writeFileSync(join(dir, 'mcp.json'), JSON.stringify({ mcpServers: {
      'ASC-AppInfo': { command: 'node', args: ['custom.js'] },
    } }));
    const client = jsonClient();
    await reconcileRegistration([client], ['app-info'], registeredAcross([client]),
      async () => { throw new Error('unexpected Apply prompt'); }, [client]);
  });

  it.each([
    { env: { ASC_ISSUER_ID: 'test-id' } },
    { env: { ASC_PRIVATE_KEY_PATH: '/test/key' } },
    { envFile: '/test/env' },
  ])('protects credential settings in %j', (extra) => {
    const entry = { command: 'npx', args: serverArgs('app-info'), ...extra };
    writeFileSync(join(dir, 'mcp.json'), JSON.stringify({ mcpServers: { 'ASC-AppInfo': entry } }));
    const plan = planChanges([jsonClient()], ['app-info'], new Map([['temp', readRegistrations(jsonClient())]]),
      { prune: true });
    expect(plan[0].userManaged).toEqual(['ASC-AppInfo']);
    expect(plan[0].toAdd).toEqual([]);
    expect(plansForUnticked([], [jsonClient()])[0].toRemove).toEqual([]);
    applyToClient(jsonClient(), ['app-info'], ['ASC-AppInfo']);
    expect(JSON.parse(readFileSync(join(dir, 'mcp.json'), 'utf8')).mcpServers['ASC-AppInfo']).toEqual(entry);
  });

  it('never prunes or unticks an ASC-named entry without our package', () => {
    const entry = { command: 'node', args: ['other.js'] };
    writeFileSync(join(dir, 'mcp.json'), JSON.stringify({ mcpServers: { 'ASC-AppInfo': entry } }));
    const plan = planChanges([jsonClient()], ['analytics'], new Map([['temp', readRegistrations(jsonClient())]]),
      { prune: true });
    expect(plan[0].toRemove).toEqual([]);
    expect(plansForUnticked([], [jsonClient()])[0].toRemove).toEqual([]);
    applyPlan(plan, () => {});
    expect(JSON.parse(readFileSync(join(dir, 'mcp.json'), 'utf8')).mcpServers['ASC-AppInfo']).toEqual(entry);
  });

  it('migrates a legacy name while preserving flags, env and other fields', () => {
    const old = { command: 'npx', args: ['-y', PACKAGE, 'app-info', '--read-only'],
      env: { DEMO_MODE: 'yes' }, timeout: 14 };
    writeFileSync(join(dir, 'mcp.json'), JSON.stringify({ mcpServers: { 'asc-app-info': old } }));
    const plan = planChanges([jsonClient()], ['app-info'], new Map([['temp', readRegistrations(jsonClient())]]),
      { prune: false });
    expect(plan[0].toRemove).toEqual(['asc-app-info']);
    applyPlan(plan, () => {});
    const entries = JSON.parse(readFileSync(join(dir, 'mcp.json'), 'utf8')).mcpServers;
    expect(entries['asc-app-info']).toBeUndefined();
    expect(entries['ASC-AppInfo']).toEqual(old);
  });

  it('reports an unreadable config and refuses to overwrite its file', () => {
    const broken = '{ "mcpServers": { /* comment */ } }';
    writeFileSync(join(dir, 'mcp.json'), broken);
    const plan = planChanges([jsonClient()], ['analytics'], new Map([['temp', readRegistrations(jsonClient())]]),
      { prune: true });
    expect(plan[0].userManaged).toEqual(['mcp.json (unreadable)']);
    expect(plan[0].toAdd).toEqual([]);
    applyPlan(plan, () => {});
    expect(readFileSync(join(dir, 'mcp.json'), 'utf8')).toBe(broken);
  });

  it('recognizes a legacy name only when its profile matches the entry spec', () => {
    writeFileSync(join(dir, 'mcp.json'), JSON.stringify({ mcpServers: {
      'asc-analytics': { command: 'npx', args: serverArgs('webhooks') },
    } }));
    const plan = planChanges([jsonClient()], ['analytics'], new Map([['temp', readRegistrations(jsonClient())]]),
      { prune: false });
    expect(plan[0].toRemove).toEqual([]);
    expect(plan[0].migrations.size).toBe(0);
  });

  it('reports the full argument, not just the profile name', () => {
    // Returning the bare name would make the next run re-register it wide and
    // silently undo the user's narrowing.
    applyToClient(jsonClient(), ['monetization:storekit,iap-offers'], []);
    expect(listRegistered(jsonClient()).get('ASC-Monetization')).toBe('monetization:storekit,iap-offers');
  });

  it('ignores servers that are not ours', () => {
    writeFileSync(join(dir, 'mcp.json'), JSON.stringify({ mcpServers: { github: { command: 'gh' } } }));
    expect(listRegistered(jsonClient()).size).toBe(0);
  });

  it('reads nothing from a config that does not exist yet', () => {
    expect(listRegistered(jsonClient('absent.json')).size).toBe(0);
  });

  it('reads a CLI client from the file it writes, without running its list command', () => {
    // `claude mcp list` starts every server to health-check it; the file is instant.
    writeFileSync(join(dir, 'cli.json'), JSON.stringify({
      mcpServers: { 'ASC-Analytics': { command: 'npx', args: ['-y', '@erayendes/asc-mcp', 'analytics'] } },
    }));
    const cli: McpClient = {
      id: 'cli', label: 'CLI',
      targets: [{
        kind: 'cli', bin: 'node', where: 'cli.json', add: () => [],
        list: ['--this-would-fail-if-run'],
        listFile: { path: join(dir, 'cli.json'), key: 'mcpServers' },
      }],
    };
    expect([...listRegistered(cli)]).toEqual([['ASC-Analytics', 'analytics']]);
  });
});

/** A fake executable on PATH exercises the actual subprocess and rollback. */
describe('registering with a CLI client', () => {
  let previousPath: string | undefined;
  beforeEach(() => {
    previousPath = process.env.PATH;
    const bin = join(dir, 'codex');
    writeFileSync(bin, `#!/usr/bin/env node
const fs = require('node:fs');
const args = process.argv.slice(2);
const path = process.env.FAKE_MCP_STATE;
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
data.calls.push(args);
const action = args[1];
if (action === 'list') {
  if (data.failList) { fs.writeFileSync(path, JSON.stringify(data)); process.exit(4); }
  console.log(JSON.stringify(Object.entries(data.servers).map(([name, entry]) => ({
    name, enabled: true, disabled_reason: null, enabled_tools: null, disabled_tools: null,
    startup_timeout_sec: null, tool_timeout_sec: null, auth_status: 'unsupported',
    transport: { type: 'stdio', ...entry, env: entry.env || null, env_vars: [], cwd: null, ...data.transportExtras },
    ...data.rowExtras,
  }))));
}
if (action === 'remove') { delete data.servers[args[2]]; }
if (action === 'add-json') {
  const name = args[4];
  const entry = JSON.parse(args[5]);
  if (data.servers[name]) { fs.writeFileSync(path, JSON.stringify(data)); process.exit(2); }
  if (data.failNew) { data.failNew = false; fs.writeFileSync(path, JSON.stringify(data)); process.exit(3); }
  if (data.failRestore) { fs.writeFileSync(path, JSON.stringify(data)); process.exit(5); }
  data.servers[name] = entry;
}
if (action === 'add') {
  const name = args[2];
  const at = args.indexOf('--');
  const env = {};
  for (let i = 3; i < at; i++) if (args[i] === '--env') {
    const [key, ...value] = args[++i].split('='); env[key] = value.join('=');
  }
  const entry = { command: args[at + 1], args: args.slice(at + 2), ...(Object.keys(env).length ? { env } : {}) };
  if (data.failAdds > 0) { data.failAdds--; fs.writeFileSync(path, JSON.stringify(data)); process.exit(3); }
  if (data.failRestore && data.calls.filter((call) => call[1] === 'add').length > 2) { fs.writeFileSync(path, JSON.stringify(data)); process.exit(5); }
  data.servers[name] = entry;
}
fs.writeFileSync(path, JSON.stringify(data));
`);
    chmodSync(bin, 0o755);
    process.env.PATH = `${dir}:${previousPath}`;
    process.env.FAKE_MCP_STATE = join(dir, 'state.json');
  });
  afterEach(() => {
    process.env.PATH = previousPath;
    delete process.env.FAKE_MCP_STATE;
  });
  const client = (): McpClient => ({ id: 'fake', label: 'Fake', targets: [{
    kind: 'cli', bin: 'codex', where: 'fake',
    list: ['mcp', 'list', '--json'],
    add: (name, spec) => ['mcp', 'add', name, '--', 'npx', ...serverArgs(spec)],
    remove: (name) => ['mcp', 'remove', name],
  }] });
  const state = (servers: Record<string, unknown>, failAdds = 0) =>
    writeFileSync(join(dir, 'state.json'), JSON.stringify({ servers, calls: [], failAdds }));
  const result = () => JSON.parse(readFileSync(join(dir, 'state.json'), 'utf8'));

  it('adds a new server without removing anything', () => {
    state({});
    expect(applyToClient(client(), ['app-info'], []).results[0].ok).toBe(true);
    expect(result().calls.map((a: string[]) => a[1])).toEqual(['list', 'add']);
  });

  it('restores the complete old entry when the second add fails', () => {
    const old = { command: 'npx', args: ['-y', PACKAGE, 'app-info', '--read-only'] };
    state({ 'ASC-AppInfo': old }, 2);
    expect(applyToClient(client(), ['app-info'], []).results[0].ok).toBe(false);
    expect(result().calls.map((a: string[]) => a[1])).toEqual(['list', 'add', 'remove', 'add', 'add']);
    expect(result().servers['ASC-AppInfo']).toEqual(old);
  });

  it('preserves flags on a successful Codex overwrite', () => {
    const old = { command: 'npx', args: ['-y', PACKAGE, 'app-info', '--read-only'] };
    state({ 'ASC-AppInfo': old });
    expect(applyToClient(client(), ['app-info'], []).results[0].ok).toBe(true);
    expect(result().servers['ASC-AppInfo']).toEqual(old);
    expect(result().calls.map((a: string[]) => a[1])).toEqual(['list', 'add']);
    expect(result().calls[1]).toEqual(['mcp', 'add', 'ASC-AppInfo', '--', 'npx', ...old.args]);
    expect(result().calls[1]).not.toContain('--env');
  });

  it('treats a non-default Codex row as user-managed', () => {
    const old = { command: 'npx', args: serverArgs('app-info'), env: { DEMO_MODE: 'secret-test-value' } };
    state({ 'ASC-AppInfo': old });
    expect(readRegistrations(client())[0].entry).toBeUndefined();
    expect(applyToClient(client(), ['app-info'], []).results[0].ok).toBe(false);
    expect(result().calls.map((a: string[]) => a[1])).toEqual(['list', 'list']);
    expect(JSON.stringify(result().calls)).not.toContain('secret-test-value');
    expect(result().servers['ASC-AppInfo']).toEqual(old);
  });

  it.each([
    { rowExtras: { enabled_tools: ['custom'] } },
    { rowExtras: { tool_timeout_sec: 30 } },
    { transportExtras: { cwd: '/test/work' } },
  ])('protects non-default normalized Codex fields in %j', (extra) => {
    state({ 'ASC-AppInfo': { command: 'npx', args: serverArgs('app-info') } });
    writeFileSync(join(dir, 'state.json'), JSON.stringify({ ...result(), ...extra }));
    expect(readRegistrations(client())[0].entry).toBeUndefined();
    expect(planChanges([client()], ['app-info'], new Map([['fake', readRegistrations(client())]]),
      { prune: true })[0].userManaged).toEqual(['ASC-AppInfo']);
  });

  it('protects a Codex row whose server name disagrees with its spec', () => {
    state({ 'ASC-AppInfo': { command: 'npx', args: serverArgs('analytics') } });
    expect(readRegistrations(client())[0].entry).toBeUndefined();
  });

  it('reports an unreadable Codex target without adding', () => {
    state({});
    const data = result(); data.failList = true;
    writeFileSync(join(dir, 'state.json'), JSON.stringify(data));
    const plan = planChanges([client()], ['app-info'], new Map([['fake', readRegistrations(client())]]),
      { prune: false });
    expect(plan[0].toAdd).toEqual([]);
    expect(plan[0].userManaged).toEqual(['fake (unreadable)']);
    expect(applyToClient(client(), ['app-info'], []).results[0].ok).toBe(false);
    expect(result().calls.map((a: string[]) => a[1])).toEqual(['list', 'list']);
    expect(result().servers).toEqual({});
  });

  it('does not remove an existing Codex name when listing failed', () => {
    const old = { command: 'npx', args: serverArgs('app-info'), env: { ASC_KEY_ID: 'test-only-secret' } };
    state({ 'ASC-AppInfo': old });
    writeFileSync(join(dir, 'state.json'), JSON.stringify({ ...result(), failList: true }));
    expect(applyToClient(client(), ['app-info'], []).results[0].ok).toBe(false);
    expect(result().calls.map((a: string[]) => a[1])).toEqual(['list']);
    expect(result().servers['ASC-AppInfo']).toEqual(old);
  });

  it('plans and performs a Codex channel switch, then allows unticking it', () => {
    const other = PACKAGE.endsWith('@beta') ? '@erayendes/asc-mcp' : '@erayendes/asc-mcp@beta';
    state({ 'ASC-AppInfo': { command: 'npx', args: ['-y', other, 'app-info', '--read-only'] } });
    const entries = readRegistrations(client());
    expect(entries[0].entry).toBeDefined();
    const plan = planChanges([client()], ['app-info'], new Map([['fake', entries]]),
      { prune: true, stale: new Map([['fake', new Set(['ASC-AppInfo'])]]) });
    expect(plan[0].toAdd).toEqual(['app-info']);
    applyPlan(plan, () => {});
    expect(result().servers['ASC-AppInfo'].args).toEqual(['-y', PACKAGE, 'app-info', '--read-only']);
    expect(plansForUnticked([], [client()])[0].toRemove).toEqual(['ASC-AppInfo']);
  });

  it('plans a Codex legacy rename without losing the old entry on a failed add', () => {
    state({ 'asc-app-info': { command: 'npx', args: serverArgs('app-info') } }, 2);
    const entries = readRegistrations(client());
    const plan = planChanges([client()], ['app-info'], new Map([['fake', entries]]), { prune: false });
    expect(plan[0].toAdd).toEqual(['app-info']);
    expect(plan[0].toRemove).toEqual(['asc-app-info']);
    applyPlan(plan, () => {});
    expect(result().servers['asc-app-info']).toBeDefined();
  });

  it('reports explicitly when the restore also fails', () => {
    state({ 'ASC-AppInfo': { command: 'npx', args: serverArgs('app-info') } }, 2);
    const data = result(); data.failRestore = true;
    writeFileSync(join(dir, 'state.json'), JSON.stringify(data));
    const message = applyToClient(client(), ['app-info'], []).results[0].message;
    expect(message).toContain('old entry was removed and restore failed');
    expect(result().servers['ASC-AppInfo']).toBeUndefined();
  });
});

describe('Claude Code add-json rollback', () => {
  let previousPath: string | undefined;
  beforeEach(() => {
    previousPath = process.env.PATH;
    const bin = join(dir, 'claude');
    writeFileSync(bin, `#!/usr/bin/env node
const fs = require('node:fs');
const path = process.env.FAKE_MCP_STATE;
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const args = process.argv.slice(2);
data.calls.push(args);
const name = args[1] === 'add-json' ? args[4] : args[2];
if (args[1] === 'remove') delete data.servers[name];
if (args[1] === 'add-json') {
  if (data.servers[name]) { fs.writeFileSync(path, JSON.stringify(data)); process.exit(2); }
  if (data.failNew) { data.failNew = false; fs.writeFileSync(path, JSON.stringify(data)); process.exit(3); }
  if (data.failRestore) { fs.writeFileSync(path, JSON.stringify(data)); process.exit(5); }
  data.servers[name] = JSON.parse(args[5]);
}
fs.writeFileSync(path, JSON.stringify(data));
`);
    chmodSync(bin, 0o755);
    process.env.PATH = `${dir}:${previousPath}`;
    process.env.FAKE_MCP_STATE = join(dir, 'claude.json');
  });
  afterEach(() => {
    process.env.PATH = previousPath;
    delete process.env.FAKE_MCP_STATE;
  });
  const client = (): McpClient => ({ id: 'claude-fake', label: 'Claude', targets: [{
    kind: 'cli', bin: 'claude', where: 'fake',
    add: (name, spec) => ['mcp', 'add', '-s', 'user', name, '--', 'npx', ...serverArgs(spec)],
    addEntry: (name, entry) => ['mcp', 'add-json', '-s', 'user', name, JSON.stringify(entry)],
    remove: (name) => ['mcp', 'remove', name, '--scope', 'user'],
    listFile: { path: join(dir, 'claude.json'), key: 'servers' },
  }] });
  it('passes the complete old entry as one argv element on restore', () => {
    const old = { command: 'npx', args: ['-y', PACKAGE, 'app-info', '--read-only'],
      env: { DEMO_MODE: 'yes' }, timeout: 15 };
    writeFileSync(join(dir, 'claude.json'), JSON.stringify({ servers: { 'ASC-AppInfo': old }, calls: [], failNew: true }));
    expect(applyToClient(client(), ['app-info'], []).results[0].ok).toBe(false);
    const data = JSON.parse(readFileSync(join(dir, 'claude.json'), 'utf8'));
    expect(data.servers['ASC-AppInfo']).toEqual(old);
    expect(data.calls.map((a: string[]) => a[1])).toEqual(['add-json', 'remove', 'add-json', 'add-json']);
    expect(JSON.parse(data.calls[3][5])).toEqual(old);
  });
});

/**
 * A beta registers `@erayendes/asc-mcp@beta`, so its servers are the beta too.
 * The next stable setup must move those entries back, even when the profiles
 * match exactly — otherwise a tester stays on the beta for good.
 */
describe('release channel of a registration', () => {
  it('flags an entry that runs the other channel, and plans to rewrite it', () => {
    const other = PACKAGE.endsWith('@beta') ? '@erayendes/asc-mcp' : '@erayendes/asc-mcp@beta';
    writeFileSync(join(dir, 'mcp.json'), JSON.stringify({
      mcpServers: {
        'ASC-Analytics': { command: 'npx', args: ['-y', other, 'analytics'] },
        'ASC-AppInfo': { command: 'npx', args: ['-y', PACKAGE, 'app-info'] },
      },
    }));
    const stale = new Set<string>();
    const found = readRegistrations(jsonClient());
    listRegistered(jsonClient(), stale);
    expect(found.find((r) => r.name === 'ASC-Analytics')?.spec).toBe('analytics');
    expect([...stale]).toEqual(['ASC-Analytics']);

    const plan = planChanges([jsonClient()], ['analytics', 'app-info'], new Map([['temp', found]]), {
      prune: true,
      stale: new Map([['temp', stale]]),
    });
    expect(plan[0].toAdd).toEqual(['analytics']);
    expect(plan[0].toSwitch).toEqual(['analytics']); // shown as a channel move, not as something new
  });
});

describe('reporting a change of release channel', () => {
  it('writes a channel move quietly and lists only what the user changed', () => {
    const other = PACKAGE.endsWith('@beta') ? '@erayendes/asc-mcp' : '@erayendes/asc-mcp@beta';
    writeFileSync(join(dir, 'mcp.json'), JSON.stringify({
      mcpServers: { 'ASC-Analytics': { command: 'npx', args: ['-y', other, 'analytics'] } },
    }));
    const stale = new Set<string>();
    const found = readRegistrations(jsonClient());
    listRegistered(jsonClient(), stale);
    const plan = planChanges([jsonClient()], ['analytics', 'app-info'], new Map([['temp', found]]), {
      prune: true,
      stale: new Map([['temp', stale]]),
    });
    const lines: string[] = [];
    applyPlan(plan, (l) => lines.push(l));
    expect(lines.join('\n')).not.toMatch(/Heimdall \d/); // the version is not a change the user made
    expect(lines.join('\n')).not.toMatch(/added ASC-Analytics/);
    expect(lines.join('\n')).toMatch(/added ASC-AppInfo/);
  });
});

/** Claude Desktop is found by its main process, not a helper or Claude Code's namesake. */
describe('telling whether an app is open', () => {
  it('finds the app by its main process, not by a helper or a namesake', () => {
    const ps = [
      '/Applications/Claude.app/Contents/Frameworks/Claude Helper.app/Contents/MacOS/Claude Helper',
      '/Users/me/Library/Application Support/Claude/claude-code/2.1.295/claude.app/Contents/MacOS/claude',
    ];
    expect(isRunningIn(ps, 'Claude')).toBe(false);
    expect(isRunningIn([...ps, '/Applications/Claude.app/Contents/MacOS/Claude'], 'Claude')).toBe(true);
  });
});

describe('a channel move alone', () => {
  it('still restarts the app, without listing anything for it', () => {
    const other = PACKAGE.endsWith('@beta') ? '@erayendes/asc-mcp' : '@erayendes/asc-mcp@beta';
    writeFileSync(join(dir, 'mcp.json'), JSON.stringify({
      mcpServers: { 'ASC-Analytics': { command: 'npx', args: ['-y', other, 'analytics'] } },
    }));
    const stale = new Set<string>();
    const found = readRegistrations(jsonClient());
    listRegistered(jsonClient(), stale);
    const plan = planChanges([jsonClient()], ['analytics'], new Map([['temp', found]]), {
      prune: true,
      stale: new Map([['temp', stale]]),
    });
    const lines: string[] = [];
    applyPlan(plan, (l) => lines.push(l));
    expect(lines.join('\n')).not.toMatch(/added|Heimdall \d/);
    expect(lines.join('\n')).toMatch(/Done\. Restart Temp/);
    expect(JSON.parse(readFileSync(join(dir, 'mcp.json'), 'utf8')).mcpServers['ASC-Analytics'].args[1]).toBe(PACKAGE);
  });
});

describe('an app the user unticked', () => {
  it('plans to remove every Heimdall entry from it, and removes them', () => {
    writeFileSync(join(dir, 'mcp.json'), JSON.stringify({
      mcpServers: {
        'ASC-Analytics': { command: 'npx', args: ['-y', PACKAGE, 'analytics'] },
        'ASC-AppInfo': { command: 'npx', args: ['-y', PACKAGE, 'app-info'] },
        other: { command: 'node', args: ['keep-me.js'] },
      },
    }));

    const plan = plansForUnticked([], [jsonClient()]);

    expect(plan).toHaveLength(1);
    expect(plan[0].toAdd).toEqual([]);
    expect(plan[0].toRemove.sort()).toEqual(['ASC-Analytics', 'ASC-AppInfo']);
    applyPlan(plan, () => {});
    expect(Object.keys(JSON.parse(readFileSync(join(dir, 'mcp.json'), 'utf8')).mcpServers)).toEqual(['other']);
  });

  it('leaves a ticked app, and an unticked one without Heimdall, out of it', () => {
    writeFileSync(join(dir, 'mcp.json'), JSON.stringify({ mcpServers: { other: { command: 'node' } } }));
    expect(plansForUnticked([], [jsonClient()])).toEqual([]);
    writeFileSync(join(dir, 'mcp.json'), JSON.stringify({
      mcpServers: { 'ASC-Analytics': { command: 'npx', args: ['-y', PACKAGE, 'analytics'] } },
    }));
    expect(plansForUnticked([jsonClient()], [jsonClient()])).toEqual([]);
  });
});
