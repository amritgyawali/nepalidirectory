import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { BadgeCheck, MapPin } from "lucide-react";
import { DirectoryPagination } from "@/components/directory/DirectoryPagination";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { siteUrl } from "@/lib/blog";
import { getCityDirectoryPage, getCityEditorialDetail } from "@/lib/city-pages";
import {
  getDirectoryCategory,
  listingMatchesDirectoryCategory,
} from "@/lib/directory-categories";
import {
  DIRECTORY_PAGE_SIZE,
  MIN_INDEXABLE_DIRECTORY_RESULTS,
  paginateDirectoryItems,
  paginatedDirectoryHref,
  parseDirectoryPage,
} from "@/lib/directory-pagination";
import {
  getIndexableListings,
  listingDescription,
  listingMatchesCity,
  listingVerificationLabel,
} from "@/lib/public-listings";
import { getBusinessHref, getCityCategoryHref, routes } from "@/lib/routes";
import { serializeJsonLd } from "@/lib/seo";
import { buildBreadcrumbJsonLd, buildListingItemListJsonLd } from "@/lib/seo-auto";

type CityCategoryPageProps = {
  params: Promise<{ slug: string; category: string }>;
  searchParams?: Promise<{ page?: string }>;
};

export const revalidate = 300;

const loadListings = cache(async (citySlug: string, categorySlug: string) => {
  const category = getDirectoryCategory(categorySlug);
  if (!category) return [];
  return (await getIndexableListings())
    .filter(
      (listing) =>
        listingMatchesCity(listing, citySlug) &&
        listingMatchesDirectoryCategory(listing, category),
    )
    .sort((left, right) => left.name.localeCompare(right.name, "en"));
});

export async function generateMetadata({ params, searchParams }: CityCategoryPageProps): Promise<Metadata> {
  const { slug, category: categorySlug } = await params;
  const city = getCityDirectoryPage(slug);
  const category = getDirectoryCategory(categorySlug);
  if (!city || !category) {
    return { title: "Directory page not found", robots: { index: false, follow: false } };
  }

  const requestedPage = parseDirectoryPage((await searchParams)?.page);
  const listings = await loadListings(city.slug, category.slug);
  const pagination = requestedPage ? paginateDirectoryItems(listings, requestedPage) : null;
  const indexable = Boolean(
    pagination?.valid && listings.length >= MIN_INDEXABLE_DIRECTORY_RESULTS,
  );
  const baseHref = getCityCategoryHref(city.slug, category.slug);
  const canonical = requestedPage ? paginatedDirectoryHref(baseHref, requestedPage) : baseHref;
  const title = requestedPage && requestedPage > 1
    ? `${category.name} in ${city.name} - Page ${requestedPage}`
    : `${category.name} in ${city.name}`;
  const description = `Browse ${listings.length} reviewed ${category.name.toLowerCase()} profiles in ${city.name}. Compare source-checked business facts and contact providers directly.`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: indexable, follow: true },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${canonical}`,
      siteName: "NepaliDirectory",
      locale: "en_US",
      type: "website",
      images: [{ url: city.image, width: 1800, height: 780, alt: `${category.name} in ${city.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [city.image],
    },
  };
}

export default async function CityCategoryPage({ params, searchParams }: CityCategoryPageProps) {
  const { slug, category: categorySlug } = await params;
  const city = getCityDirectoryPage(slug);
  const category = getDirectoryCategory(categorySlug);
  if (!city || !category) notFound();

  const requestedPage = parseDirectoryPage((await searchParams)?.page);
  if (!requestedPage) notFound();
  const listings = await loadListings(city.slug, category.slug);
  if (listings.length < MIN_INDEXABLE_DIRECTORY_RESULTS) notFound();
  const pagination = paginateDirectoryItems(listings, requestedPage);
  if (!pagination.valid) notFound();

  const baseHref = getCityCategoryHref(city.slug, category.slug);
  const canonicalPath = paginatedDirectoryHref(baseHref, requestedPage);
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  const cityDetail = getCityEditorialDetail(city.slug);
  const itemListJsonLd = buildListingItemListJsonLd(
    `${category.name} in ${city.name}`,
    canonicalUrl,
    pagination.items,
    (requestedPage - 1) * DIRECTORY_PAGE_SIZE,
  );
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: city.name, url: `${siteUrl}${city.href}` },
    { name: category.name, url: canonicalUrl },
  ]);
  const faqItems = [
    {
      question: `How are ${category.name.toLowerCase()} profiles selected for this ${city.name} page?`,
      answer: `Only active profiles with a reviewed description, usable contact route, auditable source and completed human publication review appear here. The list is alphabetical, not a paid or quality ranking.`,
    },
    {
      question: `Should I confirm details before contacting a ${city.name} business?`,
      answer: "Yes. Confirm current hours, availability, prices, credentials and service coverage directly with the business before booking, travelling or paying.",
    },
  ];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd([itemListJsonLd, breadcrumbJsonLd, faqJsonLd]),
        }}
      />
      <Breadcrumbs items={[{ label: city.name, href: city.href }, { label: category.name }]} />

      <section className="page-head">
        <div className="container">
          <span className="eyebrow">Reviewed local directory</span>
          <h1>{category.name} in {city.name}</h1>
          <p>
            Browse {listings.length} profiles that currently pass NepaliDirectory&apos;s source,
            contact, content and publication checks. Results are alphabetical and are not a claim
            that one provider is best.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="answer-summary">
            <h2>How to compare {category.name.toLowerCase()} in {city.name}</h2>
            <p>{category.quickAnswer}</p>
            <p>
              Common search areas include {cityDetail.localAreas.slice(0, 5).join(", ")}. Confirm
              whether the provider covers your exact area before arranging a visit or service.
            </p>
          </div>

          <SectionHeader
            title={`Reviewed ${category.name.toLowerCase()} profiles`}
            description="Each public profile passed the same publication gate. No unsupported ratings or winner claims determine this order."
          />
          <div className="city-profile-grid">
            {pagination.items.map((listing) => (
              <article className="answer-summary" key={listing.slug}>
                <span className="eyebrow"><MapPin size={13} aria-hidden /> {listing.neighborhood ?? listing.area}</span>
                <h2><Link href={getBusinessHref(listing.slug)}>{listing.name}</Link></h2>
                <p>{listingDescription(listing)}</p>
                <div className="business-card__amenities">
                  <span><BadgeCheck size={12} aria-hidden /> {listingVerificationLabel(listing)}</span>
                  {listing.services?.slice(0, 3).map((service) => <span key={service}>{service}</span>)}
                </div>
              </article>
            ))}
          </div>
          <DirectoryPagination
            baseHref={baseHref}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
          />
        </div>
      </section>

      <section className="section section--soft">
        <div className="container article-faq">
          <h2>Questions about this local directory page</h2>
          {faqItems.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
          <p><Link href={routes.directoryMethodology}>Read the full publication methodology</Link></p>
        </div>
      </section>
    </main>
  );
}
