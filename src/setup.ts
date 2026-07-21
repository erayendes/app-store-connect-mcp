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
    const keyId = await ask('Key ID (e.g. 7RDCD6GXG6): ');
    const issuerId = await ask('Issuer ID: ');
    const p8Path = await ask('Path to the .p8 file: ');
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
    const resolvedPath = realpathSync(p8Path.replace(/^~(?=\/)/, process.env.HOME ?? '~'));
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

    const serverPath = process.argv[1];
    const entries = PROFILES.map(
      (p) =>
        `    "asc-${p.name}": { "command": "node", "args": [${JSON.stringify(serverPath)}, ${JSON.stringify(p.name)}] }`
    ).join(',\n');

    console.log(
      '\nAdd the profiles you want to your MCP client config — no env block needed.\n' +
        'Pick per project; each entry is its own small server:\n\n' +
        '{\n  "mcpServers": {\n' + entries + '\n  }\n}\n\n' +
        'Claude Code CLI (one profile shown):\n' +
        `  claude mcp add -s user asc-analytics -- node ${serverPath} analytics\n`
    );
  } finally {
    rl.close();
  }
}
