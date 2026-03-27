import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest } from "@/lib/api-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await validateAdminRequest(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    const body = await request.json();

    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      return NextResponse.json(
        { success: false, message: "Coupon not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.code !== undefined) updateData.code = body.code.toUpperCase();
    if (body.discountType !== undefined) {
      if (!["percentage", "fixed"].includes(body.discountType)) {
        return NextResponse.json(
          { success: false, message: "Invalid discount type" },
          { status: 400 }
        );
      }
      updateData.discountType = body.discountType;
    }
    if (body.discountValue !== undefined) updateData.discountValue = parseFloat(body.discountValue);
    if (body.maxUses !== undefined) updateData.maxUses = parseInt(body.maxUses);
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.expiresAt !== undefined) updateData.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
    if (body.applicableFor !== undefined) updateData.applicableFor = body.applicableFor;
    if (body.couponType !== undefined) updateData.couponType = body.couponType;
    if (body.phoneNumber !== undefined) updateData.phoneNumber = body.phoneNumber;
    if (body.maxDiscountAmount !== undefined) updateData.maxDiscountAmount = body.maxDiscountAmount ? parseFloat(body.maxDiscountAmount) : null;

    // Validate percentage range
    if (
      (updateData.discountType || coupon.discountType) === "percentage" &&
      updateData.discountValue !== undefined
    ) {
      const val = updateData.discountValue as number;
      if (val < 1 || val > 100) {
        return NextResponse.json(
          { success: false, message: "Percentage must be between 1 and 100" },
          { status: 400 }
        );
      }
    }

    // Check code uniqueness if changed
    if (updateData.code && updateData.code !== coupon.code) {
      const existing = await prisma.coupon.findUnique({ where: { code: updateData.code as string } });
      if (existing) {
        return NextResponse.json(
          { success: false, message: "Coupon code already exists" },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.coupon.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Coupon updated successfully",
    });
  } catch (error) {
    console.error("Failed to update coupon:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update coupon" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await validateAdminRequest(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;

    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      return NextResponse.json(
        { success: false, message: "Coupon not found" },
        { status: 404 }
      );
    }

    await prisma.coupon.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete coupon:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
