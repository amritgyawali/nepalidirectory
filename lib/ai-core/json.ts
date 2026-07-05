/**
 * JSON-mode helpers (prompt §5.2): strip code fences and parse strict JSON from model output.
 */

/** Remove ```json … ``` / ``` … ``` fences and surrounding prose, returning the JSON body. */
import type { AiRequest, ProviderRegistry } from "./types";

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

export async function completeParsedJson(
  providers: ProviderRegistry,
  request: AiRequest,
  jsonSchema: string,
): Promise<unknown> {
  const errors: string[] = [];
  const tried = new Set<string>();

  try {
    const first = await providers.chain().completeJson(request, jsonSchema);
    tried.add(first.provider);
    try {
      return parseJsonResponse(first.text);
    } catch (error) {
      errors.push(`${first.provider}:${error instanceof Error ? error.message : "invalid JSON"}`);
    }
  } catch (error) {
    errors.push(`chain:${error instanceof Error ? error.message : "provider error"}`);
  }

  for (const provider of providers.adapters()) {
    if (tried.has(provider.id())) continue;
    try {
      const result = await provider.completeJson(request, jsonSchema);
      tried.add(result.provider);
      return parseJsonResponse(result.text);
    } catch (error) {
      errors.push(`${provider.id()}:${error instanceof Error ? error.message : "provider or JSON error"}`);
    }
  }

  throw new SyntaxError(`All providers returned invalid JSON: ${errors.join("; ")}`);
}
