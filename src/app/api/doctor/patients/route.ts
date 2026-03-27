import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateDoctorRequest, isAuthError } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await validateDoctorRequest(request);
    if (isAuthError(auth)) return auth;

    const doctorId = auth.doctorUser.id;
    const { searchParams } = new URL(request.url);
    const tab = searchParams.get("tab") || "all";

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Build where clause based on tab
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let where: any = { assignedDoctorId: doctorId };

    const pendingStatuses = [
      "assigned",
      "doctor_assigned",
      "pending_doctor_review",
      "under_review",
      "consultation_scheduled",
    ];
    const completedStatuses = ["completed", "delivered", "certificate_delivered"];

    switch (tab) {
      case "upcoming":
        where = {
          ...where,
          status: { in: pendingStatuses },
          consultationDate: { gt: now },
        };
        break;
      case "today":
        where = {
          ...where,
          consultationDate: { gte: startOfToday, lte: endOfToday },
        };
        break;
      case "completed":
        where = {
          ...where,
          status: { in: completedStatuses },
        };
        break;
      // "all" and "calendar" show everything
    }

    // Get consultations
    const applications = await prisma.application.findMany({
      where,
      select: {
        id: true,
        applicationId: true,
        certificateType: true,
        status: true,
        consultationDate: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Calculate stats
    const [todaysConsultations, upcoming, completedThisMonth] = await Promise.all([
      prisma.application.count({
        where: {
          assignedDoctorId: doctorId,
          consultationDate: { gte: startOfToday, lte: endOfToday },
        },
      }),
      prisma.application.count({
        where: {
          assignedDoctorId: doctorId,
          status: { in: pendingStatuses },
          consultationDate: { gt: now },
        },
      }),
      prisma.application.count({
        where: {
          assignedDoctorId: doctorId,
          status: { in: completedStatuses },
          updatedAt: { gte: startOfMonth, lte: endOfMonth },
        },
      }),
    ]);

    const consultations = applications.map((app) => ({
      id: app.id,
      applicationId: app.applicationId,
      patientName: app.user?.fullName ?? "Unknown",
      patientEmail: app.user?.email ?? "",
      patientPhone: app.user?.phoneNumber ?? "",
      certificateType: app.certificateType,
      status: app.status,
      consultationDate: app.consultationDate?.toISOString() ?? null,
      createdAt: app.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: {
        consultations,
        stats: {
          todaysConsultations,
          upcoming,
          completedThisMonth,
        },
      },
    });
  } catch (error) {
    console.error("Doctor patients error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load consultations" },
      { status: 500 }
    );
  }
}
