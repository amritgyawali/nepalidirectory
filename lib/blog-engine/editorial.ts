/**
 * Editorial workflow (prompt §8.5): `DRAFT -> REVIEW -> PUBLISHED | REJECTED`. Publish/reject are
 * always human (admin) actions; `canAutoPublish` is the gate a future auto-publish cron would use
 * once `BLOG_AUTOPUBLISH=true` — which stays false by default (prompt §0.4/§20.8).
 */
import type { BlogPost, BlogPostRepository } from "./types";

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

/** BLOG_AUTOPUBLISH gate (prompt §8.5): fact-check `pass` AND selector confidence >= 0.8. */
export function canAutoPublish(post: BlogPost, autopublishEnabled: boolean): boolean {
  return autopublishEnabled && post.factcheck?.verdict === "pass" && post.confidence >= autopublishMinConfidence();
}
