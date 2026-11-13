# asc-access

Your App Store Connect team: members and roles, invitations, sandbox test accounts.

This plug-in registers one MCP server, **ASC-Access**, from [Heimdall](https://github.com/erayendes/app-store-connect-mcp), an open-source (MIT) server for the App Store Connect API and the App Store Server API.

## What it runs

```
npx -y @erayendes/asc-mcp@3.1.0 access --with-core
```

The package version is pinned to this plug-in's version, so a new Heimdall release reaches you only through a new version of this plug-in. The server runs locally on your machine and talks only to Apple's App Store Connect and App Store Server APIs. It sends nothing anywhere else and collects no telemetry.

## Before first use

Run this once in a real terminal to create or select your App Store Connect API key:

```
npx -y @erayendes/asc-mcp setup
```

`setup` stores the key in the macOS Keychain (or references its file path elsewhere). No key is written into this plug-in. What Heimdall reads and keeps is in the [privacy policy](https://github.com/erayendes/app-store-connect-mcp/blob/main/docs/PRIVACY.md).

## Safety

Every write that changes prices, access or anything customers see asks you first: a typed CONFIRM for money, access and deletions, a yes/no for customer-facing changes. Where the AI app cannot show that prompt, Heimdall opens a macOS dialog and waits for your answer. Start the server with `--read-only` to hide every write tool.

Full documentation: [docs/GUIDE_en.md](https://github.com/erayendes/app-store-connect-mcp/blob/main/docs/GUIDE_en.md).
