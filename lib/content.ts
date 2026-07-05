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
      "A modern local directory built for people who need reliable businesses, practical reviews and city-level guidance across Nepal.",
    body: [
      "Nepali Directory helps residents, travellers and business owners discover trusted local services with clear contact details, practical reviews, opening hours and neighborhood context.",
      "The platform is organized around verified listings, rich category pages, local Q&A and editorial city guides so discovery feels useful instead of noisy.",
      "We are building for long-term trust: cleaner listings, transparent advertising, helpful content and tools that make local businesses easier to reach."
    ],
    cta: { label: "Explore categories", href: routes.categories }
  },
  contact: {
    slug: "contact",
    title: "Contact Us",
    subtitle: "Questions, corrections, partnership ideas or listing support. Send the details and our team will route it quickly.",
    body: [
      "Email: hello@nepalidirectory.com",
      "Phone: (01) 555-0198",
      "Office: Kamaladi, Kathmandu, Nepal",
      "For listing corrections, include the business name, location, phone number and the update you want reviewed."
    ],
    cta: { label: "Request a callback", href: routes.requestCallback }
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
