#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './core/config.js';
import { ConfigError } from './core/errors.js';
import { createServer, VERSION } from './server.js';
import { ALL_DOMAINS, DEFAULT_DOMAINS } from './core/registry.js';
import { OPERATIONS, SPEC_VERSION } from './generated/operations.js';

function printHelp(): void {
  console.log(`app-store-connect-mcp v${VERSION}
MCP server for the Apple App Store Connect API (spec v${SPEC_VERSION}).

Usage:
  app-store-connect-mcp [options]

Options:
  --domains=<list>       Comma-separated domains to load, or "all".
                         Default: ${DEFAULT_DOMAINS.join(',')}
  --read-only            Expose only tools that cannot modify anything.
  --include-deprecated   Also load operations Apple has marked deprecated.
  --version              Print version and exit.
  --help                 Print this message.

Available domains (${OPERATIONS.length} operations total):
${ALL_DOMAINS.map((d) => `  ${d}`).join('\n')}

Required environment:
  ASC_KEY_ID             Key ID from App Store Connect.
  ASC_ISSUER_ID          Issuer ID from App Store Connect.
  ASC_PRIVATE_KEY_PATH   Absolute path to the .p8 file (or ASC_PRIVATE_KEY inline).

Optional environment:
  ASC_VENDOR_NUMBER      Required by sales and finance report tools.
  ASC_BUNDLE_ID          Enables App Store Server API (StoreKit 2) tools.
  ASC_ENVIRONMENT        Sandbox (default) or Production, for StoreKit 2.
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

  const server = createServer(config);
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // stderr is safe: stdout carries the MCP protocol itself.
  console.error(
    `app-store-connect-mcp v${VERSION} ready ` +
      `(spec ${SPEC_VERSION}${config.readOnly ? ', read-only' : ''})`
  );
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
