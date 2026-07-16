import type { NextConfig } from "next";
import { duplicateBlogRedirects } from "./lib/blog-dedup";

const legacyRedirects: Record<string, string> = {
  "/top-rated": "/best-businesses",
  "/Home.dc.html": "/",
  "/Search%20Results.dc.html": "/search",
  "/Business%20Detail.dc.html": "/business/newa-lahana",
  "/Categories.dc.html": "/categories",
  "/City%20Landing.dc.html": "/city/kathmandu",
  "/About%20Us.dc.html": "/about",
  "/Contact%20Us.dc.html": "/contact",
  "/Advertise.dc.html": "/advertise",
  "/Get%20App.dc.html": "/get-app",
  "/QA%20Hub.dc.html": "/qa",
  "/QA%20Community.dc.html": "/qa/community",
  "/Ask%20Question%201.dc.html": "/ask-question",
  "/Ask%20Question%202.dc.html": "/ask-question",
  "/Question%20Detail%201.dc.html": "/questions/trekking-annapurna",
  "/Question%20Detail%202.dc.html": "/questions/trekking-annapurna",
  "/Restaurant%20QA.dc.html": "/restaurant-qa",
  "/Blog.dc.html": "/blog",
  "/Blog%20Post.dc.html": "/blog/annapurna-circuit-guide",
  "/Find%20People.dc.html": "/find-people",
  "/Map%20Directions.dc.html": "/map",
  "/Photo%20Gallery.dc.html": "/gallery",
  "/User%20Profile.dc.html": "/profile",
  "/Account%20Settings.dc.html": "/account",
  "/Privacy%20Policy.dc.html": "/privacy",
  "/Terms%20of%20Service.dc.html": "/terms",
  "/Login.dc.html": "/login",
  "/Register.dc.html": "/register",
  "/Forgot%20Password.dc.html": "/forgot-password",
  "/Claim%20Listing.dc.html": "/claim-listing",
  "/Dashboard.dc.html": "/dashboard",
  "/Deals%20Offers.dc.html": "/deals",
  "/Local%20Events.dc.html": "/events",
  "/Pricing%20Plans.dc.html": "/pricing",
  "/Help.dc.html": "/help",
  "/Sitemap.dc.html": "/sitemap",
  "/Write%20Review.dc.html": "/write-review",
  "/Request%20Callback.dc.html": "/request-callback",
  "/Province.dc.html": "/province"
};

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  },
  async redirects() {
    return Object.entries({ ...legacyRedirects, ...duplicateBlogRedirects }).map(([source, destination]) => ({
      source,
      destination,
      permanent: true
    }));
  },
  async rewrites() {
    // Next.js route folders can't mix literal text with a dynamic segment (a
    // `sitemap-listings-[chunk].xml` folder never registers as a route), so the public,
    // sitemap-index-referenced /sitemap-listings-N.xml URL is rewritten to the real dynamic
    // route at app/sitemap-listings/[chunk]/route.ts.
    return [
      {
        source: "/sitemap-listings-:chunk(\\d+).xml",
        destination: "/sitemap-listings/:chunk"
      }
    ];
  },
  async headers() {
    const contentSecurityPolicy = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "img-src 'self' data: blob: https://images.unsplash.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "media-src 'self'",
      "worker-src 'self' blob:",
      // Collect real violation data via /api/csp-report before flipping this header from
      // Report-Only to enforcing (see the audit follow-up note below).
      "report-uri /api/csp-report"
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          // TODO(SEO audit 2026-07-16): still Report-Only, not enforcing. A static audit of
          // every script/style/font/image/connect target in app/ and components/ found nothing
          // outside this allowlist, but per the user's stated condition this should only flip to
          // enforcing after watching real /api/csp-report violation data for a few days —
          // 'unsafe-inline' is still present in script-src/style-src and should move to nonces/
          // hashes before this is promoted to a plain `Content-Security-Policy` header.
          { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }
        ]
      }
    ];
  }
};

export default nextConfig;
