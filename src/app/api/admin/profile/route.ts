import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const { adminUser } = auth;

    return NextResponse.json({
      success: true,
      data: {
        id: adminUser.id,
        fullName: adminUser.fullName,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error("Admin profile GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const { adminUser } = auth;
    const body = await request.json();
    const { fullName, email } = body as { fullName?: string; email?: string };

    if (!fullName && !email) {
      return NextResponse.json(
        { success: false, message: "At least one field is required" },
        { status: 400 }
      );
    }

    const updateData: Record<string, string> = {};
    if (fullName?.trim()) updateData.fullName = fullName.trim();
    if (email?.trim()) {
      // Basic email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json(
          { success: false, message: "Invalid email address" },
          { status: 400 }
        );
      }
      // Check uniqueness if email is changing
      if (email.trim() !== adminUser.email) {
        const existing = await prisma.adminUser.findUnique({
          where: { email: email.trim() },
        });
        if (existing) {
          return NextResponse.json(
            { success: false, message: "Email is already in use" },
            { status: 409 }
          );
        }
      }
      updateData.email = email.trim();
    }

    const updated = await prisma.adminUser.update({
      where: { id: adminUser.id },
      data: updateData,
      select: { id: true, fullName: true, email: true, role: true },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Admin profile PUT error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
