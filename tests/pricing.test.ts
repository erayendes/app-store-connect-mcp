import { describe, it, expect, vi } from 'vitest';
import {
  PRICING_TOOLS,
  executePricingTool,
  buildPricingPreview,
  normalizePrice,
  type PricingContext,
} from '../src/tools/pricing.js';
import { validateBody } from '../src/core/validate.js';
import { OPERATIONS } from '../src/generated/operations.js';
import { BODY_SCHEMAS } from '../src/generated/body-schemas.js';

/** Fake http covering the whole resolution chain for one app. */
function fakeHttp() {
  const get = vi.fn(async (path: string, query?: any) => {
    if (path === '/v1/apps' && query?.['filter[bundleId]']) {
      return { data: [{ id: '6636549188', attributes: { name: 'Ask Quran', bundleId: query['filter[bundleId]'] } }] };
    }
    if (path === '/v1/apps') {
      return {
        data: [
          { id: '6636549188', attributes: { name: 'Ask Quran: AI Islam Companion' } },
          { id: '6502901728', attributes: { name: 'AI Caption Generator: Postmate' } },
        ],
      };
    }
    if (path.startsWith('/v1/apps/6636549188/subscriptionGroups')) {
      return {
        data: [{ type: 'subscriptionGroups', id: 'g1' }],
        included: [
          { type: 'subscriptions', id: '6639599999', attributes: { name: 'ask quran base 1week', productId: 'askquran.base.1week' } },
          { type: 'subscriptions', id: '6639600093', attributes: { name: 'ask quran base 1month', productId: 'askquran.base.1month' } },
        ],
      };
    }
    if (path.startsWith('/v1/apps/6636549188')) {
      return { data: { id: '6636549188', attributes: { name: 'Ask Quran: AI Islam Companion' } } };
    }
    // The price lives on the included price point, never on the row itself —
    // the shape that makes an include-less read look like "no price set".
    if (path.startsWith('/v1/subscriptions/6639599999/prices')) {
      return {
        data: [
          { id: 'sp-1', attributes: { startDate: null }, relationships: { subscriptionPricePoint: { data: { id: 'pp-499' } } } },
          { id: 'sp-2', attributes: { startDate: '2099-01-01' }, relationships: { subscriptionPricePoint: { data: { id: 'pp-599' } } } },
        ],
        included: [
          { type: 'subscriptionPricePoints', id: 'pp-499', attributes: { customerPrice: '4.99', proceeds: '4.24' } },
          { type: 'subscriptionPricePoints', id: 'pp-599', attributes: { customerPrice: '5.99', proceeds: '5.09' } },
        ],
      };
    }
    if (path.startsWith('/v1/subscriptions/6639600093/prices')) {
      return { data: [], included: [] };
    }
    if (path.startsWith('/v1/subscriptions/6639599999/pricePoints')) {
      return {
        data: [
          { id: 'pp-94', attributes: { customerPrice: '94.99' } },
          { id: 'pp-99', attributes: { customerPrice: '99.99' } },
          { id: 'pp-104', attributes: { customerPrice: '104.99' } },
        ],
        links: {},
      };
    }
    return {};
  });
  const collect = vi.fn(async (path: string, query?: any) => {
    const res: any = await get(path, query);
    return { items: res?.data ?? [], pagesFetched: 1, hasMore: false, nextUrl: undefined };
  });
  const post = vi.fn(async () => ({ data: { id: 'created' } }));
  return { get, collect, post };
}

function ctx(overrides: Partial<PricingContext> = {}): PricingContext & { http: any } {
  return { http: fakeHttp(), ...overrides } as any;
}

const goodArgs = {
  app: '6636549188',
  subscription: 'askquran.base.1week',
  territory: 'tur',
  price: '99,99', // comma on purpose — must normalize
  preserve_current_price: false,
};

describe('pricing__set_subscription_price', () => {
  it('resolves app, subscription and price point, then performs the one write', async () => {
    const c = ctx();
    const result: any = await executePricingTool('pricing__set_subscription_price', goodArgs, c);

    expect(result.ok).toBe(true);
    expect(result.changed.subscription).toBe('ask quran base 1week (askquran.base.1week)');
    expect(result.changed.price).toBe('99.99 (TUR)');

    const [path, body] = c.http.post.mock.calls[0];
    expect(path).toBe('/v1/subscriptionPrices');
    expect(body.data.relationships.subscriptionPricePoint.data.id).toBe('pp-99');
    expect(body.data.attributes.preserveCurrentPrice).toBe(false);
  });

  it('resolves the app by bundle ID and by (unique) name', async () => {
    const c1 = ctx();
    await executePricingTool(
      'pricing__set_subscription_price',
      { ...goodArgs, app: 'com.milowda.askquranai' },
      c1
    );
    expect(c1.http.post).toHaveBeenCalled();

    const c2 = ctx();
    await executePricingTool('pricing__set_subscription_price', { ...goodArgs, app: 'ask quran' }, c2);
    expect(c2.http.post).toHaveBeenCalled();
  });

  it('suggests the nearest available prices when the exact tier does not exist', async () => {
    const c = ctx();
    await expect(
      executePricingTool('pricing__set_subscription_price', { ...goodArgs, price: '97.50' }, c)
    ).rejects.toThrow(/nearest available: 94\.99, 99\.99/);
    expect(c.http.post).not.toHaveBeenCalled();
  });

  it('lists the available subscriptions when the product is not found', async () => {
    const c = ctx();
    await expect(
      executePricingTool('pricing__set_subscription_price', { ...goodArgs, subscription: 'nope' }, c)
    ).rejects.toThrow(/askquran\.base\.1week/);
  });

  it('refuses to run without an explicit preserve_current_price decision', async () => {
    const { preserve_current_price: _omitted, ...args } = goodArgs;
    await expect(
      executePricingTool('pricing__set_subscription_price', args, ctx())
    ).rejects.toThrow(/preserve_current_price/);
    // And the schema enforces it too, so the model is told upfront.
    expect(PRICING_TOOLS[0].inputSchema.required).toContain('preserve_current_price');
  });

  it('dry-run resolves everything but never POSTs', async () => {
    const c = ctx({ dryRun: true });
    const result: any = await executePricingTool('pricing__set_subscription_price', goodArgs, c);

    expect(result.dryRun).toBe(true);
    expect(result.resolved.price).toBe('99.99 (TUR)');
    expect(result.wouldSend.body.data.relationships.subscriptionPricePoint.data.id).toBe('pp-99');
    expect(c.http.post).not.toHaveBeenCalled();
  });
});

describe('pricing__get_subscription_price', () => {
  const get = (args: Record<string, unknown>, c = ctx()) =>
    executePricingTool('pricing__get_subscription_price', args, c);

  it('answers with the price in effect, from one call', async () => {
    const c = ctx();
    const result: any = await get({ app: '6636549188', subscription: 'askquran.base.1week', territory: 'USA' }, c);

    expect(result.prices[0]).toMatchObject({
      subscription: 'askquran.base.1week',
      customerPrice: '4.99',
      proceeds: '4.24',
    });
    // A future-dated row is a scheduled change, not today's price. Reporting it
    // as current would tell someone their app costs 5.99 when it costs 4.99.
    expect(result.prices[0].scheduledChanges).toHaveLength(1);
    expect(result.prices[0].scheduledChanges[0].customerPrice).toBe('5.99');
  });

  it('reads the price point, which is the only place the price exists', async () => {
    const c = ctx();
    await get({ app: '6636549188', subscription: 'askquran.base.1week', territory: 'USA' }, c);
    const pricesCall = c.http.get.mock.calls.find(([p]: [string]) => p.endsWith('/prices'));
    expect(pricesCall?.[1]).toMatchObject({
      'filter[territory]': 'USA',
      include: 'subscriptionPricePoint',
    });
  });

  it('covers every subscription when none is named', async () => {
    const result: any = await get({ app: '6636549188', territory: 'USA' });
    expect(result.prices.map((p: any) => p.subscription)).toEqual([
      'askquran.base.1week',
      'askquran.base.1month',
    ]);
    // No price in this territory is said out loud rather than returned as null.
    expect(result.prices[1].note).toMatch(/No price in effect/);
  });

  // Apple accepts "US" and answers 200 with an empty list, so the wrong code
  // reads as "this territory has no price". Stopping it here is the difference
  // between an error and a confident wrong answer.
  it('refuses a two-letter territory code instead of returning nothing', async () => {
    await expect(get({ app: '6636549188', territory: 'US' })).rejects.toThrow(/three letters/i);
  });

  it('is marked read-only, so it never asks for a write confirmation', () => {
    const tool = PRICING_TOOLS.find((t) => t.name === 'pricing__get_subscription_price');
    expect(tool?.annotations?.readOnlyHint).toBe(true);
  });
});

describe('buildPricingPreview', () => {
  it('is human language with the subscriber consequence spelled out', () => {
    const msg = buildPricingPreview(goodArgs);
    expect(msg).toContain('REVENUE-level write');
    expect(msg).toContain('New price:    99.99 (TUR)');
    expect(msg).toContain('WILL be moved to the new price');
    expect(msg).toContain('Type CONFIRM');
  });

  it('shows the keep-price wording when preserving', () => {
    const msg = buildPricingPreview({ ...goodArgs, preserve_current_price: true });
    expect(msg).toContain('keep their current price');
  });
});

describe('normalizePrice', () => {
  it('accepts comma decimals and padding', () => {
    expect(normalizePrice(' 99,99 ')).toBe('99.99');
    expect(normalizePrice('4.99')).toBe('4.99');
  });
});

/**
 * Worldwide mode. The fixture is the live response's shape verbatim: the
 * territory code hangs off the row's relationship, the price off the included
 * price point, and the currency off the included territory — three places for
 * one answer, which is why walking this by hand goes wrong.
 */
function worldwideHttp() {
  /** Every query the /prices endpoint saw, so a test can assert on the filter. */
  const priceQueries: any[] = [];
  const get = vi.fn(async (path: string, query?: any) => {
    if (path === '/v1/apps') return { data: [{ id: 'app-1', attributes: { name: 'Ask Quran' } }] };
    if (path.includes('subscriptionGroups')) {
      return {
        data: [{ id: 'g1', attributes: {} }],
        included: [
          { id: 's1', type: 'subscriptions', attributes: { name: 'Weekly', productId: 'weekly.1' } },
        ],
      };
    }
    if (path.includes('/prices')) {
      priceQueries.push(query ?? {});
      return {
        data: [
          row('AFG', 'pp-499'), row('ATG', 'pp-499'), row('AIA', 'pp-499'),
          row('ARE', 'pp-1999'),
          row('AUT', 'pp-599eur'),
          // Future-dated: not what customers pay today.
          { ...row('USA', 'pp-1999'), attributes: { startDate: '2099-01-01' } },
        ],
        included: [
          { type: 'territories', id: 'AFG', attributes: { currency: 'USD' } },
          { type: 'territories', id: 'ATG', attributes: { currency: 'USD' } },
          { type: 'territories', id: 'AIA', attributes: { currency: 'USD' } },
          { type: 'territories', id: 'ARE', attributes: { currency: 'AED' } },
          { type: 'territories', id: 'AUT', attributes: { currency: 'EUR' } },
          { type: 'territories', id: 'USA', attributes: { currency: 'USD' } },
          { type: 'subscriptionPricePoints', id: 'pp-499', attributes: { customerPrice: '4.99', proceeds: '4.24' } },
          { type: 'subscriptionPricePoints', id: 'pp-1999', attributes: { customerPrice: '19.99', proceeds: '16.18' } },
          { type: 'subscriptionPricePoints', id: 'pp-599eur', attributes: { customerPrice: '5.99', proceeds: '5.09' } },
        ],
      };
    }
    return { data: [] };
  });
  return { get, post: vi.fn(), priceQueries };
}

function row(territory: string, pointId: string) {
  return {
    type: 'subscriptionPrices',
    id: `price-${territory}`,
    attributes: { startDate: null },
    relationships: {
      territory: { data: { type: 'territories', id: territory } },
      subscriptionPricePoint: { data: { type: 'subscriptionPricePoints', id: pointId } },
    },
  };
}

describe('pricing__get_subscription_price worldwide', () => {
  const run = (args: Record<string, unknown>, http: unknown) =>
    executePricingTool('pricing__get_subscription_price', args, { http } as unknown as PricingContext);

  it('groups countries by price and names the currency', async () => {
    const http = worldwideHttp();
    const result: any = await run({ app: 'Ask Quran' }, http);

    expect(result.territory).toBe('worldwide');
    // No territory filter, and the currency include asked for — the two things
    // that make a worldwide answer possible at all.
    expect(http.priceQueries[0]['filter[territory]']).toBeUndefined();
    expect(String(http.priceQueries[0].include)).toContain('territory');
    const sub = result.prices[0];
    // Six rows in, one of them future-dated, so five countries carry a price.
    expect(sub.territoryCount).toBe(5);

    // Biggest group first — that ordering is what makes the answer skimmable.
    expect(sub.byPrice[0]).toEqual({
      customerPrice: '4.99',
      currency: 'USD',
      proceeds: '4.24',
      countries: 3,
      territories: ['AFG', 'AIA', 'ATG'],
      countryNames: ['Afghanistan', 'Anguilla', 'Antigua and Barbuda'],
    });
    // Same number, different currency, so a different group — 5.99 EUR is not
    // 5.99 USD and collapsing them would invent a price.
    const currencies = sub.byPrice.map((g: any) => `${g.customerPrice} ${g.currency}`);
    expect(currencies).toContain('19.99 AED');
    expect(currencies).toContain('5.99 EUR');
  });

  // Two parallel arrays are only useful while they line up, and nothing in the
  // type system holds them together. Apple returns no country name at all, so a
  // wrong pairing here is a wrong answer nobody can cross-check.
  it('keeps countryNames index-aligned with territories in every group', async () => {
    const result: any = await run({ app: 'Ask Quran' }, worldwideHttp());
    const expected: Record<string, string> = {
      AFG: 'Afghanistan',
      AIA: 'Anguilla',
      ATG: 'Antigua and Barbuda',
      ARE: 'United Arab Emirates',
    };
    for (const group of result.prices[0].byPrice) {
      expect(group.countryNames).toHaveLength(group.territories.length);
      group.territories.forEach((code: string, i: number) => {
        if (expected[code]) expect(group.countryNames[i]).toBe(expected[code]);
      });
    }
  });

  it('counts future-dated prices instead of showing today’s customers a price they do not pay', async () => {
    const result: any = await run({ app: 'Ask Quran' }, worldwideHttp());
    const sub = result.prices[0];
    expect(sub.note).toMatch(/1 future-dated price change/);
    // USA only had a scheduled row, so it must not appear in any group.
    expect(sub.byPrice.flatMap((g: any) => g.territories)).not.toContain('USA');
  });

  it('still answers one country when a territory is given', async () => {
    const http = worldwideHttp();
    const result: any = await run({ app: 'Ask Quran', territory: 'TUR' }, http);
    expect(result.territory).toBe('TUR');
    expect(result.country).toBe('Türkiye');
    expect(http.priceQueries[0]['filter[territory]']).toBe('TUR');
    // Single-country mode keeps the old flat shape, not the grouped one.
    expect(result.prices[0].byPrice).toBeUndefined();
  });

  it('rejects a two-letter code and points at the worldwide option', async () => {
    await expect(run({ app: 'Ask Quran', territory: 'TR' }, worldwideHttp())).rejects.toThrow(
      /Omit it entirely for every country/
    );
  });

  it('treats an empty territory string as worldwide, not as a bad code', async () => {
    const result: any = await run({ app: 'Ask Quran', territory: '  ' }, worldwideHttp());
    expect(result.territory).toBe('worldwide');
  });
});

/**
 * Equalization. The three product types write differently, and the tests exist
 * to keep that difference visible: a schedule covers every country in one POST,
 * a subscription needs one per country.
 */
function equalizeHttp(opts: { failAt?: string } = {}) {
  const posts: Array<{ path: string; body: any }> = [];
  const http = {
    get: vi.fn(async (path: string, query?: any) => {
      if (path === '/v1/apps') return { data: [{ id: 'app-1', attributes: { name: 'Ask Quran' } }] };
      if (path.includes('subscriptionGroups')) {
        return {
          data: [{ id: 'g1', attributes: {} }],
          included: [
            { id: 's1', type: 'subscriptions', attributes: { name: 'Weekly', productId: 'weekly.1' } },
          ],
        };
      }
      if (path.includes('inAppPurchasesV2')) {
        return { data: [{ id: 'iap-1', attributes: { name: 'Coins', productId: 'coins.100' } }] };
      }
      if (path.includes('/equalizations')) {
        return {
          data: [
            eqPoint('USA', 'pp-usa', '0.99'),
            eqPoint('DEU', 'pp-deu', '1.09'),
            // Apple echoes the anchor back; it must not be written twice.
            eqPoint('TUR', 'pp-tur', '3.99'),
          ],
        };
      }
      if (path.includes('pricePoints') || path.includes('appPricePoints')) {
        return {
          data: [
            { id: 'pp-tur', attributes: { customerPrice: '3.99' } },
            { id: 'pp-tur-hi', attributes: { customerPrice: '9.99' } },
          ],
        };
      }
      return { data: [] };
    }),
    post: vi.fn(async (path: string, body: any) => {
      const territory =
        body?.data?.relationships?.subscriptionPricePoint?.data?.id ?? '';
      if (opts.failAt && String(territory).includes(opts.failAt)) {
        throw new Error('Apple said no');
      }
      posts.push({ path, body });
      return { data: { id: 'created' } };
    }),
    collect: vi.fn(async function (this: any, path: string, query?: any) {
      const res: any = await http.get(path, query);
      return { items: res.data ?? [], pagesFetched: 1, hasMore: false };
    }),
  };
  return { http, posts };
}

function eqPoint(territory: string, id: string, price: string) {
  return {
    id,
    attributes: { customerPrice: price },
    relationships: { territory: { data: { type: 'territories', id: territory } } },
  };
}

describe('pricing__equalize_price', () => {
  const run = (args: Record<string, unknown>, http: unknown, dryRun = false) =>
    executePricingTool('pricing__equalize_price', args, { http, dryRun } as unknown as PricingContext);

  it('prices an app with ONE schedule — Apple derives the rest from the base territory', async () => {
    const { http, posts } = equalizeHttp();
    const result: any = await run(
      { app: 'Ask Quran', product_type: 'app', territory: 'TUR', price: '3.99' },
      http
    );

    expect(posts).toHaveLength(1);
    expect(posts[0].path).toBe('/v1/appPriceSchedules');
    const rel = posts[0].body.data.relationships;
    expect(rel.baseTerritory.data.id).toBe('TUR');
    // The anchor price rides in `included`, referenced by a placeholder id —
    // Apple's own JSON:API pattern for creating two resources in one request.
    const ref = rel.manualPrices.data[0].id;
    expect(posts[0].body.included[0].id).toBe(ref);
    expect(posts[0].body.included[0].relationships.appPricePoint.data.id).toBe('pp-tur');
    expect(result.ok).toBe(true);
    expect(result.changed.writes).toBe(1);
  });

  it('prices an in-app purchase the same way, with its own resource types', async () => {
    const { http, posts } = equalizeHttp();
    await run(
      { app: 'Ask Quran', product_type: 'in_app_purchase', product: 'coins.100', territory: 'TUR', price: '3.99' },
      http
    );
    expect(posts[0].path).toBe('/v1/inAppPurchasePriceSchedules');
    expect(posts[0].body.data.relationships.inAppPurchase.data.id).toBe('iap-1');
    expect(posts[0].body.included[0].type).toBe('inAppPurchasePrices');
    // The IAP price also has to name its own purchase, which appPrices does not.
    expect(posts[0].body.included[0].relationships.inAppPurchaseV2.data.id).toBe('iap-1');
  });

  it('writes a subscription once per country, anchor first, without duplicating it', async () => {
    const { http, posts } = equalizeHttp();
    const result: any = await run(
      {
        app: 'Ask Quran',
        product_type: 'subscription',
        product: 'weekly.1',
        territory: 'TUR',
        price: '3.99',
        preserve_current_price: true,
      },
      http
    );

    // Anchor + USA + DEU. Apple echoed TUR back in the equalizations and it
    // must not be written twice.
    expect(posts).toHaveLength(3);
    const points = posts.map((p) => p.body.data.relationships.subscriptionPricePoint.data.id);
    expect(points).toEqual(['pp-tur', 'pp-usa', 'pp-deu']);
    expect(posts[0].body.data.attributes.preserveCurrentPrice).toBe(true);
    expect(result.written).toBe(3);
  });

  it('reports exactly where it stopped instead of leaving an unknown state', async () => {
    const { http, posts } = equalizeHttp({ failAt: 'pp-deu' });
    const result: any = await run(
      {
        app: 'Ask Quran',
        product_type: 'subscription',
        product: 'weekly.1',
        territory: 'TUR',
        price: '3.99',
        preserve_current_price: false,
      },
      http
    );

    expect(result.ok).toBe(false);
    expect(result.partial).toBe(true);
    expect(result.written).toEqual(['TUR', 'USA']);
    expect(result.failedAt).toBe('DEU');
    expect(result.remaining).toBe(1);
    // The two that landed stay landed — nothing is rolled back or hidden.
    expect(posts).toHaveLength(2);
  });

  it('makes subscriptions declare what happens to existing subscribers', async () => {
    const { http } = equalizeHttp();
    await expect(
      run({ app: 'Ask Quran', product_type: 'subscription', product: 'weekly.1', territory: 'TUR', price: '3.99' }, http)
    ).rejects.toThrow(/preserve_current_price/);
    // Apps and IAPs have no subscribers, so they must not demand it.
    await expect(
      run({ app: 'Ask Quran', product_type: 'app', territory: 'TUR', price: '3.99' }, http)
    ).resolves.toBeTruthy();
  });

  it('dry-run resolves the derived table and sends nothing', async () => {
    const { http, posts } = equalizeHttp();
    const result: any = await run(
      {
        app: 'Ask Quran',
        product_type: 'subscription',
        product: 'weekly.1',
        territory: 'TUR',
        price: '3.99',
        preserve_current_price: true,
      },
      http,
      true
    );
    expect(result.dryRun).toBe(true);
    expect(result.risk).toBe('revenue');
    expect(result.derivedPrices).toEqual(['TUR: 3.99', 'USA: 0.99', 'DEU: 1.09']);
    expect(posts).toEqual([]);
  });

  it('refuses a price Apple does not offer, and names the nearest tiers', async () => {
    const { http } = equalizeHttp();
    await expect(
      run({ app: 'Ask Quran', product_type: 'app', territory: 'TUR', price: '5.55' }, http)
    ).rejects.toThrow(/nearest available: 3.99, 9.99/);
  });
});

/**
 * The bodies this macro builds never pass through the registry, so they never
 * meet `validateBody`. Apple's own schema is still the authority on their
 * shape, so check them against it here — this is the one thing a fake HTTP
 * client cannot tell us, and getting `included` wrong is a 400 in production.
 */
describe('equalize bodies match Apple’s schema', () => {
  const schemaFor = (opName: string) => {
    const op = OPERATIONS.find((o) => o.name === opName)!;
    return BODY_SCHEMAS[op.bodyRef!];
  };

  it.each([
    ['app', 'app_price_schedules.create', '/v1/appPriceSchedules'],
    ['in_app_purchase', 'in_app_purchase_price_schedules.create', '/v1/inAppPurchasePriceSchedules'],
  ])('%s schedule validates against %s', async (kind, opName, path) => {
    const { http, posts } = equalizeHttp();
    await executePricingTool(
      'pricing__equalize_price',
      {
        app: 'Ask Quran',
        product_type: kind,
        ...(kind === 'app' ? {} : { product: 'coins.100' }),
        territory: 'TUR',
        price: '3.99',
      },
      { http } as unknown as PricingContext
    );
    expect(posts[0].path).toBe(path);
    expect(validateBody(schemaFor(opName), posts[0].body)).toEqual([]);
  });

  it('subscription price validates against subscription_prices.create', async () => {
    const { http, posts } = equalizeHttp();
    await executePricingTool(
      'pricing__equalize_price',
      {
        app: 'Ask Quran',
        product_type: 'subscription',
        product: 'weekly.1',
        territory: 'TUR',
        price: '3.99',
        preserve_current_price: true,
      },
      { http } as unknown as PricingContext
    );
    for (const p of posts) {
      expect(validateBody(schemaFor('subscription_prices.create'), p.body)).toEqual([]);
    }
  });
});
