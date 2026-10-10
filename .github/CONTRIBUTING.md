# Contributing / Katkıda Bulunma

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

## English

Glad you want to contribute. I run this and several other projects on my own, so a bit of help never hurts. That's why I keep the process simple.

- **Bug reports** are welcome. Open an issue and explain what you expected, what happened, and how to reproduce it.
- **Feature requests:** open an issue first and describe the idea — that way we agree on direction before any work is done.
- Keep **pull requests** small and focused on one thing.
  - **Explain** what it does and why in the description.
  - No **credentials**, private **keys**, or **secrets** in the diff.
  - Update **documentation** if needed.
- Pay attention to **code style**. Match the existing style in the file you're editing.
- Write short, clear **commit** messages.
- If you find a **security vulnerability**, please don't disclose it publicly. [I'll handle it privately, outside the normal flow.](SECURITY.md)

### Running it locally

You need Node.js 20.19 or later.

```bash
git clone https://github.com/erayendes/app-store-connect-mcp.git
cd app-store-connect-mcp
npm install
npm run build
npm run typecheck
npm test
```

Make sure `npm run typecheck` and `npm test` pass before you open a pull request.

> [!IMPORTANT]
> **Don't edit `src/generated/` by hand.** Those files are produced from Apple's OpenAPI specification, and the next build overwrites them. Change the generator in `scripts/` instead and run `npm run generate`. Apple's specification is updated automatically every week; don't include specification updates in your pull request.
>
> **Which profile a tool belongs to** is set in `spec/profiles.csv`. To move a tool, edit that file and run `npm run generate`.

### How I review

I review PRs and issues as time allows. There's no fixed response time, but:

- **Small changes** (fixes, clearer docs, minor improvements) — I review them faster and usually merge within a few days.
- **Large changes** (new features, breaking changes) — need more review and usually take about two weeks to fit into the current plan.

By contributing, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Türkçe

Projeye katkı sağlamak istediğinize sevindim. Bu ve benzeri birçok projeyi tek başıma yürüttüğüm için biraz destek gelmesi hiç fena olmaz. Bu yüzden süreçleri basit tutuyorum.

- **Hata bildirimi** yapmaktan çekinmeyin. Issue açın; ne beklediğinizi, ne olduğunu ve nasıl tekrarlanacağını yazın.
- **Özellik önerisi** yaparken önce issue açıp fikri anlatın — böylece iş yapılmadan yön üzerinde anlaşırız.
- **Pull request**'leri küçük ve tek bir konuya odaklı tutun.
  - **Açıklamada** ne yaptığınızı ve nedenini belirtin.
  - Değişikliklerinizde **kimlik bilgisi**, özel **anahtar** ya da başka bir **gizli bilgi** olmasın.
  - Gerekiyorsa **dokümantasyonu** güncelleyin.
- **Kod stiline** dikkat edin. Düzenlediğiniz dosyadaki mevcut stile uyun.
- **Commit**'lerinize kısa ve net mesajlar yazın.
- **Güvenlik açığı** gördüyseniz lütfen bunu herkese açık paylaşmayın. [Normal akışın dışında özel olarak ele alırım.](SECURITY.md)

### Kendi makinenizde çalıştırmak

Node.js 20.19 ya da üzeri gerekir.

```bash
git clone https://github.com/erayendes/app-store-connect-mcp.git
cd app-store-connect-mcp
npm install
npm run build
npm run typecheck
npm test
```

Pull request açmadan önce `npm run typecheck` ve `npm test`'in geçtiğinden emin olun.

> [!IMPORTANT]
> **`src/generated/` klasörünü elle düzenlemeyin.** Bu dosyalar Apple'ın OpenAPI spesifikasyonundan üretilir ve bir sonraki derlemede üzerine yazılır. Bunun yerine `scripts/` altındaki üreticiyi değiştirip `npm run generate` çalıştırın. Apple'ın spesifikasyonu her hafta otomatik olarak güncelleniyor; pull request'inize spesifikasyon güncellemesi eklemeyin.
>
> **Bir aracın hangi profile ait olduğu** `spec/profiles.csv`'de belirlenir. Bir aracı taşımak için bu dosyayı düzenleyip `npm run generate` çalıştırın.

### Nasıl inceliyorum

PR ve issue'ları zaman buldukça inceliyorum. Net bir yanıt süresi yok ama:

- **Küçük değişiklikleri** (düzeltmeler, daha net dokümantasyon, küçük iyileştirmeler) daha hızlı gözden geçirir, genellikle birkaç gün içinde merge ederim.
- **Büyük değişiklikler** (yeni özellikler, geriye uyumsuz değişiklikler) daha fazla inceleme ister; mevcut plana alınmaları genelde iki haftayı bulur.

Katkıda bulunarak [Davranış Kuralları](CODE_OF_CONDUCT.md)'na uymayı kabul etmiş olursunuz.
