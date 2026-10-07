import { JsonLd } from "@/components/seo/JsonLd";
import { siteUrl } from "@/lib/blog";
import { claimListingFaqs, claimListingSteps, claimListingSummary } from "@/lib/claim-listing-content";
import { routes } from "@/lib/routes";
import { buildWebPageJsonLd } from "@/lib/seo";
import { buildPublicPageMetadata } from "@/lib/site-metadata";
import { buildFaqPageJsonLd, buildHowToJsonLd } from "@/lib/structured-data";

export const metadata = buildPublicPageMetadata({
  title: "Free Nepal Business Listing: Add or Claim a Business",
  description:
    "Add a free Nepal business listing or claim an existing profile. Submit accurate company, service, contact and location details for review.",
  path: routes.claimListing
});

const pageUrl = `${siteUrl}${routes.claimListing}`;

export default function ClaimListingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <JsonLd
        data={[
          {
            ...buildWebPageJsonLd({
              name: "Add or claim a business listing in Nepal",
              description: claimListingSummary,
              url: pageUrl,
              keywords: [
                "free business listing Nepal",
                "add business Nepal",
                "claim business listing Nepal",
                "list my business Nepal"
              ],
              dateModified: "2026-10-07"
            }),
            mainEntity: { "@id": `${pageUrl}#howto` }
          },
          buildHowToJsonLd({
            name: "How to add or claim a business on Nepali Directory",
            description: claimListingSummary,
            pageUrl,
            steps: claimListingSteps
          }),
          buildFaqPageJsonLd(claimListingFaqs, pageUrl)
        ]}
      />
      {children}
    </>
  );
}
