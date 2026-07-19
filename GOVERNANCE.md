# Governance / Yönetişim

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

## English

### Maintainer model

This project is currently maintained by a single maintainer, [Eray Endeş](https://github.com/erayendes), who has final say on:

- What gets merged and released
- Roadmap and scope (e.g. which Apple domains/operations are prioritized)
- Breaking changes and versioning (semver)
- Adding co-maintainers or transferring ownership

There is no formal committee or voting process — this reflects the project's current size, not a permanent design choice. As the contributor base grows, this document will be updated to reflect a more distributed model (e.g. multiple maintainers with defined areas of ownership).

### Decision process

- **Small changes** (bug fixes, description improvements, new curated overrides): reviewed and merged directly by the maintainer, typically within a few days.
- **Larger changes** (new domains, architectural changes, breaking changes to tool names or schemas): discussed in an issue first before a PR is opened, so the direction is agreed on before the work is done.
- **Security issues**: handled privately per [SECURITY.md](docs/SECURITY.md), outside the normal PR/issue flow.

### Becoming a maintainer

There's no fixed bar, but a track record of good contributions (see [CONTRIBUTING.md](docs/CONTRIBUTING.md)) — accurate description improvements, correctly mapped domains, tests that hold up — is how trust gets built. If you're contributing regularly and want to take on more (triage, review, release management), open an issue proposing it.

### Project independence

This project is not affiliated with, endorsed by, or sponsored by Apple Inc. (see [NOTICE](NOTICE)). Its direction is set by the maintainer and the community, not by any corporate roadmap.

## Türkçe

### Maintainer modeli

Bu proje şu anda tek bir maintainer tarafından yönetiliyor: [Eray Endeş](https://github.com/erayendes). Son söz kendisinde:

- Neyin merge edilip yayınlanacağı
- Roadmap ve kapsam (örn. hangi Apple domain/işlemlerinin öncelikli olduğu)
- Breaking change'ler ve versiyonlama (semver)
- Co-maintainer eklemek veya sahipliği devretmek

Resmi bir komite veya oylama süreci yok — bu, projenin şu anki büyüklüğünü yansıtır, kalıcı bir tasarım tercihi değil. Katkıda bulunan tabanı büyüdükçe bu doküman daha dağıtık bir modeli (örn. tanımlı sorumluluk alanlarına sahip birden fazla maintainer) yansıtacak şekilde güncellenecek.

### Karar süreci

- **Küçük değişiklikler** (bug fix'ler, açıklama iyileştirmeleri, yeni curated override'lar): maintainer tarafından doğrudan gözden geçirilir ve genellikle birkaç gün içinde merge edilir.
- **Büyük değişiklikler** (yeni domainler, mimari değişiklikler, araç isimlerinde/şemalarında breaking change): PR açılmadan önce bir issue'da tartışılır; böylece iş yapılmadan önce yön üzerinde anlaşılır.
- **Güvenlik sorunları**: [SECURITY.md](docs/SECURITY.md)'ye göre, normal PR/issue akışının dışında özel olarak ele alınır.

### Maintainer olmak

Sabit bir eşik yok, ama iyi katkıların ([CONTRIBUTING.md](docs/CONTRIBUTING.md)'ye bak) — doğru açıklama iyileştirmeleri, doğru eşlenmiş domainler, ayakta duran testler — geçmişi güven inşa etmenin yolu. Düzenli katkıda bulunuyorsan ve daha fazlasını (triage, review, release yönetimi) üstlenmek istiyorsan, bunu öneren bir issue aç.

### Proje bağımsızlığı

Bu proje Apple Inc. ile bağlantılı değildir, onaylanmamıştır veya sponsor edilmemiştir (bkz. [NOTICE](NOTICE)). Yönü, herhangi bir kurumsal roadmap tarafından değil, maintainer ve topluluk tarafından belirlenir.
