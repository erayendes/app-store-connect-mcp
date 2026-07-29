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
 * Baseline floor for top-3 search intent matches.
 * Measured on Lane B's corrected 50-intent corpus (265 total query cases):
 * - Total query cases: 265
 * - Passing in top-3: 81 (FLOOR)
 * - Total failing: 184
 * - Zero-result queries: 114 (all Turkish - search engine does not index this language)
 *
 * Lowered floor from 92 to 81 because Lane B fixed 12 tautological queries.
 * Theoretical ceiling of the ratchet is 151 (265 total - 114 zero-results).
 */
const FLOOR = 81;

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
  // --- 114 zero-result queries: the search index has no Turkish ---
  "Türkiye’de haftalık aboneliği 99,99 TL yap",
  "TR fiyatını güncelle",
  "Türk kullanıcılar için zam yapmam lazım",
  "Haftalık aboneliğin bugün her ülkedeki fiyatını göster",
  "Ülke fiyatları ne?",
  "Hangi pazarda ne kadar ücret aldığımızı karşılaştırmam lazım",
  "100 jeton paketini Türkiye’de 49,99 TL yap",
  "IAP fiyatını değiştir",
  "Jeton paketinden elde ettiğimiz geliri artırmamız lazım",
  "Ücretli uygulamayı Türkiye’de 199,99 TL yap",
  "Uygulama fiyatını güncelle",
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
  "Win-back teklifleri ne?",
  "Ayrılan müşterilere hangi kampanyaları sunduğumuzu görmeliyim",
  "Türkçe açıklamayı ve 2.4 sürümünün Yenilikler metnini güncelle",
  "Mağaza metnini değiştir",
  "Yeni özellikler mağaza sayfasında doğru görünsün",
  "Mağaza sayfasına Almanca dilini ekle",
  "DE lokalizasyonu aç",
  "Almanya’daki kullanıcılar mağaza metnini kendi dilinde görsün",
  "Türkçe uygulama adını ve alt başlığını yeni markaya göre değiştir",
  "Adı ve alt başlığı güncelle",
  "Yeni marka mağazada doğru görünsün",
  "Kumar simülasyonu yanıtını ekleyip yaş derecelendirmesini güncelle",
  "Yaş beyanını değiştir",
  "Yeni içerik yüzünden doğru yaş sınırını göstermeliyiz",
  "Ana App Store kategorisini Eğitim olarak değiştir",
  "Kategoriyi güncelle",
  "Uygulama doğru mağaza bölümünde bulunsun",
  "2.4 sürümünü ekleriyle birlikte incelemeye gönder",
  "İncelemeye yolla",
  "Bu sürüm artık Apple’ın onay kuyruğuna girsin",
  "2.4 sürümünü yedi güne yayarak kademeli yayınla",
  "Kademeli yayını başlat",
  "Sorun çıkarsa herkesi etkilemeden durdurabilelim",
  "Bu sürüm için build seç",
  "Yeni App Store sürümü oluştur",
  "Yeni versiyon aç",
  "Onaydan sonra manuel yayın iste",
  "Sürümü elle yayınlama talebi oluştur",
  "Son build’i TestFlight grubuna gönder",
  "E-posta ile beta testçi davet et",
  "Yeni TestFlight testçisi ekle",
  "organize external testers",
  "Yeni bir TestFlight grubu oluştur",
  "change StoreKit test account details",
  "Test kullanıcısının sandbox bilgilerini değiştir",
  "Edit this StoreKit sandbox user",
  "Takım üyesinin rolünü değiştir",
  "Kullanıcı yetkisini güncelle",
  "Update this team member’s permissions",
  "Mağaza sayfasına ekran görüntüsü yükle",
  "Özel ürün sayfası oluştur",
  "Uygulama içi etkinlik oluştur",
  "Müşteri yorumuna cevap ver",
  "Satış raporunu indir",
  "Günlük satış verisini getir",
  "Finans raporunu indir",
  "Ödeme ve gelir raporunu getir",
  "Get this month’s financial report",
  "Analiz raporu isteği oluştur",
  "generate distribution signing credential",
  "İmzalama sertifikası oluştur",
  "Yeni dağıtım sertifikası üret",
  "Generate a new distribution certificate",
  "Geliştirme cihazı kaydet",
  "Yeni test cihazını provisioning’e ekle",
  "Provisioning profili oluştur",
  "Yeni imzalama profili üret",
  "Xcode Cloud iş akışı oluştur",
  "CI derlemesini çalıştır",
  "Workflow’un buildlerini listele",
  "Show builds from this CI workflow",
  "Oyuna yeni achievement ekle",
  "Game Center liderlik tablosu oluştur",
  "Yeni leaderboard ekle",
  "Liderlik tablosuna skor gönder",
  "Olay bildirim URL’si ekle",
  "Webhook adresine test isteği gönder",
  "Endpoint’i ping ile dene",
  "Test this webhook delivery URL",
  "add a downloadable resource pack",
  "Arka plan varlık paketi oluştur",
  "Gruptaki tek bir testçi bile kalmasın",
  "TestFlight grubunu testçilerden temizle",
  "Bu ürünü bir daha kullanılamayacak şekilde kaldır",
  "Bu subscription’ı kaldır",
  "Eski müşterileri de zamlı tarifeye geçir",
  "Mevcut aboneler de yeni fiyatı ödesin",
  "Abonelik neredeyse bedava olsun",
  "Aboneliği bir kuruş yap",
  "Hiçbir ülkede satışta görünmesin",
  "Her yerde satışa kapat",
  "Turn off store availability worldwide",
  "remove obsolete signing credential",
  "İmzalamada kullanılan bu sertifikayı kaldır",
  "Dağıtım sertifikasını sil",
  "Takım üyesine tüm yönetici yetkilerini ver",
  "Bu kişiyi Admin yap",
  "Make this user an Admin",
  "Onaylanan sürüm beklemeden canlıya çıksın",
  "Versiyonu şimdi yayınla",
  "Publish the approved app right now",
  // --- 70 ranked-too-low queries: the tool exists in the results, below rank 3 ---
  "Set the Turkey price for our weekly plan",
  "Set a new price for this IAP",
  "Change the app price",
  "Set a new price for the app",
  "Make a promo code for this subscription",
  "Make the subscription available in Germany",
  "Add a territory to subscription availability",
  "Show subscription win-back offers",
  "List offers for lapsed subscribers",
  "Change the app content rating",
  "change app store primary category",
  "Change the primary store category",
  "Set a different app category",
  "Send the version to App Review",
  "select build for app store version",
  "Select a build for this version",
  "Attach the uploaded build to the release",
  "start the next release",
  "Start the next store release",
  "Beta grubuna build ekle",
  "Beta test grubu aç",
  "Make a TestFlight tester group",
  "change team member permissions",
  "Change an App Store Connect user role",
  "Custom product page ekle",
  "Make a campaign-specific App Store page",
  "promote a limited-time activity",
  "App Store etkinliği yayınla",
  "Create an in-app event",
  "Add a promotional event to the store",
  "reply to customer review",
  "Bu App Store değerlendirmesine yanıt yaz",
  "Reply to a customer review",
  "ask for product usage metrics",
  "Analytics raporu talep et",
  "Add a device for provisioning",
  "prepare app signing configuration",
  "Make a new signing profile",
  "set up automated build pipeline",
  "Yeni CI workflow ekle",
  "Set up a CI workflow",
  "Xcode Cloud build başlat",
  "Run the CI build now",
  "Xcode Cloud çalıştırmalarını göster",
  "add a new player milestone",
  "Game Center başarımı oluştur",
  "Create a Game Center achievement",
  "Add a new game achievement",
  "add a ranked score board",
  "Create a Game Center leaderboard",
  "Add a score leaderboard",
  "submit Game Center leaderboard score",
  "Game Center puanı yolla",
  "Submit a Game Center leaderboard score",
  "Post this score to the leaderboard",
  "ping App Store Connect webhook",
  "Add an iOS Background Assets package",
  "remove all beta testers from group",
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
