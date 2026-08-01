import { describe, it, expect } from 'vitest';
import {
  keyToAction,
  applyAction,
  renderChecklist,
  visibleIndices,
  type ChecklistItem,
  type ChecklistState,
} from '../src/checklist.js';

const st = (cursor: number, selected: number[]): ChecklistState => ({ cursor, selected: new Set(selected) });
const flat = (n: number): ChecklistItem[] => Array.from({ length: n }, (_, i) => ({ label: `i${i}` }));

describe('checklist key mapping', () => {
  it('maps arrows, space, a, enter, cancel', () => {
    expect(keyToAction({ name: 'up', ctrl: false })).toBe('up');
    expect(keyToAction({ name: 'j', ctrl: false })).toBe('down');
    expect(keyToAction({ name: 'space', ctrl: false })).toBe('toggle');
    expect(keyToAction({ name: 'a', ctrl: false })).toBe('all');
    expect(keyToAction({ name: 'return', ctrl: false })).toBe('confirm');
    expect(keyToAction({ name: 'escape', ctrl: false })).toBe('cancel');
    expect(keyToAction({ name: 'c', ctrl: true })).toBe('cancel');
    expect(keyToAction({ name: 'x', ctrl: false })).toBe('none');
  });
});

describe('checklist reducer', () => {
  it('wraps the cursor at both ends', () => {
    expect(applyAction(st(0, []), 'up', flat(3)).cursor).toBe(2);
    expect(applyAction(st(2, []), 'down', flat(3)).cursor).toBe(0);
  });

  it('toggles the item under the cursor without touching others', () => {
    const a = applyAction(st(1, [0]), 'toggle', flat(3));
    expect([...a.selected].sort()).toEqual([0, 1]);
    const b = applyAction(a, 'toggle', flat(3));
    expect([...b.selected].sort()).toEqual([0]);
  });

  it('a selects all, then clears all', () => {
    const all = applyAction(st(0, [1]), 'all', flat(3));
    expect(all.selected.size).toBe(3);
    const none = applyAction(all, 'all', flat(3));
    expect(none.selected.size).toBe(0);
  });
});

/**
 * Rows 0 and 3 are profiles; 1-2 and 4 are their sub-profiles. Everything here
 * is about the picker staying honest: a config the user cannot see is worse
 * than no sub-profiles at all.
 */
const nested: ChecklistItem[] = [
  { label: 'monetization' },
  { label: 'subscription-catalog', parent: 0 },
  { label: 'iap', parent: 0 },
  { label: 'webhooks' },
  { label: 'only-child', parent: 3 },
];

describe('checklist sub-rows', () => {
  it('hides children until their parent is checked', () => {
    expect(visibleIndices(nested, st(0, []))).toEqual([0, 3]);
    expect(visibleIndices(nested, st(0, [0]))).toEqual([0, 1, 2, 3]);
  });

  it('opens only the group under the cursor, however many parents are checked', () => {
    // Eight registered profiles used to open the picker to 46 rows — every
    // checked parent unfolded at once, which is the wall sub-rows exist to
    // avoid. Only what the cursor is on unfolds.
    const everything = st(0, [0, 1, 2, 3, 4]);
    expect(visibleIndices(nested, everything)).toEqual([0, 1, 2, 3]); // 4 stays folded
    expect(visibleIndices(nested, { ...everything, cursor: 3 })).toEqual([0, 3, 4]);
  });

  it('keeps the group open while the cursor is inside it', () => {
    const s = st(1, [0, 1, 2]);
    expect(visibleIndices(nested, s)).toContain(2);
    expect(visibleIndices(nested, s)).toEqual([0, 1, 2, 3]);
  });

  it('checking a parent turns every child on — doing nothing keeps today behaviour', () => {
    const opened = applyAction(st(0, []), 'toggle', nested);
    expect([...opened.selected].sort()).toEqual([0, 1, 2]);
  });

  it('unchecking a parent takes its children with it', () => {
    const opened = applyAction(st(0, []), 'toggle', nested);
    const closed = applyAction(opened, 'toggle', nested);
    expect(closed.selected.size).toBe(0);
  });

  it('unchecking the last child drops the parent, never a profile with nothing in it', () => {
    let s = applyAction(st(3, []), 'toggle', nested); // webhooks + only-child
    expect([...s.selected].sort()).toEqual([3, 4]);
    s = applyAction({ ...s, cursor: 4 }, 'toggle', nested); // uncheck only-child
    expect(s.selected.has(3)).toBe(false);
    expect(s.cursor).toBe(3); // cursor lands on the row that is still visible
  });

  it('navigation skips hidden rows and never parks the cursor on one', () => {
    const closed = st(0, []);
    expect(applyAction(closed, 'down', nested).cursor).toBe(3); // 1 and 2 hidden
    const open = st(0, [0, 1, 2]);
    expect(applyAction(open, 'down', nested).cursor).toBe(1);
  });
});

describe('checklist render', () => {
  it('marks the cursor and the checked boxes', () => {
    const out = renderChecklist(
      [{ label: 'a' }, { label: 'b', hint: 'second' }, { label: 'c' }],
      st(1, [1, 2])
    );
    const lines = out.split('\n');
    expect(lines[0]).toContain('◯ a');
    expect(lines[1]).toContain('› ◉ b');
    expect(lines[1]).toContain('second');
    expect(lines[2]).toContain('◉ c');
  });
});

import { PROFILES, resolveSelection, toolCountFor } from '../src/profiles.js';

describe('profile size hint inputs', () => {
  it('computes a plausible, ordered tool count per profile', () => {
    const byName = Object.fromEntries(
      PROFILES.map((p) => [p.name, toolCountFor(resolveSelection(p.name))])
    );
    expect(byName['analytics']).toBeLessThan(byName['monetization']);
    expect(byName['webhooks']).toBeLessThan(30);
    expect(byName['game-center']).toBeGreaterThan(100);
    // core means even the smallest profile can look up an app
    expect(byName['webhooks']).toBeGreaterThanOrEqual(3 + 2);
  });

  it('a sub-profile selection is smaller than the whole profile', () => {
    const whole = toolCountFor(resolveSelection('monetization'));
    const part = toolCountFor(resolveSelection('monetization:subscription-catalog'));
    expect(part).toBeLessThan(whole);
    expect(part).toBeGreaterThan(0);
  });
});

describe('checklist render (full lines — alternate screen buffer, no truncation)', () => {
  it('preserves a long hint in full rather than clipping it', () => {
    const hint = 'x'.repeat(200);
    const out = renderChecklist([{ label: 'asc-monetization', hint }], st(0, []));
    expect(out).toContain(hint);
    expect(out).not.toContain('…');
  });
});
