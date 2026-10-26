/**
 * Generates profile membership from `spec/profiles.csv`.
 *
 * Which tool belongs to which profile used to be derived from the URL — the
 * first path segment picked the domain, the domain picked the profile. Every
 * relationship hanging off an app (`/v1/apps/{id}/subscriptionGroups`) therefore
 * landed in the app-info profile while the resource itself lived elsewhere, so
 * eight of eleven profiles could not reach their own resources from an app.
 *
 * The mapping is hand-curated instead, in a spreadsheet the owner maintains, and
 * exported to `spec/profiles.csv`. That CSV is the single source of truth; this
 * generator turns it into `src/generated/profiles-data.ts`. Same pattern as
 * `spec/openapi.json` -> `src/generated/operations.ts`.
 *
 * Run with `npm run generate`.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OPERATIONS } from '../src/generated/operations.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

/** Rows whose tool is written by hand rather than generated from Apple's spec. */
const MANUAL_MARKER = '(elle yazılmış)';

/**
 * The profile column for an operation that belongs to no profile. These are
 * reverse reads (`beta_groups.app.get`: which app owns this group) that no
 * workflow needs, because every profile reaches the same resource from the app
 * side. They stay loadable with `--domains` and count as placed for the orphan
 * test; nothing in profile mode serves them.
 */
const PROFILELESS_MARKER = '(profilsiz)';

/**
 * Apple exposes most to-many relationships from both ends:
 * `/v1/betaGroups/{id}/relationships/betaTesters` and
 * `/v1/betaTesters/{id}/relationships/betaGroups` make the same link. Loading
 * both is two tools a model has to tell apart for one action, so the sheet
 * keeps one direction and drops the other. This is the record of which one was
 * dropped and what it was dropped in favour of — operation -> its twin.
 *
 * Validated below: both ends exist in the spec, and the twin is in a profile,
 * so dropping one side can never drop the action.
 */
const TWIN_OF: Record<string, string> = {
  'beta_groups.beta_testers.add': 'beta_testers.beta_groups.add',
  'beta_groups.beta_testers.remove': 'beta_testers.beta_groups.remove',
  'builds.beta_groups.add': 'beta_groups.builds.add',
  'builds.beta_groups.remove': 'beta_groups.builds.remove',
  'beta_testers.builds.add': 'builds.individual_testers.add',
  'beta_testers.builds.remove': 'builds.individual_testers.remove',
  'beta_testers.apps.remove': 'apps.beta_testers.remove',
  'app_store_versions.app_clip_default_experience.set':
    'app_clip_default_experiences.release_with_app_store_version.set',
  'game_center_leaderboards_v2.challenge.set': 'game_center_challenges.leaderboard_v2.set',
  'game_center_achievements_v2.activity.set': 'game_center_activities.achievements_v2.add',
  'game_center_leaderboards_v2.activity.set': 'game_center_activities.leaderboards_v2.add',
  // Not a relationship pair but the same read twice: the content by its own
  // id, and the content through the in-app purchase that owns it.
  'in_app_purchase_contents.get': 'in_app_purchases_v2.content.get',
};

/**
 * Operations a hand-written macro replaces outright — operation -> macro name.
 * The raw tool is then not loaded anywhere, and the orphan test counts it as
 * placed through the macro. Validated that
 * the macro is a hand-written tool the sheet knows.
 */
const MACRO_COVERED: Record<string, string> = {
  "apps.asset_library.get": "media__list",
  "app_asset_libraries.get": "media__list",
  "app_asset_libraries.images.list": "media__list",
  "app_asset_libraries.videos.list": "media__list",
  "app_asset_library_images.create": "media__upload",
  "app_asset_library_images.get": "media__list",
  "app_asset_library_images.update": "media__arrange",
  "app_asset_library_images.delete": "media__delete",
  "app_asset_library_images.placements.list": "media__list",
  "app_asset_library_videos.create": "media__upload",
  "app_asset_library_videos.get": "media__list",
  "app_asset_library_videos.update": "media__arrange",
  "app_asset_library_videos.delete": "media__delete",
  "app_asset_library_videos.placements.list": "media__list",
  "app_asset_library_placements.create": "media__arrange",
  "app_asset_library_placements.get": "media__list",
  "app_asset_library_placements.delete": "media__delete",
  "app_asset_library_placement_ordering_requests.create": "media__arrange",
  "app_asset_library_ref_data.list": "media__list",
  "app_asset_library_ref_data.get": "media__list",
  "app_store_version_localizations.placements.list": "media__list",
  "app_custom_product_page_localizations.placements.list": "media__list",
  "app_store_version_experiment_treatment_localizations.placements.list": "media__list",
  "app_event_localizations.placements.list": "media__list"
};

/** Hand-written tools live in these families; anything else is a typo. */
const MANUAL_PREFIXES = ['asc__', 'reviews_ai__', 'storekit__', 'pricing__', 'listing__', 'media__', 'analytics__', 'ci__', 'preflight__', 'metadata_ai__', 'release__', 'testflight__'];

interface Row {
  profile: string;
  subProfile: string;
  tool: string;
  operation: string;
  rootResource: string;
  line: number;
}

/**
 * Minimal RFC 4180 reader — enough for a spreadsheet export (quoted fields,
 * doubled quotes, newlines inside quotes). Not worth a dependency.
 */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function readRows(): Row[] {
  const table = parseCsv(readFileSync(resolve(ROOT, 'spec/profiles.csv'), 'utf8'));
  const head = table[0];
  const col = (name: string): number => {
    const i = head.indexOf(name);
    if (i < 0) throw new Error(`spec/profiles.csv is missing the "${name}" column.`);
    return i;
  };
  const [p, s, t, op, root] = ['profile', 'sub-profile', 'tools', 'operasyon', 'kaynak_kok'].map(col);
  return table
    .slice(1)
    .map((r, i) => ({
      profile: r[p]?.trim() ?? '',
      subProfile: r[s]?.trim() ?? '',
      tool: r[t]?.trim() ?? '',
      operation: r[op]?.trim() ?? '',
      rootResource: r[root]?.trim() ?? '',
      line: i + 2, // 1-based, past the header — matches what an editor shows
    }))
    .filter((r) => r.profile && r.tool);
}

/**
 * Every rule below fails the build rather than dropping a row. A silently
 * skipped row makes a tool invisible, and nobody notices until a user reports
 * that the server "doesn't have" something the sheet promised.
 */
function validate(rows: Row[]): void {
  const problems: string[] = [];
  const byName = new Map(OPERATIONS.map((o) => [o.name, o]));
  const seen = new Set<string>();

  for (const row of rows) {
    const where = `line ${row.line} (${row.profile}/${row.subProfile || '-'}: ${row.tool})`;

    if (row.operation === MANUAL_MARKER) {
      if (!MANUAL_PREFIXES.some((prefix) => row.tool.startsWith(prefix))) {
        problems.push(
          `${where}: marked hand-written but "${row.tool}" is in no known family ` +
            `(${MANUAL_PREFIXES.join(', ')}).`
        );
      }
    } else {
      const op = byName.get(row.operation);
      if (!op) {
        problems.push(`${where}: operation "${row.operation}" is not in the spec.`);
      } else if (op.deprecated) {
        problems.push(`${where}: operation "${row.operation}" is deprecated by Apple and never loads.`);
      }
    }

    // The same tool in two profiles is deliberate (M:N). The same tool twice in
    // the same sub-profile is a copy-paste slip.
    const triple = `${row.profile}\u0000${row.subProfile}\u0000${row.tool}`;
    if (seen.has(triple)) problems.push(`${where}: duplicate row.`);
    seen.add(triple);
  }

  const placed = new Set(
    rows.filter((r) => r.profile !== PROFILELESS_MARKER && r.operation !== MANUAL_MARKER).map((r) => r.operation)
  );
  for (const [dropped, twin] of Object.entries(TWIN_OF)) {
    if (!byName.has(dropped)) problems.push(`TWIN_OF: "${dropped}" is not in the spec.`);
    if (!byName.has(twin)) problems.push(`TWIN_OF: twin "${twin}" of "${dropped}" is not in the spec.`);
    else if (!placed.has(twin)) {
      problems.push(`TWIN_OF: "${dropped}" was dropped for "${twin}", which is in no profile.`);
    }
    if (placed.has(dropped)) problems.push(`TWIN_OF: "${dropped}" is marked dropped but has a row.`);
  }

  for (const row of rows) {
    if (row.profile === PROFILELESS_MARKER && placed.has(row.operation)) {
      problems.push(`line ${row.line}: "${row.tool}" is marked ${PROFILELESS_MARKER} but also sits in a profile.`);
    }
  }

  const macros = new Set(rows.filter((r) => r.operation === MANUAL_MARKER).map((r) => r.tool));
  for (const [covered, macro] of Object.entries(MACRO_COVERED)) {
    if (placed.has(covered)) problems.push(`MACRO_COVERED: "${covered}" still has a profile row.`);
    if (!byName.has(covered)) problems.push(`MACRO_COVERED: "${covered}" is not in the spec.`);
    if (!macros.has(macro)) {
      problems.push(`MACRO_COVERED: "${covered}" names "${macro}", which is no hand-written tool in the sheet.`);
    }
  }

  if (problems.length) {
    throw new Error(`spec/profiles.csv has ${problems.length} problem(s):\n  ` + problems.join('\n  '));
  }
}

interface SubProfileData {
  name: string;
  operations: string[];
  manualTools: string[];
  /** Root resources this sub-profile owns — feeds the reachability invariant. */
  rootResources: string[];
}

interface ProfileData {
  name: string;
  subProfiles: SubProfileData[];
}

function build(rows: Row[]): { profiles: ProfileData[]; profileless: string[] } {
  const profiles = new Map<string, Map<string, SubProfileData>>();
  const profileless = new Set<string>();

  for (const row of rows) {
    if (row.profile === PROFILELESS_MARKER) {
      profileless.add(row.operation);
      continue;
    }
    if (!profiles.has(row.profile)) profiles.set(row.profile, new Map());
    const subs = profiles.get(row.profile)!;
    if (!subs.has(row.subProfile)) {
      subs.set(row.subProfile, {
        name: row.subProfile,
        operations: [],
        manualTools: [],
        rootResources: [],
      });
    }
    const sub = subs.get(row.subProfile)!;
    if (row.operation === MANUAL_MARKER) sub.manualTools.push(row.tool);
    else sub.operations.push(row.operation);
    // A macro row names `(makro)` here: not an Apple resource, nothing to reach.
    if (row.rootResource && row.rootResource !== '(makro)' && !sub.rootResources.includes(row.rootResource)) {
      sub.rootResources.push(row.rootResource);
    }
  }

  // A profile is either flat (one unnamed sub-profile) or split into named
  // ones. A mix would leave rows that no `profile:sub` argument can select.
  for (const [name, subs] of profiles) {
    if (subs.size > 1 && subs.has('')) {
      throw new Error(`"${name}" mixes rows without a sub-profile with named sub-profiles.`);
    }
  }

  return {
    profileless: [...profileless].sort(),
    profiles: [...profiles.entries()]
      .map(([name, subs]) => ({
        name,
        // Alphabetical, not sheet order: the CSV's row order is an artifact of
        // how it was edited, and it decides what the picker looks like. Sorting
        // also keeps families together — every iap-* next to the others.
        subProfiles: [...subs.values()].sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
}

function emit(profiles: ProfileData[], profileless: string[]): string {
  const sub = (s: SubProfileData): string =>
    `    {\n` +
    `      name: ${JSON.stringify(s.name)},\n` +
    `      operations: ${JSON.stringify(s.operations.sort())},\n` +
    `      manualTools: ${JSON.stringify(s.manualTools.sort())},\n` +
    `      rootResources: ${JSON.stringify(s.rootResources.sort())},\n` +
    `    },`;
  const record = (r: Record<string, string>): string => {
    const keys = Object.keys(r).sort();
    if (!keys.length) return '{}';
    return `{\n` + keys.map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(r[k])},`).join('\n') + `\n}`;
  };

  return (
    `// AUTO-GENERATED — do not edit by hand.\n` +
    `// Source: spec/profiles.csv (hand-curated; see scripts/generate-profiles.ts)\n` +
    `// Regenerate with: npm run generate\n\n` +
    `export interface GeneratedSubProfile {\n` +
    `  /** Unique within its profile. Empty when the profile has no sub-profiles. */\n` +
    `  name: string;\n` +
    `  /** Dotted operation names from Apple's spec. */\n` +
    `  operations: string[];\n` +
    `  /** Tools written by hand (meta, reviews-ai, StoreKit, pricing macros). */\n` +
    `  manualTools: string[];\n` +
    `  /** Apple resources this sub-profile owns, for the reachability invariant. */\n` +
    `  rootResources: string[];\n` +
    `}\n\n` +
    `export interface GeneratedProfile {\n` +
    `  name: string;\n` +
    `  subProfiles: GeneratedSubProfile[];\n` +
    `}\n\n` +
    `export const PROFILE_DATA: GeneratedProfile[] = [\n` +
    profiles
      .map((p) => `  {\n    name: ${JSON.stringify(p.name)},\n    subProfiles: [\n` +
        p.subProfiles.map(sub).join('\n') + `\n    ],\n  },`)
      .join('\n') +
    `\n];\n\n` +
    `/** In no profile on purpose (reverse reads); reachable only with --domains. */\n` +
    `export const PROFILELESS: string[] = ${JSON.stringify(profileless)};\n\n` +
    `/** One direction of a relationship pair, dropped for its twin (operation -> twin). */\n` +
    `export const TWIN_OF: Record<string, string> = ${record(TWIN_OF)};\n\n` +
    `/** Operations a hand-written macro replaces outright (operation -> macro). */\n` +
    `export const MACRO_COVERED: Record<string, string> = ${record(MACRO_COVERED)};\n`
  );
}

function main(): void {
  const rows = readRows();
  validate(rows);
  const { profiles, profileless } = build(rows);

  writeFileSync(resolve(ROOT, 'src/generated/profiles-data.ts'), emit(profiles, profileless));

  const named = profiles.reduce((n, p) => n + p.subProfiles.filter((s) => s.name).length, 0);
  const report = [
    `Profiles:       ${profiles.length}`,
    `Sub-profiles:   ${named} named, ` +
      `${profiles.filter((p) => p.subProfiles.length === 1 && !p.subProfiles[0].name).length} profiles without`,
    `Rows:           ${rows.length} (${profileless.length} profile-less; ` +
      `${Object.keys(TWIN_OF).length} operations dropped for a twin, ` +
      `${Object.keys(MACRO_COVERED).length} covered by a macro)`,
    '',
    ...profiles.map((p) => {
      // Union, not sum: a tool may sit in several sub-profiles on purpose, and
      // the server loads it once. Adding the rows up would report a size no
      // profile actually has.
      const tools = new Set(p.subProfiles.flatMap((s) => [...s.operations, ...s.manualTools])).size;
      const subs = p.subProfiles.filter((s) => s.name).length;
      return `  ${p.name.padEnd(18)} ${String(tools).padStart(4)} tools` +
        (subs ? `  ${subs} sub-profiles` : '');
    }),
  ].join('\n');
  console.log(report);
}

main();
