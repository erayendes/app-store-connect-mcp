# AGENTS.md

Instructions for AI coding agents (Claude Code, Codex, Cursor, Antigravity, and any other MCP client). Human-facing docs live in [README.md](README.md) and [docs/](docs/).

> The same guidance ships as a skill at [`skills/heimdall/SKILL.md`](skills/heimdall/SKILL.md), which `register` installs for the clients that read skills. That file exists because this one cannot be reached: Heimdall runs through `npx`, so a user installing it has no checkout and never sees AGENTS.md. **Keep the two in step** — if you change how install or safety works here, change it there too.

## What this is

Heimdall is an MCP server for the App Store Connect API and the App Store Server API (StoreKit 2). It is published to npm as `@erayendes/asc-mcp` and runs via `npx` — there is **nothing to clone, build, or `npm install`** to use it. It is client-agnostic: standard MCP over stdio. It serves 929 tools across 13 profiles: 888 generated from Apple's 1011 operations (the 123 deprecated ones stay unloaded unless asked for) and 41 hand-written.

## If a user asks you to install it

The install is two steps and they are not both yours. **You register. The user hands over the key.**

### 1. Agree on the profiles, then register them

Ask what the user works on. If they have not said, `analytics`, `marketing` and `app-info` are a sensible default. Each profile is a small scoped server; the table is in [PROFILES_en.md](docs/PROFILES_en.md).

A big profile takes a colon and a list of its sub-profiles — `monetization:subscription-pricing,subscription-offers` is 56 tools where `monetization` is 212. Worth suggesting for `monetization`, `game-center`, `distribution`, `marketing` and `access`. The server is still called `ASC-Monetization`.

**Say what you are about to do and wait for a yes**, then run:

```
npx -y @erayendes/asc-mcp register monetization:subscription-pricing analytics
```

This edits MCP client configs the user did not open — by default every client it finds, which is usually more than the one you are talking through. There is no confirmation prompt in the command, so the confirmation has to happen in the conversation. `--clients=codex,claude` limits it; `--clients` ids are `claude`, `codex`, `antigravity`, `vscode`, `cursor`, `windsurf`.

`register` only adds. It will not remove a profile the user set up earlier, and re-running it with the same arguments changes nothing.

### 2. Send the user to `setup` for the credentials

```
npx -y @erayendes/asc-mcp setup
```

**Never run this yourself, and never ask for the `.p8`.** It is an App Store Connect private key: do not ask the user to paste its contents into the chat, do not read it, do not write it into a config file. `setup` reads the file directly and puts the key in the macOS Keychain (or references its path off macOS).

`setup` also needs a real terminal — it opens pickers. Run from an agent shell it exits at the first prompt without doing anything, which is easy to mistake for success.

**Going after the key is the most common way a session goes wrong.** In recorded eval runs, of the sessions that abandoned the tools, the largest group went hunting for the private key — `security find-generic-password`, `env | grep ASC_`, grepping the source, hunting a `.env` — and the next largest called Apple directly with `curl`. The reason not to is not that it fails: a shell running as this user can read the key (`security find-generic-password -w` prints it), so this is a rule rather than a wall. It is the wrong move because a token signed outside the server skips the rate limiter, the write-confirmation gate, the dry-run path and the response shaping — every guard the server exists to apply. When a tool fails, the next step is another tool call — `asc__status` for the connection, `asc__search_tools` for a different operation — never the shell.

### 3. Restart and check

Ask the user to restart their MCP client, then to say *"check the App Store Connect connection"* — that calls `asc__status`, which verifies the credentials with one lightweight request.

If the user would rather do the whole thing themselves, `setup` alone covers both steps: it collects the credentials *and* registers with every client it finds.

## While helping the user

- **Finding a tool that isn't loaded:** call `asc__search_tools` (searches all 1011 operations plus StoreKit) or `asc__discover_domains`. They name the sibling profile that owns a tool and print the exact command to add it.
- **There is no way to add tools mid-session.** Some clients never show a changed tool list (the Claude desktop app's Code tab among them), and the tools do not appear next turn either. On a server started with only some of its sub-profiles, reads from the rest work at once through `asc__call`. For the tools themselves, run the `register` command the server's reply names — e.g. `npx -y @erayendes/asc-mcp register testflight:groups,testers` — after the user says yes, then ask them to restart their MCP client.
- **StoreKit / customer transactions** live on the `monetization` profile (`monetization:storekit`). Each tool takes an optional `app` (name, bundle ID or Apple ID) and looks the bundle ID up; it can be left out when the account has one app or `ASC_BUNDLE_ID` is set. `environment` (`Production` by default, or `Sandbox`) is optional too.
- **Safety:** `--read-only` mode blocks every mutating tool. `destructiveHint` no longer means "this is a DELETE" — it now covers every write whose consequence the HTTP method cannot show, so a description ending in `REVENUE-`, `RELEASE-`, `INFRASTRUCTURE-` or `ACCESS-level write.` is flagged too. Those change live data: say what will happen and get a yes before calling one.
- **When the client cannot show Heimdall's prompt** (the Claude desktop app's Code tab), Heimdall opens a macOS dialog for such a write and waits until the user answers it. Tell the user to look for it before you call. If the write is still refused, relay the refusal; do not edit client config, set `ASC_CONFIRM_WRITES`, or reach Apple another way.
- **Prefer the macro over the chain.** Hand-written tools (`pricing__*`, `listing__*`, `preflight__*`, `release__submit`, `testflight__*`, `ci__diagnose_run`, `analytics__get_report`, `reviews_ai__*`) answer in one call what the raw tools need a chain for; the table is in [GUIDE_en.md](docs/GUIDE_en.md#one-call-instead-of-a-chain). Three do something the raw tools cannot do at all: `listing__upload_screenshot` and `listing__upload_asset` perform Apple's reserve/upload/commit sequence, and `pricing__equalize_price` derives every country's price from one anchor.

## If you are working ON this repository

Tools are generated from Apple's OpenAPI spec. **Do not edit `src/generated/`** — change `scripts/generate.ts`, run `npm run generate`, and commit the result. `npm test` and `npm run typecheck` must pass. See [CONTRIBUTING.md](.github/CONTRIBUTING.md).
