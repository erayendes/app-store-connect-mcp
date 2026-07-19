# app-store-connect-mcp

[![npm version](https://img.shields.io/npm/v/%40erayendes%2Fasc-mcp.svg)](https://www.npmjs.com/package/@erayendes/asc-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](package.json)

**English** | [Türkçe](#türkçe)

## English

An MCP server for the **App Store Connect API** and the **App Store Server API (StoreKit 2)**.

Every tool is generated from Apple's own OpenAPI specification, so coverage is complete by construction — **1,263 operations across 17 domains** — and staying current with Apple means regenerating, not hand-writing.

```bash
npm install -g @erayendes/asc-mcp
```

Or run it directly with `npx` — no install step:

```bash
npx -y @erayendes/asc-mcp
```

### Documentation

Full docs live in [`docs/`](docs/README.md), in English and Türkçe:

- [Overview](docs/README.md) — what this is, domains, tool naming, Reviews AI
- [Guide](docs/GUIDE.md) — API key, install, configuration, example prompts
- [Security](docs/SECURITY.md) — credential handling, safety modes
- [Support](docs/SUPPORT.md) — getting help, troubleshooting
- [Contributing](docs/CONTRIBUTING.md) — how to contribute, local dev setup
- [Code of Conduct](docs/CODE_OF_CONDUCT.md)
- [Governance](GOVERNANCE.md)

### Why this exists

Most App Store Connect MCP servers wrap a hand-picked subset of endpoints. That works until you need the one endpoint nobody wrapped. This server takes the opposite approach:

| | |
|---|---|
| **Complete** | Generated from Apple's OpenAPI spec v4.4.1 — all 966 paths, 1,263 operations |
| **Current** | `npm run spec:update && npm run generate` picks up Apple's changes |
| **Scoped** | Load only the domains you need; the full set is opt-in |
| **Safe** | `--read-only` mode, destructive-action annotations, host-pinned requests |
| **Self-describing** | Ask the server what it can do — it will tell you |

### License

MIT — see [LICENSE](LICENSE).

Not affiliated with Apple Inc. See [NOTICE](NOTICE).

---

## Türkçe

**App Store Connect API** ve **App Store Server API (StoreKit 2)** için bir MCP sunucusu.

Her araç, Apple'ın kendi OpenAPI spesifikasyonundan üretiliyor — **17 domainde 1.263 işlem** — bu yüzden kapsam yapısı gereği eksiksiz; Apple'a ayak uydurmak elle yazmak değil yeniden üretmek anlamına geliyor.

```bash
npm install -g @erayendes/asc-mcp
```

Ya da kurulum yapmadan doğrudan `npx` ile çalıştır:

```bash
npx -y @erayendes/asc-mcp
```

### Dokümantasyon

Tam dokümanlar [`docs/`](docs/README.md) altında, İngilizce ve Türkçe:

- [Genel bakış](docs/README.md) — bu nedir, domainler, araç isimlendirme, Reviews AI
- [Rehber](docs/GUIDE.md) — API anahtarı, kurulum, yapılandırma, örnek istekler
- [Güvenlik](docs/SECURITY.md) — kimlik bilgisi yönetimi, güvenlik modları
- [Destek](docs/SUPPORT.md) — yardım alma, sorun giderme
- [Katkıda bulunma](docs/CONTRIBUTING.md) — nasıl katkı sağlanır, yerel geliştirme kurulumu
- [Davranış kuralları](docs/CODE_OF_CONDUCT.md)
- [Yönetişim](GOVERNANCE.md)

### Bu neden var

Çoğu App Store Connect MCP sunucusu, elle seçilmiş bir uç nokta alt kümesini sarmalar. Kimsenin sarmalamadığı o bir uç noktaya ihtiyaç duyana kadar bu işe yarar. Bu sunucu tam tersi bir yaklaşım izler:

| | |
|---|---|
| **Eksiksiz** | Apple'ın OpenAPI spec v4.4.1'inden üretildi — tüm 966 path, 1.263 işlem |
| **Güncel** | `npm run spec:update && npm run generate` Apple'ın değişikliklerini yakalar |
| **Kapsamlı seçilebilir** | Sadece ihtiyacın olan domainleri yükle; tam set opsiyoneldir |
| **Güvenli** | `--read-only` modu, yıkıcı işlem etiketleri, host'a sabitlenmiş istekler |
| **Kendini anlatan** | Sunucuya ne yapabildiğini sor — sana anlatır |

### Lisans

MIT — bkz. [LICENSE](LICENSE).

Apple Inc. ile bağlantılı değildir. Bkz. [NOTICE](NOTICE).
