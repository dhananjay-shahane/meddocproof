import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const { id } = await params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            email: true,
            status: true,
            createdAt: true,
          },
        },
        assignedDoctor: {
          select: {
            id: true,
            fullName: true,
            email: true,
            specialization: true,
            qualification: true,
            avgRating: true,
          },
        },
        documents: { orderBy: { createdAt: "desc" } },
        remarks: { orderBy: { addedAt: "desc" } },
        medicalAssessment: true,
        prescription: true,
        payments: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: application });
  } catch (error) {
    console.error("Application detail API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch application" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const { id } = await params;

    const application = await prisma.application.findUnique({ where: { id } });
    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    // Delete related records first, then the application
    await prisma.$transaction([
      prisma.remark.deleteMany({ where: { applicationId: id } }),
      prisma.document.deleteMany({ where: { applicationId: id } }),
      prisma.payment.deleteMany({ where: { applicationId: id } }),
      prisma.doctorPayout.deleteMany({ where: { applicationId: id } }),
      prisma.prescription.deleteMany({ where: { applicationId: id } }),
      prisma.application.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true, message: "Application deleted" });
  } catch (error) {
    console.error("Application delete API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete application" },
      { status: 500 }
    );
  }
}
