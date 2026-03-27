"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import type { PaymentFixItem } from "@/types";

interface UseAdminPaymentFixResult {
  data: (PaymentFixItem & { issueType: string })[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  fixPayment: (id: string, action: "mark_completed" | "retry" | "refund") => Promise<void>;
  fixing: boolean;
}

export function useAdminPaymentFix(): UseAdminPaymentFixResult {
  const [data, setData] = useState<(PaymentFixItem & { issueType: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fixing, setFixing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get("/admin/payment-fix");
      setData(res.data.data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load payment issues"));
    } finally {
      setLoading(false);
    }
  }, []);

  const fixPayment = useCallback(
    async (id: string, action: "mark_completed" | "retry" | "refund") => {
      try {
        setFixing(true);
        await api.post(`/admin/payment-fix/${id}`, { action });
        await fetchData();
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        throw new Error(e.response?.data?.message || "Failed to fix payment");
      } finally {
        setFixing(false);
      }
    },
    [fetchData]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, fixPayment, fixing };
}
