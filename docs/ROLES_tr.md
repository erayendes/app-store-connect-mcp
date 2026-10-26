# App Store Connect Rolleri

🇬🇧 [English](ROLES_en.md) · 🇹🇷 Türkçe

Bu doküman App Store Connect rollerinin yetkilerini ve risklerini belirtmek için hazırlandı. Her zaman ihtiyacınız olan en dar kapsamla ilerlemenizi öneririm.

| Rol | Yetkiler | Risk |
|:--|:--|:--|
| **Admin** | Her şey üzerinde tam kontrol; ekip (`access`), kod imzalama (`provisioning`), webhook'lar (`webhooks`) ve AB'de alternatif dağıtım (`distribution:dma-distribution`) dahil. | **En yüksek.** Başka kullanıcıların erişimini iptal edebilir, sertifika/profilleri silebilir — bu tüm ekibin imzalamasını bozar. Etki alanı kendi uygulamanızın dışına taşar. |
| **App Manager** | Uygulamayı uçtan uca yönetir: uygulama bilgileri (`general`), sürümler ve yayın (`distribution`), abonelikler, IAP ve fiyatlar (`monetization`), Game Center (`game-center`), App Clip'ler (`app-clips`) ve sandbox hesapları (`access:sandbox`). | **Yüksek.** Canlı bir sürümü gönderebilir/geri çekebilir, bir uygulama içi satın alma veya abonelik grubunu silebilir. Canlı listenizi ve gelirinizi doğrudan etkiler. |
| **Developer** | Yalnızca build ve test: yüklenen build'ler (`distribution:builds`), TestFlight (`testflight`), Xcode Cloud (`xcode-cloud`), Background Assets (`background-assets`) — yükleme, gönderim değil. | **Orta.** Testçileri, build'leri, beta gruplarını silebilir; ama fiyatlandırmaya, canlı metadata'ya dokunamaz, incelemeye gönderemez. |
| **Marketing** | Mağaza görünürlüğünü yönetir: özel ürün sayfaları, ürün sayfası denemeleri, uygulama içi etkinlikler, öne çıkarılma başvuruları ve yorumlar (`marketing`). | **Orta.** Zaten müşteriye görünen özel ürün sayfalarını, önizlemeleri, uygulama içi etkinlikleri kaldırabilir. |
| **Sales** | Satış ve trend raporlarını okur (`analytics`). | **Düşük.** Neredeyse yalnızca okuma yapar; rapor istemek mağaza sayfanızda hiçbir şeyi değiştirmez. |
| **Finance** | Finans ve ödeme raporlarını okur (`analytics`; ayrıca setup'ta Vendor number girilmiş olmalı). | **Düşük.** Sales ile aynı, ağırlıklı okuma yapan `analytics` alanı. |
| **Customer Support** | Müşteri yorumlarını okur ve yanıtlar (`marketing:customer-reviews`, `reviews_ai__*` dahil). | **Düşük-orta.** Gönderilen yanıt herkese açıktır. Geri alınabilir, ama siz hatayı fark etmeden müşteriler görmüş olabilir. |

> [!NOTE]
> Günlük release işlerinin çoğu yalnızca **App Manager** rolü ister.
> CI build yüklemeleri içinse **Developer** rolü yeterli.
> Sadece gerçekten `analytics` araçlarını kullanacaksanız **Finance**/**Sales** ekleyin.

## Hangi profil hangi rollerle çalışır

Setup aynı tabloyla çalışır: seçtiklerinize bakıp hepsini karşılayan en dar rolü önerir. Bir anahtarın tek rolü olduğu için hiçbir dar rolün tek başına karşılamadığı bir karışım Admin'e çıkar. ASC-Core her rolle çalışır.

| Profil ya da alt profil | Çalışan roller |
|:--|:--|
| `access` | Admin |
| `access:sandbox` | App Manager, Admin |
| `access:user-invitations` | Admin |
| `access:user-management` | Admin |
| `analytics` | Sales, Finance, Admin |
| `app-clips` | App Manager, Admin |
| `background-assets` | Developer, App Manager, Admin |
| `core` | Customer Support, Sales, Finance, Marketing, Developer, App Manager, Admin |
| `distribution` | App Manager, Admin |
| `distribution:app-encryption` | App Manager, Admin |
| `distribution:app-review-information` | App Manager, Admin |
| `distribution:builds` | Developer, App Manager, Admin |
| `distribution:dma-distribution` | Admin |
| `distribution:phased-releases` | App Manager, Admin |
| `distribution:publish` | App Manager, Admin |
| `distribution:version` | App Manager, Admin |
| `game-center` | App Manager, Admin |
| `game-center:achievements` | App Manager, Admin |
| `game-center:activities` | App Manager, Admin |
| `game-center:challenges` | App Manager, Admin |
| `game-center:groups` | App Manager, Admin |
| `game-center:leaderboards` | App Manager, Admin |
| `game-center:matchmaking` | App Manager, Admin |
| `game-center:setup` | App Manager, Admin |
| `general` | App Manager, Admin |
| `general:android-link` | App Manager, Admin |
| `general:app-accessibility` | App Manager, Admin |
| `general:app-availabilities` | App Manager, Admin |
| `general:app-categories` | App Manager, Admin |
| `general:app-information` | App Manager, Admin |
| `general:app-tags` | App Manager, Admin |
| `general:legal` | App Manager, Admin |
| `marketing` | Marketing, App Manager, Admin |
| `marketing:app-events` | Marketing, App Manager, Admin |
| `marketing:custom-pp` | Marketing, App Manager, Admin |
| `marketing:customer-reviews` | Customer Support, Marketing, App Manager, Admin |
| `marketing:nominations` | Marketing, App Manager, Admin |
| `marketing:pp-optimization` | Marketing, App Manager, Admin |
| `monetization` | App Manager, Admin |
| `monetization:app-price` | App Manager, Admin |
| `monetization:iap-offers` | App Manager, Admin |
| `monetization:in-app-purchases` | App Manager, Admin |
| `monetization:plan-promote` | App Manager, Admin |
| `monetization:subscription` | App Manager, Admin |
| `monetization:subscription-codes` | App Manager, Admin |
| `monetization:subscription-offers` | App Manager, Admin |
| `monetization:subscription-win-back` | App Manager, Admin |
| `monetization:transactions` | App Manager, Admin |
| `provisioning` | Admin |
| `provisioning:bundle` | Admin |
| `provisioning:certificates` | Admin |
| `provisioning:devices` | Admin |
| `provisioning:profiles` | Admin |
| `provisioning:wallet` | Admin |
| `testflight` | Developer, App Manager, Admin |
| `testflight:external-testing` | Developer, App Manager, Admin |
| `testflight:feedbacks` | Developer, App Manager, Admin |
| `testflight:groups` | Developer, App Manager, Admin |
| `testflight:test-builds` | Developer, App Manager, Admin |
| `testflight:testers` | Developer, App Manager, Admin |
| `webhooks` | Admin |
| `xcode-cloud` | Developer, App Manager, Admin |
| `xcode-cloud:repositories` | Developer, App Manager, Admin |
| `xcode-cloud:workflows` | Developer, App Manager, Admin |

## Pratikte en az yetki

Yukarıdaki tablo, App Store Connect'te [anahtar oluştururken](SETUP_tr.md#api-anahtarı-oluşturun) *seçtiğiniz* rollerdir. Bunların üstüne birkaç kısıt daha geçerli:

- **Analytics tipi raporlar hesaptan ilk defa istendiğinde Admin rolü gerekir.** Bir rapor türü hesabınızdan daha önce hiç istenmediyse onu başlatmak için Admin anahtarı gerekir. Rapor bir kez başlatıldıktan sonra **Sales** ya da **Finance** rolündeki bir anahtar onu okuyabilir. Yani Admin anahtarını yalnızca bu ilk iş için kullanın, günlük işlere dar rollü anahtarla devam edin.
- **Account Holder alanına hiçbir rolle ulaşılamaz.** Sözleşmeler, vergi formları ve banka bilgileri yalnızca kendi web sayfasından yönetiliyor. İmzasız ya da süresi dolmuş bir sözleşme onaylanana kadar hesap kilitli kalır.
- **Bir anahtarın gerçekte neye erişebildiğini görmek:** yapay zekâya *"Anahtarımın yetkilerini kontrol et"* deyin. Heimdall beş alanı tek tek dener: **raporlar**, **mağaza bilgileri**, **müşteri yorumları**, **kullanıcı yönetimi** ve **sertifikalar**. Her biri için şu cevaplardan birini verir:

| Durum | Anlamı |
|:--|:--|
| `ok` | Bu alan açık, anahtarınız burada çalışıyor. |
| `forbidden` | Anahtar çalışıyor ama rolü bu alana yetmiyor. Rolü yukarıdaki tabloya göre seçin. |
| `unauthorized` | Anahtarın kendisi geçersiz ya da iptal edilmiş. Rol değiştirmek işe yaramaz; `setup`'ı yeni bir anahtarla çalıştırın. |
| `agreement` | Hesabınızda imzalanmamış ya da süresi dolmuş bir sözleşme var. Bunu yalnızca Account Holder, [developer.apple.com/account](https://developer.apple.com/account) adresinde oturum açıp güncel Program Lisans Sözleşmesi'ni kabul ederek çözebilir. Hiçbir anahtar bunu düzeltemez. |
| `unknown` | Kontrol yapılamadı: bağlantı sorunu, Apple tarafında bir hata ya da hesapta henüz uygulama olmaması. **Bunu bir ret olarak okumayın**; anahtarınızda sorun olduğu anlamına gelmez. Biraz sonra tekrar deneyin. |
