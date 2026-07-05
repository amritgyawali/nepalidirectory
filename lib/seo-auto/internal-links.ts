import { blogPosts } from "@/lib/blog";
import { getEvergreenPages } from "./evergreen";
import { slugify } from "./slug";

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

export function suggestInternalLinks(): InternalLinkSuggestion[] {
  const pages = getEvergreenPages({ minListings: 3 });
  const suggestions: InternalLinkSuggestion[] = [];

  for (const post of blogPosts) {
    const postTokens = tokens([post.title, post.description, post.category, ...post.tags, ...post.keywords].join(" "));
    for (const page of pages) {
      const pageTokens = tokens(`${page.categoryName} ${page.cityName} ${page.notableLocalities.join(" ")}`);
      const score = overlapScore(postTokens, pageTokens);
      const categorySlug = slugify(post.category);
      const boosted = categorySlug === page.categorySlug ? score + 0.35 : score;
      if (boosted >= 0.18 && boosted <= 0.9) {
        suggestions.push({
          sourceTitle: post.title,
          sourceHref: post.href,
          targetTitle: page.title,
          targetHref: page.href,
          score: Number(boosted.toFixed(2)),
          reason: `${post.category} context overlaps with ${page.categoryName} in ${page.cityName}.`,
        });
      }
    }
  }

  return suggestions.sort((a, b) => b.score - a.score).slice(0, 25);
}
