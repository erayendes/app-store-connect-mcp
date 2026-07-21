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
  readSharedConfig,
  writeSharedConfig,
  sharedConfigPath,
  type SharedConfig,
} from './core/shared-config.js';
import { PROFILES, GATEWAY_OPERATIONS, type Profile } from './profiles.js';
import { ToolRegistry } from './core/registry.js';
import { TokenProvider } from './core/jwt.js';
import { AscHttpClient } from './core/http.js';
import { AscApiError } from './core/errors.js';
import { runChecklist } from './checklist.js';

type Ask = (q: string, required?: boolean) => Promise<string>;

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
 * Names of the asc-* profiles currently registered with the Claude Code CLI, so
 * the picker can show them pre-checked. Empty set when `claude` is absent or the
 * command fails — setup then behaves as a first-time run.
 */
function listRegisteredProfileNames(): Set<string> {
  const known = new Set(PROFILES.map((p) => p.name));
  const found = new Set<string>();
  try {
    const out = execFileSync('claude', ['mcp', 'list'], { encoding: 'utf8' });
    for (const line of out.split('\n')) {
      const m = line.match(/^asc-([a-z0-9-]+):/);
      if (m && known.has(m[1])) found.add(m[1]);
    }
  } catch {
    // `claude` not on PATH, or the listing failed — treat as none registered.
  }
  return found;
}

/**
 * Let the user pick which profiles to register. Already-registered profiles
 * come pre-checked so unchecking one removes it. A TTY gets the space-to-toggle
 * checklist; a non-interactive run falls back to a typed answer so the wizard
 * still works when piped. Returns null when the picker was cancelled (Esc/^C);
 * an empty array is a deliberate "none" and is honoured (removes everything).
 */
async function selectProfiles(
  ask: (q: string, required?: boolean) => Promise<string>,
  preselected: number[]
): Promise<Profile[] | null> {
  const title =
    '\nWhich profiles do you want registered?\n' +
    'Already-registered ones are checked — uncheck to remove, check to add.\n' +
    'Each profile is its own small MCP server whose tools load into every\n' +
    'session, so keep only the areas you actually use — leaner is faster.';

  if (process.stdin.isTTY) {
    const picked = await runChecklist(PROFILES.map(profileRow), { title, preselected });
    if (picked === null) return null; // cancelled — leave registration untouched
    return picked.map((i) => PROFILES[i]);
  }

  const answer = (
    await ask('Profiles to register — comma-separated names, or "all" (default): ', false)
  ).trim();
  if (!answer || answer.toLowerCase() === 'all') return PROFILES;
  const wanted = new Set(answer.split(',').map((s) => s.trim().replace(/^asc-/, '')));
  return PROFILES.filter((p) => wanted.has(p.name));
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

// Cheap format checks so an obvious paste error is caught at the prompt rather
// than surfacing as a 401 the first time a server starts. Deliberately lenient:
// they reject clearly-wrong shapes (a whole file pasted, an email, a truncated
// UUID), not borderline-valid ones — Apple stays the source of truth on whether
// the credential actually works.
export function isValidKeyId(v: string): boolean {
  return /^[A-Za-z0-9]{8,12}$/.test(v.trim());
}
export function isValidIssuerId(v: string): boolean {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v.trim());
}

/**
 * Ask for the .p8 until it points at a readable PRIVATE KEY file. A missing or
 * unreadable path, or a file with no PEM header, re-prompts with a hint rather
 * than aborting the wizard.
 */
async function readP8(ask: Ask): Promise<{ resolvedPath: string; pem: string }> {
  for (;;) {
    const p8Path = cleanPath(
      await ask('Path to the .p8 file (tip: drag the file into this window): ')
    );
    try {
      const resolvedPath = realpathSync(p8Path);
      const pem = readFileSync(resolvedPath, 'utf8').trim();
      if (!pem.includes('PRIVATE KEY')) {
        console.log(`  ${resolvedPath} doesn't look like a .p8 private key (no PEM header). Try another file.`);
        continue;
      }
      return { resolvedPath, pem };
    } catch {
      console.log(`  Couldn't read a .p8 at "${p8Path}". Drag the file from Finder into this window and try again.`);
    }
  }
}

/**
 * Verify a credential set against Apple with one lightweight request.
 * - 'ok'          : Apple accepted it.
 * - 'invalid'     : Apple rejected it (401/403), or the key can't sign a token
 *                   — the Key ID / Issuer ID / .p8 don't match; re-prompt.
 * - 'unreachable' : no network or an Apple-side error — can't tell, so save the
 *                   config with a warning instead of blocking an offline setup.
 */
/**
 * Map a failed verification to a verdict. 401/403 means Apple actively rejected
 * the credentials → 'invalid'. Any other API status (network status 0, a 5xx
 * hiccup) means we couldn't get a verdict → 'unreachable', so we don't force a
 * re-entry over a transient problem. A non-API error is a token-signing failure,
 * i.e. the .p8 doesn't match → 'invalid'.
 */
export function classifyVerifyError(err: unknown): 'invalid' | 'unreachable' {
  if (err instanceof AscApiError) {
    return err.status === 401 || err.status === 403 ? 'invalid' : 'unreachable';
  }
  return 'invalid';
}

async function verifyCredentials(
  keyId: string,
  issuerId: string,
  pem: string
): Promise<'ok' | 'invalid' | 'unreachable'> {
  try {
    const tokens = new TokenProvider({ keyId, issuerId, privateKey: pem });
    await new AscHttpClient(tokens).get('/v1/apps', { limit: 1 });
    return 'ok';
  } catch (err) {
    return classifyVerifyError(err);
  }
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
  // Like ask(), but also re-prompts when the answer is present yet malformed,
  // so a mistyped Key ID / Issuer ID is caught here instead of at first run.
  const askValid = async (q: string, ok: (v: string) => boolean, hint: string): Promise<string> => {
    for (;;) {
      const a = await ask(q);
      if (ok(a)) return a;
      console.log(`  ${hint}`);
    }
  };

  const KEYS_URL = 'https://appstoreconnect.apple.com/access/integrations/api';

  try {
    // Credentials already stored? Offer to skip straight to the profile picker,
    // so registering another profile later doesn't mean re-entering the key.
    // env-only setups (no shared file) fall through to the full flow.
    const existing = readSharedConfig();
    if (existing) {
      console.log('\nApp Store Connect MCP — setup');
      console.log(`Found saved credentials (Key ID ${existing.keyId}, Issuer ${existing.issuerId}).`);
      const reuse = (await ask('Reuse them and just pick profiles? [Y/n]: ', false)).trim();
      if (!/^n/i.test(reuse)) {
        const registered = listRegisteredProfileNames();
        const preselected = PROFILES.map((p, i) => (registered.has(p.name) ? i : -1)).filter((i) => i >= 0);
        const chosen = await selectProfiles(ask, preselected);
        if (chosen === null) console.log('\nCancelled — registration left unchanged.');
        else await reconcileRegistration(chosen, registered, ask);
        return;
      }
      console.log('\nEntering new credentials instead.');
    }

    console.log('\nApp Store Connect MCP — shared credential setup');
    console.log(`The Key ID, Issuer ID and .p8 all come from:\n  ${KEYS_URL}\n`);

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

    // Gather Key ID + Issuer ID + .p8, then verify against Apple. On rejection,
    // re-enter all three (they must belong to the same key); offline, save with
    // a warning rather than blocking the setup.
    let keyId: string;
    let issuerId: string;
    let resolvedPath: string;
    let pem: string;
    for (;;) {
      keyId = await askValid(
        '\nKey ID: ',
        isValidKeyId,
        'A Key ID is 8–12 letters and digits, e.g. "ABC123XYZ9". Check it and try again.'
      );
      issuerId = await askValid(
        'Issuer ID: ',
        isValidIssuerId,
        'An Issuer ID is a UUID, e.g. "57246e4f-1a2b-4c3d-9e8f-0123456789ab". Check it and try again.'
      );
      ({ resolvedPath, pem } = await readP8(ask));

      console.log('\nVerifying with Apple…');
      const verdict = await verifyCredentials(keyId, issuerId, pem);
      if (verdict === 'ok') {
        console.log('✓ Credentials verified.');
        break;
      }
      if (verdict === 'unreachable') {
        console.log(
          '⚠ Could not reach Apple to verify (offline?). Saving anyway — run a status check once you are online.'
        );
        break;
      }
      console.log(
        '✗ Apple rejected these credentials. Make sure the Key ID, Issuer ID and .p8 ' +
          'all belong to the same key, then re-enter them.\n'
      );
    }

    const vendorNumber = await ask(
      'Vendor number (Payments and Financial Reports page; needed for sales/finance reports, Enter to skip): ',
      false
    );

    const registered = listRegisteredProfileNames();
    const preselected = PROFILES.map((p, i) => (registered.has(p.name) ? i : -1)).filter((i) => i >= 0);
    const chosen = await selectProfiles(ask, preselected);
    const picked = chosen ?? []; // null = picker cancelled; keep saving creds regardless

    // A bundle ID is per-app, not account-global, and only the monetization
    // profile's StoreKit tools use it — so ask for it only when that profile
    // was picked, not as a blanket setup question.
    let bundleId: string | undefined;
    let environment: 'Production' | 'Sandbox' | undefined;
    if (picked.some((p) => p.storekit)) {
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

    // The picker drives registration directly — add what was checked, remove
    // what was unchecked. A cancelled picker leaves registration untouched.
    if (chosen === null) {
      console.log('\nProfile selection skipped — credentials saved. Re-run setup to pick profiles.');
    } else {
      await reconcileRegistration(chosen, registered, ask);
    }
  } finally {
    rl.close();
    // The picker leaves stdin flowing so later prompts work; release it now so
    // the process can exit instead of hanging on an open TTY handle.
    if (process.stdin.isTTY) process.stdin.pause();
  }
}

/**
 * Reconcile registered profiles with the picker's selection: `claude mcp add`
 * the newly checked ones and `claude mcp remove` the ones unchecked since they
 * were registered. Only touches profiles that actually change, and confirms the
 * plan first because removal edits the user's client config. Falls back to
 * printing manual instructions when the Claude Code CLI is absent.
 */
async function reconcileRegistration(
  chosen: Profile[],
  registered: Set<string>,
  ask: (q: string, required?: boolean) => Promise<string>
): Promise<void> {
  const chosenNames = new Set(chosen.map((p) => p.name));
  const toAdd = chosen.filter((p) => !registered.has(p.name));
  const toRemove = [...registered].filter((n) => !chosenNames.has(n));

  if (!toAdd.length && !toRemove.length) {
    console.log('\nNo changes — the registered profiles already match your selection.');
    return;
  }

  let claudeAvailable = false;
  try {
    execFileSync('claude', ['--version'], { stdio: 'ignore' });
    claudeAvailable = true;
  } catch {
    // `claude` not on PATH — the user uses a different client; print instead.
  }
  if (!claudeAvailable) {
    console.log('\nClaude Code CLI not found — register the profiles you want manually:');
    printManualRegistration(chosen);
    return;
  }

  console.log('\nPlanned changes:');
  if (toAdd.length) console.log(`  + add:    ${toAdd.map((p) => `asc-${p.name}`).join(', ')}`);
  if (toRemove.length) console.log(`  - remove: ${toRemove.map((n) => `asc-${n}`).join(', ')}`);
  const answer = (await ask('Apply these changes? [Y/n]: ', false)).trim();
  if (/^n/i.test(answer)) {
    console.log('Left registration unchanged.');
    return;
  }

  for (const p of toAdd) {
    try {
      execFileSync(
        'claude',
        ['mcp', 'add', '-s', 'user', `asc-${p.name}`, '--', 'npx', '-y', '@erayendes/asc-mcp', p.name],
        { stdio: 'ignore' }
      );
      console.log(`  ✓ added asc-${p.name}`);
    } catch (err) {
      console.log(`  ✗ add asc-${p.name}: ${(err as Error).message.split('\n')[0]}`);
    }
  }
  for (const n of toRemove) {
    try {
      execFileSync('claude', ['mcp', 'remove', `asc-${n}`], { stdio: 'ignore' });
      console.log(`  ✓ removed asc-${n}`);
    } catch (err) {
      console.log(`  ✗ remove asc-${n}: ${(err as Error).message.split('\n')[0]}`);
    }
  }
  console.log('\nDone. Restart Claude Code for the change to take effect.');
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
