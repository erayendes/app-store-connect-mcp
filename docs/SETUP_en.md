# Setup

🇬🇧 English · 🇹🇷 [Türkçe](SETUP_tr.md)

Heimdall runs anywhere Node.js **20.19+** runs: macOS, Linux and Windows. One feature is macOS-only: keeping the `.p8` key in the **macOS Keychain**. On Linux and Windows, setup saves the path to the key file instead. One more difference: automatic registration with the Claude desktop app currently works on macOS only.

## Create an API key
In App Store Connect, go to [Users and Access → Integrations → Keys](https://appstoreconnect.apple.com/access/integrations/api), create a key and download the `.p8` file. Note down the `Key ID` and `Issuer ID` shown on the same page.
If this is the first API key on the account, the Account Holder has to enable API access first. Team keys can only be created by the Account Holder or an Admin.

> [!WARNING]
> You can download the `.p8` file only once. Keep it somewhere safe until you've run `setup`.
> The role you give the key decides what the AI is allowed to do. [Pick the narrowest role](ROLES_en.md) that covers what you need.

## Run setup

**Get ready for an MCP setup unlike any you've seen.**

Open a terminal:
```bash
npx -y @erayendes/asc-mcp setup
```

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/app-store-connect-mcp/main/assets/setup.gif" alt="The setup wizard: key, issuer ID, credential check, profile and sub-profile selection, key stored in the Keychain" width="720">

### Save your credentials once — the setup wizard

The wizard asks in the order you'd think it through, in the browser and the terminal alike:

1. **What you need.** Each row in the [profile](PROFILES_en.md) picker shows how many tools it has and roughly how many tokens it costs; `[Admin key]` and `[vendor no.]` mark the rows that need one. The total is shown as you go.
2. **Your key.** From what you picked, it tells you the narrowest key [role](ROLES_en.md) that covers it. A saved key is offered first, with whether it is an Admin key. For a new one it checks the `Key ID` and `Issuer ID` as you type, takes the `.p8` path (drag and drop works) and checks everything with Apple; if Apple rejects it, you enter it again. The `Vendor number` is asked only if you picked sales and finance reports.
3. **Your AI apps.** It finds the ones installed on your machine. Settings files it edits directly are backed up first. Claude Desktop writes its own settings back while it is open, so setup asks you to quit it first. If setup itself runs inside Claude Desktop, quit Desktop and run setup from Terminal to include it.
4. **The plan.** What will change in each app, confirmed once.

Your credentials are saved once Apple has accepted them. Before the profiles are written to your apps, the wizard shows the plan and asks you to confirm once.

When it's done, restart your app and say *"Check my App Store Connect connection."*

> - The key is stored in the **macOS Keychain**. Elsewhere, setup saves the path to the key file.
> - **Everything that isn't secret** goes into `~/.config/asc-mcp/config.json`. Every profile reads this shared file.
> - **If you've run setup before**, it finds your saved Key ID and Issuer ID and offers to reuse them, so you only pick profiles again.
> - **Xcode 27** installs plug-ins from a Git URL and has no settings file to write, so the wizard can't set it up. It has [its own section](#using-heimdall-in-xcode-27).
> - **Having your AI install Heimdall?** It can only add profiles, with `register`. You run `setup` yourself for the key, and the key is never shown to the AI during setup. The rules are in [AGENTS.md](../AGENTS.md).

### Where it registers

No two AI apps share a settings file. Setup registers your profiles with every app it finds, so you don't have to repeat the same step in each one.

| App | Where | How it's written |
|:--|:--|:--|
| Claude Code | `~/.claude.json` | `claude mcp add` |
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` | edited directly |
| Codex | `~/.codex/config.toml` | `codex mcp add` |
| Antigravity | `~/.gemini/config/mcp_config.json` | edited directly |
| Cursor | `~/.cursor/mcp.json` | edited directly |
| Windsurf | `~/.codeium/windsurf/mcp_config.json` | edited directly |
| VS Code | your user MCP settings | `code --add-mcp` |

### In the browser or the terminal

`setup` first asks how you'd like to continue: in your browser (recommended) or here in the terminal. `setup --web` and `setup --terminal` skip the question. Over SSH it stays in the terminal, since the page would open on the far machine.

The browser page is the same wizard. You pick what you need first, and the page tells you which key role that needs and whether your saved key fits. Then you add the key (drop the `.p8` file onto the page), tick your AI apps and see what will change in each before you press Apply.

- The page runs on your own computer (`127.0.0.1`) behind a one-time link, and closes itself after Apply or 30 idle minutes.
- The key is saved the same way as in the terminal wizard: in the macOS Keychain; elsewhere by the path of your `.p8`, or, if you pasted it, as a file only you can read next to the shared settings.
- `--dry-run` shows the whole flow without saving anything or contacting Apple. `--no-open` prints the link instead of opening the browser, and `--port=N` picks the port.

## Adding and removing profiles

You don't have to install everything up front. Start with the few profiles you need and add more as your project grows.

- **Run setup again**: `npx -y @erayendes/asc-mcp setup`.
- It reuses your credentials and shows the pickers again.
- Apps and profiles come pre-ticked the way they are now. Tick or untick; setup adds and removes them in every app you selected.

## When you need a tool you haven't installed

Ask the AI. Heimdall finds the tool and, if needed, tells you how to add it. So don't hesitate to start with just a few profiles; you'll be told when something is missing.

## Using Heimdall in Xcode 27

1. If you haven't yet, run `npx -y @erayendes/asc-mcp setup` once. Your key goes into the Keychain.
2. Xcode → Settings → Intelligence → Plug-ins → **Add Plug-in…**
3. Choose **Add from URL** and paste `https://github.com/erayendes/app-store-connect-mcp`.

   <!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
   <img src="https://raw.githubusercontent.com/erayendes/app-store-connect-mcp/main/assets/xcode-add-from-url.png" alt="Xcode's Add Plug-in screen with the repository URL entered" width="560">

4. Xcode shows a "Choose Plug-ins" screen with a checkbox for each plug-in. Select **Heimdall | ASC Skill** and the areas you need.

   <!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
   <img src="https://raw.githubusercontent.com/erayendes/app-store-connect-mcp/main/assets/xcode-choose-plugins.png" alt="Xcode's Choose Plug-ins screen: Heimdall profiles, each with a checkbox" width="560">

5. The first App Store Connect call asks for permission, like any tool the AI uses.
6. **From here on, it's the Heimdall you know.**
7. To add another area later, start again from step 2.

> [!NOTE]
> Plug-ins go to agents, not to Xcode's own chat. In Xcode's model menu, pick an **agent** rather than a built-in model: Claude Agent, Codex or Gemini. The agent you pick starts Heimdall.

## Advanced settings

Read-only mode, trying changes without making them, a second App Store Connect account, running without setup: all in [Configuration](CONFIGURATION_en.md).

## Troubleshooting

| Symptom | What's going on | Fix |
|:--|:--|:--|
| **Installed, but it doesn't show up in Claude** | Claude only loads profiles at startup. Setup writes to both Claude apps through the **Claude (Code & Desktop)** option and says in its summary if one of them failed. | Quit Claude completely and reopen it. If the summary showed an error, run `setup` again. On Windows and Linux, automatic registration with the Claude desktop app isn't available yet. |
| **`401 Unauthorized`** | The Key ID, Issuer ID and `.p8` file don't belong to the same key, or the key was revoked. | Run `setup` again and answer **n** when it asks whether to reuse your saved credentials. Enter the key again; setup checks it with Apple before saving. |
| **`403 Forbidden`** | The key's role isn't enough for that action. | Ask the AI: *"Check my key's permissions."* Which role you need is in [Roles](ROLES_en.md). |
| **`409 Conflict` when updating a version** | App Store Connect only allows edits in certain version states. | A version that's in review or already released is locked. |
| **A tool I need isn't there** | It's in another profile. | Ask the AI: *"Is there a tool for X?"* |
| **`429 Too Many Requests`** | Apple applies an hourly request limit per key (currently 3,600), and it has been reached. | Heimdall waits a moment and retries on its own. If you see this often, another tool is using the same key (Fastlane in CI, for example); give it a key of its own. |
| **Can't create a new app** | Apple's API doesn't allow creating new apps. | Create the app once on the App Store Connect website; from then on you can manage it with Heimdall. |

## Uninstall

Run `setup` again and untick everything in the profile picker; it removes the profiles from the apps you select.

Two exceptions: VS Code has no remove command, so delete the Heimdall entries from VS Code's MCP settings by hand. Remove Xcode plug-ins under Xcode → Settings → Intelligence → Plug-ins with **Delete Plug-in**.

Then:

```bash
# The shared settings
rm -rf ~/.config/asc-mcp

# The key in the macOS Keychain, if you used it
security delete-generic-password -s asc-mcp -a AuthKey_XXXXXXXXXX

# The package, only if you installed it globally
npm uninstall -g @erayendes/asc-mcp
```

> [!WARNING]
> Deleting your local copy doesn't revoke the API key. Revoke the key itself in App Store Connect.
