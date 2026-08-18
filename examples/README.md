# Examples / Örnekler

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

Heimdall takes plain language. What follows is not a syntax to learn — it is the
set of things people actually ask for, with the profile each one needs and the
part that usually goes wrong.

---

## English

### Starter packs

Register only what the project uses. Every profile carries the core set
(`apps__list`, `apps__get`, `asc__search_tools`, `asc__status`), so whichever
one you install can find an app ID and point you at a tool it does not have.

| You are | Install | Tools |
|:--|:--|--:|
| Release manager | `distribution` + `app-info` | 191 |
| ASO / marketing | `marketing` + `analytics` | 123 |
| QA / TestFlight | `testflight` + `access` | 118 |
| Monetization | `monetization` | 206 |
| Game developer | `game-center` + `distribution` | 316 |
| Customer support | `monetization:storekit` | 18 |
| Build & signing | `provisioning` + `xcode-cloud` | 100 |

```bash
npx -y @erayendes/asc-mcp register distribution app-info
```

Narrower is better than broader: `monetization:subscription-pricing` is 26
tools where `monetization` is 206, and everything you skipped is one
`asc__call` away — the proxy reaches any operation in the catalogue, loaded or
not.

---

### Pull a sales or finance report

> Download last month's sales report and tell me the top five countries by
> units.

Needs `analytics`, and `ASC_VENDOR_NUMBER` set. Two things trip this up:

- **Finance and sales are different reports.** `finance_reports__list` is what
  Apple paid you, by region and currency. `sales_reports__list` is units and
  proceeds, by day or week. "Revenue" usually means the first one.
- **They arrive as gzipped TSV**, not JSON. Ask for `parse=true` and you get
  rows back; without it you get a base64 blob nobody can read. If the report is
  large the full copy is kept as an MCP resource and the reply links to it.

---

### Invite a TestFlight tester

> Add sara@example.com to the Insiders group and give her the latest build.

Needs `access` (groups, testers) and `testflight` (build localizations, review
details). Order matters and the API will not tell you: a tester belongs to the
account first, then to a group, then a build is served to the group. Adding an
email to a group creates the tester if they do not exist yet.

An **external** group needs Apple to review the build before it reaches anyone.
An internal group does not. If testers report seeing nothing, that is usually
the reason.

---

### Create a version and attach a build

> Start version 3.2, attach build 412, and tell me what is still missing before
> I can submit.

Needs `distribution`. The last clause is one call: `preflight__check_version`
reads the version, its build, the review contact, every localization and the
screenshots, and answers with what is missing and which tool fixes each gap.

The two failures worth knowing about, because neither reports itself:

- A build still **PROCESSING** cannot be attached, and Apple says nothing about
  when it will finish.
- `usesNonExemptEncryption` unanswered parks the version at
  `WAITING_FOR_EXPORT_COMPLIANCE` after submission, with no explanation
  attached to it.

---

### Triage reviews and draft replies

> Show me this week's 1-star reviews with no response, and draft replies in the
> reviewer's language.

Needs `marketing`. `reviews_ai__triage` groups them and
`reviews_ai__draft_response` writes a reply — **your** model writes it, using
your client's sampling. There is no second API key and no text leaves for
anyone else's model.

Set `ASC_REVIEWS_BRAND_VOICE`, `ASC_REVIEWS_BANNED_PHRASES` and
`ASC_REVIEWS_SUPPORT_URL` if replies should sound like your team rather than
like a language model.

---

### Update keywords for one language

> Replace the Turkish keywords with these, and leave every other language
> alone.

Needs `distribution`. Keywords live on the *version* localization, one row per
language, capped at 100 characters — and the cap counts commas. Name and
subtitle live somewhere else entirely (`app_info_localizations`), because they
belong to the app rather than to a version.

Ask for one locale by name. A listing with fifty languages is 264 KB fetched
whole, and the useful answer is one row of it.

---

### Manage sandbox testers

> Clear the purchase history for our sandbox account and set its territory to
> Turkey.

Needs `monetization`. Sandbox testers are accounts you create in App Store
Connect, not real Apple IDs; clearing purchase history is what makes a
subscription purchasable again in testing, and it is a separate call from
editing the tester.

---

### Run it in CI

[`ci/release-notes.yml`](ci/release-notes.yml) is a working GitHub Actions
workflow: an agent reads the commits since the last tag, writes release notes,
and puts them in the App Store version's "What's New" field.

Three things about credentials and flags in CI:

- **`ASC_PRIVATE_KEY` as an inline PEM** is the right form here. The Keychain
  does not exist on a runner and a key file on disk is one more thing to clean
  up.
- **`--no-confirm`** is required for any write, and it is honest rather than
  reckless: there is no user to answer a prompt, so the default `strong` gate
  would refuse the write and report it as a refusal. Say so explicitly instead
  of appearing to hang.
- **`--read-only`** for anything that only reports. A job that cannot write
  cannot write by accident, which is worth more than a careful prompt.

Run the whole thing under **`--dry-run`** first. Every write comes back as what
*would* have been sent — method, path, body, risk level — after validation, and
nothing reaches Apple.

---

## Türkçe

### Başlangıç paketleri

Yalnızca projenin kullandığını kaydedin. Her profil çekirdek seti taşıyor
(`apps__list`, `apps__get`, `asc__search_tools`, `asc__status`); yani hangisini
kurarsanız kurun, bir app ID bulabilir ve sahip olmadığı bir aracı size
gösterebilir.

| Siz | Kurun | Araç |
|:--|:--|--:|
| Yayın yöneticisi | `distribution` + `app-info` | 191 |
| ASO / pazarlama | `marketing` + `analytics` | 123 |
| QA / TestFlight | `testflight` + `access` | 118 |
| Monetizasyon | `monetization` | 206 |
| Oyun geliştirici | `game-center` + `distribution` | 316 |
| Müşteri desteği | `monetization:storekit` | 18 |
| Build ve imzalama | `provisioning` + `xcode-cloud` | 100 |

```bash
npx -y @erayendes/asc-mcp register distribution app-info
```

Dar olan geniş olandan iyidir: `monetization:subscription-pricing` 26 araç,
`monetization` 206. Atladığınız her şey bir `asc__call` uzaklıkta — proxy,
yüklü olsun olmasın katalogdaki her işleme ulaşır.

---

### Satış veya finans raporu çek

> Geçen ayın satış raporunu indir ve adet bazında ilk beş ülkeyi söyle.

`analytics` ve `ASC_VENDOR_NUMBER` gerekir. İki nokta takılıyor:

- **Finans ve satış farklı raporlar.** `finance_reports__list` Apple'ın size
  ödediği; bölge ve para birimi bazında. `sales_reports__list` adet ve hasılat;
  gün ya da hafta bazında. "Gelir" genelde birincisi demek.
- **Gzip'li TSV olarak gelirler**, JSON değil. `parse=true` isterseniz satır
  alırsınız; istemezseniz kimsenin okuyamayacağı bir base64 blob. Rapor büyükse
  tam kopyası MCP kaynağı olarak saklanır ve cevap ona bağlanır.

---

### TestFlight testçisi davet et

> sara@example.com'u Insiders grubuna ekle ve en son build'i ver.

`access` (gruplar, testçiler) ve `testflight` (build yerelleştirmeleri,
inceleme detayları) gerekir. Sıra önemli ve API bunu söylemiyor: testçi önce
hesaba, sonra gruba ait olur, build ise gruba sunulur. Bir e-postayı gruba
eklemek, testçi yoksa onu oluşturur.

**Harici** bir grup için Apple'ın build'i incelemesi gerekir; dahili grup için
gerekmez. Testçiler "hiçbir şey görünmüyor" diyorsa sebep genelde budur.

---

### Sürüm oluştur ve build bağla

> 3.2 sürümünü başlat, 412 build'ini bağla ve göndermeden önce ne eksik söyle.

`distribution` gerekir. Son cümle tek çağrı: `preflight__check_version` sürümü,
build'ini, inceleme iletişimini, her yerelleştirmeyi ve ekran görüntülerini
okuyup neyin eksik olduğunu ve her eksiği hangi aracın düzelteceğini söyler.

Bilinmeye değer iki arıza, ikisi de kendini bildirmiyor:

- Hâlâ **PROCESSING** olan bir build bağlanamaz ve Apple ne zaman biteceğini
  söylemez.
- `usesNonExemptEncryption` cevapsızsa sürüm gönderimden sonra
  `WAITING_FOR_EXPORT_COMPLIANCE`'ta bekler; hiçbir açıklama iliştirilmez.

---

### Yorumları triyaj et ve cevap taslağı yaz

> Bu haftanın cevapsız 1 yıldızlı yorumlarını göster ve yorumun dilinde cevap
> taslağı yaz.

`marketing` gerekir. `reviews_ai__triage` onları gruplar,
`reviews_ai__draft_response` cevabı yazar — **sizin** modeliniz yazar,
istemcinizin sampling'i üzerinden. İkinci bir API anahtarı yok ve hiçbir metin
başkasının modeline gitmiyor.

Cevaplar bir dil modeli gibi değil ekibiniz gibi konuşsun istiyorsanız
`ASC_REVIEWS_BRAND_VOICE`, `ASC_REVIEWS_BANNED_PHRASES` ve
`ASC_REVIEWS_SUPPORT_URL` ayarlayın.

---

### Tek dilin anahtar kelimelerini güncelle

> Türkçe anahtar kelimeleri bunlarla değiştir, diğer dillere dokunma.

`distribution` gerekir. Anahtar kelimeler *sürüm* yerelleştirmesinde yaşar, dil
başına bir satır, 100 karakter sınırlı — ve sınır virgülleri de sayar. Ad ve
alt başlık bambaşka bir yerde (`app_info_localizations`), çünkü sürüme değil
uygulamaya aitler.

Tek bir dili adıyla isteyin. Elli dilli bir liste bütün hâlde 264 KB ve işe
yarayan cevap onun tek satırı.

---

### Sandbox test kullanıcılarını yönet

> Sandbox hesabımızın satın alma geçmişini temizle ve ülkesini Türkiye yap.

`monetization` gerekir. Sandbox testçileri App Store Connect'te oluşturduğunuz
hesaplar, gerçek Apple ID değil; satın alma geçmişini temizlemek testte bir
aboneliği yeniden satın alınabilir yapan şey ve testçiyi düzenlemekten ayrı bir
çağrı.

---

### CI'da çalıştır

[`ci/release-notes.yml`](ci/release-notes.yml) çalışan bir GitHub Actions
workflow'u: bir ajan son tag'den beri gelen commit'leri okuyor, sürüm notu
yazıyor ve App Store sürümünün "Yenilikler" alanına koyuyor.

CI'da kimlik ve bayraklar için üç not:

- **`ASC_PRIVATE_KEY` satır içi PEM olarak** buradaki doğru biçim. Runner'da
  Keychain yok ve diskteki bir anahtar dosyası temizlenecek bir şey daha.
- **`--no-confirm`** her yazma için gerekli, ve pervasız değil dürüst: istemi
  cevaplayacak kullanıcı yok, yani varsayılan `strong` kapı yazmayı reddeder ve
  bunu ret olarak bildirir. Takılıyormuş gibi görünmektense açıkça söyleyin.
- **`--read-only`** yalnızca rapor üreten her iş için. Yazamayan bir iş yanlışlıkla
  da yazamaz; bu, dikkatli bir istemden daha değerli.

Önce hepsini **`--dry-run`** ile koşturun. Her yazma, doğrulamadan geçtikten
sonra ne *gönderilecekti* onu döndürür — metot, yol, gövde, risk seviyesi — ve
Apple'a hiçbir şey ulaşmaz.
