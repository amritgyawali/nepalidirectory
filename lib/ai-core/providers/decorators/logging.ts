/**
 * LoggingProvider — records every call to `ai_usage_log` (prompt §5.2/§5.36), including cache
 * hits (cache_hit=true) and failures (status='error'). Outermost wrapper so the log reflects the
 * whole chain's behavior. Feeds the admin Spend page (§12).
 */
import type { AiProvider, AiRequest, AiResult } from "../../types";
import type { UsageLogRepository } from "../../stores/usage-repo";
import { estimateTokens } from "../http";

export class LoggingProvider implements AiProvider {
  private readonly inner: AiProvider;
  private readonly usage: UsageLogRepository;

  constructor(inner: AiProvider, usage: UsageLogRepository) {
    this.inner = inner;
    this.usage = usage;
  }

  id(): string {
    return this.inner.id();
  }

  private async logged(taskKey: string, op: () => Promise<AiResult>): Promise<AiResult> {
    try {
      const r = await op();
      await this.usage.record({
        provider: r.provider,
        model: r.model,
        taskKey,
        inputTokens: r.inputTokens,
        outputTokens: r.outputTokens,
        latencyMs: r.latencyMs,
        cacheHit: r.cached,
        status: "ok",
      });
      return r;
    } catch (err) {
      await this.usage.record({
        provider: this.inner.id(),
        model: "",
        taskKey,
        inputTokens: 0,
        outputTokens: 0,
        latencyMs: 0,
        cacheHit: false,
        status: "error",
      });
      throw err;
    }
  }

  async complete(req: AiRequest): Promise<AiResult> {
    return this.logged(req.taskKey, () => this.inner.complete(req));
  }

  async completeJson(req: AiRequest, jsonSchema: string): Promise<AiResult> {
    return this.logged(req.taskKey, () => this.inner.completeJson(req, jsonSchema));
  }

  async embed(text: string): Promise<number[]> {
    const start = performance.now();
    const vec = await this.inner.embed(text);
    await this.usage.record({
      provider: this.inner.id(),
      model: "",
      taskKey: "EMBED",
      inputTokens: estimateTokens(text),
      outputTokens: 0,
      latencyMs: Math.max(0, Math.round(performance.now() - start)),
      cacheHit: false,
      status: "ok",
    });
    return vec;
  }

  async healthy(): Promise<boolean> {
    return this.inner.healthy();
  }
}
