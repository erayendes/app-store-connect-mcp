# Changelog / Değişiklik Günlüğü

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/), and the project follows [Semantic Versioning](https://semver.org/). Entries are newest-first.

## English

### [1.1.1] — 2026-07-22

- **CLI messages now show a command that works without a global install.** The help text, the "missing config" and "invalid config" errors, and the StoreKit hint print `npx -y @erayendes/asc-mcp setup` instead of a bare `asc-mcp setup` — the latter only exists after `npm i -g`. `GUIDE.md §7` spells out the re-run command too.

### [1.1.0] — 2026-07-22

- **Rebrand to Heimdall.** The project is now *Heimdall — App Store Connect MCP*. The npm package (`@erayendes/asc-mcp`) and the command (`asc-mcp`) are unchanged.
- **Docs moved to the repository root** (`docs/` removed) so GitHub recognises the community-health files, and corrected throughout: **982 operations / 966 paths / 123 deprecated** (previously reported as 1,263 / 159).
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

### [1.1.0] — 2026-07-19

- Optional **macOS Keychain** source for the private key.
- Bilingual **English / Türkçe** documentation with a flag-based language switcher.

### [1.0.1] — 2026-07-19

- Per-role risk column in the API-key table; roles mapped to this server's actual domains.
- Scoped npm package name `@erayendes/asc-mcp`.

### [1.0.0] — 2026-07-19

- Initial release: an MCP server for the App Store Connect API, with tools generated from Apple's official OpenAPI specification.
- AI-assisted review tools via MCP Sampling.

## Türkçe

### [1.1.1] — 2026-07-22

- **CLI mesajları artık global kurulum olmadan çalışan bir komut gösteriyor.** Help metni, "config eksik"/"config bozuk" hataları ve StoreKit ipucu, çıplak `asc-mcp setup` yerine `npx -y @erayendes/asc-mcp setup` basıyor — çıplak komut yalnızca `npm i -g` sonrası var. `GUIDE.md §7` de yeniden-çalıştırma komutunu açıkça veriyor.

### [1.1.0] — 2026-07-22

- **Heimdall'a yeniden adlandırma.** Proje artık *Heimdall — App Store Connect MCP*. npm paketi (`@erayendes/asc-mcp`) ve komut (`asc-mcp`) değişmedi.
- **Dokümanlar depo köküne taşındı** (`docs/` kaldırıldı); böylece GitHub community-health dosyalarını tanır. Rakamlar baştan sona düzeltildi: **982 işlem / 966 path / 123 deprecated** (önceden 1.263 / 159 yazıyordu).
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

### [1.1.0] — 2026-07-19

- Özel anahtar için opsiyonel **macOS Keychain** kaynağı.
- Bayrak tabanlı dil geçişi olan iki dilli **İngilizce / Türkçe** dokümantasyon.

### [1.0.1] — 2026-07-19

- API anahtarı tablosunda rol-başına risk sütunu; roller bu sunucunun gerçek domainlerine eşlendi.
- Scope'lu npm paket adı `@erayendes/asc-mcp`.

### [1.0.0] — 2026-07-19

- İlk sürüm: App Store Connect API için, araçları Apple'ın resmi OpenAPI spesifikasyonundan üretilen bir MCP sunucusu.
- MCP Sampling ile AI destekli yorum araçları.
