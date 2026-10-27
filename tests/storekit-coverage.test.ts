/**
 * The StoreKit tools are hand-written over Apple's own library, so nothing
 * regenerates them when Apple adds an endpoint. Mass extension, consumption
 * information, app transactions and retention messaging all shipped in the
 * library while the tools stood still, and nobody noticed for a year. This
 * test is the noticing: a library method no tool calls and nobody declined on
 * purpose fails here, on the dependabot bump and in the weekly spec watch.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { AppStoreServerAPIClient } from '@apple/app-store-server-library';
import { storekitRisk } from '../src/storekit/index.js';

/** Methods deliberately left without a tool, each with the reason. */
const DECLINED: Record<string, string> = {
  sendConsumptionData: 'the deprecated v1 of sendConsumptionInformation',
  createBearerToken: 'internal: signs the request token, not an endpoint',
};

describe('StoreKit coverage of the App Store Server Library', () => {
  const source = readFileSync('src/storekit/index.ts', 'utf8');
  const methods = Object.getOwnPropertyNames(AppStoreServerAPIClient.prototype).filter(
    (m) => m !== 'constructor' && !m.startsWith('make') && typeof (AppStoreServerAPIClient.prototype as any)[m] === 'function'
  );

  it('finds the library methods at all', () => {
    expect(methods.length).toBeGreaterThan(20);
  });

  it('calls every library method from a tool, or declines it on purpose', () => {
    const uncovered = methods.filter((m) => !source.includes(`client.${m}(`) && !(m in DECLINED));
    expect(uncovered, 'App Store Server Library methods no StoreKit tool calls').toEqual([]);
  });

  it('declines only methods that still exist', () => {
    expect(Object.keys(DECLINED).filter((m) => !methods.includes(m))).toEqual([]);
  });
});

describe('StoreKit risk levels', () => {
  it('asks for a typed CONFIRM on every write that touches a purchase or billing', () => {
    for (const name of [
      'storekit__extend_renewal_date',
      'storekit__mass_extend_renewal_date',
      'storekit__send_consumption_info',
      'storekit__set_app_account_token',
      'storekit__finish_transaction',
    ]) {
      expect(storekitRisk(name, {}), name).toBe('revenue');
    }
  });

  it('decides retention messaging by the action', () => {
    const level = (action: string) => storekitRisk('storekit__manage_retention_messaging', { action });
    expect(level('delete_message')).toBe('destructive');
    expect(level('delete_realtime_url')).toBe('destructive');
    expect(level('set_realtime_url')).toBe('infrastructure');
    expect(level('upload_message')).toBe('public');
  });

  it('keeps reads and the test notification low', () => {
    expect(storekitRisk('storekit__get_transaction_info', {})).toBe('low');
    expect(storekitRisk('storekit__request_test_notification', {})).toBe('low');
  });
});
