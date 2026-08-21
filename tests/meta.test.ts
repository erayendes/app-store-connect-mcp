import { describe, it, expect } from 'vitest';
import {
  META_TOOLS,
  executeMetaTool,
  searchOperations,
  summarizeExpirations,
  probeCapabilities,
} from '../src/tools/meta.js';
import { AscApiError } from '../src/core/errors.js';

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

/**
 * check_capabilities: one cheap probe per role family, because Apple never
 * says which role a key has. A team key's role is picked at creation and
 * never read back; an individual key silently inherits its creator's roles
 * and app restrictions. So the only honest way to answer "can this key do X"
 * is to try X cheaply and see what comes back — never to guess from a name.
 */
describe('asc__status check_capabilities', () => {
  const baseCtx = (http: any): any => ({
    registry: { get: () => undefined, size: 0, unloadedDomains: () => [] },
    http,
    tokens: { status: () => ({}) },
    readOnly: false,
    loadedDomains: [],
  });

  /**
   * An `AscHttpClient`-shaped fake: `.get` answers per exact path and records
   * every path it saw, `.limiter` satisfies the `rateLimit` field every
   * `asc__status` call reads regardless of which flags are set.
   */
  function fakeHttp(answer: (path: string) => unknown): { get: any; limiter: any; calls: string[] } {
    const calls: string[] = [];
    return {
      calls,
      limiter: { status: () => ({}) },
      get: async (path: string) => {
        calls.push(path);
        const result = answer(path);
        if (result instanceof Error) throw result;
        return result;
      },
    };
  }

  const appsOk = { data: [{ id: 'app-1' }] };
  const ok = () => ({ data: [] });
  const forbidden = () => new AscApiError('forbidden', 403);
  const unauthorized = () => new AscApiError('unauthorized', 401);
  const networkError = () => new AscApiError('Network error: fetch failed', 0);
  const serverError = () => new AscApiError('server error', 503);

  it('reports each of the four states, read straight off the probe', async () => {
    const http = fakeHttp((path) => {
      if (path.endsWith('/analyticsReportRequests')) return forbidden();
      if (path.endsWith('/appInfos')) return unauthorized();
      if (path.endsWith('/customerReviews')) return networkError();
      if (path === '/v1/users') return ok();
      if (path === '/v1/certificates') return serverError();
      return ok();
    });
    const report = await probeCapabilities(http as any, 'ok', 'app-1');
    expect(report.reports).toBe('forbidden');
    expect(report.metadata).toBe('unauthorized');
    // Network failure — must never read as forbidden. This is the one
    // mistake that would send a working key back through setup for nothing.
    expect(report.reviews).toBe('unknown');
    expect(report.userManagement).toBe('ok');
    // A 5xx is inconclusive, same bucket as a network failure.
    expect(report.provisioning).toBe('unknown');
  });

  it('never calls a family probe forbidden because the network failed', async () => {
    // Same case as above, isolated: every family probe fails at the
    // transport layer, and every single one must land on unknown.
    const http = fakeHttp(() => networkError());
    const report = await probeCapabilities(http as any, 'ok', 'app-1');
    for (const family of ['reports', 'metadata', 'reviews', 'userManagement', 'provisioning'] as const) {
      expect(report[family], family).toBe('unknown');
    }
  });

  it('short-circuits on an unauthorized baseline: nothing else is probed', async () => {
    const http = fakeHttp(() => ok());
    const report = await probeCapabilities(http as any, 'unauthorized', undefined);
    expect(report.reports).toBe('unauthorized');
    expect(report.metadata).toBe('unauthorized');
    expect(report.reviews).toBe('unauthorized');
    expect(report.userManagement).toBe('unauthorized');
    expect(report.provisioning).toBe('unauthorized');
    expect(report.summary).toMatch(/key itself is not authenticating/);
    // The whole point of the short circuit: five calls that would all fail
    // the same way for the same reason are never made.
    expect(http.calls).toEqual([]);
  });

  it('marks the app-scoped families unknown, not forbidden, when there is no app to probe', async () => {
    // A baseline that answers ok with zero apps in the account (or that
    // itself came back forbidden/unknown) leaves no app id. That is exactly
    // the "no app to cover the probe" shape unknown exists for.
    const http = fakeHttp((path) => {
      if (path === '/v1/users' || path === '/v1/certificates') return ok();
      throw new Error('an app-scoped family was probed with no app id');
    });
    const report = await probeCapabilities(http as any, 'ok', undefined);
    expect(report.reports).toBe('unknown');
    expect(report.metadata).toBe('unknown');
    expect(report.reviews).toBe('unknown');
    expect(report.userManagement).toBe('ok');
    expect(report.provisioning).toBe('ok');
  });

  it('reuses a certificates probe already made for check_expirations', async () => {
    const http = fakeHttp((path) => {
      if (path === '/v1/certificates') throw new Error('provisioning re-fetched certificates');
      return ok();
    });
    const report = await probeCapabilities(http as any, 'ok', 'app-1', 'forbidden');
    expect(report.provisioning).toBe('forbidden');
    expect(http.calls).not.toContain('/v1/certificates');
  });

  it('does not fire a single probe when the flag is off', async () => {
    const http = fakeHttp(() => appsOk);
    const res: any = await executeMetaTool(
      'asc__status',
      { check_connection: false },
      baseCtx(http)
    );
    expect(res.capabilities).toBeUndefined();
    expect(http.calls).toEqual([]);
  });

  it('shares the baseline call with check_connection instead of asking twice', async () => {
    const http = fakeHttp((path) => (path === '/v1/apps' ? appsOk : ok()));
    const res: any = await executeMetaTool(
      'asc__status',
      { check_capabilities: true },
      baseCtx(http)
    );
    expect(res.connection.ok).toBe(true);
    expect(res.capabilities.baseline).toBe('ok');
    expect(http.calls.filter((p) => p === '/v1/apps')).toHaveLength(1);
  });

  it('shares the certificates call with check_expirations instead of asking twice', async () => {
    const http = fakeHttp((path) => {
      if (path === '/v1/apps') return appsOk;
      if (path === '/v1/certificates') return { data: [] };
      if (path === '/v1/profiles') return { data: [] };
      return ok();
    });
    const res: any = await executeMetaTool(
      'asc__status',
      { check_expirations: true, check_capabilities: true },
      baseCtx(http)
    );
    expect(res.expirations.summary).toBeDefined();
    expect(res.capabilities.provisioning).toBe('ok');
    expect(http.calls.filter((p) => p === '/v1/certificates')).toHaveLength(1);
  });

  it('stays a read-only tool with the new flag added', () => {
    const status = META_TOOLS.find((t) => t.name === 'asc__status')!;
    expect(status.annotations?.readOnlyHint).toBe(true);
    expect((status.inputSchema.properties as any).check_capabilities.type).toBe('boolean');
  });
});
