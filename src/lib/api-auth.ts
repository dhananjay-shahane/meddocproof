import { NextRequest, NextResponse } from "next/server";
import { verifyToken, extractToken, type JWTPayload } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * Extract a JWT from the request.
 * Priority: role-specific httpOnly cookie → Authorization header (fallback).
 */
function getTokenForRole(
  request: NextRequest,
  role: "admin" | "doctor" | "user"
): string | null {
  // 1. httpOnly cookie set by the login API
  const cookieToken = request.cookies.get(`${role}_token`)?.value;
  if (cookieToken) return cookieToken;
  // 2. Authorization header (for programmatic / Postman callers)
  return extractToken(request.headers.get("authorization"));
}

export interface AdminAuthResult {
  payload: JWTPayload;
  adminUser: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    permissions: unknown;
  };
}

/**
 * Validate that an incoming request is from an authenticated admin user.
 * Returns the JWT payload and admin user record, or a NextResponse error.
 */
export async function validateAdminRequest(
  request: NextRequest
): Promise<AdminAuthResult | NextResponse> {
  const token = getTokenForRole(request, "admin");

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Authentication required" },
      { status: 401 }
    );
  }

  const payload = await verifyToken(token);
  if (!payload || payload.type !== "admin") {
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }

  const adminUser = await prisma.adminUser.findUnique({
    where: { id: payload.id },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      permissions: true,
      isActive: true,
    },
  });

  if (!adminUser || !adminUser.isActive) {
    return NextResponse.json(
      { success: false, message: "Admin account not found or deactivated" },
      { status: 403 }
    );
  }

  return { payload, adminUser };
}

// ============================================
// Doctor Auth
// ============================================

export interface DoctorAuthResult {
  payload: JWTPayload;
  doctorUser: {
    id: string;
    fullName: string;
    email: string;
    status: string;
    specialization: string;
    registrationNumber: string;
  };
}

/**
 * Validate that an incoming request is from an authenticated, approved doctor.
 * Returns the JWT payload and doctor record, or a NextResponse error.
 */
export async function validateDoctorRequest(
  request: NextRequest
): Promise<DoctorAuthResult | NextResponse> {
  const token = getTokenForRole(request, "doctor");

  if (!token) {
    console.log("Doctor auth: No token found in cookies");
    return NextResponse.json(
      { success: false, message: "Authentication required" },
      { status: 401 }
    );
  }

  const payload = await verifyToken(token);
  if (!payload || payload.type !== "doctor") {
    console.log("Doctor auth: Invalid token or wrong type", payload?.type);
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }

  const doctorUser = await prisma.doctor.findUnique({
    where: { id: payload.id },
    select: {
      id: true,
      fullName: true,
      email: true,
      status: true,
      isActive: true,
      specialization: true,
      registrationNumber: true,
    },
  });

  if (!doctorUser || !doctorUser.isActive) {
    console.log("Doctor auth: Doctor not found or inactive", payload.id);
    return NextResponse.json(
      { success: false, message: "Doctor account not found or deactivated" },
      { status: 403 }
    );
  }

  if (doctorUser.status !== "approved") {
    console.log("Doctor auth: Doctor not approved", doctorUser.status);
    return NextResponse.json(
      { success: false, message: "Doctor account is not approved" },
      { status: 403 }
    );
  }

  return { payload, doctorUser };
}

// ============================================
// User Auth
// ============================================

export interface UserAuthResult {
  payload: JWTPayload;
  user: {
    id: string;
    fullName: string;
    phoneNumber: string;
    email: string | null;
  };
}

export async function validateUserRequest(
  request: NextRequest
): Promise<UserAuthResult | NextResponse> {
  const token = getTokenForRole(request, "user");

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Authentication required" },
      { status: 401 }
    );
  }

  const payload = await verifyToken(token);
  if (!payload || payload.type !== "user") {
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: {
      id: true,
      fullName: true,
      phoneNumber: true,
      email: true,
      status: true,
    },
  });

  if (!user || user.status !== "active") {
    return NextResponse.json(
      { success: false, message: "User account not found or deactivated" },
      { status: 403 }
    );
  }

  return { payload, user };
}

/**
 * Helper to check if validateAdminRequest / validateDoctorRequest / validateUserRequest returned an error response
 */
export function isAuthError(
  result: AdminAuthResult | DoctorAuthResult | UserAuthResult | NextResponse
): result is NextResponse {
  return result instanceof NextResponse;
}
