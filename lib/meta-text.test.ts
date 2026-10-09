import { describe, expect, it } from "vitest";
import { fullSeoTitle, metaDescription, seoTitle } from "./meta-text";

describe("seoTitle", () => {
  it("keeps the brand suffix on short titles", () => {
    expect(seoTitle("Terms of Use")).toBe("Terms of Use");
    expect(fullSeoTitle("Terms of Use")).toBe("Terms of Use | Nepali Directory");
  });

  it("drops the brand suffix when it would push the title past 60 characters", () => {
    const long = "Kathmandu Restaurant Guide: Best Areas for Breakfast and Dinner";
    expect(seoTitle(long)).toEqual({ absolute: long });
    expect(fullSeoTitle(long)).toBe(long);
  });
});

describe("metaDescription", () => {
  it("leaves descriptions within the limit untouched", () => {
    expect(metaDescription("Find local businesses in Nepal.")).toBe("Find local businesses in Nepal.");
  });

  it("cuts long descriptions at a clause boundary and ends with a full stop", () => {
    const text =
      "Choose an insurance agent in Nepal with a checklist covering agent licensing, policy coverage and exclusions, premium comparison and the claims process for life, health and vehicle insurance.";
    const result = metaDescription(text);
    expect(result.length).toBeLessThanOrEqual(160);
    expect(result.endsWith(".")).toBe(true);
    expect(text.startsWith(result.slice(0, -1))).toBe(true);
  });

  it("prefers a sentence boundary when one is available", () => {
    const text = `${"A".repeat(110)}. Second sentence that is long enough to overflow the limit by quite a lot of characters.`;
    expect(metaDescription(text)).toBe(`${"A".repeat(110)}.`);
  });
});
