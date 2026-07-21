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
  'review_submissions.create':
    'Submit an App Store version for Apple review. The version must already have a build attached.',
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
