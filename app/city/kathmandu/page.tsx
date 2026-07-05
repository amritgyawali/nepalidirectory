import type { Metadata } from "next";
import { CityLandingPageView } from "@/components/directory/CityLandingPage";
import { cityDirectoryPages, getCityDirectoryPage } from "@/lib/city-pages";
import { siteUrl } from "@/lib/blog";
import { buildWebPageJsonLd, uniqueKeywords } from "@/lib/seo";

const city = getCityDirectoryPage("kathmandu")!;
const keywords = uniqueKeywords([...city.keywords, ...city.popularSearches, city.name, city.province]);

export const metadata: Metadata = {
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

export default function KathmanduCityPage() {
  const nearbyCities = cityDirectoryPages.filter((candidate) => candidate.slug !== city.slug).slice(0, 7);
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <CityLandingPageView city={city} nearbyCities={nearbyCities} />
    </>
  );
}
