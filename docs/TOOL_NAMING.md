# Tool naming / Araç isimlendirmesi

## English

Tool names mirror the resource hierarchy, with the action last:

```
apps__list                              GET  /v1/apps
apps__get                               GET  /v1/apps/{id}
apps__builds__list                      GET  /v1/apps/{id}/builds
app_store_versions__create              POST /v1/appStoreVersions
app_store_version_phased_releases__update  PATCH /v1/appStoreVersionPhasedReleases/{id}
```

| Suffix | Meaning |
|---|---|
| `list` / `get` | Read a collection / a single record |
| `create` / `update` / `delete` | Standard mutations |
| `add` / `remove` / `replace` | Manage a to-many relationship |
| `list_ids` / `get_id` | Read only linked IDs, not full records |
| `metrics` | Aggregated time-series data |

Every tool carries the underlying `METHOD /path` in its description, so you can cross-reference [Apple's API documentation](https://developer.apple.com/documentation/appstoreconnectapi) directly.

### Pagination

List tools accept `next_url` — pass the `links.next` value from a previous response to fetch the following page. The server refuses to follow a cursor pointing anywhere other than Apple's API host.

## Türkçe

Araç isimleri kaynak hiyerarşisini yansıtır, eylem en sonda gelir:

```
apps__list                              GET  /v1/apps
apps__get                               GET  /v1/apps/{id}
apps__builds__list                      GET  /v1/apps/{id}/builds
app_store_versions__create              POST /v1/appStoreVersions
app_store_version_phased_releases__update  PATCH /v1/appStoreVersionPhasedReleases/{id}
```

| Sonek | Anlamı |
|---|---|
| `list` / `get` | Bir koleksiyonu / tek bir kaydı oku |
| `create` / `update` / `delete` | Standart mutasyonlar |
| `add` / `remove` / `replace` | Çoğa-çok ilişkiyi yönet |
| `list_ids` / `get_id` | Sadece bağlı ID'leri oku, tam kayıtları değil |
| `metrics` | Toplu zaman serisi verisi |

Her araç, açıklamasında ilgili `METHOD /path` bilgisini taşır; böylece doğrudan [Apple'ın API dokümantasyonuyla](https://developer.apple.com/documentation/appstoreconnectapi) çapraz kontrol yapabilirsin.

### Sayfalama

Liste araçları `next_url` kabul eder — bir önceki yanıttaki `links.next` değerini vererek sonraki sayfayı çekebilirsin. Sunucu, Apple'ın API host'u dışındaki bir cursor'ı takip etmeyi reddeder.
