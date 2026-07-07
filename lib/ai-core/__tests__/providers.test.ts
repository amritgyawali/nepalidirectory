/**
 * Provider adapters (with a stub fetch — zero network) and the decorator chain
 * (cache / budget / rate-limit / fallback / logging). Prompt §5.2, §5.3, §20.9.
 */
import { describe, it, expect } from "vitest";
import type { AiProvider, AiRequest, AiResult, FetchFn } from "../index";
import {
  GeminiAdapter,
  OpenAiCompatibleAdapter,
  OllamaAdapter,
  CachingProvider,
  BudgetGuard,
  RateLimiter,
  FallbackChain,
  LoggingProvider,
  InMemoryCacheRepository,
  InMemoryUsageLogRepository,
  InMemoryBudgetTracker,
  ProviderUnavailableError,
  AllProvidersExhaustedError,
} from "../index";

function stubFetch(body: unknown, status = 200): FetchFn {
  const f = async () =>
    new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
  return f as unknown as FetchFn;
}

const req: AiRequest = { taskKey: "T", system: "sys", user: "usr", temperature: 0.2, maxTokens: 128 };

/** Configurable fake adapter for decorator tests (no network). */
class FakeProvider implements AiProvider {
  calls = 0;
  private readonly idv: string;
  private readonly text: string;
  private readonly tokens: number;
  private readonly fail?: () => never;
  constructor(idv: string, text = "ok", tokens = 10, fail?: () => never) {
    this.idv = idv;
    this.text = text;
    this.tokens = tokens;
    this.fail = fail;
  }
  id(): string {
    return this.idv;
  }
  private mk(): AiResult {
    if (this.fail) this.fail();
    this.calls += 1;
    return { text: this.text, inputTokens: this.tokens, outputTokens: 0, provider: this.idv, model: "m", latencyMs: 0, cached: false };
  }
  async complete(): Promise<AiResult> {
    return this.mk();
  }
  async completeJson(): Promise<AiResult> {
    return this.mk();
  }
  async embed(): Promise<number[]> {
    return [0.1, 0.2, 0.3];
  }
  async healthy(): Promise<boolean> {
    return true;
  }
}

describe("adapters (stub fetch)", () => {
  it("GeminiAdapter maps generateContent + usage", async () => {
    const gemini = new GeminiAdapter({
      apiKey: "k",
      model: "gemini-x",
      embedModel: "embed-x",
      fetchFn: stubFetch({
        candidates: [{ content: { parts: [{ text: '{"ok":true}' }] } }],
        usageMetadata: { promptTokenCount: 11, candidatesTokenCount: 3 },
      }),
    });
    const r = await gemini.completeJson(req, "{}");
    expect(r.text).toBe('{"ok":true}');
    expect(r.provider).toBe("gemini");
    expect(r.inputTokens).toBe(11);
    expect(r.outputTokens).toBe(3);
  });

  it("GeminiAdapter embed returns the vector", async () => {
    const gemini = new GeminiAdapter({
      apiKey: "k",
      model: "m",
      embedModel: "e",
      fetchFn: stubFetch({ embedding: { values: [1, 2, 3, 4] } }),
    });
    expect(await gemini.embed("hi")).toEqual([1, 2, 3, 4]);
  });

  it("OpenAiCompatibleAdapter maps chat/completions + usage", async () => {
    const groq = new OpenAiCompatibleAdapter({
      id: "groq",
      apiKey: "k",
      model: "llama-x",
      baseUrl: "https://api.groq.com/openai/v1",
      fetchFn: stubFetch({
        choices: [{ message: { content: "hello" } }],
        usage: { prompt_tokens: 5, completion_tokens: 2 },
      }),
    });
    const r = await groq.complete(req);
    expect(r.text).toBe("hello");
    expect(r.provider).toBe("groq");
    expect(r.inputTokens).toBe(5);
  });

  it("OllamaAdapter embeds via /api/embeddings", async () => {
    const ollama = new OllamaAdapter({
      baseUrl: "http://localhost:11434",
      embedModel: "bge-m3",
      fetchFn: stubFetch({ embedding: [0.5, 0.6] }),
    });
    expect(await ollama.embed("x")).toEqual([0.5, 0.6]);
  });

  it("maps HTTP 429 to a rate_limit ProviderUnavailableError", async () => {
    const groq = new OpenAiCompatibleAdapter({
      id: "groq",
      apiKey: "k",
      model: "m",
      baseUrl: "https://api.groq.com/openai/v1",
      fetchFn: stubFetch({}, 429),
    });
    await expect(groq.complete(req)).rejects.toMatchObject({
      name: "ProviderUnavailableError",
      reason: "rate_limit",
    });
  });
});

describe("CachingProvider", () => {
  it("serves identical calls from cache and re-computes on a different key", async () => {
    const fake = new FakeProvider("f", "cached-text");
    const caching = new CachingProvider(fake, new InMemoryCacheRepository(), 30);

    const first = await caching.completeJson(req, "{}");
    expect(first.cached).toBe(false);
    const second = await caching.completeJson(req, "{}");
    expect(second.cached).toBe(true);
    expect(second.text).toBe("cached-text");
    expect(fake.calls).toBe(1); // inner hit once

    await caching.completeJson({ ...req, user: "different" }, "{}");
    expect(fake.calls).toBe(2);
  });
});

describe("BudgetGuard", () => {
  it("blocks once the daily cap is reached", async () => {
    const fake = new FakeProvider("f", "x", 100);
    const guard = new BudgetGuard(fake, new InMemoryBudgetTracker(), 150);
    await guard.complete(req); // 0 → 100
    await guard.complete(req); // 100 → 200
    await expect(guard.complete(req)).rejects.toMatchObject({ name: "ProviderUnavailableError", reason: "budget" });
  });
});

describe("RateLimiter", () => {
  it("token-buckets requests per minute (deterministic clock)", async () => {
    let now = 0;
    const limiter = new RateLimiter(new FakeProvider("f"), 1, () => now);
    await limiter.complete(req); // consume the single token
    await expect(limiter.complete(req)).rejects.toMatchObject({ reason: "rate_limit" });
    now = 60_000; // refill one token
    await expect(limiter.complete(req)).resolves.toBeDefined();
  });
});

describe("FallbackChain", () => {
  it("falls through to the next provider on unavailability", async () => {
    const down = new FakeProvider("p1", "", 0, () => {
      throw new ProviderUnavailableError("p1", "error");
    });
    const up = new FakeProvider("p2", "from-p2");
    const chain = new FallbackChain([down, up]);
    const r = await chain.complete(req);
    expect(r.text).toBe("from-p2");
  });

  it("throws AllProvidersExhaustedError tagged with budget reasons", async () => {
    const b1 = new FakeProvider("p1", "", 0, () => {
      throw new ProviderUnavailableError("p1", "budget");
    });
    const b2 = new FakeProvider("p2", "", 0, () => {
      throw new ProviderUnavailableError("p2", "budget");
    });
    const chain = new FallbackChain([b1, b2]);
    await expect(chain.complete(req)).rejects.toSatisfy(
      (e: unknown) => e instanceof AllProvidersExhaustedError && e.reasons.every((r) => r.includes(":budget")),
    );
  });
});

describe("LoggingProvider", () => {
  it("records ok and error entries in the usage log", async () => {
    const usage = new InMemoryUsageLogRepository();
    await new LoggingProvider(new FakeProvider("f"), usage).completeJson(req, "{}");

    const boom = new FakeProvider("f", "", 0, () => {
      throw new Error("boom");
    });
    await expect(new LoggingProvider(boom, usage).complete(req)).rejects.toThrow("boom");

    const entries = await usage.all();
    expect(entries).toHaveLength(2);
    expect(entries[0].status).toBe("ok");
    expect(entries[1].status).toBe("error");
  });
});
