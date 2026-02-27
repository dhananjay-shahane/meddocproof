import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const { id } = await params;
    const body = await request.json();
    const { action } = body as { action: "approve" | "reject" | "complete" };

    const withdrawal = await prisma.doctorWithdrawal.findUnique({
      where: { id },
      include: { doctor: { include: { wallet: true } } },
    });

    if (!withdrawal) {
      return NextResponse.json(
        { success: false, message: "Withdrawal not found" },
        { status: 404 }
      );
    }

    if (action === "approve") {
      await prisma.doctorWithdrawal.update({
        where: { id },
        data: { status: "approved", processedBy: auth.adminUser.id },
      });
    } else if (action === "reject") {
      await prisma.$transaction([
        prisma.doctorWithdrawal.update({
          where: { id },
          data: {
            status: "rejected",
            processedBy: auth.adminUser.id,
            processedAt: new Date(),
          },
        }),
        // Return funds to doctor wallet
        ...(withdrawal.doctor.wallet
          ? [
              prisma.doctorWallet.update({
                where: { id: withdrawal.doctor.wallet.id },
                data: {
                  balance: { increment: withdrawal.amount },
                  pendingWithdrawals: { decrement: withdrawal.amount },
                },
              }),
            ]
          : []),
      ]);
    } else if (action === "complete") {
      await prisma.$transaction([
        prisma.doctorWithdrawal.update({
          where: { id },
          data: {
            status: "completed",
            processedAt: new Date(),
          },
        }),
        // Deduct from pending, add to withdrawn
        ...(withdrawal.doctor.wallet
          ? [
              prisma.doctorWallet.update({
                where: { id: withdrawal.doctor.wallet.id },
                data: {
                  pendingWithdrawals: { decrement: withdrawal.amount },
                  totalWithdrawn: { increment: withdrawal.amount },
                },
              }),
            ]
          : []),
        // Record transaction
        prisma.transaction.create({
          data: {
            type: "withdrawal",
            amount: withdrawal.amount,
            description: `Withdrawal completed for Dr. ${withdrawal.doctor.fullName}`,
            doctorId: withdrawal.doctorId,
            status: "completed",
          },
        }),
      ]);
    }

    return NextResponse.json({
      success: true,
      message: `Withdrawal ${action}d successfully`,
    });
  } catch (error) {
    console.error("Withdrawal action error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process withdrawal" },
      { status: 500 }
    );
  }
}
