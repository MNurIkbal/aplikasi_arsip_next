import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const isLoginPage = req.nextUrl.pathname === "/login";
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isUsersPage = req.nextUrl.pathname.startsWith("/users");
  const isArsipPage = req.nextUrl.pathname.startsWith("/arsip");

  // ❌ Belum login tapi akses dashboard
  if (!token && isDashboard) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ❌ Sudah login tapi akses login page
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ✅ Validasi token
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};