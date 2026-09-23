import type { BlogPost } from "@/lib/blog";
import type { CompareCategory } from "@/lib/compare";

export const publisher = {
  "@type": "Organization",
  "@id": "https://www.nepalidirectory.com/#organization",
  name: "NepaliDirectory",
  alternateName: ["Nepali Directory", "Nepal Directory"],
  url: "https://www.nepalidirectory.com",
  logo: {
    "@type": "ImageObject",
    url: "https://www.nepalidirectory.com/logo.svg"
  },
  areaServed: {
    "@type": "Country",
    name: "Nepal"
  },
  knowsAbout: [
    "Nepal business directory",
    "Local business discovery",
    "Local SEO",
    "Restaurants in Nepal",
    "Hotels in Nepal",
    "Home services in Nepal",
    "Healthcare providers in Nepal"
  ]
};

export function buildOrganizationJsonLd() {
  const sameAs = [
    process.env.NEXT_PUBLIC_FACEBOOK_URL,
    process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    process.env.NEXT_PUBLIC_LINKEDIN_URL,
    process.env.NEXT_PUBLIC_YOUTUBE_URL,
  ].filter((value): value is string => Boolean(value && /^https:\/\//.test(value)));
  return {
    "@context": "https://schema.org",
    ...publisher,
    "@type": "Organization",
    description:
      "NepaliDirectory helps people find, compare and contact reviewed local business profiles, restaurants, hotels, doctors and services across Nepal.",
    sameAs: sameAs.length ? sameAs : undefined,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${publisher.url}/contact`,
      areaServed: "NP",
      availableLanguage: ["en", "ne"]
    },
    slogan: "Find trusted local businesses across Nepal",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      minValue: 1,
      maxValue: 10,
    },
    actionableFeedbackPolicy: `${publisher.url}/editorial-policy`,
    correctionsPolicy: `${publisher.url}/editorial-policy`,
    ethicsPolicy: `${publisher.url}/editorial-policy`,
    publishingPrinciples: `${publisher.url}/editorial-policy`,
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${publisher.url}/#website`,
    name: "NepaliDirectory",
    alternateName: ["Nepali Directory", "Nepal Directory"],
    url: publisher.url,
    inLanguage: "en",
    publisher: {
      "@id": `${publisher.url}/#organization`
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${publisher.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string"
    }
  };
}

export function uniqueKeywords(values: string[]) {
  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter(Boolean)
        .map((value) => value.replace(/\s+/g, " "))
    )
  );
}

/** Serialize JSON-LD without allowing data-backed text to terminate its HTML script element. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function buildBlogKeywords(post: BlogPost) {
  return uniqueKeywords([
    ...post.keywords,
    ...post.tags,
    post.category,
    post.title,
    post.seoTitle,
    `${post.category} Nepal`,
    `${post.category} guide Nepal`,
    `${post.category} Kathmandu`,
    "Nepali Directory guide",
    "Nepal local guide",
    "Nepal directory",
    ...post.sections.map((section) => section.heading),
    ...post.faqs.map((faq) => faq.question)
  ]);
}

export function buildCompareKeywords(category: CompareCategory) {
  return uniqueKeywords([
    ...category.keywords,
    category.category,
    category.title,
    category.seoTitle,
    `best ${category.category.toLowerCase()} Nepal`,
    `compare ${category.category.toLowerCase()} Nepal`,
    `${category.category} Kathmandu`,
    `${category.category} near me Nepal`,
    "Nepal business comparison",
    "Nepali Directory compare business",
    ...category.criteria,
    ...category.businesses.flatMap((business) => [
      business.name,
      business.area,
      business.bestFor,
      ...business.strengths
    ])
  ]);
}

export function estimateWordCount(post: BlogPost) {
  const text = [
    post.title,
    post.excerpt,
    post.description,
    ...post.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
    ...post.faqs.flatMap((faq) => [faq.question, faq.answer])
  ].join(" ");

  return text.split(/\s+/).filter(Boolean).length;
}

export function getBlogQuickAnswer(post: BlogPost) {
  return post.faqs[0]?.answer ?? post.excerpt;
}

export function getCompareQuickAnswer(category: CompareCategory) {
  const best = category.businesses[0];
  if (!best) {
    return `Compare ${category.category.toLowerCase()} using ${category.criteria.join(", ").toLowerCase()}. Named providers appear only after their public listing data passes the directory's publication checks.`;
  }
  return `Compare ${category.businesses.length} reviewed ${category.category.toLowerCase()} profiles using ${category.criteria.join(", ").toLowerCase()}. Treat each profile as a shortlist entry and confirm current details directly.`;
}

export function buildWebPageJsonLd({
  name,
  description,
  url,
  keywords,
  dateModified
}: {
  name: string;
  description: string;
  url: string;
  keywords: string[];
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    inLanguage: "en",
    isPartOf: {
      "@type": "WebSite",
      name: "NepaliDirectory",
      url: publisher.url
    },
    publisher,
    keywords: keywords.join(", "),
    dateModified
  };
}
