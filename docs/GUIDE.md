# Guide / Rehber

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

Installation, configuration and example prompts — everything to go from zero to a working setup.

Kurulum, yapılandırma ve örnek istekler — sıfırdan çalışan bir kuruluma kadar her şey.

## English

### 1. Create an App Store Connect API key

Go to [Users and Access → Integrations → Keys](https://appstoreconnect.apple.com/access/integrations/api), generate a key, and download the `.p8` file. **You can only download it once.**

Note the **Key ID** and **Issuer ID** from that page.

| Role | Unlocks these domains (see [README.md](README.md#domains)) | Risk if the agent goes wrong |
|---|---|---|
| Admin | Everything, including `users`, `provisioning`, `webhooks` | **Highest.** Can revoke other users' access, delete certificates/profiles (breaks signing for the whole team), delete webhooks. Blast radius extends beyond your own app. |
| App Manager | `apps`, `versions`, `builds`, `testflight`, `subscriptions`, `iap`, `pricing` | **High.** `versions` and `subscriptions` alone carry 15 delete-capable operations each. Can submit/withdraw a live version, delete an in-app purchase or subscription group. Directly affects the live store listing and revenue. |
| Developer | `builds`, `testflight`, `xcode_cloud` (read/upload, not submission) | **Medium.** `testflight` has 14 delete-capable operations (can remove testers, builds, beta groups), but can't touch pricing, live metadata, or submit for review. |
| Marketing | `marketing` | **Medium.** 12 delete-capable operations — can remove custom product pages, app previews, in-app events that are already live and customer-facing. |
| Sales | `analytics` (sales and trends reports only) | **Low.** `analytics` is almost entirely read-only (2 of 15 operations mutate, 1 deletes) — mostly report requests, nothing that changes your store listing. |
| Finance | `analytics` (financial and payment reports; also needs `ASC_VENDOR_NUMBER`) | **Low.** Same read-heavy `analytics` domain as Sales. |
| Customer Support | `reviews`, including the `reviews_ai__*` tools | **Low–medium.** Only 2 of 6 `reviews` operations mutate, but one is "post a public reply" — reversible (you can delete a response) but visible to customers before you notice a mistake. |

These are the roles App Store Connect lets you assign to an API key — Account Holder isn't one of them. Most day-to-day release work only needs **App Manager**; add **Developer** for build uploads from CI, or **Finance**/**Sales** only if you're actually running `analytics` tools. Pick the narrowest role that covers your use case, and see [SECURITY.md](SECURITY.md) for `--read-only` mode if you want zero mutation risk regardless of role.

### 2. Install

```bash
npm install -g @erayendes/asc-mcp
```

Or install from source:

```bash
git clone https://github.com/erayendes/app-store-connect-mcp.git
cd app-store-connect-mcp
npm install
npm run build
```

### 3. Register the server

**Claude Code:**

```bash
claude mcp add -s user app-store-connect \
  -e ASC_KEY_ID=YOUR_KEY_ID \
  -e ASC_ISSUER_ID=YOUR_ISSUER_ID \
  -e ASC_PRIVATE_KEY_PATH=/absolute/path/to/AuthKey_XXXXXXXXXX.p8 \
  -- npx -y @erayendes/asc-mcp
```

**Claude Desktop** — add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "app-store-connect": {
      "command": "npx",
      "args": ["-y", "@erayendes/asc-mcp"],
      "env": {
        "ASC_KEY_ID": "YOUR_KEY_ID",
        "ASC_ISSUER_ID": "YOUR_ISSUER_ID",
        "ASC_PRIVATE_KEY_PATH": "/absolute/path/to/AuthKey_XXXXXXXXXX.p8"
      }
    }
  }
}
```

If you installed from source, replace the `command`/`args` with `node /absolute/path/to/app-store-connect-mcp/dist/index.js`.

Config file locations — macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`, Windows: `%APPDATA%\Claude\claude_desktop_config.json`.

### 4. Verify

Ask your client: *"Check the App Store Connect connection."* It will call `asc__status`, which validates your credentials with a single lightweight request.

### 5. Configure

**Environment**

| Variable | Required | Purpose |
|---|---|---|
| `ASC_KEY_ID` | yes | Key ID from App Store Connect |
| `ASC_ISSUER_ID` | yes | Issuer ID from App Store Connect |
| `ASC_PRIVATE_KEY_PATH` | yes\* | Absolute path to the `.p8` file |
| `ASC_PRIVATE_KEY` | yes\* | PEM contents, as an alternative to the path |
| `ASC_PRIVATE_KEY_KEYCHAIN` | yes\* | `service/account` of a macOS Keychain entry holding the `.p8` (macOS only) |
| `ASC_VENDOR_NUMBER` | no | Required by sales and finance report tools |
| `ASC_BUNDLE_ID` | no | Enables App Store Server API (StoreKit 2) tools |
| `ASC_APP_APPLE_ID` | no | Your app's numeric Apple ID |
| `ASC_ENVIRONMENT` | no | `Sandbox` (default) or `Production`, for StoreKit 2 |

\* Supply the private key exactly one way. If more than one is set, the order of precedence is `ASC_PRIVATE_KEY` (inline) → `ASC_PRIVATE_KEY_KEYCHAIN` → `ASC_PRIVATE_KEY_PATH`. See [Choosing how to supply the key](#choosing-how-to-supply-the-key).

### Choosing how to supply the key

The `.p8` private key can reach the server three ways. All three produce the same result — pick based on how much you care about keeping the key out of plain-text config.

**Option 1 — File path (simplest, all platforms).** Point `ASC_PRIVATE_KEY_PATH` at the `.p8`. The file stays on disk; the config only holds its path.

**Option 2 — Inline PEM (all platforms).** Put the PEM contents in `ASC_PRIVATE_KEY`. Convenient for CI secrets, but the key lives verbatim in your config/secret store.

**Option 3 — macOS Keychain (most private, macOS only).** Store the key in the Keychain once, then reference it — nothing sensitive stays in your client config:

```bash
security add-generic-password -s asc-mcp -a AuthKey_XXXXXXXXXX -w "$(cat AuthKey_XXXXXXXXXX.p8)"
```

Then set `ASC_PRIVATE_KEY_KEYCHAIN=asc-mcp/AuthKey_XXXXXXXXXX` (the `service/account` you used above). The server reads it at startup via the `security` CLI; the OS gates access.

**Flags**

| Flag | Effect |
|---|---|
| `--domains=<list>` | Comma-separated domains to load, or `all` |
| `--read-only` | Expose only tools that cannot modify anything |
| `--include-deprecated` | Also load the 159 operations Apple has deprecated |

See [README.md](README.md#domains) for the full domain list and `--domains` examples.

### 6. Examples

Once connected, talk to your client in plain language:

> **Release management**
> "List my apps, then show the current version state for Acme and what's blocking release."
>
> "Submit version 3.2 for review, then start a phased release once it's approved."

> **TestFlight**
> "Create a beta group called Insiders and add the latest build to it."
>
> "Show me crash submissions from TestFlight in the last week, grouped by device model."

> **Reviews**
> "Find 1-star reviews from the last 30 days that don't have a response yet, and draft replies."

> **Monetization** *(needs `--domains=...,subscriptions`)*
> "Show my subscription groups and the price of each tier in Turkey, Germany and the US."

> **Customer support** *(needs `ASC_BUNDLE_ID`)*
> "This customer says they were charged twice — transaction ID 2000000891234567. What does their purchase history show, and are they currently entitled?"

## Türkçe

### 1. App Store Connect API anahtarı oluştur

[Users and Access → Integrations → Keys](https://appstoreconnect.apple.com/access/integrations/api) sayfasına git, bir anahtar oluştur ve `.p8` dosyasını indir. **Sadece bir kez indirebilirsin.**

Aynı sayfadan **Key ID** ve **Issuer ID** değerlerini not al.

| Rol | Açtığı domainler ([README.md](README.md#domainler)'e bak) | Agent hata yaparsa risk |
|---|---|---|
| Admin | Her şey, `users`, `provisioning`, `webhooks` dahil | **En yüksek.** Başka kullanıcıların erişimini iptal edebilir, sertifika/profilleri silebilir (tüm ekibin imzalamasını bozar), webhook'ları silebilir. Etki alanı kendi uygulamanın dışına taşar. |
| App Manager | `apps`, `versions`, `builds`, `testflight`, `subscriptions`, `iap`, `pricing` | **Yüksek.** `versions` ve `subscriptions` tek başına 15'er silme yapabilen işlem barındırıyor. Canlı bir sürümü gönderebilir/geri çekebilir, bir uygulama içi satın alma veya abonelik grubunu silebilir. Canlı mağaza listesini ve geliri doğrudan etkiler. |
| Developer | `builds`, `testflight`, `xcode_cloud` (okuma/yükleme, gönderim değil) | **Orta.** `testflight`'ta 14 silme yapabilen işlem var (testçileri, build'leri, beta gruplarını silebilir), ama fiyatlandırmaya, canlı metadata'ya dokunamaz, incelemeye gönderemez. |
| Marketing | `marketing` | **Orta.** 12 silme yapabilen işlem — zaten canlı ve müşteriye görünen özel ürün sayfalarını, uygulama önizlemelerini, uygulama içi etkinlikleri kaldırabilir. |
| Sales | `analytics` (sadece satış ve trend raporları) | **Düşük.** `analytics` neredeyse tamamen salt okunur (15 işlemden 2'si mutasyon, 1'i silme) — çoğunlukla rapor istekleri, mağaza listeni değiştiren bir şey yok. |
| Finance | `analytics` (finans ve ödeme raporları; ayrıca `ASC_VENDOR_NUMBER` gerekir) | **Düşük.** Sales ile aynı, ağırlıklı olarak okuma yapan `analytics` domaini. |
| Customer Support | `reviews`, `reviews_ai__*` araçları dahil | **Düşük-orta.** `reviews`'daki 6 işlemin sadece 2'si mutasyon, ama biri "kamuya açık yanıt gönder" — geri alınabilir (yanıtı silebilirsin) ama fark etmeden önce müşterilere görünür olur. |

Bunlar App Store Connect'in bir API anahtarına atamana izin verdiği roller — Account Holder bunların arasında değil. Günlük release işlerinin çoğu sadece **App Manager** ister; CI'dan build yüklüyorsan **Developer** ekle, sadece gerçekten `analytics` araçlarını kullanacaksan **Finance**/**Sales** ekle. Kullanım amacını karşılayan en dar rolü seç; role bakılmaksızın sıfır mutasyon riski istiyorsan `--read-only` modu için [SECURITY.md](SECURITY.md)'ye bak.

### 2. Kur

```bash
npm install -g @erayendes/asc-mcp
```

Ya da kaynaktan kur:

```bash
git clone https://github.com/erayendes/app-store-connect-mcp.git
cd app-store-connect-mcp
npm install
npm run build
```

### 3. Sunucuyu kaydet

**Claude Code:**

```bash
claude mcp add -s user app-store-connect \
  -e ASC_KEY_ID=ANAHTAR_ID \
  -e ASC_ISSUER_ID=ISSUER_ID \
  -e ASC_PRIVATE_KEY_PATH=/mutlak/yol/AuthKey_XXXXXXXXXX.p8 \
  -- npx -y @erayendes/asc-mcp
```

**Claude Desktop** — `claude_desktop_config.json` dosyasına ekle:

```json
{
  "mcpServers": {
    "app-store-connect": {
      "command": "npx",
      "args": ["-y", "@erayendes/asc-mcp"],
      "env": {
        "ASC_KEY_ID": "ANAHTAR_ID",
        "ASC_ISSUER_ID": "ISSUER_ID",
        "ASC_PRIVATE_KEY_PATH": "/mutlak/yol/AuthKey_XXXXXXXXXX.p8"
      }
    }
  }
}
```

Kaynaktan kurduysan `command`/`args` yerine `node /mutlak/yol/app-store-connect-mcp/dist/index.js` kullan.

Yapılandırma dosyası konumları — macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`, Windows: `%APPDATA%\Claude\claude_desktop_config.json`.

### 4. Doğrula

İstemcine sor: *"App Store Connect bağlantısını kontrol et."* Bu, kimlik bilgilerini tek bir hafif istekle doğrulayan `asc__status` aracını çağırır.

### 5. Yapılandır

**Ortam değişkenleri**

| Değişken | Zorunlu | Amaç |
|---|---|---|
| `ASC_KEY_ID` | evet | App Store Connect'ten Key ID |
| `ASC_ISSUER_ID` | evet | App Store Connect'ten Issuer ID |
| `ASC_PRIVATE_KEY_PATH` | evet\* | `.p8` dosyasının mutlak yolu |
| `ASC_PRIVATE_KEY` | evet\* | Yol yerine PEM içeriğinin kendisi |
| `ASC_PRIVATE_KEY_KEYCHAIN` | evet\* | `.p8`'i tutan bir macOS Keychain girdisinin `service/account`'u (sadece macOS) |
| `ASC_VENDOR_NUMBER` | hayır | Satış ve finans rapor araçları için gerekli |
| `ASC_BUNDLE_ID` | hayır | App Store Server API (StoreKit 2) araçlarını etkinleştirir |
| `ASC_APP_APPLE_ID` | hayır | Uygulamanın sayısal Apple ID'si |
| `ASC_ENVIRONMENT` | hayır | StoreKit 2 için `Sandbox` (varsayılan) veya `Production` |

\* Özel anahtarı tam olarak tek bir yolla ver. Birden fazlası set edilmişse öncelik sırası: `ASC_PRIVATE_KEY` (inline) → `ASC_PRIVATE_KEY_KEYCHAIN` → `ASC_PRIVATE_KEY_PATH`. Bkz. [Anahtarı verme yöntemini seçme](#anahtarı-verme-yöntemini-seçme).

### Anahtarı verme yöntemini seçme

`.p8` özel anahtarı sunucuya üç yolla ulaşabilir. Üçü de aynı sonucu verir — anahtarı düz metin config'den ne kadar uzak tutmak istediğine göre seç.

**Seçenek 1 — Dosya yolu (en basit, tüm platformlar).** `ASC_PRIVATE_KEY_PATH`'i `.p8`'e yönlendir. Dosya diskte kalır; config sadece yolunu tutar.

**Seçenek 2 — Inline PEM (tüm platformlar).** PEM içeriğini `ASC_PRIVATE_KEY`'e koy. CI secret'ları için pratik, ama anahtar config/secret store'unda birebir durur.

**Seçenek 3 — macOS Keychain (en gizli, sadece macOS).** Anahtarı bir kere Keychain'e koy, sonra referans ver — client config'inde hassas hiçbir şey durmaz:

```bash
security add-generic-password -s asc-mcp -a AuthKey_XXXXXXXXXX -w "$(cat AuthKey_XXXXXXXXXX.p8)"
```

Sonra `ASC_PRIVATE_KEY_KEYCHAIN=asc-mcp/AuthKey_XXXXXXXXXX` ayarla (yukarıda kullandığın `service/account`). Sunucu başlangıçta `security` CLI ile okur; erişimi işletim sistemi denetler.

**Bayraklar**

| Bayrak | Etki |
|---|---|
| `--domains=<liste>` | Yüklenecek domainler, virgülle ayrılmış, ya da `all` |
| `--read-only` | Yalnızca hiçbir şeyi değiştiremeyen araçları göster |
| `--include-deprecated` | Apple'ın kullanımdan kaldırdığı 159 işlemi de yükle |

Tam domain listesi ve `--domains` örnekleri için [README.md](README.md#domainler) sayfasına bak.

### 6. Örnekler

Bağlandıktan sonra istemcinle sade bir dille konuş:

> **Release yönetimi**
> "Uygulamalarımı listele, sonra Acme için mevcut sürüm durumunu ve release'i neyin engellediğini göster."
>
> "3.2 sürümünü incelemeye gönder, onaylandıktan sonra kademeli yayına başla."

> **TestFlight**
> "Insiders adında bir beta grubu oluştur ve son build'i ekle."
>
> "Son bir haftadaki TestFlight crash gönderimlerini cihaz modeline göre grupla göster."

> **Yorumlar**
> "Son 30 gündeki, henüz yanıtlanmamış 1 yıldızlı yorumları bul ve yanıt taslakları hazırla."

> **Monetizasyon** *(`--domains=...,subscriptions` gerekir)*
> "Abonelik gruplarımı ve her katmanın Türkiye, Almanya ve ABD'deki fiyatını göster."

> **Müşteri desteği** *(`ASC_BUNDLE_ID` gerekir)*
> "Bu müşteri iki kez ücretlendirildiğini söylüyor — işlem ID'si 2000000891234567. Satın alma geçmişi ne gösteriyor, şu anda hak sahibi mi?"
