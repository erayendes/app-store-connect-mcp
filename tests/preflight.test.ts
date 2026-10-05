/**
 * `preflight__check_version` — the checklist, not the calls.
 *
 * Each of these gaps is one field on one resource, and each one comes back as
 * a rejection or a stalled version days after the submission. What is worth
 * testing is that the tool reads the field Apple actually enforces, and that a
 * blank that is *supposed* to be blank does not become a finding: a preflight
 * that cries wolf is one the reader learns to skip.
 */
import { describe, it, expect, vi } from 'vitest';
import { executePreflightTool, PREFLIGHT_TOOLS } from '../src/tools/preflight.js';
import { AscApiError } from '../src/core/errors.js';
import { readFileSync } from 'node:fs';
import { OPERATIONS } from '../src/generated/operations.js';

interface Overrides {
  version?: Record<string, unknown>;
  build?: Record<string, unknown> | null;
  review?: Record<string, unknown> | null;
  localizations?: Record<string, unknown>[];
  screenshots?: Record<string, unknown>[];
  submission?: boolean;
}

/** A version with nothing wrong with it, which each test then breaks one way. */
function fakeHttp(o: Overrides = {}) {
  const included: any[] = [];
  const relationships: any = {};

  if (o.build !== null) {
    included.push({
      type: 'builds',
      id: 'b-1',
      attributes: { version: '412', processingState: 'VALID', expired: false, usesNonExemptEncryption: false, ...o.build },
    });
    relationships.build = { data: { id: 'b-1' } };
  }
  if (o.review !== null) {
    included.push({
      type: 'appStoreReviewDetails',
      id: 'r-1',
      attributes: {
        contactFirstName: 'Eray', contactLastName: 'Endes',
        contactPhone: '+90...', contactEmail: 'x@example.com',
        demoAccountRequired: false, ...o.review,
      },
    });
    relationships.appStoreReviewDetail = { data: { id: 'r-1' } };
  }

  const localizations = o.localizations ?? [
    { locale: 'en-US', description: 'A description.', keywords: 'quran,islam', whatsNew: 'Fixes.' },
  ];

  const get = vi.fn(async (path: string) => {
    if (path === '/v1/apps') {
      return { data: [{ id: '6636549188', attributes: { name: 'Ask Quran', bundleId: 'com.milowda.askquranai' } }] };
    }
    if (path.includes('/appStoreVersionLocalizations')) {
      return {
        data: localizations.map((l, i) => ({
          id: `l-${i}`,
          attributes: l,
          relationships: { appScreenshotSets: { data: i === 0 ? [{ id: 'set-1' }] : [] } },
        })),
        included: [{ type: 'appScreenshotSets', id: 'set-1', attributes: { screenshotDisplayType: 'APP_IPHONE_67' } }],
      };
    }
    if (path.includes('/appStoreVersions')) {
      return {
        data: [
          {
            id: 'v-320',
            attributes: { versionString: '3.2.0', appStoreState: 'PREPARE_FOR_SUBMISSION', ...o.version },
            relationships,
          },
        ],
        included,
      };
    }
    if (path.includes('/appScreenshots')) {
      return { data: o.screenshots ?? [{ id: 's-1', attributes: { assetDeliveryState: { state: 'COMPLETE' } } }] };
    }
    if (path.includes('/reviewSubmissions')) {
      return o.submission
        ? { data: [{ id: 'sub-1' }], included: [{ type: 'reviewSubmissionItems', id: 'i-1', relationships: {} }] }
        : { data: [] };
    }
    return { data: [] };
  });
  return { get } as any;
}

const run = (o: Overrides = {}) =>
  executePreflightTool('preflight__check_version', { app: 'Ask Quran' }, { http: fakeHttp(o) }) as Promise<any>;

describe('preflight__check_version', () => {
  it('is read-only and says so, since a client decides what to auto-approve from that', () => {
    expect(PREFLIGHT_TOOLS[0].annotations?.readOnlyHint).toBe(true);
  });

  it('passes a complete version and lists what it looked at', async () => {
    const res = await run();
    expect(res.ready).toBe(true);
    expect(res.blocking).toEqual([]);
    expect(res.checked).toContain('export compliance answered');
    expect(res.version).toBe('3.2.0');
  });

  it('catches a build that is still processing, and says to wait rather than to act', async () => {
    const res = await run({ build: { processingState: 'PROCESSING' } });
    expect(res.ready).toBe(false);
    const gap = res.blocking.find((b: any) => b.check === 'build');
    expect(gap.problem).toContain('PROCESSING');
    expect(gap.fixWith).toContain('wait');
  });

  it('catches the unanswered export compliance question, which has no error of its own', async () => {
    // null, not false: false is an answer. Apple parks the version at
    // WAITING_FOR_EXPORT_COMPLIANCE and reports nothing.
    const res = await run({ build: { usesNonExemptEncryption: null } });
    expect(res.ready).toBe(false);
    expect(res.blocking.map((b: any) => b.check)).toContain('export compliance');
  });

  it('asks for a demo account only when the app says one is required', async () => {
    const notRequired = await run({ review: { demoAccountRequired: false, demoAccountName: '', demoAccountPassword: '' } });
    expect(notRequired.ready).toBe(true);

    const required = await run({ review: { demoAccountRequired: true, demoAccountName: '', demoAccountPassword: '' } });
    expect(required.ready).toBe(false);
    expect(required.blocking[0].problem).toContain('demoAccountName and demoAccountPassword');
  });

  it('blocks on a missing description and only warns about missing keywords', async () => {
    const res = await run({
      localizations: [
        { locale: 'en-US', description: 'A description.', keywords: 'quran' },
        { locale: 'tr', description: '', keywords: '' },
      ],
    });
    expect(res.blocking.map((b: any) => b.check)).toContain('localizations');
    expect(res.blocking.map((b: any) => b.problem).join()).toContain('tr');
    expect(res.warnings.join()).toContain('keywords');
  });

  it('catches a screenshot set that holds no images, and one that failed to deliver', async () => {
    const empty = await run({ screenshots: [] });
    expect(empty.blocking.map((b: any) => b.problem).join()).toContain('no images');

    const failed = await run({ screenshots: [{ id: 's-1', attributes: { assetDeliveryState: { state: 'FAILED' } } }] });
    expect(failed.blocking.map((b: any) => b.problem).join()).toContain('failed to deliver');
  });

  it('says an open review submission does not carry this version', async () => {
    const res = await run({ submission: true });
    expect(res.warnings.join()).toContain('not one of them');
  });

  it('refuses to grade a version that has moved past editing', async () => {
    // Reporting "ready: true" on a version already in review would be a true
    // sentence answering a question nobody asked.
    const res = await run({ version: { appStoreState: 'IN_REVIEW' } });
    expect(res.ready).toBe(false);
    expect(res.blocking).toEqual([]);
    expect(res.checked).toEqual([]);
    expect(res.warnings[0]).toContain('IN_REVIEW');
  });
});

// Every route below is an actual relationship in the checked-in Apple spec.
// Unrecognised reads fail so a typo cannot masquerade as an empty catalog.
const subscriptionTool = 'preflight__check_subscription';
const catalogSubscription = (id = 's1') => ({
  id, type: 'subscriptions', attributes: {
    name: 'Monthly', productId: `com.example.${id}`, state: 'READY_TO_SUBMIT',
    subscriptionPeriod: 'ONE_MONTH', familySharable: false, reviewNote: 'Open Settings to subscribe.',
  },
});
const catalogGroup = (id = 'g1') => ({ id, attributes: { referenceName: 'Premium' } });
const subscriptionLocale = (locale = 'en-US') => ({ id: locale, attributes: { locale, name: 'Premium', description: 'Full access.' } });
const groupLocale = (locale = 'en-US') => ({ id: locale, attributes: { locale, name: 'Premium' } });
function catalogHttp(overrides: Record<string, any> = {}) {
  const routes: Record<string, any> = {
    '/v1/apps/1': { data: { id: '1', attributes: { name: 'Example' } } },
    '/v1/apps': { data: [{ id: '1', attributes: { name: 'Example', bundleId: 'com.example' } }] },
    '/v1/apps/1/subscriptionGroups': { data: [catalogGroup()] },
    '/v1/subscriptionGroups/g1/subscriptions': { data: [catalogSubscription()] },
    '/v1/subscriptionGroups/g1/subscriptionGroupLocalizations': { data: [groupLocale()] },
    ...overrides,
  };
  const get = vi.fn(async (path: string, _params?: any) => {
    const fallback: Record<string, any> = {
      subscriptionLocalizations: { data: [subscriptionLocale()] },
      prices: { data: [{ id: 'price1' }] },
      planAvailabilities: { data: [{ id: 'plan1' }] },
      availableTerritories: { data: [{ id: 'USA' }] },
      appStoreReviewScreenshot: { data: { id: 'shot1', attributes: { assetDeliveryState: { state: 'COMPLETE' } } } },
    };
    const response = Object.hasOwn(routes, path) ? routes[path] : fallback[path.split('/').at(-1)!];
    if (response instanceof Error) throw response;
    if (!response) throw new Error(`Unexpected read: ${path}`);
    return response;
  });
  return { get } as any;
}
const runCatalog = (overrides: Record<string, any> = {}, args: Record<string, unknown> = { app: '1', subscription: 'com.example.s1' }) =>
  executePreflightTool(subscriptionTool, args, { http: catalogHttp(overrides) }) as Promise<any>;

describe(subscriptionTool, () => {
  it('uses current spec endpoints, valid sparse fields and explicit one-page limits', async () => {
    const http = catalogHttp();
    await executePreflightTool(subscriptionTool, { app: '1', group: 'g1' }, { http });
    const spec = JSON.parse(readFileSync('spec/openapi.json', 'utf8'));
    for (const [path, params] of http.get.mock.calls) {
      const route = Object.keys(spec.paths).find((p) => new RegExp(`^${p.replaceAll('{id}', '[^/]+')}$`).test(path));
      expect(route, path).toBeTruthy();
      const operation = spec.paths[route!].get;
      expect(operation.deprecated).not.toBe(true);
      const parameters = operation.parameters ?? [];
      if (parameters.some((p: any) => p.name === 'limit')) expect(params.limit, path).toBeGreaterThan(0);
      for (const [name, value] of Object.entries(params ?? {})) {
        const parameter = parameters.find((p: any) => p.name === name);
        expect(parameter, `${path}: ${name}`).toBeTruthy();
        if (name.startsWith('fields[')) {
          for (const field of String(value).split(',')) expect(parameter.schema.items.enum).toContain(field);
        }
      }
    }
  });
  it('every finding names an existing, current raw fix tool in the curation sheet', async () => {
    const sub = catalogSubscription();
    Object.assign(sub.attributes, { name: '', productId: '', subscriptionPeriod: '', familySharable: null, reviewNote: '' });
    const result = await runCatalog({
      '/v1/subscriptionGroups/g1/subscriptions': { data: [sub] },
      '/v1/subscriptionGroups/g1/subscriptionGroupLocalizations': { data: [] },
      '/v1/subscriptions/s1/subscriptionLocalizations': { data: [] },
      '/v1/subscriptions/s1/prices': { data: [] },
      '/v1/subscriptions/s1/planAvailabilities': { data: [] },
      '/v1/subscriptions/s1/appStoreReviewScreenshot': { data: null },
    }, { app: '1', subscription: 's1' });
    const csv = readFileSync('spec/profiles.csv', 'utf8');
    const fixes = [...result.subscriptions[0].findings.map((f: any) => f.fixWith),
      'subscription_localizations__update', 'subscription_group_localizations__update',
      'subscription_plan_availabilities__available_territories__replace'];
    for (const fix of fixes) {
      const op = OPERATIONS.find((o) => o.name.replaceAll('.', '__') === fix);
      expect(op, fix).toBeTruthy();
      expect(op!.deprecated, fix).toBe(false);
      expect(op!.readOnly, fix).toBe(false);
      expect(csv).toMatch(new RegExp(`monetization,subscription-(?:catalog|pricing),${fix},`));
    }
  });
  it('treats only screenshot 404 as absence and propagates other API errors', async () => {
    const result = await runCatalog({ '/v1/subscriptions/s1/appStoreReviewScreenshot': new AscApiError('missing', 404) });
    expect(result.subscriptions[0].ready).toBe(false);
    for (const status of [401, 403, 429, 500]) {
      const error = new AscApiError('API failure', status);
      await expect(runCatalog({ '/v1/subscriptions/s1/appStoreReviewScreenshot': error })).rejects.toBe(error);
    }
    const error = new AscApiError('forbidden', 403);
    await expect(runCatalog({ '/v1/subscriptions/s1/planAvailabilities': error })).rejects.toBe(error);
  });
  it('blocks a failed review screenshot upload', async () => {
    const result = await runCatalog({ '/v1/subscriptions/s1/appStoreReviewScreenshot': { data: { id: 'shot1', attributes: { assetDeliveryState: { state: 'FAILED' } } } } });
    expect(result.subscriptions[0].ready).toBe(false);
    expect(result.subscriptions[0].findings[0].problem).toContain('failed asset delivery');
  });
  it('is idempotent and read-only, and accepts a ready subscription with family sharing disabled', async () => {
    expect(PREFLIGHT_TOOLS.find((t) => t.name === subscriptionTool)?.annotations).toEqual({ readOnlyHint: true, idempotentHint: true });
    const result = await runCatalog();
    expect(result.subscriptions).toEqual([{
      id: 's1', productId: 'com.example.s1', name: 'Monthly', state: 'READY_TO_SUBMIT',
      ready: true, findings: [], truncated: [],
    }]);
    expect(result.group).toBeUndefined();
    expect(result.note).toContain('Apple approval is not predicted');
  });

  it.each(['s1', 'com.example.s1', 'Monthly'])('resolves subscription selector %s within the app', async (subscription) => {
    expect((await runCatalog({}, { app: '1', subscription })).subscriptions[0].id).toBe('s1');
  });
  it.each(['Example', 'com.example', '1'])('resolves app selector %s', async (app) => {
    expect((await runCatalog({}, { app, subscription: 's1' })).app).toBe('Example (1)');
  });
  it.each([
    ['subscriptionLocalizations', 'localizations', 'subscription_localizations__create'],
    ['prices', 'price', 'subscription_prices__create'],
    ['planAvailabilities', 'availability', 'subscription_plan_availabilities__create'],
    ['appStoreReviewScreenshot', 'review screenshot', 'subscription_app_store_review_screenshots__create'],
  ])('blocks on empty %s', async (relationship, check, fixWith) => {
    const result = await runCatalog({ [`/v1/subscriptions/s1/${relationship}`]: { data: relationship === 'appStoreReviewScreenshot' ? null : [] } });
    expect(result.subscriptions[0].ready).toBe(false);
    expect(result.subscriptions[0].findings).toContainEqual(expect.objectContaining({ check, severity: 'blocking', fixWith }));
  });
  it('blocks on no available territories, including multiple empty plans', async () => {
    const result = await runCatalog({
      '/v1/subscriptions/s1/planAvailabilities': { data: [{ id: 'plan1' }, { id: 'plan2' }] },
      '/v1/subscriptionPlanAvailabilities/plan1/availableTerritories': { data: [] },
      '/v1/subscriptionPlanAvailabilities/plan2/availableTerritories': { data: [] },
    });
    expect(result.subscriptions[0].findings).toContainEqual(expect.objectContaining({ check: 'territories', severity: 'blocking', fixWith: 'subscription_plan_availabilities__available_territories__replace' }));
  });
  it('checks more than the first plan before concluding there are no territories', async () => {
    const result = await runCatalog({
      '/v1/subscriptions/s1/planAvailabilities': { data: [{ id: 'plan1' }, { id: 'plan2' }] },
      '/v1/subscriptionPlanAvailabilities/plan1/availableTerritories': { data: [] },
    });
    expect(result.subscriptions[0].ready).toBe(true);
  });
  it.each(['name', 'productId', 'subscriptionPeriod'])('blocks on missing %s', async (field) => {
    const sub = catalogSubscription();
    (sub.attributes as any)[field] = null;
    const result = await runCatalog({ '/v1/subscriptionGroups/g1/subscriptions': { data: [sub] } }, { app: '1', subscription: 's1' });
    expect(result.subscriptions[0].findings).toContainEqual(expect.objectContaining({ check: field, severity: 'blocking' }));
    expect(result.subscriptions[0].ready).toBe(false);
  });
  it('warns about missing review note and family-sharing value without claiming they are required', async () => {
    const sub = catalogSubscription();
    Object.assign(sub.attributes, { reviewNote: '  ', familySharable: null, state: 'MISSING_METADATA' });
    const result = (await runCatalog({ '/v1/subscriptionGroups/g1/subscriptions': { data: [sub] } })).subscriptions[0];
    expect(result.ready).toBe(true);
    expect(result.state).toBe('MISSING_METADATA');
    expect(result.findings.map((f: any) => [f.check, f.severity])).toEqual([['family sharing', 'warning'], ['review note', 'warning']]);
  });
  it.each(['name', 'description'])('blocks on a localization missing %s', async (field) => {
    const loc = subscriptionLocale();
    (loc.attributes as any)[field] = ' ';
    const result = await runCatalog({ '/v1/subscriptions/s1/subscriptionLocalizations': { data: [loc] } });
    expect(result.subscriptions[0].findings).toContainEqual(expect.objectContaining({ severity: 'blocking', problem: `Localization en-US is missing ${field}.`, fixWith: 'subscription_localizations__update' }));
  });
  it('warns on locales present on the group but missing on the subscription', async () => {
    const result = await runCatalog({ '/v1/subscriptionGroups/g1/subscriptionGroupLocalizations': { data: [groupLocale(), groupLocale('tr')] } });
    expect(result.subscriptions[0].ready).toBe(true);
    expect(result.subscriptions[0].findings).toEqual([expect.objectContaining({ check: 'locale coverage', severity: 'warning', problem: expect.stringContaining('tr') })]);
  });
  it('blocks both the group and each subscription when group localizations are absent', async () => {
    const result = await runCatalog({ '/v1/subscriptionGroups/g1/subscriptionGroupLocalizations': { data: [] } }, { app: '1', group: 'Premium' });
    expect(result.group.ready).toBe(false);
    expect(result.group.findings).toEqual([expect.objectContaining({ check: 'group localizations', severity: 'blocking', fixWith: 'subscription_group_localizations__create' })]);
    expect(result.subscriptions[0].ready).toBe(false);
  });
  it('blocks on a group localization missing its display name', async () => {
    const result = await runCatalog({ '/v1/subscriptionGroups/g1/subscriptionGroupLocalizations': { data: [{ id: 'gl1', attributes: { locale: 'tr', name: '' } }] } });
    expect(result.subscriptions[0].findings).toContainEqual(expect.objectContaining({ severity: 'blocking', fixWith: 'subscription_group_localizations__update' }));
  });
  it('checks every subscription in a group up to the cap and never follows next', async () => {
    const http = catalogHttp({ '/v1/subscriptionGroups/g1/subscriptions': { data: Array.from({ length: 21 }, (_, i) => catalogSubscription(`s${i}`)), links: { next: '/do-not-follow' } } });
    const result: any = await executePreflightTool(subscriptionTool, { app: '1', group: 'g1' }, { http });
    expect(result.subscriptions).toHaveLength(20);
    expect(result.group.checkedSubscriptions).toBe(20);
    expect(result.group.truncated.join()).toContain('20 rows');
    expect(http.get.mock.calls.filter(([p]: [string]) => p.endsWith('/prices'))).toHaveLength(20);
    expect(http.get.mock.calls.some(([p]: [string]) => p.includes('s20/'))).toBe(false);
  });
  it('blocks an empty group', async () => {
    const result = await runCatalog({ '/v1/subscriptionGroups/g1/subscriptions': { data: [] } }, { app: '1', group: 'g1' });
    expect(result.group.ready).toBe(false);
    expect(result.group.findings[0].fixWith).toBe('subscriptions__create');
  });
  it('makes group ready false if any member has a blocking finding', async () => {
    const result = await runCatalog({
      '/v1/subscriptionGroups/g1/subscriptions': { data: [catalogSubscription(), catalogSubscription('s2')] },
      '/v1/subscriptions/s2/prices': { data: [] },
    }, { app: '1', group: 'g1' });
    expect(result.subscriptions.map((s: any) => s.ready)).toEqual([true, false]);
    expect(result.group.ready).toBe(false);
  });
  it('rejects absent and ambiguous subscriptions rather than selecting the first', async () => {
    await expect(runCatalog({}, { app: '1', subscription: 'unknown' })).rejects.toThrow('No subscription matching');
    await expect(runCatalog({ '/v1/subscriptionGroups/g1/subscriptions': { data: [catalogSubscription(), catalogSubscription('s2')] } }, { app: '1', subscription: 'Monthly' })).rejects.toThrow('ambiguous');
  });
  it('rejects ambiguous matches across groups, and scopes subscription IDs to the app', async () => {
    await expect(runCatalog({
      '/v1/apps/1/subscriptionGroups': { data: [catalogGroup(), catalogGroup('g2')] },
      '/v1/subscriptionGroups/g2/subscriptions': { data: [catalogSubscription('s2')] },
    }, { app: '1', subscription: 'Monthly' })).rejects.toThrow('ambiguous');
    await expect(runCatalog({}, { app: '1', subscription: 'foreign-subscription-id' })).rejects.toThrow('No subscription matching');
  });
  it('rejects absent and ambiguous groups', async () => {
    await expect(runCatalog({}, { app: '1', group: 'Unknown' })).rejects.toThrow('No group matching');
    await expect(runCatalog({ '/v1/apps/1/subscriptionGroups': { data: [catalogGroup(), catalogGroup('g2')] } }, { app: '1', group: 'Premium' })).rejects.toThrow('ambiguous');
  });
  it.each([
    {}, { app: ' ' }, { app: '1' }, { app: '1', subscription: 's1', group: 'g1' },
    { app: '1', subscription: '' }, { app: '1', group: 1 }, { app: '1', subscription: null },
  ])('rejects invalid input before reading: %j', async (args) => {
    const http = catalogHttp();
    await expect(executePreflightTool(subscriptionTool, args, { http })).rejects.toThrow();
    expect(http.get).not.toHaveBeenCalled();
  });
  it('reports truncation for every paginated list and does not infer missing unseen locales', async () => {
    const more = { next: '/unread' };
    const result = await runCatalog({
      '/v1/subscriptionGroups/g1/subscriptionGroupLocalizations': { data: [groupLocale('tr')], links: more },
      '/v1/subscriptions/s1/subscriptionLocalizations': { data: [subscriptionLocale()], links: more },
      '/v1/subscriptions/s1/prices': { data: [{ id: 'price1' }], meta: { paging: { total: 10 } } },
      '/v1/subscriptions/s1/planAvailabilities': { data: [{ id: 'plan1' }], links: more },
      '/v1/subscriptionPlanAvailabilities/plan1/availableTerritories': { data: [{ id: 'USA' }], links: more },
    });
    // Prices and territories are presence checks: the one row read answers them,
    // so the rows behind it are not reported. Live data had every subscription
    // flagged as truncated because of these two.
    expect(result.subscriptions[0].truncated).toHaveLength(3);
    expect(result.subscriptions[0].truncated.join()).not.toMatch(/prices|availableTerritories/);
    expect(result.subscriptions[0].findings).toEqual([]);
  });
  it('names each missing group locale once, though Apple lists a draft beside the approved copy', async () => {
    const result = await runCatalog({
      '/v1/subscriptionGroups/g1/subscriptionGroupLocalizations': { data: [groupLocale('tr'), groupLocale('tr'), groupLocale('en-US')] },
      '/v1/subscriptions/s1/subscriptionLocalizations': { data: [subscriptionLocale()] },
    });
    const coverage = result.subscriptions[0].findings.find((f: any) => f.check === 'locale coverage');
    expect(coverage?.problem.match(/\btr\b/g)).toHaveLength(1);
  });
  it('never claims no availability or localizations when the cap hides rows', async () => {
    const result = await runCatalog({
      '/v1/subscriptions/s1/planAvailabilities': { data: [{ id: 'plan1' }], links: { next: '/unread' } },
      '/v1/subscriptionPlanAvailabilities/plan1/availableTerritories': { data: [] },
      '/v1/subscriptions/s1/subscriptionLocalizations': { data: [], links: { next: '/unread' } },
    });
    expect(result.subscriptions[0].findings).toEqual([]);
    expect(result.subscriptions[0].truncated).toHaveLength(2);
  });
  it('reports truncated resolution, and refuses to claim an unambiguous name in a partial catalog', async () => {
    const overrides = { '/v1/apps/1/subscriptionGroups': { data: [catalogGroup()], links: { next: '/unread' } } };
    expect((await runCatalog(overrides)).truncated.join()).toContain('20 rows');
    await expect(runCatalog(overrides, { app: '1', subscription: 'unknown' })).rejects.toThrow('Search truncated');
    await expect(runCatalog(overrides, { app: '1', subscription: 'Monthly' })).rejects.toThrow('cannot establish');
    await expect(runCatalog({ '/v1/subscriptionGroups/g1/subscriptions': { data: [catalogSubscription()], meta: { paging: { total: 100 } } } }, { app: '1', subscription: 'Monthly' })).rejects.toThrow('Search truncated');
  });
});
