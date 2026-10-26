import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as fs from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { MEDIA_TOOLS, executeMediaTool, buildMediaPreview, mediaRisk, type MediaContext } from '../src/tools/screenshots.js';
import { MEDIA_ASSETS, MEDIA_TARGETS, MEDIA_OPS, mediaOperation } from '../src/tools/media-catalog.js';
import { BODY_SCHEMAS } from '../src/generated/body-schemas.js';
import { validateBody } from '../src/core/validate.js';
import { AscApiError } from '../src/core/errors.js';

vi.mock('node:fs/promises', async (actual) => {
  const fs = await actual<typeof import('node:fs/promises')>();
  return { ...fs, open: vi.fn(fs.open), stat: vi.fn(fs.stat) };
});

const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4]);
const VIDEO = Buffer.from([0, 0, 0, 20, 0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20]);
const link = (id: string) => ({ data: { id } });
const withIncludes = (row: any, query?: any) => {
  const copy = structuredClone(row);
  if (copy.relationships) copy.relationships = Object.fromEntries(Object.entries(copy.relationships).filter(([key]) => String(query?.include ?? '').split(',').includes(key)));
  return copy;
};
const pages = { version: 'loc', cpp: 'cpp-loc', ppo: 'ppo-loc', event: 'event-loc' } as const;
type Page = keyof typeof pages;
const pageArgs = (target: 'library' | Page) => ({ app: 'Example', target, ...(target === 'version' ? { locale: 'en-US' } : target !== 'library' ? { page_id: pages[target] } : {}) });
const imageRow = { type: 'appAssetLibraryImages', id: 'img', attributes: { fileName: 'hero.png', referenceName: 'Hero image', state: 'COMPLETE', imageAsset: { width: 1200, height: 2400 } } };
const videoRow = { type: 'appAssetLibraryVideos', id: 'vid', attributes: { fileName: 'preview.mov', referenceName: 'Preview video', state: 'READY_FOR_REVIEW' } };
const placement = (target: Page, kind: 'image' | 'video', id = kind === 'image' ? 'pi' : 'pv') => ({
  type: 'appAssetLibraryPlacements', id, attributes: { placementType: kind === 'image' ? 'APP_SCREENSHOT' : 'APP_PREVIEW', placementGroup: 'phone', state: 'PARENT_APPROVED' },
  relationships: { [kind]: link(kind === 'image' ? 'img' : 'vid'), [MEDIA_TARGETS[target].relationship]: link(pages[target]) },
});

function fakeHttp(target: Page = 'version') {
  const rows = [placement(target, 'image'), placement(target, 'video')];
  const http = {
    get: vi.fn(async (path: string, query?: any): Promise<any> => {
      if (path === '/v1/apps') return { data: [{ id: 'app', attributes: { name: 'Example', bundleId: 'example.app' } }] };
      if (path === '/v1/apps/app/assetLibrary') return { data: { id: 'lib' } };
      if (path === '/v1/apps/app/appStoreVersions') return { data: [{ id: 'v1', attributes: { versionString: '3.0', platform: 'IOS', appStoreState: 'PREPARE_FOR_SUBMISSION' } }] };
      if (path === '/v1/appStoreVersions/v1/appStoreVersionLocalizations') return { data: [{ id: 'loc', attributes: { locale: 'en-US' } }] };
      if (path === '/v1/appStoreVersionLocalizations/loc') return { data: withIncludes({ id: 'loc', attributes: { locale: 'en-US' }, relationships: { appStoreVersion: link('v1') } }, query) };
      if (path === '/v1/appStoreVersions/v1') return { data: withIncludes({ id: 'v1', attributes: { versionString: '3.0', platform: 'IOS' }, relationships: { app: link('app') } }, query) };
      if (path === '/v1/appCustomProductPageLocalizations/cpp-loc') return { data: withIncludes({ id: 'cpp-loc', attributes: { locale: 'tr' }, relationships: { appCustomProductPageVersion: link('cpp-v') } }, query) };
      if (path === '/v1/appCustomProductPageVersions/cpp-v') return { data: withIncludes({ id: 'cpp-v', attributes: { version: '2', state: 'APPROVED' }, relationships: { appCustomProductPage: link('cpp') } }, query) };
      if (path === '/v1/appCustomProductPages/cpp') return { data: withIncludes({ id: 'cpp', attributes: { name: 'Summer' }, relationships: { app: link('app') } }, query) };
      if (path === '/v1/appStoreVersionExperimentTreatmentLocalizations/ppo-loc') return { data: withIncludes({ id: 'ppo-loc', attributes: { locale: 'en-US' }, relationships: { appStoreVersionExperimentTreatment: link('treatment') } }, query) };
      if (path === '/v1/appStoreVersionExperimentTreatments/treatment') return { data: withIncludes({ id: 'treatment', attributes: { name: 'Blue' }, relationships: { appStoreVersionExperimentV2: link('experiment') } }, query) };
      if (path === '/v2/appStoreVersionExperiments/experiment') return { data: withIncludes({ id: 'experiment', attributes: { name: 'Color', state: 'APPROVED' }, relationships: { app: link('app') } }, query) };
      if (path === '/v1/appEventLocalizations/event-loc') return { data: withIncludes({ id: 'event-loc', attributes: { locale: 'en-US' }, relationships: { appEvent: link('event') } }, query) };
      if (path === '/v1/apps/app/appEvents') return { data: [{ id: 'event', attributes: { referenceName: 'Launch event', eventState: 'PUBLISHED' } }] };
      if (path === '/v1/appAssetLibraries/lib/images' || path === '/v1/appAssetLibraries/lib/videos') {
        const row = path.endsWith('images') ? structuredClone(imageRow) : structuredClone(videoRow);
        const selected = !query?.['filter[id]'] || query['filter[id]'].split(',').includes(row.id);
        if (query?.include === 'placements') row.relationships = { placements: { data: selected ? [{ id: row.id === 'img' ? 'pi' : 'pv' }] : [] } };
        return { data: selected ? [row] : [], included: query?.include === 'placements' && selected ? [withIncludes(rows[row.id === 'img' ? 0 : 1], query)] : [] };
      }
      if (path === '/v1/appAssetLibraries/lib') return { data: { id: 'lib' } };
      if (path === '/v1/appAssetLibraryImages/img') return { data: structuredClone(imageRow) };
      if (path === '/v1/appAssetLibraryVideos/vid') return { data: structuredClone(videoRow) };
      if (path === '/v1/appAssetLibraryPlacements/pi' || path === '/v1/appAssetLibraryPlacements/pv') return { data: withIncludes(rows.find((p) => path.endsWith(p.id)), query) };
      if (path === '/v1/appAssetLibraryImages/img/placements') return { data: [rows[0]] };
      if (path === '/v1/appAssetLibraryVideos/vid/placements') return { data: [rows[1]] };
      if (path.endsWith('/placements')) return { data: rows.map((row) => withIncludes(row, query)), included: [structuredClone(imageRow), structuredClone(videoRow)] };
      if (path === '/v1/appAssetLibraryRefData' || path === '/v1/appAssetLibraryRefData/ref') return { data: path.endsWith('/ref') ? { id: 'ref', attributes: { features: [{ featureId: 'APP_STORE_PRODUCT_PAGE', placementPolicies: [{ placementType: 'APP_SCREENSHOT', groupLimits: [{ groupIds: ['phone'], maxCount: 10 }] }] }], imageSpecs: [{ specId: 'phone', maxFileSize: 1000000, dimensions: { minWidth: 1200 } }], videoSpecs: [{ specId: 'phone-video', maxFileSize: 500000000 }] } } : [{ id: 'ref', attributes: { features: [{ featureId: 'APP_STORE_PRODUCT_PAGE', placementPolicies: [{ placementType: 'APP_SCREENSHOT', groupLimits: [{ groupIds: ['phone'], maxCount: 10 }] }] }], imageSpecs: [{ specId: 'phone', maxFileSize: 1000000, dimensions: { minWidth: 1200 } }], videoSpecs: [{ specId: 'phone-video', maxFileSize: 500000000 }] } }] };
      throw new Error(`Unexpected GET ${path}`);
    }),
    post: vi.fn(async (path: string, body: any) => path === '/v1/appAssetLibraryPlacements' ? { data: { id: 'placed', attributes: { state: 'ASSET_PROCESSING' } } } : { data: { id: 'new', attributes: { uploadOperations: [{ method: 'PUT', url: 'https://upload.invalid/part', offset: 0, length: body.data.attributes?.fileSize ?? 12 }] } } }),
    patch: vi.fn(async () => ({ data: { id: 'new', attributes: { state: 'UPLOAD_COMPLETE' } } })),
    delete: vi.fn(async () => undefined), uploadAssetPart: vi.fn(async () => undefined),
  };
  return http;
}
const context = (http: ReturnType<typeof fakeHttp>, options = {}): MediaContext => ({ http: http as any, ...options });
let dir: string, file: string;
beforeEach(async () => { dir = await fs.mkdtemp(join(tmpdir(), 'heimdall-media-')); file = join(dir, 'hero.png'); await fs.writeFile(file, PNG); });
afterEach(async () => { vi.restoreAllMocks(); await fs.rm(dir, { recursive: true, force: true }); });

for (const target of ['library', 'version', 'cpp', 'ppo', 'event'] as const) {
  describe(`media on ${target}`, () => {
    const args = pageArgs(target);
    it('lists image and video IDs, states, placements and reference count/size limits', async () => {
      const http = fakeHttp(target === 'library' ? 'version' : target);
      const result: any = await executeMediaTool('media__list', args, context(http));
      expect(result.assets.map((a: any) => a.id)).toEqual(['img', 'vid']);
      expect(result.assets[0]).toMatchObject({ name: 'Hero image', state: 'COMPLETE', width: 1200 });
      expect(result.assets[1].placements[0]).toMatchObject({ id: 'pv', assetId: 'vid', pageId: pages[target === 'library' ? 'version' : target] });
      if (target !== 'library') expect(result.pages[0].sets.map((s: any) => s.kind)).toEqual(['image', 'video']);
      expect(result.limits[0].features[0].placementPolicies[0].groupLimits[0].maxCount).toBe(10);
      expect(result.limits[0].videoSpecs[0].maxFileSize).toBe(500000000);
      if (target === 'library') {
        expect(result.assets[0].placements[0]).toMatchObject({ pageId: 'loc', target: 'version' });
        expect(http.get.mock.calls.filter(([p]) => p.endsWith('/img/placements') || p.endsWith('/vid/placements'))).toEqual([]);
      }
      expect(http.get.mock.calls.some(([p]) => /appScreenshot|appPreview|appEventScreenshot|appEventVideo/.test(p))).toBe(false);
    });
    it.each(['image', 'video'] as const)('uploads a %s via reserve/bytes/commit and optional placement', async (kind) => {
      await fs.writeFile(file, kind === 'video' ? VIDEO : PNG);
      const http = fakeHttp(target === 'library' ? 'version' : target);
      const result: any = await executeMediaTool('media__upload', { ...args, file_path: file, category: 'APP_SCREENSHOTS_AND_PREVIEWS', ...(target === 'library' ? {} : { placement_type: kind === 'image' ? 'APP_SCREENSHOT' : 'APP_PREVIEW' }) }, context(http));
      expect(result.ok).toBe(true);
      expect(http.uploadAssetPart.mock.calls[0][1]).toEqual(kind === 'video' ? VIDEO : PNG);
      expect(http.patch.mock.calls[0][0]).toBe(kind === 'image' ? '/v1/appAssetLibraryImages/new' : '/v1/appAssetLibraryVideos/new');
      expect(http.post.mock.calls).toHaveLength(target === 'library' ? 1 : 2);
      if (target !== 'library') expect(http.post.mock.calls[1][1].data.relationships[MEDIA_TARGETS[target].relationship].data.id).toBe(pages[target]);
      // Check every sent body against the same generated catalog the raw tools use.
      for (const [path, body] of [...http.post.mock.calls, ...http.patch.mock.calls] as any[]) {
        const operation = path.endsWith('/new') ? MEDIA_ASSETS[kind].update : path.endsWith('Placements') ? MEDIA_OPS.placement : MEDIA_ASSETS[kind].create;
        expect(validateBody(BODY_SCHEMAS[mediaOperation(operation).bodyRef!], body)).toEqual([]);
      }
    });
    it('deletes only owned files/placements and names the target in the preview', async () => {
      const http = fakeHttp(target === 'library' ? 'version' : target);
      const request = { ...args, ...(target === 'library' ? { asset_ids: ['img', 'vid'] } : { placement_ids: ['pi', 'pv'] }) };
      const preview = await buildMediaPreview('media__delete', request, http as any);
      expect(preview.strong).toBe(true); expect(preview.message).toContain('Hero image'); expect(preview.message).toContain('Preview video');
      expect(preview.message).toContain(target === 'library' ? 'asset library' : pages[target]);
      if (target === 'library') expect(preview.message).toMatch(/Placed on:.*Hero image: IOS version 3.0.*Preview video: IOS version 3.0/);
      const result: any = await executeMediaTool('media__delete', request, context(http, { approvedPlanFingerprint: preview.planFingerprint }));
      expect(result.succeeded).toHaveLength(2); expect(http.delete).toHaveBeenCalledTimes(2);
      expect(http.delete.mock.calls[0][0]).toBe(target === 'library' ? '/v1/appAssetLibraryImages/img' : '/v1/appAssetLibraryPlacements/pi');
    });
    it('rejects one foreign ID before deleting anything', async () => {
      const http = fakeHttp(target === 'library' ? 'version' : target);
      await expect(executeMediaTool('media__delete', { ...args, ...(target === 'library' ? { asset_ids: ['img', 'foreign'] } : { placement_ids: ['pi', 'foreign'] }) }, context(http))).rejects.toThrow(/Nothing was changed/);
      expect(http.delete).not.toHaveBeenCalled();
    });
    it('reports partial deletion without discarding successful IDs', async () => {
      const http = fakeHttp(target === 'library' ? 'version' : target);
      http.delete.mockRejectedValueOnce(new AscApiError('In use', 409));
      const result: any = await executeMediaTool('media__delete', { ...args, ...(target === 'library' ? { asset_ids: ['img', 'vid'] } : { placement_ids: ['pi', 'pv'] }) }, context(http));
      expect(result.ok).toBe(false); expect(result.succeeded).toHaveLength(1); expect(result.failed[0]).toMatchObject({ name: 'Hero image', error: 'In use' });
    });
    it.each(['rename', 'poster', 'archive'] as const)('supports %s with checked library ownership', async (action) => {
      const http = fakeHttp(target === 'library' ? 'version' : target);
      const result: any = await executeMediaTool('media__arrange', { ...args, action, asset_ids: [action === 'poster' ? 'vid' : 'img'], reference_name: 'New name', preview_frame_time_code: '00:00:05:00' }, context(http));
      expect(result.ok).toBe(true); expect(http.patch).toHaveBeenCalledOnce();
    });
    it('reorders only a complete group where Apple supports order', async () => {
      const http = fakeHttp(target === 'library' ? 'version' : target);
      const request = executeMediaTool('media__arrange', { ...args, action: 'reorder', placement_ids: ['pv', 'pi'], placement_group: 'phone' }, context(http));
      if (target === 'event') { await expect(request).rejects.toThrow(/no order/); expect(http.post).not.toHaveBeenCalled(); }
      else {
        expect((await request as any).ok).toBe(true);
        expect(http.post.mock.calls[0][1].data.relationships.orderedPlacements.data.map((r: any) => r.id)).toEqual(['pv', 'pi']);
      }
    });
    if (target !== 'library') it('places an existing file without uploading another copy', async () => {
      const http = fakeHttp(target);
      await executeMediaTool('media__arrange', { ...args, action: 'place', asset_ids: ['img'], placement_type: 'APP_SCREENSHOT' }, context(http));
      expect(http.post.mock.calls[0][0]).toBe('/v1/appAssetLibraryPlacements'); expect(http.uploadAssetPart).not.toHaveBeenCalled();
    });
    if (target !== 'library') it('removes a placement only from the named page after showing its file', async () => {
      const http = fakeHttp(target);
      const request = { ...args, action: 'remove', placement_ids: ['pi'] };
      const preview = await buildMediaPreview('media__arrange', request, http as any);
      expect(preview.strong).toBe(true);
      expect(preview.message).toContain('Hero image');
      expect(preview.message).toContain(pages[target]);
      await executeMediaTool('media__arrange', request, context(http, { approvedPlanFingerprint: preview.planFingerprint }));
      expect(http.delete).toHaveBeenCalledWith('/v1/appAssetLibraryPlacements/pi');
    });
  });
}

describe('media resolution, confirmation and file safety', () => {
  const uploadArgs = () => ({ ...pageArgs('version'), file_path: file, category: 'APP_SCREENSHOTS_AND_PREVIEWS', placement_type: 'APP_SCREENSHOT' });
  it.each(['platform', 'version'])('refuses ambiguous %s for both preview and apply', async (ambiguous) => {
    const http = fakeHttp(); const original = http.get.getMockImplementation()!;
    http.get.mockImplementation(async (path, query) => path.endsWith('/appStoreVersions') ? { data: ['v1', 'v2'].map((id, i) => ({ id, attributes: { platform: ambiguous === 'platform' && i ? 'MAC_OS' : 'IOS', versionString: ambiguous === 'version' && i ? '4.0' : '3.0', appStoreState: 'PREPARE_FOR_SUBMISSION' } })) } : original(path, query));
    await expect(buildMediaPreview('media__upload', uploadArgs(), http as any)).rejects.toThrow(/platform|Ambiguous/);
    await expect(executeMediaTool('media__upload', uploadArgs(), context(http))).rejects.toThrow(/platform|Ambiguous/);
    expect(http.post).not.toHaveBeenCalled();
  });
  it.each(['cpp', 'ppo', 'event'] as const)('refuses a %s localization owned by another app', async (target) => {
    const http = fakeHttp(target); const original = http.get.getMockImplementation()!;
    http.get.mockImplementation(async (path, query) => {
      const result = await original(path, query);
      if (path === '/v1/apps/app/appEvents') return { data: [] };
      if (result.data?.relationships?.app) result.data.relationships.app = link('foreign-app');
      return result;
    });
    await expect(executeMediaTool('media__upload', { ...uploadArgs(), ...pageArgs(target), locale: undefined }, context(http))).rejects.toThrow(/does not belong/);
    expect(http.post).not.toHaveBeenCalled();
  });
  it('rejects truncated ownership lists', async () => {
    const http = fakeHttp(); const original = http.get.getMockImplementation()!;
    http.get.mockImplementation(async (path, query) => { const res = await original(path, query); return path.endsWith('/images') ? { ...res, meta: { paging: { total: 2 } } } : res; });
    await expect(executeMediaTool('media__delete', { ...pageArgs('library'), asset_ids: ['img'] }, context(http))).rejects.toThrow(/Truncated/);
    expect(http.delete).not.toHaveBeenCalled();
  });
  it('follows list pagination rather than silently missing a later file', async () => {
    const http = fakeHttp(); const original = http.get.getMockImplementation()!;
    http.get.mockImplementation(async (path, query) => path.endsWith('/images') ? { data: [], links: { next: '/next-image' } } : path === '/next-image' ? { data: [{ ...structuredClone(imageRow), relationships: { placements: { data: [{ id: 'pi' }] } } }], included: [withIncludes(placement('version', 'image'), { include: 'placements' })] } : original(path, query));
    const res: any = await executeMediaTool('media__delete', { ...pageArgs('library'), asset_ids: ['img'] }, context(http, { dryRun: true }));
    expect(res.wouldSend[0].name).toBe('Hero image'); expect(http.delete).not.toHaveBeenCalled();
  });
  it('detects a changed target after approval', async () => {
    const http = fakeHttp(); const args = { ...pageArgs('library'), asset_ids: ['img'] };
    const preview = await buildMediaPreview('media__delete', args, http as any);
    const original = http.get.getMockImplementation()!;
    http.get.mockImplementation(async (path, query) => { const result = await original(path, query); if (path.endsWith('/images')) result.data[0].attributes.referenceName = 'Changed file'; return result; });
    await expect(executeMediaTool('media__delete', args, context(http, { approvedPlanFingerprint: preview.planFingerprint }))).rejects.toThrow(/changed since confirmation/);
    expect(http.delete).not.toHaveBeenCalled();
  });
  it.each(['directory', 'empty', 'secret', 'large-image', 'large-video'] as const)('refuses %s before network access', async (bad) => {
    if (bad === 'empty') await fs.writeFile(file, '');
    if (bad === 'secret') await fs.writeFile(file, 'not media, not a real credential');
    if (bad.startsWith('large')) { const fd = await fs.open(file, 'r+'); await fd.truncate((bad === 'large-image' ? 51 : 501) * 1024 * 1024); await fd.close(); }
    const http = fakeHttp();
    await expect(executeMediaTool('media__upload', { ...uploadArgs(), file_path: bad === 'directory' ? dir : file }, context(http))).rejects.toThrow();
    expect(http.get).not.toHaveBeenCalled(); expect(http.post).not.toHaveBeenCalled();
  });
  it('reads only from the opened descriptor when the path is replaced', async () => {
    const originalOpen = vi.mocked(fs.open).getMockImplementation()!;
    const readSizes: number[] = [];
    vi.mocked(fs.open).mockImplementationOnce(async (...args: Parameters<typeof fs.open>) => {
      const fd = await originalOpen(...args);
      const read = fd.read.bind(fd);
      let first = true;
      fd.read = (async (buffer: Buffer, offset: number, length: number, position: number) => {
        readSizes.push(length);
        const result = await read(buffer, offset, length, position);
        if (first) { first = false; await fs.rename(file, join(dir, 'original.png')); await fs.writeFile(file, 'different path content'); }
        return result;
      }) as any;
      return fd;
    });
    const http = fakeHttp();
    // Rename changes ctime on some filesystems; either safe refusal or the
    // original descriptor's bytes is acceptable, never replacement content.
    let refused = false;
    try { await executeMediaTool('media__upload', uploadArgs(), context(http)); } catch (err) { expect(String(err)).toMatch(/File changed/); refused = true; }
    if (refused) expect(http.uploadAssetPart).not.toHaveBeenCalled();
    else { expect(http.uploadAssetPart).toHaveBeenCalledOnce(); expect(http.uploadAssetPart.mock.calls[0][1]).toEqual(PNG); }
    expect(readSizes[0]).toBe(12); expect(Math.max(...readSizes)).toBeLessThanOrEqual(1024 * 1024);
  });
  it('checks fstat before reading a file that grew after the initial stat', async () => {
    const originalOpen = vi.mocked(fs.open).getMockImplementation()!;
    vi.mocked(fs.open).mockImplementationOnce(async (...args: Parameters<typeof fs.open>) => {
      const fd = await originalOpen(...args); const info = await fd.stat();
      vi.spyOn(fd, 'stat').mockResolvedValue({ ...info, size: 501 * 1024 * 1024, isFile: () => true } as any);
      vi.spyOn(fd, 'read').mockImplementation(() => { throw new Error('must not read'); });
      return fd;
    });
    await expect(executeMediaTool('media__upload', uploadArgs(), context(fakeHttp()))).rejects.toThrow(/File size/);
  });
  it('keeps dry-run free of reserve, byte transfer, commit and placement', async () => {
    const http = fakeHttp(); const res: any = await executeMediaTool('media__upload', uploadArgs(), context(http, { dryRun: true }));
    expect(res.wouldSend).toHaveLength(2); expect(res.risk).toBe('public');
    expect(http.post).not.toHaveBeenCalled(); expect(http.patch).not.toHaveBeenCalled(); expect(http.uploadAssetPart).not.toHaveBeenCalled();
  });
  it('reports upload success and placement failure separately', async () => {
    const http = fakeHttp(); const original = http.post.getMockImplementation()!;
    http.post.mockImplementation(async (path, body) => { if (path.endsWith('Placements')) throw new Error('Wrong size'); return original(path, body); });
    const result: any = await executeMediaTool('media__upload', uploadArgs(), context(http));
    expect(result).toMatchObject({ ok: false, placed: false, assetId: 'new', placementError: 'Wrong size', retryWith: 'media__arrange' });
    expect(http.patch).toHaveBeenCalledOnce();
  });
  it.each(['UPLOAD_COMPLETE', 'READY_FOR_REVIEW', 'PREPARE_FOR_SUBMISSION', 'APPROVED', 'FAILED'])('reports review submission only when Apple says %s', async (state) => {
    const http = fakeHttp(); http.patch.mockResolvedValue({ data: { id: 'new', attributes: { state } } });
    const result: any = await executeMediaTool('media__upload', uploadArgs(), context(http));
    if (['READY_FOR_REVIEW', 'PREPARE_FOR_SUBMISSION'].includes(state)) expect(result.review).toMatchObject({ required: true, submitWith: 'release__submit_items', item: { type: 'appAssetLibraryImage', id: 'new' } });
    else expect(result.review).toBeUndefined();
    if (state === 'FAILED') { expect(result.placed).toBe(false); expect(http.post).toHaveBeenCalledOnce(); }
  });
  it('does not claim a review submission for an unplaced or failed placement', async () => {
    const library = fakeHttp(); library.patch.mockResolvedValue({ data: { id: 'new', attributes: { state: 'READY_FOR_REVIEW' } } });
    const stored: any = await executeMediaTool('media__upload', { ...uploadArgs(), target: 'library', locale: undefined, placement_type: undefined }, context(library));
    expect(stored.review).toBeUndefined();

    const failed = fakeHttp(); failed.patch.mockResolvedValue({ data: { id: 'new', attributes: { state: 'READY_FOR_REVIEW' } } });
    failed.post.mockImplementation(async (path: string) => path.endsWith('/appAssetLibraryPlacements')
      ? { data: { id: 'placement-1', attributes: { state: 'FAILED' } } }
      : { data: { id: 'new', attributes: { uploadOperations: [{ method: 'PUT', url: 'https://upload.invalid/part', offset: 0, length: PNG.length }] } } });
    const placed: any = await executeMediaTool('media__upload', uploadArgs(), context(failed));
    expect(placed).toMatchObject({ ok: false, placed: false, placementState: 'FAILED' });
    expect(placed.review).toBeUndefined();
  });
  it('reports a reserved ID when byte transfer fails', async () => {
    const http = fakeHttp(); http.uploadAssetPart.mockRejectedValue(new Error('Upload failed'));
    const result: any = await executeMediaTool('media__upload', uploadArgs(), context(http));
    expect(result).toMatchObject({ ok: false, assetId: 'new', failedPhase: 'upload' }); expect(http.patch).not.toHaveBeenCalled();
  });
  it('rejects incomplete byte ranges before upload or commit', async () => {
    const http = fakeHttp(); http.post.mockResolvedValue({ data: { id: 'new', attributes: { uploadOperations: [{ method: 'PUT', url: 'https://upload.invalid/part', offset: 0, length: 3 }] } } });
    const result: any = await executeMediaTool('media__upload', uploadArgs(), context(http));
    expect(result.error).toMatch(/complete file/); expect(http.uploadAssetPart).not.toHaveBeenCalled(); expect(http.patch).not.toHaveBeenCalled();
  });
  it.each([[], Array.from({ length: 51 }, (_, i) => String(i)), ['img', 'img'], [123]])('rejects invalid deletion IDs %#', async (ids) => {
    const http = fakeHttp();
    await expect(executeMediaTool('media__delete', { ...pageArgs('library'), asset_ids: ids }, context(http))).rejects.toThrow();
    expect(http.delete).not.toHaveBeenCalled();
  });
  it('refuses a partial reorder and mixed image/video poster changes before any write', async () => {
    const http = fakeHttp();
    await expect(executeMediaTool('media__arrange', { ...pageArgs('version'), action: 'reorder', placement_ids: ['pi'], placement_group: 'phone' }, context(http))).rejects.toThrow(/every placement/);
    await expect(executeMediaTool('media__arrange', { ...pageArgs('library'), action: 'poster', asset_ids: ['vid', 'img'], preview_frame_time_code: '00:00:01:00' }, context(http))).rejects.toThrow(/require videos/);
    expect(http.post).not.toHaveBeenCalled(); expect(http.patch).not.toHaveBeenCalled();
  });
  it('uses action/target risk and exposes exactly four tools without legacy aliases', async () => {
    expect(MEDIA_TOOLS.map((t) => t.name)).toEqual(['media__list', 'media__upload', 'media__arrange', 'media__delete']);
    expect(mediaRisk('media__upload', { target: 'library' })).toBe('low');
    expect(mediaRisk('media__upload', { target: 'version' })).toBe('public');
    for (const action of ['remove', 'archive', 'remove ', 'archive\n']) expect(mediaRisk('media__arrange', { target: 'version', action })).toBe('destructive');
    await expect(executeMediaTool('listing__get_screenshots', pageArgs('version'), context(fakeHttp()))).rejects.toThrow(/Unknown media tool/);
  });
  it('rejects undeclared arrange actions before resolution or any write', async () => {
    const http = fakeHttp();
    for (const action of ['delete', 'DELETE', 'archive-now']) {
      const request = { ...pageArgs('library'), action, asset_ids: action === 'delete' ? Array.from({ length: 50 }, (_, i) => `asset-${i}`) : ['img'] };
      await expect(buildMediaPreview('media__arrange', request, http as any)).rejects.toThrow(/Unknown media action/);
      await expect(executeMediaTool('media__arrange', request, context(http))).rejects.toThrow(/Unknown media action/);
    }
    expect(http.get).not.toHaveBeenCalled(); expect(http.delete).not.toHaveBeenCalled();
  });
  it.each(['remove ', 'archive\n'])('normalizes %j before risk and uses one destructive preview/apply plan', async (action) => {
    const http = fakeHttp();
    const request = action.startsWith('remove') ? { ...pageArgs('version'), action, placement_ids: ['pi'] } : { ...pageArgs('library'), action, asset_ids: ['img'] };
    const preview = await buildMediaPreview('media__arrange', request, http as any);
    expect(preview.strong).toBe(true); expect(preview.message).toContain('DESTRUCTIVE');
    const result: any = await executeMediaTool('media__arrange', request, context(http, { approvedPlanFingerprint: preview.planFingerprint }));
    expect(result.risk).toBe('destructive');
    if (action.startsWith('remove')) expect(http.delete).toHaveBeenCalledOnce(); else expect(http.patch).toHaveBeenCalledOnce();
  });
  it('refuses a library-target remove before reading a live placement', async () => {
    const http = fakeHttp();
    const request = { ...pageArgs('library'), action: 'remove', placement_ids: ['pi'] };
    await expect(buildMediaPreview('media__arrange', request, http as any)).rejects.toThrow(/named page/);
    await expect(executeMediaTool('media__arrange', request, context(http))).rejects.toThrow(/named page/);
    expect(http.get).not.toHaveBeenCalled(); expect(http.delete).not.toHaveBeenCalled();
  });
  it('exposes library and reference IDs through media__list and verifies ownership', async () => {
    const http = fakeHttp();
    const result: any = await executeMediaTool('media__list', { ...pageArgs('library'), library_id: 'lib', ref_data_id: 'ref' }, context(http));
    expect(result.libraryId).toBe('lib'); expect(result.limits.map((r: any) => r.id)).toEqual(['ref']);
    expect(http.get).toHaveBeenCalledWith('/v1/appAssetLibraries/lib', undefined);
    expect(http.get).toHaveBeenCalledWith('/v1/appAssetLibraryRefData/ref', undefined);
    await expect(executeMediaTool('media__list', { ...pageArgs('library'), library_id: 'foreign' }, context(http))).rejects.toThrow(/does not belong/);
  });
  it('bounds library placement expansion and refuses incomplete page visibility', async () => {
    const http = fakeHttp(); const original = http.get.getMockImplementation()!;
    http.get.mockImplementation(async (path, query) => {
      const result = await original(path, query);
      if (path.endsWith('/images') && query?.include === 'placements') result.data[0].relationships.placements.data = Array.from({ length: 201 }, (_, i) => ({ id: `p${i}` }));
      return result;
    });
    await expect(executeMediaTool('media__list', pageArgs('library'), context(http))).rejects.toThrow(/Too many placements/);
    expect(http.get.mock.calls.some(([path]) => path.endsWith('/img/placements'))).toBe(false);
  });
  it('refuses library deletion when a placement belongs to a foreign app page', async () => {
    const http = fakeHttp(); const original = http.get.getMockImplementation()!;
    http.get.mockImplementation(async (path, query) => {
      const result = await original(path, query);
      if (path === '/v1/appStoreVersions/v1') result.data.relationships.app = link('foreign');
      return result;
    });
    await expect(buildMediaPreview('media__delete', { ...pageArgs('library'), asset_ids: ['img'] }, http as any)).rejects.toThrow(/does not belong/);
    expect(http.delete).not.toHaveBeenCalled();
  });
  it.each([Buffer.from([0xff, 0xd8, 0xff]), Buffer.from([0,0,0,20,0x66,0x74,0x79,0x70,0x68,0x65,0x69,0x63]), Buffer.from([0,0,0,20,0x66,0x74,0x79,0x70,0x61,0x76,0x69,0x66]), Buffer.from([0,0,0,20,0x66,0x74,0x79,0x70,0x4d,0x34,0x41,0x20])])('rejects a short or non-video brand before network', async (bytes) => {
    await fs.writeFile(file, bytes);
    const http = fakeHttp();
    await expect(executeMediaTool('media__upload', uploadArgs(), context(http))).rejects.toThrow(/not a PNG, JPEG, MP4 or MOV/);
    expect(http.get).not.toHaveBeenCalled(); expect(http.post).not.toHaveBeenCalled();
  });
  it('rejects a video in a screenshot placement before reserve or placement', async () => {
    await fs.writeFile(file, VIDEO);
    const http = fakeHttp();
    await expect(executeMediaTool('media__upload', uploadArgs(), context(http))).rejects.toThrow(/requires a image/);
    expect(http.post).not.toHaveBeenCalled();
    await expect(executeMediaTool('media__arrange', { ...pageArgs('version'), action: 'place', asset_ids: ['vid'], placement_type: 'APP_SCREENSHOT' }, context(http))).rejects.toThrow(/requires a image/);
  });
});
