---
name: heimdall
description: Work with an Apple App Store Connect account through Heimdall's MCP servers — App Store listings and metadata, TestFlight builds and testers, subscription and in-app-purchase prices, customer reviews, sales and analytics reports, certificates and provisioning profiles. Use this whenever the user asks about their app on the App Store or in App Store Connect, even if they never say "App Store Connect", "Heimdall" or "MCP" — including "change the price in Turkey", "reply to this review", "send the build to testers", "submit for review", "why did my downloads drop", "Türkiye fiyatını güncelle", "yorumlara bak", "TestFlight'a gönder". Also use it to install or set up the App Store Connect connection, to choose which profiles to register, or when an App Store Connect tool fails and the next step is unclear.
---

Heimdall is one binary serving several separately scoped MCP servers, one per
profile: `asc-monetization`, `asc-distribution`, `asc-testflight` and so on.
Apple's API is 982 operations, which costs more in tool definitions than most
context windows can spare, so a session carries one or a few profiles rather
than all of them.

## The credential boundary

The API key is not reachable from a shell, and looking for it is the single
most common way a session goes wrong: in recorded runs, of the sessions that
left the tools behind, the largest group went hunting for the private key and
the next largest called Apple directly with `curl`.

Neither can work here, and this is a fact about the architecture rather than a
matter of care:

- The JWT is minted **inside the server, per request**, from a key held in the
  macOS Keychain. `security find-generic-password`, `env | grep ASC_`, grepping
  a checkout, or hunting for a `.env` cannot produce a working token — there is
  no long-lived credential sitting anywhere to find.
- `curl https://api.appstoreconnect.apple.com/...` therefore cannot be a
  fallback when a tool returns an error. Without a token it returns 401; the
  tools are the only path that has one.

So when an App Store Connect tool fails, the next step is always another tool
call — `asc__status` to check the connection, `asc__search_tools` to find a
different operation — never the shell. If the credentials genuinely are not
configured, `asc__status` says so, and the fix is `setup` (below), which only
the user can run.

## Installing it

Two steps, and they are not both yours. **You register. The user hands over the
key.**

**1. Agree on profiles, then register.** Ask what the user works on. Say what
you are about to run and wait for a yes — this edits MCP client configs the
user did not open, usually more than the one you are talking through, and the
command has no prompt of its own:

```bash
npx -y @erayendes/asc-mcp register monetization:subscription-pricing analytics
```

`register` only adds; re-running it changes nothing. `--clients=claude,codex`
limits which configs it touches (ids: `claude`, `codex`, `antigravity`,
`vscode`, `cursor`, `windsurf`).

**2. Send the user to `setup`.**

```bash
npx -y @erayendes/asc-mcp setup
```

**Never run this yourself, and never ask for the `.p8`.** It is an App Store
Connect private key: do not ask for its contents, do not read it, do not write
it into a config. `setup` reads the file itself and stores the key in the
Keychain. It also needs a real terminal — run from an agent shell it exits at
the first prompt having done nothing, which reads exactly like success.

**3.** Ask the user to restart their MCP client, then to say *"check the App
Store Connect connection"* — that calls `asc__status`.

If the user would rather do it all themselves, `setup` alone covers both: it
collects credentials *and* registers with every client it finds.

## Choosing profiles

| The job | Profile |
|---|---|
| Store listing text, names, categories, availability, age ratings | `app-info` |
| Versions, screenshots, submitting and releasing | `distribution` |
| Prices, subscriptions, in-app purchases, offers, customer transactions | `monetization` |
| Screenshots, custom product pages, in-app events, customer reviews | `marketing` |
| Beta groups, testers, team members | `access` |
| TestFlight build metadata, crash feedback | `testflight` |
| Sales, finance and analytics reports | `analytics` |
| Certificates, bundle IDs, devices, provisioning profiles | `provisioning` |
| Achievements, leaderboards, matchmaking | `game-center` |
| Workflows and build runs | `xcode-cloud` |
| App Clips · Background Assets · event webhooks | `app-clips` · `background-assets` · `webhooks` |

No strong preference: `analytics`, `marketing` and `app-info` is a reasonable
default.

A large profile takes a colon and a list of sub-profiles —
`monetization:subscription-pricing,subscription-offers` is 24 tools where
`monetization` is 204. Worth suggesting for `monetization`, `game-center`,
`distribution`, `marketing` and `access`. The server is still `asc-monetization`.

## Prefer the macro over the chain

Several questions have a one-call answer that replaces walking a chain of
resources. Reach for these first — the raw tools stay available and are the
right choice for anything the macro does not cover.

| Instead of | Call |
|---|---|
| app → group → subscription → price points | `pricing__get_subscription_price` / `pricing__set_subscription_price` |
| version → 50 localizations → screenshot sets → screenshots | `listing__get_screenshots` |
| reserving a screenshot, then uploading bytes yourself | `listing__upload_screenshot` |
| request → report → instance → segment → a URL | `analytics__get_report` |
| fetching reviews and grouping them by hand | `reviews_ai__triage` / `reviews_ai__daily_briefing` |

Two of these do something the raw tools cannot do at all, not merely faster:
`listing__upload_screenshot` performs Apple's reserve/upload/commit sequence
(the raw tool only reserves a slot and moves no bytes), and
`analytics__get_report` downloads the report, where the raw chain ends holding
a link.

## Reading a tool before calling it

- A description ending in `REVENUE-`, `RELEASE-`, `INFRASTRUCTURE-` or
  `ACCESS-level write.` marks a call whose consequence the HTTP method does not
  show — moving money, shipping a release, changing who has access, or breaking
  code signing. Surface what will happen and get a yes before calling one.
- Territories are ISO-3166 **alpha-3**: `USA`, `TUR`, `DEU` — never `US`, `TR`,
  `DE`. The two-letter form is not rejected; it returns 200 and an empty list
  that reads as "no data here".
- A tool that is not in this session's list may still belong to this account.
  `asc__search_tools` searches all 982 operations and names the profile that
  owns each one; the server's own error messages print the exact command to add
  it. Do not conclude the operation does not exist.
