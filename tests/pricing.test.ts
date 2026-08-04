import { describe, it, expect, vi } from 'vitest';
import {
  PRICING_TOOLS,
  executePricingTool,
  buildPricingPreview,
  normalizePrice,
  type PricingContext,
} from '../src/tools/pricing.js';

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
