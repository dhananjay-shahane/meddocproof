"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  User,
  Bell,
  Settings,
  Shield,
  Loader2,
  FileCheck,
  ClipboardCheck,
  HeartPulse,
} from "lucide-react";
import { toast } from "sonner";
import { useAdminSettings } from "@/hooks/use-admin-settings";

type TabKey = "certificates" | "profile" | "notifications" | "system" | "security";

const TABS: { key: TabKey; label: string; icon: typeof Settings }[] = [
  { key: "certificates", label: "Certificate Types", icon: FileText },
  { key: "profile", label: "Profile", icon: User },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "system", label: "System", icon: Settings },
  { key: "security", label: "Security", icon: Shield },
];

interface CertificateType {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: typeof FileCheck;
  enabled: boolean;
}

export default function SettingsPage() {
  const { settings, loading, saving, updateSettings } = useAdminSettings();
  const [activeTab, setActiveTab] = useState<TabKey>("certificates");

  // Certificate Types State
  const [certificateTypes, setCertificateTypes] = useState<CertificateType[]>([
    {
      id: "sick-leave",
      name: "Sick Leave Certificate",
      description: "For temporary illness and medical leave from work or school",
      price: 299,
      icon: FileCheck,
      enabled: true,
    },
    {
      id: "medical-form-1a",
      name: "Medical Form 1A",
      description: "Standard medical examination form for official purposes",
      price: 499,
      icon: ClipboardCheck,
      enabled: true,
    },
    {
      id: "medical-fitness",
      name: "Medical Fitness Certificate",
      description: "Certification of physical fitness for employment or activities",
      price: 399,
      icon: HeartPulse,
      enabled: false,
    },
  ]);

  // Profile State
  const [profile, setProfile] = useState({
    fullName: "Admin User",
    email: "admin@meddocproof.com",
    phone: "+91 9876543210",
    role: "Super Admin",
  });

  // Notifications State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: true,
    frequency: "instant",
  });

  // System State
  const [systemSettings, setSystemSettings] = useState({
    language: "english",
    certificateExpiryDays: 30,
    autoAssignDoctors: true,
    manualApproval: false,
    maintenanceMode: false,
  });

  // Security State
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    activeSessions: 3,
    lastPasswordChange: "2024-01-15",
  });

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (settings) {
      // Map API settings to local state if needed
    }
  }, [settings]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSave = async () => {
    toast.success("Settings saved successfully");
  };

  const toggleCertificate = (id: string) => {
    setCertificateTypes((prev) =>
      prev.map((cert) =>
        cert.id === id ? { ...cert, enabled: !cert.enabled } : cert
      )
    );
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
      <div className="flex gap-1 rounded-xl border bg-muted/40 p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        {/* Certificate Types Tab */}
        {activeTab === "certificates" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Certificate Types Management</h3>
              <p className="text-sm text-muted-foreground">
                Enable or disable certificate types available for applications.
              </p>
            </div>

            <div className="space-y-4">
              {certificateTypes.map((cert) => {
                const Icon = cert.icon;
                return (
                  <div
                    key={cert.id}
                    className="flex items-center justify-between rounded-xl border p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-950">
                        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{cert.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {cert.description}
                        </p>
                        <p className="mt-1 text-sm font-medium text-blue-600">
                          ₹{cert.price}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleCertificate(cert.id)}
                      className={`relative h-7 w-12 rounded-full transition-colors ${
                        cert.enabled ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
                          cert.enabled ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Profile Settings</h3>
              <p className="text-sm text-muted-foreground">
                Manage your account information and preferences.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Phone Number</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Role</label>
                <input
                  type="text"
                  value={profile.role}
                  disabled
                  className="w-full rounded-xl border bg-muted px-4 py-3 text-sm text-muted-foreground"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Notification Preferences</h3>
              <p className="text-sm text-muted-foreground">
                Configure how you receive notifications.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  key: "emailNotifications" as const,
                  label: "Email Notifications",
                  desc: "Receive notifications via email",
                },
                {
                  key: "smsNotifications" as const,
                  label: "SMS Notifications",
                  desc: "Receive notifications via SMS",
                },
                {
                  key: "whatsappNotifications" as const,
                  label: "WhatsApp Notifications",
                  desc: "Receive notifications via WhatsApp",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-xl border p-5"
                >
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <button
                    onClick={() =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        [item.key]: !prev[item.key],
                      }))
                    }
                    className={`relative h-7 w-12 rounded-full transition-colors ${
                      notificationSettings[item.key]
                        ? "bg-blue-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
                        notificationSettings[item.key] ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Notification Frequency</label>
              <select
                value={notificationSettings.frequency}
                onChange={(e) =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    frequency: e.target.value,
                  }))
                }
                className="w-full max-w-xs rounded-xl border bg-background px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="instant">Instant</option>
                <option value="hourly">Hourly Digest</option>
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Digest</option>
              </select>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === "system" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">System Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure system-wide settings and preferences.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Language</label>
                <select
                  value={systemSettings.language}
                  onChange={(e) =>
                    setSystemSettings((prev) => ({
                      ...prev,
                      language: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                  <option value="bengali">Bengali</option>
                  <option value="tamil">Tamil</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Certificate Expiry (Days)
                </label>
                <input
                  type="number"
                  value={systemSettings.certificateExpiryDays}
                  onChange={(e) =>
                    setSystemSettings((prev) => ({
                      ...prev,
                      certificateExpiryDays: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {[
                {
                  key: "autoAssignDoctors" as const,
                  label: "Auto-assign Doctors",
                  desc: "Automatically assign available doctors to new applications",
                },
                {
                  key: "manualApproval" as const,
                  label: "Manual Approval Required",
                  desc: "Require admin approval before certificate generation",
                },
                {
                  key: "maintenanceMode" as const,
                  label: "Maintenance Mode",
                  desc: "Enable maintenance mode to prevent new applications",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-xl border p-5"
                >
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <button
                    onClick={() =>
                      setSystemSettings((prev) => ({
                        ...prev,
                        [item.key]: !prev[item.key],
                      }))
                    }
                    className={`relative h-7 w-12 rounded-full transition-colors ${
                      systemSettings[item.key]
                        ? "bg-blue-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
                        systemSettings[item.key] ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Security Settings</h3>
              <p className="text-sm text-muted-foreground">
                Manage your account security and authentication.
              </p>
            </div>

            {/* Password Section */}
            <div className="rounded-xl border p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">
                    Last changed on {new Date(securitySettings.lastPasswordChange).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <button className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted">
                  Change Password
                </button>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="rounded-xl border p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    {securitySettings.twoFactorEnabled
                      ? "Your account is protected with 2FA"
                      : "Add an extra layer of security to your account"}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSecuritySettings((prev) => ({
                      ...prev,
                      twoFactorEnabled: !prev.twoFactorEnabled,
                    }))
                  }
                  className={`rounded-xl px-4 py-2 text-sm font-medium ${
                    securitySettings.twoFactorEnabled
                      ? "border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {securitySettings.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                </button>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="rounded-xl border p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Active Sessions</p>
                  <p className="text-sm text-muted-foreground">
                    You have {securitySettings.activeSessions} active sessions across devices
                  </p>
                </div>
                <button className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950">
                  Sign Out All
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
