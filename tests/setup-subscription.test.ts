/**
 * pricing__setup_subscription is seven kinds of write in a row. What has to
 * hold: every body is one Apple accepts, an existing group is never touched,
 * Apple's own draft version is reused rather than a second one created, and a
 * stop part-way says what already exists so a retry does not create it twice.
 */
import { describe, expect, it, vi } from 'vitest';
import { executePricingTool, PRICING_TOOLS } from '../src/tools/pricing.js';
import { validateBody } from '../src/core/validate.js';
import { OPERATIONS } from '../src/generated/operations.js';
import { BODY_SCHEMAS } from '../src/generated/body-schemas.js';

const schemaFor = (opName: string) => BODY_SCHEMAS[OPERATIONS.find((o) => o.name === opName)!.bodyRef!];

const OPS: Record<string, string> = {
  '/v1/subscriptionGroups': 'subscription_groups.create',
  '/v1/subscriptionGroupVersions': 'subscription_group_versions.create',
  '/v2/subscriptionGroupLocalizations': 'subscription_group_localizations_v2.create',
  '/v1/subscriptions': 'subscriptions.create',
  '/v1/subscriptionVersions': 'subscription_versions.create',
  '/v2/subscriptionLocalizations': 'subscription_localizations_v2.create',
  '/v1/subscriptionPlanAvailabilities': 'subscription_plan_availabilities.create',
};

function fakeHttp(opts: { existingGroup?: boolean; appleMadeVersion?: boolean } = {}) {
  const posts: Array<{ path: string; body: any }> = [];
  const get = vi.fn(async (path: string, query?: any) => {
    if (path === '/v1/apps' && query?.['filter[bundleId]']) return { data: [{ id: '1', attributes: { name: 'Notes', bundleId: 'com.example.notes' } }] };
    if (path === '/v1/apps/1/subscriptionGroups' && query?.['fields[subscriptionGroups]']) {
      return { data: opts.existingGroup ? [{ id: 'g-old', attributes: { referenceName: 'Pro' } }] : [] };
    }
    if (path.endsWith('/versions')) return { data: opts.appleMadeVersion ? [{ id: 'v-apple' }] : [] };
    if (path === '/v1/territories') return { data: [{ id: 'USA' }, { id: 'TUR' }] };
    // The price step: no price points, so it stops there.
    throw Object.assign(new Error('not found'), { status: 404 });
  });
  const post = vi.fn(async (path: string, body: any) => {
    posts.push({ path, body });
    return { data: { id: `${path.split('/').pop()}-new` } };
  });
  return { http: { get, post, patch: vi.fn(), delete: vi.fn() } as any, posts };
}

const args = {
  app: 'com.example.notes', group: 'Pro', product_id: 'com.example.notes.pro.monthly', name: 'Pro monthly',
  period: 'ONE_MONTH', territory: 'TUR', price: '99.99',
  localizations: [{ locale: 'tr', name: 'Pro', description: 'Tüm özellikler' }, { locale: 'en-US', name: 'Pro', description: 'Everything' }],
};

describe('pricing__setup_subscription', () => {
  it('only plans under dry-run', async () => {
    const { http, posts } = fakeHttp();
    const res: any = await executePricingTool('pricing__setup_subscription', args, { http, dryRun: true });
    expect(res.dryRun).toBe(true);
    expect(res.plan[0]).toMatch(/create group "Pro"/);
    expect(posts).toEqual([]);
  });

  it('builds a new group and subscription with bodies Apple accepts, then stops at the price and says what exists', async () => {
    const { http, posts } = fakeHttp();
    await expect(executePricingTool('pricing__setup_subscription', args, { http, dryRun: false })).rejects.toThrow(
      /Stopped at "price".*Already done: created group "Pro"; group version; group name in tr; group name in en-US; created subscription com\.example\.notes\.pro\.monthly; subscription version; localization tr; localization en-US; on sale in 2 countries/
    );
    expect(posts.map((p) => p.path)).toEqual([
      '/v1/subscriptionGroups', '/v1/subscriptionGroupVersions',
      '/v2/subscriptionGroupLocalizations', '/v2/subscriptionGroupLocalizations',
      '/v1/subscriptions', '/v1/subscriptionVersions',
      '/v2/subscriptionLocalizations', '/v2/subscriptionLocalizations',
      '/v1/subscriptionPlanAvailabilities',
    ]);
    for (const p of posts) expect(validateBody(schemaFor(OPS[p.path]), p.body), p.path).toEqual([]);
    const availability = posts.at(-1)!.body.data;
    expect(availability.attributes).toEqual({ planType: 'UPFRONT', availableInNewTerritories: true });
    expect(availability.relationships.availableTerritories.data.map((t: any) => t.id)).toEqual(['USA', 'TUR']);
  });

  it('reuses an existing group without editing it, and Apple\'s own draft version', async () => {
    const { http, posts } = fakeHttp({ existingGroup: true, appleMadeVersion: true });
    await expect(executePricingTool('pricing__setup_subscription', { ...args, territories: ['tur'] }, { http, dryRun: false })).rejects.toThrow(/Stopped at "price"/);
    expect(posts.map((p) => p.path)).toEqual([
      '/v1/subscriptions', '/v2/subscriptionLocalizations', '/v2/subscriptionLocalizations', '/v1/subscriptionPlanAvailabilities',
    ]);
    expect(posts[0].body.data.relationships.group.data.id).toBe('g-old');
    expect(posts[1].body.data.relationships.version.data.id).toBe('v-apple');
    expect(posts[3].body.data.attributes.availableInNewTerritories).toBe(false);
  });

  it('refuses a country list that leaves out the priced country', async () => {
    const { http, posts } = fakeHttp();
    await expect(executePricingTool('pricing__setup_subscription', { ...args, territories: ['USA'] }, { http, dryRun: false })).rejects.toThrow(/must include TUR/);
    expect(posts).toEqual([]);
  });

  it('refuses an empty country list rather than selling nowhere', async () => {
    const { http, posts } = fakeHttp();
    await expect(executePricingTool('pricing__setup_subscription', { ...args, territories: [] }, { http, dryRun: false })).rejects.toThrow(/"territories" is empty/);
    expect(posts).toEqual([]);
  });

  it('keeps what is already done in the message when Apple refuses a step', async () => {
    const { http } = fakeHttp();
    const refusal = Object.assign(new (await import('../src/core/errors.js')).AscApiError('409', 409, [{ title: 'Conflict', detail: 'locale taken' }]));
    http.post.mockImplementation(async (path: string) => {
      if (path === '/v2/subscriptionLocalizations') throw refusal;
      return { data: { id: `${path.split('/').pop()}-new` } };
    });
    const err: any = await executePricingTool('pricing__setup_subscription', args, { http, dryRun: false }).catch((e) => e);
    expect(err.summary).toMatch(/Stopped at "localization tr".*Conflict: locale taken.*Already done: .*created subscription/);
    expect(err.status).toBe(409);
  });

  it('refuses a three-letter code Apple does not sell in, under dry-run too, before writing anything', async () => {
    for (const dryRun of [false, true]) {
      const { http, posts } = fakeHttp();
      await expect(executePricingTool('pricing__setup_subscription', { ...args, territories: ['TUR', 'EUR'] }, { http, dryRun }))
        .rejects.toThrow(/no territory called EUR\. Nothing was created/);
      expect(posts).toEqual([]);
    }
  });

  it('refuses two-letter countries before writing anything', async () => {
    const { http, posts } = fakeHttp();
    await expect(executePricingTool('pricing__setup_subscription', { ...args, territory: 'TR' }, { http, dryRun: false })).rejects.toThrow(/three letters/);
    expect(posts).toEqual([]);
  });
});

describe('pricing__setup_subscription schema', () => {
  const tool = PRICING_TOOLS.find((t) => t.name === 'pricing__setup_subscription')!;
  const props = (tool.inputSchema as any).properties;

  it('asks for at least one language and one country, the priced one among them', () => {
    expect(props.localizations.minItems).toBe(1);
    expect(props.territories.minItems).toBe(1);
    expect(props.territories.description).toMatch(/must include `territory`/);
  });

  it('says what it leaves for later: review screenshot, offers, submission', () => {
    expect(tool.description).toMatch(/no review screenshot and no offers, and submits nothing/);
    expect(tool.description).toMatch(/media__upload/);
    expect(tool.description).toMatch(/release__submit_items/);
  });

  it('flags every pricing write as destructive, set_subscription_price included', () => {
    const writes = PRICING_TOOLS.filter((t) => t.annotations?.readOnlyHint === false);
    expect(writes.map((t) => t.name)).toContain('pricing__set_subscription_price');
    for (const t of writes) expect(t.annotations, t.name).toMatchObject({ destructiveHint: true, idempotentHint: false });
  });
});
