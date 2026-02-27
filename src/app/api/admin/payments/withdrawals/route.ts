import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const withdrawals = await prisma.doctorWithdrawal.findMany({
      orderBy: { requestedAt: "desc" },
      include: {
        doctor: {
          select: {
            fullName: true,
            email: true,
            wallet: {
              select: { balance: true, totalEarnings: true, totalWithdrawn: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: withdrawals });
  } catch (error) {
    console.error("Admin withdrawals error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch withdrawals" },
      { status: 500 }
    );
  }
}
