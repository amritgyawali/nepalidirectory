import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { buildPublicPageMetadata } from "@/lib/site-metadata";
import { routes } from "@/lib/routes";
import { siteUrl } from "@/lib/blog";
import { buildBreadcrumbJsonLd } from "@/lib/seo-auto/schema";
import { buildWebPageJsonLd, uniqueKeywords } from "@/lib/seo";

const canonicalUrl = `${siteUrl}/questions/trekking-annapurna`;
const question = "Best season for Annapurna Circuit if I want fewer crowds?";
const questionBody =
  "I can travel in October, November or early December. I want clear mountain views but would prefer not to hit the busiest teahouse weeks.";
const answerText =
  "Late November is a strong choice for fewer crowds and clear skies. Expect colder mornings, especially near Manang and Thorong La, and keep one buffer day for weather.";

export const metadata: Metadata = buildPublicPageMetadata({
  title: "Best Time for the Annapurna Circuit With Fewer Crowds",
  description:
    "Compare October, November and early December conditions for the Annapurna Circuit, including crowds, cold, visibility and weather buffers.",
  path: "/questions/trekking-annapurna",
});

export default function QuestionDetailPage() {
  const keywords = uniqueKeywords(["Annapurna Circuit", "Nepal trekking", "trekking season", "Thorong La"]);
  const webPageJsonLd = buildWebPageJsonLd({
    name: question,
    description: questionBody,
    url: canonicalUrl,
    keywords,
    dateModified: "2026-07-16",
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Q&A Hub", url: `${siteUrl}${routes.qa}` },
    { name: "Annapurna Circuit", url: canonicalUrl },
  ]);
  const qaPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: question,
      text: questionBody,
      answerCount: 1,
      acceptedAnswer: {
        "@type": "Answer",
        text: answerText,
        url: canonicalUrl,
      },
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([webPageJsonLd, breadcrumbJsonLd, qaPageJsonLd]) }}
      />
      <Breadcrumbs items={[{ label: "Q&A Hub", href: routes.qa }, { label: "Annapurna Circuit" }]} />
      <section className="section">
        <div className="container prose-card">
          <span className="eyebrow">Travel</span>
          <h1 className="page-title">{question}</h1>
          <p>{questionBody}</p>
          <div className="answer-card">
            <strong>Best answer</strong>
            <p>{answerText}</p>
          </div>
          <Link className="button button--primary" href={routes.askQuestion}>
            Add your answer
          </Link>
        </div>
      </section>
    </main>
  );
}
