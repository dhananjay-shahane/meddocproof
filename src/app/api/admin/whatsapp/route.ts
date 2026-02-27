import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAdminRequest, isAuthError } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await validateAdminRequest(request);
    if (isAuthError(auth)) return auth;

    // Get all messages, ordered by creation time
    const messages = await prisma.whatsAppMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 2000, // cap for perf
    });

    // Get templates
    const templates = await prisma.whatsAppTemplate.findMany({
      where: { isActive: true },
      orderBy: { displayName: "asc" },
    });

    // Group messages by phone number into conversations
    const conversationMap = new Map<string, {
      phoneNumber: string;
      userId: string | null;
      lastMessage: string;
      lastMessageAt: string;
      unreadCount: number;
      messages: typeof messages;
    }>();

    for (const msg of messages) {
      const existing = conversationMap.get(msg.phoneNumber);
      if (existing) {
        existing.messages.push(msg);
        // Count incoming unread
        if (msg.direction === "incoming" && msg.status !== "read") {
          existing.unreadCount++;
        }
      } else {
        conversationMap.set(msg.phoneNumber, {
          phoneNumber: msg.phoneNumber,
          userId: msg.userId,
          lastMessage: msg.message,
          lastMessageAt: msg.createdAt.toISOString(),
          unreadCount: msg.direction === "incoming" && msg.status !== "read" ? 1 : 0,
          messages: [msg],
        });
      }
    }

    // Lookup user names for conversations
    const userIds = [...new Set(
      [...conversationMap.values()]
        .map(c => c.userId)
        .filter((id): id is string => id !== null)
    )];

    const users = userIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, fullName: true },
        })
      : [];

    const userNameMap = new Map(users.map(u => [u.id, u.fullName]));

    // Build conversations array sorted by last message time
    const conversations = [...conversationMap.values()]
      .map(c => ({
        phoneNumber: c.phoneNumber,
        userName: c.userId ? userNameMap.get(c.userId) || undefined : undefined,
        userId: c.userId,
        lastMessage: c.lastMessage,
        lastMessageAt: c.lastMessageAt,
        unreadCount: c.unreadCount,
        messages: c.messages
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          .map(m => ({
            id: m.id,
            phoneNumber: m.phoneNumber,
            direction: m.direction,
            message: m.message,
            templateName: m.templateName,
            status: m.status,
            userId: m.userId,
            applicationId: m.applicationId,
            createdAt: m.createdAt.toISOString(),
          })),
      }))
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

    return NextResponse.json({
      success: true,
      data: {
        conversations,
        templates: templates.map(t => ({
          id: t.id,
          name: t.name,
          displayName: t.displayName,
          description: t.description,
          body: t.body,
          isActive: t.isActive,
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.updatedAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error("WhatsApp GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch WhatsApp data" },
      { status: 500 }
    );
  }
}
