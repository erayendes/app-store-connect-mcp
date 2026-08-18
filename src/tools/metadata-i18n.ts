/**
 * Store metadata across languages — audited, drafted, and applied from a file
 * the user wrote.
 *
 * The shape of these three tools comes from one fact about App Store metadata:
 * the keyword field is a ranking input, not prose. The right Turkish keywords
 * are not a translation of the right English ones; they are the words Turkish
 * users actually type into search. A tool that renders English keywords into
 * Turkish and writes them has quietly replaced a ranking decision with a
 * language exercise, and nobody finds out until the installs do not arrive.
 *
 * So nothing here writes on its own judgement:
 *
 *   audit    reports gaps and stops. A finding is not a licence to fix it.
 *   draft    runs only when the caller named the target locales, and returns
 *            text for a person to read. It never writes.
 *   apply    writes values the user already decided, read from their file.
 *            The model does not retype them — transcription is exactly where
 *            a carefully chosen keyword list turns into a nearly-identical one.
 *
 * The audit and the draft use the same data+instruction pattern as
 * `./reviews-ai.ts`: Heimdall fetches and packages, the host model writes the
 * words. No second API key, and nothing goes to a model the user did not
 * already choose.
 */
import { readFile } from 'node:fs/promises';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { McpToolDefinition } from '../core/registry.js';
import type { AscHttpClient } from '../core/http.js';
import { AscApiError } from '../core/errors.js';
import { resolveApp } from '../core/resolve-app.js';

/**
 * Apple's limits, and the reason to check them here rather than let Apple do
 * it: a 409 on the eleventh locale leaves ten already written, and no way to
 * tell from the error which ones landed.
 */
const LIMITS: Record<string, number> = {
  description: 4000,
  keywords: 100,
  whatsNew: 4000,
  promotionalText: 170,
  marketingUrl: 255,
  supportUrl: 255,
};

/** The fields this tool set is about. Name and subtitle live on appInfo. */
const FIELDS = Object.keys(LIMITS);

export const METADATA_I18N_TOOLS: McpToolDefinition[] = [
  {
    name: 'metadata_ai__audit_localizations',
    description:
      'Compare an app version’s store text across every language and report what is missing ' +
      'or over Apple’s limit — empty descriptions, blank keywords, fields present in one ' +
      'language and absent in others. Read-only: it reports and stops, and never fills ' +
      'anything in.',
    inputSchema: {
      type: 'object',
      properties: {
        app: { type: 'string', description: 'App name, bundle ID (com.example.app) or numeric Apple ID.' },
        version: {
          type: 'string',
          description: 'Version string (e.g. "3.2.0"). Defaults to the newest version.',
        },
      },
      required: ['app'],
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'metadata_ai__draft_translation',
    description:
      'Return one language’s store text plus an instruction for you to draft it in the ' +
      'languages named. Only runs for locales the caller asks for — it never decides that a ' +
      'language looks stale. Returns a draft for a person to read; writing is a separate ' +
      'step, and for keywords the draft is a starting point rather than an answer, because ' +
      'keywords are a search-ranking choice rather than a translation.',
    inputSchema: {
      type: 'object',
      properties: {
        app: { type: 'string', description: 'App name, bundle ID (com.example.app) or numeric Apple ID.' },
        from_locale: { type: 'string', description: 'Source language to translate from, e.g. "en-US".' },
        to_locales: {
          type: 'array',
          items: { type: 'string' },
          description:
            'Target languages, e.g. ["tr", "de-DE"]. Required and never inferred: translating ' +
            'a language nobody asked about is how a deliberate choice gets overwritten.',
        },
        fields: {
          type: 'array',
          items: { type: 'string', enum: FIELDS },
          description: `Which fields to draft. Defaults to description and whatsNew. One of: ${FIELDS.join(', ')}.`,
        },
        version: { type: 'string', description: 'Version string. Defaults to the newest version.' },
      },
      required: ['app', 'from_locale', 'to_locales'],
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'metadata_ai__apply_localizations',
    description:
      'Write store text for several languages at once from a file the user prepared — the ' +
      'values are theirs, read straight from the file rather than retyped. Accepts CSV with ' +
      'a "locale" column and one column per field, or JSON keyed by locale. Every value is ' +
      'checked against Apple’s character limits before anything is sent, so a rejection on ' +
      'the eleventh language cannot leave ten already changed.',
    inputSchema: {
      type: 'object',
      properties: {
        app: { type: 'string', description: 'App name, bundle ID (com.example.app) or numeric Apple ID.' },
        file_path: {
          type: 'string',
          description:
            'Path to the CSV or JSON file. CSV: a header row of "locale" plus any of ' +
            `${FIELDS.join(', ')}. JSON: {"tr": {"description": "…"}, "de-DE": {…}}.`,
        },
        version: { type: 'string', description: 'Version string. Defaults to the newest version.' },
      },
      required: ['app', 'file_path'],
    },
  },
];

export const METADATA_I18N_TOOL_NAMES: ReadonlySet<string> = new Set(
  METADATA_I18N_TOOLS.map((t) => t.name)
);

/** The one that writes, so the confirmation gate can find it by name. */
export const METADATA_I18N_WRITE_TOOLS: ReadonlySet<string> = new Set([
  'metadata_ai__apply_localizations',
]);

interface Localization {
  id: string;
  locale: string;
  values: Record<string, string>;
}

async function localizationsFor(
  http: AscHttpClient,
  app: string,
  version?: string
): Promise<{ app: { id: string; name: string }; versionString: string; rows: Localization[] }> {
  const resolved = await resolveApp(http, app);
  const versions: any = await http.get(`/v1/apps/${encodeURIComponent(resolved.id)}/appStoreVersions`, {
    'fields[appStoreVersions]': 'versionString,appStoreState',
    limit: 20,
  });
  const all = versions?.data ?? [];
  const wanted = version?.trim();
  const chosen = wanted
    ? all.find((v: any) => String(v.attributes?.versionString ?? '') === wanted)
    : all[0];
  if (!chosen) {
    throw new AscApiError(
      wanted
        ? `${resolved.name} has no version "${wanted}". Found: ${all.map((v: any) => v.attributes?.versionString).join(', ') || 'none'}.`
        : `${resolved.name} has no App Store versions.`,
      0
    );
  }

  const locs: any = await http.get(
    `/v1/appStoreVersions/${encodeURIComponent(chosen.id)}/appStoreVersionLocalizations`,
    { limit: 200 }
  );
  return {
    app: resolved,
    versionString: String(chosen.attributes?.versionString ?? ''),
    rows: (locs?.data ?? []).map((l: any) => ({
      id: String(l.id),
      locale: String(l.attributes?.locale ?? ''),
      values: Object.fromEntries(
        FIELDS.map((f) => [f, String(l.attributes?.[f] ?? '')])
      ),
    })),
  };
}

/**
 * CSV with quoted fields, because a description contains commas and newlines
 * and a person edits this file in a spreadsheet. Not a dependency: the format
 * is one page of RFC 4180 and the alternative is asking everyone who installs
 * Heimdall to carry a parser for it.
 */
export function parseDelimited(text: string): Record<string, Record<string, string>> {
  const trimmed = text.replace(/^﻿/, '').trim();
  if (trimmed.startsWith('{')) {
    const parsed = JSON.parse(trimmed) as Record<string, Record<string, string>>;
    return parsed;
  }

  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i];
    if (quoted) {
      if (ch === '"') {
        if (trimmed[i + 1] === '"') { cell += '"'; i++; } else quoted = false;
      } else cell += ch;
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (ch !== '\r') cell += ch;
  }
  row.push(cell);
  rows.push(row);

  const header = rows[0]?.map((h) => h.trim());
  if (!header?.length || !header.includes('locale')) {
    throw new AscApiError(
      `The file needs a header row with a "locale" column. Found: ${header?.join(', ') || '(nothing)'}.`,
      0
    );
  }

  const out: Record<string, Record<string, string>> = {};
  for (const line of rows.slice(1)) {
    const locale = line[header.indexOf('locale')]?.trim();
    if (!locale) continue;
    const values: Record<string, string> = {};
    header.forEach((column, i) => {
      // A column the file carries and Apple does not is a typo worth naming,
      // but not here: `apply` reports them all at once instead of on the first.
      if (column !== 'locale' && line[i] !== undefined && line[i] !== '') values[column] = line[i];
    });
    out[locale] = values;
  }
  return out;
}

export async function executeMetadataI18nTool(
  name: string,
  args: Record<string, unknown>,
  ctx: { http: AscHttpClient; dryRun?: boolean }
): Promise<CallToolResult | unknown> {
  const app = String(args.app ?? '');
  if (!app) throw new AscApiError('"app" is required.', 0);
  const version = args.version ? String(args.version) : undefined;

  if (name === 'metadata_ai__audit_localizations') {
    const { app: resolved, versionString, rows } = await localizationsFor(ctx.http, app, version);

    // "Present somewhere and absent here" is the finding worth reporting: a
    // field no language fills in was a decision, and flagging it every run is
    // how a report gets ignored.
    const used = FIELDS.filter((f) => rows.some((r) => r.values[f]));
    const findings = rows.flatMap((r) => [
      ...used
        .filter((f) => !r.values[f])
        .map((f) => ({ locale: r.locale, field: f, problem: 'empty here, filled in elsewhere' })),
      ...FIELDS.filter((f) => r.values[f].length > LIMITS[f]).map((f) => ({
        locale: r.locale,
        field: f,
        problem: `${r.values[f].length} characters, over Apple's limit of ${LIMITS[f]}`,
      })),
    ]);

    return textResult(
      {
        app: `${resolved.name} (${resolved.id})`,
        version: versionString,
        locales: rows.map((r) => r.locale),
        fieldsInUse: used,
        findings,
        note:
          'Read-only. Nothing here is filled in automatically — keywords especially are a ' +
          'search-ranking choice rather than a gap to close.',
      },
      `Report the findings in structuredContent.findings, grouped by locale, shortest first. ` +
        `Do not offer to fill anything in and do not draft replacement text: the caller asked ` +
        `what is missing, not for it to be written. If they want a draft afterwards, ` +
        `metadata_ai__draft_translation is the tool, and it needs the target locales named.`
    );
  }

  if (name === 'metadata_ai__draft_translation') {
    const fromLocale = String(args.from_locale ?? '');
    const toLocales = (args.to_locales as string[] | undefined) ?? [];
    if (!fromLocale) throw new AscApiError('"from_locale" is required.', 0);
    if (!toLocales.length) {
      throw new AscApiError(
        '"to_locales" is required and is never inferred. Name the languages to draft — ' +
          'translating one nobody asked about is how a deliberate choice gets overwritten.',
        0
      );
    }
    const fields = ((args.fields as string[] | undefined) ?? ['description', 'whatsNew']).filter((f) =>
      FIELDS.includes(f)
    );

    const { app: resolved, versionString, rows } = await localizationsFor(ctx.http, app, version);
    const source = rows.find((r) => r.locale.toLowerCase() === fromLocale.toLowerCase());
    if (!source) {
      throw new AscApiError(
        `No "${fromLocale}" localization on version ${versionString}. Present: ${rows.map((r) => r.locale).join(', ')}.`,
        0
      );
    }

    return textResult(
      {
        app: `${resolved.name} (${resolved.id})`,
        version: versionString,
        from: source.locale,
        to: toLocales,
        source: Object.fromEntries(fields.map((f) => [f, source.values[f]])),
        characterLimits: Object.fromEntries(fields.map((f) => [f, LIMITS[f]])),
        existing: Object.fromEntries(
          toLocales.map((l) => {
            const row = rows.find((r) => r.locale.toLowerCase() === l.toLowerCase());
            return [l, row ? Object.fromEntries(fields.map((f) => [f, row.values[f]])) : null];
          })
        ),
        note: 'Draft only. Nothing was written.',
      },
      `Draft ${fields.join(' and ')} for each locale in structuredContent.to, from ` +
        `structuredContent.source. Stay under structuredContent.characterLimits for each field. ` +
        `structuredContent.existing shows what each locale has today — say when you are ` +
        `proposing to replace something rather than fill a blank. ` +
        (fields.includes('keywords')
          ? `For keywords, say plainly that a translation is a starting point and not an ` +
            `answer: the field is a search-ranking input, and the right words in a language ` +
            `are the ones its users type, which is a question about that market rather than ` +
            `about English. `
          : '') +
        `Show the drafts for approval. Do not write them — when the user has settled on the ` +
        `wording, they put it in a file and metadata_ai__apply_localizations applies it ` +
        `verbatim.`
    );
  }

  if (name !== 'metadata_ai__apply_localizations') {
    throw new Error(`Unknown metadata tool: ${name}`);
  }

  const filePath = String(args.file_path ?? '');
  if (!filePath) throw new AscApiError('"file_path" is required.', 0);

  let text: string;
  try {
    text = await readFile(filePath, 'utf8');
  } catch (err) {
    throw new AscApiError(`Could not read ${filePath}: ${(err as Error).message}`, 0);
  }
  const wanted = parseDelimited(text);

  const { app: resolved, versionString, rows } = await localizationsFor(ctx.http, app, version);
  const byLocale = new Map(rows.map((r) => [r.locale.toLowerCase(), r]));

  // Everything that could go wrong is collected before anything is sent. A
  // rejection partway through leaves some locales changed and some not, and
  // the error says nothing about which.
  const problems: string[] = [];
  const writes: Array<{ locale: string; id: string; values: Record<string, string> }> = [];
  for (const [locale, values] of Object.entries(wanted)) {
    const row = byLocale.get(locale.toLowerCase());
    if (!row) {
      problems.push(
        `${locale}: no such localization on version ${versionString}. Present: ${rows.map((r) => r.locale).join(', ')}. Create it with app_store_version_localizations__create first.`
      );
      continue;
    }
    for (const [field, value] of Object.entries(values)) {
      if (!FIELDS.includes(field)) {
        problems.push(`${locale}: "${field}" is not a field on a version localization. One of: ${FIELDS.join(', ')}.`);
      } else if (String(value).length > LIMITS[field]) {
        problems.push(`${locale}.${field}: ${String(value).length} characters, over Apple's limit of ${LIMITS[field]}.`);
      }
    }
    writes.push({ locale: row.locale, id: row.id, values });
  }

  if (problems.length) {
    throw new AscApiError(
      `${filePath} was not applied — nothing was sent to Apple:\n` +
        problems.map((p) => `  - ${p}`).join('\n'),
      0
    );
  }

  if (ctx.dryRun) {
    return {
      dryRun: true,
      app: `${resolved.name} (${resolved.id})`,
      version: versionString,
      wouldWrite: writes.map((w) => ({
        locale: w.locale,
        fields: Object.fromEntries(
          Object.entries(w.values).map(([f, v]) => [f, `${v.length} chars: ${v.slice(0, 60)}${v.length > 60 ? '…' : ''}`])
        ),
      })),
    };
  }

  const applied: Array<{ locale: string; fields: string[] }> = [];
  for (const write of writes) {
    await ctx.http.request('PATCH', `/v1/appStoreVersionLocalizations/${encodeURIComponent(write.id)}`, {
      body: {
        data: { type: 'appStoreVersionLocalizations', id: write.id, attributes: write.values },
      },
    });
    applied.push({ locale: write.locale, fields: Object.keys(write.values) });
  }

  return {
    app: `${resolved.name} (${resolved.id})`,
    version: versionString,
    applied,
    source: filePath,
    note: 'Values were taken from the file as written. Nothing was rephrased.',
  };
}

/** Same shape as reviews-ai: structured data for clients that read it, and the same JSON in text for those that do not. */
function textResult(structuredContent: Record<string, unknown>, instruction: string): CallToolResult {
  return {
    structuredContent,
    content: [
      { type: 'text', text: instruction },
      { type: 'text', text: '```json\n' + JSON.stringify(structuredContent, null, 2) + '\n```' },
    ],
  };
}
