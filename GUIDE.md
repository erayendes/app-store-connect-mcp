# Guide / Rehber

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

From zero to a working setup — install, configure, and talk to your App Store Connect account in plain language.

Sıfırdan çalışan bir kuruluma — kurun, yapılandırın ve App Store Connect hesabınızla sade bir dille konuşun.

## English

Heimdall runs anywhere Node.js **20.19+** runs — macOS, Linux and Windows. Only one feature is macOS-only: storing the `.p8` key in the **macOS Keychain**. On Linux and Windows you supply the key as a file path or inline PEM instead ([§6](#6-configure)); everything else is identical.

### 1. Create an App Store Connect API key

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

Most day-to-day release work needs only **App Manager**; add **Developer** for CI build uploads, or **Finance**/**Sales** only if you actually run `analytics` tools. For how to cap the risk regardless of role, see [SECURITY.md](SECURITY.md) — `--read-only` mode removes all mutation risk.

### 2. Install

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

### 3. Store credentials once — the setup wizard

```bash
npx -y @erayendes/asc-mcp setup
```

The wizard does more than collect fields:

1. **Reuse existing credentials.** If you've run setup before, it finds your saved Key/Issuer and offers to reuse them and just re-pick profiles.
2. **Open the keys page** for you (optional).
3. **Validate as you type.** Key ID and Issuer ID formats are checked; the `.p8` path accepts a drag-and-drop from Finder (quotes, escaped spaces and `~` are handled) and re-prompts until it points at a real key file.
4. **Verify against Apple** before saving — one lightweight request confirms the credentials work. If Apple is unreachable it offers to save anyway; if Apple rejects them, you re-enter.
5. **Vendor number** (optional) — needed only for sales/finance reports.
6. **Profile picker** — an interactive checklist (space to toggle). Each row shows the profile's tool count and rough token cost; already-registered profiles are pre-checked.
7. **Bundle ID — only if you pick a StoreKit profile** (`monetization`). It then asks the StoreKit environment. If you don't pick monetization, you're never asked.
8. **Register automatically.** With the `claude` CLI present, setup runs `claude mcp add`/`remove` for you after showing the plan. Otherwise it prints both the CLI commands and a ready-to-paste `mcpServers` JSON block.

The key is stored in the **macOS Keychain** (or referenced by file path off macOS), and everything non-secret goes to `~/.config/asc-mcp/config.json`. Every profile reads this shared config, so server entries need **no env block** — and rotating the key later means re-running `setup` once, not editing every entry.

> [!TIP]
> Environment variables still work and always win over the shared config ([§6](#6-configure)) — handy for CI or a second account.

### 4. Register profiles

One install backs eleven small, purpose-built MCP servers. Pass a profile name and only that area's tools are served. The counts are what the setup picker shows (default load, deprecated excluded):

| Profile | Serves | ~Tools |
|:--|:--|--:|
| `app-info` | App identity, store metadata, availability | 115 |
| `distribution` | Versions, review submission, phased release, builds | 138 |
| `user-management` | TestFlight, team members, sandbox testers | 95 |
| `monetization` | Subscriptions, IAP, pricing, StoreKit 2 | 180 |
| `marketing` | Screenshots, product pages, events, reviews | 73 |
| `analytics` | Sales/finance reports, analytics, metrics | 17 |
| `game-center` | Achievements, leaderboards, matchmaking | 176 |
| `xcode-cloud` | CI workflows, build runs, artifacts | 46 |
| `provisioning` | Certificates, provisioning profiles, devices, bundle IDs | 45 |
| `background-assets` | Background Assets (iOS 26) | 18 |
| `webhooks` | Webhook configuration and diagnostics | 12 |

Every profile also carries the gateway tools (`apps__list`, `apps__get`, `asc__status`, `asc__search_tools`, `asc__discover_domains`), so any of them can look up an app ID and point you to a tool it doesn't have.

**Pick per project.** MCP connects every configured server at session start — there's no "load the right server for the topic" mechanism. So the practical form of on-demand loading is to register only the profiles a project uses. A revenue project gets `asc-analytics` + `asc-marketing` (~90 tools); a game adds `asc-game-center`. (Claude Code also defers tool schemas until first use, keeping even several connected profiles cheap.)

Heimdall speaks standard MCP over stdio, so it works with **any MCP client** — Claude Code, Claude Desktop, Codex, Antigravity, Cursor and others. The registration is always the same command, `npx -y @erayendes/asc-mcp <profile>`; only where you put it differs.

**Claude Code** (CLI):

```bash
claude mcp add -s user asc-analytics -- npx -y @erayendes/asc-mcp analytics
claude mcp add -s user asc-monetization -- npx -y @erayendes/asc-mcp monetization
```

**Codex** — `codex mcp add`, or add the block to `~/.codex/config.toml`:

```bash
codex mcp add asc-analytics -- npx -y @erayendes/asc-mcp analytics
```

```toml
# ~/.codex/config.toml
[mcp_servers.asc-analytics]
command = "npx"
args = ["-y", "@erayendes/asc-mcp", "analytics"]
```

**Claude Desktop, Antigravity, and other JSON clients** — add the same `mcpServers` block (no env after `setup`):

```json
{
  "mcpServers": {
    "asc-analytics": { "command": "npx", "args": ["-y", "@erayendes/asc-mcp", "analytics"] },
    "asc-marketing": { "command": "npx", "args": ["-y", "@erayendes/asc-mcp", "marketing"] }
  }
}
```

- **Claude Desktop:** `claude_desktop_config.json` — macOS `~/Library/Application Support/Claude/…`, Windows `%APPDATA%\Claude\…`.
- **Antigravity:** the "…" menu → MCP Store → Manage MCP Servers → View raw config (`mcp_config.json`).
- **From source:** replace `command`/`args` with `node /absolute/path/to/app-store-connect-mcp/dist/index.js analytics`.

**The combined server.** Running without a profile serves the classic combined server, and the old env-based registration still works on any client:

```bash
claude mcp add -s user app-store-connect \
  -e ASC_KEY_ID=YOUR_KEY_ID \
  -e ASC_ISSUER_ID=YOUR_ISSUER_ID \
  -e ASC_PRIVATE_KEY_PATH=/absolute/path/to/AuthKey_XXXXXXXXXX.p8 \
  -- npx -y @erayendes/asc-mcp
```

**Domains reference.** Profiles are curated bundles; underneath, tools are organised into 17 API domains plus `meta` and `storekit`. You rarely need this table — the combined server's default working set (●) covers everyday release work, and `--domains` widens it — but here it is in full. Counts include deprecated operations.

| Domain | Tools | Default | Covers |
|:--|--:|:-:|:--|
| `meta` | 3 | ● | Server introspection and tool discovery |
| `apps` | 116 | ● | Apps, metadata, localizations, availability |
| `versions` | 102 | ● | Version lifecycle, submission, phased release, A/B tests |
| `builds` | 39 | ● | Builds, bundles, icons, pre-release versions |
| `testflight` | 72 | ● | Beta groups, testers, feedback, crash submissions |
| `reviews` | 5 | ● | Customer reviews and developer responses |
| `analytics` | 12 | ● | Sales, finance, analytics reports, performance metrics |
| `subscriptions` | 105 | | Subscriptions, groups, offers, win-back, offer codes |
| `iap` | 68 | | In-app purchases, pricing, offer codes, promotions |
| `marketing` | 60 | | Screenshots, previews, custom pages, in-app events |
| `xcode_cloud` | 41 | | Products, workflows, build runs, artifacts, SCM |
| `provisioning` | 40 | | Bundle IDs, certificates, devices, profiles |
| `game_center` | 273 | | Achievements, leaderboards, matchmaking, challenges |
| `users` | 15 | | Team members, invitations, roles |
| `background_assets` | 13 | | Background assets and asset packs |
| `webhooks` | 11 | | Webhook configuration and delivery diagnostics |
| `pricing` | 7 | | App price schedules and price points |
| `sandbox` | 3 | | Sandbox testers |
| `storekit` | 9 | ○ | App Store Server API — enabled by `ASC_BUNDLE_ID` |

### 5. Verify

Ask your client: *"Check the App Store Connect connection."* It calls `asc__status`, which validates your credentials with a single lightweight request.

### 6. Configure

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
| `ASC_DOMAINS` | no | Comma-separated domains to load, or `all` (env form of `--domains`) |
| `ASC_READ_ONLY` | no | `true` to expose only non-mutating tools |
| `ASC_INCLUDE_DEPRECATED` | no | `true` to also load deprecated operations |
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
| `--include-deprecated` | Also load the 123 operations Apple has deprecated |

### 7. Adding and removing tools later

> [!TIP]
> **You don't have to set everything up front.** Start with a couple of profiles and add more when a project needs them.

- **Re-run `setup`** — it reuses your saved credentials and shows the profile picker again. Check or uncheck; it registers and de-registers for you.
- **Add one directly:** `claude mcp add -s user asc-game-center -- npx -y @erayendes/asc-mcp game-center`
- **Remove one:** `claude mcp remove asc-game-center`
- **On the combined server**, widen or narrow with `--domains`.

> [!NOTE]
> The `claude mcp` commands shown here are Claude Code's. On any other client, add or remove the same entry in its config — the command and args (`npx -y @erayendes/asc-mcp <profile>`) are identical everywhere (see [§4](#4-register-profiles)).

**What happens if a tool isn't loaded?** A missing capability is a signpost, not a dead end. Ask for something a profile doesn't carry, and the agent can call `asc__search_tools` — it searches all 982 operations (plus StoreKit) and, for anything not loaded, names the sibling server that owns it and prints the exact `claude mcp add` command. `asc__discover_domains` does the same at the domain level. Install lean, and let the server tell you what to add when you hit the wall.

### 8. StoreKit 2 — customer transactions

The App Store Server API answers questions about individual customers rather than your listing: purchase history, entitlement, refunds, subscription status. It's enabled when a **bundle ID** is configured (via `setup` or `ASC_BUNDLE_ID`) and served by the `monetization` profile or the combined server.

- **Environment.** Each StoreKit tool accepts an optional `environment` argument (`Production` or `Sandbox`). A transaction ID exists in exactly one environment, so you can query either within a session — the default comes from your setup choice, and you override per call.
- **Read-only mode** hides and blocks the two mutating StoreKit tools (`request_test_notification`, `extend_renewal_date`); the seven read tools stay available.

### 9. Examples

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

### 10. Uninstall

```bash
# Remove registered profiles from Claude Code
claude mcp remove asc-analytics
claude mcp remove asc-monetization   # …repeat for each you added

# Remove the shared credential config
rm -rf ~/.config/asc-mcp

# Remove the key from the macOS Keychain (if you used it)
security delete-generic-password -s asc-mcp -a AuthKey_XXXXXXXXXX

# Uninstall the package (only if installed globally)
npm uninstall -g @erayendes/asc-mcp
```

For Claude Desktop, delete the `asc-*` entries from `claude_desktop_config.json`. Revoking the API key itself is done in App Store Connect.

## Türkçe

Heimdall, Node.js **20.19+**'in çalıştığı her yerde çalışır — macOS, Linux ve Windows. Yalnızca bir özellik macOS'a özgüdür: `.p8` anahtarını **macOS Keychain**'de saklamak. Linux ve Windows'ta anahtarı dosya yolu ya da inline PEM olarak verirsiniz ([§6](#6-yapılandır)); gerisi birebir aynıdır.

### 1. App Store Connect API anahtarı oluşturun

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

Günlük release işlerinin çoğu yalnızca **App Manager** ister; CI build yüklemeleri için **Developer** ekleyin, sadece gerçekten `analytics` araçlarını kullanacaksanız **Finance**/**Sales** ekleyin. Role bakılmaksızın riski nasıl sınırlayacağınız için [SECURITY.md](SECURITY.md)'ye bakın — `--read-only` modu tüm mutasyon riskini kaldırır.

### 2. Kurun

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

### 3. Kimlik bilgisini bir kez kaydedin — setup sihirbazı

```bash
npx -y @erayendes/asc-mcp setup
```

Sihirbaz sadece alan toplamaz:

1. **Mevcut kimlik bilgilerini yeniden kullanır.** Daha önce setup çalıştırdıysanız, kayıtlı Key/Issuer'ınızı bulur ve bunları yeniden kullanıp yalnızca profilleri yeniden seçmeyi önerir.
2. **Anahtar sayfasını** sizin için açar (opsiyonel).
3. **Yazarken doğrular.** Key ID ve Issuer ID formatları kontrol edilir; `.p8` yolu Finder'dan sürükle-bırakı kabul eder (tırnaklar, kaçış karakterli boşluklar ve `~` işlenir) ve gerçek bir anahtar dosyasına işaret edene kadar tekrar sorulur.
4. **Kaydetmeden önce Apple'a doğrular** — tek hafif bir istek kimlik bilgilerinin çalıştığını teyit eder. Apple'a ulaşılamıyorsa yine de kaydetmeyi önerir; Apple reddederse yeniden girersiniz.
5. **Vendor number** (opsiyonel) — sadece satış/finans raporları için gerekir.
6. **Profil seçici** — interaktif bir checklist (seçmek için boşluk). Her satır profilin araç sayısını ve kabaca token maliyetini gösterir; zaten kayıtlı profiller önceden işaretlidir.
7. **Bundle ID — yalnızca bir StoreKit profili seçerseniz** (`monetization`). Ardından StoreKit ortamını sorar. Monetization seçmezseniz hiç sorulmaz.
8. **Otomatik kaydeder.** `claude` CLI varsa, setup planı gösterdikten sonra sizin için `claude mcp add`/`remove` çalıştırır. Yoksa hem CLI komutlarını hem de kopyala-yapıştır bir `mcpServers` JSON bloğu basar.

Anahtar **macOS Keychain**'de saklanır (macOS dışında dosya yoluyla referanslanır); gizli olmayan her şey `~/.config/asc-mcp/config.json`'a yazılır. Her profil bu ortak yapılandırmayı okur; sunucu girdilerinde **env bloğu gerekmez** — ve anahtar değişince tek yerden `setup` yeniden çalıştırılır, her girdi elle düzenlenmez.

> [!TIP]
> Env değişkenleri çalışmaya devam eder ve her zaman ortak yapılandırmayı ezer ([§6](#6-yapılandır)) — CI veya ikinci hesap için kullanışlı.

### 4. Profilleri kaydedin

Tek kurulum, on bir küçük, amaca özel MCP sunucusu sunar. Profil adını verirsiniz ve yalnızca o alanın araçları yüklenir. Sayılar setup seçicinin gösterdiğidir (varsayılan yük, deprecated hariç):

| Profil | Kapsam | ~Araç |
|:--|:--|--:|
| `app-info` | Uygulama kimliği, mağaza metadata'sı, ülke uygunluğu | 115 |
| `distribution` | Sürümler, inceleme gönderimi, kademeli yayın, build'ler | 138 |
| `user-management` | TestFlight, ekip üyeleri, sandbox testçileri | 95 |
| `monetization` | Abonelikler, IAP, fiyatlandırma, StoreKit 2 | 180 |
| `marketing` | Ekran görüntüleri, ürün sayfaları, etkinlikler, yorumlar | 73 |
| `analytics` | Satış/finans raporları, analytics, metrikler | 17 |
| `game-center` | Başarımlar, liderlik tabloları, eşleştirme | 176 |
| `xcode-cloud` | CI iş akışları, build çalıştırmaları, artifact'lar | 46 |
| `provisioning` | Sertifikalar, provisioning profilleri, cihazlar, bundle ID'ler | 45 |
| `background-assets` | Background Assets (iOS 26) | 18 |
| `webhooks` | Webhook yapılandırma ve teşhis | 12 |

Her profil ayrıca giriş kapısı araçlarını taşır (`apps__list`, `apps__get`, `asc__status`, `asc__search_tools`, `asc__discover_domains`); böylece herhangi biri uygulama ID'si bulabilir ve sahip olmadığı bir aracın yerini gösterir.

**Projeye göre seçin.** MCP, config'deki her sunucuyu oturum başında bağlar — "konuya göre doğru sunucuyu yükle" mekanizması yoktur. Bu yüzden isteğe bağlı yüklemenin pratik hâli, her projeye yalnızca kullandığı profilleri kaydetmektir. Gelir projesi `asc-analytics` + `asc-marketing` alır (~90 araç); oyun `asc-game-center` ekler. (Claude Code ayrıca araç şemalarını ilk kullanıma kadar erteler, böylece birkaç profil bağlı olsa bile maliyet düşük kalır.)

Heimdall, stdio üzerinden standart MCP konuşur; bu yüzden **herhangi bir MCP istemcisiyle** çalışır — Claude Code, Claude Desktop, Codex, Antigravity, Cursor ve diğerleri. Kayıt her zaman aynı komuttur, `npx -y @erayendes/asc-mcp <profil>`; yalnızca nereye koyduğunuz değişir.

**Claude Code** (CLI):

```bash
claude mcp add -s user asc-analytics -- npx -y @erayendes/asc-mcp analytics
claude mcp add -s user asc-monetization -- npx -y @erayendes/asc-mcp monetization
```

**Codex** — `codex mcp add`, ya da bloğu `~/.codex/config.toml`'a ekleyin:

```bash
codex mcp add asc-analytics -- npx -y @erayendes/asc-mcp analytics
```

```toml
# ~/.codex/config.toml
[mcp_servers.asc-analytics]
command = "npx"
args = ["-y", "@erayendes/asc-mcp", "analytics"]
```

**Claude Desktop, Antigravity ve diğer JSON istemcileri** — aynı `mcpServers` bloğunu ekleyin (`setup` sonrası env gerekmez):

```json
{
  "mcpServers": {
    "asc-analytics": { "command": "npx", "args": ["-y", "@erayendes/asc-mcp", "analytics"] },
    "asc-marketing": { "command": "npx", "args": ["-y", "@erayendes/asc-mcp", "marketing"] }
  }
}
```

- **Claude Desktop:** `claude_desktop_config.json` — macOS `~/Library/Application Support/Claude/…`, Windows `%APPDATA%\Claude\…`.
- **Antigravity:** "…" menüsü → MCP Store → Manage MCP Servers → View raw config (`mcp_config.json`).
- **Kaynaktan:** `command`/`args` yerine `node /mutlak/yol/app-store-connect-mcp/dist/index.js analytics` kullanın.

**Birleşik sunucu.** Profil vermeden çalıştırmak klasik birleşik sunucuyu açar; eski env tabanlı kayıt da her istemcide çalışmaya devam eder:

```bash
claude mcp add -s user app-store-connect \
  -e ASC_KEY_ID=YOUR_KEY_ID \
  -e ASC_ISSUER_ID=YOUR_ISSUER_ID \
  -e ASC_PRIVATE_KEY_PATH=/mutlak/yol/AuthKey_XXXXXXXXXX.p8 \
  -- npx -y @erayendes/asc-mcp
```

**Domain referansı.** Profiller birer curated pakettir; altta ise araçlar 17 API domaini artı `meta` ve `storekit` içinde toplanır. Bu tabloya nadiren ihtiyacınız olur — birleşik sunucunun varsayılan çalışma seti (●) günlük release işlerini kapsar ve `--domains` onu genişletir — ama işte tamamı. Sayılar kullanımdan kaldırılmış işlemleri de içerir.

| Domain | Araç | Varsayılan | Kapsam |
|:--|--:|:-:|:--|
| `meta` | 3 | ● | Sunucu içgözlemi ve araç keşfi |
| `apps` | 116 | ● | Uygulamalar, metadata, yerelleştirmeler, kullanılabilirlik |
| `versions` | 102 | ● | Sürüm yaşam döngüsü, gönderim, kademeli yayın, A/B testler |
| `builds` | 39 | ● | Build'ler, bundle'lar, ikonlar, ön-sürüm build'leri |
| `testflight` | 72 | ● | Beta grupları, testçiler, geri bildirim, crash gönderimleri |
| `reviews` | 5 | ● | Müşteri yorumları ve geliştirici yanıtları |
| `analytics` | 12 | ● | Satış, finans, analitik raporlar, performans metrikleri |
| `subscriptions` | 105 | | Abonelikler, gruplar, teklifler, win-back, kod teklifleri |
| `iap` | 68 | | Uygulama içi satın almalar, fiyatlandırma, kod teklifleri, promosyonlar |
| `marketing` | 60 | | Ekran görüntüleri, önizlemeler, özel sayfalar, uygulama içi etkinlikler |
| `xcode_cloud` | 41 | | Ürünler, iş akışları, build çalıştırmaları, çıktılar, SCM |
| `provisioning` | 40 | | Bundle ID'ler, sertifikalar, cihazlar, profiller |
| `game_center` | 273 | | Başarımlar, liderlik tabloları, eşleştirme, meydan okumalar |
| `users` | 15 | | Ekip üyeleri, davetler, roller |
| `background_assets` | 13 | | Arka plan varlıkları ve varlık paketleri |
| `webhooks` | 11 | | Webhook yapılandırması ve iletim teşhisi |
| `pricing` | 7 | | Uygulama fiyat planları ve fiyat noktaları |
| `sandbox` | 3 | | Sandbox test kullanıcıları |
| `storekit` | 9 | ○ | App Store Server API — `ASC_BUNDLE_ID` ile etkinleşir |

### 5. Doğrulayın

İstemcinize sorun: *"App Store Connect bağlantısını kontrol et."* Bu, kimlik bilgilerini tek bir hafif istekle doğrulayan `asc__status`'ı çağırır.

### 6. Yapılandırın

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
| `ASC_DOMAINS` | hayır | Yüklenecek domainler, virgülle ayrılmış ya da `all` |
| `ASC_READ_ONLY` | hayır | Yalnızca değiştirmeyen araçları göstermek için `true` |
| `ASC_INCLUDE_DEPRECATED` | hayır | Kullanımdan kaldırılmış işlemleri de yüklemek için `true` |
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
| `--include-deprecated` | Apple'ın kullanımdan kaldırdığı 123 işlemi de yükle |

### 7. Sonradan araç ekleme ve çıkarma

> [!TIP]
> **Her şeyi baştan kurmanız gerekmez.** Birkaç profille başlayın, proje ihtiyaç duydukça ekleyin.

- **`setup`'ı yeniden çalıştırın** — kayıtlı kimlik bilgilerinizi yeniden kullanır ve profil seçicisini tekrar gösterir. İşaretleyin/kaldırın; kaydı sizin için ekler ve siler.
- **Tek birini ekleyin:** `claude mcp add -s user asc-game-center -- npx -y @erayendes/asc-mcp game-center`
- **Tek birini kaldırın:** `claude mcp remove asc-game-center`
- **Birleşik sunucuda** `--domains` ile genişletin ya da daraltın.

> [!NOTE]
> Buradaki `claude mcp` komutları Claude Code'a aittir. Başka herhangi bir istemcide aynı girdiyi kendi config'ine ekleyin ya da kaldırın — komut ve argümanlar (`npx -y @erayendes/asc-mcp <profil>`) her yerde aynıdır (bkz. [§4](#4-profilleri-kaydedin)).

**Bir araç yüklü değilse ne olur?** Eksik bir yetenek çıkmaz sokak değil, bir tabeladır. Bir profilin taşımadığı bir şey isteyin, agent `asc__search_tools`'u çağırabilir — tüm 982 işlemi (artı StoreKit) arar ve yüklü olmayan her şey için sahibi olan kardeş sunucuyu adlandırıp tam `claude mcp add` komutunu basar. `asc__discover_domains` aynısını domain seviyesinde yapar. Yalın kurun, duvara tosladığınızda sunucu ne ekleyeceğinizi söylesin.

### 8. StoreKit 2 — müşteri işlemleri

App Store Server API, listeniz hakkında değil tek tek müşteriler hakkında soruları yanıtlar: satın alma geçmişi, hak, iadeler, abonelik durumu. Bir **bundle ID** yapılandırıldığında (`setup` ya da `ASC_BUNDLE_ID` ile) etkinleşir ve `monetization` profili ya da birleşik sunucu tarafından sunulur.

- **Ortam.** Her StoreKit aracı opsiyonel bir `environment` argümanı kabul eder (`Production` veya `Sandbox`). Bir transaction ID tam olarak tek bir ortamda bulunur, bu yüzden bir oturum içinde ikisini de sorgulayabilirsiniz — varsayılan setup tercihinizden gelir, gerektiğinde çağrı başına geçersiz kılarsınız.
- **Read-only modu**, mutasyon yapan iki StoreKit aracını (`request_test_notification`, `extend_renewal_date`) gizler ve engeller; yedi okuma aracı erişilebilir kalır.

### 9. Örnekler

İstemcinizle sade bir dille konuşun:

> **Release yönetimi** — "Uygulamalarımı listele, sonra Acme için mevcut sürüm durumunu ve release'i neyin engellediğini göster." · "3.2 sürümünü incelemeye gönder, onaylandıktan sonra kademeli yayına başla."

> **TestFlight** — "Insiders adında bir beta grubu oluştur ve son build'i ekle." · "Son bir haftadaki TestFlight crash gönderimlerini cihaz modeline göre grupla göster."

> **Yorumlar** — "Son 30 gündeki, henüz yanıtlanmamış 1 yıldızlı yorumları bul ve yanıt taslakları hazırla."

> **Monetizasyon** *(`monetization` gerekir)* — "Abonelik gruplarımı ve her katmanın Türkiye, Almanya ve ABD'deki fiyatını göster."

> **Müşteri desteği** *(`ASC_BUNDLE_ID` gerekir)* — "Bu müşteri iki kez ücretlendirildiğini söylüyor — işlem ID'si 2000000891234567. Geçmişi ne gösteriyor, şu anda hak sahibi mi?"

**Örnek bir oturum** — ilk çalıştırma nasıl hissettirir:

> **Siz:** App Store Connect bağlantısını kontrol et, sonra uygulamalarımı listele.
> **Agent:** *(`asc__status`, sonra `apps__list` çağırır)* Bağlı. 3 uygulamanız var: Acme (1234567890), Beta, Gamma.
> **Siz:** Acme için mevcut sürüm gönderime hazır mı?
> **Agent:** *(`apps__app_store_versions__list`, `app_store_versions__get` çağırır)* Sürüm 3.2, PREPARE_FOR_SUBMISSION durumunda. Ekran görüntüleri ve açıklama ayarlı; build ekli. Gönderimi engelleyen bir şey yok.
> **Siz:** Uygulama içi etkinlikleri yönetecek bir araç var mı? *(`marketing`'i yüklememişsiniz)*
> **Agent:** *(`asc__search_tools` çağırır)* Evet — `app_events__*` araçları, yüklü olmayan `asc-marketing`'te. Şununla ekle:
> `claude mcp add -s user asc-marketing -- npx -y @erayendes/asc-mcp marketing`

### 10. Kaldırma

```bash
# Kayıtlı profilleri Claude Code'dan kaldır
claude mcp remove asc-analytics
claude mcp remove asc-monetization   # …eklediğiniz her biri için tekrarlayın

# Ortak kimlik bilgisi yapılandırmasını sil
rm -rf ~/.config/asc-mcp

# Anahtarı macOS Keychain'den kaldır (kullandıysanız)
security delete-generic-password -s asc-mcp -a AuthKey_XXXXXXXXXX

# Paketi kaldır (yalnızca global kurduysanız)
npm uninstall -g @erayendes/asc-mcp
```

Claude Desktop için `claude_desktop_config.json`'dan `asc-*` girdilerini silin. API anahtarının kendisini iptal etmek App Store Connect üzerinden yapılır.
