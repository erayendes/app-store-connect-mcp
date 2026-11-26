/**
 * The dialog comes to the front over whatever the person is typing in, so no
 * key may approve it: Return and Space must not press the approve button.
 * Checked on the script itself, since a test cannot press keys on a real alert.
 */
import { describe, expect, it, vi } from 'vitest';

const calls: string[][] = [];
vi.mock('node:child_process', () => ({
  execFile: (_cmd: string, args: string[], _opts: unknown, done: (e: null, out: string) => void) => { calls.push(args); done(null, 'cancelled\n'); },
}));
const { nativeConfirm } = await import('../src/core/native-confirm.js');

describe('the macOS dialog', () => {
  it('has no default button and starts keyboard focus on Cancel', async () => {
    const platform = Object.getOwnPropertyDescriptor(process, 'platform')!;
    Object.defineProperty(process, 'platform', { value: 'darwin' });
    try { await nativeConfirm({ title: 'Remove it?', body: 'x', action: 'Remove' }); } finally { Object.defineProperty(process, 'platform', platform); }
    const script = calls[0][3];
    // A JS '' reaches AppKit as nil and NSAlert gives the button Return again.
    expect(script).toContain("ok.keyEquivalent = $('');");
    expect(script).toContain("cancel.keyEquivalent = '\\u001b';");
    expect(script).toContain('alert.window.initialFirstResponder = cancel;');
  });
});
