/**
 * What the StoreKit tools promise in their schemas, and that each handler
 * holds the same line before Apple sees the request: the server does not
 * validate arguments against inputSchema, so a schema alone guards nothing.
 */
import { describe, expect, it } from 'vitest';
import { STOREKIT_TOOLS, StoreKitService } from '../src/storekit/index.js';
import type { ServerConfig } from '../src/core/config.js';

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

const tool = (name: string) => STOREKIT_TOOLS.find((t) => t.name === name)!;
const props = (name: string) => tool(name).inputSchema.properties as Record<string, any>;

/** Runs one tool against a client that only records what it was asked. */
async function run(name: string, args: Record<string, unknown>) {
  const calls: unknown[][] = [];
  const client = new Proxy({}, {
    get: (_t, method) => async (...callArgs: unknown[]) => {
      calls.push([method, ...callArgs]);
      return {};
    },
  });
  await (new StoreKitService(config) as any).run(name, args, client);
  return calls;
}

describe('StoreKit schemas', () => {
  it.each(['storekit__extend_renewal_date', 'storekit__mass_extend_renewal_date'])('%s: whole days 1-90 and a 0-3 reason', (name) => {
    expect(props(name).extend_by_days).toMatchObject({ type: 'integer', minimum: 1, maximum: 90 });
    expect(props(name).reason).toMatchObject({ type: 'integer', enum: [0, 1, 2, 3] });
    expect(props(name).reason.description).toMatch(/0 not declared, 1 customer satisfaction, 2 other, 3 service issue or outage/);
  });

  it('names the reason each extension sends when none is given', () => {
    expect(props('storekit__extend_renewal_date').reason.description).toMatch(/Omitted, 1 \(customer satisfaction\) is sent/);
    expect(props('storekit__mass_extend_renewal_date').reason.description).toMatch(/Omitted, 3 \(service issue or outage\) is sent/);
  });

  it('consumption is an integer in milliunits of a percent', () => {
    expect(props('storekit__send_consumption_info').consumption_percentage).toMatchObject({ type: 'integer', minimum: 0, maximum: 100000 });
    expect(props('storekit__send_consumption_info').consumption_percentage.description).toMatch(/25000 = 25%/);
  });

  it('every REVENUE write says so, the single extension included', () => {
    expect(tool('storekit__extend_renewal_date').description).toMatch(/ONE subscriber.*storekit__mass_extend_renewal_date.*REVENUE-level write\.$/);
  });

  it('notification history can be paged', () => {
    expect(props('storekit__get_notification_history').pagination_token.type).toBe('string');
    expect(tool('storekit__get_notification_history').description).toMatch(/hasMore.*paginationToken/);
  });

  it('no tool asks the agent to verify and decode JWS it has no tool for', () => {
    for (const t of STOREKIT_TOOLS) expect(t.description).not.toMatch(/verify and decode/i);
    expect(props('storekit__get_subscription_statuses').raw.type).toBe('boolean');
    expect(props('storekit__check_entitlement').raw.type).toBe('boolean');
  });
});

describe('StoreKit handlers', () => {
  it('passes the pagination token to Apple, and none on the first page', async () => {
    const base = { start_date: 1, end_date: 2 };
    expect((await run('storekit__get_notification_history', base))[0][1]).toBeNull();
    expect((await run('storekit__get_notification_history', { ...base, pagination_token: 'tok-2' }))[0][1]).toBe('tok-2');
  });

  it('refuses a reason Apple does not define, and sends the default when none is given', async () => {
    const one = { original_transaction_id: '1', extend_by_days: 3, request_identifier: 'r' };
    await expect(run('storekit__extend_renewal_date', { ...one, reason: 4 })).rejects.toThrow(/reason must be 0 .* or 3/);
    await expect(run('storekit__extend_renewal_date', { ...one, reason: '1' })).rejects.toThrow(/reason must be/);
    expect((await run('storekit__extend_renewal_date', one))[0][2]).toMatchObject({ extendReasonCode: 1 });
    const all = { product_id: 'p', extend_by_days: 3, request_identifier: 'r' };
    expect((await run('storekit__mass_extend_renewal_date', all))[0][1]).toMatchObject({ extendReasonCode: 3 });
    expect((await run('storekit__mass_extend_renewal_date', { ...all, reason: 0 }))[0][1]).toMatchObject({ extendReasonCode: 0 });
  });

  it('uppercases storefront codes before sending them', async () => {
    const [[, request]] = await run('storekit__mass_extend_renewal_date', {
      product_id: 'p', extend_by_days: 3, request_identifier: 'r', storefront_country_codes: ['tur', ' Usa'],
    });
    expect(request).toMatchObject({ storefrontCountryCodes: ['TUR', 'USA'] });
  });

  it('refuses two-letter storefront codes before Apple sees them, naming alpha-3', async () => {
    const args = { product_id: 'p', extend_by_days: 3, request_identifier: 'r', storefront_country_codes: ['TUR', 'us'] };
    await expect(run('storekit__mass_extend_renewal_date', args)).rejects.toThrow(/alpha-3 \(USA, TUR, DEU — not US, TR, DE\); got US\./);
  });

  it('reads an empty storefront list as every country, as the dialog does', async () => {
    const [[, request]] = await run('storekit__mass_extend_renewal_date', {
      product_id: 'p', extend_by_days: 3, request_identifier: 'r', storefront_country_codes: [],
    });
    expect((request as Record<string, unknown>).storefrontCountryCodes).toBeUndefined();
  });

  it('refuses a fractional day count and a consumption share outside 0-100000', async () => {
    await expect(run('storekit__extend_renewal_date', { original_transaction_id: '1', extend_by_days: 1.5, request_identifier: 'r' }))
      .rejects.toThrow(/integer between 1 and 90/);
    await expect(run('storekit__send_consumption_info', {
      transaction_id: '1', customer_consented: true, delivery_status: 'DELIVERED', sample_content_provided: false, consumption_percentage: 100001,
    })).rejects.toThrow(/0 to 100000/);
  });
});
