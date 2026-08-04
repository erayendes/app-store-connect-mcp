import { describe, it, expect, vi } from 'vitest';
import {
  SCREENSHOT_TOOLS,
  executeScreenshotTool,
  type ScreenshotContext,
} from '../src/tools/screenshots.js';

/**
 * A listing with fifty locales and screenshots in exactly one of them — the
 * live shape. Walking it with the raw tools takes 53 calls to learn that, and
 * the localizations response alone is 264 KB before any of them.
 */
function fakeHttp() {
  const locales = Array.from({ length: 50 }, (_, i) => `loc-${i}`);
  const get = vi.fn(async (path: string, query?: any) => {
    if (path === '/v1/apps') {
      return { data: [{ id: '6636549188', attributes: { name: 'Ask Quran', bundleId: 'com.milowda.askquranai' } }] };
    }
    // Matched before /appStoreVersions — the localizations path contains it.
    if (path.includes('/appStoreVersionLocalizations')) {
      return {
        data: locales.map((id, i) => ({
          id,
          attributes: { locale: i === 0 ? 'en-US' : `xx-${i}` },
          relationships: { appScreenshotSets: { data: i === 0 ? [{ id: 'set-1' }] : [] } },
        })),
        included: [
          { type: 'appScreenshotSets', id: 'set-1', attributes: { screenshotDisplayType: 'APP_IPHONE_67' } },
        ],
      };
    }
    if (path.includes('/appStoreVersions')) {
      return {
        data: [
          { id: 'v-161', attributes: { versionString: '1.6.1', appStoreState: 'READY_FOR_SALE' } },
          { id: 'v-160', attributes: { versionString: '1.6.0', appStoreState: 'REPLACED_WITH_NEW_VERSION' } },
        ],
      };
    }
    if (path.includes('/appScreenshots')) {
      return {
        data: [
          {
            id: 'shot-1',
            attributes: {
              fileName: 'one.png',
              imageAsset: { width: 1320, height: 2868 },
              assetDeliveryState: { state: 'COMPLETE' },
            },
          },
        ],
      };
    }
    return {};
  });
  return { get };
}

const ctx = (): ScreenshotContext & { http: any } => ({ http: fakeHttp() }) as any;
const run = (args: Record<string, unknown>, c = ctx()) =>
  executeScreenshotTool('listing__get_screenshots', args, c);

describe('listing__get_screenshots', () => {
  it('answers in four calls, not one per locale', async () => {
    const c = ctx();
    await run({ app: 'com.milowda.askquranai' }, c);
    expect(c.http.get).toHaveBeenCalledTimes(4);
  });

  /**
   * The include is what makes that possible. Without it the relationship comes
   * back as a link and every one of the fifty locales costs a round trip to
   * learn it has nothing.
   */
  it('asks for the screenshot sets in the same call as the locales', async () => {
    const c = ctx();
    await run({ app: 'com.milowda.askquranai' }, c);
    const call = c.http.get.mock.calls.find(([p]: [string]) => p.includes('/appStoreVersionLocalizations'));
    expect(call?.[1]).toMatchObject({ include: 'appScreenshotSets' });
    expect(call?.[1]['fields[appStoreVersionLocalizations]']).toContain('locale');
  });

  it('returns the sizes, and only the locales that carry their own', async () => {
    const result: any = await run({ app: 'com.milowda.askquranai' });
    expect(result.version).toBe('1.6.1');
    expect(result.locales).toHaveLength(1);
    expect(result.locales[0]).toMatchObject({ locale: 'en-US' });
    expect(result.locales[0].sets[0]).toMatchObject({ displayType: 'APP_IPHONE_67', count: 1 });
    expect(result.locales[0].sets[0].screenshots[0]).toMatchObject({ width: 1320, height: 2868 });
  });

  /**
   * Forty-nine locales with no sets are not forty-nine problems — they inherit
   * from the primary locale. A bare count would read as missing artwork.
   */
  it('says the other locales inherit rather than lack', async () => {
    const result: any = await run({ app: 'com.milowda.askquranai' });
    expect(result.localesWithOwnScreenshots).toMatch(/1 of 50/);
    expect(result.localesWithOwnScreenshots).toMatch(/inherit/);
  });

  it('narrows to one locale on request', async () => {
    const result: any = await run({ app: 'com.milowda.askquranai', locale: 'en-US' });
    expect(result.locales).toHaveLength(1);
    const empty: any = await run({ app: 'com.milowda.askquranai', locale: 'de-DE' });
    expect(empty.locales).toHaveLength(0);
    expect(empty.note).toMatch(/no screenshots of its own/);
  });

  it('picks a named version and lists the choices when it is missing', async () => {
    const older: any = await run({ app: 'com.milowda.askquranai', version: '1.6.0' });
    expect(older.version).toBe('1.6.0');
    await expect(run({ app: 'com.milowda.askquranai', version: '9.9' })).rejects.toThrow(/1\.6\.1, 1\.6\.0/);
  });

  it('is marked read-only, so it never asks for a write confirmation', () => {
    const tool = SCREENSHOT_TOOLS.find((t) => t.name === 'listing__get_screenshots');
    expect(tool?.annotations?.readOnlyHint).toBe(true);
  });
});
