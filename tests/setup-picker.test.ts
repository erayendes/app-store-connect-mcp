/**
 * The picker writes the user's MCP client config. Everything it gets wrong is
 * silent: a profile registered with the wrong argument still starts, still
 * connects, and just quietly serves the wrong tools.
 *
 * Runs against the real profile data rather than a fixture, so a curation
 * change that breaks the round-trip fails here instead of in someone's config.
 */
import { describe, it, expect } from 'vitest';
import { buildRows, preselect, selectionToSpecs } from '../src/setup.js';
import { PROFILES, resolveSelection } from '../src/profiles.js';

const rows = buildRows();
const rowFor = (profile: string, sub?: string) =>
  rows.find((r) => r.profile.name === profile && (sub ? r.subProfile?.name === sub : !r.subProfile))!;
const allIndices = rows.map((r) => r.index);

describe('the picker rows', () => {
  it('lists every profile once, with its named sub-profiles under it', () => {
    const parents = rows.filter((r) => !r.subProfile);
    expect(parents).toHaveLength(PROFILES.length);
    for (const p of PROFILES) {
      const children = rows.filter((r) => r.profile.name === p.name && r.subProfile);
      expect(children).toHaveLength(p.subProfiles.filter((s) => s.name).length);
      // A child must point at its own parent row, not at whatever came before it.
      for (const c of children) expect(c.item.parent).toBe(rowFor(p.name).index);
    }
  });

  it('shows a tool count and a size on every row', () => {
    for (const r of rows) {
      expect(r.item.label).toMatch(/\(\d+\)$/);
      expect(r.item.hint).toMatch(/^~\d+k · ./);
    }
  });
});

describe('selection -> config argument', () => {
  it('writes a bare profile name when everything under it is checked', () => {
    // The common case has to produce exactly today's config: no colon, no diff.
    expect(selectionToSpecs(rows, allIndices)).toEqual(PROFILES.map((p) => p.name));
  });

  it('writes profile:sub,sub when some are unchecked', () => {
    const parent = rowFor('monetization');
    const keep = ['subscription-pricing', 'subscription-offers'];
    const picked = [parent.index, ...keep.map((s) => rowFor('monetization', s).index)];
    expect(selectionToSpecs(rows, picked)).toEqual([
      'monetization:subscription-offers,subscription-pricing',
    ]);
  });

  it('drops a profile whose sub-profiles are all unchecked', () => {
    // applyAction already unchecks the parent in that case; this is the belt
    // to that suspenders — a profile with an empty sub-profile list is not a
    // thing the CLI can parse.
    expect(selectionToSpecs(rows, [rowFor('monetization').index])).toEqual([]);
  });

  it('writes a bare name for a profile that has no sub-profiles', () => {
    expect(selectionToSpecs(rows, [rowFor('webhooks').index])).toEqual(['webhooks']);
  });

  it('ignores a checked sub-profile whose parent is unchecked', () => {
    expect(selectionToSpecs(rows, [rowFor('monetization', 'storekit').index])).toEqual([]);
  });

  it('emits nothing but arguments the server can actually resolve', () => {
    for (const spec of selectionToSpecs(rows, allIndices)) {
      expect(() => resolveSelection(spec)).not.toThrow();
    }
    const narrowed = selectionToSpecs(rows, [
      rowFor('access').index,
      rowFor('access', 'beta-groups').index,
      rowFor('distribution').index,
      rowFor('distribution', 'version').index,
      rowFor('distribution', 'encryption').index,
    ]);
    expect(narrowed).toEqual(['access:beta-groups', 'distribution:encryption,version']);
    for (const spec of narrowed) expect(() => resolveSelection(spec)).not.toThrow();
  });
});

describe('round trip — re-running setup must not rewrite a config it did not change', () => {
  const roundTrip = (registered: Record<string, string>): string[] =>
    selectionToSpecs(rows, preselect(rows, new Map(Object.entries(registered))));

  it('keeps a full profile full', () => {
    expect(roundTrip({ monetization: 'monetization', webhooks: 'webhooks' })).toEqual([
      'monetization',
      'webhooks',
    ]);
  });

  it('keeps a narrowed profile narrowed', () => {
    // Without reading the registered argument this used to come back widened —
    // the user's trimming silently undone by opening the picker.
    const spec = 'monetization:subscription-pricing';
    expect(roundTrip({ monetization: spec })).toEqual([spec]);
  });

  it('preserves the order the CLI writes, not the order the user typed', () => {
    // Sub-profiles come back in row order, so the same selection always writes
    // the same string and re-registration stays a no-op.
    const out = roundTrip({ monetization: 'monetization:subscription-pricing,iap-pricing' });
    expect(out).toEqual(['monetization:iap-pricing,subscription-pricing']);
    expect(roundTrip({ monetization: out[0] })).toEqual(out);
  });
});
