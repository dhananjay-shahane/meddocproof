import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: "Token and new password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: { passwordResetToken: token },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    if (!admin.passwordResetExpiry || admin.passwordResetExpiry < new Date()) {
      await prisma.adminUser.update({
        where: { id: admin.id },
        data: { passwordResetToken: null, passwordResetExpiry: null },
      });
      return NextResponse.json(
        { success: false, message: "Reset token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiry: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reset password" },
      { status: 500 }
    );
  }
}
