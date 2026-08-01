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
import {
  PROFILES,
  TOKENS_PER_TOOL,
  manualToolsFor,
  registerCommand,
  resolveSelection,
  type Profile,
  type SubProfile,
} from './profiles.js';
import { TokenProvider } from './core/jwt.js';
import { AscHttpClient } from './core/http.js';
import { AscApiError } from './core/errors.js';
import { runChecklist, type ChecklistItem } from './checklist.js';

type Ask = (q: string, required?: boolean) => Promise<string>;

/**
 * One picker row. Profiles are top-level; their sub-profiles hang underneath
 * and only appear once the profile is checked, so the list opens at 17 rows
 * instead of 46 and still lets someone trim a 192-tool profile down.
 */
interface Row {
  index: number;
  item: ChecklistItem;
  profile: Profile;
  subProfile?: SubProfile;
}

/** Tools a row serves, excluding the core set every server carries anyway. */
const subProfileToolCount = (s: SubProfile): number => s.operations.length + s.manualTools.length;

function buildRows(): Row[] {
  const rows: Row[] = [];
  const size = (n: number): string => `~${Math.max(1, Math.round((n * TOKENS_PER_TOOL) / 1000))}k`;
  // Drop the leading "Category: " heading; lowercase for a uniform look.
  const detail = (text: string): string => text.replace(/^[^:]*:\s*/, '').toLowerCase();

  for (const profile of PROFILES) {
    const subs = profile.subProfiles.filter((s) => s.name);
    const total = profile.subProfiles.reduce((n, s) => n + subProfileToolCount(s), 0);
    const parent = rows.length;
    rows.push({
      index: parent,
      profile,
      item: {
        label: `${profile.name}(${total})`,
        hint: `${size(total)} · ${detail(profile.description)}`,
      },
    });
    for (const subProfile of subs) {
      const n = subProfileToolCount(subProfile);
      rows.push({
        index: rows.length,
        profile,
        subProfile,
        item: {
          label: `${subProfile.name}(${n})`,
          hint: `${size(n)} · ${detail(subProfile.description)}`,
          parent,
        },
      });
    }
  }
  return rows;
}

/**
 * The profile arguments currently registered with the Claude Code CLI, keyed by
 * profile name — `monetization` or `monetization:subscriptions,iap`. The full
 * argument matters: without it, re-running setup would silently widen a config
 * that had been narrowed. Empty when `claude` is absent or the command fails,
 * so setup then behaves as a first-time run.
 */
function listRegisteredProfiles(): Map<string, string> {
  const known = new Set(PROFILES.map((p) => p.name));
  const found = new Map<string, string>();
  try {
    const out = execFileSync('claude', ['mcp', 'list'], { encoding: 'utf8' });
    for (const line of out.split('\n')) {
      const m = line.match(/^asc-([a-z0-9-]+):/);
      if (!m || !known.has(m[1])) continue;
      const spec = line.match(/@erayendes\/asc-mcp\s+(\S+)/);
      found.set(m[1], spec?.[1] ?? m[1]);
    }
  } catch {
    // `claude` not on PATH, or the listing failed — treat as none registered.
  }
  return found;
}

/** Rows to pre-check so the picker opens showing what is already registered. */
function preselect(rows: Row[], registered: Map<string, string>): number[] {
  const picked: number[] = [];
  for (const row of rows) {
    const spec = registered.get(row.profile.name);
    if (spec === undefined) continue;
    if (!row.subProfile) {
      picked.push(row.index);
      continue;
    }
    const chosen = spec.split(':', 2)[1];
    if (chosen === undefined || chosen.split(',').includes(row.subProfile.name)) picked.push(row.index);
  }
  return picked;
}

/**
 * Turn checked rows into CLI arguments. A profile with every sub-profile
 * checked is written plainly — the common case then produces exactly the config
 * it does today, with no colon and no diff noise.
 */
export function selectionToSpecs(rows: Row[], picked: number[]): string[] {
  const chosen = new Set(picked);
  const specs: string[] = [];
  for (const row of rows) {
    if (row.subProfile || !chosen.has(row.index)) continue;
    const subs = rows.filter((r) => r.profile === row.profile && r.subProfile);
    if (!subs.length) {
      specs.push(row.profile.name);
      continue;
    }
    const on = subs.filter((r) => chosen.has(r.index)).map((r) => r.subProfile!.name);
    if (!on.length) continue; // a profile with nothing under it registers nothing
    specs.push(on.length === subs.length ? row.profile.name : `${row.profile.name}:${on.join(',')}`);
  }
  return specs;
}

/**
 * Let the user pick what to register. Already-registered profiles come
 * pre-checked so unchecking one removes it. A TTY gets the space-to-toggle
 * checklist; a non-interactive run falls back to a typed answer so the wizard
 * still works when piped. Returns null when the picker was cancelled (Esc/^C);
 * an empty array is a deliberate "none" and is honoured (removes everything).
 */
async function selectProfiles(
  ask: (q: string, required?: boolean) => Promise<string>,
  rows: Row[],
  preselected: number[]
): Promise<string[] | null> {
  const title =
    '\nWhich profiles do you want registered?\n' +
    'Already-registered ones are checked — uncheck to remove, check to add.\n' +
    'Checking a profile opens its sub-profiles, all on; uncheck the ones you\n' +
    "don't need. Every tool loads into every session, so leaner is faster.";

  if (process.stdin.isTTY) {
    const picked = await runChecklist(rows.map((r) => r.item), { title, preselected });
    if (picked === null) return null; // cancelled — leave registration untouched
    return selectionToSpecs(rows, picked);
  }

  const answer = (
    await ask('Profiles to register — comma-separated names, or "all" (default): ', false)
  ).trim();
  if (!answer || answer.toLowerCase() === 'all') return PROFILES.map((p) => p.name);
  const wanted = answer.split(',').map((s) => s.trim().replace(/^asc-/, '')).filter(Boolean);
  return wanted.filter((spec) => {
    try {
      resolveSelection(spec);
      return true;
    } catch (err) {
      console.log(`  Skipping "${spec}": ${(err as Error).message.split('\n')[0]}`);
      return false;
    }
  });
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
        const rows = buildRows();
        const registered = listRegisteredProfiles();
        const chosen = await selectProfiles(ask, rows, preselect(rows, registered));
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

    const rows = buildRows();
    const registered = listRegisteredProfiles();
    const chosen = await selectProfiles(ask, rows, preselect(rows, registered));
    const picked = chosen ?? []; // null = picker cancelled; keep saving creds regardless

    // A bundle ID is per-app, not account-global, and only the StoreKit tools
    // use it — so ask for it only when a selection actually carries them, not
    // as a blanket setup question.
    let bundleId: string | undefined;
    let environment: 'Production' | 'Sandbox' | undefined;
    if (picked.some((spec) => manualToolsFor(resolveSelection(spec)).some((t) => t.startsWith('storekit__')))) {
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
  chosen: string[],
  registered: Map<string, string>,
  ask: (q: string, required?: boolean) => Promise<string>
): Promise<void> {
  const nameOf = (spec: string): string => spec.split(':', 1)[0];
  const chosenNames = new Set(chosen.map(nameOf));
  // A profile whose sub-profile selection changed is re-registered: same server
  // name, different argument. Comparing names alone would drop the change.
  const toAdd = chosen.filter((spec) => registered.get(nameOf(spec)) !== spec);
  const toRemove = [...registered.keys()].filter((n) => !chosenNames.has(n));

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
  if (toAdd.length) {
    console.log(
      `  + add:    ${toAdd
        .map((spec) => (registered.has(nameOf(spec)) ? `asc-${spec} (was ${registered.get(nameOf(spec))})` : `asc-${spec}`))
        .join(', ')}`
    );
  }
  if (toRemove.length) console.log(`  - remove: ${toRemove.map((n) => `asc-${n}`).join(', ')}`);
  const answer = (await ask('Apply these changes? [Y/n]: ', false)).trim();
  if (/^n/i.test(answer)) {
    console.log('Left registration unchanged.');
    return;
  }

  for (const spec of toAdd) {
    const name = nameOf(spec);
    try {
      // Re-registering the same server name needs the old entry gone first.
      if (registered.has(name)) {
        execFileSync('claude', ['mcp', 'remove', `asc-${name}`], { stdio: 'ignore' });
      }
      execFileSync(
        'claude',
        ['mcp', 'add', '-s', 'user', `asc-${name}`, '--', 'npx', '-y', '@erayendes/asc-mcp', spec],
        { stdio: 'ignore' }
      );
      console.log(`  ✓ added asc-${name}${spec === name ? '' : ` (${spec})`}`);
    } catch (err) {
      console.log(`  ✗ add asc-${name}: ${(err as Error).message.split('\n')[0]}`);
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

function printManualRegistration(chosen: string[]): void {
  // npx form is portable — no absolute install path baked into the user's
  // config, works the same however the package was installed.
  const entries = chosen
    .map(
      (spec) =>
        `    "asc-${spec.split(':', 1)[0]}": { "command": "npx", "args": ["-y", "@erayendes/asc-mcp", ${JSON.stringify(spec)}] }`
    )
    .join(',\n');
  const cliLines = chosen.map((spec) => `  ${registerCommand(spec)}`).join('\n');

  console.log(
    `\nRegister ${chosen.length} profile${chosen.length === 1 ? '' : 's'} one of these two ways:\n\n` +
      'A) Run these in your terminal (Claude Code CLI):\n\n' +
      cliLines +
      '\n\nB) Or paste this into your MCP client config — no env block needed:\n\n' +
      '{\n  "mcpServers": {\n' + entries + '\n  }\n}\n\n' +
      'Then restart your client and ask it to check the App Store Connect connection.'
  );
}
