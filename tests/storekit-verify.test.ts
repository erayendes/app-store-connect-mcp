import { describe, it, expect } from 'vitest';
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
  includeDeprecated: false,
  dryRun: false,
};

/**
 * The point of MIL-218 is that a decoded field is only worth more than the
 * envelope if its signature was checked. These pin the two halves of that: no
 * roots means no decoding, and a payload that fails verification produces an
 * error rather than fields with a caveat attached.
 */
describe('StoreKit payload verification', () => {
  it('hands back the envelope when no roots are configured', async () => {
    const service = new StoreKitService(base);
    const decoded = await (service as any).decode(['a.b.c'], 'Sandbox', false);
    expect(decoded).toEqual(['a.b.c']);
  });

  it('hands back the envelope when the caller asks for raw, even with roots', async () => {
    const service = new StoreKitService({
      ...base,
      storekit: { ...base.storekit!, appleRootCerts: ['/nope/missing.cer'] },
    });
    const decoded = await (service as any).decode(['a.b.c'], 'Sandbox', true);
    expect(decoded).toEqual(['a.b.c']);
  });

  // A path that does not exist reads as "no roots" rather than crashing the
  // server: 24 other tools do not need them.
  it('treats an unreadable certificate path as no roots at all', () => {
    const service = new StoreKitService({
      ...base,
      storekit: { ...base.storekit!, appleRootCerts: ['/nope/missing.cer'] },
    });
    expect((service as any).canVerify).toBe(false);
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
