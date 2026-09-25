import type { BlogPost } from "./blog";
import { cityListPointerSection } from "./photography-city-shortlists";
import {
  commonContextLinks,
  guideDisclosure,
  recommendedStudioSection,
  photoImage as image,
  photoPublication as publication,
  studio,
  studioSources,
  universalFaqs,
} from "./photography-partner";

/** When the city list pages were split out; existing guides keep their original publish date. */
const shortlistRevision = { modifiedAt: "2026-09-25" } as const;
const newCityGuidePublication = {
  date: "25 Sep 2026",
  publishedAt: "2026-09-25",
  modifiedAt: "2026-09-25",
} as const;

/** City-specific photography guides. Each covers venue types, local ceremony traditions and
 * logistics particular to that place, so they stay substantively distinct from one another.
 * They own the "how to choose" intent; the matching `best-wedding-photographers-in-*` list pages
 * (`photography-city-lists`) own "who to hire", and each guide links to its list. */
export const photographyCityGuidePosts: BlogPost[] = [
  {
    ...publication,
    ...shortlistRevision,
    title: "Wedding Photography in Kathmandu: Venues, Traditions and Logistics",
    seoTitle: "Kathmandu Wedding Photography Guide: Venues and Logistics",
    slug: "best-wedding-photographer-kathmandu",
    href: "/blog/best-wedding-photographer-kathmandu",
    category: "Photography",
    excerpt:
      "How to book wedding coverage in the Kathmandu Valley: heritage and hotel venues, Newar ceremony requirements, valley traffic and timing, and how to size a crew.",
    description:
      "Plan wedding photography in Kathmandu: heritage and banquet venue lighting, Newar and Hindu ceremony coverage, valley traffic timing and crew sizing advice.",
    image: image("photo-1583939003579-730e3918a45a"),
    imageAlt: "Bride and groom surrounded by guests throwing petals after the ceremony",
    readTime: "12 min read",
    author: "Nepali Directory Events Desk",
    keywords: [
      "how to choose a wedding photographer in Kathmandu",
      "Kathmandu wedding photography guide",
      "wedding photographer Kathmandu",
      "Kathmandu wedding photography",
      "Newar wedding photographer",
      "wedding photography Kathmandu valley",
    ],
    tags: ["Photography", "Weddings", "Kathmandu"],
    sections: [
      {
        heading: "The valley has the deepest supplier pool and the hardest logistics",
        paragraphs: [
          "Kathmandu offers more photographers, more equipment and more venue variety than anywhere else in Nepal, which is genuinely an advantage. The trade-off is movement: valley traffic can turn a fifteen-kilometre transfer between a home ceremony and a reception venue into an hour, and wedding schedules rarely build in enough margin for it.",
          "Ask any studio you shortlist how they handle transfers on a multi-venue valley wedding. Experienced teams split the crew so someone is already set up at the next location rather than travelling with the party and arriving alongside the couple with nothing prepared.",
        ],
      },
      {
        heading: "Venue types and what each demands technically",
        paragraphs: [
          "Heritage courtyards and older Newar architecture give texture and atmosphere that no banquet hall matches, but they are frequently tight, shaded and crowded, which demands competence with fast lenses and off-camera light in confined space. Ask to see work shot in a comparable courtyard rather than an open lawn.",
          "Hotel ballrooms and party palaces are the more common choice and bring the standard problem of mixed, coloured interior lighting that damages skin tones without correction. Garden and lawn venues invert the problem: beautiful late-afternoon light, then a hard transition to evening events that needs real lighting equipment rather than an on-camera flash.",
        ],
      },
      {
        heading: "Ceremony tradition should drive the shortlist",
        paragraphs: [
          "The valley hosts Hindu, Newar, Buddhist and mixed ceremonies, and each has its own sequence, its own significant moments and its own etiquette about where a photographer may stand. Newar wedding traditions in particular involve rituals and family roles that an unfamiliar photographer will not anticipate, and anticipation is the whole job — being in position before the moment rather than reacting after it.",
          "So ask a direct question: which specific tradition have you shot most recently, and may I see that full gallery. A studio that has shot your tradition repeatedly will also know the customary points at which photography is welcome and the points at which it is intrusive, which protects you from awkwardness on the day.",
        ],
      },
      {
        heading: "Heritage site permissions and fees",
        paragraphs: [
          "If any part of your wedding or portrait session happens at a Durbar Square, a monument zone or a managed heritage garden, expect entry charges and, in many cases, separate rules or fees for commercial photography, with different rates for Nepali and foreign nationals. These are set by the managing authority and change periodically.",
          "Confirm current requirements with the specific site well before the date, and agree in writing whether you or the studio arranges and pays them. This is a routine part of valley weddings, but it derails schedules when discovered on the morning itself.",
        ],
      },
      cityListPointerSection(
        "kathmandu",
        "Separate lists cover studios based in [Lalitpur](/blog/best-wedding-photographers-in-lalitpur) and [Bhaktapur](/blog/best-wedding-photographers-in-bhaktapur), since many valley weddings draw on all three.",
      ),
      recommendedStudioSection(
        `The studio's Kathmandu base at ${studio.kathmanduStudio} puts it inside the valley for setup and transfers, and it lists heritage venues and Newar ceremonies among its stated specialisms; ask which valley venues it has covered most recently.`,
      ),
    ],
    faqs: [
      {
        question: "How do I choose a wedding photographer in Kathmandu?",
        answer:
          "Shortlist studios that have repeatedly shot your specific ceremony tradition and a venue like yours, then ask each for one complete recent gallery from a comparable venue. Confirm how they handle transfers between multi-venue valley locations, since traffic regularly breaks schedules, and name the actual shooting photographer in the contract.",
      },
      {
        question: "Do I need permission to photograph at Kathmandu heritage sites?",
        answer:
          "Usually yes. Durbar Squares, monument zones and managed heritage gardens charge entry fees and often apply separate rules or charges for commercial photography, with different rates for Nepali and foreign nationals. Confirm current requirements with the managing authority before the date and agree in writing who pays.",
      },
      {
        question: "What makes heritage courtyard weddings technically harder to shoot?",
        answer:
          "They are typically tight, shaded and crowded, which requires skill with fast lenses and off-camera lighting in confined space. A portfolio full of open lawn and ballroom work does not demonstrate that ability, so ask specifically for a full gallery shot in a comparable courtyard.",
      },
      ...universalFaqs,
    ],
    contextLinks: [
      ...commonContextLinks,
      { label: "Wedding photographers in Lalitpur", href: "/blog/best-wedding-photographers-in-lalitpur" },
      { label: "Wedding photographers in Bhaktapur", href: "/blog/best-wedding-photographers-in-bhaktapur" },
    ],
    citySlugs: ["kathmandu", "lalitpur", "bhaktapur"],
    sources: studioSources,
    disclaimer: guideDisclosure,
  },
  {
    ...publication,
    ...shortlistRevision,
    title: "Wedding Photography in Pokhara: Lakeside and Mountain Coverage",
    seoTitle: "Pokhara Wedding Photography Guide: Venues and Weather",
    slug: "best-wedding-photographer-pokhara",
    href: "/blog/best-wedding-photographer-pokhara",
    category: "Photography",
    excerpt:
      "Pokhara as a wedding destination: lakeside and resort venues, mountain backdrops that depend on weather, and what to settle when your photographer travels to you.",
    description:
      "Plan wedding photography in Pokhara: lakeside and resort venues, Annapurna backdrop weather risk, destination logistics and travel terms for visiting studios.",
    image: image("photo-1591604466107-ec97de577aff"),
    imageAlt: "Bride and groom posing beside a lake framed by autumn trees",
    readTime: "12 min read",
    author: "Nepali Directory Events Desk",
    keywords: [
      "how to choose a wedding photographer in Pokhara",
      "Pokhara wedding photography guide",
      "wedding photographer Pokhara",
      "Pokhara wedding photography",
      "destination wedding Pokhara",
      "lakeside wedding Pokhara",
    ],
    tags: ["Photography", "Weddings", "Pokhara"],
    sections: [
      {
        heading: "Pokhara is Nepal's most common destination-wedding choice",
        paragraphs: [
          "Phewa Lake, the Annapurna range on a clear morning and a concentration of resorts make Pokhara the default when a couple wants a wedding that does not look like a city wedding. That popularity means most couples marrying here are travelling in, which changes the photography brief: coverage often extends across arrival days, informal gatherings and a departure brunch, not just the ceremony.",
          "Decide early how much of that surrounding programme you want documented. It is usually cheaper to extend a photographer already on site than to add days later, and the informal moments frequently produce the gallery's best images.",
        ],
      },
      {
        heading: "The mountain backdrop is a weather bet, so plan for both outcomes",
        paragraphs: [
          "The Annapurna and Machhapuchhre views that sell Pokhara are reliable in the clear post-monsoon and winter months and frequently absent during monsoon, when cloud can sit on the range for days. Sarangkot at sunrise is the classic vantage point and demands a pre-dawn start.",
          "Brief your photographer on both scenarios. A studio that has worked here often will have a lakeside and resort plan that produces a strong gallery with no mountain visible at all, which is the difference between a disappointing day and a different but equally good one.",
        ],
      },
      {
        heading: "Venue types around the lake and beyond",
        paragraphs: [
          "Lakeside resorts offer water, gardens and controlled logistics, and are the most straightforward option. Hillside properties above the valley trade easy access for elevation and long views. Begnas Lake gives a quieter, less developed alternative to Phewa, and the World Peace Pagoda and Davis Falls areas are common portrait stops rather than ceremony venues.",
          "Whichever you choose, ask about the evening. Many lakeside venues are stunning at golden hour and poorly lit after dark, so confirm what lighting equipment the team brings for the reception rather than assuming the venue provides usable light.",
        ],
      },
      {
        heading: "Travel terms when your studio comes from elsewhere",
        paragraphs: [
          "If you book a Kathmandu or Butwal studio for a Pokhara wedding, travel and accommodation for the whole crew across every coverage day is a normal and reasonable charge, but it must be quoted rather than discovered. Ask whether it is included in the package figure or added, and for how many people.",
          "Also confirm arrival timing. A crew that travels on the morning of the ceremony is one road delay away from missing the preparations. Experienced destination teams arrive the day before, scout the venue in the actual light, and are set up before anything begins.",
        ],
      },
      cityListPointerSection(
        "pokhara",
        "Booking a studio already based in Pokhara removes the travel and accommodation line from the quote entirely, which is worth weighing against any studio you would bring in.",
      ),
      recommendedStudioSection(
        "Pokhara is among the studio's listed coverage areas and it offers destination packages; if you book from outside Pokhara, confirm in writing how many crew travel, whether accommodation is included and whether they arrive the day before to scout.",
      ),
    ],
    faqs: [
      {
        question: "When should I plan a Pokhara wedding for the mountain views?",
        answer:
          "The clear post-monsoon and winter months give the most reliable Annapurna and Machhapuchhre visibility, while monsoon can hide the range for days. Because no photographer can guarantee the view, brief your studio on a lakeside and resort plan that works with no mountain visible at all.",
      },
      {
        question: "Does a photographer charge extra to travel to Pokhara?",
        answer:
          "Normally yes if the studio is based elsewhere. Travel and accommodation for the full crew across every coverage day is a reasonable charge, but ask whether it is included in the quoted package or added on, and for how many people, before comparing quotes.",
      },
      {
        question: "Should the photographer arrive before the wedding day?",
        answer:
          "For a destination wedding, strongly prefer it. A crew arriving the morning of the ceremony is one road delay from missing preparations. Experienced teams travel the day before, scout the venue in the light they will actually shoot in, and are set up before events begin.",
      },
      ...universalFaqs,
    ],
    contextLinks: [
      ...commonContextLinks,
      { label: "Pre-wedding locations in Pokhara", href: "/blog/best-pre-wedding-photographer-pokhara" },
    ],
    citySlugs: ["pokhara"],
    sources: studioSources,
    disclaimer: guideDisclosure,
  },
  {
    ...publication,
    title: "Pre-Wedding Photography in Pokhara: Locations and Timing",
    seoTitle: "Best Pre-Wedding Photographer in Pokhara: Locations Guide",
    slug: "best-pre-wedding-photographer-pokhara",
    href: "/blog/best-pre-wedding-photographer-pokhara",
    category: "Photography",
    excerpt:
      "Pokhara's pre-wedding locations compared: Phewa and Begnas lakes, Sarangkot sunrise, the Peace Pagoda and hillside viewpoints, with timing and access notes for each.",
    description:
      "Plan a pre-wedding shoot in Pokhara: comparing Phewa lakeside, Begnas, Sarangkot sunrise, World Peace Pagoda and hill viewpoints, plus timing, access and outfit planning.",
    image: image("photo-1544735716-392fe2489ffa"),
    imageAlt: "Couple photographed beside a lake at sunrise",
    readTime: "9 min read",
    author: "Nepali Directory Events Desk",
    keywords: [
      "best pre wedding photographer in Pokhara",
      "pre wedding shoot Pokhara",
      "Pokhara pre wedding locations",
      "Sarangkot pre wedding shoot",
      "Phewa lake photoshoot",
    ],
    tags: ["Photography", "Pre-Wedding", "Pokhara"],
    sections: [
      {
        heading: "Why Pokhara suits pre-wedding work better than most of Nepal",
        paragraphs: [
          "Pre-wedding sessions need variety within a short radius, and Pokhara delivers that unusually well: water, hills, forest, mountain panorama and open sky are all within a modest drive of the lakeside. A well-planned half-day can realistically produce three visually distinct sets without a long transfer between them.",
          "That density is the practical argument for shooting here rather than closer to home. It also means an itinerary is essential — without one you lose the light travelling between locations chosen on the day.",
        ],
      },
      {
        heading: "The main locations and what each gives you",
        paragraphs: [
          "Sarangkot is the sunrise option, giving the Annapurna range and a cloud-filled valley below on a good morning, at the cost of a pre-dawn start and complete dependence on weather. The Phewa lakeside and boating on the lake give reliable water and hill backdrops at almost any time, and are the safest core of an itinerary.",
          "The World Peace Pagoda adds elevation, architecture and a view back over the lake. Begnas Lake is quieter and less developed than Phewa, better if you want images without crowds. Devi's Fall and the surrounding areas work as short texture stops rather than as a session's centrepiece.",
        ],
      },
      {
        heading: "Timing the day around light, crowds and weather",
        paragraphs: [
          "Sunrise and the hour before sunset do almost all the work. A common and effective structure is a Sarangkot or hillside sunrise, a break through the harsh middle of the day, then a lakeside golden-hour set. Fighting midday sun by the water produces squinting and hard shadows no edit will fix.",
          "Crowds matter here more than elsewhere, because Pokhara is a tourist centre. The same viewpoints that are quiet at dawn are busy by mid-morning, which is another argument for the early start. In monsoon, hold a fallback date, since both the mountain view and outdoor comfort are unreliable.",
        ],
      },
      {
        heading: "Practical planning for a multi-location session",
        paragraphs: [
          "Fix the itinerary and transport in advance, including who drives and how long each transfer takes in real conditions. Decide where outfit changes happen — a hotel near the lakeside is far easier than improvising at a viewpoint — and who carries outfits, water and makeup between stops.",
          "Tell the photographer which single location matters most to you. If the morning is lost to cloud or the day runs short, that ranking lets them protect your priority instead of guessing. Bring reference images for each set rather than describing a mood in adjectives.",
        ],
      },
      recommendedStudioSection(
        "Pokhara is among the studio's listed pre-wedding locations; ask which of Sarangkot, Phewa lakeside, Begnas and the Peace Pagoda it has shot most recently, and what itinerary it recommends for the season you are planning.",
      ),
    ],
    faqs: [
      {
        question: "What are the best pre-wedding locations in Pokhara?",
        answer:
          "Sarangkot for a sunrise mountain panorama, the Phewa lakeside and boating for reliable water and hill backdrops, the World Peace Pagoda for elevation and architecture with a view over the lake, and Begnas Lake for quieter images away from crowds. Devi's Fall works as a short texture stop.",
      },
      {
        question: "How should I structure a pre-wedding shoot day in Pokhara?",
        answer:
          "A common effective structure is a Sarangkot or hillside sunrise set, a break through the harsh midday hours, then a lakeside golden-hour set. Fix transport and outfit-change points in advance, and tell the photographer which location matters most so priorities are clear if weather or time runs short.",
      },
      {
        question: "Is Sarangkot worth the early start for a pre-wedding shoot?",
        answer:
          "On a clear morning in the post-monsoon or winter months, yes — it gives the Annapurna range above a cloud-filled valley. During monsoon it frequently delivers nothing, so treat it as the ambitious part of an itinerary that also includes reliable lakeside locations.",
      },
      ...universalFaqs,
    ],
    contextLinks: commonContextLinks,
    citySlugs: ["pokhara"],
    sources: studioSources,
    disclaimer: guideDisclosure,
  },
  {
    ...publication,
    ...shortlistRevision,
    title: "Wedding Photography in Chitwan: Resorts, Tharu Traditions and Terai Light",
    seoTitle: "Chitwan Wedding Photography Guide: Resorts and Traditions",
    slug: "best-wedding-photographer-chitwan",
    href: "/blog/best-wedding-photographer-chitwan",
    category: "Photography",
    excerpt:
      "Wedding coverage across Chitwan and Bharatpur: jungle-resort venues, Tharu cultural traditions, Terai heat and light, and how to brief a photographer for both.",
    description:
      "Plan wedding photography in Chitwan: Bharatpur banquet venues, Sauraha jungle resorts, Tharu wedding traditions, Terai heat and light, and crew planning advice.",
    image: image("photo-1522413452208-996ff3f3e740"),
    imageAlt: "Wedding reception table set with plates, candles and greenery",
    readTime: "11 min read",
    author: "Nepali Directory Events Desk",
    keywords: [
      "how to choose a wedding photographer in Chitwan",
      "Chitwan wedding photography guide",
      "wedding photographer Bharatpur",
      "Chitwan wedding photography",
      "Sauraha wedding photographer",
      "Tharu wedding photography",
    ],
    tags: ["Photography", "Weddings", "Chitwan", "Bharatpur"],
    sections: [
      {
        heading: "Two quite different wedding markets in one district",
        paragraphs: [
          "Chitwan supports two distinct kinds of wedding. Bharatpur, the district's main city, hosts conventional urban weddings at banquet venues and party palaces with large guest lists, much like any Terai city. Sauraha and the fringe of Chitwan National Park host destination and resort weddings for couples who want jungle and riverside settings.",
          "These need different briefs. A Bharatpur banquet wedding is a crowd-and-interior-lighting problem; a Sauraha resort wedding is an outdoor-light, wildlife-adjacent and travel-logistics problem. Tell studios which you are planning, and ask for a matching gallery.",
        ],
      },
      {
        heading: "Tharu traditions deserve a photographer who knows them",
        paragraphs: [
          "The Tharu are indigenous to the Terai and Chitwan has a substantial Tharu population with its own wedding customs, dress and music that differ markedly from Hindu ceremonies elsewhere in Nepal. A photographer unfamiliar with the sequence will miss moments that the family considers central, and will not know where standing is appropriate.",
          "If yours is a Tharu wedding, or a mixed ceremony, make that the first question you ask. Request a full gallery from a Tharu wedding specifically rather than accepting general Terai experience as equivalent.",
        ],
      },
      {
        heading: "Heat, light and the Terai schedule",
        paragraphs: [
          "Chitwan gets genuinely hot, and outdoor daytime events in the warmer months are physically demanding for everyone including the crew. Hard overhead sun also produces the least flattering light of the day. Where the schedule allows, push outdoor portraits toward early morning or late afternoon.",
          "Resort and riverside venues transition quickly from beautiful golden light to full dark, and many have decorative rather than functional evening lighting. Confirm what lighting equipment the team carries for the reception, and whether they have power and charging arrangements at a venue that may be some distance from reliable supply.",
        ],
      },
      {
        heading: "Logistics for park-adjacent venues",
        paragraphs: [
          "Sauraha and similar locations add travel time from Bharatpur, and access can involve river crossings or rough approaches depending on the property and season. Establish how the crew travels, how long it takes, and what the plan is if the road or weather turns.",
          "If any part of your programme involves the national park or its buffer zone, confirm current rules and any permissions or fees with the managing authority in advance, and agree in writing who arranges them. Do not assume a resort booking covers photography access to park areas.",
        ],
      },
      cityListPointerSection(
        "chitwan",
        "Most are based in Bharatpur or Narayangarh, so for a Sauraha resort wedding ask each how it prices the drive and whether the crew stays overnight.",
      ),
      recommendedStudioSection(
        "Chitwan is among the studio's listed coverage areas, and its Butwal base is considerably closer to Bharatpur than Kathmandu is, which reduces crew travel cost; confirm travel terms and whether the team has shot the specific venue type you are planning.",
      ),
    ],
    faqs: [
      {
        question: "What should I look for in a Chitwan wedding photographer?",
        answer:
          "Match the studio to your venue type: Bharatpur banquet weddings are a crowd and interior-lighting problem, while Sauraha resort weddings are an outdoor-light and travel-logistics problem. Ask for a full gallery from the same kind of venue, and if yours is a Tharu ceremony, ask specifically for Tharu wedding work.",
      },
      {
        question: "Why does a Tharu wedding need a photographer familiar with the tradition?",
        answer:
          "Tharu wedding customs, dress and music differ markedly from Hindu ceremonies elsewhere in Nepal, and the sequence of significant moments is not obvious to an outsider. A photographer who knows it anticipates and is in position, and also knows where standing is and is not appropriate.",
      },
      {
        question: "What extra logistics apply to Sauraha and park-adjacent venues?",
        answer:
          "Add travel time from Bharatpur, and expect access that may involve river crossings or rough approaches depending on property and season. Confirm crew travel arrangements, power and charging at the venue, and check current rules and fees with the managing authority for anything involving the national park or buffer zone.",
      },
      ...universalFaqs,
    ],
    contextLinks: commonContextLinks,
    citySlugs: ["chitwan", "bharatpur"],
    sources: studioSources,
    disclaimer: guideDisclosure,
  },
  {
    ...newCityGuidePublication,
    title: "Wedding Photography in Lalitpur: Patan Courtyards, Newar Rituals and Venues",
    seoTitle: "Lalitpur Wedding Photography Guide: Patan and Newar Weddings",
    slug: "best-wedding-photographer-lalitpur",
    href: "/blog/best-wedding-photographer-lalitpur",
    category: "Photography",
    excerpt:
      "What Lalitpur weddings demand of a photographer: Patan courtyards, Newar rituals, heritage-site rules and banquet venues from Jawalakhel to Godawari.",
    description:
      "Plan wedding photography in Lalitpur: Patan courtyard ceremonies, Newar ritual sequences, Durbar Square rules and traffic between Lalitpur and Kathmandu.",
    image: image("photo-1519741497674-611481863552"),
    imageAlt: "Bride holding a white and pink bouquet beside the groom in warm backlight",
    readTime: "11 min read",
    author: "Nepali Directory Events Desk",
    keywords: [
      "how to choose a wedding photographer in Lalitpur",
      "Lalitpur wedding photography guide",
      "wedding photographer Lalitpur",
      "Patan wedding photographer",
      "Newar wedding photography Lalitpur",
    ],
    tags: ["Photography", "Weddings", "Lalitpur", "Patan"],
    sections: [
      {
        heading: "Lalitpur weddings split between old Patan and the newer south",
        paragraphs: [
          "Lalitpur is really two wedding markets. Inside old Patan, ceremonies happen in family homes and courtyards around the Durbar Square, where many lanes are too narrow for vehicles and a crew carries every light stand and bag in on foot. South and east of the Ring Road — Jawalakhel, Kupondole, Satdobato, Imadol, Bhaisepati and out towards Godawari — the pattern is the familiar valley one of party palaces, hotel ballrooms and garden resorts.",
          "Tell every studio which of the two you are planning, or whether your wedding moves between them. A photographer who is excellent in a well-lit banquet hall can still struggle in a dim upstairs room of a Newar house, and the reverse is also true.",
        ],
      },
      {
        heading: "Newar ceremonies reward a photographer who knows the sequence",
        paragraphs: [
          "Many Lalitpur families are Newar, and Newar weddings typically spread their rituals across more than one day and across both family homes. Several of the moments families care most about happen indoors, in small rooms, with elders seated close together — conditions where a photographer needs to know in advance where to stand and when to move.",
          "Ask each studio how many Newar weddings it has covered recently and request one complete gallery, not a highlight reel. If your families follow Buddhist rather than Hindu Newar practice, or combine the two, say so up front: the order of events differs, and a crew that assumes the wrong sequence will be out of position.",
        ],
      },
      {
        heading: "Heritage sites, fees and crowds in Patan",
        paragraphs: [
          "Patan Durbar Square and the monument zone around it are the obvious portrait backdrop, and they are also a managed heritage area that charges visitors and may set conditions for professional shoots. The square is quietest early in the morning; by late morning it fills with visitors.",
          "Confirm current entry charges and any photography rules with the site management well before the date, and agree in writing whether you or the studio arranges them. The same applies to managed gardens and temple compounds you might add to a pre-wedding itinerary, such as the botanical garden at Godawari.",
        ],
      },
      {
        heading: "Traffic between Lalitpur and Kathmandu",
        paragraphs: [
          "Many Lalitpur weddings have one side of the family in Kathmandu, which puts a Bagmati bridge crossing or a stretch of the Ring Road between the two households. Those crossings are slow at peak hours and on big wedding dates, when much of the valley is on the move at once.",
          "If preparations happen at two houses on either side of the river, one photographer cannot cover both. Ask studios to plan two crews for the morning, or build the schedule so the lead photographer finishes at one house before the other begins.",
        ],
      },
      cityListPointerSection("lalitpur"),
      recommendedStudioSection(
        `The studio's Kathmandu base at ${studio.kathmanduStudio} is a short drive from Patan, so Lalitpur coverage does not normally add overnight travel; ask for one complete gallery from a Lalitpur courtyard or banquet wedding before you compare it with the studios on our [Lalitpur list](/blog/best-wedding-photographers-in-lalitpur).`,
      ),
    ],
    faqs: [
      {
        question: "What makes Patan courtyard weddings harder to photograph?",
        answer:
          "Courtyards and family rooms in old Patan are tight, often dim and crowded with relatives, and vehicles cannot reach many of them, so the crew carries all equipment in on foot. Ask for a complete gallery from a comparable indoor or courtyard ceremony, not just open-air portraits.",
      },
      {
        question: "Do I need permission to shoot at Patan Durbar Square?",
        answer:
          "The square is a managed heritage area that charges visitors and may apply conditions to professional shoots. Confirm the current rules and fees with site management before the date, agree who pays, and plan portraits for early morning, before it gets busy.",
      },
      ...universalFaqs,
    ],
    contextLinks: [
      ...commonContextLinks,
      { label: "Kathmandu wedding photography guide", href: "/blog/best-wedding-photographer-kathmandu" },
    ],
    citySlugs: ["lalitpur"],
    sources: studioSources,
    disclaimer: guideDisclosure,
  },
  {
    ...newCityGuidePublication,
    title: "Wedding Photography in Bhaktapur: Heritage Squares, Newar Dress and Venues",
    seoTitle: "Bhaktapur Wedding Photography Guide: Heritage and Nagarkot",
    slug: "best-wedding-photographer-bhaktapur",
    href: "/blog/best-wedding-photographer-bhaktapur",
    category: "Photography",
    excerpt:
      "Planning wedding and pre-wedding photography in Bhaktapur: heritage squares, Newar dress rental, Nagarkot sunrise and banquet venues from Thimi to Suryabinayak.",
    description:
      "Plan wedding photography in Bhaktapur: heritage-square timing and fees, Newar dress sessions, Nagarkot and Changu Narayan itineraries and banquet venues.",
    image: image("photo-1465495976277-4387d4b0b4c6"),
    imageAlt: "Couple's hands with wedding rings resting on a bouquet",
    readTime: "11 min read",
    author: "Nepali Directory Events Desk",
    keywords: [
      "how to choose a wedding photographer in Bhaktapur",
      "Bhaktapur wedding photography guide",
      "wedding photographer Bhaktapur",
      "Bhaktapur pre wedding shoot",
      "Newari wedding photographer Bhaktapur",
    ],
    tags: ["Photography", "Weddings", "Bhaktapur"],
    sections: [
      {
        heading: "Bhaktapur is a portrait backdrop and a wedding market at once",
        paragraphs: [
          "Couples from across the valley come to Bhaktapur for portraits: the Durbar Square, Taumadhi Square with the Nyatapola temple, Dattatreya Square and the brick lanes between them give a density of traditional architecture that newer parts of the valley cannot match. Bhaktapur's own weddings, meanwhile, are mostly held in family homes in the old town and in party palaces along the Araniko Highway corridor through Thimi, Kausaltar, Sallaghari and Suryabinayak.",
          "Those are two different jobs. When you shortlist, ask each studio for a complete wedding it shot at a Bhaktapur banquet venue and, separately, for a heritage-square session, rather than accepting one as proof of the other.",
        ],
      },
      {
        heading: "Heritage squares: timing, fees and foot access",
        paragraphs: [
          "The old town's core is a managed heritage area with an entry fee for visitors and a largely pedestrian centre, so crews walk in with their equipment, and outfit changes need a planned base nearby. Crowds build through the day and during festivals — above all Bisket Jatra around the Nepali new year in April, when the squares are given over to the festival.",
          "Plan portrait sets for early morning, confirm current fees and any conditions on professional photography with the municipality's heritage management before the date, and agree in writing who arranges them.",
        ],
      },
      {
        heading: "Newar dress and cultural sessions",
        paragraphs: [
          "Many couples want at least one set in traditional Newar dress — for women often the haku patasi, the black sari with a red border — and several Bhaktapur studios keep cultural outfits and jewellery to rent. That can simplify a pre-wedding day considerably, since outfit changes happen at the studio rather than in a public square.",
          "Ask whether rental and styling are included in the package or charged separately, how many looks the session covers, and whether the photographer has worked with family heirloom jewellery, which needs more careful handling and lighting than costume pieces.",
        ],
      },
      {
        heading: "Nagarkot and Changu Narayan for a wider itinerary",
        paragraphs: [
          "On the district's eastern rim, the Nagarkot ridge offers sunrise views towards the Himalaya on clear mornings, and the hilltop Changu Narayan temple adds another heritage setting. Both involve a steep drive up from the valley floor and, for Nagarkot, a pre-dawn start.",
          "Treat the mountain view as a bonus rather than the plan: it is most reliable in the clear months after the monsoon and in winter, and often absent during the monsoon itself. A good itinerary pairs a Nagarkot sunrise with old-town sets that work in any weather.",
        ],
      },
      cityListPointerSection("bhaktapur"),
      recommendedStudioSection(
        `The studio's Kathmandu base at ${studio.kathmanduStudio} is inside the valley, so Bhaktapur coverage does not normally involve overnight travel; ask for a complete gallery from a Bhaktapur heritage or Thimi banquet wedding before comparing it with the studios on our [Bhaktapur list](/blog/best-wedding-photographers-in-bhaktapur).`,
      ),
    ],
    faqs: [
      {
        question: "Where are the best pre-wedding spots in Bhaktapur?",
        answer:
          "The Durbar Square, Taumadhi Square with the Nyatapola temple, Dattatreya Square and the old-town lanes for heritage sets, plus the Nagarkot ridge for sunrise views and Changu Narayan for a hilltop temple. Shoot the squares early in the morning, before crowds build.",
      },
      {
        question: "Can I rent traditional Newar dress for a Bhaktapur shoot?",
        answer:
          "Yes. Several Bhaktapur studios rent cultural outfits such as the haku patasi, with matching jewellery. Ask whether rental and styling are in the package, how many looks are included, and where outfit changes will happen.",
      },
      ...universalFaqs,
    ],
    contextLinks: [
      ...commonContextLinks,
      { label: "Pre-wedding photography in Nepal", href: "/blog/best-pre-wedding-photographer-nepal" },
    ],
    citySlugs: ["bhaktapur"],
    sources: studioSources,
    disclaimer: guideDisclosure,
  },
  {
    ...newCityGuidePublication,
    title: "Wedding Photography in Biratnagar: Multi-Day Weddings, Fog and Night Rites",
    seoTitle: "Biratnagar Wedding Photography Guide: Seasons and Venues",
    slug: "best-wedding-photographer-biratnagar",
    href: "/blog/best-wedding-photographer-biratnagar",
    category: "Photography",
    excerpt:
      "What Biratnagar weddings demand of a photographer: multi-day Marwari and Madhesi programmes, late-night rites, Terai heat and winter fog, and pre-wedding trips.",
    description:
      "Plan wedding photography in Biratnagar: multi-day Terai weddings, late-night lighting, winter fog, and tea-garden and Koshi pre-wedding trips.",
    image: image("photo-1469371670807-013ccf25f16a"),
    imageAlt: "Outdoor wedding ceremony aisle lined with chairs and flower arrangements",
    readTime: "11 min read",
    author: "Nepali Directory Events Desk",
    keywords: [
      "how to choose a wedding photographer in Biratnagar",
      "Biratnagar wedding photography guide",
      "wedding photographer Biratnagar",
      "Biratnagar wedding videography",
      "wedding photographer Morang",
    ],
    tags: ["Photography", "Weddings", "Biratnagar"],
    sections: [
      {
        heading: "Eastern Nepal's biggest wedding market is also its most varied",
        paragraphs: [
          "Biratnagar draws weddings from across Morang and the eastern Terai, and the families behind them follow very different traditions: hill Hindu ceremonies, Maithil and other Madhesi weddings, Marwari programmes, and Rai, Limbu and Tharu customs. The number of events, their timing and the moments that matter change with each.",
          "Marwari and many Madhesi weddings in particular run over several days, with mehendi, haldi and music nights before the main ceremony and rites that continue late into the night. Map every event you want covered, with times, before asking for quotes, and ask studios for a full gallery from a wedding of your tradition.",
        ],
      },
      {
        heading: "Late-night rituals need real lighting, not just a flash",
        paragraphs: [
          "When the most important rites happen after dark — under a decorated mandap, in a courtyard strung with fairy lights, or in a banquet hall with coloured stage lighting — the quality of the photographs depends on the crew's lighting kit and skill. Ask what off-camera lighting the team brings, and look specifically at night-time frames in the galleries you are shown.",
          "Also ask about staffing. A ceremony that ends in the early hours after a full day of events needs either a larger crew working in shifts or a clear agreement on overtime; settle which in the contract.",
        ],
      },
      {
        heading: "Heat, monsoon and winter fog",
        paragraphs: [
          "The Terai is hot from spring into the monsoon, which makes daytime outdoor portraits uncomfortable and the light harsh. The main wedding season falls in the cooler months, but it brings its own problem: dense morning fog across the eastern Terai in December and January, which can erase early outdoor sets and delay flights and road travel.",
          "Schedule outdoor portraits for late afternoon in winter, keep an indoor alternative ready for fog-bound mornings, and if your photographer or relatives are flying into Biratnagar, leave margin for delays.",
        ],
      },
      {
        heading: "Pre-wedding trips from Biratnagar",
        paragraphs: [
          "Biratnagar itself is flat and built up, so couples often travel for pre-wedding sessions: the tea gardens of Jhapa and Ilam to the east, the hills around Dharan and Bhedetar to the north, and the wetland and river landscapes around Koshi Tappu to the north-west. Each is a day trip with a long drive, not a quick stop.",
          "Ask whether transport, the crew's meals and any entry or permit charges are included in the pre-wedding price, and fix the itinerary beforehand so the best light is not spent in a vehicle.",
        ],
      },
      cityListPointerSection(
        "biratnagar",
        "Several also cover Itahari, Dharan and Jhapa, which helps if your events span more than one town.",
      ),
      recommendedStudioSection(
        "The studio is based in Kathmandu and Butwal, so a Biratnagar wedding is destination work for it: expect crew travel and accommodation to be quoted on top, and compare that total with the studios on our [Biratnagar list](/blog/best-wedding-photographers-in-biratnagar) before deciding.",
      ),
    ],
    faqs: [
      {
        question: "When is the best time for a wedding shoot in Biratnagar?",
        answer:
          "The cooler months of the main wedding season are the most comfortable, but December and January often bring dense morning fog across the eastern Terai. Plan outdoor portraits for late afternoon, keep an indoor alternative for foggy mornings, and avoid midday sessions in the hot months.",
      },
      {
        question: "How do I plan photography for a multi-day Marwari or Madhesi wedding?",
        answer:
          "List every event with its time — mehendi, haldi, music night, the main ceremony and any late-night rites — and ask studios to quote against that schedule. Check night-time lighting in full galleries, and agree overtime or shift arrangements for ceremonies that run into the early hours.",
      },
      ...universalFaqs,
    ],
    contextLinks: [
      ...commonContextLinks,
      { label: "Dharan wedding photography guide", href: "/blog/best-wedding-photographer-dharan" },
    ],
    citySlugs: ["biratnagar"],
    sources: studioSources,
    disclaimer: guideDisclosure,
  },
  {
    ...newCityGuidePublication,
    title: "Wedding Photography in Dharan: Kirat Traditions, Hills and Families Abroad",
    seoTitle: "Dharan Wedding Photography Guide: Traditions and Locations",
    slug: "best-wedding-photographer-dharan",
    href: "/blog/best-wedding-photographer-dharan",
    category: "Photography",
    excerpt:
      "What Dharan weddings demand of a photographer: Rai and Limbu traditions, relatives watching from abroad, Bhedetar hill shoots and venues split with Itahari.",
    description:
      "Plan wedding photography in Dharan: Rai and Limbu traditions, live streaming for relatives abroad, Bhedetar and Budhasubba shoots and monsoon weather.",
    image: image("photo-1522673607200-164d1b6ce486"),
    imageAlt: "Two decorated chairs for the couple on a lawn at an outdoor wedding",
    readTime: "11 min read",
    author: "Nepali Directory Events Desk",
    keywords: [
      "how to choose a wedding photographer in Dharan",
      "Dharan wedding photography guide",
      "wedding photographer Dharan",
      "Dharan wedding videography",
      "Limbu wedding photography",
    ],
    tags: ["Photography", "Weddings", "Dharan"],
    sections: [
      {
        heading: "A hill-foot town with its own wedding traditions",
        paragraphs: [
          "Dharan sits where the Mahabharat hills meet the Terai, and its population includes large Rai and Limbu communities alongside hill Hindu, Newar and Madhesi families. Rai and Limbu weddings follow their own Kirat customs, with their own rituals, traditional dress and ornaments and, at many celebrations, group dances such as the Limbu dhan nach that involve many guests at once.",
          "Those moments are easy to miss for a photographer who does not know when they happen or which elders lead them. Ask each studio which traditions it has covered recently, and request a full gallery from a wedding like yours rather than a mixed highlight reel.",
        ],
      },
      {
        heading: "Families abroad change the brief",
        paragraphs: [
          "Many Dharan families have relatives working or settled overseas, a pattern that goes back to the town's long connection with Gurkha service. That often shapes the wedding itself: dates arranged around relatives' leave, and real demand for live streaming, quick teaser videos and fast online delivery for people who cannot attend.",
          "If that applies to you, put it in the brief. Ask whether the studio can stream the ceremony reliably, what connection it depends on, how soon a teaser and a first selection of photos will be delivered, and how the full gallery will be shared with relatives abroad.",
        ],
      },
      {
        heading: "Weather, hills and pre-wedding locations",
        paragraphs: [
          "Dharan gets heavy monsoon rain, and cloud can sit on the hills above town for days, while the dry season brings clearer views over the Terai. Popular nearby portrait locations include the Bhedetar ridge on the road north, with wide views over the plains on a clear day, and the forested temple grounds of Budhasubba on the edge of town.",
          "Plan hill sessions for the clearer months, keep a sheltered alternative for rain, and allow for the winding drive up to Bhedetar when you plan around the light.",
        ],
      },
      {
        heading: "Venues split between Dharan and Itahari",
        paragraphs: [
          "Many Dharan weddings use party palaces and banquet halls in town, but a number of larger venues sit along the road to Itahari, about half an hour south, and families regularly hold receptions in Itahari or Biratnagar.",
          "If your events move between towns, confirm that travel is included in the quote, how the crew moves between venues, and whether a second photographer is needed so that no event starts without coverage.",
        ],
      },
      cityListPointerSection("dharan"),
      recommendedStudioSection(
        "The studio is based in Kathmandu and Butwal, so Dharan is destination work for it: expect crew travel and accommodation to be quoted on top, and ask whether it has covered a Rai or Limbu wedding before you compare it with the studios on our [Dharan list](/blog/best-wedding-photographers-in-dharan).",
      ),
    ],
    faqs: [
      {
        question: "Do Dharan wedding photographers cover Rai and Limbu weddings?",
        answer:
          "Many do, but experience varies. Ask each studio which traditions it has covered recently and request a full gallery from a Rai or Limbu wedding, so you can see whether it anticipated the rituals, dress and group dances that matter to your families.",
      },
      {
        question: "Can a Dharan studio live-stream our wedding for relatives abroad?",
        answer:
          "Some offer it. Ask what equipment and internet connection the stream relies on, what happens if the connection drops, and how quickly teaser videos and a first photo selection will be delivered online.",
      },
      ...universalFaqs,
    ],
    contextLinks: [
      ...commonContextLinks,
      { label: "Biratnagar wedding photography guide", href: "/blog/best-wedding-photographer-biratnagar" },
    ],
    citySlugs: ["dharan"],
    sources: studioSources,
    disclaimer: guideDisclosure,
  },
  {
    ...newCityGuidePublication,
    title: "Wedding Photography in Birgunj: Baraats, Night Rites and Border Logistics",
    seoTitle: "Birgunj Wedding Photography Guide: Baraat and Night Rites",
    slug: "best-wedding-photographer-birgunj",
    href: "/blog/best-wedding-photographer-birgunj",
    category: "Photography",
    excerpt:
      "What Birgunj weddings demand of a photographer: baraat processions, overnight Madhesi and Marwari rites, Terai heat and fog, and hiring across the border.",
    description:
      "Plan wedding photography in Birgunj: baraat processions, overnight ceremonies, crew shifts and overtime, winter fog and cross-border hiring terms.",
    image: image("photo-1554048612-b6a482bc67e5"),
    imageAlt: "Photographer raising a camera against bright sunlight",
    readTime: "10 min read",
    author: "Nepali Directory Events Desk",
    keywords: [
      "how to choose a wedding photographer in Birgunj",
      "Birgunj wedding photography guide",
      "wedding photographer Birgunj",
      "wedding videographer Birgunj",
      "wedding photographer Parsa",
    ],
    tags: ["Photography", "Weddings", "Birgunj"],
    sections: [
      {
        heading: "Birgunj weddings run long, loud and late",
        paragraphs: [
          "Birgunj is a border trading city, and many of its weddings follow Madhesi and Marwari traditions: tilak and engagement ceremonies before the day, haldi and mehendi, a baraat procession with a band and dancing through the streets, and the main rites continuing late into the night. Coverage is measured in long days and nights, not hours.",
          "Write down every event with its time before asking for quotes, and confirm how many people the studio will send to each. A single photographer cannot follow a baraat through the streets and also be in position at the venue when it arrives.",
        ],
      },
      {
        heading: "Night rites, crowds and moving processions",
        paragraphs: [
          "The baraat is one of the hardest parts to shoot well: it moves, it is crowded and noisy, and it usually happens as daylight fades. Later, the ceremony itself may run under decorative lighting until the early hours. Ask to see full galleries that include a baraat and a late-night ceremony, and ask what lighting the crew brings.",
          "For overnight ceremonies, agree in writing whether the crew works in shifts, how overtime is charged and when the photographer may leave. Those are the points that cause disputes when they are left to the day.",
        ],
      },
      {
        heading: "Heat, fog and the wedding calendar",
        paragraphs: [
          "Birgunj is very hot from spring through the monsoon, and in December and January dense fog often settles over the central Terai in the mornings. The main wedding season falls in the cooler months, so fog is the more common problem: it slows road travel and can erase an early outdoor session.",
          "Plan outdoor portraits for the afternoon in winter, and if relatives or a crew are travelling in from Kathmandu or Hetauda, build margin into their arrival time.",
        ],
      },
      {
        heading: "Hiring across the border, and finding more names",
        paragraphs: [
          "With Raxaul directly across the border, some families consider photographers from the Indian side. If you do, settle in writing the currency and payment method, how the crew and equipment cross the border on the day, and how files will be delivered and backed up afterwards.",
          "Fewer Birgunj studios publish their work in places we could check than in Kathmandu or Pokhara; many work mainly through social media and referrals. Our Birgunj list is shorter than other cities' for that reason. Your banquet venue and recently married friends are good sources for more names — then apply the same checks.",
        ],
      },
      cityListPointerSection("birgunj"),
      recommendedStudioSection(
        "Birgunj is outside both of the studio's home cities, so treat it as destination work: expect crew travel and accommodation to be quoted on top, and ask whether it has covered an overnight Madhesi wedding before you compare it with the studios on our [Birgunj list](/blog/best-wedding-photographers-in-birgunj).",
      ),
    ],
    faqs: [
      {
        question: "How do I plan photography for a baraat in Birgunj?",
        answer:
          "Treat the baraat as its own event with its own photographer. It moves through crowded streets as daylight fades, so one person cannot follow it and also be waiting at the venue. Ask to see a full gallery that includes a baraat, and confirm what lighting the crew uses after dark.",
      },
      {
        question: "Can I hire a photographer from India for a Birgunj wedding?",
        answer:
          "Some families do. Agree in writing the currency and payment method, how the crew and equipment cross the border on the day, and how files are delivered and backed up. Apply the same portfolio and contract checks you would use for a local studio.",
      },
      ...universalFaqs,
    ],
    contextLinks: commonContextLinks,
    citySlugs: ["birgunj"],
    sources: studioSources,
    disclaimer: guideDisclosure,
  },
  {
    ...newCityGuidePublication,
    title: "Wedding Photography in Nepalgunj: Heat, Privacy and Regional Travel",
    seoTitle: "Nepalgunj Wedding Photography Guide: Heat and Privacy",
    slug: "best-wedding-photographer-nepalgunj",
    href: "/blog/best-wedding-photographer-nepalgunj",
    category: "Photography",
    excerpt:
      "What Nepalgunj weddings demand of a photographer: extreme Terai heat, Hindu, Muslim and Tharu ceremonies, women-only events and travel across the region.",
    description:
      "Plan wedding photography in Nepalgunj: Terai heat, Hindu, Muslim and Tharu ceremonies, women-only events and pre-wedding trips to Bardiya and Surkhet.",
    image: image("photo-1510127034890-ba27508e9f1c"),
    imageAlt: "Compact camera resting beside printed photographs",
    readTime: "11 min read",
    author: "Nepali Directory Events Desk",
    keywords: [
      "how to choose a wedding photographer in Nepalgunj",
      "Nepalgunj wedding photography guide",
      "wedding photographer Nepalgunj",
      "wedding photographer Banke",
      "Nepalgunj wedding videography",
    ],
    tags: ["Photography", "Weddings", "Nepalgunj"],
    sections: [
      {
        heading: "The hub for weddings across Nepal's western Terai",
        paragraphs: [
          "Nepalgunj is the commercial centre for Banke and its neighbouring districts, and its studios regularly travel to weddings in Bardiya, Dang, Surkhet and beyond. The city's own weddings reflect a mixed population: hill and Madhesi Hindu families, a large Muslim community, Tharu families and Awadhi-speaking households, each with its own ceremonies and customs.",
          "Start by telling each studio exactly which tradition your wedding follows and where every event is. Ask for a full gallery from a wedding of the same tradition, and check how travel is priced if any event is outside the city.",
        ],
      },
      {
        heading: "Privacy and women-only events",
        paragraphs: [
          "In some families, including many Muslim and some conservative Hindu households, parts of the celebration are for women only, or relatives prefer that women be photographed by a woman. This is worth settling before you book rather than discovering on the day.",
          "Ask whether the studio can provide a female photographer or videographer for those segments, which events are to be photographed at all, and who in the family approves images before any are shared online. Put the sharing rules in the contract, including whether the studio may use your photos in its own marketing.",
        ],
      },
      {
        heading: "Heat is the main constraint",
        paragraphs: [
          "Nepalgunj is among the hottest places in Nepal, and from late spring until the monsoon breaks, midday heat makes outdoor coverage exhausting and the light harsh. The main wedding season is cooler, but even then winter mornings can bring thick fog across the western Terai.",
          "Keep outdoor portraits to late afternoon, plan water and shade for guests and crew between events, and check that the studio carries backup batteries and cards for long, hot days.",
        ],
      },
      {
        heading: "Pre-wedding options within reach",
        paragraphs: [
          "Around the city, couples use temple precincts such as Bageshwari, ponds and parks, and resort venues. For a wilder backdrop, the forests and rivers around Bardiya National Park are a longer drive west, and the hills of Surkhet lie to the north.",
          "Ask whether travel, entry charges and any permissions for protected areas are included, and confirm the current rules for photography in or near the national park with its managing authority before you go.",
        ],
      },
      cityListPointerSection(
        "nepalgunj",
        "Several also travel to Bardiya, Dang and Surkhet, which is worth asking about if your families are spread across the region.",
      ),
      recommendedStudioSection(
        `Its Butwal studio at ${studio.butwalStudio} is the nearer of its two bases, but Nepalgunj is still destination work: expect crew travel and accommodation to be quoted on top, and compare that total with the studios on our [Nepalgunj list](/blog/best-wedding-photographers-in-nepalgunj).`,
      ),
    ],
    faqs: [
      {
        question: "Can I request a female photographer in Nepalgunj?",
        answer:
          "Ask each studio directly. Some families want women photographed by a woman, or have women-only events, and a studio needs to know that when it plans the crew. Agree in writing which events are covered and who approves images before anything is shared online.",
      },
      {
        question: "How should we plan for heat at a Nepalgunj wedding?",
        answer:
          "Keep outdoor portraits to late afternoon, avoid midday sessions from late spring until the monsoon, and plan shade and water for guests and crew. In winter, allow for thick morning fog. Confirm the studio carries backup batteries and cards for long, hot days.",
      },
      ...universalFaqs,
    ],
    contextLinks: commonContextLinks,
    citySlugs: ["nepalgunj"],
    sources: studioSources,
    disclaimer: guideDisclosure,
  },
];
