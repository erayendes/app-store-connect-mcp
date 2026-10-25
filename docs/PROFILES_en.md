# Profiles

🇬🇧 English · 🇹🇷 [Türkçe](PROFILES_tr.md)

One installation gives you 13 small MCP servers, each built for one job.
You name a profile, and only that area's tools are loaded.

| Profile | Covers | ~Tools | Sub-profiles |
|:--|:--|--:|:--|
| `app-info` | App identity, store metadata, categories, country availability, age rating, accessibility labels, EULA | 58 | — |
| `distribution` | Versions, localizations, phased release, review submission, builds, export compliance, EU distribution | 137 | version, dma-distribution, builds, submission, encryption, review, pre-release, coverages |
| `monetization` | Subscriptions, in-app purchases, pricing, offers, StoreKit 2, sandbox testers | 212 | subscription-catalog, subscription-pricing, subscription-offers, iap-catalog, iap-pricing, iap-offers, app-price, storekit |
| `marketing` | Screenshots, product pages, in-app events, reviews, asset library | 127 | asset-library, custom-product-page, product-page-optimization, app-event, customer-review, nominations |
| `access` | Beta groups, testers, invitations, team members | 66 | beta-testers, beta-groups, users |
| `testflight` | Beta app descriptions, beta review details, crash feedback, beta license agreement | 56 | — |
| `game-center` | Achievements, leaderboards, activities, challenges, matchmaking | 187 | gc-leaderboard, gc-matchmaking, gc-activities, gc-challenge, gc-achievement, gc-details, gc-groups, gc-default |
| `app-clips` | Default and advanced experiences, header images, beta invocations | 52 | — |
| `xcode-cloud` | CI workflows, build runs, artifacts | 53 | — |
| `provisioning` | Certificates, provisioning profiles, devices, bundle IDs | 50 | — |
| `analytics` | Sales and finance reports, analytics, performance metrics | 26 | — |
| `background-assets` | Background Assets (iOS 26) | 24 | — |
| `webhooks` | Webhook setup and diagnostics | 18 | — |

Every profile also comes with a small **core set** for finding your apps and searching for missing tools. Whichever profile you install, the AI can find your apps and point you to a tool that isn't in that profile.

## Sub-profiles

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/app-store-connect-mcp/main/assets/picker.gif" alt="The profile picker: ticking monetization opens its sub-profiles, each with its tool count and token estimate" width="720">

Tick a profile in the [setup](SETUP_en.md) picker. When you move the cursor onto it, its sub-profiles open, all ticked; untick the ones you don't want.
For example, `monetization` has 212 tools, but if you only change subscription prices, the 27 tools in `monetization:subscription-pricing` are enough. Either way, the server is still called `ASC-Monetization`.

> [!TIP]
> To see which profiles are installed, ask the AI: *"Which profiles are installed?"*

## Starter packs

A quick answer to "Which profiles should I install?" Each pack comes with the core set, too.

| Role | Install | Tools |
|:--|:--|--:|
| Release manager | `distribution` + `app-info` | 195 |
| ASO / marketing | `marketing` + `analytics` | 153 |
| QA / TestFlight | `testflight` + `access` | 122 |
| Monetization | `monetization` | 212 |
| Game developer | `game-center` + `distribution` | 324 |
| Customer support | `monetization:storekit` | 19 |
| Build and signing | `provisioning` + `xcode-cloud` | 103 |

> [!TIP]
> Start narrow. Skipping a profile costs you nothing. Every tool you install is described to the AI again in every conversation, so fewer tools means faster and cheaper.
> If you need a tool you skipped, ask the AI; it tells you which profile has it and how to add it.
