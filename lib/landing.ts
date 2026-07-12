import { cityDirectoryPages } from "@/lib/city-pages";
import { categories } from "@/lib/data";

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
    seoTitle: "Best Businesses in Nepal: Review-Gated Directory Method",
    description:
      "Explore how Nepali Directory qualifies the best businesses in Nepal, then browse reviewed profiles by category and city as they become available.",
    image: image("photo-1556742049-0cfed4f6a45d"),
    imageAlt: "Local business owners serving customers",
    keywords: [
      "best businesses Nepal",
      "top businesses in Nepal",
      "best local businesses Kathmandu",
      "verified businesses Nepal"
    ],
    primaryCta: "Explore best businesses",
    stats: [
      { value: "Review-gated", label: "public rankings" },
      { value: String(cityDirectoryPages.length), label: "city guides" },
      { value: String(categories.length), label: "category paths" },
      { value: "Direct", label: "detail confirmation" }
    ],
    sections: [
      {
        title: "How a business qualifies",
        body:
          "A named business can enter public category and city results only after its source, location, category and profile completeness pass the directory's publication checks.",
        bullets: ["Meaningful source provenance", "Reviewed category and location", "Complete public details"]
      },
      {
        title: "How future rankings work",
        body:
          "Ranked pages publish only when enough qualified profiles support a useful comparison. Ratings are considered with review volume, completeness and practical fit instead of being treated as a guarantee.",
        bullets: ["Minimum inventory gates", "Transparent comparison fields", "Direct detail confirmation"]
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
      { value: String(cityDirectoryPages.length), label: "reviewed city guides" },
      { value: String(categories.length), label: "category paths" },
      { value: "Area-first", label: "local discovery" },
      { value: "Review-gated", label: "public profiles" }
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
      { value: String(categories.length), label: "search categories" },
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
