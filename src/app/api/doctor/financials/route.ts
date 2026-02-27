import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateDoctorRequest, isAuthError } from "@/lib/api-auth";

// GET — fetch wallet + transactions + earnings chart
export async function GET(request: NextRequest) {
  try {
    const auth = await validateDoctorRequest(request);
    if (isAuthError(auth)) return auth;

    const doctorId = auth.doctorUser.id;

    // Ensure wallet exists
    let wallet = await prisma.doctorWallet.findUnique({
      where: { doctorId },
    });

    if (!wallet) {
      wallet = await prisma.doctorWallet.create({
        data: { doctorId },
      });
    }

    const [recentTransactions, recentWithdrawals, payouts] = await Promise.all([
      prisma.transaction.findMany({
        where: { doctorId },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.doctorWithdrawal.findMany({
        where: { doctorId },
        orderBy: { requestedAt: "desc" },
        take: 10,
      }),
      // Monthly earnings for chart (last 6 months)
      prisma.doctorPayout.findMany({
        where: {
          doctorId,
          status: "completed",
          createdAt: {
            gte: new Date(
              new Date().setMonth(new Date().getMonth() - 6)
            ),
          },
        },
        select: { amount: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    // Aggregate earnings by month
    const earningsMap = new Map<string, number>();
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      earningsMap.set(key, 0);
    }
    payouts.forEach((p) => {
      const key = `${p.createdAt.getFullYear()}-${String(
        p.createdAt.getMonth() + 1
      ).padStart(2, "0")}`;
      earningsMap.set(key, (earningsMap.get(key) ?? 0) + p.amount);
    });

    const earningsChart = Array.from(earningsMap.entries()).map(
      ([date, amount]) => ({ date, amount })
    );

    return NextResponse.json({
      success: true,
      data: {
        wallet,
        recentTransactions,
        recentWithdrawals,
        earningsChart,
      },
    });
  } catch (error) {
    console.error("Doctor financials error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load financials" },
      { status: 500 }
    );
  }
}
