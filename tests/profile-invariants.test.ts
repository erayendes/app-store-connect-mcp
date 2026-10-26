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
  PROFILELESS,
  TWIN_OF,
  MACRO_COVERED,
  CORE_PROFILE,
  descriptionKey,
  deprecatedOperationsFor,
  manualToolsFor,
  operationsFor,
  resolveSelection,
  toolCountFor,
  unknownProfileMessage,
} from '../src/profiles.js';
import { OPERATIONS } from '../src/generated/operations.js';
import { BODY_SCHEMAS } from '../src/generated/body-schemas.js';
import { ToolRegistry } from '../src/core/registry.js';
import { helpText } from '../src/index.js';

const loadable = OPERATIONS.filter((o) => !o.deprecated);
const byName = new Map(OPERATIONS.map((o) => [o.name, o]));
const coreOps = PROFILES.find((p) => p.name === CORE_PROFILE)!.subProfiles.flatMap((s) => s.operations);

/** Every sub-profile, flat profiles included as `profile/-`. */
const SUBS = PROFILES.flatMap((p) =>
  p.subProfiles.map((s) => ({ label: `${p.name}/${s.name || '-'}`, profile: p, sub: s }))
);

/**
 * One spelling per resource. Apple names a to-one relationship in the singular
 * (`.../appStoreVersionPhasedRelease`) and the collection in the plural, and a
 * second generation of a resource with a suffix in one place and not the other
 * (`/v2/inAppPurchases` against `/v1/apps/{id}/inAppPurchasesV2`). Same
 * resource, same id.
 */
const norm = (s: string): string =>
  s.toLowerCase().replace(/v\d+$/, '').replace(/ies$/, 'y').replace(/s$/, '');

/**
 * Where Apple names one resource two ways, the collection and the path segment
 * that returns it: the id type `appKeywords` comes back from `.../searchKeywords`,
 * an in-app purchase's price schedule from `.../iapPriceSchedule`, a Game
 * Center detail player from `.../blockedPlayers`.
 */
const ALIASES: Record<string, string> = {
  appkeyword: 'searchkeyword',
  inapppurchasepriceschedule: 'inapppurchaseiappriceschedule',
  gamecenterdetailplayer: 'gamecenterdetailblockedplayer',
};

/**
 * Collections whose ids Apple hands out only through `include` on a parent
 * read — the spec has no list or relationship GET that returns them. Treated as
 * given; the guard below fails if Apple adds such a read, so the entry can go.
 */
const INCLUDE_ONLY = [
  'buildBundles',
  'appClipAdvancedExperienceImages',
  'betaAppClipInvocationLocalizations',
  'backgroundAssetVersionAppStoreReleases',
  'backgroundAssetVersionExternalBetaReleases',
  'backgroundAssetVersionInternalBetaReleases',
].map(norm);

/** The collection a GET returns: the last path segment that is not a parameter. */
const readCollections = (names: string[]): string[] => {
  const out: string[] = [];
  for (const name of names) {
    const op = byName.get(name);
    if (!op || op.method !== 'GET') continue;
    const last = op.path.split('/').filter((p) => p && !p.startsWith('{')).pop();
    if (last) out.push(norm(last));
  }
  return out;
};

describe('reachability — every sub-profile reaches its own resources from an app', () => {
  /**
   * The bug this whole file exists for: `/v1/apps/{id}/subscriptionGroups`
   * used to sit in app-info while every subscription tool sat in monetization,
   * so `asc-monetization` could not list an app's subscription groups at all.
   *
   * Checked per sub-profile, because that is the unit a user registers. Given:
   * an app, and whatever core reads — core is registered next to every
   * profile, and many slices take their build or version id from it rather
   * than repeating the listing. From there a GET under a reachable collection
   * (`/v1/X/{id}/Y`, or its `relationships/Y`) reaches Y, and a top-level list
   * (`/v1/Y`) reaches Y outright. Every resource the sub-profile owns must be
   * in the closure.
   */
  const GIVEN = ['app', ...readCollections(coreOps), ...INCLUDE_ONLY];

  /**
   * The collection a root resource lives under, from its own operations'
   * paths — or undefined when nothing about it takes an id. A resource that is
   * only ever created (a release request, a webhook ping, a submission) has no
   * id anyone needs to find: the create response is the end of it.
   */
  const collectionOf = (resource: string): string | undefined => {
    const ops = OPERATIONS.filter((o) => o.name.startsWith(`${resource}.`) && !o.deprecated);
    const byId = ops.find((o) => o.path.split('/')[3] === '{id}');
    return byId ? norm(byId.path.split('/')[2]) : undefined;
  };

  /**
   * A read under a reached parent is an edge: `/v2/gameCenterAchievements/{id}/versions`
   * runs from `gamecenterachievement` to `version`. A child is named relative
   * to its parent, so a collection matches an edge when it is the target
   * outright (`subscriptiongroup`), or the target behind a prefix the parent
   * starts with (`gamecenterachievementversion`, and `gamecenterachievementimage`
   * from `gameCenterAchievementLocalizations/{id}/image`). A top-level list has
   * no parent and matches only outright.
   */
  type Edge = { from: string; to: string };
  const matchesName = (collection: string, edges: Edge[]): boolean =>
    GIVEN.includes(collection) ||
    edges.some(
      ({ from, to }) =>
        collection === to ||
        (from !== '' && collection.endsWith(to) && from.startsWith(collection.slice(0, -to.length)))
    );
  const matches = (collection: string, edges: Edge[]): boolean =>
    matchesName(collection, edges) || (collection in ALIASES && matchesName(ALIASES[collection], edges));

  const edgesFrom = (names: string[]): Edge[] => {
    const edges: Edge[] = [];
    const reads = names.map((n) => byName.get(n)!).filter((o) => o && o.method === 'GET');
    for (let grew = true; grew; ) {
      grew = false;
      for (const op of reads) {
        const parts = op.path.split('/').filter(Boolean).slice(1); // drop v1/v2
        let edge: Edge | undefined;
        if (parts.length === 1) edge = { from: '', to: norm(parts[0]) };
        else if (parts[1] === '{id}' && parts.length >= 3 && matches(norm(parts[0]), edges)) {
          edge = { from: norm(parts[0]), to: norm(parts[2] === 'relationships' ? parts[3] : parts[2]) };
        }
        if (edge && !edges.some((e) => e.from === edge!.from && e.to === edge!.to)) {
          edges.push(edge);
          grew = true;
        }
      }
    }
    return edges;
  };

  /**
   * Real gaps in the sheet, listed rather than fixed: the sheet is the owner's,
   * and a row added here to make a test pass is a curation decision taken by
   * the wrong person. Each entry is `profile/sub: resource`, and the test below
   * fails when an entry stops being a gap, so the list can only shrink.
   */
  const KNOWN_GAPS = new Set<string>([
    // The raw library tools list placements per page localization, and this
    // slice reads no localizations. Temporary: the media macros replace the
    // whole sub-profile.
    'marketing/asset-library: app_custom_product_page_localizations',
    'marketing/asset-library: app_event_localizations',
    'marketing/asset-library: app_store_version_experiment_treatment_localizations',
    'marketing/asset-library: app_store_version_localizations',
  ]);

  it('finds entry points at all (guards the walk, not the data)', () => {
    expect(matches(norm('subscriptionGroups'), edgesFrom(coreOps))).toBe(true);
    expect(collectionOf('subscription_groups')).toBe(norm('subscriptionGroups'));
    // A child named relative to its parent, two hops from the app.
    const sub = SUBS.find((s) => s.label === 'game-center/achievements')!.sub;
    expect(matches(collectionOf('game_center_achievement_versions_v2')!, edgesFrom([...sub.operations, ...coreOps]))).toBe(true);
    // Created and never looked up again: nothing to reach.
    expect(collectionOf('app_store_version_release_requests')).toBeUndefined();
  });

  it('treats as include-only only what no read returns', () => {
    // A read that returns ids, not one that takes them: `/v1/X/{id}` is neither.
    const producers = OPERATIONS.filter((o) => !o.deprecated && !o.path.endsWith('{id}')).map((o) => o.name);
    const returned = new Set(readCollections(producers));
    expect(INCLUDE_ONLY.filter((c) => returned.has(c))).toEqual([]);
  });

  const gapsOf = (label: string): string[] => {
    const { sub } = SUBS.find((s) => s.label === label)!;
    const edges = edgesFrom([...sub.operations, ...coreOps]);
    return sub.rootResources
      .filter((r) => {
        const c = collectionOf(r);
        return c !== undefined && !matches(c, edges);
      })
      .map((r) => `${label}: ${r}`);
  };

  it.each(SUBS.map((s) => s.label))('%s reaches every resource it owns', (label) => {
    expect(gapsOf(label).filter((g) => !KNOWN_GAPS.has(g))).toEqual([]);
  });

  it('lists no known gap that has since been closed', () => {
    const open = new Set(SUBS.flatMap((s) => gapsOf(s.label)));
    expect([...KNOWN_GAPS].filter((g) => !open.has(g))).toEqual([]);
  });
});

describe('coverage', () => {
  /**
   * Every live operation is placed exactly one of four ways: in a profile, in
   * no profile on purpose (a reverse read), dropped for its twin (the other end
   * of the same relationship), or replaced by a macro.
   */
  it('leaves no operation orphaned', () => {
    const covered = new Set([
      ...PROFILES.flatMap((p) => p.subProfiles.flatMap((s) => s.operations)),
      ...PROFILELESS,
      ...Object.keys(TWIN_OF),
      ...Object.keys(MACRO_COVERED),
    ]);
    const orphans = loadable.filter((o) => !covered.has(o.name)).map((o) => o.name);
    expect(orphans).toEqual([]);
  });

  it('keeps one end of every twin pair loaded, and the other nowhere', () => {
    const placed = new Set(PROFILES.flatMap((p) => p.subProfiles.flatMap((s) => s.operations)));
    for (const [dropped, twin] of Object.entries(TWIN_OF)) {
      expect(byName.has(dropped), dropped).toBe(true);
      expect(placed.has(twin), `${twin} (twin of ${dropped}) is in no profile`).toBe(true);
      expect(placed.has(dropped), `${dropped} was dropped but is loaded`).toBe(false);
    }
  });

  it('keeps the profile-less operations reachable without a profile', () => {
    const registry = new ToolRegistry({ domains: ['all'], readOnly: false, includeDeprecated: false });
    const placed = new Set(PROFILES.flatMap((p) => p.subProfiles.flatMap((s) => s.operations)));
    expect(PROFILELESS.length).toBeGreaterThan(0);
    for (const name of PROFILELESS) {
      expect(registry.get(name), `${name} is not loadable with --domains=all`).toBeTruthy();
      expect(placed.has(name), `${name} is profile-less and in a profile`).toBe(false);
    }
  });

  it('never promises a tool that does not exist', () => {
    const unknown = PROFILES.flatMap((p) =>
      p.subProfiles.flatMap((s) => s.operations.filter((n) => !byName.has(n)))
    );
    expect(unknown).toEqual([]);
  });

  it('loads nothing Apple has deprecated', () => {
    const bad = PROFILES.flatMap((p) =>
      p.subProfiles.flatMap((s) => s.operations.filter((n) => byName.get(n)?.deprecated))
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

  it('keeps core flat: one server, no slices to pick from', () => {
    const core = PROFILES.find((p) => p.name === CORE_PROFILE)!;
    expect(core.subProfiles.map((s) => s.name)).toEqual(['']);
  });
});

describe('chain integrity — a write needs a read that produces its ids', () => {
  /**
   * A sub-profile that can update a resource but not list it hands the model an
   * `{id}` it has no way to obtain. The same goes for an id a write carries in
   * its body: a win-back offer names a subscription price point per territory,
   * and a slice that cannot read price points can only create one by guessing.
   * Matching is by collection name, not by root: `/v1/subscriptionPrices/{id}`
   * is satisfied by `/v1/subscriptions/{id}/prices`.
   */
  const collectionOf = (path: string, before: string): string | undefined => {
    const parts = path.split('/').filter(Boolean);
    const i = parts.indexOf(before);
    return i > 0 ? norm(parts[i - 1]) : undefined;
  };

  /** `type` enums under a JSON:API `data` node, to-one or to-many. */
  const typesOf = (data: any): string[] =>
    data?.properties?.type?.enum ?? data?.items?.properties?.type?.enum ?? [];

  /**
   * Every resource type a request body must point at by id. Only required
   * relationships: an optional one is often one of several alternatives — a
   * screenshot set hangs off a version page, a custom product page or an
   * experiment, and a slice needs only its own. Types created inline in
   * `included` are excluded too: their ids are local placeholders the caller
   * makes up, not ids anything has to read first.
   */
  const bodyRefs = (bodyRef: string): string[] => {
    const schema: any = BODY_SCHEMAS[bodyRef];
    if (!schema) return [];
    const refs = new Set<string>();
    const inline = new Set<string>();
    // Inside `included` every relationship counts, required or not: an inline
    // resource exists to carry its links (a win-back price is a territory and
    // a price point and nothing else), and Apple's schema marks none of them.
    const walk = (node: any, key?: string, inIncluded = false): void => {
      if (!node || typeof node !== 'object') return;
      if (key === 'relationships' && node.properties) {
        for (const name of inIncluded ? Object.keys(node.properties) : (node.required ?? [])) {
          for (const t of typesOf(node.properties[name]?.properties?.data)) refs.add(t);
        }
      }
      if (key === 'included') {
        const items = node.items ?? {};
        for (const item of [items, ...(items.oneOf ?? []), ...(items.anyOf ?? [])]) {
          for (const t of item?.properties?.type?.enum ?? []) inline.add(t);
        }
      }
      for (const [k, v] of Object.entries(node)) walk(v, k, inIncluded || k === 'included');
    };
    walk(schema);
    // A linkage request is nothing but ids: its top-level data is the reference.
    if (/Linkages?Request$/.test(bodyRef)) for (const t of typesOf(schema.properties?.data)) refs.add(t);
    return [...refs].filter((t) => !inline.has(t));
  };

  /**
   * Body references whose id needs no read: a territory id is its ISO-3166
   * alpha-3 code (the server instructions say so), and nobody reads a list
   * of territories to learn that USA is USA.
   */
  const SELF_EVIDENT_IDS = new Set(['territories']);

  /**
   * Real gaps, listed rather than patched in the sheet — see the reachability
   * KNOWN_GAPS. `profile/sub: operation needs <collection>`.
   */
  const KNOWN_GAPS = new Set<string>([]);

  const gapsOf = (label: string): string[] => {
    const { sub } = SUBS.find((s) => s.label === label)!;
    const reads = new Set([...readCollections(sub.operations), ...readCollections(coreOps), ...INCLUDE_ONLY]);
    const satisfiedBy = (collection: string) =>
      [...reads].some((r) => collection.endsWith(r) || r.endsWith(collection));
    const satisfied = (collection: string) =>
      satisfiedBy(collection) || (collection in ALIASES && satisfiedBy(ALIASES[collection]));

    const gaps: string[] = [];
    for (const name of sub.operations) {
      const op = byName.get(name);
      if (!op || op.method === 'GET') continue;
      if (op.path.includes('/{id}')) {
        const collection = collectionOf(op.path, '{id}');
        if (collection && !satisfied(collection)) gaps.push(`${label}: ${name} needs /${collection}`);
      }
      for (const type of op.bodyRef ? bodyRefs(op.bodyRef) : []) {
        if (SELF_EVIDENT_IDS.has(type)) continue;
        if (!satisfied(norm(type))) gaps.push(`${label}: ${name} needs ${type} (body)`);
      }
    }
    return [...new Set(gaps)];
  };

  it('reads relationship ids out of a body (guards the walker, not the data)', () => {
    expect(bodyRefs('WinBackOfferCreateRequest')).toEqual(
      expect.arrayContaining(['subscriptions', 'subscriptionPricePoints'])
    );
    expect(bodyRefs('WinBackOfferCreateRequest')).not.toContain('winBackOfferPrices');
  });

  it.each(SUBS.map((s) => s.label))('%s can obtain every id it writes to', (label) => {
    expect(gapsOf(label).filter((g) => !KNOWN_GAPS.has(g))).toEqual([]);
  });

  it('lists no known gap that has since been closed', () => {
    const open = new Set(SUBS.flatMap((s) => gapsOf(s.label)));
    expect([...KNOWN_GAPS].filter((g) => !open.has(g))).toEqual([]);
  });
});

describe('unknown profiles', () => {
  it('refuses to resolve a name from an earlier version as a live profile', () => {
    expect(() => resolveSelection('app-info')).toThrow(/Unknown profile/);
    expect(() => resolveSelection('user-management')).toThrow(/Unknown profile/);
  });

  it('writes a message an agent can relay verbatim', () => {
    const message = unknownProfileMessage('app-info');
    expect(message).toContain('"app-info"');
    expect(message).toContain('npx -y @erayendes/asc-mcp setup');
    // Generic: every live profile, and no table of renames to keep in step.
    for (const p of PROFILES) expect(message).toContain(p.name);
  });
});

describe('help text', () => {
  it('lists exactly the profiles that exist', () => {
    const help = helpText();
    for (const p of PROFILES) expect(help).toContain(p.name);
    // A hand-maintained list drifts on the first change; this catches the drift
    // in the other direction too. (`general:app-information` is live.)
    expect(help).not.toMatch(/app-info(?!rmation)/);
  });

  it('shows the sub-profile syntax and the core flag', () => {
    expect(helpText()).toContain('monetization:subscription,subscription-offers');
    expect(helpText()).toContain('--with-core');
  });
});

describe('counts — curation output, not something that drifts on its own', () => {
  it('matches the numbers the sheet was signed off with', () => {
    expect(PROFILES.length).toBe(14);
    expect(PROFILES.flatMap((p) => p.subProfiles.filter((s) => s.name)).length).toBe(52);
    const core = resolveSelection(CORE_PROFILE);
    expect(operationsFor(core).length).toBe(8);
    expect(manualToolsFor(core).length).toBe(8);
    expect(PROFILELESS.length).toBe(7);
    expect(Object.keys(TWIN_OF).length).toBe(12);
    expect(Object.keys(MACRO_COVERED).length).toBe(0);
    const tools = PROFILES.flatMap((p) =>
      p.subProfiles.flatMap((s) => [...s.operations, ...s.manualTools])
    );
    // 989 CSV rows - 7 profile-less ones. Not a count of distinct tools: the
    // screenshot and preview tools sit under all three pages that can list a
    // set, and a few entry reads are deliberately in two slices.
    expect(tools.length).toBe(982);
    // Placed operations plus the hand-written tools in the sheet, which are
    // not spec operations: 9 storekit, 3 reviews_ai, 7 pricing, 5 listing, 1
    // analytics, 2 preflight, 1 account, 3 metadata_ai, 1 release, 2
    // testflight, 1 ci, and core's 3 meta tools — 38.
    const placed = loadable.length - PROFILELESS.length - Object.keys(TWIN_OF).length;
    expect(new Set(tools).size).toBe(placed + 38);
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
    // "monetization:subscription-offers is 17 tools instead of 197" is a claim
    // about live data, and both halves drift.
    const m = /monetization:([a-z-]+) is (\d+) tools instead of (\d+)/.exec(profileArg.description);
    expect(m, 'the sub-profile example changed shape').toBeTruthy();
    const [, subName, claimedNarrow, claimedWide] = m!;

    const narrow = resolveSelection(`monetization:${subName}`)!;
    const wide = resolveSelection('monetization')!;
    // What tools/list answers on that server (tests/proxy.test.ts proves the
    // two agree): its own tools, asc__status, and the proxy pair when narrowed.
    expect(toolCountFor(narrow), 'narrow count in server.json').toBe(Number(claimedNarrow));
    expect(toolCountFor(wide), 'wide count in server.json').toBe(Number(claimedWide));
    // The headline's "narrow to N" is the same example.
    expect(server.description).toContain(`narrow to ${claimedNarrow}.`);
  });

  it('counts the tools the profiles serve in the headline', () => {
    // Every distinct tool some profile serves, plus the asc__call/asc__describe
    // pair a narrowed server adds. Profile-less and twin operations are left
    // out: no profile serves them.
    const distinct = new Set(
      PROFILES.flatMap((p) => p.subProfiles.flatMap((s) => [...s.operations, ...s.manualTools]))
    );
    const m = /(\d+) tools in (\d+) profiles/.exec(server.description);
    expect(m, 'the headline changed shape').toBeTruthy();
    expect(Number(m![1])).toBe(distinct.size + 2);
    expect(Number(m![2])).toBe(PROFILES.length);
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
    const domains = new Set(
      operationsFor(selection).map((n) => byName.get(n)?.domain).filter(Boolean)
    );
    for (const name of extra) {
      expect(byName.get(name)?.deprecated, `${name} is not deprecated`).toBe(true);
      expect(domains.has(byName.get(name)?.domain), `${name} is out of scope`).toBe(true);
    }
  });
});
