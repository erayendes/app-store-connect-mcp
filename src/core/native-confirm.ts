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

export type NativeAnswer = 'approved' | 'cancelled' | 'unavailable';

/** display dialog grows with its text; past this the buttons leave the screen. */
const MAX_MESSAGE = 1500;

// Return approves and Escape cancels. No time limit: the dialog stays until
// it is answered, or until the tool call is cancelled (below).
// The text is passed as an argument, never spliced into the script, so a
// quote in an app name cannot become AppleScript.
const SCRIPT = `on run argv
  activate
  display dialog (item 1 of argv) with title (item 2 of argv) buttons {"Cancel", "Approve"} default button "Approve" cancel button "Cancel" with icon caution
  return "approved"
end run`;

/** Whether a dialog can be tried at all; checked before the preview's lookups are spent. */
export const nativeConfirmAvailable = (): boolean => process.platform === 'darwin';

export function nativeConfirm(message: string, title: string, signal?: AbortSignal): Promise<NativeAnswer> {
  if (!nativeConfirmAvailable()) return Promise.resolve('unavailable');
  const text = message.length > MAX_MESSAGE ? `${message.slice(0, MAX_MESSAGE)}…` : message;
  return new Promise((resolve) => {
    // A cancelled tool call takes its dialog with it, so a late click cannot
    // run a write the agent was already told failed.
    execFile('osascript', ['-e', SCRIPT, text, title], { signal }, (error, stdout) => {
      if (!error) return resolve(stdout.trim() === 'approved' ? 'approved' : 'cancelled');
      // -128 is AppleScript's "User canceled": the Cancel button.
      if (/-128/.test(String(error.message))) return resolve('cancelled');
      resolve(signal?.aborted ? 'cancelled' : 'unavailable');
    });
  });
}
