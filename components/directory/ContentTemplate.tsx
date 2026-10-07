import Link from "next/link";
import { PageHero } from "@/components/directory/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteUrl } from "@/lib/blog";
import type { ContentPage } from "@/lib/content";
import { buildWebPageJsonLd, publisher, uniqueKeywords } from "@/lib/seo";
import { buildFaqPageJsonLd } from "@/lib/structured-data";

function formatDate(value: string): string {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function ContentTemplate({ page }: { page: ContentPage }) {
  const url = `${siteUrl}${page.path}`;
  const description = page.quickAnswer ?? page.subtitle;
  const webPageJsonLd = {
    ...buildWebPageJsonLd({
      name: page.title,
      description,
      url,
      keywords: uniqueKeywords([
        page.title,
        `Nepali Directory ${page.slug}`,
        ...(page.sections ?? []).map((section) => section.heading),
      ]),
      dateModified: page.updated,
      breadcrumb: true,
    }),
    "@type": page.schemaType,
    ...(page.schemaType === "AboutPage" ? { mainEntity: { "@id": publisher["@id"] } } : {}),
    ...(page.faqs?.length ? { hasPart: { "@id": `${url}#faq` } } : {}),
  };

  return (
    <main>
      <JsonLd data={[webPageJsonLd, page.faqs ? buildFaqPageJsonLd(page.faqs, url) : null]} />
      <Breadcrumbs items={[{ label: page.title }]} currentPath={page.path} />
      <PageHero title={page.title} subtitle={page.subtitle} cta={page.cta} />
      <section className="section">
        <div className="container prose-card">
          {page.quickAnswer ? (
            <section className="answer-summary" aria-labelledby={`${page.slug}-summary`}>
              <h2 id={`${page.slug}-summary`}>In short</h2>
              <p>{page.quickAnswer}</p>
            </section>
          ) : null}
          {page.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {page.sections?.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets?.length ? (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
          {page.faqs?.length ? (
            <section className="article-faq" aria-labelledby={`${page.slug}-faq`}>
              <h2 id={`${page.slug}-faq`}>Frequently asked questions</h2>
              {page.faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </section>
          ) : null}
          {page.relatedLinks?.length ? (
            <nav aria-label="Related pages">
              <h2>Related pages</h2>
              <ul>
                {page.relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          <p>
            <small>
              Last updated: <time dateTime={page.updated}>{formatDate(page.updated)}</time>
            </small>
          </p>
          {page.cta ? (
            <Link className="button button--primary" href={page.cta.href}>
              {page.cta.label}
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  );
}
