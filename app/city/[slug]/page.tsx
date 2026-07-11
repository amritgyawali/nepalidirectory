import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityLandingPageView } from "@/components/directory/CityLandingPage";
import { cityDirectoryPages, getCityDirectoryPage, getCityEditorialDetail } from "@/lib/city-pages";
import { siteUrl } from "@/lib/blog";
import { getIndexableListings, listingMatchesCity } from "@/lib/public-listings";
import { getBusinessHref } from "@/lib/routes";
import { buildWebPageJsonLd, uniqueKeywords } from "@/lib/seo";
import { buildListingLocalBusinessJsonLd } from "@/lib/seo-auto";

type CityPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return cityDirectoryPages.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityDirectoryPage(slug);

  if (!city) {
    return { title: "City not found", robots: { index: false, follow: false } };
  }

  const keywords = uniqueKeywords([...city.keywords, ...city.popularSearches, city.name, city.province]);

  return {
    title: city.seoTitle,
    description: city.description,
    keywords,
    alternates: { canonical: city.href },
    openGraph: {
      title: city.seoTitle,
      description: city.description,
      url: `${siteUrl}${city.href}`,
      siteName: "Nepali Directory",
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

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params;
  const city = getCityDirectoryPage(slug);

  if (!city) {
    notFound();
  }

  const nearbyCities = cityDirectoryPages.filter((candidate) => candidate.slug !== city.slug).slice(0, 7);
  const listings = (await getIndexableListings()).filter((listing) => listingMatchesCity(listing, city.slug));
  const detail = getCityEditorialDetail(city.slug);
  const keywords = uniqueKeywords([...city.keywords, ...city.popularSearches, city.name, city.province]);
  const webPageJsonLd = {
    ...buildWebPageJsonLd({
      name: city.seoTitle,
      description: city.description,
      url: `${siteUrl}${city.href}`,
      keywords,
      dateModified: "2026-06-27"
    }),
    "@type": "CollectionPage",
    about: {
      "@type": "City",
      name: city.name,
      containedInPlace: city.province
    }
  };
  const itemListJsonLd = listings.length ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Qualified businesses in ${city.name}`,
    numberOfItems: listings.length,
    itemListElement: listings.map((listing, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: buildListingLocalBusinessJsonLd(listing, `${siteUrl}${getBusinessHref(listing.slug)}`),
    })),
  } : null;
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify([webPageJsonLd, itemListJsonLd, faqJsonLd].filter(Boolean)) }}
      />
      <CityLandingPageView city={city} nearbyCities={nearbyCities} listings={listings} />
    </>
  );
}
