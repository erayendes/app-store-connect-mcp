# Security / Güvenlik

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

## English

You're about to give a tool your App Store Connect API key. This page explains what Heimdall does with it, what it never does, and how to keep your key private.

### Before you install — audit it yourself

The best habit, with this project or any other, is to check it before you trust it. Everything here is open and auditable.

> [!TIP]
> **Ask your own LLM to review it.** Point it at this repository or the published npm package and ask: *"Does this server send my key or data anywhere except Apple's API? Any telemetry, any calls to other hosts?"* The code is small and the network layer is a single file (`src/core/http.ts`).

- **The tools are generated, not hand-written**, from Apple's OpenAPI spec (`spec/openapi.json`) by `scripts/generate.ts` — so what you audit is what runs.
- **Pin a reviewed version** if you want to be strict: `npx -y @erayendes/asc-mcp@1.0.4 …`.

### What we collect: nothing

Heimdall has **no backend and no telemetry**. There is nothing to opt out of.

- No analytics, no crash reporting, no "phone home" — not on install, not at runtime.
- Your key, your app data and your reports never reach the maintainer or any third party. The only host the server talks to is Apple's (`api.appstoreconnect.apple.com`), and that connection is pinned.
- The **Reviews AI** tools use **MCP Sampling** — they ask *your* client's model to draft or summarise. No separate AI provider, no extra key, and your review text stays inside the client you already trust.

### How your credentials are handled

- The `.p8` private key is read once at startup and held as a Node `KeyObject`. It is never logged, never serialised, and never sent anywhere except as the signature it produces.
- JWTs are signed locally with Node's built-in `crypto` using ES256 — no third-party JWT dependency between your key and the signature.
- Tokens live in memory only, expire after 20 minutes, and refresh automatically.
- Every request — including paginated follow-ups from `links.next` — is pinned to `api.appstoreconnect.apple.com` over HTTPS. A cursor pointing anywhere else is rejected, so a tampered cursor can't walk your bearer token to a third party.
- The shared config file (`~/.config/asc-mcp/config.json`) is written with `0600` permissions and never holds the private key itself — only its Keychain reference or file path.

### Where your key lives

- **macOS (recommended):** in the **Keychain**, referenced as `service/account`. The key never appears in any config file; `setup` stores it there for you.
- **Any platform:** as a `.p8` file (`ASC_PRIVATE_KEY_PATH`) or inline PEM (`ASC_PRIVATE_KEY`). Here the path or contents sit in your client's config file or shell profile.

> [!WARNING]
> When you use a file path or inline PEM, treat that config file as a secret: restrict its permissions and never commit it. `ASC_KEY_ID` and `ASC_ISSUER_ID` are identifiers, not secrets, but the key material is. There is no Keychain equivalent on Linux/Windows yet.

### Safety modes

Running an agent against a production store listing deserves some care.

- **`--read-only`** blocks every mutating operation at the registry level, before any handler runs. In this mode `tools/list` doesn't even advertise them, and the two mutating StoreKit tools are hidden and blocked too.
- **Annotations** — each tool declares `readOnlyHint`, `destructiveHint` and `idempotentHint`, so clients can prompt for confirmation where it matters.
- **Narrow scope** — loading a single profile (or fewer domains) leaves fewer ways for an unexpected instruction to reach something it shouldn't.
- **Host pinning** — all traffic, including pagination, stays on `api.appstoreconnect.apple.com`.
- **No telemetry.**

### Recommendations

- Give the API key the narrowest role that does the job. `Admin` is rarely necessary; `App Manager` covers most release work. See the role/risk table in [GUIDE.md](GUIDE.md#1-create-an-app-store-connect-api-key).
- Never commit `.p8`, `.pem` or `.env` files — the bundled `.gitignore` already excludes them.
- Use `--read-only` when you only need to inspect, with the smallest useful profile or `--domains` set.
- Review any tool call annotated `destructiveHint` before approving it.
- Rotate keys periodically, and revoke immediately if a key may have leaked.

### Reporting a vulnerability

> [!IMPORTANT]
> Please **do not** open a public issue for security problems. Open a private [security advisory](https://github.com/erayendes/app-store-connect-mcp/security/advisories/new) with reproduction steps and an impact assessment, or email **erayendes@gmail.com**.

## Türkçe

Bir araca App Store Connect API anahtarınızı vermek üzeresiniz. Bu sayfa, Heimdall'ın onunla ne yaptığını, asla ne yapmadığını ve anahtarınızı nasıl gizli tutacağınızı anlatır.

### Kurmadan önce — kendiniz denetleyin

En iyi alışkanlık, bu projede ya da başka herhangi birinde, güvenmeden önce kontrol etmektir. Buradaki her şey açık ve denetlenebilir.

> [!TIP]
> **Kendi LLM'inize incelettirin.** Onu bu depoya ya da yayınlanmış npm paketine yönlendirin ve sorun: *"Bu sunucu anahtarımı ya da verimi Apple'ın API'si dışında bir yere gönderiyor mu? Telemetri, başka host'a çağrı var mı?"* Kod küçük, ağ katmanı tek bir dosya (`src/core/http.ts`).

- **Araçlar elle değil üretilerek** gelir; Apple'ın OpenAPI spec'inden (`spec/openapi.json`) `scripts/generate.ts` ile — yani denetlediğiniz şey, çalışan şeydir.
- Katı olmak isterseniz **incelediğiniz bir sürüme sabitleyin**: `npx -y @erayendes/asc-mcp@1.0.4 …`.

### Ne topluyoruz: hiçbir şey

Heimdall'ın **backend'i ve telemetrisi yok**. Kapatılacak bir şey de yok.

- Analitik yok, crash raporlama yok, "eve telefon" yok — ne kurulumda ne çalışma anında.
- Anahtarınız, uygulama veriniz ve raporlarınız asla maintainer'a ya da üçüncü bir tarafa ulaşmaz. Sunucunun konuştuğu tek host Apple'ınkidir (`api.appstoreconnect.apple.com`) ve o bağlantı sabitlenmiştir.
- **Reviews AI** araçları **MCP Sampling** kullanır — taslak ya da özet için *sizin* istemcinizin modelini çağırır. Ayrı bir AI sağlayıcı yok, ekstra anahtar yok ve yorum metniniz zaten güvendiğiniz istemcinin içinde kalır.

### Bu sunucu kimlik bilgilerini nasıl yönetir

- `.p8` özel anahtarı başlangıçta bir kez okunur ve bir Node `KeyObject` olarak tutulur. Asla loglanmaz, asla serileştirilmez ve ürettiği imza dışında hiçbir yere gönderilmez.
- JWT'ler, Node'un yerleşik `crypto` modülüyle ES256 kullanılarak yerel olarak imzalanır — anahtarınız ile imza arasında üçüncü parti bir JWT bağımlılığı yok.
- Token'lar sadece bellekte yaşar, 20 dakika sonra süresi dolar ve otomatik yenilenir.
- `links.next`'ten gelen sayfalama istekleri dahil her istek, HTTPS üzerinden `api.appstoreconnect.apple.com`'a sabitlenir. Başka bir yere işaret eden bir cursor reddedilir; böylece kurcalanmış bir cursor bearer token'ınızı üçüncü bir tarafa taşıyamaz.
- Ortak yapılandırma dosyası (`~/.config/asc-mcp/config.json`) `0600` izinleriyle yazılır ve asla özel anahtarın kendisini tutmaz — sadece Keychain referansını ya da dosya yolunu.

### Anahtarınız nerede durur

- **macOS (önerilen):** **Keychain**'de, `service/account` olarak referanslanır. Anahtar hiçbir config dosyasında görünmez; `setup` onu sizin için oraya koyar.
- **Her platform:** bir `.p8` dosyası (`ASC_PRIVATE_KEY_PATH`) ya da inline PEM (`ASC_PRIVATE_KEY`) olarak. Burada yol ya da içerik istemci config dosyanızda veya shell profilinizde durur.

> [!WARNING]
> Dosya yolu ya da inline PEM kullandığınızda, o config dosyasını bir secret gibi düşünün: izinlerini kısıtlayın, asla commit'lemeyin. `ASC_KEY_ID` ve `ASC_ISSUER_ID` secret değil tanımlayıcıdır, ama anahtar materyali secret'tir. Linux/Windows'ta henüz Keychain karşılığı yok.

### Güvenlik modları

Bir agent'ı canlı bir mağaza listesine karşı çalıştırmak biraz özen ister.

- **`--read-only`** her mutasyon işlemini, herhangi bir handler çalışmadan önce registry seviyesinde engeller. Bu modda `tools/list` bu araçları hiç göstermez bile; mutasyon yapan iki StoreKit aracı da gizlenir ve engellenir.
- **Etiketler** — her araç `readOnlyHint`, `destructiveHint` ve `idempotentHint` bildirir; böylece istemciler gereken yerde onay isteyebilir.
- **Dar kapsam** — tek bir profil (ya da daha az domain) yüklemek, beklenmedik bir talimatın olmaması gereken bir yere ulaşma yollarını azaltır.
- **Host sabitleme** — sayfalama dahil tüm trafik `api.appstoreconnect.apple.com`'da kalır.
- **Telemetri yok.**

### Öneriler

- API anahtarına işi gören en dar rolü verin. `Admin` nadiren gereklidir; `App Manager` çoğu release işini kapsar. Rol/risk tablosu için [GUIDE.md](GUIDE.md#1-app-store-connect-api-anahtarı-oluşturun)'ye bakın.
- `.p8`, `.pem` veya `.env` dosyalarını asla commit'lemeyin — birlikte gelen `.gitignore` zaten bunları hariç tutuyor.
- Sadece inceleme yapacaksanız, en küçük gerekli profil ya da `--domains` seti ile `--read-only` kullanın.
- `destructiveHint` etiketli her araç çağrısını onaylamadan önce gözden geçirin.
- Anahtarları periyodik döndürün, sızmış olabileceğini düşündüğünüzde derhal iptal edin.

### Güvenlik açığı bildirme

> [!IMPORTANT]
> Güvenlik sorunları için lütfen açık bir issue **açmayın**. Bunun yerine yeniden üretim adımları ve etki değerlendirmesiyle özel bir [security advisory](https://github.com/erayendes/app-store-connect-mcp/security/advisories/new) açın ya da **erayendes@gmail.com** adresine yazın.
