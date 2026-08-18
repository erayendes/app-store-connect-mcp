/**
 * App Store Server API (StoreKit 2) tools.
 *
 * This is a different API surface from App Store Connect: it answers questions
 * about individual customers' purchases rather than about your app's listing.
 * Built on Apple's own @apple/app-store-server-library so that JWS payload
 * verification is handled by first-party code.
 */
import {
  AppStoreServerAPIClient,
  Environment,
  ExtendReasonCode,
  GetTransactionHistoryVersion,
  Status,
  type ExtendRenewalDateRequest,
  type HistoryResponse,
  type LastTransactionsItem,
  type NotificationHistoryRequest,
  type NotificationTypeV2,
  type Order,
  type ProductType,
  type RefundHistoryResponse,
  type StatusResponse,
  type SubscriptionGroupIdentifierItem,
  type TransactionHistoryRequest,
} from '@apple/app-store-server-library';
import { readFileSync } from 'node:fs';
import type { McpToolDefinition } from '../core/registry.js';
import type { ServerConfig } from '../core/config.js';

/**
 * Reads one claim out of a JWS payload without verifying the signature.
 *
 * Apple signs these and we received them over TLS from an endpoint we
 * authenticated to, so the claim is only as trustworthy as that channel —
 * which is enough to filter our own response. Nothing here grants access;
 * callers who need a verified payload should run it through the library's
 * SignedDataVerifier.
 */
function jwsClaim(jws: string | undefined, claim: string): unknown {
  const payload = jws?.split('.')[1];
  if (payload === undefined) return undefined;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))[claim];
  } catch {
    return undefined;
  }
}

/**
 * A page-capped read that says nothing about the cap reads as the complete
 * history, and "no refunds after the first ten pages" is the answer someone
 * grants goodwill credit on. `revision` is Apple's cursor, so the caller can
 * resume rather than start over.
 */
function truncation(
  hasMore: boolean,
  revision: string | null,
  cap: string
): Record<string, unknown> {
  if (!hasMore) return { hasMore: false };
  return {
    hasMore: true,
    ...(revision ? { revision } : {}),
    note:
      `Stopped at ${cap} with more left at Apple. This is a partial history — ` +
      `raise the cap or resume from "revision" before treating it as complete.`,
  };
}

export const STOREKIT_TOOLS: McpToolDefinition[] = [
  {
    name: 'storekit__get_transaction_history',
    description:
      "Get a customer's full purchase history from any one of their transaction IDs. " +
      'Supports filtering by product type, product ID and date range. Returns Apple\'s ' +
      'SIGNED transactions (JWS strings), not decoded fields — verify and decode them ' +
      'before reading. [App Store Server API]',
    inputSchema: {
      type: 'object',
      properties: {
        transaction_id: {
          type: 'string',
          description: 'Any transaction ID belonging to the customer.',
        },
        product_id: { type: 'string', description: 'Filter to one product ID.' },
        product_type: {
          type: 'string',
          enum: ['AUTO_RENEWABLE', 'NON_RENEWABLE', 'CONSUMABLE', 'NON_CONSUMABLE'],
          description: 'Filter by product type.',
        },
        sort: { type: 'string', enum: ['ASCENDING', 'DESCENDING'] },
        revoked: { type: 'boolean', description: 'Filter by revoked status.' },
        max_pages: {
          type: 'number',
          description:
            'Pages to fetch, 20 transactions each (default 5). The result carries hasMore ' +
            'and a revision cursor when Apple still has more than this fetched.',
        },
      },
      required: ['transaction_id'],
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'storekit__get_transaction_info',
    description:
      'Get a single transaction: product, price, dates, ownership type and revocation ' +
      'state — as Apple\'s SIGNED payload (a JWS string), not as decoded fields. ' +
      "Verify and decode it with the App Store Server Library's SignedDataVerifier, or " +
      "any JWS verifier configured with Apple's roots. [App Store Server API]",
    inputSchema: {
      type: 'object',
      properties: {
        transaction_id: { type: 'string', description: 'Transaction ID to look up.' },
      },
      required: ['transaction_id'],
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'storekit__get_subscription_statuses',
    description:
      "Get the status of every subscription a customer holds, including expiry date, " +
      'auto-renew state, billing retry and grace period. Apple returns those fields ' +
      'inside SIGNED payloads (JWS strings) on each item, so verify and decode them ' +
      'before reading. Use this for entitlement checks. [App Store Server API]',
    inputSchema: {
      type: 'object',
      properties: {
        transaction_id: {
          type: 'string',
          description: 'Any transaction ID belonging to the customer.',
        },
        status: {
          type: 'array',
          items: { type: 'number' },
          description:
            'Filter by status: 1=Active, 2=Expired, 3=BillingRetry, 4=GracePeriod, 5=Revoked.',
        },
      },
      required: ['transaction_id'],
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'storekit__check_entitlement',
    description:
      'Answer the single question "does this customer currently have access?". ' +
      'Returns a boolean plus the active subscriptions backing it — those come back as ' +
      'Apple\'s SIGNED payloads (JWS strings), so verify and decode them before reading ' +
      'any field. Optionally narrow to one product ID. [App Store Server API]',
    inputSchema: {
      type: 'object',
      properties: {
        transaction_id: {
          type: 'string',
          description: 'Any transaction ID belonging to the customer.',
        },
        product_id: {
          type: 'string',
          description: 'Only count this product as granting entitlement.',
        },
      },
      required: ['transaction_id'],
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'storekit__get_refund_history',
    description:
      'List every refunded transaction for a customer. Useful for auditing refund ' +
      'abuse before granting goodwill credit. [App Store Server API]',
    inputSchema: {
      type: 'object',
      properties: {
        transaction_id: {
          type: 'string',
          description: 'Any transaction ID belonging to the customer.',
        },
      },
      required: ['transaction_id'],
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'storekit__lookup_order',
    description:
      'Look up all transactions tied to an order ID from a customer receipt. ' +
      'Use when a customer sends you the order number from their email. ' +
      '[App Store Server API]',
    inputSchema: {
      type: 'object',
      properties: {
        order_id: { type: 'string', description: 'Order ID from the App Store receipt.' },
      },
      required: ['order_id'],
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'storekit__get_notification_history',
    description:
      'Retrieve App Store Server Notification delivery history, including failures. ' +
      'Use to debug a webhook endpoint that is missing events. [App Store Server API]',
    inputSchema: {
      type: 'object',
      properties: {
        start_date: { type: 'number', description: 'Start timestamp in milliseconds.' },
        end_date: { type: 'number', description: 'End timestamp in milliseconds.' },
        notification_type: { type: 'string', description: 'Filter by notification type.' },
        only_failures: { type: 'boolean', description: 'Return only failed deliveries.' },
      },
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'storekit__request_test_notification',
    description:
      'Ask Apple to send a test notification to your configured webhook endpoint. ' +
      'Returns a token you can use to look up the delivery result. ' +
      '[App Store Server API]',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: false, destructiveHint: false },
  },
  {
    name: 'storekit__extend_renewal_date',
    description:
      "Extend a subscriber's renewal date — a service gesture for an outage or a " +
      'support escalation. This changes billing, so confirm with the user before ' +
      'calling it. [App Store Server API]',
    inputSchema: {
      type: 'object',
      properties: {
        original_transaction_id: {
          type: 'string',
          description: "The subscription's original transaction ID.",
        },
        extend_by_days: {
          type: 'number',
          description: 'Days to extend, 1-90.',
        },
        reason: {
          type: 'number',
          description: '0=Undeclared, 1=CustomerSatisfaction, 2=Other, 3=ServiceIssue.',
        },
        request_identifier: {
          type: 'string',
          description: 'Your idempotency key for this extension.',
        },
      },
      required: ['original_transaction_id', 'extend_by_days', 'request_identifier'],
    },
    annotations: { readOnlyHint: false, destructiveHint: true },
  },
];

// Every StoreKit tool accepts an optional environment override. A transaction
// ID exists in exactly one environment, so a caller who has a sandbox ID can
// force the sandbox client without reconfiguring the server.
for (const tool of STOREKIT_TOOLS) {
  (tool.inputSchema.properties as Record<string, unknown>).environment = {
    type: 'string',
    enum: ['Production', 'Sandbox'],
    description:
      'Which App Store environment to query. Defaults to the server-configured ' +
      'environment (ASC_ENVIRONMENT). A transaction ID belongs to one environment only.',
  };
}

export const STOREKIT_TOOL_NAMES = new Set(STOREKIT_TOOLS.map((t) => t.name));

export class StoreKitService {
  private readonly key: string;
  private readonly keyId: string;
  private readonly issuerId: string;
  private readonly bundleId: string;
  private readonly defaultEnvironment: 'Production' | 'Sandbox';
  // One transaction lives in exactly one environment, so callers can override
  // per request; clients are built lazily and cached per environment.
  private readonly clients = new Map<'Production' | 'Sandbox', AppStoreServerAPIClient>();

  constructor(config: ServerConfig) {
    if (!config.storekit) {
      throw new Error(
        'App Store Server API tools require ASC_BUNDLE_ID to be set.'
      );
    }

    this.key = config.credentials.privateKey?.replace(/\\n/g, '\n')
      ?? readFileSync(config.credentials.privateKeyPath!, 'utf8');
    this.keyId = config.credentials.keyId;
    this.issuerId = config.credentials.issuerId;
    this.bundleId = config.storekit.bundleId;
    this.defaultEnvironment = config.storekit.environment === 'Production' ? 'Production' : 'Sandbox';
  }

  /** Client for the requested environment, or the configured default. */
  private clientFor(environment?: unknown): AppStoreServerAPIClient {
    const env: 'Production' | 'Sandbox' =
      environment === 'Production' || environment === 'Sandbox'
        ? environment
        : this.defaultEnvironment;
    let client = this.clients.get(env);
    if (!client) {
      client = new AppStoreServerAPIClient(
        this.key,
        this.keyId,
        this.issuerId,
        this.bundleId,
        env === 'Production' ? Environment.PRODUCTION : Environment.SANDBOX
      );
      this.clients.set(env, client);
    }
    return client;
  }

  async execute(name: string, args: Record<string, any>): Promise<unknown> {
    const client = this.clientFor(args.environment);
    switch (name) {
      case 'storekit__get_transaction_history':
        return this.transactionHistory(client, args);

      case 'storekit__get_transaction_info': {
        // The sealed envelope, on purpose. `jwsClaim` above can open one in two
        // lines, and those are the wrong two lines: it splits on `.` and
        // base64-decodes without checking the signature, which is presenting
        // unverified data as fact. Handing the JWS back is the honest of the
        // two behaviours until MIL-218 threads Apple's roots through and
        // decides what happens when verification fails.
        const res = await client.getTransactionInfo(args.transaction_id);
        return { signedTransactionInfo: res.signedTransactionInfo };
      }

      case 'storekit__get_subscription_statuses':
        return client.getAllSubscriptionStatuses(
          args.transaction_id,
          args.status as Status[] | undefined
        );

      case 'storekit__check_entitlement':
        return this.checkEntitlement(client, args);

      case 'storekit__get_refund_history': {
        const items: string[] = [];
        let revision: string | null = null;
        let hasMore = false;
        for (let page = 0; page < 10; page++) {
          const res: RefundHistoryResponse = await client.getRefundHistory(
            args.transaction_id,
            revision
          );
          if (Array.isArray(res?.signedTransactions)) {
            items.push(...res.signedTransactions);
          }
          hasMore = Boolean(res?.hasMore);
          if (!hasMore) break;
          revision = res.revision ?? null;
          if (!revision) {
            hasMore = false;
            break;
          }
        }
        return {
          signedTransactions: items,
          count: items.length,
          ...truncation(hasMore, revision, 'the 10-page cap'),
        };
      }

      case 'storekit__lookup_order': {
        const res = await client.lookUpOrderId(args.order_id);
        return res;
      }

      case 'storekit__get_notification_history': {
        // notificationType is a string enum in the library; the inputSchema
        // leaves it a free string, so this is the one place we take the
        // caller's word for it.
        const request: NotificationHistoryRequest = {
          startDate: args.start_date,
          endDate: args.end_date,
          notificationType: args.notification_type as NotificationTypeV2 | undefined,
          onlyFailures: args.only_failures,
        };
        return client.getNotificationHistory(null, request);
      }

      case 'storekit__request_test_notification':
        return client.requestTestNotification();

      case 'storekit__extend_renewal_date': {
        const days = Number(args.extend_by_days);
        if (!Number.isInteger(days) || days < 1 || days > 90) {
          throw new Error('extend_by_days must be an integer between 1 and 90.');
        }
        const request: ExtendRenewalDateRequest = {
          extendByDays: days,
          extendReasonCode: (args.reason ??
            ExtendReasonCode.CUSTOMER_SATISFACTION) as ExtendReasonCode,
          requestIdentifier: args.request_identifier,
        };
        return client.extendSubscriptionRenewalDate(
          args.original_transaction_id,
          request
        );
      }

      default:
        throw new Error(`Unknown StoreKit tool: ${name}`);
    }
  }

  private async transactionHistory(
    client: AppStoreServerAPIClient,
    args: Record<string, any>
  ): Promise<unknown> {
    // sort and product_type are constrained to the library's enum values by
    // this tool's inputSchema, so the casts narrow rather than widen.
    const request: TransactionHistoryRequest = {
      sort: args.sort as Order | undefined,
      productIds: args.product_id ? [args.product_id] : undefined,
      productTypes: args.product_type
        ? [args.product_type as ProductType]
        : undefined,
      revoked: args.revoked,
    };

    const maxPages = Math.max(1, Math.min(Number(args.max_pages ?? 5), 50));
    const transactions: string[] = [];
    let revision: string | null = null;
    let hasMore = false;

    for (let page = 0; page < maxPages; page++) {
      const res: HistoryResponse = await client.getTransactionHistory(
        args.transaction_id,
        revision,
        request,
        GetTransactionHistoryVersion.V2
      );
      if (Array.isArray(res?.signedTransactions)) {
        transactions.push(...res.signedTransactions);
      }
      hasMore = Boolean(res?.hasMore);
      if (!hasMore) break;
      revision = res.revision ?? null;
      if (!revision) {
        // Apple says there is more but gave nothing to resume from, so this is
        // the end of what can be read rather than a page cap.
        hasMore = false;
        break;
      }
    }

    return {
      signedTransactions: transactions,
      count: transactions.length,
      ...truncation(hasMore, revision, 'max_pages'),
    };
  }

  private async checkEntitlement(
    client: AppStoreServerAPIClient,
    args: Record<string, any>
  ): Promise<unknown> {
    const res: StatusResponse = await client.getAllSubscriptionStatuses(
      args.transaction_id,
      [Status.ACTIVE, Status.BILLING_GRACE_PERIOD] // Both grant access.
    );

    const groups: SubscriptionGroupIdentifierItem[] = res.data ?? [];

    // A group is named by its subscription group, not by product, and the
    // product ID lives inside each transaction's signed payload — so narrowing
    // to one product means reading that payload, and keeping only the groups
    // that still hold a transaction afterwards.
    let undecodable = 0;
    const matching: SubscriptionGroupIdentifierItem[] = args.product_id
      ? groups
          .map((g) => ({
            ...g,
            lastTransactions: (g.lastTransactions ?? []).filter((t) => {
              const productId = jwsClaim(t.signedTransactionInfo, 'productId');
              // An unreadable payload is not a mismatch, it is an unknown. It
              // still drops out — we will not grant on a guess — but saying so
              // keeps "does not hold this product" apart from "could not tell".
              if (productId === undefined) undecodable++;
              return productId === args.product_id;
            }),
          }))
          .filter((g) => g.lastTransactions.length > 0)
      : groups;

    const active: LastTransactionsItem[] = matching.flatMap((g) =>
      (g.lastTransactions ?? []).filter(
        (t) => t.status === Status.ACTIVE || t.status === Status.BILLING_GRACE_PERIOD
      )
    );

    return {
      entitled: active.length > 0,
      activeCount: active.length,
      // Statuses are JWS-signed; the caller decodes them if they need detail.
      subscriptions: matching,
      ...(undecodable > 0 ? { undecodableTransactions: undecodable } : {}),
      note:
        'Status 1 = Active, 4 = Grace period. Both are treated as entitled. ' +
        'Signed payloads are returned verbatim for you to verify.' +
        (undecodable > 0
          ? ` ${undecodable} transaction(s) had an unreadable payload and were excluded, ` +
            'so a negative result here means "could not confirm", not "does not hold".'
          : ''),
    };
  }
}
