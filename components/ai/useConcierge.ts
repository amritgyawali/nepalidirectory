"use client";

import { useCallback, useRef, useState } from "react";
import { localAutopilotSearch, type AiAction, type AiIntent, type PublicAiListing, type PublicAiMode } from "@/lib/public-ai";

export type ChatMessage = { role: "assistant" | "user"; text: string };

export type DisplayListing = Partial<PublicAiListing> & {
  slug: string;
  name: string;
  area: string;
  categories?: string[];
  phone?: string;
};

type DonePayload = {
  sessionId?: string;
  mode?: PublicAiMode;
  intent?: AiIntent;
  listings?: DisplayListing[];
  followups?: string[];
  actions?: AiAction[];
};

const GREETING: ChatMessage = {
  role: "assistant",
  text: "Namaste! Tell me what you need — a service, place, deal or professional — and I'll return grounded matches from Nepali Directory.",
};

function parseSseEvent(block: string): { event: string; data: unknown } | null {
  const event = block.match(/^event:\s*(.+)$/m)?.[1]?.trim();
  const rawData = block.match(/^data:\s*(.+)$/m)?.[1];
  if (!event || !rawData) return null;
  try {
    return { event, data: JSON.parse(rawData) as unknown };
  } catch {
    return null;
  }
}

/**
 * Shared client for the AI concierge. Streams the SSE reply from `/api/concierge`, and transparently
 * falls back to the in-browser grounded autopilot (`localAutopilotSearch`) if the endpoint is
 * unavailable — so the assistant always answers, even offline or before the API redeploys.
 */
export function useConcierge() {
  const sessionId = useRef<string>(typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()));
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [listings, setListings] = useState<DisplayListing[]>([]);
  const [followups, setFollowups] = useState<string[]>([]);
  const [actions, setActions] = useState<AiAction[]>([]);
  const [mode, setMode] = useState<PublicAiMode>("free-local");
  const [loading, setLoading] = useState(false);

  const runLocalFallback = useCallback((prompt: string) => {
    const reply = localAutopilotSearch(prompt);
    setMode(reply.mode);
    setMessages((current) => [...current, { role: "assistant", text: reply.message }]);
    setListings(reply.listings);
    setFollowups(reply.followups);
    setActions(reply.actions);
  }, []);

  const ask = useCallback(
    async (prompt: string) => {
      const clean = prompt.trim();
      if (!clean || loading) return;

      setLoading(true);
      setListings([]);
      setFollowups([]);
      setActions([]);
      setMessages((current) => [...current, { role: "user", text: clean }, { role: "assistant", text: "" }]);

      try {
        const response = await fetch("/api/concierge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: clean, sessionId: sessionId.current }),
        });
        if (!response.ok || !response.body) throw new Error("AI endpoint unavailable");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let assistantText = "";

        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const blocks = buffer.split("\n\n");
          buffer = blocks.pop() ?? "";

          for (const block of blocks) {
            const parsed = parseSseEvent(block);
            if (!parsed) continue;
            if (parsed.event === "token") {
              const text = typeof (parsed.data as { text?: unknown }).text === "string" ? (parsed.data as { text: string }).text : "";
              assistantText += text;
              setMessages((current) => {
                const next = [...current];
                next[next.length - 1] = { role: "assistant", text: assistantText };
                return next;
              });
            }
            if (parsed.event === "done") {
              const data = parsed.data as DonePayload;
              setListings(Array.isArray(data.listings) ? data.listings : []);
              setFollowups(Array.isArray(data.followups) ? data.followups : []);
              setActions(Array.isArray(data.actions) ? data.actions : []);
              setMode(data.mode ?? "provider");
            }
            if (parsed.event === "error") throw new Error("AI stream error");
          }
        }
      } catch {
        setMessages((current) => current.slice(0, -1));
        runLocalFallback(clean);
      } finally {
        setLoading(false);
      }
    },
    [loading, runLocalFallback],
  );

  return { messages, listings, followups, actions, mode, loading, ask };
}
