import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const auth = await validateAdminRequest(request);
  if (isAuthError(auth)) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const filter = searchParams.get("filter") || "all"; // all | unread | read
    const search = searchParams.get("search") || "";

    const where: Record<string, unknown> = {};

    if (filter === "unread") {
      where.read = false;
    } else if (filter === "read") {
      where.read = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    const [messages, total, unreadCount] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contactMessage.count({ where }),
      prisma.contactMessage.count({ where: { read: false } }),
    ]);

    const items = messages.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      message: m.message,
      read: m.read,
      createdAt: m.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error) {
    console.error("Failed to fetch contact messages:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch contact messages" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = await validateAdminRequest(request);
  if (isAuthError(auth)) return auth;

  try {
    const body = await request.json();
    const { id, markAll } = body as { id?: string; markAll?: boolean };

    if (markAll) {
      await prisma.contactMessage.updateMany({
        where: { read: false },
        data: { read: true },
      });
    } else if (id) {
      await prisma.contactMessage.update({
        where: { id },
        data: { read: true },
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Message id or markAll flag is required" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message(s) marked as read",
    });
  } catch (error) {
    console.error("Failed to update contact message:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update contact message" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await validateAdminRequest(request);
  if (isAuthError(auth)) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Message id is required" },
        { status: 400 }
      );
    }

    await prisma.contactMessage.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Message deleted",
    });
  } catch (error) {
    console.error("Failed to delete contact message:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete contact message" },
      { status: 500 }
    );
  }
}
