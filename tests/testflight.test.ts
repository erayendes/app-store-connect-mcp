import { describe, expect, it } from 'vitest';
import { Client, InMemoryTransport } from '@modelcontextprotocol/client';
import { AscApiError } from '../src/core/errors.js';
import { createServer } from '../src/server.js';
import { resolveSelection } from '../src/profiles.js';
import { executeTestflightTool, TESTFLIGHT_TOOLS, buildTestflightPreview } from '../src/tools/testflight.js';

function fakeHttp(options: { state?: string; expired?: boolean; assigned?: string[]; fail?: string; assignedHasMore?: boolean; duplicate?: boolean; notes?: Record<string, string>; reviewed?: boolean } = {}) {
  const posts: Array<{ path: string; body: unknown }> = [];
  const writes: string[] = [];
  const reads: Array<{ path: string; query: Record<string, unknown> | undefined; maxPages: number | undefined }> = [];
  const groups = [
    { id: 'g1', attributes: { name: 'Internal', isInternalGroup: true } },
    { id: 'g2', attributes: { name: 'External', isInternalGroup: false } },
  ];
  const http = {
    get: async (path: string) => path.endsWith('/preReleaseVersion')
      ? { data: { attributes: path.includes('/b1/') ? { version: '1.6.1', platform: 'IOS' } : { version: '1.6', platform: 'TV_OS' } } }
      : { data: { id: '123', attributes: { name: 'Demo' } } },
    collect: async (path: string, query?: Record<string, unknown>, maxPages?: number) => {
      reads.push({ path, query, maxPages });
      return ({
      items: path === '/v1/builds'
        ? [{ id: 'b1', attributes: { version: '42', processingState: options.state ?? 'VALID', expired: options.expired ?? false } },
          ...(options.duplicate ? [{ id: 'b2', attributes: { version: '42', processingState: 'VALID', expired: false } }] : [])]
        : path === '/v1/betaGroups' ? groups.filter((g) => (options.assigned ?? []).includes(g.id))
        : path.endsWith('/betaGroups') ? groups
        : path.endsWith('/betaBuildLocalizations') ? Object.entries(options.notes ?? {}).map(([locale, whatsNew], i) => ({ id: `l${i}`, attributes: { locale, whatsNew } }))
        : path === '/v1/betaAppReviewSubmissions' && options.reviewed ? [{ id: 'r1', attributes: { betaReviewState: 'WAITING_FOR_REVIEW' } }] : [],
      hasMore: path === '/v1/betaGroups' && options.assignedHasMore === true,
    });
    },
    patch: async (path: string, body: unknown) => { writes.push(`PATCH ${path}`); posts.push({ path, body }); },
    post: async (path: string, body: unknown) => {
      writes.push(`POST ${path}`);
      posts.push({ path, body });
      if (options.fail && path.includes(`/betaGroups/${options.fail}/`)) {
        throw new AscApiError('Apple rejected the assignment', 409, [{ title: 'Conflict', detail: 'Build not eligible' }]);
      }
    },
  };
  return { http: http as never, posts, reads, writes };
}

const args = { app: '123', build: '42', groups: ['Internal', 'External'] };
const run = (http: never, options: Record<string, unknown> = args, dryRun = false) =>
  executeTestflightTool('testflight__assign_build_to_groups', options, { http, dryRun }) as Promise<any>;

describe('testflight__assign_build_to_groups', () => {
  it('names every destination group and the release risk in its confirmation prompt', () => {
    const preview = buildTestflightPreview({ app: 'Demo', build: '42', groups: ['Internal', 'External QA'] });
    expect(preview).toContain('RELEASE-level');
    expect(preview).toContain('Internal, External QA');
    expect(preview).not.toContain('PUBLIC');
  });

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
      { path: '/v1/betaGroups', query: { 'filter[builds]': 'b1', limit: 200 }, maxPages: 1 },
    ]);
  });

  it('sends at most one relationship filter per request, which is all Apple accepts', async () => {
    // Live Apple rejects filter[app] together with filter[builds]:
    // "Only one relationship filter can be applied."
    const relationshipFilters = ['filter[app]', 'filter[builds]', 'filter[betaGroups]', 'filter[preReleaseVersion]'];
    const { http, reads } = fakeHttp();
    await run(http);
    for (const read of reads) {
      expect(Object.keys(read.query ?? {}).filter((k) => relationshipFilters.includes(k)).length, read.path).toBeLessThanOrEqual(1);
    }
  });

  it('names every matching build with its platform and version when a build number repeats', async () => {
    const { http, posts } = fakeHttp({ duplicate: true });
    await expect(run(http)).rejects.toThrow(/matches 2 builds.*b1 \(IOS 1\.6\.1\).*b2 \(TV_OS 1\.6\)/);
    expect(posts).toEqual([]);
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
    // The audit log records the call as an error from this flag.
    expect(result.ok).toBe(false);
    expect((await run(fakeHttp().http)).ok).toBeUndefined();
  });

  it('sets What to Test, assigns the groups and submits beta review, in that order', async () => {
    const { http, writes } = fakeHttp({ notes: { 'en-US': 'Old text', 'tr': 'Yeni dışa aktarmayı deneyin' } });
    const result = await run(http, { ...args, what_to_test: { 'en-US': 'Try the new export', 'tr': 'Yeni dışa aktarmayı deneyin', 'de-DE': 'Neuen Export testen' }, submit_beta_review: true });
    expect(result.whatToTest.map((n: any) => [n.locale, n.status])).toEqual([['en-US', 'set'], ['tr', 'already_set'], ['de-DE', 'set']]);
    expect(result.betaReview.status).toBe('submitted');
    expect(result.groups[1].note).toBeUndefined();
    expect(writes).toEqual([
      'PATCH /v1/betaBuildLocalizations/l0', 'POST /v1/betaBuildLocalizations',
      'POST /v1/betaGroups/g1/relationships/builds', 'POST /v1/betaGroups/g2/relationships/builds',
      'POST /v1/betaAppReviewSubmissions',
    ]);
  });

  it('writes nothing when called again after every step is done', async () => {
    const { http, writes } = fakeHttp({ notes: { 'en-US': 'Try it' }, assigned: ['g1', 'g2'], reviewed: true });
    const result = await run(http, { ...args, what_to_test: { 'en-US': 'Try it' }, submit_beta_review: true });
    expect(result.whatToTest[0].status).toBe('already_set');
    expect(result.groups.map((g: any) => g.status)).toEqual(['already_assigned', 'already_assigned']);
    expect(result.betaReview).toMatchObject({ status: 'already_submitted', state: 'WAITING_FOR_REVIEW' });
    expect(writes).toEqual([]);
  });

  it('dry-run reports the notes and the review it would write', async () => {
    const { http, writes } = fakeHttp();
    const result = await run(http, { ...args, what_to_test: { 'en-US': 'Try it' }, submit_beta_review: true }, true);
    expect(result.whatToTest[0].status).toBe('would_set');
    expect(result.betaReview.status).toBe('would_submit');
    expect(writes).toEqual([]);
  });

  it('refuses malformed What to Test before reading Apple', async () => {
    for (const what_to_test of [[], { 'en-US': '' }, { 'en-US': 'x'.repeat(4001) }, 'text']) {
      const { http, reads } = fakeHttp();
      await expect(run(http, { ...args, what_to_test })).rejects.toThrow(/what_to_test/);
      expect(reads).toEqual([]);
    }
    await expect(run(fakeHttp().http, { ...args, submit_beta_review: 'yes' })).rejects.toThrow(/submit_beta_review/);
  });

  it('names the notes and the review in its confirmation prompt', () => {
    const preview = buildTestflightPreview({ ...args, what_to_test: { 'en-US': 'x', tr: 'y' }, submit_beta_review: true });
    expect(preview).toContain('What to Test: en-US, tr');
    expect(preview).toContain('beta app review');
    expect(preview).not.toContain('does not submit');
  });

  it('refuses an incomplete assignment check before any POST', async () => {
    const { http, posts } = fakeHttp({ assignedHasMore: true });
    await expect(run(http)).rejects.toThrow(/Assigned beta group list is incomplete/);
    expect(posts).toEqual([]);
  });

  it('is a RELEASE-level write and disappears under read-only', async () => {
    expect(TESTFLIGHT_TOOLS.find((t) => t.name === 'testflight__assign_build_to_groups')!.description).toMatch(/RELEASE-level write\.$/);
    expect(TESTFLIGHT_TOOLS.find((t) => t.name === 'testflight__assign_build_to_groups')!.annotations?.destructiveHint).toBe(true);
    const server = createServer({
      credentials: { keyId: 'test', issuerId: 'test', privateKey: 'unused' },
      readOnly: true, confirmWrites: 'off', dryRun: true,
    }, resolveSelection('testflight:groups'));
    const [ct, st] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: 'test', version: '0' }, { capabilities: {} });
    await Promise.all([server.connect(st), client.connect(ct)]);
    expect((await client.listTools()).tools.map((t) => t.name)).not.toContain(TESTFLIGHT_TOOLS.find((t) => t.name === 'testflight__assign_build_to_groups')!.name);
    await Promise.all([client.close(), server.close()]);
  });

  it('reaches the RELEASE write-confirmation gate before any Apple request', async () => {
    const server = createServer({
      credentials: { keyId: 'test', issuerId: 'test', privateKey: 'unused' },
      baseUrl: 'http://127.0.0.1:1', readOnly: false, confirmWrites: 'all', dryRun: false,
    }, resolveSelection('testflight:groups'));
    const [ct, st] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: 'test', version: '0' }, { capabilities: {} });
    await Promise.all([server.connect(st), client.connect(ct)]);
    const result = await client.callTool({ name: 'testflight__assign_build_to_groups', arguments: args });
    expect(result.isError).toBe(true);
    expect(result.content).toEqual([expect.objectContaining({ text: expect.stringContaining('RELEASE-level write') })]);
    await Promise.all([client.close(), server.close()]);
  });
});
