# Contributing / Katkıda Bulunma

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

## English

### Getting set up

```bash
git clone https://github.com/erayendes/app-store-connect-mcp.git
cd app-store-connect-mcp
npm install
npm run build
npm test
```

### Project layout

| Path | Contains |
|:--|:--|
| `src/core/` | JWT signing, HTTP client, rate limiting, tool registry |
| `src/generated/` | Generated operations — do not edit by hand |
| `src/storekit/` | App Store Server API tools |
| `src/tools/` | Introspection tools and Reviews AI |
| `src/setup.ts` | Interactive setup wizard |
| `src/profiles.ts` | Profile descriptions and selection parsing |
| `src/clients.ts` | Which MCP clients setup can register with, and where each keeps its config |
| `spec/profiles.csv` | **Which tool belongs to which profile** — hand-curated, the source of truth |
| `scripts/generate.ts` | The generator |
| `scripts/generate-profiles.ts` | Compiles `spec/profiles.csv` into `src/generated/profiles-data.ts` |
| `scripts/domains.ts` | Resource → domain mapping |
| `scripts/describe.ts` | Description synthesis and curated overrides |

### Keeping current with Apple

```bash
npm run spec:update   # fetch the latest OpenAPI spec from Apple
npm run generate      # regenerate tools; prints a diff-friendly report
npm test              # verify nothing broke
```

The generated report (`src/generated/REPORT.txt`) shows exactly what changed — path, tool and per-domain counts — so a new Apple API version is a reviewable diff rather than a guess.

> [!IMPORTANT]
> Everything in `src/generated/` is produced by `scripts/generate.ts`. Edits there are overwritten. Change the generator instead, run `npm run generate`, and commit the result — CI fails if the committed output doesn't match what the generator produces.

### The most useful contribution

Apple's OpenAPI specification contains no summaries or descriptions, only tags. Tool descriptions are therefore synthesised in `scripts/describe.ts` — and those descriptions are what an LLM reads when choosing which of 982 tools to call.

A generated description like *"Update an app Store version phased release"* is accurate but says nothing about when you'd want it. The curated version says *"Pause, resume or complete a phased release. Set phasedReleaseState to PAUSE, ACTIVE or COMPLETE."*

If you use an operation regularly and its generated description is vague, add an entry to `CURATED` in `scripts/describe.ts`. Small change, real improvement.

```bash
npm run ax:report     # which operations still carry Apple's summary, worst domains first
```

### Measuring agent experience

Four issues — findability, path length, response size, confirmation clarity — all came out of one live attempt at one goal, and all four were invisible to a green test suite. They are now counted instead of stumbled upon:

```bash
npm run ax:report     # static: description debt, unhinted filters, unresolved reference types
npm run ax:eval       # live: what each intent really costs in round trips and bytes
```

`tests/ax-audit.test.ts` pins today's numbers as ceilings, so debt can shrink but never grow — a spec bump that adds forty boilerplate endpoints fails CI instead of landing quietly. **When you improve an axis, lower its ceiling in that file**; that is the whole maintenance burden.

`ax:eval` needs credentials and is read-only — it names each intent's write step, never calls it. Without credentials it skips. Set `ASC_EVAL_APP` to choose the app to measure.

### Adding a domain mapping

New Apple resources land in `scripts/domains.ts`. The test suite asserts that no operation falls through to `misc`, so a new Apple spec with new resources fails CI until they're mapped — which is the intent.

**Changing which profile a tool belongs to** means editing `spec/profiles.csv` and running `npm run generate`. The generator errors rather than skips on an unknown operation, a deprecated one, or a duplicate row, and `tests/profile-invariants.test.ts` then checks the result: every profile must reach its own root resources from an app, and every write's `{id}` must have a read that produces it. Both were real bugs before they were tests.

### Pull requests

- One concern per PR.
- `npm test` and `npm run typecheck` must pass.
- If you change the generator, include the regenerated `src/generated/` output and mention how the tool count changed.

By contributing, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Türkçe

### Kuruluma başlarken

```bash
git clone https://github.com/erayendes/app-store-connect-mcp.git
cd app-store-connect-mcp
npm install
npm run build
npm test
```

### Proje yapısı

| Yol | İçeriği |
|:--|:--|
| `src/core/` | JWT imzalama, HTTP istemcisi, rate limiting, araç registry'si |
| `src/generated/` | Üretilmiş işlemler — elle düzenlemeyin |
| `src/storekit/` | App Store Server API araçları |
| `src/tools/` | İçgözlem araçları ve Reviews AI |
| `src/setup.ts` | İnteraktif setup sihirbazı |
| `src/profiles.ts` | Profil açıklamaları ve seçim ayrıştırma |
| `src/clients.ts` | Setup'ın kayıt yapabildiği MCP istemcileri ve her birinin config yeri |
| `spec/profiles.csv` | **Hangi aracın hangi profile ait olduğu** — elle küratörlükten geçmiş, tek doğru kaynak |
| `scripts/generate.ts` | Üretici (generator) |
| `scripts/generate-profiles.ts` | `spec/profiles.csv`'yi `src/generated/profiles-data.ts`'e derler |
| `scripts/domains.ts` | Kaynak → domain eşlemesi |
| `scripts/describe.ts` | Açıklama sentezi ve elle düzenlenmiş override'lar |

### Apple ile güncel kalmak

```bash
npm run spec:update   # Apple'dan en güncel OpenAPI spec'ini çek
npm run generate      # araçları yeniden üret; diff-dostu bir rapor basar
npm test              # hiçbir şeyin bozulmadığını doğrula
```

Üretilen rapor (`src/generated/REPORT.txt`) tam olarak neyin değiştiğini gösterir — path, araç ve domain-başına sayılar — böylece yeni bir Apple API sürümü bir tahmin değil, gözden geçirilebilir bir diff olur.

> [!IMPORTANT]
> `src/generated/` içindeki her şey `scripts/generate.ts` tarafından üretilir. Oradaki düzenlemeler üzerine yazılır. Bunun yerine üreticiyi değiştirin, `npm run generate` çalıştırın ve sonucu commit'leyin — CI, commit'lenen çıktı üreticinin ürettiğiyle eşleşmezse başarısız olur.

### En faydalı katkı

Apple'ın OpenAPI spesifikasyonu özet veya açıklama içermez, sadece etiketler içerir. Bu yüzden araç açıklamaları `scripts/describe.ts`'de sentezlenir — ve bu açıklamalar, bir LLM'in 982 araçtan hangisini çağıracağına karar verirken okuduğu şeydir.

*"Update an app Store version phased release"* gibi üretilmiş bir açıklama doğrudur ama ne zaman ihtiyaç duyacağınız konusunda hiçbir şey söylemez. Düzenlenmiş versiyon şöyle der: *"Pause, resume or complete a phased release. Set phasedReleaseState to PAUSE, ACTIVE or COMPLETE."*

Bir işlemi düzenli kullanıyorsanız ve üretilmiş açıklaması belirsizse, `scripts/describe.ts` içindeki `CURATED`'a bir kayıt ekleyin. Küçük bir değişiklik, gerçek bir iyileştirme.

```bash
npm run ax:report     # hangi işlemler hâlâ Apple'ın özetini taşıyor, en kötü domain'ler önce
```

### Ajan deneyimini ölçmek

Dört sorun — bulunabilirlik, yol uzunluğu, yanıt boyutu, onay netliği — tek bir hedefe yönelik tek bir canlı denemeden çıktı ve dördü de yeşil bir test paketine görünmezdi. Artık rastlanmak yerine sayılıyorlar:

```bash
npm run ax:report     # statik: açıklama borcu, ipuçsuz filtreler, çözülemeyen referans tipleri
npm run ax:eval       # canlı: her niyetin gerçekte kaç round trip ve kaç bayta mal olduğu
```

`tests/ax-audit.test.ts` bugünkü sayıları tavan olarak sabitler; borç azalabilir ama büyüyemez — kırk boilerplate endpoint ekleyen bir spec güncellemesi sessizce girmek yerine CI'ı kırar. **Bir ekseni iyileştirdiğinizde o dosyadaki tavanı düşürün**; bakım yükünün tamamı bu.

`ax:eval` kimlik bilgisi ister ve salt okunurdur — her niyetin yazma adımını isimlendirir, asla çağırmaz. Kimlik bilgisi yoksa atlar. Ölçülecek uygulamayı seçmek için `ASC_EVAL_APP` kullanın.

### Domain eşlemesi ekleme

Yeni Apple kaynakları `scripts/domains.ts`'e eklenir. Test paketi, hiçbir işlemin `misc`'e düşmediğini doğrular; bu yüzden yeni kaynaklar içeren yeni bir Apple spec'i, eşlenene kadar CI'da başarısız olur — amaç da budur.

**Bir aracın hangi profile ait olduğunu değiştirmek**, `spec/profiles.csv`'yi düzenleyip `npm run generate` çalıştırmak demektir. Üretici; bilinmeyen bir işlemde, kullanımdan kalkmış birinde ya da yinelenen satırda atlamaz, hata verir. Sonucu `tests/profile-invariants.test.ts` denetler: her profil kendi kök kaynaklarına bir uygulamadan ulaşabilmeli ve her yazma işleminin `{id}`'sini üreten bir okuma bulunmalı. İkisi de test olmadan önce gerçek birer hataydı.

### Pull request'ler

- Her PR'da tek bir konu.
- `npm test` ve `npm run typecheck` geçmeli.
- Üreticiyi değiştirdiyseniz, yeniden üretilmiş `src/generated/` çıktısını dahil edin ve araç sayısının nasıl değiştiğini belirtin.

Katkıda bulunarak [Davranış Kuralları](CODE_OF_CONDUCT.md)'na uymayı kabul etmiş olursunuz.
