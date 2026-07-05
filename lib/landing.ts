export type LandingStat = {
  value: string;
  label: string;
};

export type LandingSection = {
  title: string;
  body: string;
  bullets: string[];
};

export type SeoLandingPage = {
  slug: string;
  href: string;
  title: string;
  seoTitle: string;
  description: string;
  image: string;
  imageAlt: string;
  keywords: string[];
  primaryCta: string;
  stats: LandingStat[];
  sections: LandingSection[];
  quickLinks: string[];
};

const image = (id: string, width = "1200", height = "760") =>
  `https://images.unsplash.com/${id}?w=${width}&h=${height}&fit=crop&auto=format`;

export const landingPages: SeoLandingPage[] = [
  {
    slug: "best-businesses",
    href: "/best-businesses",
    title: "Best businesses in Nepal",
    seoTitle: "Best Businesses in Nepal by Category, City, Rating and Reviews",
    description:
      "Browse the best businesses in Nepal across restaurants, hotels, doctors, contractors, salons, schools, travel agencies and home services.",
    image: image("photo-1556742049-0cfed4f6a45d"),
    imageAlt: "Local business owners serving customers",
    keywords: [
      "best businesses Nepal",
      "top businesses in Nepal",
      "best local businesses Kathmandu",
      "Nepal business directory",
      "verified businesses Nepal"
    ],
    primaryCta: "Explore best businesses",
    stats: [
      { value: "50K+", label: "directory listings" },
      { value: "7", label: "provinces" },
      { value: "4.6", label: "average featured rating" },
      { value: "24h", label: "listing updates" }
    ],
    sections: [
      {
        title: "Find high-intent local winners",
        body:
          "This page is built for people who want a shortlist before they call, book or visit. It groups strong local businesses by category, location, rating and practical fit.",
        bullets: ["Verified contact details", "Recent review signals", "Category-specific shortlists"]
      },
      {
        title: "Compare before you choose",
        body:
          "Use the business cards, comparison pages and local guides to move from broad discovery to a confident decision.",
        bullets: ["Ratings and review counts", "Best-for notes", "City and category paths"]
      }
    ],
    quickLinks: ["Restaurants", "Hotels", "Doctors", "Schools", "Contractors", "Beauty Salons"]
  },
  {
    slug: "near-me",
    href: "/near-me",
    title: "Find businesses near me in Nepal",
    seoTitle: "Businesses Near Me in Nepal: Restaurants, Doctors, Hotels and Services",
    description:
      "Find nearby restaurants, doctors, plumbers, electricians, hotels, salons and local services across Nepal with area-based discovery links.",
    image: image("photo-1524661135-423995f22d0b"),
    imageAlt: "Map and phone used for finding nearby businesses",
    keywords: [
      "businesses near me Nepal",
      "restaurants near me Kathmandu",
      "doctors near me Nepal",
      "plumbers near me Kathmandu",
      "local services near me Nepal"
    ],
    primaryCta: "Search near me",
    stats: [
      { value: "28", label: "Kathmandu neighborhoods" },
      { value: "15", label: "popular city links" },
      { value: "10+", label: "service groups" },
      { value: "Fast", label: "local discovery" }
    ],
    sections: [
      {
        title: "Start with the service and city",
        body:
          "Near-me search works best when the category and city are clear. Pick the service first, then narrow by neighborhood, opening hours and review quality.",
        bullets: ["Restaurants near you", "Emergency home services", "Clinics and pharmacies"]
      },
      {
        title: "Use practical local filters",
        body:
          "Distance is only one factor. Compare hours, phone availability, price level, photos and recent reviews before visiting.",
        bullets: ["Open-now intent", "Area coverage", "Call-ready listings"]
      }
    ],
    quickLinks: ["Kathmandu", "Pokhara", "Lalitpur", "Bhaktapur", "Chitwan", "Butwal"]
  },
  {
    slug: "top-rated",
    href: "/top-rated",
    title: "Top-rated businesses in Nepal",
    seoTitle: "Top-Rated Businesses in Nepal: Reviews, Ratings and Best Picks",
    description:
      "Explore top-rated businesses in Nepal with strong review signals, useful categories, city coverage and comparison paths.",
    image: image("photo-1551836022-d5d88e9218df"),
    imageAlt: "Customers reviewing a local business service",
    keywords: [
      "top rated businesses Nepal",
      "highest rated restaurants Kathmandu",
      "best reviewed hotels Nepal",
      "top rated local services Nepal",
      "Nepal reviews directory"
    ],
    primaryCta: "See top-rated listings",
    stats: [
      { value: "4.8", label: "top rating band" },
      { value: "1K+", label: "review-rich listings" },
      { value: "Daily", label: "fresh ranking checks" },
      { value: "Trust", label: "decision-first layout" }
    ],
    sections: [
      {
        title: "Ratings with context",
        body:
          "A rating is useful only when it is backed by enough reviews, recent activity and clear business information.",
        bullets: ["Review volume", "Recent customer signals", "Photos and service detail"]
      },
      {
        title: "Shortlist by real fit",
        body:
          "The best-rated option is not always the best for every job. Use best-for notes, area, price and category pages to find the right match.",
        bullets: ["Best overall", "Best value", "Best for urgent needs"]
      }
    ],
    quickLinks: ["Best Restaurants", "Best Hotels", "Best Clinics", "Best Contractors", "Best Schools", "Best Salons"]
  }
];

export function getLandingPage(slug: string) {
  return landingPages.find((page) => page.slug === slug);
}
