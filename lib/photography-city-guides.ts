import type { BlogPost } from "./blog";
import {
  commonContextLinks,
  featuredDisclosure,
  featuredStudioSection,
  photoImage as image,
  photoPublication as publication,
  studio,
  studioSources,
  universalFaqs,
} from "./photography-partner";

/** City-specific photography guides. Each covers venue types, local ceremony traditions and
 * logistics particular to that place, so they stay substantively distinct from one another. */
export const photographyCityGuidePosts: BlogPost[] = [
  {
    ...publication,
    title: "Wedding Photography in Kathmandu: Venues, Traditions and Logistics",
    seoTitle: "Best Wedding Photographer in Kathmandu: Complete Guide",
    slug: "best-wedding-photographer-kathmandu",
    href: "/blog/best-wedding-photographer-kathmandu",
    category: "Photography",
    excerpt:
      "Booking wedding coverage in the Kathmandu Valley: heritage and hotel venues, Newar ceremony requirements, traffic and timing, and how to size a crew for a valley wedding.",
    description:
      "Book a wedding photographer in Kathmandu: heritage and banquet venue lighting, Newar and Hindu ceremony coverage, valley traffic timing and crew sizing advice.",
    image: image("photo-1600298881974-6be191ceeda1"),
    imageAlt: "Traditional wedding ceremony photographed in a heritage courtyard",
    readTime: "10 min read",
    author: "Nepali Directory Events Desk",
    keywords: [
      "best wedding photographer in Kathmandu",
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
      featuredStudioSection(
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
    contextLinks: commonContextLinks,
    citySlugs: ["kathmandu", "lalitpur", "bhaktapur"],
    sources: studioSources,
    disclaimer: featuredDisclosure,
  },
  {
    ...publication,
    title: "Wedding Photography in Pokhara: Lakeside and Mountain Coverage",
    seoTitle: "Best Wedding Photographer in Pokhara: Destination Guide",
    slug: "best-wedding-photographer-pokhara",
    href: "/blog/best-wedding-photographer-pokhara",
    category: "Photography",
    excerpt:
      "Pokhara as a wedding destination: lakeside and resort venues, mountain backdrops that depend on weather, and what to settle when your photographer travels to you.",
    description:
      "Plan wedding photography in Pokhara: lakeside and resort venues, Annapurna backdrop weather risk, destination logistics and travel terms for visiting studios.",
    image: image("photo-1583939411023-9c4b0b0b9e1e"),
    imageAlt: "Lakeside wedding setting with mountains in the background",
    readTime: "10 min read",
    author: "Nepali Directory Events Desk",
    keywords: [
      "best wedding photographer in Pokhara",
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
      featuredStudioSection(
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
    contextLinks: commonContextLinks,
    citySlugs: ["pokhara"],
    sources: studioSources,
    disclaimer: featuredDisclosure,
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
      featuredStudioSection(
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
    disclaimer: featuredDisclosure,
  },
  {
    ...publication,
    title: "Wedding Photography in Chitwan: Resorts, Tharu Traditions and Terai Light",
    seoTitle: "Best Wedding Photographer in Chitwan: Bharatpur and Sauraha",
    slug: "best-wedding-photographer-chitwan",
    href: "/blog/best-wedding-photographer-chitwan",
    category: "Photography",
    excerpt:
      "Wedding coverage across Chitwan and Bharatpur: jungle-resort venues, Tharu cultural traditions, Terai heat and light, and how to brief a photographer for both.",
    description:
      "Book wedding photography in Chitwan: Bharatpur banquet venues, Sauraha jungle resorts, Tharu wedding traditions, Terai heat and light, and crew planning advice.",
    image: image("photo-1522413452208-996ff3f3e740"),
    imageAlt: "Outdoor wedding setting surrounded by greenery",
    readTime: "9 min read",
    author: "Nepali Directory Events Desk",
    keywords: [
      "best wedding photographer in Chitwan",
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
      featuredStudioSection(
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
    citySlugs: ["chitwan"],
    sources: studioSources,
    disclaimer: featuredDisclosure,
  },
];
