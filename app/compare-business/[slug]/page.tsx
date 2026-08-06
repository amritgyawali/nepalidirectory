import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { RelatedGuideLinks } from "@/components/content/RelatedGuideLinks";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FillImage } from "@/components/ui/FillImage";
import { compareCategories, getCompareCategory, getSortedCompareCategories } from "@/lib/compare";
import { COMPARE_RANKING_BASIS, getComparedBusinesses } from "@/lib/compare-listings";
import { getGuidesForCategory } from "@/lib/content-clusters";
import { siteUrl } from "@/lib/blog";
import { routes } from "@/lib/routes";
import { buildCompareKeywords, buildWebPageJsonLd, getCompareQuickAnswer, publisher, serializeJsonLd } from "@/lib/seo";

type CompareCategoryPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return compareCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CompareCategoryPageProps): Promise<Metadata> {
  const category = getCompareCategory((await params).slug);
  if (!category) return { title: "Comparison not found", robots: { index: false, follow: false } };
  // Only a guide with a real provider list is worth indexing. Without one the page is generic
  // advice with no comparison on it, which is exactly the thin result the gate exists to withhold.
  const indexable = (await getComparedBusinesses(category.slug)).length > 0;
  return {
    title: category.seoTitle,
    description: category.description,
    category: category.category,
    alternates: { canonical: category.href },
    robots: {
      index: indexable,
      follow: true,
      googleBot: {
        index: indexable,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: category.seoTitle,
      description: category.description,
      url: `${siteUrl}${category.href}`,
      siteName: "NepaliDirectory",
      locale: "en_US",
      type: "article",
      images: [{ url: category.image, width: 1200, height: 675, alt: category.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: category.seoTitle,
      description: category.description,
      images: [category.image],
    },
  };
}

export default async function CompareCategoryPage({ params }: CompareCategoryPageProps) {
  const category = getCompareCategory((await params).slug);
  if (!category) notFound();

  const businesses = await getComparedBusinesses(category.slug);
  const keywords = buildCompareKeywords(category);
  const quickAnswer = getCompareQuickAnswer(category);
  const otherCategories = getSortedCompareCategories().filter((candidate) => candidate.slug !== category.slug);
  const relatedGuides = getGuidesForCategory(category.slug);
  const comparisonFaqs = [
    {
      question: `How should I compare ${category.category.toLowerCase()} options?`,
      answer: quickAnswer,
    },
    {
      question: `How were these ${category.category.toLowerCase()} criteria chosen?`,
      answer: `Use the same evidence for every option: ${category.criteria.join(", ").toLowerCase()}. Confirm current prices, availability, credentials and terms directly before booking.`,
    },
  ];
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: category.title,
    description: category.description,
    image: category.image,
    dateModified: category.updatedAt,
    inLanguage: "en",
    author: publisher,
    publisher,
    mainEntityOfPage: `${siteUrl}${category.href}`,
    articleSection: category.category,
    keywords: keywords.join(", "),
  };
  const webPageJsonLd = buildWebPageJsonLd({
    name: category.seoTitle,
    description: category.description,
    url: `${siteUrl}${category.href}`,
    keywords,
    dateModified: category.updatedAt,
  });
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Compare Business", item: `${siteUrl}${routes.compareBusiness}` },
      { "@type": "ListItem", position: 3, name: category.category, item: `${siteUrl}${category.href}` },
    ],
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: comparisonFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd([webPageJsonLd, articleJsonLd, breadcrumbJsonLd, faqJsonLd]) }}
      />
      <Breadcrumbs items={[{ label: "Compare Business", href: routes.compareBusiness }, { label: category.category }]} />
      <section className="compare-hero">
        <div className="container compare-hero__grid">
          <div>
            <Link className="article-back" href={routes.compareBusiness}><ArrowLeft size={16} aria-hidden /> Compare Business</Link>
            <span>{category.category}</span>
            <h1>{category.title}</h1>
            <p>{category.description}</p>
            <div className="compare-criteria" aria-label="Comparison criteria">
              {category.criteria.map((criterion) => <span key={criterion}><CheckCircle2 size={14} aria-hidden /> {criterion}</span>)}
            </div>
          </div>
          <div className="compare-hero__image">
            <FillImage src={category.image} alt={category.imageAlt} sizes="(max-width: 980px) 100vw, 420px" priority />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container compare-layout">
          <div className="article-body">
            {businesses.length ? (
              <section className="compare-providers" aria-labelledby="compare-providers-title">
                <h2 id="compare-providers-title">
                  {businesses.length} {category.category.toLowerCase()} to compare
                </h2>
                <p className="compare-providers__basis">{COMPARE_RANKING_BASIS}</p>
                <ol className="compare-provider-list">
                  {businesses.map((business) => (
                    <li key={business.slug ?? business.name} className="compare-provider">
                      <div className="compare-provider__head">
                        <span className="compare-provider__rank" aria-hidden>{business.rank}</span>
                        <div>
                          <h3>
                            {business.slug ? (
                              <Link href={`/business/${business.slug}`}>{business.name}</Link>
                            ) : (
                              business.name
                            )}
                          </h3>
                          <p className="compare-provider__meta">
                            {business.area}
                            {business.address ? ` — ${business.address}` : ""}
                          </p>
                        </div>
                      </div>
                      {business.summary ? <p>{business.summary}</p> : null}
                      {business.strengths.length ? (
                        <ul className="compare-provider__strengths">
                          {business.strengths.map((strength) => (
                            <li key={strength}><CheckCircle2 size={14} aria-hidden /> {strength}</li>
                          ))}
                        </ul>
                      ) : null}
                      <p className="compare-provider__verdict">{business.verdict}</p>
                      <div className="compare-provider__actions">
                        {business.phone ? <a href={`tel:${business.phone}`}>{business.phone}</a> : null}
                        {business.website ? (
                          <a href={business.website} rel="nofollow noopener" target="_blank">Website</a>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ) : (
              <section className="answer-summary">
                <h2>Qualified provider comparison pending</h2>
                <p>
                  This guide does not publish placeholder businesses, invented ratings or sample
                  prices. Named providers will appear only after production listing data passes the
                  location, category, provenance and content-review checks.
                </p>
              </section>
            )}
            {category.guideSections.map((section) => (
              <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>
            ))}
          </div>
          <aside className="sidebar">
            <section className="filter-card"><h2>Compare other categories</h2>{otherCategories.map((candidate) => <Link key={candidate.slug} href={candidate.href}>{candidate.category}</Link>)}</section>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container article-faq"><h2>Comparison questions</h2>{comparisonFaqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div>
      </section>
      <RelatedGuideLinks title={`Guides for comparing ${category.category.toLowerCase()}`} posts={relatedGuides} />
    </main>
  );
}
