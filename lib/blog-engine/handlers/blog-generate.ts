/**
 * BLOG_GENERATE job handler (prompt §8.4): runs the remaining 4 generation passes for one
 * already-selected cluster — source pack, draft (+ one auto-revision on a failed fact-check),
 * SEO/uniqueness, and deterministic link injection — then files the result as `blog_posts`
 * status REVIEW. Never creates a PUBLISHED post; that is always a human editorial action
 * (`../editorial.ts`), matching `BLOG_AUTOPUBLISH=false` (prompt §8.5).
 */
import type { JobHandler } from "../../ai-core/worker";
import type { ProviderRegistry } from "../../ai-core/types";
import type { PromptRegistry } from "../../ai-core/prompts/registry";
import type { FetchFn } from "../../ai-core/providers/http";
import type { ListingRepository } from "../../enrich";
import type { ArticleType, BlogPostRepository, TrendClusterRepository, TrendItemRepository } from "../types";
import { buildSourcePack } from "../generate/source-pack";
import { writeDraft } from "../generate/writer";
import { factCheck } from "../generate/factcheck";
import { baseSlug, buildSeo, isDuplicateEmbedding } from "../generate/seo";
import { injectLinks } from "../generate/link-injection";

export type BlogGenerateDeps = {
  clusters: TrendClusterRepository;
  items: TrendItemRepository;
  posts: BlogPostRepository;
  listings: ListingRepository;
  prompts: PromptRegistry;
  taxonomy: string[];
  siteName: string;
  siteUrl: string;
  fetchFn?: FetchFn;
};

const ARTICLE_TYPES: ArticleType[] = ["news_explainer", "guide", "listicle"];

export function makeBlogGenerateHandler(deps: BlogGenerateDeps): JobHandler {
  return async ({ job, providers }: { job: { payload: unknown }; providers: ProviderRegistry }) => {
    const clusterId = Number((job.payload as { clusterId?: unknown }).clusterId);
    if (!Number.isFinite(clusterId)) throw new Error("BLOG_GENERATE: payload.clusterId required");

    const cluster = await deps.clusters.get(clusterId);
    // Clusters live only in this process's in-memory store, but the job queue is Postgres-persistent.
    // A BLOG_GENERATE job left over from a previous process/cycle points at a cluster that no longer
    // exists and can NEVER succeed — discard it (job DONE) instead of throwing, which would retry it
    // four times as a high-priority PENDING job and starve the current cycle's real generate job.
    if (!cluster) return { clusterId, discarded: "cluster-missing" };

    const selectorOutput = (cluster.selectorOutput ?? {}) as {
      angle?: string;
      article_type?: string;
      target_category_slugs?: string[];
    };
    const angle = selectorOutput.angle ?? cluster.label;
    const articleType: ArticleType = ARTICLE_TYPES.includes(selectorOutput.article_type as ArticleType)
      ? (selectorOutput.article_type as ArticleType)
      : "guide";
    const targetCategorySlugs = selectorOutput.target_category_slugs ?? [];

    const clusterItems = await deps.items.listByCluster(clusterId);
    const sourcePack = await buildSourcePack(clusterItems, deps.fetchFn ?? fetch);

    let draft = await writeDraft(providers, deps.prompts, {
      siteName: deps.siteName,
      angle,
      articleType,
      targetCategorySlugs,
      sourcePack: sourcePack.text,
    });

    let factcheck = await factCheck(providers, deps.prompts, sourcePack.text, draft.bodyMarkdown);
    if (factcheck.verdict === "revise") {
      const note = factcheck.unsupportedClaims.map((c) => `"${c.claim}" (${c.why})`).join("; ");
      draft = await writeDraft(
        providers,
        deps.prompts,
        {
          siteName: deps.siteName,
          angle,
          articleType,
          targetCategorySlugs,
          sourcePack: sourcePack.text,
        },
        `Remove or fix these unsupported claims: ${note}`,
      );
      factcheck = await factCheck(providers, deps.prompts, sourcePack.text, draft.bodyMarkdown);
      // A second `revise` still files to REVIEW with the claims attached — never auto-rejected.
    }

    let embedding: number[] | undefined;
    try {
      embedding = await providers.embedder().embed(draft.bodyMarkdown);
    } catch {
      embedding = undefined;
    }
    const existingPosts = await deps.posts.list();
    const existingEmbeddings = existingPosts.map((p) => p.embedding).filter((e): e is number[] => Boolean(e));
    if (embedding && isDuplicateEmbedding(embedding, existingEmbeddings)) {
      await deps.clusters.update(clusterId, { status: "generated" });
      return { clusterId, discarded: "duplicate" };
    }
    // Embedding-independent guard: if a post already maps to this exact base slug, discard rather
    // than publish a near-identical article under a `-2` slug. This is what keeps the fixed fallback
    // topics from re-publishing across serverless cold starts when no embedding provider is set.
    const base = baseSlug(draft);
    if (existingPosts.some((p) => p.slug === base)) {
      await deps.clusters.update(clusterId, { status: "generated" });
      return { clusterId, discarded: "duplicate-slug" };
    }

    const seo = buildSeo(draft, new Set(existingPosts.map((p) => p.slug)));
    const allListings = await deps.listings.all();
    const linked = injectLinks(draft.bodyMarkdown, deps.taxonomy, allListings, {
      ensureMinLinks: 3, // prompt §8.4.5: every published post carries 3–8 internal links.
      preferredCategorySlugs: targetCategorySlugs,
    });

    const post = await deps.posts.create({
      slug: seo.slug,
      title: seo.title,
      excerpt: draft.excerpt,
      bodyMd: linked.bodyMarkdown,
      lang: "en",
      status: "REVIEW",
      heroImageUrl: `/blog/engine-og/${seo.slug}`,
      seo: { metaTitle: seo.metaTitle, metaDescription: seo.metaDescription, keywords: seo.keywords },
      sources: sourcePack.urls,
      clusterId,
      articleType,
      authorType: "ai_assisted",
      factcheck,
      confidence: draft.confidence,
      embedding,
      categories: [...new Set([...draft.keywords, ...draft.categories, ...linked.categoriesLinked])].slice(0, 12),
      faq: draft.faq.map((f) => ({ question: f.q, answer: f.a })),
      linksInjected: linked.linksInjected,
    });

    await deps.clusters.update(clusterId, { status: "generated" });

    return {
      clusterId,
      postId: post.id,
      slug: post.slug,
      status: post.status,
      factcheckVerdict: factcheck.verdict,
      linksInjected: linked.linksInjected,
    };
  };
}
