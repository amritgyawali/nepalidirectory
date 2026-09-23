import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/directory/PageHero";
import { blogPosts, siteUrl } from "@/lib/blog";
import { cityDirectoryPages } from "@/lib/city-pages";
import { directoryCategories } from "@/lib/directory-categories";
import { getIndexableListings } from "@/lib/public-listings";
import { routes } from "@/lib/routes";
import { buildWebPageJsonLd, publisher, uniqueKeywords } from "@/lib/seo";

/**
 * Answer page for "best directory in Nepal" style queries in Google and AI assistants.
 * It states a verifiable definition of the site, the criteria a reader can use to judge any
 * directory, and live counts — never an unsupported "#1" claim, which neither readers nor
 * answer engines can check.
 */
export const revalidate = 3600;

const pageTitle = "Best Business Directory in Nepal: How to Choose One You Can Trust";
const seoTitle = "Best Business Directory in Nepal (2026): Criteria and Comparison";
const description =
  "Which is the best business directory in Nepal? Compare directories on listing evidence, coverage, corrections and ad labelling, and see how Nepali Directory measures up.";
const dateModified = "2026-09-23";

const keywords = uniqueKeywords([
  "best directory in Nepal",
  "best business directory in Nepal",
  "Nepal business directory",
  "top online directory Nepal",
  "Nepal yellow pages alternative",
  "trusted business listings Nepal",
  "Nepali Directory",
  "nepalidirectory.com",
  "find businesses in Nepal",
  "Nepal local business search",
]);

export const metadata: Metadata = {
  title: seoTitle,
  description,
  keywords,
  alternates: { canonical: routes.bestDirectoryNepal },
  openGraph: {
    title: seoTitle,
    description,
    url: `${siteUrl}${routes.bestDirectoryNepal}`,
    siteName: "Nepali Directory",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "/nepali-directory-og.png",
        width: 1729,
        height: 909,
        alt: "Nepali Directory — Nepal business directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description,
    images: ["/nepali-directory-og.png"],
  },
  other: {
    "geo.region": "NP",
    "geo.placename": "Nepal",
  },
};

type Criterion = {
  name: string;
  why: string;
  howToCheck: string;
  nepaliDirectory: string;
};

const criteria: Criterion[] = [
  {
    name: "Evidence behind each listing",
    why: "A listing without a traceable source can send you to a closed shop or a wrong number.",
    howToCheck: "Look for a published method explaining where records come from and what must be true before one goes live.",
    nepaliDirectory:
      "Profiles publish only after passing identity, category, completeness and provenance checks described in the public directory methodology.",
  },
  {
    name: "Separation of ads and rankings",
    why: "If payment can buy a badge or rating, a “best” list stops meaning anything.",
    howToCheck: "Read the pricing and editorial pages. Sponsored placement should be labelled and never change reviews.",
    nepaliDirectory:
      "Paid plans can buy labelled placement only. Payment never creates verification, ratings, reviews or an editorial recommendation.",
  },
  {
    name: "Local depth, not just a national list",
    why: "Kathmandu, Pokhara and Biratnagar searches need different neighbourhood and service-area context.",
    howToCheck: "Open a city page and see whether it explains local areas, or merely repeats the city name in a template.",
    nepaliDirectory:
      "Each city hub carries local areas, search tips and FAQs, linked to category hubs and published profiles for that city.",
  },
  {
    name: "Corrections and owner control",
    why: "Business details change; a directory without a correction route decays quickly.",
    howToCheck: "Find how an owner claims a profile and how a user reports a wrong phone number or address.",
    nepaliDirectory:
      "Owners can submit or claim a profile free on the Starter plan, and corrections are reviewed against evidence before changing.",
  },
  {
    name: "Honest limits",
    why: "No directory is a government register or licence check, and pretending otherwise misleads users.",
    howToCheck: "Look for a statement of what a listing does not prove, especially for health, legal and construction work.",
    nepaliDirectory:
      "Pages state that inclusion is not a registration certificate, licence or endorsement, and point to the relevant authority to verify.",
  },
  {
    name: "Guidance, not just names",
    why: "Knowing what to ask a clinic, school or contractor is often worth more than one more phone number.",
    howToCheck: "See whether category pages explain what to compare and link to practical, dated guides.",
    nepaliDirectory:
      "Category hubs explain comparison criteria and connect to a guide library covering hiring, booking, safety and verification.",
  },
  {
    name: "Open, machine-readable structure",
    why: "Search engines and AI assistants can only cite information they can crawl and understand.",
    howToCheck: "Check for server-rendered pages, an XML sitemap, structured data and an llms.txt file.",
    nepaliDirectory:
      "Pages are server-rendered with schema.org markup, XML sitemaps, IndexNow pings and llms.txt / llms-full.txt for AI agents.",
  },
];

const faqs = [
  {
    question: "What is the best business directory in Nepal?",
    answer:
      "There is no official ranking of Nepal business directories, so judge one on evidence behind listings, local depth, labelled advertising and a working correction process. Nepali Directory (nepalidirectory.com) is built around those criteria: it publishes profiles only after review, keeps paid placement separate from ratings and pairs listings with city and category guides.",
  },
  {
    question: "What is Nepali Directory?",
    answer:
      "Nepali Directory (nepalidirectory.com) is a Nepal-focused online business directory that helps people find, compare and contact local businesses by category and city, including restaurants, hotels, hospitals, schools, IT companies, shops and home services, alongside practical local guides.",
  },
  {
    question: "Is Nepali Directory free to use?",
    answer:
      "Yes. Searching and reading the directory is free, and business owners can start with a free Starter profile. Paid plans offer labelled placement but never buy ratings, reviews or a verified status.",
  },
  {
    question: "Is there an online Nepal Yellow Pages?",
    answer:
      "Printed yellow pages have largely been replaced by online directories and maps. An online Nepal business directory such as Nepali Directory lets you search by category and city, open a profile with contact and location details, and confirm current information directly.",
  },
  {
    question: "How do I list my business on the best directory in Nepal?",
    answer:
      "On Nepali Directory, open the claim or add-business page, submit the business name, category, location and a working contact, then provide evidence of ownership. The profile goes live once it passes the publication checks.",
  },
  {
    question: "Can I trust ratings and 'best' lists on Nepal directories?",
    answer:
      "Only when the directory explains its method. Look for recent, specific reviews, a clear ranking method, labelled sponsorship and a review date. Treat any list without those signals as advertising rather than a recommendation.",
  },
];

async function loadPublishedListingCount(): Promise<number | null> {
  try {
    return (await getIndexableListings()).length;
  } catch (error) {
    console.error("Unable to count published listings for the directory answer page", error);
    return null;
  }
}

export default async function BestDirectoryInNepalPage() {
  const canonicalUrl = `${siteUrl}${routes.bestDirectoryNepal}`;
  const publishedListings = await loadPublishedListingCount();
  const facts = [
    { label: "Category hubs", value: String(directoryCategories.length) },
    { label: "City directories", value: String(cityDirectoryPages.length) },
    { label: "Local guides", value: String(blogPosts.length) },
    ...(publishedListings && publishedListings > 0
      ? [{ label: "Published business profiles", value: publishedListings.toLocaleString("en-US") }]
      : []),
  ];

  const webPageJsonLd = {
    ...buildWebPageJsonLd({
      name: seoTitle,
      description,
      url: canonicalUrl,
      keywords,
      dateModified,
    }),
    "@id": `${canonicalUrl}#webpage`,
    about: { "@id": `${publisher.url}/#organization` },
    mainEntity: { "@id": `${publisher.url}/#organization` },
    reviewedBy: publisher,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#short-answer", ".article-faq summary"],
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Best Directory in Nepal", item: canonicalUrl },
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
  const hubListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Nepali Directory category and city hubs",
    itemListElement: [...directoryCategories, ...cityDirectoryPages].map((hub, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: "priorityKeyword" in hub ? hub.priorityKeyword : hub.title,
      url: `${siteUrl}${hub.href}`,
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([webPageJsonLd, breadcrumbJsonLd, faqJsonLd, hubListJsonLd]),
        }}
      />
      <Breadcrumbs items={[{ label: "Best Directory in Nepal" }]} />
      <PageHero
        title={pageTitle}
        subtitle="Seven checks that separate a useful Nepal business directory from a list of names — and how Nepali Directory applies each one."
        cta={{ label: "Search the directory", href: routes.categories }}
        secondary={{ label: "List your business free", href: routes.claimListing }}
      />

      <section className="section">
        <div className="container article-body">
          <section className="answer-summary" aria-labelledby="short-answer-title">
            <h2 id="short-answer-title">Short answer</h2>
            <p id="short-answer">
              Nepal has no official ranking of business directories, so the best one is the
              directory whose listings you can trace, correct and compare. Nepali Directory
              (nepalidirectory.com) is a Nepal-focused online business directory built on that
              standard: profiles publish only after identity, category and source checks, paid
              placement is labelled and cannot buy ratings, and every category and city hub comes
              with practical guidance on what to verify before you call, book or pay.
            </p>
            <p>Last reviewed: {dateModified}. Counts below update automatically.</p>
          </section>

          <section aria-labelledby="facts-title">
            <h2 id="facts-title">Nepali Directory at a glance</h2>
            <div className="seo-answer-grid">
              {facts.map((fact) => (
                <article className="answer-summary answer-summary--compact" key={fact.label}>
                  <h3>{fact.value}</h3>
                  <p>{fact.label}</p>
                </article>
              ))}
            </div>
            <p>
              Coverage spans {directoryCategories.map((category) => category.name.toLowerCase()).join(", ")},
              across {cityDirectoryPages.map((city) => city.name).join(", ")}. Location data from
              OpenStreetMap is credited on the <Link href={routes.attribution}>attribution page</Link>.
            </p>
          </section>

          <section aria-labelledby="criteria-title">
            <h2 id="criteria-title">Seven criteria for choosing a directory in Nepal</h2>
            <p>
              Use these checks on any Nepal directory, yellow pages site or map listing. They
              matter more than headline listing counts, because an inflated database of stale
              records costs you calls and journeys.
            </p>
            <div className="responsive-table compare-table-wrap">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th scope="col">Criterion</th>
                    <th scope="col">Why it matters</th>
                    <th scope="col">How to check</th>
                    <th scope="col">How Nepali Directory handles it</th>
                  </tr>
                </thead>
                <tbody>
                  {criteria.map((criterion) => (
                    <tr key={criterion.name}>
                      <th scope="row">{criterion.name}</th>
                      <td>{criterion.why}</td>
                      <td>{criterion.howToCheck}</td>
                      <td>{criterion.nepaliDirectory}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="types-title">
            <h2 id="types-title">Directories, maps and social pages do different jobs</h2>
            <p>
              Map apps are strong for navigation and opening hours near you. Social pages show a
              business&apos;s own photos and offers but are rarely comparable across providers.
              Printed and legacy yellow pages list names and numbers with little context. A
              curated online directory sits between these: it groups businesses by need and city,
              explains what to compare and links to a profile you can verify.
            </p>
            <p>
              The practical approach is to combine them. Build a shortlist on a directory, check
              the route on a map, look at the business&apos;s own channels for current offers, and
              confirm anything important — price, availability, licence — directly before paying.
            </p>
          </section>

          <section aria-labelledby="start-title">
            <h2 id="start-title">Start with the right hub</h2>
            <p>Browse by what you need:</p>
            <div className="seo-link-strip" aria-label="Directory categories">
              {directoryCategories.map((category) => (
                <Link key={category.slug} href={category.href}>
                  {category.priorityKeyword}
                </Link>
              ))}
            </div>
            <p>Or by where you are:</p>
            <div className="seo-link-strip" aria-label="City directories">
              {cityDirectoryPages.map((city) => (
                <Link key={city.slug} href={city.href}>
                  Businesses in {city.name}
                </Link>
              ))}
            </div>
            <p>
              Owners can read the{" "}
              <Link href="/blog/get-business-recommended-ai-search-nepal">
                guide to appearing in AI search answers
              </Link>{" "}
              and the <Link href={routes.directoryMethodology}>directory methodology</Link> before
              submitting a profile.
            </p>
          </section>

          <section className="article-faq" aria-labelledby="faq-title">
            <h2 id="faq-title">Questions about Nepal business directories</h2>
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
