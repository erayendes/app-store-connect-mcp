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
  const get = async (path: string) => {
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
      return {
        data: [
          {
            id: 'v-320',
            attributes: { versionString: '3.2.0', appStoreState: o.state ?? 'PREPARE_FOR_SUBMISSION', platform: 'IOS' },
            relationships: {
              ...(o.build === null ? {} : { build: { data: { id: 'b-1' } } }),
              appStoreReviewDetail: { data: { id: 'r-1' } },
            },
          },
        ],
        included: o.build === null ? included.filter((i) => i.type !== 'builds') : included,
      };
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

  it('is a write, and says so in the tool list', () => {
    expect(RELEASE_TOOLS[0].annotations?.readOnlyHint).not.toBe(true);
  });
});
