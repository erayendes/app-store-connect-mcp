/**
 * The picker writes the user's MCP client config. Everything it gets wrong is
 * silent: a profile registered with the wrong argument still starts, still
 * connects, and just quietly serves the wrong tools.
 *
 * Runs against the real profile data rather than a fixture, so a curation
 * change that breaks the round-trip fails here instead of in someone's config.
 */
import { describe, it, expect } from 'vitest';
import {
  DOES,
  NARROW_FIRST,
  PLAIN,
  ROLES,
  buildRows,
  leafRows,
  neededRole,
  preselect,
  selectionToSpecs,
} from '../src/setup.js';
import {
  PROFILES,
  resolveSelection,
  operationsFor,
  manualToolsFor,
  CORE_PROFILE,
} from '../src/profiles.js';

const rows = buildRows();
const rowFor = (profile: string, sub?: string) =>
  rows.find((r) => r.profile.name === profile && (sub ? r.subProfile?.name === sub : !r.subProfile))!;
const allIndices = rows.map((r) => r.index);
/** Core is never a row: it comes with whatever is picked. */
const PICKABLE = PROFILES.filter((p) => p.name !== CORE_PROFILE);

describe('the picker rows', () => {
  it('lists every profile but core once, with its named sub-profiles under it', () => {
    const parents = rows.filter((r) => !r.subProfile);
    expect(parents).toHaveLength(PICKABLE.length);
    expect(rows.some((r) => r.profile.name === CORE_PROFILE)).toBe(false);
    for (const p of PICKABLE) {
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

  it('counts a profile as the union of its sub-profiles, not their sum', () => {
    // A tool can belong to several sub-profiles on purpose — the screenshot and
    // preview tools sit under every page that can list a set. Summing the rows
    // counts those twice, and the number the user picks by stops matching the
    // number of tools the server loads.
    for (const p of PICKABLE) {
      const sel = resolveSelection(p.name);
      const served = operationsFor(sel).length + manualToolsFor(sel).length;
      const shown = Number(rowFor(p.name).item.label.match(/\((\d+)\)$/)![1]);
      expect(shown, `${p.name} row says ${shown}, the server loads ${served}`).toBe(served);
    }
  });
});

describe('selection -> config argument', () => {
  it('writes a bare profile name when everything under it is checked', () => {
    // The common case has to produce exactly today's config: no colon, no diff.
    expect(selectionToSpecs(rows, allIndices)).toEqual(PICKABLE.map((p) => p.name));
  });

  it('writes profile:sub,sub when some are unchecked', () => {
    const parent = rowFor('monetization');
    const keep = ['subscription-offers', 'subscription'];
    const picked = [parent.index, ...keep.map((s) => rowFor('monetization', s).index)];
    expect(selectionToSpecs(rows, picked)).toEqual([
      'monetization:subscription,subscription-offers',
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
    expect(selectionToSpecs(rows, [rowFor('monetization', 'transactions').index])).toEqual([]);
  });

  it('emits nothing but arguments the server can actually resolve', () => {
    for (const spec of selectionToSpecs(rows, allIndices)) {
      expect(() => resolveSelection(spec)).not.toThrow();
    }
    const narrowed = selectionToSpecs(rows, [
      rowFor('testflight').index,
      rowFor('testflight', 'groups').index,
      rowFor('distribution').index,
      rowFor('distribution', 'version').index,
      rowFor('distribution', 'app-encryption').index,
    ]);
    expect(narrowed).toEqual(['distribution:app-encryption,version', 'testflight:groups']);
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
    const spec = 'monetization:subscription';
    expect(roundTrip({ monetization: spec })).toEqual([spec]);
  });

  it('preserves the order the CLI writes, not the order the user typed', () => {
    // Sub-profiles come back in row order, so the same selection always writes
    // the same string and re-registration stays a no-op.
    const out = roundTrip({ monetization: 'monetization:subscription,in-app-purchases' });
    expect(out).toEqual(['monetization:in-app-purchases,subscription']);
    expect(roundTrip({ monetization: out[0] })).toEqual(out);
  });
});

/**
 * The role setup recommends: the narrowest one every pick allows, Admin when
 * one pick needs it or nothing narrower is shared.
 */
describe('the key role the picks need', () => {
  const rows = buildRows();
  const role = (...specs: string[]) => neededRole(leafRows(rows, specs));

  it('suggests a narrow role when the picks share one', () => {
    expect(role('marketing:customer-reviews').role).toBe('Customer Support');
  });

  it('falls back to Admin when the picks share nothing narrower', () => {
    const r = role('analytics', 'testflight');
    expect(r.role).toBe('Admin');
    expect(r.why).toMatch(/no narrower role/);
  });

  it('names the pick that only Admin can manage, even inside a whole profile', () => {
    const r = role('access');
    expect(r.role).toBe('Admin');
    expect(r.why).toMatch(/access:user-management/);
  });

  // A key in ROLES that names no sub-profile is a role rule that never fires —
  // which is how `access:users` outlived its sub-profile when 3.0 renamed it.
  it('keys roles only by profiles and sub-profiles that exist', () => {
    for (const key of Object.keys(ROLES)) expect(() => resolveSelection(key), key).not.toThrow();
  });
});

/**
 * Setup describes every choice three ways: the key role it needs, a plain
 * name, and what it is for. A profile or sub-profile missing from any of them
 * falls back to a guess (App Manager) or to nothing on the page — so each one
 * has to be written down, and a new sub-profile fails here until it is.
 */
describe('every choice is described', () => {
  const keys = PROFILES.flatMap((p) => [p.name, ...p.subProfiles.filter((s) => s.name).map((s) => `${p.name}:${s.name}`)]);

  it.each([['ROLES', ROLES], ['PLAIN', PLAIN], ['DOES', DOES]] as const)('%s covers every profile and sub-profile', (_name, table) => {
    expect(keys.filter((k) => !(k in table))).toEqual([]);
    expect(Object.keys(table).filter((k) => !keys.includes(k))).toEqual([]);
    for (const k of keys) expect((table as Record<string, unknown>)[k], k).toBeTruthy();
  });

  it('names only real roles', () => {
    for (const [key, roles] of Object.entries(ROLES)) {
      expect(roles.length, key).toBeGreaterThan(0);
      for (const r of roles) expect(NARROW_FIRST, `${key}: ${r}`).toContain(r);
    }
  });
});
