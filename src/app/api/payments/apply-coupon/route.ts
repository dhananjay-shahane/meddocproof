import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateUserRequest, isAuthError } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  try {
    const auth = await validateUserRequest(request);
    if (isAuthError(auth)) return auth;

    const body = await request.json();
    const { couponCode, amount } = body as {
      couponCode: string;
      amount: number;
    };

    if (!couponCode || !amount) {
      return NextResponse.json(
        { success: false, message: "Coupon code and amount are required" },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json({
        success: true,
        data: {
          valid: false,
          couponCode,
          discountType: "",
          discountValue: 0,
          originalAmount: amount,
          discountedAmount: amount,
          message: "Invalid coupon code",
        },
      });
    }

    if (!coupon.isActive) {
      return NextResponse.json({
        success: true,
        data: {
          valid: false,
          couponCode,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          originalAmount: amount,
          discountedAmount: amount,
          message: "This coupon is no longer active",
        },
      });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({
        success: true,
        data: {
          valid: false,
          couponCode,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          originalAmount: amount,
          discountedAmount: amount,
          message: "This coupon has expired",
        },
      });
    }

    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({
        success: true,
        data: {
          valid: false,
          couponCode,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          originalAmount: amount,
          discountedAmount: amount,
          message: "This coupon has reached its usage limit",
        },
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (amount * coupon.discountValue) / 100;
    } else if (coupon.discountType === "fixed") {
      discount = coupon.discountValue;
    }

    // Ensure discount doesn't exceed amount
    discount = Math.min(discount, amount);
    const discountedAmount = Math.max(amount - discount, 0);

    return NextResponse.json({
      success: true,
      data: {
        valid: true,
        couponCode: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        originalAmount: amount,
        discountedAmount: Math.round(discountedAmount * 100) / 100,
        message: `Coupon applied! You save ₹${discount.toFixed(2)}`,
      },
    });
  } catch (error) {
    console.error("Apply coupon error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to apply coupon" },
      { status: 500 }
    );
  }
}
