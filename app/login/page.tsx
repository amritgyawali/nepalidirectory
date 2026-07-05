"use client";

import { ArrowRight, BarChart3, CheckCircle2, Lock, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { routes } from "@/lib/routes";

const sessionKey = "nd-admin-session";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (username.trim() === "superadmin" && password === "superadmin") {
      localStorage.setItem(
        "nd-superadmin-session",
        JSON.stringify({
          name: "Super Admin",
          role: "Platform Owner",
          signedInAt: new Date().toISOString()
        })
      );
      localStorage.setItem(
        sessionKey,
        JSON.stringify({
          name: "Super Admin",
          role: "Platform Owner",
          signedInAt: new Date().toISOString()
        })
      );
      const nextPath = new URLSearchParams(window.location.search).get("next");
      router.push(nextPath?.startsWith("/") ? nextPath : routes.superAdmin);
      return;
    }

    if (username.trim() === "admin" && password === "admin") {
      localStorage.setItem(
        sessionKey,
        JSON.stringify({
          name: "Admin",
          role: "Directory Administrator",
          signedInAt: new Date().toISOString()
        })
      );
      const nextPath = new URLSearchParams(window.location.search).get("next");
      router.push(nextPath?.startsWith("/") ? nextPath : routes.dashboard);
      return;
    }

    setError("Use admin/admin for business dashboard or superadmin/superadmin for super admin.");
  }

  return (
    <main className="auth-shell">
      <section className="auth-split">
        <form className="auth-panel" onSubmit={onSubmit}>
          <div>
            <h1>Welcome back.</h1>
            <p>Sign in to manage reviews, listings, leads, directory analytics or platform controls.</p>
          </div>

          <div className="auth-fields">
            <label>
              <span>Username</span>
              <div>
                <UserRound size={17} aria-hidden />
                <input
                  autoComplete="username"
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="admin"
                  value={username}
                />
              </div>
            </label>
            <label>
              <span>Password</span>
              <div>
                <Lock size={17} aria-hidden />
                <input
                  autoComplete="current-password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="admin"
                  type="password"
                  value={password}
                />
              </div>
            </label>
          </div>

          {error ? <p className="auth-error">{error}</p> : null}

          <button className="auth-submit" type="submit">
            Log in to dashboard
            <ArrowRight size={16} aria-hidden />
          </button>

          <div className="auth-meta">
            <Link href={routes.forgotPassword}>Forgot password?</Link>
            <Link href={routes.register}>Create account</Link>
          </div>
        </form>

        <aside className="auth-value">
          <span>For business owners</span>
          <h2>Run your listing like a local growth console.</h2>
          <p>
            Claim profiles, respond to reviews, track search demand and keep contact information
            fresh across Nepali Directory.
          </p>
          <ul>
            {[
              "Manage hours, photos and services",
              "Reply to public reviews",
              "Track calls, directions and profile views",
              "Promote high-performing listings"
            ].map((item) => (
              <li key={item}>
                <CheckCircle2 size={18} aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <div className="auth-value__stat">
            <BarChart3 size={22} aria-hidden />
            <strong>1.2M monthly searches</strong>
            <small>across restaurants, home services, healthcare and travel.</small>
          </div>
        </aside>
      </section>
    </main>
  );
}
