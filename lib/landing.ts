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
      { value: String(cityDirectoryPages.length), label: "city guide paths" },
      { value: String(categories.length), label: "category paths" },
      { value: "Area-first", label: "local discovery" },
      { value: "Review-gated", label: "public profiles" }
    ],
    sections: [
      {
        title: "Start with the service and city",
        body:
          "Near-me search works best when the category and city are clear. Pick the service first, then narrow by neighborhood, opening hours and reviewed profile facts.",
        bullets: ["Restaurants near you", "Emergency home services", "Clinics and pharmacies"]
      },
      {
        title: "Use practical local filters",
        body:
          "Distance is only one factor. Confirm hours, phone availability, service area and source-checked details before visiting.",
        bullets: ["Opening-hour intent", "Area coverage", "Contact-ready listings"]
      }
    ],
    quickLinks: ["Kathmandu", "Pokhara", "Lalitpur", "Bhaktapur", "Chitwan", "Butwal"]
  }
];

export function getLandingPage(slug: string) {
  return landingPages.find((page) => page.slug === slug);
}
