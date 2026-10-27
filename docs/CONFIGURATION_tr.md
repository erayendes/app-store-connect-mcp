# Yapılandırma

🇬🇧 [English](CONFIGURATION_en.md) · 🇹🇷 Türkçe

Çoğu kişinin bu sayfaya hiç ihtiyacı olmaz: [setup](SETUP_tr.md), Heimdall'ın ihtiyaç duyduğu her şeyi kaydeder. Yapay zekânın değişiklik yapmasını tamamen engellemek, bir değişikliği yapmadan denemek, ikinci bir App Store Connect hesabı kullanmak ya da Heimdall'ı setup olmadan (örneğin CI'da) çalıştırmak istiyorsanız okumaya devam edin.

İki tür ayar var. **Bayraklar**, uygulamanızın MCP ayarlarında `args` listesinin sonuna yazılır. **Ortam değişkenleri** ise yanındaki `env` bloğuna:

```json
"ASC-General": {
  "command": "npx",
  "args": ["-y", "@erayendes/asc-mcp@beta", "general", "--read-only"],
  "env": { "ASC_RATE_LIMIT_PER_HOUR": "1200" }
}
```

İkisinden birini değiştirdikten sonra uygulamanızı yeniden başlatın.

## Bayraklar

| Bayrak | Ne yapar |
|:--|:--|
| `--read-only` | Bir şeyi değiştirebilecek bütün araçları kaldırır. Yapay zekâ onları göremez, dolayısıyla çağıramaz. |
| `--dry-run` | Apple'a hiçbir değişiklik gönderilmez. Her değişiklik, gönderilecek olanı risk seviyesiyle birlikte döndürür. Okumalar her zamanki gibi çalışır. |
| `--confirm` | Sadece riskli olanlardan değil, **her** değişiklikten önce sorar. |
| `--no-confirm` | Sormayı bırakır, tek istisnayla: `release__submit` ve `release__submit_items` her zaman sorar. Bunun dışında geriye yalnızca yapay zekâ uygulamanızın kendi araç onayı kalır. |
| `--with-core` | ASC-Core araçlarını (uygulama bulma, araç arama, medya araçları) bu sunucudan da sunar; yalnızca tek sunucu çalıştırabilen yapay zekâ uygulamaları için. Setup'ın buna ihtiyacı yoktur: ASC-Core'u profillerinizin yanına kendisi kaydeder. |

**ASC-Core en sıkı ayarınıza uyar.** Setup ya da `register` bir uygulamaya ASC-Core eklerken, o uygulamadaki Heimdall sunucularından biri bayrakla ya da `ASC_READ_ONLY` ile salt okunur çalışıyorsa ASC-Core'u da salt okunur ekler. Sonradan bir profili elle salt okunur yapmak ASC-Core'u değiştirmez; setup'ı yeniden çalıştırın ya da `--read-only`'yi ASC-Core'un kaydına da ekleyin.

Heimdall varsayılan olarak iki şekilde sorar:

- **CONFIRM yazmanızı ister:** gelir, silme (`destructive`), altyapı ya da erişim seviyesindeki her değişiklikte — fiyatlar ve teklifler, silmeler, sertifikalar ve iş akışları, kullanıcılar ve sandbox hesapları — ve geri alınamayan üç adımda: bir sürümü yayınlamak, ön siparişi bitirmek ve bir build'in süresini bitirmek (`expired: true` ile `builds__update`; silme sayılır). Fiyat makroları ve `testflight__assign_build_to_groups` da böyle sorar.
- **Evet ya da hayır sorar:** müşteriye, oyuncuya ya da testçiye ulaşan adımlarda: bir şeyi incelemeye göndermek (`release__submit`, `release__submit_items`, bir inceleme başvurusu), yeni bir abonelik, abonelik grubu ya da uygulama içi satın alma sürümü oluşturmak, kademeli yayını değiştirmek, bir build'i dış beta incelemesine göndermek, bir ülkede satışa açmak ya da satış durumunu değiştirmek, ürün sayfası testini başlatmak ya da değiştirmek, bir oyuncu adına skor ya da başarım göndermek.

Bir build'i bulup tek çağrıda beta gruplarına ekleyen `testflight__assign_build_to_groups` CONFIRM ister. Geri kalan her şey — mağaza metinleri, taslak bir sürüm, ona build seçmek, diğer TestFlight ayarları ve webhook ayarları — yapay zekâ uygulamanızın onayına bırakılır. Medya araçları, planlarının seviyesine göre sorar: bir görseli sayfaya yerleştirmek `public` seviyesindedir (müşterinin göreceği bir değişiklik), bu yüzden Heimdall sormaz ve onay yapay zekâ uygulamanıza kalır; birini kaldırmak ya da önce mevcut dosyayı silen `replace: true` ile yüklemek silme sayılır ve CONFIRM ister.

Bazı yapay zekâ uygulamaları Heimdall'ın sorusunu gösteremez; Claude masaüstü uygulamasındaki Code sekmesi bunlardan biri. Mac'te Heimdall bu durumda aynı özetle kendi penceresini açar ve değişiklik ancak penceredeki düğmeye (ya da Enter'a) basarsanız yapılır. Düğme değişikliğin adını taşır: Remove, Delete, Upload; uygun bir fiil yoksa Allow. Cancel (Allow'un yanında Don't Allow) ya da Esc durdurur. Yapay zekâ bu pencereyi göremez ve tıklayamaz. Pencere siz cevap verene kadar açık kalır; yapay zekâ uygulaması çağrıyı iptal ederse pencere de kapanır.

<img src="https://raw.githubusercontent.com/erayendes/app-store-connect-mcp/main/assets/confirm-dialog.png" alt="Heimdall'ın Mac'teki onay penceresi: Remove a screenshot from the App Store page? Düğmeler: Cancel ve Remove." width="394"> Windows ve Linux'ta ya da `ASC_NATIVE_CONFIRM=0` ile bu değişiklikler orada reddedilir; onları App Store Connect'te yapın.

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
| `ASC_READ_ONLY` | `true`, `1` ya da `yes` (büyük/küçük harf fark etmez) = `--read-only`. `false`, `0` ve boş dahil başka her değer yazmayı açık bırakır. |
| `ASC_DRY_RUN` | `1` ya da `true` = `--dry-run` |
| `ASC_CONFIRM_WRITES` | `1` / `true` = `--confirm`, `0` / `false` = `--no-confirm` (yayın araçları yine sorar) |
| `ASC_NATIVE_CONFIRM` | `0` = uygulama soramıyorsa Mac penceresi açılmaz; bu değişiklikler reddedilir |

**StoreKit 2 (müşteri işlemleri).**

| Değişken | Ne için |
|:--|:--|
| `ASC_BUNDLE_ID` | İstek uygulama belirtmediğinde StoreKit araçlarının kullanacağı uygulama. İsteğe bağlı: araçlar uygulamayı adından bulur. |
| `ASC_APP_APPLE_ID` | Bu varsayılan uygulamanın sayısal Apple ID'si |
| `ASC_ENVIRONMENT` | `Production` (varsayılan) ya da `Sandbox` |
| `ASC_APPLE_ROOT_CERTS` | Ek Apple kök sertifikaları (yollar ya da tek bir klasör). StoreKit cevapları zaten Heimdall'ın içinde gelen Apple Root CA - G3 ile doğrulanır; bunu yalnızca Apple yeni bir kök eklerse girin. |

**Cevaplar.**

| Değişken | Ne için |
|:--|:--|
| `ASC_MAX_RESPONSE_CHARS` | Yapay zekâya gönderilen en uzun cevap, karakter olarak (varsayılan 100000). Daha uzun bir liste bir notla kesilir; tam cevap yapay zekâdan geçmeden uygulamanızda kalır. |
| `ASC_REDACT_PII` | `1`, test kullanıcılarının adlarını ve e-posta adreslerini yapay zekâdan gizler; e-postanın alan adı kalır. Paylaşılan konuşma kayıtları için işe yarar. Varsayılan olarak kapalı, çünkü "build'i kim henüz kurmadı?" sorusunun cevabı test kullanıcılarını listelemekten geçer. |
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
| `ASC_STATE_DIR` | Heimdall'ın yerelde tuttuğu kayıtların klasörü (varsayılan: `ASC_CONFIG_DIR` ile aynı klasör): `audit.jsonl`, istenen her yazma için bir satır — ne zaman, hangi araç, nasıl onayladığınız, Apple'ın cevabı; `failures.jsonl`, Apple'ın reddettiği her çağrı ve `x-request-id`'si; `report-cache/`, bitmiş dönemlerin satış ve finans raporları. Hiçbiri bilgisayarınızdan çıkmaz. |
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
    "args": ["-y", "@erayendes/asc-mcp@beta", "general"],
    "env": { "ASC_KEY_ID": "…", "ASC_ISSUER_ID": "…", "ASC_PRIVATE_KEY_PATH": "/path/AuthKey_B.p8" }
  }
  ```

- **Ayrı bir ayar klasörü.** İkinci hesap için setup'ı kendi klasörüyle bir kez çalıştırın:

  ```bash
  ASC_CONFIG_DIR=~/.config/asc-clientB npx -y @erayendes/asc-mcp@beta setup
  ```

  Setup, işaretini kaldırdığınız her uygulamadan Heimdall'ı siler; bu yüzden işaretleri kaldırmayın. Sorduğunda terminali seçin ve *Apply these changes?* sorusuna **n** deyin: anahtar o noktada kaydedilmiştir ve ilk hesabınızın sunucuları olduğu gibi kalır. Sonra aynı `ASC_CONFIG_DIR`'ı ikinci sunucunun `env` bloğuna yazın. Her klasör kendi anahtarını, Vendor number'ını ve Bundle ID'sini tutar.

Uygulamanızda ayırt edebilmek için sunuculara hesabın adını verin.

ASC-Core kayıtlı ayarlarla oturum açar; bu yüzden iki hesabı bir arada kullanan bir uygulamada setup, ASC-Core'un hangi hesabı kullanacağını bilemez. Orada ASC-Core eklemez ve nedenini söyler. Bunun yerine her sunucunun `args` listesine `--with-core` ekleyin; böylece her sunucu çekirdek araçların kendi kopyasını kendi hesabıyla taşır.
