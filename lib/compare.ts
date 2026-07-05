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
  businesses: ComparedBusiness[];
};

const image = (id: string, width = "900", height = "560") =>
  `https://images.unsplash.com/${id}?w=${width}&h=${height}&fit=crop&auto=format`;

const baseCompareCategories: CompareCategory[] = [
  {
    title: "Compare Photography Businesses in Nepal",
    seoTitle: "Compare Best Photography Businesses in Nepal",
    slug: "photography",
    href: "/compare-business/photography",
    category: "Photography",
    excerpt:
      "Compare wedding, event, portrait and commercial photography studios by style, rating, price and service area.",
    description:
      "Compare top photography businesses in Nepal with ratings, price level, best-use cases, strengths and contact details.",
    image: image("photo-1516035069371-29a1b244cc32"),
    imageAlt: "Professional camera used for photography services",
    updatedAt: "2026-06-27",
    readTime: "5 min compare",
    keywords: ["photography business Nepal", "wedding photographer Kathmandu", "compare photographers Nepal"],
    criteria: ["Portfolio quality", "Event experience", "Editing style", "Delivery timeline", "Transparent packages"],
    businesses: [
      {
        rank: 1,
        name: "Himalayan Frames Studio",
        area: "Kathmandu",
        rating: 4.8,
        reviews: 312,
        price: "Rs 45K+",
        bestFor: "Wedding and engagement shoots",
        phone: "(01) 4429011",
        image: image("photo-1520854221256-17451cc331bf", "600", "420"),
        imageAlt: "Wedding photography session outdoors",
        strengths: ["Candid wedding coverage", "Fast album delivery", "Drone add-ons"],
        verdict: "Best overall option for couples who want polished wedding coverage and predictable delivery."
      },
      {
        rank: 2,
        name: "Patan Portrait House",
        area: "Lalitpur",
        rating: 4.7,
        reviews: 188,
        price: "Rs 12K+",
        bestFor: "Portraits and family sessions",
        phone: "(01) 5528140",
        image: image("photo-1500648767791-00dcc994a43e", "600", "420"),
        imageAlt: "Portrait photography studio session",
        strengths: ["Natural portraits", "Indoor studio", "Family packages"],
        verdict: "A strong choice for families, professional portraits and smaller personal shoots."
      },
      {
        rank: 3,
        name: "Everest Product Visuals",
        area: "Kathmandu",
        rating: 4.6,
        reviews: 96,
        price: "Rs 18K+",
        bestFor: "Product and brand photography",
        phone: "(01) 4442108",
        image: image("photo-1542038784456-1ea8e935640e", "600", "420"),
        imageAlt: "Photographer arranging product photography lighting",
        strengths: ["Ecommerce photos", "Clean lighting", "Retouching support"],
        verdict: "Best for shops and brands that need catalog-ready photos instead of event coverage."
      }
    ]
  },
  {
    title: "Compare Best Hotels in Nepal",
    seoTitle: "Compare Best Hotels in Nepal by Area, Rating and Price",
    slug: "hotels",
    href: "/compare-business/hotels",
    category: "Hotels",
    excerpt:
      "Compare leading hotels for business travel, family stays, mountain views and weekend breaks.",
    description:
      "Compare Nepal hotels by location, rating, price level, guest strengths and best-fit travel use case.",
    image: image("photo-1566073771259-6a8506099945"),
    imageAlt: "Hotel room with mountain-inspired interior",
    updatedAt: "2026-06-27",
    readTime: "6 min compare",
    keywords: ["best hotels Nepal", "compare hotels Kathmandu", "Nepal hotel guide"],
    criteria: ["Location", "Room comfort", "Service consistency", "Breakfast", "Transport access"],
    businesses: [
      {
        rank: 1,
        name: "Yak & Yeti Heritage Hotel",
        area: "Durbar Marg",
        rating: 4.7,
        reviews: 1420,
        price: "Rs 16K+",
        bestFor: "Business stays and central access",
        phone: "(01) 4248999",
        image: image("photo-1551882547-ff40c63fe5fa", "600", "420"),
        imageAlt: "Luxury hotel exterior and pool area",
        strengths: ["Central location", "Business facilities", "Heritage setting"],
        verdict: "Best for travellers who want a central Kathmandu base with dependable hotel services."
      },
      {
        rank: 2,
        name: "Lakeside View Resort",
        area: "Pokhara",
        rating: 4.6,
        reviews: 870,
        price: "Rs 9K+",
        bestFor: "Views and relaxed weekends",
        phone: "(061) 465090",
        image: image("photo-1571896349842-33c89424de2d", "600", "420"),
        imageAlt: "Resort pool with scenic views",
        strengths: ["Lake access", "Mountain views", "Family rooms"],
        verdict: "Best for Pokhara visitors who care more about views and calm than city-center speed."
      },
      {
        rank: 3,
        name: "Thamel Comfort Inn",
        area: "Thamel",
        rating: 4.4,
        reviews: 640,
        price: "Rs 4K+",
        bestFor: "Budget travel and nightlife",
        phone: "(01) 4701020",
        image: image("photo-1564501049412-61c2a3083791", "600", "420"),
        imageAlt: "Comfortable hotel bedroom",
        strengths: ["Walkable area", "Tour desk", "Good value"],
        verdict: "Best value for travellers who want Thamel convenience without premium pricing."
      }
    ]
  },
  {
    title: "Compare Restaurants in Kathmandu",
    seoTitle: "Compare Best Restaurants in Kathmandu",
    slug: "restaurants",
    href: "/compare-business/restaurants",
    category: "Restaurants",
    excerpt:
      "Compare local restaurants by cuisine, atmosphere, reviews, price level and group-friendly features.",
    description:
      "Compare Kathmandu restaurants for Newari food, Thakali sets, cafes and group dining with practical decision notes.",
    image: image("photo-1567188040759-fb8a883dc6d8"),
    imageAlt: "Restaurant table with Nepali food",
    updatedAt: "2026-06-27",
    readTime: "5 min compare",
    keywords: ["compare restaurants Kathmandu", "best restaurants Kathmandu", "Nepali restaurant comparison"],
    criteria: ["Food quality", "Service", "Ambience", "Group seating", "Value"],
    businesses: [
      {
        rank: 1,
        name: "Newa Lahana",
        area: "Bhaktapur",
        rating: 4.7,
        reviews: 842,
        price: "Rs 900+",
        bestFor: "Traditional Newari meals",
        phone: "(01) 6611945",
        image: image("photo-1547592180-85f173990554", "600", "420"),
        imageAlt: "Traditional Nepali food plate",
        strengths: ["Heritage setting", "Newari menu", "Group friendly"],
        verdict: "Best for visitors who want a cultural Newari dining experience."
      },
      {
        rank: 2,
        name: "Bhojan Griha Heritage Restaurant",
        area: "Dilli Bazar",
        rating: 4.6,
        reviews: 1240,
        price: "Rs 2K+",
        bestFor: "Cultural dinner",
        phone: "(01) 4416423",
        image: image("photo-1414235077428-338989a2e8c0", "600", "420"),
        imageAlt: "Elegant restaurant dining room",
        strengths: ["Cultural show", "Set menu", "Large groups"],
        verdict: "Best for formal dinners, groups and travellers who want a complete cultural program."
      },
      {
        rank: 3,
        name: "Himalayan Java Lazimpat",
        area: "Lazimpat",
        rating: 4.5,
        reviews: 980,
        price: "Rs 500+",
        bestFor: "Coffee and work meetings",
        phone: "(01) 4411604",
        image: image("photo-1495474472287-4d71bcdd2085", "600", "420"),
        imageAlt: "Coffee served in a cafe",
        strengths: ["Specialty coffee", "Wi-Fi", "Breakfast"],
        verdict: "Best for casual meetings, coffee breaks and laptop-friendly mornings."
      }
    ]
  },
  {
    title: "Compare Home Service Providers in Kathmandu",
    seoTitle: "Compare Home Services in Kathmandu: Plumbers, Electricians and Repair",
    slug: "home-services",
    href: "/compare-business/home-services",
    category: "Home Services",
    excerpt:
      "Compare plumbers, electricians, cleaners and repair teams by response time, pricing and verified reviews.",
    description:
      "Compare home service providers in Kathmandu by rating, visit cost, strengths, response speed and best-fit repair needs.",
    image: image("photo-1581578731548-c64695cc6952"),
    imageAlt: "Home repair technician using tools",
    updatedAt: "2026-06-27",
    readTime: "5 min compare",
    keywords: ["home services Kathmandu", "compare plumbers Kathmandu", "electrician Kathmandu"],
    criteria: ["Response time", "Visit fee", "Parts clarity", "Warranty", "Customer reviews"],
    businesses: [
      {
        rank: 1,
        name: "Kathmandu Quick Fix",
        area: "Kathmandu Valley",
        rating: 4.8,
        reviews: 420,
        price: "Rs 800 visit",
        bestFor: "Urgent plumbing and electrical calls",
        phone: "980-110-2211",
        image: image("photo-1621905251189-08b45d6a269e", "600", "420"),
        imageAlt: "Electrician repairing wiring",
        strengths: ["Same-day visits", "Plumbing and electrical", "Parts coordination"],
        verdict: "Best overall option when response speed matters more than the lowest visit fee."
      },
      {
        rank: 2,
        name: "Valley Clean & Care",
        area: "Lalitpur",
        rating: 4.6,
        reviews: 260,
        price: "Rs 2.5K+",
        bestFor: "Deep cleaning and move-in cleaning",
        phone: "980-440-1188",
        image: image("photo-1527515637462-cff94eecc1ac", "600", "420"),
        imageAlt: "Cleaner preparing home service supplies",
        strengths: ["Deep cleaning", "Scheduled teams", "Supplies included"],
        verdict: "Best for planned cleaning jobs where team size and supplies are important."
      },
      {
        rank: 3,
        name: "PipeLine Nepal",
        area: "Bhaktapur",
        rating: 4.5,
        reviews: 190,
        price: "Rs 700 visit",
        bestFor: "Plumbing-only repairs",
        phone: "984-220-7710",
        image: image("photo-1607472586893-edb57bdc0e39", "600", "420"),
        imageAlt: "Plumber repairing a sink pipe",
        strengths: ["Leak repairs", "Bathroom fittings", "Lower visit fee"],
        verdict: "Best for straightforward plumbing jobs and budget-conscious homeowners."
      }
    ]
  },
  {
    title: "Compare Healthcare Clinics in Kathmandu",
    seoTitle: "Compare Healthcare Clinics in Kathmandu",
    slug: "healthcare-clinics",
    href: "/compare-business/healthcare-clinics",
    category: "Healthcare",
    excerpt:
      "Compare clinics by specialty, appointment access, report timing, patient reviews and location.",
    description:
      "Compare Kathmandu healthcare clinics by specialty, rating, consultation cost, best-use case and patient support.",
    image: image("photo-1519494026892-80bbd2d6fd0d"),
    imageAlt: "Modern healthcare clinic corridor",
    updatedAt: "2026-06-27",
    readTime: "6 min compare",
    keywords: ["clinics Kathmandu", "compare healthcare Kathmandu", "best clinic Nepal"],
    criteria: ["Specialty fit", "Appointment access", "Report timing", "Location", "Patient support"],
    businesses: [
      {
        rank: 1,
        name: "CityCare Multi-Speciality Clinic",
        area: "Kamaladi",
        rating: 4.7,
        reviews: 530,
        price: "Rs 900 consult",
        bestFor: "General and specialist appointments",
        phone: "(01) 5550198",
        image: image("photo-1504813184591-01572f98c85f", "600", "420"),
        imageAlt: "Doctor consultation room",
        strengths: ["Multiple specialties", "Digital reports", "Central access"],
        verdict: "Best for families who want many specialties under one clinic."
      },
      {
        rank: 2,
        name: "Patan Family Clinic",
        area: "Patan",
        rating: 4.6,
        reviews: 310,
        price: "Rs 700 consult",
        bestFor: "Family medicine",
        phone: "(01) 5527712",
        image: image("photo-1584515933487-779824d29309", "600", "420"),
        imageAlt: "Healthcare worker in a clinic",
        strengths: ["Family doctors", "Follow-up support", "Neighborhood access"],
        verdict: "Best for routine care, follow-ups and families based near Lalitpur."
      },
      {
        rank: 3,
        name: "Boudha Diagnostics Center",
        area: "Boudha",
        rating: 4.5,
        reviews: 220,
        price: "Rs 500+ tests",
        bestFor: "Lab tests and imaging",
        phone: "(01) 4918800",
        image: image("photo-1579154204601-01588f351e67", "600", "420"),
        imageAlt: "Medical diagnostic equipment",
        strengths: ["Lab reports", "Imaging", "Early appointments"],
        verdict: "Best for diagnostics when report timing and location are the priority."
      }
    ]
  },
  {
    title: "Compare Contractors in Nepal",
    seoTitle: "Compare Contractors in Nepal: Renovation, Building and Repair",
    slug: "contractors",
    href: "/compare-business/contractors",
    category: "Contractors",
    excerpt:
      "Compare construction and renovation contractors by project type, documentation, reviews, pricing and strengths.",
    description:
      "Compare Nepal contractors for renovation, structural work and finishing projects using ratings, price ranges and practical selection criteria.",
    image: image("photo-1503387762-592deb58ef4e"),
    imageAlt: "Construction contractor reviewing plans",
    updatedAt: "2026-06-27",
    readTime: "6 min compare",
    keywords: ["contractors Nepal", "compare contractors Kathmandu", "renovation contractor Nepal"],
    criteria: ["Project history", "Written estimates", "Timeline clarity", "Material handling", "Warranty"],
    businesses: [
      {
        rank: 1,
        name: "Summit Build Nepal",
        area: "Kathmandu",
        rating: 4.7,
        reviews: 145,
        price: "Quote based",
        bestFor: "Full home renovation",
        phone: "980-330-7711",
        image: image("photo-1504307651254-35680f356dfd", "600", "420"),
        imageAlt: "Construction site with workers",
        strengths: ["Detailed estimates", "Renovation teams", "Timeline reporting"],
        verdict: "Best for homeowners who need a managed renovation instead of separate small vendors."
      },
      {
        rank: 2,
        name: "Patan Finish Works",
        area: "Lalitpur",
        rating: 4.6,
        reviews: 118,
        price: "Rs 80K+",
        bestFor: "Interior finishing",
        phone: "984-550-1120",
        image: image("photo-1600585154340-be6161a56a0c", "600", "420"),
        imageAlt: "Finished modern home interior",
        strengths: ["Painting", "Flooring", "Interior detailing"],
        verdict: "Best for finishing upgrades after structural work is already complete."
      },
      {
        rank: 3,
        name: "Valley Repair Contractors",
        area: "Bhaktapur",
        rating: 4.4,
        reviews: 92,
        price: "Rs 25K+",
        bestFor: "Small repairs and waterproofing",
        phone: "981-880-4419",
        image: image("photo-1600566753190-17f0baa2a6c3", "600", "420"),
        imageAlt: "Home exterior repair work",
        strengths: ["Waterproofing", "Small teams", "Budget repairs"],
        verdict: "Best for targeted repairs where a large renovation contractor would be too expensive."
      }
    ]
  },
  {
    title: "Compare Wedding Venues in Nepal",
    seoTitle: "Compare Wedding Venues in Nepal by Price, Capacity and Location",
    slug: "wedding-venues",
    href: "/compare-business/wedding-venues",
    category: "Wedding Venues",
    excerpt: "Compare banquet halls, garden venues and heritage event spaces by capacity, location, price and service fit.",
    description:
      "Compare wedding venues in Nepal with ratings, capacity notes, price ranges, best-use cases and planning strengths.",
    image: image("photo-1519741497674-611481863552"),
    imageAlt: "Decorated wedding venue with tables and warm lights",
    updatedAt: "2026-06-27",
    readTime: "6 min compare",
    keywords: ["wedding venues Nepal", "wedding venue Kathmandu", "compare banquet halls Nepal"],
    criteria: ["Guest capacity", "Catering", "Parking", "Decor support", "Location"],
    businesses: [
      {
        rank: 1,
        name: "Heritage Garden Events",
        area: "Lalitpur",
        rating: 4.8,
        reviews: 410,
        price: "Rs 180K+",
        bestFor: "Outdoor wedding receptions",
        phone: "(01) 5527001",
        image: image("photo-1464366400600-7168b8af9bc3", "600", "420"),
        imageAlt: "Outdoor wedding tables in a garden venue",
        strengths: ["Garden setup", "Decor vendors", "Photo-friendly spaces"],
        verdict: "Best for couples who want an outdoor reception with strong photography opportunities."
      },
      {
        rank: 2,
        name: "Durbar Banquet Hall",
        area: "Kathmandu",
        rating: 4.6,
        reviews: 360,
        price: "Rs 130K+",
        bestFor: "Large family ceremonies",
        phone: "(01) 4411200",
        image: image("photo-1519167758481-83f550bb49b3", "600", "420"),
        imageAlt: "Large decorated banquet hall",
        strengths: ["Large capacity", "Catering packages", "Central access"],
        verdict: "Best for large gatherings where capacity and catering coordination matter most."
      },
      {
        rank: 3,
        name: "Lakeside Ceremony House",
        area: "Pokhara",
        rating: 4.5,
        reviews: 190,
        price: "Rs 95K+",
        bestFor: "Destination weddings",
        phone: "(061) 466118",
        image: image("photo-1505236858219-8359eb29e329", "600", "420"),
        imageAlt: "Wedding ceremony seating near water",
        strengths: ["Lake views", "Guest rooms nearby", "Smaller packages"],
        verdict: "Best for smaller destination weddings around Pokhara."
      }
    ]
  },
  {
    title: "Compare Travel Agencies in Nepal",
    seoTitle: "Compare Travel Agencies in Nepal for Trekking, Tours and Tickets",
    slug: "travel-agencies",
    href: "/compare-business/travel-agencies",
    category: "Travel Agencies",
    excerpt: "Compare travel agencies for trekking, tour planning, flights, vehicles, permits and family itineraries.",
    description:
      "Compare Nepal travel agencies by specialization, reviews, price level, support quality and best-fit travel use case.",
    image: image("photo-1500530855697-b586d89ba3ee"),
    imageAlt: "Traveller planning a Nepal trip with a map",
    updatedAt: "2026-06-27",
    readTime: "6 min compare",
    keywords: ["travel agencies Nepal", "trekking agency Kathmandu", "compare tour operators Nepal"],
    criteria: ["Permit support", "Guide quality", "Itinerary clarity", "Emergency support", "Transparent pricing"],
    businesses: [
      {
        rank: 1,
        name: "Himalayan Route Experts",
        area: "Thamel",
        rating: 4.8,
        reviews: 520,
        price: "Rs 35K+",
        bestFor: "Trekking packages",
        phone: "(01) 4703300",
        image: image("photo-1500534314209-a25ddb2bd429", "600", "420"),
        imageAlt: "Mountain trekking route in Nepal",
        strengths: ["Licensed guides", "Permit handling", "Altitude planning"],
        verdict: "Best for trekkers who need route planning, permits and guide coordination."
      },
      {
        rank: 2,
        name: "Nepal Family Tours",
        area: "Kathmandu",
        rating: 4.6,
        reviews: 280,
        price: "Rs 22K+",
        bestFor: "Family and culture tours",
        phone: "(01) 4420900",
        image: image("photo-1528127269322-539801943592", "600", "420"),
        imageAlt: "Family walking through a travel destination",
        strengths: ["Private vehicles", "Family pacing", "City guides"],
        verdict: "Best for families who want comfortable pacing and local guide support."
      },
      {
        rank: 3,
        name: "Pokhara Adventure Desk",
        area: "Pokhara",
        rating: 4.5,
        reviews: 230,
        price: "Rs 8K+",
        bestFor: "Short adventure bookings",
        phone: "(061) 465889",
        image: image("photo-1507525428034-b723cf961d3e", "600", "420"),
        imageAlt: "Adventure travel planning desk",
        strengths: ["Paragliding", "Day trips", "Quick bookings"],
        verdict: "Best for travellers already in Pokhara who want short activities and quick confirmations."
      }
    ]
  },
  {
    title: "Compare Schools in Nepal",
    seoTitle: "Compare Schools in Nepal by Location, Curriculum and Facilities",
    slug: "schools",
    href: "/compare-business/schools",
    category: "Schools",
    excerpt: "Compare schools by curriculum, location, transport, facilities, parent reviews and admission fit.",
    description:
      "Compare schools in Nepal with ratings, admission notes, facilities, best-fit student needs and parent decision criteria.",
    image: image("photo-1580582932707-520aed937b7b"),
    imageAlt: "School campus with students walking",
    updatedAt: "2026-06-27",
    readTime: "7 min compare",
    keywords: ["schools Nepal", "best schools Kathmandu", "compare schools Nepal"],
    criteria: ["Curriculum", "Teacher support", "Transport", "Facilities", "Parent communication"],
    businesses: [
      {
        rank: 1,
        name: "Valley Scholars Academy",
        area: "Kathmandu",
        rating: 4.7,
        reviews: 310,
        price: "Admission based",
        bestFor: "Balanced academics and activities",
        phone: "(01) 4432100",
        image: image("photo-1580582932707-520aed937b7b", "600", "420"),
        imageAlt: "School classroom with desks",
        strengths: ["Academic support", "Clubs", "Transport routes"],
        verdict: "Best overall for families seeking a balanced school environment in Kathmandu."
      },
      {
        rank: 2,
        name: "Patan Creative School",
        area: "Lalitpur",
        rating: 4.6,
        reviews: 210,
        price: "Admission based",
        bestFor: "Creative learning",
        phone: "(01) 5522209",
        image: image("photo-1509062522246-3755977927d7", "600", "420"),
        imageAlt: "Students learning in a classroom",
        strengths: ["Project work", "Arts programs", "Smaller classes"],
        verdict: "Best for parents who value creative learning and smaller classroom settings."
      },
      {
        rank: 3,
        name: "Pokhara Lakeside School",
        area: "Pokhara",
        rating: 4.5,
        reviews: 160,
        price: "Admission based",
        bestFor: "Pokhara families",
        phone: "(061) 466200",
        image: image("photo-1577896851231-70ef18881754", "600", "420"),
        imageAlt: "Teacher helping students in class",
        strengths: ["Community feel", "Sports", "Parent access"],
        verdict: "Best for families looking for a practical school option near Lakeside and central Pokhara."
      }
    ]
  },
  {
    title: "Compare Doctors in Kathmandu",
    seoTitle: "Compare Doctors in Kathmandu by Specialty, Reviews and Availability",
    slug: "doctors",
    href: "/compare-business/doctors",
    category: "Doctors",
    excerpt: "Compare doctors by specialty, appointment access, clinic location, consultation fee and patient reviews.",
    description:
      "Compare doctors in Kathmandu using specialty fit, ratings, patient reviews, consultation price and availability signals.",
    image: image("photo-1550831107-1553da8c8464"),
    imageAlt: "Doctor reviewing patient notes",
    updatedAt: "2026-06-27",
    readTime: "6 min compare",
    keywords: ["doctors Kathmandu", "best doctors Nepal", "compare doctors Kathmandu"],
    criteria: ["Specialty", "Appointment access", "Patient communication", "Clinic location", "Follow-up"],
    businesses: [
      {
        rank: 1,
        name: "Dr. Anil Shrestha Clinic",
        area: "Kamaladi",
        rating: 4.8,
        reviews: 280,
        price: "Rs 900 consult",
        bestFor: "General medicine",
        phone: "(01) 5552199",
        image: image("photo-1537368910025-700350fe46c7", "600", "420"),
        imageAlt: "Doctor consulting with a patient",
        strengths: ["Clear explanations", "Follow-up support", "Central clinic"],
        verdict: "Best for general consultation and follow-up care in central Kathmandu."
      },
      {
        rank: 2,
        name: "Patan Child Health",
        area: "Patan",
        rating: 4.7,
        reviews: 230,
        price: "Rs 800 consult",
        bestFor: "Pediatric care",
        phone: "(01) 5521880",
        image: image("photo-1584515933487-779824d29309", "600", "420"),
        imageAlt: "Healthcare worker in a clinic",
        strengths: ["Child-friendly visits", "Vaccination guidance", "Parent communication"],
        verdict: "Best for families looking for pediatric visits and routine child health support."
      },
      {
        rank: 3,
        name: "Boudha Ortho Care",
        area: "Boudha",
        rating: 4.5,
        reviews: 150,
        price: "Rs 1K consult",
        bestFor: "Orthopedic checks",
        phone: "(01) 4917000",
        image: image("photo-1579684385127-1ef15d508118", "600", "420"),
        imageAlt: "Doctor checking medical scan",
        strengths: ["Joint pain", "Sports injuries", "Imaging referrals"],
        verdict: "Best for orthopedic screening and referral support around Boudha."
      }
    ]
  },
  {
    title: "Compare Plumbers in Kathmandu",
    seoTitle: "Compare Plumbers in Kathmandu by Response Time, Price and Reviews",
    slug: "plumbers",
    href: "/compare-business/plumbers",
    category: "Plumbers",
    excerpt: "Compare plumbers for leaks, bathroom fittings, water tanks, emergency repairs and regular maintenance.",
    description:
      "Compare Kathmandu plumbers by visit fee, response speed, repair strengths, ratings, reviews and service area.",
    image: image("photo-1607472586893-edb57bdc0e39"),
    imageAlt: "Plumber repairing a sink pipe",
    updatedAt: "2026-06-27",
    readTime: "5 min compare",
    keywords: ["plumbers Kathmandu", "emergency plumber Nepal", "compare plumbers Kathmandu"],
    criteria: ["Response time", "Visit fee", "Leak repair", "Parts clarity", "Warranty"],
    businesses: [
      {
        rank: 1,
        name: "Rapid Pipe Kathmandu",
        area: "Kathmandu Valley",
        rating: 4.8,
        reviews: 360,
        price: "Rs 700 visit",
        bestFor: "Emergency leaks",
        phone: "980-770-2200",
        image: image("photo-1607472586893-edb57bdc0e39", "600", "420"),
        imageAlt: "Pipe repair under a sink",
        strengths: ["Same-day repair", "Leak diagnosis", "Parts sourcing"],
        verdict: "Best for urgent water leaks where fast response is the main priority."
      },
      {
        rank: 2,
        name: "Bathroom Fix Nepal",
        area: "Lalitpur",
        rating: 4.6,
        reviews: 220,
        price: "Rs 650 visit",
        bestFor: "Bathroom fittings",
        phone: "984-330-1190",
        image: image("photo-1585704032915-c3400ca199e7", "600", "420"),
        imageAlt: "Bathroom sink and fittings",
        strengths: ["Tap fittings", "Shower repair", "Lower visit fee"],
        verdict: "Best for planned bathroom fixture repairs and smaller plumbing jobs."
      },
      {
        rank: 3,
        name: "TankLine Services",
        area: "Bhaktapur",
        rating: 4.5,
        reviews: 140,
        price: "Rs 900 visit",
        bestFor: "Water tank and pipe systems",
        phone: "981-600-4400",
        image: image("photo-1616401784845-180882ba9ba8", "600", "420"),
        imageAlt: "Water pipe installation work",
        strengths: ["Tank checks", "Pipe replacement", "Maintenance visits"],
        verdict: "Best for water tank and building pipe system maintenance."
      }
    ]
  },
  {
    title: "Compare Electricians in Kathmandu",
    seoTitle: "Compare Electricians in Kathmandu by Safety, Price and Reviews",
    slug: "electricians",
    href: "/compare-business/electricians",
    category: "Electricians",
    excerpt: "Compare electricians for wiring, inverter setup, lighting, breaker issues and urgent electrical repairs.",
    description:
      "Compare Kathmandu electricians by safety practices, visit fee, response speed, ratings, reviews and service strengths.",
    image: image("photo-1621905251189-08b45d6a269e"),
    imageAlt: "Electrician repairing wiring",
    updatedAt: "2026-06-27",
    readTime: "5 min compare",
    keywords: ["electricians Kathmandu", "compare electricians Nepal", "emergency electrician Kathmandu"],
    criteria: ["Safety practice", "Response time", "Wiring skill", "Visit fee", "Warranty"],
    businesses: [
      {
        rank: 1,
        name: "SafeWire Kathmandu",
        area: "Kathmandu",
        rating: 4.8,
        reviews: 330,
        price: "Rs 850 visit",
        bestFor: "Wiring and breaker faults",
        phone: "980-880-3311",
        image: image("photo-1621905251189-08b45d6a269e", "600", "420"),
        imageAlt: "Electrician working on a panel",
        strengths: ["Safety checks", "Breaker repair", "Same-day visits"],
        verdict: "Best for wiring and breaker problems where safety needs to come first."
      },
      {
        rank: 2,
        name: "LightPro Nepal",
        area: "Lalitpur",
        rating: 4.6,
        reviews: 200,
        price: "Rs 700 visit",
        bestFor: "Lighting and fixtures",
        phone: "984-990-1200",
        image: image("photo-1513506003901-1e6a229e2d15", "600", "420"),
        imageAlt: "Modern ceiling lighting installation",
        strengths: ["Lighting setup", "Fixture repair", "Interior coordination"],
        verdict: "Best for lighting upgrades and fixture installation in homes or offices."
      },
      {
        rank: 3,
        name: "Inverter Care Valley",
        area: "Kathmandu Valley",
        rating: 4.5,
        reviews: 170,
        price: "Rs 1K visit",
        bestFor: "Inverter and backup power",
        phone: "981-440-2200",
        image: image("photo-1581092160607-ee22621dd758", "600", "420"),
        imageAlt: "Technician checking electrical equipment",
        strengths: ["Inverter checks", "Backup power", "Battery guidance"],
        verdict: "Best for homes that need inverter troubleshooting and backup power advice."
      }
    ]
  },
  {
    title: "Compare Beauty Salons in Kathmandu",
    seoTitle: "Compare Beauty Salons in Kathmandu by Services, Rating and Price",
    slug: "beauty-salons",
    href: "/compare-business/beauty-salons",
    category: "Beauty Salons",
    excerpt: "Compare salons for hair, bridal makeup, facials, nails, grooming packages and appointment convenience.",
    description:
      "Compare beauty salons in Kathmandu by services, ratings, reviews, price ranges, location and best-fit beauty needs.",
    image: image("photo-1560066984-138dadb4c035"),
    imageAlt: "Beauty salon styling station",
    updatedAt: "2026-06-27",
    readTime: "5 min compare",
    keywords: ["beauty salons Kathmandu", "best salon Nepal", "compare salons Kathmandu"],
    criteria: ["Service range", "Hygiene", "Stylist experience", "Bridal packages", "Appointment access"],
    businesses: [
      {
        rank: 1,
        name: "Glow Studio Kathmandu",
        area: "Lazimpat",
        rating: 4.8,
        reviews: 420,
        price: "Rs 2K+",
        bestFor: "Hair and makeup packages",
        phone: "(01) 4419090",
        image: image("photo-1560066984-138dadb4c035", "600", "420"),
        imageAlt: "Hair stylist working in a salon",
        strengths: ["Hair styling", "Makeup", "Appointment system"],
        verdict: "Best overall salon for reliable hair and makeup appointments in central Kathmandu."
      },
      {
        rank: 2,
        name: "Patan Bridal Beauty",
        area: "Patan",
        rating: 4.7,
        reviews: 240,
        price: "Rs 12K+",
        bestFor: "Bridal makeup",
        phone: "(01) 5529900",
        image: image("photo-1487412947147-5cebf100ffc2", "600", "420"),
        imageAlt: "Makeup artist applying bridal makeup",
        strengths: ["Bridal packages", "Trial sessions", "Saree draping"],
        verdict: "Best for brides who need package planning and trial makeup before the event."
      },
      {
        rank: 3,
        name: "Nail & Skin Lounge",
        area: "Jhamsikhel",
        rating: 4.5,
        reviews: 190,
        price: "Rs 1.5K+",
        bestFor: "Nails and skincare",
        phone: "(01) 5527701",
        image: image("photo-1604654894610-df63bc536371", "600", "420"),
        imageAlt: "Nail salon manicure service",
        strengths: ["Nail art", "Facials", "Clean setup"],
        verdict: "Best for nail and skincare appointments in the Jhamsikhel area."
      }
    ]
  },
  {
    title: "Compare Dental Clinics in Kathmandu",
    seoTitle: "Compare Dental Clinics in Kathmandu by Treatment, Cost and Reviews",
    slug: "dental-clinics",
    href: "/compare-business/dental-clinics",
    category: "Dental Clinics",
    excerpt: "Compare dental clinics for cleaning, braces, root canals, implants, cosmetic dentistry and emergency tooth pain.",
    description:
      "Compare Kathmandu dental clinics by treatment fit, consultation cost, dentist experience, equipment, reviews and follow-up care.",
    image: image("photo-1606811971618-4486d14f3f99"),
    imageAlt: "Modern dental clinic treatment room",
    updatedAt: "2026-06-27",
    readTime: "6 min compare",
    keywords: ["dental clinics Kathmandu", "compare dentists Kathmandu", "best dentist Nepal"],
    criteria: ["Treatment fit", "Dentist experience", "Hygiene", "Cost clarity", "Follow-up care"],
    businesses: [
      {
        rank: 1,
        name: "SmileCare Kathmandu",
        area: "Kamaladi",
        rating: 4.8,
        reviews: 390,
        price: "Rs 800 consult",
        bestFor: "Family dental care and root canals",
        phone: "(01) 5554120",
        image: image("photo-1629909613654-28e377c37b09", "600", "420"),
        imageAlt: "Dentist checking a patient in a dental chair",
        strengths: ["Root canals", "Digital x-rays", "Clear estimates"],
        verdict: "Best overall for families who want broad dental care with clear treatment planning."
      },
      {
        rank: 2,
        name: "Patan Ortho Dental",
        area: "Patan",
        rating: 4.7,
        reviews: 250,
        price: "Rs 1K consult",
        bestFor: "Braces and aligner planning",
        phone: "(01) 5526012",
        image: image("photo-1609840114035-3c981b782dfe", "600", "420"),
        imageAlt: "Dental braces treatment tools",
        strengths: ["Orthodontics", "Monthly follow-up", "Teen treatment"],
        verdict: "Best for patients comparing braces, aligners and longer orthodontic treatment."
      },
      {
        rank: 3,
        name: "Boudha Dental Relief",
        area: "Boudha",
        rating: 4.5,
        reviews: 170,
        price: "Rs 700 consult",
        bestFor: "Emergency tooth pain",
        phone: "(01) 4914420",
        image: image("photo-1606811841689-23dfddce3e95", "600", "420"),
        imageAlt: "Dental instruments prepared for a procedure",
        strengths: ["Same-day appointments", "Tooth pain", "Basic procedures"],
        verdict: "Best for urgent dental checks when speed and practical access matter most."
      }
    ]
  },
  {
    title: "Compare Cafes in Lalitpur",
    seoTitle: "Compare Cafes in Lalitpur for Work, Coffee and Meetings",
    slug: "cafes-lalitpur",
    href: "/compare-business/cafes-lalitpur",
    category: "Cafes",
    excerpt: "Compare Lalitpur cafes by Wi-Fi, seating, coffee, food, parking, meeting comfort and work-friendly details.",
    description:
      "Compare cafes in Lalitpur and Patan by coffee quality, Wi-Fi, quiet seating, outlet access, food menu and meeting suitability.",
    image: image("photo-1554118811-1e0d58224f24"),
    imageAlt: "Cafe table with coffee cups and laptop",
    updatedAt: "2026-06-27",
    readTime: "5 min compare",
    keywords: ["cafes Lalitpur", "work cafes Patan", "compare cafes Jhamsikhel"],
    criteria: ["Wi-Fi", "Quiet seating", "Coffee quality", "Food menu", "Parking"],
    businesses: [
      {
        rank: 1,
        name: "Jhamsikhel Work Cafe",
        area: "Jhamsikhel",
        rating: 4.7,
        reviews: 460,
        price: "Rs 350+",
        bestFor: "Laptop work and client meetings",
        phone: "(01) 5524418",
        image: image("photo-1495474472287-4d71bcdd2085", "600", "420"),
        imageAlt: "Coffee cup on a cafe table",
        strengths: ["Stable Wi-Fi", "Outlet seating", "Meeting tables"],
        verdict: "Best overall for people who need a dependable work-friendly cafe in Lalitpur."
      },
      {
        rank: 2,
        name: "Patan Courtyard Coffee",
        area: "Patan",
        rating: 4.6,
        reviews: 310,
        price: "Rs 300+",
        bestFor: "Quiet coffee near heritage lanes",
        phone: "(01) 5523340",
        image: image("photo-1509042239860-f550ce710b93", "600", "420"),
        imageAlt: "Latte served in a warm cafe",
        strengths: ["Quiet mornings", "Courtyard seating", "Local desserts"],
        verdict: "Best for relaxed conversations and slower coffee meetings around Patan."
      },
      {
        rank: 3,
        name: "Pulchowk Brew Desk",
        area: "Pulchowk",
        rating: 4.5,
        reviews: 240,
        price: "Rs 280+",
        bestFor: "Quick meetings and breakfast",
        phone: "(01) 5440910",
        image: image("photo-1521017432531-fbd92d768814", "600", "420"),
        imageAlt: "Cafe counter with breakfast and coffee",
        strengths: ["Fast service", "Breakfast menu", "Central access"],
        verdict: "Best for short meetings where location and speed are more important than long work sessions."
      }
    ]
  },
  {
    title: "Compare Wedding Planners in Nepal",
    seoTitle: "Compare Wedding Planners in Nepal by Budget, Decor and Vendor Network",
    slug: "wedding-planners",
    href: "/compare-business/wedding-planners",
    category: "Wedding Planners",
    excerpt: "Compare planners for venue coordination, decor, family logistics, photography, catering and event-day management.",
    description:
      "Compare wedding planners in Nepal by event size, decor style, vendor network, budget control, coordination strength and review signals.",
    image: image("photo-1519225421980-715cb0215aed"),
    imageAlt: "Wedding planner arranging decorated event tables",
    updatedAt: "2026-06-27",
    readTime: "6 min compare",
    keywords: ["wedding planners Nepal", "compare wedding planner Kathmandu", "Nepal event planners"],
    criteria: ["Vendor network", "Budget control", "Decor planning", "Event-day team", "Family coordination"],
    businesses: [
      {
        rank: 1,
        name: "Mandap Events Nepal",
        area: "Kathmandu",
        rating: 4.8,
        reviews: 280,
        price: "Rs 120K+",
        bestFor: "Full wedding planning",
        phone: "(01) 4439002",
        image: image("photo-1464366400600-7168b8af9bc3", "600", "420"),
        imageAlt: "Outdoor wedding reception setup",
        strengths: ["Venue coordination", "Decor vendors", "Timeline control"],
        verdict: "Best overall for families who want one team managing the full wedding plan."
      },
      {
        rank: 2,
        name: "Patan Decor Collective",
        area: "Lalitpur",
        rating: 4.6,
        reviews: 190,
        price: "Rs 70K+",
        bestFor: "Decor-focused ceremonies",
        phone: "(01) 5527810",
        image: image("photo-1519167758481-83f550bb49b3", "600", "420"),
        imageAlt: "Decorated banquet hall for a wedding",
        strengths: ["Stage decor", "Floral work", "Smaller packages"],
        verdict: "Best for couples who already have a venue but need stronger decor and setup planning."
      },
      {
        rank: 3,
        name: "Pokhara Ceremony Team",
        area: "Pokhara",
        rating: 4.5,
        reviews: 150,
        price: "Rs 90K+",
        bestFor: "Destination weddings",
        phone: "(061) 465771",
        image: image("photo-1505236858219-8359eb29e329", "600", "420"),
        imageAlt: "Wedding seating beside a scenic lake",
        strengths: ["Destination logistics", "Guest coordination", "Photo locations"],
        verdict: "Best for smaller Pokhara weddings where guest movement and venue coordination matter."
      }
    ]
  },
  {
    title: "Compare Gyms and Fitness Centers in Kathmandu",
    seoTitle: "Compare Gyms in Kathmandu by Equipment, Trainers and Membership Cost",
    slug: "gyms-fitness-centers",
    href: "/compare-business/gyms-fitness-centers",
    category: "Gyms",
    excerpt: "Compare gyms by equipment, trainers, classes, opening hours, parking, hygiene and membership value.",
    description:
      "Compare Kathmandu gyms and fitness centers by equipment quality, trainer support, class schedule, hygiene, location and membership cost.",
    image: image("photo-1534438327276-14e5300c3a48"),
    imageAlt: "Modern gym with strength and cardio equipment",
    updatedAt: "2026-06-27",
    readTime: "5 min compare",
    keywords: ["gyms Kathmandu", "fitness centers Nepal", "compare gyms Kathmandu"],
    criteria: ["Equipment", "Trainer support", "Classes", "Hygiene", "Opening hours"],
    businesses: [
      {
        rank: 1,
        name: "Valley Strength Club",
        area: "Lazimpat",
        rating: 4.8,
        reviews: 520,
        price: "Rs 5K/month",
        bestFor: "Strength training and coaching",
        phone: "(01) 4417070",
        image: image("photo-1571902943202-507ec2618e8f", "600", "420"),
        imageAlt: "Gym weights and training equipment",
        strengths: ["Strength equipment", "Personal trainers", "Early hours"],
        verdict: "Best overall for members who want coaching, equipment depth and a central location."
      },
      {
        rank: 2,
        name: "Patan Fit Studio",
        area: "Patan",
        rating: 4.6,
        reviews: 260,
        price: "Rs 3.5K/month",
        bestFor: "Classes and beginner routines",
        phone: "(01) 5524019",
        image: image("photo-1518611012118-696072aa579a", "600", "420"),
        imageAlt: "Fitness class in a studio",
        strengths: ["Group classes", "Beginner plans", "Clean studio"],
        verdict: "Best for beginners who want guided classes and a less intimidating gym environment."
      },
      {
        rank: 3,
        name: "Boudha Cardio House",
        area: "Boudha",
        rating: 4.4,
        reviews: 180,
        price: "Rs 2.8K/month",
        bestFor: "Budget cardio and general fitness",
        phone: "(01) 4916610",
        image: image("photo-1540497077202-7c8a3999166f", "600", "420"),
        imageAlt: "Cardio machines in a fitness center",
        strengths: ["Cardio machines", "Lower price", "Evening access"],
        verdict: "Best for budget-conscious members who need basic equipment and flexible hours."
      }
    ]
  }
];

const extraImageIds = [
  "photo-1497366754035-f200968a6e72",
  "photo-1521737604893-d14cc237f11d",
  "photo-1556740738-b6a63e27c4df",
  "photo-1556761175-b413da4baf72"
];

const cityOptions = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara"];

function buildExtraBusiness(category: CompareCategory, index: number): ComparedBusiness {
  const area = cityOptions[index % cityOptions.length];
  const firstCriterion = category.criteria[index % category.criteria.length] ?? "Service quality";
  const secondCriterion = category.criteria[(index + 1) % category.criteria.length] ?? "Customer fit";
  const thirdCriterion = category.criteria[(index + 2) % category.criteria.length] ?? "Reliable support";
  const businessKinds = ["Verified Choice", "Local Expert", "Premium Desk", "Value Partner"];
  const bestFor = [
    `Customers prioritizing ${firstCriterion.toLowerCase()}`,
    `Shortlists that need ${secondCriterion.toLowerCase()}`,
    `People comparing ${thirdCriterion.toLowerCase()}`
  ][index % 3];

  return {
    rank: category.businesses.length + index + 1,
    name: `${area} ${category.category} ${businessKinds[index % businessKinds.length]}`,
    area,
    rating: Number((4.5 - index * 0.1).toFixed(1)),
    reviews: 144 - index * 22,
    price: index === 0 ? "Mid-range" : index === 1 ? "Premium" : "Budget-friendly",
    bestFor,
    phone: `(01) 4${category.slug.length}${index + 2}80${index + 4}1`,
    image: image(extraImageIds[index % extraImageIds.length], "600", "420"),
    imageAlt: `${category.category} business service team in ${area}`,
    strengths: [firstCriterion, secondCriterion, thirdCriterion],
    verdict: `A useful extra option for users who want to compare ${category.category.toLowerCase()} providers in ${area} by ${firstCriterion.toLowerCase()}, ${secondCriterion.toLowerCase()} and practical local fit.`
  };
}

function expandBusinesses(category: CompareCategory): ComparedBusiness[] {
  const minimumOptions = 6;
  const extrasNeeded = Math.max(0, minimumOptions - category.businesses.length);
  const extras = Array.from({ length: extrasNeeded }, (_, index) => buildExtraBusiness(category, index));

  return [...category.businesses, ...extras].map((business, index) => ({
    ...business,
    rank: index + 1
  }));
}

export const compareCategories: CompareCategory[] = baseCompareCategories.map((category) => ({
  ...category,
  businesses: expandBusinesses(category)
}));

export function getCompareCategory(slug: string) {
  return compareCategories.find((category) => category.slug === slug);
}

export function getSortedCompareCategories() {
  return [...compareCategories].sort((a, b) => {
    const dateOrder = b.updatedAt.localeCompare(a.updatedAt);

    if (dateOrder !== 0) {
      return dateOrder;
    }

    return a.category.localeCompare(b.category);
  });
}
