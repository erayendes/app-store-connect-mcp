import { CLIENTS, readRegistrations, type McpClient } from './clients.js';
import { resolveSelection } from './profiles.js';

const PROMPTS: Record<string, string[]> = {
  core: ['List the apps in my App Store Connect account.', 'Find the Heimdall tools for my next App Store task.', 'Show the screenshots on my app’s current store page.'],
  general: ['Show my app’s name and subtitle in each language.', 'List the countries where my app is available.', 'Show my app’s age rating declaration.'],
  analytics: ['List the analytics reports available for my app.', 'Show my app’s latest available sales report.', 'Show which analytics report requests exist for my app.'],
  distribution: ['Check my app’s editable version with preflight__check_version.', 'Show my app’s App Store versions and their states.', 'Compare the store text of my app’s two newest versions.'],
  marketing: ['Summarize my app’s latest customer reviews.', 'List my app’s custom product pages.', 'Show my app’s in-app events and their states.'],
  monetization: ['Show my app’s subscription prices in USA and TUR.', 'List my app’s subscriptions and their groups.', 'Check my app’s subscription catalog with preflight__check_subscription.'],
  testflight: ['Summarize my app’s latest TestFlight feedback.', 'List my app’s beta groups.', 'Show my app’s latest TestFlight builds and their processing states.'],
  access: ['List my App Store Connect team members and roles.', 'Show pending invitations to my App Store Connect team.', 'List my sandbox test accounts.'],
  provisioning: ['List my signing certificates and their expiry dates.', 'Show my registered test devices.', 'List my provisioning profiles.'],
  'app-clips': ['List my app’s App Clip experiences.', 'Show my app’s default App Clip experience.', 'List my app’s advanced App Clip experiences.'],
  'background-assets': ['List my app’s background assets.', 'Show my app’s background asset versions.', 'Show the release states of my app’s background assets.'],
  'game-center': ['List my app’s Game Center achievements.', 'Show my app’s Game Center leaderboards.', 'Show my app’s Game Center configuration.'],
  webhooks: ['List my App Store Connect webhooks.', 'Show the events my webhooks subscribe to.', 'Show my webhooks’ recent deliveries.'],
  'xcode-cloud': ['Diagnose my app’s latest failed Xcode Cloud run.', 'List my app’s Xcode Cloud workflows.', 'Show my app’s recent Xcode Cloud build runs.'],
};

/** One written prompt per sub-profile, for a server started with only part of a profile. */
const SUB_PROMPTS: Record<string, string> = {
  'access/sandbox': 'List my sandbox test accounts.',
  'access/user-invitations': 'Show pending invitations to my App Store Connect team.',
  'access/user-management': 'List my App Store Connect team members and their roles.',
  'distribution/app-encryption': 'Show my app’s export compliance declarations.',
  'distribution/app-review-information': 'Show the contact details and notes App Review sees for my app.',
  'distribution/builds': 'List my app’s latest uploaded builds.',
  'distribution/dma-distribution': 'Show my app’s EU alternative distribution settings.',
  'distribution/phased-releases': 'Show the phased release status of my app’s current version.',
  'distribution/publish': 'Show my app’s open review submissions.',
  'distribution/version': 'Check my app’s editable version with preflight__check_version.',
  'game-center/achievements': 'List my app’s Game Center achievements.',
  'game-center/activities': 'List my app’s Game Center activities.',
  'game-center/challenges': 'List my app’s Game Center challenges.',
  'game-center/groups': 'Show the Game Center group my app belongs to.',
  'game-center/leaderboards': 'Show my app’s Game Center leaderboards.',
  'game-center/matchmaking': 'List my Game Center matchmaking queues.',
  'game-center/setup': 'Show my app’s Game Center configuration.',
  'general/android-link': 'Show the Android app mapped to my app.',
  'general/app-accessibility': 'Show my app’s accessibility nutrition labels.',
  'general/app-availabilities': 'List the countries where my app is available.',
  'general/app-categories': 'Show my app’s primary and secondary categories.',
  'general/app-information': 'Show my app’s name and subtitle in each language.',
  'general/app-tags': 'List the tags Apple has assigned to my app.',
  'general/legal': 'Show my app’s age rating declaration.',
  'marketing/app-events': 'Show my app’s in-app events and their states.',
  'marketing/custom-pp': 'List my app’s custom product pages.',
  'marketing/customer-reviews': 'Summarize my app’s latest customer reviews.',
  'marketing/nominations': 'List my app’s featuring nominations.',
  'marketing/pp-optimization': 'Show my app’s product page optimization tests.',
  'monetization/app-price': 'Show my app’s price in USA and TUR.',
  'monetization/iap-offers': 'List the offer codes for my app’s in-app purchases.',
  'monetization/in-app-purchases': 'List my app’s in-app purchases and their prices in USA.',
  'monetization/plan-promote': 'List the purchases promoted on my app’s store page.',
  'monetization/subscription': 'Show my app’s subscription prices in USA and TUR.',
  'monetization/subscription-codes': 'List the offer codes for my app’s subscriptions.',
  'monetization/subscription-offers': 'Show the introductory and promotional offers on my app’s subscriptions.',
  'monetization/subscription-retention': 'Show my app’s retention messages for subscribers.',
  'monetization/subscription-win-back': 'List my app’s win-back offers.',
  'monetization/transactions': 'Look up a customer’s transactions by order ID.',
  'provisioning/bundle': 'List my bundle IDs and their capabilities.',
  'provisioning/certificates': 'List my signing certificates and their expiry dates.',
  'provisioning/devices': 'Show my registered test devices.',
  'provisioning/profiles': 'List my provisioning profiles.',
  'provisioning/wallet': 'List my merchant IDs and pass type IDs.',
  'testflight/external-testing': 'Show my app’s public TestFlight links and beta review state.',
  'testflight/feedbacks': 'Summarize my app’s latest TestFlight feedback.',
  'testflight/groups': 'List my app’s beta groups.',
  'testflight/test-builds': 'Show my app’s latest TestFlight builds and their processing states.',
  'testflight/testers': 'List the testers in my app’s beta groups.',
  'xcode-cloud/repositories': 'List the repositories connected to Xcode Cloud.',
  'xcode-cloud/workflows': 'Diagnose my app’s latest failed Xcode Cloud run.',
};

/** Local inventory only: suitable for ASC-Core, which has no sibling context. */
export function registeredProfileSpecs(clients: McpClient[] = CLIENTS): string[] {
  return [...new Set(clients.flatMap((c) => readRegistrations(c, true))
    .flatMap((r) => r.spec && r.spec !== 'core' ? [r.spec] : []))];
}

/** Three read-only tasks, spread across the profiles the user actually chose. */
export function examplePrompts(specs: string[]): string[] {
  const choices: string[][] = [];
  for (const spec of specs) {
    try {
      const selection = resolveSelection(spec);
      if (selection.profile.name === 'core' && specs.length > 1) continue;
      if (selection.partial) {
        choices.push(selection.subProfiles.map((s) => SUB_PROMPTS[`${selection.profile.name}/${s.name}`]));
      } else choices.push(PROMPTS[selection.profile.name]);
    } catch { /* Retired entries do not supply examples. */ }
  }
  if (!choices.length) choices.push(PROMPTS.core);
  const longest = Math.max(...choices.map((p) => p.length));
  return [...new Set(Array.from({ length: longest }, (_, i) => choices.flatMap((p) => p[i] ?? [])).flat())].slice(0, 3);
}

export function formatExamplePrompts(specs: string[]): string {
  return 'Try these prompts after restarting your MCP client:\n' + examplePrompts(specs).map((p) => `  "${p}"`).join('\n');
}
