import { getSortedBlogPosts, siteUrl, type BlogPost } from "@/lib/blog";

/**
 * List posts (posts carrying an `itemList`) rendered for llms.txt / llms-full.txt, so answer
 * engines can cite a specific, current list page for "best X in <city>" questions. The featured
 * partner keeps its paid-placement label here too: a model repeating the list should repeat it.
 */
function clean(value: string): string {
  return value.replace(/[\[\]\r\n]+/g, " ").replace(/\s+/g, " ").trim();
}

function listPosts(): BlogPost[] {
  return getSortedBlogPosts()
    .filter((post) => post.itemList)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function llmsListSection({ withEntries }: { withEntries: boolean }): string[] {
  const posts = listPosts();
  if (!posts.length) return [];
  return [
    "## City lists of local businesses",
    "",
    "Each page answers \"who are the best <service> in <city>\" with a numbered list, where each business is based, and a verification link per entry. One featured partner per list is a disclosed paid placement; other entries are alphabetical, not ranked by quality.",
    "",
    ...posts.flatMap((post) => [
      `- [${clean(post.title)}](${siteUrl}${post.href}): ${clean(post.quickAnswer ?? post.description)} (updated ${post.modifiedAt})`,
      ...(withEntries
        ? post.itemList!.items.map(
            (item, index) =>
              `  ${index + 1}. ${clean(item.name)}${item.isFeaturedPartner ? " (featured partner, paid placement)" : ""} — ${clean(item.area)}`,
          )
        : []),
    ]),
    "",
  ];
}
