"use client";

import {
  Mail,
  MailOpen,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Inbox,
  CheckCheck,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import type { AdminContactMessage } from "@/hooks/use-admin-contact-messages";

interface ContactMessageListProps {
  messages: AdminContactMessage[];
  loading: boolean;
  error: string | null;
  filters: { filter: "all" | "unread" | "read"; search: string };
  onFilterChange: (partial: { filter?: "all" | "unread" | "read"; search?: string }) => void;
  page: number;
  totalPages: number;
  total: number;
  unreadCount: number;
  onPageChange: (page: number) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
}

export function ContactMessageList({
  messages,
  loading,
  error,
  filters,
  onFilterChange,
  page,
  totalPages,
  total,
  unreadCount,
  onPageChange,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
}: ContactMessageListProps) {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1 rounded-lg border bg-card p-1">
            {(["all", "unread", "read"] as const).map((f) => (
              <button
                key={f}
                onClick={() => onFilterChange({ filter: f })}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  filters.filter === f
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === "unread" && unreadCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-destructive px-1.5 text-[10px] text-destructive-foreground">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search messages..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="rounded-lg border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="rounded-xl border bg-destructive/10 p-6 text-center text-sm text-destructive">
          {error}
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center shadow-sm">
          <Inbox className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No Messages</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            No contact messages match the current filters.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border bg-card p-5 shadow-sm transition-colors ${
                !msg.read ? "border-primary/20 bg-primary/[2%]" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {msg.read ? (
                    <MailOpen className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/50" />
                  ) : (
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  )}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{msg.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        &lt;{msg.email}&gt;
                      </span>
                      {!msg.read && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                          New
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
                      {msg.message}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })} &middot;{" "}
                      {format(new Date(msg.createdAt), "dd MMM yyyy, HH:mm")}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1">
                  {!msg.read && (
                    <button
                      onClick={() => onMarkAsRead(msg.id)}
                      className="rounded-lg border p-2 text-muted-foreground hover:bg-muted"
                      title="Mark as read"
                    >
                      <MailOpen className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(msg.id)}
                    className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {total} message{total !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="rounded-lg border p-2 hover:bg-muted disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="rounded-lg border p-2 hover:bg-muted disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
