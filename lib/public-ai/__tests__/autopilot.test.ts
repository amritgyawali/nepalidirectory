import { describe, expect, it } from "vitest";
import { businesses } from "@/lib/data";
import { localAutopilotSearch } from "../autopilot";

const publishedCatalog = businesses.map((business) => ({
  ...business,
  website: `https://${business.slug}.example.org`,
  email: `contact@${business.slug}.example.org`,
}));

describe("local public AI autopilot", () => {
  it("returns grounded business recommendations without provider keys", () => {
    const reply = localAutopilotSearch(
      "emergency plumber kathmandu",
      undefined,
      5,
      publishedCatalog,
    );

    expect(reply.mode).toBe("free-local");
    expect(reply.listings.length).toBeGreaterThan(0);
    expect(reply.listings[0].name).toContain("Plumbing");
    expect(reply.message).toContain(reply.listings[0].name);
  });

  it("infers locations from natural language", () => {
    const reply = localAutopilotSearch("hotels in pokhara", undefined, 5, publishedCatalog);

    expect(reply.parsed.location).toBe("Pokhara");
    expect(reply.listings[0].area).toBe("Pokhara");
  });

  it("never exposes bundled demo profiles in the public fallback", () => {
    const reply = localAutopilotSearch("restaurants in Kathmandu");

    expect(reply.listings).toHaveLength(0);
    expect(reply.demandSignalRecorded).toBe(true);
    expect(reply.message).toContain("couldn't find a grounded match");
  });
});
