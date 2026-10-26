import { describe, it, expect, vi } from 'vitest';
import { riskByBody, riskFor, STRONG_CONFIRM_LEVELS, ASK_BY_DEFAULT } from '../src/core/risk.js';
import { OPERATIONS } from '../src/generated/operations.js';
import { buildWritePreview, resolveBodyRefs } from '../src/core/confirm.js';
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
  it('treats draft version creation as an irreversible release step that asks by default', async () => {
    for (const name of ['subscription_versions', 'subscription_group_versions', 'in_app_purchase_versions']) {
      expect(riskFor(`${name}.create`, 'POST')).toBe('release');
      expect(ASK_BY_DEFAULT.has(`${name}__create`)).toBe(true);
      const op = OPERATIONS.find((o) => o.name === `${name}.create`)!;
      expect(op.risk).toBe('release');
      const preview = await buildWritePreview(`${name}__create`, op, { body: { data: { type: 'x' } } });
      expect(preview.message).toContain('A draft version cannot be deleted.');
    }
    expect(ASK_BY_DEFAULT.has('release__submit_items')).toBe(true);
  });
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

  it('keeps a product’s words and pictures out of the money class', () => {
    // Renaming a weekly plan per language asked "affects what customers are
    // charged", once per language. The price itself still does.
    expect(riskFor('subscription_localizations_v2.update', 'PATCH')).toBe('public');
    expect(riskFor('subscription_group_localizations.create', 'POST')).toBe('public');
    expect(riskFor('in_app_purchase_images_v2.create', 'POST')).toBe('public');
    expect(riskFor('subscription_app_store_review_screenshots.update', 'PATCH')).toBe('low');
    expect(riskFor('subscription_localizations.delete', 'DELETE')).toBe('destructive');
    expect(riskFor('subscription_prices.create', 'POST')).toBe('revenue');
    expect(riskFor('subscriptions.update', 'PATCH')).toBe('revenue');
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

  it('classes the live writes that used to fall through to low', () => {
    // Selling in a country or ending a pre-order moves the app toward customers.
    expect(riskFor('territory_availabilities.update', 'PATCH')).toBe('release');
    expect(riskFor('app_availabilities_v2.create', 'POST')).toBe('release');
    expect(riskFor('end_app_availability_pre_orders.create', 'POST')).toBe('release');
    // Printed on the product page, like store text.
    expect(riskFor('age_rating_declarations.update', 'PATCH')).toBe('public');
    expect(riskFor('end_user_license_agreements.update', 'PATCH')).toBe('public');
    expect(riskFor('accessibility_declarations.create', 'POST')).toBe('public');
    expect(riskFor('app_store_version_experiments_v2.update', 'PATCH')).toBe('public');
    // A replace detaches everything left out of the list.
    expect(riskFor('game_center_groups.game_center_achievements_v2.replace', 'PATCH')).toBe('destructive');
    expect(riskFor('game_center_details.game_center_leaderboards_v2.replace', 'PATCH')).toBe('destructive');
    // Game Center config itself stays low.
    expect(riskFor('game_center_achievements_v2.update', 'PATCH')).toBe('low');
  });

  it('says a Game Center replace removes things, since PATCH does not', () => {
    const replace = toMcpTool(OPERATIONS.find((o) => o.name === 'game_center_details.game_center_leaderboards_v2.replace')!);
    expect(replace.description).toContain('DESTRUCTIVE-level write');
    expect(replace.annotations?.destructiveHint).toBe(true);
  });

  it('makes builds.update destructive only when it expires the build', () => {
    const build = (attributes: Record<string, unknown>) => ({ id: 'b-1', body: { data: { type: 'builds', id: 'b-1', attributes } } });
    expect(riskByBody('builds__update', build({ expired: true }))).toBe('destructive');
    expect(riskByBody('builds__update', build({ expired: 'true' }))).toBe('destructive');
    expect(riskByBody('builds__update', { id: 'b-1', body: JSON.stringify(build({ expired: true }).body) })).toBe('destructive');
    expect(riskByBody('builds__update', build({ expired: false }))).toBeUndefined();
    expect(riskByBody('builds__update', build({ usesNonExemptEncryption: false }))).toBeUndefined();
    expect(riskByBody('builds__update', {})).toBeUndefined();
    expect(riskByBody('apps__update', build({ expired: true }))).toBeUndefined();
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

describe('the preview names the thing it is about to write to', () => {
  const named = (attributes: Record<string, unknown>) => ({
    get: async () => ({ data: { attributes } }),
  });

  // The one line that says *which* app is being changed was the one line
  // nobody could read: "Target: id = 6636549188".
  it('resolves the path id, not only the references in the body', async () => {
    const preview = await buildWritePreview(
      'apps__update',
      { method: 'PATCH', path: '/v1/apps/{id}', risk: 'public' },
      { id: '6636549188', body: { data: { type: 'apps', id: '6636549188', attributes: {} } } },
      undefined,
      named({ name: 'Ask Quran' })
    );
    expect(preview.message).toContain('Target:     id = 6636549188 (Ask Quran)');
  });

  it('names it on a write that carries no body at all', async () => {
    const preview = await buildWritePreview(
      'apps__beta_testers__remove',
      { method: 'DELETE', path: '/v1/apps/{id}/relationships/betaTesters', risk: 'destructive' },
      { id: '6636549188' },
      undefined,
      named({ name: 'Ask Quran' })
    );
    expect(preview.message).toContain('(Ask Quran)');
  });

  // "Delete an app screenshot? … (02.png)" — three of those in a row, and no
  // way to tell which app, version or language each one belonged to.
  const listing = (slowFrom?: string) => ({
    get: async (path: string) => {
      if (slowFrom && path.startsWith(slowFrom)) await new Promise((r) => setTimeout(r, 4_000));
      if (path.startsWith('/v1/appScreenshots/')) {
        return {
          data: { attributes: { fileName: '02.png' }, relationships: { appScreenshotSet: { data: { id: 'set-1' } } } },
          included: [{ type: 'appScreenshotSets', id: 'set-1', attributes: { screenshotDisplayType: 'APP_IPHONE_67' } }],
        };
      }
      if (path.startsWith('/v1/appScreenshotSets/')) {
        return { data: { attributes: { screenshotDisplayType: 'APP_IPHONE_67' } }, included: [{ type: 'appStoreVersionLocalizations', id: 'loc-tr', attributes: { locale: 'tr' } }] };
      }
      if (path.startsWith('/v1/appStoreVersionLocalizations/')) {
        return { data: {}, included: [{ type: 'appStoreVersions', id: 'v-1', attributes: { versionString: '1.6.1' } }] };
      }
      if (path.startsWith('/v1/appStoreVersions/')) {
        return { data: {}, included: [{ type: 'apps', id: 'a-1', attributes: { name: 'Ask Quran' } }] };
      }
      return {};
    },
  });
  const deleteShot = (http: ReturnType<typeof listing>) =>
    buildWritePreview(
      'app_screenshots__delete',
      { method: 'DELETE', path: '/v1/appScreenshots/{id}', risk: 'destructive' },
      { id: 'shot-2' },
      undefined,
      http
    );

  it('says which app, version, language and device a screenshot belongs to', async () => {
    const preview = await deleteShot(listing());
    expect(preview.message).toContain('(02.png — Ask Quran, version 1.6.1, tr, APP_IPHONE_67)');
  });

  it('shows what it has when a step up is too slow', async () => {
    const preview = await deleteShot(listing('/v1/appStoreVersions/'));
    expect(preview.message).toContain('(02.png — version 1.6.1, tr, APP_IPHONE_67)');
  });

  // "Delete an image from the asset library? … (01.png (15))": the file names no
  // app, so the label has to come from where it is placed.
  const library = (placed: number) => ({
    get: async (path: string) => {
      if (path.startsWith('/v1/appAssetLibraryImages/')) {
        const data = Array.from({ length: placed }, (_, i) => ({ type: 'appAssetLibraryPlacements', id: `p-${i}` }));
        return { data: { attributes: { referenceName: '01.png (15)' }, relationships: { placements: { data } } } };
      }
      if (path.startsWith('/v1/appAssetLibraryPlacements/')) {
        return {
          data: { attributes: { placementType: 'APP_SCREENSHOT' } },
          included: [{ type: 'appStoreVersionLocalizations', id: 'loc-tr', attributes: { locale: 'tr' } }],
        };
      }
      return listing().get(path);
    },
  });
  const deleteImage = (http: ReturnType<typeof library>) =>
    buildWritePreview(
      'app_asset_library_images__delete',
      { method: 'DELETE', path: '/v1/appAssetLibraryImages/{id}', risk: 'destructive' },
      { id: 'img-1' },
      undefined,
      http
    );

  it('names the app a placed library image shows on', async () => {
    const preview = await deleteImage(library(3));
    expect(preview.message).toContain('(01.png (15) — Ask Quran, version 1.6.1, tr, APP_SCREENSHOT, and 2 more)');
  });

  it('says when a library image is placed nowhere', async () => {
    const preview = await deleteImage(library(0));
    expect(preview.message).toContain('(01.png (15) — not placed on any page)');
  });

  it('falls back to the bare id when the lookup says nothing', async () => {
    const preview = await buildWritePreview(
      'apps__update',
      { method: 'PATCH', path: '/v1/apps/{id}', risk: 'public' },
      { id: '6636549188' },
      undefined,
      { get: async () => ({ data: {} }) }
    );
    expect(preview.message).toContain('Target:     id = 6636549188');
    expect(preview.message).not.toContain('(');
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

describe('typed confirmation', () => {
  // The typed-versus-checkbox behaviour itself is in tests/confirm.test.ts.
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
