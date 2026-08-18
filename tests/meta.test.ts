import { describe, it, expect } from 'vitest';
import {
  META_TOOLS,
  executeMetaTool,
  searchOperations,
  summarizeExpirations,
} from '../src/tools/meta.js';

const DAY = 86_400_000;

function cert(id: string, name: string, inDays: number, now: number) {
  return {
    id,
    attributes: { displayName: name, expirationDate: new Date(now + inDays * DAY).toISOString() },
  };
}
function profile(id: string, name: string, inDays: number, now: number) {
  return {
    id,
    attributes: { name, expirationDate: new Date(now + inDays * DAY).toISOString() },
  };
}

/**
 * Search matches English literally, and nothing else. A hand-written Turkish
 * word list used to sit in front of it; it was removed because every further
 * language meant another hundred hand-typed rows, and the caller — a language
 * model — translates better than the table ever did.
 *
 * That only holds while the client is told to translate. These two tests are
 * the pair: search speaks one language, and it says so when it finds nothing.
 * Delete either half and the other becomes a trap.
 */
describe('asc__search_tools speaks English and says so', () => {
  it.each([
    ['de', 'Abonnementpreis ändern'],
    ['es', 'cambiar el precio de suscripcion'],
    ['tr', 'abonelik fiyatını güncelle'],
    ['bg', 'промяна на цената на абонамента'],
    ['ja', 'サブスクリプションの価格を変更'],
  ])('finds nothing for %s, because the catalogue is English', (_lang, query) => {
    expect(searchOperations(query)).toEqual([]);
  });

  it('finds the same goal asked in English', () => {
    expect(searchOperations('change subscription price').length).toBeGreaterThan(0);
  });

  it('tells the caller to search in English', () => {
    const search = META_TOOLS.find((t) => t.name === 'asc__search_tools');
    expect(search?.description).toMatch(/English/);
  });

  // A capital İ lowercases to i + U+0307, which matches no English word. It
  // arrives whenever someone types an English query on a Turkish keyboard.
  it('reads a capital İ as an i', () => {
    expect(searchOperations('İOS build').length).toBeGreaterThan(0);
  });
});

/**
 * The macros are the answer to the queries that made them necessary, so search
 * has to return them. It did not: they come from neither the OpenAPI spec nor
 * the StoreKit list, so `asc__search_tools` never saw them — a model asking how
 * to change a price found the five-call chain and nothing else. Appending them
 * was not enough either; eleven entries after 982 fall past any sane limit.
 */
describe('asc__search_tools finds the macros', () => {
  const ctx = (): any => ({
    registry: { get: () => undefined, size: 0, unloadedDomains: () => [] },
    http: { limiter: { status: () => ({}) } },
    tokens: { status: () => ({}) },
    readOnly: false,
    loadedDomains: [],
    macroOffered: () => true,
  });
  const search = async (query: string, limit = 3) =>
    ((await executeMetaTool('asc__search_tools', { query, limit }, ctx())) as any).matches.map(
      (m: any) => m.tool
    );

  it('ranks the one-call tool above the chain it replaces', async () => {
    expect(await search('change subscription price')).toContain('pricing__set_subscription_price');
  });

  it('finds the read macro from a plain question', async () => {
    expect(await search('what does the subscription cost in each country')).toContain(
      'pricing__get_subscription_price'
    );
  });

  // Multi-word queries used to miss every non-spec tool: matching was a
  // whole-phrase includes, and no description contains a whole question.
  it('matches a StoreKit tool word by word', async () => {
    expect(await search('check whether a customer owns this subscription', 5)).toContain(
      'storekit__check_entitlement'
    );
  });

  it('leaves unrelated queries to the generated tools', async () => {
    expect(await search('create certificate')).toEqual([
      'certificates.create',
      'profiles.create',
      // Was accessibility_declarations.create, on a tie broken alphabetically.
      // The name tie-break puts a tool whose name is two parts, one of them the
      // query's own word, above one whose name is three parts of which only
      // "create" was asked for.
      'certificates.delete',
    ]);
  });

  it('reports a macro the server does not offer as unloaded', async () => {
    const res: any = await executeMetaTool(
      'asc__search_tools',
      { query: 'change subscription price', limit: 3 },
      { ...ctx(), macroOffered: () => false }
    );
    expect(res.matches.find((m: any) => m.domain === 'macro').loaded).toBe(false);
  });
});

describe('summarizeExpirations (asc__status check_expirations)', () => {
  const now = Date.parse('2026-07-28T00:00:00Z');

  it('flags items inside the 30-day window, sorted by date, and counts totals', () => {
    const certs = [cert('c1', 'iOS Dist', 45, now), cert('c2', 'Mac Dist', 5, now), cert('c3', 'Old', 20, now)];
    const profiles = [profile('p1', 'AppStore Profile', 400, now)];

    const out = summarizeExpirations(certs, profiles, now);

    expect(out.certificates.total).toBe(3);
    expect(out.certificates.expiringSoon.map((c) => c.id)).toEqual(['c2', 'c3']); // date order
    expect(out.profiles.expiringSoon).toEqual([]);
    expect(out.summary).toContain('2 certificate(s) expire within 30 days');
  });

  it('reports the calm case in plain words', () => {
    const out = summarizeExpirations([cert('c1', 'x', 200, now)], [], now);
    expect(out.summary).toContain('No certificates expiring');
  });

  it('treats an already-expired item as expiring soon, not as safe', () => {
    const out = summarizeExpirations([cert('c1', 'expired', -3, now)], [], now);
    expect(out.certificates.expiringSoon).toHaveLength(1);
  });
});

describe('short tokens do not match mid-word', () => {
  it('scores nothing for a query that is only stopwords', () => {
    // Every one of these is inside an English word in the catalogue — "de" in
    // "delete", "le" in "role", "l" in almost everything — so as substrings
    // they used to rank hundreds of operations that share no meaning at all.
    for (const noise of ['le de l', 'la el de', 'de le']) {
      expect(searchOperations(noise), noise).toEqual([]);
    }
  });

  it('still finds a short token that is a word of its own', () => {
    // `ci` is Xcode Cloud, and someone typing it means it. The rule is
    // "must be its own word", not "must be long".
    const hits = searchOperations('ci');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((op) => op.name.startsWith('ci_'))).toBe(true);
  });

  it('leaves ordinary queries alone', () => {
    for (const q of ['change subscription price', 'add beta tester', 'create app store version']) {
      expect(searchOperations(q).length, q).toBeGreaterThan(0);
    }
  });

  it('survives a short token that is a regex metacharacter', () => {
    // A token under three characters is compiled into a RegExp, so anything the
    // query tokenizer does not strip reaches the constructor. It splits on
    // whitespace and , . : ; ! ? " ' ’ ( ) [ ] — everything else survives, and
    // an unescaped `*` or `{` there is a thrown SyntaxError on a user's search,
    // not a ranking mistake. Cheap to assert, expensive to find in production.
    const hostile = [
      '*', '+', '?', '^', '$', '{', '}', '|', '\\', '/', '-', '<', '>', '&', '#', '=', '~', '@',
      'a*', '*b', '{}', '|-', '$^', '(?', 'a\\', '--', '**', '??', '\\\\', '[]',
    ];
    for (const token of hostile) {
      expect(() => searchOperations(token), JSON.stringify(token)).not.toThrow();
      // Also alongside real words, where the token has to survive scoring too.
      expect(() => searchOperations(`price ${token} app`), JSON.stringify(token)).not.toThrow();
    }
  });
});
