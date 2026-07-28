import { describe, it, expect } from 'vitest';
import { searchOperations } from '../src/tools/meta.js';

/**
 * Intent coverage: for each natural-language-ish query a user's agent is
 * likely to search with, the right tool must appear in the top 5 results.
 * This is the regression shield for AI-201 — when a spec update or a
 * description edit knocks an intent out of the top 5, this fails.
 */
const INTENTS: Array<[query: string, expectedTool: string]> = [
  // pricing — the flow that triggered AI-201
  ['change subscription price territory', 'subscription_prices.create'],
  ['set subscription price for country', 'subscription_prices.create'],
  ['subscription price points territory', 'subscriptions.price_points.list'],
  ['current subscription price per country', 'subscriptions.prices.list'],
  ['change app price', 'app_price_schedules.create'],
  ['in-app purchase price change', 'in_app_purchase_price_schedules.create'],
  ['cancel scheduled price change', 'subscription_prices.delete'],
  // metadata & localization
  ['add new language localization', 'app_store_version_localizations.create'],
  ['update app description whats new', 'app_store_version_localizations.update'],
  ['change app name subtitle', 'app_info_localizations.update'],
  ['add search keywords aso', 'app_store_version_localizations.search_keywords.add'],
  // screenshots — must find the store listing tools, not reviewer screenshots
  ['upload app store screenshot listing', 'app_screenshots.create'],
  // release flow
  ['submit app for review', 'review_submissions.create'],
  ['create new app store version', 'app_store_versions.create'],
  ['phased release rollout', 'app_store_version_phased_releases.create'],
  ['release approved version manually', 'app_store_version_release_requests.create'],
  // TestFlight
  ['invite beta tester email', 'beta_testers.create'],
  ['distribute build to beta group', 'beta_groups.builds.add'],
  // reviews & reports
  ['reply to customer review', 'customer_review_responses.create'],
  ['download sales report', 'sales_reports.list'],
];

describe('search intent coverage (asc__search_tools)', () => {
  it.each(INTENTS)('finds the right tool in the top 5 for "%s"', (query, expected) => {
    const top5 = searchOperations(query)
      .slice(0, 5)
      .map((op) => op.name);
    expect(top5, `top 5 for "${query}": ${top5.join(', ')}`).toContain(expected);
  });

  it('does not let reviewer-screenshot tools hijack a pricing query', () => {
    const top8 = searchOperations('app store subscription price change territory')
      .slice(0, 8)
      .map((op) => op.name);
    expect(top8.filter((n) => n.includes('review_screenshot'))).toEqual([]);
    expect(top8).toContain('subscription_prices.create');
  });
});
