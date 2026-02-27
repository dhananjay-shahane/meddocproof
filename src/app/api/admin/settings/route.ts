import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";

// Default settings structure
const DEFAULT_SETTINGS: Record<string, unknown> = {
  "general.siteName": "MediProofDocs",
  "general.supportEmail": "support@medproofdocs.com",
  "general.supportPhone": "+91-9999999999",
  "general.maintenanceMode": false,
  "payment.razorpayKeyId": "",
  "payment.razorpayKeySecret": "",
  "payment.sickLeaveFee": 599,
  "payment.fitnessFee": 499,
  "payment.doctorPayoutPercentage": 70,
  "whatsapp.apiEndpoint": "",
  "whatsapp.apiKey": "",
  "whatsapp.defaultCountryCode": "+91",
  "whatsapp.enabled": false,
  "notifications.emailEnabled": true,
  "notifications.smsEnabled": false,
  "notifications.whatsappEnabled": false,
};

export async function GET(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const settings = await prisma.setting.findMany();

    // Build settings map with defaults
    const settingsMap: Record<string, unknown> = { ...DEFAULT_SETTINGS };
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }

    // Organize into AdminSettingsData structure
    const data = {
      general: {
        siteName: settingsMap["general.siteName"] as string,
        supportEmail: settingsMap["general.supportEmail"] as string,
        supportPhone: settingsMap["general.supportPhone"] as string,
        maintenanceMode: settingsMap["general.maintenanceMode"] as boolean,
      },
      payment: {
        razorpayKeyId: settingsMap["payment.razorpayKeyId"] as string,
        razorpayKeySecret: settingsMap["payment.razorpayKeySecret"] as string,
        sickLeaveFee: settingsMap["payment.sickLeaveFee"] as number,
        fitnessFee: settingsMap["payment.fitnessFee"] as number,
        doctorPayoutPercentage: settingsMap["payment.doctorPayoutPercentage"] as number,
      },
      whatsapp: {
        apiEndpoint: settingsMap["whatsapp.apiEndpoint"] as string,
        apiKey: settingsMap["whatsapp.apiKey"] as string,
        defaultCountryCode: settingsMap["whatsapp.defaultCountryCode"] as string,
        enabled: settingsMap["whatsapp.enabled"] as boolean,
      },
      notifications: {
        emailEnabled: settingsMap["notifications.emailEnabled"] as boolean,
        smsEnabled: settingsMap["notifications.smsEnabled"] as boolean,
        whatsappEnabled: settingsMap["notifications.whatsappEnabled"] as boolean,
      },
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const body = await request.json();
    const { section, data } = body as { section: string; data: Record<string, unknown> };

    if (!section || !data) {
      return NextResponse.json(
        { success: false, message: "Section and data are required" },
        { status: 400 }
      );
    }

    // Validate section
    const validSections = ["general", "payment", "whatsapp", "notifications"];
    if (!validSections.includes(section)) {
      return NextResponse.json(
        { success: false, message: "Invalid settings section" },
        { status: 400 }
      );
    }

    // Upsert each setting
    const updates = Object.entries(data).map(([field, value]) => {
      const key = `${section}.${field}`;
      return prisma.setting.upsert({
        where: { key },
        create: { key, value: value as any, description: `${section} - ${field}` },
        update: { value: value as any },
      });
    });

    await Promise.all(updates);

    return NextResponse.json({
      success: true,
      message: `${section} settings updated successfully`,
    });
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update settings" },
      { status: 500 }
    );
  }
}
