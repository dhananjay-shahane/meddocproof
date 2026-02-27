import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest } from "@/lib/api-auth";
import { isAuthError } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const auth = await validateAdminRequest(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const filter = searchParams.get("filter") || "all";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const where: Record<string, unknown> = {};

    if (search) {
      where.code = { contains: search, mode: "insensitive" };
    }

    if (filter === "active") {
      where.isActive = true;
      where.OR = [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ];
    } else if (filter === "expired") {
      where.OR = [
        { isActive: false },
        { expiresAt: { lte: new Date() } },
      ];
    }

    const orderByMap: Record<string, string> = {
      code: "code",
      createdAt: "createdAt",
      discountValue: "discountValue",
      usedCount: "usedCount",
      expiresAt: "expiresAt",
    };

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        orderBy: { [orderByMap[sortBy] || "createdAt"]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.coupon.count({ where }),
    ]);

    // Stats (unfiltered)
    const [totalCoupons, activeCouponsRaw, allCoupons] = await Promise.all([
      prisma.coupon.count(),
      prisma.coupon.findMany({
        where: {
          isActive: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
        select: { id: true },
      }),
      prisma.coupon.aggregate({ _sum: { usedCount: true } }),
    ]);

    const expiredCount = totalCoupons - activeCouponsRaw.length;

    const stats = {
      totalCoupons,
      activeCoupons: activeCouponsRaw.length,
      expiredCoupons: expiredCount,
      totalUsage: allCoupons._sum.usedCount || 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        items: coupons,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      stats,
    });
  } catch (error) {
    console.error("Failed to fetch coupons:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await validateAdminRequest(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const { code, discountType, discountValue, maxUses, expiresAt } = body;

    if (!code || !discountType || discountValue == null) {
      return NextResponse.json(
        { success: false, message: "Code, discount type, and value are required" },
        { status: 400 }
      );
    }

    if (!["percentage", "fixed"].includes(discountType)) {
      return NextResponse.json(
        { success: false, message: "Discount type must be 'percentage' or 'fixed'" },
        { status: 400 }
      );
    }

    if (discountType === "percentage" && (discountValue < 1 || discountValue > 100)) {
      return NextResponse.json(
        { success: false, message: "Percentage discount must be between 1 and 100" },
        { status: 400 }
      );
    }

    // Check for duplicate code
    const existing = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Coupon code already exists" },
        { status: 409 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue: parseFloat(discountValue),
        maxUses: parseInt(maxUses) || 0,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: coupon,
      message: "Coupon created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create coupon:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create coupon" },
      { status: 500 }
    );
  }
}
