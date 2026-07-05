import { Phone, Search } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/directory/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { peopleProfiles } from "@/lib/data";
import { routes } from "@/lib/routes";

export default function FindPeoplePage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: "Find People" }]} />
      <PageHero
        title="Find people and professionals"
        subtitle="Search public professional profiles, service providers and business contacts listed in the directory."
      />
      <section className="section">
        <div className="container people-search">
          <form action={routes.search}>
            <label>
              <Search size={18} aria-hidden />
              <span className="sr-only">Search people</span>
              <input name="q" placeholder="Search by name, role or business" />
            </label>
            <button className="button button--primary" type="submit">
              Search
            </button>
          </form>
          <div className="people-grid">
            {peopleProfiles.map((person) => (
              <article key={`${person.name}-${person.business}`}>
                <div>
                  <strong>{person.name}</strong>
                  <span>{person.role}</span>
                  <small>{person.business} · {person.location}</small>
                </div>
                <div className="people-grid__actions">
                  <a href={`tel:${person.phone.replace(/\D/g, "")}`}>
                    <Phone size={15} aria-hidden />
                    Call
                  </a>
                  <Link href={person.href}>View listing</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
