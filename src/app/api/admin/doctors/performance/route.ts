import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    // Parallel queries for performance data
    const [
      doctors,
      totalCerts,
      certsByType,
    ] = await Promise.all([
      prisma.doctor.findMany({
        where: { status: "approved" },
        select: {
          id: true,
          fullName: true,
          specialization: true,
          avgRating: true,
          totalRatings: true,
          responseRate: true,
          avgCompletionTime: true,
          completedCertificates: true,
          wallet: { select: { totalEarnings: true } },
        },
      }),
      prisma.doctor.aggregate({
        where: { status: "approved" },
        _sum: { completedCertificates: true },
      }),
      prisma.application.groupBy({
        by: ["certificateType"],
        where: { status: { in: ["completed", "delivered", "certificate_delivered"] } },
        _count: true,
      }),
    ]);

    // Calculate overview
    const totalDoctors = doctors.length;
    const avgResponseRate =
      totalDoctors > 0
        ? Number((doctors.reduce((s, d) => s + d.responseRate, 0) / totalDoctors).toFixed(1))
        : 0;
    const avgCompletionTime =
      totalDoctors > 0
        ? Number(
            (doctors.reduce((s, d) => s + d.avgCompletionTime, 0) / totalDoctors).toFixed(1)
          )
        : 0;
    const totalCertificatesIssued = totalCerts._sum.completedCertificates || 0;

    // Certificate type distribution
    const typeLabels: Record<string, string> = {
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
    const certificatesByTypeFormatted = certsByType.map((c) => ({
      type: c.certificateType,
      label: typeLabels[c.certificateType] || c.certificateType,
      count: c._count,
    }));

    // Rating distribution
    const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: doctors.filter((d) => {
        const rounded = Math.round(d.avgRating);
        return rounded === stars;
      }).length,
    }));

    // Monthly trend — last 6 months completed applications
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyApps = await prisma.application.findMany({
      where: {
        status: { in: ["completed", "delivered", "certificate_delivered"] },
        updatedAt: { gte: sixMonthsAgo },
      },
      select: { updatedAt: true },
    });

    const monthlyMap = new Map<string, number>();
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthlyMap.set(key, 0);
    }
    monthlyApps.forEach((a) => {
      const d = new Date(a.updatedAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (monthlyMap.has(key)) {
        monthlyMap.set(key, (monthlyMap.get(key) || 0) + 1);
      }
    });
    const monthlyTrend = Array.from(monthlyMap.entries()).map(([month, count]) => ({
      month,
      count,
    }));

    // Top performers
    const topPerformers = doctors
      .sort((a, b) => b.completedCertificates - a.completedCertificates)
      .slice(0, 10)
      .map((d) => ({
        id: d.id,
        fullName: d.fullName,
        specialization: d.specialization,
        completedCertificates: d.completedCertificates,
        avgRating: d.avgRating,
        responseRate: d.responseRate,
        totalEarnings: d.wallet?.totalEarnings || 0,
      }));

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          avgResponseRate,
          avgCompletionTime,
          totalCertificatesIssued,
          totalDoctors,
        },
        certificatesByType: certificatesByTypeFormatted,
        ratingDistribution,
        monthlyTrend,
        topPerformers,
      },
    });
  } catch (error) {
    console.error("Doctor performance API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch performance data" },
      { status: 500 }
    );
  }
}
