# Heimdall — App Store Connect MCP

[![npm version](https://img.shields.io/npm/v/%40erayendes%2Fasc-mcp.svg)](https://www.npmjs.com/package/@erayendes/asc-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20.19-brightgreen.svg)](package.json)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-orange.svg)](https://buymeacoffee.com/erayendes)

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

## English

Manage your entire App Store Connect account from your AI client: apps and metadata, versions and phased releases, TestFlight, subscriptions and in-app purchases, pricing, reviews, Game Center, Xcode Cloud, provisioning, webhooks, and sales and finance reports.

**Heimdall** is an MCP server for the **App Store Connect API** and the **App Store Server API (StoreKit 2)**, with every tool generated from Apple's own OpenAPI specification. That makes its coverage complete by construction — **982 operations across 17 domains** — and it is what sets Heimdall apart: where other servers wrap a hand-picked slice of the API, Heimdall gives you all of it, and lets you add or drop tools whenever you like.

> Named after the watchman who sees across every realm and guards the gateway. The npm package (`@erayendes/asc-mcp`) and the command (`asc-mcp`) keep their names; Heimdall is the project.

### Quick start

```bash
npx -y @erayendes/asc-mcp setup
```

The setup wizard collects your API key once, stores it securely, and registers the profiles you choose. Full walkthrough in the [Guide](docs/GUIDE.md).

> [!NOTE]
> **Installing this through an AI agent?** See [AGENTS.md](AGENTS.md) for the handoff protocol: the agent registers the server, then you run `setup` yourself — your private key never goes through the chat.

### Why it's different

Most App Store Connect MCP servers wrap a hand-picked subset of endpoints. That works until you need the one endpoint nobody wrapped. Heimdall takes the opposite approach:

| | |
|:--|:--|
| **Complete** | Generated from Apple's OpenAPI spec v4.4.1 — all 966 paths, **982 operations**. Not a curated subset. |
| **Current** | `npm run spec:update && npm run generate` picks up Apple's changes as a reviewable diff. |
| **Scoped** | 11 purpose-built profiles plus a `--domains` flag. Load only what a project needs, so large tool sets don't overwhelm your client. |
| **StoreKit 2** | Includes the App Store Server API (customer transactions, entitlements, refunds) — rare among ASC MCP servers. |
| **Safe** | `--read-only` mode, destructive-action annotations, host-pinned requests, no telemetry. |
| **Self-describing** | Ask the server what it can do — `asc__discover_domains` and `asc__search_tools` answer, and point you to a tool even when it isn't loaded. |
| **Client-agnostic** | Standard MCP over stdio — works with Claude Code, Claude Desktop, Codex, Antigravity, Cursor and any other MCP client. |
| **Private by default** | On macOS the `.p8` key lives in the Keychain, never in plain-text config. |

### Profiles

One install backs eleven small, purpose-built MCP servers. Register only the areas a project uses — a revenue project loads `analytics` + `marketing`; a game adds `game-center`.

| Profile | Tools | Covers |
|:--|:--|:--|
| **app-info** | 115 | Names, bundle IDs, availability, encryption declarations |
| **distribution** | 138 | App Store versions, review submissions, phased releases, uploaded builds |
| **user-management** | 95 | TestFlight beta distribution, team members, sandbox test accounts |
| **monetization** | 180 | Subscriptions, in-app purchases, offers, pricing, StoreKit 2 transactions |
| **marketing** | 73 | Screenshots, previews, custom product pages, in-app events, customer reviews |
| **analytics** | 17 | Sales and finance reports, analytics requests, performance metrics |
| **game-center** | 176 | Achievements, leaderboards, matchmaking, challenges |
| **xcode-cloud** | 46 | Workflows, build runs, artifacts, source control |
| **provisioning** | 45 | Bundle IDs, certificates, devices, provisioning profiles |
| **background-assets** | 18 | Asset packs downloaded outside the app binary |
| **webhooks** | 12 | Webhooks pushing App Store Connect events to your endpoint |

See the [Guide](docs/GUIDE.md#4-register-profiles) for setup, and [§7](docs/GUIDE.md#7-adding-and-removing-tools-later) for adding or removing profiles later.

### Loading the right tools

The full 982-operation surface would cost well over 100k tokens of tool definitions — more than most context windows can spare. So a profile loads only its own area, and the combined server loads a default working set for everyday release work. The 123 deprecated operations stay out unless you pass `--include-deprecated`.

> [!TIP]
> **You don't have to memorise anything.** Ask *"what App Store Connect domains are available?"* and the server answers from `asc__discover_domains`. Ask *"is there a tool for in-app events?"* and `asc__search_tools` searches all 982 operations — including ones not loaded — and tells you which profile or flag would load it.

### Tool naming

Tool names mirror the resource hierarchy, with the action last (`apps__list` → `GET /v1/apps`, `app_store_versions__create` → `POST /v1/appStoreVersions`). Every tool carries its `METHOD /path` in the description, so you can cross-reference [Apple's API documentation](https://developer.apple.com/documentation/appstoreconnectapi) directly.

### Reviews AI

Three tools ride on top of the `reviews` domain and use **MCP Sampling** — your client's own model, no separate API key: `reviews_ai__draft_response`, `reviews_ai__triage`, `reviews_ai__daily_briefing`. All read-only; none post anything. To publish a reply you review the draft yourself and call `customer_review_responses__create`.

### Documentation

- [Guide](docs/GUIDE.md) — API key, install, setup wizard, profiles, configuration, examples
- [Security](docs/SECURITY.md) — credential handling, safety modes, pre-install audit, vulnerability reporting
- [Support](docs/SUPPORT.md) — getting help, troubleshooting
- [Changelog](docs/CHANGELOG.md) — release history
- [Contributing](docs/CONTRIBUTING.md) — how to contribute, local dev setup
- [Code of Conduct](docs/CODE_OF_CONDUCT.md)
- [Governance](docs/GOVERNANCE.md) — who maintains this and why

### Support the project

Heimdall is free and open. If it saves you time, you can [buy me a coffee](https://buymeacoffee.com/erayendes) ☕.

### License

MIT — see [LICENSE](LICENSE). Not affiliated with Apple Inc. See [NOTICE](NOTICE).

---

## Türkçe

Tüm App Store Connect hesabınızı yapay zekâ istemcinizden yönetin: uygulamalar ve metadata, sürümler ve kademeli yayınlar, TestFlight, abonelikler ve uygulama içi satın almalar, fiyatlandırma, yorumlar, Game Center, Xcode Cloud, provisioning, webhook'lar, satış ve finans raporları.

**Heimdall**, **App Store Connect API** ve **App Store Server API (StoreKit 2)** için, her aracı Apple'ın kendi OpenAPI spesifikasyonundan üretilen bir MCP sunucusudur. Bu, kapsamını yapısı gereği eksiksiz kılar — **17 domainde 982 işlem** — ve Heimdall'ı farklı kılan da budur: diğer sunucular API'nin elle seçilmiş bir dilimini sararken, Heimdall size tamamını verir ve araçları dilediğiniz zaman ekleyip çıkarmanıza izin verir.

> Adını, tüm dünyaları gören ve geçidi bekleyen gözcüden alır. npm paketi (`@erayendes/asc-mcp`) ve komut (`asc-mcp`) adlarını korur; Heimdall projenin adıdır.

### Hızlı başlangıç

```bash
npx -y @erayendes/asc-mcp setup
```

Setup sihirbazı API anahtarınızı bir kez toplar, güvenle saklar ve seçtiğiniz profilleri kaydeder. Adım adım anlatım [Rehber](docs/GUIDE.md)'de.

> [!NOTE]
> **Bunu bir AI agent ile mi kuruyorsunuz?** Devir protokolü için [AGENTS.md](AGENTS.md)'ye bakın: agent sunucuyu kaydeder, `setup`'ı siz çalıştırırsınız — özel anahtarınız sohbetten hiç geçmez.

### Neden farklı

Çoğu App Store Connect MCP sunucusu, elle seçilmiş bir uç nokta alt kümesini sarmalar. Kimsenin sarmalamadığı o bir uç noktaya ihtiyaç duyana kadar bu işe yarar. Heimdall tam tersi bir yaklaşım izler:

|                          |                                                                                                                                         |
|:------------------------ |:--------------------------------------------------------------------------------------------------------------------------------------- |
| **Eksiksiz**             | Apple'ın OpenAPI spec v4.4.1'inden üretildi — tüm 966 path, **982 işlem**. Elle seçilmiş bir alt küme değil.                            |
| **Güncel**               | `npm run spec:update && npm run generate`, Apple'ın değişikliklerini gözden geçirilebilir bir diff olarak yakalar.                      |
| **Kapsamlı seçilebilir** | 11 amaca özel profil ve bir `--domains` bayrağı. Sadece projenizin ihtiyacı olanı yükleyin; büyük araç setleri istemcinizi boğmasın.    |
| **StoreKit 2**           | App Store Server API'yi (müşteri işlemleri, hak, iadeler) içerir — ASC MCP sunucuları arasında nadir.                                   |
| **Güvenli**              | `--read-only` modu, yıkıcı işlem etiketleri, host'a sabitlenmiş istekler, telemetri yok.                                                |
| **Kendini anlatan**      | Sunucuya ne yapabildiğini sorun — `asc__discover_domains` ve `asc__search_tools` yanıtlar, araç yüklü olmasa bile size yolunu gösterir. |
| **İstemciden bağımsız**  | stdio üzerinden standart MCP — Claude Code, Claude Desktop, Codex, Antigravity, Cursor ve diğer tüm MCP istemcileriyle çalışır. |
| **Varsayılan gizli**     | macOS'ta `.p8` anahtarı Keychain'de durur, düz metin config'de değil.                                                                   |

### Profiller

Tek kurulum, on bir küçük, amaca özel MCP sunucusu sunar. Sadece projenizin kullandığı alanları kaydedin — gelir projesi `analytics` + `marketing` yükler; oyun `game-center` ekler.

| Profil                | Araç | Kapsam                                                                                           |
|:--------------------- |:---- |:------------------------------------------------------------------------------------------------ |
| **app-info**          | 115  | İsimler, bundle ID'ler, ülke uygunluğu, şifreleme beyanları                                      |
| **distribution**      | 138  | App Store sürümleri, inceleme gönderimleri, kademeli yayınlar, yüklenen build'ler                |
| **user-management**   | 95   | TestFlight beta dağıtımı, ekip üyeleri, sandbox test hesapları                                   |
| **monetization**      | 180  | Abonelikler, uygulama içi satın almalar, teklifler, fiyatlandırma, StoreKit 2 işlemleri          |
| **marketing**         | 73   | Ekran görüntüleri, önizlemeler, özel ürün sayfaları, uygulama içi etkinlikler, müşteri yorumları |
| **analytics**         | 17   | Satış ve finans raporları, analytics istekleri, performans metrikleri                            |
| **game-center**       | 176  | Başarımlar, liderlik tabloları, eşleştirme, meydan okumalar                                      |
| **xcode-cloud**       | 46   | İş akışları, build çalıştırmaları, artifact'lar, kaynak kontrolü                                 |
| **provisioning**      | 45   | Bundle ID'ler, sertifikalar, cihazlar, provisioning profilleri                                   |
| **background-assets** | 18   | Uygulama binary'sinin dışında indirilen varlık paketleri                                         |
| **webhooks**          | 12   | App Store Connect olaylarını uç noktanıza gönderen webhook'lar                                   |

Kurulum için [Rehber](docs/GUIDE.md#4-profilleri-kaydedin)'e, sonradan profil ekleme/çıkarma için [§7](docs/GUIDE.md#7-sonradan-araç-ekleme-ve-çıkarma)'ye bakın.

### Doğru araçları yükleme

Tüm 982 işlemlik yüzey, araç tanımları için 100 bin token'ın epey üzerinde bir maliyet çıkarır — çoğu context penceresinin ayırabileceğinden fazla. Bu yüzden bir profil yalnızca kendi alanını yükler; birleşik sunucu ise günlük release işleri için bir varsayılan çalışma seti yükler. Kullanımdan kaldırılmış 123 işlem, `--include-deprecated` vermedikçe dışarıda kalır.

> [!TIP]
> **Hiçbir şeyi ezberlemeniz gerekmez.** *"Hangi App Store Connect domainleri mevcut?"* diye sorun, sunucu `asc__discover_domains`'den yanıtlar. *"Uygulama içi etkinlikler için bir araç var mı?"* diye sorun, `asc__search_tools` tüm 982 işlemi — yüklenmemiş olanlar dahil — arar ve hangi profil ya da bayrağın onu yükleyeceğini söyler.

### Araç isimlendirme

Araç isimleri kaynak hiyerarşisini yansıtır, eylem en sonda gelir (`apps__list` → `GET /v1/apps`, `app_store_versions__create` → `POST /v1/appStoreVersions`). Her araç açıklamasında `METHOD /path` bilgisini taşır; böylece doğrudan [Apple'ın API dokümantasyonuyla](https://developer.apple.com/documentation/appstoreconnectapi) çapraz kontrol yapabilirsiniz.

### Reviews AI

`reviews` domaininin üzerine binen ve **MCP Sampling** kullanan üç araç var — istemcinizin kendi modeli, ayrı API anahtarı yok: `reviews_ai__draft_response`, `reviews_ai__triage`, `reviews_ai__daily_briefing`. Üçü de salt okunur; hiçbiri bir şey yayınlamaz. Bir yanıtı yayınlamak için taslağı kendiniz gözden geçirir ve `customer_review_responses__create`'i çağırırsınız.

### Dokümantasyon

- [Rehber](docs/GUIDE.md) — API anahtarı, kurulum, setup sihirbazı, profiller, yapılandırma, örnekler
- [Güvenlik](docs/SECURITY.md) — kimlik bilgisi yönetimi, güvenlik modları, kurulum öncesi denetim, açık bildirimi
- [Destek](docs/SUPPORT.md) — yardım alma, sorun giderme
- [Değişiklik günlüğü](docs/CHANGELOG.md) — sürüm geçmişi
- [Katkıda bulunma](docs/CONTRIBUTING.md) — nasıl katkı sağlanır, yerel geliştirme kurulumu
- [Davranış kuralları](docs/CODE_OF_CONDUCT.md)
- [Yönetişim](docs/GOVERNANCE.md) — bunu kim, neden sürdürüyor

### Projeye destek

Heimdall ücretsiz ve açık. Zamanınızı kurtardıysa [bana bir kahve ısmarlayabilirsiniz](https://buymeacoffee.com/erayendes) ☕.

### Lisans

MIT — bkz. [LICENSE](LICENSE). Apple Inc. ile bağlantılı değildir. Bkz. [NOTICE](NOTICE).
