import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateDoctorRequest, isAuthError } from "@/lib/api-auth";

// PUT — save notification preferences
export async function PUT(request: NextRequest) {
  try {
    const auth = await validateDoctorRequest(request);
    if (isAuthError(auth)) return auth;

    const preferences = await request.json();
    const settingKey = `doctor_notifications_${auth.doctorUser.id}`;

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
