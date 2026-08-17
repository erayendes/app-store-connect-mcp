/**
 * One entry from Apple's `errors[]`. `source` is the half that says *where*:
 * a `pointer` into the request body ("/data/attributes/versionString") or the
 * `parameter` that was wrong. It was being dropped from the type — and so from
 * everything downstream — while sitting right there in the payload.
 */
export interface AscApiErrorDetail {
  code?: string;
  title?: string;
  detail?: string;
  source?: { pointer?: string; parameter?: string };
}

/** Statuses the HTTP layer will retry; anything else is the caller's to fix. */
const RETRYABLE_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

/** Structured error carrying whatever detail Apple returned. */
export class AscApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly errors: AscApiErrorDetail[] = [],
    readonly requestId?: string
  ) {
    super(message);
    this.name = 'AscApiError';
  }

  /** A short, human-readable explanation suitable for showing to the caller. */
  get summary(): string {
    if (this.errors.length === 0) return this.message;
    return this.errors
      .map((e) => [e.title, e.detail].filter(Boolean).join(': '))
      .join(' | ');
  }

  /**
   * Whether trying again could work. Status 0 is a network or client-side
   * failure that never reached Apple, which is the most retryable case of all.
   */
  get retryable(): boolean {
    return this.status === 0 || RETRYABLE_STATUSES.has(this.status);
  }
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}
