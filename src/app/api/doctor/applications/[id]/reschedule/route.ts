import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateDoctorRequest, isAuthError } from "@/lib/api-auth";

// POST - Reschedule a consultation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await validateDoctorRequest(request);
    if (isAuthError(auth)) return auth;

    const { id } = await params;
    const body = await request.json();
    const { consultationDate, reason } = body;

    if (!consultationDate) {
      return NextResponse.json(
        { success: false, message: "New consultation date is required" },
        { status: 400 }
      );
    }

    const parsedDate = new Date(consultationDate);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { success: false, message: "Invalid consultation date format" },
        { status: 400 }
      );
    }

    if (parsedDate <= new Date()) {
      return NextResponse.json(
        { success: false, message: "Consultation date must be in the future" },
        { status: 400 }
      );
    }

    // Verify the application belongs to this doctor
    const application = await prisma.application.findFirst({
      where: {
        id,
        assignedDoctorId: auth.doctorUser.id,
      },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found or not assigned to you" },
        { status: 404 }
      );
    }

    // Update application with new consultation date
    await prisma.application.update({
      where: { id },
      data: {
        consultationDate: parsedDate,
        status: "consultation_scheduled",
      },
    });

    // Add a remark about the reschedule
    await prisma.remark.create({
      data: {
        applicationId: id,
        addedBy: auth.doctorUser.fullName,
        addedByRole: "doctor",
        doctorId: auth.doctorUser.id,
        message: `Consultation rescheduled to ${parsedDate.toLocaleDateString()}${reason ? `. Reason: ${reason}` : ""}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Consultation rescheduled successfully",
    });
  } catch (error) {
    console.error("Reschedule error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
