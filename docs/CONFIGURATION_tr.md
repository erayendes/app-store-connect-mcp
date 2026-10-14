# Yapılandırma

🇬🇧 [English](CONFIGURATION_en.md) · 🇹🇷 Türkçe

Çoğu kişinin bu sayfaya hiç ihtiyacı olmaz: [setup](SETUP_tr.md), Heimdall'ın ihtiyaç duyduğu her şeyi kaydeder. Yapay zekânın değişiklik yapmasını tamamen engellemek, bir değişikliği yapmadan denemek, ikinci bir App Store Connect hesabı kullanmak ya da Heimdall'ı setup olmadan (örneğin CI'da) çalıştırmak istiyorsanız okumaya devam edin.

İki tür ayar var. **Bayraklar**, uygulamanızın MCP ayarlarında `args` listesinin sonuna yazılır. **Ortam değişkenleri** ise yanındaki `env` bloğuna:

```json
"ASC-AppInfo": {
  "command": "npx",
  "args": ["-y", "@erayendes/asc-mcp", "app-info", "--read-only"],
  "env": { "ASC_RATE_LIMIT_PER_HOUR": "1200" }
}
```

İkisinden birini değiştirdikten sonra uygulamanızı yeniden başlatın.

## Bayraklar

| Bayrak | Ne yapar |
|:--|:--|
| `--read-only` | Bir şeyi değiştirebilecek bütün araçları kaldırır. Yapay zekâ onları göremez, dolayısıyla çağıramaz. |
| `--dry-run` | Apple'a hiçbir şey gitmez. Her değişiklik, gönderilecek olanı risk seviyesiyle birlikte döndürür. Okumalar her zamanki gibi çalışır. |
| `--confirm` | Sadece riskli olanlardan değil, **her** değişiklikten önce sorar. |
| `--no-confirm` | Hiç sormaz. Geriye yalnızca uygulamanızın kendi araç onayı kalır. |
| `--include-deprecated` | Apple'ın kullanımdan kaldırdığı 123 işlemi de yükler (102'si Game Center). |
| `--domains=<liste>` | Yalnızca profilsiz kullanımda: virgülle ayrılmış alanları ya da `all` ile hepsini yükler. |

Varsayılan olarak Heimdall gelir, silme, altyapı ve erişim değişikliklerinden ve kullanıcıya ulaşan yayın adımlarından önce sorar: sürümü incelemeye göndermek, yayınlamak, kademeli yayını değiştirmek, bir build'i dış test kullanıcılarına açmak. Yayınlamak için CONFIRM yazmanızı ister. Sürüm oluşturmak ya da build seçmek gibi hazırlık adımlarını ve geri kalan her şeyi uygulamanızın onayına bırakır.

Bazı uygulamalar Heimdall'ın sorusunu gösteremez; Claude masaüstü uygulamasındaki Code sekmesi bunlardan biri. Mac'te Heimdall bu durumda aynı özetle kendi penceresini açar ve değişiklik ancak Approve'a basarsanız yapılır. Yapay zekâ bu pencereyi göremez ve tıklayamaz. 50 saniye içinde cevap gelmezse hiçbir şey değişmez. Windows ve Linux'ta ya da `ASC_NATIVE_CONFIRM=0` ile bu değişiklikler orada reddedilir; onları App Store Connect'te yapın.

## Ortam değişkenleri

**Kimlik bilgileri.** Setup bunları sizin için kaydeder. Yalnızca setup olmadan çalıştırıyorsanız girin. Herhangi biri girildiğinde kayıtlı ayarlar tamamen yok sayılır; böylece iki hesap asla birbirine karışmaz.

| Değişken | Ne için |
|:--|:--|
| `ASC_KEY_ID` | App Store Connect'teki Key ID |
| `ASC_ISSUER_ID` | App Store Connect'teki Issuer ID |
| `ASC_PRIVATE_KEY_PATH` | `.p8` dosyasının tam yolu |
| `ASC_PRIVATE_KEY` | Yol yerine `.p8` dosyasının içeriği |
| `ASC_PRIVATE_KEY_KEYCHAIN` | Anahtarı tutan macOS Keychain kaydının `service/account` adı (yalnızca macOS) |
| `ASC_VENDOR_NUMBER` | Satış ve finans raporları için gerekli |

Anahtarı yalnızca bir yoldan verin. Birden fazlası girilmişse önce `ASC_PRIVATE_KEY`, sonra Keychain, sonra dosya yolu kullanılır.

**Güvenlik.** Yukarıdaki bayrakların aynısı.

| Değişken | Ne için |
|:--|:--|
| `ASC_READ_ONLY` | `true` = `--read-only` |
| `ASC_DRY_RUN` | `1` ya da `true` = `--dry-run` |
| `ASC_CONFIRM_WRITES` | `1` / `true` = `--confirm`, `0` / `false` = `--no-confirm` |
| `ASC_NATIVE_CONFIRM` | `0` = uygulama soramıyorsa Mac penceresi açılmaz; bu değişiklikler reddedilir |
| `ASC_INCLUDE_DEPRECATED` | `true` = `--include-deprecated` |
| `ASC_DOMAINS` | `--domains` ile aynı |

**StoreKit 2 (müşteri işlemleri).**

| Değişken | Ne için |
|:--|:--|
| `ASC_BUNDLE_ID` | İstek uygulama belirtmediğinde StoreKit araçlarının kullanacağı uygulama. İsteğe bağlı: araçlar uygulamayı adından bulur. |
| `ASC_APP_APPLE_ID` | Bu varsayılan uygulamanın sayısal Apple ID'si |
| `ASC_ENVIRONMENT` | `Production` (varsayılan) ya da `Sandbox` |
| `ASC_APPLE_ROOT_CERTS` | Apple'ın kök sertifikalarının yolları (ya da tek bir klasör). Girilirse StoreKit cevapları doğrulanmış ve çözülmüş gelir; girilmezse Apple'ın imzalı içeriğini alırsınız. |

**Cevaplar.**

| Değişken | Ne için |
|:--|:--|
| `ASC_MAX_RESPONSE_CHARS` | Yapay zekâya gönderilen en uzun cevap, karakter olarak (varsayılan 100000). Daha uzun bir liste bir notla kesilir; tam cevap yapay zekâdan geçmeden uygulamanızda kalır. |
| `ASC_REDACT_PII` | `1`, test kullanıcılarının adlarını ve e-posta adreslerini yapay zekâdan gizler; e-postanın alan adı kalır. Paylaşılan konuşma kayıtları için işe yarar. Varsayılan olarak kapalı, çünkü "build'i kim yüklemedi?" sorusunun cevabı test kullanıcılarını listelemekten geçer. |
| `ASC_KEEP_RAW_RESPONSES` | `1`, Apple'ın cevaplarını olduğu gibi geçirir. Varsayılan olarak link kalabalığı temizlenir; listeler yaklaşık %85 küçülür. |

**Yorum yanıtı taslakları** (`reviews_ai__draft_response`).

| Değişken | Ne için |
|:--|:--|
| `ASC_REVIEWS_BRAND_VOICE` | Yanıtların üslubu, ör. "samimi, kısa, 'dostlar' diye hitap ederiz" |
| `ASC_REVIEWS_BANNED_PHRASES` | Bir taslağın asla kullanmaması gereken, virgülle ayrılmış ifadeler |
| `ASC_REVIEWS_SUPPORT_URL` | Taslakların müşteriyi yönlendirdiği destek linki |

**İstek limitleri.** Apple anahtar başına saatte 3.600 isteğe izin verir. Her Heimdall sunucusu anahtarı yalnızca kendisi kullanıyormuş gibi hızını ayarlar; birden fazla araç ya da ajan aynı anahtarı paylaşıyorsa her birine bir pay verin.

| Değişken | Ne için |
|:--|:--|
| `ASC_RATE_LIMIT_PER_HOUR` | Saatlik limiti düşürür (varsayılan 3600) |
| `ASC_RATE_LIMIT_PER_MINUTE` | Dakikalık limiti düşürür (varsayılan 300) |

**Diğer.**

| Değişken | Ne için |
|:--|:--|
| `ASC_CONFIG_DIR` | Setup'ın kayıtlı ayarlarının yeri (varsayılan `~/.config/asc-mcp`) |
| `ASC_BASE_URL` | İstekleri yerel bir test sunucusu gibi başka bir adrese gönderir. Apple için boş bırakın. |

## Anahtarı vermenin üç yolu

Üçü de aynı sonucu verir; anahtarın ne kadar gizli kalması gerektiğine göre seçin.

- **Dosya yolu** (her platform, en basiti): `ASC_PRIVATE_KEY_PATH` `.p8` dosyasını gösterir. Yalnızca yol saklanır.
- **Anahtarın kendisi** (her platform): `ASC_PRIVATE_KEY` içeriği tutar. CI sırları için pratik, ama anahtar artık ayarlarınızda ya da sır deponuzda olduğu gibi duruyor; o dosyayı anahtarın kendisi gibi koruyun.
- **macOS Keychain** (en gizlisi): setup bunu sizin için yapar. Elle yapmak için:

  ```bash
  security add-generic-password -s asc-mcp -a AuthKey_XXXXXXXXXX -w "$(cat AuthKey_XXXXXXXXXX.p8)"
  ```

  ardından `ASC_PRIVATE_KEY_KEYCHAIN=asc-mcp/AuthKey_XXXXXXXXXX` girin.

## Birden fazla App Store Connect hesabı

İki yolu var, ek bir kurulum gerekmez:

- **Her sunucuya kendi kimlik bilgisi.** Kendi `env` bloğu olan ikinci bir sunucu kaydı ekleyin. Ortam değişkenleri kayıtlı ayarların tamamen yerine geçer:

  ```json
  "ASC-ClientB": {
    "command": "npx",
    "args": ["-y", "@erayendes/asc-mcp", "app-info"],
    "env": { "ASC_KEY_ID": "…", "ASC_ISSUER_ID": "…", "ASC_PRIVATE_KEY_PATH": "/path/AuthKey_B.p8" }
  }
  ```

- **Ayrı bir ayar klasörü.** İkinci hesap için setup'ı kendi klasörüyle bir kez çalıştırın:

  ```bash
  ASC_CONFIG_DIR=~/.config/asc-clientB npx -y @erayendes/asc-mcp setup
  ```

  Hangi uygulamalara kaydedeceğini sorduğunda hiçbirini seçmeyin; böylece ilk hesabınızın sunucularına dokunmaz. Sonra aynı `ASC_CONFIG_DIR`'ı ikinci sunucunun `env` bloğuna yazın. Her klasör kendi anahtarını, Vendor number'ını ve Bundle ID'sini tutar.

Uygulamanızda ayırt edebilmek için sunuculara hesabın adını verin.
