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

function fakeHttp(apps: Array<{ id: string; name: string; versions: Array<[string, string]> }>) {
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
  return { get: async () => ({ data, included }) } as any;
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

  it('is read-only', () => {
    expect(ACCOUNT_TOOLS[0].annotations?.readOnlyHint).toBe(true);
  });
});
