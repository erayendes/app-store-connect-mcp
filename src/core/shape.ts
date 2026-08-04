/**
 * Response shaping for App Store Connect payloads.
 *
 * Measured on a real price-point listing: each item was ~1,100 bytes of which
 * ~120 bytes were data — the rest was `links` and links-only `relationships`
 * blocks repeating the same base64 id in URL form five times. The model never
 * follows those URLs (pagination rides on the separate `next_url` parameter),
 * so they are stripped by default, cutting a 900 KB listing to roughly 100 KB.
 * Set ASC_KEEP_RAW_RESPONSES=1 to pass Apple's payloads through untouched.
 *
 * On top of that, a configurable character ceiling keeps a single response
 * from flooding the client's context: oversized `data` arrays are cut to the
 * items that fit and the response says so, instead of silently costing tens of
 * thousands of tokens.
 */

/** A JSON:API resource object, loosely. */
type AnyRecord = Record<string, unknown>;

const isRecord = (v: unknown): v is AnyRecord =>
  Boolean(v) && typeof v === 'object' && !Array.isArray(v);

/** Strips `links` and links-only `relationships` from one resource object. */
function stripResource(resource: unknown): unknown {
  if (!isRecord(resource)) return resource;
  const out: AnyRecord = { ...resource };
  delete out.links;

  const rels = out.relationships;
  if (isRecord(rels)) {
    const kept: AnyRecord = {};
    for (const [name, rel] of Object.entries(rels)) {
      if (!isRecord(rel)) continue;
      // Keep only relationships that actually identify something ({type,id}
      // data); links-only blocks are pure URL noise.
      if ('data' in rel && rel.data !== undefined) {
        kept[name] = { data: rel.data };
      }
    }
    if (Object.keys(kept).length) out.relationships = kept;
    else delete out.relationships;
  }
  return out;
}

/**
 * Strips URL noise from a JSON:API payload. Top-level `links.next` is
 * preserved — the pagination cursor (`next_url`) depends on it.
 */
export function stripApiNoise(payload: unknown): unknown {
  if (!isRecord(payload)) return payload;
  const out: AnyRecord = { ...payload };

  if (Array.isArray(out.data)) out.data = out.data.map(stripResource);
  else if (isRecord(out.data)) out.data = stripResource(out.data);

  if (Array.isArray(out.included)) out.included = out.included.map(stripResource);

  if (isRecord(out.links)) {
    // Everything except the pagination cursor is noise.
    const next = out.links.next;
    if (typeof next === 'string' && next) out.links = { next };
    else delete out.links;
  }

  return out;
}

export const DEFAULT_MAX_RESPONSE_CHARS = 100_000;

/**
 * Caps a response's serialized size. When the payload has a `data` array, the
 * array is cut to the items that fit and the result stays valid JSON with an
 * explicit `truncation` note; otherwise the caller should truncate the raw
 * text (`truncateText`).
 */
export function capResponseSize(payload: unknown, maxChars: number): unknown {
  if (maxChars <= 0) return payload;
  // Measure the pretty-printed form — that's what actually goes to the client.
  const size = JSON.stringify(payload, null, 2)?.length ?? 0;
  if (size <= maxChars) return payload;

  if (isRecord(payload) && Array.isArray(payload.data) && payload.data.length > 1) {
    const total = payload.data.length;
    const avgItem = Math.max(1, Math.ceil(size / total));
    const keep = Math.max(1, Math.floor((maxChars * 0.9) / avgItem));
    const kept = payload.data.slice(0, keep);
    return {
      ...payload,
      data: kept,
      truncation: {
        // fields_* comes first because it is the only suggestion that returns
        // every row. A response is usually oversized across its columns rather
        // than its rows — 50 localizations are 264 KB whole and 16 KB with one
        // attribute named — so filtering or paginating here answers a narrower
        // question than the one that was asked, and dropping rows to fit is
        // what sends a caller to the shell to reassemble them.
        note:
          `Response truncated: showing ${kept.length} of ${total} items ` +
          `(full response was ~${Math.round(size / 1024)} KB). To get all ${total} ` +
          `with less per item, set fields_* to just the attributes you need. ` +
          `Otherwise narrow with filter_*, lower limit, or continue from links.next ` +
          `via next_url.`,
        shown: kept.length,
        total,
      },
    };
  }

  return payload; // non-array payloads are handled as text by the caller
}

/** Text-level fallback for oversized non-array payloads. */
export function truncateText(text: string, maxChars: number): string {
  if (maxChars <= 0 || text.length <= maxChars) return text;
  return (
    text.slice(0, maxChars) +
    `\n… [truncated: response was ${text.length} characters; ` +
    `narrow the query with filter_* parameters or paginate with next_url]`
  );
}
