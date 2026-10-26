import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { executeReleaseTool, releaseItemsPreviewArgs, REVIEW_ITEM_TYPES } from '../src/tools/release.js';
import { buildWritePreview } from '../src/core/confirm.js';

function fake(options: { open?: boolean; existing?: any[]; platforms?: string[]; versionNumber?: number; priorItems?: any[] } = {}) {
  const writes: Array<{ method: string; path: string; body: any }> = [];
  const get = async (path: string, query?: any) => {
    if (path === '/v1/apps') return { data: [{ id: '1', attributes: { name: 'Example', bundleId: 'com.example' } }] };
    if (path === '/v1/apps/1/appStoreVersions') return { data: (options.platforms ?? ['IOS']).map((platform, i) => ({
      id: `app-${i}`, attributes: { versionString: '3.0', appStoreState: 'PREPARE_FOR_SUBMISSION', platform },
    })) };
    if (path === '/v1/apps/1/reviewSubmissions') return query?.limit === 200
      ? { data: options.priorItems ? [{ id: 'prior-1' }] : [] }
      : options.open ? { data: [{ id: 'open-1' }] } : { data: [] };
    if (path === '/v1/reviewSubmissions/open-1/items') return { data: options.existing ?? [] };
    if (path === '/v1/reviewSubmissions/prior-1/items') return { data: options.priorItems ?? [] };
    if (path.startsWith('/v1/inAppPurchaseVersions/')) return { data: { id: path.split('/').at(-1), attributes: { version: options.versionNumber ?? 2 } } };
    if (path.startsWith('/v1/subscriptionVersions/')) return { data: { id: path.split('/').at(-1), attributes: { version: options.versionNumber ?? 2 }, relationships: { subscription: { data: { id: 'product-1' } } } } };
    if (path === '/v1/subscriptions/product-1') return { data: { relationships: { group: { data: { id: 'group-1' } } } } };
    if (path === '/v1/subscriptionGroups/group-1/versions') return { data: [{ id: 'group-version-1' }] };
    if (path.startsWith('/v1/subscriptionGroupVersions/')) return { data: { attributes: { version: options.versionNumber ?? 2 } } };
    if (path.startsWith('/v1/appCustomProductPageVersions/')) return { data: { attributes: { version: options.versionNumber ?? 2 } } };
    throw new Error(`Unexpected read: ${path}`);
  };
  const request = async (method: string, path: string, opts?: any) => {
    writes.push({ method, path, body: opts?.body });
    if (path === '/v1/reviewSubmissions') return { data: { id: 'new-1' } };
    return { data: { attributes: { state: 'WAITING_FOR_REVIEW' } } };
  };
  return { http: { get, request } as any, writes };
}
const appVersionItem = { type: 'reviewSubmissionItems', id: 'old', relationships: { appStoreVersion: { data: { id: 'app-0' } } } };

describe('release__submit_items', () => {
  it('supports every non-app-version relationship in the Apple create schema', () => {
    const spec = JSON.parse(readFileSync('spec/openapi.json', 'utf8'));
    const relationships = spec.components.schemas.ReviewSubmissionItemCreateRequest.properties.data.properties.relationships.properties;
    expect([...REVIEW_ITEM_TYPES].sort()).toEqual(Object.keys(relationships).filter((x) => !['reviewSubmission', 'appStoreVersion'].includes(x)).sort());
  });
  it('opens, adds, and submits a new review submission', async () => {
    const { http, writes } = fake({ priorItems: [{ type: 'reviewSubmissionItems', id: 'prior-cpp', relationships: { appCustomProductPageVersion: { data: { id: 'cpp-0' } } } }] });
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
    expect(confirmation.message).toContain('appStoreVersion: app-0');
    expect(confirmation.message).toContain('inAppPurchaseVersion: iap-2');
    const result: any = await executeReleaseTool('release__submit_items', args, { http });
    expect(result.items).toEqual(preview.items);
    expect(writes.map((w) => w.method)).toEqual(['POST', 'PATCH']);
  });
  it('refuses a first product version without its app version before writing', async () => {
    const { http, writes } = fake({ versionNumber: 1 });
    await expect(executeReleaseTool('release__submit_items', { app: 'Example', platform: 'IOS', items: [{ type: 'inAppPurchaseVersion', id: 'iap-1' }] }, { http })).rejects.toThrow(/requires a new app version/);
    expect(writes).toEqual([]);
  });
  it('requires an app version for the first custom product page version too', async () => {
    const { http, writes } = fake({ versionNumber: 1 });
    await expect(executeReleaseTool('release__submit_items', { app: 'Example', platform: 'IOS', items: [{ type: 'appCustomProductPageVersion', id: 'cpp-1' }] }, { http })).rejects.toThrow(/requires a new app version/);
    expect(writes).toEqual([]);
  });
  it('checks review history before submitting an unversioned item type', async () => {
    const args = { app: 'Example', platform: 'IOS', items: [{ type: 'appEvent', id: 'event-2' }] };
    const first = fake();
    await expect(executeReleaseTool('release__submit_items', args, { http: first.http })).rejects.toThrow(/First appEvent requires a new app version/);
    expect(first.writes).toEqual([]);
    const prior = fake({ priorItems: [{ type: 'reviewSubmissionItems', id: 'old', relationships: { appEvent: { data: { id: 'event-1' } } } }] });
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
});
