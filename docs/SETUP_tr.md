# Kurulum

🇬🇧 [English](SETUP_en.md) · 🇹🇷 Türkçe

Heimdall, Node.js **20.19+**'in çalıştığı her yerde çalışır — macOS, Linux ve Windows. Yalnızca bir özellik macOS'a özgüdür: `.p8` anahtarını **macOS Keychain**'de saklamak. Linux ve Windows'ta anahtar dosyasının yolu kaydedilir. Bir fark daha var: Claude masaüstü uygulamasına otomatik kayıt şimdilik yalnızca macOS'ta yapılıyor.

## API anahtarı oluşturun
App Store Connect [Users and Access → Integrations → Keys](https://appstoreconnect.apple.com/access/integrations/api) sayfasına gidin ve bir anahtar oluşturup, `.p8` dosyasını indirin. Aynı sayfadan `Key ID` ve `Issuer ID` değerlerini not alın.
Hesapta ilk kez API anahtarı oluşturuluyorsa API erişimini önce Account Holder'ın açması gerekir. Takım anahtarını (Team Keys) yalnızca Account Holder ya da Admin oluşturabilir.

> [!WARNING]
> `.p8` dosyasını yalnızca bir kez indirebilirsiniz. `setup`'ı çalıştırana kadar güvenli bir yerde saklayın.
> Anahtara verdiğiniz rol, yapay zekânın hangi yetkilere sahip olacağını belirler. Kullanım amacınızı karşılayan en dar [rolü seçin](ROLES_tr.md).

## Kurulumu başlatın

**Daha önce görmediğiniz bir MCP kurulum deneyimi yaşamaya hazır olun.**

Terminali açın.
```bash
npx -y @erayendes/asc-mcp@beta setup
```

> [!NOTE]
> Bu sayfa 3.0 betasını anlatıyor; bu yüzden buradaki her komut `@erayendes/asc-mcp@beta` kullanır. Yalın `@erayendes/asc-mcp`, 3.0.0 yayınlanana kadar hâlâ 2.x'tir.

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/app-store-connect-mcp/main/assets/setup.gif" alt="Setup sihirbazı: anahtar, Issuer ID, Apple doğrulaması, profil ve alt profil seçimi, anahtarın Keychain'e kaydı" width="720">

<sub>2.x ile kaydedildi. 3.0'da setup önce tarayıcıda mı terminalde mi devam edeceğinizi, sonra profillerinizi, en son anahtarı sorar.</sub>

### Kimlik bilgisini bir kez kaydedin — Setup sihirbazı

Sihirbaz, tarayıcıda da terminalde de, sizin düşüneceğiniz sırayla sorar:

1. **Neye ihtiyacınız var.** [Profil](PROFILES_tr.md) seçicinin her satırı araç sayısını ve kabaca token maliyetini gösterir; `[Admin key]` ve `[vendor no.]` bunlardan birini isteyen satırları işaretler. Toplam, seçtikçe gösterilir.
2. **Anahtarınız.** Seçtiklerinize göre bunları karşılayan en dar anahtar [rolünü](ROLES_tr.md) söyler. Kayıtlı bir anahtar varsa önce o önerilir, Admin olup olmadığıyla birlikte. Yeni anahtarda `Key ID` ve `Issuer ID` yazarken kontrol edilir, `.p8` yolunu alır (sürükle-bırak da olur) ve hepsini Apple'a doğrulatır; Apple reddederse yeniden girersiniz. `Vendor number` yalnızca satış ve finans raporlarını seçtiyseniz sorulur.
3. **Yapay zekâ uygulamalarınız.** Cihazınızda kurulu olanları bulur. Doğrudan düzenlenen ayar dosyalarının önce yedeği alınır. Claude Desktop açıkken kendi ayarlarını geri yazdığı için kurulum önce onu kapatmanızı ister. Kurulumu Claude Desktop'ın içinden çalıştırıyorsanız, Desktop'ı da kapsaması için Desktop'ı kapatıp kurulumu Terminal'den çalıştırın.
4. **Plan.** Her uygulamada neyin değişeceği gösterilir ve bir kez onay istenir.

Setup anahtar bilgilerini kaydetmeden önce Apple'a doğrular. Apple'ın reddettiği anahtar kaydedilmez; Apple'a ulaşılamazsa setup bunu söyler ve bilgileri yine de kaydeder. Profiller uygulamalara yazılmadan önce ise plan gösterilir ve bir kez onay istenir.

Bittiğinde uygulamanızı yeniden başlatın ve *"App Store Connect bağlantısını kontrol et"* deyin.

> - Anahtar **macOS Keychain**'de saklanır. macOS dışında dosya yoluyla referanslanır.
> - **Gizli olmayan her şey** `~/.config/asc-mcp/config.json`'a yazılır. Her profil bu ortak yapılandırmayı okur.
> - **`setup`'ı daha önce çalıştırdıysanız**, kayıtlı Key ID ve Issuer ID'nizi bulur ve bunları yeniden kullanıp yalnızca profilleri yeniden seçmeyi önerir.
> - **Xcode 27** eklentileri Git URL'sinden kurduğu için bir config dosyası yoktur. Bu yüzden setup sihirbazından kurulamıyor; [kendi bölümü](#xcode-27de-heimdall-kullanmak) var.
> - **Heimdall'ı yapay zekânıza kurduracaksanız** o, profilleri `register` ile kaydedebilir; kullandığınız bir profili hiç kaldırmaz, ama 2.x'ten kalan kayıtları temizler. Anahtar için `setup`'ı siz çalıştırırsınız; kurulum sırasında anahtarınız yapay zekâya hiç gösterilmez. Kurallar [AGENTS.md](../AGENTS.md)'de.

### ASC-Core da gelir

Uygulamalarınızı bulmak, bütün araçlarda aramak, ekran görüntüsü ve video araçları her profilin içinde değil, tek bir sunucuda durur: **ASC-Core**. Setup ve `register` onu her uygulamada profillerinizin yanına ekler; siz seçmezsiniz.

- Bir uygulamadaki Heimdall sunucularından biri salt okunur modda çalışıyorsa ASC-Core da salt okunur eklenir.
- ASC-Core, oradaki sunucularınızla aynı hesabı kullandığı gösterilemeyen bir yapay zekâ uygulamasına eklenmez: sunucular farklı App Store Connect hesapları kullanıyorsa, `env`'lerinde kendi kimlik bilgilerini taşıyorsa ya da ayar dosyası veya kayıtlarından biri tam okunamıyorsa (`envFile` yükleyen bir kayıt da buna girer). Plan bunu nedeniyle birlikte söyler.
- Bir uygulamadan son profil de çıkınca ASC-Core da çıkar.

### Nereye kaydedilir

Hiçbir yapay zekâ uygulaması ortak bir config dosyasını paylaşmaz. `setup`, profillerinizi ASC-Core'la birlikte bulduğu her uygulamaya kaydeder. Böylece her defasında ayrı ayrı işlem yapmanıza gerek kalmaz.

| Uygulama | Nereye | Nasıl yazılır |
|:--|:--|:--|
| Claude Code | `~/.claude.json` | `claude mcp add` |
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` | doğrudan düzenlenir |
| Codex | `~/.codex/config.toml` | `codex mcp add` |
| Antigravity | `~/.gemini/config/mcp_config.json` | doğrudan düzenlenir |
| Cursor | `~/.cursor/mcp.json` | doğrudan düzenlenir |
| Windsurf | `~/.codeium/windsurf/mcp_config.json` | doğrudan düzenlenir |
| VS Code | kullanıcı MCP config'i | `code --add-mcp` |

### Tarayıcıda ya da terminalde

`setup` önce tarayıcıda mı terminalde mi devam etmek istediğinizi sorar. Tarayıcıyı öneririz.

Adımlar aynı, yalnızca daha rahat: neye ihtiyacınız olduğunu seçersiniz, sayfa hangi anahtarı oluşturmanız gerektiğini söyler, `.p8` dosyasını sayfaya sürüklersiniz ve hiçbir şey kaydedilmeden önce neyin değişeceğini görürsünüz.

- Sayfa yalnızca sizin bilgisayarınızda (`127.0.0.1`) ve tek kullanımlık bir linkle açılır. İş bitince ya da 30 dakika kullanılmazsa kendiliğinden kapanır.
- Anahtarınız terminaldeki gibi saklanır. Ayrıntısı [Güvenlik](../.github/SECURITY.md) sayfasında.
- Soruyu atlamak için: `setup --web` ya da `setup --terminal`.

## Profil ekleme ve çıkarma

Her şeyi baştan kurmanız gerekmez. Bu yüzden önce ihtiyacınız olan birkaç profille başlayın, proje ihtiyaç duydukça daha fazlasını ekleyin.

- **Setup'ı yeniden çalıştırın** — `npx -y @erayendes/asc-mcp@beta setup`.
- Kimlik bilgilerinizi yeniden kullanır ve seçicileri tekrar gösterir.
- Uygulamalar ve profiller mevcut hâlleriyle işaretli gelir. İşaretleyin/kaldırın; seçtiğiniz her uygulamada ekler ve siler. İşaretini kaldırdığınız uygulamadan Heimdall silinir.
- 2.x'ten mi geliyorsunuz? 3.0'da profil adları değişti: `app-info` artık `general`, alt profillerin çoğu da yeniden bölündü. Setup eski adları yenilerine çevirmez. Profili artık olmayan kayıtları, Heimdall'ın kendi kayıtlarıysa ve kendi kimlik bilgilerini ya da `envFile` taşımıyorsa siler; diğerlerini listeler ve olduğu gibi bırakır. Ardından profillerinizi yeniden seçersiniz. O zamana kadar eski adlı bir sunucu, bunu söyleyen tek bir araç gösterir. Profil vermeden çalışan eski bir 2.x kaydına setup dokunmaz; onu uygulamanızın MCP ayarlarından kendiniz silin.

## Yüklü olmayan bir araç gerekirse

Yapay zekâya sorun. Heimdall o aracı bulur, gerekirse nasıl ekleneceğini söyler. Bu yüzden az profille kurmaktan çekinmeyin; eksik olan bir şey size zaten söylenecek.

## Xcode 27'de Heimdall kullanmak

> [!IMPORTANT]
> 3.0.0 çıkana kadar Xcode bu adresten 2.8 eklentilerini kurar. 3.0 eklentileri, 3.0 deponun `main` dalına alınınca gelir.

1. Henüz yapmadıysanız bir kez `npx -y @erayendes/asc-mcp@beta setup` komutunu çalıştırın. Anahtar bilgileriniz Keychain'e kaydedilir.
2. Xcode → Settings → Intelligence → Plug-ins → **Add Plug-in…**
3. **Add from URL** seçin, `https://github.com/erayendes/app-store-connect-mcp` yapıştırın.

   <!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
   <img src="https://raw.githubusercontent.com/erayendes/app-store-connect-mcp/main/assets/xcode-add-from-url.png" alt="Xcode'un Add Plug-in ekranı, depo adresi girilmiş" width="560">

4. Xcode her eklenti için onay kutulu bir "Choose Plug-ins" ekranı gösterir. **Heimdall | ASC Skill**'i ve ihtiyacınız olan alanları seçin. Xcode her eklentiyi ayrı çalıştırdığı için her biri ASC-Core araçlarını kendi içinde taşır; ayrı bir çekirdek eklentisi yoktur.

   <!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
   <img src="https://raw.githubusercontent.com/erayendes/app-store-connect-mcp/main/assets/xcode-choose-plugins.png" alt="Xcode'un Choose Plug-ins ekranı: Heimdall profilleri, her biri onay kutulu" width="560">

5. İlk App Store Connect çağrısı, yapay zekânın kullandığı her araç gibi izin sorar.
6. **Bundan sonrası bildiğiniz Heimdall.**
7. Daha sonra da başka bir alan eklemek için 2. adımdan tekrar başlayın.

> [!NOTE]
> Eklentiler Xcode'un kendi sohbetine değil, ajanlara gider. Xcode'un model menüsünden yerleşik bir model değil, bir **ajan** seçin: Claude Agent, Codex ya da Gemini. Seçtiğiniz ajan Heimdall'ı başlatır.

## Gelişmiş ayarlar

Salt okunur mod, değişiklikleri yapmadan denemek, ikinci bir App Store Connect hesabı, setup olmadan çalıştırmak: hepsi [Yapılandırma](CONFIGURATION_tr.md) sayfasında.

## Sorun giderme

| Belirti | Ne oluyor | Çözüm |
|:--|:--|:--|
| **Kurdum ama Claude'da görünmüyor** | Claude, profilleri yalnızca açılışta yükler. Setup, **Claude (Code & Desktop)** seçeneğiyle iki uygulamaya birlikte yazar; biri başarısız olursa bunu sonundaki özette söyler. | Claude'u tamamen kapatıp yeniden açın. Özette hata varsa `setup`'ı yeniden çalıştırın. Windows ve Linux'ta Claude masaüstü uygulamasına otomatik kayıt henüz yok. |
| **`401 Unauthorized`** | Key ID, Issuer ID ve `.p8` aynı anahtara ait değil ya da anahtar iptal edilmiş. | `setup`'ı yeniden çalıştırın ve kayıtlı bilgileri yeniden kullanmak isteyip istemediğinizi sorduğunda **n** deyin. Anahtarı yeniden girin; setup kaydetmeden önce Apple'a doğrular. |
| **`403 Forbidden`** | Anahtarın rolü o işlem için yeterli değil ya da bir App Store Connect sözleşmesi imzalanmamış veya süresi dolmuş. | Yapay zekâya *"Anahtarımın yetkilerini kontrol et"* deyin. Hangi rolün gerektiği [Roller](ROLES_tr.md)'de. Sözleşmeyi yalnızca Account Holder App Store Connect'te kabul edebilir; hiçbir anahtar bunu çözmez. |
| **Sürüm güncellemesinde `409 Conflict`** | App Store Connect düzenlemelere yalnızca belirli sürüm durumlarında izin verir. | İncelemede olan veya yayınlanmış bir sürüm kilitlidir. |
| **İhtiyacım olan araç listede yok** | Başka bir profilde. | Yapay zekâya sorun: *"X için bir araç var mı?"* Hangi profilde olduğunu söyler; onu `setup` ile ekleyin ya da yapay zekânın `register` çalıştırmasına izin verin, sonra uygulamayı yeniden başlatın. |
| **Bir sunucuda, profilinin olmadığını söyleyen tek bir araç var** | Ayarları, önceki bir sürümden kalma bir profil adı içeriyor; örneğin `app-info`. | `setup`'ı yeniden çalıştırıp profillerinizi seçin; eski kaydı siler (`app-info` artık `general`). |
| **Uygulama bulma, araç arama ya da ekran görüntüsü araçları yok** | Bu uygulamada ASC-Core kayıtlı değil. Setup, uygulamadaki sunucular farklı hesaplar kullanıyorsa, `env`'lerinde kendi kimlik bilgilerini taşıyorsa ya da ayar dosyası tam okunamıyorsa onu eklemez. | `setup`'ı yeniden çalıştırıp plana bakın; ASC-Core'un neden eklenmediğini söyler. |
| **`429 Too Many Requests`** | Apple her anahtar için saatlik bir istek sınırı uygular (şu an 3.600); bu sınır dolmuş. | Heimdall kısa bir süre bekleyip kendisi tekrar dener. Sık görüyorsanız aynı anahtarı başka bir araç da kullanıyordur (ör. CI'daki Fastlane); ona ayrı bir anahtar oluşturun. |
| **Yeni uygulama oluşturulamıyor** | Apple'ın API'si yeni uygulama oluşturmaya izin vermez. | Uygulamayı bir kez App Store Connect web sayfasından oluşturun; sonrasını Heimdall'la yönetebilirsiniz. |

## Kaldırma

`setup`'ı yeniden çalıştırın ve Heimdall'ı kaldırmak istediğiniz uygulamaların işaretini kaldırın; Heimdall o uygulamalardan silinir. Kurulum, bir şey yazmadan önce neyin silineceğini gösterir.

İki istisna var: VS Code'da kaldırma komutu olmadığı için Heimdall satırlarını VS Code'un MCP ayarlarından elle silin. Xcode eklentilerini de Xcode → Settings → Intelligence → Plug-ins'ten **Delete Plug-in** ile kaldırın.

Sonra:

```bash
# Ortak ayarlar
rm -rf ~/.config/asc-mcp

# Kullandıysanız, macOS Keychain'deki anahtar
security delete-generic-password -s asc-mcp -a AuthKey_XXXXXXXXXX

# Paket, yalnızca global kurduysanız
npm uninstall -g @erayendes/asc-mcp
```

> [!WARNING]
> API anahtarının kendisini iptal etmek App Store Connect üzerinden yapılır. Yerel kopyayı silmek onu iptal etmez.
