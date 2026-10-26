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

export const PROFILE_DATA: GeneratedProfile[] = [
  {
    name: "access",
    subProfiles: [
    {
      name: "sandbox",
      operations: ["sandbox_testers_clear_purchase_history_request_v2.create","sandbox_testers_v2.list","sandbox_testers_v2.update"],
      manualTools: [],
      rootResources: ["sandbox_testers_clear_purchase_history_request_v2","sandbox_testers_v2"],
    },
    {
      name: "user-invitations",
      operations: ["user_invitations.create","user_invitations.delete","user_invitations.get","user_invitations.list","user_invitations.visible_apps.list"],
      manualTools: [],
      rootResources: ["user_invitations"],
    },
    {
      name: "user-management",
      operations: ["users.delete","users.get","users.list","users.update","users.visible_apps.add","users.visible_apps.list","users.visible_apps.remove","users.visible_apps.replace"],
      manualTools: [],
      rootResources: ["users"],
    },
    ],
  },
  {
    name: "analytics",
    subProfiles: [
    {
      name: "",
      operations: ["analytics_report_instances.get","analytics_report_instances.segments.list","analytics_report_requests.create","analytics_report_requests.delete","analytics_report_requests.get","analytics_report_requests.reports.list","analytics_report_segments.get","analytics_reports.get","analytics_reports.instances.list","apps.analytics_report_requests.list","apps.perf_power_metrics.list","apps.performance_overviews.list","builds.diagnostic_signatures.list","builds.perf_power_metrics.list","diagnostic_signatures.logs.list","finance_reports.list","sales_reports.list"],
      manualTools: ["analytics__get_report"],
      rootResources: ["analytics_report_instances","analytics_report_requests","analytics_report_segments","analytics_reports","apps","builds","diagnostic_signatures","finance_reports","sales_reports"],
    },
    ],
  },
  {
    name: "app-clips",
    subProfiles: [
    {
      name: "",
      operations: ["app_clip_advanced_experience_images.create","app_clip_advanced_experience_images.get","app_clip_advanced_experience_images.update","app_clip_advanced_experiences.create","app_clip_advanced_experiences.get","app_clip_advanced_experiences.update","app_clip_app_store_review_details.create","app_clip_app_store_review_details.get","app_clip_app_store_review_details.update","app_clip_default_experience_localizations.app_clip_header_image.get","app_clip_default_experience_localizations.create","app_clip_default_experience_localizations.delete","app_clip_default_experience_localizations.get","app_clip_default_experience_localizations.update","app_clip_default_experiences.app_clip_app_store_review_detail.get","app_clip_default_experiences.app_clip_default_experience_localizations.list","app_clip_default_experiences.create","app_clip_default_experiences.delete","app_clip_default_experiences.get","app_clip_default_experiences.release_with_app_store_version.get","app_clip_default_experiences.release_with_app_store_version.set","app_clip_default_experiences.update","app_clip_header_images.create","app_clip_header_images.delete","app_clip_header_images.get","app_clip_header_images.update","app_clips.app_clip_advanced_experiences.list","app_clips.app_clip_default_experiences.list","app_clips.get","app_store_versions.app_clip_default_experience.get","apps.app_clips.list","beta_app_clip_invocation_localizations.create","beta_app_clip_invocation_localizations.delete","beta_app_clip_invocation_localizations.update","beta_app_clip_invocations.create","beta_app_clip_invocations.delete","beta_app_clip_invocations.get","beta_app_clip_invocations.update","build_bundles.app_clip_domain_cache_status.get","build_bundles.app_clip_domain_debug_status.get","build_bundles.beta_app_clip_invocations.list"],
      manualTools: [],
      rootResources: ["app_clip_advanced_experience_images","app_clip_advanced_experiences","app_clip_app_store_review_details","app_clip_default_experience_localizations","app_clip_default_experiences","app_clip_header_images","app_clips","app_store_versions","apps","beta_app_clip_invocation_localizations","beta_app_clip_invocations","build_bundles"],
    },
    ],
  },
  {
    name: "background-assets",
    subProfiles: [
    {
      name: "",
      operations: ["apps.background_assets.list","background_asset_upload_files.create","background_asset_upload_files.get","background_asset_upload_files.update","background_asset_version_app_store_releases.get","background_asset_version_external_beta_releases.get","background_asset_version_internal_beta_releases.get","background_asset_versions.background_asset_upload_files.list","background_asset_versions.create","background_asset_versions.get","background_assets.create","background_assets.get","background_assets.update","background_assets.versions.list"],
      manualTools: ["release__submit_items"],
      rootResources: ["apps","background_asset_upload_files","background_asset_version_app_store_releases","background_asset_version_external_beta_releases","background_asset_version_internal_beta_releases","background_asset_versions","background_assets"],
    },
    ],
  },
  {
    name: "core",
    subProfiles: [
    {
      name: "",
      operations: ["actors.get","actors.list","apps.app_store_versions.list","apps.builds.list","apps.get","apps.in_app_purchases_v2.list","apps.list","apps.subscription_groups.list"],
      manualTools: ["asc__account_status","asc__discover_domains","asc__search_tools","asc__status","listing__delete_assets","listing__get_screenshots","listing__upload_asset","listing__upload_screenshot"],
      rootResources: ["actors","apps"],
    },
    ],
  },
  {
    name: "distribution",
    subProfiles: [
    {
      name: "app-encryption",
      operations: ["app_encryption_declaration_documents.create","app_encryption_declaration_documents.get","app_encryption_declaration_documents.update","app_encryption_declarations.app_encryption_declaration_document.get","app_encryption_declarations.create","app_encryption_declarations.get","app_encryption_declarations.list","apps.app_encryption_declarations.list","builds.app_encryption_declaration.get","builds.app_encryption_declaration.set"],
      manualTools: [],
      rootResources: ["app_encryption_declaration_documents","app_encryption_declarations","apps","builds"],
    },
    {
      name: "app-review-information",
      operations: ["app_store_review_attachments.create","app_store_review_attachments.delete","app_store_review_attachments.get","app_store_review_attachments.update","app_store_review_details.app_store_review_attachments.list","app_store_review_details.create","app_store_review_details.get","app_store_review_details.update","app_store_versions.app_store_review_detail.get"],
      manualTools: [],
      rootResources: ["app_store_review_attachments","app_store_review_details","app_store_versions"],
    },
    {
      name: "builds",
      operations: ["apps.build_uploads.list","build_bundles.build_bundle_file_sizes.list","build_upload_files.create","build_upload_files.get","build_upload_files.update","build_uploads.build_upload_files.list","build_uploads.create","build_uploads.delete","build_uploads.get","builds.app.get","builds.app_store_version.get","builds.get","builds.icons.list","builds.list","builds.update"],
      manualTools: [],
      rootResources: ["apps","build_bundles","build_upload_files","build_uploads","builds"],
    },
    {
      name: "dma-distribution",
      operations: ["alternative_distribution_domains.create","alternative_distribution_domains.delete","alternative_distribution_domains.get","alternative_distribution_domains.list","alternative_distribution_keys.create","alternative_distribution_keys.delete","alternative_distribution_keys.get","alternative_distribution_keys.list","alternative_distribution_package_deltas.get","alternative_distribution_package_variants.get","alternative_distribution_package_versions.deltas.list","alternative_distribution_package_versions.get","alternative_distribution_package_versions.variants.list","alternative_distribution_packages.create","alternative_distribution_packages.get","alternative_distribution_packages.versions.list","app_store_versions.alternative_distribution_package.get","apps.alternative_distribution_key.get","apps.marketplace_search_detail.get","marketplace_search_details.create","marketplace_search_details.delete","marketplace_search_details.update"],
      manualTools: [],
      rootResources: ["alternative_distribution_domains","alternative_distribution_keys","alternative_distribution_package_deltas","alternative_distribution_package_variants","alternative_distribution_package_versions","alternative_distribution_packages","app_store_versions","apps","marketplace_search_details"],
    },
    {
      name: "phased-releases",
      operations: ["app_store_version_phased_releases.create","app_store_version_phased_releases.delete","app_store_version_phased_releases.update","app_store_version_release_requests.create","app_store_versions.app_store_version_phased_release.get"],
      manualTools: [],
      rootResources: ["app_store_version_phased_releases","app_store_version_release_requests","app_store_versions"],
    },
    {
      name: "publish",
      operations: ["app_store_version_release_requests.create","apps.review_submissions.list","review_submission_items.create","review_submission_items.delete","review_submission_items.update","review_submissions.create","review_submissions.get","review_submissions.items.list","review_submissions.list","review_submissions.update"],
      manualTools: ["release__submit"],
      rootResources: ["app_store_version_release_requests","apps","review_submission_items","review_submissions"],
    },
    {
      name: "routing-coverage",
      operations: ["app_store_versions.routing_app_coverage.get","routing_app_coverages.create","routing_app_coverages.delete","routing_app_coverages.get","routing_app_coverages.update"],
      manualTools: [],
      rootResources: ["app_store_versions","routing_app_coverages"],
    },
    {
      name: "version",
      operations: ["app_preview_sets.app_previews.list","app_preview_sets.app_previews.replace","app_preview_sets.create","app_preview_sets.delete","app_preview_sets.get","app_previews.create","app_previews.delete","app_previews.get","app_previews.update","app_screenshot_sets.app_screenshots.list","app_screenshot_sets.app_screenshots.replace","app_screenshot_sets.create","app_screenshot_sets.delete","app_screenshot_sets.get","app_screenshots.create","app_screenshots.delete","app_screenshots.get","app_screenshots.update","app_store_version_localizations.app_preview_sets.list","app_store_version_localizations.app_screenshot_sets.list","app_store_version_localizations.create","app_store_version_localizations.delete","app_store_version_localizations.get","app_store_version_localizations.placements.list","app_store_version_localizations.search_keywords.add","app_store_version_localizations.search_keywords.list","app_store_version_localizations.search_keywords.remove","app_store_version_localizations.update","app_store_versions.app_store_review_detail.get","app_store_versions.app_store_version_localizations.list","app_store_versions.build.get","app_store_versions.build.set","app_store_versions.create","app_store_versions.delete","app_store_versions.get","app_store_versions.update","apps.search_keywords.list"],
      manualTools: ["listing__diff_metadata","metadata_ai__apply_localizations","metadata_ai__audit_localizations","metadata_ai__draft_translation","preflight__check_version"],
      rootResources: ["app_preview_sets","app_previews","app_screenshot_sets","app_screenshots","app_store_version_localizations","app_store_versions","apps"],
    },
    ],
  },
  {
    name: "game-center",
    subProfiles: [
    {
      name: "achievements",
      operations: ["apps.game_center_detail.get","game_center_achievement_images_v2.create","game_center_achievement_images_v2.delete","game_center_achievement_images_v2.get","game_center_achievement_images_v2.update","game_center_achievement_localizations_v2.create","game_center_achievement_localizations_v2.delete","game_center_achievement_localizations_v2.get","game_center_achievement_localizations_v2.image.get","game_center_achievement_localizations_v2.update","game_center_achievement_versions_v2.create","game_center_achievement_versions_v2.get","game_center_achievement_versions_v2.localizations.list","game_center_achievements_v2.create","game_center_achievements_v2.delete","game_center_achievements_v2.get","game_center_achievements_v2.update","game_center_achievements_v2.versions.list","game_center_details.game_center_achievements_v2.list","game_center_details.game_center_achievements_v2.replace","game_center_player_achievement_submissions.create"],
      manualTools: ["release__submit_items"],
      rootResources: ["apps","game_center_achievement_images_v2","game_center_achievement_localizations_v2","game_center_achievement_versions_v2","game_center_achievements_v2","game_center_details","game_center_player_achievement_submissions"],
    },
    {
      name: "activities",
      operations: ["apps.game_center_detail.get","game_center_activities.achievements_v2.add","game_center_activities.achievements_v2.remove","game_center_activities.create","game_center_activities.delete","game_center_activities.get","game_center_activities.leaderboards_v2.add","game_center_activities.leaderboards_v2.remove","game_center_activities.update","game_center_activities.versions.list","game_center_activity_images.create","game_center_activity_images.delete","game_center_activity_images.get","game_center_activity_images.update","game_center_activity_localizations.create","game_center_activity_localizations.delete","game_center_activity_localizations.get","game_center_activity_localizations.image.get","game_center_activity_localizations.update","game_center_activity_versions.create","game_center_activity_versions.default_image.get","game_center_activity_versions.get","game_center_activity_versions.localizations.list","game_center_activity_versions.update","game_center_details.game_center_achievements_v2.list","game_center_details.game_center_activities.list","game_center_details.game_center_leaderboards_v2.list"],
      manualTools: ["release__submit_items"],
      rootResources: ["apps","game_center_activities","game_center_activity_images","game_center_activity_localizations","game_center_activity_versions","game_center_details"],
    },
    {
      name: "challenges",
      operations: ["apps.game_center_detail.get","game_center_challenge_images.create","game_center_challenge_images.delete","game_center_challenge_images.get","game_center_challenge_images.update","game_center_challenge_localizations.create","game_center_challenge_localizations.delete","game_center_challenge_localizations.get","game_center_challenge_localizations.image.get","game_center_challenge_localizations.update","game_center_challenge_versions.create","game_center_challenge_versions.default_image.get","game_center_challenge_versions.get","game_center_challenge_versions.localizations.list","game_center_challenges.create","game_center_challenges.delete","game_center_challenges.get","game_center_challenges.leaderboard_v2.set","game_center_challenges.update","game_center_challenges.versions.list","game_center_details.challenges_minimum_platform_versions.replace","game_center_details.game_center_challenges.list","game_center_details.game_center_leaderboards_v2.list"],
      manualTools: ["release__submit_items"],
      rootResources: ["apps","game_center_challenge_images","game_center_challenge_localizations","game_center_challenge_versions","game_center_challenges","game_center_details"],
    },
    {
      name: "groups",
      operations: ["game_center_details.game_center_group.get","game_center_groups.create","game_center_groups.delete","game_center_groups.game_center_achievements_v2.list","game_center_groups.game_center_achievements_v2.replace","game_center_groups.game_center_activities.list","game_center_groups.game_center_challenges.list","game_center_groups.game_center_details.list","game_center_groups.game_center_leaderboard_sets_v2.list","game_center_groups.game_center_leaderboard_sets_v2.replace","game_center_groups.game_center_leaderboards_v2.list","game_center_groups.game_center_leaderboards_v2.replace","game_center_groups.get","game_center_groups.list","game_center_groups.update"],
      manualTools: [],
      rootResources: ["game_center_details","game_center_groups"],
    },
    {
      name: "leaderboards",
      operations: ["apps.game_center_detail.get","game_center_details.game_center_leaderboard_sets_v2.list","game_center_details.game_center_leaderboard_sets_v2.replace","game_center_details.game_center_leaderboards_v2.list","game_center_details.game_center_leaderboards_v2.replace","game_center_leaderboard_entry_submissions.create","game_center_leaderboard_images_v2.create","game_center_leaderboard_images_v2.delete","game_center_leaderboard_images_v2.get","game_center_leaderboard_images_v2.update","game_center_leaderboard_localizations_v2.create","game_center_leaderboard_localizations_v2.delete","game_center_leaderboard_localizations_v2.get","game_center_leaderboard_localizations_v2.image.get","game_center_leaderboard_localizations_v2.update","game_center_leaderboard_set_images_v2.create","game_center_leaderboard_set_images_v2.delete","game_center_leaderboard_set_images_v2.get","game_center_leaderboard_set_images_v2.update","game_center_leaderboard_set_localizations_v2.create","game_center_leaderboard_set_localizations_v2.delete","game_center_leaderboard_set_localizations_v2.get","game_center_leaderboard_set_localizations_v2.image.get","game_center_leaderboard_set_localizations_v2.update","game_center_leaderboard_set_member_localizations.create","game_center_leaderboard_set_member_localizations.delete","game_center_leaderboard_set_member_localizations.list","game_center_leaderboard_set_member_localizations.update","game_center_leaderboard_set_versions_v2.create","game_center_leaderboard_set_versions_v2.get","game_center_leaderboard_set_versions_v2.localizations.list","game_center_leaderboard_sets_v2.create","game_center_leaderboard_sets_v2.delete","game_center_leaderboard_sets_v2.game_center_leaderboards.add","game_center_leaderboard_sets_v2.game_center_leaderboards.list","game_center_leaderboard_sets_v2.game_center_leaderboards.remove","game_center_leaderboard_sets_v2.game_center_leaderboards.replace","game_center_leaderboard_sets_v2.get","game_center_leaderboard_sets_v2.update","game_center_leaderboard_sets_v2.versions.list","game_center_leaderboard_versions_v2.create","game_center_leaderboard_versions_v2.get","game_center_leaderboard_versions_v2.localizations.list","game_center_leaderboards_v2.create","game_center_leaderboards_v2.delete","game_center_leaderboards_v2.game_center_score_moderations.list","game_center_leaderboards_v2.get","game_center_leaderboards_v2.update","game_center_leaderboards_v2.versions.list","game_center_score_moderations.update"],
      manualTools: ["release__submit_items"],
      rootResources: ["apps","game_center_details","game_center_leaderboard_entry_submissions","game_center_leaderboard_images_v2","game_center_leaderboard_localizations_v2","game_center_leaderboard_set_images_v2","game_center_leaderboard_set_localizations_v2","game_center_leaderboard_set_member_localizations","game_center_leaderboard_set_versions_v2","game_center_leaderboard_sets_v2","game_center_leaderboard_versions_v2","game_center_leaderboards_v2","game_center_score_moderations"],
    },
    {
      name: "matchmaking",
      operations: ["apps.game_center_detail.get","game_center_details.classic_matchmaking_requests.metrics","game_center_details.rule_based_matchmaking_requests.metrics","game_center_matchmaking_queues.create","game_center_matchmaking_queues.delete","game_center_matchmaking_queues.experiment_matchmaking_queue_sizes.metrics","game_center_matchmaking_queues.experiment_matchmaking_requests.metrics","game_center_matchmaking_queues.get","game_center_matchmaking_queues.list","game_center_matchmaking_queues.matchmaking_queue_sizes.metrics","game_center_matchmaking_queues.matchmaking_requests.metrics","game_center_matchmaking_queues.matchmaking_sessions.metrics","game_center_matchmaking_queues.update","game_center_matchmaking_rule_set_tests.create","game_center_matchmaking_rule_sets.create","game_center_matchmaking_rule_sets.delete","game_center_matchmaking_rule_sets.get","game_center_matchmaking_rule_sets.list","game_center_matchmaking_rule_sets.matchmaking_queues.list","game_center_matchmaking_rule_sets.rules.list","game_center_matchmaking_rule_sets.teams.list","game_center_matchmaking_rule_sets.update","game_center_matchmaking_rules.create","game_center_matchmaking_rules.delete","game_center_matchmaking_rules.matchmaking_boolean_rule_results.metrics","game_center_matchmaking_rules.matchmaking_number_rule_results.metrics","game_center_matchmaking_rules.matchmaking_rule_errors.metrics","game_center_matchmaking_rules.update","game_center_matchmaking_teams.create","game_center_matchmaking_teams.delete","game_center_matchmaking_teams.update"],
      manualTools: [],
      rootResources: ["apps","game_center_details","game_center_matchmaking_queues","game_center_matchmaking_rule_set_tests","game_center_matchmaking_rule_sets","game_center_matchmaking_rules","game_center_matchmaking_teams"],
    },
    {
      name: "setup",
      operations: ["app_store_versions.game_center_app_version.get","apps.game_center_detail.get","game_center_app_versions.app_store_version.get","game_center_app_versions.compatibility_versions.add","game_center_app_versions.compatibility_versions.list","game_center_app_versions.compatibility_versions.remove","game_center_app_versions.create","game_center_app_versions.get","game_center_app_versions.update","game_center_detail_players.update","game_center_details.blocked_players.list","game_center_details.create","game_center_details.game_center_app_versions.list","game_center_details.get","game_center_details.update"],
      manualTools: [],
      rootResources: ["app_store_versions","apps","game_center_app_versions","game_center_detail_players","game_center_details"],
    },
    ],
  },
  {
    name: "general",
    subProfiles: [
    {
      name: "android-link",
      operations: ["android_to_ios_app_mapping_details.create","android_to_ios_app_mapping_details.delete","android_to_ios_app_mapping_details.get","android_to_ios_app_mapping_details.update","apps.android_to_ios_app_mapping_details.list"],
      manualTools: [],
      rootResources: ["android_to_ios_app_mapping_details","apps"],
    },
    {
      name: "app-accessibility",
      operations: ["accessibility_declarations.create","accessibility_declarations.delete","accessibility_declarations.get","accessibility_declarations.update","apps.accessibility_declarations.list"],
      manualTools: [],
      rootResources: ["accessibility_declarations","apps"],
    },
    {
      name: "app-availabilities",
      operations: ["app_availabilities_v2.create","app_availabilities_v2.get","app_availabilities_v2.territory_availabilities.list","apps.app_availability_v2.get","end_app_availability_pre_orders.create","territories.list","territory_availabilities.update"],
      manualTools: [],
      rootResources: ["app_availabilities_v2","apps","end_app_availability_pre_orders","territories","territory_availabilities"],
    },
    {
      name: "app-categories",
      operations: ["app_categories.get","app_categories.list","app_categories.parent.get","app_categories.subcategories.list","app_infos.primary_category.get","app_infos.primary_subcategory_one.get","app_infos.primary_subcategory_two.get","app_infos.secondary_category.get","app_infos.secondary_subcategory_one.get","app_infos.secondary_subcategory_two.get","app_infos.update","apps.app_infos.list"],
      manualTools: [],
      rootResources: ["app_categories","app_infos","apps"],
    },
    {
      name: "app-information",
      operations: ["app_info_localizations.create","app_info_localizations.delete","app_info_localizations.get","app_info_localizations.update","app_infos.app_info_localizations.list","app_infos.get","apps.app_infos.list","apps.update"],
      manualTools: [],
      rootResources: ["app_info_localizations","app_infos","apps"],
    },
    {
      name: "app-tags",
      operations: ["app_tags.territories.list","app_tags.update","apps.app_tags.list"],
      manualTools: [],
      rootResources: ["app_tags","apps"],
    },
    {
      name: "legal",
      operations: ["age_rating_declarations.update","app_infos.age_rating_declaration.get","app_infos.territory_age_ratings.list","apps.app_infos.list","apps.end_user_license_agreement.get","end_user_license_agreements.create","end_user_license_agreements.delete","end_user_license_agreements.get","end_user_license_agreements.territories.list","end_user_license_agreements.update"],
      manualTools: [],
      rootResources: ["age_rating_declarations","app_infos","apps","end_user_license_agreements"],
    },
    ],
  },
  {
    name: "marketing",
    subProfiles: [
    {
      name: "app-events",
      operations: ["app_event_localizations.app_event_screenshots.list","app_event_localizations.app_event_video_clips.list","app_event_localizations.create","app_event_localizations.delete","app_event_localizations.get","app_event_localizations.placements.list","app_event_localizations.update","app_event_screenshots.create","app_event_screenshots.delete","app_event_screenshots.get","app_event_screenshots.update","app_event_video_clips.create","app_event_video_clips.delete","app_event_video_clips.get","app_event_video_clips.update","app_events.create","app_events.delete","app_events.get","app_events.localizations.list","app_events.update","apps.app_events.list"],
      manualTools: ["release__submit_items"],
      rootResources: ["app_event_localizations","app_event_screenshots","app_event_video_clips","app_events","apps"],
    },
    {
      name: "asset-library",
      operations: ["app_asset_libraries.get","app_asset_libraries.images.list","app_asset_libraries.videos.list","app_asset_library_images.create","app_asset_library_images.delete","app_asset_library_images.get","app_asset_library_images.placements.list","app_asset_library_images.update","app_asset_library_placement_ordering_requests.create","app_asset_library_placements.create","app_asset_library_placements.delete","app_asset_library_placements.get","app_asset_library_ref_data.get","app_asset_library_ref_data.list","app_asset_library_videos.create","app_asset_library_videos.delete","app_asset_library_videos.get","app_asset_library_videos.placements.list","app_asset_library_videos.update","app_custom_product_page_localizations.placements.list","app_event_localizations.placements.list","app_store_version_experiment_treatment_localizations.placements.list","app_store_version_localizations.placements.list","apps.asset_library.get"],
      manualTools: [],
      rootResources: ["app_asset_libraries","app_asset_library_images","app_asset_library_placement_ordering_requests","app_asset_library_placements","app_asset_library_ref_data","app_asset_library_videos","app_custom_product_page_localizations","app_event_localizations","app_store_version_experiment_treatment_localizations","app_store_version_localizations","apps"],
    },
    {
      name: "custom-pp",
      operations: ["app_custom_product_page_localizations.app_preview_sets.list","app_custom_product_page_localizations.app_screenshot_sets.list","app_custom_product_page_localizations.create","app_custom_product_page_localizations.delete","app_custom_product_page_localizations.get","app_custom_product_page_localizations.placements.list","app_custom_product_page_localizations.search_keywords.add","app_custom_product_page_localizations.search_keywords.list","app_custom_product_page_localizations.search_keywords.remove","app_custom_product_page_localizations.update","app_custom_product_page_versions.app_custom_product_page_localizations.list","app_custom_product_page_versions.create","app_custom_product_page_versions.get","app_custom_product_page_versions.update","app_custom_product_pages.app_custom_product_page_versions.list","app_custom_product_pages.create","app_custom_product_pages.delete","app_custom_product_pages.get","app_custom_product_pages.update","app_preview_sets.app_previews.list","app_preview_sets.app_previews.replace","app_preview_sets.create","app_preview_sets.delete","app_preview_sets.get","app_previews.create","app_previews.delete","app_previews.get","app_previews.update","app_screenshot_sets.app_screenshots.list","app_screenshot_sets.app_screenshots.replace","app_screenshot_sets.create","app_screenshot_sets.delete","app_screenshot_sets.get","app_screenshots.create","app_screenshots.delete","app_screenshots.get","app_screenshots.update","apps.app_custom_product_pages.list"],
      manualTools: ["release__submit_items"],
      rootResources: ["app_custom_product_page_localizations","app_custom_product_page_versions","app_custom_product_pages","app_preview_sets","app_previews","app_screenshot_sets","app_screenshots","apps"],
    },
    {
      name: "customer-reviews",
      operations: ["app_store_versions.customer_reviews.list","apps.customer_review_summarizations.list","apps.customer_reviews.list","customer_review_responses.create","customer_review_responses.delete","customer_review_responses.get","customer_reviews.get","customer_reviews.response.get"],
      manualTools: ["reviews_ai__daily_briefing","reviews_ai__draft_response","reviews_ai__triage"],
      rootResources: ["app_store_versions","apps","customer_review_responses","customer_reviews"],
    },
    {
      name: "nominations",
      operations: ["nominations.create","nominations.delete","nominations.get","nominations.list","nominations.update"],
      manualTools: [],
      rootResources: ["nominations"],
    },
    {
      name: "pp-optimization",
      operations: ["app_preview_sets.app_previews.list","app_preview_sets.app_previews.replace","app_preview_sets.create","app_preview_sets.delete","app_preview_sets.get","app_previews.create","app_previews.delete","app_previews.get","app_previews.update","app_screenshot_sets.app_screenshots.list","app_screenshot_sets.app_screenshots.replace","app_screenshot_sets.create","app_screenshot_sets.delete","app_screenshot_sets.get","app_screenshots.create","app_screenshots.delete","app_screenshots.get","app_screenshots.update","app_store_version_experiment_treatment_localizations.app_preview_sets.list","app_store_version_experiment_treatment_localizations.app_screenshot_sets.list","app_store_version_experiment_treatment_localizations.create","app_store_version_experiment_treatment_localizations.delete","app_store_version_experiment_treatment_localizations.get","app_store_version_experiment_treatment_localizations.placements.list","app_store_version_experiment_treatments.app_store_version_experiment_treatment_localizations.list","app_store_version_experiment_treatments.create","app_store_version_experiment_treatments.delete","app_store_version_experiment_treatments.get","app_store_version_experiment_treatments.update","app_store_version_experiments_v2.app_store_version_experiment_treatments.list","app_store_version_experiments_v2.create","app_store_version_experiments_v2.delete","app_store_version_experiments_v2.get","app_store_version_experiments_v2.update","app_store_version_promotions.create","app_store_versions.app_store_version_experiments_v2.list","apps.app_store_version_experiments_v2.list"],
      manualTools: ["release__submit_items"],
      rootResources: ["app_preview_sets","app_previews","app_screenshot_sets","app_screenshots","app_store_version_experiment_treatment_localizations","app_store_version_experiment_treatments","app_store_version_experiments_v2","app_store_version_promotions","app_store_versions","apps"],
    },
    ],
  },
  {
    name: "monetization",
    subProfiles: [
    {
      name: "app-price",
      operations: ["app_price_points_v3.equalizations.list","app_price_points_v3.get","app_price_schedules.automatic_prices.list","app_price_schedules.base_territory.get","app_price_schedules.create","app_price_schedules.get","app_price_schedules.manual_prices.list","apps.app_price_points.list","apps.app_price_schedule.get"],
      manualTools: ["pricing__equalize_price","pricing__get_app_price"],
      rootResources: ["app_price_points_v3","app_price_schedules","apps"],
    },
    {
      name: "iap-offers",
      operations: ["in_app_purchase_offer_code_custom_codes.create","in_app_purchase_offer_code_custom_codes.get","in_app_purchase_offer_code_custom_codes.update","in_app_purchase_offer_code_one_time_use_codes.create","in_app_purchase_offer_code_one_time_use_codes.get","in_app_purchase_offer_code_one_time_use_codes.update","in_app_purchase_offer_code_one_time_use_codes.values.get","in_app_purchase_offer_codes.create","in_app_purchase_offer_codes.custom_codes.list","in_app_purchase_offer_codes.get","in_app_purchase_offer_codes.one_time_use_codes.list","in_app_purchase_offer_codes.prices.list","in_app_purchase_offer_codes.update","in_app_purchases_v2.offer_codes.list","in_app_purchases_v2.price_points.list"],
      manualTools: [],
      rootResources: ["in_app_purchase_offer_code_custom_codes","in_app_purchase_offer_code_one_time_use_codes","in_app_purchase_offer_codes","in_app_purchases_v2"],
    },
    {
      name: "in-app-purchases",
      operations: ["in_app_purchase_app_store_review_screenshots.create","in_app_purchase_app_store_review_screenshots.delete","in_app_purchase_app_store_review_screenshots.get","in_app_purchase_app_store_review_screenshots.update","in_app_purchase_availabilities.available_territories.list","in_app_purchase_availabilities.create","in_app_purchase_availabilities.get","in_app_purchase_images_v2.create","in_app_purchase_images_v2.delete","in_app_purchase_images_v2.get","in_app_purchase_images_v2.update","in_app_purchase_localizations_v2.create","in_app_purchase_localizations_v2.delete","in_app_purchase_localizations_v2.get","in_app_purchase_localizations_v2.update","in_app_purchase_price_points.equalizations.list","in_app_purchase_price_schedules.automatic_prices.list","in_app_purchase_price_schedules.base_territory.get","in_app_purchase_price_schedules.create","in_app_purchase_price_schedules.get","in_app_purchase_price_schedules.manual_prices.list","in_app_purchase_versions.create","in_app_purchase_versions.get","in_app_purchase_versions.image.get","in_app_purchase_versions.images.list","in_app_purchase_versions.localizations.list","in_app_purchases_v2.app_store_review_screenshot.get","in_app_purchases_v2.content.get","in_app_purchases_v2.create","in_app_purchases_v2.delete","in_app_purchases_v2.get","in_app_purchases_v2.iap_price_schedule.get","in_app_purchases_v2.in_app_purchase_availability.get","in_app_purchases_v2.price_points.list","in_app_purchases_v2.update","in_app_purchases_v2.versions.list"],
      manualTools: ["pricing__equalize_price","pricing__get_iap_price","pricing__set_iap_price","release__submit_items"],
      rootResources: ["in_app_purchase_app_store_review_screenshots","in_app_purchase_availabilities","in_app_purchase_images_v2","in_app_purchase_localizations_v2","in_app_purchase_price_points","in_app_purchase_price_schedules","in_app_purchase_versions","in_app_purchases_v2"],
    },
    {
      name: "plan-promote",
      operations: ["apps.promoted_purchases.list","apps.promoted_purchases.replace","in_app_purchases_v2.promoted_purchase.get","promoted_purchases.create","promoted_purchases.delete","promoted_purchases.get","promoted_purchases.update","subscription_groups.subscriptions.list","subscriptions.promoted_purchase.get"],
      manualTools: [],
      rootResources: ["apps","in_app_purchases_v2","promoted_purchases","subscription_groups","subscriptions"],
    },
    {
      name: "subscription",
      operations: ["apps.subscription_grace_period.get","subscription_app_store_review_screenshots.create","subscription_app_store_review_screenshots.delete","subscription_app_store_review_screenshots.get","subscription_app_store_review_screenshots.update","subscription_grace_periods.get","subscription_grace_periods.update","subscription_group_localizations_v2.create","subscription_group_localizations_v2.delete","subscription_group_localizations_v2.get","subscription_group_localizations_v2.update","subscription_group_versions.create","subscription_group_versions.get","subscription_group_versions.localizations.list","subscription_groups.create","subscription_groups.delete","subscription_groups.get","subscription_groups.subscriptions.list","subscription_groups.update","subscription_groups.versions.list","subscription_images_v2.create","subscription_images_v2.delete","subscription_images_v2.get","subscription_images_v2.update","subscription_localizations_v2.create","subscription_localizations_v2.delete","subscription_localizations_v2.get","subscription_localizations_v2.update","subscription_plan_availabilities.available_territories.list","subscription_plan_availabilities.available_territories.replace","subscription_plan_availabilities.create","subscription_plan_availabilities.get","subscription_plan_availabilities.update","subscription_price_points.adjusted_equalizations.list","subscription_price_points.equalizations.list","subscription_price_points.get","subscription_prices.create","subscription_prices.delete","subscription_versions.create","subscription_versions.get","subscription_versions.image.get","subscription_versions.images.list","subscription_versions.localizations.list","subscriptions.app_store_review_screenshot.get","subscriptions.create","subscriptions.delete","subscriptions.get","subscriptions.plan_availabilities.list","subscriptions.price_points.list","subscriptions.prices.list","subscriptions.prices.remove","subscriptions.update","subscriptions.versions.list"],
      manualTools: ["preflight__check_subscription","pricing__equalize_price","pricing__get_subscription_price","pricing__set_subscription_price","release__submit_items"],
      rootResources: ["apps","subscription_app_store_review_screenshots","subscription_grace_periods","subscription_group_localizations_v2","subscription_group_versions","subscription_groups","subscription_images_v2","subscription_localizations_v2","subscription_plan_availabilities","subscription_price_points","subscription_prices","subscription_versions","subscriptions"],
    },
    {
      name: "subscription-codes",
      operations: ["subscription_groups.subscriptions.list","subscription_offer_code_custom_codes.create","subscription_offer_code_custom_codes.get","subscription_offer_code_custom_codes.update","subscription_offer_code_one_time_use_codes.create","subscription_offer_code_one_time_use_codes.get","subscription_offer_code_one_time_use_codes.update","subscription_offer_code_one_time_use_codes.values.get","subscription_offer_codes.create","subscription_offer_codes.custom_codes.list","subscription_offer_codes.get","subscription_offer_codes.one_time_use_codes.list","subscription_offer_codes.prices.list","subscription_offer_codes.update","subscriptions.offer_codes.list","subscriptions.price_points.list"],
      manualTools: [],
      rootResources: ["subscription_groups","subscription_offer_code_custom_codes","subscription_offer_code_one_time_use_codes","subscription_offer_codes","subscriptions"],
    },
    {
      name: "subscription-offers",
      operations: ["subscription_groups.subscriptions.list","subscription_introductory_offers.create","subscription_introductory_offers.delete","subscription_introductory_offers.update","subscription_promotional_offers.create","subscription_promotional_offers.delete","subscription_promotional_offers.get","subscription_promotional_offers.prices.list","subscription_promotional_offers.update","subscriptions.introductory_offers.list","subscriptions.introductory_offers.remove","subscriptions.price_points.list","subscriptions.promotional_offers.list"],
      manualTools: ["pricing__make_offer"],
      rootResources: ["subscription_groups","subscription_introductory_offers","subscription_promotional_offers","subscriptions"],
    },
    {
      name: "subscription-win-back",
      operations: ["subscription_groups.subscriptions.list","subscriptions.price_points.list","subscriptions.win_back_offers.list","win_back_offers.create","win_back_offers.delete","win_back_offers.get","win_back_offers.prices.list","win_back_offers.update"],
      manualTools: ["pricing__make_offer"],
      rootResources: ["subscription_groups","subscriptions","win_back_offers"],
    },
    {
      name: "transactions",
      operations: [],
      manualTools: ["storekit__check_entitlement","storekit__extend_renewal_date","storekit__get_notification_history","storekit__get_refund_history","storekit__get_subscription_statuses","storekit__get_transaction_history","storekit__get_transaction_info","storekit__lookup_order","storekit__request_test_notification"],
      rootResources: [],
    },
    ],
  },
  {
    name: "provisioning",
    subProfiles: [
    {
      name: "bundle",
      operations: ["bundle_id_capabilities.create","bundle_id_capabilities.delete","bundle_id_capabilities.update","bundle_ids.app.get","bundle_ids.bundle_id_capabilities.list","bundle_ids.create","bundle_ids.delete","bundle_ids.get","bundle_ids.list","bundle_ids.profiles.list","bundle_ids.update"],
      manualTools: [],
      rootResources: ["bundle_id_capabilities","bundle_ids"],
    },
    {
      name: "certificates",
      operations: ["certificates.create","certificates.delete","certificates.get","certificates.list","certificates.update"],
      manualTools: [],
      rootResources: ["certificates"],
    },
    {
      name: "devices",
      operations: ["devices.create","devices.get","devices.list","devices.update"],
      manualTools: [],
      rootResources: ["devices"],
    },
    {
      name: "profiles",
      operations: ["bundle_ids.list","certificates.list","devices.list","profiles.bundle_id.get","profiles.certificates.list","profiles.create","profiles.delete","profiles.devices.list","profiles.get","profiles.list"],
      manualTools: [],
      rootResources: ["bundle_ids","certificates","devices","profiles"],
    },
    {
      name: "wallet",
      operations: ["certificates.pass_type_id.get","merchant_ids.certificates.list","merchant_ids.create","merchant_ids.delete","merchant_ids.get","merchant_ids.list","merchant_ids.update","pass_type_ids.certificates.list","pass_type_ids.create","pass_type_ids.delete","pass_type_ids.get","pass_type_ids.list","pass_type_ids.update"],
      manualTools: [],
      rootResources: ["certificates","merchant_ids","pass_type_ids"],
    },
    ],
  },
  {
    name: "testflight",
    subProfiles: [
    {
      name: "external-testing",
      operations: ["apps.beta_app_review_detail.get","apps.beta_groups.list","apps.beta_license_agreement.get","beta_app_review_details.get","beta_app_review_details.list","beta_app_review_details.update","beta_app_review_submissions.build.get","beta_app_review_submissions.create","beta_app_review_submissions.get","beta_app_review_submissions.list","beta_groups.beta_recruitment_criteria.get","beta_groups.beta_recruitment_criterion_compatible_build_check.get","beta_groups.public_link_usages.metrics","beta_license_agreements.get","beta_license_agreements.list","beta_license_agreements.update","beta_recruitment_criteria.create","beta_recruitment_criteria.delete","beta_recruitment_criteria.update","beta_recruitment_criterion_options.list","builds.beta_app_review_submission.get"],
      manualTools: [],
      rootResources: ["apps","beta_app_review_details","beta_app_review_submissions","beta_groups","beta_license_agreements","beta_recruitment_criteria","beta_recruitment_criterion_options","builds"],
    },
    {
      name: "feedbacks",
      operations: ["apps.beta_feedback_crash_submissions.list","apps.beta_feedback_screenshot_submissions.list","apps.beta_groups.list","apps.beta_tester_usages.metrics","beta_crash_logs.get","beta_feedback_crash_submissions.crash_log.get","beta_feedback_crash_submissions.delete","beta_feedback_crash_submissions.get","beta_feedback_screenshot_submissions.delete","beta_feedback_screenshot_submissions.get","beta_groups.beta_tester_usages.metrics","beta_testers.beta_tester_usages.metrics","beta_testers.list","builds.beta_build_usages.metrics"],
      manualTools: ["testflight__feedback_digest"],
      rootResources: ["apps","beta_crash_logs","beta_feedback_crash_submissions","beta_feedback_screenshot_submissions","beta_groups","beta_testers","builds"],
    },
    {
      name: "groups",
      operations: ["apps.beta_groups.list","beta_groups.beta_testers.list","beta_groups.builds.add","beta_groups.builds.list","beta_groups.builds.remove","beta_groups.create","beta_groups.delete","beta_groups.get","beta_groups.list","beta_groups.update"],
      manualTools: ["testflight__assign_build_to_groups"],
      rootResources: ["apps","beta_groups"],
    },
    {
      name: "test-builds",
      operations: ["apps.beta_app_localizations.list","apps.beta_groups.list","apps.pre_release_versions.list","beta_app_localizations.create","beta_app_localizations.delete","beta_app_localizations.get","beta_app_localizations.list","beta_app_localizations.update","beta_build_localizations.create","beta_build_localizations.delete","beta_build_localizations.get","beta_build_localizations.list","beta_build_localizations.update","build_beta_details.get","build_beta_details.list","build_beta_details.update","build_beta_notifications.create","builds.beta_build_localizations.list","builds.build_beta_detail.get","builds.pre_release_version.get","pre_release_versions.builds.list","pre_release_versions.get","pre_release_versions.list"],
      manualTools: ["testflight__assign_build_to_groups"],
      rootResources: ["apps","beta_app_localizations","beta_build_localizations","build_beta_details","build_beta_notifications","builds","pre_release_versions"],
    },
    {
      name: "testers",
      operations: ["apps.beta_groups.list","apps.beta_testers.remove","beta_tester_invitations.create","beta_testers.apps.list","beta_testers.beta_groups.add","beta_testers.beta_groups.list","beta_testers.beta_groups.remove","beta_testers.builds.list","beta_testers.create","beta_testers.delete","beta_testers.get","beta_testers.list","builds.individual_testers.add","builds.individual_testers.list","builds.individual_testers.remove"],
      manualTools: [],
      rootResources: ["apps","beta_tester_invitations","beta_testers","builds"],
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
      name: "repositories",
      operations: ["ci_products.additional_repositories.list","ci_products.list","ci_products.primary_repositories.list","ci_products.workflows.list","ci_workflows.repository.get","scm_git_references.get","scm_providers.get","scm_providers.list","scm_providers.repositories.list","scm_pull_requests.get","scm_repositories.get","scm_repositories.git_references.list","scm_repositories.list","scm_repositories.pull_requests.list"],
      manualTools: [],
      rootResources: ["ci_products","ci_workflows","scm_git_references","scm_providers","scm_pull_requests","scm_repositories"],
    },
    {
      name: "workflows",
      operations: ["apps.ci_product.get","ci_artifacts.get","ci_build_actions.artifacts.list","ci_build_actions.build_run.get","ci_build_actions.get","ci_build_actions.issues.list","ci_build_actions.test_results.list","ci_build_runs.actions.list","ci_build_runs.builds.list","ci_build_runs.create","ci_build_runs.get","ci_issues.get","ci_mac_os_versions.get","ci_mac_os_versions.list","ci_mac_os_versions.xcode_versions.list","ci_products.app.get","ci_products.build_runs.list","ci_products.delete","ci_products.get","ci_products.list","ci_products.workflows.list","ci_test_results.get","ci_workflows.build_runs.list","ci_workflows.create","ci_workflows.delete","ci_workflows.get","ci_workflows.update","ci_xcode_versions.get","ci_xcode_versions.list","ci_xcode_versions.mac_os_versions.list","scm_repositories.list"],
      manualTools: ["ci__diagnose_run"],
      rootResources: ["apps","ci_artifacts","ci_build_actions","ci_build_runs","ci_issues","ci_mac_os_versions","ci_products","ci_test_results","ci_workflows","ci_xcode_versions","scm_repositories"],
    },
    ],
  },
];

/** In no profile on purpose (reverse reads); reachable only with --domains. */
export const PROFILELESS: string[] = ["beta_app_localizations.app.get","beta_app_review_details.app.get","beta_build_localizations.build.get","beta_groups.app.get","beta_license_agreements.app.get","build_beta_details.build.get","pre_release_versions.app.get"];

/** One direction of a relationship pair, dropped for its twin (operation -> twin). */
export const TWIN_OF: Record<string, string> = {
  "app_store_versions.app_clip_default_experience.set": "app_clip_default_experiences.release_with_app_store_version.set",
  "beta_groups.beta_testers.add": "beta_testers.beta_groups.add",
  "beta_groups.beta_testers.remove": "beta_testers.beta_groups.remove",
  "beta_testers.apps.remove": "apps.beta_testers.remove",
  "beta_testers.builds.add": "builds.individual_testers.add",
  "beta_testers.builds.remove": "builds.individual_testers.remove",
  "builds.beta_groups.add": "beta_groups.builds.add",
  "builds.beta_groups.remove": "beta_groups.builds.remove",
  "game_center_achievements_v2.activity.set": "game_center_activities.achievements_v2.add",
  "game_center_leaderboards_v2.activity.set": "game_center_activities.leaderboards_v2.add",
  "game_center_leaderboards_v2.challenge.set": "game_center_challenges.leaderboard_v2.set",
  "in_app_purchase_contents.get": "in_app_purchases_v2.content.get",
};

/** Operations a hand-written macro replaces outright (operation -> macro). */
export const MACRO_COVERED: Record<string, string> = {};
