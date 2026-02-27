import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";

// Valid status transitions
const VALID_TRANSITIONS: Record<string, string[]> = {
  submitted: ["pending", "assigned", "rejected", "cancelled"],
  pending: ["assigned", "pending_review", "rejected", "cancelled"],
  pending_review: ["assigned", "approved", "rejected"],
  pending_doctor_review: ["assigned", "approved", "rejected"],
  assigned: ["in_progress", "doctor_assigned", "consultation_scheduled", "rejected", "cancelled"],
  doctor_assigned: ["in_progress", "consultation_scheduled", "rejected"],
  in_progress: ["under_review", "certificate_in_progress", "approved", "rejected"],
  consultation_scheduled: ["in_progress", "consultation_completed"],
  consultation_completed: ["certificate_in_progress", "approved"],
  certificate_in_progress: ["approved", "rejected"],
  under_review: ["approved", "rejected"],
  processing: ["approved", "completed", "rejected"],
  approved: ["completed", "certificate_delivered"],
  completed: ["delivered", "certificate_delivered"],
  certificate_delivered: ["delivered"],
  rejected: ["submitted", "pending"],
  cancelled: ["submitted"],
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const { id } = await params;
    const { status, note } = await request.json();

    if (!status) {
      return NextResponse.json(
        { success: false, message: "Status is required" },
        { status: 400 }
      );
    }

    const application = await prisma.application.findUnique({ where: { id } });
    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    // Validate status transition
    const allowed = VALID_TRANSITIONS[application.status];
    if (!allowed || !allowed.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot transition from "${application.status}" to "${status}"`,
        },
        { status: 400 }
      );
    }

    // Update application status
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status },
    });

    // Create remark if note provided
    if (note) {
      await prisma.remark.create({
        data: {
          applicationId: id,
          message: `Status changed to "${status}": ${note}`,
          addedBy: auth.adminUser.id,
          addedByRole: "admin",
        },
      });
    } else {
      await prisma.remark.create({
        data: {
          applicationId: id,
          message: `Status changed from "${application.status}" to "${status}" by ${auth.adminUser.fullName}`,
          addedBy: auth.adminUser.id,
          addedByRole: "admin",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedApplication,
      message: `Status updated to "${status}"`,
    });
  } catch (error) {
    console.error("Status update API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update status" },
      { status: 500 }
    );
  }
}
