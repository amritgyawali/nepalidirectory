import { createServerClient } from "@supabase/ssr";

/** The awaited return of Next's `cookies()` — used as the server cookie store. */
type CookieStore = Awaited<ReturnType<typeof import("next/headers").cookies>>;

/**
 * Supabase client for Server Components / Route Handlers / Server Actions.
 * Pass the awaited `cookies()` store so auth sessions read/write the request cookies.
 */
export function createClient(cookieStore: CookieStore) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — safe to ignore; the middleware refreshes sessions.
          }
        },
      },
    },
  );
}
