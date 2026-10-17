/**
 * Store-listing macro — the one-call answer to "what screenshots are up?".
 *
 * Asking it through the raw tools is a chain and then a fan-out: app → version
 * → 50 localizations → screenshot sets for each → screenshots for each set.
 * Measured on a live app, that is 53 HTTP calls to discover that one locale of
 * fifty carries any screenshots at all, and the localizations response alone is
 * 264 KB before shaping. Nine agent sessions were recorded on this question and
 * every one of them ended up writing the response to a file and running `jq`
 * over it.
 *
 * Both halves are fixed here rather than explained to the model: the fan-out
 * collapses into one `include`, and the columns are narrowed with `fields`.
 * Measured against the same live app, the whole question costs four calls
 * inside this function — app, versions, every locale with its sets, and one per
 * set that actually holds screenshots — and returns about 1 KB.
 *
 * The write half, `listing__upload_screenshot`, exists for a different reason.
 * Reading is merely expensive through the raw tools; uploading is impossible.
 * Apple's asset flow is reserve → PUT the bytes at server-dictated offsets →
 * commit with an MD5 of the whole file, and only the first and last steps are
 * API calls. `uploadOperations` appears in the generated spec purely as a
 * `fields[...]` enum value: an agent can read the instructions and cannot
 * execute them.
 *
 * Which is why this is code and not documentation. An agent told how the
 * protocol works has to shell out to `curl` against Apple's upload hosts and
 * do byte-offset arithmetic and an MD5 by hand — and `scripts/ax-agent.ts`
 * classifies "called Apple directly" as the second-worst thing a session can
 * do, right after reaching for the private key. Worse, that arithmetic fails
 * silently: a wrong `sourceFileChecksum` leaves the asset stuck in a failed
 * delivery state that only shows up in `listing__get_screenshots`, which is to
 * say we would have shipped the diagnostic for a problem we caused.
 *
 * The raw tools stay untouched — this is an opt-in layer, like pricing and
 * reviews-ai.
 */
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import type { McpToolDefinition } from '../core/registry.js';
import type { AscHttpClient } from '../core/http.js';
import { BODY_SCHEMAS } from '../generated/body-schemas.js';
import { AscApiError } from '../core/errors.js';
import { resolveApp } from '../core/resolve-app.js';

/**
 * Pulled off the generated schema rather than retyped: 33 device sizes that
 * Apple adds to every year, and a hand-copied list goes stale silently — the
 * tool would simply stop offering whatever phone shipped last autumn.
 */
const DISPLAY_TYPES: string[] =
  ((BODY_SCHEMAS['AppScreenshotSetCreateRequest'] as any)?.properties?.data?.properties?.attributes
    ?.properties?.screenshotDisplayType?.enum as string[]) ?? [];

/** Same reasoning for the asset library: Apple's own lists, read off the schema. */
const ASSET_CATEGORIES: string[] =
  ((BODY_SCHEMAS['AppAssetLibraryImageCreateRequest'] as any)?.properties?.data?.properties?.attributes
    ?.properties?.category?.enum as string[]) ?? [];
const PLACEMENT_TYPES: string[] =
  ((BODY_SCHEMAS['AppAssetLibraryPlacementCreateRequest'] as any)?.properties?.data?.properties?.attributes
    ?.properties?.placementType?.enum as string[]) ?? [];

/**
 * Where a placement can go: the relationship name Apple's placement body takes,
 * its JSON:API type, and the argument that carries its id. The version page is
 * also reachable by locale, like the screenshot upload, so it has no id here.
 */
const PLACEMENT_TARGETS = [
  { arg: 'custom_product_page_localization_id', rel: 'appCustomProductPageLocalization', type: 'appCustomProductPageLocalizations' },
  { arg: 'experiment_treatment_localization_id', rel: 'appStoreVersionExperimentTreatmentLocalization', type: 'appStoreVersionExperimentTreatmentLocalizations' },
  { arg: 'app_event_localization_id', rel: 'appEventLocalization', type: 'appEventLocalizations' },
] as const;

export const SCREENSHOT_TOOLS: McpToolDefinition[] = [
  {
    name: 'listing__get_screenshots',
    description:
      'List the screenshots on an app’s store listing in one step: which locales ' +
      'have them, which device sizes, how many, and their dimensions. Give the app ' +
      '(name, bundle ID or Apple ID). Use this instead of chaining app_store_versions ' +
      '/ localizations / screenshot_sets / screenshots — most locales carry no ' +
      'screenshots of their own, so walking that chain costs one call per locale.',
    inputSchema: {
      type: 'object',
      properties: {
        app: {
          type: 'string',
          description: 'App name, bundle ID (com.example.app) or numeric Apple ID.',
        },
        locale: {
          type: 'string',
          description: 'Optional. Restrict to one locale, e.g. en-US or tr.',
        },
        version: {
          type: 'string',
          description:
            'Optional version string, e.g. "2.4". Defaults to the most recent version.',
        },
      },
      required: ['app'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        app: { type: 'string', description: 'Resolved app, as "Name (id)".' },
        version: { type: 'string' },
        state: { type: 'string', description: 'App Store state of that version, e.g. READY_FOR_SALE.' },
        locales: {
          type: 'array',
          description: 'Only locales carrying screenshots of their own; the rest inherit.',
          items: {
            type: 'object',
            properties: {
              locale: { type: 'string' },
              sets: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    displayType: { type: 'string', description: 'Device size, e.g. APP_IPHONE_67.' },
                    count: { type: 'number' },
                    screenshots: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          fileName: { type: ['string', 'null'] },
                          width: { type: ['number', 'null'] },
                          height: { type: ['number', 'null'] },
                          state: { type: ['string', 'null'], description: 'Asset delivery state.' },
                        },
                      },
                    },
                  },
                  required: ['displayType', 'count'],
                },
              },
            },
            required: ['locale', 'sets'],
          },
        },
        localesWithOwnScreenshots: {
          type: 'string',
          description: 'Reads as "1 of 50; the rest inherit from the primary locale".',
        },
        note: { type: 'string', description: 'Present when no locale carries its own screenshots.' },
      },
      required: ['app', 'locales', 'localesWithOwnScreenshots'],
    },
    annotations: { readOnlyHint: true, idempotentHint: true },
  },
  {
    name: 'listing__upload_screenshot',
    description:
      'Upload a screenshot image file to an app’s store listing in one step. Give the app ' +
      '(name, bundle ID or Apple ID), the locale, the device size and a path to the file on ' +
      'this machine. Handles Apple’s reserve/upload/commit sequence and the checksum — the ' +
      // Naming the raw tool here made this the top hit for "create certificate":
      // `app_screenshots__create` carries the token "create", and search matches
      // three-character tokens as substrings. Describe the neighbour, do not name it.
      'raw screenshot tool reserves a slot and moves no bytes. ' +
      'PUBLIC-level write: the image appears on the store listing once Apple processes it.',
    inputSchema: {
      type: 'object',
      properties: {
        app: {
          type: 'string',
          description: 'App name, bundle ID (com.example.app) or numeric Apple ID.',
        },
        locale: {
          type: 'string',
          description: 'Listing locale the screenshot belongs to, e.g. en-US or tr.',
        },
        display_type: {
          type: 'string',
          description:
            'Device size the image is sized for, e.g. APP_IPHONE_67. A wrong one is rejected ' +
            'by Apple on commit, not on upload.',
          ...(DISPLAY_TYPES.length ? { enum: DISPLAY_TYPES } : {}),
        },
        file_path: {
          type: 'string',
          description: 'Absolute path to the PNG or JPEG on this machine.',
        },
        version: {
          type: 'string',
          description: 'Optional version string, e.g. "2.4". Defaults to the most recent version.',
        },
      },
      required: ['app', 'locale', 'display_type', 'file_path'],
    },
    // No outputSchema, like the other write macro: the dry-run result and the
    // live one are different shapes (`wouldSend` versus `screenshotId` and a
    // delivery state), and one schema covering both describes neither.
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  },
  {
    name: 'listing__upload_asset',
    description:
      'Upload an image or video file into an app’s asset library in one step, and optionally ' +
      'place it on a store page in the same call. Give the app, the file path and the category; ' +
      'to place it, add a placement type and either a locale (the version page) or the id of a ' +
      'custom product page, experiment or in-app event localization. Handles Apple’s ' +
      'reserve/upload/commit sequence, which the raw library tools cannot finish. ' +
      'PUBLIC-level write when it places the file; the upload alone shows nowhere.',
    inputSchema: {
      type: 'object',
      properties: {
        app: {
          type: 'string',
          description: 'App name, bundle ID (com.example.app) or numeric Apple ID.',
        },
        file_path: {
          type: 'string',
          description: 'Absolute path to a PNG or JPEG image, or an MP4 or MOV video, on this machine.',
        },
        category: {
          type: 'string',
          description: 'What the file is for in the library.',
          ...(ASSET_CATEGORIES.length ? { enum: ASSET_CATEGORIES } : {}),
        },
        reference_name: {
          type: 'string',
          description: 'Optional name to find the file by in the library. Defaults to the file name.',
        },
        preview_frame_time_code: {
          type: 'string',
          description: 'Videos only, optional: the frame shown before playback, e.g. "00:00:05:00".',
        },
        placement_type: {
          type: 'string',
          description: 'Optional. Place the uploaded file as this. Leave out to upload without placing.',
          ...(PLACEMENT_TYPES.length ? { enum: PLACEMENT_TYPES } : {}),
        },
        placement_group: {
          type: 'string',
          description:
            'Optional placement group, e.g. a device class. The allowed groups per type come from the ' +
            'asset library reference data.',
        },
        locale: {
          type: 'string',
          description: 'Place on this locale of the version page, e.g. en-US or tr.',
        },
        version: {
          type: 'string',
          description: 'With locale: version string, e.g. "2.4". Defaults to the most recent version.',
        },
        custom_product_page_localization_id: {
          type: 'string',
          description: 'Place on this custom product page localization instead.',
        },
        experiment_treatment_localization_id: {
          type: 'string',
          description: 'Place on this product page optimization treatment localization instead.',
        },
        app_event_localization_id: {
          type: 'string',
          description: 'Place on this in-app event localization instead.',
        },
      },
      required: ['app', 'file_path', 'category'],
    },
    // No outputSchema, for the reason given on the screenshot upload.
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  },
];

export const SCREENSHOT_TOOL_NAMES = new Set(SCREENSHOT_TOOLS.map((t) => t.name));

export interface ScreenshotContext {
  http: AscHttpClient;
  dryRun?: boolean;
}

/** One slice Apple wants PUT somewhere, as returned in `uploadOperations`. */
interface UploadOperation {
  method: string;
  url: string;
  offset: number;
  length: number;
  requestHeaders?: Array<{ name?: string; value?: string }>;
}


async function resolveVersion(
  http: AscHttpClient,
  appId: string,
  wanted?: string
): Promise<any> {
  const versions: any = await http.get(`/v1/apps/${encodeURIComponent(appId)}/appStoreVersions`, {
    'fields[appStoreVersions]': 'versionString,appStoreState,platform',
    limit: 20,
  });
  const version = wanted
    ? (versions?.data ?? []).find((v: any) => v.attributes?.versionString === wanted)
    : versions?.data?.[0];
  if (!version) {
    const available = (versions?.data ?? []).map((v: any) => v.attributes?.versionString).join(', ');
    throw new AscApiError(
      `No version "${wanted}" on this app. Available: ${available || 'none'}.`,
      0
    );
  }
  return version;
}

export async function executeScreenshotTool(
  name: string,
  args: Record<string, unknown>,
  ctx: ScreenshotContext
): Promise<unknown> {
  if (name === 'listing__upload_screenshot') return uploadScreenshot(args, ctx);
  if (name === 'listing__upload_asset') return uploadAsset(args, ctx);
  if (name !== 'listing__get_screenshots') {
    throw new Error(`Unknown listing tool: ${name}`);
  }
  if (!args.app || typeof args.app !== 'string') {
    throw new AscApiError('"app" is required.', 0);
  }

  const app = await resolveApp(ctx.http, String(args.app));
  const version = await resolveVersion(
    ctx.http,
    app.id,
    args.version ? String(args.version).trim() : undefined
  );

  // One call for all locales and their sets. Without the include this is a
  // call per locale, and only a handful of locales ever have their own
  // screenshots — the rest inherit, and each costs a round trip to learn that.
  const locs: any = await ctx.http.get(
    `/v1/appStoreVersions/${encodeURIComponent(version.id)}/appStoreVersionLocalizations`,
    {
      'fields[appStoreVersionLocalizations]': 'locale,appScreenshotSets',
      include: 'appScreenshotSets',
      'fields[appScreenshotSets]': 'screenshotDisplayType',
      limit: 200,
    }
  );

  const setType = new Map<string, string>(
    (locs?.included ?? [])
      .filter((i: any) => i.type === 'appScreenshotSets')
      .map((s: any) => [String(s.id), String(s.attributes?.screenshotDisplayType ?? '')])
  );

  const wantedLocale = args.locale ? String(args.locale).trim().toLowerCase() : undefined;
  const carrying = (locs?.data ?? []).filter((l: any) => {
    if (!(l.relationships?.appScreenshotSets?.data ?? []).length) return false;
    return !wantedLocale || String(l.attributes?.locale ?? '').toLowerCase() === wantedLocale;
  });

  const locales: unknown[] = [];
  for (const loc of carrying) {
    const sets = [];
    for (const ref of loc.relationships.appScreenshotSets.data) {
      const shots: any = await ctx.http.get(
        `/v1/appScreenshotSets/${encodeURIComponent(String(ref.id))}/appScreenshots`,
        { 'fields[appScreenshots]': 'fileName,imageAsset,assetDeliveryState', limit: 50 }
      );
      sets.push({
        displayType: setType.get(String(ref.id)) ?? 'unknown',
        count: shots?.data?.length ?? 0,
        screenshots: (shots?.data ?? []).map((s: any) => ({
          fileName: s.attributes?.fileName ?? null,
          // Dimensions live on the asset, not on the screenshot record.
          width: s.attributes?.imageAsset?.width ?? null,
          height: s.attributes?.imageAsset?.height ?? null,
          state: s.attributes?.assetDeliveryState?.state ?? null,
        })),
      });
    }
    locales.push({ locale: loc.attributes?.locale, sets });
  }

  // A locale with no sets of its own is not missing screenshots — it falls back
  // to the primary locale's. Saying so is the difference between an answer and
  // an alarm.
  const total = (locs?.data ?? []).length;
  return {
    app: `${app.name} (${app.id})`,
    version: version.attributes?.versionString,
    state: version.attributes?.appStoreState,
    locales,
    ...(locales.length
      ? {}
      : { note: wantedLocale ? `Locale "${args.locale}" has no screenshots of its own.` : 'No locale has its own screenshots.' }),
    localesWithOwnScreenshots: `${carrying.length} of ${total}; the rest inherit from the primary locale`,
  };
}

/**
 * Reserve → upload → commit, the whole of Apple's asset flow.
 *
 * The three phases are not interchangeable and only the first and last are API
 * calls: `POST /v1/appScreenshots` reserves a row and answers with a list of
 * byte ranges and pre-signed URLs, the bytes go straight to those URLs with the
 * headers Apple supplied, and `PATCH` with `uploaded: true` plus an MD5 of the
 * *whole* file is what tells Apple to accept what it just received.
 *
 * Two failure modes are worth knowing about because neither one raises:
 * skipping the commit leaves a reserved row holding no image, and committing a
 * wrong checksum leaves the asset in a failed delivery state. Both look like
 * success at the call site, which is exactly why this is not a set of
 * instructions for someone else to follow.
 */
/** Apple's own ceiling for a screenshot asset, with room to spare. */
const MAX_SCREENSHOT_BYTES = 50 * 1024 * 1024;

/**
 * The path comes from the model, and everything after this reads the file and
 * PUTs it to Apple. Without a check on the *contents*, `file_path` is a request
 * to exfiltrate any file this process can read — a `.p8`, an SSH key, a config
 * — and Apple rejecting it as not-an-image happens after the bytes have already
 * left. The first eight bytes settle it before any network call.
 */
function assertUploadableImage(bytes: Buffer, filePath: string): void {
  const isPng = bytes
    .subarray(0, 8)
    .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (!isPng && !isJpeg) {
    throw new AscApiError(
      `"${filePath}" is not a PNG or JPEG. Screenshots are uploaded byte for byte, so ` +
        `anything else is refused here rather than sent to Apple to be rejected.`,
      0
    );
  }
  if (bytes.length > MAX_SCREENSHOT_BYTES) {
    throw new AscApiError(
      `"${filePath}" is ${bytes.length} bytes, over the ${MAX_SCREENSHOT_BYTES}-byte limit.`,
      0
    );
  }
}

async function uploadScreenshot(
  args: Record<string, unknown>,
  ctx: ScreenshotContext
): Promise<unknown> {
  for (const key of ['app', 'locale', 'display_type', 'file_path'] as const) {
    if (!args[key] || typeof args[key] !== 'string') {
      throw new AscApiError(`"${key}" is required.`, 0);
    }
  }
  const locale = String(args.locale).trim();
  const displayType = String(args.display_type).trim().toUpperCase();
  const filePath = String(args.file_path).trim();

  if (DISPLAY_TYPES.length && !DISPLAY_TYPES.includes(displayType)) {
    throw new AscApiError(
      `"${displayType}" is not a device size Apple accepts. One of: ${DISPLAY_TYPES.join(', ')}.`,
      0
    );
  }

  // Read before touching the network: a missing file should cost nothing and
  // must never leave a reserved-but-empty screenshot row behind.
  let bytes: Buffer;
  try {
    bytes = await readFile(filePath);
  } catch (err) {
    throw new AscApiError(`Cannot read "${filePath}": ${(err as Error).message}`, 0);
  }
  if (!bytes.length) throw new AscApiError(`"${filePath}" is empty.`, 0);
  assertUploadableImage(bytes, filePath);
  const fileName = basename(filePath);
  const checksum = createHash('md5').update(bytes).digest('hex');

  const app = await resolveApp(ctx.http, String(args.app));
  const version = await resolveVersion(
    ctx.http,
    app.id,
    args.version ? String(args.version).trim() : undefined
  );

  const locs: any = await ctx.http.get(
    `/v1/appStoreVersions/${encodeURIComponent(version.id)}/appStoreVersionLocalizations`,
    { 'fields[appStoreVersionLocalizations]': 'locale', limit: 200 }
  );
  const loc = (locs?.data ?? []).find(
    (l: any) => String(l.attributes?.locale ?? '').toLowerCase() === locale.toLowerCase()
  );
  if (!loc) {
    const have = (locs?.data ?? []).map((l: any) => l.attributes?.locale).join(', ');
    throw new AscApiError(
      `Version ${version.attributes?.versionString} has no "${locale}" localization. ` +
        `It has: ${have || 'none'}. Create one with app_store_version_localizations__create first.`,
      0
    );
  }

  // A device size with no set yet is the normal case for a new screenshot, so
  // create it rather than making the caller discover a second tool.
  const sets: any = await ctx.http.get(
    `/v1/appStoreVersionLocalizations/${encodeURIComponent(loc.id)}/appScreenshotSets`,
    { 'fields[appScreenshotSets]': 'screenshotDisplayType', limit: 100 }
  );
  let set = (sets?.data ?? []).find(
    (s: any) => s.attributes?.screenshotDisplayType === displayType
  );
  const createdSet = !set;

  const resolved = {
    app: `${app.name} (${app.id})`,
    version: version.attributes?.versionString,
    locale: loc.attributes?.locale,
    displayType,
    fileName,
    fileSize: bytes.length,
  };

  if (ctx.dryRun) {
    return {
      dryRun: true,
      note:
        'Dry-run mode: the target was fully resolved but nothing was reserved, uploaded or ' +
        'committed.',
      ...resolved,
      createdSet,
      wouldSend: {
        method: 'POST',
        path: '/v1/appScreenshots',
        body: {
          data: {
            type: 'appScreenshots',
            attributes: { fileName, fileSize: bytes.length },
            relationships: {
              appScreenshotSet: {
                data: { type: 'appScreenshotSets', id: set?.id ?? '(a new set for ' + displayType + ')' },
              },
            },
          },
        },
      },
      risk: 'public',
    };
  }

  if (!set) {
    const made: any = await ctx.http.post('/v1/appScreenshotSets', {
      data: {
        type: 'appScreenshotSets',
        attributes: { screenshotDisplayType: displayType },
        relationships: {
          appStoreVersionLocalization: {
            data: { type: 'appStoreVersionLocalizations', id: loc.id },
          },
        },
      },
    });
    set = made?.data;
    if (!set?.id) throw new AscApiError(`Could not create a ${displayType} screenshot set.`, 0);
  }

  // Phase 1 — reserve. The response, not the request, decides how the bytes
  // are cut up.
  const reserved: any = await ctx.http.post('/v1/appScreenshots', {
    data: {
      type: 'appScreenshots',
      attributes: { fileName, fileSize: bytes.length },
      relationships: {
        appScreenshotSet: { data: { type: 'appScreenshotSets', id: set.id } },
      },
    },
  });
  const screenshotId: string = reserved?.data?.id;
  const operations: UploadOperation[] = reserved?.data?.attributes?.uploadOperations ?? [];
  if (!screenshotId) throw new AscApiError('Apple reserved no screenshot id.', 0);
  if (!operations.length) {
    throw new AscApiError(
      `Apple returned no uploadOperations for "${fileName}", so there is nowhere to send the ` +
        `bytes. The reserved screenshot ${screenshotId} holds no image — delete it with ` +
        `app_screenshots__delete.`,
      0
    );
  }

  // Phase 2 — the bytes, in the slices Apple asked for. Sequential on purpose:
  // these are large bodies and the point of the macro is a predictable upload,
  // not the fastest one.
  for (const op of operations) {
    const start = op.offset ?? 0;
    const end = start + (op.length ?? bytes.length);
    await ctx.http.uploadAssetPart(op, bytes.subarray(start, end));
  }

  // Phase 3 — commit. Without this the row stays reserved and empty; with the
  // wrong checksum the asset lands in a failed delivery state.
  const committed: any = await ctx.http.patch(
    `/v1/appScreenshots/${encodeURIComponent(screenshotId)}`,
    {
      data: {
        type: 'appScreenshots',
        id: screenshotId,
        attributes: { uploaded: true, sourceFileChecksum: checksum },
      },
    }
  );

  return {
    ok: true,
    ...resolved,
    screenshotId,
    parts: operations.length,
    createdSet,
    deliveryState: committed?.data?.attributes?.assetDeliveryState?.state ?? null,
    note:
      'Uploaded and committed. Apple processes the image asynchronously — check the delivery ' +
      'state with listing__get_screenshots; anything other than COMPLETE means it is still ' +
      'being processed or was rejected.',
  };
}

/** Apple's own ceiling for an App Store preview video, which the library shares. */
const MAX_VIDEO_BYTES = 500 * 1024 * 1024;

/**
 * Image or video, from the first bytes, for the same reason the screenshot
 * upload checks them: `file_path` comes from the model, and without this it
 * would send any file this process can read. MP4 and MOV both carry `ftyp`
 * at byte 4.
 */
function assetKind(bytes: Buffer, filePath: string): 'image' | 'video' {
  if (bytes.subarray(4, 8).toString('latin1') === 'ftyp') {
    if (bytes.length > MAX_VIDEO_BYTES) {
      throw new AscApiError(`"${filePath}" is ${bytes.length} bytes, over the ${MAX_VIDEO_BYTES}-byte limit.`, 0);
    }
    return 'video';
  }
  try {
    assertUploadableImage(bytes, filePath);
  } catch {
    throw new AscApiError(
      `"${filePath}" is not a PNG, JPEG, MP4 or MOV file. The asset library takes images and videos ` +
        `only, so anything else is refused here rather than sent to Apple.`,
      0
    );
  }
  return 'image';
}

/**
 * Reserve → upload → commit into the asset library, then optionally place.
 *
 * The same three phases as a screenshot, with two differences in Apple's API:
 * the commit takes `uploaded: true` and no checksum, and the reserved file
 * belongs to the app's library rather than to a page. Placing it is a separate
 * resource, so an upload that worked and a placement that failed are reported
 * apart — the file is in the library either way.
 */
async function uploadAsset(args: Record<string, unknown>, ctx: ScreenshotContext): Promise<unknown> {
  for (const key of ['app', 'file_path', 'category'] as const) {
    if (!args[key] || typeof args[key] !== 'string') {
      throw new AscApiError(`"${key}" is required.`, 0);
    }
  }
  const filePath = String(args.file_path).trim();
  const category = String(args.category).trim().toUpperCase();
  if (ASSET_CATEGORIES.length && !ASSET_CATEGORIES.includes(category)) {
    throw new AscApiError(`"${category}" is not a category Apple accepts. One of: ${ASSET_CATEGORIES.join(', ')}.`, 0);
  }

  const placementType = args.placement_type ? String(args.placement_type).trim().toUpperCase() : undefined;
  const targetArgs = PLACEMENT_TARGETS.filter((t) => typeof args[t.arg] === 'string' && String(args[t.arg]).trim());
  const locale = args.locale ? String(args.locale).trim() : undefined;
  const targetCount = targetArgs.length + (locale ? 1 : 0);
  if (placementType) {
    if (PLACEMENT_TYPES.length && !PLACEMENT_TYPES.includes(placementType)) {
      throw new AscApiError(`"${placementType}" is not a placement type Apple accepts. One of: ${PLACEMENT_TYPES.join(', ')}.`, 0);
    }
    if (targetCount !== 1) {
      throw new AscApiError(
        'To place the file, give exactly one target: locale (the version page) or one of ' +
          `${PLACEMENT_TARGETS.map((t) => t.arg).join(', ')}.`,
        0
      );
    }
  } else if (targetCount) {
    throw new AscApiError('A placement target was given without placement_type. Add one, or leave the target out to upload only.', 0);
  }

  // Read before touching the network: a bad file must not leave a reserved,
  // empty asset behind in the library.
  let bytes: Buffer;
  try {
    bytes = await readFile(filePath);
  } catch (err) {
    throw new AscApiError(`Cannot read "${filePath}": ${(err as Error).message}`, 0);
  }
  if (!bytes.length) throw new AscApiError(`"${filePath}" is empty.`, 0);
  const kind = assetKind(bytes, filePath);
  const fileName = basename(filePath);

  const app = await resolveApp(ctx.http, String(args.app));
  const library: any = await ctx.http.get(`/v1/apps/${encodeURIComponent(app.id)}/assetLibrary`, {});
  const libraryId: string | undefined = library?.data?.id;
  if (!libraryId) throw new AscApiError(`${app.name} has no asset library Apple will hand out.`, 0);

  let target: { rel: string; type: string; id: string; label: string } | undefined;
  if (placementType && locale) {
    const version = await resolveVersion(ctx.http, app.id, args.version ? String(args.version).trim() : undefined);
    const locs: any = await ctx.http.get(
      `/v1/appStoreVersions/${encodeURIComponent(version.id)}/appStoreVersionLocalizations`,
      { 'fields[appStoreVersionLocalizations]': 'locale', limit: 200 }
    );
    const loc = (locs?.data ?? []).find(
      (l: any) => String(l.attributes?.locale ?? '').toLowerCase() === locale.toLowerCase()
    );
    if (!loc) {
      const have = (locs?.data ?? []).map((l: any) => l.attributes?.locale).join(', ');
      throw new AscApiError(`Version ${version.attributes?.versionString} has no "${locale}" localization. It has: ${have || 'none'}.`, 0);
    }
    target = {
      rel: 'appStoreVersionLocalization',
      type: 'appStoreVersionLocalizations',
      id: loc.id,
      label: `version ${version.attributes?.versionString}, ${loc.attributes?.locale}`,
    };
  } else if (placementType) {
    const t = targetArgs[0];
    target = { rel: t.rel, type: t.type, id: String(args[t.arg]).trim(), label: `${t.type} ${String(args[t.arg]).trim()}` };
  }

  const collection = kind === 'image' ? 'appAssetLibraryImages' : 'appAssetLibraryVideos';
  const attributes: Record<string, unknown> = { fileName, fileSize: bytes.length, category };
  if (args.reference_name) attributes.referenceName = String(args.reference_name);
  if (kind === 'video' && args.preview_frame_time_code) attributes.previewFrameTimeCode = String(args.preview_frame_time_code);
  const reserveBody = {
    data: {
      type: collection,
      attributes,
      relationships: { assetLibrary: { data: { type: 'appAssetLibraries', id: libraryId } } },
    },
  };
  const placementBody = (assetId: string) => ({
    data: {
      type: 'appAssetLibraryPlacements',
      attributes: {
        placementType,
        ...(args.placement_group ? { placementGroup: String(args.placement_group) } : {}),
      },
      relationships: {
        [kind]: { data: { type: collection, id: assetId } },
        [target!.rel]: { data: { type: target!.type, id: target!.id } },
      },
    },
  });

  const resolved = {
    app: `${app.name} (${app.id})`,
    kind,
    fileName,
    fileSize: bytes.length,
    category,
    ...(target ? { placeAs: placementType, placeOn: target.label } : {}),
  };

  if (ctx.dryRun) {
    return {
      dryRun: true,
      note: 'Dry-run mode: the library and target were resolved but nothing was reserved, uploaded, committed or placed.',
      ...resolved,
      wouldSend: [
        { method: 'POST', path: `/v1/${collection}`, body: reserveBody },
        ...(target ? [{ method: 'POST', path: '/v1/appAssetLibraryPlacements', body: placementBody('(the new asset)') }] : []),
      ],
      risk: target ? 'public' : 'low',
    };
  }

  // Phase 1 — reserve.
  const reserved: any = await ctx.http.post(`/v1/${collection}`, reserveBody);
  const assetId: string = reserved?.data?.id;
  const operations: UploadOperation[] = reserved?.data?.attributes?.uploadOperations ?? [];
  if (!assetId) throw new AscApiError('Apple reserved no asset id.', 0);
  if (!operations.length) {
    throw new AscApiError(
      `Apple returned no uploadOperations for "${fileName}", so there is nowhere to send the bytes. ` +
        `The reserved ${kind} ${assetId} holds nothing — delete it from the asset library.`,
      0
    );
  }

  // Phase 2 — the bytes, in Apple's slices, one after another.
  for (const op of operations) {
    const start = op.offset ?? 0;
    const end = start + (op.length ?? bytes.length);
    await ctx.http.uploadAssetPart(op, bytes.subarray(start, end));
  }

  // Phase 3 — commit. The library takes no checksum, unlike a screenshot.
  const committed: any = await ctx.http.patch(`/v1/${collection}/${encodeURIComponent(assetId)}`, {
    data: { type: collection, id: assetId, attributes: { uploaded: true } },
  });
  const uploaded = {
    ok: true,
    ...resolved,
    assetId,
    parts: operations.length,
    state: committed?.data?.attributes?.state ?? null,
  };
  if (!target) {
    return {
      ...uploaded,
      note: 'Uploaded and committed to the asset library. Apple processes and reviews it; it shows nowhere until it is placed.',
    };
  }

  try {
    const placed: any = await ctx.http.post('/v1/appAssetLibraryPlacements', placementBody(assetId));
    return {
      ...uploaded,
      placementId: placed?.data?.id ?? null,
      placementState: placed?.data?.attributes?.state ?? null,
      note: 'Uploaded, committed and placed. Apple reviews the asset before customers see it.',
    };
  } catch (err) {
    // The upload stands; only the placement failed. Say which, so a retry
    // places the asset instead of uploading a second copy.
    return {
      ...uploaded,
      placed: false,
      placementError: err instanceof Error ? err.message : String(err),
      note: `The ${kind} is in the asset library (${assetId}) but was not placed. Place it with the asset library placement tool rather than uploading again.`,
    };
  }
}
