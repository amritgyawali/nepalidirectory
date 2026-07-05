import { blogPosts, siteUrl } from "@/lib/blog";

export type ContentAuthor = {
  name: string;
  slug: string;
  role: string;
  description: string;
  knowsAbout: string[];
};

export const contentAuthors: ContentAuthor[] = [
  {
    name: "NepaliDirectory Team",
    slug: "team",
    role: "AI-assisted editorial team",
    description:
      "NepaliDirectory Team publishes AI-assisted articles that are grounded in cited sources, fact-checked and controlled by configured quality gates. See the editorial policy for the full process.",
    knowsAbout: ["Local trends", "Nepal business directory", "Editorial review", "Fact-checking"]
  },
  {
    name: "Nepali Directory Travel Desk",
    slug: "travel-desk",
    role: "Travel and city guide editors",
    description:
      "The Travel Desk maintains practical Nepal travel, trekking, hotel and city guide content for Nepali Directory.",
    knowsAbout: ["Nepal travel", "Trekking routes", "Hotels", "City guides", "Local transport"]
  },
  {
    name: "Nepali Directory Food Desk",
    slug: "food-desk",
    role: "Restaurant and food guide editors",
    description:
      "The Food Desk reviews restaurant, cafe and local dining information for people comparing places to eat in Nepal.",
    knowsAbout: ["Kathmandu restaurants", "Newari food", "Cafes", "Local dining", "Food reviews"]
  },
  {
    name: "Nepali Directory Services Desk",
    slug: "services-desk",
    role: "Home services and contractor editors",
    description:
      "The Services Desk maintains contractor, repair, plumbing, electrical and home service decision guides.",
    knowsAbout: ["Home services", "Contractors", "Plumbers", "Electricians", "Repair checklists"]
  },
  {
    name: "Nepali Directory Business Desk",
    slug: "business-desk",
    role: "Business listing and local growth editors",
    description:
      "The Business Desk writes about directory listings, customer calls, local visibility and profile quality for Nepal businesses.",
    knowsAbout: ["Business listings", "Local visibility", "Reviews", "Customer leads", "Directory profiles"]
  },
  {
    name: "Nepali Directory Health Desk",
    slug: "health-desk",
    role: "Healthcare directory editors",
    description:
      "The Health Desk maintains non-diagnostic healthcare directory guidance for comparing clinics, hospitals and appointments.",
    knowsAbout: ["Healthcare directories", "Clinics", "Hospitals", "Dental clinics", "Patient logistics"]
  },
  {
    name: "Nepali Directory SEO Desk",
    slug: "seo-desk",
    role: "Local SEO and search visibility editors",
    description:
      "The SEO Desk writes practical local SEO and business profile guidance for Nepal-based organizations.",
    knowsAbout: ["Local SEO", "Business citations", "Reviews", "Google Business Profile", "Directory SEO"]
  },
  {
    name: "Nepali Directory Events Desk",
    slug: "events-desk",
    role: "Events and wedding planning editors",
    description:
      "The Events Desk maintains wedding, venue and event vendor comparison guidance for Nepal.",
    knowsAbout: ["Wedding planning", "Venues", "Event vendors", "Photography", "Decor planning"]
  },
  {
    name: "Nepali Directory Education Desk",
    slug: "education-desk",
    role: "Education and school guide editors",
    description:
      "The Education Desk maintains school, admission and parent decision guides for Nepal.",
    knowsAbout: ["Schools", "Admissions", "Curriculum", "Parent checklists", "Student support"]
  }
];

export function getAuthorByName(name: string) {
  return contentAuthors.find((author) => author.name === name) ?? contentAuthors[0];
}

export function getAuthorBySlug(slug: string) {
  return contentAuthors.find((author) => author.slug === slug);
}

export function getAuthorUrl(author: ContentAuthor) {
  return `${siteUrl}/authors/${author.slug}`;
}

export function getPostsByAuthor(author: ContentAuthor) {
  return blogPosts.filter((post) => post.author === author.name);
}
