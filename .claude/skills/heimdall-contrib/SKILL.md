---
name: heimdall-contrib
description: Work on the Heimdall repository itself (@erayendes/asc-mcp) — the App Store Connect MCP server's own source. Use this whenever editing this codebase — changing tool descriptions, moving a tool between profiles, bumping Apple's OpenAPI spec, adding a macro, touching src/generated, or interpreting the AX debt numbers. Also use it before opening a PR here, and whenever a test named ax-audit, profile-invariants, search-intents or eval-intents fails and the reason is not obvious.
---

Two files are the source of truth and nothing else is: `spec/openapi.json`
(Apple's, fetched) and `spec/profiles.csv` (hand-curated, the owner's
spreadsheet). Everything in `src/generated/` is output.

## Never edit `src/generated/`

Change the generator instead — `scripts/generate.ts` for operations and
descriptions, `scripts/generate-profiles.ts` for membership — then:

```bash
npm run generate
```

and commit the result. `npm test` and `npm run typecheck` must pass. A hand
edit under `src/generated/` survives exactly until the next spec bump, and
disappears without a diff anyone will notice.

## The one step that is easy to skip

**When you improve an axis, lower its ceiling in `tests/ax-audit.test.ts`.**

That file's own comment calls this "the whole maintenance burden", which is
another way of saying it is the step that gets forgotten. The ceilings are
ratchets: debt may shrink freely and may never grow, so a spec bump that adds
forty endpoints carrying Apple's one-line summaries announces itself instead of
landing quietly. Leaving a ceiling high after a real improvement does not fail
anything — it silently converts the win into permanent slack, and the next
regression hides inside it.

Read the current numbers with:

```bash
npm run ax:report
```

## Curating a description is the highest-leverage change here

Descriptions are what a model reads when choosing among 982 tools, and roughly
700 are still Apple's own one-line summary. Add entries to `CURATED` in
`scripts/describe.ts`. What earns the space is what comes back, what narrows
it, and which neighbouring tool this one is *not*.

Two traps, both of which have actually happened and are recorded inline:

- **Search matches tokens of three or more characters as substrings.** A clause
  written to say what a tool is *not* can hand it queries meant for something
  else — `ping` inside "stopping", `out` and `release` inside "outside normal
  App Store releases". Name a neighbour by describing it, not by writing its
  tool name: `app_screenshots__create` inside a description made that tool the
  top hit for "create certificate".
- **Longer is not safer.** Apple's short summaries are dense with the words
  someone actually searches for. A more helpful sentence on
  `app_store_versions.build.set` diluted that and dropped the tool out of the
  top three for "select build for app store version"; it is deliberately
  uncurated now.

`tests/search-intents.test.ts` catches both. When it reports a new contested
pair or a lost one, the fix is usually to record it with a note saying which
change did it — not to force the ranking back.

## Moving a tool between profiles

Edit `spec/profiles.csv`, then regenerate. `tests/profile-invariants.test.ts`
will reject the result if a profile cannot reach its own root resources from an
app, or if a write's `{id}` has no read that produces it. Both were real bugs
before they were tests.

Hand-written tools (macros) need a row too, marked `(elle yazılmış)` in the
`operasyon` column, and their family prefix must be listed in `MANUAL_PREFIXES`
in `scripts/generate-profiles.ts` or the row is rejected as a typo. Forgetting
that is why `listing__get_screenshots` shipped in 2.0.0 unreachable from every
profile-mode server.

A new macro also has to be registered in three test-side places, or it looks
like a typo there instead: `macroNames` in `tests/eval-intents.test.ts`, the
`macros` array in `tests/macro-output-schema.test.ts`, and the pinned counts in
`tests/profile-invariants.test.ts`.

## Model-facing prose has a bar

From the doc comment above `SERVER_INSTRUCTIONS` in `src/server.ts`:

> a line belongs here if the model would get it wrong from the schemas alone,
> and if knowing it changes the call rather than the attitude.

Two advice-flavoured lines shipped there first and were removed when an A/B
could not measure any effect — three samples per condition, and the spread
*within* one condition (374k to 1341k tokens on the same task) swamped every
difference between them. What the runs did show was the agent shelling out to
`jq` under every instruction set, because one response was 264 KB. No sentence
fixes a response that does not fit; only a smaller response does.

Practical consequence: when the fix could be a macro, a curated description, or
a parameter description, it should be one of those rather than prose. A
parameter description is generated, so it states itself on all 23 operations
that take that parameter.

## Running the tests

`npm test` is pinned to `vitest run --dir tests`, and the `--dir` is load-bearing.
Without it vitest globs from the repository root and collects anything test-shaped
it finds there — including a git worktree under `.claude/worktrees/`, which is how
one checkout became 66 files and 1016 tests instead of 33 and 508. The duplicated
files then run in parallel against each other: `cli.test.ts` spawns processes and
writes client config, so two copies of it fight over the same paths and fail
differently every run. That was the whole of "four files only fail when run
together".

Rebuild before any run that spawns the binary. `gate.test.ts` and the smoke tests
execute `dist/index.js`, so switching branches without `npm run build` measures
the other branch's code and the failures read like logic errors.

## Measuring

- `npm run ax:report` — static debt across four axes.
- `npm run ax:contract` / `npm run ax:writepath` — read and write path checks.
- `npm run ax:agent` — real model sessions against the shipped server. Costs
  money; nightly, not per PR. `--core --repeat=3` is the usual shape.
  `--skill=<dir>` and `--wrong-profile` exist for A/B-ing a skill document, and
  the arms are only ever compared within the same mode. `--gate` is the odd one
  out: it drops `--dry-run` so the write path is live and the confirmation gate
  is actually in it, and answers "would Heimdall have stopped this?" rather than
  "did the model choose not to?". Every prompt is declined, so nothing reaches
  Apple — the decision is taken before the request is built, same as
  `tests/gate.test.ts`. Never merged with the other modes: writes-live and
  writes-stubbed are different experiments.

Behaviour is probabilistic, so read proportions and not single runs. The
readable outcomes are per-session booleans — `foundTarget`, `adversarialBreach`,
`reachedForCredentials` — because token totals vary too much within a condition
to carry a comparison.

## New Apple resources

A spec bump that introduces a resource `scripts/domains.ts` does not know about
lands it in `misc`, and CI fails. Add it there deliberately rather than letting
the fallback absorb it.
