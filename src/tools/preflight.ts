/**
 * "Is this version ready to submit?" — in one call, before the rejection.
 *
 * The failures this catches are all cheap to find and expensive to hit. A build
 * still processing, an export-compliance answer nobody gave, a demo account
 * marked required and left blank, a locale with no description: each one is a
 * single field, and each one comes back days later as a rejection or a version
 * parked in WAITING_FOR_EXPORT_COMPLIANCE with no explanation attached.
 *
 * Reading them through the raw tools means the version, its build, its review
 * detail, every localization, the screenshot sets under one of them, and the
 * open review submission — six resources across five shapes, and knowing in
 * advance which fields on each one Apple actually enforces. That last part is
 * the value here: the calls are not hard, the checklist is.
 *
 * Read-only, and deliberately says nothing about whether Apple will approve the
 * app. It answers a narrower question — whether the submission is complete —
 * because that is the one with a factual answer.
 */
import type { McpToolDefinition } from '../core/registry.js';
import type { AscHttpClient, Query } from '../core/http.js';
import { AscApiError } from '../core/errors.js';
import { resolveApp } from '../core/resolve-app.js';
import { MEDIA_NAMES, MEDIA_TARGETS, mediaPath } from './media-catalog.js';
import { APPROVED_STATES } from '../core/review-states.js';

const subscriptionFindingsSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      check: { type: 'string' },
      severity: { type: 'string', enum: ['blocking', 'warning'] },
      problem: { type: 'string' },
      fixWith: { type: 'string', description: 'Exact generated raw tool name.' },
    },
    required: ['check', 'severity', 'problem', 'fixWith'],
  },
};
const truncatedSchema = {
  type: 'array', items: { type: 'string' },
  description: 'Reads stopped at a cap; these notes identify data not inspected.',
};

/** Apple's App Store platforms, and how a person writes them. */
export const PLATFORMS = ['IOS', 'MAC_OS', 'TV_OS', 'VISION_OS'];
export const PLATFORM_NAMES: Record<string, string> = { IOS: 'iOS', MAC_OS: 'macOS', TV_OS: 'tvOS', VISION_OS: 'visionOS' };

export const PREFLIGHT_TOOLS: McpToolDefinition[] = [
  {
    name: 'preflight__check_version',
    description:
      'Check whether an app version is complete enough to submit, in one call, and ' +
      'list what is missing. Give the app (name, bundle ID or Apple ID). Verifies the ' +
      'build is attached and finished processing, the export compliance answer is ' +
      'given, the review contact and demo account are filled in, every locale has a ' +
      'description and keywords, and screenshots exist. Each gap names the tool that ' +
      'fixes it. Read-only — it changes nothing and does not submit.',
    inputSchema: {
      type: 'object',
      properties: {
        app: {
          type: 'string',
          description: 'App name, bundle ID (com.example.app) or numeric Apple ID.',
        },
        version: {
          type: 'string',
          description:
            'Version string (e.g. "3.2.0"). Defaults to the newest version that is ' +
            'still editable.',
        },
        platform: {
          type: 'string',
          enum: PLATFORMS,
          description: 'Which platform’s version. Needed when the app has one on more than one platform.',
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
        state: { type: 'string' },
        ready: { type: 'boolean' },
        blocking: {
          type: 'array',
          description: 'Gaps that stop the submission. Empty when ready is true.',
          items: {
            type: 'object',
            properties: {
              check: { type: 'string' },
              problem: { type: 'string' },
              fixWith: { type: 'string' },
            },
            required: ['check', 'problem', 'fixWith'],
          },
        },
        warnings: {
          type: 'array',
          description: 'Worth reading, but Apple accepts a submission without them.',
          items: { type: 'string' },
        },
        checked: { type: 'array', items: { type: 'string' } },
        manualChecks: {
          type: 'array',
          description: 'Required before review, but the API can neither read nor set them: confirm each in App Store Connect.',
          items: {
            type: 'object',
            properties: { check: { type: 'string' }, why: { type: 'string' }, where: { type: 'string' } },
            required: ['check', 'why', 'where'],
          },
        },
      },
      required: ['app', 'ready', 'blocking', 'warnings', 'checked', 'manualChecks'],
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'preflight__check_subscription',
    description:
      'Check subscription catalog readiness before submitting for review. Give the app ' +
      'and either a subscription (product ID, name or ID) or a group (reference name or ID). ' +
      'Checks localizations, group locales, prices, plan availability, review screenshot, ' +
      'review note and required attributes; reports state and blocking or warning findings ' +
      'with the raw tool that fixes each gap. Group mode checks at most 20 subscriptions. ' +
      'All reads are capped and truncation is reported. Read-only; ready means no observed ' +
      'blocking catalog gaps, not a prediction of Apple approval or permission to submit.',
    inputSchema: {
      type: 'object',
      properties: {
        app: { type: 'string', minLength: 1, description: 'App name, bundle ID or numeric Apple ID.' },
        subscription: { type: 'string', minLength: 1, description: 'Exact product ID, name or subscription ID. Cannot be combined with group.' },
        group: { type: 'string', minLength: 1, description: 'Exact reference name or group ID. Check up to 20 subscriptions in this group.' },
        version_id: { type: 'string', minLength: 1, description: 'Specific subscription version ID. Valid only with subscription.' },
      },
      required: ['app'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        app: { type: 'string' },
        subscriptions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' }, productId: { type: 'string' }, name: { type: 'string' },
              state: { type: 'string' }, ready: { type: 'boolean' },
              version: { type: ['object', 'null'], properties: { id: { type: 'string' }, number: { type: 'integer' }, state: { type: 'string' } } },
              otherVersions: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, number: { type: 'integer' }, state: { type: 'string' } } } },
              findings: subscriptionFindingsSchema, truncated: truncatedSchema,
            },
            required: ['id', 'productId', 'name', 'state', 'ready', 'findings', 'truncated'],
          },
        },
        group: {
          type: 'object',
          properties: {
            id: { type: 'string' }, referenceName: { type: 'string' }, ready: { type: 'boolean' },
            version: { type: ['object', 'null'], properties: { id: { type: 'string' }, number: { type: 'integer' }, state: { type: 'string' } } },
            otherVersions: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, number: { type: 'integer' }, state: { type: 'string' } } } },
            checkedSubscriptions: { type: 'integer' },
            findings: subscriptionFindingsSchema, truncated: truncatedSchema,
          },
          required: ['id', 'referenceName', 'ready', 'checkedSubscriptions', 'findings', 'truncated'],
        },
        truncated: truncatedSchema,
        note: { type: 'string' },
      },
      required: ['app', 'subscriptions', 'truncated', 'note'],
    },
    annotations: { readOnlyHint: true, idempotentHint: true },
  },
];

export const PREFLIGHT_TOOL_NAMES: ReadonlySet<string> = new Set(
  PREFLIGHT_TOOLS.map((t) => t.name)
);

/**
 * States in which a version is still being prepared. Anything else — in review,
 * on sale, replaced — is not a submission to check, and saying so beats
 * reporting every field as fine on a version nobody can edit.
 */
export const EDITABLE_STATES = new Set([
  'PREPARE_FOR_SUBMISSION',
  'DEVELOPER_REJECTED',
  'REJECTED',
  'METADATA_REJECTED',
  'INVALID_BINARY',
  'WAITING_FOR_EXPORT_COMPLIANCE',
]);

/** Shared by previews, release and preflight. Filters avoid walking years of
 * released versions; pagination still checks every candidate for ambiguity. */
export async function readAppStoreVersions(http: AscHttpClient, appId: string, wanted?: string, platform?: string, fields: Query = {}): Promise<{ data: any[]; included: any[] }> {
  const path = `/v1/apps/${encodeURIComponent(appId)}/appStoreVersions`;
  const read = async (editableOnly: boolean) => {
    const query: Query = {
      'fields[appStoreVersions]': 'versionString,appStoreState,platform', ...fields,
      ...(platform ? { 'filter[platform]': platform } : {}),
      ...(wanted ? { 'filter[versionString]': wanted } : editableOnly ? { 'filter[appStoreState]': [...EDITABLE_STATES].join(',') } : {}),
      limit: 200,
    };
    const data: any[] = [], included: any[] = [];
    const seen = new Set<string>();
    let next: string | undefined = path;
    let total = 0;
    for (let page = 0; next && page < 10; page++) {
      if (seen.has(next)) throw new AscApiError('App Store versions response is truncated: repeated pagination cursor.', 0);
      seen.add(next);
      const res: any = await http.get(next, page === 0 ? query : undefined);
      if (!Array.isArray(res?.data)) throw new AscApiError('App Store versions response is missing; refusing to choose.', 0);
      data.push(...res.data);
      included.push(...(res.included ?? []));
      total = Math.max(total, Number(res.meta?.paging?.total ?? 0));
      next = res.links?.next || undefined;
    }
    const unique = [...new Map(data.map((v) => [v.id, v])).values()];
    if (next || total > unique.length) throw new AscApiError('App Store versions response is truncated after at most 10 pages; refusing to choose.', 0);
    return { data: unique, included };
  };
  const versions = await read(!wanted);
  // Preserve the useful "already in review/on sale" preflight result when no
  // editable version exists, without making an incomplete platform choice.
  return !wanted && !versions.data.length ? read(false) : versions;
}

/**
 * The version a version-scoped macro means. An app sold on iOS and tvOS has a
 * version per platform, often both editable at once, and the version string
 * alone does not say which: picking the first one submitted whichever Apple
 * listed first. With no platform given and more than one in play, refuse and
 * name them rather than guess.
 */
export function pickVersion(appName: string, all: any[], wanted?: string, platform?: string): any {
  const onPlatform = platform ? all.filter((v) => v.attributes?.platform === platform) : all;
  const matches = wanted
    ? onPlatform.filter((v) => String(v.attributes?.versionString ?? '') === wanted)
    : onPlatform.filter((v) => EDITABLE_STATES.has(String(v.attributes?.appStoreState ?? '')));
  if (!wanted && !matches.length && new Set(onPlatform.map((v) => v.attributes?.platform)).size > 1) {
    throw new AscApiError(`${appName} has no editable version and has versions on more than one platform. Say which with platform: ${PLATFORMS.join(', ')}.`, 0);
  }
  if (new Set(matches.map((v) => v.attributes?.platform)).size > 1) {
    const found = matches.map((v) => `${PLATFORM_NAMES[v.attributes?.platform] ?? v.attributes?.platform} ${v.attributes?.versionString}`);
    throw new AscApiError(
      `${appName} has ${wanted ? `version ${wanted}` : 'an editable version'} on more than one platform (${found.join(', ')}). ` +
        `Say which with platform: ${PLATFORMS.join(', ')}.`,
      0
    );
  }
  const version = matches[0] ?? (wanted ? undefined : onPlatform[0]);
  if (!version) {
    const on = platform ? ` on ${PLATFORM_NAMES[platform] ?? platform}` : '';
    throw new AscApiError(
      wanted
        ? `${appName} has no version "${wanted}"${on}. Found: ${onPlatform.map((v) => v.attributes?.versionString).join(', ') || 'none'}.`
        : `${appName} has no App Store versions${on}.`,
      0
    );
  }
  return version;
}

interface Gap {
  check: string;
  problem: string;
  fixWith: string;
}

export async function executePreflightTool(
  name: string,
  args: Record<string, unknown>,
  ctx: { http: AscHttpClient; expectedVersionId?: string }
): Promise<unknown> {
  if (name === 'preflight__check_subscription') return checkSubscription(args, ctx.http);
  if (name !== 'preflight__check_version') {
    throw new Error(`Unknown preflight tool: ${name}`);
  }
  if (!args.app || typeof args.app !== 'string') {
    throw new AscApiError('"app" is required.', 0);
  }

  const http = ctx.http;
  const app = await resolveApp(http, String(args.app));

  // One call for the version and the two things hanging off it that carry
  // fields Apple enforces. The alternative is three round trips to assemble
  // what `include` returns in one.
  const versions = await readAppStoreVersions(http, app.id,
    args.version ? String(args.version).trim() : undefined,
    args.platform ? String(args.platform) : undefined, {
    'fields[appStoreVersions]': 'versionString,appStoreState,platform,copyright,build,appStoreReviewDetail',
    include: 'build,appStoreReviewDetail',
    'fields[builds]': 'version,processingState,expired,usesNonExemptEncryption',
    'fields[appStoreReviewDetails]':
      'contactFirstName,contactLastName,contactPhone,contactEmail,demoAccountName,demoAccountPassword,demoAccountRequired,notes',
  });

  const version = pickVersion(
    app.name,
    versions?.data ?? [],
    args.version ? String(args.version).trim() : undefined,
    args.platform ? String(args.platform) : undefined
  );
  if (ctx.expectedVersionId && String(version.id) !== ctx.expectedVersionId) {
    throw new AscApiError('App Store version changed during preflight; retry with the current version.', 0);
  }

  const included = (versions?.included ?? []) as any[];
  const byId = (type: string, id?: string) =>
    id ? included.find((i) => i.type === type && String(i.id) === String(id)) : undefined;
  const build = byId('builds', version.relationships?.build?.data?.id);
  const review = byId('appStoreReviewDetails', version.relationships?.appStoreReviewDetail?.data?.id);

  const state = String(version.attributes?.appStoreState ?? 'UNKNOWN');
  const blocking: Gap[] = [];
  const warnings: string[] = [];
  const checked: string[] = [];

  if (!EDITABLE_STATES.has(state)) {
    // Not a gap — there is nothing to fix. The version has moved past the point
    // where any of this is actionable, and the rest of the checks would report
    // a complete submission as though it were pending.
    return {
      app: `${app.name} (${app.id})`,
      version: version.attributes?.versionString,
      platform: version.attributes?.platform,
      state,
      ready: false,
      blocking: [],
      warnings: [
        `Version ${version.attributes?.versionString} is ${state}, which is past the point of preparing a submission. Nothing here is editable, so no checks were run.`,
      ],
      checked: [],
    };
  }

  // --- build ---------------------------------------------------------------
  if (state === 'INVALID_BINARY' || state === 'WAITING_FOR_EXPORT_COMPLIANCE') {
    blocking.push({ check: 'version state', problem: `Version is ${state}; resolve this state before submitting.`,
      fixWith: state === 'INVALID_BINARY' ? 'app_store_versions__build__set' : 'builds__update' });
  }
  checked.push('build attached and processed');
  if (!build) {
    blocking.push({
      check: 'build',
      problem: 'No build is attached to this version.',
      fixWith: 'app_store_versions__build__set (list candidates with apps__builds__list)',
    });
  } else {
    const processing = String(build.attributes?.processingState ?? '');
    if (processing !== 'VALID') {
      blocking.push({
        check: 'build',
        problem: `Build ${build.attributes?.version} is ${processing || 'in an unknown state'}, not VALID.`,
        fixWith:
          processing === 'PROCESSING'
            ? 'nothing — wait for Apple to finish processing, then re-run this check'
            : 'builds__get for the reason, then upload a replacement',
      });
    }
    if (build.attributes?.expired === true) {
      blocking.push({
        check: 'build',
        problem: `Build ${build.attributes?.version} has expired.`,
        fixWith: 'app_store_versions__build__set with a current build',
      });
    }

    // --- export compliance -------------------------------------------------
    checked.push('export compliance answered');
    if (build.attributes?.usesNonExemptEncryption == null) {
      blocking.push({
        check: 'export compliance',
        problem:
          'usesNonExemptEncryption is unanswered on the build, so the version will park at WAITING_FOR_EXPORT_COMPLIANCE after submission instead of entering review.',
        fixWith:
          'builds__update (or declare it in the build’s Info.plist as ITSAppUsesNonExemptEncryption)',
      });
    }
  }

  // --- review detail -------------------------------------------------------
  checked.push('review contact and demo account');
  if (!review) {
    blocking.push({
      check: 'review detail',
      problem: 'No App Store review detail exists: Apple has no contact for this submission.',
      fixWith: 'app_store_review_details__create',
    });
  } else {
    const a = review.attributes ?? {};
    const missing = ['contactFirstName', 'contactLastName', 'contactPhone', 'contactEmail'].filter(
      (f) => !String(a[f] ?? '').trim()
    );
    if (missing.length) {
      blocking.push({
        check: 'review detail',
        problem: `Review contact is incomplete: ${missing.join(', ')} empty.`,
        fixWith: 'app_store_review_details__update',
      });
    }
    // Only when it is required. A blank demo account on an app that does not
    // need one is correct, and flagging it would train the reader to ignore
    // this section.
    if (a.demoAccountRequired === true) {
      const blank = ['demoAccountName', 'demoAccountPassword'].filter(
        (f) => !String(a[f] ?? '').trim()
      );
      if (blank.length) {
        blocking.push({
          check: 'review detail',
          problem: `demoAccountRequired is true but ${blank.join(' and ')} ${blank.length > 1 ? 'are' : 'is'} empty.`,
          fixWith: 'app_store_review_details__update',
        });
      }
    }
  }

  // --- localizations -------------------------------------------------------
  checked.push('every locale has a description and keywords');
  const locs: any = await http.get(
    `/v1/appStoreVersions/${encodeURIComponent(version.id)}/appStoreVersionLocalizations`,
    {
      'fields[appStoreVersionLocalizations]': 'locale,description,keywords,whatsNew,appScreenshotSets',
      include: 'appScreenshotSets',
      'fields[appScreenshotSets]': 'screenshotDisplayType',
      limit: 200,
    }
  );
  const localizations = (locs?.data ?? []) as any[];
  const emptyDescription = localizations
    .filter((l) => !String(l.attributes?.description ?? '').trim())
    .map((l) => l.attributes?.locale);
  const emptyKeywords = localizations
    .filter((l) => !String(l.attributes?.keywords ?? '').trim())
    .map((l) => l.attributes?.locale);

  if (emptyDescription.length) {
    blocking.push({
      check: 'localizations',
      problem: `No description in ${emptyDescription.length} locale(s): ${emptyDescription.join(', ')}.`,
      fixWith: 'app_store_version_localizations__update',
    });
  }
  if (emptyKeywords.length) {
    warnings.push(
      `No keywords in ${emptyKeywords.length} locale(s): ${emptyKeywords.join(', ')}. Apple accepts this; it costs search placement.`
    );
  }
  const emptyWhatsNew = localizations
    .filter((l) => !String(l.attributes?.whatsNew ?? '').trim())
    .map((l) => l.attributes?.locale);
  if (emptyWhatsNew.length && emptyWhatsNew.length < localizations.length) {
    warnings.push(
      `"What's New" is filled in for some locales and empty in ${emptyWhatsNew.length}: ${emptyWhatsNew.join(', ')}. Required only on an update, and inconsistent here.`
    );
  }

  // --- screenshots ---------------------------------------------------------
  // Library placements and legacy sets coexist on existing versions. Inspect
  // every locale: a failed first locale must not hide a usable later one.
  checked.push('screenshots exist');
  let images = 0;
  let carrying = 0;
  for (const loc of localizations) {
    let localImages = 0;
    const path = mediaPath(MEDIA_TARGETS.version.placements, loc.id);
    let next: string | undefined = path;
    const seen = new Set<string>();
    let inspected = 0, total = 0;
    for (let page = 0; next && page < 10; page++) {
      if (seen.has(next)) throw new AscApiError('Screenshot placements response has a repeated cursor.', 0);
      seen.add(next);
      const placements: any = await http.get(next, page === 0 ? { include: 'image', limit: 200 } : undefined);
      if (!Array.isArray(placements?.data)) throw new AscApiError('Screenshot placements response is missing.', 0);
      inspected += placements.data.length;
      total = Math.max(total, Number(placements.meta?.paging?.total ?? 0));
      for (const p of placements.data) {
        if (!['APP_SCREENSHOT', 'IMESSAGE_APP_SCREENSHOT'].includes(p.attributes?.placementType) || !p.relationships?.image?.data?.id) continue;
        const asset = (placements.included ?? []).find((a: any) => a.type === 'appAssetLibraryImages' && a.id === p.relationships.image.data.id);
        localImages++;
        if (p.attributes?.state === 'FAILED' || asset?.attributes?.state === 'FAILED') blocking.push({
          check: 'screenshots', problem: `Screenshot placement ${p.id} in ${loc.attributes?.locale} failed.`, fixWith: MEDIA_NAMES.upload,
        });
      }
      next = placements.links?.next || undefined;
    }
    if (next || total > inspected) throw new AscApiError('Screenshot placements response is truncated; cannot check readiness.', 0);
    for (const ref of loc.relationships?.appScreenshotSets?.data ?? []) {
      const shots: any = await http.get(`/v1/appScreenshotSets/${encodeURIComponent(ref.id)}/appScreenshots`, {
        'fields[appScreenshots]': 'assetDeliveryState', limit: 50,
      });
      localImages += (shots?.data ?? []).length;
      const failed = (shots?.data ?? []).filter((s: any) => s.attributes?.assetDeliveryState?.state === 'FAILED').length;
      if (failed) blocking.push({ check: 'screenshots', problem: `${failed} screenshot(s) in ${loc.attributes?.locale} failed to deliver.`, fixWith: MEDIA_NAMES.upload });
    }
    images += localImages;
    if (localImages) carrying++;
  }
  if (!images) blocking.push({ check: 'screenshots', problem: 'No locale has screenshot images in sets or asset library placements.', fixWith: MEDIA_NAMES.upload });
  if (carrying && carrying < localizations.length) warnings.push(`${carrying} of ${localizations.length} locales carry their own screenshots; the rest inherit from the primary locale.`);

  // --- open review submission ---------------------------------------------
  // Submitting is its own object now, and a version added to it without the
  // subscription or in-app purchase that the release depends on is the failure
  // this catches: both halves look complete on their own.
  checked.push('open review submission contents');
  const submissions: any = await http.get(
    `/v1/apps/${encodeURIComponent(app.id)}/reviewSubmissions`,
    { 'filter[state]': 'READY_FOR_REVIEW', include: 'items', limit: 5 }
  );
  const open = (submissions?.data ?? [])[0];
  if (open) {
    const items = (submissions?.included ?? []).filter((i: any) => i.type === 'reviewSubmissionItems');
    const carriesVersion = items.some(
      (i: any) => String(i.relationships?.appStoreVersion?.data?.id ?? '') === String(version.id)
    );
    warnings.push(
      carriesVersion
        ? `An open review submission already carries this version, with ${items.length} item(s) in total.`
        : `An open review submission exists with ${items.length} item(s), and this version is not one of them.`
    );
  }

  return {
    app: `${app.name} (${app.id})`,
    version: version.attributes?.versionString,
    platform: version.attributes?.platform,
    state,
    ready: blocking.length === 0,
    blocking,
    warnings,
    checked,
    manualChecks: manualChecks(app.id),
  };
}

/**
 * What blocks a submission that no App Store Connect API endpoint can read or
 * write, so `ready: true` is never taken to cover it. Listed every time rather
 * than guessed at: there is no way to tell from here whether each one is done.
 */
export function manualChecks(appId: string) {
  return [
    {
      check: 'App Privacy',
      why: 'Every app needs its data-collection answers published before review; the API has no endpoint for them.',
      where: `https://appstoreconnect.apple.com/apps/${encodeURIComponent(appId)}/distribution/privacy`,
    },
    {
      check: 'EU trader status',
      why: 'Required to be sold in the European Union under the Digital Services Act; set once per account by the Account Holder or Admin.',
      where: 'https://appstoreconnect.apple.com/business',
    },
    {
      check: 'Agreements, tax and banking',
      why: 'A paid app or in-app purchases need the Paid Apps Agreement active; Apple removed the endpoint that reported agreement state.',
      where: 'https://appstoreconnect.apple.com/business',
    },
  ];
}

interface SubscriptionFinding extends Gap {
  severity: 'blocking' | 'warning';
}

async function checkSubscription(args: Record<string, unknown>, http: AscHttpClient) {
  if (typeof args.app !== 'string' || !args.app.trim()) {
    throw new AscApiError('"app" is required.', 0);
  }
  if ((args.subscription !== undefined) === (args.group !== undefined)) {
    throw new AscApiError('Provide exactly one of "subscription" or "group".', 0);
  }
  const selector = args.subscription ?? args.group;
  if (typeof selector !== 'string' || !selector.trim()) {
    throw new AscApiError('The subscription or group must be a non-empty string.', 0);
  }
  const wanted = selector.trim();
  const groupMode = args.group !== undefined;
  if (args.version_id !== undefined && (groupMode || typeof args.version_id !== 'string' || !args.version_id.trim())) {
    throw new AscApiError('version_id requires one subscription and a non-empty version ID.', 0);
  }
  const app = await resolveApp(http, args.app);
  const truncated: string[] = [];

  // Presence is conclusive after one row. Other checks need every row within
  // their cap; an empty partial page cannot establish absence in either case.
  const page = async (path: string, limit: number, notes: string[], params: Record<string, string> = {}, presenceOnly = false) => {
    const res: any = await http.get(path, { ...params, limit });
    const rows: any[] = (res?.data ?? []).slice(0, limit);
    const more = Boolean(res?.links?.next) || Number(res?.meta?.paging?.total ?? 0) > rows.length ||
      (res?.data ?? []).length > limit;
    if (more && !(presenceOnly && rows.length)) notes.push(`${path}: truncated at one page (${limit} rows); additional rows were not inspected.`);
    return { rows, more };
  };
  const groups = await page(`/v1/apps/${encodeURIComponent(app.id)}/subscriptionGroups`, 20, truncated, {
    'fields[subscriptionGroups]': 'referenceName',
  });
  const same = (value: unknown) => String(value ?? '').toLowerCase() === wanted.toLowerCase();
  const choose = (hits: any[], kind: string, incomplete: boolean) => {
    if (hits.length > 1) {
      throw new AscApiError(`"${wanted}" is ambiguous: ${hits.map((h) => h.id).join(', ')}. Use the ${kind} ID.`, 0);
    }
    if (!hits.length) {
      throw new AscApiError(`No ${kind} matching "${wanted}" in ${app.name}.${incomplete ? ' Search truncated at the catalog caps; the match may be outside the inspected rows.' : ''}`, 0);
    }
    // IDs and product IDs are unique. A name in a partial catalog might have
    // an unseen twin, so do not silently choose it.
    if (incomplete && hits[0].id !== wanted && hits[0].attributes?.productId !== wanted) {
      throw new AscApiError(`Search truncated; cannot establish whether "${wanted}" is ambiguous. Use the ${kind} ID.`, 0);
    }
    return hits[0];
  };
  const fields = 'name,productId,state,subscriptionPeriod,familySharable,reviewNote';
  let group: any;
  let selected: any[];
  let subscriptionsTruncated = false;
  const groupTruncated: string[] = [];
  const versionStates = new Map<string, Array<{ id: string; number: number; state: string }>>();
  if (groupMode) {
    group = choose(groups.rows.filter((g) => g.id === wanted || same(g.attributes?.referenceName)), 'group', groups.more);
    const subs = await page(`/v1/subscriptionGroups/${encodeURIComponent(group.id)}/subscriptions`, 20, groupTruncated, {
      'fields[subscriptions]': fields,
    });
    selected = subs.rows;
    subscriptionsTruncated = subs.more;
  } else {
    const matches: any[] = [];
    for (const g of groups.rows) {
      const subs = await page(`/v1/subscriptionGroups/${encodeURIComponent(g.id)}/subscriptions`, 50, truncated, {
        'fields[subscriptions]': fields,
      });
      for (const sub of subs.rows) {
        if (sub.id === wanted || sub.attributes?.productId === wanted || same(sub.attributes?.name)) {
          matches.push({ ...sub, catalogGroup: g });
        }
      }
    }
    const sub = choose(matches, 'subscription', truncated.length > 0);
    group = sub.catalogGroup;
    selected = [sub];
  }

  // Apple 4.4.1 moved editable group localization to a version resource.
  const selectDraft = async (path: string, kind: string, notes: string[], explicit?: string) => {
    const versions = await page(path, 100, notes, { [`fields[${kind}]`]: 'version,state' });
    versionStates.set(path, versions.rows.map((v) => ({ id: String(v.id), number: Number(v.attributes?.version), state: String(v.attributes?.state ?? 'UNKNOWN') })));
    // These enums also contain rejected and queued versions. They are existing
    // drafts/submissions, not permission to create another undeletable draft.
    const editable = versions.rows.filter((v) => ['PREPARE_FOR_SUBMISSION', 'READY_FOR_REVIEW', 'DEVELOPER_REJECTED', 'REJECTED'].includes(v.attributes?.state));
    const pending = versions.rows.filter((v) => !APPROVED_STATES.has(v.attributes?.state) && !editable.includes(v));
    if (explicit) {
      const found = versions.rows.find((v) => v.id === explicit);
      if (!found && versions.more) throw new AscApiError(`Version ${explicit} may be beyond the inspected page; cannot verify ownership.`, 0);
      if (!found) throw new AscApiError(`Version ${explicit} does not belong to this product.`, 0);
      return found;
    }
    if (versions.more) throw new AscApiError(`Version list for ${path} was truncated; cannot choose a draft safely.`, 0);
    if (editable.length > 1) throw new AscApiError(`Multiple editable ${kind} drafts: ${editable.map((v) => v.id).join(', ')}. ${kind === 'subscriptionGroupVersions' ? 'Resolve the duplicate group drafts in App Store Connect before checking this group.' : 'Pass version_id.'}`, 0);
    return editable[0] ?? pending[0];
  };
  const groupVersion = await selectDraft(`/v1/subscriptionGroups/${encodeURIComponent(group.id)}/versions`, 'subscriptionGroupVersions', groupTruncated);
  const groupLocs = groupVersion
    ? await page(`/v1/subscriptionGroupVersions/${encodeURIComponent(groupVersion.id)}/localizations`, 200, groupTruncated, {
      'fields[subscriptionGroupLocalizations]': 'locale,name',
    })
    : { rows: [], more: false };
  const groupFindings: SubscriptionFinding[] = [];
  const groupVersions = versionStates.get(`/v1/subscriptionGroups/${encodeURIComponent(group.id)}/versions`) ?? [];
  const approvedGroupExists = groupVersions.some((v) => APPROVED_STATES.has(v.state));
  if (!groupVersion && !approvedGroupExists) {
    groupFindings.push({ check: 'group version', severity: 'blocking', problem: 'The group has no editable draft version; in-review and approved versions are separate.', fixWith: 'subscription_group_versions__create' });
  }
  if (groupVersion && !['PREPARE_FOR_SUBMISSION', 'READY_FOR_REVIEW', 'DEVELOPER_REJECTED'].includes(groupVersion.attributes?.state)) {
    groupFindings.push({ check: 'group version state', severity: approvedGroupExists ? 'warning' : 'blocking',
      problem: `Group version ${groupVersion.id} is ${groupVersion.attributes?.state}. Resolve the rejection or wait for review in App Store Connect; reuse this version.`, fixWith: 'subscription_group_versions__get' });
  } else if (groupVersion && !groupLocs.rows.length && !groupLocs.more) {
    groupFindings.push({ check: 'group localizations', severity: 'blocking', problem: 'The group draft has no localization.', fixWith: 'subscription_group_localizations_v2__create' });
  }
  for (const loc of groupLocs.rows) {
    if (!String(loc.attributes?.name ?? '').trim()) {
      groupFindings.push({ check: 'group localizations', severity: 'blocking', problem: `Group localization ${loc.attributes?.locale ?? loc.id} has no display name.`, fixWith: 'subscription_group_localizations_v2__update' });
    }
  }
  if (groupMode && !selected.length && !subscriptionsTruncated) {
    groupFindings.push({ check: 'subscriptions', severity: 'blocking', problem: 'The subscription group has no subscriptions.', fixWith: 'subscriptions__create' });
  }

  const subscriptions = [];
  for (const sub of selected) {
    const findings: SubscriptionFinding[] = [...groupFindings];
    const notes: string[] = [...groupTruncated];
    const add = (check: string, severity: SubscriptionFinding['severity'], problem: string, fixWith: string) =>
      findings.push({ check, severity, problem, fixWith });
    const base = `/v1/subscriptions/${encodeURIComponent(sub.id)}`;
    const a = sub.attributes ?? {};
    for (const field of ['name', 'productId', 'subscriptionPeriod']) {
      if (!String(a[field] ?? '').trim()) {
        add(field, 'blocking', `Subscription ${field} is missing.`, field === 'productId' ? 'subscriptions__create' : 'subscriptions__update');
      }
    }
    // False is a valid answer. Neither family sharing nor review notes is
    // required by the create schema, so absence alone is only a warning.
    if (a.familySharable == null) add('family sharing', 'warning', 'Subscription familySharable is unset.', 'subscriptions__update');
    if (!String(a.reviewNote ?? '').trim()) add('review note', 'warning', 'Subscription reviewNote is empty.', 'subscriptions__update');

    const selectedVersion = await selectDraft(`${base}/versions`, 'subscriptionVersions', notes,
      typeof args.version_id === 'string' ? args.version_id : undefined);
    if (!selectedVersion) {
      add('version', 'blocking', 'No editable draft version; in-review and approved versions are reported separately.', 'subscription_versions__create');
    } else if (!['PREPARE_FOR_SUBMISSION', 'READY_FOR_REVIEW', 'DEVELOPER_REJECTED'].includes(selectedVersion.attributes?.state)) {
      add('version state', 'blocking', `Version ${selectedVersion.id} is ${selectedVersion.attributes?.state}. Resolve the rejection or wait for review in App Store Connect; reuse this version.`, 'subscription_versions__get');
    }
    const locs = selectedVersion
      ? await page(`/v1/subscriptionVersions/${encodeURIComponent(selectedVersion.id)}/localizations`, 200, notes, {
        'fields[subscriptionLocalizations]': 'locale,name,description',
      })
      : { rows: [], more: false };
    if (selectedVersion && !locs.rows.length && !locs.more) {
      add('localizations', 'blocking', 'The subscription draft has no localization with a display name and description.', 'subscription_localizations_v2__create');
    }
    for (const loc of locs.rows) {
      const missing = ['name', 'description'].filter((f) => !String(loc.attributes?.[f] ?? '').trim());
      if (missing.length) add('localizations', 'blocking', `Localization ${loc.attributes?.locale ?? loc.id} is missing ${missing.join(' and ')}.`, 'subscription_localizations_v2__update');
    }
    if (selectedVersion && !locs.more) {
      const locales = new Set(locs.rows.map((l) => l.attributes?.locale));
      const missing = [...new Set(groupLocs.rows.map((l) => l.attributes?.locale))].filter((l) => l && !locales.has(l));
      if (missing.length) add('locale coverage', 'warning', `Group locales missing on the subscription: ${missing.join(', ')}.`, 'subscription_localizations_v2__create');
    }

    const prices = await page(`${base}/prices`, 1, notes, { 'fields[subscriptionPrices]': 'startDate' }, true);
    if (!prices.rows.length && !prices.more) add('price', 'blocking', 'The subscription has no price in any territory.', 'subscription_prices__create');

    const plans = await page(`${base}/planAvailabilities`, 5, notes, { 'fields[subscriptionPlanAvailabilities]': 'planType' });
    if (!plans.rows.length && !plans.more) {
      add('availability', 'blocking', 'The subscription has no plan availability.', 'subscription_plan_availabilities__create');
    } else if (plans.rows.length) {
      let hasTerritory = false;
      let incomplete = plans.more;
      for (const plan of plans.rows) {
        const territories = await page(`/v1/subscriptionPlanAvailabilities/${encodeURIComponent(plan.id)}/availableTerritories`, 1, notes, {}, true);
        hasTerritory ||= territories.rows.length > 0;
        incomplete ||= territories.more;
      }
      if (!hasTerritory && !incomplete) add('territories', 'blocking', 'No subscription plan availability has an available territory.', 'subscription_plan_availabilities__available_territories__replace');
    }

    let screenshot: any;
    try {
      screenshot = await http.get(`${base}/appStoreReviewScreenshot`, {
        'fields[subscriptionAppStoreReviewScreenshots]': 'assetDeliveryState',
      });
    } catch (err) {
      // Apple can represent an absent to-one relation with 404 or data:null.
      // Permission, network and server failures must remain errors, not gaps.
      if (!(err instanceof AscApiError) || err.status !== 404) throw err;
    }
    if (!screenshot?.data) add('review screenshot', 'blocking', 'The subscription has no App Store review screenshot. Upload with target subscription_review_screenshot and page_id set to the subscription ID.', 'media__upload');
    else if (screenshot.data.attributes?.assetDeliveryState?.state === 'FAILED') {
      add('review screenshot', 'blocking', 'The App Store review screenshot failed asset delivery. Upload with target subscription_review_screenshot and page_id set to the subscription ID.', 'media__upload');
    }
    subscriptions.push({
      id: String(sub.id), productId: String(a.productId ?? ''), name: String(a.name ?? ''),
      state: String(a.state ?? 'UNKNOWN'),
      version: selectedVersion ? { id: String(selectedVersion.id), number: Number(selectedVersion.attributes?.version), state: String(selectedVersion.attributes?.state) } : null,
      otherVersions: (versionStates.get(`${base}/versions`) ?? []).filter((v) => v.id !== selectedVersion?.id),
      ready: !findings.some((f) => f.severity === 'blocking') && !notes.length && !truncated.length,
      findings, truncated: notes,
    });
  }
  return {
    app: `${app.name} (${app.id})`, subscriptions,
    ...(groupMode ? { group: {
      id: String(group.id), referenceName: String(group.attributes?.referenceName ?? ''),
      version: groupVersion ? { id: String(groupVersion.id), number: Number(groupVersion.attributes?.version), state: String(groupVersion.attributes?.state) } : null,
      otherVersions: (versionStates.get(`/v1/subscriptionGroups/${encodeURIComponent(group.id)}/versions`) ?? []).filter((v) => v.id !== groupVersion?.id),
      ready: !groupFindings.some((f) => f.severity === 'blocking') && subscriptions.every((s) => s.ready) && !groupTruncated.length && !truncated.length,
      checkedSubscriptions: subscriptions.length, findings: groupFindings, truncated: groupTruncated,
    } } : {}),
    truncated,
    note: 'Checks editable v2 version drafts. In-review and approved versions are separate from the draft. Truncated reads cannot be ready. Price and territory reads establish presence only, not an active price in every storefront. Apple approval is not predicted.',
  };
}
