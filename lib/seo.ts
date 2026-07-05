import type { BlogPost } from "@/lib/blog";
import type { CompareCategory } from "@/lib/compare";

export const publisher = {
  "@type": "Organization",
  name: "Nepali Directory",
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
  return {
    "@context": "https://schema.org",
    ...publisher,
    "@id": `${publisher.url}/#organization`,
    description:
      "Nepali Directory helps people find, compare and contact local businesses, restaurants, hotels, doctors and services across Nepal.",
    foundingDate: "2026",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${publisher.url}/contact`,
      areaServed: "NP",
      availableLanguage: ["en", "ne"]
    }
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${publisher.url}/#website`,
    name: "Nepali Directory",
    url: publisher.url,
    inLanguage: "en",
    publisher: {
      "@id": `${publisher.url}/#organization`
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${publisher.url}/search?q={search_term_string}`,
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
  return `${best.name} ranks first for ${category.category.toLowerCase()} because it is best for ${best.bestFor.toLowerCase()}, has a ${best.rating}/5 rating from ${best.reviews} reviews, and ${best.verdict.charAt(0).toLowerCase()}${best.verdict.slice(1)}`;
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
      name: "Nepali Directory",
      url: publisher.url
    },
    publisher,
    keywords: keywords.join(", "),
    dateModified
  };
}
