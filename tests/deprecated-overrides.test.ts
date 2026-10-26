import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { validateDeprecatedOverrides } from '../scripts/deprecated-overrides.js';
import { OPERATIONS } from '../src/generated/operations.js';

const spec = JSON.parse(readFileSync('spec/openapi.json', 'utf8'));
const overrides = JSON.parse(readFileSync('spec/deprecated-overrides.json', 'utf8'));

describe('Apple 4.4.1 deprecation overrides', () => {
  it('marks exactly 28 existing unflagged operations as deprecated', () => {
    expect(overrides).toHaveLength(28);
    expect(validateDeprecatedOverrides(spec, overrides).size).toBe(28);
    for (const record of overrides) {
      expect(record.apiVersion).toBe('4.4.1');
      expect(record.url).toMatch(/^https:\/\/developer\.apple\.com\//);
      const operation = Object.values<any>(spec.paths).flatMap((p) => Object.values<any>(p))
        .find((o) => o?.operationId === record.operationId);
      expect(operation).toBeTruthy();
      expect(operation.deprecated).not.toBe(true);
      const entry = Object.entries<any>(spec.paths).flatMap(([path, methods]) =>
        Object.entries<any>(methods).map(([method, op]) => ({ path, method, op })))
        .find((row) => row.op?.operationId === record.operationId)!;
      const generated = OPERATIONS.find((o) => o.path === entry.path && o.method === entry.method.toUpperCase());
      expect(generated?.deprecated, record.operationId).toBe(true);
    }
  });
  it('rejects an override missing from the spec', () => {
    expect(() => validateDeprecatedOverrides(spec, [...overrides, { operationId: 'missing_createInstance', url: 'https://example.com', apiVersion: '4.4.1' }])).toThrow(/absent from spec/);
  });
  it('rejects an override once Apple marks it deprecated', () => {
    const copy = structuredClone(spec);
    const op = Object.values<any>(copy.paths).flatMap((p) => Object.values<any>(p)).find((o) => o?.operationId === overrides[0].operationId);
    op.deprecated = true;
    expect(() => validateDeprecatedOverrides(copy, overrides)).toThrow(/now marked by Apple/);
  });
});
