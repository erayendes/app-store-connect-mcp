# Heimdall — App Store Connect MCP

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/app-store-connect-mcp/main/assets/brand/heimdall-social-card.png" alt="Heimdall — App Store Connect MCP" width="720">

[![npm version](https://img.shields.io/npm/v/%40erayendes%2Fasc-mcp.svg)](https://www.npmjs.com/package/@erayendes/asc-mcp)
[![npm downloads](https://img.shields.io/npm/dm/%40erayendes%2Fasc-mcp.svg)](https://www.npmjs.com/package/@erayendes/asc-mcp)
[![CI](https://github.com/erayendes/app-store-connect-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/erayendes/app-store-connect-mcp/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Yerli üretim](https://img.shields.io/badge/%F0%9F%A4%9D-YERL%C4%B0%20%C3%9CRET%C4%B0M-red)](https://github.com/erayendes)

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/app-store-connect-mcp/main/assets/demo.gif" alt="Asking an agent what a subscription costs worldwide; Heimdall answers in one tool call" width="720">

<sub>A real agent session over MCP, sped up. The App Store Connect account is a stand-in so the recording can be public — regenerate with `vhs assets/demo/demo.tape`.</sub>

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

## English

**Heimdall.** One tool for your entire App Store Connect account.

An MCP server for the **App Store Connect API** and the **App Store Server API (StoreKit 2)**, with every tool generated from Apple's own OpenAPI specification. **13 profiles, 32 sub-profiles, 884 tools.**

Apps and metadata, versions and phased releases, TestFlight, subscriptions and in-app purchases, pricing, reviews, Game Center, Xcode Cloud, provisioning, webhooks, and sales and finance reports.

### Ask and it answers. Tell it and it's done.
> - *"Summarise this week's 1-star reviews and draft replies."*
> - *"Which builds are stuck in review?"*
> - *"Raise this subscription's price in every territory."*

### What the one call saves

| The question | Through the raw tools | Heimdall |
|:--|:--|:--|
| *"What does this subscription cost in every country?"* | one measured agent session: 1.02M tokens, $3 | ~1.3k tokens, 2.1s |
| *"What screenshots are on the listing?"* | 53 HTTP calls, 264 KB | 4 calls, ~1 KB |
| *"Change this subscription's price."* | 4 reads, then a choice among 842 price points | one call |

The first row is a real session, not a projection: the agent walked the chain, could not fit the answer, wrote it to a CSV and hand-built a country-name dictionary in Python to finish. The other two are call counts against a live account.

### Quick start

```bash
npx -y @erayendes/asc-mcp setup
```

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/app-store-connect-mcp/main/assets/setup.gif" alt="The setup wizard: key, issuer ID, credential check, profile and sub-profile selection, key stored in the Keychain" width="720">

<sub>One pass, and safe throughout: the access details it needs, then a live credential check. Then your choices — the profiles and sub-profiles you want, and the key ends up in the Keychain, not in a config file.</sub>

The setup wizard asks for your API key once, stores it safely, and registers the profiles you choose with **every MCP client on your machine** — Claude, Codex, Antigravity, Cursor, Windsurf, VS Code. None of them share a config file, so **this is the step you would otherwise repeat once per client, in a different format each time.** Time thrown away.
Full walkthrough in the [Guide](docs/GUIDE.md).
> **Is an AI agent installing Heimdall for you?**
> See [AGENTS.md](AGENTS.md) for the handoff protocol: the agent adds the profiles with `register`, you run `setup` yourself for the key — your private key is for your eyes only, and the agent never sees it.

### What sets Heimdall apart

Most App Store Connect MCP servers offer a hand-picked slice of the API. That works right up until you need the one endpoint none of them covered. Heimdall does the opposite: it gives you all of the tools and lets you choose which ones you want — and change your mind whenever you like.

| | |
| :--- | :--- |
| **Complete** | Apple's OpenAPI spec v4.4.1, all 966 paths, 982 operations — 281 id-only duplicates already collapsed, and the 123 Apple has deprecated stay unloaded unless you ask for them, which leaves the 859 reachable operations plus 24 hand-written tools. `npm run spec:update` brings Apple's changes in as a reviewable diff. |
| **Narrowable** | 13 purpose-built profiles, each narrowing further — `monetization:subscription-pricing` is 26 tools instead of 206. The whole surface would cost over 100k tokens of tool definitions; one profile costs a fraction of that. |
| **StoreKit 2** | The App Store Server API too — customer transactions, entitlements, refunds. **Rare among ASC MCP servers.** |
| **No second API key** | Review triage, daily briefings and draft replies return the review data — your own model writes the text. |
| **Safe** | Confirm-before-write, `--read-only`, destructive-action annotations, host-pinned requests, no telemetry. |
| **Private** | The `.p8` lives in the macOS Keychain, never in a plain-text config. |

#### Profiles
<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/app-store-connect-mcp/main/assets/picker.gif" alt="The profile picker: checking monetization unfolds its sub-profiles, each with its tool count and token estimate" width="720">

Register only the profiles your project uses. What each one covers is in the [profile table](docs/GUIDE.md#register-profiles); adding and removing them later is [here](docs/GUIDE.md#adding-and-removing-later).

Not sure which? [Starter packs](docs/GUIDE.md#starter-packs) answers it by role — a release manager installs `distribution` + `app-info`, an ASO team `marketing` + `analytics` — and [examples/](examples/README.md) works each one through, including the part that usually goes wrong.

There is nothing to memorise — ask *"is there a tool for in-app events?"* and `asc__search_tools` searches everything, including what isn't loaded, and tells you which profile it lives in.

#### Risky writes ask first

Changing a price, handing out Admin or deleting something asks for confirmation before it runs, showing what would change, so a misread instruction cannot execute unchecked. This is the default for the four risk levels that are hard to undo — revenue, destructive, infrastructure, access — and everything else runs on your client's own tool approval. `--confirm` asks before every write instead; `--no-confirm` asks before none; `--read-only` drops mutating tools entirely. See [Security](.github/SECURITY.md).

#### Local by design, not by default

MCP guidance recommends remote HTTP servers: one URL, no install, updates you control. Heimdall runs locally over stdio instead, and that is a deliberate trade. Running locally, the key never leaves your machine: Heimdall reads it from the Keychain, signs a short-lived token, and talks to Apple directly. Nothing sits in between.

The cost is real and worth naming: you need Node installed, and you update by version rather than by us pushing one. That is the price of the key staying yours.

#### Works alongside Fastlane

Heimdall is not a Fastlane alternative — it is the interactive half. Keep [Fastlane](https://fastlane.tools/) for repeatable, scripted CI work (code signing, build upload, metadata pushes). Fastlane for the pipeline, Heimdall for exploration and one-off changes.

### Documentation

- [Guide](docs/GUIDE.md) — API key, install, setup wizard, profiles, configuration, examples
- [Examples](examples/README.md) — starter packs by role, seven worked scenarios, and a GitHub Actions workflow
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

**App Store Connect API** ve **App Store Server API (StoreKit 2)** için bir MCP sunucusu; her aracı Apple'ın kendi OpenAPI spesifikasyonundan üretiliyor. **13 profil, 32 alt profil, 884 araç.**

Uygulamalar ve metadata, sürümler ve kademeli yayınlar, TestFlight, abonelikler ve uygulama içi satın almalar, fiyatlandırma, yorumlar, Game Center, Xcode Cloud, provisioning, webhook'lar, satış ve finans raporları.

### Sorun yanıtlasın. İsteyin yapsın.
> - *"Bu haftanın 1 yıldızlı yorumlarını özetle ve cevap taslakları hazırla."*
> - *"Hangi build'ler incelemede takıldı?"*
> - *"Bu aboneliğin fiyatını her ülkede artır."*

### Tek çağrının kazandırdığı

| Soru | Ham araçlarla | Heimdall |
|:--|:--|:--|
| *"Bu abonelik her ülkede kaça?"* | ölçülen bir ajan oturumu: 1,02M token, 3 $ | ~1,3k token, 2,1 sn |
| *"Mağaza sayfasında hangi ekran görüntüleri var?"* | 53 HTTP çağrısı, 264 KB | 4 çağrı, ~1 KB |
| *"Bu aboneliğin fiyatını değiştir."* | 4 okuma, sonra 842 fiyat noktası içinden seçim | tek çağrı |

İlk satır tahmin değil, gerçek bir oturum: ajan zinciri yürüdü, cevap sığmayınca bir CSV'ye yazdı ve bitirebilmek için Python'da elle ülke adı sözlüğü kurdu. Diğer ikisi canlı bir hesapta çağrı sayımı.

### Hızlı başlangıç

```bash
npx -y @erayendes/asc-mcp setup
```

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/app-store-connect-mcp/main/assets/setup.gif" alt="Setup sihirbazı: anahtar, issuer ID, istemci seçimi, profil seçimi ve yazmadan önce onay" width="720">

<sub>Tek geçiş ve şahane güvenlik: Gerekli erişim bilgileri, sonra canlı kimlik doğrulama. Ardından seçimleriniz; istediğiniz profiller ve alt profiller — anahtar da config dosyasına değil Keychain'e gidiyor.</sub>

Setup sihirbazı API anahtarınızı bir kez ister, güvenle saklar ve seçtiğiniz profilleri **makinenizdeki bütün MCP istemcilerine** kaydeder — Claude, Codex, Antigravity, Cursor, Windsurf, VS Code. Hiçbiri config dosyasını paylaşmaz; **yani bu adım olmasa her istemci için ayrı ayrı, her seferinde farklı biçimde tekrarlanırdı.** Boşa vakit kaybı. 
Adım adım anlatım [Rehber](docs/GUIDE.md)’de.
> **Heimdall'ı bir AI agent mı kuracak?**
> Devir protokolü için [AGENTS.md](AGENTS.md)'ye bakın: agent profilleri `register` ile ekler, anahtar için `setup`'ı siz çalıştırırsınız — özel anahtarınız sadece sizin gözleriniz için, AI agent göremez.

### Heimdall'ı diğerlerinden ayıran

Çoğu App Store Connect MCP sunucusu API'nin elle seçilmiş bir araç dilimini sunar. Hiçbirinin kapsamadığı o bir uç noktaya ihtiyaç duyana kadar bu işe yarar. Heimdall tam tersini yapar: araçların tamamını verir, istediklerinizi siz seçersiniz — ve istediğiniz zaman ekleyip çıkarırsınız.

| | |
| :--- | :--- |
| **Eksiksiz** | Apple'ın OpenAPI spec v4.4.1'i, tüm 966 path, 982 işlem — 281 id-only tekrar zaten birleştirilmiş durumda, Apple'ın kullanımdan kaldırdığı 123 işlem de siz istemedikçe yüklenmiyor; geriye erişilebilir 859 işlem artı elle yazılmış 24 araç kalıyor. `npm run spec:update` Apple'ın değişikliklerini gözden geçirilebilir bir diff olarak getirir. |
| **Daraltılabilir** | 13 amaca özel profil, her biri daha da daralabilir — `monetization:subscription-pricing` 206 yerine 26 araç. Tüm yüzey araç tanımları için 100 bin token'ı aşar; bir profil bunun küçük bir kısmı. |
| **StoreKit 2** | App Store Server API de var — tüm müşteri işlemleri, haklar, iadeler. **ASC MCP sunucuları arasında nadir bir özellik.** |
| **İkinci API anahtarı yok** | Yorum tasnifi, günlük brifing ve cevap taslakları yorum verisini döndürür — metni kendi modeliniz yazar. |
| **Güvenli** | Yazmadan-önce onay, `--read-only`, yıkıcı işlem etiketleri, host'a sabitlenmiş istekler, telemetri yok. |
| **Gizli** | `.p8` macOS Keychain'de durur, düz metin config'de değil. |

#### Profiller
<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/app-store-connect-mcp/main/assets/picker.gif" alt="Profil seçici: monetization işaretlenince alt profilleri araç sayısı ve token tahminiyle açılıyor" width="720">

Sadece projenizin kullandığı profilleri kaydedin. Hangisinin neyi kapsadığı [profil tablosunda](docs/GUIDE.md#profilleri-kaydedin), sonradan ekleme ve çıkarma [burada](docs/GUIDE.md#sonradan-ekleme-ve-çıkarma).

Hangisi olduğundan emin değil misiniz? [Başlangıç paketleri](docs/GUIDE.md#başlangıç-paketleri) bunu role göre cevaplıyor — yayın yöneticisi `distribution` + `app-info` kurar, ASO ekibi `marketing` + `analytics` — ve [examples/](examples/README.md) her birini, genelde nerede ters gittiğiyle birlikte, baştan sona işliyor.

Hiçbir şeyi ezberlemeniz gerekmez — *"uygulama içi etkinlikler için bir araç var mı?"* diye sorun; `asc__search_tools` o an yüklü olmayanlar dahil hepsini arar ve hangi profilde olduğunu söyler.

#### Riskli yazmalar önce sorar

Fiyat değiştirme, Admin yetkisi verme ya da bir şeyi silme çalışmadan önce onay ister ve neyin değişeceğini gösterir; böylece yanlış anlaşılmış bir talimat kontrolsüz çalışamaz. Bu, geri alması zor dört risk seviyesinde varsayılandır — revenue, destructive, infrastructure, access — geri kalan her şey client'ınızın kendi araç onayıyla çalışır. `--confirm` her yazmadan önce sorar, `--no-confirm` hiç sormaz, `--read-only` mutasyon araçlarını tamamen kaldırır. Bkz. [Güvenlik](.github/SECURITY.md).

#### Yerelde çalışması tercih, eksiklik değil

MCP rehberleri uzak HTTP sunucularını önerir: tek URL, kurulum yok, güncellemeyi siz yönetirsiniz. Heimdall bunun yerine yerelde stdio üzerinden çalışır ve bu bilinçli bir tercihtir. Yerelde çalışınca anahtar makinenizden hiç çıkmaz: Heimdall onu Keychain'den okur, kısa ömürlü bir token imzalar ve doğrudan Apple ile konuşur. Arada hiçbir şey durmaz.

Bedeli gerçek ve söylenmeye değer: Node kurulu olmalı ve güncelleme biz gönderdiğimiz için değil, siz sürüm seçtiğiniz için gelir. Anahtarın sizde kalmasının bedeli bu.

#### Fastlane ile birlikte çalışır

Heimdall bir Fastlane alternatifi değil, interaktif yarısıdır. Tekrarlanabilir, scriptli CI işleri (kod imzalama, build yükleme, metadata gönderimi) için [Fastlane](https://fastlane.tools/)'i kullanmaya devam edin. Pipeline için Fastlane, keşif ve tek seferlik değişiklikler için Heimdall.

### Dokümantasyon

- [Rehber](docs/GUIDE.md) — API anahtarı, kurulum, setup sihirbazı, profiller, yapılandırma, örnekler
- [Örnekler](examples/README.md) — role göre başlangıç paketleri, yedi işlenmiş senaryo ve bir GitHub Actions workflow'u
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
