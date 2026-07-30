/**
 * Does every tool hold up its end of the bargain?
 *
 * The agent eval covers 50 goals — about 5% of the 982 operations. It measures
 * whether someone can get something done, which is the question that matters,
 * but it says nothing about the other 95%. A tool can be broken in ways no goal
 * happens to touch: a path parameter that never gets substituted, a body schema
 * that rejects its own required fields, a mutation with no risk label.
 *
 * This is the cheap layer under it. No model, no tokens, no cost. Every
 * operation is driven through the real server:
 *
 *   writes   dry-run, with a body synthesized from the generated schema. The
 *            preview has to come back with the method the spec declares and a
 *            path with nothing left unsubstituted.
 *   reads    really called, wherever an id can be found. Ids come from the
 *            account: list what an app has, then use those ids to reach the
 *            single-resource reads. Everything else is reported unreached, not
 *            passed.
 *
 * Writes never leave the machine — the server runs with --dry-run, so the
 * failure mode of a bug here is a bad report, not a bad account.
 *
 *   ASC_EVAL_APP=<bundle-id> npm run ax:contract
 *   npm run ax:contract -- --writes-only     skip the network entirely
 *   npm run ax:contract -- --domain=pricing  one domain
 */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';
import { OPERATIONS } from '../src/generated/operations.js';
import { BODY_SCHEMAS } from '../src/generated/body-schemas.js';
import { ALL_DOMAINS, encodeParamName } from '../src/core/registry.js';

const here = dirname(fileURLToPath(import.meta.url));
const entry = join(here, '..', 'dist', 'index.js');

const arg = (name: string) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=')[1];
const onlyDomain = arg('domain');
const writesOnly = process.argv.includes('--writes-only');
const APP = process.env.ASC_EVAL_APP;

const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;

if (!existsSync(entry)) {
  console.log(`\nNo build at ${entry} — run \`npm run build\` first.\n`);
  process.exit(1);
}

type Op = (typeof OPERATIONS)[number];
const OPS = (OPERATIONS as Op[]).filter((op) => !onlyDomain || op.domain === onlyDomain);

/** `subscription_prices.create` is exposed as `subscription_prices__create`. */
const toolName = (op: Op) => op.name.replace(/\./g, '__');

/**
 * A body that satisfies the schema's required fields and nothing more.
 *
 * Dry-run validates the body before previewing, so a synthesized value has to
 * be structurally right — but it never reaches Apple, so it does not have to be
 * semantically right. Placeholder ids in relationships are fine and are the
 * point: they prove the path and body assemble, not that the object exists.
 */
function synthesize(schema: any, depth = 0): unknown {
  if (!schema || depth > 8) return 'x';
  if (schema.enum?.length) return schema.enum[0];
  switch (schema.type) {
    case 'object': {
      const out: Record<string, unknown> = {};
      for (const key of schema.required ?? []) {
        out[key] = synthesize(schema.properties?.[key], depth + 1);
      }
      return out;
    }
    case 'array':
      return [synthesize(schema.items, depth + 1)];
    case 'integer':
    case 'number':
      return 1;
    case 'boolean':
      return true;
    default:
      // Apple's ids are opaque strings; a placeholder is enough for a preview.
      return 'PLACEHOLDER';
  }
}

/**
 * `limit` only where the operation declares it.
 *
 * Sending it everywhere was this script's own bug: a single-resource GET takes
 * no query parameters, and the server now refuses arguments it does not
 * recognise rather than dropping them. Seventy reads "failed" on the checker's
 * mistake before this existed — which is at least a working demonstration that
 * the refusal fires.
 */
const pageSize = (op: Op): Record<string, number> =>
  op.queryParams.some((q) => q.name === 'limit') ? { limit: 5 } : {};

/** A minimal MCP stdio client. One request in flight at a time is all this needs. */
function client(args: string[]) {
  const child = spawn(process.execPath, [entry, ...args], { stdio: ['pipe', 'pipe', 'pipe'] });
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

  const request = (method: string, params: unknown, timeoutMs = 90_000) =>
    new Promise<any>((resolve) => {
      const id = nextId++;
      waiting.set(id, resolve);
      child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
      setTimeout(() => {
        if (waiting.delete(id)) resolve({ error: { message: `${method} timed out` } });
      }, timeoutMs);
    });

  return {
    async start() {
      await request('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'ax-contract', version: '0' },
      });
    },
    async call(name: string, callArgs: Record<string, unknown>) {
      const msg = await request('tools/call', { name, arguments: callArgs });
      if (msg.error) return { isError: true, text: String(msg.error.message) };
      return {
        isError: Boolean(msg.result?.isError),
        text: String(msg.result?.content?.[0]?.text ?? ''),
      };
    },
    stop: () => child.kill(),
  };
}

interface Result {
  op: Op;
  verdict: 'ok' | 'fail' | 'unreached';
  note?: string;
  bytes?: number;
}

/**
 * Reads that Apple itself rejects, and why. Pinned so a new one stands out.
 *
 * These are not the checker's mistakes — every one fails the same way for any
 * caller, and three of the classes are ours to fix:
 *
 *   406            the endpoint does not serve JSON, and the client asks for it
 *   limit alone    Apple wants `limit` paired with groupBy or filter; the
 *                  schema advertises it as free-standing
 *   filter needed  the schema marks no filter required, so the tool looks
 *                  callable with no arguments and is not
 *
 * The reads pass depends on what an account happens to hold, so it reports
 * rather than gates. Only write failures fail the command — those are
 * deterministic and network-free.
 */
const KNOWN_BROKEN_READS = new Set([
  'apps.perf_power_metrics.list', // 406: not JSON
  'builds.perf_power_metrics.list', // 406: not JSON
  'apps.beta_tester_usages.metrics', // limit without groupBy
  'beta_groups.beta_tester_usages.metrics', // limit without groupBy
  'builds.beta_build_usages.metrics', // limit without groupBy
  'build_beta_details.list', // needs a build or id filter
  'apps.search_keywords.list', // needs filter[locale]
  'apps.marketplace_search_detail.get', // Apple 500, their side
  'sales_reports.list', // needs a real ASC_VENDOR_NUMBER
  'finance_reports.list', // needs a real ASC_VENDOR_NUMBER
]);

/** Every domain in one server: this drives the whole surface, not a profile's slice. */
const serverArgs = [`--domains=${ALL_DOMAINS.join(',')}`, '--include-deprecated', '--dry-run'];

async function checkWrites(mcp: ReturnType<typeof client>): Promise<Result[]> {
  const writes = OPS.filter((op) => !op.readOnly);
  const results: Result[] = [];

  for (const [n, op] of writes.entries()) {
    if (n % 50 === 0) process.stdout.write(dim(`\r  writes ${n}/${writes.length}`));

    const args: Record<string, unknown> = {};
    for (const param of op.pathParams) args[param] = 'PLACEHOLDER-ID';
    for (const q of op.queryParams) {
      if (q.required) args[encodeParamName(q.name)] = synthesize(q);
    }
    if (op.hasBody && op.bodyRef) {
      const schema = (BODY_SCHEMAS as Record<string, unknown>)[op.bodyRef];
      if (!schema) {
        results.push({ op, verdict: 'fail', note: `body schema "${op.bodyRef}" is missing` });
        continue;
      }
      args.body = synthesize(schema);
    }

    const { isError, text } = await mcp.call(toolName(op), args);
    if (isError) {
      results.push({ op, verdict: 'fail', note: text.replace(/\s+/g, ' ').slice(0, 160) });
      continue;
    }

    let preview: any;
    try {
      preview = JSON.parse(text);
    } catch {
      results.push({ op, verdict: 'fail', note: `preview was not JSON: ${text.slice(0, 90)}` });
      continue;
    }

    const sent = preview?.wouldSend;
    if (preview?.dryRun !== true || !sent) {
      results.push({ op, verdict: 'fail', note: 'no dry-run preview came back' });
    } else if (sent.method !== op.method.toUpperCase()) {
      results.push({ op, verdict: 'fail', note: `preview says ${sent.method}, spec says ${op.method}` });
    } else if (String(sent.path).includes('{')) {
      // The failure this exists for: a path parameter that never got substituted
      // would be sent to Apple with the braces still in it.
      results.push({ op, verdict: 'fail', note: `path left unsubstituted: ${sent.path}` });
    } else if (!preview.risk) {
      results.push({ op, verdict: 'fail', note: 'a mutation came back with no risk label' });
    } else {
      results.push({ op, verdict: 'ok' });
    }
  }
  process.stdout.write(`\r${' '.repeat(28)}\r`);
  return results;
}

/**
 * Ids to reach single-resource reads with.
 *
 * Two hops, no more: list what the app has, then use what came back. Apple's
 * `type` on a resource matches the collection segment in its own path
 * (`betaGroups` → `/v1/betaGroups/{id}`), so harvesting types is enough to seed
 * a large part of the read surface without hand-written chains.
 */
async function harvestIds(mcp: ReturnType<typeof client>, appId: string) {
  const byType = new Map<string, string>();
  byType.set('apps', appId);

  const collections = OPS.filter(
    (op) => op.readOnly && op.pathParams.length === 1 && /^\/v\d\/apps\/\{id\}\//.test(op.path)
  );

  for (const op of collections) {
    const { isError, text } = await mcp.call(toolName(op), { id: appId, ...pageSize(op) });
    if (isError) continue;
    try {
      for (const item of JSON.parse(text)?.data ?? []) {
        if (item?.type && item?.id && !byType.has(item.type)) byType.set(item.type, String(item.id));
      }
    } catch {
      // A read that answers with something unparseable is the reads pass's problem.
    }
  }
  return byType;
}

async function checkReads(mcp: ReturnType<typeof client>, appId: string): Promise<Result[]> {
  const seeds = await harvestIds(mcp, appId);
  console.log(dim(`  harvested ids for ${seeds.size} resource types`));

  const reads = OPS.filter((op) => op.readOnly);
  const results: Result[] = [];

  for (const [n, op] of reads.entries()) {
    if (n % 25 === 0) process.stdout.write(dim(`\r  reads ${n}/${reads.length}`));

    const args: Record<string, unknown> = pageSize(op);
    let seeded = true;
    for (const param of op.pathParams) {
      // `/v1/betaGroups/{id}` and `/v1/apps/{id}/builds` both name the type in
      // the segment before the parameter.
      const segment = op.path.split(`{${param}}`)[0].split('/').filter(Boolean).pop() ?? '';
      const seed = seeds.get(segment);
      if (!seed) {
        seeded = false;
        break;
      }
      args[param] = seed;
    }
    if (!seeded) {
      results.push({ op, verdict: 'unreached', note: 'no id available on this account' });
      continue;
    }
    for (const q of op.queryParams) {
      if (q.required && !(encodeParamName(q.name) in args)) {
        args[encodeParamName(q.name)] = synthesize(q);
      }
    }

    const { isError, text } = await mcp.call(toolName(op), args);
    if (isError) {
      // Apple refusing a request the account has no rights to is not a defect in
      // the tool; a crash or an unshaped error is.
      const permission = /\b(403|404|409)\b|not allowed|does not exist|NOT_FOUND/i.test(text);
      results.push({
        op,
        verdict: permission ? 'unreached' : 'fail',
        note: text.replace(/\s+/g, ' ').slice(0, 160),
      });
      continue;
    }
    results.push({ op, verdict: 'ok', bytes: text.length });
  }
  process.stdout.write(`\r${' '.repeat(28)}\r`);
  return results;
}

async function main(): Promise<void> {
  console.log(
    `\n${bold('Contract check')} — ${OPS.length} operations` +
      (onlyDomain ? ` in ${onlyDomain}` : '') +
      `\n${dim('No model, no tokens. Writes are dry-run and never reach Apple.')}\n`
  );

  const mcp = client(serverArgs);
  await mcp.start();

  const results = await checkWrites(mcp);

  if (!writesOnly) {
    if (!APP) {
      console.log(yellow('  reads skipped — set ASC_EVAL_APP to a bundle id to include them'));
    } else {
      const found = await mcp.call('apps__list', { filter_bundleId: APP, limit: 1 });
      let appId: string | undefined;
      try {
        appId = JSON.parse(found.text)?.data?.[0]?.id;
      } catch {
        appId = undefined;
      }
      if (!appId) {
        console.log(red(`  reads skipped — could not resolve ${APP}`));
      } else {
        results.push(...(await checkReads(mcp, appId)));
      }
    }
  }

  mcp.stop();

  const failures = results.filter((r) => r.verdict === 'fail');
  const ok = results.filter((r) => r.verdict === 'ok');
  const unreached = results.filter((r) => r.verdict === 'unreached');

  const domains = new Map<string, { ok: number; fail: number; unreached: number }>();
  for (const r of results) {
    const row = domains.get(r.op.domain) ?? { ok: 0, fail: 0, unreached: 0 };
    row[r.verdict]++;
    domains.set(r.op.domain, row);
  }

  console.log(bold('\nBy domain'));
  for (const [domain, row] of [...domains].sort((a, b) => b[1].fail - a[1].fail)) {
    console.log(
      `  ${domain.padEnd(18)} ${green(`${row.ok} ok`).padEnd(16)}` +
        (row.fail ? red(`${row.fail} fail`) : dim('0 fail')).padEnd(18) +
        dim(`${row.unreached} unreached`)
    );
  }

  if (failures.length) {
    console.log(bold(`\n${failures.length} failing operation${failures.length === 1 ? '' : 's'}`));
    for (const f of failures.slice(0, 40)) {
      console.log(`  ${red(f.op.name)} ${dim(`[${f.op.method} ${f.op.path}]`)}\n      ${f.note}`);
    }
    if (failures.length > 40) console.log(dim(`  … ${failures.length - 40} more`));
  }

  const heavy = ok.filter((r) => (r.bytes ?? 0) > 50_000).sort((a, b) => (b.bytes ?? 0) - (a.bytes ?? 0));
  if (heavy.length) {
    console.log(bold(`\n${heavy.length} read${heavy.length === 1 ? '' : 's'} over 50 KB shaped`));
    for (const h of heavy.slice(0, 12)) {
      console.log(`  ${((h.bytes ?? 0) / 1024).toFixed(0).padStart(5)} KB  ${h.op.name}`);
    }
  }

  // Writes are deterministic and never touch the network, so they gate. Reads
  // depend on what the account holds; a known-broken one is debt, a new one is
  // news.
  const writeFailures = failures.filter((f) => !f.op.readOnly);
  const newReadFailures = failures.filter((f) => f.op.readOnly && !KNOWN_BROKEN_READS.has(f.op.name));
  const knownReadFailures = failures.filter((f) => f.op.readOnly && KNOWN_BROKEN_READS.has(f.op.name));
  const fixed = [...KNOWN_BROKEN_READS].filter(
    (name) => !failures.some((f) => f.op.name === name) && results.some((r) => r.op.name === name)
  );

  console.log(bold('\nSummary'));
  console.log(`  ok               ${ok.length}/${results.length}`);
  console.log(
    `  write failures   ${writeFailures.length}${writeFailures.length ? red('  ← contract broken') : ''}`
  );
  console.log(
    `  read failures    ${knownReadFailures.length} known` +
      (newReadFailures.length ? red(`, ${newReadFailures.length} new  ← look at these`) : '')
  );
  if (fixed.length) {
    console.log(
      `  ${green(`${fixed.length} known-broken read${fixed.length === 1 ? '' : 's'} now passing`)}` +
        dim(` — drop from KNOWN_BROKEN_READS: ${fixed.join(', ')}`)
    );
  }
  console.log(`  unreached        ${unreached.length}${dim('  (no id on this account, or Apple refused)')}`);
  console.log(`  cost             $0.00\n`);

  process.exit(writeFailures.length || newReadFailures.length ? 1 : 0);
}

main().catch((err) => {
  console.error(`\nax:contract failed: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
