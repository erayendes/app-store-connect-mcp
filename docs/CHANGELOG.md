# Changelog / Değişiklik Günlüğü

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/), and the project follows [Semantic Versioning](https://semver.org/). Entries are newest-first.

## English
### [Unreleased]

#### The startup banner counts what the client will actually receive
`asc-monetization (206 tools)` and a client showing 199 was the same server disagreeing with itself. The banner quoted the operations the profile *maps*; `tools/list` answers with what is served, and those differ by configuration — `asc__call` and `asc__describe` are always there and mapped nowhere, StoreKit only loads with a bundle id, `--read-only` removes the writes, and since this release `--include-deprecated` adds tools too.

Both now come from one list, so they cannot drift: the count is the length of the array the handler returns. `asc__status`'s token estimate follows it for the same reason — it exists to answer "what is this costing my context", which is a question about what was loaded.

The catalogue number is unchanged and still means what it says: 883 tools across 13 profiles, in the README, `server.json` and `CITATION.cff`, cross-checked by the release pre-flight.


#### `--include-deprecated` does something in profile mode
It was a no-op there and said nothing about it. Profile membership is hand-curated in `spec/profiles.csv` and nobody curates an endpoint Apple has retired, so **0 of the 123** deprecated operations were reachable from any profile — the flag only ever worked on the no-profile server with `--domains`.

Passing it now adds the retired operations of the domains the profile covers. Measured: `game-center` goes 184 tools to 298, `monetization` 199 to 208. Membership is by domain rather than by curation, which is the honest definition rather than a shortcut — "everything retired in the areas this profile covers" is what someone passing this flag is asking for, and there is no curated answer to inherit.


#### StoreKit reads can return verified fields instead of a sealed envelope
Set `ASC_APPLE_ROOT_CERTS` to Apple's DER root certificates — paths, or one directory — and `storekit__get_transaction_info`, `storekit__get_transaction_history` and `storekit__get_refund_history` verify each payload with the App Store Server Library and return decoded fields. Leave it unset and they return the signed payloads exactly as before, which is what their descriptions already promised. Every response says which one it is, so a caller never has to infer it.

Nothing is decoded without being checked. A payload that fails verification is an error, not fields with a caveat attached: the point of verifying is that the result can be treated as fact, and "here are the values, but we could not confirm them" invites the reading it was supposed to prevent.

The decoded shape is an allowlist rather than Apple's whole payload. `appAccountToken` is left out deliberately — it is the UUID a developer maps to their own user record, so a transaction id becomes a route back to an account inside their app, and none of these tools was asked for that. `raw: true` returns the signed payload for anyone who wants to verify it themselves.

No certificates ship in this package. They are Apple's to publish and one more thing to keep current, and a stale one would turn verification into a silent no.


#### StoreKit reads stop promising fields they do not return
`storekit__get_transaction_info` advertised "the decoded details of a single transaction: product, price, dates, ownership type and revocation state" and returns one signed JWS string. The history, refund and entitlement tools do the same with whole arrays of them. A caller planning around five named fields receives `header.payload.signature`, nothing crashes, and there is no way to tell whether the wrong tool was called.

The descriptions now say the payloads are signed and that the caller verifies and decodes them, with the App Store Server Library's `SignedDataVerifier` named once rather than on all four — repeating it put the word "certificates" into four descriptions and took the top of "create certificate" off `certificates.create`.

Returning the sealed envelope stays the behaviour. `jwsClaim` could open it in two lines, and those are the wrong two lines: it base64-decodes without checking the signature, which is presenting unverified data as fact. Decoding properly needs Apple's roots and a decision about what happens when verification fails, which is MIL-218 — now named in a code comment so the next reader knows the envelope is the interim answer rather than the intended one.


#### A price list that says it carries no prices
`subscriptions.prices.list` was described as showing "what a subscription costs today" and returns rows with no amount and no currency — the number lives in the price point, one `include` away. A live eval session believed the description: it called the tool fifteen times, gave up, pulled all 842 price *points* instead, and reported "2.99 – 35 TRY" as the current price. The real answer was a single number.

The description now says what a row actually is and names `pricing__get_subscription_price`, which resolves it in one call. Nine sibling lists have the same shape — offer prices, app prices, in-app purchase prices — and they get the instruction from a rule rather than nine hand-written strings: a list whose `include` enum offers a `*PricePoint` is a list whose rows are empty without it.

That note lands on the `include` **parameter**, not the tool description, and the placement was measured. Putting it in the descriptions gave nine tools the same sentence about prices and currencies, and `subscriptions.prices.list` fell from first to fifth on *"List current subscription prices worldwide"* — two offer-price lists above it. The search ratchet caught it before it shipped.


#### The agent harness can measure the write gate now
`npm run ax:agent --gate` runs the corpus with the write path live and confirmation on for every write, so the gate is genuinely in the path. Every prompt is declined, so nothing reaches Apple — the decision is taken before the request is built, the same property `tests/gate.test.ts` relies on.

Every other mode runs `--dry-run`, and dry-run skips confirmation outright. So the destructive-intent score has always answered "did the agent decide to write?" and never "would this server have stopped it?" — five of eight destructive intents wrote in the July calibration, and that number said nothing about the product.

The Agent SDK declines an elicitation on its own when no handler is given, which is indistinguishable from the gate never firing. `--gate` installs a handler that records the prompt first and then declines, which is what turns the mode into a measurement rather than a silent no. The `By gate` table reports the number worth acting on: sessions that called a write with nothing asking first.


#### A failed call answers with fields, not a sentence
An Apple rejection used to come back as three lines of prose, which meant an agent deciding what to do next had to parse English to learn whether trying again could work. It now returns JSON: `status`, `retryable`, `appleRequestId`, `suggestedAction`, and `issues[]` carrying Apple's own `code`, `title`, `detail` and — new — `source`, which names the field or parameter that was rejected. `source` was being dropped from the type before it could reach anyone, though Apple has been sending it all along.

Our own refusals stay prose. A wrong profile or a read-only block answers with hand-written multi-line guidance — the register command, the sub-profile to load — and JSON would turn that into a wall of escapes. Only a real HTTP failure gets the structured shape.


#### Confirmation is back on, for the writes that are hard to undo
The gate now defaults to the four levels the risk manifest calls `revenue`, `destructive`, `infrastructure` and `access` — changing a price, handing out Admin, deleting a certificate, pulling an app from sale. Everything below them runs on the client's own per-call tool approval, which is the gate that always exists.

Both extremes were tried first and both were wrong. **On for every write** (through 2.0.0) fired constantly, and a client that declares elicitation support but cannot render the form answers `decline` — which the protocol reports identically to a user refusing — so ordinary writes came back as "you refused" on those clients. **Off entirely** (2.0.1 through 2.1.1) made the misfire go away by removing the guard from the writes that move money, which is the one place it was worth its cost.

- `--confirm` / `ASC_CONFIRM_WRITES=1` asks before every write, as before.
- `--no-confirm` / `ASC_CONFIRM_WRITES=0` asks before none. It is a real setting again rather than the no-op it became in 2.0.1.
- The risk level is read before the preview is built, so a `low` write no longer pays for the reference lookups behind a prompt it was never going to show.
- `tests/gate.test.ts` covers both halves from the same server: a `destructive` write is asked about with no flag, a `public` one is not. Testing only the quiet half would have passed with confirmation removed entirely.


### [2.1.1] — 2026-08-14

**2.1.0 shipped without these.** The tag was cut at a commit two PRs behind `main`, so everything below is on `main` since 10 August and reached nobody. Two of them are security fixes; upgrade rather than pin 2.1.0.

#### `listing__upload_screenshot` would upload any file it could read
`file_path` comes from the model, and everything after it read that file and PUT it to Apple. Pointing it at a `.p8`, an SSH key or a config sent the bytes and learned afterwards that Apple rejects them — by which point they had already left. The first eight bytes (PNG signature, JPEG marker) settle it before any network call, with a 50 MB ceiling behind that.

#### `downloadAsset`'s size cap was a report, not a limit
It checked the 64 MiB ceiling after `arrayBuffer()` had already buffered the whole body, so an oversized response was refused only once it was in memory. It now rejects an oversized `Content-Length` up front and streams, cancelling the transfer at the cap.

#### Six reads returned one page as if it were everything
Four analytics hops, the subscription-group listing and both StoreKit histories stopped at the first page or a page cap and said nothing about it.

- **`analytics__get_report`** — report requests, reports, instances and segments all paginate now. A report on page two came back as *"No report matching …"*.
- **`listSubscriptions`** — walks group pages and merges each page's `included`. A subscription past the first 50 groups read as *"not found"*, which is the message someone answers by creating a duplicate.
- **StoreKit transaction and refund history** — return `hasMore`, Apple's `revision` cursor and an explicit partial-history note. *"No refunds"* and *"no refunds in the first ten pages"* were the same response, and the second is what someone grants goodwill credit against.
- **`reviews_ai__daily_briefing`** — stops once it has covered the compared window rather than at three pages, and marks its counts as lower bounds when it could not cover it. A trend over a window that was never fully read is not a trend.

#### Fixed
- **An ambiguous subscription name put a price write on the wrong product.** A partial name took the first match. Exact product ID or name still wins outright; two substring candidates is now a question.
- **`readPrice` could report a price the app stopped charging years ago.** The price in effect is the latest start date that has passed, not the first non-scheduled row Apple happened to send.
- **`max_rows` accepted a negative and then dropped rows.** `Number(x) || 200` let it through as truthy and `slice(0, -5)` cut the last five instead of returning five. Clamped once to `[1, 1000]`.
- **A failing CLI registration could delete a working one.** The add goes first now; the remove only runs once the add has been refused, and if the remove fails too the add's error survives — otherwise a missing flag was reported as "no such server", sending the reader after a registration that was never there.

#### Security
- **Results carrying end-user text say so.** Review bodies and tester feedback reach the model through the generated tools with nothing marking them as data rather than instructions, and they sit next to write tools a review could ask the model to call. The reviews macro has had that rule since it shipped; the generated path has it now too.
- **Optional PII redaction.** `ASC_REDACT_PII=1` masks `email`, `firstName` and `lastName` on tester payloads, keeping the email domain. Off by default: listing testers is how someone answers *"who hasn't installed the build?"*, and an answer naming `<redacted>` five times is one the caller has to go around this server to get.
- **The Docker image runs as `node`, not root**, and the throwaway key file it generates is `600`.

#### Documentation
The `Dockerfile` header claimed two consumers that do not read it. Glama builds from its own spec — `debian:trixie-slim`, pnpm, `mcp-proxy` — and the MCP Registry installs the npm package `server.json` declares. Editing that file changes neither, and a failed Glama build says nothing about its contents.

### [2.1.0] — 2026-08-10

#### Risky writes look risky in the tool list
Every mutating operation already carried a hand-reviewed risk level, but it only reached the model through `--dry-run`, `asc__describe` and the `--confirm` prompt — and that prompt has been off by default since 2.0.1. The one signal that always shipped, `destructiveHint`, meant exactly "this is a DELETE". So **100 non-DELETE writes that move money, ship a release, change who has access or break code signing were indistinguishable from `beta_groups__create`** in a plain tool list: `app_price_schedules__create`, `app_store_version_release_requests__create`, `apps__promoted_purchases__replace` among them.
- The level now appears in the description of the ~120 operations where the HTTP method cannot show it, as `REVENUE-level write.` and so on. It costs 443 tokens across a typical eight-server setup — 0.35% of the tool definitions.
- **`destructiveHint` now means what MCP says it means**, "may perform destructive updates", not "is a DELETE". **Clients that gate on this hint will ask for approval on more tools than before.**
- `app_store_versions__build__set` was classified `low` because the release rule matched only `create|update`. Swapping the binary under a version is a release step.

#### `pricing__equalize_price` — one anchor price, every country derived by Apple
For an app, an in-app purchase or a subscription. Give the anchor territory and the price; Apple's own currency and tax maths decides every other market. The number is never copied across currencies, because it cannot be — anchored at 3.99 TRY, Apple returns 0.99 USD for Afghanistan and 2.99 AED for the UAE.

The three product types do not share a write model, and the macro does not pretend otherwise:

| Product | Writes | Who equalizes |
| -- | -- | -- |
| App price | 1 (`appPriceSchedules`) | Apple, from `baseTerritory` |
| In-app purchase | 1 (`inAppPurchasePriceSchedules`) | Apple, from `baseTerritory` |
| Subscription | ~175, one per country | us, from the equalizations endpoint |

`subscriptionPrices` has no base territory, so that path reads Apple's equalizations and then writes each country separately. It writes the anchor **first**, so a failure part-way leaves the country you actually named already set; it stops at the first error rather than spreading an unknown state, and the result names exactly which countries landed, which one failed, and how many are untouched. Re-running is safe — setting a price that is already set changes nothing.

`preserve_current_price` is required for subscriptions, as on the single-territory macro, and the confirmation prompt spells out that "existing subscribers WILL be moved" now means worldwide. Apps and in-app purchases have no subscribers and do not ask.

Run it under `--dry-run` first: the subscription path returns the full derived table before anything is sent.

#### `pricing__get_subscription_price` answers "in every country", not just one
`territory` was required, so the macro could only ever answer about one country. Asked "what does this subscription cost in each country?", a live eval session called the macro, found it did not answer the question, walked the raw chain instead, and spent 1.02M tokens and $3 writing the result to a CSV alongside a hand-written country-name dictionary in Python.

Omit `territory` now and the answer covers every country Apple sells in, grouped by price so it stays readable: measured live, 175 territories collapse to 45 distinct prices — 91 countries share one of them — and the whole thing is about 1.3k tokens. The currency comes back with each group, which is the other half of an answer that "19.99" alone does not give. So is the country name: Apple returns one nowhere — not on a price row, not on `/v1/territories`, which carries the code and the currency and nothing else — which is why that eval session hand-typed a 175-entry dictionary, and then did it again on a later run. Each group now carries `countryNames` alongside `territories`, in the same order.

Single-country calls are unchanged, except that the response names the country too.

#### Upload a screenshot, read a report — two things the raw tools could not do
Both were chains that ended somewhere the API does not go.
- **`listing__upload_screenshot`** performs Apple's reserve → upload → commit sequence with the MD5 checksum. The raw `app_screenshots__create` only reserves a slot and moves no bytes, so the chain could not be finished from the tools at all.
- **`analytics__get_report`** walks request → report → instance → segment, downloads the gzipped TSV behind Apple's signed link and returns rows. The raw chain ends holding a URL. It will not start a report request: that is an ongoing commitment on the account, not a side effect of a question.

#### Fixed
- **`listing__get_screenshots` shipped in 2.0.0 unreachable.** Its family was missing from the profile generator's known list, so no row for it could exist in the curation sheet and no profile-mode server offered it. Both listing macros now live under `distribution:version`. `pricing__get_subscription_price` was missing a row too — it worked, but the per-sub-profile tool counts were short by one.
- **`review_submissions__create` was described as submitting a version for review.** It takes an *app*, not a version, and opens an empty submission; the version goes in as a separate item and nothing reaches Apple until `submitted` is set. An agent that stopped after the first call reported a release it had not shipped. The three steps now each say what they are not.
- Curated descriptions for the review-submission chain and both ends of the analytics chain; AXIS1 findability debt 718 → 712.
- **The tool count had drifted to three numbers across four surfaces** — `server.json` and `CITATION.cff` said 868, the GitHub repo description 875, the README 883 — and `CITATION.cff` was two releases behind at 2.0.0. All now say 883 (859 reachable operations plus 24 hand-written tools), and the release pre-flight compares the `CITATION.cff` version and the tool count on all three surfaces, failing the release on a mismatch instead of shipping it.
- **`.claude-plugin/plugin.json` pointed its homepage at `erayendes/asc-mcp`**, a repository that does not exist.

#### For contributors
- **`npm run ax:agent` did not run** — it read a field the `Profile` type does not have and threw on import.
- `--skill=<dir>` and `--wrong-profile` for A/B-ing a skill document, with per-session `reachedForCredentials` / `calledAppleDirectly` booleans and a `By skill` table printed as deltas against the control arm. `SHELL_KINDS` was undercounting: `security find-generic-password` and a bare `curl` at Apple were only recorded when piped through a filter word.

#### Added
- **A `heimdall` skill, installed by `register`** for the clients that read `SKILL.md` (Claude Code, Codex). It carries what has no other channel before the server exists: that the API key is minted inside the process per request and cannot be found in a shell or replaced by `curl`, which in recorded sessions was the single most common way a run went wrong. Roughly 200 tokens sit in context; the body loads only when the skill triggers.

### [2.0.1] — 2026-08-09

#### Write confirmation is opt-in
**Behaviour change.** The confirm-before-write gate is **off by default** now; turn it on with `--confirm` / `ASC_CONFIRM_WRITES=1`.

The gate that always exists is the client's own per-call tool approval. This one is second, and it only works where the client renders an elicitation form — a client that declares the capability but cannot show the form answers `decline`, which the protocol reports identically to a user refusing. So on those clients the guard blocked working writes with "the write was not confirmed", pointing the user at their own client's permissions instead of at the setting that caused it. Whether the form renders is a per-client fact, so the choice belongs to whoever configures the server.

Nothing is lost when it is off: the impact preview still prints under `--dry-run`, and `--read-only` still removes every mutating tool.
- **`--allow-unconfirmed-writes` / `ASC_ALLOW_UNCONFIRMED_WRITES` removed.** It only ever applied to clients that declared no elicitation support, and asking for confirmation and for unconfirmed writes at once was self-cancelling.
- **`--no-confirm` is now a no-op** — it lands on the new default, so existing configs keep working unchanged.
- **The decline message says what actually happened**: if no prompt appeared on screen, the client answered for you.

### [2.0.0] — 2026-08-05

#### Profiles are curated, not derived
**Breaking change — every profile changed.** Which tool belonged to which profile was read off the URL, so every relationship hanging off an app landed in `app-info` and eight of eleven profiles could not reach their own resources from an app. Membership is hand-curated in `spec/profiles.csv` now and generated into the code.
- **13 profiles**, up from 11. New: `access`, `app-clips`, `testflight`.
- **`user-management` is gone**, split into four. A config still naming it starts anyway, with a single tool explaining the split.
- **Every profile changed size** — `app-info` goes from 112 tools to 57. **Check your config**; the tool you reached for may be in another profile now.

#### Sub-profiles
32 sub-profiles across five profiles. A profile narrows with a colon: take `monetization` at 204 tools, or `monetization:subscription-pricing` at 24.
Some tools belong to more than one, so reaching a single tool no longer means loading a whole profile. The setup picker unfolds a checked profile's sub-profiles under the cursor, all on, and writes the argument for you; `asc__status` reports which are loaded and roughly what they cost.

#### Any tool in the profile, on any client
`asc__describe` + `asc__call` are present from the start, so nothing depends on a client refreshing its tool list mid-session.
`asc__call` is read-only; writes keep their own names and their confirmation gate.
`asc__load` adds a sub-profile mid-session for clients that do refresh.

#### Setup registers with every client you have installed
`setup` knew one command, `claude mcp add`, and left the rest to the user on a machine with Codex and Cursor.
- **It detects the clients on the machine and asks which to install into:** Claude Code, Claude Desktop, Codex, Antigravity, Cursor, Windsurf, VS Code.
- **The vendor's own command writes where one exists** (`claude`, `codex`, `code --add-mcp`); plain JSON configs are backed up and edited. One that cannot be parsed is left untouched and reported with a block to paste. A client failing never stops the others.
- **`register` is the same work without a terminal**, for an agent installing on your behalf: `asc-mcp register monetization:subscription-pricing analytics`. It only adds; removing is `setup`'s job.

> [!NOTE]
> ChatGPT's own connectors accept only remote HTTPS servers, so Heimdall cannot appear there; it runs on your machine over stdio, which is why the private key never leaves it. The Codex entry covers the CLI, the IDE extension and the Codex side of the ChatGPT desktop app — the three share one config file.

#### Fixed
- **A misspelled filter changed which app you were editing.** `filter[bundleId]` was dropped silently, ran unfiltered and returned the account's first app. Both spellings are accepted now.
- **The binary exited 0 with no output when invoked through a symlink.**
- **Tool search returned nothing for queries in any language but English, and never said why.** It returns results in every language now, and an empty result explains itself.
- **Tool search offered tools the server refuses to load.**

#### Added for contributors
An agent-experience harness: a 50-intent corpus with adversarial goals run n times rather than once, a contract check across all 982 operations for unstamped risk levels and `readOnly` disagreeing with the HTTP method, and a live write-path probe that creates and deletes a TestFlight group on a throwaway app — the only check that exercises token to POST to Apple's answer, since every other one runs `--dry-run`. `tests/gate.test.ts` proves the write gate fires end to end over stdio rather than merely classifying correctly.

### [1.3.0] — 2026-07-28

Safety and usability release: every write is now schema-checked locally, previewed before confirmation, and never silently resent.

- **Writes are never auto-retried into duplicates.** Reads still retry on 408/429/5xx; writes retry only on 429 (rejected before processing). A write that dies without a response reports an explicit unknown outcome — "Apple may or may not have processed it, verify before resending" — instead of being resent. `Retry-After` HTTP-date form supported.
- **Fail-closed confirmation.** On clients without elicitation support, writes are now blocked with an error instead of silently proceeding; opt in explicitly with `--allow-unconfirmed-writes` / `ASC_ALLOW_UNCONFIRMED_WRITES=1`.
- **Real request-body schemas.** All 355 body-taking operations carry a resolved JSON Schema (attributes, relationships, enums, required fields, closed-world objects) instead of a generic "JSON:API body" hint, and every write body is validated locally — a typo'd field or wrong enum fails with a field path before anything reaches Apple.
- **Impact preview, risk levels and typed confirmation.** The confirmation prompt shows the operation, target ids, account, a summary of the changes and a reversibility note. Every mutating operation carries a hand-reviewed risk level (low / public / release / revenue / destructive / infrastructure / access); revenue, destructive, infrastructure and access writes require typing CONFIRM instead of ticking a box.
- **`--dry-run` / `ASC_DRY_RUN=1`:** mutating calls validate and return what would have been sent (method, path, body, risk) — nothing reaches Apple. For CI and agent rehearsals.
- **Reviews-AI hardening:** reviews travel to the model as untrusted JSON data (prompt-injection defense), statistics are computed deterministically with a previous-period trend comparison, truncation is reported honestly (fetched vs analyzed), drafts reply in the review's language, and brand voice / banned phrases / support URL come from `ASC_REVIEWS_*` env vars. Tools hide on clients without sampling support.
- **`ASC_BASE_URL`** points the whole server at a local fixture for testing; host-pinning follows the override.
- `asc__status` gains `check_expirations` — certificates and provisioning profiles expiring within 30 days.
- Actionable hints on 403 (role lacks permission) and 409 (resource-state lock) errors, alongside the existing 401 hint.
- GUIDE: multi-account patterns with existing mechanisms (per-server env, `ASC_CONFIG_DIR`).

### [1.2.0] — 2026-07-26

- **Write confirmation.** Before any mutating tool runs (changing a price, submitting for review, deleting a resource), the server asks the user to confirm via [MCP elicitation](https://modelcontextprotocol.io/) — a vague or misread instruction can no longer execute unchecked. On by default; turn it off with `ASC_CONFIRM_WRITES=0` or `--no-confirm`. Clients without elicitation support fall back to their own per-call approval, with a one-time notice.

### [1.1.4] — 2026-07-25

- First npm release carrying the lazy private-key parsing from 1.1.3 — the server boots without valid credentials, so tool discovery and introspection work before setup. Funding simplified to Buy Me a Coffee only (Patreon removed). No API changes.

### [1.1.3] — 2026-07-23

- **The server starts without a usable private key.** The signing key is now parsed lazily on the first API call instead of at startup, so tool discovery — and automated introspection harnesses like Glama that only call `tools/list` — no longer need valid credentials to boot. An invalid key surfaces on the first real request rather than blocking startup.

### [1.1.2] — 2026-07-22

- Added the `mcpName` field (`io.github.erayendes/asc-mcp`) to `package.json` so the server can be published to the official [MCP Registry](https://registry.modelcontextprotocol.io). No functional change.

### [1.1.1] — 2026-07-22

- **CLI messages now show a command that works without a global install.** The help text, the "missing config" and "invalid config" errors, and the StoreKit hint print `npx -y @erayendes/asc-mcp setup` instead of a bare `asc-mcp setup` — the latter only exists after `npm i -g`. `GUIDE.md §7` spells out the re-run command too.

### [1.1.0] — 2026-07-22

- **Rebrand to Heimdall.** The project is now *Heimdall — App Store Connect MCP*. The npm package (`@erayendes/asc-mcp`) and the command (`asc-mcp`) are unchanged.
- **Docs reorganised:** community-health files (security, support, contributing, conduct) live under `.github/` so GitHub recognises them; the guide and this changelog live under `docs/`. Numbers corrected throughout: **982 operations / 966 paths / 123 deprecated** (previously reported as 1,263 / 159).
- New `GUIDE.md` sections: platform support, the real setup-wizard flow, adding/removing tools later, StoreKit environments, a sample session, and uninstall steps.
- `SECURITY.md`: a "review it yourself before installing" section and an explicit no-telemetry / no-data-collection statement.
- Setup verifies credentials against Apple before saving, re-prompts on invalid input, and reuses saved credentials while reconciling registered profiles.
- User-facing help and error text now use the real `asc-mcp` command name.
- **Renamed the `account-management` profile to `provisioning`** so its name matches what it does (code signing: bundle IDs, certificates, devices, provisioning profiles) and no longer reads as user management — that lives in `user-management`. No alias: if you registered the old name, re-register as `asc-provisioning`.

### [1.0.4] — 2026-07-22

- Fix: setup no longer exits at the bundle-ID prompt after the profile picker.

### [1.0.3] — 2026-07-21

- Interactive, space-to-toggle profile picker showing each profile's tool count and rough token cost.
- Setup registers the picked profiles directly (`claude mcp add`) instead of only printing instructions.
- Discoverability: sibling-server hints include the exact add command, and StoreKit tools are surfaced in `asc__search_tools`.
- Friendlier setup: drag-and-drop `.p8` path, npx-based config, no real key in examples.

### [1.0.2] — 2026-07-21

- **Profile servers:** one binary serves 11 purpose-scoped MCP servers that share a single credential set.
- **Shared credential config** at `~/.config/asc-mcp/config.json`; environment variables still override it.
- Removed 281 id-only twin operations, shrinking the surface from 1,263 to 982.
- Fixed sales and finance report endpoints; added App Store Connect API integration tests.
- Tool names capped at 64 characters and query-parameter names sanitised for the Anthropic API.
- Optional **macOS Keychain** source for the private key, and bilingual **English / Türkçe** documentation with a flag-based language switcher. (These landed in the repo on 2026-07-19 under a "1.1.0" heading that was never published — 1.0.2 is the first npm release that shipped them.)

### [1.0.1] — 2026-07-19

- Per-role risk column in the API-key table; roles mapped to this server's actual domains.
- Scoped npm package name `@erayendes/asc-mcp`.

### [1.0.0] — 2026-07-19

- Initial release: an MCP server for the App Store Connect API, with tools generated from Apple's official OpenAPI specification.
- AI-assisted review tools via MCP Sampling.

## Türkçe
### [Unreleased]

#### Açılış banner'ı istemcinin gerçekten alacağı sayıyı yazıyor
`asc-monetization (206 tools)` yazıp istemcide 199 görünmesi, sunucunun kendisiyle çelişmesiydi. Banner profilin *eşlediği* işlem sayısını söylüyordu; `tools/list` ise servis edileni döndürüyor ve ikisi yapılandırmaya göre ayrışıyor — `asc__call` ile `asc__describe` her zaman var ve hiçbir yere eşlenmemiş, StoreKit yalnızca bundle ID ile yükleniyor, `--read-only` yazmaları kaldırıyor, bu sürümden itibaren `--include-deprecated` de araç ekliyor.

Artık ikisi tek bir listeden geliyor, yani ayrışamazlar: sayı, handler'ın döndürdüğü dizinin uzunluğu. `asc__status`'un token tahmini de aynı sebeple onu izliyor — "bu benim bağlamıma neye mal oluyor" sorusunun cevabı, yüklenen şeyle ilgili bir soru.

Katalog sayısı değişmedi ve söylediği şeyi söylemeye devam ediyor: 13 profilde 883 araç — README, `server.json` ve `CITATION.cff`'te, yayın öncesi kontrolüyle çapraz doğrulanıyor.


#### `--include-deprecated` profil modunda bir şey yapıyor
Orada hiçbir şey yapmıyordu ve bunu da söylemiyordu. Profil üyeliği `spec/profiles.csv`'de elle küratörlükten geçiyor ve Apple'ın emekli ettiği bir endpoint'i kimse küratörlükten geçirmiyor; yani 123 deprecated işlemin **sıfırı** hiçbir profilden erişilebilir değildi. Bayrak yalnızca profilsiz sunucuda `--domains` ile çalışıyordu.

Artık bayrağı verince, profilin kapsadığı domain'lerdeki emekli işlemler ekleniyor. Ölçüldü: `game-center` 184 araçtan 298'e, `monetization` 199'dan 208'e çıkıyor. Üyelik küratörlükle değil domain'le belirleniyor; bu bir kestirme değil dürüst tanım — bu bayrağı veren kişinin istediği şey "bu profilin kapsadığı alanlarda emekli olan her şey" ve devralınacak küratörlü bir cevap yok.


#### StoreKit okumaları mühürlü zarf yerine doğrulanmış alan döndürebiliyor
`ASC_APPLE_ROOT_CERTS`'i Apple'ın DER kök sertifikalarına ayarlayın — dosya yolları ya da tek bir dizin — ve `storekit__get_transaction_info`, `storekit__get_transaction_history`, `storekit__get_refund_history` her yükü App Store Server Library ile doğrulayıp çözülmüş alanlar döndürsün. Ayarlamazsanız eskisi gibi imzalı yükleri döndürüyorlar; açıklamalarının zaten vaat ettiği şey de bu. Her cevap hangisi olduğunu söylüyor, çağıranın tahmin etmesi gerekmiyor.

Kontrol edilmeden hiçbir şey çözülmüyor. Doğrulaması başarısız olan bir yük, kenarına şerh düşülmüş alanlar değil, hatadır: doğrulamanın amacı sonucun gerçek gibi kullanılabilmesi ve "işte değerler, ama teyit edemedik" tam da engellemesi gereken okumayı davet ediyor.

Çözülmüş şekil, Apple'ın tüm yükü değil bir beyaz liste. `appAccountToken` bilerek dışarıda — geliştiricinin kendi kullanıcı kaydına eşlediği UUID o, yani bir işlem kimliği uygulamasındaki bir hesaba geri dönüş yolu oluyor ve bu araçların hiçbiri onu istemedi. `raw: true` kendisi doğrulamak isteyene imzalı yükü veriyor.

Bu pakette hiçbir sertifika taşınmıyor. Onlar Apple'ın yayınladığı şeyler ve güncel tutulması gereken bir kalem daha; bayat kalan bir tanesi doğrulamayı sessiz bir hayıra çevirirdi.


#### StoreKit okumaları döndürmedikleri alanları vaat etmeyi bıraktı
`storekit__get_transaction_info` kendini "tek bir işlemin çözülmüş detayları: ürün, fiyat, tarihler, sahiplik tipi ve iptal durumu" diye tanıtıyor ve imzalı tek bir JWS metni döndürüyor. Geçmiş, iade ve yetki araçları aynısını dizilerle yapıyor. Beş isimli alana göre plan yapan bir çağıran `header.payload.signature` alıyor, hiçbir şey çökmüyor ve yanlış aracı çağırıp çağırmadığını anlamanın yolu yok.

Açıklamalar artık yüklerin imzalı olduğunu ve çözmenin çağırana ait olduğunu söylüyor. App Store Server Library'nin `SignedDataVerifier`'ı dördünde değil bir kez adlandırılıyor — dördüne birden yazmak "certificates" kelimesini dört açıklamaya sokup "create certificate" sorgusunun birinciliğini `certificates.create`'ten aldı.

Mühürlü zarfı döndürmek davranış olarak kalıyor. `jwsClaim` onu iki satırda açabilir ve o iki satır yanlış olanlar: imzayı kontrol etmeden base64 çözüyor, yani doğrulanmamış veriyi gerçek gibi sunuyor. Düzgün çözmek Apple'ın kök sertifikalarını ve doğrulama başarısız olunca ne olacağına dair bir kararı gerektiriyor — o da MIL-218. Bir kod yorumu artık onu adıyla anıyor, ki sonraki okuyan zarfın geçici cevap olduğunu bilsin.


#### Fiyat taşımadığını söyleyen bir fiyat listesi
`subscriptions.prices.list`, "bir aboneliğin bugün ne kadara mal olduğunu" gösterdiği söylenerek tarif ediliyordu ve tutar da para birimi de olmayan satırlar döndürüyor — sayı bir `include` ötedeki price point'te. Canlı bir değerlendirme oturumu açıklamaya inandı: aracı on beş kez çağırdı, pes etti, onun yerine 842 fiyat *noktasının* tamamını çekti ve güncel fiyat olarak "2,99 – 35 TRY" raporladı. Gerçek cevap tek bir sayıydı.

Açıklama artık bir satırın gerçekte ne olduğunu söylüyor ve tek çağrıda çözen `pricing__get_subscription_price`'ı adıyla veriyor. Dokuz kardeş liste aynı şekle sahip — teklif fiyatları, uygulama fiyatları, uygulama içi satın alma fiyatları — ve talimatı dokuz elle yazılmış metinden değil bir kuraldan alıyorlar: `include` enum'unda bir `*PricePoint` sunan liste, o olmadan satırları boş olan listedir.

O not araç açıklamasına değil, `include` **parametresine** düşüyor ve bu yerleşim ölçülerek seçildi. Açıklamalara koyunca dokuz araç fiyat ve para birimi hakkında aynı cümleyi taşıdı ve `subscriptions.prices.list`, *"List current subscription prices worldwide"* sorgusunda birincilikten beşinciliğe düştü — üstünde iki teklif-fiyatı listesi vardı. Arama ratchet'i bunu yayınlanmadan yakaladı.


#### Ajan harness'ı artık yazma kapısını ölçebiliyor
`npm run ax:agent --gate`, korpusu yazma yolu canlıyken ve her yazmada onay açıkken koşuyor; yani kapı gerçekten yolun içinde. Her istem reddediliyor, dolayısıyla Apple'a hiçbir şey ulaşmıyor — karar istek kurulmadan önce veriliyor, `tests/gate.test.ts`'in dayandığı özelliğin aynısı.

Diğer bütün modlar `--dry-run` ile koşuyor ve dry-run onayı tamamen atlıyor. Yani yıkıcı niyet skoru bugüne kadar "ajan yazmaya karar verdi mi?" sorusunu cevapladı, "bu sunucu onu durdurur muydu?" sorusunu hiç cevaplamadı — temmuz kalibrasyonunda sekiz yıkıcı niyetin beşi yazdı ve o sayı ürün hakkında hiçbir şey söylemiyordu.

Agent SDK, bir handler verilmediğinde elicitation'ı kendiliğinden reddediyor; bu da kapının hiç tetiklenmemesinden ayırt edilemiyor. `--gate` önce istemi kaydedip sonra reddeden bir handler kuruyor — modu sessiz bir "hayır" olmaktan çıkarıp ölçüme çeviren şey bu. `By gate` tablosu üzerinde işlem yapılacak sayıyı veriyor: yazma çağıran ama hiçbir şeyin sormadığı oturumlar.


#### Başarısız bir çağrı cümle değil, alan döndürüyor
Apple'ın reddi eskiden üç satır düz metin olarak dönüyordu; yani sonraki adıma karar veren bir ajanın, tekrar denemenin işe yarayıp yaramayacağını öğrenmek için İngilizce ayrıştırması gerekiyordu. Artık JSON dönüyor: `status`, `retryable`, `appleRequestId`, `suggestedAction` ve Apple'ın kendi `code`, `title`, `detail` alanlarını taşıyan `issues[]` — bir de yeni olarak `source`, reddedilen alanı ya da parametreyi adıyla veriyor. `source` tipten düşüyordu ve kimseye ulaşmıyordu, oysa Apple baştan beri gönderiyormuş.

Kendi retlerimiz düz metin kalıyor. Yanlış profil ya da salt-okunur engeli, elle yazılmış çok satırlı yönlendirme döndürüyor — register komutu, yüklenecek alt profil — ve JSON bunu kaçış karakterleri duvarına çevirirdi. Yalnızca gerçek bir HTTP hatası yapılandırılmış biçimi alıyor.


#### Onay geri açıldı — geri alması zor yazmalar için
Kapı artık risk manifestindeki dört seviyede varsayılan olarak açık: `revenue`, `destructive`, `infrastructure`, `access` — fiyat değiştirme, Admin yetkisi verme, sertifika silme, uygulamayı satıştan kaldırma. Bunların altındaki her şey client'ın kendi çağrı-başı araç onayıyla çalışıyor; her zaman var olan kapı da odur.

İki uç da önce denendi ve ikisi de yanlıştı. **Her yazmada açık** (2.0.0'a kadar) sürekli tetikleniyordu; elicitation desteğini bildirip formu gösteremeyen bir client `decline` döner ve protokol bunu kullanıcının reddetmesiyle birebir aynı raporlar, yani o client'larda sıradan yazmalar "reddettiniz" diye geri geliyordu. **Tamamen kapalı** (2.0.1'den 2.1.1'e) bu yanlış tetiklenmeyi ortadan kaldırdı ama guard'ı parayı hareket ettiren yazmalardan da kaldırdı — oysa maliyetini hak ettiği tek yer orasıydı.

- `--confirm` / `ASC_CONFIRM_WRITES=1` eskisi gibi her yazmadan önce sorar.
- `--no-confirm` / `ASC_CONFIRM_WRITES=0` hiç sormaz. 2.0.1'de dönüştüğü no-op olmaktan çıkıp yeniden gerçek bir ayar oldu.
- Risk seviyesi önizleme kurulmadan önce okunuyor; böylece bir `low` yazma, hiç gösterilmeyecek bir istemin arkasındaki referans sorgularının bedelini ödemiyor.
- `tests/gate.test.ts` iki yarıyı da aynı sunucudan test ediyor: bayraksız bir `destructive` yazmada soruluyor, `public` olanda sorulmuyor. Yalnızca sessiz yarıyı test etmek, onay tamamen kaldırılmış olsa da geçerdi.


### [2.1.1] — 2026-08-14

**2.1.0 bunlar olmadan çıktı.** Tag, `main`'in iki PR gerisindeki bir commit'te atılmıştı; aşağıdaki her şey 10 Ağustos'tan beri `main`'de duruyordu ve kimseye ulaşmadı. İkisi güvenlik düzeltmesi; 2.1.0'a sabitlemek yerine yükseltin.

#### `listing__upload_screenshot` okuyabildiği her dosyayı yüklüyordu
`file_path` modelden geliyor ve sonrasındaki her şey o dosyayı okuyup Apple'a PUT ediyordu. Bir `.p8`, bir SSH anahtarı ya da bir config gösterildiğinde baytlar gidiyor, Apple'ın bunu reddettiği ancak sonradan öğreniliyordu — o noktada dosya çoktan çıkmış oluyordu. İlk sekiz bayt (PNG imzası, JPEG işareti) ağa çıkılmadan önce kararı veriyor; arkasında 50 MB tavanı var.

#### `downloadAsset`'in boyut sınırı bir sınır değil, rapordu
64 MiB tavanını `arrayBuffer()` tüm gövdeyi belleğe aldıktan *sonra* kontrol ediyordu; yani büyük bir cevap ancak bellekteyken reddediliyordu. Artık büyük bir `Content-Length` baştan reddediliyor ve akış tavana ulaşınca transfer iptal ediliyor.

#### Altı okuma tek sayfayı "hepsi bu" diye döndürüyordu
Dört analitik adımı, abonelik grubu listesi ve iki StoreKit geçmişi ilk sayfada ya da sayfa tavanında durup bunu söylemiyordu.

- **`analytics__get_report`** — rapor istekleri, raporlar, örnekler ve segmentlerin hepsi artık sayfalanıyor. İkinci sayfadaki bir rapor *"No report matching …"* olarak dönüyordu.
- **`listSubscriptions`** — grup sayfalarını yürüyor ve her sayfanın `included`'ını birleştiriyor. İlk 50 grubun ötesindeki bir abonelik "bulunamadı" diye dönüyordu; o mesaja verilen cevap da kopyasını oluşturmaktır.
- **StoreKit işlem ve iade geçmişi** — `hasMore`, Apple'ın `revision` imleci ve açık bir kısmi-geçmiş notu dönüyor. *"İade yok"* ile *"ilk on sayfada iade yok"* aynı cevaptı; ikincisine bakarak jest kredisi veriliyor.
- **`reviews_ai__daily_briefing`** — üç sayfada değil, karşılaştırdığı pencereyi kapsadığında duruyor; kapsayamadıysa sayıları alt sınır olarak işaretliyor. Hiç tam okunmamış bir pencerenin trendi trend değildir.

#### Düzeltildi
- **Belirsiz abonelik adı yanlış ürüne fiyat yazabiliyordu.** Kısmi ad ilk eşleşmeyi alıyordu. Tam ürün ID'si ya da adı hâlâ doğrudan kazanıyor; iki aday çıkarsa artık soru soruluyor.
- **`readPrice` yıllar önce bırakılmış bir fiyatı raporlayabiliyordu.** Yürürlükteki fiyat, Apple'ın gönderdiği ilk zamanlanmamış satır değil, geçmiş olan en son başlangıç tarihidir.
- **`max_rows` negatif değer kabul edip satır düşürüyordu.** `Number(x) || 200` negatifi truthy diye geçiriyor, `slice(0, -5)` de beş satır döndürmek yerine son beşi kesiyordu. Tek yerde `[1, 1000]` aralığına kırpılıyor.
- **Başarısız bir CLI kaydı, çalışan kaydı silebiliyordu.** Artık önce ekleme yapılıyor; silme yalnızca ekleme reddedilirse çalışıyor ve silme de düşerse eklemenin hatası korunuyor — aksi halde eksik bir bayrak "no such server" diye raporlanıp okuyanı hiç var olmamış bir kaydın peşine gönderiyordu.

#### Güvenlik
- **Uçtan gelen metin taşıyan cevaplar bunu söylüyor.** Yorum gövdeleri ve test kullanıcısı geri bildirimleri, üretilen araçlar üzerinden modele "bu veri, talimat değil" diyen hiçbir işaret olmadan ulaşıyordu — üstelik bir yorumun modele çağırtmak isteyebileceği yazma araçlarının yanında duruyorlar. Yorum makrosunda bu kural baştan beri vardı; artık üretilen yolda da var.
- **İsteğe bağlı PII maskeleme.** `ASC_REDACT_PII=1`, test kullanıcısı verilerinde `email`, `firstName` ve `lastName` alanlarını maskeliyor, e-posta alan adını koruyor. Varsayılan kapalı: test kullanıcılarını listelemek *"build'i kim yüklememiş?"* sorusunun cevabıdır ve beş kez `<redacted>` diyen bir cevap, kullanıcının bu sunucuyu atlayarak alacağı bir cevaptır.
- **Docker imajı root değil `node` kullanıcısıyla çalışıyor**, ürettiği tek kullanımlık anahtar dosyası da `600`.

#### Dokümantasyon
`Dockerfile` başlığı, o dosyayı okumayan iki tüketici iddia ediyordu. Glama kendi spec'inden derliyor — `debian:trixie-slim`, pnpm, `mcp-proxy` — MCP Registry ise `server.json`'ın bildirdiği npm paketini kuruyor. O dosyayı düzenlemek ikisini de etkilemiyor ve düşen bir Glama build'i içeriği hakkında hiçbir şey söylemiyor.

### [2.1.0] — 2026-08-10

#### Riskli yazmalar araç listesinde riskli görünüyor
Her mutasyon operasyonu zaten elle gözden geçirilmiş bir risk seviyesi taşıyordu, ama bu modele yalnızca `--dry-run`, `asc__describe` ve `--confirm` istemi üzerinden ulaşıyordu — o istem de 2.0.1'den beri varsayılan kapalı. Her zaman gönderilen tek sinyal olan `destructiveHint` ise tam olarak "bu bir DELETE" demekti. Yani **para hareket ettiren, sürüm yayınlayan, erişim değiştiren ya da imzalamayı bozan, DELETE olmayan 100 yazma işlemi** düz bir araç listesinde `beta_groups__create`'ten ayırt edilemiyordu: `app_price_schedules__create`, `app_store_version_release_requests__create`, `apps__promoted_purchases__replace` bunlardan birkaçı.
- Seviye artık HTTP metodunun gösteremediği ~120 operasyonun açıklamasında, `REVENUE-level write.` biçiminde görünüyor. Tipik sekiz sunuculuk bir kurulumda 443 token — araç tanımlarının %0,35'i.
- **`destructiveHint` artık MCP'nin söylediği anlama geliyor**: "yıkıcı güncelleme yapabilir", "DELETE'tir" değil. **Bu ipucuna göre onay isteyen istemciler eskisinden daha fazla araçta soracak.**
- `app_store_versions__build__set`, release kuralı yalnızca `create|update` ile eşleştiği için `low` sayılıyordu. Bir sürümün altındaki binary'yi değiştirmek bir yayın adımıdır.

#### `pricing__equalize_price` — tek çapa fiyat, her ülkeyi Apple türetiyor
Uygulama, uygulama içi satın alma veya abonelik için. Çapa ülkeyi ve fiyatı verirsiniz; her pazarın karşılığını Apple'ın kendi kur ve vergi matematiği belirler. Sayı asla para birimleri arasında kopyalanmaz, çünkü kopyalanamaz — 3,99 TRY çapasında Apple Afganistan için 0,99 USD, BAE için 2,99 AED döndürüyor.

Üç ürün tipinin yazma modeli aynı değil ve makro bunu gizlemiyor:

| Ürün | Yazma | Equalization'ı yapan |
| -- | -- | -- |
| Uygulama fiyatı | 1 (`appPriceSchedules`) | Apple, `baseTerritory`'den |
| Uygulama içi satın alma | 1 (`inAppPurchasePriceSchedules`) | Apple, `baseTerritory`'den |
| Abonelik | ~175, ülke başına bir tane | biz, equalizations ucundan |

`subscriptionPrices` bir temel ülke kavramı taşımıyor; bu yüzden o yol Apple'ın equalization'larını okuyup her ülkeyi ayrı yazıyor. Çapayı **önce** yazıyor, böylece yarıda kalan bir hata kullanıcının asıl belirttiği ülkeyi ayarlanmış bırakıyor; ilk hatada duruyor, bilinmeyen bir durumu ülkelere yaymıyor, ve sonuç hangi ülkelerin yazıldığını, hangisinde durulduğunu ve kaçının dokunulmadan kaldığını tam olarak söylüyor. Yeniden çalıştırmak güvenli — zaten ayarlı bir fiyatı yazmak hiçbir şeyi değiştirmiyor.

Abonelikler için `preserve_current_price` zorunlu, tek-ülke makrosundaki gibi; onay ekranı da "mevcut aboneler taşınacak" ifadesinin artık dünya çapında olduğunu açıkça yazıyor. Uygulama ve IAP'ların abonesi yok, sormuyorlar.

Önce `--dry-run` ile çalıştırın: abonelik yolu hiçbir şey gönderilmeden önce türetilmiş tablonun tamamını döndürüyor.

#### `pricing__get_subscription_price` artık "her ülkede" sorusunu da cevaplıyor
`territory` zorunluydu, yani makro yalnızca tek bir ülkeyi cevaplayabiliyordu. "Bu abonelik her ülkede ne kadar?" diye sorulan canlı bir değerlendirme oturumu makroyu çağırdı, sorunun cevabını bulamadı, ham zinciri yürüdü ve sonucu bir CSV'ye yazıp yanına Python'da elle ülke adı sözlüğü üreterek 1,02M token ve 3 dolar harcadı.

Artık `territory`'yi atlarsanız cevap Apple'ın sattığı tüm ülkeleri kapsıyor ve okunabilir kalsın diye fiyata göre gruplanıyor: canlı ölçümde 175 ülke 45 ayrı fiyata iniyor — 91 ülke bunlardan birini paylaşıyor — ve tamamı yaklaşık 1,3k token. Her grupla birlikte para birimi de dönüyor; "19.99" tek başına eksik bir cevap. Ülke adı da öyle: Apple hiçbir yerde ülke adı döndürmüyor — ne fiyat satırında, ne de yalnızca kod ve para birimi taşıyan `/v1/territories`'te — o değerlendirme oturumunun 175 satırlık sözlüğü elle yazmasının, sonraki bir koşuda da tekrar yazmasının sebebi bu. Her grup artık `territories` ile aynı sırada bir `countryNames` taşıyor.

Tek ülke soran çağrılar değişmedi; yalnızca cevap ülkenin adını da veriyor.

#### Ekran görüntüsü yükleme ve rapor okuma — ham araçların yapamadığı iki şey
İkisi de API'nin gitmediği bir yerde biten zincirlerdi.
- **`listing__upload_screenshot`**, Apple'ın rezerve et → yükle → onayla dizisini MD5 sağlamasıyla birlikte yürütüyor. Ham `app_screenshots__create` yalnızca bir yer ayırıyor ve tek bayt taşımıyor; zincir araçlarla hiç tamamlanamıyordu.
- **`analytics__get_report`**, istek → rapor → örnek → segment zincirini yürüyüp Apple'ın imzalı bağlantısındaki gzip TSV'yi indiriyor ve satır döndürüyor. Ham zincir elinde bir URL ile bitiyor. Yeni bir rapor isteği başlatmıyor: bu, hesap üzerinde süregelen bir taahhüt, bir sorunun yan etkisi değil.

#### Düzeltildi
- **`listing__get_screenshots` 2.0.0'da erişilemez olarak yayınlanmış.** Ailesi profil üreticisinin bilinen listesinde yoktu, dolayısıyla küratörlük sayfasında ona satır açılamıyordu ve hiçbir profil-modu sunucusu onu sunmuyordu. İki listing makrosu da artık `distribution:version` altında. `pricing__get_subscription_price` da sayfada yokmuş — çalışıyordu, ama alt profil araç sayıları birer eksik gösteriyordu.
- **`review_submissions__create`, bir sürümü incelemeye gönderiyor diye anlatılıyordu.** Sürüm değil *uygulama* alıyor ve boş bir gönderim açıyor; sürüm ayrı bir kalem olarak ekleniyor ve `submitted` işaretlenene kadar Apple'a hiçbir şey ulaşmıyor. İlk çağrıdan sonra duran bir ajan, yapmadığı bir yayını yapılmış olarak raporluyordu. Üç adım artık ayrı ayrı ne *olmadıklarını* söylüyor.
- İnceleme gönderim zinciri ve analiz zincirinin iki ucu için küratörlü açıklamalar; AXIS1 bulunabilirlik borcu 718 → 712.
- **Araç sayısı dört yüzeyde üç ayrı değere kaymıştı** — `server.json` ve `CITATION.cff` 868, GitHub repo açıklaması 875, README 883 diyordu — ve `CITATION.cff` 2.0.0'da kalarak iki sürüm geride kalmıştı. Hepsi artık 883 (erişilebilir 859 işlem artı elle yazılmış 24 araç) ve yayın öncesi kontrol hem `CITATION.cff` sürümünü hem üç yüzeydeki araç sayısını karşılaştırıyor; uyuşmazlıkta yayını geçirmek yerine durduruyor.
- **`.claude-plugin/plugin.json` homepage alanı** var olmayan bir depoyu, `erayendes/asc-mcp`'yi gösteriyordu.

#### Katkıcılar için
- **`npm run ax:agent` çalışmıyordu** — `Profile` tipinde olmayan bir alanı okuyor ve import sırasında patlıyordu.
- Bir skill belgesini A/B testine sokmak için `--skill=<dizin>` ve `--wrong-profile`; oturum başına `reachedForCredentials` / `calledAppleDirectly` boolean'ları ve kontrol koluna göre fark olarak basılan bir `By skill` tablosu. `SHELL_KINDS` eksik sayıyordu: `security find-generic-password` ve Apple'a atılan düz bir `curl`, ancak bir filtre kelimesine borulandığında kaydediliyordu.

#### Eklendi
- **`register` tarafından kurulan bir `heimdall` skill'i**, `SKILL.md` okuyan istemciler için (Claude Code, Codex). Sunucu var olmadan önce başka hiçbir kanalı olmayan şeyi taşıyor: API anahtarının istek başına süreç içinde üretildiğini, kabukta bulunamayacağını ve `curl` ile yerine konamayacağını — ki kayıtlı oturumlarda bir koşunun en sık bu yüzden raydan çıktığı görülmüştü. Bağlamda yaklaşık 200 token duruyor; gövde yalnızca skill tetiklendiğinde yükleniyor.

### [2.0.1] — 2026-08-09

#### Yazma onayı artık opt-in
**Davranış değişikliği.** Yazma-öncesi onay kapısı artık **varsayılan kapalı**; `--confirm` / `ASC_CONFIRM_WRITES=1` ile açılıyor.

Her zaman var olan kapı, client'ın kendi çağrı-başı araç onayı. Bu ikinci kapı ve yalnızca client elicitation formunu gösterebiliyorsa çalışıyor — yeteneği bildirip formu gösteremeyen bir client `decline` dönüyor, protokol de bunu kullanıcının reddetmesiyle birebir aynı raporluyor. Yani o client'larda guard, çalışması gereken yazmaları "the write was not confirmed" diyerek engelliyor ve kullanıcıyı asıl sebebin yerine kendi client izinlerine bakmaya yönlendiriyordu. Formun gösterilip gösterilemediği client'a özgü bir gerçek, dolayısıyla karar sunucuyu yapılandıranın.

Kapalıyken kaybedilen bir şey yok: etki önizlemesi `--dry-run` altında basılmaya devam ediyor, `--read-only` hâlâ tüm mutasyon araçlarını kaldırıyor.
- **`--allow-unconfirmed-writes` / `ASC_ALLOW_UNCONFIRMED_WRITES` kaldırıldı.** Yalnızca elicitation bildirmeyen client'lar için geçerliydi; hem onay istemek hem onaysız yazmaya izin vermek kendi kendini götüren bir kombinasyondu.
- **`--no-confirm` artık no-op** — yeni varsayılanla aynı yere düşüyor, mevcut config'ler olduğu gibi çalışmaya devam ediyor.
- **Ret mesajı ne olduğunu söylüyor**: ekranda istem çıkmadıysa cevabı client sizin yerinize vermiştir.

### [2.0.0] — 2026-08-05

#### Profiller elle küratörlükten geçiyor
**Kritik değişiklik — her profil değişti.** Bir aracın hangi profile ait olduğu URL'den okunuyordu; bu yüzden bir uygulamaya bağlı her ilişki `app-info`'ya düşüyor, on bir profilin sekizi kendi kaynaklarına bir uygulamadan erişemiyordu. Üyelik artık `spec/profiles.csv` içinde elle belirlenip koda üretiliyor.
- **13 profil**, önceden 11. Yeni: `access`, `app-clips`, `testflight`.
- **`user-management` kaldırıldı**, dörde bölündü. Config'inizde hâlâ varsa sunucu yine açılıyor ve bölünmeyi anlatan tek bir araçla geliyor.
- **Her profilin boyutu değişti** — `app-info` 112 araçtan 57'ye indi. **Config'inizi kontrol edin**, aradığınız araç diğer profilde olabilir.

#### Alt profiller
Beş profil altında 32 alt profil. Profil iki nokta üst üste ile daralıyor: 204 araçlık `monetization` ya da 24 araçlık `monetization:subscription-pricing`'i seçersiniz.
Bazı araçlar birden fazlasına bağlı, yani tek bir araç için koca bir profil yüklemek gerekmiyor. Setup seçicisi işaretlenen profilin alt profillerini imlecin altında açar, hepsi işaretli gelir ve argümanı sizin yerinize yazar; `asc__status` hangilerinin yüklü olduğunu ve yaklaşık maliyetini raporlar.

#### Profildeki her araç, her istemcide
`asc__describe` + `asc__call` en baştan mevcut, böylece hiçbir şey istemcinin oturum ortasında araç listesini tazelemesine bağlı kalmıyor.
`asc__call` salt okunur; yazmalar kendi adlarını ve onay kapısını koruyor.
`asc__load`, tazeleyen istemciler için oturum ortasında alt profil ekler.

#### Setup kurulu her istemciye kaydediyor
`setup` tek komut biliyordu: `claude mcp add`; Codex ve Cursor bulunan bir cihazda işi kullanıcıya bırakıyordu.
- **Cihazda bulunan istemcileri tespit edip hangilerine kurmak istediğinizi soruyor:** Claude Code, Claude Desktop, Codex, Antigravity, Cursor, Windsurf, VS Code.
- **Üreticinin kendi komutu varsa onu kullanıyor** (`claude`, `codex`, `code --add-mcp`); düz JSON config'leri yedekleyip düzenliyor. Ayrıştırılamayan bir dosyaya hiç dokunmuyor, yapıştırılacak blok basıyor. Bir istemcinin başarısız olması diğerlerini durdurmuyor.
- **`register` aynı işi terminal olmadan yapar**, kurulumu sizin adınıza üstlenen bir agent için: `asc-mcp register monetization:subscription-pricing analytics`. Yalnızca ekler; silme işi `setup`'ındır.

> [!NOTE]
> ChatGPT'nin kendi connector'ları yalnızca uzak HTTPS sunucusu kabul ettiği için Heimdall orada görünemez; sizin cihazınızda stdio üzerinden çalışır, özel anahtarın cihazdan hiç çıkmamasının sebebi de budur. Codex satırı CLI'yi, IDE eklentisini ve ChatGPT masaüstünün Codex tarafını kapsar — üçü aynı config dosyasını okur.

#### Düzeltildi
- **Yanlış yazılmış bir filtre hangi uygulamayı düzenlediğinizi değiştiriyordu.** `filter[bundleId]` sessizce düşüyor, filtresiz çalışıp hesabın ilk uygulamasını döndürüyordu. Artık iki yazım da kabul ediliyor.
- **Binary, symlink üzerinden çağrıldığında sessizce 0 ile çıkıyordu.**
- **Araç arama İngilizce dışındaki sorgulara boş dönüyordu, sebebini de söylemiyordu.** Artık tüm dillerde sonuç dönüyor, boşsa nedenini açıklıyor.
- **Araç arama, sunucunun yüklemeyi reddettiği araçları öneriyordu.**

#### Katkıcılar için eklendi
Bir agent deneyimi koşum takımı: saldırgan hedefler içeren 50 istemlik bir külliyat (bir kez değil, n kez koşuluyor), 982 işlemin tamamında damgalanmamış risk seviyesi ve HTTP metoduyla çelişen `readOnly` arayan bir sözleşme kontrolü, ve tek kullanımlık bir uygulamada TestFlight grubu açıp silen canlı bir yazma-yolu sondası — token'dan POST'a, oradan Apple'ın cevabına giden yolu sınayan tek kontrol, çünkü diğerlerinin hepsi `--dry-run` ile koşuyor. `tests/gate.test.ts` yazma kapısının yalnızca doğru sınıflandırdığını değil, stdio üzerinden uçtan uca ateşlendiğini kanıtlıyor.

### [1.3.0] — 2026-07-28

Güvenlik ve kullanılabilirlik sürümü: her yazma artık yerelde şema kontrolünden geçiyor, onaydan önce önizleniyor ve asla sessizce yeniden gönderilmiyor.

- **Yazmalar otomatik retry ile çiftlenmiyor.** Okumalar 408/429/5xx'te retry olmaya devam ediyor; yazmalar yalnız 429'da (işlenmeden reddedildi). Cevapsız ölen yazma, yeniden gönderilmek yerine açık bir belirsiz-sonuç hatası veriyor — "Apple işlemiş olabilir, göndermeden önce doğrula". `Retry-After` HTTP-date formatı destekleniyor.
- **Fail-closed onay.** Elicitation desteklemeyen client'larda yazmalar artık sessizce geçmek yerine hata ile engelleniyor; açık opt-in: `--allow-unconfirmed-writes` / `ASC_ALLOW_UNCONFIRMED_WRITES=1`.
- **Gerçek request-body şemaları.** Body alan 355 operasyonun tamamı, genel bir "JSON:API body" ipucu yerine çözülmüş JSON Schema taşıyor (attribute'lar, ilişkiler, enum'lar, zorunlu alanlar, kapalı-dünya objeler) ve her yazma body'si yerelde doğrulanıyor — yazım hatalı alan veya yanlış enum, Apple'a hiçbir şey gitmeden field path ile düşüyor.
- **Impact preview, risk seviyeleri ve yazılı onay.** Onay penceresi operasyonu, hedef id'leri, hesabı, değişiklik özetini ve geri alınabilirlik notunu gösteriyor. Her mutasyon operasyonu elle gözden geçirilmiş bir risk seviyesi taşıyor (low / public / release / revenue / destructive / infrastructure / access); revenue, destructive, infrastructure ve access yazmaları kutucuk yerine CONFIRM yazmayı gerektiriyor.
- **`--dry-run` / `ASC_DRY_RUN=1`:** mutasyon çağrıları doğrulanıp gönderilecek olanı (metod, path, body, risk) döndürüyor — Apple'a hiçbir şey gitmiyor. CI ve ajan provaları için.
- **Reviews-AI sertleştirme:** yorumlar modele güvenilmez JSON verisi olarak gidiyor (prompt-injection savunması), istatistikler önceki dönem kıyasıyla deterministik hesaplanıyor, kesme dürüstçe raporlanıyor (çekilen vs analiz edilen), taslaklar yorumun dilinde ve marka sesi / yasaklı ifadeler / destek adresi `ASC_REVIEWS_*` env'lerinden. Araçlar, sampling desteklemeyen client'larda gizleniyor.
- **`ASC_BASE_URL`** tüm sunucuyu test için yerel bir fixture'a yönlendiriyor; host-pinning override'ı izliyor.
- `asc__status`'a `check_expirations` eklendi — 30 gün içinde dolacak sertifikalar ve provisioning profilleri.
- 403 (rol yetersiz) ve 409 (kaynak-durumu kilidi) hatalarına, mevcut 401 ipucunun yanına eyleme dönük ipuçları.
- GUIDE: mevcut mekanizmalarla çoklu hesap kalıpları (sunucu-başına env, `ASC_CONFIG_DIR`).

### [1.2.0] — 2026-07-26

- **Write onayı.** Değişiklik yapan bir araç çalışmadan önce (fiyat değiştirme, incelemeye gönderme, kaynak silme), sunucu kullanıcıdan [MCP elicitation](https://modelcontextprotocol.io/) ile onay ister — muğlak ya da yanlış anlaşılmış bir talimat artık kontrolsüz çalışamaz. Varsayılan açık; `ASC_CONFIRM_WRITES=0` veya `--no-confirm` ile kapatılır. Elicitation desteklemeyen client'lar kendi çağrı-başı onaylarına düşer (tek seferlik uyarıyla).

### [1.1.4] — 2026-07-25

- 1.1.3'teki lazy private-key parse'ı taşıyan ilk npm sürümü — sunucu geçerli kimlik bilgisi olmadan başlar; böylece araç keşfi ve introspection setup'tan önce çalışır. Bağış tek seçeneğe indirildi: yalnızca Buy Me a Coffee (Patreon kaldırıldı). API değişikliği yok.

### [1.1.3] — 2026-07-23

- **Sunucu, kullanılabilir bir private key olmadan başlar.** İmzalama anahtarı artık açılışta değil ilk API çağrısında (lazy) parse edilir; böylece araç keşfi — ve yalnızca `tools/list` çağıran Glama gibi otomatik introspection araçları — boot için geçerli kimlik bilgisi gerektirmez. Hatalı anahtar, açılışı kilitlemek yerine ilk gerçek istekte ortaya çıkar.

### [1.1.2] — 2026-07-22

- `package.json`'a `mcpName` alanı (`io.github.erayendes/asc-mcp`) eklendi; böylece sunucu resmi [MCP Registry](https://registry.modelcontextprotocol.io)'ye yayınlanabilir. İşlevsel değişiklik yok.

### [1.1.1] — 2026-07-22

- **CLI mesajları artık global kurulum olmadan çalışan bir komut gösteriyor.** Help metni, "config eksik"/"config bozuk" hataları ve StoreKit ipucu, çıplak `asc-mcp setup` yerine `npx -y @erayendes/asc-mcp setup` basıyor — çıplak komut yalnızca `npm i -g` sonrası var. `GUIDE.md §7` de yeniden-çalıştırma komutunu açıkça veriyor.

### [1.1.0] — 2026-07-22

- **Heimdall'a yeniden adlandırma.** Proje artık *Heimdall — App Store Connect MCP*. npm paketi (`@erayendes/asc-mcp`) ve komut (`asc-mcp`) değişmedi.
- **Dokümanlar yeniden düzenlendi:** community-health dosyaları (güvenlik, destek, katkı, davranış kuralları) GitHub'ın tanıması için `.github/` altında; rehber ve bu değişiklik günlüğü `docs/` altında. Rakamlar baştan sona düzeltildi: **982 işlem / 966 path / 123 deprecated** (önceden 1.263 / 159 yazıyordu).
- Yeni `GUIDE.md` bölümleri: platform desteği, gerçek setup-sihirbazı akışı, sonradan araç ekleme/çıkarma, StoreKit ortamları, örnek bir oturum ve kaldırma adımları.
- `SECURITY.md`: "kurmadan önce kendin denetle" bölümü ve açık bir telemetri-yok / veri-toplama-yok beyanı.
- Setup, kaydetmeden önce kimlik bilgilerini Apple'a doğrular, hatalı girdide yeniden sorar ve kayıtlı kimlik bilgilerini yeniden kullanırken kayıtlı profilleri uzlaştırır.
- Kullanıcıya görünen yardım ve hata metni artık gerçek `asc-mcp` komut adını kullanır.
- **`account-management` profili `provisioning` olarak yeniden adlandırıldı** — adı yaptığı işi yansıtsın (kod imzalama: bundle ID'ler, sertifikalar, cihazlar, provisioning profilleri) ve kullanıcı yönetimiyle karışmasın; o iş `user-management`'ta. Alias yok: eski adı kaydettiyseniz `asc-provisioning` olarak yeniden kaydedin.

### [1.0.4] — 2026-07-22

- Düzeltme: setup, profil seçicinin ardından bundle-ID isteminde artık çıkmıyor.

### [1.0.3] — 2026-07-21

- İnteraktif, boşlukla-seçilen profil seçici; her profilin araç sayısını ve kabaca token maliyetini gösterir.
- Setup, seçilen profilleri sadece yazdırmak yerine doğrudan kaydeder (`claude mcp add`).
- Keşfedilebilirlik: kardeş-sunucu ipuçları tam ekleme komutunu içerir ve StoreKit araçları `asc__search_tools`'ta görünür.
- Daha dostane setup: sürükle-bırak `.p8` yolu, npx tabanlı config, örneklerde gerçek anahtar yok.

### [1.0.2] — 2026-07-21

- **Profil sunucuları:** tek binary, tek kimlik bilgisi setini paylaşan 11 amaca özel MCP sunucusu sunar.
- **Ortak kimlik bilgisi yapılandırması** `~/.config/asc-mcp/config.json`'da; ortam değişkenleri yine de onu ezer.
- 281 id-only twin işlem kaldırıldı; yüzey 1.263'ten 982'ye indi.
- Satış ve finans rapor uç noktaları düzeltildi; App Store Connect API entegrasyon testleri eklendi.
- Araç isimleri 64 karakterle sınırlandı ve sorgu-parametre isimleri Anthropic API için temizlendi.
- Özel anahtar için opsiyonel **macOS Keychain** kaynağı ve bayrak tabanlı dil geçişli iki dilli **İngilizce / Türkçe** dokümantasyon. (Bunlar depoya 2026-07-19'da hiç yayınlanmamış bir "1.1.0" başlığı altında girmişti — kullanıcıya ulaştıran ilk npm sürümü 1.0.2'dir.)

### [1.0.1] — 2026-07-19

- API anahtarı tablosunda rol-başına risk sütunu; roller bu sunucunun gerçek domainlerine eşlendi.
- Scope'lu npm paket adı `@erayendes/asc-mcp`.

### [1.0.0] — 2026-07-19

- İlk sürüm: App Store Connect API için, araçları Apple'ın resmi OpenAPI spesifikasyonundan üretilen bir MCP sunucusu.
- MCP Sampling ile AI destekli yorum araçları.
