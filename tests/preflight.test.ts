/**
 * `preflight__check_version` — the checklist, not the calls.
 *
 * Each of these gaps is one field on one resource, and each one comes back as
 * a rejection or a stalled version days after the submission. What is worth
 * testing is that the tool reads the field Apple actually enforces, and that a
 * blank that is *supposed* to be blank does not become a finding: a preflight
 * that cries wolf is one the reader learns to skip.
 */
import { describe, it, expect, vi } from 'vitest';
import { executePreflightTool, PREFLIGHT_TOOLS } from '../src/tools/preflight.js';

interface Overrides {
  version?: Record<string, unknown>;
  build?: Record<string, unknown> | null;
  review?: Record<string, unknown> | null;
  localizations?: Record<string, unknown>[];
  screenshots?: Record<string, unknown>[];
  submission?: boolean;
}

/** A version with nothing wrong with it, which each test then breaks one way. */
function fakeHttp(o: Overrides = {}) {
  const included: any[] = [];
  const relationships: any = {};

  if (o.build !== null) {
    included.push({
      type: 'builds',
      id: 'b-1',
      attributes: { version: '412', processingState: 'VALID', expired: false, usesNonExemptEncryption: false, ...o.build },
    });
    relationships.build = { data: { id: 'b-1' } };
  }
  if (o.review !== null) {
    included.push({
      type: 'appStoreReviewDetails',
      id: 'r-1',
      attributes: {
        contactFirstName: 'Eray', contactLastName: 'Endes',
        contactPhone: '+90...', contactEmail: 'x@example.com',
        demoAccountRequired: false, ...o.review,
      },
    });
    relationships.appStoreReviewDetail = { data: { id: 'r-1' } };
  }

  const localizations = o.localizations ?? [
    { locale: 'en-US', description: 'A description.', keywords: 'quran,islam', whatsNew: 'Fixes.' },
  ];

  const get = vi.fn(async (path: string) => {
    if (path === '/v1/apps') {
      return { data: [{ id: '6636549188', attributes: { name: 'Ask Quran', bundleId: 'com.milowda.askquranai' } }] };
    }
    if (path.includes('/appStoreVersionLocalizations')) {
      return {
        data: localizations.map((l, i) => ({
          id: `l-${i}`,
          attributes: l,
          relationships: { appScreenshotSets: { data: i === 0 ? [{ id: 'set-1' }] : [] } },
        })),
        included: [{ type: 'appScreenshotSets', id: 'set-1', attributes: { screenshotDisplayType: 'APP_IPHONE_67' } }],
      };
    }
    if (path.includes('/appStoreVersions')) {
      return {
        data: [
          {
            id: 'v-320',
            attributes: { versionString: '3.2.0', appStoreState: 'PREPARE_FOR_SUBMISSION', ...o.version },
            relationships,
          },
        ],
        included,
      };
    }
    if (path.includes('/appScreenshots')) {
      return { data: o.screenshots ?? [{ id: 's-1', attributes: { assetDeliveryState: { state: 'COMPLETE' } } }] };
    }
    if (path.includes('/reviewSubmissions')) {
      return o.submission
        ? { data: [{ id: 'sub-1' }], included: [{ type: 'reviewSubmissionItems', id: 'i-1', relationships: {} }] }
        : { data: [] };
    }
    return { data: [] };
  });
  return { get } as any;
}

const run = (o: Overrides = {}) =>
  executePreflightTool('preflight__check_version', { app: 'Ask Quran' }, { http: fakeHttp(o) }) as Promise<any>;

describe('preflight__check_version', () => {
  it('is read-only and says so, since a client decides what to auto-approve from that', () => {
    expect(PREFLIGHT_TOOLS[0].annotations?.readOnlyHint).toBe(true);
  });

  it('passes a complete version and lists what it looked at', async () => {
    const res = await run();
    expect(res.ready).toBe(true);
    expect(res.blocking).toEqual([]);
    expect(res.checked).toContain('export compliance answered');
    expect(res.version).toBe('3.2.0');
  });

  it('catches a build that is still processing, and says to wait rather than to act', async () => {
    const res = await run({ build: { processingState: 'PROCESSING' } });
    expect(res.ready).toBe(false);
    const gap = res.blocking.find((b: any) => b.check === 'build');
    expect(gap.problem).toContain('PROCESSING');
    expect(gap.fixWith).toContain('wait');
  });

  it('catches the unanswered export compliance question, which has no error of its own', async () => {
    // null, not false: false is an answer. Apple parks the version at
    // WAITING_FOR_EXPORT_COMPLIANCE and reports nothing.
    const res = await run({ build: { usesNonExemptEncryption: null } });
    expect(res.ready).toBe(false);
    expect(res.blocking.map((b: any) => b.check)).toContain('export compliance');
  });

  it('asks for a demo account only when the app says one is required', async () => {
    const notRequired = await run({ review: { demoAccountRequired: false, demoAccountName: '', demoAccountPassword: '' } });
    expect(notRequired.ready).toBe(true);

    const required = await run({ review: { demoAccountRequired: true, demoAccountName: '', demoAccountPassword: '' } });
    expect(required.ready).toBe(false);
    expect(required.blocking[0].problem).toContain('demoAccountName and demoAccountPassword');
  });

  it('blocks on a missing description and only warns about missing keywords', async () => {
    const res = await run({
      localizations: [
        { locale: 'en-US', description: 'A description.', keywords: 'quran' },
        { locale: 'tr', description: '', keywords: '' },
      ],
    });
    expect(res.blocking.map((b: any) => b.check)).toContain('localizations');
    expect(res.blocking.map((b: any) => b.problem).join()).toContain('tr');
    expect(res.warnings.join()).toContain('keywords');
  });

  it('catches a screenshot set that holds no images, and one that failed to deliver', async () => {
    const empty = await run({ screenshots: [] });
    expect(empty.blocking.map((b: any) => b.problem).join()).toContain('no images');

    const failed = await run({ screenshots: [{ id: 's-1', attributes: { assetDeliveryState: { state: 'FAILED' } } }] });
    expect(failed.blocking.map((b: any) => b.problem).join()).toContain('failed to deliver');
  });

  it('says an open review submission does not carry this version', async () => {
    const res = await run({ submission: true });
    expect(res.warnings.join()).toContain('not one of them');
  });

  it('refuses to grade a version that has moved past editing', async () => {
    // Reporting "ready: true" on a version already in review would be a true
    // sentence answering a question nobody asked.
    const res = await run({ version: { appStoreState: 'IN_REVIEW' } });
    expect(res.ready).toBe(false);
    expect(res.blocking).toEqual([]);
    expect(res.checked).toEqual([]);
    expect(res.warnings[0]).toContain('IN_REVIEW');
  });
});
