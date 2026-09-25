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
  // /blog has no tag filter, so legacy /blog?tag=X URLs were exact duplicates of /blog that
  // Search Console kept listing as "Alternative page with proper canonical tag". Permanently
  // redirect them to the clean path so Google drops the parameter URLs instead of recrawling them.
  if (request.nextUrl.pathname.startsWith("/blog") && request.nextUrl.searchParams.has("tag")) {
    const clean = request.nextUrl.clone();
    clean.searchParams.delete("tag");
    return NextResponse.redirect(clean, 301);
  }
  return updateSession(request);
}

export const config = {
  // Run on all routes except Next internals and static image assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
