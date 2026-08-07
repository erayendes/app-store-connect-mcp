# Heimdall — App Store Connect MCP

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/app-store-connect-mcp/main/assets/brand/heimdall-social-card.png" alt="Heimdall — App Store Connect MCP" width="720">

[![npm version](https://img.shields.io/npm/v/%40erayendes%2Fasc-mcp.svg)](https://www.npmjs.com/package/@erayendes/asc-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20.19-brightgreen.svg)](package.json)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-orange.svg)](https://buymeacoffee.com/erayendes)
[![Yerli üretim](https://img.shields.io/badge/%F0%9F%A4%9D-YERL%C4%B0%20%C3%9CRET%C4%B0M-red)](https://github.com/erayendes)

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

## English

**Heimdall.** One tool for your entire App Store Connect account.

An MCP server for the **App Store Connect API** and the **App Store Server API (StoreKit 2)**, with every tool generated from Apple's own OpenAPI specification. **13 profiles, 40 sub-profiles, 868 tools.**

Apps and metadata, versions and phased releases, TestFlight, subscriptions and in-app purchases, pricing, reviews, Game Center, Xcode Cloud, provisioning, webhooks, and sales and finance reports.

### Ask and it answers. Tell it and it's done.

> - *"Summarise this week's 1-star reviews and draft replies."*
> - *"Which builds are stuck in review?"*
> - *"Raise this subscription's price in every territory."*

> [!IMPORTANT]
> **2.0.0 is a breaking release.** Which tool belongs to which profile is hand-curated now, so every profile's contents changed and `user-management` was split into four. Nothing was lost, but the tool you reach for may have moved next door. Upgrading from 1.x: check the profile names in your config against the [changelog](docs/CHANGELOG.md).

### Quick start

```bash
npx -y @erayendes/asc-mcp setup
```

The setup wizard asks for your API key once, stores it safely, and registers the profiles you choose with **every MCP client on your machine** — Claude, Codex, Antigravity, Cursor, Windsurf, VS Code. None of them share a config file, so this is the step you would otherwise repeat once per client, in a different format each time. Full walkthrough in the [Guide](docs/GUIDE.md).

> [!NOTE]
> **Is an AI agent installing Heimdall for you?**
> See [AGENTS.md](AGENTS.md) for the handoff protocol: the agent adds the profiles with `register`, you run `setup` yourself for the key — your private key is for your eyes only, and the agent never sees it.

### What sets Heimdall apart

Most App Store Connect MCP servers offer a hand-picked slice of the API. That works right up until you need the one endpoint none of them covered. Heimdall does the opposite: it gives you all of the tools and lets you choose which ones you want — and change your mind whenever you like.

| | |
| :--- | :--- |
| **Complete** | Apple's OpenAPI spec v4.4.1, all 966 paths, 982 operations. `npm run spec:update` brings Apple's changes in as a reviewable diff. |
| **Narrowable** | 13 purpose-built profiles, each narrowing further — `monetization:subscription-pricing` is 24 tools instead of 204. The whole surface would cost over 100k tokens of tool definitions; one profile costs a fraction of that. |
| **StoreKit 2** | The App Store Server API too — customer transactions, entitlements, refunds. **Rare among ASC MCP servers.** |
| **No second API key** | Review triage, daily briefings and draft replies return the review data — your own model writes the text. |
| **Safe** | Confirm-before-write, `--read-only`, destructive-action annotations, host-pinned requests, no telemetry. |
| **Private** | The `.p8` lives in the macOS Keychain, never in a plain-text config. |

#### Profiles

Register only the profiles your project uses. What each one covers is in the [profile table](docs/GUIDE.md#register-profiles); adding and removing them later is [here](docs/GUIDE.md#adding-and-removing-later).

There is nothing to memorise — ask *"is there a tool for in-app events?"* and `asc__search_tools` searches everything, including what isn't loaded, and tells you which profile it lives in.

#### Writes ask first

Changing a price, submitting for review or deleting something asks for confirmation before it runs, so a misread instruction cannot execute unchecked. `ASC_CONFIRM_WRITES=0` turns it off; `--read-only` drops mutating tools entirely. See [Security](.github/SECURITY.md).

#### Local by design, not by default

MCP guidance recommends remote HTTP servers: one URL, no install, updates you control. Heimdall runs locally over stdio instead, and that is a deliberate trade.

A remote Heimdall would have to hold your `.p8` — the private key that signs every App Store Connect request, with whatever role you granted it. Hosting it means asking every user to hand their App Store account's signing key to a third party, and making that server a target worth attacking. Running locally, the key never leaves your machine: Heimdall reads it from the Keychain, signs a short-lived token, and talks to Apple directly. Nothing sits in between.

The cost is real and worth naming: you need Node installed, and you update by version rather than by us pushing one. That is the price of the key staying yours.

#### Works alongside Fastlane

Heimdall is not a Fastlane alternative — it is the interactive half. Keep [Fastlane](https://fastlane.tools/) for repeatable, scripted CI work (code signing, build upload, metadata pushes). Fastlane for the pipeline, Heimdall for exploration and one-off changes.

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

### About the name

**Heimdall** is the guardian of Asgard in Norse mythology and one of Odin's sons. He keeps watch over **Bifröst**, the rainbow bridge linking Asgard to the nine realms. His gift for sensing events before they happen lets him guard Asgard against giants and other enemies, and warn the gods of danger on its way.

**This project stands watch over your App Store Connect account; that's where it gets its name.** :)

### License

MIT — see [LICENSE](LICENSE).

Tool definitions in `src/generated/` are produced from Apple Inc.'s published App Store Connect OpenAPI specification (`spec/openapi.json`), redistributed here so the generator is reproducible without network access. App Store Connect, TestFlight, StoreKit, Xcode and Game Center are trademarks of Apple Inc. This project is not affiliated with, endorsed by, or sponsored by Apple Inc.

---

## Türkçe

**Heimdall.** Tüm App Store Connect hesabınız için tek bir araç.

**App Store Connect API** ve **App Store Server API (StoreKit 2)** için bir MCP sunucusu; her aracı Apple'ın kendi OpenAPI spesifikasyonundan üretiliyor. **13 profil, 40 alt profil, 868 araç.**

Uygulamalar ve metadata, sürümler ve kademeli yayınlar, TestFlight, abonelikler ve uygulama içi satın almalar, fiyatlandırma, yorumlar, Game Center, Xcode Cloud, provisioning, webhook'lar, satış ve finans raporları.

### Sorun yanıtlasın. İsteyin yapsın.

> - *"Bu haftanın 1 yıldızlı yorumlarını özetle ve cevap taslakları hazırla."*
> - *"Hangi build'ler incelemede takıldı?"*
> - *"Bu aboneliğin fiyatını her ülkede artır."*

> [!IMPORTANT]
> **2.0.0 kırıcı bir sürümdür.** Hangi aracın hangi profile ait olduğu artık elle belirleniyor; bu yüzden her profilin içeriği değişti ve `user-management` dörde bölündü. Hiçbir araç kaybolmadı, ama aradığınız araç yan komşuya taşınmış olabilir. 1.x'ten yükseltiyorsanız config'inizdeki profil adlarını [değişiklik günlüğüyle](docs/CHANGELOG.md) karşılaştırın.

### Hızlı başlangıç

```bash
npx -y @erayendes/asc-mcp setup
```

Setup sihirbazı API anahtarınızı bir kez ister, güvenle saklar ve seçtiğiniz profilleri **makinenizdeki bütün MCP istemcilerine** kaydeder — Claude, Codex, Antigravity, Cursor, Windsurf, VS Code. Hiçbiri config dosyasını paylaşmaz; yani bu adım olmasa her istemci için ayrı ayrı, her seferinde farklı biçimde tekrarlanırdı. Adım adım anlatım [Rehber](docs/GUIDE.md)'de.

> [!NOTE]
> **Heimdall'ı bir AI agent mı kuracak?**
> Devir protokolü için [AGENTS.md](AGENTS.md)'ye bakın: agent profilleri `register` ile ekler, anahtar için `setup`'ı siz çalıştırırsınız — özel anahtarınız sadece sizin gözleriniz için, AI agent göremez.

### Heimdall'ı diğerlerinden ayıran

Çoğu App Store Connect MCP sunucusu API'nin elle seçilmiş bir araç dilimini sunar. Hiçbirinin kapsamadığı o bir uç noktaya ihtiyaç duyana kadar bu işe yarar. Heimdall tam tersini yapar: araçların tamamını verir, istediklerinizi siz seçersiniz — ve istediğiniz zaman ekleyip çıkarırsınız.

| | |
| :--- | :--- |
| **Eksiksiz** | Apple'ın OpenAPI spec v4.4.1'i, tüm 966 path, 982 işlem. `npm run spec:update` Apple'ın değişikliklerini gözden geçirilebilir bir diff olarak getirir. |
| **Daraltılabilir** | 13 amaca özel profil, her biri daha da daralabilir — `monetization:subscription-pricing` 204 yerine 24 araç. Tüm yüzey araç tanımları için 100 bin token'ı aşar; bir profil bunun küçük bir kısmı. |
| **StoreKit 2** | App Store Server API de var — tüm müşteri işlemleri, haklar, iadeler. **ASC MCP sunucuları arasında nadir bir özellik.** |
| **İkinci API anahtarı yok** | Yorum tasnifi, günlük brifing ve cevap taslakları yorum verisini döndürür — metni kendi modeliniz yazar. |
| **Güvenli** | Yazmadan-önce onay, `--read-only`, yıkıcı işlem etiketleri, host'a sabitlenmiş istekler, telemetri yok. |
| **Gizli** | `.p8` macOS Keychain'de durur, düz metin config'de değil. |

#### Profiller

Sadece projenizin kullandığı profilleri kaydedin. Hangisinin neyi kapsadığı [profil tablosunda](docs/GUIDE.md#profilleri-kaydedin), sonradan ekleme ve çıkarma [burada](docs/GUIDE.md#sonradan-ekleme-ve-çıkarma)'de.

Hiçbir şeyi ezberlemeniz gerekmez — *"uygulama içi etkinlikler için bir araç var mı?"* diye sorun; `asc__search_tools` o an yüklü olmayanlar dahil hepsini arar ve hangi profilde olduğunu söyler.

#### Yazma işlemlerini önce sorar

Fiyat değiştirme, incelemeye gönderme ya da bir şeyi silme çalışmadan önce onay ister; böylece yanlış anlaşılmış bir talimat kontrolsüz çalışamaz. `ASC_CONFIRM_WRITES=0` kapatır, `--read-only` mutasyon araçlarını tamamen kaldırır. Bkz. [Güvenlik](.github/SECURITY.md).

#### Yerelde çalışması tercih, eksiklik değil

MCP rehberleri uzak HTTP sunucularını önerir: tek URL, kurulum yok, güncellemeyi siz yönetirsiniz. Heimdall bunun yerine yerelde stdio üzerinden çalışır ve bu bilinçli bir tercihtir.

Uzak bir Heimdall, `.p8` dosyanızı tutmak zorunda kalırdı — her App Store Connect isteğini imzalayan, verdiğiniz role sahip özel anahtar. Onu barındırmak, her kullanıcıdan App Store hesabının imza anahtarını üçüncü bir tarafa teslim etmesini istemek ve o sunucuyu saldırmaya değer bir hedef hâline getirmek demektir. Yerelde çalışınca anahtar makinenizden hiç çıkmaz: Heimdall onu Keychain'den okur, kısa ömürlü bir token imzalar ve doğrudan Apple ile konuşur. Arada hiçbir şey durmaz.

Bedeli gerçek ve söylenmeye değer: Node kurulu olmalı ve güncelleme biz gönderdiğimiz için değil, siz sürüm seçtiğiniz için gelir. Anahtarın sizde kalmasının bedeli bu.

#### Fastlane ile birlikte çalışır

Heimdall bir Fastlane alternatifi değil, interaktif yarısıdır. Tekrarlanabilir, scriptli CI işleri (kod imzalama, build yükleme, metadata gönderimi) için [Fastlane](https://fastlane.tools/)'i kullanmaya devam edin. Pipeline için Fastlane, keşif ve tek seferlik değişiklikler için Heimdall.

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

### İsim hakkında

**Heimdall**, İskandinav mitolojisinde Asgard'ın koruyucusu ve tanrı Odin'in oğullarından biridir. Asgard ile dokuz diyarı birbirine bağlayan gökkuşağı köprüsü **Bifröst'ün bekçisidir**. Olayları önceden hissetme yeteneği sayesinde Asgard'ı devlerin ve düşmanların olası saldırılarına karşı korur, yaklaşan tehlikeleri diğer tanrılara haber verir.

**Bu proje de sizin App Store Connect hesabınızın başında nöbet tutmak için var; adını oradan alıyor.** :)

### Lisans

MIT — bkz. [LICENSE](LICENSE).

`src/generated/` içindeki araç tanımları, Apple Inc.'in yayımladığı App Store Connect OpenAPI spesifikasyonundan (`spec/openapi.json`) üretilir; jeneratör ağ erişimi olmadan da yeniden üretilebilsin diye spesifikasyon burada yeniden dağıtılmaktadır. App Store Connect, TestFlight, StoreKit, Xcode ve Game Center, Apple Inc.'in ticari markalarıdır. Bu proje Apple Inc. ile bağlantılı değildir, Apple tarafından onaylanmamış veya desteklenmemektedir.
