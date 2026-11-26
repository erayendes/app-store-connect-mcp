# Apple API'sinin söylemedikleri

🇬🇧 [English](PITFALLS_en.md) · 🇹🇷 Türkçe

App Store Connect API'si çoğu zaman hata vermez; yanlış soruya doğru görünen bir cevap verir. Bu sayfa, Heimdall'ı yazarken canlı hesaplarda karşılaştığımız tuzakları toplar. Her birinin altında Heimdall'ın ne yaptığı yazıyor; Heimdall kullanmasanız da işinize yarar.

## Hata vermeyen yanlış cevaplar

**Ülke kodları üç harflidir.** `USA`, `TUR`, `DEU`; `US`, `TR`, `DE` değil. İki harfli kod reddedilmez: 200 ve boş bir liste döner, bu da "bu ülkede veri yok" diye okunur.
*Heimdall:* `US`, `tr` ya da `tur` yazdığınızda Apple'a sormadan önce `USA` ve `TUR`'a çevirir; bütün araçlarda.

**Listeler değer değil, bağlantı döndürür.** Örneğin bir aboneliğin `/prices` listesinde fiyat yoktur; fiyat noktası `include` ile istenmedikçe yalnızca bir ilişki kimliği gelir.
*Heimdall:* `pricing__*` araçları fiyatı tek çağrıda, değeriyle getirir.

**Apple hiçbir yerde ülke adı döndürmez.** Ne fiyat satırında ne `/v1/territories` içinde. Ülke ülke bir tablo isteyen herkes adları kendisi yazmak zorunda kalır.
*Heimdall:* Fiyat cevaplarına ülke adlarını, kodlarla aynı sırada ekler.

**Rapor isteği rapor değildir.** Analytics'te yeni bir rapor isteği bir süreç başlatır ve bir gün ya da daha uzun süre hiçbir şey üretmez. Yeni bir istekte "instance yok" beklenen durumdur.
*Heimdall:* `analytics__get_report` bunu hata gibi göstermez; soru sorarken kendiliğinden rapor isteği de açmaz.

**Bir rapor birden çok parçaya bölünebilir.** Tek bir instance birkaç segmente ayrılabilir; yalnız ilkini okuyan, eksik bir cevabı tam sanır.
*Heimdall:* Parçaları birleştirir ve kaç tane olduğunu söyler.

**StoreKit'te boş liste "satın alma yok" demek değildir.** `lookup_order` cevabında `status` 1 ise Apple o sipariş numarasını tanımıyordur.
*Heimdall:* Bunu araç açıklamasında söyler.

**"Yok" cevabı bazen 404 olarak gelir.** Boş bir tekil ilişki 404 ya da `data: null` döndürür; hiç ayarlanmamış bir retention messaging adresi de 404'tür. İkisi de hata değil, "yok" demektir.
*Heimdall:* Bunları "yok" olarak döndürür; yetki, ağ ve sunucu hataları hata olarak kalır.

**Anahtarın rolü hiç geri okunamaz.** Ekip anahtarının rolü oluşturulurken seçilir ve sonra hiçbir cevapta görünmez. Kişisel anahtar da sahibinin rollerini ve uygulama kısıtlarını sessizce devralır. Anahtarın dar olduğunu ancak iş ortasında bir 403 ile öğrenirsiniz.
*Heimdall:* `asc__status`, `check_capabilities: true` ile her alanı tek bir okuma isteğiyle baştan yoklar. Hangi işin hangi rolü istediği [Roller](ROLES_tr.md) sayfasında.

## Kabul edilip sessizce yanlış kalanlar

**Yanlış platform için açılan gönderim kabul edilir.** Gönderim bir platform taşır. macOS ya da visionOS sürümü için iOS diye açılan gönderimi Apple kabul eder; sürümün beklenen yerde çıkmadığını yayından sonra fark edersiniz.
*Heimdall:* `release__submit` platformu sürümden okur; okuyamazsa tahmin etmek yerine durur.

**Eksik metin gönderimi durdurmaz.** Önceki sürümü anlatan bir "Yenilikler" metni, bitmiş bir indirimi anan tanıtım metni, yayındaki sürümde çevrilmiş ama yenisinde boş kalan bir dil: gönderim yine de tamam görünür, fark eden App Review olur.
*Heimdall:* `listing__diff_metadata` iki sürümün metnini dil dil yan yana koyar.

**Toplu yazma yarıda kalırsa neyin yazıldığı bilinmez.** On birinci dildeki bir 409, önceki on dili yazılmış bırakır ve hata hangilerinin yazıldığını söylemez.
*Heimdall:* Karakter sınırlarını göndermeden önce denetler: açıklama 4000, anahtar kelimeler 100, "Yenilikler" 4000, tanıtım metni 170, adresler 255 karakter.

## Yanlış yöne gönderen hata kodları

**403'ün iki anlamı var.** "Anahtarın rolü yetmiyor" ile "hesapta imzalanmamış bir anlaşma var" aynı kodla gelir. İkincisini yeni anahtar ya da rol çözmez: yalnızca Account Holder, developer.apple.com'da güncel Program License Agreement'ı kabul ederek açabilir. App Store Connect'teki "Agreements, Tax, and Banking" sayfası başka bir anlaşmadır.
*Heimdall:* Hata kodunu (`FORBIDDEN.REQUIRED_AGREEMENTS`) okur ve doğru kişiyi, doğru sayfayı söyler.

**409'un da iki anlamı var.** Çoğu zaman "kaynak bu durumda değiştirilemez" demektir (incelemedeki ya da yayındaki sürüm kilitlidir). Ama geçersiz bir değer de 409 (`ENTITY_ERROR`) döner.
*Heimdall:* İkisini ayırır. Gövdeyi de göndermeden önce şemaya göre doğrular; yazım hatalı bir alan, alan yoluyla birlikte geri gelir.

**Bazı hatalar neyin yanlış gittiğini söyler ama ne yapılacağını söylemez.** Oluştururken "Entity with locale: en-US already exists", tanıtım teklifinde eksik `territory`, "başka bir build zaten beta incelemede".
*Heimdall:* Canlı hesaplarda görülen hatalarda döndürdüğü hata bir sonraki adımı da söyler: mevcut çeviriyi güncelleyin, ülkeyi verin ya da `pricing__make_offer` kullanın, süren incelemenin bitmesini bekleyin.

**Production'da 401, anahtarın bozuk olduğunu göstermeyebilir.** App Store Server API, henüz App Store'da yayınlanmamış bir uygulama için Production'da 401 döner; Sandbox yayından önce de çalışır.
*Heimdall:* Hata mesajına bunu ekler.

**Bildirim geçmişi tarih aralığı ister.** Başlangıç ve bitiş tarihi olmadan istek reddedilir (4000015); cevap 20'şer kayıtlık sayfalarla gelir.

## Sıra kuralları

**Uygulamanın ilk satın alımı tek başına gönderilemez.** İlk uygulama içi satın alma ya da ilk abonelik, uygulamanın yeni sürümüyle aynı gönderimde olmalı; ilk abonelik sürümü de grubunun sürümüyle birlikte gider.
*Heimdall:* `release__submit_items` bunu denetler; `with_app_version: true` sürümü aynı gönderime ekler.

**İşlenmekte olan ekran görüntüsü gönderimi durdurur.** Bir görüntü hâlâ işleniyorsa Apple gönderimi 409 ile reddeder.
*Heimdall:* `preflight__check_version` bunu göndermeden önce yakalar.

**Ekran görüntüleri ve önizlemeler ayrı sıralanır.** İkisini tek listede sıralamaya çalışmak 409 döner.

**Uygulama içi satın alma sürümüne tek görsel konur.** Sürümde bir `images` listesi olsa da ikinci görsel 409 ile reddedilir.

**Dosya yüklemesinde şemadaki özet algoritması çalışmayabilir.** Şema SHA-256 sunar; ama canlı bir build yüklemesinde (Ekim 2026) Apple 409 döndü ve MD5'i kabul etti.
*Heimdall:* `media__upload` MD5 gönderir.

**Gönderim kalemlerinde iki deney ilişkisi birlikte istenemez.** İkisi aynı istekte `include` edilirse 400 döner; geçerli olan V2'dir.

**Eski v1 araçları kapalı.** Abonelik ve uygulama içi satın almaların v1 yerelleştirme, görsel ve gönderim uç noktaları ile v1 ürün sayfası testleri kaldırıldı.
*Heimdall:* Yalnızca v2 araçlarını üretir.

**Dakikalık bir hız sınırı da var.** Apple anahtar başına saatte 3.600 isteği belgeler; belgelenmemiş bir dakikalık sınır da vardır, 300 civarında.
*Heimdall:* İsteklerini iki sınıra göre baştan yavaşlatır; 429'u beklemez.

## API'nin hiç yapamadıkları

Bunlar için App Store Connect'in web sitesine gitmeniz gerekir:

- **App Privacy** (veri toplama yanıtları): API'de uç noktası yok, ama her uygulama incelemeden önce bunu yayınlamak zorunda.
- **EU trader status:** Avrupa Birliği'nde satış için gerekli; hesap başına bir kez, Account Holder ya da Admin ayarlar.
- **Anlaşmaların durumu:** Apple bunu bildiren uç noktayı kaldırdı.
- **Ret nedeni:** Apple bir kalemi reddettiğinde nedeni API'de yok; Resolution Center'da okunur.
- **Bir rapor türünün ilk isteği:** Yalnızca Admin rolüyle yapılabilir ve App Store Connect arayüzünde bunun bir yolu yok.
- **Yeni uygulama kaydı:** Birçok hesapta API ile açılamaz; bir kez web arayüzünden açın, sonrasını API ile yönetin.

*Heimdall:* `preflight__check_version`, ilk üçünü her seferinde `manualChecks` içinde listeler, çünkü `ready: true` onları kapsayamaz.

---

Burada olmayan bir tuzağa rastladıysanız [bir issue açın](https://github.com/erayendes/app-store-connect-mcp/issues).
