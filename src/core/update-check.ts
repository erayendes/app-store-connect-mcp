/**
 * Whether a newer Heimdall is out on this install's channel.
 *
 * There is nothing to install: npx (npm 10 and later, so every supported
 * Node) checks a name-only or tagged spec online each time a client starts
 * the server, and runs the newest one. All a user needs is to hear that a
 * restart is worth it. So npm is asked at most once a day, in the background,
 * and the answer waits on disk for the first tool call of the next day.
 */
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { stateDir } from './shared-config.js';

const DAY_MS = 86_400_000;
const DIST_TAGS_URL = 'https://registry.npmjs.org/-/package/@erayendes/asc-mcp/dist-tags';

export type Channel = 'latest' | 'beta';
interface State { checkedAt?: number; tags?: Record<string, string>; noticeOn?: string }

const statePath = (env: NodeJS.ProcessEnv) => join(stateDir(env), 'update-check.json');
const off = (env: NodeJS.ProcessEnv) => env.ASC_NO_UPDATE_CHECK === '1';

function readState(env: NodeJS.ProcessEnv): State {
  try { return JSON.parse(readFileSync(statePath(env), 'utf8')) as State; } catch { return {}; }
}
function writeState(state: State, env: NodeJS.ProcessEnv): void {
  try {
    mkdirSync(dirname(statePath(env)), { recursive: true });
    writeFileSync(statePath(env), JSON.stringify(state));
  } catch { /* A read-only home only costs the notice. */ }
}

/**
 * The channel this copy follows, which only the npx install directory still
 * knows: `@beta` follows beta (every stable release is tagged beta too), a
 * pinned version follows nothing — a plug-in, updated by its own store, where
 * a restart changes nothing — and anything else follows latest.
 */
export function installChannel(version: string, npxManifest = join(fileURLToPath(import.meta.url), '../../../../../../package.json')): Channel | undefined {
  try {
    const packages: unknown = JSON.parse(readFileSync(npxManifest, 'utf8'))?._npx?.packages;
    if (Array.isArray(packages)) {
      if (packages.some((p) => /@erayendes\/asc-mcp@\d/.test(String(p)))) return undefined;
      if (packages.some((p) => String(p).endsWith('@beta'))) return 'beta';
    }
  } catch { /* Not an npx install. */ }
  return version.includes('-') ? 'beta' : 'latest';
}

/** Semver order, prereleases below their release: 3.2.0-beta.2 < 3.2.0 < 3.2.1. */
export function compareVersions(a: string, b: string): number {
  const [coreA, preA] = a.split('-', 2), [coreB, preB] = b.split('-', 2);
  const nums = (s: string) => s.split('.').map(Number);
  const [x, y] = [nums(coreA), nums(coreB)];
  for (let i = 0; i < 3; i++) if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) - (y[i] ?? 0);
  if (!preA || !preB) return preA ? -1 : preB ? 1 : 0;
  const [p, q] = [preA.split('.'), preB.split('.')];
  for (let i = 0; i < Math.max(p.length, q.length); i++) {
    if (p[i] === undefined) return -1;
    if (q[i] === undefined) return 1;
    const [m, n] = [Number(p[i]), Number(q[i])];
    const diff = Number.isNaN(m) || Number.isNaN(n) ? p[i].localeCompare(q[i]) : m - n;
    if (diff) return diff;
  }
  return 0;
}

export type Prefetch = (version: string) => Promise<boolean>;

/**
 * Put a release and its dependencies in npm's cache by running it once through
 * npm exec, so an entry started with `--prefer-offline` moves to it on the
 * next start without a network. npm exec rather than npm install: only its
 * packument lands where npx looks. Its own npx directory is removed after.
 */
export const prefetchRelease: Prefetch = async (version) => {
  const spec = `@erayendes/asc-mcp@${version}`;
  const npmCli = process.env.npm_execpath;
  const [cmd, pre] = npmCli ? [process.execPath, [npmCli]] : ['npm', []];
  try {
    await promisify(execFile)(cmd, [...pre, 'exec', '--yes', '--no-audit', `--package=${spec}`, '--', 'node', '-e', '0'], { timeout: 180_000 });
  } catch {
    return false;
  }
  const cache = process.env.npm_config_cache || join(homedir(), '.npm');
  const dir = createHash('sha512').update(spec).digest('hex').slice(0, 16);
  rmSync(join(cache, '_npx', dir), { recursive: true, force: true });
  return true;
};

/**
 * Ask npm for the dist-tags unless today's answer is on disk; never throws,
 * never holds up a start. A newer release on this channel is fetched into the
 * cache first and only recorded once it is there, so the note to restart is
 * never ahead of what a restart would start.
 */
export async function refreshDistTags(
  current: string, channel: Channel | undefined, env: NodeJS.ProcessEnv = process.env, now = Date.now(),
  fetchImpl: typeof fetch = fetch, prefetch: Prefetch = prefetchRelease,
): Promise<void> {
  if (off(env) || !channel) return;
  const checkedAt = readState(env).checkedAt;
  if (checkedAt && now - checkedAt < DAY_MS) return;
  try {
    const res = await fetchImpl(DIST_TAGS_URL, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return;
    const tags = (await res.json()) as Record<string, string>;
    const next = tags[channel];
    if (next && compareVersions(next, current) > 0 && !(await prefetch(next))) return;
    writeState({ ...readState(env), checkedAt: now, tags }, env);
  } catch { /* Offline or slow: the next start asks again. */ }
}

/** The newer version on this channel, from the last answer on disk. */
export function newerVersion(current: string, channel: Channel | undefined, env: NodeJS.ProcessEnv = process.env): string | undefined {
  if (off(env) || !channel) return undefined;
  const tag = readState(env).tags?.[channel];
  return tag && compareVersions(tag, current) > 0 ? tag : undefined;
}

export const restartAdvice = (current: string, next: string): string =>
  `Heimdall ${next} is out; this is ${current}. Tell the user, in their language: restart your AI app ` +
  `and the new version starts on its own — nothing to install, profiles and key stay as they are.`;

let quietUntil = '';

/**
 * The line for the first tool answer of the day, once across every Heimdall
 * server on the machine: they share the day stamp on disk.
 * shortcut: two servers answering in the same instant can both say it; a lock if anyone notices.
 */
export function dailyUpdateNotice(current: string, channel: Channel | undefined, env: NodeJS.ProcessEnv = process.env, now = new Date()): string | undefined {
  const today = now.toISOString().slice(0, 10);
  if (quietUntil === today) return undefined;
  quietUntil = today;
  const next = newerVersion(current, channel, env);
  const state = readState(env);
  if (!next || state.noticeOn === today) return undefined;
  writeState({ ...state, noticeOn: today }, env);
  return restartAdvice(current, next);
}
