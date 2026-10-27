# Profiller

🇬🇧 [English](PROFILES_en.md) · 🇹🇷 Türkçe

Heimdall, App Store Connect'i yaptığınız işe göre böler. 13 profil arasından seçersiniz ve her biri kendi başına küçük bir MCP sunucusudur: profil adını verirsiniz, yalnızca o işin araçları yüklenir. Büyük profiller ayrıca alt profillere ayrılır; toplam 50 alt profil var.

Setup, seçtiklerinizin yanına **ASC-Core**'u da kaydeder: uygulamalarınızı bulma, bütün araçlarda arama ve medya araçları. Bunlar her profilde aynı olduğu için her sunucunun içinde ayrı ayrı değil, bir kez çalışır.

| Profil | Sunucu | Ne için | Araç | Alt profiller |
|:--|:--|:--|--:|:--|
| `access` | `ASC-Access` | Ekibiniz | 17 | sandbox, user-invitations, user-management |
| `analytics` | `ASC-Analytics` | Satış ve raporlar | 19 | — |
| `app-clips` | `ASC-AppClips` | App Clip'ler | 34 | — |
| `background-assets` | `ASC-BackgroundAssets` | İndirilebilir içerik | 13 | — |
| `distribution` | `ASC-Distribution` | Sürümler ve yayın | 80 | app-encryption, app-review-information, builds, dma-distribution, phased-releases, publish, version |
| `game-center` | `ASC-GameCenter` | Game Center | 149 | achievements, activities, challenges, groups, leaderboards, matchmaking, setup |
| `general` | `ASC-General` | Uygulama bilgileri | 49 | android-link, app-accessibility, app-availabilities, app-categories, app-information, app-tags, legal |
| `marketing` | `ASC-Marketing` | Mağaza sayfası ve yorumlar | 61 | app-events, custom-pp, customer-reviews, nominations, pp-optimization |
| `monetization` | `ASC-Monetization` | Fiyatlar ve abonelikler | 152 | app-price, iap-offers, in-app-purchases, plan-promote, subscription, subscription-codes, subscription-offers, subscription-win-back, transactions |
| `provisioning` | `ASC-Provisioning` | Sertifikalar ve cihazlar | 41 | bundle, certificates, devices, profiles, wallet |
| `testflight` | `ASC-TestFlight` | Beta testi | 81 | external-testing, feedbacks, groups, test-builds, testers |
| `webhooks` | `ASC-Webhooks` | Sunucunuza bildirimler | 9 | — |
| `xcode-cloud` | `ASC-XcodeCloud` | Bulutta build | 44 | repositories, workflows |
| `core` | `ASC-Core` | Her profille gelir: uygulama bulma ve ekran görüntüleri | 16 | — |

## ASC-Core

Setup ve `register` bir profil eklediklerinde ASC-Core'u kendiliğinden ekler, hiç profil kalmayınca kaldırır. Siz seçmezsiniz.

- **En sıkı ayarınıza uyar.** Bir yapay zekâ uygulamasındaki Heimdall sunucularından biri `--read-only` çalışıyorsa ASC-Core da salt okunur kaydedilir.
- **Hesap belirsizse eklenmez.** Oradaki sunucular farklı App Store Connect hesapları kullanıyorsa, biri `env` içinde kendi kimlik bilgilerini taşıyorsa ya da ayarlar veya bir kayıt tam okunamıyorsa (`envFile` yükleyen bir kayıt da buna girer) setup ASC-Core'u o yapay zekâ uygulamasına eklemez ve nedenini söyler.
- **Yalnızca tek sunucu çalıştırabilen bir yapay zekâ uygulaması** onu `--with-core` ile profilin içine alabilir. Xcode eklentileri bunu yapar.

Medya araçları (`media__*`) her ekran görüntüsünü, videoyu, görseli ve dosyayı yönetir. Mağaza sayfası medyası uygulamanızın görsel ve video kütüphanesi üzerinden gider: dosyayı kütüphaneye yüklersiniz, sonra sürüm sayfasına, özel ürün sayfasına, ürün sayfası testine ya da uygulama içi etkinliğe yerleştirirsiniz. Diğer görseller ve dosyalar doğrudan sahiplerine gider: App Clip, Game Center, uygulama içi satın alma ve abonelik görselleri, inceleme ekran görüntüleri ve ekleri, şifreleme belgeleri, routing coverage dosyası, background asset ve build yükleme dosyaları. Bütün hedefler [Medya hedefleri](MEDIA_TARGETS_tr.md) sayfasında.

### `core` · 16 araç

- `actors__get` — Bir işlemi kimin ya da hangi servisin yaptığını gösterir
- `actors__list` — Verilen kimliklerin hangi kişiye ya da servise ait olduğunu gösterir
- `apps__app_store_versions__list` — Uygulamanın mağaza sürümlerini listeler
- `apps__builds__list` — Uygulamanın yüklenmiş build'lerini listeler
- `apps__get` — Bir uygulamanın bilgilerini getirir
- `apps__in_app_purchases_v2__list` — Uygulama içinde satılan ürünleri listeler
- `apps__list` — Hesaptaki uygulamaları listeler
- `apps__subscription_groups__list` — Uygulamanın abonelik gruplarını listeler
- `asc__account_status` — Uygulamaların yayın durumunu ve sıradaki adımı gösterir
- `asc__discover_domains` — Kullanılabilir araç alanlarını gösterir
- `asc__search_tools` — Yüklü olmayanlar dahil araçları arar
- `asc__status` — Bağlantının ve kimlik bilgilerinin durumunu kontrol eder
- `media__arrange` — Görselleri sıralar, sayfaya yerleştirir ya da kaldırır, kapak karesini ayarlar, arşivler ve yeniden adlandırır
- `media__delete` — Seçilen görselleri veya videoları hedefinden siler; önce sahipliği doğrular ve adlarıyla gösterir
- `media__list` — Sürüm sayfası, özel ürün sayfası, ürün sayfası testi, etkinlik ve kütüphanedeki görsel ve videoları ya da bir görsel veya dosya hedefinin (uygulama içi satın alma görseli, inceleme ekran görüntüsü, build dosyası…) dosyalarını kimlikleri ve durumlarıyla listeler
- `media__upload` — Görseli veya videoyu kütüphaneye yükler, istenirse sayfaya yerleştirir; ya da bir görsel veya dosya hedefine (uygulama içi satın alma görseli, inceleme ekran görüntüsü, build dosyası…) yükler

## Alt profiller

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/app-store-connect-mcp/main/assets/picker.gif" alt="Profil seçici: monetization işaretlenince alt profilleri, araç sayısı ve token tahminiyle açılıyor" width="720">

<sub>2.x ile kaydedildi; o sürümde profillerin adları farklıydı (`app-info` artık `general`).</sub>

[Kurulum](SETUP_tr.md) seçicisinde bir profili işaretleyin; imleci üstüne getirdiğinizde alt profillerin hepsi işaretli olarak açılır, istemediğinizi kaldırın.
Örneğin `monetization` 152 araç; ama yalnızca abonelikler ve teklifleriyle uğraşıyorsanız 64 araçlık `monetization:subscription,subscription-offers` yeterlidir. Her iki durumda da sunucunun adı `ASC-Monetization` kalır.

Bu sayfadaki araç sayıları, sunucunun listelediği araçlardır: kendi araçları ve `asc__status`. Alt profillerinin yalnızca bir kısmıyla başlatılan bir sunucuya ayrıca `asc__call` ve `asc__describe` gelir; bunlar dışarıda bıraktığınız kısımlardaki okumalara ulaşır.

> [!TIP]
> Hangi profillerin yüklü olduğunu görmek için yapay zekâya *"Hangi profiller yüklü?"* diye sorun.

## Başlangıç paketleri

"Hangi profili kurayım?" sorusunun kısa yanıtı. Sayılara ASC-Core'un 16 aracı dahildir.

| Rol | Kurun | Araç |
|:--|:--|--:|
| Yayın yöneticisi | `distribution` + `general` | 145 |
| ASO / pazarlama | `marketing` + `analytics` | 96 |
| QA / TestFlight | `testflight` | 97 |
| Monetizasyon | `monetization` | 168 |
| Oyun geliştirici | `game-center` + `distribution:version,publish` | 200 |
| Müşteri desteği | `marketing:customer-reviews` + `monetization:transactions` | 42 |
| Build ve imzalama | `provisioning` + `xcode-cloud` | 101 |
| Ekip yöneticisi | `access` | 33 |

> [!TIP]
> Dar bir kapsamla başlayın. Bir profili atlamakla hiçbir şey kaybetmezsiniz. Yüklediğiniz her araç her sohbette yapay zekâya yeniden anlatılır. Ne kadar az araç, o kadar hızlı ve ucuz.
> Atladığınız bir araca ihtiyaç olursa yapay zekâya sorun; hangi profilde olduğunu ve nasıl ekleneceğini söyler.

## Bütün profiller

Her profilin içinde ne olduğu, ne zaman gerektiği, onu karşılayan en dar [anahtar rolü](ROLES_tr.md) ve araçları.

### `access` · 17 araç

**Sunucu:** `ASC-Access` · **Anahtar rolü:** Admin

**İçinde ne var:** App Store Connect ekibiniz: üyeler ve roller, davetler, sandbox test hesapları.

**Ne zaman gerekir:** Ekibe kişi davet etmek, rollerini belirlemek ve sandbox test hesaplarını yönetmek için.

#### `access:sandbox` · 6 araç

**İçinde ne var:** Uygulama içi satın alma denemeleri için sandbox hesapları ve satın alma geçmişlerini temizleme.

**Ne zaman gerekir:** Satın almaları denediğiniz sandbox Apple hesapları ve geçmişlerini temizlemek için. · **Anahtar rolü:** App Manager

- `sandbox_testers_clear_purchase_history_request_v2__create` — Deneme hesaplarının satın alma geçmişini temizletir
- `sandbox_testers_v2__list` — Satın alma denemelerinde kullanılan hesapları listeler
- `sandbox_testers_v2__update` — Deneme hesabının ülkesini, satın alma kesintilerini ve abonelik yenileme hızını değiştirir

#### `access:user-invitations` · 8 araç

**İçinde ne var:** Ekibe kişi davet etme ve bekleyen davetleri yönetme.

**Ne zaman gerekir:** Birini ekibe davet etmek ve kimin daveti henüz kabul etmediğini görmek için. · **Anahtar rolü:** Admin

- `user_invitations__create` — Bir kişiyi seçilen rol ve uygulama erişimiyle App Store Connect ekibine davet eder
- `user_invitations__delete` — Ekip davetini iptal eder
- `user_invitations__get` — Ekip davetinin bilgilerini gösterir
- `user_invitations__list` — Ekip davetlerini listeler
- `user_invitations__visible_apps__list` — Davet edilen kişinin erişebileceği uygulamaları listeler

#### `access:user-management` · 11 araç

**İçinde ne var:** Ekip üyeleri, rolleri ve hangi uygulamaları görebildikleri.

**Ne zaman gerekir:** Ekipte kim var, hangi rolde ve hangi uygulamaları görüyor, bunu yönetmek için. · **Anahtar rolü:** Admin

- `users__delete` — Bir kişinin ekip üyeliğini kaldırır
- `users__get` — Ekip üyesinin bilgilerini gösterir
- `users__list` — Ekip üyelerini listeler
- `users__update` — Ekip üyesinin görevlerini ve erişim yetkilerini değiştirir
- `users__visible_apps__add` — Ekip üyesine seçilen uygulamalara erişim verir
- `users__visible_apps__list` — Ekip üyesinin erişebildiği uygulamaları listeler
- `users__visible_apps__remove` — Ekip üyesinin seçilen uygulamalara erişimini kaldırır
- `users__visible_apps__replace` — Ekip üyesinin erişebildiği uygulamaların listesini yenisiyle değiştirir

### `analytics` · 19 araç

**Sunucu:** `ASC-Analytics` · **Anahtar rolü:** Sales

**İçinde ne var:** Satış ve finans raporları, analiz raporu istekleri, performans ve tanılama verileri.

**Ne zaman gerekir:** İndirmeler, satışlar, gelir ve uygulamanın nasıl çalıştığı hakkındaki sorular için.

- `analytics_report_instances__get` — Belirli tarihte hazırlanan raporun dönemini ve tarihini gösterir
- `analytics_report_instances__segments__list` — Belirli tarihte hazırlanan raporun indirilebilir parçalarını listeler
- `analytics_report_requests__create` — Uygulama için tek seferlik veya düzenli rapor hazırlanmasını ister
- `analytics_report_requests__delete` — Rapor hazırlama isteğini siler
- `analytics_report_requests__get` — Rapor hazırlama isteğinin durumunu gösterir
- `analytics_report_requests__reports__list` — Bir rapor isteği kapsamında hazırlanan rapor türlerini listeler
- `analytics_report_segments__get` — Rapor parçasının indirme bağlantısını ve dosya bilgilerini gösterir
- `analytics_reports__get` — Analiz raporunun adını ve türünü gösterir
- `analytics_reports__instances__list` — Raporun farklı tarihlerde hazırlanmış kopyalarını listeler
- `apps__analytics_report_requests__list` — Uygulamanın rapor hazırlama isteklerini listeler
- `apps__perf_power_metrics__list` — Uygulamanın hız ve pil tüketimi ölçümlerini gösterir
- `apps__performance_overviews__list` — Uygulamanın çalışma hızını ve sorunlarını özetler
- `builds__diagnostic_signatures__list` — Build'deki takılma, açılış ve disk yazma sorunlarını benzerliğe göre gruplar
- `builds__perf_power_metrics__list` — Build'in hız ve pil tüketimi ölçümlerini listeler
- `diagnostic_signatures__logs__list` — Bir sorun grubuna ait ayrıntılı tanılama kayıtlarını getirir
- `finance_reports__list` — Apple'ın ödeme ve gelir hesaplaşma raporunu getirir
- `sales_reports__list` — Satış ve abonelik raporunu getirir
- `analytics__get_report` — Uygulamanın analiz raporunu tek adımda indirip satır satır getirir; yeni rapor isteği başlatmaz

### `app-clips` · 34 araç

**Sunucu:** `ASC-AppClips` · **Anahtar rolü:** App Manager

**İçinde ne var:** App Clip'ler: varsayılan ve gelişmiş deneyimler, başlık görselleri, inceleme bilgileri, beta başlatma bağlantıları. Görseller ASC-Core'un medya araçlarıyla yüklenir.

**Ne zaman gerekir:** Uygulamanızın anında açılan hafif sürümü için.

- `app_clip_advanced_experiences__create` — Konum veya kodla tetiklenen gelişmiş bir App Clip deneyimi oluşturur
- `app_clip_advanced_experiences__get` — Gelişmiş bir App Clip deneyiminin ayrıntılarını getirir
- `app_clip_advanced_experiences__update` — Gelişmiş bir App Clip deneyiminin ayarlarını günceller
- `app_clip_app_store_review_details__create` — İnceleme ekibinin App Clip'i açacağı bağlantıları kaydeder
- `app_clip_app_store_review_details__get` — İnceleme ekibinin App Clip'i açacağı bağlantıları getirir
- `app_clip_app_store_review_details__update` — İnceleme ekibinin App Clip'i açacağı bağlantıları günceller
- `app_clip_default_experience_localizations__create` — Varsayılan App Clip deneyimi için yeni bir dil metni ekler
- `app_clip_default_experience_localizations__delete` — Varsayılan App Clip deneyiminin bir dildeki metnini siler
- `app_clip_default_experience_localizations__get` — Varsayılan App Clip deneyiminin bir dildeki metnini getirir
- `app_clip_default_experience_localizations__update` — Varsayılan App Clip deneyiminin bir dildeki metnini günceller
- `app_clip_default_experiences__app_clip_app_store_review_d_0tlnru` — Varsayılan App Clip deneyimi için inceleme ekibinin açacağı bağlantıları getirir
- `app_clip_default_experiences__app_clip_default_experience_02x7wx` — Varsayılan App Clip deneyiminin tüm dillerdeki metinlerini listeler
- `app_clip_default_experiences__create` — Uygulama için varsayılan bir App Clip deneyimi oluşturur
- `app_clip_default_experiences__delete` — Varsayılan bir App Clip deneyimini siler
- `app_clip_default_experiences__get` — Varsayılan App Clip deneyiminin ayrıntılarını getirir
- `app_clip_default_experiences__release_with_app_store_vers_0zdb21` — Varsayılan App Clip deneyiminin bağlı olduğu mağaza sürümünü getirir
- `app_clip_default_experiences__release_with_app_store_vers_0zdbim` — Varsayılan App Clip deneyimini belirli bir mağaza sürümüne bağlar
- `app_clip_default_experiences__update` — Varsayılan App Clip deneyiminin eylem butonunu veya ayarlarını günceller
- `app_clips__app_clip_advanced_experiences__list` — Bir App Clip'e ait tüm gelişmiş deneyimleri listeler
- `app_clips__app_clip_default_experiences__list` — Bir App Clip'e ait tüm varsayılan deneyimleri listeler
- `app_clips__get` — Bir App Clip'in temel bilgilerini getirir
- `app_store_versions__app_clip_default_experience__get` — Bir mağaza sürümüne atanmış varsayılan App Clip deneyimini getirir
- `apps__app_clips__list` — Uygulamanın sahip olduğu tüm App Clip bileşenlerini listeler
- `beta_app_clip_invocation_localizations__create` — Beta App Clip başlatma bağlantısı için dil başlığı ekler
- `beta_app_clip_invocation_localizations__delete` — Beta App Clip başlatma bağlantısının dil başlığını siler
- `beta_app_clip_invocation_localizations__update` — Beta App Clip başlatma bağlantısının dil başlığını günceller
- `beta_app_clip_invocations__create` — TestFlight testçileri için yeni bir App Clip başlatma bağlantısı oluşturur
- `beta_app_clip_invocations__delete` — Bir beta App Clip başlatma bağlantısını siler
- `beta_app_clip_invocations__get` — Bir beta App Clip başlatma bağlantısının ayrıntılarını getirir
- `beta_app_clip_invocations__update` — Bir beta App Clip başlatma bağlantısını günceller
- `build_bundles__app_clip_domain_cache_status__get` — Build paketinin App Clip alan adı önbellek doğrulama durumunu getirir
- `build_bundles__app_clip_domain_debug_status__get` — Build paketinin App Clip alan adı yapılandırma hatalarını getirir
- `build_bundles__beta_app_clip_invocations__list` — Derleme paketine tanımlanmış beta App Clip başlatma bağlantılarını listeler

### `background-assets` · 13 araç

**Sunucu:** `ASC-BackgroundAssets` · **Anahtar rolü:** Developer

**İçinde ne var:** Background Assets (iOS 26): uygulama dosyasının dışında indirilen içerik paketleri ve yayınları.

**Ne zaman gerekir:** Uygulamanızın kurulduktan sonra indirdiği içerik paketleri için.

- `apps__background_assets__list` — Uygulamanın arka plan varlık paketlerini listeler
- `background_asset_upload_files__update` — Gönderilen arka plan varlık dosyasını yüklendi olarak işaretler
- `background_asset_version_app_store_releases__get` — Arka plan varlık sürümünün mağaza yayınlanma durumunu getirir
- `background_asset_version_external_beta_releases__get` — Arka plan varlık sürümünün dış beta yayınlanma durumunu getirir
- `background_asset_version_internal_beta_releases__get` — Arka plan varlık sürümünün iç beta yayınlanma durumunu getirir
- `background_asset_versions__create` — Arka plan varlıkları için yeni bir sürüm kaydı oluşturur
- `background_asset_versions__get` — Bir arka plan varlık sürümünün ayrıntılarını ve durumunu getirir
- `background_assets__create` — Uygulama için yeni bir arka plan varlık paketi oluşturur
- `background_assets__get` — Bir arka plan varlık paketinin ayrıntılarını getirir
- `background_assets__update` — Arka plan varlık paketini arşivler ya da arşivden çıkarır
- `background_assets__versions__list` — Bir arka plan varlığına ait tüm sürümleri listeler
- `release__submit_items` — Background asset sürümünü incelemeye gönderir

### `distribution` · 80 araç

**Sunucu:** `ASC-Distribution` · **Anahtar rolü:** App Manager

**İçinde ne var:** Sürüm çıkarmak: App Store sürümleri ve dilleri, build'ler, inceleme bilgileri, gönderim ve yayın, ihracat uyumluluğu, AB'de alternatif dağıtım.

**Ne zaman gerekir:** Yeni sürüm, build, incelemeye gönderme ve kademeli yayın için.

#### `distribution:app-encryption` · 10 araç

**İçinde ne var:** İhracat uyumluluğu: şifreleme beyanları, belgeleri ve bir beyanı build'e bağlama.

**Ne zaman gerekir:** Bir build'in ihracat uyumluluğu sorularını cevaplamak için. · **Anahtar rolü:** App Manager

- `app_encryption_declaration_documents__update` — Yüklenen şifreleme belgesinin doğrulama bilgilerini kaydeder
- `app_encryption_declarations__create` — Uygulama için şifreleme beyanı oluşturur
- `app_encryption_declarations__get` — Şifreleme beyanının bilgilerini getirir
- `app_encryption_declarations__list` — Şifreleme beyanlarını listeler
- `apps__app_encryption_declarations__list` — Uygulamanın şifreleme beyanlarını listeler
- `builds__app_encryption_declaration__get` — Build'e bağlı şifreleme beyanını getirir
- `builds__app_encryption_declaration__set` — Build'e şifreleme beyanı bağlar

#### `distribution:app-review-information` · 8 araç

**İçinde ne var:** App Review'un gördükleri: iletişim bilgisi, demo hesap, inceleme notları ve ekler.

**Ne zaman gerekir:** App Review'un okuduğu iletişim bilgisi, demo hesap ve notlar için. · **Anahtar rolü:** App Manager

- `app_store_review_attachments__update` — Yüklenen inceleme ekinin doğrulama bilgilerini kaydeder
- `app_store_review_details__create` — Sürüm için inceleme iletişim ve erişim bilgileri oluşturur
- `app_store_review_details__get` — İnceleme iletişim ve erişim bilgilerini getirir
- `app_store_review_details__update` — İnceleme iletişim ve erişim bilgilerini günceller
- `app_store_versions__app_store_review_detail__get` — Sürümün inceleme iletişim ve erişim bilgilerini getirir

#### `distribution:builds` · 13 araç

**İçinde ne var:** Yüklenen build'ler: yükleme kayıtları, paketler, dosya boyutları, build ayrıntıları.

**Ne zaman gerekir:** Yüklediğiniz build'ler, boyutları ve ayrıntıları için. · **Anahtar rolü:** Developer

- `apps__build_uploads__list` — Uygulamanın build yükleme kayıtlarını listeler
- `build_bundles__build_bundle_file_sizes__list` — Build paketinin cihaz ve işletim sistemi sürümüne göre indirme ve kurulum boyutlarını listeler
- `build_upload_files__update` — Yüklenen build dosyasının doğrulama bilgilerini kaydeder
- `build_uploads__get` — Build yükleme kaydını getirir
- `builds__app__get` — Build'in ait olduğu uygulamayı getirir
- `builds__app_store_version__get` — Build'in seçildiği App Store sürümünü getirir
- `builds__get` — Build'in bilgilerini getirir
- `builds__icons__list` — Build'in simgelerini listeler
- `builds__list` — Yüklenmiş build'leri listeler
- `builds__update` — Build'in süresini bitirir veya şifreleme cevabını kaydeder

#### `distribution:dma-distribution` · 25 araç

**İçinde ne var:** AB Dijital Piyasalar Yasası kapsamında App Store dışı dağıtım: web dağıtımı alan adları, alternatif pazar kayıtları, imzalama anahtarları, paketler.

**Ne zaman gerekir:** AB'de App Store dışında satış için: web dağıtımı ve alternatif pazarlar. · **Anahtar rolü:** Admin

- `alternative_distribution_domains__create` — Alternatif dağıtım için alan adı ekler
- `alternative_distribution_domains__delete` — Alternatif dağıtım alan adını siler
- `alternative_distribution_domains__get` — Alternatif dağıtım alan adının bilgilerini getirir
- `alternative_distribution_domains__list` — Alternatif dağıtım alan adlarını listeler
- `alternative_distribution_keys__create` — Alternatif dağıtım için verdiğiniz açık anahtarı kaydeder
- `alternative_distribution_keys__delete` — Alternatif dağıtım anahtarını siler
- `alternative_distribution_keys__get` — Alternatif dağıtım anahtarının bilgilerini getirir
- `alternative_distribution_keys__list` — Alternatif dağıtım anahtarlarını listeler
- `alternative_distribution_package_deltas__get` — Alternatif dağıtımın fark güncellemesi (delta) için indirme bağlantısını getirir
- `alternative_distribution_package_variants__get` — Alternatif dağıtım paketi varyantının indirme bağlantısını getirir
- `alternative_distribution_package_versions__deltas__list` — Paket sürümünün fark güncellemelerini (delta) listeler
- `alternative_distribution_package_versions__get` — Alternatif dağıtım paketinin bir sürümünü getirir
- `alternative_distribution_package_versions__variants__list` — Paket sürümünün varyantlarını listeler
- `alternative_distribution_packages__create` — Bir mağaza sürümü için alternatif dağıtım paketi oluşturur
- `alternative_distribution_packages__get` — Alternatif dağıtım paketinin bilgilerini getirir
- `alternative_distribution_packages__versions__list` — Alternatif dağıtım paketinin sürümlerini listeler
- `app_store_versions__alternative_distribution_package__get` — Mağaza sürümüne bağlı alternatif dağıtım paketini getirir
- `apps__alternative_distribution_key__get` — Uygulamanın alternatif dağıtım anahtarını getirir
- `apps__marketplace_search_detail__get` — Uygulamanın pazar yeri katalog bağlantısını getirir
- `marketplace_search_details__create` — Alternatif pazar uygulamasının arama kataloğu adresini tanımlar
- `marketplace_search_details__delete` — Alternatif pazarın arama kataloğu adresini siler
- `marketplace_search_details__update` — Alternatif pazarın arama kataloğu adresini değiştirir

#### `distribution:phased-releases` · 8 araç

**İçinde ne var:** Sürümün kademeli yayını: başlatma, duraklatma, sürdürme, herkese açma.

**Ne zaman gerekir:** Bir sürümü yavaş yavaş yayınlamak, duraklatmak ya da herkese açmak için. · **Anahtar rolü:** App Manager

- `app_store_version_phased_releases__create` — Sürüm için 7 günlük kademeli yayını açar; sürüm yayımlanınca başlar
- `app_store_version_phased_releases__delete` — Sürümün kademeli yayın kaydını siler
- `app_store_version_phased_releases__update` — Kademeli yayını duraklatır, sürdürür veya tamamlar
- `app_store_version_release_requests__create` — Onaylanmış sürümü hemen yayımlar; geri alınamaz
- `app_store_versions__app_store_version_phased_release__get` — Sürümün kademeli yayın durumunu getirir

#### `distribution:publish` · 14 araç

**İçinde ne var:** İncelemeye gönderme ve yayınlama: inceleme başvuruları ve öğeleri, yayın istekleri, tek çağrılık gönderim makrosu.

**Ne zaman gerekir:** Bir sürümü App Review'a göndermek ve onaylanınca yayınlamak için. · **Anahtar rolü:** App Manager

- `app_store_version_release_requests__create` — Onaylanmış sürümü hemen yayımlar; geri alınamaz
- `apps__review_submissions__list` — Uygulamanın inceleme başvurularını listeler
- `review_submission_items__create` — Bir ürünü veya sürümü inceleme başvurusuna ekler
- `review_submission_items__delete` — Bir öğeyi henüz gönderilmemiş başvurudan çıkarır
- `review_submission_items__update` — Başvuru öğesini çözüldü işaretler veya başvurudan çıkarır
- `review_submissions__create` — Uygulama için boş bir inceleme başvurusu açar
- `review_submissions__get` — İnceleme başvurusunun durumunu getirir
- `review_submissions__items__list` — İnceleme başvurusundaki öğeleri listeler
- `review_submissions__list` — İnceleme başvurularını listeler
- `review_submissions__update` — İnceleme başvurusunu gönderir veya geri çeker
- `release__submit` — Sürümü kontrol eder ve Apple incelemesine gönderir

#### `distribution:version` · 24 araç

**İçinde ne var:** App Store sürümleri ve dilleri: yenilikler, anahtar kelimeler, sürüm ön kontrolü ve çeviri araçları. Ekran görüntüleri ve önizlemeler ASC-Core'daki medya araçlarıyla yönetilir.

**Ne zaman gerekir:** Sürüm oluşturmak, yenilikleri ve anahtar kelimeleri yazıp çevirmek için. · **Anahtar rolü:** App Manager

- `app_store_version_localizations__create` — Bir sürümün belirli dildeki mağaza metinlerini oluşturur
- `app_store_version_localizations__delete` — Bir sürümün belirli dildeki mağaza metinlerini siler
- `app_store_version_localizations__get` — Bir sürümün belirli dildeki mağaza metinlerini getirir
- `app_store_version_localizations__search_keywords__add` — Sürümün bir diline arama kelimeleri ekler
- `app_store_version_localizations__search_keywords__list` — Sürümün bir dilindeki arama kelimelerini listeler
- `app_store_version_localizations__search_keywords__remove` — Sürümün bir dilinden arama kelimeleri çıkarır
- `app_store_version_localizations__update` — Bir sürümün belirli dildeki mağaza metinlerini günceller
- `app_store_versions__app_store_review_detail__get` — Sürümün inceleme iletişim ve erişim bilgilerini getirir
- `app_store_versions__app_store_version_localizations__list` — Sürümün farklı dillerdeki mağaza metinlerini listeler
- `app_store_versions__build__get` — Sürüme seçilmiş build'i getirir
- `app_store_versions__build__set` — Sürüm için build seçer
- `app_store_versions__create` — Yeni bir mağaza sürümü oluşturur
- `app_store_versions__delete` — Mağaza sürümünü siler
- `app_store_versions__get` — Mağaza sürümünün bilgilerini getirir
- `app_store_versions__update` — Sürümün numarasını, telif metnini, yayın biçimini ve en erken yayın tarihini günceller
- `apps__search_keywords__list` — Uygulamanın arama kelimelerini listeler
- `listing__diff_metadata` — Yayındaki ve hazırlanan sürümlerin mağaza metinlerini karşılaştırır
- `metadata_ai__apply_localizations` — Hazırlanmış dosyadaki mağaza metinlerini seçilen dillere aynen uygular
- `metadata_ai__audit_localizations` — Mağaza metinlerindeki dil eksiklerini ve uzunluk sorunlarını gösterir
- `metadata_ai__draft_translation` — İstenen diller için mağaza metni taslağı hazırlanmasına yardımcı olur
- `preflight__check_version` — Sürümün incelemeye gönderilmeye hazır olup olmadığını denetler

### `game-center` · 149 araç

**Sunucu:** `ASC-GameCenter` · **Anahtar rolü:** App Manager

**İçinde ne var:** Game Center: başarımlar, sıralama tabloları, etkinlikler, meydan okumalar, gruplar, eşleştirme.

**Ne zaman gerekir:** Başarımlar, sıralama tabloları ve meydan okumalar için.

#### `game-center:achievements` · 20 araç

**İçinde ne var:** Başarımlar: sürümler, diller, görseller, oyuncu adına gönderimler. Görseller ASC-Core'un medya araçlarıyla yüklenir.

**Ne zaman gerekir:** Başarım oluşturmak, metinlerini ve görsellerini hazırlamak için. · **Anahtar rolü:** App Manager

- `apps__game_center_detail__get` — Uygulamanın Game Center kaydını gösterir
- `game_center_achievement_localizations_v2__create` — Başarımın bir sürümüne bir dilde ad ve kazanma öncesi/sonrası açıklamalarını ekler
- `game_center_achievement_localizations_v2__delete` — Bir başarımın bir dildeki metnini siler
- `game_center_achievement_localizations_v2__get` — Bir başarımın bir dildeki metnini gösterir
- `game_center_achievement_localizations_v2__update` — Bir başarımın bir dildeki metnini değiştirir
- `game_center_achievement_versions_v2__create` — Bir başarımın yeni bir sürümünü başlatır
- `game_center_achievement_versions_v2__get` — Bir başarım sürümünün ayrıntılarını gösterir
- `game_center_achievement_versions_v2__localizations__list` — Bir başarım sürümünün tüm dil metinlerini listeler
- `game_center_achievements_v2__create` — Oyuna yeni bir başarım ekler
- `game_center_achievements_v2__delete` — Bir başarımı siler
- `game_center_achievements_v2__get` — Bir başarımın ayrıntılarını gösterir
- `game_center_achievements_v2__update` — Bir başarımın ayarlarını değiştirir
- `game_center_achievements_v2__versions__list` — Bir başarımın tüm sürümlerini listeler
- `game_center_details__game_center_achievements_v2__list` — Uygulamanın tüm başarımlarını listeler
- `game_center_details__game_center_achievements_v2__replace` — Uygulamadaki başarımların sırasını ve listesini baştan belirler
- `game_center_player_achievement_submissions__create` — Bir oyuncu adına başarım ilerlemesi gönderir
- `release__submit_items` — Başarım sürümünü incelemeye gönderir

#### `game-center:activities` · 25 araç

**İçinde ne var:** Etkinlikler: sürümler, diller, görseller ve bağlı başarımlar ile sıralama tabloları. Görseller ASC-Core'un medya araçlarıyla yüklenir.

**Ne zaman gerekir:** Oyuncuların katılabildiği etkinlikler ve bağlı oldukları şeyler için. · **Anahtar rolü:** App Manager

- `apps__game_center_detail__get` — Uygulamanın Game Center kaydını gösterir
- `game_center_activities__achievements_v2__add` — Bir oyun etkinliğine başarımlar bağlar
- `game_center_activities__achievements_v2__remove` — Bir oyun etkinliğinden başarımları ayırır
- `game_center_activities__create` — Oyuna yeni bir etkinlik ekler
- `game_center_activities__delete` — Bir oyun etkinliğini siler
- `game_center_activities__get` — Bir oyun etkinliğinin ayrıntılarını gösterir
- `game_center_activities__leaderboards_v2__add` — Bir oyun etkinliğine sıralama tabloları bağlar
- `game_center_activities__leaderboards_v2__remove` — Bir oyun etkinliğinden sıralama tablolarını ayırır
- `game_center_activities__update` — Bir oyun etkinliğinin ayarlarını değiştirir
- `game_center_activities__versions__list` — Bir oyun etkinliğinin tüm sürümlerini listeler
- `game_center_activity_localizations__create` — Bir etkinliğin bir dildeki metnini ekler
- `game_center_activity_localizations__delete` — Bir etkinliğin bir dildeki metnini siler
- `game_center_activity_localizations__get` — Bir etkinliğin bir dildeki metnini gösterir
- `game_center_activity_localizations__update` — Bir etkinliğin bir dildeki metnini değiştirir
- `game_center_activity_versions__create` — Bir etkinliğin yeni bir sürümünü başlatır
- `game_center_activity_versions__get` — Bir etkinlik sürümünün ayrıntılarını gösterir
- `game_center_activity_versions__localizations__list` — Bir etkinlik sürümünün tüm dil metinlerini listeler
- `game_center_activity_versions__update` — Etkinlik sürümünün yedek bağlantısını (fallback URL) değiştirir
- `game_center_details__game_center_achievements_v2__list` — Uygulamanın tüm başarımlarını listeler
- `game_center_details__game_center_activities__list` — Uygulamanın tüm oyun etkinliklerini listeler
- `game_center_details__game_center_leaderboards_v2__list` — Uygulamanın tüm sıralama tablolarını listeler
- `release__submit_items` — Game Center etkinlik sürümünü incelemeye gönderir

#### `game-center:challenges` · 21 araç

**İçinde ne var:** Meydan okumalar: sürümler, diller, görseller ve kullandıkları sıralama tablosu. Görseller ASC-Core'un medya araçlarıyla yüklenir.

**Ne zaman gerekir:** Oyuncuların birbirine gönderdiği meydan okumalar için. · **Anahtar rolü:** App Manager

- `apps__game_center_detail__get` — Uygulamanın Game Center kaydını gösterir
- `game_center_challenge_localizations__create` — Bir meydan okumanın bir dildeki metnini ekler
- `game_center_challenge_localizations__delete` — Bir meydan okumanın bir dildeki metnini siler
- `game_center_challenge_localizations__get` — Bir meydan okumanın bir dildeki metnini gösterir
- `game_center_challenge_localizations__update` — Bir meydan okumanın bir dildeki metnini değiştirir
- `game_center_challenge_versions__create` — Bir meydan okumanın yeni bir sürümünü başlatır
- `game_center_challenge_versions__get` — Bir meydan okuma sürümünün ayrıntılarını gösterir
- `game_center_challenge_versions__localizations__list` — Bir meydan okuma sürümünün tüm dil metinlerini listeler
- `game_center_challenges__create` — Oyuna yeni bir meydan okuma ekler
- `game_center_challenges__delete` — Bir meydan okumayı siler
- `game_center_challenges__get` — Bir meydan okumanın ayrıntılarını gösterir
- `game_center_challenges__leaderboard_v2__set` — Bir meydan okumayı bir sıralama tablosuna bağlar
- `game_center_challenges__update` — Bir meydan okumanın ayarlarını değiştirir
- `game_center_challenges__versions__list` — Bir meydan okumanın tüm sürümlerini listeler
- `game_center_details__challenges_minimum_platform_versions_0qiwrq` — Meydan okumaların açılacağı en düşük uygulama sürümlerini belirler
- `game_center_details__game_center_challenges__list` — Uygulamanın tüm meydan okumalarını listeler
- `game_center_details__game_center_leaderboards_v2__list` — Uygulamanın tüm sıralama tablolarını listeler
- `release__submit_items` — Meydan okuma sürümünü incelemeye gönderir

#### `game-center:groups` · 18 araç

**İçinde ne var:** Başarım ve sıralama tablolarını uygulamalar arasında paylaşan Game Center grupları.

**Ne zaman gerekir:** Başarım ve sıralama tablolarını birkaç oyununuz arasında paylaşmak için. · **Anahtar rolü:** App Manager

- `game_center_details__game_center_group__get` — Uygulamanın dahil olduğu ortak oyun grubunu gösterir
- `game_center_groups__create` — Birkaç uygulamanın paylaşacağı bir oyun grubu oluşturur
- `game_center_groups__delete` — Bir oyun grubunu siler
- `game_center_groups__game_center_achievements_v2__list` — Bir oyun grubundaki başarımları listeler
- `game_center_groups__game_center_achievements_v2__replace` — Bir oyun grubundaki başarım listesini baştan belirler
- `game_center_groups__game_center_activities__list` — Bir oyun grubundaki etkinlikleri listeler
- `game_center_groups__game_center_challenges__list` — Bir oyun grubundaki meydan okumaları listeler
- `game_center_groups__game_center_details__list` — Bir oyun grubuna katılan uygulamaları listeler
- `game_center_groups__game_center_leaderboard_sets_v2__list` — Bir oyun grubundaki sıralama tablosu setlerini listeler
- `game_center_groups__game_center_leaderboard_sets_v2__replace` — Bir oyun grubundaki sıralama tablosu setlerini baştan belirler
- `game_center_groups__game_center_leaderboards_v2__list` — Bir oyun grubundaki sıralama tablolarını listeler
- `game_center_groups__game_center_leaderboards_v2__replace` — Bir oyun grubundaki sıralama tablolarını baştan belirler
- `game_center_groups__get` — Bir oyun grubunun ayrıntılarını gösterir
- `game_center_groups__list` — Hesaptaki tüm oyun gruplarını listeler
- `game_center_groups__update` — Bir oyun grubunun adını değiştirir

#### `game-center:leaderboards` · 44 araç

**İçinde ne var:** Sıralama tabloları ve setleri: sürümler, diller, görseller, skor gönderimi ve denetimi. Görseller ASC-Core'un medya araçlarıyla yüklenir.

**Ne zaman gerekir:** Sıralama tabloları, setleri ve skorların denetimi için. · **Anahtar rolü:** App Manager

- `apps__game_center_detail__get` — Uygulamanın Game Center kaydını gösterir
- `game_center_details__game_center_leaderboard_sets_v2__list` — Uygulamanın tüm sıralama tablosu setlerini listeler
- `game_center_details__game_center_leaderboard_sets_v2__replace` — Uygulamadaki tablo setlerinin sırasını ve listesini baştan belirler
- `game_center_details__game_center_leaderboards_v2__list` — Uygulamanın tüm sıralama tablolarını listeler
- `game_center_details__game_center_leaderboards_v2__replace` — Uygulamadaki sıralama tablolarının sırasını ve listesini baştan belirler
- `game_center_leaderboard_entry_submissions__create` — Bir oyuncu adına sıralama tablosuna skor gönderir
- `game_center_leaderboard_localizations_v2__create` — Bir sıralama tablosunun bir dildeki metnini ekler
- `game_center_leaderboard_localizations_v2__delete` — Bir sıralama tablosunun bir dildeki metnini siler
- `game_center_leaderboard_localizations_v2__get` — Bir sıralama tablosunun bir dildeki metnini gösterir
- `game_center_leaderboard_localizations_v2__update` — Bir sıralama tablosunun bir dildeki metnini değiştirir
- `game_center_leaderboard_set_localizations_v2__create` — Bir tablo setinin bir dildeki adını ekler
- `game_center_leaderboard_set_localizations_v2__delete` — Bir tablo setinin bir dildeki adını siler
- `game_center_leaderboard_set_localizations_v2__get` — Bir tablo setinin bir dildeki adını gösterir
- `game_center_leaderboard_set_localizations_v2__update` — Bir tablo setinin bir dildeki adını değiştirir
- `game_center_leaderboard_set_member_localizations__create` — Set içindeki bir tablonun o sete özel adını ekler
- `game_center_leaderboard_set_member_localizations__delete` — Set içindeki bir tablonun sete özel adını siler
- `game_center_leaderboard_set_member_localizations__list` — Set içindeki tabloların sete özel adlarını listeler
- `game_center_leaderboard_set_member_localizations__update` — Set içindeki bir tablonun sete özel adını değiştirir
- `game_center_leaderboard_set_versions_v2__create` — Bir tablo setinin yeni bir sürümünü başlatır
- `game_center_leaderboard_set_versions_v2__get` — Bir tablo seti sürümünün ayrıntılarını gösterir
- `game_center_leaderboard_set_versions_v2__localizations__list` — Bir tablo seti sürümünün tüm dil metinlerini listeler
- `game_center_leaderboard_sets_v2__create` — Sıralama tablolarını bir araya toplayan yeni set oluşturur
- `game_center_leaderboard_sets_v2__delete` — Bir sıralama tablosu setini siler
- `game_center_leaderboard_sets_v2__game_center_leaderboards__add` — Bir sete sıralama tabloları ekler
- `game_center_leaderboard_sets_v2__game_center_leaderboards__list` — Bir setteki sıralama tablolarını listeler
- `game_center_leaderboard_sets_v2__game_center_leaderboards_1p2z7u` — Bir setten sıralama tablolarını çıkarır
- `game_center_leaderboard_sets_v2__game_center_leaderboards_0qhppm` — Bir setteki tabloları ve sıralarını baştan belirler
- `game_center_leaderboard_sets_v2__get` — Bir sıralama tablosu setinin ayrıntılarını gösterir
- `game_center_leaderboard_sets_v2__update` — Bir sıralama tablosu setinin adını değiştirir
- `game_center_leaderboard_sets_v2__versions__list` — Bir sıralama tablosu setinin tüm sürümlerini listeler
- `game_center_leaderboard_versions_v2__create` — Bir sıralama tablosunun yeni bir sürümünü başlatır
- `game_center_leaderboard_versions_v2__get` — Bir sıralama tablosu sürümünün ayrıntılarını gösterir
- `game_center_leaderboard_versions_v2__localizations__list` — Bir sıralama tablosu sürümünün tüm dil metinlerini listeler
- `game_center_leaderboards_v2__create` — Oyuna yeni bir sıralama tablosu ekler
- `game_center_leaderboards_v2__delete` — Bir sıralama tablosunu siler
- `game_center_leaderboards_v2__game_center_score_moderations__list` — Bir sıralama tablosundaki skorları denetim için listeler
- `game_center_leaderboards_v2__get` — Bir sıralama tablosunun ayrıntılarını gösterir
- `game_center_leaderboards_v2__update` — Bir sıralama tablosunun ayarlarını değiştirir
- `game_center_leaderboards_v2__versions__list` — Bir sıralama tablosunun tüm sürümlerini listeler
- `game_center_score_moderations__update` — Şüpheli bir skoru gizler ya da yeniden gösterir
- `release__submit_items` — Sıralama tablosu veya set sürümünü incelemeye gönderir

#### `game-center:matchmaking` · 34 araç

**İçinde ne var:** Eşleştirme sıraları, kural setleri, kurallar, takımlar ve kural testleri.

**Ne zaman gerekir:** Eşleştirme sıraları ve oyuncuları eşleştiren kurallar için. · **Anahtar rolü:** App Manager

- `apps__game_center_detail__get` — Uygulamanın Game Center kaydını gösterir
- `game_center_details__classic_matchmaking_requests__metrics` — Klasik eşleştirme isteklerinin sonuç ve bekleme süresi istatistiklerini gösterir
- `game_center_details__rule_based_matchmaking_requests__metrics` — Kurallı eşleştirme isteklerinin sonuç ve bekleme süresi istatistiklerini gösterir
- `game_center_matchmaking_queues__create` — Oyuncu eşleştirme için yeni bir bekleme sırası oluşturur
- `game_center_matchmaking_queues__delete` — Bir eşleştirme sırasını siler
- `game_center_matchmaking_queues__experiment_matchmaking_qu_01763h` — Deneme kuralında sırada bekleyen istek sayısının istatistiklerini gösterir
- `game_center_matchmaking_queues__experiment_matchmaking_re_10te51` — Deneme kuralına gelen eşleşme isteklerinin istatistiklerini gösterir
- `game_center_matchmaking_queues__get` — Bir eşleştirme sırasının ayrıntılarını gösterir
- `game_center_matchmaking_queues__list` — Tüm eşleştirme sıralarını listeler
- `game_center_matchmaking_queues__matchmaking_queue_sizes__metrics` — Sırada bekleyen istek sayısının istatistiklerini gösterir
- `game_center_matchmaking_queues__matchmaking_requests__metrics` — Sıraya gelen eşleşme isteklerinin istatistiklerini gösterir
- `game_center_matchmaking_queues__matchmaking_sessions__metrics` — Eşleştirme oturumlarının sayı ve oyuncu istatistiklerini gösterir
- `game_center_matchmaking_queues__update` — Bir eşleştirme sırasının ayarlarını değiştirir
- `game_center_matchmaking_rule_set_tests__create` — Eşleştirme kurallarını örnek oyuncu istekleriyle dener
- `game_center_matchmaking_rule_sets__create` — Yeni bir eşleştirme kuralları seti oluşturur
- `game_center_matchmaking_rule_sets__delete` — Bir eşleştirme kuralları setini siler
- `game_center_matchmaking_rule_sets__get` — Bir eşleştirme kuralları setinin ayrıntılarını gösterir
- `game_center_matchmaking_rule_sets__list` — Tüm eşleştirme kuralları setlerini listeler
- `game_center_matchmaking_rule_sets__matchmaking_queues__list` — Bir kural setini kullanan eşleştirme sıralarını listeler
- `game_center_matchmaking_rule_sets__rules__list` — Bir kural setindeki kuralları listeler
- `game_center_matchmaking_rule_sets__teams__list` — Bir kural setindeki takımları listeler
- `game_center_matchmaking_rule_sets__update` — Bir eşleştirme kuralları setini değiştirir
- `game_center_matchmaking_rules__create` — Kural setine yeni bir eşleştirme kuralı ekler
- `game_center_matchmaking_rules__delete` — Bir eşleştirme kuralını siler
- `game_center_matchmaking_rules__matchmaking_boolean_rule_r_1yg7b0` — Evet/hayır türü kuralın sonuç istatistiklerini gösterir
- `game_center_matchmaking_rules__matchmaking_number_rule_re_1u0ixh` — Sayı üreten kuralın sonuç istatistiklerini gösterir
- `game_center_matchmaking_rules__matchmaking_rule_errors__metrics` — Bir kuralın hata sayısı istatistiklerini gösterir
- `game_center_matchmaking_rules__update` — Bir eşleştirme kuralını değiştirir
- `game_center_matchmaking_teams__create` — Kural setine yeni bir takım ekler
- `game_center_matchmaking_teams__delete` — Bir eşleştirme takımını siler
- `game_center_matchmaking_teams__update` — Bir eşleştirme takımının ayarlarını değiştirir

#### `game-center:setup` · 18 araç

**İçinde ne var:** Bir uygulamada Game Center'ı açmak: Game Center kaydı, uygulama sürümleri, engellenen oyuncular.

**Ne zaman gerekir:** Bir uygulamada ve sürümlerinde Game Center'ı açmak için. · **Anahtar rolü:** App Manager

- `app_store_versions__game_center_app_version__get` — Bir uygulama sürümüne bağlı oyun ayarlarını gösterir
- `apps__game_center_detail__get` — Uygulamanın Game Center kaydını gösterir
- `game_center_app_versions__app_store_version__get` — Oyun ayarı sürümünün hangi uygulama sürümüne bağlı olduğunu gösterir
- `game_center_app_versions__compatibility_versions__add` — Birlikte oynanabilecek eski uygulama sürümlerini ekler
- `game_center_app_versions__compatibility_versions__list` — Birlikte oynanabilen uygulama sürümlerini listeler
- `game_center_app_versions__compatibility_versions__remove` — Birlikte oynanabilen sürümlerden birini çıkarır
- `game_center_app_versions__create` — Bir uygulama sürümü için oyun ayarı sürümü oluşturur
- `game_center_app_versions__get` — Oyun ayarı sürümünün ayrıntılarını gösterir
- `game_center_app_versions__update` — Oyun ayarı sürümünü açar ya da kapatır
- `game_center_detail_players__update` — Bir oyuncuyu engeller ya da engelini kaldırır
- `game_center_details__blocked_players__list` — Engellenmiş oyuncuları listeler
- `game_center_details__create` — Uygulama için Game Center'ı etkinleştirir
- `game_center_details__game_center_app_versions__list` — Uygulamanın oyun ayarı sürümlerini listeler
- `game_center_details__get` — Uygulamanın oyun ayarlarının ayrıntılarını gösterir
- `game_center_details__update` — Meydan okumaları açıp kapatır, varsayılan sıralama tablosunu ve oyun grubunu seçer

### `general` · 49 araç

**Sunucu:** `ASC-General` · **Anahtar rolü:** App Manager

**İçinde ne var:** Uygulamanın kimliği ve mağaza bilgileri: ad ve alt başlık, kategoriler, ülkelere göre satış, yaş sınırı, lisans sözleşmesi, erişilebilirlik etiketleri, etiketler.

**Ne zaman gerekir:** Ad, kategori, yaş sınırı ve uygulamanın satıldığı ülkeler için.

#### `general:android-link` · 8 araç

**İçinde ne var:** Geçiş için bir Android uygulamasını iOS karşılığıyla eşleme.

**Ne zaman gerekir:** iPhone'a geçenlerin bu uygulamayı bulması için Android uygulamanızı bağlamak için. · **Anahtar rolü:** App Manager

- `android_to_ios_app_mapping_details__create` — Android ve iOS uygulaması arasında eşleme kaydı oluşturur
- `android_to_ios_app_mapping_details__delete` — Android ve iOS uygulama eşleme kaydını siler
- `android_to_ios_app_mapping_details__get` — Android ve iOS uygulama eşleme kaydının ayrıntılarını getirir
- `android_to_ios_app_mapping_details__update` — Android ve iOS uygulama eşleme kaydını günceller
- `apps__android_to_ios_app_mapping_details__list` — Uygulamaya bağlı Android ve iOS eşleme kayıtlarını listeler

#### `general:app-accessibility` · 8 araç

**İçinde ne var:** Erişilebilirlik etiketleri: uygulamanın cihaz başına desteklediği özellikler.

**Ne zaman gerekir:** Uygulamanızın cihaz başına desteklediği erişilebilirlik özellikleri için. · **Anahtar rolü:** App Manager

- `accessibility_declarations__create` — Bir cihaz türü için desteklenen erişilebilirlik özelliklerini beyan eder
- `accessibility_declarations__delete` — Uygulamaya ait bir erişilebilirlik beyanını siler
- `accessibility_declarations__get` — Bir erişilebilirlik beyanının ayrıntılarını getirir
- `accessibility_declarations__update` — Desteklenen erişilebilirlik özelliklerini günceller veya beyanı mağazada yayımlar
- `apps__accessibility_declarations__list` — Uygulamaya ait tüm erişilebilirlik beyanlarını listeler

#### `general:app-availabilities` · 10 araç

**İçinde ne var:** Uygulamanın satıldığı ülkeler, ön siparişler, ülke bazında satış durumu.

**Ne zaman gerekir:** Uygulamanızın satıldığı ülkeler ve ön siparişler için. · **Anahtar rolü:** App Manager

- `app_availabilities_v2__create` — Uygulamanın sunulacağı ülkeleri belirleyen kullanılabilirlik planı oluşturur
- `app_availabilities_v2__get` — Uygulamanın ülke kullanılabilirlik planının ayrıntılarını getirir
- `app_availabilities_v2__territory_availabilities__list` — Uygulamanın ülke bazlı satış ve dağıtım durumlarını listeler
- `apps__app_availability_v2__get` — Uygulamanın güncel ülke kullanılabilirlik yapılandırmasını getirir
- `end_app_availability_pre_orders__create` — Ön siparişi bitirir ve uygulamayı o ülkelerde hemen satışa çıkarır
- `territories__list` — App Store'un desteklediği tüm ülke ve bölgeleri listeler
- `territory_availabilities__update` — Uygulamanın belirli bir ülkedeki satış ve ön sipariş ayarlarını günceller

#### `general:app-categories` · 15 araç

**İçinde ne var:** Birincil ve ikincil kategoriler ile alt kategoriler.

**Ne zaman gerekir:** Uygulamanızın listelendiği kategori ve alt kategori için. · **Anahtar rolü:** App Manager

- `app_categories__get` — Bir uygulama kategorisinin ayrıntılarını getirir
- `app_categories__list` — App Store'daki uygulama kategorilerini listeler
- `app_categories__parent__get` — Seçilen alt kategorinin bağlı olduğu ana kategoriyi getirir
- `app_categories__subcategories__list` — Bir ana kategoriye ait tüm alt kategorileri listeler
- `app_infos__primary_category__get` — Uygulamanın seçilmiş birincil ana kategorisini getirir
- `app_infos__primary_subcategory_one__get` — Uygulamanın birincil kategorisine ait ilk alt kategoriyi getirir
- `app_infos__primary_subcategory_two__get` — Uygulamanın birincil kategorisine ait ikinci alt kategoriyi getirir
- `app_infos__secondary_category__get` — Uygulamanın seçilmiş ikincil ana kategorisini getirir
- `app_infos__secondary_subcategory_one__get` — Uygulamanın ikincil kategorisine ait ilk alt kategoriyi getirir
- `app_infos__secondary_subcategory_two__get` — Uygulamanın ikincil kategorisine ait ikinci alt kategoriyi getirir
- `app_infos__update` — Uygulamanın birincil ve ikincil kategori seçimlerini günceller
- `apps__app_infos__list` — Uygulamanın yayındaki ve hazırlanan uygulama bilgisi kayıtlarını listeler

#### `general:app-information` · 11 araç

**İçinde ne var:** Uygulama bilgileri ve dilleri: ad, alt başlık, gizlilik politikası bağlantısı.

**Ne zaman gerekir:** Her dilde uygulama adı, alt başlığı ve gizlilik politikası bağlantısı için. · **Anahtar rolü:** App Manager

- `app_info_localizations__create` — Bir dil için uygulama adı, alt başlık ve gizlilik metinlerini ekler
- `app_info_localizations__delete` — Uygulamanın bir dildeki ad, alt başlık ve gizlilik metinlerini siler
- `app_info_localizations__get` — Uygulamanın bir dildeki ad, alt başlık ve gizlilik metinlerini getirir
- `app_info_localizations__update` — Uygulamanın bir dildeki ad, alt başlık ve gizlilik metinlerini günceller
- `app_infos__app_info_localizations__list` — Uygulama adı ve alt başlığının tüm dillerdeki kayıtlarını listeler
- `app_infos__get` — Uygulama bilgileri kaydını (durum, kategori, yaş sınırı bağlantıları) getirir
- `apps__app_infos__list` — Uygulamanın yayındaki ve hazırlanan uygulama bilgisi kayıtlarını listeler
- `apps__update` — Uygulamanın ana dilini, içerik hakları beyanını, abonelik bildirim adreslerini ve erişilebilirlik bağlantısını günceller

#### `general:app-tags` · 6 araç

**İçinde ne var:** Apple'ın uygulamaya verdiği etiketler ve uymayanları gizleme.

**Ne zaman gerekir:** App Store'un uygulamanıza verdiği etiketleri görmek ve uymayanları gizlemek için. · **Anahtar rolü:** App Manager

- `app_tags__territories__list` — Uygulama etiketinin geçerli olduğu ülkeleri listeler
- `app_tags__update` — Uygulama etiketinin mağazada görünürlük durumunu günceller
- `apps__app_tags__list` — Uygulamaya atanmış etiketleri listeler

#### `general:legal` · 13 araç

**İçinde ne var:** Yaş sınırı beyanı ve son kullanıcı lisans sözleşmesi.

**Ne zaman gerekir:** Yaş sınırı anketi ve lisans sözleşmeniz için. · **Anahtar rolü:** App Manager

- `age_rating_declarations__update` — Uygulamanın yaş sınırı ve içerik anketi beyanını günceller
- `app_infos__age_rating_declaration__get` — Uygulamanın yaş sınırı anketi cevaplarını getirir
- `app_infos__territory_age_ratings__list` — Uygulamanın ülkelere göre belirlenmiş resmi yaş sınırlarını listeler
- `apps__app_infos__list` — Uygulamanın yayındaki ve hazırlanan uygulama bilgisi kayıtlarını listeler
- `apps__end_user_license_agreement__get` — Uygulamaya atanmış özel son kullanıcı lisans sözleşmesini getirir
- `end_user_license_agreements__create` — Uygulama için özel bir son kullanıcı lisans sözleşmesi oluşturur
- `end_user_license_agreements__delete` — Uygulamanın özel son kullanıcı lisans sözleşmesini siler
- `end_user_license_agreements__get` — Özel son kullanıcı lisans sözleşmesinin metnini ve ayrıntılarını getirir
- `end_user_license_agreements__territories__list` — Özel lisans sözleşmesinin geçerli olduğu ülkeleri listeler
- `end_user_license_agreements__update` — Özel lisans sözleşmesi metnini veya geçerli ülkelerini günceller

### `marketing` · 61 araç

**Sunucu:** `ASC-Marketing` · **Anahtar rolü:** Marketing

**İçinde ne var:** Sürüm sayfasının ötesindeki mağaza varlığı: özel ürün sayfaları, ürün sayfası testleri, uygulama içi etkinlikler, kullanıcı yorumları, öne çıkarılma başvuruları.

**Ne zaman gerekir:** Ürün sayfaları, uygulama içi etkinlikler, A/B testleri ve kullanıcı yorumları için.

#### `marketing:app-events` · 14 araç

**İçinde ne var:** Uygulama içi etkinlikler ve dilleri. Görseller ve videolar ASC-Core'daki medya araçlarıyla yönetilir.

**Ne zaman gerekir:** Uygulama içi etkinlikler ve her dildeki metinleri için. · **Anahtar rolü:** Marketing

- `app_event_localizations__create` — Etkinliğe seçilen dilde ad ve açıklama ekler
- `app_event_localizations__delete` — Etkinliğin seçilen dildeki metinlerini siler
- `app_event_localizations__get` — Etkinliğin seçilen dildeki metinlerini gösterir
- `app_event_localizations__update` — Etkinliğin seçilen dildeki adını ve açıklamalarını değiştirir
- `app_events__create` — App Store'da gösterilecek uygulama içi etkinlik oluşturur
- `app_events__delete` — Uygulama içi etkinliği siler
- `app_events__get` — Uygulama içi etkinliğin bilgilerini gösterir
- `app_events__localizations__list` — Etkinliğin farklı dillerdeki metinlerini listeler
- `app_events__update` — Etkinliğin tarihlerini, ülkelerini ve tanıtım bilgilerini değiştirir
- `apps__app_events__list` — Uygulamanın etkinliklerini listeler
- `release__submit_items` — Uygulama içi etkinliği incelemeye gönderir

#### `marketing:custom-pp` · 21 araç

**İçinde ne var:** Özel ürün sayfaları: sürümler, diller, anahtar kelimeler. Ekran görüntüleri ve önizlemeler ASC-Core'daki medya araçlarıyla yönetilir.

**Ne zaman gerekir:** Reklamlar ve bağlantılar için ürün sayfanızın ek sürümleri. · **Anahtar rolü:** Marketing

- `app_custom_product_page_localizations__create` — Özel ürün sayfasına seçilen dilde tanıtım metni ekler
- `app_custom_product_page_localizations__delete` — Özel ürün sayfasının seçilen dildeki kaydını siler
- `app_custom_product_page_localizations__get` — Özel ürün sayfasının seçilen dildeki bilgilerini gösterir
- `app_custom_product_page_localizations__search_keywords__add` — Özel ürün sayfasının seçilen diline arama kelimeleri bağlar
- `app_custom_product_page_localizations__search_keywords__list` — Özel ürün sayfasının seçilen diline bağlı arama kelimelerini listeler
- `app_custom_product_page_localizations__search_keywords__remove` — Arama kelimelerinin özel ürün sayfasının seçilen diliyle bağlantısını kaldırır
- `app_custom_product_page_localizations__update` — Özel ürün sayfasının seçilen dildeki tanıtım metnini değiştirir
- `app_custom_product_page_versions__app_custom_product_page_065izt` — Özel ürün sayfası sürümünün farklı dillerdeki kayıtlarını listeler
- `app_custom_product_page_versions__create` — Özel ürün sayfasının yeni sürümünü oluşturur
- `app_custom_product_page_versions__get` — Özel ürün sayfası sürümünün bilgilerini gösterir
- `app_custom_product_page_versions__update` — Özel ürün sayfasından açılacak uygulama bağlantısını değiştirir
- `app_custom_product_pages__app_custom_product_page_versions__list` — Özel ürün sayfasının sürümlerini listeler
- `app_custom_product_pages__create` — Uygulama için özel ürün sayfası oluşturur
- `app_custom_product_pages__delete` — Özel ürün sayfasını siler
- `app_custom_product_pages__get` — Özel ürün sayfasının bilgilerini gösterir
- `app_custom_product_pages__update` — Özel ürün sayfasının adını ve görünürlüğünü değiştirir
- `apps__app_custom_product_pages__list` — Uygulamanın özel ürün sayfalarını listeler
- `release__submit_items` — Özel ürün sayfası sürümünü incelemeye gönderir

#### `marketing:customer-reviews` · 14 araç

**İçinde ne var:** Kullanıcı yorumları, yanıtlar, özetler ve yapay zekâ ile sınıflama ve yanıt taslağı araçları.

**Ne zaman gerekir:** Yorumları okumak, yanıt taslağı hazırlamak ve yanıt göndermek için. · **Anahtar rolü:** Customer Support

- `app_store_versions__customer_reviews__list` — Uygulamanın belirli sürümüne yazılan kullanıcı yorumlarını listeler
- `apps__customer_review_summarizations__list` — Apple'ın hazırladığı kullanıcı yorumu özetlerini listeler
- `apps__customer_reviews__list` — Uygulamaya yazılan kullanıcı yorumlarını listeler
- `customer_review_responses__create` — Kullanıcı yorumuna yanıt gönderir
- `customer_review_responses__delete` — Kullanıcı yorumuna verilen yanıtı siler
- `customer_review_responses__get` — Kullanıcı yorumuna verilen yanıtın bilgilerini gösterir
- `customer_reviews__get` — Bir kullanıcı yorumunun ayrıntılarını gösterir
- `customer_reviews__response__get` — Kullanıcı yorumuna verilen yanıtı gösterir
- `reviews_ai__daily_briefing` — Son yorumları ve puan değişimini özetlenmek üzere hazırlar
- `reviews_ai__draft_response` — Bir kullanıcı yorumunu yanıt taslağı hazırlanması için getirir
- `reviews_ai__triage` — Son yorumları konularına ayrılmak üzere hazırlar

#### `marketing:nominations` · 8 araç

**İçinde ne var:** Apple'a editoryal öne çıkarma için gönderilen başvurular.

**Ne zaman gerekir:** Apple'dan bir uygulamayı ya da etkinliği öne çıkarmasını istemek için. · **Anahtar rolü:** Marketing

- `nominations__create` — App Store'da öne çıkarılma başvurusu oluşturur; istenirse hemen gönderir
- `nominations__delete` — App Store'da öne çıkarılma başvurusunu siler
- `nominations__get` — App Store'da öne çıkarılma başvurusunun bilgilerini gösterir
- `nominations__list` — App Store'da öne çıkarılma başvurularını listeler
- `nominations__update` — Öne çıkarılma başvurusunu düzenler, gönderir veya arşivler

#### `marketing:pp-optimization` · 20 araç

**İçinde ne var:** Ürün sayfası testleri: deneyler, seçenekler ve dilleri, kazanan seçeneği yayına alma.

**Ne zaman gerekir:** Ürün sayfanızın simgesini, ekran görüntülerini ve önizlemelerini A/B testiyle denemek için. · **Anahtar rolü:** Marketing

- `app_store_version_experiment_treatment_localizations__create` — Ürün sayfası testindeki seçeneğe dil ekler
- `app_store_version_experiment_treatment_localizations__delete` — Ürün sayfası testindeki seçeneğin dil kaydını siler
- `app_store_version_experiment_treatment_localizations__get` — Ürün sayfası testindeki seçeneğin dil kaydını gösterir
- `app_store_version_experiment_treatments__app_store_versio_0qaej7` — Ürün sayfası testindeki seçeneğin dil kayıtlarını listeler
- `app_store_version_experiment_treatments__create` — Ürün sayfası testi için yeni seçenek oluşturur
- `app_store_version_experiment_treatments__delete` — Ürün sayfası testindeki seçeneği siler
- `app_store_version_experiment_treatments__get` — Ürün sayfası testindeki seçeneğin bilgilerini gösterir
- `app_store_version_experiment_treatments__update` — Ürün sayfası testindeki seçeneğin adını ve simgesini değiştirir
- `app_store_version_experiments_v2__app_store_version_exper_0b7r4g` — Ürün sayfası testinin seçeneklerini listeler
- `app_store_version_experiments_v2__create` — Mağaza sayfasının farklı seçeneklerini karşılaştıran deneme oluşturur
- `app_store_version_experiments_v2__delete` — Ürün sayfası testini siler
- `app_store_version_experiments_v2__get` — Ürün sayfası testinin bilgilerini gösterir
- `app_store_version_experiments_v2__update` — Ürün sayfası testinin ayarlarını ve çalışıp çalışmadığını değiştirir
- `app_store_version_promotions__create` — Ürün sayfası testinde seçilen seçeneği sürümün asıl sayfası yapar
- `app_store_versions__app_store_version_experiments_v2__list` — Uygulama sürümüne bağlı ürün sayfası testlerini listeler
- `apps__app_store_version_experiments_v2__list` — Uygulamanın ürün sayfası testlerini listeler
- `release__submit_items` — Ürün sayfası testini incelemeye gönderir

### `monetization` · 152 araç

**Sunucu:** `ASC-Monetization` · **Anahtar rolü:** App Manager

**İçinde ne var:** Para: abonelikler, uygulama içi satın almalar, teklifler ve kodlar, uygulama fiyatı, StoreKit 2 işlemleri.

**Ne zaman gerekir:** Abonelikler, uygulama içi satın almalar, teklifler ve fiyatlar için.

#### `monetization:app-price` · 14 araç

**İçinde ne var:** Uygulamanın kendi fiyat takvimi ve fiyat noktaları (uygulama içi satın almalar değil).

**Ne zaman gerekir:** Uygulamanın kendisinin ülke ülke fiyatı için. · **Anahtar rolü:** App Manager

- `app_price_points_v3__equalizations__list` — Uygulama fiyatının diğer ülkelerdeki karşılıklarını listeler
- `app_price_points_v3__get` — Uygulama için seçilebilir bir fiyatın ayrıntılarını gösterir
- `app_price_schedules__automatic_prices__list` — Apple'ın ülkelere göre belirlediği uygulama fiyatlarını listeler
- `app_price_schedules__base_territory__get` — Uygulama fiyatlarına temel alınan ülkeyi gösterir
- `app_price_schedules__create` — Uygulamanın ülkelere ve tarihlere göre fiyatlarını belirler
- `app_price_schedules__get` — Uygulamanın fiyat takvimi bilgilerini gösterir
- `app_price_schedules__manual_prices__list` — Elle belirlenen uygulama fiyatlarını listeler
- `apps__app_price_points__list` — Uygulama için seçilebilecek fiyatları listeler
- `apps__app_price_schedule__get` — Uygulamanın fiyat takvimini gösterir
- `pricing__equalize_price` — Bir ülkenin fiyatını temel alıp uygulama, ürün ya da aboneliğin diğer ülke fiyatlarını Apple'a hesaplatır
- `pricing__get_app_price` — Uygulamanın ülkelere göre güncel ve planlanmış fiyatlarını gösterir

#### `monetization:iap-offers` · 18 araç

**İçinde ne var:** Uygulama içi satın almalar için teklif kodları: özel ve tek kullanımlık kodlar.

**Ne zaman gerekir:** Uygulama içi satın almalar için teklif kodları. · **Anahtar rolü:** App Manager

- `in_app_purchase_offer_code_custom_codes__create` — Ürün teklifi için seçtiğiniz metinden kullanım kodu oluşturur
- `in_app_purchase_offer_code_custom_codes__get` — Ürün teklifinin özel kullanım koduna ait bilgileri gösterir
- `in_app_purchase_offer_code_custom_codes__update` — Ürün teklifinin özel kullanım kodunun durumunu değiştirir
- `in_app_purchase_offer_code_one_time_use_codes__create` — Ürün teklifi için tek kullanımlık kod grubu oluşturur
- `in_app_purchase_offer_code_one_time_use_codes__get` — Ürün teklifinin tek kullanımlık kod grubuna ait bilgileri gösterir
- `in_app_purchase_offer_code_one_time_use_codes__update` — Ürün teklifinin tek kullanımlık kod grubunun kullanım durumunu değiştirir
- `in_app_purchase_offer_code_one_time_use_codes__values__get` — Ürün teklifinin tek kullanımlık kodlarını dosya olarak getirir
- `in_app_purchase_offer_codes__create` — Ürün için kodla kullanılabilen teklif oluşturur
- `in_app_purchase_offer_codes__custom_codes__list` — Ürün teklifinin özel kullanım kodlarını listeler
- `in_app_purchase_offer_codes__get` — Ürünün kodla kullanılabilen teklifinin ayrıntılarını gösterir
- `in_app_purchase_offer_codes__one_time_use_codes__list` — Ürün teklifinin tek kullanımlık kod gruplarını listeler
- `in_app_purchase_offer_codes__prices__list` — Kodla kullanılabilen ürün teklifinin ülkelere göre fiyatlarını listeler
- `in_app_purchase_offer_codes__update` — Ürünün kodlu teklifini etkinleştirir ya da durdurur
- `in_app_purchases_v2__offer_codes__list` — Ürünün kodla kullanılabilen tekliflerini listeler
- `in_app_purchases_v2__price_points__list` — Ürün için seçilebilecek fiyatları listeler

#### `monetization:in-app-purchases` · 34 araç

**İçinde ne var:** Uygulama içi satın almalar: diller, görseller, sürümler, satış ülkeleri, fiyatlar, gönderim ve fiyat makroları. Görseller ASC-Core'un medya araçlarıyla yüklenir.

**Ne zaman gerekir:** Uygulama içi satın almalar, metinleri, görselleri, fiyatları ve incelemesi için. · **Anahtar rolü:** App Manager

- `in_app_purchase_app_store_review_screenshots__update` — Yüklenen inceleme ekran görüntüsünü tamamlandı olarak işaretler
- `in_app_purchase_availabilities__available_territories__list` — Ürünün satışa açık olduğu ülkeleri listeler
- `in_app_purchase_availabilities__create` — Ürünün satışa açılacağı ülkeleri belirler
- `in_app_purchase_availabilities__get` — Ürünün satışa açıklık ayarlarını gösterir
- `in_app_purchase_localizations_v2__create` — Ürün sürümüne seçilen dilde ad ve açıklama ekler
- `in_app_purchase_localizations_v2__delete` — Ürün sürümünün seçilen dildeki metinlerini siler
- `in_app_purchase_localizations_v2__get` — Ürün sürümünün seçilen dildeki metinlerini gösterir
- `in_app_purchase_localizations_v2__update` — Ürün sürümünün seçilen dildeki adını ve açıklamasını değiştirir
- `in_app_purchase_price_points__equalizations__list` — Ürün fiyatının diğer ülkelerdeki karşılıklarını listeler
- `in_app_purchase_price_schedules__automatic_prices__list` — Apple'ın ülkelere göre belirlediği ürün fiyatlarını listeler
- `in_app_purchase_price_schedules__base_territory__get` — Ürün fiyatlarına temel alınan ülkeyi gösterir
- `in_app_purchase_price_schedules__create` — Ürünün ülkelere ve tarihlere göre fiyatlarını belirler
- `in_app_purchase_price_schedules__get` — Ürünün fiyat takvimi bilgilerini gösterir
- `in_app_purchase_price_schedules__manual_prices__list` — Elle belirlenen ürün fiyatlarını listeler
- `in_app_purchase_versions__create` — Uygulama içi ürün için yeni sürüm oluşturur
- `in_app_purchase_versions__get` — Ürün sürümünün numarasını ve inceleme durumunu gösterir
- `in_app_purchase_versions__image__get` — Ürün sürümünün görselini gösterir
- `in_app_purchase_versions__localizations__list` — Ürün sürümünün farklı dillerdeki metinlerini listeler
- `in_app_purchases_v2__content__get` — Ürüne ait indirilebilir dosyanın bilgilerini ve bağlantısını gösterir
- `in_app_purchases_v2__create` — Uygulama içinde satılacak ürün oluşturur
- `in_app_purchases_v2__delete` — Uygulama içi ürünü siler
- `in_app_purchases_v2__get` — Uygulama içinde satılan ürünün bilgilerini gösterir
- `in_app_purchases_v2__iap_price_schedule__get` — Ürünün fiyat takvimini gösterir
- `in_app_purchases_v2__in_app_purchase_availability__get` — Ürünün satışa açıklık ayarlarını gösterir
- `in_app_purchases_v2__price_points__list` — Ürün için seçilebilecek fiyatları listeler
- `in_app_purchases_v2__update` — Ürünün adını, inceleme notunu ve aileyle paylaşımını değiştirir
- `in_app_purchases_v2__versions__list` — Ürünün sürümlerini listeler
- `pricing__equalize_price` — Bir ülkenin fiyatını temel alıp uygulama, ürün ya da aboneliğin diğer ülke fiyatlarını Apple'a hesaplatır
- `pricing__get_iap_price` — Ürünün ülkelere göre güncel ve planlanmış fiyatlarını gösterir
- `pricing__set_iap_price` — Ürünün seçilen ülkedeki fiyatını değiştirir; temel ülke değişirse diğer ülkelerin otomatik fiyatları da değişir
- `release__submit_items` — Uygulama içi ürün sürümünü incelemeye gönderir

#### `monetization:plan-promote` · 12 araç

**İçinde ne var:** Tanıtılan satın almalar: mağaza sayfasının hangi abonelik ve ürünleri gösterdiği.

**Ne zaman gerekir:** Ürün sayfanızın hangi satın almaları tanıttığı için. · **Anahtar rolü:** App Manager

- `apps__promoted_purchases__list` — App Store'da tanıtılan uygulama içi ürünleri ve abonelikleri listeler
- `apps__promoted_purchases__replace` — App Store'da tanıtılan ürünlerin listesini ve sırasını değiştirir
- `in_app_purchases_v2__promoted_purchase__get` — Ürünün App Store'daki tanıtım ayarlarını gösterir
- `promoted_purchases__create` — Ürün veya abonelik için App Store tanıtımı oluşturur
- `promoted_purchases__delete` — Ürünün veya aboneliğin App Store tanıtımını siler
- `promoted_purchases__get` — Ürünün veya aboneliğin App Store tanıtım bilgilerini gösterir
- `promoted_purchases__update` — Ürünün veya aboneliğin App Store'daki tanıtım görünürlüğünü değiştirir
- `subscription_groups__subscriptions__list` — Bir gruptaki abonelikleri listeler
- `subscriptions__promoted_purchase__get` — Aboneliğin App Store'daki tanıtım ayarlarını gösterir

#### `monetization:subscription` · 52 araç

**İçinde ne var:** Abonelikler ve grupları: diller, görseller, sürümler, fiyatlar, satış ülkeleri, ödeme aksadığında süre tanıma, gönderim, fiyat ve ön kontrol makroları. Görseller ASC-Core'un medya araçlarıyla yüklenir.

**Ne zaman gerekir:** Abonelikler ve grupları, metinleri, fiyatları ve incelemesi için. · **Anahtar rolü:** App Manager

- `apps__subscription_grace_period__get` — Uygulamanın ödeme aksadığında aboneliği sürdürme ayarlarını gösterir
- `subscription_app_store_review_screenshots__update` — Yüklenen abonelik inceleme ekran görüntüsünü tamamlandı olarak işaretler
- `subscription_grace_periods__get` — Ödeme aksadığında aboneliğin ne kadar sürdürüleceğini gösterir
- `subscription_grace_periods__update` — Ödeme aksadığında aboneliğin sürdürülmesini ve süresini ayarlar
- `subscription_group_localizations_v2__create` — Abonelik grubu sürümüne seçilen dilde ad ekler
- `subscription_group_localizations_v2__delete` — Abonelik grubu sürümünün seçilen dildeki kaydını siler
- `subscription_group_localizations_v2__get` — Abonelik grubu sürümünün seçilen dildeki adlarını gösterir
- `subscription_group_localizations_v2__update` — Abonelik grubu sürümünün seçilen dildeki adlarını değiştirir
- `subscription_group_versions__create` — Abonelik grubu için yeni sürüm oluşturur
- `subscription_group_versions__get` — Abonelik grubu sürümünün numarasını ve inceleme durumunu gösterir
- `subscription_group_versions__localizations__list` — Abonelik grubu sürümünün farklı dillerdeki adlarını listeler
- `subscription_groups__create` — Uygulamada yeni abonelik grubu oluşturur
- `subscription_groups__delete` — Abonelik grubunu siler
- `subscription_groups__get` — Abonelik grubunun bilgilerini gösterir
- `subscription_groups__subscriptions__list` — Bir gruptaki abonelikleri listeler
- `subscription_groups__update` — Abonelik grubunun yönetimde kullanılan adını değiştirir
- `subscription_groups__versions__list` — Abonelik grubunun sürümlerini listeler
- `subscription_localizations_v2__create` — Abonelik sürümüne seçilen dilde ad ve açıklama ekler
- `subscription_localizations_v2__delete` — Abonelik sürümünün seçilen dildeki metinlerini siler
- `subscription_localizations_v2__get` — Abonelik sürümünün seçilen dildeki metinlerini gösterir
- `subscription_localizations_v2__update` — Abonelik sürümünün seçilen dildeki adını ve açıklamasını değiştirir
- `subscription_plan_availabilities__available_territories__list` — Aboneliğin seçilen ödeme biçimiyle satıldığı ülkeleri listeler
- `subscription_plan_availabilities__available_territories__replace` — Aboneliğin seçilen ödeme biçimiyle satıldığı ülkelerin listesini değiştirir
- `subscription_plan_availabilities__create` — Aboneliğin belirli ödeme biçimiyle satılacağı ülkeleri belirler
- `subscription_plan_availabilities__get` — Aboneliğin belirli ödeme biçimine ait satışa açıklık ayarlarını gösterir
- `subscription_plan_availabilities__update` — Aboneliğin ödeme planı için satış ülkelerini ve yeni ülkelere otomatik açılmasını değiştirir
- `subscription_price_points__adjusted_equalizations__list` — Abonelik fiyatının ödeme biçimine uyarlanmış ülke karşılıklarını listeler
- `subscription_price_points__equalizations__list` — Abonelik fiyatının diğer ülkelerdeki karşılıklarını listeler
- `subscription_price_points__get` — Abonelik için seçilebilir bir fiyatın ayrıntılarını gösterir
- `subscription_prices__create` — Abonelik için ülkeye ve başlangıç tarihine göre fiyat belirler
- `subscription_prices__delete` — Aboneliğin planlanmış fiyat değişikliğini siler
- `subscription_versions__create` — Abonelik için yeni sürüm oluşturur
- `subscription_versions__get` — Abonelik sürümünün numarasını ve inceleme durumunu gösterir
- `subscription_versions__image__get` — Abonelik sürümünün görselini gösterir
- `subscription_versions__localizations__list` — Abonelik sürümünün farklı dillerdeki metinlerini listeler
- `subscriptions__create` — Bir grupta yeni abonelik oluşturur
- `subscriptions__delete` — Aboneliği siler
- `subscriptions__get` — Aboneliğin bilgilerini gösterir
- `subscriptions__plan_availabilities__list` — Aboneliğin ödeme biçimlerine göre satışa açıklık ayarlarını listeler
- `subscriptions__price_points__list` — Abonelik için seçilebilecek fiyatları listeler
- `subscriptions__prices__list` — Aboneliğin ülkelere göre fiyat kayıtlarını listeler
- `subscriptions__prices__remove` — Aboneliğin seçilen planlanmış fiyat değişikliklerini kaldırır
- `subscriptions__update` — Aboneliğin bilgilerini, fiyatlarını ve tekliflerini değiştirir
- `subscriptions__versions__list` — Aboneliğin sürümlerini listeler
- `preflight__check_subscription` — Abonelik veya grubundaki inceleme öncesi eksikleri kontrol eder
- `pricing__equalize_price` — Bir ülkenin fiyatını temel alıp uygulama, ürün ya da aboneliğin diğer ülke fiyatlarını Apple'a hesaplatır
- `pricing__get_subscription_price` — Bir aboneliğin ülkelere göre güncel fiyatlarını ve planlanmış değişikliklerini gösterir
- `pricing__set_subscription_price` — Aboneliğin seçilen ülkedeki fiyatını belirler veya değiştirir
- `release__submit_items` — Abonelik veya abonelik grubu sürümünü incelemeye gönderir

#### `monetization:subscription-codes` · 19 araç

**İçinde ne var:** Abonelik teklif kodları: özel ve tek kullanımlık kodlar.

**Ne zaman gerekir:** Abonelikler için teklif kodları. · **Anahtar rolü:** App Manager

- `subscription_groups__subscriptions__list` — Bir gruptaki abonelikleri listeler
- `subscription_offer_code_custom_codes__create` — Abonelik teklifi için seçtiğiniz metinden kullanım kodu oluşturur
- `subscription_offer_code_custom_codes__get` — Abonelik teklifinin özel kullanım koduna ait bilgileri gösterir
- `subscription_offer_code_custom_codes__update` — Abonelik teklifinin özel kullanım kodunun durumunu değiştirir
- `subscription_offer_code_one_time_use_codes__create` — Abonelik teklifi için tek kullanımlık kod grubu oluşturur
- `subscription_offer_code_one_time_use_codes__get` — Abonelik teklifinin tek kullanımlık kod grubuna ait bilgileri gösterir
- `subscription_offer_code_one_time_use_codes__update` — Abonelik teklifinin tek kullanımlık kod grubunun kullanım durumunu değiştirir
- `subscription_offer_code_one_time_use_codes__values__get` — Abonelik teklifinin tek kullanımlık kodlarını dosya olarak getirir
- `subscription_offer_codes__create` — Abonelik için kodla kullanılabilen teklif oluşturur
- `subscription_offer_codes__custom_codes__list` — Abonelik teklifinin özel kullanım kodlarını listeler
- `subscription_offer_codes__get` — Aboneliğin kodla kullanılabilen teklifinin ayrıntılarını gösterir
- `subscription_offer_codes__one_time_use_codes__list` — Abonelik teklifinin tek kullanımlık kod gruplarını listeler
- `subscription_offer_codes__prices__list` — Kodla kullanılabilen abonelik teklifinin ülkelere göre fiyatlarını listeler
- `subscription_offer_codes__update` — Aboneliğin kodlu teklifini etkinleştirir ya da durdurur
- `subscriptions__offer_codes__list` — Aboneliğin kodla kullanılabilen tekliflerini listeler
- `subscriptions__price_points__list` — Abonelik için seçilebilecek fiyatları listeler

#### `monetization:subscription-offers` · 17 araç

**İçinde ne var:** Bir abonelikteki tanıtım ve promosyon teklifleri ve tek çağrılık teklif makrosu.

**Ne zaman gerekir:** Abonelikler için tanıtım ve promosyon teklifleri. · **Anahtar rolü:** App Manager

- `subscription_groups__subscriptions__list` — Bir gruptaki abonelikleri listeler
- `subscription_introductory_offers__create` — Bir ülkede introductory offer oluşturur
- `subscription_introductory_offers__delete` — Introductory offer'ı siler
- `subscription_introductory_offers__update` — Introductory offer'ın bitiş tarihini değiştirir
- `subscription_promotional_offers__create` — Mevcut veya eski abonelere özel teklif oluşturur
- `subscription_promotional_offers__delete` — Mevcut veya eski abonelere özel teklifi siler
- `subscription_promotional_offers__get` — Mevcut veya eski abonelere özel teklifin bilgilerini gösterir
- `subscription_promotional_offers__prices__list` — Abonelik promosyonunun ülkelere göre fiyatlarını listeler
- `subscription_promotional_offers__update` — Mevcut veya eski abonelere özel teklifin fiyatlarını değiştirir
- `subscriptions__introductory_offers__list` — Introductory offer'ları listeler
- `subscriptions__introductory_offers__remove` — Aboneliğin seçilen introductory offer'larını kaldırır
- `subscriptions__price_points__list` — Abonelik için seçilebilecek fiyatları listeler
- `subscriptions__promotional_offers__list` — Mevcut veya eski abonelere sunulan teklifleri listeler
- `pricing__make_offer` — Abonelik için tüm ülkelerde fiyatlı introductory, promosyon veya geri kazanma teklifi oluşturur

#### `monetization:subscription-win-back` · 12 araç

**İçinde ne var:** Ayrılan aboneler için geri kazanma teklifleri.

**Ne zaman gerekir:** Ayrılan aboneleri geri getiren teklifler için. · **Anahtar rolü:** App Manager

- `subscription_groups__subscriptions__list` — Bir gruptaki abonelikleri listeler
- `subscriptions__price_points__list` — Abonelik için seçilebilecek fiyatları listeler
- `subscriptions__win_back_offers__list` — Eski aboneleri geri kazanma tekliflerini listeler
- `win_back_offers__create` — Eski aboneleri geri kazanmak için özel teklif oluşturur
- `win_back_offers__delete` — Eski aboneleri geri kazanma teklifini siler
- `win_back_offers__get` — Eski aboneleri geri kazanma teklifinin ayrıntılarını gösterir
- `win_back_offers__prices__list` — Eski aboneleri geri kazanma teklifinin ülkelere göre fiyatlarını listeler
- `win_back_offers__update` — Geri kazanma teklifinin koşullarını, tarihlerini ve tanıtım ayarlarını değiştirir
- `pricing__make_offer` — Abonelik için tüm ülkelerde fiyatlı introductory, promosyon veya geri kazanma teklifi oluşturur

#### `monetization:transactions` · 12 araç

**İçinde ne var:** App Store Server API: müşteri işlemleri, iadeler, abonelik durumu, yenileme tarihleri.

**Ne zaman gerekir:** Bir müşterinin satın almalarına, iadelerine ve abonelik durumuna bakmak için. · **Anahtar rolü:** App Manager

- `storekit__check_entitlement` — Müşterinin abonelikten doğan kullanım hakkının sürüp sürmediğini kontrol eder
- `storekit__extend_renewal_date` — Müşterinin abonelik yenileme tarihini ileri alır
- `storekit__get_notification_history` — Satın alma bildirimlerinin gönderim geçmişini ve başarısız teslimleri gösterir
- `storekit__get_refund_history` — Müşterinin ücret iadesi yapılan satın almalarını listeler
- `storekit__get_subscription_statuses` — Müşterinin aboneliklerinin durumunu gösterir
- `storekit__get_transaction_history` — Müşterinin satın alma geçmişini getirir
- `storekit__get_transaction_info` — Bir satın alma işleminin ayrıntılarını gösterir
- `storekit__lookup_order` — Sipariş numarasına bağlı satın alma işlemlerini bulur
- `storekit__request_test_notification` — Apple'dan bildirim bağlantısını sınamak için deneme bildirimi göndermesini ister

### `provisioning` · 41 araç

**Sunucu:** `ASC-Provisioning` · **Anahtar rolü:** Admin

**İçinde ne var:** Kod imzalama: bundle ID'ler ve yetenekleri, sertifikalar, cihazlar, provisioning profilleri, Merchant ID'ler ve Pass Type ID'ler.

**Ne zaman gerekir:** İmzalama sertifikaları, provisioning profilleri ve test cihazları için.

#### `provisioning:bundle` · 14 araç

**İçinde ne var:** Bundle ID'ler ve yetenekleri.

**Ne zaman gerekir:** Bundle ID'ler ve açtıkları yetenekler için. · **Anahtar rolü:** Admin

- `bundle_id_capabilities__create` — Bir uygulama paket kimliğine yeni bir yetenek ekler
- `bundle_id_capabilities__delete` — Uygulama paket kimliğinden bir yeteneği kaldırır
- `bundle_id_capabilities__update` — Uygulama paket kimliğine tanımlı bir yeteneğin ayarlarını günceller
- `bundle_ids__app__get` — Uygulama paket kimliğinin bağlı olduğu uygulamayı getirir
- `bundle_ids__bundle_id_capabilities__list` — Paket kimliğine tanımlanmış tüm yetenekleri listeler
- `bundle_ids__create` — Uygulama için yeni bir paket kimliği kaydeder
- `bundle_ids__delete` — Bir uygulama paket kimliğini siler
- `bundle_ids__get` — Bir uygulama paket kimliğinin ayrıntılarını getirir
- `bundle_ids__list` — Geliştirici hesabındaki tüm uygulama paket kimliklerini listeler
- `bundle_ids__profiles__list` — Paket kimliğine bağlı tüm yetkilendirme profillerini listeler
- `bundle_ids__update` — Bir uygulama paket kimliğinin görünen adını günceller

#### `provisioning:certificates` · 8 araç

**İçinde ne var:** İmzalama sertifikaları: oluşturma, listeleme, iptal etme.

**Ne zaman gerekir:** İmzalama sertifikalarını oluşturmak, listelemek ve iptal etmek için. · **Anahtar rolü:** Admin

- `certificates__create` — Sertifika isteğinden (CSR) geliştirme, dağıtım, Apple Pay veya Cüzdan sertifikası oluşturur
- `certificates__delete` — Bir imzalama sertifikasını iptal edip siler
- `certificates__get` — Bir imzalama sertifikasının ayrıntılarını ve geçerlilik süresini getirir
- `certificates__list` — Hesaptaki tüm imzalama sertifikalarını listeler
- `certificates__update` — Bir imzalama sertifikasının etkinleştirilme durumunu günceller

#### `provisioning:devices` · 7 araç

**İçinde ne var:** Kayıtlı test cihazları.

**Ne zaman gerekir:** Test cihazlarını kaydetmek ve yönetmek için. · **Anahtar rolü:** Admin

- `devices__create` — Geliştirici hesabına test için yeni bir cihaz kaydeder
- `devices__get` — Kayıtlı bir test cihazının ayrıntılarını getirir
- `devices__list` — Hesaba kayıtlı tüm test cihazlarını listeler
- `devices__update` — Kayıtlı bir test cihazının adını veya durumunu günceller

#### `provisioning:profiles` · 13 araç

**İçinde ne var:** Provisioning profilleri ve bağladıkları bundle ID, sertifikalar ve cihazlar.

**Ne zaman gerekir:** Bir uygulamayı, sertifikaları ve cihazları birbirine bağlayan provisioning profilleri için. · **Anahtar rolü:** Admin

- `bundle_ids__list` — Geliştirici hesabındaki tüm uygulama paket kimliklerini listeler
- `certificates__list` — Hesaptaki tüm imzalama sertifikalarını listeler
- `devices__list` — Hesaba kayıtlı tüm test cihazlarını listeler
- `profiles__bundle_id__get` — Yetkilendirme profilinin bağlı olduğu uygulama paket kimliğini getirir
- `profiles__certificates__list` — Yetkilendirme profilinde bulunan tüm imzalama sertifikalarını listeler
- `profiles__create` — Uygulama yükleme ve imzalama için yeni bir yetkilendirme profili oluşturur
- `profiles__delete` — Bir yetkilendirme profilini siler
- `profiles__devices__list` — Yetkilendirme profilinde tanımlı tüm yetkili cihazları listeler
- `profiles__get` — Bir yetkilendirme profilinin ayrıntılarını, geçerlilik süresini ve profil dosyasını getirir
- `profiles__list` — Hesaptaki tüm yetkilendirme profillerini listeler

#### `provisioning:wallet` · 16 araç

**İçinde ne var:** Merchant ID'ler ve Pass Type ID'ler, sertifikalarıyla birlikte.

**Ne zaman gerekir:** Apple Pay Merchant ID'leri ve Wallet Pass Type ID'leri için. · **Anahtar rolü:** Admin

- `certificates__pass_type_id__get` — Sertifikanın bağlı olduğu Apple Cüzdan kartı tanıtıcısını getirir
- `merchant_ids__certificates__list` — Apple Pay Merchant ID'sine bağlı sertifikaları listeler
- `merchant_ids__create` — Apple Pay ödemeleri için yeni bir Merchant ID oluşturur
- `merchant_ids__delete` — Bir Apple Pay Merchant ID'sini siler
- `merchant_ids__get` — Bir Apple Pay Merchant ID'sinin ayrıntılarını getirir
- `merchant_ids__list` — Hesaptaki tüm Apple Pay Merchant ID'lerini listeler
- `merchant_ids__update` — Bir Apple Pay Merchant ID'sinin adını günceller
- `pass_type_ids__certificates__list` — Cüzdan kartı tanıtıcısına bağlı imzalama sertifikalarını listeler
- `pass_type_ids__create` — Apple Cüzdan kartları için yeni bir tanıtıcı oluşturur
- `pass_type_ids__delete` — Bir Apple Cüzdan kartı tanıtıcısını siler
- `pass_type_ids__get` — Bir Apple Cüzdan kartı tanıtıcısının ayrıntılarını getirir
- `pass_type_ids__list` — Hesaptaki tüm Apple Cüzdan kartı tanıtıcılarını listeler
- `pass_type_ids__update` — Bir Apple Cüzdan kartı tanıtıcısının adını günceller

### `testflight` · 81 araç

**Sunucu:** `ASC-TestFlight` · **Anahtar rolü:** Developer

**İçinde ne var:** TestFlight: test build'leri, beta grupları ve testçiler, dış inceleme, çökme ve ekran görüntülü geri bildirim.

**Ne zaman gerekir:** Beta build'leri, grupları ve testçileri ile testçilerin bildirdikleri için.

#### `testflight:external-testing` · 24 araç

**İçinde ne var:** Dış test: beta inceleme, katılım ölçütleri, açık bağlantılar, beta lisans sözleşmesi.

**Ne zaman gerekir:** Beta App Review, açık bağlantılar ve kimlerin katılabileceği için. · **Anahtar rolü:** Developer

- `apps__beta_app_review_detail__get` — Dış test incelemesi için iletişim ve demo hesap bilgilerini getirir
- `apps__beta_groups__list` — Uygulamanın test gruplarını listeler
- `apps__beta_license_agreement__get` — Uygulamanın testçi sözleşmesini getirir
- `beta_app_review_details__get` — Dış test incelemesi için iletişim ve demo hesap bilgilerini getirir
- `beta_app_review_details__list` — Dış test inceleme bilgilerini listeler
- `beta_app_review_details__update` — Dış test incelemesi için iletişim, demo hesap ve not bilgilerini günceller
- `beta_app_review_submissions__build__get` — Beta inceleme başvurusundaki build'i getirir
- `beta_app_review_submissions__create` — Bir build'i dış test için Apple beta incelemesine gönderir
- `beta_app_review_submissions__get` — Dış test inceleme başvurusunu getirir
- `beta_app_review_submissions__list` — Dış test inceleme başvurularını listeler
- `beta_groups__beta_recruitment_criteria__get` — Grubun testçi kabul ölçütlerini getirir
- `beta_groups__beta_recruitment_criterion_compatible_build__1sdmx5` — Grubun ölçütlerine uyan bir build olup olmadığını gösterir
- `beta_groups__public_link_usages__metrics` — Grubun açık davet bağlantısının kullanımını gösterir
- `beta_license_agreements__get` — Testçi sözleşmesini getirir
- `beta_license_agreements__list` — Testçi sözleşmelerini listeler
- `beta_license_agreements__update` — Testçi sözleşmesinin metnini günceller
- `beta_recruitment_criteria__create` — Test grubuna katılım ölçütleri ekler
- `beta_recruitment_criteria__delete` — Test grubunun katılım ölçütlerini siler
- `beta_recruitment_criteria__update` — Test grubunun katılım ölçütlerini günceller
- `beta_recruitment_criterion_options__list` — Testçi kabulünde seçilebilecek cihaz ve sistem sürümlerini listeler
- `builds__beta_app_review_submission__get` — Build'in beta inceleme başvurusunu getirir

#### `testflight:feedbacks` · 18 araç

**İçinde ne var:** Testçi geri bildirimi: çökme raporları, ekran görüntülü bildirimler, geri bildirim özeti.

**Ne zaman gerekir:** Testçilerin gönderdiği çökmeler ve ekran görüntüleri, özetlenmiş hâlde. · **Anahtar rolü:** Developer

- `apps__beta_feedback_crash_submissions__list` — Uygulamanın testçi çökme bildirimlerini listeler
- `apps__beta_feedback_screenshot_submissions__list` — Uygulamanın ekran görüntülü testçi bildirimlerini listeler
- `apps__beta_groups__list` — Uygulamanın test gruplarını listeler
- `apps__beta_tester_usages__metrics` — Testçi bazında oturum, çökme ve geri bildirim sayılarını gösterir
- `beta_crash_logs__get` — Bir çökme kaydının ayrıntılarını getirir
- `beta_feedback_crash_submissions__crash_log__get` — Testçinin çökme bildirimine bağlı kaydı getirir
- `beta_feedback_crash_submissions__delete` — Testçinin çökme bildirimini siler
- `beta_feedback_crash_submissions__get` — Testçinin çökme bildirimini getirir
- `beta_feedback_screenshot_submissions__delete` — Ekran görüntülü testçi bildirimini siler
- `beta_feedback_screenshot_submissions__get` — Ekran görüntülü testçi bildirimini getirir
- `beta_groups__beta_tester_usages__metrics` — Gruptaki testçilerin oturum, çökme ve geri bildirim sayılarını gösterir
- `beta_testers__beta_tester_usages__metrics` — Testçinin oturum, çökme ve geri bildirim sayılarını gösterir
- `beta_testers__list` — Testçileri listeler
- `builds__beta_build_usages__metrics` — Build'in kurulum, oturum, çökme, geri bildirim ve davet sayılarını gösterir
- `testflight__feedback_digest` — Testçi bildirimlerini build'lere göre özetler

#### `testflight:groups` · 14 araç

**İçinde ne var:** Beta grupları: oluşturma, ayarlama, build verme.

**Ne zaman gerekir:** Beta grupları ve hangi build'leri aldıkları için. · **Anahtar rolü:** Developer

- `apps__beta_groups__list` — Uygulamanın test gruplarını listeler
- `beta_groups__beta_testers__list` — Gruptaki testçileri listeler
- `beta_groups__builds__add` — Gruba bir ya da daha fazla build verir
- `beta_groups__builds__list` — Grubun erişebildiği build'leri listeler
- `beta_groups__builds__remove` — Bir build'i gruptan geri alır
- `beta_groups__create` — Yeni bir test grubu oluşturur
- `beta_groups__delete` — Test grubunu siler
- `beta_groups__get` — Test grubunun bilgilerini getirir
- `beta_groups__list` — Test gruplarını listeler
- `beta_groups__update` — Grubun adını, açık davet bağlantısını, katılım sınırını ve test seçeneklerini günceller
- `testflight__assign_build_to_groups` — İşlenmiş bir build'i seçilen gruplara verir

#### `testflight:test-builds` · 27 araç

**İçinde ne var:** Testteki build'ler: “What to Test” notları, beta ayrıntıları, testçi bildirimleri, pre-release sürümler.

**Ne zaman gerekir:** Neyi test edin notları ve testçilere giden build'ler için. · **Anahtar rolü:** Developer

- `apps__beta_app_localizations__list` — Uygulamanın test bilgilerini (açıklama, geri bildirim e-postası) dillere göre listeler
- `apps__beta_groups__list` — Uygulamanın test gruplarını listeler
- `apps__pre_release_versions__list` — Uygulamanın pre-release sürümlerini (ör. 1.2) listeler
- `beta_app_localizations__create` — Bir dil için test bilgilerini (açıklama, geri bildirim e-postası) ekler
- `beta_app_localizations__delete` — Bir dilin test bilgilerini siler
- `beta_app_localizations__get` — Bir dilin test bilgilerini getirir
- `beta_app_localizations__list` — Test bilgilerini dillere göre listeler
- `beta_app_localizations__update` — Bir dilin test bilgilerini günceller
- `beta_build_localizations__create` — Build için bir dilde “What to Test” notu yazar
- `beta_build_localizations__delete` — Build'in bir dildeki “What to Test” notunu siler
- `beta_build_localizations__get` — Build'in bir dildeki “What to Test” notunu getirir
- `beta_build_localizations__list` — Build'lerin “What to Test” notlarını listeler
- `beta_build_localizations__update` — Build'in “What to Test” notunu günceller
- `build_beta_details__get` — Build'in iç ve dış test durumunu ve otomatik bildirim ayarını gösterir
- `build_beta_details__list` — Build'lerin iç ve dış test durumlarını ve otomatik bildirim ayarlarını listeler
- `build_beta_details__update` — Build için testçilere otomatik bildirim gönderimini açar ya da kapatır
- `build_beta_notifications__create` — Build'e erişen testçilere bildirim gönderir
- `builds__beta_build_localizations__list` — Build'in “What to Test” notlarını dillere göre listeler
- `builds__build_beta_detail__get` — Build'in iç ve dış test durumunu ve otomatik bildirim ayarını getirir
- `builds__pre_release_version__get` — Build'in ait olduğu pre-release sürümü getirir
- `pre_release_versions__builds__list` — Pre-release sürümdeki build'leri listeler
- `pre_release_versions__get` — Pre-release sürümü getirir
- `pre_release_versions__list` — Pre-release sürümleri listeler
- `testflight__assign_build_to_groups` — İşlenmiş bir build'i seçilen gruplara verir

#### `testflight:testers` · 18 araç

**İçinde ne var:** Tek tek testçiler: davet etme, gruplara ve build'lere ekleme, çıkarma.

**Ne zaman gerekir:** Testçileri davet etmek, gruplara ve build'lere eklemek, çıkarmak için. · **Anahtar rolü:** Developer

- `apps__beta_groups__list` — Uygulamanın test gruplarını listeler
- `apps__beta_testers__remove` — Bir testçiyi uygulamanın testlerinden çıkarır
- `beta_tester_invitations__create` — Kayıtlı testçiye uygulama davetini gönderir ya da yeniden gönderir
- `beta_testers__apps__list` — Testçinin katıldığı uygulamaları listeler
- `beta_testers__beta_groups__add` — Bir testçiyi test gruplarına ekler
- `beta_testers__beta_groups__list` — Testçinin üye olduğu grupları listeler
- `beta_testers__beta_groups__remove` — Bir testçiyi test gruplarından çıkarır
- `beta_testers__builds__list` — Testçiye doğrudan verilmiş build'leri listeler
- `beta_testers__create` — Testçi kaydı oluşturur; istenirse gruplara ya da doğrudan build'lere ekler
- `beta_testers__delete` — Testçiyi tüm uygulamaların testlerinden tamamen siler
- `beta_testers__get` — Bir testçinin bilgilerini getirir
- `beta_testers__list` — Testçileri listeler
- `builds__individual_testers__add` — Build'i belirli testçilere doğrudan verir
- `builds__individual_testers__list` — Build'in doğrudan verildiği testçileri listeler
- `builds__individual_testers__remove` — Build'i belirli testçilerden geri alır

### `webhooks` · 9 araç

**Sunucu:** `ASC-Webhooks` · **Anahtar rolü:** Admin

**İçinde ne var:** App Store Connect olaylarını adresinize gönderen webhook'lar, gönderimleri ve test sinyalleri.

**Ne zaman gerekir:** Bir şey olduğunda App Store Connect'in kendi sunucunuza haber vermesi için.

- `apps__webhooks__list` — Uygulamaya tanımlanmış tüm webhook bildirimlerini listeler
- `webhook_deliveries__create` — Geçmiş veya başarısız bir webhook bildirimini yeniden gönderir
- `webhook_pings__create` — Webhook adresini test etmek için deneme sinyali gönderir
- `webhooks__create` — Uygulama olaylarını dinlemek için yeni bir webhook oluşturur
- `webhooks__delete` — Kayıtlı bir webhook bildirim aboneliğini siler
- `webhooks__deliveries__list` — Bir webhook aboneliğinin geçmiş gönderim denemelerini listeler
- `webhooks__get` — Kayıtlı bir webhook bildirim aboneliğinin ayrıntılarını getirir
- `webhooks__update` — Bir webhook aboneliğinin adresini, olaylarını, adını, gizli anahtarını ve açık/kapalı durumunu günceller

### `xcode-cloud` · 44 araç

**Sunucu:** `ASC-XcodeCloud` · **Anahtar rolü:** Developer

**İçinde ne var:** Apple'ın CI/CD hizmeti: iş akışları, build çalıştırmaları, çıktılar, test sonuçları, kaynak kontrolü.

**Ne zaman gerekir:** Build iş akışları ve bir build'in neden başarısız olduğu için.

#### `xcode-cloud:repositories` · 17 araç

**İçinde ne var:** Xcode Cloud'un arkasındaki kaynak kontrolü: sağlayıcılar, depolar, branch'ler, pull request'ler.

**Ne zaman gerekir:** Xcode Cloud'un derlediği Git depoları, branch'ler ve pull request'ler için. · **Anahtar rolü:** Developer

- `ci_products__additional_repositories__list` — Bulut derlemesinin kullandığı ek kod depolarını listeler
- `ci_products__list` — Xcode Cloud kullanan tüm uygulama ve kütüphaneleri listeler
- `ci_products__primary_repositories__list` — Bir Xcode Cloud ürününün ana kod depolarını listeler
- `ci_products__workflows__list` — Bir Xcode Cloud ürününün derleme akışlarını listeler
- `ci_workflows__repository__get` — Bir derleme akışının hangi kod deposunu kullandığını gösterir
- `scm_git_references__get` — Bir branch ya da tag'in ayrıntılarını gösterir
- `scm_providers__get` — Bağlı kod barındırma hizmetinin ayrıntılarını gösterir
- `scm_providers__list` — Bağlı kod barındırma hizmetlerini listeler
- `scm_providers__repositories__list` — Bir kod barındırma hizmetindeki depoları listeler
- `scm_pull_requests__get` — Bir pull request'in ayrıntılarını gösterir
- `scm_repositories__get` — Bir kod deposunun ayrıntılarını gösterir
- `scm_repositories__git_references__list` — Bir kod deposundaki branch'leri ve tag'leri listeler
- `scm_repositories__list` — Bağlı tüm kod depolarını listeler
- `scm_repositories__pull_requests__list` — Bir kod deposundaki pull request'leri listeler

#### `xcode-cloud:workflows` · 35 araç

**İçinde ne var:** Xcode Cloud ürünleri, iş akışları ve build çalıştırmaları: adımlar, çıktılar, sorunlar, test sonuçları ve çalıştırma teşhis makrosu.

**Ne zaman gerekir:** İş akışları, build çalıştırmaları, test sonuçları ve bir çalıştırmanın neden başarısız olduğu için. · **Anahtar rolü:** Developer

- `apps__ci_product__get` — Uygulamanın bulut derleme kaydını gösterir
- `ci_artifacts__get` — Bir derlemenin ürettiği dosyanın türünü, boyutunu ve indirme bağlantısını gösterir
- `ci_build_actions__artifacts__list` — Bir derleme adımının ürettiği dosyaları listeler
- `ci_build_actions__build_run__get` — Bir derleme adımının ait olduğu derlemeyi gösterir
- `ci_build_actions__get` — Bir derleme adımının ayrıntılarını gösterir
- `ci_build_actions__issues__list` — Bir derleme adımındaki hata ve uyarıları listeler
- `ci_build_actions__test_results__list` — Bir derleme adımındaki test sonuçlarını listeler
- `ci_build_runs__actions__list` — Bir derlemenin adımlarını listeler
- `ci_build_runs__builds__list` — Bir bulut derlemesinin ürettiği build'leri listeler
- `ci_build_runs__create` — Bir derleme akışını elle başlatır ya da önceki derlemeyi yeniden çalıştırır
- `ci_build_runs__get` — Bir bulut derlemesinin durumunu ve sonucunu gösterir
- `ci_issues__get` — Derlemedeki bir hata ya da uyarının ayrıntısını gösterir
- `ci_mac_os_versions__get` — Derlemede kullanılabilen bir macOS sürümünü gösterir
- `ci_mac_os_versions__list` — Derlemede kullanılabilen macOS sürümlerini listeler
- `ci_mac_os_versions__xcode_versions__list` — Bir macOS sürümüyle uyumlu Xcode sürümlerini listeler
- `ci_products__app__get` — Bir bulut derleme kaydının hangi uygulamaya ait olduğunu gösterir
- `ci_products__build_runs__list` — Bir Xcode Cloud ürününün tüm bulut derlemelerini listeler
- `ci_products__delete` — Uygulamanın bulut derleme kaydını tüm akışlarıyla siler
- `ci_products__get` — Bir Xcode Cloud ürününün (uygulama ya da kütüphane) ayrıntılarını gösterir
- `ci_products__list` — Xcode Cloud kullanan tüm uygulama ve kütüphaneleri listeler
- `ci_products__workflows__list` — Bir Xcode Cloud ürününün derleme akışlarını listeler
- `ci_test_results__get` — Tek bir test sonucunun ayrıntısını gösterir
- `ci_workflows__build_runs__list` — Bir derleme akışının geçmiş derlemelerini listeler
- `ci_workflows__create` — Yeni bir derleme akışı kurar
- `ci_workflows__delete` — Bir derleme akışını siler
- `ci_workflows__get` — Bir derleme akışının ayarlarını gösterir
- `ci_workflows__update` — Bir derleme akışının ayarlarını değiştirir
- `ci_xcode_versions__get` — Derlemede kullanılabilen bir Xcode sürümünü gösterir
- `ci_xcode_versions__list` — Derlemede kullanılabilen Xcode sürümlerini listeler
- `ci_xcode_versions__mac_os_versions__list` — Bir Xcode sürümüyle uyumlu macOS sürümlerini listeler
- `scm_repositories__list` — Bağlı tüm kod depolarını listeler
- `ci__diagnose_run` — Başarısız bulut derlemesindeki hataları, uyarıları ve başarısız testleri tek adımda toplar
