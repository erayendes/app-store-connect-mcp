# app-store-connect-mcp

An MCP server for the **App Store Connect API** and the **App Store Server API (StoreKit 2)**.

Every tool is generated from Apple's own OpenAPI specification, so coverage is complete by construction — **1,263 operations across 17 domains** — and staying current with Apple means regenerating, not hand-writing.

Not published to npm yet — install from source:

```bash
git clone https://github.com/erayendes/app-store-connect-mcp.git
cd app-store-connect-mcp
npm install
npm run build
```

---

## Why this exists

Most App Store Connect MCP servers wrap a hand-picked subset of endpoints. That works until you need the one endpoint nobody wrapped.

This server takes the opposite approach:

| | |
|---|---|
| **Complete** | Generated from Apple's OpenAPI spec v4.4.1 — all 966 paths, 1,263 operations |
| **Current** | `npm run spec:update && npm run generate` picks up Apple's changes |
| **Scoped** | Load only the domains you need; the full set is opt-in |
| **Safe** | `--read-only` mode, destructive-action annotations, host-pinned requests |
| **Self-describing** | Ask the server what it can do — it will tell you |

---

## Setup

### 1. Create an App Store Connect API key

Go to [Users and Access → Integrations → Keys](https://appstoreconnect.apple.com/access/integrations/api), generate a key, and download the `.p8` file. **You can only download it once.**

Note the **Key ID** and **Issuer ID** from that page.

| Role | Needed for |
|---|---|
| App Manager | Apps, versions, submissions, metadata |
| Developer | TestFlight, builds |
| Finance | Sales and finance reports |
| Admin | Users, provisioning |

Pick the narrowest role that covers your use case.

### 2. Register the server

**Claude Code:**

```bash
claude mcp add -s user app-store-connect \
  -e ASC_KEY_ID=YOUR_KEY_ID \
  -e ASC_ISSUER_ID=YOUR_ISSUER_ID \
  -e ASC_PRIVATE_KEY_PATH=/absolute/path/to/AuthKey_XXXXXXXXXX.p8 \
  -- node /absolute/path/to/app-store-connect-mcp/dist/index.js
```

**Claude Desktop** — add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "app-store-connect": {
      "command": "node",
      "args": ["/absolute/path/to/app-store-connect-mcp/dist/index.js"],
      "env": {
        "ASC_KEY_ID": "YOUR_KEY_ID",
        "ASC_ISSUER_ID": "YOUR_ISSUER_ID",
        "ASC_PRIVATE_KEY_PATH": "/absolute/path/to/AuthKey_XXXXXXXXXX.p8"
      }
    }
  }
}
```

Once published to npm, `node /absolute/path/to/.../dist/index.js` can be swapped for `npx -y app-store-connect-mcp`.

Config file locations — macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`, Windows: `%APPDATA%\Claude\claude_desktop_config.json`.

### 3. Verify

Ask your client: *"Check the App Store Connect connection."* It will call `asc__status`, which validates your credentials with a single lightweight request.

---

## Configuration

### Environment

| Variable | Required | Purpose |
|---|---|---|
| `ASC_KEY_ID` | yes | Key ID from App Store Connect |
| `ASC_ISSUER_ID` | yes | Issuer ID from App Store Connect |
| `ASC_PRIVATE_KEY_PATH` | yes\* | Absolute path to the `.p8` file |
| `ASC_PRIVATE_KEY` | yes\* | PEM contents, as an alternative to the path |
| `ASC_VENDOR_NUMBER` | no | Required by sales and finance report tools |
| `ASC_BUNDLE_ID` | no | Enables App Store Server API (StoreKit 2) tools |
| `ASC_APP_APPLE_ID` | no | Your app's numeric Apple ID |
| `ASC_ENVIRONMENT` | no | `Sandbox` (default) or `Production`, for StoreKit 2 |

\* Supply either `ASC_PRIVATE_KEY_PATH` or `ASC_PRIVATE_KEY`.

### Flags

| Flag | Effect |
|---|---|
| `--domains=<list>` | Comma-separated domains to load, or `all` |
| `--read-only` | Expose only tools that cannot modify anything |
| `--include-deprecated` | Also load the 159 operations Apple has deprecated |

---

## Domains

The full 1,263-operation surface costs well over 100k tokens of tool definitions — more than most context windows can spare. So the server loads a **default working set** covering everyday release work, and everything else is one flag away.

| Domain | Tools | Default | Covers |
|---|---:|:---:|---|
| `meta` | 3 | ● | Server introspection and tool discovery |
| `apps` | 174 | ● | Apps, metadata, localizations, availability |
| `versions` | 130 | ● | Version lifecycle, submission, phased release, A/B tests |
| `builds` | 57 | ● | Builds, bundles, icons, pre-release versions |
| `testflight` | 86 | ● | Beta groups, testers, feedback, crash submissions |
| `reviews` | 6 | ● | Customer reviews and developer responses |
| `analytics` | 15 | ● | Sales, finance, analytics reports, performance metrics |
| `subscriptions` | 133 | | Subscriptions, groups, offers, win-back, offer codes |
| `iap` | 89 | | In-app purchases, pricing, offer codes, promotions |
| `marketing` | 70 | | Screenshots, previews, custom pages, in-app events |
| `xcode_cloud` | 59 | | Products, workflows, build runs, artifacts, SCM |
| `provisioning` | 49 | | Bundle IDs, certificates, devices, profiles |
| `game_center` | 337 | | Achievements, leaderboards, matchmaking, challenges |
| `users` | 17 | | Team members, invitations, roles |
| `background_assets` | 15 | | Background assets and asset packs |
| `webhooks` | 12 | | Webhook configuration and delivery diagnostics |
| `pricing` | 11 | | App price schedules and price points |
| `sandbox` | 3 | | Sandbox testers |
| `storekit` | 9 | ○ | App Store Server API — enabled by `ASC_BUNDLE_ID` |

```bash
# Monetization work
--domains=meta,apps,subscriptions,iap,pricing

# Everything
--domains=all
```

**You don't have to memorise this.** Ask *"what App Store Connect domains are available?"* and the server answers from `asc__discover_domains`. Ask *"is there a tool for in-app events?"* and `asc__search_tools` searches all 1,263 operations — including ones not currently loaded — and tells you which flag would load it.

---

## Examples

Once connected, talk to your client in plain language:

> **Release management**
> "List my apps, then show the current version state for Acme and what's blocking release."
>
> "Submit version 3.2 for review, then start a phased release once it's approved."

> **TestFlight**
> "Create a beta group called Insiders and add the latest build to it."
>
> "Show me crash submissions from TestFlight in the last week, grouped by device model."

> **Reviews**
> "Find 1-star reviews from the last 30 days that don't have a response yet, and draft replies."

> **Monetization** *(needs `--domains=...,subscriptions`)*
> "Show my subscription groups and the price of each tier in Turkey, Germany and the US."

> **Customer support** *(needs `ASC_BUNDLE_ID`)*
> "This customer says they were charged twice — transaction ID 2000000891234567. What does their purchase history show, and are they currently entitled?"

---

## Reviews AI

Three tools ride on top of the `reviews` domain and use **MCP Sampling** — your
client's own model, no separate API key:

| Tool | What it does |
|---|---|
| `reviews_ai__draft_response` | Draft a reply to one review. Returns text only. |
| `reviews_ai__triage` | Pull recent reviews and group them by theme (bug, feature request, pricing, praise, spam). |
| `reviews_ai__daily_briefing` | Summarise the last N days of reviews into a short briefing. |

All three are read-only and always loaded — none of them post anything. To
publish a reply, review the draft yourself and call
`customer_review_responses__create`.

---

## Tool naming

Tool names mirror the resource hierarchy, with the action last:

```
apps__list                              GET  /v1/apps
apps__get                               GET  /v1/apps/{id}
apps__builds__list                      GET  /v1/apps/{id}/builds
app_store_versions__create              POST /v1/appStoreVersions
app_store_version_phased_releases__update  PATCH /v1/appStoreVersionPhasedReleases/{id}
```

| Suffix | Meaning |
|---|---|
| `list` / `get` | Read a collection / a single record |
| `create` / `update` / `delete` | Standard mutations |
| `add` / `remove` / `replace` | Manage a to-many relationship |
| `list_ids` / `get_id` | Read only linked IDs, not full records |
| `metrics` | Aggregated time-series data |

Every tool carries the underlying `METHOD /path` in its description, so you can cross-reference [Apple's API documentation](https://developer.apple.com/documentation/appstoreconnectapi) directly.

### Pagination

List tools accept `next_url` — pass the `links.next` value from a previous response to fetch the following page. The server refuses to follow a cursor pointing anywhere other than Apple's API host.

---

## Keeping current with Apple

```bash
npm run spec:update   # fetch the latest OpenAPI spec from Apple
npm run generate      # regenerate tools; prints a diff-friendly report
npm test              # verify nothing broke
```

The generated report shows exactly what changed, so a new Apple API version is a reviewable diff rather than a guess.

---

## Safety

Running an agent against a production store listing deserves some care.

- **`--read-only`** blocks every mutating operation at the registry level, before any handler runs. In this mode `tools/list` doesn't even advertise them.
- **Annotations** — each tool declares `readOnlyHint`, `destructiveHint` and `idempotentHint`, so MCP clients can prompt for confirmation on the operations that warrant it.
- **Narrow scope** — loading fewer domains means fewer ways for an unexpected instruction to reach something it shouldn't.
- **Host pinning** — all traffic, including paginated follow-ups, is pinned to `api.appstoreconnect.apple.com`.
- **No telemetry.**

See [SECURITY.md](SECURITY.md) for credential handling details.

---

## Troubleshooting

**`401 Unauthorized`** — Key ID, Issuer ID and `.p8` file must all belong to the same key. Confirm the key hasn't been revoked, and that `ASC_PRIVATE_KEY_PATH` is absolute.

**`403 Forbidden`** — The key's role lacks permission for that operation. Sales reports need Finance; user management needs Admin. Apple also restricts programmatic app *creation* on some accounts — create the app in the web UI once, then manage it here.

**`409 Conflict` on a version update** — App Store Connect only allows edits in certain version states. A version that is in review or already released is locked.

**Too many tools / context exhausted** — You're probably running `--domains=all`. Use a narrower set; `asc__search_tools` will still find anything you need.

**Sales report returns base64** — Apple sends these as gzipped TSV, so the server returns `{ contentType, base64 }` rather than mangling it. Decode and gunzip to read.

**`429 Too Many Requests`** — Handled automatically: requests are paced against Apple's 3,600/hour limit and retried with exponential backoff. Persistent 429s mean something else is sharing your key.

---

## Development

```bash
git clone https://github.com/erayendes/app-store-connect-mcp.git
cd app-store-connect-mcp
npm install
npm run build
npm test
```

| Path | Contains |
|---|---|
| `src/core/` | JWT signing, HTTP client, rate limiting, tool registry |
| `src/generated/` | Generated operations — do not edit by hand |
| `src/storekit/` | App Store Server API tools |
| `src/tools/` | Introspection tools |
| `scripts/generate.ts` | The generator |
| `scripts/domains.ts` | Resource → domain mapping |
| `scripts/describe.ts` | Description synthesis and curated overrides |

Apple's spec ships no summaries or descriptions — only tags. `describe.ts` synthesises readable descriptions from the operation structure, with hand-written overrides for the operations people reach for most. Improving those descriptions is the highest-leverage contribution you can make: they're what the model reads when deciding which tool to call.

---

## License

MIT — see [LICENSE](LICENSE).

Not affiliated with Apple Inc. See [NOTICE](NOTICE).
