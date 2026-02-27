"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import type { DoctorFinancialSummary } from "@/types";
import { toast } from "sonner";

interface UseDoctorFinancialsResult {
  data: DoctorFinancialSummary | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  requestWithdrawal: (amount: number) => Promise<boolean>;
  withdrawing: boolean;
}

export function useDoctorFinancials(): UseDoctorFinancialsResult {
  const [data, setData] = useState<DoctorFinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get("/doctor/financials");
      setData(res.data.data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to load financials");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const requestWithdrawal = useCallback(
    async (amount: number) => {
      try {
        setWithdrawing(true);
        await api.post("/doctor/financials/withdraw", { amount });
        toast.success("Withdrawal request submitted");
        await fetchData();
        return true;
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        toast.error(
          e.response?.data?.message || "Failed to submit withdrawal"
        );
        return false;
      } finally {
        setWithdrawing(false);
      }
    },
    [fetchData]
  );

  return { data, loading, error, refetch: fetchData, requestWithdrawal, withdrawing };
}
