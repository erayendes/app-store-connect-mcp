/**
 * Sales and finance reports for a finished period do not change, so a second
 * read of one comes from disk instead of Apple. Only a successful answer for a
 * period that ended more than two weeks ago is kept — enough for Apple's fiscal
 * months, which end after the calendar month does. Anything newer, and every
 * error, goes to Apple each time.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';
import type { Query } from './http.js';
import { stateDir } from './shared-config.js';

const FINAL_AFTER_MS = 14 * 86_400_000;

/** The last day a report date covers: a day, a week starting that day, a month or a year. */
export function periodEnd(reportDate: string, frequency?: string): number | undefined {
  let m: RegExpExecArray | null;
  if ((m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(reportDate))) {
    const day = Date.UTC(+m[1], +m[2] - 1, +m[3]);
    return frequency === 'WEEKLY' ? day + 6 * 86_400_000 : day;
  }
  if ((m = /^(\d{4})-(\d{2})$/.exec(reportDate))) return Date.UTC(+m[1], +m[2], 0);
  if ((m = /^(\d{4})$/.exec(reportDate))) return Date.UTC(+m[1], 11, 31);
  return undefined;
}

function file(account: string, path: string, query: Query, env: NodeJS.ProcessEnv): string | undefined {
  const value = (k: string) => (query[k] === undefined ? undefined : String(query[k]));
  const date = value('filter[reportDate]');
  const end = date ? periodEnd(date, value('filter[frequency]')) : undefined;
  if (end === undefined || Date.now() - end < FINAL_AFTER_MS) return undefined;
  const key = createHash('sha256')
    // The signing key is part of the key: a vendor number alone would let a second
    // account, or a key with a narrower role, read what only the first may see.
    .update(account + path + JSON.stringify(Object.keys(query).sort().map((k) => [k, value(k)])))
    .digest('hex');
  return join(stateDir(env), 'report-cache', `${key}.json`);
}

export function cachedReport(account: string, path: string, query: Query, env: NodeJS.ProcessEnv = process.env): unknown {
  const at = file(account, path, query, env);
  if (!at) return undefined;
  try {
    return JSON.parse(readFileSync(at, 'utf8'));
  } catch {
    return undefined;
  }
}

export function cacheReport(account: string, path: string, query: Query, result: unknown, env: NodeJS.ProcessEnv = process.env): void {
  const at = file(account, path, query, env);
  if (!at || result === undefined) return;
  try {
    // A body that does not unzip is not kept: it would be served as fact next time.
    const blob = (result as { base64?: unknown }).base64;
    if (typeof blob === 'string') gunzipSync(Buffer.from(blob, 'base64'));
    mkdirSync(join(stateDir(env), 'report-cache'), { recursive: true, mode: 0o700 });
    writeFileSync(at, JSON.stringify(result), { mode: 0o600 });
  } catch {
    // A cache that cannot be written only costs the next read a request.
  }
}
