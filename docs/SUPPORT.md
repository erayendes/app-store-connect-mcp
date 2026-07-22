# Support / Destek

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

## English

### Getting help

- **Bug or unexpected behaviour?** Open an [issue](https://github.com/erayendes/app-store-connect-mcp/issues) with reproduction steps, the profile or `--domains`/`--read-only` flags you ran, and the tool name involved. Redact your Key ID, Issuer ID and any `.p8` contents.
- **Security vulnerability?** Don't open a public issue — see [SECURITY.md](SECURITY.md) for private reporting.
- **Question about a specific Apple API operation?** Cross-reference the tool's `METHOD /path` (in its description) against [Apple's official documentation](https://developer.apple.com/documentation/appstoreconnectapi) first — many "is this a bug" questions turn out to be Apple's API behaving as documented.
- **Feature request?** Open an issue. If it's a new Apple operation, check first with `asc__search_tools`, which searches all 982 operations even when not loaded.

### Troubleshooting

| Symptom | What's going on | Fix |
|:--|:--|:--|
| **`401 Unauthorized`** | Key ID, Issuer ID and `.p8` don't all belong to the same key, or the key was revoked. | Re-run `npx -y @erayendes/asc-mcp setup` — it verifies the credentials against Apple before saving. Make sure `ASC_PRIVATE_KEY_PATH` is absolute. |
| **`403 Forbidden`** | The key's role lacks permission for that operation. | Sales reports need Finance; user management needs Admin. App *creation* is restricted on some accounts — create the app in the web UI once, then manage it here. |
| **`409 Conflict` on a version update** | App Store Connect only allows edits in certain version states. | A version in review or already released is locked. |
| **Too many tools / context exhausted** | You're running the combined server or `--domains=all`. | Register a single profile, or narrow `--domains`. `asc__search_tools` still finds anything you need. |
| **A tool I need isn't listed** | It's on another profile. | Ask the agent to search: `asc__search_tools` names the sibling server and prints the exact `claude mcp add` command. See [GUIDE.md §7](GUIDE.md#7-adding-and-removing-tools-later). |
| **Sales report returns base64** | Apple sends these as gzipped TSV. | The server returns `{ contentType, base64 }` rather than mangling it — decode and gunzip to read. |
| **`429 Too Many Requests`** | Requests are paced against Apple's 3,600/hour limit and retried with backoff. | Persistent 429s mean something else is sharing your key. |
| **StoreKit tools missing** | The App Store Server API needs a bundle ID. | Configure it via `setup` or `ASC_BUNDLE_ID` on the `monetization` profile or combined server. See [GUIDE.md §8](GUIDE.md#8-storekit-2--customer-transactions). |

### Supporting the project

Heimdall is free and open. If it helps you, a [coffee](https://buymeacoffee.com/erayendes) ☕ is appreciated but never expected.

## Türkçe

### Yardım alma

- **Bug ya da beklenmedik davranış mı?** [Issue](https://github.com/erayendes/app-store-connect-mcp/issues) açın; yeniden üretim adımlarını, çalıştırdığınız profili ya da `--domains`/`--read-only` bayraklarını ve ilgili araç adını ekleyin. Key ID, Issuer ID ve `.p8` içeriğini gizleyin.
- **Güvenlik açığı mı?** Açık bir issue açmayın — özel bildirim için [SECURITY.md](SECURITY.md)'ye bakın.
- **Belirli bir Apple API işlemi hakkında soru mu?** Önce aracın açıklamasındaki `METHOD /path`'i [Apple'ın resmi dokümantasyonuyla](https://developer.apple.com/documentation/appstoreconnectapi) karşılaştırın — "bu bug mı" sorularının çoğu Apple'ın API'sinin dokümante edildiği gibi davranmasından çıkar.
- **Özellik isteği mi?** Issue açın. Yeni bir Apple işlemiyse önce `asc__search_tools` ile kontrol edin; yüklenmemiş olsa bile tüm 982 işlemi arar.

### Sorun giderme

| Belirti | Ne oluyor | Çözüm |
|:--|:--|:--|
| **`401 Unauthorized`** | Key ID, Issuer ID ve `.p8` aynı anahtara ait değil ya da anahtar iptal edilmiş. | `npx -y @erayendes/asc-mcp setup`'ı yeniden çalıştırın — kaydetmeden önce kimlik bilgilerini Apple'a doğrular. `ASC_PRIVATE_KEY_PATH`'in mutlak olduğundan emin olun. |
| **`403 Forbidden`** | Anahtarın rolü o işlem için yeterli izne sahip değil. | Satış raporları Finance, kullanıcı yönetimi Admin ister. Uygulama *oluşturma* bazı hesaplarda kısıtlıdır — uygulamayı bir kez web arayüzünde oluşturun, sonra buradan yönetin. |
| **Sürüm güncellemesinde `409 Conflict`** | App Store Connect düzenlemelere yalnızca belirli sürüm durumlarında izin verir. | İncelemede olan veya yayınlanmış bir sürüm kilitlidir. |
| **Çok fazla araç / context tükendi** | Birleşik sunucuyu ya da `--domains=all` çalıştırıyorsunuz. | Tek bir profil kaydedin ya da `--domains`'i daraltın. `asc__search_tools` yine de ihtiyacınız olanı bulur. |
| **İhtiyacım olan araç listede yok** | Başka bir profilde. | Agent'a arattırın: `asc__search_tools` kardeş sunucuyu adlandırır ve tam `claude mcp add` komutunu basar. Bkz. [GUIDE.md §7](GUIDE.md#7-sonradan-araç-ekleme-ve-çıkarma). |
| **Satış raporu base64 döndürüyor** | Apple bunları gzip'li TSV olarak gönderir. | Sunucu bozmadan `{ contentType, base64 }` döndürür — okumak için decode edip gunzip yapın. |
| **`429 Too Many Requests`** | İstekler Apple'ın saatte 3.600 limitine göre hızlandırılır ve backoff ile tekrar denenir. | Israrlı 429'lar, anahtarınızı başka bir şeyin de kullandığı anlamına gelir. |
| **StoreKit araçları eksik** | App Store Server API bir bundle ID ister. | `setup` ya da `ASC_BUNDLE_ID` ile `monetization` profilinde veya birleşik sunucuda yapılandırın. Bkz. [GUIDE.md §8](GUIDE.md#8-storekit-2--müşteri-işlemleri). |

### Projeye destek

Heimdall ücretsiz ve açık. İşinize yaradıysa bir [kahve](https://buymeacoffee.com/erayendes) ☕ makbule geçer ama asla beklenmez.
