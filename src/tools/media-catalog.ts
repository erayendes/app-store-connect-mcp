/** Explicit media adapters. Paths and body types stay tied to Apple's catalog. */
import { OPERATIONS } from '../generated/operations.js';
import { BODY_SCHEMAS } from '../generated/body-schemas.js';
import { validateBody } from '../core/validate.js';
import { AscApiError } from '../core/errors.js';
import type { Operation } from '../core/types.js';

export const MEDIA_NAMES = { list: 'media__list', upload: 'media__upload', arrange: 'media__arrange', delete: 'media__delete' } as const;

export function mediaOperation(name: string): Operation {
  const op = OPERATIONS.find((o) => o.name === name);
  if (!op) throw new Error(`Missing media operation: ${name}`);
  return op;
}

export function mediaPath(name: string, id?: string): string {
  const op = mediaOperation(name);
  if (op.pathParams.length && !id) throw new Error(`Missing id for ${name}`);
  return op.path.replace('{id}', encodeURIComponent(id ?? ''));
}

export const MEDIA_OPS = {
  library: 'apps.asset_library.get',
  reference: 'app_asset_library_ref_data.list',
  placement: 'app_asset_library_placements.create',
  placementGet: 'app_asset_library_placements.get',
  placementDelete: 'app_asset_library_placements.delete',
  reorder: 'app_asset_library_placement_ordering_requests.create',
} as const;

export const MEDIA_ASSETS = {
  image: { list: 'app_asset_libraries.images.list', get: 'app_asset_library_images.get', create: 'app_asset_library_images.create', update: 'app_asset_library_images.update', delete: 'app_asset_library_images.delete', placements: 'app_asset_library_images.placements.list' },
  video: { list: 'app_asset_libraries.videos.list', get: 'app_asset_library_videos.get', create: 'app_asset_library_videos.create', update: 'app_asset_library_videos.update', delete: 'app_asset_library_videos.delete', placements: 'app_asset_library_videos.placements.list' },
} as const;
export type MediaKind = keyof typeof MEDIA_ASSETS;

export const MEDIA_TARGETS = {
  version: { relationship: 'appStoreVersionLocalization', get: 'app_store_version_localizations.get', placements: 'app_store_version_localizations.placements.list', ordered: true },
  cpp: { relationship: 'appCustomProductPageLocalization', get: 'app_custom_product_page_localizations.get', placements: 'app_custom_product_page_localizations.placements.list', ordered: true },
  ppo: { relationship: 'appStoreVersionExperimentTreatmentLocalization', get: 'app_store_version_experiment_treatment_localizations.get', placements: 'app_store_version_experiment_treatment_localizations.placements.list', ordered: true },
  event: { relationship: 'appEventLocalization', get: 'app_event_localizations.get', placements: 'app_event_localizations.placements.list', ordered: false },
} as const;
export type PageTarget = keyof typeof MEDIA_TARGETS;

/** These are fixed schema locations, not a schema interpretation engine. */
export function mediaDataSchema(operation: string): any {
  const ref = mediaOperation(operation).bodyRef;
  const schema: any = ref && BODY_SCHEMAS[ref];
  if (!schema?.properties?.data) throw new Error(`Missing media body schema: ${operation}`);
  return schema.properties.data;
}
export const MEDIA_CATEGORIES: string[] = mediaDataSchema(MEDIA_ASSETS.image.create).properties.attributes.properties.category.enum;
export const MEDIA_PLACEMENT_TYPES: string[] = mediaDataSchema(MEDIA_OPS.placement).properties.attributes.properties.placementType.enum;

export function mediaBody(operation: string, data: Record<string, unknown>): { data: Record<string, unknown> } {
  const op = mediaOperation(operation);
  const body = { data: { type: mediaDataSchema(operation).properties.type.enum[0], ...data } };
  const errors = validateBody(BODY_SCHEMAS[op.bodyRef!], body);
  if (errors.length) throw new AscApiError(errors.join('; '), 0);
  return body;
}

export function mediaRelationship(operation: string, relationship: string, id: string) {
  const schema = mediaDataSchema(operation).properties.relationships.properties[relationship];
  if (!schema) throw new AscApiError(`${relationship} is not supported by ${operation}.`, 0);
  return { data: { type: schema.properties.data.properties.type.enum[0], id } };
}
