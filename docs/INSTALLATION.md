# Installation / Kurulum

## English

### 1. Create an App Store Connect API key

Go to [Users and Access → Integrations → Keys](https://appstoreconnect.apple.com/access/integrations/api), generate a key, and download the `.p8` file. **You can only download it once.**

Note the **Key ID** and **Issuer ID** from that page.

| Role | Needed for |
|---|---|
| Admin | Everything — users, provisioning, all app and financial data |
| App Manager | Apps, versions, submissions, metadata, TestFlight, in-app purchases |
| Developer | TestFlight builds, read-only app access |
| Marketing | App Store metadata, promo codes, marketing tools |
| Sales | Sales and trends reports |
| Finance | Financial and payment reports |
| Customer Support | Customer reviews and review responses |

These are the roles App Store Connect lets you assign to an API key — Account Holder isn't one of them. Pick the narrowest role that covers your use case.

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

| Rol | Ne için gerekli |
|---|---|
| Admin | Her şey — kullanıcılar, provisioning, tüm uygulama ve finans verisi |
| App Manager | Uygulamalar, sürümler, gönderimler, metadata, TestFlight, uygulama içi satın almalar |
| Developer | TestFlight build'leri, salt okunur uygulama erişimi |
| Marketing | App Store metadata, promosyon kodları, pazarlama araçları |
| Sales | Satış ve trend raporları |
| Finance | Finans ve ödeme raporları |
| Customer Support | Müşteri yorumları ve yorum yanıtları |

Bunlar App Store Connect'in bir API anahtarına atamana izin verdiği roller — Account Holder bunların arasında değil. Kullanım amacını karşılayan en dar rolü seç.

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
