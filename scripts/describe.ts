/**
 * Apple's OpenAPI spec carries no summaries or descriptions — only tags. Tool
 * descriptions are what the model uses to pick a tool, so we synthesise them
 * from the operationId structure and hand-write the ones that matter most.
 */

/** Words that should keep their conventional casing when humanised. */
const ACRONYMS: Record<string, string> = {
  app: 'app',
  apps: 'apps',
  ios: 'iOS',
  macos: 'macOS',
  tvos: 'tvOS',
  visionos: 'visionOS',
  watchos: 'watchOS',
  url: 'URL',
  urls: 'URLs',
  id: 'ID',
  ids: 'IDs',
  iap: 'IAP',
  sdk: 'SDK',
  scm: 'SCM',
  ci: 'Xcode Cloud',
  eula: 'EULA',
  api: 'API',
};

/** camelCase resource name -> readable noun phrase. */
export function humanise(resource: string): string {
  const words = resource
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/[\s_]+/)
    .filter(Boolean);

  const joined = words
    .map((word) => {
      const lower = word.toLowerCase();
      return ACRONYMS[lower] ?? lower;
    })
    .join(' ');

  return applyProperNouns(joined);
}

/**
 * Apple's product names are multi-word, so they can only be restored once the
 * whole phrase is assembled — "appStoreVersion" has to become "App Store
 * version", not "app Store version".
 */
const PROPER_NOUNS: Array<[RegExp, string]> = [
  [/\bapp store connect\b/g, 'App Store Connect'],
  [/\bapp store\b/g, 'App Store'],
  [/\bgame center\b/g, 'Game Center'],
  [/\btest ?flight\b/g, 'TestFlight'],
  [/\bxcode cloud\b/g, 'Xcode Cloud'],
  [/\bxcode\b/g, 'Xcode'],
  [/\bapp clips\b/g, 'App Clips'],
  [/\bapp clip\b/g, 'App Clip'],
  [/\bstore ?kit\b/g, 'StoreKit'],
  [/\bin app purchase/g, 'in-app purchase'],
  [/\bv2\b/g, '(v2)'],
];

function applyProperNouns(phrase: string): string {
  let out = phrase;
  for (const [pattern, replacement] of PROPER_NOUNS) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

/** Singularises a resource noun for get/create/update/delete phrasing. */
function singular(phrase: string): string {
  if (/ies$/.test(phrase)) return phrase.replace(/ies$/, 'y');
  if (/sses$/.test(phrase)) return phrase.replace(/es$/, '');
  if (/s$/.test(phrase) && !/ss$/.test(phrase)) return phrase.replace(/s$/, '');
  return phrase;
}

/**
 * Article selection follows pronunciation, not spelling: "a user", "a URL
 * scheme" — but "an SCM provider", because the S is read as "ess".
 */
function article(phrase: string): string {
  const word = phrase.trim().split(/\s+/)[0] ?? '';
  // Words beginning with a "yoo" sound take "a" despite the leading vowel.
  if (/^(u[bcdgklmnprst]|use|user|uni|uti|euro?)/i.test(word)) return 'a';
  // Initialisms read letter-by-letter: F, H, L, M, N, R, S, X take "an".
  if (/^[FHLMNRSX][A-Z]/.test(word)) return 'an';
  // Xcode is read "ecks-code".
  if (/^Xcode/.test(word)) return 'an';
  return /^[aeiou]/i.test(word) ? 'an' : 'a';
}

/**
 * Curated descriptions for the operations people actually reach for. These
 * explain *when* to use the tool, which generated prose can't.
 */
export const CURATED: Record<string, string> = {
  'apps.list':
    'List all apps in your App Store Connect account. Start here when you need an app ID.',
  'apps.get': 'Read one app by ID, including bundle ID, SKU and primary locale.',
  'apps.app_store_versions.list':
    'List App Store versions for an app, with their review state (e.g. PREPARE_FOR_SUBMISSION, WAITING_FOR_REVIEW, READY_FOR_SALE).',
  'apps.builds.list':
    'List builds uploaded for an app, newest first when sorted by -uploadedDate.',
  'apps.customer_reviews.list':
    'List customer reviews for an app. Filter by rating or territory; sort by -createdDate for the newest.',
  'app_store_versions.create':
    'Create a new App Store version. Do this before attaching a build and submitting for review.',
  'app_store_versions.update':
    'Update an App Store version, including its release type and earliest release date.',
  // Apple's names hide a three-step dance, and the old description here got it
  // wrong in the direction that costs a release: `create` takes an app, not a
  // version, and makes an EMPTY container. The version arrives as a separate
  // item, and nothing reaches Apple until `submitted` is patched true. An agent
  // that stops after the POST reports a release it did not ship — so each of
  // the three says what it is not, and names the next call by tool name.
  'review_submissions.create':
    'Submit an App Store version for Apple review — step 1 of 3, and this call alone does not send anything. It opens an empty submission for an app; put the version in it with review_submission_items__create, then set submitted on it.',
  // The full list of item types Apple accepts belongs in the body schema, not
  // here: spelling out "custom product page version" made this tool the top hit
  // for "Create a custom product page", which is app_custom_product_pages.
  'review_submission_items.create':
    'Put one thing into an open review submission — a version, an event, or another releasable item. One per call, so repeat it for each thing Apple should look at.',
  'review_submissions.update':
    'Hand an open submission to Apple by setting submitted to true, or take it back with canceled. This is the step that starts the queue; opening the submission and filling it does not.',
  'review_submissions.items.list':
    'List what is inside a review submission and the state of each item, so you can check what Apple will actually look at before handing it over.',
  'review_submission_items.delete':
    'Take one item back out of a submission that has not been handed to Apple yet.',
  // `app_store_versions.build.set` is deliberately NOT curated. Apple's "Set the
  // build linked to an App Store version." is short and dense with exactly the
  // words someone asking for it uses; a longer, more helpful sentence diluted
  // that and dropped the tool out of the top three for "select build for app
  // store version". The thing worth saying about it — that it is a release
  // step, not a config edit — is now carried by its risk level instead.

  // Apple's spec summary for these is the tool name in a sentence — "List
  // builds." against `builds.list` tells a model nothing it could not read off
  // the name, so the whole description is dead weight in the context window.
  // What earns its place is what comes back, what narrows it, and which
  // neighbouring tool it is not.
  'builds.list':
    'List uploaded builds across all apps, newest first with sort=-uploadedDate. Filter by app, version or processing state. For one app\'s builds use apps__builds__list instead.',
  'pre_release_versions.list':
    'List the version numbers builds were uploaded under (e.g. 2.4), across all apps. These are TestFlight train numbers, not App Store versions — for what customers see, use app_store_versions.',
  'review_submissions.list':
    'List App Store review submissions and their state, so you can tell whether something is waiting on Apple or on you. Filter by app or state; the items inside a submission come from review_submissions__items__list.',
  'app_encryption_declarations.list':
    'List export-compliance declarations, which a build needs before it can ship in most territories. Filter by app or build to find whether one already covers the build you are releasing.',
  // Search matches tokens of three or more characters as substrings, so a
  // sentence written to tell a reader what this is *not* can hand it queries
  // meant for something else. The first draft ended "unrelated to normal App
  // Store releases" and that clause alone — `out` inside "outside", `release`
  // inside "releases" — put this tool top of "Roll out the release gradually".
  // Disambiguate with words the neighbours do not use.
  'alternative_distribution_domains.list':
    'List the domains verified for EU alternative distribution, where an app reaches users through a marketplace rather than the App Store.',
  'alternative_distribution_keys.list':
    'List the public keys registered for EU alternative distribution, used to sign apps delivered outside the App Store. Use exists[app] to check whether an app has one at all.',
  'build_beta_details.list':
    'List the TestFlight state of builds: whether external testing is available and how the build was distributed. This is the beta side of a build — build attributes themselves come from builds__list.',
  // Same trap: "App Store" plus "page" plus "added" made this the top hit for
  // "Add a screenshot to the App Store page", which belongs to app_screenshots.
  // The version is implied by the tool name, so naming it again only competes.
  'app_store_version_experiments_v2.create':
    'Start an A/B test on a version’s product page: up to three treatments against the live one, split by traffic share. Treatments and their assets are attached separately.',
  // "Stopping" would cost an unrelated query its answer: search matches tokens
  // of three or more characters as substrings, so `ping` in "stopping" put this
  // tool at the top of "Ping the webhook endpoint" and pushed webhook_pings out
  // of the top three. Halt, not stop.
  'app_store_version_experiments_v2.update':
    'Change a product page experiment — begin or halt it, or adjust its traffic split. Halting it keeps the results readable; deleting does not.',
  'app_store_version_experiments_v2.delete':
    'Delete a product page experiment and its results. Halt it with an update instead if you still want the numbers.',
  'app_store_version_submissions.delete':
    'Cancel a pending App Store review submission.',
  'app_store_version_phased_releases.create':
    'Start a phased (gradual) rollout for an approved version, releasing to a growing percentage of users over 7 days.',
  'app_store_version_phased_releases.update':
    'Pause, resume or complete a phased release. Set phasedReleaseState to PAUSE, ACTIVE or COMPLETE.',
  'app_store_version_release_requests.create':
    'Manually release a version that was approved and is waiting for developer release.',
  'customer_review_responses.create':
    'Publish a developer response to a customer review. One response per review; use update to change it.',
  'customer_review_responses.delete': 'Delete your response to a customer review.',
  'beta_groups.create':
    'Create a TestFlight beta group. Internal groups are limited to team members; external groups require beta review.',
  'beta_groups.beta_testers.add':
    'Add existing beta testers to a TestFlight group.',
  'beta_testers.create':
    'Invite a new TestFlight tester by email and add them to one or more beta groups.',
  'builds.update':
    'Update a build — most commonly to set usesNonExemptEncryption compliance so it can be distributed.',
  // Analytics is a five-hop chain, and only its two ends carry a fact the
  // schema does not: the request is not instant, and the last call returns a
  // link rather than rows. The three middle hops were curated too, and the
  // word "report" in each of them pushed sales_reports.list out of the top
  // three for "Get the daily sales report". Two entries, not five — the
  // middle hops are findable by name and were only competing.
  'analytics_report_requests.create':
    'Ask Apple to start producing analytics for an app. ONE_TIME_SNAPSHOT covers the past 365 days; ONGOING keeps going as new data arrives. Nothing is downloadable straight away — a fresh request has no instances for a day or more.',
  'analytics_report_segments.get':
    'Read one segment: a short-lived signed URL plus its checksum and byte size. The rows are gzipped TSV at that URL — this response carries the link, not the data.',
  'bundle_ids.create':
    'Register a new bundle identifier before creating provisioning profiles for it.',
  'devices.create':
    'Register a device UDID so it can be included in development provisioning profiles.',
  'profiles.create':
    'Create a provisioning profile from a bundle ID, certificate and (for development) device list.',
  'sales_reports.list':
    'Download a sales or subscription report as gzipped TSV. Requires ASC_VENDOR_NUMBER and a Finance or Sales role on the API key.',
  'finance_reports.list':
    'Download a finance report as gzipped TSV. Requires ASC_VENDOR_NUMBER and a Finance role on the API key.',
  'in_app_purchases_v2.create':
    'Create an in-app purchase. Set the product ID, type (CONSUMABLE, NON_CONSUMABLE, NON_RENEWING_SUBSCRIPTION) and reference name.',
  'subscriptions.create':
    'Create an auto-renewable subscription inside a subscription group.',
  'subscription_groups.create':
    'Create a subscription group. Subscriptions in the same group are mutually exclusive upgrade/downgrade options.',
  'users.list': 'List team members with access to your App Store Connect account.',
  'ci_build_runs.create':
    'Start an Xcode Cloud build for a workflow, optionally targeting a specific branch, tag or pull request.',
  'webhooks.create':
    'Create a webhook so Apple pushes App Store Connect events to your endpoint.',

  // --- subscription pricing (the "change the price" flow) -----------------
  'subscriptions.price_points.list':
    'List the allowed price points for a subscription — the first step when you want to ' +
    'change, set, raise or lower a subscription price. ALWAYS filter by territory ' +
    '(filter_territory, e.g. TUR, USA) — unfiltered, this returns thousands of rows. ' +
    'Find the price point whose customerPrice matches the price you want, then pass its ' +
    'ID to subscription_prices__create.',
  'subscription_prices.create':
    'Change or set a subscription price in a specific territory (country). This is the ' +
    'write step for raising or lowering a subscription price: first find the price point ' +
    'ID with subscriptions__price_points__list (filtered by territory), then create the ' +
    'price with it. preserveCurrentPrice decides whether existing subscribers keep their ' +
    'old price or move to the new one.',
  'subscription_prices.delete':
    'Cancel a scheduled subscription price change before it takes effect.',
  'subscriptions.prices.list':
    'List the current and scheduled prices of a subscription per territory (country) — ' +
    'use this to see what a subscription costs today in each storefront.',
  'subscription_price_points.equalizations.list':
    'Given one price point in a base country, list the equivalent (equalized) price ' +
    'points in every other territory — for per-country pricing aligned to one anchor price.',
  'app_price_schedules.create':
    "Change or set an app's price: create a price schedule with base territory and " +
    'manual prices. Find price point IDs with apps__app_price_points__list first.',
  'apps.app_price_points.list':
    "List the allowed price points for an app's purchase price. Filter by territory " +
    '(country) to find the price point ID matching the price you want to set.',
  'in_app_purchase_price_schedules.create':
    'Change or set an in-app purchase (IAP) price: create a price schedule from price ' +
    'point IDs. Find them with in_app_purchases_v2__price_points__list, filtered by territory.',
  'in_app_purchases_v2.price_points.list':
    'List the allowed price points for an in-app purchase. Filter by territory (country) ' +
    'to find the price point ID for a specific price before scheduling a price change.',

  // --- metadata & localization -------------------------------------------
  'app_store_version_localizations.create':
    'Add a new language (locale) to an App Store version — description, keywords, ' +
    "what's new, promotional text for that language.",
  'app_store_version_localizations.update':
    "Update the store listing text for one language of a version: description, keywords, " +
    "what's new (release notes), promotional text, support and marketing URLs.",
  'app_info_localizations.update':
    "Update an app's name, subtitle or privacy policy text for one language. App name " +
    'and subtitle are capped at 30 characters.',
  'app_info_localizations.create':
    "Add a new language for the app-level listing fields: name, subtitle, privacy policy.",
  'app_store_version_localizations.search_keywords.add':
    'Add App Store search keywords to a version localization (ASO keyword optimization).',

  // --- TestFlight ---------------------------------------------------------
  'beta_groups.builds.add':
    'Distribute a build to a TestFlight beta group so its testers can install it.',
  'beta_tester_invitations.create':
    'Re-send a TestFlight invitation email to a tester who has not accepted yet.',
  'beta_build_localizations.update':
    "Set the tester-facing \"what to test\" notes for a TestFlight build in one language.",

  // --- review-screenshot tools: keep them out of pricing searches ---------
  // These upload the screenshot App Review looks at; their auto-generated
  // descriptions said "App Store review screenshot", which hijacked every
  // generic "app store" search (including price queries).
  'subscription_app_store_review_screenshots.create':
    'Upload the reviewer screenshot for a subscription — the image App Review checks. ' +
    'Not related to store listing screenshots or pricing.',
  'subscription_app_store_review_screenshots.update':
    'Commit the uploaded reviewer screenshot for a subscription after the file transfer.',
  'subscription_app_store_review_screenshots.delete':
    'Delete the reviewer screenshot attached to a subscription.',
  'subscription_app_store_review_screenshots.get':
    'Read the reviewer screenshot attached to a subscription.',
  'subscriptions.app_store_review_screenshot.get':
    'Read the reviewer screenshot attached to a subscription.',
  'in_app_purchase_app_store_review_screenshots.create':
    'Upload the reviewer screenshot for an in-app purchase — the image App Review checks. ' +
    'Not related to store listing screenshots or pricing.',
  'in_app_purchase_app_store_review_screenshots.update':
    'Commit the uploaded reviewer screenshot for an in-app purchase after the file transfer.',
  'in_app_purchase_app_store_review_screenshots.delete':
    'Delete the reviewer screenshot attached to an in-app purchase.',
  'in_app_purchase_app_store_review_screenshots.get':
    'Read the reviewer screenshot attached to an in-app purchase.',
  'in_app_purchases_v2.app_store_review_screenshot.get':
    'Read the reviewer screenshot attached to an in-app purchase.',

  // --- store listing screenshots (the ones users usually mean) ------------
  'app_screenshots.create':
    'Upload a store listing screenshot: reserve the upload for a screenshot set, then ' +
    'transfer the image data. These are the screenshots customers see on the App Store page.',
  'app_screenshot_sets.create':
    'Create a screenshot set for one display size (e.g. APP_IPHONE_67) in a version ' +
    'localization, then upload screenshots into it.',
};

interface DescribeInput {
  operationId: string;
  method: string;
  path: string;
  toolName: string;
  deprecated: boolean;
}

/** Builds a readable one-line description for an operation. */
export function describe(input: DescribeInput): string {
  const curated = CURATED[input.toolName];
  if (curated) {
    return input.deprecated ? `${curated} DEPRECATED by Apple.` : curated;
  }

  const parts = input.operationId.split('_');
  const verb = parts.pop() ?? '';
  const resources = parts;

  const target = humanise(resources[resources.length - 1] ?? 'resource');
  const owner = resources.length > 1 ? humanise(resources[0]) : undefined;
  const ownerSingular = owner ? singular(owner) : undefined;

  let sentence: string;

  switch (verb) {
    case 'getCollection':
      sentence = `List ${target}.`;
      break;
    case 'getInstance':
      sentence = `Read one ${singular(target)} by ID.`;
      break;
    case 'getToManyRelated':
      sentence = `List the ${target} belonging to ${article(ownerSingular ?? '')} ${ownerSingular}.`;
      break;
    case 'getToOneRelated':
      sentence = `Read the ${singular(target)} for ${article(ownerSingular ?? '')} ${ownerSingular}.`;
      break;
    case 'getToManyRelationship':
      sentence = `List only the IDs of the ${target} linked to ${article(ownerSingular ?? '')} ${ownerSingular}. Use the related-resource tool instead if you need full records.`;
      break;
    case 'getToOneRelationship':
      sentence = `Read only the ID of the ${singular(target)} linked to ${article(ownerSingular ?? '')} ${ownerSingular}.`;
      break;
    case 'createInstance':
      sentence = `Create ${article(singular(target))} ${singular(target)}.`;
      break;
    case 'updateInstance':
      sentence = `Update ${article(singular(target))} ${singular(target)}.`;
      break;
    case 'deleteInstance':
      sentence = `Delete ${article(singular(target))} ${singular(target)}.`;
      break;
    case 'createToManyRelationship':
      sentence = `Link ${target} to ${article(ownerSingular ?? '')} ${ownerSingular}.`;
      break;
    case 'deleteToManyRelationship':
      sentence = `Unlink ${target} from ${article(ownerSingular ?? '')} ${ownerSingular}.`;
      break;
    case 'replaceToManyRelationship':
      sentence = `Replace the full set of ${target} linked to ${article(ownerSingular ?? '')} ${ownerSingular}.`;
      break;
    case 'updateToOneRelationship':
      sentence = `Set the ${singular(target)} linked to ${article(ownerSingular ?? '')} ${ownerSingular}.`;
      break;
    case 'getMetrics':
      sentence = `Read ${target} metrics for ${article(ownerSingular ?? '')} ${ownerSingular}. Returns aggregated time-series data, not individual records.`;
      break;
    default:
      sentence = `${input.method} ${input.path}`;
  }

  sentence = sentence.replace(/\s+/g, ' ');

  return input.deprecated ? `${sentence} DEPRECATED by Apple.` : sentence;
}
