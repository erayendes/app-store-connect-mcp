# Security / Güvenlik

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

## English

You're about to give a tool your App Store Connect API key. This page explains what Heimdall does with it, what it never does, and how to keep your key private.

### Before you install, check it yourself

The best habit, with this project or any other, is to check a tool before you trust it. Everything here is open.

> [!TIP]
> **Ask your own AI to review it.** Point it at this repository or the npm package and ask: *"Does this send my key or my data anywhere other than Apple? Any telemetry, any calls to other servers?"* The code is small: every App Store Connect request goes through a single file (`src/core/http.ts`), and customer-transaction (StoreKit) calls use Apple's official library.

- **Almost every tool is generated, not hand-written.** They come from Apple's own OpenAPI specification (`spec/openapi.json`) via `scripts/generate.ts`, so what you review is what runs. The 38 hand-written ones (pricing, store listing, release checks, TestFlight, reviews, StoreKit…) are in the same open code, under `src/tools/` and `src/storekit/`.

### How the package reaches you

Reviewing the code only helps if the package you install is built from that same code. Every step in between can be checked without taking anyone's word for it.

- **Published by GitHub Actions, not by a person.** Each release gets a short-lived credential from npm (trusted publishing), so there is no long-lived npm token anywhere to steal.
- **Signed provenance.** npm records which workflow, commit and repository produced each release. `npm view @erayendes/asc-mcp` shows it.
- **A bill of materials per release.** Every GitHub release lists its production dependencies (SPDX SBOM).
- **Pinned third-party actions.** A compromised or retagged action can't change what runs in the release job. Dependabot proposes updates as pull requests I review.
- **Dependency review on every pull request**, failing at moderate severity and above.
- **Version checks before publishing.** The version must match across `package.json`, `server.json`, `package-lock.json`, `CITATION.cff`, the git tag and the changelog, or the release stops.
- **Betas only when you ask for one.** A beta goes through the same release pipeline, but only to npm's `beta` channel. `npx @erayendes/asc-mcp` never installs a beta; only `@erayendes/asc-mcp@beta` does, and running `setup` without it moves you back.

### What I collect: nothing

Heimdall has **no server of its own and no telemetry**. There is nothing to turn off.

- No analytics, no crash reports, nothing sent home — not when you install it, not while it runs.
- Your key and your data never reach me; there is no server of mine in between. Heimdall only talks to Apple's servers.
- What Heimdall fetches goes to the AI app you use (Claude, Codex, Cursor…). What happens to it there is governed by that app's own terms.
- **Review replies** are written by the AI in the app you already use. Heimdall only fetches the reviews; there is no second AI service and no extra API key.

### How your key is handled

- The `.p8` key is read once at startup and kept in memory. It is never written to a log and never sent anywhere; only the signatures it produces leave your machine.
- Access tokens are signed on your machine with Node's built-in cryptography, with no third-party library between your key and the signature.
- Tokens live only in memory, expire after 20 minutes and renew automatically.
- Every request, including the follow-up requests for the next page of a list, can only go to Apple's servers over HTTPS. A link pointing anywhere else is refused, so your token can never be carried to a third party.
- The shared settings file (`~/.config/asc-mcp/config.json`) can only be read by your user account and never contains the key itself — only where the key is kept.

### Where your key lives

- **macOS:** in the **Keychain**. The key never appears in any settings file; `setup` puts it there for you.
- **Linux and Windows:** `setup` saves the path to your `.p8` file. There is no Keychain equivalent there yet. If you paste the key's contents into the browser setup instead of choosing the file, it is saved as a copy only your user account can read, next to the shared settings.
- **The browser setup** (`setup --web`) runs a page on your own computer only (`127.0.0.1`), behind a one-time link that other pages and other computers cannot use. The key goes from the page straight to the same place as above, and the page shuts itself down after you apply or after 30 idle minutes.

> [!WARNING]
> On Linux and Windows, treat the `.p8` file as a secret: don't share it, don't put it in a repository, and keep it somewhere only you can read. Key ID and Issuer ID are identifiers, not secrets; the `.p8` file is.

### Safety measures

Letting an AI work on a live App Store listing deserves some care.

- **Risky changes ask first (on by default).** Before changing a price, giving someone Admin access, deleting something or touching certificates, Heimdall opens a confirmation in the app you use and shows what would change. A misread instruction can't run unchecked. If the app can't show that confirmation, the change doesn't run.
- **Other changes** go through the app's own tool approval, which every app has.
- **Read-only mode** removes every tool that can change something. The AI can't see them, so it can't call them. [How to turn it on](../docs/CONFIGURATION_en.md#flags).
- **Labels on every tool.** Each tool tells the app whether it only reads, or makes a change that's hard to undo (a price, a release, a deletion, access, certificates), so the app can ask for approval where it matters.
- **Fewer profiles, less risk.** The fewer profiles you install, the fewer things an unexpected instruction can reach.
- **Apple only.** Every request, including the next page of a list, stays on Apple's servers.
- **No telemetry.**

### Recommendations

- Give the API key the narrowest role that does the job. `Admin` is rarely needed; `App Manager` covers most release work. See [Roles](../docs/ROLES_en.md).
- Never put `.p8`, `.pem` or `.env` files in a repository. The `.gitignore` here already excludes them.
- Before approving a deletion, read what it will delete.
- Replace your keys from time to time, and revoke a key in App Store Connect right away if it may have leaked.

### Reporting a vulnerability

> [!IMPORTANT]
> Please **do not** open a public issue for security problems. Open a private [security advisory](https://github.com/erayendes/app-store-connect-mcp/security/advisories/new) with the steps to reproduce it and what an attacker could do with it. Only I can see it.

## Türkçe

Bir araca App Store Connect API anahtarınızı vermek üzeresiniz. Bu sayfa, Heimdall'ın onunla ne yaptığını, asla ne yapmadığını ve anahtarınızı nasıl gizli tutacağınızı anlatır.

### Kurmadan önce kendiniz kontrol edin

En iyi alışkanlık, bu projede ya da başka herhangi birinde, bir araca güvenmeden önce onu kontrol etmektir. Buradaki her şey açık.

> [!TIP]
> **Kullandığınız yapay zekâya incelettirin.** Ona bu depoyu ya da npm paketini gösterin ve sorun: *"Bu, anahtarımı ya da verimi Apple dışında bir yere gönderiyor mu? Telemetri ya da başka sunuculara istek var mı?"* Kod küçük: App Store Connect'e giden her istek tek bir dosyadan geçiyor (`src/core/http.ts`), müşteri işlemleri (StoreKit) ise Apple'ın resmî kütüphanesini kullanıyor.

- **Araçların neredeyse tamamı elle yazılmıyor, üretiliyor.** Apple'ın kendi OpenAPI spesifikasyonundan (`spec/openapi.json`) `scripts/generate.ts` ile üretiliyorlar; yani incelediğiniz şey, çalışan şeydir. Elle yazılan 38 araç (fiyat, mağaza sayfası, sürüm kontrolleri, TestFlight, yorumlar, StoreKit…) da aynı açık kodun içinde: `src/tools/` ve `src/storekit/`.

### Paket size nasıl ulaşıyor

Kodu incelemek, ancak kurduğunuz paket aynı koddan üretiliyorsa işe yarar. Aradaki her adım, kimsenin sözüne güvenmeden kontrol edilebilir.

- **Paketi bir insan değil, GitHub Actions yayınlıyor.** Her sürüm npm'den kısa ömürlü bir kimlik alıyor (trusted publishing); yani hiçbir yerde çalınabilecek kalıcı bir npm anahtarı yok.
- **İmzalı köken bilgisi.** npm her sürümün hangi iş akışından, hangi commit'ten ve hangi depodan üretildiğini kaydediyor. `npm view @erayendes/asc-mcp` bunu gösterir.
- **Her sürümde bağımlılık listesi.** Her GitHub sürümü kullandığı bağımlılıkların listesini taşıyor (SPDX SBOM).
- **Sabitlenmiş üçüncü taraf eylemler.** Ele geçirilmiş ya da yeniden etiketlenmiş bir eylem, yayın sırasında çalışan kodu değiştiremiyor. Güncellemeleri Dependabot, benim incelediğim pull request'ler olarak açıyor.
- **Her pull request'te bağımlılık kontrolü** yapılıyor; orta ve üzeri önemdeki bir açıkta kontrol başarısız oluyor.
- **Yayından önce sürüm kontrolü.** Sürüm numarası `package.json`, `server.json`, `package-lock.json`, `CITATION.cff`, git etiketi ve sürüm notları arasında aynı olmak zorunda; değilse yayın durur.
- **Beta yalnızca siz isterseniz.** Beta da aynı yayın sürecinden geçiyor, ama yalnızca npm'in `beta` kanalına gidiyor. `npx @erayendes/asc-mcp` hiçbir zaman beta kurmaz; bunu yalnızca `@erayendes/asc-mcp@beta` yapar ve `setup`'ı onsuz çalıştırmak sizi kararlı sürüme geri getirir.

### Ne topluyorum: hiçbir şey

Heimdall'ın **kendine ait bir sunucusu ve telemetrisi yok**. Kapatmanız gereken bir şey de yok.

- Analitik yok, çökme raporu yok, arka planda bir yere veri gönderme yok — ne kurulumda ne de çalışırken.
- Anahtarınız ve verileriniz asla bana ulaşmaz; arada benim bir sunucum yok. Heimdall yalnızca Apple'ın sunucularıyla konuşur.
- Heimdall'ın getirdiği veriler kullandığınız yapay zekâ uygulamasına (Claude, Codex, Cursor…) gider. Orada onlarla ne yapıldığı o uygulamanın kendi kurallarına bağlıdır.
- **Yorum cevaplarını** kullandığınız uygulamadaki yapay zekâ yazar. Heimdall yalnızca yorumları getirir; ikinci bir yapay zekâ servisi ya da ek bir API anahtarı yok.

### Anahtarınız nasıl kullanılıyor

- `.p8` anahtarı açılışta bir kez okunur ve yalnızca bellekte tutulur. Hiçbir kayda yazılmaz, hiçbir yere gönderilmez; makinenizden yalnızca onunla üretilen imzalar çıkar.
- Erişim token'ları makinenizde, Node'un kendi şifreleme modülüyle imzalanır; anahtarınız ile imza arasında üçüncü taraf bir kütüphane yok.
- Token'lar yalnızca bellekte durur, 20 dakikada süresi dolar ve kendiliğinden yenilenir.
- Bir listenin sonraki sayfası için yapılanlar dahil her istek, HTTPS üzerinden yalnızca Apple'ın sunucularına gidebilir. Başka bir yeri gösteren bir bağlantı reddedilir; böylece token'ınız asla üçüncü bir tarafa taşınamaz.
- Ortak ayar dosyasını (`~/.config/asc-mcp/config.json`) yalnızca sizin kullanıcı hesabınız okuyabilir. Bu dosyada anahtarın kendisi asla durmaz; sadece nerede saklandığı yazar.

### Anahtarınız nerede durur

- **macOS:** **Keychain**'de. Anahtar hiçbir ayar dosyasında görünmez; `setup` onu sizin için oraya koyar.
- **Linux ve Windows:** `setup`, `.p8` dosyanızın yolunu kaydeder. Bu sistemlerde henüz Keychain'in karşılığı yok. Tarayıcı kurulumunda dosyayı seçmek yerine anahtarın içeriğini yapıştırırsanız, ortak ayarların yanına yalnızca sizin kullanıcı hesabınızın okuyabileceği bir kopya olarak kaydedilir.
- **Tarayıcı kurulumu** (`setup --web`), sayfayı yalnızca kendi bilgisayarınızda (`127.0.0.1`) ve başka sayfaların ya da başka bilgisayarların kullanamayacağı tek kullanımlık bir linkle açar. Anahtar sayfadan doğrudan yukarıdaki yere gider; sayfa siz uygulayınca ya da 30 dakika kullanılmazsa kendiliğinden kapanır.

> [!WARNING]
> Linux ve Windows'ta `.p8` dosyasını bir sır gibi saklayın: kimseyle paylaşmayın, bir depoya koymayın ve yalnızca sizin okuyabileceğiniz bir yerde tutun. Key ID ve Issuer ID gizli değildir, birer kimliktir; gizli olan `.p8` dosyasıdır.

### Güvenlik önlemleri

Canlı bir App Store sayfasında bir yapay zekâyı çalıştırmak biraz özen ister.

- **Riskli değişikliklerden önce onay (varsayılan olarak açık).** Fiyat değiştirmek, birine Admin yetkisi vermek, bir şeyi silmek ya da sertifikalara dokunmak gibi işlemlerden önce Heimdall, kullandığınız uygulamada bir onay penceresi açar ve neyin değişeceğini gösterir. Yanlış anlaşılmış bir talimat kontrolsüz çalışamaz. Uygulama bu onay penceresini gösteremiyorsa değişiklik hiç yapılmaz.
- **Diğer değişiklikler** uygulamanın kendi araç onayından geçer; her uygulamada bu onay vardır.
- **Salt okunur mod**, bir şeyi değiştirebilecek bütün araçları kaldırır. Yapay zekâ onları göremez, dolayısıyla çağıramaz. [Nasıl açılır](../docs/CONFIGURATION_tr.md#bayraklar).
- **Her araçta etiket.** Her araç uygulamaya yalnızca okuyup okumadığını ya da geri alması zor bir değişiklik yapıp yapmadığını (fiyat, yayın, silme, erişim, sertifika) bildirir; uygulama da gereken yerde onay ister.
- **Az profil, az risk.** Ne kadar az profil kurarsanız, beklenmedik bir talimatın ulaşabileceği o kadar az şey olur.
- **Yalnızca Apple.** Bir listenin sonraki sayfası dahil her istek Apple'ın sunucularında kalır.
- **Telemetri yok.**

### Öneriler

- API anahtarına işi gören en dar rolü verin. `Admin` nadiren gerekir; `App Manager` release işlerinin çoğunu karşılar. Bkz. [Roller](../docs/ROLES_tr.md).
- `.p8`, `.pem` ya da `.env` dosyalarını asla bir depoya koymayın. Buradaki `.gitignore` bunları zaten dışarıda bırakıyor.
- Bir silme işlemini onaylamadan önce neyi sileceğini okuyun.
- Anahtarlarınızı ara sıra yenileyin; sızmış olabileceğini düşündüğünüz bir anahtarı App Store Connect'ten hemen iptal edin.

### Güvenlik açığı bildirme

> [!IMPORTANT]
> Güvenlik sorunları için lütfen açık bir issue **açmayın**. Bunun yerine, sorunu nasıl tekrarlayacağımı ve bir saldırganın onunla neler yapabileceğini yazarak özel bir [güvenlik bildirimi (security advisory)](https://github.com/erayendes/app-store-connect-mcp/security/advisories/new) açın. Bunu yalnızca ben görürüm.
