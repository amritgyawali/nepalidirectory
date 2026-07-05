import { createBrowserClient } from "@supabase/ssr";

/** Supabase client for Client Components (browser). Uses the public publishable key. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
  );
}
