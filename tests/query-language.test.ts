import { describe, it, expect } from 'vitest';
import { expandQueryTokens } from '../src/core/query-language.js';
import { searchOperations } from '../src/tools/meta.js';

// A stand-in catalogue: the real one is every operation name, description and
// path joined together, and the only thing the function asks of it is whether a
// word appears anywhere inside.
const CORPUS = 'update the price of a subscription in a territory parameter beta tester';

describe('query language expansion', () => {
  it('translates words the catalogue has never seen', () => {
    expect(expandQueryTokens('abonelik fiyatı', CORPUS)).toEqual(['subscription', 'price']);
  });

  // Turkish glues suffixes on: fiyat, fiyatı, fiyatını, fiyatlarını. A prefix
  // match covers the family without a morphology engine.
  it('sees through Turkish suffixes', () => {
    expect(expandQueryTokens('fiyatlarını güncelle', CORPUS)).toEqual(['price', 'update']);
  });

  // The safety rule, and the reason expansion is conditional: "parameter"
  // begins with "para". A blanket rewrite would turn it into "price".
  it('never touches a word the catalogue already contains', () => {
    expect(expandQueryTokens('parameter', CORPUS)).toEqual(['parameter']);
    expect(expandQueryTokens('beta tester', CORPUS)).toEqual(['beta', 'tester']);
  });

  it('passes through words it has no translation for', () => {
    expect(expandQueryTokens('zzqqxx', CORPUS)).toEqual(['zzqqxx']);
  });

  it('splits on the punctuation a real question carries', () => {
    expect(expandQueryTokens('ülke fiyatları ne?', CORPUS)).toEqual(['territory', 'price', 'ne']);
  });
});

describe('search reaches the right tool from Turkish', () => {
  // Before the expansion every one of these returned nothing at all — not a bad
  // ranking, an empty list. Tool discovery did not exist for a Turkish-speaking
  // user. Getting results is the fix; where they rank is a separate problem,
  // tracked query by query in tests/search-intents.test.ts.
  it.each([
    'abonelik fiyatını güncelle',
    'sertifika oluştur',
    'cihaz ekle',
    'uygulama açıklamasını değiştir',
    'ülke fiyatları ne?',
  ])('returns something for "%s"', (query) => {
    expect(searchOperations(query).length, `no results at all for "${query}"`).toBeGreaterThan(0);
  });

  it.each([
    ['sertifika oluştur', 'certificates.create'],
    ['cihaz ekle', 'devices.create'],
    ['abonelik fiyatı değiştir', 'subscription_prices.create'],
  ])('ranks the right tool in the top 5 for "%s"', (query, expected) => {
    expect(searchOperations(query).slice(0, 5).map((op) => op.name)).toContain(expected);
  });
});
