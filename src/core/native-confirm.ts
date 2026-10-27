/**
 * The confirmation prompt for clients that cannot show one.
 *
 * MCP elicitation is the right channel: the server asks the person, and the
 * agent cannot answer for them. Some clients never declared it (the Claude
 * desktop app's Code tab is the one that prompted this), and there a
 * high-risk write used to be refused outright, even after the user said yes
 * in chat. A yes in chat is not something this server can see, and anything
 * the agent passes through it — a code word included — the agent can also
 * make up.
 *
 * On macOS the server can open a dialog of its own. The agent does not see it
 * and cannot click it; the person at the screen does. So this is the same
 * question elicitation would have asked, on a channel the agent is not on.
 * Elsewhere, or when the dialog cannot be shown (no GUI session, osascript
 * missing), the answer is `unavailable` and the caller keeps failing closed.
 */
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { TERRITORY_NAMES } from './territory-names.js';

export type NativeAnswer = 'approved' | 'cancelled' | 'unavailable';

/**
 * Clients that declare elicitation forms but cannot be trusted to show them.
 * Claude Code (2.1.310) declares `elicitation.form`, and its desktop Code tab
 * declined every form unseen in the 3.0 beta acceptance run (2026-10-27): each
 * risky write came back refused with no prompt on screen. On macOS these
 * clients get the dialog; elsewhere they keep the form.
 */
export const DIALOG_FIRST_CLIENTS: ReadonlySet<string> = new Set(['claude-code']);

/** An alert grows with its text; past this the buttons leave the screen. */
const MAX_BODY = 1500;
export const nativeConfirmFits = (text: DialogText): boolean => text.body.length <= MAX_BODY;

// The same path from src/core (tsx) and dist/core (published), shipped via
// package.json "files". If it is missing the alert shows its default icon.
const ICON = fileURLToPath(new URL('../../assets/brand/heimdall-icon-rounded-256.png', import.meta.url));

// NSAlert through JXA rather than AppleScript's display dialog: it takes a
// custom icon and a bold question, and looks like every other macOS alert.
// Return allows, Escape refuses. No time limit: it stays until answered, or
// until the tool call is cancelled (below). The text arrives as arguments,
// never spliced into the script, so a quote in an app name stays text.
const SCRIPT = `ObjC.import('AppKit');
function run(argv) {
  const app = $.NSApplication.sharedApplication;
  app.setActivationPolicy($.NSApplicationActivationPolicyAccessory);
  const alert = $.NSAlert.alloc.init;
  alert.messageText = argv[0];
  alert.informativeText = argv[1];
  alert.addButtonWithTitle(argv[3]);
  alert.addButtonWithTitle(argv[4]).keyEquivalent = '\\u001b';
  const icon = $.NSImage.alloc.initWithContentsOfFile(argv[2]);
  if (!icon.isNil()) alert.icon = icon;
  alert.layout;
  // Opaque, so the text does not compete with whatever is behind it.
  const win = alert.window;
  win.opaque = true;
  win.backgroundColor = $.NSColor.windowBackgroundColor;
  const settle = (v) => {
    if (v.isKindOfClass($.NSVisualEffectView)) { v.material = $.NSVisualEffectMaterialWindowBackground; v.state = $.NSVisualEffectStateActive; }
    const subs = v.subviews;
    for (let i = 0; i < subs.count; i++) settle(subs.objectAtIndex(i));
  };
  settle(win.contentView.superview);
  app.activateIgnoringOtherApps(true);
  return alert.runModal === $.NSAlertFirstButtonReturn ? 'approved' : 'cancelled';
}`;

export interface DialogText {
  /** The bold line: the question itself. */
  title: string;
  body: string;
  /** The approving button, named for what it does ("Remove"); Allow when no verb fits. */
  action?: string;
}

// A button named Cancel next to a Cancel button would say nothing, so that verb stays Allow.
const BUTTON_VERBS = /^(Activate|Add|Answer|Apply|Archive|Assign|Change|Create|Deactivate|Delete|End|Expire|Extend|Finish|Give|Invite|Link|Mark|Pause|Place|Post|Register|Release|Remove|Rename|Reorder|Replace|Request|Resume|Revoke|Send|Set|Start|Stop|Submit|Turn|Unlink|Update|Upload|Withdraw)\b/;
export const actionFor = (title: string): string | undefined =>
  /^Set up\b/.test(title) ? 'Create' : BUTTON_VERBS.exec(title)?.[1];

/** `whatsNew` → "What’s new", `start_date` → "Start date". */
const humanize = (key: string): string => {
  const words = key === 'whatsNew' ? 'what’s new' : key.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().replace(/\b(id|url)\b/g, (w) => w.toUpperCase());
  return words.charAt(0).toUpperCase() + words.slice(1);
};

const COUNT: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5, SIX: 6, SEVEN: 7, EIGHT: 8, NINE: 9, TEN: 10, ELEVEN: 11, TWELVE: 12, FOURTEEN: 14 };
const TOKEN: Record<string, string> = { ICLOUD: 'iCloud', IOS: 'iOS', MAC: 'Mac', MAC_OS: 'macOS', TV_OS: 'tvOS', VISION_OS: 'visionOS', WATCH_OS: 'watchOS', APP: 'app', ID: 'ID', IAP: 'IAP', URL: 'URL' };

/** `ONE_MONTH` → "1 month", `MAC_OS` → "macOS", `PAY_AS_YOU_GO` → "Pay as you go", `TUR` → "Türkiye". */
export function plainEnum(raw: string): string {
  if (TERRITORY_NAMES[raw]) return TERRITORY_NAMES[raw];
  const span = /^([A-Z]+)_(DAY|WEEK|MONTH|YEAR|HOUR)S?$/.exec(raw);
  if (span && COUNT[span[1]]) return `${COUNT[span[1]]} ${span[2].toLowerCase()}${COUNT[span[1]] > 1 ? 's' : ''}`;
  if (TOKEN[raw]) return TOKEN[raw];
  const words = raw.replace(/(MAC|TV|VISION|WATCH)_OS/g, (m) => TOKEN[m]).split('_').map((w) => TOKEN[w] ?? (/[a-z]/.test(w) ? w : w.toLowerCase()));
  // "iOS" and "macOS" keep their own capitals at the start.
  if (!/[A-Z]/.test(words[0])) words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ');
}

/** "A", "A and B", "A, B and 3 more". */
export const listWords = (items: string[], max = 4): string =>
  items.length <= 1 ? items.join('') : items.length <= max
    ? `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`
    : `${items.slice(0, max - 1).join(', ')} and ${items.length - max + 1} more`;

const ENUM = /^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$/;
/** A value from the form preview, as a person would say it. */
function showValue(raw: string): string {
  if (raw === 'true') return 'Yes';
  if (raw === 'false') return 'No';
  let value: unknown = raw;
  // A list of objects arrives cut to a hundred characters; half a JSON object says nothing.
  if (raw.startsWith('[{')) return 'see the full request';
  if (/^["[]/.test(raw)) {
    try { value = JSON.parse(raw); } catch { return raw; }
  }
  if (Array.isArray(value) && value.every((v) => typeof v === 'string')) return listWords(value.map((v) => (ENUM.test(v) ? plainEnum(v) : v)));
  if (typeof value !== 'string') return raw;
  return ENUM.test(value) ? plainEnum(value) : value;
}
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Base64 price points, UUIDs and other opaque ids tell a person nothing.
const opaque = (id: string): boolean => id.length > 40 || UUID.test(id);

/** One "Changes" line from the form preview, said in words, or nothing when it is plumbing. */
function changeLine(line: string): string | undefined {
  const m = /^([\w.]+) (=|→) (.*)$/.exec(line);
  if (!m) {
    // A macro's flat argument: `key: value`.
    const flat = /^(\w+): (.*)$/.exec(line);
    return flat ? `${humanize(flat[1])}: ${showValue(flat[2])}` : line;
  }
  const segments = m[1].split('.').filter((s) => !['data', 'attributes', 'relationships'].includes(s));
  const key = segments.at(-1);
  // Ids and per-player plumbing Apple needs and a person cannot check.
  if (!key || ['type', 'id', 'scopedPlayerId', 'vendorIdentifier', 'challengeIds'].includes(key)) return undefined;
  // A JSON string may hold " — " itself; the note comes after it.
  const [, value, note] = /^("(?:[^"\\]|\\.)*"|\[.*?\] \(\d+\)|\[.*\]|\S+)(?: — (.*))?$/.exec(m[3]) ?? [, m[3]];
  if (m[2] === '=') return `${humanize(key)}: ${showValue(value)}${note ? ` — ${note}` : ''}`;
  const count = /^\[.*\] \((\d+)\)$/.exec(value)?.[1];
  if (count) return `${humanize(key)}: ${count} ${count === '1' ? 'item' : 'items'}`;
  const label = note && /^".*"$/.test(note) ? JSON.parse(note) : undefined;
  const [type, id = value] = value.split('/');
  // A relationship list arrives one entry per line, keyed 0, 1, 2…; dialogText joins them.
  if (/^\d+$/.test(key)) return label || !opaque(id) ? `\u0000${humanize(type)}\u0000${label ?? id}` : undefined;
  return label ? `${humanize(key)}: ${label}` : opaque(id) ? undefined : `${humanize(key)}: ${TERRITORY_NAMES[id] ?? id}`;
}

/** `id = 123 (Gold Pack)` → "Gold Pack"; an opaque id with no name says nothing and is left out. */
const targetNames = (value: string): string[] =>
  value.split(/, (?=\w+ = )/).flatMap((part) => {
    const m = /^\w+ = (\S+)(?: \((.*)\))?$/.exec(part);
    if (!m) return [part];
    return m[2] ? [m[2]] : opaque(m[1]) ? [] : [m[1]];
  });

/** The tool's summary as a question, about the named thing when there is one. */
function titleFrom(what: string, name?: string): string {
  let title = what.split(/: /)[0].replace(/\s*\(v\d+\)/g, '');
  // A long summary reads as a manual; its first clause is the question.
  if (title.length > 70) title = title.split(/, | so | by /)[0];
  title = title.replace(/[\s.,;:?]+$/, '');
  // Generated summaries say "a sandbox testers" for the resource's plural name.
  title = title.replace(/^(\w+) (an?) (.+)$/, (_, verb: string, article: string, noun: string) => {
    const one = noun.replace(/(\w*[^s])s$/, '$1');
    // A plain noun takes the name; "a tester from your account entirely" would bury it.
    const plain = one.split(' ').length <= 4 && !/\b(from|to|of|in|for|with|on|by|before|after|entirely)\b/.test(one);
    return name && plain ? `${verb} the ${one} "${name}"` : `${verb} ${article} ${one}`;
  });
  return `${title}?`;
}

/**
 * The alert's text, from the elicitation preview.
 *
 * That preview is written for a form inside the client: it opens with the
 * tool name, lists the HTTP operation, the key id and the request body field
 * by field, and ends by asking for CONFIRM. In an alert of its own the person
 * needs what will happen, to what, and what cannot be undone, in words.
 * `what` is the tool's own one-line summary, or a question already worded for
 * this write (it ends in "?").
 */
export function dialogText(what: string | undefined, preview: string): DialogText {
  const details: string[] = [];
  const warnings: string[] = [];
  const lists = new Map<string, string[]>();
  const seen = new Set<string>();
  let target: string[] = [];
  for (const line of preview.split('\n').slice(1)) {
    const t = line.trim();
    if (!t || t === 'Changes:' || /^(Operation|Account):/.test(t) || /Type CONFIRM|^Confirm to proceed/.test(t)) continue;
    if (t.startsWith('Risk:')) {
      warnings.push(t.split(' — ').slice(1).join(' — '));
      continue;
    }
    if (t.startsWith('Target:')) {
      target = targetNames(t.replace(/^Target:\s+/, ''));
      continue;
    }
    // The count only repeats a list the body already shows.
    if (t.startsWith('Territories in request:')) continue;
    const said = changeLine(t.replace(/^(App|Product|Price):\s+/, '$1: '));
    if (!said) continue;
    if (said.startsWith('\u0000')) {
      const [, type, item] = said.split('\u0000');
      lists.set(type, [...(lists.get(type) ?? []), item]);
      continue;
    }
    // The same name under two keys ("Product", "Subscription") is one fact.
    const value = said.replace(/^[^:]+:\s+/, '');
    if (seen.has(value)) continue;
    seen.add(value);
    details.push(said);
  }
  for (const [type, items] of lists) details.push(`${type}: ${listWords(items, 6)}`);
  const named = what && !what.endsWith('?') && target.length === 1 ? target[0] : undefined;
  const title = what?.endsWith('?') ? what : what ? titleFrom(what, named) : 'Allow this change in App Store Connect?';
  // Named in the question itself, the target needs no line of its own.
  if (target.length && !(named && title.includes(`"${named}"`))) details.unshift(`Target: ${target.join(', ')}`);
  return { title, body: [...details, ...(warnings.length ? ['', ...warnings] : [])].join('\n'), action: actionFor(title) };
}

/** Whether an alert can be tried at all; checked before the preview's lookups are spent. */
export const nativeConfirmAvailable = (): boolean => process.platform === 'darwin';

export function nativeConfirm(text: DialogText, signal?: AbortSignal): Promise<NativeAnswer> {
  if (!nativeConfirmAvailable()) return Promise.resolve('unavailable');
  if (!nativeConfirmFits(text)) return Promise.resolve('unavailable');
  const body = text.body;
  return new Promise((resolve) => {
    // A cancelled tool call takes its alert with it, so a late click cannot
    // run a write the agent was already told failed.
    const buttons = text.action ? [text.action, 'Cancel'] : ['Allow', 'Don’t Allow'];
    execFile('osascript', ['-l', 'JavaScript', '-e', SCRIPT, text.title, body, ICON, ...buttons], { signal }, (error, stdout) => {
      if (!error) return resolve(stdout.trim() === 'approved' ? 'approved' : 'cancelled');
      resolve(signal?.aborted ? 'cancelled' : 'unavailable');
    });
  });
}
