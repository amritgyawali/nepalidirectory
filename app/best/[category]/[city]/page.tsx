import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, MapPin, Phone, Star } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Stars } from "@/components/ui/Stars";
import { siteUrl } from "@/lib/blog";
import { routes } from "@/lib/routes";
import {
  buildBreadcrumbJsonLd,
  buildEvergreenItemListJsonLd,
  getEvergreenPage,
  getEvergreenPages,
  getEvergreenUrl,
} from "@/lib/seo-auto";

type PageProps = {
  params: Promise<{ category: string; city: string }>;
};

export const revalidate = 86400;

export function generateStaticParams() {
  return getEvergreenPages().map((page) => ({ category: page.categorySlug, city: page.citySlug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, city } = await params;
  const page = getEvergreenPage(category, city);
  if (!page) return { title: "Page not found", robots: { index: false, follow: false } };

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: page.href },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: getEvergreenUrl(page),
      siteName: "Nepali Directory",
      type: "website",
    },
  };
}

export default async function EvergreenBestPage({ params }: PageProps) {
  const { category, city } = await params;
  const page = getEvergreenPage(category, city);
  if (!page) notFound();

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "Best Businesses", url: `${siteUrl}${routes.bestBusinesses}` },
    { name: page.cityName, url: `${siteUrl}/city/${page.citySlug}` },
    { name: page.title, url: getEvergreenUrl(page) },
  ]);
  const itemListJsonLd = buildEvergreenItemListJsonLd(page);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, itemListJsonLd]) }}
      />
      <Breadcrumbs
        items={[
          { label: "Best Businesses", href: routes.bestBusinesses },
          { label: page.cityName, href: `/city/${page.citySlug}` },
          { label: page.categoryName },
        ]}
      />
      <section className="page-head">
        <div className="container">
          <span className="eyebrow">Updated {page.updatedLabel}</span>
          <h1 className="page-title">{page.title}</h1>
          <p className="page-copy">{page.intro}</p>
          <div className="stats-grid stats-grid--compact">
            <div>
              <strong>{page.listingCount}</strong>
              <span>qualified listings</span>
            </div>
            <div>
              <strong>{page.averageRating.toFixed(1)}</strong>
              <span>average raw rating</span>
            </div>
            <div>
              <strong>{page.qualityAverage.toFixed(0)}</strong>
              <span>avg quality score</span>
            </div>
            <div>
              <strong>{page.notableLocalities.length}</strong>
              <span>local areas covered</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="answer-summary">
            <h2>Top 5 {page.categoryName} in {page.cityName}</h2>
            <p>
              This answer block is rendered in server HTML from structured listing data. Confirm
              hours, exact prices and availability with the business before visiting.
            </p>
          </div>
          <div className="responsive-table">
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Business</th>
                  <th>Area</th>
                  <th>Rating</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {page.listings.slice(0, 5).map((business, index) => (
                  <tr key={business.slug} id={`rank-${index + 1}`}>
                    <td>
                      <Award size={15} aria-hidden />
                      {index + 1}
                    </td>
                    <td>
                      <strong>{business.name}</strong>
                      <span>{business.categories.join(", ")}</span>
                    </td>
                    <td>
                      <MapPin size={15} aria-hidden />
                      {business.neighborhood ?? business.area}
                    </td>
                    <td>
                      <Star size={15} aria-hidden />
                      {business.rating.toFixed(1)} ({business.reviews})
                    </td>
                    <td>
                      <a href={`tel:${business.phone.replace(/[^0-9+]/g, "")}`}>
                        <Phone size={15} aria-hidden />
                        {business.phone}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="evergreen-listings">
            {page.listings.map((business, index) => (
              <article key={business.slug}>
                <span>#{index + 1}</span>
                <div>
                  <h2>{business.name}</h2>
                  <p>{business.quote}</p>
                  <div className="business-card__rating">
                    <strong>{business.rating.toFixed(1)}</strong>
                    <Stars rating={business.rating} />
                    <Link href={routes.writeReview}>({business.reviews} reviews)</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
