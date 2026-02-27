import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateDoctorRequest, isAuthError } from "@/lib/api-auth";

// POST — request a withdrawal
export async function POST(request: NextRequest) {
  try {
    const auth = await validateDoctorRequest(request);
    if (isAuthError(auth)) return auth;

    const doctorId = auth.doctorUser.id;
    const { amount } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Withdrawal amount must be greater than 0" },
        { status: 400 }
      );
    }

    const wallet = await prisma.doctorWallet.findUnique({
      where: { doctorId },
    });

    if (!wallet) {
      return NextResponse.json(
        { success: false, message: "Wallet not found" },
        { status: 404 }
      );
    }

    if (amount > wallet.balance) {
      return NextResponse.json(
        { success: false, message: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Check for pending withdrawals
    const pendingCount = await prisma.doctorWithdrawal.count({
      where: { doctorId, status: "pending" },
    });

    if (pendingCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "You already have a pending withdrawal request",
        },
        { status: 400 }
      );
    }

    // Fetch bank details
    const bankSetting = await prisma.setting.findUnique({
      where: { key: `doctor_bank_details_${doctorId}` },
    });

    if (!bankSetting) {
      return NextResponse.json(
        {
          success: false,
          message: "Please add bank details before requesting withdrawal",
        },
        { status: 400 }
      );
    }

    // Create withdrawal and update wallet within a transaction
    const [withdrawal] = await prisma.$transaction([
      prisma.doctorWithdrawal.create({
        data: {
          doctorId,
          amount,
          status: "pending",
          bankDetails: bankSetting.value as object,
        },
      }),
      prisma.doctorWallet.update({
        where: { doctorId },
        data: {
          balance: { decrement: amount },
          pendingWithdrawals: { increment: amount },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: withdrawal,
      message: "Withdrawal request submitted successfully",
    });
  } catch (error) {
    console.error("Doctor withdrawal error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit withdrawal request" },
      { status: 500 }
    );
  }
}
