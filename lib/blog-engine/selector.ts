/**
 * Selection gate (prompt §8.3): code-level brand-safety hard filter first, then TREND_SELECTOR_V1
 * per "new" cluster, then the commercial-bridge rule (must map to >=1 real directory category),
 * capped at `BLOG_MAX_PER_DAY` (default 3). Not a queued job — there's no dedicated job type for
 * it (prompt's job types are TREND_SCAN / TREND_CLUSTER / BLOG_GENERATE), so the runtime calls
 * this directly and enqueues BLOG_GENERATE for whatever it selects.
 */
import type { ProviderRegistry } from "../ai-core/types";
import type { PromptRegistry } from "../ai-core/prompts/registry";
import { completeParsedJson } from "../ai-core/json";
import { isBrandSafe } from "./safety";
import type { ArticleType, TrendClusterRepository, TrendItemRepository } from "./types";

export type SelectorDeps = {
  clusters: TrendClusterRepository;
  items: TrendItemRepository;
  prompts: PromptRegistry;
  providers: ProviderRegistry;
  taxonomy: string[];
  siteName: string;
  maxPerDay?: number;
};

export type SelectedCluster = {
  clusterId: number;
  angle: string;
  articleType: ArticleType;
  targetCategorySlugs: string[];
};

const ARTICLE_TYPES: ArticleType[] = ["news_explainer", "guide", "listicle"];

export async function selectClusters(deps: SelectorDeps): Promise<SelectedCluster[]> {
  const maxPerDay = deps.maxPerDay ?? Number(process.env.BLOG_MAX_PER_DAY ?? 3);
  const newClusters = await deps.clusters.list({ status: "new" });
  const selected: SelectedCluster[] = [];

  for (const cluster of newClusters) {
    if (selected.length >= maxPerDay) break;

    const items = await deps.items.listByCluster(cluster.id);
    const headlineText = [cluster.label, ...items.map((i) => i.title), ...items.map((i) => i.summary ?? "")].join(" | ");
    if (!isBrandSafe(headlineText)) {
      await deps.clusters.update(cluster.id, { status: "skipped" });
      continue;
    }

    const template = deps.prompts.get("TREND_SELECTOR_V1");
    const rendered = deps.prompts.render("TREND_SELECTOR_V1", {
      site_name: deps.siteName,
      cluster_json: JSON.stringify({ label: cluster.label, headlines: items.slice(0, 10).map((i) => i.title) }),
      category_slugs: JSON.stringify(deps.taxonomy),
    });

    let parsed: {
      selected?: boolean;
      safety?: string;
      angle?: string;
      article_type?: string;
      target_category_slugs?: string[];
    };
    try {
      parsed = (await completeParsedJson(
        deps.providers,
        {
          taskKey: template.key,
          system: rendered.system,
          user: rendered.user,
          temperature: template.temperature,
          maxTokens: 400,
        },
        template.jsonSchema ?? "{}",
      )) as typeof parsed;
    } catch {
      await deps.clusters.update(cluster.id, { status: "skipped" });
      continue;
    }

    const targetSlugs = (parsed.target_category_slugs ?? []).filter((slug) => deps.taxonomy.includes(slug));
    const commercialBridge = targetSlugs.length > 0;
    const safe = parsed.safety !== "blocked";

    if (!parsed.selected || !safe || !commercialBridge) {
      await deps.clusters.update(cluster.id, { status: "skipped", selectorOutput: parsed });
      continue;
    }

    await deps.clusters.update(cluster.id, { status: "selected", selectorOutput: parsed });
    selected.push({
      clusterId: cluster.id,
      angle: parsed.angle ?? cluster.label,
      articleType: ARTICLE_TYPES.includes(parsed.article_type as ArticleType)
        ? (parsed.article_type as ArticleType)
        : "guide",
      targetCategorySlugs: targetSlugs,
    });
  }

  return selected;
}
