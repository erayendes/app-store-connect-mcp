/**
 * `asc__account_status` — the translation, not the transport.
 *
 * Two of Apple's states are traps and both are why this tool exists:
 * `PENDING_DEVELOPER_RELEASE` sounds like waiting and means the release is
 * sitting on the developer, and `WAITING_FOR_EXPORT_COMPLIANCE` sounds like
 * review and means a submission is stuck on an unanswered field. If the
 * mapping ever drifts, the whole tool becomes a slower `apps__list`.
 */
import { describe, it, expect } from 'vitest';
import { executeAccountTool, verdictFor, ACCOUNT_TOOLS } from '../src/tools/account.js';

function fakeHttp(
  apps: Array<{ id: string; name: string; versions: Array<[string, string]>; rejected?: Array<[string, string]> }>,
  opts: { submissionsFail?: boolean } = {}
) {
  const included: any[] = [];
  const data = apps.map((app) => {
    const refs = app.versions.map(([version, state], i) => {
      const id = `${app.id}-v${i}`;
      included.push({
        type: 'appStoreVersions',
        id,
        attributes: { versionString: version, appStoreState: state },
      });
      return { id, type: 'appStoreVersions' };
    });
    return {
      id: app.id,
      attributes: { name: app.name, bundleId: `com.example.${app.name.toLowerCase()}` },
      relationships: { appStoreVersions: { data: refs } },
    };
  });
  const byId = new Map(apps.map((a) => [a.id, a]));
  return {
    get: async (url: string) => {
      const m = /^\/v1\/apps\/([^/]+)\/reviewSubmissions$/.exec(url);
      if (!m) return { data, included };
      if (opts.submissionsFail) throw new Error('403 FORBIDDEN_ERROR');
      const rejected = byId.get(m[1])?.rejected ?? [];
      if (rejected.length === 0) return { data: [], included: [] };
      return {
        data: [{ type: 'reviewSubmissions', id: `sub-${m[1]}`, attributes: { state: 'UNRESOLVED_ISSUES' } }],
        included: rejected.map(([kind, id], i) => ({
          type: 'reviewSubmissionItems',
          id: `item-${i}`,
          attributes: { state: 'REJECTED' },
          relationships: {
            reviewSubmission: { data: { type: 'reviewSubmissions', id: `sub-${m[1]}` } },
            [kind]: { data: { type: `${kind}s`, id } },
          },
        })),
      };
    },
  } as any;
}

const run = (http: any, args: Record<string, unknown> = {}) =>
  executeAccountTool('asc__account_status', args, { http }) as Promise<any>;

describe('verdictFor', () => {
  it('puts an approved-and-held version on the developer, not on Apple', () => {
    const v = verdictFor('PENDING_DEVELOPER_RELEASE', '2.0');
    expect(v.waitingOn).toBe('you');
    expect(v.action).toMatch(/app_store_version_release_requests__create/);
  });

  it('reads export compliance as stuck-before-review, and names the fix', () => {
    const v = verdictFor('WAITING_FOR_EXPORT_COMPLIANCE', '2.0');
    expect(v.waitingOn).toBe('you');
    expect(v.action).toMatch(/builds__update/);
  });

  it('says there is nothing to do while Apple has it', () => {
    for (const state of ['WAITING_FOR_REVIEW', 'IN_REVIEW', 'PROCESSING_FOR_APP_STORE']) {
      expect(verdictFor(state, '2.0').waitingOn, state).toBe('Apple');
    }
  });

  it('treats every rejection shape as the developer’s move', () => {
    for (const state of ['REJECTED', 'METADATA_REJECTED', 'INVALID_BINARY', 'DEVELOPER_REJECTED']) {
      expect(verdictFor(state, '2.0').waitingOn, state).toBe('you');
    }
  });

  it('sends people to the tool that actually submits, not the one that opens a container', () => {
    // review_submissions__create alone opens an empty submission and sends
    // nothing — the exact failure release__submit exists to prevent. These
    // strings were written before that tool existed and pointed at the wrong
    // one for a release; only `waitingOn` was asserted, so nothing caught it.
    for (const state of ['PREPARE_FOR_SUBMISSION', 'DEVELOPER_REJECTED']) {
      const { action } = verdictFor(state, '2.0');
      expect(action, state).toContain('release__submit');
      expect(action, state).not.toMatch(/submit with review_submissions__create/);
    }
  });

  it('is quiet about an app with nothing in flight', () => {
    expect(verdictFor(undefined)).toEqual({ waitingOn: 'nobody', action: 'No version in flight.' });
  });
});

describe('asc__account_status', () => {
  it('separates the live version from the one in flight', async () => {
    const out = await run(
      fakeHttp([
        { id: '1', name: 'Ask Quran', versions: [['2.0', 'PREPARE_FOR_SUBMISSION'], ['1.9', 'READY_FOR_SALE']] },
      ])
    );
    expect(out.apps[0]).toMatchObject({
      app: 'Ask Quran',
      live: '1.9',
      inFlight: { version: '2.0', state: 'PREPARE_FOR_SUBMISSION' },
      waitingOn: 'you',
    });
  });

  it('counts the account by who holds the next move', async () => {
    const out = await run(
      fakeHttp([
        { id: '1', name: 'A', versions: [['2.0', 'IN_REVIEW']] },
        { id: '2', name: 'B', versions: [['1.0', 'PENDING_DEVELOPER_RELEASE']] },
        { id: '3', name: 'C', versions: [['1.0', 'READY_FOR_SALE']] },
      ])
    );
    expect(out.counts).toEqual({ apps: 3, waitingOnYou: 1, waitingOnApple: 1 });
  });

  it('drops everything that is not yours when asked for only what is actionable', async () => {
    const out = await run(
      fakeHttp([
        { id: '1', name: 'A', versions: [['2.0', 'IN_REVIEW']] },
        { id: '2', name: 'B', versions: [['1.0', 'REJECTED']] },
      ]),
      { only_actionable: true }
    );
    expect(out.apps.map((a: any) => a.app)).toEqual(['B']);
    // The counts still describe the account, not the filtered view — otherwise
    // "1 app" reads as "you have one app".
    expect(out.counts.apps).toBe(2);
  });

  it('reports an app that has never shipped without inventing a live version', async () => {
    const out = await run(
      fakeHttp([{ id: '1', name: 'New', versions: [['1.0', 'PREPARE_FOR_SUBMISSION']] }])
    );
    expect(out.apps[0].live).toBeNull();
  });

  it('surfaces a rejected in-app purchase the version state cannot show', async () => {
    // The whole point: the version is approved and waiting on a release button,
    // and the subscription that shipped in the same basket was rejected. Read
    // only appStoreState and this app looks like a one-click release.
    const out = await run(
      fakeHttp([
        {
          id: '1',
          name: 'A',
          versions: [['2.0', 'PENDING_DEVELOPER_RELEASE']],
          rejected: [['subscriptionVersion', 's1']],
        },
      ])
    );
    expect(out.apps[0].rejectedItems).toEqual([{ kind: 'subscriptionVersion', id: 's1' }]);
    expect(out.apps[0].waitingOn).toBe('you');
    expect(out.apps[0].action).toMatch(/subscriptionVersion/);
    expect(out.apps[0].action).toMatch(/resolution centre/);
  });

  it('reports an unreadable submission as null, not as nothing rejected', async () => {
    // A key without App Manager reads versions and 403s on submissions. An
    // empty array there would be the tool claiming a clean submission it never
    // saw.
    const out = await run(
      fakeHttp([{ id: '1', name: 'A', versions: [['2.0', 'IN_REVIEW']] }], { submissionsFail: true })
    );
    expect(out.apps[0].rejectedItems).toBeNull();
    expect(out.apps[0].waitingOn).toBe('Apple');
  });

  it('says nothing was rejected as an empty list', async () => {
    const out = await run(fakeHttp([{ id: '1', name: 'A', versions: [['2.0', 'IN_REVIEW']] }]));
    expect(out.apps[0].rejectedItems).toEqual([]);
  });

  it('is read-only', () => {
    expect(ACCOUNT_TOOLS[0].annotations?.readOnlyHint).toBe(true);
  });
});
