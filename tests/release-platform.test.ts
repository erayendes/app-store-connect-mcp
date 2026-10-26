/**
 * "Send an App Store version to Apple for review? App: 6636549188, Version:
 * 2.1.2" — an Apple ID nobody can read, and no platform, for an app that had an
 * editable version on iOS and on tvOS at the same time. The prompt has to say
 * which app and which platform, and the submission must not pick one silently.
 */
import { describe, it, expect } from 'vitest';
import { pickVersion } from '../src/tools/preflight.js';
import { releasePreviewArgs } from '../src/tools/release.js';
import { withAppName } from '../src/core/confirm.js';

const v = (versionString: string, platform: string, appStoreState = 'PREPARE_FOR_SUBMISSION') => ({
  id: `${platform}-${versionString}`,
  attributes: { versionString, platform, appStoreState },
});
const both = [v('2.1.3', 'IOS'), v('1.8.1', 'TV_OS'), v('2.1.1', 'IOS', 'READY_FOR_SALE')];

describe('pickVersion', () => {
  it('refuses to guess between two platforms with editable versions', () => {
    expect(() => pickVersion('Ask Quran', both)).toThrow(
      /Ask Quran has an editable version on more than one platform \(iOS 2\.1\.3, tvOS 1\.8\.1\)\. Say which with platform/
    );
  });

  it('takes the platform’s own version when told which', () => {
    expect(pickVersion('Ask Quran', both, undefined, 'TV_OS').id).toBe('TV_OS-1.8.1');
    expect(pickVersion('Ask Quran', both, '2.1.3').id).toBe('IOS-2.1.3');
  });

  it('refuses the same version string on two platforms', () => {
    expect(() => pickVersion('Ask Quran', [v('3.0', 'IOS'), v('3.0', 'TV_OS')], '3.0')).toThrow(/more than one platform/);
  });

  it('says when the platform has no such version', () => {
    expect(() => pickVersion('Ask Quran', both, '2.1.3', 'TV_OS')).toThrow(/no version "2\.1\.3" on tvOS\. Found: 1\.8\.1/);
  });
});

describe('the release prompt', () => {
  const http = {
    get: async (path: string) =>
      path.includes('/reviewSubmissions') ? { data: [] } : path === '/v1/apps/6636549188'
        ? { data: { id: '6636549188', attributes: { name: 'Ask Quran', bundleId: 'com.milowda.askquranai' } } }
        : { data: both },
  } as any;

  it('names the app, version and platform it will submit', async () => {
    expect(await releasePreviewArgs({ app: '6636549188', platform: 'IOS' }, http)).toEqual({
      app: 'Ask Quran (6636549188)',
      version: '2.1.3',
      platform: 'iOS',
      items: [{ type: 'appStoreVersion', id: both[0].id }],
    });
  });

  it('fails before anyone is asked when the platform is ambiguous', async () => {
    await expect(releasePreviewArgs({ app: '6636549188' }, http)).rejects.toThrow(/Say which with platform/);
  });
});

describe('withAppName', () => {
  const http = { get: async () => ({ data: { attributes: { name: 'Ask Quran', bundleId: 'com.milowda.askquranai' } } }) };

  it('replaces an Apple ID with the app’s name', async () => {
    expect(await withAppName({ app: '6636549188', build: '110' }, http)).toEqual({
      app: 'Ask Quran (com.milowda.askquranai)',
      build: '110',
    });
  });

  it('leaves a name or bundle ID as given', async () => {
    expect(await withAppName({ app: 'Ask Quran' }, http)).toEqual({ app: 'Ask Quran' });
  });

  it('keeps the id when the lookup fails', async () => {
    expect(await withAppName({ app: '6636549188' }, { get: async () => { throw new Error('down'); } })).toEqual({ app: '6636549188' });
  });
});
