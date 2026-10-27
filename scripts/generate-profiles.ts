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
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OPERATIONS } from '../src/generated/operations.js';
import { MANUAL_MARKER, PROFILELESS_MARKER, TWIN_OF, readRows, type Row } from './profile-sheet.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');




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
  "app_event_localizations.placements.list": "media__list",
  "app_clip_header_images.create": "media__upload",
  "app_clip_advanced_experience_images.create": "media__upload",
  "game_center_achievement_images_v2.create": "media__upload",
  "game_center_leaderboard_images_v2.create": "media__upload",
  "game_center_leaderboard_set_images_v2.create": "media__upload",
  "game_center_activity_images.create": "media__upload",
  "game_center_challenge_images.create": "media__upload",
  "in_app_purchase_images_v2.create": "media__upload",
  "in_app_purchase_app_store_review_screenshots.create": "media__upload",
  "subscription_images_v2.create": "media__upload",
  "subscription_app_store_review_screenshots.create": "media__upload",
  "app_encryption_declaration_documents.create": "media__upload",
  "app_store_review_attachments.create": "media__upload",
  "routing_app_coverages.create": "media__upload",
  "background_asset_upload_files.create": "media__upload",
  "build_upload_files.create": "media__upload",
  "app_clip_header_images.delete": "media__delete",
  "game_center_achievement_images_v2.delete": "media__delete",
  "game_center_leaderboard_images_v2.delete": "media__delete",
  "game_center_leaderboard_set_images_v2.delete": "media__delete",
  "game_center_activity_images.delete": "media__delete",
  "game_center_challenge_images.delete": "media__delete",
  "in_app_purchase_images_v2.delete": "media__delete",
  "in_app_purchase_app_store_review_screenshots.delete": "media__delete",
  "subscription_images_v2.delete": "media__delete",
  "subscription_app_store_review_screenshots.delete": "media__delete",
  "app_store_review_attachments.delete": "media__delete",
  "routing_app_coverages.delete": "media__delete",
  "build_uploads.create": "media__upload",
  "build_uploads.delete": "media__delete",
  "game_center_achievement_images_v2.update": "media__upload",
  "game_center_leaderboard_images_v2.update": "media__upload",
  "game_center_leaderboard_set_images_v2.update": "media__upload",
  "game_center_activity_images.update": "media__upload",
  "game_center_challenge_images.update": "media__upload",
  "in_app_purchase_images_v2.update": "media__upload",
  "subscription_images_v2.update": "media__upload",
  "app_clip_header_images.update": "media__upload",
  "app_clip_advanced_experience_images.update": "media__upload",
  "routing_app_coverages.update": "media__upload",
  "game_center_activity_versions.default_image.get": "media__list",
  "game_center_challenge_versions.default_image.get": "media__list",
  "app_clip_header_images.get": "media__list",
  "app_clip_default_experience_localizations.app_clip_header_image.get": "media__list",
  "app_clip_advanced_experience_images.get": "media__list",
  "game_center_achievement_images_v2.get": "media__list",
  "game_center_achievement_localizations_v2.image.get": "media__list",
  "game_center_leaderboard_images_v2.get": "media__list",
  "game_center_leaderboard_localizations_v2.image.get": "media__list",
  "game_center_leaderboard_set_images_v2.get": "media__list",
  "game_center_leaderboard_set_localizations_v2.image.get": "media__list",
  "game_center_activity_images.get": "media__list",
  "game_center_activity_localizations.image.get": "media__list",
  "game_center_challenge_images.get": "media__list",
  "game_center_challenge_localizations.image.get": "media__list",
  "in_app_purchase_images_v2.get": "media__list",
  "in_app_purchase_versions.images.list": "media__list",
  "in_app_purchase_app_store_review_screenshots.get": "media__list",
  "in_app_purchases_v2.app_store_review_screenshot.get": "media__list",
  "subscription_images_v2.get": "media__list",
  "subscription_versions.images.list": "media__list",
  "subscription_app_store_review_screenshots.get": "media__list",
  "subscriptions.app_store_review_screenshot.get": "media__list",
  "app_encryption_declaration_documents.get": "media__list",
  "app_encryption_declarations.app_encryption_declaration_document.get": "media__list",
  "app_store_review_attachments.get": "media__list",
  "app_store_review_details.app_store_review_attachments.list": "media__list",
  "routing_app_coverages.get": "media__list",
  "app_store_versions.routing_app_coverage.get": "media__list",
  "background_asset_upload_files.get": "media__list",
  "background_asset_versions.background_asset_upload_files.list": "media__list",
  "build_upload_files.get": "media__list",
  "build_uploads.build_upload_files.list": "media__list"
};

/** Hand-written tools live in these families; anything else is a typo. */
const MANUAL_PREFIXES = ['asc__', 'reviews_ai__', 'storekit__', 'pricing__', 'listing__', 'media__', 'analytics__', 'ci__', 'preflight__', 'metadata_ai__', 'release__', 'testflight__'];




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
    } else if (row.profile !== PROFILELESS_MARKER && !byName.has(row.operation)) {
      // Deprecated operations are left out of the build too (scripts/generate.ts).
      problems.push(`${where}: operation "${row.operation}" is not in the build: not in the spec, or deprecated.`);
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

function build(rows: Row[]): ProfileData[] {
  const profiles = new Map<string, Map<string, SubProfileData>>();

  for (const row of rows) {
    if (row.profile === PROFILELESS_MARKER) continue;
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

  return [...profiles.entries()]
      .map(([name, subs]) => ({
        name,
        // Alphabetical, not sheet order: the CSV's row order is an artifact of
        // how it was edited, and it decides what the picker looks like. Sorting
        // also keeps families together — every iap-* next to the others.
        subProfiles: [...subs.values()].sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
}

function emit(profiles: ProfileData[]): string {
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
    `/** Operations a hand-written macro replaces outright (operation -> macro). */\n` +
    `export const MACRO_COVERED: Record<string, string> = ${record(MACRO_COVERED)};\n`
  );
}

function main(): void {
  const rows = readRows();
  validate(rows);
  const profiles = build(rows);
  const profileless = rows.filter((r) => r.profile === PROFILELESS_MARKER);

  writeFileSync(resolve(ROOT, 'src/generated/profiles-data.ts'), emit(profiles));

  const named = profiles.reduce((n, p) => n + p.subProfiles.filter((s) => s.name).length, 0);
  const report = [
    `Profiles:       ${profiles.length}`,
    `Sub-profiles:   ${named} named, ` +
      `${profiles.filter((p) => p.subProfiles.length === 1 && !p.subProfiles[0].name).length} profiles without`,
    `Rows:           ${rows.length} (${profileless.length} profile-less and ` +
      `${Object.keys(TWIN_OF).length} twins left out of the build, ` +
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
