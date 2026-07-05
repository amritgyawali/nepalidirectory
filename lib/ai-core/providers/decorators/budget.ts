/**
 * BudgetGuard — per-provider daily token cap (prompt §5.2). When today's tally reaches the cap
 * it throws ProviderUnavailableError('budget') so the FallbackChain moves on; if every provider
 * is over budget the job is re-queued to next-day 00:15 NPT (handled by the caller). Wraps a
 * single adapter. cap ≤ 0 means unlimited. Only completions are metered (embeddings are free
 * via Ollama and pass through).
 */
import type { AiProvider, AiRequest, AiResult } from "../../types";
import type { BudgetTracker } from "../../stores/budget-tracker";
import { ProviderUnavailableError } from "../../errors";

export class BudgetGuard implements AiProvider {
  private readonly inner: AiProvider;
  private readonly tracker: BudgetTracker;
  private readonly cap: number;

  constructor(inner: AiProvider, tracker: BudgetTracker, cap: number) {
    this.inner = inner;
    this.tracker = tracker;
    this.cap = cap;
  }

  id(): string {
    return this.inner.id();
  }

  private assertBudget(): void {
    if (this.cap > 0 && this.tracker.consumed(this.inner.id()) >= this.cap) {
      throw new ProviderUnavailableError(this.inner.id(), "budget", `${this.inner.id()} daily token cap reached`);
    }
  }

  private meter(result: AiResult): void {
    if (!result.cached) this.tracker.add(this.inner.id(), result.inputTokens + result.outputTokens);
  }

  async complete(req: AiRequest): Promise<AiResult> {
    this.assertBudget();
    const r = await this.inner.complete(req);
    this.meter(r);
    return r;
  }

  async completeJson(req: AiRequest, jsonSchema: string): Promise<AiResult> {
    this.assertBudget();
    const r = await this.inner.completeJson(req, jsonSchema);
    this.meter(r);
    return r;
  }

  async embed(text: string): Promise<number[]> {
    return this.inner.embed(text);
  }

  async healthy(): Promise<boolean> {
    return this.inner.healthy();
  }
}
