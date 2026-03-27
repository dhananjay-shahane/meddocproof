import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, otp } = await request.json();

    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { success: false, message: "Phone number and OTP are required" },
        { status: 400 }
      );
    }

    // Clean phone number for lookup
    const cleanNumber = phoneNumber.replace(/^\+91/, "").replace(/\D/g, "");

    // Find the doctor first to get the exact phone number format stored
    const doctor = await prisma.doctor.findFirst({
      where: {
        OR: [
          { phoneNumber: phoneNumber },
          { phoneNumber: cleanNumber },
          { phoneNumber: `+91${cleanNumber}` },
        ],
      },
    });

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "No doctor account found with this phone number" },
        { status: 404 }
      );
    }

    // Find the latest OTP for this phone number (using doctor's stored format)
    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        phoneNumber: doctor.phoneNumber!,
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

    // Re-check doctor status (in case it changed between send and verify)
    if (doctor.status !== "approved") {
      return NextResponse.json(
        { success: false, message: `Your account is ${doctor.status}. Please contact admin.` },
        { status: 403 }
      );
    }

    if (!doctor.isActive) {
      return NextResponse.json(
        { success: false, message: "Your account is deactivated. Please contact admin." },
        { status: 403 }
      );
    }

    // Update last active timestamp
    await prisma.doctor.update({
      where: { id: doctor.id },
      data: { lastActive: new Date() },
    });

    const token = await createToken({
      id: doctor.id,
      email: doctor.email,
      phoneNumber: doctor.phoneNumber!,
      role: "doctor" as never,
      type: "doctor",
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: doctor.id,
        fullName: doctor.fullName,
        email: doctor.email,
        phoneNumber: doctor.phoneNumber,
        status: doctor.status,
        isActive: doctor.isActive,
        specialization: doctor.specialization,
        registrationNumber: doctor.registrationNumber,
        type: "doctor",
      },
    });

    // Set httpOnly cookie — separate from user/admin
    response.cookies.set("doctor_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Doctor verify OTP error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
