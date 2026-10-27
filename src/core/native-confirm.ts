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
const BUTTON_VERBS = /^(Add|Apply|Archive|Assign|Create|Delete|Extend|Invite|Place|Release|Remove|Rename|Reorder|Replace|Request|Revoke|Send|Set|Submit|Update|Upload)\b/;
export const actionFor = (title: string): string | undefined => BUTTON_VERBS.exec(title)?.[1];

/** `whatsNew` → "What’s new", `start_date` → "Start date". */
const humanize = (key: string): string => {
  const words = key === 'whatsNew' ? 'what’s new' : key.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
};
const showValue = (raw: string): string => (raw === 'true' ? 'Yes' : raw === 'false' ? 'No' : /^".*"$/.test(raw) ? JSON.parse(raw) : raw);
// Base64 price points and other opaque ids tell a person nothing.
const opaque = (id: string): boolean => id.length > 40;

/** One "Changes" line from the form preview, said in words, or nothing when it is plumbing. */
function changeLine(line: string): string | undefined {
  const m = /^([\w.]+) (=|→) (.*)$/.exec(line);
  if (!m) return line;
  const segments = m[1].split('.').filter((s) => !['data', 'attributes', 'relationships'].includes(s));
  const key = segments.at(-1);
  if (!key || key === 'type' || key === 'id') return undefined;
  // A JSON string may hold " — " itself; the note comes after it.
  const [, value, note] = /^("(?:[^"\\]|\\.)*"|\[.*?\] \(\d+\)|\S+)(?: — (.*))?$/.exec(m[3]) ?? [, m[3]];
  if (m[2] === '=') return `${humanize(key)}: ${showValue(value)}${note ? ` — ${note}` : ''}`;
  const count = /^\[.*\] \((\d+)\)$/.exec(value)?.[1];
  if (count) return `${humanize(key)}: ${count} ${count === '1' ? 'item' : 'items'}`;
  const label = note && /^".*"$/.test(note) ? JSON.parse(note) : undefined;
  const id = value.split('/').at(-1) ?? value;
  return label ? `${humanize(key)}: ${label}` : opaque(id) ? undefined : `${humanize(key)}: ${id}`;
}

/** `id = 123 (Gold Pack)` → "Gold Pack"; an id with no name stays, or the target would be blank. */
const targetLine = (value: string): string =>
  value.split(/, (?=\w+ = )/).map((part) => /^\w+ = (\S+)(?: \((.*)\))?$/.exec(part)?.slice(1).reverse().find(Boolean) ?? part).join(', ');

/**
 * The alert's text, from the elicitation preview.
 *
 * That preview is written for a form inside the client: it opens with the
 * tool name, lists the HTTP operation, the key id and the request body field
 * by field, and ends by asking for CONFIRM. In an alert of its own the person
 * needs what will happen, to what, and what cannot be undone, in words.
 * `what` is the tool's own one-line summary.
 */
export function dialogText(what: string | undefined, preview: string): DialogText {
  const details: string[] = [];
  const warnings: string[] = [];
  for (const line of preview.split('\n').slice(1)) {
    const t = line.trim();
    if (!t || t === 'Changes:' || /^(Operation|Account):/.test(t) || /Type CONFIRM|^Confirm to proceed/.test(t)) continue;
    if (t.startsWith('Risk:')) warnings.push(t.split(' — ').slice(1).join(' — '));
    else if (t.startsWith('Target:')) details.push(`Target: ${targetLine(t.replace(/^Target:\s+/, ''))}`);
    else {
      const said = changeLine(t);
      if (said) details.push(said.replace(/^(\w[\w ]*):\s+/, (_, key: string) => `${humanize(key)}: `));
    }
  }
  const title = what ? `${what.split(/: /)[0].replace(/\.$/, '')}?` : 'Allow this change in App Store Connect?';
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
