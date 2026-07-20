import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateKeyPairSync, createVerify } from 'node:crypto';
import { TokenProvider } from '../src/core/jwt.js';
import { RateLimiter } from '../src/core/rate-limit.js';
import { AscHttpClient } from '../src/core/http.js';
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
    expect(() => new TokenProvider({ keyId: 'A', issuerId: 'B' })).toThrow(
      /ASC_PRIVATE_KEY_PATH/
    );
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
