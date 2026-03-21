import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: (url, init) => {
          return fetch(url, { ...init, cache: "no-store" });
        },
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // 1. PUBLIC ROUTES
  const publicRoutes = ["/", "/charities", "/how-it-works", "/pricing", "/login", "/signup", "/signup/success", "/auth/callback"];
  if (publicRoutes.includes(path) || path.startsWith("/api/webhooks") || path.startsWith("/auth/")) {
    return response;
  }

  // 2. AUTHENTICATION REDIRECT
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Create an admin client strictly to bypass RLS for routing checks
  // We use the basic createClient here so it DOES NOT inherit user cookies and downgrade the service_role key!
  const { createClient } = require("@supabase/supabase-js");
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 3. GET USER ROLE & SUBSCRIPTION STATUS (Bypassing RLS)
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  console.log(">>> MIDDLEWARE DEBUG: User email:", user.email, "Profile:", profile, "ProfileError:", profileError);

  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .single();

  const isActive = subscription?.status === "active";

  // 4. ROLE-BASED ACCESS
  if (path.startsWith("/admin") && profile?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 5. SUBSCRIPTION-GATED ACCESS
  // Restricted paths for non-active subscribers
  const subscriberRestrictedPaths = ["/dashboard", "/scores", "/draws/results", "/winnings"];
  if (subscriberRestrictedPaths.some(p => path.startsWith(p)) && !isActive && profile?.role !== "admin") {
    return NextResponse.redirect(new URL("/pricing", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public items)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|public).*)",
  ],
};
