# Rehber

🇬🇧 [English](GUIDE_en.md) · 🇹🇷 Türkçe

## Riskli işlemlerde onay

**Riskli değişikliklerden önce onay varsayılan olarak açıktır.**
Yani fiyat değiştirme, Admin yetkisi verme, sertifika silme gibi taleplerinizde Heimdall, kullandığınız uygulamada (Claude, Cursor…) bir onay penceresi açar ve neyin değişeceğini gösterir. Böylece yapay zekâ "fiyatı biraz düşür"ü yanlışlıkla `0.99` olarak anlasa bile, siz onaylamadan hiçbir şey değişmez.

Kullandığınız uygulama bu soruyu gösteremiyorsa (Claude Desktop'taki Code sekmesi gibi) Heimdall, Mac'te kendi penceresini açar; düğmesi ne yapacağını söyler: Remove, Upload, Delete. Yapay zekâ bu pencereyi ne görebilir ne de basabilir; siz cevap verene kadar bekler. Bir şey olmuyor gibi görünüyorsa o pencereye bakın.

## Zincirler yerine tek çağrı

App Store Connect'te basit görünen bir soru çoğu zaman arka arkaya bir sürü istek demektir. Örneğin *"Bu abonelik her ülkede kaça?"* sorusu için yapay zekâ önce uygulamayı, sonra abonelik grubunu, sonra aboneliği, sonra da 175 ülkenin fiyatını tek tek bulmak zorundadır.

Bunu gerçek bir oturumda ölçtük: **tek bir soru 1 milyon token ve 3 dolar tuttu.** Heimdall'la aynı soru **tek çağrıda, 2 saniyede** cevaplanıyor.

Aşağıdaki iş akışları bu tür uzun zincirleri tek adıma indiriyor. Sizin bir şey yapmanız gerekmez; yapay zekâ doğru olanı kendisi seçer.

| Çok adımlı akış | Tek iş akışı | Gerekli olan profil |
|:--|:--|:--|
| uygulama → grup → abonelik → fiyat noktaları | `pricing__get_subscription_price` — tek ülke, ya da ülke verilmezse ~175 ülke fiyata göre gruplanmış | `monetization:subscription` |
| uygulama → IAP → fiyat takvimi → fiyatlar | `pricing__get_iap_price` — ülkeye göre güncel ve planlanmış fiyatlar | `monetization:in-app-purchases` |
| uygulama → fiyat takvimi → fiyatlar | `pricing__get_app_price` — ülkeye göre güncel ve planlanmış fiyatlar | `monetization:app-price` |
| aynı zincir artı yazma | `pricing__set_subscription_price` | `monetization:subscription` |
| IAP → fiyat noktaları → elle kurulan yepyeni bir fiyat takvimi | `pricing__set_iap_price` — tek ülkenin fiyatı; diğer elle girilmiş ve planlanmış fiyatlar aynen korunur | `monetization:in-app-purchases` |
| ülke ülke fiyat belirlemek | `pricing__equalize_price` — tek çapa fiyat, diğer tüm pazarları Apple türetir; uygulama, IAP veya abonelik için | `monetization:app-price`, `in-app-purchases` ya da `subscription` |
| win-back, promosyon ya da introductory offer'ı ülke ülke fiyatlamak | `pricing__make_offer` — tek çapa fiyat (ya da ücretsiz deneme), teklif aboneliğin satıldığı her ülkede kurulur; tanıtım teklifi ülke ülke yazılır ve kaldığı yerden devam eder | `monetization:subscription-offers` ya da `subscription-win-back` |
| grup → abonelik → sürüm → yerelleştirmeler → satış ülkeleri → fiyat, yedi tür yazma | `pricing__setup_subscription` — tek onay; var olan grup yeniden kullanılır, hiç değiştirilmez | `monetization:subscription` |
| submission açmak, sürümü eklemek, teslim etmek — bu sırayla üç çağrı | `release__submit` | `distribution:publish` |
| aynısını bir IAP, abonelik, uygulama içi etkinlik, özel ürün sayfası, ürün sayfası testi, Game Center öğesi ya da background asset için yapmak | `release__submit_items` — birden çok öğe tek başvuruda; başvuruda zaten ne olduğunu okur, onaydan önce hepsini listeler, öğenin sürümle gitmesi gerekiyorsa uygulamanın sürümünü de ekleyebilir | öğenin kendi alt profili, örneğin `monetization:in-app-purchases` |
| build'i bulmak, beta gruplarını çözümlemek, eksik bağlantıları eklemek | `testflight__assign_build_to_groups` | `testflight:groups` |
| yüklenen build'in işlenip işlenmediğine tekrar tekrar bakmak | `testflight__wait_for_build` — 15 dakikaya kadar bekler ve VALID olup olmadığını söyler | `testflight:test-builds` |
| kırk dilin mağaza metnini gözle karşılaştırmak | `metadata_ai__audit_localizations` | `distribution:version` |
| her dile çeviriyi elle yapıştırmak | `metadata_ai__apply_localizations` — CSV veya JSON dosyadan | `distribution:version` |
| sürüm + build + inceleme detayı + yerelleştirmeler + ekran görüntüleri, "gönderilebilir mi" sorusu için | `preflight__check_version` | `distribution:version` |
| abonelik + grup yerelleştirmeleri + fiyatlar + kullanılabilirlik + inceleme ekran görüntüsü | `preflight__check_subscription` — inceleme öncesi katalog eksikleri | `monetization:subscription` |
| iki sürümü, her dil için elle karşılaştırmak | `listing__diff_metadata` — yalnızca farklı alanlar, artı eklenen ve düşen diller | `distribution:version` |
| sayfa → yerelleştirmeler → kütüphane yerleşimleri → görseller ve videolar | `media__list` — sürüm sayfası, özel ürün sayfası, ürün sayfası testi, uygulama içi etkinlik ya da kütüphanenin kendisi; Apple'ın adet ve boyut sınırlarıyla | ASC-Core |
| bir App Clip, Game Center öğesi, IAP ya da abonelik → görseli → yer ayırmak, yüklemek, tamamlamak | dosya `target`'ıyla `media__list` / `media__upload` / `media__delete` — inceleme ekran görüntüleri ve ekleri, şifreleme belgeleri, routing coverage dosyası, background asset ve build yükleme dosyaları da; hiçbir şey gönderilmeden önce dosya ve sahibi bir kez kontrol edilir. Bütün hedefler ve kuralları: [Medya hedefleri](MEDIA_TARGETS_tr.md) | ASC-Core |
| kütüphanede görsel ya da video için yer ayırmak, baytları yüklemek, sonra bir sayfaya yerleştirmek | `media__upload` — kütüphaneye, sayfa verirseniz o sayfaya da | ASC-Core |
| sayfaya yerleştirmek, sıralamak, sayfadan kaldırmak, videonun kapak karesini seçmek, arşivlemek ya da yeniden adlandırmak | `media__arrange` | ASC-Core |
| kütüphaneden birden çok dosyayı silmek ya da bir sayfadan kaldırmak, tek onayla | `media__delete` — silmeden önce her dosyanın o uygulamaya ve sayfaya ait olduğunu kontrol eder | ASC-Core |
| istek → rapor → örnek → segment → imzalı URL | `analytics__get_report` — bağlantı değil, satır döndürür | `analytics` |
| uygulama → kilitlenme ve ekran görüntüsü bildirimleri → crash log'lar | `testflight__feedback_digest` — build bazında sayılar, cihaz/OS, yorumlar ve kısa crash log alıntıları | `testflight:feedbacks` |
| uygulama → Xcode Cloud ürünü → koşu → adımlar → sorunlar ve testler | `ci__diagnose_run` — en yeni 40 koşu içinde en son patlayanı bulur, sorunları ve başarısız testleri listeler | `xcode-cloud:workflows` |
| yorumları çekip elle gruplamak | `reviews_ai__triage`, `reviews_ai__daily_briefing`, `reviews_ai__draft_response` | `marketing:customer-reviews` |
| uygulamaları listeleyip her biri için sürüm çağrısı yapmak, sonra App Store durumlarını yorumlamak | `asc__account_status` — hangi uygulama yayında, hangisi yolda, sıradaki hamle sizde mi Apple'da mı | ASC-Core |

Son sütundaki "ASC-Core", aracın setup'ın profillerinizin yanına kaydettiği ASC-Core sunucusunda olduğunu söyler. Profil sunucuları bu araçları taşımaz; yalnızca tek sunucu çalıştırabilen bir uygulama onları `--with-core` ile alır.

`pricing__equalize_price` yaklaşık 175 ülkede fiyatı birden değiştirir, yani doğrudan gelirinize dokunur. Bu yüzden, onayları `--no-confirm` ile kapatmadıysanız çalışmadan önce onayınızı ister.

## Uygulamayı adıyla çağırmak

Bir uygulamayla çalışmak için App ID'sini bilmeniz gerekmez. Heimdall, sayısal ID yerine **uygulamanın adını ya da bundle ID'sini** de kabul eder. Çağrıdan önce doğru ID'yi kendisi bulur. Yani *"Acme'nin sürümlerini listele"* demek için önce Acme'nin ID'sini aramanız gerekmez.
Bu kolaylık yalnızca uygulamalar için geçerli. Diğer kayıtlarda bu genel bir kural değil: bazı iş akışları build numarası ya da abonelik adı da kabul eder, ama çoğu araç kaydın kendi ID'sini ister.

## StoreKit 2 — müşteri işlemleri

App Store Server API mağaza sayfanızla değil, tek tek müşterilerle ilgili soruları yanıtlar: satın alma geçmişi, hak sahipliği, iadeler, abonelik durumu.
`monetization:transactions` ile gelir. İsteğinizde uygulamanın adını söyleyin (*"Ask Quran'da bu işlemin iadeleri"*), bundle ID'sini Heimdall bulur. Hesapta tek uygulama varsa adını söylemenize de gerek yok.

## Prompt'lar

Üç iş akışı MCP prompt'u olarak sunuluyor. Kullandığınız uygulamada (Claude, Cursor…) `/` yazınca komut olarak görünürler.

| Prompt | Ne çalıştırır | Ne zaman sunulur |
|:--|:--|:--|
| `release-readiness` | `preflight__check_version`, ardından `listing__diff_metadata`, sonuçta GO ya da NO-GO | `distribution:version` |
| `review-triage` | brifing → triyaj → yorum başına taslak yanıt, hiçbiri gönderilmeden. Uygulamanın sayısal Apple ID'sini ister | `marketing:customer-reviews` |
| `price-check` | tek çağrıda dünya fiyatları, ardından yanlışlıkla girilmiş gibi görünen fiyatlar | `monetization:subscription` |
| `getting-started` | bağlantı kontrolü, hesabın özeti, ardından bir aracın sorarak nasıl bulunacağı | ASC-Core |

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
> **Yapay zekâ:** *(`asc__search_tools` çağırır)* Evet — `app_events__*` araçları, yüklü olmayan `marketing:app-events`'te. Onay verirseniz eklemek için `npx -y @erayendes/asc-mcp@beta register marketing:app-events` komutunu çalıştırabilirim; ardından uygulamanızı yeniden başlatın.

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
