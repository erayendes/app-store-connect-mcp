# Changelog / Değişiklik Günlüğü

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/), and the project follows [Semantic Versioning](https://semver.org/). Entries are newest-first.

## English

### [2.0.0] — 2026-08-05

#### Profiles are curated, not derived

**Breaking — every profile changed.** Which tool belonged to which profile was read off the URL, so every relationship hanging off an app landed in `app-info` and eight of eleven profiles could not reach their own resources from an app. Membership is hand-curated in `spec/profiles.csv` now and generated into the code.

- **13 profiles, up from 11.** New: `access`, `app-clips`, `testflight`.
- **`user-management` is gone**, split into four. A config still naming it starts anyway, with a single tool explaining the split.
- **Every profile changed size** — `app-info` goes from 112 tools to 57. **Check your config**; the tool you reached for may now live next door.

#### Sub-profiles

A profile narrows with a colon: `monetization` is 204 tools, or take `monetization:subscription-pricing` at 24. 32 sub-profiles across five profiles.

Some tools belong to more than one, so reaching a single tool no longer means loading a whole profile. The setup picker unfolds a checked profile's sub-profiles under the cursor, all on, and writes the argument for you; `asc__status` reports which are loaded and roughly what they cost.

#### Any tool in the profile, on any client

`asc__describe` + `asc__call` are present from the start, so nothing depends on a client refreshing its tool list mid-session — Codex and Antigravity both finish that task in one turn now. `asc__call` is read-only; writes keep their own names and their confirmation gate. `asc__load` adds a sub-profile mid-session for clients that do refresh.

#### Setup registers with every client, not just Claude Code

`setup` knew one command, `claude mcp add`, and left the rest to the user on a machine with Codex and Cursor.

- **It detects the clients on the machine and asks which to install into:** Claude Code, Claude Desktop, Codex, Antigravity, Cursor, Windsurf, VS Code.
- **The vendor's own command writes where one exists** (`claude`, `codex`, `code --add-mcp`); plain JSON configs are backed up and edited. One that cannot be parsed is left untouched and reported with a block to paste. A client failing never stops the others.
- **`register` is the same work without a terminal**, for an agent installing on your behalf: `asc-mcp register monetization:subscription-pricing analytics`. It only adds; removing is `setup`'s job.

> [!NOTE]
> ChatGPT's own connectors accept only remote HTTPS servers, so Heimdall cannot appear there; it runs on your machine over stdio, which is why the private key never leaves it. The Codex entry covers the CLI, the IDE extension and the Codex side of the ChatGPT desktop app — the three share one config file.

#### Fixed

- **A misspelled filter changed which app you were editing.** `filter[bundleId]` was dropped silently, ran unfiltered and returned the account's first app. Both spellings are accepted now.
- **The binary exited 0 with no output when invoked through a symlink.** Both `npm install -g` and `npx` go through one, so every installed copy was dead.
- **Tool search returned nothing for queries in any language but English, and never said why.** 110 of 265 phrasings came back empty; an empty result now explains itself.
- **Tool search offered tools the server refuses to load** — 123 deprecated candidates are filtered out now.
- **The setup picker opened every checked profile's sub-rows at once** (46 rows); expansion follows the cursor now.
- **The picker counted a profile as the sum of its sub-profiles**, not their union. `marketing` reported 108; it serves 90 plus core.
- **`check_entitlement` answered about the wrong product**, then could not say when it did not know. The product ID lives inside the signed payload; an unreadable one is reported as `undecodableTransactions` now.
- **A failed keychain write printed the private key.** Node echoes a child process's whole argv into its error message, and the `.p8` rides in argv as `security -w`. A locked keychain put the key into whatever read setup's stderr — a terminal, a CI log, an agent transcript. It is redacted out of the message now.
- **Every install pulled 3.3 MB it had no way to use.** Apple's OpenAPI spec shipped in the package, but only the generator reads it and the generator does not ship. 6.7 MB → 3.6 MB.

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

### [2.0.0] — 2026-08-05

#### Profiller elle küratörlükten geçiyor

**Kırıcı değişiklik — her profil değişti.** Bir aracın hangi profile ait olduğu URL'den okunuyordu; bu yüzden bir uygulamaya bağlı her ilişki `app-info`'ya düşüyor, on bir profilin sekizi kendi kaynaklarına bir uygulamadan erişemiyordu. Üyelik artık `spec/profiles.csv` içinde elle belirlenip koda üretiliyor.

- **13 profil**, önceden 11. Yeni: `access`, `app-clips`, `testflight`.
- **`user-management` kaldırıldı**, dörde bölündü. Config'inizde hâlâ varsa sunucu yine açılıyor ve bölünmeyi anlatan tek bir araçla geliyor.
- **Her profilin boyutu değişti** — `app-info` 112 araçtan 57'ye indi. **Config'inizi kontrol edin**, aradığınız araç yan komşuda olabilir.

#### Alt profiller

Profil iki nokta üst üste ile daralıyor: `monetization` 204 araç, ya da 24 araçlık `monetization:subscription-pricing`'i seçersiniz. Beş profil altında 32 alt profil.

Bazı araçlar birden fazlasına bağlı, yani tek bir araç için koca bir profil yüklemek gerekmiyor. Setup seçicisi işaretlenen profilin alt profillerini imlecin altında açar, hepsi işaretli gelir ve argümanı sizin yerinize yazar; `asc__status` hangilerinin yüklü olduğunu ve yaklaşık maliyetini raporlar.

#### Profildeki her araç, her istemcide

`asc__describe` + `asc__call` en baştan mevcut, böylece hiçbir şey istemcinin oturum ortasında araç listesini tazelemesine bağlı kalmıyor — Codex ve Antigravity artık aynı işi tek turda bitiriyor. `asc__call` salt okunur; yazmalar kendi adlarını ve onay kapısını koruyor. `asc__load`, tazeleyen istemciler için oturum ortasında alt profil ekler.

#### Setup yalnızca Claude Code'a değil, her istemciye kaydediyor

`setup` tek komut biliyordu: `claude mcp add`; Codex ve Cursor bulunan bir makinede işi kullanıcıya bırakıyordu.

- **Makinede bulunan istemcileri tespit edip hangilerine kurmak istediğinizi soruyor:** Claude Code, Claude Desktop, Codex, Antigravity, Cursor, Windsurf, VS Code.
- **Üreticinin kendi komutu varsa onu kullanıyor** (`claude`, `codex`, `code --add-mcp`); düz JSON config'leri yedekleyip düzenliyor. Ayrıştırılamayan bir dosyaya hiç dokunmuyor, yapıştırılacak blok basıyor. Bir istemcinin başarısız olması diğerlerini durdurmuyor.
- **`register` aynı işi terminal olmadan yapar**, kurulumu sizin adınıza üstlenen bir agent için: `asc-mcp register monetization:subscription-pricing analytics`. Yalnızca ekler; silme işi `setup`'ındır.

> [!NOTE]
> ChatGPT'nin kendi connector'ları yalnızca uzak HTTPS sunucusu kabul ettiği için Heimdall orada görünemez; sizin makinenizde stdio üzerinden çalışır, özel anahtarın makineden hiç çıkmamasının sebebi de budur. Codex satırı CLI'yi, IDE eklentisini ve ChatGPT masaüstünün Codex tarafını kapsar — üçü aynı config dosyasını okur.

#### Düzeltildi

- **Yanlış yazılmış bir filtre hangi uygulamayı düzenlediğinizi değiştiriyordu.** `filter[bundleId]` sessizce düşüyor, filtresiz çalışıp hesabın ilk uygulamasını döndürüyordu. Artık iki yazım da kabul ediliyor.
- **Binary, symlink üzerinden çağrıldığında sessizce 0 ile çıkıyordu.** `npm install -g` ve `npx` symlink kullanır; yani kurulu her kopya ölüydü.
- **Araç arama İngilizce dışındaki sorgulara boş dönüyordu, sebebini de söylemiyordu.** 265 ifadenin 110'u boş dönüyordu; artık sonuç boşsa nedenini açıklıyor.
- **Araç arama, sunucunun yüklemeyi reddettiği araçları öneriyordu** — kullanımdan kalkmış 123 aday artık eleniyor.
- **Setup seçicisi işaretli her profilin alt satırlarını aynı anda açıyordu** (46 satır); açılma artık imleci takip ediyor.
- **Seçici bir profili alt profillerinin toplamı sayıyordu**, birleşimi değil. `marketing` 108 gösteriyordu; gerçekte 90 artı çekirdek sunuyor.
- **`check_entitlement` yanlış ürün hakkında cevap veriyordu**, sonra da bilmediğini söyleyemiyordu. Ürün kimliği imzalı yükün içinde yaşar; okunamayan yük artık `undecodableTransactions` ile bildiriliyor.
- **Başarısız bir keychain yazması özel anahtarı ekrana basıyordu.** Node, alt sürecin tüm argv'sini hata mesajına yazar ve `.p8`, `security -w` argümanı olarak orada bulunur. Kilitli bir keychain, anahtarı setup'ın stderr'ini okuyan her yere düşürüyordu — terminal, CI logu, agent transkripti. Artık mesajdan çıkarılıyor.
- **Her kurulum, kullanamayacağı 3,3 MB'ı indiriyordu.** Apple'ın OpenAPI spesifikasyonu pakete giriyordu, oysa onu yalnızca pakete girmeyen kod üreteci okur. 6,7 MB → 3,6 MB.

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
