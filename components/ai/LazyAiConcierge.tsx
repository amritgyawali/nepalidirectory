"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

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
  const [ready, setReady] = useState(false);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = placeholderRef.current;
    if (!target || !("IntersectionObserver" in window)) {
      setReady(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (ready) return <AiConcierge />;

  return (
    <div ref={placeholderRef}>
      <div className="ai-concierge ai-concierge--loading" aria-label="Loading local directory assistant">
        <p>Local directory assistant</p>
      </div>
    </div>
  );
}
