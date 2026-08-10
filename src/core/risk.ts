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

interface RiskRule {
  /** Regex over the dotted operation name (e.g. `subscription_prices.create`). */
  pattern: RegExp;
  level: Exclude<RiskLevel, 'low' | 'destructive'>;
  why: string;
}

/** Ordered, hand-reviewed rules. First match wins. */
export const RULES: RiskRule[] = [
  // --- money ------------------------------------------------------------
  {
    pattern: /price|subscription|in_app_purchase|offer|promoted_purchase|win_back/,
    level: 'revenue',
    why: 'touches prices, subscriptions, IAPs or offers',
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
      /^review_submission|^app_store_version_release_request|^app_store_version_promotion|phased_release|^app_store_versions\.(create|update|build\.set)|^build_uploads?\.|^beta_app_review_submission/,
    level: 'release',
    why: 'moves a version toward or through release',
  },

  // --- customer-visible store content ------------------------------------
  {
    pattern:
      /localization|screenshot|preview|^app_infos?\.|^apps\.update|^customer_review_response|^app_events?|^app_custom_product_page|^nominations\.|search_keywords/,
    level: 'public',
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
