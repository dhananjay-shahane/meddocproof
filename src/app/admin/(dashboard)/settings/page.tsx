"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  CreditCard,
  MessageSquare,
  Bell,
  Save,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { useAdminSettings } from "@/hooks/use-admin-settings";

type TabKey = "general" | "payment" | "whatsapp" | "notifications";

const TABS: { key: TabKey; label: string; icon: typeof Settings }[] = [
  { key: "general", label: "General", icon: Settings },
  { key: "payment", label: "Payment", icon: CreditCard },
  { key: "whatsapp", label: "WhatsApp", icon: MessageSquare },
  { key: "notifications", label: "Notifications", icon: Bell },
];

export default function SettingsPage() {
  const { settings, loading, saving, updateSettings } = useAdminSettings();
  const [activeTab, setActiveTab] = useState<TabKey>("general");

  const [general, setGeneral] = useState({
    siteName: "",
    supportEmail: "",
    supportPhone: "",
    maintenanceMode: false,
  });
  const [payment, setPayment] = useState({
    razorpayKeyId: "",
    razorpayKeySecret: "",
    sickLeaveFee: 0,
    fitnessFee: 0,
    doctorPayoutPercentage: 0,
  });
  const [whatsapp, setWhatsapp] = useState({
    apiEndpoint: "",
    apiKey: "",
    defaultCountryCode: "",
    enabled: false,
  });
  const [notifications, setNotifications] = useState({
    emailEnabled: true,
    smsEnabled: false,
    whatsappEnabled: false,
  });
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (settings) {
      setGeneral(settings.general);
      setPayment(settings.payment);
      setWhatsapp(settings.whatsapp);
      setNotifications(settings.notifications);
    }
  }, [settings]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSave = async (section: TabKey) => {
    const sectionData: Record<TabKey, Record<string, unknown>> = {
      general,
      payment,
      whatsapp,
      notifications,
    };
    const success = await updateSettings(section, sectionData[section]);
    if (success) {
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved`);
    } else {
      toast.error("Failed to save settings");
    }
  };

  const toggleSecret = (key: string) => {
    setShowSecrets((p) => ({ ...p, [key]: !p[key] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Configure platform settings and preferences.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 rounded-lg border bg-muted/40 p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        {activeTab === "general" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">General Settings</h3>
              <p className="text-sm text-muted-foreground">
                Platform name, contact information, and maintenance mode.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Site Name</label>
                <input
                  type="text"
                  value={general.siteName}
                  onChange={(e) => setGeneral({ ...general, siteName: e.target.value })}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Support Email</label>
                <input
                  type="email"
                  value={general.supportEmail}
                  onChange={(e) => setGeneral({ ...general, supportEmail: e.target.value })}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Support Phone</label>
                <input
                  type="tel"
                  value={general.supportPhone}
                  onChange={(e) => setGeneral({ ...general, supportPhone: e.target.value })}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-center gap-3 pt-5">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={general.maintenanceMode}
                    onChange={(e) =>
                      setGeneral({ ...general, maintenanceMode: e.target.checked })
                    }
                    className="peer sr-only"
                  />
                  <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-gray-700" />
                </label>
                <span className="text-sm font-medium">Maintenance Mode</span>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => handleSave("general")}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save General
              </button>
            </div>
          </div>
        )}

        {activeTab === "payment" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Payment Settings</h3>
              <p className="text-sm text-muted-foreground">
                Razorpay credentials and certificate pricing.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Razorpay Key ID</label>
                <div className="relative">
                  <input
                    type={showSecrets["keyId"] ? "text" : "password"}
                    value={payment.razorpayKeyId}
                    onChange={(e) => setPayment({ ...payment, razorpayKeyId: e.target.value })}
                    className="w-full rounded-lg border bg-background px-3 py-2 pr-10 text-sm"
                    placeholder="rzp_live_..."
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecret("keyId")}
                    className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                  >
                    {showSecrets["keyId"] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Razorpay Key Secret</label>
                <div className="relative">
                  <input
                    type={showSecrets["keySecret"] ? "text" : "password"}
                    value={payment.razorpayKeySecret}
                    onChange={(e) =>
                      setPayment({ ...payment, razorpayKeySecret: e.target.value })
                    }
                    className="w-full rounded-lg border bg-background px-3 py-2 pr-10 text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecret("keySecret")}
                    className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                  >
                    {showSecrets["keySecret"] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="mb-3 text-sm font-semibold">Certificate Pricing (₹)</h4>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Sick Leave Fee</label>
                  <input
                    type="number"
                    value={payment.sickLeaveFee}
                    onChange={(e) =>
                      setPayment({ ...payment, sickLeaveFee: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Fitness Fee</label>
                  <input
                    type="number"
                    value={payment.fitnessFee}
                    onChange={(e) =>
                      setPayment({ ...payment, fitnessFee: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="mb-3 text-sm font-semibold">Doctor Payout</h4>
              <div className="max-w-xs">
                <label className="mb-1 block text-sm font-medium">
                  Payout Percentage (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={payment.doctorPayoutPercentage}
                  onChange={(e) =>
                    setPayment({
                      ...payment,
                      doctorPayoutPercentage: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleSave("payment")}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Payment
              </button>
            </div>
          </div>
        )}

        {activeTab === "whatsapp" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">WhatsApp Settings</h3>
              <p className="text-sm text-muted-foreground">
                WhatsApp Business API configuration.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">API Endpoint</label>
                <input
                  type="url"
                  value={whatsapp.apiEndpoint}
                  onChange={(e) =>
                    setWhatsapp({ ...whatsapp, apiEndpoint: e.target.value })
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                  placeholder="https://graph.facebook.com/v18.0/..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">API Key</label>
                <div className="relative">
                  <input
                    type={showSecrets["waKey"] ? "text" : "password"}
                    value={whatsapp.apiKey}
                    onChange={(e) =>
                      setWhatsapp({ ...whatsapp, apiKey: e.target.value })
                    }
                    className="w-full rounded-lg border bg-background px-3 py-2 pr-10 text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecret("waKey")}
                    className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                  >
                    {showSecrets["waKey"] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Default Country Code</label>
                <input
                  type="text"
                  value={whatsapp.defaultCountryCode}
                  onChange={(e) =>
                    setWhatsapp({ ...whatsapp, defaultCountryCode: e.target.value })
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                  placeholder="+91"
                />
              </div>
              <div className="flex items-center gap-3 pt-5">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={whatsapp.enabled}
                    onChange={(e) =>
                      setWhatsapp({ ...whatsapp, enabled: e.target.checked })
                    }
                    className="peer sr-only"
                  />
                  <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-gray-700" />
                </label>
                <span className="text-sm font-medium">WhatsApp Integration Enabled</span>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => handleSave("whatsapp")}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save WhatsApp
              </button>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Notification Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure which notification channels are active.
              </p>
            </div>
            <div className="space-y-4">
              {[
                {
                  key: "emailEnabled" as const,
                  label: "Email Notifications",
                  desc: "Send email notifications for important events",
                },
                {
                  key: "smsEnabled" as const,
                  label: "SMS Notifications",
                  desc: "Send SMS notifications to users",
                },
                {
                  key: "whatsappEnabled" as const,
                  label: "WhatsApp Notifications",
                  desc: "Send automated WhatsApp messages",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={notifications[item.key]}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          [item.key]: e.target.checked,
                        })
                      }
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-gray-700" />
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => handleSave("notifications")}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Notifications
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
