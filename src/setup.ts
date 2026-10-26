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
import { readFileSync, realpathSync, writeFileSync, chmodSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { writeKeychainPassword } from './core/keychain.js';
import {
  readSharedConfig,
  writeSharedConfig,
  sharedConfigDir,
  sharedConfigPath,
  type SharedConfig,
} from './core/shared-config.js';
import {
  PROFILES,
  TOKENS_PER_TOOL,
  manualToolsFor,
  resolveSelection,
  type Profile,
  type SubProfile,
} from './profiles.js';
import { TokenProvider, type JwtCredentials } from './core/jwt.js';
import { loadConfig } from './core/config.js';
import { AscHttpClient } from './core/http.js';
import { AscApiError } from './core/errors.js';
import { runChecklist, type ChecklistItem } from './checklist.js';
import { installSkill, removeSkill } from './skill.js';
import {
  CLIENTS,
  OTHER_CLIENT,
  applyToClient,
  clientHint,
  isPresent,
  listRegistered,
  manualBlock,
  serverName,
  profileOfServer,
  type McpClient,
  PACKAGE,
  claudeDesktop,
  type ChangeResult,
  isRunning,
  readRegistrations,
  registrationBlock,
  type Registration,
} from './clients.js';

type Ask = (q: string, required?: boolean) => Promise<string>;

/**
 * One picker row. Profiles are top-level; their sub-profiles hang underneath
 * and only appear once the profile is checked, so the list opens at 17 rows
 * instead of 46 and still lets someone trim a 192-tool profile down.
 */
export interface Row {
  index: number;
  item: ChecklistItem;
  profile: Profile;
  subProfile?: SubProfile;
}

/** Tools a row serves, excluding the core set every server carries anyway. */
const subProfileToolCount = (s: SubProfile): number => s.operations.length + s.manualTools.length;

/**
 * A profile serves the *union* of its sub-profiles, not their sum.
 * Some tools sit in more than one sub-profile on purpose — the screenshot and
 * preview tools belong to every page that can list a set — so adding the rows
 * up counts them twice and the picker promises tools the server never loads.
 */
const profileToolCount = (p: Profile): number =>
  new Set(p.subProfiles.flatMap((s) => [...s.operations, ...s.manualTools])).size;

/**
 * The key roles each choice works with, from docs/ROLES_en.md — keep the two
 * in step. The page intersects them over everything picked and recommends the
 * narrowest role left; a key carries one role, so Admin is the fallback that
 * covers any mix.
 */
const APP_MANAGER = ['App Manager', 'Admin'];
export const ROLES: Record<string, string[]> = {
  access: ['App Manager', 'Developer', 'Admin'],
  'access:user-management': ['Admin'],
  analytics: ['Sales', 'Finance', 'Admin'],
  'distribution:builds': ['Developer', 'App Manager', 'Admin'],
  marketing: ['Marketing', 'App Manager', 'Admin'],
  'marketing:customer-reviews': ['Customer Support', 'Marketing', 'App Manager', 'Admin'],
  provisioning: ['Admin'],
  testflight: ['Developer', 'App Manager', 'Admin'],
  webhooks: ['Admin'],
  'xcode-cloud': ['Developer', 'App Manager', 'Admin'],
};

/** Key roles from narrowest to widest: the first one every pick allows is the one to suggest. */
export const NARROW_FIRST = ['Customer Support', 'Sales', 'Finance', 'Marketing', 'Developer', 'App Manager', 'Admin'];

const specOfRow = (row: Row): string =>
  row.subProfile ? `${row.profile.name}:${row.subProfile.name}` : row.profile.name;

/** The roles a key may have for one row to work. */
export const rolesFor = (row: Row): string[] =>
  ROLES[specOfRow(row)] ?? ROLES[row.profile.name] ?? APP_MANAGER;

/** Tools one row serves, as its picker label states them. */
export const rowTools = (row: Row): number => Number(/\((\d+)\)$/.exec(row.item.label)?.[1] ?? 0);

/** The rows a selection registers: each picked part, or a picked profile that has none. */
export function leafRows(rows: Row[], specs: string[]): Row[] {
  const out: Row[] = [];
  for (const spec of specs) {
    const [name, list] = spec.split(':', 2);
    const parts = rows.filter((r) => r.profile.name === name && r.subProfile);
    if (!parts.length) {
      const row = rows.find((r) => r.profile.name === name);
      if (row) out.push(row);
      continue;
    }
    const wanted = list?.split(',');
    out.push(...parts.filter((r) => !wanted || wanted.includes(r.subProfile!.name)));
  }
  return out;
}

/**
 * The narrowest role that covers every pick, and why. A key carries one role,
 * so when the picks agree on none narrower, Admin is the answer.
 */
export function neededRole(picked: Row[]): { role: string; why: string } {
  const role = NARROW_FIRST.find((name) => picked.every((r) => rolesFor(r).includes(name))) ?? 'Admin';
  if (role !== 'Admin') return { role, why: 'That is the narrowest role that covers everything you picked. Narrower is safer.' };
  const forcing = picked.filter((r) => rolesFor(r).length === 1).map(specOfRow);
  return {
    role,
    why: forcing.length
      ? `Because you picked ${forcing.join(', ')}, which only Admin can manage.`
      : 'A key has one role, and no narrower role covers all of these together.',
  };
}

/**
 * Whether a key is Admin: only Admin can list team members, and that is the one
 * fact about its role Apple will tell. null when it cannot tell (offline).
 */
export async function keyIsAdmin(credentials: JwtCredentials): Promise<boolean | null> {
  try {
    await new AscHttpClient(new TokenProvider(credentials), { baseUrl: process.env.ASC_BASE_URL || undefined }).get(
      '/v1/users',
      { limit: 1 }
    );
    return true;
  } catch (err) {
    return err instanceof AscApiError && err.status === 403 ? false : null;
  }
}

/** What a key's Admin-ness means for the role the picks need, in one line. */
export function keyFit(admin: boolean | null, role: string): string {
  if (admin === null) return '';
  if (admin) {
    return role === 'Admin'
      ? '✓ It is an Admin key, which is what you need.'
      : `It is an Admin key, so it can do more than you picked. It will work; a key with the ${role} role would be safer.`;
  }
  return role === 'Admin'
    ? "It isn't an Admin key, so the parts marked [Admin key] won't work. Use an Admin key, or pick again."
    : `It isn't an Admin key. It will work if its role is ${role} or one that covers it.`;
}

export function buildRows(): Row[] {
  const rows: Row[] = [];
  const size = (n: number): string => `~${Math.max(1, Math.round((n * TOKENS_PER_TOOL) / 1000))}k`;
  // Drop the leading "Category: " heading; lowercase for a uniform look.
  const detail = (text: string): string => text.replace(/^[^:]*:\s*/, '').toLowerCase();

  for (const profile of PROFILES) {
    const subs = profile.subProfiles.filter((s) => s.name);
    const total = profileToolCount(profile);
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
 * What each chosen client already has registered, plus a merged view.
 *
 * The merged map is only used to pre-check the profile picker, so a profile
 * registered anywhere opens checked. Reconciliation uses the per-client maps —
 * merging those would remove a profile from a client that still has it just
 * because a sibling client does not.
 *
 * Values keep the full argument (`monetization:iap`): dropping the colon would
 * silently widen a config the user had narrowed.
 */
export function registeredAcross(clients: McpClient[]): {
  perClient: Map<string, Registration[]>;
  union: Map<string, string>;
  /** Per client, the entries that run another release channel (beta or stable) than this one. */
  stale: Map<string, Set<string>>;
} {
  const known = new Set(PROFILES.map((p) => p.name));
  const perClient = new Map<string, Registration[]>();
  const union = new Map<string, string>();
  const stale = new Map<string, Set<string>>();
  for (const client of clients) {
    const other = new Set<string>();
    const entries = readRegistrations(client);
    const found = new Map(entries.filter((r) => r.name !== '*').map((r) => [r.name, r.spec ?? profileOfServer(r.name)!]));
    for (const reg of entries) if (reg.pkg && reg.pkg !== PACKAGE) other.add(reg.name);
    perClient.set(client.id, entries);
    stale.set(client.id, other);
    for (const [name, spec] of found) {
      const profile = profileOfServer(name);
      if (profile && known.has(profile)) union.set(profile, spec);
    }
  }
  return { perClient, union, stale };
}

/**
 * Ask which clients to register with, pre-checking the ones on this machine.
 *
 * Clients that were not found stay listed but unchecked — someone installing
 * Cursor tomorrow can check it today. "Other" is always last and always
 * available, because no list of clients stays complete for long.
 *
 * Returns null when cancelled. An empty selection means "register nowhere",
 * which is a legitimate answer after a credentials-only run.
 */
export async function selectClients(ask: Ask): Promise<McpClient[] | null> {
  const all = [...CLIENTS, OTHER_CLIENT];
  const items: ChecklistItem[] = all.map((c) => ({
    label: c.label,
    hint: clientHint(c),
  }));
  const preselected = all.map((c, i) => (c.id !== 'other' && isPresent(c) ? i : -1)).filter((i) => i >= 0);
  const title =
    '\n🤖 Which AI apps should get these profiles?\n' +
    'The ones found on this machine are checked. None of them share a config,\n' +
    'so a profile registered with one is invisible to the others.\n' +
    'Uncheck an app that has Heimdall to remove it from that app.';

  if (process.stdin.isTTY) {
    const picked = await runChecklist(items, { title, preselected });
    return picked === null ? null : picked.map((i) => all[i]);
  }

  const found = all.filter((c) => c.id !== 'other' && isPresent(c));
  const answer = (
    await ask(
      `Clients to register — comma-separated, or Enter for the ones found (${
        found.map((c) => c.id).join(', ') || 'none'
      }): `,
      false
    )
  ).trim();
  if (!answer) return found;
  const wanted = new Set(answer.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean));
  return all.filter((c) => wanted.has(c.id) || wanted.has(c.label.toLowerCase()));
}

/** Rows to pre-check so the picker opens showing what is already registered. */
export function preselect(rows: Row[], registered: Map<string, string>): number[] {
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
    '\n🧩 Which profiles do you need?\n' +
    'Already-registered ones are checked — uncheck to remove, check to add.\n' +
    'Checking a profile opens its sub-profiles, all on; uncheck the ones you\n' +
    "don't need. Every tool loads into every session, so leaner is faster.\n" +
    '[Admin key] works only with an Admin key · [vendor no.] needs your vendor number.';

  // The tags go on copies: the rows' own labels carry the tool count others parse.
  const tag = (r: Row): string =>
    (rolesFor(r).length === 1 ? ' [Admin key]' : '') +
    (r.profile.name === 'analytics' && !r.subProfile ? ' [vendor no.]' : '');
  if (process.stdin.isTTY) {
    const items = rows.map((r) => ({ ...r.item, label: r.item.label + tag(r) }));
    const picked = await runChecklist(items, { title, preselected });
    if (picked === null) return null; // cancelled — leave registration untouched
    return selectionToSpecs(rows, picked);
  }

  const answer = (
    await ask('Profiles to register — comma-separated names, or "all" (default): ', false)
  ).trim();
  if (!answer || answer.toLowerCase() === 'all') return PROFILES.map((p) => p.name);
  const wanted = answer.split(',').map((s) => s.trim().replace(/^asc-/i, '').toLowerCase()).filter(Boolean);
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

/** Where the Key ID, Issuer ID and .p8 come from. */
export const KEYS_URL = 'https://appstoreconnect.apple.com/access/integrations/api';

/**
 * Store the private key and write the shared config. On macOS the key goes to
 * the Keychain. Elsewhere the config points at the .p8: at the file the user
 * named in the terminal, or, when only its contents arrived (the browser
 * setup cannot see paths), at a copy only this user can read.
 */
export function saveCredentials(
  fields: Omit<SharedConfig, 'privateKeyKeychain' | 'privateKeyPath'>,
  pem: string,
  resolvedPath: string | undefined,
  log: (line: string) => void = console.log
): string {
  const shared: SharedConfig = { ...fields };
  if (process.platform === 'darwin') {
    const account = `AuthKey_${fields.keyId}`;
    writeKeychainPassword(KEYCHAIN_SERVICE, account, pem);
    shared.privateKeyKeychain = `${KEYCHAIN_SERVICE}/${account}`;
    log(`\n✓ Private key stored in the macOS Keychain (${KEYCHAIN_SERVICE}/${account}).`);
    log('  The .p8 file is no longer needed at runtime — archive it somewhere safe.');
  } else if (resolvedPath) {
    shared.privateKeyPath = resolvedPath;
    log(`\n✓ Using the .p8 at ${resolvedPath} (keep the file in place).`);
  } else {
    const dir = sharedConfigDir();
    mkdirSync(dir, { recursive: true, mode: 0o700 });
    const copy = join(dir, `AuthKey_${fields.keyId}.p8`);
    writeFileSync(copy, `${pem}\n`, { mode: 0o600 });
    chmodSync(copy, 0o600);
    shared.privateKeyPath = copy;
    log(`\n✓ Private key saved to ${copy}, readable only by you.`);
  }
  const configPath = writeSharedConfig(shared);
  log(`✓ Shared config written to ${configPath}.`);
  log('  Every profile reads it automatically; env vars still win when set.');
  return configPath;
}

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

export async function verifyCredentials(
  keyId: string,
  issuerId: string,
  pem: string
): Promise<'ok' | 'invalid' | 'unreachable'> {
  try {
    const tokens = new TokenProvider({ keyId, issuerId, privateKey: pem });
    // Honour ASC_BASE_URL like every other call does. Without it this was the
    // one request in the codebase pinned to Apple no matter what, so the
    // verification step could not be exercised against a fixture server — not
    // by a test, and not by the README demo recording.
    await new AscHttpClient(tokens, { baseUrl: process.env.ASC_BASE_URL || undefined }).get(
      '/v1/apps',
      { limit: 1 }
    );
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

  try {
    // Needs first, then the key: what was picked decides which role the key
    // should have, and that is worth knowing before creating one.
    // Claude Desktop writes its own settings back while it runs; a change made
    // while it is open never reaches it. Say so before anything is asked.
    const desktop = claudeDesktop();
    if (desktop === 'inside') {
      console.log(
        `\n⚠️  This setup is running inside Claude Desktop. Desktop writes its own settings back while it is open,\n` +
          `   so Claude Desktop itself can't be updated from here. Your other AI apps can.\n` +
          `   To include Claude Desktop: quit it, open Terminal and run  npx -y ${PACKAGE} setup`
      );
      if (/^n/i.test(await ask('Continue for your other AI apps? [Y/n]: ', false))) return;
    } else if (desktop === 'open') {
      console.log(
        `\n⚠️  Claude Desktop is open. It writes its own settings back while it runs, so the change wouldn't reach it.\n` +
          `   Quit Claude Desktop (⌘Q) before you go on.`
      );
      for (;;) {
        const answer = await ask('Press Enter once it is closed (or type s to skip Claude Desktop): ', false);
        if (/^s/i.test(answer) || !isRunning('Claude')) break;
        console.log('   Claude Desktop is still open.');
      }
    }

    console.log('\n🧩 First, what do you need? You can change this any time, so pick the narrowest set you can.');
    const rows = buildRows();
    const found = CLIENTS.filter((c) => isPresent(c));
    const chosen = await selectProfiles(ask, rows, preselect(rows, registeredAcross(found).union));
    if (chosen === null) {
      console.log('\nCancelled — nothing was changed.');
      return;
    }
    const picked = leafRows(rows, chosen);
    const tools = picked.reduce((n, r) => n + rowTools(r), 0);
    console.log(`\n📦 Picked: ${tools} tools · about ${Math.max(1, Math.round((tools * TOKENS_PER_TOOL) / 1000))}k tokens for the AI to read.`);
    const { role, why } = neededRole(picked);
    console.log(`🔑 You need a key with the ${role} role. ${why}`);

    // A saved key is offered first, with whether it fits.
    const existing = readSharedConfig();
    let reuse = false;
    if (existing) {
      let admin: boolean | null = null;
      try {
        admin = await keyIsAdmin(loadConfig([]).credentials);
      } catch {
        // The saved key could not be read back (Keychain entry gone): offer it anyway.
      }
      const tag = admin === true ? ' (Admin)' : admin === false ? ' (not Admin)' : '';
      console.log(`\nFound a saved key: ${existing.keyId}${tag}.`);
      const fit = keyFit(admin, role);
      if (fit) console.log(fit);
      reuse = !/^n/i.test(await ask('Use it? [Y/n]: ', false));
    }

    let credentials: { keyId: string; issuerId: string; pem: string; resolvedPath: string } | undefined;
    if (!reuse) {
      console.log(`\nCreate a key with the ${role} role at:\n  ${KEYS_URL}`);
      console.log("Only the Account Holder or an Admin can create keys; if that isn't you, ask one of them for it.");
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

      // Gather Key ID + Issuer ID + .p8, then verify against Apple. On
      // rejection, re-enter all three (they must belong to the same key);
      // offline, save with a warning rather than blocking the setup.
      for (;;) {
        const keyId = await askValid(
          '\nKey ID: ',
          isValidKeyId,
          'A Key ID is 8–12 letters and digits, e.g. "ABC123XYZ9". Check it and try again.'
        );
        const issuerId = await askValid(
          'Issuer ID: ',
          isValidIssuerId,
          'An Issuer ID is a UUID, e.g. "57246e4f-1a2b-4c3d-9e8f-0123456789ab". Check it and try again.'
        );
        const { resolvedPath, pem } = await readP8(ask);

        console.log('\n⏳ Verifying with Apple…');
        const verdict = await verifyCredentials(keyId, issuerId, pem);
        if (verdict === 'invalid') {
          console.log(
            '✗ Apple rejected these credentials. Make sure the Key ID, Issuer ID and .p8 ' +
              'all belong to the same key, then re-enter them.\n'
          );
          continue;
        }
        if (verdict === 'ok') {
          console.log('✅ Credentials verified.');
          const fit = keyFit(await keyIsAdmin({ keyId, issuerId, privateKey: pem }), role);
          if (fit) console.log(fit);
        } else {
          console.log(
            '⚠️  Could not reach Apple to verify (offline?). Saving anyway — run a status check once you are online.'
          );
        }
        credentials = { keyId, issuerId, pem, resolvedPath };
        break;
      }
    }

    // Only asked when a pick uses it, and not again when the saved key has one.
    let vendorNumber: string | undefined;
    if (picked.some((r) => r.profile.name === 'analytics') && !(reuse && existing?.vendorNumber)) {
      vendorNumber =
        (await ask(
          '\nVendor number (Payments and Financial Reports, top left under your company name; Enter to skip): ',
          false
        )) || undefined;
    }

    if (credentials) {
      saveCredentials(
        { keyId: credentials.keyId, issuerId: credentials.issuerId, vendorNumber },
        credentials.pem,
        credentials.resolvedPath
      );
    } else if (vendorNumber && existing) {
      console.log(`\n✓ Shared config updated at ${writeSharedConfig({ ...existing, vendorNumber })}.`);
    }

    const clients = await selectClients(ask);
    if (clients === null) {
      console.log('\nApp selection cancelled — registration left unchanged.');
      return;
    }
    await reconcileRegistration(clients, chosen, registeredAcross(clients), ask);
  } finally {
    rl.close();
    // The picker leaves stdin flowing so later prompts work; release it now so
    // the process can exit instead of hanging on an open TTY handle.
    if (process.stdin.isTTY) process.stdin.pause();
  }
}

/** One client's share of a registration run. */
export interface ClientPlan {
  client: McpClient;
  /** Everything to write, the channel moves included. */
  toAdd: string[];
  toRemove: string[];
  /** The part of toAdd that only changes channel (beta/stable); shown apart, since nothing new arrives. */
  toSwitch: string[];
  /** Existing entries that setup reports but never changes. */
  userManaged: string[];
  /** Existing entries whose arguments will be rewritten, with flags only. */
  rewrites: string[];
  migrations: Map<string, string>;
}

const shownEntry = (reg: Registration): string => {
  const flags = (reg.entry?.args as string[] | undefined)?.filter((arg) => arg.startsWith('-') && arg !== '-y')
    .map((arg) => arg.replace(/=.*/, '=<hidden>')) ?? [];
  return `${reg.name}${flags.length ? ` (${flags.join(' ')})` : ''}`;
};

/**
 * What each client would gain and lose.
 *
 * A profile whose sub-profile selection changed counts as an add: same server
 * name, different argument. Comparing names alone would miss a profile that
 * stayed checked while its sub-profiles were trimmed.
 */
export function planChanges(
  clients: McpClient[],
  chosen: string[],
  registeredPerClient: Map<string, Registration[]>,
  { prune, stale }: { prune: boolean; stale?: Map<string, Set<string>> }
): ClientPlan[] {
  const chosenNames = new Set(chosen.map(serverName));
  return clients
    .map((client) => {
      const entries = registeredPerClient.get(client.id) ?? [];
      const block = registrationBlock(entries);
      const registered = new Map(entries.filter((r) => !block.managed.includes(r)).map((r) => [r.name, r.spec!]));
      // A name older versions wrote (`ASC-Analytics` before 2.5.0) is the same
      // server under another key; left beside the new one, Claude lists it
      // twice. It moves to the new name — unless setup is pruning it anyway.
      const legacy = [...registered].filter(([n, spec]) => profileOfServer(n) === spec.split(':', 1)[0] && n !== serverName(spec));
      const migrate = legacy
        .map(([, spec]) => spec)
        .filter((spec) => !prune || chosenNames.has(serverName(spec)));
      const wanted = [...new Set([...chosen, ...migrate])];
      // An entry on the other channel is rewritten even when its profiles
      // match: that is how a beta tester's servers follow them back to stable.
      const toAdd = client.targets.length
        ? wanted.filter((spec) => block.canAdd(spec) &&
          (registered.get(serverName(spec)) !== spec || stale?.get(client.id)?.has(serverName(spec))))
        : chosen;
      const migrations = new Map(legacy.map(([name, spec]) => [serverName(spec), name]));
      return {
        client,
        toAdd,
        toSwitch: toAdd.filter((spec) => registered.get(serverName(spec)) === spec),
        userManaged: block.managed.map((r) => r.name === '*' ? `${r.target.where} (unreadable)` : shownEntry(r)),
        rewrites: toAdd.flatMap((spec) => entries.filter((r) => !block.managed.includes(r) &&
          (r.name === serverName(spec) || r.name === migrations.get(serverName(spec)))).map(shownEntry)),
        migrations,
        // `register` never prunes: an agent adding one profile must not silently
        // drop the six the user set up last week.
        toRemove: [
          ...legacy.map(([n]) => n).filter(block.canRemove),
          ...(prune ? [...registered.keys()].filter((n) => block.canRemove(n) && !chosenNames.has(n) && profileOfServer(n) && !legacy.some(([l]) => l === n)) : []),
        ],
      };
    })
    .filter((p) => p.toAdd.length || p.toRemove.length || p.userManaged.length);
}

/**
 * The apps the user unticked that still run Heimdall.
 *
 * Unticking an app says "not here", and people expected it to take Heimdall
 * out; it used to leave the app as it was without a word. It is removed now,
 * and the plan lists it before anything is written, which is what keeps it
 * from being an accident.
 */
export function plansForUnticked(chosen: McpClient[], candidates: McpClient[] = CLIENTS): ClientPlan[] {
  const ids = new Set(chosen.map((c) => c.id));
  return candidates
    .filter((c) => c.targets.length && !ids.has(c.id))
    .map((client) => {
      const entries = readRegistrations(client);
      const block = registrationBlock(entries);
      return { client, toAdd: [], toSwitch: [],
        toRemove: entries.filter((r) => !block.managed.includes(r) && block.canRemove(r.name)).map((r) => r.name),
        userManaged: block.managed.map((r) => r.name === '*' ? `${r.target.where} (unreadable)` : shownEntry(r)),
        rewrites: [], migrations: new Map<string, string>() };
    })
    .filter((p) => p.toRemove.length || p.userManaged.length);
}

/**
 * The plan, one line per client, includes each existing entry to rewrite.
 */
export function printPlan(plan: ClientPlan[], log: (line: string) => void = console.log): void {
  const shown = plan.filter((p) => p.toRemove.length || p.toAdd.length || p.userManaged.length);
  if (!shown.length) {
    log('\n📋 Your profiles stay as they are.');
    return;
  }
  log('\n📋 Planned changes:\n');
  for (const { client, toAdd, toRemove, toSwitch, rewrites, userManaged } of shown) {
    const bits: string[] = [];
    const added = toAdd.filter((s) => !toSwitch.includes(s));
    if (added.length) bits.push(`+ ${added.map(serverName).join(', ')}`);
    if (toRemove.length) bits.push(`- ${toRemove.join(', ')}`);
    if (rewrites.length) bits.push(`rewrite ${rewrites.join(', ')}`);
    if (userManaged.length) bits.push(`user-managed, unchanged: ${userManaged.join(', ')}`);
    log(`  ${client.label.padEnd(24)} ${bits.join('  ')}`);
  }
}

/** "Restart" an app that is open, "open" one that is not; a CLI is restarted. */
function nextStep(clients: McpClient[]): string {
  const closed = (c: McpClient): boolean =>
    c.targets.some((t) => t.kind === 'json' && t.app !== undefined) &&
    !c.targets.some((t) => t.kind === 'json' && t.app !== undefined && isRunning(t.app));
  const open = clients.filter(closed).map((c) => c.label);
  const restart = clients.filter((c) => !closed(c)).map((c) => c.label);
  const verbs = [
    ...(restart.length ? [`restart ${list(restart)}`] : []),
    ...(open.length ? [`open ${list(open)}`] : []),
  ].join(' and ');
  return verbs.charAt(0).toUpperCase() + verbs.slice(1);
}

/**
 * Carry out a plan, reporting per client.
 *
 * A client that fails does not stop the others — its block is printed instead,
 * so a Cursor config full of comments cannot cost anyone a working Claude
 * setup.
 */
export function applyPlan(plan: ClientPlan[], log: (line: string) => void = console.log): void {
  const restart: McpClient[] = [];
  for (const { client, toAdd, toRemove, toSwitch, userManaged, migrations } of plan) {
    if (userManaged.length) log(`${client.label}: user-managed, unchanged: ${userManaged.join(', ')}`);
    if (!toAdd.length && !toRemove.length) continue;
    // An entry that only moves to this release's package is written quietly:
    // it is setting this release up, not a change the user made. A failure is
    // still reported, and the client still needs restarting to pick it up.
    const moved = new Set(toSwitch.map(serverName));
    const quiet = (r: ChangeResult): boolean => r.ok && moved.has(/^added (\S+)/.exec(r.message)?.[1] ?? '');
    if (!client.targets.length) {
      // "Other" — nothing to write into, so the block is the whole answer.
      log(`\n${client.label}`);
      log('  add this to your client config:\n');
      log(indent(manualBlock(client, toAdd)));
      continue;
    }
    const { results, needsManual } = applyToClient(client, toAdd, toRemove, migrations);
    const shown = results.filter((r) => !quiet(r));
    if (shown.length) log(`\n${client.label}`);
    for (const r of shown) log(`  ${r.ok ? '✓' : '✗'} ${r.message}`);
    // The skill follows the servers: installed once anything is registered,
    // removed when the last one goes. Only for clients that read SKILL.md.
    const stillRegistered = listRegistered(client).size > 0;
    const skill = results.some((r) => r.ok)
      ? stillRegistered
        ? installSkill(client.id)
        : removeSkill(client.id)
      : undefined;
    if (skill && (shown.length || !skill.ok)) log(`  ${skill.ok ? '✓' : '✗'} ${skill.message}`);
    if (needsManual && toAdd.length) {
      log('\n  add these by hand:\n');
      log(indent(manualBlock(client, toAdd)));
    }
    if (results.some((r) => r.ok)) restart.push(client);
  }
  if (restart.length) {
    log(`\n🎉 Done. ${nextStep(restart)}, then ask: "Check my App Store Connect connection."`);
  }
}

/**
 * Register the chosen profiles with every chosen client, after confirming.
 *
 * The plan is shown and confirmed once, because this edits files the user did
 * not open.
 */
export async function reconcileRegistration(
  clients: McpClient[],
  chosen: string[],
  registered: ReturnType<typeof registeredAcross>,
  ask: Ask,
  candidates: McpClient[] = CLIENTS
): Promise<void> {
  const plan = [
    ...planChanges(clients, chosen, registered.perClient, { prune: true, stale: registered.stale }),
    ...plansForUnticked(clients, candidates),
  ];
  if (!plan.length) {
    console.log('\nNo changes — every chosen client already matches your selection.');
    return;
  }
  printPlan(plan);
  if (!plan.some((p) => p.toAdd.length || p.toRemove.length)) {
    console.log('No registration changes to apply.');
    return;
  }
  const answer = (await ask('\nApply these changes? [Y/n]: ', false)).trim();
  if (/^n/i.test(answer)) {
    console.log('Left registration unchanged.');
    return;
  }
  applyPlan(plan);
}

const indent = (text: string): string =>
  text
    .split('\n')
    .map((l) => `    ${l}`)
    .join('\n');

/** "Claude, Codex and Cursor" — a sentence, not an array dump. */
const list = (names: string[]): string =>
  names.length < 2 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;

/**
 * Register profiles without a terminal, for an agent acting on the user's behalf.
 *
 * Same detection, same plan, same output as `setup` — only the selection comes
 * from arguments instead of a picker, and no credential is ever asked for. An
 * agent can run this; it must not run `setup`, which needs the user's `.p8`.
 *
 * Additive by design. `setup` reconciles — it removes what you unchecked —
 * because you are looking at the list while you decide. An agent is not, so
 * `register` only ever adds: asking for one profile must not drop the six
 * someone set up last week.
 */
export function runRegister(specs: string[], clientIds?: string[]): void {
  if (!specs.length) {
    throw new Error(
      'register needs at least one profile, e.g. "register monetization analytics".\n' +
        `Available: ${PROFILES.map((p) => p.name).join(', ')}`
    );
  }
  // Validate every spec before touching anything: a typo should cost nothing.
  for (const spec of specs) resolveSelection(spec);

  const known = [...CLIENTS, OTHER_CLIENT];
  let clients: McpClient[];
  if (clientIds?.length) {
    const unknown = clientIds.filter((id) => !known.some((c) => c.id === id));
    if (unknown.length) {
      throw new Error(
        `Unknown client${unknown.length > 1 ? 's' : ''}: ${unknown.join(', ')}.\n` +
          `Available: ${known.map((c) => c.id).join(', ')}`
      );
    }
    clients = known.filter((c) => clientIds.includes(c.id));
  } else {
    clients = CLIENTS.filter(isPresent);
    if (!clients.length) {
      throw new Error(
        'No MCP client found on this machine.\n' +
          `Name one explicitly with --clients=<id>, from: ${known.map((c) => c.id).join(', ')}`
      );
    }
  }

  const { perClient, stale } = registeredAcross(clients);
  const plan = planChanges(clients, specs, perClient, { prune: false, stale });
  if (!plan.length) {
    console.log('No changes — every client already has these profiles.');
    return;
  }
  applyPlan(plan);

  // Registration and credentials are separate steps on purpose: this one has no
  // secret in it, which is why an agent may run it. Say so, or the user is left
  // with servers that start and cannot authenticate.
  if (plan.some((p) => p.toAdd.length || p.toRemove.length) && !readSharedConfig()) {
    console.log(
      '\nNo credentials stored yet. The servers are registered but cannot ' +
        `authenticate until you run this yourself:\n  npx -y ${PACKAGE} setup`
    );
  }
}
