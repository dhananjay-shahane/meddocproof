import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";

const TEMPORARY_STATUSES = ["in_progress", "incomplete", "dormant"];
const COMPLETED_APP_STATUSES = ["completed", "delivered", "certificate_delivered"];
const COMPLETED_CERT_STATUSES = ["completed", "certificate_delivered", "delivered"];
const INCOMPLETE_CERT_STATUSES = [
  "in_progress",
  "incomplete",
  "dormant",
  "submitted",
  "pending",
  "pending_review",
  "pending_doctor_review",
  "assigned",
  "doctor_assigned",
  "consultation_scheduled",
  "certificate_in_progress",
  "under_review",
  "processing",
  "approved",
  "consultation_completed",
];

export async function GET(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    // Run all count queries in parallel for efficiency
    const [
      // Application counts
      allApplications,
      temporaryApplications,
      completedApplications,
      
      // Certificate counts
      allCertificates,
      incompleteCertificates,
      completedCertificates,
      
      // Doctor counts
      allDoctors,
      newRegistrations,
      approvedDoctors,
      
      // Payment-related counts
      pendingWithdrawals,
      pendingPayouts,
    ] = await Promise.all([
      // Applications
      prisma.application.count(),
      prisma.application.count({
        where: {
          status: { in: TEMPORARY_STATUSES as never[] },
          paymentCompleted: false,
        },
      }),
      prisma.application.count({
        where: {
          status: { in: COMPLETED_APP_STATUSES as never[] },
        },
      }),
      
      // Certificates (applications with certificateNumber)
      prisma.application.count({
        where: { certificateNumber: { not: null } },
      }),
      prisma.application.count({
        where: {
          status: { in: INCOMPLETE_CERT_STATUSES as never[] },
          paymentCompleted: true,
        },
      }),
      prisma.application.count({
        where: {
          status: { in: COMPLETED_CERT_STATUSES as never[] },
          certificateNumber: { not: null },
        },
      }),
      
      // Doctors
      prisma.doctor.count(),
      prisma.doctor.count({
        where: { status: "pending" },
      }),
      prisma.doctor.count({
        where: { status: "approved" },
      }),
      
      // Withdrawals & Payouts (tables may not exist in older DB schemas)
      prisma.doctorWithdrawal.count({
        where: { status: "pending" },
      }).catch(() => 0),
      prisma.doctorPayout.count({
        where: { status: "pending" },
      }).catch(() => 0),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        applications: {
          all: allApplications,
          temporary: temporaryApplications,
          completed: completedApplications,
        },
        certificates: {
          all: allCertificates,
          incomplete: incompleteCertificates,
          completed: completedCertificates,
        },
        doctors: {
          all: allDoctors,
          newRegistrations,
          approved: approvedDoctors,
        },
        payments: {
          pendingWithdrawals,
          pendingPayouts,
        },
      },
    });
  } catch (error) {
    console.error("Sidebar counts error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch sidebar counts" },
      { status: 500 }
    );
  }
}
