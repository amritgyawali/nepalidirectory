import {
  Briefcase,
  Building2,
  Car,
  GraduationCap,
  HeartPulse,
  Hotel,
  Home,
  Scale,
  Sparkles,
  Utensils,
  Wrench,
  Zap
} from "lucide-react";
import { routes } from "@/lib/routes";
export { blogPosts } from "@/lib/blog";

export type Business = {
  rank: number;
  name: string;
  slug: string;
  categories: string[];
  area: string;
  neighborhood?: string;
  address: string;
  phone: string;
  website?: string;
  email?: string;
  rating: number;
  reviews: number;
  price: number;
  status: "open" | "closed" | "24h";
  hoursToday: string;
  image: string;
  quote: string;
  amenities: string[];
  years?: number;
  delivery?: boolean;
  verified?: boolean;
  claimed?: boolean;
  sponsored?: boolean;
  distanceKm?: number;
  serviceAreas?: string[];
  services?: string[];
  specialties?: string[];
  paymentMethods?: string[];
  languages?: string[];
  credentials?: string[];
  coupons?: Array<{ title: string; description: string; code?: string; expires: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  owner?: { name: string; role: string };
  coordinates?: { lat: number; lng: number };
};

const image = (id: string, size = "600") =>
  `https://images.unsplash.com/${id}?w=${size}&h=${size}&fit=crop&auto=format`;

export const categories = [
  { name: "Restaurants", count: "12,400", icon: Utensils, color: "#fff7d1", href: routes.search },
  { name: "Doctors", count: "4,820", icon: HeartPulse, color: "#e8f4fd", href: routes.search },
  { name: "Plumbers", count: "2,140", icon: Wrench, color: "#e8f5ed", href: routes.search },
  { name: "Electricians", count: "1,760", icon: Zap, color: "#fff7d1", href: routes.search },
  { name: "Hotels", count: "3,950", icon: Hotel, color: "#fce8ec", href: routes.search },
  { name: "Lawyers", count: "1,280", icon: Scale, color: "#ecf0fb", href: routes.search },
  { name: "Auto Repair", count: "2,310", icon: Car, color: "#f0f0f0", href: routes.search },
  { name: "Beauty Salons", count: "1,940", icon: Sparkles, color: "#f3e8fd", href: routes.search },
  { name: "Schools", count: "4,220", icon: GraduationCap, color: "#e0f4f4", href: routes.search },
  { name: "Contractors", count: "1,620", icon: Building2, color: "#fff1e0", href: routes.search }
];

export const categoryGroups = [
  {
    title: "Home Services",
    description: "Plumbing, electrical, repair and household contractors",
    icon: Home,
    items: [
      "Plumbers",
      "Electricians",
      "Painters",
      "Movers & Packers",
      "Carpenters",
      "AC Repair",
      "House Cleaning",
      "Interior Designers",
      "CCTV Installation",
      "Solar Installers",
      "Contractors",
      "Pest Control"
    ]
  },
  {
    title: "Medical & Healthcare",
    description: "Doctors, hospitals, specialists and pharmacies",
    icon: HeartPulse,
    items: [
      "Doctors",
      "Dentists",
      "Dermatologists",
      "Gynecologists",
      "Pediatricians",
      "Hospitals",
      "Pharmacies",
      "Eye Care",
      "Physiotherapy",
      "Diagnostic Labs",
      "Ayurvedic Doctors",
      "Ambulance Services"
    ]
  },
  {
    title: "Food & Hospitality",
    description: "Restaurants, cafes, hotels and event venues",
    icon: Utensils,
    items: [
      "Newari Restaurants",
      "Thakali Restaurants",
      "Tibetan Restaurants",
      "Cafes & Bistros",
      "Bakeries",
      "Hotels",
      "Resorts",
      "Bars & Lounges",
      "Wedding Venues",
      "Caterers",
      "Sweet Shops",
      "Fine Dining"
    ]
  },
  {
    title: "Professional Services",
    description: "Legal, financial, education and business support",
    icon: Briefcase,
    items: [
      "Lawyers",
      "Accountants",
      "Banks",
      "Insurance Agents",
      "Tax Consultants",
      "Schools",
      "Colleges",
      "Language Institutes",
      "IT Companies",
      "Travel Agencies",
      "Real Estate",
      "Printing Press"
    ]
  }
];

export const cities = [
  {
    name: "Kathmandu",
    listings: "12,840",
    image: image("photo-1605640840605-14ac1855827b", "700"),
    href: "/city/kathmandu"
  },
  {
    name: "Pokhara",
    listings: "4,210",
    image: image("photo-1626621341517-bbf3d9990a23", "700"),
    href: "/city/pokhara"
  },
  {
    name: "Lalitpur",
    listings: "6,580",
    image: image("photo-1561361513-2d000a50f0dc", "700"),
    href: "/city/lalitpur"
  },
  {
    name: "Bhaktapur",
    listings: "2,940",
    image: image("photo-1614107707379-283a65774553", "700"),
    href: "/city/bhaktapur"
  },
  {
    name: "Chitwan",
    listings: "1,820",
    image: image("photo-1571401835393-8c5f35328320", "700"),
    href: "/city/chitwan"
  }
];

export const cityLinks = [
  "Biratnagar",
  "Birgunj",
  "Butwal",
  "Bharatpur",
  "Dharan",
  "Nepalgunj",
  "Hetauda",
  "Itahari",
  "Dhangadhi",
  "Janakpur",
  "Ghorahi",
  "Tulsipur",
  "Damak",
  "Kirtipur",
  "Banepa"
];

export const businesses: Business[] = [
  {
    rank: 1,
    name: "Newa Lahana",
    slug: "newa-lahana",
    categories: ["Newari Fine Dining", "Restaurants", "Heritage"],
    area: "Bhaktapur",
    neighborhood: "Durbar Square",
    address: "Inacho, Bhaktapur Durbar Square",
    phone: "(01) 6611945",
    website: "https://example.com/newa-lahana",
    email: "hello@newalahana.example",
    rating: 4.7,
    reviews: 842,
    price: 3,
    status: "closed",
    hoursToday: "Today: 11:30 am - 9:00 pm",
    image: image("photo-1547592180-85f173990554"),
    quote:
      "Authentic Newari samay baji served in a heritage courtyard. The choila and yomari were exceptional.",
    amenities: ["Heritage building", "Outdoor courtyard", "Group friendly", "Vegetarian options"],
    years: 18,
    verified: true,
    claimed: true,
    sponsored: true,
    distanceKm: 12.4,
    serviceAreas: ["Bhaktapur", "Kathmandu", "Lalitpur"],
    services: ["Dine-in", "Group booking", "Catering", "Festival menus", "Private events"],
    specialties: ["Samay baji", "Choila", "Yomari", "Newari tasting set"],
    paymentMethods: ["Cash", "Card", "Fonepay", "eSewa"],
    languages: ["Nepali", "Newari", "English"],
    credentials: ["Verified phone", "Owner-managed", "Menu updated"],
    coupons: [
      {
        title: "10% off heritage tasting set",
        description: "Show this offer before ordering for dine-in groups of four or more.",
        code: "NEWARI10",
        expires: "Jul 31, 2026"
      }
    ],
    faqs: [
      {
        question: "Do I need a reservation?",
        answer: "Walk-ins are accepted, but groups and tasting menus should call ahead."
      },
      {
        question: "Is vegetarian Newari food available?",
        answer: "Yes, the kitchen offers vegetarian festival sets and mushroom choila-style dishes."
      }
    ],
    owner: { name: "Sumesh Maharjan", role: "Chef-owner" },
    coordinates: { lat: 27.6722, lng: 85.4298 }
  },
  {
    rank: 2,
    name: "Bhojan Griha Heritage Restaurant",
    slug: "bhojan-griha",
    categories: ["Multicuisine Nepali", "Cultural Show", "Restaurants"],
    area: "Dilli Bazar",
    neighborhood: "Dilli Bazar",
    address: "Dilli Bazar, Kathmandu 44600",
    phone: "(01) 4416423",
    website: "https://example.com/bhojan-griha",
    email: "bookings@bhojangriha.example",
    rating: 4.6,
    reviews: 1240,
    price: 4,
    status: "open",
    hoursToday: "Today: 6:00 pm - 11:00 pm",
    image: image("photo-1567188040759-fb8a883dc6d8"),
    quote:
      "A restored palace with a tasting menu and nightly cultural performances. Book ahead for groups.",
    amenities: ["Live cultural show", "Set menu", "Air conditioned"],
    years: 22,
    verified: true,
    claimed: true,
    sponsored: true,
    distanceKm: 1.8,
    serviceAreas: ["Kathmandu Valley"],
    services: ["Dinner", "Cultural show", "Group booking", "Set menu"],
    specialties: ["Nepali tasting menu", "Cultural performance", "Corporate dinners"],
    paymentMethods: ["Cash", "Card", "Bank transfer"],
    languages: ["Nepali", "English"],
    credentials: ["Reservation desk", "Large group seating"],
    coupons: [
      {
        title: "Free cultural show seat with dinner set",
        description: "Valid for advance reservations Sunday through Thursday.",
        expires: "Aug 15, 2026"
      }
    ],
    owner: { name: "Bhojan Griha Team", role: "Reservations" },
    coordinates: { lat: 27.7047, lng: 85.3261 }
  },
  {
    rank: 3,
    name: "Yangling Tibetan Restaurant",
    slug: "yangling-tibetan",
    categories: ["Tibetan", "Sherpa", "Momos"],
    area: "Boudha",
    neighborhood: "Boudha Stupa",
    address: "Boudha Stupa Road, Kathmandu",
    phone: "(01) 4910092",
    website: "https://example.com/yangling",
    rating: 4.5,
    reviews: 520,
    price: 2,
    status: "open",
    hoursToday: "Today: 8:00 am - 10:00 pm",
    image: image("photo-1496116218417-1a781b1c416c"),
    quote: "The buff momo is legendary among monks and travellers. Try the thukpa on cold days.",
    amenities: ["Cash only", "Family friendly"],
    delivery: true,
    verified: true,
    claimed: false,
    distanceKm: 5.2,
    serviceAreas: ["Boudha", "Chabahil", "Jorpati"],
    services: ["Dine-in", "Takeout", "Delivery"],
    specialties: ["Buff momo", "Thukpa", "Tingmo"],
    paymentMethods: ["Cash", "Fonepay"],
    languages: ["Nepali", "Tibetan", "English"],
    credentials: ["Local favorite"],
    owner: { name: "Yangling Counter", role: "Front desk" },
    coordinates: { lat: 27.7215, lng: 85.3614 }
  },
  {
    rank: 4,
    name: "Roadhouse Cafe Thamel",
    slug: "roadhouse-cafe",
    categories: ["Italian", "Pizza", "Continental", "Bars"],
    area: "Thamel",
    neighborhood: "Thamel",
    address: "Thamel Chowk, JP Marg",
    phone: "(01) 4262768",
    website: "https://example.com/roadhouse-thamel",
    rating: 4.4,
    reviews: 1890,
    price: 3,
    status: "open",
    hoursToday: "Today: 11:00 am - 11:30 pm",
    image: image("photo-1565299624946-b28f40a0ae38"),
    quote: "Wood-fired pizzas, good cocktails and a rooftop view of Thamel.",
    amenities: ["Rooftop", "Wood-fired oven", "Bar"],
    years: 12,
    delivery: true,
    verified: true,
    claimed: true,
    distanceKm: 1.1,
    serviceAreas: ["Thamel", "Lazimpat", "Durbar Marg"],
    services: ["Dine-in", "Delivery", "Rooftop seating", "Bar service"],
    specialties: ["Wood-fired pizza", "Cocktails", "Pasta"],
    paymentMethods: ["Cash", "Card", "Fonepay"],
    languages: ["Nepali", "English"],
    credentials: ["Online ordering", "Updated hours"],
    coupons: [
      {
        title: "Buy 2 pizzas, get garlic bread",
        description: "Available for dine-in after 5 pm.",
        expires: "Jul 20, 2026"
      }
    ],
    coordinates: { lat: 27.7154, lng: 85.3124 }
  },
  {
    rank: 5,
    name: "Himalayan Java Lazimpat",
    slug: "himalayan-java-lazimpat",
    categories: ["Cafe", "Coffee", "Breakfast", "Bakery"],
    area: "Lazimpat",
    neighborhood: "Lazimpat",
    address: "Lazimpat Road, Kathmandu",
    phone: "(01) 4411604",
    website: "https://example.com/himalayan-java-lazimpat",
    rating: 4.5,
    reviews: 980,
    price: 2,
    status: "open",
    hoursToday: "Today: 7:00 am - 9:00 pm",
    image: image("photo-1495474472287-4d71bcdd2085"),
    quote: "Best espresso in town, with a quiet upstairs space for working.",
    amenities: ["Wi-Fi", "Specialty coffee", "Outdoor seating"],
    years: 17,
    delivery: true,
    verified: true,
    claimed: true,
    distanceKm: 2.3,
    serviceAreas: ["Lazimpat", "Baluwatar", "Naxal"],
    services: ["Breakfast", "Coffee", "Workspace", "Delivery"],
    specialties: ["Espresso", "Bakery", "Breakfast plates"],
    paymentMethods: ["Cash", "Card", "eSewa"],
    languages: ["Nepali", "English"],
    credentials: ["Wi-Fi verified", "Digital menu"],
    coordinates: { lat: 27.7201, lng: 85.3186 }
  },
  {
    rank: 6,
    name: "Annapurna Thakali Bhansa Ghar",
    slug: "annapurna-thakali",
    categories: ["Thakali", "Nepali Thali", "Restaurants"],
    area: "Lazimpat",
    neighborhood: "Lazimpat",
    address: "Lazimpat Marg, Kathmandu",
    phone: "(01) 4419807",
    website: "https://example.com/annapurna-thakali",
    rating: 4.7,
    reviews: 734,
    price: 3,
    status: "closed",
    hoursToday: "Today: 12:00 pm - 10:00 pm",
    image: image("photo-1565557623262-b51c2513a641"),
    quote: "A proper Thakali set with dhindo, gundruk and slow-cooked mutton.",
    amenities: ["Traditional seating", "Halal", "Group friendly"],
    verified: true,
    distanceKm: 2.1,
    serviceAreas: ["Lazimpat", "Kathmandu"],
    services: ["Dine-in", "Takeout", "Group lunch"],
    specialties: ["Thakali set", "Dhindo", "Gundruk"],
    paymentMethods: ["Cash", "Fonepay"],
    languages: ["Nepali", "English"],
    coordinates: { lat: 27.7184, lng: 85.3181 }
  },
  {
    rank: 7,
    name: "Kathmandu Plumbing Services",
    slug: "kathmandu-plumbing-services",
    categories: ["Plumbers", "Home Services", "Emergency Repair"],
    area: "Kathmandu",
    neighborhood: "Putalisadak",
    address: "Putalisadak, Kathmandu 44600",
    phone: "(01) 5321188",
    website: "https://example.com/kathmandu-plumbing",
    email: "service@kathmanduplumbing.example",
    rating: 4.8,
    reviews: 312,
    price: 2,
    status: "24h",
    hoursToday: "Open 24 hours",
    image: image("photo-1621905251189-08b45d6a269e"),
    quote: "Fast leak repair, bathroom fitting replacement and water tank line maintenance.",
    amenities: ["Emergency visits", "Warranty on parts", "Online booking"],
    years: 9,
    verified: true,
    claimed: true,
    distanceKm: 0.9,
    serviceAreas: ["Kathmandu", "Lalitpur", "Bhaktapur", "Kirtipur"],
    services: ["Leak repair", "Bathroom fitting", "Water tank lines", "Drain cleaning", "Emergency repair"],
    specialties: ["24-hour emergency calls", "Same-day visits", "Part warranty"],
    paymentMethods: ["Cash", "Card", "Bank transfer", "Fonepay"],
    languages: ["Nepali", "English", "Hindi"],
    credentials: ["Licensed team", "Warranty on parts", "Emergency dispatch"],
    coupons: [
      {
        title: "Free inspection with repair",
        description: "Inspection fee waived when repair work is approved on the same visit.",
        code: "PIPEFIX",
        expires: "Sep 30, 2026"
      }
    ],
    faqs: [
      {
        question: "Do plumbers bring replacement parts?",
        answer: "The team carries common fittings and can source specialty parts after diagnosis."
      }
    ],
    owner: { name: "Aarav Shrestha", role: "Service manager" },
    coordinates: { lat: 27.7051, lng: 85.3252 }
  },
  {
    rank: 8,
    name: "Patan Electric & Solar",
    slug: "patan-electric-solar",
    categories: ["Electricians", "Solar Installers", "Home Services"],
    area: "Lalitpur",
    neighborhood: "Pulchowk",
    address: "Pulchowk Road, Lalitpur",
    phone: "(01) 5534091",
    website: "https://example.com/patan-electric-solar",
    rating: 4.6,
    reviews: 208,
    price: 2,
    status: "open",
    hoursToday: "Today: 8:00 am - 7:00 pm",
    image: image("photo-1621905252507-b35492cc74b4"),
    quote: "Licensed wiring, inverter setup and rooftop solar maintenance for homes and shops.",
    amenities: ["Licensed team", "Solar audit", "Same-day repair"],
    years: 7,
    verified: true,
    claimed: true,
    distanceKm: 4.6,
    serviceAreas: ["Lalitpur", "Kathmandu", "Bhaktapur"],
    services: ["Wiring", "Inverter setup", "Solar maintenance", "Safety audit"],
    specialties: ["Solar inspection", "Emergency wiring", "Panel upgrades"],
    paymentMethods: ["Cash", "Bank transfer", "Fonepay"],
    languages: ["Nepali", "English"],
    credentials: ["Licensed electricians", "Solar audit"],
    owner: { name: "Patan Electric Desk", role: "Dispatch" },
    coordinates: { lat: 27.6785, lng: 85.3162 }
  },
  {
    rank: 9,
    name: "CityCare Dental Clinic",
    slug: "citycare-dental-clinic",
    categories: ["Doctors", "Dentists", "Healthcare"],
    area: "New Baneshwor",
    neighborhood: "New Baneshwor",
    address: "New Baneshwor, Kathmandu",
    phone: "(01) 4476200",
    website: "https://example.com/citycare-dental",
    email: "appointments@citycare.example",
    rating: 4.7,
    reviews: 456,
    price: 3,
    status: "open",
    hoursToday: "Today: 9:00 am - 6:00 pm",
    image: image("photo-1606811971618-4486d14f3f99"),
    quote: "Family dental care with transparent treatment plans and digital x-ray support.",
    amenities: ["Appointment booking", "Digital x-ray", "Family friendly"],
    years: 11,
    verified: true,
    claimed: true,
    distanceKm: 3.3,
    serviceAreas: ["New Baneshwor", "Koteshwor", "Mid Baneshwor"],
    services: ["Dental checkup", "Cleaning", "Root canal", "Digital x-ray", "Family dentistry"],
    specialties: ["Transparent treatment plan", "Child dental care", "Cosmetic dentistry"],
    paymentMethods: ["Cash", "Card", "Insurance support"],
    languages: ["Nepali", "English", "Hindi"],
    credentials: ["Registered clinic", "Digital x-ray", "Appointment booking"],
    owner: { name: "Dr. Mina Gurung", role: "Lead dentist" },
    coordinates: { lat: 27.6905, lng: 85.342 }
  },
  {
    rank: 10,
    name: "Lakefront Inn Pokhara",
    slug: "lakefront-inn-pokhara",
    categories: ["Hotels", "Travel", "Lakeside"],
    area: "Pokhara",
    neighborhood: "Lakeside",
    address: "Lakeside Road, Pokhara",
    phone: "(061) 462884",
    website: "https://example.com/lakefront-inn-pokhara",
    rating: 4.5,
    reviews: 680,
    price: 3,
    status: "open",
    hoursToday: "Open for check-in",
    image: image("photo-1566073771259-6a8506099945"),
    quote: "Clean lake-facing rooms, airport pickup and trekking desk support near Phewa Lake.",
    amenities: ["Airport pickup", "Lake view", "Trekking desk"],
    years: 14,
    verified: true,
    claimed: true,
    distanceKm: 198,
    serviceAreas: ["Lakeside", "Pokhara Airport", "Phewa Lake"],
    services: ["Room booking", "Airport pickup", "Trekking desk", "Laundry"],
    specialties: ["Lake view rooms", "Trek planning", "Airport pickup"],
    paymentMethods: ["Cash", "Card", "Bank transfer"],
    languages: ["Nepali", "English", "Hindi"],
    credentials: ["Hotel desk verified", "Tour support"],
    coupons: [
      {
        title: "Stay 3 nights, pay for 2",
        description: "Applies to standard rooms outside peak trekking weeks.",
        expires: "Aug 31, 2026"
      }
    ],
    owner: { name: "Lakefront Inn Desk", role: "Reservations" },
    coordinates: { lat: 28.2096, lng: 83.9594 }
  },
  {
    rank: 11,
    name: "Legal Line Nepal",
    slug: "legal-line-nepal",
    categories: ["Lawyers", "Professional Services", "Business Registration"],
    area: "Tripureshwor",
    neighborhood: "Tripureshwor",
    address: "Tripureshwor, Kathmandu",
    phone: "(01) 5367721",
    website: "https://example.com/legal-line-nepal",
    rating: 4.4,
    reviews: 144,
    price: 3,
    status: "closed",
    hoursToday: "Today: 10:00 am - 5:00 pm",
    image: image("photo-1589829545856-d10d557cf95f"),
    quote: "Company registration, contract review and civil documentation for local businesses.",
    amenities: ["Business registration", "Contract review", "Online consultation"],
    years: 8,
    verified: true,
    claimed: false,
    distanceKm: 1.6,
    serviceAreas: ["Kathmandu", "Lalitpur", "Online consultation"],
    services: ["Company registration", "Contract review", "Civil documentation", "Online consultation"],
    specialties: ["Business registration", "Contract drafting", "Compliance documentation"],
    paymentMethods: ["Cash", "Bank transfer"],
    languages: ["Nepali", "English"],
    credentials: ["Online consultation", "Document review"],
    owner: { name: "Suman Maharjan", role: "Legal consultant" },
    coordinates: { lat: 27.6948, lng: 85.3159 }
  }
];

export const featuredBusiness = businesses[0];

export const menuSections = [
  {
    title: "Newari Snacks (Khaja)",
    items: [
      ["Samay Baji Set", "Beaten rice, soybean, smoked buff, egg, achar, black peas", "Rs 320"],
      ["Chatamari", "Rice flour crepe with minced meat, egg and ginger", "Rs 280"],
      ["Bara", "Black-eyed pea pancake with egg or meat topping", "Rs 180"],
      ["Wo", "Crispy black bean fritter with timur achar", "Rs 160"]
    ]
  },
  {
    title: "Heritage Tasting Sets",
    items: [
      ["12-course Newari tasting", "Seasonal menu with aila pairing", "Rs 2,400"],
      ["Vegetarian festival set", "Yomari, choila-style mushrooms and chukauni", "Rs 1,650"]
    ]
  }
];

export const questions = [
  {
    title: "Best season for Annapurna Circuit if I want fewer crowds?",
    href: "/questions/trekking-annapurna",
    answers: 12,
    topic: "Travel",
    excerpt:
      "Locals recommend late November for clear views and quieter teahouses, but pack warmer layers for Thorong La."
  },
  {
    title: "Where can I find reliable vegetarian Newari restaurants in Patan?",
    href: "/questions/trekking-annapurna",
    answers: 7,
    topic: "Restaurants",
    excerpt:
      "Community members listed courtyard spots near Mangal Bazaar and several family-run bhatti options."
  },
  {
    title: "Do plumbers in Kathmandu usually bring parts or should I buy first?",
    href: "/questions/trekking-annapurna",
    answers: 18,
    topic: "Home Services",
    excerpt:
      "Most verified plumbers carry common fittings, but photos and measurements make the visit faster."
  }
];

export const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Basic listing for local visibility.",
    features: ["Business profile", "Map pin", "Customer reviews", "Basic analytics"]
  },
  {
    name: "Featured",
    price: "Rs 2,500/mo",
    description: "Higher placement in city and category searches.",
    features: ["Priority placement", "Photo gallery", "Lead notifications", "Review response tools"],
    highlighted: true
  },
  {
    name: "Premium",
    price: "Rs 7,500/mo",
    description: "Growth tools for multi-location businesses.",
    features: ["Sponsored placements", "Deals and offers", "Dedicated support", "Campaign reporting"]
  }
];

export const stats = [
  ["50K+", "verified listings"],
  ["7", "provinces covered"],
  ["1.2M", "monthly searches"],
  ["48K+", "mobile downloads"]
];

export const directoryFeatureChecklist = [
  "Category and location search",
  "Open now and 24-hour filters",
  "Sponsored and verified listings",
  "Ratings, reviews and review writing",
  "Call, website, directions and quote actions",
  "Coupons and local offers",
  "Photo galleries and menu/service details",
  "Business hours and service areas",
  "Claim listing and owner dashboard",
  "Advertising packages and campaign reporting",
  "People/professional search",
  "Map and nearby city discovery",
  "Q&A, FAQs and local guides",
  "Mobile app promotion and account flows"
];

export const popularSearches = [
  "Restaurants near me",
  "Emergency plumbers",
  "Dentists open now",
  "Hotels in Pokhara",
  "Electricians in Lalitpur",
  "Newari food Bhaktapur",
  "Lawyers Kathmandu",
  "Coffee shops Lazimpat"
];

export const peopleProfiles = businesses
  .filter((business) => business.owner)
  .map((business) => ({
    name: business.owner!.name,
    role: business.owner!.role,
    business: business.name,
    location: business.area,
    phone: business.phone,
    href: business.slug === "newa-lahana" ? routes.business : `${routes.search}?q=${encodeURIComponent(business.name)}`
  }));
