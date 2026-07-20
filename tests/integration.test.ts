/**
 * Live smoke test against the real App Store Connect API.
 *
 * Skipped unless credentials are in the environment, so a clone without an
 * Apple account still gets a green suite. Never hardcode an account's key or
 * issuer ID here — this package is published to npm.
 *
 *   ASC_KEY_ID=... ASC_ISSUER_ID=... ASC_PRIVATE_KEY_KEYCHAIN=... npm test
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { AscHttpClient } from '../src/core/http.js';
import { TokenProvider } from '../src/core/jwt.js';
import { loadConfig } from '../src/core/config.js';

const hasKey =
  process.env.ASC_PRIVATE_KEY ||
  process.env.ASC_PRIVATE_KEY_PATH ||
  process.env.ASC_PRIVATE_KEY_KEYCHAIN;
const configured = Boolean(process.env.ASC_KEY_ID && process.env.ASC_ISSUER_ID && hasKey);

describe.skipIf(!configured)('App Store Connect API Integration', () => {
  let config: ReturnType<typeof loadConfig>;
  let http: AscHttpClient;

  beforeEach(() => {
    config = loadConfig([]);
    http = new AscHttpClient(new TokenProvider(config.credentials));
  });

  it('authenticates with App Store Connect API', () => {
    const token = new TokenProvider(config.credentials).getToken();
    const [header, payload] = token.split('.');
    expect(token.split('.')).toHaveLength(3);

    const decodedHeader = JSON.parse(Buffer.from(header, 'base64url').toString());
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString());

    expect(decodedHeader.alg).toBe('ES256');
    expect(decodedHeader.kid).toBe(process.env.ASC_KEY_ID);
    expect(decodedPayload.iss).toBe(process.env.ASC_ISSUER_ID);
    expect(decodedPayload.aud).toBe('appstoreconnect-v1');
  });

  it('lists apps from the account', async () => {
    const response = await http.collect('/v1/apps', { limit: 5 });
    expect(Array.isArray(response)).toBe(true);
  }, 30000);

  it('fetches app details', async () => {
    const apps = await http.collect('/v1/apps', { limit: 1 });
    expect(Array.isArray(apps)).toBe(true);
    if (apps.length > 0) {
      expect(apps[0].id).toBeDefined();
      expect(apps[0].attributes?.bundleId).toBeDefined();
    }
  }, 30000);
});
