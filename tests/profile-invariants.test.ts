/**
 * Membership is hand-curated in a spreadsheet, so the guarantees that used to
 * fall out of the code have to be asserted instead. Each test here is one thing
 * curation can quietly get wrong — and did, before this file existed.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  PROFILES,
  PROFILE_DESCRIPTIONS,
  CORE_OPERATIONS,
  CORE_MANUAL_TOOLS,
  REMOVED_PROFILES,
  descriptionKey,
  deprecatedOperationsFor,
  manualToolsFor,
  operationsFor,
  removedProfileMessage,
  resolveSelection,
} from '../src/profiles.js';
import { OPERATIONS } from '../src/generated/operations.js';
import { helpText } from '../src/index.js';

const loadable = OPERATIONS.filter((o) => !o.deprecated);

describe('reachability — a profile can reach its own resources from an app', () => {
  /**
   * The bug this whole change exists for: `/v1/apps/{id}/subscriptionGroups`
   * used to sit in app-info while every subscription tool sat in monetization,
   * so `asc-monetization` could not list an app's subscription groups at all.
   */
  const entryFor = new Map<string, string>();
  for (const op of OPERATIONS) {
    const m = /^apps\.([a-z0-9_]+)\.list$/.exec(op.name);
    if (m && !op.deprecated) entryFor.set(m[1], op.name);
  }

  it('finds entry points at all (guards the regex, not the data)', () => {
    expect(entryFor.get('subscription_groups')).toBe('apps.subscription_groups.list');
    expect(entryFor.size).toBeGreaterThan(20);
  });

  it.each(PROFILES.map((p) => p.name))('%s reaches every resource it owns', (name) => {
    const profile = PROFILES.find((p) => p.name === name)!;
    const loaded = new Set(operationsFor(resolveSelection(name)));
    const missing: string[] = [];
    for (const resource of new Set(profile.subProfiles.flatMap((s) => s.rootResources))) {
      const entry = entryFor.get(resource);
      if (entry && !loaded.has(entry)) missing.push(`${resource} (needs ${entry})`);
    }
    expect(missing).toEqual([]);
  });
});

describe('coverage', () => {
  it('leaves no operation orphaned', () => {
    const covered = new Set([
      ...CORE_OPERATIONS,
      ...PROFILES.flatMap((p) => p.subProfiles.flatMap((s) => s.operations)),
    ]);
    const orphans = loadable.filter((o) => !covered.has(o.name)).map((o) => o.name);
    expect(orphans).toEqual([]);
  });

  it('never promises a tool that does not exist', () => {
    const known = new Set(OPERATIONS.map((o) => o.name));
    const unknown = PROFILES.flatMap((p) =>
      p.subProfiles.flatMap((s) => s.operations.filter((n) => !known.has(n)))
    );
    expect(unknown).toEqual([]);
  });

  it('loads nothing Apple has deprecated', () => {
    const deprecated = new Set(OPERATIONS.filter((o) => o.deprecated).map((o) => o.name));
    const bad = PROFILES.flatMap((p) =>
      p.subProfiles.flatMap((s) => s.operations.filter((n) => deprecated.has(n)))
    );
    expect(bad).toEqual([]);
  });

  it('describes every profile and sub-profile', () => {
    const undescribed: string[] = [];
    for (const p of PROFILES) {
      if (!p.description) undescribed.push(p.name);
      for (const s of p.subProfiles) {
        if (s.name && !s.description) undescribed.push(descriptionKey(p.name, s.name));
      }
    }
    expect(undescribed).toEqual([]);
    // And nothing stale pointing at a profile that no longer exists.
    const live = new Set([
      ...PROFILES.map((p) => p.name),
      ...PROFILES.flatMap((p) => p.subProfiles.filter((s) => s.name).map((s) => descriptionKey(p.name, s.name))),
    ]);
    expect(Object.keys(PROFILE_DESCRIPTIONS).filter((k) => !live.has(k))).toEqual([]);
  });
});

describe('chain integrity — a write needs a read that produces its id', () => {
  /**
   * A sub-profile that can update a resource but not list it hands the model an
   * `{id}` it has no way to obtain. Matching is by collection name, not by root:
   * `/v1/subscriptionPrices/{id}` is satisfied by `/v1/subscriptions/{id}/prices`.
   */
  // Apple names a to-one relationship in the singular (`.../appStoreVersion
  // PhasedRelease`) and the collection it belongs to in the plural. Same
  // resource, same id.
  const norm = (s: string): string => s.toLowerCase().replace(/s$/, '');
  const collectionOf = (path: string, before: string): string | undefined => {
    const parts = path.split('/').filter(Boolean);
    const i = parts.indexOf(before);
    return i > 0 ? norm(parts[i - 1]) : undefined;
  };
  const readCollections = (names: string[]): string[] => {
    const out: string[] = [];
    for (const name of names) {
      const op = OPERATIONS.find((o) => o.name === name);
      if (!op || op.method !== 'GET') continue;
      const last = op.path.split('/').filter((p) => p && !p.startsWith('{')).pop();
      if (last) out.push(norm(last));
    }
    return out;
  };

  /**
   * Apple exposes no list endpoint for this resource — the only way to an id is
   * `beta_app_clip_invocations.get` with an `include` parameter. A listed
   * exception, so the invariant stays strict for everything else.
   */
  const KNOWN_EXCEPTIONS = new Set(['beta_app_clip_invocation_localizations']);

  it.each(
    PROFILES.flatMap((p) => p.subProfiles.map((s) => [`${p.name}/${s.name || '-'}`, p.name, s.name] as const))
  )('%s can obtain every id it writes to', (_label, profileName, subName) => {
    const profile = PROFILES.find((p) => p.name === profileName)!;
    const sub = profile.subProfiles.find((s) => s.name === subName)!;
    const reads = new Set([...readCollections(sub.operations), ...readCollections(CORE_OPERATIONS)]);

    const unreachable: string[] = [];
    for (const name of sub.operations) {
      const op = OPERATIONS.find((o) => o.name === name);
      if (!op || op.method === 'GET' || !op.path.includes('/{id}')) continue;
      const collection = collectionOf(op.path, '{id}');
      if (!collection) continue;
      if (KNOWN_EXCEPTIONS.has(name.split('.')[0])) continue;
      const satisfied = [...reads].some(
        (r) => collection.endsWith(r) || r.endsWith(collection)
      );
      if (!satisfied) unreachable.push(`${name} needs an id from /${collection}`);
    }
    expect(unreachable).toEqual([]);
  });
});

describe('removed profiles', () => {
  it('points every tombstone at profiles that actually exist', () => {
    const live = new Set(PROFILES.map((p) => p.name));
    for (const [name, removed] of Object.entries(REMOVED_PROFILES)) {
      expect(live.has(name)).toBe(false); // a removed name must not come back
      expect(removed.replacements.length).toBeGreaterThan(0);
      for (const r of removed.replacements) expect(live.has(r.name)).toBe(true);
    }
  });

  it('loses none of the old profile tools', () => {
    // user-management served the testflight, users and sandbox domains.
    const old = loadable.filter((o) => ['testflight', 'users', 'sandbox'].includes(o.domain));
    const covered = new Set([
      ...CORE_OPERATIONS,
      ...REMOVED_PROFILES['user-management'].replacements.flatMap(
        (r) => PROFILES.find((p) => p.name === r.name)!.subProfiles.flatMap((s) => s.operations)
      ),
      // A handful moved to profiles outside the four named replacements; they
      // are still reachable, just not from the names the message lists.
      ...PROFILES.flatMap((p) => p.subProfiles.flatMap((s) => s.operations)),
    ]);
    expect(old.filter((o) => !covered.has(o.name))).toEqual([]);
  });

  it('writes a message an agent can relay verbatim', () => {
    const message = removedProfileMessage('user-management')!;
    expect(message).toContain('access');
    expect(message).toContain('testflight');
    expect(message).toContain('npx -y @erayendes/asc-mcp access');
    expect(removedProfileMessage('monetization')).toBeUndefined();
  });

  it('refuses to resolve a removed name as a live profile', () => {
    expect(() => resolveSelection('user-management')).toThrow(/removed/);
  });
});

describe('help text', () => {
  it('lists exactly the profiles that exist', () => {
    const help = helpText();
    for (const p of PROFILES) expect(help).toContain(p.name);
    // A hand-maintained list drifts on the first change; this catches the drift
    // in the other direction too.
    expect(help).not.toContain('user-management');
  });

  it('shows the sub-profile syntax', () => {
    expect(helpText()).toContain('monetization:subscription-pricing');
  });
});

describe('counts — curation output, not something that drifts on its own', () => {
  it('matches the numbers the sheet was signed off with', () => {
    expect(PROFILES.length).toBe(13);
    expect(PROFILES.flatMap((p) => p.subProfiles.filter((s) => s.name)).length).toBe(32);
    expect(CORE_OPERATIONS.length).toBe(6);
    expect(CORE_MANUAL_TOOLS.length).toBe(3);
    const tools = PROFILES.flatMap((p) =>
      p.subProfiles.flatMap((s) => [...s.operations, ...s.manualTools])
    );
    // 927 CSV rows - 9 core rows. Not a count of distinct tools: the screenshot
    // and preview tools sit under all three pages that can list a set, and ten
    // entry reads are deliberately in two slices.
    expect(tools.length).toBe(921);
    // The offset is the hand-written tools in the sheet, which are not spec
    // operations: 9 storekit, 3 reviews_ai, 3 pricing, 2 listing, 1 analytics,
    // 1 preflight, 3 metadata_ai. It grew by 5 when the listing pair, the
    // analytics macro, the equalize macro and the missing pricing read joined
    // the sheet, by 1 for the preflight check and by 3 for the i18n trio.
    expect(new Set([...tools, ...CORE_OPERATIONS]).size).toBe(loadable.length + 22);
  });
});

/**
 * The registry entry advertises the profile list in prose, and prose does not
 * regenerate. `server.json` is what every MCP aggregator scrapes, so a profile
 * added or renamed here and not there is a wrong answer served hourly to every
 * directory downstream — the same drift class the release pre-flight guards for
 * the tool count.
 */
describe('server.json stays in step with the profiles', () => {
  const server = JSON.parse(readFileSync('server.json', 'utf8'));
  const profileArg = server.packages?.[0]?.packageArguments?.find(
    (a: { valueHint?: string }) => a.valueHint === 'profile'
  );

  it('describes the profile argument at all', () => {
    // Without it an installer runs the server with no profile and serves the
    // default working set, which is the one thing the product is not about.
    expect(profileArg, 'server.json declares no profile argument').toBeTruthy();
    expect(profileArg.isRequired).toBe(false);
  });

  it('names every profile, and invents none', () => {
    const described: string[] = (profileArg.description.match(/[a-z][a-z-]+/g) ?? []).filter(
      (w: string) => w.includes('-') || w.length > 3
    );
    const real = PROFILES.map((p) => p.name);
    const missing = real.filter((n) => !profileArg.description.includes(n));
    expect(missing, 'profiles missing from the server.json description').toEqual([]);
    // And a renamed profile leaves its old name behind, which is worse than an
    // omission because it reads as real.
    const invented = described.filter(
      (w) => /^(app|game|xcode|background)-/.test(w) && !real.includes(w)
    );
    expect(invented, 'server.json names a profile that does not exist').toEqual([]);
  });

  it('keeps the sub-profile example true', () => {
    // "monetization:subscription-pricing is 24 tools instead of 206" is a claim
    // about live data, and both halves drift.
    const m = /monetization:([a-z-]+) is (\d+) tools instead of (\d+)/.exec(profileArg.description);
    expect(m, 'the sub-profile example changed shape').toBeTruthy();
    const [, subName, claimedNarrow, claimedWide] = m!;

    const narrow = resolveSelection(`monetization:${subName}`)!;
    const wide = resolveSelection('monetization')!;
    // Same definition the guide's table and the setup picker use: the
    // operations, the hand-written tools the selection carries, and core's.
    const count = (sel: ReturnType<typeof resolveSelection>) =>
      new Set([...operationsFor(sel), ...manualToolsFor(sel), ...CORE_MANUAL_TOOLS]).size;

    expect(count(narrow), 'narrow count in server.json').toBe(Number(claimedNarrow));
    expect(count(wide), 'wide count in server.json').toBe(Number(claimedWide));
  });
});

/**
 * `--include-deprecated` was a no-op in profile mode and said nothing about it.
 * Membership is hand-curated in spec/profiles.csv and nobody curates an
 * endpoint Apple has retired, so 0 of the 123 deprecated operations were
 * reachable from any profile — the flag only ever worked on the no-profile
 * server with `--domains`.
 */
describe('--include-deprecated in profile mode', () => {
  const selection = resolveSelection('game-center');

  it('adds nothing on its own — the curated set has no deprecated operations', () => {
    const curated = operationsFor(selection);
    const deprecated = new Set(OPERATIONS.filter((op) => op.deprecated).map((op) => op.name));
    expect(curated.filter((name) => deprecated.has(name))).toEqual([]);
  });

  it('offers the retired operations of the domains the profile covers', () => {
    const extra = deprecatedOperationsFor(selection);
    expect(extra.length).toBeGreaterThan(0);
    // Every one is genuinely deprecated, and genuinely in scope for this
    // profile — the definition is by domain, since there is no curated answer.
    const byName = new Map(OPERATIONS.map((op) => [op.name, op]));
    const domains = new Set(
      operationsFor(selection).map((n) => byName.get(n)?.domain).filter(Boolean)
    );
    for (const name of extra) {
      expect(byName.get(name)?.deprecated, `${name} is not deprecated`).toBe(true);
      expect(domains.has(byName.get(name)?.domain), `${name} is out of scope`).toBe(true);
    }
  });
});
