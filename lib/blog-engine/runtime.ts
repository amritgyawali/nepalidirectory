/**
 * Blog engine runtime (prompt Module D, §8): the acquisition runtime plus trend sources/items/
 * clusters/posts stores, registers TREND_SCAN / TREND_CLUSTER / BLOG_GENERATE on the shared
 * worker, and exposes `runDailySweep` — scan -> cluster -> select -> enqueue BLOG_GENERATE — the
 * orchestration a cron would call (prompt's `TREND_SCAN_CRON`, default 06:00 & 16:00 NPT).
 */
import { createAcquisitionRuntime, type AcquisitionRuntime, type AcquisitionRuntimeOverrides } from "../acquire";
import { InMemoryTrendSourceRepository } from "./stores/trend-sources";
import { InMemoryTrendItemRepository } from "./stores/trend-items";
import { InMemoryTrendClusterRepository } from "./stores/trend-clusters";
import { createBlogPostRepository } from "./stores/factory";
import { SEED_TREND_SOURCES } from "./sources/seed";
import { makeTrendScanHandler } from "./handlers/trend-scan";
import { makeTrendClusterHandler } from "./handlers/trend-cluster";
import { makeBlogGenerateHandler } from "./handlers/blog-generate";
import { selectClusters } from "./selector";
import { EditorialService } from "./editorial";
import type {
  BlogPostRepository,
  TrendClusterRepository,
  TrendItemRepository,
  TrendSourceRepository,
} from "./types";

export type BlogEngineRuntime = AcquisitionRuntime & {
  trendSources: TrendSourceRepository;
  trendItems: TrendItemRepository;
  trendClusters: TrendClusterRepository;
  blogPosts: BlogPostRepository;
  editorial: EditorialService;
  runDailySweep: (options?: BlogSweepOptions) => Promise<{ scanned: unknown; clustered: unknown; selected: number; generated: number }>;
};

export type BlogSweepOptions = {
  maxPerDay?: number;
};

export type BlogEngineRuntimeOverrides = AcquisitionRuntimeOverrides & {
  trendSources?: TrendSourceRepository;
  trendItems?: TrendItemRepository;
  trendClusters?: TrendClusterRepository;
  blogPosts?: BlogPostRepository;
  youtubeApiKey?: string;
};

export function createBlogEngineRuntime(overrides: BlogEngineRuntimeOverrides = {}): BlogEngineRuntime {
  const acquisition = createAcquisitionRuntime(overrides);

  const trendSources = overrides.trendSources ?? new InMemoryTrendSourceRepository(SEED_TREND_SOURCES);
  const trendItems = overrides.trendItems ?? new InMemoryTrendItemRepository();
  const trendClusters = overrides.trendClusters ?? new InMemoryTrendClusterRepository();
  const blogPosts = overrides.blogPosts ?? createBlogPostRepository();
  const editorial = new EditorialService(blogPosts);

  acquisition.worker
    .register(
      "TREND_SCAN",
      makeTrendScanHandler({
        sources: trendSources,
        items: trendItems,
        fetchFn: overrides.fetchFn,
        youtubeApiKey: overrides.youtubeApiKey,
      }),
    )
    .register("TREND_CLUSTER", makeTrendClusterHandler({ items: trendItems, clusters: trendClusters }))
    .register(
      "BLOG_GENERATE",
      makeBlogGenerateHandler({
        clusters: trendClusters,
        items: trendItems,
        posts: blogPosts,
        listings: acquisition.listings,
        prompts: acquisition.prompts,
        taxonomy: acquisition.taxonomy,
        siteName: acquisition.config.siteName,
        siteUrl: acquisition.config.siteUrl,
        fetchFn: overrides.fetchFn,
      }),
    );

  async function runDailySweep(options: BlogSweepOptions = {}) {
    await acquisition.repo.enqueue({ type: "TREND_SCAN" });
    const scanned = await acquisition.worker.runOnce();

    await acquisition.repo.enqueue({ type: "TREND_CLUSTER" });
    const clustered = await acquisition.worker.runOnce();

    const selected = await selectClusters({
      clusters: trendClusters,
      items: trendItems,
      prompts: acquisition.prompts,
      providers: acquisition.providers,
      taxonomy: acquisition.taxonomy,
      siteName: acquisition.config.siteName,
      maxPerDay: options.maxPerDay,
    });

    let generated = 0;
    for (const s of selected) {
      await acquisition.repo.enqueue({ type: "BLOG_GENERATE", payload: { clusterId: s.clusterId }, priority: 4 });
      const job = await acquisition.worker.runOnce();
      if (job?.status === "DONE") generated++;
    }

    return { scanned, clustered, selected: selected.length, generated };
  }

  return {
    ...acquisition,
    trendSources,
    trendItems,
    trendClusters,
    blogPosts,
    editorial,
    runDailySweep,
  };
}
