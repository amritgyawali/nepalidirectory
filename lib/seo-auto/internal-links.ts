import { blogPosts, type BlogPost } from "@/lib/blog";
import { compareCategories, type CompareCategory } from "@/lib/compare";
import { directoryCategories } from "@/lib/directory-categories";

export type InternalLinkSuggestion = {
  sourceTitle: string;
  sourceHref: string;
  targetTitle: string;
  targetHref: string;
  score: number;
  reason: string;
};

function tokens(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((part) => part.length > 2),
  );
}

function overlapScore(a: Set<string>, b: Set<string>): number {
  let overlap = 0;
  for (const token of a) {
    if (b.has(token)) overlap++;
  }
  const union = new Set([...a, ...b]).size || 1;
  return overlap / union;
}

function postTokenText(post: BlogPost): string {
  return [post.title, post.description, post.category, ...post.tags, ...post.keywords].join(" ");
}

export function suggestInternalLinks(): InternalLinkSuggestion[] {
  const suggestions: InternalLinkSuggestion[] = [];

  for (const post of blogPosts) {
    const postTokens = tokens(postTokenText(post));
    for (const page of directoryCategories) {
      const pageTokens = tokens(`${page.priorityKeyword} ${page.name} ${page.aliases.join(" ")}`);
      const score = overlapScore(postTokens, pageTokens);
      const explicitlyTagged = post.categorySlugs?.includes(page.slug) ?? false;
      const boosted = Math.min(0.95, explicitlyTagged ? Math.max(0.55, score + 0.35) : score);
      if (boosted >= 0.18) {
        suggestions.push({
          sourceTitle: post.title,
          sourceHref: post.href,
          targetTitle: page.title,
          targetHref: page.href,
          score: Number(boosted.toFixed(2)),
          reason: explicitlyTagged
            ? `${post.title} is explicitly tagged for the ${page.name} directory.`
            : `${post.category} context overlaps with ${page.priorityKeyword}.`,
        });
      }
    }
  }

  return suggestions.sort((a, b) => b.score - a.score).slice(0, 25);
}

const MIN_COMPARE_LINK_SCORE = 0.18;

function compareTokenText(category: CompareCategory): string {
  return `${category.category} ${category.title} ${category.criteria.join(" ")}`;
}

/**
 * Compare-business hubs a blog post should link out to. Unlike categories and cities, blog posts
 * carry no `compareSlugs` tag field, so this is content-overlap-scored rather than explicit —
 * fills the one remaining gap in `cluster.md`'s "blog / city hub / compare-business hub" triangle
 * (city linking already exists via `post.citySlugs` + `getGuidesForCity`, category linking via
 * `post.categorySlugs` + `getGuidesForCategory`; only the compare-business leg was unwired).
 */
export function relatedCompareHubsForPost(post: BlogPost, limit = 2): Array<{ title: string; href: string }> {
  const postTokens = tokens(postTokenText(post));
  return compareCategories
    .filter((category) => category.businesses.length > 0)
    .map((category) => ({ category, score: overlapScore(postTokens, tokens(compareTokenText(category))) }))
    .filter(({ score }) => score >= MIN_COMPARE_LINK_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ category }) => ({ title: category.title, href: category.href }));
}

/** Blog posts related to a compare-business hub, for that hub's "Related guides" block. */
export function relatedPostsForCompareHub(category: CompareCategory, limit = 4): BlogPost[] {
  const hubTokens = tokens(compareTokenText(category));
  return blogPosts
    .map((post) => ({ post, score: overlapScore(tokens(postTokenText(post)), hubTokens) }))
    .filter(({ score }) => score >= MIN_COMPARE_LINK_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}
