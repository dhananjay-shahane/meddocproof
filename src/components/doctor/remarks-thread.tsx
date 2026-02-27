"use client";

import { useState } from "react";
import { Send, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Remark } from "@/types";

interface RemarksThreadProps {
  remarks: Remark[];
  onAdd: (message: string) => Promise<void>;
  disabled?: boolean;
}

export function RemarksThread({
  remarks,
  onAdd,
  disabled = false,
}: RemarksThreadProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending) return;
    setSending(true);
    try {
      await onAdd(message.trim());
      setMessage("");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <h4 className="text-sm font-medium">
          Remarks ({remarks.length})
        </h4>
      </div>

      {/* Remarks list */}
      <div className="max-h-64 space-y-3 overflow-y-auto">
        {remarks.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No remarks yet
          </p>
        ) : (
          remarks.map((remark) => (
            <div
              key={remark.id}
              className="rounded-lg border p-3"
            >
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {remark.addedBy}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      remark.addedByRole === "doctor"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {remark.addedByRole}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(remark.addedAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {remark.message}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Add remark form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled || sending}
          placeholder="Add a remark..."
          className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || sending || !message.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" />
          Send
        </button>
      </form>
    </div>
  );
}
