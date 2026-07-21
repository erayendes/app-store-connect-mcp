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

/** Apply an action to the state. Returns the next state; caller checks confirm/cancel. */
export function applyAction(state: ChecklistState, action: KeyAction, count: number): ChecklistState {
  const selected = new Set(state.selected);
  switch (action) {
    case 'up':
      return { ...state, cursor: (state.cursor - 1 + count) % count };
    case 'down':
      return { ...state, cursor: (state.cursor + 1) % count };
    case 'toggle':
      selected.has(state.cursor) ? selected.delete(state.cursor) : selected.add(state.cursor);
      return { ...state, selected };
    case 'all': {
      // If everything is already selected, clear; otherwise select all.
      if (selected.size === count) return { ...state, selected: new Set() };
      return { ...state, selected: new Set(Array.from({ length: count }, (_, i) => i)) };
    }
    default:
      return state;
  }
}

function truncate(s: string, width: number): string {
  return s.length <= width ? s : s.slice(0, Math.max(0, width - 1)) + '…';
}

/**
 * Render the checklist to a string. Each item is truncated to one terminal
 * row: a wrapped line would throw off the cursor-up redraw math and turn the
 * list into a scrolling mess. `width` defaults to the terminal width.
 */
export function renderChecklist(
  items: ChecklistItem[],
  state: ChecklistState,
  width: number = process.stdout.columns ?? 80
): string {
  const labelWidth = Math.max(...items.map((i) => i.label.length));
  return items
    .map((item, i) => {
      const pointer = i === state.cursor ? '›' : ' ';
      const box = state.selected.has(i) ? '◉' : '◯';
      const hint = item.hint ? `  ${item.hint}` : '';
      return truncate(`${pointer} ${box} ${item.label.padEnd(labelWidth)}${hint}`, width);
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

    let lastLineCount = 0;
    const draw = (first = false) => {
      const body = renderChecklist(items, state);
      const lineCount = body.split('\n').length;
      if (!first) {
        // Move cursor up over the previous body and clear to end of screen.
        stdout.write(`\x1b[${lastLineCount}A\x1b[0J`);
      }
      stdout.write(body + '\n');
      lastLineCount = lineCount;
    };

    emitKeypressEvents(stdin);
    const wasRaw = stdin.isRaw;
    if (stdin.isTTY) stdin.setRawMode(true);
    stdin.resume();

    stdout.write(header);
    draw(true);

    const cleanup = () => {
      stdin.removeListener('keypress', onKey);
      if (stdin.isTTY) stdin.setRawMode(Boolean(wasRaw));
      stdin.pause();
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
      const next = applyAction(state, action, items.length);
      if (next !== state) {
        state = next;
        draw();
      }
    };

    stdin.on('keypress', onKey);
  });
}
