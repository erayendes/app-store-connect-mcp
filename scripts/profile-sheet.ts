/**
 * The profile sheet (`spec/profiles.csv`) and the operations it drops, shared by
 * both generators: generate.ts leaves the dropped ones out of the build, and
 * generate-profiles.ts turns the rest into profile membership.
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Rows whose tool is written by hand rather than generated from Apple's spec. */
export const MANUAL_MARKER = '(elle yazılmış)';

/**
 * The profile column for an operation that belongs to no profile. These are
 * reverse reads (`beta_groups.app.get`: which app owns this group) that no
 * workflow needs, because every profile reaches the same resource from the app
 * side. They are left out of the build (scripts/generate.ts).
 */
export const PROFILELESS_MARKER = '(profilsiz)';

/**
 * Apple exposes most to-many relationships from both ends:
 * `/v1/betaGroups/{id}/relationships/betaTesters` and
 * `/v1/betaTesters/{id}/relationships/betaGroups` make the same link. Loading
 * both is two tools a model has to tell apart for one action, so the sheet
 * keeps one direction and drops the other. This is the record of which one was
 * dropped and what it was dropped in favour of — operation -> its twin.
 *
 * Left out of the build. generate.ts checks both ends exist in the spec;
 * generate-profiles.ts checks the twin is in a profile, so dropping one side
 * can never drop the action.
 */
export const TWIN_OF: Record<string, string> = {
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

export interface Row {
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

export function readRows(): Row[] {
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

/** Operations the sheet keeps out of every server: profile-less rows and dropped twins. */
export function droppedOperations(): Set<string> {
  return new Set([
    ...readRows().filter((r) => r.profile === PROFILELESS_MARKER).map((r) => r.operation),
    ...Object.keys(TWIN_OF),
  ]);
}
