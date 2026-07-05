import type { NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

/** Keep Supabase auth sessions refreshed on navigation (Supabase SSR pattern). */
export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Run on all routes except Next internals and static image assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
