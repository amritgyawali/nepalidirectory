import { createReviewsAiRuntime } from "./runtime";

const globalForReviewsAi = globalThis as typeof globalThis & {
  __reviewsAiRuntime?: ReturnType<typeof createReviewsAiRuntime>;
};

export function getReviewsAiRuntime() {
  if (!globalForReviewsAi.__reviewsAiRuntime) {
    globalForReviewsAi.__reviewsAiRuntime = createReviewsAiRuntime();
  }
  return globalForReviewsAi.__reviewsAiRuntime;
}
