import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FillImage } from "@/components/ui/FillImage";
import { siteUrl } from "@/lib/blog";
import { getCityEditorialDetail } from "@/lib/city-pages";
import { getIndexableCityPages } from "@/lib/indexable-hubs";
import { routes } from "@/lib/routes";
import { buildWebPageJsonLd, serializeJsonLd } from "@/lib/seo";
import { buildFaqPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Nepal Business Directory by City",
  description: "Browse reviewed city guides for Kathmandu, Pokhara, Lalitpur, Bhaktapur, Chitwan, Biratnagar, Butwal and more Nepal cities.",
  alternates: { canonical: "/city" },
  openGraph: {
    title: "Nepal Business Directory by City",
    description: "Choose a city, understand its local search areas and open qualified business profiles.",
    url: `${siteUrl}/city`,
    siteName: "NepaliDirectory",
    type: "website",
    images: [{ url: "/nepali-directory-og.png", width: 1729, height: 909, alt: "Nepali Directory city guides" }],
  },
};

export const revalidate = 300;

const faqs = [
  {
    question: "Which Nepal cities does NepaliDirectory cover?",
    answer:
      "City guides cover Kathmandu, Lalitpur and Bhaktapur in the Kathmandu Valley, plus Pokhara, Chitwan, Bharatpur, Biratnagar, Dharan, Butwal, Birgunj and Nepalgunj. A city page is published only once it has enough reviewed business profiles to be useful.",
  },
  {
    question: "Why is my city not listed yet?",
    answer:
      "Each city hub needs a minimum number of active, reviewed listings before it goes live, so visitors never land on an empty or sample-filled page. Business owners can speed this up by claiming or adding their listing.",
  },
  {
    question: "Should I search by city or by neighborhood?",
    answer:
      "Start with the city, then narrow to a named area such as Thamel, Lakeside or Patan. Travel time, service coverage and opening hours often matter more than the city name, so confirm that a business serves your exact address.",
  },
  {
    question: "Are businesses in city guides ranked by payment?",
    answer:
      "No. Public results only include profiles with active status, a reviewed location and category, adequate completeness and a trustworthy data source. Paid plans never change the publication review.",
  },
];

export default async function CityIndexPage() {
  // Cities below the listing threshold 404 until they qualify, so they are not linked here.
  const cityDirectoryPages = await getIndexableCityPages();
  const provinces = [...new Set(cityDirectoryPages.map((city) => city.province))];
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Nepal city business directories",
    numberOfItems: cityDirectoryPages.length,
    itemListElement: cityDirectoryPages.map((city, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "City",
        name: city.name,
        url: `${siteUrl}${city.href}`,
        containedInPlace: { "@type": "AdministrativeArea", name: city.province },
      },
    })),
  };
  const collectionPage = {
    ...buildWebPageJsonLd({
      name: "Nepal Business Directory by City",
      description: "Browse reviewed city guides and qualified public business profiles across Nepal city hubs.",
      url: `${siteUrl}/city`,
      breadcrumb: true,
      keywords: ["Nepal business directory by city", "Kathmandu businesses", "Pokhara businesses", "Nepal city guides"],
      dateModified: "2026-07-11",
    }),
    "@type": "CollectionPage",
    // An ItemList with no entries is invalid structured data.
    mainEntity: cityDirectoryPages.length ? itemList : undefined,
  };
  const faqJsonLd = buildFaqPageJsonLd(faqs, `${siteUrl}/city`);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(cityDirectoryPages.length ? [collectionPage, itemList, faqJsonLd] : [collectionPage, faqJsonLd]) }} />
      <Breadcrumbs items={[{ label: "Cities" }]} currentPath={routes.city} />
      <section className="page-head">
        <div className="container">
          <span className="eyebrow">Reviewed city hubs</span>
          <h1 className="page-title">Find local businesses by city in Nepal</h1>
          <p className="page-copy">
            Choose a city to see locally specific search guidance, named areas, category paths and
            business profiles that have passed publication review. The directory never fills a
            city page with sample providers from somewhere else.
          </p>
          <div className="seo-hero__actions">
            <Link className="button button--primary" href={routes.categories}>Browse categories</Link>
            <Link className="button button--outline" href={routes.compareBusiness}>Compare services</Link>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="city-index-grid">
            {cityDirectoryPages.map((city) => (
              <Link className="city-index-card" href={city.href} key={city.slug}>
                <span className="city-index-card__image">
                  <FillImage src={city.image} alt={city.imageAlt} sizes="(max-width: 760px) 100vw, 340px" />
                </span>
                <span className="city-index-card__body">
                  <small><MapPin size={13} aria-hidden /> {city.province}</small>
                  <strong>{city.name}</strong>
                  <span>{city.description}</span>
                  <span>Key areas: {getCityEditorialDetail(city.slug).localAreas.join(", ")}</span>
                  <em>Open city guide <ArrowRight size={14} aria-hidden /></em>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="compact-title">Cities grouped by province</h2>
          <div className="seo-answer-grid">
            {provinces.map((province) => (
              <article className="answer-summary" key={province}>
                <h3>{province}</h3>
                <div className="seo-link-strip">
                  {cityDirectoryPages.filter((city) => city.province === province).map((city) => (
                    <Link href={city.href} key={city.slug}>{city.name}</Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container seo-answer-grid">
          <article className="answer-summary">
            <h2>How city profiles qualify</h2>
            <p>Public results require active status, reviewed location and category, adequate completeness and meaningful source provenance.</p>
          </article>
          <article className="answer-summary">
            <h2>How to use a city guide</h2>
            <p>Start with the service and a specific area, compare the same evidence, then confirm current hours, price and availability directly.</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container article-faq">
          <h2>City directory questions</h2>
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
