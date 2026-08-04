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
 * Read-only. The raw tools stay untouched — this is an opt-in layer, like
 * pricing and reviews-ai.
 */
import type { McpToolDefinition } from '../core/registry.js';
import type { AscHttpClient } from '../core/http.js';
import { AscApiError } from '../core/errors.js';

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
    annotations: { readOnlyHint: true, idempotentHint: true },
  },
];

export const SCREENSHOT_TOOL_NAMES = new Set(SCREENSHOT_TOOLS.map((t) => t.name));

export interface ScreenshotContext {
  http: AscHttpClient;
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

export async function executeScreenshotTool(
  name: string,
  args: Record<string, unknown>,
  ctx: ScreenshotContext
): Promise<unknown> {
  if (name !== 'listing__get_screenshots') {
    throw new Error(`Unknown listing tool: ${name}`);
  }
  if (!args.app || typeof args.app !== 'string') {
    throw new AscApiError('"app" is required.', 0);
  }

  const app = await resolveApp(ctx.http, String(args.app));

  const versions: any = await ctx.http.get(`/v1/apps/${encodeURIComponent(app.id)}/appStoreVersions`, {
    'fields[appStoreVersions]': 'versionString,appStoreState,platform',
    limit: 20,
  });
  const wantedVersion = args.version ? String(args.version).trim() : undefined;
  const version = wantedVersion
    ? (versions?.data ?? []).find((v: any) => v.attributes?.versionString === wantedVersion)
    : versions?.data?.[0];
  if (!version) {
    const available = (versions?.data ?? []).map((v: any) => v.attributes?.versionString).join(', ');
    throw new AscApiError(
      `No version "${wantedVersion}" on this app. Available: ${available || 'none'}.`,
      0
    );
  }

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
