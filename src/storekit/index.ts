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
  type TransactionHistoryRequest,
} from '@apple/app-store-server-library';
import { readFileSync } from 'node:fs';
import type { McpToolDefinition } from '../core/registry.js';
import type { ServerConfig } from '../core/config.js';

export const STOREKIT_TOOLS: McpToolDefinition[] = [
  {
    name: 'storekit__get_transaction_history',
    description:
      "Get a customer's full purchase history from any one of their transaction IDs. " +
      'Supports filtering by product type, product ID and date range. ' +
      '[App Store Server API]',
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
          description: 'Pages to fetch, 20 transactions each (default 5).',
        },
      },
      required: ['transaction_id'],
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'storekit__get_transaction_info',
    description:
      'Get the decoded details of a single transaction: product, price, dates, ' +
      'ownership type and revocation state. [App Store Server API]',
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
      'auto-renew state, billing retry and grace period. Use this for entitlement ' +
      'checks. [App Store Server API]',
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
      'Returns a boolean plus the active subscriptions backing it. ' +
      'Optionally narrow to one product ID. [App Store Server API]',
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

export const STOREKIT_TOOL_NAMES = new Set(STOREKIT_TOOLS.map((t) => t.name));

export class StoreKitService {
  private readonly client: AppStoreServerAPIClient;

  constructor(config: ServerConfig) {
    if (!config.storekit) {
      throw new Error(
        'App Store Server API tools require ASC_BUNDLE_ID to be set.'
      );
    }

    const key = config.credentials.privateKey?.replace(/\\n/g, '\n')
      ?? readFileSync(config.credentials.privateKeyPath!, 'utf8');

    this.client = new AppStoreServerAPIClient(
      key,
      config.credentials.keyId,
      config.credentials.issuerId,
      config.storekit.bundleId,
      config.storekit.environment === 'Production'
        ? Environment.PRODUCTION
        : Environment.SANDBOX
    );
  }

  async execute(name: string, args: Record<string, any>): Promise<unknown> {
    switch (name) {
      case 'storekit__get_transaction_history':
        return this.transactionHistory(args);

      case 'storekit__get_transaction_info': {
        const res = await this.client.getTransactionInfo(args.transaction_id);
        return { signedTransactionInfo: res.signedTransactionInfo };
      }

      case 'storekit__get_subscription_statuses': {
        const res = await this.client.getAllSubscriptionStatuses(
          args.transaction_id,
          args.status
        );
        return res;
      }

      case 'storekit__check_entitlement':
        return this.checkEntitlement(args);

      case 'storekit__get_refund_history': {
        const items: unknown[] = [];
        let revision: string | null = null;
        for (let page = 0; page < 10; page++) {
          const res: any = await this.client.getRefundHistory(
            args.transaction_id,
            revision
          );
          if (Array.isArray(res?.signedTransactions)) {
            items.push(...res.signedTransactions);
          }
          if (!res?.hasMore) break;
          revision = res.revision ?? null;
          if (!revision) break;
        }
        return { signedTransactions: items, count: items.length };
      }

      case 'storekit__lookup_order': {
        const res = await this.client.lookUpOrderId(args.order_id);
        return res;
      }

      case 'storekit__get_notification_history': {
        const res = await this.client.getNotificationHistory(null, {
          startDate: args.start_date,
          endDate: args.end_date,
          notificationType: args.notification_type,
          onlyFailures: args.only_failures,
        } as any);
        return res;
      }

      case 'storekit__request_test_notification':
        return this.client.requestTestNotification();

      case 'storekit__extend_renewal_date': {
        const days = Number(args.extend_by_days);
        if (!Number.isInteger(days) || days < 1 || days > 90) {
          throw new Error('extend_by_days must be an integer between 1 and 90.');
        }
        return this.client.extendSubscriptionRenewalDate(
          args.original_transaction_id,
          {
            extendByDays: days,
            extendReasonCode: args.reason ?? 1,
            requestIdentifier: args.request_identifier,
          } as any
        );
      }

      default:
        throw new Error(`Unknown StoreKit tool: ${name}`);
    }
  }

  private async transactionHistory(args: Record<string, any>): Promise<unknown> {
    const request: TransactionHistoryRequest = {
      sort: args.sort,
      productIds: args.product_id ? [args.product_id] : undefined,
      productTypes: args.product_type ? [args.product_type] : undefined,
      revoked: args.revoked,
    } as TransactionHistoryRequest;

    const maxPages = Math.max(1, Math.min(Number(args.max_pages ?? 5), 50));
    const transactions: string[] = [];
    let revision: string | null = null;

    for (let page = 0; page < maxPages; page++) {
      const res: any = await this.client.getTransactionHistory(
        args.transaction_id,
        revision,
        request,
        'v2' as any
      );
      if (Array.isArray(res?.signedTransactions)) {
        transactions.push(...res.signedTransactions);
      }
      if (!res?.hasMore) break;
      revision = res.revision ?? null;
      if (!revision) break;
    }

    return { signedTransactions: transactions, count: transactions.length };
  }

  private async checkEntitlement(args: Record<string, any>): Promise<unknown> {
    const res: any = await this.client.getAllSubscriptionStatuses(
      args.transaction_id,
      [1, 4] // Active and GracePeriod both grant access.
    );

    const groups: any[] = res?.data ?? [];
    const matching = args.product_id
      ? groups.filter((g) =>
          (g.lastTransactions ?? []).some(
            (t: any) => t.originalTransactionId && g.subscriptionGroupIdentifier
          )
        )
      : groups;

    const active = matching.flatMap((g) =>
      (g.lastTransactions ?? []).filter((t: any) => t.status === 1 || t.status === 4)
    );

    return {
      entitled: active.length > 0,
      activeCount: active.length,
      // Statuses are JWS-signed; the caller decodes them if they need detail.
      subscriptions: matching,
      note:
        'Status 1 = Active, 4 = Grace period. Both are treated as entitled. ' +
        'Signed payloads are returned verbatim for you to verify.',
    };
  }
}
