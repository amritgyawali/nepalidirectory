/**
 * Editorial workflow (prompt §8.5): `DRAFT -> REVIEW -> PUBLISHED | REJECTED`. Publish/reject are
 * always human (admin) actions; `canAutoPublish` is the gate a future auto-publish cron would use
 * once `BLOG_AUTOPUBLISH=true` — which stays false by default (prompt §0.4/§20.8).
 */
import type { BlogPost, BlogPostRepository } from "./types";

const ABSOLUTE_MIN_PUBLIC_WORDS = 700;
const MIN_PUBLIC_SOURCES = 2;
const MIN_PUBLIC_HEADINGS = 4;
const MIN_PUBLIC_FAQS = 2;
const MIN_PUBLIC_INTERNAL_LINKS = 3;

function autopublishMinConfidence(): number {
  const n = Number(process.env.BLOG_AUTOPUBLISH_MIN_CONFIDENCE);
  // Environment configuration may make the gate stricter, never weaker than the editorial floor.
  return Number.isFinite(n) && n >= 0 && n <= 1 ? Math.max(0.8, n) : 0.8;
}

function autopublishMinListings(): number {
  const configured = Number(process.env.BLOG_AUTOPUBLISH_MIN_LISTINGS);
  // A directory should establish its core product before automatically expanding editorial URLs.
  return Number.isFinite(configured) && configured >= 0
    ? Math.max(25, Math.floor(configured))
    : 50;
}

function publicMinWords(): number {
  const configured = Number(process.env.BLOG_PUBLIC_MIN_WORDS);
  // An environment flag may demand more depth, but it cannot reopen the thin fallback drafts.
  return Number.isFinite(configured) && configured >= 0
    ? Math.max(ABSOLUTE_MIN_PUBLIC_WORDS, Math.floor(configured))
    : ABSOLUTE_MIN_PUBLIC_WORDS;
}

function markdownWordCount(markdown: string): number {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*_>`~|{}\[\]()]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

/**
 * Public quality floor for AI-assisted engine posts. Curated articles use a separate reviewed
 * dataset; this gate prevents short fallback drafts from reaching archives, feeds and sitemaps.
 */
export function meetsPublicEnginePostQuality(post: BlogPost): boolean {
  const uniqueSources = new Set(post.sources.filter((source) => /^https?:\/\//i.test(source)));
  const headingCount = post.bodyMd.match(/^##\s+\S/gm)?.length ?? 0;
  const factcheckPassed =
    post.factcheck?.verdict === "pass" && post.factcheck.unsupportedClaims.length === 0;

  return Boolean(
    factcheckPassed &&
      markdownWordCount(post.bodyMd) >= publicMinWords() &&
      headingCount >= MIN_PUBLIC_HEADINGS &&
      uniqueSources.size >= MIN_PUBLIC_SOURCES &&
      post.faq.length >= MIN_PUBLIC_FAQS &&
      post.linksInjected >= MIN_PUBLIC_INTERNAL_LINKS &&
      post.seo.metaTitle.trim() &&
      post.seo.metaDescription.trim(),
  );
}

export function canAutoPublishForListingCount(qualifiedListingCount: number): boolean {
  return qualifiedListingCount >= autopublishMinListings();
}

export class EditorialService {
  constructor(private readonly posts: BlogPostRepository) {}

  async publish(id: number, reviewedBy: string): Promise<void> {
    const post = await this.posts.get(id);
    if (!post) throw new Error(`editorial: no post ${id}`);
    if (post.status !== "REVIEW") throw new Error(`editorial: post ${id} is not in REVIEW`);
    await this.posts.update(id, { status: "PUBLISHED", reviewedBy, publishedAt: new Date() });
  }

  async reject(id: number, reviewedBy: string): Promise<void> {
    const post = await this.posts.get(id);
    if (!post) throw new Error(`editorial: no post ${id}`);
    if (post.status !== "REVIEW") throw new Error(`editorial: post ${id} is not in REVIEW`);
    await this.posts.update(id, { status: "REJECTED", reviewedBy });
  }

  async edit(
    id: number,
    patch: Partial<Pick<BlogPost, "title" | "excerpt" | "bodyMd" | "seo" | "categories" | "faq">>,
  ): Promise<void> {
    await this.posts.update(id, patch);
  }
}

/** BLOG_AUTOPUBLISH gate: editorial evidence, substantive depth and confidence >= 0.8. */
export function canAutoPublish(post: BlogPost, autopublishEnabled: boolean): boolean {
  return (
    autopublishEnabled &&
    post.confidence >= autopublishMinConfidence() &&
    meetsPublicEnginePostQuality(post)
  );
}
