# Security / Güvenlik

## English

### Reporting a vulnerability

Please do not open a public issue for security problems. Open a private [security advisory](https://github.com/erayendes/app-store-connect-mcp/security/advisories/new) instead, and include reproduction steps and an impact assessment.

### How this server handles your credentials

- The `.p8` private key is read once at startup and held as a Node `KeyObject`. It is never logged, never serialised, and never sent anywhere except as the signature it produces.
- JWTs are signed locally with Node's built-in `crypto` using ES256. There is no third-party JWT dependency between your key and the signature.
- Tokens live in memory only, expire after 20 minutes, and are refreshed automatically.
- Every request — including paginated follow-ups from `links.next` — is pinned to `api.appstoreconnect.apple.com` over HTTPS. A pagination cursor pointing anywhere else is rejected rather than followed, so a redirected or tampered cursor cannot walk your bearer token to a third party.
- No telemetry, analytics or crash reporting of any kind.

### Safety modes

Running an agent against a production store listing deserves some care.

- **`--read-only`** blocks every mutating operation at the registry level, before any handler runs. In this mode `tools/list` doesn't even advertise them.
- **Annotations** — each tool declares `readOnlyHint`, `destructiveHint` and `idempotentHint`, so MCP clients can prompt for confirmation on the operations that warrant it.
- **Narrow scope** — loading fewer domains means fewer ways for an unexpected instruction to reach something it shouldn't.
- **Host pinning** — all traffic, including paginated follow-ups, is pinned to `api.appstoreconnect.apple.com`.
- **No telemetry.**

### Recommendations

- Give the API key the narrowest role that does the job. `Admin` is rarely necessary; `App Manager` covers most release work, and `Developer` covers TestFlight.
- Never commit `.p8`, `.pem` or `.env` files. The bundled `.gitignore` already excludes them.
- Run with `--read-only` when you only need to inspect, and with `--domains` set to the smallest useful set. Fewer mutating tools loaded means fewer ways an unexpected instruction can change your store listing.
- Review any tool call annotated `destructiveHint` before approving it.
- Rotate keys periodically, and revoke immediately if a key may have leaked.

### Known limitation: no OS keychain integration

Credentials are read from plain environment variables (`ASC_PRIVATE_KEY_PATH` / `ASC_PRIVATE_KEY`, `ASC_KEY_ID`, `ASC_ISSUER_ID`) — see `src/core/config.ts`. There is currently no macOS Keychain (or other OS secret store) integration, so the `.p8` path or contents can sit in plain text inside your client's config file (e.g. `claude_desktop_config.json`) or shell profile. Nothing is embedded in the server's source, but treat that config file itself as a secret: restrict its permissions, and don't commit it.

## Türkçe

### Güvenlik açığı bildirme

Güvenlik sorunları için lütfen açık bir issue açma. Bunun yerine özel bir [security advisory](https://github.com/erayendes/app-store-connect-mcp/security/advisories/new) aç ve yeniden üretim adımlarıyla etki değerlendirmesini ekle.

### Bu sunucu kimlik bilgilerini nasıl yönetir

- `.p8` özel anahtarı başlangıçta bir kez okunur ve bir Node `KeyObject` olarak tutulur. Asla loglanmaz, asla serileştirilmez ve ürettiği imza dışında hiçbir yere gönderilmez.
- JWT'ler, Node'un yerleşik `crypto` modülüyle ES256 kullanılarak yerel olarak imzalanır. Anahtarın ile imza arasında üçüncü parti bir JWT bağımlılığı yoktur.
- Token'lar sadece bellekte yaşar, 20 dakika sonra süresi dolar ve otomatik olarak yenilenir.
- `links.next`'ten gelen sayfalama istekleri dahil her istek, HTTPS üzerinden `api.appstoreconnect.apple.com`'a sabitlenir. Başka bir yere işaret eden bir sayfalama cursor'ı takip edilmez, reddedilir; böylece yönlendirilmiş veya kurcalanmış bir cursor bearer token'ını üçüncü bir tarafa taşıyamaz.
- Hiçbir telemetri, analitik veya crash raporlama yok.

### Güvenlik modları

Bir agent'ı canlı bir mağaza listesine karşı çalıştırmak biraz özen ister.

- **`--read-only`** her mutasyon işlemini, herhangi bir handler çalışmadan önce registry seviyesinde engeller. Bu modda `tools/list` bu araçları hiç göstermez bile.
- **Etiketler** — her araç `readOnlyHint`, `destructiveHint` ve `idempotentHint` bildirir; böylece MCP istemcileri hak eden işlemlerde onay isteyebilir.
- **Dar kapsam** — daha az domain yüklemek, beklenmedik bir talimatın olmaması gereken bir yere ulaşma yollarını azaltır.
- **Host sabitleme** — sayfalama devamları dahil tüm trafik `api.appstoreconnect.apple.com`'a sabitlenir.
- **Telemetri yok.**

### Öneriler

- API anahtarına işi gören en dar rolü ver. `Admin` nadiren gereklidir; `App Manager` çoğu release işini, `Developer` ise TestFlight'ı kapsar.
- `.p8`, `.pem` veya `.env` dosyalarını asla commit'leme. Birlikte gelen `.gitignore` zaten bunları hariç tutuyor.
- Sadece inceleme yapacaksan `--read-only` ile, `--domains`'i de en küçük gerekli sete ayarlayarak çalıştır. Daha az mutasyon aracı yüklemek, beklenmedik bir talimatın mağaza listeni değiştirme yollarını azaltır.
- `destructiveHint` etiketli her araç çağrısını onaylamadan önce gözden geçir.
- Anahtarları periyodik olarak döndür, sızmış olabileceğini düşündüğünde derhal iptal et.

### Bilinen sınırlama: OS anahtar zinciri entegrasyonu yok

Kimlik bilgileri düz ortam değişkenlerinden okunuyor (`ASC_PRIVATE_KEY_PATH` / `ASC_PRIVATE_KEY`, `ASC_KEY_ID`, `ASC_ISSUER_ID`) — bkz. `src/core/config.ts`. Şu an macOS Keychain'e (veya başka bir OS secret store'a) entegrasyon yok; bu yüzden `.p8` yolu veya içeriği, istemci config dosyanda (örn. `claude_desktop_config.json`) veya shell profilinde düz metin olarak durabilir. Sunucunun kaynak koduna gömülü bir şey yok, ama bu config dosyasının kendisini bir secret gibi düşün: izinlerini kısıtla, commit'leme.
