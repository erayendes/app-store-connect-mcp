#!/usr/bin/env node
import { realpathSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './core/config.js';
import { ConfigError } from './core/errors.js';
import {
  createServer,
  createRemovedProfileServer,
  servedToolCount,
  VERSION,
} from './server.js';
import { ALL_DOMAINS, DEFAULT_DOMAINS } from './core/registry.js';
import { OPERATIONS, SPEC_VERSION } from './generated/operations.js';
import { PROFILES, REMOVED_PROFILES, resolveSelection, toolCountFor } from './profiles.js';

/** Exported so a test can prove the profile list here never drifts from the code. */
export function helpText(): string {
  return `Heimdall — App Store Connect MCP (asc-mcp) v${VERSION}
MCP server for the Apple App Store Connect API (spec v${SPEC_VERSION}).

Usage:
  npx -y @erayendes/asc-mcp [profile] [options]
  npx -y @erayendes/asc-mcp setup

One install backs many small MCP servers: pass a profile name and only that
profile's tools are served (as "asc-<profile>"). Add one entry per profile to
your client config and pick per project. No profile = the classic combined
server.

A profile can be narrowed to some of its sub-profiles with a colon:
  asc-mcp monetization                    everything the profile carries
  asc-mcp monetization:subscription-pricing,subscription-offers

Profiles:
${PROFILES.map((p) => {
  const subs = p.subProfiles.filter((s) => s.name).map((s) => s.name);
  const head = `  ${p.name.padEnd(18)} ${p.description}`;
  return subs.length ? `${head}\n${' '.repeat(21)}sub-profiles: ${subs.join(', ')}` : head;
}).join('\n')}

Commands:
  setup                  Interactive one-time credential setup shared by every
                         profile (writes ~/.config/asc-mcp, key to Keychain).
                         Also registers profiles with the MCP clients it finds.
  register <profile...>  Register profiles without a terminal — for an AI agent
                         acting on your behalf. Asks for nothing, never touches
                         credentials, and only adds (setup is what removes).
                         --clients=<ids>  limit to some clients; default is
                         every one found on this machine.

Options:
  --domains=<list>       (no-profile mode) Comma-separated domains, or "all".
                         Default: ${DEFAULT_DOMAINS.join(',')}
  --read-only            Expose only tools that cannot modify anything.
  --confirm              Ask before EVERY mutating tool, not just the risky
                         ones. ASC_CONFIRM_WRITES=1 does the same.
  --no-confirm           Never ask. The client's own tool approval is then the
                         only gate. ASC_CONFIRM_WRITES=0 does the same.
                         By default Heimdall asks (via MCP elicitation) before
                         a revenue, destructive, infrastructure or access level
                         write and stays quiet on the rest.
  --include-deprecated   Also load operations Apple has marked deprecated.
  --dry-run              Writes never reach Apple: each mutating call returns
                         what WOULD have been sent (method, path, body, risk)
                         after validation. Reads run normally. ASC_DRY_RUN=1
                         does the same.
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
`;
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);

  if (argv.includes('--help') || argv.includes('-h')) {
    console.log(helpText());
    return;
  }
  if (argv.includes('--version') || argv.includes('-v')) {
    console.log(VERSION);
    return;
  }

  const positional = argv.filter((a) => !a.startsWith('-'));

  if (positional[0] === 'register') {
    const { runRegister } = await import('./setup.js');
    const clients = argv
      .find((a) => a.startsWith('--clients='))
      ?.slice('--clients='.length)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      runRegister(positional.slice(1), clients);
    } catch (err) {
      console.error(`\n${(err as Error).message}\n`);
      process.exit(1);
    }
    return;
  }

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

  // A profile that no longer exists starts anyway, with a single tool that
  // explains where its tools went — see createRemovedProfileServer.
  const removedName = positional[0]?.split(':', 1)[0];
  if (removedName && REMOVED_PROFILES[removedName]) {
    const server = createRemovedProfileServer(removedName);
    await server.connect(new StdioServerTransport());
    console.error(
      `asc-${removedName} v${VERSION}: this profile was removed. ` +
        `${REMOVED_PROFILES[removedName].summary}`
    );
    return;
  }

  let selection;
  if (positional.length) {
    try {
      selection = resolveSelection(positional[0]);
    } catch (err) {
      console.error((err as Error).message);
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

  const server = createServer(config, selection);
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // stderr is safe: stdout carries the MCP protocol itself.
  //
  // The count is what tools/list will actually answer, not what the profile
  // maps. Those differ by configuration — StoreKit needs a bundle id,
  // --read-only removes writes, --include-deprecated adds tools — and quoting
  // the mapped number meant every client showed something else.
  const served = servedToolCount(server);
  const scope = selection
    ? `asc-${selection.profile.name}` +
      (selection.partial ? `:${selection.subProfiles.map((s) => s.name).join(',')}` : '') +
      ` (${served ?? toolCountFor(selection)} tools)`
    : 'asc-mcp';
  console.error(
    `${scope} v${VERSION} ready (spec ${SPEC_VERSION}${config.readOnly ? ', read-only' : ''})`
  );
}

/**
 * Only when run as the binary: importing this module (a test reading helpText)
 * must not start a server on stdio.
 *
 * The realpath matters. `npm install -g` and `npx` both invoke the bin through
 * a symlink, so argv[1] is `/opt/homebrew/bin/asc-mcp` while import.meta.url is
 * the file it points at. Comparing them raw makes every installed copy exit 0
 * without a word — no banner, no error, just a client reporting "failed to
 * connect" and nothing to go on.
 */
function invokedAsBinary(): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return import.meta.url === pathToFileURL(realpathSync(entry)).href;
  } catch {
    return false;
  }
}

if (invokedAsBinary()) {
  main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
