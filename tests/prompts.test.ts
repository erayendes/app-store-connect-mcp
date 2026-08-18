/**
 * Prompts are workflows, and a workflow that names a tool this server does not
 * carry is worse than no workflow — it advertises a capability and dies on the
 * first call. Most Heimdall servers are one profile, so that is the normal
 * case, not the edge one.
 *
 * The rest of these pin the two things that make a prompt worth having at all:
 * it chains calls, and it does not quietly become a write.
 */
import { describe, it, expect } from 'vitest';
import { PROMPTS, availablePrompts } from '../src/prompts.js';
import { PRICING_TOOLS } from '../src/tools/pricing.js';
import { PREFLIGHT_TOOLS } from '../src/tools/preflight.js';
import { METADATA_TOOLS } from '../src/tools/metadata.js';
import { REVIEWS_AI_TOOLS } from '../src/tools/reviews-ai.js';

const ALL_TOOLS = new Set(
  [...PRICING_TOOLS, ...PREFLIGHT_TOOLS, ...METADATA_TOOLS, ...REVIEWS_AI_TOOLS].map((t) => t.name)
);

describe('the prompt list', () => {
  it('names only tools that exist', () => {
    const unknown = PROMPTS.flatMap((p) => p.requires).filter((t) => !ALL_TOOLS.has(t));
    expect(unknown, 'prompts requiring a tool no macro family defines').toEqual([]);
  });

  it('offers nothing when the tools live in another profile', () => {
    expect(availablePrompts(new Set(['apps__list']))).toEqual([]);
  });

  it('offers a prompt only when every tool it names is served', () => {
    // release-readiness needs both macros; half the pair is not half a workflow.
    const half = availablePrompts(new Set(['preflight__check_version']));
    expect(half.map((p) => p.name)).not.toContain('release-readiness');
    const whole = availablePrompts(new Set(['preflight__check_version', 'listing__diff_metadata']));
    expect(whole.map((p) => p.name)).toContain('release-readiness');
  });

  it('earns its place by chaining calls, not by wrapping one tool', () => {
    for (const prompt of PROMPTS) {
      const named = [...ALL_TOOLS].filter((tool) => prompt.body({}).includes(tool));
      expect(named.length, `${prompt.name} names ${named.length} tools`).toBeGreaterThan(1);
    }
  });
});

describe('a prompt body', () => {
  it('carries the arguments it was given', () => {
    const text = PROMPTS.find((p) => p.name === 'release-readiness')!.body({
      app: 'Ask Quran',
      version: '3.2.0',
    });
    expect(text).toContain('Ask Quran');
    expect(text).toContain('3.2.0');
  });

  it('reads as a sentence when an optional argument is absent', () => {
    const text = PROMPTS.find((p) => p.name === 'release-readiness')!.body({ app: 'Ask Quran' });
    expect(text).not.toMatch(/undefined|version \s|\{\}/);
  });

  it('stops short of the write in every workflow that reaches one', () => {
    // The point where each of these ends is the point where money, a public
    // listing or a customer-visible reply changes. That boundary is the
    // product decision, so it is pinned rather than left to wording.
    const endings: Record<string, RegExp> = {
      'release-readiness': /do not submit/i,
      'review-triage': /do not call any tool that posts/i,
      'price-check': /Do not call it/i,
    };
    for (const [name, pattern] of Object.entries(endings)) {
      const prompt = PROMPTS.find((p) => p.name === name)!;
      expect(prompt.body({}), name).toMatch(pattern);
    }
  });

  it('tells the model that review text is untrusted, where reviews are read', () => {
    const text = PROMPTS.find((p) => p.name === 'review-triage')!.body({});
    expect(text).toMatch(/untrusted/i);
  });
});
