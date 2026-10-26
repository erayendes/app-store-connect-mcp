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
  alert.addButtonWithTitle('Allow');
  alert.addButtonWithTitle('Don’t Allow').keyEquivalent = '\\u001b';
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
}

/**
 * The alert's text, from the elicitation preview.
 *
 * That preview is written for a form inside the client: it opens with the
 * tool name, lists the HTTP operation and the key id, and ends by asking for
 * CONFIRM. In an alert of its own the person needs what will happen, to what,
 * and what cannot be undone. `what` is the tool's own one-line summary.
 */
export function dialogText(what: string | undefined, preview: string): DialogText {
  const details: string[] = [];
  let warning = '';
  for (const line of preview.split('\n').slice(1)) {
    const t = line.trim();
    if (!t || t === 'Changes:' || /^(Operation|Account):/.test(t) || /Type CONFIRM/.test(t)) continue;
    if (t.startsWith('Risk:')) warning = t.split(' — ').slice(1).join(' — ');
    else details.push(t.replace(/^(\w)(\w*):\s+/, (_, c: string, rest: string) => `${c.toUpperCase()}${rest}: `));
  }
  return {
    title: what ? `${what.replace(/\.$/, '')}?` : 'Allow this change in App Store Connect?',
    body: [
      'Your AI assistant asked Heimdall to make this change in App Store Connect.',
      ...(details.length ? ['', ...details] : []),
      ...(warning ? ['', warning] : []),
    ].join('\n'),
  };
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
    execFile('osascript', ['-l', 'JavaScript', '-e', SCRIPT, text.title, body, ICON], { signal }, (error, stdout) => {
      if (!error) return resolve(stdout.trim() === 'approved' ? 'approved' : 'cancelled');
      resolve(signal?.aborted ? 'cancelled' : 'unavailable');
    });
  });
}
