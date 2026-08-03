import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { CityLandingPageView } from "@/components/directory/CityLandingPage";
import { cityDirectoryPages, getCityDirectoryPage, getCityEditorialDetail } from "@/lib/city-pages";
import { siteUrl } from "@/lib/blog";
import { directoryCategories, listingMatchesDirectoryCategory } from "@/lib/directory-categories";
import { getIndexableListings, listingMatchesCity } from "@/lib/public-listings";
import { buildWebPageJsonLd, serializeJsonLd, uniqueKeywords } from "@/lib/seo";
import { buildListingItemListJsonLd } from "@/lib/seo-auto";
import { getCityCategoryHref } from "@/lib/routes";
import {
  DIRECTORY_PAGE_SIZE,
  MIN_INDEXABLE_DIRECTORY_RESULTS,
  paginateDirectoryItems,
  paginatedDirectoryHref,
  parseDirectoryPage,
} from "@/lib/directory-pagination";

type CityPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
};

export const revalidate = 300;

export function generateStaticParams() {
  return cityDirectoryPages.map((city) => ({ slug: city.slug }));
}

const loadCityListings = cache(async (slug: string) =>
  (await getIndexableListings())
    .filter((listing) => listingMatchesCity(listing, slug))
    .sort((a, b) => a.name.localeCompare(b.name, "en")),
);

export async function generateMetadata({ params, searchParams }: CityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityDirectoryPage(slug);

  if (!city) {
    return { title: "City not found", robots: { index: false, follow: false } };
  }

  const requestedPage = parseDirectoryPage((await searchParams)?.page);
  const listings = await loadCityListings(city.slug);
  const pagination = requestedPage ? paginateDirectoryItems(listings, requestedPage) : null;
  const indexable = Boolean(
    pagination?.valid && listings.length >= MIN_INDEXABLE_DIRECTORY_RESULTS,
  );
  const canonical = requestedPage ? paginatedDirectoryHref(city.href, requestedPage) : city.href;
  const title = requestedPage && requestedPage > 1
    ? `${city.seoTitle} - Page ${requestedPage}`
    : city.seoTitle;

  return {
    title,
    description: city.description,
    alternates: { canonical },
    robots: {
      index: indexable,
      follow: true,
      googleBot: { index: indexable, follow: true, "max-image-preview": "large" },
    },
    openGraph: {
      title,
      description: city.description,
      url: `${siteUrl}${canonical}`,
      siteName: "NepaliDirectory",
      locale: "en_US",
      type: "website",
      images: [{ url: city.image, width: 1800, height: 780, alt: city.imageAlt }]
    },
    twitter: {
      card: "summary_large_image",
      title: city.seoTitle,
      description: city.description,
      images: [city.image]
    }
  };
}

export default async function CityPage({ params, searchParams }: CityPageProps) {
  const { slug } = await params;
  const city = getCityDirectoryPage(slug);

  if (!city) {
    notFound();
  }

  const requestedPage = parseDirectoryPage((await searchParams)?.page);
  if (!requestedPage) notFound();
  const nearbyCities = cityDirectoryPages.filter((candidate) => candidate.slug !== city.slug).slice(0, 7);
  const listings = await loadCityListings(city.slug);
  const pagination = paginateDirectoryItems(listings, requestedPage);
  if (!pagination.valid) notFound();
  const cityCategoryLinks = Object.fromEntries(
    directoryCategories
      .filter(
        (category) =>
          listings.filter((listing) => listingMatchesDirectoryCategory(listing, category)).length >=
          MIN_INDEXABLE_DIRECTORY_RESULTS,
      )
      .map((category) => [category.slug, getCityCategoryHref(city.slug, category.slug)]),
  );
  const canonicalPath = paginatedDirectoryHref(city.href, requestedPage);
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  const detail = getCityEditorialDetail(city.slug);
  const keywords = uniqueKeywords([...city.keywords, ...city.popularSearches, city.name, city.province]);
  const webPageJsonLd = {
    ...buildWebPageJsonLd({
      name: city.seoTitle,
      description: city.description,
      url: canonicalUrl,
      keywords,
    }),
    "@type": "CollectionPage",
    about: {
      "@type": "City",
      name: city.name,
      containedInPlace: city.province
    }
  };
  const itemListJsonLd = pagination.items.length
    ? buildListingItemListJsonLd(
        `Qualified businesses in ${city.name}`,
        canonicalUrl,
        pagination.items,
        (requestedPage - 1) * DIRECTORY_PAGE_SIZE,
      )
    : null;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: detail.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd([webPageJsonLd, itemListJsonLd, faqJsonLd].filter(Boolean)) }}
      />
      <CityLandingPageView
        city={city}
        nearbyCities={nearbyCities}
        listings={pagination.items}
        totalListings={pagination.totalItems}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        cityCategoryLinks={cityCategoryLinks}
      />
    </>
  );
}
