import { describe, expect, it, vi } from 'vitest';
import { mkdtemp, open, rm, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { MACRO_COVERED, PROFILES } from '../src/profiles.js';
import { PAGE_TARGETS, FILE_TARGETS, mediaOperation, mediaDataSchema, type FileTarget } from '../src/tools/media-catalog.js';
import { buildMediaPreview, executeMediaTool, mediaRisk } from '../src/tools/screenshots.js';

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
    const uploadedOnly = new Set([
      'game_center_achievement_images_v2', 'game_center_leaderboard_images_v2',
      'game_center_leaderboard_set_images_v2', 'game_center_activity_images',
      'game_center_challenge_images', 'in_app_purchase_images_v2', 'subscription_images_v2',
    ]);
    const fileOperations = Object.values(FILE_TARGETS).flatMap((adapter) => [adapter.get, adapter.read, adapter.create, adapter.delete,
      ...(uploadedOnly.has(adapter.create.split('.')[0]) ? [adapter.update] : []),
    ].filter(Boolean));
    fileOperations.push('build_uploads.create', 'build_uploads.delete');
    expect(new Set([...COVERAGE.flatMap((row) => row.operations), ...fileOperations])).toEqual(new Set(Object.keys(MACRO_COVERED)));

    const retained = PROFILES.flatMap((p) => p.subProfiles.flatMap((s) => s.operations));
    for (const [target, adapter] of Object.entries(FILE_TARGETS)) {
      if (uploadedOnly.has(adapter.create.split('.')[0])) {
        expect(retained).not.toContain(adapter.update);
        expect(MACRO_COVERED[adapter.update]).toBe('media__upload');
      } else {
        expect(retained, `${adapter.update} must remain for checksum edits`).toContain(adapter.update);
        expect(MACRO_COVERED).not.toHaveProperty(adapter.update);
      }
      expect(retained).not.toContain(adapter.create);
      if (adapter.delete) expect(retained).not.toContain(adapter.delete);
      for (const operation of [adapter.get, adapter.read].filter(Boolean) as string[]) {
        expect(retained).not.toContain(operation);
        expect(FILE_COVERAGE.find((cell) => cell.target === target && cell.action === 'list')?.operations).toContain(operation);
      }
    }
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

const FILE_COVERAGE: Coverage[] = Object.entries(FILE_TARGETS).flatMap(([target, adapter]) => [
  { target, action: 'list', macro: 'media__list', operations: [adapter.parentGet, adapter.get, ...(adapter.read ? [adapter.read] : [])] },
  { target, action: 'upload', macro: 'media__upload', operations: [adapter.create, adapter.update, ...(adapter.attach ? [adapter.attach] : [])] },
  ...(adapter.delete || target === 'build_upload_file' ? [{ target, action: 'delete', macro: 'media__delete', operations: [adapter.delete ?? 'build_uploads.delete'] }] : []),
]);

const appleSpec = JSON.parse(readFileSync(new URL('../spec/openapi.json', import.meta.url), 'utf8'));
const pathFor = (operation: string, id?: string) => mediaOperation(operation).path.replace('{id}', id ?? '');
const PNG = Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a,1,2,3,4]);

function fileHttp(target: FileTarget) {
  const adapter = FILE_TARGETS[target];
  const link = (id: string) => ({ data: { id } });
  const parent = { id: 'parent', attributes: { name: 'Owner', locale: 'en-US' }, relationships: {
    // Build/background collections have links only, with no include option.
    ...(adapter.read ? {} : { [adapter.files]: link('file1') }),
    ...(adapter.chain[0] ? { [adapter.chain[0].via]: link(adapter.chain[0].get === 'apps.get' ? 'app' : 'owner0') } : {}),
  } };
  const chain = adapter.chain.filter((step) => step.get !== 'apps.get').map((step, i) => ({
    operation: step.get, id: `owner${i}`, row: { id: `owner${i}`, relationships: adapter.chain[i + 1] ? {
      [adapter.chain[i + 1].via]: link(adapter.chain[i + 1].get === 'apps.get' ? 'app' : `owner${i + 1}`),
    } : {} },
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
  const http = {
    get: vi.fn(async (path: string, query?: any): Promise<any> => {
      if (path === '/v1/apps') return { data: [{ id: 'app', attributes: { name: 'Example', bundleId: 'example.app' } }] };
      if (path === pathFor(adapter.parentGet, 'parent')) return { data: select(adapter.parentGet, parent, query) };
      if (path === pathFor(adapter.get, 'file1')) return { data: file };
      if (adapter.read && path === pathFor(adapter.read, 'parent')) return { data: adapter.read.endsWith('.list') ? [file] : file };
      const next = chain.find((item) => path === pathFor(item.operation, item.id));
      if (next) return { data: select(next.operation, next.row, query) };
      if (adapter.appList && path === pathFor(adapter.appList, 'app')) return { data: [{ id: adapter.chain.length ? `owner${chain.length - 1}` : 'parent' }] };
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
  it.each(FILE_COVERAGE)('executes $target/$action through $macro with include-only relationships', async (cell) => {
    const adapter = FILE_TARGETS[cell.target as FileTarget];
    const http = fileHttp(cell.target as FileTarget);
    const args: Record<string, unknown> = { app: 'Example', target: cell.target, page_id: 'parent' };
    let directory: string | undefined;
    try {
      if (cell.action === 'upload') {
        directory = await mkdtemp(join(tmpdir(), 'heimdall-file-coverage-'));
        const bytes = adapter.format === 'image' ? Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a,1,2,3,4])
          : adapter.format === 'document' ? Buffer.from('%PDF-1.7\n')
          : adapter.format === 'geojson' ? Buffer.from('{"type":"MultiPolygon","coordinates":[]}')
          : adapter.format === 'build' ? Buffer.from([0x50,0x4b,0x03,0x04,1,2,3,4]) : Buffer.from('arbitrary allowed file');
        const filePath = join(directory, 'upload.bin'); await writeFile(filePath, bytes);
        Object.assign(args, { file_path: filePath, ...(adapter.format === 'asset' || adapter.format === 'build' ? { asset_type: 'ASSET' } : {}),
          ...(adapter.format === 'build' ? { uti: 'com.apple.ipa' } : {}) });
      }
      if (cell.action === 'delete' && cell.target !== 'build_upload_file') args.file_ids = ['file1'];
      const preview = cell.action !== 'list' ? await buildMediaPreview(cell.macro, args, http as any) : undefined;
      if (preview) {
        expect(preview.message).toContain('Owner, en-US');
        expect(preview.message).toContain('Existing file');
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
      if (cell.action === 'upload') {
        expect(http.uploadAssetPart).toHaveBeenCalledOnce();
        const bytes = http.uploadAssetPart.mock.calls[0][1];
        const attributes = http.patch.mock.calls[0][1].data.attributes;
        const schema = mediaDataSchema(adapter.update).properties.attributes.properties;
        if (schema.sourceFileChecksums) expect(attributes.sourceFileChecksums).toEqual({ file: { algorithm: 'SHA_256', hash: createHash('sha256').update(bytes).digest('hex') } });
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
    ['routing_coverage', 'low'], ['background_asset_file', 'low'], ['build_upload_file', 'low'],
  ])('classifies %s upload as %s and delete as destructive', (target, risk) => {
    expect(mediaRisk('media__upload', { target })).toBe(risk);
    if (FILE_TARGETS[target as keyof typeof FILE_TARGETS].delete || target === 'build_upload_file') expect(mediaRisk('media__delete', { target })).toBe('destructive');
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
        ...(target === 'build_upload_file' ? { uti: 'com.apple.ipa' } : {}),
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
      await writeFile(filePath, adapter.format === 'image' ? PNG : adapter.format === 'geojson' ? '{"type":"MultiPolygon","coordinates":[]}' : adapter.format === 'build' ? Buffer.from([0x50,0x4b,0x03,0x04]) : 'file');
      const args = { app: 'Example', target, page_id: 'parent', file_path: filePath, asset_type: 'ASSET', uti: 'com.apple.ipa' };
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
        if (path === pathFor(adapter.get, 'file1')) result.data.attributes.fileName = 'Changed file';
        return result;
      });
      await expect(executeMediaTool(macro, input, { http: http as any, approvedPlanFingerprint: preview.planFingerprint })).rejects.toThrow('changed since confirmation');
      expect(http.post).not.toHaveBeenCalled(); expect(http.patch).not.toHaveBeenCalled(); expect(http.delete).not.toHaveBeenCalled();
    } finally { await rm(directory, { recursive: true, force: true }); }
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
      const http = fileHttp(target), args = { app: 'Example', target, page_id: 'parent' };
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

  it.each(['{"type":"Polygon"}', '{"type":"FeatureCollection","features":[{}]}', '{"type":"Polygon","coordinates":[[[0,0],[1,0],[1,1],[2,2]]]}'])('refuses malformed GeoJSON structure %s', async (content) => {
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
