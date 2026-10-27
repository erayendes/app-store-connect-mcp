/**
 * The macOS confirmation text for StoreKit writes.
 *
 * The generic builder titled these with the tool description, printed raw
 * codes ("Reason: 2") and full ids, dropped arrays, and closed on a pricing
 * sentence. These pin the hand-written text: the question, the values in
 * words, the one consequence line, and that no UUID or full id reaches it.
 */
import { describe, expect, it } from 'vitest';
import { storekitDialog } from '../src/storekit/index.js';

const SANDBOX = { environment: 'Sandbox' } as const;
const PRODUCTION = { environment: 'Production' } as const;
const TX = '2000000812345678';
const UUID = '0f9d1c62-7a1b-4b9e-8d8e-2c4b1a7f9e31';
const TOKEN = '7e3f1a2b-9c8d-4e5f-a6b7-c8d9e0f1a2b3';
const MESSAGE = '3c1d2e4f-5a6b-4c7d-8e9f-0a1b2c3d4e5f';
const IMAGE = '9a8b7c6d-5e4f-4a3b-2c1d-0e9f8a7b6c5d';

function dialog(name: string, args: Record<string, unknown>, defaults: { environment: 'Production' | 'Sandbox' } = SANDBOX) {
  const text = storekitDialog(name, args, defaults);
  expect(text).toBeDefined();
  const all = `${text!.title}\n${text!.body}`;
  // No UUID, full transaction id or full token anywhere on screen.
  expect(all).not.toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-/i);
  expect(all).not.toContain(TX);
  expect(text!.body.length).toBeLessThan(1500);
  return text!;
}

describe('storekitDialog: renewal extensions', () => {
  it('mass extension reads as the approved example', () => {
    const text = dialog('storekit__mass_extend_renewal_date', {
      app: 'Milowda Test App', product_id: 'heimdall.test.monthly', extend_by_days: 1, reason: 2,
      request_identifier: UUID, storefront_country_codes: ['TUR'],
    });
    expect(text).toEqual({
      title: 'Extend every heimdall.test.monthly subscription by 1 day?',
      body: "Milowda Test App · Sandbox\nOnly in Türkiye\nReason: other\n\nEach subscriber's next charge moves 1 day later.",
      action: 'Extend',
    });
  });

  it('mass extension without countries covers every country, and an unset reason is the one sent', () => {
    const text = dialog('storekit__mass_extend_renewal_date', {
      product_id: 'heimdall.test.monthly', extend_by_days: 7, request_identifier: UUID,
    }, PRODUCTION);
    expect(text.title).toBe('Extend every heimdall.test.monthly subscription by 7 days?');
    expect(text.body.split('\n')).toEqual([
      'Production — real customers',
      'In every country',
      'Reason: service issue or outage',
      '',
      "Each subscriber's next charge moves 7 days later.",
    ]);
  });

  it('names several countries in one line', () => {
    const text = dialog('storekit__mass_extend_renewal_date', {
      product_id: 'p', extend_by_days: 3, request_identifier: UUID, storefront_country_codes: ['USA', 'DEU', 'TUR'],
    });
    expect(text.body).toContain('Only in United States, Germany and Türkiye');
  });

  it('one subscriber, environment argument over the default', () => {
    const text = dialog('storekit__extend_renewal_date', {
      original_transaction_id: TX, extend_by_days: 7, reason: 3, request_identifier: UUID,
      environment: 'Production', app: 'com.milowda.test',
    }, SANDBOX);
    expect(text.title).toBe('Extend one subscription by 7 days?');
    expect(text.action).toBe('Extend');
    expect(text.body.split('\n')).toEqual([
      'com.milowda.test · Production — real customers',
      'Transaction ending 5678',
      'Reason: service issue or outage',
      '',
      "This subscriber's next charge moves 7 days later.",
    ]);
  });

  it('reason codes in words; unset on one subscriber is customer satisfaction', () => {
    const reason = (r: unknown) =>
      dialog('storekit__extend_renewal_date', { original_transaction_id: TX, extend_by_days: 1, request_identifier: UUID, reason: r })
        .body.split('\n')[2];
    expect(reason(0)).toBe('Reason: not given');
    expect(reason(1)).toBe('Reason: customer satisfaction');
    expect(reason(2)).toBe('Reason: other');
    expect(reason(undefined)).toBe('Reason: customer satisfaction');
  });
});

describe('storekitDialog: purchases', () => {
  it('consumption info in words', () => {
    const text = dialog('storekit__send_consumption_info', {
      transaction_id: TX, customer_consented: true, delivery_status: 'DELIVERED',
      sample_content_provided: false, consumption_percentage: 25000, refund_preference: 'DECLINE', app: '6741234567',
    });
    expect(text.title).toBe('Send refund details for transaction ending 5678?');
    expect(text.action).toBe('Send');
    expect(text.body.split('\n')).toEqual([
      'Apple ID 6741234567 · Sandbox',
      'Customer consented: yes',
      'Delivery: delivered and working',
      'Used: 25%',
      'Free sample or trial before purchase: no',
      'Preferred outcome: decline the refund',
      '',
      'Apple weighs this when deciding the refund.',
    ]);
  });

  it('consumption info leaves out what was not given', () => {
    const text = dialog('storekit__send_consumption_info', {
      transaction_id: TX, customer_consented: true, delivery_status: 'UNDELIVERED_SERVER_OUTAGE', sample_content_provided: true,
    });
    expect(text.body).toContain('Delivery: not delivered: server outage');
    expect(text.body).not.toContain('Used:');
    expect(text.body).not.toContain('Preferred outcome');
  });

  it('app account token shows only its first 8 characters', () => {
    const text = dialog('storekit__set_app_account_token', { original_transaction_id: TX, app_account_token: TOKEN });
    expect(text.title).toBe('Link transaction ending 5678 to an account?');
    expect(text.action).toBe('Link');
    expect(text.body).toContain('Account token: 7e3f1a2b…');
    expect(text.body).not.toContain(TOKEN.slice(0, 9));
    expect(text.body.endsWith('Apple sets this token on the purchase, replacing any it had.')).toBe(true);
  });

  it('finish transaction', () => {
    const text = dialog('storekit__finish_transaction', { transaction_id: TX }, PRODUCTION);
    expect(text).toEqual({
      title: 'Finish transaction ending 5678?',
      body: 'Production — real customers\n\nThe App Store records that your server has finished processing it.',
      action: 'Finish',
    });
  });

  it('test notification', () => {
    const text = dialog('storekit__request_test_notification', { app: 'Milowda Test App' });
    expect(text).toEqual({
      title: 'Request a test notification?',
      body: "Milowda Test App · Sandbox\n\nApple sends a test notification to your server; customers aren't affected.",
      action: 'Request',
    });
  });
});

describe('storekitDialog: retention messaging', () => {
  const retention = (args: Record<string, unknown>) => dialog('storekit__manage_retention_messaging', args);

  it('upload_message shows header, body and bullet points', () => {
    const text = retention({
      action: 'upload_message', message_id: MESSAGE, header: 'Before you go', body: 'Stay for 50% off.',
      bullet_points: [{ text: 'Keep your plans', image_id: IMAGE, alt_text: 'x' }], image_id: IMAGE, image_alt_text: 'A gift',
    });
    expect(text.title).toBe('Upload a retention message?');
    expect(text.action).toBe('Upload');
    expect(text.body.split('\n')).toEqual([
      'Sandbox',
      'Header: Before you go',
      'Body: Stay for 50% off.',
      '• Keep your plans',
      'Image: A gift',
      '',
      'Customers about to cancel see it once it is set as a default or picked by your realtime URL.',
    ]);
  });

  it('delete_message', () => {
    const text = retention({ action: 'delete_message', message_id: MESSAGE });
    expect(text.title).toBe('Delete a retention message?');
    expect(text.action).toBe('Delete');
    expect(text.body).toContain('Message 3c1d2e4f…');
  });

  it('upload_image names the file, not its path', () => {
    const text = retention({ action: 'upload_image', image_id: IMAGE, file_path: '/tmp/x/gift.png', image_size: 'BULLET_POINT' });
    expect(text.title).toBe('Upload a retention image?');
    expect(text.action).toBe('Upload');
    expect(text.body).toContain('File: gift.png');
    expect(text.body).toContain('Size: bullet point');
    expect(text.body).not.toContain('/tmp');
  });

  it('delete_image', () => {
    const text = retention({ action: 'delete_image', image_id: IMAGE });
    expect(text.title).toBe('Delete a retention image?');
    expect(text.action).toBe('Delete');
    expect(text.body).toContain('Image 9a8b7c6d…');
  });

  it('set_default_message shows product and locale', () => {
    const text = retention({ action: 'set_default_message', product_id: 'heimdall.test.monthly', locale: 'en-US', message_id: MESSAGE });
    expect(text.title).toBe('Set the default retention message for heimdall.test.monthly?');
    expect(text.action).toBe('Set');
    expect(text.body).toContain('Locale: en-US');
    expect(text.body.endsWith('Customers about to cancel see this message by default.')).toBe(true);
  });

  it('delete_default_message', () => {
    const text = retention({ action: 'delete_default_message', product_id: 'heimdall.test.monthly', locale: 'tr' });
    expect(text.title).toBe('Delete the default retention message for heimdall.test.monthly?');
    expect(text.action).toBe('Delete');
    expect(text.body).toContain('Locale: tr');
  });

  it('set_realtime_url shows the URL and that it reaches Production too', () => {
    const text = retention({ action: 'set_realtime_url', url: 'https://example.com/retention' });
    expect(text.title).toBe('Set the retention realtime URL?');
    expect(text.action).toBe('Set');
    expect(text.body).toContain('URL: https://example.com/retention');
    expect(text.body).toContain('in Sandbox and Production');
  });

  it('delete_realtime_url', () => {
    const text = retention({ action: 'delete_realtime_url' });
    expect(text.title).toBe('Delete the retention realtime URL?');
    expect(text.action).toBe('Delete');
  });

  it('start_performance_test', () => {
    const text = retention({ action: 'start_performance_test', original_transaction_id: TX });
    expect(text.title).toBe('Start a performance test of the realtime URL?');
    expect(text.action).toBe('Start');
    expect(text.body).toContain('Transaction ending 5678');
  });

  it('an unknown action falls back to the generic text', () => {
    expect(storekitDialog('storekit__manage_retention_messaging', { action: 'rename' }, SANDBOX)).toBeUndefined();
  });
});

describe('storekitDialog: reads', () => {
  it.each([
    'storekit__get_transaction_history', 'storekit__get_transaction_info', 'storekit__check_entitlement',
    'storekit__get_mass_extension_status', 'storekit__get_retention_messaging', 'storekit__get_test_notification_status',
  ])('%s has no dialog', (name) => {
    expect(storekitDialog(name, { transaction_id: TX }, SANDBOX)).toBeUndefined();
  });
});
