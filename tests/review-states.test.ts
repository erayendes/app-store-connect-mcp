import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { APPROVED_STATES } from '../src/core/review-states.js';

it('covers approved/live states in every reviewable version schema in the checked-in Apple spec', () => {
  const schemas = JSON.parse(readFileSync('spec/openapi.json', 'utf8')).components.schemas;
  for (const name of ['AppCustomProductPageVersion', 'InAppPurchaseVersion', 'SubscriptionVersion', 'SubscriptionGroupVersion',
    'GameCenterAchievementVersionV2', 'GameCenterActivityVersion', 'GameCenterChallengeVersion', 'GameCenterLeaderboardVersionV2',
    'GameCenterLeaderboardSetVersionV2', 'BackgroundAssetVersionAppStoreRelease']) {
    const state = schemas[name].properties.attributes.properties.state;
    const states: string[] = state.enum ?? schemas[state.$ref.split('/').at(-1)].enum;
    const approved = states.filter((s) => ['APPROVED', 'ACCEPTED', 'REPLACED_WITH_NEW_VERSION', 'PENDING_RELEASE', 'LIVE',
      'PROCESSING_FOR_DISTRIBUTION', 'READY_FOR_DISTRIBUTION', 'SUPERSEDED'].includes(s));
    expect(approved.length, name).toBeGreaterThan(0);
    for (const value of approved) expect(APPROVED_STATES.has(value), `${name}.${value}`).toBe(true);
  }
  expect(APPROVED_STATES.has('COMPLETE'), 'asset upload completion is not review approval').toBe(false);
});
