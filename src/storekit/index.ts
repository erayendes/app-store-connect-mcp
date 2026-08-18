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
  SignedDataVerifier,
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
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { AscApiError } from '../core/errors.js';
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
 * What a decoded transaction is allowed to carry into a model's context.
 *
 * Apple's payload holds more than any of these tools was asked for, and
 * `appAccountToken` is the sharp one: it is the UUID a developer maps to their
 * own user record, so a transaction id becomes a route back to an account
 * inside their app. Nothing here needs it, so nothing here returns it. Anyone
 * who does need the full payload asks for `raw`, verifies it themselves, and
 * makes that choice deliberately.
 */
const TRANSACTION_FIELDS = [
  'transactionId',
  'originalTransactionId',
  'productId',
  'purchaseDate',
  'expiresDate',
  'quantity',
  'type',
  'inAppOwnershipType',
  'revocationDate',
  'revocationReason',
  'isUpgraded',
  'offerType',
  'storefront',
  'currency',
  'price',
] as const;

/**
 * Reads Apple's DER roots from paths, or from a directory of them.
 *
 * The library asks the caller for these rather than shipping them, and this
 * repository does not ship them either: a certificate committed here is one
 * more thing to keep current, and getting it wrong turns verification into a
 * silent no. Unset is a supported state — the reads then return the signed
 * envelope, which is what their descriptions already say.
 */
function readRootCertificates(paths: string[] | undefined): Buffer[] {
  if (!paths?.length) return [];
  const files: string[] = [];
  for (const entry of paths) {
    try {
      if (statSync(entry).isDirectory()) {
        files.push(...readdirSync(entry).filter((f) => /\.(cer|der|crt)$/i.test(f)).map((f) => join(entry, f)));
      } else {
        files.push(entry);
      }
    } catch {
      // A path that is not there is a configuration mistake, and it surfaces
      // below as "no roots" rather than as a crash at startup — the server has
      // 24 other tools that do not need them.
    }
  }
  return files.flatMap((f) => {
    try {
      return [readFileSync(f)];
    } catch {
      return [];
    }
  });
}

function pickTransactionFields(decoded: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of TRANSACTION_FIELDS) {
    if (decoded[key] !== undefined) out[key] = decoded[key];
  }
  return out;
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
      'SIGNED transactions (JWS strings) unless ASC_APPLE_ROOT_CERTS is set, in which ' +
      'case they arrive verified and decoded. [App Store Server API]',
    inputSchema: {
      type: 'object',
      properties: {
        transaction_id: {
          type: 'string',
          description: 'Any transaction ID belonging to the customer.',
        },
        product_id: { type: 'string', description: 'Filter to one product ID.' },
        raw: {
          type: 'boolean',
          description:
            'Return Apple\'s signed JWS payloads instead of decoded fields, to verify them ' +
            'yourself. Ignored when ASC_APPLE_ROOT_CERTS is unset — the payloads are all ' +
            'there is then.',
        },
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
      'state. Set ASC_APPLE_ROOT_CERTS and the payload arrives verified and decoded; ' +
      "without it you get Apple's SIGNED payload (a JWS string) to verify yourself with " +
      "the App Store Server Library. [App Store Server API]",
    inputSchema: {
      type: 'object',
      properties: {
        transaction_id: { type: 'string', description: 'Transaction ID to look up.' },
        raw: {
          type: 'boolean',
          description:
            'Return Apple\'s signed JWS payloads instead of decoded fields, to verify them ' +
            'yourself. Ignored when ASC_APPLE_ROOT_CERTS is unset — the payloads are all ' +
            'there is then.',
        },
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
      'abuse before granting goodwill credit. Returns Apple\'s SIGNED transactions ' +
      '(JWS strings) unless ASC_APPLE_ROOT_CERTS is set, in which case they arrive ' +
      'verified and decoded. [App Store Server API]',
    inputSchema: {
      type: 'object',
      properties: {
        transaction_id: {
          type: 'string',
          description: 'Any transaction ID belonging to the customer.',
        },
        raw: {
          type: 'boolean',
          description:
            'Return Apple\'s signed JWS payloads instead of decoded fields, to verify them ' +
            'yourself. Ignored when ASC_APPLE_ROOT_CERTS is unset — the payloads are all ' +
            'there is then.',
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
  private readonly appAppleId?: number;
  /** Apple's DER roots, read once. Empty means verified decoding is off. */
  private readonly rootCertificates: Buffer[];
  private readonly verifiers = new Map<'Production' | 'Sandbox', SignedDataVerifier>();
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
    this.appAppleId = config.storekit.appAppleId;
    this.rootCertificates = readRootCertificates(config.storekit.appleRootCerts);
  }

  /** True when a caller configured Apple's roots, so payloads can be verified. */
  private get canVerify(): boolean {
    return this.rootCertificates.length > 0;
  }

  private verifierFor(env: 'Production' | 'Sandbox'): SignedDataVerifier {
    let verifier = this.verifiers.get(env);
    if (!verifier) {
      try {
        verifier = this.buildVerifier(env);
      } catch (err) {
        // A file that is not a DER certificate fails here, inside OpenSSL, with
        // a message nobody can act on ("PEM routines::no start line"). Say what
        // was being attempted and with what.
        throw new AscApiError(
          `ASC_APPLE_ROOT_CERTS does not parse as Apple's DER root certificates: ` +
            `${(err as Error).message}. Point it at the .cer files Apple publishes, or ` +
            `unset it to receive the signed payloads instead.`,
          0
        );
      }
      this.verifiers.set(env, verifier);
    }
    return verifier;
  }

  private buildVerifier(env: 'Production' | 'Sandbox'): SignedDataVerifier {
    return new SignedDataVerifier(
      this.rootCertificates,
      // Online checks fetch Apple's CRLs on every call. Off: the roots pin the
      // chain, and a read tool should not add a second network dependency whose
      // outage looks like a verification failure.
      false,
      env === 'Production' ? Environment.PRODUCTION : Environment.SANDBOX,
      this.bundleId,
      this.appAppleId
    );
  }

  /**
   * Verified fields, or the sealed envelope — never a decode without a check.
   *
   * A failure is an error rather than a warning attached to data. The whole
   * point of verifying is that the caller can treat what comes back as fact;
   * handing back "here are the fields, but we could not confirm them" invites
   * exactly the reading it was supposed to prevent.
   */
  private async decode(
    signed: string[],
    env: 'Production' | 'Sandbox',
    raw: boolean
  ): Promise<unknown[]> {
    if (raw || !this.canVerify) return signed;
    const verifier = this.verifierFor(env);
    const out: unknown[] = [];
    for (const jws of signed) {
      try {
        const decoded = await verifier.verifyAndDecodeTransaction(jws);
        out.push(pickTransactionFields(decoded as unknown as Record<string, unknown>));
      } catch (err) {
        throw new AscApiError(
          `A transaction payload failed signature verification: ${(err as Error).message}. ` +
            `Nothing was decoded. Check that ASC_APPLE_ROOT_CERTS points at Apple's current ` +
            `root certificates and that the environment (${env}) matches the transaction.`,
          0
        );
      }
    }
    return out;
  }

  /** The environment a call runs against: the argument, else the default. */
  private envFor(environment?: unknown): 'Production' | 'Sandbox' {
    return environment === 'Production' || environment === 'Sandbox'
      ? environment
      : this.defaultEnvironment;
  }

  /**
   * The shape both history tools return: decoded fields when verification is
   * available and not waived, the signed array otherwise. `verified` is stated
   * either way so a caller never has to infer which one it got.
   */
  private async envelopeOrFields(
    signed: string[],
    args: Record<string, any>
  ): Promise<Record<string, unknown>> {
    const raw = Boolean(args.raw);
    if (raw || !this.canVerify) return { signedTransactions: signed, verified: false };
    return { transactions: await this.decode(signed, this.envFor(args.environment), false), verified: true };
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
        const res = await client.getTransactionInfo(args.transaction_id);
        const signed = res.signedTransactionInfo ? [res.signedTransactionInfo] : [];
        const [one] = await this.decode(signed, this.envFor(args.environment), Boolean(args.raw));
        return this.canVerify && !args.raw
          ? { transaction: one ?? null, verified: true }
          : { signedTransactionInfo: res.signedTransactionInfo, verified: false };
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
          ...(await this.envelopeOrFields(items, args)),
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
      ...(await this.envelopeOrFields(transactions, args)),
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
