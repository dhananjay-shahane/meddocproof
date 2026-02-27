import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const body = await request.json();
    const { phoneNumber, message, templateName, userId, applicationId } = body as {
      phoneNumber: string;
      message: string;
      templateName?: string;
      userId?: string;
      applicationId?: string;
    };

    if (!phoneNumber || !message) {
      return NextResponse.json(
        { success: false, message: "Phone number and message are required" },
        { status: 400 }
      );
    }

    // Create outgoing message record
    const whatsappMessage = await prisma.whatsAppMessage.create({
      data: {
        phoneNumber,
        direction: "outgoing",
        message,
        templateName: templateName || null,
        status: "sent",
        userId: userId || null,
        applicationId: applicationId || null,
      },
    });

    // In production, this would call the WhatsApp Business API
    // For now, we just record the message in the database

    return NextResponse.json({
      success: true,
      data: {
        id: whatsappMessage.id,
        phoneNumber: whatsappMessage.phoneNumber,
        direction: whatsappMessage.direction,
        message: whatsappMessage.message,
        templateName: whatsappMessage.templateName,
        status: whatsappMessage.status,
        userId: whatsappMessage.userId,
        applicationId: whatsappMessage.applicationId,
        createdAt: whatsappMessage.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("WhatsApp send error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send WhatsApp message" },
      { status: 500 }
    );
  }
}
