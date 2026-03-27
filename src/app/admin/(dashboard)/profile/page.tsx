"use client";

import { useState, useEffect, useCallback } from "react";
import {
  User,
  Mail,
  Shield,
  Eye,
  EyeOff,
  Loader2,
  Save,
  KeyRound,
  Clock,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  lastLoginAt?: string | null;
}

export default function AdminProfilePage() {
  // ── Profile state ──────────────────────────────────────────
  const [profile, setProfile] = useState<AdminProfile>({
    id: "",
    fullName: "",
    email: "",
    role: "admin",
    lastLoginAt: null,
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileEdit, setProfileEdit] = useState({ fullName: "", email: "" });

  // ── Password state ─────────────────────────────────────────
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordSaving, setPasswordSaving] = useState(false);

  // ── Fetch profile ──────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    try {
      setProfileLoading(true);
      const res = await api.get("/admin/profile");
      if (res.data.success) {
        const data: AdminProfile = res.data.data;
        setProfile(data);
        setProfileEdit({ fullName: data.fullName, email: data.email });
      }
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ── Save profile ───────────────────────────────────────────
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileEdit.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileEdit.email.trim())) {
      toast.error("Invalid email address");
      return;
    }
    try {
      setProfileSaving(true);
      const res = await api.put("/admin/profile", {
        fullName: profileEdit.fullName.trim(),
        email: profileEdit.email.trim(),
      });
      if (res.data.success) {
        setProfile((prev) => ({ ...prev, ...res.data.data }));
        toast.success("Profile updated successfully");
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || "Failed to update profile");
    } finally {
      setProfileSaving(false);
    }
  };

  // ── Change password ────────────────────────────────────────
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }
    try {
      setPasswordSaving(true);
      const res = await api.post("/admin/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      if (res.data.success) {
        toast.success("Password changed successfully");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordSaving(false);
    }
  };

  const passwordStrength = (() => {
    const p = passwordForm.newPassword;
    if (!p) return null;
    if (p.length < 8) return { label: "Too short", color: "bg-red-500", width: "w-1/4" };
    const hasUpper = /[A-Z]/.test(p);
    const hasLower = /[a-z]/.test(p);
    const hasDigit = /\d/.test(p);
    const hasSpecial = /[^A-Za-z0-9]/.test(p);
    const score = [hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length;
    if (score <= 1) return { label: "Weak", color: "bg-orange-500", width: "w-1/2" };
    if (score === 2) return { label: "Fair", color: "bg-yellow-500", width: "w-3/4" };
    return { label: "Strong", color: "bg-green-500", width: "w-full" };
  })();

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "Never";
    return new Date(dateStr).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Admin Profile</h2>
        <p className="text-muted-foreground">
          Manage your account information and security settings
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Card 1: Profile Information ───────────────────── */}
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center gap-3 border-b px-6 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold">Profile Information</h3>
              <p className="text-xs text-muted-foreground">Update your name and email address</p>
            </div>
          </div>

          <div className="px-6 py-5">
            {profileLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {/* Avatar */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                    {getInitials(profile.fullName || "A")}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{profile.fullName}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />
                      <span className="text-xs text-muted-foreground capitalize">
                        {profile.role?.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Read-only info */}
                <div className="mb-5 grid gap-3 rounded-lg border bg-muted/40 px-4 py-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Shield className="h-3.5 w-3.5" />
                      Role
                    </span>
                    <span className="font-medium capitalize">{profile.role?.replace("_", " ")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      Last login
                    </span>
                    <span className="font-medium">{formatDate(profile.lastLoginAt)}</span>
                  </div>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        value={profileEdit.fullName}
                        onChange={(e) =>
                          setProfileEdit((prev) => ({ ...prev, fullName: e.target.value }))
                        }
                        className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                        placeholder="Enter full name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="email"
                        value={profileEdit.email}
                        onChange={(e) =>
                          setProfileEdit((prev) => ({ ...prev, email: e.target.value }))
                        }
                        className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {profileSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Changes
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* ── Card 2: Change Password ────────────────────────── */}
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center gap-3 border-b px-6 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950">
              <KeyRound className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold">Change Password</h3>
              <p className="text-xs text-muted-foreground">Keep your account secure with a strong password</p>
            </div>
          </div>

          <div className="px-6 py-5">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* Current password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Current Password</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                    }
                    className="w-full rounded-lg border bg-background py-2 pl-9 pr-10 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((prev) => ({ ...prev, current: !prev.current }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">New Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                    }
                    className="w-full rounded-lg border bg-background py-2 pl-9 pr-10 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                    placeholder="Enter new password (min 8 chars)"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {/* Password strength bar */}
                {passwordStrength && (
                  <div className="space-y-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all ${passwordStrength.color} ${passwordStrength.width}`}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{passwordStrength.label}</p>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Confirm New Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    className="w-full rounded-lg border bg-background py-2 pl-9 pr-10 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                    placeholder="Re-enter new password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {/* Match indicator */}
                {passwordForm.confirmPassword && (
                  <p
                    className={`text-xs ${
                      passwordForm.newPassword === passwordForm.confirmPassword
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {passwordForm.newPassword === passwordForm.confirmPassword
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </p>
                )}
              </div>

              {/* Password requirements checklist */}
              <div className="rounded-lg border bg-muted/40 px-4 py-3 space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">Password requirements:</p>
                {[
                  { label: "At least 8 characters", met: passwordForm.newPassword.length >= 8 },
                  { label: "Contains uppercase letter", met: /[A-Z]/.test(passwordForm.newPassword) },
                  { label: "Contains lowercase letter", met: /[a-z]/.test(passwordForm.newPassword) },
                  { label: "Contains number", met: /\d/.test(passwordForm.newPassword) },
                ].map((req) => (
                  <div key={req.label} className="flex items-center gap-2 text-xs">
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${
                        passwordForm.newPassword
                          ? req.met
                            ? "bg-green-500"
                            : "bg-red-400"
                          : "bg-muted-foreground/40"
                      }`}
                    />
                    <span
                      className={
                        passwordForm.newPassword
                          ? req.met
                            ? "text-green-700 dark:text-green-400"
                            : "text-muted-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={passwordSaving}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-60"
              >
                {passwordSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <KeyRound className="h-4 w-4" />
                )}
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
