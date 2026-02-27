import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateUserRequest, isAuthError } from "@/lib/api-auth";
import { getRazorpay } from "@/lib/razorpay";
import { PAYMENT_OPTIONS, SPECIAL_FORMAT_FEE } from "@/lib/certificate-types";

export async function POST(request: NextRequest) {
  try {
    const auth = await validateUserRequest(request);
    if (isAuthError(auth)) return auth;

    const body = await request.json();
    const {
      applicationId,
      amount,
      paymentTier,
      specialFormatRequested,
      couponCode,
      discount,
    } = body as {
      applicationId: string;
      amount: number;
      paymentTier?: string;
      specialFormatRequested?: boolean;
      couponCode?: string;
      discount?: number;
    };

    if (!applicationId || !amount) {
      return NextResponse.json(
        { success: false, message: "Application ID and amount are required" },
        { status: 400 }
      );
    }

    // Verify application belongs to user
    const application = await prisma.application.findFirst({
      where: { id: applicationId, userId: auth.user.id },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    if (application.paymentCompleted) {
      return NextResponse.json(
        { success: false, message: "Payment already completed for this application" },
        { status: 400 }
      );
    }

    // ── Server-side price verification ──────────────────
    let expectedAmount = amount; // fallback to client amount if no tier
    let tierConvenienceFee = 0;
    let tierRefundable = true;

    if (paymentTier) {
      const tier = PAYMENT_OPTIONS.find((t) => t.id === paymentTier);
      if (!tier) {
        return NextResponse.json(
          { success: false, message: "Invalid payment tier" },
          { status: 400 }
        );
      }

      expectedAmount = tier.price;
      tierConvenienceFee = tier.convenienceFee ?? 0;
      tierRefundable = tier.refundable;

      if (specialFormatRequested) {
        expectedAmount += SPECIAL_FORMAT_FEE;
      }

      // Apply coupon discount
      const appliedDiscount = discount ?? 0;
      expectedAmount = Math.max(0, expectedAmount - appliedDiscount);

      // Anti-tampering: reject if client amount doesn't match
      if (Math.abs(expectedAmount - amount) > 1) {
        return NextResponse.json(
          {
            success: false,
            message: "Price mismatch. Please refresh and try again.",
          },
          { status: 400 }
        );
      }
    }

    // Create Razorpay order
    const receipt = `rcpt_${applicationId}`.slice(0, 40);
    const razorpayOrder = await getRazorpay().orders.create({
      amount: Math.round(expectedAmount * 100), // Convert to paise
      currency: "INR",
      receipt,
      notes: {
        applicationId,
        userId: auth.user.id,
        paymentTier: paymentTier || "unknown",
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        userId: auth.user.id,
        applicationId,
        razorpayOrderId: razorpayOrder.id,
        amount: expectedAmount,
        currency: "INR",
        status: "pending",
        couponCode: couponCode || null,
        discount: discount || 0,
        paymentTier: paymentTier || null,
        convenienceFee: tierConvenienceFee,
        isRefundable: tierRefundable,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: expectedAmount,
        currency: "INR",
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        applicationId,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
