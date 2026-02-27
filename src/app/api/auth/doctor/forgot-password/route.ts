import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const doctor = await prisma.doctor.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!doctor) {
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, a reset link has been sent.",
      });
    }

    // Generate token and set 1-hour expiry
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.doctor.update({
      where: { id: doctor.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpiry: resetExpiry,
      },
    });

    // In production, send email with reset link
    // For now, log the token (visible in server console)
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/doctor/login?reset=${resetToken}`;
    console.log(`[PASSWORD RESET] Doctor ${email}: ${resetUrl}`);

    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, a reset link has been sent.",
      // Only return token in dev mode for testing
      ...(process.env.NODE_ENV !== "production" && { resetToken, resetUrl }),
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process request" },
      { status: 500 }
    );
  }
}
