import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const samples = await prisma.sampleCertificate.findMany({
      where: { isActive: true },
      select: {
        certificateType: true,
        fileUrl: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: samples,
    });
  } catch (error) {
    console.error("Failed to fetch sample certificates:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch sample certificates" },
      { status: 500 }
    );
  }
}
