import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/directory/PageHero";
import { contentAuthors, getAuthorUrl } from "@/lib/authors";
import { siteUrl } from "@/lib/blog";
import { buildWebPageJsonLd, uniqueKeywords } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Editorial Authors and Review Desks",
  description:
    "Meet the Nepali Directory editorial desks that maintain travel, food, healthcare, services, education and local SEO guides.",
  alternates: {
    canonical: "/authors"
  },
  openGraph: {
    title: "Nepali Directory Editorial Authors",
    description:
      "Editorial desks and subject areas behind Nepali Directory guides and local comparison content.",
    url: `${siteUrl}/authors`,
    siteName: "Nepali Directory",
    type: "website"
  }
};

export default function AuthorsPage() {
  const keywords = uniqueKeywords([
    "Nepali Directory authors",
    "Nepal local guide editors",
    "Nepali Directory editorial team",
    ...contentAuthors.flatMap((author) => author.knowsAbout)
  ]);
  const webPageJsonLd = {
    ...buildWebPageJsonLd({
      name: "Nepali Directory Editorial Authors",
      description:
        "Editorial desks and subject areas behind Nepali Directory guides and local comparison content.",
      url: `${siteUrl}/authors`,
      keywords,
      dateModified: "2026-06-28"
    }),
    "@type": "CollectionPage",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: contentAuthors.map((author, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: getAuthorUrl(author),
        name: author.name
      }))
    }
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <Breadcrumbs items={[{ label: "Authors" }]} />
      <PageHero
        title="Editorial authors and review desks"
        subtitle="Subject-focused desks maintain Nepali Directory guides with practical local context, freshness checks and clear review notes."
      />
      <section className="section">
        <div className="container author-grid">
          {contentAuthors.map((author) => (
            <Link className="author-card" href={`/authors/${author.slug}`} key={author.slug}>
              <span>{author.role}</span>
              <h2>{author.name}</h2>
              <p>{author.description}</p>
              <small>{author.knowsAbout.join(" / ")}</small>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
