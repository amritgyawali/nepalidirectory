import type { Listing } from "@/lib/enrich";
import { isIndexableListing, isVerifiedListingImage } from "@/lib/public-listings";

/**
 * One vocabulary for every trust number and status label the directory renders.
 *
 * The 2026-08-06 SEO/GEO audit found the same record population described with different words on
 * different surfaces ("verified listings" on one page, "qualified public profiles" on another),
 * which lets a visitor read a discovery-stage count as a publishable-profile count. Every visible
 * label must resolve to exactly one of these keys, and every count must come from the predicate
 * attached to it.
 */
export type TrustLabelKey =
  | "discovered"
  | "sourceChecked"
  | "qualified"
  | "ownershipVerified"
  | "reviewVerified"
  | "active"
  | "lastChecked";

export type TrustLabel = {
  key: TrustLabelKey;
  /** The only wording allowed for this population in public UI. */
  label: string;
  definition: string;
};

export const trustVocabulary: Record<TrustLabelKey, TrustLabel> = {
  discovered: {
    key: "discovered",
    label: "Discovered record",
    definition:
      "A business record the directory has acquired from a submission, import or open dataset. It has not been reviewed and is never counted as a public profile.",
  },
  sourceChecked: {
    key: "sourceChecked",
    label: "Source checked",
    definition:
      "A reviewer confirmed the record against an auditable source and recorded the date of that check. It does not mean every optional field is complete or that the business was contacted.",
  },
  qualified: {
    key: "qualified",
    label: "Qualified public profile",
    definition:
      "The record passes every publication requirement — active, non-placeholder, category reviewed, complete enough, contactable and supported by an auditable source — so it can be indexed, appear in city and category pages, and carry business structured data.",
  },
  ownershipVerified: {
    key: "ownershipVerified",
    label: "Ownership verified",
    definition:
      "A business owner completed the claim process for this record, so a responsible party maintains it. It is not a licence check, safety approval or endorsement.",
  },
  reviewVerified: {
    key: "reviewVerified",
    label: "Review verified",
    definition:
      "A first-party review passed identity and content checks and is visible on the profile it rates. No imported or aggregate third-party rating is published as a review.",
  },
  active: {
    key: "active",
    label: "Active",
    definition:
      "The business is believed to be operating. Closures are acted on when reported or found during a re-check.",
  },
  lastChecked: {
    key: "lastChecked",
    label: "Last checked",
    definition:
      "The date the record's material facts were last reviewed against a source. Hours, prices and availability can change after that date.",
  },
};

export type PublicationTier = {
  tier: 0 | 1 | 2 | 3;
  name: string;
  summary: string;
  indexable: boolean;
};

/**
 * Deliberate growth stages (audit sec. 5.5). A record moves up only on evidence, so the directory
 * can grow without loosening the publication gate.
 */
export const publicationTiers: PublicationTier[] = [
  {
    tier: 0,
    name: "Discovered record",
    summary:
      "Internal or preview only: basic identity, source pending, excluded from search indexing, sitemaps and business structured data.",
    indexable: false,
  },
  {
    tier: 1,
    name: "Source-checked directory record",
    summary:
      "Name, normalized category, precise locality, a phone or official website, an auditable source with a check date and a reviewed description. Publishable.",
    indexable: true,
  },
  {
    tier: 2,
    name: "Enhanced record",
    summary:
      "A source-checked record that also carries verified coordinates, a real image of the business, service detail and hours, so the profile answers more than a phone number would.",
    indexable: true,
  },
  {
    tier: 3,
    name: "Trusted and owner-maintained record",
    summary:
      "An enhanced record maintained by a verified owner, with correction history and — where available — approved first-party reviews.",
    indexable: true,
  },
];

/** Enhanced tier needs evidence a phone book cannot supply: a real photo, geo and service depth. */
function hasEnhancedEvidence(listing: Listing): boolean {
  const detailSignals = [
    isVerifiedListingImage(listing),
    Boolean(listing.coordinates),
    (listing.services?.length ?? 0) >= 3,
    Boolean(listing.hoursToday?.trim()),
  ].filter(Boolean).length;
  return isVerifiedListingImage(listing) && detailSignals >= 3;
}

export function listingPublicationTier(listing: Listing): PublicationTier {
  if (!isIndexableListing(listing)) return publicationTiers[0];
  const ownerMaintained =
    listing.verificationStatus === "owner_verified" && listing.claimed && listing.verified;
  if (ownerMaintained && hasEnhancedEvidence(listing)) return publicationTiers[3];
  if (hasEnhancedEvidence(listing)) return publicationTiers[2];
  return publicationTiers[1];
}

/** Public status wording for a single record, always drawn from {@link trustVocabulary}. */
export function listingTrustLabels(listing: Listing): TrustLabel[] {
  const labels: TrustLabel[] = [];
  if (isIndexableListing(listing)) labels.push(trustVocabulary.qualified);
  if (listing.verificationStatus === "owner_verified" && listing.claimed) {
    labels.push(trustVocabulary.ownershipVerified);
  } else if (listing.sourceCheckedAt && listing.sourceRef) {
    labels.push(trustVocabulary.sourceChecked);
  }
  return labels;
}
