/**
 * Free, no-provider reasoning brain for the public AI assistant.
 *
 * This is a deterministic, zero-external-call "small language understanding" layer: it classifies
 * the visitor's intent, extracts entities (category, location, modifiers) with colloquial-synonym
 * expansion, and produces intent-aware answer text plus grounded follow-up suggestions. It never
 * invents a business — the caller (`autopilot.ts`) only ever surfaces listings that exist in the
 * directory data. When a real LLM provider is configured, the concierge upgrades transparently;
 * this brain remains the always-on floor so the site is fully usable with no keys and no budget.
 */
import { businesses, categories, categoryGroups, cities, cityLinks, type Business } from "@/lib/data";

export type AiIntent =
  | "greeting"
  | "help"
  | "find"
  | "recommend"
  | "compare"
  | "deals"
  | "open_now"
  | "emergency"
  | "directions"
  | "plan";

export type AiModifiers = {
  openNow: boolean;
  is24h: boolean;
  emergency: boolean;
  topRated: boolean;
  budget: boolean;
  verified: boolean;
  delivery: boolean;
  nearMe: boolean;
};

export type QueryInterpretation = {
  raw: string;
  intent: AiIntent;
  categoryHint?: string;
  /** Canonical directory-category names the query maps to (via synonyms). */
  categories: string[];
  location: string;
  locationExplicit: boolean;
  modifiers: AiModifiers;
  terms: string[];
};

export type AiActionType = "call" | "website" | "directions" | "search" | "compare" | "deals";

export type AiAction = {
  type: AiActionType;
  label: string;
  href: string;
  external?: boolean;
};

const DEFAULT_LOCATION = "Kathmandu, Bagmati";

function norm(value: string): string {
  return value.toLowerCase().trim();
}

/**
 * Colloquial / intent phrase -> canonical directory category. Kept broad on purpose so everyday
 * language ("my tooth hurts", "pipe is leaking", "somewhere to stay") resolves to real categories.
 */
const SYNONYMS: Array<{ match: string[]; category: string }> = [
  { category: "Restaurants", match: ["restaurant", "food", "eat", "eating", "dinner", "lunch", "breakfast", "cuisine", "momo", "thakali", "newari food", "dining", "meal", "hungry", "buffet"] },
  { category: "Cafes & Bistros", match: ["cafe", "coffee", "espresso", "bistro", "brunch"] },
  { category: "Hotels", match: ["hotel", "stay", "room", "lodge", "accommodation", "resort", "guesthouse", "guest house", "where to sleep", "night stay"] },
  { category: "Doctors", match: ["doctor", "clinic", "hospital", "sick", "ill", "fever", "health", "physician", "checkup", "unwell", "medical"] },
  { category: "Dentists", match: ["dentist", "tooth", "teeth", "dental", "toothache", "braces", "cavity"] },
  { category: "Pharmacies", match: ["pharmacy", "medicine", "medical shop", "drugstore", "chemist", "tablets"] },
  { category: "Plumbers", match: ["plumber", "plumbing", "pipe", "leak", "leaking", "tap", "water line", "drain", "blocked drain", "faucet"] },
  { category: "Electricians", match: ["electrician", "electric", "electrical", "wiring", "power", "socket", "short circuit", "fuse", "light not working", "inverter"] },
  { category: "Lawyers", match: ["lawyer", "legal", "advocate", "law", "court", "attorney", "notary", "legal advice"] },
  { category: "Auto Repair", match: ["auto repair", "mechanic", "car repair", "bike repair", "vehicle", "garage", "servicing", "puncture", "car", "motorcycle"] },
  { category: "Beauty Salons", match: ["salon", "haircut", "beauty", "spa", "makeup", "parlour", "parlor", "facial", "grooming"] },
  { category: "Schools", match: ["school", "college", "tuition", "study", "education", "class", "coaching", "institute", "academy"] },
  { category: "Contractors", match: ["contractor", "construction", "renovation", "build", "builder", "civil work"] },
  { category: "Hospitals", match: ["hospital", "emergency room", "er", "ambulance", "icu"] },
];

/** Every category label we know about, canonicalised, for direct/near matches. */
const KNOWN_CATEGORIES: string[] = [
  ...new Set([
    ...categories.map((c) => c.name),
    ...categoryGroups.flatMap((g) => g.items),
    ...businesses.flatMap((b) => b.categories),
  ]),
];

const KNOWN_PLACES: string[] = [
  ...new Set([
    ...cities.map((c) => c.name),
    ...cityLinks,
    ...businesses.flatMap((b) => [b.area, b.neighborhood ?? ""].filter(Boolean)),
  ]),
];

function detectModifiers(haystack: string): AiModifiers {
  const has = (...needles: string[]) => needles.some((n) => haystack.includes(n));
  return {
    openNow: has("open now", "open right now", "still open", "currently open"),
    is24h: has("24 hour", "24hour", "24h", "24/7", "all night", "round the clock", "midnight", "late night"),
    emergency: has("emergency", "urgent", "asap", "right now", "immediately"),
    topRated: has("best", "top rated", "top-rated", "highest rated", "recommend", "good", "great", "reliable", "trusted"),
    budget: has("cheap", "budget", "affordable", "low cost", "inexpensive", "economical"),
    verified: has("verified", "trusted", "genuine", "authentic"),
    delivery: has("delivery", "deliver", "home delivery", "order online", "takeaway"),
    nearMe: has("near me", "nearby", "near by", "close to me", "around me", "closest"),
  };
}

function detectIntent(haystack: string, mods: AiModifiers): AiIntent {
  const has = (...needles: string[]) => needles.some((n) => haystack.includes(n));
  if (has("hello", "hi ", "hey", "namaste", "namaskar") || haystack === "hi") return "greeting";
  if (has("what can you do", "how do you work", "help me", "who are you", "what do you do")) return "help";
  if (has("deal", "offer", "discount", "coupon", "promo", "save money", "cashback")) return "deals";
  if (has("compare", " vs ", "versus", "difference between", "which is better")) return "compare";
  if (has("direction", "how to get", "how do i get", "route to", "where is", "map of", "navigate")) return "directions";
  if (mods.emergency) return "emergency";
  if (has("trip", "visit", "weekend", "itinerary", "plan a", "things to do", "tour", "explore", "day out")) return "plan";
  if (mods.openNow || mods.is24h) return "open_now";
  if (mods.topRated || has("suggest", "recommendation")) return "recommend";
  return "find";
}

function expandCategories(haystack: string): { categories: string[]; categoryHint?: string } {
  const matched = new Set<string>();
  let hint: string | undefined;

  // Direct category-name hits win first (most specific).
  for (const cat of KNOWN_CATEGORIES) {
    if (haystack.includes(norm(cat))) {
      matched.add(cat);
      hint ??= cat;
    }
  }
  // Then colloquial synonym expansion.
  for (const entry of SYNONYMS) {
    if (entry.match.some((m) => haystack.includes(m))) {
      matched.add(entry.category);
      hint ??= entry.category;
    }
  }
  return { categories: [...matched], categoryHint: hint };
}

function detectLocation(haystack: string, requestedLocation: string | undefined): { location: string; explicit: boolean } {
  if (requestedLocation?.trim()) return { location: requestedLocation.trim(), explicit: true };
  // Longest place name first so "Kathmandu" beats a substring city.
  const sorted = [...KNOWN_PLACES].sort((a, b) => b.length - a.length);
  for (const place of sorted) {
    if (place && haystack.includes(norm(place))) return { location: place, explicit: true };
  }
  return { location: DEFAULT_LOCATION, explicit: false };
}

export function interpretQuery(raw: string, requestedLocation?: string): QueryInterpretation {
  const clean = raw.trim();
  const haystack = ` ${norm(clean)} `;
  const modifiers = detectModifiers(haystack);
  const intent = detectIntent(haystack, modifiers);
  const { categories: cats, categoryHint } = expandCategories(haystack);
  const { location, explicit } = detectLocation(haystack, requestedLocation);
  const terms = norm(clean)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1);

  return {
    raw: clean,
    intent,
    categoryHint,
    categories: cats,
    location,
    locationExplicit: explicit,
    modifiers,
    terms,
  };
}

/** Human-readable reason a business surfaced, shown under each result. */
export function explainMatch(business: Business, interp: QueryInterpretation): string {
  const bits: string[] = [];
  const statusText = business.status === "24h" ? "Open 24h" : business.status === "open" ? "Open now" : "Currently closed";
  bits.push(statusText);
  bits.push(`${business.rating.toFixed(1)}★ (${business.reviews.toLocaleString()})`);

  const catHit = interp.categories.find((c) =>
    business.categories.some((bc) => norm(bc).includes(norm(c)) || norm(c).includes(norm(bc))),
  );
  if (catHit) bits.push(`matches ${catHit.toLowerCase()}`);
  else if (interp.categoryHint) bits.push(`related to ${interp.categoryHint.toLowerCase()}`);

  if (business.verified) bits.push("verified");
  if (interp.modifiers.delivery && business.delivery) bits.push("offers delivery");
  if (interp.modifiers.budget && business.price <= 2) bits.push("budget friendly");
  if ((interp.intent === "deals") && business.coupons?.length) bits.push(`${business.coupons.length} live offer${business.coupons.length === 1 ? "" : "s"}`);
  bits.push(business.area);
  return bits.join(" · ");
}

/** Contextual follow-up chips that keep the visitor moving, tailored to the interpretation. */
export function buildFollowups(interp: QueryInterpretation, topName?: string): string[] {
  const cat = interp.categoryHint ?? interp.categories[0];
  const loc = interp.locationExplicit ? interp.location.split(",")[0] : "Kathmandu";
  const followups: string[] = [];

  switch (interp.intent) {
    case "greeting":
    case "help":
      return ["Emergency plumber in Kathmandu", "Best Newari food in Bhaktapur", "Dentist open now", "Hotels in Pokhara with pickup"];
    case "deals":
      followups.push(cat ? `Best ${cat.toLowerCase()} deals in ${loc}` : `Top offers in ${loc}`, "Restaurants with coupons", "Verified businesses only");
      break;
    case "compare":
      if (topName) followups.push(`Directions to ${topName}`, `${topName} reviews`);
      followups.push(cat ? `Cheapest ${cat.toLowerCase()} in ${loc}` : `Top rated in ${loc}`);
      break;
    case "emergency":
    case "open_now":
      followups.push(cat ? `24-hour ${cat.toLowerCase()} in ${loc}` : `Open 24 hours in ${loc}`, "Nearest verified option", topName ? `Call ${topName}` : "Emergency services");
      break;
    case "plan":
      followups.push(`Best restaurants in ${loc}`, `Hotels in ${loc}`, `Things to do in ${loc}`);
      break;
    default:
      followups.push(
        cat ? `Best ${cat.toLowerCase()} in ${loc}` : `Top rated in ${loc}`,
        cat ? `${cat} open now` : "Open now near me",
        cat ? `Cheapest ${cat.toLowerCase()}` : `Deals in ${loc}`,
      );
  }
  return [...new Set(followups.filter(Boolean))].slice(0, 4);
}
