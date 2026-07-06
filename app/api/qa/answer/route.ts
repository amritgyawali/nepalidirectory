/**
 * `POST /api/qa/answer` — an AI-generated answer to any community question, grounded in the
 * directory. Rate-limited per session like the concierge. Always answers: the deterministic
 * public-AI floor backs the real provider, so it never hard-fails when no keys are configured.
 */
import type { NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { getDefaultDiscoverRuntime } from "@/lib/discover";
import { answerQuestion } from "@/lib/qa";

export const runtime = "nodejs";

export async function POST(req: NextRequest): Promise<Response> {
  let body: { sessionId?: string; question?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return Response.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const question = body.question?.trim();
  if (!question) {
    return Response.json({ error: "question is required" }, { status: 400 });
  }
  if (question.length > 500) {
    return Response.json({ error: "question is too long (max 500 characters)" }, { status: 400 });
  }

  const sessionId = body.sessionId?.trim() || randomUUID();
  const discover = getDefaultDiscoverRuntime();
  if (!discover.rateLimiter.allow(sessionId)) {
    return Response.json({ error: "Rate limit exceeded, try again later" }, { status: 429 });
  }

  const result = await answerQuestion(question);
  return Response.json({ sessionId, ...result });
}
