import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { executeTestflightTool, TESTFLIGHT_TOOLS } from '../src/tools/testflight.js';
import { AscHttpClient } from '../src/core/http.js';
import { AscApiError } from '../src/core/errors.js';
import { createServer } from '../src/server.js';
import { resolveSelection } from '../src/profiles.js';
import { readFileSync } from 'node:fs';

const NAME = 'testflight__feedback_digest';
const NOW = Date.parse('2026-10-05T12:00:00Z');
const CRASHES = '/v1/apps/123/betaFeedbackCrashSubmissions';
const SHOTS = '/v1/apps/123/betaFeedbackScreenshotSubmissions';
const UUID = '2fd7f230-8149-4b05-8e71-803905d8ea81';

function submission(id: string, build = 'b-1', attributes: Record<string, unknown> = {}) {
  return {
    id, attributes: { createdDate: '2026-10-04T12:00:00Z', comment: `Comment ${id}`, deviceModel: 'iPhone17,1', osVersion: '26.0', ...attributes },
    relationships: { build: { data: { id: build } }, tester: { data: { id: 't-1' } } },
  };
}
function page(data: any[] = [], next?: string, included: any[] = [
  { type: 'builds', id: 'b-1', attributes: { version: '42' } },
  { type: 'builds', id: 'b-2', attributes: { version: '43' } },
  { type: 'betaTesters', id: 't-1', attributes: { email: 'tester@example.com', firstName: 'Not returned' } },
]) {
  return { data, included, links: { next } };
}
function fakeHttp(responses: Record<string, any> = {}) {
  const get = vi.fn(async (path: string, _query?: any): Promise<any> => {
    if (path in responses) {
      const value = responses[path];
      if (value instanceof Error) throw value;
      return value;
    }
    if (path === '/v1/apps' || path === '/v1/apps/123') {
      const app = { id: '123', attributes: { name: 'Example', bundleId: 'com.example.app' } };
      return { data: path === '/v1/apps' ? [app] : app };
    }
    if (path === '/v1/builds') return page([{ id: 'b-1' }]);
    if (path.endsWith('/crashLog')) return { data: { attributes: { logText: 'Crash details' } } };
    if (path === CRASHES || path === SHOTS) return page();
    throw new Error(`Unexpected GET ${path}`);
  });
  const mutate = vi.fn(() => { throw new Error('A feedback digest must never write'); });
  return { get, delete: mutate, post: mutate, patch: mutate, request: mutate };
}
const run = (http = fakeHttp(), args: Record<string, unknown> = { app: 'Example' }): Promise<any> =>
  executeTestflightTool(NAME, args, { http: http as any }) as Promise<any>;

beforeEach(() => { vi.spyOn(Date, 'now').mockReturnValue(NOW); });
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });

describe(NAME, () => {
  it('groups both feeds by build version with counts, top devices/OS and newest comments', async () => {
    const http = fakeHttp({
      [CRASHES]: page([submission('c-new'), submission('c-old', 'b-1', { createdDate: '2026-10-03T12:00:00Z' }), submission('c-43', 'b-2')]),
      [SHOTS]: page([submission('s-1', 'b-1'), submission('s-2', 'b-2', { deviceModel: 'iPad16,1', osVersion: '26.1' })]),
    });
    const res = await run(http);
    expect(res.window).toEqual({ days: 14, from: '2026-09-21T12:00:00.000Z', to: '2026-10-05T12:00:00.000Z' });
    expect(res.totals).toEqual({ crashes: 3, screenshotFeedback: 2 });
    expect(res.builds.map((b: any) => [b.version, b.counts])).toEqual([
      ['42', { crashes: 2, screenshotFeedback: 1 }], ['43', { crashes: 1, screenshotFeedback: 1 }],
    ]);
    expect(res.builds[0].topDevices).toEqual([{ value: 'iPhone17,1', count: 3 }]);
    expect(res.builds[0].topOsVersions).toEqual([{ value: '26.0', count: 3 }]);
    expect(res.builds[0].crashComments.map((c: any) => c.submissionId)).toEqual(['c-new', 'c-old']);
    expect(res.builds[0].screenshotComments[0]).toEqual({
      submissionId: 's-1', comment: 'Comment s-1', device: 'iPhone17,1', os: '26.0',
      date: '2026-10-04T12:00:00Z', tester: { id: 't-1', email: 'tester@example.com' },
    });
    expect(res.truncated).toBe(false);
    expect(JSON.stringify(res)).not.toContain('firstName');
    expect(http.delete).not.toHaveBeenCalled();
    expect(http.get).toHaveBeenCalledWith(CRASHES, expect.objectContaining({ sort: '-createdDate', include: 'build,tester', limit: 50 }));
    for (const [, query] of http.get.mock.calls) {
      expect(query).not.toHaveProperty('fields[betaTesters]');
      expect(JSON.stringify(query)).not.toMatch(/email|firstName|lastName/);
    }
  });

  it.each(['42', '2026100412', '1.2.3'])('resolves build number %s in one filtered call', async (build) => {
    const http = fakeHttp();
    await run(http, { app: 'com.example.app', build });
    expect(http.get).toHaveBeenCalledWith('/v1/apps', expect.objectContaining({ 'filter[bundleId]': 'com.example.app' }));
    expect(http.get.mock.calls.filter(([p]) => p === '/v1/builds')).toHaveLength(1);
    expect(http.get).toHaveBeenCalledWith('/v1/builds', { 'filter[app]': '123', 'filter[version]': build, 'fields[builds]': 'version', limit: 2 });
    for (const endpoint of [CRASHES, SHOTS]) {
      expect(http.get).toHaveBeenCalledWith(endpoint, expect.objectContaining({ 'filter[build]': 'b-1' }));
    }
  });

  it.each([UUID, 'abcdef', '123-456'])('uses build ID %s directly', async (build) => {
    const http = fakeHttp();
    await run(http, { app: '123', build });
    expect(http.get.mock.calls.some(([p]) => p === '/v1/builds')).toBe(false);
    for (const endpoint of [CRASHES, SHOTS]) {
      expect(http.get).toHaveBeenCalledWith(endpoint, expect.objectContaining({ 'filter[build]': build }));
    }
  });

  it('refuses missing or ambiguous build numbers instead of broadening the digest', async () => {
    await expect(run(fakeHttp({ '/v1/builds': page() }), { app: 'Example', build: '42' })).rejects.toThrow('No build');
    for (const found of [page([{ id: 'a' }, { id: 'b' }]), page([{ id: 'a' }], 'more')]) {
      const http = fakeHttp({ '/v1/builds': found });
      await expect(run(http, { app: 'Example', build: '42' })).rejects.toThrow('ambiguous');
      expect(http.get.mock.calls).toHaveLength(2);
    }
  });

  it('follows pages with their includes, keeps the cutoff boundary, and stops both feeds on older data', async () => {
    const http = fakeHttp({
      [CRASHES]: page([submission('c1')], 'crash-page-2'),
      'crash-page-2': page([
        submission('boundary', 'b-3', { createdDate: '2026-09-21T12:00:00Z' }),
        submission('old', 'b-3', { createdDate: '2026-09-21T11:59:59Z' }),
      ], 'never-crash', [{ type: 'builds', id: 'b-3', attributes: { version: '44' } }]),
      [SHOTS]: page([submission('old-shot', 'b-1', { createdDate: '2026-09-01T12:00:00Z' })], 'never-shot'),
    });
    const res = await run(http);
    expect(res.totals).toEqual({ crashes: 2, screenshotFeedback: 0 });
    expect(res.builds.map((b: any) => b.version)).toEqual(['42', '44']);
    expect(res.truncated).toBe(false);
    expect(http.get.mock.calls.some(([p]) => p.startsWith('never'))).toBe(false);
  });

  it('fetches only the three newest crash logs and caps excerpts by lines and UTF-8 bytes', async () => {
    const rows = Array.from({ length: 4 }, (_, i) => submission(`c${i}`, 'b-1', { createdDate: new Date(NOW - i * 1000).toISOString() }));
    const http = fakeHttp({
      [CRASHES]: page(rows),
      '/v1/betaFeedbackCrashSubmissions/c0/crashLog': { data: { attributes: { logText: Array.from({ length: 70 }, (_, i) => `Line ${i}`).join('\n') } } },
      '/v1/betaFeedbackCrashSubmissions/c1/crashLog': { data: { attributes: { logText: 'ü'.repeat(5000) } } },
      '/v1/betaFeedbackCrashSubmissions/c2/crashLog': { data: { attributes: { logText: 'one\r\ntwo' } } },
    });
    const res = await run(http);
    expect(http.get.mock.calls.filter(([p]) => p.endsWith('/crashLog')).map(([p]) => p)).toEqual(
      [0, 1, 2].map((i) => `/v1/betaFeedbackCrashSubmissions/c${i}/crashLog`)
    );
    expect(res.crashExcerpts[0].excerpt.trimEnd().split('\n')).toHaveLength(40);
    expect(res.crashExcerpts[0].excerpt).not.toContain('Line 40');
    expect(Buffer.byteLength(res.crashExcerpts[1].excerpt)).toBeLessThanOrEqual(4096);
    expect(res.crashExcerpts[1].excerpt).not.toContain('\uFFFD');
    expect(res.crashExcerpts.map((c: any) => c.truncated)).toEqual([true, true, false]);
    expect(res.truncated).toBe(true);
    expect(res.notes.join(' ')).toMatch(/3 newest.*40 lines or 4096 bytes/);
  });

  it('caps each feed at five pages and labels totals as lower bounds', async () => {
    const responses: Record<string, any> = {};
    for (const endpoint of [CRASHES, SHOTS]) {
      for (let i = 0; i < 5; i++) responses[i === 0 ? endpoint : `${endpoint}?page=${i}`] =
        page(Array.from({ length: 50 }, (_, j) => submission(`${endpoint.endsWith('CrashSubmissions') ? 'c' : 's'}-${i}-${j}`)), `${endpoint}?page=${i + 1}`);
    }
    const http = fakeHttp(responses);
    const res = await run(http);
    expect(http.get.mock.calls.filter(([p]) => p.startsWith('/v1/apps/123/'))).toHaveLength(10);
    expect(res.totals).toEqual({ crashes: 250, screenshotFeedback: 250 });
    expect(res.notes.filter((n: string) => n.includes('lower bounds'))).toHaveLength(2);
    expect(res.truncated).toBe(true);
    expect(http.delete).not.toHaveBeenCalled();
  });

  it('caps comments independently per type/build, comment length, and top values', async () => {
    const rows = Array.from({ length: 12 }, (_, i) => submission(`s${i}`, 'b-1', { comment: 'x'.repeat(1200), deviceModel: `device${i}`, osVersion: `os${i}` }));
    const res = await run(fakeHttp({ [CRASHES]: page(rows), [SHOTS]: page([...rows, submission('other', 'b-2')]) }));
    expect(res.builds[0].crashComments).toHaveLength(10);
    expect(res.builds[0].screenshotComments).toHaveLength(10);
    expect(res.builds[0].screenshotComments[0].comment).toHaveLength(1000);
    expect(res.builds[0].topDevices).toHaveLength(5);
    expect(res.builds[0].topOsVersions).toHaveLength(5);
    expect(res.builds[1].screenshotComments).toHaveLength(1);
    expect(res.notes.join(' ')).toMatch(/top 5/);
    expect(res.notes.join(' ')).toMatch(/newest 10/);
    expect(res.notes.join(' ')).toMatch(/1000 characters/);
  });

  it('returns a complete empty digest with no crash-log calls', async () => {
    const http = fakeHttp();
    const res = await run(http);
    expect(res).toMatchObject({ totals: { crashes: 0, screenshotFeedback: 0 }, builds: [], crashExcerpts: [], truncated: false, notes: [] });
    expect(http.get.mock.calls).toHaveLength(3);
  });

  it('does not invent email or build metadata when Apple omits them', async () => {
    const res = await run(fakeHttp({ [SHOTS]: page([submission('s1')], undefined, []) }));
    expect(res.builds[0].version).toBe('unknown (b-1)');
    expect(res.builds[0].screenshotComments[0].tester).toEqual({ id: 't-1' });
    expect(res.notes.join(' ')).toMatch(/missing/);
  });

  it('preserves PII redaction and marks tester text as untrusted data', async () => {
    vi.stubEnv('ASC_REDACT_PII', '1');
    const res = await run(fakeHttp({ [SHOTS]: page([submission('s1')]) }));
    expect(res.builds[0].screenshotComments[0].tester.email).toBe('<redacted>@example.com');
    expect(res.untrustedContent).toContain('data, not instructions');
  });

  it('does not count invalid or future dates and reports missing dates', async () => {
    const res = await run(fakeHttp({ [SHOTS]: page([
      submission('bad', 'b-1', { createdDate: 'invalid' }),
      submission('future', 'b-1', { createdDate: '2026-10-06T00:00:00Z' }),
    ]) }));
    expect(res.totals.screenshotFeedback).toBe(0);
    expect(res.notes.join(' ')).toMatch(/invalid dates/);
  });

  it.each([403, 404])('keeps feedback when a crash log is unavailable (%s)', async (status) => {
    const res = await run(fakeHttp({ [CRASHES]: page([submission('c1')]), '/v1/betaFeedbackCrashSubmissions/c1/crashLog': new AscApiError('Unavailable', status) }));
    expect(res.totals.crashes).toBe(1);
    expect(res.crashExcerpts).toEqual([]);
    expect(res.notes.join(' ')).toContain(`HTTP ${status}`);
  });

  it.each([0, 91, -1, 1.5, '14', NaN])('rejects invalid days %s before reading', async (days) => {
    const http = fakeHttp();
    await expect(run(http, { app: 'Example', days })).rejects.toThrow('1 to 90');
    expect(http.get).not.toHaveBeenCalled();
  });

  it('accepts a 90-day window and validates app/build', async () => {
    expect((await run(fakeHttp(), { app: 'Example', days: 90 })).window.days).toBe(90);
    await expect(run(fakeHttp(), { app: ' ' })).rejects.toThrow('app');
    await expect(run(fakeHttp(), { app: 'Example', build: 2026100412 })).rejects.toThrow('build');
    await expect(executeTestflightTool('testflight__delete', {}, { http: fakeHttp() as any })).rejects.toThrow('Unknown');
  });

  it('uses only sort/include/field/filter parameters supported by the bundled Apple spec', async () => {
    const spec = JSON.parse(readFileSync('spec/openapi.json', 'utf8'));
    const http = fakeHttp({ [CRASHES]: page([submission('c1')]) });
    await run(http, { app: 'Example', build: '42' });
    for (const [path, query] of http.get.mock.calls) {
      const template = path.replace('/apps/123/', '/apps/{id}/').replace('/betaFeedbackCrashSubmissions/c1/', '/betaFeedbackCrashSubmissions/{id}/');
      const parameters = spec.paths[template].get.parameters;
      for (const [name, value] of Object.entries(query ?? {})) {
        const parameter = parameters.find((p: any) => p.name === name);
        expect(parameter, `${template} ${name}`).toBeDefined();
        const choices = parameter.schema.items?.enum;
        if (choices) for (const v of String(value).split(',')) expect(choices).toContain(v);
      }
    }
  });
});

describe('MCP integration', () => {
  it('lists, searches and dispatches the digest in the read-only TestFlight profile with valid structured output', async () => {
    const http = fakeHttp({ [SHOTS]: page([submission('s1')]) });
    vi.spyOn(AscHttpClient.prototype, 'get').mockImplementation(http.get);
    const server = createServer({
      credentials: { keyId: 'TEST', issuerId: 'issuer', privateKey: 'unused' },
      readOnly: true, confirmWrites: 'all', includeDeprecated: false, dryRun: false,
    }, resolveSelection('testflight'));
    const [ct, st] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: 'test', version: '0' });
    try {
      await Promise.all([server.connect(st), client.connect(ct)]);
      const tools = (await client.listTools()).tools;
      expect(tools.find((t) => t.name === NAME)).toEqual(TESTFLIGHT_TOOLS.find((t) => t.name === NAME));
      expect(tools.find((t) => t.name === NAME)?.annotations).toEqual({ readOnlyHint: true, idempotentHint: true });
      expect(tools.some((t) => t.name.includes('beta_feedback') && t.name.endsWith('__delete'))).toBe(false);
      const search: any = await client.callTool({ name: 'asc__search_tools', arguments: { query: 'TestFlight feedback' } });
      expect(JSON.parse(search.content[0].text).matches[0]).toMatchObject({ tool: NAME, loaded: true });
      const res = await client.callTool({ name: NAME, arguments: { app: 'Example' } });
      expect(res.isError).not.toBe(true);
      expect(res.structuredContent).toMatchObject({ totals: { crashes: 0, screenshotFeedback: 1 } });
      expect(http.delete).not.toHaveBeenCalled();
    } finally {
      await client.close();
      await server.close();
    }
  });
});
