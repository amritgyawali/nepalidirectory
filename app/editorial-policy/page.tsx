import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/directory/PageHero";
import { siteUrl } from "@/lib/blog";
import { routes } from "@/lib/routes";
import { buildWebPageJsonLd, publisher, serializeJsonLd, uniqueKeywords } from "@/lib/seo";
import { buildPublicPageMetadata } from "@/lib/site-metadata";

const description =
  "How Nepali Directory creates, reviews and updates local guides, comparison pages, business information and user decision content.";

export const metadata = buildPublicPageMetadata({
  title: "Editorial Policy and Content Review Standards",
  description,
  path: routes.editorialPolicy,
});

const standards = [
  {
    title: "Local usefulness first",
    body: "Guides and comparisons are written to help people make practical local decisions in Nepal, not to publish thin keyword pages."
  },
  {
    title: "Clear review signals",
    body: "Business comparisons use visible, source-backed directory signals such as category fit, location, published services and user intent."
  },
  {
    title: "Freshness and corrections",
    body: "Evergreen guides are reviewed for freshness, and pages show publication or modified dates where dates help readers judge reliability."
  },
  {
    title: "No paid ranking claim",
    body: "Sponsored placements and advertising should not be presented as independent editorial rankings."
  },
  {
    title: "AI-assisted articles with publish gates",
    body: "Posts bylined \"NepaliDirectory Team\" start as AI-assisted drafts grounded in cited sources and pass duplicate, safety, fact-check and confidence gates. Unattended publishing is paused until the directory has a meaningful base of qualified public profiles."
  }
];

export default function EditorialPolicyPage() {
  const keywords = uniqueKeywords([
    "Nepali Directory editorial policy",
    "Nepal directory review standards",
    "local guide content policy",
    "business comparison methodology"
  ]);
  // One AboutPage node for the URL, linked to the site graph and its breadcrumb trail.
  const aboutJsonLd = {
    ...buildWebPageJsonLd({
      name: "Editorial Policy and Content Review Standards",
      description,
      url: `${siteUrl}${routes.editorialPolicy}`,
      breadcrumb: true,
      keywords,
      dateModified: "2026-07-15",
    }),
    "@type": "AboutPage",
    about: { "@id": publisher["@id"] },
    mainEntity: standards.map((standard) => ({
      "@type": "Thing",
      name: standard.title,
      description: standard.body,
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(aboutJsonLd) }}
      />
      <Breadcrumbs items={[{ label: "Editorial Policy" }]} currentPath={routes.editorialPolicy} />
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
              Directory pages may include reviewed business information, category signals and
              source-backed service notes. Users should confirm hours, prices,
              availability and health or safety details directly with the provider before making a decision.
            </p>
            <Link className="button button--primary" href={routes.contact}>
              Report an update
            </Link>
            <Link className="button button--outline" href={routes.directoryMethodology}>
              Read the directory methodology
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}
