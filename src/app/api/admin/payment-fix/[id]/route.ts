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
    const { action } = body as { action: "mark_completed" | "retry" | "refund" };

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { application: true },
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, message: "Payment not found" },
        { status: 404 }
      );
    }

    if (action === "mark_completed") {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id },
          data: { status: "completed" },
        }),
        prisma.application.update({
          where: { id: payment.applicationId },
          data: { paymentCompleted: true },
        }),
        prisma.transaction.create({
          data: {
            type: "payment",
            amount: payment.amount,
            description: `Payment manually marked as completed by admin`,
            applicationId: payment.applicationId,
            userId: payment.userId,
            paymentId: payment.id,
            status: "completed",
          },
        }),
      ]);
    } else if (action === "refund") {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id },
          data: { status: "refunded" },
        }),
        prisma.transaction.create({
          data: {
            type: "refund",
            amount: payment.amount,
            description: `Payment refunded by admin`,
            applicationId: payment.applicationId,
            userId: payment.userId,
            paymentId: payment.id,
            status: "completed",
          },
        }),
      ]);
    } else if (action === "retry") {
      // Reset payment to pending for retry
      await prisma.payment.update({
        where: { id },
        data: { status: "pending" },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Payment ${action.replace("_", " ")} successful`,
    });
  } catch (error) {
    console.error("Payment fix error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fix payment" },
      { status: 500 }
    );
  }
}
