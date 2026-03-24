import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow /admin/login through without auth check
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Check for Supabase auth cookies
  // Supabase stores session in cookies prefixed with sb-<project-ref>-auth-token
  const hasSession = request.cookies.getAll().some(
    (c) => c.name.includes("sb-") && c.name.includes("auth-token")
  );

  if (!hasSession) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
