import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateDoctorRequest, isAuthError } from "@/lib/api-auth";

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
        assignedDoctorId: true,
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

    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Remark message is required" },
        { status: 400 }
      );
    }

    if (message.trim().length > 1000) {
      return NextResponse.json(
        { success: false, message: "Remark message must be 1000 characters or less" },
        { status: 400 }
      );
    }

    const remark = await prisma.remark.create({
      data: {
        applicationId: id,
        message: message.trim(),
        addedBy: auth.doctorUser.fullName,
        addedByRole: "doctor",
        doctorId,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: remark.id,
        message: remark.message,
        addedBy: remark.addedBy,
        addedByRole: remark.addedByRole,
        addedAt: remark.addedAt.toISOString(),
      },
      message: "Remark added successfully",
    });
  } catch (error) {
    console.error("Add remark error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add remark" },
      { status: 500 }
    );
  }
}
