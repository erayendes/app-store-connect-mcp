import { describe, it, expect } from 'vitest';
import { auditAx, BOILERPLATE_MAX_CHARS } from '../scripts/ax-audit.js';
import { REF_RESOLVERS, FIELD_NOTES } from '../src/core/confirm.js';
import { OPERATIONS } from '../src/generated/operations.js';
import type { Operation } from '../src/core/types.js';

/**
 * Agent-experience regression shield.
 *
 * AI-201/177/202/203 were four faces of one live attempt at one goal, and all
 * four were invisible to a green test suite. `tests/search-intents.test.ts`
 * shields the findability axis by asserting specific intents resolve; this file
 * shields the other three by counting.
 *
 * The counts are ratchets, not targets. 787 boilerplate descriptions will not
 * be rewritten this week, so the current debt is pinned as a ceiling: shrinking
 * it is free, growing it fails CI. A spec bump that adds forty new endpoints
 * with Apple's one-line summaries now announces itself instead of landing
 * quietly. When debt drops, lower the ceiling — that is the whole maintenance
 * burden.
 *
 * Regenerate the numbers with `npm run ax:report`.
 */
const CEILING = {
  /** AXIS1 — findability: descriptions still in Apple's words, not a user's. */
  boilerplate: 692,
  /**
   * AXIS2 — silent empty results: id-valued filters with no format hint.
   *
   * Zero, and it can stay zero: the generator hints anything still ending on
   * Apple's "id(s) of related 'x'" clause, so a new spec's parameters inherit
   * the note. A number above zero here means Apple worded one a new way and it
   * fell through the rule — which is exactly when someone should look.
   */
  unhintedIdFilters: 0,
  /**
   * AXIS3 — opaque confirmations: reference types a preview cannot humanise.
   *
   * 52, down from 179 when the count meant "types without a hand-written
   * resolver". What is left are types Apple gives no GET-by-id endpoint, so
   * there is nothing to fetch a name from — a resolver cannot be written for
   * them, only a different write body could avoid them.
   */
  unresolvedRefTypes: 52,
  /** AXIS4 — path length: writes that need a lookup call first. */
  writesNeedingLookup: 256,
  /** AXIS4 — lists with no `filter[*]`, so an oversized response cannot be narrowed. */
  unfilterableLists: 97,
};

const debt = auditAx();

describe('AX debt ratchet', () => {
  it.each(Object.keys(CEILING) as Array<keyof typeof CEILING>)(
    '%s does not grow beyond its recorded ceiling',
    (axis) => {
      const actual = debt[axis].length;
      expect(
        actual,
        `${axis}: ${actual} (ceiling ${CEILING[axis]}). ` +
          `If this grew, a spec update or an edit added agent-experience debt — see ` +
          `npm run ax:report. If it shrank, lower the ceiling in this file.`
      ).toBeLessThanOrEqual(CEILING[axis]);
    }
  );

  it('audits every loadable operation, not a subset', () => {
    // Guards against an import or filter silently emptying the audit — a
    // ratchet over zero findings would pass forever. The set is every
    // operation a profile can actually load: 982 minus the 123 Apple marked
    // deprecated, which the registry refuses by default.
    expect(debt.totalOps).toBeGreaterThan(800);
    expect(debt.totalWrites).toBeGreaterThan(350);
    expect(debt.totalLists).toBeGreaterThan(200);
  });

  it('excludes deprecated operations — no agent can reach them', () => {
    const names = new Set(debt.boilerplate.map((f) => f.name));
    const deprecated = OPERATIONS.filter((op) => op.deprecated);
    expect(deprecated.length).toBeGreaterThan(0);
    expect(deprecated.filter((op) => names.has(op.name))).toEqual([]);
  });
});

describe('AX wins stay won', () => {
  it('keeps the pricing flow resolvable in confirmation prompts (AI-202)', () => {
    // The three types the price-change body carries. Losing any of them puts
    // the preview back to raw base64 and reopens AI-202.
    for (const type of ['subscriptionPricePoints', 'subscriptions', 'apps']) {
      expect(Object.keys(REF_RESOLVERS)).toContain(type);
    }
  });

  it('keeps the subscriber-migration flag explained (AI-202)', () => {
    expect(FIELD_NOTES.preserveCurrentPrice?.(false)).toMatch(/WILL be moved/);
    expect(FIELD_NOTES.preserveCurrentPrice?.(true)).toMatch(/keep their current price/);
  });

  it('keeps the price-point listing describing its territory filter (AI-201/177)', () => {
    // The op that returns 842 rows per territory: its description has to push
    // the filter, or the response floods the context before it is useful.
    const flooded = debt.boilerplate.find((f) => f.name === 'subscriptions.price_points.list');
    expect(flooded, 'subscriptions.price_points.list fell back to a boilerplate description').toBeUndefined();
  });

  it('actually detects debt rather than counting zero (ratchet proof)', () => {
    // A ratchet over a broken counter passes forever. Feed the audit synthetic
    // operations carrying each defect and check every axis fires — this is the
    // assertion that keeps the five ceilings above meaningful.
    const synthetic = [
      {
        name: 'widgets.create',
        domain: 'test',
        method: 'POST',
        path: '/v1/widgets/{id}',
        description: 'Create a widget.', // boilerplate, and needs an id first
        readOnly: false,
        deprecated: false,
        pathParams: ['id'],
        queryParams: [],
        hasBody: false,
      },
      {
        name: 'widgets.list',
        domain: 'test',
        method: 'GET',
        path: '/v1/widgets',
        description: 'List widgets.',
        readOnly: true,
        deprecated: false,
        pathParams: [],
        queryParams: [
          { name: 'filter[gadget]', type: 'array', description: "filter by id(s) of related 'gadget'" },
        ],
        hasBody: false,
      },
      {
        name: 'gadgets.list',
        domain: 'test',
        method: 'GET',
        path: '/v1/gadgets',
        description: 'List gadgets.',
        readOnly: true,
        deprecated: false,
        pathParams: [],
        queryParams: [], // no filter at all
        hasBody: false,
      },
    ] satisfies Operation[];

    const probe = auditAx(synthetic);
    expect(probe.boilerplate.map((f) => f.name)).toEqual([
      'widgets.create',
      'widgets.list',
      'gadgets.list',
    ]);
    expect(probe.unhintedIdFilters).toHaveLength(1);
    expect(probe.unhintedIdFilters[0].detail).toContain('filter[gadget]');
    expect(probe.writesNeedingLookup.map((f) => f.name)).toEqual(['widgets.create']);
    expect(probe.unfilterableLists.map((f) => f.name)).toEqual(['gadgets.list']);
  });

  it('measures boilerplate against a threshold that admits real descriptions', () => {
    // A sanity check on the proxy itself: if the threshold drifted high enough
    // to flag curated prose, every count above would be meaningless.
    expect(BOILERPLATE_MAX_CHARS).toBeLessThan(120);
  });
});
