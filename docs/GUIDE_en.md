# Guide

🇬🇧 English · 🇹🇷 [Türkçe](GUIDE_tr.md)

## Confirmation before risky changes

**Confirmation before risky changes is on by default.**
When you ask to change a price, give someone Admin access or delete a certificate, Heimdall opens a confirmation in the app you use (Claude, Cursor…) and shows what will change. So even if the AI reads "lower the price a bit" as `0.99`, nothing changes until you approve it.

## One call instead of a chain

A question that looks simple in App Store Connect often takes a long series of requests. To answer *"What does this subscription cost in each country?"*, the AI has to find the app, then the subscription group, then the subscription, then look up the price in 175 countries one by one.

We measured it in a real session: **that one question cost a million tokens and 3 dollars.** With Heimdall, the same question is answered **in a single call, in 2 seconds.**

The workflows below turn chains like that into a single step. You don't have to do anything; the AI picks the right one on its own.

| Instead of this chain | One workflow | Profile it needs |
|:--|:--|:--|
| app → group → subscription → price points | `pricing__get_subscription_price` — one country, or prices in ~175 countries grouped by amount if you don't name one | `monetization:subscription` |
| app → in-app purchase → price schedule → prices | `pricing__get_iap_price` — current and scheduled prices by country | `monetization:in-app-purchases` |
| app → price schedule → prices | `pricing__get_app_price` — current and scheduled prices by country | `monetization:app-price` |
| the same chain, plus the change | `pricing__set_subscription_price` | `monetization:subscription` |
| in-app purchase → price points → a new price schedule built by hand | `pricing__set_iap_price` — one country's price; every other manual and scheduled price is kept | `monetization:in-app-purchases` |
| setting prices country by country | `pricing__equalize_price` — you set one base price and Apple works out every other market; for apps, in-app purchases or subscriptions | `monetization:app-price`, `in-app-purchases` or `subscription` |
| pricing a win-back, promotional or introductory offer country by country | `pricing__make_offer` — you set one base price (or a free trial) and the offer is made in every country the subscription is sold in; an introductory offer goes country by country and picks up where it stopped | `monetization:subscription-offers` or `subscription-win-back` |
| create a submission, add the version, submit — three calls in that order | `release__submit` | `distribution:publish` |
| the same for an in-app purchase, subscription, in-app event, custom product page, product page test, Game Center item or background asset | `release__submit_items` — several items in one submission; it reads what is already in it, lists everything before you confirm, and can add the app's version when the item has to go with it | the item's own sub-profile, e.g. `monetization:in-app-purchases` |
| find the build, look up the beta groups, add the missing links | `testflight__assign_build_to_groups` | `testflight:groups` |
| comparing store text across forty languages by eye | `metadata_ai__audit_localizations` | `distribution:version` |
| pasting translations into each language by hand | `metadata_ai__apply_localizations` — from a CSV or JSON file | `distribution:version` |
| version + build + review details + localizations + screenshots, to answer "can I submit?" | `preflight__check_version` | `distribution:version` |
| subscription + group localizations + prices + availability + review screenshot | `preflight__check_subscription` — what's missing before review | `monetization:subscription` |
| comparing two versions language by language | `listing__diff_metadata` — only the fields that differ, plus languages added or dropped | `distribution:version` |
| page → localizations → library placements → images and videos | `media__list` — the version page, a custom product page, a product page test, an in-app event or the library itself, with Apple's count and size limits | ASC-Core |
| an App Clip, Game Center item, in-app purchase or subscription → its image → reserve, upload, commit | `media__list` / `media__upload` / `media__delete` with a file `target` — also review screenshots and attachments, encryption documents, routing coverage, background asset and build upload files; one check of the file and its owner before anything is sent. Every target and its rules: [Media targets](MEDIA_TARGETS_en.md) | ASC-Core |
| reserving a library image or video, uploading the bytes, then placing it on a page | `media__upload` — into the library, and onto a page if you name one | ASC-Core |
| placing, reordering, removing from a page, setting a video's poster frame, archiving or renaming | `media__arrange` | ASC-Core |
| deleting several library files, or taking them off a page, under one confirmation | `media__delete` — checks every file belongs to that app and page before it deletes any | ASC-Core |
| request → report → instance → segment → signed URL | `analytics__get_report` — returns rows, not a link | `analytics` |
| app → crash and screenshot feedback → crash logs | `testflight__feedback_digest` — counts per build, device and OS, tester comments and short crash log excerpts | `testflight:feedbacks` |
| app → Xcode Cloud product → run → actions → issues and tests | `ci__diagnose_run` — finds the most recent failure among the last 40 runs and lists its issues and failed tests | `xcode-cloud:workflows` |
| pulling reviews and sorting them by hand | `reviews_ai__triage`, `reviews_ai__daily_briefing`, `reviews_ai__draft_response` | `marketing:customer-reviews` |
| listing your apps, checking each one's version, then making sense of their App Store status | `asc__account_status` — which app is live, which is on its way, and whether the next move is yours or Apple's | ASC-Core |

"ASC-Core" means the tool is on ASC-Core, the server setup registers next to your profiles. A profile server does not carry it; an app that runs only one server gets it with `--with-core`.

`pricing__equalize_price` changes prices in about 175 countries at once, so it goes straight to your revenue. That's why it always asks for your approval before it runs.

## Calling an app by name

You don't need to know an app's App ID to work with it. Heimdall also accepts **the app's name or bundle ID** instead of the numeric ID and looks up the right ID before the call. So you can say *"List Acme's versions"* without finding Acme's ID first.
This applies to apps. For other records it isn't a general rule: some workflows also take a build number or a subscription name, but most tools need the record's own ID.

## StoreKit 2 — customer transactions

The App Store Server API answers questions about individual customers rather than your store listing: purchase history, entitlements, refunds, subscription status.
It comes with `monetization:transactions`. Name the app in your request (*"Ask Quran's refunds for this transaction"*); Heimdall looks up its bundle ID. With only one app on the account you don't even need to name it.

## Prompts

Three workflows are available as MCP prompts. Type `/` in your app (Claude, Cursor…) and they show up as commands.

| Prompt | What it runs | When it's available |
|:--|:--|:--|
| `release-readiness` | `preflight__check_version`, then `listing__diff_metadata`, ending in GO or NO-GO | `distribution:version` |
| `review-triage` | briefing → triage → a draft reply per review, none of them sent | `marketing:customer-reviews` |
| `price-check` | prices worldwide in one call, then the ones that look like mistakes | `monetization:subscription` |

A prompt only appears when all the tools it uses are installed. Each one stops before changing anything: submitting, replying and changing prices are your call.

## Examples

> **You:** Check my App Store Connect connection, then list my apps.
>
> **AI:** *(calls `asc__status`, then `apps__list`)* Connected. You have 3 apps: Acme (1234567890), Beta, Gamma.

> **You:** Is Acme's current version ready to submit?
>
> **AI:** *(calls `preflight__check_version`)* Version 3.2 is ready to submit: the build is attached, and the screenshots and descriptions are complete in every language.

> **You:** Is there a tool for managing in-app events? *(you haven't installed `marketing`)*
>
> **AI:** *(calls `asc__search_tools`)* Yes: the `app_events__*` tools, in `marketing:app-events`, which isn't installed. To add it, run `setup` again and pick the `marketing` profile, or just its `app-events` part.

> - Submit version 3.2 for review and start a phased release once it's approved.
> - Show last week's TestFlight crash reports grouped by device model.
> - Show my subscription groups and what each tier costs in Turkey, Germany and the US.
> - This customer says they were charged twice — transaction ID 2000000891234567. What does their history show, and are they entitled right now?

> Add sara@example.com to the Insiders group and give them the latest build. → The tester is added to the account first, then to the group; the build goes to the group.

> Start version 3.2, attach build 412 and tell me what's missing before I submit. → The "what's missing" part runs a single check: it reads the version, the build, the screenshots and every language, and names the tool that fixes each gap.

> Replace the Turkish keywords with these and leave the other languages alone.

> Show this week's unanswered 1-star reviews and draft a reply in each review's language. → The reply is written by your own AI; the reviews aren't sent to any other service, and you don't need a second API key.

> Clear our sandbox account's purchase history and set its country to Turkey.

> Download last month's sales report and give me the top five countries by units. → You need to have entered your Vendor number in setup. **Finance and sales are different reports.** `finance_reports__list` is what Apple pays you, by region and currency. `sales_reports__list` is units and revenue, daily, weekly, monthly or yearly. To see what Apple actually pays you, look at the finance report.

> What are TestFlight testers saying about build 2026100412 this week?

> Check Acme's Monthly subscription before review and list what's missing from its catalog. Then check every subscription in the Premium group. → It looks at one subscription, or up to 20 in a group, and names the tool that fixes each gap.
