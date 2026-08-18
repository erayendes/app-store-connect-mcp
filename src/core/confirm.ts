/**
 * Write confirmation guard.
 *
 * Mutating tools (anything not marked readOnlyHint) can change real App Store
 * Connect data — prices, submissions, deletions. Before a revenue, destructive,
 * infrastructure or access one runs, we ask the user, so a vague or misread
 * instruction ("set the price to 0.99") can't execute unchecked. The prompt
 * carries an impact preview (operation, target, changed fields, risk level,
 * reversibility), and
 * high-stakes levels (revenue/destructive/infrastructure/access) require the
 * user to TYPE the confirmation instead of ticking a box.
 *
 * On by default for those four levels only, and that split was paid for twice.
 * Asking on every write fired constantly, and a client that declares
 * elicitation support but can't render the form answers `decline` — the one
 * thing the protocol gives us no way to tell apart from a real refusal — so
 * ordinary writes came back as "you refused". Asking on none removed the guard
 * from the writes that move money. `--confirm` restores every write,
 * `--no-confirm` removes it entirely.
 *
 * What is ours either way is the preview: only this server knows that a flag
 * spelled `preserveCurrentPrice: false` moves existing subscribers to a new
 * price. A client that never declared elicitation can't be asked at all, so
 * there the guard fails closed rather than pretending to be on.
 */
import { STRONG_CONFIRM_LEVELS, REVERSIBILITY, type RiskLevel } from './risk.js';
import { OPERATIONS } from '../generated/operations.js';

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

/**
 * How long the whole labelling step gets before the preview goes out with raw
 * ids in it.
 *
 * These lookups are decoration: the write is described correctly either way,
 * and a label that does not arrive costs the reader an id instead of a name.
 * The HTTP client does not know that — it treats a network failure as worth
 * three retries with exponential backoff, so an unreachable API held the
 * confirmation prompt for 49 seconds and then showed the id anyway. A person
 * waiting on a prompt reads that as a hang, and the one thing a confirmation
 * gate cannot afford is to look broken.
 */
const LABEL_DEADLINE_MS = 3_000;

type RefResolver = (http: RefReader, id: string) => Promise<string | undefined>;

/**
 * Human labels for the reference types that matter most in previews.
 *
 * Exported so the AX audit can measure coverage against the reference types
 * that actually appear in write bodies — a hardcoded copy of these keys would
 * go stale the moment a resolver is added.
 */
export const REF_RESOLVERS: Record<string, RefResolver> = {
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

/**
 * Types whose id is already the human-readable thing. A territory's id is its
 * alpha-3 code — resolving `USA` to "USA" is a round trip to learn nothing.
 */
export const SELF_DESCRIBING = new Set(['territories']);

/**
 * type -> the GET-by-id path Apple gives it, read off the spec rather than
 * assumed: 156 of the types that appear in write bodies have one, and a
 * handful sit under /v2.
 */
export const GET_BY_ID: ReadonlyMap<string, string> = (() => {
  const map = new Map<string, string>();
  for (const op of OPERATIONS) {
    const m = /^\/(v\d+)\/([A-Za-z0-9]+)\/\{id\}$/.exec(op.path);
    if (op.method === 'GET' && m && !map.has(m[2])) map.set(m[2], `/${m[1]}/${m[2]}`);
  }
  return map;
})();

/**
 * The attributes Apple uses to name a thing, best first. A resource carries at
 * most a couple of these, so the first hit is the label.
 */
const LABEL_ATTRIBUTES = [
  'name',
  'referenceName',
  'title',
  'versionString',
  'productId',
  'bundleId',
  'fileName',
  'nickname',
  'locale',
  'email',
  'deviceClass',
  'platform',
];

/**
 * Whatever a hand-written resolver does not cover.
 *
 * There are 179 reference types and four resolvers. Writing 175 more was never
 * going to happen, and each would go stale with the spec; this covers the same
 * ground with one call and no per-type maintenance. A hand-written resolver
 * still wins where the good label is not a single attribute — a price point
 * reads as "99.99 TRY (TUR)", which no generic rule would assemble.
 */
async function resolveGeneric(
  http: RefReader,
  type: string,
  id: string
): Promise<string | undefined> {
  const base = GET_BY_ID.get(type);
  if (!base) return undefined;
  const res: any = await http.get(`${base}/${encodeURIComponent(id)}`);
  const attributes = res?.data?.attributes;
  if (!attributes) return undefined;
  for (const key of LABEL_ATTRIBUTES) {
    const value = attributes[key];
    if (typeof value === 'string' && value) return value;
  }
  return undefined;
}

/** True when the preview can put a name, or the id itself, in front of a user. */
function resolvable(type: string): boolean {
  return Boolean(REF_RESOLVERS[type]) || SELF_DESCRIBING.has(type) || GET_BY_ID.has(type);
}

/** Collects every {type,id} reference in a JSON:API body. */
function collectRefs(node: unknown, refs: Array<{ type: string; id: string }>): void {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    node.forEach((n) => collectRefs(n, refs));
    return;
  }
  const rec = node as Record<string, unknown>;
  if (typeof rec.type === 'string' && typeof rec.id === 'string' && resolvable(rec.type)) {
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
  return resolveRefs(http, refs);
}

/**
 * The `{id}` in the path, as a reference the resolver understands.
 *
 * `PATCH /v1/apps/{id}` names the app it is about to change and the preview
 * printed the raw id — the one line in the prompt that says *which* thing is
 * being written to was the one line nobody could read. The segment before the
 * placeholder is the JSON:API type in Apple's spec, including on a nested path
 * (`/v1/apps/{id}/relationships/betaTesters` is still an app), so the type
 * comes from the path rather than from a table that would need maintaining.
 */
export function pathTargets(
  path: string,
  args: Record<string, unknown>
): Array<{ type: string; id: string; param: string }> {
  const targets: Array<{ type: string; id: string; param: string }> = [];
  const segments = path.split('/');
  segments.forEach((segment, i) => {
    const param = /^\{(.+)\}$/.exec(segment)?.[1];
    const type = segments[i - 1];
    const value = param ? args[param] : undefined;
    if (param && type && typeof value === 'string' && resolvable(type)) {
      targets.push({ type, id: value, param });
    }
  });
  return targets;
}

async function resolveRefs(
  http: RefReader,
  refs: Array<{ type: string; id: string }>
): Promise<Map<string, string>> {
  const seen = new Set<string>();
  const unique = refs.filter((r) => {
    const key = `${r.type}/${r.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const labels = new Map<string, string>();
  // A self-describing id needs no call, so it does not spend one of the four.
  const needLookup = unique.filter((r) => !SELF_DESCRIBING.has(r.type));

  const lookups = Promise.all(
    needLookup.slice(0, MAX_REF_LOOKUPS).map(async ({ type, id }) => {
      try {
        const label = REF_RESOLVERS[type]
          ? await REF_RESOLVERS[type](http, id)
          : await resolveGeneric(http, type, id);
        if (label) labels.set(`${type}/${id}`, label);
      } catch {
        // Best-effort display only — the raw id stays in the preview.
      }
    })
  );

  // Whichever labels have landed by the deadline are the ones shown. The map is
  // filled in place, so a lookup that finishes first still counts even when a
  // slower sibling is what runs out of time.
  await Promise.race([
    lookups,
    new Promise<void>((resolve) => setTimeout(resolve, LABEL_DEADLINE_MS).unref()),
  ]);
  return labels;
}

const isScalar = (v: unknown): boolean =>
  typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean';

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

  // Path targets and body references share one lookup budget and one deadline,
  // so naming the target costs no extra wait on a write that also carries a
  // body — and a write with no body finally names its target at all.
  const body = (args.body as any)?.data;
  const targets = pathTargets(op.path, args);
  const bodyRefs: Array<{ type: string; id: string }> = [];
  if (body) collectRefs(body, bodyRefs);
  const labels = http ? await resolveRefs(http, [...targets, ...bodyRefs]) : new Map<string, string>();

  const ids = Object.entries(args)
    .filter(([k, v]) => k !== 'body' && typeof v === 'string' && op.path.includes(`{${k}}`))
    .map(([k, v]) => {
      const label = labels.get(`${targets.find((t) => t.param === k)?.type}/${v}`);
      return label ? `${k} = ${v} (${label})` : `${k} = ${v}`;
    });
  if (ids.length) lines.push(`Target:     ${ids.join(', ')}`);
  if (account) lines.push(`Account:    ${account}`);

  if (body) {
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
  } else {
    // A macro has no JSON:API body — its arguments *are* the human-readable
    // facts (app name, locale, device size, file path). Without this the prompt
    // asks someone to approve a bare operation line.
    const flat = Object.entries(args)
      .filter(([k, v]) => k !== 'body' && !op.path.includes(`{${k}}`) && isScalar(v))
      .map(([k, v]) => `${k}: ${String(v)}`);
    if (flat.length) {
      lines.push('Changes:');
      for (const c of flat.slice(0, MAX_CHANGE_LINES)) lines.push(`  ${c}`);
      if (flat.length > MAX_CHANGE_LINES) lines.push('  …');
    }
  }

  lines.push(`Risk:       ${risk} — ${REVERSIBILITY[risk]}`);
  if (strong) lines.push('', 'Type CONFIRM in the field below to proceed.');

  return { message: lines.join('\n'), strong };
}

/**
 * Decides whether a write may proceed. Only reached when confirmation is on.
 * Pure but for the injected confirmer, so tests drive it with a fake.
 */
export async function confirmWrite(
  confirmer: WriteConfirmer,
  toolName: string,
  preview?: WritePreview
): Promise<ConfirmDecision> {
  if (!confirmer.getClientCapabilities()?.elicitation?.form) {
    // No way to ask. The user asked for a guard, so say it can't run here
    // rather than proceeding under a guard that silently stopped guarding.
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
