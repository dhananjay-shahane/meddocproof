import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const certificateNumber = searchParams.get("certificateNumber") || "";

    if (!certificateNumber) {
      return NextResponse.json(
        { success: false, message: "Certificate number is required" },
        { status: 400 }
      );
    }

    const application = await prisma.application.findFirst({
      where: {
        certificateNumber: {
          equals: certificateNumber,
          mode: "insensitive",
        },
      },
      select: {
        certificateNumber: true,
        certificateType: true,
        status: true,
        updatedAt: true,
        user: {
          select: { fullName: true },
        },
        assignedDoctor: {
          select: { fullName: true },
        },
      },
    });

    if (!application) {
      return NextResponse.json({
        success: true,
        data: {
          valid: false,
          certificateNumber,
          certificateType: null,
          patientName: null,
          doctorName: null,
          issuedAt: null,
          status: null,
        },
      });
    }

    const isCompleted = ["completed", "certificate_delivered", "delivered"].includes(
      application.status
    );

    return NextResponse.json({
      success: true,
      data: {
        valid: isCompleted,
        certificateNumber: application.certificateNumber,
        certificateType: application.certificateType,
        patientName: application.user?.fullName || null,
        doctorName: application.assignedDoctor?.fullName || null,
        issuedAt: isCompleted ? application.updatedAt.toISOString() : null,
        status: application.status,
      },
    });
  } catch (error) {
    console.error("Failed to verify certificate:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify certificate" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { certificateNumber } = body;

    if (!certificateNumber) {
      return NextResponse.json(
        { success: false, message: "Certificate number is required" },
        { status: 400 }
      );
    }

    // Reuse the same logic via redirect internally
    const url = new URL(request.url);
    url.searchParams.set("certificateNumber", certificateNumber);
    const req = new NextRequest(url.toString(), { method: "GET" });
    return GET(req);
  } catch (error) {
    console.error("Failed to verify certificate:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify certificate" },
      { status: 500 }
    );
  }
}
