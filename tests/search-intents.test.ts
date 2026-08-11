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
 *   passing in top-3    83   ← FLOOR
 *   ranked too low      64   the tool is found, below third
 *   no results at all  118   nothing matched — almost all of them Turkish
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
const FLOOR = 83;

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
 * Pinned list of known failing queries: 118 that find nothing, 64 that rank
 * below third. A failure not on this list breaks CI, so the cost of a change
 * has to be written down before it can land.
 *
 * The final block is the 25 queries the removed Turkish word list used to
 * carry. They are listed apart rather than merged in, because they are not the
 * same kind of debt as the rest: nothing here needs fixing in the search code,
 * the client translates now.
 */
const KNOWN_FAILING_QUERIES: string[] = [
  // --- zero-result queries: the catalogue is English and these are not ---
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

  // --- 23 queries the Turkish word list used to carry, measured on removal ---
  "IAP fiyatını değiştir",
  "Mağaza sayfasına Almanca dilini ekle",
  "Yaş beyanını değiştir",
  "Kademeli yayını başlat",
  "Bu sürüm için build seç",
  "Sürümü elle yayınlama talebi oluştur",
  "Beta grubuna build ekle",
  "Yeni TestFlight testçisi ekle",
  "Test kullanıcısının sandbox bilgilerini değiştir",
  "Kullanıcı yetkisini güncelle",
  "Mağaza sayfasına ekran görüntüsü yükle",
  "Özel ürün sayfası oluştur",
  "Satış raporunu indir",
  "Finans raporunu indir",
  "Ödeme ve gelir raporunu getir",
  "Analiz raporu isteği oluştur",
  "İmzalama sertifikası oluştur",
  "Yeni test cihazını provisioning’e ekle",
  "Provisioning profili oluştur",
  "Xcode Cloud iş akışı oluştur",
  "Yeni CI workflow ekle",
  "Mevcut aboneler de yeni fiyatı ödesin",
  "Dağıtım sertifikasını sil",
  // These two used to pass, on nothing. A Turkish suffix after an apostrophe
  // splits off a one- or two-letter token — "build'i" gives "i", "Workflow'un"
  // gives "un" — and a fragment that short is inside so many English words that
  // it scored a hit against almost every operation. Take that padding away and
  // "Son build'i TestFlight grubuna gönder" matches `build` and `testflight`
  // and nothing else: two hits against a threshold of three. Same debt as the
  // rest of this block, it was just wearing a passing grade.
  "Son build’i TestFlight grubuna gönder",
  "Workflow’un buildlerini listele",
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
 *   53   expected tool ranks first — uncontested
 *   30   expected tool is in the top 3, another tool leads — contested
 *  182   expected tool is not in the top 3 at all (118 find nothing, 64 rank low)
 *
 * 53 + 30 = 83, the FLOOR. Same corpus, split by who won rather than by pass
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

  const KNOWN_CONTESTED = [
    'app_custom_product_page_localizations.create > app_custom_product_pages.create',
    'app_info_localizations.create > app_info_localizations.update',
    'app_info_localizations.create > app_store_version_localizations.create',
    'app_screenshots.create > app_store_version_localizations.update',
    'app_store_version_localizations.create > app_store_versions.create',
    'app_store_versions.build.get > app_store_versions.build.set',
    'app_store_versions.create > review_submissions.create',
    // "reply to customer review" ties now that `to` has to be its own word
    // rather than the one inside `customer`, and a tie breaks alphabetically.
    // The response tool is still in the top 3; it just stopped leading.
    'app_store_versions.customer_reviews.list > customer_review_responses.create',
    // Curating analytics_report_segments.get ("the rows are gzipped TSV at that
    // URL — this response carries the link, not the data") put it above
    // sales_reports.list on the sales-report queries. Accepted: both really are
    // "get report data", and sales_reports.list still ranks in the top 3.
    'analytics_report_segments.get > sales_reports.list',
    // `apps.analytics_report_requests.list > analytics_report_requests.create`
    // was here and is gone: the curated description for the create tool put it
    // first on "Request an analytics report", which is the tool that intent
    // wants. The listing tool no longer leads.
    'apps.android_to_ios_app_mapping_details.list > webhook_pings.create',
    'apps.background_assets.list > background_assets.create',
    'apps.subscription_grace_period.get > subscription_grace_periods.update',
    'background_asset_upload_files.create > background_assets.create',
    'beta_testers.create > beta_groups.create',
    'bundle_ids.create > profiles.create',
    'ci_build_runs.builds.list > ci_workflows.build_runs.list',
    'ci_build_runs.create > ci_workflows.create',
    'sandbox_testers_clear_purchase_history_request_v2.create > sandbox_testers_v2.update',
    'subscription_offer_code_custom_codes.create > subscription_offer_codes.create',
    'subscription_plan_availabilities.available_territories.list > subscription_plan_availabilities.create',
    'subscription_price_points.equalizations.list > subscription_prices.create',
    'subscription_prices.create > subscriptions.prices.list',
    'subscriptions.price_points.list > subscription_prices.create',
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
    expect(contestedPairs().count).toBeLessThanOrEqual(32);
  });

  it('splits the corpus the same way the FLOOR counts it', () => {
    // Guards the arithmetic the comment above rests on: uncontested wins plus
    // contested ones are exactly the queries the FLOOR calls passing.
    const { count } = contestedPairs();
    const uncontested = PASSING.length - count;
    expect(uncontested + count).toBe(PASSING.length);
    expect(uncontested).toBe(53);
  });
});
