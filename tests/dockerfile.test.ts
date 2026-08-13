/**
 * The Dockerfile exists so a directory that boots servers through Docker can
 * start this one and call tools/list — not Glama, which builds from its own
 * spec, and not the MCP Registry, which installs the npm package; see the
 * header of the Dockerfile itself. What it passes on the command line is
 * therefore the only
 * configuration those scans ever see, which makes a stale profile name there a
 * silent failure rather than a loud one: a name that was removed does not crash,
 * it hits the tombstone and starts with a single tool explaining the split. An
 * introspection run would report one tool and no error.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PROFILES } from '../src/profiles.js';

const dockerfile = readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8');

/** The profile arguments in `CMD ["node", "dist/index.js", ...]`. */
function cmdProfiles(): string[] {
  const cmd = /^CMD\s+(\[.*\])\s*$/m.exec(dockerfile);
  expect(cmd, 'Dockerfile has a JSON-array CMD').not.toBeNull();
  const argv = JSON.parse(cmd![1]) as string[];
  return argv.slice(argv.indexOf('dist/index.js') + 1).filter((a) => !a.startsWith('-'));
}

describe('Dockerfile introspection command', () => {
  it('names a profile, so scans see a real installation', () => {
    // Bare, the server offers the whole surface — the configuration the guide
    // tells people not to use, and the one directories were scoring.
    expect(cmdProfiles().length, 'CMD passes at least one profile').toBeGreaterThan(0);
  });

  it('names profiles that still exist', () => {
    const known = new Set(PROFILES.map((p) => p.name));
    for (const arg of cmdProfiles()) {
      const profile = arg.split(':')[0];
      expect(
        known.has(profile),
        `Dockerfile CMD names "${profile}", which is not a profile. A removed name does ` +
          `not fail loudly — it reaches the tombstone and boots with one tool.`
      ).toBe(true);
    }
  });

  it('names sub-profiles that still exist', () => {
    for (const arg of cmdProfiles()) {
      const [name, subs] = arg.split(':');
      if (!subs) continue;
      const profile = PROFILES.find((p) => p.name === name);
      const known = new Set((profile?.subProfiles ?? []).map((s) => s.name));
      for (const sub of subs.split(',')) {
        expect(known.has(sub), `${name} has no sub-profile "${sub}"`).toBe(true);
      }
    }
  });
});
