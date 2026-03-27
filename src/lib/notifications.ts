import type { Prisma, PrismaClient, Notification } from "@prisma/client";

type TransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

interface CreateNotificationParams {
  userId?: string;
  doctorId?: string;
  adminId?: string;
  type: string;
  title: string;
  message: string;
  metadata?: Prisma.InputJsonValue;
}

export async function createNotification(
  client: TransactionClient,
  params: CreateNotificationParams
): Promise<Notification> {
  return client.notification.create({
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
): Promise<Notification[]> {
  return Promise.all(
    notifications.map((n) => createNotification(client, n))
  );
}
