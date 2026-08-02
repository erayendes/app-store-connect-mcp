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
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, symlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';

const DIST = resolve(__dirname, '../dist/index.js');
const VERSION = createRequire(import.meta.url)('../package.json').version;
const built = existsSync(DIST);

const run = (bin: string, args: string[]): string =>
  execFileSync('node', [bin, ...args], { encoding: 'utf8', timeout: 20_000 });

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
  const register = (home: string, args: string[]): { out: string; code: number } => {
    try {
      return {
        out: execFileSync(process.execPath, [DIST, 'register', ...args], {
          encoding: 'utf8',
          timeout: 20_000,
          // A bare PATH so no real `claude`/`codex` on this machine is found
          // and driven: the sandbox HOME only isolates the JSON clients.
          env: { HOME: home, PATH: '/nonexistent' },
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

  it('writes the profiles it was given, sub-profile argument and all', () => {
    const { home, cursor } = sandbox();
    const { out, code } = register(home, ['monetization:storekit', 'analytics', '--clients=cursor']);
    expect(code).toBe(0);
    expect(out).toContain('✓ added asc-monetization');
    expect(servers(cursor)).toEqual(['asc-monetization', 'asc-analytics']);
    const args = JSON.parse(readFileSync(cursor, 'utf8')).mcpServers['asc-monetization'].args;
    expect(args.at(-1)).toBe('monetization:storekit');
    rmSync(home, { recursive: true, force: true });
  });

  it('adds without pruning what was already there', () => {
    // setup reconciles because the user is looking at the list. An agent is
    // not, so asking for one profile must never drop the others.
    const { home, cursor } = sandbox();
    register(home, ['analytics', '--clients=cursor']);
    register(home, ['webhooks', '--clients=cursor']);
    expect(servers(cursor)).toEqual(['asc-analytics', 'asc-webhooks']);
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
