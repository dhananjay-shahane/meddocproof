import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateDoctorRequest, isAuthError } from "@/lib/api-auth";

// PUT — save bank details
export async function PUT(request: NextRequest) {
  try {
    const auth = await validateDoctorRequest(request);
    if (isAuthError(auth)) return auth;

    const { bankName, accountNumber, ifscCode, accountHolderName } =
      await request.json();

    if (!bankName || !accountNumber || !ifscCode) {
      return NextResponse.json(
        { success: false, message: "Bank name, account number, and IFSC code are required" },
        { status: 400 }
      );
    }

    // Validate IFSC code format (4 alpha + 0 + 6 alphanumeric)
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(ifscCode.toUpperCase())) {
      return NextResponse.json(
        { success: false, message: "Invalid IFSC code format. Must be 11 characters (e.g., SBIN0001234)" },
        { status: 400 }
      );
    }

    // Validate account number (9-18 digits)
    const accountRegex = /^\d{9,18}$/;
    if (!accountRegex.test(accountNumber)) {
      return NextResponse.json(
        { success: false, message: "Invalid account number. Must be 9-18 digits" },
        { status: 400 }
      );
    }

    const settingKey = `doctor_bank_details_${auth.doctorUser.id}`;
    const bankData = { bankName, accountNumber, ifscCode, accountHolderName };

    await prisma.setting.upsert({
      where: { key: settingKey },
      update: { value: bankData },
      create: {
        key: settingKey,
        value: bankData,
        description: `Bank details for Dr. ${auth.doctorUser.fullName}`,
      },
    });

    return NextResponse.json({
      success: true,
      data: bankData,
      message: "Bank details updated successfully",
    });
  } catch (error) {
    console.error("Doctor bank details error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update bank details" },
      { status: 500 }
    );
  }
}
