import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateOTP } from "@/lib/auth";
import { z } from "zod";

const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY;

// E.164 format: + followed by 1-15 digits
const PhoneSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
});

// Rate limit: 1 OTP per phone number per 60 seconds
const OTP_COOLDOWN_MS = 60 * 1000;

async function sendOTPviaSMS(phoneNumber: string, otp: string): Promise<boolean> {
  if (!FAST2SMS_API_KEY) {
    console.log(`[DEV MODE] OTP for ${phoneNumber}: ${otp}`);
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
    console.log(`Fast2SMS response for ${cleanNumber}:`, data);
    return data.return === true;
  } catch (error) {
    console.error("Fast2SMS error:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = PhoneSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || "Invalid phone number" },
        { status: 400 }
      );
    }

    const { phoneNumber } = parsed.data;

    // Rate limiting: check for recent OTP
    const recentOtp = await prisma.otpVerification.findFirst({
      where: {
        phoneNumber,
        createdAt: { gt: new Date(Date.now() - OTP_COOLDOWN_MS) },
      },
    });

    if (recentOtp) {
      return NextResponse.json(
        { success: false, message: "Please wait before requesting another OTP" },
        { status: 429 }
      );
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    await prisma.otpVerification.create({
      data: { phoneNumber, otp, expiresAt },
    });

    // Send OTP via Fast2SMS (or log in dev mode)
    const sent = await sendOTPviaSMS(phoneNumber, otp);

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
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
