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

// A real NSAlert through JXA, so buttons, type, corners and placement are the
// system's own and it reads as a macOS question, not a window from nowhere: a
// floating panel showed up over every screen and nobody knew what it was. The
// Heimdall icon says who asks; the bold title is the question, the context line
// sits under it, each "Label: value" line lines up in a small grid, a line that
// is not a fact is a dimmer note, and what the change really does closes it in
// bold. Return approves, Escape refuses. No time limit: it stays until
// answered, or until the tool call is cancelled (below). The text arrives as
// arguments, never spliced into the script, so a quote in an app name stays
// text. A sixth argument renders it to a PNG instead of showing it.
const ICON = fileURLToPath(new URL('../../assets/brand/heimdall-icon-rounded-256.png', import.meta.url));
const SCRIPT = String.raw`ObjC.import('AppKit');
// argv: title, body, approve label, refuse label, icon path[, render path]
function run(argv) {
  const [title, body, approve, refuse, iconPath, renderTo] = argv;
  const app = $.NSApplication.sharedApplication;
  app.setActivationPolicy($.NSApplicationActivationPolicyAccessory);

  // The body: detail lines, a blank line, then what the change really does.
  // The last paragraph is the outcome; a body with no details starts with the blank line.
  const parts = body.startsWith('\n') ? ['', body] : body.split('\n\n');
  const outcome = parts.length > 1 ? parts.pop().trim() : '';
  const lines = parts.join('\n').split('\n').filter(Boolean);
  const context = lines.length && lines[0].includes(' · ') ? lines.shift() : '';
  const rows = lines.map((l) => {
    const m = /^([A-Z][^:·]{0,30}): (.+)$/.exec(l);
    return m ? { label: m[1], value: m[2] } : { value: l };
  });

  const alert = $.NSAlert.alloc.init;
  alert.alertStyle = $.NSAlertStyleWarning;
  const icon = $.NSImage.alloc.initWithContentsOfFile(iconPath);
  if (!icon.isNil()) alert.icon = icon;
  alert.messageText = title;
  alert.informativeText = context || 'App Store Connect';
  alert.addButtonWithTitle(approve); // first: the default, Return
  alert.addButtonWithTitle(refuse).keyEquivalent = '\u001b';

  // The alert centres the details in its text column, so they take that column's
  // width exactly. The column shifts as the alert sizes itself around them, so the
  // details are built, laid out, measured against the title field and, if the
  // width moved, built once more (it settles at 242 points on macOS 26).
  const size = $.NSFont.smallSystemFontSize;
  const details = (W) => {
    const text = (s, color, bold) => {
      const t = $.NSTextField.wrappingLabelWithString(s);
      t.font = bold ? $.NSFont.boldSystemFontOfSize(size) : $.NSFont.systemFontOfSize(size);
      t.textColor = color;
      t.preferredMaxLayoutWidth = W - 2;
      t.selectable = false;
      return t;
    };
    const views = [];
    const facts = rows.filter((r) => r.label);
    if (facts.length) {
      const labelW = Math.min(110, Math.max(...facts.map((r) => text(r.label, $.NSColor.secondaryLabelColor).fittingSize.width)));
      const grid = $.NSGridView.gridViewWithViews($(facts.map((r) => {
        const v = text(r.value, $.NSColor.labelColor);
        v.preferredMaxLayoutWidth = W - 2 - labelW - 8;
        return $([text(r.label, $.NSColor.secondaryLabelColor), v]);
      })));
      grid.rowSpacing = 3;
      grid.columnSpacing = 8;
      grid.columnAtIndex(0).width = labelW;
      views.push(grid);
    }
    // A line that is not a fact ("Groups that already have it stay as they are") reads as a note.
    for (const r of rows.filter((r) => !r.label)) views.push(text(r.value, $.NSColor.secondaryLabelColor));
    if (outcome) views.push(text(outcome, $.NSColor.labelColor, true));
    if (!views.length) return;
    const stack = $.NSStackView.stackViewWithViews($(views));
    stack.orientation = $.NSUserInterfaceLayoutOrientationVertical;
    stack.alignment = $.NSLayoutAttributeLeading;
    stack.spacing = 8;
    const h = stack.fittingSize.height;
    // The alert's own text sits 2 points inside its field; the details match it.
    stack.frame = $.NSMakeRect(2, 0, W - 2, h);
    // A plain view keeps the width it is given; a bare stack shrinks to its content and drifts.
    const box = $.NSView.alloc.initWithFrame($.NSMakeRect(0, 0, W, h));
    box.addSubview(stack);
    // A replaced accessory stays in the window unless taken out.
    if (!alert.accessoryView.isNil()) alert.accessoryView.removeFromSuperview;
    alert.accessoryView = box;
  };
  const field = (v) => { const subs = v.subviews; for (let i = 0; i < subs.count; i++) { const s = subs.objectAtIndex(i); const f = s.isKindOfClass($.NSTextField) ? s : field(s); if (f) return f; } };
  const column = () => {
    alert.layout;
    alert.window.contentView.superview.layoutSubtreeIfNeeded;
    return Math.round(field(alert.window.contentView)?.frame.size.width || 242);
  };
  let W = column();
  for (let i = 0; i < 3; i++) {
    details(W);
    const settled = column();
    if (settled === W) break;
    W = settled;
  }

  if (renderTo) {
    const frame = alert.window.contentView.superview;
    frame.layoutSubtreeIfNeeded;
    const rep = frame.bitmapImageRepForCachingDisplayInRect(frame.bounds);
    frame.cacheDisplayInRectToBitmapImageRep(frame.bounds, rep);
    rep.representationUsingTypeProperties($.NSBitmapImageFileTypePNG, $()).writeToFileAtomically(renderTo, true);
    return 'rendered';
  }

  app.activateIgnoringOtherApps(true);
  // JXA hands back both the modal response and NSAlertFirstButtonReturn as strings ("1000").
  return Number(alert.runModal) === Number($.NSAlertFirstButtonReturn) ? 'approved' : 'cancelled';
}`;

export interface DialogText {
  /** The bold line: the question itself. */
  title: string;
  body: string;
  /** The approving button, named for what it does ("Remove"); Allow when no verb fits. */
  action?: string;
}

// A button named Cancel next to a Cancel button would say nothing, so that verb stays Allow.
const BUTTON_VERBS = /^(Activate|Add|Answer|Apply|Archive|Assign|Change|Create|Deactivate|Delete|End|Expire|Extend|Finish|Give|Invite|Link|Mark|Pause|Place|Post|Register|Release|Remove|Rename|Reorder|Replace|Request|Resume|Revoke|Send|Set|Start|Stop|Submit|Turn|Unarchive|Unlink|Update|Upload|Withdraw)\b/;
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
  if (raw.startsWith('[{')) return 'a list of settings';
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
  // Quoted as written, not JSON-escaped: a name holding a quote must not throw.
  const label = note && /^".*"$/.test(note) ? note.slice(1, -1) : undefined;
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
  title = title.replace(/^(\w+) (an?) (.+)$/, (whole, verb: string, article: string, noun: string) => {
    // Only a plain noun: "a tester from your account entirely" would bury the name,
    // and "its subcategories" or "to organise testers" are plurals that belong.
    if (noun.split(' ').length > 4 || /\b(from|to|of|in|for|with|on|by|before|after|and|its|entirely)\b/.test(noun)) return whole;
    const one = noun.replace(/(\w*[^s])s$/, '$1');
    return name ? `${verb} the ${one} "${name}"` : `${verb} ${article} ${one}`;
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
export function dialogText(what: string | undefined, preview: string, covered: string[] = []): DialogText {
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
    // A field the question already says ("Pause the phased release?") would only repeat it.
    if (covered.some((key) => new RegExp(`(^|\\.)${key} =`).test(t))) continue;
    const said = changeLine(t.replace(/^(App|Product|Price):\s+/, '$1: '));
    if (!said) continue;
    if (said.startsWith('\u0000')) {
      const [, type, item] = said.split('\u0000');
      lists.set(type, [...(lists.get(type) ?? []), item]);
      continue;
    }
    // The same name under two keys ("Product" and the subscription it links) is one fact;
    // two fields that merely share a value ("Yes", a date) are two.
    const value = said.replace(/^[^:]+:\s+/, '');
    if (/^(App|Product|Price):/.test(said)) seen.add(value);
    else if (t.includes(' → ') && seen.has(value)) continue;
    details.push(said.length > MAX_LINE ? `${said.slice(0, MAX_LINE - 1)}…` : said);
  }
  for (const [type, items] of lists) details.push(`${type}: ${listWords(items, 6)}`);
  const named = what && !what.endsWith('?') && target.length === 1 ? target[0] : undefined;
  const title = what?.endsWith('?') ? what : what ? titleFrom(what, named) : 'Allow this change in App Store Connect?';
  // Named in the question itself, the target needs no line of its own.
  if (target.length && !(named && title.includes(`"${named}"`))) details.unshift(`Target: ${target.join(', ')}`);
  return { title, body: [...details, ...(warnings.length ? ['', ...warnings] : [])].join('\n'), action: actionFor(title) };
}

/** One field's line; a long description would push the buttons off the screen. */
const MAX_LINE = 200;

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
    execFile('osascript', ['-l', 'JavaScript', '-e', SCRIPT, text.title, body, ...buttons, ICON], { signal }, (error, stdout) => {
      if (!error) return resolve(stdout.trim() === 'approved' ? 'approved' : 'cancelled');
      resolve(signal?.aborted ? 'cancelled' : 'unavailable');
    });
  });
}
