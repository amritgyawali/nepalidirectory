/**
 * TREND_CLUSTER job handler (prompt §8.2): greedy agglomerative clustering (cosine >= 0.82) over
 * the last 72h of trend items, scored by `ln(1+item_count) * source_diversity *
 * recency_decay(halflife 24h)`; stores the top 20 as `trend_clusters(status='new')`.
 */
import type { JobHandler } from "../../ai-core/worker";
import { cosineSimilarity } from "../../acquire";
import type { TrendClusterRepository, TrendItem, TrendItemRepository } from "../types";

export type ClusterDeps = {
  items: TrendItemRepository;
  clusters: TrendClusterRepository;
  windowHours?: number;
  cosineThreshold?: number;
  maxClusters?: number;
  clusterHalfLifeHours?: number;
  now?: () => Date;
};

type ItemGroup = { items: TrendItem[] };

function groupItems(items: TrendItem[], threshold: number): ItemGroup[] {
  const groups: ItemGroup[] = [];
  for (const item of items) {
    let joined = false;
    if (item.embedding) {
      for (const g of groups) {
        const rep = g.items.find((i) => i.embedding);
        if (rep?.embedding && cosineSimilarity(rep.embedding, item.embedding) >= threshold) {
          g.items.push(item);
          joined = true;
          break;
        }
      }
    }
    if (!joined) groups.push({ items: [item] });
  }
  return groups;
}

function scoreGroup(g: ItemGroup, now: Date, halfLifeHours: number): { label: string; score: number } {
  const itemCount = g.items.length;
  const sourceDiversity = new Set(g.items.map((i) => i.sourceId)).size;
  const mostRecentMs = g.items.reduce((max, i) => {
    const t = (i.publishedAt ?? i.createdAt).getTime();
    return t > max ? t : max;
  }, 0);
  const ageHours = Math.max(0, (now.getTime() - mostRecentMs) / 3_600_000);
  const recencyDecay = Math.pow(0.5, ageHours / halfLifeHours);
  const score = Math.log(1 + itemCount) * sourceDiversity * recencyDecay;
  return { label: g.items[0].title, score };
}

export function makeTrendClusterHandler(deps: ClusterDeps): JobHandler {
  return async () => {
    const now = deps.now ? deps.now() : new Date();
    const windowHours = deps.windowHours ?? 72;
    const threshold = deps.cosineThreshold ?? 0.82;
    const maxClusters = deps.maxClusters ?? 20;
    const halfLifeHours = deps.clusterHalfLifeHours ?? 24;
    const since = new Date(now.getTime() - windowHours * 3_600_000);

    const items = await deps.items.listSince(since);
    const groups = groupItems(items, threshold);
    const scored = groups
      .map((g) => ({ group: g, ...scoreGroup(g, now, halfLifeHours) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, maxClusters);

    const clusterIds: number[] = [];
    for (const s of scored) {
      const cluster = await deps.clusters.create({
        label: s.label,
        score: s.score,
        itemCount: s.group.items.length,
      });
      await deps.items.setCluster(s.group.items.map((i) => i.id), cluster.id);
      clusterIds.push(cluster.id);
    }

    return {
      itemsConsidered: items.length,
      clustersFormed: groups.length,
      clustersStored: clusterIds.length,
    };
  };
}
