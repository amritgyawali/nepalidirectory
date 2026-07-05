/**
 * Shared adapter plumbing. Adapters take an injectable `fetchFn` so tests exercise the exact
 * request/response mapping with a stub — zero network in CI (prompt §20.9).
 */
export type FetchFn = typeof fetch;

/** Rough token estimate when an API omits usage (≈4 chars/token). */
export function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

/** Milliseconds since a start mark. */
export function since(start: number): number {
  return Math.max(0, Math.round(performance.now() - start));
}
