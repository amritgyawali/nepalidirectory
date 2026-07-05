import { PageHero } from "@/components/directory/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { questions } from "@/lib/data";
import { routes } from "@/lib/routes";

export default function RestaurantQAPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: "Restaurants", href: routes.search }, { label: "Q&A" }]} />
      <PageHero
        title="Restaurant Q&A"
        subtitle="Ask about reservations, group dining, dietary options, menus and neighborhood restaurant recommendations."
        cta={{ label: "Ask restaurant question", href: routes.askQuestion }}
      />
      <section className="section">
        <div className="container qa-list">
          {questions.map((question) => (
            <article key={question.title}>
              <span>{question.topic}</span>
              <h2>{question.title}</h2>
              <p>{question.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
