"use client";

/**
 * useTemporaryApplicationsLive
 *
 * Fetches the initial list of temporary (in-progress) applications from the
 * REST API, then subscribes to Socket.io events to apply real-time patches:
 *
 *  - TEMPORARY_CREATED  → prepend new card
 *  - TEMPORARY_STEP_UPDATED → update existing card in-place (no full refetch)
 *  - TEMPORARY_COMPLETED   → remove card (user submitted / paid)
 */
import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/lib/api";
import { useSocket } from "@/hooks/use-socket";
import { SOCKET_EVENTS } from "@/lib/socket-events";
import type {
  Application,
  TemporaryApplicationsLiveState,
  ApplicationFiltersState,
} from "@/types";
import type {
  TemporaryApplicationPayload,
  StepUpdatedPayload,
  TemporaryCompletedPayload,
} from "@/lib/socket-events";

interface UseLiveOptions {
  filters: ApplicationFiltersState;
  page: number;
  limit?: number;
}

export function useTemporaryApplicationsLive({
  filters,
  page,
  limit = 20,
}: UseLiveOptions): TemporaryApplicationsLiveState {
  const [items, setItems] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // How many users are actively filling right now (lastActiveAt within 2 min)
  const [activeCount, setActiveCount] = useState(0);

  const { socket, connected, joinAdminRoom } = useSocket();
  const joinedRef = useRef(false);

  // ─── Initial fetch ────────────────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        tab: "temporary",
        page: String(page),
        limit: String(limit),
      });
      if (filters.search) params.set("search", filters.search);
      if (filters.status && filters.status !== "all")
        params.set("status", filters.status);
      if (filters.certificateType && filters.certificateType !== "all")
        params.set("certificateType", filters.certificateType);
      if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.set("dateTo", filters.dateTo);

      const res = await api.get(`/admin/applications?${params.toString()}`);
      const data = res.data?.data;
      if (data) {
        setItems(data.items ?? []);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 1);
        calculateActiveCount(data.items ?? []);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [filters, page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── Active count ─────────────────────────────────────────
  function calculateActiveCount(apps: Application[]) {
    const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
    const count = apps.filter(
      (a) => new Date(a.lastActiveAt).getTime() > twoMinutesAgo
    ).length;
    setActiveCount(count);
  }

  // Re-run active count every 30 seconds so "Last seen X min ago" stays fresh
  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        calculateActiveCount(prev);
        return prev;
      });
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  // ─── Socket.io subscriptions ──────────────────────────────
  useEffect(() => {
    if (!socket) return;

    // Join admin room once
    if (connected && !joinedRef.current) {
      joinAdminRoom();
      joinedRef.current = true;
    }

    const onCreated = (payload: TemporaryApplicationPayload) => {
      setItems((prev) => {
        // Avoid duplicates
        if (prev.some((a) => a.id === payload.id)) return prev;
        const newApp = payloadToApplication(payload);
        const updated = [newApp, ...prev];
        calculateActiveCount(updated);
        return updated;
      });
      setTotal((t) => t + 1);
    };

    const onUpdated = (payload: StepUpdatedPayload) => {
      setItems((prev) => {
        const updated = prev.map((a) => {
          if (a.id !== payload.id) return a;
          return {
            ...a,
            currentStep: payload.currentStep,
            lastActiveAt: payload.lastActiveAt,
            updatedAt: payload.updatedAt,
            formData: payload.formData
              ? { ...(a.formData as Record<string, unknown>), ...payload.formData }
              : a.formData,
          } as Application;
        });
        calculateActiveCount(updated);
        return updated;
      });
    };

    const onCompleted = (payload: TemporaryCompletedPayload) => {
      setItems((prev) => {
        const updated = prev.filter((a) => a.id !== payload.id);
        calculateActiveCount(updated);
        return updated;
      });
      setTotal((t) => Math.max(0, t - 1));
    };

    socket.on(SOCKET_EVENTS.TEMPORARY_CREATED, onCreated);
    socket.on(SOCKET_EVENTS.TEMPORARY_STEP_UPDATED, onUpdated);
    socket.on(SOCKET_EVENTS.TEMPORARY_COMPLETED, onCompleted);

    return () => {
      socket.off(SOCKET_EVENTS.TEMPORARY_CREATED, onCreated);
      socket.off(SOCKET_EVENTS.TEMPORARY_STEP_UPDATED, onUpdated);
      socket.off(SOCKET_EVENTS.TEMPORARY_COMPLETED, onCompleted);
    };
  }, [socket, connected, joinAdminRoom]);

  // Re-join room if socket reconnects
  useEffect(() => {
    if (connected) {
      joinAdminRoom();
      joinedRef.current = true;
    } else {
      joinedRef.current = false;
    }
  }, [connected, joinAdminRoom]);

  return {
    items,
    total,
    totalPages,
    loading,
    error,
    connected,
    activeCount,
    refetch: fetchData,
  };
}

// ─── Helper: map socket payload → Application shape ───────────
function payloadToApplication(p: TemporaryApplicationPayload): Application {
  return {
    id: p.id,
    applicationId: p.applicationId,
    userId: p.user?.id ?? "",
    user: p.user
      ? {
          id: p.user.id,
          fullName: p.user.fullName,
          phoneNumber: p.user.phoneNumber,
          email: p.user.email,
          status: "active",
          isVerified: false,
          role: "user",
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        }
      : undefined,
    status: "in_progress",
    certificateType: p.certificateType as Application["certificateType"],
    formData: p.formData as Record<string, unknown>,
    currentStep: p.currentStep,
    lastActiveAt: p.lastActiveAt,
    consultationCompleted: false,
    hasMedicalAssessment: false,
    paymentCompleted: false,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}
