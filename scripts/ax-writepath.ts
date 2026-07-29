/**
 * The one thing the rest of the harness cannot prove: that a write actually
 * lands.
 *
 * Every other check runs with --dry-run, because Apple has no sandbox for App
 * Store Connect writes and a mistake on a real account is a real mistake. That
 * left the whole write path — token, validation, POST, Apple's answer, response
 * shaping — measured only up to the point where it would have mattered.
 *
 * This closes it on a throwaway app, with a round trip that puts the account
 * back where it started: create a TestFlight group, read it back, delete it.
 * Nothing here touches team-level objects (certificates, devices, users), and
 * nothing publishes.
 *
 *   ASC_EVAL_APP=<bundle-id> npx tsx scripts/ax-writepath.ts
 *
 * Refuses to run unless ASC_WRITE_PATH_CONFIRM=yes is set, so it can never be
 * the thing that fires by accident in CI.
 */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const entry = join(here, '..', 'dist', 'index.js');

const APP = process.env.ASC_EVAL_APP;
const GROUP_NAME = process.env.ASC_WRITE_PATH_GROUP ?? 'AX write-path probe (delete me)';

const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;

if (!existsSync(entry)) {
  console.log(`\nNo build at ${entry} — run \`npm run build\` first.\n`);
  process.exit(1);
}
if (!APP) {
  console.log('\nSet ASC_EVAL_APP to the bundle ID of a throwaway app.\n');
  process.exit(1);
}
if (process.env.ASC_WRITE_PATH_CONFIRM !== 'yes') {
  console.log(
    `\n${bold('This writes to a real App Store Connect account.')}\n` +
      `It creates a TestFlight group named "${GROUP_NAME}" on ${APP} and deletes it again.\n` +
      `Set ASC_WRITE_PATH_CONFIRM=yes to proceed.\n`
  );
  process.exit(1);
}

/** A minimal MCP stdio client — one request at a time, which is all this needs. */
function client(profile: string, extraArgs: string[]) {
  const child = spawn(process.execPath, [entry, profile, ...extraArgs], {
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  child.stderr.on('data', () => {});

  let buffer = '';
  let nextId = 1;
  const waiting = new Map<number, (msg: any) => void>();

  child.stdout.on('data', (chunk) => {
    buffer += chunk.toString();
    let cut: number;
    while ((cut = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, cut);
      buffer = buffer.slice(cut + 1);
      if (!line.trim()) continue;
      let msg: any;
      try {
        msg = JSON.parse(line);
      } catch {
        continue;
      }
      const resolve = waiting.get(msg.id);
      if (resolve) {
        waiting.delete(msg.id);
        resolve(msg);
      }
    }
  });

  const request = (method: string, params: unknown) =>
    new Promise<any>((resolve, reject) => {
      const id = nextId++;
      waiting.set(id, resolve);
      child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
      setTimeout(() => reject(new Error(`${method} timed out`)), 60_000);
    });

  return {
    async start() {
      await request('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'ax-writepath', version: '0' },
      });
    },
    async call(name: string, args: Record<string, unknown>) {
      const msg = await request('tools/call', { name, arguments: args });
      const text = msg.result?.content?.[0]?.text ?? JSON.stringify(msg);
      return { isError: Boolean(msg.result?.isError), text: String(text) };
    },
    stop: () => child.kill(),
  };
}

async function main(): Promise<void> {
  console.log(
    `\n${bold('Write-path probe')} — app ${APP}\n` +
      dim('Creates a TestFlight group, reads it back, deletes it. No dry-run.\n')
  );

  // Resolving the app id is a read, so it can run against the same server.
  const info = client('app-info', ['--no-confirm']);
  await info.start();
  const apps = await info.call('apps__list', { filter_bundleId: APP, limit: 1 });
  info.stop();
  const resolved = JSON.parse(apps.text)?.data?.[0];
  const appId = resolved?.id;
  // Check the bundle id that came back, not just that something did. An earlier
  // run of this probe passed the filter under a name the schema did not carry,
  // got the account's first app instead, and wrote to it — the write path was
  // fine, the target was not.
  if (!appId || resolved?.attributes?.bundleId !== APP) {
    console.log(
      red(`  ${APP} did not resolve cleanly — got ${JSON.stringify(resolved?.attributes?.bundleId)}`)
    );
    process.exit(1);
  }
  console.log(`  app id        ${appId}`);

  const asc = client('user-management', ['--no-confirm']);
  await asc.start();

  let groupId: string | undefined;
  let failed = false;

  const created = await asc.call('beta_groups__create', {
    body: {
      data: {
        type: 'betaGroups',
        attributes: { name: GROUP_NAME },
        relationships: { app: { data: { type: 'apps', id: appId } } },
      },
    },
  });
  if (created.isError) {
    console.log(`  ${red('create failed')} ${dim(created.text.slice(0, 220))}`);
    failed = true;
  } else {
    groupId = JSON.parse(created.text)?.data?.id;
    console.log(`  ${green('create')}        beta group ${groupId}`);
  }

  if (groupId) {
    const read = await asc.call('beta_groups__get', { id: groupId });
    const name = JSON.parse(read.text)?.data?.attributes?.name;
    const matches = name === GROUP_NAME;
    console.log(
      `  ${matches ? green('read back') : red('read back')}     ${JSON.stringify(name)}` +
        (matches ? '' : red(`  ← expected ${JSON.stringify(GROUP_NAME)}`))
    );
    if (!matches) failed = true;

    // Always attempt cleanup, including after a failed read: the probe must not
    // be the reason a stray group is left behind on someone's account.
    const deleted = await asc.call('beta_groups__delete', { id: groupId });
    if (deleted.isError) {
      console.log(
        `  ${red('delete failed')} — remove ${groupId} by hand ${dim(deleted.text.slice(0, 180))}`
      );
      failed = true;
    } else {
      console.log(`  ${green('delete')}        cleaned up`);
    }

    const after = await asc.call('beta_groups__get', { id: groupId });
    console.log(
      after.isError
        ? `  ${green('verified')}      the group is gone`
        : `  ${red('still present')} after delete`
    );
    if (!after.isError) failed = true;
  }

  asc.stop();
  console.log(
    failed
      ? `\n${red('Write path FAILED')} — see above.\n`
      : `\n${green('Write path works end to end')}: create, read, delete, all through Heimdall.\n`
  );
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error(`\nax:writepath failed: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
