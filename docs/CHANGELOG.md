# Changelog / Değişiklik Günlüğü

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/), and the project follows [Semantic Versioning](https://semver.org/). Entries are newest-first.

## English

### [Unreleased]

#### Profiles are curated, not derived

**Breaking — every profile changed.** Which tool belonged to which profile used to be read off the URL, so every relationship hanging off an app (`/v1/apps/{id}/subscriptionGroups` and the like) landed in `app-info` while the resources themselves lived elsewhere. Eight of eleven profiles could not reach their own resources from an app. Membership is hand-curated in `spec/profiles.csv` now and generated into the code.

- **13 profiles, up from 11.** New: `access`, `app-clips`, `testflight`.
- **`user-management` is gone**, split into `access`, `testflight`, `app-clips` and `monetization`. No tool was lost, and there is no alias — one would rebuild the bloated profile. A config still naming it **starts**: the server comes up with a single tool explaining the split, so the answer reaches the conversation instead of a log nobody reads.
- **Every profile changed size.** `app-info` goes from 112 tools to 57. **Check your config** — the tool you reached for in `asc-app-info` may now live next door.
- **Two invariants are enforced in CI:** every profile must reach its own root resources from an app, and every write's `{id}` must have a read that produces it.

#### Sub-profiles

A profile narrows with a colon: `monetization` is 204 tools, or take `monetization:subscription-pricing` at 24 and still get the one-call price macro. 32 sub-profiles across six profiles.

Some tools belong to more than one, so reaching a single tool no longer means loading a whole profile. Screenshot and preview sets hang off three different parents, and those 18 tools now sit under all three — which is what lets `distribution` upload a screenshot instead of only listing sets (109 tools to 127).

The setup picker unfolds a checked profile's sub-profiles under the cursor, all on, and writes the argument for you. `asc__status` reports which are loaded and roughly what they cost.

#### Any tool in the profile, on any client

**`asc__describe` + `asc__call`** are present from the start, so nothing depends on a client noticing a revised tool list mid-session. Measured with one prompt in three clients: Claude Code used a newly loaded tool in the same turn; Codex reported that "the session tool list never made the new tools callable" and gave up. Codex and Antigravity both finish that task in one turn now. `asc__call` is read-only and says so in its annotation, which is what stops a client from blocking it; writes keep their own tool names, where the client's approval and Heimdall's typed confirmation both still apply.

**`asc__load`** adds a sub-profile mid-session for clients that do refresh. Hand-written families (StoreKit, reviews-AI, pricing macros) still need a restart, and the reply says so.

#### Reviews-AI no longer needs MCP Sampling

The MCP 2026-07-28 revision deprecates Sampling (SEP-2577), and `draft_response`, `triage` and `daily_briefing` used to depend on it: they called `server.createMessage`, and on any client that never declared the sampling capability they never even appeared in `tools/list` — dead on the clients that need onboarding help the most. They now fetch the same reviews from Apple as before, but return the raw data as `structuredContent` plus a written instruction, in `content`, telling the HOST model — the one already talking to you — what to produce: a reply draft, a theme triage, a daily briefing. No `server.createMessage`, no capability check, so the three tools show up in every client's tool list now, including ones that never supported sampling. The value proposition hasn't moved: still no second API key, your own model still writes the text. Per the MCP spec, the structured data is also serialized into a JSON text block alongside the instruction, so a client that doesn't forward `structuredContent` into the model's context still has the data available; each tool now declares an `outputSchema` describing that shape.

#### Setup registers with every client, not just Claude Code

`setup` knew one command, `claude mcp add`. On a machine with Codex and Cursor it finished by printing JSON for the user to translate into TOML — a format Codex does not read.

- **It asks which clients**, with everything found on the machine pre-checked: Claude Code, Claude Desktop, Codex, Antigravity, Cursor, Windsurf, VS Code. Claude Code and Claude Desktop are one row and two files, because neither reads the other's config.
- **The vendor's own command writes where one exists** (`claude`, `codex`, `code --add-mcp`). Plain JSON configs are edited directly and backed up first; one that cannot be parsed is left untouched and reported with a block to paste. A client failing never stops the others.
- **`register` is the same work without a terminal**, for an AI agent installing on your behalf: `asc-mcp register monetization:subscription-pricing analytics`. It asks for nothing, never touches credentials, and only adds — `setup` is what removes, because removing is safe when you are looking at the list you are editing and an agent is not.

> [!NOTE]
> ChatGPT's own connectors accept only remote HTTPS servers, so Heimdall cannot appear there; it runs on your machine over stdio, which is why the private key never leaves it. The Codex entry covers the CLI, the IDE extension and the Codex side of the ChatGPT desktop app — the three share one config file.

#### Fewer calls, smaller answers

Four earlier issues came out of a single live test: the tool was hard to find, the path was long, the response was too big, the confirmation said nothing. Measuring the same class across the rest of the API found what they share — an agent goes wrong where the API declined to state a fact, or where the answer does not fit in what it can read. Neither is fixed by telling the model to try harder.

- **Sparse fieldsets are back.** Every `fields[...]` was dropped as "changes which columns, not which records" — true, and backwards: it kept the tool schema small and paid for it on every response instead. Fifty app store version localizations are 264 KB as they shipped and **15.8 KB** with one attribute named; `apps.list` drops from 109 KB to 2.7 KB. Only each operation's own primary type is exposed, so this is one parameter on 304 operations rather than the hundreds that motivated dropping them: `tools/list` grows about 10% against 248 KB saved on the first narrowed call.
- **Truncation names the remedy that keeps every row.** A capped response now suggests `fields_*` before `filter_*`, `limit` and `next_url`, because the others answer a narrower question than the one that was asked.
- **`include` says what it prevents.** Without it, checking a relationship costs one call per row returned. Asking which of fifty localizations carry screenshots was 53 calls; it is one now.
- **Two read macros.** `pricing__get_subscription_price` reports what a subscription costs today in a territory — including the price that `/prices` on its own does not carry — and separates scheduled future prices from the one in effect. `listing__get_screenshots` answers "what artwork is up" in 4 calls and about 1 KB against 53 calls and 264 KB, and says the remaining locales inherit rather than lack. Four live agent sessions asking the price in Turkish, German, Bengali and Japanese went from 3 calls and 5–8 turns to 1 call and 3–4.
- **`filter[territory]` states its own format** — ISO-3166 alpha-3, on all 25 parameters across 23 operations, from one rule in the generator. Two letters is not an error at Apple: it returns 200 and an empty list, which reads as "this country has no data" and produced a confident "no US price configured" for a subscription selling at $4.99.
- **The server introduces itself.** Three facts the API will not state are sent once, at connection. Advice is deliberately absent — two behavioural lines were tried and measured, and at three samples per condition no effect was visible against a spread of 374k to 1341k tokens inside a single condition.

#### Sales and finance reports return readable rows on request

`sales_reports.list` and `finance_reports.list` hand back Apple's response as a gzipped TSV; the HTTP layer already reduces that to an opaque `{ contentType, base64 }` blob, unreadable to a model without an out-of-band decode step. Both tools now accept `parse` (boolean, default `false` — output stays byte-for-byte unchanged) and `max_rows` (default 200, hard cap 1000). With `parse: true` the response comes back as `{ headers, rows, totalRows, truncated }` instead of the blob. A payload that fails to gunzip — Apple sent something that isn't actually gzip-compressed — falls back to the original blob plus a `parseError` note rather than throwing, so no data is lost either way.

#### Tool definitions are smaller

Two runtime-synthesized description strings got shorter. The redundant "Resource identifier." on every `id` path parameter (783 tools) is gone entirely — `type: "string"` plus `required` already says as much; the `next_url` parameter's description (240 `.list` tools) is shorter, keeping the field name a model needs to copy and dropping a non-critical clause. Across the full 982-tool definition corpus that's **-5.17%** — 220,638 → 209,221 tokens, average per tool 225 → 213 — and setup's profile size estimates now reflect it. (The bigger-looking idea, deduplicating repeated shapes via JSON Schema `$defs`, measured well — up to 31% — but doesn't ship: MCP hands each tool its own self-contained schema resource, so nothing placed in `$defs` is actually shared across tools. The measurement tooling and four tripwire tests that found this stay, so the question reopens on its own if that ever changes.)

#### Fixed

- **A misspelled filter changed which app you were editing.** `apps.list` with `filter[bundleId]` — Apple's own spelling — dropped the argument, ran unfiltered and returned the account's first app, reporting success. Both spellings are accepted now, and an argument matching neither stops the call.
- **The binary exited 0 with no output when invoked through a symlink.** Both `npm install -g` and `npx` go through one, so every installed copy was silently dead.
- **Tool search returned nothing for a query in any language but English, and never said why.** 110 of 265 phrasings come back empty: matching is literal over Apple's English spec, and an empty list reads as "no such capability". `asc__search_tools` now asks for English in its description, and a result with no matches explains that and suggests what to try — so the client translates and searches again rather than concluding the capability does not exist.
- **Tool search offered tools the server refuses to load.** 123 deprecated candidates could never be called by the client being offered them; they are filtered out now.
- **Tool search never offered the macros at all.** They come from neither Apple's spec nor the StoreKit list, so a model asking how to change a price found the five-call chain and never the one-call tool written to replace it. Tools outside the spec were also matched by whole-phrase containment, so no question phrased as a sentence ever reached them.
- **A capital `İ` matched nothing.** Unicode lowercases it to `i` followed by a combining dot, not to `i`, so `İndirim kodu aç` returned no results where `indirim kodu aç` returned 28.
- **The setup picker opened every checked profile's sub-rows at once** — 46 rows on a fresh run. Expansion follows the cursor now.
- **The picker counted a profile as the sum of its sub-profiles**, not their union, so a tool in two was counted twice. `access` reported 55; it serves 52 plus core.
- **`check_entitlement` answered about the wrong product.** A product ID lives inside each transaction's signed payload, so a filter that never opened it narrowed nothing. An undecodable payload is reported as `undecodableTransactions` now too, so "could not tell" stops arriving disguised as "no".
- **Every install pulled 3.3 MB it had no way to use.** Apple's OpenAPI spec shipped in the package, but only the code generator reads it and the generator does not ship. Unpacked size drops from 6.7 MB to 3.3 MB.

#### Added for contributors

An agent-experience harness: a 50-intent corpus with adversarial goals run n times rather than once, a contract check across all 982 operations for unstamped risk levels and `readOnly` disagreeing with the HTTP method, and a live write-path probe that creates and deletes a TestFlight group on a throwaway app — the only check that exercises token to POST to Apple's answer, since every other one runs `--dry-run`. `tests/gate.test.ts` proves the write gate fires end to end over stdio rather than merely classifying correctly.

### [1.3.0] — 2026-07-28

Safety and usability release: every write is now schema-checked locally, previewed before confirmation, and never silently resent.

- **Writes are never auto-retried into duplicates.** Reads still retry on 408/429/5xx; writes retry only on 429 (rejected before processing). A write that dies without a response reports an explicit unknown outcome — "Apple may or may not have processed it, verify before resending" — instead of being resent. `Retry-After` HTTP-date form supported.
- **Fail-closed confirmation.** On clients without elicitation support, writes are now blocked with an error instead of silently proceeding; opt in explicitly with `--allow-unconfirmed-writes` / `ASC_ALLOW_UNCONFIRMED_WRITES=1`.
- **Real request-body schemas.** All 355 body-taking operations carry a resolved JSON Schema (attributes, relationships, enums, required fields, closed-world objects) instead of a generic "JSON:API body" hint, and every write body is validated locally — a typo'd field or wrong enum fails with a field path before anything reaches Apple.
- **Impact preview, risk levels and typed confirmation.** The confirmation prompt shows the operation, target ids, account, a summary of the changes and a reversibility note. Every mutating operation carries a hand-reviewed risk level (low / public / release / revenue / destructive / infrastructure / access); revenue, destructive, infrastructure and access writes require typing CONFIRM instead of ticking a box.
- **`--dry-run` / `ASC_DRY_RUN=1`:** mutating calls validate and return what would have been sent (method, path, body, risk) — nothing reaches Apple. For CI and agent rehearsals.
- **Reviews-AI hardening:** reviews travel to the model as untrusted JSON data (prompt-injection defense), statistics are computed deterministically with a previous-period trend comparison, truncation is reported honestly (fetched vs analyzed), drafts reply in the review's language, and brand voice / banned phrases / support URL come from `ASC_REVIEWS_*` env vars. Tools hide on clients without sampling support.
- **`ASC_BASE_URL`** points the whole server at a local fixture for testing; host-pinning follows the override.
- `asc__status` gains `check_expirations` — certificates and provisioning profiles expiring within 30 days.
- Actionable hints on 403 (role lacks permission) and 409 (resource-state lock) errors, alongside the existing 401 hint.
- GUIDE: multi-account patterns with existing mechanisms (per-server env, `ASC_CONFIG_DIR`).

### [1.2.0] — 2026-07-26

- **Write confirmation.** Before any mutating tool runs (changing a price, submitting for review, deleting a resource), the server asks the user to confirm via [MCP elicitation](https://modelcontextprotocol.io/) — a vague or misread instruction can no longer execute unchecked. On by default; turn it off with `ASC_CONFIRM_WRITES=0` or `--no-confirm`. Clients without elicitation support fall back to their own per-call approval, with a one-time notice.

### [1.1.4] — 2026-07-25

- First npm release carrying the lazy private-key parsing from 1.1.3 — the server boots without valid credentials, so tool discovery and introspection work before setup. Funding simplified to Buy Me a Coffee only (Patreon removed). No API changes.

### [1.1.3] — 2026-07-23

- **The server starts without a usable private key.** The signing key is now parsed lazily on the first API call instead of at startup, so tool discovery — and automated introspection harnesses like Glama that only call `tools/list` — no longer need valid credentials to boot. An invalid key surfaces on the first real request rather than blocking startup.

### [1.1.2] — 2026-07-22

- Added the `mcpName` field (`io.github.erayendes/asc-mcp`) to `package.json` so the server can be published to the official [MCP Registry](https://registry.modelcontextprotocol.io). No functional change.

### [1.1.1] — 2026-07-22

- **CLI messages now show a command that works without a global install.** The help text, the "missing config" and "invalid config" errors, and the StoreKit hint print `npx -y @erayendes/asc-mcp setup` instead of a bare `asc-mcp setup` — the latter only exists after `npm i -g`. `GUIDE.md §7` spells out the re-run command too.

### [1.1.0] — 2026-07-22

- **Rebrand to Heimdall.** The project is now *Heimdall — App Store Connect MCP*. The npm package (`@erayendes/asc-mcp`) and the command (`asc-mcp`) are unchanged.
- **Docs reorganised:** community-health files (security, support, contributing, conduct) live under `.github/` so GitHub recognises them; the guide and this changelog live under `docs/`. Numbers corrected throughout: **982 operations / 966 paths / 123 deprecated** (previously reported as 1,263 / 159).
- New `GUIDE.md` sections: platform support, the real setup-wizard flow, adding/removing tools later, StoreKit environments, a sample session, and uninstall steps.
- `SECURITY.md`: a "review it yourself before installing" section and an explicit no-telemetry / no-data-collection statement.
- Setup verifies credentials against Apple before saving, re-prompts on invalid input, and reuses saved credentials while reconciling registered profiles.
- User-facing help and error text now use the real `asc-mcp` command name.
- **Renamed the `account-management` profile to `provisioning`** so its name matches what it does (code signing: bundle IDs, certificates, devices, provisioning profiles) and no longer reads as user management — that lives in `user-management`. No alias: if you registered the old name, re-register as `asc-provisioning`.

### [1.0.4] — 2026-07-22

- Fix: setup no longer exits at the bundle-ID prompt after the profile picker.

### [1.0.3] — 2026-07-21

- Interactive, space-to-toggle profile picker showing each profile's tool count and rough token cost.
- Setup registers the picked profiles directly (`claude mcp add`) instead of only printing instructions.
- Discoverability: sibling-server hints include the exact add command, and StoreKit tools are surfaced in `asc__search_tools`.
- Friendlier setup: drag-and-drop `.p8` path, npx-based config, no real key in examples.

### [1.0.2] — 2026-07-21

- **Profile servers:** one binary serves 11 purpose-scoped MCP servers that share a single credential set.
- **Shared credential config** at `~/.config/asc-mcp/config.json`; environment variables still override it.
- Removed 281 id-only twin operations, shrinking the surface from 1,263 to 982.
- Fixed sales and finance report endpoints; added App Store Connect API integration tests.
- Tool names capped at 64 characters and query-parameter names sanitised for the Anthropic API.
- Optional **macOS Keychain** source for the private key, and bilingual **English / Türkçe** documentation with a flag-based language switcher. (These landed in the repo on 2026-07-19 under a "1.1.0" heading that was never published — 1.0.2 is the first npm release that shipped them.)

### [1.0.1] — 2026-07-19

- Per-role risk column in the API-key table; roles mapped to this server's actual domains.
- Scoped npm package name `@erayendes/asc-mcp`.

### [1.0.0] — 2026-07-19

- Initial release: an MCP server for the App Store Connect API, with tools generated from Apple's official OpenAPI specification.
- AI-assisted review tools via MCP Sampling.

## Türkçe

### [Yayınlanmadı]

#### Profiller türetilmiyor, elle küratörlükten geçiyor

**Kırıcı değişiklik — her profil değişti.** Bir aracın hangi profile ait olduğu eskiden URL'den okunuyordu; bu yüzden bir uygulamaya bağlı her ilişki (`/v1/apps/{id}/subscriptionGroups` gibi) `app-info`'ya düşerken kaynakların kendisi başka yerde duruyordu. On bir profilin sekizi kendi kaynaklarına bir uygulamadan erişemiyordu. Üyelik artık `spec/profiles.csv` içinde elle belirleniyor ve koda üretiliyor.

- **13 profil**, önceden 11. Yeni: `access`, `app-clips`, `testflight`.
- **`user-management` kaldırıldı**; `access`, `testflight`, `app-clips` ve `monetization`'a bölündü. Hiçbir araç kaybolmadı, takma ad da yok — takma ad şişkin profili geri kurardı. Config'inde hâlâ bu isim yazıyorsa sunucu **açılıyor**: bölünmeyi anlatan tek bir araçla geliyor, böylece cevap kimsenin okumadığı loga değil sohbete ulaşıyor.
- **Her profilin boyutu değişti.** `app-info` 112 araçtan 57'ye indi. **Config'inizi kontrol edin** — `asc-app-info`'da aradığınız araç artık yan komşuda olabilir.
- **İki kural CI'da zorunlu:** her profil kendi kök kaynaklarına bir uygulamadan erişebilmeli ve her yazmanın `{id}`'si onu üreten bir okumaya sahip olmalı.

#### Alt profiller

Profil iki nokta üst üste ile daralıyor: `monetization` 204 araç, ya da 24 araçlık `monetization:subscription-pricing`'i seçersiniz — tek çağrılık fiyat makrosu yine içinde. Altı profil altında 32 alt profil.

Bazı araçlar birden fazlasına bağlı, yani tek bir araca ulaşmak için koca bir profil yüklemek gerekmiyor. Ekran görüntüsü ve önizleme setleri üç ayrı ebeveyne bağlanır ve o 18 araç artık üçünün de altında — `distribution`'ın seti yalnızca listelemek yerine ekran görüntüsü yükleyebilmesini sağlayan da bu (109 araçtan 127'ye).

Setup seçicisi, işaretlenen profilin alt profillerini imlecin altında açar, hepsi işaretli gelir ve argümanı sizin yerinize yazar. `asc__status` hangilerinin yüklü olduğunu ve yaklaşık maliyetini raporlar.

#### Profildeki her araç, her istemcide

**`asc__describe` + `asc__call`** en baştan mevcut; böylece hiçbir şey, istemcinin oturum ortasında değişen araç listesini fark etmesine bağlı kalmıyor. Üç istemcide tek istemle ölçüldü: Claude Code yeni yüklenen aracı aynı turda kullandı; Codex "oturum araç listesi yeni araçları çağrılabilir yapmadı" deyip vazgeçti. Codex ve Antigravity artık aynı işi tek turda bitiriyor. `asc__call` salt okunur ve bunu açıklamasında bildiriyor — istemcinin onu engellemesini durduran şey bu. Yazmalar kendi araç adlarını koruyor; orada hem istemcinin onayı hem Heimdall'ın tipli teyidi geçerli.

**`asc__load`**, listeyi tazeleyen istemciler için oturum ortasında alt profil ekler. Elle yazılmış aileler (StoreKit, reviews-AI, fiyat makroları) hâlâ yeniden başlatma ister ve cevap bunu söyler.

#### Reviews-AI artık MCP Sampling gerektirmiyor

MCP 2026-07-28 revizyonu Sampling'i kullanımdan kaldırıyor (SEP-2577); `draft_response`, `triage` ve `daily_briefing` da ona bağımlıydı: `server.createMessage` çağırıyorlardı ve sampling yeteneğini hiç bildirmeyen bir client'ta `tools/list`'te hiç görünmüyorlardı — üstelik en çok yönlendirmeye ihtiyacı olan client'larda ölü duruyorlardı. Artık aynı yorumları Apple'dan öncekiyle aynı şekilde çekiyor, ham veriyi `structuredContent` olarak, yazılı bir talimatı da `content` içinde döndürüyorlar — talimat, sizinle zaten konuşan HOST modele ne üreteceğini söylüyor: bir cevap taslağı, tema bazlı tasnif, günlük brifing. `server.createMessage` yok, yetenek kontrolü yok; bu yüzden üç araç da artık sampling desteklemeyenler dahil her client'ın araç listesinde görünüyor. Değer önerisi yerinde duruyor: hâlâ ikinci bir API anahtarı yok, metni yine kendi modeliniz yazıyor. MCP spesifikasyonuna uyarak, yapılandırılmış veri talimatın yanında bir JSON metin bloğu olarak da seri hale getiriliyor; böylece `structuredContent`'i modelin bağlamına iletmeyen bir client bile veriye erişebiliyor. Her araç artık bu şekli tanımlayan bir `outputSchema` bildiriyor.

#### Setup yalnızca Claude Code'a değil, her istemciye kaydediyor

`setup` tek komut biliyordu: `claude mcp add`. Codex ve Cursor bulunan bir makinede iş, kullanıcının TOML'a çevirmesi için JSON basmakla bitiyordu — üstelik Codex'in okumadığı bir formattan.

- **Hangi istemciler diye soruyor**, makinede bulunanlar önceden işaretli: Claude Code, Claude Desktop, Codex, Antigravity, Cursor, Windsurf, VS Code. Claude Code ile Claude Desktop tek satır, iki dosyadır; çünkü hiçbiri diğerinin config'ini okumaz.
- **Üreticinin kendi komutu varsa yazma işini o yapıyor** (`claude`, `codex`, `code --add-mcp`). Düz JSON config'ler doğrudan düzenleniyor ve önce yedekleniyor; ayrıştırılamayan bir dosya hiç ellenmiyor, yapıştırılacak blokla bildiriliyor. Bir istemcinin başarısız olması diğerlerini durdurmuyor.
- **`register` aynı işi terminal olmadan yapar**, kurulumu sizin adınıza üstlenen bir AI agent için: `asc-mcp register monetization:subscription-pricing analytics`. Hiçbir şey sormaz, kimlik bilgisine dokunmaz ve yalnızca ekler — silme işi `setup`'ındır, çünkü silmek düzenlediğiniz listeye bakarken güvenlidir, agent bakmaz.

> [!NOTE]
> ChatGPT'nin kendi connector'ları yalnızca uzak HTTPS sunucusu kabul ettiği için Heimdall orada görünemez; sizin makinenizde stdio üzerinden çalışır, özel anahtarın makineden hiç çıkmamasının sebebi de budur. Codex satırı CLI'yi, IDE eklentisini ve ChatGPT masaüstünün Codex tarafını kapsar — üçü aynı config dosyasını okur.

#### Daha az çağrı, daha küçük yanıt

Daha önceki dört sorun tek bir canlı testten çıkmıştı: araç zor bulunuyordu, yol uzundu, yanıt çok büyüktü, onay ekranı hiçbir şey söylemiyordu. Aynı sınıfı API'nin geri kalanında ölçmek ortak yanlarını gösterdi — ajan, API bir bilgiyi söylemediğinde ya da yanıt okuyabileceğinden büyük olduğunda yanılıyor. İkisi de modele "daha dikkatli ol" demekle düzelmiyor.

- **Sparse fieldset'ler geri geldi.** Her `fields[...]` parametresi "hangi kayıtların değil, hangi sütunların döneceğini değiştiriyor" diye atılıyordu — doğru, ama ters: araç şemasını küçük tutup bedelini her yanıtta ödüyordu. Elli app store version lokalizasyonu bugüne kadar 264 KB'tı, tek bir alan istendiğinde **15,8 KB**; `apps.list` 109 KB'tan 2,7 KB'a iniyor. Yalnızca her operasyonun kendi ana tipi açılıyor, yani atılmalarına sebep olan yüzlerce parametre yerine 304 operasyonda birer tane: `tools/list` yaklaşık %10 büyüyor, ilk daraltılmış çağrıda 248 KB kazanılıyor.
- **Kırpma, tek satır bile kaybettirmeyen çareyi söylüyor.** Sınıra takılan yanıt artık `fields_*`'ı `filter_*`, `limit` ve `next_url`'den önce öneriyor; diğerleri sorulandan daha dar bir soruyu cevaplıyor.
- **`include` neyi önlediğini söylüyor.** O olmadan bir ilişkiyi kontrol etmek, dönen satır başına bir çağrı demek. Elli lokalizasyonun hangisinde ekran görüntüsü olduğunu sormak 53 çağrıydı; artık bir.
- **İki okuma makrosu.** `pricing__get_subscription_price` bir aboneliğin bugün bir ülkede ne kadara satıldığını döndürüyor — `/prices`'ın tek başına taşımadığı fiyat dahil — ve planlanmış gelecek fiyatları yürürlüktekinden ayırıyor. `listing__get_screenshots` "hangi görseller yayında" sorusunu 53 çağrı ve 264 KB yerine 4 çağrı ve yaklaşık 1 KB ile cevaplıyor, kalan dillerin görsel *eksiği* değil *mirası* olduğunu söylüyor. Fiyatı Türkçe, Almanca, Bengalce ve Japonca soran dört canlı ajan oturumu 3 çağrı ve 5–8 turdan 1 çağrı ve 3–4 tura indi.
- **`filter[territory]` kendi biçimini söylüyor** — ISO-3166 alpha-3, 23 operasyondaki 25 parametrenin tamamında, üreticideki tek bir kuraldan. İki harf Apple için hata değil: 200 ve boş liste dönüyor, bu da "bu ülkede veri yok" gibi okunuyor ve 4,99 dolara satılan bir abonelik için emin bir şekilde "US fiyatı yapılandırılmamış" cevabını üretti.
- **Sunucu kendini tanıtıyor.** API'nin söylemediği üç bilgi, bağlantı anında bir kez gönderiliyor. Nasihat bilinçli olarak yok — iki davranış maddesi denendi ve ölçüldü; koşul başına üç örnekte, tek bir koşulun içindeki 374 bin–1,34 milyon token'lık yayılıma karşı hiçbir etki görünmedi.

#### Satış ve finans raporları artık istek üzerine okunabilir satırlar döndürüyor

`sales_reports.list` ve `finance_reports.list`, Apple'ın cevabını gzip'li bir TSV olarak veriyor; HTTP katmanı bunu zaten opak bir `{ contentType, base64 }` blob'una indirgiyor — model için, harici bir çözme adımı olmadan okunamayan bir şey. İki araç da artık `parse` (boolean, varsayılan `false` — çıktı byte-for-byte aynı kalıyor) ve `max_rows` (varsayılan 200, sert tavan 1000) parametrelerini kabul ediyor. `parse: true` ile cevap, blob yerine `{ headers, rows, totalRows, truncated }` olarak dönüyor. Gunzip edilemeyen bir yük — Apple'ın gönderdiği şey aslında gzip'li değilse — hata fırlatmak yerine orijinal blob'a bir `parseError` notu ekleyerek geri dönüyor; iki durumda da veri kaybolmuyor.

#### Araç tanımları küçüldü

Çalışma zamanında üretilen iki açıklama metni kısaldı. Her `id` path parametresindeki gereksiz "Resource identifier." (783 araçta tekrarlanıyordu) tamamen kaldırıldı — `type: "string"` ve `required` zaten bunu söylüyor; `next_url` parametresinin açıklaması (240 `.list` aracında tekrarlanıyordu) kısaltıldı, modelin kopyalaması gereken alan adı kalırken kritik olmayan bir cümle çıkarıldı. 982 araçlık tam külliyatta bu **%5,17'lik bir düşüş** demek — 220.638 → 209.221 token, araç başına ortalama 225 → 213 — ve setup'ın profil boyutu tahminleri artık bunu yansıtıyor. (Daha büyük görünen fikir, tekrarlanan şekilleri JSON Schema `$defs` ile tekilleştirmek, ölçümde iyi çıktı — %31'e kadar — ama sevk edilmiyor: MCP her araca kendi kendine yeten bir şema kaynağı veriyor, yani `$defs` içine konan hiçbir şey araçlar arasında gerçekten paylaşılmıyor. Bunu ortaya çıkaran ölçüm araçları ve dört tripwire testi kalıyor; böylece durum değişirse soru kendiliğinden yeniden açılır.)

#### Düzeltildi

- **Yanlış yazılmış bir filtre hangi uygulamayı düzenlediğinizi değiştiriyordu.** `apps.list` çağrısı `filter[bundleId]` ile — Apple'ın kendi yazımı — argümanı düşürüyor, filtresiz çalışıyor, hesabın ilk uygulamasını döndürüyor ve başarı bildiriyordu. Artık iki yazım da kabul ediliyor; hiçbirine uymayan argüman çağrıyı durduruyor.
- **Binary, symlink üzerinden çağrıldığında hiçbir çıktı vermeden 0 ile çıkıyordu.** Hem `npm install -g` hem `npx` symlink kullanır; yani kurulu her kopya sessizce ölüydü.
- **Araç arama İngilizce dışındaki sorgulara hiçbir şey döndürmüyordu, üstelik sebebini hiç söylemiyordu.** 265 ifadenin 110'u boş dönüyor: eşleştirme Apple'ın İngilizce spec'i üzerinde birebir yapılıyor ve boş liste "böyle bir yetenek yok" gibi okunuyor. `asc__search_tools` artık açıklamasında İngilizce sorgu istiyor, eşleşme çıkmayan sonuç da bunu söyleyip ne denenmesi gerektiğini öneriyor — istemci çevirip tekrar arıyor, yeteneğin olmadığı sonucuna varmıyor.
- **Araç arama, sunucunun yüklemeyi reddettiği araçları öneriyordu.** Kullanımdan kalkmış 123 aday, önerildikleri istemci tarafından hiç çağrılamazdı; artık eleniyorlar.
- **Araç arama makroları hiç göstermiyordu.** Ne Apple'ın spec'inden ne StoreKit listesinden geldikleri için, fiyat değiştirmeyi soran bir model beş çağrılık zinciri buluyor, onun yerine yazılmış tek çağrılık aracı hiç görmüyordu. Spec dışındaki araçlar ayrıca tüm cümlenin geçmesine göre eşleştiriliyordu; yani cümleyle sorulan hiçbir soru onlara ulaşmıyordu.
- **Büyük `İ` hiçbir şeyle eşleşmiyordu.** Unicode onu `i`'ye değil, `i` artı birleşen bir noktaya küçültüyor; bu yüzden `İndirim kodu aç` sıfır sonuç dönerken `indirim kodu aç` 28 sonuç dönüyordu.
- **Setup seçicisi işaretli her profilin alt satırlarını aynı anda açıyordu** — sıfırdan bir koşuda 46 satır. Açılma artık imleci takip ediyor.
- **Seçici bir profili alt profillerinin toplamı sayıyordu**, birleşimi değil; iki alt profilde bulunan araç iki kez sayılıyordu. `access` 55 gösteriyordu; gerçekte 52 artı çekirdek sunuyor.
- **`check_entitlement` yanlış ürün hakkında cevap veriyordu.** Ürün kimliği her işlemin imzalı yükünün içinde yaşar; o yükü hiç açmayan bir filtre hiçbir şeyi daraltmıyordu. Çözülemeyen yük de artık `undecodableTransactions` ile bildiriliyor, böylece "bilemedim" cevabı "hayır" kılığında gelmiyor.
- **Her kurulum, kullanamayacağı 3,3 MB'ı indiriyordu.** Apple'ın OpenAPI spesifikasyonu pakete giriyordu, oysa onu yalnızca kod üreteci okur ve üreteç pakete girmez. Açılmış boyut 6,7 MB'dan 3,3 MB'a iniyor.

#### Katkıcılar için eklendi

Bir agent deneyimi koşum takımı: saldırgan hedefler içeren 50 istemlik bir külliyat (bir kez değil, n kez koşuluyor), 982 işlemin tamamında damgalanmamış risk seviyesi ve HTTP metoduyla çelişen `readOnly` arayan bir sözleşme kontrolü, ve tek kullanımlık bir uygulamada TestFlight grubu açıp silen canlı bir yazma-yolu sondası — token'dan POST'a, oradan Apple'ın cevabına giden yolu sınayan tek kontrol, çünkü diğerlerinin hepsi `--dry-run` ile koşuyor. `tests/gate.test.ts` yazma kapısının yalnızca doğru sınıflandırdığını değil, stdio üzerinden uçtan uca ateşlendiğini kanıtlıyor.

### [1.3.0] — 2026-07-28

Güvenlik ve kullanılabilirlik sürümü: her yazma artık yerelde şema kontrolünden geçiyor, onaydan önce önizleniyor ve asla sessizce yeniden gönderilmiyor.

- **Yazmalar otomatik retry ile çiftlenmiyor.** Okumalar 408/429/5xx'te retry olmaya devam ediyor; yazmalar yalnız 429'da (işlenmeden reddedildi). Cevapsız ölen yazma, yeniden gönderilmek yerine açık bir belirsiz-sonuç hatası veriyor — "Apple işlemiş olabilir, göndermeden önce doğrula". `Retry-After` HTTP-date formatı destekleniyor.
- **Fail-closed onay.** Elicitation desteklemeyen client'larda yazmalar artık sessizce geçmek yerine hata ile engelleniyor; açık opt-in: `--allow-unconfirmed-writes` / `ASC_ALLOW_UNCONFIRMED_WRITES=1`.
- **Gerçek request-body şemaları.** Body alan 355 operasyonun tamamı, genel bir "JSON:API body" ipucu yerine çözülmüş JSON Schema taşıyor (attribute'lar, ilişkiler, enum'lar, zorunlu alanlar, kapalı-dünya objeler) ve her yazma body'si yerelde doğrulanıyor — yazım hatalı alan veya yanlış enum, Apple'a hiçbir şey gitmeden field path ile düşüyor.
- **Impact preview, risk seviyeleri ve yazılı onay.** Onay penceresi operasyonu, hedef id'leri, hesabı, değişiklik özetini ve geri alınabilirlik notunu gösteriyor. Her mutasyon operasyonu elle gözden geçirilmiş bir risk seviyesi taşıyor (low / public / release / revenue / destructive / infrastructure / access); revenue, destructive, infrastructure ve access yazmaları kutucuk yerine CONFIRM yazmayı gerektiriyor.
- **`--dry-run` / `ASC_DRY_RUN=1`:** mutasyon çağrıları doğrulanıp gönderilecek olanı (metod, path, body, risk) döndürüyor — Apple'a hiçbir şey gitmiyor. CI ve ajan provaları için.
- **Reviews-AI sertleştirme:** yorumlar modele güvenilmez JSON verisi olarak gidiyor (prompt-injection savunması), istatistikler önceki dönem kıyasıyla deterministik hesaplanıyor, kesme dürüstçe raporlanıyor (çekilen vs analiz edilen), taslaklar yorumun dilinde ve marka sesi / yasaklı ifadeler / destek adresi `ASC_REVIEWS_*` env'lerinden. Araçlar, sampling desteklemeyen client'larda gizleniyor.
- **`ASC_BASE_URL`** tüm sunucuyu test için yerel bir fixture'a yönlendiriyor; host-pinning override'ı izliyor.
- `asc__status`'a `check_expirations` eklendi — 30 gün içinde dolacak sertifikalar ve provisioning profilleri.
- 403 (rol yetersiz) ve 409 (kaynak-durumu kilidi) hatalarına, mevcut 401 ipucunun yanına eyleme dönük ipuçları.
- GUIDE: mevcut mekanizmalarla çoklu hesap kalıpları (sunucu-başına env, `ASC_CONFIG_DIR`).

### [1.2.0] — 2026-07-26

- **Write onayı.** Değişiklik yapan bir araç çalışmadan önce (fiyat değiştirme, incelemeye gönderme, kaynak silme), sunucu kullanıcıdan [MCP elicitation](https://modelcontextprotocol.io/) ile onay ister — muğlak ya da yanlış anlaşılmış bir talimat artık kontrolsüz çalışamaz. Varsayılan açık; `ASC_CONFIRM_WRITES=0` veya `--no-confirm` ile kapatılır. Elicitation desteklemeyen client'lar kendi çağrı-başı onaylarına düşer (tek seferlik uyarıyla).

### [1.1.4] — 2026-07-25

- 1.1.3'teki lazy private-key parse'ı taşıyan ilk npm sürümü — sunucu geçerli kimlik bilgisi olmadan başlar; böylece araç keşfi ve introspection setup'tan önce çalışır. Bağış tek seçeneğe indirildi: yalnızca Buy Me a Coffee (Patreon kaldırıldı). API değişikliği yok.

### [1.1.3] — 2026-07-23

- **Sunucu, kullanılabilir bir private key olmadan başlar.** İmzalama anahtarı artık açılışta değil ilk API çağrısında (lazy) parse edilir; böylece araç keşfi — ve yalnızca `tools/list` çağıran Glama gibi otomatik introspection araçları — boot için geçerli kimlik bilgisi gerektirmez. Hatalı anahtar, açılışı kilitlemek yerine ilk gerçek istekte ortaya çıkar.

### [1.1.2] — 2026-07-22

- `package.json`'a `mcpName` alanı (`io.github.erayendes/asc-mcp`) eklendi; böylece sunucu resmi [MCP Registry](https://registry.modelcontextprotocol.io)'ye yayınlanabilir. İşlevsel değişiklik yok.

### [1.1.1] — 2026-07-22

- **CLI mesajları artık global kurulum olmadan çalışan bir komut gösteriyor.** Help metni, "config eksik"/"config bozuk" hataları ve StoreKit ipucu, çıplak `asc-mcp setup` yerine `npx -y @erayendes/asc-mcp setup` basıyor — çıplak komut yalnızca `npm i -g` sonrası var. `GUIDE.md §7` de yeniden-çalıştırma komutunu açıkça veriyor.

### [1.1.0] — 2026-07-22

- **Heimdall'a yeniden adlandırma.** Proje artık *Heimdall — App Store Connect MCP*. npm paketi (`@erayendes/asc-mcp`) ve komut (`asc-mcp`) değişmedi.
- **Dokümanlar yeniden düzenlendi:** community-health dosyaları (güvenlik, destek, katkı, davranış kuralları) GitHub'ın tanıması için `.github/` altında; rehber ve bu değişiklik günlüğü `docs/` altında. Rakamlar baştan sona düzeltildi: **982 işlem / 966 path / 123 deprecated** (önceden 1.263 / 159 yazıyordu).
- Yeni `GUIDE.md` bölümleri: platform desteği, gerçek setup-sihirbazı akışı, sonradan araç ekleme/çıkarma, StoreKit ortamları, örnek bir oturum ve kaldırma adımları.
- `SECURITY.md`: "kurmadan önce kendin denetle" bölümü ve açık bir telemetri-yok / veri-toplama-yok beyanı.
- Setup, kaydetmeden önce kimlik bilgilerini Apple'a doğrular, hatalı girdide yeniden sorar ve kayıtlı kimlik bilgilerini yeniden kullanırken kayıtlı profilleri uzlaştırır.
- Kullanıcıya görünen yardım ve hata metni artık gerçek `asc-mcp` komut adını kullanır.
- **`account-management` profili `provisioning` olarak yeniden adlandırıldı** — adı yaptığı işi yansıtsın (kod imzalama: bundle ID'ler, sertifikalar, cihazlar, provisioning profilleri) ve kullanıcı yönetimiyle karışmasın; o iş `user-management`'ta. Alias yok: eski adı kaydettiyseniz `asc-provisioning` olarak yeniden kaydedin.

### [1.0.4] — 2026-07-22

- Düzeltme: setup, profil seçicinin ardından bundle-ID isteminde artık çıkmıyor.

### [1.0.3] — 2026-07-21

- İnteraktif, boşlukla-seçilen profil seçici; her profilin araç sayısını ve kabaca token maliyetini gösterir.
- Setup, seçilen profilleri sadece yazdırmak yerine doğrudan kaydeder (`claude mcp add`).
- Keşfedilebilirlik: kardeş-sunucu ipuçları tam ekleme komutunu içerir ve StoreKit araçları `asc__search_tools`'ta görünür.
- Daha dostane setup: sürükle-bırak `.p8` yolu, npx tabanlı config, örneklerde gerçek anahtar yok.

### [1.0.2] — 2026-07-21

- **Profil sunucuları:** tek binary, tek kimlik bilgisi setini paylaşan 11 amaca özel MCP sunucusu sunar.
- **Ortak kimlik bilgisi yapılandırması** `~/.config/asc-mcp/config.json`'da; ortam değişkenleri yine de onu ezer.
- 281 id-only twin işlem kaldırıldı; yüzey 1.263'ten 982'ye indi.
- Satış ve finans rapor uç noktaları düzeltildi; App Store Connect API entegrasyon testleri eklendi.
- Araç isimleri 64 karakterle sınırlandı ve sorgu-parametre isimleri Anthropic API için temizlendi.
- Özel anahtar için opsiyonel **macOS Keychain** kaynağı ve bayrak tabanlı dil geçişli iki dilli **İngilizce / Türkçe** dokümantasyon. (Bunlar depoya 2026-07-19'da hiç yayınlanmamış bir "1.1.0" başlığı altında girmişti — kullanıcıya ulaştıran ilk npm sürümü 1.0.2'dir.)

### [1.0.1] — 2026-07-19

- API anahtarı tablosunda rol-başına risk sütunu; roller bu sunucunun gerçek domainlerine eşlendi.
- Scope'lu npm paket adı `@erayendes/asc-mcp`.

### [1.0.0] — 2026-07-19

- İlk sürüm: App Store Connect API için, araçları Apple'ın resmi OpenAPI spesifikasyonundan üretilen bir MCP sunucusu.
- MCP Sampling ile AI destekli yorum araçları.
