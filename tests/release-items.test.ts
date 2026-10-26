import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { executeReleaseTool, releaseItemsPreviewArgs, REVIEW_ITEM_TYPES } from '../src/tools/release.js';
import { buildWritePreview } from '../src/core/confirm.js';

function fake(options: { open?: boolean; existing?: any[]; platforms?: string[]; versionNumber?: number | string; groupState?: string; versionState?: string; catalogApproved?: boolean; catalogTruncated?: boolean; productType?: string; catalogProductType?: string; olderAppVersions?: number; assetReleaseState?: string; appState?: string; build?: any; versionPages?: any[]; priorItems?: any[]; productState?: string; earlierApproved?: boolean; versionListTruncated?: boolean; failOn?: string; injectAfterAdd?: any; history?: any[]; historyIncluded?: any[] } = {}) {
  const writes: Array<{ method: string; path: string; body: any }> = [];
  const reads: Array<{ path: string; query?: any }> = [];
  const currentItems = [...(options.existing ?? [])];
  const shownItems = (rows: any[], query?: any) => ({ data: rows.map((row) => query?.include ? row : { id: row.id, type: row.type, attributes: row.attributes }) });
  const get = async (path: string, query?: any) => {
    reads.push({ path, query });
    if (path === '/v1/apps/1') return { data: { id: '1', attributes: { name: 'Example' } } };
    if (path.startsWith('/versions-page-')) return options.versionPages?.[Number(path.split('-').at(-1))];
    if (path === '/v1/apps') return { data: [{ id: '1', attributes: { name: 'Example', bundleId: 'com.example' } }] };
    if (path === '/v1/apps/1/appStoreVersions' && options.versionPages) return options.versionPages[0];
    if (path === '/v1/apps/1/appStoreVersions') {
      const response = { ...(options.versionListTruncated ? { links: { next: '/next' } } : {}), data: (options.platforms ?? ['IOS']).map((platform, i) => ({
      id: `app-${i}`, relationships: { build: { data: { id: 'build-1' } }, appStoreReviewDetail: { data: { id: 'review-1' } } }, attributes: { versionString: '3.0', appStoreState: options.appState ?? 'PREPARE_FOR_SUBMISSION', platform },
    })), included: [
      ...(options.build === null ? [] : [{ id: 'build-1', type: 'builds', attributes: { processingState: 'VALID', expired: false, usesNonExemptEncryption: false, ...options.build } }]),
      { id: 'review-1', type: 'appStoreReviewDetails', attributes: { contactFirstName: 'Test', contactLastName: 'User', contactEmail: 'test@example.com', contactPhone: '+123' } },
    ] };
      const old = Array.from({ length: options.olderAppVersions ?? 0 }, (_, i) => ({ id: `old-${i}`, attributes: { versionString: `0.${i}`, appStoreState: 'READY_FOR_SALE', platform: 'IOS' } }));
      const all = [...old, ...response.data].filter((v) => ['platform', 'versionString', 'appStoreState'].every((f) => !query?.[`filter[${f}]`] || query[`filter[${f}]`].split(',').includes((v.attributes as any)[f])));
      return { ...response, data: all.slice(0, query?.limit ?? 20), ...(all.length > (query?.limit ?? 20) ? { links: { next: '/unread' } } : {}) };
    }
    if (path.endsWith('/appStoreVersionLocalizations')) return { data: [{ id: 'locale', attributes: { locale: 'en-US', description: 'Example' }, relationships: { appScreenshotSets: { data: [{ id: 'set' }] } } }] };
    if (path === '/v1/appStoreVersionLocalizations/locale/placements') return { data: [] };
    if (path === '/v1/appScreenshotSets/set/appScreenshots') return { data: [{ id: 'shot' }] };
    if (path === '/v1/apps/1/inAppPurchasesV2') return { data: options.catalogApproved ? [{ id: 'older-product', attributes: { state: 'APPROVED', inAppPurchaseType: options.catalogProductType ?? options.productType ?? 'CONSUMABLE' } }] : [], ...(options.catalogTruncated ? { links: { next: '/unread' } } : {}) };
    if (path === '/v1/apps/1/subscriptionGroups') return { data: options.catalogApproved ? [{ id: 'older-group' }] : [], ...(options.catalogTruncated ? { links: { next: '/unread' } } : {}) };
    if (path === '/v1/apps/1/reviewSubmissions') return query?.limit === 200
      ? { data: options.history ?? (options.priorItems ? [{ id: 'prior-1', attributes: { state: 'COMPLETE', platform: 'IOS', submittedDate: '2026-01-01T00:00:00Z' } }] : []), included: options.historyIncluded ?? [] }
      : options.open ? { data: [{ id: 'open-1' }] } : { data: [] };
    if (path === '/v1/reviewSubmissions/open-1/items' || path === '/v1/reviewSubmissions/new-1/items') return shownItems(currentItems, query);
    if (/^\/v1\/reviewSubmissions\/prior-\d+\/items$/.test(path)) return shownItems(options.priorItems ?? [], query);
    if (path === '/v2/inAppPurchases/iap-product-1/versions' || path === '/v1/subscriptions/product-1/versions' ||
        path === '/v1/appCustomProductPages/cpp-product-1/appCustomProductPageVersions' || path === '/v1/backgroundAssets/background-product-1/versions') {
      if (path.includes('/backgroundAssets/')) return { data: options.earlierApproved ? [{ id: 'earlier', attributes: { state: 'COMPLETE' }, relationships: { appStoreRelease: { data: { id: 'asset-release' } } } }] : [], included: [{ id: 'asset-release', type: 'backgroundAssetVersionAppStoreReleases', attributes: { state: options.assetReleaseState ?? 'ACCEPTED' } }] };
      return { data: options.earlierApproved ? [{ id: 'earlier', attributes: { state: 'APPROVED' } }] : [] };
    }
    if (path.startsWith('/v1/inAppPurchaseVersions/')) return { data: { id: path.split('/').at(-1), attributes: { version: options.versionNumber ?? 2, state: options.versionState ?? 'PREPARE_FOR_SUBMISSION' }, relationships: { inAppPurchase: { data: { id: 'iap-product-1' } } } }, included: query?.include === 'inAppPurchase' ? [{ id: 'iap-product-1', type: 'inAppPurchases', attributes: { name: 'Premium', inAppPurchaseType: options.productType ?? 'CONSUMABLE', state: options.productState ?? 'READY_TO_SUBMIT' } }] : [] };
    if (path.startsWith('/v1/subscriptionVersions/')) return { data: { id: path.split('/').at(-1), attributes: { version: options.versionNumber ?? 2, state: options.versionState ?? 'PREPARE_FOR_SUBMISSION' }, relationships: query?.include === 'subscription' ? { subscription: { data: { id: 'product-1' } } } : {} }, included: query?.include === 'subscription' ? [{ id: 'product-1', type: 'subscriptions', attributes: { name: 'Premium', inAppPurchaseType: options.productType ?? 'CONSUMABLE', state: options.productState ?? 'READY_TO_SUBMIT' } }] : [] };
    if (path === '/v1/subscriptions/product-1') return { data: { relationships: query?.include === 'group' ? { group: { data: { id: 'group-1' } } } : {} } };
    if (path === '/v1/subscriptionGroups/group-1/versions') return { data: [{ id: 'group-version-1', attributes: { state: options.groupState ?? 'PREPARE_FOR_SUBMISSION' } }] };
    if (path.startsWith('/v1/subscriptionGroupVersions/')) return { data: { attributes: { version: options.versionNumber ?? 2, state: options.versionState ?? 'PREPARE_FOR_SUBMISSION' } } };
    if (/^\/v[12]\/gameCenter\w+Versions\//.test(path)) return { data: { id: path.split('/').at(-1), attributes: { state: options.versionState, version: 1 } } };
    if (path.startsWith('/v1/appCustomProductPageVersions/')) return { data: { id: path.split('/').at(-1), attributes: { version: options.versionNumber ?? '2.0', state: options.productState ?? 'PREPARE_FOR_SUBMISSION' }, relationships: query?.include === 'appCustomProductPage' ? { appCustomProductPage: { data: { id: 'cpp-product-1' } } } : {} } };
    if (path.startsWith('/v1/backgroundAssetVersions/')) return { data: { id: path.split('/').at(-1), attributes: { version: options.versionNumber ?? '2.0', state: options.productState ?? 'PREPARE_FOR_SUBMISSION' }, relationships: query?.include?.includes('backgroundAsset') ? { backgroundAsset: { data: { id: 'background-product-1' } } } : {} } };
    throw new Error(`Unexpected read: ${path}`);
  };
  const request = async (method: string, path: string, opts?: any) => {
    writes.push({ method, path, body: opts?.body });
    if (options.failOn === `${method} ${path}`) throw new Error('fixture write failed');
    if (path === '/v1/reviewSubmissions') return { data: { id: 'new-1' } };
    if (path === '/v1/reviewSubmissionItems') {
      currentItems.push({ id: `added-${currentItems.length}`, type: 'reviewSubmissionItems', relationships: opts?.body?.data?.relationships });
      if (options.injectAfterAdd) currentItems.push(options.injectAfterAdd);
    }
    return { data: { attributes: { state: 'WAITING_FOR_REVIEW' } } };
  };
  return { http: { get, request } as any, writes, reads, currentItems };
}
const appVersionItem = { type: 'reviewSubmissionItems', id: 'old', relationships: { appStoreVersion: { data: { id: 'app-0' } } } };

describe('release__submit_items', () => {
  it('supports every non-app-version relationship in the Apple create schema', () => {
    const spec = JSON.parse(readFileSync('spec/openapi.json', 'utf8'));
    const relationships = spec.components.schemas.ReviewSubmissionItemCreateRequest.properties.data.properties.relationships.properties;
    expect([...REVIEW_ITEM_TYPES].sort()).toEqual(Object.keys(relationships).filter((x) => !['reviewSubmission', 'appStoreVersion'].includes(x)).sort());
  });
  it('opens, adds, and submits a new review submission', async () => {
    const { http, writes } = fake({ priorItems: [{ type: 'reviewSubmissionItems', id: 'prior-cpp', attributes: { state: 'APPROVED' }, relationships: { appCustomProductPageVersion: { data: { id: 'cpp-0' } } } }] });
    const result: any = await executeReleaseTool('release__submit_items', { app: 'Example', platform: 'IOS', items: [{ type: 'appCustomProductPageVersion', id: 'cpp-1' }] }, { http });
    expect(writes.map((w) => `${w.method} ${w.path}`)).toEqual([
      'POST /v1/reviewSubmissions', 'POST /v1/reviewSubmissionItems', 'PATCH /v1/reviewSubmissions/new-1',
    ]);
    expect(writes[1].body.data.relationships.appCustomProductPageVersion.data).toEqual({ type: 'appCustomProductPageVersions', id: 'cpp-1' });
    expect(result.items).toEqual([{ type: 'appCustomProductPageVersion', id: 'cpp-1' }]);
  });
  it('previews existing and requested items before reusing an open submission', async () => {
    const { http, writes } = fake({ open: true, existing: [appVersionItem] });
    const args = { app: 'Example', platform: 'IOS', items: [{ type: 'inAppPurchaseVersion', id: 'iap-2' }] };
    const preview = await releaseItemsPreviewArgs(args, http);
    expect(preview.items).toEqual([{ type: 'appStoreVersion', id: 'app-0' }, { type: 'inAppPurchaseVersion', id: 'iap-2' }]);
    const confirmation = await buildWritePreview('release__submit_items', { method: 'POST', path: 'release__submit_items (macro)', risk: 'release' }, preview);
    expect(confirmation.message).toContain('appStoreVersion: app-0 — already in submission');
    expect(confirmation.message).toContain('inAppPurchaseVersion: iap-2 — will be added');
    const result: any = await executeReleaseTool('release__submit_items', args, { http });
    expect(result.items).toEqual(preview.items);
    expect(writes.map((w) => w.method)).toEqual(['POST', 'PATCH']);
  });
  it('refuses a first product version without its app version before writing', async () => {
    const { http, writes } = fake({ versionNumber: 1 });
    await expect(executeReleaseTool('release__submit_items', { app: 'Example', platform: 'IOS', items: [{ type: 'inAppPurchaseVersion', id: 'iap-1' }] }, { http })).rejects.toThrow(/requires a new app version/);
    expect(writes).toEqual([]);
  });
  it('does not infer firstness from a custom product page string version', async () => {
    const { http, writes } = fake({ versionNumber: '1' });
    await expect(executeReleaseTool('release__submit_items', { app: 'Example', platform: 'IOS', items: [{ type: 'appCustomProductPageVersion', id: 'cpp-1' }] }, { http })).rejects.toThrow(/Cannot establish whether/);
    expect(writes).toEqual([]);
  });
  it('checks review history before submitting an unversioned item type', async () => {
    const args = { app: 'Example', platform: 'IOS', items: [{ type: 'appEvent', id: 'event-2' }] };
    const first = fake();
    await expect(executeReleaseTool('release__submit_items', args, { http: first.http })).rejects.toThrow(/Cannot establish whether appEvent/);
    expect(first.writes).toEqual([]);
    const prior = fake({ priorItems: [{ type: 'reviewSubmissionItems', id: 'old', attributes: { state: 'APPROVED' }, relationships: { appEvent: { data: { id: 'event-1' } } } }] });
    await executeReleaseTool('release__submit_items', args, { http: prior.http });
    expect(prior.writes.at(-1)?.method).toBe('PATCH');
  });
  it('refuses a first subscription without its group version', async () => {
    const { http, writes } = fake({ versionNumber: 1, open: true, existing: [appVersionItem] });
    await expect(executeReleaseTool('release__submit_items', { app: 'Example', platform: 'IOS', items: [{ type: 'subscriptionVersion', id: 'sub-1' }] }, { http })).rejects.toThrow(/requires its subscription group version/);
    expect(writes).toEqual([]);
  });
  it('rejects platform ambiguity before writing', async () => {
    const { http, writes } = fake({ platforms: ['IOS', 'MAC_OS'] });
    await expect(executeReleaseTool('release__submit_items', { app: 'Example', items: [{ type: 'appEvent', id: 'event-1' }] }, { http })).rejects.toThrow(/Say which with platform/);
    expect(writes).toEqual([]);
  });
  it('requires include for every existing item and refuses an unidentified row', async () => {
    const existing = [{ id: 'mystery-7', type: 'reviewSubmissionItems' }];
    const { http, writes, reads } = fake({ open: true, existing });
    await expect(releaseItemsPreviewArgs({ app: 'Example', platform: 'IOS', items: [{ type: 'appEvent', id: 'e-1' }] }, http)).rejects.toThrow(/mystery-7/);
    const spec = JSON.parse(readFileSync('spec/openapi.json', 'utf8'));
    const allowed = spec.paths['/v1/reviewSubmissions/{id}/items'].get.parameters.find((p: any) => p.name === 'include').schema.items.enum;
    expect(reads.find((r) => r.path.endsWith('/open-1/items'))?.query.include.split(',').sort()).toEqual([...allowed].sort());
    expect(writes).toEqual([]);
  });
  it('refuses when the approved item fingerprint differs from the execution read', async () => {
    const { http, writes, currentItems } = fake({ open: true, existing: [appVersionItem] });
    const args = { app: 'Example', platform: 'IOS', items: [{ type: 'appEvent', id: 'e-1' }] };
    const preview = await releaseItemsPreviewArgs(args, http);
    currentItems.push({ id: 'new-other', type: 'reviewSubmissionItems', relationships: { appAssetLibraryImage: { data: { id: 'image-1' } } } });
    await expect(executeReleaseTool('release__submit_items', args, { http, approvedPlanFingerprint: preview.planFingerprint as string, requireApprovedPlan: true })).rejects.toThrow(/changed since confirmation/);
    expect(writes).toEqual([]);
  });
  it('rechecks the final item set before submitted=true and reports partial state', async () => {
    const injected = { id: 'concurrent', type: 'reviewSubmissionItems', relationships: { appEvent: { data: { id: 'other-event' } } } };
    const { http, writes } = fake({ injectAfterAdd: injected });
    await expect(executeReleaseTool('release__submit_items', { app: 'Example', platform: 'IOS', with_app_version: true, items: [{ type: 'appEvent', id: 'e-1' }] }, { http })).rejects.toThrow(/Review submission new-1 stopped while verifying the final item list/);
    expect(writes.some((w) => w.method === 'PATCH')).toBe(false);
  });
  it('keeps the submission id, added items and failed step after a PATCH error', async () => {
    const { http } = fake({ failOn: 'PATCH /v1/reviewSubmissions/new-1' });
    await expect(executeReleaseTool('release__submit_items', { app: 'Example', platform: 'IOS', with_app_version: true, items: [{ type: 'appEvent', id: 'e-1' }] }, { http }))
      .rejects.toThrow(/Review submission new-1 stopped while setting submitted=true.*Items confirmed added: appStoreVersion\/app-0, appEvent\/e-1/s);
  });
  it('keeps the submission id and stopped item after a POST error', async () => {
    const { http } = fake({ failOn: 'POST /v1/reviewSubmissionItems' });
    await expect(executeReleaseTool('release__submit_items', { app: 'Example', platform: 'IOS', with_app_version: true, items: [{ type: 'appEvent', id: 'e-1' }] }, { http }))
      .rejects.toThrow(/Review submission new-1 stopped while adding appStoreVersion\/app-0.*Items confirmed added: none/s);
  });
  it('checks companions already inside a reused submission', async () => {
    const oldSubscription = { id: 'old-sub', type: 'reviewSubmissionItems', relationships: { subscriptionVersion: { data: { id: 'sub-1' } } } };
    const { http, writes, reads } = fake({ open: true, existing: [oldSubscription], versionNumber: 1 });
    await expect(executeReleaseTool('release__submit_items', { app: 'Example', platform: 'IOS', with_app_version: true, items: [{ type: 'appEvent', id: 'e-1' }] }, { http })).rejects.toThrow(/requires its subscription group version/);
    expect(reads.find((r) => r.path === '/v1/subscriptionVersions/sub-1')?.query.include).toBe('subscription');
    expect(reads.find((r) => r.path === '/v1/subscriptions/product-1')?.query.include).toBe('group');
    expect(writes).toEqual([]);
  });
  it('adds the editable app version as an explicit companion and previews it', async () => {
    const { http, writes } = fake({ versionNumber: 1 });
    const args = { app: 'Example', with_app_version: true, items: [{ type: 'inAppPurchaseVersion', id: 'iap-1' }] };
    const preview = await releaseItemsPreviewArgs(args, http);
    expect(preview.items).toEqual([{ type: 'appStoreVersion', id: 'app-0' }, { type: 'inAppPurchaseVersion', id: 'iap-1' }]);
    await executeReleaseTool('release__submit_items', args, { http, approvedPlanFingerprint: preview.planFingerprint as string, requireApprovedPlan: true });
    expect(writes.filter((w) => w.path === '/v1/reviewSubmissionItems')).toHaveLength(2);
  });
  it('uses approved product state as primary evidence despite missing v2 history', async () => {
    const { http, writes, reads } = fake({ versionNumber: 1, productState: 'APPROVED' });
    await executeReleaseTool('release__submit_items', { app: 'Example', platform: 'IOS', items: [{ type: 'inAppPurchaseVersion', id: 'iap-1' }] }, { http });
    expect(reads.filter((r) => r.path === '/v1/apps/1/reviewSubmissions' && r.query?.limit === 200)).toEqual([]);
    expect(writes.at(-1)?.method).toBe('PATCH');
  });
  it('ignores canceled, wrong-platform and rejected history', async () => {
    const old = { id: 'old', type: 'reviewSubmissionItems', attributes: { state: 'REJECTED' }, relationships: { appEvent: { data: { id: 'e-old' } } } };
    const removed = { id: 'removed', type: 'reviewSubmissionItems', attributes: { state: 'REMOVED' }, relationships: { appEvent: { data: { id: 'e-removed' } } } };
    const history = [
      { id: 'prior-1', attributes: { state: 'CANCELING', platform: 'IOS' }, relationships: { items: { data: [{ id: 'old' }] } } },
      { id: 'prior-2', attributes: { state: 'COMPLETE', platform: 'MAC_OS', submittedDate: '2026-01-01T00:00:00Z' }, relationships: { items: { data: [{ id: 'old' }] } } },
      { id: 'prior-3', attributes: { state: 'COMPLETE', platform: 'IOS', submittedDate: '2026-01-01T00:00:00Z' }, relationships: { items: { data: [{ id: 'old' }, { id: 'removed' }] } } },
      { id: 'prior-4', attributes: { state: 'COMPLETE', platform: 'IOS' }, relationships: { items: { data: [{ id: 'old' }] } } },
    ];
    const { http, writes, reads } = fake({ history, historyIncluded: [old, removed] });
    await expect(executeReleaseTool('release__submit_items', { app: 'Example', platform: 'IOS', items: [{ type: 'appEvent', id: 'e-1' }] }, { http })).rejects.toThrow(/Cannot establish whether/);
    const query = reads.find((r) => r.path === '/v1/apps/1/reviewSubmissions' && r.query?.limit === 200)?.query;
    expect(query).toMatchObject({ 'filter[platform]': 'IOS', include: 'items' });
    expect(query['filter[state]']).not.toContain('CANCELING');
    expect(writes).toEqual([]);
  });
  it('uses included history without per-submission reads and bounds inconclusive history', async () => {
    const included = { id: 'old', type: 'reviewSubmissionItems', attributes: { state: 'APPROVED' }, relationships: { appEvent: { data: { id: 'e-old' } } } };
    const history = [{ id: 'prior-1', attributes: { state: 'COMPLETE', platform: 'IOS', submittedDate: '2026-01-01T00:00:00Z' }, relationships: { items: { data: [{ id: 'old' }] } } }];
    const yes = fake({ history, historyIncluded: [included] });
    await executeReleaseTool('release__submit_items', { app: 'Example', platform: 'IOS', items: [{ type: 'appEvent', id: 'e-1' }] }, { http: yes.http });
    expect(yes.reads.some((r) => r.path.endsWith('/prior-1/items'))).toBe(false);
    const many = fake({ history: Array.from({ length: 11 }, (_, i) => ({ id: `prior-${i}`, attributes: { state: 'COMPLETE', platform: 'IOS', submittedDate: '2026-01-01T00:00:00Z' } })) });
    await expect(executeReleaseTool('release__submit_items', { app: 'Example', platform: 'IOS', items: [{ type: 'appEvent', id: 'e-1' }] }, { http: many.http })).rejects.toThrow(/More than 10 historical submissions/);
    expect(many.writes).toEqual([]);
  });
  it('refuses ambiguous or truncated platform selection', async () => {
    const old = fake({ platforms: ['IOS', 'MAC_OS'] });
    await expect(releaseItemsPreviewArgs({ app: 'Example', items: [{ type: 'appEvent', id: 'e-1' }] }, old.http)).rejects.toThrow(/more than one platform/);
    const truncated = fake({ versionPages: [{ data: [], meta: { paging: { total: 1 } } }] });
    await expect(releaseItemsPreviewArgs({ app: 'Example', with_app_version: true, items: [{ type: 'appEvent', id: 'e-1' }] }, truncated.http)).rejects.toThrow(/truncated/);
    expect(old.writes).toEqual([]);
    expect(truncated.writes).toEqual([]);
  });
  it('accepts string versions with an app-version companion and explains uncertainty without one', async () => {
    for (const type of ['appCustomProductPageVersion', 'backgroundAssetVersion']) {
      const yes = fake({ versionNumber: '2.0' });
      await executeReleaseTool('release__submit_items', { app: 'Example', platform: 'IOS', with_app_version: true, items: [{ type, id: 'v-2' }] }, { http: yes.http });
      expect(yes.writes.at(-1)?.method).toBe('PATCH');
      const unknown = fake({ versionNumber: '2.0' });
      await expect(executeReleaseTool('release__submit_items', { app: 'Example', platform: 'IOS', items: [{ type, id: 'v-2' }] }, { http: unknown.http })).rejects.toThrow(/Cannot establish whether/);
      const approvedEarlier = fake({ versionNumber: '2.0', earlierApproved: true });
      await executeReleaseTool('release__submit_items', { app: 'Example', platform: 'IOS', items: [{ type, id: 'v-2' }] }, { http: approvedEarlier.http });
      expect(approvedEarlier.writes.at(-1)?.method).toBe('PATCH');
    }
  });
});

describe('PR-V2 review regressions', () => {
  const itemArgs = (type = 'inAppPurchaseVersion') => ({ app: 'Example', platform: 'IOS', items: [{ type, id: 'new-version' }] });

  it.each(['APPROVED', 'ACCEPTED', 'REPLACED_WITH_NEW_VERSION'])('allows a new subscription in an already %s group', async (groupState) => {
    const { http, writes } = fake({ versionNumber: 1, catalogApproved: true, groupState });
    await executeReleaseTool('release__submit_items', itemArgs('subscriptionVersion'), { http });
    expect(writes.filter((w) => w.path === '/v1/reviewSubmissionItems')).toHaveLength(1);
    expect(writes.at(-1)?.method).toBe('PATCH');
  });

  it.each(['inAppPurchaseVersion', 'subscriptionVersion'])('uses app-level approval for another new %s', async (type) => {
    const { http, reads, writes } = fake({ versionNumber: 1, catalogApproved: true, groupState: 'APPROVED' });
    await executeReleaseTool('release__submit_items', itemArgs(type), { http });
    const catalog = reads.find((r) => r.path.endsWith(type === 'inAppPurchaseVersion' ? '/inAppPurchasesV2' : '/subscriptionGroups'))!;
    expect(catalog.query[type === 'inAppPurchaseVersion' ? 'filter[state]' : 'filter[subscriptions.state]']).toContain('APPROVED');
    if (type === 'inAppPurchaseVersion') expect(catalog.query['filter[inAppPurchaseType]']).toBe('CONSUMABLE');
    expect(writes.at(-1)?.method).toBe('PATCH');
  });

  it('does not infer approval from version 5, and refuses incomplete app-level evidence', async () => {
    for (const catalogTruncated of [false, true]) {
      const { http, writes } = fake({ versionNumber: 5, catalogTruncated });
      await expect(executeReleaseTool('release__submit_items', itemArgs(), { http })).rejects.toThrow(catalogTruncated ? /Cannot establish whether/ : /requires a new app version/);
      expect(writes).toEqual([]);
    }
  });

  it('still requires a group companion for a new group when the app already has subscriptions', async () => {
    const { http, writes } = fake({ versionNumber: 1, catalogApproved: true });
    await expect(executeReleaseTool('release__submit_items', itemArgs('subscriptionVersion'), { http })).rejects.toThrow(/requires its subscription group version/);
    expect(writes).toEqual([]);
  });

  it.each(['inAppPurchaseVersion', 'subscriptionVersion', 'subscriptionGroupVersion'])('recognizes REPLACED_WITH_NEW_VERSION on %s', async (type) => {
    const { http, writes } = fake({ versionNumber: 1, versionState: 'REPLACED_WITH_NEW_VERSION', groupState: 'REPLACED_WITH_NEW_VERSION' });
    await executeReleaseTool('release__submit_items', itemArgs(type), { http });
    expect(writes.at(-1)?.method).toBe('PATCH');
  });

  it.each(['gameCenterAchievementVersion', 'gameCenterActivityVersion', 'gameCenterChallengeVersion', 'gameCenterLeaderboardVersion', 'gameCenterLeaderboardSetVersion'])('recognizes Game Center LIVE on %s using its spec endpoint', async (type) => {
    const { http, reads, writes } = fake({ versionState: 'LIVE' });
    await executeReleaseTool('release__submit_items', itemArgs(type), { http });
    const spec = JSON.parse(readFileSync('spec/openapi.json', 'utf8'));
    expect(reads.some((r) => spec.paths[r.path.replace('/new-version', '/{id}')])).toBe(true);
    expect(writes.at(-1)?.method).toBe('PATCH');
  });

  it.each([
    { build: null }, { build: { processingState: 'PROCESSING' } },
    { build: { usesNonExemptEncryption: null } }, { build: { expired: true } },
    { appState: 'INVALID_BINARY' }, { appState: 'WAITING_FOR_EXPORT_COMPLIANCE' },
  ])('runs the same preflight for a companion app version: %j', async (options) => {
    const { http, writes } = fake(options);
    const args = { ...itemArgs('appEvent'), with_app_version: true };
    await expect(releaseItemsPreviewArgs(args, http)).rejects.toThrow(/App version 3.0 cannot accompany/);
    await expect(executeReleaseTool('release__submit_items', args, { http })).rejects.toThrow(/App version 3.0 cannot accompany/);
    expect(writes).toEqual([]);
  });

  it('names the companion version and resolves product names with existing/added status', async () => {
    const { http } = fake({ open: true, existing: [appVersionItem] });
    const args = { ...itemArgs(), with_app_version: true };
    const preview = await releaseItemsPreviewArgs(args, http);
    const confirmation = await buildWritePreview('release__submit_items', { method: 'POST', path: 'release__submit_items (macro)', risk: 'release' }, preview, undefined, http);
    expect(confirmation.message).toContain('appStoreVersion: app-0 (Version 3.0) — already in submission');
    expect(confirmation.message).toContain('inAppPurchaseVersion: new-version (Premium');
    expect(confirmation.message).toContain('will be added');
  });

  it('pages past 20 versions before inferring a platform, and retains ambiguity on a later page', async () => {
    const rows = Array.from({ length: 20 }, (_, i) => ({ id: `old-${i}`, attributes: { versionString: `${i}`, appStoreState: 'READY_FOR_SALE', platform: 'IOS' } }));
    const pages = [{ data: rows, links: { next: '/versions-page-1' }, meta: { paging: { total: 21 } } }, { data: [{ id: 'app-0', attributes: { versionString: '3.0', appStoreState: 'PREPARE_FOR_SUBMISSION', platform: 'MAC_OS' } }] }];
    const yes = fake({ versionPages: pages, priorItems: [{ id: 'old', attributes: { state: 'APPROVED' }, relationships: { appEvent: { data: { id: 'event' } } } }], history: [{ id: 'prior-1', attributes: { state: 'COMPLETE', platform: 'MAC_OS', submittedDate: '2026-01-01' } }] });
    const preview = await releaseItemsPreviewArgs({ app: 'Example', items: [{ type: 'appEvent', id: 'new-event' }] }, yes.http);
    expect(preview.platform).toBe('macOS');
    pages[0].data[0].attributes.appStoreState = 'PREPARE_FOR_SUBMISSION';
    const ambiguous = fake({ versionPages: pages });
    await expect(releaseItemsPreviewArgs({ app: 'Example', items: [{ type: 'appEvent', id: 'new-event' }] }, ambiguous.http)).rejects.toThrow(/more than one platform/);
  });
});

describe('item release history and state regressions', () => {
  it.each([false, true])('handles 30 old app versions with with_app_version=%s', async (with_app_version) => {
    const { http, reads, writes } = fake({ olderAppVersions: 30, catalogApproved: true });
    const args = { app: 'Example', with_app_version, items: [{ type: 'inAppPurchaseVersion', id: 'new' }] };
    expect((await releaseItemsPreviewArgs(args, http)).platform).toBe('iOS');
    await executeReleaseTool('release__submit_items', args, { http });
    expect(writes.at(-1)?.method).toBe('PATCH');
    expect(reads.filter((r) => r.path.endsWith('/appStoreVersions')).every((r) => r.query?.['filter[appStoreState]'] || r.query?.['filter[versionString]'])).toBe(true);
  });
  it.each(['ACCEPTED', 'PROCESSING_FOR_DISTRIBUTION', 'READY_FOR_DISTRIBUTION', 'SUPERSEDED'])('uses background asset App Store release state %s as approval', async (assetReleaseState) => {
    const { http, writes } = fake({ earlierApproved: true, assetReleaseState });
    await executeReleaseTool('release__submit_items', { app: 'Example', platform: 'IOS', items: [{ type: 'backgroundAssetVersion', id: 'new' }] }, { http });
    expect(writes.at(-1)?.method).toBe('PATCH');
  });
  it('does not confuse a completed asset upload with App Store approval', async () => {
    const { http, writes } = fake({ earlierApproved: true, productState: 'COMPLETE', assetReleaseState: 'WAITING_FOR_REVIEW' });
    await expect(executeReleaseTool('release__submit_items', { app: 'Example', platform: 'IOS', items: [{ type: 'backgroundAssetVersion', id: 'new' }] }, { http })).rejects.toThrow(/Cannot establish whether/);
    expect(writes).toEqual([]);
  });
});

describe('first-product evidence boundaries', () => {
  it('does not treat an approved consumable as approval of the first non-consumable', async () => {
    const { http, writes } = fake({ productType: 'NON_CONSUMABLE', catalogProductType: 'CONSUMABLE', catalogApproved: true, versionNumber: 1 });
    await expect(executeReleaseTool('release__submit_items', { app: 'Example', platform: 'IOS', items: [{ type: 'inAppPurchaseVersion', id: 'new' }] }, { http })).rejects.toThrow(/requires a new app version/);
    expect(writes).toEqual([]);
  });
  it('accepts positive app-level approval even when more approved products exist', async () => {
    const { http, writes } = fake({ catalogApproved: true, catalogTruncated: true, versionNumber: 1 });
    await executeReleaseTool('release__submit_items', { app: 'Example', platform: 'IOS', items: [{ type: 'inAppPurchaseVersion', id: 'new' }] }, { http });
    expect(writes.at(-1)?.method).toBe('PATCH');
  });
  it('refuses if the companion identity changes during preflight', async () => {
    const { http, writes } = fake();
    const get = http.get;
    let reads = 0;
    http.get = async (path: string, query?: any) => {
      const res = await get(path, query);
      if (path.endsWith('/appStoreVersions') && ++reads === 2) res.data[0].id = 'replacement-version';
      return res;
    };
    await expect(executeReleaseTool('release__submit_items', { app: 'Example', platform: 'IOS', with_app_version: true, items: [{ type: 'appEvent', id: 'event' }] }, { http })).rejects.toThrow(/changed during preflight/);
    expect(writes).toEqual([]);
  });
});
