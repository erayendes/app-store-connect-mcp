/**
 * Agent-in-the-loop eval — the closest thing to how Heimdall is actually used.
 *
 *   npm run ax:agent                      every intent (12 real agent sessions)
 *   npm run ax:agent -- --only=0          one intent, by index
 *   npm run ax:agent -- --list            print the intents and exit
 *
 * `ax:eval` walks a chain someone else declared: it assumes the agent already
 * picked the right tools. That assumption is exactly what broke in AI-201 (the
 * model never found the tool) and AI-203 (it picked a competitor). Those
 * failures happen *before* the chain starts, so a declared chain cannot see
 * them.
 *
 * Here a real model gets the goal in plain language and nothing else, and the
 * transcript answers four questions no static check can:
 *
 *   did it finish            end-to-end success, not per-call success
 *   how many tool calls      AI-203 — the path a competitor collapses to one
 *   how many tokens          AI-177 — what the payload really costs a context
 *   did it shell out to jq   AI-177's smoking gun. The observation that made
 *                            it Urgent was a user dropping to the terminal to
 *                            filter a response; a Bash call carrying jq or
 *                            python over MCP output is that same moment,
 *                            caught automatically instead of by hand.
 *
 * Every profile starts with --dry-run: writes resolve fully and are never sent
 * to Apple. Reads are real.
 *
 * This costs money — one model session per intent. Run it nightly, not per PR.
 */
import { query } from '@anthropic-ai/claude-agent-sdk';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';
import { INTENTS } from '../tests/eval/intents.js';

const here = dirname(fileURLToPath(import.meta.url));
const entry = join(here, '..', 'dist', 'index.js');

/** Which scoped servers to register — the intents span four domains. */
const PROFILES = (process.env.ASC_AGENT_PROFILES ?? 'monetization,app-info,marketing,distribution')
  .split(',')
  .map((p) => p.trim())
  .filter(Boolean);

const MAX_TURNS = Number(process.env.ASC_AGENT_MAX_TURNS) || 25;
const APP = process.env.ASC_EVAL_APP;

const arg = (name: string) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=')[1];
const only = arg('only');

const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;

if (process.argv.includes('--list')) {
  INTENTS.forEach((i, n) => console.log(`${String(n).padStart(2)}  ${i.intent}`));
  process.exit(0);
}

if (!existsSync(entry)) {
  console.log(`\nNo build at ${entry} — run \`npm run build\` first.\n`);
  process.exit(1);
}
if (!APP) {
  console.log(
    '\nax:agent needs an app to work on. Set ASC_EVAL_APP to a bundle ID, ' +
      'Apple ID or app name.\n'
  );
  process.exit(1);
}

/**
 * Only what the server actually needs.
 *
 * The Agent SDK serializes this whole map into the `--mcp-config` argument on
 * the child's command line, which puts every value in the process table for any
 * local user to read. Forwarding all of `process.env` leaks unrelated secrets —
 * a GitHub token sitting in the shell ends up in `ps` output. Pass the ASC
 * credentials plus the handful of vars the keychain lookup needs, nothing else.
 */
const PASS_THROUGH = ['HOME', 'PATH', 'USER', 'LANG', 'TMPDIR'];
const childEnv: Record<string, string> = Object.fromEntries(
  Object.entries(process.env).filter(
    ([k, v]) => typeof v === 'string' && (k.startsWith('ASC_') || PASS_THROUGH.includes(k))
  ) as [string, string][]
);

const mcpServers = Object.fromEntries(
  PROFILES.map((profile) => [
    `asc-${profile}`,
    { type: 'stdio' as const, command: process.execPath, args: [entry, profile, '--dry-run'], env: childEnv },
  ])
);

/** `subscription_prices.create` is exposed as `…__subscription_prices__create`. */
const toolSuffix = (op: string) => `__${op.replace(/\./g, '__')}`;

/** A Bash call that pipes MCP output through a filter — the AI-177 tell. */
const SHELL_FILTER = /\b(jq|python3?|awk|grep|head)\b/;

interface Run {
  intent: string;
  ok: boolean;
  reason?: string;
  /** Last words of the session — the only clue when a run comes back empty. */
  finalText?: string;
  turns: number;
  costUsd: number;
  tokens: number;
  calls: string[];
  foundTarget: boolean;
  usedMacro: boolean;
  shellOuts: string[];
  foreignMcp: string[];
}

/**
 * A session that spent no tokens and called no tools never happened — the SDK
 * still reports `subtype: 'success'`, so a naive `ok` counts a quota refusal as
 * a completed task and every downstream ratio silently divides by the wrong
 * denominator. The first full run scored 12/12 completed when only 6 sessions
 * had actually started.
 */
const didNotRun = (r: Run) => r.tokens === 0 && r.calls.length === 0;

async function runIntent(intent: (typeof INTENTS)[number]): Promise<Run> {
  const calls: string[] = [];
  const shellOuts: string[] = [];
  const run: Run = {
    intent: intent.intent,
    ok: false,
    turns: 0,
    costUsd: 0,
    tokens: 0,
    calls,
    foundTarget: false,
    usedMacro: false,
    shellOuts,
    foreignMcp: [],
  };

  // Carry the task all the way to the write. An earlier wording ("stop once the
  // change is staged") let the agent read "staged" as "identified" and stop one
  // call short of writing, which made a real finding unreadable — the run
  // reached the price point and never called the write tool, and there was no
  // way to tell refusal from ambiguity.
  const prompt =
    `App: ${APP}\n\nTask: ${intent.intent}\n\n` +
    `Use the App Store Connect tools available to you and carry the task through ` +
    `to the write itself — do not stop at finding the values. The server runs in ` +
    `dry-run mode, so the write is fully resolved and previewed but never sent to ` +
    `Apple. Do not ask for confirmation; there is nobody to answer.`;

  try {
    for await (const message of query({
      prompt,
      options: {
        mcpServers,
        maxTurns: MAX_TURNS,
        permissionMode: 'bypassPermissions',
        allowDangerouslySkipPermissions: true,
        // No local settings: the eval must measure the shipped server, not
        // whatever CLAUDE.md happens to sit in this checkout.
        settingSources: [],
        ...(process.env.ASC_AGENT_MODEL ? { model: process.env.ASC_AGENT_MODEL } : {}),
      },
    })) {
      const msg = message as any;

      if (msg.type === 'assistant') {
        for (const block of msg.message?.content ?? []) {
          if (block?.type !== 'tool_use') continue;
          calls.push(block.name);
          if (block.name === 'Bash') {
            const command = String(block.input?.command ?? '');
            if (SHELL_FILTER.test(command)) shellOuts.push(command.slice(0, 120));
          }
        }
      }

      if (msg.type === 'result') {
        run.ok = msg.subtype === 'success';
        run.reason = run.ok ? undefined : msg.subtype;
        run.finalText = typeof msg.result === 'string' ? msg.result.slice(0, 200) : undefined;
        run.turns = msg.num_turns ?? 0;
        run.costUsd = msg.total_cost_usd ?? 0;
        run.tokens =
          (msg.usage?.input_tokens ?? 0) +
          (msg.usage?.output_tokens ?? 0) +
          (msg.usage?.cache_read_input_tokens ?? 0) +
          (msg.usage?.cache_creation_input_tokens ?? 0);
      }
    }
  } catch (err) {
    run.reason = err instanceof Error ? err.message.slice(0, 120) : String(err);
  }

  const targets = [intent.expectedTool].flat().map(toolSuffix);
  run.foundTarget = calls.some((c) => targets.some((t) => c.endsWith(t)));
  run.usedMacro = Boolean(intent.macro) && calls.some((c) => c.endsWith(`__${intent.macro}`));
  run.foreignMcp = [
    ...new Set(calls.filter((c) => c.startsWith('mcp__') && !c.startsWith('mcp__asc-'))),
  ];
  return run;
}

async function main(): Promise<void> {
  // `--only=2` or `--only=6,7,8` — a list matters because a run that dies on
  // quota leaves a specific set of intents unmeasured, and re-running them one
  // command at a time is how you stop bothering.
  const selected =
    only === undefined
      ? INTENTS
      : only
          .split(',')
          .map((n) => INTENTS[Number(n.trim())])
          .filter(Boolean);
  if (!selected.length) {
    console.log(`No intent matched "${only}". Use --list to see them.`);
    process.exit(1);
  }

  console.log(
    `\n${bold('Agent-in-the-loop eval')} — app ${APP}, profiles ${PROFILES.join(', ')}\n` +
      dim(`${selected.length} real session${selected.length === 1 ? '' : 's'}, each capped at ${MAX_TURNS} turns. Writes are dry-run.`)
  );

  const runs: Run[] = [];
  for (const [n, intent] of selected.entries()) {
    console.log(`\n${bold(`[${n + 1}/${selected.length}] ${intent.intent}`)}`);
    const run = await runIntent(intent);
    runs.push(run);

    const ascCalls = run.calls.filter((c) => c.startsWith('mcp__asc-'));
    if (didNotRun(run)) {
      console.log(
        `  ${red('session never started')} — no tokens, no tool calls. ` +
          `Usually a quota or rate limit; this intent is unmeasured, not passing.`
      );
      if (run.finalText) console.log(dim(`      ${run.finalText}`));
      continue;
    }
    console.log(
      `  ${run.ok ? 'completed' : red(`did not complete (${run.reason})`)}  ` +
        dim(`${run.turns} turns · ${(run.tokens / 1000).toFixed(1)}k tokens · $${run.costUsd.toFixed(3)}`)
    );
    console.log(
      `  tool calls    ${run.calls.length} total, ${ascCalls.length} to Heimdall` +
        (run.usedMacro ? dim(' (via macro)') : '')
    );
    if (ascCalls.length) console.log(dim(`      ${ascCalls.join(' → ')}`));
    if (!run.foundTarget && !run.usedMacro) {
      console.log(`  ${red(`never called ${intent.expectedTool}`)} — the write tool for this goal`);
    }
    if (run.foreignMcp.length) {
      console.log(`  ${yellow(`used a non-Heimdall MCP: ${run.foreignMcp.join(', ')}`)}`);
    }
    for (const cmd of run.shellOuts) {
      console.log(`  ${yellow('shelled out to filter output')} — ${dim(cmd)}`);
    }
  }

  // Ratios are over the sessions that actually ran. Counting an unmeasured
  // intent as a denominator entry makes the harness look better the more it
  // fails to start.
  const measured = runs.filter((r) => !didNotRun(r));
  const skipped = runs.length - measured.length;
  const done = measured.filter((r) => r.ok).length;
  const hit = measured.filter((r) => r.foundTarget || r.usedMacro).length;
  const shelled = measured.filter((r) => r.shellOuts.length).length;
  const cost = runs.reduce((n, r) => n + r.costUsd, 0);
  const tokens = runs.reduce((n, r) => n + r.tokens, 0);

  console.log(`\n${bold('Summary')}`);
  if (skipped) {
    console.log(
      `  ${red(`${skipped} of ${runs.length} sessions never started`)} — ratios below cover the ${measured.length} that did`
    );
  }
  console.log(`  completed          ${done}/${measured.length}`);
  console.log(`  reached the write  ${hit}/${measured.length}`);
  console.log(
    `  shelled out        ${shelled}/${measured.length}` +
      (shelled ? `  ${yellow('← the AI-177 shape: MCP output too big to use as-is')}` : '')
  );
  console.log(`  tokens             ${(tokens / 1_000_000).toFixed(2)}M`);
  console.log(`  cost               $${cost.toFixed(2)}\n`);
}

main().catch((err) => {
  console.error(`\nax:agent failed: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
