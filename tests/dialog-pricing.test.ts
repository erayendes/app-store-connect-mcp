import { describe, it, expect } from 'vitest';
import { pricingDialog, listText, appLabel } from '../src/tools/pricing.js';

const app = 'Heimdall Test (com.example.heimdall)';
const lines = (body: string) => body.split('\n');

describe('pricingDialog', () => {
  it('names a new subscription, its group and price, and says nothing sells before review', () => {
    const d = pricingDialog('pricing__setup_subscription', {
      app, group: 'Heimdall Test', product_id: 'heimdall.test.monthly', name: 'Heimdall Test Monthly', period: 'ONE_MONTH',
      localizations: [{ locale: 'en-US', name: 'Monthly', description: 'x' }], territory: 'tur', price: '99,99',
    })!;
    expect(d.title).toBe('Create the subscription "Heimdall Test Monthly"?');
    expect(d.action).toBe('Create');
    expect(lines(d.body)[0]).toBe('Heimdall Test · group "Heimdall Test" (created if missing)');
    expect(d.body).toContain('Price: 99.99 every month in Türkiye; Apple sets the other countries');
    // No territories means everywhere.
    expect(d.body).toContain('On sale: everywhere, new countries included');
    expect(d.body).toContain('Product ID: heimdall.test.monthly (can’t be changed later)');
    expect(d.body.endsWith('\n\nNothing is sold until App Review approves it.')).toBe(true);
    expect(d.body).not.toMatch(/ONE_MONTH|TUR\b/);
  });

  it('caps a long country list', () => {
    const d = pricingDialog('pricing__setup_subscription', {
      app, group: 'G', product_id: 'p', name: 'N', period: 'ONE_YEAR', localizations: [{ locale: 'tr' }],
      territory: 'TUR', price: '9.99', territories: ['TUR', 'USA', 'DEU', 'FRA', 'GBR'], family_sharable: true,
    })!;
    expect(d.body).toContain('9.99 every year in Türkiye');
    expect(d.body).toContain('On sale: Türkiye, United States and 3 more');
    expect(d.body).toContain('Family Sharing: on');
  });

  it('shows the names, descriptions and group name customers will read', () => {
    const d = pricingDialog('pricing__setup_subscription', {
      app, group: 'Pro', group_display_name: 'Heimdall Pro', product_id: 'p', name: 'N', period: 'ONE_MONTH',
      territory: 'TUR', price: '9.99',
      localizations: [
        { locale: 'tr', name: 'Aylık Deneme', description: 'Tüm özellikler' },
        { locale: 'en-US', name: 'Monthly Test', description: 'x'.repeat(300) },
      ],
    })!;
    expect(d.body).toContain('Name (Turkish): Aylık Deneme');
    expect(d.body).toContain('Name (American English): Monthly Test');
    expect(d.body).toContain('Description (Turkish): Tüm özellikler');
    expect(d.body).toContain(`Description (American English): ${'x'.repeat(99)}…`);
    expect(d.body).not.toContain('x'.repeat(100));
    expect(d.body).toContain('Group name: Heimdall Pro (if the group is new)');
  });

  it('caps the languages so a long list still fits the 1500-character alert', () => {
    const d = pricingDialog('pricing__setup_subscription', {
      app, group: 'G', product_id: 'p', name: 'N', period: 'ONE_YEAR', territory: 'TUR', price: '9.99',
      group_display_name: 'g'.repeat(500),
      localizations: ['tr', 'en-US', 'de-DE', 'fr-FR', 'ja', 'ko', 'es-ES', 'it'].map((locale) => ({ locale, name: 'n'.repeat(200), description: 'd'.repeat(4000) })),
    })!;
    expect(d.body).toContain('Other languages: 4 more');
    expect(d.body).not.toContain('Japanese');
    expect(d.body.length).toBeLessThan(1500);
  });

  it('says which subscribers keep their price, both ways', () => {
    const args = { app, subscription: 'heimdall.test.monthly', territory: 'TUR', price: '129.99' };
    const keep = pricingDialog('pricing__set_subscription_price', { ...args, preserve_current_price: true })!;
    expect(keep.title).toBe('Change the price of heimdall.test.monthly in Türkiye to 129.99?');
    expect(keep.action).toBe('Change');
    expect(keep.body).toBe('Heimdall Test · subscription\nStarts as soon as possible\n\nCurrent subscribers keep their price.');
    const move = pricingDialog('pricing__set_subscription_price', { ...args, preserve_current_price: false, start_date: '2026-11-01' })!;
    expect(move.body).toBe('Heimdall Test · subscription\nStarts 2026-11-01\n\nCurrent subscribers move to the new price.');
  });

  it('equalizes a subscription worldwide and says where subscribers land', () => {
    const args = { app, product_type: 'subscription', product: 'heimdall.test.monthly', territory: 'USA', price: '4.99' };
    const move = pricingDialog('pricing__equalize_price', { ...args, preserve_current_price: false })!;
    expect(move.title).toBe('Set the price of heimdall.test.monthly in every country from 4.99 in United States?');
    expect(move.action).toBe('Set');
    expect(move.body).toContain('not the same number');
    expect(move.body).toContain('About 175 countries, one at a time');
    expect(lines(move.body).at(-1)).toBe('Current subscribers move to the new price in every country.');
    const keep = pricingDialog('pricing__equalize_price', { ...args, preserve_current_price: true })!;
    expect(lines(keep.body).at(-1)).toBe('Current subscribers keep their price.');
  });

  it('equalizes an app price and says the schedule is replaced', () => {
    const d = pricingDialog('pricing__equalize_price', { app, product_type: 'app', territory: 'USA', price: '2.99' })!;
    expect(d.title).toBe('Set the price of Heimdall Test in every country from 2.99 in United States?');
    expect(lines(d.body)[0]).toBe('Heimdall Test · app price');
    expect(d.body).not.toContain('175');
    expect(lines(d.body).at(-1)).toBe('Its other manual prices and scheduled changes are replaced by this one.');
  });

  it('makes a win-back offer in words', () => {
    const d = pricingDialog('pricing__make_offer', {
      app, subscription: 'heimdall.test.monthly', offer_type: 'win_back', name: 'Lapsed 3m', offer_id: 'winback3m',
      offer_mode: 'PAY_UP_FRONT', duration: 'ONE_MONTH', periods: 1, territory: 'USA', price: '0.99',
      eligibility_paid_months: 6, eligibility_last_subscribed_min_months: 1, eligibility_last_subscribed_max_months: 12,
      eligibility_wait_months: 3, start_date: '2026-11-01',
    })!;
    expect(d.title).toBe('Create the win-back offer "Lapsed 3m"?');
    expect(d.action).toBe('Create');
    expect(lines(d.body)[0]).toBe('Heimdall Test · subscription heimdall.test.monthly');
    expect(d.body).toContain('Pay 0.99 up front for 1 month in United States');
    expect(d.body).toContain('For customers who paid for 6 months and lapsed 1 to 12 months ago');
    expect(d.body).toContain('Each customer can redeem it again after 3 months.');
    expect(d.body).toContain('Runs from 2026-11-01, open-ended');
    expect(lines(d.body).at(-1)).toBe('Its countries and prices can’t be changed later.');
    expect(d.body).not.toMatch(/PAY_UP_FRONT|ONE_MONTH|win_back/);
  });

  it('makes a pay-as-you-go promotional offer', () => {
    const d = pricingDialog('pricing__make_offer', {
      app, subscription: 'heimdall.test.monthly', offer_type: 'promotional', name: 'Spring', offer_id: 'spring',
      offer_mode: 'PAY_AS_YOU_GO', duration: 'ONE_MONTH', periods: 3, territory: 'TUR', price: '29.99',
    })!;
    expect(d.title).toBe('Create the promotional offer "Spring"?');
    expect(d.body).toContain('Pay as you go: 29.99 every month for 3 months in Türkiye');
    expect(d.body).not.toContain('Runs');
    expect(lines(d.body).at(-1)).toBe('Its countries and prices can’t be changed later.');
  });

  it('adds an introductory free trial, and removes it on undo', () => {
    const args = { app, subscription: 'heimdall.test.monthly', offer_type: 'introductory', offer_mode: 'FREE_TRIAL', duration: 'ONE_WEEK', periods: 1 };
    const add = pricingDialog('pricing__make_offer', args)!;
    expect(add.title).toBe('Add an introductory offer to heimdall.test.monthly?');
    expect(add.action).toBe('Add');
    expect(add.body).toContain('Free trial for 1 week');
    expect(add.body).not.toContain('equivalent price');
    expect(add.body).toContain('For customers new to the subscription group, from now, open-ended');
    expect(lines(add.body).at(-1)).toBe('Afterwards Apple lets only its end date change.');
    const undo = pricingDialog('pricing__make_offer', { ...args, undo: true, end_date: '2026-12-31' })!;
    expect(undo.title).toBe('Remove the introductory offer from heimdall.test.monthly?');
    expect(undo.action).toBe('Remove');
    expect(undo.body).toContain('Free trial for 1 week, from now, until 2026-12-31');
    expect(lines(undo.body).at(-1)).toBe('New subscribers no longer get it.');
  });

  it('changes one in-app purchase price and warns about the base country', () => {
    const d = pricingDialog('pricing__set_iap_price', { app, iap: 'heimdall.gold', territory: 'tur', price: '49,99' })!;
    expect(d.title).toBe('Change the price of heimdall.gold in Türkiye to 49.99?');
    expect(d.action).toBe('Change');
    expect(d.body).toBe([
      'Heimdall Test · in-app purchase', 'Starts as soon as possible', 'Every other price and scheduled change is kept.',
      '', 'If Türkiye is its base country, Apple also moves the automatic prices everywhere else.',
    ].join('\n'));
    expect(lines(pricingDialog('pricing__set_iap_price', { iap: '6450000000', territory: 'TUR', price: '1' })!.body)[0]).toBe('In-app purchase');
  });

  it('leaves other tools to the generic dialog', () => {
    expect(pricingDialog('pricing__get_iap_price', { iap: 'x' })).toBeUndefined();
  });
});

describe('dialog helpers', () => {
  it('lists in words and caps past three', () => {
    expect(listText(['A'])).toBe('A');
    expect(listText(['A', 'B'])).toBe('A and B');
    expect(listText(['A', 'B', 'C'])).toBe('A, B and C');
    expect(listText(['A', 'B', 'C', 'D'])).toBe('A, B and 2 more');
  });
  it('drops the id the server appends to an app name, and only that', () => {
    expect(appLabel('Heimdall Test (com.example.heimdall)')).toBe('Heimdall Test');
    expect(appLabel('Heimdall Test (6450000000)')).toBe('Heimdall Test');
    expect(appLabel('Notes (Beta)')).toBe('Notes (Beta)');
  });
});
