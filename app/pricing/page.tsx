import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { plans } from "@/lib/data";
import { routes } from "@/lib/routes";

const faqs = [
  {
    question: "Can I start with a free business profile?",
    answer: "Yes. The Starter option is intended for a basic profile. Every new or changed profile still passes ownership, source and category review before it can enter public search surfaces."
  },
  {
    question: "Does a paid plan guarantee a search ranking?",
    answer: "No. Payment never guarantees an organic ranking. Relevance, profile quality, verified details, customer evidence, site authority and competition all affect visibility. Sponsored placement must be labeled."
  },
  {
    question: "Should I confirm the final price before subscribing?",
    answer: "Yes. Contact the directory team for current availability, billing period, taxes, included placements, cancellation terms and support scope before payment."
  }
];

export default function PricingPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: "Pricing" }]} />
      <section className="page-head">
        <div className="container">
          <span className="eyebrow">For Nepal business owners</span>
          <h1 className="page-title">Business listing plans and pricing</h1>
          <p className="page-copy">
            Start with a basic profile or ask about additional visibility and management tools.
            Organic rankings are never sold, and paid placements are shown separately from
            directory publication and quality review.
          </p>
          <div className="seo-hero__actions">
            <Link className="button button--primary" href={routes.claimListing}>Add your business</Link>
            <Link className="button button--outline" href={routes.requestCallback}>Confirm current terms</Link>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container pricing-grid">
          {plans.map((plan) => (
            <article className={plan.highlighted ? "price-card price-card--hot" : "price-card"} key={plan.name}>
              <h2>{plan.name}</h2>
              <strong>{plan.price}</strong>
              <p>{plan.description}</p>
              {plan.features.map((feature) => (
                <span key={feature}><CheckCircle2 size={14} aria-hidden /> {feature}</span>
              ))}
              <Link className="button button--primary" href={`${routes.requestCallback}?plan=${encodeURIComponent(plan.name)}`}>
                Ask about {plan.name}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container fact-panel">
          <h2>What every plan includes</h2>
          <p>
            Plan choice does not bypass verification. Public profiles need accurate business
            identity, category, location and contact information. Placeholder records, invented
            reviews and incomplete submissions are excluded from ranking and sitemap surfaces.
          </p>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container article-faq">
          <h2>Pricing questions</h2>
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
