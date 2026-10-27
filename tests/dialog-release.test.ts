import { describe, it, expect } from 'vitest';
import { releaseDialog } from '../src/tools/release.js';

// What releasePreviewArgs / releaseItemsPreviewArgs hand the server.
const version = { type: 'appStoreVersion', id: '8f3c2a1e-4b5d-4e6f-9a7b-1c2d3e4f5a6b' };
const iap = { type: 'inAppPurchaseVersion', id: '6450000001' };
const base = { app: 'Heimdall Test (6450000000)', platform: 'iOS' };

describe('releaseDialog', () => {
  it('submits a version by app name and version string', () => {
    const d = releaseDialog('release__submit', {
      ...base, version: '1.4', items: [version], existingItems: [], itemNames: { [`appStoreVersion/${version.id}`]: 'Version 1.4' },
    })!;
    expect(d.title).toBe('Submit Heimdall Test 1.4 for App Review?');
    expect(d.action).toBe('Submit');
    expect(d.body).toBe('Heimdall Test · iOS\n\nApple starts reviewing it; you can withdraw it until review begins.');
  });

  it('says what already sits in the open submission, and a skipped pre-flight', () => {
    const d = releaseDialog('release__submit', {
      ...base, version: '1.4', items: [iap, version], existingItems: [iap, version], skip_preflight: true,
    })!;
    expect(d.title).toBe('Submit Heimdall Test 1.4 for App Review?');
    expect(d.body).toContain('Already in the open submission and going too: an in-app purchase');
    expect(d.body).not.toContain('version 1.4');
    expect(d.body).toContain('Submitted even if the pre-flight finds blocking gaps.');
    expect(d.body).toMatch(/\n\nApple starts reviewing the submission; you can withdraw it until review begins\.$/);
  });

  it('submits items by kind, with items already in the submission said apart', () => {
    const d = releaseDialog('release__submit_items', {
      ...base,
      items: [{ type: 'subscriptionVersion', id: 's0' }, iap, { type: 'inAppPurchaseVersion', id: '6450000002' }],
      existingItems: [{ type: 'subscriptionVersion', id: 's0' }],
    })!;
    expect(d.title).toBe('Submit 2 in-app purchases for App Review?');
    expect(d.action).toBe('Submit');
    expect(d.body).toContain('Heimdall Test · iOS\nAlready in the open submission and going too: a subscription');
    expect(d.body).not.toMatch(/6450000|s0|READY/);
  });

  it('names the app version and any item the preview could name', () => {
    const d = releaseDialog('release__submit_items', {
      ...base, version: '1.4', items: [version, { type: 'appEvent', id: 'e1' }, iap], existingItems: [],
      itemNames: { [`appStoreVersion/${version.id}`]: 'Version 1.4', [`inAppPurchaseVersion/${iap.id}`]: 'Gold Pack' },
    })!;
    expect(d.title).toBe('Submit version 1.4, Gold Pack and an in-app event for App Review?');
  });

  it('lists everything when every item was already in the submission', () => {
    const d = releaseDialog('release__submit_items', { ...base, items: [iap], existingItems: [iap] })!;
    expect(d.title).toBe('Submit an in-app purchase for App Review?');
    expect(d.body).not.toContain('Already in');
  });

  it('leaves other tools to the generic dialog', () => {
    expect(releaseDialog('preflight__check_version', base)).toBeUndefined();
  });
});
