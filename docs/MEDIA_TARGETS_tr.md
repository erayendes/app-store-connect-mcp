# Medya hedefleri

🇬🇧 [English](MEDIA_TARGETS_en.md) · 🇹🇷 Türkçe

Görselleri, videoları ve dosyaları listelemesini, yüklemesini, düzenlemesini ya
da silmesini yapay zekânızdan isteyin. Yapay zekâ bunun için ASC-Core'daki dört
medya aracını (`media__list`, `media__upload`, `media__arrange`,
`media__delete`) aşağıdaki `target` değerlerinden biriyle kullanır.

## Mağaza sayfaları ve asset library

| Hedef | Ne olduğu | `page_id` | Düzenleme |
|:--|:--|:--|:--|
| `library` | Uygulamanın asset library'si: yerleştirilmiş ya da yerleştirilmemiş her görsel ve video | — | yeniden adlandırma, arşivleme, videonun kapak karesi |
| `version` | App Store sürüm sayfası | — (sürümü ve `locale`'i belirtin) | yerleştirme, sıralama, kaldırma, kapak karesi |
| `cpp` | Bir özel ürün sayfası | Yerelleştirmesi | yerleştirme, sıralama, kaldırma, kapak karesi |
| `ppo` | Bir ürün sayfası testinin varyantı | Yerelleştirmesi | yerleştirme, sıralama, kaldırma, kapak karesi |
| `event` | Bir uygulama içi etkinliğin kart ve detay görselleri | Yerelleştirmesi | yerleştirme, kaldırma |

Bir sayfaya yüklenen dosya önce kütüphaneye girer, aynı adımda sayfaya
yerleştirilir. Sayfadan kaldırılan dosya kütüphanede kalır; kütüphaneden
silinen dosya yerleştirildiği her yerden kalkar.

## Görsel ve dosya hedefleri

`page_id`, tablodaki sahip kaynağın tam ID'sidir; görselin ya da dosyanın ID'si
değildir. `media__list` dosya ID'lerini, adlarını, işlenme durumlarını ve
hatalarını döndürür. Listeyi süzmek ya da silinecek dosyaları seçmek için
`file_ids` kullanın.

| Hedef | `page_id` sahibi | Listeleme | Yükleme | Silme | Yükleme riski | Dosya kontrolü |
|:--|:--|:--:|:--:|:--:|:--|:--|
| `app_clip_header_image` | Varsayılan deneyim yerelleştirmesi | ✓ | ✓ | ✓ | public | PNG/JPEG |
| `app_clip_advanced_experience_image` | Gelişmiş deneyim ya da hiçbiri | ✓ | ✓ | — | public; `page_id` olmadan low | PNG/JPEG |
| `game_center_achievement_image` | v2 başarım yerelleştirmesi | ✓ | ✓ | ✓ | public | PNG/JPEG |
| `game_center_leaderboard_image` | v2 sıralama tablosu yerelleştirmesi | ✓ | ✓ | ✓ | public | PNG/JPEG |
| `game_center_leaderboard_set_image` | v2 tablo seti yerelleştirmesi | ✓ | ✓ | ✓ | public | PNG/JPEG |
| `game_center_activity_image` | Etkinlik yerelleştirmesi ya da etkinlik sürümü | ✓ | ✓ | ✓ | public | PNG/JPEG |
| `game_center_challenge_image` | Meydan okuma yerelleştirmesi ya da meydan okuma sürümü | ✓ | ✓ | ✓ | public | PNG/JPEG |
| `in_app_purchase_image` | Uygulama içi satın alma sürümü | ✓ | ✓ | ✓ | public | PNG/JPEG |
| `in_app_purchase_review_screenshot` | Uygulama içi satın alma | ✓ | ✓ | ✓ | low | PNG/JPEG |
| `subscription_image` | Abonelik sürümü | ✓ | ✓ | ✓ | public | PNG/JPEG |
| `subscription_review_screenshot` | Abonelik | ✓ | ✓ | ✓ | low | PNG/JPEG |
| `encryption_document` | Şifreleme beyanı | ✓ | ✓ | — | low | Ham belge baytları |
| `app_review_attachment` | App Store inceleme bilgisi | ✓ | ✓ | ✓ | low | Ham ek baytları |
| `routing_coverage` | App Store sürümü | ✓ | ✓ | ✓ | low | Ayrıştırılmış GeoJSON yapısı, ≤4 MiB |
| `background_asset_file` | Background asset sürümü | ✓ | ✓ | — | low | Ham asset/manifest baytları |
| `build_upload_file` | Build yüklemesi ya da hiçbiri | ✓ | ✓ | Yüklemenin tamamı | release | UTI'ye özgü imza |

**Risk sizin için ne demek.** `public`, `low` ve `release` sormaz; onay yapay
zekâ uygulamanızın kendisine kalır. Her silme ve `replace: true` ile yapılan
yükleme `destructive` seviyesindedir ve CONFIRM yazmanızı ister.

Bütün silmeler `destructive` seviyesindedir. Bu hedeflerin hiçbiri
`media__arrange` desteklemez: Apple'ın bunlar için yerleşim sıralaması yoktur.
Tire, spesifikasyonda DELETE işlemi olmadığı anlamına gelir. Build dosyaları
yalnızca build yüklemesinin tamamı silinerek silinebilir; bu işlem için
`file_ids` vermeyin. Önizlemesi yüklemedeki her dosyayı, yüklemenin
`cfBundleShortVersionString (cfBundleVersion)` değerini ve bağlı bir build olup
olmadığını gösterir.

## Sahip başına tek dosya

Görsel ve dosya sahiplerinin çoğu tam olarak tek dosya tutar: Apple bunları
tekil (to-one) ilişki olarak modeller (`app_clip_header_image`, beş Game Center
yerelleştirme görseli, iki sürüm varsayılan görseli, IAP ve abonelik görselleri (Apple liste olarak verse de sürüm başına bir tane), iki inceleme ekran
görüntüsü, `encryption_document`, `routing_coverage` ve gelişmiş deneyim
başlığı). Boş bir tekil ilişki 404 ya da `data: null` döndürür; ikisi de
"henüz dosya yok" diye okunur, böylece ilk yükleme çalışır. Diğer okuma
hataları (403, 5xx) hata olarak kalır.

Dosyası zaten olan bir sahibe yükleme reddedilir ve o dosyanın adı söylenir.
`replace: true` verirseniz Apple'ın değiştirme sırası uygulanır: önce mevcut
dosya silinir, sonra yenisi için yer ayrılır, gönderilir ve tamamlanır. Silme
önizlemede görünür ve plan `destructive` olduğu için yazılı onay ister.
`encryption_document` için DELETE olmadığından dolu bir beyanın belgesi burada
değiştirilemez. Gelişmiş deneyim başlığı istisnadır: yeni bir görsel bağlamak
eskisinin yerine geçer ve önizleme eski görselin silinmediğini, ayrıldığını
söyler (Apple'da onun için DELETE yoktur).

## Sahibi göründüğü gibi olmayanlar

**Game Center etkinlik ve meydan okuma sürümleri.** Apple bu iki görsel
ailesini `relationships.version` altında, sürümün varsayılan görseli olarak da
oluşturur. `page_id` yerelleştirme ya da sürüm olabilir: Heimdall önce
yerelleştirmeyi okur, 404 alırsa ID'yi sürüm olarak okur (ID'ler türler
arasında benzersizdir). Önizleme bunu `version default image` diye etiketler.

**Paylaşılan Game Center grupları.** Paylaşılan bir gruptaki başarım, sıralama
tablosu, tablo seti, etkinlik ya da meydan okumanın `gameCenterDetail` değeri
`null`'dır (ya da bu isteğe bağlı ilişki hiç yoktur) ve onun yerine bir
`gameCenterGroup` vardır. Uygulamanın kendi Game Center kaydı
(`/v1/apps/{id}/gameCenterDetail?include=gameCenterGroup`) o gruptaysa öğe
adı verilen uygulamaya aittir. İki bağlantı da uygulamayı kanıtlamıyorsa çağrı
reddedilir.

**Gelişmiş App Clip deneyimleri.** Apple'ın gelişmiş deneyim oluşturma isteği
`relationships.headerImage` ister; yani görselin önce var olması gerekir.
`app_clip_advanced_experience_image`'ı `page_id` olmadan yükleyin: uygulama yine
adıyla verilir, görsel için yer ayrılır, gönderilir ve sahipsiz olarak
tamamlanır; sonuç, deneyim oluşturulurken `headerImage` olarak verilecek
`fileId`'yi döndürür. Önizleme görselin bağlanmadığını söyler. Henüz müşteriye
görünen bir şey olmadığı için seviyesi `low`'dur. Sahipsiz bir yüklemeyi
kontrol etmek için `media__list`'i adı verilen uygulama, bu hedef ve
`file_ids: [fileId]` ile, `page_id` vermeden çağırın. Apple bu kaynakta
uygulama bağlantısı tutmadığı için adı verilen uygulamaya ait olduğu
kanıtlanamaz. Bu yol yalnızca işlenme durumunu ve hataları bildirir; hiçbir şey
yazmaz.

**Build yüklemeleri.** Bir build yüklemesinin uygulama ilişkisi yoktur. Sahiplik,
uygulamanın build yükleme listesinin yüklemenin kendi `cfBundleVersion`,
`cfBundleShortVersionString` ve `platform` değerleriyle süzülmesiyle kanıtlanır;
böylece binlerce yüklemesi olan uygulamalarda sayfa sayfa dolaşılmaz. Yeni bir
build yüklemesi (`page_id` olmadan) riski `release` olan `build_uploads.create`
gönderir. Mevcut bir build yüklemesine dosya tamamlamak da build işlemeyi
başlatır ve `release` seviyesindedir.

## Katkıda bulunanlar için

### Dosya kontrolleri ve bellek

Her dosya boş olmamalı ve normal bir dosya olmalıdır: görseller için 50 MiB,
routing coverage GeoJSON'u için 4 MiB, diğer dosyalar için 500 MiB. Bunlar
yerel güvenlik sınırlarıdır, Apple'ın kabul sınırları hakkında bir iddia
değildir. Okuma stat, open ve fstat ile yapılır; ardından dosya o tanımlayıcı
üzerinden 1 MiB'lık parçalarla özetlenir (hash). Tanımlayıcı açık kalır: ayrılan
her bayt aralığı ondan yeniden okunup gönderilir, bellekte bir seferde tek
aralık bulunur (64 MiB'tan büyük bir aralık okunmadan reddedilir).
`encryption_document` gibi DELETE'i olmayan tek dosyalık bir yuvada 64 MiB'tan
büyük dosyalar yer ayırmadan önce reddedilir, çünkü Apple dosyanın tamamı için
tek aralık döndürebilir. Yer ayrıldıktan sonra yükleme ya da tamamlama
başarısız olursa sonuç, sahipsiz kalan ayırmanın ID'sini söyler. Gönderilenin
SHA-256 değeri, kontrol edilip onaylananla aynı olmalı; dosyanın kimliği,
boyutu ve zamanları da değişmemiş olmalı, yoksa hiçbir şey tamamlanmaz. Bütün
olarak bellekte tutulan tek dosya, ayrıştırılabilmesi için kendi sınırı içinde
GeoJSON'dur.

PNG/JPEG kontrolleri sihirli baytlara (magic bytes) bakar. GeoJSON UTF-8 BOM'u
kabul eder ve geometri, koordinat ve koleksiyon yapısı açısından kontrol edilir:
kapalı poligon halkaları, boş olmayan koleksiyonlar ve koordinat listeleri, her
özellikte (feature) bir geometri (`properties` olmayabilir). Apple dosyayı
işlerken kendi kapsam kurallarını yine uygular; ne spesifikasyon ne bu depo
daha dar bir biçim kuralı belgelediği için böyle bir kural konmaz. Build
UTI'leri ZIP/IPA (`PK` yerel başlığı), düz paket (`xar!`), ikili plist
(`bplist00`) ya da XML plist çerçevesini kontrol eder (isteğe bağlı BOM,
bildirim, yorumlar ve DOCTYPE, bir öğe tutan ve sonda kapanan bir `<plist>`
kökü; ilk ve son 64 KiB'tan okunur). Bunlar dosya türünü tanır; imzalamayı ya
da arşiv içeriğini doğrulamaz. `spec/openapi.json`'daki belge, inceleme eki ve
background dosyası istek şemaları MIME ya da uzantı kısıtı bildirmez; bu yüzden
Heimdall bu hedeflere yalnızca-PDF, yalnızca-ZIP ya da yalnızca-JSON kuralı
koymaz.

Hedefe özgü argümanlar dosya açılmadan ya da Apple çağrılmadan önce kontrol
edilir ve anlamsız oldukları yerde reddedilir. Background dosyaları
`asset_type: ASSET` ya da `MANIFEST` alır. Build dosyaları `asset_type: ASSET`,
`ASSET_DESCRIPTION` ya da `ASSET_SPI` ile birlikte `uti` alır. `page_id`
verilmediğinde `build_version`, `build_short_version` ve `platform` yeni bir
build yüklemesi oluşturur; sonraki dosyalar `page_id` olarak dönen `ownerId`'yi
kullanır. `replace` yalnızca DELETE'i olan tek dosyalık sahipler içindir.

Build kararı depodaki spesifikasyonu izler: `BuildUploadFile.attributes`
`uploadOperations` içerir (bir `DeliveryFileUploadOperation` dizisi),
`BuildUploadFileCreateRequest` `buildUpload` altında bir dosya için yer ayırır
ve `BuildUploadFileUpdateRequest` `uploaded` ve `sourceFileChecksums` kabul
eder. Akış, gerekiyorsa `POST /v1/buildUploads`, ardından
`POST /v1/buildUploadFiles`, dönen bayt aralıklarının yüklenmesi ve
`PATCH /v1/buildUploadFiles/{id}`'dir. Dosya için DELETE yoktur;
`DELETE /v1/buildUploads/{id}` bunun yerine sahibi siler.

### Sahiplik, önizlemeler ve kapsam

Sahiplik, tam üst kaynaktan istenen ilişkiler üzerinden adı verilen uygulamaya
kadar kontrol edilir. Uygulama içi satın almalar ve abonelik grupları, ters
uygulama ilişkisi olmadığı için uygulamanın sayfalı koleksiyonunu kullanır;
build yüklemeleri yukarıdaki süzülmüş koleksiyonu kullanır. Build ve background
dosya koleksiyonları, include edilebilen bağlantı değil yalnızca link taşıdıkları
için ilişki listesi uç noktalarını kullanır. Belirsiz sürüm/platform seçicileri
ve eksik sahiplik verisi reddedilir. Seçilen her ID'nin doğrulaması herhangi
bir yazmadan önce biter. Apple'ın istekleri atomik değildir (transaction yoktur);
sonraki bir istek başarısız olursa sonuç, silmesi gerçekleşmiş bir değiştirme
de dahil, tamamlanan ve başarısız olan öğeleri belirtir.

Önizleme ve yürütme aynı planlayıcıyı kullanır. Parmak izi uygulamayı,
sahipleri, mevcut dosya ID'lerini ve boyutlarını, önerilen istekleri ve
yüklemenin özetini kapsar; işlenme durumundaki değişiklikler onayı geçersiz
kılmaz. Bir değiştirme, eski dosyayı silmeden hemen önce yerel dosyanın
kimlik ve zaman bilgisini ve SHA-256 değerini yeniden kontrol eder. `page_id` verilmiş gelişmiş
App Clip yüklemeleri yeni başlığı ancak tamamlamadan sonra bağlar. Tamamlama
istekleri, şemanın alanı buysa MD5 `sourceFileChecksum`, background ve build
dosyaları içinse MD5 `sourceFileChecksums.file` içerir (spec SHA-256'ya da izin
veriyor, ama Apple gerçek bir build tamamlamasında bunu reddetti). Güncellemesi yalnızca
`uploaded` kabul eden yedi görsel ailesi için checksum alanı gerekmez.

Medya araçlarının karşıladığı 97 ham işlemin (`MACRO_COVERED`) 73'ü bu dosya
hedefleri; kalan 24'ü mağaza sayfası ve kütüphane medyası. Bu 73 işlem: 17
oluşturma (16 dosya ailesi ve build yüklemeleri), 13 silme (12 dosya ailesi ve
build yüklemeleri), on güncelleme ve 33 okuma (16 dosya okuyucusu ve iki sürüm
varsayılan görseli dahil 17 sahip ilişkisi okuması). Güncellemeler; yalnızca
`uploaded` kabul eden yedi güncelleme, müşteriye görünen iki App Clip görseli
(güncellemeleri `uploaded` ve bir MD5 checksum'dır; bu tam olarak tamamlama
adımıdır) ve routing coverage'dır. Tam eşleme
[`scripts/generate-profiles.ts`](../scripts/generate-profiles.ts) içinde; her
kapsanan hedef/eylem, include'u bilen HTTP mock'una karşı
[`tests/media-coverage.test.ts`](../tests/media-coverage.test.ts) içinde
çalışır.

Checksum alabilen kalan altı dosya güncellemesi (inceleme ekran görüntüleri,
şifreleme belgesi, inceleme ekleri, background ve build dosyaları), checksum'ı
bağımsız olarak düzeltebilmek için profillerinde kalıyor; hepsi özel ve düşük
riskli dosyalar. Müşteriye görünen bir görseli tamamlayan hiçbir ham güncelleme
bir profilde kalmadı. `app_clip_advanced_experiences.update` da kalıyor: başlık
bağlamak eylemlerinden yalnızca birini karşılıyor. Uygulama içi satın alma ve
abonelik sürümlerinin varsayılan görsel okumaları da kalıyor, çünkü varsayılan
görseli seçmek, seçilen sahibin bütün dosyalarını listelemekten farklıdır.

Yerel testler sahte verilerle çalışır. Her hedef için Apple'a karşı gerçek kabul
yüklemeleri, proje sahibinin elle yapacağı bir kontrol olarak kalıyor.
