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
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const status = searchParams.get("status");
    const active = searchParams.get("active");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "fullName";
    const sortOrder = (searchParams.get("sortOrder") || "asc") as "asc" | "desc";

    const where: Prisma.DoctorWhereInput = {};

    if (status) {
      where.status = status as Prisma.EnumDoctorStatusFilter;
    }
    if (active === "true") {
      where.isActive = true;
    } else if (active === "false") {
      where.isActive = false;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { registrationNumber: { contains: search, mode: "insensitive" } },
        { specialization: { contains: search, mode: "insensitive" } },
      ];
    }

    // Build orderBy
    const orderByMap: Record<string, Prisma.DoctorOrderByWithRelationInput> = {
      fullName: { fullName: sortOrder },
      createdAt: { createdAt: sortOrder },
      avgRating: { avgRating: sortOrder },
      consultationCount: { consultationCount: sortOrder },
      completedCertificates: { completedCertificates: sortOrder },
      lastActive: { lastActive: sortOrder },
    };
    const orderBy = orderByMap[sortBy] || { fullName: sortOrder };

    const [doctors, total, summaryData] = await Promise.all([
      prisma.doctor.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          registrationNumber: true,
          specialization: true,
          qualification: true,
          experience: true,
          status: true,
          isActive: true,
          avgRating: true,
          totalRatings: true,
          responseRate: true,
          avgCompletionTime: true,
          completedCertificates: true,
          consultationCount: true,
          lastActive: true,
          createdAt: true,
          wallet: {
            select: { balance: true, totalEarnings: true },
          },
          _count: { select: { applications: true } },
        },
      }),
      prisma.doctor.count({ where }),
      // Summary stats (unfiltered)
      Promise.all([
        prisma.doctor.count(),
        prisma.doctor.count({ where: { status: "approved", isActive: true } }),
        prisma.doctor.count({ where: { status: "pending" } }),
        prisma.doctor.aggregate({
          where: { status: "approved" },
          _avg: { avgRating: true },
          _sum: { completedCertificates: true },
        }),
        prisma.doctorWallet.aggregate({ _sum: { totalEarnings: true } }),
      ]),
    ]);

    const [totalDoctors, activeDoctors, pendingApprovals, docAgg, walletAgg] = summaryData;

    const summary = {
      totalDoctors,
      activeDoctors,
      pendingApprovals,
      totalEarnings: walletAgg._sum?.totalEarnings ?? 0,
      avgRating: Number((docAgg._avg?.avgRating ?? 0).toFixed(1)),
      totalCertificatesIssued: docAgg._sum?.completedCertificates ?? 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        items: doctors,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      summary,
    });
  } catch (error) {
    console.error("Doctors API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}
