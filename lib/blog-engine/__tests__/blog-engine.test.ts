/**
 * Trending blog engine (prompt Module D, §8): brand-safety filter, deterministic link injection,
 * and an end-to-end run (seed trend items -> cluster -> select -> generate) against the mock
 * provider, proving grounded, de-duplicated drafts land in REVIEW with sources + fact-check
 * attached, and a human editorial action can publish one with links already injected.
 * Zero external calls (fetchFn always 404s; MockAiProvider is deterministic).
 */
import { describe, it, expect, vi } from "vitest";
import type { FetchFn } from "../../ai-core";
import type { Listing } from "../../enrich";
import { createBlogEngineRuntime } from "../runtime";
import { canAutoPublish, canAutoPublishForListingCount } from "../editorial";
import type { BlogPost } from "../types";
import { isBrandSafe } from "../safety";
import { injectLinks } from "../generate/link-injection";
import {
  isDuplicateEmbedding,
  isDuplicateTopic,
  isNearDuplicateContent,
} from "../generate/seo";

function respond(body: unknown, status = 200): Response {
  return new Response(typeof body === "string" ? body : JSON.stringify(body), { status });
}

describe("Brand-safety hard filter (prompt §8.3)", () => {
  it("allows a preparedness/service angle but blocks tragedy, politics, crime and adult content", () => {
    expect(isBrandSafe("Monsoon-proofing your Kathmandu home: a practical guide")).toBe(true);
    expect(isBrandSafe("Flood victims found dead after landslide disaster")).toBe(false);
    expect(isBrandSafe("Prime minister announces election date")).toBe(false);
    expect(isBrandSafe("Man arrested after crime in Kathmandu")).toBe(false);
    expect(isBrandSafe("Explicit adult content site shut down")).toBe(false);
  });
});

describe("SEO duplicate suppression", () => {
  it("rejects reordered versions of an existing topic while allowing a distinct intent", () => {
    const existing = ["Questions to Ask Before Choosing a Restaurant or Cafe in Nepal"];

    expect(isDuplicateTopic("Choosing the Right Restaurant or Cafe in Nepal: Questions to Ask", existing)).toBe(true);
    expect(isDuplicateTopic("Pokhara Hotel Accessibility and Arrival Checklist", existing)).toBe(false);
  });

  it("rejects substantially shared long-form copy and keeps unrelated copy", () => {
    const shared = Array.from({ length: 90 }, (_, index) => `detail${index}`);
    const original = shared.join(" ");
    const closeCopy = [...shared.slice(0, 78), ...Array.from({ length: 12 }, (_, index) => `change${index}`)].join(" ");
    const distinct = Array.from({ length: 90 }, (_, index) => `different${index}`).join(" ");

    expect(isNearDuplicateContent(closeCopy, [original])).toBe(true);
    expect(isNearDuplicateContent(distinct, [original])).toBe(false);
  });

  it("uses the stricter embedding similarity threshold", () => {
    expect(isDuplicateEmbedding([1, 0], [[0.85, 0.5267826876]])).toBe(true);
    expect(isDuplicateEmbedding([1, 0], [[0.83, 0.557763]])).toBe(false);
  });
});

describe("Autopublish editorial floor", () => {
  it("cannot be weakened below 0.8 by environment configuration", () => {
    vi.stubEnv("BLOG_AUTOPUBLISH_MIN_CONFIDENCE", "0.2");
    const post = {
      confidence: 0.79,
      factcheck: { verdict: "pass", unsupportedClaims: [] },
    } as BlogPost;

    expect(canAutoPublish(post, true)).toBe(false);
    expect(canAutoPublish({ ...post, confidence: 0.8 }, true)).toBe(true);
    vi.unstubAllEnvs();
  });

  it("requires a meaningful qualified-listing base before automatic publishing", () => {
    vi.stubEnv("BLOG_AUTOPUBLISH_MIN_LISTINGS", "1");
    expect(canAutoPublishForListingCount(24)).toBe(false);
    expect(canAutoPublishForListingCount(25)).toBe(true);
    vi.unstubAllEnvs();
  });
});

describe("Link injection (prompt §8.4.5)", () => {
  it("resolves real category/listing placeholders and strips unresolved ones", () => {
    const listings = [
      { id: 1, name: "Test Cafe", slug: "test-cafe", qualityScore: 70 } as Listing,
      { id: 2, name: "Low Quality Biz", slug: "low-biz", qualityScore: 10 } as Listing,
    ];
    const body =
      "See {{category:restaurants}} and {{category:not-a-real-slug}} and " +
      "{{listing:1}} and {{listing:2}} and {{listing:999}}.";

    const result = injectLinks(body, ["restaurants"], listings);

    expect(result.bodyMarkdown).toContain("[restaurants](/search?category=restaurants)");
    expect(result.bodyMarkdown).toContain("[Test Cafe](/business/test-cafe)");
    expect(result.bodyMarkdown).not.toContain("not-a-real-slug");
    expect(result.bodyMarkdown).not.toContain("Low Quality Biz");
    expect(result.bodyMarkdown).not.toContain("999");
    expect(result.linksInjected).toBe(2); // restaurants category + listing 1 only (listing 2 below quality bar)
  });
});

describe("End-to-end trending blog engine (mock provider, zero network)", () => {
  const fetchFn = (() => Promise.resolve(respond("", 404))) as FetchFn;

  it("clusters, selects, and keeps only unique REVIEW drafts with sources + fact-check attached", async () => {
    const rt = createBlogEngineRuntime({ fetchFn });

    const now = new Date();
    const floodingText = "Monsoon flooding preparedness guide for Kathmandu homes";
    const floodingEmbedding = await rt.providers.embedder().embed(floodingText);
    const ipoText = "New IPO opens for eSewa users this month";
    const ipoEmbedding = await rt.providers.embedder().embed(ipoText);

    // Two sources report the same flooding headline -> should merge into one 2-item cluster.
    await rt.trendItems.create({
      sourceId: 1,
      title: floodingText,
      url: "https://a.example/flooding",
      publishedAt: now,
      embedding: floodingEmbedding,
    });
    await rt.trendItems.create({
      sourceId: 2,
      title: floodingText,
      url: "https://b.example/flooding",
      publishedAt: now,
      embedding: floodingEmbedding,
    });
    // A distinct, unrelated headline -> its own singleton cluster.
    await rt.trendItems.create({
      sourceId: 3,
      title: ipoText,
      url: "https://c.example/ipo",
      publishedAt: now,
      embedding: ipoEmbedding,
    });

    // This integration case intentionally exercises multiple distinct clusters; production's
    // unattended default remains one candidate per day.
    const result = await rt.runDailySweep({ maxPerDay: 3 });

    expect(result.selected).toBeGreaterThanOrEqual(2);
    expect(result.generated).toBeGreaterThanOrEqual(1);

    const clusters = await rt.trendClusters.list();
    const floodingCluster = clusters.find((c) => c.label === floodingText);
    expect(floodingCluster?.itemCount).toBe(2);

    const reviewPosts = await rt.blogPosts.list({ status: "REVIEW" });
    expect(reviewPosts).toHaveLength(result.generated);
    for (const post of reviewPosts) {
      expect(post.sources.length).toBeGreaterThan(0);
      expect(post.factcheck).toBeDefined();
      expect(post.linksInjected).toBeGreaterThanOrEqual(3); // prompt §8.4.5: 3-8 internal links
      expect(post.embedding?.length).toBeGreaterThan(0);
    }

    // Distinct clusters -> distinct articles (uniqueness check must not have collided them).
    const slugs = new Set(reviewPosts.map((p) => p.slug));
    expect(slugs.size).toBe(reviewPosts.length);

    // A human editorial action publishes one; auto-publish stays off throughout.
    const toPublish = reviewPosts[0];
    await rt.editorial.publish(toPublish.id, "admin@example.com");
    const published = await rt.blogPosts.get(toPublish.id);
    expect(published?.status).toBe("PUBLISHED");
    expect(published?.publishedAt).toBeInstanceOf(Date);
    expect(published?.reviewedBy).toBe("admin@example.com");

    const stillReview = await rt.blogPosts.list({ status: "REVIEW" });
    expect(stillReview.find((p) => p.id === toPublish.id)).toBeUndefined();
  });
});
