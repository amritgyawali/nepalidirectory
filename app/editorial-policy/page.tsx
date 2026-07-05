import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/directory/PageHero";
import { siteUrl } from "@/lib/blog";
import { routes } from "@/lib/routes";
import { buildWebPageJsonLd, publisher, uniqueKeywords } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Editorial Policy and Content Review Standards",
  description:
    "How Nepali Directory creates, reviews and updates local guides, comparison pages, business information and user decision content.",
  alternates: {
    canonical: routes.editorialPolicy
  },
  openGraph: {
    title: "Nepali Directory Editorial Policy",
    description:
      "Content review standards for Nepali Directory local guides, comparisons and directory pages.",
    url: `${siteUrl}${routes.editorialPolicy}`,
    siteName: "Nepali Directory",
    type: "website"
  }
};

const standards = [
  {
    title: "Local usefulness first",
    body: "Guides and comparisons are written to help people make practical local decisions in Nepal, not to publish thin keyword pages."
  },
  {
    title: "Clear review signals",
    body: "Business comparisons use visible directory signals such as category fit, location, rating, review count, price notes, strengths and user intent."
  },
  {
    title: "Freshness and corrections",
    body: "Evergreen guides are reviewed for freshness, and pages show publication or modified dates where dates help readers judge reliability."
  },
  {
    title: "No paid ranking claim",
    body: "Sponsored placements and advertising should not be presented as independent editorial rankings."
  }
];

export default function EditorialPolicyPage() {
  const keywords = uniqueKeywords([
    "Nepali Directory editorial policy",
    "Nepal directory review standards",
    "local guide content policy",
    "business comparison methodology"
  ]);
  const webPageJsonLd = buildWebPageJsonLd({
    name: "Nepali Directory Editorial Policy",
    description:
      "How Nepali Directory creates, reviews and updates local guides, comparison pages, business information and user decision content.",
    url: `${siteUrl}${routes.editorialPolicy}`,
    keywords,
    dateModified: "2026-06-28"
  });
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Editorial Policy and Content Review Standards",
    url: `${siteUrl}${routes.editorialPolicy}`,
    description: metadata.description,
    publisher,
    mainEntity: standards.map((standard) => ({
      "@type": "Thing",
      name: standard.title,
      description: standard.body
    }))
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([webPageJsonLd, aboutJsonLd]) }}
      />
      <Breadcrumbs items={[{ label: "Editorial Policy" }]} />
      <PageHero
        title="Editorial policy and review standards"
        subtitle="How Nepali Directory keeps local guides, comparison pages and business decision content useful, transparent and reviewable."
        cta={{ label: "Meet the authors", href: "/authors" }}
      />
      <section className="section">
        <div className="container editorial-policy">
          {standards.map((standard) => (
            <article className="fact-panel" key={standard.title}>
              <h2>{standard.title}</h2>
              <p>{standard.body}</p>
            </article>
          ))}
          <section className="answer-summary">
            <h2>Business data notes</h2>
            <p>
              Directory pages may include representative business information, category signals,
              review counts, prices and service notes. Users should confirm hours, prices,
              availability and health or safety details directly with the provider before making a decision.
            </p>
            <Link className="button button--primary" href={routes.contact}>
              Report an update
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}
