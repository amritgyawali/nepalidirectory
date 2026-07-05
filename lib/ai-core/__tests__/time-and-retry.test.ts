/**
 * NPT reschedule time (prompt §5.2) and the worker's RetryableAtError path — the mechanism that
 * re-queues budget-exhausted jobs to next-day 00:15 NPT without burning attempts.
 */
import { describe, it, expect } from "vitest";
import {
  Worker,
  InMemoryJobRepository,
  createProviderRegistry,
  RetryableAtError,
  nextMidnight0015NPT,
  type JobHandler,
} from "../index";

describe("nextMidnight0015NPT", () => {
  it("returns the next 00:15 NPT strictly after now", () => {
    const now = new Date("2026-07-05T10:00:00Z"); // 15:45 NPT
    const next = nextMidnight0015NPT(now);
    expect(next.getTime()).toBeGreaterThan(now.getTime());
    // Convert to NPT wall clock (UTC+05:45) and check it is 00:15.
    const npt = new Date(next.getTime() + (5 * 60 + 45) * 60_000);
    expect(npt.getUTCHours()).toBe(0);
    expect(npt.getUTCMinutes()).toBe(15);
  });
});

describe("Worker RetryableAtError", () => {
  it("re-queues at the given time without counting toward DEAD", async () => {
    const repo = new InMemoryJobRepository();
    const worker = new Worker(repo, createProviderRegistry(), { maxAttempts: 4, logger: () => {} });
    const future = new Date(Date.now() + 60 * 60_000);
    const handler: JobHandler = async () => {
      throw new RetryableAtError(future, "over budget");
    };
    worker.register("NOOP", handler);

    const job = await repo.enqueue({ type: "NOOP" });
    const processed = await worker.runOnce();
    expect(processed?.id).toBe(job.id);
    expect(processed?.status).toBe("PENDING"); // re-queued, not DEAD
    expect(processed?.attempts).toBe(1);
    expect(processed?.error).toContain("over budget");
    expect(processed?.runAfter.getTime()).toBe(future.getTime());

    // Not runnable yet (run_after in the future).
    expect(await worker.runOnce()).toBeNull();
  });
});
