# Development / Geliştirme

## English

```bash
git clone https://github.com/erayendes/app-store-connect-mcp.git
cd app-store-connect-mcp
npm install
npm run build
npm test
```

| Path | Contains |
|---|---|
| `src/core/` | JWT signing, HTTP client, rate limiting, tool registry |
| `src/generated/` | Generated operations — do not edit by hand |
| `src/storekit/` | App Store Server API tools |
| `src/tools/` | Introspection tools |
| `scripts/generate.ts` | The generator |
| `scripts/domains.ts` | Resource → domain mapping |
| `scripts/describe.ts` | Description synthesis and curated overrides |

Apple's spec ships no summaries or descriptions — only tags. `describe.ts` synthesises readable descriptions from the operation structure, with hand-written overrides for the operations people reach for most. Improving those descriptions is the highest-leverage contribution you can make: they're what the model reads when deciding which tool to call.

### Keeping current with Apple

```bash
npm run spec:update   # fetch the latest OpenAPI spec from Apple
npm run generate      # regenerate tools; prints a diff-friendly report
npm test              # verify nothing broke
```

The generated report shows exactly what changed, so a new Apple API version is a reviewable diff rather than a guess.

## Türkçe

```bash
git clone https://github.com/erayendes/app-store-connect-mcp.git
cd app-store-connect-mcp
npm install
npm run build
npm test
```

| Yol | İçeriği |
|---|---|
| `src/core/` | JWT imzalama, HTTP istemcisi, rate limiting, araç registry'si |
| `src/generated/` | Üretilmiş işlemler — elle düzenleme |
| `src/storekit/` | App Store Server API araçları |
| `src/tools/` | İçgözlem araçları |
| `scripts/generate.ts` | Üretici (generator) |
| `scripts/domains.ts` | Kaynak → domain eşlemesi |
| `scripts/describe.ts` | Açıklama sentezi ve elle düzenlenmiş override'lar |

Apple'ın spec'i özet veya açıklama içermez — sadece etiketler. `describe.ts`, işlem yapısından okunabilir açıklamalar sentezler; insanların en çok başvurduğu işlemler için elle yazılmış override'lar da içerir. Bu açıklamaları iyileştirmek yapabileceğin en yüksek etkili katkıdır: model, hangi aracı çağıracağına karar verirken bunları okur.

### Apple ile güncel kalmak

```bash
npm run spec:update   # Apple'dan en güncel OpenAPI spec'ini çek
npm run generate      # araçları yeniden üret; diff-dostu bir rapor basar
npm test              # hiçbir şeyin bozulmadığını doğrula
```

Üretilen rapor tam olarak neyin değiştiğini gösterir; böylece yeni bir Apple API sürümü bir tahmin değil, gözden geçirilebilir bir diff olur.
