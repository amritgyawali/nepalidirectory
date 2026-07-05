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

export async function POST(req: NextRequest): Promise<Response> {
  if (!loadAiConfig().conciergeEnabled) {
    return Response.json({ error: "Concierge is not enabled" }, { status: 503 });
  }

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

  const runtime = getDefaultDiscoverRuntime();
  if (!runtime.rateLimiter.allow(sessionId)) {
    return Response.json({ error: "Rate limit exceeded, try again later" }, { status: 429 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };
      try {
        const reply = await runtime.concierge(sessionId, message);

        const words = reply.message.split(/(\s+)/);
        const chunkSize = 6;
        for (let i = 0; i < words.length; i += chunkSize) {
          send("token", { text: words.slice(i, i + chunkSize).join("") });
        }

        send("done", {
          sessionId,
          listings: reply.listings,
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

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
