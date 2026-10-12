# Changelog / Değişiklik Günlüğü

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

What changed in each release, newest first. Version numbers follow [Semantic Versioning](https://semver.org/): when the first number changes, something may need your attention after you update.

Her sürümde neyin değiştiği, en yenisi en üstte. Sürüm numaraları [Semantic Versioning](https://semver.org/) kuralına uyar: ilk sayı değiştiyse, güncelledikten sonra bir şeye bakmanız gerekebilir.

## English

### [2.7.0] — 2026-10-12

We moved to version 2.0 of the MCP library. In practice, not much changes in your life. Heimdall was always good anyway 🙂

Heimdall already asked for your confirmation on some requests. With this version we ask a little more often: steps that release your app, such as sending a version to review or releasing it on the App Store, now ask too.

For lucky new users, the first run downloads half as many packages, so a faster install awaits them.

Other than that, it's the Heimdall you know and love.

If your app can't show a confirmation, these release steps no longer run. Set `ASC_CONFIRM_WRITES=0` to go back to the old behaviour.

### [2.6.0] — 2026-10-11

Six new tools, each doing in one step what used to take several. 902 tools in total.

**Change one in-app purchase price.** Pick a country and a new price, and every other price stays as it was. If Heimdall can't read the current prices in full, it changes nothing. It asks you before it runs. (`pricing__set_iap_price`)

**See in-app purchase and app prices by country.** What customers pay and what you receive, today and for any change already scheduled. (`pricing__get_iap_price`, `pricing__get_app_price`)

**Check a subscription before review.** It lists what's missing and the tool that fixes each gap. (`preflight__check_subscription`)

**Send a build to beta groups.** Name the build and the groups. Only builds that are ready go out, and groups that already have it are skipped. (`testflight__assign_build_to_groups`)

**See what testers are saying.** Crashes, feedback and comments from the last two weeks, grouped by build. (`testflight__feedback_digest`)

**Find out why an Xcode Cloud build failed.** The failing steps and tests from the latest failed run. (`ci__diagnose_run`)

**Fixes.** Finding an app by name now works in accounts with more than 200 apps. A package Heimdall depends on (`proxy-addr`) had a security issue; Heimdall never used the affected part, but the fixed version is in.

**Docs.** Setup, profiles, roles and settings each have their own page now, in English and Turkish. The new [Configuration](https://github.com/erayendes/app-store-connect-mcp/blob/main/docs/CONFIGURATION_en.md) page lists every setting, such as read-only mode.

### [2.5.0] — 2026-10-01

**The servers have new names.** They now show up as `ASC-Marketing`, `ASC-AppInfo` and so on, instead of `asc-marketing`. Run `setup` again after you update so your app picks up the new names.

### [2.4.2] — 2026-09-29

**Five new tools from Apple's latest API (v4.5).** App performance overviews join `analytics`. In Game Center you can now list, block and unblock players and scores. Blocking hides a player or a score from everyone else, so Heimdall treats it as a public change ([#111](https://github.com/erayendes/app-store-connect-mcp/pull/111)).

**Safer requests and a safer setup.** A path like `.` or `..` can no longer send a request to a different place than intended. Your app's config files, such as `~/.claude.json`, are now written in one go, so an interrupted `setup` can't leave one half-written. Symlinks and file permissions are kept as they were ([#120](https://github.com/erayendes/app-store-connect-mcp/pull/120)).

**One-click Cursor install** links in the README for `analytics`, `marketing` and `app-info` ([#119](https://github.com/erayendes/app-store-connect-mcp/pull/119)). The MCP SDK is updated to 1.30.1.

### [2.4.1] — 2026-09-23

**Performance metrics and diagnostic logs work again.** Three of these tools always failed with error 406. [@roidayan1](https://github.com/roidayan1) found the problem and fixed it. Thank you! ([#106](https://github.com/erayendes/app-store-connect-mcp/pull/106))

### [2.4.0] — 2026-09-18

**Use Heimdall in Xcode 27.** In Xcode, go to Settings → Intelligence → Plug-ins → Add from URL and paste this repository's address. Every profile is its own plug-in, so you choose what you need in Xcode the same way you do in `setup`. Run `setup` first: Xcode has no config file for it to write, and your key stays in the Keychain ([#101](https://github.com/erayendes/app-store-connect-mcp/issues/101)).

### [2.3.0] — 2026-08-25

Three things: submitting a version gets easier, store text in many languages gets a safe workflow, and you can see what your API key is actually allowed to do.

**Submitting a version is one step now.** It used to take three separate calls in a specific order, and if you stopped after the first one, nothing was submitted even though it looked like it had been. `release__submit` does all three in order and tells you which step actually reached Apple.

Before you submit, ask *"Is this version ready?"* `preflight__check_version` checks whether the build is processed, export compliance is answered, the demo account is filled in, and which language is missing a description. Each gap comes with the tool that fixes it. `release__submit` runs this check on its own and won't submit while something is missing.

**Three tools for store text across languages:** an audit, a draft translation and a bulk update. None of them writes anything on its own judgement. The audit reports gaps and stops, the draft covers only the languages you name, and the update reads from a CSV or JSON file you prepared. Keywords especially: good Turkish keywords aren't a translation of the English ones, they're what people in Turkey search for. That call stays yours.

**Ask what your key can reach.** Apple never tells you an API key's role, so you usually found out your key was too narrow from an error halfway through a task. Add `check_capabilities: true` to `asc__status` and it tries five areas and tells you which ones answer.

The guide also gained a "which role do you actually need" section. App Manager covers day-to-day work. Admin is only needed for managing users and for the first analytics report. No API key can reach the agreements, tax and banking page.

An unsigned agreement is now told apart from a narrow key. Both used to return the same error, but one is fixed with a new key and the other only by the account holder signing the agreement.

**Three workflows as commands.** Type `/` in your app and you'll see `release-readiness` (check the version, compare the store text, end with GO or NO-GO), `review-triage` (a briefing, sorted reviews and a draft reply for each) and `price-check` (prices worldwide, then the ones that look like mistakes). Each stops before changing anything: submitting, replying and changing prices are your call. A command only appears when every tool it needs is installed.

**Two more questions answered in one call.** `asc__account_status` answers *"What's waiting on me?"* across all your apps. `listing__diff_metadata` shows what changed in the store text between the live version and the one you're preparing, language by language.

**Smaller things.** Tool search got noticeably better: 54% of real requests now find the right tool in the top three, up from 31%. The approval prompt names the app it's about to change instead of showing an ID. You can refer to apps by name or bundle ID, not only by number. And there's a `.mcpb` bundle for installing from Claude's Connectors menu.

### [2.2.0] — 2026-08-18

Mostly about telling you the truth: about errors, about sizes, and about what a tool actually returns.

**Risky changes ask first again.** Changing a price, giving someone Admin access, deleting a certificate or taking an app off sale now asks for your approval before it runs. Everything else goes through your app's own approval. This had been switched off since 2.0.1 because it misfired in apps that can't show a confirmation; now it only guards these four kinds of change. `--confirm` asks about every change, `--no-confirm` about none.

**Big answers are no longer lost.** Large lists used to be cut short with a note telling you to ask for less, and the rest was simply gone. Getting it meant paying for the whole thing twice. Now the full answer is kept and the reply links to it, so your app can read the rest without any of it passing through the AI. The same goes for the compressed sales and finance reports, which used to come back unusable when cut.

**Errors tell your AI what to do next.** When Apple rejects a request, the error now says whether it's worth retrying, what to try instead, and which field Apple didn't accept.

**The approval prompt uses names.** It used to show raw JSON full of IDs. Now you read the subscription's name instead of `6740…`.

**Read StoreKit transactions as plain data.** Set `ASC_APPLE_ROOT_CERTS` to Apple's root certificates, and the transaction, history and refund tools check each record's signature and return its contents. Without it, you get the signed records as before. Nothing is opened without being checked first. No certificates ship with Heimdall, because an outdated one would quietly make every check fail.

**Fixed:** the startup message now counts the tools your app actually receives. `--include-deprecated` now works with profiles; it silently did nothing before. The description of `subscriptions.prices.list` no longer promises prices it doesn't return, and points to the one-call alternative.

**Apple quietly changed its API.** Sixteen things changed under the same version number (4.4.1). Six of them narrow what Apple accepts, for example `SERVICES` is no longer a bundle ID platform. No tool was added, removed or renamed.

### [2.1.1] — 2026-08-14

**2.1.0 shipped without any of this.** The release was cut two changes behind, so everything below had been waiting since 10 August. Two of these are security fixes, so update instead of staying on 2.1.0.

**Screenshot upload would send any file it could read.** The file path came from the AI, so anything it pointed at, such as a private key, an SSH key or a config file, was read and sent to Apple before anyone noticed it wasn't an image. Heimdall now checks that the file really is a PNG or JPEG, up to 50 MB, before anything leaves your machine.

**The download size limit was checked too late,** after the whole file was already in memory. Oversized downloads are now refused up front and stopped at the limit.

**Six tools returned the first page as if it were everything.** Analytics reports, subscription groups and both StoreKit histories stopped at page one without saying so. A report on page two came back as "no report found", and a subscription past the first 50 groups came back as "not found", which is exactly the message that makes someone create a duplicate.

**Fixed:** a subscription name that matches more than one subscription no longer quietly picks the first. Price reads show the price that's actually in effect, not whichever row Apple sent first. `max_rows` no longer drops rows when given a negative number. A failed registration in one app can no longer remove a working one.

**Security:** results that contain text written by other people (reviews, tester feedback) are now marked as data, not instructions. `ASC_REDACT_PII=1` hides tester names and email addresses; it's off by default. The Docker image no longer runs as root.

### [2.1.0] — 2026-08-10

**Risky tools are labeled.** About 120 tools that move money, ship a release, change who has access or can break code signing looked just like harmless ones in a tool list. Their descriptions now say how risky they are. Apps that ask before risky actions will ask for more tools than before.

**Set one price, and Apple works out the rest.** Give `pricing__equalize_price` one country and one price, and Apple's own exchange rates and tax rules set every other market, for an app, an in-app purchase or a subscription. Try it with `--dry-run` first: you get the full table of prices before anything is sent.

**A subscription's price in every country, in one call.** `pricing__get_subscription_price` used to need a country, so it could only answer for one. Leave the country out and you get every country, grouped by price. In a real account, 175 countries came down to 45 distinct prices in about 1,300 tokens. Country names are included, which Apple doesn't provide anywhere.

**Two things the raw tools couldn't do at all.** `listing__upload_screenshot` uploads a screenshot from start to finish; the raw tool only reserved a slot and never sent the image. `analytics__get_report` downloads the report; the raw tools stopped at a link.

**Fixed:** `listing__get_screenshots` shipped in 2.0.0 but no profile included it. `review_submissions__create` was described as submitting a version. It doesn't: it only opens an empty submission, and an AI that stopped there reported a release that never happened. The tool count shown in four places had drifted to three different numbers.

**Added:** a `heimdall` skill, installed by `register`, for apps that read skill files.

### [2.0.1] — 2026-08-09

**Asking before changes is now opt-in.** Turn it on with `--confirm` or `ASC_CONFIRM_WRITES=1`.

It only works if your app can show a confirmation. An app that says it can, but then can't, answers "declined", which looks exactly like you saying no. So the check was blocking changes that should have worked, and sending people to their app's permissions instead of the real cause. Whether the confirmation appears depends on the app, so the choice belongs to whoever sets up the server.

Nothing is lost while it's off: `--dry-run` still shows what would change, and `--read-only` still removes every tool that can change something.

### [2.0.0] — 2026-08-05

**Every profile changed. Check your setup.** Which tool belonged to which profile used to be guessed from the API address, so eight of the eleven profiles couldn't reach their own data from an app. Each profile's tools are now chosen by hand.

- **13 profiles**, up from 11. New: `access`, `app-clips` and `testflight`.
- **`user-management` is gone**, split into four. A setup that still names it keeps working and explains where its tools went.
- **Every profile changed size.** `app-info` went from 112 tools to 57, so the tool you want may live somewhere else now.

**Sub-profiles.** Narrow a profile with a colon: `monetization` has 204 tools, `monetization:subscription-pricing` has 24. Some tools belong to more than one, so you no longer have to load a whole profile to reach one tool.

**Any tool in your profile, in any app.** `asc__describe` and `asc__call` are there from the start, so nothing depends on your app refreshing its tool list in the middle of a session.

**Setup installs into every app you have.** It finds Claude Code, Claude Desktop, Codex, Antigravity, Cursor, Windsurf and VS Code, and asks which ones to install into. `register` does the same without a terminal, so your AI can install it for you.

**Fixed:** a misspelled filter used to be dropped without a word, and the account's first app came back instead, so changes could land on the wrong app. Tool search returned nothing for questions not written in English, without saying why, and suggested tools the server wouldn't load.

### [1.3.0] — 2026-07-28

A safety release. Every change is now checked on your machine, shown to you before you approve it, and never sent twice by accident.

- **Changes are never retried into duplicates.** If a change gets no answer from Apple, Heimdall tells you the outcome is unknown instead of sending it again.
- **Mistakes are caught before they reach Apple.** All 355 tools that send data check it locally first, so a typo or a wrong value fails with the exact field name.
- **The approval prompt shows what will happen:** the action, what it applies to, the account, a summary of the changes and whether it can be undone. Changes to revenue, deletions, infrastructure and access require typing CONFIRM.
- **`--dry-run`** shows what would be sent, without touching Apple.
- **Safer review tools:** reviews reach the AI as data, not instructions; the numbers are calculated in code, not by the AI; cut-off results say so; and your brand voice comes from the `ASC_REVIEWS_*` settings.
- `asc__status` can list certificates and profiles that expire within 30 days (`check_expirations`).

### [1.2.0] — 2026-07-26

- **Heimdall asks before it changes anything,** so a vague or misread request can't run unchecked. On by default; `ASC_CONFIRM_WRITES=0` turns it off.

### [1.1.4] — 2026-07-25

- The 1.1.3 fix, now on npm: Heimdall starts even before your key is set up. Nothing else changed.

### [1.1.3] — 2026-07-23

- **Heimdall starts without a working key.** The key is read on the first request instead of at startup, so you can browse the tools before setup.

### [1.1.2] — 2026-07-22

- Heimdall can now be listed in the official MCP Registry. Nothing else changed.

### [1.1.1] — 2026-07-22

- **Messages show a command that works without installing anything first:** `npx -y @erayendes/asc-mcp setup` instead of `asc-mcp setup`.

### [1.1.0] — 2026-07-22

- **The project is now called Heimdall.** The npm package and the command stay the same.
- **Docs reorganized:** community files moved to `.github/`, the guide and this changelog to `docs/`. The operation counts were corrected.
- Setup checks your key with Apple before saving it, and reuses a key you've already saved.
- **`account-management` is now `provisioning`**, a name that matches what it does. The old name doesn't work anymore; if you used it, register again.

### [1.0.4] — 2026-07-22

- Fixed: setup no longer quits at the bundle ID question after you pick your profiles.

### [1.0.3] — 2026-07-21

- A profile picker that shows how many tools each profile has and roughly how many tokens it costs.
- Setup now installs the profiles you pick, instead of only printing instructions.
- You can drag the `.p8` file into the terminal instead of typing its path. The config uses `npx`, and the examples no longer contain a real-looking key.

### [1.0.2] — 2026-07-21

- **Profiles:** Heimdall now runs as 11 smaller servers, one per area, all sharing the same key.
- **One shared settings file** at `~/.config/asc-mcp/config.json`.
- 281 duplicate tools removed, down from 1,263 to 982.
- Fixed the sales and finance reports.
- Your private key can live in the **macOS Keychain**, and the docs are now in **English and Turkish**.

### [1.0.1] — 2026-07-19

- The API key table shows the risk of each role.
- The npm package is now `@erayendes/asc-mcp`.

### [1.0.0] — 2026-07-19

- First release: an MCP server for the App Store Connect API, with tools generated from Apple's official OpenAPI specification.
- Review tools that use your AI to read and answer customer reviews.

## Türkçe

### [2.7.0] — 2026-10-12

MCP kütüphanesinin 2.0 sürümüne geçtik. Pratikte hayatınızda çok fazla şey değişmedi. Zaten Heimdall hep iyiydi 🙂

Bazı isteklerinizde Heimdall onayınızı istiyordu. Yeni sürümle bunu biraz artırdık: sürümü incelemeye göndermek ya da App Store'da yayınlamak gibi yayına çıkaran adımlar da artık onay istiyor.

Yeni şanslı kullanıcılar için ilk çalıştırmada indirilen paket sayısı yarıya indi. Artık onları daha hızlı bir kurulum bekliyor.

Bunun dışında bildiğiniz ve sevdiğiniz Heimdall.

Kullandığınız uygulama onay penceresi açamıyorsa bu yayın adımları artık çalışmaz. Eski davranışa dönmek için `ASC_CONFIRM_WRITES=0` ayarlayın.

### [2.6.0] — 2026-10-11

Eskiden birkaç adım süren işleri tek adımda yapan altı yeni araç. Toplam 902 araç.

**Bir uygulama içi satın almanın fiyatını değiştirin.** Bir ülke ve yeni bir fiyat seçin; diğer bütün fiyatlar olduğu gibi kalır. Heimdall mevcut fiyatları eksiksiz okuyamazsa hiçbir şeyi değiştirmez. Çalışmadan önce size sorar. (`pricing__set_iap_price`)

**Uygulama içi satın alma ve uygulama fiyatlarını ülke ülke görün.** Müşterinin ne ödediği ve size ne kaldığı; bugün ve planlanmış değişikliklerde. (`pricing__get_iap_price`, `pricing__get_app_price`)

**Aboneliği incelemeye göndermeden önce kontrol edin.** Neyin eksik olduğunu ve her eksiği hangi aracın düzelttiğini söyler. (`preflight__check_subscription`)

**Build'i beta gruplarına gönderin.** Build'i ve grupları söyleyin. Yalnızca hazır build'ler gönderilir, build'i zaten alan gruplar atlanır. (`testflight__assign_build_to_groups`)

**Testçilerin ne dediğini görün.** Son iki haftanın kilitlenmeleri, geri bildirimleri ve yorumları, build'e göre gruplanmış. (`testflight__feedback_digest`)

**Xcode Cloud build'inin neden başarısız olduğunu öğrenin.** Son başarısız koşunun hatalı adımları ve geçmeyen testleri. (`ci__diagnose_run`)

**Düzeltmeler.** Uygulamayı adıyla bulmak artık 200'den fazla uygulaması olan hesaplarda da çalışıyor. Heimdall'ın kullandığı bir pakette (`proxy-addr`) güvenlik açığı vardı; Heimdall o kısmı hiç kullanmıyordu, yine de düzeltilmiş sürüm eklendi.

**Dokümanlar.** Kurulum, profiller, roller ve ayarların her birinin artık kendi sayfası var, İngilizce ve Türkçe. Yeni [Yapılandırma](https://github.com/erayendes/app-store-connect-mcp/blob/main/docs/CONFIGURATION_tr.md) sayfası, salt okunur mod gibi bütün ayarları listeliyor.

### [2.5.0] — 2026-10-01

**Sunucuların adları değişti.** Artık `asc-marketing` yerine `ASC-Marketing`, `ASC-AppInfo` gibi görünüyorlar. Güncelledikten sonra `setup`'ı yeniden çalıştırın; kullandığınız uygulama yeni adları ancak böyle görür.

### [2.4.2] — 2026-09-29

**Apple'ın son API sürümünden (v4.5) beş yeni araç.** Uygulama performans özetleri `analytics`'e eklendi. Game Center'da artık oyuncuları ve skorları listeleyebilir, engelleyebilir ve engeli kaldırabilirsiniz. Engellemek bir oyuncuyu ya da skoru herkesten gizlediği için Heimdall bunu herkese açık bir değişiklik sayar ([#111](https://github.com/erayendes/app-store-connect-mcp/pull/111)).

**Daha güvenli istekler, daha güvenli kurulum.** `.` ya da `..` gibi bir yol, isteği artık amaçlanandan başka bir yere gönderemez. Kullandığınız uygulamanın `~/.claude.json` gibi ayar dosyaları artık tek seferde yazılıyor; yarıda kesilen bir `setup` dosyayı yarım bırakamaz. Kısayollar (symlink) ve dosya izinleri olduğu gibi kalır ([#120](https://github.com/erayendes/app-store-connect-mcp/pull/120)).

README'de `analytics`, `marketing` ve `app-info` için **tek tıkla Cursor kurulumu** bağlantıları ([#119](https://github.com/erayendes/app-store-connect-mcp/pull/119)). MCP SDK 1.30.1'e güncellendi.

### [2.4.1] — 2026-09-23

**Performans metrikleri ve tanılama logları yeniden çalışıyor.** Bu araçlardan üçü her seferinde 406 hatası veriyordu. [@roidayan1](https://github.com/roidayan1) sorunu bulup düzeltti. Teşekkürler! ([#106](https://github.com/erayendes/app-store-connect-mcp/pull/106))

### [2.4.0] — 2026-09-18

**Heimdall'ı Xcode 27'de kullanın.** Xcode'da Settings → Intelligence → Plug-ins → Add from URL yolunu izleyip bu deponun adresini yapıştırın. Her profil ayrı bir eklenti; Xcode'da da `setup`'ta olduğu gibi ihtiyacınız olanları seçersiniz. Önce `setup`'ı çalıştırın: Xcode'da Heimdall'ın yazabileceği bir ayar dosyası yok, anahtarınız da Keychain'de kalır ([#101](https://github.com/erayendes/app-store-connect-mcp/issues/101)).

### [2.3.0] — 2026-08-25

Üç şey: sürüm göndermek kolaylaştı, çok dilli mağaza metinleri için güvenli bir akış geldi ve API anahtarınızın neye yetkisi olduğunu artık görebiliyorsunuz.

**Sürüm göndermek artık tek adım.** Eskiden belirli bir sırayla üç ayrı çağrı gerekiyordu; ilkinden sonra durursanız hiçbir şey gönderilmemiş oluyordu ama gönderilmiş gibi görünüyordu. `release__submit` üçünü sırayla yapıyor ve hangi adımın gerçekten Apple'a ulaştığını söylüyor.

Göndermeden önce *"Bu sürüm hazır mı?"* diye sorun. `preflight__check_version` build işlenmiş mi, ihracat uyumluluğu cevaplanmış mı, demo hesap doldurulmuş mu, hangi dilde açıklama eksik, hepsine bakıyor ve her eksiğin yanına onu düzelten aracı yazıyor. `release__submit` bu kontrolü kendisi de yapıyor ve eksik varsa göndermiyor.

**Mağaza metinleri için üç araç:** dil denetimi, çeviri taslağı ve toplu güncelleme. Hiçbiri kendi kararıyla bir şey yazmıyor. Denetim eksikleri bildirip duruyor, taslak yalnızca adını verdiğiniz diller için hazırlanıyor, güncelleme ise sizin hazırladığınız CSV ya da JSON dosyasından okuyor. Anahtar kelimelerde özellikle böyle: iyi Türkçe anahtar kelimeler İngilizcelerin çevirisi değil, Türkiye'deki insanların aradığı kelimelerdir. Bu karar sizde kalıyor.

**Anahtarınızın neye erişebildiğini sorun.** Apple bir API anahtarının rolünü hiçbir yerde söylemiyor; anahtarınızın yetkisinin dar olduğunu genelde işin ortasında gelen bir hatayla öğreniyordunuz. `asc__status`'a `check_capabilities: true` ekleyin; beş alanı deneyip hangilerinin cevap verdiğini söylesin.

Rehbere bir de "gerçekten hangi role ihtiyacınız var" bölümü eklendi. Günlük işler için App Manager yeterli. Admin yalnızca kullanıcı yönetimi ve ilk analytics raporu için gerekiyor. Sözleşme, vergi ve banka sayfasına hiçbir API anahtarı ulaşamıyor.

İmzalanmamış bir sözleşme artık dar yetkili anahtardan ayırt ediliyor. İkisi de aynı hatayı veriyordu; ama biri yeni bir anahtarla çözülür, diğeri yalnızca hesap sahibi sözleşmeyi imzalayınca.

**Komut olarak üç iş akışı.** Kullandığınız uygulamada `/` yazın: `release-readiness` (sürümü kontrol eder, mağaza metinlerini karşılaştırır, GO ya da NO-GO ile biter), `review-triage` (özet, gruplanmış yorumlar ve her yoruma bir cevap taslağı) ve `price-check` (dünya genelinde fiyatlar, ardından hata gibi görünenler). Hepsi bir şeyi değiştirmeden önce durur: göndermek, cevaplamak ve fiyat değiştirmek sizin kararınız. Bir komut yalnızca ihtiyaç duyduğu bütün araçlar kuruluysa görünür.

**İki soru daha, tek çağrıda.** `asc__account_status`, *"Beni ne bekliyor?"* sorusunu bütün uygulamalarınız için cevaplıyor. `listing__diff_metadata`, yayındaki sürümle hazırladığınız sürüm arasında mağaza metinlerinde neyin değiştiğini dil dil gösteriyor.

**Küçük şeyler.** Araç arama belirgin biçimde iyileşti: gerçek isteklerin %54'ü doğru aracı ilk üçte buluyor, önce %31'di. Onay ekranı, değiştireceği uygulamayı kimlik numarasıyla değil adıyla yazıyor. Uygulamaları yalnızca numarayla değil, adıyla ya da bundle ID'siyle de söyleyebilirsiniz. Claude'un Connectors menüsünden kurmak için bir `.mcpb` paketi de var.

### [2.2.0] — 2026-08-18

Bu sürüm çoğunlukla size doğruyu söylemekle ilgili: hatalar, boyutlar ve bir aracın gerçekte ne döndürdüğü hakkında.

**Riskli değişiklikler yine önce soruyor.** Fiyat değiştirmek, birine Admin yetkisi vermek, sertifika silmek ya da bir uygulamayı satıştan kaldırmak artık çalışmadan önce onayınızı istiyor. Geri kalan her şey kullandığınız uygulamanın kendi onayından geçiyor. Bu özellik 2.0.1'den beri kapalıydı, çünkü onay penceresi gösteremeyen uygulamalarda yanlış çalışıyordu; artık yalnızca bu dört tür değişikliği koruyor. `--confirm` her değişiklikte sorar, `--no-confirm` hiçbirinde.

**Büyük cevaplar artık kaybolmuyor.** Uzun listeler "daha azını isteyin" notuyla kesiliyor, geri kalanı yok oluyordu; ona ulaşmak aynı bedeli iki kez ödemek demekti. Artık cevabın tamamı saklanıyor ve yanıt ona bağlantı veriyor; kullandığınız uygulama geri kalanını yapay zekâdan hiç geçirmeden okuyabiliyor. Kesildiğinde kullanılamaz hâle gelen sıkıştırılmış satış ve finans raporları için de aynısı geçerli.

**Hatalar, yapay zekâya ne yapacağını söylüyor.** Apple bir isteği reddettiğinde hata artık yeniden denemeye değip değmediğini, bunun yerine ne denenebileceğini ve Apple'ın hangi alanı kabul etmediğini söylüyor.

**Onay ekranı adları yazıyor.** Eskiden kimlik numaralarıyla dolu ham JSON gösteriyordu. Artık `6740…` yerine aboneliğin adını okuyorsunuz.

**StoreKit işlemlerini düz veri olarak okuyun.** `ASC_APPLE_ROOT_CERTS`'i Apple'ın kök sertifikalarına ayarlarsanız işlem, geçmiş ve iade araçları her kaydın imzasını kontrol edip içeriğini döndürüyor. Ayarlamazsanız imzalı kayıtları eskisi gibi alıyorsunuz. Hiçbir kayıt kontrol edilmeden açılmıyor. Heimdall'la birlikte sertifika gelmiyor, çünkü eskimiş bir sertifika her kontrolü sessizce başarısız kılardı.

**Düzeltmeler:** açılış mesajı artık kullandığınız uygulamanın gerçekten aldığı araçları sayıyor. `--include-deprecated` artık profillerle de çalışıyor; önceden sessizce hiçbir şey yapmıyordu. `subscriptions.prices.list` açıklaması artık döndürmediği fiyatları vaat etmiyor ve tek çağrılık alternatifi gösteriyor.

**Apple API'sini sessizce değiştirdi.** Aynı sürüm numarası (4.4.1) altında on altı şey değişti. Altısı Apple'ın kabul ettiklerini daraltıyor; örneğin `SERVICES` artık bir bundle ID platformu değil. Hiçbir araç eklenmedi, silinmedi ya da adı değişmedi.

### [2.1.1] — 2026-08-14

**2.1.0 bunların hiçbirini içermiyordu.** Sürüm iki değişiklik geriden çıkarılmıştı; aşağıdakilerin hepsi 10 Ağustos'tan beri bekliyordu. İkisi güvenlik düzeltmesi, o yüzden 2.1.0'da kalmak yerine güncelleyin.

**Ekran görüntüsü yükleme, okuyabildiği her dosyayı gönderiyordu.** Dosya yolu yapay zekâdan geliyordu; gösterdiği her şey, özel anahtar, SSH anahtarı ya da bir ayar dosyası, resim olmadığı anlaşılmadan okunup Apple'a gönderiliyordu. Heimdall artık bir şey makinenizden çıkmadan önce dosyanın gerçekten en fazla 50 MB'lık bir PNG ya da JPEG olduğunu kontrol ediyor.

**İndirme boyut sınırı çok geç kontrol ediliyordu,** dosyanın tamamı belleğe alındıktan sonra. Fazla büyük indirmeler artık baştan reddediliyor ve sınıra gelince kesiliyor.

**Altı araç ilk sayfayı her şeymiş gibi döndürüyordu.** Analytics raporları, abonelik grupları ve iki StoreKit geçmişi birinci sayfada durup bunu söylemiyordu. İkinci sayfadaki bir rapor "rapor bulunamadı", ilk 50 grubun ötesindeki bir abonelik "bulunamadı" diye dönüyordu; insana kopyasını oluşturtan mesaj da tam olarak budur.

**Düzeltmeler:** birden fazla aboneliğe uyan bir ad artık sessizce ilkini seçmiyor. Fiyat okumaları, Apple'ın ilk gönderdiği satırı değil, gerçekten geçerli olan fiyatı gösteriyor. `max_rows` negatif bir sayı verildiğinde artık satır düşürmüyor. Bir uygulamadaki başarısız kayıt, çalışan bir kaydı artık silemiyor.

**Güvenlik:** başkalarının yazdığı metni içeren sonuçlar (yorumlar, testçi geri bildirimleri) artık talimat değil veri olarak işaretleniyor. `ASC_REDACT_PII=1` testçi adlarını ve e-posta adreslerini gizliyor; varsayılan olarak kapalı. Docker imajı artık root olarak çalışmıyor.

### [2.1.0] — 2026-08-10

**Riskli araçlar etiketli.** Para hareket ettiren, sürüm yayınlayan, erişimi değiştiren ya da kod imzalamayı bozabilecek yaklaşık 120 araç, bir araç listesinde zararsız olanlardan ayırt edilemiyordu. Açıklamaları artık ne kadar riskli olduklarını söylüyor. Riskli işlemlerden önce soran uygulamalar artık daha fazla araç için soracak.

**Tek fiyat girin, gerisini Apple hesaplasın.** `pricing__equalize_price`'a bir ülke ve bir fiyat verin; diğer bütün pazarları Apple kendi döviz kurları ve vergi kurallarıyla belirlesin. Uygulama, uygulama içi satın alma ya da abonelik için çalışır. Önce `--dry-run` ile deneyin: hiçbir şey gönderilmeden fiyat tablosunun tamamını görürsünüz.

**Bir aboneliğin her ülkedeki fiyatı, tek çağrıda.** `pricing__get_subscription_price` eskiden ülke istiyordu, yani yalnızca tek ülke için cevap verebiliyordu. Ülkeyi boş bırakın, fiyata göre gruplanmış bütün ülkeleri alın. Gerçek bir hesapta 175 ülke 45 farklı fiyata indi, yaklaşık 1.300 token tuttu. Ülke adları da geliyor; Apple bunları hiçbir yerde vermiyor.

**Ham araçların hiç yapamadığı iki şey.** `listing__upload_screenshot` bir ekran görüntüsünü baştan sona yüklüyor; ham araç yalnızca yer ayırıyor, görüntüyü hiç göndermiyordu. `analytics__get_report` raporu indiriyor; ham araçlar bir bağlantıda kalıyordu.

**Düzeltmeler:** `listing__get_screenshots` 2.0.0'da çıktı ama hiçbir profilde yoktu. `review_submissions__create` sürüm gönderiyor diye anlatılıyordu. Göndermiyor, yalnızca boş bir başvuru açıyor; orada duran bir yapay zekâ, hiç gerçekleşmemiş bir yayını bildiriyordu. Dört yerde gösterilen araç sayısı üç farklı sayıya kaymıştı.

**Eklendi:** skill dosyası okuyan uygulamalar için `register` ile kurulan bir `heimdall` skill'i.

### [2.0.1] — 2026-08-09

**Değişiklikten önce sormak artık isteğe bağlı.** `--confirm` ya da `ASC_CONFIRM_WRITES=1` ile açılır.

Yalnızca kullandığınız uygulama bir onay penceresi gösterebiliyorsa çalışır. Gösterebildiğini söyleyip gösteremeyen bir uygulama "reddedildi" cevabı verir; bu da tıpkı sizin hayır demeniz gibi görünür. Yani kontrol, çalışması gereken değişiklikleri engelliyor ve insanları asıl sebep yerine uygulamalarının izinlerine yönlendiriyordu. Onay penceresinin görünüp görünmemesi uygulamaya bağlı olduğu için karar sunucuyu kuran kişide.

Kapalıyken hiçbir şey kaybolmaz: `--dry-run` neyin değişeceğini hâlâ gösterir, `--read-only` bir şeyi değiştirebilen bütün araçları hâlâ kaldırır.

### [2.0.0] — 2026-08-05

**Bütün profiller değişti. Kurulumunuzu kontrol edin.** Hangi aracın hangi profile ait olduğu API adresinden tahmin ediliyordu; bu yüzden on bir profilin sekizi kendi verisine bir uygulamadan ulaşamıyordu. Her profilin araçları artık elle seçiliyor.

- **13 profil**, önce 11'di. Yeni: `access`, `app-clips` ve `testflight`.
- **`user-management` kalktı**, dörde bölündü. Hâlâ onu kullanan bir kurulum çalışmaya devam eder ve araçların nereye gittiğini anlatır.
- **Her profilin boyutu değişti.** `app-info` 112 araçtan 57'ye indi; aradığınız araç artık başka bir profilde olabilir.

**Alt profiller.** Bir profili iki nokta üst üsteyle daraltın: `monetization` 204 araç, `monetization:subscription-pricing` 24 araç. Bazı araçlar birden fazla alt profilde var; tek bir araca ulaşmak için artık koca bir profili yüklemeniz gerekmiyor.

**Profildeki her araç, her uygulamada.** `asc__describe` ve `asc__call` baştan beri orada; hiçbir şey kullandığınız uygulamanın araç listesini oturum ortasında yenilemesine bağlı değil.

**Setup, sahip olduğunuz her uygulamaya kuruyor.** Claude Code, Claude Desktop, Codex, Antigravity, Cursor, Windsurf ve VS Code'u bulup hangilerine kurulacağını soruyor. `register` aynı işi terminal olmadan yapıyor; böylece yapay zekâ sizin yerinize kurabiliyor.

**Düzeltmeler:** yanlış yazılmış bir filtre tek kelime edilmeden yok sayılıyor ve hesabın ilk uygulaması dönüyordu; yani değişiklikler yanlış uygulamaya gidebiliyordu. Araç arama, İngilizce yazılmamış sorularda sebebini söylemeden boş dönüyor ve sunucunun yüklemeyeceği araçları öneriyordu.

### [1.3.0] — 2026-07-28

Bir güvenlik sürümü. Her değişiklik artık makinenizde kontrol ediliyor, onaylamadan önce size gösteriliyor ve asla yanlışlıkla iki kez gönderilmiyor.

- **Değişiklikler kopyaya dönüşecek şekilde yeniden denenmiyor.** Apple bir değişikliğe cevap vermezse Heimdall onu tekrar göndermek yerine sonucun belirsiz olduğunu söylüyor.
- **Hatalar Apple'a ulaşmadan yakalanıyor.** Veri gönderen 355 aracın hepsi önce veriyi yerelde kontrol ediyor; bir yazım hatası ya da yanlış değer, alanın adıyla birlikte duruyor.
- **Onay ekranı ne olacağını gösteriyor:** işlem, neye uygulanacağı, hesap, değişikliklerin özeti ve geri alınıp alınamayacağı. Gelir, silme, altyapı ve erişim değişiklikleri için CONFIRM yazmanız gerekiyor.
- **`--dry-run`**, Apple'a dokunmadan neyin gönderileceğini gösteriyor.
- **Daha güvenli yorum araçları:** yorumlar yapay zekâya talimat değil veri olarak ulaşıyor, sayılar yapay zekâ değil kod tarafından hesaplanıyor, kesilen sonuçlar bunu söylüyor ve marka diliniz `ASC_REVIEWS_*` ayarlarından geliyor.
- `asc__status`, 30 gün içinde süresi dolacak sertifikaları ve profilleri listeleyebiliyor (`check_expirations`).

### [1.2.0] — 2026-07-26

- **Heimdall bir şeyi değiştirmeden önce soruyor;** belirsiz ya da yanlış anlaşılmış bir istek kontrolsüz çalışamıyor. Varsayılan olarak açık; `ASC_CONFIRM_WRITES=0` kapatır.

### [1.1.4] — 2026-07-25

- 1.1.3'teki düzeltme artık npm'de: Heimdall, anahtarınız ayarlanmadan da açılıyor. Başka bir şey değişmedi.

### [1.1.3] — 2026-07-23

- **Heimdall çalışan bir anahtar olmadan da başlıyor.** Anahtar açılışta değil ilk istekte okunuyor; kurulumdan önce de araçlara göz atabilirsiniz.

### [1.1.2] — 2026-07-22

- Heimdall artık resmî MCP Registry'de listelenebiliyor. Başka bir şey değişmedi.

### [1.1.1] — 2026-07-22

- **Mesajlar, önce bir şey kurmadan çalışan komutu gösteriyor:** `asc-mcp setup` yerine `npx -y @erayendes/asc-mcp setup`.

### [1.1.0] — 2026-07-22

- **Projenin adı artık Heimdall.** npm paketi ve komut aynı kaldı.
- **Dokümanlar yeniden düzenlendi:** topluluk dosyaları `.github/`'a, rehber ve bu değişiklik günlüğü `docs/`'a taşındı. İşlem sayıları düzeltildi.
- Setup, anahtarınızı kaydetmeden önce Apple'la kontrol ediyor ve daha önce kaydettiğiniz anahtarı yeniden kullanıyor.
- **`account-management` artık `provisioning`**; yaptığı işe uyan bir ad. Eski ad artık çalışmıyor; kullandıysanız yeniden kaydedin.

### [1.0.4] — 2026-07-22

- Düzeltme: setup, profillerinizi seçtikten sonra bundle ID sorusunda artık kapanmıyor.

### [1.0.3] — 2026-07-21

- Her profilde kaç araç olduğunu ve yaklaşık kaç token tuttuğunu gösteren bir profil seçici.
- Setup, seçtiğiniz profilleri yalnızca talimat yazdırmak yerine doğrudan kuruyor.
- `.p8` dosyasının yolunu yazmak yerine dosyayı terminale sürükleyebilirsiniz. Ayarlar `npx` kullanıyor, örneklerde de artık gerçek gibi görünen bir anahtar yok.

### [1.0.2] — 2026-07-21

- **Profiller:** Heimdall artık her alan için bir tane olmak üzere aynı anahtarı paylaşan 11 küçük sunucu olarak çalışıyor.
- `~/.config/asc-mcp/config.json` adresinde **tek, ortak bir ayar dosyası.**
- 281 tekrar eden araç kaldırıldı; 1.263'ten 982'ye indi.
- Satış ve finans raporları düzeltildi.
- Özel anahtarınız **macOS Keychain**'de durabiliyor; dokümanlar artık **İngilizce ve Türkçe**.

### [1.0.1] — 2026-07-19

- API anahtarı tablosu her rolün riskini gösteriyor.
- npm paketinin adı artık `@erayendes/asc-mcp`.

### [1.0.0] — 2026-07-19

- İlk sürüm: Apple'ın resmî OpenAPI spesifikasyonundan üretilen araçlarla App Store Connect API için bir MCP sunucusu.
- Müşteri yorumlarını yapay zekânızla okuyup cevaplayan yorum araçları.
