# Profiles

🇬🇧 English · 🇹🇷 [Türkçe](PROFILES_tr.md)

Heimdall cuts App Store Connect by the work you do. You pick from 13 profiles, and each one is its own small MCP server: name a profile, and only that job's tools are loaded. A large profile splits further into sub-profiles, 50 in all.

Next to whatever you pick, setup registers **ASC-Core**: finding your apps, searching every tool, and the media tools. It is the same for every profile, so it runs once instead of inside each server.

| Profile | Server | What it is for | Tools | Sub-profiles |
|:--|:--|:--|--:|:--|
| `access` | `ASC-Access` | Your team | 17 | sandbox, user-invitations, user-management |
| `analytics` | `ASC-Analytics` | Sales and reports | 19 | — |
| `app-clips` | `ASC-AppClips` | App Clips | 34 | — |
| `background-assets` | `ASC-BackgroundAssets` | Downloadable content | 13 | — |
| `distribution` | `ASC-Distribution` | Releases | 80 | app-encryption, app-review-information, builds, dma-distribution, phased-releases, publish, version |
| `game-center` | `ASC-GameCenter` | Game Center | 149 | achievements, activities, challenges, groups, leaderboards, matchmaking, setup |
| `general` | `ASC-General` | App details | 49 | android-link, app-accessibility, app-availabilities, app-categories, app-information, app-tags, legal |
| `marketing` | `ASC-Marketing` | Store page and reviews | 61 | app-events, custom-pp, customer-reviews, nominations, pp-optimization |
| `monetization` | `ASC-Monetization` | Prices and subscriptions | 162 | app-price, iap-offers, in-app-purchases, plan-promote, subscription, subscription-codes, subscription-offers, subscription-win-back, transactions |
| `provisioning` | `ASC-Provisioning` | Certificates and devices | 41 | bundle, certificates, devices, profiles, wallet |
| `testflight` | `ASC-TestFlight` | Beta testing | 82 | external-testing, feedbacks, groups, test-builds, testers |
| `webhooks` | `ASC-Webhooks` | Notifications to your server | 9 | — |
| `xcode-cloud` | `ASC-XcodeCloud` | Builds in the cloud | 44 | repositories, workflows |
| `core` | `ASC-Core` | Added with every profile: app lookup and screenshots | 16 | — |

## ASC-Core

Setup and `register` add ASC-Core on their own whenever they add a profile, and remove it when no profile is left. You never pick it.

- **It follows your strictest setting.** If any Heimdall server in an AI app runs `--read-only`, ASC-Core is registered read-only too.
- **It is left out when the account is unclear.** Setup does not add ASC-Core to an AI app, and says why, when the servers there use different App Store Connect accounts, when one carries credentials of its own in its `env`, or when the settings, or one entry, cannot be read in full (an entry that loads an `envFile` counts).
- **An AI app that runs only one server** can fold it in with `--with-core`. The Xcode plug-ins do this.

Its media tools (`media__*`) handle every screenshot, video, image and file. Store page media goes through your app's image and video library: you upload a file to the library and place it on the version page, a custom product page, a product page test or an in-app event. Other images and files go straight to their owner: App Clip, Game Center, in-app purchase and subscription images, review screenshots and attachments, encryption documents, routing coverage, background asset and build upload files. Every target is in [Media targets](MEDIA_TARGETS_en.md).

### `core` · 16 tools

- `actors__get` — Shows who, or which service, performed an action
- `actors__list` — Shows which person or service the given IDs belong to
- `apps__app_store_versions__list` — Lists the app's store versions
- `apps__builds__list` — Lists the app's uploaded builds
- `apps__get` — Fetches an app's details
- `apps__in_app_purchases_v2__list` — Lists the products sold inside the app
- `apps__list` — Lists the apps on the account
- `apps__subscription_groups__list` — Lists the app's subscription groups
- `asc__account_status` — Shows the apps' release status and the next step
- `asc__discover_domains` — Shows the tool areas available
- `asc__search_tools` — Searches tools, including the ones not loaded
- `asc__status` — Checks the connection and the credentials
- `media__arrange` — Orders images, places them on a page or removes them, sets the poster frame, archives and renames
- `media__delete` — Deletes the chosen images or videos from their target; checks ownership first and shows them by name
- `media__list` — Lists the images and videos on the version page, custom product pages, product page tests, in-app events and the library, or the files of an image or file target (in-app purchase image, review screenshot, build file…), with their IDs and states
- `media__upload` — Uploads an image or video to the library and, if asked, places it on a page; or uploads to an image or file target (in-app purchase image, review screenshot, build file…)

## Sub-profiles

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/app-store-connect-mcp/main/assets/setup-web-step1.png" alt="The browser setup, step 1: each profile with its tool count and token cost; Monetization is open, with two of its sub-profiles ticked" width="560">

Tick a profile in the [setup](SETUP_en.md) picker. When you move the cursor onto it, its sub-profiles open, all ticked; untick the ones you don't want.
For example, `monetization` has 162 tools, but if you only work on subscriptions and their offers, the 65 tools in `monetization:subscription,subscription-offers` are enough. Either way, the server is still called `ASC-Monetization`.

The tool counts on this page are what the server lists: its own tools plus `asc__status`. A server started with only some of its sub-profiles also gets `asc__call` and `asc__describe`, which reach the reads of the parts you left out.

> [!TIP]
> To see which profiles are installed, ask the AI: *"Which profiles are installed?"*

## Starter packs

A quick answer to "Which profiles should I install?" The counts include ASC-Core's 16 tools.

| Role | Install | Tools |
|:--|:--|--:|
| Release manager | `distribution` + `general` | 145 |
| ASO / marketing | `marketing` + `analytics` | 96 |
| QA / TestFlight | `testflight` | 98 |
| Monetization | `monetization` | 178 |
| Game developer | `game-center` + `distribution:version,publish` | 200 |
| Customer support | `marketing:customer-reviews` + `monetization:transactions` | 51 |
| Build and signing | `provisioning` + `xcode-cloud` | 101 |
| Team admin | `access` | 33 |

> [!TIP]
> Start narrow. Skipping a profile costs you nothing. Every tool you install is described to the AI again in every conversation, so fewer tools means faster and cheaper.
> If you need a tool you skipped, ask the AI; it tells you which profile has it and how to add it.

## Every profile

Each profile with what it holds, when you need it, the narrowest [key role](ROLES_en.md) that covers it, and its tools.

### `access` · 17 tools

**Server:** `ASC-Access` · **Key role:** Admin

**What is inside:** Your App Store Connect team: members and roles, invitations, sandbox test accounts.

**When you need it:** Invite people to your team, set their roles, and manage sandbox test accounts.

#### `access:sandbox` · 6 tools

**What is inside:** Sandbox test accounts for in-app purchase testing, and clearing their purchase history.

**When you need it:** Sandbox Apple Accounts for testing purchases, and clearing their history. · **Key role:** App Manager

- `sandbox_testers_clear_purchase_history_request_v2__create` — Clears the purchase history of sandbox test accounts
- `sandbox_testers_v2__list` — Lists the accounts used for testing purchases
- `sandbox_testers_v2__update` — Changes a sandbox account's country, purchase interruptions and subscription renewal rate

#### `access:user-invitations` · 8 tools

**What is inside:** Invite people to the team and manage pending invitations.

**When you need it:** Invite someone to your team and see who has not accepted yet. · **Key role:** Admin

- `user_invitations__create` — Invites someone to the App Store Connect team with the chosen role and app access
- `user_invitations__delete` — Cancels a team invitation
- `user_invitations__get` — Shows the details of a team invitation
- `user_invitations__list` — Lists team invitations
- `user_invitations__visible_apps__list` — Lists the apps the invited person will be able to see

#### `access:user-management` · 11 tools

**What is inside:** Team members, their roles and which apps they can see.

**When you need it:** Who is on your team, what role they have and which apps they see. · **Key role:** Admin

- `users__delete` — Removes someone from the team
- `users__get` — Shows a team member's details
- `users__list` — Lists team members
- `users__update` — Changes a team member's roles and access
- `users__visible_apps__add` — Gives a team member access to the chosen apps
- `users__visible_apps__list` — Lists the apps a team member can see
- `users__visible_apps__remove` — Removes a team member's access to the chosen apps
- `users__visible_apps__replace` — Replaces the list of apps a team member can see

### `analytics` · 19 tools

**Server:** `ASC-Analytics` · **Key role:** Sales

**What is inside:** Sales and finance reports, analytics report requests, performance and diagnostic data — for questions about downloads, revenue and crashes.

**When you need it:** Downloads, sales, proceeds and how the app performs.

- `analytics_report_instances__get` — Shows the period and date of a report prepared on a given date
- `analytics_report_instances__segments__list` — Lists the downloadable parts of a report prepared on a given date
- `analytics_report_requests__create` — Asks for a one-time or recurring report for the app
- `analytics_report_requests__delete` — Deletes a report request
- `analytics_report_requests__get` — Shows the status of a report request
- `analytics_report_requests__reports__list` — Lists the report types prepared under a report request
- `analytics_report_segments__get` — Shows a report part's download link and file details
- `analytics_reports__get` — Shows an analytics report's name and type
- `analytics_reports__instances__list` — Lists the copies of a report prepared on different dates
- `apps__analytics_report_requests__list` — Lists the app's report requests
- `apps__perf_power_metrics__list` — Shows the app's speed and battery use measurements
- `apps__performance_overviews__list` — Sums up how fast the app runs and what goes wrong
- `builds__diagnostic_signatures__list` — Groups a build's hangs, launch and disk-write problems by similarity
- `builds__perf_power_metrics__list` — Lists a build's speed and battery use measurements
- `diagnostic_signatures__logs__list` — Fetches the detailed diagnostic logs of a problem group
- `finance_reports__list` — Fetches Apple's payment and proceeds settlement report
- `sales_reports__list` — Fetches the sales and subscription report
- `analytics__get_report` — Downloads the app's analytics report in one step and returns it row by row; does not start a new report request

### `app-clips` · 34 tools

**Server:** `ASC-AppClips` · **Key role:** App Manager

**What is inside:** App Clips: default and advanced experiences, header images, review details, beta invocations. Images are uploaded through ASC-Core's media tools.

**When you need it:** The instant, lightweight version of your app.

- `app_clip_advanced_experiences__create` — Creates an advanced App Clip experience triggered by a location or a code
- `app_clip_advanced_experiences__get` — Fetches the details of an advanced App Clip experience
- `app_clip_advanced_experiences__update` — Updates the settings of an advanced App Clip experience
- `app_clip_app_store_review_details__create` — Saves the links App Review will open the App Clip with
- `app_clip_app_store_review_details__get` — Fetches the links App Review will open the App Clip with
- `app_clip_app_store_review_details__update` — Updates the links App Review will open the App Clip with
- `app_clip_default_experience_localizations__create` — Adds text in a new language to the default App Clip experience
- `app_clip_default_experience_localizations__delete` — Deletes the default App Clip experience's text in one language
- `app_clip_default_experience_localizations__get` — Fetches the default App Clip experience's text in one language
- `app_clip_default_experience_localizations__update` — Updates the default App Clip experience's text in one language
- `app_clip_default_experiences__app_clip_app_store_review_d_0tlnru` — Fetches the links App Review will open for the default App Clip experience
- `app_clip_default_experiences__app_clip_default_experience_02x7wx` — Lists the default App Clip experience's text in every language
- `app_clip_default_experiences__create` — Creates a default App Clip experience for the app
- `app_clip_default_experiences__delete` — Deletes a default App Clip experience
- `app_clip_default_experiences__get` — Fetches the details of the default App Clip experience
- `app_clip_default_experiences__release_with_app_store_vers_0zdb21` — Fetches the store version the default App Clip experience is tied to
- `app_clip_default_experiences__release_with_app_store_vers_0zdbim` — Ties the default App Clip experience to a store version
- `app_clip_default_experiences__update` — Updates the default App Clip experience's action button or settings
- `app_clips__app_clip_advanced_experiences__list` — Lists every advanced experience of an App Clip
- `app_clips__app_clip_default_experiences__list` — Lists every default experience of an App Clip
- `app_clips__get` — Fetches an App Clip's basic details
- `app_store_versions__app_clip_default_experience__get` — Fetches the default App Clip experience assigned to a store version
- `apps__app_clips__list` — Lists every App Clip the app has
- `beta_app_clip_invocation_localizations__create` — Adds a title in one language to a beta App Clip invocation link
- `beta_app_clip_invocation_localizations__delete` — Deletes the title in one language of a beta App Clip invocation link
- `beta_app_clip_invocation_localizations__update` — Updates the title in one language of a beta App Clip invocation link
- `beta_app_clip_invocations__create` — Creates a new App Clip invocation link for TestFlight testers
- `beta_app_clip_invocations__delete` — Deletes a beta App Clip invocation link
- `beta_app_clip_invocations__get` — Fetches the details of a beta App Clip invocation link
- `beta_app_clip_invocations__update` — Updates a beta App Clip invocation link
- `build_bundles__app_clip_domain_cache_status__get` — Fetches the build bundle's App Clip domain cache verification status
- `build_bundles__app_clip_domain_debug_status__get` — Fetches the build bundle's App Clip domain configuration errors
- `build_bundles__beta_app_clip_invocations__list` — Lists the beta App Clip invocation links set on a build bundle

### `background-assets` · 13 tools

**Server:** `ASC-BackgroundAssets` · **Key role:** Developer

**What is inside:** Background Assets (iOS 26): asset packs downloaded outside the app binary, and their releases.

**When you need it:** Content packs your app downloads after it is installed.

- `apps__background_assets__list` — Lists the app's background asset packs
- `background_asset_upload_files__update` — Marks a sent background asset file as uploaded
- `background_asset_version_app_store_releases__get` — Fetches the App Store release status of a background asset version
- `background_asset_version_external_beta_releases__get` — Fetches the external beta release status of a background asset version
- `background_asset_version_internal_beta_releases__get` — Fetches the internal beta release status of a background asset version
- `background_asset_versions__create` — Creates a new version record for background assets
- `background_asset_versions__get` — Fetches the details and status of a background asset version
- `background_assets__create` — Creates a new background asset pack for the app
- `background_assets__get` — Fetches the details of a background asset pack
- `background_assets__update` — Archives a background asset pack or takes it out of the archive
- `background_assets__versions__list` — Lists every version of a background asset
- `release__submit_items` — Sends a background asset version to review

### `distribution` · 80 tools

**Server:** `ASC-Distribution` · **Key role:** App Manager

**What is inside:** Shipping a version: App Store versions and localizations, builds, review details, submission and release, export compliance, EU alternative distribution.

**When you need it:** New versions, builds, sending to review and phased release.

#### `distribution:app-encryption` · 10 tools

**What is inside:** Export compliance: encryption declarations, their documents, and attaching one to a build.

**When you need it:** Answer the export compliance questions for a build. · **Key role:** App Manager

- `app_encryption_declaration_documents__update` — Saves the checksum details of an uploaded encryption document
- `app_encryption_declarations__create` — Creates an encryption declaration for the app
- `app_encryption_declarations__get` — Fetches an encryption declaration's details
- `app_encryption_declarations__list` — Lists encryption declarations
- `apps__app_encryption_declarations__list` — Lists the app's encryption declarations
- `builds__app_encryption_declaration__get` — Fetches the encryption declaration tied to a build
- `builds__app_encryption_declaration__set` — Ties an encryption declaration to a build

#### `distribution:app-review-information` · 8 tools

**What is inside:** What App Review sees: contact info, demo account, review notes and attachments.

**When you need it:** The contact, demo account and notes App Review reads. · **Key role:** App Manager

- `app_store_review_attachments__update` — Saves the checksum details of an uploaded review attachment
- `app_store_review_details__create` — Creates the review contact and access details for a version
- `app_store_review_details__get` — Fetches the review contact and access details
- `app_store_review_details__update` — Updates the review contact and access details
- `app_store_versions__app_store_review_detail__get` — Fetches a version's review contact and access details

#### `distribution:builds` · 13 tools

**What is inside:** Uploaded builds: upload sessions, bundles, file sizes, build details.

**When you need it:** The builds you uploaded, their sizes and details. · **Key role:** Developer

- `apps__build_uploads__list` — Lists the app's build upload records
- `build_bundles__build_bundle_file_sizes__list` — Lists a build bundle's download and install sizes by device and OS version
- `build_upload_files__update` — Saves the checksum details of an uploaded build file
- `build_uploads__get` — Fetches a build upload record
- `builds__app__get` — Fetches the app a build belongs to
- `builds__app_store_version__get` — Fetches the App Store version a build is selected for
- `builds__get` — Fetches a build's details
- `builds__icons__list` — Lists a build's icons
- `builds__list` — Lists uploaded builds
- `builds__update` — Expires a build or records its encryption answer

#### `distribution:dma-distribution` · 25 tools

**What is inside:** Distribution outside the App Store under the EU Digital Markets Act: web distribution domains, alternative marketplace listings, signing keys, packages.

**When you need it:** Selling outside the App Store in the EU: web distribution and marketplaces. · **Key role:** Admin

- `alternative_distribution_domains__create` — Adds a domain for alternative distribution
- `alternative_distribution_domains__delete` — Deletes an alternative distribution domain
- `alternative_distribution_domains__get` — Fetches an alternative distribution domain's details
- `alternative_distribution_domains__list` — Lists alternative distribution domains
- `alternative_distribution_keys__create` — Saves the public key you provide for alternative distribution
- `alternative_distribution_keys__delete` — Deletes an alternative distribution key
- `alternative_distribution_keys__get` — Fetches an alternative distribution key's details
- `alternative_distribution_keys__list` — Lists alternative distribution keys
- `alternative_distribution_package_deltas__get` — Fetches the download link for an alternative distribution delta update
- `alternative_distribution_package_variants__get` — Fetches the download link for an alternative distribution package variant
- `alternative_distribution_package_versions__deltas__list` — Lists a package version's delta updates
- `alternative_distribution_package_versions__get` — Fetches one version of an alternative distribution package
- `alternative_distribution_package_versions__variants__list` — Lists a package version's variants
- `alternative_distribution_packages__create` — Creates an alternative distribution package for a store version
- `alternative_distribution_packages__get` — Fetches an alternative distribution package's details
- `alternative_distribution_packages__versions__list` — Lists an alternative distribution package's versions
- `app_store_versions__alternative_distribution_package__get` — Fetches the alternative distribution package tied to a store version
- `apps__alternative_distribution_key__get` — Fetches the app's alternative distribution key
- `apps__marketplace_search_detail__get` — Fetches the app's marketplace catalog link
- `marketplace_search_details__create` — Sets the search catalog address of an alternative marketplace app
- `marketplace_search_details__delete` — Deletes an alternative marketplace's search catalog address
- `marketplace_search_details__update` — Changes an alternative marketplace's search catalog address

#### `distribution:phased-releases` · 8 tools

**What is inside:** Phased release of a version: start, pause, resume, release to all.

**When you need it:** Release a version gradually, pause it, or release it to everyone. · **Key role:** App Manager

- `app_store_version_phased_releases__create` — Turns on the 7-day phased release for a version; it starts when the version is released
- `app_store_version_phased_releases__delete` — Deletes a version's phased release record
- `app_store_version_phased_releases__update` — Pauses, resumes or completes a phased release
- `app_store_version_release_requests__create` — Releases an approved version right away; cannot be undone
- `app_store_versions__app_store_version_phased_release__get` — Fetches a version's phased release status

#### `distribution:publish` · 14 tools

**What is inside:** Submitting for review and releasing: review submissions and their items, release requests, the one-call submit macro.

**When you need it:** Send a version to App Review and release it once approved. · **Key role:** App Manager

- `app_store_version_release_requests__create` — Releases an approved version right away; cannot be undone
- `apps__review_submissions__list` — Lists the app's review submissions
- `review_submission_items__create` — Adds a product or version to a review submission
- `review_submission_items__delete` — Takes an item out of a submission not yet sent
- `review_submission_items__update` — Marks a submission item resolved or takes it out of the submission
- `review_submissions__create` — Opens an empty review submission for the app
- `review_submissions__get` — Fetches a review submission's status
- `review_submissions__items__list` — Lists the items in a review submission
- `review_submissions__list` — Lists review submissions
- `review_submissions__update` — Sends a review submission or withdraws it
- `release__submit` — Checks the version and sends it to App Review

#### `distribution:version` · 24 tools

**What is inside:** App Store versions and their localizations: what is new, keywords, the version preflight and the translation tools. Screenshots and previews go through ASC-Core's media tools.

**When you need it:** Create a version, write What’s New and keywords, translate them. · **Key role:** App Manager

- `app_store_version_localizations__create` — Creates a version's store text in one language
- `app_store_version_localizations__delete` — Deletes a version's store text in one language
- `app_store_version_localizations__get` — Fetches a version's store text in one language
- `app_store_version_localizations__search_keywords__add` — Adds search keywords to one language of a version
- `app_store_version_localizations__search_keywords__list` — Lists the search keywords in one language of a version
- `app_store_version_localizations__search_keywords__remove` — Removes search keywords from one language of a version
- `app_store_version_localizations__update` — Updates a version's store text in one language
- `app_store_versions__app_store_review_detail__get` — Fetches a version's review contact and access details
- `app_store_versions__app_store_version_localizations__list` — Lists a version's store text in every language
- `app_store_versions__build__get` — Fetches the build selected for a version
- `app_store_versions__build__set` — Selects the build for a version
- `app_store_versions__create` — Creates a new store version
- `app_store_versions__delete` — Deletes a store version
- `app_store_versions__get` — Fetches a store version's details
- `app_store_versions__update` — Updates a version's number, copyright, release type and earliest release date
- `apps__search_keywords__list` — Lists the app's search keywords
- `listing__diff_metadata` — Compares the store text of the live version and the one being prepared
- `metadata_ai__apply_localizations` — Applies the store text from a prepared file to the chosen languages as is
- `metadata_ai__audit_localizations` — Shows missing languages and length problems in the store text
- `metadata_ai__draft_translation` — Helps draft store text for the languages asked for
- `preflight__check_version` — Checks whether a version is ready to send to review

### `game-center` · 149 tools

**Server:** `ASC-GameCenter` · **Key role:** App Manager

**What is inside:** Game Center: achievements, leaderboards, activities, challenges, groups, matchmaking.

**When you need it:** Achievements, leaderboards and challenges.

#### `game-center:achievements` · 20 tools

**What is inside:** Achievements: versions, localizations, images, player submissions. Images are uploaded through ASC-Core's media tools.

**When you need it:** Create achievements, their text and images. · **Key role:** App Manager

- `apps__game_center_detail__get` — Shows the app's Game Center record
- `game_center_achievement_localizations_v2__create` — Adds an achievement version's name and before/after descriptions in one language
- `game_center_achievement_localizations_v2__delete` — Deletes an achievement's text in one language
- `game_center_achievement_localizations_v2__get` — Shows an achievement's text in one language
- `game_center_achievement_localizations_v2__update` — Changes an achievement's text in one language
- `game_center_achievement_versions_v2__create` — Starts a new version of an achievement
- `game_center_achievement_versions_v2__get` — Shows the details of an achievement version
- `game_center_achievement_versions_v2__localizations__list` — Lists the text in every language of an achievement version
- `game_center_achievements_v2__create` — Adds a new achievement to the game
- `game_center_achievements_v2__delete` — Deletes an achievement
- `game_center_achievements_v2__get` — Shows an achievement's details
- `game_center_achievements_v2__update` — Changes an achievement's settings
- `game_center_achievements_v2__versions__list` — Lists every version of an achievement
- `game_center_details__game_center_achievements_v2__list` — Lists every achievement of the app
- `game_center_details__game_center_achievements_v2__replace` — Sets the app's list of achievements and their order from scratch
- `game_center_player_achievement_submissions__create` — Sends achievement progress on behalf of a player
- `release__submit_items` — Sends an achievement version to review

#### `game-center:activities` · 25 tools

**What is inside:** Activities: versions, localizations, images, and the achievements and leaderboards they link. Images are uploaded through ASC-Core's media tools.

**When you need it:** Activities players can jump into, and what they link to. · **Key role:** App Manager

- `apps__game_center_detail__get` — Shows the app's Game Center record
- `game_center_activities__achievements_v2__add` — Links achievements to a game activity
- `game_center_activities__achievements_v2__remove` — Unlinks achievements from a game activity
- `game_center_activities__create` — Adds a new activity to the game
- `game_center_activities__delete` — Deletes a game activity
- `game_center_activities__get` — Shows a game activity's details
- `game_center_activities__leaderboards_v2__add` — Links leaderboards to a game activity
- `game_center_activities__leaderboards_v2__remove` — Unlinks leaderboards from a game activity
- `game_center_activities__update` — Changes a game activity's settings
- `game_center_activities__versions__list` — Lists every version of a game activity
- `game_center_activity_localizations__create` — Adds an activity's text in one language
- `game_center_activity_localizations__delete` — Deletes an activity's text in one language
- `game_center_activity_localizations__get` — Shows an activity's text in one language
- `game_center_activity_localizations__update` — Changes an activity's text in one language
- `game_center_activity_versions__create` — Starts a new version of an activity
- `game_center_activity_versions__get` — Shows the details of an activity version
- `game_center_activity_versions__localizations__list` — Lists the text in every language of an activity version
- `game_center_activity_versions__update` — Changes an activity version's fallback URL
- `game_center_details__game_center_achievements_v2__list` — Lists every achievement of the app
- `game_center_details__game_center_activities__list` — Lists every game activity of the app
- `game_center_details__game_center_leaderboards_v2__list` — Lists every leaderboard of the app
- `release__submit_items` — Sends a Game Center activity version to review

#### `game-center:challenges` · 21 tools

**What is inside:** Challenges: versions, localizations, images, and the leaderboard each uses. Images are uploaded through ASC-Core's media tools.

**When you need it:** Challenges players send each other. · **Key role:** App Manager

- `apps__game_center_detail__get` — Shows the app's Game Center record
- `game_center_challenge_localizations__create` — Adds a challenge's text in one language
- `game_center_challenge_localizations__delete` — Deletes a challenge's text in one language
- `game_center_challenge_localizations__get` — Shows a challenge's text in one language
- `game_center_challenge_localizations__update` — Changes a challenge's text in one language
- `game_center_challenge_versions__create` — Starts a new version of a challenge
- `game_center_challenge_versions__get` — Shows the details of a challenge version
- `game_center_challenge_versions__localizations__list` — Lists the text in every language of a challenge version
- `game_center_challenges__create` — Adds a new challenge to the game
- `game_center_challenges__delete` — Deletes a challenge
- `game_center_challenges__get` — Shows a challenge's details
- `game_center_challenges__leaderboard_v2__set` — Ties a challenge to a leaderboard
- `game_center_challenges__update` — Changes a challenge's settings
- `game_center_challenges__versions__list` — Lists every version of a challenge
- `game_center_details__challenges_minimum_platform_versions_0qiwrq` — Sets the lowest app versions that challenges open on
- `game_center_details__game_center_challenges__list` — Lists every challenge of the app
- `game_center_details__game_center_leaderboards_v2__list` — Lists every leaderboard of the app
- `release__submit_items` — Sends a challenge version to review

#### `game-center:groups` · 18 tools

**What is inside:** Game Center groups sharing achievements and leaderboards across apps.

**When you need it:** Share achievements and leaderboards across several of your games. · **Key role:** App Manager

- `game_center_details__game_center_group__get` — Shows the shared game group the app belongs to
- `game_center_groups__create` — Creates a game group several apps will share
- `game_center_groups__delete` — Deletes a game group
- `game_center_groups__game_center_achievements_v2__list` — Lists the achievements in a game group
- `game_center_groups__game_center_achievements_v2__replace` — Sets a game group's list of achievements from scratch
- `game_center_groups__game_center_activities__list` — Lists the activities in a game group
- `game_center_groups__game_center_challenges__list` — Lists the challenges in a game group
- `game_center_groups__game_center_details__list` — Lists the apps that belong to a game group
- `game_center_groups__game_center_leaderboard_sets_v2__list` — Lists the leaderboard sets in a game group
- `game_center_groups__game_center_leaderboard_sets_v2__replace` — Sets a game group's leaderboard sets from scratch
- `game_center_groups__game_center_leaderboards_v2__list` — Lists the leaderboards in a game group
- `game_center_groups__game_center_leaderboards_v2__replace` — Sets a game group's leaderboards from scratch
- `game_center_groups__get` — Shows a game group's details
- `game_center_groups__list` — Lists every game group on the account
- `game_center_groups__update` — Changes a game group's name

#### `game-center:leaderboards` · 44 tools

**What is inside:** Leaderboards and leaderboard sets: versions, localizations, images, score submissions and moderation. Images are uploaded through ASC-Core's media tools.

**When you need it:** Leaderboards and sets of them, and moderating scores. · **Key role:** App Manager

- `apps__game_center_detail__get` — Shows the app's Game Center record
- `game_center_details__game_center_leaderboard_sets_v2__list` — Lists every leaderboard set of the app
- `game_center_details__game_center_leaderboard_sets_v2__replace` — Sets the app's leaderboard sets and their order from scratch
- `game_center_details__game_center_leaderboards_v2__list` — Lists every leaderboard of the app
- `game_center_details__game_center_leaderboards_v2__replace` — Sets the app's leaderboards and their order from scratch
- `game_center_leaderboard_entry_submissions__create` — Sends a score to a leaderboard on behalf of a player
- `game_center_leaderboard_localizations_v2__create` — Adds a leaderboard's text in one language
- `game_center_leaderboard_localizations_v2__delete` — Deletes a leaderboard's text in one language
- `game_center_leaderboard_localizations_v2__get` — Shows a leaderboard's text in one language
- `game_center_leaderboard_localizations_v2__update` — Changes a leaderboard's text in one language
- `game_center_leaderboard_set_localizations_v2__create` — Adds a leaderboard set's name in one language
- `game_center_leaderboard_set_localizations_v2__delete` — Deletes a leaderboard set's name in one language
- `game_center_leaderboard_set_localizations_v2__get` — Shows a leaderboard set's name in one language
- `game_center_leaderboard_set_localizations_v2__update` — Changes a leaderboard set's name in one language
- `game_center_leaderboard_set_member_localizations__create` — Adds the set-specific name of a leaderboard inside a set
- `game_center_leaderboard_set_member_localizations__delete` — Deletes the set-specific name of a leaderboard inside a set
- `game_center_leaderboard_set_member_localizations__list` — Lists the set-specific names of the leaderboards in a set
- `game_center_leaderboard_set_member_localizations__update` — Changes the set-specific name of a leaderboard inside a set
- `game_center_leaderboard_set_versions_v2__create` — Starts a new version of a leaderboard set
- `game_center_leaderboard_set_versions_v2__get` — Shows the details of a leaderboard set version
- `game_center_leaderboard_set_versions_v2__localizations__list` — Lists the text in every language of a leaderboard set version
- `game_center_leaderboard_sets_v2__create` — Creates a new set that groups leaderboards together
- `game_center_leaderboard_sets_v2__delete` — Deletes a leaderboard set
- `game_center_leaderboard_sets_v2__game_center_leaderboards__add` — Adds leaderboards to a set
- `game_center_leaderboard_sets_v2__game_center_leaderboards__list` — Lists the leaderboards in a set
- `game_center_leaderboard_sets_v2__game_center_leaderboards_1p2z7u` — Removes leaderboards from a set
- `game_center_leaderboard_sets_v2__game_center_leaderboards_0qhppm` — Sets the leaderboards in a set and their order from scratch
- `game_center_leaderboard_sets_v2__get` — Shows a leaderboard set's details
- `game_center_leaderboard_sets_v2__update` — Changes a leaderboard set's name
- `game_center_leaderboard_sets_v2__versions__list` — Lists every version of a leaderboard set
- `game_center_leaderboard_versions_v2__create` — Starts a new version of a leaderboard
- `game_center_leaderboard_versions_v2__get` — Shows the details of a leaderboard version
- `game_center_leaderboard_versions_v2__localizations__list` — Lists the text in every language of a leaderboard version
- `game_center_leaderboards_v2__create` — Adds a new leaderboard to the game
- `game_center_leaderboards_v2__delete` — Deletes a leaderboard
- `game_center_leaderboards_v2__game_center_score_moderations__list` — Lists a leaderboard's scores for moderation
- `game_center_leaderboards_v2__get` — Shows a leaderboard's details
- `game_center_leaderboards_v2__update` — Changes a leaderboard's settings
- `game_center_leaderboards_v2__versions__list` — Lists every version of a leaderboard
- `game_center_score_moderations__update` — Hides a suspicious score or shows it again
- `release__submit_items` — Sends a leaderboard or leaderboard set version to review

#### `game-center:matchmaking` · 34 tools

**What is inside:** Matchmaking queues, rule sets, rules, teams, rule set tests.

**When you need it:** Matchmaking queues and the rules that pair players. · **Key role:** App Manager

- `apps__game_center_detail__get` — Shows the app's Game Center record
- `game_center_details__classic_matchmaking_requests__metrics` — Shows outcome and wait-time statistics for classic matchmaking requests
- `game_center_details__rule_based_matchmaking_requests__metrics` — Shows outcome and wait-time statistics for rule-based matchmaking requests
- `game_center_matchmaking_queues__create` — Creates a new queue for matching players
- `game_center_matchmaking_queues__delete` — Deletes a matchmaking queue
- `game_center_matchmaking_queues__experiment_matchmaking_qu_01763h` — Shows statistics on how many requests wait in the queue under an experiment rule
- `game_center_matchmaking_queues__experiment_matchmaking_re_10te51` — Shows statistics on the match requests that reach an experiment rule
- `game_center_matchmaking_queues__get` — Shows a matchmaking queue's details
- `game_center_matchmaking_queues__list` — Lists every matchmaking queue
- `game_center_matchmaking_queues__matchmaking_queue_sizes__metrics` — Shows statistics on how many requests wait in the queue
- `game_center_matchmaking_queues__matchmaking_requests__metrics` — Shows statistics on the match requests that reach the queue
- `game_center_matchmaking_queues__matchmaking_sessions__metrics` — Shows session count and player statistics for matchmaking sessions
- `game_center_matchmaking_queues__update` — Changes a matchmaking queue's settings
- `game_center_matchmaking_rule_set_tests__create` — Tries matchmaking rules against sample player requests
- `game_center_matchmaking_rule_sets__create` — Creates a new matchmaking rule set
- `game_center_matchmaking_rule_sets__delete` — Deletes a matchmaking rule set
- `game_center_matchmaking_rule_sets__get` — Shows a matchmaking rule set's details
- `game_center_matchmaking_rule_sets__list` — Lists every matchmaking rule set
- `game_center_matchmaking_rule_sets__matchmaking_queues__list` — Lists the matchmaking queues that use a rule set
- `game_center_matchmaking_rule_sets__rules__list` — Lists the rules in a rule set
- `game_center_matchmaking_rule_sets__teams__list` — Lists the teams in a rule set
- `game_center_matchmaking_rule_sets__update` — Changes a matchmaking rule set
- `game_center_matchmaking_rules__create` — Adds a new matchmaking rule to a rule set
- `game_center_matchmaking_rules__delete` — Deletes a matchmaking rule
- `game_center_matchmaking_rules__matchmaking_boolean_rule_r_1yg7b0` — Shows result statistics for a yes/no rule
- `game_center_matchmaking_rules__matchmaking_number_rule_re_1u0ixh` — Shows result statistics for a rule that produces a number
- `game_center_matchmaking_rules__matchmaking_rule_errors__metrics` — Shows error count statistics for a rule
- `game_center_matchmaking_rules__update` — Changes a matchmaking rule
- `game_center_matchmaking_teams__create` — Adds a new team to a rule set
- `game_center_matchmaking_teams__delete` — Deletes a matchmaking team
- `game_center_matchmaking_teams__update` — Changes a matchmaking team's settings

#### `game-center:setup` · 18 tools

**What is inside:** Turning Game Center on for an app: its Game Center detail, app versions, blocked players.

**When you need it:** Turn Game Center on for an app and its versions. · **Key role:** App Manager

- `app_store_versions__game_center_app_version__get` — Shows the game settings tied to an app version
- `apps__game_center_detail__get` — Shows the app's Game Center record
- `game_center_app_versions__app_store_version__get` — Shows which app version a game settings version is tied to
- `game_center_app_versions__compatibility_versions__add` — Adds older app versions players can play together with
- `game_center_app_versions__compatibility_versions__list` — Lists the app versions players can play together with
- `game_center_app_versions__compatibility_versions__remove` — Removes one of the versions players can play together with
- `game_center_app_versions__create` — Creates a game settings version for an app version
- `game_center_app_versions__get` — Shows a game settings version's details
- `game_center_app_versions__update` — Turns a game settings version on or off
- `game_center_detail_players__update` — Blocks a player or unblocks them
- `game_center_details__blocked_players__list` — Lists blocked players
- `game_center_details__create` — Turns Game Center on for the app
- `game_center_details__game_center_app_versions__list` — Lists the app's game settings versions
- `game_center_details__get` — Shows the details of the app's game settings
- `game_center_details__update` — Turns challenges on or off, and picks the default leaderboard and game group

### `general` · 49 tools

**Server:** `ASC-General` · **Key role:** App Manager

**What is inside:** The app's identity and store facts: names and subtitles, categories, availability by country, age rating, EULA, accessibility labels, tags.

**When you need it:** Name, category, age rating and the countries your app is sold in.

#### `general:android-link` · 8 tools

**What is inside:** Mapping an Android app to its iOS counterpart for migration.

**When you need it:** Link your Android app so people moving to iPhone find this one. · **Key role:** App Manager

- `android_to_ios_app_mapping_details__create` — Creates a mapping record between an Android and an iOS app
- `android_to_ios_app_mapping_details__delete` — Deletes an Android-to-iOS app mapping record
- `android_to_ios_app_mapping_details__get` — Fetches the details of an Android-to-iOS app mapping record
- `android_to_ios_app_mapping_details__update` — Updates an Android-to-iOS app mapping record
- `apps__android_to_ios_app_mapping_details__list` — Lists the Android-to-iOS mapping records tied to the app

#### `general:app-accessibility` · 8 tools

**What is inside:** Accessibility nutrition labels: which features the app supports, per device.

**When you need it:** Which accessibility features your app supports, per device. · **Key role:** App Manager

- `accessibility_declarations__create` — Declares the accessibility features supported on one device type
- `accessibility_declarations__delete` — Deletes one of the app's accessibility declarations
- `accessibility_declarations__get` — Fetches the details of an accessibility declaration
- `accessibility_declarations__update` — Updates the supported accessibility features or publishes the declaration on the store
- `apps__accessibility_declarations__list` — Lists every accessibility declaration of the app

#### `general:app-availabilities` · 10 tools

**What is inside:** Which countries the app is sold in, pre-orders, territory availability.

**When you need it:** The countries your app is sold in, and pre-orders. · **Key role:** App Manager

- `app_availabilities_v2__create` — Creates the availability plan that sets which countries the app is offered in
- `app_availabilities_v2__get` — Fetches the details of the app's country availability plan
- `app_availabilities_v2__territory_availabilities__list` — Lists the app's sales and distribution status per country
- `apps__app_availability_v2__get` — Fetches the app's current country availability setup
- `end_app_availability_pre_orders__create` — Ends a pre-order and puts the app on sale in those countries right away
- `territories__list` — Lists every country and region the App Store supports
- `territory_availabilities__update` — Updates the app's sales and pre-order settings in one country

#### `general:app-categories` · 15 tools

**What is inside:** Primary and secondary categories and subcategories.

**When you need it:** The category and subcategory your app is listed under. · **Key role:** App Manager

- `app_categories__get` — Fetches the details of an app category
- `app_categories__list` — Lists the App Store's app categories
- `app_categories__parent__get` — Fetches the main category a subcategory belongs to
- `app_categories__subcategories__list` — Lists every subcategory of a main category
- `app_infos__primary_category__get` — Fetches the app's chosen primary category
- `app_infos__primary_subcategory_one__get` — Fetches the first subcategory of the app's primary category
- `app_infos__primary_subcategory_two__get` — Fetches the second subcategory of the app's primary category
- `app_infos__secondary_category__get` — Fetches the app's chosen secondary category
- `app_infos__secondary_subcategory_one__get` — Fetches the first subcategory of the app's secondary category
- `app_infos__secondary_subcategory_two__get` — Fetches the second subcategory of the app's secondary category
- `app_infos__update` — Updates the app's primary and secondary category choices
- `apps__app_infos__list` — Lists the app's live and in-preparation app info records

#### `general:app-information` · 11 tools

**What is inside:** App info and its localizations: name, subtitle, privacy policy URL.

**When you need it:** App name, subtitle and privacy policy link, per language. · **Key role:** App Manager

- `app_info_localizations__create` — Adds the app name, subtitle and privacy text for one language
- `app_info_localizations__delete` — Deletes the app's name, subtitle and privacy text in one language
- `app_info_localizations__get` — Fetches the app's name, subtitle and privacy text in one language
- `app_info_localizations__update` — Updates the app's name, subtitle and privacy text in one language
- `app_infos__app_info_localizations__list` — Lists the app name and subtitle records in every language
- `app_infos__get` — Fetches the app info record (state, category and age rating links)
- `apps__app_infos__list` — Lists the app's live and in-preparation app info records
- `apps__update` — Updates the app's primary language, content rights declaration, subscription notification URLs and accessibility link

#### `general:app-tags` · 6 tools

**What is inside:** The tags Apple assigns to an app, and hiding ones that do not fit.

**When you need it:** The tags the App Store shows for your app. · **Key role:** App Manager

- `app_tags__territories__list` — Lists the countries an app tag applies in
- `app_tags__update` — Updates whether an app tag shows on the store
- `apps__app_tags__list` — Lists the tags assigned to the app

#### `general:legal` · 13 tools

**What is inside:** Age rating declaration and the end user license agreement.

**When you need it:** The age rating questionnaire and your license agreement. · **Key role:** App Manager

- `age_rating_declarations__update` — Updates the app's age rating and content questionnaire answers
- `app_infos__age_rating_declaration__get` — Fetches the app's age rating questionnaire answers
- `app_infos__territory_age_ratings__list` — Lists the app's official age ratings by country
- `apps__app_infos__list` — Lists the app's live and in-preparation app info records
- `apps__end_user_license_agreement__get` — Fetches the custom end user license agreement assigned to the app
- `end_user_license_agreements__create` — Creates a custom end user license agreement for the app
- `end_user_license_agreements__delete` — Deletes the app's custom end user license agreement
- `end_user_license_agreements__get` — Fetches the text and details of the custom end user license agreement
- `end_user_license_agreements__territories__list` — Lists the countries the custom license agreement applies in
- `end_user_license_agreements__update` — Updates the custom license agreement's text or the countries it applies in

### `marketing` · 61 tools

**Server:** `ASC-Marketing` · **Key role:** Marketing

**What is inside:** Store presence beyond the version page: custom product pages, product page optimization, in-app events, customer reviews, nominations.

**When you need it:** Product pages, in-app events, A/B tests and customer reviews.

#### `marketing:app-events` · 14 tools

**What is inside:** In-app events and their localizations. Their images and videos go through ASC-Core's media tools.

**When you need it:** In-app events and their text in every language. · **Key role:** Marketing

- `app_event_localizations__create` — Adds an event's name and description in the chosen language
- `app_event_localizations__delete` — Deletes an event's text in the chosen language
- `app_event_localizations__get` — Shows an event's text in the chosen language
- `app_event_localizations__update` — Changes an event's name and descriptions in the chosen language
- `app_events__create` — Creates an in-app event to show on the App Store
- `app_events__delete` — Deletes an in-app event
- `app_events__get` — Shows an in-app event's details
- `app_events__localizations__list` — Lists an event's text in every language
- `app_events__update` — Changes an event's dates, countries and promotional details
- `apps__app_events__list` — Lists the app's events
- `release__submit_items` — Sends an in-app event to review

#### `marketing:custom-pp` · 21 tools

**What is inside:** Custom product pages: versions, localizations, keywords. Screenshots and previews go through ASC-Core's media tools.

**When you need it:** Extra versions of your product page for ads and links. · **Key role:** Marketing

- `app_custom_product_page_localizations__create` — Adds promotional text in the chosen language to a custom product page
- `app_custom_product_page_localizations__delete` — Deletes a custom product page's record in the chosen language
- `app_custom_product_page_localizations__get` — Shows a custom product page's details in the chosen language
- `app_custom_product_page_localizations__search_keywords__add` — Ties search keywords to the chosen language of a custom product page
- `app_custom_product_page_localizations__search_keywords__list` — Lists the search keywords tied to the chosen language of a custom product page
- `app_custom_product_page_localizations__search_keywords__remove` — Unties search keywords from the chosen language of a custom product page
- `app_custom_product_page_localizations__update` — Changes a custom product page's promotional text in the chosen language
- `app_custom_product_page_versions__app_custom_product_page_065izt` — Lists a custom product page version's records in every language
- `app_custom_product_page_versions__create` — Creates a new version of a custom product page
- `app_custom_product_page_versions__get` — Shows a custom product page version's details
- `app_custom_product_page_versions__update` — Changes the app link a custom product page opens
- `app_custom_product_pages__app_custom_product_page_versions__list` — Lists a custom product page's versions
- `app_custom_product_pages__create` — Creates a custom product page for the app
- `app_custom_product_pages__delete` — Deletes a custom product page
- `app_custom_product_pages__get` — Shows a custom product page's details
- `app_custom_product_pages__update` — Changes a custom product page's name and visibility
- `apps__app_custom_product_pages__list` — Lists the app's custom product pages
- `release__submit_items` — Sends a custom product page version to review

#### `marketing:customer-reviews` · 14 tools

**What is inside:** Customer reviews, responses, summaries, and the AI triage and reply-draft tools.

**When you need it:** Read reviews, draft and post replies. · **Key role:** Customer Support

- `app_store_versions__customer_reviews__list` — Lists the customer reviews written for one version of the app
- `apps__customer_review_summarizations__list` — Lists the summaries of customer reviews Apple prepares
- `apps__customer_reviews__list` — Lists the customer reviews written for the app
- `customer_review_responses__create` — Posts a reply to a customer review
- `customer_review_responses__delete` — Deletes the reply to a customer review
- `customer_review_responses__get` — Shows the details of the reply to a customer review
- `customer_reviews__get` — Shows the details of a customer review
- `customer_reviews__response__get` — Shows the reply to a customer review
- `reviews_ai__daily_briefing` — Gathers recent reviews and the rating trend for a summary
- `reviews_ai__draft_response` — Fetches one customer review for drafting a reply
- `reviews_ai__triage` — Gathers recent reviews for sorting by topic

#### `marketing:nominations` · 8 tools

**What is inside:** Nominations submitted to Apple for editorial featuring.

**When you need it:** Ask Apple to feature an app or event. · **Key role:** Marketing

- `nominations__create` — Creates a nomination for App Store featuring; sends it right away if asked
- `nominations__delete` — Deletes an App Store featuring nomination
- `nominations__get` — Shows the details of an App Store featuring nomination
- `nominations__list` — Lists App Store featuring nominations
- `nominations__update` — Edits, sends or archives a featuring nomination

#### `marketing:pp-optimization` · 20 tools

**What is inside:** Product page optimization: experiments, treatments and their localizations, promotions.

**When you need it:** A/B test your product page’s icon, screenshots and previews. · **Key role:** Marketing

- `app_store_version_experiment_treatment_localizations__create` — Adds a language to a treatment in a product page test
- `app_store_version_experiment_treatment_localizations__delete` — Deletes a treatment's language record in a product page test
- `app_store_version_experiment_treatment_localizations__get` — Shows a treatment's language record in a product page test
- `app_store_version_experiment_treatments__app_store_versio_0qaej7` — Lists a treatment's language records in a product page test
- `app_store_version_experiment_treatments__create` — Creates a new treatment for a product page test
- `app_store_version_experiment_treatments__delete` — Deletes a treatment in a product page test
- `app_store_version_experiment_treatments__get` — Shows the details of a treatment in a product page test
- `app_store_version_experiment_treatments__update` — Changes the name and icon of a treatment in a product page test
- `app_store_version_experiments_v2__app_store_version_exper_0b7r4g` — Lists a product page test's treatments
- `app_store_version_experiments_v2__create` — Creates a test that compares different versions of the product page
- `app_store_version_experiments_v2__delete` — Deletes a product page test
- `app_store_version_experiments_v2__get` — Shows a product page test's details
- `app_store_version_experiments_v2__update` — Changes a product page test's settings and whether it runs
- `app_store_version_promotions__create` — Makes the treatment chosen in a product page test the version's main page
- `app_store_versions__app_store_version_experiments_v2__list` — Lists the product page tests tied to an app version
- `apps__app_store_version_experiments_v2__list` — Lists the app's product page tests
- `release__submit_items` — Sends a product page test to review

### `monetization` · 162 tools

**Server:** `ASC-Monetization` · **Key role:** App Manager

**What is inside:** Money: subscriptions, in-app purchases, offers and codes, app pricing, StoreKit 2 transactions.

**When you need it:** Subscriptions, in-app purchases, offers and prices.

#### `monetization:app-price` · 14 tools

**What is inside:** The app's own price schedule and price points (not in-app purchases).

**When you need it:** What the app itself costs, per country. · **Key role:** App Manager

- `app_price_points_v3__equalizations__list` — Lists what the app's price comes to in other countries
- `app_price_points_v3__get` — Shows the details of a price the app can be set to
- `app_price_schedules__automatic_prices__list` — Lists the app prices Apple sets per country
- `app_price_schedules__base_territory__get` — Shows the country the app's prices are based on
- `app_price_schedules__create` — Sets the app's prices by country and date
- `app_price_schedules__get` — Shows the app's price schedule details
- `app_price_schedules__manual_prices__list` — Lists the app prices set by hand
- `apps__app_price_points__list` — Lists the prices the app can be set to
- `apps__app_price_schedule__get` — Shows the app's price schedule
- `pricing__equalize_price` — Takes one country's price as the base and has Apple work out the app's, product's or subscription's prices in every other country
- `pricing__get_app_price` — Shows the app's current and scheduled prices by country

#### `monetization:iap-offers` · 18 tools

**What is inside:** Offer codes for in-app purchases: custom and one-time-use codes.

**When you need it:** Offer codes for in-app purchases. · **Key role:** App Manager

- `in_app_purchase_offer_code_custom_codes__create` — Creates a redemption code from text you choose for a product offer
- `in_app_purchase_offer_code_custom_codes__get` — Shows the details of a product offer's custom code
- `in_app_purchase_offer_code_custom_codes__update` — Changes the status of a product offer's custom code
- `in_app_purchase_offer_code_one_time_use_codes__create` — Creates a batch of one-time-use codes for a product offer
- `in_app_purchase_offer_code_one_time_use_codes__get` — Shows the details of a product offer's batch of one-time-use codes
- `in_app_purchase_offer_code_one_time_use_codes__update` — Changes whether a product offer's batch of one-time-use codes can be used
- `in_app_purchase_offer_code_one_time_use_codes__values__get` — Fetches a product offer's one-time-use codes as a file
- `in_app_purchase_offer_codes__create` — Creates an offer for a product that is redeemed with a code
- `in_app_purchase_offer_codes__custom_codes__list` — Lists a product offer's custom codes
- `in_app_purchase_offer_codes__get` — Shows the details of a product's code-redeemed offer
- `in_app_purchase_offer_codes__one_time_use_codes__list` — Lists a product offer's batches of one-time-use codes
- `in_app_purchase_offer_codes__prices__list` — Lists a code-redeemed product offer's prices by country
- `in_app_purchase_offer_codes__update` — Turns a product's code offer on or stops it
- `in_app_purchases_v2__offer_codes__list` — Lists a product's code-redeemed offers
- `in_app_purchases_v2__price_points__list` — Lists the prices a product can be set to

#### `monetization:in-app-purchases` · 34 tools

**What is inside:** In-app purchases: localizations, images, versions, availability, prices, submissions, and the price macros. Images are uploaded through ASC-Core's media tools.

**When you need it:** In-app purchases, their text, images, prices and review. · **Key role:** App Manager

- `in_app_purchase_app_store_review_screenshots__update` — Marks an uploaded review screenshot as complete
- `in_app_purchase_availabilities__available_territories__list` — Lists the countries a product is on sale in
- `in_app_purchase_availabilities__create` — Sets the countries a product goes on sale in
- `in_app_purchase_availabilities__get` — Shows a product's sale availability settings
- `in_app_purchase_localizations_v2__create` — Adds a name and description in the chosen language to a product version
- `in_app_purchase_localizations_v2__delete` — Deletes a product version's text in the chosen language
- `in_app_purchase_localizations_v2__get` — Shows a product version's text in the chosen language
- `in_app_purchase_localizations_v2__update` — Changes a product version's name and description in the chosen language
- `in_app_purchase_price_points__equalizations__list` — Lists what a product's price comes to in other countries
- `in_app_purchase_price_schedules__automatic_prices__list` — Lists the product prices Apple sets per country
- `in_app_purchase_price_schedules__base_territory__get` — Shows the country a product's prices are based on
- `in_app_purchase_price_schedules__create` — Sets a product's prices by country and date
- `in_app_purchase_price_schedules__get` — Shows a product's price schedule details
- `in_app_purchase_price_schedules__manual_prices__list` — Lists the product prices set by hand
- `in_app_purchase_versions__create` — Creates a new version of an in-app product
- `in_app_purchase_versions__get` — Shows a product version's number and review status
- `in_app_purchase_versions__image__get` — Shows a product version's image
- `in_app_purchase_versions__localizations__list` — Lists a product version's text in every language
- `in_app_purchases_v2__content__get` — Shows the details and link of a product's downloadable file
- `in_app_purchases_v2__create` — Creates a product to sell inside the app
- `in_app_purchases_v2__delete` — Deletes an in-app product
- `in_app_purchases_v2__get` — Shows the details of a product sold inside the app
- `in_app_purchases_v2__iap_price_schedule__get` — Shows a product's price schedule
- `in_app_purchases_v2__in_app_purchase_availability__get` — Shows a product's sale availability settings
- `in_app_purchases_v2__price_points__list` — Lists the prices a product can be set to
- `in_app_purchases_v2__update` — Changes a product's name, review note and Family Sharing
- `in_app_purchases_v2__versions__list` — Lists a product's versions
- `pricing__equalize_price` — Takes one country's price as the base and has Apple work out the app's, product's or subscription's prices in every other country
- `pricing__get_iap_price` — Shows a product's current and scheduled prices by country
- `pricing__set_iap_price` — Changes a product's price in the chosen country; if the base country changes, the automatic prices in other countries change too
- `release__submit_items` — Sends an in-app item's version to review

#### `monetization:plan-promote` · 12 tools

**What is inside:** Promoted purchases: which subscriptions and in-app purchases the store page shows.

**When you need it:** Which purchases your product page promotes. · **Key role:** App Manager

- `apps__promoted_purchases__list` — Lists the in-app products and subscriptions promoted on the App Store
- `apps__promoted_purchases__replace` — Changes the list and order of the products promoted on the App Store
- `in_app_purchases_v2__promoted_purchase__get` — Shows a product's promotion settings on the App Store
- `promoted_purchases__create` — Creates an App Store promotion for a product or subscription
- `promoted_purchases__delete` — Deletes a product's or subscription's App Store promotion
- `promoted_purchases__get` — Shows a product's or subscription's App Store promotion details
- `promoted_purchases__update` — Changes whether a product or subscription is promoted on the App Store
- `subscription_groups__subscriptions__list` — Lists the subscriptions in a group
- `subscriptions__promoted_purchase__get` — Shows a subscription's promotion settings on the App Store

#### `monetization:subscription` · 53 tools

**What is inside:** Subscriptions and their groups: localizations, images, versions, prices, availability, grace period, submissions, and the price and preflight macros. Images are uploaded through ASC-Core's media tools.

**When you need it:** Subscriptions and their groups, text, prices and review. · **Key role:** App Manager

- `apps__subscription_grace_period__get` — Shows the app's settings for keeping a subscription going when payment fails
- `preflight__check_subscription` — Checks what a subscription, or the subscriptions in its group, is missing before review
- `pricing__setup_subscription` — Creates a subscription with its group, languages, countries and price in one step
- `pricing__equalize_price` — Takes one country's price as the base and has Apple work out the app's, product's or subscription's prices in every other country
- `pricing__get_subscription_price` — Shows a subscription's current prices by country and its scheduled changes
- `pricing__set_subscription_price` — Sets or changes a subscription's price in the chosen country
- `release__submit_items` — Sends a subscription or subscription group version to review
- `subscription_app_store_review_screenshots__update` — Marks an uploaded subscription review screenshot as complete
- `subscription_grace_periods__get` — Shows how long a subscription is kept going when payment fails
- `subscription_grace_periods__update` — Sets whether, and for how long, a subscription is kept going when payment fails
- `subscription_group_localizations_v2__create` — Adds a name in the chosen language to a subscription group version
- `subscription_group_localizations_v2__delete` — Deletes a subscription group version's record in the chosen language
- `subscription_group_localizations_v2__get` — Shows a subscription group version's names in the chosen language
- `subscription_group_localizations_v2__update` — Changes a subscription group version's names in the chosen language
- `subscription_group_versions__create` — Creates a new version of a subscription group
- `subscription_group_versions__get` — Shows a subscription group version's number and review status
- `subscription_group_versions__localizations__list` — Lists a subscription group version's names in every language
- `subscription_groups__create` — Creates a new subscription group in the app
- `subscription_groups__delete` — Deletes a subscription group
- `subscription_groups__get` — Shows a subscription group's details
- `subscription_groups__subscriptions__list` — Lists the subscriptions in a group
- `subscription_groups__update` — Changes the name a subscription group is managed under
- `subscription_groups__versions__list` — Lists a subscription group's versions
- `subscription_localizations_v2__create` — Adds a name and description in the chosen language to a subscription version
- `subscription_localizations_v2__delete` — Deletes a subscription version's text in the chosen language
- `subscription_localizations_v2__get` — Shows a subscription version's text in the chosen language
- `subscription_localizations_v2__update` — Changes a subscription version's name and description in the chosen language
- `subscription_plan_availabilities__available_territories__list` — Lists the countries a subscription is sold in with the chosen payment option
- `subscription_plan_availabilities__available_territories__replace` — Changes the list of countries a subscription is sold in with the chosen payment option
- `subscription_plan_availabilities__create` — Sets the countries a subscription is sold in with a given payment option
- `subscription_plan_availabilities__get` — Shows a subscription's sale availability settings for a given payment option
- `subscription_plan_availabilities__update` — Changes the sale countries of a subscription's payment plan, and whether it opens in new countries automatically
- `subscription_price_points__adjusted_equalizations__list` — Lists what a subscription's price comes to per country, adjusted for the payment option
- `subscription_price_points__equalizations__list` — Lists what a subscription's price comes to in other countries
- `subscription_price_points__get` — Shows the details of a price a subscription can be set to
- `subscription_prices__create` — Sets a subscription's price by country and start date
- `subscription_prices__delete` — Deletes a subscription's scheduled price change
- `subscription_versions__create` — Creates a new version of a subscription
- `subscription_versions__get` — Shows a subscription version's number and review status
- `subscription_versions__image__get` — Shows a subscription version's image
- `subscription_versions__localizations__list` — Lists a subscription version's text in every language
- `subscriptions__create` — Creates a new subscription in a group
- `subscriptions__delete` — Deletes a subscription
- `subscriptions__get` — Shows a subscription's details
- `subscriptions__plan_availabilities__list` — Lists a subscription's sale availability settings by payment option
- `subscriptions__price_points__list` — Lists the prices a subscription can be set to
- `subscriptions__prices__list` — Lists a subscription's price records by country
- `subscriptions__prices__remove` — Removes the chosen scheduled price changes of a subscription
- `subscriptions__update` — Changes a subscription's details, prices and offers
- `subscriptions__versions__list` — Lists a subscription's versions

#### `monetization:subscription-codes` · 19 tools

**What is inside:** Subscription offer codes: custom and one-time-use codes.

**When you need it:** Offer codes for subscriptions. · **Key role:** App Manager

- `subscription_groups__subscriptions__list` — Lists the subscriptions in a group
- `subscription_offer_code_custom_codes__create` — Creates a redemption code from text you choose for a subscription offer
- `subscription_offer_code_custom_codes__get` — Shows the details of a subscription offer's custom code
- `subscription_offer_code_custom_codes__update` — Changes the status of a subscription offer's custom code
- `subscription_offer_code_one_time_use_codes__create` — Creates a batch of one-time-use codes for a subscription offer
- `subscription_offer_code_one_time_use_codes__get` — Shows the details of a subscription offer's batch of one-time-use codes
- `subscription_offer_code_one_time_use_codes__update` — Changes whether a subscription offer's batch of one-time-use codes can be used
- `subscription_offer_code_one_time_use_codes__values__get` — Fetches a subscription offer's one-time-use codes as a file
- `subscription_offer_codes__create` — Creates an offer for a subscription that is redeemed with a code
- `subscription_offer_codes__custom_codes__list` — Lists a subscription offer's custom codes
- `subscription_offer_codes__get` — Shows the details of a subscription's code-redeemed offer
- `subscription_offer_codes__one_time_use_codes__list` — Lists a subscription offer's batches of one-time-use codes
- `subscription_offer_codes__prices__list` — Lists a code-redeemed subscription offer's prices by country
- `subscription_offer_codes__update` — Turns a subscription's code offer on or stops it
- `subscriptions__offer_codes__list` — Lists a subscription's code-redeemed offers
- `subscriptions__price_points__list` — Lists the prices a subscription can be set to

#### `monetization:subscription-offers` · 17 tools

**What is inside:** Introductory and promotional offers on a subscription, and the one-call offer macro.

**When you need it:** Introductory and promotional subscription offers. · **Key role:** App Manager

- `subscription_groups__subscriptions__list` — Lists the subscriptions in a group
- `subscription_introductory_offers__create` — Creates an offer for people subscribing for the first time in a country
- `subscription_introductory_offers__delete` — Deletes the offer for first-time subscribers
- `subscription_introductory_offers__update` — Changes the end date of the offer for first-time subscribers
- `subscription_promotional_offers__create` — Creates an offer for current or former subscribers
- `subscription_promotional_offers__delete` — Deletes the offer for current or former subscribers
- `subscription_promotional_offers__get` — Shows the details of the offer for current or former subscribers
- `subscription_promotional_offers__prices__list` — Lists a subscription promotion's prices by country
- `subscription_promotional_offers__update` — Changes the prices of the offer for current or former subscribers
- `subscriptions__introductory_offers__list` — Lists the offers for first-time subscribers
- `subscriptions__introductory_offers__remove` — Removes the chosen offers a subscription makes to first-time subscribers
- `subscriptions__price_points__list` — Lists the prices a subscription can be set to
- `subscriptions__promotional_offers__list` — Lists the offers for current or former subscribers
- `pricing__make_offer` — Creates an introductory, promotional or win-back offer for a subscription, priced in every country

#### `monetization:subscription-win-back` · 12 tools

**What is inside:** Win-back offers for lapsed subscribers.

**When you need it:** Offers that bring lapsed subscribers back. · **Key role:** App Manager

- `subscription_groups__subscriptions__list` — Lists the subscriptions in a group
- `subscriptions__price_points__list` — Lists the prices a subscription can be set to
- `subscriptions__win_back_offers__list` — Lists the offers that win back former subscribers
- `win_back_offers__create` — Creates an offer to win back former subscribers
- `win_back_offers__delete` — Deletes a win-back offer
- `win_back_offers__get` — Shows the details of a win-back offer
- `win_back_offers__prices__list` — Lists a win-back offer's prices by country
- `win_back_offers__update` — Changes a win-back offer's terms, dates and promotion settings
- `pricing__make_offer` — Creates an introductory, promotional or win-back offer for a subscription, priced in every country

#### `monetization:transactions` · 21 tools

**What is inside:** App Store Server API: customer transactions, refunds, subscription status, renewal dates.

**When you need it:** Look up a customer’s purchases, refunds and subscription status. · **Key role:** App Manager

- `storekit__check_entitlement` — Checks whether a customer's entitlement from a subscription is still active
- `storekit__extend_renewal_date` — Moves a customer's subscription renewal date later
- `storekit__finish_transaction` — Tells the App Store your server has finished processing a transaction
- `storekit__get_app_transaction` — Shows when a customer first got the app and on which version
- `storekit__get_mass_extension_status` — Shows the progress of a renewal-date extension for all subscribers
- `storekit__get_notification_history` — Shows the delivery history of purchase notifications and the failed deliveries
- `storekit__get_refund_history` — Lists a customer's refunded purchases
- `storekit__get_retention_messaging` — Shows the retention messages, images and settings for customers about to cancel
- `storekit__get_subscription_statuses` — Shows the status of a customer's subscriptions
- `storekit__get_test_notification_status` — Shows whether the test notification reached the notification endpoint
- `storekit__get_transaction_history` — Fetches a customer's purchase history
- `storekit__get_transaction_info` — Shows the details of one purchase transaction
- `storekit__lookup_order` — Finds the purchases tied to an order number
- `storekit__manage_retention_messaging` — Uploads or deletes retention messages and images and sets the default message and realtime URL
- `storekit__mass_extend_renewal_date` — Moves the renewal date later for every active subscriber of a subscription
- `storekit__request_test_notification` — Asks Apple to send a test notification to check the notification endpoint
- `storekit__send_consumption_info` — Sends Apple delivery and usage details for a refund request
- `storekit__set_app_account_token` — Links a purchase to an account in your own system

### `provisioning` · 41 tools

**Server:** `ASC-Provisioning` · **Key role:** Admin

**What is inside:** Code signing: bundle IDs and capabilities, certificates, devices, provisioning profiles, merchant and pass type IDs.

**When you need it:** Signing certificates, provisioning profiles and test devices.

#### `provisioning:bundle` · 14 tools

**What is inside:** Bundle IDs and their capabilities.

**When you need it:** Bundle IDs and the capabilities they turn on. · **Key role:** Admin

- `bundle_id_capabilities__create` — Adds a new capability to a bundle ID
- `bundle_id_capabilities__delete` — Removes a capability from a bundle ID
- `bundle_id_capabilities__update` — Updates the settings of a capability set on a bundle ID
- `bundle_ids__app__get` — Fetches the app a bundle ID belongs to
- `bundle_ids__bundle_id_capabilities__list` — Lists every capability set on a bundle ID
- `bundle_ids__create` — Registers a new bundle ID for an app
- `bundle_ids__delete` — Deletes a bundle ID
- `bundle_ids__get` — Fetches a bundle ID's details
- `bundle_ids__list` — Lists every bundle ID on the developer account
- `bundle_ids__profiles__list` — Lists every provisioning profile tied to a bundle ID
- `bundle_ids__update` — Updates a bundle ID's display name

#### `provisioning:certificates` · 8 tools

**What is inside:** Signing certificates: create, list, revoke.

**When you need it:** Signing certificates: create, list and revoke. · **Key role:** Admin

- `certificates__create` — Creates a development, distribution, Apple Pay or Wallet certificate from a certificate signing request (CSR)
- `certificates__delete` — Revokes and deletes a signing certificate
- `certificates__get` — Fetches a signing certificate's details and validity period
- `certificates__list` — Lists every signing certificate on the account
- `certificates__update` — Updates whether a signing certificate is activated

#### `provisioning:devices` · 7 tools

**What is inside:** Registered test devices.

**When you need it:** The devices registered for testing. · **Key role:** Admin

- `devices__create` — Registers a new device for testing on the developer account
- `devices__get` — Fetches a registered test device's details
- `devices__list` — Lists every test device registered on the account
- `devices__update` — Updates a registered test device's name or status

#### `provisioning:profiles` · 13 tools

**What is inside:** Provisioning profiles and the bundle ID, certificates and devices they bind.

**When you need it:** Provisioning profiles that tie an app, certificates and devices together. · **Key role:** Admin

- `bundle_ids__list` — Lists every bundle ID on the developer account
- `certificates__list` — Lists every signing certificate on the account
- `devices__list` — Lists every test device registered on the account
- `profiles__bundle_id__get` — Fetches the bundle ID a provisioning profile is tied to
- `profiles__certificates__list` — Lists every signing certificate in a provisioning profile
- `profiles__create` — Creates a new provisioning profile for installing and signing an app
- `profiles__delete` — Deletes a provisioning profile
- `profiles__devices__list` — Lists every device a provisioning profile allows
- `profiles__get` — Fetches a provisioning profile's details, validity period and profile file
- `profiles__list` — Lists every provisioning profile on the account

#### `provisioning:wallet` · 16 tools

**What is inside:** Merchant IDs and pass type IDs, with their certificates.

**When you need it:** Merchant IDs for Apple Pay and pass type IDs for Wallet. · **Key role:** Admin

- `certificates__pass_type_id__get` — Fetches the Apple Wallet pass type ID a certificate is tied to
- `merchant_ids__certificates__list` — Lists the certificates tied to an Apple Pay merchant ID
- `merchant_ids__create` — Creates a new merchant ID for Apple Pay payments
- `merchant_ids__delete` — Deletes an Apple Pay merchant ID
- `merchant_ids__get` — Fetches an Apple Pay merchant ID's details
- `merchant_ids__list` — Lists every Apple Pay merchant ID on the account
- `merchant_ids__update` — Updates an Apple Pay merchant ID's name
- `pass_type_ids__certificates__list` — Lists the signing certificates tied to a Wallet pass type ID
- `pass_type_ids__create` — Creates a new pass type ID for Apple Wallet passes
- `pass_type_ids__delete` — Deletes an Apple Wallet pass type ID
- `pass_type_ids__get` — Fetches an Apple Wallet pass type ID's details
- `pass_type_ids__list` — Lists every Apple Wallet pass type ID on the account
- `pass_type_ids__update` — Updates an Apple Wallet pass type ID's name

### `testflight` · 82 tools

**Server:** `ASC-TestFlight` · **Key role:** Developer

**What is inside:** TestFlight: builds for testing, beta groups and testers, external review, crash and screenshot feedback.

**When you need it:** Beta builds, groups and testers, and what testers report.

#### `testflight:external-testing` · 24 tools

**What is inside:** External testing: beta app review, recruitment criteria, public links, the beta license agreement.

**When you need it:** Beta App Review, public links and who can join. · **Key role:** Developer

- `apps__beta_app_review_detail__get` — Fetches the contact and demo account details for external test review
- `apps__beta_groups__list` — Lists the app's test groups
- `apps__beta_license_agreement__get` — Fetches the app's tester agreement
- `beta_app_review_details__get` — Fetches the contact and demo account details for external test review
- `beta_app_review_details__list` — Lists external test review details
- `beta_app_review_details__update` — Updates the contact, demo account and notes for external test review
- `beta_app_review_submissions__build__get` — Fetches the build in a beta review submission
- `beta_app_review_submissions__create` — Sends a build to Apple's beta review for external testing
- `beta_app_review_submissions__get` — Fetches an external test review submission
- `beta_app_review_submissions__list` — Lists external test review submissions
- `beta_groups__beta_recruitment_criteria__get` — Fetches a group's tester admission criteria
- `beta_groups__beta_recruitment_criterion_compatible_build__1sdmx5` — Shows whether there is a build that meets the group's criteria
- `beta_groups__public_link_usages__metrics` — Shows how a group's public invite link is used
- `beta_license_agreements__get` — Fetches a tester agreement
- `beta_license_agreements__list` — Lists tester agreements
- `beta_license_agreements__update` — Updates a tester agreement's text
- `beta_recruitment_criteria__create` — Adds joining criteria to a test group
- `beta_recruitment_criteria__delete` — Deletes a test group's joining criteria
- `beta_recruitment_criteria__update` — Updates a test group's joining criteria
- `beta_recruitment_criterion_options__list` — Lists the devices and OS versions that can be chosen for tester admission
- `builds__beta_app_review_submission__get` — Fetches a build's beta review submission

#### `testflight:feedbacks` · 18 tools

**What is inside:** Tester feedback: crash reports, screenshot submissions, the feedback digest.

**When you need it:** Crashes and screenshots testers send, summed up. · **Key role:** Developer

- `apps__beta_feedback_crash_submissions__list` — Lists the app's crash reports from testers
- `apps__beta_feedback_screenshot_submissions__list` — Lists the app's tester reports with screenshots
- `apps__beta_groups__list` — Lists the app's test groups
- `apps__beta_tester_usages__metrics` — Shows session, crash and feedback counts per tester
- `beta_crash_logs__get` — Fetches the details of a crash log
- `beta_feedback_crash_submissions__crash_log__get` — Fetches the log tied to a tester's crash report
- `beta_feedback_crash_submissions__delete` — Deletes a tester's crash report
- `beta_feedback_crash_submissions__get` — Fetches a tester's crash report
- `beta_feedback_screenshot_submissions__delete` — Deletes a tester report with a screenshot
- `beta_feedback_screenshot_submissions__get` — Fetches a tester report with a screenshot
- `beta_groups__beta_tester_usages__metrics` — Shows the session, crash and feedback counts of a group's testers
- `beta_testers__beta_tester_usages__metrics` — Shows a tester's session, crash and feedback counts
- `beta_testers__list` — Lists testers
- `builds__beta_build_usages__metrics` — Shows a build's install, session, crash, feedback and invitation counts
- `testflight__feedback_digest` — Sums up tester reports by build

#### `testflight:groups` · 14 tools

**What is inside:** Beta groups: create, configure, assign builds.

**When you need it:** Beta groups and which builds they get. · **Key role:** Developer

- `apps__beta_groups__list` — Lists the app's test groups
- `beta_groups__beta_testers__list` — Lists the testers in a group
- `beta_groups__builds__add` — Gives one or more builds to a group
- `beta_groups__builds__list` — Lists the builds a group can reach
- `beta_groups__builds__remove` — Takes a build back from a group
- `beta_groups__create` — Creates a new test group
- `beta_groups__delete` — Deletes a test group
- `beta_groups__get` — Fetches a test group's details
- `beta_groups__list` — Lists test groups
- `beta_groups__update` — Updates a group's name, public invite link, tester limit and test options
- `testflight__assign_build_to_groups` — Gives a processed build to the chosen groups

#### `testflight:test-builds` · 28 tools

**What is inside:** Builds under test: what to test notes, beta details, tester notifications, pre-release versions.

**When you need it:** What to test notes and the builds testers receive. · **Key role:** Developer

- `apps__beta_app_localizations__list` — Lists the app's test details (description, feedback email) by language
- `apps__beta_groups__list` — Lists the app's test groups
- `apps__pre_release_versions__list` — Lists the app's pre-release versions (e.g. 1.2)
- `beta_app_localizations__create` — Adds test details (description, feedback email) for one language
- `beta_app_localizations__delete` — Deletes one language's test details
- `beta_app_localizations__get` — Fetches one language's test details
- `beta_app_localizations__list` — Lists test details by language
- `beta_app_localizations__update` — Updates one language's test details
- `beta_build_localizations__create` — Writes a build's "What to Test" note in one language
- `beta_build_localizations__delete` — Deletes a build's "What to Test" note in one language
- `beta_build_localizations__get` — Fetches a build's "What to Test" note in one language
- `beta_build_localizations__list` — Lists builds' "What to Test" notes
- `beta_build_localizations__update` — Updates a build's "What to Test" note
- `build_beta_details__get` — Shows a build's internal and external testing status and its automatic notification setting
- `build_beta_details__list` — Lists builds' internal and external testing statuses and automatic notification settings
- `build_beta_details__update` — Turns automatic tester notifications for a build on or off
- `build_beta_notifications__create` — Sends a notification to the testers who can reach a build
- `builds__beta_build_localizations__list` — Lists a build's "What to Test" notes by language
- `builds__build_beta_detail__get` — Fetches a build's internal and external testing status and its automatic notification setting
- `builds__pre_release_version__get` — Fetches the pre-release version a build belongs to
- `pre_release_versions__builds__list` — Lists the builds in a pre-release version
- `pre_release_versions__get` — Fetches a pre-release version
- `pre_release_versions__list` — Lists pre-release versions
- `testflight__assign_build_to_groups` — Gives a processed build to the chosen groups
- `testflight__wait_for_build` — Waits for an uploaded build to finish processing and says whether it is valid

#### `testflight:testers` · 18 tools

**What is inside:** Individual testers: invite, add to groups and builds, remove.

**When you need it:** Invite testers, add them to groups and builds, remove them. · **Key role:** Developer

- `apps__beta_groups__list` — Lists the app's test groups
- `apps__beta_testers__remove` — Removes a tester from the app's testing
- `beta_tester_invitations__create` — Sends, or sends again, the app invitation to a registered tester
- `beta_testers__apps__list` — Lists the apps a tester takes part in
- `beta_testers__beta_groups__add` — Adds a tester to test groups
- `beta_testers__beta_groups__list` — Lists the groups a tester belongs to
- `beta_testers__beta_groups__remove` — Removes a tester from test groups
- `beta_testers__builds__list` — Lists the builds given to a tester directly
- `beta_testers__create` — Creates a tester record; adds them to groups or straight to builds if asked
- `beta_testers__delete` — Deletes a tester completely from every app's testing
- `beta_testers__get` — Fetches a tester's details
- `beta_testers__list` — Lists testers
- `builds__individual_testers__add` — Gives a build directly to specific testers
- `builds__individual_testers__list` — Lists the testers a build was given to directly
- `builds__individual_testers__remove` — Takes a build back from specific testers

### `webhooks` · 9 tools

**Server:** `ASC-Webhooks` · **Key role:** Admin

**What is inside:** Webhooks pushing App Store Connect events to your endpoint, their deliveries and pings.

**When you need it:** Let App Store Connect tell your own server when something happens.

- `apps__webhooks__list` — Lists every webhook notification set up for the app
- `webhook_deliveries__create` — Sends a past or failed webhook notification again
- `webhook_pings__create` — Sends a test ping to check a webhook URL
- `webhooks__create` — Creates a new webhook to listen for app events
- `webhooks__delete` — Deletes a webhook notification subscription
- `webhooks__deliveries__list` — Lists a webhook subscription's past delivery attempts
- `webhooks__get` — Fetches a webhook notification subscription's details
- `webhooks__update` — Updates a webhook subscription's URL, events, name, secret and whether it is on

### `xcode-cloud` · 44 tools

**Server:** `ASC-XcodeCloud` · **Key role:** Developer

**What is inside:** Apple's CI/CD: workflows, build runs, artifacts, test results, source control.

**When you need it:** Build workflows and why a build failed.

#### `xcode-cloud:repositories` · 17 tools

**What is inside:** Source control behind Xcode Cloud: providers, repositories, branches, pull requests.

**When you need it:** The Git repositories, branches and pull requests Xcode Cloud builds. · **Key role:** Developer

- `ci_products__additional_repositories__list` — Lists the additional code repositories a cloud build uses
- `ci_products__list` — Lists every app and library that uses Xcode Cloud
- `ci_products__primary_repositories__list` — Lists an Xcode Cloud product's primary code repositories
- `ci_products__workflows__list` — Lists an Xcode Cloud product's workflows
- `ci_workflows__repository__get` — Shows which code repository a workflow uses
- `scm_git_references__get` — Shows the details of a branch or tag
- `scm_providers__get` — Shows the details of a connected code hosting service
- `scm_providers__list` — Lists connected code hosting services
- `scm_providers__repositories__list` — Lists the repositories on a code hosting service
- `scm_pull_requests__get` — Shows the details of a pull request
- `scm_repositories__get` — Shows the details of a code repository
- `scm_repositories__git_references__list` — Lists the branches and tags in a code repository
- `scm_repositories__list` — Lists every connected code repository
- `scm_repositories__pull_requests__list` — Lists the pull requests in a code repository

#### `xcode-cloud:workflows` · 35 tools

**What is inside:** Xcode Cloud products, workflows and build runs: actions, artifacts, issues, test results, and the run diagnosis macro.

**When you need it:** Workflows, build runs, test results and why a run failed. · **Key role:** Developer

- `apps__ci_product__get` — Shows the app's cloud build record
- `ci_artifacts__get` — Shows the type, size and download link of a file a build produced
- `ci_build_actions__artifacts__list` — Lists the files a build action produced
- `ci_build_actions__build_run__get` — Shows the build a build action belongs to
- `ci_build_actions__get` — Shows a build action's details
- `ci_build_actions__issues__list` — Lists the errors and warnings in a build action
- `ci_build_actions__test_results__list` — Lists the test results in a build action
- `ci_build_runs__actions__list` — Lists a build's actions
- `ci_build_runs__builds__list` — Lists the builds a cloud build produced
- `ci_build_runs__create` — Starts a workflow by hand or runs an earlier build again
- `ci_build_runs__get` — Shows a cloud build's status and result
- `ci_issues__get` — Shows the details of an error or warning in a build
- `ci_mac_os_versions__get` — Shows a macOS version available for builds
- `ci_mac_os_versions__list` — Lists the macOS versions available for builds
- `ci_mac_os_versions__xcode_versions__list` — Lists the Xcode versions compatible with a macOS version
- `ci_products__app__get` — Shows which app a cloud build record belongs to
- `ci_products__build_runs__list` — Lists every cloud build of an Xcode Cloud product
- `ci_products__delete` — Deletes the app's cloud build record with all its workflows
- `ci_products__get` — Shows the details of an Xcode Cloud product (an app or a library)
- `ci_products__list` — Lists every app and library that uses Xcode Cloud
- `ci_products__workflows__list` — Lists an Xcode Cloud product's workflows
- `ci_test_results__get` — Shows the details of one test result
- `ci_workflows__build_runs__list` — Lists a workflow's past builds
- `ci_workflows__create` — Sets up a new workflow
- `ci_workflows__delete` — Deletes a workflow
- `ci_workflows__get` — Shows a workflow's settings
- `ci_workflows__update` — Changes a workflow's settings
- `ci_xcode_versions__get` — Shows an Xcode version available for builds
- `ci_xcode_versions__list` — Lists the Xcode versions available for builds
- `ci_xcode_versions__mac_os_versions__list` — Lists the macOS versions compatible with an Xcode version
- `scm_repositories__list` — Lists every connected code repository
- `ci__diagnose_run` — Collects the errors, warnings and failed tests of a failed cloud build in one step
