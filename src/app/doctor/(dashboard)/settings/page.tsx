"use client";

import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useDoctorSettings } from "@/hooks/use-doctor-settings";
import { ProfileForm } from "@/components/doctor/settings/profile-form";
import { BankDetailsForm } from "@/components/doctor/settings/bank-details-form";
import { PasswordForm } from "@/components/doctor/settings/password-form";
import { NotificationPrefsForm } from "@/components/doctor/settings/notification-prefs-form";

export default function DoctorSettingsPage() {
  const {
    data,
    loading,
    error,
    refetch,
    updateProfile,
    changePassword,
    updateBankDetails,
    updateNotifications,
    saving,
  } = useDoctorSettings();

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium text-red-600">
          {error || "Failed to load settings"}
        </p>
        <button
          onClick={refetch}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your profile and account settings.
        </p>
      </div>

      <ProfileForm
        profile={data.profile}
        onSave={updateProfile}
        saving={saving}
      />

      <BankDetailsForm
        bankDetails={data.bankDetails}
        onSave={updateBankDetails}
        saving={saving}
      />

      <PasswordForm onSave={changePassword} saving={saving} />

      <NotificationPrefsForm
        preferences={data.notificationPreferences}
        onSave={updateNotifications}
        saving={saving}
      />
    </div>
  );
}
