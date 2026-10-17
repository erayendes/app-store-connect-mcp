import { describe, it, expect, vi } from 'vitest';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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

/**
 * The upload half. What matters is not that a call was made but that the three
 * phases happened in order and carried the right numbers: a reserve that
 * declares the true byte length, one PUT per slice cut at Apple's offsets, and
 * a commit whose checksum is the MD5 of the whole file. Any of those wrong
 * leaves an asset Apple silently refuses to deliver.
 */
function fakeUploadHttp(operations?: unknown) {
  const puts: Array<{ url: string; length: number; first: number }> = [];
  const http = {
    get: vi.fn(async (path: string) => {
      if (path === '/v1/apps') return { data: [{ id: 'app-1', attributes: { name: 'Ask Quran' } }] };
      // Order matters and the paths nest: the sets path ends in
      // /appScreenshotSets but *contains* /appStoreVersionLocalizations, which
      // in turn contains /appStoreVersions. Longest suffix first.
      if (path.endsWith('/appScreenshotSets'))
        return { data: [{ id: 'set-67', attributes: { screenshotDisplayType: 'APP_IPHONE_67' } }] };
      if (path.includes('/appStoreVersionLocalizations'))
        return { data: [{ id: 'loc-en', attributes: { locale: 'en-US' } }] };
      if (path.includes('/appStoreVersions'))
        return { data: [{ id: 'v-1', attributes: { versionString: '1.6.1' } }] };
      return { data: [] };
    }),
    post: vi.fn(async (path: string, body: any) => {
      if (path === '/v1/appScreenshots') {
        return {
          data: {
            id: 'shot-1',
            attributes: {
              uploadOperations:
                operations ?? [
                  { method: 'PUT', url: 'https://upload.apple.com/a', offset: 0, length: 4 },
                  { method: 'PUT', url: 'https://upload.apple.com/b', offset: 4, length: 3 },
                ],
            },
          },
          _sent: body,
        };
      }
      return { data: { id: 'set-new', attributes: {} } };
    }),
    patch: vi.fn(async () => ({
      data: { attributes: { assetDeliveryState: { state: 'COMPLETE' } } },
    })),
    uploadAssetPart: vi.fn(async (op: any, part: Uint8Array) => {
      puts.push({ url: op.url, length: part.length, first: part[0] });
    }),
  };
  return { http, puts };
}

describe('listing__upload_screenshot', () => {
  const args = {
    app: 'Ask Quran',
    locale: 'en-US',
    display_type: 'APP_IPHONE_67',
    // tmpdir(), not a literal: `/private/tmp` is macOS's real path behind the
    // /tmp symlink and does not exist on Linux, so these three passed on the
    // author's machine and failed every CI runner.
    file_path: join(tmpdir(), 'heimdall-upload-test.jpg'),
  };

  it('reserves, uploads every slice at Apple’s offsets, then commits the MD5', async () => {
    const { writeFile, rm } = await import('node:fs/promises');
    const { createHash } = await import('node:crypto');
    // Real JPEG magic bytes: the upload refuses anything that is not an image,
    // so a fixture of plain text would be rejected before it reached Apple.
    const bytes = Buffer.from([0xff, 0xd8, 0xff, 0x61, 0x62, 0x63, 0x64]);
    await writeFile(args.file_path, bytes);
    try {
      const { http, puts } = fakeUploadHttp();
      const result: any = await executeScreenshotTool(
        'listing__upload_screenshot',
        args,
        { http } as unknown as ScreenshotContext
      );

      // Reserve declares the real size — Apple cuts the slices from this.
      const reserve = http.post.mock.calls.find((c: any[]) => c[0] === '/v1/appScreenshots')!;
      expect(reserve[1].data.attributes.fileSize).toBe(7);
      expect(reserve[1].data.attributes.fileName).toBe('heimdall-upload-test.jpg');
      expect(reserve[1].data.relationships.appScreenshotSet.data.id).toBe('set-67');

      // One PUT per operation, sliced at the offsets Apple gave, not guessed.
      expect(puts).toEqual([
        { url: 'https://upload.apple.com/a', length: 4, first: 0xff },
        { url: 'https://upload.apple.com/b', length: 3, first: 'b'.charCodeAt(0) },
      ]);

      // Commit carries the checksum of the WHOLE file, not of the last slice.
      const commit = http.patch.mock.calls[0];
      expect(commit[0]).toBe('/v1/appScreenshots/shot-1');
      expect(commit[1].data.attributes.uploaded).toBe(true);
      expect(commit[1].data.attributes.sourceFileChecksum).toBe(
        createHash('md5').update(bytes).digest('hex')
      );

      expect(result.ok).toBe(true);
      expect(result.parts).toBe(2);
      expect(result.deliveryState).toBe('COMPLETE');
    } finally {
      await rm(args.file_path, { force: true });
    }
  });

  it('refuses a missing file before reserving anything', async () => {
    const { http } = fakeUploadHttp();
    await expect(
      executeScreenshotTool(
        'listing__upload_screenshot',
        { ...args, file_path: join(tmpdir(), 'heimdall-does-not-exist.png') },
        { http } as unknown as ScreenshotContext
      )
    ).rejects.toThrow(/Cannot read/);
    // The point of reading first: no reserved-but-empty screenshot row.
    expect(http.post).not.toHaveBeenCalled();
  });

  it('says the reserved row is empty when Apple returns nowhere to upload', async () => {
    const { writeFile, rm } = await import('node:fs/promises');
    await writeFile(args.file_path, Buffer.from([0xff, 0xd8, 0xff, 0x61]));
    try {
      const { http } = fakeUploadHttp([]);
      await expect(
        executeScreenshotTool('listing__upload_screenshot', args, { http } as unknown as ScreenshotContext)
      ).rejects.toThrow(/holds no image/);
      expect(http.patch).not.toHaveBeenCalled();
    } finally {
      await rm(args.file_path, { force: true });
    }
  });

  it('refuses a file that is not an image before any of it leaves the machine', async () => {
    // file_path is chosen by the model. Without this check it is a request to
    // upload any readable file — a private key reaches Apple and only then
    // comes back rejected.
    const { writeFile, rm } = await import('node:fs/promises');
    const key = join(tmpdir(), 'heimdall-not-an-image.p8');
    await writeFile(key, '-----BEGIN PRIVATE KEY-----\nnope\n-----END PRIVATE KEY-----\n');
    try {
      const { http, puts } = fakeUploadHttp();
      await expect(
        executeScreenshotTool(
          'listing__upload_screenshot',
          { ...args, file_path: key },
          { http } as unknown as ScreenshotContext
        )
      ).rejects.toThrow(/not a PNG or JPEG/);
      expect(http.post).not.toHaveBeenCalled();
      expect(puts).toEqual([]);
    } finally {
      await rm(key, { force: true });
    }
  });

  it('rejects a device size Apple does not have', async () => {
    const { http } = fakeUploadHttp();
    await expect(
      executeScreenshotTool(
        'listing__upload_screenshot',
        { ...args, display_type: 'APP_IPHONE_99' },
        { http } as unknown as ScreenshotContext
      )
    ).rejects.toThrow(/not a device size/);
  });

  it('dry-run resolves the target and sends nothing', async () => {
    const { writeFile, rm } = await import('node:fs/promises');
    await writeFile(args.file_path, Buffer.from([0xff, 0xd8, 0xff, 0x61]));
    try {
      const { http, puts } = fakeUploadHttp();
      const result: any = await executeScreenshotTool('listing__upload_screenshot', args, {
        http,
        dryRun: true,
      } as unknown as ScreenshotContext);
      expect(result.dryRun).toBe(true);
      expect(result.wouldSend.path).toBe('/v1/appScreenshots');
      expect(http.post).not.toHaveBeenCalled();
      expect(http.patch).not.toHaveBeenCalled();
      expect(puts).toEqual([]);
    } finally {
      await rm(args.file_path, { force: true });
    }
  });
});

/** The asset library's API: one library per app, reserve → PUT → commit, then place. */
function fakeAssetHttp(operations = [{ method: 'PUT', url: 'https://upload.apple.com/x', offset: 0, length: 8 }]) {
  const puts: Array<{ url: string; length: number }> = [];
  const http = {
    get: vi.fn(async (path: string) => {
      if (path === '/v1/apps') return { data: [{ id: 'app-1', attributes: { name: 'Test App', bundleId: 'com.example.test' } }] };
      if (path === '/v1/apps/app-1/assetLibrary') return { data: { id: 'lib-1', type: 'appAssetLibraries' } };
      if (path.includes('/appStoreVersionLocalizations')) return { data: [{ id: 'loc-tr', attributes: { locale: 'tr' } }] };
      if (path.includes('/appStoreVersions')) return { data: [{ id: 'v-1', attributes: { versionString: '1.0' } }] };
      return {};
    }),
    post: vi.fn(async (path: string, body: any) => {
      if (path === '/v1/appAssetLibraryPlacements') return { data: { id: 'pl-1', attributes: { state: 'PENDING' } } };
      return { data: { id: `${body.data.type}-1`, attributes: { uploadOperations: operations } } };
    }),
    patch: vi.fn(async (path: string) => ({ data: { id: path.split('/').pop(), attributes: { state: 'UPLOAD_COMPLETE' } } })),
    uploadAssetPart: vi.fn(async (op: { url: string }, part: Buffer) => {
      puts.push({ url: op.url, length: part.length });
    }),
  };
  return { http, puts };
}

describe('listing__upload_asset', () => {
  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const file = join(tmpdir(), 'heimdall-asset-test.png');
  const base = { app: 'Test App', file_path: file, category: 'CREATIVE_ASSETS' };
  const withFile = async (bytes: Buffer, body: () => Promise<void>) => {
    const { writeFile, rm } = await import('node:fs/promises');
    await writeFile(file, bytes);
    try { await body(); } finally { await rm(file, { force: true }); }
  };

  it('is a write, offered beside the screenshot upload', () => {
    const tool = SCREENSHOT_TOOLS.find((t) => t.name === 'listing__upload_asset')!;
    expect(tool.annotations?.readOnlyHint).toBe(false);
    expect((tool.inputSchema.properties as any).category.enum).toContain('CREATIVE_ASSETS');
    expect((tool.inputSchema.properties as any).placement_type.enum).toContain('APP_SCREENSHOT');
  });

  it('reserves in the app’s library, uploads, and commits without a checksum', async () => {
    await withFile(png, async () => {
      const { http, puts } = fakeAssetHttp();
      const result: any = await executeScreenshotTool('listing__upload_asset', base, { http } as unknown as ScreenshotContext);
      const reserve = http.post.mock.calls[0];
      expect(reserve[0]).toBe('/v1/appAssetLibraryImages');
      expect(reserve[1].data.attributes).toEqual({ fileName: 'heimdall-asset-test.png', fileSize: 8, category: 'CREATIVE_ASSETS' });
      expect(reserve[1].data.relationships.assetLibrary.data.id).toBe('lib-1');
      expect(puts).toEqual([{ url: 'https://upload.apple.com/x', length: 8 }]);
      const commit = http.patch.mock.calls[0];
      expect(commit[0]).toBe('/v1/appAssetLibraryImages/appAssetLibraryImages-1');
      expect(commit[1].data.attributes).toEqual({ uploaded: true });
      // No target: nothing is placed, so nothing reaches a store page.
      expect(http.post).toHaveBeenCalledTimes(1);
      expect(result.state).toBe('UPLOAD_COMPLETE');
    });
  });

  it('places the upload on a version locale when asked', async () => {
    await withFile(png, async () => {
      const { http } = fakeAssetHttp();
      const result: any = await executeScreenshotTool(
        'listing__upload_asset',
        { ...base, placement_type: 'APP_SCREENSHOT', locale: 'tr' },
        { http } as unknown as ScreenshotContext
      );
      const place = http.post.mock.calls[1];
      expect(place[0]).toBe('/v1/appAssetLibraryPlacements');
      expect(place[1].data.attributes.placementType).toBe('APP_SCREENSHOT');
      expect(place[1].data.relationships.image.data.id).toBe('appAssetLibraryImages-1');
      expect(place[1].data.relationships.appStoreVersionLocalization.data.id).toBe('loc-tr');
      expect(result.placementId).toBe('pl-1');
    });
  });

  it('treats an MP4 as a video', async () => {
    const mp4 = Buffer.concat([Buffer.from([0, 0, 0, 0x18]), Buffer.from('ftypisom')]);
    await withFile(mp4, async () => {
      const { http } = fakeAssetHttp([{ method: 'PUT', url: 'https://upload.apple.com/v', offset: 0, length: 12 }]);
      await executeScreenshotTool('listing__upload_asset', base, { http } as unknown as ScreenshotContext);
      expect(http.post.mock.calls[0][0]).toBe('/v1/appAssetLibraryVideos');
    });
  });

  it('refuses a file that is neither image nor video before any network call', async () => {
    await withFile(Buffer.from('-----BEGIN PRIVATE KEY-----'), async () => {
      const { http, puts } = fakeAssetHttp();
      await expect(
        executeScreenshotTool('listing__upload_asset', base, { http } as unknown as ScreenshotContext)
      ).rejects.toThrow(/not a PNG, JPEG, MP4 or MOV/);
      expect(http.get).not.toHaveBeenCalled();
      expect(puts).toEqual([]);
    });
  });

  it('wants exactly one target with a placement type, and a type with a target', async () => {
    const { http } = fakeAssetHttp();
    const ctx = { http } as unknown as ScreenshotContext;
    await expect(
      executeScreenshotTool('listing__upload_asset', { ...base, placement_type: 'APP_SCREENSHOT' }, ctx)
    ).rejects.toThrow(/exactly one target/);
    await expect(
      executeScreenshotTool('listing__upload_asset', { ...base, placement_type: 'APP_SCREENSHOT', locale: 'tr', app_event_localization_id: 'e1' }, ctx)
    ).rejects.toThrow(/exactly one target/);
    await expect(executeScreenshotTool('listing__upload_asset', { ...base, locale: 'tr' }, ctx)).rejects.toThrow(/without placement_type/);
    expect(http.post).not.toHaveBeenCalled();
  });

  it('keeps the upload when only the placement fails, and says so', async () => {
    await withFile(png, async () => {
      const { http } = fakeAssetHttp();
      http.post.mockImplementationOnce(async (_p: string, body: any) => ({
        data: { id: `${body.data.type}-1`, attributes: { uploadOperations: [{ method: 'PUT', url: 'https://upload.apple.com/x', offset: 0, length: 8 }] } },
      }));
      http.post.mockImplementationOnce(async () => { throw new Error('placement limit reached'); });
      const result: any = await executeScreenshotTool(
        'listing__upload_asset',
        { ...base, placement_type: 'EVENT_CARD_ASSET', app_event_localization_id: 'ev-1' },
        { http } as unknown as ScreenshotContext
      );
      expect(result.ok).toBe(true);
      expect(result.placed).toBe(false);
      expect(result.placementError).toMatch(/placement limit/);
    });
  });

  it('dry-run resolves library and target and sends nothing', async () => {
    await withFile(png, async () => {
      const { http, puts } = fakeAssetHttp();
      const result: any = await executeScreenshotTool(
        'listing__upload_asset',
        { ...base, placement_type: 'APP_SCREENSHOT', locale: 'tr' },
        { http, dryRun: true } as unknown as ScreenshotContext
      );
      expect(result.dryRun).toBe(true);
      expect(result.risk).toBe('public');
      expect(result.wouldSend.map((w: any) => w.path)).toEqual(['/v1/appAssetLibraryImages', '/v1/appAssetLibraryPlacements']);
      expect(http.post).not.toHaveBeenCalled();
      expect(puts).toEqual([]);
    });
  });
});
