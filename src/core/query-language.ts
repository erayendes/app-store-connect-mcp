/**
 * Tool descriptions are English. Users are not.
 *
 * `asc__search_tools` scores a query by how many of its words appear in an
 * operation's name, description or path, and needs at least half of them to
 * hit. A query in another language hits nothing, falls under the threshold and
 * comes back empty — not "ranked badly", empty. Measured against the AX corpus,
 * 114 of 265 query phrasings returned zero results, every one of them Turkish.
 * For a Turkish-speaking user's agent, tool discovery simply did not exist.
 *
 * The fix is deliberately small: a lookup from the words people use to the
 * English the catalogue is written in. No stemmer, no model, no dependency —
 * the vocabulary of App Store Connect is a few dozen nouns and a handful of
 * verbs, and it does not change often.
 *
 * Turkish is agglutinative: "fiyat" (price) shows up as "fiyatı", "fiyatını",
 * "fiyatlarını". A prefix match handles the whole family without a morphology
 * engine. Keys are required to be at least three characters so a two-letter
 * root can't swallow an unrelated word.
 *
 * Adding a language means adding rows.
 */
const ALIASES: Record<string, string[]> = {
  // money
  fiyat: ['price'],
  ücret: ['price'],
  zam: ['price'],
  gelir: ['sales', 'finance'],
  indirim: ['offer', 'discount'],
  teklif: ['offer'],
  kupon: ['code'],
  kod: ['code'],
  abonelik: ['subscription'],
  abone: ['subscription'],
  satın: ['purchase'],
  alım: ['purchase'],

  // objects
  uygulama: ['app'],
  oyun: ['game'],
  sürüm: ['version'],
  versiyon: ['version'],
  build: ['build'],
  derleme: ['build'],
  paket: ['package', 'pack'],
  varlık: ['asset'],
  sayfa: ['page'],
  etkinlik: ['event'],
  olay: ['event'],

  // verbs
  güncelle: ['update'],
  değiştir: ['update', 'change'],
  ayarla: ['set'],
  oluştur: ['create'],
  ekle: ['add', 'create'],
  tanımla: ['create'],
  sil: ['delete'],
  kaldır: ['delete', 'remove'],
  temizle: ['remove'],
  listele: ['list'],
  göster: ['list', 'get'],
  getir: ['get'],
  indir: ['download'],
  gönder: ['submit', 'send'],
  yayınla: ['release', 'publish'],
  yayın: ['release'],
  karşılaştır: ['compare'],

  // store listing
  açıklama: ['description'],
  başlık: ['name', 'title'],
  kategori: ['category'],
  yaş: ['age', 'rating'],
  ekran: ['screenshot'],
  görüntü: ['screenshot'],
  resim: ['image'],
  dil: ['localization', 'language'],
  lokalizasyon: ['localization'],
  çeviri: ['localization'],
  anahtar: ['keyword'],
  kelime: ['keyword'],

  // reach
  ülke: ['territory'],
  bölge: ['territory'],
  pazar: ['territory'],
  dünya: ['territory'],
  uygunluk: ['availability'],
  erişim: ['availability', 'access'],

  // review and feedback
  inceleme: ['review'],
  yorum: ['review'],
  değerlendirme: ['review'],
  cevap: ['response'],
  yanıt: ['response'],

  // TestFlight and people
  testçi: ['tester'],
  testci: ['tester'],
  beta: ['beta'],
  grup: ['group'],
  davet: ['invitation'],
  kullanıcı: ['user'],
  üye: ['user'],
  rol: ['role'],
  yetki: ['role', 'permission'],
  hesap: ['account'],
  sandbox: ['sandbox'],

  // signing
  sertifika: ['certificate'],
  imzalama: ['certificate', 'signing'],
  cihaz: ['device'],
  profil: ['profile'],

  // reporting
  rapor: ['report'],
  satış: ['sales'],
  finans: ['finance'],
  analiz: ['analytics'],

  // game center
  başarım: ['achievement'],
  liderlik: ['leaderboard'],
  skor: ['score'],
  puan: ['score'],

  // misc
  kademeli: ['phased'],
  süre: ['period'],
  deneme: ['trial'],
  bildirim: ['notification'],
  adres: ['url'],
  akış: ['workflow'],
};

/** Longest first, so "abonelik" wins over "abone". */
const KEYS = Object.keys(ALIASES).sort((a, b) => b.length - a.length);

/** Punctuation-aware split; Turkish questions arrive with "?" and "'" attached. */
const WORDS = /[\s,.:;!?"'’()[\]]+/;

/**
 * Rewrite a query into words the catalogue might actually contain.
 *
 * A word is only translated when it appears nowhere in the catalogue. That is
 * the whole safety rule: anything English stays untouched, so this can add
 * matches but never take one away. It matters — "parameter" starts with "para",
 * and a blanket rewrite would quietly turn it into "price".
 */
export function expandQueryTokens(query: string, corpusText: string): string[] {
  const words = query.toLowerCase().split(WORDS).filter(Boolean);
  const expanded: string[] = [];

  for (const word of words) {
    if (corpusText.includes(word)) {
      expanded.push(word);
      continue;
    }
    const key = KEYS.find((k) => k.length >= 3 && word.startsWith(k));
    if (key) expanded.push(...ALIASES[key]);
    else expanded.push(word);
  }

  return [...new Set(expanded)];
}
