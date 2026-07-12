import { blogPosts } from "@/lib/blog";
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

export function suggestInternalLinks(): InternalLinkSuggestion[] {
  const suggestions: InternalLinkSuggestion[] = [];

  for (const post of blogPosts) {
    const postTokens = tokens([post.title, post.description, post.category, ...post.tags, ...post.keywords].join(" "));
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
