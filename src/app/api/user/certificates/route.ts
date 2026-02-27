import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateUserRequest, isAuthError } from "@/lib/api-auth";

// GET - Get user's completed certificates
export async function GET(request: NextRequest) {
  try {
    const auth = await validateUserRequest(request);
    if (isAuthError(auth)) return auth;

    const certificates = await prisma.application.findMany({
      where: {
        userId: auth.user.id,
        status: { in: ["completed", "certificate_delivered", "delivered"] },
        certificateNumber: { not: null },
      },
      select: {
        id: true,
        applicationId: true,
        certificateType: true,
        certificateNumber: true,
        status: true,
        formData: true,
        consultationDate: true,
        createdAt: true,
        updatedAt: true,
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
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: { certificates },
    });
  } catch (error) {
    console.error("Get user certificates error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
