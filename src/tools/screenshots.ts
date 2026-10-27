/** Media macros: resolve the library, page or file owner, then verify and write. */
import { createHash } from 'node:crypto';
import { constants, type Stats } from 'node:fs';
import { open, stat, type FileHandle } from 'node:fs/promises';
import { basename, isAbsolute } from 'node:path';
import type { McpToolDefinition } from '../core/registry.js';
import type { AscHttpClient, Query } from '../core/http.js';
import { AscApiError } from '../core/errors.js';
import { resolveApp } from '../core/resolve-app.js';
import { REVERSIBILITY, STRONG_CONFIRM_LEVELS, type RiskLevel } from '../core/risk.js';
import { pickVersion, readAppStoreVersions, PLATFORMS, EDITABLE_STATES } from './preflight.js';
import {
  MEDIA_NAMES, MEDIA_OPS, MEDIA_ASSETS, MEDIA_TARGETS, PAGE_TARGETS, FILE_TARGETS, MEDIA_CATEGORIES, MEDIA_PLACEMENT_TYPES,
  MEDIA_FILE_ASSET_TYPES, MEDIA_BUILD_UTIS,
  mediaAssetTypes, mediaBody, mediaDataSchema, mediaOperation, mediaPath, mediaRelationship, type MediaKind, type PageTarget, type FileTarget, type FileAdapter,
} from './media-catalog.js';

const MAX_ITEMS = 50;
const MAX_IMAGE_BYTES = 50 * 1024 * 1024;
const MAX_VIDEO_BYTES = 500 * 1024 * 1024;
const MAX_GEOJSON_BYTES = 4 * 1024 * 1024;
const PLIST_SAMPLE_BYTES = 64 * 1024;
const CHUNK_BYTES = 1024 * 1024;
/** One reserved range is held at a time; a larger range is refused before it is read. */
const MAX_PART_BYTES = 64 * 1024 * 1024;
/** Arguments that mean something only for some file targets. */
const FILE_ONLY_KEYS = ['uti', 'asset_type', 'build_version', 'build_short_version', 'replace'];
const textField = { type: 'string', minLength: 1 };
const idsField = { type: 'array', items: textField, minItems: 1, maxItems: MAX_ITEMS, uniqueItems: true };
const targetFields = {
  app: { ...textField, description: 'App name, bundle ID or Apple ID.' },
  target: { type: 'string', enum: ['library', ...Object.keys(MEDIA_TARGETS)], description: 'Library, page, or a named image/file target.' },
  page_id: { ...textField, description: 'Page localization ID, or the owning resource ID for an image/file target.' },
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
    id: textField, kind: { type: 'string', enum: ['image', 'video', 'file'] }, name: textField,
    fileName: nullableText, state: nullableText, errors: errorsSchema,
    width: { type: ['number', 'null'] }, height: { type: ['number', 'null'] },
    placements: { type: 'array', items: placementSchema },
  }, required: ['id', 'kind', 'name', 'fileName', 'state', 'errors', 'width', 'height', 'placements'],
};

export const MEDIA_TOOLS: McpToolDefinition[] = [
  {
    name: MEDIA_NAMES.list,
    description: 'List library, page and file-target media with owner and file IDs, states and errors.',
    inputSchema: { type: 'object', properties: { ...targetFields, asset_ids: { ...idsField, description: 'Optional library file IDs to inspect.' }, file_ids: { ...idsField, description: 'Optional image/file target IDs to inspect.' }, library_id: { ...textField, description: 'Optional library ID to verify against the app.' }, ref_data_id: { ...textField, description: 'Optional reference data ID.' } }, required: ['app', 'target'] },
    outputSchema: {
      type: 'object', properties: {
        app: textField, target: textField, libraryId: nullableText,
        assets: { type: 'array', items: assetSchema },
        pages: { type: 'array', items: { type: 'object', properties: {
          id: textField, target: textField, label: textField, locale: nullableText, state: nullableText,
          sets: { type: 'array', items: { type: 'object', properties: {
            kind: textField, placementType: nullableText, placementGroup: nullableText,
            count: { type: 'integer' }, placements: { type: 'array', items: placementSchema },
          }, required: ['kind', 'placementType', 'placementGroup', 'count', 'placements'] } },
        }, required: ['id', 'target', 'label', 'locale', 'state', 'sets'] } },
        limits: { type: 'array', description: 'Per placement type for this page: max files per group, categories, accepted sizes.', items: { type: 'object', properties: {
          id: textField, policies: { type: 'array', items: { type: 'object', properties: {
            feature: textField, placementType: textField, maxCount: { type: ['integer', 'null'] },
            categories: { type: 'array', items: { type: 'string' } },
            groups: { type: 'array', items: { type: 'object', properties: { id: textField, sizes: { type: 'array', items: { type: 'string' } } } } },
          } } },
        }, required: ['id', 'policies'] } },
      }, required: ['app', 'target', 'libraryId', 'assets', 'pages', 'limits'],
    },
    annotations: { readOnlyHint: true, idempotentHint: true },
  },
  {
    name: MEDIA_NAMES.upload,
    description: 'Upload library, page or file-target media: check a local file, reserve, send bytes and commit. File targets use owner page_id; omit it to start a build upload or an advanced App Clip image. Customer-facing images are PUBLIC-level; private files are low risk.',
    inputSchema: { type: 'object', properties: {
      ...targetFields, ...placementFields,
      file_path: { ...textField, description: 'Absolute local regular file. Images ≤50 MiB, GeoJSON ≤4 MiB, others ≤500 MiB.' },
      category: { type: 'string', enum: MEDIA_CATEGORIES }, reference_name: textField,
      preview_frame_time_code: { ...textField, description: 'Video poster frame, e.g. 00:00:05:00.' },
      asset_type: { type: 'string', enum: MEDIA_FILE_ASSET_TYPES, description: 'ASSET_SPI: build only.' },
      uti: { type: 'string', enum: MEDIA_BUILD_UTIS, description: 'Build files.' },
      build_version: { ...textField, description: 'New build upload: CFBundleVersion.' },
      build_short_version: { ...textField, description: 'New build upload: CFBundleShortVersionString.' },
      replace: { type: 'boolean', description: 'Delete the one existing file first (DESTRUCTIVE).' },
    }, required: ['app', 'target', 'file_path'] },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  },
  {
    name: MEDIA_NAMES.arrange,
    description: 'Place, reorder or remove page media; set video posters, rename or archive library files. Single-image and file targets have no ordering and cannot use this tool.',
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
    description: 'Delete images or videos from an app’s asset library, or remove placements from a named page. File targets can delete owned assets where Apple offers DELETE. Verifies all IDs before any write. DESTRUCTIVE-level write.',
    inputSchema: { type: 'object', properties: {
      ...targetFields, asset_ids: { ...idsField, description: 'Library target: file IDs to permanently delete.' },
      placement_ids: { ...idsField, description: 'Page target: placement IDs to remove; the files remain in the library.' },
      file_ids: { ...idsField, description: 'Image/file target: IDs to delete after app and parent ownership checks.' },
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
interface Plan { target: Target; action: MediaAction; files: File[]; writes: Write[]; risk: RiskLevel; fingerprint: string; upload?: UploadSource }
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
  const adapter = PAGE_TARGETS[target];
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
const placementPage = (row: Row) => Object.entries(PAGE_TARGETS).find(([, t]) => row.relationships?.[t.relationship]?.data?.id);
const placementAsset = (row: Row) => row.relationships?.image?.data?.id ?? row.relationships?.video?.data?.id;
const PLACEMENT_INCLUDES = Object.values(PAGE_TARGETS).map((t) => t.relationship).join(',');
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
  return readMediaRows(http, PAGE_TARGETS[page.target].placements, page.id, { include: 'image,video', ...(PAGE_TARGETS[page.target].ordered ? { sort: 'placementGroupPosition' } : {}), limit: 200 });
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
  if (Object.hasOwn(FILE_TARGETS, str(args, 'target', true)!)) return listFileMedia(args, http);
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
        const enriched = { ...p, relationships: { ...p.relationships, [PAGE_TARGETS[page.target].relationship]: { data: { id: page.id } } } };
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
  return { app: `${target.app.name} (${target.app.id})`, target: target.target, libraryId: target.libraryId, assets: files.map(showFile), pages: target.target === 'library' ? target.pages.map((p) => ({ ...p, sets: [] })) : pages, limits: refs.rows.map((r) => compactLimits(r, target.target)) };
}

/** A checked file, still open on the descriptor that was checked. Its bytes
 * are never held whole: the digests come from bounded reads, and each reserved
 * range is read again from this descriptor when it is sent. */
interface UploadSource { fd: FileHandle; fileName: string; size: number; kind: MediaKind; sha256: string; md5: string; stamp: string }
const stampOf = (s: Stats) => [s.dev, s.ino, s.size, s.mtimeMs, s.ctimeMs].join('/');
const closeUpload = async (upload?: UploadSource) => { await upload?.fd.close().catch(() => undefined); };

/** Stat before reading, then fstat + bounded reads from that same descriptor.
 * O_NONBLOCK prevents a swapped FIFO from hanging open; fstat rejects it.
 * The caller owns the returned descriptor and closes it. */
async function readUpload(filePath: string, format: FileAdapter['format'] | 'library' = 'library', uti?: string): Promise<UploadSource> {
  if (!isAbsolute(filePath)) fail('file_path must be absolute.');
  const max = format === 'image' ? MAX_IMAGE_BYTES : format === 'geojson' ? MAX_GEOJSON_BYTES : MAX_VIDEO_BYTES;
  const check = (s: Stats) => {
    if (!s.isFile()) fail('Upload requires a regular file.');
    if (s.size < 1 || s.size > max) fail(`File size must be 1–${max} bytes.`);
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
    if (format === 'image' && !image) fail('Image target requires PNG or JPEG; no bytes were sent.');
    if (format === 'library' && !video && !image) fail('File is not a PNG, JPEG, MP4 or MOV; no bytes were sent.');
    if (format === 'library' && !video && info.size > MAX_IMAGE_BYTES) fail(`Image exceeds the ${MAX_IMAGE_BYTES}-byte limit.`);
    const sha256 = createHash('sha256'), md5 = createHash('md5');
    const chunk = Buffer.alloc(Math.min(CHUNK_BYTES, info.size));
    // Only GeoJSON is kept whole, under its own small limit, to be parsed.
    const whole = format === 'geojson' ? Buffer.alloc(info.size) : undefined;
    for (let offset = 0; offset < info.size;) {
      const read = await fd.read(chunk, 0, Math.min(chunk.length, info.size - offset), offset);
      if (!read.bytesRead) fail('File shrank during read; retry.');
      const part = chunk.subarray(0, read.bytesRead);
      if (offset === 0 && !part.subarray(0, bytesRead).equals(head.subarray(0, Math.min(bytesRead, part.length)))) fail('File changed during read; retry.');
      sha256.update(part); md5.update(part);
      if (whole) part.copy(whole, offset);
      offset += read.bytesRead;
    }
    if (stampOf(await fd.stat()) !== stampOf(info)) fail('File changed during read; retry.');
    // The spec gives documents, review attachments and background assets no
    // MIME/extension enum. Do not turn a PDF example into a PDF-only rule.
    if (whole) {
      let parsed: any;
      try { parsed = JSON.parse(whole.toString('utf8').replace(/^﻿/, '')); } catch { fail('Routing coverage must be valid GeoJSON.'); }
      if (!validGeoJson(parsed)) fail('Routing coverage must be valid GeoJSON with non-empty geometries and coordinates.');
    }
    if (format === 'build') {
      const magic = head.subarray(0, bytesRead);
      if ((uti === 'com.apple.ipa' || uti === 'com.pkware.zip-archive') && !magic.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]))) fail('Build file UTI requires a ZIP/IPA signature.');
      if (uti === 'com.apple.binary-property-list' && magic.subarray(0, 8).toString('latin1') !== 'bplist00') fail('Build file UTI requires a binary plist.');
      if (uti === 'com.apple.pkg' && magic.subarray(0, 4).toString('latin1') !== 'xar!') fail('Build file UTI requires a pkg archive.');
      if (uti === 'com.apple.xml-property-list') {
        const sample = async (position: number) => {
          const buffer = Buffer.alloc(Math.min(PLIST_SAMPLE_BYTES, info.size));
          const read = await fd.read(buffer, 0, buffer.length, position);
          return buffer.subarray(0, read.bytesRead).toString('utf8');
        };
        if (!xmlPlistFramed(await sample(0), await sample(Math.max(0, info.size - PLIST_SAMPLE_BYTES)))) fail('Build file UTI requires an XML plist.');
      }
    }
    return { fd, kind: video ? 'video' : 'image', fileName: basename(filePath), size: info.size, sha256: sha256.digest('hex'), md5: md5.digest('hex'), stamp: stampOf(info) };
  } catch (err) { await fd.close(); throw err; }
}

/** Prolog and root framing of an XML property list, read from its first and
 * last bytes: optional BOM, declaration, comments and DOCTYPE, then a `<plist>`
 * root holding an element and closed at the end. Not a parser; it catches the
 * wrong file and the truncated one. */
function xmlPlistFramed(head: string, tail: string): boolean {
  let rest = head.replace(/^﻿/, '');
  const declaration = /^<\?xml\s[^<>?]*\?>/.exec(rest);
  if (declaration) rest = rest.slice(declaration[0].length);
  for (let doctype = false; ;) {
    rest = rest.trimStart();
    const comment = /^<!--[\s\S]*?-->/.exec(rest);
    const type = doctype ? null : /^<!DOCTYPE\s+plist\b[^<>[\]]*>/.exec(rest);
    if (comment) rest = rest.slice(comment[0].length);
    else if (type) { rest = rest.slice(type[0].length); doctype = true; } else break;
  }
  const root = /^<plist(?:\s[^<>]*)?>/.exec(rest);
  if (!root || root[0].endsWith('/>')) return false;
  rest = rest.slice(root[0].length).trimStart().replace(/^(?:<!--[\s\S]*?-->\s*)+/, '');
  if (!/^<[A-Za-z]/.test(rest)) return false;
  let end = tail.trimEnd();
  while (end.endsWith('-->') && end.includes('<!--')) end = end.slice(0, end.lastIndexOf('<!--')).trimEnd();
  return /<\/plist\s*>$/.test(end);
}

/** GeoJSON structure: every collection and coordinate list non-empty and every
 * feature carrying a geometry. `properties` may be absent. Apple's coverage
 * rules for the shape itself still apply when it processes the file. */
function validGeoJson(value: any, depth = 0): boolean {
  if (!value || typeof value !== 'object' || depth > 20) return false;
  const all = (items: any, check: (item: any) => boolean) => Array.isArray(items) && items.length > 0 && items.every(check);
  const position = (p: any) => Array.isArray(p) && p.length >= 2 && p.every((n: any) => typeof n === 'number' && Number.isFinite(n));
  const line = (p: any) => Array.isArray(p) && p.length >= 2 && p.every(position);
  const ring = (p: any) => line(p) && p.length >= 4 && JSON.stringify(p[0]) === JSON.stringify(p.at(-1));
  const polygon = (p: any) => all(p, ring);
  const geometry = (g: any) => Boolean(g) && !['Feature', 'FeatureCollection'].includes(g.type) && validGeoJson(g, depth + 1);
  const properties = (p: any) => p === undefined || p === null || (typeof p === 'object' && !Array.isArray(p));
  switch (value.type) {
    case 'FeatureCollection': return all(value.features, (f) => f?.type === 'Feature' && validGeoJson(f, depth + 1));
    case 'Feature': return properties(value.properties) && geometry(value.geometry);
    case 'GeometryCollection': return all(value.geometries, geometry);
    case 'Point': return position(value.coordinates);
    case 'MultiPoint': return all(value.coordinates, position);
    case 'LineString': return line(value.coordinates);
    case 'MultiLineString': return all(value.coordinates, line);
    case 'Polygon': return polygon(value.coordinates);
    case 'MultiPolygon': return all(value.coordinates, polygon);
    default: return false;
  }
}

interface FilePlan {
  adapter: FileAdapter; target: FileTarget; app: { id: string; name: string };
  parentId: string; parentLabel: string; parentFiles: string[]; ownerIds: string[];
  files: Row[]; writes: Write[]; risk: RiskLevel; fingerprint: string;
  upload?: UploadSource; createBuild?: unknown; standalone?: boolean;
}
const fileAdapter = (target: string): FileAdapter => (FILE_TARGETS as Record<string, FileAdapter>)[target] ?? fail(`Unknown file target: ${target}.`);
/** One file per owner: Apple models these as a to-one relationship. */
const singleFile = (adapter: FileAdapter) => Boolean(adapter.attach || adapter.single || (adapter.read && !adapter.read.endsWith('.list')));
const relationshipIds = (row: Row, key: string): string[] => {
  const relationship = row?.relationships?.[key];
  if (!relationship || !Object.hasOwn(relationship, 'data')) fail(`Missing ${key} relationship; cannot verify ownership.`);
  const data = relationship.data;
  const ids = data === null ? [] : (Array.isArray(data) ? data : [data]).map((item: Row) => item.id);
  if (ids.some((id: unknown) => typeof id !== 'string' || !id)) fail(`Invalid ${key} relationship; cannot verify ownership.`);
  if (relationship.links?.next || Number(relationship.meta?.paging?.total ?? 0) > ids.length) fail(`Truncated ${key} relationship; cannot verify all files.`);
  return ids;
};
/** Apple answers an empty to-one with 404 or `data: null`; both mean none.
 * Permission, network and server failures stay errors. */
async function getToOne(http: AscHttpClient, operation: string, id: string, query?: Query): Promise<Row | null> {
  let res: any;
  try { res = await http.get(mediaPath(operation, id), query); }
  catch (err) { if (err instanceof AscApiError && err.status === 404) return null; throw err; }
  if (res?.data === null) return null;
  if (typeof res?.data?.id !== 'string' || !res.data.id) fail(`Missing ${operation} response; cannot verify ownership.`);
  return res.data;
}

async function resolveFileParent(args: Args, http: AscHttpClient) {
  const name = str(args, 'target', true)!;
  let adapter = fileAdapter(name);
  const parentId = str(args, 'page_id', true)!;
  if (args.locale !== undefined || args.version !== undefined || args.platform !== undefined) fail('File targets require an exact page_id; version/platform selectors cannot identify a unique owner.');
  const app = await resolveApp(http, str(args, 'app', true)!);
  const query = (a: FileAdapter) => {
    const include = [a.read ? undefined : a.files, a.chain[0]?.via, a.chain[0]?.group, a.parentInclude].filter(Boolean).join(',');
    return include ? { include } : undefined;
  };
  // IDs are unique across types: a page_id that is no localization (404) is
  // tried as the version whose default image this family also holds.
  const first = adapter.versionParent ? await getToOne(http, adapter.parentGet, parentId, query(adapter)) : undefined;
  if (adapter.versionParent && !first) adapter = adapter.versionParent;
  let row = first ?? await getRow(http, adapter.parentGet, parentId, query(adapter));
  if (row.id !== parentId) fail(`Missing ${adapter.parentGet} ${parentId}; cannot verify ownership.`);
  const parent = row;
  const labels: string[] = [];
  if (adapter !== fileAdapter(name)) labels.push('version default image');
  const label = (r: Row) => {
    const a = r.attributes ?? {};
    const build = a.cfBundleShortVersionString !== undefined && a.cfBundleVersion !== undefined ? `${a.cfBundleShortVersionString} (${a.cfBundleVersion})` : a.cfBundleVersion;
    return [a.referenceName ?? a.name ?? a.fileName, a.platform, a.versionString ?? a.version ?? build, a.locale].filter((v) => v !== undefined).join(', ');
  };
  if (label(row)) labels.push(label(row));
  if (adapter.parentInclude === 'build') {
    const [build] = parent.relationships?.build === undefined ? [] : relationshipIds(parent, 'build');
    labels.push(build ? `build ${build} attached` : 'no build attached');
  }
  const ownerIds = [parentId];
  for (let i = 0; i < adapter.chain.length; i++) {
    const step = adapter.chain[i];
    if (step.group && row?.relationships?.[step.via]?.data == null) {
      // A shared group's item has no detail of its own. It belongs to the app
      // when the app's own Game Center detail is in that group.
      const groupId: string = row.relationships?.[step.group]?.data?.id ?? fail(`Neither ${step.via} nor ${step.group} links ${parentId} to an app; cannot verify ownership. Nothing was changed.`);
      const detail = await getToOne(http, 'apps.game_center_detail.get', app.id, { include: step.group });
      if (!detail || detail.relationships?.[step.group]?.data?.id !== groupId) fail(`${parentId} is in Game Center group ${groupId}, which ${app.name} does not use. Nothing was changed.`);
      ownerIds.push(groupId, detail!.id, app.id);
      labels.push(`Game Center group ${groupId}`);
      break;
    }
    const id = relId(row, step.via);
    ownerIds.push(id);
    if (step.get === 'apps.get') {
      if (id !== app.id) fail(`${parentId} does not belong to ${app.name}. Nothing was changed.`);
    } else {
      const next = adapter.chain[i + 1];
      const nextInclude = [next?.via, next?.group].filter(Boolean).join(',');
      row = await getRow(http, step.get, id, nextInclude ? { include: nextInclude } : undefined);
      if (label(row)) labels.push(label(row));
    }
  }
  if (adapter.appList) {
    const owner = ownerIds.at(-1)!;
    const filter = Object.fromEntries((adapter.appListFilter ?? []).map((key) => [`filter[${key}]`, String(row.attributes?.[key] ?? fail(`Missing ${key} on ${owner}; cannot verify ownership.`))]));
    const owned = await readMediaRows(http, adapter.appList, app.id, { ...filter, limit: 200 });
    if (!owned.rows.some((entry) => entry.id === owner)) fail(`${parentId} does not belong to ${app.name}. Nothing was changed.`);
  }
  // These scoped endpoints also work for link-only relationships (build and
  // background upload files), where include cannot produce linkage data.
  let parentFiles: string[];
  if (adapter.read?.endsWith('.list')) {
    parentFiles = (await readMediaRows(http, adapter.read, parentId, { limit: 200 })).rows.map((file) => file.id);
  } else if (adapter.read) {
    const file = await getToOne(http, adapter.read, parentId);
    parentFiles = file ? [file.id] : [];
  } else parentFiles = relationshipIds(parent, adapter.files);
  if (parentFiles.length > 200) fail('More than 200 files on this resource; refusing an incomplete preview.');
  return { adapter, app, parentId, parentLabel: labels.join(' / ') || parentId, parentFiles, ownerIds };
}

async function fileRows(http: AscHttpClient, adapter: FileAdapter, ids: string[]) {
  return Promise.all(ids.map((id) => getRow(http, adapter.get, id)));
}

async function listFileMedia(args: Args, http: AscHttpClient) {
  if (args.library_id !== undefined || args.ref_data_id !== undefined) fail('File targets do not use the asset library.');
  if (args.asset_ids !== undefined) fail('Use file_ids to filter a file target.');
  if (args.target === 'app_clip_advanced_experience_image' && args.page_id === undefined) {
    if (args.locale !== undefined || args.version !== undefined || args.platform !== undefined) fail('An unattached image takes no version, locale or platform.');
    const ids = arrayIds(args, 'file_ids');
    const app = await resolveApp(http, str(args, 'app', true)!);
    const rows = await fileRows(http, FILE_TARGETS.app_clip_advanced_experience_image, ids);
    return { app: `${app.name} (${app.id})`, target: args.target, libraryId: null,
      assets: rows.map((row) => ({ id: row.id, kind: 'image', name: row.id,
        fileName: null, state: row.attributes?.assetDeliveryState?.state ?? null,
        errors: errorsOf(row), width: null, height: null, placements: [] })),
      pages: [], limits: [], note: 'Apple keeps no app link on an unattached advanced App Clip image; its ownership by the named app cannot be proven. Read-only state and errors.' };
  }
  const resolved = await resolveFileParent(args, http);
  const filter = arrayIds(args, 'file_ids', false);
  for (const id of filter) if (!resolved.parentFiles.includes(id)) fail(`File ${id} is not on ${resolved.parentId}.`);
  const rows = await fileRows(http, resolved.adapter, filter.length ? filter : resolved.parentFiles);
  return { app: `${resolved.app.name} (${resolved.app.id})`, target: str(args, 'target', true)!, libraryId: null,
    assets: rows.map((row) => ({ id: row.id, kind: resolved.adapter.format === 'image' ? 'image' : 'file',
      name: row.attributes?.fileName ?? row.id, fileName: row.attributes?.fileName ?? null,
      state: row.attributes?.assetDeliveryState?.state ?? null, errors: errorsOf(row),
      width: row.attributes?.imageAsset?.width ?? null, height: row.attributes?.imageAsset?.height ?? null, placements: [] })),
    pages: [{ id: resolved.parentId, target: str(args, 'target', true)!, label: resolved.parentLabel, locale: null, state: null, sets: [] }], limits: [] };
}

/** Target-specific arguments are settled before the file is read or Apple is called. */
function checkFileArgs(name: string, target: FileTarget, adapter: FileAdapter, args: Args) {
  if (name === MEDIA_NAMES.arrange) fail(`${target} has no ordering or placements; media__arrange is unavailable.`);
  if (name === MEDIA_NAMES.delete && !adapter.delete && target !== 'build_upload_file') fail(`Apple does not offer DELETE for ${target}.`);
  for (const key of ['asset_ids', 'placement_ids', 'placement_type', 'placement_group', 'category', 'reference_name', 'preview_frame_time_code']) {
    if (args[key] !== undefined) fail(`${key} is not supported for ${target}.`);
  }
  const upload = name === MEDIA_NAMES.upload;
  if (upload && args.file_ids !== undefined) fail('file_ids is only for listing or deleting existing files.');
  const newBuild = upload && target === 'build_upload_file' && args.page_id === undefined;
  const assetTypes = mediaAssetTypes(adapter);
  if (args.asset_type !== undefined && !(upload && assetTypes.length)) fail(`asset_type is not supported for ${target}.`);
  if (upload && assetTypes.length && !assetTypes.includes(str(args, 'asset_type', true)!)) fail(`asset_type for ${target} must be one of ${assetTypes.join(', ')}.`);
  if (!(upload && target === 'build_upload_file')) { if (args.uti !== undefined) fail(`uti is not supported for ${target}.`); }
  else if (!MEDIA_BUILD_UTIS.includes(str(args, 'uti', true)!)) fail(`"uti" must be one of ${MEDIA_BUILD_UTIS.join(', ')}.`);
  for (const key of ['build_version', 'build_short_version']) if (!newBuild && args[key] !== undefined) fail(`${key} is only for a new build upload (no page_id).`);
  if (args.replace !== undefined) {
    if (!upload || !singleFile(adapter) || !adapter.delete) fail(`replace is not supported for ${target}.`);
    if (typeof args.replace !== 'boolean') fail('replace must be boolean.');
  }
}

async function prepareFileWrite(name: string, args: Args, http: AscHttpClient): Promise<FilePlan> {
  const target = str(args, 'target', true)! as FileTarget;
  const adapter = fileAdapter(target);
  checkFileArgs(name, target, adapter, args);
  const ownerless = name === MEDIA_NAMES.upload && args.page_id === undefined;
  const newBuild = ownerless && target === 'build_upload_file';
  const standalone = ownerless && adapter.standalone === true;
  if ((newBuild || standalone) && (args.locale !== undefined || args.version !== undefined)) fail(newBuild ? 'A new build upload uses build_version, build_short_version and platform.' : 'An unattached image takes no version or locale.');
  if (standalone && args.platform !== undefined) fail('An unattached image takes no platform.');
  const uti = str(args, 'uti');
  const upload = name === MEDIA_NAMES.upload ? await readUpload(str(args, 'file_path', true)!, adapter.format, uti) : undefined;
  try {
    if (upload && singleFile(adapter) && !adapter.delete && !adapter.attach && upload.size > MAX_PART_BYTES)
      fail(`File exceeds the ${MAX_PART_BYTES}-byte safe limit for a single-slot target without DELETE; nothing was reserved.`);
    const ownerApp = newBuild || standalone ? await resolveApp(http, str(args, 'app', true)!) : undefined;
    const createBuild = newBuild ? mediaBody('build_uploads.create', {
      attributes: { cfBundleVersion: str(args, 'build_version', true), cfBundleShortVersionString: str(args, 'build_short_version', true), platform: str(args, 'platform', true) },
      relationships: { app: mediaRelationship('build_uploads.create', 'app', ownerApp!.id) },
    }) : undefined;
    const resolved = newBuild ? { adapter, app: ownerApp!, parentId: '(new build upload)', parentLabel: `${args.platform} ${args.build_short_version} (${args.build_version})`, parentFiles: [], ownerIds: [ownerApp!.id] }
      : standalone ? { adapter, app: ownerApp!, parentId: '(not attached)', parentLabel: 'no advanced experience yet', parentFiles: [], ownerIds: [ownerApp!.id] }
      : await resolveFileParent(args, http);
    const ids = name === MEDIA_NAMES.delete && target !== 'build_upload_file' ? arrayIds(args, 'file_ids') : resolved.parentFiles;
    for (const id of ids) if (!resolved.parentFiles.includes(id)) fail(`File ${id} is not on ${resolved.parentId}. Nothing was changed.`);
    const files = await fileRows(http, adapter, ids);
    const writes: Write[] = [];
    if (upload) {
      // A to-one slot holds one file. Apple's replace is delete then upload,
      // so it is asked for by name and confirmed as destructive.
      const names = files.map((file) => `${file.attributes?.fileName ?? file.id} [${file.id}]`).join(', ');
      if (files.length && singleFile(adapter) && !adapter.attach) {
        if (!adapter.delete) fail(`${resolved.parentLabel} [${resolved.parentId}] already has ${names}, and Apple offers no DELETE for ${target}. Nothing was changed.`);
        if (args.replace !== true) fail(`${resolved.parentLabel} [${resolved.parentId}] already has ${names}; Apple allows one. Pass replace: true to delete it before uploading (DESTRUCTIVE), or delete it with media__delete. Nothing was changed.`);
        for (const file of files) writes.push({ operation: adapter.delete!, id: file.id, name: `${file.attributes?.fileName ?? file.id} (replaced)` });
      } else if (args.replace === true) fail(`${resolved.parentId} has no ${target} to replace; omit replace. Nothing was changed.`);
      if (createBuild) writes.push({ operation: 'build_uploads.create', name: upload.fileName, body: createBuild });
      const attrs: Record<string, unknown> = { fileName: upload.fileName, fileSize: upload.size };
      if (adapter.format === 'asset' || adapter.format === 'build') attrs.assetType = str(args, 'asset_type', true);
      if (adapter.format === 'build') attrs.uti = uti;
      writes.push({ operation: adapter.create, name: upload.fileName, body: mediaBody(adapter.create, {
        // The resolved owner, which may be the version rather than a localization.
        attributes: attrs, ...(resolved.adapter.createParent ? { relationships: { [resolved.adapter.createParent]: mediaRelationship(adapter.create, resolved.adapter.createParent, resolved.parentId) } } : {}),
      }) });
      const commitAttributes = mediaDataSchema(adapter.update).properties.attributes.properties;
      // The spec offers SHA_256 here, but Apple answered 409 to it on a real
      // build commit (2026-10-27) and accepted the file's MD5.
      const attributes = { uploaded: true,
        ...(commitAttributes.sourceFileChecksums ? { sourceFileChecksums: { file: { algorithm: 'MD5', hash: upload.md5 } } }
          : commitAttributes.sourceFileChecksum ? { sourceFileChecksum: upload.md5 } : {}),
      };
      writes.push({ operation: adapter.update, id: '(reserved file)', name: upload.fileName,
        body: mediaBody(adapter.update, { id: '(reserved file)', attributes }) });
      if (adapter.attach && !standalone) writes.push({ operation: adapter.attach, id: resolved.parentId, name: upload.fileName,
        body: mediaBody(adapter.attach, { id: resolved.parentId, relationships: { headerImage: mediaRelationship(adapter.attach, 'headerImage', '(reserved file)') } }) });
    } else {
      if (target === 'build_upload_file') {
        if (args.file_ids !== undefined) fail('Build uploads delete as a whole; omit file_ids.');
        writes.push({ operation: 'build_uploads.delete', id: resolved.parentId, name: `Build upload ${resolved.parentLabel}` });
      } else for (const file of files) writes.push({ operation: adapter.delete!, id: file.id, name: file.attributes?.fileName ?? file.id });
    }
    const risk: RiskLevel = writes.some((write) => write.operation.endsWith('.delete')) ? 'destructive'
      : target === 'build_upload_file' && upload ? 'release' : standalone ? 'low' : adapter.risk;
    if (risk !== intentRisk(mediaIntent(name, args))) fail('Media plan risk differs from the preflight confirmation risk. Nothing was changed.');
    // No request may carry a higher generated risk than the plan is confirmed at.
    for (const write of writes) {
      const level = mediaOperation(write.operation).risk;
      if (level && level !== 'low' && level !== risk && risk !== 'destructive') fail(`${write.operation} is a ${level}-level write; the media plan is ${risk}. Nothing was changed.`);
    }
    const fingerprint = createHash('sha256').update(JSON.stringify({ app: resolved.app.id, target, parentId: resolved.parentId,
      parentLabel: resolved.parentLabel, parentFiles: resolved.parentFiles, ownerIds: resolved.ownerIds, files: files.map((file) => ({ id: file.id, fileSize: file.attributes?.fileSize ?? null })), writes,
      upload: upload?.sha256, createBuild, standalone,
    })).digest('hex');
    return { ...resolved, target, files, writes, risk, fingerprint, upload, createBuild, standalone };
  } catch (err) { await closeUpload(upload); throw err; }
}

const ARRANGE_ACTIONS = ['reorder', 'place', 'remove', 'poster', 'archive', 'rename'] as const;
type MediaAction = typeof ARRANGE_ACTIONS[number] | 'delete' | 'upload';
type Intent = { target: Target['target'] | FileTarget; action: MediaAction; ownerless?: boolean; replace?: boolean };
function mediaIntent(name: string, args: Args): Intent {
  if (!MEDIA_TOOL_NAMES.has(name) || name === MEDIA_NAMES.list) fail(`Unknown media write tool: ${name}`);
  const target = str(args, 'target', true)!;
  if (target !== 'library' && !Object.hasOwn(MEDIA_TARGETS, target)) fail(`Unknown media target: ${target}.`);
  if (Object.hasOwn(FILE_TARGETS, target)) {
    if (name === MEDIA_NAMES.arrange) fail(`${target} has no ordering or placements; media__arrange is unavailable.`);
    if (name === MEDIA_NAMES.delete && target !== 'build_upload_file' && !(FILE_TARGETS as Record<string, FileAdapter>)[target].delete) fail(`Apple does not offer DELETE for ${target}.`);
    const upload = name === MEDIA_NAMES.upload;
    return { target: target as FileTarget, action: upload ? 'upload' : 'delete', ownerless: upload && args.page_id === undefined, replace: upload && args.replace === true };
  }
  const action = name === MEDIA_NAMES.upload ? 'upload' : name === MEDIA_NAMES.delete ? (target === 'library' ? 'delete' : 'remove') : str(args, 'action', true)!;
  if (name === MEDIA_NAMES.arrange && !ARRANGE_ACTIONS.includes(action as typeof ARRANGE_ACTIONS[number])) fail(`Unknown media action: ${action}.`);
  if (name === MEDIA_NAMES.arrange && action === 'remove' && target === 'library') fail('Remove requires a named page target; library placements may be on live pages.');
  return { target: target as Target['target'], action: action as MediaAction };
}
function intentRisk(intent: Intent): RiskLevel {
  if (['delete', 'remove', 'archive'].includes(intent.action) || intent.replace) return 'destructive';
  if (Object.hasOwn(FILE_TARGETS, intent.target)) {
    const adapter = (FILE_TARGETS as Record<string, FileAdapter>)[intent.target];
    // Build file commit starts processing at release level, including on an
    // existing upload. An unattached image awaits an experience to name it.
    if (intent.action === 'upload' && intent.target === 'build_upload_file') return 'release';
    if (intent.ownerless && adapter.standalone) return 'low';
    return adapter.risk;
  }
  if (intent.target === 'library' && ['upload', 'rename'].includes(intent.action)) return 'low';
  return 'public';
}
function plannedRisk(intent: Intent, writes: Write[]): RiskLevel {
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
    [PAGE_TARGETS[page.target].relationship]: mediaRelationship(MEDIA_OPS.placement, PAGE_TARGETS[page.target].relationship, page.id),
  } });
}

/** Apple's reference feature behind each page target; the library answers for all of them. */
const FEATURE_OF: Partial<Record<Target['target'], string>> = { version: 'APP_STORE_VERSIONS', cpp: 'CUSTOM_PRODUCT_PAGES', ppo: 'PRODUCT_PAGE_OPTIMIZATIONS', event: 'IN_APP_EVENTS' };
const span = (min?: number, max?: number): string => (min === max ? `${min ?? '*'}` : `${min ?? '*'}–${max ?? '*'}`);
const seconds = (iso?: string): string => iso?.match(/^PT(\d+(?:\.\d+)?)S$/)?.[1] ?? iso ?? '*';
function specText(spec: any): string {
  const d = spec?.dimensions ?? {};
  return [
    d.minWidth !== undefined || d.maxWidth !== undefined || d.minHeight !== undefined || d.maxHeight !== undefined ? `${span(d.minWidth, d.maxWidth)}x${span(d.minHeight, d.maxHeight)}` : undefined,
    spec?.duration ? `${seconds(spec.duration.min)}–${seconds(spec.duration.max)}s` : undefined,
    typeof spec?.maxFileSize === 'number' ? `≤${Math.round(spec.maxFileSize / 1048576)} MB` : undefined,
  ].filter(Boolean).join(' ');
}
/**
 * The reference data, cut to what a placement needs. Apple's full answer is
 * ~64 KB on every call (82 image specs, every page type), which pushed a
 * three-file list past what a client will read (live run, 2026-10-27).
 */
function compactLimits(row: Row, target: Target['target']) {
  const a = row.attributes ?? {};
  const features: any[] = a.features ?? [];
  const wanted = FEATURE_OF[target];
  const kept = wanted && features.some((f) => f.featureId === wanted) ? features.filter((f) => f.featureId === wanted) : features;
  const specs = new Map<string, string>([...(a.imageSpecs ?? []), ...(a.videoSpecs ?? [])].map((s: any) => [s.specId, specText(s)]));
  const types = new Map<string, any>((a.placementTypes ?? []).map((t: any) => [t.placementTypeId, t]));
  return { id: row.id, policies: kept.flatMap((f) => (f.placementPolicies ?? []).flatMap((p: any) => (p.groupLimits ?? []).map((g: any) => {
    const type = types.get(p.placementType);
    return {
      feature: f.featureId, placementType: p.placementType, maxCount: g.maxCount ?? null,
      categories: type?.acceptsAssetCategories ?? [],
      groups: (g.groupIds ?? []).map((id: string) => ({ id, sizes: [...new Set<string>((type?.specMappings ?? []).filter((m: any) => m.placementGroupId === id).flatMap((m: any) => m.specs ?? []).map((s: string) => specs.get(s) ?? s))] })),
    };
  }))) };
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
      return { ...row, relationships: { ...row.relationships, [PAGE_TARGETS[target.pages[0].target].relationship]: { data: { id: target.pages[0].id } } } };
    });
  }
  const assetIds = [...new Set<string>(rows.map((p) => placementAsset(p) ?? fail(`Placement ${p.id} has no asset.`)))];
  const files = await libraryFiles(http, target, assetIds);
  for (const file of files) file.placements = rows.filter((p) => placementAsset(p) === file.id);
  return { rows, files };
}

async function prepareWrite(name: string, args: Args, http: AscHttpClient): Promise<Plan> {
  const intent = mediaIntent(name, args);
  for (const key of FILE_ONLY_KEYS) if (args[key] !== undefined) fail(`${key} is not supported for ${intent.target}.`);
  // Do file safety before any network request or reservation.
  const upload = name === MEDIA_NAMES.upload ? await readUpload(str(args, 'file_path', true)!) : undefined;
  try { return await planWrite(name, args, http, intent, upload); } catch (err) { await closeUpload(upload); throw err; }
}
async function planWrite(name: string, args: Args, http: AscHttpClient, intent: Intent, upload: UploadSource | undefined): Promise<Plan> {
  const target = await resolveTarget(args, http, true);
  const writes: Write[] = [];
  let files: File[] = [];
  if (upload) {
    // Apple's reference data gives each placement type one category: screenshots
    // and previews theirs, every other page asset CREATIVE_ASSETS.
    const placing = target.pages.length ? str(args, 'placement_type') : undefined;
    const category = str(args, 'category') ?? (placing ? (['APP_SCREENSHOT', 'IMESSAGE_APP_SCREENSHOT', 'APP_PREVIEW'].includes(placing) ? 'APP_SCREENSHOTS_AND_PREVIEWS' : 'CREATIVE_ASSETS') : str(args, 'category', true)!);
    if (!MEDIA_CATEGORIES.includes(category)) fail(`Unknown category: ${category}.`);
    if (target.target === 'library' && (args.placement_type !== undefined || args.placement_group !== undefined)) fail('Choose a page target to place the uploaded library file.');
    const poster = str(args, 'preview_frame_time_code');
    if (poster && upload.kind !== 'video') fail('Poster frames require a video.');
    const operation = MEDIA_ASSETS[upload.kind].create;
    writes.push({ operation, name: upload.fileName, body: mediaBody(operation, {
      attributes: { fileName: upload.fileName, fileSize: upload.size, category, ...(args.reference_name !== undefined ? { referenceName: str(args, 'reference_name', true) } : {}), ...(poster ? { previewFrameTimeCode: poster } : {}) },
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
        if (!PAGE_TARGETS[page.target].ordered) fail('Event placements have no order in Apple’s schema.');
        const group = str(args, 'placement_group', true)!;
        // Apple orders each placement type on its own (409 otherwise), so a
        // group holding screenshots and previews is two lists.
        const type = str(args, 'placement_type') ?? checked.rows[0]?.attributes?.placementType;
        if (checked.rows.some((p) => p.attributes?.placementType !== type)) fail('Reorder one placement type at a time: screenshots and previews are ordered separately.');
        const all = (await pagePlacements(http, page)).rows.filter((p) => p.attributes?.placementGroup === group && p.attributes?.placementType === type);
        const ids = checked.rows.map((p) => p.id);
        if (all.length !== ids.length || all.some((p) => !ids.includes(p.id))) fail(`Reorder requires every ${type} placement in one page/group, and nothing else; ${group} has ${all.length}.`);
        const op = MEDIA_OPS.reorder;
        const itemType = mediaDataSchema(op).properties.relationships.properties.orderedPlacements.properties.data.items.properties.type.enum[0];
        writes.push({ operation: op, name: files.map((f) => f.name).join(', '), body: mediaBody(op, { attributes: { placementGroup: group }, relationships: {
          orderedPlacements: { data: ids.map((id) => ({ type: itemType, id })) },
          [PAGE_TARGETS[page.target].relationship]: mediaRelationship(op, PAGE_TARGETS[page.target].relationship, page.id),
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
  const fingerprint = createHash('sha256').update(JSON.stringify({ app: target.app, libraryId: target.libraryId, target: target.target, pages: target.pages.map(({ state: _state, ...p }) => p), placements: files.map((f) => ({ id: f.id, placements: f.placements.map((p) => ({ id: p.id, page: placementPage(p)?.[1].relationship, pageId: placementPage(p) && relId(p, placementPage(p)![1].relationship) })) })), writes, upload: upload?.sha256 })).digest('hex');
  return { target, action: intent.action, files, writes, risk, fingerprint, upload };
}

export async function buildMediaPreview(name: string, args: Args, http: AscHttpClient) {
  if (Object.hasOwn(FILE_TARGETS, str(args, 'target', true)!)) {
    const plan = await prepareFileWrite(name, args, http);
    await closeUpload(plan.upload);
    const affected = plan.files.map((row) => `- ${row.attributes?.fileName ?? row.id} [${row.id}]`);
    const replaced = plan.upload && plan.writes.some((write) => write.operation.endsWith('.delete'));
    return { planFingerprint: plan.fingerprint, strong: STRONG_CONFIRM_LEVELS.has(plan.risk), message: [
      `Heimdall is about to ${replaced ? 'replace' : plan.upload ? 'upload' : 'delete'} ${plan.target} — a ${plan.risk.toUpperCase()}-level write.`, '',
      `App:        ${plan.app.name}`, `Target:     ${plan.target}, ${plan.parentLabel} [${plan.parentId}]`,
      `Existing files (${affected.length}):`, ...affected,
      ...(plan.upload ? [`New file:   ${plan.upload.fileName} (${plan.upload.size} bytes)`] : []),
      ...(plan.standalone ? ['Not attached: the new image ID goes in relationships.headerImage when the advanced experience is created.'] : []),
      ...(plan.upload && plan.adapter.attach && plan.files.length ? ['The current header image is detached, not deleted; Apple offers no DELETE for it.'] : []),
      `Changes (${plan.writes.length}):`, ...plan.writes.map((write) => `- ${write.name}: ${write.operation}${write.id ? ` [${write.id}]` : ''}`),
      `Risk:       ${plan.risk} — ${REVERSIBILITY[plan.risk]}`, '',
      STRONG_CONFIRM_LEVELS.has(plan.risk) ? 'Type CONFIRM in the field below to proceed.' : 'Confirm to proceed.',
    ].join('\n') };
  }
  const plan = await prepareWrite(name, args, http);
  await closeUpload(plan.upload);
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

/** Each reserved range is read from the checked descriptor in bounded reads
 * and sent; only one range is in memory at a time. The digest of what was
 * sent must equal the digest that was confirmed, or nothing is committed. */
async function uploadParts(ctx: MediaContext, reserved: any, source: UploadSource) {
  const ops: any[] = [...(reserved.data.attributes?.uploadOperations ?? [])].sort((a, b) => a.offset - b.offset);
  if (!ops.length) fail('Apple returned no upload operations.');
  let end = 0;
  for (const o of ops) {
    if (!Number.isSafeInteger(o.offset) || !Number.isSafeInteger(o.length) || o.offset !== end || o.length <= 0 || o.offset + o.length > source.size) fail('Invalid upload byte ranges.');
    end = o.offset + o.length;
  }
  if (end !== source.size) fail('Upload operations do not cover the complete file.');
  const largest = Math.max(...ops.map((o) => o.length));
  if (largest > MAX_PART_BYTES) fail(`Apple asked for a ${largest}-byte part; Heimdall holds at most ${MAX_PART_BYTES} bytes at once. Nothing was committed.`);
  if (stampOf(await source.fd.stat()) !== source.stamp) fail('File changed since it was checked; nothing was committed.');
  const digest = createHash('sha256');
  for (const op of ops) {
    const part = Buffer.alloc(op.length);
    for (let at = 0; at < part.length;) {
      const read = await source.fd.read(part, at, Math.min(CHUNK_BYTES, part.length - at), op.offset + at);
      if (!read.bytesRead) fail('File shrank during upload; nothing was committed.');
      at += read.bytesRead;
    }
    digest.update(part);
    await ctx.http.uploadAssetPart(op, part);
  }
  if (digest.digest('hex') !== source.sha256 || stampOf(await source.fd.stat()) !== source.stamp) fail('File changed during upload; nothing was committed.');
  return ops.length;
}

/** Recheck the approved bytes immediately before an irreversible replace. */
async function verifyUploadSource(source: UploadSource) {
  if (stampOf(await source.fd.stat()) !== source.stamp) fail('File changed since it was checked; existing file was not deleted.');
  const hash = createHash('sha256');
  const chunk = Buffer.alloc(Math.min(CHUNK_BYTES, source.size));
  for (let offset = 0; offset < source.size;) {
    const read = await source.fd.read(chunk, 0, Math.min(chunk.length, source.size - offset), offset);
    if (!read.bytesRead) fail('File shrank since it was checked; existing file was not deleted.');
    hash.update(chunk.subarray(0, read.bytesRead));
    offset += read.bytesRead;
  }
  if (hash.digest('hex') !== source.sha256 || stampOf(await source.fd.stat()) !== source.stamp)
    fail('File changed since it was checked; existing file was not deleted.');
}

async function executeFileWrite(name: string, args: Args, ctx: MediaContext) {
  const plan = await prepareFileWrite(name, args, ctx.http);
  try { return await runFileWrite(plan, ctx); } finally { await closeUpload(plan.upload); }
}
async function runFileWrite(plan: FilePlan, ctx: MediaContext) {
  if (ctx.approvedPlanFingerprint && plan.fingerprint !== ctx.approvedPlanFingerprint) fail('Media target or files changed since confirmation; retry and approve the current plan. Nothing was changed.');
  const summary = { app: `${plan.app.name} (${plan.app.id})`, target: plan.target, ownerId: plan.standalone ? null : plan.parentId, risk: plan.risk };
  if (ctx.dryRun) return { ...summary, dryRun: true, wouldSend: plan.writes.map((write) => ({
    method: write.operation.endsWith('.delete') ? 'DELETE' : write.operation.endsWith('.update') ? 'PATCH' : 'POST',
    path: mediaPath(write.operation, write.id), body: write.body, name: write.name,
  })), note: 'Resolved and checked; no bytes were sent.' };
  if (plan.upload) {
    // Replace: Apple's slot holds one file, so the old one goes first.
    const deleted: string[] = [];
    if (plan.writes.some((write) => write.operation.endsWith('.delete'))) await verifyUploadSource(plan.upload);
    for (const write of plan.writes.filter((w) => w.operation.endsWith('.delete'))) {
      try { await applyWrite(ctx.http, write); deleted.push(write.id!); }
      catch (err) { return { ...summary, ok: false, fileName: plan.upload.fileName, failedPhase: 'replace', error: errorText(err), deleted, note: 'Nothing was uploaded.' }; }
    }
    const done = deleted.length ? { deleted } : {};
    let ownerId = summary.ownerId;
    if (plan.createBuild) {
      const created: any = await ctx.http.post(mediaPath('build_uploads.create'), plan.createBuild);
      ownerId = created?.data?.id ?? fail('Apple created no build upload ID.');
    }
    const create = plan.writes.find((write) => write.operation === plan.adapter.create)!;
    const createBody = plan.createBuild ? mediaBody(plan.adapter.create, {
      attributes: (create.body as any).data.attributes,
      relationships: { buildUpload: mediaRelationship(plan.adapter.create, 'buildUpload', ownerId!) },
    }) : create.body;
    let reserved: any;
    try { reserved = await ctx.http.post(mediaPath(plan.adapter.create), createBody); }
    catch (err) { return { ...summary, ownerId, ...done, ok: false, fileName: plan.upload.fileName, failedPhase: 'reserve', error: errorText(err), inspectWith: MEDIA_NAMES.list }; }
    const id: string = reserved?.data?.id ?? fail('Apple reserved no file ID.');
    let phase = 'upload';
    try {
      const parts = await uploadParts(ctx, reserved, plan.upload);
      phase = 'commit';
      const commit = plan.writes.find((write) => write.operation === plan.adapter.update)!;
      const committed: any = await ctx.http.patch(mediaPath(plan.adapter.update, id), mediaBody(plan.adapter.update, { id, attributes: (commit.body as any).data.attributes }));
      const state = committed?.data?.attributes?.assetDeliveryState?.state ?? null;
      if (state === 'FAILED' || state === 'AWAITING_UPLOAD') return { ...summary, ownerId, ...done, ok: false, fileId: id, fileName: plan.upload.fileName, state, errors: errorsOf(committed?.data ?? {}), parts };
      if (plan.adapter.attach && !plan.standalone) {
        phase = 'attach';
        await ctx.http.patch(mediaPath(plan.adapter.attach, plan.parentId), mediaBody(plan.adapter.attach, { id: plan.parentId,
          relationships: { headerImage: mediaRelationship(plan.adapter.attach, 'headerImage', id) },
        }));
      }
      return { ...summary, ownerId, ...done, ok: true, fileId: id, fileName: plan.upload.fileName, state, errors: errorsOf(committed?.data ?? {}), parts,
        note: plan.standalone ? `Committed, not attached. Create the advanced experience with relationships.headerImage set to ${id}.` : 'Committed; inspect media__list for subsequent processing state.' };
    } catch (err) { return { ...summary, ownerId, ...done, ok: false, fileId: id, orphanReservationId: id, fileName: plan.upload.fileName, failedPhase: phase, error: errorText(err), inspectWith: MEDIA_NAMES.list,
      note: `Apple reserved file ${id}, but ${phase} did not finish. This reservation may be orphaned; inspect its state before retrying.` }; }
  }
  const succeeded = [], failed = [];
  for (const write of plan.writes) {
    try { await applyWrite(ctx.http, write); succeeded.push({ id: write.id, name: write.name }); }
    catch (err) { failed.push({ id: write.id, name: write.name, error: errorText(err) }); }
  }
  return { ...summary, ok: !failed.length, succeeded, failed };
}

export async function executeMediaTool(name: string, args: Args, ctx: MediaContext): Promise<unknown> {
  if (!MEDIA_TOOL_NAMES.has(name)) throw new Error(`Unknown media tool: ${name}`);
  if (name === MEDIA_NAMES.list) return listMedia(args, ctx.http);
  if (Object.hasOwn(FILE_TARGETS, str(args, 'target', true)!)) return executeFileWrite(name, args, ctx);
  const plan = await prepareWrite(name, args, ctx.http);
  try { return await runWrite(name, args, ctx, plan); } finally { await closeUpload(plan.upload); }
}
async function runWrite(name: string, args: Args, ctx: MediaContext, plan: Plan): Promise<unknown> {
  if (ctx.approvedPlanFingerprint && plan.fingerprint !== ctx.approvedPlanFingerprint) fail('Media target or files changed since confirmation; retry and approve the current plan. Nothing was changed.');
  const summary = { app: `${plan.target.app.name} (${plan.target.app.id})`, target: plan.target.target, libraryId: plan.target.libraryId, pages: plan.target.pages, risk: plan.risk };
  if (ctx.dryRun) return { ...summary, dryRun: true, wouldSend: plan.writes.map((w) => ({ method: w.operation.endsWith('.delete') ? 'DELETE' : w.operation.endsWith('.update') ? 'PATCH' : 'POST', path: mediaPath(w.operation, w.id), body: w.body, name: w.name })), note: 'Resolved and checked; nothing was reserved, uploaded, committed, placed or deleted.' };
  if (plan.upload) {
    const { kind, fileName } = plan.upload;
    const reserved = await applyWrite(ctx.http, plan.writes[0]);
    const id: string = reserved?.data?.id ?? fail('Apple reserved no asset ID.');
    let phase = 'upload';
    try {
      const parts = await uploadParts(ctx, reserved, plan.upload);
      phase = 'commit';
      const committed: any = await ctx.http.patch(mediaPath(MEDIA_ASSETS[kind].update, id), mediaBody(MEDIA_ASSETS[kind].update, { id, attributes: { uploaded: true } }));
      const state: string | null = committed?.data?.attributes?.state ?? null;
      const result = { ...summary, assetId: id, fileName, kind, state, errors: errorsOf(committed?.data ?? {}), parts };
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
    } catch (err) { return { ...summary, ok: false, assetId: id, orphanReservationId: id, fileName, failedPhase: phase, error: errorText(err), inspectWith: MEDIA_NAMES.list, deleteWith: MEDIA_NAMES.delete,
      note: `Apple reserved asset ${id}, but ${phase} did not finish. This reservation may be orphaned; inspect its state before retrying.` }; }
  }
  const succeeded = [], failed = [];
  for (const write of plan.writes) {
    try { const res = await applyWrite(ctx.http, write); succeeded.push({ id: write.id ?? res?.data?.id ?? null, name: write.name }); }
    catch (err) { failed.push({ id: write.id ?? null, name: write.name, error: errorText(err) }); }
  }
  return { ...summary, ok: !failed.length, succeeded, failed, note: failed.length ? `${succeeded.length} succeeded; ${failed.length} failed. Retry only failed items.` : `${succeeded.length} operation(s) completed.` };
}
