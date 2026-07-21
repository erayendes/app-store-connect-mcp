/**
 * One-time interactive credential setup shared by every profile.
 *
 * Asks for the App Store Connect key, stores the .p8 in the macOS Keychain
 * (path reference elsewhere), writes the non-secret fields to the shared
 * config file, then prints a ready-to-paste mcpServers block. After this, a
 * profile entry in a client config needs zero environment variables.
 */
import { createInterface } from 'node:readline/promises';
import { readFileSync, realpathSync } from 'node:fs';
import { writeKeychainPassword } from './core/keychain.js';
import {
  writeSharedConfig,
  sharedConfigPath,
  type SharedConfig,
} from './core/shared-config.js';
import { PROFILES } from './profiles.js';

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

  console.log(
    '\nApp Store Connect MCP — shared credential setup\n' +
      'Values come from https://appstoreconnect.apple.com/access/integrations/api\n'
  );

  try {
    const keyId = await ask('Key ID (e.g. ABCD123456): ');
    const issuerId = await ask('Issuer ID (e.g. 12345678-abcd-1234-abcd-1234567890ab): ');
    const p8Path = cleanPath(await ask('Path to the .p8 file (tip: drag the file into this window): '));
    const vendorNumber = await ask(
      'Vendor number (Payments and Financial Reports page; needed for sales/finance reports, Enter to skip): ',
      false
    );
    const bundleId = await ask(
      'App bundle ID (enables StoreKit 2 transaction tools, Enter to skip): ',
      false
    );
    const environment = bundleId
      ? (await ask('StoreKit environment [Production/Sandbox] (default Production): ', false)) ||
        'Production'
      : undefined;

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

    const shared: SharedConfig = {
      keyId,
      issuerId,
      vendorNumber: vendorNumber || undefined,
      bundleId: bundleId || undefined,
      environment: environment === 'Sandbox' ? 'Sandbox' : bundleId ? 'Production' : undefined,
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

    // npx form is portable — no absolute install path baked into the user's
    // config, works the same however the package was installed.
    const entries = PROFILES.map(
      (p) =>
        `    "asc-${p.name}": { "command": "npx", "args": ["-y", "@erayendes/asc-mcp", ${JSON.stringify(p.name)}] }`
    ).join(',\n');

    console.log(
      '\nCredentials are ready. Now register the profiles you want — nothing is\n' +
        'connected until you do this step. Two equivalent ways:\n\n' +
        'A) Claude Code CLI, one line per profile you want:\n' +
        '     claude mcp add -s user asc-analytics -- npx -y @erayendes/asc-mcp analytics\n' +
        '     claude mcp add -s user asc-marketing -- npx -y @erayendes/asc-mcp marketing\n\n' +
        'B) Or paste the block below into your MCP client config (keep only the\n' +
        '   profiles you need) — no env block required:\n\n' +
        '{\n  "mcpServers": {\n' + entries + '\n  }\n}\n\n' +
        'Then restart your client and ask it to check the App Store Connect connection.\n'
    );
  } finally {
    rl.close();
  }
}
