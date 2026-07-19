# app-store-connect-mcp — Documentation

Full documentation index. Each page below covers one topic in depth, in **English** and **Türkçe**.

Tam dokümantasyon indeksi. Aşağıdaki her sayfa bir konuyu **İngilizce** ve **Türkçe** olarak detaylı şekilde ele alır.

| Page / Sayfa | Covers / İçerik |
|---|---|
| [INSTALLATION.md](INSTALLATION.md) | API key creation, client registration, verification / API anahtarı oluşturma, istemci kaydı, doğrulama |
| [CONFIGURATION.md](CONFIGURATION.md) | Environment variables, CLI flags / Ortam değişkenleri, CLI bayrakları |
| [DOMAINS.md](DOMAINS.md) | Domain table, `--domains` usage / Domain tablosu, `--domains` kullanımı |
| [EXAMPLES.md](EXAMPLES.md) | Example prompts by use case / Kullanım senaryosuna göre örnek istekler |
| [REVIEWS_AI.md](REVIEWS_AI.md) | The `reviews_ai__*` tools / `reviews_ai__*` araçları |
| [TOOL_NAMING.md](TOOL_NAMING.md) | Naming conventions, pagination / İsimlendirme kuralları, sayfalama |
| [SECURITY.md](SECURITY.md) | Credential handling, safety modes / Kimlik bilgisi yönetimi, güvenlik modları |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Common errors and fixes / Yaygın hatalar ve çözümleri |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Local dev setup, project layout / Yerel geliştirme kurulumu, proje yapısı |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute / Katkıda bulunma rehberi |

## English

### What this is

An MCP server for the **App Store Connect API** and the **App Store Server API (StoreKit 2)**. Every tool is generated from Apple's own OpenAPI specification — **1,263 operations across 17 domains** — so coverage is complete by construction, and staying current with Apple means regenerating, not hand-writing.

### Why this exists

Most App Store Connect MCP servers wrap a hand-picked subset of endpoints. That works until you need the one endpoint nobody wrapped. This server takes the opposite approach:

| | |
|---|---|
| **Complete** | Generated from Apple's OpenAPI spec v4.4.1 — all 966 paths, 1,263 operations |
| **Current** | `npm run spec:update && npm run generate` picks up Apple's changes |
| **Scoped** | Load only the domains you need; the full set is opt-in |
| **Safe** | `--read-only` mode, destructive-action annotations, host-pinned requests |
| **Self-describing** | Ask the server what it can do — it will tell you |

Start with [INSTALLATION.md](INSTALLATION.md) to get running in a few minutes.

## Türkçe

### Bu nedir

**App Store Connect API** ve **App Store Server API (StoreKit 2)** için bir MCP sunucusu. Her araç, Apple'ın kendi OpenAPI spesifikasyonundan üretiliyor — **17 domainde 1.263 işlem** — bu yüzden kapsam yapısı gereği eksiksiz; Apple'a ayak uydurmak elle yazmak değil yeniden üretmek anlamına geliyor.

### Bu neden var

Çoğu App Store Connect MCP sunucusu, elle seçilmiş bir uç nokta alt kümesini sarmalar. Kimsenin sarmalamadığı o bir uç noktaya ihtiyaç duyana kadar bu işe yarar. Bu sunucu tam tersi bir yaklaşım izler:

| | |
|---|---|
| **Eksiksiz** | Apple'ın OpenAPI spec v4.4.1'inden üretildi — tüm 966 path, 1.263 işlem |
| **Güncel** | `npm run spec:update && npm run generate` Apple'ın değişikliklerini yakalar |
| **Kapsamlı seçilebilir** | Sadece ihtiyacın olan domainleri yükle; tam set opsiyoneldir |
| **Güvenli** | `--read-only` modu, yıkıcı işlem etiketleri, host'a sabitlenmiş istekler |
| **Kendini anlatan** | Sunucuya ne yapabildiğini sor — sana anlatır |

Birkaç dakikada çalışır hale gelmek için [INSTALLATION.md](INSTALLATION.md) ile başla.
