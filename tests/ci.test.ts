import { describe, expect, it, vi } from 'vitest';
import { AscApiError } from '../src/core/errors.js';
import type { AscHttpClient } from '../src/core/http.js';
import { CI_TOOLS, executeCiTool } from '../src/tools/ci.js';

const resource = (id: string, attributes: Record<string, unknown> = {}, relationships: Record<string, unknown> = {}) => ({ id, attributes, relationships });
const run = (id: string, number: number, status: string, workflow = 'wf') => resource(id,
  { number, completionStatus: status, sourceCommit: { commitSha: 'abc123' } },
  { product: { data: { id: 'product' } }, workflow: { data: { id: workflow } } });

function fixture(opts: { runs?: any[]; actions?: any[]; issues?: any[]; tests?: any[]; noProduct?: boolean; more?: string[] } = {}) {
  const runs = opts.runs ?? [run('r3', 3, 'SUCCEEDED'), run('r2', 2, 'FAILED'), run('r1', 1, 'SUCCEEDED')];
  const actions = opts.actions ?? [resource('a1', { name: 'Test', actionType: 'TEST', completionStatus: 'FAILED' }), resource('a2', { name: 'Archive', actionType: 'BUILD', completionStatus: 'SUCCEEDED' })];
  const get = vi.fn(async (path: string) => {
    if (path === '/v1/apps') return { data: [{ id: 'app1', attributes: { name: 'Demo' } }] };
    if (path.endsWith('/ciProduct')) {
      if (opts.noProduct) throw new AscApiError('Not found', 404);
      return { data: { id: 'product' } };
    }
    if (path.startsWith('/v1/ciBuildRuns/')) {
      const selected = runs.find((r) => path.endsWith(`/${r.id}`));
      if (!selected) throw new AscApiError('Not found', 404);
      return { data: selected, included: [{ id: 'wf', attributes: { name: 'CI' } }] };
    }
    throw new Error(`Unexpected GET ${path}`);
  });
  const collect = vi.fn(async (path: string, query: any, pages: number) => {
    expect(pages).toBeLessThanOrEqual(2);
    if (path.endsWith('/workflows')) return { items: [resource('wf', { name: 'CI' })], hasMore: false };
    if (path.endsWith('/buildRuns')) { expect(query.sort).toBe('-number'); expect(query.limit).toBe(20); return { items: runs, hasMore: opts.more?.includes('runs') ?? false }; }
    if (path.endsWith('/actions')) { expect(query.limit).toBe(50); return { items: actions, hasMore: opts.more?.includes('actions') ?? false }; }
    if (path.endsWith('/issues')) { expect(query.limit).toBe(50); return { items: opts.issues ?? [], hasMore: opts.more?.includes('issues') ?? false }; }
    if (path.endsWith('/testResults')) { expect(query.limit).toBe(50); return { items: opts.tests ?? [], hasMore: opts.more?.includes('tests') ?? false }; }
    throw new Error(`Unexpected collect ${path}`);
  });
  return { http: { get, collect } as unknown as AscHttpClient, get, collect };
}
const diagnose = (args: Record<string, unknown>, http: AscHttpClient) => executeCiTool('ci__diagnose_run', args, { http }) as Promise<any>;

describe('ci__diagnose_run', () => {
  it('declares a read-only structured output', () => {
    expect(CI_TOOLS[0].annotations).toMatchObject({ readOnlyHint: true, idempotentHint: true });
    expect(CI_TOOLS[0].outputSchema).toBeDefined();
  });

  it('selects the newest failed run and returns issues and failed tests only', async () => {
    const f = fixture({ issues: [resource('i', { issueType: 'ERROR', message: 'Compile failed', fileSource: { path: 'App.swift', lineNumber: 7 } })],
      tests: [resource('t1', { status: 'FAILURE', className: 'LoginTests', name: 'testLogin', message: 'Expected true', destinationTestResults: [{ deviceName: 'iPhone' }] }), resource('t2', { status: 'SUCCESS' })] });
    const out = await diagnose({ app: 'Demo' }, f.http);
    expect(out.run).toMatchObject({ id: 'r2', number: 2, workflow: 'CI', commit: 'abc123', completionStatus: 'FAILED' });
    expect(out.actions[0]).toMatchObject({ issues: [{ type: 'ERROR', message: 'Compile failed', filePath: 'App.swift', line: 7 }], failedTests: [{ class: 'LoginTests', name: 'testLogin', message: 'Expected true', destination: 'iPhone' }], passingTests: 1 });
    expect(out.actions[1].issues).toBeUndefined();
    expect(f.collect.mock.calls.filter(([path]) => String(path).includes('/ciBuildActions/'))).toHaveLength(2);
  });

  it('puts the trust warning first, so cutting the response to size cannot drop it', async () => {
    const out = await diagnose({ app: 'Demo' }, fixture().http);
    expect(Object.keys(out)[0]).toBe('untrustedContent');
  });

  it('passes over canceled and skipped runs to the newest failed or errored one', async () => {
    const f = fixture({ runs: [run('r4', 4, 'CANCELED'), run('r3', 3, 'SKIPPED'), run('r2', 2, 'ERRORED'), run('r1', 1, 'FAILED')] });
    expect((await diagnose({ app: 'Demo' }, f.http)).run).toMatchObject({ id: 'r2', completionStatus: 'ERRORED' });
  });

  it('includes source branch and PR when Apple supplies the related resources', async () => {
    const selected: any = run('r2', 2, 'FAILED');
    selected.relationships.sourceBranchOrTag = { data: { id: 'branch' } };
    selected.relationships.pullRequest = { data: { id: 'pr' } };
    const f = fixture({ runs: [selected] });
    f.get.mockImplementation(async (path: string) => {
      if (path === '/v1/apps') return { data: [{ id: 'app1', attributes: { name: 'Demo' } }] };
      if (path.endsWith('/ciProduct')) return { data: { id: 'product' } };
      return { data: selected, included: [resource('wf', { name: 'CI' }), resource('branch', { name: 'main' }), resource('pr', { number: 17 })] };
    });
    const out = await diagnose({ app: 'Demo' }, f.http);
    expect(out.run).toMatchObject({ sourceBranch: 'main', pullRequest: '17' });
  });

  it('reports a succeeded run plainly without reading action details', async () => {
    const f = fixture({ runs: [run('r1', 1, 'SUCCEEDED')], actions: [resource('a2', { name: 'Archive', actionType: 'BUILD', completionStatus: 'SUCCEEDED' })] });
    const out = await diagnose({ app: 'Demo' }, f.http);
    expect(out.note).toContain('succeeded');
    expect(out.actions).toHaveLength(1);
    expect(f.collect.mock.calls.some(([path]) => String(path).includes('/ciBuildActions/'))).toBe(false);
  });

  it('returns a note when the app has no CI product', async () => {
    const f = fixture({ noProduct: true });
    expect((await diagnose({ app: 'Demo' }, f.http)).note).toContain('no Xcode Cloud product');
    expect(f.collect).not.toHaveBeenCalled();
  });

  it('fetches an explicit opaque run ID directly', async () => {
    const f = fixture();
    const out = await diagnose({ app: 'Demo', run: 'r1' }, f.http);
    expect(out.run.id).toBe('r1');
    expect(f.collect.mock.calls.some(([path]) => String(path).endsWith('/buildRuns'))).toBe(false);
  });

  it('rejects a run ID from a different app', async () => {
    const foreign = run('other', 9, 'FAILED');
    foreign.relationships.product.data.id = 'another-product';
    const f = fixture({ runs: [foreign] });
    await expect(diagnose({ app: 'Demo', run: 'other' }, f.http)).rejects.toThrow('could not be verified');
    expect(f.collect).not.toHaveBeenCalled();
  });

  it('narrows by workflow and run number', async () => {
    const f = fixture();
    const out = await diagnose({ app: 'Demo', workflow: 'CI', run: '2' }, f.http);
    expect(out.run.id).toBe('r2');
    expect(f.collect.mock.calls.some(([path]) => path === '/v1/ciWorkflows/wf/buildRuns')).toBe(true);
  });

  it('reports when a bounded search did not reach an older failure', async () => {
    const f = fixture({ runs: [run('r3', 3, 'SUCCEEDED')], more: ['runs'] });
    const out = await diagnose({ app: 'Demo' }, f.http);
    expect(out).toMatchObject({ truncated: true, actions: [] });
    expect(out.note).toContain('newest 40');
    expect(f.get.mock.calls.some(([path]) => String(path).includes('/ciBuildRuns/'))).toBe(false);
  });

  it('reports caps and counts without listing passing tests', async () => {
    const f = fixture({ issues: Array.from({ length: 25 }, (_, i) => resource(`i${i}`, { issueType: 'ERROR', message: `Issue ${i}` })),
      tests: [...Array.from({ length: 23 }, (_, i) => resource(`t${i}`, { status: 'FAILURE', name: `test${i}` })), resource('pass', { status: 'SUCCESS' })], more: ['actions', 'issues', 'tests'] });
    const out = await diagnose({ app: 'Demo' }, f.http);
    expect(out.truncated).toBe(true);
    expect(out.note).toContain('at most 100 actions');
    expect(out.actionsOmittedAtLeast).toBe(1);
    expect(out.actions[0]).toMatchObject({ issuesOmitted: 6, failedTestsOmitted: 3, passingTests: 1, testResultsUninspectedAtLeast: 1 });
    expect(out.actions[0].issues).toHaveLength(20);
    expect(out.actions[0].failedTests).toHaveLength(20);
  });

  it('does not call a succeeded action issue or test endpoint in a failed run', async () => {
    const f = fixture();
    await diagnose({ app: 'Demo' }, f.http);
    expect(f.collect.mock.calls.some(([path]) => String(path).includes('/ciBuildActions/a2/'))).toBe(false);
  });
});
