import Link from "next/link";
import { ArrowRight, CheckCircle2, Search } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FillImage } from "@/components/ui/FillImage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getCityDirectoryPage, getCityHref } from "@/lib/city-pages";
import { categories, cityLinks } from "@/lib/data";
import { getDirectoryCategory } from "@/lib/directory-categories";
import type { SeoLandingPage } from "@/lib/landing";
import { getIndexableListings, listingDescription } from "@/lib/public-listings";
import { getBusinessHref, getSearchHref, routes } from "@/lib/routes";
import { siteUrl } from "@/lib/blog";
import { buildWebPageJsonLd, publisher, uniqueKeywords } from "@/lib/seo";

type SeoLandingPageProps = {
  page: SeoLandingPage;
};

function getQuickLinkDestination(label: string): string {
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return getDirectoryCategory(slug)?.href ?? getCityDirectoryPage(slug)?.href ?? getSearchHref(label);
}

export async function SeoLandingPageView({ page }: SeoLandingPageProps) {
  const publicListings = (await getIndexableListings()).slice(0, 8);
  const keywords = uniqueKeywords([...page.keywords, ...page.quickLinks, ...page.sections.map((section) => section.title)]);
  const webPageJsonLd = buildWebPageJsonLd({
    name: page.seoTitle,
    description: page.description,
    url: `${siteUrl}${page.href}`,
    keywords,
    dateModified: "2026-06-27"
  });
  const collectionJsonLd = {
    ...webPageJsonLd,
    "@type": "CollectionPage",
    publisher,
    mainEntity: publicListings.length ? {
      "@type": "ItemList",
      numberOfItems: publicListings.length,
      itemListElement: publicListings.map((listing, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: listing.name,
        url: `${siteUrl}${getBusinessHref(listing.slug)}`,
      })),
    } : undefined,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
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
              <Link key={link} href={getQuickLinkDestination(link)}>
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
                <span>Open guide</span>
                <strong>{category.name}</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <div>
            <SectionHeader title="Qualified local business profiles" action={{ label: "Search all", href: routes.search }} />
            {publicListings.length ? (
              <div className="city-profile-grid">
                {publicListings.slice(0, 4).map((listing) => (
                  <article className="answer-summary" key={listing.slug}>
                    <h3><Link href={getBusinessHref(listing.slug)}>{listing.name}</Link></h3>
                    <p>{listingDescription(listing)}</p>
                    <Link href={getBusinessHref(listing.slug)}>View reviewed profile</Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="answer-summary">
                <h3>Public rankings are waiting for qualified profiles</h3>
                <p>
                  We do not rank demo records or invent ratings. Named businesses appear after
                  their source, category, location and profile completeness pass review.
                </p>
                <Link className="button button--primary" href={routes.claimListing}>Add a business for review</Link>
              </div>
            )}
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
