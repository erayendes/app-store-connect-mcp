import { describe, expect, it, vi } from 'vitest';
import { mkdtemp, open, rm, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { MACRO_COVERED, PROFILES } from '../src/profiles.js';
import { PAGE_TARGETS, FILE_TARGETS, mediaOperation, mediaDataSchema, type FileAdapter, type FileTarget } from '../src/tools/media-catalog.js';
import { buildMediaPreview, executeMediaTool, mediaRisk } from '../src/tools/screenshots.js';
import { AscApiError } from '../src/core/errors.js';

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
  it('matches macro-covered operations and retains uncovered file updates', () => {
    const actionsFor = (target: string) => COVERAGE.filter((row) => row.target === target).map((row) => row.action).sort();
    const pageActions = ['list', 'upload', 'place', 'remove', 'delete', 'poster', 'archive', 'rename', 'reorder'].sort();
    expect(actionsFor('library')).toEqual(['list', 'upload', 'reorder', 'poster', 'archive', 'rename', 'delete'].sort());
    for (const target of ['version', 'cpp', 'ppo']) expect(actionsFor(target)).toEqual(pageActions);
    expect(actionsFor('event')).toEqual(pageActions.filter((action) => action !== 'reorder'));
    for (const [target, adapter] of Object.entries(PAGE_TARGETS)) {
      expect(COVERAGE.find((row) => row.target === target && row.action === 'list')?.operations).toContain(adapter.placements);
      expect(adapter.ordered).toBe(target !== 'event');
    }
    const shared = new Set([`${placementGet}|media__arrange`, `${placementCreate}|media__upload`, `${placementDelete}|media__arrange`]);
    for (const row of COVERAGE) for (const operation of row.operations) {
      expect(MACRO_COVERED[operation], `${row.target}/${row.action}: ${operation}`).toBeTruthy();
      if (MACRO_COVERED[operation] !== row.macro) expect(shared).toContain(`${operation}|${row.macro}`);
    }
    // Updates the commit step sends as-is: uploaded-only families, the two
    // customer-facing App Clip images (their update is `uploaded` plus an MD5
    // checksum, exactly the commit), and routing coverage, whose sub-profile
    // the owner removed in favour of the macro.
    const coveredUpdates = new Set([
      'game_center_achievement_images_v2', 'game_center_leaderboard_images_v2',
      'game_center_leaderboard_set_images_v2', 'game_center_activity_images',
      'game_center_challenge_images', 'in_app_purchase_images_v2', 'subscription_images_v2',
      'app_clip_header_images', 'app_clip_advanced_experience_images', 'routing_app_coverages',
    ]);
    const adapters = Object.values(FILE_TARGETS as Record<string, FileAdapter>).flatMap((adapter) => [adapter, ...(adapter.versionParent ? [adapter.versionParent] : [])]);
    const fileOperations = adapters.flatMap((adapter) => [adapter.get, adapter.read, adapter.create, adapter.delete,
      ...(coveredUpdates.has(adapter.create.split('.')[0]) ? [adapter.update] : []),
    ].filter(Boolean));
    fileOperations.push('build_uploads.create', 'build_uploads.delete');
    expect(new Set([...COVERAGE.flatMap((row) => row.operations), ...fileOperations])).toEqual(new Set(Object.keys(MACRO_COVERED)));

    const retained = PROFILES.flatMap((p) => p.subProfiles.flatMap((s) => s.operations));
    expect(PROFILES.flatMap((p) => p.subProfiles.map((s) => `${p.name}:${s.name}`))).not.toContain('distribution:routing-coverage');
    for (const [target, adapter] of Object.entries(FILE_TARGETS as Record<string, FileAdapter>)) {
      if (coveredUpdates.has(adapter.create.split('.')[0])) {
        expect(retained).not.toContain(adapter.update);
        expect(MACRO_COVERED[adapter.update]).toBe('media__upload');
      } else {
        // Private files only: what is left raw can never commit a customer-facing image.
        expect(adapter.risk, adapter.update).toBe('low');
        expect(retained, `${adapter.update} must remain for checksum edits`).toContain(adapter.update);
        expect(MACRO_COVERED).not.toHaveProperty(adapter.update);
      }
      expect(retained).not.toContain(adapter.create);
      if (adapter.delete) expect(retained).not.toContain(adapter.delete);
      for (const [variant, owner] of [['', adapter], ['version', adapter.versionParent]] as const) {
        if (!owner) continue;
        for (const operation of [owner.get, owner.read].filter(Boolean) as string[]) {
          expect(retained).not.toContain(operation);
          expect(FILE_COVERAGE.find((cell) => cell.target === target && cell.action === 'list' && (cell.variant ?? '') === variant)?.operations).toContain(operation);
        }
      }
    }
    // No public-facing image commit remains raw anywhere.
    const publicFamilies = new Set(adapters.filter((a) => a.risk === 'public').map((a) => a.update));
    expect(retained.filter((operation) => publicFamilies.has(operation))).toEqual([]);
  });
  it.each(COVERAGE)('executes $target/$action through $macro against include-aware responses', async (cell) => {
    const page = cell.target === 'library' ? 'version' : cell.target;
    const pageId = { version: 'loc', cpp: 'cpp-loc', ppo: 'ppo-loc', event: 'event-loc' }[page]!;
    const relationship = PAGE_TARGETS[page as keyof typeof PAGE_TARGETS].relationship;
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
      } else if (cell.action === 'remove' || cell.action === 'reorder' || (cell.action === 'delete' && cell.target !== 'library')) Object.assign(args, { placement_ids: ['pi'], ...(cell.action === 'reorder' ? { placement_group: 'phone' } : {}), ...(cell.macro === 'media__arrange' ? { action: cell.action } : {}) });
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

type FileCell = Coverage & { variant?: 'version' };
const singleFile = (adapter: FileAdapter) => Boolean(adapter.attach || adapter.single || (adapter.read && !adapter.read.endsWith('.list')));
const FILE_COVERAGE: FileCell[] = Object.entries(FILE_TARGETS as Record<string, FileAdapter>).flatMap(([target, primary]) =>
  [primary, ...(primary.versionParent ? [primary.versionParent] : [])].flatMap((adapter): FileCell[] => {
    const variant = adapter === primary ? {} : { variant: 'version' as const };
    return [
      { target, ...variant, action: 'list', macro: 'media__list', operations: [adapter.parentGet, adapter.get, ...(adapter.read ? [adapter.read] : [])] },
      { target, ...variant, action: 'upload', macro: 'media__upload', operations: [adapter.create, adapter.update, ...(adapter.attach ? [adapter.attach] : [])] },
      ...(adapter.delete || target === 'build_upload_file' ? [{ target, ...variant, action: 'delete', macro: 'media__delete', operations: [adapter.delete ?? 'build_uploads.delete'] }] : []),
    ];
  }));

const appleSpec = JSON.parse(readFileSync(new URL('../spec/openapi.json', import.meta.url), 'utf8'));
const pathFor = (operation: string, id?: string) => mediaOperation(operation).path.replace('{id}', id ?? '');
const PNG = Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a,1,2,3,4]);
const GEOJSON = JSON.stringify({ type: 'FeatureCollection', features: [{ type: 'Feature', properties: { name: 'City' }, geometry: { type: 'MultiPolygon', coordinates: [
  [[[-122.5, 37.7], [-122.3, 37.7], [-122.3, 37.8], [-122.5, 37.8], [-122.5, 37.7]]],
  [[[-122.2, 37.7], [-122.1, 37.7], [-122.1, 37.8], [-122.2, 37.7]]],
] } }] });
const fixtureFor = (adapter: FileAdapter) => adapter.format === 'image' ? PNG
  : adapter.format === 'document' ? Buffer.from('%PDF-1.7\n')
  : adapter.format === 'geojson' ? Buffer.from(GEOJSON)
  : adapter.format === 'build' ? Buffer.from([0x50,0x4b,0x03,0x04,1,2,3,4]) : Buffer.from('arbitrary allowed file');
const argsFor = (adapter: FileAdapter) => ({ ...(adapter.format === 'asset' || adapter.format === 'build' ? { asset_type: 'ASSET' } : {}),
  ...(adapter.format === 'build' ? { uti: 'com.apple.ipa' } : {}) });

/** empty: Apple's empty to-one (404, or null linkage); version: page_id is a
 * version, so the localization read 404s; group: owned through a shared group. */
type MockOptions = { empty?: boolean; version?: boolean; group?: string };
function fileHttp(target: FileTarget, options: MockOptions = {}) {
  const primary: FileAdapter = FILE_TARGETS[target];
  const adapter = options.version ? primary.versionParent! : primary;
  const link = (id: string | null) => ({ data: id === null ? null : { id } });
  const build = target === 'build_upload_file';
  // A shared-group item has no gameCenterDetail; the chain ends at the group.
  const linksAt = (i: number): Record<string, unknown> => {
    const step = adapter.chain[i];
    if (!step) return {};
    if (step.group && options.group) return { [step.group]: link('group1') };
    return { [step.via]: link(step.get === 'apps.get' ? 'app' : `owner${i}`) };
  };
  const parent = { id: 'parent', attributes: build ? { name: 'Owner', platform: 'IOS', cfBundleShortVersionString: '3.0', cfBundleVersion: '42' } : { name: 'Owner', locale: 'en-US', ...(target.startsWith('in_app_purchase') ? { productId: 'example.product' } : {}) }, relationships: {
    // Build/background collections have links only, with no include option.
    ...(adapter.read ? {} : { [adapter.files]: link(options.empty ? null : 'file1') }),
    ...linksAt(0),
  } };
  const chain = adapter.chain.filter((step) => step.get !== 'apps.get').map((step, i) => ({
    operation: step.get, id: `owner${i}`, row: { id: `owner${i}`, attributes: target === 'in_app_purchase_image' && step.get === 'in_app_purchases_v2.get' ? { productId: 'example.product' } : {}, relationships: linksAt(i + 1) },
  }));
  // Validate includes against Apple, then omit linkage unless it was requested.
  // A mock derived only from the adapter would hide v1/v2 and link-only mistakes.
  const select = (operation: string, row: any, query?: any) => {
    const op = mediaOperation(operation);
    expect(op.deprecated, operation).toBe(false);
    const requested = query?.include ? String(query.include).split(',') : [];
    const allowed = appleSpec.paths[op.path].get.parameters?.find((p: any) => p.name === 'include')?.schema.items.enum ?? [];
    for (const key of requested) expect(allowed, `${operation}: invalid include ${key}`).toContain(key);
    return { ...row, relationships: Object.fromEntries(Object.entries(row.relationships ?? {}).filter(([key]) => requested.includes(key))) };
  };
  const file = { id: 'file1', attributes: { fileName: 'Existing file', assetDeliveryState: { state: 'COMPLETE' } } };
  const notFound = () => { throw new AscApiError('The specified resource does not exist', 404); };
  const http = {
    get: vi.fn(async (path: string, query?: any): Promise<any> => {
      if (path === '/v1/apps') return { data: [{ id: 'app', attributes: { name: 'Example', bundleId: 'example.app' } }] };
      if (options.version && path === pathFor(primary.parentGet, 'parent')) notFound();
      if (path === pathFor(adapter.parentGet, 'parent')) return { data: select(adapter.parentGet, parent, query) };
      if (path === pathFor(adapter.get, 'file1')) return { data: file };
      if (adapter.read && path === pathFor(adapter.read, 'parent')) {
        if (adapter.read.endsWith('.list')) return { data: options.empty ? [] : [file] };
        return options.empty ? notFound() : { data: file };
      }
      const next = chain.find((item) => path === pathFor(item.operation, item.id));
      if (next) return { data: select(next.operation, next.row, query) };
      if (path === '/v1/apps/app/gameCenterDetail') return { data: select('apps.game_center_detail.get', { id: 'detail', relationships: { gameCenterGroup: link(options.group ?? null) } }, query) };
      if (adapter.appList && path === pathFor(adapter.appList, 'app')) {
        // An app with thousands of uploads: only the filtered list is short.
        if (build && !(query?.['filter[cfBundleVersion]'] === '42' && query?.['filter[cfBundleShortVersionString]'] === '3.0' && query?.['filter[platform]'] === 'IOS')) {
          return { data: [{ id: 'other-upload' }], links: { next: `${path}?cursor=${Math.random()}` } };
        }
        if (target.startsWith('in_app_purchase') && query?.['filter[productId]'] !== 'example.product')
          return { data: [{ id: 'other-purchase' }], links: { next: `${path}?cursor=2` } };
        return { data: [{ id: adapter.chain.length ? `owner${chain.length - 1}` : 'parent' }] };
      }
      if (path.includes('?cursor=')) return { data: [{ id: 'other-upload' }], links: { next: `${path}x` } };
      throw new Error(`Unexpected GET ${path}`);
    }),
    post: vi.fn(async (_path: string, body: any) => ({ data: { id: 'new', attributes: { uploadOperations: [
      { method: 'PUT', url: 'https://upload.invalid/part', offset: 0, length: body.data.attributes.fileSize },
    ] } } })),
    patch: vi.fn(async () => ({ data: { id: 'new', attributes: { assetDeliveryState: { state: 'COMPLETE' } } } })),
    delete: vi.fn(async () => undefined), uploadAssetPart: vi.fn(async () => undefined),
  };
  return http;
}

describe('image and file target × action coverage', () => {
  it.each(FILE_COVERAGE)('executes $target/$action $variant through $macro with include-only relationships', async (cell) => {
    const primary: FileAdapter = FILE_TARGETS[cell.target as FileTarget];
    const adapter = cell.variant ? primary.versionParent! : primary;
    // A single-file slot takes a first upload only when it is empty (Apple's
    // 404 / null to-one); the advanced header is replaced by attaching.
    const empty = cell.action === 'upload' && singleFile(adapter) && !adapter.attach;
    const http = fileHttp(cell.target as FileTarget, { empty, version: Boolean(cell.variant) });
    const args: Record<string, unknown> = { app: 'Example', target: cell.target, page_id: 'parent' };
    let directory: string | undefined;
    try {
      if (cell.action === 'upload') {
        directory = await mkdtemp(join(tmpdir(), 'heimdall-file-coverage-'));
        const filePath = join(directory, 'upload.bin'); await writeFile(filePath, fixtureFor(adapter));
        Object.assign(args, { file_path: filePath, ...argsFor(adapter) });
      }
      if (cell.action === 'delete' && cell.target !== 'build_upload_file') args.file_ids = ['file1'];
      const preview = cell.action !== 'list' ? await buildMediaPreview(cell.macro, args, http as any) : undefined;
      if (preview) {
        expect(preview.message).toContain(cell.target === 'build_upload_file' ? 'Owner, IOS, 3.0 (42) / no build attached' : 'Owner, en-US');
        expect(preview.message).toContain(empty ? 'Existing files (0)' : 'Existing file');
        if (cell.variant) expect(preview.message).toContain('version default image');
        expect(preview.strong).toBe(cell.action === 'delete');
      }
      const result: any = await executeMediaTool(cell.macro, args, { http: http as any, approvedPlanFingerprint: preview?.planFingerprint });
      if (cell.action === 'list') expect(result.assets.map((a: any) => a.id)).toEqual(['file1']);
      else expect(result.ok, `${cell.target}/${cell.action}: ${JSON.stringify(result)}`).toBe(true);
      for (const operation of cell.operations) {
        const catalog = mediaOperation(operation);
        const calls = http[catalog.method.toLowerCase() as 'get' | 'post' | 'patch' | 'delete'].mock.calls;
        const expected = pathFor(operation, operation === adapter.parentGet || operation === adapter.read ? 'parent' : operation === adapter.get || operation === adapter.delete ? 'file1' : operation === adapter.update ? 'new' : operation === 'build_uploads.delete' || operation === adapter.attach ? 'parent' : undefined);
        expect(calls.some(([path]) => path === expected), `${cell.target}/${cell.action} never called ${catalog.method} ${expected}`).toBe(true);
      }
      if (cell.action === 'upload' && adapter.createParent) {
        const relationship = http.post.mock.calls.find(([path]) => path === pathFor(adapter.create))![1].data.relationships[adapter.createParent];
        expect(relationship.data.id).toBe('parent');
        expect(relationship.data.type).toBe(mediaDataSchema(adapter.create).properties.relationships.properties[adapter.createParent].properties.data.properties.type.enum[0]);
      }
      if (cell.action === 'upload') {
        expect(http.uploadAssetPart).toHaveBeenCalledOnce();
        const bytes = http.uploadAssetPart.mock.calls[0][1];
        const attributes = http.patch.mock.calls[0][1].data.attributes;
        const schema = mediaDataSchema(adapter.update).properties.attributes.properties;
        if (schema.sourceFileChecksums) expect(attributes.sourceFileChecksums).toEqual({ file: { algorithm: 'MD5', hash: createHash('md5').update(bytes).digest('hex') } });
        else if (schema.sourceFileChecksum) expect(attributes.sourceFileChecksum).toBe(createHash('md5').update(bytes).digest('hex'));
        expect(attributes.uploaded).toBe(true);
      }
    } finally { if (directory) await rm(directory, { recursive: true, force: true }); }
  });

  it('refuses arrange and foreign files before any write', async () => {
    await expect(executeMediaTool('media__arrange', { app: 'Example', target: 'app_clip_header_image', action: 'reorder' }, { http: {} as any })).rejects.toThrow('no ordering');
    const http = fileHttp('routing_coverage');
    await expect(executeMediaTool('media__delete', { app: 'Example', target: 'routing_coverage', page_id: 'parent', file_ids: ['file1', 'foreign'] }, { http: http as any })).rejects.toThrow('foreign');
    expect(http.delete).not.toHaveBeenCalled();
    const preview = await buildMediaPreview('media__delete', { app: 'Example', target: 'routing_coverage', page_id: 'parent', file_ids: ['file1'] }, http as any);
    expect(preview.message).toContain('Existing file');
    expect(preview.message).toContain('Owner, en-US');
    expect(preview.strong).toBe(true);
    await expect(executeMediaTool('media__delete', { app: 'Example', target: 'routing_coverage', page_id: 'parent', file_ids: ['file1'] }, { http: http as any, dryRun: true, approvedPlanFingerprint: 'stale' })).rejects.toThrow('changed since confirmation');
  });

  it.each([
    ['app_clip_header_image', 'public'], ['game_center_achievement_image', 'public'],
    ['in_app_purchase_image', 'public'], ['subscription_image', 'public'],
    ['in_app_purchase_review_screenshot', 'low'], ['subscription_review_screenshot', 'low'],
    ['encryption_document', 'low'], ['app_review_attachment', 'low'],
    ['routing_coverage', 'low'], ['background_asset_file', 'low'], ['build_upload_file', 'release'],
  ])('classifies %s upload as %s and delete as destructive', (target, risk) => {
    expect(mediaRisk('media__upload', { target, page_id: 'parent' })).toBe(risk);
    if (FILE_TARGETS[target as keyof typeof FILE_TARGETS].delete || target === 'build_upload_file') expect(mediaRisk('media__delete', { target })).toBe('destructive');
  });

  it('never confirms a plan below the risk of an operation it sends', () => {
    // No page_id: a new build upload runs build_uploads.create, a release step.
    expect(mediaOperation('build_uploads.create').risk).toBe('release');
    expect(mediaRisk('media__upload', { target: 'build_upload_file' })).toBe('release');
    // An unattached advanced App Clip image shows nowhere until an experience names it.
    expect(mediaRisk('media__upload', { target: 'app_clip_advanced_experience_image' })).toBe('low');
    expect(mediaRisk('media__upload', { target: 'app_clip_header_image', page_id: 'p', replace: true })).toBe('destructive');
    for (const adapter of Object.values(FILE_TARGETS as Record<string, FileAdapter>)) {
      for (const operation of [adapter.create, adapter.update, adapter.attach].filter(Boolean) as string[]) {
        const level = mediaOperation(operation).risk;
        expect([undefined, 'low', adapter.risk], operation).toContain(level);
      }
    }
  });

  it.each([
    ['app_clip_header_image', 'not an image', 'PNG or JPEG'],
    ['encryption_document', '', 'File size'],
    ['routing_coverage', '{oops', 'GeoJSON'],
    ['build_upload_file', 'not an IPA', 'ZIP/IPA'],
    ['app_review_attachment', '', 'File size'],
    ['background_asset_file', '', 'File size'],
  ])('rejects invalid %s bytes before network access', async (target, content, message) => {
    const directory = await mkdtemp(join(tmpdir(), 'heimdall-file-invalid-'));
    try {
      const filePath = join(directory, 'invalid.bin'); await writeFile(filePath, content);
      const http = { get: vi.fn(), post: vi.fn() };
      await expect(executeMediaTool('media__upload', { app: 'Example', target, page_id: 'parent', file_path: filePath,
        ...argsFor(FILE_TARGETS[target as FileTarget]),
      }, { http: http as any })).rejects.toThrow(message);
      expect(http.get).not.toHaveBeenCalled(); expect(http.post).not.toHaveBeenCalled();
    } finally { await rm(directory, { recursive: true, force: true }); }
  });

  it('creates a build upload before reserving and committing its IPA file', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'heimdall-build-upload-'));
    try {
      const filePath = join(directory, 'app.ipa'); await writeFile(filePath, Buffer.from([0x50,0x4b,0x03,0x04,1,2,3,4]));
      const http = { get: vi.fn(async () => ({ data: [{ id: 'app', attributes: { name: 'Example', bundleId: 'example.app' } }] })),
        post: vi.fn(async (path: string, body: any) => path === '/v1/buildUploads' ? { data: { id: 'build-up' } }
          : { data: { id: 'file-up', attributes: { uploadOperations: [{ method: 'PUT', url: 'https://upload.invalid/part', offset: 0, length: body.data.attributes.fileSize }] } } }),
        patch: vi.fn(async () => ({ data: { id: 'file-up', attributes: { assetDeliveryState: { state: 'COMPLETE' } } } })),
        uploadAssetPart: vi.fn(async () => undefined),
      };
      const args = { app: 'Example', target: 'build_upload_file', file_path: filePath, asset_type: 'ASSET', uti: 'com.apple.ipa', build_version: '42', build_short_version: '3.0', platform: 'IOS' };
      const preview = await buildMediaPreview('media__upload', args, http as any);
      expect(preview.message).toContain('build_uploads.create');
      const result: any = await executeMediaTool('media__upload', args, { http: http as any, approvedPlanFingerprint: preview.planFingerprint });
      expect(result.ok).toBe(true); expect(result.ownerId).toBe('build-up');
      expect(http.post.mock.calls.map(([path]) => path)).toEqual(['/v1/buildUploads', '/v1/buildUploadFiles']);
      expect(http.post.mock.calls[1][1].data.relationships.buildUpload.data.id).toBe('build-up');
      expect(http.patch.mock.calls[0][0]).toBe('/v1/buildUploadFiles/file-up');
    } finally { await rm(directory, { recursive: true, force: true }); }
  });

  it.each(Object.keys(FILE_TARGETS) as FileTarget[])('rejects arrange and foreign app ownership for %s', async (target) => {
    const adapter = FILE_TARGETS[target];
    const http = fileHttp(target);
    await expect(executeMediaTool('media__arrange', { target, action: 'reorder' }, { http: http as any })).rejects.toThrow('no ordering');
    expect(http.get).not.toHaveBeenCalled();
    const original = http.get.getMockImplementation()!;
    http.get.mockImplementation(async (path, query) => {
      const response = structuredClone(await original(path, query));
      if (adapter.appList && path === pathFor(adapter.appList, 'app')) response.data = [];
      else if (response.data?.relationships?.app) response.data.relationships.app.data.id = 'foreign';
      return response;
    });
    const directory = await mkdtemp(join(tmpdir(), 'heimdall-owner-'));
    try {
      const filePath = join(directory, 'upload.bin');
      await writeFile(filePath, fixtureFor(adapter));
      const args = { app: 'Example', target, page_id: 'parent', file_path: filePath, ...argsFor(adapter) };
      await expect(executeMediaTool('media__upload', args, { http: http as any })).rejects.toThrow('does not belong');
      if (adapter.delete || target === 'build_upload_file') {
        await expect(executeMediaTool('media__delete', { app: 'Example', target, page_id: 'parent', ...(adapter.delete ? { file_ids: ['file1'] } : {}) }, { http: http as any })).rejects.toThrow('does not belong');
      } else await expect(executeMediaTool('media__delete', { target }, { http: http as any })).rejects.toThrow('does not offer DELETE');
      expect(http.post).not.toHaveBeenCalled(); expect(http.patch).not.toHaveBeenCalled(); expect(http.delete).not.toHaveBeenCalled();
    } finally { await rm(directory, { recursive: true, force: true }); }
  });

  it.each(['routing_coverage', 'app_clip_advanced_experience_image', 'build_upload_file'] as FileTarget[])('rejects changed ownership or file membership after %s confirmation', async (target) => {
    const http = fileHttp(target), adapter = FILE_TARGETS[target];
    const args = { app: 'Example', target, page_id: 'parent', ...(target === 'build_upload_file' ? {} : { file_ids: ['file1'] }) };
    // Advanced experience images have no DELETE: exercise their upload/replace.
    const directory = await mkdtemp(join(tmpdir(), 'heimdall-changed-'));
    try {
      const filePath = join(directory, 'new.png'); await writeFile(filePath, PNG);
      const macro = adapter.delete || target === 'build_upload_file' ? 'media__delete' : 'media__upload';
      const input = macro === 'media__upload' ? { app: 'Example', target, page_id: 'parent', file_path: filePath } : args;
      const preview = await buildMediaPreview(macro, input, http as any);
      const original = http.get.getMockImplementation()!;
      http.get.mockImplementation(async (path, query) => {
        const result = structuredClone(await original(path, query));
        if (path === pathFor(adapter.get, 'file1')) result.data.attributes.fileSize = 9000;
        return result;
      });
      await expect(executeMediaTool(macro, input, { http: http as any, approvedPlanFingerprint: preview.planFingerprint })).rejects.toThrow('changed since confirmation');
      expect(http.post).not.toHaveBeenCalled(); expect(http.patch).not.toHaveBeenCalled(); expect(http.delete).not.toHaveBeenCalled();
    } finally { await rm(directory, { recursive: true, force: true }); }
  });

  it.each(['in_app_purchase_image', 'in_app_purchase_review_screenshot'] as FileTarget[])('%s scopes app ownership by productId', async (target) => {
    const http = fileHttp(target);
    const result: any = await executeMediaTool('media__list', { app: 'Example', target, page_id: 'parent' }, { http: http as any });
    expect(result.assets.map((asset: any) => asset.id)).toEqual(['file1']);
    const calls = http.get.mock.calls.filter(([path]) => path === pathFor('apps.in_app_purchases_v2.list', 'app'));
    expect(calls).toHaveLength(1);
    expect(calls[0][1]).toMatchObject({ 'filter[productId]': 'example.product' });
  });

  it('accepts processing-state changes after approval but rejects changed file size', async () => {
    const http = fileHttp('routing_coverage');
    const args = { app: 'Example', target: 'routing_coverage', page_id: 'parent', file_ids: ['file1'] };
    const preview = await buildMediaPreview('media__delete', args, http as any);
    const original = http.get.getMockImplementation()!;
    http.get.mockImplementation(async (path, query) => {
      const response = structuredClone(await original(path, query));
      if (path === pathFor('routing_app_coverages.get', 'file1')) response.data.attributes.assetDeliveryState.state = 'PROCESSING';
      return response;
    });
    const result: any = await executeMediaTool('media__delete', args, { http: http as any, dryRun: true, approvedPlanFingerprint: preview.planFingerprint });
    expect(result.dryRun).toBe(true);
  });

  it('paginates build file ownership and refuses an incomplete list before deleting the whole upload', async () => {
    const http = fileHttp('build_upload_file'), original = http.get.getMockImplementation()!;
    http.get.mockImplementation(async (path, query) => {
      if (path === '/v1/buildUploads/parent/buildUploadFiles') return { data: [], links: { next: '/v1/buildUploads/parent/buildUploadFiles?cursor=2' } };
      if (path.includes('cursor=2')) return { data: [{ id: 'file1' }], meta: { paging: { total: 1 } } };
      return original(path, query);
    });
    const args = { app: 'Example', target: 'build_upload_file', page_id: 'parent' };
    const listed: any = await executeMediaTool('media__list', args, { http: http as any });
    expect(listed.assets[0].name).toBe('Existing file');
    http.get.mockImplementation(async (path, query) => path.includes('/buildUploadFiles') ? { data: [{ id: 'file1' }], meta: { paging: { total: 2 } } } : original(path, query));
    await expect(executeMediaTool('media__delete', args, { http: http as any })).rejects.toThrow('Truncated');
    expect(http.delete).not.toHaveBeenCalled();
  });

  it.each(['app_clip_header_image', 'encryption_document', 'app_review_attachment', 'routing_coverage', 'background_asset_file', 'build_upload_file'] as FileTarget[])('enforces regular-file and size limits for %s before reads', async (target) => {
    const directory = await mkdtemp(join(tmpdir(), 'heimdall-limits-'));
    try {
      const http = fileHttp(target), args = { app: 'Example', target, page_id: 'parent', ...argsFor(FILE_TARGETS[target]) };
      await expect(executeMediaTool('media__upload', { ...args, file_path: directory }, { http: http as any })).rejects.toThrow('regular file');
      const path = join(directory, 'oversized');
      const file = await open(path, 'w');
      try { await file.truncate((FILE_TARGETS[target].format === 'image' ? 51 : 501) * 1024 * 1024); } finally { await file.close(); }
      await expect(executeMediaTool('media__upload', { ...args, file_path: path }, { http: http as any })).rejects.toThrow('File size');
      expect(http.get).not.toHaveBeenCalled(); expect(http.post).not.toHaveBeenCalled();
    } finally { await rm(directory, { recursive: true, force: true }); }
  });

  it.each([
    ['com.apple.ipa', Buffer.from([0x50,0x4b,0x03,0x04])],
    ['com.pkware.zip-archive', Buffer.from([0x50,0x4b,0x03,0x04])],
    ['com.apple.pkg', Buffer.from('xar!contents')],
    ['com.apple.binary-property-list', Buffer.from('bplist00contents')],
    ['com.apple.xml-property-list', Buffer.from('<plist version="1.0"><dict/></plist>')],
  ])('checks the signature for build UTI %s', async (uti, bytes) => {
    const directory = await mkdtemp(join(tmpdir(), 'heimdall-uti-'));
    try {
      const filePath = join(directory, 'file'); await writeFile(filePath, bytes);
      const http = fileHttp('build_upload_file');
      const args = { app: 'Example', target: 'build_upload_file', page_id: 'parent', file_path: filePath, uti, asset_type: 'ASSET' };
      expect((await executeMediaTool('media__upload', args, { http: http as any }) as any).ok).toBe(true);
      await writeFile(filePath, 'wrong file type'); http.get.mockClear(); http.post.mockClear();
      await expect(executeMediaTool('media__upload', args, { http: http as any })).rejects.toThrow('UTI requires');
      expect(http.get).not.toHaveBeenCalled(); expect(http.post).not.toHaveBeenCalled();
    } finally { await rm(directory, { recursive: true, force: true }); }
  });

  it('rejects an XML plist with no root element', async () => {
    await withFile('<plist></plist>', async (path) => {
      const http = fileHttp('build_upload_file');
      await expect(executeMediaTool('media__upload', { app: 'Example', target: 'build_upload_file', page_id: 'parent', file_path: path, asset_type: 'ASSET_DESCRIPTION', uti: 'com.apple.xml-property-list' }, { http: http as any })).rejects.toThrow('requires an XML plist');
      expect(http.post).not.toHaveBeenCalled();
    });
  });

  it.each([
    '{"type":"Polygon"}', '{"type":"FeatureCollection","features":[{}]}', '{"type":"Polygon","coordinates":[[[0,0],[1,0],[1,1],[2,2]]]}',
    // Empty shapes and collections, and a feature without a geometry.
    '{"type":"MultiPolygon","coordinates":[]}', '{"type":"MultiPolygon","coordinates":[[]]}', '{"type":"Polygon","coordinates":[]}',
    '{"type":"FeatureCollection","features":[]}', '{"type":"GeometryCollection","geometries":[]}',
    '{"type":"Feature","properties":{},"geometry":null}', '{"type":"Feature","properties":[],"geometry":{"type":"Point","coordinates":[0,0]}}',
  ])('refuses malformed GeoJSON structure %s', async (content) => {
    const directory = await mkdtemp(join(tmpdir(), 'heimdall-geojson-'));
    try {
      const path = join(directory, 'area.geojson'); await writeFile(path, content);
      const http = fileHttp('routing_coverage');
      await expect(executeMediaTool('media__upload', { app: 'Example', target: 'routing_coverage', page_id: 'parent', file_path: path }, { http: http as any })).rejects.toThrow('GeoJSON');
      expect(http.get).not.toHaveBeenCalled();
    } finally { await rm(directory, { recursive: true, force: true }); }
  });

  it('refuses ambiguous selectors instead of silently ignoring version or platform', async () => {
    const http = fileHttp('routing_coverage');
    for (const selector of [{ version: '3.0' }, { platform: 'IOS' }, { locale: 'en-US' }]) {
      await expect(executeMediaTool('media__list', { app: 'Example', target: 'routing_coverage', page_id: 'parent', ...selector }, { http: http as any })).rejects.toThrow('exact page_id');
    }
    expect(http.get).not.toHaveBeenCalled();
  });
});

const SINGLE_FILE = (Object.keys(FILE_TARGETS) as FileTarget[]).filter((target) => singleFile(FILE_TARGETS[target]));
async function withFile<T>(content: Buffer | string, run: (path: string, directory: string) => Promise<T>): Promise<T> {
  const directory = await mkdtemp(join(tmpdir(), 'heimdall-media-'));
  try { const path = join(directory, 'upload.bin'); await writeFile(path, content); return await run(path, directory); }
  finally { await rm(directory, { recursive: true, force: true }); }
}

describe('single-file owners: first upload, empty to-one and replace', () => {
  it('covers every to-one target, including the version default images', () => {
    expect(SINGLE_FILE.sort()).toEqual(['app_clip_advanced_experience_image', 'app_clip_header_image', 'encryption_document', 'game_center_achievement_image',
      'game_center_activity_image', 'game_center_challenge_image', 'game_center_leaderboard_image', 'game_center_leaderboard_set_image',
      'in_app_purchase_image', 'in_app_purchase_review_screenshot', 'routing_coverage', 'subscription_image', 'subscription_review_screenshot']);
  });

  it.each(SINGLE_FILE.flatMap((target) => [[target, false], ...(FILE_TARGETS[target].versionParent ? [[target, true]] : [])] as [FileTarget, boolean][]))('%s (version owner: %s) lists and uploads onto an empty to-one', async (target, version) => {
    const adapter: FileAdapter = version ? FILE_TARGETS[target].versionParent! : FILE_TARGETS[target];
    const http = fileHttp(target, { empty: true, version });
    const listed: any = await executeMediaTool('media__list', { app: 'Example', target, page_id: 'parent' }, { http: http as any });
    expect(listed.assets).toEqual([]);
    await withFile(fixtureFor(adapter), async (path) => {
      const args = { app: 'Example', target, page_id: 'parent', file_path: path, ...argsFor(adapter) };
      const preview = await buildMediaPreview('media__upload', args, http as any);
      expect(preview.message).toContain('Existing files (0)');
      const result: any = await executeMediaTool('media__upload', args, { http: http as any, approvedPlanFingerprint: preview.planFingerprint });
      expect(result.ok).toBe(true);
      expect(http.delete).not.toHaveBeenCalled();
    });
  });

  it('keeps permission and server failures on a to-one read as errors', async () => {
    const http = fileHttp('subscription_review_screenshot'), original = http.get.getMockImplementation()!;
    http.get.mockImplementation(async (path, query) => {
      if (path === pathFor('subscriptions.app_store_review_screenshot.get', 'parent')) throw new AscApiError('Forbidden', 403);
      return original(path, query);
    });
    await expect(executeMediaTool('media__list', { app: 'Example', target: 'subscription_review_screenshot', page_id: 'parent' }, { http: http as any })).rejects.toThrow('Forbidden');
  });

  it.each(SINGLE_FILE.filter((target) => FILE_TARGETS[target].delete))('%s refuses a second file unless replace is asked for, then deletes first', async (target) => {
    const adapter: FileAdapter = FILE_TARGETS[target];
    await withFile(fixtureFor(adapter), async (path) => {
      const http = fileHttp(target);
      const args = { app: 'Example', target, page_id: 'parent', file_path: path, ...argsFor(adapter) };
      await expect(executeMediaTool('media__upload', args, { http: http as any })).rejects.toThrow(/already has Existing file \[file1\].*replace: true/);
      expect(http.post).not.toHaveBeenCalled(); expect(http.delete).not.toHaveBeenCalled();
      expect(mediaRisk('media__upload', { ...args, replace: true })).toBe('destructive');
      const preview = await buildMediaPreview('media__upload', { ...args, replace: true }, http as any);
      expect(preview.strong).toBe(true);
      expect(preview.message).toContain('replace');
      expect(preview.message).toContain(`${adapter.delete} [file1]`);
      const result: any = await executeMediaTool('media__upload', { ...args, replace: true }, { http: http as any, approvedPlanFingerprint: preview.planFingerprint });
      expect(result).toMatchObject({ ok: true, deleted: ['file1'], fileId: 'new' });
      expect(http.delete.mock.calls.map(([p]) => p)).toEqual([pathFor(adapter.delete!, 'file1')]);
      expect(http.delete.mock.invocationCallOrder[0]).toBeLessThan(http.post.mock.invocationCallOrder[0]);
    });
  });

  it('reports a failed replace delete without uploading', async () => {
    await withFile(PNG, async (path) => {
      const http = fileHttp('app_clip_header_image');
      http.delete.mockRejectedValue(new Error('Conflict'));
      const result: any = await executeMediaTool('media__upload', { app: 'Example', target: 'app_clip_header_image', page_id: 'parent', file_path: path, replace: true }, { http: http as any });
      expect(result).toMatchObject({ ok: false, failedPhase: 'replace', deleted: [] });
      expect(http.post).not.toHaveBeenCalled();
    });
  });

  it('keeps the old file when local bytes change after planning and before replace', async () => {
    await withFile(PNG, async (path) => {
      const http = fileHttp('app_clip_header_image');
      const original = http.get.getMockImplementation()!;
      http.get.mockImplementation(async (url, query) => {
        const response = await original(url, query);
        if (url === pathFor('app_clip_header_images.get', 'file1')) await writeFile(path, Buffer.concat([PNG.subarray(0, 8), Buffer.from([9, 9, 9, 9])]));
        return response;
      });
      await expect(executeMediaTool('media__upload', { app: 'Example', target: 'app_clip_header_image', page_id: 'parent', file_path: path, replace: true }, { http: http as any })).rejects.toThrow('existing file was not deleted');
      expect(http.delete).not.toHaveBeenCalled(); expect(http.post).not.toHaveBeenCalled();
    });
  });

  it('refuses replace where Apple has no DELETE, on multi-file targets, and with nothing to replace', async () => {
    await withFile('%PDF-1.7\n', async (path) => {
      const http = fileHttp('encryption_document');
      await expect(executeMediaTool('media__upload', { app: 'Example', target: 'encryption_document', page_id: 'parent', file_path: path }, { http: http as any })).rejects.toThrow('no DELETE');
      await expect(executeMediaTool('media__upload', { app: 'Example', target: 'encryption_document', page_id: 'parent', file_path: path, replace: true }, { http: http as any })).rejects.toThrow('replace is not supported');
      await expect(executeMediaTool('media__upload', { app: 'Example', target: 'app_review_attachment', page_id: 'parent', file_path: path, replace: true }, { http: http as any })).rejects.toThrow('replace is not supported');
      expect(http.post).not.toHaveBeenCalled();
    });
    await withFile(PNG, async (path) => {
      const http = fileHttp('app_clip_header_image', { empty: true });
      await expect(executeMediaTool('media__upload', { app: 'Example', target: 'app_clip_header_image', page_id: 'parent', file_path: path, replace: true }, { http: http as any })).rejects.toThrow('no app_clip_header_image to replace');
      expect(http.post).not.toHaveBeenCalled();
    });
  });

  it('says an advanced experience header is detached, not deleted, when replaced', async () => {
    await withFile(PNG, async (path) => {
      const preview = await buildMediaPreview('media__upload', { app: 'Example', target: 'app_clip_advanced_experience_image', page_id: 'parent', file_path: path }, fileHttp('app_clip_advanced_experience_image') as any);
      expect(preview.message).toContain('detached, not deleted');
      expect(preview.strong).toBe(false);
    });
  });
});

describe('Game Center items in a shared group', () => {
  const GAME_CENTER = (Object.keys(FILE_TARGETS) as FileTarget[]).filter((target) => FILE_TARGETS[target].chain.some((step: any) => step.group));

  it.each(GAME_CENTER.flatMap((target) => [[target, false], ...(FILE_TARGETS[target].versionParent ? [[target, true]] : [])] as [FileTarget, boolean][]))('%s (version owner: %s) is owned through the app’s detail in the group', async (target, version) => {
    const http = fileHttp(target, { group: 'group1', version });
    const listed: any = await executeMediaTool('media__list', { app: 'Example', target, page_id: 'parent' }, { http: http as any });
    expect(listed.assets.map((a: any) => a.id)).toEqual(['file1']);
    expect(listed.pages[0].label).toContain('Game Center group group1');
    expect(http.get.mock.calls.some(([path, query]) => path === '/v1/apps/app/gameCenterDetail' && query?.include === 'gameCenterGroup')).toBe(true);
    // Never reaches the detail the item does not have.
    expect(http.get.mock.calls.some(([path]) => path.startsWith('/v1/gameCenterDetails/'))).toBe(false);
    const result: any = await executeMediaTool('media__delete', { app: 'Example', target, page_id: 'parent', file_ids: ['file1'] }, { http: http as any });
    expect(result.ok).toBe(true);
  });

  it.each(GAME_CENTER)('%s refuses a group the app is not in, and an item linked to neither', async (target) => {
    const foreign = fileHttp(target, { group: 'other-group' });
    await expect(executeMediaTool('media__delete', { app: 'Example', target, page_id: 'parent', file_ids: ['file1'] }, { http: foreign as any })).rejects.toThrow('does not use');
    const unlinked = fileHttp(target, { group: 'group1' }), original = unlinked.get.getMockImplementation()!;
    unlinked.get.mockImplementation(async (path, query) => {
      const response = structuredClone(await original(path, query));
      if (response.data?.relationships?.gameCenterGroup && path !== '/v1/apps/app/gameCenterDetail') response.data.relationships.gameCenterGroup.data = null;
      return response;
    });
    await expect(executeMediaTool('media__delete', { app: 'Example', target, page_id: 'parent', file_ids: ['file1'] }, { http: unlinked as any })).rejects.toThrow('Neither gameCenterDetail nor gameCenterGroup');
    expect(foreign.delete).not.toHaveBeenCalled(); expect(unlinked.delete).not.toHaveBeenCalled();
  });
});

describe('advanced App Clip image before its experience', () => {
  it('uploads without page_id, names the app, and attaches nothing', async () => {
    await withFile(PNG, async (path) => {
      const http = fileHttp('app_clip_advanced_experience_image');
      const args = { app: 'Example', target: 'app_clip_advanced_experience_image', file_path: path };
      const preview = await buildMediaPreview('media__upload', args, http as any);
      expect(preview.message).toContain('App:        Example');
      expect(preview.message).toContain('Not attached');
      expect(preview.message).toContain('LOW-level');
      expect(preview.message).not.toContain('app_clip_advanced_experiences.update');
      const result: any = await executeMediaTool('media__upload', args, { http: http as any, approvedPlanFingerprint: preview.planFingerprint });
      expect(result).toMatchObject({ ok: true, fileId: 'new', ownerId: null, risk: 'low' });
      expect(result.note).toContain('relationships.headerImage set to new');
      expect(http.post.mock.calls.map(([p]) => p)).toEqual([pathFor('app_clip_advanced_experience_images.create')]);
      expect(http.post.mock.calls[0][1].data.relationships).toBeUndefined();
      expect(http.patch.mock.calls.map(([p]) => p)).toEqual([pathFor('app_clip_advanced_experience_images.update', 'new')]);
      // Preview and execution each resolve the app, and read nothing else.
      expect(new Set(http.get.mock.calls.map(([p]) => p))).toEqual(new Set(['/v1/apps']));
    });
  });

  it('lists an unattached image by ID, with an explicit ownership limit and no writes', async () => {
    const http = fileHttp('app_clip_advanced_experience_image');
    const original = http.get.getMockImplementation()!;
    http.get.mockImplementation(async (path, query) => path === pathFor('app_clip_advanced_experience_images.get', 'new')
      ? { data: { id: 'new', attributes: { fileName: 'header.png', assetDeliveryState: { state: 'FAILED', errors: [{ code: 'INVALID_IMAGE' }] } } } }
      : original(path, query));
    const listed: any = await executeMediaTool('media__list', { app: 'Example', target: 'app_clip_advanced_experience_image', file_ids: ['new'] }, { http: http as any });
    expect(listed.assets[0]).toMatchObject({ id: 'new', state: 'FAILED', errors: ['INVALID_IMAGE'], fileName: null, width: null, height: null });
    expect(listed.note).toContain('ownership by the named app cannot be proven');
    expect(http.post).not.toHaveBeenCalled(); expect(http.patch).not.toHaveBeenCalled(); expect(http.delete).not.toHaveBeenCalled();
    await expect(executeMediaTool('media__list', { app: 'Example', target: 'app_clip_advanced_experience_image' }, { http: http as any })).rejects.toThrow('file_ids');
  });

  it('still needs page_id for other targets', async () => {
    await withFile(PNG, async (path) => {
      const http = fileHttp('app_clip_header_image');
      await expect(executeMediaTool('media__upload', { app: 'Example', target: 'app_clip_header_image', file_path: path }, { http: http as any })).rejects.toThrow('page_id');
      await expect(executeMediaTool('media__list', { app: 'Example', target: 'app_clip_header_image' }, { http: http as any })).rejects.toThrow('page_id');
      await expect(executeMediaTool('media__upload', { app: 'Example', target: 'app_clip_advanced_experience_image', file_path: path, platform: 'IOS' }, { http: http as any })).rejects.toThrow('no platform');
    });
  });
});

describe('build upload ownership and preview', () => {
  it('proves ownership from the filtered app list, not by paging every upload', async () => {
    const http = fileHttp('build_upload_file');
    const preview = await buildMediaPreview('media__delete', { app: 'Example', target: 'build_upload_file', page_id: 'parent' }, http as any);
    const call = http.get.mock.calls.find(([path]) => path === '/v1/apps/app/buildUploads')!;
    expect(call[1]).toMatchObject({ 'filter[cfBundleVersion]': '42', 'filter[cfBundleShortVersionString]': '3.0', 'filter[platform]': 'IOS' });
    expect(http.get.mock.calls.filter(([path]) => path.startsWith('/v1/apps/app/buildUploads'))).toHaveLength(1);
    // The delete names the version the user knows and whether a build hangs off it.
    expect(preview.message).toContain('3.0 (42)');
    expect(preview.message).toContain('no build attached');
    expect(preview.message).toContain('Build upload Owner, IOS, 3.0 (42)');
  });

  it('shows an attached build in the delete preview', async () => {
    const http = fileHttp('build_upload_file'), original = http.get.getMockImplementation()!;
    http.get.mockImplementation(async (path, query) => {
      const response = structuredClone(await original(path, query));
      if (path === '/v1/buildUploads/parent') response.data.relationships.build = { data: { id: 'build-9' } };
      return response;
    });
    const preview = await buildMediaPreview('media__delete', { app: 'Example', target: 'build_upload_file', page_id: 'parent' }, http as any);
    expect(preview.message).toContain('build build-9 attached');
  });

  it('confirms a new build upload at release level, the risk of build_uploads.create', async () => {
    await withFile(Buffer.from([0x50,0x4b,0x03,0x04,1,2,3,4]), async (path) => {
      const http = fileHttp('build_upload_file');
      const args = { app: 'Example', target: 'build_upload_file', file_path: path, asset_type: 'ASSET', uti: 'com.apple.ipa', build_version: '43', build_short_version: '3.1', platform: 'IOS' };
      const preview = await buildMediaPreview('media__upload', args, http as any);
      expect(preview.message).toContain('RELEASE-level');
      const dry: any = await executeMediaTool('media__upload', args, { http: http as any, dryRun: true });
      expect(dry.risk).toBe('release');
    });
  });

  it('confirms a file on an existing build upload at release level', async () => {
    await withFile(Buffer.from([0x50,0x4b,0x03,0x04,1,2,3,4]), async (path) => {
      const http = fileHttp('build_upload_file');
      const args = { app: 'Example', target: 'build_upload_file', page_id: 'parent', file_path: path, asset_type: 'ASSET', uti: 'com.apple.ipa' };
      const preview = await buildMediaPreview('media__upload', args, http as any);
      expect(preview.message).toContain('RELEASE-level');
      expect(preview.strong).toBe(false);
      const result: any = await executeMediaTool('media__upload', args, { http: http as any, dryRun: true, approvedPlanFingerprint: preview.planFingerprint });
      expect(result.risk).toBe('release');
    });
  });
});

describe('target-specific arguments', () => {
  it.each([
    ['app_clip_header_image', { uti: 'com.apple.ipa' }, 'uti is not supported'],
    ['app_clip_header_image', { asset_type: 'ASSET' }, 'asset_type is not supported'],
    ['background_asset_file', { asset_type: 'ASSET_SPI' }, 'ASSET, MANIFEST'],
    ['background_asset_file', { asset_type: 'ASSET', uti: 'com.apple.ipa' }, 'uti is not supported'],
    ['build_upload_file', { asset_type: 'ASSET', uti: 'com.example.zip' }, '"uti" must be one of'],
    ['build_upload_file', { asset_type: 'ASSET' }, '"uti" must be a non-empty string'],
    ['build_upload_file', { asset_type: 'ASSET', uti: 'com.apple.ipa', build_version: '1' }, 'only for a new build upload'],
    ['routing_coverage', { build_short_version: '1.0' }, 'only for a new build upload'],
    ['app_review_attachment', { replace: true }, 'replace is not supported'],
    ['app_clip_header_image', { replace: 'yes' }, 'replace must be boolean'],
  ] as [FileTarget, Record<string, unknown>, string][])('rejects %s with %j before reading the file or calling Apple', async (target, extra, message) => {
    const http = fileHttp(target);
    // A path that does not exist: the argument check must come first.
    await expect(executeMediaTool('media__upload', { app: 'Example', target, page_id: 'parent', file_path: '/nonexistent/heimdall/file', ...extra }, { http: http as any })).rejects.toThrow(message);
    expect(http.get).not.toHaveBeenCalled();
  });

  it.each(['uti', 'asset_type', 'build_version', 'build_short_version', 'replace'])('rejects %s on library and page targets', async (key) => {
    const http = { get: vi.fn() };
    for (const target of ['library', 'version']) {
      await expect(executeMediaTool('media__upload', { app: 'Example', target, file_path: '/nonexistent/x.png', [key]: key === 'replace' ? true : 'ASSET' }, { http: http as any })).rejects.toThrow(`${key} is not supported for ${target}`);
    }
    expect(http.get).not.toHaveBeenCalled();
  });

  it('rejects file-only arguments on delete', async () => {
    const http = fileHttp('routing_coverage');
    await expect(executeMediaTool('media__delete', { app: 'Example', target: 'routing_coverage', page_id: 'parent', file_ids: ['file1'], uti: 'com.apple.ipa' }, { http: http as any })).rejects.toThrow('uti is not supported');
    expect(http.get).not.toHaveBeenCalled();
  });
});

describe('bounded reads: hashing and sending from one descriptor', () => {
  const ranges = (size: number, part: number) => Array.from({ length: Math.ceil(size / part) }, (_, i) => ({ method: 'PUT', url: 'https://upload.invalid/part', offset: i * part, length: Math.min(part, size - i * part) }));

  it('sends each reserved range from the checked file and commits the digest of what was sent', async () => {
    const bytes = Buffer.alloc(3 * 1024 * 1024 + 5); for (let i = 0; i < bytes.length; i++) bytes[i] = (i * 31) & 0xff;
    await withFile(bytes, async (path) => {
      const http = fileHttp('background_asset_file', { empty: true });
      http.post.mockImplementation(async (_p: string, body: any) => ({ data: { id: 'new', attributes: { uploadOperations: ranges(body.data.attributes.fileSize, 1024 * 1024).reverse() } } }));
      const result: any = await executeMediaTool('media__upload', { app: 'Example', target: 'background_asset_file', page_id: 'parent', file_path: path, asset_type: 'ASSET' }, { http: http as any });
      expect(result).toMatchObject({ ok: true, parts: 4 });
      const sent = http.uploadAssetPart.mock.calls.map(([op, part]) => { expect(part.length).toBe(op.length); expect(part.length).toBeLessThanOrEqual(1024 * 1024); return part; });
      expect(Buffer.concat(sent).equals(bytes)).toBe(true);
      expect(http.patch.mock.calls[0][1].data.attributes.sourceFileChecksums.file.hash).toBe(createHash('md5').update(bytes).digest('hex'));
    });
  });

  it('refuses a range larger than one bounded part before reading it', async () => {
    await withFile('', async (path) => {
      const file = await open(path, 'r+'); try { await file.truncate(65 * 1024 * 1024); } finally { await file.close(); }
      const http = fileHttp('background_asset_file', { empty: true });
      const result: any = await executeMediaTool('media__upload', { app: 'Example', target: 'background_asset_file', page_id: 'parent', file_path: path, asset_type: 'ASSET' }, { http: http as any });
      expect(result).toMatchObject({ ok: false, failedPhase: 'upload', orphanReservationId: 'new' });
      expect(result.error).toContain('holds at most');
      expect(result.note).toContain('Apple reserved file new');
      expect(http.uploadAssetPart).not.toHaveBeenCalled(); expect(http.patch).not.toHaveBeenCalled();
    });
  });

  it('refuses an oversized no-DELETE single slot before reservation', async () => {
    await withFile('', async (path) => {
      const file = await open(path, 'r+'); try { await file.truncate(65 * 1024 * 1024); } finally { await file.close(); }
      const http = fileHttp('encryption_document', { empty: true });
      await expect(executeMediaTool('media__upload', { app: 'Example', target: 'encryption_document', page_id: 'parent', file_path: path }, { http: http as any })).rejects.toThrow('nothing was reserved');
      expect(http.post).not.toHaveBeenCalled(); expect(http.uploadAssetPart).not.toHaveBeenCalled();
    });
  });

  it('reports the file reservation ID after a post-reservation upload abort', async () => {
    await withFile('%PDF-1.7\n', async (path) => {
      const http = fileHttp('encryption_document', { empty: true });
      http.uploadAssetPart.mockRejectedValue(new Error('delivery failed'));
      const result: any = await executeMediaTool('media__upload', { app: 'Example', target: 'encryption_document', page_id: 'parent', file_path: path }, { http: http as any });
      expect(result).toMatchObject({ ok: false, failedPhase: 'upload', orphanReservationId: 'new' });
      expect(result.note).toContain('Apple reserved file new');
      expect(http.patch).not.toHaveBeenCalled();
    });
  });

  it('does not commit when the file changes while its parts are sent', async () => {
    await withFile(Buffer.alloc(2 * 1024 * 1024, 1), async (path) => {
      const http = fileHttp('background_asset_file', { empty: true });
      http.post.mockImplementation(async (_p: string, body: any) => ({ data: { id: 'new', attributes: { uploadOperations: ranges(body.data.attributes.fileSize, 1024 * 1024) } } }));
      http.uploadAssetPart.mockImplementationOnce(async () => { await writeFile(path, Buffer.alloc(2 * 1024 * 1024, 2)); });
      const result: any = await executeMediaTool('media__upload', { app: 'Example', target: 'background_asset_file', page_id: 'parent', file_path: path, asset_type: 'ASSET' }, { http: http as any });
      expect(result).toMatchObject({ ok: false, failedPhase: 'upload' });
      expect(result.error).toMatch(/changed|shrank/);
      expect(http.patch).not.toHaveBeenCalled();
    });
  });

  it('refuses content that changed between confirmation and execution', async () => {
    await withFile(Buffer.alloc(64, 1), async (path) => {
      const http = fileHttp('background_asset_file', { empty: true });
      const args = { app: 'Example', target: 'background_asset_file', page_id: 'parent', file_path: path, asset_type: 'ASSET' };
      const preview = await buildMediaPreview('media__upload', args, http as any);
      await writeFile(path, Buffer.alloc(64, 2));
      await expect(executeMediaTool('media__upload', args, { http: http as any, approvedPlanFingerprint: preview.planFingerprint })).rejects.toThrow('changed since confirmation');
      expect(http.post).not.toHaveBeenCalled();
    });
  });

  it.each([
    ['﻿' + GEOJSON, 'a UTF-8 BOM'],
    ['{"type":"Feature","geometry":{"type":"MultiPolygon","coordinates":[[[[0,0],[1,0],[1,1],[0,0]]]]}}', 'no properties member'],
    ['{"type":"MultiPolygon","coordinates":[[[[10,10],[11,10],[11,11],[10,11],[10,10]],[[10.2,10.2],[10.4,10.2],[10.4,10.4],[10.2,10.2]]]]}', 'a polygon with a hole'],
  ])('accepts routing coverage with %#: %s', async (content) => {
    await withFile(content, async (path) => {
      const http = fileHttp('routing_coverage', { empty: true });
      expect((await executeMediaTool('media__upload', { app: 'Example', target: 'routing_coverage', page_id: 'parent', file_path: path }, { http: http as any }) as any).ok).toBe(true);
    });
  });

  it('gives routing coverage its own small limit before parsing', async () => {
    await withFile('', async (path) => {
      const file = await open(path, 'r+'); try { await file.truncate(4 * 1024 * 1024 + 1); } finally { await file.close(); }
      const http = fileHttp('routing_coverage', { empty: true });
      await expect(executeMediaTool('media__upload', { app: 'Example', target: 'routing_coverage', page_id: 'parent', file_path: path }, { http: http as any })).rejects.toThrow(`1–${4 * 1024 * 1024} bytes`);
      expect(http.get).not.toHaveBeenCalled();
    });
  });

  it.each([
    ['﻿<?xml version="1.0" encoding="UTF-8"?>\n<!-- generated -->\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<!-- body -->\n<dict><key>a</key><string>b</string></dict>\n</plist>\n<!-- end -->\n', true],
    ['<plist version="1.0"><dict/></plist>', true],
    ['<plist version="1.0"><dict><key>a</key>', false],
    ['<plist/>', false],
    ['<?xml version="1.0"?><html><body/></html>', false],
    ['<plist version="1.0">text</plist>', false],
    ['garbage <plist><dict/></plist>', false],
  ])('frames XML property list %#', async (content, ok) => {
    await withFile(content, async (path) => {
      const http = fileHttp('build_upload_file');
      const run = executeMediaTool('media__upload', { app: 'Example', target: 'build_upload_file', page_id: 'parent', file_path: path, asset_type: 'ASSET_DESCRIPTION', uti: 'com.apple.xml-property-list' }, { http: http as any });
      if (ok) expect((await run as any).ok).toBe(true);
      else { await expect(run).rejects.toThrow('XML plist'); expect(http.get).not.toHaveBeenCalled(); }
    });
  });
});
