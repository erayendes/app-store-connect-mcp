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

/**
 * Pulled off the generated schema rather than retyped: 33 device sizes that
 * Apple adds to every year, and a hand-copied list goes stale silently — the
 * tool would simply stop offering whatever phone shipped last autumn.
 */
const DISPLAY_TYPES: string[] =
  ((BODY_SCHEMAS['AppScreenshotSetCreateRequest'] as any)?.properties?.data?.properties?.attributes
    ?.properties?.screenshotDisplayType?.enum as string[]) ?? [];

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

async function resolveApp(http: AscHttpClient, app: string): Promise<{ id: string; name: string }> {
  const wanted = app.trim();
  if (/^\d+$/.test(wanted)) {
    const res: any = await http.get(`/v1/apps/${encodeURIComponent(wanted)}`, {
      'fields[apps]': 'name,bundleId',
    });
    if (!res?.data) throw new AscApiError(`No app with Apple ID ${wanted}.`, 0);
    return { id: res.data.id, name: res.data.attributes?.name ?? wanted };
  }
  const res: any = await http.get('/v1/apps', {
    ...(wanted.includes('.') ? { 'filter[bundleId]': wanted } : { limit: 200 }),
    'fields[apps]': 'name,bundleId',
  });
  const hits = wanted.includes('.')
    ? (res?.data ?? [])
    : (res?.data ?? []).filter((a: any) =>
        String(a.attributes?.name ?? '').toLowerCase().includes(wanted.toLowerCase())
      );
  if (!hits.length) throw new AscApiError(`No app matching "${wanted}".`, 0);
  if (hits.length > 1) {
    throw new AscApiError(
      `"${wanted}" is ambiguous: ${hits.map((h: any) => h.attributes?.name).join(' | ')}. ` +
        `Use the bundle ID or Apple ID.`,
      0
    );
  }
  return { id: hits[0].id, name: hits[0].attributes?.name ?? wanted };
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
