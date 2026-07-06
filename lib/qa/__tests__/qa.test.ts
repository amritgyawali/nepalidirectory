/**
 * AI-generated Q&A answers. Two grounded paths, both zero-network:
 *  - provider OFF  → deterministic public-AI floor answer (never hard-fails).
 *  - provider ON   → MockAiProvider answer over the same grounded listing set.
 */
import { afterEach, describe, it, expect, vi } from "vitest";
import { answerQuestion } from "../answer";

function useMockEnv(overrides: Record<string, string> = {}) {
  vi.stubEnv("DATABASE_URL", "");
  vi.stubEnv("GEMINI_API_KEY", "");
  vi.stubEnv("GROQ_API_KEY", "");
  vi.stubEnv("OPENROUTER_API_KEY", "");
  vi.stubEnv("OLLAMA_BASE_URL", "");
  for (const [k, v] of Object.entries(overrides)) vi.stubEnv(k, v);
}

afterEach(() => vi.unstubAllEnvs());

describe("answerQuestion (free-local floor)", () => {
  it("always answers with grounded listings when no provider is configured", async () => {
    useMockEnv({ AI_ENABLED: "false", CONCIERGE_ENABLED: "false" });
    const res = await answerQuestion("best momo in Patan");
    expect(res.mode).toBe("free-local");
    expect(res.answer.length).toBeGreaterThan(0);
    expect(res.listings.length).toBeGreaterThan(0);
    // Grounding: every returned source is a real directory listing with an internal link.
    for (const l of res.listings) {
      expect(l.name.length).toBeGreaterThan(0);
      expect(l.href.startsWith("/")).toBe(true);
    }
  });
});

describe("answerQuestion (provider path)", () => {
  it("upgrades to the provider answer over the grounded set", async () => {
    useMockEnv({ AI_ENABLED: "true", CONCIERGE_ENABLED: "true" });
    const res = await answerQuestion("where can I find a dentist in Kathmandu?");
    expect(res.mode).toBe("provider");
    expect(res.answer).toContain("mock"); // MockAiProvider completion marker
    expect(res.listings.length).toBeGreaterThan(0);
  });
});
