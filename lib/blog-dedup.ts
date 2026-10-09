import type { BlogPost } from "./blog";

/** Legacy auto-published near-duplicates consolidated by the 2026-07 SEO cleanup. */
export const duplicateBlogRedirects: Readonly<Record<string, string>> = {
  "/blog/questions-to-ask-before-choosing-a-restaurant-or-cafe-in-nepal-a-comprehensive-g":
    "/blog/questions-to-ask-before-choosing-a-restaurant-or-cafe-in-nepal",
  "/blog/choosing-the-right-restaurant-or-cafe-in-nepal-questions-to-ask":
    "/blog/questions-to-ask-before-choosing-a-restaurant-or-cafe-in-nepal",
  "/blog/how-to-compare-local-services-in-nepal-before-booking-a-practical-guide":
    "/blog/how-to-compare-local-services-in-nepal-before-booking",
  "/blog/compare-local-services-in-nepal-a-practical-guide":
    "/blog/how-to-compare-local-services-in-nepal-before-booking",
  "/blog/how-to-compare-event-venues-and-vendors-in-nepal-a-practical-guide":
    "/blog/how-to-compare-event-venues-and-vendors-in-nepal",
  "/blog/how-to-compare-clinics-and-book-appointments-in-nepal-a-practical-guide":
    "/blog/how-to-compare-clinics-and-appointments-in-nepal",
  "/blog/compare-plumbers-and-electricians-in-nepal-a-guide-to-hiring-the-right-repair-pr":
    "/blog/how-to-compare-repair-providers-in-nepal-before-hiring",
  // 2026-10: a second Google Business Profile guide shared the original's title and search
  // intent; its one unique section (Plus Codes for unnamed streets) was merged into the original.
  "/blog/google-business-profile-nepal-setup-verification":
    "/blog/google-business-profile-nepal-setup-guide",
};

export function isRetiredDuplicateBlogPath(pathname: string): boolean {
  return Object.prototype.hasOwnProperty.call(duplicateBlogRedirects, pathname);
}

export function removeRetiredDuplicatePosts(posts: BlogPost[]): BlogPost[] {
  return [...new Map(
    posts
      .filter((post) => !isRetiredDuplicateBlogPath(post.href))
      .map((post) => [post.href, post]),
  ).values()];
}
