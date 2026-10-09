import { CityCard } from "@/components/directory/CityCard";
import { PageHero } from "@/components/directory/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { cities } from "@/lib/data";
import { getIndexableHubSlugsOrNone, isLiveHubHref } from "@/lib/indexable-hubs";

export default async function ProvincePage() {
  const hubs = await getIndexableHubSlugsOrNone();
  return (
    <main>
      <Breadcrumbs items={[{ label: "Bagmati Province" }]} />
      <PageHero
        title="Bagmati Province directory"
        subtitle="Explore businesses and city guides across Kathmandu, Lalitpur, Bhaktapur and nearby districts."
      />
      <section className="section">
        <div className="container home-city-grid">
          {cities.filter((city) => isLiveHubHref(city.href, hubs)).map((city) => (
            <CityCard key={city.name} {...city} />
          ))}
        </div>
      </section>
    </main>
  );
}
