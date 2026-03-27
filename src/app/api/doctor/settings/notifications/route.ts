import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateDoctorRequest, isAuthError } from "@/lib/api-auth";

// PUT — save notification preferences
export async function PUT(request: NextRequest) {
  try {
    const auth = await validateDoctorRequest(request);
    if (isAuthError(auth)) return auth;

    const body = await request.json();
    const settingKey = `doctor_notifications_${auth.doctorUser.id}`;

    // Validate that preferences only contain expected boolean fields
    const allowedKeys = [
      "emailNotifications",
      "smsNotifications",
      "newApplicationAlert",
      "paymentAlert",
      "withdrawalAlert",
    ];
    const preferences: Record<string, boolean> = {};
    for (const key of allowedKeys) {
      if (key in body) {
        preferences[key] = Boolean(body[key]);
      }
    }

    await prisma.setting.upsert({
      where: { key: settingKey },
      update: { value: preferences },
      create: {
        key: settingKey,
        value: preferences,
        description: `Notification preferences for Dr. ${auth.doctorUser.fullName}`,
      },
    });

    return NextResponse.json({
      success: true,
      data: preferences,
      message: "Notification preferences updated",
    });
  } catch (error) {
    console.error("Doctor notification prefs error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update notification preferences" },
      { status: 500 }
    );
  }
}
