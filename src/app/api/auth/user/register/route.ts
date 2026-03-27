import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createToken } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";
import { emitToAdmins } from "@/lib/socket-server";
import { SOCKET_EVENTS } from "@/lib/socket-events";

/**
 * POST /api/auth/user/register
 * Body: { firstName, lastName, phoneNumber, otp }
 *
 * 1. Verify OTP
 * 2. Check if user already exists (→ redirect to login)
 * 3. Create user with firstName, lastName (fullName computed)
 * 4. Set httpOnly cookie & return user
 */
export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, phoneNumber, otp } = await request.json();

    if (!firstName || !lastName || !phoneNumber || !otp) {
      return NextResponse.json(
        { success: false, message: "First name, last name, phone number, and OTP are required" },
        { status: 400 }
      );
    }

    if (firstName.trim().length < 1) {
      return NextResponse.json(
        { success: false, message: "First name must be at least 1 character" },
        { status: 400 }
      );
    }

    if (lastName.trim().length < 1) {
      return NextResponse.json(
        { success: false, message: "Last name must be at least 1 character" },
        { status: 400 }
      );
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;

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
      const updatePayload: Record<string, unknown> = { isVerified: true, lastLoginAt: new Date() };
      if (!existing.fullName || existing.fullName.trim() === "") {
        updatePayload.firstName = firstName.trim();
        updatePayload.lastName = lastName.trim();
        updatePayload.fullName = fullName;
      }
      const updatedExisting = await prisma.user.update({
        where: { id: existing.id },
        data: updatePayload,
        select: { id: true, firstName: true, lastName: true, fullName: true, phoneNumber: true, email: true, role: true, isVerified: true },
      });

      const token = await createToken({
        id: updatedExisting.id,
        phoneNumber: updatedExisting.phoneNumber,
        role: updatedExisting.role,
        type: "user",
      });

      const response = NextResponse.json({
        success: true,
        message: "Account already exists — logged in",
        user: {
          id: updatedExisting.id,
          firstName: updatedExisting.firstName,
          lastName: updatedExisting.lastName,
          fullName: updatedExisting.fullName,
          phoneNumber: updatedExisting.phoneNumber,
          email: updatedExisting.email,
          role: updatedExisting.role,
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

    // ── Create new user with firstName, lastName, fullName ───────────────────────
    const user = await prisma.user.create({
      data: {
        phoneNumber,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fullName,
        isVerified: true,
      },
    });

    const token = await createToken({
      id: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role,
      type: "user",
    });

    // Notify admin about new user registration
    await createNotification(prisma, {
      adminId: "system",
      type: "user_registered",
      title: "New User Registered",
      message: `${user.fullName} has created an account`,
      metadata: { userId: user.id, phoneNumber: user.phoneNumber },
    });
    emitToAdmins(SOCKET_EVENTS.USER_REGISTERED, {
      userId: user.id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt.toISOString(),
    });

    const response = NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
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
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, message: "Internal server error", detail: message },
      { status: 500 }
    );
  }
}
