import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const auth = await validateAdminRequest(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const tab = searchParams.get("tab") || "all";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const where: Record<string, unknown> = {};

    // Tab filters
    if (tab === "incomplete") {
      where.status = { notIn: ["completed", "certificate_delivered", "delivered"] };
    } else if (tab === "completed") {
      where.status = { in: ["completed", "certificate_delivered", "delivered"] };
    }

    if (search) {
      where.OR = [
        { certificateNumber: { contains: search, mode: "insensitive" } },
        { applicationId: { contains: search, mode: "insensitive" } },
        { user: { fullName: { contains: search, mode: "insensitive" } } },
        { user: { phoneNumber: { contains: search } } },
      ];
    }

    const orderByMap: Record<string, Record<string, string>> = {
      createdAt: { createdAt: sortOrder },
      certificateType: { certificateType: sortOrder },
      status: { status: sortOrder },
    };

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        orderBy: orderByMap[sortBy] || { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          applicationId: true,
          certificateNumber: true,
          certificateType: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              fullName: true,
              phoneNumber: true,
            },
          },
          assignedDoctor: {
            select: {
              fullName: true,
            },
          },
        },
      }),
      prisma.application.count({ where }),
    ]);

    const items = applications.map((app) => ({
      id: app.id,
      applicationId: app.applicationId,
      applicationDisplayId: app.applicationId?.slice(0, 10) || app.id.slice(0, 8),
      certificateNumber: app.certificateNumber,
      certificateType: app.certificateType,
      userName: app.user?.fullName || "Unknown",
      userPhone: app.user?.phoneNumber || "",
      doctorName: app.assignedDoctor?.fullName || null,
      status: app.status,
      issuedAt: ["completed", "certificate_delivered", "delivered"].includes(app.status)
        ? app.updatedAt.toISOString()
        : null,
      createdAt: app.createdAt.toISOString(),
    }));

    // Stats (unfiltered)
    const [totalCertificates, completedCount] = await Promise.all([
      prisma.application.count(),
      prisma.application.count({
        where: { status: { in: ["completed", "certificate_delivered", "delivered"] } },
      }),
    ]);

    const stats = {
      totalCertificates,
      completedCertificates: completedCount,
      pendingCertificates: totalCertificates - completedCount,
    };

    return NextResponse.json({
      success: true,
      data: {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      stats,
    });
  } catch (error) {
    console.error("Failed to fetch certificates:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}
