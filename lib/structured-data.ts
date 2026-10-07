import { siteUrl } from "@/lib/blog";

/**
 * Shared schema.org builders for page-level structured data.
 *
 * Every node is anchored with an `@id` and references the site-wide `#organization` and
 * `#website` nodes emitted by the root layout, so search engines and AI answer engines can merge
 * the per-page JSON-LD into one entity graph instead of reading disconnected islands.
 */

export const organizationId = `${siteUrl}/#organization`;
export const websiteId = `${siteUrl}/#website`;
export const defaultSocialImage = `${siteUrl}/nepali-directory-og.png`;

/**
 * CSS selectors for the page regions that summarize a page well enough to be read aloud or quoted
 * by an assistant. Selectors that are absent on a page are ignored by consumers.
 */
export const defaultSpeakableSelectors = ["h1", ".page-copy", ".answer-summary p", ".article-faq summary"];

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  // The homepage is referenced as the bare origin everywhere else in the site's schema.
  if (pathOrUrl === "" || pathOrUrl === "/") return siteUrl;
  return `${siteUrl}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export type FaqItem = { question: string; answer: string };

/** FAQPage for questions that are rendered visibly on the same page. */
export function buildFaqPageJsonLd(faqs: readonly FaqItem[], pageUrl: string) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absoluteUrl(pageUrl)}#faq`,
    isPartOf: { "@id": `${absoluteUrl(pageUrl)}#webpage` },
    inLanguage: "en",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export type BreadcrumbTrailItem = { name: string; href?: string };

/**
 * BreadcrumbList mirroring the visible breadcrumb trail. "Home" is prepended automatically; the
 * final crumb may omit its href, in which case it resolves to the current page URL when provided.
 */
export function buildBreadcrumbListJsonLd(items: readonly BreadcrumbTrailItem[], currentUrl?: string) {
  const trail: BreadcrumbTrailItem[] = [{ name: "Home", href: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(currentUrl ? { "@id": `${absoluteUrl(currentUrl)}#breadcrumb` } : {}),
    itemListElement: trail.map((item, index) => {
      const isLast = index === trail.length - 1;
      const href = item.href ?? (isLast ? currentUrl : undefined);
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        ...(href ? { item: absoluteUrl(href) } : {}),
      };
    }),
  };
}

export type ItemListEntry = { name: string; href: string; description?: string };

/** ItemList of internal pages (hubs, guides, categories). */
export function buildLinkItemListJsonLd({
  name,
  pageUrl,
  items,
  ordered = false,
}: {
  name: string;
  pageUrl: string;
  items: readonly ItemListEntry[];
  ordered?: boolean;
}) {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${absoluteUrl(pageUrl)}#itemlist`,
    name,
    numberOfItems: items.length,
    itemListOrder: ordered ? "https://schema.org/ItemListOrderAscending" : "https://schema.org/ItemListUnordered",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.href),
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}

export type HowToStepInput = { name: string; text: string; href?: string };

/** HowTo for step-by-step processes that are rendered visibly on the page. */
export function buildHowToJsonLd({
  name,
  description,
  pageUrl,
  steps,
  totalTime,
}: {
  name: string;
  description: string;
  pageUrl: string;
  steps: readonly HowToStepInput[];
  totalTime?: string;
}) {
  const url = absoluteUrl(pageUrl);
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${url}#howto`,
    name,
    description,
    inLanguage: "en",
    ...(totalTime ? { totalTime } : {}),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      url: step.href ? absoluteUrl(step.href) : `${url}#step-${index + 1}`,
    })),
  };
}

export function buildSpeakable(selectors: readonly string[] = defaultSpeakableSelectors) {
  return { "@type": "SpeakableSpecification", cssSelector: [...selectors] };
}

export type PlanInput = { name: string; price: string; description: string; features: readonly string[] };

/** Parses display prices such as "Free" or "Rs 2,500/mo" into a numeric NPR amount. */
export function parsePlanPrice(price: string): { amount: number; monthly: boolean } | null {
  if (/^free$/i.test(price.trim())) return { amount: 0, monthly: false };
  const match = price.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;
  return { amount: Number(match[1]), monthly: /\/\s*mo/i.test(price) };
}

/**
 * Service + OfferCatalog for the directory's own listing and advertising plans. Prices describe
 * the publisher's own products, never a listed business.
 */
export function buildPlanServiceJsonLd(plans: readonly PlanInput[], pageUrl: string) {
  const url = absoluteUrl(pageUrl);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: "Nepali Directory business listing and advertising",
    serviceType: "Online business directory listing",
    description:
      "Business listing and clearly labelled advertising plans for Nepal businesses. Payment never buys an organic ranking or a verified badge.",
    provider: { "@id": organizationId },
    areaServed: { "@type": "Country", name: "Nepal" },
    url,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Listing and advertising plans",
      itemListElement: plans.flatMap((plan) => {
        const parsed = parsePlanPrice(plan.price);
        if (!parsed) return [];
        return [
          {
            "@type": "Offer",
            name: `${plan.name} plan`,
            description: `${plan.description} Includes: ${plan.features.join(", ")}.`,
            price: parsed.amount,
            priceCurrency: "NPR",
            availability: "https://schema.org/InStock",
            url,
            ...(parsed.monthly
              ? {
                  priceSpecification: {
                    "@type": "UnitPriceSpecification",
                    price: parsed.amount,
                    priceCurrency: "NPR",
                    unitCode: "MON",
                    referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
                  },
                }
              : {}),
          },
        ];
      }),
    },
  };
}

/**
 * Stable Wikipedia references for the cities and districts the directory covers. They let search
 * and answer engines disambiguate each place entity (for example Lalitpur, Nepal vs. Lalitpur,
 * India) without the site asserting any facts of its own about the place.
 */
const placeWikipediaTitles: Record<string, string> = {
  kathmandu: "Kathmandu",
  pokhara: "Pokhara",
  lalitpur: "Lalitpur,_Nepal",
  bhaktapur: "Bhaktapur",
  chitwan: "Chitwan_District",
  biratnagar: "Biratnagar",
  butwal: "Butwal",
  dharan: "Dharan",
  bharatpur: "Bharatpur,_Nepal",
  birgunj: "Birgunj",
  nepalgunj: "Nepalgunj",
};

export function placeSameAs(slug: string): string[] | undefined {
  const title = placeWikipediaTitles[slug];
  return title ? [`https://en.wikipedia.org/wiki/${title}`] : undefined;
}

/** Place node for a covered city or district, nested in its province and Nepal. */
export function buildPlaceJsonLd({ slug, name, province }: { slug: string; name: string; province: string }) {
  const sameAs = placeSameAs(slug);
  return {
    "@type": slug === "chitwan" ? "AdministrativeArea" : "City",
    name,
    ...(sameAs ? { sameAs } : {}),
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: province,
      containedInPlace: { "@type": "Country", name: "Nepal", sameAs: ["https://en.wikipedia.org/wiki/Nepal"] },
    },
  };
}
