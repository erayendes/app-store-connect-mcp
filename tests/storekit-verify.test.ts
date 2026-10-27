import { createHash } from 'node:crypto';
import { describe, it, expect } from 'vitest';
import { APPLE_ROOT_CA_G3 } from '../src/storekit/apple-root-ca.js';
import { StoreKitService } from '../src/storekit/index.js';
import type { ServerConfig } from '../src/core/config.js';

const base: ServerConfig = {
  credentials: {
    keyId: 'AAAAAAAAAA',
    issuerId: '00000000-0000-0000-0000-000000000000',
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg\n-----END PRIVATE KEY-----',
  },
  storekit: { bundleId: 'com.example.app', environment: 'Sandbox' },
  readOnly: false,
  confirmWrites: 'off',
  dryRun: false,
};

/**
 * The point of MIL-218 is that a decoded field is only worth more than the
 * envelope if its signature was checked. These pin the two halves of that: no
 * roots means no decoding, and a payload that fails verification produces an
 * error rather than fields with a caveat attached.
 */
describe('StoreKit payload verification', () => {
  it('verifies by default against the Apple root it ships', async () => {
    const service = new StoreKitService(base);
    // A payload that is not Apple-signed fails, rather than coming back as fields.
    await expect((service as any).decode(['a.b.c'], 'Sandbox', false)).rejects.toThrow(/failed signature verification/);
  });

  it('ships Apple Root CA - G3, byte for byte', () => {
    // Apple's published SHA-256 fingerprint of AppleRootCA-G3.cer.
    expect(createHash('sha256').update(APPLE_ROOT_CA_G3).digest('hex')).toBe(
      '63343abfb89a6a03ebb57e9b3f5fa7be7c4f5c756f3017b3a8c488c3653e9179'
    );
  });

  it('hands back the envelope when the caller asks for raw, even with roots', async () => {
    const service = new StoreKitService({
      ...base,
      storekit: { ...base.storekit!, appleRootCerts: ['/nope/missing.cer'] },
    });
    const decoded = await (service as any).decode(['a.b.c'], 'Sandbox', true);
    expect(decoded).toEqual(['a.b.c']);
  });

  // A path that does not exist adds nothing rather than crashing the server,
  // and the shipped root still verifies.
  it('keeps the shipped root when a configured path is unreadable', () => {
    const service = new StoreKitService({
      ...base,
      storekit: { ...base.storekit!, appleRootCerts: ['/nope/missing.cer'] },
    });
    expect((service as any).rootCertificates).toEqual([APPLE_ROOT_CA_G3]);
  });

  // A misconfigured root used to surface as a raw OpenSSL string — "PEM
  // routines::no start line" — which says nothing about what to do next.
  it('says what is wrong when the roots do not parse', async () => {
    const service = new StoreKitService({
      ...base,
      storekit: { ...base.storekit!, appleRootCerts: [] },
    });
    // Force a verifier with a bogus root so verification is attempted and fails.
    (service as any).rootCertificates = [Buffer.from('not a certificate')];
    await expect((service as any).decode(['a.b.c'], 'Sandbox', false)).rejects.toThrow(
      /does not parse as Apple's DER root certificates/
    );
  });
});
