import { describe, it, expect } from 'vitest';
import { summarizeExpirations } from '../src/tools/meta.js';

const DAY = 86_400_000;

function cert(id: string, name: string, inDays: number, now: number) {
  return {
    id,
    attributes: { displayName: name, expirationDate: new Date(now + inDays * DAY).toISOString() },
  };
}
function profile(id: string, name: string, inDays: number, now: number) {
  return {
    id,
    attributes: { name, expirationDate: new Date(now + inDays * DAY).toISOString() },
  };
}

describe('summarizeExpirations (asc__status check_expirations)', () => {
  const now = Date.parse('2026-07-28T00:00:00Z');

  it('flags items inside the 30-day window, sorted by date, and counts totals', () => {
    const certs = [cert('c1', 'iOS Dist', 45, now), cert('c2', 'Mac Dist', 5, now), cert('c3', 'Old', 20, now)];
    const profiles = [profile('p1', 'AppStore Profile', 400, now)];

    const out = summarizeExpirations(certs, profiles, now);

    expect(out.certificates.total).toBe(3);
    expect(out.certificates.expiringSoon.map((c) => c.id)).toEqual(['c2', 'c3']); // date order
    expect(out.profiles.expiringSoon).toEqual([]);
    expect(out.summary).toContain('2 certificate(s) expire within 30 days');
  });

  it('reports the calm case in plain words', () => {
    const out = summarizeExpirations([cert('c1', 'x', 200, now)], [], now);
    expect(out.summary).toContain('No certificates expiring');
  });

  it('treats an already-expired item as expiring soon, not as safe', () => {
    const out = summarizeExpirations([cert('c1', 'expired', -3, now)], [], now);
    expect(out.certificates.expiringSoon).toHaveLength(1);
  });
});
