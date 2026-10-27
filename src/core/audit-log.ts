/**
 * Two local logs, one JSON object per line, in the config directory:
 *
 *  - audit.jsonl     every write Heimdall was asked to make and what became of
 *                    it: asked how, approved or not, Apple's answer. "Who
 *                    changed the price yesterday, the agent or me?" had no
 *                    answer before this.
 *  - failures.jsonl  every call Apple refused, with its x-request-id, which is
 *                    what Apple's developer support asks for first.
 *
 * Nothing leaves the machine, and nothing here throws: a full disk must not
 * turn a write that already ran into an error.
 */
import { appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { stateDir } from './shared-config.js';

/** How a write was let through, or why not. */
export type Confirmation = 'typed CONFIRM' | 'checkbox' | 'macOS dialog' | 'not asked' | 'declined' | 'blocked';

export interface AuditEntry {
  tool: string;
  risk: string;
  confirmation: Confirmation;
  outcome: 'ok' | 'error' | 'not run';
  args: Record<string, unknown>;
  error?: string;
  appleRequestId?: string;
}

export interface FailureEntry {
  tool: string;
  status: number;
  appleRequestId?: string;
  error: string;
}

const MAX_ARGS_CHARS = 2000;
/** Keys whose values are credentials or link a purchase to a person: never written. */
const SECRET_KEY = /(key|token|secret|password|credential)s?$/i;

/** A credential carried inside a URL: `?token=…`, `&api_key=…`, `&X-Amz-Signature=…`. */
const SECRET_PARAM = /([?&][\w-]*(?:token|key|secret|sig|signature|password|credential|auth)[\w-]*=)[^&#\s]+/gi;
/** A password in a URL's user info: `https://bot:secret@host/…`. */
const SECRET_USERINFO = /(\b[a-z][a-z0-9+.-]*:\/\/[^/\s:@]+:)[^/\s@]+@/gi;
/** Webhook URLs whose path is the secret (Slack, Discord). */
const SECRET_PATH = /(hooks\.slack\.com\/services\/|discord(?:app)?\.com\/api\/webhooks\/)[^\s"?#]+/gi;

const maskUrls = (s: string) =>
  s.replace(SECRET_USERINFO, '$1[masked]@').replace(SECRET_PARAM, '$1[masked]').replace(SECRET_PATH, '$1[masked]');

function maskValue(k: string, v: unknown): unknown {
  if (k && SECRET_KEY.test(k) && v !== null) return '[masked]';
  if (typeof v !== 'string') return v;
  // A body sent as JSON text carries its secrets inside the string.
  if (/^\s*[[{]/.test(v)) {
    try {
      return JSON.stringify(JSON.parse(v), maskValue);
    } catch {
      return '[unparsed JSON text not recorded]';
    }
  }
  return maskUrls(v);
}

export function maskArgs(args: Record<string, unknown>): Record<string, unknown> {
  const masked = JSON.parse(JSON.stringify(args, maskValue) ?? '{}');
  const text = JSON.stringify(masked);
  return text.length > MAX_ARGS_CHARS ? { truncated: text.slice(0, MAX_ARGS_CHARS) } : masked;
}

function append(file: string, entry: object, env: NodeJS.ProcessEnv): void {
  try {
    const dir = stateDir(env);
    mkdirSync(dir, { recursive: true, mode: 0o700 });
    // The mode applies when the file is created, so it is never readable by others, even briefly.
    appendFileSync(join(dir, file), JSON.stringify({ at: new Date().toISOString(), ...entry }) + '\n', { mode: 0o600 });
  } catch {
    // A log that cannot be written is not a reason to fail the call.
  }
}

/** An error message can quote the URL it failed on. */
const maskText = (text?: string) => (text === undefined ? text : maskUrls(text));

export function logWrite(entry: AuditEntry, env: NodeJS.ProcessEnv = process.env): void {
  append('audit.jsonl', { ...entry, args: maskArgs(entry.args), error: maskText(entry.error) }, env);
}

export function logFailure(entry: FailureEntry, env: NodeJS.ProcessEnv = process.env): void {
  append('failures.jsonl', { ...entry, error: maskText(entry.error) }, env);
}
