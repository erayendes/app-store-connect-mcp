import { describe, it, expect } from 'vitest';
import { TERRITORY_NAMES, toAlpha3, withAlpha3 } from '../src/core/territory-names.js';

describe('territory codes', () => {
  it('turns two letters, any case, into Apple’s three', () => {
    expect(['TR', 'tr', 'tur', 'TUR', ' us '].map(toAlpha3)).toEqual(['TUR', 'TUR', 'TUR', 'TUR', 'USA']);
    expect(toAlpha3('XK')).toBe('XKS');
    expect(toAlpha3('XX')).toBe('XX');
  });

  it('reaches each of the 175 territories from a two-letter code', () => {
    const letters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    const reached = new Set(letters.flatMap((a) => letters.map((b) => toAlpha3(a + b))));
    expect(Object.keys(TERRITORY_NAMES).filter((code) => !reached.has(code))).toEqual([]);
  });

  it('rewrites territory arguments, comma lists and body relationships, and nothing else', () => {
    expect(withAlpha3({
      territory: 'tr',
      territories: ['US', 'deu'],
      storefront_country_codes: ['gb'],
      'filter[territory]': 'US,TR',
      filter_reviewTerritory: 'de',
      locale: 'tr',
      'fields[territories]': 'currency',
      body: { data: { relationships: { territory: { data: { type: 'territories', id: 'jp' } } } } },
    })).toEqual({
      territory: 'TUR',
      territories: ['USA', 'DEU'],
      storefront_country_codes: ['GBR'],
      'filter[territory]': 'USA,TUR',
      filter_reviewTerritory: 'DEU',
      locale: 'tr',
      'fields[territories]': 'currency',
      body: { data: { relationships: { territory: { data: { type: 'territories', id: 'JPN' } } } } },
    });
  });
});
