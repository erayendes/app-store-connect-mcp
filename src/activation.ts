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
        const subject = selection.subProfiles.map((s) => s.name.replace(/-/g, ' ')).join(' and ');
        choices.push([
          `List my app’s ${subject} using the ${selection.profile.name} profile.`,
          `Show the details of my app’s ${subject} using the ${selection.profile.name} profile.`,
          `Summarize my app’s ${subject} using the ${selection.profile.name} profile.`,
        ]);
      } else choices.push(PROMPTS[selection.profile.name]);
    } catch { /* Retired entries do not supply examples. */ }
  }
  if (!choices.length) choices.push(PROMPTS.core);
  return [...new Set([0, 1, 2].flatMap((i) => choices.map((p) => p[i])))].slice(0, 3);
}

export function formatExamplePrompts(specs: string[]): string {
  return 'Try these prompts after restarting your MCP client:\n' + examplePrompts(specs).map((p) => `  "${p}"`).join('\n');
}
