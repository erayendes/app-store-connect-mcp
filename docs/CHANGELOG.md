# Changelog / Değişiklik Günlüğü

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/), and the project follows [Semantic Versioning](https://semver.org/). Entries are newest-first.

## English

### [Unreleased]

**Xcode 27.** The repository is now installable as an Xcode plug-in: Settings → Intelligence → Plug-ins → Add from URL, with the repository's address. The repository is a plug-in marketplace — one plug-in per profile plus the skill — so Xcode's "Choose Plug-ins" sheet lets you pick areas the way `setup` does; a single plug-in would have installed all thirteen servers with no way to switch one off. Run `setup` first — Xcode has no config file for `setup` to write, and the key still lives in the Keychain. ([#101](https://github.com/erayendes/app-store-connect-mcp/issues/101))

### [2.3.0] — 2026-08-25

Three things: tools that make submitting a version easier, a safe way to handle store text in many languages, and a way to see what your API key is actually allowed to do.

**Submitting a version is one step now.** It used to take three separate calls in a specific order — and if you stopped after the first one nothing was submitted, though it looked like it had been. `release__submit` does all three in order and tells you which step actually reached Apple.

Before that, `preflight__check_version` answers "is this version ready to submit?" — is the build processed, is export compliance answered, is the demo account filled in, which language is missing a description. One call, and each gap names the tool that fixes it. `release__submit` runs this on its own and refuses to submit if something is missing.

**Three tools for store text across languages.** Audit, draft translation, and bulk apply. None of them writes on its own judgement — the audit reports gaps and stops, the draft only covers languages you name, and the write reads values from a CSV or JSON file you prepared. Keywords especially: the right Turkish keywords are not a translation of the English ones, they are what Turkish users search for. That decision stays yours.

**You can now ask what your key can reach.** Apple never tells you an API key's role, so you usually found out you had a narrow key from an error in the middle of a task. Add `check_capabilities: true` to `asc__status` and it probes five areas and reports which ones answer.

Alongside it, the guide gained a "which role do you actually need" section: App Manager covers day-to-day work, Admin is only needed for user management and the first analytics report, and no API key at all reaches the contracts, tax and banking page.

Also, an unsigned agreement is now told apart from a narrow key. Both returned the same error, but one is fixed with a new key and the other only by the account holder signing the agreement.

**Three workflows as slash commands.** Your client surfaces them as prompts: `release-readiness` (check the version, diff the store text, end in GO or NO-GO), `review-triage` (briefing, triage, a drafted reply per review), and `price-check` (worldwide prices, then what looks unintended). Each stops before the write — submitting, replying and changing a price stay yours. A prompt only appears when every tool it needs is loaded.

**Two more reads.** `asc__account_status` answers "what is waiting on me?" across your apps in one call. `listing__diff_metadata` shows what changed in the store text between the live version and the one you are preparing, language by language.

**Smaller things.** Tool search improved noticeably — 54% of real phrasings now find their tool in the top three, up from 31%. The confirmation prompt names the app it is about to change instead of showing an ID. You can pass apps by name or bundle ID, not just the number. And there is now a `.mcpb` bundle for installing from Claude's Connectors menu.

### [2.2.0] — 2026-08-18

Mostly about telling you the truth: about errors, about sizes, about what a tool actually returns.

**Confirmation is back on for risky writes.** Changing a price, handing out Admin, deleting a certificate, pulling an app from sale — these ask before running. Everything else relies on your client's own approval. It had been off entirely since 2.0.1 because it misfired on clients that cannot show a prompt; now it only guards the four things worth guarding. `--confirm` asks about every write, `--no-confirm` about none.

**A response too big to send is no longer lost.** Large listings used to be cut with a note suggesting a narrower query — the rest simply vanished, and getting it meant paying for the whole thing twice. Now the full response is kept and the reply links to it, so your client can read the rest without any of it passing through the model. Same for the gzipped sales and finance reports, which used to come back unusable when cut.

**Errors answer with fields instead of prose.** An Apple rejection now returns `status`, `retryable`, `suggestedAction` and Apple's own error details, including which field was rejected. Easier to act on than three lines of English.

**The confirmation prompt names things.** It used to show raw JSON with opaque IDs; now it resolves them to names, so you read the subscription instead of `6740…`.

**StoreKit reads can return real fields.** Set `ASC_APPLE_ROOT_CERTS` to Apple's root certificates and the transaction, history and refund tools verify each payload and return decoded fields. Leave it unset and they return the signed payloads as before. Nothing is decoded without being verified first — no certificates ship with this package, since a stale one would turn verification into a silent no.

**Fixed:** the startup banner now counts what your client actually receives. `--include-deprecated` does something in profile mode (it was silently a no-op). `subscriptions.prices.list` no longer claims to show prices it does not carry — the amount lives one `include` away, and the description now says so and points at the one-call alternative.

**Apple changed the spec without changing its version number.** Sixteen things moved under an unchanged v4.4.1. Six narrow what Apple accepts — `SERVICES` is gone from `BundleIdPlatform`, `WinBackOfferPriceInlineCreate` lost its relationships, and five list endpoints tightened their parameters. No tool was added, removed or renamed.

### [2.1.1] — 2026-08-14

**2.1.0 shipped without any of this.** The tag was cut two pull requests behind `main`, so everything below sat unreleased since 10 August. Two are security fixes — upgrade rather than pinning 2.1.0.

**Screenshot upload would send any file it could read.** The path came from the model, and anything pointed at it — a private key, an SSH key, a config file — was read and sent to Apple before anyone learned it was not an image. It now checks the file is really a PNG or JPEG before any network call, with a 50 MB ceiling.

**A download size cap was checked too late**, after the whole body was already in memory. It now rejects an oversized response up front and cancels the transfer at the limit.

**Six reads returned one page as if it were everything.** Analytics reports, subscription groups and both StoreKit histories stopped at the first page and said nothing. A report on page two came back as "no report found"; a subscription past the first 50 groups read as "not found", which is the message that makes someone create a duplicate.

**Fixed:** an ambiguous subscription name no longer silently picks the first match. Price reads report the price actually in effect, not the first row Apple happened to send. `max_rows` no longer drops rows when given a negative number. A failing client registration can no longer delete a working one.

**Security:** results carrying end-user text (reviews, tester feedback) are now marked as data rather than instructions. `ASC_REDACT_PII=1` masks tester names and emails, off by default. The Docker image runs as a non-root user.

### [2.1.0] — 2026-08-10

**Risky writes look risky in the tool list.** About 120 operations that move money, ship a release, change access or break code signing were indistinguishable from harmless ones in a plain tool list. The risk level now appears in their descriptions. Clients that gate on the destructive hint will ask for approval on more tools than before.

**One anchor price, every country derived by Apple.** `pricing__equalize_price` takes one territory and price, and Apple's own currency and tax maths decides every other market — for an app, an in-app purchase or a subscription. Run it under `--dry-run` first: it returns the full derived table before anything is sent.

**Subscription prices for every country in one call.** `pricing__get_subscription_price` used to require a territory, so it could only answer about one country. Omit it now and you get every country grouped by price — measured live, 175 territories collapse to 45 distinct prices, about 1.3k tokens. Country names come with it, since Apple returns them nowhere.

**Two things the raw tools could not do at all.** `listing__upload_screenshot` performs Apple's full reserve/upload/commit sequence — the raw tool only reserves a slot and moves no bytes. `analytics__get_report` downloads the report; the raw chain ends holding a link.

**Fixed:** `listing__get_screenshots` shipped in 2.0.0 unreachable from every profile. `review_submissions__create` was described as submitting a version — it does not; it opens an empty container, and an agent stopping there reported a release it never shipped. The advertised tool count had drifted to three different numbers across four places.

**Added:** a `heimdall` skill, installed by `register`, for clients that read skill files.

### [2.0.1] — 2026-08-09

**Write confirmation is opt-in now.** Turn it on with `--confirm` or `ASC_CONFIRM_WRITES=1`.

It only works where your client can show a confirmation form. A client that claims support but cannot render one answers "declined", which the protocol reports exactly like a user refusing — so the guard was blocking working writes and pointing people at their client's permissions instead of the real cause. Whether the form renders is a per-client fact, so the choice belongs to whoever configures the server.

Nothing is lost when it is off: `--dry-run` still previews, and `--read-only` still removes every mutating tool.

### [2.0.0] — 2026-08-05

**Breaking change — every profile changed.** Which tool belonged to which profile used to be read off the URL, so eight of eleven profiles could not reach their own resources from an app. Membership is hand-curated now.

- **13 profiles**, up from 11. New: `access`, `app-clips`, `testflight`.
- **`user-management` is gone**, split into four. A config still naming it starts anyway and explains the split.
- **Every profile changed size** — `app-info` went from 112 tools to 57. **Check your config**; the tool you want may live elsewhere now.

**Sub-profiles.** A profile narrows with a colon: `monetization` is 204 tools, `monetization:subscription-pricing` is 24. Some tools belong to more than one, so reaching a single tool no longer means loading a whole profile.

**Any tool in the profile, on any client.** `asc__describe` and `asc__call` are there from the start, so nothing depends on your client refreshing its tool list mid-session.

**Setup registers with every client you have.** It detects Claude Code, Claude Desktop, Codex, Antigravity, Cursor, Windsurf and VS Code, and asks which to install into. `register` does the same without a terminal, for an agent installing on your behalf.

**Fixed:** a misspelled filter used to be dropped silently and return the account's first app — which meant edits landed on the wrong app. Tool search returned nothing for non-English queries without saying why, and offered tools the server refuses to load.

### [1.3.0] — 2026-07-28

Safety release. Every write is now schema-checked locally, previewed before confirmation, and never silently resent.

- **Writes are never auto-retried into duplicates.** A write that dies without a response reports an explicit unknown outcome instead of being resent.
- **Real request-body schemas** for all 355 body-taking operations, validated locally — a typo or wrong enum fails with a field path before anything reaches Apple.
- **Impact preview and risk levels.** The confirmation prompt shows the operation, target, account, a summary of changes and a reversibility note. Revenue, destructive, infrastructure and access writes require typing CONFIRM.
- **`--dry-run`** validates and returns what would have been sent, without touching Apple.
- **Reviews-AI hardening:** reviews reach the model as untrusted data, statistics are computed in code, truncation is reported honestly, and brand voice comes from `ASC_REVIEWS_*` env vars.
- `asc__status` gains `check_expirations` — certificates and profiles expiring within 30 days.

### [1.2.0] — 2026-07-26

- **Write confirmation.** Before any mutating tool runs, the server asks you to confirm, so a vague or misread instruction cannot execute unchecked. On by default; `ASC_CONFIRM_WRITES=0` turns it off.

### [1.1.4] — 2026-07-25

- First npm release carrying the lazy key parsing from 1.1.3, so the server boots without valid credentials. No API changes.

### [1.1.3] — 2026-07-23

- **The server starts without a usable private key.** The signing key is parsed on the first API call instead of at startup, so tool discovery works before setup.

### [1.1.2] — 2026-07-22

- Added the `mcpName` field so the server can be published to the official MCP Registry. No functional change.

### [1.1.1] — 2026-07-22

- **CLI messages now show a command that works without a global install** — `npx -y @erayendes/asc-mcp setup` rather than a bare `asc-mcp setup`.

### [1.1.0] — 2026-07-22

- **Rebrand to Heimdall.** The npm package and the command are unchanged.
- **Docs reorganised** — community files under `.github/`, guide and changelog under `docs/`. Counts corrected to 982 operations / 966 paths / 123 deprecated.
- Setup verifies credentials against Apple before saving, and reuses saved ones.
- **Renamed `account-management` to `provisioning`** so the name matches what it does. No alias — re-register if you used the old name.

### [1.0.4] — 2026-07-22

- Fix: setup no longer exits at the bundle-ID prompt after the profile picker.

### [1.0.3] — 2026-07-21

- Interactive profile picker showing each profile's tool count and rough token cost.
- Setup registers the picked profiles directly instead of only printing instructions.
- Drag-and-drop `.p8` path, npx-based config, no real key in examples.

### [1.0.2] — 2026-07-21

- **Profile servers:** one binary serves 11 purpose-scoped MCP servers sharing a single credential set.
- **Shared credential config** at `~/.config/asc-mcp/config.json`.
- Removed 281 duplicate operations, shrinking the surface from 1,263 to 982.
- Fixed sales and finance report endpoints.
- Optional **macOS Keychain** source for the private key, and bilingual **English / Türkçe** docs.

### [1.0.1] — 2026-07-19

- Per-role risk column in the API-key table.
- Scoped npm package name `@erayendes/asc-mcp`.

### [1.0.0] — 2026-07-19

- Initial release: an MCP server for the App Store Connect API, with tools generated from Apple's official OpenAPI specification.
- AI-assisted review tools.

## Türkçe

### [Yayınlanmamış]

**Xcode 27.** Depo artık Xcode eklentisi olarak kurulabiliyor: Settings → Intelligence → Plug-ins → Add from URL, deponun adresiyle. Depo bir eklenti marketi — profil başına bir eklenti artı skill — böylece Xcode'un "Choose Plug-ins" ekranı `setup` gibi alan seçtiriyor; tek eklenti olsaydı on üç sunucu birden kurulur, hiçbiri kapatılamazdı. Önce `setup` çalıştırın — Xcode'un `setup`'ın yazacağı bir config dosyası yok, anahtar hâlâ Keychain'de. ([#101](https://github.com/erayendes/app-store-connect-mcp/issues/101))

### [2.3.0] — 2026-08-25

Üç şey: sürüm göndermeyi kolaylaştıran araçlar, çok dilli mağaza metinleri için güvenli bir akış, ve API anahtarınızın neye yetkisi olduğunu görebilme.

**Sürüm göndermek artık tek adım.** Eskiden üç ayrı çağrı gerekiyordu ve sırası önemliydi — ilkini yapıp durursanız hiçbir şey gönderilmemiş oluyordu ama gönderilmiş gibi görünüyordu. `release__submit` üçünü sırasıyla yapıyor ve hangi adımın gerçekten Apple'a ulaştığını söylüyor.

Öncesinde `preflight__check_version` ile "bu sürüm gönderilmeye hazır mı?" diye sorabilirsiniz. Build işlenmiş mi, ihracat uyumluluğu cevaplanmış mı, demo hesabı doldurulmuş mu, hangi dilde açıklama eksik — tek çağrıda söylüyor ve her eksik için hangi aracın düzelteceğini de yazıyor. `release__submit` bunu kendi başına çalıştırıyor ve eksik varsa göndermiyor.

**Mağaza metinlerini çok dile taşımak için üç araç.** Denetleme, çeviri taslağı ve toplu yazma. Hiçbiri kendi kararıyla bir şey yazmıyor — denetim eksikleri raporlar ve durur, taslak yalnızca adını verdiğiniz diller için üretilir, yazma ise sizin hazırladığınız CSV/JSON dosyasından okur. Anahtar kelimeler özellikle böyle: doğru Türkçe kelimeler, İngilizcelerin çevirisi değil; Türk kullanıcıların aradığı kelimeler. Bu karar sizde kalıyor.

**Anahtarınızın neye erişebildiğini artık sorabilirsiniz.** Apple hiçbir yerde bir API anahtarının rolünü söylemiyor, bu yüzden dar bir anahtarla çalıştığınızı genelde iş ortasında gelen bir hatayla öğreniyordunuz. `asc__status` çağrısına `check_capabilities: true` eklerseniz beş alanı deneyip hangisine erişebildiğinizi söylüyor.

Rehbere de "hangi rol gerçekten gerekli" bölümü eklendi: günlük iş için App Manager yetiyor, Admin yalnızca kullanıcı yönetimi ve ilk analytics raporu için gerekli, sözleşme/vergi/banka sayfasına ise hiçbir API anahtarı ulaşamıyor.

Ayrıca imzalanmamış sözleşme hatası artık dar yetkiden ayırt ediliyor. İkisi de aynı hatayı veriyordu ama biri yeni anahtarla çözülür, diğeri yalnızca hesap sahibinin sözleşmeyi imzalamasıyla.

**Üç iş akışı, slash komutu olarak.** İstemciniz bunları prompt olarak gösteriyor: `release-readiness` (sürümü denetle, mağaza metinlerini karşılaştır, GO ya da NO-GO ile bitir), `review-triage` (brifing, tasnif, yorum başına cevap taslağı) ve `price-check` (dünya genelinde fiyatlar, sonra istenmemiş görünenler). Her biri yazmadan önce duruyor — göndermek, cevaplamak ve fiyat değiştirmek sizde kalıyor. Bir prompt yalnızca ihtiyaç duyduğu tüm araçlar yüklüyse görünüyor.

**İki yeni okuma.** `asc__account_status` "beni ne bekliyor?" sorusunu tüm uygulamalarınız için tek çağrıda cevaplıyor. `listing__diff_metadata` yayındaki sürümle hazırladığınız sürüm arasında mağaza metinlerinin dil dil neyin değiştiğini gösteriyor.

**Küçük şeyler.** Araç arama belirgin biçimde iyileşti — gerçek ifadelerin %54'ü aracını ilk üçte buluyor, önce %31'di. Onay ekranı artık hangi uygulamayı değiştireceğini adıyla yazıyor, kimlik numarasıyla değil. Uygulamaları numara yerine adıyla veya bundle ID'siyle de verebilirsiniz. Ve Claude uygulamasının Connectors menüsünden kurulum için `.mcpb` paketi eklendi.

### [2.2.0] — 2026-08-18

Ağırlıklı olarak doğruyu söylemekle ilgili: hatalar, boyutlar ve bir aracın gerçekte ne döndürdüğü hakkında.

**Riskli yazmalar için onay geri geldi.** Fiyat değiştirmek, Admin yetkisi vermek, sertifika silmek, uygulamayı satıştan kaldırmak — bunlar çalışmadan önce soruyor. Geri kalan her şey istemcinizin kendi onayına bırakılıyor. 2.0.1'den beri tamamen kapalıydı, çünkü onay ekranı gösteremeyen istemcilerde yanlış tetikleniyordu; artık yalnızca korunmaya değer dört şeyi koruyor. `--confirm` her yazmayı sorar, `--no-confirm` hiçbirini.

**Gönderilemeyecek kadar büyük cevap artık kaybolmuyor.** Büyük listeler kesilip "daha dar sorgula" notuyla dönüyordu — geri kalanı yok oluyordu ve ona ulaşmak aynı şeyin bedelini iki kez ödemek demekti. Artık cevabın tamamı saklanıyor ve yanıt ona bağlanıyor; istemciniz geri kalanını modelden hiç geçirmeden okuyabiliyor. Kesildiğinde kullanılamaz hâle gelen gzip'li satış ve finans raporları için de aynısı geçerli.

**Hatalar düzyazı yerine alanlarla cevap veriyor.** Apple'ın reddi artık `status`, `retryable`, `suggestedAction` ve Apple'ın kendi hata detaylarını döndürüyor — hangi alanın reddedildiği dahil. Üç satır İngilizceden daha kolay değerlendirilir.

**Onay ekranı artık isimleri yazıyor.** Eskiden anlamsız kimliklerle ham JSON gösteriyordu; artık onları çözüp adlandırıyor, yani `6740…` yerine aboneliğin adını okuyorsunuz.

**StoreKit okumaları gerçek alanlar döndürebiliyor.** `ASC_APPLE_ROOT_CERTS`'i Apple'ın kök sertifikalarına ayarlarsanız işlem, geçmiş ve iade araçları her yükü doğrulayıp çözülmüş alanları döndürüyor. Ayarlamazsanız eskisi gibi imzalı yükleri döndürüyorlar. Hiçbir şey doğrulanmadan çözülmüyor — pakette sertifika gelmiyor, çünkü bayat bir sertifika doğrulamayı sessiz bir hayıra çevirirdi.

**Düzeltmeler:** açılış banner'ı artık istemcinizin gerçekten aldığı sayıyı yazıyor. `--include-deprecated` profil modunda bir şey yapıyor (sessizce hiçbir şey yapmıyordu). `subscriptions.prices.list` artık taşımadığı fiyatları gösterdiğini iddia etmiyor — tutar bir `include` uzakta duruyor ve açıklama bunu söyleyip tek çağrılık alternatifi gösteriyor.

**Apple spec'i sürüm numarasını değiştirmeden değiştirdi.** Değişmeyen v4.4.1 altında on altı şey oynadı. Altısı Apple'ın kabul ettiğini daraltıyor — `BundleIdPlatform`'dan `SERVICES` kalktı, `WinBackOfferPriceInlineCreate` ilişkilerini kaybetti, beş list endpoint'i parametrelerini sıkılaştırdı. Hiçbir araç eklenmedi, silinmedi veya yeniden adlandırılmadı.

### [2.1.1] — 2026-08-14

**2.1.0 bunların hiçbirini taşımıyordu.** Tag, `main`'in iki pull request gerisinden kesilmişti; yani aşağıdaki her şey 10 Ağustos'tan beri yayınlanmamış hâlde duruyordu. İkisi güvenlik düzeltmesi — 2.1.0'a sabitlemek yerine yükseltin.

**Ekran görüntüsü yükleme, okuyabildiği her dosyayı gönderiyordu.** Dosya yolu modelden geliyordu ve gösterilen her şey — özel anahtar, SSH anahtarı, config dosyası — resim olmadığı anlaşılmadan önce okunup Apple'a gönderiliyordu. Artık ağa çıkmadan önce dosyanın gerçekten PNG veya JPEG olduğunu kontrol ediyor, 50 MB üst sınırla.

**İndirme boyut sınırı çok geç kontrol ediliyordu** — tüm gövde belleğe alındıktan sonra. Artık büyük cevabı baştan reddediyor ve aktarımı sınırda kesiyor.

**Altı okuma, tek sayfayı her şeymiş gibi döndürüyordu.** Analytics raporları, abonelik grupları ve iki StoreKit geçmişi ilk sayfada durup hiçbir şey söylemiyordu. İkinci sayfadaki bir rapor "rapor bulunamadı" olarak dönüyordu; ilk 50 grubun ötesindeki bir abonelik "bulunamadı" diye okunuyordu — ki bu, insana kopyasını yarattıran mesajdır.

**Düzeltmeler:** belirsiz bir abonelik adı artık sessizce ilk eşleşmeyi seçmiyor. Fiyat okumaları gerçekten yürürlükteki fiyatı bildiriyor. `max_rows` negatif sayı verildiğinde artık satır düşürmüyor. Başarısız bir istemci kaydı, çalışan bir kaydı silemiyor.

**Güvenlik:** son kullanıcı metni taşıyan sonuçlar (yorumlar, testçi geri bildirimi) artık talimat değil veri olarak işaretleniyor. `ASC_REDACT_PII=1` testçi adlarını ve e-postalarını maskeliyor, varsayılan kapalı. Docker imajı root olmayan kullanıcıyla çalışıyor.

### [2.1.0] — 2026-08-10

**Riskli yazmalar araç listesinde riskli görünüyor.** Para hareket ettiren, sürüm yayınlayan, erişim değiştiren ya da kod imzalamayı bozan yaklaşık 120 işlem, düz bir araç listesinde zararsızlardan ayırt edilemiyordu. Risk seviyesi artık açıklamalarında yazıyor. Yıkıcılık ipucuna göre kapı koyan istemciler eskisinden daha fazla araçta onay soracak.

**Tek çapa fiyat, gerisini Apple türetiyor.** `pricing__equalize_price` bir ülke ve fiyat alıyor, diğer tüm pazarları Apple'ın kendi kur ve vergi hesabı belirliyor — uygulama, uygulama içi satın alma veya abonelik için. Önce `--dry-run` ile koşturun: hiçbir şey göndermeden türetilmiş tablonun tamamını döndürür.

**Tek çağrıda her ülkenin abonelik fiyatı.** `pricing__get_subscription_price` eskiden ülke zorunlu istiyordu, yani yalnızca tek ülke hakkında cevap verebiliyordu. Artık boş bırakırsanız her ülkeyi fiyata göre gruplanmış alıyorsunuz — canlı ölçümde 175 ülke 45 farklı fiyata iniyor, yaklaşık 1,3k token. Ülke adları da geliyor; Apple bunları hiçbir yerde döndürmüyor.

**Ham araçların hiç yapamadığı iki şey.** `listing__upload_screenshot` Apple'ın rezerve/yükle/onayla dizisinin tamamını yürütüyor — ham araç yalnızca yer ayırıyor, tek bayt taşımıyor. `analytics__get_report` raporu indiriyor; ham zincir elinde bir bağlantıyla bitiyor.

**Düzeltmeler:** `listing__get_screenshots` 2.0.0'da hiçbir profilden erişilemez hâlde çıkmıştı. `review_submissions__create` sürüm gönderiyor diye anlatılıyordu — göndermiyor; boş bir kap açıyor, ve orada duran bir ajan göndermediği bir yayını bildiriyordu. İlan edilen araç sayısı dört yerde üç farklı sayıya kaymıştı.

**Eklendi:** `register` ile kurulan bir `heimdall` skill'i, skill dosyası okuyan istemciler için.

### [2.0.1] — 2026-08-09

**Yazma onayı artık isteğe bağlı.** `--confirm` ya da `ASC_CONFIRM_WRITES=1` ile açılıyor.

Yalnızca istemciniz onay formu gösterebiliyorsa çalışıyor. Desteklediğini söyleyip formu gösteremeyen bir istemci "reddedildi" cevabı veriyor ve protokol bunu kullanıcının reddetmesiyle aynı şekilde bildiriyor — yani koruma, çalışan yazmaları engelliyor ve insanları gerçek sebep yerine kendi istemcilerinin izinlerine yönlendiriyordu. Formun gösterilip gösterilmediği istemciye özgü bir gerçek, o yüzden karar sunucuyu yapılandıran kişide.

Kapalıyken hiçbir şey kaybolmuyor: `--dry-run` hâlâ önizliyor, `--read-only` hâlâ tüm yazma araçlarını kaldırıyor.

### [2.0.0] — 2026-08-05

**Kırıcı değişiklik — her profil değişti.** Hangi aracın hangi profile ait olduğu URL'den okunuyordu, bu yüzden on bir profilin sekizi kendi kaynaklarına bir uygulamadan ulaşamıyordu. Üyelik artık elle küratörlükten geçiyor.

- **13 profil**, önce 11'di. Yeni: `access`, `app-clips`, `testflight`.
- **`user-management` kalktı**, dörde bölündü. Hâlâ onu adlandıran bir yapılandırma yine de başlıyor ve bölünmeyi anlatıyor.
- **Her profilin boyutu değişti** — `app-info` 112 araçtan 57'ye indi. **Yapılandırmanızı kontrol edin**; aradığınız araç artık başka yerde olabilir.

**Alt profiller.** Bir profil iki nokta üst üste ile daralıyor: `monetization` 204 araç, `monetization:subscription-pricing` 24. Bazı araçlar birden fazlasına ait, yani tek bir araca ulaşmak artık koca bir profili yüklemek demek değil.

**Profildeki her araç, her istemcide.** `asc__describe` ve `asc__call` baştan itibaren orada, yani hiçbir şey istemcinizin araç listesini oturum ortasında tazelemesine bağlı değil.

**Setup, makinenizdeki her istemciye kaydediyor.** Claude Code, Claude Desktop, Codex, Antigravity, Cursor, Windsurf ve VS Code'u buluyor ve hangisine kurulacağını soruyor. `register` aynı işi terminal olmadan yapıyor — sizin adınıza kuran bir ajan için.

**Düzeltmeler:** yanlış yazılmış bir filtre sessizce düşürülüp hesabın ilk uygulamasını döndürüyordu — yani düzenlemeler yanlış uygulamaya gidiyordu. Araç araması İngilizce olmayan sorgular için sebebini söylemeden boş dönüyor ve sunucunun yüklemeyi reddettiği araçları öneriyordu.

### [1.3.0] — 2026-07-28

Güvenlik sürümü. Her yazma artık yerelde şema kontrolünden geçiyor, onaydan önce önizleniyor ve asla sessizce yeniden gönderilmiyor.

- **Yazmalar asla kopyaya dönüşecek şekilde yeniden denenmiyor.** Cevapsız ölen bir yazma, yeniden gönderilmek yerine açıkça belirsiz sonuç bildiriyor.
- **Gerçek istek gövdesi şemaları** — gövde alan 355 işlemin hepsi için, yerelde doğrulanıyor; yazım hatası ya da yanlış enum, Apple'a hiçbir şey ulaşmadan alan adıyla düşüyor.
- **Etki önizlemesi ve risk seviyeleri.** Onay ekranı işlemi, hedefi, hesabı, değişikliklerin özetini ve geri alınabilirlik notunu gösteriyor. Gelir, yıkıcı, altyapı ve erişim yazmaları CONFIRM yazmayı gerektiriyor.
- **`--dry-run`** doğrulayıp ne gönderileceğini döndürüyor, Apple'a dokunmadan.
- **Reviews-AI sertleştirmesi:** yorumlar modele güvenilmeyen veri olarak ulaşıyor, istatistikler kodda hesaplanıyor, kırpma dürüstçe bildiriliyor.
- `asc__status`'a `check_expirations` eklendi — 30 gün içinde süresi dolacak sertifika ve profiller.

### [1.2.0] — 2026-07-26

- **Yazma onayı.** Değiştiren herhangi bir araç çalışmadan önce sunucu onay istiyor; böylece belirsiz ya da yanlış anlaşılmış bir talimat kontrolsüz çalışamıyor. Varsayılan açık; `ASC_CONFIRM_WRITES=0` kapatıyor.

### [1.1.4] — 2026-07-25

- 1.1.3'teki tembel anahtar okumasını taşıyan ilk npm sürümü; sunucu geçerli kimlik bilgisi olmadan da açılıyor. API değişikliği yok.

### [1.1.3] — 2026-07-23

- **Sunucu kullanılabilir bir özel anahtar olmadan başlıyor.** İmzalama anahtarı açılışta değil ilk API çağrısında okunuyor, yani araç keşfi kurulumdan önce çalışıyor.

### [1.1.2] — 2026-07-22

- Sunucunun resmî MCP Registry'ye yayınlanabilmesi için `mcpName` alanı eklendi. İşlevsel değişiklik yok.

### [1.1.1] — 2026-07-22

- **CLI mesajları artık global kurulum olmadan da çalışan bir komut gösteriyor** — çıplak `asc-mcp setup` yerine `npx -y @erayendes/asc-mcp setup`.

### [1.1.0] — 2026-07-22

- **Heimdall'a marka değişikliği.** npm paketi ve komut aynı kaldı.
- **Dokümanlar yeniden düzenlendi** — topluluk dosyaları `.github/` altına, rehber ve changelog `docs/` altına. Sayılar düzeltildi: 982 işlem / 966 path / 123 kullanımdan kaldırılmış.
- Setup, kaydetmeden önce kimlik bilgilerini Apple'a karşı doğruluyor ve kayıtlıları yeniden kullanıyor.
- **`account-management`, `provisioning` olarak yeniden adlandırıldı** — ad artık yaptığı işe uyuyor. Takma ad yok; eski adı kullandıysanız yeniden kaydedin.

### [1.0.4] — 2026-07-22

- Düzeltme: setup, profil seçicisinden sonra bundle ID isteminde artık çıkmıyor.

### [1.0.3] — 2026-07-21

- Her profilin araç sayısını ve kabaca token maliyetini gösteren etkileşimli profil seçici.
- Setup, seçilen profilleri yalnızca talimat yazdırmak yerine doğrudan kaydediyor.
- Sürükle-bırak `.p8` yolu, npx tabanlı yapılandırma, örneklerde gerçek anahtar yok.

### [1.0.2] — 2026-07-21

- **Profil sunucuları:** tek bir binary, aynı kimlik bilgisini paylaşan 11 amaca özel MCP sunucusu sunuyor.
- **Ortak kimlik yapılandırması** `~/.config/asc-mcp/config.json` altında.
- 281 tekrar eden işlem kaldırıldı; yüzey 1.263'ten 982'ye indi.
- Satış ve finans raporu endpoint'leri düzeltildi.
- Özel anahtar için isteğe bağlı **macOS Keychain** kaynağı ve iki dilli **İngilizce / Türkçe** doküman.

### [1.0.1] — 2026-07-19

- API anahtarı tablosuna rol bazlı risk sütunu.
- Kapsamlı npm paket adı `@erayendes/asc-mcp`.

### [1.0.0] — 2026-07-19

- İlk sürüm: Apple'ın resmî OpenAPI spesifikasyonundan üretilen araçlarla App Store Connect API için bir MCP sunucusu.
- AI destekli yorum araçları.
