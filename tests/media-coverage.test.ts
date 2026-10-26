import { describe, expect, it } from 'vitest';
import { MACRO_COVERED, PROFILES } from '../src/profiles.js';
import { MEDIA_TARGETS } from '../src/tools/media-catalog.js';

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
    'app_asset_libraries.videos.list', 'app_asset_library_images.get', 'app_asset_library_videos.get',
    'app_asset_library_images.placements.list', 'app_asset_library_videos.placements.list',
    placementGet, 'app_asset_library_ref_data.list', 'app_asset_library_ref_data.get',
  ] },
  { target: 'library', action: 'upload', macro: 'media__upload', operations: assetCreates },
  { target: 'library', action: 'reorder', macro: 'media__arrange', operations: [placementGet, reorder] },
  { target: 'library', action: 'remove', macro: 'media__arrange', operations: [placementGet, placementDelete] },
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
    { target, action: 'list', macro: 'media__list', operations: [listOp] },
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
    expect(actionsFor('library')).toEqual(['list', 'upload', 'reorder', 'remove', 'poster', 'archive', 'rename', 'delete'].sort());
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
});
