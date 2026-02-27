import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateDoctorRequest, isAuthError } from "@/lib/api-auth";

export async function GET(
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
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            email: true,
          },
        },
        assignedDoctor: {
          select: {
            id: true,
            fullName: true,
            specialization: true,
          },
        },
        medicalAssessment: true,
        documents: {
          orderBy: { createdAt: "desc" },
        },
        remarks: {
          orderBy: { addedAt: "desc" },
        },
        prescription: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    // Verify this application is assigned to the requesting doctor
    if (application.assignedDoctorId !== doctorId) {
      return NextResponse.json(
        { success: false, message: "Not authorized to view this application" },
        { status: 403 }
      );
    }

    const data = {
      id: application.id,
      applicationId: application.applicationId,
      applicationDisplayId: application.applicationId,
      certificateType: application.certificateType,
      certificateNumber: application.certificateNumber ?? null,
      status: application.status,
      formData: application.formData as Record<string, unknown>,
      user: application.user,
      assignedDoctor: application.assignedDoctor,
      assignedAt: application.assignedAt?.toISOString() ?? null,
      consultationDate: application.consultationDate?.toISOString() ?? null,
      consultationNotes: application.consultationNotes,
      consultationCompleted: application.consultationCompleted,
      hasMedicalAssessment: application.hasMedicalAssessment,
      medicalAssessment: application.medicalAssessment
        ? {
            ...application.medicalAssessment,
            restPeriodFrom: application.medicalAssessment.restPeriodFrom.toISOString(),
            restPeriodTo: application.medicalAssessment.restPeriodTo.toISOString(),
            createdAt: application.medicalAssessment.createdAt.toISOString(),
            updatedAt: application.medicalAssessment.updatedAt.toISOString(),
          }
        : null,
      documents: application.documents.map((doc) => ({
        ...doc,
        createdAt: doc.createdAt.toISOString(),
      })),
      remarks: application.remarks.map((r) => ({
        ...r,
        addedAt: r.addedAt.toISOString(),
      })),
      prescription: application.prescription
        ? {
            ...application.prescription,
            createdAt: application.prescription.createdAt.toISOString(),
            updatedAt: application.prescription.updatedAt.toISOString(),
          }
        : null,
      paymentCompleted: application.paymentCompleted,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Doctor application detail error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load application details" },
      { status: 500 }
    );
  }
}
