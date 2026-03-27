"use client";

import { Bell, Save, Loader2, Mail, MessageSquare, FileText, Wallet, ArrowDownToLine } from "lucide-react";
import type { DoctorNotificationPreferences } from "@/types";
import { useState } from "react";

interface NotificationPrefsFormProps {
  preferences: DoctorNotificationPreferences;
  onSave: (data: DoctorNotificationPreferences) => Promise<boolean>;
  saving: boolean;
}

export function NotificationPrefsForm({
  preferences,
  onSave,
  saving,
}: NotificationPrefsFormProps) {
  const [prefs, setPrefs] = useState<DoctorNotificationPreferences>(preferences);

  const togglePref = (key: keyof DoctorNotificationPreferences) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(prefs);
  };

  const items: {
    key: keyof DoctorNotificationPreferences;
    label: string;
    description: string;
    icon: typeof Mail;
  }[] = [
    {
      key: "emailNotifications",
      label: "Email Notifications",
      description: "Receive notifications via email",
      icon: Mail,
    },
    {
      key: "smsNotifications",
      label: "SMS Notifications",
      description: "Receive notifications via SMS",
      icon: MessageSquare,
    },
    {
      key: "newApplicationAlert",
      label: "New Application Alerts",
      description: "Get notified when a new application is assigned",
      icon: FileText,
    },
    {
      key: "paymentAlert",
      label: "Payment Alerts",
      description: "Get notified about payout completions",
      icon: Wallet,
    },
    {
      key: "withdrawalAlert",
      label: "Withdrawal Alerts",
      description: "Get notified about withdrawal status changes",
      icon: ArrowDownToLine,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-sm">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Notification Preferences
            </h3>
            <p className="text-sm text-gray-500">
              Choose how you want to receive updates
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6">
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 px-5 py-4 transition-all hover:border-gray-200 hover:bg-white"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                    <item.icon className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => togglePref(item.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    prefs[item.key]
                      ? "bg-gradient-to-r from-blue-500 to-blue-600"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                      prefs[item.key] ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-gray-100 bg-gray-50/50 px-6 py-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
