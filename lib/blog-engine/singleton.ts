/**
 * One blog-engine runtime per process (Next.js pages, admin actions, and any cron entrypoint all
 * need to share the same in-memory stores — a fresh `createBlogEngineRuntime()` per caller would
 * mean the editorial queue and published posts each request sees a different empty store). When
 * `DATABASE_URL` is set the underlying repos are Postgres-backed anyway, so this is purely a dev/
 * demo convenience, not a source of truth.
 */
import type { BlogPost as DisplayBlogPost } from "../blog";
import { createBlogEngineRuntime, type BlogEngineRuntime } from "./runtime";
import { toDisplayPost } from "./adapter";

const globalForBlogEngine = globalThis as typeof globalThis & {
  __nepaliDirectoryBlogEngine?: BlogEngineRuntime;
};

export function getDefaultBlogEngineRuntime(): BlogEngineRuntime {
  if (!globalForBlogEngine.__nepaliDirectoryBlogEngine) {
    globalForBlogEngine.__nepaliDirectoryBlogEngine = createBlogEngineRuntime();
  }
  return globalForBlogEngine.__nepaliDirectoryBlogEngine;
}

/** All PUBLISHED engine posts, in the same display shape as the curated `lib/blog.ts` posts. */
export async function getPublishedEnginePosts(): Promise<DisplayBlogPost[]> {
  const posts = await getDefaultBlogEngineRuntime().blogPosts.list({ status: "PUBLISHED" });
  return posts.map(toDisplayPost);
}

export async function getPublishedEnginePost(slug: string): Promise<DisplayBlogPost | null> {
  const posts = await getPublishedEnginePosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
