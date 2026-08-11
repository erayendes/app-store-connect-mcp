/**
 * Pricing macro tools — the one-call answer to a multi-call flow.
 *
 * Changing a subscription price through the raw 1:1 tools takes four reads
 * (app → subscription groups → subscriptions → 842 price points) before the
 * one write, which is why agents preferred single-call competitors. This layer
 * does the resolution internally and never shows the price-point haystack to
 * the model. The raw tools stay untouched — this is an opt-in layer on top,
 * like reviews-ai.
 *
 * Every input is human-friendly (app name/bundle id, product id, "99.99") and
 * preserve_current_price is a REQUIRED parameter: the agent has to surface
 * that customer-facing decision instead of silently picking a default.
 */
import type { McpToolDefinition } from '../core/registry.js';
import type { AscHttpClient } from '../core/http.js';
import { AscApiError } from '../core/errors.js';

export const PRICING_TOOLS: McpToolDefinition[] = [
  {
    name: 'pricing__set_subscription_price',
    description:
      'Change or set a subscription price in one territory (country) in a single step. ' +
      'Give it the app (name, bundle ID or Apple ID), the subscription (product ID or ' +
      'name), the territory (e.g. TUR, USA) and the price (e.g. "99.99") — it resolves ' +
      'the app, subscription and Apple price point internally and performs the one ' +
      'write. Use this instead of chaining apps__list / subscription_groups / ' +
      'price_points calls when the goal is simply "set/raise/lower the price".',
    inputSchema: {
      type: 'object',
      properties: {
        app: {
          type: 'string',
          description: 'App name, bundle ID (com.example.app) or numeric Apple ID.',
        },
        subscription: {
          type: 'string',
          description: 'Subscription product ID (e.g. com.example.pro.monthly) or its reference name.',
        },
        territory: {
          type: 'string',
          description: 'Territory (country) code, e.g. TUR, USA, DEU.',
        },
        price: {
          type: 'string',
          description: 'Customer price in the territory\'s currency, e.g. "99.99". Must match an Apple price point exactly; if it does not exist, the nearest available prices are suggested.',
        },
        preserve_current_price: {
          type: 'boolean',
          description:
            'REQUIRED decision about existing subscribers: true = they keep their current ' +
            'price; false = they WILL be moved to the new price. Ask the user if unsure.',
        },
        start_date: {
          type: 'string',
          description: 'Optional start date (YYYY-MM-DD). Omit to apply as soon as possible.',
        },
      },
      required: ['app', 'subscription', 'territory', 'price', 'preserve_current_price'],
    },
    annotations: { readOnlyHint: false, idempotentHint: false },
  },
  {
    name: 'pricing__get_subscription_price',
    description:
      'What a subscription costs customers today — in one country, or in every country at ' +
      'once. Give the app (name, bundle ID or Apple ID); both other arguments are optional. ' +
      'Omit the territory to get worldwide pricing, grouped by price so the answer stays ' +
      'readable, with the currency and the country codes in each group. Omit the ' +
      'subscription to cover every subscription in the app, which is how you answer "what ' +
      'does the weekly one cost" without knowing its product ID. Use this instead of ' +
      'chaining apps__list / subscription_groups / prices calls. It also returns the price ' +
      'actually in effect: subscriptions__prices__list returns price-less stubs unless the ' +
      'caller knows to include the price point.',
    inputSchema: {
      type: 'object',
      properties: {
        app: {
          type: 'string',
          description: 'App name, bundle ID (com.example.app) or numeric Apple ID.',
        },
        territory: {
          type: 'string',
          description:
            'Optional. Territory (country) code — three letters, ISO-3166 alpha-3: USA, ' +
            'TUR, DEU. Omit it for every country Apple sells in (about 175), grouped by price.',
        },
        subscription: {
          type: 'string',
          description:
            'Optional. Product ID or reference name. Omit to return every subscription ' +
            'in the app.',
        },
      },
      required: ['app'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        app: { type: 'string', description: 'Resolved app, as "Name (id)".' },
        territory: {
          type: 'string',
          description: 'The country asked about, or "worldwide" when none was given.',
        },
        prices: {
          type: 'array',
          description: 'One row per subscription. Empty when the app has none.',
          items: {
            type: 'object',
            properties: {
              subscription: { type: 'string', description: 'Product ID, or the reference name when there is none.' },
              name: { type: 'string' },
              customerPrice: {
                type: ['string', 'null'],
                description: 'Single-country mode only. What the customer pays today; null when no price is in effect here.',
              },
              proceeds: { type: 'string', description: 'What Apple pays out, after its cut.' },
              note: { type: 'string', description: 'Present instead of proceeds when there is no price in effect.' },
              territoryCount: {
                type: 'number',
                description: 'Worldwide mode only. How many countries carry a price for this subscription.',
              },
              byPrice: {
                type: 'array',
                description:
                  'Worldwide mode only. One entry per distinct price+currency, biggest group ' +
                  'first. Countries share prices heavily — a real weekly subscription has 45 ' +
                  'distinct prices across 175 countries, and 91 of those countries sit in one ' +
                  'group — so this is the whole picture without a row per country.',
                items: {
                  type: 'object',
                  properties: {
                    customerPrice: { type: ['string', 'null'] },
                    currency: { type: ['string', 'null'], description: 'ISO currency of that price, e.g. USD, TRY.' },
                    proceeds: { type: ['string', 'null'] },
                    countries: { type: 'number' },
                    territories: {
                      type: 'array',
                      description: 'The alpha-3 codes in this group.',
                      items: { type: 'string' },
                    },
                  },
                  required: ['customerPrice', 'countries', 'territories'],
                },
              },
              scheduledChanges: {
                type: 'array',
                description: 'Future-dated prices Apple has accepted but not applied yet.',
                items: {
                  type: 'object',
                  properties: {
                    customerPrice: { type: ['string', 'null'] },
                    proceeds: { type: ['string', 'null'] },
                    startDate: { type: ['string', 'null'] },
                    scheduled: { type: 'boolean' },
                  },
                },
              },
            },
            required: ['subscription', 'name'],
          },
        },
        note: { type: 'string', description: 'Present when the app has no subscriptions at all.' },
      },
      required: ['app', 'territory', 'prices'],
    },
    annotations: { readOnlyHint: true, idempotentHint: true },
  },
];

export const PRICING_TOOL_NAMES = new Set(PRICING_TOOLS.map((t) => t.name));

export interface PricingContext {
  http: AscHttpClient;
  /** Mirrors --dry-run: resolve everything, write nothing. */
  dryRun?: boolean;
}

/** Normalises "99,99" / " 99.99 " to a canonical dotted string. */
export function normalizePrice(input: string): string {
  return input.trim().replace(',', '.');
}

async function resolveApp(http: AscHttpClient, app: string): Promise<{ id: string; name: string }> {
  const wanted = app.trim();
  if (/^\d+$/.test(wanted)) {
    const res: any = await http.get(`/v1/apps/${encodeURIComponent(wanted)}`);
    if (!res?.data) throw new AscApiError(`No app with Apple ID ${wanted}.`, 0);
    return { id: res.data.id, name: res.data.attributes?.name ?? wanted };
  }
  if (wanted.includes('.')) {
    const res: any = await http.get('/v1/apps', { 'filter[bundleId]': wanted });
    const hit = res?.data?.[0];
    if (!hit) throw new AscApiError(`No app with bundle ID "${wanted}".`, 0);
    return { id: hit.id, name: hit.attributes?.name ?? wanted };
  }
  const res: any = await http.get('/v1/apps', { limit: 200 });
  const needle = wanted.toLowerCase();
  const hits = (res?.data ?? []).filter((a: any) =>
    String(a.attributes?.name ?? '').toLowerCase().includes(needle)
  );
  if (hits.length === 1) return { id: hits[0].id, name: hits[0].attributes.name };
  if (hits.length === 0) throw new AscApiError(`No app matching "${wanted}".`, 0);
  throw new AscApiError(
    `App name "${wanted}" is ambiguous: ${hits.map((h: any) => h.attributes.name).join(' | ')}. ` +
      `Use the bundle ID or Apple ID.`,
    0
  );
}

interface Subscription {
  id: string;
  name: string;
  productId: string;
}

/** Every subscription in the app, in one call — groups carry them as includes. */
async function listSubscriptions(http: AscHttpClient, appId: string): Promise<Subscription[]> {
  const groups: any = await http.get(`/v1/apps/${encodeURIComponent(appId)}/subscriptionGroups`, {
    include: 'subscriptions',
    limit: 50,
  });
  return (groups?.included ?? [])
    .filter((i: any) => i.type === 'subscriptions')
    .map((s: any) => ({
      id: String(s.id),
      name: String(s.attributes?.name ?? ''),
      productId: String(s.attributes?.productId ?? ''),
    }));
}

async function resolveSubscription(
  http: AscHttpClient,
  appId: string,
  subscription: string
): Promise<Subscription> {
  const subs = await listSubscriptions(http, appId);
  const wanted = subscription.trim().toLowerCase();
  const match =
    subs.find((s) => s.productId.toLowerCase() === wanted) ??
    subs.find((s) => s.name.toLowerCase() === wanted) ??
    subs.find((s) => s.name.toLowerCase().includes(wanted)) ??
    subs.find((s) => s.productId.toLowerCase().includes(wanted));
  if (!match) {
    const available = subs.map((s) => `${s.productId} ("${s.name}")`).join(', ');
    throw new AscApiError(
      `No subscription matching "${subscription}" in this app. Available: ${available || 'none'}.`,
      0
    );
  }
  return match;
}

async function resolvePricePoint(
  http: AscHttpClient,
  subscriptionId: string,
  territory: string,
  price: string
): Promise<{ id: string; customerPrice: string }> {
  const target = Number(normalizePrice(price));
  // The haystack (800+ points per territory) stays inside this function; the
  // model never sees it.
  const { items } = await http.collect<any>(
    `/v1/subscriptions/${encodeURIComponent(subscriptionId)}/pricePoints`,
    { 'filter[territory]': territory.toUpperCase(), limit: 200 },
    10
  );
  const points = items.map((p: any) => ({
    id: String(p.id),
    customerPrice: String(p.attributes?.customerPrice ?? ''),
    value: Number(p.attributes?.customerPrice),
  }));
  const exact = points.find((p) => p.value === target);
  if (exact) return exact;

  const sorted = points.filter((p) => Number.isFinite(p.value)).sort((a, b) => a.value - b.value);
  const below = [...sorted].reverse().find((p) => p.value < target);
  const above = sorted.find((p) => p.value > target);
  const nearest = [below?.customerPrice, above?.customerPrice].filter(Boolean).join(', ');
  throw new AscApiError(
    `${normalizePrice(price)} is not an available Apple price point for this subscription in ` +
      `${territory.toUpperCase()}${nearest ? `; nearest available: ${nearest}` : ''}. ` +
      `Apple only allows prices from its fixed tiers.`,
    0
  );
}

/**
 * Human-language preview for the confirmation prompt — the parameters already
 * carry the meaning, no reference resolution needed.
 */
export function buildPricingPreview(args: Record<string, unknown>): string {
  const preserve = args.preserve_current_price === true;
  return [
    `Heimdall is about to change a subscription price — a REVENUE-level write.`,
    '',
    `App:          ${String(args.app ?? '?')}`,
    `Subscription: ${String(args.subscription ?? '?')}`,
    `New price:    ${normalizePrice(String(args.price ?? '?'))} (${String(args.territory ?? '?').toUpperCase()})`,
    ...(args.start_date ? [`Starts:       ${String(args.start_date)}`] : []),
    preserve
      ? `Subscribers:  existing subscribers keep their current price.`
      : `Subscribers:  ⚠ existing subscribers WILL be moved to the new price.`,
    '',
    'Type CONFIRM in the field below to proceed.',
  ].join('\n');
}

/**
 * Current price of one subscription in one territory.
 *
 * `/prices` on its own answers with stubs: relationship links and nothing a
 * person could read. The price lives on the related price point, so the include
 * is not an optimisation — without it the response contains no price at all,
 * which is how a model ends up reporting "no price configured" for a territory
 * that has one. Apple also returns scheduled future prices here, so a row is
 * only in effect if its start date has passed.
 */
async function readPrice(
  http: AscHttpClient,
  sub: Subscription,
  territory: string,
  today: string
): Promise<Record<string, unknown>> {
  const res: any = await http.get(`/v1/subscriptions/${encodeURIComponent(sub.id)}/prices`, {
    'filter[territory]': territory,
    include: 'subscriptionPricePoint',
    limit: 200,
  });

  const points = new Map<string, any>(
    (res?.included ?? [])
      .filter((i: any) => i.type === 'subscriptionPricePoints')
      .map((p: any) => [String(p.id), p.attributes])
  );

  const rows = (res?.data ?? []).map((row: any) => {
    const startDate = row.attributes?.startDate ?? null;
    const point = points.get(String(row.relationships?.subscriptionPricePoint?.data?.id ?? ''));
    return {
      customerPrice: point?.customerPrice ?? null,
      proceeds: point?.proceeds ?? null,
      startDate,
      scheduled: Boolean(startDate) && startDate > today,
    };
  });

  const current = rows.find((r: any) => !r.scheduled);
  return {
    subscription: sub.productId || sub.name,
    name: sub.name,
    ...(current
      ? { customerPrice: current.customerPrice, proceeds: current.proceeds }
      : { customerPrice: null, note: `No price in effect in ${territory}.` }),
    ...(rows.some((r: any) => r.scheduled)
      ? { scheduledChanges: rows.filter((r: any) => r.scheduled) }
      : {}),
  };
}

/**
 * The same question without a territory filter: what this subscription costs
 * everywhere.
 *
 * Grouped by price rather than listed per country, and that is the load-bearing
 * decision. Apple sells in about 175 territories and one subscription has a row
 * in each; eight subscriptions is fourteen hundred rows, which is the AI-177
 * shape all over again — a live eval session asked exactly this question, got
 * the raw chain, and spent 1.02M tokens writing the answer to a CSV and a
 * hand-built country dictionary because the response did not fit its head.
 * Most countries share a price, so grouping loses nothing and costs far less:
 * measured live on one weekly subscription, 175 territories collapse to 45
 * distinct prices — 91 countries alone share 4.99 USD — and the whole answer is
 * about 1.3k tokens. Every code is still listed inside its group.
 *
 * The currency comes from the `territory` include and is the other half of the
 * answer — "19.99" means nothing without knowing it is AED.
 */
async function readPricesWorldwide(
  http: AscHttpClient,
  sub: Subscription,
  today: string
): Promise<Record<string, unknown>> {
  // One call, not `collect`: the prices and the currencies arrive in
  // `included`, which `collect` drops when it concatenates pages. Apple returns
  // all ~175 territories inside limit=200, so a second page is not a case that
  // happens — but `links.next` is checked below rather than assumed away.
  const res: any = await http.get(`/v1/subscriptions/${encodeURIComponent(sub.id)}/prices`, {
    include: 'territory,subscriptionPricePoint',
    limit: 200,
  });
  const items: any[] = res?.data ?? [];
  const hasMore = Boolean(res?.links?.next);
  const points = new Map<string, any>(
    (res?.included ?? [])
      .filter((i: any) => i.type === 'subscriptionPricePoints')
      .map((p: any) => [String(p.id), p.attributes])
  );
  const currencyOf = new Map<string, string>(
    (res?.included ?? [])
      .filter((i: any) => i.type === 'territories')
      .map((t: any) => [String(t.id), String(t.attributes?.currency ?? '')])
  );

  type Group = { customerPrice: string | null; currency: string | null; proceeds: string | null; territories: string[] };
  const groups = new Map<string, Group>();
  let scheduled = 0;

  for (const row of items) {
    const startDate = row.attributes?.startDate ?? null;
    // A future-dated row is not what customers pay today. Counted, not shown:
    // naming every scheduled change per country would undo the grouping.
    if (startDate && startDate > today) {
      scheduled++;
      continue;
    }
    const code = String(row.relationships?.territory?.data?.id ?? '');
    const point = points.get(String(row.relationships?.subscriptionPricePoint?.data?.id ?? ''));
    const customerPrice = point?.customerPrice ?? null;
    const currency = currencyOf.get(code) ?? null;
    const key = `${customerPrice}|${currency}`;
    const group: Group = groups.get(key) ?? {
      customerPrice,
      currency,
      proceeds: point?.proceeds ?? null,
      territories: [],
    };
    if (code) group.territories.push(code);
    groups.set(key, group);
  }

  const byPrice = [...groups.values()]
    .map((g) => ({ ...g, countries: g.territories.length, territories: g.territories.sort() }))
    .sort((a, b) => b.countries - a.countries);

  return {
    subscription: sub.productId || sub.name,
    name: sub.name,
    territoryCount: byPrice.reduce((n, g) => n + g.countries, 0),
    byPrice,
    ...(scheduled ? { note: `${scheduled} future-dated price change(s) not shown; ask about one country to see them.` } : {}),
    ...(hasMore
      ? { truncated: 'Apple paged beyond this macro\'s limit; some countries are missing.' }
      : {}),
  };
}

export async function executePricingTool(
  name: string,
  args: Record<string, unknown>,
  ctx: PricingContext
): Promise<unknown> {
  if (name === 'pricing__get_subscription_price') {
    if (!args.app || typeof args.app !== 'string') {
      throw new AscApiError('"app" is required.', 0);
    }

    // Omitted means worldwide. Present means one country, and then it has to be
    // alpha-3: two letters is not an error at Apple — it is 200 and an empty
    // list, which reads as "this country has no price". Stopping it here is the
    // difference between an error and a confident wrong answer.
    const wantsOne = typeof args.territory === 'string' && args.territory.trim() !== '';
    const territory = wantsOne ? String(args.territory).trim().toUpperCase() : undefined;
    if (territory && territory.length !== 3) {
      throw new AscApiError(
        `"${args.territory}" is not a territory code. Apple wants three letters ` +
          `(ISO-3166 alpha-3): USA, TUR, DEU — not US, TR, DE. A two-letter code is ` +
          `accepted by the API and silently returns nothing. Omit it entirely for ` +
          `every country at once.`,
        0
      );
    }

    const app = await resolveApp(ctx.http, String(args.app));
    const subs = args.subscription
      ? [await resolveSubscription(ctx.http, app.id, String(args.subscription))]
      : await listSubscriptions(ctx.http, app.id);
    const scope = territory ?? 'worldwide';
    if (!subs.length) {
      return {
        app: `${app.name} (${app.id})`,
        territory: scope,
        prices: [],
        note: 'This app has no subscriptions.',
      };
    }

    const today = new Date().toISOString().slice(0, 10);
    const prices = [];
    for (const sub of subs) {
      prices.push(
        territory
          ? await readPrice(ctx.http, sub, territory, today)
          : await readPricesWorldwide(ctx.http, sub, today)
      );
    }

    return { app: `${app.name} (${app.id})`, territory: scope, prices };
  }

  if (name !== 'pricing__set_subscription_price') {
    throw new Error(`Unknown pricing tool: ${name}`);
  }

  for (const field of ['app', 'subscription', 'territory', 'price'] as const) {
    if (!args[field] || typeof args[field] !== 'string') {
      throw new AscApiError(`"${field}" is required.`, 0);
    }
  }
  if (typeof args.preserve_current_price !== 'boolean') {
    throw new AscApiError(
      '"preserve_current_price" is required: true keeps existing subscribers on their ' +
        'current price, false moves them to the new price. Ask the user which they want.',
      0
    );
  }

  const app = await resolveApp(ctx.http, String(args.app));
  const sub = await resolveSubscription(ctx.http, app.id, String(args.subscription));
  const point = await resolvePricePoint(
    ctx.http,
    sub.id,
    String(args.territory),
    String(args.price)
  );

  const body = {
    data: {
      type: 'subscriptionPrices',
      attributes: {
        preserveCurrentPrice: args.preserve_current_price,
        ...(args.start_date ? { startDate: String(args.start_date) } : {}),
      },
      relationships: {
        subscription: { data: { type: 'subscriptions', id: sub.id } },
        subscriptionPricePoint: { data: { type: 'subscriptionPricePoints', id: point.id } },
      },
    },
  };

  const resolved = {
    app: `${app.name} (${app.id})`,
    subscription: `${sub.name} (${sub.productId})`,
    price: `${point.customerPrice} (${String(args.territory).toUpperCase()})`,
    preserveCurrentPrice: args.preserve_current_price,
    ...(args.start_date ? { startDate: String(args.start_date) } : {}),
  };

  if (ctx.dryRun) {
    return {
      dryRun: true,
      note: 'Dry-run mode: the price change was fully resolved but NOT sent to Apple.',
      resolved,
      wouldSend: { method: 'POST', path: '/v1/subscriptionPrices', body },
      risk: 'revenue',
    };
  }

  await ctx.http.post('/v1/subscriptionPrices', body);
  return {
    ok: true,
    changed: resolved,
    note:
      'Price change submitted. Apple applies it per its own schedule; check ' +
      'subscriptions__prices__list to see current and scheduled prices.',
  };
}
