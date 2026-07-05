/**
 * Per-session rate limiter for the concierge (prompt §9.3: "Rate-limit per session"). Sliding
 * window, in-memory (per-process — fine for a single Next.js server; a multi-instance deployment
 * would back this with Postgres/Redis, same interface).
 */
export class SessionRateLimiter {
  private readonly hits = new Map<string, number[]>();

  constructor(
    private readonly maxPerWindow = 20,
    private readonly windowMs = 10 * 60_000,
    private readonly now: () => number = Date.now,
  ) {}

  /** Returns true if `sessionId` may send another message right now, recording the attempt. */
  allow(sessionId: string): boolean {
    const cutoff = this.now() - this.windowMs;
    const recent = (this.hits.get(sessionId) ?? []).filter((t) => t > cutoff);
    if (recent.length >= this.maxPerWindow) {
      this.hits.set(sessionId, recent);
      return false;
    }
    recent.push(this.now());
    this.hits.set(sessionId, recent);
    return true;
  }
}
