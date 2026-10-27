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
 * On by default for those four levels, plus the handful of release steps that
 * reach users (risk.ts, ASK_BY_DEFAULT), and that split was paid for twice.
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
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import {
  acceptedContent,
  createRequestStateCodec,
  inputRequired,
  type ElicitRequestFormParams,
  type InputRequiredResult,
  type ServerContext,
} from '@modelcontextprotocol/server';
import { STRONG_CONFIRM_LEVELS, TYPED_BY_NAME, consequenceFor, type RiskLevel } from './risk.js';
import { OPERATIONS } from '../generated/operations.js';
import { REVIEW_RESOURCE_TYPES } from '../tools/release.js';
import type { DialogText } from './native-confirm.js';

export interface ConfirmDecision {
  allowed: boolean;
  /** Signed review-item snapshot approved by the user, when this is a release macro. */
  planFingerprint?: string;
  /** Present when blocked: the client's action ('decline', 'cancel'), what the answer lacked, or why a stale answer was refused. */
  reason?: string;
  /** The answer was for another call, or already spent: ask again rather than blame the user. */
  stale?: true;
  /** Approved by typing CONFIRM rather than ticking a box. */
  strong?: boolean;
}

/** What the user sees before approving a write. */
export interface WritePreview {
  message: string;
  /** True for high-stakes levels: the user must type CONFIRM, not tick a box. */
  strong: boolean;
  /** The macOS dialog's own text, when the tool can say it better than the form preview. */
  dialog?: DialogText;
  /** The dialog's question, when the body decides what the write does (pause or resume, submit or withdraw). */
  title?: string;
}

/**
 * The question and its consequence for writes whose body decides what they
 * do. These all ask in the default mode (risk.ts, ASK_BY_DEFAULT), and their
 * one-line summaries cover every case at once: "Pause, resume or complete…".
 */
function questionFor(
  toolName: string,
  data: any,
  labelOf: (type: string, id: string) => string | undefined
): { title?: string; consequence?: string } {
  const a = data?.attributes ?? {};
  const rel = (name: string): string | undefined => {
    const r = data?.relationships?.[name]?.data;
    return r && !Array.isArray(r) ? labelOf(r.type, r.id) : undefined;
  };
  const yes = (v: unknown) => v === true || v === 'true';
  switch (toolName) {
    // Summaries that read as a manual, or start with a verb no button can carry.
    case 'review_submission_items__delete':
      return { title: 'Remove this item from the submission?' };
    case 'subscription_plan_availabilities__create':
      return { title: 'Change where the subscription is sold?' };
    case 'subscription_prices__delete':
      return { title: 'Remove the scheduled price change?', consequence: 'The current price stays; the change can be scheduled again.' };
    case 'profiles__create':
      return { title: 'Create the provisioning profile?' };
    case 'review_submissions__update':
      if (yes(a.canceled)) return { title: 'Withdraw this submission from App Review?', consequence: 'You can submit it again later.' };
      return yes(a.submitted) ? { title: 'Submit this submission to App Review?' } : {};
    case 'app_store_version_release_requests__create': {
      const version = rel('appStoreVersion');
      return { title: version ? `Release version ${version} on the App Store now?` : 'Release this version on the App Store now?' };
    }
    case 'app_store_version_phased_releases__update':
      if (a.phasedReleaseState === 'PAUSED') return { title: 'Pause the phased release?', consequence: 'Automatic updates stop; people can still download it.' };
      if (a.phasedReleaseState === 'ACTIVE') return { title: 'Resume the phased release?', consequence: 'Automatic updates continue where they stopped.' };
      if (a.phasedReleaseState === 'COMPLETE') return { title: 'Release the update to all users now?', consequence: 'The rollout can’t be restarted.' };
      return { title: 'Change the phased release?' };
    case 'beta_app_review_submissions__create': {
      const build = rel('build');
      return { title: build ? `Send build ${build} to TestFlight review?` : 'Send this build to TestFlight review?' };
    }
    case 'territory_availabilities__update':
      if (a.available === false) return { title: 'Stop selling the app in this country?', consequence: 'New customers there can no longer download it.' };
      return a.available === true ? { title: 'Start selling the app in this country?' } : {};
    case 'end_app_availability_pre_orders__create':
      return { title: 'End the pre-order and release the app now?' };
    case 'app_store_version_experiments_v2__update':
      return yes(a.started) ? { title: 'Start the product page test?' } : {};
    case 'game_center_leaderboard_entry_submissions__create':
      return { title: a.score !== undefined ? `Post a score of ${a.score} for a player?` : 'Post a score for a player?' };
    case 'game_center_player_achievement_submissions__create':
      return { title: a.percentageAchieved !== undefined ? `Post ${a.percentageAchieved}% achievement progress for a player?` : 'Post achievement progress for a player?' };
    case 'builds__update':
      return yes(a.expired) ? { title: 'Expire this build?' } : {};
    case 'subscription_versions__create':
    case 'subscription_group_versions__create':
    case 'in_app_purchase_versions__create': {
      const owner = rel('subscription') ?? rel('subscriptionGroup') ?? rel('inAppPurchase');
      return { title: owner ? `Create a review version for "${owner}"?` : 'Create a review version?' };
    }
  }
  return {};
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

/**
 * `progress` lets a resolver that needs several reads show what it has so far:
 * the deadline below cuts lookups off, and half a label beats the raw id.
 */
type RefResolver = (
  http: RefReader,
  id: string,
  progress?: (label: string) => void
) => Promise<string | undefined>;

/** From a version page's locale up to its version and app: two reads, prepended to `where`. */
async function versionPageContext(
  http: RefReader,
  localizationId: string,
  where: string[],
  say: (where: string[]) => void
): Promise<void> {
  const withVersion: any = await http.get(`/v1/appStoreVersionLocalizations/${encodeURIComponent(localizationId)}`, {
    include: 'appStoreVersion',
  });
  const version = (withVersion?.included ?? []).find((i: any) => i?.type === 'appStoreVersions');
  if (!version?.id) return;
  where.unshift(`version ${version.attributes?.versionString ?? version.id}`);
  say(where);

  const withApp: any = await http.get(`/v1/appStoreVersions/${encodeURIComponent(version.id)}`, { include: 'app' });
  const app = (withApp?.included ?? []).find((i: any) => i?.type === 'apps');
  if (app?.attributes?.name) where.unshift(app.attributes.name);
  say(where);
}

/** What each kind of page an asset library file can be placed on is called in a label. */
const PLACEMENT_PAGES: Record<string, string | undefined> = {
  appStoreVersionLocalizations: undefined,
  appCustomProductPageLocalizations: 'custom product page',
  appStoreVersionExperimentTreatmentLocalizations: 'product page test',
  appEventLocalizations: 'in-app event',
};

/**
 * Asset library images and videos. The file itself records no app — Apple
 * links the library down to its files, never back up — so the label climbs
 * from the file's first placement: page, locale, then version and app. A file
 * placed nowhere says so, which is what a delete prompt most needs to show.
 */
const libraryAsset =
  (type: string): RefResolver =>
  async (http, id, progress) => {
    const res: any = await http.get(`/v1/${type}/${encodeURIComponent(id)}`, { include: 'placements' });
    const a = res?.data?.attributes;
    const name: string | undefined = a?.referenceName || a?.fileName;
    const placements: Array<{ id: string }> = res?.data?.relationships?.placements?.data ?? [];
    const more = placements.length > 1 ? [`and ${placements.length - 1} more`] : [];
    const label = (where: string[]) => [name, where.join(', ')].filter(Boolean).join(' — ') || undefined;
    if (!placements.length) return label(['not placed on any page']);
    if (name) progress?.(name);

    const placement: any = await http.get(`/v1/appAssetLibraryPlacements/${encodeURIComponent(placements[0].id)}`, {
      include:
        'appStoreVersionLocalization,appCustomProductPageLocalization,appStoreVersionExperimentTreatmentLocalization,appEventLocalization',
    });
    const page = (placement?.included ?? []).find((i: any) => i?.type in PLACEMENT_PAGES);
    const where: string[] = [placement?.data?.attributes?.placementType].filter(Boolean);
    if (page?.attributes?.locale) where.unshift(page.attributes.locale);
    if (PLACEMENT_PAGES[page?.type]) where.unshift(PLACEMENT_PAGES[page.type]!);
    let current = label([...where, ...more]);
    if (current) progress?.(current);
    if (page?.type === 'appStoreVersionLocalizations') {
      await versionPageContext(http, page.id, where, (w) => {
        current = label([...w, ...more]);
        if (current) progress?.(current);
      });
    }
    return current;
  };

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
  subscriptionVersions: async (http, id) => {
    const res: any = await http.get(`/v1/subscriptionVersions/${encodeURIComponent(id)}`, { include: 'subscription' });
    const a = res?.data?.attributes;
    const product = (res?.included ?? []).find((x: any) => x.type === 'subscriptions')?.attributes?.name;
    return `${product ?? 'Subscription'} — version ${a?.version ?? '?'} (${a?.state ?? 'unknown'})`;
  },
  subscriptionGroupVersions: async (http, id) => {
    const res: any = await http.get(`/v1/subscriptionGroupVersions/${encodeURIComponent(id)}`, { include: 'subscriptionGroup' });
    const a = res?.data?.attributes;
    const product = (res?.included ?? []).find((x: any) => x.type === 'subscriptionGroups')?.attributes?.referenceName;
    return `${product ?? 'Subscription group'} — version ${a?.version ?? '?'} (${a?.state ?? 'unknown'})`;
  },
  inAppPurchaseVersions: async (http, id) => {
    const res: any = await http.get(`/v1/inAppPurchaseVersions/${encodeURIComponent(id)}`, { include: 'inAppPurchase' });
    const a = res?.data?.attributes;
    const product = (res?.included ?? []).find((x: any) => x.type === 'inAppPurchases')?.attributes?.name;
    return `${product ?? 'In-app purchase'} — version ${a?.version ?? '?'} (${a?.state ?? 'unknown'})`;
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
  appAssetLibraryImages: libraryAsset('appAssetLibraryImages'),
  appAssetLibraryVideos: libraryAsset('appAssetLibraryVideos'),
};

/**
 * A macro's `app` argument as a person knows it. Macros take a name, bundle ID
 * or Apple ID, and an agent often passes the Apple ID: "App: 6636549188" asked
 * for a release to be approved for an app nobody could name. Best-effort under
 * the label deadline; the argument as given when the lookup fails or is slow.
 */
export async function withAppName(
  args: Record<string, unknown>,
  http?: RefReader
): Promise<Record<string, unknown>> {
  const app = typeof args.app === 'string' ? args.app.trim() : '';
  if (!http || !/^\d+$/.test(app)) return args;
  const label = await Promise.race([
    REF_RESOLVERS.apps(http, app).catch(() => undefined),
    new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), LABEL_DEADLINE_MS).unref()),
  ]);
  return label ? { ...args, app: label } : args;
}

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
  'version',
  'productId',
  'bundleId',
  'fileName',
  'nickname',
  'locale',
  'email',
  'username',
  'deviceClass',
  'platform',
  // An asset library placement has no name; what it is placed as is the label.
  'placementType',
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
        const key = `${type}/${id}`;
        const label = REF_RESOLVERS[type]
          ? await REF_RESOLVERS[type](http, id, (partial) => labels.set(key, partial))
          : await resolveGeneric(http, type, id);
        if (label) labels.set(key, label);
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
  const strong = STRONG_CONFIRM_LEVELS.has(risk) || TYPED_BY_NAME.has(toolName);

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
  const submissionItems = Array.isArray(args.items) ? args.items as Array<{ type: string; id: string }> : [];
  const itemNames = (args.itemNames ?? {}) as Record<string, string>;
  for (const item of submissionItems) {
    const type = REVIEW_RESOURCE_TYPES[item.type];
    if (type && !itemNames[`${item.type}/${item.id}`]) bodyRefs.push({ type, id: item.id });
  }
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
    if (Array.isArray(args.items)) {
      lines.push('Items in submission:');
      const existing = new Set((Array.isArray(args.existingItems) ? args.existingItems : []).map((i: any) => `${i.type}/${i.id}`));
      for (const item of submissionItems) {
        const key = `${item.type}/${item.id}`;
        const label = itemNames[key] ?? labels.get(`${REVIEW_RESOURCE_TYPES[item.type]}/${item.id}`);
        lines.push(`  ${item.type ?? 'unknown'}: ${item.id ?? 'unknown'}${label ? ` (${label})` : ''} — ${existing.has(key) ? 'already in submission' : 'will be added'}`);
      }
    }
  }

  const question = questionFor(toolName, body, (type, id) => labels.get(`${type}/${id}`));
  lines.push(`Risk:       ${risk} — ${question.consequence ?? consequenceFor(toolName, risk, op.method)}`);
  if (strong) lines.push('', 'Type CONFIRM in the field below to proceed.');

  return { message: lines.join('\n'), strong, ...(question.title ? { title: question.title } : {}) };
}

/** What the signed `requestState` carries from the prompt to the retry. */
interface PendingWrite {
  /** The call the user was shown: tool name and a hash of its arguments. */
  call: string;
  nonce: string;
  strong: boolean;
  planFingerprint?: string;
}

/** Key order is not meaning: a client that re-serializes the arguments still matches. */
const canonical = (v: unknown): unknown =>
  Array.isArray(v)
    ? v.map(canonical)
    : v && typeof v === 'object'
      ? Object.fromEntries(
          Object.keys(v)
            .sort()
            .map((k) => [k, canonical((v as Record<string, unknown>)[k])])
        )
      : v;

const fingerprint = (name: string, args: unknown): string =>
  createHash('sha256')
    .update(JSON.stringify([name, canonical(args ?? {})]))
    .digest('base64url');

/** How long a prompt stays answerable — the codec's own default, mirrored for the nonce map. */
const PROMPT_TTL_MS = 600_000;

/**
 * Asks before a write, the 2026-07-28 way: the handler returns the question
 * (`inputRequired`) and the client calls again with the answer. On a 2025-era
 * connection the SDK's legacy shim asks over `elicitation/create` and re-enters
 * the handler itself, so this one path serves both eras.
 *
 * The answer travels through the client, so it is checked on the way back in,
 * not trusted:
 *  - It must answer the call that was previewed. `requestState` is signed and
 *    carries a hash of the tool and its arguments, so a retry with another
 *    price or id is refused rather than run under someone else's yes.
 *  - Each yes is spent once. The nonce is forgotten on first use, so the same
 *    state and the same CONFIRM cannot run the write twice.
 *  - Answers that arrive without our state are ignored: a client cannot skip
 *    the prompt by sending `inputResponses` on the first call.
 *
 * The state is signed, not encrypted — it holds a hash and a nonce, nothing
 * the client should not see. The key is per process, which is enough on stdio:
 * one process serves every round of a flow.
 */
export function createWriteGate(key: Uint8Array = randomBytes(32)) {
  const codec = createRequestStateCodec<PendingWrite>({ key, bind: (ctx) => ctx.mcpReq.method });
  /** Prompts not yet answered: nonce -> expiry. */
  const open = new Map<string, number>();

  return {
    /** For `ServerOptions.requestState.verify`: rejects forged, expired or rebound state. */
    verify: codec.verify,

    /** The question, as a result the client answers by calling again. */
    async ask(ctx: ServerContext, name: string, args: unknown, preview: WritePreview, planFingerprint?: string): Promise<InputRequiredResult> {
      const now = Date.now();
      for (const [n, expiry] of open) if (expiry < now) open.delete(n);
      const nonce = randomUUID();
      open.set(nonce, now + PROMPT_TTL_MS);

      const field: ElicitRequestFormParams['requestedSchema']['properties'] = preview.strong
        ? {
            confirmation: {
              type: 'string',
              title: 'Type CONFIRM to proceed',
              description: `Required for a high-stakes write like "${name}". Anything else cancels.`,
            },
          }
        : {
            confirm: {
              type: 'boolean',
              title: `Allow "${name}"?`,
              description: 'Leave unchecked to cancel this write.',
            },
          };
      return inputRequired({
        inputRequests: {
          confirm: inputRequired.elicit({
            mode: 'form',
            message: preview.message,
            requestedSchema: { type: 'object', properties: field, required: Object.keys(field) },
          }),
        },
        requestState: await codec.mint({ call: fingerprint(name, args), nonce, strong: preview.strong, planFingerprint }, ctx),
      });
    },

    /**
     * The verdict on a retry that carries our state; `undefined` when this is
     * not one yet, so the caller should ask.
     */
    settle(ctx: ServerContext, name: string, args: unknown): ConfirmDecision | undefined {
      const state = ctx.mcpReq.requestState<PendingWrite>();
      if (!state) return undefined;
      // Spent before anything else is checked, so a refused retry cannot be retried.
      const expiry = open.get(state.nonce);
      open.delete(state.nonce);
      if (expiry === undefined || expiry < Date.now()) {
        return {
          allowed: false,
          reason:
            'that confirmation was already used or has expired. This attempt changed nothing, but an ' +
            'earlier attempt with the same confirmation may already have run — check before calling ' +
            'it again for a fresh prompt',
          stale: true,
        };
      }
      if (state.call !== fingerprint(name, args)) {
        return {
          allowed: false,
          reason:
            'the arguments changed after the confirmation prompt. Nothing was changed; call it again ' +
            'to be asked about these arguments',
          stale: true,
        };
      }
      const content = acceptedContent(ctx.mcpReq.inputResponses, 'confirm');
      // The schema is not enforced on the answer, so the type is checked here.
      // A non-unicode /i keeps `ı` and `ſ` from folding into ASCII letters.
      const confirmed = state.strong
        ? typeof content?.confirmation === 'string' && /^confirm$/i.test(content.confirmation.trim())
        : content?.confirm === true;
      if (confirmed) return { allowed: true, strong: state.strong, planFingerprint: state.planFingerprint };
      const action = (ctx.mcpReq.inputResponses?.confirm as { action?: string } | undefined)?.action;
      const unconfirmed = state.strong ? 'the answer was not CONFIRM' : 'the box was left unticked';
      return { allowed: false, reason: content ? unconfirmed : (action ?? 'no answer') };
    },
  };
}

export type WriteGate = ReturnType<typeof createWriteGate>;
