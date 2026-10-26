/**
 * ASC-Core is registered next to every profile, so whatever it costs is paid
 * by every setup, every session, before the first question. That is the reason
 * it was split out of the profiles in 3.0 — 2.8 folded core into each server
 * and paid for it once per registered profile — and the reason its size gets a
 * ceiling rather than a changelog line.
 *
 * Measured from the definitions `tools/list` actually answers
 * (scripts/measure-tokens.ts, JSON length / 4), not from TOKENS_PER_TOOL: core
 * is mostly hand-written macros with long descriptions, and the average says
 * nothing about them. A ratchet like the ax-audit ceilings: lower it when core
 * shrinks; raising it is a decision, not a fix.
 */
import { describe, it, expect } from 'vitest';
import { measureServers } from '../scripts/measure-tokens.js';

// PR-D2: 16 file target names plus asset type/UTI enums and build version
// selectors raise measured definitions from 7,837 to 8,418 (+581) tokens.
// The enums make valid uploads discoverable without raw create tools.
// Keep 12 tokens of headroom.
const CORE_CEILING = 8_430;

describe('what ASC-Core costs every session', () => {
  it(`stays under ${CORE_CEILING} definition tokens`, async () => {
    const core = (await measureServers('src')).find((r) => r.server === 'core')!;
    expect(core.tools).toBeGreaterThan(0);
    expect(core.tokens).toBeLessThanOrEqual(CORE_CEILING);
  });
});
