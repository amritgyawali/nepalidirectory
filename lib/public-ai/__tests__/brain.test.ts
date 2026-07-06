import { describe, expect, it } from "vitest";
import { interpretQuery } from "../brain";
import { localAutopilotSearch } from "../autopilot";

describe("public AI brain — intent + entity extraction", () => {
  it("classifies a greeting", () => {
    expect(interpretQuery("hello").intent).toBe("greeting");
  });

  it("detects deals intent and expands colloquial category synonyms", () => {
    const interp = interpretQuery("any discount on food near me");
    expect(interp.intent).toBe("deals");
    expect(interp.categories).toContain("Restaurants");
    expect(interp.modifiers.nearMe).toBe(true);
  });

  it("maps everyday phrasing to a real category (tooth -> Dentists)", () => {
    const interp = interpretQuery("my tooth hurts");
    expect(interp.categories).toContain("Dentists");
  });

  it("flags emergency + 24h modifiers", () => {
    const interp = interpretQuery("urgent 24 hour electrician");
    expect(interp.intent).toBe("emergency");
    expect(interp.modifiers.is24h).toBe(true);
    expect(interp.categories).toContain("Electricians");
  });
});

describe("public AI autopilot — enriched grounded output", () => {
  it("still ranks the plumber first and includes a reason + follow-ups", () => {
    const reply = localAutopilotSearch("emergency plumber kathmandu");
    expect(reply.intent).toBe("emergency");
    expect(reply.listings[0].name).toContain("Plumbing");
    expect(reply.listings[0].why.length).toBeGreaterThan(0);
    expect(reply.followups.length).toBeGreaterThan(0);
  });

  it("prioritises businesses with live offers for deals intent", () => {
    const reply = localAutopilotSearch("restaurant deals in bhaktapur");
    expect(reply.intent).toBe("deals");
    expect(reply.listings.length).toBeGreaterThan(0);
    // The deals action should route to the deals page.
    expect(reply.actions.some((action) => action.type === "deals")).toBe(true);
  });

  it("returns open/24h results first when asked what's open now", () => {
    const reply = localAutopilotSearch("plumber open now");
    expect(reply.listings[0].status === "open" || reply.listings[0].status === "24h").toBe(true);
  });
});
