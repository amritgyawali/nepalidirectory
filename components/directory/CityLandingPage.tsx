import Link from "next/link";
import { BusinessCard } from "@/components/directory/BusinessCard";
import { CategoryTile } from "@/components/directory/CategoryTile";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { CityDirectoryPage } from "@/lib/city-pages";
import { businesses, categories } from "@/lib/data";
import { routes } from "@/lib/routes";

type CityLandingPageProps = {
  city: CityDirectoryPage;
  nearbyCities: CityDirectoryPage[];
};

export function CityLandingPageView({ city, nearbyCities }: CityLandingPageProps) {
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
              <strong>{city.listings}</strong>
              <span>active listings</span>
            </div>
            <div>
              <strong>{city.neighborhoods}</strong>
              <span>local areas</span>
            </div>
            <div>
              <strong>{city.rating}</strong>
              <span>avg rating</span>
            </div>
            <div>
              <strong>24h</strong>
              <span>updated listings</span>
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
                <Link key={search} href={routes.search}>
                  {search}
                </Link>
              ))}
            </div>
          </div>
          <SectionHeader title={`Top categories in ${city.name}`} />
          <div className="home-category-grid">
            {categories.map((category) => (
              <CategoryTile key={category.name} {...category} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeader
            title={`Featured ${city.name} listings`}
            description="Useful local businesses with complete contact details, ratings and practical service notes."
            action={{ label: "View all", href: routes.search }}
          />
          {businesses.slice(0, 4).map((business) => (
            <BusinessCard key={business.slug} business={{ ...business, area: city.name }} />
          ))}
          <h2 className="compact-title nearby-title">Nearby city pages</h2>
          <div className="city-link-grid">
            {nearbyCities.map((nearbyCity) => (
              <Link key={nearbyCity.slug} href={nearbyCity.href}>
                {nearbyCity.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
