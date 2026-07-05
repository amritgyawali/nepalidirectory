import { PageHero } from "@/components/directory/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { routes } from "@/lib/routes";

export default function ProfilePage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: "User Profile" }]} />
      <PageHero
        title="Amrit's profile"
        subtitle="Saved businesses, reviews, questions and listing activity in one place."
        cta={{ label: "Account settings", href: routes.account }}
      />
      <section className="section">
        <div className="container profile-grid">
          {["Saved places", "Reviews written", "Questions asked", "Business claims"].map((item, index) => (
            <article className="metric-card" key={item}>
              <strong>{[18, 7, 4, 1][index]}</strong>
              <span>{item}</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
