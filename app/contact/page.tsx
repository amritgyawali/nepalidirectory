import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/directory/PageHero";
import { siteUrl } from "@/lib/blog";
import { routes } from "@/lib/routes";
import { buildWebPageJsonLd, uniqueKeywords } from "@/lib/seo";

export default function ContactPage() {
  const configuredEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim();
  const supportEmail = configuredEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configuredEmail)
    ? configuredEmail
    : null;
  const description =
    "Contact Nepali Directory about listing corrections, ownership claims, partnerships, advertising and directory support.";
  const jsonLd = {
    ...buildWebPageJsonLd({
      name: "Contact Nepali Directory",
      description,
      url: `${siteUrl}${routes.contact}`,
      keywords: uniqueKeywords([
        "contact Nepali Directory",
        "correct Nepal business listing",
        "claim Nepal business profile",
      ]),
      dateModified: "2026-07-15",
    }),
    "@type": "ContactPage",
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs items={[{ label: "Contact" }]} />
      <PageHero
        title="Contact Nepali Directory"
        subtitle="Listing corrections, ownership claims, partnerships and directory support."
        cta={{ label: "Submit or claim a listing", href: routes.claimListing }}
        secondary={{ label: "Read our methodology", href: routes.directoryMethodology }}
      />
      <section className="section">
        <div className="container seo-answer-grid">
          <article className="answer-summary">
            <h2>Listing corrections</h2>
            <p>
              Include the business name, exact location, profile URL, field that needs changing and
              a source that supports the correction. Do not send sensitive documents through a
              public channel.
            </p>
            <Link href={routes.claimListing}>Open the listing submission workflow</Link>
          </article>
          <article className="answer-summary">
            <h2>Support contact</h2>
            {supportEmail ? (
              <p>
                Email <a href={`mailto:${supportEmail}`}>{supportEmail}</a>. Include a clear subject
                and the relevant page URL so the request can be reviewed efficiently.
              </p>
            ) : (
              <p>
                Direct email support is not published until a monitored mailbox is configured.
                Please use the listing submission workflow for ownership and correction requests.
              </p>
            )}
          </article>
          <article className="answer-summary">
            <h2>What we do not publish</h2>
            <p>
              Nepali Directory does not display a phone number, office address or social profile
              unless that channel has been configured and verified. This prevents placeholder
              contact details from being mistaken for real support information.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
