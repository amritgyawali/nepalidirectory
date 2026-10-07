import { routes } from "@/lib/routes";

export type ContentSection = { heading: string; paragraphs: string[]; bullets?: string[] };

export type ContentPage = {
  slug: string;
  /** Canonical path; drives the WebPage `@id`, breadcrumb schema and FAQ anchors. */
  path: string;
  title: string;
  subtitle: string;
  /** schema.org WebPage subtype that best describes the page. */
  schemaType: "AboutPage" | "WebPage" | "ContactPage";
  /** One- or two-sentence direct answer shown first, written to be quotable by answer engines. */
  quickAnswer?: string;
  body: string[];
  sections?: ContentSection[];
  faqs?: Array<{ question: string; answer: string }>;
  relatedLinks?: Array<{ label: string; href: string }>;
  /** ISO date of the last substantive edit; shown on the page and emitted as dateModified. */
  updated: string;
  cta?: { label: string; href: string };
};

export const contentPages: Record<string, ContentPage> = {
  about: {
    slug: "about",
    path: routes.about,
    schemaType: "AboutPage",
    updated: "2026-10-07",
    title: "About Nepali Directory",
    quickAnswer:
      "Nepali Directory (NepaliDirectory.com) is an online business directory for Nepal. It organizes local businesses and services by category and city, publishes a named profile only after it passes source, category and completeness checks, and keeps advertising separate from editorial guidance.",
    subtitle:
      "A Nepal-focused directory built to make local business research clearer, more transparent and easier to verify.",
    body: [
      "Nepali Directory helps residents, travellers and organizations research businesses and services across Nepal. Category pages explain what to compare, city guides add local context, and qualified business profiles provide published facts when a record has enough source, location and contact evidence to go live.",
      "The directory is deliberately being built in stages. Preview records demonstrate the product but remain outside search-engine sitemaps, public rankings and LocalBusiness structured data. A named profile is published only after it passes the directory's active, category, completeness and provenance checks.",
      "Directory inclusion is not a government registration certificate, professional licence, safety approval or endorsement. For regulated or high-risk work, readers should verify the responsible person or organization through the appropriate Nepal authority and confirm current terms directly.",
      "Business information changes. Hours, staff, prices, menus, stock, service areas and contact details can become outdated even when they were accurate when collected. Pages therefore encourage direct confirmation and show source or review dates where the underlying record provides them.",
      "Owners can submit or claim a profile and provide stronger first-party information. Corrections should identify the business, location, field that needs changing and evidence that supports the update. Material changes remain subject to review rather than appearing automatically.",
      "Advertising should be visibly separate from independent editorial guidance. Payment does not create a verified badge, customer rating or editorial recommendation, and sponsored placement should not be described as an organic ranking.",
      "Our long-term goal is a useful Nepal business directory built from accurate profiles, transparent methods, original local research and accountable corrections—not inflated listing counts or repeated keyword pages."
    ],
    sections: [
      {
        heading: "What the directory covers",
        paragraphs: [
          "Nepali Directory covers everyday local categories such as restaurants, hotels, doctors and clinics, hospitals, schools, IT companies, shops and home-service providers, organized by city and province across Nepal."
        ],
        bullets: [
          "Category hubs explain what to compare before contacting a provider.",
          "City guides add neighbourhood and travel context for each location.",
          "Business profiles list published facts such as address, phone, hours and services.",
          "Local guides and comparisons answer common research questions in depth."
        ]
      },
      {
        heading: "How a profile gets published",
        paragraphs: [
          "Every named profile must identify a real business, match a relevant category, carry usable location and contact data, and come from a documented source such as an owner claim or a licensed dataset. Records that miss any of these checks stay out of search results, sitemaps and structured data."
        ]
      }
    ],
    faqs: [
      {
        question: "Who runs Nepali Directory?",
        answer:
          "Nepali Directory is operated by an independent editorial team focused on Nepal local search. Editorial standards, corrections and the publication methodology are documented on the editorial policy and directory methodology pages."
      },
      {
        question: "Is a listing on Nepali Directory an endorsement or a licence?",
        answer:
          "No. Inclusion is not a government registration, professional licence, safety approval or endorsement. Verify regulated providers with the appropriate Nepal authority and confirm current terms directly with the business."
      },
      {
        question: "Can businesses pay to rank higher?",
        answer:
          "No. Payment never buys an organic position, a verified badge or a customer rating. Any sponsored placement is labelled separately from directory results."
      }
    ],
    relatedLinks: [
      { label: "Directory methodology", href: routes.directoryMethodology },
      { label: "Editorial policy", href: routes.editorialPolicy },
      { label: "Data attribution", href: routes.attribution },
      { label: "Browse categories", href: routes.categories }
    ],
    cta: { label: "Read our directory methodology", href: routes.directoryMethodology }
  },
  contact: {
    slug: "contact",
    path: routes.contact,
    schemaType: "ContactPage",
    updated: "2026-07-15",
    title: "Contact Us",
    subtitle: "Questions, corrections, partnership ideas or listing support. Send the details and our team will route it quickly.",
    body: [
      "Nepali Directory does not publish a phone number, office address or support mailbox until that contact channel has been configured and verified.",
      "Business owners can currently use the listing claim workflow to submit ownership and correction information.",
      "For a correction, include the business name, exact location, field that needs changing and evidence supporting the requested update."
    ],
    cta: { label: "Submit or claim a listing", href: routes.claimListing }
  },
  privacy: {
    slug: "privacy",
    path: routes.privacy,
    schemaType: "WebPage",
    updated: "2026-10-07",
    title: "Privacy Policy",
    subtitle: "How Nepali Directory handles account, listing, review and analytics data.",
    quickAnswer:
      "Nepali Directory collects only the information needed to run search, accounts, listing management, reviews and support. It does not sell personal data, and business contact details are shown publicly only when they were submitted for a published listing.",
    body: [
      "We collect the information required to operate directory search, account access, listing management, reviews, Q&A and support workflows.",
      "Business contact information may appear publicly when submitted for a listing. Personal account data is used for authentication, moderation, customer service and platform safety.",
      "We do not sell personal data. Advertising products are measured with aggregated reporting and privacy-aware analytics."
    ],
    sections: [
      {
        heading: "Information we collect",
        paragraphs: ["The information we hold depends on how you use the directory:"],
        bullets: [
          "Account data: the email address and credentials you use to sign in, managed through our authentication provider.",
          "Listing submissions: business name, category, address, phone, email, website, hours, description and images that an owner submits for publication.",
          "Contributions: reviews, questions and answers you choose to post, together with the account that posted them.",
          "Search and assistant queries: the text you type into search or the directory assistant, used to return results.",
          "Technical data: standard server logs and browser security reports used to keep the site reliable and secure."
        ]
      },
      {
        heading: "How we use information",
        paragraphs: [
          "Information is used to provide and secure the service, review listings before publication, moderate contributions, answer support requests and improve search quality. Business details become public only when they belong to a profile that passes publication review."
        ]
      },
      {
        heading: "Cookies and local storage",
        paragraphs: [
          "Essential cookies keep you signed in and protect forms. We do not use third-party advertising cookies to track you across other websites."
        ]
      },
      {
        heading: "Sharing and service providers",
        paragraphs: [
          "We share data only with providers that host, store or process it on our behalf (for example database, hosting and, when enabled, AI text-processing services) and when the law requires it. We do not sell personal data."
        ]
      },
      {
        heading: "Your choices",
        paragraphs: [
          "You can ask us to correct or remove listing information you submitted, or to delete your account and its associated personal data, through the contact page. Some records may be retained where needed for security, fraud prevention or legal obligations."
        ]
      }
    ],
    faqs: [
      {
        question: "Does Nepali Directory sell my personal data?",
        answer: "No. Personal data is never sold. It is used only to operate, secure and improve the directory."
      },
      {
        question: "How do I remove my business or account information?",
        answer:
          "Send a request through the contact page identifying the listing or account. Submitted listing details can be corrected or removed, and account data can be deleted, subject to records kept for security or legal reasons."
      }
    ],
    relatedLinks: [
      { label: "Terms of service", href: routes.terms },
      { label: "Contact the team", href: routes.contact }
    ]
  },
  terms: {
    slug: "terms",
    path: routes.terms,
    schemaType: "WebPage",
    updated: "2026-10-07",
    title: "Terms of Service",
    subtitle: "The rules for using Nepali Directory, submitting content and managing business listings.",
    quickAnswer:
      "Use Nepali Directory lawfully, submit accurate information, and post honest reviews. Owners may claim and correct listings, the team may moderate fraudulent or abusive content, and advertising never changes ratings or organic results.",
    body: [
      "Users are responsible for accurate submissions, respectful reviews and lawful use of platform tools.",
      "Business owners may claim listings and request corrections. Nepali Directory can moderate content that is fraudulent, unsafe, abusive or unrelated to the listed business.",
      "Advertising placement does not change review ratings or community moderation standards."
    ],
    sections: [
      {
        heading: "Accounts",
        paragraphs: [
          "Keep your sign-in details secure and provide accurate information. You are responsible for activity under your account."
        ]
      },
      {
        heading: "Listings and ownership claims",
        paragraphs: [
          "Only a business owner or an authorized representative may claim a listing. Submitted details must be accurate and supported by evidence when requested. Every new or changed profile is reviewed before it appears publicly, and a claim may be declined if ownership cannot be confirmed."
        ]
      },
      {
        heading: "Reviews and community content",
        bullets: [
          "Reviews must describe a genuine first-hand experience.",
          "Do not post paid, incentivized, fake or retaliatory reviews.",
          "Do not post personal information, harassment, hate speech or illegal content.",
          "We may remove content that breaks these rules or is unrelated to the listed business."
        ],
        paragraphs: []
      },
      {
        heading: "Information accuracy",
        paragraphs: [
          "Business information can change. Directory content is provided for research and is not a guarantee of a provider's licence, safety, price or availability. Confirm important details directly with the business before booking or paying."
        ]
      },
      {
        heading: "Advertising",
        paragraphs: [
          "Paid placements are labelled and kept separate from organic results. Payment does not buy a verified badge, a rating or an editorial recommendation."
        ]
      }
    ],
    faqs: [
      {
        question: "Can anyone claim a business listing?",
        answer:
          "No. Only the owner or an authorized representative may claim a listing, and every claim passes ownership review before changes go live."
      },
      {
        question: "Can I remove a negative review of my business?",
        answer:
          "Reviews are not removed for being negative. A review can be reported if it is fake, abusive, off-topic or breaks the content rules, and it will be moderated against those rules."
      }
    ],
    relatedLinks: [
      { label: "Privacy policy", href: routes.privacy },
      { label: "Editorial policy", href: routes.editorialPolicy }
    ]
  },
  help: {
    slug: "help",
    path: routes.help,
    schemaType: "WebPage",
    updated: "2026-10-07",
    title: "Help Center",
    subtitle: "Fast answers for search, reviews, business claims, mobile app access and account settings.",
    quickAnswer:
      "Search by service and city to find a business, open a category or city hub to compare options, and use the claim-listing page to add or correct your own business. Every new or changed profile is reviewed before it goes live.",
    body: [
      "Use the search bar to find businesses by category, name or service. Add a city or district to narrow results.",
      "Business owners can claim a listing, update hours, upload photos and respond to reviews from the dashboard.",
      "If you cannot access your account, reset your password or contact support with your registered email."
    ],
    sections: [
      {
        heading: "Finding a business",
        paragraphs: ["The quickest routes to a relevant shortlist:"],
        bullets: [
          "Search with a service and a place, for example \"dentist in Lalitpur\".",
          "Browse category hubs to see what to compare before you call.",
          "Open a city guide for neighbourhood context and local categories.",
          "Read a comparison or local guide for deeper research on a decision."
        ]
      },
      {
        heading: "Adding or claiming your business",
        paragraphs: [
          "Open the claim-listing page, sign in, and submit your business name, category, address, phone, hours and a plain-language description. The profile is reviewed for ownership, category and completeness before it appears in search results."
        ]
      },
      {
        heading: "Corrections and account access",
        paragraphs: [
          "To correct a listing, send the business name, location, the field that is wrong and evidence for the change through the contact page. If you cannot sign in, use the password reset page with your registered email."
        ]
      }
    ],
    faqs: [
      {
        question: "How do I find a business on Nepali Directory?",
        answer:
          "Type a service or business name into search and add a city or district to narrow results, or browse the category and city hubs to compare options."
      },
      {
        question: "How long does it take for a new listing to appear?",
        answer:
          "A new or changed profile appears once it passes ownership, category and completeness review. Incomplete submissions are held until the missing details are supplied."
      },
      {
        question: "How do I report incorrect business information?",
        answer:
          "Use the contact page and include the business name, exact location, the field that needs changing and a source that supports the correction."
      },
      {
        question: "I forgot my password. What should I do?",
        answer: "Open the forgot-password page and request a reset link for the email address registered to your account."
      }
    ],
    relatedLinks: [
      { label: "Browse categories", href: routes.categories },
      { label: "Browse cities", href: routes.city },
      { label: "Contact the team", href: routes.contact },
      { label: "Pricing and plans", href: routes.pricing }
    ],
    cta: { label: "Claim your listing", href: routes.claimListing }
  }
};
