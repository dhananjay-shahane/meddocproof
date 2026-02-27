"use client";

import { Bell, Save, Loader2 } from "lucide-react";
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

  const items: { key: keyof DoctorNotificationPreferences; label: string; description: string }[] = [
    {
      key: "emailNotifications",
      label: "Email Notifications",
      description: "Receive notifications via email",
    },
    {
      key: "smsNotifications",
      label: "SMS Notifications",
      description: "Receive notifications via SMS",
    },
    {
      key: "newApplicationAlert",
      label: "New Application Alerts",
      description: "Get notified when a new application is assigned",
    },
    {
      key: "paymentAlert",
      label: "Payment Alerts",
      description: "Get notified about payout completions",
    },
    {
      key: "withdrawalAlert",
      label: "Withdrawal Alerts",
      description: "Get notified about withdrawal status changes",
    },
  ];

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Bell className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Notification Preferences</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-lg border px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => togglePref(item.key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  prefs[item.key] ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    prefs[item.key] ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
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
