/**
 * One-time interactive credential setup shared by every profile.
 *
 * Asks for the App Store Connect key, stores the .p8 in the macOS Keychain
 * (path reference elsewhere), writes the non-secret fields to the shared
 * config file, then prints a ready-to-paste mcpServers block. After this, a
 * profile entry in a client config needs zero environment variables.
 */
import { createInterface } from 'node:readline/promises';
import { execFileSync } from 'node:child_process';
import { readFileSync, realpathSync } from 'node:fs';
import { writeKeychainPassword } from './core/keychain.js';
import {
  writeSharedConfig,
  sharedConfigPath,
  type SharedConfig,
} from './core/shared-config.js';
import { PROFILES, GATEWAY_OPERATIONS, type Profile } from './profiles.js';
import { ToolRegistry } from './core/registry.js';
import { runChecklist } from './checklist.js';

/** Rough tokens a tool definition costs in context — for the size hint only. */
const TOKENS_PER_TOOL = 150;

/**
 * How many tools a profile actually serves: its domains plus the gateway
 * tools, the three meta tools, and (where the profile opts in) the review-AI
 * helpers. Computed from the spec so the numbers can't drift out of date.
 */
function profileToolCount(p: Profile): number {
  const registry = new ToolRegistry({
    domains: p.domains,
    readOnly: false,
    includeDeprecated: false,
    extraOperations: GATEWAY_OPERATIONS,
  });
  return registry.size + 3 + (p.reviewsAi ? 3 : 0); // + meta tools (+ reviews-ai)
}

/** One compact picker row: `app-info(115) ~17k · names, bundle ids, …` */
function profileRow(p: Profile): { label: string; hint: string } {
  const n = profileToolCount(p);
  const k = Math.round((n * TOKENS_PER_TOOL) / 1000);
  // Drop the leading "Category: " heading; lowercase for a uniform look.
  const detail = p.description.replace(/^[^:]*:\s*/, '').toLowerCase();
  return { label: `${p.name}(${n})`, hint: `~${k}k · ${detail}` };
}

/**
 * Let the user pick which profiles to register. A TTY gets the space-to-toggle
 * checklist; a non-interactive run falls back to a typed answer so the wizard
 * still works when piped.
 */
async function selectProfiles(
  ask: (q: string, required?: boolean) => Promise<string>
): Promise<Profile[]> {
  const title =
    '\nWhich profiles do you want to register?\n' +
    'Each profile is its own small MCP server. Every one you register loads its\n' +
    'tools into every session, so pick the areas you actually use — leaner is\n' +
    'faster. You can re-run setup anytime to change this.';

  if (process.stdin.isTTY) {
    const picked = await runChecklist(PROFILES.map(profileRow), { title, preselected: [] });
    if (picked && picked.length) return picked.map((i) => PROFILES[i]);
    // Cancelled or nothing chosen — fall through to printing all as reference.
    return PROFILES;
  }

  const answer = (
    await ask('Profiles to register — comma-separated names, or "all" (default): ', false)
  ).trim();
  if (!answer || answer.toLowerCase() === 'all') return PROFILES;
  const wanted = new Set(answer.split(',').map((s) => s.trim().replace(/^asc-/, '')));
  const chosen = PROFILES.filter((p) => wanted.has(p.name));
  return chosen.length ? chosen : PROFILES;
}

const KEYCHAIN_SERVICE = 'asc-mcp';

/**
 * Normalise a path the way a human is likely to enter it: dragged from Finder
 * (macOS wraps it in quotes or backslash-escapes each space), pasted with
 * surrounding quotes, or typed with a leading `~`. Real .p8 paths routinely
 * contain a space ("App Store Connect"), so this is not optional polish.
 */
export function cleanPath(input: string): string {
  let p = input.trim();
  if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'"))) {
    p = p.slice(1, -1);
  }
  p = p.replace(/\\ /g, ' '); // shell-escaped spaces from drag-and-drop
  if (p === '~' || p.startsWith('~/')) {
    p = (process.env.HOME ?? '') + p.slice(1);
  }
  return p;
}

export async function runSetup(): Promise<void> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = async (q: string, required = true): Promise<string> => {
    for (;;) {
      const a = (await rl.question(q)).trim();
      if (a || !required) return a;
      console.log('  This field is required.');
    }
  };

  const KEYS_URL = 'https://appstoreconnect.apple.com/access/integrations/api';
  console.log('\nApp Store Connect MCP — shared credential setup');
  console.log(`The Key ID, Issuer ID and .p8 all come from:\n  ${KEYS_URL}\n`);

  try {
    const open = (await ask('Open that page in your browser now? [y/N]: ', false)).trim();
    if (/^y/i.test(open)) {
      const opener =
        process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
      try {
        execFileSync(opener, [KEYS_URL], { stdio: 'ignore' });
      } catch {
        console.log(`  Could not open a browser — visit ${KEYS_URL} manually.`);
      }
    }

    const keyId = await ask('\nKey ID: ');
    const issuerId = await ask('Issuer ID: ');
    const p8Path = cleanPath(await ask('Path to the .p8 file (tip: drag the file into this window): '));
    const vendorNumber = await ask(
      'Vendor number (Payments and Financial Reports page; needed for sales/finance reports, Enter to skip): ',
      false
    );

    // Read the key up front so a typo'd path fails here, not at first server start.
    let resolvedPath: string;
    try {
      resolvedPath = realpathSync(p8Path);
    } catch {
      throw new Error(
        `No file found at "${p8Path}". Tip: drag the .p8 from Finder into this window ` +
          `to fill the path automatically.`
      );
    }
    const pem = readFileSync(resolvedPath, 'utf8').trim();
    if (!pem.includes('PRIVATE KEY')) {
      throw new Error(`${resolvedPath} does not look like a .p8 private key (no PEM header).`);
    }

    const chosen = await selectProfiles(ask);

    // A bundle ID is per-app, not account-global, and only the monetization
    // profile's StoreKit tools use it — so ask for it only when that profile
    // was picked, not as a blanket setup question.
    let bundleId: string | undefined;
    let environment: 'Production' | 'Sandbox' | undefined;
    if (chosen.some((p) => p.storekit)) {
      bundleId =
        (await ask(
          '\nApp bundle ID for the monetization profile (StoreKit 2 transaction tools; ' +
            'binds to one app, Enter to skip): ',
          false
        )) || undefined;
      if (bundleId) {
        const env = (await ask('StoreKit environment [Production/Sandbox] (default Production): ', false)) ||
          'Production';
        environment = env.toLowerCase() === 'sandbox' ? 'Sandbox' : 'Production';
      }
    }

    const shared: SharedConfig = {
      keyId,
      issuerId,
      vendorNumber: vendorNumber || undefined,
      bundleId,
      environment,
    };

    if (process.platform === 'darwin') {
      const account = `AuthKey_${keyId}`;
      writeKeychainPassword(KEYCHAIN_SERVICE, account, pem);
      shared.privateKeyKeychain = `${KEYCHAIN_SERVICE}/${account}`;
      console.log(`\n✓ Private key stored in the macOS Keychain (${KEYCHAIN_SERVICE}/${account}).`);
      console.log('  The .p8 file is no longer needed at runtime — archive it somewhere safe.');
    } else {
      shared.privateKeyPath = resolvedPath;
      console.log(`\n✓ Using the .p8 at ${resolvedPath} (keep the file in place).`);
    }

    const configPath = writeSharedConfig(shared);
    console.log(`✓ Shared config written to ${configPath}.`);
    console.log('  Every profile reads it automatically; env vars still win when set.');

    // The selection should just register the profiles — printing commands for
    // the user to re-run is a confusing second step. If the Claude Code CLI is
    // present, register them directly; otherwise fall back to printing.
    if (await registerWithClaudeCode(chosen, ask)) return;

    printManualRegistration(chosen);
  } finally {
    rl.close();
    // The picker leaves stdin flowing so later prompts work; release it now so
    // the process can exit instead of hanging on an open TTY handle.
    if (process.stdin.isTTY) process.stdin.pause();
  }
}

/**
 * Register the chosen profiles by running `claude mcp add` for each. Returns
 * true when registration was handled (so setup can stop), false to fall back
 * to printing manual instructions.
 */
async function registerWithClaudeCode(
  chosen: Profile[],
  ask: (q: string, required?: boolean) => Promise<string>
): Promise<boolean> {
  let claudeAvailable = false;
  try {
    execFileSync('claude', ['--version'], { stdio: 'ignore' });
    claudeAvailable = true;
  } catch {
    // `claude` not on PATH — the user uses a different client; print instead.
  }
  if (!claudeAvailable) return false;

  const answer = (
    await ask(`\nRegister these ${chosen.length} profile(s) with Claude Code now? [Y/n]: `, false)
  ).trim();
  if (/^n/i.test(answer)) return false;

  let allOk = true;
  for (const p of chosen) {
    try {
      execFileSync(
        'claude',
        ['mcp', 'add', '-s', 'user', `asc-${p.name}`, '--', 'npx', '-y', '@erayendes/asc-mcp', p.name],
        { stdio: 'ignore' }
      );
      console.log(`  ✓ asc-${p.name}`);
    } catch (err) {
      allOk = false;
      console.log(`  ✗ asc-${p.name}: ${(err as Error).message.split('\n')[0]}`);
    }
  }

  if (allOk) {
    console.log('\nDone. Restart Claude Code, then ask it to check the App Store Connect connection.');
    return true;
  }
  console.log('\nSome did not register. Do the rest by hand:');
  printManualRegistration(chosen);
  return true;
}

function printManualRegistration(chosen: Profile[]): void {
  // npx form is portable — no absolute install path baked into the user's
  // config, works the same however the package was installed.
  const entries = chosen
    .map(
      (p) =>
        `    "asc-${p.name}": { "command": "npx", "args": ["-y", "@erayendes/asc-mcp", ${JSON.stringify(p.name)}] }`
    )
    .join(',\n');
  const cliLines = chosen
    .map((p) => `  claude mcp add -s user asc-${p.name} -- npx -y @erayendes/asc-mcp ${p.name}`)
    .join('\n');

  console.log(
    `\nRegister ${chosen.length} profile${chosen.length === 1 ? '' : 's'} one of these two ways:\n\n` +
      'A) Run these in your terminal (Claude Code CLI):\n\n' +
      cliLines +
      '\n\nB) Or paste this into your MCP client config — no env block needed:\n\n' +
      '{\n  "mcpServers": {\n' + entries + '\n  }\n}\n\n' +
      'Then restart your client and ask it to check the App Store Connect connection.'
  );
}
