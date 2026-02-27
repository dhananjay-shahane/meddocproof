import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateUserRequest, isAuthError } from "@/lib/api-auth";

// GET - Get user profile with stats
export async function GET(request: NextRequest) {
  try {
    const auth = await validateUserRequest(request);
    if (isAuthError(auth)) return auth;

    const [user, applicationStats, paymentStats] = await Promise.all([
      prisma.user.findUnique({
        where: { id: auth.user.id },
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
          email: true,
          status: true,
          isVerified: true,
          createdAt: true,
          lastLoginAt: true,
        },
      }),
      prisma.application.groupBy({
        by: ["status"],
        where: { userId: auth.user.id },
        _count: { _all: true },
      }),
      prisma.payment.aggregate({
        where: { userId: auth.user.id, status: "completed" },
        _sum: { amount: true },
        _count: { _all: true },
      }),
    ]);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const totalApplications = applicationStats.reduce((sum, s) => sum + s._count._all, 0);
    const completedCertificates = applicationStats
      .filter((s) => ["completed", "certificate_delivered", "delivered"].includes(s.status))
      .reduce((sum, s) => sum + s._count._all, 0);

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        stats: {
          totalApplications,
          completedCertificates,
          totalSpent: paymentStats._sum.amount || 0,
          totalPayments: paymentStats._count._all,
        },
      },
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const auth = await validateUserRequest(request);
    if (isAuthError(auth)) return auth;

    const body = await request.json();
    const { fullName, email } = body;

    const updateData: Record<string, unknown> = {};
    if (fullName) updateData.fullName = fullName;
    if (email !== undefined) updateData.email = email || null;

    const updatedUser = await prisma.user.update({
      where: { id: auth.user.id },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        email: true,
        status: true,
        isVerified: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
