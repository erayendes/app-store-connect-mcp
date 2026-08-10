/**
 * Installs the `heimdall` skill alongside the MCP server registration.
 *
 * The skill exists because of a gap nothing in the server can close: before it
 * is registered there is no server, so the one thing an agent most needs to
 * know first — that the API key is minted inside the process and cannot be
 * found in a shell, and that `setup` belongs to the user — has no channel. A
 * checkout would carry AGENTS.md, but Heimdall runs through `npx` and there is
 * no checkout.
 *
 * So `register` writes the document to disk next to the config it is already
 * writing. No new mechanism, no separate install step, and the same command
 * removes it.
 *
 * Only for clients that actually read SKILL.md. Writing it into a Cursor or
 * VS Code config directory would leave a file nothing loads, and a file nothing
 * loads is worse than no file: it looks like the feature is present.
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

/** Where each client looks for user-level skills; absent means it has none. */
const SKILL_DIRS: Record<string, string> = {
  claude: join('.claude', 'skills'),
  codex: join('.codex', 'skills'),
};

const SKILL_NAME = 'heimdall';

export const clientTakesSkill = (clientId: string): boolean => clientId in SKILL_DIRS;

/** The installed path for one client, or undefined if it reads no skills. */
export function skillPathFor(clientId: string, home = homedir()): string | undefined {
  const dir = SKILL_DIRS[clientId];
  return dir ? join(home, dir, SKILL_NAME, 'SKILL.md') : undefined;
}

/**
 * The packaged SKILL.md. Resolved from this module rather than the working
 * directory, because `register` runs through `npx` from wherever the user
 * happens to be standing.
 */
function source(): string | undefined {
  const here = dirname(fileURLToPath(import.meta.url));
  // dist/skill.js -> ../skills/... when published; src/skill.ts -> the same
  // path in a checkout.
  for (const candidate of [
    join(here, '..', 'skills', SKILL_NAME, 'SKILL.md'),
    join(here, '..', '..', 'skills', SKILL_NAME, 'SKILL.md'),
  ]) {
    if (existsSync(candidate)) return readFileSync(candidate, 'utf8');
  }
  return undefined;
}

export interface SkillResult {
  ok: boolean;
  message: string;
}

/**
 * Writes the skill for one client. Overwrites: the packaged copy is the
 * current one, and a stale skill describing an older tool set is a liability
 * rather than a courtesy.
 *
 * Never throws. A skill is an improvement to a registration that has already
 * succeeded, so a read-only home directory should cost the user a line of
 * output, not their MCP setup.
 */
export function installSkill(clientId: string, home = homedir()): SkillResult | undefined {
  const target = skillPathFor(clientId, home);
  if (!target) return undefined;

  const text = source();
  if (!text) {
    return { ok: false, message: `skill not found in this package — skipped for ${clientId}` };
  }
  try {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, text, 'utf8');
    return { ok: true, message: `installed the heimdall skill (${target})` };
  } catch (err) {
    return { ok: false, message: `could not write ${target}: ${(err as Error).message}` };
  }
}

/** Removes it again, for unregistration. Missing is success, not an error. */
export function removeSkill(clientId: string, home = homedir()): SkillResult | undefined {
  const target = skillPathFor(clientId, home);
  if (!target) return undefined;
  try {
    if (!existsSync(target)) return undefined;
    rmSync(dirname(target), { recursive: true, force: true });
    return { ok: true, message: `removed the heimdall skill (${target})` };
  } catch (err) {
    return { ok: false, message: `could not remove ${target}: ${(err as Error).message}` };
  }
}
