import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";

// Hardcoded WhatsApp templates (placeholder — no external API yet)
const TEMPLATES = [
  {
    id: "welcome",
    name: "Welcome Message",
    content:
      "Hi {{fullName}}, welcome to MediProofDocs! Get your medical certificate in minutes. Visit our platform to get started.",
    variables: ["fullName"],
  },
  {
    id: "reminder",
    name: "Application Reminder",
    content:
      "Hi {{fullName}}, you have an incomplete application. Complete it now to get your medical certificate quickly!",
    variables: ["fullName"],
  },
  {
    id: "promo",
    name: "Special Offer",
    content:
      "Hi {{fullName}}, we have a special discount on medical certificates this week! Use code HEALTH20 for 20% off.",
    variables: ["fullName"],
  },
  {
    id: "followup",
    name: "Follow Up",
    content:
      "Hi {{fullName}}, how was your experience with MediProofDocs? We'd love to hear your feedback!",
    variables: ["fullName"],
  },
];

export async function GET(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    return NextResponse.json({
      success: true,
      data: { templates: TEMPLATES },
    });
  } catch (error) {
    console.error("WhatsApp templates API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const body = await request.json();
    const { userIds, templateName, customMessage } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one user must be selected" },
        { status: 400 }
      );
    }

    if (!templateName && !customMessage) {
      return NextResponse.json(
        { success: false, message: "Either a template or custom message is required" },
        { status: 400 }
      );
    }

    // Validate users exist
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, fullName: true, phoneNumber: true },
    });

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid users found" },
        { status: 400 }
      );
    }

    // Resolve message content
    let messageTemplate = customMessage || "";
    if (templateName) {
      const tpl = TEMPLATES.find((t) => t.id === templateName);
      if (tpl) messageTemplate = tpl.content;
    }

    // Create notification records for each user (placeholder for actual WhatsApp send)
    const notifications = users.map((user) => ({
      userId: user.id,
      title: "WhatsApp Message",
      message: messageTemplate.replace(/\{\{fullName\}\}/g, user.fullName),
      type: "whatsapp_bulk" as const,
      isRead: false,
    }));

    await prisma.notification.createMany({ data: notifications });

    return NextResponse.json({
      success: true,
      message: `Message queued for ${users.length} user(s)`,
      data: { sentCount: users.length, failedCount: userIds.length - users.length },
    });
  } catch (error) {
    console.error("Bulk WhatsApp API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send messages" },
      { status: 500 }
    );
  }
}
