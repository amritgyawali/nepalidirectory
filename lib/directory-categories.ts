import type { Listing } from "@/lib/enrich";

export const directoryCategorySlugs = [
  "restaurants",
  "hotels",
  "hospitals",
  "schools",
  "it-companies",
  "shops",
  // Verticals below are backed by substantial reviewed listing volume in the live directory.
  // Each one previously fell through to the generic "shops" hub, which cost the specific,
  // higher-intent query its own landing page.
  "dentists",
  "tailors",
  "hardware-stores",
  "clothing-stores",
  "footwear",
  "construction",
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
  {
    slug: "dentists",
    href: getDirectoryCategoryHref("dentists"),
    name: "Dentists",
    priorityKeyword: "Dentists in Nepal",
    title: "Dentists in Nepal: Dental Clinic Directory",
    metaDescription:
      "Dentists in Nepal listed by city. Compare dental clinics, then confirm the practitioner's registration, treatment scope, appointment availability and a written cost estimate directly.",
    h1: "Dentists in Nepal",
    aliases: [
      "dentist",
      "dentists",
      "dental",
      "dental clinic",
      "dental clinics",
      "dental care",
      "dental hospital",
      "dental home",
      "orthodontist",
      "orthodontics",
      "oral surgeon",
      "oral health",
    ],
    quickAnswer:
      "Shortlist dental clinics by city and treatment type, then call the clinic to confirm which registered dentist performs the procedure, current appointment availability and an itemised written estimate before treatment begins.",
    overviewHeading: "Choosing a dental clinic in Nepal",
    overview: [
      "Dental needs vary widely, from a routine scaling or filling to root canal treatment, extraction, braces, implants or prosthetics. Not every clinic offers every procedure, and a general dental surgeon may refer specialist work such as orthodontics or oral surgery elsewhere. Confirm that the specific treatment you need is performed at that location rather than assuming a broad listing covers it.",
      "Ask which practitioner will carry out the treatment and confirm their registration with the Nepal Medical Council or Nepal Health Professional Council as applicable. For multi-visit treatment such as root canal, braces or implants, request the full course cost, the number of expected appointments, what happens if additional work is required, and what follow-up or adjustment is included.",
    ],
    comparisonHeading: "How to compare dental clinics",
    comparisonIntro:
      "Compare on the specific procedure you need, not on general impressions. Cost, materials and practitioner qualification vary considerably between clinics for the same named treatment.",
    comparisonPoints: [
      {
        title: "Confirm practitioner registration",
        body: "Ask for the treating dentist's name and registration details, and verify specialist qualifications separately where the procedure requires them, such as orthodontics, endodontics or oral surgery.",
      },
      {
        title: "Get an itemised written estimate",
        body: "Request the full course cost in writing, including consultation, imaging, materials, laboratory work and review visits. Ask what triggers additional charges before treatment starts.",
      },
      {
        title: "Check materials and follow-up",
        body: "For crowns, implants, braces and prosthetics, ask which material or brand is used, what warranty or review period applies, and who handles adjustments or complications afterwards.",
      },
    ],
    faqs: [
      {
        question: "Does a directory listing confirm a dentist's qualifications?",
        answer:
          "No. A listing records that the practice exists and passed the directory's publication checks. Verify the individual practitioner's registration and any specialist qualification directly with the clinic and the relevant Nepali regulatory council before treatment.",
      },
      {
        question: "How much does dental treatment cost in Nepal?",
        answer:
          "Costs vary by clinic, city, practitioner experience, materials and the specific procedure, so this directory does not publish prices. Ask each shortlisted clinic for an itemised written estimate covering the complete course of treatment.",
      },
      {
        question: "Can I book a dental appointment through this directory?",
        answer:
          "No. Contact the clinic directly using its published phone number to check current availability. Appointment slots, emergency provision and practitioner schedules change frequently and are not tracked here.",
      },
      {
        question: "What should I do in a dental emergency?",
        answer:
          "Contact a clinic by phone immediately and describe the problem, or attend a hospital emergency department for severe swelling, bleeding or trauma. Do not rely on directory opening hours, which may not reflect emergency cover.",
      },
    ],
  },
  {
    slug: "tailors",
    href: getDirectoryCategoryHref("tailors"),
    name: "Tailors",
    priorityKeyword: "Tailors in Nepal",
    title: "Tailors in Nepal: Tailoring and Boutique Directory",
    metaDescription:
      "Tailors in Nepal listed by city. Compare tailoring centres and boutiques, then confirm stitching charges, fabric requirements, fitting appointments and delivery timelines directly.",
    h1: "Tailors in Nepal",
    aliases: [
      "tailor",
      "tailors",
      "tailoring",
      "tailoring centre",
      "tailoring center",
      "boutique",
      "boutiques",
      "stitching",
      "dressmaker",
      "shirting suiting",
      "suiting",
      "ladies tailor",
      "gents tailor",
    ],
    quickAnswer:
      "Choose a tailor by garment type and city, then confirm the stitching charge, whether you supply fabric, how many fittings are included and the realistic delivery date before leaving material or paying a deposit.",
    overviewHeading: "Finding the right tailor for the garment",
    overview: [
      "Tailoring work in Nepal ranges from everyday alterations and school uniforms to shirting and suiting, daura suruwal, sari blouses, kurta sets, bridal and occasion wear. A shop that excels at one of these will not necessarily be the right choice for another, and specialist occasion work usually needs to be commissioned well ahead of the date.",
      "Agree the practical details before work begins: who supplies the fabric and lining, the measured stitching charge, how many fittings are included, what alteration after delivery costs, and the delivery date in writing. During festival and wedding seasons, workloads rise sharply and quoted timelines can extend, so confirm the date rather than assuming a usual turnaround.",
    ],
    comparisonHeading: "How to compare tailoring shops",
    comparisonIntro:
      "Compare tailors on the specific garment you need made, using the same fabric assumption and the same fitting expectations for each quote.",
    comparisonPoints: [
      {
        title: "Match the shop to the garment",
        body: "Ask to see recent finished work of the same type, whether that is formal suiting, traditional wear, a sari blouse or a uniform order, rather than judging on general shop appearance.",
      },
      {
        title: "Settle fabric and charges up front",
        body: "Confirm whether you bring fabric or the shop supplies it, the exact stitching charge for that garment, lining and accessory costs, and what deposit is required.",
      },
      {
        title: "Fix fittings and the delivery date",
        body: "Ask how many fittings are included, what post-delivery alteration costs, and get the delivery date confirmed in writing, especially for wedding or festival commissions.",
      },
    ],
    faqs: [
      {
        question: "How far in advance should I order occasion or wedding wear?",
        answer:
          "Commission well ahead of the date and confirm the timeline directly with the shop. Wedding and festival periods create significant backlogs in Nepal, and usual turnaround times do not apply during peak season.",
      },
      {
        question: "Do tailors in this directory supply fabric as well as stitching?",
        answer:
          "It varies by shop. Some stitch customer-supplied fabric only, others hold shirting, suiting and boutique material in-house. Confirm with the specific shop, since this directory does not track current fabric stock.",
      },
      {
        question: "Are stitching charges listed on these profiles?",
        answer:
          "No. Charges depend on the garment, fabric, finish and shop, so this directory does not publish them. Ask each shortlisted tailor to quote for the exact garment you need.",
      },
    ],
  },
  {
    slug: "hardware-stores",
    href: getDirectoryCategoryHref("hardware-stores"),
    name: "Hardware Stores",
    priorityKeyword: "Hardware Stores in Nepal",
    title: "Hardware Stores in Nepal: Building Materials Directory",
    metaDescription:
      "Hardware Stores in Nepal listed by city. Compare building material suppliers, then confirm current stock, brand, grade, delivery to site and a written quotation before ordering.",
    h1: "Hardware Stores in Nepal",
    aliases: [
      "hardware",
      "hardware store",
      "hardware stores",
      "building supplies",
      "building materials",
      "building material",
      "cement",
      "bricks",
      "brick",
      "marble",
      "tiles",
      "sanitary",
      "sanitaryware",
      "glass centre",
      "glass center",
      "aggregate",
      "concrete",
      "steel",
      "plywood",
    ],
    quickAnswer:
      "Shortlist suppliers by material and city, then confirm current stock, the exact brand and grade, total delivered cost including transport to your site, and payment terms in a written quotation before ordering.",
    overviewHeading: "Sourcing building materials in Nepal",
    overview: [
      "This category covers general hardware alongside the material suppliers a construction project depends on: cement, bricks, aggregate, steel, concrete products, marble and tiles, sanitaryware, glass, plywood and fittings. Requirements are usually specification-driven, so the grade, brand, size and quantity matter far more than a general shop description.",
      "For anything beyond a small purchase, transport is a significant part of the real cost. Confirm whether the quoted rate includes delivery to your site, who unloads, what minimum order applies and how partial or staged deliveries are handled. Ask for the quotation in writing with the specification stated, so that what arrives can be checked against what was agreed.",
    ],
    comparisonHeading: "How to compare material suppliers",
    comparisonIntro:
      "Compare quotations on an identical specification and quantity, with delivery included, or the comparison will not be meaningful.",
    comparisonPoints: [
      {
        title: "Fix the specification first",
        body: "State the brand, grade, size, finish and quantity precisely, then ask every supplier to quote against that same specification rather than an approximate description.",
      },
      {
        title: "Include delivery in the price",
        body: "Ask whether transport to your site, unloading, minimum order quantity and staged delivery are included, since these frequently change which supplier is actually cheaper.",
      },
      {
        title: "Confirm stock and documentation",
        body: "Check current availability for the quantity you need, expected lead time, and what invoice, test certificate or warranty documentation is provided on delivery.",
      },
    ],
    faqs: [
      {
        question: "Are material prices shown on these listings?",
        answer:
          "No. Cement, steel, brick and aggregate rates move frequently and vary by quantity, brand and delivery distance. Request a current written quotation from each supplier for your exact specification.",
      },
      {
        question: "Can I check stock availability through this directory?",
        answer:
          "No. Stock changes continuously and is not tracked here. Contact the supplier directly to confirm current availability and lead time before planning around a delivery date.",
      },
      {
        question: "Does a listing confirm material quality or certification?",
        answer:
          "No. Directory inclusion does not certify products. Ask the supplier for brand, grade, applicable standard and any test certificate or warranty documentation, and check delivered material against the agreed specification.",
      },
    ],
  },
  {
    slug: "clothing-stores",
    href: getDirectoryCategoryHref("clothing-stores"),
    name: "Clothing Stores",
    priorityKeyword: "Clothing Stores in Nepal",
    title: "Clothing Stores in Nepal: Fashion and Garment Directory",
    metaDescription:
      "Clothing Stores in Nepal listed by city. Compare fashion outlets and garment suppliers, then confirm sizing, current stock, wholesale terms and exchange policy directly with the shop.",
    h1: "Clothing Stores in Nepal",
    aliases: [
      "clothing",
      "clothing store",
      "clothing stores",
      "fashion",
      "fashion store",
      "garment",
      "garments",
      "apparel",
      "apparels",
      "readymade",
      "saree",
      "sarees",
      "kurta",
      "pashmina",
      "woolens",
      "hosiery",
      "textile",
      "leather",
    ],
    quickAnswer:
      "Narrow by product type and city, then contact the shop to confirm current stock in your size, whether retail or wholesale terms apply, complete price and the written exchange or return policy before buying.",
    overviewHeading: "Retail, wholesale and made-to-order clothing",
    overview: [
      "Nepal's clothing sector spans retail outlets, boutiques, readymade collections, saree and kurta specialists, pashmina and woollen producers, leather goods and garment manufacturers supplying wholesale or export. A single directory heading covers very different businesses, so establish early whether a listing serves walk-in retail customers, bulk buyers or both.",
      "For retail, confirm size availability, fabric composition, care requirements and the exchange window before purchase, since policies differ substantially between shops. For wholesale or manufacturing enquiries, ask about minimum order quantity, sampling, lead time, fabric sourcing and payment terms rather than assuming a retail-style transaction.",
    ],
    comparisonHeading: "How to compare clothing suppliers",
    comparisonIntro:
      "Compare on the specific product and the transaction type you actually need, since retail and wholesale terms from the same business can differ completely.",
    comparisonPoints: [
      {
        title: "Establish retail or wholesale",
        body: "Confirm whether the business sells to individual customers, bulk buyers or both, and ask for the minimum order quantity where wholesale or manufacturing terms apply.",
      },
      {
        title: "Check fabric, sizing and stock",
        body: "Ask about fabric composition, available sizes, colours and current stock for the item you want, and whether stock can be held until you visit.",
      },
      {
        title: "Read the exchange terms first",
        body: "Confirm the exchange or return window, condition requirements and whether altered or sale items are excluded, before paying rather than afterwards.",
      },
    ],
    faqs: [
      {
        question: "Do these shops sell wholesale as well as retail?",
        answer:
          "Some do and some do not. This category includes retail outlets, boutiques and garment manufacturers. Ask the specific business whether wholesale terms and a minimum order quantity apply to your enquiry.",
      },
      {
        question: "Can I check size or colour availability in advance?",
        answer:
          "Not through this directory. Stock varies by branch and changes daily. Contact the shop directly to confirm the size and colour you need, and ask whether the item can be reserved.",
      },
      {
        question: "Is a directory listing a guarantee of product authenticity?",
        answer:
          "No. Directory inclusion does not authenticate individual products or brands. Check labelling, fabric composition, seller documentation and invoice for higher-value or branded purchases.",
      },
    ],
  },
  {
    slug: "footwear",
    href: getDirectoryCategoryHref("footwear"),
    name: "Footwear",
    priorityKeyword: "Shoe Shops in Nepal",
    title: "Shoe Shops in Nepal: Footwear Directory",
    metaDescription:
      "Shoe Shops in Nepal listed by city. Compare footwear retailers and suppliers, then confirm size availability, fit, materials, repair services and exchange terms directly.",
    h1: "Shoe Shops in Nepal",
    aliases: [
      "shoe",
      "shoes",
      "shoe store",
      "shoe shop",
      "footwear",
      "footwears",
      "sandal",
      "sandals",
      "boot",
      "boots",
      "cobbler",
      "shoe repair",
    ],
    quickAnswer:
      "Shortlist by footwear type and city, then contact the shop to confirm your size is in stock, check materials and construction, and read the exchange terms before purchase.",
    overviewHeading: "Buying footwear in Nepal",
    overview: [
      "This category includes retail shoe shops, footwear manufacturers and suppliers producing leather, canvas, school and formal footwear. Requirements differ sharply between a school shoe purchase, formal or occasion footwear, trekking and outdoor boots, and bulk or manufacturing enquiries.",
      "Size conventions vary between manufacturers and imported ranges, so trying footwear on or confirming the measured length matters more than relying on a stated size alone. For trekking and outdoor use in particular, check materials, sole construction, water resistance and whether the shop offers resoling or repair before committing to a purchase.",
    ],
    comparisonHeading: "How to compare footwear suppliers",
    comparisonIntro:
      "Compare on intended use and fit rather than headline price, since construction and materials determine whether footwear lasts.",
    comparisonPoints: [
      {
        title: "Confirm size and fit in person",
        body: "Sizing differs between local manufacturers and imported ranges. Try footwear on where possible, or confirm the measured internal length before ordering remotely.",
      },
      {
        title: "Check materials and construction",
        body: "Ask about upper material, sole type, stitching or cementing, and water resistance, particularly for trekking, outdoor or daily-wear footwear expected to last.",
      },
      {
        title: "Ask about repair and exchange",
        body: "Confirm whether the shop offers resoling or repair, and check the exchange window and condition requirements before paying.",
      },
    ],
    faqs: [
      {
        question: "Can I confirm my shoe size is in stock before visiting?",
        answer:
          "Not through this directory. Contact the shop directly, since stock by size and colour changes frequently and is not tracked here. Ask whether a pair can be held until you arrive.",
      },
      {
        question: "Do these businesses supply footwear in bulk?",
        answer:
          "Some listings are manufacturers or suppliers rather than retail outlets. Ask the specific business whether wholesale terms, minimum order quantity and lead times apply to your enquiry.",
      },
      {
        question: "Is shoe repair available at these shops?",
        answer:
          "It varies. Some retailers offer resoling or repair and others do not. Confirm directly with the shop, as repair services are not recorded on directory profiles.",
      },
    ],
  },
  {
    slug: "construction",
    href: getDirectoryCategoryHref("construction"),
    name: "Construction",
    priorityKeyword: "Construction Companies in Nepal",
    title: "Construction Companies in Nepal: Contractor Directory",
    metaDescription:
      "Construction Companies in Nepal listed by city. Compare contractors and engineering consultancies, then verify registration, licensing, insurance and a written scope of work.",
    h1: "Construction Companies in Nepal",
    aliases: [
      "construction",
      "contractor",
      "contractors",
      "builder",
      "builders",
      "engineering consultancy",
      "engineering services",
      "civil engineering",
      "prefab",
      "housing",
      "nirman",
    ],
    quickAnswer:
      "Shortlist contractors by scope and location, then verify company registration and professional licensing, ask for comparable completed projects, and require a written scope, programme and payment schedule before any work starts.",
    overviewHeading: "Appointing a contractor in Nepal",
    overview: [
      "This category covers building contractors, engineering and design consultancies, prefabricated construction specialists and construction service providers. Scope varies enormously, from a small renovation to a full structural build, and the right appointment depends on matching the contractor's demonstrated experience to your specific project type.",
      "Construction in Nepal is subject to municipal building permit requirements and the National Building Code, and seismic design compliance is a material consideration rather than an optional extra. Establish clearly who is responsible for obtaining permits and approvals, which registered engineer takes design and supervision responsibility, and how variations to the agreed scope will be priced and approved.",
    ],
    comparisonHeading: "How to compare contractors",
    comparisonIntro:
      "Compare on a single written scope of work. Quotations built on different assumptions about materials, finishes and exclusions cannot be compared meaningfully.",
    comparisonPoints: [
      {
        title: "Verify registration and licensing",
        body: "Confirm company registration, applicable contractor licensing class and the Nepal Engineering Council registration of the engineer taking design or supervision responsibility.",
      },
      {
        title: "Require a written scope and programme",
        body: "Insist on a documented scope, material specification, exclusions, programme and stage-linked payment schedule before work begins, and agree how variations are priced and authorised.",
      },
      {
        title: "Check permits, insurance and past work",
        body: "Clarify who obtains municipal permits and approvals, confirm insurance cover, and ask to visit or review comparable completed projects rather than relying on described experience.",
      },
    ],
    faqs: [
      {
        question: "Does a directory listing verify a contractor's licence?",
        answer:
          "No. A listing records that the business exists and passed the directory's publication checks. Verify company registration, contractor licensing and Nepal Engineering Council registration directly before appointing anyone.",
      },
      {
        question: "Who is responsible for obtaining building permits?",
        answer:
          "This must be agreed explicitly in writing. Municipal building permit requirements and National Building Code compliance apply to construction in Nepal, and responsibility for obtaining approvals should never be left ambiguous.",
      },
      {
        question: "How should construction payments be structured?",
        answer:
          "Link payments to verified completed stages set out in a written contract, rather than paying large sums up front. Agree in advance how variations to the scope are priced and authorised.",
      },
      {
        question: "Are project costs published on these listings?",
        answer:
          "No. Construction cost depends entirely on scope, specification, site conditions and programme. Obtain written quotations from several contractors against one identical scope of work.",
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
