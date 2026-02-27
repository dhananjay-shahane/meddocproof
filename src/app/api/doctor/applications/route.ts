import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateDoctorRequest, isAuthError } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await validateDoctorRequest(request);
    if (isAuthError(auth)) return auth;

    const doctorId = auth.doctorUser.id;
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const certificateType = searchParams.get("certificateType") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { assignedDoctorId: doctorId };

    if (status) {
      where.status = status;
    }

    if (certificateType) {
      where.certificateType = certificateType;
    }

    if (search) {
      where.OR = [
        { applicationId: { contains: search, mode: "insensitive" } },
        { certificateNumber: { contains: search, mode: "insensitive" } },
        { user: { fullName: { contains: search, mode: "insensitive" } } },
        { user: { phoneNumber: { contains: search } } },
      ];
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { fullName: true, phoneNumber: true },
          },
        },
      }),
      prisma.application.count({ where }),
    ]);

    const items = applications.map((app) => ({
      id: app.id,
      applicationId: app.applicationId,
      applicationDisplayId: app.applicationId,
      certificateType: app.certificateType,
      status: app.status,
      userName: app.user?.fullName ?? "Unknown",
      userPhone: app.user?.phoneNumber ?? "",
      hasMedicalAssessment: app.hasMedicalAssessment,
      consultationCompleted: app.consultationCompleted,
      assignedAt: app.assignedAt?.toISOString() ?? null,
      createdAt: app.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Doctor applications list error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load applications" },
      { status: 500 }
    );
  }
}
