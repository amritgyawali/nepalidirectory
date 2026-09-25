import type { BlogFaq, BlogListItem, BlogPost, BlogSection } from "./blog";
import {
  SHORTLIST_CHECKED,
  type ShortlistCitySlug,
  cityListEntryCount,
  cityListHref,
  cityListSlug,
  cityShortlists,
  type ShortlistedStudio,
  rankedShortlist,
  studioShortlistSources,
} from "./photography-city-shortlists";
import {
  commonContextLinks,
  photoImage as image,
  pricingTiers,
  shortlistDisclosure,
  studio,
  studioClaims,
  studioSources,
  topPhotographersPanel,
  universalFaqs,
} from "./photography-partner";

/**
 * "Top wedding photographers in <city>" list pages — the "who to hire" intent. The matching
 * `best-wedding-photographer-<city>` guides keep the "how to choose" intent and link here, so the
 * two never compete for the same query.
 *
 * Wedding Story Nepal is entry 1 in Kathmandu, Lalitpur, Bhaktapur and Butwal. Everywhere else it is
 * entry 2, behind the first studio in `cityShortlists`, because it travels in rather than being
 * based there; the remaining studios follow in order.
 */
type CityListConfig = {
  slug: ShortlistCitySlug;
  guideSlug: string;
  image: string;
  imageAlt: string;
  /** Standfirst under the title. */
  subtitle: string;
  /** Opening paragraph that sets the scene for weddings in this city. */
  opening: string;
  /** Two paragraphs on this city's studio market, specific to the place. */
  intro: [string, string];
  /** Why Wedding Story Nepal suits weddings in this city. */
  partnerLead: string;
  /** How the studio's terms apply to this city specifically. */
  partnerContext: string;
  /** Pre-wedding locations near the city, for the planning card. */
  preWeddingSpots: string;
  preWeddingHref?: string;
  /** How local prices sit against the national tiers. */
  priceNote: string;
  /** City-specific first paragraph of the conclusion. */
  conclusion: string;
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

/** Cities where Wedding Story Nepal is listed first; on every other list it is second, for location alone. */
const partnerFirstCities: ReadonlySet<ShortlistCitySlug> = new Set(["kathmandu", "lalitpur", "bhaktapur", "butwal"]);

export function partnerRank(slug: ShortlistCitySlug): 1 | 2 {
  return partnerFirstCities.has(slug) ? 1 : 2;
}

const cityListConfigs: CityListConfig[] = [
  {
    slug: "kathmandu",
    guideSlug: "best-wedding-photographer-kathmandu",
    image: "photo-1544735716-392fe2489ffa",
    imageAlt: "Buddhist stupa on a ridge below snow-capped Himalayan peaks",
    subtitle: "Premium cinematic and candid wedding photographers in Kathmandu, Nepal — with contacts, styles and prices.",
    opening: "Kathmandu Valley is where Nepal's wedding traditions run deepest. A single celebration can move from temple bells and Vedic mantras at the family home to a glittering reception in a five-star banquet hall, with the brick courtyards of Patan, Bhaktapur and Basantapur waiting for portraits in between. Each of those moments happens once, and the team behind the camera decides how you will remember them.",
    intro: [
      "Kathmandu has the deepest pool of wedding photographers in Nepal, and more of them publish websites, package tiers and prices than anywhere else in the country. That makes comparison easier here than in most cities: several studios below advertise packages from around NPR 25,000–35,000, with multi-day, two-crew coverage priced well above that.",
      "The harder part is choosing between studios that look similar online. Most offer photography, film and pre-wedding shoots; what separates them is who actually turns up on the day, how they handle valley traffic between venues, and whether they have shot your ceremony tradition before.",
    ],
    partnerContext: `Its main studio is at ${studio.kathmanduStudio}, ${homeGround}.`,
    partnerLead: "Wedding Story Nepal has become one of the most sought-after wedding teams in the valley, and its work shows why. It balances the two things Kathmandu families usually want at once: complete, respectful coverage of every ritual for the elders, and bright, emotional, candid storytelling for the couple. From mehendi nights and engagement ceremonies to heritage pre-wedding shoots in Patan and Bhaktapur, the team brings colour and energy without losing the quiet moments in between.",
    preWeddingSpots: "From the carved courtyards of Patan and Bhaktapur to the Garden of Dreams, the sunrise ridge at Nagarkot and the valley's luxury hotels, Kathmandu has a setting for every kind of love story.",
    priceNote: "Kathmandu studios cover the full range. Several publish starting packages of NPR 25,000–35,000, while two-crew, multi-venue valley weddings with a cinematic film sit in the premium and luxury tiers.",
    conclusion: "Kathmandu gives couples more choice than anywhere else in Nepal, which is both a gift and a challenge. The studios above cover every style — documentary films, editorial portraits, lively 4K edits and classic, complete coverage — so decide first which style feels like you, then shortlist two or three teams and meet them in person. Chemistry matters: on the wedding day you will spend more time with your photographer than with almost anyone else.",
    bookingTip:
      "On a busy wedding date, valley traffic between two family homes and a reception venue can eat an hour. Whoever you book, ask how they split the crew across locations.",
    faqs: [
      {
        question: "How much does a wedding photographer cost in Kathmandu?",
        answer:
          "Published starting prices among the studios on this list mostly sit between about NPR 25,000 and NPR 35,000 for basic coverage, with multi-day, two-crew packages including film costing considerably more. Compare quotes only against the same written brief: crew size, hours, film and deliverables.",
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
    subtitle: "Lakeside, mountain and destination wedding photographers in Pokhara, Nepal — with contacts, styles and prices.",
    opening: "Pokhara is the wedding setting many Nepali couples dream about: still water on Phewa Lake, the Annapurna range turning pink at dawn and resorts that open straight onto the view. It is also a place where weather, light and logistics can change within the hour, which is exactly why the team behind the camera matters so much here.",
    intro: [
      "Pokhara's wedding photographers work two kinds of job: local weddings in party palaces and family homes, and destination weddings for couples who travel in for Phewa Lake, Sarangkot and the Annapurna view. Several of the studios below do both, and some lean towards cinematic destination films.",
      "Booking a Pokhara-based studio removes crew travel from the quote. Booking a visiting studio can make sense if you want a team you already know, but compare the full cost including travel, lodging and food rather than the headline package.",
    ],
    partnerContext: awayTerms("Pokhara"),
    partnerLead: "For couples marrying beside Phewa Lake or planning a sunrise session at Sarangkot, Wedding Story Nepal brings a crew that treats Pokhara's landscape as part of the story rather than a pretty backdrop. Its candid, colour-rich style suits lakeside ceremonies and resort receptions, and because its photographers and filmmakers plan together, the cinematic edit and the album feel like one piece of work.",
    preWeddingSpots: "Phewa Lake at golden hour, Sarangkot at sunrise, the World Peace Pagoda, Begnas Lake and the lakeside resorts — Pokhara is Nepal's favourite pre-wedding destination for good reason.",
    preWeddingHref: "/blog/best-pre-wedding-photographer-pokhara",
    priceNote: "Pokhara-based studios publish starting prices of around NPR 40,000. Destination packages with drone, film and several days of coverage move into the premium and luxury tiers, and visiting crews add travel and accommodation.",
    conclusion: "In Pokhara the landscape does half the work, but only when your photographer knows how to use it — where the light falls on Phewa at dusk, when Sarangkot is likely to clear and how to keep guests comfortable at a lakeside venue. Choose a team whose past Pokhara weddings you genuinely love, and build a plan that still works if the mountains stay hidden.",
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
    subtitle: "Heritage, Newar and modern wedding photographers in Lalitpur (Patan), Nepal — with contacts, styles and prices.",
    opening: "Lalitpur — Patan to most of us — is the valley's city of craftsmen, and its weddings carry the same care for detail. Carved windows, stone water spouts and courtyards where families have gathered for centuries sit a short drive from the modern banquet halls of Jhamsikhel and Bhaisepati.",
    intro: [
      "Lalitpur's studios cluster in two areas: around old Patan — Patan Dhoka and Chyasal — where Newar weddings in homes and courtyards are the everyday work, and in the newer south around Jhamsikhel, Sanepa and Bhaisepati, where banquet and resort weddings dominate.",
      "Fewer Lalitpur studios publish price lists than in Kathmandu; most quote on request. Several also travel across the valley and beyond, so a Lalitpur studio is a realistic choice even if some of your events are in Kathmandu or Bhaktapur.",
    ],
    partnerContext: `Its Kathmandu studio at ${studio.kathmanduStudio} is a short drive from Patan, so valley weddings are normally covered without an overnight stay; confirm in writing that its lodging-and-food terms for weddings outside Kathmandu do not apply.`,
    partnerLead: "Patan's courtyards, carved windows and Newar rituals reward a team that knows when to step back and when to move in, and that is where Wedding Story Nepal is at its best. Its photographers are at ease in tight, low-light spaces and blend candid storytelling with the formal family portraits Newar households expect.",
    preWeddingSpots: "Patan Durbar Square, the Golden Temple courtyard, the botanical gardens at Godawari and the quiet lanes of old Patan make Lalitpur a pre-wedding favourite.",
    priceNote: "Most Lalitpur studios quote on request; published starting prices begin around NPR 20,000. Heritage-location sessions and multi-day Newar weddings usually fall in the premium tier.",
    conclusion: "Lalitpur weddings reward photographers who understand both old Patan and the newer banquet venues of the south. Whether your ceremony is in a centuries-old courtyard or a Jhamsikhel hall, choose a team that has photographed your tradition before and can work quietly in close quarters.",
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
    subtitle: "Heritage and Newari wedding photographers in Bhaktapur, Nepal — with contacts, styles and prices.",
    opening: "Bhaktapur may be the most photogenic wedding city in Nepal. Its brick-paved squares, five-storey pagodas and pottery lanes lend even a simple portrait a sense of history, and Newar wedding customs here are still practised with remarkable devotion.",
    intro: [
      "Most of Bhaktapur's wedding studios sit along the Araniko Highway corridor — Thimi, Sanothimi, Radhe Radhe, Suryabinayak — close to the party palaces where local weddings happen, while the old town's squares are where couples from across the valley come for portraits.",
      "Several studios here combine photography with cultural services: rental of Newar dress and jewellery, printing and gifts. That can make a heritage pre-wedding session simpler to organise, but check what is included before comparing prices.",
    ],
    partnerContext: `Its Kathmandu studio at ${studio.kathmanduStudio} is inside the valley, so Bhaktapur weddings are normally covered without an overnight stay; confirm in writing that its lodging-and-food terms for weddings outside Kathmandu do not apply.`,
    partnerLead: "Bhaktapur's squares, pagodas and brick lanes make it one of the valley's most beautiful wedding settings, and Wedding Story Nepal uses them with real sensitivity. Its crew plans heritage portraits around the soft early light and weaves the ceremony, the family and the old-town atmosphere into one coherent story.",
    preWeddingSpots: "Bhaktapur Durbar Square, the Nyatapola temple at Taumadhi, the pottery square and Changunarayan on the hill above town give Bhaktapur an unmatched heritage look.",
    priceNote: "Bhaktapur studios mostly quote on request, and many sit in the essential and premium tiers. Check whether traditional dress rental and styling are included before you compare prices.",
    conclusion: "Bhaktapur is one of the most beautiful places in Nepal to be photographed on your wedding day. Pick a team that knows how to use its squares and lanes early in the morning, respects the rituals of Newar families and can help with traditional dress if you want a heritage look.",
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
    subtitle: "Banquet, resort and Terai wedding photographers in Chitwan, Nepal — with contacts, styles and prices.",
    opening: "Chitwan weddings have a character of their own: large, warm Terai celebrations in Bharatpur and Narayangarh and, increasingly, resort weddings on the edge of the national park where the Rapti river and the sal forest set the scene.",
    intro: [
      "Chitwan's wedding photographers are concentrated in Bharatpur and Narayangarh, where most of the district's banquet weddings take place. The same studios travel out to Ratnanagar, Tandi, Gaindakot and the resort venues around Sauraha on the edge of the national park.",
      "Few Chitwan studios publish price lists online; most share portfolios on Facebook and quote on request. Ask each for a complete gallery from a venue like yours — a Bharatpur banquet hall and a Sauraha resort are very different jobs.",
    ],
    partnerContext: `${awayTerms("Chitwan")} Its Butwal studio at ${studio.butwalStudio} is the nearer of its two bases.`,
    partnerLead: "Chitwan weddings swing from banquet halls in Bharatpur to riverside resorts near Sauraha, and Wedding Story Nepal is comfortable in both. Its crew brings the stamina long, multi-event Terai weddings demand, and its own lighting for evening rites when the venue goes dark after sunset.",
    preWeddingSpots: "Sunsets over the Rapti, the forest edge at Sauraha, mustard fields in winter and quiet resort gardens make Chitwan a natural setting for a pre-wedding shoot.",
    priceNote: "Chitwan studios mostly quote on request, and local packages often start below the Kathmandu range. Resort weddings near Sauraha add travel and, sometimes, an overnight stay for the crew.",
    conclusion: "Chitwan weddings can move from a Bharatpur banquet hall to a riverside resort in Sauraha in a single weekend. Pick a team that is comfortable in both settings, travels with its own lighting and has photographed your tradition before, whether that is a Hindu, Tharu or mixed ceremony.",
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
    subtitle: "Cinematic and candid wedding photographers in Butwal, Nepal — with contacts, styles and prices.",
    opening: "Butwal sits where the hills meet the plains, and its weddings blend both worlds: families from Palpa and Gulmi, Terai traditions from Rupandehi, and celebrations that often run across three or four events.",
    intro: [
      "Butwal is Lumbini Province's busiest wedding market, and its studios cluster around Milanchowk, Golpark and Sukhanagar. Many cover the whole of Rupandehi — Bhairahawa, Tilottama and the surrounding villages — as well as hill districts such as Gulmi.",
      "Published prices here start lower than in Kathmandu: one studio below lists wedding photography from about NPR 18,000. Multi-day, multi-event Terai weddings still need a proper crew, so compare what each quote actually covers.",
    ],
    partnerContext: `Its second permanent studio is at ${studio.butwalStudio}, ${homeGround}; weddings in Bhairahawa and elsewhere outside Butwal follow its away terms, with the couple providing lodging and food.`,
    partnerLead: "Butwal is one of Wedding Story Nepal's two home cities, and its permanent studio here makes it a natural first call for weddings across Rupandehi. The team knows the city's party palaces, the Tinau riverside and the long multi-event schedules of Terai weddings, and it brings the same cinematic polish here that it brings to Kathmandu.",
    preWeddingSpots: "Rani Mahal on the Kali Gandaki, the peaceful monastic zone at Lumbini, the Tinau riverside and the hills of Palpa put some of Nepal's most romantic locations within easy reach of Butwal.",
    preWeddingHref: "/blog/best-pre-wedding-photographer-butwal",
    priceNote: "Butwal prices start lower than Kathmandu's — one studio publishes wedding photography from about NPR 18,000 — but multi-event Terai weddings with a film still need a premium-tier crew.",
    conclusion: "Butwal couples are fortunate: the city has a strong, competitive studio scene and prices remain fair compared with the capital. Map out your events first — engagement, mehendi, wedding and reception — then choose a team with the crew size and stamina to cover every one of them properly.",
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
    subtitle: "Wedding photographers for Biratnagar and the eastern Terai — with contacts, styles and prices.",
    opening: "Biratnagar is the commercial heart of the east, and its weddings match that energy: long, joyful celebrations with big guest lists, bright décor and rites that often continue deep into the night.",
    intro: [
      "Biratnagar's studios are concentrated around Mahendra Chowk, Tinpaini and the Main Road, and several are run by a named owner-photographer. Many also cover Itahari, Dharan and Jhapa, which helps when families spread events across the eastern Terai.",
      "Few studios here publish prices; almost all quote on request. Because many local weddings run over several days with late-night rites, ask each for a gallery that includes night-time ceremony coverage, not just daylight portraits.",
    ],
    partnerContext: awayTerms("Biratnagar"),
    partnerLead: "For eastern Terai weddings that run late into the night, Wedding Story Nepal brings a full photo and film crew with the lighting and backup to handle long ceremonies. Its warm, candid style keeps the energy of the celebration while still delivering the formal family portraits elders expect.",
    preWeddingSpots: "Tea gardens in Ilam and Jhapa, the Koshi river at sunset and Biratnagar's resort gardens give couples in the east plenty of pre-wedding choices.",
    priceNote: "Few Biratnagar studios publish prices, and most sit in the essential and premium tiers. Late-night rites can add overtime, so ask how it is charged.",
    conclusion: "Biratnagar weddings are long, lively and often spread across several towns in the eastern Terai. Choose a team that shows you strong night-time ceremony coverage, plans around winter fog and can move between Biratnagar, Itahari and Dharan without drama.",
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
    subtitle: "Wedding photographers in Dharan and Itahari, Nepal — with contacts, styles and prices.",
    opening: "Dharan's weddings are famously lively — music, dancing and a strong sense of community, with many families connected to relatives in Hong Kong, the UK and the Gulf who follow every moment from afar.",
    intro: [
      "Dharan's wedding photographers are mostly small teams working from the town centre — Acharya Line and Sadan Chowk among them — with a strong presence on Facebook and Instagram. Neighbouring Itahari adds more options, and one Itahari studio is included below because it regularly covers Dharan.",
      "Many Dharan families have relatives abroad, so live streaming, quick teaser videos and fast online delivery come up more often here than elsewhere. Ask about them when you compare studios, not after you book.",
    ],
    partnerContext: awayTerms("Dharan"),
    partnerLead: "Dharan families often share their wedding with relatives watching from abroad, and Wedding Story Nepal plans for that with quick teasers and cinematic highlight films alongside full photo coverage. Its candid, colour-rich style suits the town's music-filled celebrations.",
    preWeddingSpots: "The hilltop viewpoint at Bhedetar, the green Charkoshe Jhadi forest belt and Dharan's own leafy streets offer easy, beautiful pre-wedding settings.",
    priceNote: "Most Dharan studios quote on request; one lists prices from about NPR 35,000. Live streaming and fast teaser videos are usually priced as extras.",
    conclusion: "Dharan celebrations are warm, musical and often watched by family around the world. Choose a team that captures that energy, can share teasers quickly online and delivers a gallery your relatives abroad will treasure.",
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
    subtitle: "Wedding photographers in Birgunj and Parsa, Nepal — with contacts, styles and prices.",
    opening: "Birgunj, Nepal's gateway city on the southern border, hosts some of the country's most colourful weddings: baraat processions, rich Madhesi and Marwari customs and celebrations that fill an entire night.",
    intro: [
      "Birgunj has fewer wedding studios with a checkable public presence than Nepal's other large cities; many work mainly through social media and referrals. We could verify eight local or nearby studios, one of them based in Hetauda, so this list is shorter rather than padded with names we could not check.",
      "Birgunj weddings often follow Madhesi and Marwari traditions, with a baraat procession and rites that run late into the night. Ask each studio for a full gallery that includes both, and confirm how many people it sends to each event.",
    ],
    partnerContext: awayTerms("Birgunj"),
    partnerLead: "Birgunj weddings — baraat processions, colourful rituals and ceremonies that stretch past midnight — need a crew with stamina and strong low-light skills. Wedding Story Nepal travels with both photographers and cinematographers, so the procession and the venue can be covered at the same time.",
    preWeddingSpots: "Ghadiarwa Pokhari, the forest edge of Parsa National Park and the city's resort lawns offer a surprising variety of pre-wedding settings close to Birgunj.",
    priceNote: "Birgunj studios rarely publish prices. Large baraat weddings usually need at least a premium-tier crew so the procession and the venue are covered at once.",
    conclusion: "Birgunj weddings are vibrant and demanding — the baraat, the late-night rites and the sheer scale of the celebrations test any crew. Choose a team that can split its photographers between the procession and the venue, and that shows you complete galleries from weddings like yours.",
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
    subtitle: "Wedding photographers for Nepalgunj and the western Terai — with contacts, styles and prices.",
    opening: "Nepalgunj is a meeting point of cultures, and its weddings reflect it: Hindu, Muslim, Tharu and Awadhi celebrations, each with its own music, dress and rituals, often held in the heat of the western Terai.",
    intro: [
      "Nepalgunj is the base for wedding photographers across the western Terai. Several studios below — Mega Mixing Lab among them — say they travel regularly to Bardiya, Dang, Kailali and Surkhet, so this list is also useful if your wedding is elsewhere in the region.",
      "The city's weddings span Hindu, Muslim, Tharu and Awadhi traditions, and some families want women photographed by a woman. Ask each studio about both before comparing prices.",
    ],
    partnerContext: `${awayTerms("Nepalgunj")} Its Butwal studio at ${studio.butwalStudio} is the nearer of its two bases.`,
    partnerLead: "In Nepalgunj, where weddings span Hindu, Muslim, Tharu and Awadhi traditions, Wedding Story Nepal's experience across ceremony types is a real asset. The team covers long outdoor days and evening rituals with a full photo and film crew, travelling in from its Butwal studio.",
    preWeddingSpots: "The forest edge of Bardiya National Park, the Bageshwari temple area and resort gardens around the city give Nepalgunj couples varied pre-wedding options.",
    priceNote: "Nepalgunj studios publish prices from about NPR 40,000 for photo and video. Crews travelling from outside the region add transport, lodging and food.",
    conclusion: "In Nepalgunj, the right photographer is the one who understands your tradition — Hindu, Muslim, Tharu or Awadhi — and can handle the heat and long outdoor days of the western Terai. Ask the practical questions early, including whether a female photographer is available if your family prefers it.",
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
  "turantcall.com",
  "wedtayari.com",
  "poudeldigital.com/best-wedding",
  "nepalyp.com",
  "meroevent.com",
];

function ownPresenceUrl(listed: ShortlistedStudio): string | undefined {
  const url = listed.sourceUrl;
  return url && !directoryHosts.some((host) => url.includes(host)) ? url : undefined;
}

function studioListItem(slug: ShortlistCitySlug): BlogListItem {
  const inButwal = slug === "butwal";
  const base = inButwal ? "Butwal" : "Kathmandu";
  return {
    name: studio.name,
    description: `${studio.name}: wedding photography and cinematic films from studios in Kathmandu and Butwal. ${studioClaims}`,
    area:
      slug === "kathmandu" || slug === "butwal"
        ? `${inButwal ? "Butwal-10 Ramnagar" : "Kamalpokhari"}, ${base}`
        : `Kathmandu and Butwal studios, travels to ${cityShortlists[slug].city}`,
    city: base,
    streetAddress: inButwal ? "Butwal-10 Ramnagar" : "Kamalpokhari",
    url: studio.url,
    telephone: studio.phone,
    email: studio.email,
  };
}

function studioEntrySection(config: CityListConfig): BlogSection {
  const item = studioListItem(config.slug);
  const rank = partnerRank(config.slug);
  const { city } = cityShortlists[config.slug];
  const locationNote =
    rank === 2
      ? [
          `${studio.name} stands second on this ${city} list for one reason only: location. Its studios are in Kathmandu and Butwal, so the crew travels in for ${city} weddings rather than working from a local base. On every other measure — portfolio, crew size, film quality and experience — it would take the top spot.`,
        ]
      : [];
  return {
    heading: `${rank}. ${studio.name}`,
    paragraphs: [
      ...locationNote,
      config.partnerLead,
      `Founded in ${studio.established} by ${studio.founder}, the studio reports documenting ${studio.weddingsDocumented} weddings over roughly ${studio.yearsActive} years with a team of about ${studio.teamSize} photographers and filmmakers. It covers ${studio.services.join(", ")}, with packages advertised from NPR ${studio.packagesFromNpr}. ${studioClaims}`,
      `${config.partnerContext} Reach the team on ${studio.phone} or ${studio.email}, or see recent work at ${studio.url}.`,
    ],
    entry: { rank, name: studio.name, area: item.area, phone: studio.phone, url: studio.url },
  };
}

function listedEntrySection(rank: number, listed: ShortlistedStudio): BlogSection {
  return {
    heading: `${rank}. ${listed.name}`,
    paragraphs: [listed.description],
    entry: { rank, name: listed.name, area: listed.area, phone: listed.phone, url: listed.sourceUrl },
  };
}

function buildCityListPost(config: CityListConfig): BlogPost {
  const { city } = cityShortlists[config.slug];
  const count = cityListEntryCount(config.slug);
  const listed = rankedShortlist(config.slug);
  const rank = partnerRank(config.slug);
  const ahead = listed.slice(0, rank - 1);
  const after = listed.slice(rank - 1);
  const entries = [
    ...ahead.map((entry, index) => listedEntrySection(index + 1, entry)),
    studioEntrySection(config),
    ...after.map((entry, index) => listedEntrySection(rank + index + 1, entry)),
  ];
  const listedItem = (entry: ShortlistedStudio): BlogListItem => ({
    name: entry.name,
    description: entry.description,
    area: entry.area,
    city,
    url: ownPresenceUrl(entry),
    telephone: entry.phone,
  });
  const listItems: BlogListItem[] = [
    ...ahead.map(listedItem),
    studioListItem(config.slug),
    ...after.map(listedItem),
  ];
  const others = listItems.map((item) => item.name).filter((name) => name !== studio.name);
  const studioSummary =
    rank === 1
      ? `${studio.name} leads the list`
      : `${studio.name} stands second only because it travels in from Kathmandu and Butwal`;
  const leading = listItems.slice(0, 5).map((item) => item.name);
  const guideHref = `/blog/${config.guideSlug}`;

  return {
    ...listPublication,
    title: `Top ${count} Best Wedding Photographers in ${city}`,
    seoTitle: `Top ${count} Best Wedding Photographers in ${city} (2026)`,
    subtitle: config.subtitle,
    slug: cityListSlug(config.slug),
    href: cityListHref(config.slug),
    category: "Photography",
    excerpt: `The top ${count} wedding photographers in ${city} for 2026 — cinematic and candid studios with contact numbers, what each does best and what to budget.`,
    description: `Top ${count} wedding photographers in ${city} for 2026, with contact numbers, styles, package price ranges and expert tips to book the right studio.`,
    image: image(config.image),
    imageAlt: config.imageAlt,
    readTime: "10 min read",
    author: "Nepali Directory Events Desk",
    keywords: [
      `best wedding photographers in ${city}`,
      `best wedding photographer in ${city}`,
      `best wedding photography in ${city}`,
      `wedding photographers ${city}`,
      ...config.extraKeywords,
    ],
    tags: ["Photography", "Weddings", city],
    quickAnswer: `The top wedding photographers in ${city} for 2026 are ${leading.slice(0, -1).join(", ")} and ${leading[leading.length - 1]}. ${studioSummary}: founded in ${studio.established}, it sends ${studio.standardCrew} to a standard wedding, with packages from NPR ${studio.packagesFromNpr}. Every studio on this ${count}-studio list comes with its contact details and what it does best, last checked ${SHORTLIST_CHECKED}.`,
    itemList: { name: `Top wedding photographers in ${city}`, items: listItems },
    categorySlugs: ["photography"],
    sections: [
      {
        heading: `Choosing a wedding photographer in ${city}`,
        paragraphs: [
          config.opening,
          ...config.intro,
          `We did not put this ${city} list together at random. The NepaliDirectory Events Desk went through each studio's public portfolio, recent wedding films, published packages and online presence, and checked every entry against the studio's own website, social page or a public listing in ${SHORTLIST_CHECKED}. Planning a wedding is stressful enough; we hope this guide makes one of its biggest decisions a little easier.`,
        ],
      },
      ...entries,
      {
        heading: `Before you book a photographer in ${city}`,
        paragraphs: [
          `${config.bookingTip} For venue, tradition and logistics advice specific to ${city}, read our [${city} wedding photography guide](${guideHref}).`,
          "Whichever studio you choose, ask to see one complete recent wedding rather than a highlight reel, confirm by name who will photograph your day, and put coverage hours, the number of edited photos, film length and delivery dates into the contract before you pay a deposit.",
        ],
      },
      {
        heading: "Conclusion: making your final choice",
        paragraphs: [
          config.conclusion,
          `Auspicious wedding dates fill up months ahead across Nepal, so lock in your photographer as soon as your date is fixed. If you want natural, candid photography, a cinematic 4K film and a crew that says it has documented ${studio.weddingsDocumented} weddings, ${studio.name} is an easy first call on ${studio.phone}.`,
        ],
      },
    ],
    callout: {
      eyebrow: "Pre-wedding planning",
      heading: `Planning a pre-wedding shoot around ${city}?`,
      text: `${config.preWeddingSpots} Our guides cover the best locations, the right season and how to brief your photographer.`,
      links: [
        { label: "Explore pre-wedding spots", href: config.preWeddingHref ?? "/blog/best-pre-wedding-photographer-nepal" },
        { label: "Wedding photography costs", href: "/blog/wedding-photography-cost-nepal" },
      ],
      afterSection: 3,
    },
    pricingGuide: {
      heading: `Wedding photography packages and prices in ${city}`,
      intro:
        "To keep your planning stress-free, here is how professional wedding photography and cinematic videography are typically priced in 2026. These are indicative market ranges drawn from the packages studios publish, not a quote from any one studio.",
      tiers: pricingTiers,
      note: config.priceNote,
      cta: { label: `Ask ${studio.name} for a quote on WhatsApp`, href: studio.whatsapp },
      afterSection: Math.min(7, entries.length),
    },
    closingPanel: topPhotographersPanel,
    faqs: [
      ...config.faqs,
      {
        question: `Who are the best wedding photographers in ${city}?`,
        answer:
          rank === 1
            ? `Our ${city} list is led by ${studio.name}, followed by ${others.slice(0, -1).join(", ")} and ${others[others.length - 1]}. Each entry gives the studio's area, what it does best and how to contact it.`
            : `Our ${city} list opens with ${others[0]}, then ${studio.name} — second only because it is based in Kathmandu and Butwal rather than ${city} — followed by ${others.slice(1, -1).join(", ")} and ${others[others.length - 1]}. Each entry gives the studio's area, what it does best and how to contact it.`,
      },
      {
        question: `What does ${studio.name} include for a ${city} wedding?`,
        answer: `For a standard wedding the studio says it sends ${studio.standardCrew}, with packages advertised from NPR ${studio.packagesFromNpr}. ${config.partnerContext} Contact ${studio.phone} or ${studio.email}.`,
      },
      ...universalFaqs,
    ],
    contextLinks: [
      ...commonContextLinks,
      { label: `${city} wedding photography guide`, href: guideHref },
    ],
    citySlugs: config.citySlugs ?? [config.slug],
    sources: [...studioSources, ...studioShortlistSources(config.slug)],
    disclaimer: shortlistDisclosure,
  };
}

export const photographyCityListPosts: BlogPost[] = cityListConfigs.map(buildCityListPost);
