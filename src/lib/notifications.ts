import type { Prisma, PrismaClient } from "@prisma/client";

type TransactionClient = PrismaClient | Prisma.TransactionClient;

interface CreateNotificationParams {
  userId?: string;
  doctorId?: string;
  adminId?: string;
  type: string;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export async function createNotification(
  client: TransactionClient,
  params: CreateNotificationParams
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (client as any).notification.create({
    data: {
      userId: params.userId ?? null,
      doctorId: params.doctorId ?? null,
      adminId: params.adminId ?? null,
      type: params.type,
      title: params.title,
      message: params.message,
      metadata: params.metadata ?? undefined,
    },
  });
}

export async function createBulkNotifications(
  client: TransactionClient,
  notifications: CreateNotificationParams[]
) {
  return Promise.all(
    notifications.map((n) => createNotification(client, n))
  );
}
