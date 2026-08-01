/**
 * A space-to-toggle checklist for the terminal, like the Firebase CLI's
 * feature picker — arrow keys move, space toggles, `a` toggles all, Enter
 * confirms. Built on node:readline keypress events and raw mode; no
 * dependency. The state logic is pure (and unit-tested); only the thin I/O
 * wiring in runChecklist touches the TTY.
 */
import { emitKeypressEvents, type Key } from 'node:readline';

export interface ChecklistItem {
  label: string;
  hint?: string;
  /**
   * Index of the row this one belongs under. Children stay hidden until the
   * parent is checked, so a list of 17 profiles doesn't open as 46 rows — the
   * detail appears only where the user has already shown interest.
   */
  parent?: number;
}

export interface ChecklistState {
  cursor: number;
  selected: Set<number>;
}

export type KeyAction = 'up' | 'down' | 'toggle' | 'all' | 'confirm' | 'cancel' | 'none';

/** Map a keypress to an action. Kept separate so it can be tested without a TTY. */
export function keyToAction(key: Pick<Key, 'name' | 'ctrl'>): KeyAction {
  if (key.ctrl && key.name === 'c') return 'cancel';
  switch (key.name) {
    case 'up':
    case 'k':
      return 'up';
    case 'down':
    case 'j':
      return 'down';
    case 'space':
      return 'toggle';
    case 'a':
      return 'all';
    case 'return':
    case 'enter':
      return 'confirm';
    case 'escape':
    case 'q':
      return 'cancel';
    default:
      return 'none';
  }
}

/**
 * Rows currently on screen: a child shows while its parent is checked *and* the
 * cursor is in that group.
 *
 * Tying it to the checkbox alone looked right with one profile checked and fell
 * apart with eight: someone who already registered eight profiles opened the
 * picker to 46 rows, which is the wall the sub-rows existed to avoid. The cursor
 * is the better signal — it says what the user is looking at right now, while
 * the checkbox says what they want registered, and those are different
 * questions.
 */
export function visibleIndices(items: ChecklistItem[], state: ChecklistState): number[] {
  const focused = items[state.cursor]?.parent ?? state.cursor;
  return items
    .map((_, i) => i)
    .filter((i) => {
      const parent = items[i].parent;
      return parent === undefined || (state.selected.has(parent) && parent === focused);
    });
}

const childrenOf = (items: ChecklistItem[], parent: number): number[] =>
  items.map((it, i) => (it.parent === parent ? i : -1)).filter((i) => i >= 0);

/** Apply an action to the state. Returns the next state; caller checks confirm/cancel. */
export function applyAction(
  state: ChecklistState,
  action: KeyAction,
  items: ChecklistItem[]
): ChecklistState {
  const selected = new Set(state.selected);
  const visible = visibleIndices(items, state);
  const at = Math.max(0, visible.indexOf(state.cursor));

  switch (action) {
    case 'up':
      return { ...state, cursor: visible[(at - 1 + visible.length) % visible.length] };
    case 'down':
      return { ...state, cursor: visible[(at + 1) % visible.length] };
    case 'toggle': {
      const i = state.cursor;
      const children = childrenOf(items, i);
      if (selected.has(i)) {
        // Closing a parent takes its children with it, so a later reopen starts
        // from the same all-checked default rather than a half-remembered one.
        selected.delete(i);
        for (const c of children) selected.delete(c);
      } else {
        selected.add(i);
        for (const c of children) selected.add(c);
      }
      const parent = items[i].parent;
      // A parent with no children left selects nothing — drop it too, rather
      // than emitting a profile with an empty sub-profile list.
      if (parent !== undefined && !childrenOf(items, parent).some((c) => selected.has(c))) {
        selected.delete(parent);
        return { ...state, cursor: parent, selected };
      }
      return { ...state, selected };
    }
    case 'all': {
      // If everything is already selected, clear; otherwise select all.
      if (selected.size === items.length) return { ...state, cursor: 0, selected: new Set() };
      return { ...state, selected: new Set(items.map((_, i) => i)) };
    }
    default:
      return state;
  }
}

/**
 * Render the checklist to a string. Lines are shown in full (no truncation);
 * the alternate-screen redraw clears the whole frame each time, so a line that
 * wraps costs an extra row but never corrupts the display.
 */
export function renderChecklist(items: ChecklistItem[], state: ChecklistState): string {
  const INDENT = '    ';
  const labelWidth = Math.max(
    ...items.map((it) => it.label.length + (it.parent === undefined ? 0 : INDENT.length))
  );
  return visibleIndices(items, state)
    .map((i) => {
      const item = items[i];
      const pointer = i === state.cursor ? '›' : ' ';
      const box = state.selected.has(i) ? '◉' : '◯';
      const label = (item.parent === undefined ? '' : INDENT) + item.label;
      const hint = item.hint ? `  ${item.hint}` : '';
      return `${pointer} ${box} ${label.padEnd(labelWidth)}${hint}`;
    })
    .join('\n');
}

/**
 * Run the interactive picker. Resolves to the selected indices, or null if the
 * user cancelled. `preselected` seeds the initial checks.
 */
export function runChecklist(
  items: ChecklistItem[],
  opts: { title?: string; preselected?: number[] } = {}
): Promise<number[] | null> {
  const stdin = process.stdin;
  const stdout = process.stdout;

  return new Promise((resolve) => {
    let state: ChecklistState = {
      cursor: 0,
      selected: new Set(opts.preselected ?? []),
    };

    const header =
      (opts.title ? `${opts.title}\n` : '') +
      '(↑/↓ move · space toggle · a all/none · enter confirm)\n\n';

    // The alternate screen buffer is a fresh, non-scrolling page. Redrawing the
    // whole frame from home each time sidesteps cursor-up math entirely — the
    // reason the earlier in-place version corrupted once the list scrolled.
    const ALT_ENTER = '\x1b[?1049h\x1b[?25l'; // enter alt screen, hide cursor
    const ALT_LEAVE = '\x1b[?25h\x1b[?1049l'; // show cursor, leave alt screen

    const draw = () => {
      const body = renderChecklist(items, state);
      stdout.write(`\x1b[2J\x1b[H${header}${body}\n`);
    };

    emitKeypressEvents(stdin);
    const wasRaw = stdin.isRaw;
    if (stdin.isTTY) stdin.setRawMode(true);
    stdin.resume();

    stdout.write(ALT_ENTER);
    draw();

    const onResize = () => draw();
    stdout.on('resize', onResize);

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      stdin.removeListener('keypress', onKey);
      stdout.removeListener('resize', onResize);
      if (stdin.isTTY) stdin.setRawMode(Boolean(wasRaw));
      // Do NOT pause stdin here: setup keeps asking readline questions after
      // the picker (bundle ID, the register prompt). Pausing it left the next
      // rl.question with no input and the process exited mid-setup. The caller
      // owns stdin's lifecycle and releases it when fully done.
      stdout.write(ALT_LEAVE);
    };

    const onKey = (_str: string, key: Key) => {
      const action = keyToAction(key);
      if (action === 'cancel') {
        cleanup();
        stdout.write('\n');
        resolve(null);
        return;
      }
      if (action === 'confirm') {
        cleanup();
        stdout.write('\n');
        resolve([...state.selected].sort((a, b) => a - b));
        return;
      }
      const next = applyAction(state, action, items);
      if (next !== state) {
        state = next;
        draw();
      }
    };

    stdin.on('keypress', onKey);
  });
}
