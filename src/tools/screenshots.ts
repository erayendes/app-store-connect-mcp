/** Library-backed media macros: resolve once, verify ownership, then write. */
import { createHash } from 'node:crypto';
import { constants } from 'node:fs';
import { open, stat } from 'node:fs/promises';
import { basename, isAbsolute } from 'node:path';
import type { McpToolDefinition } from '../core/registry.js';
import type { AscHttpClient, Query } from '../core/http.js';
import { AscApiError } from '../core/errors.js';
import { resolveApp } from '../core/resolve-app.js';
import { REVERSIBILITY, STRONG_CONFIRM_LEVELS, type RiskLevel } from '../core/risk.js';
import { pickVersion, readAppStoreVersions, PLATFORMS, EDITABLE_STATES } from './preflight.js';
import {
  MEDIA_NAMES, MEDIA_OPS, MEDIA_ASSETS, MEDIA_TARGETS, MEDIA_CATEGORIES, MEDIA_PLACEMENT_TYPES,
  mediaBody, mediaDataSchema, mediaPath, mediaRelationship, type MediaKind, type PageTarget,
} from './media-catalog.js';

const MAX_ITEMS = 50;
const MAX_IMAGE_BYTES = 50 * 1024 * 1024;
const MAX_VIDEO_BYTES = 500 * 1024 * 1024;
const textField = { type: 'string', minLength: 1 };
const idsField = { type: 'array', items: textField, minItems: 1, maxItems: MAX_ITEMS, uniqueItems: true };
const targetFields = {
  app: { ...textField, description: 'App name, bundle ID or Apple ID.' },
  target: { type: 'string', enum: ['library', ...Object.keys(MEDIA_TARGETS)], description: 'library, version page, custom product page (cpp), optimization treatment (ppo), or in-app event.' },
  page_id: { ...textField, description: 'Localization ID for cpp, ppo or event. For version use locale, or its localization ID.' },
  locale: { ...textField, description: 'Version locale, e.g. en-US. Omit on list to inspect all locales.' },
  version: { ...textField, description: 'Version string. Required if multiple versions match.' },
  platform: { type: 'string', enum: PLATFORMS, description: 'Required if multiple platforms match.' },
};
const placementFields = {
  placement_type: { type: 'string', enum: MEDIA_PLACEMENT_TYPES, description: 'Required to place; use media__list limits for allowed groups and sizes.' },
  placement_group: { ...textField, description: 'Device/group ID from reference data. Required for reorder.' },
};
const nullableText = { type: ['string', 'null'] };
const errorsSchema = { type: 'array', items: { type: 'string' } };
const placementSchema = {
  type: 'object', properties: {
    id: textField, assetId: nullableText, pageId: nullableText, target: nullableText,
    placementType: nullableText, placementGroup: nullableText, state: nullableText, errors: errorsSchema,
  }, required: ['id', 'assetId', 'pageId', 'target', 'placementType', 'placementGroup', 'state', 'errors'],
};
const assetSchema = {
  type: 'object', properties: {
    id: textField, kind: { type: 'string', enum: ['image', 'video'] }, name: textField,
    fileName: nullableText, state: nullableText, errors: errorsSchema,
    width: { type: ['number', 'null'] }, height: { type: ['number', 'null'] },
    placements: { type: 'array', items: placementSchema },
  }, required: ['id', 'kind', 'name', 'fileName', 'state', 'errors', 'width', 'height', 'placements'],
};

export const MEDIA_TOOLS: McpToolDefinition[] = [
  {
    name: MEDIA_NAMES.list,
    description: 'List library and page media with asset, placement and page IDs, groups, states, errors and Apple’s count/size limits.',
    inputSchema: { type: 'object', properties: { ...targetFields, asset_ids: { ...idsField, description: 'Optional library file IDs to inspect.' }, library_id: { ...textField, description: 'Optional library ID to verify against the app.' }, ref_data_id: { ...textField, description: 'Optional reference data ID.' } }, required: ['app', 'target'] },
    outputSchema: {
      type: 'object', properties: {
        app: textField, target: textField, libraryId: textField,
        assets: { type: 'array', items: assetSchema },
        pages: { type: 'array', items: { type: 'object', properties: {
          id: textField, target: textField, label: textField, locale: nullableText, state: nullableText,
          sets: { type: 'array', items: { type: 'object', properties: {
            kind: textField, placementType: nullableText, placementGroup: nullableText,
            count: { type: 'integer' }, placements: { type: 'array', items: placementSchema },
          }, required: ['kind', 'placementType', 'placementGroup', 'count', 'placements'] } },
        }, required: ['id', 'target', 'label', 'locale', 'state', 'sets'] } },
        limits: { type: 'array', description: 'Apple reference entries: placement policies with maxCount, group mappings, image/video specs with dimensions and maxFileSize.', items: { type: 'object', properties: {
          id: textField, features: { type: 'array', items: { type: 'object' } },
          placementTypes: { type: 'array', items: { type: 'object' } },
          placementProfileGroups: { type: 'array', items: { type: 'object' } },
          imageSpecs: { type: 'array', items: { type: 'object' } }, videoSpecs: { type: 'array', items: { type: 'object' } },
        }, required: ['id', 'features', 'placementTypes', 'placementProfileGroups', 'imageSpecs', 'videoSpecs'] } },
      }, required: ['app', 'target', 'libraryId', 'assets', 'pages', 'limits'],
    },
    annotations: { readOnlyHint: true, idempotentHint: true },
  },
  {
    name: MEDIA_NAMES.upload,
    description: 'Upload a PNG/JPEG image or MP4/MOV video: reserve, send bytes, commit to the app’s library. A page target also places it there. Returns processing/review state and any placement failure. PUBLIC-level write on a page; library-only upload is low risk.',
    inputSchema: { type: 'object', properties: {
      ...targetFields, ...placementFields,
      file_path: { ...textField, description: 'Absolute local file path. Regular files only; image limit 50 MiB, video 500 MiB.' },
      category: { type: 'string', enum: MEDIA_CATEGORIES }, reference_name: textField,
      preview_frame_time_code: { ...textField, description: 'Video poster frame, e.g. 00:00:05:00.' },
    }, required: ['app', 'target', 'file_path', 'category'] },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  },
  {
    name: MEDIA_NAMES.arrange,
    description: 'Place, reorder or remove page media; set video posters, rename or archive files. Remove needs a named page; library reorder infers its page. Events have no order. Remove/archive are DESTRUCTIVE-level writes with file and page previews.',
    inputSchema: { type: 'object', properties: {
      ...targetFields, ...placementFields,
      action: { type: 'string', enum: ['reorder', 'place', 'remove', 'poster', 'archive', 'rename'] },
      asset_ids: { ...idsField, description: 'Library file IDs for place, poster, archive or rename. Page targets verify the files are placed there, except place.' },
      placement_ids: { ...idsField, description: 'Placement IDs for remove or reorder; reorder supplies the complete group in desired order.' },
      reference_name: { ...textField, description: 'Rename one file.' }, preview_frame_time_code: textField,
      archived: { type: 'boolean', description: 'Archive action; defaults to true. False restores the file.' },
    }, required: ['app', 'target', 'action'] },
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false },
  },
  {
    name: MEDIA_NAMES.delete,
    description: 'Delete images or videos from an app’s asset library, or remove placements from a named page. Verifies every item belongs to the app/page before deleting any; previews file names and reports partial success. At most 50 items. DESTRUCTIVE-level write.',
    inputSchema: { type: 'object', properties: {
      ...targetFields, asset_ids: { ...idsField, description: 'Library target: file IDs to permanently delete.' },
      placement_ids: { ...idsField, description: 'Page target: placement IDs to remove; the files remain in the library.' },
    }, required: ['app', 'target'] },
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false },
  },
];
export const MEDIA_TOOL_NAMES = new Set(MEDIA_TOOLS.map((t) => t.name));

export interface MediaContext { http: AscHttpClient; dryRun?: boolean; approvedPlanFingerprint?: string }
type Args = Record<string, unknown>;
type Row = any;
interface Page { target: PageTarget; id: string; label: string; locale: string | null; state: string | null }
interface Target { app: { id: string; name: string }; libraryId: string; target: 'library' | PageTarget; pages: Page[] }
interface File { id: string; kind: MediaKind; name: string; row: Row; placements: Row[] }
interface Write { operation: string; id?: string; body?: unknown; name: string }
interface Plan { target: Target; action: MediaAction; files: File[]; writes: Write[]; risk: RiskLevel; fingerprint: string; upload?: { bytes: Buffer; kind: MediaKind; fileName: string } }
const fail = (message: string): never => { throw new AscApiError(message, 0); };
const str = (args: Args, key: string, required = false): string | undefined => {
  const value = args[key];
  if (value === undefined && !required) return undefined;
  if (typeof value !== 'string' || !value.trim()) fail(`"${key}" must be a non-empty string.`);
  return (value as string).trim();
};
const relId = (row: Row, key: string): string => row?.relationships?.[key]?.data?.id || fail(`Missing ${key} relationship; cannot verify ownership.`);
const arrayIds = (args: Args, key: string, required = true): string[] => {
  if (args[key] === undefined && !required) return [];
  const value = args[key];
  if (!Array.isArray(value) || !value.length || value.length > MAX_ITEMS || value.some((v) => typeof v !== 'string' || !v.trim())) fail(`"${key}" needs 1–${MAX_ITEMS} non-empty IDs.`);
  const ids = (value as string[]).map((v) => v.trim());
  if (new Set(ids).size !== ids.length) fail(`"${key}" contains duplicate IDs.`);
  return ids;
};

/** Bounded pagination fails closed: partial data cannot establish ownership or order. */
export async function readMediaRows(http: AscHttpClient, operation: string, id?: string, query: Query = {}) {
  let next: string | undefined = mediaPath(operation, id);
  const seen = new Set<string>(), rows = new Map<string, Row>(), included = new Map<string, Row>();
  let total = 0;
  for (let page = 0; next && page < 10; page++) {
    if (seen.has(next)) fail(`Truncated ${operation}: repeated cursor.`);
    seen.add(next);
    const res: any = await http.get(next, page === 0 ? query : undefined);
    if (!Array.isArray(res?.data)) fail(`Missing list response for ${operation}; refusing to choose.`);
    for (const row of res.data) rows.set(row.id, row);
    for (const row of res.included ?? []) included.set(`${row.type}/${row.id}`, row);
    total = Math.max(total, Number(res.meta?.paging?.total ?? 0));
    next = res.links?.next || undefined;
  }
  if (next || total > rows.size) fail(`Truncated ${operation} after at most 10 pages; refusing to choose.`);
  return { rows: [...rows.values()], included: [...included.values()] };
}
async function getRow(http: AscHttpClient, operation: string, id: string, query?: Query): Promise<Row> {
  const res: any = await http.get(mediaPath(operation, id), query);
  if (!res?.data?.id || res.data.id !== id) fail(`Missing ${operation} ${id}; cannot verify ownership.`);
  return res.data;
}

/** A localization ID is not proof that it belongs to the named app. */
async function resolvePage(http: AscHttpClient, app: Target['app'], target: PageTarget, id: string): Promise<Page> {
  const adapter = MEDIA_TARGETS[target];
  const loc = await getRow(http, adapter.get, id, { include: target === 'cpp' ? 'appCustomProductPageVersion' : target === 'ppo' ? 'appStoreVersionExperimentTreatment' : target === 'event' ? 'appEvent' : 'appStoreVersion' });
  let parent: Row, label: string, owner: string;
  if (target === 'cpp') {
    const version = await getRow(http, 'app_custom_product_page_versions.get', relId(loc, 'appCustomProductPageVersion'), { include: 'appCustomProductPage' });
    parent = await getRow(http, 'app_custom_product_pages.get', relId(version, 'appCustomProductPage'), { include: 'app' });
    owner = relId(parent, 'app');
    label = `CPP ${parent.attributes?.name ?? parent.id}, version ${version.attributes?.version ?? version.id}`;
    parent = version;
  } else if (target === 'ppo') {
    const treatment = await getRow(http, 'app_store_version_experiment_treatments.get', relId(loc, 'appStoreVersionExperimentTreatment'), { include: 'appStoreVersionExperiment,appStoreVersionExperimentV2' });
    const v2 = treatment.relationships?.appStoreVersionExperimentV2?.data?.id;
    parent = await getRow(http, v2 ? 'app_store_version_experiments_v2.get' : 'app_store_version_experiments.get', v2 ?? relId(treatment, 'appStoreVersionExperiment'), { include: v2 ? 'app' : 'appStoreVersion' });
    owner = v2 ? relId(parent, 'app') : relId(await getRow(http, 'app_store_versions.get', relId(parent, 'appStoreVersion'), { include: 'app' }), 'app');
    label = `PPO ${parent.attributes?.name ?? parent.id}, treatment ${treatment.attributes?.name ?? treatment.id}`;
  } else if (target === 'event') {
    const eventId = relId(loc, 'appEvent');
    const events = await readMediaRows(http, 'apps.app_events.list', app.id, { 'filter[id]': eventId, limit: 200 });
    parent = events.rows.find((e) => e.id === eventId) ?? fail(`Event ${eventId} does not belong to ${app.name}.`);
    owner = app.id;
    label = `event ${parent.attributes?.referenceName ?? eventId}`;
  } else {
    parent = await getRow(http, 'app_store_versions.get', relId(loc, 'appStoreVersion'), { include: 'app' });
    owner = relId(parent, 'app');
    label = `${parent.attributes?.platform ?? ''} version ${parent.attributes?.versionString ?? parent.id}`;
  }
  if (owner !== app.id) fail(`Page ${id} does not belong to ${app.name}. Nothing was changed.`);
  return { target, id, label: `${label}, ${loc.attributes?.locale ?? id}`, locale: loc.attributes?.locale ?? null, state: parent.attributes?.appStoreState ?? parent.attributes?.eventState ?? parent.attributes?.state ?? null };
}

async function resolveTarget(args: Args, http: AscHttpClient, single: boolean): Promise<Target> {
  const appName = str(args, 'app', true)!;
  const target = str(args, 'target', true)! as Target['target'];
  if (target !== 'library' && !Object.hasOwn(MEDIA_TARGETS, target)) fail(`Unknown media target: ${target}.`);
  const pageId = str(args, 'page_id'), locale = str(args, 'locale'), version = str(args, 'version'), platform = str(args, 'platform');
  if (platform && !PLATFORMS.includes(platform)) fail(`Unknown platform: ${platform}.`);
  if (target === 'library' && (pageId || locale || version || platform)) fail('A library target cannot carry page selectors. Choose a page target to place a library file.');
  if (target !== 'library' && target !== 'version' && (locale || version || platform)) fail('For cpp, ppo and event, use page_id (localization ID) only.');
  if (pageId && (locale || version || platform)) fail('Use page_id or version/platform/locale, not both.');
  if (target !== 'library' && target !== 'version' && !pageId) fail('"page_id" (localization ID) is required for this target.');
  const app = await resolveApp(http, appName);
  const library: any = await http.get(mediaPath(MEDIA_OPS.library, app.id));
  const libraryId: string = library?.data?.id ?? fail(`${app.name} has no asset library.`);
  const pages: Page[] = [];
  if (target !== 'library' && pageId) pages.push(await resolvePage(http, app, target, pageId));
  else if (target === 'version') {
    const versions = await readAppStoreVersions(http, app.id, version, platform);
    const chosen = pickVersion(app.name, versions.data, version, platform);
    const onPlatform = versions.data.filter((v) => !platform || v.attributes?.platform === platform);
    const matches = version ? onPlatform.filter((v) => v.attributes?.versionString === version) : onPlatform.filter((v) => EDITABLE_STATES.has(v.attributes?.appStoreState));
    if ((matches.length ? matches : onPlatform).length > 1) fail(`Ambiguous version on ${app.name}; specify version and platform, or page_id.`);
    const locs = await readMediaRows(http, 'app_store_versions.app_store_version_localizations.list', chosen.id, { 'fields[appStoreVersionLocalizations]': 'locale', limit: 200 });
    const found = locs.rows.filter((l) => !locale || l.attributes?.locale?.toLowerCase() === locale.toLowerCase());
    if (locale && found.length !== 1) fail(`No unique "${locale}" localization on version ${chosen.attributes?.versionString}.`);
    for (const loc of found) pages.push({ target, id: loc.id, locale: loc.attributes?.locale ?? null, state: chosen.attributes?.appStoreState ?? null, label: `${chosen.attributes?.platform} version ${chosen.attributes?.versionString}, ${loc.attributes?.locale ?? loc.id}` });
  }
  if (single && target !== 'library' && pages.length !== 1) fail('Choose exactly one page using locale or page_id.');
  return { app, libraryId, target, pages };
}

async function libraryFiles(http: AscHttpClient, target: Target, ids: string[] = [], withPlacements = false): Promise<File[]> {
  const files: File[] = [];
  for (const kind of ['image', 'video'] as const) {
    const res = await readMediaRows(http, MEDIA_ASSETS[kind].list, target.libraryId, { ...(ids.length ? { 'filter[id]': ids.join(',') } : {}), limit: 200 });
    for (const row of res.rows) {
      if (ids.length && !ids.includes(row.id)) continue;
      files.push({ id: row.id, kind, row, name: row.attributes?.referenceName || row.attributes?.fileName || row.id, placements: [] });
    }
  }
  for (const id of ids) if (files.filter((f) => f.id === id).length !== 1) fail(`File ${id} is not uniquely in ${target.app.name}’s asset library. Nothing was changed.`);
  const selected = ids.length ? ids.map((id) => files.find((f) => f.id === id)!) : files;
  if (withPlacements) {
    if (selected.length > 200) fail('More than 200 library files; filter asset_ids to inspect complete placement lists.');
    for (let start = 0; start < selected.length; start += 10) {
      await Promise.all(selected.slice(start, start + 10).map(async (file) => {
        const res = await readMediaRows(http, MEDIA_ASSETS[file.kind].placements, file.id, { include: `image,video,${PLACEMENT_INCLUDES}`, limit: 200 });
        if (res.rows.length > 200) fail(`More than 200 placements for ${file.name}; refusing an incomplete preview.`);
        file.placements = res.rows;
      }));
    }
  }
  return selected;
}
const placementPage = (row: Row) => Object.entries(MEDIA_TARGETS).find(([, t]) => row.relationships?.[t.relationship]?.data?.id);
const placementAsset = (row: Row) => row.relationships?.image?.data?.id ?? row.relationships?.video?.data?.id;
const PLACEMENT_INCLUDES = Object.values(MEDIA_TARGETS).map((t) => t.relationship).join(',');
async function populatePlacementPages(http: AscHttpClient, target: Target, files: File[]) {
  const count = files.reduce((sum, f) => sum + f.placements.length, 0);
  if (count > 200) fail('More than 200 placements; refusing an incomplete page preview. Filter asset_ids.');
  const seen = new Map<string, Page>(target.pages.map((page) => [`${page.target}/${page.id}`, page]));
  for (const file of files) {
    for (const row of file.placements) {
      if (!placementPage(row) || !placementAsset(row)) fail(`Placement ${row.id} has no supported page or asset; refusing to infer ownership.`);
      if (placementAsset(row) !== file.id) fail(`Placement ${row.id} is not for ${file.name}. Nothing was changed.`);
      const found = placementPage(row)!;
      const pageId = relId(row, found[1].relationship);
      const key = `${found[0]}/${pageId}`;
      if (!seen.has(key)) seen.set(key, await resolvePage(http, target.app, found[0] as PageTarget, pageId));
    }
  }
  target.pages = [...seen.values()];
}
async function pagePlacements(http: AscHttpClient, page: Page) {
  return readMediaRows(http, MEDIA_TARGETS[page.target].placements, page.id, { include: 'image,video', ...(MEDIA_TARGETS[page.target].ordered ? { sort: 'placementGroupPosition' } : {}), limit: 200 });
}
const errorsOf = (row: Row): string[] => (row.attributes?.stateDetails ?? row.attributes?.assetDeliveryState?.errors ?? []).map((e: any) => [e.code, e.description ?? e.detail].filter(Boolean).join(': '));
const showPlacement = (row: Row, page?: Page) => {
  const found = placementPage(row);
  return { id: String(row.id), assetId: placementAsset(row) ?? null, pageId: page?.id ?? (found ? row.relationships[found[1].relationship].data.id : null), target: page?.target ?? found?.[0] ?? null, placementType: row.attributes?.placementType ?? null, placementGroup: row.attributes?.placementGroup ?? null, state: row.attributes?.state ?? null, errors: errorsOf(row) };
};
const showFile = (file: File) => {
  const a = file.row.attributes ?? {}, dimensions = a.imageAsset ?? a.videoAsset ?? {};
  return { id: file.id, kind: file.kind, name: file.name, fileName: a.fileName ?? null, state: a.state ?? null, errors: errorsOf(file.row), width: dimensions.width ?? null, height: dimensions.height ?? null, placements: file.placements.map((p) => showPlacement(p)) };
};

async function listMedia(args: Args, http: AscHttpClient) {
  const target = await resolveTarget(args, http, false);
  const ids = arrayIds(args, 'asset_ids', false);
  const libraryId = str(args, 'library_id');
  const refDataId = str(args, 'ref_data_id');
  if (libraryId && libraryId !== target.libraryId) fail(`Library ${libraryId} does not belong to ${target.app.name}.`);
  if (libraryId) await getRow(http, MEDIA_OPS.libraryGet, libraryId);
  if (ids.length && target.target !== 'library') fail('asset_ids filters the library only.');
  const files: File[] = [], pages = [];
  if (target.target === 'library') {
    files.push(...await libraryFiles(http, target, ids, true));
    await populatePlacementPages(http, target, files);
  } else {
    for (const page of target.pages) {
      const res = await pagePlacements(http, page);
      const sets = new Map<string, { kind: string; placementType: string | null; placementGroup: string | null; count: number; placements: ReturnType<typeof showPlacement>[] }>();
      for (const p of res.rows) {
        const kind: MediaKind = p.relationships?.video?.data ? 'video' : 'image';
        const assetId = placementAsset(p) ?? fail(`Placement ${p.id} has no asset relationship.`);
        let file = files.find((f) => f.id === assetId && f.kind === kind);
        if (!file) {
          const type = mediaDataSchema(MEDIA_ASSETS[kind].create).properties.type.enum[0];
          const row = res.included.find((r) => r.id === assetId && r.type === type) ?? await getRow(http, MEDIA_ASSETS[kind].get, assetId);
          file = { id: assetId, kind, row, name: row.attributes?.referenceName || row.attributes?.fileName || assetId, placements: [] };
          files.push(file);
        }
        const enriched = { ...p, relationships: { ...p.relationships, [MEDIA_TARGETS[page.target].relationship]: { data: { id: page.id } } } };
        file.placements.push(enriched);
        const shaped = showPlacement(p, page);
        const key = JSON.stringify([kind, shaped.placementType, shaped.placementGroup]);
        if (!sets.has(key)) sets.set(key, { kind, placementType: shaped.placementType, placementGroup: shaped.placementGroup, count: 0, placements: [] });
        const set = sets.get(key)!; set.count++; set.placements.push(shaped);
      }
      pages.push({ ...page, sets: [...sets.values()] });
    }
  }
  const refs = refDataId ? { rows: [await getRow(http, MEDIA_OPS.referenceGet, refDataId)] } : await readMediaRows(http, MEDIA_OPS.reference, undefined, { 'fields[appAssetLibraryRefData]': 'features,placementTypes,placementProfileGroups,imageSpecs,videoSpecs' });
  return { app: `${target.app.name} (${target.app.id})`, target: target.target, libraryId: target.libraryId, assets: files.map(showFile), pages: target.target === 'library' ? target.pages.map((p) => ({ ...p, sets: [] })) : pages, limits: refs.rows.map((r) => ({ id: r.id, ...Object.fromEntries(['features', 'placementTypes', 'placementProfileGroups', 'imageSpecs', 'videoSpecs'].map((k) => [k, r.attributes?.[k] ?? []])) })) };
}

/** Stat before reading, then fstat + bounded reads from that same descriptor.
 * O_NONBLOCK prevents a swapped FIFO from hanging open; fstat rejects it. */
async function readUpload(filePath: string): Promise<{ bytes: Buffer; kind: MediaKind; fileName: string }> {
  if (!isAbsolute(filePath)) fail('file_path must be absolute.');
  const check = (s: NonNullable<Awaited<ReturnType<typeof stat>>>) => {
    if (!s.isFile()) fail('Upload requires a regular file.');
    if (s.size < 1 || s.size > MAX_VIDEO_BYTES) fail(`File size must be 1–${MAX_VIDEO_BYTES} bytes.`);
  };
  const before = await stat(filePath); check(before);
  const fd = await open(filePath, constants.O_RDONLY | constants.O_NONBLOCK);
  try {
    const info = await fd.stat(); check(info);
    if (info.dev !== before.dev || info.ino !== before.ino) fail('File changed before opening; retry.');
    const head = Buffer.alloc(12);
    const { bytesRead } = await fd.read(head, 0, head.length, 0);
    const brand = bytesRead >= 12 && head.subarray(4, 8).toString('latin1') === 'ftyp' ? head.subarray(8, 12).toString('latin1') : '';
    const video = ['qt  ', 'isom', 'iso2', 'mp41', 'mp42', 'avc1', 'M4V '].includes(brand);
    const image = (bytesRead >= 8 && head.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) || (bytesRead >= 4 && head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff && head[3] !== 0xff && head[3] !== 0x00);
    if (!video && !image) fail('File is not a PNG, JPEG, MP4 or MOV; no bytes were sent.');
    if (!video && info.size > MAX_IMAGE_BYTES) fail(`Image exceeds the ${MAX_IMAGE_BYTES}-byte limit.`);
    const bytes = Buffer.alloc(info.size);
    for (let offset = 0; offset < bytes.length;) {
      const read = await fd.read(bytes, offset, Math.min(1024 * 1024, bytes.length - offset), offset);
      if (!read.bytesRead) fail('File shrank during read; retry.');
      offset += read.bytesRead;
    }
    const after = await fd.stat();
    if (after.size !== info.size || after.mtimeMs !== info.mtimeMs || after.ctimeMs !== info.ctimeMs || !bytes.subarray(0, Math.min(12, bytes.length)).equals(head.subarray(0, Math.min(12, bytes.length)))) fail('File changed during read; retry.');
    return { bytes, kind: video ? 'video' : 'image', fileName: basename(filePath) };
  } finally { await fd.close(); }
}

const ARRANGE_ACTIONS = ['reorder', 'place', 'remove', 'poster', 'archive', 'rename'] as const;
type MediaAction = typeof ARRANGE_ACTIONS[number] | 'delete' | 'upload';
function mediaIntent(name: string, args: Args): { target: Target['target']; action: MediaAction } {
  if (!MEDIA_TOOL_NAMES.has(name) || name === MEDIA_NAMES.list) fail(`Unknown media write tool: ${name}`);
  const target = str(args, 'target', true)!;
  if (target !== 'library' && !Object.hasOwn(MEDIA_TARGETS, target)) fail(`Unknown media target: ${target}.`);
  const action = name === MEDIA_NAMES.upload ? 'upload' : name === MEDIA_NAMES.delete ? (target === 'library' ? 'delete' : 'remove') : str(args, 'action', true)!;
  if (name === MEDIA_NAMES.arrange && !ARRANGE_ACTIONS.includes(action as typeof ARRANGE_ACTIONS[number])) fail(`Unknown media action: ${action}.`);
  if (name === MEDIA_NAMES.arrange && action === 'remove' && target === 'library') fail('Remove requires a named page target; library placements may be on live pages.');
  return { target: target as Target['target'], action: action as MediaAction };
}
function intentRisk(intent: ReturnType<typeof mediaIntent>): RiskLevel {
  if (['delete', 'remove', 'archive'].includes(intent.action)) return 'destructive';
  if (intent.target === 'library' && ['upload', 'rename'].includes(intent.action)) return 'low';
  return 'public';
}
function plannedRisk(intent: ReturnType<typeof mediaIntent>, writes: Write[]): RiskLevel {
  if (writes.some((w) => w.operation.endsWith('.delete') || Object.hasOwn((w.body as any)?.data?.attributes ?? {}, 'archived')) || intent.action === 'archive') return 'destructive';
  return intentRisk(intent);
}
export function mediaRisk(name: string, args: Args): RiskLevel {
  return intentRisk(mediaIntent(name, args));
}
function placeBody(args: Args, page: Page, kind: MediaKind, id: string) {
  const placementType = str(args, 'placement_type', true)!;
  if (!MEDIA_PLACEMENT_TYPES.includes(placementType)) fail(`Unknown placement_type: ${placementType}.`);
  const expectedKind = placementType === 'APP_PREVIEW' ? 'video' : placementType.endsWith('SCREENSHOT') ? 'image' : undefined;
  if (expectedKind && kind !== expectedKind) fail(`${placementType} requires a ${expectedKind}; ${id} is a ${kind}.`);
  const group = str(args, 'placement_group');
  return mediaBody(MEDIA_OPS.placement, { attributes: { placementType, ...(group ? { placementGroup: group } : {}) }, relationships: {
    [kind]: mediaRelationship(MEDIA_OPS.placement, kind, id),
    [MEDIA_TARGETS[page.target].relationship]: mediaRelationship(MEDIA_OPS.placement, MEDIA_TARGETS[page.target].relationship, page.id),
  } });
}

async function checkedPlacements(args: Args, http: AscHttpClient, target: Target): Promise<{ rows: Row[]; files: File[] }> {
  const ids = arrayIds(args, 'placement_ids');
  let rows: Row[];
  if (target.target === 'library') {
    rows = [];
    for (const id of ids) rows.push(await getRow(http, MEDIA_OPS.placementGet, id, { include: `image,video,${PLACEMENT_INCLUDES}` }));
  } else {
    const all = (await pagePlacements(http, target.pages[0])).rows;
    rows = ids.map((id) => {
      const row = all.find((p) => p.id === id) ?? fail(`Placement ${id} is not on ${target.pages[0].label}. Nothing was changed.`);
      return { ...row, relationships: { ...row.relationships, [MEDIA_TARGETS[target.pages[0].target].relationship]: { data: { id: target.pages[0].id } } } };
    });
  }
  const assetIds = [...new Set<string>(rows.map((p) => placementAsset(p) ?? fail(`Placement ${p.id} has no asset.`)))];
  const files = await libraryFiles(http, target, assetIds);
  for (const file of files) file.placements = rows.filter((p) => placementAsset(p) === file.id);
  return { rows, files };
}

async function prepareWrite(name: string, args: Args, http: AscHttpClient): Promise<Plan> {
  const intent = mediaIntent(name, args);
  // Do file safety before any network request or reservation.
  const upload = name === MEDIA_NAMES.upload ? await readUpload(str(args, 'file_path', true)!) : undefined;
  const target = await resolveTarget(args, http, true);
  const writes: Write[] = [];
  let files: File[] = [];
  if (upload) {
    const category = str(args, 'category', true)!;
    if (!MEDIA_CATEGORIES.includes(category)) fail(`Unknown category: ${category}.`);
    if (target.target === 'library' && (args.placement_type !== undefined || args.placement_group !== undefined)) fail('Choose a page target to place the uploaded library file.');
    const poster = str(args, 'preview_frame_time_code');
    if (poster && upload.kind !== 'video') fail('Poster frames require a video.');
    const operation = MEDIA_ASSETS[upload.kind].create;
    writes.push({ operation, name: upload.fileName, body: mediaBody(operation, {
      attributes: { fileName: upload.fileName, fileSize: upload.bytes.length, category, ...(args.reference_name !== undefined ? { referenceName: str(args, 'reference_name', true) } : {}), ...(poster ? { previewFrameTimeCode: poster } : {}) },
      relationships: { assetLibrary: mediaRelationship(operation, 'assetLibrary', target.libraryId) },
    }) });
    if (target.pages.length) writes.push({ operation: MEDIA_OPS.placement, name: upload.fileName, body: placeBody(args, target.pages[0], upload.kind, '(new asset)') });
  } else {
    const action = intent.action;
    if (action === 'remove' || action === 'reorder') {
      if (args.asset_ids !== undefined) fail('Use placement_ids for remove/reorder.');
      const checked = await checkedPlacements(args, http, target); files = checked.files;
      if (action === 'remove') {
        for (const row of checked.rows) writes.push({ operation: MEDIA_OPS.placementDelete, id: row.id, name: files.find((f) => f.id === placementAsset(row))!.name });
      } else {
        let page = target.pages[0];
        if (!page) {
          const found = placementPage(checked.rows[0]) ?? fail('Placement has no supported page.');
          page = await resolvePage(http, target.app, found[0] as PageTarget, relId(checked.rows[0], found[1].relationship));
          target.pages.push(page);
        }
        if (!MEDIA_TARGETS[page.target].ordered) fail('Event placements have no order in Apple’s schema.');
        const group = str(args, 'placement_group', true)!;
        const all = (await pagePlacements(http, page)).rows.filter((p) => p.attributes?.placementGroup === group);
        const ids = checked.rows.map((p) => p.id);
        if (all.length !== ids.length || all.some((p) => !ids.includes(p.id))) fail('Reorder requires every placement in exactly one page/group; no omissions or foreign IDs.');
        const op = MEDIA_OPS.reorder;
        const itemType = mediaDataSchema(op).properties.relationships.properties.orderedPlacements.properties.data.items.properties.type.enum[0];
        writes.push({ operation: op, name: files.map((f) => f.name).join(', '), body: mediaBody(op, { attributes: { placementGroup: group }, relationships: {
          orderedPlacements: { data: ids.map((id) => ({ type: itemType, id })) },
          [MEDIA_TARGETS[page.target].relationship]: mediaRelationship(op, MEDIA_TARGETS[page.target].relationship, page.id),
        } }) });
      }
    } else {
      if (args.placement_ids !== undefined) fail('Use asset_ids for this action.');
      const sharedUpdate = action === 'archive' || action === 'poster' || action === 'rename';
      files = await libraryFiles(http, target, arrayIds(args, 'asset_ids'), action === 'delete' || sharedUpdate);
      if (action === 'delete' || sharedUpdate) await populatePlacementPages(http, target, files);
      if (action !== 'place' && target.target !== 'library' && target.pages.length) {
        const namedPage = target.pages[0];
        const placed = (await pagePlacements(http, namedPage)).rows;
        for (const file of files) {
          if (!placed.some((p) => placementAsset(p) === file.id)) fail(`File ${file.name} is not on ${namedPage.label}. Nothing was changed.`);
          if (!sharedUpdate) file.placements = placed.filter((p) => placementAsset(p) === file.id);
        }
      }
      if (action === 'place' && !target.pages.length) fail('Place requires a page target. The file already belongs to the library.');
      if (action === 'rename' && files.length !== 1) fail('Rename accepts exactly one file.');
      if (action === 'poster' && files.some((f) => f.kind !== 'video')) fail('Poster frames require videos. Nothing was changed.');
      if (action === 'archive' && args.archived !== undefined && typeof args.archived !== 'boolean') fail('archived must be boolean.');
      for (const file of files) {
        if (action === 'delete') writes.push({ operation: MEDIA_ASSETS[file.kind].delete, id: file.id, name: file.name });
        else if (action === 'place') writes.push({ operation: MEDIA_OPS.placement, name: file.name, body: placeBody(args, target.pages[0], file.kind, file.id) });
        else {
          const operation = MEDIA_ASSETS[file.kind].update;
          const attributes = action === 'rename' ? { referenceName: str(args, 'reference_name', true) } : action === 'poster' ? { previewFrameTimeCode: str(args, 'preview_frame_time_code', true) } : { archived: args.archived ?? true };
          writes.push({ operation, id: file.id, name: file.name, body: mediaBody(operation, { id: file.id, attributes }) });
        }
      }
    }
  }
  const risk = plannedRisk(intent, writes);
  if (risk !== intentRisk(intent)) fail('Media plan risk differs from the preflight confirmation risk. Nothing was changed.');
  const fingerprint = createHash('sha256').update(JSON.stringify({ app: target.app, libraryId: target.libraryId, target: target.target, pages: target.pages.map(({ state: _state, ...p }) => p), placements: files.map((f) => ({ id: f.id, placements: f.placements.map((p) => ({ id: p.id, page: placementPage(p)?.[1].relationship, pageId: placementPage(p) && relId(p, placementPage(p)![1].relationship) })) })), writes, upload: upload && createHash('sha256').update(upload.bytes).digest('hex') })).digest('hex');
  return { target, action: intent.action, files, writes, risk, fingerprint, upload };
}

export async function buildMediaPreview(name: string, args: Args, http: AscHttpClient) {
  const plan = await prepareWrite(name, args, http);
  const strong = STRONG_CONFIRM_LEVELS.has(plan.risk);
  const fileLines = plan.upload ? [`- ${plan.upload.fileName} (new ${plan.upload.kind})`] : plan.files.map((file) => {
    const groups = new Map<string, number>();
    for (const placement of file.placements) {
      const found = placementPage(placement)!;
      const id = relId(placement, found[1].relationship);
      const page = plan.target.pages.find((p) => p.id === id && p.target === found[0]);
      const label = `${page?.label ?? id} (${id})`;
      groups.set(label, (groups.get(label) ?? 0) + 1);
    }
    const pages = [...groups].map(([label, count]) => `${label} ×${count}`).join('; ') || 'no page placements';
    return `- ${file.name} [${file.id}]: ${pages}`;
  });
  const writeLines = plan.writes.map((write) => {
    const attributes = (write.body as any)?.data?.attributes;
    const ordered = (write.body as any)?.data?.relationships?.orderedPlacements?.data;
    return `- ${write.operation}${write.id ? ` [${write.id}]` : ''}${attributes ? ` ${JSON.stringify(attributes)}` : ''}${ordered ? ` order=${ordered.map((item: Row) => item.id).join(',')}` : ''}`;
  });
  return { planFingerprint: plan.fingerprint, strong, message: [
    `Heimdall is about to ${name === MEDIA_NAMES.delete ? 'delete media' : plan.action === 'upload' ? 'upload media' : plan.action} — a ${plan.risk.toUpperCase()}-level write.`, '',
    `App:        ${plan.target.app.name}`,
    `Target:     ${plan.target.target === 'library' ? `asset library (${plan.target.libraryId})` : `${plan.target.pages[0].label} (${plan.target.pages[0].id})`}`,
    `Files (${fileLines.length}):`, ...fileLines,
    `Changes (${writeLines.length}):`, ...writeLines,
    `Risk:       ${plan.risk} — ${REVERSIBILITY[plan.risk]}`, '',
    strong ? 'Type CONFIRM in the field below to proceed.' : 'Confirm to proceed.',
  ].join('\n') };
}

async function applyWrite(http: AscHttpClient, write: Write): Promise<any> {
  const path = mediaPath(write.operation, write.id);
  if (write.operation.endsWith('.delete')) return http.delete(path);
  if (write.operation.endsWith('.update')) return http.patch(path, write.body);
  return http.post(path, write.body);
}
const errorText = (err: unknown) => err instanceof Error ? err.message : String(err);

export async function executeMediaTool(name: string, args: Args, ctx: MediaContext): Promise<unknown> {
  if (!MEDIA_TOOL_NAMES.has(name)) throw new Error(`Unknown media tool: ${name}`);
  if (name === MEDIA_NAMES.list) return listMedia(args, ctx.http);
  const plan = await prepareWrite(name, args, ctx.http);
  if (ctx.approvedPlanFingerprint && plan.fingerprint !== ctx.approvedPlanFingerprint) fail('Media target or files changed since confirmation; retry and approve the current plan. Nothing was changed.');
  const summary = { app: `${plan.target.app.name} (${plan.target.app.id})`, target: plan.target.target, libraryId: plan.target.libraryId, pages: plan.target.pages, risk: plan.risk };
  if (ctx.dryRun) return { ...summary, dryRun: true, wouldSend: plan.writes.map((w) => ({ method: w.operation.endsWith('.delete') ? 'DELETE' : w.operation.endsWith('.update') ? 'PATCH' : 'POST', path: mediaPath(w.operation, w.id), body: w.body, name: w.name })), note: 'Resolved and checked; nothing was reserved, uploaded, committed, placed or deleted.' };
  if (plan.upload) {
    const { bytes, kind, fileName } = plan.upload;
    const reserved = await applyWrite(ctx.http, plan.writes[0]);
    const id: string = reserved?.data?.id ?? fail('Apple reserved no asset ID.');
    let phase = 'upload';
    try {
      const ops: any[] = reserved.data.attributes?.uploadOperations ?? [];
      if (!ops.length) fail('Apple returned no upload operations.');
      // Check all ranges before sending the first byte. A malformed response
      // must not silently commit a truncated or overlapping upload.
      const ranges = ops.map((o) => ({ start: o.offset, end: o.offset + o.length })).sort((a, b) => a.start - b.start);
      let end = 0;
      for (const r of ranges) { if (!Number.isSafeInteger(r.start) || !Number.isSafeInteger(r.end) || r.start !== end || r.end <= r.start || r.end > bytes.length) fail('Invalid upload byte ranges.'); end = r.end; }
      if (end !== bytes.length) fail('Upload operations do not cover the complete file.');
      for (const op of ops) await ctx.http.uploadAssetPart(op, bytes.subarray(op.offset, op.offset + op.length));
      phase = 'commit';
      const committed: any = await ctx.http.patch(mediaPath(MEDIA_ASSETS[kind].update, id), mediaBody(MEDIA_ASSETS[kind].update, { id, attributes: { uploaded: true } }));
      const state: string | null = committed?.data?.attributes?.state ?? null;
      const result = { ...summary, assetId: id, fileName, kind, state, errors: errorsOf(committed?.data ?? {}), parts: ops.length };
      if (plan.writes.length === 1) return { ...result, ok: state !== 'FAILED', note: 'Committed to the library; inspect media__list for subsequent processing/review state.' };
      if (state === 'FAILED' || state === 'AWAITING_UPLOAD') return { ...result, ok: false, placed: false, note: 'Apple has not accepted the upload. Inspect media__list before placing.' };
      phase = 'placement';
      try {
        const placed: any = await ctx.http.post(mediaPath(MEDIA_OPS.placement), placeBody(args, plan.target.pages[0], kind, id));
        const placementState: string | null = placed?.data?.attributes?.state ?? null;
        const placementId: string | null = placed?.data?.id ?? null;
        const placedOk = Boolean(placementId) && placementState !== 'FAILED';
        return { ...result, ok: placedOk, placed: placedOk, placementId, placementState,
          placementErrors: errorsOf(placed?.data ?? {}),
          ...(!placementId ? { placementError: 'Apple returned no placement ID; inspect media__list before retrying.' } : {}),
          ...(placedOk && (state === 'PREPARE_FOR_SUBMISSION' || state === 'READY_FOR_REVIEW')
            ? { review: { required: true, state, submitWith: 'release__submit_items', item: { type: kind === 'image' ? 'appAssetLibraryImage' : 'appAssetLibraryVideo', id } } } : {}),
        };
      } catch (err) { return { ...result, ok: false, placed: false, placementError: errorText(err), retryWith: MEDIA_NAMES.arrange, note: `Upload stands. Call media__arrange with action: place, asset_ids: ["${id}"], the same page target and placement_type to retry.` }; }
    } catch (err) { return { ...summary, ok: false, assetId: id, fileName, failedPhase: phase, error: errorText(err), inspectWith: MEDIA_NAMES.list, deleteWith: MEDIA_NAMES.delete }; }
  }
  const succeeded = [], failed = [];
  for (const write of plan.writes) {
    try { const res = await applyWrite(ctx.http, write); succeeded.push({ id: write.id ?? res?.data?.id ?? null, name: write.name }); }
    catch (err) { failed.push({ id: write.id ?? null, name: write.name, error: errorText(err) }); }
  }
  return { ...summary, ok: !failed.length, succeeded, failed, note: failed.length ? `${succeeded.length} succeeded; ${failed.length} failed. Retry only failed items.` : `${succeeded.length} operation(s) completed.` };
}
