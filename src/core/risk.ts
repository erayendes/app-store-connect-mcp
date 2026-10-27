/**
 * Risk manifest for mutating operations.
 *
 * `readOnly: method === 'get'` says whether an operation CAN change something,
 * but not what a change costs: a price PATCH and adding a beta tester are both
 * "mutating", yet one moves revenue in every storefront and the other is a
 * low-stakes, reversible edit. The confirmation prompt (and --dry-run output)
 * shows this level, and the high-stakes levels require typed confirmation.
 *
 * This file is the hand-reviewed source of truth: the generator stamps each
 * mutating operation with `risk` from these rules, so a spec update makes new
 * operations' classifications reviewable in the generated diff. RULES are
 * ordered — the first match wins — and run on the dotted operation name.
 *
 * Levels:
 *  - low            reversible, limited blast radius (TestFlight, webhooks, GC config)
 *  - public         changes what customers see on the store (metadata, screenshots, replies)
 *  - release        moves a version toward or through release (submissions, phased release)
 *  - revenue        touches money (prices, subscriptions, IAPs, offers)
 *  - destructive    deletes a resource
 *  - infrastructure code signing / CI (certificates, profiles, workflows)
 *  - access         who can do what (users, invitations, sandbox testers)
 */

export type RiskLevel =
  | 'low'
  | 'public'
  | 'release'
  | 'revenue'
  | 'destructive'
  | 'infrastructure'
  | 'access';

/** Levels that demand typed confirmation instead of a checkbox. */
export const STRONG_CONFIRM_LEVELS: ReadonlySet<RiskLevel> = new Set<RiskLevel>([
  'revenue',
  'destructive',
  'infrastructure',
  'access',
]);

/**
 * Release steps that reach users, so they ask even in the default mode. The
 * rest of `release` is preparation — a draft version, the build it carries,
 * an upload — reversible and seen by nobody, and stays with the client's own
 * approval: asking on every step was tried, and a prompt that fires constantly
 * stops being read.
 */
export const ASK_BY_DEFAULT: ReadonlySet<string> = new Set([
  // Hands the version to Apple's review queue.
  'review_submissions__update',
  'release__submit',
  'release__submit_items',
  'subscription_versions__create',
  'subscription_group_versions__create',
  'in_app_purchase_versions__create',
  // Pauses, resumes or completes a rollout that real customers are on.
  'app_store_version_phased_releases__update',
  // Sends a build to Apple for external TestFlight review.
  'beta_app_review_submissions__create',
  'testflight__assign_build_to_groups',
  // Puts the version on the App Store for everyone.
  'app_store_version_release_requests__create',
  // Opens or closes the app in a country, or turns a pre-order into a sale.
  'territory_availabilities__update',
  'app_availabilities_v2__create',
  'end_app_availability_pre_orders__create',
  // Starts or stops a product page experiment, or moves its traffic split:
  // real visitors see the treatment.
  'app_store_version_experiments_v2__update',
  // A score or achievement lands on a real player's record.
  'game_center_leaderboard_entry_submissions__create',
  'game_center_player_achievement_submissions__create',
  // The message a customer sees while cancelling a subscription.
  'storekit__manage_retention_messaging',
  // A reply appears under the customer's review, for everyone to read.
  'customer_review_responses__create',
]);

/** Of those, the ones that cannot be walked back ask for a typed CONFIRM, like the strong levels. */
export const TYPED_BY_NAME: ReadonlySet<string> = new Set([
  'app_store_version_release_requests__create',
  // An ended pre-order cannot be reopened.
  'end_app_availability_pre_orders__create',
]);

/**
 * The one write whose name cannot decide: `builds.update` records the
 * encryption answer, which nobody sees, and with `expired: true` pulls the
 * build from every tester for good — destructive, so a typed CONFIRM.
 * A body sent as a JSON string, or `"true"`, still counts: fail closed.
 */
export function riskByBody(toolName: string, args: Record<string, unknown>): RiskLevel | undefined {
  if (toolName !== 'builds__update') return undefined;
  let body = args.body as any;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return undefined; }
  }
  const expired = body?.data?.attributes?.expired;
  return expired === true || expired === 'true' ? 'destructive' : undefined;
}

/** One-line reversibility note per level, shown in the confirmation prompt. */
export const REVERSIBILITY: Record<RiskLevel, string> = {
  low: 'Generally reversible.',
  public: 'Visible to customers once live; reversible by editing again.',
  release: 'Release steps can be hard to walk back once Apple starts processing.',
  revenue: 'Affects what customers are charged; price history is kept by Apple.',
  destructive: 'Deletion is usually NOT reversible.',
  infrastructure: 'Revoked certificates/profiles can break signing and CI builds.',
  access: 'Changes who can access this account or its apps.',
};

/**
 * What a write really does, for the prompt's last line. REVERSIBILITY is per
 * level and reads wrong at the edges: a deleted subscription said "price
 * history is kept", a new certificate warned about revoking one. Named tools
 * first, then the method, then the level.
 */
const CONSEQUENCES: Record<string, string> = {
  review_submission_items__delete: 'It can be added back before you submit.',
  certificates__delete: 'Profiles that use it stop working; apps already on the App Store are not affected.',
  devices__create: 'It counts toward this year’s device limit, even if you disable it later.',
  ci_build_runs__create: 'It uses Xcode Cloud compute hours.',
  subscriptions__create: 'Nothing is sold until App Review approves it.',
  in_app_purchases_v2__create: 'Nothing is sold until App Review approves it.',
  subscription_groups__create: 'Nothing is sold until App Review approves it.',
  subscription_versions__create: 'Apple keeps this draft; it can’t be deleted.',
  subscription_group_versions__create: 'Apple keeps this draft; it can’t be deleted.',
  in_app_purchase_versions__create: 'Apple keeps this draft; it can’t be deleted.',
  review_submissions__update: 'You can withdraw it until App Review starts.',
  app_store_version_release_requests__create: 'It goes live for everyone; this can’t be undone.',
  beta_app_review_submissions__create: 'External testers get it once Apple approves it.',
  end_app_availability_pre_orders__create: 'An ended pre-order can’t be reopened.',
  app_store_version_experiments_v2__update: 'Real visitors see the test while it runs.',
  game_center_leaderboard_entry_submissions__create: 'It lands on a real player’s record.',
  game_center_player_achievement_submissions__create: 'It lands on a real player’s record.',
  customer_review_responses__create: 'It appears under the review on the App Store; it can be edited or deleted later.',
  sandbox_testers_v2__update: 'It affects sandbox testing only.',
  sandbox_testers_clear_purchase_history_request_v2__create: 'Their sandbox purchases are gone for good.',
};

export function consequenceFor(toolName: string, risk: RiskLevel, method: string): string {
  if (toolName === 'builds__update' && risk === 'destructive') return 'Testers can no longer install it. This can’t be undone.';
  if (CONSEQUENCES[toolName]) return CONSEQUENCES[toolName];
  if (/__remove$/.test(toolName)) return 'They can be added back later.';
  if (/__replace$/.test(toolName)) return 'Anything not in this list is detached.';
  if (method === 'DELETE') return 'This can’t be undone.';
  if (/^bundle_id_capabilities__/.test(toolName)) return 'Provisioning profiles for this bundle ID need to be regenerated.';
  if (risk === 'infrastructure') return 'It changes code signing or Xcode Cloud for this team.';
  if (risk === 'revenue') return 'It affects what customers can buy or what they pay.';
  return REVERSIBILITY[risk];
}

interface RiskRule {
  /** Regex over the dotted operation name (e.g. `subscription_prices.create`). */
  pattern: RegExp;
  // 'low' only to keep a name away from a broader rule below it; 'destructive'
  // only for a write that removes without saying DELETE.
  level: RiskLevel;
  why: string;
}

/** Ordered, hand-reviewed rules. First match wins. */
export const RULES: RiskRule[] = [
  {
    pattern: /^(subscription_versions|subscription_group_versions|in_app_purchase_versions)\.create$/,
    level: 'release',
    why: 'creates a draft review version that cannot be deleted',
  },
  // --- words and pictures around a product, not its price ---------------
  // These carry "subscription" or "in_app_purchase" in their names, so the
  // money rule below used to claim them: renaming a weekly plan in Portuguese
  // asked as if it changed what customers pay, once per language.
  {
    pattern: /_app_store_review_screenshots\./,
    level: 'low',
    why: 'a screenshot only App Review sees',
  },
  {
    pattern: /^(in_app_purchase|subscription)(_group)?_(localizations|images)(_v2)?\./,
    level: 'public',
    why: 'changes the name, description or image customers see for a product',
  },

  // --- money ------------------------------------------------------------
  {
    pattern: /price|subscription|in_app_purchase|offer|promoted_purchase|win_back/,
    level: 'revenue',
    why: 'touches prices, subscriptions, IAPs or offers',
  },

  // --- Game Center relationship replaces ---------------------------------
  // A replace sets the whole list: every achievement or leaderboard left out
  // is detached, which reads like an edit and removes like a delete.
  {
    pattern: /^game_center_.*\.replace$/,
    level: 'destructive',
    why: 'detaches every Game Center record not in the list',
  },

  // --- who has access ---------------------------------------------------
  {
    pattern: /^users\.|^user_invitations\.|^sandbox_testers/,
    level: 'access',
    why: 'changes team membership or test accounts',
  },

  // --- code signing & CI ------------------------------------------------
  {
    pattern: /^certificates\.|^profiles\.|^bundle_id|^devices\.|^merchant_ids\.|^pass_type_ids\.|^ci_/,
    level: 'infrastructure',
    why: 'code signing or CI infrastructure',
  },

  // --- release pipeline -------------------------------------------------
  {
    pattern:
      /^review_submission|^app_store_version_release_request|^app_store_version_promotion|phased_release|^app_store_versions\.(create|update|build\.set)|^build_uploads?\.|^beta_app_review_submission|^territory_availabilities\.update|^app_availabilities_v2\.create|^end_app_availability_pre_orders\./,
    level: 'release',
    why: 'moves a version toward or through release',
  },

  // --- customer-visible store content ------------------------------------
  {
    pattern:
      /localization|screenshot|preview|^app_infos?\.|^apps\.update|^customer_review_response|^app_events?|^app_custom_product_page|^nominations\.|search_keywords|^game_center_detail_players\.|^game_center_score_moderations\.|^app_asset_library_placement|^age_rating_declarations\.|^end_user_license_agreements\.|^accessibility_declarations\.|^app_store_version_experiments(_v2)?\.update/,
    level: 'public',
    // Blocking a Game Center player or score hides them from other players.
    // An asset library placement puts an image or video on a store page; the
    // library upload itself shows nowhere until it is placed, so it stays low.
    // The age rating, EULA and accessibility declarations print on the product
    // page; an experiment's update starts it and sets its share of visitors.
    why: 'changes what customers see on the App Store',
  },

  // Everything else (TestFlight groups/testers, webhooks, GameCenter config,
  // background assets…) starts low; promote specific names here when review
  // shows otherwise.
];

/**
 * Classify one mutating operation. DELETE outranks a pattern match except for
 * revenue — deleting a subscription price is still a revenue event, while
 * deleting a beta group is destructive rather than low.
 */
export function riskFor(name: string, method: string): RiskLevel {
  const matched = RULES.find((r) => r.pattern.test(name))?.level;
  if (method === 'DELETE') {
    return matched === 'revenue' ? 'revenue' : 'destructive';
  }
  return matched ?? 'low';
}
