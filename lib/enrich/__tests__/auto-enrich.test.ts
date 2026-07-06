/**
 * Autonomous enrichment cycle (`runAutoEnrichCycle`) — the serverless nightly-sweep entrypoint the
 * `/api/cron/enrich` route drives. Runs against the MockAiProvider (no keys) so it is deterministic
 * and hits zero network. Also asserts the flag gate that keeps it off until the owner opts in.
 */
import { afterEach, describe, it, expect, vi } from "vitest";
import { runAutoEnrichCycle, getDefaultEnrichmentRuntime } from "../index";

/** Force the in-memory + mock-provider path regardless of the local shell env. */
function useMockEnv(overrides: Record<string, string> = {}) {
  vi.stubEnv("DATABASE_URL", "");
  vi.stubEnv("GEMINI_API_KEY", "");
  vi.stubEnv("GROQ_API_KEY", "");
  vi.stubEnv("OPENROUTER_API_KEY", "");
  vi.stubEnv("OLLAMA_BASE_URL", "");
  for (const [k, v] of Object.entries(overrides)) vi.stubEnv(k, v);
}

afterEach(() => vi.unstubAllEnvs());

describe("runAutoEnrichCycle (flag gate)", () => {
  it("does nothing until AI_ENABLED and ENRICH_ENABLED are both on", async () => {
    useMockEnv({ AI_ENABLED: "true", ENRICH_ENABLED: "false" });
    const result = await runAutoEnrichCycle();
    expect(result.ran).toBe(false);
    expect(result.enqueued).toBe(0);
    expect(result.reason).toMatch(/ENRICH_ENABLED/);
  });
});

describe("runAutoEnrichCycle (enabled)", () => {
  it("enqueues a capped sweep and drains enrich→embed for each listing", async () => {
    useMockEnv({ AI_ENABLED: "true", ENRICH_ENABLED: "true" });

    const result = await runAutoEnrichCycle({ cap: 3, maxJobs: 40 });
    expect(result.ran).toBe(true);
    expect(result.enqueued).toBeGreaterThan(0);
    expect(result.enqueued).toBeLessThanOrEqual(3);
    // Each enriched listing spawns exactly one embed job.
    expect(result.enriched).toBe(result.enqueued);
    expect(result.embedded).toBe(result.enqueued);
    expect(result.processed).toBe(result.enqueued * 2);
    expect(result.failed).toBe(0);

    // The shared singleton now holds the enriched content the search/concierge read from.
    const runtime = getDefaultEnrichmentRuntime();
    const first = await runtime.listings.get(1);
    expect(first?.descriptionSource).toBe("ai_v1");
    expect((first?.description ?? "").length).toBeGreaterThan(0);
    expect((await runtime.embeddings.get(1))?.embedding.length).toBe(768);
  });

  it("is idempotent — a second cycle finds nothing left to enrich", async () => {
    useMockEnv({ AI_ENABLED: "true", ENRICH_ENABLED: "true" });
    // The previous test already enriched ids 1..3 on the shared singleton; enrich the rest, then
    // a follow-up cycle should enqueue 0 because every listing now has aiEnrichedAt set.
    await runAutoEnrichCycle();
    const again = await runAutoEnrichCycle();
    expect(again.ran).toBe(true);
    expect(again.enqueued).toBe(0);
    expect(again.processed).toBe(0);
  });
});
