import { describe, it, expect } from 'vitest';
import { resolveApp } from '../src/core/resolve-app.js';

// Pages of 200 apps; the last page has no `next`. `match` lands on the given page.
function catalogue(pages: number, match?: { page: number; name: string }) {
  const calls: string[] = [];
  const page = (n: number) => ({
    data: [
      { id: `a${n}`, attributes: { name: `Filler ${n}` } },
      ...(match?.page === n ? [{ id: 'hit', attributes: { name: match.name } }] : []),
    ],
    links: n < pages ? { next: `https://api.appstoreconnect.apple.com/v1/apps?cursor=${n + 1}` } : {},
  });
  const http = {
    get: async (path: string) => {
      calls.push(path);
      return page(path === '/v1/apps' ? 1 : Number(new URL(path).searchParams.get('cursor')));
    },
  } as never;
  return { http, calls };
}

describe('resolveApp by name', () => {
  it('finds a match past the first page', async () => {
    const { http, calls } = catalogue(3, { page: 3, name: 'Ask Quran' });
    expect(await resolveApp(http, 'ask quran')).toEqual({ id: 'hit', name: 'Ask Quran' });
    expect(calls).toHaveLength(3);
  });

  it('sees a second match on a later page as ambiguity, not as the first match', async () => {
    const { http } = catalogue(2, { page: 2, name: 'Filler extra' });
    await expect(resolveApp(http, 'filler')).rejects.toThrow(/ambiguous/);
  });

  it('refuses past five pages instead of answering from part of the catalogue', async () => {
    const { http, calls } = catalogue(6, { page: 1, name: 'Ask Quran' });
    await expect(resolveApp(http, 'Ask Quran')).rejects.toThrow(/more than 1,000 apps/);
    expect(calls).toHaveLength(5);
  });
});
