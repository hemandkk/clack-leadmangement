import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/login",
  "/forgot-password",
  "/accept-invite",
  "/api/webhooks",
  "/register",
];
const SUPER_ADMIN_ROOT = "/admin";
// Routes that should NOT receive tenant header
const EXCLUDED_ROUTES = ["/register", "/verify-otp", "/setup-tenant"];

export function proxy(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";

  // ── Extract tenant slug from subdomain ─────────────────
  // e.g. acme.leadpro.app → "acme"
  // e.g. localhost:3000 → null (local dev)
  // e.g. crm.acmecorp.com (white-label custom domain) → handled below
  const baseDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "leadpro.app";
  const isSubdomain = host.endsWith(`.${baseDomain}`);
  const tenantSlug = isSubdomain ? host.replace(`.${baseDomain}`, "") : null;

  // Allow public routes through
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // Read token from cookie (set this cookie on login)
  const token = request.cookies.get("access_token")?.value;
  const userRole = request.cookies.get("user_role")?.value;
  //const tenantId = request.cookies.get("tenant_id")?.value;

  // No token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Super admin trying to access tenant routes

  if (userRole === "super_admin") {
    if (!pathname.startsWith(SUPER_ADMIN_ROOT)) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  // Tenant users → only tenant routes
  if (userRole !== "super_admin") {
    if (pathname.startsWith(SUPER_ADMIN_ROOT)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  // 🚀 Extract subdomain
  const hostParts = hostname.split(".");
  let subdomain: string | null = null;
  if (hostParts.length > 2) {
    subdomain = hostParts[0]; // e.g. tenant.example.com → tenant
  }
  // 🚫 Skip excluded routes
  const isExcluded = EXCLUDED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  // Clone request headers
  const requestHeaders = new Headers(request.headers);
  // Inject tenant ID into request headers for server components

  // ✅ Add header only if NOT excluded and subdomain exists
  if (!isExcluded && subdomain) {
    requestHeaders.set("X-Tenant-Subdomain", subdomain);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  //matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],Middleware does NOT run for /api/*
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
