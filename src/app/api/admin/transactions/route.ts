import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";
import type { TransactionType } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as TransactionType | null;
    const status = searchParams.get("status");
    const dateRange = searchParams.get("dateRange");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build filter
    const where: Prisma.TransactionWhereInput = {};

    if (type) where.type = type;
    if (status) where.status = status;

    // Date range
    const now = new Date();
    if (dateRange === "today") {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      where.createdAt = { gte: start };
    } else if (dateRange === "7d") {
      where.createdAt = { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
    } else if (dateRange === "30d") {
      where.createdAt = { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
    } else if (dateRange === "90d") {
      where.createdAt = { gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) };
    } else if (dateRange === "custom" && startDate && endDate) {
      where.createdAt = { gte: new Date(startDate), lte: new Date(endDate) };
    }

    if (search) {
      where.OR = [
        { description: { contains: search, mode: "insensitive" } },
        { id: { contains: search, mode: "insensitive" } },
      ];
    }

    const [transactions, total, stats] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where }),
      prisma.transaction.groupBy({
        by: ["type"],
        _count: { id: true },
        _sum: { amount: true },
      }),
    ]);

    // Resolve user/doctor names for transactions
    const userIds = [...new Set(transactions.filter((t) => t.userId).map((t) => t.userId!))];
    const doctorIds = [...new Set(transactions.filter((t) => t.doctorId).map((t) => t.doctorId!))];

    const [users, doctors] = await Promise.all([
      userIds.length > 0
        ? prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, fullName: true },
          })
        : [],
      doctorIds.length > 0
        ? prisma.doctor.findMany({
            where: { id: { in: doctorIds } },
            select: { id: true, fullName: true },
          })
        : [],
    ]);

    const userMap = new Map(users.map((u) => [u.id, u.fullName]));
    const doctorMap = new Map(doctors.map((d) => [d.id, d.fullName]));

    const enrichedTransactions = transactions.map((t) => ({
      ...t,
      userName: t.userId ? userMap.get(t.userId) || null : null,
      doctorName: t.doctorId ? doctorMap.get(t.doctorId) || null : null,
    }));

    // Aggregate stats by type
    const statsMap = new Map(stats.map((s) => [s.type, { count: s._count.id, amount: s._sum.amount || 0 }]));

    return NextResponse.json({
      success: true,
      data: {
        transactions: enrichedTransactions,
        total,
        page,
        limit,
        stats: {
          totalAmount: stats.reduce((sum, s) => sum + (s._sum.amount || 0), 0),
          paymentCount: statsMap.get("payment")?.count || 0,
          refundCount: statsMap.get("refund")?.count || 0,
          payoutCount: statsMap.get("doctor_payout")?.count || 0,
          withdrawalCount: statsMap.get("withdrawal")?.count || 0,
        },
      },
    });
  } catch (error) {
    console.error("Admin transactions error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
