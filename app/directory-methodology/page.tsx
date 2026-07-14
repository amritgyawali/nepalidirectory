import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/directory/PageHero";
import { siteUrl } from "@/lib/blog";
import { routes } from "@/lib/routes";
import { buildWebPageJsonLd, publisher, uniqueKeywords } from "@/lib/seo";

const title = "How Nepali Directory Reviews and Publishes Business Listings";
const description =
  "Read Nepali Directory's listing methodology: accepted sources, publication checks, verification limits, duplicate handling, corrections, reviews and sponsored placement rules.";

export const metadata: Metadata = {
  title: "Directory Methodology: How Business Listings Are Reviewed",
  description,
  alternates: { canonical: routes.directoryMethodology },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${routes.directoryMethodology}`,
    siteName: "Nepali Directory",
    type: "article",
    images: [
      {
        url: "/nepali-directory-og.png",
        width: 1729,
        height: 909,
        alt: "Nepali Directory listing review methodology",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/nepali-directory-og.png"],
  },
};

const publicationChecks = [
  {
    title: "Identifiable business",
    body: "The record needs a usable business name and enough location or service-area information to distinguish it from similarly named organizations. Placeholder names and records that cannot be tied to a real entity stay unpublished.",
  },
  {
    title: "Relevant category",
    body: "At least one category must describe a service the business actually offers. Records marked uncategorized or needing category review do not enter public category pages, rankings or the listing sitemap.",
  },
  {
    title: "Usable contact or provenance",
    body: "The record must be supported by an owner submission, verified source, OpenStreetMap provenance, reviewed import or another documented source. Example domains, placeholder email addresses and malformed websites are rejected from index-producing surfaces.",
  },
  {
    title: "Minimum completeness",
    body: "The publication gate requires an active record with a quality score of at least 55, a name, address, category and sufficient evidence. Passing the threshold means the profile is publishable; it does not mean every optional field is complete.",
  },
];

const faqs = [
  {
    question: "Does a published listing mean Nepali Directory recommends the business?",
    answer:
      "No. Publication means the record passed the directory's identity, category, completeness and provenance checks. It is not a guarantee, professional licence, safety approval or endorsement.",
  },
  {
    question: "Why are some business profiles not visible in Google?",
    answer:
      "Preview, demo, inactive, incomplete and unresolved records are intentionally marked noindex and excluded from XML sitemaps and LocalBusiness structured data until they qualify for publication.",
  },
  {
    question: "Can a business pay to become verified or improve its rating?",
    answer:
      "No. Advertising may purchase clearly labelled placement, but payment does not create verification, customer reviews, ratings or an independent editorial recommendation.",
  },
  {
    question: "How can an owner correct a listing?",
    answer:
      "Use the claim or submission workflow and identify the business, location, field to change and evidence supporting the correction. Material edits remain subject to review.",
  },
];

export default function DirectoryMethodologyPage() {
  const canonicalUrl = `${siteUrl}${routes.directoryMethodology}`;
  const keywords = uniqueKeywords([
    "Nepali Directory methodology",
    "Nepal business listing verification",
    "business directory publication standards",
    "verified business listings Nepal",
    "directory correction policy",
  ]);
  const webPageJsonLd = {
    ...buildWebPageJsonLd({
      name: title,
      description,
      url: canonicalUrl,
      keywords,
      dateModified: "2026-07-15",
    }),
    "@type": "AboutPage",
    reviewedBy: publisher,
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Directory Methodology", item: canonicalUrl },
    ],
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([webPageJsonLd, breadcrumbJsonLd, faqJsonLd]),
        }}
      />
      <Breadcrumbs items={[{ label: "Directory Methodology" }]} />
      <PageHero
        title="How business listings are reviewed"
        subtitle="The sources, minimum evidence, publication gates and limits behind Nepali Directory profiles."
        cta={{ label: "Submit or claim a listing", href: routes.claimListing }}
        secondary={{ label: "Browse categories", href: routes.categories }}
      />

      <section className="section">
        <div className="container article-body">
          <section className="answer-summary">
            <h2>What a qualified listing means</h2>
            <p>
              A qualified listing is an active business record that passes automated publication
              checks for identity, category, completeness and source provenance. It can appear on
              a public profile, relevant category and city pages, the listing sitemap and truthful
              structured data. Qualification is a data-publication decision, not an endorsement.
            </p>
          </section>

          <section>
            <h2>Where listing information can come from</h2>
            <p>
              First-party owner submissions are the preferred source for service descriptions,
              hours, contacts and business changes. Nepali Directory can also use appropriately
              licensed OpenStreetMap data and reviewed imports whose origin is recorded. Every
              source has limits: an owner knows the business but may write promotional claims,
              while an open dataset can provide location evidence but may be incomplete or old.
            </p>
            <p>
              Source information is therefore treated as evidence to review, not permission to
              publish every supplied claim. Nepali Directory does not use placeholder records as
              real businesses and should not copy Google Maps listings or reviews into its own
              database.
            </p>
          </section>

          <section>
            <h2>The minimum publication checks</h2>
            <div className="seo-answer-grid">
              {publicationChecks.map((check) => (
                <article className="answer-summary" key={check.title}>
                  <h3>{check.title}</h3>
                  <p>{check.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2>What verification does and does not establish</h2>
            <p>
              A verified or claimed status can establish that a profile has passed a defined
              ownership or review process. It cannot prove that every service is suitable, that a
              professional holds every required licence, or that a future transaction will be
              satisfactory. For healthcare, education, legal, financial, construction and other
              regulated work, users should consult the relevant official register or authority.
            </p>
            <p>
              Time-sensitive facts also need direct confirmation. Opening hours, prices, stock,
              menus, staff, appointment schedules and service areas may change after a page was
              reviewed. A directory profile helps form a shortlist; the business or responsible
              authority remains the source for current operational terms.
            </p>
          </section>

          <section>
            <h2>Duplicates, branches and name changes</h2>
            <p>
              Similar names do not always describe the same business, and one brand can operate
              multiple genuine locations. Duplicate review considers normalized names, phone
              numbers, websites, coordinates, addresses and source identifiers. Clear duplicates
              should merge into one record, while eligible branches retain separate profiles when
              they have distinct locations and useful branch-specific information.
            </p>
            <p>
              A name or ownership change is not handled by silently creating extra pages. The
              record should preserve enough continuity for corrections and redirects while showing
              the current public identity supported by evidence.
            </p>
          </section>

          <section>
            <h2>Ratings, reviews and rankings</h2>
            <p>
              Rating schema is published only when the underlying profile has eligible, visible
              review data. Demo ratings and invented review counts stay outside public structured
              data. Ranking pages require enough qualified businesses to make a comparison useful;
              empty templates and sample providers are not published as genuine “best” results.
            </p>
            <p>
              When a comparison is available, it should explain its criteria, evidence and review
              date. A different customer may reasonably choose a different provider because
              location, specialty, accessibility, availability, price or risk matters more to that
              decision than a single overall score.
            </p>
          </section>

          <section>
            <h2>Corrections, removals and disputes</h2>
            <p>
              Owners and users should identify the exact record and field they believe is wrong.
              Strong correction requests include a current official page, owner-controlled contact,
              registration document where appropriate, recent photograph or another source that
              directly supports the change. Sensitive documents should be shared only through an
              approved private workflow, never posted publicly.
            </p>
            <p>
              A business may request review of a duplicate, closure, impersonation, unsafe personal
              information or ownership dispute. Nepali Directory may temporarily withhold a record
              while material evidence is reviewed. Removal from a directory does not remove the
              underlying information from its original public source.
            </p>
          </section>

          <section>
            <h2>Advertising and editorial independence</h2>
            <p>
              Paid placement must be clearly labelled and kept separate from verification,
              customer ratings and editorial conclusions. An advertiser can purchase visibility,
              but not a fabricated review history, unsupported badge or undisclosed position in an
              independent comparison.
            </p>
          </section>

          <section className="article-faq">
            <h2>Questions about the listing method</h2>
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </section>

          <section className="fact-panel">
            <h2>Continue</h2>
            <p>
              Read the editorial standards for guide content, review source attribution, or submit
              a real business for publication review.
            </p>
            <div className="article-tags article-tags--inline">
              <Link href={routes.editorialPolicy}>Editorial policy</Link>
              <Link href={routes.attribution}>Data attribution</Link>
              <Link href={routes.claimListing}>Submit or claim a listing</Link>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
