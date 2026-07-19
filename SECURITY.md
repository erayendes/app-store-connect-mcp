# Security Policy

## Reporting a vulnerability

Please do not open a public issue for security problems. Open a private
[security advisory](https://github.com/erayendes/app-store-connect-mcp/security/advisories/new)
instead, and include reproduction steps and an impact assessment.

## How this server handles your credentials

- The `.p8` private key is read once at startup and held as a Node `KeyObject`.
  It is never logged, never serialised, and never sent anywhere except as the
  signature it produces.
- JWTs are signed locally with Node's built-in `crypto` using ES256. There is
  no third-party JWT dependency between your key and the signature.
- Tokens live in memory only, expire after 20 minutes, and are refreshed
  automatically.
- Every request — including paginated follow-ups from `links.next` — is pinned
  to `api.appstoreconnect.apple.com` over HTTPS. A pagination cursor pointing
  anywhere else is rejected rather than followed, so a redirected or tampered
  cursor cannot walk your bearer token to a third party.
- No telemetry, analytics or crash reporting of any kind.

## Recommendations

- Give the API key the narrowest role that does the job. `Admin` is rarely
  necessary; `App Manager` covers most release work, and `Developer` covers
  TestFlight.
- Never commit `.p8`, `.pem` or `.env` files. The bundled `.gitignore` already
  excludes them.
- Run with `--read-only` when you only need to inspect, and with `--domains` set
  to the smallest useful set. Fewer mutating tools loaded means fewer ways an
  unexpected instruction can change your store listing.
- Review any tool call annotated `destructiveHint` before approving it.
- Rotate keys periodically, and revoke immediately if a key may have leaked.
