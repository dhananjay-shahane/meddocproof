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

    // Run all DB queries in parallel
    const [
      totalApplications,
      pendingApplications,
      completedApplications,
      totalUsers,
      totalDoctors,
      activeDoctors,
      // Month-over-month counts
      thisMonthApps,
      lastMonthApps,
      thisMonthUsers,
      lastMonthUsers,
      // Revenue
      totalRevenueResult,
      thisMonthRevenue,
      lastMonthRevenue,
      thisWeekRevenue,
      todayRevenue,
      // Certificate distribution
      certificateDistribution,
      // Recent applications
      recentApplications,
      // Top doctors
      topDoctors,
      // Failed payments
      failedPayments,
      // Need attention: unassigned submitted applications
      unassignedApps,
    ] = await Promise.all([
      prisma.application.count(),
      prisma.application.count({
        where: { status: { in: ["submitted", "pending", "pending_review", "assigned"] } },
      }),
      prisma.application.count({
        where: { status: { in: ["completed", "delivered", "certificate_delivered"] } },
      }),
      prisma.user.count(),
      prisma.doctor.count(),
      prisma.doctor.count({ where: { status: "approved", isActive: true } }),
      // This month apps
      prisma.application.count({ where: { createdAt: { gte: startOfMonth } } }),
      // Last month apps
      prisma.application.count({
        where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
      }),
      // This month users
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      // Last month users
      prisma.user.count({
        where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
      }),
      // Total revenue
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "completed" },
      }),
      // This month revenue
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "completed", createdAt: { gte: startOfMonth } },
      }),
      // Last month revenue
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: "completed",
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),
      // This week revenue
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "completed", createdAt: { gte: startOfWeek } },
      }),
      // Today revenue
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "completed", createdAt: { gte: startOfDay } },
      }),
      // Certificate distribution
      prisma.application.groupBy({
        by: ["certificateType"],
        _count: { _all: true },
      }),
      // Recent 10 applications
      prisma.application.findMany({
        take: 10,
        orderBy: { updatedAt: "desc" },
        include: {
          user: { select: { id: true, fullName: true, phoneNumber: true, email: true } },
          assignedDoctor: { select: { id: true, fullName: true } },
        },
      }),
      // Top 5 doctors by earnings
      prisma.doctor.findMany({
        where: { status: "approved" },
        take: 5,
        orderBy: { completedCertificates: "desc" },
        select: {
          id: true,
          fullName: true,
          specialization: true,
          completedCertificates: true,
          avgRating: true,
          wallet: { select: { totalEarnings: true } },
        },
      }),
      // Failed payments
      prisma.payment.findMany({
        where: { status: "failed" },
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { fullName: true } },
          application: { select: { applicationId: true } },
        },
      }),
      // Unassigned submitted applications
      prisma.application.findMany({
        where: {
          status: { in: ["submitted", "pending"] },
          assignedDoctorId: null,
        },
        take: 10,
        orderBy: { createdAt: "asc" },
        include: {
          user: { select: { fullName: true } },
        },
      }),
    ]);

    const totalRevenue = totalRevenueResult._sum.amount || 0;
    const thisMonthRev = thisMonthRevenue._sum.amount || 0;
    const lastMonthRev = lastMonthRevenue._sum.amount || 0;

    // Calculate month-over-month percentages
    const calcMoM = (current: number, previous: number) =>
      previous === 0 ? (current > 0 ? 100 : 0) : Math.round(((current - previous) / previous) * 100);

    // Format certificate distribution
    const certLabels: Record<string, string> = {
      sick_leave: "Sick Leave",
      fitness: "Fitness",
      work_from_home: "Work From Home",
      caretaker: "Caretaker",
      recovery: "Recovery",
      fit_to_fly: "Fit-to-Fly",
      unfit_to_work: "Unfit To Work",
      unfit_to_travel: "Unfit To Travel",
      medical_diagnosis: "Medical Diagnosis",
    };
    const totalCerts = certificateDistribution.reduce((sum, c) => sum + c._count._all, 0);
    const formattedCertDist = certificateDistribution.map((c) => ({
      type: c.certificateType,
      label: certLabels[c.certificateType] || c.certificateType,
      count: c._count._all,
      percentage: totalCerts > 0 ? Math.round((c._count._all / totalCerts) * 100) : 0,
    }));

    // Format top doctors
    const formattedTopDocs = topDoctors.map((d) => ({
      id: d.id,
      fullName: d.fullName,
      specialization: d.specialization,
      totalEarnings: d.wallet?.totalEarnings || 0,
      completedCertificates: d.completedCertificates,
      avgRating: d.avgRating,
    }));

    // Format failed payments
    const formattedFailedPayments = failedPayments.map((p) => ({
      id: p.id,
      userId: p.userId,
      userName: p.user?.fullName || "Unknown",
      applicationId: p.applicationId,
      applicationDisplayId: p.application?.applicationId || p.applicationId,
      amount: p.amount,
      failedAt: p.createdAt.toISOString(),
    }));

    // Format need attention
    const formattedNeedAttention = unassignedApps.map((a) => ({
      id: a.id,
      applicationId: a.id,
      applicationDisplayId: a.applicationId,
      userName: a.user?.fullName || "Unknown",
      reason: "Unassigned — waiting for doctor assignment",
      priority: "high" as const,
      createdAt: a.createdAt.toISOString(),
    }));

    const dashboardStats = {
      totalApplications,
      pendingApplications,
      completedApplications,
      totalRevenue,
      totalDoctors,
      activeDoctors,
      totalUsers,
      recentApplications,
      monthOverMonth: {
        applications: calcMoM(thisMonthApps, lastMonthApps),
        revenue: calcMoM(thisMonthRev, lastMonthRev),
        users: calcMoM(thisMonthUsers, lastMonthUsers),
        doctors: 0,
      },
      certificateDistribution: formattedCertDist,
      topDoctors: formattedTopDocs,
      failedPayments: formattedFailedPayments,
      needAttention: formattedNeedAttention,
      earnings: {
        today: todayRevenue._sum.amount || 0,
        thisWeek: thisWeekRevenue._sum.amount || 0,
        thisMonth: thisMonthRev,
      },
    };

    return NextResponse.json({ success: true, data: dashboardStats });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
