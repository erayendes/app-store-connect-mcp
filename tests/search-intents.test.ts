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
 *   passing in top-3   105   ← FLOOR
 *   ranked too low      90   the tool is found, below third
 *   no results at all   70   nothing matched, in any language
 *
 * It has moved twice, and both moves were the point:
 *   92 → 81   lane B stopped queries from naming their own target, so the
 *             ranking had to be earned rather than spelled out
 *   81 → 105  query-language expansion gave non-English phrasings something to
 *             match; 44 queries that returned literally nothing now resolve
 *
 * Ceiling today is 195 (265 minus the 70 that still find nothing).
 */
const FLOOR = 105;

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
 * Pinned list of known failing queries (184 total debt items).
 * Explicit debt tracking: 114 zero-result language indexing gaps + 70 search ranking misses.
 */
const KNOWN_FAILING_QUERIES: string[] = [
  // --- 70 zero-result queries: still no match even after alias expansion ---
  "Türkiye’de haftalık aboneliği 99,99 TL yap",
  "Türk kullanıcılar için zam yapmam lazım",
  "Hangi pazarda ne kadar ücret aldığımızı karşılaştırmam lazım",
  "100 jeton paketini Türkiye’de 49,99 TL yap",
  "Jeton paketinden elde ettiğimiz geliri artırmamız lazım",
  "Ücretli uygulamayı Türkiye’de 199,99 TL yap",
  "Yeni kullanıcı başına daha fazla gelir elde etmeliyiz",
  "give customers a redeemable discount",
  "Yıllık abonelik için yüzde 20 indirimli teklif kodu oluştur",
  "İndirim kodu aç",
  "Eski müşterileri kampanyayla geri kazanmak istiyorum",
  "Aylık aboneliği Almanya’da da satışa aç",
  "DE satışını aç",
  "Alman kullanıcılar artık abone olabilsin",
  "Aylık aboneliğe 16 günlük ödeme ek süresi tanımla",
  "Ek süreyi aç",
  "Kartı reddedilen müşteriyi hemen kaybetmeyelim",
  "Aylık aboneliğin etkin geri kazanım tekliflerini göster",
  "Ayrılan müşterilere hangi kampanyaları sunduğumuzu görmeliyim",
  "Türkçe açıklamayı ve 2.4 sürümünün Yenilikler metnini güncelle",
  "Yeni özellikler mağaza sayfasında doğru görünsün",
  "Almanya’daki kullanıcılar mağaza metnini kendi dilinde görsün",
  "Türkçe uygulama adını ve alt başlığını yeni markaya göre değiştir",
  "Adı ve alt başlığı güncelle",
  "Yeni marka mağazada doğru görünsün",
  "Kumar simülasyonu yanıtını ekleyip yaş derecelendirmesini güncelle",
  "Yeni içerik yüzünden doğru yaş sınırını göstermeliyiz",
  "Ana App Store kategorisini Eğitim olarak değiştir",
  "Uygulama doğru mağaza bölümünde bulunsun",
  "2.4 sürümünü ekleriyle birlikte incelemeye gönder",
  "İncelemeye yolla",
  "Bu sürüm artık Apple’ın onay kuyruğuna girsin",
  "2.4 sürümünü yedi güne yayarak kademeli yayınla",
  "Sorun çıkarsa herkesi etkilemeden durdurabilelim",
  "Yeni versiyon aç",
  "Onaydan sonra manuel yayın iste",
  "Son build’i TestFlight grubuna gönder",
  "organize external testers",
  "Yeni bir TestFlight grubu oluştur",
  "change StoreKit test account details",
  "Edit this StoreKit sandbox user",
  "Takım üyesinin rolünü değiştir",
  "Günlük satış verisini getir",
  "generate distribution signing credential",
  "Yeni dağıtım sertifikası üret",
  "Generate a new distribution certificate",
  "Geliştirme cihazı kaydet",
  "Yeni imzalama profili üret",
  "Show builds from this CI workflow",
  "Liderlik tablosuna skor gönder",
  "Webhook adresine test isteği gönder",
  "Endpoint’i ping ile dene",
  "Test this webhook delivery URL",
  "add a downloadable resource pack",
  "Gruptaki tek bir testçi bile kalmasın",
  "Bu ürünü bir daha kullanılamayacak şekilde kaldır",
  "Bu subscription’ı kaldır",
  "Eski müşterileri de zamlı tarifeye geçir",
  "Abonelik neredeyse bedava olsun",
  "Aboneliği bir kuruş yap",
  "Hiçbir ülkede satışta görünmesin",
  "Her yerde satışa kapat",
  "Turn off store availability worldwide",
  "remove obsolete signing credential",
  "İmzalamada kullanılan bu sertifikayı kaldır",
  "Takım üyesine tüm yönetici yetkilerini ver",
  "Bu kişiyi Admin yap",
  "Make this user an Admin",
  "Onaylanan sürüm beklemeden canlıya çıksın",
  "Publish the approved app right now",
  // --- 90 ranked-too-low queries: the tool is found, below rank 3 ---
  "TR fiyatını güncelle",
  "Set the Turkey price for our weekly plan",
  "Haftalık aboneliğin bugün her ülkedeki fiyatını göster",
  "Ülke fiyatları ne?",
  "Set a new price for this IAP",
  "Uygulama fiyatını güncelle",
  "Change the app price",
  "Set a new price for the app",
  "Make a promo code for this subscription",
  "Make the subscription available in Germany",
  "Add a territory to subscription availability",
  "Win-back teklifleri ne?",
  "Show subscription win-back offers",
  "List offers for lapsed subscribers",
  "Mağaza metnini değiştir",
  "DE lokalizasyonu aç",
  "Change the app content rating",
  "change app store primary category",
  "Kategoriyi güncelle",
  "Change the primary store category",
  "Set a different app category",
  "Send the version to App Review",
  "select build for app store version",
  "Select a build for this version",
  "Attach the uploaded build to the release",
  "start the next release",
  "Yeni App Store sürümü oluştur",
  "Start the next store release",
  "E-posta ile beta testçi davet et",
  "Beta test grubu aç",
  "Make a TestFlight tester group",
  "change team member permissions",
  "Change an App Store Connect user role",
  "Update this team member’s permissions",
  "Custom product page ekle",
  "Make a campaign-specific App Store page",
  "promote a limited-time activity",
  "Uygulama içi etkinlik oluştur",
  "App Store etkinliği yayınla",
  "Create an in-app event",
  "Add a promotional event to the store",
  "reply to customer review",
  "Müşteri yorumuna cevap ver",
  "Bu App Store değerlendirmesine yanıt yaz",
  "Reply to a customer review",
  "Get this month’s financial report",
  "ask for product usage metrics",
  "Analytics raporu talep et",
  "Add a device for provisioning",
  "prepare app signing configuration",
  "Make a new signing profile",
  "set up automated build pipeline",
  "Set up a CI workflow",
  "Xcode Cloud build başlat",
  "CI derlemesini çalıştır",
  "Run the CI build now",
  "Xcode Cloud çalıştırmalarını göster",
  "add a new player milestone",
  "Game Center başarımı oluştur",
  "Oyuna yeni achievement ekle",
  "Create a Game Center achievement",
  "Add a new game achievement",
  "add a ranked score board",
  "Game Center liderlik tablosu oluştur",
  "Yeni leaderboard ekle",
  "Create a Game Center leaderboard",
  "Add a score leaderboard",
  "submit Game Center leaderboard score",
  "Game Center puanı yolla",
  "Submit a Game Center leaderboard score",
  "Post this score to the leaderboard",
  "Olay bildirim URL’si ekle",
  "ping App Store Connect webhook",
  "Arka plan varlık paketi oluştur",
  "Add an iOS Background Assets package",
  "remove all beta testers from group",
  "TestFlight grubunu testçilerden temizle",
  "Delete every tester in this beta group",
  "Remove all TestFlight testers",
  "remove recurring product entirely",
  "Delete this subscription completely",
  "Remove the subscription product",
  "remove app availability all territories",
  "Remove the app from every country",
  "Remove the distribution certificate",
  "make App Store Connect user Admin",
  "Grant this team member admin access",
  "release app store version immediately",
  "Versiyonu şimdi yayınla",
  "Release the version immediately",
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

  // Known gap: "subscription price" ranks the app-level price tool above the
  // subscription one. Same shape as AI-201. When this starts passing, vitest
  // fails the case and this wrapper comes off.
  it.fails('ranks the subscription price tool in the top 3 for a subscription price query', () => {
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
