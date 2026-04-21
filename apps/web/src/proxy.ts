import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/forgot-password"];
const SUPER_ADMIN_ROOT = "/admin";
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes through
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // Read token from cookie (set this cookie on login)
  const token = request.cookies.get("access_token")?.value;
  const userRole = request.cookies.get("user_role")?.value;
  const tenantId = request.cookies.get("tenant_id")?.value;

  // No token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Super admin trying to access tenant routes

  if (userRole === "super_admin") {
    if (!pathname.startsWith(SUPER_ADMIN_ROOT)) {
      //return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  // Tenant users → only tenant routes
  if (userRole !== "super_admin") {
    if (pathname.startsWith(SUPER_ADMIN_ROOT)) {
      //return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Inject tenant ID into request headers for server components
  const response = NextResponse.next();
  if (tenantId) {
    response.headers.set("x-tenant-id", tenantId);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
