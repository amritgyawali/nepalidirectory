import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, MapPin } from "lucide-react";
import { RelatedGuideLinks } from "@/components/content/RelatedGuideLinks";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { siteUrl } from "@/lib/blog";
import { cityDirectoryPages } from "@/lib/city-pages";
import { getGuidesForCategory } from "@/lib/content-clusters";
import {
  directoryCategories,
  getDirectoryCategory,
  listingMatchesDirectoryCategory,
} from "@/lib/directory-categories";
import {
  getIndexableListings,
  listingDescription,
} from "@/lib/public-listings";
import { getBusinessHref, getSearchHref, routes } from "@/lib/routes";
import {
  buildBreadcrumbJsonLd,
  buildListingLocalBusinessJsonLd,
} from "@/lib/seo-auto";

type DirectoryCategoryPageProps = {
  params: Promise<{ slug: string }>;
};

const socialImage = `${siteUrl}/nepali-directory-og.png`;

export const dynamicParams = false;

export function generateStaticParams() {
  return directoryCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: DirectoryCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getDirectoryCategory(slug);

  if (!category) {
    return {
      title: "Category not found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: category.title,
    description: category.metaDescription,
    keywords: [
      category.priorityKeyword,
      `${category.name} directory Nepal`,
      `find ${category.name.toLowerCase()} in Nepal`,
    ],
    category: category.name,
    alternates: { canonical: category.href },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: category.title,
      description: category.metaDescription,
      url: `${siteUrl}${category.href}`,
      siteName: "Nepali Directory",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: socialImage,
          width: 1729,
          height: 909,
          alt: category.h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: category.title,
      description: category.metaDescription,
      images: [socialImage],
    },
  };
}

export default async function DirectoryCategoryPage({
  params,
}: DirectoryCategoryPageProps) {
  const { slug } = await params;
  const category = getDirectoryCategory(slug);

  if (!category) {
    notFound();
  }

  const listings = (await getIndexableListings())
    .filter((listing) => listingMatchesDirectoryCategory(listing, category))
    .sort((a, b) => a.name.localeCompare(b.name, "en"));
  const relatedGuides = getGuidesForCategory(category.slug);
  const otherCategories = directoryCategories.filter(
    (candidate) => candidate.slug !== category.slug,
  );
  const canonicalUrl = `${siteUrl}${category.href}`;

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${canonicalUrl}#collectionpage`,
    url: canonicalUrl,
    name: category.title,
    headline: category.h1,
    description: category.metaDescription,
    inLanguage: "en",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Nepali Directory",
      url: siteUrl,
    },
    about: {
      "@type": "Thing",
      name: category.priorityKeyword,
    },
    mainEntity: listings.length ? {
      "@type": "ItemList",
      name: `Qualified ${category.name.toLowerCase()} profiles`,
      numberOfItems: listings.length,
      itemListElement: listings.map((listing, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}${getBusinessHref(listing.slug)}`,
        item: buildListingLocalBusinessJsonLd(
          listing,
          `${siteUrl}${getBusinessHref(listing.slug)}`,
        ),
      })),
    } : undefined,
  };

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "Categories", url: `${siteUrl}${routes.categories}` },
    { name: category.name, url: canonicalUrl },
  ]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${canonicalUrl}#faq`,
    mainEntity: category.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            collectionPageJsonLd,
            breadcrumbJsonLd,
            faqJsonLd,
          ]),
        }}
      />

      <Breadcrumbs
        items={[
          { label: "Categories", href: routes.categories },
          { label: category.name },
        ]}
      />

      <section className="page-head">
        <div className="container">
          <span className="eyebrow">Nepal local directory</span>
          <h1 className="page-title">{category.h1}</h1>
          <p className="page-copy">{category.metaDescription}</p>
          <div className="seo-hero__actions">
            <Link
              className="button button--primary"
              href={getSearchHref(category.name)}
            >
              Search {category.name.toLowerCase()}
            </Link>
            <Link className="button button--outline" href={routes.claimListing}>
              Add or claim a business
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="answer-summary answer-summary--city">
            <h2>Quick answer</h2>
            <p>{category.quickAnswer}</p>
          </div>

          <div className="article-body">
            <section>
              <h2>{category.overviewHeading}</h2>
              {category.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          </div>

          <h2 className="compact-title nearby-title">Browse directory cities</h2>
          <p className="compact-copy">
            Open a city guide to understand its neighborhoods and available qualified
            profiles, then narrow your search to this category.
          </p>
          <div className="seo-link-strip" aria-label="Nepal city directories">
            {cityDirectoryPages.map((city) => (
              <Link key={city.slug} href={city.href}>
                {city.name} directory
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeader
            title={category.comparisonHeading}
            description={category.comparisonIntro}
          />
          <div className="seo-answer-grid">
            {category.comparisonPoints.map((point) => (
              <article className="answer-summary" key={point.title}>
                <h2>{point.title}</h2>
                <p>{point.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            title={`Qualified ${category.name.toLowerCase()} profiles`}
            description="These are active public records that currently pass the directory's source, category and completeness checks. They are ordered alphabetically, not ranked."
            action={{
              label: `Search all ${category.name.toLowerCase()}`,
              href: getSearchHref(category.name),
            }}
          />

          {listings.length ? (
            <div className="city-profile-grid">
              {listings.map((listing) => (
                <article className="answer-summary" key={listing.slug}>
                  <span className="eyebrow">
                    <MapPin size={13} aria-hidden /> {listing.neighborhood ?? listing.area}
                  </span>
                  <h2>
                    <Link href={getBusinessHref(listing.slug)}>{listing.name}</Link>
                  </h2>
                  <p>{listingDescription(listing)}</p>
                  <div className="business-card__amenities">
                    {listing.verified ? (
                      <span>
                        <BadgeCheck size={12} aria-hidden /> Verified record
                      </span>
                    ) : null}
                    {listing.services?.slice(0, 3).map((service) => (
                      <span key={service}>{service}</span>
                    ))}
                  </div>
                  <div className="business-card__actions">
                    <Link
                      className="button button--outline"
                      href={getBusinessHref(listing.slug)}
                    >
                      View business profile
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No qualified {category.name.toLowerCase()} profiles yet</h2>
              <p>
                We do not fill this category with preview businesses or unreviewed
                records. Search the wider directory, or submit a real business for
                publication review.
              </p>
              <div className="business-card__actions">
                <Link
                  className="button button--primary"
                  href={getSearchHref(category.name)}
                >
                  Search the directory
                </Link>
                <Link className="button button--outline" href={routes.claimListing}>
                  Add or claim a business
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <h2 className="compact-title">Explore related directory categories</h2>
          <div className="seo-link-strip" aria-label="Related directory categories">
            {otherCategories.map((candidate) => (
              <Link key={candidate.slug} href={candidate.href}>
                {candidate.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container article-faq">
          <h2>Questions about {category.name.toLowerCase()} in Nepal</h2>
          {category.faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <RelatedGuideLinks
        title={`Practical guides related to ${category.name.toLowerCase()}`}
        posts={relatedGuides}
      />
    </main>
  );
}
