import { blogPosts, businesses, categories, cities, cityLinks, questions } from "@/lib/data";
import { footerGroups, getBusinessHref, routes } from "@/lib/routes";

export type SearchKind = "business" | "category" | "city" | "guide" | "question" | "page";

export type SearchRecord = {
  id: string;
  kind: SearchKind;
  title: string;
  description: string;
  href: string;
  location?: string;
  tags: string[];
  rating?: number;
  reviews?: number;
  status?: "open" | "closed" | "24h";
};

const corePages: SearchRecord[] = [
  {
    id: "page-near-me",
    kind: "page",
    title: "Near Me",
    description: "Find nearby businesses, services, restaurants and local providers.",
    href: routes.nearMe,
    location: "Nepal",
    tags: ["near me", "location", "business"]
  },
  {
    id: "page-map",
    kind: "page",
    title: "Map Directions",
    description: "Open the directory map and compare businesses by neighborhood.",
    href: routes.map,
    location: "Kathmandu",
    tags: ["map", "directions", "location"]
  },
  {
    id: "page-deals",
    kind: "page",
    title: "Deals & Offers",
    description: "Promotions from verified restaurants, hotels and service providers.",
    href: routes.deals,
    location: "Nepal",
    tags: ["deals", "offers", "discounts"]
  },
  {
    id: "page-events",
    kind: "page",
    title: "Local Events",
    description: "Community events, food festivals, business openings and local happenings.",
    href: routes.events,
    location: "Nepal",
    tags: ["events", "community", "local"]
  },
  {
    id: "page-dashboard",
    kind: "page",
    title: "Business Dashboard",
    description: "Manage listings, reviews, leads, analytics and advertising.",
    href: routes.dashboard,
    location: "Business owner",
    tags: ["admin", "dashboard", "listing management"]
  }
];

const footerPages = footerGroups.flatMap((group) =>
  group.links.map<SearchRecord>((link) => ({
    id: `page-${group.title}-${link.href}`,
    kind: "page",
    title: link.label,
    description: `${link.label} on Nepali Directory.`,
    href: link.href,
    location: "Nepal",
    tags: [group.title, link.label]
  }))
);

export const searchIndex: SearchRecord[] = [
  ...businesses.map<SearchRecord>((business) => ({
    id: `business-${business.slug}`,
    kind: "business",
    title: business.name,
    description: business.quote,
    href: getBusinessHref(business.slug),
    location: business.area,
    tags: [
      ...business.categories,
      ...business.amenities,
      ...(business.serviceAreas ?? []),
      ...(business.services ?? []),
      ...(business.specialties ?? []),
      ...(business.paymentMethods ?? []),
      ...(business.languages ?? []),
      ...(business.credentials ?? []),
      business.neighborhood ?? "",
      business.address,
      business.hoursToday,
      business.coupons?.length ? "coupons deals offers discount" : "",
      business.claimed ? "claimed owner verified" : "",
      business.delivery ? "delivery order online" : ""
    ].filter(Boolean),
    rating: business.rating,
    reviews: business.reviews,
    status: business.status
  })),
  ...categories.map<SearchRecord>((category) => ({
    id: `category-${category.name}`,
    kind: "category",
    title: category.name,
    description: `Browse the ${category.name.toLowerCase()} category in Nepal.`,
    href: category.href,
    location: "Nepal",
    tags: ["category", category.name]
  })),
  ...cities.map<SearchRecord>((city) => ({
    id: `city-${city.name}`,
    kind: "city",
    title: city.name,
    description: `Open the ${city.name} city directory and local guide.`,
    href: city.href,
    location: city.name,
    tags: ["city", "province", city.name]
  })),
  ...cityLinks.map<SearchRecord>((city) => ({
    id: `city-link-${city}`,
    kind: "city",
    title: city,
    description: `Browse businesses and services in ${city}.`,
    href: routes.city,
    location: city,
    tags: ["city", city]
  })),
  ...blogPosts.map<SearchRecord>((post) => ({
    id: `guide-${post.slug}`,
    kind: "guide",
    title: post.title,
    description: post.excerpt,
    href: post.href,
    location: "Nepal",
    tags: [post.category, "blog", "guide"]
  })),
  ...questions.map<SearchRecord>((question) => ({
    id: `question-${question.title}`,
    kind: "question",
    title: question.title,
    description: question.excerpt,
    href: question.href,
    location: "Community",
    tags: [question.topic, "question", "answer"]
  })),
  ...corePages,
  ...footerPages
];

const normalize = (value: string) => value.toLowerCase().trim();
const variantsFor = (term: string) => {
  const variants = new Set([term]);
  if (term.endsWith("s") && term.length > 3) variants.add(term.slice(0, -1));
  if (term.endsWith("ies") && term.length > 4) variants.add(`${term.slice(0, -3)}y`);
  return [...variants];
};

export function searchRecords(query: string, location: string, kind: SearchKind | "all" = "all") {
  const q = normalize(query);
  const where = normalize(location);
  const terms = q.split(/\s+/).filter(Boolean);
  const locationTerms = where.split(/[,\s]+/).filter((term) => term.length > 2);

  const seenIds = new Set<string>();

  return searchIndex
    .map((record) => {
      const haystack = normalize(
        [record.title, record.description, record.location, ...record.tags, record.kind].join(" ")
      );
      const locationText = normalize([record.location, ...record.tags].join(" "));
      const kindMatch = kind === "all" || record.kind === kind;
      const queryMatch =
        terms.length === 0 ||
        terms.every((term) => variantsFor(term).some((variant) => haystack.includes(variant)));
      const kathmanduValleyMatch =
        where.includes("kathmandu") &&
        ["business", "category", "guide", "question", "page"].includes(record.kind);
      const locationMatch =
        !where ||
        kathmanduValleyMatch ||
        locationText.includes(where) ||
        where.includes(locationText) ||
        locationTerms.some((term) => locationText.includes(term));

      let score = 0;
      if (q && normalize(record.title).includes(q)) score += 60;
      if (terms.some((term) => variantsFor(term).some((variant) => normalize(record.title).includes(variant)))) {
        score += 25;
      }
      if (record.kind === "business") score += 12;
      if (record.rating) score += record.rating * 4;
      if (record.status === "open" || record.status === "24h") score += 5;

      return { record, score, matches: kindMatch && queryMatch && locationMatch };
    })
    .filter((entry) => entry.matches)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.record)
    .filter((record) => {
      if (seenIds.has(record.id)) {
        return false;
      }

      seenIds.add(record.id);
      return true;
    });
}
