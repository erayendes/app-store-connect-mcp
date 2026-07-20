import { describe, it, expect, beforeEach } from 'vitest';
import { AscHttpClient } from '../src/core/http.js';
import { TokenProvider } from '../src/core/jwt.js';
import { loadConfig } from '../src/core/config.js';
import { readKeychainPassword } from '../src/core/keychain.js';

describe('App Store Connect API Integration', () => {
  let config: ReturnType<typeof loadConfig>;
  let http: AscHttpClient;

  beforeEach(() => {
    process.env.ASC_KEY_ID = 'J57JUU4W6X';
    process.env.ASC_ISSUER_ID = 'b513a21e-4ff0-4e05-98b3-6f5b0254d53d';
    process.env.ASC_PRIVATE_KEY_KEYCHAIN = 'asc-mcp/AuthKey_J57JUU4W6X';

    config = loadConfig([]);
    const tokenProvider = new TokenProvider(config.credentials);
    http = new AscHttpClient(tokenProvider);
  });

  it('authenticates with App Store Connect API', async () => {
    const token = new TokenProvider(config.credentials).getToken();
    expect(token).toBeTruthy();
    expect(token.split('.')).toHaveLength(3);

    const [header, payload] = token.split('.');
    const decodedHeader = JSON.parse(Buffer.from(header, 'base64url').toString());
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString());

    expect(decodedHeader.alg).toBe('ES256');
    expect(decodedHeader.kid).toBe('J57JUU4W6X');
    expect(decodedPayload.iss).toBe('b513a21e-4ff0-4e05-98b3-6f5b0254d53d');
    expect(decodedPayload.aud).toBe('appstoreconnect-v1');
  });

  it('lists apps from the account', async () => {
    const response = await http.collect('/v1/apps', {
      limit: 5,
    });
    expect(Array.isArray(response)).toBe(true);
    expect(response.length).toBeGreaterThanOrEqual(0);
  }, 30000);

  it('fetches app details', async () => {
    const apps = await http.collect('/v1/apps', { limit: 1 });
    expect(Array.isArray(apps)).toBe(true);
    if (apps.length > 0) {
      const app = apps[0];
      expect(app.id).toBeDefined();
      expect(app.attributes).toBeDefined();
      expect(app.attributes.bundleId).toBeDefined();
    }
  }, 30000);
});
