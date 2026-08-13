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
import type { StatusResponse } from '@apple/app-store-server-library';

const config = {
  credentials: {
    keyId: 'KEYID00000',
    issuerId: '00000000-0000-0000-0000-000000000000',
    privateKey: '-----BEGIN PRIVATE KEY-----\\nnot-a-real-key\\n-----END PRIVATE KEY-----',
  },
  storekit: { bundleId: 'com.example.app', environment: 'Sandbox' },
  readOnly: false,
  confirmWrites: false,
  includeDeprecated: false,
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
    }).transactionHistory(client as never, { transaction_id: '1', max_pages: 2 });
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
