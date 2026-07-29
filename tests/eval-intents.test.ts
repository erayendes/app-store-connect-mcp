import { describe, expect, it } from 'vitest';
import { OPERATIONS } from '../src/generated/operations.js';
import { PRICING_TOOL_NAMES } from '../src/tools/pricing.js';
import { REVIEWS_AI_TOOL_NAMES } from '../src/tools/reviews-ai.js';
import { INTENTS } from './eval/intents.js';

const operationNames = new Set(OPERATIONS.map((operation) => operation.name));
const macroNames = new Set([...PRICING_TOOL_NAMES, ...REVIEWS_AI_TOOL_NAMES]);

describe('AX evaluation intent corpus', () => {
  it('only names generated operations as expected tools', () => {
    const missing = INTENTS.flatMap(({ intent, expectedTool }) => {
      const tools = Array.isArray(expectedTool) ? expectedTool : [expectedTool];
      return tools
        .filter((tool) => !operationNames.has(tool))
        .map((tool) => `${intent}: ${tool}`);
    });

    expect(missing, 'expected tools missing from generated operations').toEqual([]);
  });

  it('only names installed macro tools', () => {
    const missing = INTENTS
      .filter((intent) => intent.macro)
      .map((intent) => intent.macro!)
      .filter((macro) => !macroNames.has(macro));

    expect(missing, 'macros missing from the macro tool registry').toEqual([]);
  });

  it('has the frozen core, adversarial, and corpus sizes', () => {
    expect(INTENTS.filter((intent) => intent.core).length).toBe(15);
    expect(INTENTS.filter((intent) => intent.adversarial).length).toBe(8);
    expect(INTENTS).toHaveLength(50);
  });
});
