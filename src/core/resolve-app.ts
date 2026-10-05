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

  // A name is matched against every app, so an unread page could hold the
  // real match or a second one. Read up to five pages (1,000 apps); past that,
  // refuse rather than answer from part of the catalogue.
  const apps: any[] = [...(res?.data ?? [])];
  let next: string | undefined = byBundleId ? undefined : res?.links?.next;
  for (let page = 1; next && page < 5; page++) {
    const more: any = await http.get(next);
    apps.push(...(more?.data ?? []));
    next = more?.links?.next;
  }
  if (next) {
    throw new AscApiError('This account has more than 1,000 apps, too many to match by name. Use the bundle ID or Apple ID.', 0);
  }

  const hits = byBundleId
    ? apps
    : apps.filter((a: any) =>
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
