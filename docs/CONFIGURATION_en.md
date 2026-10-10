# Configuration

🇬🇧 English · 🇹🇷 [Türkçe](CONFIGURATION_tr.md)

Most people never need this page: [setup](SETUP_en.md) saves everything Heimdall needs. Read on if you want to lock the AI out of changes, try a change without making it, use a second App Store Connect account, or run Heimdall without setup (in CI, for example).

There are two kinds of settings. **Flags** go at the end of `args` in your app's MCP settings. **Environment variables** go in an `env` block next to it:

```json
"ASC-AppInfo": {
  "command": "npx",
  "args": ["-y", "@erayendes/asc-mcp", "app-info", "--read-only"],
  "env": { "ASC_RATE_LIMIT_PER_HOUR": "1200" }
}
```

Restart your app after changing either.

## Flags

| Flag | What it does |
|:--|:--|
| `--read-only` | Removes every tool that can change something. The AI can't see them, so it can't call them. |
| `--dry-run` | Nothing reaches Apple. Each change returns what *would* have been sent, with its risk level. Reads work as usual. |
| `--confirm` | Asks before **every** change, not just the risky ones. |
| `--no-confirm` | Never asks. Your app's own tool approval is the only check left. |
| `--include-deprecated` | Also loads the 123 operations Apple has deprecated (102 of them are Game Center). |
| `--domains=<list>` | Only without a profile: loads these areas, comma-separated, or `all`. |

By default Heimdall asks before revenue, deletion, infrastructure and access changes, and leaves the rest to your app's approval.

## Environment variables

**Credentials.** Setup saves these for you. Set them only if you run without setup. When any of them is set, the saved settings are ignored entirely, so two accounts can never get mixed.

| Variable | What it's for |
|:--|:--|
| `ASC_KEY_ID` | Key ID from App Store Connect |
| `ASC_ISSUER_ID` | Issuer ID from App Store Connect |
| `ASC_PRIVATE_KEY_PATH` | Full path to the `.p8` file |
| `ASC_PRIVATE_KEY` | The contents of the `.p8` file, instead of a path |
| `ASC_PRIVATE_KEY_KEYCHAIN` | `service/account` of a macOS Keychain entry holding the key (macOS only) |
| `ASC_VENDOR_NUMBER` | Needed for sales and finance reports |

Give the key one way only. If more than one is set, `ASC_PRIVATE_KEY` wins, then the Keychain, then the path.

**Safety.** The same switches as the flags above.

| Variable | What it's for |
|:--|:--|
| `ASC_READ_ONLY` | `true` = `--read-only` |
| `ASC_DRY_RUN` | `1` or `true` = `--dry-run` |
| `ASC_CONFIRM_WRITES` | `1` / `true` = `--confirm`, `0` / `false` = `--no-confirm` |
| `ASC_INCLUDE_DEPRECATED` | `true` = `--include-deprecated` |
| `ASC_DOMAINS` | Same as `--domains` |

**StoreKit 2 (customer transactions).**

| Variable | What it's for |
|:--|:--|
| `ASC_BUNDLE_ID` | Turns on the StoreKit tools. One app only. |
| `ASC_APP_APPLE_ID` | Your app's numeric Apple ID |
| `ASC_ENVIRONMENT` | `Sandbox` (default) or `Production` |
| `ASC_APPLE_ROOT_CERTS` | Paths to Apple's root certificates (or one folder). Set it and StoreKit answers come back verified and decoded; without it you get Apple's signed payloads. |

**Responses.**

| Variable | What it's for |
|:--|:--|
| `ASC_MAX_RESPONSE_CHARS` | Largest answer sent to the AI, in characters (default 100000). A longer list is cut, with a note; the full answer stays available to your app without going through the AI. |
| `ASC_REDACT_PII` | `1` hides testers' names and email addresses from the AI, keeping the email domain. Useful for shared transcripts. Off by default, because listing testers is how you answer "who hasn't installed the build?" |
| `ASC_KEEP_RAW_RESPONSES` | `1` passes Apple's answers through untouched. By default link clutter is removed, which makes lists about 85% smaller. |

**Review reply drafts** (`reviews_ai__draft_response`).

| Variable | What it's for |
|:--|:--|
| `ASC_REVIEWS_BRAND_VOICE` | How replies should sound, e.g. "friendly, short, we say 'folks'" |
| `ASC_REVIEWS_BANNED_PHRASES` | Comma-separated phrases a draft must never use |
| `ASC_REVIEWS_SUPPORT_URL` | The support link drafts point customers to |

**Request limits.** Apple allows 3,600 requests per hour per key. Each Heimdall server paces itself as if it were the only one using the key, so if several tools or agents share a key, give each a slice.

| Variable | What it's for |
|:--|:--|
| `ASC_RATE_LIMIT_PER_HOUR` | Lower the hourly budget (default 3600) |
| `ASC_RATE_LIMIT_PER_MINUTE` | Lower the per-minute budget (default 300) |

**Other.**

| Variable | What it's for |
|:--|:--|
| `ASC_CONFIG_DIR` | Where setup's saved settings live (default `~/.config/asc-mcp`) |
| `ASC_BASE_URL` | Send requests to another address, such as a local test server. Leave unset for Apple. |

## Three ways to give the key

All three work the same; pick by how private the key needs to be.

- **File path** (all platforms, simplest): `ASC_PRIVATE_KEY_PATH` points at the `.p8`. Only the path is stored.
- **The key itself** (all platforms): `ASC_PRIVATE_KEY` holds the contents. Handy for CI secrets, but the key now sits in your settings or secret store word for word, so protect that file like the key.
- **macOS Keychain** (most private): setup does this for you. To do it by hand:

  ```bash
  security add-generic-password -s asc-mcp -a AuthKey_XXXXXXXXXX -w "$(cat AuthKey_XXXXXXXXXX.p8)"
  ```

  then set `ASC_PRIVATE_KEY_KEYCHAIN=asc-mcp/AuthKey_XXXXXXXXXX`.

## More than one App Store Connect account

Two ways, no extra setup needed:

- **Its own credentials per server.** Add a second server entry with its own `env` block. Environment variables replace the saved settings completely:

  ```json
  "ASC-ClientB": {
    "command": "npx",
    "args": ["-y", "@erayendes/asc-mcp", "app-info"],
    "env": { "ASC_KEY_ID": "…", "ASC_ISSUER_ID": "…", "ASC_PRIVATE_KEY_PATH": "/path/AuthKey_B.p8" }
  }
  ```

- **A separate settings folder.** Run setup once for the second account with its own folder:

  ```bash
  ASC_CONFIG_DIR=~/.config/asc-clientB npx -y @erayendes/asc-mcp setup
  ```

  When it asks which apps to register with, pick none, so it doesn't touch your first account's servers. Then put the same `ASC_CONFIG_DIR` in the second server's `env` block. Each folder keeps its own key, Vendor number and Bundle ID.

Name the servers after the account so you can tell them apart in your app.
