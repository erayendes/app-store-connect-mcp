/**
 * Submitting for review, as one call instead of three that must go in order.
 *
 * Apple's names hide a dance and the descriptions in `scripts/describe.ts`
 * already say so: `review_submissions.create` takes an *app*, not a version,
 * and makes an EMPTY container. The version arrives as a separate item. And
 * nothing reaches Apple until `submitted` is patched true on the submission.
 *
 * An agent that stops after the POST reports a release it did not ship. That
 * is not a hypothetical — it is why those three descriptions are worded the
 * way they are, each naming the next call. This closes the gap instead of
 * describing it, which is the test the issue sets for a workflow macro:
 * deterministic order, and one approval instead of three.
 *
 * It also refuses to submit something that will bounce. `preflight__check_version`
 * already knows what Apple enforces — a build still processing, an unanswered
 * export-compliance question, a locale with no description — and running it
 * first is the one thing no chain of raw calls remembers to do.
 */
import type { McpToolDefinition } from '../core/registry.js';
import type { AscHttpClient } from '../core/http.js';
import { AscApiError } from '../core/errors.js';
import { resolveApp } from '../core/resolve-app.js';
import { executePreflightTool } from './preflight.js';

export const RELEASE_TOOLS: McpToolDefinition[] = [
  {
    name: 'release__submit',
    description:
      'Send an App Store version to Apple for review in one call — it opens the submission, ' +
      'puts the version in it, and hands it over. Checks first that the version is actually ' +
      'submittable and refuses rather than submitting something that will bounce. Use this ' +
      'instead of review_submissions__create, which by itself sends nothing.',
    inputSchema: {
      type: 'object',
      properties: {
        app: { type: 'string', description: 'App name, bundle ID (com.example.app) or numeric Apple ID.' },
        version: {
          type: 'string',
          description: 'Version string (e.g. "3.2.0"). Defaults to the newest editable version.',
        },
        skip_preflight: {
          type: 'boolean',
          description:
            'Submit even when the pre-flight finds blocking gaps. Off by default, and worth ' +
            'leaving off: every gap it reports is one Apple enforces.',
        },
      },
      required: ['app'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        app: { type: 'string' },
        version: { type: 'string' },
        submissionId: { type: 'string' },
        state: { type: 'string' },
        steps: {
          type: 'array',
          description: 'What was done, in order, so a partial run says where it stopped.',
          items: { type: 'string' },
        },
        preflight: { type: 'object' },
      },
      required: ['app', 'version', 'steps'],
    },
  },
];

export const RELEASE_TOOL_NAMES: ReadonlySet<string> = new Set(RELEASE_TOOLS.map((t) => t.name));

export async function executeReleaseTool(
  name: string,
  args: Record<string, unknown>,
  ctx: { http: AscHttpClient; dryRun?: boolean }
): Promise<unknown> {
  if (name !== 'release__submit') throw new Error(`Unknown release tool: ${name}`);
  if (!args.app || typeof args.app !== 'string') throw new AscApiError('"app" is required.', 0);

  const http = ctx.http;
  const app = await resolveApp(http, String(args.app));

  // The pre-flight resolves the version itself, and its answer names the one
  // it looked at — so this is also how the version gets chosen, rather than
  // resolving it twice and risking two different answers.
  const preflight = (await executePreflightTool(
    'preflight__check_version',
    { app: String(args.app), ...(args.version ? { version: args.version } : {}) },
    { http }
  )) as { version: string; state: string; ready: boolean; blocking: Array<{ check: string; problem: string; fixWith: string }> };

  if (!preflight.ready && args.skip_preflight !== true) {
    throw new AscApiError(
      `${app.name} ${preflight.version} was not submitted — nothing was sent to Apple.\n` +
        preflight.blocking.map((b) => `  - ${b.check}: ${b.problem}\n    fix with ${b.fixWith}`).join('\n') +
        (preflight.blocking.length
          ? '\nEvery one of these is enforced by Apple. Pass skip_preflight=true to submit anyway.'
          : `\nVersion ${preflight.version} is ${preflight.state}, which is past the point of submitting.`),
      0
    );
  }

  // Resolved after the pre-flight so a refusal costs one call rather than four.
  const versions: any = await http.get(`/v1/apps/${encodeURIComponent(app.id)}/appStoreVersions`, {
    'fields[appStoreVersions]': 'versionString,appStoreState',
    limit: 20,
  });
  const version = (versions?.data ?? []).find(
    (v: any) => String(v.attributes?.versionString ?? '') === preflight.version
  );
  if (!version) throw new AscApiError(`Version ${preflight.version} disappeared between calls.`, 0);

  const steps: string[] = [];
  if (ctx.dryRun) {
    return {
      dryRun: true,
      app: `${app.name} (${app.id})`,
      version: preflight.version,
      preflight,
      wouldDo: [
        `reuse or open a review submission for app ${app.id}`,
        `add version ${preflight.version} (${version.id}) to it as an item`,
        'patch submitted=true, which is the step that reaches Apple',
      ],
    };
  }

  // An open submission is reused rather than duplicated: Apple allows one at a
  // time, and a second POST fails with a message about state that says nothing
  // about the submission already sitting there.
  const open: any = await http.get(`/v1/apps/${encodeURIComponent(app.id)}/reviewSubmissions`, {
    'filter[state]': 'READY_FOR_REVIEW',
    include: 'items',
    limit: 5,
  });
  let submission = (open?.data ?? [])[0];
  if (submission) {
    steps.push(`Reused the open review submission ${submission.id}.`);
  } else {
    const created: any = await http.request('POST', '/v1/reviewSubmissions', {
      body: {
        data: {
          type: 'reviewSubmissions',
          attributes: { platform: version.attributes?.platform ?? 'IOS' },
          relationships: { app: { data: { type: 'apps', id: app.id } } },
        },
      },
    });
    submission = created?.data;
    if (!submission?.id) throw new AscApiError('Apple accepted the submission POST and returned no id.', 0);
    steps.push(`Opened review submission ${submission.id} — empty, and nothing sent yet.`);
  }

  const alreadyIn = (open?.included ?? []).some(
    (i: any) =>
      i.type === 'reviewSubmissionItems' &&
      String(i.relationships?.appStoreVersion?.data?.id ?? '') === String(version.id)
  );
  if (alreadyIn) {
    steps.push(`Version ${preflight.version} was already an item on it.`);
  } else {
    await http.request('POST', '/v1/reviewSubmissionItems', {
      body: {
        data: {
          type: 'reviewSubmissionItems',
          relationships: {
            reviewSubmission: { data: { type: 'reviewSubmissions', id: submission.id } },
            appStoreVersion: { data: { type: 'appStoreVersions', id: version.id } },
          },
        },
      },
    });
    steps.push(`Added version ${preflight.version} to it. Still nothing sent.`);
  }

  // The step that actually reaches Apple, and the one an agent chaining raw
  // calls forgets — which is how a release gets reported that never shipped.
  const handed: any = await http.request('PATCH', `/v1/reviewSubmissions/${encodeURIComponent(submission.id)}`, {
    body: { data: { type: 'reviewSubmissions', id: submission.id, attributes: { submitted: true } } },
  });
  steps.push('Handed it to Apple (submitted=true). This is the step that starts the queue.');

  return {
    app: `${app.name} (${app.id})`,
    version: preflight.version,
    submissionId: String(submission.id),
    state: handed?.data?.attributes?.state ?? 'SUBMITTED',
    steps,
    preflight: { ready: preflight.ready, warnings: (preflight as any).warnings ?? [] },
  };
}
