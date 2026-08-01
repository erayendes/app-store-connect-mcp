/**
 * A profile is one purpose-built MCP server carved out of the full spec: a
 * name, the tools it loads, and the extras it carries. The same binary serves
 * any profile — `asc-mcp monetization` — so one install backs seventeen
 * differently-scoped servers and a client config picks per project.
 *
 * Membership is hand-curated in `spec/profiles.csv` and generated into
 * `src/generated/profiles-data.ts`. It used to be derived from the URL, which
 * put every app relationship (`/v1/apps/{id}/subscriptionGroups`) in the
 * app-info profile while the resource itself lived elsewhere — so eight of
 * eleven profiles could not reach their own resources from an app.
 */
import { CORE, PROFILE_DATA, type GeneratedSubProfile } from './generated/profiles-data.js';

export interface SubProfile extends GeneratedSubProfile {
  description: string;
}

export interface Profile {
  /** Positional CLI argument and the suffix of the server name (`asc-<name>`). */
  name: string;
  description: string;
  /** Always at least one. A profile without sub-profiles has a single unnamed one. */
  subProfiles: SubProfile[];
}

/**
 * Written by hand: the sheet carries per-tool notes, not the one-line summary a
 * user reads in the picker. Keyed `profile` and `profile/sub-profile`; a test
 * fails if either is missing, so a new sub-profile cannot ship nameless.
 */
const DESCRIPTIONS: Record<string, string> = {
  access: 'Team and tester access: beta groups, testers, invitations, users, sandbox accounts.',
  'access/testers': 'Beta groups, testers, invitations, sandbox accounts.',
  'access/users': 'Team members, their roles and app visibility, invitations.',

  accessibility: 'Accessibility declarations (Nutrition Labels) for an app.',

  agreements: 'Legal agreements attached to an app: end user license and beta license agreement.',

  analytics: 'Sales and finance reports, analytics report requests, performance metrics.',

  'android-to-ios': 'Android-to-iOS app mapping details, for linking an Android app to its iOS counterpart.',

  'app-clips': 'App Clips: default and advanced experiences, header images, beta invocations.',

  'app-info': 'App identity and store metadata: names, bundle IDs, categories, availability, age ratings.',

  'background-assets': 'Background Assets (iOS 26): asset packs downloaded outside the app binary.',

  distribution:
    'Release pipeline: App Store versions, localizations, phased releases, review submissions, builds.',
  'distribution/version':
    'App Store versions: localizations, search keywords, phased release, submit and release.',
  'distribution/alternative':
    'Alternative distribution (EU): domains, keys, packages, marketplace search details.',
  'distribution/builds': 'Uploaded builds: upload sessions, bundles, file sizes, diagnostics.',
  'distribution/coverages': 'Routing app coverage files for apps that show maps.',
  'distribution/pre-release': 'Pre-release versions and the builds under them.',
  'distribution/review': 'Review submissions and the items inside them.',
  'distribution/submission':
    'App Review details and attachments: contact info, demo account, review notes.',

  encryption: 'Export compliance: app encryption declarations and their documents.',

  'game-center': 'Game Center: achievements, leaderboards, activities, challenges, matchmaking.',
  'game-center/gc-achievement': 'Achievements: versions, localizations, images.',
  'game-center/gc-activities':
    'Activities: versions, localizations, images, and the achievements and leaderboards they link.',
  'game-center/gc-challenge': 'Challenges: versions, localizations, images.',
  'game-center/gc-default': 'Game Center enablement per app version, and compatibility versions.',
  'game-center/gc-details':
    "The app's Game Center detail: which achievements, leaderboards and activities it exposes.",
  'game-center/gc-groups': 'Game Center groups sharing achievements and leaderboards across apps.',
  'game-center/gc-leaderboard':
    'Leaderboards and leaderboard sets: versions, localizations, images, entry submissions.',
  'game-center/gc-matchmaking': 'Matchmaking queues, rule sets, rule set tests and their metrics.',

  marketing:
    'Store presence: screenshots, previews, custom product pages, in-app events, customer reviews.',
  'marketing/app-event': 'In-app events: localizations, screenshots, video clips.',
  'marketing/customer-review':
    'Customer reviews, responses, summaries, and the AI triage and reply-draft tools.',
  'marketing/nominations': 'Nominations submitted to Apple for editorial featuring.',
  'marketing/pp-custom': 'Custom product pages: versions, localizations, media, search keywords.',
  'marketing/pp-experiment':
    'Product page optimization: version experiments, treatments, their localizations.',
  'marketing/pp-main': 'The main product page: screenshot sets and app preview sets.',

  monetization: 'Money: subscriptions, in-app purchases, offers, app pricing, StoreKit 2 transactions.',
  'monetization/subscriptions':
    'Subscriptions: groups, localizations, price points, offers, and the one-call price macro.',
  'monetization/iap':
    'In-app purchases: localizations, availability, price schedules, offer codes, images.',
  'monetization/app-price': 'The app\'s own price schedule and price points (not in-app purchases).',
  'monetization/storekit':
    'App Store Server API: customer transactions, refunds, subscription status, renewal dates.',
  'monetization/winback': 'Win-back offers for lapsed subscribers.',
  'monetization/promote': 'Promoted purchases shown on the App Store product page.',

  provisioning: 'Code signing infrastructure: bundle IDs, certificates, devices, provisioning profiles.',

  testflight: 'TestFlight build metadata: beta app localizations, review details, crash feedback.',

  webhooks: 'Webhooks pushing App Store Connect events to your endpoint.',

  'xcode-cloud': "Apple's CI/CD: workflows, build runs, artifacts, source control.",
};

/** The description key for a sub-profile; unnamed ones inherit the profile's. */
export function descriptionKey(profile: string, subProfile: string): string {
  return subProfile ? `${profile}/${subProfile}` : profile;
}

export const PROFILES: Profile[] = PROFILE_DATA.map((p) => ({
  name: p.name,
  description: DESCRIPTIONS[p.name] ?? '',
  subProfiles: p.subProfiles.map((s) => ({
    ...s,
    description: DESCRIPTIONS[descriptionKey(p.name, s.name)] ?? '',
  })),
}));

/** Exposed for the test that proves every profile and sub-profile is described. */
export const PROFILE_DESCRIPTIONS = DESCRIPTIONS;

/**
 * Injected into every profile. Almost every call in the API needs an app ID
 * first, and four relationship listings are needed by more than one profile —
 * without these a profile cannot start a conversation.
 */
export const CORE_OPERATIONS: string[] = CORE.operations;

/** Kept for the meta tools, which ship with every server regardless of profile. */
export const CORE_MANUAL_TOOLS: string[] = CORE.manualTools;

/**
 * A profile plus the sub-profiles actually asked for. `monetization` selects
 * them all; `monetization:subscriptions,iap` selects two.
 */
export interface ProfileSelection {
  profile: Profile;
  subProfiles: SubProfile[];
  /** True when some of the profile's sub-profiles were left out. */
  partial: boolean;
}

export function resolveProfile(name: string): Profile | undefined {
  return PROFILES.find((p) => p.name === name);
}

/**
 * Parse a CLI profile argument: `monetization` or `monetization:subscriptions,iap`.
 * Throws with the available names — an unknown sub-profile is otherwise silent,
 * and the user only finds out by counting tools.
 */
export function resolveSelection(spec: string): ProfileSelection {
  const [profileName, subList] = spec.split(':', 2);
  const profile = resolveProfile(profileName);
  if (!profile) {
    const removed = REMOVED_PROFILES[profileName];
    throw new Error(
      removed
        ? `Profile "${profileName}" was removed. ${removed.summary}`
        : `Unknown profile "${profileName}".\n` +
          `Available: ${PROFILES.map((p) => p.name).join(', ')}\n` +
          `Or run with no profile for the combined server.`
    );
  }

  if (subList === undefined) return { profile, subProfiles: profile.subProfiles, partial: false };

  const named = profile.subProfiles.filter((s) => s.name);
  if (!named.length) {
    throw new Error(`Profile "${profile.name}" has no sub-profiles — pass just "${profile.name}".`);
  }

  const wanted = subList.split(',').map((s) => s.trim()).filter(Boolean);
  const picked: SubProfile[] = [];
  for (const want of wanted) {
    const sub = named.find((s) => s.name === want);
    if (!sub) {
      throw new Error(
        `Unknown sub-profile "${want}" for "${profile.name}".\n` +
          `Available: ${named.map((s) => s.name).join(', ')}`
      );
    }
    if (!picked.includes(sub)) picked.push(sub);
  }
  if (!picked.length) throw new Error(`No sub-profile named after "${profile.name}:".`);

  return { profile, subProfiles: picked, partial: picked.length < named.length };
}

/** Every spec operation a selection serves, core included. */
export function operationsFor(selection: ProfileSelection): string[] {
  return [...new Set([...CORE_OPERATIONS, ...selection.subProfiles.flatMap((s) => s.operations)])];
}

/** Hand-written tools a selection serves (StoreKit, reviews-AI, pricing macros). */
export function manualToolsFor(selection: ProfileSelection): string[] {
  return [...new Set(selection.subProfiles.flatMap((s) => s.manualTools))];
}

/**
 * Rough tokens a tool definition costs in context — for size hints only.
 * Measured across profiles after request-body schemas were inlined (AI-188):
 * total definition JSON / tool count lands at ~210-240 depending on profile.
 */
export const TOKENS_PER_TOOL = 225;

/** How many tools a selection serves, meta tools included. */
export function toolCountFor(selection: ProfileSelection): number {
  return (
    operationsFor(selection).length + manualToolsFor(selection).length + CORE_MANUAL_TOOLS.length
  );
}

/**
 * Which servers carry an operation. Replaces the old domain lookup: a domain
 * now spans several profiles (the TestFlight domain alone is split four ways),
 * so answering "where does this tool live" per domain named the wrong server.
 */
export function profilesForOperation(operation: string): string[] {
  if (CORE_OPERATIONS.includes(operation)) return PROFILES.map((p) => p.name);
  return PROFILES.filter((p) => p.subProfiles.some((s) => s.operations.includes(operation))).map(
    (p) => p.name
  );
}

/** Which sub-profile of a profile carries an operation, if any. */
export function subProfileOwning(profile: Profile, operation: string): SubProfile | undefined {
  return profile.subProfiles.find((s) => s.operations.includes(operation));
}

/** The exact command that registers a profile's server — a copy-paste remedy. */
export function registerCommand(spec: string): string {
  const name = spec.split(':', 1)[0];
  return `claude mcp add -s user asc-${name} -- npx -y @erayendes/asc-mcp ${spec}`;
}

/**
 * Profiles that existed in an earlier version and no longer do. Naming one
 * doesn't fail the launch: the server starts with a single tool that explains
 * the split, because a config error only reaches stderr and the user sees
 * nothing but `asc-user-management ✗ failed`. A tool the agent can call turns
 * an invisible log line into a sentence in the conversation.
 */
export interface RemovedProfile {
  /** Profiles that took over its tools. Every name must exist — a test checks. */
  replacements: Array<{ name: string; covers: string }>;
  summary: string;
}

export const REMOVED_PROFILES: Record<string, RemovedProfile> = {
  'user-management': {
    replacements: [
      { name: 'access', covers: 'beta groups, testers, invitations, team members, sandbox accounts' },
      { name: 'testflight', covers: 'beta app localizations, beta review details, crash feedback' },
      { name: 'app-clips', covers: 'App Clip beta invocations' },
      { name: 'agreements', covers: 'the beta license agreement' },
    ],
    summary:
      'It was split into access, testflight, app-clips and agreements — replace it in your ' +
      'config with whichever ones you need.',
  },
};

/** The message the tombstone server hands back, in full. */
export function removedProfileMessage(name: string): string | undefined {
  const removed = REMOVED_PROFILES[name];
  if (!removed) return undefined;
  return (
    `The "${name}" App Store Connect profile was removed and split into ` +
    `${removed.replacements.length} smaller profiles:\n` +
    removed.replacements.map((r) => `  ${r.name.padEnd(12)} ${r.covers}`).join('\n') +
    `\n\nThis server carries no App Store Connect tools. Tell the user to replace ` +
    `"asc-${name}" in their MCP client config with the profile they need, for example:\n` +
    removed.replacements.map((r) => `  ${registerCommand(r.name)}`).join('\n') +
    `\nThen restart the client.`
  );
}
