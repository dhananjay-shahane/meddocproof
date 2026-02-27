import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateUserRequest, isAuthError } from "@/lib/api-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await validateUserRequest(request);
    if (isAuthError(auth)) return auth;

    const { id } = await params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        assignedDoctor: {
          select: {
            fullName: true,
            specialization: true,
            registrationNumber: true,
          },
        },
        medicalAssessment: {
          select: {
            fullDiagnosisOfIllness: true,
            restPeriodFrom: true,
            restPeriodTo: true,
            restDuration: true,
            adviceByRegisteredMedicalPractitioner: true,
            additionalRecommendations: true,
          },
        },
        remarks: {
          where: { addedByRole: { not: "doctor" } },
          orderBy: { addedAt: "desc" },
          take: 10,
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    // Ensure the application belongs to this user
    if (application.userId !== auth.user.id) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    const data = {
      id: application.id,
      applicationId: application.applicationId,
      certificateType: application.certificateType,
      certificateNumber: application.certificateNumber,
      status: application.status,
      formData: application.formData as Record<string, unknown>,
      paymentCompleted: application.paymentCompleted,
      consultationDate: application.consultationDate?.toISOString() ?? null,
      consultationCompleted: application.consultationCompleted,
      assignedDoctor: application.assignedDoctor,
      medicalAssessment: application.medicalAssessment
        ? {
            ...application.medicalAssessment,
            restPeriodFrom:
              application.medicalAssessment.restPeriodFrom.toISOString(),
            restPeriodTo:
              application.medicalAssessment.restPeriodTo.toISOString(),
          }
        : null,
      remarks: application.remarks.map((r) => ({
        id: r.id,
        message: r.message,
        addedByRole: r.addedByRole,
        addedAt: r.addedAt.toISOString(),
      })),
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("User application detail error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load application" },
      { status: 500 }
    );
  }
}
