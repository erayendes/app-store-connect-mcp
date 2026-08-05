/**
 * Two things a tool definition has to do before a model can pick it: say
 * something its own name does not, and document its input.
 *
 * Both were measured against a real scorer rather than guessed. A directory
 * scan of the shipped server graded the tools 3.6/5 on average and 2.7 at the
 * bottom, and the bottom was not where it looked: not the long-tailed list
 * calls, but deletes and relationship reads, whose only parameter is `id`.
 * With `id` undescribed those tools documented no input at all.
 *
 * The two checks below are shaped differently on purpose. Undescribed input is
 * an invariant — nothing should ship with it, so it is pinned at zero. A
 * description that only restates the name is inherited debt: 95 of Apple’s own
 * one-line summaries still read that way, so that one is a ratchet that may
 * fall and must not rise.
 */
import { describe, expect, it } from 'vitest';
import { OPERATIONS } from '../src/generated/operations.js';
import { toMcpTool } from '../src/core/registry.js';

const live = OPERATIONS.filter((op) => !op.deprecated);

const CONNECTIVES = new Set(['the', 'and', 'one', 'all', 'for', 'list', 'with']);

/** Words a description adds that its tool name does not already carry. */
function novelWords(name: string, description: string): string[] {
  const split = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .split(' ')
      .filter((w) => w.length > 2);
  const fromName = new Set(split(name));
  return [...new Set(split(description))].filter((w) => !fromName.has(w) && !CONNECTIVES.has(w));
}

/** Tools whose every parameter is undescribed. Parameterless tools are not one. */
function documentsNoInput(): string[] {
  return live
    .filter((op) => {
      const params = Object.values(toMcpTool(op).inputSchema?.properties ?? {});
      return params.length > 0 && params.every((p) => !(p as { description?: string }).description);
    })
    .map((op) => op.name);
}

describe('every tool documents its input', () => {
  it('no tool has parameters and describes none of them', () => {
    expect(
      documentsNoInput(),
      [
        'These tools take parameters and describe none of them, so their whole input is',
        'a guess. Usually this is a delete or a relationship read whose only parameter is',
        '`id`: drop that description to save tokens and the tool documents nothing.',
        'See TOKENS_PER_TOOL in src/profiles.ts for what the description costs.',
      ].join(' ')
    ).toEqual([]);
  });

  it('the `id` path parameter says where the value comes from', () => {
    // The name already says it is an identifier. What a model cannot work out
    // is which call produces one.
    const withId = live.find((op) => op.pathParams.includes('id'));
    const id = toMcpTool(withId!).inputSchema?.properties?.id as { description?: string };
    expect(id.description, 'id carries a description').toBeTruthy();
    expect(id.description, 'and it points at where the value comes from').toMatch(/list call/i);
  });
});

describe('descriptions add something the tool name does not', () => {
  // Apple's spec summaries are the source of these, so this is inherited debt
  // rather than a rule that was broken. Curating one in scripts/describe.ts
  // lowers the number; nothing should raise it.
  const CEILING = 95;

  it(`no more than ${CEILING} descriptions merely restate the tool name`, () => {
    const restated = live
      .filter((op) => novelWords(op.name, op.description).length === 0)
      .map((op) => op.name);

    expect(
      restated.length,
      [
        `${restated.length} descriptions add no word their tool name lacks (ceiling ${CEILING}).`,
        'A description that restates the name spends context to say nothing.',
        'Curate it in CURATED (scripts/describe.ts): what comes back, what narrows it,',
        'and which neighbouring tool it is not.',
        restated.length > CEILING ? `New: ${restated.slice(0, 5).join(', ')}` : '',
      ].join(' ')
    ).toBeLessThanOrEqual(CEILING);
  });

  it('the profile automated scans boot on carries none of them', () => {
    // The Dockerfile serves `distribution`, so these are the descriptions a
    // directory actually reads. tests/dockerfile.test.ts pins that argument.
    const distribution = live.filter((op) => op.domain === 'versions' || op.domain === 'builds');
    const restated = distribution
      .filter((op) => novelWords(op.name, op.description).length === 0)
      .map((op) => op.name);

    expect(restated, 'curated in scripts/describe.ts').toEqual([]);
  });
});
