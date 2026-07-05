import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { routes } from "@/lib/routes";

export default function QuestionDetailPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: "Q&A Hub", href: routes.qa }, { label: "Annapurna Circuit" }]} />
      <section className="section">
        <div className="container prose-card">
          <span className="eyebrow">Travel</span>
          <h1 className="page-title">Best season for Annapurna Circuit if I want fewer crowds?</h1>
          <p>
            I can travel in October, November or early December. I want clear mountain views but
            would prefer not to hit the busiest teahouse weeks.
          </p>
          <div className="answer-card">
            <strong>Best answer</strong>
            <p>
              Late November is a strong choice for fewer crowds and clear skies. Expect colder
              mornings, especially near Manang and Thorong La, and keep one buffer day for weather.
            </p>
          </div>
          <Link className="button button--primary" href={routes.askQuestion}>
            Add your answer
          </Link>
        </div>
      </section>
    </main>
  );
}
