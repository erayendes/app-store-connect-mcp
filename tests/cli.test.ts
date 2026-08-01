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
import { existsSync, mkdtempSync, symlinkSync, rmSync } from 'node:fs';
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
