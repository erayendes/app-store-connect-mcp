# Karşılaştırma

🇬🇧 [English](COMPARISON_en.md) · 🇹🇷 Türkçe

**Veri tarihi: 2026-11-13.** Bu sayfa, 11–13 Kasım'da toplanan Kasım 2026 araştırma verilerine dayanır. Özellik açıklamaları bağlantı verilen projelerin belgelerinden alınmıştır; her ürün bağımsız olarak test edilmemiştir. Yıldız sayıları o tarihteki görünürlüğü gösterir, güvenilirliği ölçmez. “Bilinmiyor”, araştırmada doğrulanmadığı anlamına gelir.

Heimdall, MCP istemcinizden App Store Connect işlemlerini yürütür: abonelik fiyatları ve teklifler, yayınlar, TestFlight ve müşteri yorumları. Tek tek müşterilerin işlemleri için App Store Server API araçları, tek çağrılık iş akışı makroları ve riskli yazmalardan önce onay içerir. Aşağıdaki alternatifler bu işlerin farklı bölümlerine yöneliktir.

## Karşılaştırma tablosu

| Ürün | Araştırmadaki kapsam | StoreKit 2 / Server API | Bildirilen yazma kontrolleri | Çalışma biçimi | GitHub yıldızı |
|---|---|---|---|---|---|
| [Heimdall](https://github.com/erayendes/app-store-connect-mcp) | 14 profilde 786 araç; üretilmiş App Store Connect işlemleri ve iş akışı makroları | Doğrudan destek | Riske göre CONFIRM veya evet/hayır; salt okunur mod yazma araçlarını gizler; istemci soruyu gösteremiyorsa macOS onay penceresi | Yerel MCP, stdio; macOS Keychain | 57 |
| [asc CLI (rorkai/App-Store-Connect-CLI)](https://github.com/rorkai/App-Store-Connect-CLI) | Agent Skills içeren CLI; geniş kapsam, Apple Ads ve uygulama ile API anahtarı oluşturmak için web oturumu komutları | Doğrudan destek | `--confirm` bayrakları | Yerel CLI | 8.300 |
| [fastlane](https://github.com/fastlane/fastlane) | CI derlemeleri, imzalama, yükleme ve mağaza metinleri | Destek bildirilmemiş | Betikle kontrol edilir | Yerel / CI | 42.400 |
| [JoshuaRileyDev/app-store-connect-mcp-server](https://github.com/JoshuaRileyDev/app-store-connect-mcp-server) | 27 araç; Şubat 2026'da arşivlenmiş | Desteklenmiyor | Sunucu tarafında yazma kontrolü bildirilmemiş | Yerel MCP | 331 |
| [magaza-mcp](https://github.com/tunaarikaya/magaza-mcp) | App Store Connect + Google Play; 41 araç ve 1.440 işlemi kapsayan gateway | Bilinmiyor | `onayla=true`, salt okunur mod; Keychain'de saklama | Yerel MCP | 105 |
| [zelentsov-dev/asc-mcp](https://github.com/zelentsov-dev/asc-mcp) | Swift MCP; README'de tutarsız 200–537 araç sayıları; çoklu ekip | Bilinmiyor | Salt okunur mod ve ID onayı | Yerel MCP | 84 |
| [app-publish-mcp](https://github.com/mikusnuz/app-publish-mcp) | App Store Connect + Google Play; bildirilen araç sayıları 91–188 arasında | Bilinmiyor | Salt okunur mod | Yerel MCP | 41 |
| [pofky/asc-mcp](https://registry.modelcontextprotocol.io/v0/servers?search=asc-mcp) | İş akışlarına yönelik 41 araç | Bilinmiyor | Bilinmiyor | Yerel MCP | Ölçülmemiş |
| [RevenueCat MCP](https://www.revenuecat.com/docs/tools/mcp/tools-reference) | RevenueCat'in kendi abonelik platformu için 129 araç | Kendi platformu üzerinden dolaylı | Doğrulanmadı; kimlik doğrulama için OAuth belgelenmiş | Bulutta barındırılan MCP | Kaydedilmemiş |
| [Adapty MCP](https://adapty.io/docs/adapty-mcp) | Adapty'nin kendi platform API'leri | Kendi platformu üzerinden dolaylı | Doğrulanmadı; kimlik doğrulama için OAuth belgelenmiş | Bulutta barındırılan MCP | Kaydedilmemiş |

Araç sayıları farklı birimleri kullanır: sunulan MCP araçları, gateway işlemleri ve CLI komutları aynı şeyleri saymaz. Yukarıdaki aralıklar, büyük sayıyı seçmek yerine araştırmadaki tutarsızlıkları korur. Tabloda bir yazma kontrolünün belirtilmemesi, MCP istemcisinin sunduğu onayları açıklamaz. OAuth erişimin kimliğini doğrular; her yazma için onay istendiğini göstermez.

## Heimdall'ın geride kaldığı alanlar

- **Google Play:** Heimdall, Apple API'lerini kapsar. magaza-mcp ve app-publish-mcp hem App Store Connect'i hem Google Play'i kapsar.
- **Bulutta barındırma / uzak erişim:** Heimdall yerel olarak stdio üzerinden çalışır ve bulutta barındırılan uzak bir uç noktası yoktur. RevenueCat ve Adapty, kendi platformları için OAuth kullanan bulut MCP'leri sunar.
- **Yıldız ve görünürlük:** Heimdall'ın bu tarihte 57 GitHub yıldızı vardı; fastlane, asc CLI, JoshuaRileyDev, magaza-mcp ve zelentsov-dev'in gerisindeydi. Özellik kapsamından bağımsız olarak, herkese açık takipçi kitlesi daha küçüktür.
- **Web oturumu işlemleri:** Heimdall uygulama veya API anahtarı oluşturamaz. asc CLI bu işlemleri App Store Connect web oturumu üzerinden destekler.

## Ne zaman başka bir araç kullanmalısınız?

- **CI derlemeleri ve imzalama:** derleme ve imzalama hattınız için [fastlane](https://github.com/fastlane/fastlane) kullanın. Heimdall yanında App Store Connect işlemlerini yürütebilir.
- **Web oturumuyla uygulama veya API anahtarı oluşturma:** bu komutlar için [asc CLI](https://github.com/rorkai/App-Store-Connect-CLI) kullanın.
- **İki mağaza birlikte:** App Store Connect ve Google Play'e birlikte ihtiyacınız varsa [magaza-mcp](https://github.com/tunaarikaya/magaza-mcp) veya [app-publish-mcp](https://github.com/mikusnuz/app-publish-mcp) seçeneklerini değerlendirin.
- **Bulutta abonelik analizi:** abonelik verileriniz ve analizleriniz RevenueCat'teyse [RevenueCat MCP](https://www.revenuecat.com/docs/tools/mcp/tools-reference) kullanın. Araçları bu platformun abonelik katmanında çalışır.

Heimdall'ın iş akışı örnekleri ve onay davranışı için [Rehber](GUIDE_tr.md) sayfasına bakın. Gereken araçları [Profiller](PROFILES_tr.md) sayfasından seçip [Kurulum](SETUP_tr.md) adımlarını izleyin.
