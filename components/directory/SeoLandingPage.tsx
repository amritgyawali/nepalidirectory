import Link from "next/link";
import { ArrowRight, CheckCircle2, Search } from "lucide-react";
import { BusinessCard } from "@/components/directory/BusinessCard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FillImage } from "@/components/ui/FillImage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getCityHref } from "@/lib/city-pages";
import { businesses, categories, cityLinks } from "@/lib/data";
import type { SeoLandingPage } from "@/lib/landing";
import { routes } from "@/lib/routes";
import { siteUrl } from "@/lib/blog";
import { buildWebPageJsonLd, publisher, uniqueKeywords } from "@/lib/seo";

type SeoLandingPageProps = {
  page: SeoLandingPage;
};

export function SeoLandingPageView({ page }: SeoLandingPageProps) {
  const keywords = uniqueKeywords([...page.keywords, ...page.quickLinks, ...page.sections.map((section) => section.title)]);
  const webPageJsonLd = buildWebPageJsonLd({
    name: page.seoTitle,
    description: page.description,
    url: `${siteUrl}${page.href}`,
    keywords,
    dateModified: "2026-06-27"
  });
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.sections.map((section) => ({
      "@type": "Question",
      name: section.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: section.body
      }
    }))
  };
  const collectionJsonLd = {
    ...webPageJsonLd,
    "@type": "CollectionPage",
    publisher,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: page.quickLinks.map((link, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: link
      }))
    }
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([collectionJsonLd, faqJsonLd]) }}
      />
      <Breadcrumbs items={[{ label: page.title }]} />
      <section className="seo-hero">
        <div className="container seo-hero__grid">
          <div className="seo-hero__copy">
            <h1>{page.title}</h1>
            <p>{page.description}</p>
            <div className="seo-hero__actions">
              <Link className="button button--primary" href={routes.search}>
                <Search size={16} aria-hidden />
                {page.primaryCta}
              </Link>
              <Link className="button button--outline" href={routes.compareBusiness}>
                Compare businesses <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
          <div className="seo-hero__media">
            <FillImage src={page.image} alt={page.imageAlt} sizes="(max-width: 980px) 100vw, 520px" priority />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="seo-stats">
            {page.stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="seo-link-strip" aria-label="Popular shortcuts">
            {page.quickLinks.map((link) => (
              <Link key={link} href={routes.search}>
                {link}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeader
            title="Browse useful categories"
            description="Start from a common local need, then compare businesses by fit, rating, city and reviews."
            action={{ label: "All categories", href: routes.categories }}
          />
          <div className="seo-category-cards">
            {categories.slice(0, 8).map((category) => (
              <Link key={category.name} href={category.href}>
                <span>{category.count}</span>
                <strong>{category.name}</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <div>
            <SectionHeader title="Featured local businesses" action={{ label: "Search all", href: routes.search }} />
            {businesses.slice(0, 4).map((business) => (
              <BusinessCard key={business.slug} business={business} />
            ))}
          </div>
          <aside className="sidebar">
            <section className="filter-card">
              <h2>Popular cities</h2>
              {cityLinks.slice(0, 10).map((city) => (
                <Link key={city} href={getCityHref(city)}>
                  {city}
                </Link>
              ))}
            </section>
          </aside>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container seo-answer-grid">
          {page.sections.map((section) => (
            <article key={section.title} className="answer-summary">
              <h2>{section.title}</h2>
              <p>{section.body}</p>
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>
                    <CheckCircle2 size={14} aria-hidden />
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
