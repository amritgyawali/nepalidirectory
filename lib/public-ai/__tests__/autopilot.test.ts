import { describe, expect, it } from "vitest";
import { localAutopilotSearch } from "../autopilot";

describe("local public AI autopilot", () => {
  it("returns grounded business recommendations without provider keys", () => {
    const reply = localAutopilotSearch("emergency plumber kathmandu");

    expect(reply.mode).toBe("free-local");
    expect(reply.listings.length).toBeGreaterThan(0);
    expect(reply.listings[0].name).toContain("Plumbing");
    expect(reply.message).toContain(reply.listings[0].name);
  });

  it("infers locations from natural language", () => {
    const reply = localAutopilotSearch("hotels in pokhara");

    expect(reply.parsed.location).toBe("Pokhara");
    expect(reply.listings[0].area).toBe("Pokhara");
  });
});
