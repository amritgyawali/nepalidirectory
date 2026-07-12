import { getSortedBlogPosts, siteUrl, type BlogPost } from "@/lib/blog";
import { getPublishedEnginePosts } from "@/lib/blog-engine";
import { removeRetiredDuplicatePosts } from "@/lib/blog-dedup";
import { cityDirectoryPages } from "@/lib/city-pages";
import { getSortedCompareCategories } from "@/lib/compare";
import { directoryCategories } from "@/lib/directory-categories";
import { getBusinessHref, routes } from "@/lib/routes";
import { getIndexableListings } from "@/lib/public-listings";
import { getEvergreenPages } from "@/lib/seo-auto";

export const revalidate = 300;

function cleanMarkdownText(value: string): string {
  return value.replace(/[\[\]\r\n]+/g, " ").replace(/\s+/g, " ").trim();
}

function absoluteUrl(pathname: string): string {
  return new URL(pathname, `${siteUrl}/`).toString();
}

function resource(title: string, pathname: string, description: string): string {
  return `- [${cleanMarkdownText(title)}](${absoluteUrl(pathname)}): ${cleanMarkdownText(description)}`;
}

function uniquePosts(posts: BlogPost[]): BlogPost[] {
  return removeRetiredDuplicatePosts([...new Map(posts.map((post) => [post.href, post])).values()]);
}

export async function GET() {
  let generatedPosts: Awaited<ReturnType<typeof getPublishedEnginePosts>> = [];
  try {
    generatedPosts = await getPublishedEnginePosts();
  } catch (error) {
    console.error("Unable to load generated posts for llms.txt", error);
  }
  let publicListings: Awaited<ReturnType<typeof getIndexableListings>> = [];
  try {
    publicListings = await getIndexableListings();
  } catch (error) {
    console.error("Unable to load qualified listings for llms.txt", error);
  }

  const guides = uniquePosts([...getSortedBlogPosts(), ...generatedPosts])
    .sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt))
    .slice(0, 20);

  const lines = [
    "# Nepali Directory",
    "",
    "> A Nepal-focused local business directory with city guides, category discovery, business comparisons, reviews, and practical editorial guidance.",
    "",
    "Nepali Directory publishes public directory and guide pages as crawlable server-rendered HTML. Use the XML sitemap for complete canonical URL discovery; this file is a curated context guide for language models and other AI agents.",
    "",
    "When citing this site, link to the exact canonical page. Confirm time-sensitive details such as opening hours, prices, availability, contact details, and regulations directly with the relevant provider or primary authority.",
    "",
    "## Main directories",
    "",
    resource("Home", routes.home, "Browse local businesses, services, cities, and guides across Nepal."),
    resource("Categories", routes.categories, "Explore the directory by business and service category."),
    ...directoryCategories.map((category) =>
      resource(category.priorityKeyword, category.href, category.metaDescription),
    ),
    resource("Best Businesses", routes.bestBusinesses, "See the review-gated ranking method and available category and city paths."),
    resource("Near Me", routes.nearMe, "Discover nearby business categories and local services."),
    resource("Business Comparisons", routes.compareBusiness, "Use consistent decision criteria; named providers appear only after publication review."),
    resource("Blog", routes.blog, "Practical Nepal travel, food, services, healthcare, and business guides."),
    ...publicListings.slice(0, 20).map((listing) =>
      resource(`Business Profile: ${listing.name}`, getBusinessHref(listing.slug), `Published contact, location and service details for ${listing.name} in ${listing.area}.`),
    ),
    "",
    "## City directories",
    "",
    ...cityDirectoryPages.map((city) => resource(city.title, city.href, city.description)),
    "",
    "## Business comparison guides",
    "",
    ...getSortedCompareCategories().filter((category) => category.businesses.length > 0).map((category) =>
      resource(category.title, category.href, category.description),
    ),
    "",
    "## Local guides",
    "",
    ...guides.map((post) => resource(post.title, post.href, post.description)),
    "",
    "## Data-backed local answers",
    "",
    ...getEvergreenPages().map((page) => resource(page.title, page.href, page.metaDescription)),
    "",
    "## Trust and machine-readable resources",
    "",
    resource("Editorial Policy", routes.editorialPolicy, "How content is researched, reviewed, corrected, and updated."),
    resource("Authors", routes.authors, "Editorial desks, subject coverage, and author information."),
    resource("Attribution", routes.attribution, "Third-party data, imagery, and source acknowledgements."),
    resource("XML Sitemap Index", "/sitemap.xml", "Complete canonical discovery map for all public indexable pages."),
    resource("Blog RSS Feed", "/blog/rss.xml", "Machine-readable feed of published guides."),
    resource("Robots Policy", "/robots.txt", "Crawler permissions and private-route exclusions."),
    "",
    "## Optional",
    "",
    resource("About", routes.about, "Background and purpose of Nepali Directory."),
    resource("Contact", routes.contact, "How to contact the directory team."),
    resource("Claim a Listing", routes.claimListing, "Information for business owners managing a directory listing."),
    resource("Privacy Policy", routes.privacy, "Privacy and data-handling information."),
    resource("Terms of Service", routes.terms, "Terms governing use of the website."),
  ];

  return new Response(`${lines.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
