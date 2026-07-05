/**
 * Typed errors for the provider chain (prompt §5.2).
 */

/** A single provider cannot serve this call right now (over budget, rate-limited, unhealthy). */
export class ProviderUnavailableError extends Error {
  readonly provider: string;
  readonly reason: "budget" | "rate_limit" | "unhealthy" | "error";
  constructor(provider: string, reason: ProviderUnavailableError["reason"], message?: string) {
    super(message ?? `provider ${provider} unavailable (${reason})`);
    this.name = "ProviderUnavailableError";
    this.provider = provider;
    this.reason = reason;
  }
}

/** Every provider in the fallback chain was unavailable. */
export class AllProvidersExhaustedError extends Error {
  readonly reasons: string[];
  constructor(reasons: string[]) {
    super(`all providers exhausted: ${reasons.join(", ")}`);
    this.name = "AllProvidersExhaustedError";
    this.reasons = reasons;
  }
}

/** JSON output failed schema/structure validation (after the one allowed retry). */
export class JsonValidationError extends Error {
  readonly issues: string[];
  readonly raw: string;
  constructor(issues: string[], raw: string) {
    super(`invalid JSON output: ${issues.join("; ")}`);
    this.name = "JsonValidationError";
    this.issues = issues;
    this.raw = raw;
  }
}

/**
 * Signals the worker to re-queue a job at a specific time WITHOUT counting the attempt toward
 * the DEAD threshold — used when all providers are over budget (re-run next day, prompt §5.2).
 */
export class RetryableAtError extends Error {
  readonly runAfter: Date;
  constructor(runAfter: Date, message: string) {
    super(message);
    this.name = "RetryableAtError";
    this.runAfter = runAfter;
  }
}
