import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const auth = await validateAdminRequest(request);
  if (isAuthError(auth)) return auth;

  try {
    const samples = await prisma.sampleCertificate.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: samples.map((s) => ({
        id: s.id,
        certificateType: s.certificateType,
        fileUrl: s.fileUrl,
        isActive: s.isActive,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Failed to fetch sample certificates:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch sample certificates" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await validateAdminRequest(request);
  if (isAuthError(auth)) return auth;

  try {
    const body = await request.json();
    const { certificateType, fileUrl } = body as {
      certificateType: string;
      fileUrl: string;
    };

    if (!certificateType || !fileUrl) {
      return NextResponse.json(
        { success: false, message: "Certificate type and file URL are required" },
        { status: 400 }
      );
    }

    const sample = await prisma.sampleCertificate.upsert({
      where: { certificateType },
      create: { certificateType, fileUrl },
      update: { fileUrl, isActive: true },
    });

    return NextResponse.json({
      success: true,
      data: sample,
      message: "Sample certificate saved",
    });
  } catch (error) {
    console.error("Failed to save sample certificate:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save sample certificate" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = await validateAdminRequest(request);
  if (isAuthError(auth)) return auth;

  try {
    const body = await request.json();
    const { id, isActive } = body as { id: string; isActive: boolean };

    if (!id || typeof isActive !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Id and isActive are required" },
        { status: 400 }
      );
    }

    await prisma.sampleCertificate.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json({
      success: true,
      message: isActive ? "Sample activated" : "Sample hidden",
    });
  } catch (error) {
    console.error("Failed to update sample certificate:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update sample certificate" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await validateAdminRequest(request);
  if (isAuthError(auth)) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Id is required" },
        { status: 400 }
      );
    }

    await prisma.sampleCertificate.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Sample certificate deleted",
    });
  } catch (error) {
    console.error("Failed to delete sample certificate:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete sample certificate" },
      { status: 500 }
    );
  }
}
