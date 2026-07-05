import type { Metadata } from "next";
import { GuideCard } from "@/components/content/GuideCard";
import { PageHero } from "@/components/directory/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getSortedCompareCategories } from "@/lib/compare";
import { siteUrl } from "@/lib/blog";
import { routes } from "@/lib/routes";
import { buildCompareKeywords, buildWebPageJsonLd, publisher, uniqueKeywords } from "@/lib/seo";

const sortedCompareCategories = getSortedCompareCategories();
const compareKeywords = uniqueKeywords([
  "compare businesses Nepal",
  "best businesses Nepal",
  "compare hotels Nepal",
  "compare photographers Nepal",
  "Nepal business comparison",
  "compare restaurants Kathmandu",
  "compare home services Kathmandu",
  "compare clinics Kathmandu",
  "compare contractors Nepal",
  ...sortedCompareCategories.flatMap((category) => buildCompareKeywords(category))
]);

export const metadata: Metadata = {
  title: "Compare Businesses in Nepal: Hotels, Photography, Restaurants and Services",
  description:
    "Compare Nepal businesses by rating, price, reviews and best fit, including photography, hotels, restaurants, clinics, contractors and home services.",
  keywords: compareKeywords,
  alternates: {
    canonical: routes.compareBusiness
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  openGraph: {
    title: "Compare Businesses in Nepal: Hotels, Photography, Restaurants and Services",
    description:
      "Side-by-side comparisons for popular business categories across Nepal.",
    url: `${siteUrl}${routes.compareBusiness}`,
    siteName: "Nepali Directory",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: sortedCompareCategories[0].image,
        width: 1200,
        height: 675,
        alt: "Nepali Directory business comparison guides"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Businesses in Nepal",
    description: "Compare Nepal businesses by rating, price, strengths and best fit.",
    images: [sortedCompareCategories[0].image]
  },
  other: {
    "content-language": "en",
    "geo.region": "NP",
    "geo.placename": "Nepal",
    "search-intent": "commercial investigation, local comparison, answer engine"
  }
};

export default function CompareBusinessPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Nepali Directory Business Comparison Categories",
    itemListElement: sortedCompareCategories.map((category, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}${category.href}`,
      name: category.title
    }))
  };
  const collectionJsonLd = {
    ...buildWebPageJsonLd({
      name: "Compare Businesses in Nepal",
      description:
        "Compare Nepal businesses by rating, price, reviews and best fit, including photography, hotels, restaurants, clinics, contractors and home services.",
      url: `${siteUrl}${routes.compareBusiness}`,
      keywords: compareKeywords,
      dateModified: sortedCompareCategories[0].updatedAt
    }),
    "@type": "CollectionPage",
    mainEntity: itemListJsonLd,
    reviewedBy: publisher
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([collectionJsonLd, itemListJsonLd]) }}
      />
      <Breadcrumbs items={[{ label: "Compare Business" }]} />
      <PageHero
        title="Compare businesses before you choose"
        subtitle="Side-by-side local comparisons for photography, hotels, restaurants, home services, healthcare clinics, contractors and more."
        cta={{ label: "Browse all categories", href: routes.categories }}
      />
      <section className="section compare-index">
        <div className="container">
          <div className="compare-grid">
            {sortedCompareCategories.map((category) => (
              <GuideCard
                key={category.slug}
                href={category.href}
                title={category.title}
                category={category.category}
                excerpt={category.excerpt}
                image={category.image}
                imageAlt={category.imageAlt}
                meta={category.readTime}
                actionLabel="Compare now"
                className="compare-card"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
