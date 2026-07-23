/**
 * ES256 JWT signing for the App Store Connect API.
 *
 * Uses Node's built-in crypto — no third-party JWT dependency, so there is
 * no supply-chain surface between the private key and the signature.
 */
import { createSign, createPrivateKey, type KeyObject } from 'node:crypto';
import { readFileSync } from 'node:fs';

const TOKEN_LIFETIME_SEC = 20 * 60; // Apple's maximum
const REFRESH_LEEWAY_SEC = 90;

export interface JwtCredentials {
  keyId: string;
  issuerId: string;
  /** Absolute path to the downloaded .p8 file. */
  privateKeyPath?: string;
  /** PEM contents, as an alternative to privateKeyPath. */
  privateKey?: string;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Converts a raw ECDSA signature (r||s) into the JOSE format Apple expects.
 * Node emits DER by default, so we ask for 'ieee-p1363' which is already r||s.
 */
function loadKey(creds: JwtCredentials): KeyObject {
  let pem: string;
  if (creds.privateKey && creds.privateKey.trim()) {
    pem = creds.privateKey.replace(/\\n/g, '\n');
  } else if (creds.privateKeyPath) {
    pem = readFileSync(creds.privateKeyPath, 'utf8');
  } else {
    throw new Error(
      'No private key supplied. Set ASC_PRIVATE_KEY_PATH or ASC_PRIVATE_KEY.'
    );
  }

  try {
    return createPrivateKey({ key: pem, format: 'pem' });
  } catch (err) {
    throw new Error(
      `Failed to parse the private key. Make sure it is the unmodified .p8 file ` +
        `downloaded from App Store Connect. (${(err as Error).message})`
    );
  }
}

export class TokenProvider {
  // Parsed lazily on the first mint, not at construction: listing tools never
  // signs anything, so the server can start (and expose tools/list to
  // introspection harnesses) without a usable key. An invalid key surfaces on
  // the first real API call instead of blocking startup.
  private key?: KeyObject;
  private cached?: { token: string; expiresAt: number };

  constructor(private readonly creds: JwtCredentials) {
    if (!creds.keyId) throw new Error('Missing key ID (ASC_KEY_ID).');
    if (!creds.issuerId) throw new Error('Missing issuer ID (ASC_ISSUER_ID).');
  }

  private getKey(): KeyObject {
    if (!this.key) this.key = loadKey(this.creds);
    return this.key;
  }

  /** Returns a cached token when one is still comfortably valid. */
  getToken(): string {
    const now = Math.floor(Date.now() / 1000);
    if (this.cached && this.cached.expiresAt - now > REFRESH_LEEWAY_SEC) {
      return this.cached.token;
    }
    return this.mint(now);
  }

  /** Discards the cached token and signs a fresh one. */
  refresh(): string {
    this.cached = undefined;
    return this.getToken();
  }

  status(): { cached: boolean; expiresInSeconds: number | null } {
    if (!this.cached) return { cached: false, expiresInSeconds: null };
    const now = Math.floor(Date.now() / 1000);
    return { cached: true, expiresInSeconds: this.cached.expiresAt - now };
  }

  private mint(now: number): string {
    const exp = now + TOKEN_LIFETIME_SEC;

    const header = base64url(
      JSON.stringify({ alg: 'ES256', kid: this.creds.keyId, typ: 'JWT' })
    );
    const payload = base64url(
      JSON.stringify({
        iss: this.creds.issuerId,
        iat: now,
        exp,
        aud: 'appstoreconnect-v1',
      })
    );

    const signingInput = `${header}.${payload}`;
    const signer = createSign('SHA256');
    signer.update(signingInput);
    signer.end();

    // 'ieee-p1363' gives us the raw r||s pair that JOSE requires.
    const signature = signer.sign({ key: this.getKey(), dsaEncoding: 'ieee-p1363' });
    const token = `${signingInput}.${base64url(signature)}`;

    this.cached = { token, expiresAt: exp };
    return token;
  }
}
