import { routes } from "@/lib/routes";

export const noIndexRoutes = new Set<string>([
  routes.search,
  routes.account,
  routes.login,
  routes.register,
  routes.forgotPassword,
  routes.dashboard,
  routes.dashboardListings,
  routes.dashboardReviews,
  routes.dashboardAnalytics
]);

export const indexNowKey = "8e7d2e9e7a8942cf9c6d1a5804cbb7ed";
