import { routes } from "@/lib/routes";

export const noIndexRoutes = new Set<string>([
  routes.search,
  routes.profile,
  routes.account,
  routes.login,
  routes.register,
  routes.forgotPassword,
  routes.dashboard,
  routes.dashboardListings,
  routes.dashboardReviews,
  routes.dashboardAnalytics,
  routes.gallery
]);

/**
 * Routes that are private, operational, or capable of creating unbounded URL spaces.
 * They stay out of both XML sitemaps and crawler queues.
 */
export const nonCrawlableRoutePrefixes = [
  "/api",
  "/admin",
  "/super-admin",
  "/dashboard",
  "/account",
] as const;

export const robotsDisallowPaths = [
  "/api/",
  "/admin/",
  "/super-admin/",
  "/dashboard/",
  "/account/",
  routes.search,
  routes.profile,
  routes.login,
  routes.register,
  routes.forgotPassword,
  routes.gallery,
] as const;

function matchesRoutePrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isIndexableRoute(pathname: string): boolean {
  const path = pathname.split(/[?#]/, 1)[0] || "/";
  return (
    !noIndexRoutes.has(path) &&
    !nonCrawlableRoutePrefixes.some((prefix) => matchesRoutePrefix(path, prefix))
  );
}

export const indexNowKey = "8e7d2e9e7a8942cf9c6d1a5804cbb7ed";
