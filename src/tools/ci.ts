/** Bounded, read-only Xcode Cloud build diagnosis. */
import type { McpToolDefinition } from '../core/registry.js';
import type { AscHttpClient } from '../core/http.js';
import { AscApiError } from '../core/errors.js';
import { resolveApp } from '../core/resolve-app.js';

const RUN_PAGE = 20;
const ACTION_PAGE = 50;
const DETAIL_PAGE = 50;
const DETAIL_SHOWN = 20;

export const CI_TOOLS: McpToolDefinition[] = [{
  name: 'ci__diagnose_run',
  description: 'Diagnose why an Xcode Cloud build failed in one call. Give an app name, bundle ID or Apple ID; optionally a build run ID or number and a workflow name or ID. By default inspect the newest run whose completionStatus is not SUCCEEDED (within the newest 40 runs). Returns failing actions, issues and failed tests, with bounded counts and truncation notes. Read-only.',
  inputSchema: { type: 'object', properties: {
    app: { type: 'string', description: 'App name, bundle ID or numeric Apple ID.' },
    run: { type: 'string', description: 'Build run ID or run number. Omit for newest non-succeeded run.' },
    workflow: { type: 'string', description: 'Workflow name or ID to narrow the run search.' },
  }, required: ['app'] },
  outputSchema: { type: 'object', properties: {
    app: { type: 'string' }, note: { type: 'string' }, truncated: { type: 'boolean' },
    actionsOmittedAtLeast: { type: 'number', description: 'At least one when the action page cap was reached; zero otherwise.' },
    run: { type: 'object', properties: {
      id: { type: 'string' }, number: { type: 'number' }, workflow: { type: 'string' },
      sourceBranch: { type: 'string' }, pullRequest: { type: 'string' }, commit: { type: 'string' },
      startedDate: { type: 'string' }, finishedDate: { type: 'string' }, completionStatus: { type: 'string' },
    }, required: ['id', 'completionStatus'] },
    actions: { type: 'array', items: { type: 'object', properties: {
      name: { type: 'string' }, actionType: { type: 'string' }, completionStatus: { type: 'string' },
      issues: { type: 'array', items: { type: 'object', properties: {
        type: { type: 'string' }, message: { type: 'string' }, filePath: { type: 'string' }, line: { type: 'number' },
      } } }, issuesOmitted: { type: 'number', description: 'Minimum omitted issue count; more may exist beyond the page cap.' },
      failedTests: { type: 'array', items: { type: 'object', properties: {
        class: { type: 'string' }, name: { type: 'string' }, message: { type: 'string' }, destination: { type: 'string' },
      } } }, failedTestsOmitted: { type: 'number', description: 'Failed tests omitted from the inspected results; further pages may contain more.' },
      passingTests: { type: 'number', description: 'Passing tests among the inspected results only.' },
      testResultsUninspectedAtLeast: { type: 'number', description: 'At least one when the test-results page cap was reached; its status is unknown.' },
    }, required: ['name', 'actionType', 'completionStatus'] } },
  }, required: ['app', 'truncated', 'actions', 'actionsOmittedAtLeast'] },
  annotations: { readOnlyHint: true, idempotentHint: true },
}];

export const CI_TOOL_NAMES = new Set(CI_TOOLS.map((tool) => tool.name));

const value = (v: unknown): string => String(v ?? '');
const ref = (resource: any, key: string): string | undefined => resource?.relationships?.[key]?.data?.id;
const encoded = (id: string): string => encodeURIComponent(id);

export async function executeCiTool(name: string, args: Record<string, unknown>, ctx: { http: AscHttpClient }): Promise<unknown> {
  if (name !== 'ci__diagnose_run') throw new Error(`Unknown CI tool: ${name}`);
  if (typeof args.app !== 'string' || !args.app.trim()) throw new AscApiError('"app" is required.', 0);
  const { http } = ctx;
  const app = await resolveApp(http, args.app);
  const appLabel = `${app.name} (${app.id})`;
  let product: any;
  try {
    product = await http.get(`/v1/apps/${encoded(app.id)}/ciProduct`);
  } catch (error) {
    if (error instanceof AscApiError && error.status === 404) return { app: appLabel, note: 'This app has no Xcode Cloud product.', truncated: false, actions: [], actionsOmittedAtLeast: 0 };
    throw error;
  }
  if (!product?.data?.id) return { app: appLabel, note: 'This app has no Xcode Cloud product.', truncated: false, actions: [], actionsOmittedAtLeast: 0 };
  const productId = value(product.data.id);
  const notes: string[] = [];
  let truncated = false;

  let workflow: any;
  if (args.workflow !== undefined) {
    const wanted = value(args.workflow).trim().toLowerCase();
    if (!wanted) throw new AscApiError('"workflow" must not be empty.', 0);
    const found = await http.collect<any>(`/v1/ciProducts/${encoded(productId)}/workflows`, { limit: 50 }, 2);
    const matches = found.items.filter((w) => value(w.id).toLowerCase() === wanted || value(w.attributes?.name).toLowerCase() === wanted);
    if (matches.length > 1) throw new AscApiError(`Workflow "${args.workflow}" is ambiguous; use its ID.`, 0);
    workflow = matches[0];
    if (!workflow) {
      try { workflow = (await http.get<any>(`/v1/ciWorkflows/${encoded(value(args.workflow))}`))?.data; }
      catch (error) { if (!(error instanceof AscApiError && error.status === 404)) throw error; }
    }
    if (!workflow) throw new AscApiError(`No workflow "${args.workflow}" found${found.hasMore ? ' in the first 100 workflows (search truncated)' : ''}.`, 0);
    if (ref(workflow, 'product') && ref(workflow, 'product') !== productId) throw new AscApiError('The requested workflow belongs to another app.', 0);
  }

  let selected: any;
  const requested = args.run === undefined ? undefined : value(args.run).trim();
  if (requested === '') throw new AscApiError('"run" must not be empty.', 0);
  // Opaque IDs can be fetched directly. Numeric values may also be IDs, so
  // search by run number first and fall back to GET only if not found.
  if (requested && !/^\d+$/.test(requested)) {
    selected = (await http.get<any>(`/v1/ciBuildRuns/${encoded(requested)}`))?.data;
  } else {
    const path = workflow
      ? `/v1/ciWorkflows/${encoded(value(workflow.id))}/buildRuns`
      : `/v1/ciProducts/${encoded(productId)}/buildRuns`;
    const runs = await http.collect<any>(path, { sort: '-number', limit: RUN_PAGE }, 2,
      (items) => requested
        ? items.some((r) => value(r.attributes?.number) === requested || value(r.id) === requested)
        : items.some((r) => r.attributes?.completionStatus && r.attributes.completionStatus !== 'SUCCEEDED'));
    selected = requested
      ? runs.items.find((r) => value(r.attributes?.number) === requested || value(r.id) === requested)
      : runs.items.find((r) => r.attributes?.completionStatus && r.attributes.completionStatus !== 'SUCCEEDED');
    if (!selected && requested && /^\d+$/.test(requested)) {
      try { selected = (await http.get<any>(`/v1/ciBuildRuns/${encoded(requested)}`))?.data; }
      catch (error) { if (!(error instanceof AscApiError && error.status === 404)) throw error; }
    }
    if (!selected && !requested && !runs.hasMore) selected = runs.items[0];
    if (!selected && runs.hasMore) {
      return { app: appLabel, note: `No matching ${requested ? 'run' : 'non-succeeded run'} in the newest 40; older runs were not searched.`, truncated: true, actions: [], actionsOmittedAtLeast: 0 };
    }
  }
  if (!selected) return { app: appLabel, note: requested ? `No build run "${requested}" found.` : 'No Xcode Cloud build runs found.', truncated: false, actions: [], actionsOmittedAtLeast: 0 };

  const detail: any = await http.get(`/v1/ciBuildRuns/${encoded(value(selected.id))}`, {
    include: 'workflow,product,sourceBranchOrTag,pullRequest',
  });
  const run = detail?.data ?? selected;
  if (ref(run, 'product') !== productId) throw new AscApiError('The requested run could not be verified for this app.', 0);
  if (workflow && ref(run, 'workflow') !== value(workflow.id)) throw new AscApiError('The requested run belongs to another workflow.', 0);
  const included: any[] = detail?.included ?? [];
  const related = (key: string) => included.find((item) => item.id === ref(run, key));
  const workflowName = related('workflow')?.attributes?.name ?? workflow?.attributes?.name;
  const branch = related('sourceBranchOrTag')?.attributes?.name;
  const pullRequest = related('pullRequest')?.attributes;
  const attrs = run.attributes ?? {};
  const runOut = {
    id: value(run.id), ...(attrs.number !== undefined ? { number: attrs.number } : {}),
    ...(workflowName ? { workflow: value(workflowName) } : {}),
    ...(branch ? { sourceBranch: value(branch) } : {}),
    ...(pullRequest?.number !== undefined ? { pullRequest: value(pullRequest.number) } : {}),
    ...(attrs.sourceCommit?.commitSha ? { commit: value(attrs.sourceCommit.commitSha) } : {}),
    ...(attrs.startedDate ? { startedDate: value(attrs.startedDate) } : {}),
    ...(attrs.finishedDate ? { finishedDate: value(attrs.finishedDate) } : {}),
    completionStatus: value(attrs.completionStatus || 'UNKNOWN'),
  };

  const actionsResult = await http.collect<any>(`/v1/ciBuildRuns/${encoded(value(run.id))}/actions`, { limit: ACTION_PAGE }, 2);
  if (actionsResult.hasMore) { truncated = true; notes.push('Action read stopped after two pages (at most 100 actions).'); }
  const actions = [];
  for (const action of actionsResult.items) {
    const a = action.attributes ?? {};
    const out: any = { name: value(a.name), actionType: value(a.actionType), completionStatus: value(a.completionStatus) };
    if (a.completionStatus === 'FAILED' || a.completionStatus === 'ERRORED') {
      const id = encoded(value(action.id));
      const issues = await http.collect<any>(`/v1/ciBuildActions/${id}/issues`, { limit: DETAIL_PAGE }, 2);
      out.issues = issues.items.slice(0, DETAIL_SHOWN).map((i: any) => ({
        type: value(i.attributes?.issueType), message: value(i.attributes?.message),
        ...(i.attributes?.fileSource?.path ? { filePath: value(i.attributes.fileSource.path) } : {}),
        ...(i.attributes?.fileSource?.lineNumber !== undefined ? { line: i.attributes.fileSource.lineNumber } : {}),
      }));
      out.issuesOmitted = issues.items.length - out.issues.length + (issues.hasMore ? 1 : 0);
      const tests = await http.collect<any>(`/v1/ciBuildActions/${id}/testResults`, { limit: DETAIL_PAGE }, 2);
      const failed = tests.items.filter((t: any) => t.attributes?.status === 'FAILURE' || t.attributes?.status === 'MIXED');
      out.failedTests = failed.slice(0, DETAIL_SHOWN).map((t: any) => ({
        class: value(t.attributes?.className), name: value(t.attributes?.name), message: value(t.attributes?.message),
        destination: (t.attributes?.destinationTestResults ?? []).map((d: any) => value(d.deviceName)).filter(Boolean).join(', '),
      }));
      out.failedTestsOmitted = failed.length - out.failedTests.length;
      out.passingTests = tests.items.filter((t: any) => t.attributes?.status === 'SUCCESS').length;
      out.testResultsUninspectedAtLeast = tests.hasMore ? 1 : 0;
      if (issues.hasMore || tests.hasMore) { truncated = true; notes.push(`Action "${out.name}": issue/test reads stopped after two pages each (at most 100); more may be omitted.`); }
      if (out.issuesOmitted || out.failedTestsOmitted) { truncated = true; notes.push(`Action "${out.name}": issue and failed-test lists show at most 20 each.`); }
    }
    actions.push(out);
  }
  if (runOut.completionStatus === 'SUCCEEDED') notes.unshift('This build run succeeded.');
  return { app: appLabel, run: runOut, actions, actionsOmittedAtLeast: actionsResult.hasMore ? 1 : 0, truncated, ...(notes.length ? { note: notes.join(' ') } : {}) };
}
