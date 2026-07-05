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
  TREND_SELECTOR_V1: {
    selected: true,
    safety: "ok",
    angle: "Deterministic mock angle for tests",
    article_type: "guide",
    target_category_slugs: ["restaurants"],
    confidence: 0.8,
    reason: "Deterministic mock selection: maps to a real directory category.",
  },
  BLOG_FACTCHECK_V1: {
    verdict: "pass",
    unsupported_claims: [],
  },
  NL_QUERY_PARSER_V1: {
    intent: "find_business",
    category_hint: "uncategorized",
    location: {},
    filters: { open_now: null, price_level: null },
    keywords: [],
    language: "en",
  },
  REVIEW_SUMMARIZER_V1: {
    summary:
      "Reviewers consistently mention the local food experience, group-friendly service, and helpful staff. The main cautions are crowding at busy times and nearby parking.",
    pros: ["Local food experience", "Helpful staff", "Group seating", "Clear booking support"],
    cons: ["Can get crowded", "Parking can be difficult"],
    sentiment: 0.72,
    themes: ["service", "food quality", "reservations", "parking"],
  },
  REVIEW_REPLY_DRAFTER_V1: {
    professional:
      "Thank you for sharing these details. We appreciate the feedback about the visit and will keep working to make the experience smooth for future guests.",
    warm:
      "Thank you for visiting and for the thoughtful note. We are glad the experience stood out, and we hope to welcome you again soon.",
    brief: "Thank you for the review. We appreciate the feedback and hope to serve you again.",
  },
  CATEGORY_INTRO_V1: {
    intro_md:
      "This deterministic mock intro uses only the supplied listing count, localities and average rating. It is intended for tests and avoids invented business facts.",
    meta_title: "Mock Category City Page",
    meta_description: "Deterministic mock meta description for category-city intro tests.",
  },
  TRANSLATE_NE_V1: {
    description_ne: "यो परीक्षणका लागि प्रयोग हुने निर्धारक नेपाली अनुवाद हो।",
    faqs_ne: [{ q: "यो वास्तविक हो?", a: "होइन, यो परीक्षणका लागि mock output हो।" }],
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

/**
 * BLOG_WRITER_V1 must vary per request (each cluster/angle needs a distinct article — the
 * uniqueness-check pass embeds `body_markdown`, so two identical mock drafts would always
 * collide). Same input -> same output still holds (deterministic hash of `userText`), but
 * different topics now produce genuinely different text.
 */
function buildMockBlogDraft(userText: string): unknown {
  const n = fnv1a(userText) % 100000;
  const urls = [...userText.matchAll(/https?:\/\/\S+/g)].map((m) => m[0]).slice(0, 5);
  return {
    title: `Mock Guide ${n}: Deterministic Test Article`,
    slug: `mock-guide-${n}`,
    excerpt: `Deterministic mock excerpt ${n} generated only for tests, grounded in the supplied sources.`,
    body_markdown:
      `## Getting started (mock ${n})\n\n` +
      `This is deterministic mock body text for test seed ${n}. It never invents facts and only ` +
      `restates what the SOURCES block provided. Local readers can compare {{category:restaurants}} ` +
      `options before deciding.\n\n` +
      `## Practical next steps (mock ${n})\n\n` +
      `Consider {{category:hotels}} and {{category:electricians}} providers when relevant. This ` +
      `paragraph pads the mock article out with unique filler for seed ${n} so its embedding differs ` +
      `from other mock articles.\n\n` +
      `## Frequently asked questions\n\n` +
      `**Is this real content?** No, it is deterministic mock output for automated tests.\n` +
      `**Does it cite sources?** Yes, sources_used lists the URLs seen in the prompt.\n` +
      `**Can it be published?** No, BLOG_AUTOPUBLISH stays off; a human must review it.`,
    faq: [
      { q: "Is this real content?", a: "No, it is deterministic mock output for automated tests." },
      { q: "Does it cite sources?", a: "Yes, sources_used lists the URLs seen in the prompt." },
      { q: "Can it be published?", a: "No, BLOG_AUTOPUBLISH stays off; a human must review it." },
    ],
    sources_used: urls,
    categories: ["restaurants", "hotels", "electricians"],
    confidence: 0.85,
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
    if (req.taskKey === "BLOG_WRITER_V1") {
      return this.result(JSON.stringify(buildMockBlogDraft(req.user)), req);
    }
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
