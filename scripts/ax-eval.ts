/**
 * Live agent-experience eval.
 *
 *   npm run ax:eval                    walk every intent against the real account
 *   ASC_EVAL_APP=com.example.app npm run ax:eval    pick the app to measure
 *
 * `scripts/ax-audit.ts` measures what the spec can tell us. This measures what
 * only a real account can: how many round trips an intent actually costs and
 * how many bytes come back. Nothing in Apple's spec says one subscription has
 * 842 price points in one territory — that measurement is what made AI-177
 * Urgent, and it took a person hitting the API by hand to find it.
 *
 * Read-only throughout. No write is ever issued: the write step of each intent
 * is named in the report, never called.
 *
 * Skips cleanly when no credentials are configured, so a clone without an Apple
 * account still gets a useful message instead of a stack trace.
 */
import { AscHttpClient } from '../src/core/http.js';
import { TokenProvider } from '../src/core/jwt.js';
import { loadConfig } from '../src/core/config.js';
import { searchOperations } from '../src/tools/meta.js';
import { stripApiNoise, capResponseSize, DEFAULT_MAX_RESPONSE_CHARS } from '../src/core/shape.js';
import { INTENTS, FILTER_PROBES, type EvalStep } from '../tests/eval/intents.js';

const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
const kb = (chars: number) => `${(chars / 1024).toFixed(1)} KB`;

let config: ReturnType<typeof loadConfig>;
try {
  config = loadConfig([]);
} catch (err) {
  console.log(
    `\nax:eval needs App Store Connect credentials — skipped.\n` +
      `Run \`npx @erayendes/asc-mcp setup\`, or set ASC_KEY_ID / ASC_ISSUER_ID / ASC_PRIVATE_KEY_*.\n` +
      dim(`(${err instanceof Error ? err.message : String(err)})\n`)
  );
  process.exit(0);
}

const http = new AscHttpClient(new TokenProvider(config.credentials), { baseUrl: config.baseUrl });

/** Reads 'data[0].id'-style paths out of a response. */
function pick(source: unknown, path: string): string | undefined {
  let cur: any = source;
  for (const part of path.split('.')) {
    const m = /^(\w+)(?:\[(\d+)\])?$/.exec(part);
    if (!m || cur == null) return undefined;
    cur = cur[m[1]];
    if (m[2] !== undefined) cur = cur?.[Number(m[2])];
  }
  return typeof cur === 'string' ? cur : undefined;
}

interface StepResult {
  op: string;
  ok: boolean;
  note?: string;
  rawChars: number;
  shapedChars: number;
  items: number;
  /** Apple's own count of matching rows, when it reports one. */
  total?: number;
  truncated: boolean;
  response?: unknown;
}

async function runStep(
  step: EvalStep,
  seeds: Record<string, string | undefined>,
  previous: StepResult[]
): Promise<StepResult> {
  const base: StepResult = { op: step.op, ok: false, rawChars: 0, shapedChars: 0, items: 0, truncated: false };

  let id: string | undefined;
  if (step.idFrom) {
    const chained = /^(\d+):(.+)$/.exec(step.idFrom);
    id = chained
      ? pick(previous[Number(chained[1])]?.response, chained[2])
      : seeds[step.idFrom];
    if (!id) return { ...base, note: `no id from "${step.idFrom}"` };
  }

  try {
    const res = await http.get(step.path.replace('{id}', encodeURIComponent(id ?? '')), step.params);
    const rawChars = JSON.stringify(res, null, 2).length;
    const stripped = stripApiNoise(res);
    const capped = capResponseSize(stripped, DEFAULT_MAX_RESPONSE_CHARS);
    return {
      op: step.op,
      ok: true,
      rawChars,
      shapedChars: JSON.stringify(capped, null, 2).length,
      items: Array.isArray((res as any)?.data) ? (res as any).data.length : 1,
      total: (res as any)?.meta?.paging?.total,
      truncated: Boolean((capped as any)?.truncation),
      response: res,
    };
  } catch (err) {
    return { ...base, note: err instanceof Error ? err.message.slice(0, 80) : String(err) };
  }
}

async function main(): Promise<void> {
  // Seed: the app everything else hangs off.
  const wanted = process.env.ASC_EVAL_APP;
  const apps: any = await http.get('/v1/apps', wanted?.includes('.') ? { 'filter[bundleId]': wanted } : { limit: 200 });
  const app = wanted && !wanted.includes('.')
    ? (apps.data ?? []).find((a: any) => a.id === wanted || String(a.attributes?.name ?? '').toLowerCase().includes(wanted.toLowerCase()))
    : apps.data?.[0];
  if (!app) {
    console.log(`No app found${wanted ? ` matching "${wanted}"` : ''}. Set ASC_EVAL_APP.`);
    process.exit(1);
  }

  // Second seed: a subscription, for the filter probes.
  let subscriptionId: string | undefined;
  try {
    const groups: any = await http.get(`/v1/apps/${app.id}/subscriptionGroups`, {
      include: 'subscriptions',
      limit: 10,
    });
    subscriptionId = (groups?.included ?? []).find((i: any) => i.type === 'subscriptions')?.id;
  } catch {
    // Accounts without subscriptions simply skip those probes.
  }
  const seeds = { app: app.id as string, subscription: subscriptionId };

  console.log(
    `\n${bold('Live AX eval')} — ${app.attributes?.name} (${app.attributes?.bundleId ?? app.id})\n` +
      dim('Read-only. Write steps are named, never called.')
  );

  const rows: string[] = [];
  for (const intent of INTENTS) {
    const rank =
      searchOperations(intent.searchQuery)
        .slice(0, 5)
        .findIndex((op) => [intent.expectedTool].flat().includes(op.name)) + 1;

    const results: StepResult[] = [];
    for (const step of intent.chain) {
      const r = await runStep(step, seeds, results);
      results.push(r);
      if (!r.ok) break; // the rest of the chain depends on this id
    }

    const done = results.filter((r) => r.ok);
    const rawChars = done.reduce((n, r) => n + r.rawChars, 0);
    const shapedChars = done.reduce((n, r) => n + r.shapedChars, 0);
    const worst = done.reduce<StepResult | undefined>(
      (w, r) => (!w || r.rawChars > w.rawChars ? r : w),
      undefined
    );
    const failed = results.find((r) => !r.ok);

    console.log(`\n${bold(intent.intent)}`);
    console.log(
      `  AXIS1 search  ${rank ? `rank ${rank}/5 for "${intent.searchQuery}"` : `\x1b[31mMISSED\x1b[0m — ${[intent.expectedTool].flat().join(' / ')} not in top 5 for "${intent.searchQuery}"`}`
    );
    console.log(
      `  AXIS4 path    ${intent.chain.length} read${intent.chain.length === 1 ? '' : 's'} + 1 write` +
        (intent.macro ? ` ${dim(`(macro ${intent.macro}: 1 call)`)}` : '')
    );
    if (failed) {
      console.log(`  ${dim(`unavailable at ${failed.op}: ${failed.note}`)}`);
    }
    if (done.length) {
      console.log(
        `  AXIS-payload  ${kb(rawChars)} raw → ${kb(shapedChars)} shaped ` +
          `(${Math.round((1 - shapedChars / rawChars) * 100)}% stripped)`
      );
      for (const r of done) {
        const totals = r.total !== undefined ? ` of ${r.total} total` : '';
        console.log(
          `      ${r.op}  ${r.items} item${r.items === 1 ? '' : 's'}${totals}  ` +
            `${kb(r.rawChars)} → ${kb(r.shapedChars)}${r.truncated ? ' \x1b[33m[TRUNCATED]\x1b[0m' : ''}`
        );
      }
    }
    rows.push(
      `${rank ? `rank ${rank}` : 'MISSED'.padEnd(6)} · ${String(intent.chain.length).padStart(2)} reads · ` +
        `${kb(rawChars).padStart(9)} → ${kb(shapedChars).padStart(9)}  ${intent.intent}`
    );
    if (worst && worst.rawChars > 50_000) {
      console.log(`  \x1b[33m⚠ ${worst.op} alone is ${kb(worst.rawChars)} — this is the AI-177 shape.\x1b[0m`);
    }
  }

  console.log(`\n${bold('Silent-filter probes')}`);
  console.log(dim('  A plausible-but-wrong filter value returns HTTP 200 and an empty list.'));
  for (const probe of FILTER_PROBES) {
    const id = seeds[probe.idFrom as keyof typeof seeds];
    if (!id) {
      console.log(`  ${dim(`${probe.op} ${probe.param}: no ${probe.idFrom} on this account`)}`);
      continue;
    }
    const path = probe.path.replace('{id}', encodeURIComponent(id));
    const count = async (value: string) => {
      try {
        const res: any = await http.get(path, { [probe.param]: value, limit: 200 });
        return res?.meta?.paging?.total ?? res?.data?.length ?? 0;
      } catch (err) {
        return err instanceof Error ? err.message.slice(0, 40) : 'error';
      }
    };
    const bad = await count(probe.wrong);
    const good = await count(probe.right);
    const silent = bad === 0 && typeof good === 'number' && good > 0;
    console.log(
      `  ${probe.op} ${probe.param}: "${probe.wrong}" → ${bad} · "${probe.right}" → ${good}  ` +
        (silent ? `\x1b[31mSILENT — no error, no hint\x1b[0m` : dim('ok'))
    );
  }

  console.log(`\n${bold('Summary')}`);
  for (const r of rows) console.log(`  ${r}`);
  console.log('');
}

main().catch((err) => {
  console.error(`\nax:eval failed: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
