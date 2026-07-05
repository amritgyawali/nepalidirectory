/**
 * Phase 0 acceptance: ai_jobs queue + worker + the NOOP job, end-to-end, with zero external
 * calls (prompt §17 / §20.9). Also covers retry→DEAD semantics and MockAiProvider determinism.
 */
import { describe, it, expect } from "vitest";
import {
  createAiCore,
  createProviderRegistry,
  InMemoryJobRepository,
  MockAiProvider,
  Worker,
  noopHandler,
  type JobHandler,
} from "../index";

describe("ai-core queue + worker (NOOP end-to-end)", () => {
  it("runs a NOOP job to DONE with the expected result", async () => {
    const { repo, worker } = createAiCore();

    const enqueued = await repo.enqueue({ type: "NOOP", payload: { hello: "world" } });
    expect(enqueued.status).toBe("PENDING");

    const processed = await worker.runOnce();
    expect(processed?.id).toBe(enqueued.id);
    expect(processed?.status).toBe("DONE");
    expect(processed?.attempts).toBe(1);
    expect(processed?.result).toMatchObject({ ok: true, echo: { hello: "world" }, provider: "mock" });

    // Queue is now empty.
    expect(await worker.runOnce()).toBeNull();
  });

  it("claims higher-priority jobs first", async () => {
    const { repo, worker } = createAiCore();
    const low = await repo.enqueue({ type: "NOOP", priority: 1 });
    const high = await repo.enqueue({ type: "NOOP", priority: 9 });

    const first = await worker.runOnce();
    expect(first?.id).toBe(high.id);
    const second = await worker.runOnce();
    expect(second?.id).toBe(low.id);
  });

  it("retries then finalizes as DEAD after maxAttempts", async () => {
    const repo = new InMemoryJobRepository();
    const worker = new Worker(repo, createProviderRegistry(), {
      maxAttempts: 4,
      backoff: () => new Date(0), // immediately runnable again → deterministic retries
      logger: () => {},
    });
    const alwaysThrows: JobHandler = async () => {
      throw new Error("boom");
    };
    worker.register("NOOP", alwaysThrows);

    const job = await repo.enqueue({ type: "NOOP" });
    let last = null;
    for (let i = 0; i < 4; i++) last = await worker.runOnce();

    expect(last?.id).toBe(job.id);
    expect(last?.status).toBe("DEAD");
    expect(last?.attempts).toBe(4);
    expect(last?.error).toContain("boom");
    // Nothing left to claim once DEAD.
    expect(await worker.runOnce()).toBeNull();
  });

  it("recovers when a handler succeeds on a later attempt", async () => {
    const repo = new InMemoryJobRepository();
    const worker = new Worker(repo, createProviderRegistry(), {
      backoff: () => new Date(0),
      logger: () => {},
    });
    let calls = 0;
    const flaky: JobHandler = async () => {
      calls += 1;
      if (calls < 2) throw new Error("transient");
      return { recovered: true };
    };
    worker.register("NOOP", flaky);

    await repo.enqueue({ type: "NOOP" });
    await worker.runOnce(); // fails → PENDING
    const done = await worker.runOnce(); // succeeds

    expect(done?.status).toBe("DONE");
    expect(done?.attempts).toBe(2);
    expect(done?.result).toMatchObject({ recovered: true });
  });

  it("marks a job DEAD when no handler is registered for its type", async () => {
    const repo = new InMemoryJobRepository();
    const worker = new Worker(repo, createProviderRegistry(), { logger: () => {} });
    // Deliberately register nothing.
    const job = await repo.enqueue({ type: "EMBED_LISTING" });
    const processed = await worker.runOnce();
    expect(processed?.id).toBe(job.id);
    expect(processed?.status).toBe("DEAD");
    expect(processed?.error).toContain("no handler");
  });
});

describe("MockAiProvider determinism", () => {
  const mock = new MockAiProvider();

  it("returns canned JSON per taskKey", async () => {
    const res = await mock.completeJson(
      { taskKey: "NOOP", system: "s", user: "u", temperature: 0.2, maxTokens: 100 },
      "{}",
    );
    expect(JSON.parse(res.text)).toEqual({ ok: true });
    expect(res.provider).toBe("mock");
  });

  it("produces a stable, unit-length embedding of the configured dimension", async () => {
    const a = await mock.embed("newa lahana patan");
    const b = await mock.embed("newa lahana patan");
    expect(a).toEqual(b); // deterministic
    expect(a.length).toBe(768); // default EMBEDDING_DIM
    const norm = Math.sqrt(a.reduce((s, x) => s + x * x, 0));
    expect(norm).toBeCloseTo(1, 5); // unit length → cosine-ready

    const c = await mock.embed("different text");
    expect(c).not.toEqual(a);
  });

  it("noopHandler echoes payload and reports the primary provider", async () => {
    const providers = createProviderRegistry();
    const result = await noopHandler({
      job: {
        id: 1,
        type: "NOOP",
        payload: { x: 1 },
        status: "RUNNING",
        priority: 5,
        attempts: 1,
        runAfter: new Date(),
        lockedBy: "t",
        result: null,
        error: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      providers,
      log: () => {},
      enqueue: async () => {
        throw new Error("unused in this test");
      },
    });
    expect(result).toMatchObject({ ok: true, echo: { x: 1 }, provider: "mock" });
  });
});
