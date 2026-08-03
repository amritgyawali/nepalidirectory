import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { BadgeCheck, MapPin } from "lucide-react";
import { RelatedGuideLinks } from "@/components/content/RelatedGuideLinks";
import { DirectoryPagination } from "@/components/directory/DirectoryPagination";
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
  listingMatchesCity,
  listingVerificationLabel,
} from "@/lib/public-listings";
import {
  DIRECTORY_PAGE_SIZE,
  MIN_INDEXABLE_DIRECTORY_RESULTS,
  paginateDirectoryItems,
  paginatedDirectoryHref,
  parseDirectoryPage,
} from "@/lib/directory-pagination";
import { getBusinessHref, getCityCategoryHref, getSearchHref, routes } from "@/lib/routes";
import { serializeJsonLd } from "@/lib/seo";
import {
  buildBreadcrumbJsonLd,
  buildListingItemListJsonLd,
} from "@/lib/seo-auto";

type DirectoryCategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
};

const socialImage = `${siteUrl}/nepali-directory-og.png`;

export const dynamicParams = false;
export const revalidate = 300;

export function generateStaticParams() {
  return directoryCategories.map((category) => ({ slug: category.slug }));
}

const loadCategoryListings = cache(async (slug: string) => {
  const category = getDirectoryCategory(slug);
  if (!category) return [];
  return (await getIndexableListings())
    .filter((listing) => listingMatchesDirectoryCategory(listing, category))
    .sort((a, b) => a.name.localeCompare(b.name, "en"));
});

export async function generateMetadata({
  params,
  searchParams,
}: DirectoryCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getDirectoryCategory(slug);

  if (!category) {
    return {
      title: "Category not found",
      robots: { index: false, follow: false },
    };
  }

  const requestedPage = parseDirectoryPage((await searchParams)?.page);
  const listings = await loadCategoryListings(category.slug);
  const pagination = requestedPage ? paginateDirectoryItems(listings, requestedPage) : null;
  const indexable = Boolean(
    pagination?.valid && listings.length >= MIN_INDEXABLE_DIRECTORY_RESULTS,
  );
  const canonical = requestedPage
    ? paginatedDirectoryHref(category.href, requestedPage)
    : category.href;
  const title = requestedPage && requestedPage > 1
    ? `${category.title} - Page ${requestedPage}`
    : category.title;

  return {
    title,
    description: category.metaDescription,
    category: category.name,
    alternates: { canonical },
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
      title,
      description: category.metaDescription,
      url: `${siteUrl}${canonical}`,
      siteName: "NepaliDirectory",
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
  searchParams,
}: DirectoryCategoryPageProps) {
  const { slug } = await params;
  const category = getDirectoryCategory(slug);

  if (!category) {
    notFound();
  }

  const requestedPage = parseDirectoryPage((await searchParams)?.page);
  if (!requestedPage) notFound();
  const listings = await loadCategoryListings(category.slug);
  const pagination = paginateDirectoryItems(listings, requestedPage);
  if (!pagination.valid) notFound();
  const pageListings = pagination.items;
  const relatedGuides = getGuidesForCategory(category.slug);
  const qualifyingCities = cityDirectoryPages.filter(
    (city) =>
      listings.filter((listing) => listingMatchesCity(listing, city.slug)).length >=
      MIN_INDEXABLE_DIRECTORY_RESULTS,
  );
  const otherCategories = directoryCategories.filter(
    (candidate) => candidate.slug !== category.slug,
  );
  const canonicalPath = paginatedDirectoryHref(category.href, requestedPage);
  const canonicalUrl = `${siteUrl}${canonicalPath}`;

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
      name: "NepaliDirectory",
      url: siteUrl,
    },
    about: {
      "@type": "Thing",
      name: category.priorityKeyword,
    },
    mainEntity: pageListings.length
      ? buildListingItemListJsonLd(
          `Qualified ${category.name.toLowerCase()} profiles`,
          canonicalUrl,
          pageListings,
          (requestedPage - 1) * DIRECTORY_PAGE_SIZE,
        )
      : undefined,
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
          __html: serializeJsonLd([
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

          <h2 className="compact-title nearby-title">Browse qualified city pages</h2>
          <p className="compact-copy">
            A city-category page appears only when at least ten reviewed public profiles qualify.
          </p>
          <div className="seo-link-strip" aria-label="Nepal city directories">
            {qualifyingCities.map((city) => (
              <Link key={city.slug} href={getCityCategoryHref(city.slug, category.slug)}>
                {category.name} in {city.name}
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

          {pageListings.length ? (
            <div className="city-profile-grid">
              {pageListings.map((listing) => (
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
                        <BadgeCheck size={12} aria-hidden /> {listingVerificationLabel(listing)}
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
          <DirectoryPagination
            baseHref={category.href}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
          />
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
