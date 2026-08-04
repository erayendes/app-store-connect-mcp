import { describe, it, expect } from 'vitest';
import { stripApiNoise, capResponseSize, truncateText } from '../src/core/shape.js';

// Mirrors the measured real payload: a 56-char base64 id repeated in four
// links-only relationship blocks plus the self link.
const pricePoint = (seed: string) => {
  const id = `eyJzIjoiNjYzOTU5OTk5OSIsInQiOiJUVVIiLCJwIjoi${seed.padEnd(8, '0')}In0`;
  const rel = (name: string) => ({
    links: {
      self: `https://api.appstoreconnect.apple.com/v1/subscriptionPricePoints/${id}/relationships/${name}`,
      related: `https://api.appstoreconnect.apple.com/v1/subscriptionPricePoints/${id}/${name}`,
    },
  });
  return {
    type: 'subscriptionPricePoints',
    id,
    attributes: { customerPrice: '2.99', proceeds: '2.01', proceedsYear2: '2.01' },
    relationships: {
      equalizations: rel('equalizations'),
      adjustedEqualizations: rel('adjustedEqualizations'),
      territory: { data: { type: 'territories', id: 'TUR' } },
    },
    links: { self: `https://api.appstoreconnect.apple.com/v1/subscriptionPricePoints/${id}` },
  };
};

describe('stripApiNoise', () => {
  const payload = {
    data: [pricePoint('a'), pricePoint('b')],
    included: [pricePoint('inc')],
    links: {
      self: 'https://api.appstoreconnect.apple.com/v1/x',
      next: 'https://api.appstoreconnect.apple.com/v1/x?cursor=zz',
    },
    meta: { paging: { total: 842, limit: 200 } },
  };

  it('drops per-resource links and links-only relationships, keeps data relationships', () => {
    const out: any = stripApiNoise(payload);
    expect(out.data[0].links).toBeUndefined();
    expect(out.data[0].relationships.equalizations).toBeUndefined();
    expect(out.data[0].relationships.territory).toEqual({ data: { type: 'territories', id: 'TUR' } });
    expect(out.included[0].links).toBeUndefined();
    expect(out.meta).toEqual(payload.meta); // untouched
  });

  it('keeps top-level links.next (pagination) and drops links.self', () => {
    const out: any = stripApiNoise(payload);
    expect(out.links).toEqual({ next: 'https://api.appstoreconnect.apple.com/v1/x?cursor=zz' });
  });

  it('shrinks the real-world price-point shape by an order of magnitude', () => {
    const big = { data: Array.from({ length: 200 }, (_, i) => pricePoint(`id-${i}`)) };
    const before = JSON.stringify(big).length;
    const after = JSON.stringify(stripApiNoise(big)).length;
    expect(after).toBeLessThan(before * 0.5);
  });

  it('passes non-JSON:API payloads through untouched', () => {
    expect(stripApiNoise({ ok: true })).toEqual({ ok: true });
    expect(stripApiNoise('text')).toBe('text');
  });
});

describe('capResponseSize', () => {
  it('cuts an oversized data array and says so, keeping valid JSON', () => {
    const big = { data: Array.from({ length: 500 }, (_, i) => pricePoint(`id-${i}`)) };
    const out: any = capResponseSize(big, 20_000);
    expect(out.data.length).toBeLessThan(500);
    expect(out.truncation.total).toBe(500);
    expect(out.truncation.note).toContain('filter_');
    expect(JSON.stringify(out, null, 2).length).toBeLessThanOrEqual(25_000); // ~cap
  });

  /**
   * Truncation is the one moment the caller is provably paying attention to the
   * response's size, so it is where the cheapest remedy has to be named. Rows
   * are rarely the problem — 50 localizations are 264 KB whole and 16 KB with a
   * single attribute named — and every other suggestion here answers a narrower
   * question than the one that was asked.
   */
  it('offers fields_* first, as the only remedy that keeps every row', () => {
    const big = { data: Array.from({ length: 500 }, (_, i) => pricePoint(`id-${i}`)) };
    const note: string = (capResponseSize(big, 20_000) as any).truncation.note;
    expect(note).toContain('fields_');
    expect(note).toContain('all 500');
    expect(note.indexOf('fields_')).toBeLessThan(note.indexOf('filter_'));
  });

  it('leaves small responses alone', () => {
    const small = { data: [pricePoint('a')] };
    expect(capResponseSize(small, 100_000)).toBe(small);
  });
});

describe('truncateText', () => {
  it('cuts oversized text with an explanatory tail', () => {
    const out = truncateText('x'.repeat(1000), 100);
    expect(out).toContain('[truncated');
    expect(out.length).toBeLessThan(300);
  });
});
