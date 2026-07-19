# Contributing / Katkıda Bulunma

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

## English

### Getting set up

```bash
npm install
npm run build
npm test
```

### Project layout

| Path | Contains |
|---|---|
| `src/core/` | JWT signing, HTTP client, rate limiting, tool registry |
| `src/generated/` | Generated operations — do not edit by hand |
| `src/storekit/` | App Store Server API tools |
| `src/tools/` | Introspection tools |
| `scripts/generate.ts` | The generator |
| `scripts/domains.ts` | Resource → domain mapping |
| `scripts/describe.ts` | Description synthesis and curated overrides |

### Keeping current with Apple

```bash
npm run spec:update   # fetch the latest OpenAPI spec from Apple
npm run generate      # regenerate tools; prints a diff-friendly report
npm test              # verify nothing broke
```

The generated report shows exactly what changed, so a new Apple API version is a reviewable diff rather than a guess.

### The generated code is generated

Everything in `src/generated/` is produced by `scripts/generate.ts`. Edits there will be overwritten. Change the generator instead, then run `npm run generate` and commit the result — CI fails if the committed output doesn't match what the generator produces.

### The most useful contribution

Apple's OpenAPI specification contains no summaries or descriptions, only tags. Tool descriptions are therefore synthesised in `scripts/describe.ts` — and those descriptions are what an LLM reads when choosing which of 1,263 tools to call.

A generated description like *"Update an app Store version phased release"* is accurate but says nothing about when you'd want it. The curated version says *"Pause, resume or complete a phased release. Set phasedReleaseState to PAUSE, ACTIVE or COMPLETE."*

If you use an operation regularly and the generated description is vague, add an entry to `CURATED` in `scripts/describe.ts`. Small change, real improvement.

### Adding a domain mapping

New Apple resources land in `scripts/domains.ts`. The test suite asserts that no operation falls through to `misc`, so a new Apple spec with new resources will fail CI until they're mapped — which is the intent.

### Pull requests

- One concern per PR.
- `npm test` and `npm run typecheck` must pass.
- If you change the generator, include the regenerated `src/generated/` output and mention how the tool count changed.

## Türkçe

### Kuruluma başlarken

```bash
npm install
npm run build
npm test
```

### Proje yapısı

| Yol | İçeriği |
|---|---|
| `src/core/` | JWT imzalama, HTTP istemcisi, rate limiting, araç registry'si |
| `src/generated/` | Üretilmiş işlemler — elle düzenleme |
| `src/storekit/` | App Store Server API araçları |
| `src/tools/` | İçgözlem araçları |
| `scripts/generate.ts` | Üretici (generator) |
| `scripts/domains.ts` | Kaynak → domain eşlemesi |
| `scripts/describe.ts` | Açıklama sentezi ve elle düzenlenmiş override'lar |

### Apple ile güncel kalmak

```bash
npm run spec:update   # Apple'dan en güncel OpenAPI spec'ini çek
npm run generate      # araçları yeniden üret; diff-dostu bir rapor basar
npm test              # hiçbir şeyin bozulmadığını doğrula
```

Üretilen rapor tam olarak neyin değiştiğini gösterir; böylece yeni bir Apple API sürümü bir tahmin değil, gözden geçirilebilir bir diff olur.

### Üretilmiş kod üretilmiştir

`src/generated/` içindeki her şey `scripts/generate.ts` tarafından üretilir. Orada yapılan düzenlemeler üzerine yazılır. Bunun yerine üreticiyi (generator) değiştir, sonra `npm run generate` çalıştırıp sonucu commit'le — CI, commit'lenen çıktı üreticinin ürettiğiyle eşleşmezse başarısız olur.

### En faydalı katkı

Apple'ın OpenAPI spesifikasyonu özet veya açıklama içermez, sadece etiketler içerir. Bu yüzden araç açıklamaları `scripts/describe.ts`'de sentezlenir — ve bu açıklamalar, bir LLM'in 1.263 araçtan hangisini çağıracağına karar verirken okuduğu şeydir.

*"Update an app Store version phased release"* gibi üretilmiş bir açıklama doğrudur ama ne zaman ihtiyaç duyacağın konusunda hiçbir şey söylemez. Düzenlenmiş versiyon şöyle der: *"Pause, resume or complete a phased release. Set phasedReleaseState to PAUSE, ACTIVE or COMPLETE."*

Bir işlemi düzenli kullanıyorsan ve üretilmiş açıklama belirsizse, `scripts/describe.ts` içindeki `CURATED`'a bir kayıt ekle. Küçük bir değişiklik, gerçek bir iyileştirme.

### Domain eşlemesi ekleme

Yeni Apple kaynakları `scripts/domains.ts`'e eklenir. Test paketi, hiçbir işlemin `misc`'e düşmediğini doğrular; bu yüzden yeni kaynaklar içeren yeni bir Apple spec'i, eşlenene kadar CI'da başarısız olur — amaç da budur.

### Pull request'ler

- Her PR'da tek bir konu.
- `npm test` ve `npm run typecheck` geçmeli.
- Üreticiyi değiştirdiysen, yeniden üretilmiş `src/generated/` çıktısını dahil et ve araç sayısının nasıl değiştiğini belirt.
