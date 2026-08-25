/**
 * The three-step submission, and the two ways it goes wrong.
 *
 * Apple's `review_submissions.create` takes an *app* and makes an empty
 * container; the version arrives as a separate item; and nothing reaches Apple
 * until `submitted` is patched true. An agent that stops after the POST
 * reports a release it did not ship — which is why the three raw descriptions
 * in scripts/describe.ts each name the next call.
 *
 * The other failure is submitting something that bounces. `preflight__check_version`
 * already knows what Apple enforces, and running it first is the step no chain
 * of raw calls remembers.
 */
import { describe, it, expect } from 'vitest';
import { executeReleaseTool, RELEASE_TOOLS } from '../src/tools/release.js';

interface Options {
  build?: Record<string, unknown> | null;
  state?: string;
  openSubmission?: boolean;
  itemAlreadyThere?: boolean;
  /** null models Apple answering with no platform at all. */
  platform?: string | null;
  /** Which platform the already-open submission belongs to. */
  openSubmissionPlatform?: string;
}

function fakeHttp(o: Options = {}) {
  const writes: Array<{ method: string; path: string; body?: any }> = [];
  const included: any[] = [
    {
      type: 'builds',
      id: 'b-1',
      attributes: { version: '412', processingState: 'VALID', expired: false, usesNonExemptEncryption: false, ...o.build },
    },
    {
      type: 'appStoreReviewDetails',
      id: 'r-1',
      attributes: {
        contactFirstName: 'Eray', contactLastName: 'Endes',
        contactPhone: '+90', contactEmail: 'x@example.com', demoAccountRequired: false,
      },
    },
  ];
  /**
   * Apple honours sparse fieldsets, so the fake has to as well. Without this
   * the mock returns every attribute regardless of what was asked for, and a
   * tool that forgets to request `platform` still sees one — which is exactly
   * how the iOS-default bug survived a test written to catch it.
   */
  const applyFieldset = (res: any, query?: Record<string, unknown>) => {
    const fields = query?.['fields[appStoreVersions]'];
    if (typeof fields !== 'string' || !Array.isArray(res?.data)) return res;
    const keep = new Set(fields.split(','));
    return {
      ...res,
      data: res.data.map((row: any) => ({
        ...row,
        attributes: Object.fromEntries(
          Object.entries(row.attributes ?? {}).filter(([k]) => keep.has(k))
        ),
      })),
    };
  };

  const get = async (path: string, query?: Record<string, unknown>) => {
    if (path === '/v1/apps') {
      return { data: [{ id: '663', attributes: { name: 'Ask Quran', bundleId: 'com.milowda.askquranai' } }] };
    }
    if (path.includes('/appStoreVersionLocalizations')) {
      return {
        data: [
          {
            id: 'l-1',
            attributes: { locale: 'en-US', description: 'An app.', keywords: 'quran', whatsNew: 'Fixes.' },
            relationships: { appScreenshotSets: { data: [{ id: 'set-1' }] } },
          },
        ],
        included: [{ type: 'appScreenshotSets', id: 'set-1', attributes: { screenshotDisplayType: 'APP_IPHONE_67' } }],
      };
    }
    if (path.includes('/appScreenshots')) {
      return { data: [{ id: 's-1', attributes: { assetDeliveryState: { state: 'COMPLETE' } } }] };
    }
    if (path.includes('/reviewSubmissions')) {
      // Apple filters by platform here, so the fake must too: an app on iOS and
      // macOS can have one open submission on each, and handing back the wrong
      // one puts a macOS version into the iOS submission.
      const wanted = query?.['filter[platform]'];
      if (o.openSubmission && wanted && wanted !== (o.openSubmissionPlatform ?? 'IOS')) {
        return { data: [] };
      }
      return o.openSubmission
        ? {
            data: [{ id: 'sub-1' }],
            included: o.itemAlreadyThere
              ? [{ type: 'reviewSubmissionItems', id: 'i-1', relationships: { appStoreVersion: { data: { id: 'v-320' } } } }]
              : [],
          }
        : { data: [] };
    }
    if (path.includes('/appStoreVersions')) {
      return applyFieldset({
        data: [
          {
            id: 'v-320',
            attributes: {
              versionString: '3.2.0',
              appStoreState: o.state ?? 'PREPARE_FOR_SUBMISSION',
              ...(o.platform === null ? {} : { platform: o.platform ?? 'IOS' }),
            },
            relationships: {
              ...(o.build === null ? {} : { build: { data: { id: 'b-1' } } }),
              appStoreReviewDetail: { data: { id: 'r-1' } },
            },
          },
        ],
        included: o.build === null ? included.filter((i) => i.type !== 'builds') : included,
      }, query);
    }
    return { data: [] };
  };
  const request = async (method: string, path: string, opts?: { body?: unknown }) => {
    writes.push({ method, path, body: opts?.body });
    if (path === '/v1/reviewSubmissions') return { data: { id: 'sub-new' } };
    return { data: { id: 'sub-1', attributes: { state: 'WAITING_FOR_REVIEW' } } };
  };
  return { writes, http: { get, request } as never };
}

const run = (args: Record<string, unknown>, http: never, dryRun = false) =>
  executeReleaseTool('release__submit', args, { http, dryRun }) as Promise<any>;

describe('release__submit', () => {
  it('does all three steps and says which one actually reached Apple', async () => {
    const { http, writes } = fakeHttp();
    const res = await run({ app: 'Ask Quran' }, http);

    expect(writes.map((w) => `${w.method} ${w.path}`)).toEqual([
      'POST /v1/reviewSubmissions',
      'POST /v1/reviewSubmissionItems',
      'PATCH /v1/reviewSubmissions/sub-new',
    ]);
    expect(writes[2].body.data.attributes.submitted).toBe(true);
    // The steps are the record a partial run leaves behind.
    expect(res.steps[0]).toContain('nothing sent yet');
    expect(res.steps[2]).toContain('starts the queue');
  });

  it('refuses a version the pre-flight blocks, and sends nothing', async () => {
    // The whole reason this tool runs the pre-flight: an unanswered
    // usesNonExemptEncryption parks the version after submission with no
    // explanation attached, and nothing about the three POSTs would fail.
    const { http, writes } = fakeHttp({ build: { usesNonExemptEncryption: null } });
    await expect(run({ app: 'Ask Quran' }, http)).rejects.toThrow(/export compliance/i);
    expect(writes).toEqual([]);
  });

  it('names the tool that fixes each gap it refuses on', async () => {
    const { http } = fakeHttp({ build: null });
    await expect(run({ app: 'Ask Quran' }, http)).rejects.toThrow(/fix with/);
  });

  it('submits anyway when told to, since the caller may know something', async () => {
    const { http, writes } = fakeHttp({ build: { usesNonExemptEncryption: null } });
    await run({ app: 'Ask Quran', skip_preflight: true }, http);
    expect(writes).toHaveLength(3);
  });

  it('reuses an open submission rather than opening a second', async () => {
    // Apple allows one at a time, and a second POST fails with a message about
    // state that says nothing about the submission already sitting there.
    const { http, writes } = fakeHttp({ openSubmission: true });
    const res = await run({ app: 'Ask Quran' }, http);
    expect(writes.map((w) => w.method)).toEqual(['POST', 'PATCH']);
    expect(res.steps[0]).toContain('Reused');
  });

  it('does not add the version twice when it is already an item', async () => {
    const { http, writes } = fakeHttp({ openSubmission: true, itemAlreadyThere: true });
    const res = await run({ app: 'Ask Quran' }, http);
    expect(writes.map((w) => `${w.method} ${w.path}`)).toEqual(['PATCH /v1/reviewSubmissions/sub-1']);
    expect(res.steps[1]).toContain('already an item');
  });

  it('refuses a version that is past submitting', async () => {
    const { http, writes } = fakeHttp({ state: 'IN_REVIEW' });
    await expect(run({ app: 'Ask Quran' }, http)).rejects.toThrow(/past the point/);
    expect(writes).toEqual([]);
  });

  it('rehearses the plan under dry-run without sending anything', async () => {
    const { http, writes } = fakeHttp();
    const res = await run({ app: 'Ask Quran' }, http, true);
    expect(res.dryRun).toBe(true);
    expect(res.wouldDo).toHaveLength(3);
    expect(writes).toEqual([]);
  });

  it('submits for the version\'s real platform, not a default', async () => {
    // The sparse fieldset used to omit `platform`, so `?? 'IOS'` fired every
    // time and a macOS or visionOS version was submitted as iOS — accepted by
    // Apple, and wrong in a way nobody sees until the release does not appear.
    const { http, writes } = fakeHttp({ platform: 'MAC_OS' });
    await run({ app: 'Ask Quran' }, http);
    const created = writes.find((w) => w.path === '/v1/reviewSubmissions');
    expect(created!.body.data.attributes.platform).toBe('MAC_OS');
  });

  it('refuses rather than guessing when Apple returns no platform', async () => {
    const { http, writes } = fakeHttp({ platform: null });
    await expect(run({ app: 'Ask Quran' }, http)).rejects.toThrow(/no platform/i);
    expect(writes).toEqual([]);
  });

  it('does not reuse an open submission belonging to another platform', async () => {
    // An app on both iOS and macOS can have one open submission on each.
    // Filtering only by state and taking the first would attach this macOS
    // version to the iOS submission — accepted by Apple, and wrong.
    const { http, writes } = fakeHttp({
      platform: 'MAC_OS',
      openSubmission: true,
      openSubmissionPlatform: 'IOS',
    });
    await run({ app: 'Ask Quran' }, http);
    const created = writes.find((w) => w.path === '/v1/reviewSubmissions');
    expect(created, 'should have opened its own macOS submission').toBeDefined();
    expect(created!.body.data.attributes.platform).toBe('MAC_OS');
  });

  it('is a write, and says so in the tool list', () => {
    expect(RELEASE_TOOLS[0].annotations?.readOnlyHint).not.toBe(true);
  });
});
