# What Apple's API doesn't tell you

🇬🇧 English · 🇹🇷 [Türkçe](PITFALLS_tr.md)

The App Store Connect API rarely fails loudly; more often it gives a plausible answer to the wrong question. This page collects the traps we hit on live accounts while building Heimdall. Under each one is what Heimdall does about it; the traps apply whether or not you use Heimdall.

## Wrong answers that are not errors

**Territory codes have three letters.** `USA`, `TUR`, `DEU`, not `US`, `TR`, `DE`. A two-letter code is not rejected: it returns 200 and an empty list, which reads as "no data in this country".
*Heimdall:* It turns `US`, `tr` or `tur` into `USA` and `TUR` before calling Apple, in every tool.

**Lists return links, not values.** A subscription's `/prices` list, for example, carries no price; without `include` on the price point you get only a relationship ID.
*Heimdall:* The `pricing__*` tools return the price, with its value, in one call.

**Apple returns no country names anywhere.** Not on a price row, not in `/v1/territories`. Anyone asked for a country-by-country table has to write the names themselves.
*Heimdall:* Pricing answers carry the country names, in the same order as the codes.

**A report request is not a report.** In Analytics, a new report request starts a pipeline that produces nothing for a day or more. "No instances" on a fresh request is the expected state.
*Heimdall:* `analytics__get_report` does not present that as a failure, and it never opens a report request as a side effect of a question.

**One report can arrive in several pieces.** A single instance can be split across segments; reading only the first gives a partial answer that looks complete.
*Heimdall:* It stitches the segments together and says how many there were.

**An empty StoreKit list is not "no purchases".** When `lookup_order` answers with `status` 1, Apple does not know the order ID.
*Heimdall:* The tool description says so.

**"None" sometimes comes back as 404.** An empty to-one relationship answers 404 or `data: null`; a retention messaging URL that was never set is a 404 too. Both mean "none", not a failure.
*Heimdall:* It returns those as "none"; permission, network and server failures stay errors.

**A key's role can never be read back.** A team key's role is chosen when it is created and never appears in any response. An individual key silently inherits its creator's roles and app restrictions. You find out a key is too narrow when a 403 lands mid-task.
*Heimdall:* `asc__status` with `check_capabilities: true` probes each area with one read request, up front. Which work needs which role is on the [Roles](ROLES_en.md) page.

## Accepted, and quietly wrong

**A submission for the wrong platform is accepted.** A submission carries a platform. Apple accepts one created as iOS for a macOS or visionOS version, and you notice only when the release does not appear where it should.
*Heimdall:* `release__submit` reads the platform from the version, and stops rather than guessing when it cannot.

**Stale text does not stop a submission.** A "What's New" describing the previous release, a promotional text naming a discount that ended, a locale translated in the live version and blank in the new one: the submission still looks complete, and App Review is the one who notices.
*Heimdall:* `listing__diff_metadata` puts two versions' text side by side, language by language.

**A bulk write that fails halfway does not say what landed.** A 409 on the eleventh locale leaves ten written, and the error does not say which.
*Heimdall:* It checks Apple's character limits before sending anything: description 4000, keywords 100, What's New 4000, promotional text 170, URLs 255.

## Error codes that point the wrong way

**A 403 means one of two things.** "The key's role is not enough" and "the account has an unsigned agreement" share the status. No new key or role fixes the second: only the Account Holder can, by accepting the current Program License Agreement at developer.apple.com. The "Agreements, Tax, and Banking" page in App Store Connect is a different agreement.
*Heimdall:* It reads the error code (`FORBIDDEN.REQUIRED_AGREEMENTS`) and names the right person and the right page.

**So does a 409.** Usually it means "this resource cannot change in its current state" (a version in review or already released is locked). An invalid value also comes back as 409 (`ENTITY_ERROR`).
*Heimdall:* It tells the two apart. It also validates the body against the schema before sending, so a mistyped field comes back with its path.

**A 401 in Production may not mean a broken key.** The App Store Server API answers 401 in Production for an app with no App Store release yet; Sandbox works before release.
*Heimdall:* It adds that to the error message.

**Notification history needs a date range.** Without a start and end date the request is refused (4000015), and the answer comes 20 records at a time.

## Ordering rules

**An app's first purchase cannot go to review alone.** The first in-app purchase or subscription has to be in the same submission as a new app version, and the first subscription version goes with its group's version.
*Heimdall:* `release__submit_items` checks this; `with_app_version: true` adds the version to the same submission.

**A screenshot still processing blocks the submission.** Apple refuses the submission with 409 until every placement has finished.
*Heimdall:* `preflight__check_version` catches it before you submit.

**Screenshots and previews are ordered separately.** Reordering both as one list returns 409.

**An in-app purchase version takes one image.** The version exposes an `images` list, yet a second image is refused with 409.

**The checksum algorithm in the schema may not work.** The schema offers SHA-256 on an upload commit, but on a live build upload (October 2026) Apple answered 409 and accepted MD5.
*Heimdall:* `media__upload` sends MD5.

**Submission items cannot include both experiment relationships.** Asking for both in one `include` returns 400; V2 is the live one.

**The old v1 endpoints are gone.** Apple retired the v1 localization, image and submission endpoints for subscriptions and in-app purchases, and v1 product page tests.
*Heimdall:* It builds only the v2 tools.

**There is a per-minute limit too.** Apple documents 3,600 requests per hour per key; an undocumented per-minute ceiling sits somewhere near 300.
*Heimdall:* It paces requests against both windows up front instead of waiting for a 429.

## What the API cannot do at all

These need the App Store Connect website:

- **App Privacy** (data-collection answers): no endpoint, yet every app needs them published before review.
- **EU trader status:** required to sell in the European Union; set once per account by the Account Holder or an Admin.
- **Agreement status:** Apple removed the endpoint that reported it.
- **Rejection reasons:** when Apple rejects an item, the reason is not in the API; read it in the Resolution Center.
- **The first request for a report type:** Admin only, with no path to it in the App Store Connect UI.
- **A new app record:** on many accounts the API cannot create one; create it once on the website, then manage it through the API.

*Heimdall:* `preflight__check_version` lists the first three in `manualChecks` every time, since `ready: true` cannot cover them.

---

Hit a trap that is not here? [Open an issue](https://github.com/erayendes/app-store-connect-mcp/issues).
