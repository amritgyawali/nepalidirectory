import { businesses, type Business } from "@/lib/data";
import {
  buildFollowups,
  explainMatch,
  interpretQuery,
  type AiAction,
  type AiIntent,
  type QueryInterpretation,
} from "./brain";

export type PublicAiMode = "free-local" | "provider";

export type PublicAiListing = {
  id: number;
  slug: string;
  name: string;
  href: string;
  area: string;
  neighborhood?: string;
  categories: string[];
  phone: string;
  website?: string;
  rating: number;
  reviews: number;
  status: Business["status"];
  hoursToday: string;
  verified: boolean;
  score: number;
  qualityScore: number;
  /** Plain-language reason this result surfaced for the query. */
  why: string;
};

export type PublicAiReply = {
  mode: PublicAiMode;
  intent: AiIntent;
  message: string;
  listings: PublicAiListing[];
  followups: string[];
  actions: AiAction[];
  demandSignalRecorded: boolean;
  parsed: {
    query: string;
    location?: string;
    categoryHint?: string;
    intent: AiIntent;
    mode: PublicAiMode;
  };
};

const KATHMANDU_VALLEY = [
  "kathmandu",
  "lalitpur",
  "patan",
  "bhaktapur",
  "thamel",
  "lazimpat",
  "boudha",
  "baneshwor",
  "dilli bazar",
  "tripureshwor",
  "kirtipur",
];

function norm(value: string): string {
  return value.toLowerCase().trim();
}

function businessHref(business: Business): string {
  return business.slug === "newa-lahana" ? "/business/newa-lahana" : `/search?q=${encodeURIComponent(business.name)}`;
}

function mapsHref(business: Business): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name} ${business.area} Nepal`)}`;
}

function scoreBusiness(business: Business, interp: QueryInterpretation): number {
  const haystack = norm(
    [
      business.name,
      business.area,
      business.neighborhood ?? "",
      business.address,
      ...business.categories,
      ...business.amenities,
      ...(business.services ?? []),
      ...(business.specialties ?? []),
      ...(business.serviceAreas ?? []),
    ].join(" "),
  );

  let score = 0;

  // Free-text term overlap.
  for (const term of interp.terms) {
    if (haystack.includes(term)) score += 6;
  }

  // Category intent — the strongest grounding signal.
  if (interp.categories.length) {
    const catMatch = interp.categories.some((c) =>
      business.categories.some((bc) => norm(bc).includes(norm(c)) || norm(c).includes(norm(bc))),
    );
    if (catMatch) score += 42;
  }

  // Location grounding, with Kathmandu-valley grouping.
  if (interp.locationExplicit) {
    const locTokens = norm(interp.location)
      .split(/[,\s]+/)
      .filter((t) => t.length > 2);
    const locText = norm([business.area, business.neighborhood ?? "", ...(business.serviceAreas ?? [])].join(" "));
    if (locTokens.some((t) => locText.includes(t))) score += 26;
    else if (norm(interp.location).includes("kathmandu") && KATHMANDU_VALLEY.some((v) => locText.includes(v))) score += 10;
  }

  const isOpen = business.status === "open" || business.status === "24h";
  const { modifiers, intent } = interp;

  if (modifiers.openNow || intent === "open_now") score += isOpen ? 16 : -22;
  if (modifiers.is24h) score += business.status === "24h" ? 20 : -8;
  if (intent === "emergency" || modifiers.emergency) score += business.status === "24h" ? 18 : isOpen ? 9 : -12;
  if (modifiers.topRated || intent === "recommend") score += business.rating * 6;
  if (modifiers.budget) score += (4 - business.price) * 5;
  if (modifiers.verified) score += business.verified ? 10 : -6;
  if (modifiers.delivery) score += business.delivery ? 12 : -4;
  if (intent === "deals") score += (business.coupons?.length ?? 0) * 22;

  // Baseline quality so results are never arbitrary.
  score +=
    business.rating * 5 +
    Math.log10(business.reviews + 1) * 3 +
    (business.verified ? 5 : 0) +
    (business.claimed ? 3 : 0) +
    (business.status === "24h" ? 4 : business.status === "open" ? 2 : 0);

  return score;
}

function qualityScore(business: Business): number {
  return Math.min(100, Math.round(72 + business.rating * 4 + (business.verified ? 6 : 0) + (business.claimed ? 4 : 0)));
}

function toListing(business: Business, score: number, interp: QueryInterpretation): PublicAiListing {
  return {
    id: business.rank,
    slug: business.slug,
    name: business.name,
    href: businessHref(business),
    area: business.area,
    neighborhood: business.neighborhood,
    categories: business.categories,
    phone: business.phone,
    website: business.website,
    rating: business.rating,
    reviews: business.reviews,
    status: business.status,
    hoursToday: business.hoursToday,
    verified: Boolean(business.verified),
    score: Number(score.toFixed(3)),
    qualityScore: qualityScore(business),
    why: explainMatch(business, interp),
  };
}

function rankBusinesses(interp: QueryInterpretation): Array<{ business: Business; score: number }> {
  return businesses
    .map((business) => ({ business, score: scoreBusiness(business, interp) }))
    .sort((a, b) => b.score - a.score);
}

function statusPhrase(listing: PublicAiListing): string {
  return listing.status === "24h" ? "open 24 hours" : listing.status === "open" ? "open now" : "currently closed";
}

function composeMessage(interp: QueryInterpretation, listings: PublicAiListing[]): string {
  if (listings.length === 0) {
    return `I couldn't find a grounded match for "${interp.raw}" in ${interp.location}. I've logged it as unmet demand — I can widen the category or the area if you tell me more.`;
  }

  const top = listings[0];
  const backups = listings
    .slice(1, 3)
    .map((l) => l.name)
    .join(", ");
  const backupLine = backups ? ` Backup options: ${backups}.` : "";
  const count = `${listings.length} grounded match${listings.length === 1 ? "" : "es"}`;

  switch (interp.intent) {
    case "greeting":
      return `Namaste! I'm the Nepali Directory AI assistant. I search verified local businesses across Nepal and hand you straight to calls, directions and offers. For example, ${top.name} in ${top.area} is a strong pick right now (${top.rating.toFixed(1)}★). What are you looking for?`;
    case "help":
      return `I can find businesses, compare options, surface deals, flag what's open now and route you to directions — all grounded in real directory data. Try "emergency plumber in Kathmandu" or "best Newari food in Bhaktapur". Right now ${top.name} is a solid example (${top.rating.toFixed(1)}★, ${statusPhrase(top)}).`;
    case "deals": {
      const withOffer = listings.find((l) => l.slug === top.slug);
      return `Here are ${count} for deals on "${interp.raw}". ${withOffer?.name ?? top.name} in ${top.area} is worth a look — ${top.rating.toFixed(1)}★, ${statusPhrase(top)}, phone ${top.phone}. Tap "Browse all deals" to see every live offer.${backupLine}`;
    }
    case "compare": {
      const second = listings[1];
      if (second) {
        return `Comparing your top options: ${top.name} (${top.rating.toFixed(1)}★, ${top.reviews.toLocaleString()} reviews, ${statusPhrase(top)}) vs ${second.name} (${second.rating.toFixed(1)}★, ${second.reviews.toLocaleString()} reviews, ${statusPhrase(second)}). ${top.name} edges ahead on overall match; ${second.name} is the strongest alternative.`;
      }
      return `${top.name} in ${top.area} is the clear pick for "${interp.raw}" — ${top.rating.toFixed(1)}★, ${statusPhrase(top)}.`;
    }
    case "emergency":
      return `For an urgent need I've found ${count}. Call ${top.name} first — ${statusPhrase(top)}, phone ${top.phone}, in ${top.area}, ${top.rating.toFixed(1)}★.${backupLine}`;
    case "open_now":
      return `${count} for "${interp.raw}". ${top.name} is ${statusPhrase(top)} in ${top.area} — ${top.rating.toFixed(1)}★, phone ${top.phone}.${backupLine}`;
    case "directions":
      return `${top.name} in ${top.area} is your best match. ${top.rating.toFixed(1)}★, ${statusPhrase(top)}. Tap "Directions" for turn-by-turn, or call ${top.phone}.${backupLine}`;
    case "plan":
      return `Here's a grounded starting point for "${interp.raw}" around ${interp.location}. Begin with ${top.name} in ${top.area} (${top.rating.toFixed(1)}★).${backupLine} Ask me for hotels, food or things to do and I'll build it out.`;
    default:
      return `I found ${count} for "${interp.raw}" in ${interp.location}. Start with ${top.name} in ${top.area}: ${top.rating.toFixed(1)}★ from ${top.reviews.toLocaleString()} reviews, ${statusPhrase(top)}, phone ${top.phone}.${backupLine}`;
  }
}

function buildActions(interp: QueryInterpretation, top: Business | undefined): AiAction[] {
  const actions: AiAction[] = [];
  if (top) {
    if (top.phone) actions.push({ type: "call", label: `Call ${top.name}`, href: `tel:${top.phone.replace(/[^0-9+]/g, "")}` });
    actions.push({ type: "directions", label: "Directions", href: mapsHref(top), external: true });
  }
  if (interp.intent === "deals") actions.push({ type: "deals", label: "Browse all deals", href: "/deals" });
  if (interp.intent === "compare") actions.push({ type: "compare", label: "Compare businesses", href: "/compare-business" });
  return actions;
}

/**
 * Grounded local autopilot: interprets the query, ranks real directory businesses, and returns an
 * intent-aware answer with follow-ups and quick actions. Zero external calls.
 */
export function localAutopilotSearch(query: string, location?: string, limit = 5): PublicAiReply {
  const interp = interpretQuery(query, location);
  const ranked = rankBusinesses(interp);

  // Keep only meaningfully-scored results, but never return empty when the directory has data:
  // fall back to the best overall picks so the visitor always gets a grounded starting point.
  const positive = ranked.filter((r) => r.score > 8);
  const chosen = (positive.length ? positive : ranked).slice(0, limit);
  const listings = chosen.map(({ business, score }) => toListing(business, score, interp));

  const noRealMatch = positive.length === 0;
  const top = chosen[0]?.business;

  return {
    mode: "free-local",
    intent: interp.intent,
    message: composeMessage(interp, listings),
    listings,
    followups: buildFollowups(interp, listings[0]?.name),
    actions: buildActions(interp, top),
    demandSignalRecorded: noRealMatch,
    parsed: {
      query: interp.raw,
      location: interp.location,
      categoryHint: interp.categoryHint,
      intent: interp.intent,
      mode: "free-local",
    },
  };
}
