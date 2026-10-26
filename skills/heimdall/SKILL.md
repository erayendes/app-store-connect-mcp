---
name: heimdall
description: Work with an Apple App Store Connect account through Heimdall's MCP servers — App Store listings and metadata, TestFlight builds and testers, subscription and in-app-purchase prices, customer reviews, sales and analytics reports, certificates and provisioning profiles. Use this whenever the user asks about their app on the App Store or in App Store Connect, even if they never say "App Store Connect", "Heimdall" or "MCP" — including "change the price in Turkey", "reply to this review", "send the build to testers", "submit for review", "why did my downloads drop", "Türkiye fiyatını güncelle", "yorumlara bak", "TestFlight'a gönder". Also use it to install or set up the App Store Connect connection, to choose which profiles to register, or when an App Store Connect tool fails and the next step is unclear.
---

Heimdall is one binary serving several separately scoped MCP servers, one per
profile: `ASC-Monetization`, `ASC-Distribution`, `ASC-TestFlight` and so on.
Apple's API is 1011 operations, which costs more in tool definitions than most
context windows can spare, so a session carries one or a few profiles rather
than all of them.

Profiles are cut by job. App lookup, `asc__search_tools`,
`asc__discover_domains`, `asc__account_status` and the `media__*` tools are in
none of them: they live in **ASC-Core**, a server of its own that `register` and
`setup` add beside the profiles. A profile server carries them itself only when
started with `--with-core`, as the Xcode plug-ins are. Every server, ASC-Core or
not, has its own `asc__status`. If app lookup or search is missing from the
session, ASC-Core is not registered for this client; the fix is `register` or
`setup` (below), not another profile.

**This is the 3.0 beta.** Every command below uses `@erayendes/asc-mcp@beta`;
the stable `@erayendes/asc-mcp` is still 2.x and knows none of these profiles.
The commands the server itself prints already carry the right one.

## The credential boundary

Going after the API key is the single most common way a session goes wrong: in
recorded runs, of the sessions that left the tools behind, the largest group
went hunting for the private key and the next largest called Apple directly
with `curl`.

Neither is the way through, and the reason is worth stating exactly, because
the convenient version of it is false:

- The JWT is minted **inside the server, per request**, from a key the server
  reads at startup — on macOS out of the Keychain, elsewhere from a `.p8` on
  disk. A shell running as this user *can* reach that key:
  `security find-generic-password -w` prints it to whatever asks. So this is a
  rule, not a wall, and a session that tests it will find it gives way.
- Which is exactly why crossing it is the wrong move rather than an impossible
  one. A token signed outside the server skips the rate limiter, the
  write-confirmation gate, the dry-run path and the response shaping — every
  guard this server exists to apply. `curl
  https://api.appstoreconnect.apple.com/...` is not the fallback when a tool
  returns an error: unsigned it returns 401, and hand-signed it runs unguarded
  against real App Store data.

So when an App Store Connect tool fails, the next step is always another tool
call — `asc__status` to check the connection, `asc__search_tools` to find a
different operation — never the shell. If the credentials genuinely are not
configured, `asc__status` says so, and the fix is `setup` (below), which only
the user can run.

## Least privilege

No endpoint returns a key's role, so a 403 partway through a task is often the
first anyone learns the key is narrower than assumed. Before telling the user
their key is broken or asking them to mint an Admin one, call `asc__status`
with `check_capabilities: true` — one cheap probe per role family
(`reports`, `metadata`, `reviews`, `userManagement`, `provisioning`), each
`ok` / `forbidden` / `unauthorized` / `agreement` / `unknown`. `unknown` means
the probe was inconclusive (network, a 5xx, no app to test against) —
`agreement` means the account has an unsigned or expired agreement, the same
403 a narrow role gives for an unrelated reason. Never read either as a
denial that a wider key would fix — `agreement` in particular is not a role
problem at all, and no key clears it.

Four facts worth knowing before reaching for a wider key:

- **App Manager covers almost everything** — versions, builds, TestFlight,
  pricing, metadata. Most 403s are not a reason to go to Admin.
- **Admin is only load-bearing for two things**: user management, and the
  first-ever request of an analytics report type an account has never asked
  for before — that one request has no path in the App Store Connect UI at
  all, API-only. A `forbidden` on `reports` alone, everything else `ok`, is
  usually exactly this, not a broken key.
- **An `agreement` result means the account is blocked, not the key.** Say so
  and stop — only the Account Holder, signed in at
  [developer.apple.com/account](https://developer.apple.com/account), can
  clear it. Suggesting a new key here wastes a rotation on a problem it
  cannot touch.
- **Contracts, tax and banking are Account Holder-only, at every role.** No
  key reaches that page, Admin included. If a task needs it, say so and stop
  — the fix is a person signing in, not a wider key.

## Installing it

Two steps, and they are not both yours. **You register. The user hands over the
key.**

**1. Agree on profiles, then register.** Ask what the user works on. Say what
you are about to run and wait for a yes — this edits MCP client configs the
user did not open, usually more than the one you are talking through, and the
command has no prompt of its own:

```bash
npx -y @erayendes/asc-mcp@beta register monetization:subscription,subscription-offers analytics
```

`--clients=claude,codex` limits which configs it touches (ids: `claude`,
`codex`, `antigravity`, `vscode`, `cursor`, `windsurf`).

What `register` changes, which is what the user is saying yes to:

- **It adds** the profiles you name, and `ASC-Core` beside them.
- **It never removes a live profile** the user set up earlier, and re-running
  it with the same arguments changes nothing.
- **It does remove or rewrite three kinds of entry.** A server name from before
  2.5 (`asc-analytics`) moves to the current name. An entry whose profile no
  longer exists (`app-info`, `monetization:subscription-pricing` from 2.x) is
  deleted, if it is Heimdall's own, carries no credentials of its own and could
  be read in full; any other such entry is reported and left as it is. An
  entry on the other release channel (stable or beta) is rewritten to this one,
  keeping its flags and env. ASC-Core goes too from a client where no profile
  is left.

ASC-Core takes the strictest setting in each client: if any Heimdall entry
there is read-only (`--read-only`, or `ASC_READ_ONLY` in its env), ASC-Core is
registered `--read-only` too. It is **not added** where it cannot be shown to
sign in as the same account, and the output says why:

- the Heimdall entries there use different App Store Connect accounts;
- they carry credentials of their own in their `env`, while ASC-Core would use
  the shared config;
- the config, or one of its entries, could not be read in full — an entry that
  loads its environment from an `envFile` counts, since what it signs in with
  cannot be seen.

Relay that reason; do not add ASC-Core by hand to get around it.

**2. Send the user to `setup`.**

```bash
npx -y @erayendes/asc-mcp@beta setup
```

**Never run this yourself, and never ask for the `.p8`.** It is an App Store
Connect private key: do not ask for its contents, do not read it, do not write
it into a config. `setup` reads the file itself and stores the key in the
Keychain. It also needs a real terminal — run from an agent shell it exits at
the first prompt having done nothing, which reads exactly like success.

**3.** Ask the user to restart their MCP client, then to say *"check the App
Store Connect connection"* — that calls `asc__status`.

If the user would rather do it all themselves, `setup` alone covers both: it
collects credentials *and* registers with every client it finds, ASC-Core
included.

**Coming from 2.x.** A config from 2.x names profiles that no longer exist
(`app-info`, `monetization:subscription-pricing`). Such a server starts with a
single tool that says so. Neither `setup` nor `register` maps an old profile to
a new one: they delete such entries (when they are Heimdall's own and clean,
as above; others are reported), and the user picks the profiles again —
`app-info` is now `general`, the old money sub-profiles are
`monetization:subscription`, `in-app-purchases`, `subscription-offers` and the
rest.

## Choosing profiles

| The job | Profile |
|---|---|
| App name and subtitle, categories, countries, age rating, license, accessibility labels | `general` |
| Versions and their text, builds, export compliance, submitting and releasing | `distribution` |
| Subscriptions, in-app purchases, offers and codes, prices, customer transactions | `monetization` |
| Custom product pages, product page tests, in-app events, customer reviews | `marketing` |
| Builds under test, beta groups, testers, external testing, tester feedback | `testflight` |
| Team members, invitations, sandbox test accounts | `access` |
| Sales, finance and analytics reports | `analytics` |
| Certificates, bundle IDs, devices, provisioning profiles | `provisioning` |
| Achievements, leaderboards, challenges, matchmaking | `game-center` |
| Workflows, build runs and repositories | `xcode-cloud` |
| App Clips · Background Assets · event webhooks | `app-clips` · `background-assets` · `webhooks` |
| Screenshots, videos, images and files for any page or product, finding apps, searching tools | ASC-Core (added with every profile) |

No strong preference: `analytics`, `marketing` and `general` is a reasonable
default.

A large profile takes a colon and a list of sub-profiles —
`monetization:subscription,subscription-offers` is 64 tools where
`monetization` is 152. Worth suggesting for `monetization`, `game-center`,
`distribution`, `testflight`, `general` and `marketing`. The server is still
`ASC-Monetization`.

Heimdall serves 751 distinct tools across 14 profiles: 710 reachable Apple operations plus 41 hand-written tools.

## Prefer the macro over the chain

Several questions have a one-call answer that replaces walking a chain of
resources. Reach for these first — the raw tools stay available and are the
right choice for anything the macro does not cover.

| Instead of | Call |
|---|---|
| app → group → subscription → price points | `pricing__get_subscription_price` / `pricing__set_subscription_price` (`monetization:subscription`) |
| app → IAP → price schedule → prices | `pricing__get_iap_price` (`monetization:in-app-purchases`) |
| rebuilding an IAP's whole price schedule to change one country | `pricing__set_iap_price` (`monetization:in-app-purchases`) — keeps every other price |
| app → app price schedule → prices | `pricing__get_app_price` (`monetization:app-price`) |
| setting a price country by country | `pricing__equalize_price` (`monetization:app-price`, `in-app-purchases` or `subscription`) — one anchor price, Apple derives the rest |
| looking up a price point in every country, then building one offer body | `pricing__make_offer` (`monetization:subscription-offers` or `subscription-win-back`) — win-back, promotional or introductory offer, every country from one anchor price; introductory goes country by country and resumes |
| page → localizations → library placements → images and videos | `media__list` (ASC-Core) — the version page, a custom product page, a product page test, an in-app event or the library itself |
| an owner → its image or file → reserve, upload, commit | `media__list` / `media__upload` / `media__delete` (ASC-Core) with a file `target`: App Clip header and advanced experience images, Game Center achievement, leaderboard, leaderboard set, activity and challenge images, in-app purchase and subscription images and review screenshots, encryption documents, App Review attachments, routing coverage, background asset files, build upload files — the targets and their rules are in [MEDIA_TARGETS_en.md](https://github.com/erayendes/app-store-connect-mcp/blob/main/docs/MEDIA_TARGETS_en.md) |
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
| comparing store text across languages by eye | `metadata_ai__audit_localizations` (`distribution:version`) |
| drafting the store text for the languages asked for | `metadata_ai__draft_translation` (`distribution:version`) — your own model drafts it |
| pasting a translation into each locale | `metadata_ai__apply_localizations` (`distribution:version`) |

Two of these do something the raw tools cannot do at all, not merely faster:
`media__upload` performs Apple's reserve/upload/commit sequence (the raw tools
only reserve a slot and move no bytes), and `analytics__get_report` downloads
the report, where the raw chain ends holding a link.

## Reading a tool before calling it

- A description ending in `REVENUE-`, `RELEASE-`, `INFRASTRUCTURE-`, `ACCESS-`
  or `DESTRUCTIVE-level write.` marks a call whose consequence the HTTP method
  does not show — moving money, shipping a release, changing who has access,
  breaking code signing, or a replace that detaches whatever the list leaves out. Surface what will happen and get a yes before calling one.
- Where the client cannot show Heimdall's own prompt (the Claude desktop app's
  Code tab), such a write opens a macOS dialog and waits for an answer: tell
  the user to look for it. If it is still refused, relay that; never edit
  client config, set `ASC_CONFIRM_WRITES`, or reach Apple another way.
- Territories are ISO-3166 **alpha-3**: `USA`, `TUR`, `DEU` — never `US`, `TR`,
  `DE`. The two-letter form is not rejected; it returns 200 and an empty list
  that reads as "no data here".
- A server started with `--read-only` (or `ASC_READ_ONLY=true`) does not list
  any tool that can change something; asking for a write there is asking for a
  tool that is not loaded, not a permission problem.
- A tool that is not in this session's list may still belong to this account.
  `asc__search_tools` (on ASC-Core) covers the 826 operations Apple has not
  deprecated (all of them with `--include-deprecated`), plus the StoreKit and
  hand-written tools; under `--read-only` it leaves out the writes. It names
  the profile that owns each one, and the server's own error messages print the
  exact command to add it. Do not conclude the operation does not exist.
- StoreKit / customer transactions live on `monetization:transactions`. Each
  tool takes an optional `app` (name, bundle ID or Apple ID) and looks the
  bundle ID up; it can be left out when the account has one app or
  `ASC_BUNDLE_ID` is set. `environment` (`Production` by default, or
  `Sandbox`) is optional too.
- Subscriptions and in-app purchases are v2 only. The v1 localization, image
  and submission tools Apple retired are not served; use the `*_v2` tools and
  their versions.
- There is no way to add tools mid-session: some clients never show a changed
  tool list (the Claude desktop app's Code tab among them), and waiting a turn
  does not help. On a server started with only some of its sub-profiles, reads
  from the rest work at once through `asc__call`. For the tools themselves, run
  the `register` command the server's reply names — for example
  `npx -y @erayendes/asc-mcp@beta register testflight:groups,testers` — once the user
  says yes, then ask them to restart their MCP client.
