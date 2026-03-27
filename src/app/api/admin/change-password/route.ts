import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";
import { hashPassword, comparePassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const { adminUser } = auth;
    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body as {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    };

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: "All password fields are required" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "New password and confirmation do not match" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Fetch the stored password hash
    const admin = await prisma.adminUser.findUnique({
      where: { id: adminUser.id },
      select: { password: true },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    // Validate current password
    const isMatch = await comparePassword(currentPassword, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash and update
    const hashedPassword = await hashPassword(newPassword);
    await prisma.adminUser.update({
      where: { id: adminUser.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to change password" },
      { status: 500 }
    );
  }
}
