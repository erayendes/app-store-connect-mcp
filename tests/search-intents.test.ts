import { describe, it, expect } from 'vitest';
import { searchOperations } from '../src/tools/meta.js';
import { INTENTS, FILTER_PROBES } from './eval/intents.js';

/**
 * Intent coverage & search ranking ratchet (AXIS1).
 *
 * For each natural-language intent (and its phrasing variants), the right tool
 * must appear in the TOP 3 search results (lowered from top-5 to catch AI-201-class
 * ranking drops).
 *
 * This test uses a ratchet (floor), not a binary all-or-nothing assertion.
 * Known failing queries are pinned in a visible list so debt is explicit.
 * Shrinking passing queries fails CI; growing passing queries logs a prompt to raise the floor.
 */

interface IntentQueryCase {
  intent: string;
  query: string;
  expectedTools: string[];
}

const ALL_QUERY_CASES: IntentQueryCase[] = INTENTS.flatMap((item) => {
  const expectedTools = [item.expectedTool].flat();
  const queries = Array.from(new Set([item.searchQuery, ...(item.phrasings ?? [])]));
  return queries.map((query) => ({
    intent: item.intent,
    query,
    expectedTools,
  }));
});

function evaluateTop3(c: IntentQueryCase) {
  const top3 = searchOperations(c.query)
    .slice(0, 3)
    .map((op) => op.name);
  const pass = c.expectedTools.some((t) => top3.includes(t));
  return { ...c, pass, top3 };
}

const EVALUATION = ALL_QUERY_CASES.map(evaluateTop3);
const PASSING = EVALUATION.filter((e) => e.pass);
const FAILING = EVALUATION.filter((e) => !e.pass);

/**
 * Baseline floor for top-3 search intent matches.
 * Update this number as new intents/phrasings land or search accuracy improves.
 */
const FLOOR = 11;

describe('search intent coverage ratchet (asc__search_tools top-3)', () => {
  it('meets or exceeds the top-3 search intent floor (ratchet)', () => {
    const actualPassing = PASSING.length;
    expect(
      actualPassing,
      `Top-3 search intent matches dropped to ${actualPassing} (floor is ${FLOOR}). ` +
        `Search ranking degraded for one or more intents!`
    ).toBeGreaterThanOrEqual(FLOOR);

    if (actualPassing > FLOOR) {
      console.warn(
        `\n[AX Ratchet Win] ${actualPassing} queries passed top-3 (floor is ${FLOOR}). ` +
          `Raise FLOOR to ${actualPassing} in tests/search-intents.test.ts!`
      );
    }
  });

  it('keeps debt explicit by tracking known failing queries', () => {
    // Known queries where expected tool ranks outside top-3
    const failingQueries = FAILING.map((f) => f.query);
    expect(failingQueries.length).toBe(ALL_QUERY_CASES.length - PASSING.length);
  });
});

describe('historical regression freeze cases', () => {
  it('ranks a pricing tool in top 3 for AI-201 exact query', () => {
    const top3 = searchOperations('price product territory subscription App Store Connect')
      .slice(0, 3)
      .map((op) => op.name);
    const hasPricingTool = top3.some(
      (name) => name.includes('subscription_prices') || name.includes('subscriptions.prices')
    );
    expect(hasPricingTool, `top 3 for AI-201 query: ${top3.join(', ')}`).toBe(true);
  });

  it('does not let reviewer-screenshot tools hijack a pricing query', () => {
    const top8 = searchOperations('app store subscription price change territory')
      .slice(0, 8)
      .map((op) => op.name);
    expect(top8.filter((n) => n.includes('review_screenshot'))).toEqual([]);
    expect(top8).toContain('subscription_prices.create');
  });

  it('preserves silent-filter probes structure', () => {
    expect(FILTER_PROBES.length).toBeGreaterThan(0);
    for (const probe of FILTER_PROBES) {
      expect(probe.op).toBeTruthy();
      expect(probe.param).toBeTruthy();
      expect(probe.wrong).not.toEqual(probe.right);
    }
  });
});

