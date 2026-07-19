/**
 * HTTP client for the App Store Connect API.
 *
 * Two things this client is strict about:
 *  - every request goes to the pinned Apple host, including paginated follow-ups
 *  - transient failures (429, 5xx) are retried with exponential backoff + jitter
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
  readonly limiter: RateLimiter;

  constructor(
    private readonly tokens: TokenProvider,
    opts: HttpOptions = {}
  ) {
    this.maxRetries = opts.maxRetries ?? 3;
    this.timeoutMs = opts.timeoutMs ?? 60_000;
    this.baseUrl = (opts.baseUrl ?? ASC_BASE_URL).replace(/\/$/, '');
    this.allowedHost = new URL(this.baseUrl).host;
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
    if (url.protocol !== 'https:' || url.host !== this.allowedHost) {
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
    const url = path.startsWith('https://')
      ? this.resolvePaginationUrl(path)
      : new URL(this.baseUrl + (path.startsWith('/') ? path : `/${path}`));

    if (opts.query) applyQuery(url, opts.query);

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

        if (RETRYABLE.has(res.status) && attempt < this.maxRetries) {
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

  /** Follows `links.next` until the collection is exhausted or `maxPages` is hit. */
  async collect<T = unknown>(
    path: string,
    query?: Query,
    maxPages = 10
  ): Promise<T[]> {
    const items: T[] = [];
    let next: string | undefined;

    for (let page = 0; page < maxPages; page++) {
      const res: any = next
        ? await this.request('GET', next)
        : await this.get(path, query);

      if (Array.isArray(res?.data)) items.push(...res.data);
      else if (res?.data) items.push(res.data);

      next = res?.links?.next;
      if (!next) break;
    }
    return items;
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

function backoffMs(attempt: number, retryAfter: string | null): number {
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds) && seconds > 0) {
      return Math.min(seconds * 1000, 60_000);
    }
  }
  const base = Math.min(1000 * 2 ** attempt, 30_000);
  return base + Math.random() * 250; // jitter, so parallel callers desynchronise
}

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

  if (res.status === 401) {
    message += '. Check that ASC_KEY_ID, ASC_ISSUER_ID and the .p8 key match and are not revoked.';
  }

  return new AscApiError(
    message,
    res.status,
    errors,
    res.headers.get('x-request-id') ?? undefined
  );
}
