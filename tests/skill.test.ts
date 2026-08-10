import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, readFileSync, existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { installSkill, removeSkill, skillPathFor, clientTakesSkill } from '../src/skill.js';
import { CLIENTS } from '../src/clients.js';

const homes: string[] = [];
const fakeHome = () => {
  const dir = mkdtempSync(join(tmpdir(), 'heimdall-skill-'));
  homes.push(dir);
  return dir;
};
afterEach(() => {
  for (const h of homes.splice(0)) rmSync(h, { recursive: true, force: true });
});

describe('skill installation', () => {
  it('installs only for clients that actually read SKILL.md', () => {
    // A file nothing loads is worse than no file: it looks like the feature is
    // there. Cursor, VS Code, Windsurf and Antigravity read no skills.
    const takes = CLIENTS.filter((c) => clientTakesSkill(c.id)).map((c) => c.id);
    expect(takes.sort()).toEqual(['claude', 'codex']);

    const home = fakeHome();
    expect(installSkill('cursor', home)).toBeUndefined();
    expect(skillPathFor('cursor', home)).toBeUndefined();
    expect(existsSync(join(home, '.cursor'))).toBe(false);
  });

  it('writes the packaged skill where the client looks for it', () => {
    const home = fakeHome();
    const result = installSkill('claude', home)!;
    expect(result.ok).toBe(true);

    const path = skillPathFor('claude', home)!;
    expect(path).toBe(join(home, '.claude', 'skills', 'heimdall', 'SKILL.md'));
    const text = readFileSync(path, 'utf8');
    expect(text.startsWith('---\nname: heimdall\n')).toBe(true);
    // The one claim the skill exists to make; losing it would leave a document
    // that costs tokens and changes nothing.
    expect(text).toContain('minted **inside the server, per request**');
    expect(text).toContain('never ask for the `.p8`');
  });

  it('overwrites a stale copy rather than leaving it', () => {
    const home = fakeHome();
    const path = skillPathFor('claude', home)!;
    mkdirSync(join(home, '.claude', 'skills', 'heimdall'), { recursive: true });
    writeFileSync(path, 'stale from an older version', 'utf8');

    installSkill('claude', home);
    expect(readFileSync(path, 'utf8')).not.toContain('stale');
  });

  it('removes it, and treats a missing one as nothing to do', () => {
    const home = fakeHome();
    installSkill('codex', home);
    const path = skillPathFor('codex', home)!;
    expect(existsSync(path)).toBe(true);

    expect(removeSkill('codex', home)!.ok).toBe(true);
    expect(existsSync(path)).toBe(false);
    expect(removeSkill('codex', home)).toBeUndefined();
  });

  it('reports a failure instead of throwing — the registration already succeeded', () => {
    // A file where the skills directory should be makes mkdir fail.
    const home = fakeHome();
    mkdirSync(join(home, '.claude'), { recursive: true });
    writeFileSync(join(home, '.claude', 'skills'), 'not a directory', 'utf8');

    const result = installSkill('claude', home)!;
    expect(result.ok).toBe(false);
    expect(result.message).toContain('could not write');
  });
});

describe('the packaged skill is loadable as a plugin', () => {
  it('ships a plugin manifest pointing at the same skills directory', () => {
    // `ax:agent --skill=.` loads the repo root as a local plugin, which is how
    // the skill gets A/B'd without opening settingSources.
    const manifest = JSON.parse(readFileSync('.claude-plugin/plugin.json', 'utf8'));
    expect(manifest.name).toBe('heimdall');
    expect(existsSync('skills/heimdall/SKILL.md')).toBe(true);
  });

  it('keeps the frontmatter to fields the loader accepts', () => {
    const text = readFileSync('skills/heimdall/SKILL.md', 'utf8');
    const frontmatter = /^---\n([\s\S]*?)\n---/.exec(text)![1];
    const keys = frontmatter
      .split('\n')
      .filter((l) => /^[a-z-]+:/.test(l))
      .map((l) => l.split(':')[0]);
    expect(keys.sort()).toEqual(['description', 'name']);
    // Angle brackets are rejected outright, and the description is capped.
    const description = /description: (.*)/.exec(frontmatter)![1];
    expect(description).not.toMatch(/[<>]/);
    expect(description.length).toBeLessThanOrEqual(1024);
  });
});
