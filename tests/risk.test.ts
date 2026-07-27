import { describe, it, expect, vi } from 'vitest';
import { riskFor, STRONG_CONFIRM_LEVELS } from '../src/core/risk.js';
import { OPERATIONS } from '../src/generated/operations.js';
import { buildWritePreview, confirmWrite, type WriteConfirmer } from '../src/core/confirm.js';
import { ToolRegistry } from '../src/core/registry.js';
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
    expect(riskFor('certificates.create', 'POST')).toBe('infrastructure');
    expect(riskFor('users.update', 'PATCH')).toBe('access');
    // DELETE outranks everything except revenue.
    expect(riskFor('beta_groups.delete', 'DELETE')).toBe('destructive');
    expect(riskFor('subscriptions.delete', 'DELETE')).toBe('revenue');
  });

  it('stamps every mutating operation and never a read (generated invariant)', () => {
    for (const op of OPERATIONS) {
      if (op.readOnly) expect(op.risk, op.name).toBeUndefined();
      else expect(op.risk, op.name).toBeTruthy();
    }
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

  it('shows operation, changes, risk and typed-confirm instruction', () => {
    const preview = buildWritePreview('subscription_prices__create', op, args, 'ABCD123456');
    expect(preview.strong).toBe(true);
    expect(preview.message).toContain('REVENUE-level write');
    expect(preview.message).toContain('POST /v1/subscriptionPrices');
    expect(preview.message).toContain('subscriptions/6639600093');
    expect(preview.message).toContain('Account:    ABCD123456');
    expect(preview.message).toContain('Type CONFIRM');
  });

  it('shows the target id and territory count', () => {
    const preview = buildWritePreview(
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

  it('keeps a checkbox (not typed confirm) for low-stakes writes', () => {
    const preview = buildWritePreview(
      'beta_groups__create',
      { method: 'POST', path: '/v1/betaGroups', risk: 'low' },
      {}
    );
    expect(preview.strong).toBe(false);
    expect(preview.message).not.toContain('Type CONFIRM');
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
    const decision = await confirmWrite(c, 'x', vi.fn(), false, strongPreview);
    expect(decision.allowed).toBe(true);
    // The strong flow asked for a typed string, not a checkbox.
    const schema = (elicit.mock.calls[0][0] as any).requestedSchema;
    expect(schema.properties.confirmation.type).toBe('string');
  });

  it('blocks when the user types anything else', async () => {
    const { c } = confirmer({ action: 'accept', content: { confirmation: 'yes' } });
    const decision = await confirmWrite(c, 'x', vi.fn(), false, strongPreview);
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
