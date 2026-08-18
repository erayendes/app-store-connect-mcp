/**
 * "Where is everything?" — the whole account in one call.
 *
 * The question a person opens App Store Connect to answer is not about one
 * resource. It is which of their apps is waiting on them: one is approved and
 * sitting unreleased, one was rejected on Friday, one has a version that was
 * never submitted. Through the raw tools that is `apps__list` and then one
 * `appStoreVersions` call per app, and the answer still has to be assembled
 * from state strings whose meaning is not in their names —
 * `PENDING_DEVELOPER_RELEASE` is the one that needs a human today, and it
 * sounds like waiting.
 *
 * So the states are translated into who the ball is with. That is the whole
 * value: not the calls, which are two, but knowing that `IN_REVIEW` means do
 * nothing and `WAITING_FOR_EXPORT_COMPLIANCE` means the submission is stuck on
 * a checkbox nobody ticked.
 *
 * Deliberately not a sales report. Those are asynchronous request/poll jobs in
 * Apple's API (`analytics__get_report` owns that), and folding one into a
 * status call would turn a fast question into a slow one.
 */
import type { McpToolDefinition } from '../core/registry.js';
import type { AscHttpClient } from '../core/http.js';

export const ACCOUNT_TOOLS: McpToolDefinition[] = [
  {
    name: 'asc__account_status',
    description:
      'Show every app in the account with the version that is live, the version in ' +
      'flight, and whose move it is — in one call. Translates App Store states into ' +
      'the action they imply: approved-and-held apps, rejections, submissions stuck on ' +
      'export compliance, and versions never submitted. Start here when the question is ' +
      '"what needs my attention?" rather than one app. Read-only.',
    inputSchema: {
      type: 'object',
      properties: {
        only_actionable: {
          type: 'boolean',
          description:
            'Return only the apps waiting on you, dropping the ones where nothing is ' +
            'pending or Apple has the ball (default false).',
        },
      },
    },
    outputSchema: {
      type: 'object',
      properties: {
        apps: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              app: { type: 'string' },
              appleId: { type: 'string' },
              bundleId: { type: 'string' },
              live: { type: 'string', description: 'Version on sale, or null if never released.' },
              inFlight: {
                type: 'object',
                description: 'The version being prepared or reviewed, if any.',
                properties: {
                  version: { type: 'string' },
                  state: { type: 'string' },
                },
              },
              waitingOn: {
                type: 'string',
                description: 'you, Apple, or nobody — who the next move belongs to.',
              },
              action: { type: 'string', description: 'What to do, naming the tool when there is one.' },
            },
            required: ['app', 'appleId', 'waitingOn'],
          },
        },
        counts: {
          type: 'object',
          description: 'apps, waitingOnYou, waitingOnApple.',
        },
        note: { type: 'string' },
      },
      required: ['apps', 'counts'],
    },
    annotations: { readOnlyHint: true },
  },
];

export const ACCOUNT_TOOL_NAMES: ReadonlySet<string> = new Set(ACCOUNT_TOOLS.map((t) => t.name));

/** Versions customers can already have. The newest of these is what is on sale. */
const LIVE_STATES = new Set(['READY_FOR_SALE', 'PENDING_APPLE_RELEASE']);

/** Terminal states: the version is history, not a thing in flight. */
const CLOSED_STATES = new Set([
  'READY_FOR_SALE',
  'PENDING_APPLE_RELEASE',
  'REPLACED_WITH_NEW_VERSION',
  'REMOVED_FROM_SALE',
  'DEVELOPER_REMOVED_FROM_SALE',
  'NOT_APPLICABLE',
]);

interface Verdict {
  waitingOn: 'you' | 'Apple' | 'nobody';
  action: string;
}

/**
 * The translation table, which is the point of this tool. Exported so the test
 * can assert the mapping directly rather than through two HTTP fixtures.
 */
export function verdictFor(state: string | undefined, version?: string): Verdict {
  const v = version ? `Version ${version} ` : 'The version ';
  switch (state) {
    case undefined:
      return { waitingOn: 'nobody', action: 'No version in flight.' };
    case 'PREPARE_FOR_SUBMISSION':
      return {
        waitingOn: 'you',
        action: `${v}has never been submitted. Check it with preflight__check_version, then submit with review_submissions__create.`,
      };
    case 'WAITING_FOR_EXPORT_COMPLIANCE':
      return {
        waitingOn: 'you',
        action: `${v}is stuck before review: the build's export compliance answer is missing. Set usesNonExemptEncryption with builds__update.`,
      };
    case 'DEVELOPER_REJECTED':
      return {
        waitingOn: 'you',
        action: `${v}was pulled from review by you and has not gone back. Resubmit with review_submissions__create.`,
      };
    case 'REJECTED':
    case 'METADATA_REJECTED':
    case 'INVALID_BINARY':
      return {
        waitingOn: 'you',
        action: `${v}was rejected (${state}). Read the resolution centre in App Store Connect, fix it, and resubmit.`,
      };
    case 'PENDING_DEVELOPER_RELEASE':
      return {
        waitingOn: 'you',
        action: `${v}is approved and waiting for you to release it — app_store_version_release_requests__create.`,
      };
    case 'WAITING_FOR_REVIEW':
    case 'IN_REVIEW':
    case 'PROCESSING_FOR_APP_STORE':
      return { waitingOn: 'Apple', action: `${v}is with Apple (${state}). Nothing to do.` };
    default:
      return { waitingOn: 'nobody', action: `${v}is ${state}.` };
  }
}

export async function executeAccountTool(
  name: string,
  args: Record<string, unknown>,
  ctx: { http: AscHttpClient }
): Promise<unknown> {
  if (name !== 'asc__account_status') {
    throw new Error(`Unknown account tool: ${name}`);
  }

  // One page of apps with their newest versions attached. `limit[...]` bounds
  // the include per app, so an account with long version histories still
  // answers in one response.
  const res: any = await ctx.http.get('/v1/apps', {
    'fields[apps]': 'name,bundleId,sku,appStoreVersions',
    include: 'appStoreVersions',
    'fields[appStoreVersions]': 'versionString,appStoreState,createdDate',
    'limit[appStoreVersions]': 10,
    limit: 100,
  });

  const included = (res?.included ?? []) as any[];
  const versionById = new Map(included.map((i) => [String(i.id), i]));

  const apps = ((res?.data ?? []) as any[]).map((app) => {
    const refs = (app.relationships?.appStoreVersions?.data ?? []) as any[];
    const versions = refs
      .map((r) => versionById.get(String(r.id)))
      .filter(Boolean)
      .map((v: any) => ({
        version: String(v.attributes?.versionString ?? ''),
        state: String(v.attributes?.appStoreState ?? ''),
      }));

    // Apple returns newest first; both picks rely on that rather than on
    // comparing version strings, which are not reliably ordered.
    const live = versions.find((v) => LIVE_STATES.has(v.state));
    const inFlight = versions.find((v) => !CLOSED_STATES.has(v.state));
    const verdict = verdictFor(inFlight?.state, inFlight?.version);

    return {
      app: String(app.attributes?.name ?? ''),
      appleId: String(app.id),
      bundleId: String(app.attributes?.bundleId ?? ''),
      live: live?.version ?? null,
      inFlight: inFlight ? { version: inFlight.version, state: inFlight.state } : null,
      ...verdict,
    };
  });

  const onlyActionable = args.only_actionable === true;
  const shown = onlyActionable ? apps.filter((a) => a.waitingOn === 'you') : apps;

  return {
    apps: shown,
    counts: {
      apps: apps.length,
      waitingOnYou: apps.filter((a) => a.waitingOn === 'you').length,
      waitingOnApple: apps.filter((a) => a.waitingOn === 'Apple').length,
    },
    note:
      apps.length === 100
        ? 'The account has at least 100 apps; this is the first page.'
        : undefined,
  };
}
