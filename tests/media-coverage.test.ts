import { describe, expect, it, vi } from 'vitest';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { MACRO_COVERED, PROFILES } from '../src/profiles.js';
import { MEDIA_TARGETS, mediaOperation } from '../src/tools/media-catalog.js';
import { executeMediaTool } from '../src/tools/screenshots.js';

type Coverage = { target: string; action: string; macro: string; operations: string[] };
const libraryUpdates = ['app_asset_library_images.update', 'app_asset_library_videos.update'];
const assetCreates = ['app_asset_library_images.create', 'app_asset_library_videos.create'];
const placementCreate = 'app_asset_library_placements.create';
const placementDelete = 'app_asset_library_placements.delete';
const placementGet = 'app_asset_library_placements.get';
const reorder = 'app_asset_library_placement_ordering_requests.create';

// Target × action is explicit: a page has placements, a library has files,
// and events lack ordering. Shared operations appear in several rows because
// one raw endpoint can be part of more than one macro's workflow.
const COVERAGE: Coverage[] = [
  { target: 'library', action: 'list', macro: 'media__list', operations: [
    'apps.asset_library.get', 'app_asset_libraries.get', 'app_asset_libraries.images.list',
    'app_asset_libraries.videos.list',
    'app_asset_library_images.placements.list', 'app_asset_library_videos.placements.list',
    'app_asset_library_ref_data.list', 'app_asset_library_ref_data.get',
  ] },
  { target: 'library', action: 'upload', macro: 'media__upload', operations: assetCreates },
  { target: 'library', action: 'reorder', macro: 'media__arrange', operations: [placementGet, reorder] },
  { target: 'library', action: 'poster', macro: 'media__arrange', operations: ['app_asset_library_videos.update'] },
  { target: 'library', action: 'archive', macro: 'media__arrange', operations: libraryUpdates },
  { target: 'library', action: 'rename', macro: 'media__arrange', operations: libraryUpdates },
  { target: 'library', action: 'delete', macro: 'media__delete', operations: [
    'app_asset_library_images.delete', 'app_asset_library_videos.delete',
  ] },
  ...Object.entries({
    version: 'app_store_version_localizations.placements.list',
    cpp: 'app_custom_product_page_localizations.placements.list',
    ppo: 'app_store_version_experiment_treatment_localizations.placements.list',
    event: 'app_event_localizations.placements.list',
  }).flatMap(([target, listOp]): Coverage[] => [
    { target, action: 'list', macro: 'media__list', operations: [listOp, 'app_asset_library_images.get', 'app_asset_library_videos.get'] },
    { target, action: 'upload', macro: 'media__upload', operations: [...assetCreates, placementCreate] },
    { target, action: 'place', macro: 'media__arrange', operations: [placementCreate] },
    { target, action: 'remove', macro: 'media__arrange', operations: [placementDelete] },
    { target, action: 'delete', macro: 'media__delete', operations: [placementDelete] },
    { target, action: 'poster', macro: 'media__arrange', operations: ['app_asset_library_videos.update'] },
    { target, action: 'archive', macro: 'media__arrange', operations: libraryUpdates },
    { target, action: 'rename', macro: 'media__arrange', operations: libraryUpdates },
    ...(target === 'event' ? [] : [{ target, action: 'reorder', macro: 'media__arrange', operations: [reorder] }]),
  ]),
];

describe('media target × action coverage', () => {
  it('matches macro-covered operations and retains the later-PR image families', () => {
    const actionsFor = (target: string) => COVERAGE.filter((row) => row.target === target).map((row) => row.action).sort();
    const pageActions = ['list', 'upload', 'place', 'remove', 'delete', 'poster', 'archive', 'rename', 'reorder'].sort();
    expect(actionsFor('library')).toEqual(['list', 'upload', 'reorder', 'poster', 'archive', 'rename', 'delete'].sort());
    for (const target of ['version', 'cpp', 'ppo']) expect(actionsFor(target)).toEqual(pageActions);
    expect(actionsFor('event')).toEqual(pageActions.filter((action) => action !== 'reorder'));
    for (const [target, adapter] of Object.entries(MEDIA_TARGETS)) {
      expect(COVERAGE.find((row) => row.target === target && row.action === 'list')?.operations).toContain(adapter.placements);
      expect(adapter.ordered).toBe(target !== 'event');
    }
    const shared = new Set([`${placementGet}|media__arrange`, `${placementCreate}|media__upload`, `${placementDelete}|media__arrange`]);
    for (const row of COVERAGE) for (const operation of row.operations) {
      expect(MACRO_COVERED[operation], `${row.target}/${row.action}: ${operation}`).toBeTruthy();
      if (MACRO_COVERED[operation] !== row.macro) expect(shared).toContain(`${operation}|${row.macro}`);
    }
    expect(new Set(COVERAGE.flatMap((row) => row.operations))).toEqual(new Set(Object.keys(MACRO_COVERED)));

    const retained = PROFILES.flatMap((p) => p.subProfiles.flatMap((s) => s.operations));
    for (const outOfScope of [
      'app_clip_header_images.create', 'game_center_achievement_images_v2.create',
      'in_app_purchase_app_store_review_screenshots.create',
      'subscription_app_store_review_screenshots.create', 'app_encryption_declaration_documents.create',
    ]) {
      expect(retained, `${outOfScope} must remain in its profile`).toContain(outOfScope);
      expect(MACRO_COVERED).not.toHaveProperty(outOfScope);
    }
  });
  it.each(COVERAGE)('executes $target/$action through $macro against include-aware responses', async (cell) => {
    const page = cell.target === 'library' ? 'version' : cell.target;
    const pageId = { version: 'loc', cpp: 'cpp-loc', ppo: 'ppo-loc', event: 'event-loc' }[page]!;
    const relationship = MEDIA_TARGETS[page as keyof typeof MEDIA_TARGETS].relationship;
    const link = (id: string) => ({ data: { id } });
    const select = (row: any, query?: any) => {
      const copy = structuredClone(row);
      if (copy.relationships) copy.relationships = Object.fromEntries(Object.entries(copy.relationships).filter(([key]) => String(query?.include ?? '').split(',').includes(key)));
      return copy;
    };
    const image = { id: 'img', type: 'appAssetLibraryImages', attributes: { referenceName: 'Hero', state: 'COMPLETE' } };
    const video = { id: 'vid', type: 'appAssetLibraryVideos', attributes: { referenceName: 'Preview', state: 'COMPLETE' } };
    const rows = [
      { id: 'pi', type: 'appAssetLibraryPlacements', attributes: { placementGroup: 'phone', placementType: 'APP_SCREENSHOT' }, relationships: { image: link('img'), [relationship]: link(pageId) } },
      { id: 'pv', type: 'appAssetLibraryPlacements', attributes: { placementGroup: 'phone', placementType: 'APP_PREVIEW' }, relationships: { video: link('vid'), [relationship]: link(pageId) } },
    ];
    const single = (id: string, attrs: any, rels: any, query?: any) => ({ data: select({ id, attributes: attrs, relationships: rels }, query) });
    const http = {
      get: vi.fn(async (path: string, query?: any): Promise<any> => {
        if (path === '/v1/apps') return { data: [{ id: 'app', attributes: { name: 'Example', bundleId: 'example.app' } }] };
        if (path === '/v1/apps/app/assetLibrary' || path === '/v1/appAssetLibraries/lib') return { data: { id: 'lib' } };
        if (path === '/v1/apps/app/appStoreVersions') return { data: [{ id: 'v1', attributes: { versionString: '3.0', platform: 'IOS', appStoreState: 'PREPARE_FOR_SUBMISSION' } }] };
        if (path === '/v1/appStoreVersions/v1/appStoreVersionLocalizations') return { data: [{ id: 'loc', attributes: { locale: 'en-US' } }] };
        if (path === '/v1/appStoreVersionLocalizations/loc') return single('loc', { locale: 'en-US' }, { appStoreVersion: link('v1') }, query);
        if (path === '/v1/appStoreVersions/v1') return single('v1', { versionString: '3.0', platform: 'IOS' }, { app: link('app') }, query);
        if (path === '/v1/appCustomProductPageLocalizations/cpp-loc') return single('cpp-loc', { locale: 'en-US' }, { appCustomProductPageVersion: link('cpp-v') }, query);
        if (path === '/v1/appCustomProductPageVersions/cpp-v') return single('cpp-v', { version: '1' }, { appCustomProductPage: link('cpp') }, query);
        if (path === '/v1/appCustomProductPages/cpp') return single('cpp', { name: 'Summer' }, { app: link('app') }, query);
        if (path === '/v1/appStoreVersionExperimentTreatmentLocalizations/ppo-loc') return single('ppo-loc', { locale: 'en-US' }, { appStoreVersionExperimentTreatment: link('treat') }, query);
        if (path === '/v1/appStoreVersionExperimentTreatments/treat') return single('treat', { name: 'Blue' }, { appStoreVersionExperimentV2: link('exp') }, query);
        if (path === '/v2/appStoreVersionExperiments/exp') return single('exp', { name: 'Color' }, { app: link('app') }, query);
        if (path === '/v1/appEventLocalizations/event-loc') return single('event-loc', { locale: 'en-US' }, { appEvent: link('event') }, query);
        if (path === '/v1/apps/app/appEvents') return { data: [{ id: 'event', attributes: { referenceName: 'Launch' } }] };
        if (path === '/v1/appAssetLibraries/lib/images' || path === '/v1/appAssetLibraries/lib/videos') {
          const row: any = structuredClone(path.endsWith('/images') ? image : video);
          const selected = !query?.['filter[id]'] || query['filter[id]'].split(',').includes(row.id);
          return { data: selected ? [row] : [] };
        }
        if (path === '/v1/appAssetLibraryImages/img') return { data: image };
        if (path === '/v1/appAssetLibraryVideos/vid') return { data: video };
        if (path === '/v1/appAssetLibraryRefData/ref') return { data: { id: 'ref', attributes: {} } };
        if (path === '/v1/appAssetLibraryPlacements/pi' || path === '/v1/appAssetLibraryPlacements/pv') return { data: select(rows[path.endsWith('/pi') ? 0 : 1], query) };
        if (path === '/v1/appAssetLibraryImages/img/placements') return { data: [select(rows[0], query)] };
        if (path === '/v1/appAssetLibraryVideos/vid/placements') return { data: [select(rows[1], query)] };
        if (path.endsWith('/placements')) return { data: rows.map((row) => select(row, query)), included: cell.action === 'list' ? [] : [image, video] };
        if (path === '/v1/appAssetLibraryRefData') return { data: [{ id: 'ref', attributes: {} }] };
        throw new Error(`Unexpected GET ${path}`);
      }),
      post: vi.fn(async (path: string, body: any) => path.endsWith('Placements') ? { data: { id: 'new-placement', attributes: { state: 'COMPLETE' } } } : { data: { id: 'new', attributes: { uploadOperations: [{ method: 'PUT', url: 'https://upload.invalid/part', offset: 0, length: body?.data?.attributes?.fileSize ?? 12 }] } } }),
      patch: vi.fn(async () => ({ data: { id: 'new', attributes: { state: 'COMPLETE' } } })),
      delete: vi.fn(async () => undefined), uploadAssetPart: vi.fn(async () => undefined),
    };
    const args: Record<string, unknown> = { app: 'Example', target: cell.target, ...(cell.target === 'version' ? { locale: 'en-US' } : cell.target === 'library' ? {} : { page_id: pageId }) };
    let directory: string | undefined;
    try {
      if (cell.action === 'upload') {
        directory = await mkdtemp(join(tmpdir(), 'heimdall-coverage-'));
        const path = join(directory, 'hero.png');
        await writeFile(path, Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a,1,2,3,4]));
        Object.assign(args, { file_path: path, category: 'APP_SCREENSHOTS_AND_PREVIEWS', ...(cell.target === 'library' ? {} : { placement_type: 'APP_SCREENSHOT' }) });
      } else if (cell.action === 'remove' || cell.action === 'reorder' || (cell.action === 'delete' && cell.target !== 'library')) Object.assign(args, { placement_ids: cell.action === 'reorder' ? ['pv', 'pi'] : ['pi'], ...(cell.action === 'reorder' ? { placement_group: 'phone' } : {}), ...(cell.macro === 'media__arrange' ? { action: cell.action } : {}) });
      else if (cell.action === 'delete') Object.assign(args, { asset_ids: ['img', 'vid'] });
      else if (cell.action !== 'list') Object.assign(args, { action: cell.action, asset_ids: cell.action === 'archive' ? ['img', 'vid'] : [cell.action === 'poster' ? 'vid' : 'img'], ...(cell.action === 'place' ? { placement_type: 'APP_SCREENSHOT' } : {}), ...(cell.action === 'poster' ? { preview_frame_time_code: '00:00:05:00' } : {}), ...(cell.action === 'rename' ? { reference_name: 'New hero' } : {}) });
      const result: any = await executeMediaTool(cell.macro, args, { http: http as any });
      if (cell.action === 'list') expect(result.assets.length).toBeGreaterThan(0);
      else expect(result.ok, `${cell.target}/${cell.action}`).toBe(true);
      if (cell.action === 'list' && cell.target === 'library') {
        const byIds: any = await executeMediaTool(cell.macro, { ...args, library_id: 'lib', ref_data_id: 'ref' }, { http: http as any });
        expect(byIds.libraryId).toBe('lib'); expect(byIds.limits[0].id).toBe('ref');
      }
      if (cell.action === 'upload') {
        const path = join(directory!, 'preview.mov');
        await writeFile(path, Buffer.from([0,0,0,20,0x66,0x74,0x79,0x70,0x71,0x74,0x20,0x20]));
        const uploaded: any = await executeMediaTool(cell.macro, { ...args, file_path: path, ...(cell.target === 'library' ? {} : { placement_type: 'APP_PREVIEW' }) }, { http: http as any });
        expect(uploaded.ok).toBe(true); expect(http.uploadAssetPart).toHaveBeenCalledTimes(2);
      }
      if (cell.action === 'rename') {
        const renamed: any = await executeMediaTool(cell.macro, { ...args, asset_ids: ['vid'] }, { http: http as any });
        expect(renamed.ok).toBe(true);
      }
      const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      for (const operation of cell.operations) {
        const catalog = mediaOperation(operation);
        const pattern = new RegExp(`^${catalog.path.split('{id}').map(escape).join('[^/]+')}$`);
        const method = catalog.method.toLowerCase() as 'get' | 'post' | 'patch' | 'delete';
        expect(http[method].mock.calls.some(([path]) => pattern.test(path)), `${cell.target}/${cell.action} never called ${catalog.method} ${catalog.path}`).toBe(true);
      }
    } finally { if (directory) await rm(directory, { recursive: true, force: true }); }
  });
});
