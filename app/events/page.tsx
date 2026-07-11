import { PageHero } from "@/components/directory/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function EventsPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: "Local Events" }]} />
      <PageHero title="Local events" subtitle="Reviewed community and business events with clear organizers, dates, venues and source details." />
      <section className="section">
        <div className="container qa-list">
          <article className="answer-summary">
            <span>Publication status</span>
            <h2>No source-verified events are live right now</h2>
            <p>
              Events appear only after the organizer, venue, date, public source and contact route
              can be checked. Nepali Directory does not publish sample event names as real listings.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
