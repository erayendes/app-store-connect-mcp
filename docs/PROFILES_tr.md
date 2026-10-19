# Profiller

🇬🇧 [English](PROFILES_en.md) · 🇹🇷 Türkçe

Tek kurulum, amaca özel 13 küçük MCP sunucusu sunar.
Profil adını verirsiniz ve yalnızca o alanın araçları yüklenir.

| Profil | Kapsam | ~Araç | Alt profiller |
|:--|:--|--:|:--|
| `app-info` | Uygulama kimliği, mağaza metadata'sı, kategoriler, ülke uygunluğu, yaş sınırı, erişilebilirlik etiketleri, EULA | 58 | — |
| `distribution` | Sürümler, yerelleştirmeler, kademeli yayın, inceleme gönderimi, build'ler, ihracat uyumluluğu, AB dağıtımı | 137 | version, dma-distribution, builds, submission, encryption, review, pre-release, coverages |
| `monetization` | Abonelikler, IAP, fiyatlandırma, teklifler, StoreKit 2, sandbox testçileri | 212 | subscription-catalog, subscription-pricing, subscription-offers, iap-catalog, iap-pricing, iap-offers, app-price, storekit |
| `marketing` | Ekran görüntüleri, ürün sayfaları, uygulama içi etkinlikler, yorumlar, görsel/video kütüphanesi | 126 | asset-library, custom-product-page, product-page-optimization, app-event, customer-review, nominations |
| `access` | Beta grupları, testçiler, davetler, ekip üyeleri | 66 | beta-testers, beta-groups, users |
| `testflight` | Beta uygulama metinleri, beta inceleme bilgisi, kilitlenme geri bildirimi, beta lisans sözleşmesi | 56 | — |
| `game-center` | Başarımlar, liderlik tabloları, etkinlikler, meydan okumalar, eşleştirme | 187 | gc-leaderboard, gc-matchmaking, gc-activities, gc-challenge, gc-achievement, gc-details, gc-groups, gc-default |
| `app-clips` | Varsayılan ve gelişmiş deneyimler, başlık görselleri, beta çağrıları | 52 | — |
| `xcode-cloud` | CI iş akışları, build çalıştırmaları, artifact'lar | 53 | — |
| `provisioning` | Sertifikalar, provisioning profilleri, cihazlar, bundle ID'ler | 50 | — |
| `analytics` | Satış/finans raporları, analytics, performans metrikleri | 26 | — |
| `background-assets` | Background Assets (iOS 26) | 24 | — |
| `webhooks` | Webhook yapılandırma ve teşhis | 18 | — |

Her profil, uygulamalarınızı bulmaya ve eksik araçları aramaya yarayan küçük bir **çekirdek setle** gelir. Yani hangi profili kurarsanız kurun, yapay zekâ uygulamalarınızı bulabilir ve o profilde olmayan bir aracı size gösterebilir.

## Alt profiller

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/app-store-connect-mcp/main/assets/picker.gif" alt="Profil seçici: monetization işaretlenince alt profilleri, araç sayısı ve token tahminiyle açılıyor" width="720">

[Kurulum](SETUP_tr.md) seçicisinde bir profili işaretleyin; imleci üstüne getirdiğinizde alt profillerin hepsi işaretli olarak açılır, istemediğinizi kaldırın.
Örneğin `monetization` 212 araç; ama sadece abonelik fiyatı değiştiriyorsanız 27 araçlık `monetization:subscription-pricing` sizin için yeterlidir. Araç adedinden bağımsız olarak, sunucunun adı her zaman `ASC-Monetization` kalır.

> [!TIP]
> Hangi profillerin yüklü olduğunu görmek için yapay zekâya *"Hangi profiller yüklü?"* diye sorun.

## Başlangıç paketleri

Bunlar "Hangi profili kurayım?" sorusunun kısa yanıtını bulmanız için hazırlandı. Unutmayın hepsi çekirdek seti de yanında getirir.

| Rol | Kurun | Araç |
|:--|:--|--:|
| Yayın yöneticisi | `distribution` + `app-info` | 195 |
| ASO / pazarlama | `marketing` + `analytics` | 152 |
| QA / TestFlight | `testflight` + `access` | 122 |
| Monetizasyon | `monetization` | 212 |
| Oyun geliştirici | `game-center` + `distribution` | 324 |
| Müşteri desteği | `monetization:storekit` | 19 |
| Build ve imzalama | `provisioning` + `xcode-cloud` | 103 |

> [!TIP]
> Dar bir kapsamla başlayın. Bir profili atlamakla hiçbir şey kaybetmezsiniz. Yüklediğiniz her araç her sohbette yapay zekâya yeniden anlatılır. Ne kadar az araç, o kadar hızlı ve ucuz.
> Atladığınız bir araca ihtiyaç olursa yapay zekâya sorun; hangi profilde olduğunu ve nasıl ekleneceğini söyler.
