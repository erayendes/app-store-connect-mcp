import { describe, expect, it } from 'vitest';
import { riskFor } from '../src/core/risk.js';
import { OPERATIONS } from '../src/generated/operations.js';
import { PRICING_TOOL_NAMES } from '../src/tools/pricing.js';
import { REVIEWS_AI_TOOL_NAMES } from '../src/tools/reviews-ai.js';
import { SCREENSHOT_TOOL_NAMES } from '../src/tools/screenshots.js';
import { INTENTS } from './eval/intents.js';

const operationNames = new Set(OPERATIONS.map((operation) => operation.name));
const operationsByName = new Map(OPERATIONS.map((operation) => [operation.name, operation]));
const macroNames = new Set([
  ...PRICING_TOOL_NAMES,
  ...REVIEWS_AI_TOOL_NAMES,
  ...SCREENSHOT_TOOL_NAMES,
]);
const SHARED_NORMAL_ADVERSARIAL_TOOLS = [
  'app_store_version_release_requests.create',
  'subscription_prices.create',
  'users.update',
] as const;

function singularize(token: string): string {
  if (token.endsWith('ies') && token.length > 4) return `${token.slice(0, -3)}y`;
  if (/(?:ss|sh|ch|x|z)es$/.test(token)) return token.slice(0, -2);
  if (token.endsWith('s') && token.length > 3) return token.slice(0, -1);
  return token;
}

function normalizedTokens(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length >= 3)
      .map(singularize)
  );
}

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

  /**
   * "Exists in the spec" is not the same as "an agent can call it". The
   * registry refuses deprecated operations unless --include-deprecated, and
   * search no longer offers them — so an intent aimed at one measures a
   * failure the product cannot fix. Three intents shipped this way
   * (subscription_availabilities, game_center_achievements,
   * game_center_leaderboards) and the existence check above waved them past.
   */
  it('never expects a deprecated tool — the registry would refuse to load it', () => {
    const unreachable = INTENTS.flatMap(({ intent, expectedTool }) =>
      (Array.isArray(expectedTool) ? expectedTool : [expectedTool])
        .filter((tool) => operationsByName.get(tool)?.deprecated)
        .map((tool) => `${intent}: ${tool}`)
    );

    expect(unreachable, 'expected tools that no profile can load').toEqual([]);
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

  it('does not repeat every expected-tool token in a search query', () => {
    const tautologies = INTENTS.flatMap(({ intent, searchQuery, expectedTool }) => {
      const queryTokens = normalizedTokens(searchQuery);
      const tools = Array.isArray(expectedTool) ? expectedTool : [expectedTool];
      return tools
        .filter((tool) => {
          const toolTokens = normalizedTokens(tool);
          return [...toolTokens].every((token) => queryTokens.has(token));
        })
        .map((tool) => `${intent}: ${searchQuery} -> ${tool}`);
    });

    expect(tautologies, 'search queries repeating every expected-tool token').toEqual([]);
  });

  it('keeps adversarial risk expectations aligned with the server manifest', () => {
    const mismatches = INTENTS
      .filter((intent) => intent.adversarial)
      .flatMap((intent) => {
        const tools = Array.isArray(intent.expectedTool)
          ? intent.expectedTool
          : [intent.expectedTool];
        return tools.flatMap((tool) => {
          const operation = operationsByName.get(tool);
          if (!operation) return [`${intent.intent}: missing operation ${tool}`];
          const actual = riskFor(tool, operation.method);
          return actual === intent.adversarial!.expectRisk
            ? []
            : [`${intent.intent}: expected ${intent.adversarial!.expectRisk}, got ${actual}`];
        });
      });

    expect(mismatches, 'adversarial risks diverging from riskFor').toEqual([]);
  });

  it('only shares explicitly declared tools between normal and adversarial intents', () => {
    const normalTools = new Set(
      INTENTS
        .filter((intent) => !intent.adversarial)
        .flatMap((intent) => Array.isArray(intent.expectedTool)
          ? intent.expectedTool
          : [intent.expectedTool])
    );
    const adversarialTools = new Set(
      INTENTS
        .filter((intent) => intent.adversarial)
        .flatMap((intent) => Array.isArray(intent.expectedTool)
          ? intent.expectedTool
          : [intent.expectedTool])
    );
    const sharedTools = [...normalTools]
      .filter((tool) => adversarialTools.has(tool))
      .sort();

    expect(sharedTools).toEqual([...SHARED_NORMAL_ADVERSARIAL_TOOLS].sort());
  });
});
