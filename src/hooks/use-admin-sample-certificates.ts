"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

export interface SampleCertificateItem {
  id: string;
  certificateType: string;
  fileUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseAdminSampleCertificatesResult {
  samples: SampleCertificateItem[];
  loading: boolean;
  error: string | null;
  saveSample: (certificateType: string, fileUrl: string) => Promise<boolean>;
  toggleActive: (id: string, isActive: boolean) => Promise<boolean>;
  deleteSample: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useAdminSampleCertificates(): UseAdminSampleCertificatesResult {
  const [samples, setSamples] = useState<SampleCertificateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get("/admin/sample-certificates");
      if (res.data.success) {
        setSamples(res.data.data);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to load sample certificates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveSample = useCallback(
    async (certificateType: string, fileUrl: string) => {
      try {
        await api.post("/admin/sample-certificates", { certificateType, fileUrl });
        await fetchData();
        return true;
      } catch {
        return false;
      }
    },
    [fetchData]
  );

  const toggleActive = useCallback(
    async (id: string, isActive: boolean) => {
      try {
        await api.put("/admin/sample-certificates", { id, isActive });
        await fetchData();
        return true;
      } catch {
        return false;
      }
    },
    [fetchData]
  );

  const deleteSample = useCallback(
    async (id: string) => {
      try {
        await api.delete(`/admin/sample-certificates?id=${id}`);
        await fetchData();
        return true;
      } catch {
        return false;
      }
    },
    [fetchData]
  );

  return {
    samples,
    loading,
    error,
    saveSample,
    toggleActive,
    deleteSample,
    refetch: fetchData,
  };
}
