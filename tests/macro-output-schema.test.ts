/**
 * The read macros declare an outputSchema and answer with structuredContent.
 *
 * Two halves that only mean something together: a schema nothing validates is
 * decoration, and structured data with no schema is unvalidatable. The pair is
 * also deliberately *not* extended to the generated tools — Apple's own
 * response schemas describe a payload Heimdall never sends, because every
 * response is reshaped on the way out (stripApiNoise strips the links and self
 * URLs, capResponseSize can cut the data array and add a truncation note).
 */
import { describe, expect, it } from 'vitest';
import { PRICING_TOOLS, executePricingTool, type PricingContext } from '../src/tools/pricing.js';
import { SCREENSHOT_TOOLS } from '../src/tools/screenshots.js';
import { ANALYTICS_TOOLS } from '../src/tools/analytics.js';
import { CI_TOOLS, executeCiTool } from '../src/tools/ci.js';
import { PREFLIGHT_TOOLS, executePreflightTool } from '../src/tools/preflight.js';
import { METADATA_TOOLS } from '../src/tools/metadata.js';
import { ACCOUNT_TOOLS } from '../src/tools/account.js';
import { OPERATIONS } from '../src/generated/operations.js';
import { toMcpTool } from '../src/core/registry.js';

const macros = [...PRICING_TOOLS, ...SCREENSHOT_TOOLS, ...ANALYTICS_TOOLS, ...CI_TOOLS, ...PREFLIGHT_TOOLS, ...METADATA_TOOLS, ...ACCOUNT_TOOLS];
const byName = (name: string) => macros.find((t) => t.name === name);

/** Every property a schema declares, at any depth, as dotted paths. */
function declaredPaths(schema: any, prefix = ''): Set<string> {
  const out = new Set<string>();
  const walk = (node: any, path: string): void => {
    if (!node || typeof node !== 'object') return;
    if (node.properties) {
      for (const [key, child] of Object.entries<any>(node.properties)) {
        out.add(path ? `${path}.${key}` : key);
        walk(child, path ? `${path}.${key}` : key);
      }
    }
    if (node.items) walk(node.items, `${path}[]`);
  };
  walk(schema, prefix);
  return out;
}

/** Every key the value actually carries, in the same dotted form. */
function actualPaths(value: unknown, path = '', out = new Set<string>()): Set<string> {
  if (Array.isArray(value)) {
    for (const item of value) actualPaths(item, `${path}[]`, out);
    return out;
  }
  if (value === null || typeof value !== 'object') return out;
  for (const [key, child] of Object.entries(value)) {
    const next = path ? `${path}.${key}` : key;
    out.add(next);
    actualPaths(child, next, out);
  }
  return out;
}

describe('read macros declare an outputSchema', () => {
  it('covers exactly the read macros, and no write macro', () => {
    for (const tool of macros) {
      const isRead = tool.annotations?.readOnlyHint === true;
      expect(
        Boolean(tool.outputSchema),
        `${tool.name} (readOnlyHint=${isRead}) outputSchema presence`
      ).toBe(isRead);
    }
  });

  it('declares object schemas with required fields', () => {
    for (const tool of macros.filter((t) => t.outputSchema)) {
      expect(tool.outputSchema?.type, tool.name).toBe('object');
      expect((tool.outputSchema as any)?.required?.length, tool.name).toBeGreaterThan(0);
    }
  });
});

describe('the schema matches what the macro actually returns', () => {
  it.each(['pricing__get_iap_price', 'pricing__get_app_price'])('%s: every returned key is declared', async (name) => {
    const isApp = name === 'pricing__get_app_price';
    const point = isApp ? 'appPricePoint' : 'inAppPurchasePricePoint';
    const pointType = isApp ? 'appPricePoints' : 'inAppPurchasePricePoints';
    const ctx = { http: {
      get: async (path: string) => {
        if (path === '/v1/apps/1') return { data: { id: '1', attributes: { name: 'Example' } } };
        if (path === '/v2/inAppPurchases/2') return { data: { id: '2', attributes: { productId: 'coins.100' } } };
        if (path.endsWith('PriceSchedule')) return { data: { id: 's1' } };
        if (path.endsWith('/manualPrices')) return { data: [{
          attributes: { startDate: null, endDate: null },
          relationships: { territory: { data: { id: 'USA' } }, [point]: { data: { id: 'p1' } } },
        }], included: [
          { type: pointType, id: 'p1', attributes: { customerPrice: '4.99', proceeds: '3.49' } },
          { type: 'territories', id: 'USA', attributes: { currency: 'USD' } },
        ] };
        return { data: [] };
      },
    } } as unknown as PricingContext;
    const result = await executePricingTool(name, isApp ? { app: '1' } : { iap: '2' }, ctx);
    expect((result as any).prices).toHaveLength(1);
    const declared = declaredPaths(byName(name)!.outputSchema);
    expect([...actualPaths(result)].filter((p) => !declared.has(p))).toEqual([]);
  });

  it('preflight__check_subscription: group, subscriptions, findings and truncation are declared', async () => {
    const http: any = { get: async (path: string) => {
      if (path === '/v1/apps/1') return { data: { id: '1', attributes: { name: 'Example' } } };
      if (path.endsWith('/subscriptionGroups')) return { data: [{ id: 'g1', attributes: { referenceName: 'Premium' } }] };
      if (path.endsWith('/subscriptions')) return { data: [{ id: 's1', attributes: { productId: 'monthly', name: 'Monthly', state: 'MISSING_METADATA' } }], links: { next: '/unread' } };
      if (path.endsWith('/appStoreReviewScreenshot')) return { data: null };
      return { data: [] };
    } };
    const result: any = await executePreflightTool('preflight__check_subscription', { app: '1', group: 'g1' }, { http });
    expect(result.subscriptions).toHaveLength(1);
    expect(result.subscriptions[0].findings.length).toBeGreaterThan(0);
    expect(result.group.truncated).toHaveLength(1);
    const declared = declaredPaths(byName('preflight__check_subscription')!.outputSchema);
    expect([...actualPaths(result)].filter((p) => !declared.has(p))).toEqual([]);
  });

  it('ci__diagnose_run: declares every field in a failed-run diagnosis', async () => {
    const get = async (path: string) => {
      if (path === '/v1/apps') return { data: [{ id: '1', attributes: { name: 'Demo' } }] };
      if (path.endsWith('/ciProduct')) return { data: { id: 'product' } };
      return { data: { id: 'run', attributes: { number: 1, completionStatus: 'FAILED' }, relationships: { product: { data: { id: 'product' } } } } };
    };
    const collect = async (path: string) => {
      if (path.endsWith('/buildRuns')) return { items: [{ id: 'run', attributes: { number: 1, completionStatus: 'FAILED' } }], hasMore: false };
      if (path.endsWith('/actions')) return { items: [{ id: 'action', attributes: { name: 'Test', actionType: 'TEST', completionStatus: 'FAILED' } }], hasMore: false };
      if (path.endsWith('/issues')) return { items: [{ attributes: { issueType: 'ERROR', message: 'Broken', fileSource: { path: 'App.swift', lineNumber: 3 } } }], hasMore: false };
      return { items: [{ attributes: { status: 'FAILURE', className: 'Tests', name: 'testA', message: 'Failed', destinationTestResults: [{ deviceName: 'iPhone' }] } }], hasMore: false };
    };
    const result = await executeCiTool('ci__diagnose_run', { app: 'Demo' }, { http: { get, collect } as any });
    const undeclared = [...actualPaths(result)].filter((path) => !declaredPaths(byName('ci__diagnose_run')!.outputSchema).has(path));
    expect(undeclared).toEqual([]);
  });

  it('pricing__get_subscription_price: every returned key is declared', async () => {
    // Minimal chain: one app, one group, one subscription, one price with a
    // point included. Enough to exercise the shape, not the resolution logic
    // (tests/pricing.test.ts owns that).
    const ctx = {
      http: {
        get: async (path: string) => {
          if (path === '/v1/apps') return { data: [{ id: '1', attributes: { name: 'Ask Quran' } }] };
          // Subscriptions arrive as includes on the groups call, not separately.
          if (path.includes('subscriptionGroups'))
            return {
              data: [{ id: 'g1', attributes: {} }],
              included: [
                { id: 's1', type: 'subscriptions', attributes: { name: 'Weekly', productId: 'weekly.1' } },
              ],
            };
          if (path.includes('/prices'))
            return {
              data: [
                {
                  id: 'p1',
                  attributes: { startDate: null },
                  relationships: { subscriptionPricePoint: { data: { id: 'pp1' } } },
                },
                // A future-dated row, so scheduledChanges is exercised too.
                {
                  id: 'p2',
                  attributes: { startDate: '2099-01-01' },
                  relationships: { subscriptionPricePoint: { data: { id: 'pp2' } } },
                },
              ],
              included: [
                { id: 'pp1', type: 'subscriptionPricePoints', attributes: { customerPrice: '4.99', proceeds: '4.24' } },
                { id: 'pp2', type: 'subscriptionPricePoints', attributes: { customerPrice: '5.99', proceeds: '5.09' } },
              ],
            };
          return { data: [] };
        },
        post: async () => ({}),
      },
      dryRun: false,
    } as unknown as PricingContext;

    const result = await executePricingTool(
      'pricing__get_subscription_price',
      { app: 'Ask Quran', territory: 'USA' },
      ctx
    );

    // Guard the guard: an empty result would make the check below pass while
    // proving nothing.
    const priced = (result as any).prices;
    expect(priced, 'fixture must actually reach the price path').toHaveLength(1);
    expect(priced[0].customerPrice).toBe('4.99');
    expect(priced[0].scheduledChanges).toHaveLength(1);

    const declared = declaredPaths(byName('pricing__get_subscription_price')!.outputSchema);
    const undeclared = [...actualPaths(result)].filter((p) => !declared.has(p));
    expect(undeclared, 'keys returned but not in outputSchema').toEqual([]);
  });

  it('declares the fields listing__get_screenshots is documented to return', () => {
    // The macro's own call chain is pinned in tests/screenshots.test.ts; here
    // only the contract matters.
    const declared = declaredPaths(byName('listing__get_screenshots')!.outputSchema);
    for (const path of [
      'app',
      'version',
      'state',
      'locales',
      'locales[].locale',
      'locales[].sets',
      'locales[].sets[].displayType',
      'locales[].sets[].count',
      'locales[].sets[].screenshots',
      'locales[].sets[].screenshots[].fileName',
      'locales[].sets[].screenshots[].width',
      'locales[].sets[].screenshots[].height',
      'locales[].sets[].screenshots[].state',
      'localesWithOwnScreenshots',
      'note',
    ]) {
      expect(declared.has(path), `outputSchema declares ${path}`).toBe(true);
    }
  });
});

describe('generated tools deliberately carry no outputSchema', () => {
  it('none of the 982 declares one', () => {
    const withSchema = OPERATIONS.filter((op) => toMcpTool(op).outputSchema).map((op) => op.name);
    expect(
      withSchema,
      [
        'A generated tool declared an outputSchema. Apple\'s response schemas describe the raw',
        'payload; Heimdall reshapes it (stripApiNoise, capResponseSize) before it reaches the',
        'client, so the schema would be wrong and a validating client would reject valid',
        'answers. Reshape first, or leave the schema off.',
      ].join(' ')
    ).toEqual([]);
  });
});
