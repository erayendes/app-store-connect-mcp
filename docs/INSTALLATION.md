# Installation / Kurulum

## English

### 1. Create an App Store Connect API key

Go to [Users and Access → Integrations → Keys](https://appstoreconnect.apple.com/access/integrations/api), generate a key, and download the `.p8` file. **You can only download it once.**

Note the **Key ID** and **Issuer ID** from that page.

| Role | Unlocks these domains (see [DOMAINS.md](DOMAINS.md)) |
|---|---|
| Admin | Everything, including `users`, `provisioning`, `webhooks` |
| App Manager | `apps`, `versions`, `builds`, `testflight`, `subscriptions`, `iap`, `pricing` |
| Developer | `builds`, `testflight`, `xcode_cloud` (read/upload, not submission) |
| Marketing | `marketing` |
| Sales | `analytics` (sales and trends reports only) |
| Finance | `analytics` (financial and payment reports; also needs `ASC_VENDOR_NUMBER`) |
| Customer Support | `reviews`, including the `reviews_ai__*` tools |

These are the roles App Store Connect lets you assign to an API key — Account Holder isn't one of them. Most day-to-day release work only needs **App Manager**; add **Developer** for build uploads from CI, or **Finance**/**Sales** only if you're actually running `analytics` tools. Pick the narrowest role that covers your use case.

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

| Rol | Açtığı domainler ([DOMAINS.md](DOMAINS.md)'e bak) |
|---|---|
| Admin | Her şey, `users`, `provisioning`, `webhooks` dahil |
| App Manager | `apps`, `versions`, `builds`, `testflight`, `subscriptions`, `iap`, `pricing` |
| Developer | `builds`, `testflight`, `xcode_cloud` (okuma/yükleme, gönderim değil) |
| Marketing | `marketing` |
| Sales | `analytics` (sadece satış ve trend raporları) |
| Finance | `analytics` (finans ve ödeme raporları; ayrıca `ASC_VENDOR_NUMBER` gerekir) |
| Customer Support | `reviews`, `reviews_ai__*` araçları dahil |

Bunlar App Store Connect'in bir API anahtarına atamana izin verdiği roller — Account Holder bunların arasında değil. Günlük release işlerinin çoğu sadece **App Manager** ister; CI'dan build yüklüyorsan **Developer** ekle, sadece gerçekten `analytics` araçlarını kullanacaksan **Finance**/**Sales** ekle. Kullanım amacını karşılayan en dar rolü seç.

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
