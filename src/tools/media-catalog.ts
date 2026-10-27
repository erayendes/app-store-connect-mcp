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
  libraryGet: 'app_asset_libraries.get',
  reference: 'app_asset_library_ref_data.list',
  referenceGet: 'app_asset_library_ref_data.get',
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

export const PAGE_TARGETS = {
  version: { relationship: 'appStoreVersionLocalization', get: 'app_store_version_localizations.get', placements: 'app_store_version_localizations.placements.list', ordered: true },
  cpp: { relationship: 'appCustomProductPageLocalization', get: 'app_custom_product_page_localizations.get', placements: 'app_custom_product_page_localizations.placements.list', ordered: true },
  ppo: { relationship: 'appStoreVersionExperimentTreatmentLocalization', get: 'app_store_version_experiment_treatment_localizations.get', placements: 'app_store_version_experiment_treatment_localizations.placements.list', ordered: true },
  event: { relationship: 'appEventLocalization', get: 'app_event_localizations.get', placements: 'app_event_localizations.placements.list', ordered: false },
} as const;
export type PageTarget = keyof typeof PAGE_TARGETS;

/** `group` is the alternate owner link: a Game Center item in a shared group
 * has no gameCenterDetail and is proven through the app's own detail instead. */
type ChainStep = { get: string; via: string; group?: string };
export type FileAdapter = {
  get: string; create: string; update: string; delete?: string;
  parentGet: string; files: string; read?: string; createParent?: string; attach?: string;
  chain: readonly ChainStep[]; appList?: string; appListFilter?: readonly string[]; parentInclude?: string;
  /** Apple's create takes no owner: the file exists before what will use it. */
  standalone?: boolean;
  /** One file per owner although the owner's relationship is a list. */
  single?: boolean;
  /** The same family under a second owner type, tried when page_id is not the first. */
  versionParent?: FileAdapter;
  format: 'image' | 'document' | 'attachment' | 'geojson' | 'asset' | 'build';
  risk: 'public' | 'low';
};
const fileTarget = (family: string, parentGet: string, files: string, chain: readonly ChainStep[], format: FileAdapter['format'], risk: FileAdapter['risk'], options: Partial<FileAdapter> = {}): FileAdapter => ({
  get: `${family}.get`, create: `${family}.create`, update: `${family}.update`,
  delete: `${family}.delete`, parentGet, files, chain, format, risk, ...options,
});
const gameCenterOwner = [{ get: 'game_center_details.get', via: 'gameCenterDetail', group: 'gameCenterGroup' }, { get: 'apps.get', via: 'app' }] as const;

/** Parent relationships provide both listing and the ownership proof. */
export const FILE_TARGETS = {
  app_clip_header_image: fileTarget('app_clip_header_images', 'app_clip_default_experience_localizations.get', 'appClipHeaderImage', [
    { get: 'app_clip_default_experiences.get', via: 'appClipDefaultExperience' }, { get: 'app_clips.get', via: 'appClip' }, { get: 'apps.get', via: 'app' },
  ], 'image', 'public', { createParent: 'appClipDefaultExperienceLocalization', read: 'app_clip_default_experience_localizations.app_clip_header_image.get' }),
  // A new advanced experience requires headerImage in its create request, so
  // the image is uploaded first, without page_id, and named by that create.
  app_clip_advanced_experience_image: fileTarget('app_clip_advanced_experience_images', 'app_clip_advanced_experiences.get', 'headerImage', [
    { get: 'app_clips.get', via: 'appClip' }, { get: 'apps.get', via: 'app' },
  ], 'image', 'public', { delete: undefined, attach: 'app_clip_advanced_experiences.update', standalone: true }),
  game_center_achievement_image: fileTarget('game_center_achievement_images_v2', 'game_center_achievement_localizations_v2.get', 'image', [
    { get: 'game_center_achievement_versions_v2.get', via: 'version' }, { get: 'game_center_achievements_v2.get', via: 'achievement' }, ...gameCenterOwner,
  ], 'image', 'public', { createParent: 'localization', read: 'game_center_achievement_localizations_v2.image.get' }),
  game_center_leaderboard_image: fileTarget('game_center_leaderboard_images_v2', 'game_center_leaderboard_localizations_v2.get', 'image', [
    { get: 'game_center_leaderboard_versions_v2.get', via: 'version' }, { get: 'game_center_leaderboards_v2.get', via: 'leaderboard' }, ...gameCenterOwner,
  ], 'image', 'public', { createParent: 'localization', read: 'game_center_leaderboard_localizations_v2.image.get' }),
  game_center_leaderboard_set_image: fileTarget('game_center_leaderboard_set_images_v2', 'game_center_leaderboard_set_localizations_v2.get', 'image', [
    { get: 'game_center_leaderboard_set_versions_v2.get', via: 'version' }, { get: 'game_center_leaderboard_sets_v2.get', via: 'leaderboardSet' }, ...gameCenterOwner,
  ], 'image', 'public', { createParent: 'localization', read: 'game_center_leaderboard_set_localizations_v2.image.get' }),
  // Activity and challenge images are also created under relationships.version,
  // as that version's default image: page_id may name either owner.
  game_center_activity_image: fileTarget('game_center_activity_images', 'game_center_activity_localizations.get', 'image', [
    { get: 'game_center_activity_versions.get', via: 'version' }, { get: 'game_center_activities.get', via: 'activity' }, ...gameCenterOwner,
  ], 'image', 'public', { createParent: 'localization', read: 'game_center_activity_localizations.image.get',
    versionParent: fileTarget('game_center_activity_images', 'game_center_activity_versions.get', 'defaultImage', [
      { get: 'game_center_activities.get', via: 'activity' }, ...gameCenterOwner,
    ], 'image', 'public', { createParent: 'version', read: 'game_center_activity_versions.default_image.get' }) }),
  game_center_challenge_image: fileTarget('game_center_challenge_images', 'game_center_challenge_localizations.get', 'image', [
    { get: 'game_center_challenge_versions.get', via: 'version' }, { get: 'game_center_challenges.get', via: 'challenge' }, ...gameCenterOwner,
  ], 'image', 'public', { createParent: 'localization', read: 'game_center_challenge_localizations.image.get',
    versionParent: fileTarget('game_center_challenge_images', 'game_center_challenge_versions.get', 'defaultImage', [
      { get: 'game_center_challenges.get', via: 'challenge' }, ...gameCenterOwner,
    ], 'image', 'public', { createParent: 'version', read: 'game_center_challenge_versions.default_image.get' }) }),
  // One image per version: Apple answers a second create with 409 although
  // the version also exposes an `images` list.
  in_app_purchase_image: fileTarget('in_app_purchase_images_v2', 'in_app_purchase_versions.get', 'images', [
    { get: 'in_app_purchases_v2.get', via: 'inAppPurchase' },
  ], 'image', 'public', { createParent: 'version', appList: 'apps.in_app_purchases_v2.list', appListFilter: ['productId'], read: 'in_app_purchase_versions.images.list', single: true }),
  in_app_purchase_review_screenshot: fileTarget('in_app_purchase_app_store_review_screenshots', 'in_app_purchases_v2.get', 'appStoreReviewScreenshot', [], 'image', 'low', { createParent: 'inAppPurchaseV2', appList: 'apps.in_app_purchases_v2.list', appListFilter: ['productId'], read: 'in_app_purchases_v2.app_store_review_screenshot.get' }),
  subscription_image: fileTarget('subscription_images_v2', 'subscription_versions.get', 'images', [
    { get: 'subscriptions.get', via: 'subscription' }, { get: 'subscription_groups.get', via: 'group' },
  ], 'image', 'public', { createParent: 'version', appList: 'apps.subscription_groups.list', read: 'subscription_versions.images.list', single: true }),
  subscription_review_screenshot: fileTarget('subscription_app_store_review_screenshots', 'subscriptions.get', 'appStoreReviewScreenshot', [
    { get: 'subscription_groups.get', via: 'group' },
  ], 'image', 'low', { createParent: 'subscription', appList: 'apps.subscription_groups.list', read: 'subscriptions.app_store_review_screenshot.get' }),
  encryption_document: fileTarget('app_encryption_declaration_documents', 'app_encryption_declarations.get', 'appEncryptionDeclarationDocument', [
    { get: 'apps.get', via: 'app' },
  ], 'document', 'low', { createParent: 'appEncryptionDeclaration', delete: undefined, read: 'app_encryption_declarations.app_encryption_declaration_document.get' }),
  app_review_attachment: fileTarget('app_store_review_attachments', 'app_store_review_details.get', 'appStoreReviewAttachments', [
    { get: 'app_store_versions.get', via: 'appStoreVersion' }, { get: 'apps.get', via: 'app' },
  ], 'attachment', 'low', { createParent: 'appStoreReviewDetail', read: 'app_store_review_details.app_store_review_attachments.list' }),
  routing_coverage: fileTarget('routing_app_coverages', 'app_store_versions.get', 'routingAppCoverage', [
    { get: 'apps.get', via: 'app' },
  ], 'geojson', 'low', { createParent: 'appStoreVersion', read: 'app_store_versions.routing_app_coverage.get' }),
  background_asset_file: fileTarget('background_asset_upload_files', 'background_asset_versions.get', 'backgroundAssetUploadFiles', [
    { get: 'background_assets.get', via: 'backgroundAsset' }, { get: 'apps.get', via: 'app' },
  ], 'asset', 'low', { createParent: 'backgroundAssetVersion', delete: undefined, read: 'background_asset_versions.background_asset_upload_files.list' }),
  // A build upload has no app relationship. The app's list filtered by this
  // upload's own versions and platform proves it without paging every upload.
  build_upload_file: fileTarget('build_upload_files', 'build_uploads.get', 'buildUploadFiles', [], 'build', 'low', { createParent: 'buildUpload', delete: undefined, appList: 'apps.build_uploads.list',
    appListFilter: ['cfBundleVersion', 'cfBundleShortVersionString', 'platform'], parentInclude: 'build', read: 'build_uploads.build_upload_files.list' }),
} as const satisfies Record<string, FileAdapter>;
export type FileTarget = keyof typeof FILE_TARGETS;
export const MEDIA_TARGETS = { ...PAGE_TARGETS, ...FILE_TARGETS };

/** These are fixed schema locations, not a schema interpretation engine. */
export function mediaDataSchema(operation: string): any {
  const ref = mediaOperation(operation).bodyRef;
  const schema: any = ref && BODY_SCHEMAS[ref];
  if (!schema?.properties?.data) throw new Error(`Missing media body schema: ${operation}`);
  return schema.properties.data;
}
export const MEDIA_CATEGORIES: string[] = mediaDataSchema(MEDIA_ASSETS.image.create).properties.attributes.properties.category.enum;
export const MEDIA_PLACEMENT_TYPES: string[] = mediaDataSchema(MEDIA_OPS.placement).properties.attributes.properties.placementType.enum;
/** Per target: background files take no ASSET_SPI. */
export const mediaAssetTypes = (adapter: FileAdapter): string[] => mediaDataSchema(adapter.create).properties.attributes.properties.assetType?.enum ?? [];
export const MEDIA_FILE_ASSET_TYPES: string[] = [...new Set<string>([FILE_TARGETS.background_asset_file, FILE_TARGETS.build_upload_file].flatMap(mediaAssetTypes))];
export const MEDIA_BUILD_UTIS: string[] = mediaDataSchema(FILE_TARGETS.build_upload_file.create).properties.attributes.properties.uti.enum;

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
