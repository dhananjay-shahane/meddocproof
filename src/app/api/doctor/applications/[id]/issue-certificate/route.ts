import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateDoctorRequest, isAuthError } from "@/lib/api-auth";

function generateCertificateNumber(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `MDP-${datePart}-${randomPart}`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await validateDoctorRequest(request);
    if (isAuthError(auth)) return auth;

    const { id } = await params;
    const doctorId = auth.doctorUser.id;

    const application = await prisma.application.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        applicationId: true,
        assignedDoctorId: true,
        hasMedicalAssessment: true,
        consultationCompleted: true,
        certificateNumber: true,
        certificateType: true,
        status: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    if (application.assignedDoctorId !== doctorId) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    if (application.certificateNumber) {
      return NextResponse.json(
        { success: false, message: "Certificate already issued for this application" },
        { status: 400 }
      );
    }

    if (!application.consultationCompleted) {
      return NextResponse.json(
        { success: false, message: "Consultation must be completed before issuing certificate" },
        { status: 400 }
      );
    }

    if (!application.hasMedicalAssessment) {
      return NextResponse.json(
        { success: false, message: "Medical assessment is required before issuing certificate" },
        { status: 400 }
      );
    }

    // Generate a unique certificate number
    let certificateNumber = generateCertificateNumber();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await prisma.application.findUnique({
        where: { certificateNumber },
        select: { id: true },
      });
      if (!existing) break;
      certificateNumber = generateCertificateNumber();
      attempts++;
    }

    // Doctor payout amount — read from admin settings, fallback to ₹200
    const doctorFeeSetting = await prisma.setting.findUnique({
      where: { key: "doctor_fee" },
    });
    const payoutAmount = doctorFeeSetting ? Number(doctorFeeSetting.value) || 200 : 200;

    // Use a transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update application — issue certificate
      const updatedApp = await tx.application.update({
        where: { id },
        data: {
          certificateNumber,
          status: "completed",
        },
        select: {
          id: true,
          applicationId: true,
          certificateNumber: true,
          certificateType: true,
          status: true,
        },
      });

      // 2. Create doctor payout record
      await tx.doctorPayout.create({
        data: {
          doctorId,
          applicationId: id,
          amount: payoutAmount,
          status: "pending",
        },
      });

      // 3. Update doctor wallet
      await tx.doctorWallet.upsert({
        where: { doctorId },
        create: {
          doctorId,
          balance: payoutAmount,
          totalEarnings: payoutAmount,
        },
        update: {
          balance: { increment: payoutAmount },
          totalEarnings: { increment: payoutAmount },
        },
      });

      // 4. Create notification for the user
      await tx.notification.create({
        data: {
          userId: application.userId,
          type: "certificate_issued",
          title: "Certificate Issued",
          message: `Your ${application.certificateType.replace(/_/g, " ")} certificate has been issued. Certificate number: ${certificateNumber}`,
          metadata: {
            applicationId: application.applicationId,
            certificateNumber,
            certificateType: application.certificateType,
          },
        },
      });

      return updatedApp;
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: `Certificate issued successfully. Number: ${certificateNumber}`,
    });
  } catch (error) {
    console.error("Issue certificate error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to issue certificate" },
      { status: 500 }
    );
  }
}
