# AX koşu arşivi — 29 Temmuz 2026

Ajan-döngüde kalibrasyonun ham kayıtları. Okunabilir rapor bir üst dizinde:
[AX-FINDINGS.md](../AX-FINDINGS.md). Bu klasör onun altındaki veri.

Backlog'un ajan deneyimi tarafı — AI-204'ten AI-211'e — sayılarını bu koşudan
alıyor. Yeniden üretmek `npm run ax:agent` demek; bu koşu 19,64M token ve
**$11,64** tuttu, o yüzden arşivlendi.

## Dosyalar

| | |
| :--- | :--- |
| `cal-*.jsonl` | 50 oturum, her satır bir niyet: turlar, token, maliyet, çağrılan araçlar, kabuğa düşme, ajanın son metni |
| `report-50.txt` | 50 oturumun birleşik raporu (ANSI renkli terminal çıktısı) |
| `report-27.txt` | aynı raporun 27 oturumluk erken hâli |
| `contract-982.txt` | 982 operasyonun sözleşme denetimi, 30 Temmuz |
| `agent-artifacts/` | koşu sırasında bir ajanın indirdiği haftalık satış raporu |

## Bu dosyalar bir hesabın gerçek yanıtlarını taşıyor

Depo herkese açık, o yüzden ne yayınlandığı yazılı olsun:

- **İki beta testçisinin e-posta adresi maskelendi** (`beta-tester@example.com`).
  Hesap sahibinin kendi adresleri değillerdi, dolayısıyla bu deponun
  yayınlayacağı veri de değillerdi. Ölçümün hiçbir sayısı onlara bağlı değil.
- **Hesap sahibinin kendi adresleri duruyor** (`cal-12-21.jsonl`), çünkü
  kendisine ait.
- `agent-artifacts/asc-sales-report-weekly-2026-07-26.tsv` **gerçek satış
  verisi**: 19 satır, SKU, ülke, adet ve bir satırda 212,49 gelir.
- İki uygulamanın bundle ID'si ve sayısal Apple ID'si geçiyor; biri
  yayınlanmamış bir uygulama.

Bunlardan biri istenmeden yayınlandıysa dosyayı silmek yetmez — git geçmişinden
de çıkarılması gerekir.
