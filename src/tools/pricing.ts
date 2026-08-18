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
import { resolveApp } from '../core/resolve-app.js';
import { TERRITORY_NAMES } from '../core/territory-names.js';

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
    name: 'pricing__equalize_price',
    description:
      'Set one anchor price and let Apple derive the equivalent price in every other ' +
      'country, for an app, an in-app purchase or a subscription. Give the app, which kind ' +
      'of product, the anchor territory (e.g. TUR) and the price (e.g. "99.99"). Apple\'s ' +
      'own currency and tax maths decides each market — a price is NOT copied across ' +
      'currencies, because 4.99 USD is not 4.99 EUR. REVENUE-level write covering about 175 ' +
      'countries; run it under --dry-run first to see the full derived table.',
    inputSchema: {
      type: 'object',
      properties: {
        app: {
          type: 'string',
          description: 'App name, bundle ID (com.example.app) or numeric Apple ID.',
        },
        product_type: {
          type: 'string',
          description:
            'What is being priced. "app" is the app\'s own purchase price, not anything ' +
            'inside it.',
          enum: ['app', 'subscription', 'in_app_purchase'],
        },
        product: {
          type: 'string',
          description:
            'Product ID or reference name of the subscription or in-app purchase. Not used ' +
            'when product_type is "app".',
        },
        territory: {
          type: 'string',
          description:
            'The anchor country whose price you are setting, three letters (ISO-3166 ' +
            'alpha-3): TUR, USA, DEU. Every other country is derived from it.',
        },
        price: {
          type: 'string',
          description:
            'Customer price in the anchor territory\'s currency, e.g. "99.99". Must match an ' +
            'Apple price point exactly; the nearest available are suggested if it does not.',
        },
        preserve_current_price: {
          type: 'boolean',
          description:
            'Subscriptions only, and REQUIRED for them: true = existing subscribers keep ' +
            'their current price; false = they WILL be moved to the new one, in every ' +
            'country. Ask the user if unsure.',
        },
        start_date: {
          type: 'string',
          description: 'Optional start date (YYYY-MM-DD). Omit to apply as soon as possible.',
        },
      },
      required: ['app', 'product_type', 'territory', 'price'],
    },
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false },
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
        country: {
          type: ['string', 'null'],
          description: 'Single-country mode only. That territory\'s English name.',
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
                    countryNames: {
                      type: 'array',
                      description:
                        'English country names, same order as `territories`. Apple returns no ' +
                        'name anywhere, so this is the only place to read one.',
                      items: { type: 'string' },
                    },
                  },
                  required: ['customerPrice', 'countries', 'territories', 'countryNames'],
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


interface Subscription {
  id: string;
  name: string;
  productId: string;
}

/**
 * Every subscription in the app — groups carry them as includes.
 *
 * All the pages of groups, not the first: an app past 50 groups would have
 * produced "No subscription matching…" for a product that exists, and the
 * caller's next move on that message is to create a duplicate.
 *
 * `collect` returns `data` and not `included`, so the pages are walked here to
 * keep each page's includes.
 */
async function listSubscriptions(http: AscHttpClient, appId: string): Promise<Subscription[]> {
  const subs: Subscription[] = [];
  const seen = new Set<string>();
  let next: string | undefined;

  for (let page = 0; page < 10; page++) {
    const res: any = next
      ? await http.request('GET', next)
      : await http.get(`/v1/apps/${encodeURIComponent(appId)}/subscriptionGroups`, {
          include: 'subscriptions',
          limit: 50,
        });
    for (const i of res?.included ?? []) {
      if (i.type !== 'subscriptions' || seen.has(String(i.id))) continue;
      seen.add(String(i.id));
      subs.push({
        id: String(i.id),
        name: String(i.attributes?.name ?? ''),
        productId: String(i.attributes?.productId ?? ''),
      });
    }
    next = res?.links?.next;
    if (!next) break;
  }
  return subs;
}

async function resolveSubscription(
  http: AscHttpClient,
  appId: string,
  subscription: string
): Promise<Subscription> {
  const subs = await listSubscriptions(http, appId);
  const wanted = subscription.trim().toLowerCase();
  const describe = (list: Subscription[]) =>
    list.map((s) => `${s.productId} ("${s.name}")`).join(', ');

  // Exact wins outright. The substring tiers exist so "1week" finds the right
  // product, and they are the ones that can match more than one thing: this is
  // the resolution step in front of a price write, so a second candidate is a
  // question to ask rather than a coin to flip.
  const exact =
    subs.find((s) => s.productId.toLowerCase() === wanted) ??
    subs.find((s) => s.name.toLowerCase() === wanted);
  if (exact) return exact;

  for (const tier of [
    subs.filter((s) => s.name.toLowerCase().includes(wanted)),
    subs.filter((s) => s.productId.toLowerCase().includes(wanted)),
  ]) {
    if (tier.length === 1) return tier[0];
    if (tier.length > 1) {
      throw new AscApiError(
        `"${subscription}" matches ${tier.length} subscriptions: ${describe(tier)}. ` +
          `Name one exactly by product ID.`,
        0
      );
    }
  }

  throw new AscApiError(
    `No subscription matching "${subscription}" in this app. ` +
      `Available: ${describe(subs) || 'none'}.`,
    0
  );
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
export function buildPricingPreview(args: Record<string, unknown>, toolName?: string): string {
  const preserve = args.preserve_current_price === true;

  if (toolName === 'pricing__equalize_price') {
    const kind = String(args.product_type ?? '?');
    const isSub = kind === 'subscription';
    return [
      `Heimdall is about to set a price in EVERY COUNTRY — a REVENUE-level write.`,
      '',
      `App:          ${String(args.app ?? '?')}`,
      `Product:      ${kind}${args.product ? ` — ${String(args.product)}` : ''}`,
      `Anchor:       ${normalizePrice(String(args.price ?? '?'))} in ${String(args.territory ?? '?').toUpperCase()}`,
      // The number is not what travels, and someone approving this has to know
      // that before they read "99.99" and picture 99.99 everywhere.
      `Other markets: derived by Apple from the anchor — each country gets its own`,
      `              currency and tier, NOT the same number.`,
      ...(args.start_date ? [`Starts:       ${String(args.start_date)}`] : []),
      isSub
        ? `Scope:        about 175 countries, one write each.`
        : `Scope:        about 175 countries in a single schedule.`,
      ...(isSub
        ? [
            preserve
              ? `Subscribers:  existing subscribers keep their current price.`
              : `Subscribers:  ⚠ existing subscribers WILL be moved to the new price, worldwide.`,
          ]
        : []),
      '',
      'Type CONFIRM in the field below to proceed.',
    ].join('\n');
  }

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

  // Apple does not promise an order, and a subscription that has been repriced
  // carries every past row. The one in effect is the latest start date that has
  // passed, not the first row that happens to arrive — picking the first can
  // report a price the app stopped charging years ago. A null start date is the
  // original price, so it sorts earliest.
  const current = rows
    .filter((r: any) => !r.scheduled)
    .sort((a: any, b: any) => String(b.startDate ?? '').localeCompare(String(a.startDate ?? '')))[0];
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

  // `countryNames` is built from the sorted codes in the same expression, so
  // the two arrays cannot drift apart. Apple returns no country name anywhere —
  // not on a price row, not on /v1/territories — so an agent asked for a
  // per-country table writes the dictionary itself: a live eval session hand-
  // typed 175 entries inside a shelled-out python3, twice. Carrying the names
  // costs a few hundred tokens against the megabyte that cost.
  const byPrice = [...groups.values()]
    .map((g) => {
      const territories = g.territories.sort();
      return {
        ...g,
        countries: territories.length,
        territories,
        countryNames: territories.map((code) => TERRITORY_NAMES[code] ?? code),
      };
    })
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

    return {
      app: `${app.name} (${app.id})`,
      territory: scope,
      ...(territory ? { country: TERRITORY_NAMES[territory] ?? null } : {}),
      prices,
    };
  }

  if (name === 'pricing__equalize_price') return equalizePrice(args, ctx);

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

/**
 * Equalization — one anchor price, every other country derived by Apple.
 *
 * The three product types do not share a write model, and flattening that
 * difference would be lying about the blast radius:
 *
 *   app, in-app purchase   ONE POST. `appPriceSchedules` and
 *                          `inAppPurchasePriceSchedules` take a `baseTerritory`,
 *                          and Apple derives every other territory itself.
 *   subscription           `subscriptionPrices` has no base territory. Each
 *                          country is its own POST, so this path reads the
 *                          equalizations endpoint and then writes ~175 times.
 *
 * What is never done is arithmetic on the number. Apple's equalizations endpoint
 * answers with a real price point per territory — 3.99 TRY anchors to 0.99 USD
 * in Afghanistan and 2.99 AED in the UAE — and copying "3.99" across currencies
 * would invent prices that do not exist as tiers.
 */

interface PricePoint {
  id: string;
  customerPrice: string;
}

/** Shared shape for "find the tier matching this price in this territory". */
async function findPricePoint(
  http: AscHttpClient,
  path: string,
  territory: string,
  price: string,
  what: string
): Promise<PricePoint> {
  const target = Number(normalizePrice(price));
  const { items } = await http.collect<any>(
    path,
    { 'filter[territory]': territory, limit: 200 },
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
    `${normalizePrice(price)} is not an available Apple price point for ${what} in ` +
      `${territory}${nearest ? `; nearest available: ${nearest}` : ''}. Apple only allows ` +
      `prices from its fixed tiers.`,
    0
  );
}

/** The in-app purchase matching a product ID or reference name. */
async function resolveIap(
  http: AscHttpClient,
  appId: string,
  wanted: string
): Promise<{ id: string; name: string; productId: string }> {
  const { items } = await http.collect<any>(
    `/v1/apps/${encodeURIComponent(appId)}/inAppPurchasesV2`,
    { limit: 200 },
    5
  );
  const iaps = items.map((i: any) => ({
    id: String(i.id),
    name: String(i.attributes?.name ?? ''),
    productId: String(i.attributes?.productId ?? ''),
  }));
  const needle = wanted.trim().toLowerCase();
  const match =
    iaps.find((i) => i.productId.toLowerCase() === needle) ??
    iaps.find((i) => i.name.toLowerCase() === needle) ??
    iaps.find((i) => i.productId.toLowerCase().includes(needle)) ??
    iaps.find((i) => i.name.toLowerCase().includes(needle));
  if (!match) {
    throw new AscApiError(
      `No in-app purchase matching "${wanted}" in this app. Available: ` +
        `${iaps.map((i) => `${i.productId} ("${i.name}")`).join(', ') || 'none'}.`,
      0
    );
  }
  return match;
}

/**
 * A schedule write covers every territory in one request, so the "included"
 * price is the anchor and `baseTerritory` tells Apple what to derive from.
 * Apple's own model: territories absent from `manualPrices` follow the base.
 */
function scheduleBody(
  kind: 'app' | 'iap',
  productId: string,
  territory: string,
  pricePointId: string,
  startDate?: string
): unknown {
  const isApp = kind === 'app';
  const priceType = isApp ? 'appPrices' : 'inAppPurchasePrices';
  const pointType = isApp ? 'appPricePoints' : 'inAppPurchasePricePoints';
  const owner = isApp ? 'app' : 'inAppPurchase';
  const ownerType = isApp ? 'apps' : 'inAppPurchases';
  // A client-supplied placeholder id, which is how JSON:API links a resource
  // being created in the same request. Apple replaces it.
  const ref = '${price-anchor}';

  return {
    data: {
      type: isApp ? 'appPriceSchedules' : 'inAppPurchasePriceSchedules',
      relationships: {
        [owner]: { data: { type: ownerType, id: productId } },
        baseTerritory: { data: { type: 'territories', id: territory } },
        manualPrices: { data: [{ type: priceType, id: ref }] },
      },
    },
    included: [
      {
        type: priceType,
        id: ref,
        attributes: { startDate: startDate ?? null, endDate: null },
        relationships: {
          ...(isApp ? {} : { inAppPurchaseV2: { data: { type: ownerType, id: productId } } }),
          [isApp ? 'appPricePoint' : 'inAppPurchasePricePoint']: {
            data: { type: pointType, id: pricePointId },
          },
        },
      },
    ],
  };
}

async function equalizePrice(
  args: Record<string, unknown>,
  ctx: PricingContext
): Promise<unknown> {
  for (const field of ['app', 'product_type', 'territory', 'price'] as const) {
    if (!args[field] || typeof args[field] !== 'string') {
      throw new AscApiError(`"${field}" is required.`, 0);
    }
  }
  const kind = String(args.product_type);
  if (!['app', 'subscription', 'in_app_purchase'].includes(kind)) {
    throw new AscApiError(
      `"${kind}" is not a product type. One of: app, subscription, in_app_purchase.`,
      0
    );
  }
  if (kind !== 'app' && (!args.product || typeof args.product !== 'string')) {
    throw new AscApiError(`"product" is required when product_type is "${kind}".`, 0);
  }
  const territory = String(args.territory).trim().toUpperCase();
  if (territory.length !== 3) {
    throw new AscApiError(
      `"${args.territory}" is not a territory code. Apple wants three letters (ISO-3166 ` +
        `alpha-3): USA, TUR, DEU — not US, TR, DE.`,
      0
    );
  }
  // Subscriptions are the only type with existing subscribers to move, and the
  // decision is theirs to surface — same rule as the single-territory macro,
  // except here it lands in every country at once.
  if (kind === 'subscription' && typeof args.preserve_current_price !== 'boolean') {
    throw new AscApiError(
      '"preserve_current_price" is required for subscriptions: true keeps existing ' +
        'subscribers on their current price, false moves them to the new one in every ' +
        'country. Ask the user which they want.',
      0
    );
  }

  const app = await resolveApp(ctx.http, String(args.app));
  const startDate = args.start_date ? String(args.start_date) : undefined;
  const price = normalizePrice(String(args.price));

  if (kind === 'app' || kind === 'in_app_purchase') {
    const isApp = kind === 'app';
    const product = isApp
      ? { id: app.id, name: app.name, productId: app.name }
      : await resolveIap(ctx.http, app.id, String(args.product));
    const point = await findPricePoint(
      ctx.http,
      isApp
        ? `/v1/apps/${encodeURIComponent(app.id)}/appPricePoints`
        : `/v2/inAppPurchases/${encodeURIComponent(product.id)}/pricePoints`,
      territory,
      price,
      isApp ? 'this app' : `"${product.productId}"`
    );
    const body = scheduleBody(isApp ? 'app' : 'iap', product.id, territory, point.id, startDate);
    const resolved = {
      app: `${app.name} (${app.id})`,
      productType: kind,
      product: isApp ? app.name : `${product.name} (${product.productId})`,
      anchor: `${point.customerPrice} (${territory})`,
      writes: 1,
      note:
        'One schedule covers every territory: Apple derives the rest from the base ' +
        'territory, so no per-country price is sent.',
    };
    if (ctx.dryRun) {
      return {
        dryRun: true,
        note: 'Dry-run mode: fully resolved, nothing sent to Apple.',
        resolved,
        wouldSend: {
          method: 'POST',
          path: isApp ? '/v1/appPriceSchedules' : '/v1/inAppPurchasePriceSchedules',
          body,
        },
        risk: 'revenue',
      };
    }
    await ctx.http.post(isApp ? '/v1/appPriceSchedules' : '/v1/inAppPurchasePriceSchedules', body);
    return { ok: true, changed: resolved };
  }

  // --- subscriptions: no base territory, so one write per country -----------
  const sub = await resolveSubscription(ctx.http, app.id, String(args.product));
  const anchor = await findPricePoint(
    ctx.http,
    `/v1/subscriptions/${encodeURIComponent(sub.id)}/pricePoints`,
    territory,
    price,
    `"${sub.productId}"`
  );

  const { items } = await ctx.http.collect<any>(
    `/v1/subscriptionPricePoints/${encodeURIComponent(anchor.id)}/equalizations`,
    { include: 'territory', limit: 200 },
    5
  );
  const derived = items
    .map((p: any) => ({
      pointId: String(p.id),
      territory: String(p.relationships?.territory?.data?.id ?? ''),
      customerPrice: String(p.attributes?.customerPrice ?? ''),
    }))
    .filter((p: { territory: string }) => p.territory && p.territory !== territory);

  // The anchor goes first, deliberately. If a later write fails, the country
  // the user actually named is already set rather than left behind.
  const plan = [
    { pointId: anchor.id, territory, customerPrice: anchor.customerPrice },
    ...derived,
  ];

  const resolved = {
    app: `${app.name} (${app.id})`,
    productType: kind,
    product: `${sub.name} (${sub.productId})`,
    anchor: `${anchor.customerPrice} (${territory})`,
    preserveCurrentPrice: args.preserve_current_price,
    ...(startDate ? { startDate } : {}),
    countries: plan.length,
    writes: plan.length,
  };

  const bodyFor = (row: { pointId: string }) => ({
    data: {
      type: 'subscriptionPrices',
      attributes: {
        preserveCurrentPrice: args.preserve_current_price,
        ...(startDate ? { startDate } : {}),
      },
      relationships: {
        subscription: { data: { type: 'subscriptions', id: sub.id } },
        subscriptionPricePoint: { data: { type: 'subscriptionPricePoints', id: row.pointId } },
      },
    },
  });

  if (ctx.dryRun) {
    return {
      dryRun: true,
      note:
        `Dry-run mode: fully resolved, nothing sent to Apple. This would be ` +
        `${plan.length} separate writes — subscriptions have no base territory.`,
      resolved,
      derivedPrices: plan.map((p) => `${p.territory}: ${p.customerPrice}`),
      wouldSend: { method: 'POST', path: '/v1/subscriptionPrices', body: bodyFor(plan[0]) },
      risk: 'revenue',
    };
  }

  // Sequential, and it stops at the first failure. Carrying on would spread an
  // unknown state across the remaining countries; stopping leaves a partial one
  // that the result below names exactly, so it can be resumed or reverted.
  const written: string[] = [];
  for (const row of plan) {
    try {
      await ctx.http.post('/v1/subscriptionPrices', bodyFor(row));
      written.push(row.territory);
    } catch (err) {
      return {
        ok: false,
        partial: true,
        changed: { ...resolved, writes: written.length },
        written,
        failedAt: row.territory,
        remaining: plan.length - written.length,
        error: (err as Error).message,
        note:
          `Stopped at ${row.territory}. The ${written.length} listed above are set; the ` +
          `remaining ${plan.length - written.length} are unchanged. Fix the cause and run ` +
          `again — writing a price that is already set is harmless.`,
      };
    }
  }

  return {
    ok: true,
    changed: resolved,
    written: written.length,
    note:
      'Apple applies each change on its own schedule; check with ' +
      'pricing__get_subscription_price (omit the territory) to see them worldwide.',
  };
}
