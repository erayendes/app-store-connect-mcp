# app-store-connect-mcp — Documentation

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

Full documentation index, in **English** and **Türkçe**.

Tam dokümantasyon indeksi, **İngilizce** ve **Türkçe**.

| Page / Sayfa | Covers / İçerik |
|---|---|
| [GUIDE.md](GUIDE.md) | API key creation, configuration, client registration, example prompts / API anahtarı oluşturma, yapılandırma, istemci kaydı, örnek istekler |
| [SECURITY.md](SECURITY.md) | Credential handling, safety modes / Kimlik bilgisi yönetimi, güvenlik modları |
| [SUPPORT.md](SUPPORT.md) | Getting help, troubleshooting / Yardım alma, sorun giderme |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute, local dev setup / Katkıda bulunma, yerel geliştirme kurulumu |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Community standards / Topluluk kuralları |

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

Start with [GUIDE.md](GUIDE.md) to get running in a few minutes.

### Domains

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

### Tool naming

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

**Pagination** — list tools accept `next_url`: pass the `links.next` value from a previous response to fetch the following page. The server refuses to follow a cursor pointing anywhere other than Apple's API host.

### Reviews AI

Three tools ride on top of the `reviews` domain and use **MCP Sampling** — your client's own model, no separate API key:

| Tool | What it does |
|---|---|
| `reviews_ai__draft_response` | Draft a reply to one review. Returns text only. |
| `reviews_ai__triage` | Pull recent reviews and group them by theme (bug, feature request, pricing, praise, spam). |
| `reviews_ai__daily_briefing` | Summarise the last N days of reviews into a short briefing. |

All three are read-only and always loaded — none of them post anything. To publish a reply, review the draft yourself and call `customer_review_responses__create`.

See [GUIDE.md](GUIDE.md) for example prompts by use case.

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

Birkaç dakikada çalışır hale gelmek için [GUIDE.md](GUIDE.md) ile başla.

### Domainler

Tüm 1.263 işlemlik yüzey, araç tanımları için 100 bin token'ın epey üzerinde bir maliyete denk gelir — çoğu context penceresinin ayırabileceğinden fazla. Bu yüzden sunucu, günlük release işlerini kapsayan bir **varsayılan çalışma seti** yükler; geri kalan her şey tek bir bayrak uzağındadır.

| Domain | Araç sayısı | Varsayılan | Kapsam |
|---|---:|:---:|---|
| `meta` | 3 | ● | Sunucu içgözlemi ve araç keşfi |
| `apps` | 174 | ● | Uygulamalar, metadata, yerelleştirmeler, kullanılabilirlik |
| `versions` | 130 | ● | Sürüm yaşam döngüsü, gönderim, kademeli yayın, A/B testler |
| `builds` | 57 | ● | Build'ler, bundle'lar, ikonlar, ön-sürüm build'leri |
| `testflight` | 86 | ● | Beta grupları, testçiler, geri bildirim, crash gönderimleri |
| `reviews` | 6 | ● | Müşteri yorumları ve geliştirici yanıtları |
| `analytics` | 15 | ● | Satış, finans, analitik raporlar, performans metrikleri |
| `subscriptions` | 133 | | Abonelikler, gruplar, teklifler, win-back, kod teklifleri |
| `iap` | 89 | | Uygulama içi satın almalar, fiyatlandırma, kod teklifleri, promosyonlar |
| `marketing` | 70 | | Ekran görüntüleri, önizlemeler, özel sayfalar, uygulama içi etkinlikler |
| `xcode_cloud` | 59 | | Ürünler, iş akışları, build çalıştırmaları, çıktılar, SCM |
| `provisioning` | 49 | | Bundle ID'ler, sertifikalar, cihazlar, profiller |
| `game_center` | 337 | | Başarımlar, liderlik tabloları, eşleştirme, meydan okumalar |
| `users` | 17 | | Ekip üyeleri, davetler, roller |
| `background_assets` | 15 | | Arka plan varlıkları ve varlık paketleri |
| `webhooks` | 12 | | Webhook yapılandırması ve iletim teşhisi |
| `pricing` | 11 | | Uygulama fiyat planları ve fiyat noktaları |
| `sandbox` | 3 | | Sandbox test kullanıcıları |
| `storekit` | 9 | ○ | App Store Server API — `ASC_BUNDLE_ID` ile etkinleşir |

```bash
# Monetizasyon işleri
--domains=meta,apps,subscriptions,iap,pricing

# Hepsi
--domains=all
```

**Bunu ezberlemene gerek yok.** *"Hangi App Store Connect domainleri mevcut?"* diye sor, sunucu `asc__discover_domains`'den yanıtlar. *"Uygulama içi etkinlikler için bir araç var mı?"* diye sor, `asc__search_tools` tüm 1.263 işlemi — şu an yüklenmemiş olanlar dahil — arar ve hangi bayrağın onu yükleyeceğini söyler.

### Araç isimlendirme

Araç isimleri kaynak hiyerarşisini yansıtır, eylem en sonda gelir:

```
apps__list                              GET  /v1/apps
apps__get                               GET  /v1/apps/{id}
apps__builds__list                      GET  /v1/apps/{id}/builds
app_store_versions__create              POST /v1/appStoreVersions
app_store_version_phased_releases__update  PATCH /v1/appStoreVersionPhasedReleases/{id}
```

| Sonek | Anlamı |
|---|---|
| `list` / `get` | Bir koleksiyonu / tek bir kaydı oku |
| `create` / `update` / `delete` | Standart mutasyonlar |
| `add` / `remove` / `replace` | Çoğa-çok ilişkiyi yönet |
| `list_ids` / `get_id` | Sadece bağlı ID'leri oku, tam kayıtları değil |
| `metrics` | Toplu zaman serisi verisi |

Her araç, açıklamasında ilgili `METHOD /path` bilgisini taşır; böylece doğrudan [Apple'ın API dokümantasyonuyla](https://developer.apple.com/documentation/appstoreconnectapi) çapraz kontrol yapabilirsin.

**Sayfalama** — liste araçları `next_url` kabul eder: bir önceki yanıttaki `links.next` değerini vererek sonraki sayfayı çekebilirsin. Sunucu, Apple'ın API host'u dışındaki bir cursor'ı takip etmeyi reddeder.

### Reviews AI

`reviews` domaininin üzerine binen ve **MCP Sampling** kullanan üç araç var — istemcinin kendi modeli, ayrı bir API anahtarı gerekmiyor:

| Araç | Ne yapar |
|---|---|
| `reviews_ai__draft_response` | Tek bir yoruma yanıt taslağı hazırlar. Sadece metin döner. |
| `reviews_ai__triage` | Son yorumları çeker ve temaya göre gruplar (bug, özellik isteği, fiyatlandırma, övgü, spam). |
| `reviews_ai__daily_briefing` | Son N günün yorumlarını kısa bir özet halinde sunar. |

Üçü de salt okunur ve her zaman yüklüdür — hiçbiri bir şey yayınlamaz. Bir yanıtı yayınlamak için taslağı kendin gözden geçir ve `customer_review_responses__create`'i çağır.

Kullanım senaryosuna göre örnek istekler için [GUIDE.md](GUIDE.md)'ye bak.
