import type { Listing } from "@/lib/enrich";

export const directoryCategorySlugs = [
  "restaurants",
  "hotels",
  "hospitals",
  "schools",
  "it-companies",
  "shops",
] as const;

export type DirectoryCategorySlug = (typeof directoryCategorySlugs)[number];

export type DirectoryCategory = {
  slug: DirectoryCategorySlug;
  href: string;
  name: string;
  priorityKeyword: string;
  title: string;
  metaDescription: string;
  h1: string;
  aliases: readonly string[];
  quickAnswer: string;
  overviewHeading: string;
  overview: readonly string[];
  comparisonHeading: string;
  comparisonIntro: string;
  comparisonPoints: ReadonlyArray<{ title: string; body: string }>;
  faqs: ReadonlyArray<{ question: string; answer: string }>;
};

export function getDirectoryCategoryHref(slug: string): string {
  return `/category/${encodeURIComponent(slug.trim().toLowerCase())}`;
}

export const directoryCategories: readonly DirectoryCategory[] = [
  {
    slug: "restaurants",
    href: getDirectoryCategoryHref("restaurants"),
    name: "Restaurants",
    priorityKeyword: "Restaurants in Nepal",
    title: "Restaurants in Nepal: Local Dining Directory",
    metaDescription:
      "Browse Restaurants in Nepal by published location and dining category, then check menus, opening hours, dietary needs and reservations directly before you visit.",
    h1: "Restaurants in Nepal",
    aliases: [
      "restaurant",
      "restaurants",
      "cafe",
      "cafes",
      "café",
      "cafés",
      "coffee",
      "coffee shop",
      "bakery",
      "bakeries",
      "eatery",
      "eateries",
      "dining",
      "fine dining",
      "newari fine dining",
      "multicuisine nepali",
      "tibetan",
      "sherpa",
      "momos",
      "italian",
      "pizza",
      "continental",
      "bars",
      "breakfast",
      "thakali",
      "nepali thali",
      "food and dining",
    ],
    quickAnswer:
      "Start with the city or neighborhood, the kind of food you want and any dietary or accessibility requirement. Open a published profile for its available details, but confirm the current menu, price, hours and table availability with the restaurant before travelling.",
    overviewHeading: "Plan a meal around the details that matter",
    overview: [
      "Restaurant searches in Nepal can mean very different things: a quick momo stop, a family thali meal, a cafe suitable for working, or a dining room that accepts a large booking. A useful shortlist begins with the occasion and location, then narrows by cuisine, service style and practical needs such as step-free access, vegetarian choices or parking.",
      "Menus, kitchens and opening hours can change without notice, and a familiar dish name does not guarantee the same ingredients everywhere. Use directory profiles to identify possible venues and contact routes. Ask the restaurant directly about allergens, preparation, current prices, service charges, reservations and delivery coverage when any of those details affect your decision.",
    ],
    comparisonHeading: "How to compare restaurants",
    comparisonIntro:
      "Choose a small number of relevant venues and ask each one the same practical questions. That produces a more useful comparison than relying on a single headline rating.",
    comparisonPoints: [
      {
        title: "Match the place to the occasion",
        body: "Check cuisine and meal period, but also seating style, noise level, group capacity, child-friendly arrangements and whether advance booking is expected.",
      },
      {
        title: "Confirm food requirements",
        body: "Contact the kitchen about allergies, vegetarian or vegan preparation, halal requests and cross-contact concerns. Treat a menu label as a prompt to ask, not a medical guarantee.",
      },
      {
        title: "Check the complete cost",
        body: "Request the current menu and ask whether taxes, service charges, delivery fees, set-menu rules or minimum group spends apply before confirming an order or booking.",
      },
    ],
    faqs: [
      {
        question: "How can I find a restaurant in a particular Nepal city?",
        answer:
          "Use the city directory links on this page to narrow the area, then open relevant restaurant profiles. Confirm the exact address and travel time because neighborhood names and delivery boundaries may differ.",
      },
      {
        question: "Does a restaurant profile guarantee current opening hours or prices?",
        answer:
          "No. A profile records published directory information, while hours, menus and prices remain time-sensitive. Contact the restaurant directly before making a special journey or booking.",
      },
      {
        question: "How should I check allergy or dietary information?",
        answer:
          "Explain the requirement directly to the restaurant and ask about ingredients and cross-contact in its current kitchen process. For a serious allergy, do not rely only on a directory category or an old menu.",
      },
    ],
  },
  {
    slug: "hotels",
    href: getDirectoryCategoryHref("hotels"),
    name: "Hotels",
    priorityKeyword: "Hotels in Nepal",
    title: "Hotels in Nepal: Accommodation Directory",
    metaDescription:
      "Explore Hotels in Nepal by destination and published accommodation type, with practical guidance for checking rooms, access, cancellation terms and total booking cost.",
    h1: "Hotels in Nepal",
    aliases: [
      "hotel",
      "hotels",
      "resort",
      "resorts",
      "lodge",
      "lodges",
      "guest house",
      "guest houses",
      "guesthouse",
      "guesthouses",
      "hostel",
      "hostels",
      "accommodation",
      "boutique hotel",
      "heritage hotel",
    ],
    quickAnswer:
      "Choose the destination and the part of town that suits the trip, then compare room type, access, check-in, cancellation and the full payable amount. Contact the property or booking provider to confirm current availability and exactly what the quoted rate includes.",
    overviewHeading: "Choose accommodation for the trip you are taking",
    overview: [
      "A useful hotel location depends on the itinerary. Being close to a bus park, airport route, heritage area, hospital or meeting venue may matter more than being near a city center label. In hill and mountain destinations, road access, walking distance and seasonal conditions can also change what looks convenient on a map.",
      "Room names are not standardized across properties. Before paying, check the bed arrangement, maximum occupancy, bathroom type, heating or cooling, lift access, backup power and any meal plan you need. Ask for the cancellation and date-change terms in writing, together with taxes, deposits and other charges included in the final amount.",
    ],
    comparisonHeading: "How to compare hotels",
    comparisonIntro:
      "Compare the stay as a whole: a suitable location, usable room and clear booking terms often matter more than a long amenity list.",
    comparisonPoints: [
      {
        title: "Map the real journey",
        body: "Check the route to the places you will actually visit, including likely traffic, late-arrival access, parking or pickup arrangements and any walking with luggage.",
      },
      {
        title: "Define the room precisely",
        body: "Confirm bed count and size, occupancy rules, private or shared bathroom, floor, lift access, hot water, heating or cooling and whether the pictured room is the booked type.",
      },
      {
        title: "Read the booking terms",
        body: "Ask for the final price, tax treatment, meal inclusion, deposit, accepted payment methods, check-in identification and cancellation or amendment deadline before paying.",
      },
    ],
    faqs: [
      {
        question: "How do I choose the best area for a hotel in Nepal?",
        answer:
          "List the places you need to reach and compare routes from each candidate area. Also consider arrival time, luggage, road conditions and whether you need parking or a property-arranged transfer.",
      },
      {
        question: "Are room rates and availability on directory profiles guaranteed?",
        answer:
          "No. Inventory and prices change frequently. Confirm the dates, room type, occupancy, inclusions and complete payable amount with the property or booking provider before committing.",
      },
      {
        question: "What accessibility questions should I ask a hotel?",
        answer:
          "Describe the specific access need and ask about the entrance, stairs or lift, corridor and door widths, bathroom layout, room location and emergency arrangements. Request current photos when useful.",
      },
    ],
  },
  {
    slug: "hospitals",
    href: getDirectoryCategoryHref("hospitals"),
    name: "Hospitals",
    priorityKeyword: "Hospitals in Nepal",
    title: "Hospitals in Nepal: Healthcare Directory",
    metaDescription:
      "Find Hospitals in Nepal through qualified directory profiles and learn what to confirm about departments, emergency intake, appointments, referrals and payment before seeking care.",
    h1: "Hospitals in Nepal",
    aliases: [
      "hospital",
      "hospitals",
      "general hospital",
      "community hospital",
      "teaching hospital",
      "medical hospital",
      "medical center",
      "medical centre",
      "health center",
      "health centre",
    ],
    quickAnswer:
      "Use this directory to locate possible hospitals and their published contact details, then contact the facility to confirm that the required department and intake route are available. A directory is not emergency dispatch or medical advice; seek immediate help through appropriate local emergency services when a situation is urgent.",
    overviewHeading: "Find the right point of care, then verify it directly",
    overview: [
      "The nearest hospital is not always the facility that handles a particular examination, procedure or age group. When time allows, identify the needed department and ask whether it accepts walk-ins, requires a referral or runs on an appointment schedule. For urgent symptoms, do not delay care while comparing directory pages.",
      "Hospital services, consultant schedules, bed availability and payment arrangements can change quickly. Call an official facility contact to confirm the correct entrance, registration documents, referral records, expected deposits and whether an insurer or assistance provider requires pre-authorization. Bring relevant prescriptions and reports when the treating team requests them.",
    ],
    comparisonHeading: "What to confirm before a hospital visit",
    comparisonIntro:
      "Directory information is a starting point. Clinical decisions belong with qualified health professionals, and operational details should come from the facility itself.",
    comparisonPoints: [
      {
        title: "Department and intake route",
        body: "Ask whether the relevant department is operating, which entrance or registration desk to use, whether a referral is required and what to do outside normal outpatient hours.",
      },
      {
        title: "Records and continuity",
        body: "Check which identification, prescriptions, test results, imaging or discharge notes to bring and how follow-up information can be shared with your regular clinician.",
      },
      {
        title: "Payment and support",
        body: "Confirm registration fees, deposit expectations, accepted payment methods and insurer procedures directly. If language or mobility support is needed, ask what the facility can arrange.",
      },
    ],
    faqs: [
      {
        question: "Can I use this directory during a medical emergency?",
        answer:
          "The directory can show published facility profiles, but it is not an emergency response service. For severe or rapidly worsening symptoms, seek immediate help through appropriate local emergency services or the nearest suitable emergency facility.",
      },
      {
        question: "How do I know whether a hospital has the department I need?",
        answer:
          "Contact the hospital through an official channel and describe the type of care required. Confirm the department, intake hours, referral or appointment rules and where to report on arrival.",
      },
      {
        question: "Does inclusion mean Nepali Directory recommends a hospital?",
        answer:
          "No. Inclusion means a public listing passed the directory publication gate; it is not a clinical endorsement. Patients should make care decisions with qualified professionals and current facility information.",
      },
    ],
  },
  {
    slug: "schools",
    href: getDirectoryCategoryHref("schools"),
    name: "Schools",
    priorityKeyword: "Schools in Nepal",
    title: "Schools in Nepal: Education Directory",
    metaDescription:
      "Browse Schools in Nepal by published location and school type, with a practical checklist for curriculum, grade levels, admissions, fees, transport and family visits.",
    h1: "Schools in Nepal",
    aliases: [
      "school",
      "schools",
      "primary school",
      "secondary school",
      "higher secondary school",
      "boarding school",
      "day school",
      "international school",
      "community school",
      "private school",
      "preschool",
      "pre school",
      "montessori",
    ],
    quickAnswer:
      "Begin with the child's grade level, daily travel area and learning needs. Shortlist schools whose published type appears relevant, then request the current curriculum, admission process, full fee schedule and support information directly and arrange a visit when possible.",
    overviewHeading: "Build a school shortlist around the child",
    overview: [
      "A school search is more useful when it starts with the learner rather than a generic league table. Consider grade level, teaching language, curriculum or examination pathway, class routine, additional learning support and the distance a child would travel every day. Families may weigh these factors differently, so a single label cannot identify the right fit.",
      "Admission dates, available places, fee structures and transport routes change by academic cycle. Ask the school for current written information and distinguish compulsory charges from optional activities, meals, uniforms, devices and transport. During a visit, discuss safeguarding, communication with families, attendance expectations and how the school responds when a learner needs help.",
    ],
    comparisonHeading: "How families can compare schools",
    comparisonIntro:
      "Use the same questions for every shortlisted school and keep the answers with the documents supplied by the school for the relevant academic year.",
    comparisonPoints: [
      {
        title: "Learning programme and support",
        body: "Confirm grade coverage, curriculum or examination pathway, teaching language, class routine and how learning, disability or language support is assessed and delivered.",
      },
      {
        title: "Daily journey and school day",
        body: "Test travel time at realistic hours and ask about start and finish times, transport stops, supervision, meals, after-school activities and late collection procedures.",
      },
      {
        title: "Admission and full-year cost",
        body: "Request eligibility criteria, assessment steps, deadlines, refund rules and an itemized schedule covering tuition plus registration, materials, uniform, transport and activities.",
      },
    ],
    faqs: [
      {
        question: "What should I ask before applying to a school in Nepal?",
        answer:
          "Ask about grade availability, curriculum, teaching language, admission steps, required documents, the full fee schedule, daily timings, transport and any support your child needs.",
      },
      {
        question: "Are school fees and admission dates on a directory profile current?",
        answer:
          "They should not be assumed current. Obtain the applicable academic-year notice and fee schedule directly from the school, and confirm deadlines before submitting documents or payment.",
      },
      {
        question: "Does a directory listing rank the quality of a school?",
        answer:
          "No. This page provides discovery and comparison guidance, not a quality ranking. Families should review current school documents, visit where possible and assess fit for the individual learner.",
      },
    ],
  },
  {
    slug: "it-companies",
    href: getDirectoryCategoryHref("it-companies"),
    name: "IT Companies",
    priorityKeyword: "IT Companies in Nepal",
    title: "IT Companies in Nepal: Technology Directory",
    metaDescription:
      "Discover IT Companies in Nepal through qualified business profiles and compare project scope, technical ownership, security, handover, support and commercial terms.",
    h1: "IT Companies in Nepal",
    aliases: [
      "it company",
      "it companies",
      "it and software",
      "information technology",
      "information technology company",
      "software company",
      "software companies",
      "software development",
      "web development",
      "technology company",
      "technology companies",
      "tech company",
      "tech companies",
      "computer services",
      "digital agency",
    ],
    quickAnswer:
      "Write down the business problem, users, deadline, systems involved and the result you need before contacting providers. Compare relevant delivery experience, the proposed team, ownership of code and data, security responsibilities, acceptance tests and post-launch support on the same scope.",
    overviewHeading: "Choose a technology partner on delivery evidence",
    overview: [
      "IT company can describe many different services, from website delivery and custom software to cloud operations, cybersecurity, data work or ongoing support. A provider suited to one job may not be suited to another. A clear brief helps companies explain what they would build, what they need from the client and which risks remain outside the proposal.",
      "Before signing, identify who owns source code, design files, domains, hosting accounts, credentials and project data. Agree on milestones, acceptance criteria, change control, backups, security reporting, documentation and exit support. Portfolio examples are most useful when the company can explain its role and the client permits the work to be referenced.",
    ],
    comparisonHeading: "How to compare IT companies",
    comparisonIntro:
      "Give shortlisted providers the same brief. Compare the assumptions and exclusions as carefully as the headline price because they determine what will actually be delivered.",
    comparisonPoints: [
      {
        title: "Relevant delivery experience",
        body: "Ask for comparable work, the provider's exact role, the proposed team and how technical choices address your users, integrations, scale and operating constraints.",
      },
      {
        title: "Ownership and security",
        body: "Put code, data, account and intellectual-property ownership in writing. Define access controls, dependency updates, backups, incident notification and any compliance responsibilities.",
      },
      {
        title: "Acceptance and life after launch",
        body: "Agree on testable deliverables, review windows, bug handling, documentation, training, warranty or support boundaries, recurring costs and the process for transferring the system elsewhere.",
      },
    ],
    faqs: [
      {
        question: "How should I shortlist an IT company in Nepal?",
        answer:
          "Start with companies whose published services match the project, then send each the same brief. Evaluate relevant evidence, team availability, technical approach, ownership, security, support and total cost.",
      },
      {
        question: "What should an IT project proposal make clear?",
        answer:
          "It should define scope, deliverables, assumptions, exclusions, responsibilities, milestones, acceptance, change requests, ownership, security, support and all one-time and recurring charges.",
      },
      {
        question: "Does inclusion prove a company's technical capability?",
        answer:
          "No. A qualified directory profile is a discovery record, not a technical certification or endorsement. Check references with permission, review relevant work and complete appropriate procurement and security checks.",
      },
    ],
  },
  {
    slug: "shops",
    href: getDirectoryCategoryHref("shops"),
    name: "Shops",
    priorityKeyword: "Shops in Nepal",
    title: "Shops in Nepal: Local Shopping Directory",
    metaDescription:
      "Find Shops in Nepal through qualified local profiles, then confirm branch location, current stock, genuine product details, payment, delivery, returns and warranty terms.",
    h1: "Shops in Nepal",
    aliases: [
      "shop",
      "shops",
      "store",
      "stores",
      "retail",
      "retailer",
      "retailers",
      "shopping",
      "boutique",
      "supermarket",
      "supermarkets",
      "grocery",
      "grocery store",
      "department store",
      "clothing store",
      "electronics store",
      "hardware store",
      "book store",
      "bookshop",
      "sweet shop",
      "sweet shops",
    ],
    quickAnswer:
      "Narrow the search by product and city, then contact the exact branch before making a special trip. Ask for current stock, model or size, complete price, payment options and the written return or warranty terms that apply to that product.",
    overviewHeading: "Find the product and the right branch",
    overview: [
      "Shopping intent is usually more specific than the word shop suggests. The useful details are the product, brand or specification, budget, location and whether collection, delivery, fitting or installation is required. A business with several branches may not hold the same inventory or provide the same service at every location.",
      "Before paying, check the exact model, material, size, quantity or expiry information that matters. For higher-value purchases, ask who provides the warranty, what documentation you receive, which faults or changes are covered and where service is handled. Keep the invoice and written terms rather than relying on a verbal summary.",
    ],
    comparisonHeading: "How to compare local shops",
    comparisonIntro:
      "Compare like with like: use the same product specification and include delivery, installation, returns and warranty in the decision where relevant.",
    comparisonPoints: [
      {
        title: "Confirm the exact item",
        body: "Ask the branch to verify the model, size, color, quantity, condition or batch details you need and whether stock can be held until you arrive.",
      },
      {
        title: "Understand the final cost",
        body: "Check taxes, delivery, assembly, installation, accessories, payment surcharges and any deposit. Request an invoice or quotation for a significant purchase.",
      },
      {
        title: "Keep the after-sale terms",
        body: "Read return, exchange and warranty conditions before payment, including time limits, exclusions, required packaging and whether the seller or manufacturer handles service.",
      },
    ],
    faqs: [
      {
        question: "Can I rely on a directory profile for current shop inventory?",
        answer:
          "No. Stock can change throughout the day and between branches. Contact the specific shop to confirm the exact item and ask whether it can be reserved before travelling.",
      },
      {
        question: "What should I check before buying a higher-value product?",
        answer:
          "Confirm the model and condition, seller identity, complete price, invoice, return rules, warranty provider, coverage period and where repairs or claims are handled.",
      },
      {
        question: "Does a shop listing guarantee that every product is genuine?",
        answer:
          "No. Directory inclusion does not authenticate individual products. Check applicable labels, serial details, seller documentation, invoice and manufacturer or authorized-channel information where relevant.",
      },
    ],
  },
] as const;

const directoryCategoryBySlug = new Map(
  directoryCategories.map((category) => [category.slug, category] as const),
);

function normalizeSlug(value: string): string {
  try {
    return decodeURIComponent(value).trim().toLowerCase();
  } catch {
    return value.trim().toLowerCase();
  }
}

function normalizeAlias(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function getDirectoryCategory(slug: string): DirectoryCategory | undefined {
  return directoryCategoryBySlug.get(normalizeSlug(slug) as DirectoryCategorySlug);
}

export function listingMatchesDirectoryCategory(
  listing: Pick<Listing, "categories">,
  categoryOrSlug: DirectoryCategory | string,
): boolean {
  const category =
    typeof categoryOrSlug === "string"
      ? getDirectoryCategory(categoryOrSlug)
      : categoryOrSlug;

  if (!category) return false;

  const aliases = new Set(
    [category.slug, category.name, ...category.aliases].map(normalizeAlias),
  );

  return listing.categories.some((listingCategory) =>
    aliases.has(normalizeAlias(listingCategory)),
  );
}
