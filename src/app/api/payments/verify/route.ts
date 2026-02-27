import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { validateUserRequest, isAuthError } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  try {
    const auth = await validateUserRequest(request);
    if (isAuthError(auth)) return auth;

    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    };

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Missing payment verification data" },
        { status: 400 }
      );
    }

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET || "";
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Payment verification failed — invalid signature" },
        { status: 400 }
      );
    }

    // Find payment by order ID
    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, message: "Payment record not found" },
        { status: 404 }
      );
    }

    // Find the coupon code from the payment record (if any)
    const couponCode = payment.couponCode;

    // Update payment, application, coupon usage, and create transaction
    const txOps = [
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: "completed",
        },
      }),
      prisma.application.update({
        where: { id: payment.applicationId },
        data: {
          paymentCompleted: true,
          // Persist payment tier & format from the payment record
          ...(payment.paymentTier ? { paymentTier: payment.paymentTier } : {}),
        },
      }),
      // Create a transaction record
      prisma.transaction.create({
        data: {
          type: "payment",
          amount: payment.amount,
          status: "completed",
          description: `Payment for application ${payment.applicationId}`,
          paymentId: payment.id,
          userId: payment.userId,
          applicationId: payment.applicationId,
        },
      }),
    ];

    // Increment coupon usage if a coupon was applied
    if (couponCode) {
      txOps.push(
        prisma.coupon.update({
          where: { code: couponCode },
          data: { usedCount: { increment: 1 } },
        }) as never
      );
    }

    await prisma.$transaction(txOps);

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      data: {
        paymentId: payment.id,
        applicationId: payment.applicationId,
      },
    });
  } catch (error) {
    console.error("Payment verify error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
