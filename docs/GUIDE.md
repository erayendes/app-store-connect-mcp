# Guide / Rehber

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

From zero to a working setup — install, configure, and talk to your App Store Connect account in plain language.

Sıfırdan çalışan bir kuruluma — kurun, yapılandırın ve App Store Connect hesabınızla sade bir dille konuşun.

## English

Heimdall runs anywhere Node.js **20.19+** runs — macOS, Linux and Windows. Only one feature is macOS-only: storing the `.p8` key in the **macOS Keychain**. On Linux and Windows you supply the key as a file path or inline PEM instead ([Configuration](#configuration)); everything else is identical.

### Create an App Store Connect API key

Go to [Users and Access → Integrations → Keys](https://appstoreconnect.apple.com/access/integrations/api), generate a key, and download the `.p8` file. Note the **Key ID** and **Issuer ID** from the same page.

> [!IMPORTANT]
> You can download the `.p8` file **only once**. Keep it somewhere safe until you've run `setup`.

The role you give the key decides which permissions an agent gets — and what it can break if a prompt goes wrong. Pick the narrowest role that covers your use case.

| Role | Permissions it grants | Risk if the agent goes wrong |
|:--|:--|:--|
| **Admin** | Full control over everything, including user management (`users`), code-signing (`provisioning`) and webhooks (`webhooks`). | **Highest.** Can revoke other users' access and delete certificates/profiles — which breaks signing for the whole team. Blast radius extends beyond your own app. |
| **App Manager** | Manage apps end to end: metadata (`apps`), versions (`versions`), builds (`builds`), TestFlight (`testflight`), subscriptions and IAP (`subscriptions`, `iap`), pricing (`pricing`). | **High.** Can submit or withdraw a live version and delete an in-app purchase or subscription group. Directly affects your live listing and revenue. |
| **Developer** | Build and test only: builds (`builds`), TestFlight (`testflight`), Xcode Cloud (`xcode_cloud`) — upload, not submission. | **Medium.** Can remove testers, builds and beta groups, but can't touch pricing, live metadata, or submit for review. |
| **Marketing** | Manage store presence: screenshots, custom pages, in-app events and reviews (`marketing`). | **Medium.** Can remove custom product pages, previews and in-app events that are already customer-facing. |
| **Sales** | Read sales and trends reports (`analytics`). | **Low.** Almost entirely read-only — report requests, nothing that changes your listing. |
| **Finance** | Read financial and payment reports (`analytics`; also needs `ASC_VENDOR_NUMBER`). | **Low.** Same read-heavy `analytics` domain as Sales. |
| **Customer Support** | Read and reply to customer reviews (`reviews`, including `reviews_ai__*`). | **Low–medium.** One operation posts a public reply — reversible, but visible to customers before you catch a mistake. |

Most day-to-day release work needs only **App Manager**; add **Developer** for CI build uploads, or **Finance**/**Sales** only if you actually run `analytics` tools. For how to cap the risk regardless of role, see [SECURITY.md](../.github/SECURITY.md) — `--read-only` mode removes all mutation risk.

### Install

```bash
npm install -g @erayendes/asc-mcp
```

Or from source:

```bash
git clone https://github.com/erayendes/app-store-connect-mcp.git
cd app-store-connect-mcp
npm install
npm run build
```

### Store credentials once — the setup wizard

```bash
npx -y @erayendes/asc-mcp setup
```

The wizard does more than collect fields:

1. **Reuse existing credentials.** If you've run setup before, it finds your saved Key/Issuer and offers to reuse them and just re-pick profiles.
2. **Open the keys page** for you (optional).
3. **Validate as you type.** Key ID and Issuer ID formats are checked; the `.p8` path accepts a drag-and-drop from Finder (quotes, escaped spaces and `~` are handled) and re-prompts until it points at a real key file.
4. **Verify against Apple** before saving — one lightweight request confirms the credentials work. If Apple is unreachable it offers to save anyway; if Apple rejects them, you re-enter.
5. **Vendor number** (optional) — needed only for sales/finance reports.
6. **Client picker** — which MCP clients should carry the profiles, with everything found on this machine already checked. Clients it did not find stay listed and can be checked anyway.
7. **Profile picker** — each row shows the profile's tool count and rough token cost; already-registered profiles are pre-checked.
8. **Bundle ID — only if you pick a StoreKit profile** (`monetization`). It then asks the StoreKit environment. If you don't pick monetization, you're never asked.
9. **Register everywhere you chose**, after showing the plan and asking once. Where a client ships its own command it is used (`claude`, `codex`, `code --add-mcp`); plain JSON configs are edited directly, backed up first. Anything that could not be written is reported with a block to paste — one client failing never stops the others.

When it finishes, restart your client and say *"check the App Store Connect connection"* — that calls `asc__status`, which validates your credentials with one lightweight request.

> [!TIP]
> The key is stored in the **macOS Keychain** (or referenced by file path off macOS), and everything non-secret goes to `~/.config/asc-mcp/config.json`. Every profile reads this shared config, so server entries need **no env block** — and rotating the key later means re-running `setup` once, not editing every entry.
>
> Environment variables still work and always win over the shared config ([Configuration](#configuration)) — handy for CI or a second account.

### Register profiles

One install backs thirteen small, purpose-built MCP servers. Pass a profile name and only that area's tools are served. The counts are what the setup picker shows (deprecated excluded, core included):

| Profile | Serves | ~Tools | Sub-profiles |
|:--|:--|--:|:--|
| `app-info` | App identity, store metadata, categories, availability, age ratings, accessibility labels, EULA | 57 | — |
| `distribution` | Versions, localizations, phased release, review submission, builds, export compliance, EU distribution | 129 | version, dma-distribution, builds, submission, encryption, review, pre-release, coverages |
| `monetization` | Subscriptions, IAP, pricing, offers, StoreKit 2, sandbox testers | 206 | subscription-catalog, subscription-pricing, subscription-offers, iap-catalog, iap-pricing, iap-offers, app-price, storekit |
| `marketing` | Screenshots, product pages, in-app events, customer reviews | 99 | custom-product-page, product-page-optimization, app-event, customer-review, nominations |
| `access` | Beta groups, individual testers, invitations, team members | 64 | beta-testers, beta-groups, users |
| `testflight` | Beta app localizations, beta review details, crash feedback, beta license agreement | 54 | — |
| `game-center` | Achievements, leaderboards, activities, challenges, matchmaking | 182 | gc-leaderboard, gc-matchmaking, gc-activities, gc-challenge, gc-achievement, gc-details, gc-groups, gc-default |
| `app-clips` | Default and advanced experiences, header images, beta invocations | 51 | — |
| `xcode-cloud` | CI workflows, build runs, artifacts | 51 | — |
| `provisioning` | Certificates, provisioning profiles, devices, bundle IDs | 49 | — |
| `analytics` | Sales/finance reports, analytics, performance metrics | 24 | — |
| `background-assets` | Background Assets (iOS 26) | 23 | — |
| `webhooks` | Webhook configuration and diagnostics | 17 | — |

Every profile also carries the **core set** — `apps__list`, `apps__get`, the four shared relationship listings, and `asc__status` / `asc__search_tools` / `asc__discover_domains`. So whichever profile you install can look up an app ID and point you to a tool it doesn't have.

#### Pick per project

MCP connects every configured server at session start — there's no "load the right server for the topic" mechanism. So the practical form of on-demand loading is to register only the profiles a project uses. A revenue project gets `asc-analytics` + `asc-marketing` (122 tools); a game adds `asc-game-center`. Agents defer tool schemas until first use, keeping even several connected profiles cheap.

#### Sub-profiles

These narrow a large profile. Check a profile in the setup picker; move the cursor onto it and its sub-profiles unfold underneath, all on — uncheck what you don't need.

`monetization` is 204 tools, for instance; if you only change subscription prices, `monetization:subscription-pricing` is 24. The server is called `asc-monetization` either way. Ask `asc__status` at any time and it reports which sub-profiles are loaded and roughly what they cost.

Writing the config by hand, the syntax is:

```
npx -y @erayendes/asc-mcp monetization                       everything
npx -y @erayendes/asc-mcp monetization:subscription-pricing  that slice plus core
```

#### Where it registers

`setup` registers the profiles with every MCP client it finds. None of these clients share a config file, so this is the step that would otherwise be done once per client, by hand, in a different format each time.

| Client | Where it goes | Written by |
|:--|:--|:--|
| Claude Code | `~/.claude.json` | `claude mcp add` |
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` | edited here |
| Codex | `~/.codex/config.toml` | `codex mcp add` |
| Antigravity | `~/.gemini/config/mcp_config.json` | edited here |
| Cursor | `~/.cursor/mcp.json` | edited here |
| Windsurf | `~/.codeium/windsurf/mcp_config.json` | edited here |
| VS Code | user MCP config | `code --add-mcp` |

Claude Code and Claude Desktop are one row in the picker and two files on disk — registering in one and expecting the other to follow is the most common way to end up with a profile that is configured and invisible. Codex is the reverse: the CLI, the IDE extension and the Codex side of the ChatGPT desktop app all read the same file, so one entry covers all three.

Files edited here are backed up first. One that cannot be parsed — a JSON config with comments in it — is left alone and reported, with a block to paste.

> [!NOTE]
> **ChatGPT's own connectors are not on this list.** They accept only remote HTTPS servers; Heimdall runs on your machine over stdio, which is why your private key never leaves it. The Codex row above is a different surface that happens to share the brand.

<details>
<summary><b>Registering by hand</b> — if you would rather not run <code>setup</code>, or your client is not listed</summary>

The command is always `npx -y @erayendes/asc-mcp <profile>`; only where you put it differs.

```bash
claude mcp add -s user asc-analytics -- npx -y @erayendes/asc-mcp analytics
codex  mcp add asc-analytics -- npx -y @erayendes/asc-mcp analytics
```

For JSON clients (no env block needed after `setup`):

```json
{
  "mcpServers": {
    "asc-analytics": { "command": "npx", "args": ["-y", "@erayendes/asc-mcp", "analytics"] }
  }
}
```

- **Antigravity:** the "…" menu → MCP Store → Manage MCP Servers → View raw config.
- **VS Code:** the key is `servers`, not `mcpServers`.
- **From source:** replace `command`/`args` with `node /absolute/path/to/app-store-connect-mcp/dist/index.js analytics`.
- **The combined server:** run without a profile; the old env-based registration still works on any client.

</details>

#### Adding and removing later

> [!TIP]
> **You don't have to set everything up front.** Start with a couple of profiles and add more when a project needs them.

- **Re-run setup** — `npx -y @erayendes/asc-mcp setup`. It reuses your credentials and shows the pickers again, with clients and profiles pre-checked as they stand. Check or uncheck; it registers and de-registers across every client you selected.
- **Let an agent do it:** `npx -y @erayendes/asc-mcp register game-center` adds without a terminal and without touching credentials. `--clients=codex,claude` narrows it. It only ever adds — `setup` is what removes.
- **By hand, per client:** the "Registering by hand" block above.

#### Reaching a tool without restarting

A profile you narrowed still knows about the rest of itself:

- **`asc__describe`** returns the full schema of any tool the profile owns, loaded or not.
- **`asc__call`** runs a read for you through that schema. It is read-only and says so in its annotation, which is what keeps clients from blocking it — writes keep their own tool names, where your client's approval still applies — and Heimdall's own confirmation too, if you turned it on.
- **`asc__load`** adds a whole sub-profile mid-session, promoting proxied tools to real ones with their own schemas. Hand-written families (StoreKit, reviews-AI, pricing macros) still need a restart, and the reply says so.

The proxy exists because MCP lets a server revise its tool list but says nothing about *when* a client hands that revision to the model. Measured with one prompt in three clients: Claude Code used a newly loaded tool in the same turn; Codex loaded it, reported that the session tool list never made it callable, and gave up. `asc__describe` and `asc__call` are in the list from the start, so nothing has to arrive in time.

**And if the tool is in another profile entirely?** `asc__search_tools` searches all 982 operations plus StoreKit, names the sibling server that owns anything not loaded, and prints the command to add it. Install lean and let the server tell you what you are missing.

### StoreKit 2 — customer transactions

The App Store Server API answers questions about individual customers rather than your listing: purchase history, entitlement, refunds, subscription status. It's enabled when a **bundle ID** is configured (via `setup` or `ASC_BUNDLE_ID`) and served by the `monetization` profile or the combined server.

- **Environment.** Each StoreKit tool accepts an optional `environment` argument (`Production` or `Sandbox`). A transaction ID exists in exactly one environment, so you can query either within a session — the default comes from your setup choice, and you override per call.
- **Read-only mode** hides and blocks the two mutating StoreKit tools (`request_test_notification`, `extend_renewal_date`); the seven read tools stay available.

### Configuration

**Environment**

| Variable | Required | Purpose |
|:--|:--|:--|
| `ASC_KEY_ID` | yes | Key ID from App Store Connect |
| `ASC_ISSUER_ID` | yes | Issuer ID from App Store Connect |
| `ASC_PRIVATE_KEY_PATH` | yes\* | Absolute path to the `.p8` file |
| `ASC_PRIVATE_KEY` | yes\* | PEM contents, as an alternative to the path |
| `ASC_PRIVATE_KEY_KEYCHAIN` | yes\* | `service/account` of a macOS Keychain entry holding the `.p8` (macOS only) |
| `ASC_VENDOR_NUMBER` | no | Required by sales and finance report tools |
| `ASC_BUNDLE_ID` | no | Enables App Store Server API (StoreKit 2) tools |
| `ASC_APP_APPLE_ID` | no | Your app's numeric Apple ID |
| `ASC_ENVIRONMENT` | no | `Sandbox` (default) or `Production`, for StoreKit 2 |
| `ASC_APPLE_ROOT_CERTS` | no | Paths (or one directory) of Apple's DER root certificates. Set it and the StoreKit reads return verified, decoded fields; unset they return Apple's signed payloads |
| `ASC_DOMAINS` | no | Comma-separated domains to load, or `all` (env form of `--domains`) |
| `ASC_READ_ONLY` | no | `true` to expose only non-mutating tools |
| `ASC_CONFIRM_WRITES` | no | `1` / `true` to ask before every write, `0` / `false` to never ask (default: only the strong risk levels) |
| `ASC_DRY_RUN` | no | `1` / `true`: writes never reach Apple — each mutating call returns what would have been sent (method, path, body, risk) after validation. Reads run normally |
| `ASC_MAX_RESPONSE_CHARS` | no | Response size ceiling in characters (default 100000). Oversized lists are cut to the items that fit, with an explicit truncation note |
| `ASC_KEEP_RAW_RESPONSES` | no | `1` to pass Apple's payloads through untouched — by default per-resource `links` and links-only `relationships` URL noise is stripped (~85% smaller listings) |
| `ASC_REDACT_PII` | no | `1` to mask tester identities (`email`, `firstName`, `lastName`) on the way to the model, keeping the email domain. Off by default: listing testers is how you answer "who hasn't installed the build?", and a redacted answer sends you around this server to get it. Turn it on for shared transcripts or contractor contexts |
| `ASC_REVIEWS_BRAND_VOICE` | no | Brand-voice guidance for `reviews_ai__draft_response`, e.g. "friendly, concise, we say 'folks'" |
| `ASC_REVIEWS_BANNED_PHRASES` | no | Comma-separated phrases the draft must never contain |
| `ASC_REVIEWS_SUPPORT_URL` | no | Support URL the draft points customers at for follow-ups |
| `ASC_BASE_URL` | no | Override the API origin (e.g. `http://localhost:4010`) to test against a local fixture server — requests, pagination and host-pinning all follow it. Leave unset for Apple's real API |
| `ASC_INCLUDE_DEPRECATED` | no | `true` to also load deprecated operations |
| `ASC_RATE_LIMIT_PER_HOUR` | no | Lower the hourly pacing budget below Apple's 3,600. Each process paces itself as if it were the only client of the key, so several agents sharing one team key will together burn the quota — give each a slice |
| `ASC_RATE_LIMIT_PER_MINUTE` | no | Same for the per-minute window (default 300) |
| `ASC_CONFIG_DIR` | no | Override the shared-config directory (default `~/.config/asc-mcp`) |

\* Supply the private key exactly one way. If more than one is set, precedence is `ASC_PRIVATE_KEY` (inline) → `ASC_PRIVATE_KEY_KEYCHAIN` → `ASC_PRIVATE_KEY_PATH`. Env credentials override the shared config file entirely, so you can't accidentally mix two accounts.

**Choosing how to supply the key** — all three produce the same result; pick by how private you need the key to be.

- **File path (simplest, all platforms).** `ASC_PRIVATE_KEY_PATH` points at the `.p8`; config holds only the path.
- **Inline PEM (all platforms).** `ASC_PRIVATE_KEY` holds the PEM. Convenient for CI secrets, but the key lives verbatim in your config/secret store.
- **macOS Keychain (most private, macOS only).** Store once, then reference it:

  ```bash
  security add-generic-password -s asc-mcp -a AuthKey_XXXXXXXXXX -w "$(cat AuthKey_XXXXXXXXXX.p8)"
  ```

  Then set `ASC_PRIVATE_KEY_KEYCHAIN=asc-mcp/AuthKey_XXXXXXXXXX`. The OS gates access. (`setup` does this for you on macOS.)

**Flags**

| Flag | Effect |
|:--|:--|
| `--domains=<list>` | Comma-separated domains to load, or `all` (combined server only) |
| `--read-only` | Expose only tools that cannot modify anything |
| `--confirm` | Ask before every write, not just the strong risk levels |
| `--no-confirm` | Never ask; the client's own tool approval is the only gate |
| `--dry-run` | Writes never reach Apple; each mutating call returns what would have been sent, with its risk level |
| `--include-deprecated` | Also load the 123 operations Apple has deprecated |

> [!TIP]
> **Confirm before risky writes (on by default).** Before a `revenue`, `destructive`, `infrastructure` or `access` write runs — changing a price, handing out Admin, deleting a certificate — Heimdall asks you to confirm through your client's prompt ([MCP elicitation](https://modelcontextprotocol.io/)), showing what would change. So even if the assistant misreads "drop the price a bit" as `0.99`, nothing changes until you approve it. Everything below those levels runs on your client's own tool approval.
>
> That split is the point. Asking on every write was the first shipped behaviour and it backfired: a client that declares elicitation support but cannot render the form answers `decline`, which the protocol reports exactly like you clicking no, so ordinary writes came back as "you refused". Asking on none was the correction, and it removed the guard from the writes that move money. The default now keeps it where the blast radius is.
>
> `--confirm` (or `ASC_CONFIRM_WRITES=1`) asks before every write; `--no-confirm` (or `ASC_CONFIRM_WRITES=0`) asks before none. `--dry-run` prints the full impact preview without touching Apple, and `--read-only` removes every mutating tool regardless of what any client does.

**Tool naming.** Tool names mirror the resource hierarchy, with the action last (`apps__list` → `GET /v1/apps`, `app_store_versions__create` → `POST /v1/appStoreVersions`). Every tool carries its `METHOD /path` in the description, so you can cross-reference [Apple's API documentation](https://developer.apple.com/documentation/appstoreconnectapi) directly.

#### Multiple accounts

Heimdall keeps one shared credential set, but you can still work with several
App Store Connect accounts today — no extra feature needed:

- **Per-server environment.** Environment variables override the shared config
  entirely, so give a second MCP server entry its own credentials:

  ```json
  "asc-clientB": {
    "command": "npx", "args": ["-y", "@erayendes/asc-mcp", "app-info"],
    "env": { "ASC_KEY_ID": "…", "ASC_ISSUER_ID": "…", "ASC_PRIVATE_KEY_PATH": "/path/AuthKey_B.p8" }
  }
  ```

- **Separate config directories.** `ASC_CONFIG_DIR` points a server (and the
  setup wizard) at a different shared config: run
  `ASC_CONFIG_DIR=~/.config/asc-clientB npx -y @erayendes/asc-mcp setup` once,
  then set the same `ASC_CONFIG_DIR` in that server's `env` block. Each
  directory keeps its own key reference, vendor number and bundle ID.

The two servers appear side by side in your client (name them by account), and
nothing is ever mixed: env-provided credentials never fall back to the shared
file for missing pieces.

### One call instead of a chain

A handful of hand-written tools collapse a multi-step flow into one call. The raw tools stay exactly as they are — these sit on top, and each is turned on by the sub-profile that owns it.

| Instead of | Call | Needs |
|:--|:--|:--|
| app → group → subscription → price points | `pricing__get_subscription_price` — one country or, with the territory omitted, all ~175 grouped by price | `monetization:subscription-pricing` |
| the same chain plus the write | `pricing__set_subscription_price` | `monetization:subscription-pricing` |
| setting a price country by country | `pricing__equalize_price` — one anchor price, every other market derived by Apple, for an app, an IAP or a subscription | `monetization:subscription-pricing` |
| version → 50 localizations → screenshot sets → screenshots | `listing__get_screenshots` | `distribution:version` |
| reserving a screenshot, then moving the bytes yourself | `listing__upload_screenshot` | `distribution:version` |
| request → report → instance → segment → a signed URL | `analytics__get_report` — returns rows, not a link | `analytics` |
| fetching reviews and grouping them by hand | `reviews_ai__triage`, `reviews_ai__daily_briefing`, `reviews_ai__draft_response` | `marketing:customer-review` |

Two of them do something the raw tools cannot do at all rather than merely faster: `listing__upload_screenshot` performs Apple's reserve → upload → commit sequence (the raw tool only reserves a slot and moves no bytes), and `analytics__get_report` downloads the report, where the raw chain ends holding a link.

`pricing__equalize_price` is a REVENUE-level write covering about 175 countries. Run it under `--dry-run` first: it returns the full derived table before anything is sent.

### Examples

Talk to your client in plain language:
> **Release management** — "List my apps, then show the current version state for Acme and what's blocking release." · "Submit version 3.2 for review, then start a phased release once it's approved."

> **TestFlight** — "Create a beta group called Insiders and add the latest build." · "Show TestFlight crash submissions from the last week, grouped by device model."

> **Reviews** — "Find 1-star reviews from the last 30 days with no response yet, and draft replies."

> **Monetization** *(needs `monetization`)* — "Show my subscription groups and each tier's price in Turkey, Germany and the US."

> **Customer support** *(needs `ASC_BUNDLE_ID`)* — "This customer says they were charged twice — transaction ID 2000000891234567. What does their history show, and are they currently entitled?"

**A sample session** — what a first run feels like:

> **You:** Check the App Store Connect connection, then list my apps.
> **Agent:** *(calls `asc__status`, then `apps__list`)* Connected. You have 3 apps: Acme (1234567890), Beta, Gamma.
> **You:** For Acme, is the current version ready to submit?
> **Agent:** *(calls `apps__app_store_versions__list`, `app_store_versions__get`)* Version 3.2 is in PREPARE_FOR_SUBMISSION. Screenshots and description are set; the build is attached. Nothing is blocking submission.
> **You:** Is there a tool to manage in-app events? *(you didn't load `marketing`)*
> **Agent:** *(calls `asc__search_tools`)* Yes — `app_events__*` live on `asc-marketing`, which isn't loaded. Add it with:
> `claude mcp add -s user asc-marketing -- npx -y @erayendes/asc-mcp marketing`

### Uninstall

**Unregister first.** Re-run `setup`, uncheck everything in the profile picker, and it removes the profiles from every client you select — including the ones you may have forgotten registering. Checking what is left is worth a minute: `setup` writes to more places than most people remember.

To do it by hand, each client needs its own pass. There is no single list to consult:

```bash
claude mcp remove asc-analytics       # …once per profile
codex mcp remove asc-analytics
```

- **Claude Desktop:** delete the `asc-*` entries from `claude_desktop_config.json`.
- **Antigravity / Cursor / Windsurf:** delete them from that client's JSON config — the paths are in the [Where it registers](#where-it-registers) table. A `.bak` next to it is from a `setup` run, safe to delete too.
- **VS Code:** delete them from the user MCP config; the key there is `servers`.

Then the rest:

```bash
# The shared credential config
rm -rf ~/.config/asc-mcp

# The key in the macOS Keychain, if you used it
security delete-generic-password -s asc-mcp -a AuthKey_XXXXXXXXXX

# The package, only if you installed it globally
npm uninstall -g @erayendes/asc-mcp
```

> [!WARNING]
> Revoking the API key itself is done in App Store Connect. Deleting the local copy does not revoke it.

---

## Türkçe

Heimdall, Node.js **20.19+**'in çalıştığı her yerde çalışır — macOS, Linux ve Windows. Yalnızca bir özellik macOS'a özgüdür: `.p8` anahtarını **macOS Keychain**'de saklamak. Linux ve Windows'ta anahtarı dosya yolu ya da inline PEM olarak verirsiniz ([Yapılandırma](#yapılandırma)); gerisi birebir aynıdır.

### API anahtarı oluşturun

[Users and Access → Integrations → Keys](https://appstoreconnect.apple.com/access/integrations/api) sayfasına gidin, bir anahtar oluşturun ve `.p8` dosyasını indirin. Aynı sayfadan **Key ID** ve **Issuer ID** değerlerini not alın.

> [!IMPORTANT]
> `.p8` dosyasını **yalnızca bir kez** indirebilirsiniz. `setup`'ı çalıştırana kadar güvenli bir yerde saklayın.

Anahtara verdiğiniz rol, bir agent'ın hangi yetkileri aldığını — ve bir istek ters giderse neyi bozabileceğini — belirler. Kullanım amacınızı karşılayan en dar rolü seçin.

| Rol | Verdiği yetkiler | Agent hata yaparsa risk |
|:--|:--|:--|
| **Admin** | Her şey üzerinde tam kontrol; kullanıcı yönetimi (`users`), kod imzalama (`provisioning`) ve webhook'lar (`webhooks`) dahil. | **En yüksek.** Başka kullanıcıların erişimini iptal edebilir, sertifika/profilleri silebilir — bu tüm ekibin imzalamasını bozar. Etki alanı kendi uygulamanızın dışına taşar. |
| **App Manager** | Uygulamayı uçtan uca yönetir: metadata (`apps`), sürümler (`versions`), build'ler (`builds`), TestFlight (`testflight`), abonelikler ve IAP (`subscriptions`, `iap`), fiyatlandırma (`pricing`). | **Yüksek.** Canlı bir sürümü gönderebilir/geri çekebilir, bir uygulama içi satın alma veya abonelik grubunu silebilir. Canlı listenizi ve gelirinizi doğrudan etkiler. |
| **Developer** | Yalnızca build ve test: build'ler (`builds`), TestFlight (`testflight`), Xcode Cloud (`xcode_cloud`) — yükleme, gönderim değil. | **Orta.** Testçileri, build'leri, beta gruplarını silebilir; ama fiyatlandırmaya, canlı metadata'ya dokunamaz, incelemeye gönderemez. |
| **Marketing** | Mağaza görünürlüğünü yönetir: ekran görüntüleri, özel sayfalar, uygulama içi etkinlikler ve yorumlar (`marketing`). | **Orta.** Zaten müşteriye görünen özel ürün sayfalarını, önizlemeleri, uygulama içi etkinlikleri kaldırabilir. |
| **Sales** | Satış ve trend raporlarını okur (`analytics`). | **Düşük.** Neredeyse tamamen salt okunur — rapor istekleri, listenizi değiştiren bir şey yok. |
| **Finance** | Finans ve ödeme raporlarını okur (`analytics`; ayrıca `ASC_VENDOR_NUMBER` gerekir). | **Düşük.** Sales ile aynı, ağırlıklı okuma yapan `analytics` domaini. |
| **Customer Support** | Müşteri yorumlarını okur ve yanıtlar (`reviews`, `reviews_ai__*` dahil). | **Düşük-orta.** Bir işlem kamuya açık yanıt gönderir — geri alınabilir, ama bir hatayı fark etmeden önce müşterilere görünür. |

> [!NOTE]
> Günlük release işlerinin çoğu yalnızca **App Manager** ister; CI build yüklemeleri için **Developer** ekleyin, sadece gerçekten `analytics` araçlarını kullanacaksanız **Finance**/**Sales** ekleyin. Role bakılmaksızın riski nasıl sınırlayacağınız için [SECURITY.md](../.github/SECURITY.md)'ye bakın — `--read-only` modu tüm mutasyon riskini kaldırır.

### Kurun

```bash
npm install -g @erayendes/asc-mcp
```

Ya da kaynaktan:

```bash
git clone https://github.com/erayendes/app-store-connect-mcp.git
cd app-store-connect-mcp
npm install
npm run build
```

### Kimlik bilgisini bir kez kaydedin — setup sihirbazı

```bash
npx -y @erayendes/asc-mcp setup
```

Sihirbaz sadece alan toplamaz:

1. **Mevcut kimlik bilgilerini yeniden kullanır.** Daha önce setup çalıştırdıysanız, kayıtlı Key/Issuer'ınızı bulur ve bunları yeniden kullanıp yalnızca profilleri yeniden seçmeyi önerir.
2. **Anahtar sayfasını** sizin için açar (opsiyonel).
3. **Yazarken doğrular.** Key ID ve Issuer ID formatları kontrol edilir; `.p8` yolu Finder'dan sürükle-bırakı kabul eder (tırnaklar, kaçış karakterli boşluklar ve `~` işlenir) ve gerçek bir anahtar dosyasına işaret edene kadar tekrar sorulur.
4. **Kaydetmeden önce Apple'a doğrular** — tek hafif bir istek kimlik bilgilerinin çalıştığını teyit eder. Apple'a ulaşılamıyorsa yine de kaydetmeyi önerir; Apple reddederse yeniden girersiniz.
5. **Vendor number** (opsiyonel) — sadece satış/finans raporları için gerekir.
6. **İstemci seçici** — profilleri hangi MCP istemcilerinin taşıyacağı; bu makinede bulunanlar işaretli gelir. Bulunamayanlar listede kalır ve yine de işaretlenebilir.
7. **Profil seçici** — her satır profilin araç sayısını ve kabaca token maliyetini gösterir; zaten kayıtlı profiller önceden işaretlidir.
8. **Bundle ID — yalnızca bir StoreKit profili seçerseniz** (`monetization`). Ardından StoreKit ortamını sorar. Monetization seçmezseniz hiç sorulmaz.
9. **Seçtiğiniz her yere kaydeder**, planı gösterip bir kez sorduktan sonra. Bir istemcinin kendi komutu varsa o kullanılır (`claude`, `codex`, `code --add-mcp`); düz JSON config'ler doğrudan düzenlenir, önce yedeklenir. Yazılamayan bir şey olursa yapıştırılacak blokla birlikte bildirilir — bir istemcinin başarısız olması diğerlerini durdurmaz.

Bittiğinde istemcinizi yeniden başlatın ve *"App Store Connect bağlantısını kontrol et"* deyin — bu `asc__status`'u çağırır, tek hafif bir istekle kimlik bilgilerinizi doğrular.

> [!TIP]
> Anahtar **macOS Keychain**'de saklanır (macOS dışında dosya yoluyla referanslanır); gizli olmayan her şey `~/.config/asc-mcp/config.json`'a yazılır. Her profil bu ortak yapılandırmayı okur; sunucu girdilerinde **env bloğu gerekmez** — ve anahtar değişince tek yerden `setup` yeniden çalıştırılır, her girdi elle düzenlenmez.
>
> Env değişkenleri çalışmaya devam eder ve her zaman ortak yapılandırmayı ezer ([Yapılandırma](#yapılandırma)) — CI veya ikinci hesap için kullanışlı.

### Profilleri kaydedin

Tek kurulum, on üç küçük, amaca özel MCP sunucusu sunar. Profil adını verirsiniz ve yalnızca o alanın araçları yüklenir. Sayılar setup seçicinin gösterdiğidir (deprecated hariç, çekirdek dahil):

| Profil | Kapsam | ~Araç | Alt profiller |
|:--|:--|--:|:--|
| `app-info` | Uygulama kimliği, mağaza metadata'sı, kategoriler, ülke uygunluğu, yaş sınırı, erişilebilirlik etiketleri, EULA | 57 | — |
| `distribution` | Sürümler, yerelleştirmeler, kademeli yayın, inceleme gönderimi, build'ler, ihracat uyumluluğu, AB dağıtımı | 129 | version, dma-distribution, builds, submission, encryption, review, pre-release, coverages |
| `monetization` | Abonelikler, IAP, fiyatlandırma, teklifler, StoreKit 2, sandbox testçileri | 206 | subscription-catalog, subscription-pricing, subscription-offers, iap-catalog, iap-pricing, iap-offers, app-price, storekit |
| `marketing` | Ekran görüntüleri, ürün sayfaları, uygulama içi etkinlikler, yorumlar | 99 | custom-product-page, product-page-optimization, app-event, customer-review, nominations |
| `access` | Beta grupları, testçiler, davetler, ekip üyeleri | 64 | beta-testers, beta-groups, users |
| `testflight` | Beta uygulama metinleri, beta inceleme bilgisi, kilitlenme geri bildirimi, beta lisans sözleşmesi | 54 | — |
| `game-center` | Başarımlar, liderlik tabloları, etkinlikler, meydan okumalar, eşleştirme | 182 | gc-leaderboard, gc-matchmaking, gc-activities, gc-challenge, gc-achievement, gc-details, gc-groups, gc-default |
| `app-clips` | Varsayılan ve gelişmiş deneyimler, başlık görselleri, beta çağrıları | 51 | — |
| `xcode-cloud` | CI iş akışları, build çalıştırmaları, artifact'lar | 51 | — |
| `provisioning` | Sertifikalar, provisioning profilleri, cihazlar, bundle ID'ler | 49 | — |
| `analytics` | Satış/finans raporları, analytics, performans metrikleri | 24 | — |
| `background-assets` | Background Assets (iOS 26) | 23 | — |
| `webhooks` | Webhook yapılandırma ve teşhis | 17 | — |

Her profil ayrıca **çekirdek kümeyi** taşır — `apps__list`, `apps__get`, dört ortak ilişki listelemesi ve `asc__status` / `asc__search_tools` / `asc__discover_domains`. Yani hangi profili kurarsanız kurun, bir uygulama ID'si bulabilir ve sahip olmadığı bir aracın yerini size gösterebilir.

#### Projeye göre seçin

MCP, config'deki her sunucuyu oturum başında bağlar — "konuya göre doğru sunucuyu yükle" mekanizması yoktur. Bu yüzden isteğe bağlı yüklemenin pratik hâli, her projeye yalnızca kullandığı profilleri kaydetmektir. Gelir projesi `asc-analytics` + `asc-marketing` alır (122 araç); oyun `asc-game-center` ekler. Ajanlar araç şemalarını ilk kullanıma kadar erteler, böylece birkaç profil bağlı olsa bile maliyet düşük kalır.

#### Alt profiller

Büyük bir profili daraltır. Setup seçicisinde bir profili işaretleyin; imleci üstüne getirdiğinizde alt profilleri hepsi işaretli olarak açılır, istemediğinizi kaldırın.

Örneğin `monetization` 204 araç; ama sadece abonelik fiyatı değiştiriyorsanız `monetization:subscription-pricing` 24 araç. Sunucunun adı iki durumda da `asc-monetization` kalır. `asc__status` hangi alt profillerin yüklü olduğunu ve yaklaşık maliyetini raporlar.

Config'i elle yazacaksanız sözdizimi:

```
npx -y @erayendes/asc-mcp monetization                       tamamı
npx -y @erayendes/asc-mcp monetization:subscription-pricing  o dilim + çekirdek
```

#### Nereye kaydedilir

`setup` profilleri, bulduğu her MCP istemcisine kaydeder. Bu istemcilerin hiçbiri config dosyasını paylaşmaz; yani bu adım olmasa her istemci için ayrı ayrı, her seferinde farklı biçimde elle yapılırdı.

| İstemci | Nereye | Nasıl yazılır |
|:--|:--|:--|
| Claude Code | `~/.claude.json` | `claude mcp add` |
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` | buradan düzenlenir |
| Codex | `~/.codex/config.toml` | `codex mcp add` |
| Antigravity | `~/.gemini/config/mcp_config.json` | buradan düzenlenir |
| Cursor | `~/.cursor/mcp.json` | buradan düzenlenir |
| Windsurf | `~/.codeium/windsurf/mcp_config.json` | buradan düzenlenir |
| VS Code | kullanıcı MCP config'i | `code --add-mcp` |

Claude Code ile Claude Desktop seçicide tek satır, diskte iki dosyadır — birine kaydedip diğerinin de gelmesini beklemek, bir profilin kurulu olup görünmemesinin en yaygın sebebidir. Codex'te durum tersidir: CLI, IDE eklentisi ve ChatGPT masaüstünün Codex tarafı aynı dosyayı okur, tek kayıt üçünü birden kapsar.

Buradan düzenlenen dosyaların önce yedeği alınır. Ayrıştırılamayan bir dosya — içinde yorum olan bir JSON config — hiç ellenmez, durum bildirilir ve yapıştırılacak blok basılır.

> [!NOTE]
> **ChatGPT'nin kendi connector'ları bu listede değil.** Onlar yalnızca uzak HTTPS sunucusu kabul ediyor; Heimdall sizin makinenizde stdio üzerinden çalışıyor, özel anahtarınızın makineden hiç çıkmamasının sebebi de bu. Yukarıdaki Codex satırı aynı markayı taşıyan başka bir yüzey.

<details>
<summary><b>Elle kayıt</b> — <code>setup</code> çalıştırmak istemiyorsanız ya da istemciniz listede yoksa</summary>

Komut her zaman `npx -y @erayendes/asc-mcp <profil>`; yalnızca nereye koyduğunuz değişir.

```bash
claude mcp add -s user asc-analytics -- npx -y @erayendes/asc-mcp analytics
codex  mcp add asc-analytics -- npx -y @erayendes/asc-mcp analytics
```

JSON istemcileri için (setup sonrası env bloğu gerekmez):

```json
{
  "mcpServers": {
    "asc-analytics": { "command": "npx", "args": ["-y", "@erayendes/asc-mcp", "analytics"] }
  }
}
```

- **Antigravity:** "…" menüsü → MCP Store → Manage MCP Servers → View raw config.
- **VS Code:** anahtar `mcpServers` değil, `servers`.
- **Kaynaktan:** `command`/`args` yerine `node /mutlak/yol/app-store-connect-mcp/dist/index.js analytics`.
- **Birleşik sunucu:** profil vermeden çalıştırın; eski env tabanlı kayıt her istemcide çalışmaya devam eder.

</details>

#### Sonradan ekleme ve çıkarma

> [!TIP]
> **Her şeyi baştan kurmanız gerekmez.** Birkaç profille başlayın, proje ihtiyaç duydukça ekleyin.

- **Setup'ı yeniden çalıştırın** — `npx -y @erayendes/asc-mcp setup`. Kimlik bilgilerinizi yeniden kullanır ve seçicileri tekrar gösterir; istemciler ve profiller mevcut hâlleriyle işaretli gelir. İşaretleyin/kaldırın; seçtiğiniz her istemcide ekler ve siler.
- **Bir agent yapsın:** `npx -y @erayendes/asc-mcp register game-center` terminal olmadan ve kimlik bilgisine dokunmadan ekler. `--clients=codex,claude` ile daraltılır. Yalnızca ekler — silme işi `setup`'ındır.
- **Elle, istemci başına:** yukarıdaki "Elle kayıt" bloğu.

#### Bir aracı yeniden başlatmadan kullanmak

Daralttığınız bir profil geri kalanını yine de bilir:

- **`asc__describe`** profilin sahip olduğu herhangi bir aracın tam şemasını döndürür — yüklü olsun olmasın.
- **`asc__call`** o şema üzerinden sizin için bir okuma çalıştırır. Salt okunurdur ve bunu annotation'ında söyler; istemcilerin onu engellememesinin sebebi budur. Yazma işlemleri kendi araç adlarında kalır — orada istemcinizin onayı, açtıysanız Heimdall'ın kendi onayı da geçerlidir.
- **`asc__load`** oturum ortasında bütün bir alt profil ekler, proxy'lenen araçları kendi şemalarıyla gerçek araçlara terfi ettirir. Elle yazılmış aileler (StoreKit, reviews-AI, fiyat makroları) hâlâ yeniden başlatma ister; yanıt bunu söyler.

Proxy'nin var olma sebebi şu: MCP bir sunucunun araç listesini güncellemesine izin verir ama istemcinin bunu modele **ne zaman** ileteceği hakkında hiçbir şey söylemez. Aynı istemle üç istemcide ölçüldü: Claude Code yeni yüklenen aracı aynı turda kullandı; Codex yükledi, oturum araç listesinin onu çağrılabilir yapmadığını bildirdi ve vazgeçti. `asc__describe` ve `asc__call` en baştan listede olduğu için hiçbir şeyin zamanında ulaşması gerekmiyor.

**Peki araç bambaşka bir profildeyse?** `asc__search_tools` tüm 982 işlemi artı StoreKit'i arar, yüklü olmayan her şey için sahibi olan kardeş sunucuyu adlandırır ve ekleme komutunu basar. Yalın kurun, sunucu size neyin eksik olduğunu söylesin.

### StoreKit 2 — müşteri işlemleri

App Store Server API, listeniz hakkında değil tek tek müşteriler hakkında soruları yanıtlar: satın alma geçmişi, hak, iadeler, abonelik durumu. Bir **bundle ID** yapılandırıldığında (`setup` ya da `ASC_BUNDLE_ID` ile) etkinleşir ve `monetization` profili ya da birleşik sunucu tarafından sunulur.

- **Ortam.** Her StoreKit aracı opsiyonel bir `environment` argümanı kabul eder (`Production` veya `Sandbox`). Bir transaction ID tam olarak tek bir ortamda bulunur, bu yüzden bir oturum içinde ikisini de sorgulayabilirsiniz — varsayılan setup tercihinizden gelir, gerektiğinde çağrı başına geçersiz kılarsınız.
- **Read-only modu**, mutasyon yapan iki StoreKit aracını (`request_test_notification`, `extend_renewal_date`) gizler ve engeller; yedi okuma aracı erişilebilir kalır.

### Yapılandırma

**Ortam değişkenleri**

| Değişken | Zorunlu | Amaç |
|:--|:--|:--|
| `ASC_KEY_ID` | evet | App Store Connect'ten Key ID |
| `ASC_ISSUER_ID` | evet | App Store Connect'ten Issuer ID |
| `ASC_PRIVATE_KEY_PATH` | evet\* | `.p8` dosyasının mutlak yolu |
| `ASC_PRIVATE_KEY` | evet\* | Yol yerine PEM içeriğinin kendisi |
| `ASC_PRIVATE_KEY_KEYCHAIN` | evet\* | `.p8`'i tutan bir macOS Keychain girdisinin `service/account`'u (sadece macOS) |
| `ASC_VENDOR_NUMBER` | hayır | Satış ve finans rapor araçları için gerekli |
| `ASC_BUNDLE_ID` | hayır | App Store Server API (StoreKit 2) araçlarını etkinleştirir |
| `ASC_APP_APPLE_ID` | hayır | Uygulamanın sayısal Apple ID'si |
| `ASC_ENVIRONMENT` | hayır | StoreKit 2 için `Sandbox` (varsayılan) veya `Production` |
| `ASC_APPLE_ROOT_CERTS` | hayır | Apple'ın DER kök sertifikalarının yolları (ya da tek bir dizin). Ayarlıysa StoreKit okumaları doğrulanmış ve çözülmüş alanlar döndürür; ayarlı değilse Apple'ın imzalı yüklerini döndürür |
| `ASC_DOMAINS` | hayır | Yüklenecek domainler, virgülle ayrılmış ya da `all` |
| `ASC_READ_ONLY` | hayır | Yalnızca değiştirmeyen araçları göstermek için `true` |
| `ASC_CONFIRM_WRITES` | hayır | Her yazmadan önce sormak için `1` / `true`, hiç sormamak için `0` / `false` (varsayılan: yalnızca güçlü risk seviyeleri) |
| `ASC_DRY_RUN` | hayır | `1` / `true`: yazmalar Apple'a hiç gitmez — her mutasyon çağrısı, doğrulamadan sonra gönderilecek olanı (metod, path, body, risk) döndürür. Okumalar normal çalışır |
| `ASC_MAX_RESPONSE_CHARS` | hayır | Cevap boyutu tavanı, karakter (varsayılan 100000). Büyük listeler sığan öğelere kırpılır, açık kesme notuyla |
| `ASC_KEEP_RAW_RESPONSES` | hayır | Apple cevaplarını olduğu gibi geçirmek için `1` — varsayılan olarak kaynak-başı `links` ve links-only `relationships` URL gürültüsü atılır (listeler ~%85 küçülür) |
| `ASC_REDACT_PII` | hayır | Modele giden test kullanıcısı kimliklerini (`email`, `firstName`, `lastName`) maskelemek için `1`; e-posta alan adı korunur. Varsayılan kapalı: "kim build'i kurmamış?" sorusunun cevabı tam da o listedir, maskeli cevap kullanıcıyı bu sunucunun dışına iter. Paylaşılan transkript veya dış ekip bağlamlarında açın |
| `ASC_REVIEWS_BRAND_VOICE` | hayır | `reviews_ai__draft_response` için marka sesi, ör. "samimi, kısa" |
| `ASC_REVIEWS_BANNED_PHRASES` | hayır | Taslakta asla geçmeyecek ifadeler (virgülle ayrılmış) |
| `ASC_REVIEWS_SUPPORT_URL` | hayır | Taslağın müşteriyi yönlendireceği destek adresi |
| `ASC_BASE_URL` | hayır | API origin'ini değiştir (ör. `http://localhost:4010`) — yerel fixture sunucusuyla test için; istekler, pagination ve host-pinning onu izler. Apple'ın gerçek API'si için boş bırakın |
| `ASC_INCLUDE_DEPRECATED` | hayır | Kullanımdan kaldırılmış işlemleri de yüklemek için `true` |
| `ASC_RATE_LIMIT_PER_HOUR` | hayır | Saatlik pacing bütçesini Apple'ın 3.600'ünün altına çeker. Her süreç kendini anahtarın tek istemcisi sanarak pacing yapar; tek takım anahtarını paylaşan birden çok ajan kotayı birlikte yakar — her birine bir dilim verin |
| `ASC_RATE_LIMIT_PER_MINUTE` | hayır | Dakikalık pencere için aynısı (varsayılan 300) |
| `ASC_CONFIG_DIR` | hayır | Ortak yapılandırma dizinini değiştir (varsayılan `~/.config/asc-mcp`) |

\* Özel anahtarı tam olarak tek bir yolla verin. Birden fazlası set edilmişse öncelik: `ASC_PRIVATE_KEY` (inline) → `ASC_PRIVATE_KEY_KEYCHAIN` → `ASC_PRIVATE_KEY_PATH`. Env kimlik bilgileri ortak yapılandırma dosyasını tümüyle ezer, böylece iki hesabı yanlışlıkla karıştıramazsınız.

**Anahtarı verme yöntemini seçme** — üçü de aynı sonucu verir; anahtarın ne kadar gizli kalmasını istediğinize göre seçin.

- **Dosya yolu (en basit, tüm platformlar).** `ASC_PRIVATE_KEY_PATH` `.p8`'e işaret eder; config sadece yolu tutar.
- **Inline PEM (tüm platformlar).** `ASC_PRIVATE_KEY` PEM'i tutar. CI secret'ları için pratik, ama anahtar config/secret store'unda birebir durur.
- **macOS Keychain (en gizli, sadece macOS).** Bir kere saklayın, sonra referans verin:

  ```bash
  security add-generic-password -s asc-mcp -a AuthKey_XXXXXXXXXX -w "$(cat AuthKey_XXXXXXXXXX.p8)"
  ```

  Sonra `ASC_PRIVATE_KEY_KEYCHAIN=asc-mcp/AuthKey_XXXXXXXXXX` ayarlayın. Erişimi işletim sistemi denetler. (`setup` bunu macOS'ta sizin için yapar.)

**Bayraklar**

| Bayrak | Etki |
|:--|:--|
| `--domains=<liste>` | Yüklenecek domainler, virgülle ayrılmış ya da `all` (sadece birleşik sunucu) |
| `--read-only` | Yalnızca hiçbir şeyi değiştiremeyen araçları göster |
| `--confirm` | Yalnızca güçlü risk seviyelerinde değil, her yazmadan önce sor |
| `--no-confirm` | Hiç sorma; tek kapı client'ın kendi araç onayı olur |
| `--dry-run` | Yazmalar Apple'a gitmez; her mutasyon çağrısı gönderilecek olanı risk seviyesiyle döndürür |
| `--include-deprecated` | Apple'ın kullanımdan kaldırdığı 123 işlemi de yükle |

> [!TIP]
> **Riskli yazmalardan önce onay (varsayılan açık).** Bir `revenue`, `destructive`, `infrastructure` ya da `access` yazması çalışmadan önce — fiyat değiştirme, Admin yetkisi verme, sertifika silme — Heimdall client'ınızın istemi üzerinden ([MCP elicitation](https://modelcontextprotocol.io/)) onay ister ve neyin değişeceğini gösterir. Yani asistan "fiyatı biraz düşür"ü yanlışlıkla `0.99` olarak anlasa bile, siz onaylamadan hiçbir şey değişmez. Bu seviyelerin altındaki her şey client'ınızın kendi araç onayıyla çalışır.
>
> Bu ayrım işin özü. Her yazmada sormak ilk yayınlanan davranıştı ve ters tepti: elicitation desteğini bildirip formu gösteremeyen bir client `decline` döner, protokol de bunu sizin "hayır" demenizle birebir aynı raporlar; sıradan yazmalar "reddettiniz" diye geri geliyordu. Hiç sormamak düzeltmesiydi ve guard'ı parayı hareket ettiren yazmalardan da kaldırdı. Şimdiki varsayılan onu patlama yarıçapının olduğu yerde tutuyor.
>
> `--confirm` (veya `ASC_CONFIRM_WRITES=1`) her yazmadan önce sorar, `--no-confirm` (veya `ASC_CONFIRM_WRITES=0`) hiç sormaz. `--dry-run` Apple'a dokunmadan tam etki önizlemesini basar, `--read-only` ise hangi client olursa olsun tüm mutasyon araçlarını kaldırır.

**Araç isimlendirme.** Araç isimleri kaynak hiyerarşisini yansıtır, eylem en sonda gelir (`apps__list` → `GET /v1/apps`, `app_store_versions__create` → `POST /v1/appStoreVersions`). Her araç açıklamasında `METHOD /path` bilgisini taşır; böylece doğrudan [Apple'ın API dokümantasyonuyla](https://developer.apple.com/documentation/appstoreconnectapi) çapraz kontrol yapabilirsiniz.

#### Birden çok hesap

Heimdall tek bir ortak kimlik seti tutar; yine de birden çok App Store Connect hesabıyla bugün çalışabilirsiniz — ek özellik gerekmez:

- **Sunucu-başına environment.** Environment değişkenleri ortak yapılandırmayı tamamen ezer; ikinci bir MCP sunucu girdisine kendi kimliğini verin:

  ```json
  "asc-musteriB": {
    "command": "npx", "args": ["-y", "@erayendes/asc-mcp", "app-info"],
    "env": { "ASC_KEY_ID": "…", "ASC_ISSUER_ID": "…", "ASC_PRIVATE_KEY_PATH": "/yol/AuthKey_B.p8" }
  }
  ```

- **Ayrı yapılandırma dizinleri.** `ASC_CONFIG_DIR`, bir sunucuyu (ve setup sihirbazını) farklı bir ortak yapılandırmaya yönlendirir:
  `ASC_CONFIG_DIR=~/.config/asc-musteriB npx -y @erayendes/asc-mcp setup` komutunu bir kez çalıştırın, sonra aynı `ASC_CONFIG_DIR`'ı o sunucunun `env` bloğuna koyun. Her dizin kendi anahtar referansını, vendor numarasını ve bundle ID'sini tutar.

İki sunucu istemcinizde yan yana görünür (hesaba göre adlandırın) ve hiçbir şey karışmaz: env ile verilen kimlik, eksik parçalar için ortak dosyaya asla geri düşmez.

### Zincir yerine tek çağrı

Elle yazılmış birkaç araç, çok adımlı bir akışı tek çağrıya indiriyor. Ham araçlar aynen duruyor — bunlar üstte oturuyor ve her biri sahibi olan alt profille açılıyor.

| Şunun yerine | Bunu çağır | Gereken |
|:--|:--|:--|
| app → grup → abonelik → fiyat noktaları | `pricing__get_subscription_price` — tek ülke, ya da territory verilmezse ~175 ülke fiyata göre gruplanmış | `monetization:subscription-pricing` |
| aynı zincir artı yazma | `pricing__set_subscription_price` | `monetization:subscription-pricing` |
| ülke ülke fiyat belirlemek | `pricing__equalize_price` — tek çapa fiyat, diğer tüm pazarları Apple türetir; uygulama, IAP veya abonelik için | `monetization:subscription-pricing` |
| sürüm → 50 yerelleştirme → ekran görüntüsü setleri → görüntüler | `listing__get_screenshots` | `distribution:version` |
| ekran görüntüsü için yer ayırıp baytları kendiniz taşımak | `listing__upload_screenshot` | `distribution:version` |
| istek → rapor → örnek → segment → imzalı URL | `analytics__get_report` — bağlantı değil, satır döndürür | `analytics` |
| yorumları çekip elle gruplamak | `reviews_ai__triage`, `reviews_ai__daily_briefing`, `reviews_ai__draft_response` | `marketing:customer-review` |

Bunlardan ikisi ham araçların daha hızlı yaptığı bir şeyi değil, hiç yapamadığı bir şeyi yapıyor: `listing__upload_screenshot` Apple'ın rezerve et → yükle → onayla dizisini yürütüyor (ham araç yalnızca yer ayırıyor, tek bayt taşımıyor) ve `analytics__get_report` raporu indiriyor — ham zincir elinde bir bağlantıyla bitiyor.

`pricing__equalize_price` yaklaşık 175 ülkeyi kapsayan REVENUE seviyesinde bir yazma. Önce `--dry-run` ile çalıştırın: hiçbir şey gönderilmeden türetilmiş tablonun tamamını döndürür.

### Örnekler

İstemcinizle sade bir dille konuşun:

- **Release yönetimi** — "Uygulamalarımı listele, sonra Acme için mevcut sürüm durumunu ve release'i neyin engellediğini göster." · "3.2 sürümünü incelemeye gönder, onaylandıktan sonra kademeli yayına başla."
- **TestFlight** — "Insiders adında bir beta grubu oluştur ve son build'i ekle." · "Son bir haftadaki TestFlight crash gönderimlerini cihaz modeline göre grupla göster."
- **Yorumlar** — "Son 30 gündeki, henüz yanıtlanmamış 1 yıldızlı yorumları bul ve yanıt taslakları hazırla."
- **Monetizasyon** *(`monetization` gerekir)* — "Abonelik gruplarımı ve her katmanın Türkiye, Almanya ve ABD'deki fiyatını göster."
- **Müşteri desteği** *(`ASC_BUNDLE_ID` gerekir)* — "Bu müşteri iki kez ücretlendirildiğini söylüyor — işlem ID'si 2000000891234567. Geçmişi ne gösteriyor, şu anda hak sahibi mi?"

**Örnek bir oturum** — ilk çalıştırma nasıl hissettirir:

> **Siz:** App Store Connect bağlantısını kontrol et, sonra uygulamalarımı listele.
> **Agent:** *(`asc__status`, sonra `apps__list` çağırır)* Bağlı. 3 uygulamanız var: Acme (1234567890), Beta, Gamma.
> **Siz:** Acme için mevcut sürüm gönderime hazır mı?
> **Agent:** *(`apps__app_store_versions__list`, `app_store_versions__get` çağırır)* Sürüm 3.2, PREPARE_FOR_SUBMISSION durumunda. Ekran görüntüleri ve açıklama ayarlı; build ekli. Gönderimi engelleyen bir şey yok.
> **Siz:** Uygulama içi etkinlikleri yönetecek bir araç var mı? *(`marketing`'i yüklememişsiniz)*
> **Agent:** *(`asc__search_tools` çağırır)* Evet — `app_events__*` araçları, yüklü olmayan `asc-marketing`'te. Şununla ekle:
> `claude mcp add -s user asc-marketing -- npx -y @erayendes/asc-mcp marketing`

### Kaldırma

**Önce kaydı silin.** `setup`'ı yeniden çalıştırın, profil seçicisinde her şeyin işaretini kaldırın; seçtiğiniz her istemciden profilleri siler — kaydettiğinizi unuttuklarınız dahil. Neyin kaldığına bakmaya değer: `setup` çoğu kişinin hatırladığından fazla yere yazıyor.

Elle yapacaksanız her istemci ayrı bir tur ister. Bakılacak tek bir liste yok:

```bash
claude mcp remove asc-analytics       # …her profil için bir kez
codex mcp remove asc-analytics
```

- **Claude Desktop:** `claude_desktop_config.json`'dan `asc-*` girdilerini silin.
- **Antigravity / Cursor / Windsurf:** o istemcinin JSON config'inden silin — yollar [Nereye kaydedilir](#nereye-kaydedilir) tablosunda. Yanındaki `.bak` bir `setup` koşusundan kalmadır, onu da silebilirsiniz.
- **VS Code:** kullanıcı MCP config'inden silin; oradaki anahtar `servers`.

Sonra gerisi:

```bash
# Ortak kimlik bilgisi yapılandırması
rm -rf ~/.config/asc-mcp

# Kullandıysanız, macOS Keychain'deki anahtar
security delete-generic-password -s asc-mcp -a AuthKey_XXXXXXXXXX

# Paket, yalnızca global kurduysanız
npm uninstall -g @erayendes/asc-mcp
```

> [!WARNING]
> API anahtarının kendisini iptal etmek App Store Connect üzerinden yapılır. Yerel kopyayı silmek onu iptal etmez.
