"use client";

import { useState } from "react";
import { Landmark, Save, Loader2, Building2, User, CreditCard, Hash } from "lucide-react";
import type { BankDetails } from "@/types";

interface BankDetailsFormProps {
  bankDetails: (BankDetails & { accountHolderName?: string }) | null;
  onSave: (data: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  }) => Promise<boolean>;
  saving: boolean;
}

export function BankDetailsForm({
  bankDetails,
  onSave,
  saving,
}: BankDetailsFormProps) {
  const [form, setForm] = useState({
    bankName: bankDetails?.bankName ?? "",
    accountNumber: bankDetails?.accountNumber ?? "",
    confirmAccountNumber: bankDetails?.accountNumber ?? "",
    ifscCode: bankDetails?.ifscCode ?? "",
    accountHolderName: bankDetails?.accountHolderName ?? "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.accountNumber !== form.confirmAccountNumber) {
      setError("Account numbers do not match");
      return;
    }

    if (!form.bankName || !form.accountNumber || !form.ifscCode) {
      setError("All fields except Account Holder are required");
      return;
    }

    await onSave({
      bankName: form.bankName,
      accountNumber: form.accountNumber,
      ifscCode: form.ifscCode,
      accountHolderName: form.accountHolderName,
    });
  };

  const inputClasses =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-gray-300";
  const labelClasses =
    "mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-sm">
            <Landmark className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Bank Details</h3>
            <p className="text-sm text-gray-500">
              Add your bank account for receiving payouts
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClasses}>
                <Building2 className="h-4 w-4 text-gray-400" />
                Bank Name
              </label>
              <input
                type="text"
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                placeholder="e.g. State Bank of India"
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>
                <User className="h-4 w-4 text-gray-400" />
                Account Holder Name
              </label>
              <input
                type="text"
                value={form.accountHolderName}
                onChange={(e) =>
                  setForm({ ...form, accountHolderName: e.target.value })
                }
                placeholder="Enter account holder name"
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClasses}>
                <CreditCard className="h-4 w-4 text-gray-400" />
                Account Number
              </label>
              <input
                type="text"
                value={form.accountNumber}
                onChange={(e) =>
                  setForm({ ...form, accountNumber: e.target.value })
                }
                placeholder="Enter account number"
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>
                <CreditCard className="h-4 w-4 text-gray-400" />
                Confirm Account Number
              </label>
              <input
                type="text"
                value={form.confirmAccountNumber}
                onChange={(e) =>
                  setForm({ ...form, confirmAccountNumber: e.target.value })
                }
                placeholder="Re-enter account number"
                className={inputClasses}
              />
            </div>
          </div>

          <div className="max-w-md">
            <label className={labelClasses}>
              <Hash className="h-4 w-4 text-gray-400" />
              IFSC Code
            </label>
            <input
              type="text"
              value={form.ifscCode}
              onChange={(e) =>
                setForm({
                  ...form,
                  ifscCode: e.target.value.toUpperCase(),
                })
              }
              placeholder="e.g. SBIN0001234"
              className={`${inputClasses} uppercase`}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-gray-100 bg-gray-50/50 px-6 py-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Bank Details
          </button>
        </div>
      </form>
    </div>
  );
}
