"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/lib/api";
import { useSocket } from "@/hooks/use-socket";
import { SOCKET_EVENTS } from "@/lib/socket-events";
import type { DoctorRegisteredPayload, UserRegisteredPayload, CertificateAppliedPayload } from "@/lib/socket-events";

interface HeaderNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface UseHeaderNotificationsResult {
  notifications: HeaderNotification[];
  unreadCount: number;
  loading: boolean;
  refetch: () => Promise<void>;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  deleteNotification: (id: string) => Promise<boolean>;
}

// Lightweight hook for header notification dropdown
// Uses optimized endpoint that only fetches what's needed
// Also subscribes to Socket.io for real-time admin events
export function useHeaderNotifications(limit: number = 5): UseHeaderNotificationsResult {
  const [notifications, setNotifications] = useState<HeaderNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const joinedRef = useRef(false);

  const { socket, connected, joinAdminRoom } = useSocket();

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get(`/admin/notifications/unread-count?limit=${limit}`);
      if (res.data.success) {
        setNotifications(res.data.items || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch {
      // Silently fail - header should not break if notifications fail
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchData();
    // Poll every 30 seconds as fallback for non-socket scenarios
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // ── Join admin room once connected ──────────────────────
  useEffect(() => {
    if (connected && !joinedRef.current) {
      joinAdminRoom();
      joinedRef.current = true;
    }
    if (!connected) {
      joinedRef.current = false;
    }
  }, [connected, joinAdminRoom]);

  // ── Real-time socket event subscriptions ────────────────
  useEffect(() => {
    if (!socket) return;

    const handleDoctorRegistered = (payload: DoctorRegisteredPayload) => {
      const newNotification: HeaderNotification = {
        id: `live-doctor-${Date.now()}`,
        title: "New Doctor Registration",
        message: `Dr. ${payload.fullName} has registered (${payload.specialization}) — pending approval`,
        type: "doctor_registered",
        isRead: false,
        createdAt: payload.createdAt,
      };
      setNotifications((prev) => [newNotification, ...prev].slice(0, limit));
      setUnreadCount((prev) => prev + 1);
    };

    const handleUserRegistered = (payload: UserRegisteredPayload) => {
      const newNotification: HeaderNotification = {
        id: `live-user-${Date.now()}`,
        title: "New User Registered",
        message: `${payload.fullName} has created an account`,
        type: "user_registered",
        isRead: false,
        createdAt: payload.createdAt,
      };
      setNotifications((prev) => [newNotification, ...prev].slice(0, limit));
      setUnreadCount((prev) => prev + 1);
    };

    const handleCertificateApplied = (payload: CertificateAppliedPayload) => {
      const newNotification: HeaderNotification = {
        id: `live-cert-${Date.now()}`,
        title: "New Certificate Application",
        message: `Application #${payload.applicationId} submitted (${payload.certificateType.replace(/_/g, " ")})`,
        type: "certificate_applied",
        isRead: false,
        createdAt: payload.createdAt,
      };
      setNotifications((prev) => [newNotification, ...prev].slice(0, limit));
      setUnreadCount((prev) => prev + 1);
    };

    socket.on(SOCKET_EVENTS.DOCTOR_REGISTERED, handleDoctorRegistered);
    socket.on(SOCKET_EVENTS.USER_REGISTERED, handleUserRegistered);
    socket.on(SOCKET_EVENTS.CERTIFICATE_APPLIED, handleCertificateApplied);

    return () => {
      socket.off(SOCKET_EVENTS.DOCTOR_REGISTERED, handleDoctorRegistered);
      socket.off(SOCKET_EVENTS.USER_REGISTERED, handleUserRegistered);
      socket.off(SOCKET_EVENTS.CERTIFICATE_APPLIED, handleCertificateApplied);
    };
  }, [socket, limit]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await api.put(`/admin/notifications/${id}`);
      // Optimistically update local state
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      return true;
    } catch {
      return false;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.put("/admin/notifications");
      // Optimistically update local state
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      return true;
    } catch {
      return false;
    }
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await api.delete(`/admin/notifications/${id}`);
      // Optimistically remove from local state
      const deletedNotification = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      return true;
    } catch {
      return false;
    }
  }, [notifications]);

  return { 
    notifications, 
    unreadCount, 
    loading, 
    refetch: fetchData, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  };
}
