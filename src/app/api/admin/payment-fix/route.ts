import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    // Find payments that are failed, or apps where payment says completed but app says not
    const [failedPayments, stuckPayments] = await Promise.all([
      prisma.payment.findMany({
        where: { status: { in: ["failed", "pending"] } },
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
          user: { select: { fullName: true, phoneNumber: true } },
          application: {
            select: { id: true, certificateType: true, status: true, paymentCompleted: true },
          },
        },
      }),
      // Find mismatched states: payment completed but app not marked
      prisma.payment.findMany({
        where: {
          status: "completed",
          application: { paymentCompleted: false },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
          user: { select: { fullName: true, phoneNumber: true } },
          application: {
            select: { id: true, certificateType: true, status: true, paymentCompleted: true },
          },
        },
      }),
    ]);

    const allIssues = [
      ...failedPayments.map((p) => ({
        ...p,
        razorpayOrderId: p.razorpayOrderId,
        razorpayPaymentId: p.razorpayPaymentId,
        issueType: p.status === "failed" ? "failed" : "stuck",
      })),
      ...stuckPayments.map((p) => ({
        ...p,
        razorpayOrderId: p.razorpayOrderId,
        razorpayPaymentId: p.razorpayPaymentId,
        issueType: "mismatch" as const,
      })),
    ];

    return NextResponse.json({ success: true, data: allIssues });
  } catch (error) {
    console.error("Payment fix list error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch payment issues" },
      { status: 500 }
    );
  }
}
