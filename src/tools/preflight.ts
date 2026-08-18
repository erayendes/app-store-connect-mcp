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
import type { AscHttpClient } from '../core/http.js';
import { AscApiError } from '../core/errors.js';
import { resolveApp } from '../core/resolve-app.js';

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
      },
      required: ['app'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        app: { type: 'string' },
        version: { type: 'string' },
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
      },
      required: ['app', 'ready', 'blocking', 'warnings', 'checked'],
    },
    annotations: { readOnlyHint: true },
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
const EDITABLE_STATES = new Set([
  'PREPARE_FOR_SUBMISSION',
  'DEVELOPER_REJECTED',
  'REJECTED',
  'METADATA_REJECTED',
  'INVALID_BINARY',
  'WAITING_FOR_EXPORT_COMPLIANCE',
]);

interface Gap {
  check: string;
  problem: string;
  fixWith: string;
}

export async function executePreflightTool(
  name: string,
  args: Record<string, unknown>,
  ctx: { http: AscHttpClient }
): Promise<unknown> {
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
  const versions: any = await http.get(`/v1/apps/${encodeURIComponent(app.id)}/appStoreVersions`, {
    'fields[appStoreVersions]': 'versionString,appStoreState,platform,copyright,build,appStoreReviewDetail',
    include: 'build,appStoreReviewDetail',
    'fields[builds]': 'version,processingState,expired,usesNonExemptEncryption',
    'fields[appStoreReviewDetails]':
      'contactFirstName,contactLastName,contactPhone,contactEmail,demoAccountName,demoAccountPassword,demoAccountRequired,notes',
    limit: 20,
  });

  const wanted = args.version ? String(args.version).trim() : undefined;
  const all = versions?.data ?? [];
  const version = wanted
    ? all.find((v: any) => String(v.attributes?.versionString ?? '') === wanted)
    : (all.find((v: any) => EDITABLE_STATES.has(String(v.attributes?.appStoreState ?? ''))) ??
      all[0]);

  if (!version) {
    throw new AscApiError(
      wanted
        ? `${app.name} has no version "${wanted}". Found: ${all.map((v: any) => v.attributes?.versionString).join(', ') || 'none'}.`
        : `${app.name} has no App Store versions.`,
      0
    );
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
  // Only the locales that carry their own sets are worth walking: the rest
  // inherit from the primary locale, so an empty relationship is not a gap.
  // One locale settles whether the version has screenshots at all, which is the
  // question a preflight can answer — Apple's *required* device sizes are
  // policy, not API, and a hardcoded list of them goes stale every autumn.
  checked.push('screenshots exist');
  const withSets = localizations.filter(
    (l) => (l.relationships?.appScreenshotSets?.data ?? []).length
  );
  if (!withSets.length) {
    blocking.push({
      check: 'screenshots',
      problem: 'No locale has any screenshot set.',
      fixWith: 'listing__upload_screenshot',
    });
  } else {
    const setIds: string[] = withSets[0].relationships.appScreenshotSets.data.map((r: any) =>
      String(r.id)
    );
    let images = 0;
    for (const id of setIds) {
      const shots: any = await http.get(
        `/v1/appScreenshotSets/${encodeURIComponent(id)}/appScreenshots`,
        { 'fields[appScreenshots]': 'assetDeliveryState', limit: 50 }
      );
      images += (shots?.data ?? []).length;
      const failed = (shots?.data ?? []).filter(
        (s: any) => s.attributes?.assetDeliveryState?.state === 'FAILED'
      ).length;
      if (failed) {
        blocking.push({
          check: 'screenshots',
          problem: `${failed} screenshot(s) in ${withSets[0].attributes?.locale} failed to deliver and will not appear.`,
          fixWith: 'listing__upload_screenshot (re-upload; check listing__get_screenshots first)',
        });
      }
    }
    if (!images) {
      blocking.push({
        check: 'screenshots',
        problem: `${withSets[0].attributes?.locale} has ${setIds.length} screenshot set(s) holding no images.`,
        fixWith: 'listing__upload_screenshot',
      });
    }
    if (withSets.length < localizations.length) {
      warnings.push(
        `${withSets.length} of ${localizations.length} locales carry their own screenshots; the rest inherit from the primary locale.`
      );
    }
  }

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
    state,
    ready: blocking.length === 0,
    blocking,
    warnings,
    checked,
  };
}
