/**
 * MockAiProvider (prompt §5.3 / §0.6): deterministic canned output per taskKey.
 *
 * ALL unit/integration tests and CI run against this — zero external API calls (prompt §20.9).
 * Same input → same output, so tests can assert exact values.
 */
import type { AiProvider, AiRequest, AiResult } from "../types";
import { loadAiConfig } from "../config";

/** Canned JSON blobs keyed by task. Extend as new tasks come online in later phases. */
const CANNED_JSON: Record<string, unknown> = {
  NOOP: { ok: true },
  LISTING_ENRICH_V1: {
    description_en:
      "A mock listing description generated deterministically for tests. It mentions the locality and stays within the length bounds without inventing any facts.",
    meta_title: "Mock Listing — NepaliDirectory",
    meta_description: "Deterministic mock meta description used only in tests.",
    faqs: [{ q: "Is this real?", a: "No — this is deterministic mock output for tests." }],
    tags: ["mock", "test"],
    category_slug: "uncategorized",
    category_confidence: 0.5,
    attributes: {},
  },
  MERGE_ADJUDICATE_V1: {
    verdict: "same",
    confidence: 0.82,
    reason: "Deterministic mock verdict: matching name and phone signals.",
  },
  ATTRIBUTE_EXTRACT_V1: {
    services: ["mock-service"],
    attributes: { delivery: true },
  },
};

/** FNV-1a 32-bit hash → stable seed for deterministic pseudo-embeddings. */
function fnv1a(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Mulberry32 PRNG — deterministic from a seed. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class MockAiProvider implements AiProvider {
  id(): string {
    return "mock";
  }

  private result(text: string, req: AiRequest): AiResult {
    return {
      text,
      inputTokens: req.system.length + req.user.length,
      outputTokens: text.length,
      provider: "mock",
      model: "mock-1",
      latencyMs: 0,
      cached: false,
    };
  }

  async complete(req: AiRequest): Promise<AiResult> {
    return this.result(`[mock:${req.taskKey}] deterministic completion`, req);
  }

  // The schema arg is part of the AiProvider contract but the mock returns canned JSON, so it
  // implements the narrower signature (TypeScript allows omitting trailing parameters).
  async completeJson(req: AiRequest): Promise<AiResult> {
    const canned = CANNED_JSON[req.taskKey] ?? {};
    return this.result(JSON.stringify(canned), req);
  }

  async embed(text: string): Promise<number[]> {
    const dim = loadAiConfig().embeddingDim;
    const rand = mulberry32(fnv1a(text));
    const vec = new Array<number>(dim);
    let norm = 0;
    for (let i = 0; i < dim; i++) {
      const x = rand() * 2 - 1; // [-1, 1)
      vec[i] = x;
      norm += x * x;
    }
    norm = Math.sqrt(norm) || 1;
    for (let i = 0; i < dim; i++) vec[i] = vec[i] / norm; // unit length (cosine-ready)
    return vec;
  }

  async healthy(): Promise<boolean> {
    return true;
  }
}
