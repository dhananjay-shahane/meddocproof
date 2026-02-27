import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const { id } = await params;
    const body = await request.json();
    const { action, reason } = body as {
      action: "approve" | "reject" | "suspend";
      reason?: string;
    };

    if (!["approve", "reject", "suspend"].includes(action)) {
      return NextResponse.json(
        { success: false, message: "Invalid action. Must be approve, reject, or suspend." },
        { status: 400 }
      );
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      select: { id: true, fullName: true, status: true },
    });

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 404 }
      );
    }

    // Validate transitions
    const validTransitions: Record<string, string[]> = {
      approve: ["pending"],
      reject: ["pending"],
      suspend: ["approved"],
    };

    if (!validTransitions[action].includes(doctor.status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot ${action} a doctor with status "${doctor.status}"`,
        },
        { status: 400 }
      );
    }

    const statusMap: Record<string, string> = {
      approve: "approved",
      reject: "rejected",
      suspend: "suspended",
    };

    const updatedDoctor = await prisma.doctor.update({
      where: { id },
      data: {
        status: statusMap[action] as "approved" | "rejected" | "suspended",
        isActive: action === "approve",
      },
    });

    // Create notification for the doctor
    const notificationMessages: Record<string, string> = {
      approve: `Your registration has been approved. You can now start accepting applications.`,
      reject: `Your registration has been rejected.${reason ? ` Reason: ${reason}` : ""}`,
      suspend: `Your account has been suspended.${reason ? ` Reason: ${reason}` : ""}`,
    };

    await prisma.notification.create({
      data: {
        doctorId: id,
        title: `Registration ${statusMap[action]}`,
        message: notificationMessages[action],
        type: `doctor_${action}`,
        isRead: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Doctor ${statusMap[action]} successfully`,
      data: updatedDoctor,
    });
  } catch (error) {
    console.error("Doctor status API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update doctor status" },
      { status: 500 }
    );
  }
}
