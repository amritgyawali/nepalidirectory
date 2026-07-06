/**
 * `POST /api/concierge` (SSE stream; prompt §9.3/§14). Grounding is enforced in
 * `lib/discover/concierge.ts`, not here — this route only does transport: gate the feature flag,
 * rate-limit per session, run the concierge, and stream the reply.
 *
 * No configured provider adapter streams tokens yet (Gemini/OpenAI-compatible/Ollama are all
 * single-shot `complete()` calls), so this chunks the completed reply into an SSE `token` stream —
 * the wire contract a real streaming adapter would fill in later without changing this route.
 */
import type { NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { loadAiConfig } from "@/lib/ai-core";
import { getDefaultDiscoverRuntime } from "@/lib/discover";
import { localAutopilotSearch, type PublicAiReply } from "@/lib/public-ai";

export async function POST(req: NextRequest): Promise<Response> {
  let body: { sessionId?: string; message?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return Response.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return Response.json({ error: "message is required" }, { status: 400 });
  }
  const sessionId = body.sessionId?.trim() || randomUUID();
  const config = loadAiConfig();

  const runtime = getDefaultDiscoverRuntime();
  if (!runtime.rateLimiter.allow(sessionId)) {
    return Response.json({ error: "Rate limit exceeded, try again later" }, { status: 429 });
  }

  const encoder = new TextEncoder();
  const streamHeaders = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  };
  const streamReply = (replyFactory: () => Promise<PublicAiReply | Awaited<ReturnType<typeof runtime.concierge>>>) =>
    new ReadableStream({
      async start(controller) {
        const send = (event: string, data: unknown) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };
        try {
          const reply = await replyFactory();

          const words = reply.message.split(/(\s+)/);
          const chunkSize = 6;
          for (let i = 0; i < words.length; i += chunkSize) {
            send("token", { text: words.slice(i, i + chunkSize).join("") });
          }

          send("done", {
            sessionId,
            mode: "mode" in reply ? reply.mode : "provider",
            intent: "intent" in reply ? reply.intent : undefined,
            listings: reply.listings,
            followups: "followups" in reply ? reply.followups : [],
            actions: "actions" in reply ? reply.actions : [],
            demandSignalRecorded: reply.demandSignalRecorded,
            parsed: reply.parsed,
          });
        } catch (err) {
          send("error", { message: err instanceof Error ? err.message : String(err) });
        } finally {
          controller.close();
        }
      },
    });

  if (!config.enabled || !config.conciergeEnabled) {
    if (!config.publicAiFallback) {
      return Response.json({ error: "Concierge is not enabled" }, { status: 503 });
    }
    return new Response(streamReply(async () => localAutopilotSearch(message)), { headers: streamHeaders });
  }

  return new Response(
    streamReply(async () => {
      try {
        return await runtime.concierge(sessionId, message);
      } catch (error) {
        if (!config.publicAiFallback) throw error;
        return localAutopilotSearch(message);
      }
    }),
    { headers: streamHeaders },
  );
}
