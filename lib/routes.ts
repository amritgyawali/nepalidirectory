export const routes = {
  home: "/",
  search: "/search",
  bestBusinesses: "/best-businesses",
  nearMe: "/near-me",
  topRated: "/top-rated",
  categories: "/categories",
  city: "/city",
  about: "/about",
  contact: "/contact",
  advertise: "/advertise",
  getApp: "/get-app",
  qa: "/qa",
  qaCommunity: "/qa/community",
  askQuestion: "/ask-question",
  question: "/questions/trekking-annapurna",
  restaurantQa: "/restaurant-qa",
  blog: "/blog",
  blogPost: "/blog/annapurna-circuit-guide",
  compareBusiness: "/compare-business",
  findPeople: "/find-people",
  map: "/map",
  gallery: "/gallery",
  profile: "/profile",
  account: "/account",
  privacy: "/privacy",
  terms: "/terms",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  claimListing: "/claim-listing",
  dashboard: "/dashboard",
  dashboardListings: "/dashboard/listings",
  dashboardReviews: "/dashboard/reviews",
  dashboardAnalytics: "/dashboard/analytics",
  superAdmin: "/super-admin",
  superAdminBusinesses: "/super-admin/businesses",
  superAdminUsers: "/super-admin/users",
  superAdminReferrals: "/super-admin/referrals",
  superAdminApprovals: "/super-admin/approvals",
  superAdminControls: "/super-admin/controls",
  superAdminAudit: "/super-admin/audit",
  superAdminSettings: "/super-admin/settings",
  superAdminAiActivity: "/super-admin/ai-activity",
  adminAi: "/admin/ai",
  deals: "/deals",
  events: "/events",
  pricing: "/pricing",
  help: "/help",
  sitemap: "/sitemap",
  writeReview: "/write-review",
  requestCallback: "/request-callback",
  province: "/province",
  authors: "/authors",
  editorialPolicy: "/editorial-policy",
  attribution: "/attribution"
} as const;

export const primaryNav = [
  { label: "Categories", href: routes.categories },
  { label: "Cities", href: routes.city },
  { label: "Guides", href: routes.blog },
  { label: "Compare", href: routes.compareBusiness },
  { label: "Add Business", href: routes.claimListing },
  { label: "Log In", href: routes.login },
  { label: "Sign Up", href: routes.register, featured: true }
];

/** Canonical public profile URL for a listing slug. */
export function getBusinessHref(slug: string): string {
  return `/business/${encodeURIComponent(slug)}`;
}

/** Canonical comparison-guide URL for an available category slug. */
export function getCompareHref(slug: string): string {
  return `/compare-business/${encodeURIComponent(slug)}`;
}

/** Search URL that preserves category and optional location intent. */
export function getSearchHref(query: string, location?: string): string {
  const params = new URLSearchParams({ q: query });
  if (location) params.set("location", location);
  return `${routes.search}?${params.toString()}`;
}

export const footerGroups = [
  {
    title: "About",
    links: [
      { label: "About Us", href: routes.about },
      { label: "Contact Us", href: routes.contact },
      { label: "Advertise with Us", href: routes.advertise },
      { label: "Blog", href: routes.blog },
      { label: "Authors", href: routes.authors },
      { label: "Editorial Policy", href: routes.editorialPolicy },
      { label: "Compare Business", href: routes.compareBusiness },
      { label: "Become a Partner", href: routes.claimListing },
      { label: "Careers", href: routes.help }
    ]
  },
  {
    title: "Directory",
    links: [
      { label: "Find a Business", href: routes.search },
      { label: "Best Businesses", href: routes.bestBusinesses },
      { label: "Near Me", href: routes.nearMe },
      { label: "Top Rated", href: routes.topRated },
      { label: "Categories", href: routes.categories },
      { label: "Deals & Offers", href: routes.deals },
      { label: "Map & Directions", href: routes.map },
      { label: "Compare Business", href: routes.compareBusiness },
      { label: "Mobile App", href: routes.getApp },
      { label: "Q&A Hub", href: routes.qa },
      { label: "People Search", href: routes.findPeople },
      { label: "Site Map", href: routes.sitemap }
    ]
  }
];
