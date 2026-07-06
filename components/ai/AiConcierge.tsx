"use client";

import { Bot, ExternalLink, Loader2, MapPin, Navigation, Phone, Send, Sparkles, Star, Tag } from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import type { PublicAiListing } from "@/lib/public-ai";
import { useConcierge } from "./useConcierge";

type AiConciergeProps = {
  initialPrompt?: string;
  compact?: boolean;
};

const DEFAULT_PROMPTS = [
  "emergency plumber in Kathmandu",
  "best Newari food Bhaktapur",
  "dentist open now",
  "hotel in Pokhara with pickup",
];

function statusLabel(status?: PublicAiListing["status"]): string {
  if (status === "24h") return "24 hours";
  if (status === "open") return "Open";
  if (status === "closed") return "Closed";
  return "Verified";
}

const ACTION_ICON = {
  call: Phone,
  website: ExternalLink,
  directions: Navigation,
  deals: Tag,
  compare: Sparkles,
  search: Sparkles,
} as const;

export function AiConcierge({ initialPrompt = "", compact = false }: AiConciergeProps) {
  const [input, setInput] = useState(initialPrompt);
  const { messages, listings, followups, actions, mode, loading, ask } = useConcierge();

  const suggestions = useMemo(() => {
    const first = initialPrompt.trim();
    const base = followups.length ? followups : DEFAULT_PROMPTS;
    return first ? [first, ...base.filter((prompt) => prompt !== first)].slice(0, 4) : base.slice(0, 4);
  }, [initialPrompt, followups]);

  function submit(prompt: string) {
    setInput("");
    void ask(prompt);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit(input);
  }

  return (
    <section className={compact ? "ai-concierge ai-concierge--compact" : "ai-concierge"}>
      <div className="ai-concierge__header">
        <span>
          <Bot size={16} aria-hidden />
          AI Autopilot
        </span>
        <em>{mode === "provider" ? "Provider AI" : "Free local AI"}</em>
      </div>

      <div className="ai-concierge__body">
        <div className="ai-concierge__chat" aria-live="polite">
          {messages.slice(-4).map((message, index) => (
            <p className={`ai-concierge__message ai-concierge__message--${message.role}`} key={`${message.role}-${index}`}>
              {message.text || (loading ? "Thinking..." : "")}
            </p>
          ))}
        </div>

        {actions.length ? (
          <div className="ai-concierge__actions ai-concierge__actions--primary">
            {actions.map((action) => {
              const Icon = ACTION_ICON[action.type] ?? Sparkles;
              return action.href.startsWith("/") ? (
                <Link key={action.label} href={action.href}>
                  <Icon size={13} aria-hidden />
                  {action.label}
                </Link>
              ) : (
                <a
                  key={action.label}
                  href={action.href}
                  target={action.external ? "_blank" : undefined}
                  rel={action.external ? "noreferrer" : undefined}
                >
                  <Icon size={13} aria-hidden />
                  {action.label}
                </a>
              );
            })}
          </div>
        ) : null}

        <div className="ai-concierge__suggestions">
          {suggestions.map((prompt) => (
            <button key={prompt} onClick={() => submit(prompt)} type="button">
              <Sparkles size={13} aria-hidden />
              {prompt}
            </button>
          ))}
        </div>

        <form className="ai-concierge__form" onSubmit={onSubmit}>
          <input
            aria-label="Ask AI Autopilot"
            onChange={(event) => setInput(event.target.value)}
            placeholder="Need a service, place, deal or professional?"
            value={input}
          />
          <button disabled={loading || !input.trim()} type="submit">
            {loading ? <Loader2 size={16} aria-hidden className="ai-concierge__spin" /> : <Send size={16} aria-hidden />}
            <span>Send</span>
          </button>
        </form>
      </div>

      {listings.length ? (
        <div className="ai-concierge__results">
          {listings.slice(0, compact ? 2 : 4).map((listing) => (
            <article key={listing.slug}>
              <div>
                <Link href={listing.href ?? `/search?q=${encodeURIComponent(listing.name)}`}>{listing.name}</Link>
                <span>
                  <MapPin size={13} aria-hidden />
                  {[listing.neighborhood, listing.area].filter(Boolean).join(", ")}
                </span>
                {listing.why ? <small className="ai-concierge__why">{listing.why}</small> : null}
              </div>
              <div className="ai-concierge__meta">
                {typeof listing.rating === "number" ? (
                  <span>
                    <Star size={13} aria-hidden fill="currentColor" />
                    {listing.rating.toFixed(1)} ({(listing.reviews ?? 0).toLocaleString()})
                  </span>
                ) : null}
                <span>{statusLabel(listing.status)}</span>
              </div>
              <div className="ai-concierge__actions">
                {listing.phone ? (
                  <a href={`tel:${listing.phone.replace(/[^0-9+]/g, "")}`}>
                    <Phone size={13} aria-hidden />
                    Call
                  </a>
                ) : null}
                {listing.website ? (
                  <a href={listing.website} rel="noreferrer" target="_blank">
                    <ExternalLink size={13} aria-hidden />
                    Website
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
