// AUTO-GENERATED — do not edit by hand.
// Source: spec/profiles.csv (hand-curated; see scripts/generate-profiles.ts)
// Regenerate with: npm run generate

export interface GeneratedSubProfile {
  /** Unique within its profile. Empty when the profile has no sub-profiles. */
  name: string;
  /** Dotted operation names from Apple's spec. */
  operations: string[];
  /** Tools written by hand (meta, reviews-ai, StoreKit, pricing macros). */
  manualTools: string[];
  /** Apple resources this sub-profile owns, for the reachability invariant. */
  rootResources: string[];
}

export interface GeneratedProfile {
  name: string;
  subProfiles: GeneratedSubProfile[];
}

/** Injected into every profile: without an app ID no workflow can start. */
export const CORE: GeneratedSubProfile = {
  name: "",
  operations: ["apps.app_encryption_declarations.list","apps.app_store_versions.list","apps.beta_groups.list","apps.builds.list","apps.get","apps.list"],
  manualTools: ["asc__discover_domains","asc__search_tools","asc__status"],
  rootResources: ["(makro)","apps"],
};

export const PROFILE_DATA: GeneratedProfile[] = [
  {
    name: "access",
    subProfiles: [
    {
      name: "beta-testers",
      operations: ["apps.beta_testers.remove","beta_tester_invitations.create","beta_testers.apps.list","beta_testers.apps.remove","beta_testers.beta_groups.add","beta_testers.beta_groups.list","beta_testers.beta_groups.remove","beta_testers.beta_tester_usages.metrics","beta_testers.builds.add","beta_testers.builds.list","beta_testers.builds.remove","beta_testers.create","beta_testers.delete","beta_testers.get","beta_testers.list","build_beta_notifications.create","builds.beta_groups.add","builds.beta_groups.remove","builds.individual_testers.add","builds.individual_testers.list","builds.individual_testers.remove","sandbox_testers_clear_purchase_history_request_v2.create","sandbox_testers_v2.list","sandbox_testers_v2.update"],
      manualTools: [],
      rootResources: ["apps","beta_tester_invitations","beta_testers","build_beta_notifications","builds","sandbox_testers_clear_purchase_history_request_v2","sandbox_testers_v2"],
    },
    {
      name: "beta-groups",
      operations: ["beta_groups.beta_recruitment_criteria.get","beta_groups.beta_recruitment_criterion_compatible_build_check.get","beta_groups.beta_tester_usages.metrics","beta_groups.beta_testers.add","beta_groups.beta_testers.list","beta_groups.beta_testers.remove","beta_groups.builds.add","beta_groups.builds.list","beta_groups.builds.remove","beta_groups.create","beta_groups.delete","beta_groups.get","beta_groups.list","beta_groups.public_link_usages.metrics","beta_groups.update","beta_recruitment_criteria.create","beta_recruitment_criteria.delete","beta_recruitment_criteria.update","beta_recruitment_criterion_options.list"],
      manualTools: [],
      rootResources: ["beta_groups","beta_recruitment_criteria","beta_recruitment_criterion_options"],
    },
    {
      name: "users",
      operations: ["actors.get","actors.list","user_invitations.create","user_invitations.delete","user_invitations.get","user_invitations.list","user_invitations.visible_apps.list","users.delete","users.get","users.list","users.update","users.visible_apps.add","users.visible_apps.list","users.visible_apps.remove","users.visible_apps.replace"],
      manualTools: [],
      rootResources: ["actors","user_invitations","users"],
    },
    ],
  },
  {
    name: "accessibility",
    subProfiles: [
    {
      name: "",
      operations: ["accessibility_declarations.create","accessibility_declarations.delete","accessibility_declarations.get","accessibility_declarations.update","apps.accessibility_declarations.list"],
      manualTools: [],
      rootResources: ["accessibility_declarations","apps"],
    },
    ],
  },
  {
    name: "agreements",
    subProfiles: [
    {
      name: "",
      operations: ["apps.beta_license_agreement.get","apps.end_user_license_agreement.get","beta_license_agreements.app.get","beta_license_agreements.get","beta_license_agreements.list","beta_license_agreements.update","end_user_license_agreements.create","end_user_license_agreements.delete","end_user_license_agreements.get","end_user_license_agreements.territories.list","end_user_license_agreements.update"],
      manualTools: [],
      rootResources: ["apps","beta_license_agreements","end_user_license_agreements"],
    },
    ],
  },
  {
    name: "analytics",
    subProfiles: [
    {
      name: "",
      operations: ["analytics_report_instances.get","analytics_report_instances.segments.list","analytics_report_requests.create","analytics_report_requests.delete","analytics_report_requests.get","analytics_report_requests.reports.list","analytics_report_segments.get","analytics_reports.get","analytics_reports.instances.list","apps.analytics_report_requests.list","apps.perf_power_metrics.list","diagnostic_signatures.logs.list","finance_reports.list","sales_reports.list"],
      manualTools: [],
      rootResources: ["analytics_report_instances","analytics_report_requests","analytics_report_segments","analytics_reports","apps","diagnostic_signatures","finance_reports","sales_reports"],
    },
    ],
  },
  {
    name: "android-to-ios",
    subProfiles: [
    {
      name: "",
      operations: ["android_to_ios_app_mapping_details.create","android_to_ios_app_mapping_details.delete","android_to_ios_app_mapping_details.get","android_to_ios_app_mapping_details.update","apps.android_to_ios_app_mapping_details.list"],
      manualTools: [],
      rootResources: ["android_to_ios_app_mapping_details","apps"],
    },
    ],
  },
  {
    name: "app-clips",
    subProfiles: [
    {
      name: "",
      operations: ["app_clip_advanced_experience_images.create","app_clip_advanced_experience_images.get","app_clip_advanced_experience_images.update","app_clip_advanced_experiences.create","app_clip_advanced_experiences.get","app_clip_advanced_experiences.update","app_clip_app_store_review_details.create","app_clip_app_store_review_details.get","app_clip_app_store_review_details.update","app_clip_default_experience_localizations.app_clip_header_image.get","app_clip_default_experience_localizations.create","app_clip_default_experience_localizations.delete","app_clip_default_experience_localizations.get","app_clip_default_experience_localizations.update","app_clip_default_experiences.app_clip_app_store_review_detail.get","app_clip_default_experiences.app_clip_default_experience_localizations.list","app_clip_default_experiences.create","app_clip_default_experiences.delete","app_clip_default_experiences.get","app_clip_default_experiences.release_with_app_store_version.get","app_clip_default_experiences.release_with_app_store_version.set","app_clip_default_experiences.update","app_clip_header_images.create","app_clip_header_images.delete","app_clip_header_images.get","app_clip_header_images.update","app_clips.app_clip_advanced_experiences.list","app_clips.app_clip_default_experiences.list","app_clips.get","app_store_versions.app_clip_default_experience.get","app_store_versions.app_clip_default_experience.set","apps.app_clips.list","beta_app_clip_invocation_localizations.create","beta_app_clip_invocation_localizations.delete","beta_app_clip_invocation_localizations.update","beta_app_clip_invocations.create","beta_app_clip_invocations.delete","beta_app_clip_invocations.get","beta_app_clip_invocations.update","build_bundles.app_clip_domain_cache_status.get","build_bundles.app_clip_domain_debug_status.get","build_bundles.beta_app_clip_invocations.list"],
      manualTools: [],
      rootResources: ["app_clip_advanced_experience_images","app_clip_advanced_experiences","app_clip_app_store_review_details","app_clip_default_experience_localizations","app_clip_default_experiences","app_clip_header_images","app_clips","app_store_versions","apps","beta_app_clip_invocation_localizations","beta_app_clip_invocations","build_bundles"],
    },
    ],
  },
  {
    name: "app-info",
    subProfiles: [
    {
      name: "",
      operations: ["age_rating_declarations.update","app_availabilities_v2.create","app_availabilities_v2.get","app_availabilities_v2.territory_availabilities.list","app_categories.get","app_categories.list","app_categories.parent.get","app_categories.subcategories.list","app_info_localizations.create","app_info_localizations.delete","app_info_localizations.get","app_info_localizations.update","app_infos.age_rating_declaration.get","app_infos.app_info_localizations.list","app_infos.get","app_infos.primary_category.get","app_infos.primary_subcategory_one.get","app_infos.primary_subcategory_two.get","app_infos.secondary_category.get","app_infos.secondary_subcategory_one.get","app_infos.secondary_subcategory_two.get","app_infos.territory_age_ratings.list","app_infos.update","app_tags.territories.list","app_tags.update","apps.app_availability_v2.get","apps.app_infos.list","apps.app_tags.list","apps.update","end_app_availability_pre_orders.create","territories.list","territory_availabilities.update"],
      manualTools: [],
      rootResources: ["age_rating_declarations","app_availabilities_v2","app_categories","app_info_localizations","app_infos","app_tags","apps","end_app_availability_pre_orders","territories","territory_availabilities"],
    },
    ],
  },
  {
    name: "background-assets",
    subProfiles: [
    {
      name: "",
      operations: ["apps.background_assets.list","background_asset_upload_files.create","background_asset_upload_files.get","background_asset_upload_files.update","background_asset_version_app_store_releases.get","background_asset_version_external_beta_releases.get","background_asset_version_internal_beta_releases.get","background_asset_versions.background_asset_upload_files.list","background_asset_versions.create","background_asset_versions.get","background_assets.create","background_assets.get","background_assets.update","background_assets.versions.list"],
      manualTools: [],
      rootResources: ["apps","background_asset_upload_files","background_asset_version_app_store_releases","background_asset_version_external_beta_releases","background_asset_version_internal_beta_releases","background_asset_versions","background_assets"],
    },
    ],
  },
  {
    name: "distribution",
    subProfiles: [
    {
      name: "version",
      operations: ["app_store_version_localizations.app_preview_sets.list","app_store_version_localizations.app_screenshot_sets.list","app_store_version_localizations.create","app_store_version_localizations.delete","app_store_version_localizations.get","app_store_version_localizations.search_keywords.add","app_store_version_localizations.search_keywords.list","app_store_version_localizations.search_keywords.remove","app_store_version_localizations.update","app_store_version_phased_releases.create","app_store_version_phased_releases.delete","app_store_version_phased_releases.update","app_store_version_promotions.create","app_store_version_release_requests.create","app_store_versions.app_store_review_detail.get","app_store_versions.app_store_version_localizations.list","app_store_versions.app_store_version_phased_release.get","app_store_versions.build.get","app_store_versions.build.set","app_store_versions.create","app_store_versions.delete","app_store_versions.get","app_store_versions.routing_app_coverage.get","app_store_versions.update","apps.search_keywords.list"],
      manualTools: [],
      rootResources: ["app_store_version_localizations","app_store_version_phased_releases","app_store_version_promotions","app_store_version_release_requests","app_store_versions","apps"],
    },
    {
      name: "alternative",
      operations: ["alternative_distribution_domains.create","alternative_distribution_domains.delete","alternative_distribution_domains.get","alternative_distribution_domains.list","alternative_distribution_keys.create","alternative_distribution_keys.delete","alternative_distribution_keys.get","alternative_distribution_keys.list","alternative_distribution_package_deltas.get","alternative_distribution_package_variants.get","alternative_distribution_package_versions.deltas.list","alternative_distribution_package_versions.get","alternative_distribution_package_versions.variants.list","alternative_distribution_packages.create","alternative_distribution_packages.get","alternative_distribution_packages.versions.list","app_store_versions.alternative_distribution_package.get","apps.alternative_distribution_key.get","apps.marketplace_search_detail.get","marketplace_search_details.create","marketplace_search_details.delete","marketplace_search_details.update"],
      manualTools: [],
      rootResources: ["alternative_distribution_domains","alternative_distribution_keys","alternative_distribution_package_deltas","alternative_distribution_package_variants","alternative_distribution_package_versions","alternative_distribution_packages","app_store_versions","apps","marketplace_search_details"],
    },
    {
      name: "builds",
      operations: ["apps.build_uploads.list","build_bundles.build_bundle_file_sizes.list","build_upload_files.create","build_upload_files.get","build_upload_files.update","build_uploads.build_upload_files.list","build_uploads.create","build_uploads.delete","build_uploads.get","builds.app.get","builds.app_encryption_declaration.set","builds.app_store_version.get","builds.diagnostic_signatures.list","builds.get","builds.icons.list","builds.list","builds.perf_power_metrics.list","builds.pre_release_version.get","builds.update"],
      manualTools: [],
      rootResources: ["apps","build_bundles","build_upload_files","build_uploads","builds"],
    },
    {
      name: "coverages",
      operations: ["routing_app_coverages.create","routing_app_coverages.delete","routing_app_coverages.get","routing_app_coverages.update"],
      manualTools: [],
      rootResources: ["routing_app_coverages"],
    },
    {
      name: "pre-release",
      operations: ["apps.pre_release_versions.list","pre_release_versions.app.get","pre_release_versions.builds.list","pre_release_versions.get","pre_release_versions.list"],
      manualTools: [],
      rootResources: ["apps","pre_release_versions"],
    },
    {
      name: "review",
      operations: ["review_submission_items.create","review_submission_items.delete","review_submission_items.update","review_submissions.create","review_submissions.get","review_submissions.items.list","review_submissions.list","review_submissions.update"],
      manualTools: [],
      rootResources: ["review_submission_items","review_submissions"],
    },
    {
      name: "submission",
      operations: ["app_store_review_attachments.create","app_store_review_attachments.delete","app_store_review_attachments.get","app_store_review_attachments.update","app_store_review_details.app_store_review_attachments.list","app_store_review_details.create","app_store_review_details.get","app_store_review_details.update","apps.review_submissions.list"],
      manualTools: [],
      rootResources: ["app_store_review_attachments","app_store_review_details","apps"],
    },
    ],
  },
  {
    name: "encryption",
    subProfiles: [
    {
      name: "",
      operations: ["app_encryption_declaration_documents.create","app_encryption_declaration_documents.get","app_encryption_declaration_documents.update","app_encryption_declarations.app_encryption_declaration_document.get","app_encryption_declarations.create","app_encryption_declarations.get","app_encryption_declarations.list","builds.app_encryption_declaration.get"],
      manualTools: [],
      rootResources: ["app_encryption_declaration_documents","app_encryption_declarations","builds"],
    },
    ],
  },
  {
    name: "game-center",
    subProfiles: [
    {
      name: "gc-achievement",
      operations: ["game_center_achievement_images_v2.create","game_center_achievement_images_v2.delete","game_center_achievement_images_v2.get","game_center_achievement_images_v2.update","game_center_achievement_localizations_v2.create","game_center_achievement_localizations_v2.delete","game_center_achievement_localizations_v2.get","game_center_achievement_localizations_v2.image.get","game_center_achievement_localizations_v2.update","game_center_achievement_versions_v2.create","game_center_achievement_versions_v2.get","game_center_achievement_versions_v2.localizations.list","game_center_achievements_v2.activity.set","game_center_achievements_v2.create","game_center_achievements_v2.delete","game_center_achievements_v2.get","game_center_achievements_v2.update","game_center_achievements_v2.versions.list"],
      manualTools: [],
      rootResources: ["game_center_achievement_images_v2","game_center_achievement_localizations_v2","game_center_achievement_versions_v2","game_center_achievements_v2"],
    },
    {
      name: "gc-activities",
      operations: ["game_center_activities.achievements_v2.add","game_center_activities.achievements_v2.remove","game_center_activities.create","game_center_activities.delete","game_center_activities.get","game_center_activities.leaderboards_v2.add","game_center_activities.leaderboards_v2.remove","game_center_activities.update","game_center_activities.versions.list","game_center_activity_images.create","game_center_activity_images.delete","game_center_activity_images.get","game_center_activity_images.update","game_center_activity_localizations.create","game_center_activity_localizations.delete","game_center_activity_localizations.get","game_center_activity_localizations.image.get","game_center_activity_localizations.update","game_center_activity_versions.create","game_center_activity_versions.default_image.get","game_center_activity_versions.get","game_center_activity_versions.localizations.list","game_center_activity_versions.update"],
      manualTools: [],
      rootResources: ["game_center_activities","game_center_activity_images","game_center_activity_localizations","game_center_activity_versions"],
    },
    {
      name: "gc-challenge",
      operations: ["game_center_challenge_images.create","game_center_challenge_images.delete","game_center_challenge_images.get","game_center_challenge_images.update","game_center_challenge_localizations.create","game_center_challenge_localizations.delete","game_center_challenge_localizations.get","game_center_challenge_localizations.image.get","game_center_challenge_localizations.update","game_center_challenge_versions.create","game_center_challenge_versions.default_image.get","game_center_challenge_versions.get","game_center_challenge_versions.localizations.list","game_center_challenges.create","game_center_challenges.delete","game_center_challenges.get","game_center_challenges.leaderboard_v2.set","game_center_challenges.update","game_center_challenges.versions.list"],
      manualTools: [],
      rootResources: ["game_center_challenge_images","game_center_challenge_localizations","game_center_challenge_versions","game_center_challenges"],
    },
    {
      name: "gc-default",
      operations: ["app_store_versions.game_center_app_version.get","apps.game_center_detail.get","game_center_app_versions.app_store_version.get","game_center_app_versions.compatibility_versions.add","game_center_app_versions.compatibility_versions.list","game_center_app_versions.compatibility_versions.remove","game_center_app_versions.create","game_center_app_versions.get","game_center_app_versions.update","game_center_player_achievement_submissions.create"],
      manualTools: [],
      rootResources: ["app_store_versions","apps","game_center_app_versions","game_center_player_achievement_submissions"],
    },
    {
      name: "gc-details",
      operations: ["game_center_details.challenges_minimum_platform_versions.replace","game_center_details.classic_matchmaking_requests.metrics","game_center_details.create","game_center_details.game_center_achievements_v2.list","game_center_details.game_center_achievements_v2.replace","game_center_details.game_center_activities.list","game_center_details.game_center_app_versions.list","game_center_details.game_center_challenges.list","game_center_details.game_center_group.get","game_center_details.game_center_leaderboard_sets_v2.list","game_center_details.game_center_leaderboard_sets_v2.replace","game_center_details.game_center_leaderboards_v2.list","game_center_details.game_center_leaderboards_v2.replace","game_center_details.get","game_center_details.rule_based_matchmaking_requests.metrics","game_center_details.update"],
      manualTools: [],
      rootResources: ["game_center_details"],
    },
    {
      name: "gc-groups",
      operations: ["game_center_groups.create","game_center_groups.delete","game_center_groups.game_center_achievements_v2.list","game_center_groups.game_center_achievements_v2.replace","game_center_groups.game_center_activities.list","game_center_groups.game_center_challenges.list","game_center_groups.game_center_details.list","game_center_groups.game_center_leaderboard_sets_v2.list","game_center_groups.game_center_leaderboard_sets_v2.replace","game_center_groups.game_center_leaderboards_v2.list","game_center_groups.game_center_leaderboards_v2.replace","game_center_groups.get","game_center_groups.list","game_center_groups.update"],
      manualTools: [],
      rootResources: ["game_center_groups"],
    },
    {
      name: "gc-leaderboard",
      operations: ["game_center_leaderboard_entry_submissions.create","game_center_leaderboard_images_v2.create","game_center_leaderboard_images_v2.delete","game_center_leaderboard_images_v2.get","game_center_leaderboard_images_v2.update","game_center_leaderboard_localizations_v2.create","game_center_leaderboard_localizations_v2.delete","game_center_leaderboard_localizations_v2.get","game_center_leaderboard_localizations_v2.image.get","game_center_leaderboard_localizations_v2.update","game_center_leaderboard_set_images_v2.create","game_center_leaderboard_set_images_v2.delete","game_center_leaderboard_set_images_v2.get","game_center_leaderboard_set_images_v2.update","game_center_leaderboard_set_localizations_v2.create","game_center_leaderboard_set_localizations_v2.delete","game_center_leaderboard_set_localizations_v2.get","game_center_leaderboard_set_localizations_v2.image.get","game_center_leaderboard_set_localizations_v2.update","game_center_leaderboard_set_member_localizations.create","game_center_leaderboard_set_member_localizations.delete","game_center_leaderboard_set_member_localizations.list","game_center_leaderboard_set_member_localizations.update","game_center_leaderboard_set_versions_v2.create","game_center_leaderboard_set_versions_v2.get","game_center_leaderboard_set_versions_v2.localizations.list","game_center_leaderboard_sets_v2.create","game_center_leaderboard_sets_v2.delete","game_center_leaderboard_sets_v2.game_center_leaderboards.add","game_center_leaderboard_sets_v2.game_center_leaderboards.list","game_center_leaderboard_sets_v2.game_center_leaderboards.remove","game_center_leaderboard_sets_v2.game_center_leaderboards.replace","game_center_leaderboard_sets_v2.get","game_center_leaderboard_sets_v2.update","game_center_leaderboard_sets_v2.versions.list","game_center_leaderboard_versions_v2.create","game_center_leaderboard_versions_v2.get","game_center_leaderboard_versions_v2.localizations.list","game_center_leaderboards_v2.activity.set","game_center_leaderboards_v2.challenge.set","game_center_leaderboards_v2.create","game_center_leaderboards_v2.delete","game_center_leaderboards_v2.get","game_center_leaderboards_v2.update","game_center_leaderboards_v2.versions.list"],
      manualTools: [],
      rootResources: ["game_center_leaderboard_entry_submissions","game_center_leaderboard_images_v2","game_center_leaderboard_localizations_v2","game_center_leaderboard_set_images_v2","game_center_leaderboard_set_localizations_v2","game_center_leaderboard_set_member_localizations","game_center_leaderboard_set_versions_v2","game_center_leaderboard_sets_v2","game_center_leaderboard_versions_v2","game_center_leaderboards_v2"],
    },
    {
      name: "gc-matchmaking",
      operations: ["game_center_matchmaking_queues.create","game_center_matchmaking_queues.delete","game_center_matchmaking_queues.experiment_matchmaking_queue_sizes.metrics","game_center_matchmaking_queues.experiment_matchmaking_requests.metrics","game_center_matchmaking_queues.get","game_center_matchmaking_queues.list","game_center_matchmaking_queues.matchmaking_queue_sizes.metrics","game_center_matchmaking_queues.matchmaking_requests.metrics","game_center_matchmaking_queues.matchmaking_sessions.metrics","game_center_matchmaking_queues.update","game_center_matchmaking_rule_set_tests.create","game_center_matchmaking_rule_sets.create","game_center_matchmaking_rule_sets.delete","game_center_matchmaking_rule_sets.get","game_center_matchmaking_rule_sets.list","game_center_matchmaking_rule_sets.matchmaking_queues.list","game_center_matchmaking_rule_sets.rules.list","game_center_matchmaking_rule_sets.teams.list","game_center_matchmaking_rule_sets.update","game_center_matchmaking_rules.create","game_center_matchmaking_rules.delete","game_center_matchmaking_rules.matchmaking_boolean_rule_results.metrics","game_center_matchmaking_rules.matchmaking_number_rule_results.metrics","game_center_matchmaking_rules.matchmaking_rule_errors.metrics","game_center_matchmaking_rules.update","game_center_matchmaking_teams.create","game_center_matchmaking_teams.delete","game_center_matchmaking_teams.update"],
      manualTools: [],
      rootResources: ["game_center_matchmaking_queues","game_center_matchmaking_rule_set_tests","game_center_matchmaking_rule_sets","game_center_matchmaking_rules","game_center_matchmaking_teams"],
    },
    ],
  },
  {
    name: "marketing",
    subProfiles: [
    {
      name: "app-event",
      operations: ["app_event_localizations.app_event_screenshots.list","app_event_localizations.app_event_video_clips.list","app_event_localizations.create","app_event_localizations.delete","app_event_localizations.get","app_event_localizations.update","app_event_screenshots.create","app_event_screenshots.delete","app_event_screenshots.get","app_event_screenshots.update","app_event_video_clips.create","app_event_video_clips.delete","app_event_video_clips.get","app_event_video_clips.update","app_events.create","app_events.delete","app_events.get","app_events.localizations.list","app_events.update","apps.app_events.list"],
      manualTools: [],
      rootResources: ["app_event_localizations","app_event_screenshots","app_event_video_clips","app_events","apps"],
    },
    {
      name: "customer-review",
      operations: ["app_store_versions.customer_reviews.list","apps.customer_review_summarizations.list","apps.customer_reviews.list","customer_review_responses.create","customer_review_responses.delete","customer_review_responses.get","customer_reviews.get","customer_reviews.response.get"],
      manualTools: ["reviews_ai__daily_briefing","reviews_ai__draft_response","reviews_ai__triage"],
      rootResources: ["(makro)","app_store_versions","apps","customer_review_responses","customer_reviews"],
    },
    {
      name: "nominations",
      operations: ["nominations.create","nominations.delete","nominations.get","nominations.list","nominations.update"],
      manualTools: [],
      rootResources: ["nominations"],
    },
    {
      name: "pp-custom",
      operations: ["app_custom_product_page_localizations.app_preview_sets.list","app_custom_product_page_localizations.app_screenshot_sets.list","app_custom_product_page_localizations.create","app_custom_product_page_localizations.delete","app_custom_product_page_localizations.get","app_custom_product_page_localizations.search_keywords.add","app_custom_product_page_localizations.search_keywords.list","app_custom_product_page_localizations.search_keywords.remove","app_custom_product_page_localizations.update","app_custom_product_page_versions.app_custom_product_page_localizations.list","app_custom_product_page_versions.create","app_custom_product_page_versions.get","app_custom_product_page_versions.update","app_custom_product_pages.app_custom_product_page_versions.list","app_custom_product_pages.create","app_custom_product_pages.delete","app_custom_product_pages.get","app_custom_product_pages.update","apps.app_custom_product_pages.list","apps.customer_reviews.list"],
      manualTools: [],
      rootResources: ["app_custom_product_page_localizations","app_custom_product_page_versions","app_custom_product_pages","apps"],
    },
    {
      name: "pp-experiment",
      operations: ["app_store_version_experiment_treatment_localizations.app_preview_sets.list","app_store_version_experiment_treatment_localizations.app_screenshot_sets.list","app_store_version_experiment_treatment_localizations.create","app_store_version_experiment_treatment_localizations.delete","app_store_version_experiment_treatment_localizations.get","app_store_version_experiment_treatments.app_store_version_experiment_treatment_localizations.list","app_store_version_experiment_treatments.create","app_store_version_experiment_treatments.delete","app_store_version_experiment_treatments.get","app_store_version_experiment_treatments.update","app_store_version_experiments_v2.app_store_version_experiment_treatments.list","app_store_version_experiments_v2.create","app_store_version_experiments_v2.delete","app_store_version_experiments_v2.get","app_store_version_experiments_v2.update","app_store_versions.app_store_version_experiments_v2.list","apps.app_store_version_experiments_v2.list"],
      manualTools: [],
      rootResources: ["app_store_version_experiment_treatment_localizations","app_store_version_experiment_treatments","app_store_version_experiments_v2","app_store_versions","apps"],
    },
    {
      name: "pp-main",
      operations: ["app_preview_sets.app_previews.list","app_preview_sets.app_previews.replace","app_preview_sets.create","app_preview_sets.delete","app_preview_sets.get","app_previews.create","app_previews.delete","app_previews.get","app_previews.update","app_screenshot_sets.app_screenshots.list","app_screenshot_sets.app_screenshots.replace","app_screenshot_sets.create","app_screenshot_sets.delete","app_screenshot_sets.get","app_screenshots.create","app_screenshots.delete","app_screenshots.get","app_screenshots.update"],
      manualTools: [],
      rootResources: ["app_preview_sets","app_previews","app_screenshot_sets","app_screenshots"],
    },
    ],
  },
  {
    name: "monetization",
    subProfiles: [
    {
      name: "app-price",
      operations: ["app_price_points_v3.equalizations.list","app_price_points_v3.get","app_price_schedules.automatic_prices.list","app_price_schedules.base_territory.get","app_price_schedules.create","app_price_schedules.get","app_price_schedules.manual_prices.list","apps.app_price_points.list","apps.app_price_schedule.get"],
      manualTools: [],
      rootResources: ["app_price_points_v3","app_price_schedules","apps"],
    },
    {
      name: "subscriptions",
      operations: ["apps.subscription_grace_period.get","apps.subscription_groups.list","subscription_app_store_review_screenshots.create","subscription_app_store_review_screenshots.delete","subscription_app_store_review_screenshots.get","subscription_app_store_review_screenshots.update","subscription_grace_periods.get","subscription_grace_periods.update","subscription_group_localizations.create","subscription_group_localizations.delete","subscription_group_localizations.get","subscription_group_localizations.update","subscription_group_localizations_v2.create","subscription_group_localizations_v2.delete","subscription_group_localizations_v2.get","subscription_group_localizations_v2.update","subscription_group_submissions.create","subscription_group_versions.create","subscription_group_versions.get","subscription_group_versions.localizations.list","subscription_groups.create","subscription_groups.delete","subscription_groups.get","subscription_groups.subscription_group_localizations.list","subscription_groups.subscriptions.list","subscription_groups.update","subscription_groups.versions.list","subscription_images.create","subscription_images.delete","subscription_images.get","subscription_images.update","subscription_images_v2.create","subscription_images_v2.delete","subscription_images_v2.get","subscription_images_v2.update","subscription_introductory_offers.create","subscription_introductory_offers.delete","subscription_introductory_offers.update","subscription_localizations.create","subscription_localizations.delete","subscription_localizations.get","subscription_localizations.update","subscription_localizations_v2.create","subscription_localizations_v2.delete","subscription_localizations_v2.get","subscription_localizations_v2.update","subscription_offer_code_custom_codes.create","subscription_offer_code_custom_codes.get","subscription_offer_code_custom_codes.update","subscription_offer_code_one_time_use_codes.create","subscription_offer_code_one_time_use_codes.get","subscription_offer_code_one_time_use_codes.update","subscription_offer_code_one_time_use_codes.values.get","subscription_offer_codes.create","subscription_offer_codes.custom_codes.list","subscription_offer_codes.get","subscription_offer_codes.one_time_use_codes.list","subscription_offer_codes.prices.list","subscription_offer_codes.update","subscription_plan_availabilities.available_territories.list","subscription_plan_availabilities.available_territories.replace","subscription_plan_availabilities.create","subscription_plan_availabilities.get","subscription_plan_availabilities.update","subscription_price_points.adjusted_equalizations.list","subscription_price_points.equalizations.list","subscription_price_points.get","subscription_prices.create","subscription_prices.delete","subscription_promotional_offers.create","subscription_promotional_offers.delete","subscription_promotional_offers.get","subscription_promotional_offers.prices.list","subscription_promotional_offers.update","subscription_submissions.create","subscription_versions.create","subscription_versions.get","subscription_versions.image.get","subscription_versions.images.list","subscription_versions.localizations.list","subscriptions.app_store_review_screenshot.get","subscriptions.create","subscriptions.delete","subscriptions.get","subscriptions.images.list","subscriptions.introductory_offers.list","subscriptions.introductory_offers.remove","subscriptions.offer_codes.list","subscriptions.plan_availabilities.list","subscriptions.price_points.list","subscriptions.prices.list","subscriptions.prices.remove","subscriptions.promoted_purchase.get","subscriptions.promotional_offers.list","subscriptions.subscription_localizations.list","subscriptions.update","subscriptions.versions.list","subscriptions.win_back_offers.list"],
      manualTools: ["pricing__set_subscription_price"],
      rootResources: ["(makro)","apps","subscription_app_store_review_screenshots","subscription_grace_periods","subscription_group_localizations","subscription_group_localizations_v2","subscription_group_submissions","subscription_group_versions","subscription_groups","subscription_images","subscription_images_v2","subscription_introductory_offers","subscription_localizations","subscription_localizations_v2","subscription_offer_code_custom_codes","subscription_offer_code_one_time_use_codes","subscription_offer_codes","subscription_plan_availabilities","subscription_price_points","subscription_prices","subscription_promotional_offers","subscription_submissions","subscription_versions","subscriptions"],
    },
    {
      name: "iap",
      operations: ["apps.in_app_purchases_v2.list","apps.promoted_purchases.list","apps.promoted_purchases.replace","in_app_purchase_app_store_review_screenshots.create","in_app_purchase_app_store_review_screenshots.delete","in_app_purchase_app_store_review_screenshots.get","in_app_purchase_app_store_review_screenshots.update","in_app_purchase_availabilities.available_territories.list","in_app_purchase_availabilities.create","in_app_purchase_availabilities.get","in_app_purchase_contents.get","in_app_purchase_images.create","in_app_purchase_images.delete","in_app_purchase_images.get","in_app_purchase_images.update","in_app_purchase_images_v2.create","in_app_purchase_images_v2.delete","in_app_purchase_images_v2.get","in_app_purchase_images_v2.update","in_app_purchase_localizations.create","in_app_purchase_localizations.delete","in_app_purchase_localizations.get","in_app_purchase_localizations.update","in_app_purchase_localizations_v2.create","in_app_purchase_localizations_v2.delete","in_app_purchase_localizations_v2.get","in_app_purchase_localizations_v2.update","in_app_purchase_offer_code_custom_codes.create","in_app_purchase_offer_code_custom_codes.get","in_app_purchase_offer_code_custom_codes.update","in_app_purchase_offer_code_one_time_use_codes.create","in_app_purchase_offer_code_one_time_use_codes.get","in_app_purchase_offer_code_one_time_use_codes.update","in_app_purchase_offer_code_one_time_use_codes.values.get","in_app_purchase_offer_codes.create","in_app_purchase_offer_codes.custom_codes.list","in_app_purchase_offer_codes.get","in_app_purchase_offer_codes.one_time_use_codes.list","in_app_purchase_offer_codes.prices.list","in_app_purchase_offer_codes.update","in_app_purchase_price_points.equalizations.list","in_app_purchase_price_schedules.automatic_prices.list","in_app_purchase_price_schedules.base_territory.get","in_app_purchase_price_schedules.create","in_app_purchase_price_schedules.get","in_app_purchase_price_schedules.manual_prices.list","in_app_purchase_submissions.create","in_app_purchase_versions.create","in_app_purchase_versions.get","in_app_purchase_versions.image.get","in_app_purchase_versions.images.list","in_app_purchase_versions.localizations.list","in_app_purchases_v2.app_store_review_screenshot.get","in_app_purchases_v2.content.get","in_app_purchases_v2.create","in_app_purchases_v2.delete","in_app_purchases_v2.get","in_app_purchases_v2.iap_price_schedule.get","in_app_purchases_v2.images.list","in_app_purchases_v2.in_app_purchase_availability.get","in_app_purchases_v2.in_app_purchase_localizations.list","in_app_purchases_v2.offer_codes.list","in_app_purchases_v2.price_points.list","in_app_purchases_v2.promoted_purchase.get","in_app_purchases_v2.update","in_app_purchases_v2.versions.list"],
      manualTools: [],
      rootResources: ["apps","in_app_purchase_app_store_review_screenshots","in_app_purchase_availabilities","in_app_purchase_contents","in_app_purchase_images","in_app_purchase_images_v2","in_app_purchase_localizations","in_app_purchase_localizations_v2","in_app_purchase_offer_code_custom_codes","in_app_purchase_offer_code_one_time_use_codes","in_app_purchase_offer_codes","in_app_purchase_price_points","in_app_purchase_price_schedules","in_app_purchase_submissions","in_app_purchase_versions","in_app_purchases_v2"],
    },
    {
      name: "promote",
      operations: ["promoted_purchases.create","promoted_purchases.delete","promoted_purchases.get","promoted_purchases.update"],
      manualTools: [],
      rootResources: ["promoted_purchases"],
    },
    {
      name: "storekit",
      operations: [],
      manualTools: ["storekit__check_entitlement","storekit__extend_renewal_date","storekit__get_notification_history","storekit__get_refund_history","storekit__get_subscription_statuses","storekit__get_transaction_history","storekit__get_transaction_info","storekit__lookup_order","storekit__request_test_notification"],
      rootResources: ["(makro)"],
    },
    {
      name: "winback",
      operations: ["win_back_offers.create","win_back_offers.delete","win_back_offers.get","win_back_offers.prices.list","win_back_offers.update"],
      manualTools: [],
      rootResources: ["win_back_offers"],
    },
    ],
  },
  {
    name: "provisioning",
    subProfiles: [
    {
      name: "",
      operations: ["bundle_id_capabilities.create","bundle_id_capabilities.delete","bundle_id_capabilities.update","bundle_ids.app.get","bundle_ids.bundle_id_capabilities.list","bundle_ids.create","bundle_ids.delete","bundle_ids.get","bundle_ids.list","bundle_ids.profiles.list","bundle_ids.update","certificates.create","certificates.delete","certificates.get","certificates.list","certificates.pass_type_id.get","certificates.update","devices.create","devices.get","devices.list","devices.update","merchant_ids.certificates.list","merchant_ids.create","merchant_ids.delete","merchant_ids.get","merchant_ids.list","merchant_ids.update","pass_type_ids.certificates.list","pass_type_ids.create","pass_type_ids.delete","pass_type_ids.get","pass_type_ids.list","pass_type_ids.update","profiles.bundle_id.get","profiles.certificates.list","profiles.create","profiles.delete","profiles.devices.list","profiles.get","profiles.list"],
      manualTools: [],
      rootResources: ["bundle_id_capabilities","bundle_ids","certificates","devices","merchant_ids","pass_type_ids","profiles"],
    },
    ],
  },
  {
    name: "testflight",
    subProfiles: [
    {
      name: "",
      operations: ["apps.beta_app_localizations.list","apps.beta_app_review_detail.get","apps.beta_feedback_crash_submissions.list","apps.beta_feedback_screenshot_submissions.list","apps.beta_tester_usages.metrics","beta_app_localizations.app.get","beta_app_localizations.create","beta_app_localizations.delete","beta_app_localizations.get","beta_app_localizations.list","beta_app_localizations.update","beta_app_review_details.app.get","beta_app_review_details.get","beta_app_review_details.list","beta_app_review_details.update","beta_app_review_submissions.build.get","beta_app_review_submissions.create","beta_app_review_submissions.get","beta_app_review_submissions.list","beta_build_localizations.build.get","beta_build_localizations.create","beta_build_localizations.delete","beta_build_localizations.get","beta_build_localizations.list","beta_build_localizations.update","beta_crash_logs.get","beta_feedback_crash_submissions.crash_log.get","beta_feedback_crash_submissions.delete","beta_feedback_crash_submissions.get","beta_feedback_screenshot_submissions.delete","beta_feedback_screenshot_submissions.get","beta_groups.app.get","build_beta_details.build.get","build_beta_details.get","build_beta_details.list","build_beta_details.update","builds.beta_app_review_submission.get","builds.beta_build_localizations.list","builds.beta_build_usages.metrics","builds.build_beta_detail.get"],
      manualTools: [],
      rootResources: ["apps","beta_app_localizations","beta_app_review_details","beta_app_review_submissions","beta_build_localizations","beta_crash_logs","beta_feedback_crash_submissions","beta_feedback_screenshot_submissions","beta_groups","build_beta_details","builds"],
    },
    ],
  },
  {
    name: "webhooks",
    subProfiles: [
    {
      name: "",
      operations: ["apps.webhooks.list","webhook_deliveries.create","webhook_pings.create","webhooks.create","webhooks.delete","webhooks.deliveries.list","webhooks.get","webhooks.update"],
      manualTools: [],
      rootResources: ["apps","webhook_deliveries","webhook_pings","webhooks"],
    },
    ],
  },
  {
    name: "xcode-cloud",
    subProfiles: [
    {
      name: "",
      operations: ["apps.ci_product.get","ci_artifacts.get","ci_build_actions.artifacts.list","ci_build_actions.build_run.get","ci_build_actions.get","ci_build_actions.issues.list","ci_build_actions.test_results.list","ci_build_runs.actions.list","ci_build_runs.builds.list","ci_build_runs.create","ci_build_runs.get","ci_issues.get","ci_mac_os_versions.get","ci_mac_os_versions.list","ci_mac_os_versions.xcode_versions.list","ci_products.additional_repositories.list","ci_products.app.get","ci_products.build_runs.list","ci_products.delete","ci_products.get","ci_products.list","ci_products.primary_repositories.list","ci_products.workflows.list","ci_test_results.get","ci_workflows.build_runs.list","ci_workflows.create","ci_workflows.delete","ci_workflows.get","ci_workflows.repository.get","ci_workflows.update","ci_xcode_versions.get","ci_xcode_versions.list","ci_xcode_versions.mac_os_versions.list","scm_git_references.get","scm_providers.get","scm_providers.list","scm_providers.repositories.list","scm_pull_requests.get","scm_repositories.get","scm_repositories.git_references.list","scm_repositories.list","scm_repositories.pull_requests.list"],
      manualTools: [],
      rootResources: ["apps","ci_artifacts","ci_build_actions","ci_build_runs","ci_issues","ci_mac_os_versions","ci_products","ci_test_results","ci_workflows","ci_xcode_versions","scm_git_references","scm_providers","scm_pull_requests","scm_repositories"],
    },
    ],
  },
];
