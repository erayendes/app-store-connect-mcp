# AGENTS.md

Instructions for AI coding agents (Claude Code, Codex, Cursor, Antigravity, and any other MCP client). Human-facing docs live in [README.md](README.md) and [GUIDE.md](GUIDE.md).

## What this is

Heimdall is an MCP server for the App Store Connect API and the App Store Server API (StoreKit 2). It is published to npm as `@erayendes/asc-mcp` and runs via `npx` — there is **nothing to clone, build, or `npm install`** to use it. It is client-agnostic: standard MCP over stdio.

## If a user asks you to install it

1. **Register the server in the user's MCP client.** The command is the same everywhere — only where it goes differs:
   - **Claude Code:** `claude mcp add -s user asc-<profile> -- npx -y @erayendes/asc-mcp <profile>`
   - **Codex:** `codex mcp add asc-<profile> -- npx -y @erayendes/asc-mcp <profile>` (or a `[mcp_servers.asc-<profile>]` block in `~/.codex/config.toml`)
   - **Claude Desktop / Antigravity / other JSON clients:** add an `mcpServers` entry with `command: "npx"`, `args: ["-y", "@erayendes/asc-mcp", "<profile>"]`
   - If the user didn't name an area, register `analytics`, `marketing` and `app-info` as a sensible default, or ask which areas they use. Each profile is a small scoped server; see the profile table in [GUIDE.md](GUIDE.md#4-register-profiles).

2. **Do not handle credentials yourself.** Connecting needs an App Store Connect API key. The `.p8` private key is a secret:
   - **Never** ask the user to paste the `.p8` contents into the chat, and never write the key into a config file yourself.
   - Instead, tell the user to run **`npx -y @erayendes/asc-mcp setup`** in their own terminal. The wizard collects the Key ID, Issuer ID and `.p8`, stores the key in the macOS Keychain (or references its path off macOS), and writes a shared config that every profile reads. Key ID and Issuer ID are identifiers, not secrets, but `setup` collects them too — so hand the whole step to the user.

3. **After setup:** ask the user to restart their MCP client, then to say *"check the App Store Connect connection"* — that calls `asc__status`, which verifies the credentials with one lightweight request.

## While helping the user

- **Finding a tool that isn't loaded:** call `asc__search_tools` (searches all 982 operations plus StoreKit) or `asc__discover_domains`. They name the sibling profile that owns a tool and print the exact command to add it.
- **StoreKit / customer transactions** need a bundle ID (set during `setup` or via `ASC_BUNDLE_ID`) and live on the `monetization` profile. Each StoreKit tool takes an optional `environment` argument (`Production`/`Sandbox`).
- **Safety:** `--read-only` mode blocks every mutating tool. Tools annotated `destructiveHint` (e.g. deletes, `extend_renewal_date`) change live data — confirm with the user before calling them.

## If you are working ON this repository

Tools are generated from Apple's OpenAPI spec. **Do not edit `src/generated/`** — change `scripts/generate.ts`, run `npm run generate`, and commit the result. `npm test` and `npm run typecheck` must pass. See [CONTRIBUTING.md](CONTRIBUTING.md).
