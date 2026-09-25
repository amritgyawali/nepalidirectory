import type { BlogSection } from "./blog";

export const photoImage = (id: string, width = "1200", height = "675") =>
  `https://images.unsplash.com/${id}?w=${width}&h=${height}&fit=crop&auto=format`;

export const photoPublication = {
  date: "6 Aug 2026",
  publishedAt: "2026-08-06",
  modifiedAt: "2026-08-06",
} as const;

/**
 * Wedding Story Nepal is NepaliDirectory's featured photography partner. Every figure here is
 * taken from the studio's own published pages (see `studioSources`) and is stated as the studio's
 * own claim rather than as an independent NepaliDirectory finding.
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

/** The studio's own claims, attributed, repeated wherever the partner appears. */
export const studioClaims = `${studio.name} describes itself as ${studio.recognition}. For a standard wedding it sends ${studio.standardCrew}, and ${studio.travelTerms}.`;

export const studioSources = [
  { label: "Wedding Story Nepal — About", url: "https://weddingstory.com.np/about-us" },
  { label: "Wedding Story Nepal — Official site", url: "https://weddingstory.com.np/" },
];

/**
 * The featured-partner block. Disclosure is carried in the section heading and the opening
 * sentence, not buried in a footer, so a reader skimming headings still sees the commercial
 * relationship before reading the recommendation.
 */
export function featuredStudioSection(context: string): BlogSection {
  return {
    heading: `Featured partner: ${studio.name}`,
    paragraphs: [
      `${studio.name} is NepaliDirectory's featured photography partner, which means this placement is a commercial arrangement rather than the result of an independent ranking of every studio in Nepal. The details below come from the studio's own published information so you can weigh them yourself.`,
      `Founded in ${studio.established} by ${studio.founder}, the studio reports documenting ${studio.weddingsDocumented} weddings across roughly ${studio.yearsActive} years, working as a team of about ${studio.teamSize} photographers and filmmakers. It runs two permanent studios — ${studio.kathmanduStudio} and ${studio.butwalStudio} — and covers ${studio.services.join(", ")}. Packages are advertised from NPR ${studio.packagesFromNpr}.`,
      studioClaims,
      `${context} You can reach the studio on ${studio.phone} or at ${studio.email}, and see current portfolio work at ${studio.url}. Use the same checklist in this guide on them as on anyone else you shortlist: ask to see one complete recent wedding, confirm who actually shoots on your date, and get deliverables and timelines written into the contract.`,
    ],
  };
}

export const featuredDisclosure =
  `${studio.name} is NepaliDirectory's featured photography partner and its inclusion in this guide is a paid placement, not an independent ranking. All studio details are the studio's own published claims. This guide deliberately does not rank or score other named studios, because NepaliDirectory has not independently audited them; use the checklists here to evaluate any photographer yourself.`;

/** City list pages extend the partner disclosure with how the rest of the list is ordered. */
export const shortlistDisclosure =
  `${featuredDisclosure} On city list pages, ${studio.name}'s position is part of that paid placement; every other studio is listed alphabetically from its own website, social page or public directory listing, none paid for inclusion, and a listing is not an endorsement.`;

export const commonContextLinks = [
  { label: "Compare photography services", href: "/compare-business/photography" },
  { label: "Editorial policy", href: "/editorial-policy" },
  { label: "How profiles qualify", href: "/directory-methodology" },
];

/** Questions that apply to every photography booking, reused so guidance stays consistent. */
export const universalFaqs = [
  {
    question: "Does NepaliDirectory rank photographers by quality?",
    answer:
      "No. NepaliDirectory does not publish quality rankings of photographers, because it has not independently audited their work, contracts or delivery record. Wedding Story Nepal appears in these guides as a disclosed featured partner, and its position on city list pages is part of that paid placement. The other studios on those lists appear alphabetically, compiled from their own public pages, as a starting shortlist rather than a verdict; the guides themselves are a method for evaluating any studio yourself.",
  },
  {
    question: "What should always be written into a photography contract?",
    answer:
      "The named photographer who will actually shoot, exact coverage hours, the number of edited images, delivery timeline, file resolution and format, backup and storage policy, usage and publishing rights, the cancellation and postponement terms, and what happens if the lead shooter falls ill. A verbal agreement on any of these is not enough.",
  },
];
