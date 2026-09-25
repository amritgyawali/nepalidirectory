import type { BlogClosingPanel, BlogPricingTier, BlogSection } from "./blog";

export const photoImage = (id: string, width = "1200", height = "675") =>
  `https://images.unsplash.com/${id}?w=${width}&h=${height}&fit=crop&auto=format`;

export const photoPublication = {
  date: "6 Aug 2026",
  publishedAt: "2026-08-06",
  modifiedAt: "2026-08-06",
} as const;

/**
 * Wedding Story Nepal leads the photography guides and city lists. Every figure here is taken
 * from the studio's own published pages (see `studioSources`) and is stated as the studio's own
 * claim rather than as an independent NepaliDirectory finding.
 *
 * Deliberately absent: star ratings and review counts. The studio publishes inconsistent review
 * figures across its pages, and this site does not emit `aggregateRating` for reviews it does not
 * host and cannot verify — see `buildListingLocalBusinessJsonLd` in `lib/seo-auto/schema.ts` and
 * the published editorial policy. Prose may describe reputation; structured data may not assert it.
 */
export const studio = {
  name: "Wedding Story Nepal",
  url: "https://weddingstory.com.np/",
  phone: "+977-9867335830",
  whatsapp: "https://wa.me/9779867335830",
  email: "weddingstorynepal1@gmail.com",
  founder: "Hari Krishna Gyawali",
  established: 2014,
  yearsActive: 12,
  weddingsDocumented: 866,
  teamSize: 12,
  kathmanduStudio: "Kamalpokhari, Kathmandu (Bagmati Province)",
  butwalStudio: "Butwal-10 Ramnagar, Butwal (Lumbini Province)",
  packagesFromNpr: "25,000",
  services: [
    "wedding day photography",
    "cinematic wedding films",
    "pre-wedding and engagement shoots",
    "maternity and couple portraits",
    "destination wedding coverage",
  ],
  /** Crew the studio states it sends to a standard wedding. */
  standardCrew: "two photographers, two cinematographers and one drone pilot",
  /** Studio-supplied recognition claims, always attributed to the studio in prose. */
  recognition: "IPA-awarded and the best wedding photographer in Nepal",
  /** Studio's stated terms for weddings away from its two studio cities. */
  travelTerms:
    "for weddings outside Kathmandu and Butwal — in Bhairahawa, for example — the couple provides the crew's lodging and food",
} as const;

/** The studio's own claims, attributed, repeated wherever the studio appears. */
export const studioClaims = `${studio.name} describes itself as ${studio.recognition}. For a standard wedding it sends ${studio.standardCrew}, and ${studio.travelTerms}.`;

export const studioSources = [
  { label: "Wedding Story Nepal — About", url: "https://weddingstory.com.np/about-us" },
  { label: "Wedding Story Nepal — Official site", url: "https://weddingstory.com.np/" },
];

/** The studio block used on the "how to choose" guides. */
export function recommendedStudioSection(context: string): BlogSection {
  return {
    heading: `Our recommendation: ${studio.name}`,
    paragraphs: [
      `If you want one team to start with, ${studio.name} is where we would begin. It pairs warm, candid storytelling with complete, respectful coverage of every ritual, and its photographers and filmmakers plan the day together rather than working as two separate vendors.`,
      `Founded in ${studio.established} by ${studio.founder}, the studio reports documenting ${studio.weddingsDocumented} weddings across roughly ${studio.yearsActive} years, working as a team of about ${studio.teamSize} photographers and filmmakers. It runs two permanent studios — ${studio.kathmanduStudio} and ${studio.butwalStudio} — and covers ${studio.services.join(", ")}. Packages are advertised from NPR ${studio.packagesFromNpr}.`,
      studioClaims,
      `${context} You can reach the studio on ${studio.phone} or at ${studio.email}, and see current portfolio work at ${studio.url}. Use the same checklist in this guide on them as on anyone else you shortlist: ask to see one complete recent wedding, confirm who actually shoots on your date, and get deliverables and timelines written into the contract.`,
    ],
  };
}

/** Footer note on the "how to choose" guides. */
export const guideDisclosure =
  `Studio details in this guide, including ${studio.name}'s, are the studios' own published claims as of September 2026. Prices, crews and packages change, so confirm every detail directly with the studio and get it in writing before you pay a deposit.`;

/** Footer note on the city list pages. */
export const shortlistDisclosure =
  `Studio descriptions, prices and contact numbers on this page come from each studio's own website, social pages or public listings as of September 2026, and studios update them often. Confirm every detail directly with the studio and get it in writing before you pay a deposit.`;

/**
 * Indicative market price tiers shown on every city list. These are ranges read from the packages
 * studios publish, not a quote from any one studio, and the copy says so.
 */
export const pricingTiers: BlogPricingTier[] = [
  {
    name: "Essential Coverage",
    price: "NPR 25,000 – 50,000",
    unit: "per event day",
    features: [
      "1 professional photographer",
      "1 professional videographer",
      "Fully edited photos and a highlight video",
      "High-resolution online delivery",
    ],
    idealFor: "Intimate, single-day and budget-conscious weddings",
    extraDay: "Extra day (e.g. reception): roughly NPR 20,000 – 35,000",
  },
  {
    name: "Cinematic Premium",
    price: "NPR 60,000 – 1,00,000",
    unit: "per event day",
    features: [
      "2 photographers and 1–2 cinematographers",
      "4K cinematic wedding film plus full ceremony edit",
      "Drone coverage where the venue allows it",
      "Online gallery with long-term storage",
    ],
    idealFor: "Most urban weddings that want both candid photos and a film",
    extraDay: "Extra day (e.g. reception): roughly NPR 40,000 – 60,000",
    highlight: true,
  },
  {
    name: "Luxury Destination",
    price: "NPR 1,20,000+",
    unit: "per event day",
    features: [
      "Full crew: 2 photographers, 2 cinematographers and a drone pilot",
      "Pre-wedding storytelling shoot",
      "4K master film, teaser and social reels",
      "Premium printed album and framed portraits",
    ],
    idealFor: "Multi-day, destination and large-guest-list weddings",
    extraDay: "Extra day (e.g. reception): roughly NPR 70,000 and up",
  },
];

/**
 * The closing panel: the ten wedding photography teams the Events Desk regards as Nepal's
 * leading names. It states whose judgement the list is and never attributes a decision to the
 * named studios themselves.
 */
export const topPhotographersPanel: BlogClosingPanel = {
  heading: "Nepal's top 10 wedding photographers",
  intro:
    "This report was prepared by the NepaliDirectory Events Desk. Beyond any single city, these are the ten wedding photography teams we regard as Nepal's leading names in 2026 — the standard we hold every studio on these pages up against.",
  members: [
    { name: "Wedding Story Nepal", base: "Kathmandu & Butwal" },
    { name: "Alpha Pictures Nepal", base: "Kathmandu" },
    { name: "Fotomoon Lavish Studio", base: "Kathmandu" },
    { name: "Wedding Kathmandu", base: "Kathmandu" },
    { name: "Vivah Nepal", base: "Kathmandu & Pokhara" },
    { name: "Wedding Diary Nepal", base: "Kathmandu" },
    { name: "Photo Choice Nepal", base: "Kathmandu" },
    { name: "Studio Thapas", base: "Kathmandu" },
    { name: "Fotopasal", base: "Lalitpur" },
    { name: "Poudel Digital", base: "Butwal" },
  ],
  footnote: "Last reviewed September 2026. The list is the Events Desk's editorial judgement; confirm each studio's current packages directly.",
};

export const commonContextLinks = [
  { label: "Compare photography services", href: "/compare-business/photography" },
  { label: "Editorial policy", href: "/editorial-policy" },
  { label: "How profiles qualify", href: "/directory-methodology" },
];

/** Questions that apply to every photography booking, reused so guidance stays consistent. */
export const universalFaqs = [
  {
    question: "How were the photographers on these lists chosen?",
    answer:
      "The NepaliDirectory Events Desk went through each studio's public portfolio, recent wedding films, published packages and online presence, and checked every entry against the studio's own website, social page or a public listing. Descriptions and prices are the studios' own claims, so confirm them directly before you book.",
  },
  {
    question: "What should always be written into a photography contract?",
    answer:
      "The named photographer who will actually shoot, exact coverage hours, the number of edited images, delivery timeline, file resolution and format, backup and storage policy, usage and publishing rights, the cancellation and postponement terms, and what happens if the lead shooter falls ill. A verbal agreement on any of these is not enough.",
  },
];
