import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "smartcasebd_admin_secret_key_2026_rbac_access_hash"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const adminToken = request.cookies.get("smartcasebd_admin_token")?.value;

    if (!adminToken) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const verified = await jwtVerify(adminToken, ADMIN_JWT_SECRET);
      const role = (verified.payload as { role?: string }).role;

      if (!role || !["SUPER_ADMIN", "ADMIN", "MANAGER", "EDITOR"].includes(role)) {
        return NextResponse.redirect(new URL("/admin/login?error=forbidden", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login?error=expired", request.url));
    }
  }

  // Protect /api/admin API routes (except /api/admin/login)
  if (pathname.startsWith("/api/admin") && pathname !== "/api/admin/login") {
    const adminToken = request.cookies.get("smartcasebd_admin_token")?.value;

    if (!adminToken) {
      return NextResponse.json(
        { error: "Unauthorized access to admin API" },
        { status: 401 }
      );
    }

    try {
      await jwtVerify(adminToken, ADMIN_JWT_SECRET);
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired admin token" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
