import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Disarankan menggunakan 'jose' untuk Next.js Middleware

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // 1. Tentukan halaman mana saja yang butuh login
  const protectedPaths = ["/dashboard", "/users", "/arsip", "/penyimpanan"];
  const isProtectedPage = protectedPaths.some((path) => pathname.startsWith(path));
  const isLoginPage = pathname === "/login";

  // 2. Jika SUDAH login dan mencoba akses page /login -> Paksa ke Dashboard
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 3. Jika BELUM login dan mencoba akses menu terproteksi -> Lempar ke Login
  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 4. Validasi Token dan Role (Jika token ada)
  if (token) {
    try {
      // Menggunakan jose karena jsonwebtoken standar sering error di Edge Runtime
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      
      const role = payload.role as string; // Ambil role dari payload JWT

      // Logika Role Pegawai
      if (role === "Pegawai") {
        // Pegawai dilarang masuk ke /users dan /penyimpanan
        const isForbiddenForPegawai = pathname.startsWith("/users") || pathname.startsWith("/penyimpanan");
        
        if (isForbiddenForPegawai) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }

      // Role Admin: Tidak perlu pengecekan tambahan (bisa akses semua menu)

    } catch (error) {
      // Jika token invalid/expired, hapus cookie dan balik ke login
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

// Next.js butuh export default agar middleware jalan
export default function middleware(req: NextRequest) {
  return proxy(req);
}

// Update matcher agar mencakup semua menu
export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/users/:path*",
    "/arsip/:path*",
    "/penyimpanan/:path*",
  ],
};