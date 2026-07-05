import { describe, expect, it } from "vitest";
import { createReviewsAiRuntime } from "@/lib/reviews-ai";
import {
  buildEvergreenItemListJsonLd,
  getCategorySitemapEntries,
  getEvergreenPage,
  getEvergreenPages,
  localBusinessSubtype,
  sitemapXml,
  suggestInternalLinks,
} from "../index";

describe("SEO/AEO automation (prompt Module G)", () => {
  it("publishes only quality-gated evergreen category-city pages", () => {
    const pages = getEvergreenPages();
    const page = getEvergreenPage("restaurants", "kathmandu");

    expect(pages.length).toBeGreaterThan(0);
    expect(page).not.toBeNull();
    expect(page?.listingCount).toBeGreaterThanOrEqual(5);
    expect(page?.qualityAverage).toBeGreaterThanOrEqual(60);
    expect(page?.intro).toContain("not invented");
  });

  it("emits ItemList/LocalBusiness schema and never emits deprecated HowTo", () => {
    const page = getEvergreenPage("restaurants", "kathmandu")!;
    const jsonLd = buildEvergreenItemListJsonLd(page);
    const serialized = JSON.stringify(jsonLd);

    expect(jsonLd["@type"]).toBe("ItemList");
    expect(serialized).toContain("Restaurant");
    expect(serialized).not.toContain("HowTo");
    expect(localBusinessSubtype(["Doctors", "Healthcare"])).toBe("MedicalClinic");
  });

  it("adds split sitemap entries for category-city pages", () => {
    const xml = sitemapXml(getCategorySitemapEntries());

    expect(xml).toContain("<urlset");
    expect(xml).toContain("/best/restaurants/kathmandu");
  });

  it("suggests internal links for editor approval without mutating content", () => {
    const suggestions = suggestInternalLinks();

    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0].score).toBeGreaterThan(0);
    expect(suggestions[0].sourceHref).toMatch(/^\/blog\//);
    expect(suggestions[0].targetHref).toMatch(/^\/best\//);
  });

  it("runs EVERGREEN_PAGE through the queue against MockAiProvider", async () => {
    const rt = createReviewsAiRuntime();
    await rt.repo.enqueue({ type: "EVERGREEN_PAGE", payload: { categorySlug: "restaurants", citySlug: "kathmandu" } });
    const job = await rt.worker.runOnce();

    expect(job?.status).toBe("DONE");
    expect(job?.result?.introGenerated).toBe(true);
    const stored = await rt.seoPageIntros.get("restaurants", "kathmandu");
    expect(stored?.introMd).toContain("deterministic mock intro");
  });

  it("persists internal-link suggestions for bulk admin approval", async () => {
    const rt = createReviewsAiRuntime();
    const result = await rt.runInternalLinkSuggestionSweep();
    const stored = await rt.internalLinkSuggestions.list("pending");

    expect(result.suggestions).toBeGreaterThan(0);
    expect(stored).toHaveLength(result.suggestions);
    expect(stored[0].targetHref).toMatch(/^\/best\//);
  });
});
