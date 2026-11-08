/**
 * The macOS dialog for raw writes is built from the form preview. What has to
 * hold: the question names the thing, ids and enum strings never reach the
 * person, a relationship list reads as one line, and the last line says what
 * this write really does rather than its risk level's stock sentence.
 */
import { describe, expect, it } from 'vitest';
import { actionFor, dialogText, plainEnum } from '../src/core/native-confirm.js';
import { buildWritePreview } from '../src/core/confirm.js';
import { consequenceFor } from '../src/core/risk.js';

const preview = (...lines: string[]) => ['Heimdall is about to run "x" — a DESTRUCTIVE-level write.', '', ...lines].join('\n');

describe('dialogText', () => {
  it('asks about the named thing and drops its Target line', () => {
    const text = dialogText('Delete a beta group', preview(
      'Operation:  DELETE /v1/betaGroups/{id}',
      'Target:     id = 8f3c2a1e-0000-4000-8000-000000000001 (External Testers)',
      'Risk:       destructive — This can’t be undone.',
    ));
    expect(text).toEqual({ title: 'Delete the beta group "External Testers"?', body: '\nThis can’t be undone.', action: 'Delete' });
  });

  it('leaves out a target that is only an opaque id, and the API version and plural from the summary', () => {
    const text = dialogText('Update a sandbox testers (v2)', preview('Target:     id = 8f3c2a1e-0000-4000-8000-000000000001'));
    expect(text.title).toBe('Update a sandbox tester?');
    expect(text.body).not.toMatch(/8f3c2a1e/);
  });

  it('says enums, countries, lists and flags in words, and joins a relationship list into one line', () => {
    const text = dialogText('Change a subscription', preview(
      'Changes:',
      '  data.attributes.subscriptionPeriod = "ONE_MONTH"',
      '  data.attributes.roles = ["ADMIN","FINANCE"]',
      '  data.attributes.familySharable = true',
      '  data.relationships.territory.data → territories/TUR',
      '  0 → betaGroups/g-1 — "External Testers"',
      '  1 → betaGroups/g-2 — "QA"',
    ));
    expect(text.body.split('\n')).toEqual([
      'Subscription period: 1 month', 'Roles: Admin and Finance', 'Family sharable: Yes', 'Territory: Türkiye', 'Beta groups: External Testers and QA',
    ]);
  });

  it('shows one fact once, though the preview names it under two keys', () => {
    const text = dialogText('Create a subscription price', preview(
      'Product:    Pro Monthly',
      'Changes:',
      '  relationships.subscription.data → subscriptions/67 — "Pro Monthly"',
    ));
    expect(text.body).toBe('Product: Pro Monthly');
  });

  it('keeps two fields that share a value, and a name that holds a quote', () => {
    const text = dialogText('Update a territory availability', preview(
      'Changes:',
      '  data.attributes.available = true',
      '  data.attributes.preOrderEnabled = true',
      '  data.attributes.releaseDate = "2026-12-01"',
      '  data.attributes.preOrderPublishDate = "2026-12-01"',
      '  data.relationships.subscription.data → subscriptions/67 — "The "Pro" plan"',
    ));
    expect(text.body.split('\n')).toEqual([
      'Available: Yes', 'Pre order enabled: Yes', 'Release date: 2026-12-01', 'Pre order publish date: 2026-12-01', 'Subscription: The "Pro" plan',
    ]);
  });

  it('keeps plurals that belong to the summary', () => {
    expect(dialogText('Make a TestFlight group to organise testers', preview()).title).toBe('Make a TestFlight group to organise testers?');
    expect(dialogText('Change an app’s primary and secondary App Store category and its subcategories', preview()).title)
      .toBe('Change an app’s primary and secondary App Store category and its subcategories?');
  });

  it('cuts a long field so the alert keeps its buttons on screen', () => {
    const text = dialogText('Update a localization', preview('Changes:', `  data.attributes.description = "${'x'.repeat(4000)}"`));
    expect(text.body.length).toBeLessThan(300);
  });

  it('keeps a question already worded for this write', () => {
    expect(dialogText('Pause the phased release?', preview('Risk:       release — Automatic updates stop.')).title).toBe('Pause the phased release?');
  });
});

describe('words for values and buttons', () => {
  it('turns Apple enum strings into words', () => {
    expect(['ONE_WEEK', 'THREE_DAYS', 'PAY_AS_YOU_GO', 'IOS_APP_DEVELOPMENT', 'MAC_OS', 'USA'].map(plainEnum))
      .toEqual(['1 week', '3 days', 'Pay as you go', 'iOS app development', 'macOS', 'United States']);
  });

  it('names the button for the verb, and Create for setting something up', () => {
    expect(['Pause the phased release?', 'Withdraw this submission?', 'Set up a whole subscription?', 'Cancel a review submission?'].map(actionFor))
      .toEqual(['Pause', 'Withdraw', 'Create', undefined]);
  });
});

describe('what a write really does', () => {
  it('says so per tool, then per method, then per level', () => {
    expect(consequenceFor('subscriptions__delete', 'revenue', 'DELETE')).toBe('This can’t be undone.');
    expect(consequenceFor('beta_groups__builds__remove', 'destructive', 'DELETE')).toBe('They can be added back later.');
    expect(consequenceFor('subscriptions__create', 'revenue', 'POST')).toBe('Nothing is sold until App Review approves it.');
    expect(consequenceFor('certificates__create', 'infrastructure', 'POST')).toBe('It changes code signing or Xcode Cloud for this team.');
    expect(consequenceFor('builds__update', 'destructive', 'PATCH')).toMatch(/can no longer install/);
  });

  it('words the question from the body when the body decides what the write does', async () => {
    const op = { method: 'PATCH', path: '/v1/appStoreVersionPhasedReleases/{id}', risk: 'release' };
    const pause = await buildWritePreview('app_store_version_phased_releases__update', op, { id: 'p-1', body: { data: { type: 'appStoreVersionPhasedReleases', id: 'p-1', attributes: { phasedReleaseState: 'PAUSED' } } } });
    expect(pause.title).toBe('Pause the phased release?');
    expect(pause.message).toContain('Automatic updates stop; people can still download it.');

    const preOrder = await buildWritePreview('territory_availabilities__update', { ...op, path: '/v1/territoryAvailabilities/{id}' }, { id: 't-1', body: { data: { type: 'territoryAvailabilities', id: 't-1', attributes: { available: true, preOrderEnabled: true } } } });
    expect(preOrder.title).toBe('Open pre-orders for the app in this country?');

    const withdraw = await buildWritePreview('review_submissions__update', { ...op, path: '/v1/reviewSubmissions/{id}' }, { id: 's-1', body: { data: { type: 'reviewSubmissions', id: 's-1', attributes: { canceled: true } } } });
    expect(withdraw.title).toBe('Withdraw this submission from App Review?');
    expect(actionFor(withdraw.title!)).toBe('Withdraw');
  });
});
