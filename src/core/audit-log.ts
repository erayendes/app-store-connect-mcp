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

/**
 * Names, ids, codes, numbers and flags: what says which thing a write touched.
 * Free text, URLs and request bodies are left out rather than masked — three
 * review rounds each found a new way a secret hid in one (a query parameter,
 * a URL's user info, JSON sent as text).
 */
const PLAIN = /^[\w.@:+-]{1,100}$/;
const plain = (v: unknown): boolean => typeof v === 'number' || typeof v === 'boolean' || (typeof v === 'string' && PLAIN.test(v));

/** A JSON:API body as what it touches: the resource type, its id and the fields it sets. */
function bodyShape(body: unknown): unknown {
  const data = (body as { data?: unknown })?.data;
  if (!data || typeof data !== 'object' || Array.isArray(data)) return '[body not recorded]';
  const d = data as { type?: unknown; id?: unknown; attributes?: object; relationships?: object };
  return {
    ...(plain(d.type) ? { type: d.type } : {}),
    ...(plain(d.id) ? { id: d.id } : {}),
    fields: [...Object.keys(d.attributes ?? {}), ...Object.keys(d.relationships ?? {})],
  };
}

export function auditArgs(args: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(args).map(([k, v]) => [
      k,
      SECRET_KEY.test(k) && v !== null ? '[masked]'
        : plain(v) || v === null ? v
        : k === 'body' && typeof v === 'object' ? bodyShape(v)
        : Array.isArray(v) && v.length <= 50 && v.every(plain) ? v
        : Array.isArray(v) ? `[${v.length} items not recorded]`
        : '[not recorded]',
    ])
  );
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

/**
 * An error message can quote what it was given: a URL, or a value a validator
 * refused. Quoted values and URLs are dropped, like the arguments are.
 */
const maskText = (text?: string) =>
  text === undefined ? text : maskUrls(text).replace(/"[^"]*"|“[^”]*”/g, '"…"').replace(/\b\w+:\/\/\S+/g, '<url>').slice(0, 500);

export function logWrite(entry: AuditEntry, env: NodeJS.ProcessEnv = process.env): void {
  append('audit.jsonl', { ...entry, args: auditArgs(entry.args), error: maskText(entry.error) }, env);
}

export function logFailure(entry: FailureEntry, env: NodeJS.ProcessEnv = process.env): void {
  append('failures.jsonl', { ...entry, error: maskText(entry.error) }, env);
}
