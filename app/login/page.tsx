"use client";

import { ArrowRight, CheckCircle2, Lock, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { routes } from "@/lib/routes";
import { createClient } from "@/utils/supabase/client";

function safeNextPath(value: string | null): string | null {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : null;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const reason = new URLSearchParams(window.location.search).get("error");
    if (reason === "auth-not-configured") {
      setError("Secure sign-in is not configured yet. Add the Supabase public environment variables before using private dashboards.");
    } else if (reason === "auth-unavailable") {
      setError("The authentication service is temporarily unavailable. Please try again.");
    }
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      setError("Secure sign-in is not configured for this deployment.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError || !data.user) {
        setError("Sign-in failed. Check your email and password, then try again.");
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const requested = safeNextPath(params.get("next"));
      const role = String(data.user.app_metadata?.role ?? "").toLowerCase().replace(/[_\s-]+/g, "");
      const fallback = role === "superadmin" ? routes.superAdmin : routes.dashboard;
      router.replace(requested ?? fallback);
      router.refresh();
    } catch {
      setError("The authentication service could not be reached. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-split">
        <form className="auth-panel" onSubmit={onSubmit}>
          <div>
            <h1>Secure account sign in</h1>
            <p>Manage your claimed listings, reviews and account using a server-verified session.</p>
          </div>

          <div className="auth-fields">
            <label>
              <span>Email</span>
              <div>
                <UserRound size={17} aria-hidden />
                <input
                  autoComplete="email"
                  inputMode="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={email}
                />
              </div>
            </label>
            <label>
              <span>Password</span>
              <div>
                <Lock size={17} aria-hidden />
                <input
                  autoComplete="current-password"
                  minLength={8}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Your password"
                  required
                  type="password"
                  value={password}
                />
              </div>
            </label>
          </div>

          {error ? <p className="auth-error" role="alert">{error}</p> : null}

          <button className="auth-submit" disabled={submitting} type="submit">
            {submitting ? "Signing in…" : "Sign in securely"}
            <ArrowRight size={16} aria-hidden />
          </button>

          <div className="auth-meta">
            <Link href={routes.forgotPassword}>Forgot password?</Link>
            <Link href={routes.register}>Create account</Link>
          </div>
        </form>

        <aside className="auth-value">
          <span>For business owners</span>
          <h2>Manage your public profile with protected account access.</h2>
          <p>
            Authentication is handled by Supabase on the server. Private and administrator routes
            are blocked before page content renders.
          </p>
          <ul>
            {[
              "Manage hours, photos and services",
              "Reply to public reviews",
              "Review calls and profile activity",
              "Keep contact information current"
            ].map((item) => (
              <li key={item}>
                <CheckCircle2 size={18} aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <div className="auth-value__stat">
            <ShieldCheck size={22} aria-hidden />
            <strong>Server-verified sessions</strong>
            <small>with role checks for administrator areas.</small>
          </div>
        </aside>
      </section>
    </main>
  );
}
