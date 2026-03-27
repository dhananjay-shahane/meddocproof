import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateOTP } from "@/lib/auth";

const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY;

async function sendOTPviaSMS(phoneNumber: string, otp: string): Promise<boolean> {
  if (!FAST2SMS_API_KEY) {
    console.log(`[DEV MODE] Doctor OTP for ${phoneNumber}: ${otp}`);
    return true;
  }

  try {
    // Strip country code (+91) if present — Fast2SMS expects 10-digit Indian numbers
    const cleanNumber = phoneNumber.replace(/^\+91/, "").replace(/\D/g, "");

    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: FAST2SMS_API_KEY,
        "Content-Type": "application/json",
        accept: "*/*",
        "cache-control": "no-cache",
      },
      body: JSON.stringify({
        variables_values: otp,
        route: "otp",
        numbers: cleanNumber,
      }),
    });

    const data = await response.json();
    console.log(`Fast2SMS response for doctor ${cleanNumber}:`, data);
    return data.return === true;
  } catch (error) {
    console.error("Fast2SMS error:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: "Phone number is required" },
        { status: 400 }
      );
    }

    // Validate phone number format (10 digits, optionally with +91 prefix)
    const cleanNumber = phoneNumber.replace(/^\+91/, "").replace(/\D/g, "");
    if (cleanNumber.length !== 10) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid 10-digit phone number" },
        { status: 400 }
      );
    }

    // Check if doctor exists with this phone number
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

    // Check if doctor account is approved and active
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

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    await prisma.otpVerification.create({
      data: { phoneNumber: doctor.phoneNumber!, otp, expiresAt },
    });

    // Send OTP via Fast2SMS (or log in dev mode)
    const sent = await sendOTPviaSMS(doctor.phoneNumber!, otp);

    if (!sent && FAST2SMS_API_KEY) {
      return NextResponse.json(
        { success: false, message: "Failed to send OTP. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: FAST2SMS_API_KEY
        ? "OTP sent to your phone"
        : "OTP generated (dev mode)",
      // Show OTP in response only in dev mode when no SMS provider is configured
      ...(!FAST2SMS_API_KEY && process.env.NODE_ENV !== "production" && { otp }),
    });
  } catch (error) {
    console.error("Doctor send OTP error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
