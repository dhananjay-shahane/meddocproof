import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateDoctorRequest, isAuthError } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await validateDoctorRequest(request);
    if (isAuthError(auth)) return auth;

    const doctorId = auth.doctorUser.id;

    const [
      assignedApplications,
      completedApplications,
      pendingReview,
      wallet,
      doctor,
      recentApplications,
    ] = await Promise.all([
      prisma.application.count({
        where: { assignedDoctorId: doctorId },
      }),
      prisma.application.count({
        where: {
          assignedDoctorId: doctorId,
          status: { in: ["completed", "delivered", "certificate_delivered"] },
        },
      }),
      prisma.application.count({
        where: {
          assignedDoctorId: doctorId,
          status: {
            in: [
              "assigned",
              "doctor_assigned",
              "pending_doctor_review",
              "under_review",
            ],
          },
        },
      }),
      prisma.doctorWallet.findUnique({
        where: { doctorId },
      }),
      prisma.doctor.findUnique({
        where: { id: doctorId },
        select: { avgRating: true, totalRatings: true },
      }),
      prisma.application.findMany({
        where: { assignedDoctorId: doctorId },
        orderBy: { updatedAt: "desc" },
        take: 5,
        include: {
          user: {
            select: { fullName: true, phoneNumber: true },
          },
        },
      }),
    ]);

    const stats = {
      assignedApplications,
      completedApplications,
      pendingReview,
      totalEarnings: wallet?.totalEarnings ?? 0,
      walletBalance: wallet?.balance ?? 0,
      avgRating: doctor?.avgRating ?? 0,
      recentApplications,
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("Doctor dashboard error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
