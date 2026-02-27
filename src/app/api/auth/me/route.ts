import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/**
 * Resolve a token from the role-specific httpOnly cookies.
 * The `role` query-param hint tells the endpoint which cookie to read
 * so the front-end can request the right session.
 *   GET /api/auth/me?role=admin   → reads admin_token cookie
 *   GET /api/auth/me?role=doctor  → reads doctor_token cookie
 *   GET /api/auth/me              → reads user_token cookie (default)
 */
function getTokenFromCookies(request: NextRequest): string | null {
  const role = request.nextUrl.searchParams.get("role") || "user";
  const cookieName = `${role}_token`;
  return request.cookies.get(cookieName)?.value ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromCookies(request);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    let user = null;

    if (payload.type === "admin") {
      const admin = await prisma.adminUser.findUnique({
        where: { id: payload.id },
      });
      if (admin) {
        user = {
          id: admin.id,
          fullName: admin.fullName,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions,
          isActive: admin.isActive,
          type: "admin",
        };
      }
    } else if (payload.type === "doctor") {
      const doctor = await prisma.doctor.findUnique({
        where: { id: payload.id },
      });
      if (doctor) {
        user = {
          id: doctor.id,
          fullName: doctor.fullName,
          email: doctor.email,
          phoneNumber: doctor.phoneNumber,
          status: doctor.status,
          isActive: doctor.isActive,
          specialization: doctor.specialization,
          registrationNumber: doctor.registrationNumber,
          type: "doctor",
        };
      }
    } else if (payload.type === "user") {
      const dbUser = await prisma.user.findUnique({
        where: { id: payload.id },
      });
      if (dbUser) {
        user = {
          id: dbUser.id,
          fullName: dbUser.fullName,
          phoneNumber: dbUser.phoneNumber,
          email: dbUser.email,
          role: dbUser.role,
          isVerified: dbUser.isVerified,
          type: "user",
        };
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
