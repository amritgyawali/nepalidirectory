/**
 * blog-engine module public surface (prompt Module D, §8).
 */
export type {
  ArticleType,
  BlogFaqEntry,
  BlogPost,
  BlogPostFactcheck,
  BlogPostRepository,
  BlogPostSeo,
  BlogPostStatus,
  NewBlogPost,
  NewTrendCluster,
  NewTrendItem,
  NewTrendSource,
  TrendCluster,
  TrendClusterRepository,
  TrendClusterStatus,
  TrendItem,
  TrendItemRepository,
  TrendSource,
  TrendSourceKind,
  TrendSourceRepository,
} from "./types";

export { InMemoryTrendSourceRepository } from "./stores/trend-sources";
export { InMemoryTrendItemRepository } from "./stores/trend-items";
export { InMemoryTrendClusterRepository } from "./stores/trend-clusters";
export { InMemoryBlogPostRepository } from "./stores/blog-posts";

export { SEED_TREND_SOURCES } from "./sources/seed";
export { fetchTrendSource, parseRss } from "./sources/fetchers";
export type { FetchedItem, FetcherDeps } from "./sources/fetchers";

export { isBrandSafe } from "./safety";
export { selectClusters } from "./selector";
export type { SelectedCluster, SelectorDeps } from "./selector";

export { buildSourcePack } from "./generate/source-pack";
export type { SourcePack } from "./generate/source-pack";
export { writeDraft } from "./generate/writer";
export type { WriterDraft, WriterVars } from "./generate/writer";
export { factCheck } from "./generate/factcheck";
export { buildSeo, isDuplicateEmbedding } from "./generate/seo";
export type { SeoResult } from "./generate/seo";
export { injectLinks } from "./generate/link-injection";
export type { LinkInjectionResult } from "./generate/link-injection";

export { makeTrendScanHandler } from "./handlers/trend-scan";
export type { TrendScanDeps } from "./handlers/trend-scan";
export { makeTrendClusterHandler } from "./handlers/trend-cluster";
export type { ClusterDeps } from "./handlers/trend-cluster";
export { makeBlogGenerateHandler } from "./handlers/blog-generate";
export type { BlogGenerateDeps } from "./handlers/blog-generate";

export { EditorialService, canAutoPublish } from "./editorial";
export {
  getAutoBlogPublisherStatus,
  runAutoBlogCycle,
  startAutoBlogPublisher,
  stopAutoBlogPublisher,
} from "./auto-publisher";
export type { AutoBlogCycleResult, AutoBlogPublisherStatus } from "./auto-publisher";

export { toDisplayPost, ENGINE_AUTHOR } from "./adapter";

export { createBlogEngineRuntime } from "./runtime";
export type { BlogEngineRuntime, BlogEngineRuntimeOverrides } from "./runtime";
export {
  getDefaultBlogEngineRuntime,
  getPublishedEnginePost,
  getPublishedEnginePosts,
} from "./singleton";
