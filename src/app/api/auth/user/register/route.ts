import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createToken } from "@/lib/auth";

/**
 * POST /api/auth/user/register
 * Body: { fullName, phoneNumber, otp }
 *
 * 1. Verify OTP
 * 2. Check if user already exists (→ redirect to login)
 * 3. Create user with fullName
 * 4. Set httpOnly cookie & return user
 */
export async function POST(request: NextRequest) {
  try {
    const { fullName, phoneNumber, otp } = await request.json();

    if (!fullName || !phoneNumber || !otp) {
      return NextResponse.json(
        { success: false, message: "Full name, phone number, and OTP are required" },
        { status: 400 }
      );
    }

    if (fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Full name must be at least 2 characters" },
        { status: 400 }
      );
    }

    // ── Verify OTP ──────────────────────────────────────────
    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        phoneNumber,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: "OTP expired. Please request a new one." },
        { status: 400 }
      );
    }

    if (otpRecord.attempts >= 5) {
      return NextResponse.json(
        { success: false, message: "Too many attempts. Please request a new OTP." },
        { status: 429 }
      );
    }

    // Increment attempts
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { attempts: { increment: 1 } },
    });

    if (otpRecord.otp !== otp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    // ── Check existing user ─────────────────────────────────
    const existing = await prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (existing) {
      // User exists — update name if it was empty, and log them in
      if (!existing.fullName || existing.fullName.trim() === "") {
        await prisma.user.update({
          where: { id: existing.id },
          data: { fullName: fullName.trim(), isVerified: true, lastLoginAt: new Date() },
        });
        existing.fullName = fullName.trim();
      } else {
        await prisma.user.update({
          where: { id: existing.id },
          data: { isVerified: true, lastLoginAt: new Date() },
        });
      }

      const token = await createToken({
        id: existing.id,
        phoneNumber: existing.phoneNumber,
        role: existing.role,
        type: "user",
      });

      const response = NextResponse.json({
        success: true,
        message: "Account already exists — logged in",
        user: {
          id: existing.id,
          fullName: existing.fullName,
          phoneNumber: existing.phoneNumber,
          email: existing.email,
          role: existing.role,
          isVerified: true,
          type: "user",
        },
      });

      response.cookies.set("user_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      return response;
    }

    // ── Create new user with fullName ───────────────────────
    const user = await prisma.user.create({
      data: {
        phoneNumber,
        fullName: fullName.trim(),
        isVerified: true,
      },
    });

    const token = await createToken({
      id: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role,
      type: "user",
    });

    const response = NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        type: "user",
      },
    });

    response.cookies.set("user_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
