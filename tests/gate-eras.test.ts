/**
 * The write gate over the wire, in both protocol eras, with no credentials.
 *
 * 2025-era clients are asked with `elicitation/create` — the SDK's legacy shim
 * sends it and re-enters the handler with the answer. 2026-07-28 clients get
 * an `input_required` result and call again. One handler serves both, and
 * this suite is what proves it: an answer in either era decides whether the
 * DELETE reaches Apple.
 *
 * Apple is a stubbed fetch. A refused write is one that sent no DELETE.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { generateKeyPairSync } from 'node:crypto';
import { Client, InMemoryTransport } from '@modelcontextprotocol/client';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { createServer } from '../src/server.js';
import { resolveSelection } from '../src/profiles.js';
import type { ServerConfig } from '../src/core/config.js';
import { dialogText, nativeConfirm } from '../src/core/native-confirm.js';

// The macOS dialog, answered by the test instead of a person.
vi.mock('../src/core/native-confirm.js', async (actual) => ({
  ...(await actual<typeof import('../src/core/native-confirm.js')>()),
  nativeConfirmAvailable: () => true,
  nativeConfirm: vi.fn(),
}));

const privateKey = generateKeyPairSync('ec', {
  namedCurve: 'P-256',
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  publicKeyEncoding: { type: 'spki', format: 'pem' },
}).privateKey;

const config: ServerConfig = {
  credentials: { keyId: 'TESTKEY123', issuerId: 'issuer', privateKey },
  readOnly: false,
  confirmWrites: 'strong',
  includeDeprecated: false,
  dryRun: false,
};

/** A DESTRUCTIVE write, so the default mode asks and asks for a typed CONFIRM. */
const CALL = { name: 'beta_groups__delete', arguments: { id: 'group-1' } };

type Answer = { action: 'accept' | 'decline' | 'cancel'; content?: Record<string, unknown> };
const CONFIRM: Answer = { action: 'accept', content: { confirmation: 'CONFIRM' } };

/** Every request Apple would have received. */
function stubApple() {
  const sent: string[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string | URL, init?: RequestInit) => {
      const method = init?.method ?? 'GET';
      sent.push(`${method} ${new URL(String(url)).pathname}`);
      if (method === 'DELETE') return new Response(null, { status: 204 });
      return new Response(JSON.stringify({ data: { type: 'betaGroups', id: 'group-1', attributes: { name: 'Gate group' } } }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    })
  );
  return { deletes: () => sent.filter((s) => s.startsWith('DELETE')) };
}

/** A client that answers every prompt with `answer` and records what it was shown. */
async function connect(
  era: 'legacy' | 'modern',
  answer: Answer,
  options: {
    autoFulfill?: boolean;
    noElicitation?: boolean;
    confirmWrites?: ServerConfig['confirmWrites'];
    nativeConfirm?: boolean;
    readOnly?: boolean;
    profile?: string;
    clientName?: string;
  } = {}
) {
  const [ct, st] = InMemoryTransport.createLinkedPair();
  const build = () =>
    createServer(
      { ...config, readOnly: options.readOnly ?? config.readOnly, confirmWrites: options.confirmWrites ?? config.confirmWrites, nativeConfirm: options.nativeConfirm },
      resolveSelection(options.profile ?? 'testflight')
    );
  if (era === 'modern') {
    serveStdio(build, { transport: st });
  } else {
    await build().connect(st);
  }
  const client = new Client(
    { name: options.clientName ?? 'gate-eras', version: '0' },
    {
      capabilities: options.noElicitation ? {} : { elicitation: { form: {} } },
      ...(era === 'modern' ? { versionNegotiation: { mode: { pin: '2026-07-28' } } } : {}),
      ...(options.autoFulfill === false ? { inputRequired: { autoFulfill: false } } : {}),
    }
  );
  const prompts: string[] = [];
  if (!options.noElicitation) {
    client.setRequestHandler('elicitation/create', async (req) => {
      prompts.push(String(req.params.message));
      return answer;
    });
  }
  await client.connect(ct);
  return { client, prompts };
}

const textOf = (res: any): string => res.content?.[0]?.text ?? '';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.mocked(nativeConfirm).mockReset();
});

describe.each(['legacy', 'modern'] as const)('the write gate on a %s connection', (era) => {
  it('runs the write once the user types CONFIRM', async () => {
    const apple = stubApple();
    const { client, prompts } = await connect(era, CONFIRM);

    const res: any = await client.callTool(CALL);

    expect(prompts).toHaveLength(1);
    expect(prompts[0]).toMatch(/DESTRUCTIVE/);
    expect(res.isError ?? false).toBe(false);
    expect(apple.deletes()).toEqual(['DELETE /v1/betaGroups/group-1']);
  });

  it.each(['decline', 'cancel'] as const)('sends nothing when the user answers %s', async (action) => {
    const apple = stubApple();
    const { client, prompts } = await connect(era, { action });

    const res: any = await client.callTool(CALL);

    expect(prompts).toHaveLength(1);
    expect(res.isError).toBe(true);
    expect(textOf(res)).toContain(`not confirmed (${action})`);
    expect(apple.deletes()).toEqual([]);
  });

  it('asks with a checkbox for an ordinary write under --confirm, and runs it once ticked', async () => {
    const sent: string[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string | URL, init?: RequestInit) => {
        sent.push(`${init?.method ?? 'GET'} ${new URL(String(url)).pathname}`);
        return new Response(JSON.stringify({ data: { type: 'betaGroups', id: 'group-1', attributes: { name: 'Gate group' } } }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });
      })
    );
    const { client, prompts } = await connect(era, { action: 'accept', content: { confirm: true } }, { confirmWrites: 'all' });

    const res: any = await client.callTool({
      name: 'beta_groups__update',
      arguments: { id: 'group-1', body: { data: { type: 'betaGroups', id: 'group-1', attributes: { name: 'Renamed' } } } },
    });

    expect(prompts).toHaveLength(1);
    expect(prompts[0]).not.toMatch(/Type CONFIRM/);
    expect(res.isError ?? false).toBe(false);
    expect(sent).toContain('PATCH /v1/betaGroups/group-1');
  });

  it('fails closed, without asking, when the client cannot show a prompt', async () => {
    const apple = stubApple();
    const { client } = await connect(era, CONFIRM, { noElicitation: true });

    const res: any = await client.callTool(CALL);

    expect(textOf(res)).toContain('no confirmation prompt could be shown');
    expect(apple.deletes()).toEqual([]);
  });

  it('asks in the macOS dialog instead, and runs the write once it is approved there', async () => {
    const apple = stubApple();
    vi.mocked(nativeConfirm).mockResolvedValueOnce('approved');
    const { client } = await connect(era, CONFIRM, { noElicitation: true, nativeConfirm: true });

    const res: any = await client.callTool(CALL);

    expect(vi.mocked(nativeConfirm)).toHaveBeenCalledOnce();
    expect(res.isError ?? false).toBe(false);
    expect(apple.deletes()).toEqual(['DELETE /v1/betaGroups/group-1']);
  });

  it('asks a Claude Code client in the macOS dialog even though it declares forms', async () => {
    const apple = stubApple();
    vi.mocked(nativeConfirm).mockResolvedValueOnce('approved');
    const { client, prompts } = await connect(era, CONFIRM, { nativeConfirm: true, clientName: 'claude-code' });

    const res: any = await client.callTool(CALL);

    expect(prompts).toEqual([]);
    expect(vi.mocked(nativeConfirm)).toHaveBeenCalledOnce();
    expect(res.isError ?? false).toBe(false);
    expect(apple.deletes()).toEqual(['DELETE /v1/betaGroups/group-1']);
  });

  it('falls back to the form for a Claude Code client when the dialog cannot open', async () => {
    const apple = stubApple();
    vi.mocked(nativeConfirm).mockResolvedValueOnce('unavailable');
    const { client, prompts } = await connect(era, CONFIRM, { nativeConfirm: true, clientName: 'claude-code' });

    const res: any = await client.callTool(CALL);

    expect(vi.mocked(nativeConfirm)).toHaveBeenCalledOnce();
    expect(prompts).toHaveLength(1);
    expect(res.isError ?? false).toBe(false);
    expect(apple.deletes()).toEqual(['DELETE /v1/betaGroups/group-1']);
  });

  it('keeps the form for a Claude Code client when the dialog is turned off', async () => {
    const apple = stubApple();
    const { client, prompts } = await connect(era, CONFIRM, { nativeConfirm: false, clientName: 'claude-code' });

    const res: any = await client.callTool(CALL);

    expect(prompts).toHaveLength(1);
    expect(vi.mocked(nativeConfirm)).not.toHaveBeenCalled();
    expect(res.isError ?? false).toBe(false);
    expect(apple.deletes()).toEqual(['DELETE /v1/betaGroups/group-1']);
  });

  it('sends nothing when Don\'t Allow is pressed in the macOS dialog', async () => {
    const apple = stubApple();
    vi.mocked(nativeConfirm).mockResolvedValueOnce('cancelled');
    const { client } = await connect(era, CONFIRM, { noElicitation: true, nativeConfirm: true });

    const res: any = await client.callTool(CALL);

    expect(textOf(res)).toContain('was not confirmed');
    expect(apple.deletes()).toEqual([]);
  });

  it('sends nothing when the user types something other than CONFIRM', async () => {
    const apple = stubApple();
    const { client } = await connect(era, { action: 'accept', content: { confirmation: 'yes' } });

    const res: any = await client.callTool(CALL);

    expect(textOf(res)).toContain('not confirmed (the answer was not CONFIRM)');
    expect(apple.deletes()).toEqual([]);
  });
});

/**
 * The retry is the client's to build, so a client can try to reuse an answer.
 * These drive the modern wire by hand: take the prompt, then send a retry the
 * gate must refuse.
 */
describe('a hand-built retry on a 2026-07-28 connection', () => {
  async function promptFor(client: Client) {
    const asked: any = await client.callTool(CALL, { allowInputRequired: true });
    expect(asked.resultType).toBe('input_required');
    return asked as { requestState: string };
  }
  const retry = (client: Client, args: Record<string, unknown>, requestState?: string) =>
    client.request({
      method: 'tools/call',
      params: {
        name: CALL.name,
        arguments: args,
        inputResponses: { confirm: CONFIRM },
        ...(requestState ? { requestState } : {}),
      },
    } as any, { allowInputRequired: true }) as Promise<any>;

  it('is refused when the arguments differ from the ones the user saw', async () => {
    const apple = stubApple();
    const { client } = await connect('modern', CONFIRM, { autoFulfill: false });
    const { requestState } = await promptFor(client);

    const res = await retry(client, { id: 'group-2' }, requestState);

    expect(textOf(res)).toMatch(/arguments changed after the confirmation prompt/);
    expect(apple.deletes()).toEqual([]);
  });

  it('runs once, then is refused when the same answer is sent again', async () => {
    const apple = stubApple();
    const { client } = await connect('modern', CONFIRM, { autoFulfill: false });
    const { requestState } = await promptFor(client);

    await retry(client, CALL.arguments, requestState);
    const second = await retry(client, CALL.arguments, requestState);

    expect(textOf(second)).toMatch(/already used or has expired/);
    expect(apple.deletes()).toEqual(['DELETE /v1/betaGroups/group-1']);
  });

  it('runs once when the same answer is sent twice at the same moment', async () => {
    const apple = stubApple();
    const { client } = await connect('modern', CONFIRM, { autoFulfill: false });
    const { requestState } = await promptFor(client);

    const results = await Promise.all([
      retry(client, CALL.arguments, requestState),
      retry(client, CALL.arguments, requestState),
    ]);

    expect(results.filter((r) => /already used/.test(textOf(r)))).toHaveLength(1);
    expect(apple.deletes()).toEqual(['DELETE /v1/betaGroups/group-1']);
  });

  it('asks again when an answer arrives without the state', async () => {
    const apple = stubApple();
    const { client } = await connect('modern', CONFIRM, { autoFulfill: false });

    const res = await retry(client, CALL.arguments);

    expect(res.resultType).toBe('input_required');
    expect(apple.deletes()).toEqual([]);
  });

  it('is rejected at the protocol level when the state is forged', async () => {
    const apple = stubApple();
    const { client } = await connect('modern', CONFIRM, { autoFulfill: false });
    const { requestState } = await promptFor(client);

    await expect(retry(client, CALL.arguments, `${requestState.slice(0, -4)}AAAA`)).rejects.toThrow(/requestState/);
    expect(apple.deletes()).toEqual([]);
  });
});

/**
 * The default mode asks on the strong levels plus the release steps that
 * reach users (risk.ts, ASK_BY_DEFAULT). Preparation steps stay unasked.
 */
describe.each(['legacy', 'modern'] as const)('release steps in the default mode, %s connection', (era) => {
  const sent: string[] = [];
  const stubOk = () => {
    sent.length = 0;
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string | URL, init?: RequestInit) => {
        sent.push(`${init?.method ?? 'GET'} ${new URL(String(url)).pathname}`);
        return new Response(JSON.stringify({ data: { type: 'x', id: 'v-1', attributes: {} } }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });
      })
    );
  };

  it('asks with a checkbox before sending a version to review', async () => {
    stubOk();
    const { client, prompts } = await connect(era, { action: 'cancel' }, { profile: 'distribution' });

    await client.callTool({
      name: 'review_submissions__update',
      arguments: { id: 'sub-1', body: { data: { type: 'reviewSubmissions', id: 'sub-1', attributes: { submitted: true } } } },
    });

    expect(prompts).toHaveLength(1);
    expect(prompts[0]).not.toMatch(/Type CONFIRM/);
    expect(sent.filter((r) => r.startsWith('PATCH'))).toEqual([]);
  });

  it('asks for a typed CONFIRM before putting a version on the store', async () => {
    stubOk();
    const { client, prompts } = await connect(era, { action: 'cancel' }, { profile: 'distribution' });

    await client.callTool({
      name: 'app_store_version_release_requests__create',
      arguments: {
        body: {
          data: {
            type: 'appStoreVersionReleaseRequests',
            relationships: { appStoreVersion: { data: { type: 'appStoreVersions', id: 'v-1' } } },
          },
        },
      },
    });

    expect(prompts).toHaveLength(1);
    expect(prompts[0]).toMatch(/Type CONFIRM/);
    expect(sent.filter((r) => r.startsWith('POST'))).toEqual([]);
  });

  it('does not ask before editing a draft version', async () => {
    stubOk();
    const { client, prompts } = await connect(era, CONFIRM, { profile: 'distribution' });

    await client.callTool({
      name: 'app_store_versions__update',
      arguments: { id: 'v-1', body: { data: { type: 'appStoreVersions', id: 'v-1', attributes: { copyright: '2026' } } } },
    });

    expect(prompts).toEqual([]);
    expect(sent).toContain('PATCH /v1/appStoreVersions/v-1');
  });
});

/**
 * Writes that used to fall through to `low` and pass with no prompt, though
 * each reaches customers, players or testers (risk.ts).
 */
describe.each(['legacy', 'modern'] as const)('live writes outside the release pipeline, %s connection', (era) => {
  const sent: string[] = [];
  const stubOk = () => {
    sent.length = 0;
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string | URL, init?: RequestInit) => {
        sent.push(`${init?.method ?? 'GET'} ${new URL(String(url)).pathname}`);
        return new Response(JSON.stringify({ data: { type: 'x', id: 'x-1', attributes: {} } }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });
      })
    );
  };
  const writes = () => sent.filter((r) => !r.startsWith('GET'));
  const body = (type: string, attributes: Record<string, unknown>, id?: string) => ({
    data: { type, ...(id ? { id } : {}), attributes },
  });

  it.each([
    {
      what: 'opening or closing the app in a country',
      profile: 'general',
      name: 'territory_availabilities__update',
      arguments: { id: 't-1', body: body('territoryAvailabilities', { available: false }, 't-1') },
      typed: false,
    },
    {
      what: 'setting where the app is sold',
      profile: 'general',
      name: 'app_availabilities_v2__create',
      arguments: { body: body('appAvailabilities', { availableInNewTerritories: true }) },
      typed: false,
    },
    {
      // A pre-order cannot be reopened once ended.
      what: 'ending a pre-order',
      profile: 'general',
      name: 'end_app_availability_pre_orders__create',
      arguments: { body: { data: { type: 'endAppAvailabilityPreOrders' } } },
      typed: true,
    },
    {
      what: 'starting a product page experiment',
      profile: 'marketing',
      name: 'app_store_version_experiments_v2__update',
      arguments: { id: 'e-1', body: body('appStoreVersionExperiments', { started: true, trafficProportion: 50 }, 'e-1') },
      typed: false,
    },
    {
      // Replacing the set detaches every leaderboard left out of the list.
      what: 'replacing a Game Center leaderboard set',
      profile: 'game-center',
      name: 'game_center_details__game_center_leaderboards_v2__replace',
      arguments: { id: 'gc-1', body: { data: [{ type: 'gameCenterLeaderboards', id: 'lb-1' }] } },
      typed: true,
    },
    {
      what: 'submitting a score for a player',
      profile: 'game-center',
      name: 'game_center_leaderboard_entry_submissions__create',
      arguments: { body: body('gameCenterLeaderboardEntrySubmissions', { score: '100', scopedPlayerId: 'p-1' }) },
      typed: false,
    },
    {
      what: 'submitting an achievement for a player',
      profile: 'game-center',
      name: 'game_center_player_achievement_submissions__create',
      arguments: { body: body('gameCenterPlayerAchievementSubmissions', { percentageAchieved: 100, scopedPlayerId: 'p-1' }) },
      typed: false,
    },
    {
      what: 'expiring a build',
      profile: 'distribution',
      name: 'builds__update',
      // Expiring cannot be undone: the build leaves every tester for good.
      arguments: { id: 'b-1', body: body('builds', { expired: true }, 'b-1') },
      typed: true,
    },
  ])('asks before $what', async ({ profile, name, arguments: args, typed }) => {
    stubOk();
    const { client, prompts } = await connect(era, { action: 'cancel' }, { profile });

    await client.callTool({ name, arguments: args });

    expect(prompts).toHaveLength(1);
    if (typed) expect(prompts[0]).toMatch(/Type CONFIRM/);
    else expect(prompts[0]).not.toMatch(/Type CONFIRM/);
    expect(writes()).toEqual([]);
  });

  it.each([
    {
      // Store text's class: reversible by editing again, left to the client.
      what: 'editing the age rating declaration',
      profile: 'general',
      name: 'age_rating_declarations__update',
      arguments: { id: 'ar-1', body: body('ageRatingDeclarations', { advertising: false }, 'ar-1') },
      sent: 'PATCH /v1/ageRatingDeclarations/ar-1',
    },
    {
      what: 'editing the license agreement',
      profile: 'general',
      name: 'end_user_license_agreements__update',
      arguments: { id: 'eula-1', body: body('endUserLicenseAgreements', { agreementText: 'Terms' }, 'eula-1') },
      sent: 'PATCH /v1/endUserLicenseAgreements/eula-1',
    },
    {
      what: 'editing the accessibility declaration',
      profile: 'general',
      name: 'accessibility_declarations__update',
      arguments: { id: 'ax-1', body: body('accessibilityDeclarations', { supportsVoiceover: true }, 'ax-1') },
      sent: 'PATCH /v1/accessibilityDeclarations/ax-1',
    },
    {
      // The same tool as expiring, and the reason the exception reads the body.
      what: 'recording a build’s encryption answer',
      profile: 'distribution',
      name: 'builds__update',
      arguments: { id: 'b-1', body: body('builds', { usesNonExemptEncryption: false }, 'b-1') },
      sent: 'PATCH /v1/builds/b-1',
    },
  ])('does not ask before $what', async ({ profile, name, arguments: args, sent: request }) => {
    stubOk();
    const { client, prompts } = await connect(era, CONFIRM, { profile });

    await client.callTool({ name, arguments: args });

    expect(prompts).toEqual([]);
    expect(sent).toContain(request);
  });
});

describe('the macOS dialog text', () => {
  it('says what will happen and what cannot be undone, without the form-only lines', async () => {
    const preview = [
      'Heimdall is about to run "release__submit" — a RELEASE-level write.',
      '',
      'Operation:  POST release__submit (macro)',
      'Account:    TESTKEY123',
      'Changes:',
      '  app: Ask Quran',
      'Risk:       release — Release steps can be hard to walk back.',
      '',
      'Type CONFIRM in the field below to proceed.',
    ].join('\n');

    const { title, body } = dialogText('Send an App Store version to Apple for review', preview);

    expect(title).toBe('Send an App Store version to Apple for review?');
    expect(body).toContain('App: Ask Quran');
    expect(body).toContain('Release steps can be hard to walk back.');
    expect(body).not.toMatch(/Operation|TESTKEY123|CONFIRM|release__submit/);
  });
});

describe('the macOS dialog text for a raw write', () => {
  // The form lists the request body field by field; a person at an alert
  // needs it in words, with the button named for what it does.
  it('says the change in words, names the target, and drops ids and plumbing', () => {
    const preview = [
      'Heimdall is about to run "app_store_version_localizations__update" — a PUBLIC-level write.',
      '',
      'Operation:  PATCH /v1/appStoreVersionLocalizations/{id}',
      'Target:     id = loc-1 (Example 1.2, tr)',
      'Account:    TESTKEY123',
      'Changes:',
      '  type = "appStoreVersionLocalizations"',
      '  id = "loc-1"',
      '  attributes.whatsNew = "Hata düzeltmeleri"',
      '  attributes.preserveCurrentPrice = false — ⚠ Existing subscribers WILL be moved to the new price.',
      '  relationships.subscriptionPricePoint.data → subscriptionPricePoints/eyJzIjoiNjcwMDAwMDAwMCIsInQiOiJUVVIiLCJwIjoiMTAwNzcifQ',
      '  relationships.subscription.data → subscriptions/6700000000 — "Pro Monthly"',
      'Risk:       public — Visible to customers once live; reversible by editing again.',
    ].join('\n');

    expect(dialogText('Update the store listing text for one language of a version: description, keywords', preview)).toEqual({
      title: 'Update the store listing text for one language of a version?',
      body: [
        'Target: Example 1.2, tr',
        'What’s new: Hata düzeltmeleri',
        'Preserve current price: No — ⚠ Existing subscribers WILL be moved to the new price.',
        'Subscription: Pro Monthly',
        '',
        'Visible to customers once live; reversible by editing again.',
      ].join('\n'),
      action: 'Update',
    });
  });

  it('keeps Allow when the verb would collide with Cancel', () => {
    expect(dialogText('Cancel a review submission', 'x').action).toBeUndefined();
  });
});

describe.each(['legacy', 'modern'] as const)('deleting library files on a %s connection', (era) => {
  // Three "Delete an image from the asset library?" dialogs in a row, each
  // showing only "01.png (15)": the macro asks once and names them all.
  it('asks once in the macOS dialog, naming the app and each file', async () => {
    const sent: string[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string | URL, init?: RequestInit) => {
        const u = new URL(String(url));
        const method = init?.method ?? 'GET';
        sent.push(`${method} ${u.pathname}`);
        if (method === 'DELETE') return new Response(null, { status: 204 });
        const body =
          u.pathname === '/v1/apps'
            ? { data: [{ type: 'apps', id: 'app-1', attributes: { name: 'Test App', bundleId: 'com.example.test' } }] }
            : u.pathname === '/v1/apps/app-1/assetLibrary'
              ? { data: { type: 'appAssetLibraries', id: 'lib-1' } }
              : u.pathname.endsWith('/images')
                ? {
                    data: ['img-1', 'img-2'].map((id, i) => ({
                      type: 'appAssetLibraryImages',
                      id,
                      attributes: { referenceName: `0${i + 1}.png (15)` },
                      relationships: { placements: { data: [] } },
                    })),
                  }
                : { data: [] };
        return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });
      })
    );
    vi.mocked(nativeConfirm).mockResolvedValueOnce('approved');
    const { client } = await connect(era, CONFIRM, { noElicitation: true, nativeConfirm: true, profile: 'core' });

    const res: any = await client.callTool({
      name: 'media__delete',
      arguments: { app: 'Test App', target: 'library', asset_ids: ['img-1', 'img-2'] },
    });

    expect(vi.mocked(nativeConfirm)).toHaveBeenCalledOnce();
    expect(vi.mocked(nativeConfirm).mock.calls[0][0]).toEqual({
      title: 'Delete 2 images from the media library?',
      body: 'Test App · media library\n\n01.png (15), 02.png (15)\n\nDeleted files can’t be recovered.',
      action: 'Delete',
    });
    expect(res.isError ?? false).toBe(false);
    expect(sent.filter((s) => s.startsWith('DELETE'))).toEqual([
      'DELETE /v1/appAssetLibraryImages/img-1',
      'DELETE /v1/appAssetLibraryImages/img-2',
    ]);
  });
  it('refuses a 50-file native confirmation whose full preview cannot fit', async () => {
    const ids = Array.from({ length: 50 }, (_, i) => `img-${i}`);
    const sent: string[] = [];
    vi.stubGlobal('fetch', vi.fn(async (url: string | URL, init?: RequestInit) => {
      const path = new URL(String(url)).pathname;
      sent.push(`${init?.method ?? 'GET'} ${path}`);
      if ((init?.method ?? 'GET') === 'DELETE') return new Response(null, { status: 204 });
      const body = path === '/v1/apps'
        ? { data: [{ id: 'app-1', attributes: { name: 'Test App', bundleId: 'com.example.test' } }] }
        : path === '/v1/apps/app-1/assetLibrary'
          ? { data: { id: 'lib-1' } }
          : path === '/v1/appAssetLibraries/lib-1/images'
            ? { data: ids.map((id) => ({ id, attributes: { referenceName: `Very long customer-facing campaign image name ${id} for the autumn storefront` } })) }
            : { data: [] };
      return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });
    }));
    const { client } = await connect(era, CONFIRM, { noElicitation: true, nativeConfirm: true, profile: 'core' });
    const result: any = await client.callTool({ name: 'media__delete', arguments: { app: 'Test App', target: 'library', asset_ids: ids } });
    expect(result.isError).toBe(true);
    expect(textOf(result)).toMatch(/full media preview exceeds.*native macOS dialog limit.*elicitation prompt.*fewer items/);
    expect(vi.mocked(nativeConfirm)).not.toHaveBeenCalled();
    expect(sent.some((entry) => entry.startsWith('DELETE'))).toBe(false);
  });
});

describe.each(['legacy', 'modern'] as const)('unoffered media writes on a %s connection', (era) => {
  it.each([{ profile: 'core', readOnly: true }, { profile: 'testflight', readOnly: false }])('rejects before lookup or prompt in $profile (readOnly=$readOnly)', async ({ profile, readOnly }) => {
    const sent: string[] = [];
    vi.stubGlobal('fetch', vi.fn(async (url: string | URL) => { sent.push(String(url)); throw new Error('Unexpected Apple request'); }));
    const { client } = await connect(era, CONFIRM, { noElicitation: true, nativeConfirm: true, profile, readOnly });
    expect((await client.listTools()).tools.map((tool) => tool.name)).not.toContain('media__delete');
    const result: any = await client.callTool({ name: 'media__delete', arguments: { app: 'Test App', target: 'library', asset_ids: ['img-1'] } });
    expect(result.isError).toBe(true);
    expect(textOf(result)).toMatch(/Unknown tool.*does not offer it/);
    expect(vi.mocked(nativeConfirm)).not.toHaveBeenCalled();
    expect(sent).toEqual([]);
  });
});

describe.each(['legacy', 'modern'] as const)('media writes without a confirmation channel on a %s connection', (era) => {
  it.each([
    { name: 'media__upload', arguments: { app: 'Test App', target: 'version', file_path: '/tmp/image.png', category: 'APP_SCREENSHOTS_AND_PREVIEWS' } },
    { name: 'media__arrange', arguments: { app: 'Test App', target: 'library', action: 'archive', asset_ids: ['img-1'] } },
    { name: 'media__delete', arguments: { app: 'Test App', target: 'library', asset_ids: ['img-1'] } },
  ])('blocks $name before any Apple request when confirmation is required', async (call) => {
    const sent: string[] = [];
    vi.stubGlobal('fetch', vi.fn(async (url: string | URL) => {
      sent.push(String(url));
      throw new Error('Unexpected Apple request');
    }));
    // Public page uploads ask in --confirm=all; destructive actions ask in
    // the default strong mode.
    const { client } = await connect(era, CONFIRM, { noElicitation: true, nativeConfirm: false,
      confirmWrites: call.name === 'media__upload' ? 'all' : 'strong', profile: 'core' });
    const result: any = await client.callTool(call);
    expect(result.isError).toBe(true);
    expect(textOf(result)).toMatch(/no confirmation prompt could be shown/);
    expect(sent).toEqual([]);
  });
  it.each(['remove ', 'archive\n'])('treats normalized %j as destructive in default confirmation mode', async (action) => {
    const sent: string[] = [];
    vi.stubGlobal('fetch', vi.fn(async (url: string | URL) => { sent.push(String(url)); throw new Error('Unexpected Apple request'); }));
    const { client } = await connect(era, CONFIRM, { noElicitation: true, nativeConfirm: false, profile: 'core' });
    const result: any = await client.callTool({ name: 'media__arrange', arguments: { app: 'Test App', target: 'version', page_id: 'loc', action, ...(action.startsWith('remove') ? { placement_ids: ['pi'] } : { asset_ids: ['img'] }) } });
    expect(result.isError).toBe(true);
    expect(textOf(result)).toMatch(/no confirmation prompt could be shown/);
    expect(sent).toEqual([]);
  });
  it('rejects an undeclared delete action before any Apple request', async () => {
    const sent: string[] = [];
    vi.stubGlobal('fetch', vi.fn(async (url: string | URL) => { sent.push(String(url)); throw new Error('Unexpected Apple request'); }));
    const { client } = await connect(era, CONFIRM, { noElicitation: true, nativeConfirm: false, profile: 'core' });
    const result: any = await client.callTool({ name: 'media__arrange', arguments: { app: 'Test App', target: 'library', action: 'delete', asset_ids: ['img'] } });
    expect(result.isError).toBe(true);
    expect(textOf(result)).toMatch(/Unknown media action/);
    expect(sent).toEqual([]);
  });
});

describe.each(['legacy', 'modern'] as const)('release confirmation regressions on a %s connection', (era) => {
  it.each(['release__submit', 'release__submit_items'])('gives usable confirmation advice for declined %s and labels every item', async (name) => {
    const sent: string[] = [];
    vi.stubGlobal('fetch', vi.fn(async (url: string | URL, init?: RequestInit) => {
      const path = new URL(String(url)).pathname;
      sent.push(`${init?.method ?? 'GET'} ${path}`);
      const body = path === '/v1/apps'
        ? { data: [{ id: '1', attributes: { name: 'Example', bundleId: 'com.example' } }] }
        : path === '/v1/apps/1/appStoreVersions'
          ? { data: [{ id: 'av1', attributes: { versionString: '3.0', platform: 'IOS', appStoreState: 'PREPARE_FOR_SUBMISSION' } }] }
          : path === '/v1/apps/1/reviewSubmissions'
            ? { data: [{ id: 'open' }] }
            : path === '/v1/reviewSubmissions/open/items'
              ? { data: [{ id: 'item', relationships: { appStoreVersion: { data: { id: 'av1' } } } }] }
              : path === '/v1/appStoreVersions/av1'
                ? { data: { id: 'av1', attributes: { versionString: '3.0' } } }
                : path === '/v1/inAppPurchaseVersions/iap1'
                  ? { data: { id: 'iap1', attributes: { version: 1, state: 'READY_FOR_REVIEW' }, relationships: { inAppPurchase: { data: { id: 'product1' } } } }, included: [{ id: 'product1', type: 'inAppPurchases', attributes: { name: 'Gold Pack', state: 'APPROVED' } }] }
                  : { data: [] };
      return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });
    }));
    const { client, prompts } = await connect(era, { action: 'decline' }, { profile: name === 'release__submit' ? 'distribution' : 'monetization', confirmWrites: 'off' });
    try {
      const res: any = await client.callTool({ name, arguments: { app: 'Example', platform: 'IOS', ...(name === 'release__submit_items' ? { items: [{ type: 'inAppPurchaseVersion', id: 'iap1' }] } : {}) } });
      expect(prompts).toHaveLength(1);
      expect(prompts[0]).toContain('already in submission');
      if (name === 'release__submit_items') {
        expect(prompts[0]).toContain('Gold Pack');
        expect(prompts[0]).toContain('will be added');
      }
      expect(res.isError).toBe(true);
      expect(textOf(res)).toContain('Release tools always require this confirmation');
      expect(textOf(res)).not.toMatch(/ASC_CONFIRM_WRITES=0|--no-confirm/);
      expect(sent.every((s) => s.startsWith('GET'))).toBe(true);
    } finally { await client.close(); }
  });
});
