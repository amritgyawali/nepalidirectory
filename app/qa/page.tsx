import Link from "next/link";
import { PageHero } from "@/components/directory/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { questions } from "@/lib/data";
import { routes } from "@/lib/routes";

export default function QAPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: "Q&A Hub" }]} />
      <PageHero
        title="Community Q&A"
        subtitle="Ask practical local questions and get answers from people who know the city, service or business."
        cta={{ label: "Ask a question", href: routes.askQuestion }}
        secondary={{ label: "Community index", href: routes.qaCommunity }}
      />
      <section className="section">
        <div className="container qa-list">
          {questions.map((question) => (
            <Link key={question.title} href={question.href}>
              <span>{question.topic}</span>
              <h2>{question.title}</h2>
              <p>{question.excerpt}</p>
              <small>{question.answerLabel}</small>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
