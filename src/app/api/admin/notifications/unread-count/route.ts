import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest } from "@/lib/api-auth";

// Lightweight endpoint for getting just the unread count and recent notifications
// This is optimized for the admin header dropdown
export async function GET(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "5");

    // Simplified admin notifications filter
    const adminWhere = {
      adminId: { not: null },
    };

    try {
      const [unreadCount, recentNotifications] = await Promise.all([
        prisma.notification.count({ 
          where: { ...adminWhere, isRead: false } 
        }),
        prisma.notification.findMany({
          where: adminWhere,
          select: {
            id: true,
            title: true,
            message: true,
            type: true,
            isRead: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: limit,
        }),
      ]);

      return NextResponse.json({
        success: true,
        unreadCount,
        items: recentNotifications.map((n) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type,
          isRead: n.isRead,
          createdAt: n.createdAt.toISOString(),
        })),
      });
    } catch {
      // adminId column not yet in production DB — use fallback
      const [unreadCount, recentNotifications] = await Promise.all([
        prisma.notification.count({ 
          where: { isRead: false } 
        }),
        prisma.notification.findMany({
          select: {
            id: true,
            title: true,
            message: true,
            type: true,
            isRead: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: limit,
        }),
      ]);

      return NextResponse.json({
        success: true,
        unreadCount,
        items: recentNotifications.map((n) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type,
          isRead: n.isRead,
          createdAt: n.createdAt.toISOString(),
        })),
      });
    }
  } catch (error) {
    console.error("Failed to fetch notification count:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch notification count" },
      { status: 500 }
    );
  }
}
