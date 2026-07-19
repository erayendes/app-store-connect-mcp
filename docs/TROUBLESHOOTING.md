# Troubleshooting / Sorun Giderme

## English

**`401 Unauthorized`** — Key ID, Issuer ID and `.p8` file must all belong to the same key. Confirm the key hasn't been revoked, and that `ASC_PRIVATE_KEY_PATH` is absolute.

**`403 Forbidden`** — The key's role lacks permission for that operation. Sales reports need Finance; user management needs Admin. Apple also restricts programmatic app *creation* on some accounts — create the app in the web UI once, then manage it here.

**`409 Conflict` on a version update** — App Store Connect only allows edits in certain version states. A version that is in review or already released is locked.

**Too many tools / context exhausted** — You're probably running `--domains=all`. Use a narrower set; `asc__search_tools` will still find anything you need.

**Sales report returns base64** — Apple sends these as gzipped TSV, so the server returns `{ contentType, base64 }` rather than mangling it. Decode and gunzip to read.

**`429 Too Many Requests`** — Handled automatically: requests are paced against Apple's 3,600/hour limit and retried with exponential backoff. Persistent 429s mean something else is sharing your key.

## Türkçe

**`401 Unauthorized`** — Key ID, Issuer ID ve `.p8` dosyasının hepsi aynı anahtara ait olmalı. Anahtarın iptal edilmediğini ve `ASC_PRIVATE_KEY_PATH`'in mutlak bir yol olduğunu doğrula.

**`403 Forbidden`** — Anahtarın rolü o işlem için yeterli izne sahip değil. Satış raporları Finance ister; kullanıcı yönetimi Admin ister. Apple bazı hesaplarda programatik uygulama *oluşturmayı* da kısıtlar — uygulamayı bir kez web arayüzünde oluştur, sonra buradan yönet.

**Sürüm güncellemesinde `409 Conflict`** — App Store Connect düzenlemelere yalnızca belirli sürüm durumlarında izin verir. İncelemede olan veya zaten yayınlanmış bir sürüm kilitlidir.

**Çok fazla araç / context tükendi** — Muhtemelen `--domains=all` çalıştırıyorsun. Daha dar bir set kullan; `asc__search_tools` yine de ihtiyacın olan her şeyi bulur.

**Satış raporu base64 döndürüyor** — Apple bunları gzip'li TSV olarak gönderir, sunucu da bozmadan `{ contentType, base64 }` döndürür. Okumak için decode edip gunzip yap.

**`429 Too Many Requests`** — Otomatik yönetilir: istekler Apple'ın saatte 3.600 limitine göre hızlandırılır ve exponential backoff ile tekrar denenir. Israrlı 429'lar, anahtarını başka bir şeyin de kullandığı anlamına gelir.
