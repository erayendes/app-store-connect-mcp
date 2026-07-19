# Reviews AI

## English

Three tools ride on top of the `reviews` domain and use **MCP Sampling** — your client's own model, no separate API key:

| Tool | What it does |
|---|---|
| `reviews_ai__draft_response` | Draft a reply to one review. Returns text only. |
| `reviews_ai__triage` | Pull recent reviews and group them by theme (bug, feature request, pricing, praise, spam). |
| `reviews_ai__daily_briefing` | Summarise the last N days of reviews into a short briefing. |

All three are read-only and always loaded — none of them post anything. To publish a reply, review the draft yourself and call `customer_review_responses__create`.

## Türkçe

`reviews` domaininin üzerine binen ve **MCP Sampling** kullanan üç araç var — istemcinin kendi modeli, ayrı bir API anahtarı gerekmiyor:

| Araç | Ne yapar |
|---|---|
| `reviews_ai__draft_response` | Tek bir yoruma yanıt taslağı hazırlar. Sadece metin döner. |
| `reviews_ai__triage` | Son yorumları çeker ve temaya göre gruplar (bug, özellik isteği, fiyatlandırma, övgü, spam). |
| `reviews_ai__daily_briefing` | Son N günün yorumlarını kısa bir özet halinde sunar. |

Üçü de salt okunur ve her zaman yüklüdür — hiçbiri bir şey yayınlamaz. Bir yanıtı yayınlamak için taslağı kendin gözden geçir ve `customer_review_responses__create`'i çağır.
