import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const filter = searchParams.get("filter") || "all";
    const type = searchParams.get("type") || "";
    const doctorId = searchParams.get("doctorId") || "";
    const userId = searchParams.get("userId") || "";

    const baseWhere: Record<string, unknown> = {};

    if (filter === "unread") {
      baseWhere.isRead = false;
    } else if (filter === "read") {
      baseWhere.isRead = true;
    }

    if (type) {
      baseWhere.type = type;
    }

    // When doctorId or userId is supplied, filter for that entity's notifications
    // instead of the default admin-only filter
    let queryWhere: Record<string, unknown>;
    if (doctorId) {
      queryWhere = { ...baseWhere, doctorId };
    } else if (userId) {
      queryWhere = { ...baseWhere, userId };
    } else {
      // Default: return admin-facing notifications
      queryWhere = { ...baseWhere, adminId: { not: null } };
    }

    // Try with queryWhere first; fall back if a column doesn't exist in DB yet
    let notifications: Array<{
      id: string; title: string; message: string; type: string;
      isRead: boolean; userId: string | null; doctorId: string | null;
      adminId: string | null | undefined; metadata: unknown; createdAt: Date;
    }>;
    let total: number;
    let unreadCount: number;
    try {
      [notifications, total, unreadCount] = await Promise.all([
        prisma.notification.findMany({
          where: queryWhere,
          select: {
            id: true,
            title: true,
            message: true,
            type: true,
            isRead: true,
            userId: true,
            doctorId: true,
            adminId: true,
            metadata: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.notification.count({ where: queryWhere }),
        prisma.notification.count({ where: { ...queryWhere, isRead: false } }),
      ]);
    } catch {
      // adminId column not yet in production DB — use explicit select to exclude it
      const [rows, fallbackTotal, fallbackUnread] = await Promise.all([
        prisma.notification.findMany({
          where: baseWhere,
          select: {
            id: true, title: true, message: true, type: true,
            isRead: true, userId: true, doctorId: true,
            metadata: true, createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.notification.count({ where: baseWhere }),
        prisma.notification.count({ where: { ...baseWhere, isRead: false } }),
      ]);
      notifications = rows.map((r) => ({ ...r, adminId: null }));
      total = fallbackTotal;
      unreadCount = fallbackUnread;
    }

    const items = notifications.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,
      isRead: n.isRead,
      userId: n.userId,
      doctorId: n.doctorId,
      adminId: n.adminId,
      metadata: n.metadata,
      createdAt: n.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: {
        notifications: items,
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// Mark all admin notifications as read
export async function PUT(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (auth instanceof NextResponse) return auth;

    // Simplified admin notifications filter - only check adminId IS NOT NULL
    const adminWhere = {
      isRead: false,
      adminId: { not: null },
    };

    try {
      await prisma.notification.updateMany({
        where: adminWhere,
        data: { isRead: true },
      });
    } catch {
      // adminId column not yet in production DB — fall back to basic filter
      await prisma.notification.updateMany({
        where: { isRead: false },
        data: { isRead: true },
      });
    }

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    return NextResponse.json(
      { success: false, message: "Failed to mark all notifications as read" },
      { status: 500 }
    );
  }
}
