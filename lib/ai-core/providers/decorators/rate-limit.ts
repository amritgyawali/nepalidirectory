/**
 * RateLimiter — token-bucket per provider (prompt §5.2). Requests-per-minute bucket; when empty,
 * throws ProviderUnavailableError('rate_limit') so the FallbackChain moves on. Clock is injectable
 * for deterministic tests. rpm ≤ 0 means unlimited (pass-through). Wraps a single adapter.
 */
import type { AiProvider, AiRequest, AiResult } from "../../types";
import { ProviderUnavailableError } from "../../errors";

export type Clock = () => number;

export class RateLimiter implements AiProvider {
  private readonly inner: AiProvider;
  private readonly rpm: number;
  private readonly now: Clock;
  private tokens: number;
  private last: number;

  constructor(inner: AiProvider, rpm: number, now: Clock = () => Date.now()) {
    this.inner = inner;
    this.rpm = rpm;
    this.now = now;
    this.tokens = rpm > 0 ? rpm : 0;
    this.last = now();
  }

  id(): string {
    return this.inner.id();
  }

  private take(): void {
    if (this.rpm <= 0) return; // unlimited
    const t = this.now();
    const refill = ((t - this.last) / 60_000) * this.rpm;
    if (refill > 0) {
      this.tokens = Math.min(this.rpm, this.tokens + refill);
      this.last = t;
    }
    if (this.tokens < 1) {
      throw new ProviderUnavailableError(this.inner.id(), "rate_limit", `${this.inner.id()} rate limited (${this.rpm} rpm)`);
    }
    this.tokens -= 1;
  }

  async complete(req: AiRequest): Promise<AiResult> {
    this.take();
    return this.inner.complete(req);
  }

  async completeJson(req: AiRequest, jsonSchema: string): Promise<AiResult> {
    this.take();
    return this.inner.completeJson(req, jsonSchema);
  }

  async embed(text: string): Promise<number[]> {
    return this.inner.embed(text);
  }

  async healthy(): Promise<boolean> {
    return this.inner.healthy();
  }
}
