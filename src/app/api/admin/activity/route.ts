import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    const { searchParams } = new URL(request.url);
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));

    // Gather recent activities from multiple sources
    const [recentRemarks, recentPayments, recentApplications] = await Promise.all([
      // Recent remarks/notes
      prisma.remark.findMany({
        take: limit,
        orderBy: { addedAt: "desc" },
        select: {
          id: true,
          message: true,
          addedBy: true,
          addedByRole: true,
          addedAt: true,
          applicationId: true,
        },
      }),
      // Recent completed payments
      prisma.payment.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        where: { status: { in: ["completed", "failed"] } },
        select: {
          id: true,
          amount: true,
          status: true,
          createdAt: true,
          applicationId: true,
          user: { select: { fullName: true } },
        },
      }),
      // Recent application status changes (use updatedAt as proxy)
      prisma.application.findMany({
        take: limit,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          applicationId: true,
          status: true,
          updatedAt: true,
          user: { select: { fullName: true } },
        },
      }),
    ]);

    // Combine and format activities
    type ActivityEntry = {
      id: string;
      type: string;
      message: string;
      timestamp: Date;
      applicationId?: string;
    };

    const activities: ActivityEntry[] = [];

    for (const remark of recentRemarks) {
      activities.push({
        id: `remark-${remark.id}`,
        type: "remark",
        message: remark.message,
        timestamp: remark.addedAt,
        applicationId: remark.applicationId,
      });
    }

    for (const payment of recentPayments) {
      activities.push({
        id: `payment-${payment.id}`,
        type: "payment",
        message:
          payment.status === "completed"
            ? `Payment of ₹${payment.amount} received from ${payment.user?.fullName || "user"}`
            : `Payment of ₹${payment.amount} failed for ${payment.user?.fullName || "user"}`,
        timestamp: payment.createdAt,
        applicationId: payment.applicationId,
      });
    }

    for (const app of recentApplications) {
      activities.push({
        id: `app-${app.id}`,
        type: "status_change",
        message: `Application ${app.applicationId} status: ${app.status} (${app.user?.fullName || "user"})`,
        timestamp: app.updatedAt,
        applicationId: app.id,
      });
    }

    // Sort by timestamp descending and take top entries
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    const topActivities = activities.slice(0, limit).map((a) => ({
      ...a,
      timestamp: a.timestamp.toISOString(),
    }));

    return NextResponse.json({ success: true, data: topActivities });
  } catch (error) {
    console.error("Activity API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}
