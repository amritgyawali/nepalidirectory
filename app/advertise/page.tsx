import Link from "next/link";
import { PageHero } from "@/components/directory/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteUrl } from "@/lib/blog";
import { plans, stats } from "@/lib/data";
import { routes } from "@/lib/routes";
import { buildWebPageJsonLd, uniqueKeywords } from "@/lib/seo";
import { buildFaqPageJsonLd, buildHowToJsonLd, buildPlanServiceJsonLd } from "@/lib/structured-data";

const pageUrl = `${siteUrl}${routes.advertise}`;
const quickAnswer =
  "Businesses in Nepal can advertise on Nepali Directory with clearly labelled sponsored placements next to category and city searches. Start with a free, verified profile, then add a paid plan for promotion, lead notifications and campaign reporting.";

const steps = [
  {
    name: "Publish a verified profile",
    text: "Submit or claim your business so its name, category, location and contact details pass directory review.",
    href: routes.claimListing,
  },
  {
    name: "Choose a placement plan",
    text: "Compare the Featured and Premium plans and confirm current availability, billing and included placements.",
    href: routes.pricing,
  },
  {
    name: "Launch and measure",
    text: "Sponsored placements go live with a visible label, and campaign reporting shows how customers respond.",
    href: routes.contact,
  },
];

const faqs = [
  {
    question: "How can I advertise my business in Nepal online?",
    answer:
      "List the business on Nepali Directory for free, then add a Featured or Premium plan to appear in clearly labelled sponsored placements beside relevant category and city searches.",
  },
  {
    question: "Are sponsored listings labelled?",
    answer:
      "Yes. Every paid placement carries a sponsored label and is shown separately from organic directory results, which are never sold.",
  },
  {
    question: "Do I need a verified profile before advertising?",
    answer:
      "Yes. Advertising attaches to a profile that has passed the same ownership, category and completeness review as every other listing.",
  },
];

export default function AdvertisePage() {
  const webPageJsonLd = {
    ...buildWebPageJsonLd({
      name: "Advertise your business in Nepal",
      description: quickAnswer,
      url: pageUrl,
      keywords: uniqueKeywords([
        "advertise business Nepal",
        "online advertising Nepal",
        "Nepal directory advertising",
        "sponsored business listing Nepal",
      ]),
      dateModified: "2026-10-07",
      breadcrumb: true,
    }),
    mainEntity: { "@id": `${pageUrl}#service` },
  };

  return (
    <main>
      <JsonLd
        data={[
          webPageJsonLd,
          buildPlanServiceJsonLd(plans, pageUrl),
          buildHowToJsonLd({
            name: "How to advertise a business on Nepali Directory",
            description: quickAnswer,
            pageUrl,
            steps,
          }),
          buildFaqPageJsonLd(faqs, pageUrl),
        ]}
      />
      <Breadcrumbs items={[{ label: "Advertise" }]} currentPath={routes.advertise} />
      <PageHero
        title="Advertise with Nepali Directory"
        subtitle="Put your business in front of high-intent local customers searching by service, city and neighborhood."
        cta={{ label: "View plans", href: routes.pricing }}
        secondary={{ label: "Contact us", href: routes.contact }}
      />
      <section className="section">
        <div className="container">
          <section className="answer-summary" aria-labelledby="advertise-summary">
            <h2 id="advertise-summary">How advertising works</h2>
            <p>{quickAnswer}</p>
          </section>
          <div className="stats-grid">
            {stats.map(([value, label]) => (
              <div className="metric-card" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="pricing-grid">
            {plans.map((plan) => (
              <article className={plan.highlighted ? "price-card price-card--hot" : "price-card"} key={plan.name}>
                <h2>{plan.name}</h2>
                <strong>{plan.price}</strong>
                <p>{plan.description}</p>
                {plan.features.map((feature) => (
                  <span key={feature}>{feature}</span>
                ))}
                <Link className="button button--primary" href={routes.contact}>
                  Start now
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container fact-panel">
          <h2>Get started in three steps</h2>
          <ol>
            {steps.map((step, index) => (
              <li id={`step-${index + 1}`} key={step.name}>
                <strong>{step.name}.</strong> {step.text}{" "}
                {step.href ? <Link href={step.href}>Open</Link> : null}
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section">
        <div className="container article-faq">
          <h2>Advertising questions</h2>
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
