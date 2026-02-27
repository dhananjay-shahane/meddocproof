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

    const doctor = await prisma.doctor.findUnique({
      where: { passwordResetToken: token },
    });

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    if (!doctor.passwordResetExpiry || doctor.passwordResetExpiry < new Date()) {
      // Clear expired token
      await prisma.doctor.update({
        where: { id: doctor.id },
        data: { passwordResetToken: null, passwordResetExpiry: null },
      });
      return NextResponse.json(
        { success: false, message: "Reset token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    await prisma.doctor.update({
      where: { id: doctor.id },
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
