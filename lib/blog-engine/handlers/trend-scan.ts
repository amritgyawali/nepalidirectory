/**
 * TREND_SCAN job handler (prompt §8.1): fetch all active trend sources, normalize into
 * `trend_items`, dedupe by URL hash, and embed title+summary for clustering.
 */
import type { JobHandler } from "../../ai-core/worker";
import type { ProviderRegistry } from "../../ai-core/types";
import type { FetchFn } from "../../ai-core/providers/http";
import type { TrendItemRepository, TrendSourceRepository } from "../types";
import { fetchTrendSource } from "../sources/fetchers";

export type TrendScanDeps = {
  sources: TrendSourceRepository;
  items: TrendItemRepository;
  fetchFn?: FetchFn;
  youtubeApiKey?: string;
};

export function makeTrendScanHandler(deps: TrendScanDeps): JobHandler {
  return async ({ providers }: { providers: ProviderRegistry }) => {
    const fetchFn = deps.fetchFn ?? fetch;
    const activeSources = await deps.sources.list({ active: true });

    let fetched = 0;
    let created = 0;
    let deduped = 0;
    let embedFailures = 0;

    for (const source of activeSources) {
      const fetchedItems = await fetchTrendSource(source, { fetchFn, youtubeApiKey: deps.youtubeApiKey });
      await deps.sources.recordFetch(source.id, true); // failures already swallowed -> "fetch attempted"
      fetched += fetchedItems.length;

      for (const item of fetchedItems) {
        const text = `${item.title}\n${item.summary ?? ""}`.trim();
        // Embedding is best-effort: it only sharpens clustering/dedup (the cluster handler treats an
        // item with no vector as its own singleton group, and blog-generate's dedup already tolerates
        // missing embeddings). A rate-limited or unavailable embedding provider must NOT fail the whole
        // scan — otherwise a single 429 on the free tier poisons the trend pipeline for every source.
        let embedding: number[] | undefined;
        try {
          embedding = await providers.embedder().embed(text);
        } catch {
          embedding = undefined;
          embedFailures++;
        }
        const inserted = await deps.items.create({
          sourceId: source.id,
          title: item.title,
          url: item.url,
          summary: item.summary,
          publishedAt: item.publishedAt,
          embedding,
        });
        if (inserted) created++;
        else deduped++;
      }
    }

    return { sourcesScanned: activeSources.length, fetched, created, deduped, embedFailures };
  };
}
