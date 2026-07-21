import { describe, it, expect } from 'vitest';
import { keyToAction, applyAction, renderChecklist, type ChecklistState } from '../src/checklist.js';

const st = (cursor: number, selected: number[]): ChecklistState => ({ cursor, selected: new Set(selected) });

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
    expect(applyAction(st(0, []), 'up', 3).cursor).toBe(2);
    expect(applyAction(st(2, []), 'down', 3).cursor).toBe(0);
  });

  it('toggles the item under the cursor without touching others', () => {
    const a = applyAction(st(1, [0]), 'toggle', 3);
    expect([...a.selected].sort()).toEqual([0, 1]);
    const b = applyAction(a, 'toggle', 3);
    expect([...b.selected].sort()).toEqual([0]);
  });

  it('a selects all, then clears all', () => {
    const all = applyAction(st(0, [1]), 'all', 3);
    expect(all.selected.size).toBe(3);
    const none = applyAction(all, 'all', 3);
    expect(none.selected.size).toBe(0);
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

import { PROFILES, GATEWAY_OPERATIONS } from '../src/profiles.js';
import { ToolRegistry } from '../src/core/registry.js';

describe('profile size hint inputs', () => {
  it('computes a plausible, ordered tool count per profile', () => {
    const count = (p: (typeof PROFILES)[number]) =>
      new ToolRegistry({
        domains: p.domains, readOnly: false, includeDeprecated: false,
        extraOperations: GATEWAY_OPERATIONS,
      }).size + 3 + (p.reviewsAi ? 3 : 0);
    const byName = Object.fromEntries(PROFILES.map((p) => [p.name, count(p)]));
    expect(byName['analytics']).toBeLessThan(byName['monetization']);
    expect(byName['webhooks']).toBeLessThan(30);
    expect(byName['game-center']).toBeGreaterThan(100);
    // gateway means even the smallest profile can look up an app
    expect(byName['webhooks']).toBeGreaterThanOrEqual(3 + 2);
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
