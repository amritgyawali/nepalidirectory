import { MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { businesses } from "@/lib/data";

export default function MapPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: "Map & Directions" }]} />
      <section className="map-page">
        <div className="container map-page__grid">
          <div className="map-page__canvas">
            {businesses.slice(0, 5).map((business, index) => (
              <span key={business.slug} style={{ left: `${18 + index * 14}%`, top: `${28 + index * 9}%` }}>
                <MapPin size={24} fill="#FFD400" />
              </span>
            ))}
          </div>
          <aside>
            <h1>Map directions</h1>
            <p>Explore verified listings around Kathmandu Valley and open individual profiles for directions.</p>
            {businesses.slice(0, 5).map((business) => (
              <div className="mini-listing" key={business.slug}>
                <strong>{business.name}</strong>
                <span>{business.address}</span>
              </div>
            ))}
          </aside>
        </div>
      </section>
    </main>
  );
}
