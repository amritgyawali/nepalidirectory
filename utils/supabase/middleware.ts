import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const protectedPagePrefixes = ["/dashboard", "/account", "/gallery", "/admin", "/super-admin"];

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/** Refresh the session and enforce authentication/roles before private routes render. */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;
  const protectedPage = protectedPagePrefixes.some((prefix) => matchesPrefix(pathname, prefix));
  const protectedApi = matchesPrefix(pathname, "/api/admin");
  const requiresAdmin = matchesPrefix(pathname, "/admin") ||
    matchesPrefix(pathname, "/super-admin") || protectedApi;

  function loginRedirect(reason?: string): NextResponse {
    const target = request.nextUrl.clone();
    target.pathname = "/login";
    target.search = "";
    target.searchParams.set("next", pathname);
    if (reason) target.searchParams.set("error", reason);
    return NextResponse.redirect(target, 307);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    if (protectedApi) {
      return NextResponse.json({ error: "Authentication service is not configured." }, { status: 503 });
    }
    return protectedPage ? loginRedirect("auth-not-configured") : response;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if ((protectedPage || protectedApi) && !user) {
      return protectedApi
        ? NextResponse.json({ error: "Authentication required." }, { status: 401 })
        : loginRedirect();
    }

    if (requiresAdmin && user) {
      const role = String(user.app_metadata?.role ?? "").toLowerCase().replace(/[_\s-]+/g, "");
      const isSuperAdmin = role === "superadmin";
      const allowed = matchesPrefix(pathname, "/super-admin")
        ? isSuperAdmin
        : isSuperAdmin || role === "admin";
      if (!allowed) {
        return protectedApi
          ? NextResponse.json({ error: "Administrator role required." }, { status: 403 })
          : NextResponse.redirect(new URL("/dashboard", request.url), 307);
      }
    }
  } catch {
    if (protectedApi) {
      return NextResponse.json({ error: "Authentication service unavailable." }, { status: 503 });
    }
    if (protectedPage) return loginRedirect("auth-unavailable");
  }

  return response;
}
