import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateDoctorRequest, isAuthError } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await validateDoctorRequest(request);
    if (isAuthError(auth)) return auth;

    const doctorId = auth.doctorUser.id;

    // Get start and end of today for completed today count
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      assignedApplications,
      completedApplications,
      completedToday,
      pendingReview,
      wallet,
      doctor,
      recentApplications,
      totalPatients,
      pendingWithdrawals,
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
          status: { in: ["completed", "delivered", "certificate_delivered"] },
          updatedAt: { gte: todayStart, lte: todayEnd },
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
        select: {
          fullName: true,
          qualification: true,
          specialization: true,
          experience: true,
          status: true,
          avgRating: true,
          totalRatings: true,
          responseRate: true,
        },
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
      prisma.application.groupBy({
        by: ["userId"],
        where: { assignedDoctorId: doctorId },
        _count: true,
      }),
      prisma.doctorWithdrawal.aggregate({
        where: { doctorId, status: "pending" },
        _sum: { amount: true },
      }),
    ]);

    // Calculate completion rate (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [assignedLast30, completedLast30] = await Promise.all([
      prisma.application.count({
        where: {
          assignedDoctorId: doctorId,
          assignedAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.application.count({
        where: {
          assignedDoctorId: doctorId,
          status: { in: ["completed", "delivered", "certificate_delivered"] },
          updatedAt: { gte: thirtyDaysAgo },
        },
      }),
    ]);

    const completionRate = assignedLast30 > 0 ? Math.round((completedLast30 / assignedLast30) * 100) : 0;

    // Certificate fee structure (static for now, can be dynamic later)
    const certificateFeeStructure = {
      digital: 200,
      handwritten: 300,
      form1A: 500,
    };

    const stats = {
      // Doctor info
      doctorName: doctor?.fullName ?? "",
      qualification: doctor?.qualification ?? "",
      specialization: doctor?.specialization ?? "",
      experience: doctor?.experience ?? 0,
      isVerified: doctor?.status === "approved",
      
      // Financial stats
      totalEarnings: wallet?.totalEarnings ?? 0,
      walletBalance: wallet?.balance ?? 0,
      pendingAmount: 0, // Amount from completed but not yet credited
      pendingWithdrawals: pendingWithdrawals._sum.amount ?? 0,
      
      // Fee structure
      consultationFee: 200, // Can be made dynamic from doctor settings
      certificateFeeStructure,
      
      // Application stats
      assignedApplications,
      completedApplications,
      completedToday,
      pendingReview,
      totalPatients: totalPatients.length,
      
      // Performance metrics
      avgRating: doctor?.avgRating ?? 0,
      responseRate: doctor?.responseRate ?? 0,
      completionRate,
      
      // Recent applications
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
