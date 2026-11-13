# Comparison

🇬🇧 English · 🇹🇷 [Türkçe](COMPARISON_tr.md)

**Data as of 2026-11-13.** This page uses the November 2026 research snapshot, collected on November 11–13. Feature descriptions come from the linked projects' documentation; they are not an independent test of each product. Stars are a dated visibility measure, not a measure of reliability. “Unknown” means the research did not verify it.

Heimdall handles App Store Connect operations from an MCP client: subscription prices and offers, releases, TestFlight and customer reviews. It includes App Store Server API tools for individual customer transactions, one-call workflow macros and confirmation before risky writes. The alternatives below serve different parts of that work.

## Comparison table

| Product | Scope in the research | StoreKit 2 / Server API | Write controls reported | Runs | GitHub stars |
|---|---|---|---|---|---|
| [Heimdall](https://github.com/erayendes/app-store-connect-mcp) | 786 tools across 14 profiles; generated App Store Connect operations and workflow macros | Direct support | CONFIRM or yes/no by risk; read-only hides write tools; macOS confirmation dialog when the client cannot show the prompt | Local MCP over stdio; macOS Keychain | 57 |
| [asc CLI (rorkai/App-Store-Connect-CLI)](https://github.com/rorkai/App-Store-Connect-CLI) | CLI with Agent Skills; broad coverage, Apple Ads and web-session commands for creating apps and API keys | Direct support | `--confirm` flags | Local CLI | 8,300 |
| [fastlane](https://github.com/fastlane/fastlane) | CI builds, signing, uploads and metadata | Not reported as supported | Script-controlled | Local / CI | 42,400 |
| [JoshuaRileyDev/app-store-connect-mcp-server](https://github.com/JoshuaRileyDev/app-store-connect-mcp-server) | 27 tools; archived in February 2026 | Not supported | No server-side write controls reported | Local MCP | 331 |
| [magaza-mcp](https://github.com/tunaarikaya/magaza-mcp) | App Store Connect + Google Play; 41 tools and a gateway covering 1,440 operations | Unknown | `onayla=true`, read-only; Keychain storage | Local MCP | 105 |
| [zelentsov-dev/asc-mcp](https://github.com/zelentsov-dev/asc-mcp) | Swift MCP; README gives inconsistent counts of 200–537 tools; multiple teams | Unknown | Read-only and ID confirmation | Local MCP | 84 |
| [app-publish-mcp](https://github.com/mikusnuz/app-publish-mcp) | App Store Connect + Google Play; reported counts range from 91–188 tools | Unknown | Read-only | Local MCP | 41 |
| [pofky/asc-mcp](https://registry.modelcontextprotocol.io/v0/servers?search=asc-mcp) | 41 workflow-oriented tools | Unknown | Unknown | Local MCP | Not measured |
| [RevenueCat MCP](https://www.revenuecat.com/docs/tools/mcp/tools-reference) | 129 tools for RevenueCat's own subscription platform | Indirect, through its platform | Not verified; OAuth is documented for authentication | Hosted MCP | Not recorded |
| [Adapty MCP](https://adapty.io/docs/adapty-mcp) | Adapty's own platform APIs | Indirect, through its platform | Not verified; OAuth is documented for authentication | Hosted MCP | Not recorded |

Tool counts use different units: exposed MCP tools, gateway operations and CLI commands are not interchangeable. The ranges above preserve inconsistencies in the research rather than choosing the larger number. A missing write control in this table does not describe the approvals an MCP client may provide. OAuth authenticates access; it does not establish a per-write confirmation policy.

## Where Heimdall is behind

- **Google Play:** Heimdall covers Apple's APIs. magaza-mcp and app-publish-mcp cover both App Store Connect and Google Play.
- **Hosted / remote access:** Heimdall runs locally over stdio and has no hosted remote endpoint. RevenueCat and Adapty offer hosted MCPs with OAuth for their platforms.
- **Stars and visibility:** Heimdall had 57 GitHub stars in this snapshot, behind fastlane, asc CLI, JoshuaRileyDev, magaza-mcp and zelentsov-dev. That is a smaller public following, regardless of feature coverage.
- **Web-session operations:** Heimdall cannot create apps or API keys. asc CLI supports those operations through an App Store Connect web session.

## When to use something else

- **CI builds and signing:** use [fastlane](https://github.com/fastlane/fastlane) for the build and signing pipeline. Heimdall can handle App Store Connect operations alongside it.
- **Creating apps or API keys through a web session:** use [asc CLI](https://github.com/rorkai/App-Store-Connect-CLI) for those commands.
- **Both stores:** consider [magaza-mcp](https://github.com/tunaarikaya/magaza-mcp) or [app-publish-mcp](https://github.com/mikusnuz/app-publish-mcp) when you need App Store Connect and Google Play together.
- **Hosted subscription analytics:** use [RevenueCat MCP](https://www.revenuecat.com/docs/tools/mcp/tools-reference) when your subscription data and analytics live in RevenueCat. Its tools operate on that platform's subscription layer.

For Heimdall's workflow examples and confirmation behavior, see the [Guide](GUIDE_en.md). Choose the tools you need in [Profiles](PROFILES_en.md), then follow [Setup](SETUP_en.md).
