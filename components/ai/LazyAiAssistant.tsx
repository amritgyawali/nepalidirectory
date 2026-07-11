"use client";

import dynamic from "next/dynamic";

const AiAssistant = dynamic(
  () => import("@/components/ai/AiAssistant").then((module) => module.AiAssistant),
  { ssr: false },
);

export function LazyAiAssistant() {
  return <AiAssistant />;
}
