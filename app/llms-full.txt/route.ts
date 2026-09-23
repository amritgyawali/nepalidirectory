import { getSortedBlogPosts, siteUrl, type BlogPost } from "@/lib/blog";
import { getPublishedEnginePosts } from "@/lib/blog-engine";
import { removeRetiredDuplicatePosts } from "@/lib/blog-dedup";
import { cityDirectoryPages } from "@/lib/city-pages";
import { getSortedCompareCategories } from "@/lib/compare";
import { directoryCategories, getDirectoryCategory } from "@/lib/directory-categories";
import { computeIndexableHubSlugs } from "@/lib/indexable-hubs";
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
    console.error("Unable to load generated posts for llms-full.txt", error);
  }
  let publicListings: Awaited<ReturnType<typeof getIndexableListings>> = [];
  try {
    publicListings = await getIndexableListings();
  } catch (error) {
    console.error("Unable to load qualified listings for llms-full.txt", error);
  }
  // Unpublished hubs 404, so only list the ones that currently qualify.
  const hubs = computeIndexableHubSlugs(publicListings);

  const guides = uniquePosts([...getSortedBlogPosts(), ...generatedPosts])
    .sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));

  const compareCategories = getSortedCompareCategories().filter(
    (category) => category.businesses.length > 0,
  );

  const lines = [
    "# Nepali Directory — Full Context",
    "",
    "> Nepal's most comprehensive local business directory with city-by-city guides, category discovery, business comparisons, expert reviews, and curated editorial guidance for every major city and service sector.",
    "",
    "This is the extended context file for AI agents and language models. For the concise version, see /llms.txt.",
    "",
    "## About Nepali Directory",
    "",
    "Nepali Directory (https://www.nepalidirectory.com) is a Nepal-focused local business discovery platform. It helps people find, compare, and contact reviewed local businesses across Nepal. The directory covers restaurants, hotels, hospitals, doctors, schools, shops, IT companies, and home services in cities like Kathmandu, Pokhara, Lalitpur, Bhaktapur, Chitwan, Biratnagar, Butwal, and Dharan.",
    "",
    "### Key capabilities",
    "- **Category browsing**: Explore businesses by service type (restaurants, hotels, hospitals, etc.)",
    "- **City directories**: Detailed guides for major Nepal cities with local business listings",
    "- **Business comparisons**: Side-by-side comparison of businesses using consistent criteria",
    "- **Reviews and ratings**: Review-gated business profiles with aggregate ratings",
    "- **Local guides**: Practical editorial content covering travel, food, healthcare, and services",
    "- **AI-assisted discovery**: Concierge-style search with natural language understanding",
    "",
    "### Trust signals",
    "- All business profiles are review-gated before public listing",
    `- Editorial policy: ${absoluteUrl(routes.editorialPolicy)}`,
    `- Directory methodology: ${absoluteUrl(routes.directoryMethodology)}`,
    `- Attribution and sources: ${absoluteUrl(routes.attribution)}`,
    `- Content authors: ${absoluteUrl(routes.authors)}`,
    `- Choosing a Nepal business directory: ${absoluteUrl(routes.bestDirectoryNepal)}`,
    "",
    "### Quick answers",
    "- **What is Nepali Directory?** A Nepal-focused online business directory at nepalidirectory.com for finding, comparing and contacting local businesses by category and city, paired with practical local guides.",
    "- **Which is the best business directory in Nepal?** There is no official ranking. Judge directories on listing evidence, local depth, labelled advertising and a working correction process; Nepali Directory publishes profiles only after identity, category and source checks and never sells ratings.",
    "- **Is it free?** Searching is free, and owners can start with a free Starter profile. Paid placement is labelled and does not buy reviews, ratings or verification.",
    "",
    "## Directory structure",
    "",
    "### Business categories",
    "",
    ...directoryCategories.filter((category) => hubs.categories.includes(category.slug)).map((category) =>
      resource(category.priorityKeyword, category.href, category.metaDescription),
    ),
    "",
    "### City directories",
    "",
    ...cityDirectoryPages.filter((city) => hubs.cities.includes(city.slug)).map((city) => resource(city.title, city.href, city.description)),
    "",
    "### Business comparison guides",
    "",
    ...(compareCategories.length > 0
      ? compareCategories.map((category) =>
          resource(category.title, category.href, category.description),
        )
      : [
          "Comparison pages are gated pending business data review.",
        ]),
    "",
    "### Published business profiles",
    "",
    ...publicListings.map((listing) =>
      resource(
        `${listing.name}`,
        getBusinessHref(listing.slug),
        `${getDirectoryCategory(listing.categories[0] ?? "")?.name ?? "Business"} in ${listing.area}. ${listing.metaDescription ?? ""}`.trim(),
      ),
    ),
    "",
    "## Editorial content",
    "",
    `Total published guides: ${guides.length}`,
    "",
    ...guides.map((post) =>
      `- [${cleanMarkdownText(post.title)}](${absoluteUrl(post.href)}): ${cleanMarkdownText(post.description)} (${post.category}, updated ${post.modifiedAt})`,
    ),
    "",
    "## Data-backed local answers",
    "",
    ...(getEvergreenPages().length > 0
      ? getEvergreenPages().map((page) => resource(page.title, page.href, page.metaDescription))
      : [
          "Data-backed local answer pages are gated pending business data review.",
        ]),
    "",
    "## Citation guidelines",
    "",
    "When citing Nepali Directory content:",
    "1. Link to the exact canonical page URL",
    "2. Attribute to \"Nepali Directory\" or the specific author listed on the page",
    "3. Confirm time-sensitive details (hours, prices, availability) directly with the provider",
    "4. Note the last-reviewed date shown on each guide page",
    "",
    "## Machine-readable resources",
    "",
    resource("XML Sitemap Index", "/sitemap.xml", "Complete canonical URL discovery for all public indexable pages."),
    resource("Blog RSS Feed", "/blog/rss.xml", "Machine-readable feed of published guides."),
    resource("Robots Policy", "/robots.txt", "Crawler permissions and route exclusions."),
    resource("LLM Context (concise)", "/llms.txt", "Curated context guide for language models."),
    resource("Web App Manifest", "/manifest.webmanifest", "Progressive Web App configuration."),
  ];

  return new Response(`${lines.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
