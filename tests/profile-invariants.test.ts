/**
 * Membership is hand-curated in a spreadsheet, so the guarantees that used to
 * fall out of the code have to be asserted instead. Each test here is one thing
 * curation can quietly get wrong — and did, before this file existed.
 */
import { describe, it, expect } from 'vitest';
import {
  PROFILES,
  PROFILE_DESCRIPTIONS,
  CORE_OPERATIONS,
  CORE_MANUAL_TOOLS,
  REMOVED_PROFILES,
  descriptionKey,
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
    // 924 CSV rows - 9 core rows. Not a count of distinct tools: the screenshot
    // and preview tools sit under all three pages that can list a set, and ten
    // entry reads are deliberately in two slices.
    expect(tools.length).toBe(915);
    // The offset is the hand-written tools in the sheet, which are not spec
    // operations: 9 storekit, 3 reviews_ai, 2 listing, 2 pricing. It grew by 3
    // when the listing pair and the missing pricing read joined the sheet.
    expect(new Set([...tools, ...CORE_OPERATIONS]).size).toBe(loadable.length + 16);
  });
});
