# Rehber

🇬🇧 [English](GUIDE_en.md) · 🇹🇷 Türkçe

## Riskli işlemlerde onay

**Riskli değişikliklerden önce onay varsayılan olarak açıktır.**
Yani fiyat değiştirme, Admin yetkisi verme, sertifika silme gibi taleplerinizde Heimdall, kullandığınız uygulamada (Claude, Cursor…) bir onay penceresi açar ve neyin değişeceğini gösterir. Böylece yapay zekâ "fiyatı biraz düşür"ü yanlışlıkla `0.99` olarak anlasa bile, siz onaylamadan hiçbir şey değişmez.

## Zincirler yerine tek çağrı

App Store Connect'te basit görünen bir soru çoğu zaman arka arkaya bir sürü istek demektir. Örneğin *"Bu abonelik her ülkede kaça?"* sorusu için yapay zekâ önce uygulamayı, sonra abonelik grubunu, sonra aboneliği, sonra da 175 ülkenin fiyatını tek tek bulmak zorundadır.

Bunu gerçek bir oturumda ölçtük: **tek bir soru 1 milyon token ve 3 dolar tuttu.** Heimdall'la aynı soru **tek çağrıda, 2 saniyede** cevaplanıyor.

Aşağıdaki iş akışları bu tür uzun zincirleri tek adıma indiriyor. Siz bir şey yapmazsınız; yapay zekâ doğru olanı kendisi seçer.

| Çok adımlı akış | Tek iş akışı | Gerekli olan profil |
|:--|:--|:--|
| uygulama → grup → abonelik → fiyat noktaları | `pricing__get_subscription_price` — tek ülke, ya da ülke verilmezse ~175 ülke fiyata göre gruplanmış | `monetization:subscription-pricing` |
| uygulama → IAP → fiyat takvimi → fiyatlar | `pricing__get_iap_price` — ülkeye göre güncel ve planlanmış fiyatlar | `monetization:iap-pricing` |
| uygulama → fiyat takvimi → fiyatlar | `pricing__get_app_price` — ülkeye göre güncel ve planlanmış fiyatlar | `monetization:app-price` |
| aynı zincir artı yazma | `pricing__set_subscription_price` | `monetization:subscription-pricing` |
| IAP → fiyat noktaları → elle kurulan yepyeni bir fiyat takvimi | `pricing__set_iap_price` — tek ülkenin fiyatı; diğer elle girilmiş ve planlanmış fiyatlar aynen korunur | `monetization:iap-pricing` |
| ülke ülke fiyat belirlemek | `pricing__equalize_price` — tek çapa fiyat, diğer tüm pazarları Apple türetir; uygulama, IAP veya abonelik için | `monetization:subscription-pricing` |
| submission aç, sürümü ekle, teslim et — bu sırayla üç çağrı | `release__submit` | `distribution:submission` |
| build'i bul, beta gruplarını çözümle, eksik bağlantıları ekle | `testflight__assign_build_to_groups` | `access:beta-groups` |
| kırk dilin mağaza metnini gözle karşılaştırmak | `metadata_ai__audit_localizations` | `distribution:version` |
| her dile çeviriyi elle yapıştırmak | `metadata_ai__apply_localizations` — CSV veya JSON dosyadan | `distribution:version` |
| sürüm + build + inceleme detayı + yerelleştirmeler + ekran görüntüleri, "gönderilebilir mi" sorusu için | `preflight__check_version` | `distribution:version` |
| abonelik + grup yerelleştirmeleri + fiyatlar + kullanılabilirlik + inceleme ekran görüntüsü | `preflight__check_subscription` — inceleme öncesi katalog eksikleri | `monetization:subscription-catalog` |
| iki sürümü, her dil için elle karşılaştırmak | `listing__diff_metadata` — yalnızca farklı alanlar, artı eklenen ve düşen diller | `distribution:version` |
| sürüm → 50 yerelleştirme → ekran görüntüsü setleri → görüntüler | `listing__get_screenshots` | `distribution:version` |
| ekran görüntüsü için yer ayırıp baytları kendiniz taşımak | `listing__upload_screenshot` | `distribution:version` |
| kütüphaneye görsel ya da video için yer ayırıp yüklemek, sonra bir sayfaya yerleştirmek | `listing__upload_asset` | `marketing:asset-library` |
| istek → rapor → örnek → segment → imzalı URL | `analytics__get_report` — bağlantı değil, satır döndürür | `analytics` |
| uygulama → kilitlenme ve ekran görüntüsü bildirimleri → crash log'lar | `testflight__feedback_digest` — build bazında sayılar, cihaz/OS, yorumlar ve kısa crash log alıntıları | `testflight` |
| uygulama → Xcode Cloud ürünü → koşu → adımlar → sorunlar ve testler | `ci__diagnose_run` — en yeni 40 koşu içinde en son patlayanı bulur, sorunları ve başarısız testleri listeler | `xcode-cloud` |
| yorumları çekip elle gruplamak | `reviews_ai__triage`, `reviews_ai__daily_briefing`, `reviews_ai__draft_response` | `marketing:customer-review` |
| uygulamaları listeleyip her biri için sürüm çağrısı yapmak, sonra App Store durumlarını yorumlamak | `asc__account_status` — hangi uygulama yayında, hangisi yolda, sıradaki hamle sizde mi Apple'da mı | çekirdek, yani her profilde |

`pricing__equalize_price` yaklaşık 175 ülkede fiyatı birden değiştirir, yani doğrudan gelirinize dokunur. Bu yüzden çalışmadan önce mutlaka onayınızı ister.

## Uygulamayı adıyla çağırmak

Uygulamaları bulmak için sadece App ID'yi bilmek zorunda değilsiniz. Heimdall, sayısal ID yerine **uygulamanın adını ya da bundle ID'sini** de kabul eder. Çağrıdan önce doğru ID'yi kendisi bulur. Yani *"Acme'nin sürümlerini listele"* demek için önce Acme'nin ID'sini aramanız gerekmez.
Bu kolaylık yalnızca uygulamalar için geçerli. Diğer kayıtlarda bu genel bir kural değil: bazı iş akışları build numarası ya da abonelik adı da kabul eder, ama çoğu araç kaydın kendi ID'sini ister.

## StoreKit 2 — müşteri işlemleri

App Store Server API mağaza sayfanızla değil, tek tek müşterilerle ilgili soruları yanıtlar: satın alma geçmişi, hak sahipliği, iadeler, abonelik durumu.
`monetization:storekit` ile gelir. İsteğinizde uygulamanın adını söyleyin (*"Ask Quran'da bu işlemin iadeleri"*), bundle ID'sini Heimdall bulur. Hesapta tek uygulama varsa adını söylemenize de gerek yok.

## Prompt'lar

Üç iş akışı MCP prompt'u olarak sunuluyor. Kullandığınız uygulamada (Claude, Cursor…) `/` yazınca komut olarak görünürler.

| Prompt | Ne çalıştırır | Ne zaman sunulur |
|:--|:--|:--|
| `release-readiness` | `preflight__check_version`, ardından `listing__diff_metadata`, sonuçta GO ya da NO-GO | `distribution:version` |
| `review-triage` | brifing → triyaj → yorum başına taslak yanıt, hiçbiri gönderilmeden | `marketing:customer-review` |
| `price-check` | tek çağrıda dünya fiyatları, ardından yanlışlıkla girilmiş gibi görünen fiyatlar | `monetization:subscription-pricing` |

Bir prompt yalnızca kullandığı araçların hepsi yüklüyse görünür. Her biri yazmadan önce durur: gönderim, yanıt ve fiyat değişikliği sizin kararınızdır.

## Örnekler

> **Siz:** App Store Connect bağlantısını kontrol et, sonra uygulamalarımı listele.
>
> **Yapay zekâ:** *(`asc__status`, sonra `apps__list` çağırır)* Bağlı. 3 uygulamanız var: Acme (1234567890), Beta, Gamma.

> **Siz:** Acme için mevcut sürüm gönderime hazır mı?
>
> **Yapay zekâ:** *(`preflight__check_version` çağırır)* Sürüm 3.2 gönderime hazır: build ekli, ekran görüntüleri ve bütün dillerdeki açıklamalar tamam.

> **Siz:** Uygulama içi etkinlikleri yönetecek bir araç var mı? *(`marketing`'i yüklememişsiniz)*
>
> **Yapay zekâ:** *(`asc__search_tools` çağırır)* Evet — `app_events__*` araçları, yüklü olmayan `ASC-Marketing`'te. Eklemek için `setup`'ı yeniden çalıştırıp `marketing` profilini seçin.

> - 3.2 sürümünü incelemeye gönder, onaylandıktan sonra kademeli yayına başla.
> - Son bir haftadaki TestFlight crash gönderimlerini cihaz modeline göre grupla göster.
> - Abonelik gruplarımı ve her katmanın Türkiye, Almanya ve ABD'deki fiyatını göster.
> - Bu müşteri iki kez ücretlendirildiğini söylüyor — işlem ID'si 2000000891234567. Geçmişi ne gösteriyor, şu anda hak sahibi mi?

> sara@example.com'u Insiders grubuna ekle ve en son build'i ver. → Testçi önce hesaba sonra gruba eklenir, build ise gruba.

> 3.2 sürümünü başlat, 412 build'ini bağla ve göndermeden önce ne eksik söyle. → "Ne eksik söyle" kısmı tek bir kontrol çalıştırır: sürüm, build, ekran görüntüleri ve diller okunur; her eksiğin yanında onu düzeltecek araç yazar.

> Türkçe anahtar kelimeleri bunlarla değiştir, diğer dillere dokunma.

> Bu haftanın cevapsız 1 yıldızlı yorumlarını göster ve yorumun dilinde cevap taslağı yaz. → Cevabı kendi yapay zekânız yazar; yorumlar başka bir servise gitmez, ikinci bir API anahtarı gerekmez.

> Sandbox hesabımızın satın alma geçmişini temizle ve ülkesini Türkiye yap.

> Geçen ayın satış raporunu indir ve adet bazında ilk beş ülkeyi söyle. → Setup'ta Vendor number'ı girmiş olmanız gerekir. **Finans ve satış farklı raporlar.** `finance_reports__list` Apple'ın size ödediği; bölge ve para birimi bazında. `sales_reports__list` adet ve hasılat; günlük, haftalık, aylık ya da yıllık. Apple'ın size ödediği tutarı görmek istiyorsanız finans raporuna bakın.

> TestFlight testçileri bu hafta 2026100412 build'i için ne bildiriyor?

> Acme uygulamasının Monthly aboneliğini inceleme öncesi kontrol et, katalog eksiklerini listele. Ardından Premium grubundaki bütün abonelikleri denetle. → Tek aboneliğe ya da bir gruptaki en fazla 20 aboneliğe bakar ve her eksiğin yanına onu düzeltecek aracın adını yazar.
