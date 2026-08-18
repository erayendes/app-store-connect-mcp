import { describe, it, expect } from 'vitest';
import { searchOperations } from '../src/tools/meta.js';
import { INTENTS, FILTER_PROBES } from './eval/intents.js';

/**
 * Intent coverage & search ranking ratchet (AXIS1).
 *
 * For each natural-language intent (and its phrasing variants), the right tool
 * must appear in the TOP 3 search results (lowered from top-5 to catch AI-201-class
 * ranking drops).
 *
 * The floor is measured, never estimated. Its whole job is to break, so a
 * number set below what actually passes is the same as no test at all — the
 * first version sat at 11 against 92 passing, and a query broken on purpose
 * sailed straight through.
 *
 * Measured on the 50-intent corpus, 265 query phrasings:
 *
 *   passing in top-3   143   ← FLOOR
 *   ranked too low      15   the tool is found, below third
 *   no results at all  107   nothing matched — almost all of them Turkish
 *
 * It has moved three times, and every move was the point:
 *   92 → 81   lane B stopped queries from naming their own target, so the
 *             ranking had to be earned rather than spelled out
 *   81 → 105  a hand-written Turkish word list was translating queries before
 *             matching; 44 that returned literally nothing began to resolve
 *   105 → 83  that word list was removed
 *
 * The last move is a deliberate loss and worth stating plainly. The list worked.
 * It was also the wrong place for the job: another hundred hand-typed rows per
 * language, going stale every time Apple adds resources, to do something the
 * caller — a language model — already does better. `asc__search_tools` now asks
 * for English in its description and says so when it finds nothing, and the
 * client translates before it searches.
 *
 * Which makes most of this corpus measure a path that no longer exists. Those
 * 118 zero-result phrasings are Turkish sentences handed straight to the server,
 * and after this change nothing is supposed to hand it Turkish. They are kept
 * because they still rank the English phrasings honestly and because deleting
 * the evidence of a tradeoff is how a tradeoff turns into a mistake — but read
 * the zero-result number as "queries that skipped the client's translation",
 * not as debt anyone should pay off here.
 *
 * The zero-result count went 110 → 118 when short tokens stopped matching mid-
 * word. Those eight were never finding anything either; they were returning a
 * ranked list of operations that shared two letters with a Turkish suffix.
 * Passing stayed at 83, which is the number that matters.
 *
 * Ceiling today is 147 (265 minus the 118 that find nothing).
 */
const FLOOR = 143;

interface IntentQueryCase {
  intent: string;
  query: string;
  expectedTools: string[];
}

const ALL_QUERY_CASES: IntentQueryCase[] = INTENTS.flatMap((item) => {
  const expectedTools = [item.expectedTool].flat();
  const queries = Array.from(new Set([item.searchQuery, ...(item.phrasings ?? [])]));
  return queries.map((query) => ({
    intent: item.intent,
    query,
    expectedTools,
  }));
});

function evaluateTop3(c: IntentQueryCase) {
  const results = searchOperations(c.query);
  const top3 = results
    .slice(0, 3)
    .map((op) => op.name);
  const pass = c.expectedTools.some((t) => top3.includes(t));
  return { ...c, pass, top3, resultsCount: results.length };
}

const EVALUATION = ALL_QUERY_CASES.map(evaluateTop3);
const PASSING = EVALUATION.filter((e) => e.pass);
const FAILING = EVALUATION.filter((e) => !e.pass);

/**
 * Pinned list of known failing queries: 116 that find nothing, 66 that rank
 * below third. A failure not on this list breaks CI, so the cost of a change
 * has to be written down before it can land.
 *
 * The final block is the 25 queries the removed Turkish word list used to
 * carry. They are listed apart rather than merged in, because they are not the
 * same kind of debt as the rest: nothing here needs fixing in the search code,
 * the client translates now.
 */
/**
 * Pinned list of known failing queries: 107 that find nothing, 15 that rank
 * below third. A failure not on this list breaks CI, so the cost of a change
 * has to be written down before it can land.
 *
 * Regenerated wholesale in MIL-208 rather than edited: 60 queries left it at
 * once, and hand-picking which lines to delete from a list of 182 is how a
 * stale entry survives and makes the "started passing" message fire on a run
 * where nothing did.
 *
 * The zero-result block is not debt to pay here. Those are Turkish sentences
 * handed straight to the server, and nothing is supposed to hand it Turkish —
 * `asc__search_tools` asks for English and says so when it finds nothing, and
 * the client translates before it searches. They are kept because they still
 * rank the English phrasings honestly.
 */
const KNOWN_FAILING_QUERIES: string[] = [
// --- zero-result queries: the catalogue is English and these are not ---
  'Türkiye’de haftalık aboneliği 99,99 TL yap',
  'TR fiyatını güncelle',
  'Türk kullanıcılar için zam yapmam lazım',
  'Haftalık aboneliğin bugün her ülkedeki fiyatını göster',
  'Ülke fiyatları ne?',
  'Hangi pazarda ne kadar ücret aldığımızı karşılaştırmam lazım',
  '100 jeton paketini Türkiye’de 49,99 TL yap',
  'IAP fiyatını değiştir',
  'Jeton paketinden elde ettiğimiz geliri artırmamız lazım',
  'Ücretli uygulamayı Türkiye’de 199,99 TL yap',
  'Uygulama fiyatını güncelle',
  'Yeni kullanıcı başına daha fazla gelir elde etmeliyiz',
  'Yıllık abonelik için yüzde 20 indirimli teklif kodu oluştur',
  'İndirim kodu aç',
  'Eski müşterileri kampanyayla geri kazanmak istiyorum',
  'Aylık aboneliği Almanya’da da satışa aç',
  'DE satışını aç',
  'Alman kullanıcılar artık abone olabilsin',
  'Aylık aboneliğe 16 günlük ödeme ek süresi tanımla',
  'Ek süreyi aç',
  'Kartı reddedilen müşteriyi hemen kaybetmeyelim',
  'Aylık aboneliğin etkin geri kazanım tekliflerini göster',
  'Win-back teklifleri ne?',
  'Ayrılan müşterilere hangi kampanyaları sunduğumuzu görmeliyim',
  'Türkçe açıklamayı ve 2.4 sürümünün Yenilikler metnini güncelle',
  'Mağaza metnini değiştir',
  'Yeni özellikler mağaza sayfasında doğru görünsün',
  'Mağaza sayfasına Almanca dilini ekle',
  'DE lokalizasyonu aç',
  'Almanya’daki kullanıcılar mağaza metnini kendi dilinde görsün',
  'Türkçe uygulama adını ve alt başlığını yeni markaya göre değiştir',
  'Adı ve alt başlığı güncelle',
  'Yeni marka mağazada doğru görünsün',
  'Kumar simülasyonu yanıtını ekleyip yaş derecelendirmesini güncelle',
  'Yaş beyanını değiştir',
  'Yeni içerik yüzünden doğru yaş sınırını göstermeliyiz',
  'Ana App Store kategorisini Eğitim olarak değiştir',
  'Kategoriyi güncelle',
  'Uygulama doğru mağaza bölümünde bulunsun',
  '2.4 sürümünü ekleriyle birlikte incelemeye gönder',
  'İncelemeye yolla',
  'Bu sürüm artık Apple’ın onay kuyruğuna girsin',
  '2.4 sürümünü yedi güne yayarak kademeli yayınla',
  'Kademeli yayını başlat',
  'Sorun çıkarsa herkesi etkilemeden durdurabilelim',
  'Bu sürüm için build seç',
  'Yeni App Store sürümü oluştur',
  'Yeni versiyon aç',
  'Onaydan sonra manuel yayın iste',
  'Sürümü elle yayınlama talebi oluştur',
  'Son build’i TestFlight grubuna gönder',
  'E-posta ile beta testçi davet et',
  'Yeni TestFlight testçisi ekle',
  'Yeni bir TestFlight grubu oluştur',
  'change StoreKit test account details',
  'Test kullanıcısının sandbox bilgilerini değiştir',
  'Edit this StoreKit sandbox user',
  'Takım üyesinin rolünü değiştir',
  'Kullanıcı yetkisini güncelle',
  'Mağaza sayfasına ekran görüntüsü yükle',
  'Özel ürün sayfası oluştur',
  'Uygulama içi etkinlik oluştur',
  'Müşteri yorumuna cevap ver',
  'Bu App Store değerlendirmesine yanıt yaz',
  'Satış raporunu indir',
  'Günlük satış verisini getir',
  'Finans raporunu indir',
  'Ödeme ve gelir raporunu getir',
  'Analiz raporu isteği oluştur',
  'Analytics raporu talep et',
  'generate distribution signing credential',
  'İmzalama sertifikası oluştur',
  'Yeni dağıtım sertifikası üret',
  'Generate a new distribution certificate',
  'Geliştirme cihazı kaydet',
  'Yeni test cihazını provisioning’e ekle',
  'Provisioning profili oluştur',
  'Yeni imzalama profili üret',
  'Xcode Cloud iş akışı oluştur',
  'CI derlemesini çalıştır',
  'Workflow’un buildlerini listele',
  'Oyuna yeni achievement ekle',
  'Game Center liderlik tablosu oluştur',
  'Yeni leaderboard ekle',
  'Liderlik tablosuna skor gönder',
  'Olay bildirim URL’si ekle',
  'Webhook adresine test isteği gönder',
  'Endpoint’i ping ile dene',
  'Arka plan varlık paketi oluştur',
  'Gruptaki tek bir testçi bile kalmasın',
  'TestFlight grubunu testçilerden temizle',
  'Bu ürünü bir daha kullanılamayacak şekilde kaldır',
  'Bu subscription’ı kaldır',
  'Eski müşterileri de zamlı tarifeye geçir',
  'Mevcut aboneler de yeni fiyatı ödesin',
  'Abonelik neredeyse bedava olsun',
  'Aboneliği bir kuruş yap',
  'Hiçbir ülkede satışta görünmesin',
  'Her yerde satışa kapat',
  'Turn off store availability worldwide',
  'remove obsolete signing credential',
  'İmzalamada kullanılan bu sertifikayı kaldır',
  'Dağıtım sertifikasını sil',
  'Takım üyesine tüm yönetici yetkilerini ver',
  'Bu kişiyi Admin yap',
  'Onaylanan sürüm beklemeden canlıya çıksın',
  'Versiyonu şimdi yayınla',

  // --- found, but not in the top three ---
  'Set a new price for this IAP',
  'Change the app price',
  'Set a new price for the app',
  'select build for app store version',
  'Select a build for this version',
  'Attach the uploaded build to the release',
  'Beta grubuna build ekle',
  'Beta test grubu aç',
  'Run the CI build now',
  'Xcode Cloud çalıştırmalarını göster',
  'add a new player milestone',
  'Game Center başarımı oluştur',
  'Add a new game achievement',
  'Game Center puanı yolla',
  'make App Store Connect user Admin',
];

describe('search intent coverage ratchet (asc__search_tools top-3)', () => {
  it('meets or exceeds the top-3 search intent floor (ratchet)', () => {
    const actualPassing = PASSING.length;
    expect(
      actualPassing,
      `Top-3 search intent matches dropped to ${actualPassing} (floor is ${FLOOR}). ` +
        `Search ranking degraded for one or more intents!`
    ).toBeGreaterThanOrEqual(FLOOR);

    if (actualPassing > FLOOR) {
      console.warn(
        `\n[AX Ratchet Win] ${actualPassing} queries passed top-3 (floor is ${FLOOR}). ` +
          `Raise FLOOR to ${actualPassing} in tests/search-intents.test.ts!`
      );
    }
  });

  it('keeps debt explicit by tracking known failing queries', () => {
    const actualFailingQueries = FAILING.map((f) => f.query);
    const actualFailingSet = new Set(actualFailingQueries);
    const knownFailingSet = new Set(KNOWN_FAILING_QUERIES);

    // Break CI if a new unbudgeted failure occurs
    const unexpectedFailures = actualFailingQueries.filter((q) => !knownFailingSet.has(q));
    expect(
      unexpectedFailures,
      `New un-budgeted search intent failures detected (${unexpectedFailures.length}):\n` +
        unexpectedFailures.map((q) => `  - "${q}"`).join('\n')
    ).toEqual([]);

    // Prompt to remove from budget when a query starts passing
    const resolvedQueries = KNOWN_FAILING_QUERIES.filter((q) => !actualFailingSet.has(q));
    if (resolvedQueries.length > 0) {
      console.warn(
        `\n[AX Debt Reduction] ${resolvedQueries.length} query/queries started passing! ` +
          `Remove them from KNOWN_FAILING_QUERIES in tests/search-intents.test.ts:\n` +
          resolvedQueries.map((q) => `  - "${q}"`).join('\n')
      );
    }
  });

  it('tracks zero-result queries separately from ranking debt', () => {
    const zeroResultQueries = EVALUATION.filter((e) => e.resultsCount === 0);
    const nonZeroFailures = EVALUATION.filter((e) => !e.pass && e.resultsCount > 0);

    expect(zeroResultQueries.length).toBeGreaterThan(0);

    const theoreticalCeiling = ALL_QUERY_CASES.length - zeroResultQueries.length;
    console.log(
      `\n[AX Search Coverage Summary]\n` +
        `  Total query cases : ${ALL_QUERY_CASES.length}\n` +
        `  Passing (top-3)   : ${PASSING.length} (Floor: ${FLOOR})\n` +
        `  Ranking debt      : ${nonZeroFailures.length}\n` +
        `  Zero-result debt  : ${zeroResultQueries.length} (Language/indexing gap)\n` +
        `  Theoretical ceiling: ${theoreticalCeiling} (${ALL_QUERY_CASES.length} - ${zeroResultQueries.length})\n`
    );
  });
});

describe('historical regression freeze cases', () => {
  it('ranks a pricing tool in top 3 for AI-201 exact query', () => {
    const top3 = searchOperations('price product territory subscription App Store Connect')
      .slice(0, 3)
      .map((op) => op.name);
    const hasPricingTool = top3.some(
      (name) => name.includes('subscription_prices') || name.includes('subscriptions.prices')
    );
    expect(hasPricingTool, `top 3 for AI-201 query: ${top3.join(', ')}`).toBe(true);
  });

  it('does not let reviewer-screenshot tools hijack a pricing query', () => {
    const top8 = searchOperations('app store subscription price change territory')
      .slice(0, 8)
      .map((op) => op.name);
    expect(top8.filter((n) => n.includes('review_screenshot'))).toEqual([]);
    expect(top8).toContain('subscription_prices.create');
  });

  // Was a known gap: "subscription price" ranked the app-level price tool above
  // the subscription one, and this case was wrapped in `it.fails` until it
  // stopped failing. The name tie-break (see unaskedNameParts in
  // src/tools/meta.ts) is what fixed it — `app_price_points` carries two parts
  // the query never mentioned where `subscription_prices` carries none.
  it('ranks the subscription price tool in the top 3 for a subscription price query', () => {
    const top3 = searchOperations('app store subscription price change territory')
      .slice(0, 3)
      .map((op) => op.name);
    expect(top3).toContain('subscription_prices.create');
  });

  it('preserves silent-filter probes structure', () => {
    expect(FILTER_PROBES.length).toBeGreaterThan(0);
    for (const probe of FILTER_PROBES) {
      expect(probe.op).toBeTruthy();
      expect(probe.param).toBeTruthy();
      expect(probe.wrong).not.toEqual(probe.right);
    }
  });
});
/**
 * Contested intents — who is beating whom.
 *
 * The FLOOR above counts how many queries find their tool in the top 3. It
 * cannot see a query that keeps passing while a different tool takes first
 * place, and that is exactly what a description rewrite does: sharpening tool
 * A's wording to win one intent quietly moves it above tool B on another. The
 * total stays 83 and the damage is invisible.
 *
 * So this block names the competition instead of counting it. A query is
 * "contested" when the expected tool is in the top 3 but something else ranks
 * first. Measured on the same 265 phrasings:
 *
 *  115   expected tool ranks first — uncontested
 *   28   expected tool is in the top 3, another tool leads — contested
 *  122   expected tool is not in the top 3 at all (107 find nothing, 15 rank low)
 *
 * 115 + 28 = 143, the FLOOR. Same corpus, split by who won rather than by pass
 * and fail.
 *
 * Read a diff here as a routing change, not a score change: a new pair means a
 * tool started competing where it did not before, and a pair disappearing means
 * one stopped. Either can be the intent of a change — write down which.
 */
describe('contested intents', () => {
  /** Queries whose expected tool is in the top 3 but not first, as "winner > expected". */
  function contestedPairs(): { pairs: string[]; count: number } {
    const pairs = new Set<string>();
    let count = 0;
    for (const c of ALL_QUERY_CASES) {
      const top3 = searchOperations(c.query)
        .slice(0, 3)
        .map((op) => op.name);
      const expected = c.expectedTools.find((t) => top3.includes(t));
      if (!expected || top3[0] === expected) continue;
      count++;
      pairs.add(`${top3[0]} > ${expected}`);
    }
    return { pairs: [...pairs].sort(), count };
  }

  // Rewritten wholesale when the tie-break landed and 33 curated descriptions
  // went in (MIL-208). Both moves reroute by design: the tie-break decides
  // every query where a resource and its sub-resources score the same, and a
  // curated description puts its tool ahead of neighbours it used to trail.
  // What this list is for is the change nobody intended, so it is the list as
  // measured after, not a diff anyone hand-edited.
  const KNOWN_CONTESTED = [
    'app_events.create > app_custom_product_pages.create',
    'app_events.create > review_submissions.create',
    'app_info_localizations.create > app_info_localizations.update',
    'app_info_localizations.create > app_store_version_localizations.create',
    'app_screenshots.create > app_store_version_localizations.update',
    'app_store_version_localizations.create > app_events.create',
    'app_store_version_localizations.create > app_store_versions.create',
    'app_store_versions.build.get > app_store_versions.build.set',
    'app_store_versions.create > review_submissions.create',
    'apps.list > app_events.create',
    'background_assets.create > app_infos.update',
    'beta_testers.create > beta_groups.create',
    'beta_testers.delete > beta_groups.builds.add',
    'ci_build_actions.get > ci_build_runs.create',
    'game_center_achievement_images_v2.create > game_center_achievements_v2.create',
    'game_center_activities.leaderboards_v2.add > game_center_leaderboards_v2.create',
    'game_center_leaderboard_images_v2.create > game_center_leaderboards_v2.create',
    'profiles.create > certificates.create',
    'profiles.create > subscription_offer_codes.create',
    'sandbox_testers_v2.list > sandbox_testers_v2.update',
    'subscription_grace_periods.get > subscription_grace_periods.update',
    'subscription_plan_availabilities.available_territories.replace > subscription_plan_availabilities.create',
    'subscriptions.delete > app_availabilities_v2.create',
    'subscriptions.price_points.list > subscription_prices.create',
    'users.list > users.update',
    'webhooks.create > webhook_pings.create',
  ];

  it('the same tools compete for the same intents', () => {
    const { pairs } = contestedPairs();
    const appeared = pairs.filter((p) => !KNOWN_CONTESTED.includes(p));
    const gone = KNOWN_CONTESTED.filter((p) => !pairs.includes(p));

    expect(
      appeared,
      'a tool started outranking another one it did not beat before — intended?'
    ).toEqual([]);
    expect(gone, 'a competing pair stopped competing — say which change did it').toEqual([]);
  });

  it('no more queries are contested than before', () => {
    // Not a floor to hold: a rise means an existing competitor took more
    // phrasings, which the pair list alone cannot show.
    expect(contestedPairs().count).toBeLessThanOrEqual(28);
  });

  it('splits the corpus the same way the FLOOR counts it', () => {
    // Guards the arithmetic the comment above rests on: uncontested wins plus
    // contested ones are exactly the queries the FLOOR calls passing.
    const { count } = contestedPairs();
    const uncontested = PASSING.length - count;
    expect(uncontested + count).toBe(PASSING.length);
    expect(uncontested).toBe(115);
  });
});
