"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const AiAssistant = dynamic(
  () => import("@/components/ai/AiAssistant").then((module) => module.AiAssistant),
  { ssr: false },
);

export function LazyAiAssistant() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const idleWindow = window as unknown as {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (idleWindow.requestIdleCallback) {
      const idleId = idleWindow.requestIdleCallback(() => setReady(true), { timeout: 4000 });
      return () => idleWindow.cancelIdleCallback?.(idleId);
    }

    const timeoutId = setTimeout(() => setReady(true), 2500);
    return () => clearTimeout(timeoutId);
  }, []);

  return ready ? <AiAssistant /> : null;
}
