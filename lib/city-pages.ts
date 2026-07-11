export type CityDirectoryPage = {
  name: string;
  slug: string;
  href: string;
  province: string;
  title: string;
  seoTitle: string;
  description: string;
  image: string;
  imageAlt: string;
  listings: string;
  neighborhoods: string;
  rating: string;
  highlight: string;
  keywords: string[];
  popularSearches: string[];
};

export type CityEditorialDetail = {
  overview: string[];
  localAreas: string[];
  searchTips: Array<{ title: string; body: string }>;
  faqs: Array<{ question: string; answer: string }>;
};

const image = (id: string, width = "1800", height = "780") =>
  `https://images.unsplash.com/${id}?w=${width}&h=${height}&fit=crop&auto=format`;

export const cityDirectoryPages: CityDirectoryPage[] = [
  {
    name: "Kathmandu",
    slug: "kathmandu",
    href: "/city/kathmandu",
    province: "Bagmati Province",
    title: "Kathmandu local business directory",
    seoTitle: "Kathmandu Business Directory: Restaurants, Hotels, Doctors and Services",
    description:
      "Find verified restaurants, hotels, doctors, salons, contractors and home services across Kathmandu Valley.",
    image: image("photo-1605640840605-14ac1855827b"),
    imageAlt: "Kathmandu city and heritage skyline",
    listings: "Live",
    neighborhoods: "6",
    rating: "Reviewed",
    highlight: "Best for dense local search across restaurants, clinics, hotels and home services.",
    keywords: ["Kathmandu business directory", "businesses in Kathmandu", "Kathmandu restaurants", "Kathmandu hotels"],
    popularSearches: ["Restaurants", "Doctors", "Hotels", "Plumbers", "Electricians", "Beauty Salons"]
  },
  {
    name: "Pokhara",
    slug: "pokhara",
    href: "/city/pokhara",
    province: "Gandaki Province",
    title: "Pokhara local business directory",
    seoTitle: "Pokhara Business Directory: Hotels, Travel Agencies, Restaurants and Services",
    description:
      "Find Pokhara hotels, travel agencies, restaurants, cafes, adventure desks and local services around Lakeside and nearby areas.",
    image: image("photo-1626621341517-bbf3d9990a23"),
    imageAlt: "Phewa Lake and mountain views in Pokhara",
    listings: "Live",
    neighborhoods: "5",
    rating: "Reviewed",
    highlight: "Best for hotels, travel agencies, adventure services and lake-area dining.",
    keywords: ["Pokhara business directory", "Pokhara hotels", "Pokhara travel agencies", "Pokhara restaurants"],
    popularSearches: ["Hotels", "Travel Agencies", "Restaurants", "Cafes", "Adventure Tours", "Resorts"]
  },
  {
    name: "Lalitpur",
    slug: "lalitpur",
    href: "/city/lalitpur",
    province: "Bagmati Province",
    title: "Lalitpur local business directory",
    seoTitle: "Lalitpur Business Directory: Clinics, Schools, Restaurants and Services",
    description:
      "Browse Lalitpur businesses including Patan restaurants, clinics, schools, salons, repair services and professional providers.",
    image: image("photo-1561361513-2d000a50f0dc"),
    imageAlt: "Patan Durbar Square in Lalitpur",
    listings: "Live",
    neighborhoods: "5",
    rating: "Reviewed",
    highlight: "Best for Patan dining, schools, clinics, salons and professional services.",
    keywords: ["Lalitpur business directory", "Patan restaurants", "Lalitpur clinics", "Lalitpur schools"],
    popularSearches: ["Restaurants", "Clinics", "Schools", "Beauty Salons", "Contractors", "Cafes"]
  },
  {
    name: "Bhaktapur",
    slug: "bhaktapur",
    href: "/city/bhaktapur",
    province: "Bagmati Province",
    title: "Bhaktapur local business directory",
    seoTitle: "Bhaktapur Business Directory: Newari Restaurants, Hotels and Local Services",
    description:
      "Find Bhaktapur restaurants, hotels, heritage dining rooms, shops, repair providers and local services.",
    image: image("photo-1614107707379-283a65774553"),
    imageAlt: "Historic square in Bhaktapur",
    listings: "Live",
    neighborhoods: "5",
    rating: "Reviewed",
    highlight: "Best for heritage dining, local shops, hotels and neighborhood service providers.",
    keywords: ["Bhaktapur business directory", "Bhaktapur restaurants", "Newari restaurant Bhaktapur", "Bhaktapur hotels"],
    popularSearches: ["Newari Restaurants", "Hotels", "Shops", "Contractors", "Plumbers", "Cafes"]
  },
  {
    name: "Chitwan",
    slug: "chitwan",
    href: "/city/chitwan",
    province: "Bagmati Province",
    title: "Chitwan local business directory",
    seoTitle: "Chitwan Business Directory: Hotels, Safari Tours, Restaurants and Services",
    description:
      "Explore Chitwan hotels, safari operators, restaurants, transport providers, clinics and local services.",
    image: image("photo-1571401835393-8c5f35328320"),
    imageAlt: "River and forest landscape in Chitwan",
    listings: "Live",
    neighborhoods: "4",
    rating: "Reviewed",
    highlight: "Best for safari tours, hotels, family travel and regional service searches.",
    keywords: ["Chitwan business directory", "Chitwan hotels", "Chitwan safari", "Sauraha restaurants"],
    popularSearches: ["Hotels", "Safari Tours", "Restaurants", "Travel Agencies", "Clinics", "Transport"]
  },
  {
    name: "Biratnagar",
    slug: "biratnagar",
    href: "/city/biratnagar",
    province: "Koshi Province",
    title: "Biratnagar local business directory",
    seoTitle: "Biratnagar Business Directory: Doctors, Schools, Hotels and Services",
    description:
      "Find Biratnagar doctors, schools, hotels, restaurants, shops, repair providers and professional services.",
    image: image("photo-1544735716-392fe2489ffa"),
    imageAlt: "Busy Nepal city street and businesses",
    listings: "Live",
    neighborhoods: "4",
    rating: "Reviewed",
    highlight: "Best for eastern Nepal business search across healthcare, education and services.",
    keywords: ["Biratnagar business directory", "Biratnagar doctors", "Biratnagar schools", "Biratnagar hotels"],
    popularSearches: ["Doctors", "Schools", "Hotels", "Restaurants", "Repair Services", "Shops"]
  },
  {
    name: "Butwal",
    slug: "butwal",
    href: "/city/butwal",
    province: "Lumbini Province",
    title: "Butwal local business directory",
    seoTitle: "Butwal Business Directory: Hotels, Restaurants, Clinics and Services",
    description:
      "Browse Butwal hotels, restaurants, clinics, schools, auto repair shops, contractors and local services.",
    image: image("photo-1518002054494-3a6f94352e9d"),
    imageAlt: "Nepal road and city travel scene",
    listings: "Live",
    neighborhoods: "5",
    rating: "Reviewed",
    highlight: "Best for Lumbini corridor hotels, restaurants, clinics and service providers.",
    keywords: ["Butwal business directory", "Butwal hotels", "Butwal restaurants", "Butwal clinics"],
    popularSearches: ["Hotels", "Restaurants", "Clinics", "Auto Repair", "Contractors", "Schools"]
  },
  {
    name: "Dharan",
    slug: "dharan",
    href: "/city/dharan",
    province: "Koshi Province",
    title: "Dharan local business directory",
    seoTitle: "Dharan Business Directory: Restaurants, Clinics, Hotels and Services",
    description:
      "Find Dharan restaurants, clinics, hotels, schools, repair providers, salons and local business services.",
    image: image("photo-1500534314209-a25ddb2bd429"),
    imageAlt: "Green hill road and eastern Nepal travel landscape",
    listings: "Live",
    neighborhoods: "4",
    rating: "Reviewed",
    highlight: "Best for eastern hill-city dining, clinics, hotels and neighborhood services.",
    keywords: ["Dharan business directory", "Dharan restaurants", "Dharan clinics", "Dharan hotels"],
    popularSearches: ["Restaurants", "Clinics", "Hotels", "Schools", "Beauty Salons", "Repair Services"]
  }
];

export const cityEditorialDetails: Record<string, CityEditorialDetail> = {
  kathmandu: {
    overview: [
      "Kathmandu searches change block by block. Thamel and Durbar Marg often suit visitor-facing hotels, restaurants and travel services, while New Baneshwor and Putalisadak have stronger office, education, clinic and professional-service intent. Boudha, Lazimpat and Baluwatar each produce a different mix of dining, accommodation and everyday service needs.",
      "Start with the exact neighborhood and the job to be done. Valley travel time, parking, opening hours and whether a provider serves your address can matter more than straight-line distance. A useful shortlist should therefore combine location with current phone details, service scope and direct confirmation."
    ],
    localAreas: ["Thamel", "Boudha", "New Baneshwor", "Lazimpat", "Putalisadak", "Baluwatar"],
    searchTips: [
      { title: "For food and stays", body: "Filter by neighborhood, meal or stay purpose, dietary or room needs, reservation policy and transport access." },
      { title: "For urgent home services", body: "Share the exact fault and ward or landmark, then confirm visit fee, parts, response time and warranty in writing." },
      { title: "For health and professional help", body: "Match the correct specialty first and verify professional registration through the relevant Nepal authority." }
    ],
    faqs: [
      { question: "How should I search for a Kathmandu business?", answer: "Use the category plus a specific neighborhood, then compare current contact information, service scope and access before calling." },
      { question: "Are all Kathmandu profiles automatically ranked?", answer: "No. Preview, incomplete and unreviewed records stay outside city rankings and structured listing results." }
    ]
  },
  pokhara: {
    overview: [
      "Pokhara combines visitor services around Lakeside and Damside with everyday commerce around New Road, Mahendrapul and Bagale Tole. A hotel, trekking desk or lakeside restaurant search has different questions from a clinic, repair or school search in the wider city.",
      "For travel bookings, compare the exact service included, pickup point, cancellation terms and who handles permits or guides. For local services, ask whether the business covers your neighborhood and whether the published hours apply outside peak visitor seasons."
    ],
    localAreas: ["Lakeside", "Damside", "New Road", "Mahendrapul", "Bagale Tole"],
    searchTips: [
      { title: "Choose the right base", body: "Decide whether lake access, airport or bus access, quieter streets, or proximity to a meeting point matters most." },
      { title: "Check travel inclusions", body: "Ask who provides transport, permits, guides, insurance information and emergency support; keep the written itinerary." },
      { title: "Confirm seasonal details", body: "Hours, availability and transport can change, so verify time-sensitive information directly before arrival." }
    ],
    faqs: [
      { question: "Is every Pokhara listing near Lakeside?", answer: "No. Pokhara extends beyond Lakeside, so check the full address and transport plan instead of relying on the city name." },
      { question: "What should I verify with a trekking desk?", answer: "Confirm licensing, itinerary, guide arrangements, permit responsibility, emergency support, inclusions and cancellation terms." }
    ]
  },
  lalitpur: {
    overview: [
      "Lalitpur searches commonly span Patan's heritage core, Pulchowk and Jawalakhel commercial areas, Kupondole's valley connection and the wider Satdobato corridor. The best location depends on whether the visit is for food, education, health, professional work or a service call.",
      "Use both Lalitpur and Patan terms where appropriate, but confirm the municipality and street address. Providers may describe coverage as Kathmandu Valley even when their workshop or clinic is in one neighborhood."
    ],
    localAreas: ["Patan", "Pulchowk", "Jawalakhel", "Kupondole", "Satdobato"],
    searchTips: [
      { title: "For schools and clinics", body: "Compare commute, appointment or admission process, complete fees, facilities and the responsible professional or institution." },
      { title: "For cafes and meetings", body: "Check seating, current hours, noise expectations, Wi-Fi information and parking rather than relying on photos alone." },
      { title: "For electrical and solar work", body: "Request a site assessment, itemized equipment and labour, safety process and written after-service terms." }
    ],
    faqs: [
      { question: "Should I search for Patan or Lalitpur?", answer: "Both terms are useful. Confirm the exact neighborhood because businesses may use Patan, Lalitpur or Kathmandu Valley in public descriptions." },
      { question: "How are Lalitpur providers added to city results?", answer: "A public result needs reviewed category and location data plus adequate provenance and profile completeness." }
    ]
  },
  bhaktapur: {
    overview: [
      "Bhaktapur combines the Durbar Square heritage area with residential and transport corridors around Suryabinayak, Sallaghari and nearby Madhyapur Thimi. Visitor dining and stays near the historic core need different comparison criteria from contractors, repair services and everyday shops serving residents.",
      "In heritage areas, ask about walking access, vehicle restrictions, group seating and the exact meeting point. Elsewhere, confirm service radius and whether a provider charges for travel from another part of the valley."
    ],
    localAreas: ["Durbar Square", "Suryabinayak", "Sallaghari", "Kamalbinayak", "Madhyapur Thimi"],
    searchTips: [
      { title: "For Newari dining", body: "Compare menu scope, vegetarian needs, group arrangements, current hours and whether advance booking is required." },
      { title: "For heritage-area stays", body: "Confirm the real address, luggage access, check-in arrangements and transport rather than assuming vehicle access." },
      { title: "For local trades", body: "Ask whether the stated service area includes your ward and obtain an itemized visit and parts estimate." }
    ],
    faqs: [
      { question: "Are Bhaktapur businesses all inside Durbar Square?", answer: "No. Check the precise address because the directory covers the wider Bhaktapur area, not only the historic square." },
      { question: "What should groups confirm with a restaurant?", answer: "Confirm seating, menu, dietary needs, final price, current hours and reservation terms directly." }
    ]
  },
  chitwan: {
    overview: [
      "Chitwan business searches often divide between Bharatpur and Narayangarh for regional services and Sauraha or Ratnanagar for visitor accommodation, dining and park-related trips. Treat the district name as a starting point, not a precise location.",
      "For safari and travel services, verify authorization, the exact activity operator, transport, guide arrangements, safety information and what the quote includes. For clinics and everyday services, confirm the branch, opening hours and travel time from your location."
    ],
    localAreas: ["Bharatpur", "Narayangarh", "Sauraha", "Ratnanagar"],
    searchTips: [
      { title: "Separate town and park access", body: "Check whether the business is in Bharatpur, Narayangarh, Sauraha or another municipality before planning transport." },
      { title: "Verify activity providers", body: "Ask who actually operates each activity, what permits or park fees apply and what safety support is included." },
      { title: "Plan around current conditions", body: "Season, weather and operating rules can change; use official park or tourism sources for current requirements." }
    ],
    faqs: [
      { question: "Is a Chitwan address enough for directions?", answer: "No. Chitwan covers multiple towns and visitor areas, so use the municipality, neighborhood and a confirmed map point." },
      { question: "Does the directory guarantee safari availability?", answer: "No. Confirm current availability, rules, fees and the actual operator directly before paying." }
    ]
  },
  biratnagar: {
    overview: [
      "Biratnagar is a major service and commercial center in Morang and a practical hub for eastern Nepal. Searches around Main Road, Traffic Chowk, Bargachhi and Rani can cover healthcare, education, hotels, trading businesses and professional services.",
      "City-wide labels are not enough for urgent appointments or visits. Compare the precise branch, specialty or service, opening information, transport and whether advance booking is needed."
    ],
    localAreas: ["Main Road", "Traffic Chowk", "Bargachhi", "Rani"],
    searchTips: [
      { title: "For doctors and clinics", body: "Identify the needed specialty, verify practitioner registration and confirm appointment, diagnostics and follow-up arrangements." },
      { title: "For schools", body: "Compare curriculum, complete fee schedule, commute, transport, visit process and direct parent communication." },
      { title: "For hotels and services", body: "Confirm branch address, check-in or service hours and transport needs before travelling." }
    ],
    faqs: [
      { question: "How do I compare Biratnagar clinics?", answer: "Start with the correct specialty and verify professional registration, appointment process, facilities and follow-up." },
      { question: "Why might a city search show no named providers?", answer: "The directory does not fill city pages with sample businesses; a named result appears only after publication checks pass." }
    ]
  },
  butwal: {
    overview: [
      "Butwal serves local residents and travelers moving through the Lumbini corridor. Traffic Chowk and Golpark are useful orientation points, while Devinagar, Kalikanagar and Sukhhanagar cover a broader mix of residential services, schools, clinics and repair needs.",
      "For vehicles, contractors and home services, describe the exact problem and location before asking for a quote. For hotels and dining, check whether the address fits your onward route rather than choosing by the city name alone."
    ],
    localAreas: ["Traffic Chowk", "Golpark", "Devinagar", "Kalikanagar", "Sukhhanagar"],
    searchTips: [
      { title: "For auto repair", body: "Ask for diagnosis, parts options, labour, completion estimate and warranty before approving additional work." },
      { title: "For renovation work", body: "Provide a written scope and compare itemized materials, labour, milestones, payments and handover terms." },
      { title: "For overnight stays", body: "Confirm exact location, parking or transport access, current check-in details and cancellation terms." }
    ],
    faqs: [
      { question: "What should an auto-repair estimate include?", answer: "Ask for diagnosis, parts and brands, labour, taxes, expected completion and warranty in writing." },
      { question: "Are Butwal rankings filled with sample shops?", answer: "No. Sample and unreviewed records are excluded from city lists, sitemaps and rating schema." }
    ]
  },
  dharan: {
    overview: [
      "Dharan combines commerce around Bhanu Chowk and Putali Line with residential neighborhoods and important health and education activity toward the BPKIHS area. Vijayapur also has a distinct visitor and local-services context.",
      "Use a neighborhood or landmark with the service category, especially for appointments and urgent calls. For any regulated service, check the relevant professional register and confirm the individual who will provide the work."
    ],
    localAreas: ["Bhanu Chowk", "Putali Line", "BPKIHS area", "Vijayapur"],
    searchTips: [
      { title: "For health services", body: "Match the right facility or specialty, verify the professional and confirm appointment, referral and follow-up details." },
      { title: "For salons", body: "Compare the exact service, consultation, hygiene, portfolio, appointment terms and complete price before booking." },
      { title: "For hotels and restaurants", body: "Check neighborhood, current hours, access, group or dietary needs and reservation terms directly." }
    ],
    faqs: [
      { question: "How specific should a Dharan search be?", answer: "Add the category and a neighborhood or landmark, then verify the full address and availability by phone." },
      { question: "How does Nepali Directory handle incomplete profiles?", answer: "Incomplete or unreviewed profiles can remain in a private review workflow but do not enter public city rankings." }
    ]
  }
};

export function getCityEditorialDetail(slug: string): CityEditorialDetail {
  return cityEditorialDetails[slug];
}

export function getCityDirectoryPage(slug: string) {
  return cityDirectoryPages.find((city) => city.slug === slug);
}

export function slugifyCityName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function getCityHref(name: string) {
  const slug = slugifyCityName(name);
  return getCityDirectoryPage(slug)?.href ?? `/search?location=${encodeURIComponent(name)}`;
}
