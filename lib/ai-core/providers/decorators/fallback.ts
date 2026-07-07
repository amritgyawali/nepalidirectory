/**
 * FallbackChain (prompt §5.2/§5.3): try providers in order (primary, then fallbacks); on any
 * ProviderUnavailableError (budget/rate-limit/HTTP error) move to the next. If all fail, throw
 * AllProvidersExhaustedError with the collected reasons so the caller can distinguish "everyone
 * over budget" (→ re-queue next day) from other failures.
 *
 * Per-call 429/5xx backoff (1s/4s/15s, §5.2) is applied at the JOB level by the Worker rather
 * than inside each provider call — same schedule, no timer flakiness in tests (see DECISIONS).
 */
import type { AiProvider, AiRequest, AiResult } from "../../types";
import { AllProvidersExhaustedError, ProviderUnavailableError } from "../../errors";

export class FallbackChain implements AiProvider {
  private readonly providers: AiProvider[];

  constructor(providers: AiProvider[]) {
    if (providers.length === 0) throw new Error("FallbackChain requires ≥1 provider");
    this.providers = providers;
  }

  id(): string {
    return this.providers[0].id();
  }

  private async run<T>(op: (p: AiProvider) => Promise<T>): Promise<T> {
    const reasons: string[] = [];
    for (const p of this.providers) {
      try {
        return await op(p);
      } catch (err) {
        const reason =
          err instanceof ProviderUnavailableError
            ? `${err.provider}:${err.reason}:${err.message}`
            : `${p.id()}:${err instanceof Error ? err.message : "error"}`;
        reasons.push(reason);
      }
    }
    throw new AllProvidersExhaustedError(reasons);
  }

  async complete(req: AiRequest): Promise<AiResult> {
    return this.run((p) => p.complete(req));
  }

  async completeJson(req: AiRequest, jsonSchema: string): Promise<AiResult> {
    return this.run((p) => p.completeJson(req, jsonSchema));
  }

  async embed(text: string): Promise<number[]> {
    return this.run((p) => p.embed(text));
  }

  async healthy(): Promise<boolean> {
    for (const p of this.providers) {
      if (await p.healthy()) return true;
    }
    return false;
  }
}
