import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
  console.error("FATAL: JWT_SECRET environment variable is not set in production!");
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "meddocproof-secret-key-dev-only"
);

// Public paths that don't require authentication
const publicPaths = [
  "/",
  "/login",
  "/register",
  "/admin/login",
  "/doctor/login",
  "/doctor/register",
  "/doctor/pending-approval",
  "/verify-certificate",
  "/certificates/apply",
  "/profile",
  "/api/auth",
];

function isPublicPath(pathname: string): boolean {
  return publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public paths and static files
  if (
    isPublicPath(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Each role has its own httpOnly cookie — no shared token
  const adminToken = request.cookies.get("admin_token")?.value;
  const doctorToken = request.cookies.get("doctor_token")?.value;

  // Admin routes
  if (pathname.startsWith("/admin")) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    try {
      const { payload } = await jwtVerify(adminToken, JWT_SECRET);
      if (payload.type !== "admin") {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Doctor routes
  if (pathname.startsWith("/doctor")) {
    if (!doctorToken) {
      return NextResponse.redirect(new URL("/doctor/login", request.url));
    }
    try {
      const { payload } = await jwtVerify(doctorToken, JWT_SECRET);
      if (payload.type !== "doctor") {
        return NextResponse.redirect(new URL("/doctor/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/doctor/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
