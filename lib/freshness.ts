import type { Listing } from "@/lib/enrich";

/**
 * Fact-level re-check cadence (audit sec. 23).
 *
 * A single "last checked" date treats a phone number and a founding year as equally perishable.
 * They are not: closures and hours change within a quarter, an address rarely does. Recording the
 * intended interval per fact type lets the review queue prioritise the facts that actually go
 * stale, and lets the public profile say what its date does and does not cover.
 */
export type FreshnessFactType =
  | "contactability"
  | "website"
  | "openingHours"
  | "address"
  | "services"
  | "credentials"
  | "ownership"
  | "staticHistory";

export type FreshnessRule = {
  factType: FreshnessFactType;
  label: string;
  reviewIntervalDays: number;
  note: string;
};

export const freshnessRules: readonly FreshnessRule[] = [
  {
    factType: "contactability",
    label: "Phone and closure status",
    reviewIntervalDays: 90,
    note: "The fastest-moving facts: a disconnected number or a closed business makes the whole profile wrong.",
  },
  {
    factType: "website",
    label: "Official website",
    reviewIntervalDays: 90,
    note: "Domains lapse and redirect; an expired domain can end up pointing somewhere unrelated.",
  },
  {
    factType: "openingHours",
    label: "Opening hours",
    reviewIntervalDays: 60,
    note: "Seasonal and festival changes are common, so hours carry the shortest interval.",
  },
  {
    factType: "address",
    label: "Address and locality",
    reviewIntervalDays: 180,
    note: "Relocation is comparatively rare but invalidates directions, maps and city assignment.",
  },
  {
    factType: "services",
    label: "Services and service area",
    reviewIntervalDays: 180,
    note: "Service lists drift slowly; owner updates should take priority over re-checks.",
  },
  {
    factType: "credentials",
    label: "Credentials and registrations",
    reviewIntervalDays: 180,
    note: "Regulated categories need the registering authority, not the business, as the source.",
  },
  {
    factType: "ownership",
    label: "Ownership and claim status",
    reviewIntervalDays: 365,
    note: "Re-checked annually or when a claim, dispute or transfer event is raised.",
  },
  {
    factType: "staticHistory",
    label: "Founding year and history",
    reviewIntervalDays: 365,
    note: "Effectively static; reviewed annually to catch mistakes rather than change.",
  },
];

/** The interval that governs whether a profile's overall check date is stale. */
export const PRIMARY_FRESHNESS_INTERVAL_DAYS = 90;

export type ListingFreshness = {
  checkedAt: Date | null;
  daysSinceCheck: number | null;
  /** Fact types whose re-check interval has elapsed since the last source check. */
  overdueFacts: FreshnessRule[];
  /** True when the fastest-moving facts are past their interval, or never checked at all. */
  stale: boolean;
};

export function daysBetween(from: Date, to: Date): number {
  return Math.max(0, Math.floor((to.getTime() - from.getTime()) / 86_400_000));
}

export function evaluateListingFreshness(
  listing: Listing,
  now: Date = new Date(),
): ListingFreshness {
  const raw = listing.sourceCheckedAt ?? null;
  const checkedAt = raw && !Number.isNaN(new Date(raw).getTime()) ? new Date(raw) : null;
  if (!checkedAt) {
    return {
      checkedAt: null,
      daysSinceCheck: null,
      overdueFacts: [...freshnessRules],
      stale: true,
    };
  }

  const daysSinceCheck = daysBetween(checkedAt, now);
  const overdueFacts = freshnessRules.filter(
    (rule) => daysSinceCheck >= rule.reviewIntervalDays,
  );
  return {
    checkedAt,
    daysSinceCheck,
    overdueFacts,
    stale: daysSinceCheck >= PRIMARY_FRESHNESS_INTERVAL_DAYS,
  };
}

/** Re-check queue: the stalest qualified records first. */
export function selectStaleListings(
  listings: readonly Listing[],
  now: Date = new Date(),
): Array<{ listing: Listing; freshness: ListingFreshness }> {
  return listings
    .map((listing) => ({ listing, freshness: evaluateListingFreshness(listing, now) }))
    .filter((entry) => entry.freshness.stale)
    .sort((a, b) => (b.freshness.daysSinceCheck ?? Infinity) - (a.freshness.daysSinceCheck ?? Infinity));
}
