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
