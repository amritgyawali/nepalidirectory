import { PageHero } from "@/components/directory/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { categoryGroups } from "@/lib/data";
import { routes } from "@/lib/routes";

export default function QACommunityPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: "Q&A Hub", href: routes.qa }, { label: "Community" }]} />
      <PageHero
        title="Community index"
        subtitle="Browse answer topics by travel, restaurants, home services, healthcare and city living."
        cta={{ label: "Ask a question", href: routes.askQuestion }}
      />
      <section className="section">
        <div className="container category-groups">
          {categoryGroups.map((group) => (
            <section className="category-group" key={group.title}>
              <h2>{group.title}</h2>
              <p>{group.description}</p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
