# Changelog / Değişiklik Günlüğü

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/), and the project follows [Semantic Versioning](https://semver.org/). Entries are newest-first.

## English

### [Unreleased] — profile structure

**Breaking. Every profile changes.** Which tool belongs to which profile used to be derived from the URL: the first path segment picked the domain, the domain picked the profile. So every relationship hanging off an app — `/v1/apps/{id}/subscriptionGroups`, `.../customerReviews`, `.../appStoreVersions` — landed in `app-info`, while the resources themselves lived elsewhere. Eight of eleven profiles could not reach their own resources from an app: `asc-monetization` could not list an app's subscription groups at all.

Membership is now hand-curated in `spec/profiles.csv` and generated into the code.

- **17 profiles, up from 11.** New: `access`, `accessibility`, `agreements`, `android-to-ios`, `app-clips`, `encryption`, `testflight`. The ten existing names keep their names.
- **`user-management` is gone**, split into `access` (beta groups, testers, invitations, team members, sandbox), `testflight` (beta localizations, review details, crash feedback), `app-clips` (App Clip beta invocations) and `agreements` (beta license agreement). No tool was lost. No alias — an alias merging four profiles would rebuild the bloated one. Configs naming it still **start**: the server comes up with a single tool that explains the split, so the answer reaches the conversation instead of a log file nobody reads.
- **Every other profile changed size too.** `app-info` goes from 112 tools to 32 — the relationship listings moved to the profiles that own the resource. That is the fix, not a regression, but check your config: the tool you used from `asc-app-info` may now live next door.
- **Sub-profiles.** A profile can be narrowed with a colon: `monetization:subscriptions,iap`. `monetization` is 201 tools; `monetization:subscriptions` is 108 and still carries the one-call price macro. The setup picker opens sub-profiles under a checked profile, all on, and writes the argument for you — check everything and the config stays exactly as it is today. `asc__status` reports which sub-profiles are loaded and roughly what they cost.
- **"Tool not loaded" no longer misdiagnoses.** A profile carries a curated slice of several domains, so "the domain is loaded" said nothing about one tool — every missing tool in a partly-loaded domain was reported as *deprecated*, pointing at a flag that could not help. Deprecation is checked first now, and the remedy names the sub-profile or the sibling server that actually has the tool.
- `asc__discover_domains` answers in profiles when running as one.
- **`asc__describe` + `asc__call` reach anything the profile owns, on any client.** MCP lets a server revise its tool list, but says nothing about when a client hands the revision to the model. Measured with the same prompt in two clients: Claude Code used a newly loaded tool inside the same turn; Codex loaded it, reported that "the session tool list never made the new tools callable", and gave up without an answer. These two tools are in the list from the start, so no notification has to arrive in time — Codex now finishes the same task in one turn. `asc__call` is read-only and says so in its annotation, which is what stops a client from blocking it; writes keep their own tool names, where the client's approval and Heimdall's typed confirmation both still apply.
- **`asc__load` adds a sub-profile mid-session** for clients that do refresh, promoting proxied tools to real ones with their own schemas. `asc__call` does the same promotion on the way through. Hand-written families (StoreKit, reviews-AI, pricing macros) still need a restart, and the reply says so.

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

### [Yayınlanmadı] — profil yapısı

**Kırıcı. Her profil değişiyor.** Bir aracın hangi profile ait olduğu URL'den türetiliyordu: yolun ilk segmenti domaini, domain profili seçiyordu. Dolayısıyla uygulamadan sarkan her ilişki — `/v1/apps/{id}/subscriptionGroups`, `.../customerReviews`, `.../appStoreVersions` — `app-info`'ya düşüyor, kaynağın kendisi başka yerde duruyordu. On bir profilin sekizi kendi kaynağına uygulamadan ulaşamıyordu: `asc-monetization` bir uygulamanın abonelik gruplarını listeleyemiyordu bile.

Profil üyeliği artık `spec/profiles.csv` içinde elle küratörlükle tutuluyor ve koda üretiliyor.

- **11 yerine 17 profil.** Yeni: `access`, `accessibility`, `agreements`, `android-to-ios`, `app-clips`, `encryption`, `testflight`. Mevcut on profilin adı değişmedi.
- **`user-management` kaldırıldı**; dörde ayrıldı: `access` (beta grupları, testçiler, davetler, ekip üyeleri, sandbox), `testflight` (beta metinleri, inceleme bilgisi, kilitlenme geri bildirimi), `app-clips` (App Clip beta çağrıları), `agreements` (beta lisans sözleşmesi). Hiçbir araç kaybolmadı. Alias yok — dört profili birleştiren bir alias, düzeltilmeye çalışılan şişkin profili geri getirirdi. Eski adı yazan config'ler yine de **açılıyor**: sunucu, ayrılmayı anlatan tek bir araçla ayağa kalkar; böylece cevap kimsenin bakmadığı log satırı yerine konuşmaya ulaşır.
- **Diğer profillerin boyutu da değişti.** `app-info` 112 araçtan 32'ye iniyor — ilişki listeleri, kaynağın sahibi olan profillere taşındı. Bu düzeltmenin kendisi, gerileme değil; ama config'inizi gözden geçirin: `asc-app-info`'dan kullandığınız araç artık yan kapıda olabilir.
- **Alt profiller.** Bir profil iki nokta ile daraltılabiliyor: `monetization:subscriptions,iap`. `monetization` 201 araç; `monetization:subscriptions` 108 ve tek çağrılık fiyat makrosunu yine taşıyor. Setup seçicisi, işaretlenen profilin alt profillerini hepsi işaretli açar ve argümanı sizin yerinize yazar — hepsini işaretli bırakırsanız config bugünküyle birebir aynı kalır. `asc__status` hangi alt profillerin yüklü olduğunu ve yaklaşık maliyetini raporlar.
- **"Araç yüklü değil" artık yanlış teşhis koymuyor.** Bir profil birkaç domainden küratörlü bir dilim taşıdığı için "domain yüklü" bilgisi tek bir araç hakkında hiçbir şey söylemiyordu — kısmen yüklü bir domaindeki her eksik araç *deprecated* diye raporlanıyor, kullanıcı işe yaramayan bir bayrağa yönlendiriliyordu. Artık önce deprecated kontrol ediliyor ve çare, aracın gerçekten bulunduğu alt profili ya da kardeş sunucuyu adıyla söylüyor.
- `asc__discover_domains`, profil olarak çalışırken domain yerine profil diliyle cevap veriyor.
- **`asc__describe` + `asc__call`, profilin sahip olduğu her şeye her istemcide ulaşıyor.** MCP bir sunucunun araç listesini güncellemesine izin veriyor ama güncellemenin modele *ne zaman* ulaşacağını söylemiyor. Aynı istem iki istemcide ölçüldü: Claude Code yeni yüklenen aracı aynı turda kullandı; Codex aracı yükledi, "oturum araç listesi yeni araçları çağrılabilir hâle getirmedi" diye raporladı ve cevapsız pes etti. Bu iki araç en baştan listede olduğu için hiçbir bildirimin zamanında ulaşması gerekmiyor — Codex aynı işi artık tek turda bitiriyor. `asc__call` salt-okunur ve bunu annotation'ında söylüyor; istemcinin onu bloklamasını engelleyen şey tam olarak bu. Yazmalar kendi araç adlarında kalıyor — orada hem istemcinin onayı hem Heimdall'ın yazılı onayı işliyor.
- **`asc__load` bir alt profili oturum ortasında ekliyor**, listeyi yenileyen istemciler için: proxy ile çağrılan araçları kendi şemalarıyla gerçek araçlara terfi ettiriyor. `asc__call` de geçerken aynı terfiyi yapıyor. Elle yazılmış aileler (StoreKit, reviews-AI, fiyat makroları) hâlâ yeniden başlatma istiyor; cevap bunu söylüyor.

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
