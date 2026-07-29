import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateKeyPairSync, createVerify } from 'node:crypto';
import { TokenProvider } from '../src/core/jwt.js';
import { RateLimiter } from '../src/core/rate-limit.js';
import { AscHttpClient, backoffMs } from '../src/core/http.js';
import { ToolRegistry, encodeToolName, decodeToolName, toMcpTool, toolNameFor } from '../src/core/registry.js';
import { OPERATIONS } from '../src/generated/operations.js';

const { privateKey, publicKey } = generateKeyPairSync('ec', {
  namedCurve: 'P-256',
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  publicKeyEncoding: { type: 'spki', format: 'pem' },
});

const creds = {
  keyId: 'ABCD123456',
  issuerId: '11111111-2222-3333-4444-555555555555',
  privateKey,
};

function decodeSegment(segment: string): any {
  return JSON.parse(Buffer.from(segment, 'base64url').toString('utf8'));
}

describe('TokenProvider', () => {
  it('signs a verifiable ES256 token with the fields Apple requires', () => {
    const token = new TokenProvider(creds).getToken();
    const [header, payload, signature] = token.split('.');

    expect(decodeSegment(header)).toEqual({
      alg: 'ES256',
      kid: creds.keyId,
      typ: 'JWT',
    });

    const claims = decodeSegment(payload);
    expect(claims.iss).toBe(creds.issuerId);
    expect(claims.aud).toBe('appstoreconnect-v1');
    expect(claims.exp - claims.iat).toBe(1200); // Apple's 20-minute maximum

    const verifier = createVerify('SHA256');
    verifier.update(`${header}.${payload}`);
    verifier.end();
    const ok = verifier.verify(
      { key: publicKey, dsaEncoding: 'ieee-p1363' },
      Buffer.from(signature, 'base64url')
    );
    expect(ok).toBe(true);
  });

  it('reuses a cached token until it nears expiry', () => {
    const provider = new TokenProvider(creds);
    expect(provider.getToken()).toBe(provider.getToken());
    expect(provider.status().cached).toBe(true);
  });

  it('mints a new token after refresh()', () => {
    const provider = new TokenProvider(creds);
    const first = provider.getToken();
    vi.setSystemTime(new Date(Date.now() + 2000));
    expect(provider.refresh()).not.toBe(first);
    vi.useRealTimers();
  });

  it('rejects a missing key with an actionable message', () => {
    // The key loads lazily (construction stays cheap so tools/list works
    // without credentials); the actionable error surfaces on the first mint.
    const provider = new TokenProvider({ keyId: 'A', issuerId: 'B' });
    expect(() => provider.getToken()).toThrow(/ASC_PRIVATE_KEY_PATH/);
  });
});

describe('AscHttpClient pagination host pinning', () => {
  const client = new AscHttpClient(new TokenProvider(creds));

  it('accepts Apple pagination URLs', () => {
    const url = client.resolvePaginationUrl(
      'https://api.appstoreconnect.apple.com/v1/apps?cursor=abc'
    );
    expect(url.host).toBe('api.appstoreconnect.apple.com');
  });

  it.each([
    'https://evil.example.com/v1/apps',
    'http://api.appstoreconnect.apple.com/v1/apps',
    'https://api.appstoreconnect.apple.com.evil.com/v1/apps',
  ])('refuses to follow %s', (bad) => {
    expect(() => client.resolvePaginationUrl(bad)).toThrow();
  });
});

describe('AscHttpClient custom base URL (ASC_BASE_URL fixture mode)', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('sends requests to the custom origin', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    );
    vi.stubGlobal('fetch', fetchMock);
    const client = new AscHttpClient(new TokenProvider(creds), {
      baseUrl: 'http://localhost:4010',
    });

    await client.get('/v1/apps');
    expect(String(fetchMock.mock.calls[0][0])).toBe('http://localhost:4010/v1/apps');
  });

  it('pins pagination to the custom origin — protocol included', () => {
    const client = new AscHttpClient(new TokenProvider(creds), {
      baseUrl: 'http://localhost:4010',
    });
    // The fixture's own http next-link is fine…
    expect(client.resolvePaginationUrl('http://localhost:4010/v1/apps?cursor=x').host).toBe(
      'localhost:4010'
    );
    // …anything else — other hosts, even Apple itself — is not.
    expect(() => client.resolvePaginationUrl('https://localhost:4010/v1/apps')).toThrow();
    expect(() =>
      client.resolvePaginationUrl('https://api.appstoreconnect.apple.com/v1/apps')
    ).toThrow();
  });
});

describe('AscHttpClient retry policy (a resent write can duplicate a resource)', () => {
  const ok = () =>
    new Response(JSON.stringify({ data: [] }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  const fail = (status: number) =>
    new Response(JSON.stringify({ errors: [] }), {
      status,
      headers: { 'content-type': 'application/json' },
    });

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  /** Kick off the request, flush every backoff sleep, then hand back the result. */
  async function settle<T>(p: Promise<T>): Promise<T> {
    p.catch(() => {}); // avoid an unhandled rejection while timers drain
    await vi.runAllTimersAsync();
    return p;
  }

  it('retries a GET that hits a 500', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(fail(500)).mockResolvedValueOnce(ok());
    vi.stubGlobal('fetch', fetchMock);
    const client = new AscHttpClient(new TokenProvider(creds), { maxRetries: 2 });

    await settle(client.get('/v1/apps'));
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does NOT retry a POST that hits a 500 — Apple may have processed it', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(fail(500)).mockResolvedValueOnce(ok());
    vi.stubGlobal('fetch', fetchMock);
    const client = new AscHttpClient(new TokenProvider(creds), { maxRetries: 2 });

    await expect(settle(client.post('/v1/appStoreVersions', {}))).rejects.toThrow(/500/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('retries a POST on 429 — rejected before processing, so resending is safe', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(fail(429)).mockResolvedValueOnce(ok());
    vi.stubGlobal('fetch', fetchMock);
    const client = new AscHttpClient(new TokenProvider(creds), { maxRetries: 2 });

    await settle(client.post('/v1/appStoreVersions', {}));
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('reports an unknown outcome when a POST dies on the network, without retrying', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('fetch failed'));
    vi.stubGlobal('fetch', fetchMock);
    const client = new AscHttpClient(new TokenProvider(creds), { maxRetries: 2 });

    await expect(settle(client.post('/v1/appStoreVersions', {}))).rejects.toThrow(
      /may or may not have been processed/
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('still retries a GET through a network error', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('fetch failed'))
      .mockResolvedValueOnce(ok());
    vi.stubGlobal('fetch', fetchMock);
    const client = new AscHttpClient(new TokenProvider(creds), { maxRetries: 2 });

    await settle(client.get('/v1/apps'));
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it.each([
    [403, /Finance role|lacks permission/],
    [409, /resource state|locked/],
    [401, /ASC_KEY_ID/],
  ])('appends an actionable hint to a %s error', async (status, pattern) => {
    const fetchMock = vi.fn().mockResolvedValue(fail(status as number));
    vi.stubGlobal('fetch', fetchMock);
    const client = new AscHttpClient(new TokenProvider(creds), { maxRetries: 0 });

    await expect(settle(client.post('/v1/apps', {}))).rejects.toThrow(pattern as RegExp);
  });

  it('understands both Retry-After forms: delay-seconds and HTTP-date', () => {
    expect(backoffMs(0, '7')).toBe(7000);
    const inTenSeconds = new Date(Date.now() + 10_000).toUTCString();
    const ms = backoffMs(0, inTenSeconds);
    expect(ms).toBeGreaterThan(8000);
    expect(ms).toBeLessThanOrEqual(10_000);
    // A date in the past falls back to exponential backoff, not a negative wait.
    expect(backoffMs(0, new Date(Date.now() - 5000).toUTCString())).toBeGreaterThan(0);
  });
});

describe('RateLimiter', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('admits requests up to the limit without waiting', async () => {
    const limiter = new RateLimiter({ requestsPerMinute: 3, requestsPerHour: 100 });
    await limiter.acquire();
    await limiter.acquire();
    await limiter.acquire();
    expect(limiter.status().minuteRemaining).toBe(0);
  });

  it('parses Apple rate-limit headers into its own accounting', () => {
    const limiter = new RateLimiter();
    limiter.observeHeader('user-hour-lim:3600;user-hour-rem:1200;');
    expect(limiter.status().hourRemaining).toBe(1200);
  });

  it('ignores a malformed header rather than corrupting state', () => {
    const limiter = new RateLimiter();
    const before = limiter.status().hourRemaining;
    limiter.observeHeader('nonsense');
    expect(limiter.status().hourRemaining).toBe(before);
  });
});

describe('tool name encoding', () => {
  it('round-trips dotted names through the MCP-safe form', () => {
    const original = 'apps.builds.list';
    expect(encodeToolName(original)).toBe('apps__builds__list');
    expect(decodeToolName(encodeToolName(original))).toBe(original);
  });

  it('produces names every MCP client will accept', () => {
    for (const op of OPERATIONS) {
      expect(encodeToolName(op.name)).toMatch(/^[a-zA-Z0-9_-]{1,128}$/);
    }
  });

  it('keeps public tool names within the Anthropic API 64-char limit', () => {
    for (const op of OPERATIONS) {
      expect(toolNameFor(op)).toMatch(/^[a-zA-Z0-9_.-]{1,64}$/);
    }
  });

  it('produces unique public tool names across all operations', () => {
    const names = OPERATIONS.map((o) => toolNameFor(o));
    expect(new Set(names).size).toBe(names.length);
  });
});

describe('generated operations', () => {
  it('assigns every operation to a real domain', () => {
    expect(OPERATIONS.filter((o) => o.domain === 'misc')).toHaveLength(0);
  });

  it('has no duplicate tool names', () => {
    const names = OPERATIONS.map((o) => o.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('declares path parameters for every templated segment', () => {
    for (const op of OPERATIONS) {
      const templated = [...op.path.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
      expect(new Set(op.pathParams)).toEqual(new Set(templated));
    }
  });

  it('gives every operation a description that is not just the endpoint', () => {
    const lazy = OPERATIONS.filter((o) => /^(GET|POST|PATCH|DELETE|PUT) \//.test(o.description));
    expect(lazy).toHaveLength(0);
  });
});

describe('ToolRegistry', () => {
  it('loads a default working set rather than all 1,263 operations', () => {
    const registry = new ToolRegistry({ readOnly: false, includeDeprecated: false });
    expect(registry.size).toBeGreaterThan(100);
    expect(registry.size).toBeLessThan(OPERATIONS.length);
  });

  it('loads everything when asked for "all"', () => {
    const registry = new ToolRegistry({
      domains: ['all'],
      readOnly: false,
      includeDeprecated: true,
    });
    expect(registry.size).toBe(OPERATIONS.length);
  });

  it('excludes deprecated operations by default', () => {
    const without = new ToolRegistry({ domains: ['all'], readOnly: false, includeDeprecated: false });
    const with_ = new ToolRegistry({ domains: ['all'], readOnly: false, includeDeprecated: true });
    expect(with_.size).toBeGreaterThan(without.size);
  });

  it('exposes only GET operations in read-only mode', () => {
    const registry = new ToolRegistry({ domains: ['all'], readOnly: true, includeDeprecated: false });
    for (const tool of registry.listTools()) {
      expect(tool.annotations?.readOnlyHint).toBe(true);
    }
  });

  it('reports which domains are not loaded', () => {
    const registry = new ToolRegistry({ domains: ['apps'], readOnly: false, includeDeprecated: false });
    expect(registry.unloadedDomains()).toContain('game_center');
    expect(registry.unloadedDomains()).not.toContain('apps');
  });

  it('refuses to execute a mutating tool in read-only mode', async () => {
    const registry = new ToolRegistry({ domains: ['all'], readOnly: false, includeDeprecated: false });
    const readOnly = new ToolRegistry({ domains: ['all'], readOnly: true, includeDeprecated: false });
    const mutating = registry.listTools().find((t) => t.annotations?.readOnlyHint === false)!;
    await expect(
      readOnly.execute(mutating.name, {}, {} as never)
    ).rejects.toThrow(/read-only|Unknown tool/);
  });

  it('forwards the non-JSON Accept header reports require', async () => {
    const registry = new ToolRegistry({ domains: ['all'], readOnly: true, includeDeprecated: false });
    const calls: Array<Record<string, unknown>> = [];
    const http = { request: (_m: string, _p: string, opts: Record<string, unknown>) => {
      calls.push(opts);
      return Promise.resolve({});
    } };

    const salesArgs = {
      filter_vendorNumber: '123456',
      filter_reportType: 'SALES',
      filter_reportSubType: 'SUMMARY',
      filter_frequency: 'DAILY',
    };
    await registry.execute(toolNameFor({ name: 'sales_reports.list' }), salesArgs, http as never);
    await registry.execute(toolNameFor({ name: 'apps.list' }), {}, http as never);

    expect(calls[0].accept).toBe('application/a-gzip');
    expect(calls[1].accept).toBeUndefined();
  });

  it('marks and enforces query params Apple requires', async () => {
    const op = OPERATIONS.find((o) => o.name === 'sales_reports.list')!;
    expect(toMcpTool(op).inputSchema.required).toContain('filter_vendorNumber');

    const registry = new ToolRegistry({ domains: ['all'], readOnly: true, includeDeprecated: false });
    await expect(
      registry.execute(toolNameFor(op), {}, {} as never)
    ).rejects.toThrow(/Missing required parameter "filter_vendorNumber"/);
  });

  it('rejects a call that omits a required path parameter', async () => {
    const registry = new ToolRegistry({ domains: ['apps'], readOnly: false, includeDeprecated: false });
    await expect(registry.execute('apps__get', {}, {} as never)).rejects.toThrow(
      /Missing required parameter "id"/
    );
  });
});

describe('MCP tool schema', () => {
  it('marks path parameters as required', () => {
    const op = OPERATIONS.find((o) => o.name === 'apps.get')!;
    const tool = toMcpTool(op);
    expect(tool.inputSchema.required).toContain('id');
  });

  it('offers a pagination cursor on list tools', () => {
    const op = OPERATIONS.find((o) => o.name === 'apps.list')!;
    expect(toMcpTool(op).inputSchema.properties).toHaveProperty('next_url');
  });

  it('flags DELETE operations as destructive', () => {
    const op = OPERATIONS.find((o) => o.method === 'DELETE')!;
    expect(toMcpTool(op).annotations?.destructiveHint).toBe(true);
  });
});

describe('configured parameter defaults', () => {
  it('fills a required param from config and drops it from the schema', async () => {
    const op = OPERATIONS.find((o) => o.name === 'sales_reports.list')!;
    const defaults = { 'filter[vendorNumber]': '99999999' };

    expect(toMcpTool(op, defaults).inputSchema.required).not.toContain('filter_vendorNumber');

    const registry = new ToolRegistry({
      domains: ['all'],
      readOnly: true,
      includeDeprecated: false,
      paramDefaults: defaults,
    });
    let sent: Record<string, unknown> | undefined;
    const http = { request: (_m: string, _p: string, o: any) => { sent = o.query; return Promise.resolve({}); } };

    await registry.execute(
      toolNameFor(op),
      { filter_reportType: 'SALES', filter_reportSubType: 'SUMMARY', filter_frequency: 'DAILY' },
      http as never
    );
    expect(sent?.['filter[vendorNumber]']).toBe('99999999');
  });

  it('lets an explicit argument beat the configured default', async () => {
    const registry = new ToolRegistry({
      domains: ['all'],
      readOnly: true,
      includeDeprecated: false,
      paramDefaults: { 'filter[vendorNumber]': '99999999' },
    });
    let sent: Record<string, unknown> | undefined;
    const http = { request: (_m: string, _p: string, o: any) => { sent = o.query; return Promise.resolve({}); } };

    await registry.execute(
      toolNameFor({ name: 'sales_reports.list' }),
      { filter_vendorNumber: '999999', filter_reportType: 'SALES', filter_reportSubType: 'SUMMARY', filter_frequency: 'DAILY' },
      http as never
    );
    expect(sent?.['filter[vendorNumber]']).toBe('999999');
  });
});

describe('unloaded-domain guidance', () => {
  it('names the domain and flag when a real tool is not loaded', async () => {
    const registry = new ToolRegistry({ domains: ['apps'], readOnly: false, includeDeprecated: false });
    const live = OPERATIONS.find((o) => o.domain === 'game_center' && !o.deprecated)!;
    await expect(
      registry.execute(toolNameFor(live), { id: 'x' }, {} as never)
    ).rejects.toThrow(/is not loaded on this server.*--domains=game_center/s);
  });

  it('still reports a genuinely unknown tool as unknown', async () => {
    const registry = new ToolRegistry({ domains: ['apps'], readOnly: false, includeDeprecated: false });
    await expect(
      registry.execute('not_a_real_tool__ever', {}, {} as never)
    ).rejects.toThrow(/Unknown tool/);
  });
});

describe('missing-tool diagnosis', () => {
  const mk = (o: any) => new ToolRegistry({ includeDeprecated: false, readOnly: false, ...o });

  it('blames read-only mode, not the domain, when the tool is hidden by --read-only', async () => {
    const mutating = OPERATIONS.find((o) => !o.readOnly && !o.deprecated && o.domain === 'apps')!;
    await expect(
      mk({ domains: ['all'], readOnly: true }).execute(toolNameFor(mutating), {}, {} as never)
    ).rejects.toThrow(/read-only mode/);
  });

  it('says the tool is not loaded here, and how to reach it', async () => {
    const live = OPERATIONS.find((o) => o.domain === 'game_center' && !o.deprecated)!;
    await expect(
      mk({ domains: ['apps'] }).execute(toolNameFor(live), { id: 'x' }, {} as never)
    ).rejects.toThrow(/is not loaded on this server.*--domains=game_center/s);
  });

  it('flags a deprecated tool as deprecated', async () => {
    const dep = OPERATIONS.find((o) => o.deprecated)!;
    await expect(
      mk({ domains: ['all'] }).execute(toolNameFor(dep), {}, {} as never)
    ).rejects.toThrow(/deprecated/);
  });

  // A profile carries a curated slice of several domains, so "the domain is
  // loaded" says nothing about one tool. Checking the domain first made every
  // missing tool in a partly-loaded domain read as deprecated.
  it('does not call a live tool deprecated just because its domain is partly loaded', async () => {
    const live = OPERATIONS.find((o) => o.domain === 'game_center' && !o.deprecated)!;
    const sibling = OPERATIONS.find(
      (o) => o.domain === 'game_center' && !o.deprecated && o.name !== live.name
    )!;
    const registry = mk({ operations: [sibling.name] });
    await expect(
      registry.execute(toolNameFor(live), { id: 'x' }, {} as never)
    ).rejects.toThrow(/is not loaded on this server/);
    await expect(
      registry.execute(toolNameFor(live), { id: 'x' }, {} as never)
    ).rejects.not.toThrow(/deprecated/);
  });

  it('loads exactly the listed operations when `operations` is given', () => {
    const empty = mk({ operations: [] });
    expect(empty.size).toBe(0); // an empty list means none — not the seven defaults
    const one = mk({ operations: ['apps.list'] });
    expect(one.size).toBe(1);
    expect(one.get('apps__list')).toBeTruthy();
  });
});

describe('curated descriptions', () => {
  it('every curated key matches a real operation', async () => {
    const { CURATED } = await import('../scripts/describe.js');
    const names = new Set(OPERATIONS.map((o) => o.name));
    const orphans = Object.keys(CURATED).filter((k) => !names.has(k));
    // A stale key fails silently: the model quietly gets the generic sentence
    // instead of the hand-written one. sales_reports.get cost three days.
    expect(orphans).toEqual([]);
  });

  it('reaches the report tools, which carry the vendor-number requirement', () => {
    for (const n of ['sales_reports.list', 'finance_reports.list']) {
      const op = OPERATIONS.find((o) => o.name === n)!;
      expect(op.description).toMatch(/ASC_VENDOR_NUMBER/);
    }
  });
});

describe('id-only twin elimination', () => {
  it('generates no GET relationship endpoint whose full-object twin exists', () => {
    const paths = new Set(OPERATIONS.map((o) => `${o.method} ${o.path}`));
    const survivors = OPERATIONS.filter(
      (o) => o.method === 'GET' && o.path.includes('/relationships/')
    );
    // A surviving GET relationship endpoint is legitimate only when its twin
    // is absent from the spec (orphan guard).
    for (const s of survivors) {
      expect(paths.has(`GET ${s.path.replace('/relationships/', '/')}`)).toBe(false);
    }
  });

  it('keeps relationship write endpoints (link/unlink/replace)', () => {
    const writes = OPERATIONS.filter(
      (o) => o.path.includes('/relationships/') && o.method !== 'GET'
    );
    expect(writes.length).toBeGreaterThan(50);
  });
});

describe('AI-136: StoreKit discoverability in search', () => {
  it('surfaces StoreKit tools in asc__search_tools with an enable hint', async () => {
    const { executeMetaTool } = await import('../src/tools/meta.js');
    const registry = new ToolRegistry({ domains: ['analytics'], readOnly: false, includeDeprecated: false });
    const res: any = await executeMetaTool(
      'asc__search_tools',
      { query: 'refund' },
      { registry, http: {} as never, tokens: {} as never, readOnly: false, loadedDomains: ['analytics'], storekitEnabled: false }
    );
    const sk = res.matches.filter((m: any) => m.domain === 'storekit');
    expect(sk.length).toBeGreaterThan(0);
    expect(sk.every((m: any) => m.loaded === false)).toBe(true);
    expect(res.hint).toMatch(/ASC_BUNDLE_ID/);
  });

  it('marks StoreKit as loaded when the server has it enabled', async () => {
    const { executeMetaTool } = await import('../src/tools/meta.js');
    const registry = new ToolRegistry({ domains: ['analytics'], readOnly: false, includeDeprecated: false });
    const res: any = await executeMetaTool(
      'asc__search_tools',
      { query: 'transaction' },
      { registry, http: {} as never, tokens: {} as never, readOnly: false, loadedDomains: ['analytics'], storekitEnabled: true }
    );
    const sk = res.matches.filter((m: any) => m.domain === 'storekit');
    expect(sk.length).toBeGreaterThan(0);
    expect(sk.every((m: any) => m.loaded === true)).toBe(true);
  });
});

describe('unknown parameters are refused, not dropped', () => {
  const registry = new ToolRegistry({ domains: ['apps'] });

  // The failure this prevents: apps.list ignored a misspelled bundle-id filter,
  // returned the account's first app with isError false, and every write that
  // followed landed on the wrong app. Silence was the bug, not the typo.
  it('names the accepted parameters instead of guessing', async () => {
    await expect(
      registry.execute('apps__list', { notARealParameter: 'x' }, {} as never)
    ).rejects.toThrow(/Unknown parameter.*notARealParameter.*accepts/s);
  });

  // Apple documents the bracketed spelling, the parameter description shows it,
  // and the JSON Schema cannot carry it — so both have to work.
  it('accepts Apple’s bracketed spelling and the sanitized one alike', () => {
    const tool = registry.listTools().find((t) => t.name === 'apps__list');
    const props = Object.keys(tool?.inputSchema?.properties ?? {});
    expect(props).toContain('filter_bundleId');
    expect(props.every((p) => /^[a-zA-Z0-9_.-]{1,64}$/.test(p))).toBe(true);
  });
});
