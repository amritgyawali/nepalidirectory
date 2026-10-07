import { describe, expect, it } from "vitest";
import { siteUrl } from "@/lib/blog";
import { claimListingFaqs, claimListingSteps } from "@/lib/claim-listing-content";
import { contentPages } from "@/lib/content";
import { plans } from "@/lib/data";
import { buildWebPageJsonLd } from "@/lib/seo";
import { buildOpeningHoursSpecification } from "@/lib/seo-auto/schema";
import {
  absoluteUrl,
  buildBreadcrumbListJsonLd,
  buildFaqPageJsonLd,
  buildHowToJsonLd,
  buildLinkItemListJsonLd,
  buildPlaceJsonLd,
  buildPlanServiceJsonLd,
  parsePlanPrice,
} from "@/lib/structured-data";

describe("absoluteUrl", () => {
  it("resolves paths against the canonical origin and keeps the homepage bare", () => {
    expect(absoluteUrl("/")).toBe(siteUrl);
    expect(absoluteUrl("/pricing")).toBe(`${siteUrl}/pricing`);
    expect(absoluteUrl("https://example.com/x")).toBe("https://example.com/x");
  });
});

describe("buildBreadcrumbListJsonLd", () => {
  it("prepends Home and resolves the final crumb to the current page", () => {
    const schema = buildBreadcrumbListJsonLd([{ name: "Pricing" }], "/pricing");
    expect(schema["@id"]).toBe(`${siteUrl}/pricing#breadcrumb`);
    expect(schema.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Pricing", item: `${siteUrl}/pricing` },
    ]);
  });

  it("omits the item URL of an unlinked final crumb when the page path is unknown", () => {
    const schema = buildBreadcrumbListJsonLd([{ name: "Blog", href: "/blog" }, { name: "Post" }]);
    expect(schema).not.toHaveProperty("@id");
    expect(schema.itemListElement[2]).toEqual({ "@type": "ListItem", position: 3, name: "Post" });
  });
});

describe("buildWebPageJsonLd", () => {
  it("anchors the page in the site entity graph", () => {
    const schema = buildWebPageJsonLd({
      name: "Pricing",
      description: "Plans",
      url: `${siteUrl}/pricing`,
      keywords: ["a", "b"],
      breadcrumb: true,
    });
    expect(schema["@id"]).toBe(`${siteUrl}/pricing#webpage`);
    expect(schema.isPartOf["@id"]).toBe(`${siteUrl}/#website`);
    expect(schema.publisher["@id"]).toBe(`${siteUrl}/#organization`);
    expect(schema.breadcrumb).toEqual({ "@id": `${siteUrl}/pricing#breadcrumb` });
    expect(schema.speakable?.cssSelector).toContain("h1");
  });

  it("omits breadcrumb and speakable references when not requested", () => {
    const schema = buildWebPageJsonLd({ name: "x", description: "y", url: siteUrl, keywords: [], speakable: null });
    expect(schema).not.toHaveProperty("breadcrumb");
    expect(schema).not.toHaveProperty("speakable");
  });
});

describe("buildFaqPageJsonLd", () => {
  it("returns null instead of an empty FAQPage", () => {
    expect(buildFaqPageJsonLd([], "/help")).toBeNull();
  });

  it("maps visible questions to Question/Answer pairs", () => {
    const schema = buildFaqPageJsonLd(contentPages.help.faqs ?? [], "/help");
    expect(schema?.["@id"]).toBe(`${siteUrl}/help#faq`);
    expect(schema?.mainEntity[0]).toMatchObject({
      "@type": "Question",
      acceptedAnswer: { "@type": "Answer" },
    });
  });
});

describe("content pages", () => {
  it.each(["about", "help", "privacy", "terms"])("%s has a quick answer, sections and FAQs", (slug) => {
    const page = contentPages[slug];
    expect(page.quickAnswer?.length).toBeGreaterThan(80);
    expect(page.sections?.length).toBeGreaterThanOrEqual(2);
    expect(page.faqs?.length).toBeGreaterThanOrEqual(2);
    expect(page.path).toBe(`/${slug}`);
    expect(page.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("plan offers", () => {
  it("parses free and monthly NPR prices", () => {
    expect(parsePlanPrice("Free")).toEqual({ amount: 0, monthly: false });
    expect(parsePlanPrice("Rs 2,500/mo")).toEqual({ amount: 2500, monthly: true });
    expect(parsePlanPrice("Contact us")).toBeNull();
  });

  it("publishes one NPR offer per plan", () => {
    const schema = buildPlanServiceJsonLd(plans, "/pricing");
    const offers = schema.hasOfferCatalog.itemListElement;
    expect(offers).toHaveLength(plans.length);
    expect(offers.every((offer) => offer.priceCurrency === "NPR")).toBe(true);
    expect(schema.provider).toEqual({ "@id": `${siteUrl}/#organization` });
  });
});

describe("HowTo and ItemList", () => {
  it("numbers claim-listing steps that match the visible list anchors", () => {
    const schema = buildHowToJsonLd({ name: "n", description: "d", pageUrl: "/claim-listing", steps: claimListingSteps });
    expect(schema.step).toHaveLength(claimListingSteps.length);
    expect(schema.step[0].url).toBe(`${siteUrl}/claim-listing#step-1`);
    expect(claimListingFaqs.length).toBeGreaterThanOrEqual(3);
  });

  it("returns null for an empty link list", () => {
    expect(buildLinkItemListJsonLd({ name: "x", pageUrl: "/", items: [] })).toBeNull();
  });
});

describe("buildPlaceJsonLd", () => {
  it("disambiguates covered places with Wikipedia and nests them in Nepal", () => {
    const place = buildPlaceJsonLd({ slug: "lalitpur", name: "Lalitpur", province: "Bagmati Province" });
    expect(place.sameAs).toEqual(["https://en.wikipedia.org/wiki/Lalitpur,_Nepal"]);
    expect(place.containedInPlace.containedInPlace.name).toBe("Nepal");
  });

  it("omits sameAs for places without a mapped reference", () => {
    expect(buildPlaceJsonLd({ slug: "unknown", name: "X", province: "Y" })).not.toHaveProperty("sameAs");
  });
});

describe("buildOpeningHoursSpecification", () => {
  it("keeps valid open days and drops closed or malformed rows", () => {
    const specs = buildOpeningHoursSpecification({
      weeklyHours: [
        { dayOfWeek: "Monday", opens: "11:30", closes: "21:00" },
        { dayOfWeek: "Tuesday", opens: "00:00", closes: "00:00", closed: true },
        { dayOfWeek: "Funday", opens: "09:00", closes: "17:00" },
        { dayOfWeek: "Friday", opens: "9am", closes: "5pm" },
        null,
      ],
    });
    expect(specs).toEqual([
      { "@type": "OpeningHoursSpecification", dayOfWeek: "https://schema.org/Monday", opens: "11:30", closes: "21:00" },
    ]);
  });

  it("returns undefined without usable hours", () => {
    expect(buildOpeningHoursSpecification({})).toBeUndefined();
    expect(buildOpeningHoursSpecification({ weeklyHours: "Mon-Sun" })).toBeUndefined();
  });
});
