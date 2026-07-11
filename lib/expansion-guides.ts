import type { BlogPost } from "./blog";

const image = (id: string, width = "1200", height = "675") =>
  `https://images.unsplash.com/${id}?w=${width}&h=${height}&fit=crop&auto=format`;

export const expansionGuidePosts: BlogPost[] = [
  {
    title: "Pokhara Restaurants: A Practical Lakeside Dining Guide",
    seoTitle: "Pokhara Restaurants in Lakeside: Dining and Booking Guide",
    slug: "pokhara-restaurants-lakeside-guide",
    href: "/blog/pokhara-restaurants-lakeside-guide",
    category: "Restaurants",
    excerpt:
      "Choose a Lakeside restaurant by occasion, menu fit, access and current booking details instead of relying on one ranking.",
    description:
      "Compare Pokhara restaurants around Lakeside with practical checks for cuisine, dietary needs, group seating, lakefront access, reservations and recent information.",
    image: image("photo-1414235077428-338989a2e8c0"),
    imageAlt: "Restaurant table prepared for a meal near Pokhara Lakeside",
    date: "11 Jul 2026",
    publishedAt: "2026-07-11",
    modifiedAt: "2026-07-11",
    readTime: "5 min read",
    author: "Nepali Directory Food Desk",
    keywords: [
      "Pokhara restaurants",
      "Lakeside Pokhara restaurants",
      "where to eat in Pokhara",
      "Pokhara dining guide",
      "restaurants near Phewa Lake",
    ],
    tags: ["Pokhara", "Lakeside", "Restaurants", "Dining Guide"],
    sections: [
      {
        heading: "Start with the meal you actually need",
        paragraphs: [
          "A useful Pokhara restaurant search begins with the occasion, not a universal list of places. A quick breakfast before a day trip, a quiet family dinner, a group celebration and an unhurried evening near the lake require different opening hours, seating, noise levels and reservation arrangements. Write those needs down before comparing profiles.",
          "Add the non-negotiables: cuisine, approximate spending boundary, dietary requirements, preferred area, arrival time and whether anyone needs step-free access or nearby vehicle drop-off. This short brief helps you ask every restaurant the same questions. It also prevents an attractive photograph or an old review from becoming the only reason you choose.",
        ],
      },
      {
        heading: "Understand Lakeside location and access",
        paragraphs: [
          "“Lakeside” can still describe restaurants with very different walking routes, road access and distance from your hotel. Confirm the exact map pin and a recognizable landmark directly with the venue. If rain, luggage, children or limited mobility affect the visit, ask where a taxi can stop and whether the dining area involves stairs.",
          "A waterfront view and a convenient entrance are separate questions. Request a current description of the table area rather than assuming every seat has the same outlook. For a time-sensitive meal before transport or an activity, choose practical access and confirmed service timing over a scenic location that adds uncertainty to the journey.",
        ],
      },
      {
        heading: "Compare menus with enough context",
        paragraphs: [
          "Look for a recent menu or ask the restaurant to confirm whether the dishes you want are currently served. Online menus can remain visible after ingredients, portion formats or service periods change. Ask whether taxes or service charges are included in displayed figures and whether breakfast, lunch and dinner menus differ before setting expectations for the group.",
          "For vegetarian, vegan, allergy-related, halal or other dietary needs, describe the exact restriction rather than asking only whether options exist. Ask about ingredients, cooking surfaces and cross-contact where it matters. A restaurant’s reply can help you assess fit, but someone with a serious allergy should make their own risk decision and carry appropriate medical guidance.",
        ],
      },
      {
        heading: "Read recent reviews as evidence, not a verdict",
        paragraphs: [
          "Recent, specific reviews are more useful than a lifetime average. Search for repeated comments about the meal you plan to order, waiting time at a similar hour, cleanliness, staff communication and how reservations were handled. A single enthusiastic or angry account cannot show the normal experience, so look for a pattern across several detailed reports.",
          "Check the dates and compare customer photographs with official images. Renovation, management, staffing and menus can change, while old posts continue to rank. Treat unverified claims cautiously and contact the restaurant about anything essential. A directory profile is a starting point for comparison, not a guarantee that every detail remains current.",
        ],
      },
      {
        heading: "Book group meals without surprises",
        paragraphs: [
          "When booking for a group, provide the date, arrival window, number of adults and children, dietary needs and desired seating arrangement. Ask whether the table is held for a limited period, whether a deposit is required, what cancellation terms apply and how changes to the guest count are handled. Keep the confirmation in writing.",
          "If the evening depends on live music, outdoor seating, a particular view or a birthday arrangement, have the restaurant confirm that feature specifically. Also ask about cake, decoration and outside-food rules before bringing anything. A clear written summary protects both the guest and venue from assumptions that were never part of the reservation.",
        ],
      },
      {
        heading: "Use a final same-day confirmation",
        paragraphs: [
          "Before travelling across Pokhara, recheck current hours, your reservation name, map location and payment options. Seasonal schedules, private functions and local conditions can affect service. If your plans are tightly timed, ask how long the kitchen normally needs for the type of meal you intend to order without treating that estimate as a promise.",
          "Save one backup that meets the same food and access needs, especially during busy travel periods or poor weather. The strongest choice is not necessarily the restaurant with the loudest online reputation; it is the place that clearly confirms the details important to your party and makes its current terms easy to understand.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I reserve a Lakeside restaurant in advance?",
        answer:
          "Reserve when you need group seating, a particular table area, a time-sensitive meal or special dietary preparation. Confirm current deposit, cancellation and table-hold terms directly.",
      },
      {
        question:
          "How can I check whether a restaurant suits dietary restrictions?",
        answer:
          "Describe the exact ingredients and cross-contact concerns, ask the restaurant how the dish is prepared and make your own safety decision. A generic vegetarian or allergy-friendly label may not answer every requirement.",
      },
      {
        question: "What should I verify before leaving for the restaurant?",
        answer:
          "Reconfirm opening hours, map location, reservation details, access, menu availability and accepted payment methods. Use recent information because restaurant operations can change.",
      },
    ],
    contextLinks: [
      {
        href: "/city/pokhara",
        label: "Explore the Pokhara business directory",
      },
      {
        href: "/compare-business/restaurants",
        label: "Compare restaurant options",
      },
      {
        href: "/blog/pokhara-travel-guide",
        label: "Plan a wider Pokhara visit",
      },
    ],
    citySlugs: ["pokhara"],
    categorySlugs: ["restaurants"],
    sources: [
      {
        label: "Nepal Tourism Board: Pokhara",
        url: "https://ntb.gov.np/en/pokhara",
      },
    ],
    disclaimer:
      "Restaurant menus, hours, access, prices and booking terms can change. Confirm essential details directly with the restaurant before visiting or paying.",
  },
  {
    title: "Pokhara Hotels: A Lakeside Booking Guide",
    seoTitle: "Pokhara Hotels in Lakeside: Room and Booking Guide",
    slug: "pokhara-hotels-lakeside-booking-guide",
    href: "/blog/pokhara-hotels-lakeside-booking-guide",
    category: "Hotels",
    excerpt:
      "Compare Lakeside hotel rooms, location, access and reservation terms with a checklist built around your actual stay.",
    description:
      "Choose a Pokhara Lakeside hotel by checking the exact location, room details, noise, transport, accessibility, cancellation rules and written booking confirmation.",
    image: image("photo-1566073771259-6a8506099945"),
    imageAlt: "Comfortable hotel room prepared for guests in Pokhara",
    date: "11 Jul 2026",
    publishedAt: "2026-07-11",
    modifiedAt: "2026-07-11",
    readTime: "5 min read",
    author: "Nepali Directory Travel Desk",
    keywords: [
      "Pokhara hotels",
      "Lakeside Pokhara hotels",
      "Pokhara hotel booking",
      "where to stay in Pokhara",
      "hotels near Phewa Lake",
    ],
    tags: ["Pokhara", "Lakeside", "Hotels", "Booking Guide"],
    sections: [
      {
        heading: "Choose the right base for your itinerary",
        paragraphs: [
          "Begin with what you will do each day. A stay focused on walking around Lakeside has different location priorities from an early departure, a family visit elsewhere in the city or a quiet work trip. Mark the places you must reach, likely travel times and whether you prefer immediate activity or a calmer side street.",
          "Do not use “near the lake” as the only location test. Ask for the exact map pin, walking route and nearest vehicle access point. A short map distance may involve an unlit lane, slope or steps. If accessibility matters, request a description of the route from road to reception and from reception to the room.",
        ],
      },
      {
        heading: "Define the room before comparing rates",
        paragraphs: [
          "Room names are not standardized between hotels. Ask for the bed type and count, maximum occupancy confirmed by the property, bathroom arrangement, floor, lift availability, cooling or heating, backup power details and whether the shown photographs depict the bookable room category. Record the answer beside each option on your shortlist.",
          "If a balcony, view, workspace, quiet room or adjoining arrangement matters, request written confirmation rather than relying on a broad category label. “Subject to availability” is different from a guaranteed feature. Families should also confirm child bedding and any occupancy-related conditions before entering guest details or paying a deposit.",
        ],
      },
      {
        heading: "Calculate the complete stay terms",
        paragraphs: [
          "Compare the complete payable amount for the same dates, guests, room and meal plan. Check whether taxes, service charges, breakfast, extra bedding, airport or bus transfers and other requested services are included. A lower headline rate may represent a different cancellation rule or fewer inclusions, so it is not automatically the cheaper equivalent.",
          "Ask which currency and payment method the property will use, when each payment becomes due and whether any card or transfer charge applies. Keep a receipt for deposits. Never send money based only on a social message: verify the recipient and booking contact through a trusted property channel before making a non-reversible payment.",
        ],
      },
      {
        heading: "Check sleep, safety and practical comfort",
        paragraphs: [
          "Noise can vary by street, floor, event schedule and room orientation. If early sleep matters, ask whether the room faces a busy road, restaurant, music venue, reception or construction area. Recent guest comments can reveal patterns, but the hotel should confirm current conditions and cannot always guarantee sounds outside its control.",
          "Ask about reception coverage, room locks, luggage storage, emergency exits and how staff assist during a power or water interruption. These questions do not prove safety; they show whether the property communicates its procedures clearly. Travellers with health or mobility needs should explain the practical requirement and assess whether the answer is specific enough.",
        ],
      },
      {
        heading: "Read cancellation and change rules line by line",
        paragraphs: [
          "Record the last date and local time for a penalty-free cancellation, the amount retained after that point, no-show terms and whether date changes are allowed. Also check whether a booking platform’s rules differ from a direct reservation. Save the exact policy shown at payment because a general website page may be updated later.",
          "For flexible itineraries, compare the value of refundable terms with the saving offered by a restricted booking. Ask what happens if transport disruption delays arrival and how late check-in is handled, but do not assume an exception will be granted. Travel insurance, where suitable, is separate from a hotel’s cancellation policy.",
        ],
      },
      {
        heading: "Confirm the reservation before arrival",
        paragraphs: [
          "Your confirmation should show the property name and contact, guest name, dates, guest count, room category, bed arrangement, included meals or transport, total terms, amount paid and balance due. Ask the hotel to correct any mismatch. Save an offline copy along with the map pin and a phone number that works on arrival day.",
          "Reconfirm shortly before travel if you need late arrival, pickup, accessible access or another essential arrangement. Online rankings can help discover options, but they cannot replace a booking record. The most dependable selection is the property whose current room and terms match your trip and are documented before you set out.",
        ],
      },
    ],
    faqs: [
      {
        question:
          "Is every Lakeside hotel within easy walking distance of the water?",
        answer:
          "No single area label proves the route or access. Check the exact map pin, walking path, road access, slope and steps with the property, especially when luggage or mobility is a concern.",
      },
      {
        question: "What should a Pokhara hotel confirmation include?",
        answer:
          "It should identify the dates, guests, room and bed type, inclusions, complete payment terms, cancellation policy, amounts paid and any essential arrangement confirmed by the hotel.",
      },
      {
        question: "Should I choose the lowest displayed room rate?",
        answer:
          "Compare like for like first. The lowest figure may exclude taxes, breakfast, bedding or flexibility, or may apply to a different room and cancellation policy.",
      },
    ],
    contextLinks: [
      {
        href: "/city/pokhara",
        label: "Browse businesses and stays in Pokhara",
      },
      { href: "/compare-business/hotels", label: "Compare hotel options" },
      {
        href: "/blog/pokhara-travel-guide",
        label: "Read the Pokhara travel guide",
      },
    ],
    citySlugs: ["pokhara"],
    categorySlugs: ["hotels"],
    sources: [
      {
        label: "Nepal Tourism Board: Pokhara",
        url: "https://ntb.gov.np/en/pokhara",
      },
    ],
    disclaimer:
      "Hotel availability, room features, access, rates and booking policies change. Confirm the complete reservation directly with the property or booking service before payment and travel.",
  },
  {
    title: "Pokhara Travel Agencies and Trekking Desks: A Comparison Guide",
    seoTitle: "Pokhara Travel Agencies and Trekking Desks: Hiring Guide",
    slug: "pokhara-travel-agencies-trekking-desks-guide",
    href: "/blog/pokhara-travel-agencies-trekking-desks-guide",
    category: "Travel Guide",
    excerpt:
      "Compare Pokhara trip and trekking desks through itinerary detail, permits, staffing, safety plans and complete quote terms.",
    description:
      "Use a practical checklist to compare Pokhara travel agencies and trekking desks by trip scope, current permit guidance, guide arrangements, risk planning and written inclusions.",
    image: image("photo-1500530855697-b586d89ba3ee"),
    imageAlt: "Traveller reviewing a route map with a Pokhara trekking desk",
    date: "11 Jul 2026",
    publishedAt: "2026-07-11",
    modifiedAt: "2026-07-11",
    readTime: "5 min read",
    author: "Nepali Directory Travel Desk",
    keywords: [
      "Pokhara travel agencies",
      "Pokhara trekking agencies",
      "Lakeside trekking desk",
      "Nepal trek booking checklist",
      "compare Nepal tour agencies",
    ],
    tags: ["Pokhara", "Travel Agencies", "Trekking", "Safety Checklist"],
    sections: [
      {
        heading: "Turn your idea into one comparable trip brief",
        paragraphs: [
          "Give every agency the same starting information: route or destination, preferred dates, available days, group size, previous experience, health or mobility considerations, accommodation expectations and transport needs. Say which parts are flexible. Without a shared brief, two attractive quotes may cover substantially different trips and cannot be compared fairly.",
          "Ask the adviser to identify assumptions and explain which days, transfers, meals and activities are fixed. For a trek, request the daily start and end points, planned altitude progression, rest or acclimatization time and contingency space. An itinerary should be understandable before payment, not revealed one day at a time after departure.",
        ],
      },
      {
        heading: "Verify the business and the people assigned",
        paragraphs: [
          "Ask for the agency’s registered business name, physical contact details, relevant operating credentials and the name of the organization receiving payment. Independently check documents through the appropriate issuing authority when possible. A polished storefront, social account or recommendation does not by itself verify current authorization or who will deliver the trip.",
          "Clarify whether the person selling the trip is the operator or an intermediary. Ask who will guide, drive or coordinate your group, what role each person performs, which credentials apply to that role and when names will be confirmed. If a subcontractor is involved, request a clear explanation of responsibility and emergency contact lines.",
        ],
      },
      {
        heading: "Check permits against the current official rules",
        paragraphs: [
          "Permit requirements depend on the destination, route and current rules. Use the Nepal Tourism Board’s official trekking information as a starting point and ask the agency to state which permits it believes your itinerary requires, who obtains them, what documents you must supply and whether official charges are included in the quote.",
          "Do not treat an old blog, screenshot or previous traveller’s permit as current authority. Confirm close to departure, particularly if the itinerary changes. Keep copies of permits and receipts where issued. A responsible desk should be willing to distinguish an official requirement from an internal service charge and direct you to the relevant authority.",
        ],
      },
      {
        heading: "Ask for a route-specific safety and disruption plan",
        paragraphs: [
          "Generic claims that a trip is safe are not enough. Ask how the operator monitors weather and trail information, handles illness or injury, changes a route, contacts assistance and decides when to turn back. For altitude itineraries, discuss pacing, acclimatization and symptom response with qualified professionals rather than relying on sales language.",
          "Clarify communication equipment, emergency contacts, evacuation decision-making and who initially pays costs that may later be claimed from insurance. Read your own insurance wording for destination, altitude and activity exclusions. An agency can describe its procedures, but it cannot guarantee weather, health, access, rescue availability or an insurer’s decision.",
        ],
      },
      {
        heading: "Compare complete written quotes",
        paragraphs: [
          "Request an itemized quote showing accommodation standard, room basis, meals, transport type, staff, permits, equipment, entrance charges and taxes where applicable. It should also name exclusions such as personal equipment, tips, drinks, insurance, evacuation or costs created by itinerary changes. Compare every proposal against the same checklist rather than the bottom line alone.",
          "Review deposit timing, balance due date, cancellation bands, refund process, minimum group conditions and what happens when the operator or traveller changes the trip. Ask how unused services and disruption expenses are treated. Keep the agreed itinerary, terms, receipts and important messages together so that the arrangement is traceable.",
        ],
      },
      {
        heading: "Use an in-person briefing before departure",
        paragraphs: [
          "Meet or speak with the operating team before the start. Confirm names, current route conditions, pickup point, equipment responsibilities, permit documents, accommodation expectations and the emergency procedure. Use the briefing to resolve differences between the sales description and final plan. Do not leave a critical question for the trailhead or first overnight stop.",
          "Share the final itinerary and operator contacts with someone who is not travelling. Carry copies offline and leave room to follow qualified local advice when conditions change. A careful comparison cannot remove every travel risk, but it can reveal whether a Pokhara desk communicates clearly, documents its commitments and plans for foreseeable problems.",
        ],
      },
    ],
    faqs: [
      {
        question: "How do I compare two Pokhara trekking quotes?",
        answer:
          "Use the same itinerary brief and compare daily route, staff, accommodation, meals, transport, permits, equipment, taxes, exclusions, safety process and cancellation terms line by line.",
      },
      {
        question: "Can an agency confirm every current trekking permit?",
        answer:
          "Ask the agency for route-specific guidance, then verify against the relevant current official information. Requirements can change and may differ by area, nationality, route and activity.",
      },
      {
        question: "What should I receive before paying a deposit?",
        answer:
          "Obtain the operator’s identity and contact details, a written itinerary, itemized inclusions and exclusions, payment schedule, cancellation terms and an explanation of who will deliver the trip.",
      },
    ],
    contextLinks: [
      { href: "/city/pokhara", label: "Find travel services in Pokhara" },
      {
        href: "/compare-business/travel-agencies",
        label: "Compare travel agencies",
      },
      {
        href: "/blog/pokhara-travel-guide",
        label: "Plan your time in Pokhara",
      },
      {
        href: "/blog/annapurna-circuit-guide",
        label: "Review the Annapurna Circuit guide",
      },
    ],
    citySlugs: ["pokhara"],
    categorySlugs: ["travel-agencies"],
    sources: [
      {
        label: "Nepal Tourism Board: Pokhara",
        url: "https://ntb.gov.np/en/pokhara",
      },
      {
        label: "Nepal Tourism Board: trekking permits",
        url: "https://ntb.gov.np/en/plan-your-trip/before-you-come/trekking-permit",
      },
    ],
    disclaimer:
      "This is general trip-selection guidance, not a guarantee of safety or current permit advice. Confirm route rules with the relevant authorities and obtain qualified medical, insurance and safety guidance for your plans.",
  },
  {
    title: "Kathmandu Wedding Photographer Cost and Package Guide",
    seoTitle: "Kathmandu Wedding Photographer Cost and Package Guide",
    slug: "kathmandu-wedding-photographer-cost-packages",
    href: "/blog/kathmandu-wedding-photographer-cost-packages",
    category: "Weddings",
    excerpt:
      "Compare wedding photography quotes by coverage, team, deliverables, usage rights and the moments your Kathmandu event requires.",
    description:
      "Understand what shapes a Kathmandu wedding photography quote and compare packages using coverage hours, events, photographers, editing, albums, delivery and contract terms.",
    image: image("photo-1516035069371-29a1b244cc32"),
    imageAlt:
      "Wedding photographer preparing a professional camera in Kathmandu",
    date: "11 Jul 2026",
    publishedAt: "2026-07-11",
    modifiedAt: "2026-07-11",
    readTime: "5 min read",
    author: "Nepali Directory Events Desk",
    keywords: [
      "Kathmandu wedding photographer cost",
      "wedding photography packages Kathmandu",
      "Nepal wedding photographer quote",
      "wedding photo checklist",
      "compare wedding photographers Kathmandu",
    ],
    tags: [
      "Kathmandu",
      "Wedding Photography",
      "Wedding Planning",
      "Vendor Guide",
    ],
    sections: [
      {
        heading: "Build a coverage brief before asking for cost",
        paragraphs: [
          "A meaningful photography estimate starts with your schedule. List every event you want covered, its date, venue or neighborhood, expected start and finish, important rituals and any travel between locations. State whether preparations, portraits, guest arrivals, performances and the final departure matter. The same word “wedding” can describe very different assignments.",
          "Identify the moments that cannot be repeated and the people who must appear in planned portraits. Share cultural or family expectations that affect access and timing. A photographer can then propose realistic coverage instead of guessing. Keep the same brief for every candidate so that differences in quotes reflect real choices rather than missing information.",
        ],
      },
      {
        heading: "Judge portfolios for relevance and consistency",
        paragraphs: [
          "Ask to see complete galleries from events with lighting, venues and schedules similar to yours, not only a short selection of highlight images. Look at indoor ceremonies, group portraits, movement, low-light moments and transitions between events. A coherent full gallery shows how the team handles an entire day when conditions are less controlled.",
          "Discuss editing style with examples. Terms such as natural, cinematic or traditional can mean different things to different people. Ask how skin tones, mixed lighting and color are handled, and whether the final look will resemble the specific gallery you reviewed. Confirm that the work shown was created by the person or team proposed for your booking.",
        ],
      },
      {
        heading: "Compare package scope line by line",
        paragraphs: [
          "Record the number and role of photographers or videographers, coverage window, events included, travel, equipment, edited image delivery, video outputs, album specifications and any preview. Ask what triggers overtime and how it is authorized. Two packages with similar labels may differ substantially in staffing, finished products and the time spent after the event.",
          "Request the full payable terms, including taxes where applicable, travel or accommodation, albums, extra pages, storage media, expedited work and optional additions. Do not infer that raw files, drone work, same-day edits or social clips are included. Compare the written scope first; only then compare totals and decide which outputs are valuable to you.",
        ],
      },
      {
        heading: "Clarify delivery, backups and usage rights",
        paragraphs: [
          "The agreement should say what will be delivered, in which format and resolution, through what method and within what stated timeline. Ask how long the final gallery remains available and who is responsible for making personal backups after delivery. Understand whether revision rounds apply to albums or video and what counts as a revision.",
          "Ask who owns copyright and what personal printing, sharing and publication rights you receive. Decide whether the photographer may use identifiable images in a portfolio, advertisement or social post, and document any privacy restrictions. Also ask how files are backed up during and after production, while recognizing that no technical system can promise zero loss.",
        ],
      },
      {
        heading: "Plan Kathmandu logistics and venue rules",
        paragraphs: [
          "Traffic, parking, loading access and movement between venues can reduce usable coverage time. Put travel windows into the schedule and clarify whether the team travels independently or needs transport. Provide map pins and a venue contact. If photography has restricted areas, flash rules, permissions or time limits, confirm them with the venue before finalizing the shot plan.",
          "Ask the photographer what space and time are needed for portraits, equipment setup and meals during long coverage. Nominate one family coordinator who can gather people for group photographs and answer ritual questions. This reduces delays and lets the creative team focus on recording the event rather than searching for guests or negotiating access.",
        ],
      },
      {
        heading: "Put change and failure scenarios in the contract",
        paragraphs: [
          "A written agreement should identify the parties, dates, venues, team, scope, total terms, deposit and payment schedule, cancellation or postponement rules, overtime, delivery and usage rights. Ask what happens if the named photographer is unavailable, equipment fails, an event runs late or a venue changes. Read limitation and refund clauses before signing.",
          "Keep receipts, the final schedule and agreed changes with the contract. Shortly before the wedding, reconfirm contacts, arrival time, locations, family portrait list and restrictions. Cost is only one selection factor: the stronger fit is a photographer whose relevant work you trust and whose written process makes responsibilities, outputs and contingencies understandable.",
        ],
      },
    ],
    faqs: [
      {
        question: "What affects a wedding photographer quote in Kathmandu?",
        answer:
          "The quote can reflect event count, coverage time, team size, travel, photo and video scope, editing, albums, delivery timing and optional outputs. Compare an identical written brief.",
      },
      {
        question: "Should I ask for a complete wedding gallery?",
        answer:
          "Yes. A relevant full gallery helps you assess consistency through ceremonies, portraits, low light and ordinary transitions instead of judging only selected highlights.",
      },
      {
        question: "What must the photography contract clarify?",
        answer:
          "It should clarify team, events, coverage, deliverables, payment, overtime, cancellation or postponement, delivery, usage rights, privacy choices and the process if the named photographer becomes unavailable.",
      },
    ],
    contextLinks: [
      { href: "/city/kathmandu", label: "Browse Kathmandu wedding services" },
      {
        href: "/compare-business/photography",
        label: "Compare photography services",
      },
      {
        href: "/blog/nepal-wedding-planning-checklist",
        label: "Use the Nepal wedding planning checklist",
      },
    ],
    citySlugs: ["kathmandu"],
    categorySlugs: ["photography", "wedding-planners"],
    sources: [],
    disclaimer:
      "Packages, availability, deliverables and payment terms vary by photographer and event. Verify the complete scope, rights and contingency terms in a written agreement before paying.",
  },
  {
    title: "Kathmandu Wedding Venues: A Guest Count and Quote Guide",
    seoTitle: "Kathmandu Wedding Venues: Guest Count and Booking Guide",
    slug: "kathmandu-wedding-venues-guest-count-guide",
    href: "/blog/kathmandu-wedding-venues-guest-count-guide",
    category: "Weddings",
    excerpt:
      "Shortlist Kathmandu wedding venues by usable layout, guest flow, catering, access, contingencies and complete written terms.",
    description:
      "Compare Kathmandu wedding venues using a realistic guest count, event layout, access, catering rules, weather backup, inclusions and contract checklist.",
    image: image("photo-1519741497674-611481863552"),
    imageAlt:
      "Wedding venue arranged with tables and event lighting in Kathmandu",
    date: "11 Jul 2026",
    publishedAt: "2026-07-11",
    modifiedAt: "2026-07-11",
    readTime: "5 min read",
    author: "Nepali Directory Events Desk",
    keywords: [
      "Kathmandu wedding venues",
      "wedding venue guest count Kathmandu",
      "Kathmandu banquet booking",
      "wedding venue quote checklist",
      "Nepal wedding venue guide",
    ],
    tags: ["Kathmandu", "Wedding Venues", "Guest Planning", "Venue Guide"],
    sections: [
      {
        heading: "Use three guest numbers, not one guess",
        paragraphs: [
          "Create a minimum likely count, a working count and a maximum invitation scenario. Separate adults, children, vendors and other people who may need meals or seats, then ask how the venue treats each group. A broad invitation total is not the same as the final attendance figure used for setup, catering or billing.",
          "Ask the venue to confirm the safe, comfortable number for your exact layout and event activities. A standing reception, seated meal, stage, dance area, buffet and ceremonial setup use space differently. Never rely on an uncited capacity shown in a post or directory; obtain current written confirmation from the venue after it reviews your plan.",
        ],
      },
      {
        heading: "Test the layout with a real walkthrough",
        paragraphs: [
          "Visit at a comparable time of day and trace the guest journey from vehicle drop-off to entrance, welcome area, ceremony, dining, toilets and departure. Check queues, narrow points, stairs, lighting and how staff will direct people. Ask for a floor plan or marked layout that includes service areas rather than only guest tables.",
          "Bring the planner, caterer or decorator when possible so they can identify power, loading, storage and setup needs. Confirm what must remain clear for emergency movement. A room can appear spacious when empty yet feel constrained after staging, sound equipment, food service and photography positions are added. Base the decision on the configured event.",
        ],
      },
      {
        heading: "Separate the venue fee from the complete event cost",
        paragraphs: [
          "Ask for an itemized proposal covering space, furniture, linens, lighting, sound, power backup, cleaning, security, staffing, parking support and setup or teardown time where applicable. Mark every item as included, optional, externally supplied or prohibited. This prevents a simple rental figure from being compared with a more complete package as though they were equivalent.",
          "Clarify taxes, deposits, refundable security amounts, overtime, damage responsibility, outside-vendor fees and charges linked to guest-count changes. Ask when the final count becomes binding and how the invoice changes above or below it. Do not publish or depend on a generic “per guest” figure without the menu, service and inclusion details attached.",
        ],
      },
      {
        heading: "Confirm catering and vendor boundaries",
        paragraphs: [
          "Find out whether catering is in-house, selected from an approved list or open to an outside team. Request menu, tasting, dietary, food-safety, service, water, cake and leftover-food policies in writing. Ask how children, vendor meals and last-minute guests are counted. The responsible caterer should be identifiable in the agreement.",
          "Give each outside vendor the venue’s access and operating rules before paying deposits. Confirm loading windows, decoration attachments, flame or smoke restrictions, sound limits, electrical load, waste removal and the deadline for clearing materials. When venue and vendor responsibilities overlap, name one party for each task instead of assuming they will coordinate it later.",
        ],
      },
      {
        heading: "Plan access, weather and power contingencies",
        paragraphs: [
          "Check the route for guests arriving from different parts of Kathmandu Valley and ask about current parking, drop-off and traffic management arrangements. Assess step-free access, accessible toilets, seating for older guests and a quiet area if needed. Share clear map pins and entrance instructions because a venue name alone may not guide every driver correctly.",
          "For any outdoor element, document the trigger and timing for moving indoors, the alternative layout and who authorizes the change. Ask how rain, wind, heat, cold, poor air or a power interruption affects catering, sound and lighting. A backup space only works if it can hold the agreed configured event, not merely exist on site.",
        ],
      },
      {
        heading: "Review the booking contract before deposits",
        paragraphs: [
          "The contract should identify each space, date, access hours, event finish, guest-count process, inclusions, payments, cancellation or postponement rules, vendor conditions and responsibility for damage or cleanup. Attach the approved layout and proposal. If a promise matters—such as exclusive use or a backup room—make sure it appears in the signed record.",
          "Before the event, hold a final operational review with updated counts, contacts, floor plan, deliveries, ceremony timing, weather decision, payments and emergency roles. A venue should be selected for how well it supports your actual gathering. Attractive decor photographs cannot substitute for verified capacity, a workable guest flow and complete written terms.",
        ],
      },
    ],
    faqs: [
      {
        question:
          "How should I calculate guest count for a Kathmandu wedding venue?",
        answer:
          "Keep minimum, working and maximum scenarios; separate adults, children and vendors; then have the venue confirm your exact seated or standing layout and billing rules in writing.",
      },
      {
        question: "What should be included in a venue quote?",
        answer:
          "Request itemized space, furniture, service, power, sound, cleaning, security, parking, setup time, catering, taxes, deposits, overtime and outside-vendor charges as applicable.",
      },
      {
        question: "Is a venue's advertised capacity enough to make a decision?",
        answer:
          "No. Ask for current confirmation based on your layout, stage, dining, ceremony and movement needs, and ensure required safety and access routes remain clear.",
      },
    ],
    contextLinks: [
      { href: "/city/kathmandu", label: "Explore Kathmandu event services" },
      {
        href: "/compare-business/wedding-venues",
        label: "Compare wedding venues",
      },
      {
        href: "/compare-business/wedding-planners",
        label: "Compare wedding planners",
      },
      {
        href: "/blog/nepal-wedding-planning-checklist",
        label: "Follow the wedding planning checklist",
      },
    ],
    citySlugs: ["kathmandu"],
    categorySlugs: ["wedding-venues", "wedding-planners"],
    sources: [],
    disclaimer:
      "Venue capacity, layouts, services, access and commercial terms can change. Obtain venue-specific confirmation and a signed agreement for your event configuration before paying.",
  },
  {
    title: "Kathmandu Gym Membership Cost Guide",
    seoTitle: "Kathmandu Gym Membership Cost: Comparison Guide",
    slug: "kathmandu-gym-membership-cost-guide",
    href: "/blog/kathmandu-gym-membership-cost-guide",
    category: "Fitness",
    excerpt:
      "Compare Kathmandu gym memberships by full cost, equipment fit, coaching, trial terms, schedule and cancellation rules.",
    description:
      "Understand the components of Kathmandu gym membership cost and use a practical tour, trial, coaching, hygiene and contract checklist before joining.",
    image: image("photo-1534438327276-14e5300c3a48"),
    imageAlt: "Strength and cardio equipment inside a Kathmandu gym",
    date: "11 Jul 2026",
    publishedAt: "2026-07-11",
    modifiedAt: "2026-07-11",
    readTime: "5 min read",
    author: "Nepali Directory Health Desk",
    keywords: [
      "Kathmandu gym membership cost",
      "gym fees Kathmandu",
      "compare gyms Kathmandu",
      "Kathmandu fitness center membership",
      "gym joining checklist",
    ],
    tags: ["Kathmandu", "Gyms", "Membership", "Fitness Guide"],
    sections: [
      {
        heading: "Define what the membership must support",
        paragraphs: [
          "List the activities you will actually use: general strength training, cardio, group classes, coached sessions, mobility work or another program. Note your realistic visit days and times, commute boundary and any equipment or access requirement. Paying for a long feature list has little value when the gym does not fit your routine.",
          "If you are returning after inactivity, managing an injury, pregnant, older or living with a health condition, seek advice from an appropriately qualified health professional before starting or changing exercise. A directory or sales consultation cannot assess medical readiness. Tell staff about practical limitations only to the extent needed to discuss safe service fit.",
        ],
      },
      {
        heading: "Calculate the full cost over your intended period",
        paragraphs: [
          "Ask for a written schedule of joining, recurring, renewal, access-card, assessment, class, locker, towel, coaching and cancellation charges where applicable. Confirm taxes and payment processing treatment. Compare the complete amount for the period you are likely to attend rather than multiplying an advertised figure that may exclude required or optional items.",
          "Find out whether the offer renews automatically, whether a promotional rate changes later and what happens during a freeze. Ask which services are genuinely included and which require another booking. No single current fee is stated here because gyms can change packages and terms; obtain dated quotes from every shortlisted facility.",
        ],
      },
      {
        heading: "Tour and trial at the time you will attend",
        paragraphs: [
          "A quiet midday tour may not show the experience after work or early in the morning. Visit during your likely training window and observe queues for the equipment you need, available floor space, ventilation, changing areas, drinking water, storage and staff visibility. Ask whether a trial has restrictions or creates any payment commitment.",
          "Test commute time from home or work and the route after dark if relevant. Confirm current opening hours for weekdays, weekends and holidays, along with any separate class timetable. Consistency usually matters more than an impressive room you cannot reach conveniently, so treat travel and scheduling as part of membership value.",
        ],
      },
      {
        heading: "Evaluate coaching and exercise support",
        paragraphs: [
          "Ask who performs inductions and how trainers’ relevant education, certification and experience can be checked. Clarify whether floor guidance, program design and personal training are separate services. A confident sales explanation is not a substitute for role-appropriate competence, and a trainer should stay within their professional scope when discussing pain, injury or nutrition.",
          "During a trial, note whether staff explain equipment setup, emergency procedures and how to request help. Ask how programs are adapted and progress reviewed, especially for beginners. Avoid promises of guaranteed body changes or rapid medical outcomes. Exercise results differ, and any symptom or health concern belongs with a qualified healthcare professional.",
        ],
      },
      {
        heading: "Check hygiene, maintenance and incident response",
        paragraphs: [
          "Observe whether members can clean shared equipment, waste is managed and toilets and changing areas appear maintained at the visit time. Ask how damaged equipment is reported and kept out of use. One tour cannot prove everyday standards, but clear routines and visible staff make it easier to raise a concern before it becomes an injury risk.",
          "Locate exits and ask how staff respond to injury, fire, power interruption and other incidents. Confirm how belongings are secured and read the gym’s loss policy; a locker does not automatically transfer responsibility. Report frayed cables, unstable benches, wet floors or unusual equipment behavior instead of attempting to repair or continue using it.",
        ],
      },
      {
        heading: "Read membership exit and freeze terms",
        paragraphs: [
          "Before signing, check start and end dates, access limits, renewal, payment due dates, freeze eligibility, notice method, cancellation timing, refunds and transfer conditions. Ask what evidence is needed for a medical freeze and whether fees continue. Keep a copy of the version you accepted and a receipt for every payment.",
          "Do not let a same-day discount replace a considered decision. Compare the written total, trial experience, schedule, equipment and support against your original brief. A suitable Kathmandu gym is one you can attend consistently and use safely under terms you understand, not automatically the facility with the largest claimed discount or longest feature list.",
        ],
      },
    ],
    faqs: [
      {
        question: "How can I compare Kathmandu gym membership costs?",
        answer:
          "Request dated written quotes and compare the same period, access level, joining and renewal charges, classes, coaching, lockers, taxes, freezes, cancellation and automatic-renewal terms.",
      },
      {
        question: "Should I take a gym trial before joining?",
        answer:
          "Yes when available. Trial at your normal visit time, check the equipment and facilities you need, and confirm whether the trial has restrictions or starts any payment obligation.",
      },
      {
        question:
          "Can gym staff advise me about an injury or medical condition?",
        answer:
          "Ask an appropriately qualified healthcare professional about medical readiness, symptoms or injury. Gym staff can explain facility services and should work within their own verified professional scope.",
      },
    ],
    contextLinks: [
      { href: "/city/kathmandu", label: "Browse Kathmandu businesses" },
      {
        href: "/compare-business/gyms-fitness-centers",
        label: "Compare gyms and fitness centers",
      },
      { href: "/near-me", label: "Search for nearby services" },
    ],
    citySlugs: ["kathmandu"],
    categorySlugs: ["gyms-fitness-centers"],
    sources: [],
    disclaimer:
      "This guide provides general selection information, not exercise or medical advice. Verify membership terms with the gym and consult an appropriately qualified health professional about medical readiness or symptoms.",
  },
  {
    title: "Kathmandu and Lalitpur Gyms: A Beginner's Guide",
    seoTitle: "Kathmandu and Lalitpur Gyms for Beginners: Guide",
    slug: "kathmandu-lalitpur-gyms-beginners-guide",
    href: "/blog/kathmandu-lalitpur-gyms-beginners-guide",
    category: "Fitness",
    excerpt:
      "Find a beginner-friendly gym across Kathmandu and Lalitpur by testing commute, orientation, coaching, equipment and culture.",
    description:
      "A practical first-gym checklist for Kathmandu and Lalitpur covering goals, location, induction, trainer scope, equipment, class fit, safety and first-month habits.",
    image: image("photo-1571019613454-1cb2f99b2d8b"),
    imageAlt: "Beginner receiving an equipment orientation at a Valley gym",
    date: "11 Jul 2026",
    publishedAt: "2026-07-11",
    modifiedAt: "2026-07-11",
    readTime: "5 min read",
    author: "Nepali Directory Health Desk",
    keywords: [
      "beginner gyms Kathmandu",
      "gyms in Lalitpur for beginners",
      "first gym checklist Nepal",
      "Kathmandu Lalitpur fitness centers",
      "how to choose a gym Kathmandu Valley",
    ],
    tags: ["Kathmandu", "Lalitpur", "Beginner Fitness", "Gyms"],
    sections: [
      {
        heading: "Set a beginner goal that helps you choose",
        paragraphs: [
          "Start with a simple outcome you can control, such as attending regularly, learning basic movement patterns or building confidence with a small set of equipment. Avoid choosing a gym around a promised body transformation. Your shortlist should support a sustainable routine, while results depend on many personal factors that no facility can guarantee.",
          "Write down preferred training days, available time, whether you want classes or individual exercise and how much instruction you expect. Include privacy, language, gender-specific spaces, changing facilities or step-free access if important. A clear personal brief makes it easier to ask useful questions and ignore features that do not serve you.",
        ],
      },
      {
        heading: "Treat the commute as part of the program",
        paragraphs: [
          "Kathmandu Valley travel varies by route and time, so test the journey when you would normally train. Compare a gym near home, work or a regular transport connection rather than choosing by city label alone. Record door-to-door time, parking or public-transport access, the walking route and how convenient it feels after dark.",
          "Confirm current opening hours and class schedules directly. If you cross between Kathmandu and Lalitpur, consider how a delayed journey would affect a short workout. A modest facility you can reach consistently may fit better than a more elaborate option that turns each visit into a difficult trip. Convenience is an adherence feature, not an afterthought.",
        ],
      },
      {
        heading: "Ask for a real induction, not only a tour",
        paragraphs: [
          "A sales tour shows rooms; an induction should explain check-in, equipment adjustment, shared-space etiquette, cleaning, storage, exits and how to get help. Ask whether induction is included, who leads it and whether you can repeat an explanation. Beginners should not be expected to copy another member’s setup or guess how a machine works.",
          "Bring a short list of equipment and movements you want to learn. Notice whether the instructor asks about experience, explains limits and checks understanding without pressure. For pain, illness, pregnancy, injury or medical concerns, consult an appropriately qualified health professional. A gym induction does not diagnose conditions or establish that exercise is medically suitable.",
        ],
      },
      {
        heading: "Evaluate coaching without relying on charisma",
        paragraphs: [
          "Ask the gym how you can verify a trainer’s relevant education, certification and experience, and who supervises the floor when that trainer is absent. Clarify the difference between general assistance, a written program and paid personal training. Find out how technique is taught, progress is reviewed and an exercise is modified when it is unsuitable.",
          "Be cautious of guaranteed weight, muscle, posture, pain or health outcomes, and of advice that goes beyond the trainer’s verified scope. A useful coach explains the reason for a task, invites questions and adjusts complexity gradually. During a trial, observe how staff speak to new members as well as how they work with experienced clients.",
        ],
      },
      {
        heading: "Check whether the environment supports learning",
        paragraphs: [
          "Visit at your intended hour and see whether the beginner equipment is available without long waits. Look for adequate space between activities, clear walkways, maintained surfaces and a way to report a problem. Ask how busy periods are managed. One visit is a sample, so combine direct observation with recent, specific member feedback.",
          "Culture matters. Notice whether instructions and rules are clear, photography or filming is controlled, personal boundaries are respected and beginners can ask for help without embarrassment. Confirm arrangements for changing, valuables, water and hygiene. If you need a women-only time or another specific setup, verify its schedule and conditions rather than assuming a label covers it.",
        ],
      },
      {
        heading: "Make the first month deliberately small",
        paragraphs: [
          "Choose an initial schedule you can repeat and learn a manageable number of movements with appropriate guidance. Record attendance and how the routine feels rather than comparing yourself with other members. Stop and seek appropriate help for concerning symptoms. More sessions or heavier equipment are not automatically better, especially while you are learning technique and recovery needs.",
          "Review the fit after several real visits: commute, crowding, support, cleanliness, class level and whether the written membership terms still suit you. Ask questions early rather than silently avoiding an unfamiliar area. The best beginner gym is the one that enables consistent, understandable and appropriately supported participation—not the one with the most intimidating equipment.",
        ],
      },
    ],
    faqs: [
      {
        question:
          "How should a beginner choose between gyms in Kathmandu and Lalitpur?",
        answer:
          "Test the real commute and training-hour crowding, then compare induction, coaching scope, beginner equipment, culture, access and written membership terms against your own routine.",
      },
      {
        question: "Do I need personal training when I first join a gym?",
        answer:
          "Not every beginner needs the same service. Ask what induction and floor support include, then decide whether paid coaching would provide the instruction, adaptation and accountability you need.",
      },
      {
        question: "What if I have an injury or health condition?",
        answer:
          "Consult an appropriately qualified healthcare professional about symptoms and medical readiness before starting or changing exercise. Verify that gym staff stay within their own role and competence.",
      },
    ],
    contextLinks: [
      { href: "/city/kathmandu", label: "Explore Kathmandu services" },
      { href: "/city/lalitpur", label: "Explore Lalitpur services" },
      {
        href: "/compare-business/gyms-fitness-centers",
        label: "Compare gyms and fitness centers",
      },
      {
        href: "/blog/kathmandu-gym-membership-cost-guide",
        label: "Compare gym membership costs and terms",
      },
    ],
    citySlugs: ["kathmandu", "lalitpur"],
    categorySlugs: ["gyms-fitness-centers"],
    sources: [],
    disclaimer:
      "This beginner guide is general selection information, not exercise or medical advice. Seek appropriately qualified healthcare guidance for symptoms, injury, pregnancy, illness or medical readiness.",
  },
  {
    title: "Kathmandu Plumber Callout Cost Guide",
    seoTitle: "Kathmandu Plumber Callout Cost: Hiring Guide",
    slug: "kathmandu-plumber-callout-cost-guide",
    href: "/blog/kathmandu-plumber-callout-cost-guide",
    category: "Home Services",
    excerpt:
      "Understand a Kathmandu plumbing callout quote by separating the visit, diagnosis, labor, parts, access and follow-up terms.",
    description:
      "Compare Kathmandu plumber callout costs without relying on an unsupported average, using a checklist for diagnosis, labor, parts, urgent visits, access and written warranty.",
    image: image("photo-1607472586893-edb57bdc0e39"),
    imageAlt:
      "Plumber inspecting pipework beneath a household sink in Kathmandu",
    date: "11 Jul 2026",
    publishedAt: "2026-07-11",
    modifiedAt: "2026-07-11",
    readTime: "5 min read",
    author: "Nepali Directory Services Desk",
    keywords: [
      "Kathmandu plumber cost",
      "plumber callout fee Kathmandu",
      "emergency plumber Kathmandu",
      "plumbing repair quote Nepal",
      "compare plumbers Kathmandu",
    ],
    tags: ["Kathmandu", "Plumbers", "Home Repair", "Callout Guide"],
    sections: [
      {
        heading: "Describe the fault before requesting a visit",
        paragraphs: [
          "Tell the plumber what you can observe without dismantling anything: where water appears, when it started, whether flow or drainage changed, which fixtures are affected and any sound or smell. Share clear photographs or a short video if safe. An accurate description helps the provider assess urgency, tools and likely skill fit.",
          "Do not attempt a repair involving unsafe access, contaminated water, concealed services or unfamiliar shutoffs. If water is causing damage, use only a known safe isolation step and protect people from the area while arranging qualified help. For gas, electrical or structural concerns, contact the appropriate specialist or emergency authority rather than treating it as ordinary plumbing.",
        ],
      },
      {
        heading: "Separate callout, diagnosis and repair",
        paragraphs: [
          "Ask whether the quoted callout covers travel only, a defined inspection period, diagnosis, or some labor. Confirm service area, arrival window, after-hours treatment and what becomes payable if you decline the repair. A phone estimate based on symptoms is not necessarily the final price once the fault and access conditions are visible.",
          "Request a written approval point before labor beyond the initial visit begins. The plumber should explain the observed cause, proposed remedy, alternatives and any uncertainty. Without that pause, a small callout can become an open-ended job. No citywide average is stated here because scope, timing, access and provider terms vary.",
        ],
      },
      {
        heading: "Make parts and labor traceable",
        paragraphs: [
          "A useful estimate separates labor from replacement parts and identifies the item by type or specification where practical. Ask whether transport or sourcing time is charged, who keeps removed components and what happens if the selected part is unavailable. Do not accept a higher-cost substitution without understanding why it is compatible and necessary.",
          "Clarify whether the plumber supplies parts, whether you may purchase an agreed item and who is responsible if a customer-supplied component fails or does not fit. Keep packaging, receipts and model details for important fixtures. A low initial total can be misleading when it excludes the parts or restoration needed to finish the repair.",
        ],
      },
      {
        heading: "Confirm access and property responsibility",
        paragraphs: [
          "Share the ward, map pin, landmark, floor, parking or loading limits and whether roof, ceiling, wall, shaft or underground access may be involved. State who can authorize entry and work. In an apartment or rented property, contact the owner, manager or association where required before a repair affects shared systems or building finishes.",
          "Ask who will open and restore surfaces if the pipework is concealed, and whether cleanup and waste removal are included. A plumber may repair the service but not plaster, tiles, cabinetry or paint. Photograph the work area before access begins and put responsibilities for protection and restoration in the written scope.",
        ],
      },
      {
        heading: "Compare evidence and workmanship terms",
        paragraphs: [
          "Check the provider’s identity, business contact, experience with the specific fault and recent references for comparable work where the job is substantial. Do not rely on a directory badge, review score or social profile as a complete verification. Ask direct questions and keep the name of the person who attends your property.",
          "Request the workmanship warranty, any manufacturer warranty and the procedure for reporting a repeat leak or failure. Ask what is excluded, whether another party’s alteration voids coverage and whether follow-up travel is charged. A verbal promise is difficult to apply later, so include the term on the estimate, invoice or service record.",
        ],
      },
      {
        heading: "Close the job with tests and records",
        paragraphs: [
          "Before sign-off, ask the plumber to demonstrate the repaired fixture or system under appropriate operating conditions and explain what was changed. Check the visible work area for leakage without touching unsafe components. Record any monitoring instruction, drying time or restriction, and ask which symptom should trigger an immediate return call.",
          "The final invoice should identify the visit, labor, parts, additional approved work, payments and warranty contact. Save before-and-after photographs and relevant product details. A dependable choice is not necessarily the fastest caller; it is the provider who defines the visit, obtains approval for changes and leaves a repair record you can understand.",
        ],
      },
    ],
    faqs: [
      {
        question: "What does a Kathmandu plumber callout cost usually include?",
        answer:
          "There is no universal inclusion. Ask whether it covers travel, an inspection period, diagnosis or labor, and what is due if you do not authorize the repair.",
      },
      {
        question: "Can a plumber give a final price by phone?",
        answer:
          "A provider may give an initial estimate from your description, but concealed faults and access can change scope. Require a written approval point after diagnosis and before extra work.",
      },
      {
        question: "What should I keep after a plumbing repair?",
        answer:
          "Keep the diagnosis, itemized invoice, parts details, payment receipt, photographs, operating or monitoring instructions and written workmanship and manufacturer warranty terms.",
      },
    ],
    contextLinks: [
      { href: "/city/kathmandu", label: "Find services across Kathmandu" },
      {
        href: "/compare-business/plumbers",
        label: "Compare plumbers in Kathmandu",
      },
      {
        href: "/blog/home-services-kathmandu-costs-booking-safety",
        label: "Read the Kathmandu home-services guide",
      },
    ],
    citySlugs: ["kathmandu"],
    categorySlugs: ["plumbers", "home-services"],
    sources: [],
    disclaimer:
      "This is general hiring and cost-comparison information, not technical repair advice. Charges and scope vary; obtain a written diagnosis and authorization terms from a suitably qualified provider.",
  },
  {
    title: "Nepal Electrician Hiring and Safety Checklist",
    seoTitle: "Hire an Electrician in Nepal: Safety Checklist",
    slug: "nepal-electrician-hiring-safety-checklist",
    href: "/blog/nepal-electrician-hiring-safety-checklist",
    category: "Home Services",
    excerpt:
      "Hire electrical help using a scope, qualification, isolation, quote, testing and handover checklist built around safety.",
    description:
      "Use this Nepal electrician hiring checklist to define the fault, verify role-appropriate competence, compare written estimates, require safe work and collect testing records.",
    image: image("photo-1621905251189-08b45d6a269e"),
    imageAlt:
      "Electrical professional checking wiring with insulated tools in Nepal",
    date: "11 Jul 2026",
    publishedAt: "2026-07-11",
    modifiedAt: "2026-07-11",
    readTime: "5 min read",
    author: "Nepali Directory Services Desk",
    keywords: [
      "hire electrician Nepal",
      "electrician safety checklist Nepal",
      "electrical repair quote Nepal",
      "verify electrical professional Nepal",
      "Nepal home wiring service",
    ],
    tags: ["Nepal", "Electricians", "Electrical Safety", "Hiring Checklist"],
    sections: [
      {
        heading: "Treat warning signs as a safety issue",
        paragraphs: [
          "Burning smells, heat, smoke, sparks, repeated protective-device operation, exposed conductors or contact with water require caution. Keep people away and contact an appropriate emergency service or qualified electrical professional. Do not remove a panel, touch damaged wiring or repeatedly restore power to “test” a dangerous symptom based on an online guide.",
          "Share only observations you can make safely: affected rooms or equipment, when the problem began, whether it follows rain or a particular load and any recent work. Photographs should be taken from a safe position without opening equipment. The electrician should decide the diagnostic steps after assessing the site and supply conditions.",
        ],
      },
      {
        heading: "Match competence and credentials to the scope",
        paragraphs: [
          "A small appliance connection, building rewire, distribution change, earthing assessment and engineered design do not carry the same responsibilities. Ask who will inspect, perform, supervise, test and—where required—design or sign off each part. Request role-relevant training, registration or authorization and independently verify documents with the appropriate issuing body.",
          "The Nepal Engineering Council register is relevant when the work requires a registered engineering professional; it is not a universal directory of every electrical technician. Ask the provider which legal or professional requirements apply to your exact project and verify that explanation. A generic “certified” label is incomplete without the credential name, issuer and current status.",
        ],
      },
      {
        heading: "Require a site-based scope and written estimate",
        paragraphs: [
          "For anything beyond a clearly defined minor task, request an inspection before accepting a final quote. The written scope should identify the fault or objective, circuits or areas involved, proposed work, components, labor, access, exclusions, testing, restoration and estimated schedule. Ask which assumptions could lead to a revised amount after work starts.",
          "Compare equivalent specifications and safety outcomes, not only totals. Have each candidate identify component brands or standards where relevant, warranty sources and responsibility for customer-supplied items. Do not accept unexplained substitutions. Changes discovered after isolation or opening should be documented and approved before the provider expands the job.",
        ],
      },
      {
        heading: "Agree how the site will be made safe",
        paragraphs: [
          "Ask the person in charge to explain how the supply will be identified, isolated, secured against unintended restoration and checked before work. You do not need to perform these steps yourself; the answer helps reveal whether there is a deliberate process. Confirm how occupants, children, workers and neighboring units will be kept away from the work area.",
          "For occupied homes or businesses, agree the outage window and what equipment must be shut down safely beforehand. Identify sensitive devices, essential services and any backup supply. Generators, inverters, solar equipment and batteries may create additional energy sources, so disclose them and require the provider to account for the complete system rather than assuming one switch removes every hazard.",
        ],
      },
      {
        heading: "Make testing and defects part of completion",
        paragraphs: [
          "The quote should state what inspection and testing will follow the work and what record you will receive. Ask how the professional confirms protective devices, earthing, connections and altered circuits are suitable for the agreed scope without requesting do-it-yourself technical instructions. A light turning on is not, by itself, a complete electrical handover.",
          "If testing identifies a serious pre-existing defect outside the scope, ask for it in writing with the recommended next action and any restriction on use. Do not pressure a worker to energize an installation they consider unsafe. For regulated design, inspection or certification, make sure the named responsible person has the role and registration required.",
        ],
      },
      {
        heading: "Keep a controlled handover record",
        paragraphs: [
          "Before final payment, collect the itemized invoice, description of changes, component details, test or inspection records provided, warranty terms and photographs or updated labels where applicable. Ask which areas were not inspected and what maintenance or future review is recommended. Store the record near other property documents for the next owner or electrician.",
          "Avoid cash-only arrangements with no traceable scope or receipt, pressure to bypass safety work, reused components without disclosure or requests that you conceal alterations. This checklist supports hiring decisions but cannot determine whether an installation complies or is safe. That judgment belongs to suitably qualified people who inspect the actual system under current requirements.",
        ],
      },
    ],
    faqs: [
      {
        question:
          "How do I verify an electrician or electrical professional in Nepal?",
        answer:
          "Ask what credential or authorization applies to the exact role, obtain the issuer and identifier, and verify it independently. For work requiring an engineer, use the Nepal Engineering Council register.",
      },
      {
        question: "What should an electrical estimate include?",
        answer:
          "It should define the areas and work, components, labor, access, exclusions, outage needs, testing, restoration, warranty, schedule and the approval process for discoveries or substitutions.",
      },
      {
        question: "Can I use this checklist to repair wiring myself?",
        answer:
          "No. It is selection guidance, not repair instruction. Keep away from electrical hazards and use appropriately qualified help for inspection, isolation, work and testing.",
      },
    ],
    contextLinks: [
      {
        href: "/compare-business/electricians",
        label: "Compare electrician services",
      },
      {
        href: "/blog/home-services-kathmandu-costs-booking-safety",
        label: "Review home-service booking and safety",
      },
      {
        href: "/blog/verified-contractor-nepal",
        label: "Use the verified contractor checklist",
      },
    ],
    citySlugs: [
      "kathmandu",
      "lalitpur",
      "bhaktapur",
      "pokhara",
      "chitwan",
      "biratnagar",
      "butwal",
      "dharan",
    ],
    categorySlugs: ["electricians", "home-services"],
    sources: [
      {
        label: "Nepal Engineering Council registration portal",
        url: "https://register.nec.gov.np/",
      },
    ],
    disclaimer:
      "This is general hiring and safety-selection information, not electrical, engineering or legal advice. Do not attempt hazardous work; have appropriately qualified professionals inspect, perform and test work under current requirements.",
  },
  {
    title: "Bhaktapur Newari Restaurant Booking Guide",
    seoTitle: "Bhaktapur Newari Restaurants: Booking Guide",
    slug: "bhaktapur-newari-restaurant-booking-guide",
    href: "/blog/bhaktapur-newari-restaurant-booking-guide",
    category: "Restaurants",
    excerpt:
      "Plan a Newari meal in Bhaktapur by checking location, current dishes, dietary fit, group service and reservation terms.",
    description:
      "Choose and book a Bhaktapur Newari restaurant using practical checks for heritage-area access, menu format, spice and dietary needs, group timing and written confirmation.",
    image: image("photo-1547592180-85f173990554"),
    imageAlt:
      "Traditional Newari dishes arranged for a shared meal in Bhaktapur",
    date: "11 Jul 2026",
    publishedAt: "2026-07-11",
    modifiedAt: "2026-07-11",
    readTime: "5 min read",
    author: "Nepali Directory Food Desk",
    keywords: [
      "Bhaktapur Newari restaurants",
      "Newari food Bhaktapur",
      "Bhaktapur restaurant booking",
      "where to eat in Bhaktapur",
      "Bhaktapur traditional dining guide",
    ],
    tags: ["Bhaktapur", "Newari Food", "Restaurants", "Booking Guide"],
    sections: [
      {
        heading: "Choose the kind of Newari meal you want",
        paragraphs: [
          "Decide whether you want a quick taste between sightseeing, a broad shared meal, a quieter family lunch or a planned group dinner. These visits differ in time, portion format, seating and advance preparation. Tell the restaurant the occasion and how adventurous the group is instead of asking only for its “best” dish.",
          "If you are unfamiliar with the cuisine, ask the staff to explain the components, order in which dishes arrive and realistic quantity for your party. Dish names and preparations can vary by kitchen and community tradition. Treat a guide as orientation, then let the restaurant describe what it currently cooks rather than expecting one fixed version everywhere.",
        ],
      },
      {
        heading: "Plan heritage-area access before reserving",
        paragraphs: [
          "Confirm the exact map pin, nearest landmark and route from your planned entrance to the Bhaktapur heritage area. A restaurant may be reached primarily on foot even when a map shows a nearby road. Ask where a vehicle can stop, how far guests walk and whether steps, narrow passages or upper-floor seating affect accessibility.",
          "Build enough time around sightseeing, ticketing, weather and group movement. If the meal must fit a guide or transport schedule, share a realistic arrival window and ask how late arrival is handled. Do not assume that all businesses using the same square or neighborhood name have the same entrance or vehicle access.",
        ],
      },
      {
        heading: "Confirm the current menu and dietary fit",
        paragraphs: [
          "Ask for a recent menu or a written outline of the proposed set, including meat and vegetarian components, spice level and items that require advance notice. Seasonal availability and kitchen decisions can change what is served. Confirm the complete payable terms and whether the meal is individual, shared, fixed or ordered dish by dish.",
          "For allergies, vegetarian or vegan requirements, alcohol avoidance or religious restrictions, name the exact concern. Ask about ingredients, stock, garnishes, cooking fat and cross-contact where relevant. A general label may not answer those questions. Anyone with a serious allergy should make a personal risk decision and follow their own medical guidance.",
        ],
      },
      {
        heading: "Book groups with a service plan",
        paragraphs: [
          "Give the date, arrival window, adult and child count, seating needs, dietary notes and the amount of time available. Ask whether the restaurant needs advance dish selection, a deposit or a minimum order, and how guest-count changes are treated. Keep the agreed menu, amount and cancellation conditions in the same written confirmation.",
          "For a celebration, ask before bringing cake, decorations, music or a photographer. Confirm whether the group has a private space or a section of the normal dining room, without assuming exclusivity. If speeches or a fixed departure matter, nominate one group contact who can coordinate timing with the restaurant during the meal.",
        ],
      },
      {
        heading: "Use reviews to answer specific questions",
        paragraphs: [
          "Look for recent accounts that describe dishes, waiting time, cleanliness, communication, group handling and access at a comparable visit time. Photographs can help explain portion format and seating, but user images may show old menus or private events. A high average alone cannot tell you whether the restaurant fits your dietary or timing needs.",
          "Read critical and positive reports with the same caution. One experience does not establish a pattern, and anonymous claims may be impossible to verify. When several recent guests raise the same practical issue, ask the restaurant about its current process. Use reviews to form questions, not to repeat accusations or guarantee an outcome.",
        ],
      },
      {
        heading: "Reconfirm and arrive as an informed guest",
        paragraphs: [
          "On the day, recheck hours, reservation name, map location, menu commitment and accepted payment method. Contact the venue if sightseeing or traffic changes your arrival. At the table, ask about unfamiliar ingredients before tasting and let staff know promptly if the order differs from the written arrangement rather than waiting until the meal is complete.",
          "A thoughtful choice balances food interest with current information, respectful communication and the group’s practical needs. No directory can identify one restaurant as right for every visitor. The useful outcome is a confirmed place that can explain its own menu, accommodate the agreed party and make the booking conditions clear before you arrive.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I need to book a Newari restaurant in Bhaktapur?",
        answer:
          "Book ahead for groups, fixed schedules, specific dishes, dietary preparation or celebration arrangements. Confirm the menu, deposit, cancellation and arrival terms directly.",
      },
      {
        question: "How should I ask about vegetarian or allergy needs?",
        answer:
          "State the exact restriction and ask about ingredients, stock, cooking fat, garnishes and cross-contact. Do not rely only on a broad dietary label.",
      },
      {
        question: "What access details should I check in old Bhaktapur?",
        answer:
          "Confirm the map pin, landmark, vehicle drop-off, walking distance, stairs, floor and toilet access for the specific restaurant and entrance route you plan to use.",
      },
    ],
    contextLinks: [
      { href: "/city/bhaktapur", label: "Browse the Bhaktapur directory" },
      {
        href: "/compare-business/restaurants",
        label: "Compare restaurant options",
      },
      {
        href: "/blog/kathmandu-newari-food",
        label: "Learn about Newari dishes and dining",
      },
    ],
    citySlugs: ["bhaktapur"],
    categorySlugs: ["restaurants"],
    sources: [],
    disclaimer:
      "Menus, ingredients, hours, access, prices and reservation terms can change. Confirm dietary and booking details directly; serious allergy decisions require personal medical guidance.",
  },
  {
    title: "Biratnagar Doctors and Clinics: Appointment Guide",
    seoTitle: "Biratnagar Doctors and Clinics: Appointment Guide",
    slug: "biratnagar-doctors-clinics-appointment-guide",
    href: "/blog/biratnagar-doctors-clinics-appointment-guide",
    category: "Healthcare",
    excerpt:
      "Find the appropriate Biratnagar care setting, verify practitioners and prepare questions, records, costs and follow-up before an appointment.",
    description:
      "Use non-diagnostic guidance to compare Biratnagar doctors and clinics by specialty, professional registration, appointment access, facilities, consent, costs and follow-up.",
    image: image("photo-1550831107-1553da8c8464"),
    imageAlt: "Healthcare professional reviewing appointment notes at a clinic",
    date: "11 Jul 2026",
    publishedAt: "2026-07-11",
    modifiedAt: "2026-07-11",
    readTime: "5 min read",
    author: "Nepali Directory Health Desk",
    keywords: [
      "Biratnagar doctors",
      "clinics in Biratnagar",
      "Biratnagar doctor appointment",
      "verify doctor Nepal",
      "Biratnagar healthcare directory",
    ],
    tags: ["Biratnagar", "Doctors", "Clinics", "Appointment Guide"],
    sections: [
      {
        heading: "Choose urgency and care setting first",
        paragraphs: [
          "A directory search is not emergency triage. For severe, rapidly worsening or potentially life-threatening symptoms, contact local emergency services or an appropriate emergency facility rather than waiting for an online booking. For non-emergency care, write a brief symptom or service description so clinic staff can advise which department or appointment type they offer.",
          "Ask whether the clinic handles the age group and concern, whether a referral or previous report is needed and what to do if symptoms worsen before the visit. Reception staff can explain logistics but should not be expected to diagnose. If you are unsure about urgency, seek guidance from an appropriately qualified healthcare professional.",
        ],
      },
      {
        heading: "Match and verify the professional",
        paragraphs: [
          "Request the clinician’s full name, professional category and relevant specialty before booking. Doctors can be checked through the Nepal Medical Council’s official registration resources. Other healthcare professions may fall under the Nepal Health Professional Council or another regulator. Use the authority appropriate to the person’s actual role instead of treating every clinical worker as a doctor.",
          "A registration match confirms an identity or status shown by the regulator; it does not guarantee treatment quality or fit. Check that the name and credential supplied by the clinic match the official record, and contact the council if the result is unclear. Do not rely on a cropped certificate image, title or directory badge alone.",
        ],
      },
      {
        heading: "Prepare a concise appointment record",
        paragraphs: [
          "Bring a timeline of the concern, current medicines and supplements, known allergies, relevant diagnoses, previous reports and questions. Use original or legible copies and keep your own record. Do not stop prescribed medicine or repeat a test solely because an article suggests it; discuss decisions with the clinician who can assess your circumstances.",
          "For a child, older adult or someone needing communication support, ask whether a companion may attend and what identification or consent information is required. Arrange interpretation if necessary. Share sensitive details through the clinic’s designated process, and avoid sending full medical records to an unverified social-media account or personal number.",
        ],
      },
      {
        heading: "Confirm appointment and facility logistics",
        paragraphs: [
          "Record the date, reporting time, clinician or department, exact branch, map pin and contact number. Ask about likely waiting, accessibility, parking or drop-off, and whether tests or procedures require preparation provided by the clinic. Follow only patient-specific instructions from an appropriate healthcare source, not generic preparation advice from a directory.",
          "Confirm whether the named professional is expected to attend and what happens if schedules change. If continuity matters, ask how repeat appointments are assigned. A clinic’s opening hours do not prove every service is available throughout that period, so verify the department, equipment or professional needed for your visit.",
        ],
      },
      {
        heading: "Ask for cost, consent and privacy clarity",
        paragraphs: [
          "Before non-emergency services, ask for the consultation charge and a written estimate for planned tests or procedures where possible, including which elements may change after clinical assessment. Confirm accepted payment and insurance documentation. Do not choose a medically inappropriate service simply because it has the lowest quoted figure; discuss options, benefits, risks and alternatives with the clinician.",
          "You should have an opportunity to understand a proposed examination, test or treatment and ask who will perform it. Ask how records and results are delivered and who can access them. Do not photograph other patients or publicize identifiable health information. Raise privacy concerns with the clinic before sharing documents you consider especially sensitive.",
        ],
      },
      {
        heading: "Leave with a follow-up plan you understand",
        paragraphs: [
          "Before leaving, confirm how and when results are reviewed, which clinician receives them, how to ask a question and what signs require urgent reassessment. Request prescriptions, reports, receipts and referral documents in a form you can keep. If instructions conflict or are unclear, ask the treating team to explain rather than interpreting them through a directory page.",
          "For another opinion, gather the clinical record and ask an appropriately qualified professional to reassess it. Online reviews can describe appointment logistics but cannot establish a correct diagnosis or treatment. Select care by relevant specialty, verifiable professional status, communication and practical access, then make medical decisions with the clinician who examines you.",
        ],
      },
    ],
    faqs: [
      {
        question: "How can I verify a doctor in Biratnagar?",
        answer:
          "Ask for the full name and registration details, then check the Nepal Medical Council's official resources. Use the relevant council for professionals who are not medical doctors.",
      },
      {
        question: "What should I bring to a clinic appointment?",
        answer:
          "Bring identification requested by the clinic, a symptom timeline, medicine and allergy list, relevant previous reports, referral documents and a short list of questions.",
      },
      {
        question: "Can this guide tell me which specialty or treatment I need?",
        answer:
          "No. It provides appointment-selection logistics, not diagnosis or treatment advice. Contact an appropriately qualified professional, and use emergency services for potentially urgent symptoms.",
      },
    ],
    contextLinks: [
      { href: "/city/biratnagar", label: "Browse the Biratnagar directory" },
      {
        href: "/compare-business/doctors",
        label: "Compare doctor directory options",
      },
      {
        href: "/compare-business/healthcare-clinics",
        label: "Compare healthcare clinics",
      },
      {
        href: "/blog/kathmandu-hospitals-clinics-checklist",
        label: "Use the clinic comparison checklist",
      },
    ],
    citySlugs: ["biratnagar"],
    categorySlugs: ["doctors", "healthcare-clinics"],
    sources: [
      { label: "Nepal Medical Council", url: "https://www.nmc.org.np/" },
      {
        label: "Nepal Health Professional Council",
        url: "https://nhpc.gov.np/",
      },
    ],
    disclaimer:
      "This is informational selection guidance, not diagnosis, medical advice or an endorsement. Verify professional registration and make care decisions with appropriately qualified clinicians; seek emergency help for urgent symptoms.",
  },
  {
    title: "Butwal Auto Repair Service Checklist",
    seoTitle: "Butwal Auto Repair: Service and Quote Checklist",
    slug: "butwal-auto-repair-service-checklist",
    href: "/blog/butwal-auto-repair-service-checklist",
    category: "Auto Services",
    excerpt:
      "Compare Butwal auto repair services using a symptom brief, diagnostic approval, itemized estimate, parts record and handover test.",
    description:
      "Use this Butwal auto repair checklist to choose the right workshop, control diagnostic and repair authorization, compare parts, document changes and inspect handover.",
    image: image("photo-1486006920555-c77dcf18193c"),
    imageAlt: "Mechanic inspecting a vehicle in an auto repair workshop",
    date: "11 Jul 2026",
    publishedAt: "2026-07-11",
    modifiedAt: "2026-07-11",
    readTime: "5 min read",
    author: "Nepali Directory Services Desk",
    keywords: [
      "Butwal auto repair",
      "car workshop Butwal",
      "vehicle repair checklist Nepal",
      "mechanic quote Butwal",
      "auto service Butwal",
    ],
    tags: ["Butwal", "Auto Repair", "Vehicle Service", "Repair Checklist"],
    sections: [
      {
        heading: "Record the symptom without guessing the repair",
        paragraphs: [
          "Write when the problem occurs, what you hear, see, smell or feel, which warning appears and what changed before it began. Note speed, temperature, road or weather conditions only when safely observed. A short video or dashboard photograph can help, but never use a phone while driving or enter an unsafe road position.",
          "Describe the symptom to each workshop without insisting on a diagnosis found online. The same observation can have several causes, and replacing the suggested part may waste money or leave a safety problem unresolved. If steering, braking, visibility, tires, overheating or another critical function seems unsafe, stop using the vehicle and arrange appropriate recovery.",
        ],
      },
      {
        heading: "Choose a workshop for the actual vehicle and job",
        paragraphs: [
          "Ask whether the workshop regularly handles your vehicle type, system and repair category, and whether it has the diagnostic tools and technical information needed. General maintenance, bodywork, electrical faults, transmissions, air conditioning and advanced electronic diagnosis may require different people or equipment. Confirm who is responsible if work is subcontracted elsewhere.",
          "Check the business identity, physical location, contact details and recent evidence of comparable work. A crowded yard or confident recommendation does not prove competence. For a major repair, request references or documented examples where appropriate, and write down the name of the service adviser and technician responsible for diagnosis and approval communication.",
        ],
      },
      {
        heading: "Authorize diagnosis separately from repair",
        paragraphs: [
          "Ask what the initial inspection or diagnostic charge covers, how long authorization lasts and whether any dismantling is included. Agree that the workshop will contact you with findings before fitting parts or expanding labor. Set a written amount above which no additional work may proceed without your approval, and name who is allowed to approve it.",
          "Request the evidence behind the diagnosis in understandable language: test result, measured condition, visible wear or fault code interpreted in context. A code alone may not identify a failed component. If the proposed repair is costly or the explanation remains uncertain, consider a second qualified opinion before authorizing irreversible work.",
        ],
      },
      {
        heading: "Compare itemized estimates and parts choices",
        paragraphs: [
          "The estimate should separate labor, parts, fluids, consumables, outsourced work, taxes where applicable and any transport or storage charge. Ask for the part specification, source and warranty, and whether it is new, remanufactured, used or another category. Do not accept an undisclosed substitution after approving a specific option.",
          "Clarify what happens if opening the assembly reveals additional damage, who keeps removed parts and whether customer-supplied parts change workmanship coverage. Ask for a revised estimate before continuing. Compare the same repair scope and parts level between workshops rather than treating two bottom-line totals as equivalent when one omits necessary finishing or testing.",
        ],
      },
      {
        heading: "Control custody, road tests and delays",
        paragraphs: [
          "Record vehicle identification, current distance reading, fuel level, visible condition, keys and items left inside at drop-off. Remove valuables. Ask where the vehicle is stored, who may drive it, why a road test is needed and whether the workshop’s arrangements cover that use. Keep a signed intake record and contact channel.",
          "Set an update point and ask the adviser to report delays, unavailable parts or scope changes before the expected completion time passes. Do not confuse a target date with a guarantee when diagnosis or sourcing is uncertain. If the vehicle must remain dismantled, clarify storage, reassembly and collection responsibility if you decline further repair.",
        ],
      },
      {
        heading: "Inspect the handover and save the repair history",
        paragraphs: [
          "Ask the workshop to explain what was found, what changed and how the repair was checked. Confirm warning indicators and the original symptom under safe conditions, ideally with the technician when a road test is appropriate. Inspect the visible vehicle condition before leaving and report any difference immediately on the handover record.",
          "Collect the itemized invoice, parts identifiers, diagnostic or alignment records provided, maintenance advice and separate parts and workmanship warranty terms. Ask what symptom should prompt a return and how a warranty concern is assessed. A well-documented repair becomes useful history for future diagnosis and is stronger evidence than a verbal assurance that everything is fixed.",
        ],
      },
    ],
    faqs: [
      {
        question: "What should a Butwal auto repair estimate include?",
        answer:
          "It should separate diagnosis, labor, parts and their condition, fluids, outsourced work, taxes, testing and other charges, with an approval process for additional findings.",
      },
      {
        question: "Should a workshop replace parts before calling me?",
        answer:
          "Only within the scope and authorization you gave. Agree in writing that new findings, substitutions or spending above your limit require approval before work continues.",
      },
      {
        question: "What records should I receive after vehicle repair?",
        answer:
          "Keep the intake record, approved estimates, itemized invoice, parts and diagnostic details, payment receipt, maintenance notes, and written parts and workmanship warranties.",
      },
    ],
    contextLinks: [
      { href: "/city/butwal", label: "Browse services in Butwal" },
      { href: "/categories", label: "Explore service categories" },
      { href: "/near-me", label: "Search for services near you" },
    ],
    citySlugs: ["butwal"],
    categorySlugs: ["auto-repair"],
    sources: [],
    disclaimer:
      "This is general service-selection guidance, not mechanical diagnosis or repair instruction. Stop driving an unsafe vehicle and use a suitably qualified repair or recovery provider.",
  },
  {
    title: "Dharan Beauty Salon Booking Guide",
    seoTitle: "Dharan Beauty Salons: Service and Booking Guide",
    slug: "dharan-beauty-salon-booking-guide",
    href: "/blog/dharan-beauty-salon-booking-guide",
    category: "Beauty and Wellness",
    excerpt:
      "Book a Dharan salon by matching the service, practitioner experience, hygiene, product questions, quote and timing to your needs.",
    description:
      "Compare Dharan beauty salons with a practical consultation and booking checklist for portfolios, hygiene, products, package scope, deposits, timing and aftercare.",
    image: image("photo-1560066984-138dadb4c035"),
    imageAlt: "Clean styling station prepared for a beauty salon appointment",
    date: "11 Jul 2026",
    publishedAt: "2026-07-11",
    modifiedAt: "2026-07-11",
    readTime: "5 min read",
    author: "Nepali Directory Health Desk",
    keywords: [
      "Dharan beauty salons",
      "salon booking Dharan",
      "hair salon Dharan",
      "beauty service checklist Nepal",
      "compare salons Dharan",
    ],
    tags: ["Dharan", "Beauty Salons", "Appointments", "Service Guide"],
    sections: [
      {
        heading: "Name the service and desired result clearly",
        paragraphs: [
          "Tell the salon exactly which service you want, your current hair, skin or nail condition as relevant, previous treatments and the result you have in mind. Bring reference photographs for direction, but ask whether they are realistic for your starting point. Different service names may cover different steps between salons.",
          "Mention timing constraints, modesty or privacy needs, accessibility and whether the appointment is linked to an event. If several people are booking, list each person’s service separately. This gives the salon enough information to estimate staffing and duration without assuming one package fits the whole group.",
        ],
      },
      {
        heading: "Use a consultation to test service fit",
        paragraphs: [
          "Ask who will perform the service and request recent portfolio examples created by that person for a similar request. Check consistency rather than one dramatic image. Photographs may be edited or show a different starting condition, so discuss the process, maintenance and limitations instead of asking for a guaranteed copy of someone else’s result.",
          "A useful consultation explains the planned steps, products, estimated appointment time, likely upkeep and alternatives. It should leave room for questions and refusal. For invasive, medical or condition-treating claims, seek an appropriately qualified healthcare professional; a salon consultation is not a diagnosis and a beauty provider should not promise to cure a health condition.",
        ],
      },
      {
        heading: "Ask product and sensitivity questions in advance",
        paragraphs: [
          "Tell the salon about known allergies, prior reactions, sensitivities and relevant products you already use. Ask for product names and ingredients where available, whether a manufacturer-directed sensitivity or strand test applies, and how much advance time it requires. Do not assume “natural,” “herbal” or another marketing term means reaction-free.",
          "A test cannot guarantee that no reaction will occur, and this guide cannot judge product safety for an individual. If you have an active skin problem, severe allergy history, infection concern or symptoms, seek qualified medical guidance before a cosmetic service. Do not proceed when the salon cannot explain the product or dismisses a known reaction.",
        ],
      },
      {
        heading: "Observe hygiene and tool handling",
        paragraphs: [
          "At consultation or arrival, observe whether the work area is cleaned, linens appear changed, single-use items are discarded and reusable tools are processed between clients. Ask how combs, brushes, metal tools, bowls and equipment are handled for the booked service. You do not need to accept vague reassurance when a direct process question is unanswered.",
          "Make sure the provider washes or sanitizes hands as appropriate and uses protective items required for the service. If a tool appears visibly soiled, a product is unlabelled or the skin is cut or burned, stop and raise the issue. For injury or concerning symptoms, obtain appropriate healthcare advice rather than relying on salon aftercare alone.",
        ],
      },
      {
        heading: "Compare the complete appointment quote",
        paragraphs: [
          "Ask what the displayed service or package includes: consultation, washing, preparation, product quantity, styling, extensions, removal, touch-up, taxes where applicable and any length- or complexity-related adjustment. Request an approval point before additions. A low starting figure is not comparable with a complete quote when essential steps remain unpriced.",
          "For event packages, list each service, person, location, start time, travel and trial appointment. Clarify deposits, balance date, cancellation, lateness, rescheduling and refund conditions. Keep the confirmation and receipts. Do not send a deposit to a changed account or personal contact without verifying the recipient through the salon’s established channel.",
        ],
      },
      {
        heading: "Confirm timing, aftercare and correction policy",
        paragraphs: [
          "Reconfirm the appointment, branch, practitioner, services and arrival instructions before travelling. Allow time for consultation and do not schedule an important event immediately after an unfamiliar service without considering your own risk tolerance. Ask what aftercare the product or service requires and receive instructions you can understand and retain.",
          "Before leaving, inspect the result in suitable light and raise a mismatch calmly. Ask in advance how the salon handles a service concern, what time limit applies and what is excluded. A directory ranking cannot guarantee an outcome. Choose the salon that communicates scope, hygiene, products and terms clearly and respects an informed decision to pause.",
        ],
      },
    ],
    faqs: [
      {
        question: "What should I ask before booking a beauty salon in Dharan?",
        answer:
          "Confirm the exact service, practitioner, product process, expected time, complete quote, deposit, cancellation, hygiene approach, aftercare and how concerns are handled.",
      },
      {
        question: "Does a product sensitivity test guarantee I will not react?",
        answer:
          "No. Ask whether manufacturer guidance calls for a test, disclose known reactions and seek qualified healthcare advice for allergy, skin-condition or symptom concerns.",
      },
      {
        question: "How can I compare salon portfolios?",
        answer:
          "Review several recent, relevant examples from the proposed practitioner, discuss your different starting point and ask what editing, maintenance or limitations affect the comparison.",
      },
    ],
    contextLinks: [
      { href: "/city/dharan", label: "Browse the Dharan directory" },
      {
        href: "/compare-business/beauty-salons",
        label: "Compare beauty salon options",
      },
      { href: "/near-me", label: "Find nearby services" },
    ],
    citySlugs: ["dharan"],
    categorySlugs: ["beauty-salons"],
    sources: [],
    disclaimer:
      "This is general salon-selection information, not medical or dermatological advice. Verify services and products directly and seek qualified healthcare guidance for reactions, symptoms or health conditions.",
  },
  {
    title: "Chitwan Restaurants: A Sauraha Dining Guide",
    seoTitle: "Chitwan Restaurants in Sauraha: Dining Guide",
    slug: "chitwan-restaurants-sauraha-dining-guide",
    href: "/blog/chitwan-restaurants-sauraha-dining-guide",
    category: "Restaurants",
    excerpt:
      "Fit a Sauraha meal around your Chitwan itinerary while checking current menus, dietary needs, access, group service and booking details.",
    description:
      "Compare restaurants in Sauraha, Chitwan by meal timing, exact location, current menu, dietary fit, family or group needs, reservations and recent information.",
    image: image("photo-1552566626-52f8b828add9"),
    imageAlt: "Open-air restaurant table prepared for guests in Sauraha",
    date: "11 Jul 2026",
    publishedAt: "2026-07-11",
    modifiedAt: "2026-07-11",
    readTime: "5 min read",
    author: "Nepali Directory Food Desk",
    keywords: [
      "Chitwan restaurants",
      "Sauraha restaurants",
      "where to eat in Sauraha",
      "Chitwan dining guide",
      "restaurants near Chitwan trip",
    ],
    tags: ["Chitwan", "Sauraha", "Restaurants", "Travel Dining"],
    sections: [
      {
        heading: "Build the meal around the day's itinerary",
        paragraphs: [
          "Start with the real arrival window, not an ideal clock time. Transport, guided activities and weather can shift a Chitwan day, while a kitchen may have defined meal periods. Ask your accommodation or activity contact when you are likely to be free, then confirm whether the restaurant can serve the type of meal you want.",
          "For an early start, ask about advance breakfast or takeaway arrangements without assuming every menu item travels safely. After a long activity, prioritize a confirmed table, hydration and food that suits your group over crossing the area for a social-media recommendation. Keep the restaurant informed if a booked arrival changes materially.",
        ],
      },
      {
        heading: "Verify the exact Sauraha location",
        paragraphs: [
          "Request a current map pin and nearby landmark, and compare the route from your hotel or drop-off point. The same Sauraha label can cover different walking and vehicle arrangements. Ask about road condition, lighting, stairs and the point where a taxi or other arranged transport can collect you after an evening meal.",
          "If the party includes children, older guests or someone with limited mobility, ask about entrance, seating and toilet access. Outdoor or riverside descriptions do not prove every table has the same position or surface. Have the restaurant confirm the specific area requested and whether weather may change the seating plan.",
        ],
      },
      {
        heading: "Check current menu, water and dietary details",
        paragraphs: [
          "Ask for a recent menu and verify that the dishes important to you are available during your visit period. Confirm portion format, spice level and complete payable terms, including taxes or service charges where applicable. For a tight itinerary, ask which choices fit the available time rather than ordering first and demanding an unrealistic finish.",
          "Describe vegetarian, vegan, allergy-related, halal or other restrictions precisely. Ask about ingredients, cooking fats, stocks, garnishes and cross-contact. Confirm what drinking water is served and how ice is handled if that affects your decision. Someone with serious allergies or medical dietary needs should follow personal professional guidance and assess risk independently.",
        ],
      },
      {
        heading: "Plan family and group service",
        paragraphs: [
          "Tell the restaurant the guest count, children’s seating needs, dietary notes, arrival range and whether separate or shared ordering is preferred. Ask if a group menu or advance selection is required, what is included and how additions are priced. Check deposit, cancellation and guest-count rules before one person pays on everyone’s behalf.",
          "If the visit includes a guide or driver, decide whether they join the meal and include that arrangement in the count. For music, a celebration or a quieter conversation, ask about the current atmosphere at your intended time. Do not infer a performance schedule, private room or view from old photographs; have the venue confirm it.",
        ],
      },
      {
        heading: "Read reviews for operational patterns",
        paragraphs: [
          "Give more weight to recent, specific accounts of the same meal period. Look for repeated observations about menu accuracy, waiting, food handling, cleanliness, group communication and payment. Traveller preferences differ, so separate a taste opinion from operational facts. Use photographs as dated evidence, not proof that an item or seating layout remains unchanged.",
          "Treat isolated accusations and perfect praise cautiously. Check whether the reviewer explains what was ordered, when they visited and how the restaurant responded. If several recent accounts identify the same concern, ask a direct current question. A directory should help form a shortlist; it should not convert unverified comments into a factual claim.",
        ],
      },
      {
        heading: "Make a same-day confirmation and backup",
        paragraphs: [
          "Reconfirm hours, kitchen service, reservation, map pin, access and payment shortly before the meal, especially when it follows an activity. Save the contact offline and tell someone in your group the meeting point. If poor weather or a schedule change affects travel, contact the restaurant rather than assuming the table will remain available indefinitely.",
          "Keep one nearby alternative that meets the same dietary and access needs. The practical choice is a restaurant that answers your current questions clearly and fits the day you are actually having. No guide can promise availability, food preference or service, but a documented plan reduces avoidable confusion around location, timing and group requirements.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I reserve a restaurant in Sauraha?",
        answer:
          "Reserve for groups, dietary preparation, a fixed itinerary, particular seating or a late arrival, and confirm deposit, cancellation and table-hold terms directly.",
      },
      {
        question: "How do I fit dinner around a Chitwan activity?",
        answer:
          "Ask the activity or accommodation contact for a realistic return window, then confirm kitchen hours and tell the restaurant if the schedule changes. Keep a nearby backup.",
      },
      {
        question: "What should I ask about dietary requirements?",
        answer:
          "Name the exact ingredients and cross-contact concerns, ask how the dish is prepared and make your own safety decision rather than relying on a broad dietary label.",
      },
    ],
    contextLinks: [
      { href: "/city/chitwan", label: "Browse the Chitwan directory" },
      {
        href: "/compare-business/restaurants",
        label: "Compare restaurant options",
      },
      {
        href: "/blog/chitwan-safari-local-travel-guide",
        label: "Plan a Chitwan and Sauraha visit",
      },
    ],
    citySlugs: ["chitwan"],
    categorySlugs: ["restaurants"],
    sources: [{ label: "Nepal Tourism Board", url: "https://ntb.gov.np/" }],
    disclaimer:
      "Restaurant hours, menus, ingredients, access, prices and booking terms change. Confirm all essential details directly, and follow qualified medical guidance for serious allergy or dietary risks.",
  },
  {
    title: "Bhaktapur Hotels: Heritage Area Booking Guide",
    seoTitle: "Bhaktapur Hotels Near the Heritage Area: Guide",
    slug: "bhaktapur-hotels-heritage-area-booking-guide",
    href: "/blog/bhaktapur-hotels-heritage-area-booking-guide",
    category: "Hotels",
    excerpt:
      "Choose a Bhaktapur hotel by checking the exact heritage-area route, room, stairs, noise, transport and complete reservation terms.",
    description:
      "Compare Bhaktapur heritage-area hotels using a checklist for map location, vehicle access, room details, accessibility, sound, breakfast, payment and cancellation.",
    image: image("photo-1561361513-2d000a50f0dc"),
    imageAlt: "Historic architecture viewed from accommodation in Bhaktapur",
    date: "11 Jul 2026",
    publishedAt: "2026-07-11",
    modifiedAt: "2026-07-11",
    readTime: "5 min read",
    author: "Nepali Directory Travel Desk",
    keywords: [
      "Bhaktapur hotels",
      "Bhaktapur heritage area hotels",
      "where to stay in Bhaktapur",
      "Bhaktapur hotel booking",
      "Bhaktapur accommodation guide",
    ],
    tags: ["Bhaktapur", "Hotels", "Heritage Area", "Booking Guide"],
    sections: [
      {
        heading: "Map the hotel against your arrival and visit",
        paragraphs: [
          "Ask for the precise map pin, entrance photograph or landmark and the route from your transport drop-off. “Near” a heritage square does not specify walking surface, steps, distance with luggage or vehicle restrictions. Tell the property how you will arrive and ask where staff can meet or assist if the door is difficult to locate.",
          "Plot the places you plan to visit, but also consider departure logistics. An atmospheric inner location may suit walking during the day while requiring more planning for an early vehicle. Choose knowingly: convenience means the route works for your luggage, party and schedule, not merely that the straight-line distance looks short on a map.",
        ],
      },
      {
        heading: "Verify the exact room and vertical access",
        paragraphs: [
          "Request the room category, floor, bed type and count, bathroom arrangement, window or ventilation, heating or cooling and whether a lift serves the room. Buildings and renovations vary, so never infer accessibility or amenities from the word “heritage.” Ask whether the photographs shown are of the category offered for your dates.",
          "If stairs, low thresholds, uneven surfaces, room size or bathroom access matter, describe the person’s practical needs and request current measurements or photographs where useful. “Ground floor” may still involve steps from the street. A property’s willingness to answer precisely is more useful than a generic accessible or family-friendly label.",
        ],
      },
      {
        heading: "Ask about sound, light and daily operations",
        paragraphs: [
          "Historic districts, courtyards, neighboring businesses, guests and local activity can create sound at different times. Ask whether the offered room faces the street, courtyard, reception, restaurant or another activity area. Recent reviews can reveal patterns, but only the property can explain the current room position and any known work during your stay.",
          "Confirm reception hours, late-entry arrangements, room key or access process, backup lighting and whom to contact overnight. If you need reliable internet or a work surface, ask about that room specifically and keep an alternative for essential calls. Broad property amenities may be available only in common areas or operate on a changing schedule.",
        ],
      },
      {
        heading: "Compare complete room and meal terms",
        paragraphs: [
          "For identical dates and guests, ask for the total payment terms with taxes or service charges, breakfast, extra bedding and requested transfers clearly marked. Check what breakfast includes, when it is served and whether an early arrangement is possible. A “room with breakfast” label does not answer timing, menu or dietary questions.",
          "Clarify currency, deposit method, payment recipient, balance timing and receipt. Verify account changes using a trusted property contact before transferring money. Do not treat a lower non-refundable rate as equivalent to a flexible booking. Attach the exact cancellation and change terms to each comparison so that the value of flexibility remains visible.",
        ],
      },
      {
        heading: "Check safety, belongings and transport support",
        paragraphs: [
          "Ask about room locks, luggage storage, emergency exits, evacuation assistance and how staff respond to a fire, power or water interruption. Locate the exit after arrival. These questions cannot prove that no incident will occur, but clear answers and visible procedures help you judge whether the property has considered ordinary guest needs.",
          "Confirm whether transport is operated by the hotel or arranged through another provider, what vehicle and pickup details will be sent and what the price includes. Keep valuables under your control and read storage or safe terms. A staff recommendation does not remove your responsibility to verify an outside transport arrangement and its payment conditions.",
        ],
      },
      {
        heading: "Create a complete pre-arrival confirmation",
        paragraphs: [
          "Save a document showing property contact, guest name, dates, guest count, room and bed, floor or access promise, meals, transport, total, amount paid, balance and cancellation terms. Include expected arrival and the meeting point. Ask the property to correct discrepancies before travel instead of relying on a later verbal explanation.",
          "Reconfirm essential access or late-arrival arrangements shortly before the stay and keep the map and phone number offline. The right Bhaktapur hotel is not automatically the closest pin to a landmark. It is the property whose actual route, room, comfort and written terms fit your trip without hiding important tradeoffs behind a broad heritage label.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can vehicles reach every Bhaktapur heritage-area hotel?",
        answer:
          "Do not assume so. Ask the property for the current vehicle drop-off, walking route, surface, stairs and luggage assistance based on how and when you will arrive.",
      },
      {
        question: "What room details should I verify in a heritage property?",
        answer:
          "Confirm the floor, route and stairs, lift, bed, bathroom, window, heating or cooling, noise position and whether photos show the exact offered category.",
      },
      {
        question: "What belongs in my hotel booking confirmation?",
        answer:
          "Include dates, guests, room and bed, essential access, meals, transport, complete payment, deposits, balance, cancellation rules, arrival time and property contact details.",
      },
    ],
    contextLinks: [
      { href: "/city/bhaktapur", label: "Browse the Bhaktapur directory" },
      { href: "/compare-business/hotels", label: "Compare hotel options" },
      {
        href: "/blog/bhaktapur-newari-restaurant-booking-guide",
        label: "Plan a Newari meal in Bhaktapur",
      },
    ],
    citySlugs: ["bhaktapur"],
    categorySlugs: ["hotels"],
    sources: [],
    disclaimer:
      "Hotel access, rooms, amenities, prices and policies can change. Confirm the exact route, room and complete booking terms with the property or booking service before paying.",
  },
  {
    title: "Biratnagar Schools: Admission Comparison Guide",
    seoTitle: "Biratnagar Schools: Admission Comparison Guide",
    slug: "biratnagar-schools-admission-comparison-guide",
    href: "/blog/biratnagar-schools-admission-comparison-guide",
    category: "Education",
    excerpt:
      "Compare Biratnagar schools through student fit, current curriculum information, complete fees, classroom support, commute and admission terms.",
    description:
      "A parent-focused Biratnagar school comparison guide covering curriculum verification, admission documents, fees, teaching support, safeguarding, transport and school visits.",
    image: image("photo-1580582932707-520aed937b7b"),
    imageAlt: "Students and families visiting a school campus for admission",
    date: "11 Jul 2026",
    publishedAt: "2026-07-11",
    modifiedAt: "2026-07-11",
    readTime: "5 min read",
    author: "Nepali Directory Education Desk",
    keywords: [
      "Biratnagar schools",
      "school admission Biratnagar",
      "compare schools Biratnagar",
      "Biratnagar school fees checklist",
      "parent school visit Nepal",
    ],
    tags: ["Biratnagar", "Schools", "Admissions", "Parent Guide"],
    sections: [
      {
        heading: "Start with the individual student's needs",
        paragraphs: [
          "Write a short profile covering the student’s age or level, learning strengths, support needs, preferred language environment, interests, commute limit and any accessibility requirement. Separate essentials from preferences. A school with a strong general reputation may still be a poor fit for one child’s daily learning, wellbeing or travel routine.",
          "Involve the student in age-appropriate questions about classroom atmosphere, activities and the journey. Avoid treating one exam result, advertisement or parent comment as a complete measure of quality. Your aim is to compare how each school’s current program and support process fit this learner, then verify important claims directly.",
        ],
      },
      {
        heading: "Verify curriculum and progression claims",
        paragraphs: [
          "Ask the school to name the curriculum, level structure, languages of instruction, assessment approach and authority or institution connected to any claimed recognition. Request current documentation and verify it through the relevant education body. Similar marketing terms can describe different programs, so record the formal answer rather than relying on a brochure headline.",
          "Ask how students progress between levels, which records transfer if a family moves and how changes to subjects or programs are communicated. Official education resources such as CEHRD’s learning platform can provide public learning context, but a link to a resource does not certify a particular school. Verify school-specific status through the appropriate authority.",
        ],
      },
      {
        heading: "Request the complete admission and fee schedule",
        paragraphs: [
          "Get a dated written list of application steps, age or prior-study criteria, documents, assessment or interview process, decision timing and enrollment deadline. Ask what happens to submitted documents and payments if a place is not offered. Do not assume that completing an application guarantees admission or that an informal message reserves a seat.",
          "Request all recurring and one-time charges that may apply: application, admission, tuition, deposit, books, uniform, meals, transport, activities, examinations, technology and late or withdrawal charges. Mark mandatory and optional items and ask when fees may change. No school-specific amount is reproduced here because current schedules must come from the school.",
        ],
      },
      {
        heading: "Examine teaching and student support",
        paragraphs: [
          "Ask about class organization, teacher responsibilities, feedback frequency, homework approach, language support and what happens when a student is ahead, struggling or absent. Request examples of how parents receive progress information. Staff ratios or qualifications should be supplied and explained by the school rather than inferred from an undated directory profile.",
          "If the learner needs disability, developmental, behavioral, counseling or health support, describe the functional need and ask who provides assistance, with what qualification, in which setting and at what additional cost. Do not treat broad “inclusive” language as an individualized plan. Qualified healthcare or specialist advice may also be needed outside the admission decision.",
        ],
      },
      {
        heading: "Visit for safety, culture and commute evidence",
        paragraphs: [
          "During a permitted visit, observe arrival and dismissal, classroom condition, toilets, drinking water, play or activity space, supervision and how staff speak with students. Ask about safeguarding, bullying reports, emergencies, illness, authorized pickup and parent complaints. A single tour is limited, but specific policies and calm explanations are stronger than staged facilities alone.",
          "Test the journey at school travel time. If using school transport, ask who operates it, route and stop details, supervision, communication during delay and responsibility when a child boards or leaves. Verify current arrangements and charges. A long or unreliable commute affects the whole school day and belongs in the comparison beside curriculum and fees.",
        ],
      },
      {
        heading: "Make a documented, child-centered decision",
        paragraphs: [
          "Use the same comparison sheet for curriculum, teaching, support, total fees, commute, facilities, policies and the student’s response. Revisit contradictions with the admissions office and request written clarification. Recent parent feedback can generate questions, but personal disputes, anonymous claims and isolated outcomes should not be repeated as verified facts.",
          "Before enrolling, keep the offer, fee schedule, refund and withdrawal rules, calendar, code of conduct, transport terms and promised accommodations. Education decisions deserve periodic review after attendance begins. This guide provides selection structure, not an official ranking, guarantee of admission or conclusion about any unnamed Biratnagar school.",
        ],
      },
    ],
    faqs: [
      {
        question: "What should parents compare between Biratnagar schools?",
        answer:
          "Compare verified curriculum, teaching support, complete fees, commute, safeguarding, facilities, parent communication, student needs and current admission and withdrawal terms.",
      },
      {
        question: "How can I check a school's curriculum claim?",
        answer:
          "Ask for the formal curriculum name and recognition details, then verify school-specific claims with the relevant education authority rather than relying on advertising language.",
      },
      {
        question: "Should the child visit before admission?",
        answer:
          "When the school permits it, a visit can help the family assess atmosphere, access, facilities, communication and commute, while asking questions that a brochure cannot answer.",
      },
    ],
    contextLinks: [
      { href: "/city/biratnagar", label: "Browse the Biratnagar directory" },
      {
        href: "/compare-business/schools",
        label: "Compare school directory options",
      },
      {
        href: "/blog/compare-schools-kathmandu-admissions",
        label: "Use the broader school admission checklist",
      },
    ],
    citySlugs: ["biratnagar"],
    categorySlugs: ["schools"],
    sources: [
      {
        label:
          "Center for Education and Human Resource Development learning portal",
        url: "https://learning.cehrd.gov.np/",
      },
    ],
    disclaimer:
      "This is informational school-selection guidance, not an official ranking, accreditation finding or guarantee of admission. Verify curriculum, recognition, fees, policies and support with the school and relevant authority.",
  },
  {
    title: "Butwal Contractor Renovation Quote Guide",
    seoTitle: "Butwal Contractors: Renovation Quote Guide",
    slug: "butwal-contractor-renovation-quote-guide",
    href: "/blog/butwal-contractor-renovation-quote-guide",
    category: "Contractors",
    excerpt:
      "Turn a Butwal renovation idea into a comparable scope, itemized quote, milestone plan, change process and documented handover.",
    description:
      "Compare Butwal renovation contractors using a site brief, relevant work evidence, itemized labor and material quotes, payment milestones, change orders and defect handover.",
    image: image("photo-1503387762-592deb58ef4e"),
    imageAlt: "Contractor reviewing renovation drawings and site measurements",
    date: "11 Jul 2026",
    publishedAt: "2026-07-11",
    modifiedAt: "2026-07-11",
    readTime: "5 min read",
    author: "Nepali Directory Services Desk",
    keywords: [
      "Butwal contractors",
      "renovation quote Butwal",
      "home renovation checklist Nepal",
      "compare contractors Butwal",
      "contractor estimate checklist",
    ],
    tags: ["Butwal", "Contractors", "Renovation", "Quote Guide"],
    sections: [
      {
        heading: "Create one renovation brief for every bidder",
        paragraphs: [
          "List each room or area, the problem to solve, desired finish, items to retain, timing constraints and a budget boundary. Add drawings, photographs and measurements prepared by an appropriate professional where needed. Mark undecided choices. Sending the same information to every contractor is the foundation of a meaningful quote comparison.",
          "Separate cosmetic changes from structural, electrical, plumbing or other specialist work. Ask who is responsible for design, approvals, investigation and coordination. Do not ask a general contractor to make unverified structural or safety decisions outside their competence. Existing buildings can conceal conditions that require suitably qualified assessment after work opens the surface.",
        ],
      },
      {
        heading: "Verify relevant project experience and responsibility",
        paragraphs: [
          "Check the contractor’s registered identity, contact details and role on recent renovations similar in size and complexity. Ask for references you may contact and, with permission, evidence of completed and in-progress work. Clarify whether the person quoting will supervise daily and which trades are employees or subcontractors.",
          "Request role-appropriate licenses, registrations, insurance or other documentation where applicable to the scope and verify with issuers. A business registration alone does not prove technical competence for every trade. Name the person responsible for site safety, quality decisions, keys, neighbors and communication so that problems do not disappear between several informal teams.",
        ],
      },
      {
        heading: "Demand an itemized and assumption-led quote",
        paragraphs: [
          "The estimate should divide demolition, disposal, labor by trade, materials, equipment, transport, protection, finishing, cleaning, professional services, approvals and taxes where applicable. It should state quantities or specifications where practical and identify allowances. A single total hides the choices that create later disputes and prevents fair comparison between bidders.",
          "Ask each contractor to list exclusions and assumptions: access hours, water and power, storage, surface condition, customer-supplied items and who moves furniture. Compare scope line by line, not only cost. If one quote omits preparation or finishing included elsewhere, resolve the gap before selecting rather than expecting it to be absorbed during work.",
        ],
      },
      {
        heading: "Control materials, payments and changes",
        paragraphs: [
          "Create a material schedule with brand or performance specification, finish, quantity responsibility, approval sample, supplier warranty and substitution rule. Record who orders, receives and checks each item. Do not allow an unavailable product to be replaced silently. A less expensive substitute may change appearance, compatibility, durability or the warranty expected in the original quote.",
          "Tie payments to defined, inspectable milestones and keep receipts. Avoid paying most of the contract before equivalent work and materials are demonstrably in place. Every change should state the reason, added or removed scope, price effect, schedule effect and authorization before execution. Informal verbal changes are a common way for budget control to disappear.",
        ],
      },
      {
        heading: "Plan occupation, safety and neighbor impact",
        paragraphs: [
          "Agree working hours, dust and noise controls, temporary power or water interruptions, safe separation from occupants, waste route, tool storage and daily securing of the site. If the property remains occupied, decide which rooms, toilets and exits stay usable. Children, older people, pets and businesses may require additional separation or scheduling.",
          "Clarify building, landlord, association, neighbor and authority notifications or permissions with appropriate advisers. Photograph adjoining finishes and access routes before work. Ask who handles damage, complaints and cleanup. Renovation risk is not limited to the new finish; delivery, demolition and shared-space use can affect people and property beyond the room being changed.",
        ],
      },
      {
        heading: "Inspect completion before final release",
        paragraphs: [
          "Use the written scope, drawings, material schedule and approved changes to create a completion list. Test doors, fixtures, services and installed items with the responsible trade where appropriate, while leaving regulated testing to qualified professionals. Record unfinished, damaged or non-conforming items, the responsible party and correction date before treating the project as complete.",
          "Collect invoices, warranties, product details, test or approval records, maintenance instructions, spare materials and final photographs. The contract should define defects reporting and retention or final-payment conditions. A strong Butwal renovation quote is not merely detailed at the start; it remains traceable through changes, inspection and a handover record the owner can use.",
        ],
      },
    ],
    faqs: [
      {
        question: "What should a Butwal renovation quote include?",
        answer:
          "It should itemize labor, materials and specifications, demolition, disposal, equipment, transport, protection, finishing, professional work, approvals, taxes, assumptions, exclusions and schedule.",
      },
      {
        question: "How should I pay a renovation contractor?",
        answer:
          "Use a written schedule tied to defined, inspectable milestones, keep receipts and retain control for completion and defects according to mutually agreed contract terms.",
      },
      {
        question: "What is a renovation change order?",
        answer:
          "It is a written record of a scope change, its reason, cost and schedule effects, and authorization. Agree it before changed work proceeds whenever possible.",
      },
    ],
    contextLinks: [
      { href: "/city/butwal", label: "Browse the Butwal directory" },
      {
        href: "/compare-business/contractors",
        label: "Compare contractor options",
      },
      {
        href: "/blog/verified-contractor-nepal",
        label: "Use the contractor verification checklist",
      },
    ],
    citySlugs: ["butwal"],
    categorySlugs: ["contractors"],
    sources: [],
    disclaimer:
      "This is general contractor-selection guidance, not architectural, engineering, legal or safety advice. Use appropriately qualified professionals and current authority guidance for regulated work and approvals.",
  },
  {
    title: "Lalitpur Electrician and Solar Service Guide",
    seoTitle: "Lalitpur Electricians and Solar Services: Guide",
    slug: "lalitpur-electrician-solar-service-guide",
    href: "/blog/lalitpur-electrician-solar-service-guide",
    category: "Home Services",
    excerpt:
      "Compare Lalitpur electrical and solar proposals by load goals, qualified design, components, site conditions, testing and handover records.",
    description:
      "Use a safety-first Lalitpur guide to compare electricians and solar services through system scope, credentials, site survey, itemized proposals, warranties, testing and documentation.",
    image: image("photo-1509391366360-2e959784a276"),
    imageAlt:
      "Solar panels and electrical equipment inspected by a service professional",
    date: "11 Jul 2026",
    publishedAt: "2026-07-11",
    modifiedAt: "2026-07-11",
    readTime: "5 min read",
    author: "Nepali Directory Services Desk",
    keywords: [
      "Lalitpur electrician",
      "solar service Lalitpur",
      "Patan solar installation",
      "solar quote checklist Nepal",
      "electrical service Lalitpur",
    ],
    tags: ["Lalitpur", "Electricians", "Solar", "Safety Guide"],
    sections: [
      {
        heading: "Define the outcome before choosing equipment",
        paragraphs: [
          "State whether you need fault repair, a new circuit, backup for selected loads, lower grid use, solar generation, battery storage, maintenance or an assessment. List essential and optional appliances, current supply and existing generator, inverter, solar or battery equipment. Do not select components from an advertisement before a competent person understands the system.",
          "Collect recent electricity information and equipment labels only where safely accessible; never open a panel or touch wiring for a quote. Explain operating patterns, outage priorities and likely future loads. A provider should turn those needs into a documented design basis and explain limitations rather than promise that one package suits every Lalitpur property.",
        ],
      },
      {
        heading: "Verify who designs, installs and signs off",
        paragraphs: [
          "Ask for the legal business identity and the names and roles of the designer, installation lead and person responsible for inspection or testing. Request relevant training, authorization and registration, then verify through the issuing body. The Nepal Engineering Council register is relevant when registered engineering responsibility applies; it is not a directory of every technician.",
          "Have the provider explain which current approvals, standards or utility requirements apply to your proposed system and confirm through the relevant authority. Distinguish manufacturer training from professional registration and general business paperwork. For subcontracted roofing, structural or electrical tasks, identify who controls safety, quality, insurance and warranty across the complete project.",
        ],
      },
      {
        heading: "Require an on-site survey and design basis",
        paragraphs: [
          "A solar proposal should reflect the actual roof or mounting area, shade, orientation, access, structure, cable route, equipment location, ventilation, weather exposure, earthing and existing electrical condition as assessed by qualified people. Ask which items were inspected and which remain assumptions. Remote photographs alone may not reveal every constraint.",
          "Request an understandable explanation of expected operation under different seasons, loads and outages without accepting a guaranteed energy or saving claim. Ask what the system will and will not power, how the battery is expected to be used and which conditions reduce performance. Keep calculation inputs with the proposal so competing designs can be compared fairly.",
        ],
      },
      {
        heading: "Compare components, protections and full cost",
        paragraphs: [
          "The written proposal should identify panel, inverter, battery and key protection specifications; quantities; mounting; cabling; monitoring; labor; transport; access equipment; civil work; testing; training; taxes where applicable; and exclusions. Ask whether alterations to the existing installation are required and who restores walls, roofs or finishes afterward.",
          "Compare warranty issuer, duration stated by the supplier, claim process, labor treatment and local support for each major component. Do not accept undisclosed substitutes. Separate product, workmanship and performance claims, because they may come from different parties. Payment milestones should follow design approval, documented delivery, installation, testing and handover—not sales pressure alone.",
        ],
      },
      {
        heading: "Control roof, battery and electrical safety",
        paragraphs: [
          "Ask for a site safety plan covering work at height, weather, lifting, occupants, isolation, multiple energy sources and protection of the roof. Confirm who assesses structural suitability and waterproofing. Keep children and other occupants away from the work area. Do not climb onto a roof or handle electrical equipment to inspect the installer yourself.",
          "Batteries and inverters need a provider-selected location appropriate to the product and site, with access controlled and manufacturer requirements followed. Ask about labeling, shutdown information and incident response. Solar and storage can remain energized in ways householders may not expect, so future electricians and emergency responders need clear documentation of all energy sources.",
        ],
      },
      {
        heading: "Insist on testing, demonstration and records",
        paragraphs: [
          "Before final payment, require the qualified responsible person to inspect and test the completed work for the agreed scope, resolve documented defects and demonstrate normal operation, monitoring and safe shutdown information. Do not regard visible generation on an app as the only acceptance test. Record baseline readings or reports provided at commissioning.",
          "Collect the final design, component identifiers, manuals, warranties, test records, settings backup where appropriate, invoice, maintenance schedule and emergency contacts. Ask who handles monitoring alerts and warranty visits. This guide supports comparison; only appropriately qualified people inspecting the actual property can determine a safe, compliant and suitable Lalitpur installation.",
        ],
      },
    ],
    faqs: [
      {
        question: "How should I compare solar quotes in Lalitpur?",
        answer:
          "Give each provider the same load goals, then compare survey findings, design assumptions, component specifications, safety work, testing, warranties, exclusions and complete payment terms.",
      },
      {
        question:
          "Does the Nepal Engineering Council register list every electrician?",
        answer:
          "No. It is relevant for registered engineering professionals. Ask which credential applies to each project role and verify it with the appropriate issuing body.",
      },
      {
        question: "What documents should a solar installer hand over?",
        answer:
          "Request final design and identifiers, manuals, product and workmanship warranties, inspection and test records, invoice, maintenance guidance, shutdown information and support contacts.",
      },
    ],
    contextLinks: [
      { href: "/city/lalitpur", label: "Browse services in Lalitpur" },
      {
        href: "/compare-business/electricians",
        label: "Compare electrician services",
      },
      {
        href: "/blog/nepal-electrician-hiring-safety-checklist",
        label: "Use the Nepal electrician safety checklist",
      },
      {
        href: "/blog/home-services-kathmandu-costs-booking-safety",
        label: "Review home-service booking and safety",
      },
    ],
    citySlugs: ["lalitpur"],
    categorySlugs: ["electricians", "solar-services"],
    sources: [
      {
        label: "Nepal Engineering Council registration portal",
        url: "https://register.nec.gov.np/",
      },
    ],
    disclaimer:
      "This is general selection information, not electrical, solar-design, engineering or legal advice. Use appropriately qualified professionals to assess, design, install and test the actual system under current requirements.",
  },
  {
    title: "Kathmandu Business Registration Lawyer Guide",
    seoTitle: "Kathmandu Business Registration Lawyers: Guide",
    slug: "kathmandu-business-registration-lawyer-guide",
    href: "/blog/kathmandu-business-registration-lawyer-guide",
    category: "Professional Services",
    excerpt:
      "Choose a Kathmandu lawyer for a business-registration matter by verifying status, defining scope, separating fees and documenting advice and filings.",
    description:
      "Use informational guidance to compare Kathmandu business-registration lawyers through professional verification, matter fit, engagement scope, documents, fees, communication and handover.",
    image: image("photo-1450101499163-c8848c66ca85"),
    imageAlt:
      "Business registration documents reviewed during a legal consultation",
    date: "11 Jul 2026",
    publishedAt: "2026-07-11",
    modifiedAt: "2026-07-11",
    readTime: "5 min read",
    author: "Nepali Directory Business Desk",
    keywords: [
      "business registration lawyer Kathmandu",
      "Kathmandu corporate lawyer",
      "Nepal company registration legal help",
      "verify lawyer Nepal",
      "business lawyer consultation checklist",
    ],
    tags: [
      "Kathmandu",
      "Lawyers",
      "Business Registration",
      "Professional Services",
    ],
    sections: [
      {
        heading: "Describe the matter without choosing the answer first",
        paragraphs: [
          "Prepare a factual summary: proposed activity, founders or owners, location, intended customers, financing, timeline, any foreign element and what has already been filed or agreed. State what you need the lawyer to advise on. Do not select an entity or filing path from a generic article before receiving advice tailored to current facts.",
          "Bring questions about ownership, control, liability, tax coordination, intellectual property, employment, licenses and future investment where relevant, while expecting the lawyer to define their own scope. Business registration can overlap with accounting, sector regulation and local permissions. Ask which issues the lawyer handles and which require another appropriately qualified adviser or authority.",
        ],
      },
      {
        heading: "Verify the individual legal practitioner",
        paragraphs: [
          "Request the lawyer’s full professional name and identifying enrollment or license details, then verify through the Nepal Bar Council’s official resources or contact process. Confirm that the person giving legal advice—not only the office or intermediary—has the appropriate current status. A directory listing, academic title or business brand alone is not professional verification.",
          "Ask about recent experience with matters similar in activity, ownership structure and complexity without requesting another client’s confidential information. Experience should be assessed alongside communication and conflicts, not converted into a guaranteed result. This directory does not rank legal competence or endorse a named practitioner; it provides questions for a user-led comparison.",
        ],
      },
      {
        heading: "Demand a clear engagement scope",
        paragraphs: [
          "The engagement letter should identify the client, responsible lawyer, work included, work excluded, assumptions, expected stages and conditions for ending the engagement. Clarify whether the service covers advice only, document drafting, name or other preliminary checks, filing, authority responses, post-registration steps or coordination with other advisers. Do not infer services from “registration package.”",
          "Ask who may work on the file, who communicates with authorities and when your approval is required. If an agent, junior team member or outside professional is involved, understand supervision and confidentiality. Record what counts as completion: filing submitted, registration issued, original documents handed over or another specifically agreed outcome.",
        ],
      },
      {
        heading: "Separate professional fees from outside charges",
        paragraphs: [
          "Request a written fee basis and estimate that distinguishes legal work from government, notary, translation, courier, publication, accounting, travel or other third-party charges where applicable. Ask which figures are fixed, estimated or dependent on events, when invoices are issued and whether taxes are included. Current official charges should be verified through the relevant authority.",
          "Clarify the advance, refund treatment, charge for additional advice and approval threshold for unexpected work. Never send money solely because an unverified message changes payment instructions. Confirm the account and recipient through the firm’s established contact and obtain receipts. The cheapest quote may exclude analysis or follow-through needed for your actual matter.",
        ],
      },
      {
        heading: "Control documents, privacy and filing authority",
        paragraphs: [
          "Ask for a document checklist tied to your case and mark originals, certified copies and translations separately. Keep your own complete copy and a log of anything handed over. Verify requests for identification, signatures, digital credentials, stamps or blank pages; never sign an incomplete document or share access credentials without understanding purpose and control.",
          "Discuss how confidential information is stored and exchanged, who can access it and whether ordinary messaging is suitable for sensitive records. Review each filing or authorization before signature and ask the lawyer to explain unfamiliar statements. Report accurate information; legal help should not be used to conceal ownership, fabricate records or bypass current requirements.",
        ],
      },
      {
        heading: "Track advice, deadlines and final handover",
        paragraphs: [
          "Agree a communication channel, update frequency and responsibility for deadlines, while recognizing that authority processing time may be outside the lawyer’s control. Ask for important advice, decisions and filing receipts in writing. If circumstances change, tell the lawyer promptly because an earlier recommendation may no longer fit the facts or current law.",
          "At completion, collect advice and executed documents, submission and payment receipts, registration records received, unresolved tasks, renewal or compliance dates identified within scope and original materials. Confirm which later obligations need legal, tax or sector advice. This guide is not a registration procedure or legal opinion; current individualized advice must come from a verified professional.",
        ],
      },
    ],
    faqs: [
      {
        question: "How can I verify a business lawyer in Kathmandu?",
        answer:
          "Ask for the lawyer's full professional name and enrollment or license details, then verify through the Nepal Bar Council's official resources or contact process.",
      },
      {
        question:
          "What should a business-registration engagement letter include?",
        answer:
          "It should identify client and lawyer, included and excluded work, stages, responsibility, fees and outside costs, communication, confidentiality, termination and the agreed completion point.",
      },
      {
        question: "Does this guide explain how to register a company in Nepal?",
        answer:
          "No. Requirements depend on current law and individual facts. Use current authority information and obtain advice from verified legal, tax and sector professionals as appropriate.",
      },
    ],
    contextLinks: [
      {
        href: "/city/kathmandu",
        label: "Browse Kathmandu professional services",
      },
      { href: "/categories", label: "Explore directory categories" },
      {
        href: "/blog/list-business-nepal-directory",
        label: "Learn how to list a registered business",
      },
    ],
    citySlugs: ["kathmandu"],
    categorySlugs: ["lawyers", "professional-services"],
    sources: [
      {
        label: "Nepal Bar Council",
        url: "https://nepalbarcouncil.org.np/en/home-page/",
      },
    ],
    disclaimer:
      "This is general lawyer-selection information, not legal, tax or registration advice. Laws, procedures and fees change; verify current requirements and obtain advice from appropriately licensed professionals for your facts.",
  },
];
