import { NextResponse } from "next/server";
import { getReviewsAiRuntime } from "@/lib/reviews-ai";

export async function GET() {
  const runtime = getReviewsAiRuntime();
  const jobs = await runtime.repo.list();
  return NextResponse.json({
    jobs: jobs.map((job) => ({
      id: job.id,
      type: job.type,
      status: job.status,
      attempts: job.attempts,
      priority: job.priority,
      runAfter: job.runAfter.toISOString(),
      error: job.error,
      payload: job.payload,
    })),
  });
}
