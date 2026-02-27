"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import type {
  ApplicationDetailData,
  MedicalAssessmentFormData,
  Remark,
} from "@/types";

interface UseDoctorApplicationDetailResult {
  data: ApplicationDetailData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  submitAssessment: (formData: MedicalAssessmentFormData) => Promise<boolean>;
  completeConsultation: (notes: string) => Promise<boolean>;
  issueCertificate: () => Promise<boolean>;
  addRemark: (message: string) => Promise<Remark | null>;
  submitting: boolean;
}

export function useDoctorApplicationDetail(
  applicationId: string
): UseDoctorApplicationDetailResult {
  const [data, setData] = useState<ApplicationDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    if (!applicationId) return;
    try {
      setError(null);
      setLoading(true);
      const response = await api.get(`/doctor/applications/${applicationId}`);
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError(response.data.message || "Failed to load application");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load application";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const submitAssessment = useCallback(
    async (formData: MedicalAssessmentFormData): Promise<boolean> => {
      try {
        setSubmitting(true);
        const response = await api.post(
          `/doctor/applications/${applicationId}/medical-assessment`,
          formData
        );
        if (response.data.success) {
          await fetchData(); // Refresh data
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [applicationId, fetchData]
  );

  const completeConsultation = useCallback(
    async (notes: string): Promise<boolean> => {
      try {
        setSubmitting(true);
        const response = await api.post(
          `/doctor/applications/${applicationId}/consultation-complete`,
          { consultationNotes: notes }
        );
        if (response.data.success) {
          await fetchData();
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [applicationId, fetchData]
  );

  const issueCertificate = useCallback(async (): Promise<boolean> => {
    try {
      setSubmitting(true);
      const response = await api.post(
        `/doctor/applications/${applicationId}/issue-certificate`
      );
      if (response.data.success) {
        await fetchData();
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [applicationId, fetchData]);

  const addRemark = useCallback(
    async (message: string): Promise<Remark | null> => {
      try {
        setSubmitting(true);
        const response = await api.post(
          `/doctor/applications/${applicationId}/remarks`,
          { message }
        );
        if (response.data.success) {
          await fetchData();
          return response.data.data;
        }
        return null;
      } catch {
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [applicationId, fetchData]
  );

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    submitAssessment,
    completeConsultation,
    issueCertificate,
    addRemark,
    submitting,
  };
}
