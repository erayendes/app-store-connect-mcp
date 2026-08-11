/**
 * HTTP client for the App Store Connect API.
 *
 * Two things this client is strict about:
 *  - every request goes to the pinned Apple host, including paginated follow-ups
 *  - transient failures are retried with exponential backoff + jitter, but only
 *    when a retry cannot duplicate a write: reads retry on 408/429/5xx, writes
 *    retry only on 429 (Apple rejected the request before processing it). A
 *    write that fails ambiguously (timeout, network drop, 5xx) is surfaced as
 *    an unknown outcome instead of being silently resent — resending a POST
 *    Apple already processed would create the resource twice.
 */
import { TokenProvider } from './jwt.js';
import { RateLimiter, type RateLimitOptions } from './rate-limit.js';
import { AscApiError } from './errors.js';

export const ASC_HOST = 'api.appstoreconnect.apple.com';
export const ASC_BASE_URL = `https://${ASC_HOST}`;

const RETRYABLE = new Set([408, 429, 500, 502, 503, 504]);

export interface HttpOptions {
  maxRetries?: number;
  timeoutMs?: number;
  rateLimit?: RateLimitOptions;
  baseUrl?: string;
}

export type Query = Record<string, string | number | boolean | string[] | undefined>;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class AscHttpClient {
  private readonly maxRetries: number;
  private readonly timeoutMs: number;
  private readonly baseUrl: string;
  private readonly allowedHost: string;
  private readonly allowedProtocol: string;
  readonly limiter: RateLimiter;

  constructor(
    private readonly tokens: TokenProvider,
    opts: HttpOptions = {}
  ) {
    this.maxRetries = opts.maxRetries ?? 3;
    this.timeoutMs = opts.timeoutMs ?? 60_000;
    this.baseUrl = (opts.baseUrl ?? ASC_BASE_URL).replace(/\/$/, '');
    const base = new URL(this.baseUrl);
    this.allowedHost = base.host;
    // Pin the protocol too: https against Apple (the default), but a local
    // fixture server (ASC_BASE_URL=http://localhost:…) paginates over http.
    this.allowedProtocol = base.protocol;
    this.limiter = new RateLimiter(opts.rateLimit);
  }

  /**
   * Resolves a `links.next` URL returned by Apple.
   * Rejects anything pointing off-host — a redirected pagination cursor must
   * never be able to walk our bearer token to a third party.
   */
  resolvePaginationUrl(raw: string): URL {
    let url: URL;
    try {
      url = new URL(raw);
    } catch {
      throw new AscApiError(`Malformed pagination URL: ${raw}`, 0);
    }
    if (url.protocol !== this.allowedProtocol || url.host !== this.allowedHost) {
      throw new AscApiError(
        `Refusing to follow pagination URL to unexpected host "${url.host}". ` +
          `Only ${this.allowedHost} is allowed.`,
        0
      );
    }
    return url;
  }

  async request<T = unknown>(
    method: string,
    path: string,
    opts: { query?: Query; body?: unknown; accept?: string } = {}
  ): Promise<T> {
    const url = /^https?:\/\//.test(path)
      ? this.resolvePaginationUrl(path)
      : new URL(this.baseUrl + (path.startsWith('/') ? path : `/${path}`));

    if (opts.query) applyQuery(url, opts.query);

    // Writes may not be idempotent (a resent POST can create a second version,
    // IAP or price entry), so they only retry when Apple provably did not
    // process the request — a 429 rate rejection. Reads retry freely.
    const isWrite = method !== 'GET' && method !== 'HEAD';

    let lastError: unknown;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      await this.limiter.acquire();

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const res = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.tokens.getToken()}`,
            Accept: opts.accept ?? 'application/json',
            ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
          },
          body: opts.body ? JSON.stringify(opts.body) : undefined,
          signal: controller.signal,
        });

        this.limiter.observeHeader(res.headers.get('x-rate-limit'));

        if (res.ok) {
          if (res.status === 204) return undefined as T;
          const contentType = res.headers.get('content-type') ?? '';
          if (contentType.includes('json')) return (await res.json()) as T;
          // Sales and finance reports come back as gzipped TSV.
          const buf = Buffer.from(await res.arrayBuffer());
          return { contentType, base64: buf.toString('base64') } as T;
        }

        const err = await toApiError(res);

        const retryable = RETRYABLE.has(res.status) && (!isWrite || res.status === 429);
        if (retryable && attempt < this.maxRetries) {
          await sleep(backoffMs(attempt, res.headers.get('retry-after')));
          lastError = err;
          continue;
        }
        throw err;
      } catch (err) {
        // A thrown AscApiError past the retry check is final.
        if (err instanceof AscApiError) throw err;

        const isAbort = (err as Error)?.name === 'AbortError';
        const message = isAbort
          ? `Request timed out after ${this.timeoutMs}ms`
          : `Network error: ${(err as Error).message}`;

        // No response means we cannot know whether Apple processed the
        // request. For a write, resending could apply it twice — report the
        // unknown outcome instead of retrying or pretending it failed cleanly.
        if (isWrite) {
          throw new AscApiError(
            `${message}. This ${method} request may or may not have been processed by ` +
              `Apple — verify whether the change was applied before sending it again.`,
            0
          );
        }

        if (attempt < this.maxRetries) {
          await sleep(backoffMs(attempt, null));
          lastError = new AscApiError(message, 0);
          continue;
        }
        throw new AscApiError(message, 0);
      } finally {
        clearTimeout(timer);
      }
    }

    throw lastError ?? new AscApiError('Request failed', 0);
  }

  get<T>(path: string, query?: Query) {
    return this.request<T>('GET', path, { query });
  }
  post<T>(path: string, body?: unknown) {
    return this.request<T>('POST', path, { body });
  }
  patch<T>(path: string, body?: unknown) {
    return this.request<T>('PATCH', path, { body });
  }
  delete<T>(path: string, body?: unknown) {
    return this.request<T>('DELETE', path, { body });
  }

  /**
   * PUTs one slice of an asset to an upload URL Apple handed back in an
   * `uploadOperations` array.
   *
   * Deliberately not `request()`. Every other call here carries the bearer
   * token; these must not. The upload URLs are pre-signed and arrive with their
   * own `requestHeaders`, so attaching our credential would hand it to a
   * different host than the one it was minted for.
   *
   * That is also why the host is checked. `uploadOperations` is API-supplied
   * data, not a user's input, and the body is a file off the user's disk — an
   * unchecked URL there is a request to POST local files wherever the response
   * says. Pagination already refuses to leave `allowedHost` for the same class
   * of reason; uploads legitimately go to Apple's asset hosts rather than the
   * API host, so the rule widens to Apple rather than disappearing. The base
   * host stays allowed so ASC_BASE_URL can point tests at a fixture server.
   */
  async uploadAssetPart(
    op: { method: string; url: string; requestHeaders?: Array<{ name?: string; value?: string }> },
    body: Uint8Array
  ): Promise<void> {
    let url: URL;
    try {
      url = new URL(op.url);
    } catch {
      throw new AscApiError(`Malformed upload URL: ${op.url}`, 0);
    }
    const appleHost = url.protocol === 'https:' && /(^|\.)apple\.com$/.test(url.hostname);
    const fixtureHost = url.protocol === this.allowedProtocol && url.host === this.allowedHost;
    if (!appleHost && !fixtureHost) {
      throw new AscApiError(
        `Refusing to upload to "${url.host}": an upload URL must be an https Apple host ` +
          `(or the configured ASC_BASE_URL). This one came back from the API — treat it ` +
          `as a sign the response was not what it claimed.`,
        0
      );
    }

    const headers: Record<string, string> = {};
    for (const h of op.requestHeaders ?? []) {
      if (h?.name && h.value !== undefined) headers[h.name] = String(h.value);
    }

    await this.limiter.acquire();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const res = await fetch(url, {
        method: op.method || 'PUT',
        headers,
        body,
        signal: controller.signal,
      });
      // No retry. A half-uploaded asset is fixed by re-reserving the whole
      // thing, not by resending one slice into an unknown server-side state.
      if (!res.ok) throw await toApiError(res);
    } catch (err) {
      if (err instanceof AscApiError) throw err;
      const isAbort = (err as Error)?.name === 'AbortError';
      throw new AscApiError(
        isAbort
          ? `Upload timed out after ${this.timeoutMs}ms`
          : `Upload network error: ${(err as Error).message}`,
        0
      );
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * GETs a pre-signed asset URL Apple handed back in a response body — an
   * analytics report segment, for instance, where the rows live at the URL and
   * not in the JSON.
   *
   * Same reasoning as `uploadAssetPart`: no bearer token, because the URL
   * already carries its own signature and is not on the API host, and a host
   * check because the URL is API-supplied data rather than something the user
   * typed.
   */
  async downloadAsset(rawUrl: string, maxBytes = 64 * 1024 * 1024): Promise<Buffer> {
    let url: URL;
    try {
      url = new URL(rawUrl);
    } catch {
      throw new AscApiError(`Malformed asset URL: ${rawUrl}`, 0);
    }
    const appleHost = url.protocol === 'https:' && /(^|\.)apple\.com$/.test(url.hostname);
    const fixtureHost = url.protocol === this.allowedProtocol && url.host === this.allowedHost;
    if (!appleHost && !fixtureHost) {
      throw new AscApiError(
        `Refusing to download from "${url.host}": an asset URL must be an https Apple host ` +
          `(or the configured ASC_BASE_URL).`,
        0
      );
    }

    await this.limiter.acquire();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw await toApiError(res);
      const buf = Buffer.from(await res.arrayBuffer());
      // A cap, not a stream: these are report segments, and one that does not
      // fit in memory is a sign the caller wanted a narrower query.
      if (buf.length > maxBytes) {
        throw new AscApiError(
          `Asset is ${buf.length} bytes, over the ${maxBytes}-byte limit. Narrow the request.`,
          0
        );
      }
      return buf;
    } catch (err) {
      if (err instanceof AscApiError) throw err;
      const isAbort = (err as Error)?.name === 'AbortError';
      throw new AscApiError(
        isAbort
          ? `Download timed out after ${this.timeoutMs}ms`
          : `Download network error: ${(err as Error).message}`,
        0
      );
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Follows `links.next` until the collection is exhausted or `maxPages` is
   * hit. The result says whether it stopped early (`hasMore` + `nextUrl`), so
   * callers can't mistake a page-capped fetch for the complete collection.
   */
  async collect<T = unknown>(
    path: string,
    query?: Query,
    maxPages = 10
  ): Promise<{ items: T[]; pagesFetched: number; hasMore: boolean; nextUrl?: string }> {
    const items: T[] = [];
    let next: string | undefined;
    let pagesFetched = 0;

    for (let page = 0; page < maxPages; page++) {
      const res: any = next
        ? await this.request('GET', next)
        : await this.get(path, query);
      pagesFetched++;

      if (Array.isArray(res?.data)) items.push(...res.data);
      else if (res?.data) items.push(res.data);

      next = res?.links?.next;
      if (!next) break;
    }
    return { items, pagesFetched, hasMore: Boolean(next), nextUrl: next };
  }
}

function applyQuery(url: URL, query: Query): void {
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue;
    url.searchParams.set(
      key,
      Array.isArray(value) ? value.join(',') : String(value)
    );
  }
}

/** Exported for tests; not part of the client's public surface. */
export function backoffMs(attempt: number, retryAfter: string | null): number {
  if (retryAfter) {
    // Retry-After is either delay-seconds or an HTTP-date (RFC 9110 §10.2.3).
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds) && seconds > 0) {
      return Math.min(seconds * 1000, 60_000);
    }
    const dateMs = Date.parse(retryAfter);
    if (!Number.isNaN(dateMs)) {
      const delta = dateMs - Date.now();
      if (delta > 0) return Math.min(delta, 60_000);
    }
  }
  const base = Math.min(1000 * 2 ** attempt, 30_000);
  return base + Math.random() * 250; // jitter, so parallel callers desynchronise
}

/**
 * Actionable hints for the Apple errors people actually hit, appended to the
 * error message so the fix travels with the failure (mirrors SUPPORT.md).
 */
const STATUS_HINTS: Record<number, string> = {
  401: 'Check that ASC_KEY_ID, ASC_ISSUER_ID and the .p8 key match and are not revoked.',
  403:
    "The API key's role lacks permission for this operation: sales/finance reports need " +
    'the Finance role, user management needs Admin, and app creation is restricted on ' +
    'some accounts — create the app once in the App Store Connect web UI, then manage it here.',
  409:
    'App Store Connect rejected the change for the current resource state — a version in ' +
    'review or already released is locked, and many fields are only editable in specific ' +
    "states. Fetch the resource first to see its state; the error details above name the " +
    'field when Apple provides it.',
  429:
    "Apple's rate limit was hit even though requests are paced locally — something else " +
    'may be sharing this API key.',
};

async function toApiError(res: Response): Promise<AscApiError> {
  let errors: Array<{ code?: string; title?: string; detail?: string }> = [];
  let message = `App Store Connect API returned ${res.status}`;

  try {
    const body = (await res.json()) as any;
    if (Array.isArray(body?.errors)) {
      errors = body.errors;
      const first = body.errors[0];
      if (first?.detail || first?.title) {
        message = `${message}: ${first.title ?? ''}${first.detail ? ` — ${first.detail}` : ''}`.trim();
      }
    }
  } catch {
    // Non-JSON error body; the status line is all we have.
  }

  const hint = STATUS_HINTS[res.status];
  if (hint) message += `. ${hint}`;

  return new AscApiError(
    message,
    res.status,
    errors,
    res.headers.get('x-request-id') ?? undefined
  );
}
