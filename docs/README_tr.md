# Heimdall — App Store Connect MCP

**App Store Connect hesabının tamamı, tek bir araçta.**

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/app-store-connect-mcp/main/assets/brand/heimdall-social-card.png" alt="Heimdall — App Store Connect MCP" width="720">

[![npm version](https://img.shields.io/npm/v/%40erayendes%2Fasc-mcp.svg)](https://www.npmjs.com/package/@erayendes/asc-mcp)
[![npm downloads](https://img.shields.io/npm/dm/%40erayendes%2Fasc-mcp.svg)](https://www.npmjs.com/package/@erayendes/asc-mcp)
[![CI](https://github.com/erayendes/app-store-connect-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/erayendes/app-store-connect-mcp/actions/workflows/ci.yml)
[![Lisans: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)
[![Yerli üretim](https://img.shields.io/badge/YERL%C4%B0%20%C3%9CRET%C4%B0M-red?style=flat&label=%F0%9F%A4%9D&color=red&link=https%3A%2F%2Fmilowda.com)](https://milowda.com)

🇬🇧 [English](../README.md) · 🇹🇷 Türkçe

**Sorun yanıtlasın, isteyin yapsın.**

> - *"Bu haftanın 1 yıldızlı yorumlarını özetle ve cevap taslakları hazırla."*
> - *"Hangi build'ler incelemede takıldı?"*
> - *"Bu aboneliğin fiyatını her ülkede artır."*
> - *"Bu abonelik her ülkede kaça?"*
> - *"Mağaza sayfasında hangi ekran görüntüleri var?"*
> - *"42 numaralı build'i Internal ve External gruplarına ata."*
> - *"Xcode Cloud build'im neden patladı?"*

Yani App Store Connect ekranlarında yapabildiğiniz işlerin neredeyse tamamını artık yapay zekâya söyleyerek yaptırabilirsiniz. Daha fazla kullanım örneği için [Rehber](GUIDE_tr.md#örnekler)i inceleyin.

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/app-store-connect-mcp/main/assets/demo.gif" alt="Bir yapay zekâya aboneliğin dünya genelindeki fiyatı soruluyor; Heimdall tek araç çağrısıyla cevaplıyor" width="720">

<sub>Gerçek bir yapay zekâ oturumu, hızlandırılmış. Hesap, kayıt herkese açık olabilsin diye temsili bir hesap.</sub>

### Heimdall

Apple'ın kendi OpenAPI spesifikasyonu (**App Store Connect API** ve **App Store Server API (StoreKit 2)**) kullanılarak oluşturulmuş **13 ana profil altında 32 alt profil ve 902 araç** içeren tek bir MCP sunucusudur.

Çoğu muadili API'nin elle seçilmiş bir araç dilimini sunar. Bu kürasyon ihtiyaç duyacağınız o uç noktaya kadar işe yarar. Ama **o uç nokta geldiğinde çözümü bulmak için alternatifler arasında kaybolur gidersiniz.**

**Heimdall** tam tersini yapar, **araçların tamamını profiller altında verir.** Uygulamalar, metadatalar, sürümler, TestFlight, abonelikler, uygulama içi satın almalar, fiyatlandırma, yorumlar, Game Center, Xcode Cloud, provisioning, webhook'lar, satış ve finans raporları… Hepsi… **İstediklerinizi siz seçersiniz** — ve istediğiniz zaman ekleyip çıkarırsınız.

Hangi profilin neyi kapsadığını görmek için [Profiller](PROFILES_tr.md) dokümanına bakabilirsiniz.
Ama örneğin *"in-app event için bir araç var mı?"* diye sorarsanız Heimdall o aracın hangi profilde olduğunu zaten söyler.

Eğer **hangi profile ihtiyacınız olduğundan emin değilseniz** [başlangıç paketleri](PROFILES_tr.md#başlangıç-paketleri) işinize yarayabilir.

### Yerelde çalışır

MCP rehberleri genelde uzak HTTP sunucularını önerir.
**Heimdall yerelde çalışır**. App Store Connect için gerekli olan anahtarları Keychain'den okur. Kısa ömürlü bir token imzalar ve doğrudan Apple ile konuşur. Arada hiçbir şey olmaz, anahtarınız sadece sizde kalır.

> [!NOTE]
> Anahtara en az yetkiyi vermeye çalışın. App Store Connect [rol yetkileri](ROLES_tr.md)ni incelediğinizden emin olun.

### Riskli işlemlerde önce sorar

Fiyat değiştirmek, birine Admin yetkisi vermek ya da bir şeyi silmek istediğinizde önce onay ister ve neyin değişeceğini gösterir. Bu kural gelir, silme, altyapı ve erişim gibi geri alması zor değişikliklerde varsayılan olarak açık gelir. Geri kalan her şeyde kullandığınız uygulamanın kendi onay sistemi devrededir.

Detaylar için → [Güvenlik](../.github/SECURITY.md#türkçe).

### Fastlane'in yerine değil, yanında
Heimdall, [Fastlane](https://fastlane.tools/)'in alternatifi değil, tamamlayıcısıdır. **Pipeline için Fastlane, elle yaptığınız her şey için Heimdall**.

### Kurulum

Tek komut.

```bash
npx -y @erayendes/asc-mcp setup
```

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/app-store-connect-mcp/main/assets/setup.gif" alt="Setup sihirbazı: anahtar, Issuer ID, Apple doğrulaması, profil ve alt profil seçimi, anahtarın Keychain'e kaydı" width="720">

Ama öncesinde App Store Connect'ten bir [API anahtarı oluşturun](SETUP_tr.md#api-anahtarı-oluşturun) ve cihazınızda Node.js 20.19 veya üstünün kurulu olduğundan emin olun.

Heimdall'ı yapay zekânıza kurdurmak ya da [Xcode 27'de kullanmak](SETUP_tr.md#xcode-27de-heimdall-kullanmak) için diğer tüm kurulum detayları [Kurulum](SETUP_tr.md) dokümanında.

### İsim ve proje hakkında
**Heimdall**, İskandinav mitolojisinde Asgard ile **dokuz diyarı birbirine bağlayan gökkuşağı köprüsü** Bifröst'ün bekçisidir. Bu projedeki görevi, App Store Connect hesabınızı makinenize bağlayan yolları tutmak. Adını oradan alıyor.

Projeyi akşamları tek başıma geliştiriyorum ve ücretsiz, açık kaynak ve MIT lisanslı olarak yayınlıyorum.
Heimdall sizi App Store Connect panelinden kurtardıysa tam işlevini yerine getirmiş demektir.

### Lisans

[MIT](../LICENSE) © Eray Endes

[SECURITY.md](../.github/SECURITY.md#türkçe) | [SUPPORT.md](../.github/SUPPORT.md#türkçe) | [CHANGELOG.md](CHANGELOG.md#türkçe) | [CONTRIBUTING.md](../.github/CONTRIBUTING.md#türkçe) | [CODE_OF_CONDUCT.md](../.github/CODE_OF_CONDUCT.md#türkçe) | [GOVERNANCE.md](../.github/GOVERNANCE.md#türkçe)

Heimdall, Apple Inc.'in yayımladığı App Store Connect OpenAPI spesifikasyonundan üretilir. App Store Connect, TestFlight, StoreKit, Xcode ve Game Center, Apple Inc.'in ticari markalarıdır. Bu proje Apple Inc. ile bağlantılı değildir.
