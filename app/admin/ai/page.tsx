"use client";

import { Activity, BrainCircuit, CircleDollarSign, FileText, GitPullRequestArrow, Link2, MessageSquareWarning, Search, ShieldOff, ToggleLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { AiFeatureFlag } from "@/lib/admin-ai";

const fallbackFlags: AiFeatureFlag[] = [
  { key: "AI_ENABLED", label: "AI master switch", enabled: false, note: "Global kill switch for all AI calls." },
  { key: "ENRICH_LISTING", label: "Listing enrichment", enabled: false, note: "Descriptions, FAQs, meta and tags." },
  { key: "BLOG_ENGINE_ENABLED", label: "Trend blog engine", enabled: false, note: "Trend scan, selection and draft generation." },
  { key: "CONCIERGE_ENABLED", label: "AI concierge", enabled: false, note: "Grounded chat over search results." },
  { key: "REVIEW_SUMMARY", label: "Review summaries", enabled: false, note: "AI summaries from raw published reviews." },
  { key: "TRANSLATE_NE", label: "Nepali translation", enabled: false, note: "description_ne and Nepali FAQ generation." },
  { key: "EVERGREEN_PAGE", label: "Evergreen pages", enabled: false, note: "Category-city intro generation." },
];

type JobRow = {
  id: number;
  type: string;
  status: string;
  attempts: number;
  priority: number;
  runAfter: string;
  error: string | null;
};

export default function AdminAiPage() {
  const [flags, setFlags] = useState<AiFeatureFlag[]>(fallbackFlags);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [lastAction, setLastAction] = useState("Feature flags loaded from local defaults.");

  useEffect(() => {
    void fetch("/admin/ai/feature-flags")
      .then((response) => response.json())
      .then((data: { flags?: AiFeatureFlag[] }) => {
        if (data.flags?.length) {
          setFlags(data.flags);
          setLastAction("Feature flags loaded from server store.");
        }
      })
      .catch(() => setLastAction("Feature flag API unavailable; showing local defaults."));

    void fetch("/admin/ai/jobs")
      .then((response) => response.json())
      .then((data: { jobs?: JobRow[] }) => setJobs(data.jobs ?? []))
      .catch(() => setJobs([]));
  }, []);

  const totals = useMemo(() => {
    const dead = jobs.filter((job) => job.status === "DEAD").length;
    const pending = jobs.filter((job) => job.status === "PENDING").length;
    return { enabled: flags.filter((flag) => flag.enabled).length, disabled: flags.filter((flag) => !flag.enabled).length, pending, dead };
  }, [flags, jobs]);

  async function toggleFlag(flag: AiFeatureFlag) {
    const enabled = !flag.enabled;
    setFlags((current) => current.map((item) => (item.key === flag.key ? { ...item, enabled } : item)));
    setLastAction(`${flag.label} ${enabled ? "enabled" : "disabled"}.`);
    await fetch("/admin/ai/feature-flags", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: flag.key, enabled }),
    }).catch(() => setLastAction(`${flag.label} changed locally; server persistence failed.`));
  }

  return (
    <>
      <div className="superadmin-heading">
        <div>
          <span>AI operations</span>
          <h1>AI console and kill switches</h1>
          <p>Control every AI pipeline, inspect queue state, and review human-in-the-loop work queues from one operational surface.</p>
        </div>
      </div>

      <section className="superadmin-metrics">
        {[
          { label: "Enabled switches", value: totals.enabled, icon: ToggleLeft, detail: `${totals.disabled} disabled` },
          { label: "Pending jobs", value: totals.pending, icon: Activity, detail: "queue backlog" },
          { label: "Dead letters", value: totals.dead, icon: ShieldOff, detail: "needs replay" },
          { label: "Prompt families", value: 12, icon: BrainCircuit, detail: "seeded v1 templates" },
        ].map((metric) => {
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

      <section className="superadmin-panel">
        <div className="superadmin-panel__head">
          <h2>Pipeline kill switches</h2>
          <span>{lastAction}</span>
        </div>
        <div className="superadmin-switch-grid superadmin-switch-grid--wide">
          {flags.map((flag) => (
            <button className={flag.enabled ? "is-on" : ""} key={flag.key} onClick={() => void toggleFlag(flag)} type="button">
              <ToggleLeft size={18} aria-hidden />
              <span>
                <strong>{flag.label}</strong>
                <small>{flag.note}</small>
              </span>
              <em>{flag.enabled ? "On" : "Off"}</em>
            </button>
          ))}
        </div>
      </section>

      <section className="superadmin-grid">
        <article className="superadmin-panel superadmin-panel--wide">
          <div className="superadmin-panel__head">
            <h2>Jobs</h2>
            <span>Filter, retry and dead-letter replay API hooks are reserved here.</span>
          </div>
          <div className="superadmin-table">
            {jobs.slice(0, 6).map((job) => (
              <article key={job.id}>
                <div>
                  <strong>{job.type}</strong>
                  <span>Job #{job.id} - run after {new Date(job.runAfter).toLocaleString()}</span>
                </div>
                <span data-status={job.status}>{job.status}</span>
                <span>{job.attempts} attempts</span>
                <span>Priority {job.priority}</span>
              </article>
            ))}
            {jobs.length === 0 ? <p className="superadmin-empty">No queued AI jobs in the current runtime.</p> : null}
          </div>
        </article>

        <article className="superadmin-panel">
          <div className="superadmin-panel__head">
            <h2>Spend</h2>
            <CircleDollarSign size={20} aria-hidden />
          </div>
          <div className="superadmin-control-list">
            <span><Activity size={15} aria-hidden /> Usage log is wired through ai_usage_log.</span>
            <span><ShieldOff size={15} aria-hidden /> Daily budget guards requeue instead of hard failing.</span>
            <span><BrainCircuit size={15} aria-hidden /> CI uses MockAiProvider only.</span>
          </div>
        </article>
      </section>

      <section className="superadmin-control-grid">
        {[
          { title: "Prompts", icon: FileText, lines: ["Versioned prompt_templates", "Mock test-run target", "Live provider test gated by AI_ENABLED"] },
          { title: "Trend and blog review", icon: GitPullRequestArrow, lines: ["Selected/skipped trend clusters", "Blog drafts stay in REVIEW", "Autopublish switch visible above"] },
          { title: "Moderation queue", icon: MessageSquareWarning, lines: ["Review spam heuristics first", "AI second opinion only after threshold", "Humans decide pending cases"] },
          { title: "Demand and links", icon: Link2, lines: ["Zero-result demand signals", "Internal-link suggestions", "Category-city page quality gates"] },
          { title: "Search grounding", icon: Search, lines: ["Concierge calls search first", "No invented businesses", "Transcript QA retention hook"] },
        ].map((panel) => {
          const Icon = panel.icon;
          return (
            <article className="superadmin-panel" key={panel.title}>
              <div className="superadmin-panel__head">
                <h2>{panel.title}</h2>
                <Icon size={20} aria-hidden />
              </div>
              <div className="superadmin-control-list">
                {panel.lines.map((line) => (
                  <span key={line}>
                    <Icon size={15} aria-hidden />
                    {line}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
