import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { RelatedGuideLinks } from "@/components/content/RelatedGuideLinks";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FillImage } from "@/components/ui/FillImage";
import { compareCategories, getCompareCategory, getSortedCompareCategories } from "@/lib/compare";
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
  return {
    title: category.seoTitle,
    description: category.description,
    category: category.category,
    alternates: { canonical: category.href },
    robots: { index: false, follow: true },
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
            <section className="answer-summary">
              <h2>Qualified provider comparison pending</h2>
              <p>
                This guide does not publish placeholder businesses, invented ratings or sample
                prices. Named providers will appear only after production listing data passes the
                location, category, provenance and content-review checks.
              </p>
            </section>
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
