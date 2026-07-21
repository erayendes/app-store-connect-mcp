/**
 * A profile is one purpose-built MCP server carved out of the full spec: a
 * name, the domains it loads, and the extras it carries. The same binary
 * serves any profile — `asc-mcp monetization` — so one install backs eleven
 * differently-scoped servers and a client config picks per project.
 */

export interface Profile {
  /** Positional CLI argument and the suffix of the server name (`asc-<name>`). */
  name: string;
  domains: string[];
  description: string;
  /** StoreKit 2 (App Store Server API) tools ride along when configured. */
  storekit?: boolean;
  /** AI-assisted review tools (triage, drafts, briefing). */
  reviewsAi?: boolean;
}

export const PROFILES: Profile[] = [
  {
    name: 'app-info',
    domains: ['apps'],
    description: 'App identity and store metadata: names, bundle IDs, availability, encryption declarations.',
  },
  {
    name: 'distribution',
    domains: ['versions', 'builds'],
    description: 'Release pipeline: App Store versions, review submissions, phased releases, uploaded builds.',
  },
  {
    name: 'user-management',
    domains: ['testflight', 'users', 'sandbox'],
    description: 'TestFlight beta distribution, team members, sandbox test accounts.',
  },
  {
    name: 'monetization',
    domains: ['subscriptions', 'iap', 'pricing'],
    description: 'Money: subscriptions, in-app purchases, offers, app pricing, StoreKit 2 transactions.',
    storekit: true,
  },
  {
    name: 'marketing',
    domains: ['marketing', 'reviews'],
    description: 'Store presence: screenshots, previews, custom product pages, in-app events, customer reviews.',
    reviewsAi: true,
  },
  {
    name: 'analytics',
    domains: ['analytics'],
    description: 'Sales and finance reports, analytics report requests, performance metrics.',
  },
  {
    name: 'game-center',
    domains: ['game_center'],
    description: 'Game Center: achievements, leaderboards, matchmaking, challenges.',
  },
  {
    name: 'xcode-cloud',
    domains: ['xcode_cloud'],
    description: "Apple's CI/CD: workflows, build runs, artifacts, source control.",
  },
  {
    name: 'account-management',
    domains: ['provisioning'],
    description: 'Code signing infrastructure: bundle IDs, certificates, devices, profiles.',
  },
  {
    name: 'background-assets',
    domains: ['background_assets'],
    description: 'Background Assets (iOS 26): asset packs downloaded outside the app binary.',
  },
  {
    name: 'webhooks',
    domains: ['webhooks'],
    description: 'Webhooks pushing App Store Connect events to your endpoint.',
  },
];

/**
 * Gateway operations injected into every profile. Almost every call in the API
 * needs an app ID first; without these a profile cannot start a conversation.
 */
export const GATEWAY_OPERATIONS = ['apps.list', 'apps.get'];

export function resolveProfile(name: string): Profile | undefined {
  return PROFILES.find((p) => p.name === name);
}

/** The exact command that registers a profile's server — a copy-paste remedy. */
export function registerCommand(profileName: string): string {
  return `claude mcp add -s user asc-${profileName} -- npx -y @erayendes/asc-mcp ${profileName}`;
}

/** Which profile serves a domain — used by "tool not here" guidance. */
export function profileForDomain(domain: string): Profile | undefined {
  return PROFILES.find((p) => p.domains.includes(domain));
}
