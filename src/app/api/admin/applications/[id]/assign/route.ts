import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";
import { createNotification } from "@/lib/notifications";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const { id } = await params;
    const { doctorId } = await request.json();

    if (!doctorId) {
      return NextResponse.json(
        { success: false, message: "Doctor ID is required" },
        { status: 400 }
      );
    }

    // Verify application exists
    const application = await prisma.application.findUnique({ where: { id } });
    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    // Verify doctor exists and is approved + active
    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 404 }
      );
    }
    if (doctor.status !== "approved" || !doctor.isActive) {
      return NextResponse.json(
        { success: false, message: "Doctor is not available for assignment" },
        { status: 400 }
      );
    }

    // Update application and increment doctor's consultation count
    const [updatedApplication] = await prisma.$transaction([
      prisma.application.update({
        where: { id },
        data: {
          assignedDoctorId: doctorId,
          assignedAt: new Date(),
          assignedBy: auth.adminUser.id,
          status: "assigned",
        },
        include: {
          assignedDoctor: {
            select: { id: true, fullName: true, specialization: true },
          },
        },
      }),
      prisma.doctor.update({
        where: { id: doctorId },
        data: { consultationCount: { increment: 1 } },
      }),
    ]);

    // Add a remark for the assignment
    await prisma.remark.create({
      data: {
        applicationId: id,
        message: `Doctor ${doctor.fullName} assigned by admin ${auth.adminUser.fullName}`,
        addedBy: auth.adminUser.id,
        addedByRole: "admin",
      },
    });

    // Notify the assigned doctor
    await createNotification(prisma, {
      doctorId,
      type: "application_assigned",
      title: "New Application Assigned",
      message: `You have been assigned application #${application.applicationId} (${application.certificateType.replace(/_/g, " ")})`,
      metadata: {
        applicationId: application.applicationId,
        certificateType: application.certificateType,
      },
    });

    // Notify the user that a doctor has been assigned
    await createNotification(prisma, {
      userId: application.userId,
      type: "doctor_assigned",
      title: "Doctor Assigned",
      message: `Dr. ${doctor.fullName} has been assigned to your application #${application.applicationId}`,
      metadata: {
        applicationId: application.applicationId,
        doctorName: doctor.fullName,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedApplication,
      message: `Doctor ${doctor.fullName} assigned successfully`,
    });
  } catch (error) {
    console.error("Assign doctor API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to assign doctor" },
      { status: 500 }
    );
  }
}
