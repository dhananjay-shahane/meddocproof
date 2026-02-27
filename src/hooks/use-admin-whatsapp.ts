"use client";

import { useState, useCallback, useEffect } from "react";
import api from "@/lib/api";
import type { WhatsAppConversation, WhatsAppTemplate, SendWhatsAppPayload, WhatsAppMessage } from "@/types";

export function useAdminWhatsApp() {
  const [conversations, setConversations] = useState<WhatsAppConversation[]>([]);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/admin/whatsapp");
      setConversations(res.data.data.conversations);
      setTemplates(res.data.data.templates);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch WhatsApp data";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (payload: SendWhatsAppPayload) => {
      try {
        setSending(true);
        setError(null);
        const res = await api.post("/admin/whatsapp/send", payload);
        const newMsg: WhatsAppMessage = res.data.data;

        // Add message to the relevant conversation
        setConversations((prev) => {
          const idx = prev.findIndex((c) => c.phoneNumber === payload.phoneNumber);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = {
              ...updated[idx],
              lastMessage: payload.message,
              lastMessageAt: newMsg.createdAt,
              messages: [...updated[idx].messages, newMsg],
            };
            return updated;
          }
          // New conversation
          return [
            {
              phoneNumber: payload.phoneNumber,
              userId: payload.userId || null,
              lastMessage: payload.message,
              lastMessageAt: newMsg.createdAt,
              unreadCount: 0,
              messages: [newMsg],
            },
            ...prev,
          ];
        });

        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to send message";
        setError(msg);
        return false;
      } finally {
        setSending(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { conversations, templates, loading, sending, error, fetchData, sendMessage };
}
