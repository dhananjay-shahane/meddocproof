"use client";

import { useCallback } from "react";
import { useAdminContactMessages } from "@/hooks/use-admin-contact-messages";
import { ContactMessageList } from "@/components/admin/contact-messages/contact-message-list";
import { toast } from "sonner";

export default function AdminContactMessagesPage() {
  const {
    messages,
    unreadCount,
    total,
    page,
    totalPages,
    loading,
    error,
    filters,
    setFilters,
    setPage,
    markAsRead,
    markAllAsRead,
    deleteMessage,
  } = useAdminContactMessages();

  const handleMarkAsRead = useCallback(
    async (id: string) => {
      const success = await markAsRead(id);
      if (success) toast.success("Message marked as read");
      else toast.error("Failed to update message");
    },
    [markAsRead]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    const success = await markAllAsRead();
    if (success) toast.success("All messages marked as read");
    else toast.error("Failed to update messages");
  }, [markAllAsRead]);

  const handleDelete = useCallback(
    async (id: string) => {
      const success = await deleteMessage(id);
      if (success) toast.success("Message deleted");
      else toast.error("Failed to delete message");
    },
    [deleteMessage]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Contact Messages</h2>
        <p className="text-muted-foreground">
          Messages submitted via the public contact form.
        </p>
      </div>

      <ContactMessageList
        messages={messages}
        loading={loading}
        error={error}
        filters={filters}
        onFilterChange={setFilters}
        page={page}
        totalPages={totalPages}
        total={total}
        unreadCount={unreadCount}
        onPageChange={setPage}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDelete={handleDelete}
      />
    </div>
  );
}
