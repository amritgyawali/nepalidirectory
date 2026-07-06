"use client";

import { Loader2, MapPin, Phone, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { FormCard } from "@/components/ui/FormCard";

type Source = {
  id: number;
  slug: string;
  name: string;
  area: string;
  neighborhood?: string;
  categories: string[];
  phone?: string;
  website?: string;
  href: string;
};

type AnswerResult = {
  question: string;
  answer: string;
  mode: "provider" | "free-local";
  listings: Source[];
  followups: string[];
};

const EXAMPLES = [
  "Where can I find a 24-hour pharmacy in Kathmandu?",
  "Best momo place in Patan?",
  "Which trekking agencies handle Annapurna Base Camp?",
];

/**
 * Community Q&A with an instant, directory-grounded AI answer. Posts to `/api/qa/answer`, which
 * upgrades from the free local floor to a real provider transparently once keys are set. The
 * classic "publish to the community" form is kept below for people who want human replies too.
 */
export function AskQuestion() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const sessionRef = useRef<string>("");

  function sessionId(): string {
    if (!sessionRef.current) {
      sessionRef.current =
        globalThis.crypto?.randomUUID?.() ?? `qa-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
    return sessionRef.current;
  }

  async function ask(raw: string) {
    const q = raw.trim();
    if (!q || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/qa/answer", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: q, sessionId: sessionId() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data?.error === "string" ? data.error : "Something went wrong. Please try again.");
      } else {
        setResult(data as AnswerResult);
        setQuestion(q);
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(question);
  }

  const suggestions = result?.followups?.length ? result.followups : EXAMPLES;

  return (
    <main className="auth-wrap">
      <div className="qa-stack">
        <section className="ai-concierge" aria-label="Instant AI answer">
          <div className="ai-concierge__header">
            <span>
              <Sparkles size={16} aria-hidden />
              Instant AI answer
            </span>
            {result ? <em>{result.mode === "provider" ? "Provider AI" : "Free local AI"}</em> : null}
          </div>

          <div className="ai-concierge__body" aria-live="polite">
            {result ? (
              <>
                <p className="ai-concierge__message ai-concierge__message--user">{result.question}</p>
                <p className="ai-concierge__message ai-concierge__message--assistant">{result.answer}</p>
              </>
            ) : (
              <p className="ai-concierge__message ai-concierge__message--assistant">
                Ask anything about local businesses and places in Nepal — you&apos;ll get a grounded answer right
                away, before the community replies.
              </p>
            )}

            {loading ? (
              <p className="ai-concierge__message ai-concierge__message--assistant">Thinking…</p>
            ) : null}

            {result?.listings?.length ? (
              <div className="ai-concierge__results">
                {result.listings.slice(0, 4).map((listing) => (
                  <article key={listing.slug}>
                    <div>
                      <Link href={listing.href}>{listing.name}</Link>
                      <span>
                        <MapPin size={13} aria-hidden />
                        {[listing.neighborhood, listing.area].filter(Boolean).join(", ")}
                      </span>
                    </div>
                    {listing.phone ? (
                      <div className="ai-concierge__meta">
                        <a href={`tel:${listing.phone.replace(/[^0-9+]/g, "")}`}>
                          <Phone size={13} aria-hidden />
                          Call
                        </a>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : null}

            {error ? (
              <p className="ai-concierge__message ai-concierge__message--assistant" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <div className="ai-concierge__suggestions">
            {suggestions.slice(0, 3).map((prompt) => (
              <button key={prompt} onClick={() => ask(prompt)} type="button">
                <Sparkles size={13} aria-hidden />
                {prompt}
              </button>
            ))}
          </div>

          <form className="ai-concierge__form" onSubmit={onSubmit}>
            <input
              aria-label="Ask a question"
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="e.g. Where can I find a 24-hour pharmacy in Kathmandu?"
              value={question}
            />
            <button disabled={loading || !question.trim()} type="submit">
              {loading ? <Loader2 size={16} aria-hidden className="ai-concierge__spin" /> : <Send size={16} aria-hidden />}
              <span>Ask</span>
            </button>
          </form>
        </section>

        <FormCard
          embedded
          title="Also post to the community"
          description="Prefer human replies? Publish your question for residents, business owners and travellers."
          fields={[
            { label: "Question title", placeholder: "What do you want to know?" },
            { label: "Category", placeholder: "Travel, restaurants, home services..." },
            { label: "Details", placeholder: "Add useful context" },
          ]}
          submitLabel="Publish question"
        />
      </div>
    </main>
  );
}
