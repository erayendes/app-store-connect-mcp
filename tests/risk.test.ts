import { describe, it, expect, vi } from 'vitest';
import { riskFor, STRONG_CONFIRM_LEVELS } from '../src/core/risk.js';
import { OPERATIONS } from '../src/generated/operations.js';
import {
  buildWritePreview,
  confirmWrite,
  resolveBodyRefs,
  type WriteConfirmer,
} from '../src/core/confirm.js';
import { ToolRegistry, toMcpTool } from '../src/core/registry.js';
import { AscHttpClient } from '../src/core/http.js';
import { TokenProvider } from '../src/core/jwt.js';
import { generateKeyPairSync } from 'node:crypto';

const { privateKey } = generateKeyPairSync('ec', {
  namedCurve: 'P-256',
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  publicKeyEncoding: { type: 'spki', format: 'pem' },
});
const creds = {
  keyId: 'ABCD123456',
  issuerId: '11111111-2222-3333-4444-555555555555',
  privateKey,
};

describe('risk manifest', () => {
  it('classifies representative operations correctly', () => {
    expect(riskFor('subscription_prices.create', 'POST')).toBe('revenue');
    expect(riskFor('apps.update', 'PATCH')).toBe('public');
    expect(riskFor('beta_groups.beta_testers.add', 'POST')).toBe('low');
    expect(riskFor('review_submissions.create', 'POST')).toBe('release');
    // Swapping the binary under a version is a release step, not a config edit;
    // the rule used to list only create|update and let `.set` fall through to low.
    expect(riskFor('app_store_versions.build.set', 'PATCH')).toBe('release');
    expect(riskFor('certificates.create', 'POST')).toBe('infrastructure');
    expect(riskFor('users.update', 'PATCH')).toBe('access');
    // DELETE outranks everything except revenue.
    expect(riskFor('beta_groups.delete', 'DELETE')).toBe('destructive');
    expect(riskFor('subscriptions.delete', 'DELETE')).toBe('revenue');
  });

  it('announces the four unreadable levels in the tool list itself', () => {
    const byName = (n: string) => OPERATIONS.find((o) => o.name === n)!;

    // A POST that moves money looked exactly like beta_groups__create before:
    // same annotations, no mention of the consequence anywhere in tools/list.
    const price = toMcpTool(byName('subscription_prices.create'));
    expect(price.description).toContain('REVENUE-level write');
    expect(price.annotations?.destructiveHint).toBe(true);
    // The level name, not the reversibility sentence: that one is identical
    // across 89 of monetization's tools and is printed once, by confirm.ts.
    expect(price.description).not.toContain('price history is kept');

    const release = toMcpTool(byName('app_store_version_release_requests.create'));
    expect(release.description).toContain('RELEASE-level write');
    expect(release.annotations?.destructiveHint).toBe(true);

    // `destructive` is left out on purpose — the method already says it twice.
    const del = toMcpTool(byName('beta_groups.delete'));
    expect(del.description).not.toContain('-level write');
    expect(del.annotations?.destructiveHint).toBe(true);

    // Low-stakes writes stay unannotated and additive.
    const group = toMcpTool(byName('beta_groups.create'));
    expect(group.description).not.toContain('-level write');
    expect(group.annotations?.destructiveHint).toBe(false);

    // Reads are untouched.
    const list = toMcpTool(byName('apps.list'));
    expect(list.description).not.toContain('-level write');
    expect(list.annotations?.readOnlyHint).toBe(true);
    expect(list.annotations?.destructiveHint).toBe(false);
  });

  it('stamps every mutating operation and never a read (generated invariant)', () => {
    for (const op of OPERATIONS) {
      if (op.readOnly) expect(op.risk, op.name).toBeUndefined();
      else expect(op.risk, op.name).toBeTruthy();
    }
  });
});

describe('reference resolution in a preview', () => {
  /** Records what was fetched so "no call at all" is testable, not assumed. */
  const reader = (attributes: Record<string, unknown>) => {
    const paths: string[] = [];
    return {
      paths,
      get: async (path: string) => {
        paths.push(path);
        return { data: { attributes } };
      },
    };
  };

  // The whole point of the generic resolver: a type nobody wrote a resolver for
  // still reaches the user as a name. betaTesters has no entry in REF_RESOLVERS
  // and does have a GET-by-id, which is the shape 152 other types share.
  it('names a type that has no hand-written resolver', async () => {
    const http = reader({ firstName: 'Ada', email: 'ada@example.com' });
    const labels = await resolveBodyRefs(http, {
      relationships: { betaTester: { data: { type: 'betaTesters', id: 'abc' } } },
    });
    expect(http.paths).toEqual(['/v1/betaTesters/abc']);
    expect(labels.get('betaTesters/abc')).toBe('ada@example.com');
  });

  // A territory id is already its alpha-3 code. Fetching it would spend one of
  // the four lookups to learn nothing, and the four are the latency budget.
  it('spends no call on an id that is already readable', async () => {
    const http = reader({ currency: 'TRY' });
    await resolveBodyRefs(http, {
      relationships: { territory: { data: { type: 'territories', id: 'TUR' } } },
    });
    expect(http.paths).toEqual([]);
  });

  // A label is decoration and the write is described correctly without it. The
  // HTTP client does not know that — it retries a network failure three times
  // with backoff — so an unreachable API used to hold the confirmation prompt
  // for 49 seconds and then print the raw id anyway, which reads as a hang.
  it('gives up on a slow lookup rather than holding the prompt', async () => {
    const slow = { get: () => new Promise<never>(() => {}) };
    const started = Date.now();
    const labels = await resolveBodyRefs(slow, {
      relationships: { betaTester: { data: { type: 'betaTesters', id: 'abc' } } },
    });
    expect(labels.size).toBe(0);
    expect(Date.now() - started).toBeLessThan(10_000);
  }, 15_000);

  it('leaves a type with no GET-by-id endpoint alone', async () => {
    const http = reader({ name: 'never fetched' });
    const labels = await resolveBodyRefs(http, {
      relationships: { x: { data: { type: 'notAResourceType', id: 'zzz' } } },
    });
    expect(http.paths).toEqual([]);
    expect(labels.size).toBe(0);
  });
});

describe('buildWritePreview', () => {
  const op = {
    method: 'POST',
    path: '/v1/subscriptionPrices',
    risk: 'revenue',
  };
  const args = {
    body: {
      data: {
        type: 'subscriptionPrices',
        attributes: { preserveCurrentPrice: false },
        relationships: {
          subscription: { data: { type: 'subscriptions', id: '6639600093' } },
          territory: { data: { type: 'territories', id: 'TUR' } },
        },
      },
    },
  };

  it('shows operation, changes, risk and typed-confirm instruction', async () => {
    const preview = await buildWritePreview('subscription_prices__create', op, args, 'ABCD123456');
    expect(preview.strong).toBe(true);
    expect(preview.message).toContain('REVENUE-level write');
    expect(preview.message).toContain('POST /v1/subscriptionPrices');
    expect(preview.message).toContain('subscriptions/6639600093');
    expect(preview.message).toContain('Account:    ABCD123456');
    expect(preview.message).toContain('Type CONFIRM');
  });

  it('shows the target id and territory count', async () => {
    const preview = await buildWritePreview(
      'subscription_plan_availabilities__create',
      { method: 'POST', path: '/v1/subscriptionPlanAvailabilities/{id}', risk: 'revenue' },
      {
        id: 'abc-123',
        body: {
          data: {
            type: 'subscriptionPlanAvailabilities',
            relationships: {
              availableTerritories: {
                data: [
                  { type: 'territories', id: 'TUR' },
                  { type: 'territories', id: 'USA' },
                  { type: 'territories', id: 'DEU' },
                ],
              },
            },
          },
        },
      }
    );
    expect(preview.message).toContain('id = abc-123');
    expect(preview.message).toContain('Territories in request: 3');
  });

  it('keeps a checkbox (not typed confirm) for low-stakes writes', async () => {
    const preview = await buildWritePreview(
      'beta_groups__create',
      { method: 'POST', path: '/v1/betaGroups', risk: 'low' },
      {}
    );
    expect(preview.strong).toBe(false);
    expect(preview.message).not.toContain('Type CONFIRM');
  });
});

describe('preview reference resolution (AI-202)', () => {
  const pricePointId = 'eyJzIjoiNjYzOTU5OTk5OSIsInQiOiJUVVIiLCJwIjoiMTAxNDcifQ';
  const priceArgs = {
    body: {
      data: {
        type: 'subscriptionPrices',
        attributes: { preserveCurrentPrice: false },
        relationships: {
          subscription: { data: { type: 'subscriptions', id: '6639599999' } },
          subscriptionPricePoint: {
            data: { type: 'subscriptionPricePoints', id: pricePointId },
          },
        },
      },
    },
  };
  const op = { method: 'POST', path: '/v1/subscriptionPrices', risk: 'revenue' };

  function fakeHttp() {
    return {
      get: vi.fn(async (path: string) => {
        if (path.includes('/subscriptionPricePoints/')) {
          return {
            data: {
              attributes: { customerPrice: '99.99' },
              relationships: { territory: { data: { type: 'territories', id: 'TUR' } } },
            },
            included: [{ type: 'territories', id: 'TUR', attributes: { currency: 'TRY' } }],
          };
        }
        if (path.includes('/subscriptions/')) {
          return {
            data: { attributes: { name: 'ask quran base 1week', productId: 'askquran.base.1week' } },
          };
        }
        return {};
      }),
    };
  }

  it('translates opaque ids into Product and Price lines', async () => {
    const preview = await buildWritePreview(
      'subscription_prices__create',
      op,
      priceArgs,
      'milowda',
      fakeHttp()
    );
    expect(preview.message).toContain('Price:      99.99 TRY (TUR)');
    expect(preview.message).toContain('Product:    ask quran base 1week (askquran.base.1week)');
    // The relationship line carries the label inline too.
    expect(preview.message).toContain('— "ask quran base 1week (askquran.base.1week)"');
  });

  it('spells out preserveCurrentPrice instead of showing a bare flag', async () => {
    const preview = await buildWritePreview('x', op, priceArgs, undefined, fakeHttp());
    expect(preview.message).toContain('WILL be moved to the new price');
  });

  it('falls back to raw ids when resolution fails — display only, never blocking', async () => {
    const failing = { get: vi.fn().mockRejectedValue(new Error('offline')) };
    const preview = await buildWritePreview('x', op, priceArgs, undefined, failing);
    expect(preview.message).toContain(`subscriptionPricePoints/${pricePointId}`);
    expect(preview.message).not.toContain('Price:');
  });

  it('caps reference lookups at 4 per preview', async () => {
    const http = fakeHttp();
    const many = {
      body: {
        data: {
          relationships: Object.fromEntries(
            Array.from({ length: 8 }, (_, i) => [
              `rel${i}`,
              { data: { type: 'subscriptions', id: `id-${i}` } },
            ])
          ),
        },
      },
    };
    await buildWritePreview('x', op, many, undefined, http);
    expect(http.get.mock.calls.length).toBeLessThanOrEqual(4);
  });
});

describe('confirmWrite with typed confirmation', () => {
  function confirmer(reply: { action: string; content?: Record<string, unknown> }) {
    const elicit = vi.fn().mockResolvedValue(reply);
    const c: WriteConfirmer = {
      getClientCapabilities: () => ({ elicitation: { form: true } }),
      elicitInput: elicit,
    };
    return { c, elicit };
  }
  const strongPreview = { message: 'preview', strong: true };

  it('allows when the user types CONFIRM (any case, padded)', async () => {
    const { c, elicit } = confirmer({ action: 'accept', content: { confirmation: '  confirm ' } });
    const decision = await confirmWrite(c, 'x', strongPreview);
    expect(decision.allowed).toBe(true);
    // The strong flow asked for a typed string, not a checkbox.
    const schema = (elicit.mock.calls[0][0] as any).requestedSchema;
    expect(schema.properties.confirmation.type).toBe('string');
  });

  it('blocks when the user types anything else', async () => {
    const { c } = confirmer({ action: 'accept', content: { confirmation: 'yes' } });
    const decision = await confirmWrite(c, 'x', strongPreview);
    expect(decision).toEqual({ allowed: false, reason: 'not confirmed' });
  });

  it('strong levels line up with the manifest', () => {
    expect([...STRONG_CONFIRM_LEVELS].sort()).toEqual([
      'access',
      'destructive',
      'infrastructure',
      'revenue',
    ]);
  });
});

describe('dry-run (writes never reach Apple)', () => {
  it('returns the would-send preview instead of calling fetch', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    try {
      const registry = new ToolRegistry({
        domains: ['testflight'],
        readOnly: false,
        includeDeprecated: false,
        dryRun: true,
      });
      const http = new AscHttpClient(new TokenProvider(creds));
      const result: any = await registry.execute(
        'beta_groups__create',
        {
          body: {
            data: {
              type: 'betaGroups',
              attributes: { name: 'test group' },
              relationships: { app: { data: { type: 'apps', id: '123' } } },
            },
          },
        },
        http
      );
      expect(result.dryRun).toBe(true);
      expect(result.wouldSend.method).toBe('POST');
      expect(result.wouldSend.path).toBe('/v1/betaGroups');
      expect(result.risk).toBe('low');
      expect(fetchMock).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('still validates the body first — a bad write fails, not "would send"', async () => {
    const registry = new ToolRegistry({
      domains: ['testflight'],
      readOnly: false,
      includeDeprecated: false,
      dryRun: true,
    });
    const http = new AscHttpClient(new TokenProvider(creds));
    await expect(
      registry.execute(
        'beta_groups__create',
        { body: { data: { type: 'betaGroups', attributes: { nmae: 'typo' } } } },
        http
      )
    ).rejects.toThrow(/unknown field/);
  });

  it('lets reads through untouched', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    );
    vi.stubGlobal('fetch', fetchMock);
    try {
      const registry = new ToolRegistry({
        domains: ['testflight'],
        readOnly: false,
        includeDeprecated: false,
        dryRun: true,
      });
      const http = new AscHttpClient(new TokenProvider(creds));
      await registry.execute('beta_groups__list', {}, http);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
