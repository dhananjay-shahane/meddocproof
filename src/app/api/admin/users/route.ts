import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));
    const search = searchParams.get("search");
    const filter = searchParams.get("filter") || "all"; // all | paid | unpaid
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

    // Build where clause
    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { phoneNumber: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filter by paid/unpaid — users who have >= 1 completed payment
    if (filter === "paid") {
      where.applications = {
        some: {
          payments: { some: { status: "completed" } },
        },
      };
    } else if (filter === "unpaid") {
      where.NOT = {
        applications: {
          some: {
            payments: { some: { status: "completed" } },
          },
        },
      };
    }

    // Build orderBy
    const orderByMap: Record<string, Prisma.UserOrderByWithRelationInput> = {
      name: { fullName: sortOrder },
      createdAt: { createdAt: sortOrder },
      lastLoginAt: { lastLoginAt: sortOrder },
    };
    const orderBy = orderByMap[sortBy] || { createdAt: sortOrder };

    // Fetch users and stats in parallel
    const [users, total, statsAgg] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
          email: true,
          status: true,
          isVerified: true,
          lastLoginAt: true,
          createdAt: true,
          _count: { select: { applications: true } },
          applications: {
            select: {
              id: true,
              status: true,
              createdAt: true,
              payments: {
                where: { status: "completed" },
                select: { amount: true },
              },
            },
          },
        },
      }),
      prisma.user.count({ where }),
      // Global stats (unfiltered)
      Promise.all([
        prisma.user.count(),
        prisma.application.count(),
        prisma.payment.aggregate({
          where: { status: "completed" },
          _sum: { amount: true },
        }),
        prisma.application.count({
          where: {
            status: {
              in: ["completed", "delivered", "certificate_delivered"],
            },
          },
        }),
      ]),
    ]);

    const [totalUsers, totalApplications, revenueAgg, completedApps] = statsAgg;
    const totalRevenue = revenueAgg._sum.amount || 0;

    // Compute derived fields for each user
    const items = users.map((user) => {
      const completedPayments = user.applications.flatMap((a) => a.payments);
      const totalSpent = completedPayments.reduce((sum, p) => sum + p.amount, 0);
      const hasPaidOrder = completedPayments.length > 0;
      const certificateCount = user.applications.filter((a) =>
        ["completed", "delivered", "certificate_delivered"].includes(a.status)
      ).length;
      const lastApp = user.applications.reduce<Date | null>((latest, a) => {
        const d = new Date(a.createdAt);
        return !latest || d > latest ? d : latest;
      }, null);

      return {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        status: user.status,
        isVerified: user.isVerified,
        hasPaidOrder,
        applicationCount: user._count.applications,
        certificateCount,
        totalSpent,
        lastApplicationAt: lastApp?.toISOString() || null,
        lastLoginAt: user.lastLoginAt?.toISOString() || null,
        createdAt: user.createdAt.toISOString(),
      };
    });

    // Sort by computed fields if needed
    if (sortBy === "totalSpent") {
      items.sort((a, b) =>
        sortOrder === "desc" ? b.totalSpent - a.totalSpent : a.totalSpent - b.totalSpent
      );
    } else if (sortBy === "applicationCount") {
      items.sort((a, b) =>
        sortOrder === "desc"
          ? b.applicationCount - a.applicationCount
          : a.applicationCount - b.applicationCount
      );
    }

    // Count paid users
    const paidUsersCount = await prisma.user.count({
      where: {
        applications: {
          some: { payments: { some: { status: "completed" } } },
        },
      },
    });

    const stats = {
      totalUsers,
      paidUsers: paidUsersCount,
      unpaidUsers: totalUsers - paidUsersCount,
      totalApplications,
      totalRevenue,
      avgRevenuePerUser: totalUsers > 0 ? Math.round(totalRevenue / totalUsers) : 0,
      conversionRate:
        totalApplications > 0
          ? Number(((completedApps / totalApplications) * 100).toFixed(1))
          : 0,
    };

    return NextResponse.json({
      success: true,
      data: { items, total, page, limit, totalPages: Math.ceil(total / limit) },
      stats,
    });
  } catch (error) {
    console.error("Users API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
