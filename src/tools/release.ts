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
import { PLATFORMS, PLATFORM_NAMES, executePreflightTool, pickVersion } from './preflight.js';

/** Relationship names accepted by Apple's ReviewSubmissionItemCreateRequest. */
export const REVIEW_ITEM_TYPES = [
  'appCustomProductPageVersion', 'appStoreVersionExperiment', 'appStoreVersionExperimentV2',
  'appEvent', 'appAssetLibraryImage', 'appAssetLibraryVideo', 'backgroundAssetVersion',
  'gameCenterAchievementVersion', 'gameCenterActivityVersion', 'gameCenterChallengeVersion',
  'gameCenterLeaderboardVersion', 'gameCenterLeaderboardSetVersion',
  'inAppPurchaseVersion', 'subscriptionVersion', 'subscriptionGroupVersion',
] as const;
type ReviewItem = { type: string; id: string };
const RESOURCE_TYPES: Record<string, string> = {
  appCustomProductPageVersion: 'appCustomProductPageVersions',
  appStoreVersionExperiment: 'appStoreVersionExperiments',
  appStoreVersionExperimentV2: 'appStoreVersionExperiments',
  appEvent: 'appEvents', appAssetLibraryImage: 'appAssetLibraryImages',
  appAssetLibraryVideo: 'appAssetLibraryVideos', backgroundAssetVersion: 'backgroundAssetVersions',
  gameCenterAchievementVersion: 'gameCenterAchievementVersions',
  gameCenterActivityVersion: 'gameCenterActivityVersions',
  gameCenterChallengeVersion: 'gameCenterChallengeVersions',
  gameCenterLeaderboardVersion: 'gameCenterLeaderboardVersions',
  gameCenterLeaderboardSetVersion: 'gameCenterLeaderboardSetVersions',
  inAppPurchaseVersion: 'inAppPurchaseVersions', subscriptionVersion: 'subscriptionVersions',
  subscriptionGroupVersion: 'subscriptionGroupVersions', appStoreVersion: 'appStoreVersions',
};
const VERSIONED_ITEMS = new Set([
  'appCustomProductPageVersion', 'backgroundAssetVersion', 'gameCenterActivityVersion',
  'gameCenterChallengeVersion', 'inAppPurchaseVersion', 'subscriptionVersion',
  'subscriptionGroupVersion',
]);
function itemKey(item: ReviewItem): string { return `${item.type}/${item.id}`; }
function itemFromResource(row: any): ReviewItem | undefined {
  for (const type of ['appStoreVersion', ...REVIEW_ITEM_TYPES]) {
    const id = row?.relationships?.[type]?.data?.id;
    if (id) return { type, id: String(id) };
  }
  return undefined;
}

export const RELEASE_TOOLS: McpToolDefinition[] = [
  {
    name: 'release__submit',
    description:
      'Send an App Store version to Apple for review in one call — it opens the submission, ' +
      'puts the version in it, and hands it over. Checks first that the version is actually ' +
      'submittable and refuses rather than submitting something that will bounce. Use this ' +
      'instead of opening an empty review submission by hand, which by itself sends nothing.',
    inputSchema: {
      type: 'object',
      properties: {
        app: { type: 'string', description: 'App name, bundle ID (com.example.app) or numeric Apple ID.' },
        version: {
          type: 'string',
          description: 'Version string (e.g. "3.2.0"). Defaults to the newest editable version.',
        },
        platform: {
          type: 'string',
          enum: PLATFORMS,
          description: 'Which platform’s version. Needed when the app has one on more than one platform.',
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
        platform: { type: 'string' },
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
  {
    name: 'release__submit_items',
    description: 'Submit reviewable product, marketing, Game Center or asset versions to Apple in one call. Reuses the open submission for the platform, checks companion items, then sends every item for review.',
    inputSchema: {
      type: 'object',
      properties: {
        app: { type: 'string', description: 'App name, bundle ID or numeric Apple ID.' },
        platform: { type: 'string', enum: PLATFORMS, description: 'Review platform. Required when the app has more than one eligible platform.' },
        items: { type: 'array', minItems: 1, items: {
          type: 'object', properties: {
            type: { type: 'string', enum: [...REVIEW_ITEM_TYPES] },
            id: { type: 'string', minLength: 1 },
          }, required: ['type', 'id'], additionalProperties: false,
        } },
      }, required: ['app', 'items'],
    },
    outputSchema: {
      type: 'object', properties: {
        app: { type: 'string' }, platform: { type: 'string' }, submissionId: { type: 'string' },
        state: { type: 'string' }, steps: { type: 'array', items: { type: 'string' } },
        items: { type: 'array', items: { type: 'object', properties: { type: { type: 'string' }, id: { type: 'string' } }, required: ['type', 'id'] } },
      }, required: ['app', 'platform', 'steps', 'items'],
    },
  },
];

export const RELEASE_TOOL_NAMES: ReadonlySet<string> = new Set(RELEASE_TOOLS.map((t) => t.name));

export async function executeReleaseTool(
  name: string,
  args: Record<string, unknown>,
  ctx: { http: AscHttpClient; dryRun?: boolean }
): Promise<unknown> {
  if (!RELEASE_TOOL_NAMES.has(name)) throw new Error(`Unknown release tool: ${name}`);
  if (!args.app || typeof args.app !== 'string') throw new AscApiError('"app" is required.', 0);
  if (name === 'release__submit_items') return submitItems(args, ctx);

  const http = ctx.http;
  const app = await resolveApp(http, String(args.app));

  // The pre-flight resolves the version itself, and its answer names the one
  // it looked at — so this is also how the version gets chosen, rather than
  // resolving it twice and risking two different answers.
  const preflight = (await executePreflightTool(
    'preflight__check_version',
    {
      app: String(args.app),
      ...(args.version ? { version: args.version } : {}),
      ...(args.platform ? { platform: args.platform } : {}),
    },
    { http }
  )) as { version: string; platform: string; state: string; ready: boolean; blocking: Array<{ check: string; problem: string; fixWith: string }> };

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
    // platform is load-bearing: the submission below is created for it, and a
    // sparse fieldset that omits it makes every macOS, tvOS and visionOS
    // submission silently claim to be iOS.
    'fields[appStoreVersions]': 'versionString,appStoreState,platform',
    limit: 20,
  });
  const version = (versions?.data ?? []).find(
    (v: any) =>
      String(v.attributes?.versionString ?? '') === preflight.version && v.attributes?.platform === preflight.platform
  );
  if (!version) throw new AscApiError(`Version ${preflight.version} disappeared between calls.`, 0);

  // Refused rather than defaulted. A submission carries a platform, and
  // guessing IOS for a macOS or visionOS version creates the submission
  // against the wrong one — which Apple accepts and nobody notices until the
  // release does not appear where it was meant to.
  const versionPlatform = String(version.attributes?.platform ?? '');
  if (!versionPlatform) {
    throw new AscApiError(
      `Apple returned no platform for version ${preflight.version}, and a review submission ` +
        `has to name one. Read the version with app_store_versions__get to see what Apple ` +
        `reports, then try again — submitting without it would guess, and a submission ` +
        `created for the wrong platform is accepted and silently wrong.`,
      0
    );
  }

  const plan = await planSubmission(http, app.id, versionPlatform, [{ type: 'appStoreVersion', id: String(version.id) }]);
  const submitted = await submitPlan(http, app.id, versionPlatform, plan, Boolean(ctx.dryRun));
  return {
    ...submitted, app: `${app.name} (${app.id})`, version: preflight.version,
    preflight: { ready: preflight.ready, warnings: (preflight as any).warnings ?? [] },
  };
}

/**
 * What the confirmation shows for `release__submit`: the app by name and the
 * version and platform it will pick, which the arguments may leave out. The
 * same rule as the submission itself, so the prompt cannot name one version
 * and submit another; an ambiguous call fails here, before anyone is asked.
 */
export async function releasePreviewArgs(
  args: Record<string, unknown>,
  http: AscHttpClient
): Promise<Record<string, unknown>> {
  const app = await resolveApp(http, String(args.app ?? ''));
  const versions: any = await http.get(`/v1/apps/${encodeURIComponent(app.id)}/appStoreVersions`, {
    'fields[appStoreVersions]': 'versionString,appStoreState,platform',
    limit: 20,
  });
  const version = pickVersion(
    app.name,
    versions?.data ?? [],
    args.version ? String(args.version).trim() : undefined,
    args.platform ? String(args.platform) : undefined
  );
  const platform = String(version.attributes?.platform ?? '');
  const plan = await planSubmission(http, app.id, platform, [{ type: 'appStoreVersion', id: String(version.id) }]);
  return {
    app: `${app.name} (${app.id})`,
    version: version.attributes?.versionString,
    platform: PLATFORM_NAMES[platform] ?? platform,
    items: plan.items,
    ...(args.skip_preflight === true ? { skip_preflight: true } : {}),
  };
}

interface SubmissionPlan {
  submission?: any;
  existing: ReviewItem[];
  requested: ReviewItem[];
  items: ReviewItem[];
}
async function planSubmission(http: AscHttpClient, appId: string, platform: string, requested: ReviewItem[]): Promise<SubmissionPlan> {
  const open: any = await http.get(`/v1/apps/${encodeURIComponent(appId)}/reviewSubmissions`, {
    'filter[state]': 'READY_FOR_REVIEW', 'filter[platform]': platform, include: 'items', limit: 5,
  });
  if (open?.links?.next || (open?.data ?? []).length > 1) throw new AscApiError('Open review submissions are ambiguous or truncated.', 0);
  const submission = open?.data?.[0];
  let rows: any[] = (open?.included ?? []).filter((i: any) => i.type === 'reviewSubmissionItems');
  if (submission) {
    const listed: any = await http.get(`/v1/reviewSubmissions/${encodeURIComponent(submission.id)}/items`, { limit: 200 });
    if (listed?.links?.next || Number(listed?.meta?.paging?.total ?? 0) > (listed?.data ?? []).length) {
      throw new AscApiError('Review submission items were truncated; cannot preview every item safely.', 0);
    }
    rows = [...rows, ...(listed?.data ?? [])];
  }
  const existing = [...new Map(rows.map(itemFromResource).filter(Boolean).map((i: any) => [itemKey(i), i])).values()] as ReviewItem[];
  const items = [...new Map([...existing, ...requested].map((i) => [itemKey(i), i])).values()];
  return { submission, existing, requested, items };
}

/** Source: Apple's App Store Connect Review Submissions documentation and the
 * ReviewSubmissionItemCreateRequest relationships in spec/openapi.json. A first
 * item of a type accompanies a new app version; a first subscription also
 * accompanies its group version. These reads precede every POST, including
 * when a submission is reused. */
async function previouslySubmitted(http: AscHttpClient, appId: string, currentId: string | undefined, type: string): Promise<boolean> {
  const history: any = await http.get(`/v1/apps/${encodeURIComponent(appId)}/reviewSubmissions`, { limit: 200 });
  if (history?.links?.next || Number(history?.meta?.paging?.total ?? 0) > (history?.data ?? []).length) {
    throw new AscApiError(`Review submission history is truncated; cannot verify whether ${type} is the first item of its type.`, 0);
  }
  for (const submission of history?.data ?? []) {
    if (String(submission.id) === currentId) continue;
    const prior: any = await http.get(`/v1/reviewSubmissions/${encodeURIComponent(submission.id)}/items`, { limit: 200 });
    if (prior?.links?.next || Number(prior?.meta?.paging?.total ?? 0) > (prior?.data ?? []).length) {
      throw new AscApiError(`Prior review submission ${submission.id} has truncated items; cannot verify ${type}.`, 0);
    }
    if ((prior?.data ?? []).some((row: any) => itemFromResource(row)?.type === type)) return true;
  }
  return false;
}
async function checkCompanions(http: AscHttpClient, appId: string, plan: SubmissionPlan): Promise<void> {
  const hasAppVersion = plan.items.some((i) => i.type === 'appStoreVersion');
  const seenTypes = new Map<string, boolean>();
  for (const item of plan.requested) {
    if (!VERSIONED_ITEMS.has(item.type)) {
      if (!hasAppVersion) {
        if (!seenTypes.has(item.type)) {
          seenTypes.set(item.type, await previouslySubmitted(http, appId, plan.submission?.id, item.type));
        }
        if (!seenTypes.get(item.type)) {
          throw new AscApiError(`First ${item.type} requires a new app version in the same review submission.`, 0);
        }
      }
      continue;
    }
    const type = RESOURCE_TYPES[item.type];
    const version: any = await http.get(`/v1/${type}/${encodeURIComponent(item.id)}`);
    const number = Number(version?.data?.attributes?.version);
    if (!Number.isFinite(number)) throw new AscApiError(`Cannot determine whether ${item.type} ${item.id} is its first version.`, 0);
    if (!hasAppVersion) {
      const previouslySeen = number > 1 && await previouslySubmitted(http, appId, plan.submission?.id, item.type);
      if (!previouslySeen) throw new AscApiError(`First ${item.type} ${item.id} requires a new app version in the same review submission.`, 0);
    }
    if (item.type === 'subscriptionVersion' && number === 1) {
      const subscriptionId = version?.data?.relationships?.subscription?.data?.id;
      if (!subscriptionId) throw new AscApiError(`Cannot verify the group for subscription version ${item.id}.`, 0);
      const subscription: any = await http.get(`/v1/subscriptions/${encodeURIComponent(subscriptionId)}`);
      const groupId = subscription?.data?.relationships?.group?.data?.id;
      if (!groupId) throw new AscApiError(`Cannot verify the group for subscription version ${item.id}.`, 0);
      const groupVersions: any = await http.get(`/v1/subscriptionGroups/${encodeURIComponent(groupId)}/versions`, { limit: 100 });
      if (groupVersions?.links?.next) throw new AscApiError('Group versions truncated; cannot verify required companion.', 0);
      const groupIds = new Set((groupVersions?.data ?? []).map((v: any) => String(v.id)));
      if (!plan.items.some((i) => i.type === 'subscriptionGroupVersion' && groupIds.has(i.id))) {
        throw new AscApiError(`First subscription version ${item.id} requires its subscription group version in the same review submission.`, 0);
      }
    }
  }
}

async function submitPlan(http: AscHttpClient, appId: string, platform: string, plan: SubmissionPlan, dryRun: boolean) {
  await checkCompanions(http, appId, plan);
  const steps: string[] = [];
  if (dryRun) return {
    dryRun: true, platform, items: plan.items,
    wouldDo: [
      plan.submission ? `reuse review submission ${plan.submission.id}` : `open a review submission for app ${appId}`,
      `add ${plan.requested.filter((i) => !plan.existing.some((e) => itemKey(e) === itemKey(i))).length} missing items`,
      'patch submitted=true, which is the step that reaches Apple',
    ], steps,
  };
  let submission = plan.submission;
  if (submission) steps.push(`Reused the open review submission ${submission.id}.`);
  else {
    const created: any = await http.request('POST', '/v1/reviewSubmissions', {
      body: { data: { type: 'reviewSubmissions', attributes: { platform }, relationships: { app: { data: { type: 'apps', id: appId } } } } },
    });
    submission = created?.data;
    if (!submission?.id) throw new AscApiError('Apple accepted the submission POST and returned no id.', 0);
    steps.push(`Opened review submission ${submission.id} — empty, and nothing sent yet.`);
  }
  for (const item of plan.requested) {
    if (plan.existing.some((e) => itemKey(e) === itemKey(item))) {
      steps.push(`${item.type} ${item.id} was already an item on it.`);
      continue;
    }
    await http.request('POST', '/v1/reviewSubmissionItems', {
      body: { data: { type: 'reviewSubmissionItems', relationships: {
        reviewSubmission: { data: { type: 'reviewSubmissions', id: submission.id } },
        [item.type]: { data: { type: RESOURCE_TYPES[item.type], id: item.id } },
      } } },
    });
    steps.push(`Added ${item.type} ${item.id} to it. Still nothing sent.`);
  }
  const handed: any = await http.request('PATCH', `/v1/reviewSubmissions/${encodeURIComponent(submission.id)}`, {
    body: { data: { type: 'reviewSubmissions', id: submission.id, attributes: { submitted: true } } },
  });
  steps.push('Handed it to Apple (submitted=true). This is the step that starts the queue.');
  return { platform, items: plan.items, submissionId: String(submission.id), state: handed?.data?.attributes?.state ?? 'SUBMITTED', steps };
}

function parseRequested(value: unknown): ReviewItem[] {
  if (!Array.isArray(value) || !value.length) throw new AscApiError('items must be a non-empty array.', 0);
  const parsed = value.map((row: any) => {
    if (!row || !REVIEW_ITEM_TYPES.includes(row.type) || typeof row.id !== 'string' || !row.id.trim()) {
      throw new AscApiError('Each item needs a supported type and non-empty id.', 0);
    }
    return { type: row.type, id: row.id.trim() };
  });
  return [...new Map(parsed.map((item: ReviewItem) => [itemKey(item), item])).values()] as ReviewItem[];
}
async function itemPlatform(http: AscHttpClient, appId: string, requested?: string): Promise<string> {
  if (requested) {
    if (!PLATFORMS.includes(requested)) throw new AscApiError(`Unknown platform ${requested}.`, 0);
    return requested;
  }
  const versions: any = await http.get(`/v1/apps/${encodeURIComponent(appId)}/appStoreVersions`, {
    'fields[appStoreVersions]': 'versionString,appStoreState,platform', limit: 20,
  });
  const version = pickVersion(appId, versions?.data ?? []);
  const platform = String(version.attributes?.platform ?? '');
  if (!platform) throw new AscApiError('Platform is missing; pass platform explicitly.', 0);
  return platform;
}
async function submitItems(args: Record<string, unknown>, ctx: { http: AscHttpClient; dryRun?: boolean }) {
  const requested = parseRequested(args.items);
  const app = await resolveApp(ctx.http, String(args.app));
  const platform = await itemPlatform(ctx.http, app.id, args.platform ? String(args.platform) : undefined);
  const plan = await planSubmission(ctx.http, app.id, platform, requested);
  const result = await submitPlan(ctx.http, app.id, platform, plan, Boolean(ctx.dryRun));
  return { ...result, app: `${app.name} (${app.id})` };
}

export async function releaseItemsPreviewArgs(args: Record<string, unknown>, http: AscHttpClient): Promise<Record<string, unknown>> {
  const requested = parseRequested(args.items);
  const app = await resolveApp(http, String(args.app ?? ''));
  const platform = await itemPlatform(http, app.id, args.platform ? String(args.platform) : undefined);
  const plan = await planSubmission(http, app.id, platform, requested);
  await checkCompanions(http, app.id, plan);
  return { app: `${app.name} (${app.id})`, platform: PLATFORM_NAMES[platform] ?? platform, items: plan.items };
}
