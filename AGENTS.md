# AGENTS.md

Instructions for AI coding agents (Claude Code, Codex, Cursor, Antigravity, and any other MCP client). Human-facing docs live in [README.md](README.md) and [GUIDE.md](docs/GUIDE.md).

> The same guidance ships as a skill at [`skills/heimdall/SKILL.md`](skills/heimdall/SKILL.md), which `register` installs for the clients that read skills. That file exists because this one cannot be reached: Heimdall runs through `npx`, so a user installing it has no checkout and never sees AGENTS.md. **Keep the two in step** — if you change how install or safety works here, change it there too.

## What this is

Heimdall is an MCP server for the App Store Connect API and the App Store Server API (StoreKit 2). It is published to npm as `@erayendes/asc-mcp` and runs via `npx` — there is **nothing to clone, build, or `npm install`** to use it. It is client-agnostic: standard MCP over stdio.

## If a user asks you to install it

The install is two steps and they are not both yours. **You register. The user hands over the key.**

### 1. Agree on the profiles, then register them

Ask what the user works on. If they have not said, `analytics`, `marketing` and `app-info` are a sensible default. Each profile is a small scoped server; the table is in [GUIDE.md](docs/GUIDE.md#register-profiles).

A big profile takes a colon and a list of its sub-profiles — `monetization:subscription-pricing,subscription-offers` is 24 tools where `monetization` is 204. Worth suggesting for `monetization`, `game-center`, `distribution`, `marketing` and `access`. The server is still called `asc-monetization`.

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

**The key is not reachable from a shell, and looking for it is the most common way a session goes wrong.** In recorded eval runs, of the sessions that abandoned the tools, the largest group went hunting for the private key — `security find-generic-password`, `env | grep ASC_`, grepping the source, hunting a `.env` — and the next largest called Apple directly with `curl`. Neither can work: the JWT is minted inside the server, per request, from the key in the Keychain, so there is no long-lived credential to find and no token for a hand-rolled `curl`. When a tool fails, the next step is another tool call — `asc__status` for the connection, `asc__search_tools` for a different operation — never the shell.

### 3. Restart and check

Ask the user to restart their MCP client, then to say *"check the App Store Connect connection"* — that calls `asc__status`, which verifies the credentials with one lightweight request.

If the user would rather do the whole thing themselves, `setup` alone covers both steps: it collects the credentials *and* registers with every client it finds.

## While helping the user

- **Finding a tool that isn't loaded:** call `asc__search_tools` (searches all 982 operations plus StoreKit) or `asc__discover_domains`. They name the sibling profile that owns a tool and print the exact command to add it.
- **StoreKit / customer transactions** need a bundle ID (set during `setup` or via `ASC_BUNDLE_ID`) and live on the `monetization` profile. Each StoreKit tool takes an optional `environment` argument (`Production`/`Sandbox`).
- **Safety:** `--read-only` mode blocks every mutating tool. `destructiveHint` no longer means "this is a DELETE" — it now covers every write whose consequence the HTTP method cannot show, so a description ending in `REVENUE-`, `RELEASE-`, `INFRASTRUCTURE-` or `ACCESS-level write.` is flagged too. Those change live data: say what will happen and get a yes before calling one.
- **Prefer the macro over the chain.** `pricing__*` answers or changes a price without walking app → group → subscription → price points; `listing__*` reads and uploads store screenshots; `analytics__get_report` returns report rows rather than a link; `reviews_ai__*` triages reviews. Two of them do something the raw tools cannot do at all: `listing__upload_screenshot` performs Apple's reserve/upload/commit sequence, and `pricing__equalize_price` derives every country's price from one anchor.

## If you are working ON this repository

Tools are generated from Apple's OpenAPI spec. **Do not edit `src/generated/`** — change `scripts/generate.ts`, run `npm run generate`, and commit the result. `npm test` and `npm run typecheck` must pass. See [CONTRIBUTING.md](.github/CONTRIBUTING.md).
