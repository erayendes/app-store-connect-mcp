/**
 * Write confirmation guard.
 *
 * Mutating tools (anything not marked readOnlyHint) can change real App Store
 * Connect data — prices, submissions, deletions. Before running one, we ask the
 * user to confirm via MCP elicitation, so a vague or misread instruction ("set
 * the price to 0.99") can't execute unchecked. The prompt carries an impact
 * preview (operation, target, changed fields, risk level, reversibility), and
 * high-stakes levels (revenue/destructive/infrastructure/access) require the
 * user to TYPE the confirmation instead of ticking a box. The guard is on by
 * default and turned off with ASC_CONFIRM_WRITES=0 / --no-confirm.
 *
 * Elicitation only works on clients that declared the capability. On clients
 * that didn't, we can't pop a prompt — and silently proceeding would mean the
 * guard the user thinks is on is actually off. So the default is fail-closed:
 * the write is blocked with an error naming the escape hatch. Passing
 * `allowUnconfirmed` (--allow-unconfirmed-writes / ASC_ALLOW_UNCONFIRMED_WRITES=1)
 * restores the old behaviour: proceed and rely on the client's own per-call
 * approval, warning once on stderr.
 */
import { STRONG_CONFIRM_LEVELS, REVERSIBILITY, type RiskLevel } from './risk.js';

/** The slice of the MCP Server we need — kept tiny so the logic is unit-testable. */
export interface WriteConfirmer {
  // `form` is only checked for truthiness — the SDK types it as an object, so
  // `unknown` keeps this compatible with the real ClientCapabilities shape.
  getClientCapabilities(): { elicitation?: { form?: unknown } } | undefined;
  elicitInput(params: unknown): Promise<{ action: string; content?: Record<string, unknown> }>;
}

export interface ConfirmDecision {
  allowed: boolean;
  /** Present when blocked: 'decline' | 'cancel' | 'not confirmed' | 'no-elicitation'. */
  reason?: string;
}

/** What the user sees before approving a write. */
export interface WritePreview {
  message: string;
  /** True for high-stakes levels: the user must type CONFIRM, not tick a box. */
  strong: boolean;
}

/** The slice of an Operation the preview needs (StoreKit tools fake one). */
export interface PreviewableOp {
  method: string;
  path: string;
  risk?: string;
}

const MAX_CHANGE_LINES = 10;

/**
 * Flattens a JSON:API body into human-readable "field = value" lines:
 * attributes become dotted paths, relationships become "→ type/id" arrows.
 */
function summarizeBody(body: unknown, lines: string[], prefix = ''): void {
  if (lines.length > MAX_CHANGE_LINES || !body || typeof body !== 'object') return;
  for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
    if (lines.length > MAX_CHANGE_LINES) return;
    const path = prefix ? `${prefix}.${key}` : key;
    if (value === null || typeof value !== 'object') {
      lines.push(`${path} = ${JSON.stringify(value)}`);
    } else if (Array.isArray(value)) {
      // Relationship arrays are lists of {type,id}; summarize as ids.
      const ids = value
        .map((v: any) => (v && typeof v === 'object' && 'id' in v ? v.id : undefined))
        .filter(Boolean);
      if (ids.length === value.length && ids.length > 0) {
        lines.push(`${path} → [${ids.slice(0, 5).join(', ')}${ids.length > 5 ? ', …' : ''}] (${ids.length})`);
      } else {
        lines.push(`${path} = ${JSON.stringify(value).slice(0, 100)}`);
      }
    } else if ('type' in (value as any) && 'id' in (value as any)) {
      lines.push(`${path} → ${(value as any).type}/${(value as any).id}`);
    } else {
      summarizeBody(value, lines, path);
    }
  }
}

/** Counts territory codes anywhere in the body — blast-radius hint. */
function countTerritories(body: unknown): number {
  let count = 0;
  const walk = (node: unknown, key?: string): void => {
    if (Array.isArray(node)) {
      if (key && /territor/i.test(key)) count += node.length;
      else node.forEach((n) => walk(n));
    } else if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) {
        // JSON:API wraps relationship arrays in `data`; the meaningful name
        // ("availableTerritories") is the parent key, so carry it through.
        walk(v, k === 'data' && key ? key : k);
      }
    }
  };
  walk(body);
  return count;
}

/**
 * Builds the impact preview shown in the confirmation prompt (and used by
 * --dry-run). Pure — unit-tested without a client.
 */
export function buildWritePreview(
  toolName: string,
  op: PreviewableOp,
  args: Record<string, unknown>,
  account?: string
): WritePreview {
  const risk = (op.risk ?? 'low') as RiskLevel;
  const strong = STRONG_CONFIRM_LEVELS.has(risk);

  const lines: string[] = [
    `Heimdall is about to run "${toolName}" — a ${risk.toUpperCase()}-level write.`,
    '',
    `Operation:  ${op.method} ${op.path}`,
  ];

  const ids = Object.entries(args)
    .filter(([k, v]) => k !== 'body' && typeof v === 'string' && op.path.includes(`{${k}}`))
    .map(([k, v]) => `${k} = ${v}`);
  if (ids.length) lines.push(`Target:     ${ids.join(', ')}`);
  if (account) lines.push(`Account:    ${account}`);

  const body = (args.body as any)?.data;
  if (body) {
    const changes: string[] = [];
    summarizeBody(body, changes);
    if (changes.length) {
      lines.push('Changes:');
      for (const c of changes.slice(0, MAX_CHANGE_LINES)) lines.push(`  ${c}`);
      if (changes.length > MAX_CHANGE_LINES) lines.push('  …');
    }
    const territories = countTerritories(body);
    if (territories) lines.push(`Territories in request: ${territories}`);
  }

  lines.push(`Risk:       ${risk} — ${REVERSIBILITY[risk]}`);
  if (strong) lines.push('', 'Type CONFIRM in the field below to proceed.');

  return { message: lines.join('\n'), strong };
}

/**
 * Decides whether a write may proceed. Pure but for the injected confirmer and
 * the one-time warn callback, so tests drive it with fakes.
 */
export async function confirmWrite(
  confirmer: WriteConfirmer,
  toolName: string,
  warnNoElicitation: () => void,
  allowUnconfirmed = false,
  preview?: WritePreview
): Promise<ConfirmDecision> {
  if (!confirmer.getClientCapabilities()?.elicitation?.form) {
    // No way to ask the user. Fail closed unless they explicitly opted into
    // unconfirmed writes — a guard that silently stops guarding is worse than
    // an error that says why.
    if (allowUnconfirmed) {
      warnNoElicitation();
      return { allowed: true };
    }
    return { allowed: false, reason: 'no-elicitation' };
  }

  const message =
    preview?.message ??
    `Heimdall is about to run "${toolName}", which changes your App Store Connect data. Allow it?`;

  if (preview?.strong) {
    const result = await confirmer.elicitInput({
      mode: 'form',
      message,
      requestedSchema: {
        type: 'object',
        properties: {
          confirmation: {
            type: 'string',
            title: 'Type CONFIRM to proceed',
            description: `Required for a high-stakes write like "${toolName}". Anything else cancels.`,
          },
        },
        required: ['confirmation'],
      },
    });
    if (
      result.action === 'accept' &&
      String(result.content?.confirmation ?? '').trim().toUpperCase() === 'CONFIRM'
    ) {
      return { allowed: true };
    }
    return { allowed: false, reason: result.action === 'accept' ? 'not confirmed' : result.action };
  }

  const result = await confirmer.elicitInput({
    mode: 'form',
    message,
    requestedSchema: {
      type: 'object',
      properties: {
        confirm: {
          type: 'boolean',
          title: `Allow "${toolName}"?`,
          description: 'Leave unchecked to cancel this write.',
        },
      },
      required: ['confirm'],
    },
  });

  if (result.action === 'accept' && result.content?.confirm === true) {
    return { allowed: true };
  }
  return { allowed: false, reason: result.action === 'accept' ? 'not confirmed' : result.action };
}
