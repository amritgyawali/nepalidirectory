import { PageHero } from "@/components/directory/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function EventsPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: "Local Events" }]} />
      <PageHero title="Local events" subtitle="Festivals, restaurant nights, business workshops and neighborhood events." />
      <section className="section">
        <div className="container qa-list">
          {["Bhaktapur food walk", "Small business marketing clinic", "Patan heritage night"].map((event) => (
            <article key={event}>
              <span>June 2026</span>
              <h2>{event}</h2>
              <p>Community event listed by local organizers and verified businesses.</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
