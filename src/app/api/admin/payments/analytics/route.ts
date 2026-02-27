import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";

// GET - Payment analytics with date range filtering
export async function GET(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30d";

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    switch (range) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      case "6m":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "12m":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    const prevStartDate = new Date(startDate);
    prevStartDate.setTime(prevStartDate.getTime() - (now.getTime() - startDate.getTime()));

    const [
      currentRevenue,
      previousRevenue,
      paymentsByStatus,
      dailyRevenue,
      topCertificateTypes,
      avgOrderValue,
      doctorPayoutsTotal,
    ] = await Promise.all([
      // Current period revenue
      prisma.payment.aggregate({
        where: { status: "completed", createdAt: { gte: startDate } },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      // Previous period revenue (for trend)
      prisma.payment.aggregate({
        where: { status: "completed", createdAt: { gte: prevStartDate, lt: startDate } },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      // Payments grouped by status
      prisma.payment.groupBy({
        by: ["status"],
        where: { createdAt: { gte: startDate } },
        _count: { _all: true },
        _sum: { amount: true },
      }),
      // Daily revenue for chart
      prisma.$queryRawUnsafe<Array<{ date: string; total: number; count: number }>>(
        `SELECT DATE("createdAt") as date, SUM(amount) as total, COUNT(*)::int as count 
         FROM "Payment" 
         WHERE status = 'completed' AND "createdAt" >= $1 
         GROUP BY DATE("createdAt") 
         ORDER BY date ASC`,
        startDate
      ),
      // Revenue by certificate type
      prisma.$queryRawUnsafe<Array<{ type: string; total: number; count: number }>>(
        `SELECT a."certificateType" as type, SUM(p.amount) as total, COUNT(*)::int as count 
         FROM "Payment" p 
         JOIN "Application" a ON p."applicationId" = a.id 
         WHERE p.status = 'completed' AND p."createdAt" >= $1 
         GROUP BY a."certificateType" 
         ORDER BY total DESC`,
        startDate
      ),
      // Average order value
      prisma.payment.aggregate({
        where: { status: "completed", createdAt: { gte: startDate } },
        _avg: { amount: true },
      }),
      // Total doctor payouts
      prisma.doctorPayout.aggregate({
        where: { createdAt: { gte: startDate } },
        _sum: { amount: true },
      }),
    ]);

    const currentTotal = currentRevenue._sum.amount || 0;
    const previousTotal = previousRevenue._sum.amount || 0;
    const revenueTrend = previousTotal > 0
      ? ((currentTotal - previousTotal) / previousTotal) * 100
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalRevenue: currentTotal,
          totalOrders: currentRevenue._count._all,
          avgOrderValue: avgOrderValue._avg.amount || 0,
          revenueTrend: Math.round(revenueTrend * 10) / 10,
          doctorPayouts: doctorPayoutsTotal._sum.amount || 0,
          profit: currentTotal - (doctorPayoutsTotal._sum.amount || 0),
        },
        paymentsByStatus: paymentsByStatus.map((s) => ({
          status: s.status,
          count: s._count._all,
          amount: s._sum.amount || 0,
        })),
        dailyRevenue: dailyRevenue.map((d) => ({
          date: d.date,
          revenue: Number(d.total),
          orders: d.count,
        })),
        topCertificateTypes: topCertificateTypes.map((t) => ({
          type: t.type,
          revenue: Number(t.total),
          count: t.count,
        })),
        dateRange: { start: startDate.toISOString(), end: now.toISOString(), range },
      },
    });
  } catch (error) {
    console.error("Payment analytics error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
