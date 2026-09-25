import { getSortedBlogPosts, siteUrl, type BlogPost } from "@/lib/blog";

/**
 * List posts (posts carrying an `itemList`) rendered for llms.txt / llms-full.txt, so answer
 * engines can cite a specific, current list page for "best X in <city>" questions.
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
    "Each page answers \"who are the best <service> in <city>\" with a numbered list, where each business is based, what it does best and how to contact it.",
    "",
    ...posts.flatMap((post) => [
      `- [${clean(post.title)}](${siteUrl}${post.href}): ${clean(post.quickAnswer ?? post.description)} (updated ${post.modifiedAt})`,
      ...(withEntries
        ? post.itemList!.items.map(
            (item, index) =>
              `  ${index + 1}. ${clean(item.name)} — ${clean(item.area)}${item.telephone ? ` (${clean(item.telephone)})` : ""}`,
          )
        : []),
    ]),
    "",
  ];
}
