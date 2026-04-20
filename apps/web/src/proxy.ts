
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/forgot-password'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes through
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // Read token from cookie (set this cookie on login)
  const token = request.cookies.get('access_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  const tenantId = request.cookies.get('tenant_id')?.value;

  // No token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Super admin trying to access tenant routes
  if (userRole === 'super_admin' && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/super-admin/dashboard', request.url));
  }

  // Tenant user trying to access super admin routes
  if (userRole !== 'super_admin' && pathname.startsWith('/super-admin')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Inject tenant ID into request headers for server components
  const response = NextResponse.next();
  if (tenantId) {
    response.headers.set('x-tenant-id', tenantId);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};
