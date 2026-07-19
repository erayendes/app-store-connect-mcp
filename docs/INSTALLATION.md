# Installation / Kurulum

## English

### 1. Create an App Store Connect API key

Go to [Users and Access → Integrations → Keys](https://appstoreconnect.apple.com/access/integrations/api), generate a key, and download the `.p8` file. **You can only download it once.**

Note the **Key ID** and **Issuer ID** from that page.

| Role | Unlocks these domains (see [DOMAINS.md](DOMAINS.md)) | Risk if the agent goes wrong |
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

See [CONFIGURATION.md](CONFIGURATION.md) for the full list of environment variables and flags.

## Türkçe

### 1. App Store Connect API anahtarı oluştur

[Users and Access → Integrations → Keys](https://appstoreconnect.apple.com/access/integrations/api) sayfasına git, bir anahtar oluştur ve `.p8` dosyasını indir. **Sadece bir kez indirebilirsin.**

Aynı sayfadan **Key ID** ve **Issuer ID** değerlerini not al.

| Rol | Açtığı domainler ([DOMAINS.md](DOMAINS.md)'e bak) | Agent hata yaparsa risk |
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

Tüm ortam değişkenleri ve bayraklar için [CONFIGURATION.md](CONFIGURATION.md) sayfasına bak.
