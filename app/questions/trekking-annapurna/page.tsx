import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { buildPublicPageMetadata } from "@/lib/site-metadata";
import { routes } from "@/lib/routes";
import { siteUrl } from "@/lib/blog";
import { buildBreadcrumbJsonLd } from "@/lib/seo-auto/schema";
import { buildWebPageJsonLd, publisher, serializeJsonLd, uniqueKeywords } from "@/lib/seo";
import { buildFaqPageJsonLd } from "@/lib/structured-data";

const canonicalUrl = `${siteUrl}/questions/trekking-annapurna`;
const question = "Best season for the Annapurna Circuit if you want fewer crowds";
const dateModified = "2026-10-09";
const shortAnswer =
  "Late November is usually the best balance: the post-monsoon skies are still clear, the October rush has passed and teahouses are easier to book. Expect colder mornings near Manang and Thorong La, and keep at least one buffer day for weather.";

const months = [
  {
    name: "October",
    crowds: "Busiest weeks of the year on the circuit; popular teahouses in Manang and the Thorong La approach fill early.",
    weather: "Typically settled after the monsoon, with clear mornings and mild daytime temperatures at lower villages.",
    watch: "Dashain and Tihar festival travel can make buses, jeeps and flights from Kathmandu and Pokhara harder to book.",
  },
  {
    name: "November",
    crowds: "Busy early in the month, then noticeably quieter in the second half.",
    weather: "Often the clearest views of the season; nights below freezing become common above Manang.",
    watch: "Shorter daylight hours, so start the Thorong La crossing early and allow time to descend to Muktinath.",
  },
  {
    name: "Early December",
    crowds: "Few trekkers, and some higher teahouses may run reduced services or close for winter.",
    weather: "Cold and generally dry, but a passing storm can bring snow that closes Thorong La for days.",
    watch: "Carry warmer layers and build in flexible days; confirm the pass is open with lodges in Manang before going higher.",
  },
];

const planningSteps = [
  "Plan an acclimatisation day in Manang before climbing toward Thorong Phedi and the 5,416 m pass.",
  "Keep one or two buffer days so a snow day or delayed transport does not force a rushed crossing.",
  "Check current permit and licensed-guide rules with the Nepal Tourism Board or a registered agency before booking; requirements have changed in recent seasons.",
  "Confirm that your travel insurance covers trekking to the altitude you will reach, including helicopter evacuation.",
  "Ask lodges and other trekkers in Manang about the pass on the day; local conditions matter more than a forecast made weeks earlier.",
];

const faqs = [
  {
    question: "Is October or November better for the Annapurna Circuit?",
    answer:
      "Both are post-monsoon months with generally clear weather. October has the most trekkers and festival travel; the second half of November is usually quieter, colder and still clear.",
  },
  {
    question: "Can you trek the Annapurna Circuit in December?",
    answer:
      "Yes, early December is possible for prepared trekkers. It is colder, some high teahouses may close and snow can shut Thorong La temporarily, so carry warm gear and keep flexible days.",
  },
  {
    question: "How many buffer days should I plan for Thorong La?",
    answer:
      "Plan at least one buffer day in late autumn and two in early December, in addition to an acclimatisation day in Manang.",
  },
  {
    question: "What is the quietest good-weather window on the Annapurna Circuit?",
    answer:
      "Mid-to-late November usually combines clear skies with fewer trekkers than October. Spring (March to May) is the other main season and spreads crowds across a longer window.",
  },
];

const relatedGuides = [
  { href: "/blog/annapurna-circuit-guide", label: "Annapurna Circuit trek guide: route, permits, cost and packing" },
  { href: "/blog/nepal-travel-trekking-insurance-guide", label: "Travel and trekking insurance checklist for Nepal" },
  { href: "/blog/kathmandu-pokhara-trekking-gear-rental-guide", label: "Trekking gear rental in Kathmandu and Pokhara" },
];

export const metadata: Metadata = buildPublicPageMetadata({
  title: "Best Time for the Annapurna Circuit With Fewer Crowds",
  description:
    "Compare October, November and early December on the Annapurna Circuit: crowds, cold, visibility, Thorong La snow risk and how many buffer days to plan.",
  path: "/questions/trekking-annapurna",
});

export default function QuestionDetailPage() {
  const keywords = uniqueKeywords([
    "Annapurna Circuit best time",
    "Annapurna Circuit November",
    "Annapurna Circuit December",
    "Thorong La",
    "Nepal trekking season",
  ]);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "Guides", url: `${siteUrl}${routes.blog}` },
    { name: "Annapurna Circuit season", url: canonicalUrl },
  ], canonicalUrl);
  const webPageJsonLd = {
    ...buildWebPageJsonLd({
      name: question,
      description: shortAnswer,
      url: canonicalUrl,
      keywords,
      dateModified,
      breadcrumb: true,
      speakable: ["h1", "#short-answer p"],
    }),
    mainEntity: { "@id": `${canonicalUrl}#article` },
  };
  // Editorial answer, not a user forum, so it is an Article with an FAQ rather than a QAPage.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonicalUrl}#article`,
    headline: question,
    description: shortAnswer,
    dateModified,
    datePublished: "2026-07-16",
    inLanguage: "en",
    author: publisher,
    publisher,
    image: `${siteUrl}/nepali-directory-og.png`,
    mainEntityOfPage: { "@id": `${canonicalUrl}#webpage` },
    about: [
      { "@type": "TouristDestination", name: "Annapurna Circuit" },
      { "@type": "Place", name: "Thorong La" },
    ],
  };
  const faqJsonLd = buildFaqPageJsonLd(faqs, canonicalUrl);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd([webPageJsonLd, articleJsonLd, breadcrumbJsonLd, ...(faqJsonLd ? [faqJsonLd] : [])]) }}
      />
      <Breadcrumbs schema={false} items={[{ label: "Guides", href: routes.blog }, { label: "Annapurna Circuit season" }]} />
      <section className="section">
        <article className="container prose-card">
          <span className="eyebrow">Trekking</span>
          <h1 className="page-title">{question}</h1>
          <p>
            Updated <time dateTime={dateModified}>9 October 2026</time>. A planning answer for trekkers who can travel
            between October and early December and want clear mountain views without the busiest teahouse weeks.
          </p>

          <div className="answer-card" id="short-answer">
            <strong>Short answer</strong>
            <p>{shortAnswer}</p>
          </div>

          <h2>October, November and early December compared</h2>
          {months.map((month) => (
            <section key={month.name}>
              <h3>{month.name}</h3>
              <ul>
                <li><strong>Crowds:</strong> {month.crowds}</li>
                <li><strong>Weather:</strong> {month.weather}</li>
                <li><strong>Watch for:</strong> {month.watch}</li>
              </ul>
            </section>
          ))}

          <h2>How to plan a quieter crossing of Thorong La</h2>
          <ol>
            {planningSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p>
            Weather in the Himalaya varies from year to year, so treat these patterns as typical rather than
            guaranteed and check current conditions close to departure.
          </p>

          <h2>Frequently asked questions</h2>
          {faqs.map((faq) => (
            <section key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </section>
          ))}

          <h2>Related trekking guides</h2>
          <ul>
            {relatedGuides.map((guide) => (
              <li key={guide.href}>
                <Link href={guide.href}>{guide.label}</Link>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
