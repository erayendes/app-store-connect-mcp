# AGENTS.md

Instructions for AI coding agents (Claude Code, Codex, Cursor, Antigravity, and any other MCP client). Human-facing docs live in [README.md](README.md) and [GUIDE.md](docs/GUIDE.md).

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

### 3. Restart and check

Ask the user to restart their MCP client, then to say *"check the App Store Connect connection"* — that calls `asc__status`, which verifies the credentials with one lightweight request.

If the user would rather do the whole thing themselves, `setup` alone covers both steps: it collects the credentials *and* registers with every client it finds.

## While helping the user

- **Finding a tool that isn't loaded:** call `asc__search_tools` (searches all 982 operations plus StoreKit) or `asc__discover_domains`. They name the sibling profile that owns a tool and print the exact command to add it.
- **StoreKit / customer transactions** need a bundle ID (set during `setup` or via `ASC_BUNDLE_ID`) and live on the `monetization` profile. Each StoreKit tool takes an optional `environment` argument (`Production`/`Sandbox`).
- **Safety:** `--read-only` mode blocks every mutating tool. Tools annotated `destructiveHint` (e.g. deletes, `extend_renewal_date`) change live data — confirm with the user before calling them.

## If you are working ON this repository

Tools are generated from Apple's OpenAPI spec. **Do not edit `src/generated/`** — change `scripts/generate.ts`, run `npm run generate`, and commit the result. `npm test` and `npm run typecheck` must pass. See [CONTRIBUTING.md](.github/CONTRIBUTING.md).
