"use client";

import {
  BookOpenText,
  BrainCircuit,
  FileText,
  GitMerge,
  Globe,
  Languages,
  Link2,
  MessageSquareReply,
  MessagesSquare,
  Newspaper,
  Search,
  ShieldAlert,
  Sparkles,
  Store,
  Wand2,
} from "lucide-react";
import { useEffect, useState, type ComponentType } from "react";

type RuntimeConfig = {
  enabled: boolean;
  publicAiFallback: boolean;
  blogEngineEnabled: boolean;
  blogAutopublish: boolean;
  conciergeEnabled: boolean;
  crawlerEnabled: boolean;
};

type Metrics = {
  blog: { total: number; published: number; review: number; aiAssisted: number; links: number };
  listings: { total: number; enriched: number };
  reviewSummaries: number;
  ownerReplies: number;
  seoIntros: number;
  linkSuggestions: number;
  jobs: Record<string, number>;
  usage: { calls: number; inTok: number; outTok: number; cacheHits: number };
  trends: { total: number; selected: number; generated: number };
  moderation: { total: number; pending: number };
};

type Flag = { key: string; enabled: boolean; note: string };
type RecentPost = { id: number; slug: string; title: string; status: string; authorType: string; links: number; at: string | null };
type RecentJob = { id: number; type: string; status: string; attempts: number; at: string | null };

type ActivityResponse = {
  db: boolean;
  config: RuntimeConfig | null;
  metrics: Metrics | null;
  flags: Flag[];
  recentPosts: RecentPost[];
  recentJobs: RecentJob[];
};

/** Every AI-driven capability on the platform, what the AI actually does, and how to read it live. */
type Capability = {
  title: string;
  icon: ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  /** Runtime env switch that gates it, if any. Others run whenever the AI master switch is on. */
  envKey?: keyof RuntimeConfig;
  masterRequired?: boolean;
  does: string;
  /** Live activity line, given the metrics snapshot. */
  metric: (m: Metrics) => string;
};

const CAPABILITIES: Capability[] = [
  {
    title: "Free public autopilot",
    icon: Sparkles,
    envKey: "publicAiFallback",
    masterRequired: false,
    does: "Answers visitors from local directory data when provider keys or AI env switches are not available.",
    metric: (m) => `${m.listings.total} listings available without paid API calls`,
  },
  {
    title: "Listing enrichment",
    icon: Store,
    does: "Writes each business's description, FAQs, meta title/description, tags and category from raw data.",
    metric: (m) => `${m.listings.enriched} of ${m.listings.total} listings enriched`,
  },
  {
    title: "Semantic embeddings",
    icon: BrainCircuit,
    does: "Generates vector embeddings so search, dedup and the concierge understand meaning, not just keywords.",
    metric: (m) => `powers search across ${m.listings.total} listings`,
  },
  {
    title: "Trend blog engine",
    icon: Newspaper,
    envKey: "blogEngineEnabled",
    does: "Scans Nepal trends, clusters them, picks brand-safe angles, then writes multi-pass, fact-checked articles.",
    metric: (m) => `${m.blog.published} published · ${m.trends.selected} topics selected`,
  },
  {
    title: "Auto-publish + de-duplication",
    icon: Wand2,
    envKey: "blogAutopublish",
    does: "Publishes vetted posts automatically on a schedule and refuses to publish the same thing twice.",
    metric: (m) => `${m.blog.aiAssisted} AI-assisted posts · ${m.blog.links} internal links injected`,
  },
  {
    title: "AI concierge",
    icon: MessagesSquare,
    envKey: "conciergeEnabled",
    does: "Answers visitor questions grounded strictly in real search results — it never invents a business.",
    metric: () => "grounded chat over live search",
  },
  {
    title: "Natural-language search",
    icon: Search,
    does: "Parses queries like “chiya pasal thamel” into category + place, including romanized Nepali.",
    metric: () => "query understanding on every search",
  },
  {
    title: "Review summaries",
    icon: BookOpenText,
    does: "Summarizes real user reviews into pros, cons, themes and sentiment. It never writes fake reviews.",
    metric: (m) => `${m.reviewSummaries} summaries generated`,
  },
  {
    title: "Review spam moderation",
    icon: ShieldAlert,
    does: "Flags spammy reviews with heuristics plus an AI second opinion; a human always makes the final call.",
    metric: (m) => `${m.moderation.pending} pending · ${m.moderation.total} total in queue`,
  },
  {
    title: "Owner reply drafts",
    icon: MessageSquareReply,
    does: "Drafts professional owner responses to reviews for the business to review and approve.",
    metric: (m) => `${m.ownerReplies} reply drafts prepared`,
  },
  {
    title: "Nepali translation",
    icon: Languages,
    does: "Translates descriptions and FAQs into Nepali without adding or inventing any facts.",
    metric: () => "on-demand translation",
  },
  {
    title: "Evergreen SEO pages",
    icon: FileText,
    does: "Generates category-and-city landing page intros behind data-driven quality gates.",
    metric: (m) => `${m.seoIntros} page intros generated`,
  },
  {
    title: "Internal link suggester",
    icon: Link2,
    does: "Scores and suggests internal links between pages for editors to approve.",
    metric: (m) => `${m.linkSuggestions} link suggestions`,
  },
  {
    title: "Website onboarding extraction",
    icon: Wand2,
    does: "Reads a business website and extracts its name, category, hours and contact details on claim/import.",
    metric: () => "on-demand from a URL",
  },
  {
    title: "Duplicate business detection",
    icon: GitMerge,
    does: "Decides whether two imported listings are the same place and should be merged, with a human tie-breaker.",
    metric: (m) => `${m.listings.total} listings kept de-duplicated`,
  },
  {
    title: "Website crawler",
    icon: Globe,
    envKey: "crawlerEnabled",
    does: "Fetches business web pages (respecting robots.txt) to gather details during acquisition.",
    metric: () => "robots-respecting fetches",
  },
];

function fmt(n: number): string {
  return n.toLocaleString();
}

export default function SuperAdminAiActivityPage() {
  const [data, setData] = useState<ActivityResponse | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    void fetch("/api/admin/ai-activity")
      .then((r) => r.json())
      .then((d: ActivityResponse) => {
        setData(d);
        setState("ready");
      })
      .catch(() => setState("error"));
  }, []);

  const config = data?.config ?? null;

  function statusFor(cap: Capability): { label: string; tone: "on" | "off" } {
    // Effective runtime state: the AI master switch gates everything; a few capabilities have their
    // own env switch; the rest run whenever the master is on.
    if (!config) return { label: "Off", tone: "off" };
    if (cap.masterRequired === false && cap.envKey) {
      const on = Boolean(config[cap.envKey]);
      return { label: on ? "On" : "Off", tone: on ? "on" : "off" };
    }
    if (!config.enabled) return { label: "Off", tone: "off" };
    if (cap.envKey) {
      const on = Boolean(config[cap.envKey]);
      return { label: on ? "On" : "Off", tone: on ? "on" : "off" };
    }
    return { label: "On", tone: "on" };
  }

  const m = data?.metrics;

  const headlineMetrics = m
    ? [
        { label: "AI blog posts", value: fmt(m.blog.published), detail: `${fmt(m.blog.review)} awaiting review`, icon: Newspaper },
        { label: "Listings enriched", value: fmt(m.listings.enriched), detail: `of ${fmt(m.listings.total)} total`, icon: Store },
        { label: "Review summaries", value: fmt(m.reviewSummaries), detail: `${fmt(m.ownerReplies)} reply drafts`, icon: BookOpenText },
        { label: "AI jobs run", value: fmt(m.jobs.DONE ?? 0), detail: `${fmt(m.jobs.PENDING ?? 0)} pending · ${fmt(m.jobs.DEAD ?? 0)} dead`, icon: Wand2 },
        { label: "Model API calls", value: fmt(m.usage.calls), detail: `${fmt(m.usage.inTok + m.usage.outTok)} tokens`, icon: BrainCircuit },
      ]
    : [];

  return (
    <>
      <div className="superadmin-heading">
        <div>
          <span>AI transparency</span>
          <h1>AI activity — everything the AI does here</h1>
          <p>
            A live inventory of every AI-powered capability on NepaliDirectory, what each one actually does, whether it is
            switched on, and how much work it has produced. Kill switches live in the AI Console.
          </p>
        </div>
      </div>

      {state === "loading" ? <p className="superadmin-empty">Loading AI activity…</p> : null}
      {state === "error" ? <p className="superadmin-empty">Could not load AI activity.</p> : null}

      {data && !data.db ? (
        <section className="superadmin-panel">
          <div className="superadmin-panel__head">
            <h2>Database not connected</h2>
            <Sparkles size={20} aria-hidden />
          </div>
          <p className="superadmin-empty">
            Set <code>DATABASE_URL</code> so AI activity can be read from Postgres. The capability list below still shows
            everything the AI is wired to do.
          </p>
        </section>
      ) : null}

      {m ? (
        <section className="superadmin-metrics">
          {headlineMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <article key={metric.label}>
                <Icon size={21} aria-hidden />
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.detail}</small>
              </article>
            );
          })}
        </section>
      ) : null}

      <section className="superadmin-panel">
        <div className="superadmin-panel__head">
          <h2>What the AI does</h2>
          <span>{CAPABILITIES.length} capabilities</span>
        </div>
        <div className="superadmin-control-grid">
          {CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            const status = statusFor(cap);
            return (
              <article className="superadmin-panel ai-cap" key={cap.title}>
                <div className="superadmin-panel__head">
                  <h2>
                    <Icon size={18} aria-hidden /> {cap.title}
                  </h2>
                  <em className={`ai-cap__status ai-cap__status--${status.tone}`}>{status.label}</em>
                </div>
                <p className="ai-cap__does">{cap.does}</p>
                {m ? (
                  <div className="superadmin-control-list">
                    <span>
                      <Sparkles size={15} aria-hidden />
                      {cap.metric(m)}
                    </span>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="superadmin-grid">
        <article className="superadmin-panel superadmin-panel--wide">
          <div className="superadmin-panel__head">
            <h2>Recent AI-generated content</h2>
            <span>latest posts from the engine</span>
          </div>
          <div className="superadmin-table">
            {(data?.recentPosts ?? []).map((post) => (
              <article key={post.id}>
                <div>
                  <strong>{post.title}</strong>
                  <span>
                    /blog/{post.slug} · {post.links} internal links
                  </span>
                </div>
                <span data-status={post.status}>{post.status}</span>
                <span>{post.authorType.replace("_", " ")}</span>
                <span>{post.at ? new Date(post.at).toLocaleString() : "—"}</span>
              </article>
            ))}
            {data && data.recentPosts.length === 0 ? (
              <p className="superadmin-empty">No AI posts yet. The publisher writes one per cron cycle.</p>
            ) : null}
          </div>
        </article>

        <article className="superadmin-panel">
          <div className="superadmin-panel__head">
            <h2>Recent AI jobs</h2>
            <Wand2 size={20} aria-hidden />
          </div>
          <div className="superadmin-table">
            {(data?.recentJobs ?? []).map((job) => (
              <article key={job.id}>
                <div>
                  <strong>{job.type}</strong>
                  <span>Job #{job.id}</span>
                </div>
                <span data-status={job.status}>{job.status}</span>
                <span>{job.attempts} attempts</span>
              </article>
            ))}
            {data && data.recentJobs.length === 0 ? <p className="superadmin-empty">No AI jobs recorded yet.</p> : null}
          </div>
        </article>
      </section>
    </>
  );
}
