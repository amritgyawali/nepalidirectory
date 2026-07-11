import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

/** Keep Supabase auth sessions refreshed on navigation (Supabase SSR pattern). */
export async function middleware(request: NextRequest) {
  if (request.nextUrl.hostname === "nepalidirectory.com") {
    const canonical = request.nextUrl.clone();
    canonical.hostname = "www.nepalidirectory.com";
    canonical.protocol = "https:";
    canonical.port = "";
    return NextResponse.redirect(canonical, 308);
  }
  return updateSession(request);
}

export const config = {
  // Run on all routes except Next internals and static image assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
