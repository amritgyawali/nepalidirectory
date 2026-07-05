"use client";

import { MessageSquareText, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDashboardData } from "@/components/dashboard/DashboardProvider";
import { Stars } from "@/components/ui/Stars";
import { routes } from "@/lib/routes";

type ReviewFilter = "all" | "pending" | "replied" | "critical" | "positive";

const replyTemplates = [
  {
    label: "Thank customer",
    text: "Thank you for visiting and sharing your feedback. We appreciate your support and hope to welcome you again soon."
  },
  {
    label: "Fix issue",
    text: "Thank you for the honest feedback. We are reviewing this with our team and will improve the experience."
  },
  {
    label: "Invite back",
    text: "We appreciate your review. Please visit us again and let our team know you found us through Nepali Directory."
  }
];

export default function DashboardReviewsPage() {
  const { state, saveReviewReply } = useDashboardData();
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(state.reviews.map((review) => [review.id, review.reply]))
  );

  useEffect(() => {
    setDrafts(Object.fromEntries(state.reviews.map((review) => [review.id, review.reply])));
  }, [state.reviews]);

  const filteredReviews = useMemo(() => {
    if (filter === "pending") {
      return state.reviews.filter((review) => !review.reply.trim());
    }

    if (filter === "replied") {
      return state.reviews.filter((review) => review.reply.trim());
    }

    if (filter === "critical") {
      return state.reviews.filter((review) => review.rating <= 3);
    }

    if (filter === "positive") {
      return state.reviews.filter((review) => review.rating >= 4);
    }

    return state.reviews;
  }, [filter, state.reviews]);

  function applyTemplate(reviewId: string, text: string) {
    setDrafts((current) => ({
      ...current,
      [reviewId]: text
    }));
  }

  const averageRating =
    state.reviews.reduce((total, review) => total + review.rating, 0) / Math.max(1, state.reviews.length);

  return (
    <main className="admin-subpage">
      <div className="container">
        <div className="admin-subpage__head">
          <div>
            <Link href={routes.dashboard}>Dashboard</Link>
            <h1>Reviews</h1>
            <p>Monitor customer sentiment and respond publicly from one queue.</p>
          </div>
          <Link className="button button--outline" href={routes.writeReview}>
            <MessageSquareText size={16} aria-hidden />
            Public review page
          </Link>
        </div>

        <div className="dashboard-filter-row">
          {[
            ["all", "All reviews"],
            ["pending", "Awaiting reply"],
            ["replied", "Replied"],
            ["critical", "Critical"],
            ["positive", "Positive"]
          ].map(([value, label]) => (
            <button
              className={`chip ${filter === value ? "chip--active" : ""}`}
              key={value}
              onClick={() => setFilter(value as ReviewFilter)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <section className="review-board">
          <aside>
            <span>Average rating</span>
            <strong>{averageRating.toFixed(1)}</strong>
            <Stars rating={averageRating} />
            <p>{state.reviews.length} total public reviews</p>
          </aside>
          <div>
            {filteredReviews.map((review) => (
              <article key={review.id}>
                <div>
                  <span>{review.author.split(" ").map((part) => part[0]).join("")}</span>
                  <div>
                    <strong>{review.author}</strong>
                    <Stars rating={review.rating} />
                  </div>
                  <small>
                    <Star size={13} aria-hidden fill="currentColor" />
                    {review.rating}/5
                  </small>
                </div>
                <p>{review.text}</p>
                {review.reply ? <div className="success-note">Reply published: {review.reply}</div> : null}
                <div className="dashboard-template-row">
                  <span>
                    <Sparkles size={14} aria-hidden />
                    Templates
                  </span>
                  {replyTemplates.map((template) => (
                    <button
                      key={template.label}
                      onClick={() => applyTemplate(review.id, template.text)}
                      type="button"
                    >
                      {template.label}
                    </button>
                  ))}
                </div>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    saveReviewReply(review.id, drafts[review.id] ?? "");
                  }}
                >
                  <input
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [review.id]: event.target.value
                      }))
                    }
                    placeholder="Write a public reply..."
                    value={drafts[review.id] ?? ""}
                  />
                  <button type="submit">{review.reply ? "Update reply" : "Reply"}</button>
                </form>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
