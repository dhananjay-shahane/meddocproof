import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateDoctorRequest, isAuthError } from "@/lib/api-auth";
import { createNotification } from "@/lib/notifications";

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

    if (application.consultationCompleted) {
      return NextResponse.json(
        { success: false, message: "Consultation already completed" },
        { status: 400 }
      );
    }

    if (!application.hasMedicalAssessment) {
      return NextResponse.json(
        {
          success: false,
          message: "Medical assessment must be completed before marking consultation as complete",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const consultationNotes = body.consultationNotes || "";

    await prisma.application.update({
      where: { id },
      data: {
        consultationCompleted: true,
        consultationNotes,
        consultationDate: new Date(),
        status: "consultation_completed",
      },
    });

    // Update doctor stats
    await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        consultationCount: { increment: 1 },
      },
    });

    // Notify the user that consultation is complete
    await createNotification(prisma, {
      userId: application.userId,
      type: "consultation_completed",
      title: "Consultation Completed",
      message: `Your consultation for application #${application.applicationId} (${application.certificateType.replace(/_/g, " ")}) has been completed. Your certificate will be issued shortly.`,
      metadata: {
        applicationId: application.applicationId,
        certificateType: application.certificateType,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Consultation completed successfully",
    });
  } catch (error) {
    console.error("Consultation complete error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to complete consultation" },
      { status: 500 }
    );
  }
}
