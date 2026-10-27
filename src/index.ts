#!/usr/bin/env node
import { realpathSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { loadConfig } from './core/config.js';
import { ConfigError } from './core/errors.js';
import {
  createServer,
  createUnknownProfileServer,
  servedToolCount,
  VERSION,
} from './server.js';
import { SPEC_VERSION } from './generated/operations.js';
import {
  PROFILES,
  resolveSelection,
  toolCountFor,
  unknownProfileMessage,
  type ProfileSelection,
} from './profiles.js';
import { PACKAGE, serverName } from './clients.js';

/** Exported so a test can prove the profile list here never drifts from the code. */
export function helpText(): string {
  return `Heimdall — App Store Connect MCP (asc-mcp) v${VERSION}
MCP server for the Apple App Store Connect API (spec v${SPEC_VERSION}).

Usage:
  npx -y ${PACKAGE} <profile> [options]
  npx -y ${PACKAGE} setup

One install backs many small MCP servers: pass a profile name and only that
profile's tools are served (as "ASC-<Profile>"). Add one entry per profile to
your client config and pick per project. Register "core" next to them: app
lookup, tool search and the media tools for every screenshot, video, image and
file live there and nowhere else. A profile is required.

A profile can be narrowed to some of its sub-profiles with a colon:
  asc-mcp core                            app lookup, search, media (ASC-Core)
  asc-mcp monetization                    everything the profile carries
  asc-mcp monetization:subscription,subscription-offers
  asc-mcp testflight --with-core          one process: the profile plus core

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
                         Asks first whether to continue in the browser
                         (recommended) or the terminal; these skip the question:
                         --web      the browser (a page on 127.0.0.1 that only
                                    this computer sees)
                         --terminal the terminal
                         --dry-run  with --web: walk through it, save nothing
  register <profile...>  Register profiles without a terminal — for an AI agent
                         acting on your behalf. Asks for nothing, never touches
                         credentials, and only adds (setup is what removes).
                         --clients=<ids>  limit to some clients; default is
                         every one found on this machine.

Options:
  --read-only            Expose only tools that cannot modify anything.
  --confirm              Ask before EVERY mutating tool, not just the risky
                         ones. ASC_CONFIRM_WRITES=1 does the same.
  --no-confirm           Never ask. The client's own tool approval is then the
                         only gate. ASC_CONFIRM_WRITES=0 does the same.
                         By default Heimdall asks (via MCP elicitation) before
                         a revenue, destructive, infrastructure or access level
                         write and stays quiet on the rest.
  --with-core            Also serve the core profile's tools from
                         this server, for a client that runs only one process.
  --dry-run              Writes never reach Apple: each mutating call returns
                         what WOULD have been sent (method, path, body, risk)
                         after validation. Reads run normally. ASC_DRY_RUN=1
                         does the same.
  --version              Print version and exit.
  --help                 Print this message.

Credentials (in resolution order):
  1. Environment: ASC_KEY_ID, ASC_ISSUER_ID, and one of ASC_PRIVATE_KEY /
     ASC_PRIVATE_KEY_KEYCHAIN ("service/account", macOS) / ASC_PRIVATE_KEY_PATH.
     Optional: ASC_VENDOR_NUMBER (sales/finance reports), ASC_BUNDLE_ID
     (default app for StoreKit 2), ASC_ENVIRONMENT (Production|Sandbox).
  2. Shared config written by "npx -y ${PACKAGE} setup" — recommended when
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
  // A 2.x config may still pass these; say so rather than start without them.
  for (const flag of ['--domains', '--include-deprecated']) {
    if (argv.some((a) => a === flag || a.startsWith(`${flag}=`))) console.error(`${flag} was removed in 3.0 and is ignored.`);
  }

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
    try {
      if (argv.includes('--web') || (!argv.includes('--terminal') && (await prefersBrowser()))) {
        const { runWebSetup } = await import('./setup-web.js');
        const port = Number(argv.find((a) => a.startsWith('--port='))?.slice('--port='.length)) || undefined;
        await runWebSetup({ dryRun: argv.includes('--dry-run'), open: !argv.includes('--no-open'), port });
        return;
      }
      const { runSetup } = await import('./setup.js');
      await runSetup();
    } catch (err) {
      // Setup is user-facing: print the message on its own, not a raw stack.
      console.error(`\nSetup failed: ${(err as Error).message}\n`);
      process.exit(1);
    }
    return;
  }

  let selection: ProfileSelection;
  try {
    if (!positional.length) throw new Error('No profile given. Run with --help for the list.');
    selection = resolveSelection(positional[0]);
  } catch (err) {
    // Someone at a terminal reads the error and fixes the argument.
    if (process.stdin.isTTY) {
      console.error((err as Error).message);
      process.exit(1);
    }
    serveUnknownProfile(positional[0] ?? '', (err as Error).message);
    return;
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

  // serveStdio picks the protocol era from the client's opening message and
  // builds the server then — possibly twice, when a probe is discarded. The
  // instance built here for the startup count is handed to the first build.
  let first: ReturnType<typeof createServer> | undefined = createServer(config, selection);
  const served = servedToolCount(first);
  serveStdio(() => {
    const server = first ?? createServer(config, selection);
    first = undefined;
    return server;
  });

  // stderr is safe: stdout carries the MCP protocol itself.
  //
  // The count is what tools/list will actually answer, not what the profile
  // maps. Those differ by configuration — the profile's sub-profiles, and
  // --read-only removes writes — and quoting the mapped number meant every
  // client showed something else.
  const scope =
    serverName(selection.profile.name) +
    (selection.partial ? `:${selection.subProfiles.map((s) => s.name).join(',')}` : '') +
    ` (${served ?? toolCountFor(selection)} tools)`;
  console.error(
    `${scope} v${VERSION} ready (spec ${SPEC_VERSION}${config.readOnly ? ', read-only' : ''})`
  );
}

/**
 * How long a tombstone waits for an MCP client before it gives up and exits.
 * A client sends `initialize` within a second of spawning the process; ten is
 * generous, and short enough that a script piping nothing in is not left
 * hanging.
 */
export const TOMBSTONE_WAIT_MS = 10_000;

/**
 * A profile argument that does not resolve, with no terminal to report it to:
 * almost certainly an MCP client running an entry written for an older
 * version. Serve the one-tool tombstone (createUnknownProfileServer) so the
 * agent can relay the fix. If no client speaks within TOMBSTONE_WAIT_MS this
 * was not one after all, so say it on stderr and fail like the terminal path.
 */
function serveUnknownProfile(spec: string, reason: string): void {
  const message = unknownProfileMessage(spec, reason);
  let spoken = false;
  const giveUp = () => {
    if (spoken) return;
    console.error(message);
    process.exit(1);
  };
  const timer = setTimeout(giveUp, TOMBSTONE_WAIT_MS);
  // Input closed before anything arrived: nothing ever will, so do not wait.
  process.stdin.once('end', giveUp);
  // serveStdio calls the factory on the client's opening message.
  serveStdio(() => {
    spoken = true;
    clearTimeout(timer);
    return createUnknownProfileServer(spec, reason);
  });
  console.error(`${spec ? serverName(spec) : 'asc-mcp'} v${VERSION}: ${spec ? `unknown profile "${spec}". ` : ''}${reason.split('\n')[0]}`);
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

/**
 * The browser is the easier way through setup, so a bare `setup` offers it
 * first. Only where a browser on this machine can answer: not without a
 * terminal to ask in, and not over SSH, where 127.0.0.1 is the far end's.
 */
async function prefersBrowser(): Promise<boolean> {
  if (!process.stdin.isTTY || !process.stdout.isTTY || process.env.SSH_CONNECTION) return false;
  const { createInterface } = await import('node:readline/promises');
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    console.log('\n👋 Welcome to Heimdall setup.');
    const answer = (await rl.question('For the best experience, continue in your browser? [Y/n]: ')).trim();
    return !/^n/i.test(answer);
  } finally {
    rl.close();
  }
}
