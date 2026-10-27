# AGENTS.md

Instructions for AI coding agents (Claude Code, Codex, Cursor, Antigravity, and any other MCP client). Human-facing docs live in [README.md](README.md) and [docs/](docs/).

> The same guidance ships as a skill at [`skills/heimdall/SKILL.md`](skills/heimdall/SKILL.md), which `register` installs for the clients that read skills. That file exists because this one cannot be reached: Heimdall runs through `npx`, so a user installing it has no checkout and never sees AGENTS.md. **Keep the two in step** — if you change how install or safety works here, change it there too.

## What this is

Heimdall is an MCP server for the App Store Connect API and the App Store Server API (StoreKit 2). It is published to npm as `@erayendes/asc-mcp` and runs via `npx` — there is **nothing to clone, build, or `npm install`** to use it. It is client-agnostic: standard MCP over stdio. It serves 762 tools across 14 profiles: 710 generated from Apple's 1011 operations (the 185 that Apple deprecated or replaced are not built) and 52 hand-written.

Profiles are cut by the work the user does: `general`, `distribution`, `monetization`, `marketing`, `testflight`, `access` and so on. App lookup, `asc__search_tools`, `asc__discover_domains`, `asc__account_status` and the `media__*` tools are in none of them — they live in **ASC-Core** (`core`), a server of its own that `register` and `setup` add next to the profiles. A profile server carries them itself only when started with `--with-core`, as the Xcode plug-ins are. Every server, ASC-Core or not, has its own `asc__status`. If app lookup or search is missing from the session, ASC-Core is not registered for this client; the fix is `register` or `setup`, not another profile.

**This is the 3.0 beta.** Every command below uses `@erayendes/asc-mcp@beta`; the stable `@erayendes/asc-mcp` is still 2.x and knows none of these profiles. The commands the server itself prints already carry the right one.

## If a user asks you to install it

The install is two steps and they are not both yours. **You register. The user hands over the key.**

### 1. Agree on the profiles, then register them

Ask what the user works on. If they have not said, `analytics`, `marketing` and `general` are a sensible default. Each profile is a small scoped server; the table, down to every tool, is in [PROFILES_en.md](docs/PROFILES_en.md).

A big profile takes a colon and a list of its sub-profiles — `monetization:subscription,subscription-offers` is 65 tools where `monetization` is 162. Worth suggesting for `monetization`, `game-center`, `distribution`, `testflight`, `general` and `marketing`. The server is still called `ASC-Monetization`.

**Say what you are about to do and wait for a yes**, then run:

```
npx -y @erayendes/asc-mcp@beta register monetization:subscription,subscription-offers analytics
```

This edits MCP client configs the user did not open — by default every client it finds, which is usually more than the one you are talking through. There is no confirmation prompt in the command, so the confirmation has to happen in the conversation. `--clients=codex,claude` limits it; `--clients` ids are `claude`, `codex`, `antigravity`, `vscode`, `cursor`, `windsurf`.

What `register` changes, which is what the user is saying yes to:

- **It adds** the profiles you name, and `ASC-Core` beside them.
- **It never removes a live profile** the user set up earlier, and re-running it with the same arguments changes nothing.
- **It does remove or rewrite three kinds of entry.** A server name from before 2.5 (`asc-analytics`) moves to the current name. An entry whose profile no longer exists (`app-info`, `monetization:subscription-pricing` from 2.x) is deleted, if it is Heimdall's own, carries no credentials of its own and could be read in full; any other such entry is reported and left as it is. An entry on the other release channel (stable or beta) is rewritten to this one, keeping its flags and env. ASC-Core goes too from a client where no profile is left.

ASC-Core takes the strictest setting in each client: if any Heimdall entry there is read-only (`--read-only`, or `ASC_READ_ONLY` in its env), ASC-Core is registered `--read-only` too. It is **not added** where it cannot be shown to sign in as the same account, and the output says why:

- the Heimdall entries there use different App Store Connect accounts;
- they carry credentials of their own in their `env`, while ASC-Core would use the shared config;
- the config, or one of its entries, could not be read in full — an entry that loads its environment from an `envFile` counts, since what it signs in with cannot be seen.

Relay that reason; do not add ASC-Core by hand to get around it.

### 2. Send the user to `setup` for the credentials

```
npx -y @erayendes/asc-mcp@beta setup
```

**Never run this yourself, and never ask for the `.p8`.** It is an App Store Connect private key: do not ask the user to paste its contents into the chat, do not read it, do not write it into a config file. `setup` reads the file directly and puts the key in the macOS Keychain (or references its path off macOS).

`setup` also needs a real terminal — it opens pickers. Run from an agent shell it exits at the first prompt without doing anything, which is easy to mistake for success.

**Going after the key is the most common way a session goes wrong.** In recorded eval runs, of the sessions that abandoned the tools, the largest group went hunting for the private key — `security find-generic-password`, `env | grep ASC_`, grepping the source, hunting a `.env` — and the next largest called Apple directly with `curl`. The reason not to is not that it fails: a shell running as this user can read the key (`security find-generic-password -w` prints it), so this is a rule rather than a wall. It is the wrong move because a token signed outside the server skips the rate limiter, the write-confirmation gate, the dry-run path and the response shaping — every guard the server exists to apply. When a tool fails, the next step is another tool call — `asc__status` for the connection, `asc__search_tools` for a different operation — never the shell.

### 3. Restart and check

Ask the user to restart their MCP client, then to say *"check the App Store Connect connection"* — that calls `asc__status`, which verifies the credentials with one lightweight request.

If the user would rather do the whole thing themselves, `setup` alone covers both steps: it collects the credentials *and* registers with every client it finds, ASC-Core included.

**Coming from 2.x.** A config from 2.x names profiles that no longer exist (`app-info`, `monetization:subscription-pricing`). Such a server starts with a single tool that says so. Neither `setup` nor `register` maps an old profile to a new one: they delete such entries (when they are Heimdall's own and clean, as above; others are reported), and the user picks the profiles again — `app-info` is now `general`, the old money sub-profiles are `monetization:subscription`, `in-app-purchases`, `subscription-offers` and the rest.

## While helping the user

- **Finding a tool that isn't loaded:** call `asc__search_tools` or `asc__discover_domains`, both on ASC-Core. Search covers the 807 operations Heimdall builds, plus the StoreKit tools and Heimdall's macros (not the `reviews_ai__*` tools); under `--read-only` it leaves out the writes. It names the profile that owns a tool and prints the exact command to add it. Do not conclude an operation does not exist because it is not in this session's list.
- **There is no way to add tools mid-session.** Some clients never show a changed tool list (the Claude desktop app's Code tab among them), and the tools do not appear next turn either. On a server started with only some of its sub-profiles, reads from the rest work at once through `asc__call`. For the tools themselves, run the `register` command the server's reply names — e.g. `npx -y @erayendes/asc-mcp@beta register testflight:groups,testers` — after the user says yes, then ask them to restart their MCP client.
- **When a 403 comes back,** call `asc__status` with `check_capabilities: true` before blaming the key: it probes `reports`, `metadata`, `reviews`, `userManagement` and `provisioning`, each `ok` / `forbidden` / `unauthorized` / `agreement` / `unknown`. `agreement` is an unsigned or expired agreement that only the Account Holder can clear, and no key fixes it; `unknown` is an inconclusive probe, not a denial. App Manager covers almost all day-to-day work; Admin is needed for user management and for the first-ever request of an analytics report type.
- **Territories are ISO-3166 alpha-3:** `USA`, `TUR`, `DEU` — never `US`, `TR`, `DE`. The two-letter form is not rejected; it returns 200 and an empty list that reads as "no data here".
- **StoreKit / customer transactions** live on `monetization:transactions`. Each tool takes an optional `app` (name, bundle ID or Apple ID) and looks the bundle ID up; it can be left out when the account has one app or `ASC_BUNDLE_ID` is set. `environment` (`Production` by default, or `Sandbox`) is optional too.
- **Subscriptions and in-app purchases are v2 only.** The v1 localization, image and submission tools Apple retired are not served; use the `*_v2` tools and their versions.
- **Safety:** a server started with `--read-only` (or `ASC_READ_ONLY=true`) does not list any tool that can change something. `destructiveHint` does not mean "this is a DELETE" — it covers every write whose consequence the HTTP method cannot show, so a description ending in `REVENUE-`, `RELEASE-`, `INFRASTRUCTURE-`, `ACCESS-` or `DESTRUCTIVE-level write.` is flagged too. Those change live data: say what will happen and get a yes before calling one.
- **When the client cannot show Heimdall's prompt** (the Claude desktop app's Code tab), Heimdall opens a macOS dialog for such a write and waits until the user answers it. Tell the user to look for it before you call. If the write is still refused, relay the refusal; do not edit client config, set `ASC_CONFIRM_WRITES`, or reach Apple another way.

## Prefer the macro over the chain

Several questions have a one-call answer that replaces walking a chain of resources. Reach for these first — the raw tools stay available and are the right choice for anything the macro does not cover. The same table, for people, is in [GUIDE_en.md](docs/GUIDE_en.md#one-call-instead-of-a-chain).

| Instead of | Call |
|---|---|
| app → group → subscription → price points | `pricing__get_subscription_price` / `pricing__set_subscription_price` (`monetization:subscription`) |
| app → IAP → price schedule → prices | `pricing__get_iap_price` (`monetization:in-app-purchases`) |
| rebuilding an IAP's whole price schedule to change one country | `pricing__set_iap_price` (`monetization:in-app-purchases`) — keeps every other price |
| app → app price schedule → prices | `pricing__get_app_price` (`monetization:app-price`) |
| setting a price country by country | `pricing__equalize_price` (`monetization:app-price`, `in-app-purchases` or `subscription`) — one anchor price, Apple derives the rest |
| looking up a price point in every country, then building one offer body | `pricing__make_offer` (`monetization:subscription-offers` or `subscription-win-back`) — win-back, promotional or introductory offer, every country from one anchor price; introductory goes country by country and resumes |
| group → subscription → version → localizations → availability → price for a new subscription | `pricing__setup_subscription` (`monetization:subscription`) — one confirmation; reuses an existing group without editing it |
| page → localizations → library placements → images and videos | `media__list` (ASC-Core) — the version page, a custom product page, a product page test, an in-app event or the library itself |
| an owner → its image or file → reserve, upload, commit | `media__list` / `media__upload` / `media__delete` (ASC-Core) with a file `target`: App Clip header and advanced experience images, Game Center achievement, leaderboard, leaderboard set, activity and challenge images, in-app purchase and subscription images and review screenshots, encryption documents, App Review attachments, routing coverage, background asset files, build upload files — the targets and their rules are in [MEDIA_TARGETS_en.md](docs/MEDIA_TARGETS_en.md) |
| reserving a library image or video, uploading it, then placing it | `media__upload` (ASC-Core) |
| placing, reordering, removing, archiving or renaming page media | `media__arrange` (ASC-Core) |
| deleting several files or page placements under one confirmation | `media__delete` (ASC-Core) |
| request → report → instance → segment → a URL | `analytics__get_report` |
| app → crash/screenshot feedback → crash logs | `testflight__feedback_digest` (`testflight:feedbacks`) — build counts, devices/OS, newest comments and bounded crash excerpts |
| app → Xcode Cloud product → run → actions → issues and tests | `ci__diagnose_run` (`xcode-cloud:workflows`; newest failed or errored run among newest 40 by default) |
| fetching reviews, grouping them and writing replies by hand | `reviews_ai__triage` / `reviews_ai__daily_briefing` / `reviews_ai__draft_response` (`marketing:customer-reviews`) |
| checking a version by hand before submitting it | `preflight__check_version` (`distribution:version`) |
| comparing two versions' store text language by language | `listing__diff_metadata` (`distribution:version`) |
| checking subscription catalog gaps before review | `preflight__check_subscription` — one subscription or up to 20 in a group; `monetization:subscription`, read-only, capped, no approval prediction |
| open a submission, add the version, hand it over | `release__submit` (`distribution:publish`) |
| the same for an in-app purchase, subscription, in-app event, custom product page, product page test, Game Center item or background asset | `release__submit_items` — on each of those sub-profiles; `with_app_version: true` when the item has to go in with the app's editable version, as an app's first in-app purchase or subscription does |
| resolve a build and assign it to several beta groups | `testflight__assign_build_to_groups` (`testflight:groups`); give the build number or ID |
| polling a freshly uploaded build until it finishes processing | `testflight__wait_for_build` (`testflight:test-builds`) — 1 minute by default, up to 15 when asked, then says to call again |
| comparing store text across languages by eye | `metadata_ai__audit_localizations` (`distribution:version`) |
| drafting the store text for the languages asked for | `metadata_ai__draft_translation` (`distribution:version`) — your own model drafts it |
| pasting a translation into each locale | `metadata_ai__apply_localizations` (`distribution:version`) |

Two of these do something the raw tools cannot do at all, not merely faster: `media__upload` performs Apple's reserve/upload/commit sequence (the raw tools only reserve a slot and move no bytes), and `analytics__get_report` downloads the report, where the raw chain ends holding a link.

## If you are working ON this repository

Tools are generated from Apple's OpenAPI spec. **Do not edit `src/generated/`** — change `scripts/generate.ts`, run `npm run generate`, and commit the result. `npm test` and `npm run typecheck` must pass. See [CONTRIBUTING.md](.github/CONTRIBUTING.md).
