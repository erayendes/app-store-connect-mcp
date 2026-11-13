# Privacy policy

Heimdall (`@erayendes/asc-mcp`) is an open-source MCP server that runs on your own computer. This page says what it reads, what it keeps, and where data goes. It applies to the npm package and to every Heimdall plug-in, which run the same package.

_Last updated: 2026-11-13._

## Who runs it

Heimdall has no hosted service. It runs as a local process started by your AI app (Claude, Cursor, Codex, Xcode and others) and talks to Apple on your behalf. The maintainer, Milowda, never receives any of your data.

## What it reads

When your AI app calls a tool, Heimdall reads from Apple's App Store Connect API and App Store Server API with your own API key: apps, builds, prices, reports, customer reviews, StoreKit transactions, team members and similar records in your account. Some of these can include personal data, such as a reviewer's nickname, a team member's name and email, or a customer's transaction details. Heimdall passes these results to your AI app, which is how the app answers your question.

## Where data goes

- **To Apple:** the requests your AI app asks for, signed with your key, sent to Apple's servers over HTTPS.
- **To your AI app:** the results of those requests, over the local connection the app started.
- **Nowhere else.** Heimdall sends nothing to the maintainer or any third party, and it has no telemetry, analytics or crash reporting.

What your AI app does with the results is governed by that app's own privacy policy.

## What it keeps on your computer

All of it stays on your machine, in `~/.config/asc-mcp` (or the folder `ASC_CONFIG_DIR` / `ASC_STATE_DIR` names), created readable by your user only:

- **Credentials:** your Key ID and Issuer ID in `config.json`. On macOS the private key is stored in the Keychain; elsewhere the config points to the `.p8` file you chose. Heimdall never copies the key anywhere else.
- **Audit log (`audit.jsonl`):** every write Heimdall was asked to make, how it was confirmed and Apple's answer. Arguments are recorded with secrets masked and request bodies reduced to the fields they set.
- **Failure log (`failures.jsonl`):** calls Apple refused, with Apple's request id, for support.
- **Report cache:** sales and finance reports for periods that have closed, so they are not downloaded twice.

You can delete these files at any time; Heimdall recreates what it needs. Uninstalling the package and removing the folder removes everything Heimdall stored.

## Children

Heimdall is a developer tool for App Store Connect account holders and is not intended for anyone under 18.

## Changes and contact

Changes to this policy are made in this file, and its history is in the repository. Questions: open an issue at <https://github.com/erayendes/app-store-connect-mcp/issues> or write to hi@milowda.com.
