/**
 * "Which app?" — the same question three macro families were each answering
 * with their own copy of this function.
 *
 * Every macro takes an app the way a person names one: a name, a bundle ID, or
 * the numeric Apple ID. Apple's API only takes the last of those, so each macro
 * grew a resolver, and the copies had already drifted — pricing's fetched whole
 * app objects where the others asked for two fields, and worded its errors
 * differently for the same failure.
 */
import { AscApiError } from './errors.js';
import type { AscHttpClient } from './http.js';

export interface ResolvedApp {
  id: string;
  name: string;
}

/**
 * A bundle ID is matched exactly and a name loosely, because a person typing a
 * name is usually typing part of one. An ambiguous name is an error rather than
 * a guess: picking the first of two apps is how a price change lands on the
 * wrong product.
 */
export async function resolveApp(http: AscHttpClient, app: string): Promise<ResolvedApp> {
  const wanted = app.trim();

  if (/^\d+$/.test(wanted)) {
    const res: any = await http.get(`/v1/apps/${encodeURIComponent(wanted)}`, {
      'fields[apps]': 'name,bundleId',
    });
    if (!res?.data) throw new AscApiError(`No app with Apple ID ${wanted}.`, 0);
    return { id: res.data.id, name: res.data.attributes?.name ?? wanted };
  }

  const byBundleId = wanted.includes('.');
  const res: any = await http.get('/v1/apps', {
    ...(byBundleId ? { 'filter[bundleId]': wanted } : { limit: 200 }),
    'fields[apps]': 'name,bundleId',
  });

  const hits = byBundleId
    ? (res?.data ?? [])
    : (res?.data ?? []).filter((a: any) =>
        String(a.attributes?.name ?? '')
          .toLowerCase()
          .includes(wanted.toLowerCase())
      );

  if (!hits.length) throw new AscApiError(`No app matching "${wanted}".`, 0);
  if (hits.length > 1) {
    throw new AscApiError(
      `"${wanted}" is ambiguous: ${hits.map((h: any) => h.attributes?.name).join(' | ')}. ` +
        `Use the bundle ID or Apple ID.`,
      0
    );
  }
  return { id: hits[0].id, name: hits[0].attributes?.name ?? wanted };
}
