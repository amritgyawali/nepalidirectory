import type { BlogFaq, BlogListItem, BlogPost, BlogSection } from "./blog";
import {
  SHORTLIST_CHECKED,
  type ShortlistCitySlug,
  cityListEntryCount,
  cityListHref,
  cityListSlug,
  cityShortlists,
  partnerPosition,
  type ShortlistedStudio,
  sortedShortlist,
  studioShortlistSources,
} from "./photography-city-shortlists";
import {
  commonContextLinks,
  photoImage as image,
  shortlistDisclosure,
  studio,
  studioClaims,
  studioSources,
  universalFaqs,
} from "./photography-partner";

/**
 * "Best wedding photographers in <city>" list pages — the "who to hire" intent. The matching
 * `best-wedding-photographer-<city>` guides keep the "how to choose" intent and link here, so the
 * two never compete for the same query.
 *
 * Wedding Story Nepal is placed first in its two studio cities and second elsewhere. That position
 * is a paid placement and is disclosed in the entry heading, its first sentence, the method
 * section and the footer disclaimer. Every other studio follows alphabetically.
 */
type CityListConfig = {
  slug: ShortlistCitySlug;
  guideSlug: string;
  image: string;
  imageAlt: string;
  /** Two paragraphs on this city's studio market, specific to the place. */
  intro: [string, string];
  /** How the partner's terms apply to this city specifically. */
  partnerContext: string;
  /** One practical tip that closes the page. */
  bookingTip: string;
  faqs: [BlogFaq, BlogFaq];
  extraKeywords: string[];
  citySlugs?: string[];
};

const listPublication = {
  date: "25 Sep 2026",
  publishedAt: "2026-09-25",
  modifiedAt: "2026-09-25",
} as const;

const homeGround = "so the couple does not need to arrange lodging or food for the crew here";
const awayTerms = (city: string) =>
  `${city} is outside the studio's two home cities, so under its stated terms the couple provides the crew's lodging and food; ask for the full travel cost in writing alongside the package price.`;

const cityListConfigs: CityListConfig[] = [
  {
    slug: "kathmandu",
    guideSlug: "best-wedding-photographer-kathmandu",
    image: "photo-1544735716-392fe2489ffa",
    imageAlt: "Buddhist stupa on a ridge below snow-capped Himalayan peaks",
    intro: [
      "Kathmandu has the deepest pool of wedding photographers in Nepal, and more of them publish websites, package tiers and prices than anywhere else in the country. That makes comparison easier here than in most cities: several studios below advertise packages from around NPR 20,000–35,000, with multi-day, two-crew coverage priced well above that.",
      "The harder part is choosing between studios that look similar online. Most offer photography, film and pre-wedding shoots; what separates them is who actually turns up on the day, how they handle valley traffic between venues, and whether they have shot your ceremony tradition before.",
    ],
    partnerContext: `Its main studio is at ${studio.kathmanduStudio}, ${homeGround}.`,
    bookingTip:
      "On a busy wedding date, valley traffic between two family homes and a reception venue can eat an hour. Whoever you book, ask how they split the crew across locations.",
    faqs: [
      {
        question: "How much does a wedding photographer cost in Kathmandu?",
        answer:
          "Published starting prices among the studios on this list mostly sit between about NPR 20,000 and NPR 35,000 for basic coverage, with multi-day, two-crew packages including film costing considerably more. Compare quotes only against the same written brief: crew size, hours, film and deliverables.",
      },
      {
        question: "Do Kathmandu studios charge extra to travel within the valley?",
        answer:
          "Many do not. Photoshoot Nepal, for example, says it charges no travel fee within the Kathmandu Valley. Ask each studio directly, and confirm in writing whether Lalitpur and Bhaktapur venues are treated as local.",
      },
    ],
    extraKeywords: ["top wedding photographers Kathmandu", "wedding photography studio Kathmandu"],
    citySlugs: ["kathmandu"],
  },
  {
    slug: "pokhara",
    guideSlug: "best-wedding-photographer-pokhara",
    image: "photo-1537633552985-df8429e8048b",
    imageAlt: "Bride and groom with a long veil standing on a pebble shore by the water",
    intro: [
      "Pokhara's wedding photographers work two kinds of job: local weddings in party palaces and family homes, and destination weddings for couples who travel in for Phewa Lake, Sarangkot and the Annapurna view. Several of the studios below do both, and some lean towards cinematic destination films.",
      "Booking a Pokhara-based studio removes crew travel from the quote. Booking a visiting studio can make sense if you want a team you already know, but compare the full cost including travel, lodging and food rather than the headline package.",
    ],
    partnerContext: awayTerms("Pokhara"),
    bookingTip:
      "Mountain views are never guaranteed. Whoever you book, agree a lakeside plan that still works if the Annapurna range stays in cloud.",
    faqs: [
      {
        question: "How much does wedding photography cost in Pokhara?",
        answer:
          "Two studios on this list publish starting prices of about NPR 40,000 for wedding coverage. Destination packages with film, drone and several days of coverage cost more, and visiting studios add crew travel and accommodation.",
      },
      {
        question: "Should I book a Pokhara studio or bring one from Kathmandu?",
        answer:
          "A local studio knows the light, the viewpoints and the resorts, and adds no travel cost. A visiting studio may suit you if you already know its work. Either way, compare the total price including travel, lodging and food.",
      },
    ],
    extraKeywords: ["top wedding photographers Pokhara", "destination wedding photographer Pokhara"],
    citySlugs: ["pokhara"],
  },
  {
    slug: "lalitpur",
    guideSlug: "best-wedding-photographer-lalitpur",
    image: "photo-1583939003579-730e3918a45a",
    imageAlt: "Bride and groom surrounded by guests throwing petals after the ceremony",
    intro: [
      "Lalitpur's studios cluster in two areas: around old Patan — Patan Dhoka and Chyasal — where Newar weddings in homes and courtyards are the everyday work, and in the newer south around Jhamsikhel, Sanepa and Bhaisepati, where banquet and resort weddings dominate.",
      "Fewer Lalitpur studios publish price lists than in Kathmandu; most quote on request. Several also travel across the valley and beyond, so a Lalitpur studio is a realistic choice even if some of your events are in Kathmandu or Bhaktapur.",
    ],
    partnerContext: `Its Kathmandu studio at ${studio.kathmanduStudio} is a short drive from Patan, so valley weddings are normally covered without an overnight stay; confirm in writing that its lodging-and-food terms for weddings outside Kathmandu do not apply.`,
    bookingTip:
      "If your ceremony is in an old Patan house, ask how the crew will carry equipment in on foot and where they can set up lights in a small room.",
    faqs: [
      {
        question: "Do Lalitpur photographers cover Newar weddings?",
        answer:
          "Many Patan studios do so routinely, but ask each for a complete Newar wedding gallery rather than a highlight reel, and say whether your families follow Buddhist or Hindu Newar practice, since the sequence differs.",
      },
      {
        question: "How much do Lalitpur wedding photographers charge?",
        answer:
          "Most studios on this list quote on request. Machhindra Studio lists packages from about NPR 20,000 on Bihe Bazaar. Ask every studio to quote against the same written brief so the numbers are comparable.",
      },
    ],
    extraKeywords: ["top wedding photographers Lalitpur", "wedding photographer Patan"],
    citySlugs: ["lalitpur"],
  },
  {
    slug: "bhaktapur",
    guideSlug: "best-wedding-photographer-bhaktapur",
    image: "photo-1519741497674-611481863552",
    imageAlt: "Bride holding a white and pink bouquet beside the groom in warm backlight",
    intro: [
      "Most of Bhaktapur's wedding studios sit along the Araniko Highway corridor — Thimi, Sanothimi, Radhe Radhe, Suryabinayak — close to the party palaces where local weddings happen, while the old town's squares are where couples from across the valley come for portraits.",
      "Several studios here combine photography with cultural services: rental of Newar dress and jewellery, printing and gifts. That can make a heritage pre-wedding session simpler to organise, but check what is included before comparing prices.",
    ],
    partnerContext: `Its Kathmandu studio at ${studio.kathmanduStudio} is inside the valley, so Bhaktapur weddings are normally covered without an overnight stay; confirm in writing that its lodging-and-food terms for weddings outside Kathmandu do not apply.`,
    bookingTip:
      "Heritage-square sessions work best early in the morning. Ask whoever you book to plan outfit changes at a nearby base rather than in the square itself.",
    faqs: [
      {
        question: "Which Bhaktapur studios rent traditional Newar dress?",
        answer:
          "Kabita Studio says it rents cultural dress and jewellery for sessions, and other studios may arrange it on request. Ask whether rental and styling are included in the package and how many looks are covered.",
      },
      {
        question: "Can a Bhaktapur studio cover a wedding in Kathmandu or Lalitpur?",
        answer:
          "Yes, several studios on this list say they work across the valley. Confirm whether they charge travel for venues outside Bhaktapur and how they plan crew movement on the day.",
      },
    ],
    extraKeywords: ["top wedding photographers Bhaktapur", "wedding photographer Thimi"],
    citySlugs: ["bhaktapur"],
  },
  {
    slug: "chitwan",
    guideSlug: "best-wedding-photographer-chitwan",
    image: "photo-1469371670807-013ccf25f16a",
    imageAlt: "Outdoor wedding ceremony aisle lined with chairs and flower arrangements",
    intro: [
      "Chitwan's wedding photographers are concentrated in Bharatpur and Narayangarh, where most of the district's banquet weddings take place. The same studios travel out to Ratnanagar, Tandi, Gaindakot and the resort venues around Sauraha on the edge of the national park.",
      "Few Chitwan studios publish price lists online; most share portfolios on Facebook and quote on request. Ask each for a complete gallery from a venue like yours — a Bharatpur banquet hall and a Sauraha resort are very different jobs.",
    ],
    partnerContext: `${awayTerms("Chitwan")} Its Butwal studio at ${studio.butwalStudio} is the nearer of its two bases.`,
    bookingTip:
      "For a Sauraha resort wedding, ask how the crew travels from Bharatpur, whether it stays overnight, and what lighting it brings for a venue that goes dark quickly after sunset.",
    faqs: [
      {
        question: "Do Chitwan photographers cover Sauraha resort weddings?",
        answer:
          "Yes. D Multi Studio, for example, lists Sauraha among the areas it covers. Ask how travel from Bharatpur is priced, whether the crew stays overnight, and for a complete resort-wedding gallery.",
      },
      {
        question: "Can I find a photographer for a Tharu wedding in Chitwan?",
        answer:
          "Ask each studio directly whether it has covered a Tharu wedding recently and request that full gallery. Tharu customs, dress and music differ from Hindu ceremonies, and a crew that knows the sequence will be in position for the moments that matter.",
      },
    ],
    extraKeywords: ["top wedding photographers Chitwan", "wedding photographer Narayangarh"],
    citySlugs: ["chitwan", "bharatpur"],
  },
  {
    slug: "butwal",
    guideSlug: "best-wedding-photographer-butwal",
    image: "photo-1591604466107-ec97de577aff",
    imageAlt: "Bride and groom posing beside a lake framed by autumn trees",
    intro: [
      "Butwal is Lumbini Province's busiest wedding market, and its studios cluster around Milanchowk, Golpark and Sukhanagar. Many cover the whole of Rupandehi — Bhairahawa, Tilottama and the surrounding villages — as well as hill districts such as Gulmi.",
      "Published prices here start lower than in Kathmandu: one studio below lists wedding photography from about NPR 18,000. Multi-day, multi-event Terai weddings still need a proper crew, so compare what each quote actually covers.",
    ],
    partnerContext: `Its second permanent studio is at ${studio.butwalStudio}, ${homeGround}; weddings in Bhairahawa and elsewhere outside Butwal follow its away terms, with the couple providing lodging and food.`,
    bookingTip:
      "Butwal weddings often run across several events and two households. Map the schedule first, then ask each studio what crew it needs to cover it properly.",
    faqs: [
      {
        question: "How much does a wedding photographer cost in Butwal?",
        answer:
          "Royal Photo Studio publishes wedding photography from about NPR 18,000, and Wedding Story Nepal advertises packages from NPR 25,000. Multi-event coverage with film and a larger crew costs more, so compare quotes against the same written schedule.",
      },
      {
        question: "Do Butwal photographers cover weddings in Bhairahawa?",
        answer:
          "Most Butwal studios work across Rupandehi, including Bhairahawa. Ask whether travel is charged and who provides the crew's food and lodging for a multi-day wedding — Wedding Story Nepal, for example, asks the couple to provide both outside Kathmandu and Butwal.",
      },
    ],
    extraKeywords: ["top wedding photographers Butwal", "wedding photographer Bhairahawa"],
    citySlugs: ["butwal"],
  },
  {
    slug: "biratnagar",
    guideSlug: "best-wedding-photographer-biratnagar",
    image: "photo-1522673607200-164d1b6ce486",
    imageAlt: "Two decorated chairs for the couple on a lawn at an outdoor wedding",
    intro: [
      "Biratnagar's studios are concentrated around Mahendra Chowk, Tinpaini and the Main Road, and several are run by a named owner-photographer. Many also cover Itahari, Dharan and Jhapa, which helps when families spread events across the eastern Terai.",
      "Few studios here publish prices; almost all quote on request. Because many local weddings run over several days with late-night rites, ask each for a gallery that includes night-time ceremony coverage, not just daylight portraits.",
    ],
    partnerContext: awayTerms("Biratnagar"),
    bookingTip:
      "December and January mornings are often foggy across the eastern Terai. Whoever you book, plan outdoor portraits for the afternoon and keep an indoor alternative ready.",
    faqs: [
      {
        question: "Do Biratnagar photographers cover weddings in Itahari and Dharan?",
        answer:
          "Several do. ImgStock, for example, says it covers Morang, Sunsari and Jhapa, including Dharan, Itahari and Damak. Ask how travel between towns is priced when your events are split.",
      },
      {
        question: "What should I check for a late-night wedding in Biratnagar?",
        answer:
          "Ask to see full galleries with night-time ceremony coverage, what off-camera lighting the crew uses, and whether it works in shifts or charges overtime when rites run into the early hours.",
      },
    ],
    extraKeywords: ["top wedding photographers Biratnagar", "wedding photographer Itahari"],
    citySlugs: ["biratnagar"],
  },
  {
    slug: "dharan",
    guideSlug: "best-wedding-photographer-dharan",
    image: "photo-1465495976277-4387d4b0b4c6",
    imageAlt: "Couple's hands with wedding rings resting on a bouquet",
    intro: [
      "Dharan's wedding photographers are mostly small teams working from the town centre — Acharya Line and Sadan Chowk among them — with a strong presence on Facebook and Instagram. Neighbouring Itahari adds more options, and one Itahari studio is included below because it regularly covers Dharan.",
      "Many Dharan families have relatives abroad, so live streaming, quick teaser videos and fast online delivery come up more often here than elsewhere. Ask about them when you compare studios, not after you book.",
    ],
    partnerContext: awayTerms("Dharan"),
    bookingTip:
      "If relatives abroad will watch online, ask whoever you book what connection their stream depends on and what happens if it drops.",
    faqs: [
      {
        question: "How much does a wedding photographer cost in Dharan?",
        answer:
          "Most Dharan studios quote on request. Photoberry Studio is listed on Bihe Bazaar from about NPR 35,000. Compare quotes against the same written brief, including any live streaming and teaser videos you want.",
      },
      {
        question: "Can Dharan studios live-stream a wedding for family abroad?",
        answer:
          "Some offer it. Ask what equipment and connection the stream relies on, whether a backup exists, and how quickly a teaser and a first photo selection will be shared online.",
      },
    ],
    extraKeywords: ["top wedding photographers Dharan", "wedding photographer Sunsari"],
    citySlugs: ["dharan"],
  },
  {
    slug: "birgunj",
    guideSlug: "best-wedding-photographer-birgunj",
    image: "photo-1511285560929-80b456fea0bc",
    imageAlt: "Couple celebrating with guests and balloons at an outdoor reception",
    intro: [
      "Birgunj has fewer wedding studios with a checkable public presence than Nepal's other large cities; many work mainly through social media and referrals. We could verify eight local or nearby studios, one of them based in Hetauda, so this list is shorter rather than padded with names we could not check.",
      "Birgunj weddings often follow Madhesi and Marwari traditions, with a baraat procession and rites that run late into the night. Ask each studio for a full gallery that includes both, and confirm how many people it sends to each event.",
    ],
    partnerContext: awayTerms("Birgunj"),
    bookingTip:
      "Your banquet venue and recently married friends are good sources of more names. Apply the same checks to anyone they suggest: a full recent gallery, a named photographer and written deliverables.",
    faqs: [
      {
        question: "Why does the Birgunj list have fewer studios?",
        answer:
          "Fewer Birgunj studios publish their work in places we could verify. We list only studios with a checkable public presence rather than pad the list, and include one Hetauda studio that says it works throughout Nepal.",
      },
      {
        question: "What should I ask a Birgunj photographer about the baraat?",
        answer:
          "Ask whether a separate photographer will follow the baraat while another waits at the venue, what lighting they use as daylight fades, and to see a full gallery that includes a baraat.",
      },
    ],
    extraKeywords: ["top wedding photographers Birgunj", "wedding photographer Parsa"],
    citySlugs: ["birgunj"],
  },
  {
    slug: "nepalgunj",
    guideSlug: "best-wedding-photographer-nepalgunj",
    image: "photo-1554048612-b6a482bc67e5",
    imageAlt: "Photographer raising a camera against bright sunlight",
    intro: [
      "Nepalgunj is the base for wedding photographers across the western Terai. Several studios below — Mega Mixing Lab among them — say they travel regularly to Bardiya, Dang, Kailali and Surkhet, so this list is also useful if your wedding is elsewhere in the region.",
      "The city's weddings span Hindu, Muslim, Tharu and Awadhi traditions, and some families want women photographed by a woman. Ask each studio about both before comparing prices.",
    ],
    partnerContext: `${awayTerms("Nepalgunj")} Its Butwal studio at ${studio.butwalStudio} is the nearer of its two bases.`,
    bookingTip:
      "From late spring until the monsoon, keep outdoor portraits to late afternoon and plan shade and water for the crew as well as guests.",
    faqs: [
      {
        question: "Can I find a female wedding photographer in Nepalgunj?",
        answer:
          "Ask each studio on this list directly. If your family has women-only events or prefers women to be photographed by a woman, the studio needs to know when it plans the crew. Put it in the contract.",
      },
      {
        question: "Do Nepalgunj studios cover weddings in Bardiya, Dang or Surkhet?",
        answer:
          "Several do; Mega Mixing Lab, for example, lists Bardiya, Dang, Kailali and Surkhet among the areas it serves. Ask how travel is priced and whether the crew stays overnight.",
      },
    ],
    extraKeywords: ["top wedding photographers Nepalgunj", "wedding photographer Banke"],
    citySlugs: ["nepalgunj"],
  },
];

/** Directory and round-up pages verify an entry but are not the business's own web presence. */
const directoryHosts = [
  "bihebazaar.com",
  "purbelibazar.com",
  "thenimto.com",
  "turantcall.com",
  "wedtayari.com",
  "poudeldigital.com/best-wedding",
  "nepalyp.com",
  "yopoho.com",
  "meroevent.com",
];

function ownPresenceUrl(listed: ShortlistedStudio): string | undefined {
  return directoryHosts.some((host) => listed.sourceUrl.includes(host)) ? undefined : listed.sourceUrl;
}

function partnerListItem(slug: ShortlistCitySlug): BlogListItem {
  const inButwal = slug === "butwal";
  const base = inButwal ? "Butwal" : "Kathmandu";
  return {
    name: studio.name,
    description: `${studio.name}, NepaliDirectory's featured photography partner. ${studioClaims}`,
    area:
      slug === "kathmandu" || slug === "butwal"
        ? `${inButwal ? "Butwal-10 Ramnagar" : "Kamalpokhari"}, ${base}`
        : `Kathmandu and Butwal studios, travels to ${cityShortlists[slug].city}`,
    city: base,
    streetAddress: inButwal ? "Butwal-10 Ramnagar" : "Kamalpokhari",
    url: studio.url,
    telephone: studio.phone,
    email: studio.email,
    isFeaturedPartner: true,
  };
}

function partnerEntrySection(position: number, config: CityListConfig): BlogSection {
  return {
    heading: `${position}. Featured partner: ${studio.name}`,
    paragraphs: [
      `${studio.name} is NepaliDirectory's featured photography partner, and its position on this list is a commercial arrangement rather than the result of an independent ranking. ${studioClaims}`,
      `Founded in ${studio.established} by ${studio.founder}, the studio reports documenting ${studio.weddingsDocumented} weddings across roughly ${studio.yearsActive} years with a team of about ${studio.teamSize} photographers and filmmakers. It covers ${studio.services.join(", ")}, with packages advertised from NPR ${studio.packagesFromNpr}.`,
      `${config.partnerContext} Contact: ${studio.phone}, ${studio.email}, or ${studio.url}.`,
    ],
  };
}

function studioEntrySection(position: number, listed: { name: string; area: string; note: string }): BlogSection {
  return {
    heading: `${position}. ${listed.name}`,
    paragraphs: [`Based in ${listed.area}. ${listed.note}`],
  };
}

function buildCityListPost(config: CityListConfig): BlogPost {
  const { city } = cityShortlists[config.slug];
  const count = cityListEntryCount(config.slug);
  const partnerAt = partnerPosition(config.slug);
  const listed = sortedShortlist(config.slug);
  const entries = listed.map((entry) => studioEntrySection(0, entry));
  entries.splice(partnerAt - 1, 0, partnerEntrySection(0, config));
  const numbered = entries.map((section, index) => ({
    ...section,
    heading: section.heading.replace(/^0\./, `${index + 1}.`),
  }));
  const names = listed.map((entry) => entry.name);
  const listItems: BlogListItem[] = listed.map((entry) => ({
    name: entry.name,
    description: entry.note,
    area: entry.area,
    city,
    url: ownPresenceUrl(entry),
  }));
  listItems.splice(partnerAt - 1, 0, partnerListItem(config.slug));
  const leading = listItems
    .slice(0, 5)
    .map((item) => (item.isFeaturedPartner ? `${item.name} (our featured partner)` : item.name));

  return {
    ...listPublication,
    title: `Best Wedding Photographers in ${city}: ${count} Studios for 2026`,
    seoTitle: `Best Wedding Photographers in ${city}: ${count} Studios (2026)`,
    slug: cityListSlug(config.slug),
    href: cityListHref(config.slug),
    category: "Photography",
    excerpt: `${count} wedding photographers and studios in ${city}, with where each is based, what it offers and a link to check its work, plus contacts for our featured partner.`,
    description: `${count} wedding photographers in ${city} with locations, services, published prices and verification links. Featured partner position disclosed.`,
    image: image(config.image),
    imageAlt: config.imageAlt,
    readTime: "8 min read",
    author: "Nepali Directory Events Desk",
    keywords: [
      `best wedding photographers in ${city}`,
      `best wedding photographer in ${city}`,
      `best wedding photography in ${city}`,
      `wedding photographers ${city}`,
      ...config.extraKeywords,
    ],
    tags: ["Photography", "Weddings", city],
    quickAnswer: `Wedding photographers to shortlist in ${city} include ${leading.slice(0, -1).join(", ")} and ${leading[leading.length - 1]}. ${studio.name} says it is ${studio.recognition} and sends ${studio.standardCrew} to a standard wedding. This ${count}-studio list gives each studio's area, services and a link to check its work, last checked ${SHORTLIST_CHECKED}.`,
    itemList: { name: `Wedding photographers in ${city}`, items: listItems },
    categorySlugs: ["photography"],
    sections: [
      {
        heading: `How this ${city} list works`,
        paragraphs: [
          ...config.intro,
          `${studio.name}, our featured partner, is placed at position ${partnerAt} as a disclosed paid placement. Every other studio follows in alphabetical order, not by quality: we compiled them in ${SHORTLIST_CHECKED} from each studio's own website or social page and from public directory listings, none paid to appear, and each has a verification link under "Primary sources" at the end of this page. Descriptions and prices are the studios' own claims, so confirm them directly.`,
        ],
      },
      ...numbered,
      {
        heading: `Before you book a photographer in ${city}`,
        paragraphs: [
          `${config.bookingTip} For venue, tradition and logistics advice specific to ${city}, read our [${city} wedding photography guide](/blog/${config.guideSlug}), and for any studio ask to see one complete recent wedding, confirm the named photographer, and get deliverables and timelines in the contract.`,
        ],
      },
    ],
    faqs: [
      ...config.faqs,
      {
        question: `Which wedding photographers are on the ${city} list?`,
        answer: `${studio.name} appears at position ${partnerAt} as our disclosed featured partner, and the other studios follow alphabetically: ${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}. Each entry links to a public page where you can check its work.`,
      },
      {
        question: `What does ${studio.name} include for a ${city} wedding?`,
        answer: `For a standard wedding the studio says it sends ${studio.standardCrew}, with packages advertised from NPR ${studio.packagesFromNpr}. ${config.partnerContext} Contact ${studio.phone} or ${studio.email}.`,
      },
      ...universalFaqs,
    ],
    contextLinks: [
      ...commonContextLinks,
      { label: `${city} wedding photography guide`, href: `/blog/${config.guideSlug}` },
    ],
    citySlugs: config.citySlugs ?? [config.slug],
    sources: [...studioSources, ...studioShortlistSources(config.slug)],
    disclaimer: shortlistDisclosure,
  };
}

export const photographyCityListPosts: BlogPost[] = cityListConfigs.map(buildCityListPost);
