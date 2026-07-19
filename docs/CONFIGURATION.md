# Configuration / Yapılandırma

## English

### Environment

| Variable | Required | Purpose |
|---|---|---|
| `ASC_KEY_ID` | yes | Key ID from App Store Connect |
| `ASC_ISSUER_ID` | yes | Issuer ID from App Store Connect |
| `ASC_PRIVATE_KEY_PATH` | yes\* | Absolute path to the `.p8` file |
| `ASC_PRIVATE_KEY` | yes\* | PEM contents, as an alternative to the path |
| `ASC_VENDOR_NUMBER` | no | Required by sales and finance report tools |
| `ASC_BUNDLE_ID` | no | Enables App Store Server API (StoreKit 2) tools |
| `ASC_APP_APPLE_ID` | no | Your app's numeric Apple ID |
| `ASC_ENVIRONMENT` | no | `Sandbox` (default) or `Production`, for StoreKit 2 |

\* Supply either `ASC_PRIVATE_KEY_PATH` or `ASC_PRIVATE_KEY`.

### Flags

| Flag | Effect |
|---|---|
| `--domains=<list>` | Comma-separated domains to load, or `all` |
| `--read-only` | Expose only tools that cannot modify anything |
| `--include-deprecated` | Also load the 159 operations Apple has deprecated |

See [DOMAINS.md](DOMAINS.md) for the full domain list and `--domains` examples.

## Türkçe

### Ortam değişkenleri

| Değişken | Zorunlu | Amaç |
|---|---|---|
| `ASC_KEY_ID` | evet | App Store Connect'ten Key ID |
| `ASC_ISSUER_ID` | evet | App Store Connect'ten Issuer ID |
| `ASC_PRIVATE_KEY_PATH` | evet\* | `.p8` dosyasının mutlak yolu |
| `ASC_PRIVATE_KEY` | evet\* | Yol yerine PEM içeriğinin kendisi |
| `ASC_VENDOR_NUMBER` | hayır | Satış ve finans rapor araçları için gerekli |
| `ASC_BUNDLE_ID` | hayır | App Store Server API (StoreKit 2) araçlarını etkinleştirir |
| `ASC_APP_APPLE_ID` | hayır | Uygulamanın sayısal Apple ID'si |
| `ASC_ENVIRONMENT` | hayır | StoreKit 2 için `Sandbox` (varsayılan) veya `Production` |

\* `ASC_PRIVATE_KEY_PATH` veya `ASC_PRIVATE_KEY`'den birini ver.

### Bayraklar

| Bayrak | Etki |
|---|---|
| `--domains=<liste>` | Yüklenecek domainler, virgülle ayrılmış, ya da `all` |
| `--read-only` | Yalnızca hiçbir şeyi değiştiremeyen araçları göster |
| `--include-deprecated` | Apple'ın kullanımdan kaldırdığı 159 işlemi de yükle |

Tam domain listesi ve `--domains` örnekleri için [DOMAINS.md](DOMAINS.md) sayfasına bak.
