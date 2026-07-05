/**
 * JSON-mode helpers (prompt §5.2): strip code fences and parse strict JSON from model output.
 */

/** Remove ```json … ``` / ``` … ``` fences and surrounding prose, returning the JSON body. */
export function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)\s*```$/i.exec(trimmed);
  if (fence) return fence[1].trim();
  // Fall back to the first {...} or [...] span if the model added prose around it.
  const firstBrace = trimmed.search(/[{[]/);
  if (firstBrace > 0) {
    const lastBrace = Math.max(trimmed.lastIndexOf("}"), trimmed.lastIndexOf("]"));
    if (lastBrace > firstBrace) return trimmed.slice(firstBrace, lastBrace + 1).trim();
  }
  return trimmed;
}

/** Parse a model JSON response; throws SyntaxError on failure. */
export function parseJsonResponse(text: string): unknown {
  return JSON.parse(stripCodeFences(text));
}
