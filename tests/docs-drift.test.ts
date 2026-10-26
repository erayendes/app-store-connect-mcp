/**
 * The docs advertise numbers and names that come from the code, and prose does
 * not regenerate. 3.0 found the README at "13 profiles, 929 tools", the skill
 * suggesting `monetization:subscription-pricing` and the guide pointing at
 * sub-profiles that no longer existed, all at once and all reading as true.
 *
 * Every number checked here is computed from the same helpers the server uses
 * (`toolCountFor`, the profile data, ROLES), never pinned by hand: a membership
 * change fails here until the docs say the new thing. The prose itself is not
 * checked — only the parts of it that are claims about the code.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  CORE_PROFILE,
  PROFILES,
  resolveSelection,
  toolCountFor,
} from '../src/profiles.js';
import { OPERATIONS } from '../src/generated/operations.js';
import { toolNameFor } from '../src/core/registry.js';
import { serverName } from '../src/clients.js';
import { NARROW_FIRST, ROLES } from '../src/setup.js';

const read = (path: string): string => readFileSync(path, 'utf8');

/** A narrowed server adds these two; they are hand-written and in no sheet row. */
const PROXY_PAIR = ['asc__call', 'asc__describe'];

const allSpecs = PROFILES.flatMap((p) => [
  p.name,
  ...p.subProfiles.filter((s) => s.name).map((s) => `${p.name}:${s.name}`),
]);
const placedOps = new Set(PROFILES.flatMap((p) => p.subProfiles.flatMap((s) => s.operations)));
const manual = new Set(PROFILES.flatMap((p) => p.subProfiles.flatMap((s) => s.manualTools)));

const COUNTS = {
  profiles: PROFILES.length,
  subProfiles: PROFILES.flatMap((p) => p.subProfiles.filter((s) => s.name)).length,
  operations: OPERATIONS.length,
  deprecated: OPERATIONS.filter((op) => op.deprecated).length,
  placed: placedOps.size,
  handWritten: manual.size + PROXY_PAIR.length,
  // The headline, as server.json and the release pre-flight count it.
  tools: placedOps.size + manual.size + PROXY_PAIR.length,
};

/** Every number `re` captures in `text`, in order — and the match must exist. */
function numbers(text: string, re: RegExp, where: string): number[] {
  const m = re.exec(text);
  expect(m, `${where}: no match for ${re}`).toBeTruthy();
  return m!.slice(1).map(Number);
}

describe('advertised counts', () => {
  const claims: [string, RegExp, number[]][] = [
    ['README.md', /\*\*(\d+) profiles, (\d+) sub-profiles, (\d+) tools\.\*\*/, [COUNTS.profiles, COUNTS.subProfiles, COUNTS.tools]],
    ['README.md', /lists (\d+) API operations/, [COUNTS.operations]],
    ['README.md', /leaves out the (\d+) that/, [COUNTS.deprecated]],
    ['README.md', /(\d+) become tools, and (\d+) hand-written ones join them: (\d+) tools in all/, [COUNTS.placed, COUNTS.handWritten, COUNTS.tools]],
    ['docs/README_tr.md', /\*\*(\d+) profil altında (\d+) alt profil ve (\d+) araç\*\*/, [COUNTS.profiles, COUNTS.subProfiles, COUNTS.tools]],
    ['docs/README_tr.md', /(\d+) API operasyonu/, [COUNTS.operations]],
    ['docs/README_tr.md', /değiştirdiği (\d+) tanesini/, [COUNTS.deprecated]],
    ['docs/README_tr.md', /Kalanlardan (\d+)'.{0,40}elle yazılmış (\d+) araç ekleniyor: toplam (\d+) araç/, [COUNTS.placed, COUNTS.handWritten, COUNTS.tools]],
    ['AGENTS.md', /serves (\d+) tools across (\d+) profiles: (\d+) generated from Apple's (\d+) operations \(the (\d+) that/, [COUNTS.tools, COUNTS.profiles, COUNTS.placed, COUNTS.operations, COUNTS.deprecated]],
    ['AGENTS.md', /and (\d+) hand-written\./, [COUNTS.handWritten]],
    ['AGENTS.md', /searches all (\d+) operations/, [COUNTS.operations]],
    ['skills/heimdall/SKILL.md', /Apple's API is (\d+) operations/, [COUNTS.operations]],
    ['skills/heimdall/SKILL.md', /serves (\d+) distinct tools across (\d+) profiles: (\d+) reachable Apple operations plus (\d+) hand-written/, [COUNTS.tools, COUNTS.profiles, COUNTS.placed, COUNTS.handWritten]],
    ['skills/heimdall/SKILL.md', /searches all (\d+) operations/, [COUNTS.operations]],
    ['CITATION.cff', /with (\d+) tools .*?, (\d+) curated profiles/, [COUNTS.tools, COUNTS.profiles]],
  ];

  it.each(claims)('%s says %s', (file, re, expected) => {
    expect(numbers(read(file), re, file)).toEqual(expected);
  });

  it('server.json and package.json carry the same headline', () => {
    const server = JSON.parse(read('server.json'));
    const pkg = JSON.parse(read('package.json'));
    expect(numbers(server.description, /(\d+) tools in (\d+) profiles/, 'server.json')).toEqual([COUNTS.tools, COUNTS.profiles]);
    expect(numbers(pkg.description, /(\d+) tools across (\d+) profiles/, 'package.json')).toEqual([COUNTS.tools, COUNTS.profiles]);
  });

  it.each(['AGENTS.md', 'skills/heimdall/SKILL.md'])('%s keeps its sub-profile example true', (file) => {
    // \s+: the skill wraps its prose, so the sentence may break anywhere.
    const examples = [...read(file).matchAll(/`([a-z-]+(?::[a-z,-]+)?)` is (\d+) tools\s+where\s+`([a-z-]+)` is (\d+)/g)];
    expect(examples.length, `${file} has no sub-profile example`).toBeGreaterThan(0);
    for (const [, narrow, n, wide, w] of examples) {
      expect(toolCountFor(resolveSelection(narrow)), narrow).toBe(Number(n));
      expect(toolCountFor(resolveSelection(wide)), wide).toBe(Number(w));
    }
  });
});

/** What PROFILES_*.md lists under one heading: a sub-profile, or a profile without any. */
function membership(spec: string): string[] {
  const { subProfiles } = resolveSelection(spec);
  const [name, sub] = spec.split(':');
  const own = sub || !PROFILES.find((p) => p.name === name)!.subProfiles.some((s) => s.name) ? subProfiles : [];
  return [...new Set(own.flatMap((s) => [...s.operations.map((op) => toolNameFor({ name: op })), ...s.manualTools]))].sort();
}

const narrowest = (spec: string): string =>
  NARROW_FIRST.find((role) => (ROLES[spec] ?? ROLES[spec.split(':')[0]]).includes(role))!;

describe.each([
  ['docs/PROFILES_en.md', 'tools', 'Key role'],
  ['docs/PROFILES_tr.md', 'araç', 'Anahtar rolü'],
])('%s', (file, unit, roleLabel) => {
  const doc = read(file);
  const headings = [...doc.matchAll(new RegExp(`^#{3,4} \`([a-z-]+(?::[a-z-]+)?)\` · (\\d+) ${unit}$`, 'gm'))];
  // Each section runs from its heading to the next heading of any level.
  const sections = new Map(headings.map((h) => {
    const rest = doc.slice(h.index! + h[0].length);
    return [h[1], rest.slice(0, rest.search(/^#{2,4} /m) >>> 0)];
  }));

  it('has a section for every profile and sub-profile, and none other', () => {
    expect([...sections.keys()].sort()).toEqual([...allSpecs].sort());
  });

  it('counts each one as its server does', () => {
    for (const [, spec, n] of headings) expect(Number(n), spec).toBe(toolCountFor(resolveSelection(spec)));
  });

  it('lists exactly the tools each one serves, each with a line', () => {
    for (const [spec, body] of sections) {
      const listed = [...body.matchAll(/^- `([a-z0-9_]+)` — (.+)$/gm)];
      for (const [, tool, line] of listed) expect(line.trim(), `${spec} ${tool}`).not.toBe('');
      expect(listed.map((l) => l[1]).sort(), spec).toEqual(membership(spec));
    }
  });

  it('names the narrowest key role setup would suggest', () => {
    for (const [spec, body] of sections) {
      if (spec === CORE_PROFILE) continue;
      const role = new RegExp(`\\*\\*${roleLabel}:\\*\\* ([A-Za-z ]+)`).exec(body)?.[1];
      expect(role, spec).toBe(narrowest(spec));
    }
  });

  it('gives every profile its server name and count in the summary table', () => {
    const rows = [...doc.matchAll(/^\| `([a-z-]+)` \| `(ASC-[A-Za-z]+)` \| [^|]+ \| (\d+) \|/gm)];
    expect(rows.map((r) => r[1]).sort()).toEqual(PROFILES.map((p) => p.name).sort());
    for (const [, name, server, n] of rows) {
      expect(server, name).toBe(serverName(name));
      expect(Number(n), name).toBe(toolCountFor(resolveSelection(name)));
    }
  });

  it('adds up the starter packs, ASC-Core included', () => {
    const packs = [...doc.matchAll(/^\| [^|`]+ \| ((?:`[^`]+`(?: \+ )?)+) \| (\d+) \|$/gm)];
    expect(packs.length).toBeGreaterThan(0);
    for (const [, specs, n] of packs) {
      const sum = [...specs.matchAll(/`([^`]+)`/g)].reduce((a, [, s]) => a + toolCountFor(resolveSelection(s)), 0);
      expect(Number(n), specs).toBe(sum + toolCountFor(resolveSelection(CORE_PROFILE)));
    }
  });
});

describe.each(['docs/ROLES_en.md', 'docs/ROLES_tr.md'])('%s', (file) => {
  it('lists the roles setup works from, for every profile and sub-profile', () => {
    const rows = [...read(file).matchAll(/^\| `([a-z-]+(?::[a-z-]+)?)` \| ([A-Za-z ,]+) \|$/gm)];
    expect(rows.map((r) => r[1]).sort()).toEqual([...allSpecs].sort());
    for (const [, spec, roles] of rows) {
      expect(roles.split(',').map((r) => r.trim()).sort(), spec).toEqual([...ROLES[spec]].sort());
    }
  });
});

/**
 * Names in backticks are the part of prose an agent copies into a call. The
 * 2.x names are kept only where a doc explains what an old config looks like.
 */
describe('names the docs use exist', () => {
  const DOCS = [
    'README.md', 'AGENTS.md', 'skills/heimdall/SKILL.md',
    ...['README_tr', 'GUIDE_en', 'GUIDE_tr', 'CONFIGURATION_en', 'CONFIGURATION_tr', 'SETUP_en', 'SETUP_tr', 'ROLES_en', 'ROLES_tr']
      .map((d) => `docs/${d}.md`),
  ];
  const LEGACY = new Set(['monetization:subscription-pricing']);
  const tools = new Set([
    ...OPERATIONS.filter((op) => !op.deprecated).map((op) => toolNameFor(op)),
    ...manual,
    ...PROXY_PAIR,
  ]);

  it.each(DOCS)('%s', (file) => {
    const doc = read(file);
    for (const [, spec] of doc.matchAll(/`([a-z-]+:[a-z-]+(?:,[a-z-]+)*)`/g)) {
      if (LEGACY.has(spec)) continue;
      expect(() => resolveSelection(spec), `${file}: ${spec}`).not.toThrow();
    }
    for (const [, tool] of doc.matchAll(/`([a-z0-9_]+__[a-z0-9_]+)`/g)) {
      expect(tools.has(tool), `${file}: ${tool}`).toBe(true);
    }
  });
});

/**
 * The release workflow checks these at tag time; by then the fix is another
 * commit on a branch that already says "release". Here they fail in the PR.
 */
describe('version surfaces', () => {
  const version = JSON.parse(read('package.json')).version;

  it('agree on one version', () => {
    const lock = JSON.parse(read('package-lock.json'));
    const server = JSON.parse(read('server.json'));
    const seen = {
      'package-lock.json': lock.version,
      'package-lock.json packages[""]': lock.packages[''].version,
      'server.json': server.version,
      'server.json packages[0]': server.packages[0].version,
      '.claude-plugin/plugin.json': JSON.parse(read('.claude-plugin/plugin.json')).version,
      'CITATION.cff': /^version:\s*"?([^"\s]+)"?/m.exec(read('CITATION.cff'))?.[1],
    };
    for (const [where, v] of Object.entries(seen)) expect(v, where).toBe(version);
  });

  it('open both changelog sections with this version', () => {
    const changelog = read('docs/CHANGELOG.md');
    for (const section of ['## English', '## Türkçe']) {
      const rest = changelog.slice(changelog.indexOf(section));
      expect(/^### \[([^\]]+)\]/m.exec(rest)?.[1], section).toBe(version);
    }
  });
});
