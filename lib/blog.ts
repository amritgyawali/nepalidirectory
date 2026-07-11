export type BlogSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogPost = {
  title: string;
  seoTitle: string;
  slug: string;
  href: string;
  category: string;
  excerpt: string;
  description: string;
  image: string;
  imageAlt: string;
  date: string;
  publishedAt: string;
  modifiedAt: string;
  readTime: string;
  author: string;
  keywords: string[];
  tags: string[];
  sections: BlogSection[];
  faqs: BlogFaq[];
  contextLinks?: Array<{ label: string; href: string }>;
  citySlugs?: string[];
  categorySlugs?: string[];
  sources?: Array<{ label: string; url: string }>;
  disclaimer?: string;
};

export const siteUrl = "https://www.nepalidirectory.com";

const image = (id: string, width = "1200", height = "675") =>
  `https://images.unsplash.com/${id}?w=${width}&h=${height}&fit=crop&auto=format`;

export const blogPosts: BlogPost[] = [
  {
    title: "The Ultimate Guide to Trekking the Annapurna Circuit",
    seoTitle: "Annapurna Circuit Trek Guide: Route, Permits, Cost and Packing",
    slug: "annapurna-circuit-guide",
    href: "/blog/annapurna-circuit-guide",
    category: "Travel Guide",
    excerpt:
      "Permits, routes, teahouses, packing notes and local contacts for one of Nepal's most loved treks.",
    description:
      "Plan the Annapurna Circuit trek with route stages, permit guidance, cost ranges, packing advice, teahouse tips and safety checks for Nepal travellers.",
    image: image("photo-1464822759023-fed622ff2c3b"),
    imageAlt: "Snowy Himalayan peaks above the Annapurna trekking route",
    date: "12 Jun 2026",
    publishedAt: "2026-06-12",
    modifiedAt: "2026-06-24",
    readTime: "12 min read",
    author: "Nepali Directory Travel Desk",
    keywords: [
      "Annapurna Circuit trek",
      "Annapurna Circuit guide",
      "Nepal trekking permits",
      "Thorong La pass",
      "Nepal teahouse trekking"
    ],
    tags: ["Annapurna", "Trekking", "Permits", "Pokhara"],
    sections: [
      {
        heading: "Start with the right route plan",
        paragraphs: [
          "Most Annapurna Circuit itineraries now begin around Besisahar, Dharapani or Chame depending on road conditions, available time and how much walking you want before Manang. A practical plan allows slow altitude gain before Thorong La and avoids squeezing too many high-elevation days together.",
          "If this is your first major trek in Nepal, choose an itinerary with at least one acclimatization day in Manang. That extra day is not wasted time. It gives your body a chance to adjust, lets you check weather, and creates room for side walks that make the journey more memorable."
        ]
      },
      {
        heading: "Permits, cash and local contacts",
        paragraphs: [
          "Trekkers should confirm current permit rules before departure and carry printed and digital copies of identification. Keep cash in smaller notes because card payment is inconsistent outside larger towns and mobile wallets are not always reliable in mountain weather.",
          "Save phone numbers for your guide, porter, hotel in the next village, transport operator and an emergency contact in Kathmandu or Pokhara. Mobile coverage improves every year, but the safest plan is still to share your route with someone before you leave."
        ]
      },
      {
        heading: "Packing priorities",
        paragraphs: [
          "Layering matters more than carrying one heavy jacket. Pack a warm base layer, fleece, windproof shell, down jacket, gloves, hat, sunglasses, sunscreen, headlamp, water treatment, basic medication and offline maps.",
          "Do not overload your bag with food that is already available on the trail. Spend the weight on warm clothing, reliable footwear and a small first-aid kit. Cold mornings around high passes are easier when your kit is simple and dependable."
        ]
      }
    ],
    faqs: [
      {
        question: "How many days do I need for the Annapurna Circuit?",
        answer:
          "Most travellers plan 10 to 16 days depending on the start point, acclimatization schedule and whether they add side trips around Manang or continue toward Jomsom."
      },
      {
        question: "What is the hardest part of the trek?",
        answer:
          "Thorong La is the most demanding section because of altitude, cold and the early start. A slower ascent before the pass makes that day safer."
      }
    ]
  },
  {
    title: "Best Newari Food in Kathmandu: Where Locals Eat",
    seoTitle: "Best Newari Food in Kathmandu: Dishes, Areas and Local Tips",
    slug: "kathmandu-newari-food",
    href: "/blog/kathmandu-newari-food",
    category: "Food",
    excerpt:
      "A neighborhood-by-neighborhood guide to choila, bara, yomari, samay baji and heritage dining rooms.",
    description:
      "Find the best Newari food in Kathmandu with dish recommendations, neighborhood tips, ordering advice and local restaurant guidance.",
    image: image("photo-1547592180-85f173990554"),
    imageAlt: "Traditional Nepali meal served on a plate",
    date: "9 Jun 2026",
    publishedAt: "2026-06-09",
    modifiedAt: "2026-06-23",
    readTime: "8 min read",
    author: "Nepali Directory Food Desk",
    keywords: ["Newari food Kathmandu", "best Newari restaurant", "samay baji", "choila", "Kathmandu food guide"],
    tags: ["Kathmandu", "Newari Food", "Restaurants", "Local Guide"],
    sections: [
      {
        heading: "Know the dishes before you order",
        paragraphs: [
          "A good Newari meal is built around texture, spice and small portions that add up. Start with samay baji if you want a balanced plate, then add choila, bara, chatamari, yomari or aloo tama depending on the restaurant.",
          "If you are new to the cuisine, ask how spicy the achar and meat preparations are before ordering. Many local restaurants can adjust heat slightly, but the best flavors still come from the original spice profile."
        ]
      },
      {
        heading: "Best areas to search",
        paragraphs: [
          "Patan, Kirtipur, Bhaktapur and older Kathmandu neighborhoods have strong Newari dining options. Heritage courtyards are best for atmosphere, while smaller family-run places are often better for everyday dishes and fair prices.",
          "Search by neighborhood and check recent photos before you go. The same restaurant may feel very different at lunch, dinner or festival time, so hours and booking details matter."
        ]
      },
      {
        heading: "Ordering for a group",
        paragraphs: [
          "For groups, order a few shared plates first and expand from there. Newari food is ideal for tasting, but portions and spice levels vary widely by restaurant.",
          "If you need vegetarian options, call ahead. Bara, chatamari and yomari can be vegetarian-friendly, but some kitchens prepare items with shared utensils or meat stock."
        ]
      }
    ],
    faqs: [
      {
        question: "What Newari dish should I try first?",
        answer:
          "Samay baji is the easiest starting point because it includes several classic elements on one plate."
      },
      {
        question: "Where is the best area for Newari restaurants?",
        answer:
          "Patan, Kirtipur and Bhaktapur are reliable areas for traditional Newari restaurants and heritage dining rooms."
      }
    ]
  },
  {
    title: "How to Choose a Verified Contractor in Nepal",
    seoTitle: "How to Choose a Verified Contractor in Nepal: Checklist and Red Flags",
    slug: "verified-contractor-nepal",
    href: "/blog/verified-contractor-nepal",
    category: "Home Services",
    excerpt:
      "Questions to ask, documents to check and red flags to avoid before starting a construction project.",
    description:
      "Use this Nepal contractor checklist to compare licenses, references, estimates, payment terms, safety practices and review signals before hiring.",
    image: image("photo-1503387762-592deb58ef4e"),
    imageAlt: "Construction workers reviewing plans at a building site",
    date: "4 Jun 2026",
    publishedAt: "2026-06-04",
    modifiedAt: "2026-06-22",
    readTime: "7 min read",
    author: "Nepali Directory Services Desk",
    keywords: ["verified contractor Nepal", "contractor checklist Nepal", "home construction Nepal", "Kathmandu contractor", "building services"],
    tags: ["Contractors", "Home Services", "Verification", "Safety"],
    sections: [
      {
        heading: "Compare proof, not promises",
        paragraphs: [
          "A reliable contractor should be able to show previous work, business registration details, references and a written estimate. Verbal confidence is not enough for a project that affects your home, budget and safety.",
          "Ask for at least two recent references from similar jobs. A contractor who has only done small repairs may not be ready for structural work, large renovations or projects that require multiple subcontractors."
        ]
      },
      {
        heading: "Read the estimate line by line",
        paragraphs: [
          "A useful estimate separates labor, materials, transport, equipment, timeline and exclusions. If the price is very low, ask what has been left out. Missing waste disposal, finishing materials or transport costs can create disputes later.",
          "Tie payments to milestones instead of paying a large amount upfront. Keep receipts and written confirmations for every payment, even when working with a contractor recommended by a friend."
        ]
      },
      {
        heading: "Watch for red flags",
        paragraphs: [
          "Avoid contractors who refuse written terms, pressure you to decide immediately, cannot explain material choices or ask for full payment before work begins. Also be careful when a provider has many old reviews but no recent project evidence.",
          "For larger work, confirm who is responsible for permits, neighbor coordination, site cleanup and damage repair. Clear responsibility is one of the best ways to prevent conflict."
        ]
      }
    ],
    faqs: [
      {
        question: "Should I hire the cheapest contractor?",
        answer:
          "Not automatically. A very low estimate may exclude materials, transport, cleanup or finishing work, so compare detailed scope before choosing."
      },
      {
        question: "What should a contractor estimate include?",
        answer:
          "It should include labor, materials, timeline, payment schedule, exclusions, warranty terms and who handles permits or cleanup."
      }
    ]
  },
  {
    title: "Kathmandu Restaurant Guide: Best Areas for Every Meal",
    seoTitle: "Kathmandu Restaurant Guide: Best Areas for Breakfast, Lunch and Dinner",
    slug: "kathmandu-restaurant-guide",
    href: "/blog/kathmandu-restaurant-guide",
    category: "Restaurants",
    excerpt:
      "Where to search for breakfast cafes, momo shops, Thakali sets, rooftop dinners and late-night meals in Kathmandu.",
    description:
      "Explore the best Kathmandu restaurant areas by meal type, cuisine, budget and neighborhood, with practical booking and review tips.",
    image: image("photo-1567188040759-fb8a883dc6d8"),
    imageAlt: "Restaurant table with Nepali dishes and warm lighting",
    date: "30 May 2026",
    publishedAt: "2026-05-30",
    modifiedAt: "2026-06-20",
    readTime: "9 min read",
    author: "Nepali Directory Food Desk",
    keywords: ["Kathmandu restaurants", "best restaurants Kathmandu", "Thamel restaurants", "Lazimpat cafes", "Nepal food guide"],
    tags: ["Kathmandu", "Restaurants", "Food", "Thamel"],
    sections: [
      {
        heading: "Match the area to the occasion",
        paragraphs: [
          "Thamel is convenient for travellers, late dinners and international menus. Jhamsikhel works well for cafes, family meals and modern restaurants. Boudha is strong for Tibetan food, bakeries and relaxed meals near the stupa.",
          "For heritage dining, look toward old Kathmandu, Patan and Bhaktapur. For quick daily meals, search by neighborhood instead of crossing the city through traffic."
        ]
      },
      {
        heading: "Use reviews with context",
        paragraphs: [
          "A high rating is useful, but the best signal is recent review detail. Look for mentions of service speed, hygiene, menu availability, parking, family seating and how the restaurant handles busy hours.",
          "Photos often tell you more than star averages. Check portion size, lighting, seating comfort and whether the food shown matches the dish you actually want."
        ]
      },
      {
        heading: "Book before peak times",
        paragraphs: [
          "Friday evenings, festival periods and tourist seasons can fill popular restaurants quickly. Call ahead for rooftops, live music, group seating and special diets.",
          "If you are planning a business meal, confirm parking, noise level and payment options before you arrive. Small details can decide whether the meal runs smoothly."
        ]
      }
    ],
    faqs: [
      {
        question: "Which Kathmandu area is best for travellers?",
        answer:
          "Thamel is the easiest area for travellers because it has many restaurants, late hours and walkable options."
      },
      {
        question: "Where should families search for restaurants?",
        answer:
          "Jhamsikhel, Lazimpat and Boudha have many family-friendly restaurants with calmer seating and varied menus."
      }
    ]
  },
  {
    title: "Pokhara Travel Guide for First Time Visitors",
    seoTitle: "Pokhara Travel Guide: Lakeside, Viewpoints, Hotels and Local Tips",
    slug: "pokhara-travel-guide",
    href: "/blog/pokhara-travel-guide",
    category: "City Guide",
    excerpt:
      "A practical first-time Pokhara plan covering Lakeside, sunrise viewpoints, local transport, hotels and food.",
    description:
      "Plan a first visit to Pokhara with Lakeside advice, viewpoint timing, hotel areas, restaurant tips, transport notes and safety basics.",
    image: image("photo-1626621341517-bbf3d9990a23"),
    imageAlt: "Phewa Lake in Pokhara with mountain views",
    date: "25 May 2026",
    publishedAt: "2026-05-25",
    modifiedAt: "2026-06-18",
    readTime: "10 min read",
    author: "Nepali Directory Travel Desk",
    keywords: ["Pokhara travel guide", "things to do in Pokhara", "Pokhara hotels", "Phewa Lake", "Nepal city guide"],
    tags: ["Pokhara", "Travel", "Hotels", "Lakeside"],
    sections: [
      {
        heading: "Use Lakeside as your base",
        paragraphs: [
          "For most first-time visitors, Lakeside is the easiest base because hotels, cafes, boat operators, trekking shops and travel desks are close together. It is also practical if you want flexible plans around weather.",
          "Choose a quieter hotel lane if you need early sleep before a trek or sunrise trip. The main strip is convenient, but music and traffic can be noticeable at night."
        ]
      },
      {
        heading: "Plan views around weather",
        paragraphs: [
          "Mountain views are usually clearest early in the morning. Sarangkot, World Peace Pagoda and Pumdikot are popular for sunrise, but cloud can move quickly, so avoid leaving viewpoints to your final hour in town.",
          "Keep a backup plan for rainy afternoons: cafes, spa visits, short walks, local museums or shopping for trekking gear. Pokhara is best when your itinerary stays flexible."
        ]
      },
      {
        heading: "Book transport with margin",
        paragraphs: [
          "Tourist buses, domestic flights and private vehicles can all be affected by weather or road work. If you have an international flight or trek permit schedule, avoid tight same-day connections.",
          "Ask your hotel or a verified travel office to confirm pickup points and departure time in writing. It reduces confusion on early mornings."
        ]
      }
    ],
    faqs: [
      {
        question: "How many days are enough for Pokhara?",
        answer:
          "Two to three full days are enough for Lakeside, boating, sunrise viewpoints and relaxed meals. Add more days if you plan trekking or adventure activities."
      },
      {
        question: "Where should first-time visitors stay in Pokhara?",
        answer:
          "Lakeside is the most convenient area for first-time visitors because hotels, restaurants and travel services are close together."
      }
    ]
  },
  {
    title: "How to List Your Business in a Nepal Directory",
    seoTitle: "How to List Your Business in a Nepal Directory and Get More Calls",
    slug: "list-business-nepal-directory",
    href: "/blog/list-business-nepal-directory",
    category: "Business Growth",
    excerpt:
      "A simple listing checklist for owners who want better visibility, cleaner contact details and more qualified leads.",
    description:
      "Learn how to create a stronger Nepal business directory listing with accurate NAP details, categories, photos, services, reviews and local SEO basics.",
    image: image("photo-1556761175-5973dc0f32e7"),
    imageAlt: "Small business owners reviewing a laptop together",
    date: "20 May 2026",
    publishedAt: "2026-05-20",
    modifiedAt: "2026-06-15",
    readTime: "6 min read",
    author: "Nepali Directory Business Desk",
    keywords: ["Nepal business directory", "list business Nepal", "local SEO Nepal", "business listing checklist", "get more customer calls"],
    tags: ["Business Listing", "Local SEO", "Reviews", "Leads"],
    sections: [
      {
        heading: "Start with accurate contact details",
        paragraphs: [
          "Your business name, address and phone number should match across your website, directory profile, social pages and map listings. Inconsistent details make customers hesitate and can weaken local search trust.",
          "Add hours, holiday changes, service areas and the best phone number for new enquiries. If you use WhatsApp or Viber for bookings, make that clear in your profile."
        ]
      },
      {
        heading: "Choose categories carefully",
        paragraphs: [
          "Pick the category customers would actually search for, then add supporting service keywords in the description. A restaurant should not only say food; it should mention Thakali, Newari, cafe, bakery or catering if those are real services.",
          "Avoid keyword stuffing. Clear categories plus specific services usually perform better than a long paragraph filled with repeated search terms."
        ]
      },
      {
        heading: "Add proof that helps people decide",
        paragraphs: [
          "Photos, menus, price ranges, parking notes, payment options, certifications and review responses all reduce friction. The goal is to answer common questions before the customer calls.",
          "Ask happy customers for honest reviews after the work is complete. A steady flow of recent reviews is stronger than one burst of ratings from years ago."
        ]
      }
    ],
    faqs: [
      {
        question: "What details should every business listing include?",
        answer:
          "Include business name, address, phone, hours, category, services, photos, service area, payment options and a short description."
      },
      {
        question: "Do reviews help local SEO?",
        answer:
          "Yes. Recent, detailed reviews can improve trust, click-through rate and conversion from directory pages."
      }
    ]
  },
  {
    title: "Best Hospitals and Clinics in Kathmandu: What to Check",
    seoTitle: "Best Hospitals and Clinics in Kathmandu: Patient Checklist",
    slug: "kathmandu-hospitals-clinics-checklist",
    href: "/blog/kathmandu-hospitals-clinics-checklist",
    category: "Healthcare",
    excerpt:
      "How to compare hospitals, clinics, doctors, emergency access, reports, insurance support and patient reviews.",
    description:
      "Use this Kathmandu healthcare checklist to compare hospitals and clinics by specialty, location, emergency services, reports, fees and patient support.",
    image: image("photo-1519494026892-80bbd2d6fd0d"),
    imageAlt: "Hospital corridor with clinical lighting",
    date: "15 May 2026",
    publishedAt: "2026-05-15",
    modifiedAt: "2026-06-12",
    readTime: "8 min read",
    author: "Nepali Directory Health Desk",
    keywords: ["Kathmandu hospitals", "clinics in Kathmandu", "best hospital Kathmandu", "Nepal healthcare", "doctor appointment Kathmandu"],
    tags: ["Healthcare", "Kathmandu", "Clinics", "Doctors"],
    sections: [
      {
        heading: "Start with the specialty you need",
        paragraphs: [
          "The best hospital for one patient may not be the best for another. Search by specialty first, such as cardiology, orthopedics, maternity, pediatrics, dermatology or diagnostics, then compare location and availability.",
          "For ongoing care, travel time matters. A clinic close to home or work can be better than a famous hospital across the city if you need repeat visits."
        ]
      },
      {
        heading: "Ask about reports and follow-up",
        paragraphs: [
          "Before booking, confirm consultation fees, report timing, digital report access, follow-up rules and whether appointments usually run on schedule. These details affect the total patient experience.",
          "If you need insurance paperwork, ask about bills, discharge summaries and claim support before admission or tests. It is easier to prepare documents before the visit than to chase them later."
        ]
      },
      {
        heading: "Use reviews carefully",
        paragraphs: [
          "Healthcare reviews can be emotional, so read patterns instead of reacting to one comment. Repeated mentions of communication, waiting time, cleanliness or billing clarity are useful signals.",
          "For urgent symptoms, do not rely on online research alone. Contact emergency services or visit the nearest appropriate facility."
        ]
      }
    ],
    faqs: [
      {
        question: "How should I choose a clinic in Kathmandu?",
        answer:
          "Choose by specialty, doctor availability, location, fees, report timing, cleanliness and recent patient feedback."
      },
      {
        question: "Are online hospital reviews enough?",
        answer:
          "Reviews are helpful, but they should be combined with specialty, emergency access, doctor credentials and practical logistics."
      }
    ]
  },
  {
    title: "Home Services in Kathmandu: Costs, Booking and Safety",
    seoTitle: "Home Services in Kathmandu: Plumber, Electrician and Repair Checklist",
    slug: "home-services-kathmandu-costs-booking-safety",
    href: "/blog/home-services-kathmandu-costs-booking-safety",
    category: "Home Services",
    excerpt:
      "A homeowner guide to booking plumbers, electricians, cleaners and repair technicians without avoidable surprises.",
    description:
      "Book home services in Kathmandu with better cost expectations, safety checks, service questions and review signals for plumbers, electricians and cleaners.",
    image: image("photo-1581578731548-c64695cc6952"),
    imageAlt: "Home repair professional working with tools",
    date: "10 May 2026",
    publishedAt: "2026-05-10",
    modifiedAt: "2026-06-10",
    readTime: "7 min read",
    author: "Nepali Directory Services Desk",
    keywords: ["home services Kathmandu", "plumber Kathmandu", "electrician Kathmandu", "home repair Nepal", "cleaning service Kathmandu"],
    tags: ["Plumbers", "Electricians", "Repairs", "Kathmandu"],
    sections: [
      {
        heading: "Describe the problem clearly",
        paragraphs: [
          "Send photos, location, appliance model numbers and a short description before the technician arrives. Clear information helps the provider bring the right parts and quote more accurately.",
          "For plumbing leaks or electrical faults, mention urgency and safety concerns immediately. Some jobs need same-day attention, while others are better scheduled during daylight hours."
        ]
      },
      {
        heading: "Confirm visit charges and parts",
        paragraphs: [
          "Ask whether there is an inspection fee, travel charge, minimum service charge or separate cost for parts. A low labor quote may still become expensive if parts and repeat visits are unclear.",
          "When possible, request a written estimate after inspection. For larger repairs, compare two providers before approving the work."
        ]
      },
      {
        heading: "Check safety and cleanup",
        paragraphs: [
          "Electricians should explain power shutdown needs and avoid temporary fixes that create risk later. Plumbers should test for leaks before leaving and explain what to watch over the next day.",
          "Good providers clean the immediate work area, return replaced parts if requested and give basic care instructions. These small behaviors are strong signals of professionalism."
        ]
      }
    ],
    faqs: [
      {
        question: "What should I ask before booking a plumber?",
        answer:
          "Ask about visit charges, likely parts, arrival time, warranty, payment options and whether photos are enough for an initial estimate."
      },
      {
        question: "How do I avoid surprise repair costs?",
        answer:
          "Confirm inspection fees, labor, parts, transport and repeat visit charges before approving the work."
      }
    ]
  },
  {
    title: "Nepal Local SEO Checklist for Small Businesses",
    seoTitle: "Nepal Local SEO Checklist: Rank Better in Maps, Search and Directories",
    slug: "nepal-local-seo-checklist-small-businesses",
    href: "/blog/nepal-local-seo-checklist-small-businesses",
    category: "SEO",
    excerpt:
      "Practical local SEO steps for Nepali businesses: listings, reviews, pages, photos, categories and city keywords.",
    description:
      "Improve local SEO in Nepal with a practical checklist for business listings, reviews, Google Business Profile, service pages, photos and directory citations.",
    image: image("photo-1460925895917-afdab827c52f"),
    imageAlt: "Analytics dashboard on a laptop for local SEO reporting",
    date: "5 May 2026",
    publishedAt: "2026-05-05",
    modifiedAt: "2026-06-08",
    readTime: "9 min read",
    author: "Nepali Directory SEO Desk",
    keywords: ["local SEO Nepal", "Nepal SEO checklist", "Google Business Profile Nepal", "directory citations Nepal", "small business SEO Nepal"],
    tags: ["SEO", "Business Growth", "Listings", "Reviews"],
    sections: [
      {
        heading: "Fix your foundation first",
        paragraphs: [
          "Local SEO starts with consistent name, address and phone details. Use the same spelling, phone format and address style across your website, directory profile, map listing and social pages.",
          "Choose the most accurate primary category, then support it with service descriptions, city pages and real photos. Search engines and customers both need clear evidence of what you do and where you serve."
        ]
      },
      {
        heading: "Build pages around real services",
        paragraphs: [
          "Create useful pages for your core services instead of one generic page. A dental clinic can have pages for braces, cleaning, implants and emergency dental care. A contractor can separate renovation, waterproofing, painting and electrical work.",
          "Each page should answer price factors, service area, process, proof, common questions and booking steps. Thin pages created only for keywords rarely help users."
        ]
      },
      {
        heading: "Earn reviews steadily",
        paragraphs: [
          "Ask customers for honest reviews soon after successful service. Make it easy by sending the correct review link, but never offer rewards for positive ratings.",
          "Respond to reviews with specifics. A useful reply shows future customers that the business is active, accountable and paying attention."
        ]
      }
    ],
    faqs: [
      {
        question: "What is the most important local SEO step?",
        answer:
          "Consistent business details across your website, directory profiles and map listings are the foundation."
      },
      {
        question: "How often should I ask for reviews?",
        answer:
          "Ask steadily after completed jobs or visits. A natural flow of recent reviews is stronger than a short burst."
      }
    ]
  },
  {
    title: "Chitwan Safari and Local Travel Guide",
    seoTitle: "Chitwan Safari Guide: Hotels, Tours, Seasons and Local Tips",
    slug: "chitwan-safari-local-travel-guide",
    href: "/blog/chitwan-safari-local-travel-guide",
    category: "Travel Guide",
    excerpt:
      "How to plan Chitwan hotels, jungle activities, local transport, family travel and ethical safari questions.",
    description:
      "Plan a Chitwan trip with advice on safari activities, hotel areas, seasons, local transport, family travel and responsible wildlife experiences.",
    image: image("photo-1571401835393-8c5f35328320"),
    imageAlt: "River and forest landscape near Chitwan National Park",
    date: "30 Apr 2026",
    publishedAt: "2026-04-30",
    modifiedAt: "2026-06-06",
    readTime: "8 min read",
    author: "Nepali Directory Travel Desk",
    keywords: ["Chitwan safari", "Chitwan travel guide", "Chitwan hotels", "Nepal jungle safari", "Sauraha travel"],
    tags: ["Chitwan", "Safari", "Travel", "Hotels"],
    sections: [
      {
        heading: "Choose your base carefully",
        paragraphs: [
          "Sauraha is the most common base for first-time visitors because it has many hotels, tour desks and restaurants. Quieter lodges outside the busiest areas may suit families or travellers who want slower evenings.",
          "Before booking, check distance to activities, pickup details, meal plans and whether the hotel can arrange licensed guides. A cheap room can become less convenient if every activity requires extra transport."
        ]
      },
      {
        heading: "Plan activities around comfort and ethics",
        paragraphs: [
          "Popular activities include jeep safari, canoe rides, guided walks, birdwatching and cultural programs. Ask operators how long each activity lasts, what safety rules apply and what is included in the price.",
          "Responsible wildlife travel means keeping distance, following guide instructions and avoiding activities that feel unsafe or exploitative. A good operator will explain rules clearly."
        ]
      },
      {
        heading: "Pack for heat, dust and insects",
        paragraphs: [
          "Light clothing, sun protection, insect repellent, closed shoes and a refillable water bottle are useful in Chitwan. Early mornings can be cooler, so a light layer still helps.",
          "Carry cash for small purchases and tips. Confirm card payment with hotels in advance, especially during busy weekends or festival periods."
        ]
      }
    ],
    faqs: [
      {
        question: "How many days do I need in Chitwan?",
        answer:
          "Two nights are enough for a first visit with a safari, canoe ride and village walk. Add another night for a slower family trip."
      },
      {
        question: "What is the best base for Chitwan safari?",
        answer:
          "Sauraha is the easiest base for most visitors because it has many hotels, restaurants and tour operators."
      }
    ]
  },
  {
    title: "Kathmandu Dental Clinic Guide: Costs, Questions and Reviews",
    seoTitle: "Kathmandu Dental Clinic Guide: Costs, Questions and Reviews",
    slug: "kathmandu-dental-clinic-guide",
    href: "/blog/kathmandu-dental-clinic-guide",
    category: "Healthcare",
    excerpt:
      "How to compare dental clinics in Kathmandu by treatment type, pricing, hygiene, reviews and follow-up care.",
    description:
      "Choose a dental clinic in Kathmandu with a practical checklist for consultation fees, treatment estimates, hygiene, dental scans, specialist care and reviews.",
    image: image("photo-1606811971618-4486d14f3f99"),
    imageAlt: "Dentist preparing a modern dental clinic room",
    date: "27 Jun 2026",
    publishedAt: "2026-06-27",
    modifiedAt: "2026-06-27",
    readTime: "8 min read",
    author: "Nepali Directory Health Desk",
    keywords: ["dental clinic Kathmandu", "dentist Kathmandu", "dental cost Nepal", "best dental clinic Nepal", "Kathmandu dental reviews"],
    tags: ["Dental Care", "Healthcare", "Kathmandu", "Clinics"],
    sections: [
      {
        heading: "Start with the treatment you actually need",
        paragraphs: [
          "A clinic that is excellent for routine cleaning may not be the best choice for implants, braces, root canals or cosmetic dentistry. Search by treatment first, then compare doctor experience, equipment, location and follow-up process.",
          "For bigger treatments, ask whether the same dentist handles the full plan or whether specialists join for orthodontics, oral surgery or prosthodontics. That detail matters for scheduling, cost and accountability."
        ]
      },
      {
        heading: "Ask for a written estimate",
        paragraphs: [
          "Dental pricing can change after scans, but a good clinic should still explain consultation fees, x-ray costs, material choices, expected visits and what is not included. A written estimate helps you compare clinics fairly.",
          "If a treatment has multiple options, ask what changes in durability, appearance, warranty and aftercare. The cheapest crown, filling or aligner plan is not always the best value."
        ]
      },
      {
        heading: "Check hygiene and follow-up",
        paragraphs: [
          "Look for clean treatment rooms, sterilized instruments, clear appointment timing and staff who explain post-treatment care. Recent reviews that mention pain management, communication and follow-up are more useful than rating averages alone.",
          "For emergency tooth pain, call before travelling across the city. Ask whether the clinic can take urgent cases the same day and whether they can do scans or temporary treatment on-site."
        ]
      }
    ],
    faqs: [
      {
        question: "How should I choose a dentist in Kathmandu?",
        answer:
          "Choose by treatment type, dentist experience, hygiene, written estimate, scan access, location, follow-up support and recent patient reviews."
      },
      {
        question: "Should I compare dental prices before booking?",
        answer:
          "Yes, especially for crowns, braces, implants and root canals. Compare what is included, material quality and follow-up, not only the starting price."
      }
    ]
  },
  {
    title: "Best Cafes in Lalitpur for Work Meetings and Quiet Coffee",
    seoTitle: "Best Cafes in Lalitpur for Work Meetings, Wi-Fi and Quiet Coffee",
    slug: "lalitpur-cafes-work-meetings",
    href: "/blog/lalitpur-cafes-work-meetings",
    category: "Food",
    excerpt:
      "A practical cafe checklist for Wi-Fi, seating, parking, power outlets, noise level and client-friendly meetings in Lalitpur.",
    description:
      "Find work-friendly cafes in Lalitpur by comparing Wi-Fi, seating comfort, outlet access, food menu, parking, noise level and meeting suitability.",
    image: image("photo-1554118811-1e0d58224f24"),
    imageAlt: "Cafe table with coffee and laptop for a work meeting",
    date: "26 Jun 2026",
    publishedAt: "2026-06-26",
    modifiedAt: "2026-06-27",
    readTime: "7 min read",
    author: "Nepali Directory Food Desk",
    keywords: ["cafes Lalitpur", "work cafe Patan", "coffee shop Jhamsikhel", "Lalitpur cafe Wi-Fi", "meeting cafes Nepal"],
    tags: ["Lalitpur", "Cafes", "Coffee", "Work Meetings"],
    sections: [
      {
        heading: "Match the cafe to the meeting",
        paragraphs: [
          "For client conversations, choose a cafe with quieter seating, table service and predictable parking. For solo work, power outlets, stable Wi-Fi and comfortable chairs matter more than a large menu.",
          "Jhamsikhel, Pulchowk and Patan have many cafe options, but the best choice changes by time of day. A calm morning cafe can become too loud for calls after lunch."
        ]
      },
      {
        heading: "Check the practical details",
        paragraphs: [
          "Before planning a long work session, check Wi-Fi reliability, outlet access, seating time expectations and whether the cafe gets crowded during school pickup, lunch or evening hours.",
          "If you are meeting a group, call ahead. Many cafes can reserve a table, but small spaces may not be suitable for laptops, documents and multiple orders."
        ]
      },
      {
        heading: "Use reviews beyond star ratings",
        paragraphs: [
          "Photos show table spacing, lighting and chair comfort better than ratings. Review text that mentions noise, service speed and laptop friendliness is more useful for work meetings than comments about one drink.",
          "For recurring meetings, choose two backup cafes in the same area. That gives you options when parking, Wi-Fi or table availability changes."
        ]
      }
    ],
    faqs: [
      {
        question: "Which Lalitpur areas are good for work cafes?",
        answer:
          "Jhamsikhel, Pulchowk and Patan are reliable starting points because they have many cafes, restaurants and meeting-friendly spaces close together."
      },
      {
        question: "What should I check before working from a cafe?",
        answer:
          "Check Wi-Fi, outlets, seating comfort, noise level, parking, menu options and whether long laptop sessions are welcome."
      }
    ]
  },
  {
    title: "Nepal Wedding Planning Checklist: Venues, Photography and Budget",
    seoTitle: "Nepal Wedding Planning Checklist: Venues, Photography, Decor and Budget",
    slug: "nepal-wedding-planning-checklist",
    href: "/blog/nepal-wedding-planning-checklist",
    category: "Wedding Planning",
    excerpt:
      "A local checklist for choosing venues, photographers, makeup artists, decorators, catering and family logistics.",
    description:
      "Plan a wedding in Nepal with a practical checklist for venues, photography, decor, makeup, catering, guest capacity, budget and vendor comparison.",
    image: image("photo-1519741497674-611481863552"),
    imageAlt: "Wedding venue decorated with warm lights and table settings",
    date: "24 Jun 2026",
    publishedAt: "2026-06-24",
    modifiedAt: "2026-06-27",
    readTime: "10 min read",
    author: "Nepali Directory Events Desk",
    keywords: ["Nepal wedding planning", "wedding venues Nepal", "wedding photographer Kathmandu", "wedding budget Nepal", "Nepal event planning"],
    tags: ["Weddings", "Events", "Venues", "Photography"],
    sections: [
      {
        heading: "Confirm the guest plan first",
        paragraphs: [
          "Venue, catering, decor and transport all depend on guest count. Start with a realistic range for family, friends and ceremony requirements before contacting vendors.",
          "Ask venues about seated capacity, parking, generator backup, changing rooms, sound limits and whether outside decorators or caterers are allowed. These rules affect both budget and flexibility."
        ]
      },
      {
        heading: "Book high-demand vendors early",
        paragraphs: [
          "Photographers, makeup artists, decorators and popular venues can fill quickly during peak wedding months. Shortlist vendors with recent work, clear packages and written delivery timelines.",
          "For photography, confirm the number of shooters, event hours, album delivery, raw file rules, video coverage and payment milestones. For decor, ask what is included in stage, entrance, table and floral work."
        ]
      },
      {
        heading: "Keep one shared budget sheet",
        paragraphs: [
          "Track venue, catering, outfits, photography, decor, makeup, transport, music, priest or ceremony costs, gifts and contingency in one place. Family planning becomes easier when everyone sees the same numbers.",
          "Build in a contingency amount for weather, extra guests, transport changes and last-minute rentals. Weddings often run smoothly because small backup decisions were made early."
        ]
      }
    ],
    faqs: [
      {
        question: "When should I book wedding vendors in Nepal?",
        answer:
          "For peak wedding months, start shortlisting venues, photographers, decorators and makeup artists several months in advance whenever possible."
      },
      {
        question: "What should I compare before choosing a wedding venue?",
        answer:
          "Compare guest capacity, catering rules, parking, location, decor flexibility, backup power, changing rooms, sound limits and total package cost."
      }
    ]
  },
  {
    title: "How to Compare Schools in Kathmandu for Admissions",
    seoTitle: "How to Compare Schools in Kathmandu for Admissions and Parent Fit",
    slug: "compare-schools-kathmandu-admissions",
    href: "/blog/compare-schools-kathmandu-admissions",
    category: "Education",
    excerpt:
      "A parent checklist for curriculum, fees, commute, teacher support, facilities, communication and admission timing.",
    description:
      "Compare schools in Kathmandu by curriculum, admission process, fees, transport, teacher support, facilities, parent communication and student fit.",
    image: image("photo-1580582932707-520aed937b7b"),
    imageAlt: "Students walking on a school campus",
    date: "22 Jun 2026",
    publishedAt: "2026-06-22",
    modifiedAt: "2026-06-27",
    readTime: "9 min read",
    author: "Nepali Directory Education Desk",
    keywords: ["schools Kathmandu", "school admission Kathmandu", "compare schools Nepal", "best school Kathmandu", "parent school checklist"],
    tags: ["Schools", "Education", "Admissions", "Kathmandu"],
    sections: [
      {
        heading: "Start with your child's daily experience",
        paragraphs: [
          "School reputation matters, but the daily routine matters more. Compare commute time, class size, teacher access, homework expectations, activity options and whether the school environment suits your child.",
          "A school that is excellent for one student may be stressful for another. Ask how the school supports new students, learning gaps, language needs and parent communication."
        ]
      },
      {
        heading: "Compare total cost, not only tuition",
        paragraphs: [
          "Admission fees, monthly fees, transport, meals, uniforms, books, exam fees, activities and trips can change the real budget. Ask for a full fee sheet before deciding.",
          "If the school offers scholarships or sibling discounts, confirm the rules in writing. Fee clarity prevents surprises after admission."
        ]
      },
      {
        heading: "Visit before you decide",
        paragraphs: [
          "During a school visit, observe classroom condition, student behavior, cleanliness, safety, playground space and how staff answer parent questions. A polished brochure is not enough.",
          "Speak with current parents when possible. Repeated comments about communication, teacher stability, transport reliability and discipline are useful signals."
        ]
      }
    ],
    faqs: [
      {
        question: "What is the best way to compare schools in Kathmandu?",
        answer:
          "Compare curriculum, commute, fees, class size, teacher support, facilities, parent communication, transport and how well the school fits your child."
      },
      {
        question: "Should parents visit a school before admission?",
        answer:
          "Yes. A visit helps you check classrooms, safety, cleanliness, playgrounds, staff communication and the overall student environment."
      }
    ]
  }
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostUrl(post: BlogPost) {
  return `${siteUrl}${post.href}`;
}

export function getSortedBlogPosts() {
  return [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getLatestBlogModifiedAt() {
  return getSortedBlogPosts()
    .map((post) => post.modifiedAt)
    .sort((a, b) => b.localeCompare(a))[0];
}

export function slugifyBlogCategory(category: string) {
  return category.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function getBlogCategories() {
  const sortedPosts = getSortedBlogPosts();

  return Array.from(new Set(sortedPosts.map((post) => post.category))).map((category) => ({
    name: category,
    slug: slugifyBlogCategory(category),
    href: `/blog/category/${slugifyBlogCategory(category)}`,
    posts: sortedPosts.filter((post) => post.category === category)
  }));
}

export function getBlogCategory(slug: string) {
  return getBlogCategories().find((category) => category.slug === slug);
}
