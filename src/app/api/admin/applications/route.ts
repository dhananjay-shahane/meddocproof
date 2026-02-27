import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";
import { Prisma } from "@prisma/client";

const TEMPORARY_STATUSES = ["in_progress", "incomplete", "dormant"];
const COMPLETED_STATUSES = ["completed", "delivered", "certificate_delivered"];

export async function GET(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const tab = searchParams.get("tab") || "all";
    const status = searchParams.get("status");
    const certificateType = searchParams.get("certificateType");
    const search = searchParams.get("search");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    // Build where clause
    const where: Prisma.ApplicationWhereInput = {};

    // Tab-based filtering
    if (tab === "temporary") {
      where.status = { in: TEMPORARY_STATUSES as Prisma.EnumApplicationStatusFilter["in"] };
      where.paymentCompleted = false;
    } else if (tab === "completed") {
      where.status = { in: COMPLETED_STATUSES as Prisma.EnumApplicationStatusFilter["in"] };
    }

    // Status filter (overrides tab if provided)
    if (status && status !== "all") {
      where.status = status as Prisma.EnumApplicationStatusFilter;
    }

    // Certificate type filter
    if (certificateType && certificateType !== "all") {
      where.certificateType = certificateType as Prisma.EnumCertificateTypeFilter;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo + "T23:59:59.999Z");
    }

    // Search filter
    if (search) {
      where.OR = [
        { applicationId: { contains: search, mode: "insensitive" } },
        { user: { fullName: { contains: search, mode: "insensitive" } } },
        { user: { phoneNumber: { contains: search } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Run query and tab counts in parallel
    const [applications, total, allCount, temporaryCount, completedCount] =
      await Promise.all([
        prisma.application.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { updatedAt: "desc" },
          include: {
            user: {
              select: { id: true, fullName: true, phoneNumber: true, email: true },
            },
            assignedDoctor: {
              select: { id: true, fullName: true, specialization: true },
            },
          },
        }),
        prisma.application.count({ where }),
        prisma.application.count(),
        prisma.application.count({
          where: {
            status: { in: TEMPORARY_STATUSES as Prisma.EnumApplicationStatusFilter["in"] },
            paymentCompleted: false,
          },
        }),
        prisma.application.count({
          where: {
            status: { in: COMPLETED_STATUSES as Prisma.EnumApplicationStatusFilter["in"] },
          },
        }),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        items: applications,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      tabCounts: {
        all: allCount,
        temporary: temporaryCount,
        completed: completedCount,
      },
    });
  } catch (error) {
    console.error("Applications API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
