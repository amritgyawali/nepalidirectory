export type ComparedBusiness = {
  rank: number;
  name: string;
  area: string;
  rating: number;
  reviews: number;
  price: string;
  bestFor: string;
  phone: string;
  image: string;
  imageAlt: string;
  strengths: string[];
  verdict: string;
};

export type CompareGuideSection = {
  heading: string;
  body: string;
};

export type CompareCategory = {
  title: string;
  seoTitle: string;
  slug: string;
  href: string;
  category: string;
  excerpt: string;
  description: string;
  image: string;
  imageAlt: string;
  updatedAt: string;
  readTime: string;
  keywords: string[];
  criteria: string[];
  guideSections: CompareGuideSection[];
  /** Populated only from qualified production listings; never padded with invented providers. */
  businesses: ComparedBusiness[];
};

type CompareSeed = Pick<
  CompareCategory,
  "slug" | "category" | "title" | "seoTitle" | "description" | "imageAlt" | "criteria"
> & {
  imageId: string;
  location?: string;
};

const image = (id: string, width = "900", height = "560") =>
  `https://images.unsplash.com/${id}?w=${width}&h=${height}&fit=crop&auto=format`;

const seeds: CompareSeed[] = [
  {
    slug: "photography",
    category: "Photography",
    title: "Compare Photography Services in Nepal",
    seoTitle: "Compare Photography Services in Nepal",
    description: "Compare photography services by portfolio, coverage, deliverables, usage rights and delivery terms before requesting a quote.",
    imageId: "photo-1516035069371-29a1b244cc32",
    imageAlt: "Professional camera used for photography services",
    criteria: ["Portfolio quality", "Event experience", "Editing style", "Delivery timeline", "Package clarity"]
  },
  {
    slug: "hotels",
    category: "Hotels",
    title: "Compare Hotels in Nepal",
    seoTitle: "Compare Hotels in Nepal by Location and Stay Needs",
    description: "Compare Nepal hotel options by location, room details, access, cancellation terms and current guest needs before booking.",
    imageId: "photo-1566073771259-6a8506099945",
    imageAlt: "Hotel room with mountain-inspired interior",
    criteria: ["Location", "Room details", "Service information", "Cancellation terms", "Transport access"]
  },
  {
    slug: "restaurants",
    category: "Restaurants",
    title: "Compare Restaurants in Kathmandu",
    seoTitle: "Compare Restaurants in Kathmandu by Occasion",
    description: "Compare Kathmandu restaurants by cuisine, location, dietary fit, group needs, current hours and reservation policy.",
    imageId: "photo-1567188040759-fb8a883dc6d8",
    imageAlt: "Restaurant table with Nepali food",
    location: "Kathmandu",
    criteria: ["Cuisine fit", "Current hours", "Dietary options", "Group seating", "Reservation policy"]
  },
  {
    slug: "home-services",
    category: "Home Services",
    title: "Compare Home Services in Kathmandu",
    seoTitle: "Compare Home Services in Kathmandu Safely",
    description: "Compare Kathmandu home-service providers using response time, written estimates, parts, warranty and service-area checks.",
    imageId: "photo-1581578731548-c64695cc6952",
    imageAlt: "Home repair technician using tools",
    location: "Kathmandu",
    criteria: ["Response time", "Written estimate", "Parts clarity", "Warranty", "Service area"]
  },
  {
    slug: "healthcare-clinics",
    category: "Healthcare",
    title: "Compare Healthcare Clinics in Kathmandu",
    seoTitle: "Compare Healthcare Clinics in Kathmandu",
    description: "Use specialty, professional registration, appointment access, facilities and follow-up questions to compare clinics responsibly.",
    imageId: "photo-1519494026892-80bbd2d6fd0d",
    imageAlt: "Modern healthcare clinic corridor",
    location: "Kathmandu",
    criteria: ["Specialty fit", "Professional registration", "Appointment access", "Facilities", "Follow-up"]
  },
  {
    slug: "contractors",
    category: "Contractors",
    title: "Compare Contractors in Nepal",
    seoTitle: "Compare Contractors in Nepal for Your Project",
    description: "Compare contractors through project scope, written estimates, milestones, materials, insurance and handover terms.",
    imageId: "photo-1503387762-592deb58ef4e",
    imageAlt: "Construction contractor reviewing plans",
    criteria: ["Relevant project history", "Written estimate", "Milestones", "Material responsibility", "Handover warranty"]
  },
  {
    slug: "wedding-venues",
    category: "Wedding Venues",
    title: "Compare Wedding Venues in Nepal",
    seoTitle: "Compare Wedding Venues in Nepal by Event Needs",
    description: "Compare wedding venues by verified capacity, layout, catering rules, access, weather backup and complete quote terms.",
    imageId: "photo-1519741497674-611481863552",
    imageAlt: "Decorated wedding venue with tables and warm lights",
    criteria: ["Verified capacity", "Layout", "Catering rules", "Parking and access", "Weather backup"]
  },
  {
    slug: "travel-agencies",
    category: "Travel Agencies",
    title: "Compare Travel Agencies in Nepal",
    seoTitle: "Compare Travel Agencies in Nepal Responsibly",
    description: "Compare travel agencies by licensing, itinerary clarity, permit support, guide arrangements, emergency plans and quote inclusions.",
    imageId: "photo-1500530855697-b586d89ba3ee",
    imageAlt: "Traveller planning a Nepal trip with a map",
    criteria: ["Licensing", "Itinerary clarity", "Permit support", "Emergency plan", "Quote inclusions"]
  },
  {
    slug: "schools",
    category: "Schools",
    title: "Compare Schools in Nepal",
    seoTitle: "Compare Schools in Nepal for Student Fit",
    description: "Compare schools through curriculum, full fee information, teacher support, transport, facilities and parent communication.",
    imageId: "photo-1580582932707-520aed937b7b",
    imageAlt: "School campus with students walking",
    criteria: ["Curriculum", "Complete fee schedule", "Teacher support", "Transport", "Parent communication"]
  },
  {
    slug: "doctors",
    category: "Doctors",
    title: "Compare Doctors in Kathmandu",
    seoTitle: "Compare Doctors in Kathmandu by Care Need",
    description: "Compare doctors by relevant specialty, Nepal Medical Council registration, appointment access, clinic location and follow-up process.",
    imageId: "photo-1550831107-1553da8c8464",
    imageAlt: "Doctor reviewing patient notes",
    location: "Kathmandu",
    criteria: ["Specialty", "NMC registration", "Appointment access", "Communication", "Follow-up"]
  },
  {
    slug: "plumbers",
    category: "Plumbers",
    title: "Compare Plumbers in Kathmandu",
    seoTitle: "Compare Plumbers in Kathmandu Before Hiring",
    description: "Compare plumbers by fault fit, response time, visit fee, written estimate, replacement parts and workmanship warranty.",
    imageId: "photo-1607472586893-edb57bdc0e39",
    imageAlt: "Plumber repairing a sink pipe",
    location: "Kathmandu",
    criteria: ["Fault fit", "Response time", "Visit fee", "Parts clarity", "Warranty"]
  },
  {
    slug: "electricians",
    category: "Electricians",
    title: "Compare Electricians in Kathmandu",
    seoTitle: "Compare Electricians in Kathmandu Safely",
    description: "Compare electricians using job scope, registration where applicable, safety process, written estimates and warranty information.",
    imageId: "photo-1621905251189-08b45d6a269e",
    imageAlt: "Electrician repairing wiring",
    location: "Kathmandu",
    criteria: ["Job scope", "Credentials", "Safety process", "Written estimate", "Warranty"]
  },
  {
    slug: "beauty-salons",
    category: "Beauty Salons",
    title: "Compare Beauty Salons in Kathmandu",
    seoTitle: "Compare Beauty Salons in Kathmandu",
    description: "Compare salons by listed services, consultation, hygiene questions, portfolio, appointment policy and full package details.",
    imageId: "photo-1560066984-138dadb4c035",
    imageAlt: "Beauty salon styling station",
    location: "Kathmandu",
    criteria: ["Service fit", "Consultation", "Hygiene", "Portfolio", "Appointment terms"]
  },
  {
    slug: "dental-clinics",
    category: "Dental Clinics",
    title: "Compare Dental Clinics in Kathmandu",
    seoTitle: "Compare Dental Clinics in Kathmandu Responsibly",
    description: "Compare dental clinics by treatment fit, practitioner registration, diagnostic process, written cost plan and follow-up care.",
    imageId: "photo-1606811971618-4486d14f3f99",
    imageAlt: "Modern dental clinic treatment room",
    location: "Kathmandu",
    criteria: ["Treatment fit", "Practitioner registration", "Diagnostics", "Written cost plan", "Follow-up"]
  },
  {
    slug: "cafes-lalitpur",
    category: "Cafes",
    title: "Compare Cafes in Lalitpur",
    seoTitle: "Compare Cafes in Lalitpur by Visit Needs",
    description: "Compare Lalitpur cafes by location, seating, current hours, Wi-Fi information, menu fit and meeting needs.",
    imageId: "photo-1554118811-1e0d58224f24",
    imageAlt: "Cafe table with coffee cups and laptop",
    location: "Lalitpur",
    criteria: ["Location", "Seating", "Current hours", "Wi-Fi information", "Menu fit"]
  },
  {
    slug: "wedding-planners",
    category: "Wedding Planners",
    title: "Compare Wedding Planners in Nepal",
    seoTitle: "Compare Wedding Planners in Nepal by Scope",
    description: "Compare wedding planners by scope, vendor relationships, budget controls, contracts, event-day staffing and contingency planning.",
    imageId: "photo-1519225421980-715cb0215aed",
    imageAlt: "Wedding planner arranging decorated event tables",
    criteria: ["Scope", "Vendor process", "Budget controls", "Event-day team", "Contingency plan"]
  },
  {
    slug: "gyms-fitness-centers",
    category: "Gyms",
    title: "Compare Gyms in Kathmandu",
    seoTitle: "Compare Gyms in Kathmandu by Training Needs",
    description: "Compare gyms by equipment, coaching, trial terms, classes, hygiene, current hours and the complete membership cost.",
    imageId: "photo-1534438327276-14e5300c3a48",
    imageAlt: "Modern gym with strength and cardio equipment",
    location: "Kathmandu",
    criteria: ["Equipment", "Coaching", "Trial terms", "Hygiene", "Complete membership cost"]
  }
];

function makeGuideSections(seed: CompareSeed): CompareGuideSection[] {
  const subject = seed.category.toLowerCase();
  const where = seed.location ? ` in ${seed.location}` : " in Nepal";
  return [
    {
      heading: `Define the ${subject} result you need`,
      body: `Write down the location, timing, budget boundary and outcome before contacting ${subject}${where}. A clear brief makes quotes comparable and reduces the chance of choosing on a headline price alone.`
    },
    {
      heading: "Compare the same evidence",
      body: `Use the same shortlist fields for every option: ${seed.criteria.join(", ").toLowerCase()}. Ask providers to confirm anything time-sensitive directly and keep written answers with the quote.`
    },
    {
      heading: "Verify before paying or booking",
      body: "Confirm the business identity, current contact details, what is included, payment milestones, cancellation terms and after-service support. Regulated work also requires checking the appropriate professional or government register."
    },
    {
      heading: "Treat ratings as one signal",
      body: "Read the substance and recency of reviews instead of sorting only by an average score. A complete profile and a detailed written response are useful evidence, but neither replaces direct verification."
    }
  ];
}

export const compareCategories: CompareCategory[] = seeds.map((seed) => ({
  title: seed.title,
  seoTitle: seed.seoTitle,
  slug: seed.slug,
  href: `/compare-business/${seed.slug}`,
  category: seed.category,
  excerpt: seed.description,
  description: seed.description,
  image: image(seed.imageId),
  imageAlt: seed.imageAlt,
  updatedAt: "2026-07-11",
  readTime: "6 min guide",
  keywords: [
    `compare ${seed.category.toLowerCase()} Nepal`,
    `${seed.category.toLowerCase()} checklist`,
    ...(seed.location ? [`${seed.category.toLowerCase()} ${seed.location}`] : [])
  ],
  criteria: seed.criteria,
  guideSections: makeGuideSections(seed),
  businesses: []
}));

export function getCompareCategory(slug: string) {
  return compareCategories.find((category) => category.slug === slug);
}

export function getSortedCompareCategories() {
  return [...compareCategories].sort((a, b) => a.category.localeCompare(b.category));
}
