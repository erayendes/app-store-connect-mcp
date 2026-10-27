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
import { readFileSync, readdirSync } from 'node:fs';
import {
  CORE_PROFILE,
  PROFILES,
  resolveSelection,
  toolCountFor,
} from '../src/profiles.js';
import { OPERATIONS } from '../src/generated/operations.js';
import { toolNameFor } from '../src/core/registry.js';
import { PACKAGE, serverName } from '../src/clients.js';
import { NARROW_FIRST, ROLES } from '../src/setup.js';
import { FILE_TARGETS, PAGE_TARGETS } from '../src/tools/media-catalog.js';

const read = (path: string): string => readFileSync(path, 'utf8');

/** A narrowed server adds these two; they are hand-written and in no sheet row. */
const PROXY_PAIR = ['asc__call', 'asc__describe'];

const allSpecs = PROFILES.flatMap((p) => [
  p.name,
  ...p.subProfiles.filter((s) => s.name).map((s) => `${p.name}:${s.name}`),
]);
const placedOps = new Set(PROFILES.flatMap((p) => p.subProfiles.flatMap((s) => s.operations)));
const manual = new Set(PROFILES.flatMap((p) => p.subProfiles.flatMap((s) => s.manualTools)));

/** A count the generator wrote to src/generated/REPORT.txt. */
function reported(re: RegExp): number {
  const m = re.exec(readFileSync('src/generated/REPORT.txt', 'utf8'));
  if (!m) throw new Error(`REPORT.txt has no match for ${re}`);
  return Number(m[1]);
}

const COUNTS = {
  profiles: PROFILES.length,
  // What setup offers to pick: every profile but core, which comes with them.
  pickable: PROFILES.filter((p) => p.name !== CORE_PROFILE).length,
  subProfiles: PROFILES.flatMap((p) => p.subProfiles.filter((s) => s.name)).length,
  // Built operations; asc__search_tools searches these.
  operations: OPERATIONS.length,
  // Left out of the build: the generator reports both counts.
  deprecated: reported(/deprecated dropped: (\d+)/),
  sheetDropped: reported(/dropped by the profile sheet: (\d+)/),
  // What Apple's spec lists, before Heimdall leaves anything out.
  listed: OPERATIONS.length + reported(/deprecated dropped: (\d+)/) + reported(/dropped by the profile sheet: (\d+)/),
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
    ['README.md', /lists (\d+) API operations/, [COUNTS.listed]],
    ['README.md', /leaves out the (\d+) that.*?, and (\d+) that repeat.*?Of the remaining (\d+)/, [COUNTS.deprecated, COUNTS.sheetDropped, COUNTS.operations]],
    ['README.md', /(\d+) become tools, and (\d+) hand-written ones join them: (\d+) tools in all/, [COUNTS.placed, COUNTS.handWritten, COUNTS.tools]],
    ['docs/README_tr.md', /\*\*(\d+) profil altında (\d+) alt profil ve (\d+) araç\*\*/, [COUNTS.profiles, COUNTS.subProfiles, COUNTS.tools]],
    ['docs/README_tr.md', /(\d+) API operasyonu/, [COUNTS.listed]],
    ['docs/README_tr.md', /değiştirdiği (\d+) tanesini.*?gerekmeyen (\d+) tanesini.*?Kalan (\d+) işlemden/, [COUNTS.deprecated, COUNTS.sheetDropped, COUNTS.operations]],
    ['docs/README_tr.md', /işlemden (\d+)'.{0,40}elle yazılmış (\d+) araç ekleniyor: toplam (\d+) araç/, [COUNTS.placed, COUNTS.handWritten, COUNTS.tools]],
    ['AGENTS.md', /serves (\d+) tools across (\d+) profiles: (\d+) generated from Apple's (\d+) operations \(the (\d+) that/, [COUNTS.tools, COUNTS.profiles, COUNTS.placed, COUNTS.listed, COUNTS.deprecated]],
    ['AGENTS.md', /and (\d+) hand-written\./, [COUNTS.handWritten]],
    ['AGENTS.md', /Search covers the (\d+) operations Heimdall builds/, [COUNTS.operations]],
    ['skills/heimdall/SKILL.md', /Apple's API is (\d+) operations/, [COUNTS.listed]],
    ['skills/heimdall/SKILL.md', /serves (\d+) distinct tools across (\d+) profiles: (\d+) reachable Apple operations plus (\d+) hand-written/, [COUNTS.tools, COUNTS.profiles, COUNTS.placed, COUNTS.handWritten]],
    ['skills/heimdall/SKILL.md', /covers the (\d+) operations Heimdall builds/, [COUNTS.operations]],
    ['CITATION.cff', /with (\d+) tools .*?, (\d+) curated profiles/, [COUNTS.tools, COUNTS.profiles]],
    ['.github/SECURITY.md', /The (\d+) hand-written ones/, [COUNTS.handWritten]],
    ['.github/SECURITY.md', /Elle yazılan (\d+) araç/, [COUNTS.handWritten]],
    // The newest changelog entry speaks for the code as it is now; older ones are history.
    ['docs/CHANGELOG.md', /There are now (\d+) profiles and (\d+) sub-profiles/, [COUNTS.pickable, COUNTS.subProfiles]],
    ['docs/CHANGELOG.md', /Artık (\d+) profil ve (\d+) alt profil var/, [COUNTS.pickable, COUNTS.subProfiles]],
    ['docs/CHANGELOG.md', /Heimdall now has (\d+) tools\./, [COUNTS.tools]],
    ['docs/CHANGELOG.md', /Heimdall artık (\d+) araç içeriyor\./, [COUNTS.tools]],
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

  it('server.json derives its profile list and its "narrow to" from the profiles', () => {
    const server = JSON.parse(read('server.json'));
    const arg = server.packages[0].packageArguments.find((a: { valueHint?: string }) => a.valueHint === 'profile');
    const [narrow, wide] = numbers(arg.description, /monetization:[a-z-]+ is (\d+) tools instead of (\d+)/, 'server.json');
    const sub = /monetization:([a-z-]+) is/.exec(arg.description)![1];
    expect(narrow).toBe(toolCountFor(resolveSelection(`monetization:${sub}`)));
    expect(wide).toBe(toolCountFor(resolveSelection('monetization')));
    expect(numbers(server.description, /narrow to (\d+)\./, 'server.json')).toEqual([narrow]);
  });

  /** `narrow` is N tools where `wide` is M, in either language, wrapped anywhere. */
  const EXAMPLE = [
    /`([a-z-]+(?::[a-z,-]+)?)` is (\d+) tools\s+where\s+`([a-z-]+)` is (\d+)/g,
    /`([a-z-]+(?::[a-z,-]+)?)` is (\d+)\s+tools where `([a-z-]+)` is (\d+)/g,
    /`([a-z-]+(?::[a-z,-]+)?)` (\d+) araç,\s+`([a-z-]+)` (\d+)/g,
  ];
  it.each(['AGENTS.md', 'skills/heimdall/SKILL.md', 'examples/README.md'])('%s keeps its sub-profile examples true', (file) => {
    const doc = read(file);
    const examples = EXAMPLE.flatMap((re) => [...doc.matchAll(re)]);
    expect(examples.length, `${file} has no sub-profile example`).toBeGreaterThan(0);
    for (const [, narrow, n, wide, w] of examples) {
      expect(toolCountFor(resolveSelection(narrow)), narrow).toBe(Number(n));
      expect(toolCountFor(resolveSelection(wide)), wide).toBe(Number(w));
    }
  });
});

describe.each(['docs/MEDIA_TARGETS_en.md', 'docs/MEDIA_TARGETS_tr.md'])('%s', (file) => {
  it('lists every target the media tools accept', () => {
    const rows = [...read(file).matchAll(/^\| `([a-z_]+)` \|/gm)].map((m) => m[1]);
    expect(rows.sort()).toEqual(['library', ...Object.keys(PAGE_TARGETS), ...Object.keys(FILE_TARGETS)].sort());
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
 * Names in backticks are the part of prose an agent copies into a call. A
 * retired 2.x name is allowed only on a line that says it is one — a migration
 * note — never as if it were current. The changelog is history and is not read.
 */
describe('names the docs use exist', () => {
  const DOCS = [
    'README.md', 'AGENTS.md', 'skills/heimdall/SKILL.md', 'examples/README.md', '.github/SECURITY.md',
    ...['README_tr', 'GUIDE_en', 'GUIDE_tr', 'CONFIGURATION_en', 'CONFIGURATION_tr', 'SETUP_en', 'SETUP_tr',
      'ROLES_en', 'ROLES_tr', 'PROFILES_en', 'PROFILES_tr', 'MEDIA_TARGETS_en', 'MEDIA_TARGETS_tr']
      .map((d) => `docs/${d}.md`),
  ];
  /** A line that is about an old name: 2.x, a removed profile, a rename. */
  const MIGRATION = /2\.x|before 2\.5|no longer exist|artık olmayan|now `general`|artık `general`|earlier version|önceki bir sürüm|old name|eski ad|old profile|eski bir profil|was removed|kaldırılan/;
  // Only what actually loads: placed operations and the hand-written tools.
  // MACRO_COVERED, TWIN_OF and PROFILELESS operations are in no server.
  const tools = new Set([...[...placedOps].map((op) => toolNameFor({ name: op })), ...manual, ...PROXY_PAIR]);
  const servers = new Set(PROFILES.map((p) => serverName(p.name)));
  const RETIRED_PROFILES = ['app-info'];

  it.each(DOCS)('%s', (file) => {
    // A paragraph, list item or table row: prose wraps, so a note and the name
    // it is about can sit on different lines.
    for (const line of read(file).split(/\n(?=\s*\n|\s*[-|#>] |\s*\d+\. )/)) {
      const historical = MIGRATION.test(line);
      const check = (ok: boolean, what: string) => {
        if (!historical) expect(ok, `${file}: ${what} is not a current name — "${line.trim().slice(0, 120)}"`).toBe(true);
      };
      for (const [, spec] of line.matchAll(/`([a-z-]+:[a-z-]+(?:,[a-z-]+)*)`/g)) {
        let ok = true;
        try { resolveSelection(spec); } catch { ok = false; }
        check(ok, spec);
      }
      for (const [, tool] of line.matchAll(/`([a-z0-9_]+__[a-z0-9_]+)`/g)) check(tools.has(tool), tool);
      for (const [, server] of line.matchAll(/`(ASC-[A-Za-z]+)`/g)) check(servers.has(server), server);
      for (const name of RETIRED_PROFILES) check(!line.includes(`\`${name}\``), name);
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
    const marketplace = JSON.parse(read('.claude-plugin/marketplace.json'));
    seen['.claude-plugin/marketplace.json metadata'] = marketplace.metadata.version;
    for (const p of marketplace.plugins) seen[`.claude-plugin/marketplace.json ${p.name}`] = p.version;
    for (const dir of readdirSync('plugins')) {
      seen[`plugins/${dir}/.claude-plugin/plugin.json`] = JSON.parse(read(`plugins/${dir}/.claude-plugin/plugin.json`)).version;
    }
    for (const [where, v] of Object.entries(seen)) expect(v, where).toBe(version);
  });

  it('runs every plug-in on this release channel', () => {
    for (const dir of readdirSync('plugins')) {
      const servers = Object.values(JSON.parse(read(`plugins/${dir}/.mcp.json`)).mcpServers) as { args: string[] }[];
      for (const s of servers) expect(s.args, dir).toContain(PACKAGE);
    }
  });

  /**
   * A copy-paste command that installs the other channel sets the user up
   * with a version these docs do not describe: on a beta, the bare package is
   * still the previous major.
   */
  it.each(['AGENTS.md', 'skills/heimdall/SKILL.md', 'docs/SETUP_en.md', 'docs/SETUP_tr.md', 'server.json', 'examples/README.md', 'examples/ci/release-notes.yml'])(
    '%s gives commands for this channel',
    (file) => {
      const commands = [...read(file).matchAll(/npx -y (@erayendes\/asc-mcp(?:@[\w.-]+)?)/g)].map((m) => m[1]);
      expect(commands.length, file).toBeGreaterThan(0);
      // A pinned older version (`@2.8.0`) is a way back, not an install.
      for (const pkg of commands.filter((c) => !/@\d/.test(c.slice(1)))) expect(pkg, file).toBe(PACKAGE);
    }
  );

  it('open both changelog sections with this version', () => {
    const changelog = read('docs/CHANGELOG.md');
    for (const section of ['## English', '## Türkçe']) {
      const rest = changelog.slice(changelog.indexOf(section));
      expect(/^### \[([^\]]+)\]/m.exec(rest)?.[1], section).toBe(version);
    }
  });
});
