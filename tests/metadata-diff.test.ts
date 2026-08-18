/**
 * `listing__diff_metadata` — what changes between two versions, and nothing else.
 *
 * The failure this guards is a quiet one. Every field it compares is optional
 * and a submission with a stale `whatsNew` or a locale gone blank is complete,
 * so nothing else in Heimdall objects — `preflight__check_version` passes and
 * Apple's reviewer is the first reader. The tests therefore care most about the
 * cases that look like no change: an empty string against a null, a locale that
 * exists on one side only, and a value long enough to be truncated on the way
 * out.
 */
import { describe, it, expect } from 'vitest';
import {
  COMPARED_FIELDS,
  diffLocalizations,
  executeMetadataTool,
  METADATA_TOOLS,
} from '../src/tools/metadata.js';

const asMap = (o: Record<string, Record<string, unknown>>) => new Map(Object.entries(o));

interface Fixture {
  versions?: Array<{ id: string; versionString: string; appStoreState: string }>;
  locs?: Record<string, Array<Record<string, unknown>>>;
}

/** Two versions — one on sale, one being prepared — unless a test says otherwise. */
function fakeHttp(f: Fixture = {}) {
  const versions = f.versions ?? [
    { id: 'v2', versionString: '2.0', appStoreState: 'PREPARE_FOR_SUBMISSION' },
    { id: 'v1', versionString: '1.9', appStoreState: 'READY_FOR_SALE' },
  ];
  const locs = f.locs ?? {};
  return {
    get: async (path: string) => {
      if (path === '/v1/apps') return { data: [{ id: '42', attributes: { name: 'Ask Quran' } }] };
      if (path.endsWith('/appStoreVersions')) {
        return {
          data: versions.map((v) => ({
            id: v.id,
            attributes: { versionString: v.versionString, appStoreState: v.appStoreState },
          })),
        };
      }
      return { data: [] };
    },
    collect: async (path: string) => {
      const id = /appStoreVersions\/([^/]+)\//.exec(path)?.[1] ?? '';
      return { items: (locs[id] ?? []).map((attributes) => ({ attributes })), hasMore: false };
    },
  } as any;
}

const run = (http: any, args: Record<string, unknown> = {}) =>
  executeMetadataTool('listing__diff_metadata', { app: 'Ask Quran', ...args }, { http }) as Promise<any>;

describe('diffLocalizations', () => {
  it('treats null, undefined and empty string as the same absence', () => {
    const diff = diffLocalizations(
      asMap({ 'en-US': { description: 'Same', keywords: null, whatsNew: undefined } }),
      asMap({ 'en-US': { description: 'Same', keywords: '', whatsNew: '' } })
    );
    expect(diff.changed).toEqual([]);
    expect(diff.unchangedLocales).toBe(1);
  });

  it('reports a locale that went blank, which is the expensive silent case', () => {
    const diff = diffLocalizations(
      asMap({ tr: { description: 'Kur’an uygulaması' } }),
      asMap({ tr: { description: '' } })
    );
    expect(diff.changed).toEqual([
      { locale: 'tr', fields: [{ field: 'description', from: 'Kur’an uygulaması', to: '' }] },
    ]);
  });

  it('names added and removed locales instead of listing every field', () => {
    const diff = diffLocalizations(
      asMap({ 'en-US': { description: 'A' }, de: { description: 'B' } }),
      asMap({ 'en-US': { description: 'A' }, tr: { description: 'C' } })
    );
    expect(diff.localesAdded).toEqual(['tr']);
    expect(diff.localesRemoved).toEqual(['de']);
    expect(diff.changed).toEqual([]);
  });

  it('truncates long values and says so, so the response stays small', () => {
    const long = 'x'.repeat(400);
    const [only] = diffLocalizations(
      asMap({ 'en-US': { description: 'short' } }),
      asMap({ 'en-US': { description: long } })
    ).changed;
    expect(only.fields[0].truncated).toBe(true);
    expect(only.fields[0].to.length).toBeLessThan(200);
  });

  it('collapses whitespace so a reflowed paragraph reads as one line', () => {
    const [only] = diffLocalizations(
      asMap({ 'en-US': { whatsNew: 'Bug fixes' } }),
      asMap({ 'en-US': { whatsNew: 'Bug\n  fixes  and\tspeed' } })
    ).changed;
    expect(only.fields[0].to).toBe('Bug fixes and speed');
  });
});

describe('listing__diff_metadata', () => {
  it('defaults to the version on sale against the one being prepared', async () => {
    const out = await run(
      fakeHttp({
        locs: {
          v1: [{ locale: 'en-US', description: 'Old', keywords: 'quran' }],
          v2: [{ locale: 'en-US', description: 'New', keywords: 'quran' }],
        },
      })
    );
    expect(out.from).toEqual({ version: '1.9', appStoreState: 'READY_FOR_SALE' });
    expect(out.to).toEqual({ version: '2.0', appStoreState: 'PREPARE_FOR_SUBMISSION' });
    expect(out.identical).toBe(false);
    expect(out.changed[0].fields.map((f: any) => f.field)).toEqual(['description']);
  });

  it('says so plainly when nothing differs', async () => {
    const out = await run(
      fakeHttp({ locs: { v1: [{ locale: 'en-US', description: 'Same' }], v2: [{ locale: 'en-US', description: 'Same' }] } })
    );
    expect(out.identical).toBe(true);
    expect(out.changed).toEqual([]);
  });

  it('compares two named versions, in the order given', async () => {
    const out = await run(
      fakeHttp({
        versions: [
          { id: 'v3', versionString: '3.0', appStoreState: 'PREPARE_FOR_SUBMISSION' },
          { id: 'v2', versionString: '2.0', appStoreState: 'READY_FOR_SALE' },
          { id: 'v1', versionString: '1.0', appStoreState: 'REPLACED_WITH_NEW_VERSION' },
        ],
        locs: { v1: [{ locale: 'en-US', description: 'One' }], v3: [{ locale: 'en-US', description: 'Three' }] },
      }),
      { from: '1.0', to: '3.0' }
    );
    expect(out.from.version).toBe('1.0');
    expect(out.changed[0].fields[0]).toMatchObject({ from: 'One', to: 'Three' });
  });

  it('restricts to one locale when asked', async () => {
    const out = await run(
      fakeHttp({
        locs: {
          v1: [{ locale: 'en-US', description: 'Old' }, { locale: 'tr', description: 'Eski' }],
          v2: [{ locale: 'en-US', description: 'New' }, { locale: 'tr', description: 'Yeni' }],
        },
      }),
      { locale: 'tr' }
    );
    expect(out.changed.map((c: any) => c.locale)).toEqual(['tr']);
  });

  it('refuses a locale neither version has, rather than reporting no changes', async () => {
    await expect(
      run(fakeHttp({ locs: { v1: [{ locale: 'en-US' }], v2: [{ locale: 'en-US' }] } }), { locale: 'fr' })
    ).rejects.toThrow(/Neither version has a "fr" localization/i);
  });

  it('names the versions it found when one side cannot be chosen', async () => {
    await expect(
      run(
        fakeHttp({
          versions: [{ id: 'v1', versionString: '1.0', appStoreState: 'READY_FOR_SALE' }],
        })
      )
    ).rejects.toThrow(/no version being prepared.*1\.0/is);
  });

  it('refuses to compare a version with itself', async () => {
    await expect(
      run(fakeHttp(), { from: '2.0', to: '2.0' })
    ).rejects.toThrow(/same version/i);
  });

  it('is declared read-only and asks Apple for only the compared columns', async () => {
    expect(METADATA_TOOLS[0].annotations?.readOnlyHint).toBe(true);
    const asked: string[] = [];
    const http = fakeHttp({ locs: { v1: [], v2: [] } });
    const collect = http.collect;
    http.collect = async (path: string, query: Record<string, string>) => {
      asked.push(query['fields[appStoreVersionLocalizations]']);
      return collect(path, query);
    };
    await run(http);
    for (const fields of asked) {
      expect(fields.split(',')).toEqual(['locale', ...COMPARED_FIELDS]);
    }
  });
});
