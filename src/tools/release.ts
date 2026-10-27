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
import { createHash } from 'node:crypto';
import { PLATFORMS, PLATFORM_NAMES, EDITABLE_STATES, executePreflightTool, pickVersion, readAppStoreVersions } from './preflight.js';
import { APPROVED_STATES, PRODUCT_APPROVED_STATES } from '../core/review-states.js';
import type { DialogText } from '../core/native-confirm.js';
import { appLabel, listText } from './pricing.js';

/** Relationship names accepted by Apple's ReviewSubmissionItemCreateRequest. */
export const REVIEW_ITEM_TYPES = [
  'appCustomProductPageVersion', 'appStoreVersionExperiment', 'appStoreVersionExperimentV2',
  'appEvent', 'appAssetLibraryImage', 'appAssetLibraryVideo', 'backgroundAssetVersion',
  'gameCenterAchievementVersion', 'gameCenterActivityVersion', 'gameCenterChallengeVersion',
  'gameCenterLeaderboardVersion', 'gameCenterLeaderboardSetVersion',
  'inAppPurchaseVersion', 'subscriptionVersion', 'subscriptionGroupVersion',
] as const;
const ITEM_INCLUDES = ['appStoreVersion', ...REVIEW_ITEM_TYPES].join(',');
type ReviewItem = { type: string; id: string };
export const REVIEW_RESOURCE_TYPES: Record<string, string> = {
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
const RESOURCE_TYPES = REVIEW_RESOURCE_TYPES;
const VERSIONED_ITEMS = new Set([
  'appCustomProductPageVersion', 'backgroundAssetVersion', 'gameCenterActivityVersion',
  'gameCenterChallengeVersion', 'inAppPurchaseVersion', 'subscriptionVersion',
  'subscriptionGroupVersion',
  'gameCenterAchievementVersion', 'gameCenterLeaderboardVersion', 'gameCenterLeaderboardSetVersion',
]);
function itemKey(item: ReviewItem): string { return `${item.type}/${item.id}`; }
function itemFromResource(row: any): ReviewItem | undefined {
  const found: ReviewItem[] = [];
  for (const type of ['appStoreVersion', ...REVIEW_ITEM_TYPES]) {
    const id = row?.relationships?.[type]?.data?.id;
    if (id) found.push({ type, id: String(id) });
  }
  return found.length === 1 ? found[0] : undefined;
}
function listedItems(rows: any[]): ReviewItem[] {
  return rows.map((row) => {
    const item = itemFromResource(row);
    if (!item) throw new AscApiError(`Review submission item ${row?.id ?? '(no id)'} has no unique included relationship; refusing to submit unseen content.`, 0);
    return item;
  });
}
function planFingerprint(appId: string, platform: string, submissionId: string | undefined, items: ReviewItem[]): string {
  return createHash('sha256').update(JSON.stringify([appId, platform, submissionId ?? null, items.map(itemKey).sort()])).digest('base64url');
}
function completeRows(res: any, what: string): any[] {
  const rows = res?.data;
  if (!Array.isArray(rows) || res?.links?.next || Number(res?.meta?.paging?.total ?? 0) > rows.length) {
    throw new AscApiError(`${what} response is missing or truncated; refusing to choose or submit.`, 0);
  }
  return rows;
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
    description: 'Submit reviewable product, marketing, Game Center or asset versions to Apple in one call. Set with_app_version=true when the first item needs the platform’s editable App Store version in the same submission. The confirmation lists every existing and new item before submission.',
    inputSchema: {
      type: 'object',
      properties: {
        app: { type: 'string', description: 'App name, bundle ID or numeric Apple ID.' },
        platform: { type: 'string', enum: PLATFORMS, description: 'Review platform. Required when the app has more than one eligible platform.' },
        with_app_version: { type: 'boolean', description: 'Add the platform’s single editable App Store version to the same submission.' },
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
  ctx: { http: AscHttpClient; dryRun?: boolean; approvedPlanFingerprint?: string; requireApprovedPlan?: boolean }
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
  const versions = await readAppStoreVersions(http, app.id, preflight.version, preflight.platform, {
    // platform is load-bearing: the submission below is created for it, and a
    // sparse fieldset that omits it makes every macOS, tvOS and visionOS
    // submission silently claim to be iOS.
    'fields[appStoreVersions]': 'versionString,appStoreState,platform',
  });
  const version = versions.data.find(
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
  const submitted = await submitPlan(http, app.id, versionPlatform, plan, Boolean(ctx.dryRun), ctx.approvedPlanFingerprint, ctx.requireApprovedPlan);
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
  const versions = await readAppStoreVersions(http, app.id,
    args.version ? String(args.version).trim() : undefined, args.platform ? String(args.platform) : undefined);
  const version = pickVersion(
    app.name,
    versions.data,
    args.version ? String(args.version).trim() : undefined,
    args.platform ? String(args.platform) : undefined
  );
  const platform = String(version.attributes?.platform ?? '');
  const plan = await planSubmission(http, app.id, platform, [{ type: 'appStoreVersion', id: String(version.id) }]);
  await checkCompanions(http, app.id, platform, plan);
  return {
    app: `${app.name} (${app.id})`,
    version: version.attributes?.versionString,
    platform: PLATFORM_NAMES[platform] ?? platform,
    items: plan.items,
    existingItems: plan.existing,
    itemNames: { [itemKey({ type: 'appStoreVersion', id: String(version.id) })]: `Version ${version.attributes?.versionString}` },
    planFingerprint: planFingerprint(app.id, platform, plan.submission?.id, plan.items),
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
  const openRows = completeRows(open, 'Open review submissions');
  if (openRows.length > 1) throw new AscApiError('Open review submissions are ambiguous.', 0);
  const submission = openRows[0];
  let rows: any[] = [];
  if (submission) {
    const listed: any = await http.get(`/v1/reviewSubmissions/${encodeURIComponent(submission.id)}/items`, { include: ITEM_INCLUDES, limit: 200 });
    rows = completeRows(listed, 'Review submission items');
    const linked = submission.relationships?.items?.data;
    if (Array.isArray(linked) && linked.some((i: any) => !rows.some((r) => String(r.id) === String(i.id)))) {
      throw new AscApiError(`Review submission ${submission.id} lists an item absent from its items response.`, 0);
    }
  }
  const existing = [...new Map(listedItems(rows).map((i) => [itemKey(i), i])).values()];
  const oldAppVersion = existing.find((i) => i.type === 'appStoreVersion');
  const newAppVersion = requested.find((i) => i.type === 'appStoreVersion');
  if (oldAppVersion && newAppVersion && oldAppVersion.id !== newAppVersion.id) {
    throw new AscApiError(`Open submission ${submission.id} already contains app version ${oldAppVersion.id}; refusing to add a different app version ${newAppVersion.id}.`, 0);
  }
  const items = [...new Map([...existing, ...requested].map((i) => [itemKey(i), i])).values()];
  return { submission, existing, requested, items };
}

/** Source: https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-in-app-purchase
 * The first approved product of each IAP type / auto-renewable subscription is
 * an APP-level rule, not version === 1 on each product. A subscription only
 * needs its group version alongside it when that group has no approved version.
 * These reads precede every POST, including when a submission is reused. */
const HISTORICAL_STATES = 'WAITING_FOR_REVIEW,IN_REVIEW,UNRESOLVED_ISSUES,COMPLETING,COMPLETE';
const VERSION_PARENTS: Record<string, { relationship: string; path: string }> = {
  appCustomProductPageVersion: { relationship: 'appCustomProductPage', path: '/v1/appCustomProductPages/{id}/appCustomProductPageVersions' },
  backgroundAssetVersion: { relationship: 'backgroundAsset', path: '/v1/backgroundAssets/{id}/versions' },
  inAppPurchaseVersion: { relationship: 'inAppPurchase', path: '/v2/inAppPurchases/{id}/versions' },
  subscriptionVersion: { relationship: 'subscription', path: '/v1/subscriptions/{id}/versions' },
  subscriptionGroupVersion: { relationship: 'subscriptionGroup', path: '/v1/subscriptionGroups/{id}/versions' },
};
async function hasEarlierApprovedVersion(http: AscHttpClient, type: string, current: any): Promise<boolean | undefined> {
  const parent = VERSION_PARENTS[type];
  const id = parent && current?.relationships?.[parent.relationship]?.data?.id;
  if (!id) return undefined;
  const path = parent.path.replace('{id}', encodeURIComponent(id));
  const res: any = await http.get(path, { limit: 100, ...(type === 'backgroundAssetVersion' ? { include: 'appStoreRelease' } : {}) });
  return approvedPresence(res, (row) => row.id !== current.id && versionApproved(type, row, res.included));
}

function versionApproved(type: string, row: any, included: any[] = []): boolean {
  if (type !== 'backgroundAssetVersion') return APPROVED_STATES.has(String(row?.attributes?.state ?? ''));
  const releaseId = row?.relationships?.appStoreRelease?.data?.id;
  return included.some((r) => r.type === 'backgroundAssetVersionAppStoreReleases' && r.id === releaseId && APPROVED_STATES.has(r.attributes?.state));
}
function approvedPresence(res: any, matches: (row: any) => boolean): boolean | undefined {
  if (!Array.isArray(res?.data)) return undefined;
  if (res.data.some(matches)) return true;
  if (res.links?.next || Number(res.meta?.paging?.total ?? 0) > res.data.length) return undefined;
  return false;
}
async function appHasApprovedProduct(http: AscHttpClient, appId: string, type: string, product: any): Promise<boolean | undefined> {
  if (type === 'inAppPurchaseVersion') {
    const productType = product?.attributes?.inAppPurchaseType;
    if (!productType) return undefined;
    const res: any = await http.get(`/v1/apps/${encodeURIComponent(appId)}/inAppPurchasesV2`, {
      'filter[state]': PRODUCT_APPROVED_STATES, 'filter[inAppPurchaseType]': productType,
      'fields[inAppPurchases]': 'state,inAppPurchaseType', limit: 1,
    });
    return approvedPresence(res, (r) => r.attributes?.inAppPurchaseType === productType && APPROVED_STATES.has(r.attributes?.state));
  }
  if (type === 'subscriptionVersion') {
    // This filter selects groups containing an approved subscription, across
    // the whole app; a new subscription can belong to a different group.
    const res: any = await http.get(`/v1/apps/${encodeURIComponent(appId)}/subscriptionGroups`, {
      'filter[subscriptions.state]': PRODUCT_APPROVED_STATES, limit: 1,
    });
    return approvedPresence(res, () => true);
  }
  return undefined;
}
async function previouslySubmitted(http: AscHttpClient, appId: string, platform: string, currentId: string | undefined, type: string): Promise<boolean | undefined> {
  const history: any = await http.get(`/v1/apps/${encodeURIComponent(appId)}/reviewSubmissions`, {
    'filter[platform]': platform, 'filter[state]': HISTORICAL_STATES, include: 'items', limit: 200,
  });
  const submissions = completeRows(history, 'Filtered review submission history')
    .filter((row) => String(row.id) !== currentId && HISTORICAL_STATES.split(',').includes(row.attributes?.state)
      && row.attributes?.platform === platform && Boolean(row.attributes?.submittedDate));
  const included = new Map((history?.included ?? []).filter((row: any) => row.type === 'reviewSubmissionItems').map((row: any) => [String(row.id), row]));
  // Apple may omit nested relationship data from included items. Read only the
  // first few eligible submissions, stopping at the first accepted match.
  const MAX_HISTORY_READS = 10;
  for (const [index, submission] of submissions.entries()) {
    if (index >= MAX_HISTORY_READS) throw new AscApiError(`More than ${MAX_HISTORY_READS} historical submissions; cannot determine whether ${type} was previously submitted.`, 0);
    const linked: any[] | undefined = submission.relationships?.items?.data;
    const embedded = linked?.map((ref) => included.get(String(ref.id)));
    const rows = linked && embedded?.every((row) => row && itemFromResource(row))
      ? embedded
      : completeRows(await http.get(`/v1/reviewSubmissions/${encodeURIComponent(submission.id)}/items`, { include: ITEM_INCLUDES, limit: 200 }), 'Historical review submission items');
    for (const row of rows ?? []) {
      const item = itemFromResource(row);
      if (!item) throw new AscApiError(`Historical review submission item ${row?.id ?? '(no id)'} cannot be identified.`, 0);
      if (!row.attributes?.state) throw new AscApiError(`Historical review submission item ${row.id} has no state; cannot use it as first-submission evidence.`, 0);
      if (item.type === type && APPROVED_STATES.has(row.attributes?.state)) return true;
    }
  }
  // An empty v2 history is not proof that a product was never approved through
  // Apple's older submission resources.
  return undefined;
}
async function checkCompanions(http: AscHttpClient, appId: string, platform: string, plan: SubmissionPlan): Promise<void> {
  const hasAppVersion = plan.items.some((i) => i.type === 'appStoreVersion');
  const historyByType = new Map<string, boolean | undefined>();
  for (const item of plan.items) {
    if (item.type === 'appStoreVersion') continue;
    let first: boolean | undefined;
    let version: any;
    let product: any;
    if (VERSIONED_ITEMS.has(item.type)) {
      const include = VERSION_PARENTS[item.type]?.relationship;
      const api = ['gameCenterAchievementVersion', 'gameCenterLeaderboardVersion', 'gameCenterLeaderboardSetVersion'].includes(item.type) ? 'v2' : 'v1';
      version = await http.get(`/${api}/${RESOURCE_TYPES[item.type]}/${encodeURIComponent(item.id)}`,
        include ? { include: item.type === 'backgroundAssetVersion' ? `${include},appStoreRelease` : include } : undefined);
      product = (version?.included ?? []).find((row: any) => row.id === version?.data?.relationships?.[include ?? '']?.data?.id);
      if (APPROVED_STATES.has(String(product?.attributes?.state ?? '')) ||
        versionApproved(item.type, version?.data, version?.included)) first = false;
      else {
        const earlier = await hasEarlierApprovedVersion(http, item.type, version?.data);
        if (earlier) first = false;
      }
    }
    const isProduct = item.type === 'inAppPurchaseVersion' || item.type === 'subscriptionVersion';
    if (first === undefined && !hasAppVersion && isProduct) {
      const key = `${item.type}/${product?.attributes?.inAppPurchaseType ?? ''}`;
      if (!historyByType.has(key)) historyByType.set(key, await appHasApprovedProduct(http, appId, item.type, product));
      const approved = historyByType.get(key);
      if (approved !== undefined) first = !approved;
    }
    if (first === undefined && !hasAppVersion && !isProduct) {
      if (!historyByType.has(item.type)) historyByType.set(item.type, await previouslySubmitted(http, appId, platform, plan.submission?.id, item.type));
      if (historyByType.get(item.type) === true) first = false;
    }
    if (first === undefined && !hasAppVersion) {
      throw new AscApiError(`Cannot establish whether ${itemKey(item)} is the first of its type. Add with_app_version=true or provide an open submission containing an editable app version.`, 0);
    }
    if (first && !hasAppVersion) throw new AscApiError(`First ${itemKey(item)} requires a new app version in the same review submission. Use with_app_version=true.`, 0);
    if (item.type === 'subscriptionVersion') {
      const subscriptionId = version?.data?.relationships?.subscription?.data?.id;
      if (!subscriptionId) throw new AscApiError(`Cannot verify the group for subscription version ${item.id}.`, 0);
      const subscription: any = await http.get(`/v1/subscriptions/${encodeURIComponent(subscriptionId)}`, { include: 'group' });
      const groupId = subscription?.data?.relationships?.group?.data?.id;
      if (!groupId) throw new AscApiError(`Cannot verify the group for subscription version ${item.id}.`, 0);
      const groupVersions: any = await http.get(`/v1/subscriptionGroups/${encodeURIComponent(groupId)}/versions`, { limit: 100 });
      if (approvedPresence(groupVersions, (v) => APPROVED_STATES.has(v.attributes?.state))) continue;
      const groupIds = new Set(completeRows(groupVersions, 'Subscription group versions').map((v: any) => String(v.id)));
      if (!plan.items.some((i) => i.type === 'subscriptionGroupVersion' && groupIds.has(i.id))) {
        throw new AscApiError(`First subscription version ${item.id} requires its subscription group version in the same review submission.`, 0);
      }
    }
  }
}

async function submitPlan(http: AscHttpClient, appId: string, platform: string, plan: SubmissionPlan, dryRun: boolean, approvedFingerprint?: string, requireApproval = false) {
  if (requireApproval && !approvedFingerprint) throw new AscApiError('The approved review item snapshot is missing; no write was sent.', 0);
  if (approvedFingerprint && approvedFingerprint !== planFingerprint(appId, platform, plan.submission?.id, plan.items)) {
    throw new AscApiError('Review submission changed since confirmation; no write was sent. Confirm the current item list again.', 0);
  }
  await checkCompanions(http, appId, platform, plan);
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
  const added: ReviewItem[] = [];
  let stoppedAt = 'opening the review submission';
  try {
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
      stoppedAt = `adding ${itemKey(item)}`;
      await http.request('POST', '/v1/reviewSubmissionItems', {
        body: { data: { type: 'reviewSubmissionItems', relationships: {
          reviewSubmission: { data: { type: 'reviewSubmissions', id: submission.id } },
          [item.type]: { data: { type: RESOURCE_TYPES[item.type], id: item.id } },
        } } },
      });
      added.push(item);
      steps.push(`Added ${item.type} ${item.id} to it. Still nothing sent.`);
    }
    stoppedAt = 'verifying the final item list';
    const finalRead: any = await http.get(`/v1/reviewSubmissions/${encodeURIComponent(submission.id)}/items`, { include: ITEM_INCLUDES, limit: 200 });
    const actual = listedItems(completeRows(finalRead, 'Final review submission items')).map(itemKey).sort();
    const expected = plan.items.map(itemKey).sort();
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new AscApiError(`Final item list changed: expected ${expected.join(', ') || 'none'}; found ${actual.join(', ') || 'none'}.`, 0);
    }
    stoppedAt = 'setting submitted=true';
    const handed: any = await http.request('PATCH', `/v1/reviewSubmissions/${encodeURIComponent(submission.id)}`, {
      body: { data: { type: 'reviewSubmissions', id: submission.id, attributes: { submitted: true } } },
    });
    steps.push('Handed it to Apple (submitted=true). This is the step that starts the queue.');
    return { platform, items: plan.items, submissionId: String(submission.id), state: handed?.data?.attributes?.state ?? 'SUBMITTED', steps };
  } catch (err) {
    throw new AscApiError(
      `Review submission ${submission?.id ?? '(id not returned)'} stopped while ${stoppedAt}. ` +
      `Items confirmed added: ${added.map(itemKey).join(', ') || 'none'}. ` +
      `Steps: ${steps.join(' ') || 'none'}. The failed request may have reached Apple; inspect this submission before retrying. ` +
      `Cause: ${err instanceof Error ? err.message : String(err)}`,
      0
    );
  }
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
async function itemTarget(http: AscHttpClient, appId: string, requested: string | undefined, withAppVersion: boolean): Promise<{ platform: string; appVersion?: ReviewItem; version?: string }> {
  if (requested && !PLATFORMS.includes(requested)) throw new AscApiError(`Unknown platform ${requested}.`, 0);
  if (requested && !withAppVersion) return { platform: requested };
  const { data: versions } = await readAppStoreVersions(http, appId, undefined, requested);
  const selected = pickVersion(appId, versions, undefined, requested);
  const platform = String(requested ?? selected.attributes?.platform ?? '');
  if (!platform) throw new AscApiError('Platform is missing; pass platform explicitly.', 0);
  if (!withAppVersion) return { platform };
  const editable = versions.filter((v: any) => v.attributes?.platform === platform &&
    EDITABLE_STATES.has(v.attributes?.appStoreState));
  if (editable.length !== 1) throw new AscApiError(`Expected exactly one editable App Store version on ${platform}; found ${editable.length}. Pass a platform with one editable version or prepare one first.`, 0);
  const version = String(editable[0].attributes?.versionString ?? '');
  const preflight: any = await executePreflightTool('preflight__check_version', { app: appId, platform, version }, { http, expectedVersionId: String(editable[0].id) });
  if (!preflight.ready) throw new AscApiError(`App version ${version} cannot accompany these items: ${preflight.blocking.map((b: any) => `${b.check}: ${b.problem} (fix with ${b.fixWith})`).join('; ') || preflight.state}. Nothing was submitted.`, 0);
  return { platform, version, appVersion: { type: 'appStoreVersion', id: String(editable[0].id) } };
}
async function submitItems(args: Record<string, unknown>, ctx: { http: AscHttpClient; dryRun?: boolean; approvedPlanFingerprint?: string; requireApprovedPlan?: boolean }) {
  const requested = parseRequested(args.items);
  const app = await resolveApp(ctx.http, String(args.app));
  const target = await itemTarget(ctx.http, app.id, args.platform ? String(args.platform) : undefined, args.with_app_version === true);
  if (target.appVersion) requested.unshift(target.appVersion);
  const plan = await planSubmission(ctx.http, app.id, target.platform, requested);
  const result = await submitPlan(ctx.http, app.id, target.platform, plan, Boolean(ctx.dryRun), ctx.approvedPlanFingerprint, ctx.requireApprovedPlan);
  return { ...result, app: `${app.name} (${app.id})` };
}

export async function releaseItemsPreviewArgs(args: Record<string, unknown>, http: AscHttpClient): Promise<Record<string, unknown>> {
  const requested = parseRequested(args.items);
  const app = await resolveApp(http, String(args.app ?? ''));
  const target = await itemTarget(http, app.id, args.platform ? String(args.platform) : undefined, args.with_app_version === true);
  if (target.appVersion) requested.unshift(target.appVersion);
  const plan = await planSubmission(http, app.id, target.platform, requested);
  await checkCompanions(http, app.id, target.platform, plan);
  return { app: `${app.name} (${app.id})`, platform: PLATFORM_NAMES[target.platform] ?? target.platform, items: plan.items,
    existingItems: plan.existing,
    ...(target.appVersion ? { version: target.version, itemNames: { [itemKey(target.appVersion)]: `Version ${target.version}` } } : {}),
    planFingerprint: planFingerprint(app.id, target.platform, plan.submission?.id, plan.items) };
}

const ITEM_NOUNS: Record<string, string> = {
  appStoreVersion: 'app version', appCustomProductPageVersion: 'custom product page',
  appStoreVersionExperiment: 'product page test', appStoreVersionExperimentV2: 'product page test',
  appEvent: 'in-app event', appAssetLibraryImage: 'library image', appAssetLibraryVideo: 'library video',
  backgroundAssetVersion: 'background asset', gameCenterAchievementVersion: 'Game Center achievement',
  gameCenterActivityVersion: 'Game Center activity', gameCenterChallengeVersion: 'Game Center challenge',
  gameCenterLeaderboardVersion: 'Game Center leaderboard', gameCenterLeaderboardSetVersion: 'Game Center leaderboard set',
  inAppPurchaseVersion: 'in-app purchase', subscriptionVersion: 'subscription', subscriptionGroupVersion: 'subscription group',
};
/** Items by name where the preview carries one, else counted by kind ("2 in-app purchases"); never by id. */
function itemPhrases(items: ReviewItem[], shown: Record<string, unknown>): string[] {
  const names = (shown.itemNames ?? {}) as Record<string, string>;
  const named: string[] = [];
  const counts = new Map<string, number>();
  for (const item of items) {
    if (item.type === 'appStoreVersion' && shown.version) named.push(`version ${String(shown.version)}`);
    else if (names[itemKey(item)]) named.push(names[itemKey(item)]);
    else counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return [...named, ...[...counts].map(([type, n]) => {
    const noun = ITEM_NOUNS[type] ?? 'item';
    return n === 1 ? `${/^[aeiou]/i.test(noun) ? 'an' : 'a'} ${noun}` : `${n} ${noun}s`;
  })];
}

/**
 * The macOS dialog for a submission, from what releasePreviewArgs or
 * releaseItemsPreviewArgs resolved: items by name or kind, items already in the
 * open submission said apart, no ids or states.
 */
export function releaseDialog(name: string, shown: Record<string, unknown>): DialogText | undefined {
  if (name !== 'release__submit' && name !== 'release__submit_items') return undefined;
  const app = appLabel(shown.app);
  const items = (Array.isArray(shown.items) ? shown.items : []) as ReviewItem[];
  const existing = new Set((Array.isArray(shown.existingItems) ? shown.existingItems as ReviewItem[] : []).map(itemKey));
  const added = items.filter((i) => !existing.has(itemKey(i)));
  // The version is in the title of release__submit; it is not news when it was already there.
  const along = items.filter((i) => existing.has(itemKey(i)) && !(name === 'release__submit' && i.type === 'appStoreVersion'));
  const title = name === 'release__submit'
    ? `Submit ${[app, shown.version].filter(Boolean).join(' ')} for App Review?`
    : `Submit ${listText(itemPhrases(added.length ? added : items, shown))} for App Review?`;
  const lines = [
    [app, shown.platform].filter(Boolean).join(' · '),
    ...(along.length && (name === 'release__submit' || added.length) ? [`Already in the open submission and going too: ${listText(itemPhrases(along, shown))}`] : []),
    ...(shown.skip_preflight === true ? ['Submitted even if the pre-flight finds blocking gaps.'] : []),
  ];
  const last = items.length > 1
    ? 'Apple starts reviewing the submission; you can withdraw it until review begins.'
    : 'Apple starts reviewing it; you can withdraw it until review begins.';
  return { title, body: [...lines, '', last].join('\n'), action: 'Submit' };
}
