"use client";

import { Loader2, AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { useDoctorSettings } from "@/hooks/use-doctor-settings";
import { ProfileForm } from "@/components/doctor/settings/profile-form";
import { BankDetailsForm } from "@/components/doctor/settings/bank-details-form";
import { PasswordForm } from "@/components/doctor/settings/password-form";
import { NotificationPrefsForm } from "@/components/doctor/settings/notification-prefs-form";
import Link from "next/link";

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
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />
          <p className="mt-3 text-sm text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <p className="text-lg font-medium text-gray-900">
          {error || "Failed to load settings"}
        </p>
        <p className="text-sm text-gray-500">Please try again</p>
        <button
          onClick={refetch}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/doctor"
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="h-6 w-px bg-gray-200" />
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              Settings
            </h2>
            <p className="text-sm text-gray-500">
              Manage your profile and account settings
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 p-6">
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
    </div>
  );
}
