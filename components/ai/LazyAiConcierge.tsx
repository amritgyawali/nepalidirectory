"use client";

import dynamic from "next/dynamic";

const AiConcierge = dynamic(
  () => import("@/components/ai/AiConcierge").then((module) => module.AiConcierge),
  {
    ssr: false,
    loading: () => (
      <div className="ai-concierge ai-concierge--loading" aria-label="Loading local directory assistant">
        <p>Loading local directory assistant…</p>
      </div>
    ),
  },
);

export function LazyAiConcierge() {
  return <AiConcierge />;
}
