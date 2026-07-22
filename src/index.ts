#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './core/config.js';
import { ConfigError } from './core/errors.js';
import { createServer, VERSION } from './server.js';
import { ALL_DOMAINS, DEFAULT_DOMAINS } from './core/registry.js';
import { OPERATIONS, SPEC_VERSION } from './generated/operations.js';
import { PROFILES, resolveProfile } from './profiles.js';

function printHelp(): void {
  console.log(`Heimdall — App Store Connect MCP (asc-mcp) v${VERSION}
MCP server for the Apple App Store Connect API (spec v${SPEC_VERSION}).

Usage:
  npx -y @erayendes/asc-mcp [profile] [options]
  npx -y @erayendes/asc-mcp setup

One install backs many small MCP servers: pass a profile name and only that
profile's tools are served (as "asc-<profile>"). Add one entry per profile to
your client config and pick per project. No profile = the classic combined
server.

Profiles:
${PROFILES.map((p) => `  ${p.name.padEnd(20)} ${p.description}`).join('\n')}

Commands:
  setup                  Interactive one-time credential setup shared by every
                         profile (writes ~/.config/asc-mcp, key to Keychain).

Options:
  --domains=<list>       (no-profile mode) Comma-separated domains, or "all".
                         Default: ${DEFAULT_DOMAINS.join(',')}
  --read-only            Expose only tools that cannot modify anything.
  --include-deprecated   Also load operations Apple has marked deprecated.
  --version              Print version and exit.
  --help                 Print this message.

Available domains (${OPERATIONS.length} operations total):
${ALL_DOMAINS.map((d) => `  ${d}`).join('\n')}

Credentials (in resolution order):
  1. Environment: ASC_KEY_ID, ASC_ISSUER_ID, and one of ASC_PRIVATE_KEY /
     ASC_PRIVATE_KEY_KEYCHAIN ("service/account", macOS) / ASC_PRIVATE_KEY_PATH.
     Optional: ASC_VENDOR_NUMBER (sales/finance reports), ASC_BUNDLE_ID
     (StoreKit 2), ASC_ENVIRONMENT (Sandbox|Production).
  2. Shared config written by "npx -y @erayendes/asc-mcp setup" — recommended when
     running several profiles, so credentials live in exactly one place.
`);
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);

  if (argv.includes('--help') || argv.includes('-h')) {
    printHelp();
    return;
  }
  if (argv.includes('--version') || argv.includes('-v')) {
    console.log(VERSION);
    return;
  }

  const positional = argv.filter((a) => !a.startsWith('-'));

  if (positional[0] === 'setup') {
    const { runSetup } = await import('./setup.js');
    try {
      await runSetup();
    } catch (err) {
      // Setup is user-facing: print the message on its own, not a raw stack.
      console.error(`\nSetup failed: ${(err as Error).message}\n`);
      process.exit(1);
    }
    return;
  }

  let profile;
  if (positional.length) {
    profile = resolveProfile(positional[0]);
    if (!profile) {
      console.error(
        `Unknown profile "${positional[0]}".\n` +
          `Available: ${PROFILES.map((p) => p.name).join(', ')}\n` +
          `Or run with no profile for the combined server.`
      );
      process.exit(1);
    }
  }

  let config;
  try {
    config = loadConfig(argv);
  } catch (err) {
    if (err instanceof ConfigError) {
      console.error(`\nConfiguration error\n\n${err.message}\n`);
      process.exit(1);
    }
    throw err;
  }

  const server = createServer(config, profile);
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // stderr is safe: stdout carries the MCP protocol itself.
  console.error(
    `${profile ? `asc-${profile.name}` : 'asc-mcp'} v${VERSION} ready ` +
      `(spec ${SPEC_VERSION}${config.readOnly ? ', read-only' : ''})`
  );
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
