<!--
Thanks for contributing. Keep the pull request small and about one thing. See CONTRIBUTING.md.
Katkınız için teşekkürler. Pull request'i küçük ve tek bir konuya odaklı tutun. Bkz. CONTRIBUTING.md.
-->

## What changes, and why / Ne değişiyor, neden

<!-- In a sentence or two. / Bir iki cümleyle. -->

## Related issue / İlgili issue

Closes #

## Checklist / Kontrol listesi

- [ ] `npm run build`, `npm run typecheck` and `npm test` pass / `npm run build`, `npm run typecheck` ve `npm test` geçiyor
- [ ] **Only if you moved a tool between profiles:** the change is in `spec/profiles.csv`, regenerated with `npm run generate` / **Yalnızca bir aracı başka profile taşıdıysanız:** değişiklik `spec/profiles.csv`'de yapıldı ve `npm run generate` ile yeniden üretildi
- [ ] Docs updated if behaviour changed / Davranış değiştiyse dokümantasyon güncellendi
- [ ] No credentials, private keys or real App Store Connect IDs in the changes / Değişikliklerde kimlik bilgisi, özel anahtar ya da gerçek App Store Connect kimliği yok
- [ ] **Only if you changed the generator in `scripts/`:** `src/generated/` was regenerated with `npm run generate` and committed, and the new tool count is written below / **Yalnızca `scripts/` altındaki üreticiyi değiştirdiyseniz:** `src/generated/`, `npm run generate` ile yeniden üretilip commit'lendi ve yeni araç sayısı aşağıya yazıldı
- [ ] **Only if you changed tool descriptions:** `npm run ax:report` was run; if the score improved, the limit in `tests/ax-audit.test.ts` was tightened / **Yalnızca araç açıklamalarını değiştirdiyseniz:** `npm run ax:report` çalıştırıldı; skor iyileştiyse `tests/ax-audit.test.ts` içindeki sınır sıkılaştırıldı

## Tool count / Araç sayısı

<!-- e.g. 902 → 904. "No change" is a fine answer. / Ör. 902 → 904. "Değişmedi" de geçerli bir cevap. -->

## How you tested it / Nasıl test ettiniz

<!-- Which command, which app (Claude, Cursor…), what you asked. / Hangi komut, hangi uygulama (Claude, Cursor…), ne sordunuz. -->
