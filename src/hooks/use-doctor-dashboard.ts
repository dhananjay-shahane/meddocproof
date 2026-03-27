"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import type { DoctorDashboardStats } from "@/types";

interface UseDoctorDashboardResult {
  data: DoctorDashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDoctorDashboard(
  autoRefreshMs = 60000
): UseDoctorDashboardResult {
  const [data, setData] = useState<DoctorDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get("/doctor/dashboard");
      setData(res.data.data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load dashboard data"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    if (autoRefreshMs > 0) {
      intervalRef.current = setInterval(() => {
        fetchData();
      }, autoRefreshMs);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData, autoRefreshMs]);

  return { data, loading, error, refetch: fetchData };
}
