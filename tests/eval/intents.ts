/**
 * The intents the live AX eval walks — data only, no logic.
 *
 * Each entry is one thing a user actually asks for, plus the read chain a
 * competent agent has to walk before it can act. The eval executes the chain
 * against a real account and reports what it costs: how many round trips, how
 * many bytes come back, how much of that survives shaping.
 *
 * Static analysis cannot answer this. Nothing in Apple's spec says that one
 * subscription in one territory has 842 price points — that number is what
 * turned AI-177 from a nice-to-have into an Urgent, and it only exists at
 * runtime.
 *
 * A step's `idFrom` says where its `{id}` comes from:
 *   'app'          the app the eval resolved at startup
 *   '<n>:<path>'   step n's response, e.g. '0:data[0].id'
 *
 * Chains that a given account has no data for (no in-app events, no custom
 * product pages) report as unavailable rather than failing — the eval is a
 * measurement, not a test suite.
 */

export interface EvalStep {
  /** Dotted operation name, for the report. */
  op: string;
  /** Concrete path; `{id}` is filled from `idFrom`. */
  path: string;
  idFrom?: string;
  params?: Record<string, string | number>;
}

export interface EvalIntent {
  /** What the user said, in their words. */
  intent: string;
  /** What the agent would search for — AXIS1: does the right tool rank? */
  searchQuery: string;
  /**
   * The tool that accomplishes the goal. A list when Apple exposes the same
   * effect from both ends of a relationship — `beta_groups.builds.add` and
   * `builds.beta_groups.add` are one write seen from two sides, and scoring
   * only one of them marks a successful run as a failure. The first entry is
   * the one the search ranking is measured against.
   */
  expectedTool: string | string[];
  /** The read chain before the write — AXIS4: how long is the path? */
  chain: EvalStep[];
  /** A macro that collapses the chain, when one exists. */
  macro?: string;
}

export const INTENTS: EvalIntent[] = [
  {
    intent: 'Set the Turkish price of the weekly subscription to 99.99 TRY',
    searchQuery: 'change subscription price territory',
    expectedTool: 'subscription_prices.create',
    macro: 'pricing__set_subscription_price',
    chain: [
      { op: 'apps.subscription_groups.list', path: '/v1/apps/{id}/subscriptionGroups', idFrom: 'app' },
      {
        op: 'subscription_groups.subscriptions.list',
        path: '/v1/subscriptionGroups/{id}/subscriptions',
        idFrom: '0:data[0].id',
      },
      {
        op: 'subscriptions.price_points.list',
        path: '/v1/subscriptions/{id}/pricePoints',
        idFrom: '1:data[0].id',
        params: { 'filter[territory]': 'TUR' },
      },
    ],
  },
  {
    intent: 'What does this subscription cost today in each country?',
    searchQuery: 'current subscription price per country',
    expectedTool: 'subscriptions.prices.list',
    chain: [
      { op: 'apps.subscription_groups.list', path: '/v1/apps/{id}/subscriptionGroups', idFrom: 'app' },
      {
        op: 'subscription_groups.subscriptions.list',
        path: '/v1/subscriptionGroups/{id}/subscriptions',
        idFrom: '0:data[0].id',
      },
      { op: 'subscriptions.prices.list', path: '/v1/subscriptions/{id}/prices', idFrom: '1:data[0].id' },
    ],
  },
  {
    intent: 'Change the price of an in-app purchase',
    searchQuery: 'in-app purchase price change',
    expectedTool: 'in_app_purchase_price_schedules.create',
    chain: [
      { op: 'apps.in_app_purchases_v2.list', path: '/v1/apps/{id}/inAppPurchasesV2', idFrom: 'app' },
      {
        op: 'in_app_purchases_v2.price_points.list',
        path: '/v2/inAppPurchases/{id}/pricePoints',
        idFrom: '0:data[0].id',
        params: { 'filter[territory]': 'TUR' },
      },
    ],
  },
  {
    intent: 'Change what the app costs',
    searchQuery: 'change app price',
    expectedTool: 'app_price_schedules.create',
    chain: [
      { op: 'apps.app_price_points.list', path: '/v1/apps/{id}/appPricePoints', idFrom: 'app', params: { 'filter[territory]': 'TUR' } },
    ],
  },
  {
    intent: 'Update the description and what’s new text',
    searchQuery: 'update app description whats new',
    expectedTool: 'app_store_version_localizations.update',
    chain: [
      { op: 'apps.app_store_versions.list', path: '/v1/apps/{id}/appStoreVersions', idFrom: 'app' },
      {
        op: 'app_store_versions.app_store_version_localizations.list',
        path: '/v1/appStoreVersions/{id}/appStoreVersionLocalizations',
        idFrom: '0:data[0].id',
      },
    ],
  },
  {
    intent: 'Add a new language to the listing',
    searchQuery: 'add new language localization',
    expectedTool: 'app_store_version_localizations.create',
    chain: [
      { op: 'apps.app_store_versions.list', path: '/v1/apps/{id}/appStoreVersions', idFrom: 'app' },
      {
        op: 'app_store_versions.app_store_version_localizations.list',
        path: '/v1/appStoreVersions/{id}/appStoreVersionLocalizations',
        idFrom: '0:data[0].id',
      },
    ],
  },
  {
    intent: 'Change the app name and subtitle',
    searchQuery: 'change app name subtitle',
    expectedTool: 'app_info_localizations.update',
    chain: [
      { op: 'apps.app_infos.list', path: '/v1/apps/{id}/appInfos', idFrom: 'app' },
      {
        op: 'app_infos.app_info_localizations.list',
        path: '/v1/appInfos/{id}/appInfoLocalizations',
        idFrom: '0:data[0].id',
      },
    ],
  },
  {
    intent: 'Upload a screenshot to the store listing',
    searchQuery: 'upload app store screenshot listing',
    expectedTool: 'app_screenshots.create',
    chain: [
      { op: 'apps.app_store_versions.list', path: '/v1/apps/{id}/appStoreVersions', idFrom: 'app' },
      {
        op: 'app_store_versions.app_store_version_localizations.list',
        path: '/v1/appStoreVersions/{id}/appStoreVersionLocalizations',
        idFrom: '0:data[0].id',
      },
      {
        op: 'app_store_version_localizations.app_screenshot_sets.list',
        path: '/v1/appStoreVersionLocalizations/{id}/appScreenshotSets',
        idFrom: '1:data[0].id',
      },
    ],
  },
  {
    intent: 'Submit the app for review',
    searchQuery: 'submit app for review',
    expectedTool: 'review_submissions.create',
    chain: [{ op: 'apps.review_submissions.list', path: '/v1/apps/{id}/reviewSubmissions', idFrom: 'app' }],
  },
  {
    intent: 'Roll the release out gradually',
    searchQuery: 'phased release rollout',
    expectedTool: 'app_store_version_phased_releases.create',
    chain: [
      { op: 'apps.app_store_versions.list', path: '/v1/apps/{id}/appStoreVersions', idFrom: 'app' },
    ],
  },
  {
    intent: 'Send the latest build to a TestFlight group',
    searchQuery: 'distribute build to beta group',
    expectedTool: ['beta_groups.builds.add', 'builds.beta_groups.add'],
    chain: [
      { op: 'apps.beta_groups.list', path: '/v1/apps/{id}/betaGroups', idFrom: 'app' },
      { op: 'apps.builds.list', path: '/v1/apps/{id}/builds', idFrom: 'app', params: { limit: 5 } },
    ],
  },
  {
    intent: 'Reply to a customer review',
    searchQuery: 'reply to customer review',
    expectedTool: 'customer_review_responses.create',
    chain: [
      { op: 'apps.customer_reviews.list', path: '/v1/apps/{id}/customerReviews', idFrom: 'app', params: { limit: 20 } },
    ],
  },
];

/**
 * Probes for the silent-empty class: a filter whose value format is nowhere in
 * the schema, so a plausible wrong value returns HTTP 200 and nothing.
 *
 * Measured live on 29 Jul 2026: `filter[territory]=TR` returned zero rows with
 * no error, and the agent reported "no US price configured" — confidently
 * wrong. The correct code is the ISO-3166 alpha-3 "TUR".
 */
export interface FilterProbe {
  op: string;
  path: string;
  idFrom?: string;
  param: string;
  /** A value a model would plausibly try. */
  wrong: string;
  /** The value Apple actually wants. */
  right: string;
}

export const FILTER_PROBES: FilterProbe[] = [
  {
    op: 'subscriptions.price_points.list',
    path: '/v1/subscriptions/{id}/pricePoints',
    idFrom: 'subscription',
    param: 'filter[territory]',
    wrong: 'TR',
    right: 'TUR',
  },
  {
    op: 'subscriptions.price_points.list',
    path: '/v1/subscriptions/{id}/pricePoints',
    idFrom: 'subscription',
    param: 'filter[territory]',
    wrong: 'US',
    right: 'USA',
  },
  {
    op: 'apps.app_price_points.list',
    path: '/v1/apps/{id}/appPricePoints',
    idFrom: 'app',
    param: 'filter[territory]',
    wrong: 'DE',
    right: 'DEU',
  },
];
