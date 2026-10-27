/**
 * StoreKit entitlement logic.
 *
 * `check_entitlement` answers "does this customer have access?", optionally
 * narrowed to one product. The narrowing is the part worth pinning: a product
 * ID is not on the subscription-group item, it is inside each transaction's
 * signed payload, so a filter that never opens that payload silently answers
 * about the wrong product.
 */
import { describe, expect, it } from 'vitest';
import { StoreKitService } from '../src/storekit/index.js';
import type { ServerConfig } from '../src/core/config.js';
import { APIException, type StatusResponse } from '@apple/app-store-server-library';

const config = {
  credentials: {
    keyId: 'KEYID00000',
    issuerId: '00000000-0000-0000-0000-000000000000',
    privateKey: '-----BEGIN PRIVATE KEY-----\\nnot-a-real-key\\n-----END PRIVATE KEY-----',
  },
  storekit: { bundleId: 'com.example.app', environment: 'Sandbox' },
  readOnly: false,
  confirmWrites: 'off',
} as ServerConfig;

/** A JWS whose payload carries one product ID. Signature is never checked. */
function signedTransaction(productId: string): string {
  const payload = Buffer.from(JSON.stringify({ productId })).toString('base64url');
  return `header.${payload}.signature`;
}

/** Stands in for the API client; only the one method under test is reached. */
function stubClient(response: StatusResponse) {
  return { getAllSubscriptionStatuses: async () => response } as never;
}

/** Two groups, each holding one active transaction for a different product. */
const twoProducts: StatusResponse = {
  data: [
    {
      subscriptionGroupIdentifier: 'group-pro',
      lastTransactions: [
        {
          status: 1,
          originalTransactionId: '1000000000000001',
          signedTransactionInfo: signedTransaction('com.example.pro.monthly'),
        },
      ],
    },
    {
      subscriptionGroupIdentifier: 'group-extra',
      lastTransactions: [
        {
          status: 1,
          originalTransactionId: '1000000000000002',
          signedTransactionInfo: signedTransaction('com.example.extra.storage'),
        },
      ],
    },
  ],
};

const entitlement = (response: StatusResponse, args: Record<string, unknown>) =>
  (new StoreKitService(config) as never as {
    checkEntitlement(client: never, args: Record<string, unknown>): Promise<{
      entitled: boolean;
      activeCount: number;
      subscriptions: { subscriptionGroupIdentifier?: string }[];
      undecodableTransactions?: number;
    }>;
  }).checkEntitlement(stubClient(response), args);

describe('check_entitlement', () => {
  it('narrows to the requested product', async () => {
    const res = await entitlement(twoProducts, {
      transaction_id: '1000000000000001',
      product_id: 'com.example.pro.monthly',
    });

    expect(res.entitled).toBe(true);
    expect(res.activeCount).toBe(1);
    expect(res.subscriptions).toHaveLength(1);
    // The one that survived must be the pro group, not merely "one of them".
    expect(res.subscriptions[0].subscriptionGroupIdentifier).toBe('group-pro');
  });

  it('is not entitled to a product the customer does not hold', async () => {
    const res = await entitlement(twoProducts, {
      transaction_id: '1000000000000001',
      product_id: 'com.example.premium.yearly',
    });

    expect(res.entitled).toBe(false);
    expect(res.activeCount).toBe(0);
    expect(res.subscriptions).toEqual([]);
  });

  it('counts every product when none is named', async () => {
    const res = await entitlement(twoProducts, {
      transaction_id: '1000000000000001',
    });

    expect(res.entitled).toBe(true);
    expect(res.activeCount).toBe(2);
  });

  it('treats grace period as entitled and expiry as not', async () => {
    const response: StatusResponse = {
      data: [
        {
          subscriptionGroupIdentifier: 'group-pro',
          lastTransactions: [
            { status: 4, signedTransactionInfo: signedTransaction('a') },
            { status: 2, signedTransactionInfo: signedTransaction('b') },
          ],
        },
      ],
    };

    const res = await entitlement(response, { transaction_id: '1' });

    expect(res.entitled).toBe(true);
    expect(res.activeCount).toBe(1); // the expired one does not count
  });

  it('drops a transaction whose payload cannot be read rather than matching it', async () => {
    const response: StatusResponse = {
      data: [
        {
          subscriptionGroupIdentifier: 'group-pro',
          lastTransactions: [
            { status: 1, signedTransactionInfo: 'not.a.jws' },
            { status: 1 }, // no payload at all
          ],
        },
      ],
    };

    const res = await entitlement(response, {
      transaction_id: '1',
      product_id: 'com.example.pro.monthly',
    });

    expect(res.entitled).toBe(false);
    // ...but says so, so the caller can tell this apart from a real "no".
    expect(res.undecodableTransactions).toBe(2);
  });

  it('omits the undecodable count when every payload was readable', async () => {
    const res = await entitlement(twoProducts, {
      transaction_id: '1000000000000001',
      product_id: 'com.example.pro.monthly',
    });

    expect(res.undecodableTransactions).toBeUndefined();
  });

  it('reports nothing when the customer has no subscriptions', async () => {
    const res = await entitlement({}, { transaction_id: '1' });

    expect(res.entitled).toBe(false);
    expect(res.activeCount).toBe(0);
  });
});

/**
 * A page cap that keeps quiet is the dangerous one: "no refunds" and "no
 * refunds in the first N pages" are the same response, and the second is what
 * someone grants goodwill credit against.
 */
describe('transaction history paging', () => {
  const history = (pages: Array<{ signedTransactions: string[]; hasMore: boolean; revision?: string }>) => {
    let call = 0;
    const client = { getTransactionHistory: async () => pages[Math.min(call++, pages.length - 1)] };
    return (new StoreKitService(config) as never as {
      transactionHistory(client: never, args: Record<string, unknown>): Promise<any>;
    }).transactionHistory(client as never, { transaction_id: '1', max_pages: 2, raw: true });
  };

  it('says it stopped short and hands back the cursor to resume from', async () => {
    const res = await history([
      { signedTransactions: ['a'], hasMore: true, revision: 'r1' },
      { signedTransactions: ['b'], hasMore: true, revision: 'r2' },
    ]);

    expect(res.count).toBe(2);
    expect(res.hasMore).toBe(true);
    expect(res.revision).toBe('r2');
    expect(res.note).toMatch(/partial history/);
  });

  it('reports a complete read as complete', async () => {
    const res = await history([{ signedTransactions: ['a'], hasMore: false }]);

    expect(res.hasMore).toBe(false);
    expect(res.note).toBeUndefined();
  });
});

/**
 * Apple scopes every App Store Server API token to one app, and the key can
 * already read the account's app list, so the bundle ID is looked up rather
 * than asked for in setup.
 */
describe('which app a StoreKit call goes to', () => {
  const apps = (list: Array<{ id: string; name: string; bundleId: string }>) => {
    const calls: string[] = [];
    const http = {
      get: async (path: string) => {
        calls.push(path);
        if (path.startsWith('/v1/apps/')) {
          const hit = list.find((a) => path.endsWith(a.id));
          return { data: hit && { id: hit.id, attributes: hit } };
        }
        return { data: list.map((a) => ({ id: a.id, attributes: a })) };
      },
    };
    return { http: http as never, calls };
  };
  const noBundle = { ...config, storekit: { environment: 'Production' } } as ServerConfig;
  const target = (svc: StoreKitService, app?: string) =>
    (svc as never as { target(app: unknown): Promise<{ bundleId: string; appAppleId?: number }> }).target(app);

  it("uses the account's only app when none is named", async () => {
    const { http } = apps([{ id: '111', name: 'Ask Quran', bundleId: 'com.x.quran' }]);
    expect(await target(new StoreKitService(noBundle, http))).toEqual({ bundleId: 'com.x.quran', appAppleId: 111 });
  });

  it('asks which app when the account has several, naming them', async () => {
    const { http } = apps([
      { id: '1', name: 'Ask Quran', bundleId: 'com.x.quran' },
      { id: '2', name: 'Postmate', bundleId: 'com.x.post' },
    ]);
    await expect(target(new StoreKitService(noBundle, http))).rejects.toThrow(/Ask Quran \| Postmate/);
  });

  it('resolves a named app, once per session', async () => {
    const { http, calls } = apps([
      { id: '1', name: 'Ask Quran', bundleId: 'com.x.quran' },
      { id: '2', name: 'Postmate', bundleId: 'com.x.post' },
    ]);
    const svc = new StoreKitService(noBundle, http);
    expect(await target(svc, 'postmate')).toEqual({ bundleId: 'com.x.post', appAppleId: 2 });
    await target(svc, 'postmate');
    expect(calls).toHaveLength(1);
  });

  it('looks up the Apple ID behind ASC_BUNDLE_ID in Production, which verification needs', async () => {
    const { http } = apps([{ id: '9', name: 'Example', bundleId: 'com.example.app' }]);
    const production = { ...config, storekit: { bundleId: 'com.example.app', environment: 'Production' } } as ServerConfig;
    expect(await target(new StoreKitService(production, http))).toEqual({ bundleId: 'com.example.app', appAppleId: 9 });
  });

  it('keeps ASC_BUNDLE_ID as the default without a lookup in Sandbox', async () => {
    const { http, calls } = apps([]);
    expect((await target(new StoreKitService(config, http))).bundleId).toBe('com.example.app');
    expect(calls).toHaveLength(0);
  });
});

describe('what a StoreKit failure says', () => {
  const fail = (err: unknown) => {
    const svc = new StoreKitService(config, { get: async () => ({ data: [{ id: '9', attributes: { name: 'Example', bundleId: 'com.example.app' } }] }) } as never);
    Object.assign(svc, { run: async () => { throw err; }, clientFor: () => ({}) });
    return svc;
  };

  it('points a Production 401 at a missing App Store release, not only at the key', async () => {
    await expect(fail(new APIException(401)).execute('storekit__get_notification_history', { environment: 'Production' }))
      .rejects.toThrow(/returned 401\. App: com\.example\.app\. Apple answers 401 in Production for an app with no App Store release/);
    await expect(fail(new APIException(401)).execute('storekit__get_notification_history', { environment: 'Sandbox' }))
      .rejects.toThrow(/App: com\.example\.app\.$/);
  });

  it('says a retention messaging 404 may mean the feature is not enabled', async () => {
    await expect(fail(new APIException(404)).execute('storekit__get_retention_messaging', { environment: 'Sandbox' }))
      .rejects.toThrow(/Retention messaging may not be enabled for this account/);
  });
});
