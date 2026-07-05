/**
 * Adapts a PUBLISHED engine `BlogPost` (this module's `./types`) into the display shape the
 * existing hand-curated blog pages already render (`lib/blog.ts` `BlogPost` + its JSON-LD). This
 * is how prompt §8.6 ("manual publish renders with valid Article JSON-LD and >=3 internal links")
 * is satisfied without duplicating the page/schema code that already exists for the curated posts.
 */
import type { BlogPost as DisplayBlogPost } from "../blog";
import type { BlogPost as EnginePost } from "./types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=675&fit=crop&auto=format";

function markdownToSections(md: string): { heading: string; paragraphs: string[] }[] {
  const blocks = md
    .split(/\n(?=##\s+)/)
    .map((b) => b.trim())
    .filter(Boolean);
  if (blocks.length === 0) {
    return [{ heading: "Overview", paragraphs: [md.trim() || "This guide is being prepared."] }];
  }
  return blocks.map((block) => {
    const lines = block.split("\n");
    const heading = lines[0].replace(/^##\s+/, "").trim() || "Overview";
    const paragraphs = lines
      .slice(1)
      .join("\n")
      .split(/\n{2,}/)
      .map((p) => p.replace(/^#+\s*/, "").trim())
      .filter(Boolean);
    return { heading, paragraphs: paragraphs.length ? paragraphs : [block] };
  });
}

function estimateReadTime(bodyMd: string): string {
  const words = bodyMd.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/** The byline every AI-assisted engine post carries (prompt §8.5). */
export const ENGINE_AUTHOR = "NepaliDirectory Team";

export function toDisplayPost(post: EnginePost): DisplayBlogPost {
  const publishedDate = post.publishedAt ?? post.createdAt;
  const isoDate = publishedDate.toISOString().slice(0, 10);
  const keywords = [...new Set([...(post.seo.keywords ?? []), ...post.categories])].filter(Boolean);

  return {
    title: post.title,
    seoTitle: post.seo.metaTitle || post.title,
    slug: post.slug,
    href: `/blog/${post.slug}`,
    category: post.categories[0] ?? "Guides",
    excerpt: post.excerpt,
    description: post.seo.metaDescription || post.excerpt,
    image: post.heroImageUrl ?? FALLBACK_IMAGE,
    imageAlt: post.title,
    date: formatDate(publishedDate),
    publishedAt: isoDate,
    modifiedAt: isoDate,
    readTime: estimateReadTime(post.bodyMd),
    author: ENGINE_AUTHOR,
    keywords,
    tags: keywords,
    sections: markdownToSections(post.bodyMd),
    faqs: post.faq.map((f) => ({ question: f.question, answer: f.answer })),
  };
}
