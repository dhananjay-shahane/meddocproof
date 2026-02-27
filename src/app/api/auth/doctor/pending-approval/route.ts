import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, extractToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = extractToken(authHeader);

    if (!token) {
      // Also allow checking by email query param (for pre-login status check)
      const { searchParams } = new URL(request.url);
      const email = searchParams.get("email");

      if (!email) {
        return NextResponse.json(
          { success: false, message: "Authentication or email required" },
          { status: 401 }
        );
      }

      const doctor = await prisma.doctor.findUnique({
        where: { email },
        select: {
          id: true,
          fullName: true,
          email: true,
          status: true,
          isActive: true,
          createdAt: true,
        },
      });

      if (!doctor) {
        return NextResponse.json(
          { success: false, message: "No registration found for this email" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          status: doctor.status,
          fullName: doctor.fullName,
          email: doctor.email,
          registeredAt: doctor.createdAt,
        },
      });
    }

    // Token-based lookup
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        status: doctor.status,
        fullName: doctor.fullName,
        email: doctor.email,
        registeredAt: doctor.createdAt,
      },
    });
  } catch (error) {
    console.error("Pending approval check error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
