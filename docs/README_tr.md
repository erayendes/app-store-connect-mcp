# Heimdall — App Store Connect MCP

**App Store Connect hesabınızın tamamı, tek bir araçta.**

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

Apple'ın kendi OpenAPI spesifikasyonu (**App Store Connect API** ve **App Store Server API (StoreKit 2)**) kullanılarak oluşturulmuş **14 profil altında 50 alt profil ve 751 araç** içeren tek bir MCP sunucusudur.

Apple'ın spesifikasyonunda 1011 API operasyonu var. Heimdall, Apple'ın kullanımdan kaldırdığı ya da yeni sürümüyle değiştirdiği 185 tanesini dışarıda bırakıyor. Kalanlardan 710'u araca dönüşüyor, üstüne elle yazılmış 41 araç ekleniyor: toplam 751 araç. Geri kalanlar başka yoldan karşılanıyor: birkaç ham çağrının işini tek çağrıda yapan medya araçlarıyla ya da aynı değişikliği öbür taraftan yapan ikiziyle.

Çoğu muadili API'nin elle seçilmiş bir araç dilimini sunar. Bu kürasyon ihtiyaç duyacağınız o uç noktaya kadar işe yarar. Ama **o uç nokta geldiğinde çözümü bulmak için alternatifler arasında kaybolur gidersiniz.**

**Heimdall** tam tersini yapar, **API'nin tamamını yaptığınız işe göre bölerek verir.** Sürümler, TestFlight, abonelikler ve uygulama içi satın almalar, mağaza sayfası ve yorumlar, Game Center, Xcode Cloud, provisioning, webhook'lar, satış ve finans raporları: her biri bir profil. Büyük profiller alt profillere ayrılır; örneğin `monetization:subscription` yalnızca abonelikleri yükler, gelirle ilgili öbür araçları getirmez. **İstediklerinizi siz seçersiniz** ve istediğiniz zaman ekleyip çıkarırsınız.

**ASC-Core her profille gelir.** Uygulamalarınızı bulmak, bütün araçlarda aramak ve medya araçları hangi işi yaparsanız yapın aynıdır. Bu yüzden ayrı bir sunucuda bir kez çalışırlar; setup bu sunucuyu seçtiklerinizin yanına kaydeder. Medya araçları App Store Connect'in aldığı her ekran görüntüsünü, videoyu, görseli ve dosyayı yönetir: mağaza sayfası medyası, App Clip ve Game Center görselleri, uygulama içi satın alma ve abonelik görselleri, inceleme ekran görüntüleri ve ekleri, şifreleme belgeleri, yol tarifi kapsamı, background asset ve build yükleme dosyaları ([tam liste](MEDIA_TARGETS_tr.md)).

Hangi profilin neyi kapsadığını, araç araç görmek için [Profiller](PROFILES_tr.md) dokümanına bakabilirsiniz.
Ama örneğin *"in-app event için bir araç var mı?"* diye sorarsanız Heimdall o aracın hangi profilde olduğunu zaten söyler.

Eğer **hangi profile ihtiyacınız olduğundan emin değilseniz** [başlangıç paketleri](PROFILES_tr.md#başlangıç-paketleri) işinize yarayabilir.

### Yerelde çalışır

MCP rehberleri genelde uzak HTTP sunucularını önerir.
**Heimdall yerelde çalışır**. App Store Connect için gerekli olan anahtarları Keychain'den okur. Kısa ömürlü bir token imzalar ve doğrudan Apple ile konuşur. Arada hiçbir şey olmaz, anahtarınız sadece sizde kalır.

> [!NOTE]
> Anahtara en az yetkiyi vermeye çalışın. App Store Connect [rol yetkileri](ROLES_tr.md)ni incelediğinizden emin olun.

### Riskli işlemlerde önce sorar

Fiyat değiştirmek, birine Admin yetkisi vermek ya da bir şeyi silmek istediğinizde önce onay ister ve neyin değişeceğini gösterir. Varsayılan olarak iki şekilde sorar:

- **CONFIRM yazmanızı ister:** gelir, silme, kod imzalama ve erişim değişikliklerinde ve geri alınamayan birkaç adımda: bir sürümü yayınlamak, ön siparişi bitirmek, bir build'in süresini bitirmek. Bir build'i tek çağrıda beta gruplarına atamak (`testflight__assign_build_to_groups`) da CONFIRM ister.
- **Evet ya da hayır sorar:** müşteriye, oyuncuya ya da testçiye ulaşan diğer adımlarda: bir şeyi incelemeye göndermek, yeni bir abonelik ya da uygulama içi satın alma sürümü başlatmak, kademeli yayını değiştirmek, bir build'i dış incelemeye göndermek, bir ülkede satışa açmak, ürün sayfası denemesini değiştirmek, bir oyuncu adına skor ya da başarım göndermek.

Geri kalan her şeyde kullandığınız yapay zekâ uygulamasının kendi onay sistemi devrededir.

Detaylar için → [Güvenlik](../.github/SECURITY.md#türkçe).

### Fastlane'in yerine değil, yanında
Heimdall, [Fastlane](https://fastlane.tools/)'in alternatifi değil, tamamlayıcısıdır. **Pipeline için Fastlane, elle yaptığınız her şey için Heimdall**.

### Kurulum

Tek komut.

```bash
npx -y @erayendes/asc-mcp@beta setup
```

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/app-store-connect-mcp/main/assets/setup.gif" alt="Setup sihirbazı: anahtar, Issuer ID, Apple doğrulaması, profil ve alt profil seçimi, anahtarın Keychain'e kaydı" width="720">

Bu 3.0 betası; 3.0.0 çıkana kadar `@beta` onu seçer. 2.8 için `@beta`'yı yazmayın.

Tarayıcıda (önerilen) ya da terminalde devam etmek isteyip istemediğinizi sorar. Bir [App Store Connect API anahtarı](SETUP_tr.md#api-anahtarı-oluşturun) gerekir; tarayıcı sayfası seçtiklerinize göre anahtara hangi rolü vermeniz gerektiğini söyler, yani anahtarı oluşturmadan da setup'ı başlatabilirsiniz. Node.js 20.19 veya üstü gerekir.

Setup iki iş yapar: anahtarınızı kaydeder ve seçtiğiniz profilleri, yanlarına ASC-Core'u da ekleyerek bulduğu her yapay zekâ uygulamasına kaydeder. İkinci kısmı yapay zekânız `register` ile sizin yerinize yapabilir; anahtarı ise her zaman siz, `setup` ile verirsiniz.

Heimdall'ı yapay zekânıza kurdurmak ya da [Xcode 27'de kullanmak](SETUP_tr.md#xcode-27de-heimdall-kullanmak) için diğer tüm kurulum detayları [Kurulum](SETUP_tr.md) dokümanında.

### İsim ve proje hakkında
**Heimdall**, İskandinav mitolojisinde Asgard ile **dokuz diyarı birbirine bağlayan gökkuşağı köprüsü** Bifröst'ün bekçisidir. Bu projedeki görevi, App Store Connect hesabınızı makinenize bağlayan yolları tutmak. Adını oradan alıyor.

Projeyi akşamları tek başıma geliştiriyorum ve ücretsiz, açık kaynak ve MIT lisanslı olarak yayınlıyorum.
Heimdall sizi App Store Connect panelinden kurtardıysa tam işlevini yerine getirmiş demektir.

### Lisans

[MIT](../LICENSE) © Eray Endes

[SECURITY.md](../.github/SECURITY.md#türkçe) | [SUPPORT.md](../.github/SUPPORT.md#türkçe) | [CHANGELOG.md](CHANGELOG.md#türkçe) | [CONTRIBUTING.md](../.github/CONTRIBUTING.md#türkçe) | [CODE_OF_CONDUCT.md](../.github/CODE_OF_CONDUCT.md#türkçe) | [GOVERNANCE.md](../.github/GOVERNANCE.md#türkçe)

Heimdall, Apple Inc.'in yayımladığı App Store Connect OpenAPI spesifikasyonundan üretilir. App Store Connect, TestFlight, StoreKit, Xcode ve Game Center, Apple Inc.'in ticari markalarıdır. Bu proje Apple Inc. ile bağlantılı değildir.
