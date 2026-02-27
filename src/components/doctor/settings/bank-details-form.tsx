"use client";

import { useState } from "react";
import { Landmark, Save, Loader2 } from "lucide-react";
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

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Landmark className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Bank Details</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Bank Name</label>
            <input
              type="text"
              value={form.bankName}
              onChange={(e) =>
                setForm({ ...form, bankName: e.target.value })
              }
              placeholder="e.g. State Bank of India"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Account Holder Name
            </label>
            <input
              type="text"
              value={form.accountHolderName}
              onChange={(e) =>
                setForm({ ...form, accountHolderName: e.target.value })
              }
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Account Number
            </label>
            <input
              type="text"
              value={form.accountNumber}
              onChange={(e) =>
                setForm({ ...form, accountNumber: e.target.value })
              }
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Confirm Account Number
            </label>
            <input
              type="text"
              value={form.confirmAccountNumber}
              onChange={(e) =>
                setForm({ ...form, confirmAccountNumber: e.target.value })
              }
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">IFSC Code</label>
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
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm uppercase focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
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
            Save Bank Details
          </button>
        </div>
      </form>
    </div>
  );
}
