import Link from "next/link";
import { BadgeCheck, MapPin } from "lucide-react";
import { RelatedGuideLinks } from "@/components/content/RelatedGuideLinks";
import { CategoryTile } from "@/components/directory/CategoryTile";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getCityEditorialDetail, type CityDirectoryPage } from "@/lib/city-pages";
import { categories } from "@/lib/data";
import { getDirectoryCategory } from "@/lib/directory-categories";
import { getGuidesForCity } from "@/lib/content-clusters";
import type { Listing } from "@/lib/enrich";
import { listingDescription } from "@/lib/public-listings";
import { getBusinessHref, getSearchHref, routes } from "@/lib/routes";

type CityLandingPageProps = {
  city: CityDirectoryPage;
  nearbyCities: CityDirectoryPage[];
  listings: Listing[];
};

function getCategoryDestination(name: string, city: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return getDirectoryCategory(slug)?.href ?? getSearchHref(name, city);
}

export function CityLandingPageView({ city, nearbyCities, listings }: CityLandingPageProps) {
  const detail = getCityEditorialDetail(city.slug);
  const relatedGuides = getGuidesForCity(city.slug);
  return (
    <main>
      <Breadcrumbs items={[{ label: city.province, href: routes.province }, { label: city.name }]} />
      <section
        className="city-directory-hero"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(26, 26, 26, 0.42), rgba(26, 26, 26, 0.78)), url("${city.image}")`
        }}
      >
        <div className="container">
          <h1>{city.title}</h1>
          <p>{city.description}</p>
          <div className="stats-grid">
            <div>
              <strong>{listings.length}</strong>
              <span>qualified public profiles</span>
            </div>
            <div>
              <strong>{detail.localAreas.length}</strong>
              <span>named local areas</span>
            </div>
            <div>
              <strong>{city.popularSearches.length}</strong>
              <span>service paths</span>
            </div>
            <div>
              <strong>Reviewed</strong>
              <span>publication gate</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="answer-summary answer-summary--city">
            <h2>Quick city answer</h2>
            <p>{city.highlight}</p>
            <div className="seo-link-strip">
              {city.popularSearches.map((search) => (
                <Link key={search} href={getSearchHref(search, city.name)}>{search}</Link>
              ))}
            </div>
          </div>

          <div className="city-editorial-copy">
            {detail.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <h2 className="compact-title">Areas people use when searching {city.name}</h2>
          <div className="seo-link-strip" aria-label={`${city.name} local areas`}>
            {detail.localAreas.map((area) => (
              <Link key={area} href={getSearchHref("businesses", area)}>{area}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeader title={`How to compare services in ${city.name}`} />
          <div className="seo-answer-grid">
            {detail.searchTips.map((tip) => (
              <article className="answer-summary" key={tip.title}>
                <h2>{tip.title}</h2>
                <p>{tip.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader title={`Browse ${city.name} categories`} />
          <div className="home-category-grid">
            {categories.map((category) => (
              <CategoryTile
                key={category.name}
                {...category}
                count={undefined}
                href={getCategoryDestination(category.name, city.name)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeader
            title={`Qualified ${city.name} profiles`}
            description="Only active records that pass source, location, category and completeness checks appear here."
            action={{ label: "Search directory", href: getSearchHref("businesses", city.name) }}
          />
          {listings.length ? (
            <div className="city-profile-grid">
              {listings.map((listing) => (
                <article className="answer-summary" key={listing.slug}>
                  <span className="eyebrow"><MapPin size={13} aria-hidden /> {listing.neighborhood ?? listing.area}</span>
                  <h2><Link href={getBusinessHref(listing.slug)}>{listing.name}</Link></h2>
                  <p>{listingDescription(listing)}</p>
                  <div className="business-card__amenities">
                    {listing.verified ? <span><BadgeCheck size={12} aria-hidden /> Reviewed record</span> : null}
                    {listing.services?.slice(0, 3).map((service) => <span key={service}>{service}</span>)}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="answer-summary">
              <h2>No qualified public profiles yet</h2>
              <p>
                Nepali Directory does not substitute demo businesses from another city. Use the
                service guides above while local records complete publication review.
              </p>
              <Link className="button button--primary" href={routes.claimListing}>Add a verified business</Link>
            </div>
          )}

          <h2 className="compact-title nearby-title">Nearby city pages</h2>
          <div className="city-link-grid">
            {nearbyCities.map((nearbyCity) => (
              <Link key={nearbyCity.slug} href={nearbyCity.href}>{nearbyCity.name}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container article-faq">
          <h2>Questions about finding businesses in {city.name}</h2>
          {detail.faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <RelatedGuideLinks title={`From our ${city.name} guides`} posts={relatedGuides} />
    </main>
  );
}
