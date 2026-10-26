import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { validateDeprecatedOverrides } from '../scripts/deprecated-overrides.js';
import { OPERATIONS } from '../src/generated/operations.js';
import { ToolRegistry } from '../src/core/registry.js';

const spec = JSON.parse(readFileSync('spec/openapi.json', 'utf8'));
const overrides = JSON.parse(readFileSync('spec/deprecated-overrides.json', 'utf8'));

describe('Apple deprecation overrides', () => {
  it('marks exactly the recorded 4.4.1 and six 4.5.1 media families', () => {
    expect(overrides.filter((record: any) => record.apiVersion === '4.4.1')).toHaveLength(28);
    const media = overrides.filter((record: any) => record.apiVersion === '4.5.1');
    const families = {
      appEventScreenshots: ['createInstance', 'getInstance', 'updateInstance', 'deleteInstance'],
      appEventVideoClips: ['createInstance', 'getInstance', 'updateInstance', 'deleteInstance'],
      appPreviewSets: ['createInstance', 'getInstance', 'deleteInstance', 'appPreviews_getToManyRelationship', 'appPreviews_replaceToManyRelationship', 'appPreviews_getToManyRelated'],
      appPreviews: ['createInstance', 'getInstance', 'updateInstance', 'deleteInstance'],
      appScreenshotSets: ['createInstance', 'getInstance', 'deleteInstance', 'appScreenshots_getToManyRelationship', 'appScreenshots_replaceToManyRelationship', 'appScreenshots_getToManyRelated'],
      appScreenshots: ['createInstance', 'getInstance', 'updateInstance', 'deleteInstance'],
      appCustomProductPageLocalizations: ['appPreviewSets_getToManyRelationship', 'appPreviewSets_getToManyRelated', 'appScreenshotSets_getToManyRelationship', 'appScreenshotSets_getToManyRelated'],
      appEventLocalizations: ['appEventScreenshots_getToManyRelationship', 'appEventScreenshots_getToManyRelated', 'appEventVideoClips_getToManyRelationship', 'appEventVideoClips_getToManyRelated'],
      appStoreVersionExperimentTreatmentLocalizations: ['appPreviewSets_getToManyRelationship', 'appPreviewSets_getToManyRelated', 'appScreenshotSets_getToManyRelationship', 'appScreenshotSets_getToManyRelated'],
      appStoreVersionLocalizations: ['appPreviewSets_getToManyRelationship', 'appPreviewSets_getToManyRelated', 'appScreenshotSets_getToManyRelationship', 'appScreenshotSets_getToManyRelated'],
    };
    const expected = Object.entries(families).flatMap(([prefix, suffixes]) => suffixes.map((suffix) => `${prefix}_${suffix}`));
    expect(media.map((record: any) => record.operationId).sort()).toEqual(expected.sort());
    expect(overrides).toHaveLength(72);
    expect(validateDeprecatedOverrides(spec, overrides).size).toBe(72);
    for (const record of overrides) {
      expect(['4.4.1', '4.5.1']).toContain(record.apiVersion);
      expect(record.url).toMatch(/^https:\/\/developer\.apple\.com\//);
      const operation = Object.values<any>(spec.paths).flatMap((p) => Object.values<any>(p))
        .find((o) => o?.operationId === record.operationId);
      expect(operation).toBeTruthy();
      expect(operation.deprecated).not.toBe(true);
      const entry = Object.entries<any>(spec.paths).flatMap(([path, methods]) =>
        Object.entries<any>(methods).map(([method, op]) => ({ path, method, op })))
        .find((row) => row.op?.operationId === record.operationId)!;
      const generated = OPERATIONS.find((o) => o.path === entry.path && o.method === entry.method.toUpperCase());
      // The generator omits GET /relationships twins when the related GET
      // returns the same data. The override still guards the source spec ID.
      if (generated) expect(generated.deprecated, record.operationId).toBe(true);
      else {
        expect(entry.path).toContain('/relationships/');
        expect(spec.paths[entry.path.replace('/relationships/', '/')]?.get).toBeTruthy();
      }
    }
  });
  it('rejects an override missing from the spec', () => {
    expect(() => validateDeprecatedOverrides(spec, [...overrides, { operationId: 'missing_createInstance', url: 'https://example.com', apiVersion: '4.4.1' }])).toThrow(/absent from spec/);
  });
  it('loads all six retired media families only with --include-deprecated in profile-less mode', () => {
    const names = [
      'app_screenshot_sets.create', 'app_screenshots.create',
      'app_preview_sets.create', 'app_previews.create',
      'app_event_screenshots.create', 'app_event_video_clips.create',
    ];
    const normal = new ToolRegistry({ domains: ['all'], readOnly: false, includeDeprecated: false });
    const legacy = new ToolRegistry({ domains: ['all'], readOnly: false, includeDeprecated: true });
    for (const name of names) {
      expect(normal.get(name), name).toBeUndefined();
      expect(legacy.get(name), name).toBeTruthy();
    }
  });
  it('rejects an override once Apple marks it deprecated', () => {
    const copy = structuredClone(spec);
    const op = Object.values<any>(copy.paths).flatMap((p) => Object.values<any>(p)).find((o) => o?.operationId === overrides[0].operationId);
    op.deprecated = true;
    expect(() => validateDeprecatedOverrides(copy, overrides)).toThrow(/now marked by Apple/);
  });
});
