"use client";

import { Bot, ExternalLink, Loader2, MapPin, Navigation, Phone, Send, Sparkles, Star, Tag, X } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useConcierge } from "./useConcierge";

const QUICK_PROMPTS = ["Emergency plumber in Kathmandu", "Best Newari food Bhaktapur", "Dentist open now", "Deals near me"];

const ACTION_ICON = {
  call: Phone,
  website: ExternalLink,
  directions: Navigation,
  deals: Tag,
  compare: Sparkles,
  search: Sparkles,
} as const;

/**
 * Site-wide floating AI assistant. Mounted once in the root layout so grounded AI discovery is one
 * tap away on every page. Shares `useConcierge` with the inline homepage concierge.
 */
export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, listings, followups, actions, mode, loading, ask } = useConcierge();
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, listings, open]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit(prompt: string) {
    setInput("");
    void ask(prompt);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit(input);
  }

  const suggestions = followups.length ? followups : QUICK_PROMPTS;

  return (
    <>
      <button
        aria-expanded={open}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        className="ai-fab"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {open ? <X size={22} aria-hidden /> : <Bot size={22} aria-hidden />}
        {!open ? <span className="ai-fab__pulse" aria-hidden /> : null}
      </button>

      {open ? (
        <section className="ai-dock" role="dialog" aria-label="AI assistant">
          <header className="ai-dock__header">
            <span>
              <Sparkles size={16} aria-hidden />
              Nepali Directory AI
            </span>
            <em>{mode === "provider" ? "Provider AI" : "Free local AI"}</em>
            <button aria-label="Close" onClick={() => setOpen(false)} type="button">
              <X size={16} aria-hidden />
            </button>
          </header>

          <div className="ai-dock__chat" aria-live="polite" ref={chatRef}>
            {messages.map((message, index) => (
              <p className={`ai-concierge__message ai-concierge__message--${message.role}`} key={`${message.role}-${index}`}>
                {message.text || (loading ? "Thinking..." : "")}
              </p>
            ))}

            {actions.length ? (
              <div className="ai-concierge__actions ai-concierge__actions--primary">
                {actions.map((action) => {
                  const Icon = ACTION_ICON[action.type] ?? Sparkles;
                  return action.href.startsWith("/") ? (
                    <Link key={action.label} href={action.href} onClick={() => setOpen(false)}>
                      <Icon size={13} aria-hidden />
                      {action.label}
                    </Link>
                  ) : (
                    <a key={action.label} href={action.href} target={action.external ? "_blank" : undefined} rel={action.external ? "noreferrer" : undefined}>
                      <Icon size={13} aria-hidden />
                      {action.label}
                    </a>
                  );
                })}
              </div>
            ) : null}

            {listings.length ? (
              <div className="ai-concierge__results">
                {listings.slice(0, 4).map((listing) => (
                  <article key={listing.slug}>
                    <div>
                      <Link href={listing.href ?? `/search?q=${encodeURIComponent(listing.name)}`} onClick={() => setOpen(false)}>
                        {listing.name}
                      </Link>
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
                      {listing.phone ? (
                        <a href={`tel:${listing.phone.replace(/[^0-9+]/g, "")}`}>
                          <Phone size={13} aria-hidden />
                          Call
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </div>

          <div className="ai-concierge__suggestions ai-dock__suggestions">
            {suggestions.slice(0, 4).map((prompt) => (
              <button key={prompt} onClick={() => submit(prompt)} type="button">
                <Sparkles size={13} aria-hidden />
                {prompt}
              </button>
            ))}
          </div>

          <form className="ai-concierge__form ai-dock__form" onSubmit={onSubmit}>
            <input
              aria-label="Ask the Nepali Directory AI"
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask for anything local in Nepal..."
              value={input}
            />
            <button disabled={loading || !input.trim()} type="submit">
              {loading ? <Loader2 size={16} aria-hidden className="ai-concierge__spin" /> : <Send size={16} aria-hidden />}
              <span>Send</span>
            </button>
          </form>
        </section>
      ) : null}
    </>
  );
}
