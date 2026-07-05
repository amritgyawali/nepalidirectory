import { loadAiConfig } from "../ai-core";
import { canAutoPublish } from "./editorial";
import type { BlogEngineRuntime } from "./runtime";
import { getDefaultBlogEngineRuntime } from "./singleton";

type AutoBlogPostResult = {
  id: number;
  slug: string;
  title: string;
  publishedAt?: string;
};

type FallbackGenerateResult = {
  generated: boolean;
  reason?: string;
};

export type AutoBlogCycleResult = {
  published: boolean;
  reason?: string;
  sweep?: {
    selected: number;
    generated: number;
  };
  post?: AutoBlogPostResult;
};

export type AutoBlogPublisherStatus = {
  running: boolean;
  inFlight: boolean;
  intervalMs: number;
  nextRunAt?: string;
  lastStartedAt?: string;
  lastFinishedAt?: string;
  lastResult?: AutoBlogCycleResult;
  lastError?: string;
  publishedCount: number;
  stoppedReason?: string;
};

type AutoBlogState = {
  timer: ReturnType<typeof setTimeout> | null;
  inFlight: boolean;
  running: boolean;
  nextRunAt?: Date;
  lastStartedAt?: Date;
  lastFinishedAt?: Date;
  lastResult?: AutoBlogCycleResult;
  lastError?: string;
  publishedCount: number;
  stoppedReason?: string;
};

const DEFAULT_INTERVAL_MS = 3 * 60 * 1000;
const REVIEWED_BY = "auto-publisher";
const FALLBACK_URL = "https://www.nepalidirectory.com/editorial-policy#auto-blog-source";
const FALLBACK_TOPICS = [
  {
    angle: "How to compare local services in Nepal before booking",
    categories: ["restaurants", "hotels", "plumbers", "electricians"],
  },
  {
    angle: "Questions to ask before choosing a restaurant or cafe in Nepal",
    categories: ["restaurants", "cafes", "hotels"],
  },
  {
    angle: "How to compare repair providers in Nepal before hiring",
    categories: ["plumbers", "electricians", "home-services"],
  },
  {
    angle: "How to compare clinics and appointments in Nepal",
    categories: ["clinics", "hospitals", "dental-clinics"],
  },
  {
    angle: "How to compare event venues and vendors in Nepal",
    categories: ["event-venues", "wedding-venues", "photographers"],
  },
] as const;

const globalForAutoBlog = globalThis as typeof globalThis & {
  __nepaliDirectoryAutoBlog?: AutoBlogState;
};

function state(): AutoBlogState {
  if (!globalForAutoBlog.__nepaliDirectoryAutoBlog) {
    globalForAutoBlog.__nepaliDirectoryAutoBlog = {
      timer: null,
      inFlight: false,
      running: false,
      publishedCount: 0,
    };
  }
  return globalForAutoBlog.__nepaliDirectoryAutoBlog;
}

function configuredIntervalMs(): number {
  const n = Number(process.env.BLOG_AUTOPUBLISH_INTERVAL_MS);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_INTERVAL_MS;
}

function status(): AutoBlogPublisherStatus {
  const s = state();
  return {
    running: s.running,
    inFlight: s.inFlight,
    intervalMs: configuredIntervalMs(),
    nextRunAt: s.nextRunAt?.toISOString(),
    lastStartedAt: s.lastStartedAt?.toISOString(),
    lastFinishedAt: s.lastFinishedAt?.toISOString(),
    lastResult: s.lastResult,
    lastError: s.lastError,
    publishedCount: s.publishedCount,
    stoppedReason: s.stoppedReason,
  };
}

function clearScheduledRun() {
  const s = state();
  if (s.timer) clearTimeout(s.timer);
  s.timer = null;
  s.nextRunAt = undefined;
}

function scheduleNextRun(delayMs = configuredIntervalMs()) {
  const s = state();
  clearScheduledRun();
  s.nextRunAt = new Date(Date.now() + delayMs);
  s.timer = setTimeout(() => {
    const current = state();
    current.timer = null;
    current.nextRunAt = undefined;
    void runScheduledCycle();
  }, delayMs);
}

async function runScheduledCycle() {
  const result = await runAutoBlogCycle();
  const s = state();
  if (result.published && s.running) {
    scheduleNextRun();
    return;
  }

  s.running = false;
  s.stoppedReason = result.reason ?? "Previous blog was not published successfully.";
}

function pickFallbackCategories(taxonomy: string[], preferred: readonly string[]): string[] {
  const picked = preferred.filter((slug) => taxonomy.includes(slug));
  return picked.length ? picked.slice(0, 4) : taxonomy.filter((slug) => slug !== "uncategorized").slice(0, 4);
}

async function seedFallbackCluster(runtime: BlogEngineRuntime): Promise<number | null> {
  const existingPosts = await runtime.blogPosts.list();
  const topic = FALLBACK_TOPICS[existingPosts.length % FALLBACK_TOPICS.length];
  const categories = pickFallbackCategories(runtime.taxonomy, topic.categories);
  if (categories.length === 0) return null;

  const cluster = await runtime.trendClusters.create({
    label: topic.angle,
    score: 1,
    itemCount: 1,
  });
  await runtime.trendClusters.update(cluster.id, {
    status: "selected",
    selectorOutput: {
      selected: true,
      safety: "ok",
      angle: topic.angle,
      article_type: "guide",
      target_category_slugs: categories,
      confidence: 0.9,
      reason: "Fallback directory utility topic when live trend selection is empty.",
    },
  });

  const item = await runtime.trendItems.create({
    sourceId: 0,
    title: "NepaliDirectory local service comparison source note",
    url: `${FALLBACK_URL}-${Date.now()}`,
    summary:
      "NepaliDirectory helps readers compare Nepal businesses by category, city, neighborhood, " +
      "contact completeness, review signals, service notes, owner-managed status and public " +
      "profile quality. Practical local-service articles should tell readers to confirm hours, " +
      "availability, exact prices, safety requirements and booking terms directly with the provider " +
      "before visiting or hiring. Useful comparison topics include restaurants, hotels, repair " +
      "services, clinics, event venues and travel services because readers often need shortlists, " +
      "questions to ask and checks to make before choosing.",
    publishedAt: new Date(),
  });
  if (!item) return cluster.id;
  await runtime.trendItems.setCluster([item.id], cluster.id);
  return cluster.id;
}

async function generateOneFallbackPost(runtime: BlogEngineRuntime): Promise<FallbackGenerateResult> {
  const clusterId = await seedFallbackCluster(runtime);
  if (!clusterId) return { generated: false, reason: "No fallback categories were available." };
  await runtime.repo.enqueue({ type: "BLOG_GENERATE", payload: { clusterId }, priority: 4 });
  const job = await runtime.worker.runOnce();
  if (job?.status === "DONE") return { generated: true };
  return {
    generated: false,
    reason: job ? `Fallback BLOG_GENERATE ended as ${job.status}: ${job.error ?? "no error detail"}` : "No job was claimed.",
  };
}

export async function runAutoBlogCycle(): Promise<AutoBlogCycleResult> {
  const s = state();
  if (s.inFlight) {
    return { published: false, reason: "An auto-blog cycle is already running." };
  }

  const config = loadAiConfig();
  if (!config.enabled) return { published: false, reason: "AI_ENABLED is off." };
  if (!config.blogEngineEnabled) return { published: false, reason: "BLOG_ENGINE_ENABLED is off." };
  if (!config.blogAutopublish) return { published: false, reason: "BLOG_AUTOPUBLISH is off." };

  s.inFlight = true;
  s.lastStartedAt = new Date();
  s.lastError = undefined;

  try {
    const runtime = getDefaultBlogEngineRuntime();
    const before = new Set((await runtime.blogPosts.list()).map((post) => post.id));
    let sweep = await runtime.runDailySweep({ maxPerDay: 1 });
    let fallbackReason: string | undefined;
    let generatedReviewPosts = (await runtime.blogPosts.list({ status: "REVIEW" }))
      .filter((post) => !before.has(post.id))
      .sort((a, b) => b.id - a.id);
    let postToPublish = generatedReviewPosts.find((post) => canAutoPublish(post, true));
    if (!postToPublish) {
      const fallback = await generateOneFallbackPost(runtime);
      fallbackReason = fallback.reason;
      sweep = {
        ...sweep,
        selected: fallback.generated ? Math.max(1, sweep.selected) : sweep.selected,
        generated: fallback.generated ? 1 : 0,
      };
      generatedReviewPosts = (await runtime.blogPosts.list({ status: "REVIEW" }))
        .filter((post) => !before.has(post.id))
        .sort((a, b) => b.id - a.id);
      postToPublish = generatedReviewPosts.find((post) => canAutoPublish(post, true));
    }

    if (!postToPublish) {
      const rejected = generatedReviewPosts[0];
      s.lastResult = {
        published: false,
        reason: rejected
          ? `Generated post ${rejected.id} did not pass the autopublish gate.`
          : fallbackReason ?? "No REVIEW post was generated.",
        sweep: { selected: sweep.selected, generated: sweep.generated },
      };
      return s.lastResult;
    }

    await runtime.editorial.publish(postToPublish.id, REVIEWED_BY);
    const published = await runtime.blogPosts.get(postToPublish.id);
    s.publishedCount += 1;
    s.lastResult = {
      published: true,
      sweep: { selected: sweep.selected, generated: sweep.generated },
      post: {
        id: postToPublish.id,
        slug: postToPublish.slug,
        title: postToPublish.title,
        publishedAt: published?.publishedAt?.toISOString(),
      },
    };
    return s.lastResult;
  } catch (error) {
    s.lastError = error instanceof Error ? error.message : String(error);
    s.lastResult = { published: false, reason: s.lastError };
    return s.lastResult;
  } finally {
    s.inFlight = false;
    s.lastFinishedAt = new Date();
  }
}

export function startAutoBlogPublisher(delayMs = configuredIntervalMs()): AutoBlogPublisherStatus {
  const s = state();
  s.running = true;
  s.stoppedReason = undefined;
  if (!s.timer && !s.inFlight) scheduleNextRun(delayMs);
  return status();
}

export function stopAutoBlogPublisher(reason = "Stopped manually."): AutoBlogPublisherStatus {
  const s = state();
  s.running = false;
  s.stoppedReason = reason;
  clearScheduledRun();
  return status();
}

export function getAutoBlogPublisherStatus(): AutoBlogPublisherStatus {
  return status();
}
