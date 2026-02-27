import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const [
      totalRevenueResult,
      monthlyRevenueResult,
      lastMonthRevenueResult,
      weeklyRevenueResult,
      todayRevenueResult,
      totalTransactions,
      completedPayments,
      failedPayments,
      refundedPayments,
      pendingWithdrawals,
      totalDoctorPayouts,
      recentPayments,
      revenueByDay,
    ] = await Promise.all([
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "completed" },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "completed", createdAt: { gte: startOfMonth } },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: "completed",
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "completed", createdAt: { gte: startOfWeek } },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "completed", createdAt: { gte: startOfDay } },
      }),
      prisma.payment.count(),
      prisma.payment.count({ where: { status: "completed" } }),
      prisma.payment.count({ where: { status: "failed" } }),
      prisma.payment.count({ where: { status: "refunded" } }),
      prisma.doctorWithdrawal.count({ where: { status: "pending" } }),
      prisma.doctorPayout.aggregate({
        _sum: { amount: true },
        where: { status: "completed" },
      }),
      prisma.payment.findMany({
        take: 20,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { fullName: true, phoneNumber: true, email: true } },
          application: { select: { id: true, certificateType: true, status: true } },
        },
      }),
      // Revenue by day for last 30 days — raw query for grouping
      prisma.payment.findMany({
        where: {
          status: "completed",
          createdAt: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) },
        },
        select: { createdAt: true, amount: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const totalRevenue = totalRevenueResult._sum.amount || 0;
    const monthlyRevenue = monthlyRevenueResult._sum.amount || 0;
    const lastMonthRevenue = lastMonthRevenueResult._sum.amount || 0;
    const weeklyRevenue = weeklyRevenueResult._sum.amount || 0;
    const todayRevenue = todayRevenueResult._sum.amount || 0;
    const avgOrderValue = completedPayments > 0 ? totalRevenue / completedPayments : 0;
    const revenueGrowth =
      lastMonthRevenue > 0
        ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : monthlyRevenue > 0
          ? 100
          : 0;

    // Group revenue by date for chart
    const chartMap = new Map<string, number>();
    for (const p of revenueByDay) {
      const dateKey = p.createdAt.toISOString().split("T")[0];
      chartMap.set(dateKey, (chartMap.get(dateKey) || 0) + p.amount);
    }
    const revenueChart = Array.from(chartMap.entries()).map(([date, amount]) => ({
      date,
      amount: Math.round(amount * 100) / 100,
    }));

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
          weeklyRevenue: Math.round(weeklyRevenue * 100) / 100,
          todayRevenue: Math.round(todayRevenue * 100) / 100,
          totalTransactions,
          completedPayments,
          failedPayments,
          refundedPayments,
          pendingWithdrawals,
          totalDoctorPayouts: Math.round((totalDoctorPayouts._sum.amount || 0) * 100) / 100,
          averageOrderValue: Math.round(avgOrderValue * 100) / 100,
          revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        },
        recentPayments,
        revenueChart,
      },
    });
  } catch (error) {
    console.error("Admin payments error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch payments data" },
      { status: 500 }
    );
  }
}
