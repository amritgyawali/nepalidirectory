import type { NextConfig } from "next";

const legacyRedirects: Record<string, string> = {
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
    return Object.entries(legacyRedirects).map(([source, destination]) => ({
      source,
      destination,
      permanent: true
    }));
  }
};

export default nextConfig;
