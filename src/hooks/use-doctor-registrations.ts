"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import type { DoctorRegistration, PaginatedResponse } from "@/types";

interface UseDoctorRegistrationsResult {
  data: PaginatedResponse<DoctorRegistration> | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDoctorRegistrations(page = 1, limit = 20): UseDoctorRegistrationsResult {
  const [data, setData] = useState<PaginatedResponse<DoctorRegistration> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get(`/admin/doctors/registrations?page=${page}&limit=${limit}`);
      setData(res.data.data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load registrations"));
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
