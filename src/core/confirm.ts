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

/** The slice of AscHttpClient the resolver needs — mockable in tests. */
export interface RefReader {
  get<T = unknown>(path: string, query?: Record<string, unknown>): Promise<T>;
}

/**
 * Meaning-heavy fields, spelled out in the prompt. A raw
 * `preserveCurrentPrice = false` reads like a technical flag; its real meaning
 * is a customer-facing revenue decision, so it must never look routine.
 */
export const FIELD_NOTES: Record<string, (value: unknown) => string | undefined> = {
  preserveCurrentPrice: (v) =>
    v === false
      ? '⚠ Existing subscribers WILL be moved to the new price.'
      : v === true
        ? 'Existing subscribers keep their current price.'
        : undefined,
};

/** Max reference lookups per preview — keeps confirmation latency bounded. */
const MAX_REF_LOOKUPS = 4;

type RefResolver = (http: RefReader, id: string) => Promise<string | undefined>;

/** Human labels for the reference types that matter most in previews. */
const REF_RESOLVERS: Record<string, RefResolver> = {
  subscriptionPricePoints: async (http, id) => {
    const res: any = await http.get(`/v1/subscriptionPricePoints/${encodeURIComponent(id)}`, {
      include: 'territory',
    });
    const price = res?.data?.attributes?.customerPrice;
    if (!price) return undefined;
    const territory: any = (res?.included ?? []).find((i: any) => i?.type === 'territories');
    const territoryId = territory?.id ?? res?.data?.relationships?.territory?.data?.id;
    const currency = territory?.attributes?.currency;
    return `${price}${currency ? ` ${currency}` : ''}${territoryId ? ` (${territoryId})` : ''}`;
  },
  subscriptions: async (http, id) => {
    const res: any = await http.get(`/v1/subscriptions/${encodeURIComponent(id)}`);
    const a = res?.data?.attributes;
    return a?.name ? `${a.name}${a.productId ? ` (${a.productId})` : ''}` : undefined;
  },
  apps: async (http, id) => {
    const res: any = await http.get(`/v1/apps/${encodeURIComponent(id)}`);
    const a = res?.data?.attributes;
    return a?.name ? `${a.name}${a.bundleId ? ` (${a.bundleId})` : ''}` : undefined;
  },
  betaGroups: async (http, id) => {
    const res: any = await http.get(`/v1/betaGroups/${encodeURIComponent(id)}`);
    return res?.data?.attributes?.name ?? undefined;
  },
};

/** Collects every {type,id} reference in a JSON:API body. */
function collectRefs(node: unknown, refs: Array<{ type: string; id: string }>): void {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    node.forEach((n) => collectRefs(n, refs));
    return;
  }
  const rec = node as Record<string, unknown>;
  if (typeof rec.type === 'string' && typeof rec.id === 'string' && REF_RESOLVERS[rec.type]) {
    refs.push({ type: rec.type, id: rec.id });
  }
  for (const v of Object.values(rec)) collectRefs(v, refs);
}

/**
 * Resolves the opaque ids in a write body to human labels ("99.99 TRY (TUR)",
 * "ask quran base 1week (askquran.base.1week)") with at most MAX_REF_LOOKUPS
 * GET calls. Display is best-effort: a failed lookup leaves the raw id — the
 * write itself is never affected.
 */
export async function resolveBodyRefs(
  http: RefReader,
  body: unknown
): Promise<Map<string, string>> {
  const refs: Array<{ type: string; id: string }> = [];
  collectRefs(body, refs);

  const seen = new Set<string>();
  const unique = refs.filter((r) => {
    const key = `${r.type}/${r.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const labels = new Map<string, string>();
  await Promise.all(
    unique.slice(0, MAX_REF_LOOKUPS).map(async ({ type, id }) => {
      try {
        const label = await REF_RESOLVERS[type](http, id);
        if (label) labels.set(`${type}/${id}`, label);
      } catch {
        // Best-effort display only — the raw id stays in the preview.
      }
    })
  );
  return labels;
}

/**
 * Flattens a JSON:API body into human-readable "field = value" lines:
 * attributes become dotted paths, relationships become "→ type/id" arrows.
 */
function summarizeBody(
  body: unknown,
  lines: string[],
  prefix = '',
  labels?: Map<string, string>
): void {
  if (lines.length > MAX_CHANGE_LINES || !body || typeof body !== 'object') return;
  for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
    if (lines.length > MAX_CHANGE_LINES) return;
    const path = prefix ? `${prefix}.${key}` : key;
    if (value === null || typeof value !== 'object') {
      const note = FIELD_NOTES[key]?.(value);
      lines.push(`${path} = ${JSON.stringify(value)}${note ? ` — ${note}` : ''}`);
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
      const label = labels?.get(`${(value as any).type}/${(value as any).id}`);
      lines.push(
        `${path} → ${(value as any).type}/${(value as any).id}${label ? ` — "${label}"` : ''}`
      );
    } else {
      summarizeBody(value, lines, path, labels);
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
 * --dry-run). When an http reader is provided, opaque reference ids in the
 * body are resolved to human labels (best-effort): a price-point id becomes
 * "Price: 99.99 TRY (TUR)", a subscription id becomes the product name — so
 * the user sees WHAT they are confirming, not a base64 blob.
 */
export async function buildWritePreview(
  toolName: string,
  op: PreviewableOp,
  args: Record<string, unknown>,
  account?: string,
  http?: RefReader
): Promise<WritePreview> {
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
    const labels = http ? await resolveBodyRefs(http, body) : new Map<string, string>();

    // The two labels that answer "what am I approving?" get their own lines.
    for (const [key, label] of labels) {
      if (key.startsWith('subscriptions/')) lines.push(`Product:    ${label}`);
      else if (key.startsWith('apps/')) lines.push(`App:        ${label}`);
      else if (key.startsWith('subscriptionPricePoints/')) lines.push(`Price:      ${label}`);
    }

    const changes: string[] = [];
    summarizeBody(body, changes, '', labels);
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
