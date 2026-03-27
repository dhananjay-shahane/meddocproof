"use client";

import { useState } from "react";
import { Lock, Save, Loader2, Eye, EyeOff, ShieldCheck, KeyRound } from "lucide-react";

interface PasswordFormProps {
  onSave: (currentPassword: string, newPassword: string) => Promise<boolean>;
  saving: boolean;
}

export function PasswordForm({ onSave, saving }: PasswordFormProps) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.currentPassword || !form.newPassword) {
      setError("All fields are required");
      return;
    }

    if (form.newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    const success = await onSave(form.currentPassword, form.newPassword);
    if (success) {
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  const inputClasses =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-12 text-sm text-gray-700 placeholder:text-gray-400 transition-all duration-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 hover:border-gray-300";
  const labelClasses =
    "mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Change Password
            </h3>
            <p className="text-sm text-gray-500">
              Update your account password for security
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6">
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="max-w-md space-y-5">
            <div>
              <label className={labelClasses}>
                <KeyRound className="h-4 w-4 text-gray-400" />
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={form.currentPassword}
                  onChange={(e) =>
                    setForm({ ...form, currentPassword: e.target.value })
                  }
                  placeholder="Enter current password"
                  className={inputClasses}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showCurrent ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className={labelClasses}>
                <ShieldCheck className="h-4 w-4 text-gray-400" />
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={form.newPassword}
                  onChange={(e) =>
                    setForm({ ...form, newPassword: e.target.value })
                  }
                  placeholder="Enter new password (min. 8 characters)"
                  className={inputClasses}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showNew ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className={labelClasses}>
                <ShieldCheck className="h-4 w-4 text-gray-400" />
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  placeholder="Re-enter new password"
                  className={inputClasses}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Password Tips */}
          <div className="mt-6 max-w-md rounded-xl border border-gray-100 bg-gray-50/50 p-4">
            <p className="text-xs font-medium text-gray-700 mb-2">
              Password Requirements:
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li className="flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    form.newPassword.length >= 8
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
                At least 8 characters long
              </li>
              <li className="flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    form.newPassword &&
                    form.newPassword === form.confirmPassword
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
                Passwords must match
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-gray-100 bg-gray-50/50 px-6 py-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
}
