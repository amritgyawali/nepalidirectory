import { CityCard } from "@/components/directory/CityCard";
import { PageHero } from "@/components/directory/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { cities } from "@/lib/data";

export default function ProvincePage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: "Bagmati Province" }]} />
      <PageHero
        title="Bagmati Province directory"
        subtitle="Explore businesses and city guides across Kathmandu, Lalitpur, Bhaktapur and nearby districts."
      />
      <section className="section">
        <div className="container home-city-grid">
          {cities.map((city) => (
            <CityCard key={city.name} {...city} />
          ))}
        </div>
      </section>
    </main>
  );
}
