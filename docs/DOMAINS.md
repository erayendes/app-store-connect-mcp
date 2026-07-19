# Domains / Domainler

## English

The full 1,263-operation surface costs well over 100k tokens of tool definitions — more than most context windows can spare. So the server loads a **default working set** covering everyday release work, and everything else is one flag away.

| Domain | Tools | Default | Covers |
|---|---:|:---:|---|
| `meta` | 3 | ● | Server introspection and tool discovery |
| `apps` | 174 | ● | Apps, metadata, localizations, availability |
| `versions` | 130 | ● | Version lifecycle, submission, phased release, A/B tests |
| `builds` | 57 | ● | Builds, bundles, icons, pre-release versions |
| `testflight` | 86 | ● | Beta groups, testers, feedback, crash submissions |
| `reviews` | 6 | ● | Customer reviews and developer responses |
| `analytics` | 15 | ● | Sales, finance, analytics reports, performance metrics |
| `subscriptions` | 133 | | Subscriptions, groups, offers, win-back, offer codes |
| `iap` | 89 | | In-app purchases, pricing, offer codes, promotions |
| `marketing` | 70 | | Screenshots, previews, custom pages, in-app events |
| `xcode_cloud` | 59 | | Products, workflows, build runs, artifacts, SCM |
| `provisioning` | 49 | | Bundle IDs, certificates, devices, profiles |
| `game_center` | 337 | | Achievements, leaderboards, matchmaking, challenges |
| `users` | 17 | | Team members, invitations, roles |
| `background_assets` | 15 | | Background assets and asset packs |
| `webhooks` | 12 | | Webhook configuration and delivery diagnostics |
| `pricing` | 11 | | App price schedules and price points |
| `sandbox` | 3 | | Sandbox testers |
| `storekit` | 9 | ○ | App Store Server API — enabled by `ASC_BUNDLE_ID` |

```bash
# Monetization work
--domains=meta,apps,subscriptions,iap,pricing

# Everything
--domains=all
```

**You don't have to memorise this.** Ask *"what App Store Connect domains are available?"* and the server answers from `asc__discover_domains`. Ask *"is there a tool for in-app events?"* and `asc__search_tools` searches all 1,263 operations — including ones not currently loaded — and tells you which flag would load it.

## Türkçe

Tüm 1.263 işlemlik yüzey, araç tanımları için 100 bin token'ın epey üzerinde bir maliyete denk gelir — çoğu context penceresinin ayırabileceğinden fazla. Bu yüzden sunucu, günlük release işlerini kapsayan bir **varsayılan çalışma seti** yükler; geri kalan her şey tek bir bayrak uzağındadır.

| Domain | Araç sayısı | Varsayılan | Kapsam |
|---|---:|:---:|---|
| `meta` | 3 | ● | Sunucu içgözlemi ve araç keşfi |
| `apps` | 174 | ● | Uygulamalar, metadata, yerelleştirmeler, kullanılabilirlik |
| `versions` | 130 | ● | Sürüm yaşam döngüsü, gönderim, kademeli yayın, A/B testler |
| `builds` | 57 | ● | Build'ler, bundle'lar, ikonlar, ön-sürüm build'leri |
| `testflight` | 86 | ● | Beta grupları, testçiler, geri bildirim, crash gönderimleri |
| `reviews` | 6 | ● | Müşteri yorumları ve geliştirici yanıtları |
| `analytics` | 15 | ● | Satış, finans, analitik raporlar, performans metrikleri |
| `subscriptions` | 133 | | Abonelikler, gruplar, teklifler, win-back, kod teklifleri |
| `iap` | 89 | | Uygulama içi satın almalar, fiyatlandırma, kod teklifleri, promosyonlar |
| `marketing` | 70 | | Ekran görüntüleri, önizlemeler, özel sayfalar, uygulama içi etkinlikler |
| `xcode_cloud` | 59 | | Ürünler, iş akışları, build çalıştırmaları, çıktılar, SCM |
| `provisioning` | 49 | | Bundle ID'ler, sertifikalar, cihazlar, profiller |
| `game_center` | 337 | | Başarımlar, liderlik tabloları, eşleştirme, meydan okumalar |
| `users` | 17 | | Ekip üyeleri, davetler, roller |
| `background_assets` | 15 | | Arka plan varlıkları ve varlık paketleri |
| `webhooks` | 12 | | Webhook yapılandırması ve iletim teşhisi |
| `pricing` | 11 | | Uygulama fiyat planları ve fiyat noktaları |
| `sandbox` | 3 | | Sandbox test kullanıcıları |
| `storekit` | 9 | ○ | App Store Server API — `ASC_BUNDLE_ID` ile etkinleşir |

```bash
# Monetizasyon işleri
--domains=meta,apps,subscriptions,iap,pricing

# Hepsi
--domains=all
```

**Bunu ezberlemene gerek yok.** *"Hangi App Store Connect domainleri mevcut?"* diye sor, sunucu `asc__discover_domains`'den yanıtlar. *"Uygulama içi etkinlikler için bir araç var mı?"* diye sor, `asc__search_tools` tüm 1.263 işlemi — şu an yüklenmemiş olanlar dahil — arar ve hangi bayrağın onu yükleyeceğini söyler.
