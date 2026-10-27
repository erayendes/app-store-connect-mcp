# Configuration

🇬🇧 English · 🇹🇷 [Türkçe](CONFIGURATION_tr.md)

Most people never need this page: [setup](SETUP_en.md) saves everything Heimdall needs. Read on if you want to lock the AI out of changes, try a change without making it, use a second App Store Connect account, or run Heimdall without setup (in CI, for example).

There are two kinds of settings. **Flags** go at the end of `args` in your app's MCP settings. **Environment variables** go in an `env` block next to it:

```json
"ASC-General": {
  "command": "npx",
  "args": ["-y", "@erayendes/asc-mcp@beta", "general", "--read-only"],
  "env": { "ASC_RATE_LIMIT_PER_HOUR": "1200" }
}
```

Restart your app after changing either.

## Flags

| Flag | What it does |
|:--|:--|
| `--read-only` | Removes every tool that can change something. The AI can't see them, so it can't call them. |
| `--dry-run` | No change is sent to Apple. Each change returns what *would* have been sent, with its risk level. Reads work as usual. |
| `--confirm` | Asks before **every** change, not just the risky ones. |
| `--no-confirm` | Stops asking, with one exception: `release__submit` and `release__submit_items` always ask. Otherwise your AI app's own tool approval is the only check left. |
| `--with-core` | Serves ASC-Core's tools (finding apps, tool search, the media tools) from this server too, for an AI app that can run only one server. Setup doesn't need it: it registers ASC-Core next to your profiles. |

**ASC-Core follows your strictest setting.** When setup or `register` adds ASC-Core to an app, it is read-only if any Heimdall server in that app is, by flag or by `ASC_READ_ONLY`. Making one profile read-only by hand later doesn't change ASC-Core; run setup again, or add `--read-only` to ASC-Core's entry too.

By default Heimdall asks in two ways:

- **Type CONFIRM** for any change at the revenue, deletion (`destructive`), infrastructure or access level — prices and offers, deletes, certificates and workflows, users and sandbox accounts — and for three steps that cannot be walked back: releasing a version, ending a pre-order, and expiring a build (`builds__update` with `expired: true`, which counts as a deletion). The pricing macros and `testflight__assign_build_to_groups` ask this way too.
- **Yes or no** for the steps that reach customers, players or testers: sending something to review (`release__submit`, `release__submit_items`, a review submission), creating a new subscription, subscription group or in-app purchase version, changing a phased rollout, sending a build to external beta review, selling in a country or changing availability, starting or changing a product page test, sending a score or achievement for a player, and changing retention messaging, the message customers see while cancelling a subscription (`storekit__manage_retention_messaging`), and replying to a customer review.

`testflight__assign_build_to_groups`, which resolves a build and adds it to beta groups in one call, asks for CONFIRM. Everything else — store text, a draft version, picking its build, other TestFlight settings and webhook settings — is left to your AI app's approval. A media tool asks at the level its plan has: placing an image on a page is at the `public` level (a change customers will see), so Heimdall does not ask and your AI app's approval decides; removing one, or uploading with `replace: true`, which deletes the existing file first, is a deletion and asks for CONFIRM.

Some AI apps can't show Heimdall's question; the Code tab in the Claude desktop app is one. On a Mac, Heimdall then opens a dialog of its own with the same summary, and the change runs only if you press its button, named for the change (Remove, Delete, Upload; Allow when no verb fits), or Return. Cancel (Don't Allow next to Allow) or Escape stops it. The AI can't see or click that dialog. It stays open until you answer; if the AI app cancels the call, the dialog closes with it.

<img src="https://raw.githubusercontent.com/erayendes/app-store-connect-mcp/main/assets/confirm-panel.png" alt="Heimdall's confirmation on a Mac: Remove a screenshot from the App Store page? Milowda Test App, iOS 1.0, Turkish; shot2.png will be taken off this page; the file stays in the media library. Buttons: Cancel and Remove." width="552"> On Windows and Linux, or with `ASC_NATIVE_CONFIRM=0`, those changes are refused there instead; make them in App Store Connect.

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
| `ASC_READ_ONLY` | `true`, `1` or `yes` (any case) = `--read-only`. Anything else, including `false`, `0` and empty, leaves writes on. |
| `ASC_DRY_RUN` | `1` or `true` = `--dry-run` |
| `ASC_CONFIRM_WRITES` | `1` / `true` = `--confirm`, `0` / `false` = `--no-confirm` (the release tools still ask) |
| `ASC_NATIVE_CONFIRM` | `0` = no Mac dialog when the app can't ask; those changes are refused instead |

**StoreKit 2 (customer transactions).**

| Variable | What it's for |
|:--|:--|
| `ASC_BUNDLE_ID` | The app StoreKit tools use when a request names none. Optional: they look the app up by name. |
| `ASC_APP_APPLE_ID` | The numeric Apple ID of that default app |
| `ASC_ENVIRONMENT` | `Production` (default) or `Sandbox` |
| `ASC_APPLE_ROOT_CERTS` | Extra Apple root certificates (paths or one folder). StoreKit answers are already verified against Apple Root CA - G3, which Heimdall ships; set this only if Apple adds another root. |

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
| `ASC_STATE_DIR` | Where Heimdall keeps what it records locally (default: the same folder as `ASC_CONFIG_DIR`): `audit.jsonl`, one line per write it carried out or you turned down (dry-run calls are not recorded) — when, which tool, how you confirmed it, what Apple answered; `failures.jsonl`, every call Apple refused, with its `x-request-id`; and `report-cache/`, sales and finance reports for finished periods. Nothing leaves your machine. |
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
    "args": ["-y", "@erayendes/asc-mcp@beta", "general"],
    "env": { "ASC_KEY_ID": "…", "ASC_ISSUER_ID": "…", "ASC_PRIVATE_KEY_PATH": "/path/AuthKey_B.p8" }
  }
  ```

- **A separate settings folder.** Run setup once for the second account with its own folder:

  ```bash
  ASC_CONFIG_DIR=~/.config/asc-clientB npx -y @erayendes/asc-mcp@beta setup
  ```

  Setup removes Heimdall from every app you leave unticked, so do not untick them. Choose the terminal when it asks, and answer **n** at *Apply these changes?*: the key is saved by then, and your first account's servers stay as they are. Then put the same `ASC_CONFIG_DIR` in the second server's `env` block. Each folder keeps its own key, Vendor number and Bundle ID.

Name the servers after the account so you can tell them apart in your app.

ASC-Core signs in with the saved settings, so setup can't tell which account it should use in an app that mixes two. There it adds no ASC-Core and says why. Add `--with-core` to each server's `args` instead, and every server carries its own copy of the core tools under its own account.
