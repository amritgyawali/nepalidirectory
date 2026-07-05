import type { Review } from "./types";

const now = new Date("2026-07-05T00:00:00+05:45");
const accountDate = new Date("2026-01-01T00:00:00+05:45");

export const sampleReviews: Review[] = [
  {
    id: "review-newa-1",
    listingSlug: "newa-lahana",
    reviewerId: "user-srijana",
    reviewerAccountCreatedAt: accountDate,
    rating: 5,
    body: "Beautiful courtyard and a properly explained Newari tasting menu. The team handled our group booking carefully.",
    createdAt: new Date("2026-06-02T10:00:00+05:45"),
  },
  {
    id: "review-newa-2",
    listingSlug: "newa-lahana",
    reviewerId: "user-amit",
    reviewerAccountCreatedAt: accountDate,
    rating: 4.5,
    body: "Helpful staff, quick phone confirmation, and great group seating. Weekend timing still needs a reservation.",
    createdAt: new Date("2026-06-18T12:30:00+05:45"),
  },
  {
    id: "review-newa-3",
    listingSlug: "newa-lahana",
    reviewerId: "user-maya",
    reviewerAccountCreatedAt: accountDate,
    rating: 4.5,
    body: "The samay baji set was fresh and the service felt very local. It can get crowded around lunch.",
    createdAt: new Date("2026-06-29T14:15:00+05:45"),
  },
  {
    id: "review-newa-4",
    listingSlug: "newa-lahana",
    reviewerId: "user-karma",
    reviewerAccountCreatedAt: accountDate,
    rating: 4,
    body: "Good place for visitors who want an introduction to Newari food. Parking nearby is the main issue.",
    createdAt: now,
  },
];

export function reviewsForListing(listingSlug: string): Review[] {
  return sampleReviews.filter((review) => review.listingSlug === listingSlug);
}
