# Heimdall — App Store Connect MCP

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/app-store-connect-mcp/main/assets/brand/heimdall-social-card.png" alt="Heimdall — App Store Connect MCP" width="720">

[![npm version](https://img.shields.io/npm/v/%40erayendes%2Fasc-mcp.svg)](https://www.npmjs.com/package/@erayendes/asc-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20.19-brightgreen.svg)](package.json)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-orange.svg)](https://buymeacoffee.com/erayendes)

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

## English

**Manage your entire App Store Connect account from your AI client.**
One MCP for all of it: apps and metadata, versions and phased releases, TestFlight, subscriptions and in-app purchases, pricing, reviews, Game Center, Xcode Cloud, provisioning, webhooks, and sales and finance reports.

> - *"Summarise this week's 1-star reviews and draft replies."*
> - *"Which builds are stuck in review?"*
> - *"Raise this subscription's price in every territory."*

Heimdall is an MCP server for the **App Store Connect API** and the **App Store Server API (StoreKit 2)**; every tool is generated from Apple's own OpenAPI specification — **982 operations across 17 domains**. Where other servers wrap a hand-picked slice of the API, Heimdall gives you all of it. And anything that changes your data asks you to confirm first.

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
| **Scoped** | 13 purpose-built profiles, narrowable to sub-profiles, plus a `--domains` flag. Load only what a project needs, so large tool sets don't overwhelm your client. |
| **StoreKit 2** | Includes the App Store Server API (customer transactions, entitlements, refunds) — rare among ASC MCP servers. |
| **AI-native** | Review triage, daily briefings and draft replies run on your client's own model through MCP Sampling — no extra API key. |
| **Safe** | Confirm-before-write prompts, `--read-only` mode, destructive-action annotations, host-pinned requests, no telemetry. |
| **Self-describing** | Ask the server what it can do — `asc__discover_domains` and `asc__search_tools` answer, and point you to a tool even when it isn't loaded. |
| **Client-agnostic** | Standard MCP over stdio — works with Claude Code, Claude Desktop, Codex, Antigravity, Cursor and any other MCP client. |
| **Private by default** | On macOS the `.p8` key lives in the Keychain, never in plain-text config. |

### AI on top of the API

Three tools run on **your client's own model** via MCP Sampling — no second API key, nothing sent to a third party:

- **`reviews_ai__triage`** — groups recent reviews by theme: bug, feature request, pricing complaint, praise, spam.
- **`reviews_ai__daily_briefing`** — volume and rating trend, top complaints, standout praise, one suggested action.
- **`reviews_ai__draft_response`** — drafts a reply to a single review.

All three are read-only and post nothing. To publish a reply you review the draft yourself, then call `customer_review_responses__create`.

In the other direction, **writes ask before they run.** Changing a price, submitting for review or deleting a resource prompts you to confirm first, so a misread instruction can't execute unchecked. Turn it off with `ASC_CONFIRM_WRITES=0`, or drop mutating tools entirely with `--read-only`. See [Security](.github/SECURITY.md).

### Profiles

One install backs thirteen small, purpose-built MCP servers — `app-info`, `distribution`, `monetization`, `game-center` and nine more. Register only the areas a project uses: the full 982-operation surface would cost well over 100k tokens of tool definitions, while one profile costs a fraction of that. A big profile narrows further — `monetization:subscriptions` is 108 tools instead of 204.

See the [profile table](docs/GUIDE.md#4-register-profiles) for what each one serves, and [§7](docs/GUIDE.md#7-adding-and-removing-tools-later) for adding or dropping them later. You don't have to memorise anything — ask *"is there a tool for in-app events?"* and `asc__search_tools` searches all 982 operations, including ones not currently loaded.

### Works alongside Fastlane

Heimdall isn't a Fastlane replacement — it's the interactive half. Keep [Fastlane](https://fastlane.tools/) for repeatable, scripted CI (code signing, build upload, metadata pushes). Reach for Heimdall when you want to *ask* — straight from your AI client, no lane to write. Fastlane for the pipeline, Heimdall for exploration and one-off changes.

### Documentation

- [Guide](docs/GUIDE.md) — API key, install, setup wizard, profiles, configuration, examples
- [Security](.github/SECURITY.md) — credential handling, safety modes, pre-install audit, vulnerability reporting
- [Support](.github/SUPPORT.md) — getting help, troubleshooting
- [Changelog](docs/CHANGELOG.md) — release history
- [Contributing](.github/CONTRIBUTING.md) — how to contribute, local dev setup
- [Code of Conduct](.github/CODE_OF_CONDUCT.md)
- [Governance](.github/GOVERNANCE.md) — who maintains this and why

### Support the project

Heimdall is free and open. If it saves you time, you can [become a member or buy me a coffee](https://buymeacoffee.com/erayendes) ☕.

### License

MIT — see [LICENSE](LICENSE).

Tool definitions in `src/generated/` are produced from Apple Inc.'s published App Store Connect OpenAPI specification (`spec/openapi.json`), redistributed here so the generator is reproducible without network access. App Store Connect, TestFlight, StoreKit, Xcode and Game Center are trademarks of Apple Inc. This project is not affiliated with, endorsed by, or sponsored by Apple Inc.

### About the name

**Heimdall** is the guardian of Asgard in Norse mythology and one of Odin's sons. He keeps watch over **Bifröst**, the rainbow bridge linking Asgard to the nine realms. His gift for sensing events before they happen lets him guard Asgard against giants and other enemies, and warn the gods of danger on its way.

**That's where this project gets its name.** The npm package (`@erayendes/asc-mcp`) and the command (`asc-mcp`) keep theirs :)

---

## Türkçe

**Tüm App Store Connect hesabınızı yapay zekâ istemcinizden yönetin.**
Her şey için tek bir **MCP**: uygulamalar ve metadata, sürümler ve kademeli yayınlar, TestFlight, abonelikler ve uygulama içi satın almalar, fiyatlandırma, yorumlar, Game Center, Xcode Cloud, provisioning, webhook'lar, satış ve finans raporları.

> - *"Bu haftanın 1 yıldızlı yorumlarını özetle ve cevap taslakları hazırla."*
> - *"Hangi build'ler incelemede takıldı?"*
> - *"Bu aboneliğin fiyatını her ülkede artır."*

Heimdall, **App Store Connect API** ve **App Store Server API (StoreKit 2)** için bir MCP sunucusudur; her aracı Apple'ın kendi OpenAPI spesifikasyonundan üretilir — **17 domainde 982 işlem**. Diğer sunucular API'nin elle seçilmiş bir dilimini sararken, Heimdall size tamamını verir. Verinizi değiştiren her şey de önce size onaylatır.

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
| **AI-yerlisi**           | Yorum tasnifi, günlük brifing ve cevap taslakları, MCP Sampling ile istemcinizin kendi modelinde çalışır — ek API anahtarı yok.        |
| **Güvenli**              | Yazmadan-önce onay istemleri, `--read-only` modu, yıkıcı işlem etiketleri, host'a sabitlenmiş istekler, telemetri yok.                  |
| **Kendini anlatan**      | Sunucuya ne yapabildiğini sorun — `asc__discover_domains` ve `asc__search_tools` yanıtlar, araç yüklü olmasa bile size yolunu gösterir. |
| **İstemciden bağımsız**  | stdio üzerinden standart MCP — Claude Code, Claude Desktop, Codex, Antigravity, Cursor ve diğer tüm MCP istemcileriyle çalışır. |
| **Varsayılan gizli**     | macOS'ta `.p8` anahtarı Keychain'de durur, düz metin config'de değil.                                                                   |

### API'nin üstünde AI

Üç araç, MCP Sampling ile **istemcinizin kendi modelinde** çalışır — ikinci bir API anahtarı yok, üçüncü tarafa hiçbir şey gitmez:

- **`reviews_ai__triage`** — son yorumları temaya göre gruplar: hata, özellik isteği, fiyat şikâyeti, övgü, spam.
- **`reviews_ai__daily_briefing`** — hacim ve puan trendi, öne çıkan şikâyetler, dikkat çeken övgüler, bir önerilen aksiyon.
- **`reviews_ai__draft_response`** — tek bir yoruma cevap taslağı hazırlar.

Üçü de salt okunur, hiçbir şey yayınlamaz. Bir yanıtı yayınlamak için taslağı kendiniz gözden geçirir, sonra `customer_review_responses__create`'i çağırırsınız.

Diğer yönde ise **yazma işlemleri çalışmadan önce sorar.** Fiyat değiştirme, incelemeye gönderme ya da bir kaynağı silme önce size onaylatır; böylece yanlış anlaşılmış bir talimat kontrolsüz çalışamaz. `ASC_CONFIRM_WRITES=0` ile kapatın, ya da `--read-only` ile mutasyon araçlarını tamamen kaldırın. Bkz. [Güvenlik](.github/SECURITY.md).

### Profiller

Tek kurulum, on üç küçük, amaca özel MCP sunucusu sunar — `app-info`, `distribution`, `monetization`, `game-center` ve dokuz tane daha. Sadece projenizin kullandığı alanları kaydedin: tüm 982 işlemlik yüzey, araç tanımları için 100 bin token'ın epey üzerinde bir maliyet çıkarır; tek bir profil ise bunun küçük bir kısmı. Büyük bir profil daha da daralır — `monetization:subscriptions` 204 yerine 108 araç.

Her birinin neyi kapsadığı için [profil tablosuna](docs/GUIDE.md#4-profilleri-kaydedin), sonradan ekleme/çıkarma için [§7](docs/GUIDE.md#7-sonradan-araç-ekleme-ve-çıkarma)'ye bakın. Hiçbir şeyi ezberlemeniz gerekmez — *"uygulama içi etkinlikler için bir araç var mı?"* diye sorun, `asc__search_tools` tüm 982 işlemi, o an yüklü olmayanlar dahil, arar.

### Fastlane ile birlikte çalışır

Heimdall bir Fastlane alternatifi değil — interaktif yarısı. Tekrarlanabilir, scriptli CI işleri (kod imzalama, build yükleme, metadata gönderimi) için [Fastlane](https://fastlane.tools/)'i kullanmaya devam edin. Heimdall'a *sormak* istediğinizde uzanın — doğrudan AI istemcinizden, lane yazmadan. Pipeline için Fastlane, keşif ve tek seferlik değişiklikler için Heimdall.

### Dokümantasyon

- [Rehber](docs/GUIDE.md) — API anahtarı, kurulum, setup sihirbazı, profiller, yapılandırma, örnekler
- [Güvenlik](.github/SECURITY.md) — kimlik bilgisi yönetimi, güvenlik modları, kurulum öncesi denetim, açık bildirimi
- [Destek](.github/SUPPORT.md) — yardım alma, sorun giderme
- [Değişiklik günlüğü](docs/CHANGELOG.md) — sürüm geçmişi
- [Katkıda bulunma](.github/CONTRIBUTING.md) — nasıl katkı sağlanır, yerel geliştirme kurulumu
- [Davranış kuralları](.github/CODE_OF_CONDUCT.md)
- [Yönetişim](.github/GOVERNANCE.md) — bunu kim, neden sürdürüyor

### Projeye destek

Heimdall ücretsiz ve açık. Zamanınızı kurtardıysa [üye olabilir ya da kahve ısmarlayabilirsiniz](https://buymeacoffee.com/erayendes) ☕.

### Lisans

MIT — bkz. [LICENSE](LICENSE).

`src/generated/` içindeki araç tanımları, Apple Inc.'in yayımladığı App Store Connect OpenAPI spesifikasyonundan (`spec/openapi.json`) üretilir; jeneratör ağ erişimi olmadan da yeniden üretilebilsin diye spesifikasyon burada yeniden dağıtılmaktadır. App Store Connect, TestFlight, StoreKit, Xcode ve Game Center, Apple Inc.'in ticari markalarıdır. Bu proje Apple Inc. ile bağlantılı değildir, Apple tarafından onaylanmamış veya desteklenmemektedir.

### İsim hakkında

**Heimdall**, İskandinav mitolojisinde Asgard'ın koruyucusu ve tanrı Odin'in oğullarından biridir. Asgard ile dokuz diyarı birbirine bağlayan gökkuşağı köprüsü **Bifröst'ün bekçisidir**. Olayları önceden hissetme yeteneği sayesinde Asgard'ı devlerin ve düşmanların olası saldırılarına karşı korur, yaklaşan tehlikeleri diğer tanrılara haber verir.

**Bu proje de adını oradan alıyor.** npm paketi (`@erayendes/asc-mcp`) ve komut (`asc-mcp`) ise adlarını korur :)
