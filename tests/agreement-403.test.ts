/**
 * The other 403.
 *
 * Apple answers "your key is scoped too narrowly" and "nobody has signed the
 * current agreement" with the same status, and the two lead opposite ways: one
 * is fixed by a role or a new key, the other only by the Account Holder
 * accepting terms on the developer website. Sending the second case to the
 * first answer costs an afternoon of rotating credentials that were never the
 * problem — and it is a case every account meets, because Apple ships a new
 * agreement roughly twice a year and blocks the API when the grace period ends.
 *
 * There is no endpoint that reports agreement state (`/v1/agreements` was
 * removed), so this error code is the only signal that exists.
 */
import { describe, it, expect } from 'vitest';
import { AscApiError } from '../src/core/errors.js';
import { AGREEMENT_HINT, STATUS_HINTS } from '../src/core/http.js';
import { classifyProbeForTest, probeCapabilities, type ProbeState } from '../src/tools/meta.js';

const agreementError = () =>
  new AscApiError('App Store Connect API returned 403', 403, [
    {
      code: 'FORBIDDEN.REQUIRED_AGREEMENTS_MISSING_OR_EXPIRED',
      title: 'A required agreement is missing or has expired.',
      detail: 'This request requires an in-effect agreement that has not been signed or has expired.',
    },
  ]);

const roleError = () =>
  new AscApiError('App Store Connect API returned 403', 403, [
    { code: 'FORBIDDEN_ERROR', title: 'This request is forbidden for security reasons' },
  ]);

describe('AscApiError.requiresAgreement', () => {
  it('recognises the agreement refusal', () => {
    expect(agreementError().requiresAgreement).toBe(true);
  });

  it('does not claim it for an ordinary 403, which is the expensive confusion', () => {
    expect(roleError().requiresAgreement).toBe(false);
  });

  it('does not claim it for a 401, where the key itself is the problem', () => {
    const unauthorized = new AscApiError('unauthorized', 401, [
      { code: 'FORBIDDEN.REQUIRED_AGREEMENTS_MISSING_OR_EXPIRED' },
    ]);
    expect(unauthorized.requiresAgreement).toBe(false);
  });
});

describe('the hint a reader acts on', () => {
  it('names the Account Holder, the developer website, and that a new key will not help', () => {
    expect(AGREEMENT_HINT).toMatch(/Account Holder/);
    expect(AGREEMENT_HINT).toMatch(/developer\.apple\.com\/account/);
    expect(AGREEMENT_HINT).toMatch(/new API key will not fix it/i);
  });

  it('warns off the page that looks right and is not', () => {
    // "Agreements, Tax, and Banking" in App Store Connect is the Paid Apps
    // agreement — a different document, and the usual wrong turn.
    expect(AGREEMENT_HINT).toMatch(/Agreements, Tax, and Banking/);
  });

  it('is not the roles hint, which would send the reader the wrong way', () => {
    expect(AGREEMENT_HINT).not.toBe(STATUS_HINTS[403]);
    expect(STATUS_HINTS[403]).toMatch(/role/i);
  });
});

describe('capability probing', () => {
  it('classifies the agreement 403 apart from a scoped key', () => {
    expect(classifyProbeForTest(agreementError())).toBe('agreement');
    expect(classifyProbeForTest(roleError())).toBe('forbidden');
  });

  it('stops probing when the account is blocked — five more 403s teach nothing', async () => {
    let calls = 0;
    const http = {
      get: async () => {
        calls++;
        throw agreementError();
      },
    } as any;

    const report = await probeCapabilities(http, 'agreement' as ProbeState, 'app-1');
    expect(calls, 'probed a family after the account was already known to be blocked').toBe(0);
    expect(report.summary).toMatch(/unsigned or expired agreement/i);
    expect(report.summary).toMatch(/Account Holder/);
    expect(report.reports).toBe('agreement');
  });
});
