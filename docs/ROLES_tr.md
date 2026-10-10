# App Store Connect Rolleri

🇬🇧 [English](ROLES_en.md) · 🇹🇷 Türkçe

Bu doküman App Store Connect rollerinin yetkilerini ve risklerini belirtmek için hazırlandı. Her zaman ihtiyacınız olan en dar kapsamla ilerlemenizi öneririm.

| Rol | Yetkiler | Risk |
|:--|:--|:--|
| **Admin** | Her şey üzerinde tam kontrol; kullanıcı yönetimi (`users`), kod imzalama (`provisioning`) ve webhook'lar (`webhooks`) dahil. | **En yüksek.** Başka kullanıcıların erişimini iptal edebilir, sertifika/profilleri silebilir — bu tüm ekibin imzalamasını bozar. Etki alanı kendi uygulamanızın dışına taşar. |
| **App Manager** | Uygulamayı uçtan uca yönetir: metadata (`apps`), sürümler (`versions`), build'ler (`builds`), TestFlight (`testflight`), abonelikler ve IAP (`subscriptions`, `iap`), fiyatlandırma (`pricing`). | **Yüksek.** Canlı bir sürümü gönderebilir/geri çekebilir, bir uygulama içi satın alma veya abonelik grubunu silebilir. Canlı listenizi ve gelirinizi doğrudan etkiler. |
| **Developer** | Yalnızca build ve test: build'ler (`builds`), TestFlight (`testflight`), Xcode Cloud (`xcode_cloud`) — yükleme, gönderim değil. | **Orta.** Testçileri, build'leri, beta gruplarını silebilir; ama fiyatlandırmaya, canlı metadata'ya dokunamaz, incelemeye gönderemez. |
| **Marketing** | Mağaza görünürlüğünü yönetir: ekran görüntüleri, özel sayfalar, uygulama içi etkinlikler ve yorumlar (`marketing`). | **Orta.** Zaten müşteriye görünen özel ürün sayfalarını, önizlemeleri, uygulama içi etkinlikleri kaldırabilir. |
| **Sales** | Satış ve trend raporlarını okur (`analytics`). | **Düşük.** Neredeyse tamamen salt okunur — rapor istekleri, listenizi değiştiren bir şey yok. |
| **Finance** | Finans ve ödeme raporlarını okur (`analytics`; ayrıca setup'ta Vendor number girilmiş olmalı). | **Düşük.** Sales ile aynı, ağırlıklı okuma yapan `analytics` alanı. |
| **Customer Support** | Müşteri yorumlarını okur ve yanıtlar (`reviews`, `reviews_ai__*` dahil). | **Düşük-orta.** Bir işlem kamuya açık yanıt gönderir — geri alınabilir, ama bir hatayı fark etmeden önce müşterilere görünür. |

> [!NOTE]
> Günlük release işlerinin çoğu yalnızca **App Manager** rolü ister.
> CI build yüklemeleri içinse **Developer** rolü yeterli.
> Sadece gerçekten `analytics` araçlarını kullanacaksanız **Finance**/**Sales** ekleyin.

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
