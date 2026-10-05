import { describe, expect, it } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { AscApiError } from '../src/core/errors.js';
import { createServer } from '../src/server.js';
import { resolveSelection } from '../src/profiles.js';
import { executeTestflightTool, TESTFLIGHT_TOOLS } from '../src/tools/testflight.js';

function fakeHttp(options: { state?: string; expired?: boolean; assigned?: string[]; fail?: string; assignedHasMore?: boolean } = {}) {
  const posts: Array<{ path: string; body: unknown }> = [];
  const reads: Array<{ path: string; query: Record<string, unknown> | undefined; maxPages: number | undefined }> = [];
  const groups = [
    { id: 'g1', attributes: { name: 'Internal', isInternalGroup: true } },
    { id: 'g2', attributes: { name: 'External', isInternalGroup: false } },
  ];
  const http = {
    get: async () => ({ data: { id: '123', attributes: { name: 'Demo' } } }),
    collect: async (path: string, query?: Record<string, unknown>, maxPages?: number) => {
      reads.push({ path, query, maxPages });
      return ({
      items: path === '/v1/builds'
        ? [{ id: 'b1', attributes: { version: '42', processingState: options.state ?? 'VALID', expired: options.expired ?? false } }]
        : path === '/v1/betaGroups' ? groups.filter((g) => (options.assigned ?? []).includes(g.id))
        : path.endsWith('/betaGroups') ? groups : [],
      hasMore: path === '/v1/betaGroups' && options.assignedHasMore === true,
    });
    },
    post: async (path: string, body: unknown) => {
      posts.push({ path, body });
      if (options.fail && path.includes(`/betaGroups/${options.fail}/`)) {
        throw new AscApiError('Apple rejected the assignment', 409, [{ title: 'Conflict', detail: 'Build not eligible' }]);
      }
    },
  };
  return { http: http as never, posts, reads };
}

const args = { app: '123', build: '42', groups: ['Internal', 'External'] };
const run = (http: never, options: Record<string, unknown> = args, dryRun = false) =>
  executeTestflightTool('testflight__assign_build_to_groups', options, { http, dryRun }) as Promise<any>;

describe('testflight__assign_build_to_groups', () => {
  it('assigns every selected group and warns about external review', async () => {
    const { http, posts, reads } = fakeHttp();
    const result = await run(http);
    expect(result.groups.map((g: any) => g.status)).toEqual(['assigned', 'assigned']);
    expect(posts).toEqual(['g1', 'g2'].map((id) => ({
      path: `/v1/betaGroups/${id}/relationships/builds`,
      body: { data: [{ type: 'builds', id: 'b1' }] },
    })));
    expect(result.groups[1].note).toMatch(/beta app review/);
    expect(reads).toEqual([
      { path: '/v1/builds', query: { 'filter[app]': '123', 'filter[version]': '42', 'fields[builds]': 'version,processingState,expired,expirationDate', limit: 200 }, maxPages: 2 },
      { path: '/v1/apps/123/betaGroups', query: { 'fields[betaGroups]': 'name,isInternalGroup', limit: 200 }, maxPages: 5 },
      { path: '/v1/betaGroups', query: { 'filter[app]': '123', 'filter[builds]': 'b1', limit: 200 }, maxPages: 1 },
    ]);
  });

  it('looks up an opaque build ID with filter[id]', async () => {
    const { http, reads } = fakeHttp();
    await run(http, { ...args, build: 'b1' });
    expect(reads[0].query).toMatchObject({ 'filter[app]': '123', 'filter[id]': 'b1' });
    expect(reads[0].query).not.toHaveProperty('filter[version]');
  });

  it('treats a long timestamp build number as a version, not an ID', async () => {
    const { http, reads } = fakeHttp();
    await run(http, { ...args, build: '2026100412' }).catch(() => undefined);
    expect(reads[0].query).toMatchObject({ 'filter[version]': '2026100412' });
    expect(reads[0].query).not.toHaveProperty('filter[id]');
  });

  it('skips an existing assignment', async () => {
    const { http, posts } = fakeHttp({ assigned: ['g1'] });
    const result = await run(http);
    expect(result.groups.map((g: any) => g.status)).toEqual(['already_assigned', 'assigned']);
    expect(posts).toHaveLength(1);
  });

  it('refuses unknown groups before writing and lists available groups', async () => {
    const { http, posts } = fakeHttp();
    await expect(run(http, { ...args, groups: ['Internal', 'Unknown'] })).rejects.toThrow(/Available groups: Internal \(g1\), External \(g2\)/);
    expect(posts).toEqual([]);
  });

  it('refuses a non-VALID or expired build', async () => {
    for (const options of [{ state: 'PROCESSING' }, { expired: true }]) {
      const { http, posts } = fakeHttp(options);
      await expect(run(http)).rejects.toThrow(/VALID build/);
      expect(posts).toEqual([]);
    }
  });

  it('dry-run reports a plan without POSTs', async () => {
    const { http, posts } = fakeHttp({ assigned: ['g1'] });
    const result = await run(http, args, true);
    expect(result.dryRun).toBe(true);
    expect(result.groups.map((g: any) => g.status)).toEqual(['already_assigned', 'would_assign']);
    expect(posts).toEqual([]);
  });

  it('reports a later Apple failure alongside completed groups', async () => {
    const { http } = fakeHttp({ fail: 'g2' });
    const result = await run(http);
    expect(result.groups.map((g: any) => g.status)).toEqual(['assigned', 'failed']);
    expect(result.groups[1].error).toMatch(/Conflict: Build not eligible/);
  });

  it('refuses an incomplete assignment check before any POST', async () => {
    const { http, posts } = fakeHttp({ assignedHasMore: true });
    await expect(run(http)).rejects.toThrow(/Assigned beta group list is incomplete/);
    expect(posts).toEqual([]);
  });

  it('is a RELEASE-level write and disappears under read-only', async () => {
    expect(TESTFLIGHT_TOOLS[0].description).toMatch(/RELEASE-level write\.$/);
    expect(TESTFLIGHT_TOOLS[0].annotations?.destructiveHint).toBe(true);
    const server = createServer({
      credentials: { keyId: 'test', issuerId: 'test', privateKey: 'unused' },
      readOnly: true, confirmWrites: 'off', includeDeprecated: false, dryRun: true,
    }, resolveSelection('access:beta-groups'));
    const [ct, st] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: 'test', version: '0' }, { capabilities: {} });
    await Promise.all([server.connect(st), client.connect(ct)]);
    expect((await client.listTools()).tools.map((t) => t.name)).not.toContain(TESTFLIGHT_TOOLS[0].name);
    await Promise.all([client.close(), server.close()]);
  });

  it('reaches the RELEASE write-confirmation gate before any Apple request', async () => {
    const server = createServer({
      credentials: { keyId: 'test', issuerId: 'test', privateKey: 'unused' },
      baseUrl: 'http://127.0.0.1:1', readOnly: false, confirmWrites: 'all',
      includeDeprecated: false, dryRun: false,
    }, resolveSelection('access:beta-groups'));
    const [ct, st] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: 'test', version: '0' }, { capabilities: {} });
    await Promise.all([server.connect(st), client.connect(ct)]);
    const result = await client.callTool({ name: 'testflight__assign_build_to_groups', arguments: args });
    expect(result.isError).toBe(true);
    expect(result.content).toEqual([expect.objectContaining({ text: expect.stringContaining('RELEASE-level write') })]);
    await Promise.all([client.close(), server.close()]);
  });
});
