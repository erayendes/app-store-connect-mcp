/**
 * The rule these three tools exist to hold: nothing writes on its own
 * judgement.
 *
 * The reason is ASO rather than caution. The keyword field is a search-ranking
 * input, and the right Turkish keywords are not a translation of the right
 * English ones — they are what Turkish users type. A tool that renders English
 * keywords into Turkish and writes them has replaced a ranking decision with a
 * language exercise, and nobody finds out until the installs do not arrive.
 *
 * So the tests that matter here are the refusals: the audit reports and stops,
 * the draft will not guess which languages to touch, and the write takes its
 * values from the user's file rather than from anything a model produced.
 */
import { describe, it, expect, vi } from 'vitest';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  METADATA_I18N_TOOLS,
  METADATA_I18N_WRITE_TOOLS,
  executeMetadataI18nTool,
  parseDelimited,
} from '../src/tools/metadata-i18n.js';

const LOCALES = [
  { id: 'l-en', locale: 'en-US', description: 'An app.', keywords: 'quran,islam', whatsNew: 'Fixes.' },
  { id: 'l-tr', locale: 'tr', description: '', keywords: 'kuran', whatsNew: 'Düzeltmeler.' },
];

function fakeHttp(overrides: { locales?: typeof LOCALES } = {}) {
  const calls: Array<{ method: string; path: string; body?: unknown }> = [];
  const rows = overrides.locales ?? LOCALES;
  const get = async (path: string) => {
    if (path === '/v1/apps') {
      return { data: [{ id: '663', attributes: { name: 'Ask Quran', bundleId: 'com.milowda.askquranai' } }] };
    }
    if (path.includes('/appStoreVersionLocalizations')) {
      return { data: rows.map((l) => ({ id: l.id, attributes: l })) };
    }
    if (path.includes('/appStoreVersions')) {
      return { data: [{ id: 'v-320', attributes: { versionString: '3.2.0', appStoreState: 'PREPARE_FOR_SUBMISSION' } }] };
    }
    return { data: [] };
  };
  const request = async (method: string, path: string, opts?: { body?: unknown }) => {
    calls.push({ method, path, body: opts?.body });
    return { data: {} };
  };
  return { calls, http: { get, request } as never };
}

const run = (name: string, args: Record<string, unknown>, http: never, dryRun = false) =>
  executeMetadataI18nTool(name, args, { http, dryRun }) as Promise<any>;

describe('metadata_ai__audit_localizations', () => {
  it('reports the gap and tells the model not to close it', async () => {
    const { http, calls } = fakeHttp();
    const res = await run('metadata_ai__audit_localizations', { app: 'Ask Quran' }, http);

    expect(res.structuredContent.findings).toContainEqual({
      locale: 'tr',
      field: 'description',
      problem: 'empty here, filled in elsewhere',
    });
    // The instruction is the guarantee. A report that ends "shall I fill these
    // in?" is how an audit turns into a write.
    expect(res.content[0].text).toContain('Do not offer to fill anything in');
    expect(calls).toEqual([]);
  });

  it('says nothing about a field no language uses', async () => {
    // promotionalText is empty everywhere, which is a decision. Flagging it on
    // every locale every run is how a report gets ignored.
    const { http } = fakeHttp();
    const res = await run('metadata_ai__audit_localizations', { app: 'Ask Quran' }, http);
    expect(res.structuredContent.fieldsInUse).not.toContain('promotionalText');
    expect(res.structuredContent.findings.map((f: any) => f.field)).not.toContain('promotionalText');
  });

  it('catches a value Apple would reject', async () => {
    const { http } = fakeHttp({
      locales: [{ ...LOCALES[0], keywords: 'x'.repeat(101) }, LOCALES[1]],
    });
    const res = await run('metadata_ai__audit_localizations', { app: 'Ask Quran' }, http);
    expect(res.structuredContent.findings.map((f: any) => f.problem).join()).toContain('101 characters');
  });
});

describe('metadata_ai__draft_translation', () => {
  it('refuses to guess which languages to draft', async () => {
    const { http } = fakeHttp();
    await expect(
      run('metadata_ai__draft_translation', { app: 'Ask Quran', from_locale: 'en-US', to_locales: [] }, http)
    ).rejects.toThrow(/never inferred/i);
  });

  it('returns a draft and says it wrote nothing', async () => {
    const { http, calls } = fakeHttp();
    const res = await run(
      'metadata_ai__draft_translation',
      { app: 'Ask Quran', from_locale: 'en-US', to_locales: ['tr'] },
      http
    );
    expect(res.structuredContent.source.description).toBe('An app.');
    // What the target already has, so a draft can say "replacing" rather than
    // "filling in" — the difference between the two is whether someone's work
    // is about to be overwritten.
    expect(res.structuredContent.existing.tr).toBeDefined();
    expect(res.content[0].text).toContain('Do not write them');
    expect(calls).toEqual([]);
  });

  it('says a keyword translation is a starting point, not an answer', async () => {
    const { http } = fakeHttp();
    const res = await run(
      'metadata_ai__draft_translation',
      { app: 'Ask Quran', from_locale: 'en-US', to_locales: ['tr'], fields: ['keywords'] },
      http
    );
    expect(res.content[0].text).toContain('search-ranking input');
  });
});

describe('metadata_ai__apply_localizations', () => {
  const withFile = (contents: string, name = 'meta.csv') => {
    const path = join(mkdtempSync(join(tmpdir(), 'heimdall-i18n-')), name);
    writeFileSync(path, contents, 'utf8');
    return path;
  };

  it('writes the file’s values verbatim', async () => {
    const { http, calls } = fakeHttp();
    const file = withFile('locale,keywords\ntr,"kuran, namaz, dua"\n');
    const res = await run('metadata_ai__apply_localizations', { app: 'Ask Quran', file_path: file }, http);

    expect(calls).toHaveLength(1);
    expect(calls[0].method).toBe('PATCH');
    expect((calls[0].body as any).data.attributes.keywords).toBe('kuran, namaz, dua');
    expect(res.applied).toEqual([{ locale: 'tr', fields: ['keywords'] }]);
  });

  it('sends nothing at all when one locale is over the limit', async () => {
    // A 409 on the eleventh locale leaves ten already written and no way to
    // tell from the error which ones landed.
    const { http, calls } = fakeHttp();
    const file = withFile(`locale,keywords\nen-US,short\ntr,${'x'.repeat(101)}\n`);
    await expect(
      run('metadata_ai__apply_localizations', { app: 'Ask Quran', file_path: file }, http)
    ).rejects.toThrow(/over Apple's limit of 100/);
    expect(calls).toEqual([]);
  });

  it('names a locale that does not exist rather than creating it', async () => {
    const { http, calls } = fakeHttp();
    const file = withFile('locale,description\nde-DE,Eine App.\n');
    await expect(
      run('metadata_ai__apply_localizations', { app: 'Ask Quran', file_path: file }, http)
    ).rejects.toThrow(/no such localization/);
    expect(calls).toEqual([]);
  });

  it('rehearses under dry-run', async () => {
    const { http, calls } = fakeHttp();
    const file = withFile('locale,description\ntr,Bir uygulama.\n');
    const res = await run('metadata_ai__apply_localizations', { app: 'Ask Quran', file_path: file }, http, true);
    expect(res.dryRun).toBe(true);
    expect(calls).toEqual([]);
  });

  it('is the only one of the three that can write', () => {
    expect([...METADATA_I18N_WRITE_TOOLS]).toEqual(['metadata_ai__apply_localizations']);
    const readOnly = METADATA_I18N_TOOLS.filter((t) => t.annotations?.readOnlyHint === true).map((t) => t.name);
    expect(readOnly).toEqual(['metadata_ai__audit_localizations', 'metadata_ai__draft_translation']);
  });
});

describe('the file a non-programmer hands back', () => {
  it('reads a description with commas and newlines in it', () => {
    // The whole reason for quoting: this is what a real description looks like,
    // and it is edited in a spreadsheet.
    const parsed = parseDelimited('locale,description\ntr,"Bir, iki\nüç"\n');
    expect(parsed.tr.description).toBe('Bir, iki\nüç');
  });

  it('reads a doubled quote as one', () => {
    expect(parseDelimited('locale,description\ntr,"a ""b"" c"\n').tr.description).toBe('a "b" c');
  });

  it('skips a cell left empty rather than blanking the field', () => {
    // An empty cell in a spreadsheet means "I did not touch this", not "make
    // it empty". Writing '' would delete a description someone wrote.
    const parsed = parseDelimited('locale,description,keywords\ntr,,kuran\n');
    expect(parsed.tr).toEqual({ keywords: 'kuran' });
  });

  it('takes JSON too, since half of these files come from a script', () => {
    expect(parseDelimited('{"tr":{"keywords":"kuran"}}').tr.keywords).toBe('kuran');
  });

  it('says what is wrong with a file that has no locale column', () => {
    expect(() => parseDelimited('language,description\ntr,x\n')).toThrow(/"locale" column/);
  });
});
