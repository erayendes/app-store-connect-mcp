/** Structured error carrying whatever detail Apple returned. */
export class AscApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly errors: Array<{ code?: string; title?: string; detail?: string }> = [],
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
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}
