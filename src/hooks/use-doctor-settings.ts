"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import type {
  DoctorSettingsFormData,
  DoctorNotificationPreferences,
  BankDetails,
} from "@/types";
import { toast } from "sonner";

interface DoctorSettingsData {
  profile: DoctorSettingsFormData & { id: string; status: string; isActive: boolean; isEmailVerified: boolean; avgRating: number; totalRatings: number; completedCertificates: number; createdAt: string };
  bankDetails: (BankDetails & { accountHolderName?: string }) | null;
  notificationPreferences: DoctorNotificationPreferences;
}

interface UseDoctorSettingsResult {
  data: DoctorSettingsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateProfile: (formData: Partial<DoctorSettingsFormData>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  updateBankDetails: (details: { bankName: string; accountNumber: string; ifscCode: string; accountHolderName: string }) => Promise<boolean>;
  updateNotifications: (prefs: DoctorNotificationPreferences) => Promise<boolean>;
  saving: boolean;
}

export function useDoctorSettings(): UseDoctorSettingsResult {
  const [data, setData] = useState<DoctorSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get("/doctor/settings");
      setData(res.data.data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load settings"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateProfile = useCallback(
    async (formData: Partial<DoctorSettingsFormData>) => {
      try {
        setSaving(true);
        await api.put("/doctor/settings", formData);
        toast.success("Profile updated successfully");
        await fetchData();
        return true;
      } catch (err: unknown) {
        toast.error(getErrorMessage(err, "Failed to update profile"));
        return false;
      } finally {
        setSaving(false);
      }
    },
    [fetchData]
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      try {
        setSaving(true);
        await api.put("/doctor/settings/password", {
          currentPassword,
          newPassword,
        });
        toast.success("Password changed successfully");
        return true;
      } catch (err: unknown) {
        toast.error(getErrorMessage(err, "Failed to change password"));
        return false;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const updateBankDetails = useCallback(
    async (details: {
      bankName: string;
      accountNumber: string;
      ifscCode: string;
      accountHolderName: string;
    }) => {
      try {
        setSaving(true);
        await api.put("/doctor/settings/bank-details", details);
        toast.success("Bank details updated successfully");
        await fetchData();
        return true;
      } catch (err: unknown) {
        toast.error(
          getErrorMessage(err, "Failed to update bank details")
        );
        return false;
      } finally {
        setSaving(false);
      }
    },
    [fetchData]
  );

  const updateNotifications = useCallback(
    async (prefs: DoctorNotificationPreferences) => {
      try {
        setSaving(true);
        await api.put("/doctor/settings/notifications", prefs);
        toast.success("Notification preferences updated");
        await fetchData();
        return true;
      } catch (err: unknown) {
        toast.error(
          getErrorMessage(err, "Failed to update notification preferences")
        );
        return false;
      } finally {
        setSaving(false);
      }
    },
    [fetchData]
  );

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    updateProfile,
    changePassword,
    updateBankDetails,
    updateNotifications,
    saving,
  };
}
