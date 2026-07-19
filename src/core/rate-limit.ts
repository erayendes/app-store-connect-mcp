/**
 * Proactive rate limiting for the App Store Connect API.
 *
 * Apple documents 3,600 requests/hour per team key. The per-minute ceiling is
 * undocumented but sits somewhere near 300, so we pace against both windows
 * rather than waiting to be told "429" and then backing off.
 */
export interface RateLimitOptions {
  requestsPerHour?: number;
  requestsPerMinute?: number;
}

interface Window {
  start: number;
  count: number;
  limit: number;
  durationMs: number;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class RateLimiter {
  private readonly hour: Window;
  private readonly minute: Window;
  /** Serialises admission so two callers can't both slip past a full window. */
  private gate: Promise<void> = Promise.resolve();

  constructor(opts: RateLimitOptions = {}) {
    const now = Date.now();
    this.hour = {
      start: now,
      count: 0,
      limit: opts.requestsPerHour ?? 3600,
      durationMs: 3_600_000,
    };
    this.minute = {
      start: now,
      count: 0,
      limit: opts.requestsPerMinute ?? 300,
      durationMs: 60_000,
    };
  }

  /** Resolves once it is this caller's turn to issue a request. */
  async acquire(): Promise<void> {
    const turn = this.gate.then(() => this.admit());
    // Swallow rejections on the chain itself so one failure can't wedge the gate.
    this.gate = turn.catch(() => undefined);
    return turn;
  }

  /** Feeds Apple's own rate-limit header back into our accounting. */
  observeHeader(header: string | null): void {
    if (!header) return;
    // Format: "user-hour-lim:3600;user-hour-rem:2842;"
    const remaining = /user-hour-rem:(\d+)/.exec(header);
    const limit = /user-hour-lim:(\d+)/.exec(header);
    if (remaining && limit) {
      const lim = Number(limit[1]);
      const rem = Number(remaining[1]);
      if (Number.isFinite(lim) && Number.isFinite(rem)) {
        this.hour.limit = lim;
        this.hour.count = Math.max(this.hour.count, lim - rem);
      }
    }
  }

  status(): { hourRemaining: number; minuteRemaining: number } {
    this.roll(this.hour);
    this.roll(this.minute);
    return {
      hourRemaining: Math.max(0, this.hour.limit - this.hour.count),
      minuteRemaining: Math.max(0, this.minute.limit - this.minute.count),
    };
  }

  private async admit(): Promise<void> {
    for (const w of [this.minute, this.hour]) {
      this.roll(w);
      if (w.count >= w.limit) {
        const waitMs = w.start + w.durationMs - Date.now();
        if (waitMs > 0) await sleep(waitMs);
        this.roll(w);
      }
    }
    this.minute.count++;
    this.hour.count++;
  }

  private roll(w: Window): void {
    const now = Date.now();
    if (now - w.start >= w.durationMs) {
      w.start = now;
      w.count = 0;
    }
  }
}
