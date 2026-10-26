/**
 * A profile is one purpose-built MCP server carved out of the full spec: a
 * name, the tools it loads, and the extras it carries. The same binary serves
 * any profile — `asc-mcp monetization` — so one install backs fourteen
 * differently-scoped servers and a client config picks per project.
 *
 * Membership is hand-curated in `spec/profiles.csv` and generated into
 * `src/generated/profiles-data.ts`. It used to be derived from the URL, which
 * put every app relationship (`/v1/apps/{id}/subscriptionGroups`) in the
 * app-info profile while the resource itself lived elsewhere — so eight of
 * eleven profiles could not reach their own resources from an app.
 *
 * `core` is a profile like the others since 3.0. It used to be folded into
 * every server, which paid for app lookup, tool search and the media macros
 * once per registered profile; now it is its own server (`ASC-Core`),
 * registered next to the rest, or folded into one server with `--with-core`.
 */
import {
  MACRO_COVERED,
  PROFILELESS,
  PROFILE_DATA,
  TWIN_OF,
  type GeneratedSubProfile,
} from './generated/profiles-data.js';
import { OPERATIONS } from './generated/operations.js';
import { PACKAGE, serverName } from './clients.js';

export { MACRO_COVERED, PROFILELESS, TWIN_OF };

/** The profile that carries app lookup, tool search and the media macros. */
export const CORE_PROFILE = 'core';

export interface SubProfile extends GeneratedSubProfile {
  description: string;
}

export interface Profile {
  /** Positional CLI argument and the suffix of the server name (`ASC-<Name>`). */
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
  core:
    'App lookup, tool search, account status and the screenshot and asset-library upload tools — ' +
    'register it next to any other profile.',

  access: 'Your App Store Connect team: members and roles, invitations, sandbox test accounts.',
  'access/sandbox': 'Sandbox test accounts for in-app purchase testing, and clearing their purchase history.',
  'access/user-invitations': 'Invite people to the team and manage pending invitations.',
  'access/user-management': 'Team members, their roles and which apps they can see.',

  analytics:
    'Sales and finance reports, analytics report requests, performance and diagnostic data — ' +
    'for questions about downloads, revenue and crashes.',

  'app-clips':
    'App Clips: default and advanced experiences, header images, review details, beta invocations.',

  'background-assets':
    'Background Assets (iOS 26): asset packs downloaded outside the app binary, and their releases.',

  distribution:
    'Shipping a version: App Store versions and localizations, builds, review details, ' +
    'submission and release, export compliance, EU alternative distribution.',
  'distribution/app-encryption':
    'Export compliance: encryption declarations, their documents, and attaching one to a build.',
  'distribution/app-review-information':
    'What App Review sees: contact info, demo account, review notes and attachments.',
  'distribution/builds': 'Uploaded builds: upload sessions, bundles, file sizes, build details.',
  'distribution/dma-distribution':
    'Distribution outside the App Store under the EU Digital Markets Act: web distribution ' +
    'domains, alternative marketplace listings, signing keys, packages.',
  'distribution/phased-releases': 'Phased release of a version: start, pause, resume, release to all.',
  'distribution/publish':
    'Submitting for review and releasing: review submissions and their items, release requests, ' +
    'the one-call submit macro.',
  'distribution/routing-coverage': 'Routing app coverage files for apps that offer directions.',
  'distribution/version':
    'App Store versions and their localizations: what is new, keywords, screenshot and preview ' +
    'sets, the version preflight and the translation tools.',

  'game-center': 'Game Center: achievements, leaderboards, activities, challenges, groups, matchmaking.',
  'game-center/achievements': 'Achievements: versions, localizations, images, player submissions.',
  'game-center/activities':
    'Activities: versions, localizations, images, and the achievements and leaderboards they link.',
  'game-center/challenges': 'Challenges: versions, localizations, images, and the leaderboard each uses.',
  'game-center/groups': 'Game Center groups sharing achievements and leaderboards across apps.',
  'game-center/leaderboards':
    'Leaderboards and leaderboard sets: versions, localizations, images, score submissions and moderation.',
  'game-center/matchmaking': 'Matchmaking queues, rule sets, rules, teams, rule set tests.',
  'game-center/setup':
    'Turning Game Center on for an app: its Game Center detail, app versions, blocked players.',

  general:
    "The app's identity and store facts: names and subtitles, categories, availability by country, " +
    'age rating, EULA, accessibility labels, tags.',
  'general/android-link': 'Mapping an Android app to its iOS counterpart for migration.',
  'general/app-accessibility': 'Accessibility nutrition labels: which features the app supports, per device.',
  'general/app-availabilities': 'Which countries the app is sold in, pre-orders, territory availability.',
  'general/app-categories': 'Primary and secondary categories and subcategories.',
  'general/app-information': 'App info and its localizations: name, subtitle, privacy policy URL.',
  'general/app-tags': 'The tags Apple assigns to an app, and hiding ones that do not fit.',
  'general/legal': 'Age rating declaration and the end user license agreement.',

  marketing:
    'Store presence beyond the version page: custom product pages, product page optimization, ' +
    'in-app events, customer reviews, nominations.',
  'marketing/app-events': 'In-app events: localizations, screenshots, video clips.',
  'marketing/custom-pp':
    'Custom product pages: versions, localizations, keywords, screenshot and preview sets.',
  'marketing/customer-reviews':
    'Customer reviews, responses, summaries, and the AI triage and reply-draft tools.',
  'marketing/nominations': 'Nominations submitted to Apple for editorial featuring.',
  'marketing/pp-optimization':
    'Product page optimization: experiments, treatments and their localizations, promotions.',

  monetization:
    'Money: subscriptions, in-app purchases, offers and codes, app pricing, StoreKit 2 transactions.',
  'monetization/app-price': "The app's own price schedule and price points (not in-app purchases).",
  'monetization/iap-offers': 'Offer codes for in-app purchases: custom and one-time-use codes.',
  'monetization/in-app-purchases':
    'In-app purchases: localizations, images, versions, availability, prices, submissions, ' +
    'and the price macros.',
  'monetization/plan-promote': 'Promoted purchases: which subscriptions and in-app purchases the store page shows.',
  'monetization/subscription':
    'Subscriptions and their groups: localizations, images, versions, prices, availability, ' +
    'grace period, submissions, and the price and preflight macros.',
  'monetization/subscription-codes': 'Subscription offer codes: custom and one-time-use codes.',
  'monetization/subscription-offers':
    'Introductory and promotional offers on a subscription, and the one-call offer macro.',
  'monetization/subscription-win-back': 'Win-back offers for lapsed subscribers.',
  'monetization/transactions':
    'App Store Server API: customer transactions, refunds, subscription status, renewal dates.',

  provisioning:
    'Code signing: bundle IDs and capabilities, certificates, devices, provisioning profiles, ' +
    'merchant and pass type IDs.',
  'provisioning/bundle': 'Bundle IDs and their capabilities.',
  'provisioning/certificates': 'Signing certificates: create, list, revoke.',
  'provisioning/devices': 'Registered test devices.',
  'provisioning/profiles': 'Provisioning profiles and the bundle ID, certificates and devices they bind.',
  'provisioning/wallet': 'Merchant IDs and pass type IDs, with their certificates.',

  testflight:
    'TestFlight: builds for testing, beta groups and testers, external review, crash and ' +
    'screenshot feedback.',
  'testflight/external-testing':
    'External testing: beta app review, recruitment criteria, public links, the beta license agreement.',
  'testflight/feedbacks': 'Tester feedback: crash reports, screenshot submissions, the feedback digest.',
  'testflight/groups': 'Beta groups: create, configure, assign builds.',
  'testflight/test-builds':
    'Builds under test: what to test notes, beta details, tester notifications, pre-release versions.',
  'testflight/testers': 'Individual testers: invite, add to groups and builds, remove.',

  webhooks: 'Webhooks pushing App Store Connect events to your endpoint, their deliveries and pings.',

  'xcode-cloud': "Apple's CI/CD: workflows, build runs, artifacts, test results, source control.",
  'xcode-cloud/repositories': 'Source control behind Xcode Cloud: providers, repositories, branches, pull requests.',
  'xcode-cloud/workflows':
    'Xcode Cloud products, workflows and build runs: actions, artifacts, issues, test results, ' +
    'and the run diagnosis macro.',
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
 * A profile plus the sub-profiles actually asked for. `monetization` selects
 * them all; `monetization:subscription,transactions` selects two.
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
 * Parse a CLI profile argument: `monetization` or `monetization:subscription,transactions`.
 * Throws with the available names — an unknown sub-profile is otherwise silent,
 * and the user only finds out by counting tools.
 */
export function resolveSelection(spec: string): ProfileSelection {
  const [profileName, subList] = spec.split(':', 2);
  const profile = resolveProfile(profileName);
  if (!profile) {
    throw new Error(
      `Unknown profile "${profileName}".\n` +
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

/** Every spec operation a selection serves. */
export function operationsFor(selection: ProfileSelection): string[] {
  return [...new Set(selection.subProfiles.flatMap((s) => s.operations))];
}

/**
 * The deprecated operations `--include-deprecated` should add to a selection.
 *
 * They are in no profile: membership is hand-curated in spec/profiles.csv and
 * nobody curates an endpoint Apple has retired, so 0 of 123 were reachable in
 * profile mode and the flag silently did nothing there — it only ever worked on
 * the no-profile server with `--domains`.
 *
 * Membership by DOMAIN rather than by curation, and that is the honest
 * definition rather than a shortcut: "everything retired in the areas this
 * profile covers" is what someone passing this flag is asking for, and there is
 * no curated answer to inherit. Most of it is Game Center — 102 of the 123 —
 * so `game-center --include-deprecated` is the case this visibly changes.
 */
export function deprecatedOperationsFor(selection: ProfileSelection): string[] {
  const domains = new Set(
    operationsFor(selection)
      .map((name) => OPERATIONS.find((op) => op.name === name)?.domain)
      .filter(Boolean) as string[]
  );
  return OPERATIONS.filter((op) => op.deprecated && domains.has(op.domain)).map((op) => op.name);
}

/** Hand-written tools a selection serves (StoreKit, reviews-AI, pricing macros, core's meta tools). */
export function manualToolsFor(selection: ProfileSelection): string[] {
  return [...new Set(selection.subProfiles.flatMap((s) => s.manualTools))];
}

/**
 * Rough tokens a tool definition costs in context — for size hints only.
 * Measured by `npm run generate`'s token report over the full generated
 * corpus: 263,040 definition tokens / 982 tools = 268 avg. Re-measure and
 * update this after any change to `toMcpTool` or the generator. It has moved
 * five times and every move was paid for: shortening the repeated `next_url`
 * and `id` descriptions took it 225 to 213, the sparse-fieldset params
 * (fields[...]) took it back to 254, giving `id` a description again (AI-217)
 * to 264 — because on a delete or a relationship read `id` is the only
 * parameter, and an undescribed one is a tool that documents nothing about its
 * input — and telling the 46 app-rooted tools that their `id` also takes a name
 * or bundle ID to 268, then 3.0's descriptions naming ASC-Core and the
 * profile-less reads to 274 (277,164 / 1011). Two of those moves had already
 * landed without the constant following them, which is most of what
 * `asc__status` reports. `scripts/measure-tokens.ts` sums the
 * real definitions per server when an estimate is not enough.
 */
export const TOKENS_PER_TOOL = 274;

/**
 * How many tools a selection serves: its own, plus `asc__status` on a profile
 * server (core already lists it) and the `asc__call`/`asc__describe` pair when
 * some sub-profiles were left out.
 */
export function toolCountFor(selection: ProfileSelection): number {
  const own = new Set([...operationsFor(selection), ...manualToolsFor(selection)]);
  const status = own.has('asc__status') ? 0 : 1;
  return own.size + status + (selection.partial ? 2 : 0);
}

/**
 * Which servers carry an operation. Replaces the old domain lookup: a domain
 * now spans several profiles (the TestFlight domain alone is split four ways),
 * so answering "where does this tool live" per domain named the wrong server.
 */
export function profilesForOperation(operation: string): string[] {
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
  return `claude mcp add -s user ${serverName(name)} -- npx -y ${PACKAGE} ${spec}`;
}

/**
 * What a server started with a profile argument that does not resolve says —
 * a name from an earlier version (`app-info`, `user-management`) or a typo.
 *
 * Such a server still starts, with this as its only tool's answer, because a
 * config error only reaches stderr and all the user sees is `ASC-AppInfo ✗
 * failed`. A tool the agent can call turns an invisible log line into a
 * sentence in the conversation. Generic on purpose: a list of renamed profiles
 * is one more table to keep in step, and `setup` already knows how to rewrite
 * the config to the current names.
 */
export function unknownProfileMessage(spec: string, reason?: string): string {
  return (
    `This MCP server was started with the App Store Connect profile "${spec}", which does ` +
    `not exist in Heimdall — it was renamed or removed, or it is a typo.` +
    (reason ? `\n${reason.split('\n')[0]}` : '') +
    `\n\nThis server carries no App Store Connect tools. Tell the user to run ` +
    `\`npx -y @erayendes/asc-mcp setup\` in a terminal, which rewrites their MCP client ` +
    `config to the current profiles, and then restart the client.\n\nCurrent profiles:\n` +
    PROFILES.map((p) => `  ${p.name.padEnd(18)} ${p.description}`).join('\n')
  );
}
