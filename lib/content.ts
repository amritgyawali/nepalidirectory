import { routes } from "@/lib/routes";

export type ContentPage = {
  slug: string;
  title: string;
  subtitle: string;
  body: string[];
  cta?: { label: string; href: string };
};

export const contentPages: Record<string, ContentPage> = {
  about: {
    slug: "about",
    title: "About Nepali Directory",
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
    cta: { label: "Read our directory methodology", href: routes.directoryMethodology }
  },
  contact: {
    slug: "contact",
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
    title: "Privacy Policy",
    subtitle: "How Nepali Directory handles account, listing, review and analytics data.",
    body: [
      "We collect the information required to operate directory search, account access, listing management, reviews, Q&A and support workflows.",
      "Business contact information may appear publicly when submitted for a listing. Personal account data is used for authentication, moderation, customer service and platform safety.",
      "We do not sell personal data. Advertising products are measured with aggregated reporting and privacy-aware analytics."
    ]
  },
  terms: {
    slug: "terms",
    title: "Terms of Service",
    subtitle: "The rules for using Nepali Directory, submitting content and managing business listings.",
    body: [
      "Users are responsible for accurate submissions, respectful reviews and lawful use of platform tools.",
      "Business owners may claim listings and request corrections. Nepali Directory can moderate content that is fraudulent, unsafe, abusive or unrelated to the listed business.",
      "Advertising placement does not change review ratings or community moderation standards."
    ]
  },
  help: {
    slug: "help",
    title: "Help Center",
    subtitle: "Fast answers for search, reviews, business claims, mobile app access and account settings.",
    body: [
      "Use the search bar to find businesses by category, name or service. Add a city or district to narrow results.",
      "Business owners can claim a listing, update hours, upload photos and respond to reviews from the dashboard.",
      "If you cannot access your account, reset your password or contact support with your registered email."
    ],
    cta: { label: "Claim your listing", href: routes.claimListing }
  }
};
