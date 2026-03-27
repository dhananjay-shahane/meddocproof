"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import type { DoctorPerformanceData } from "@/types";

interface UseDoctorPerformanceResult {
  data: DoctorPerformanceData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDoctorPerformance(): UseDoctorPerformanceResult {
  const [data, setData] = useState<DoctorPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get("/admin/doctors/performance");
      setData(res.data.data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load performance data"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
