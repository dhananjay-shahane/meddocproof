"use client";

import { useState } from "react";
import { User, Save, Loader2 } from "lucide-react";

interface ProfileFormProps {
  profile: {
    fullName: string;
    email: string;
    phoneNumber: string | null;
    specialization: string;
    qualification: string;
    experience: number;
    hospitalAffiliation: string | null;
    registrationNumber: string;
  };
  onSave: (data: Record<string, string | number>) => Promise<boolean>;
  saving: boolean;
}

export function ProfileForm({ profile, onSave, saving }: ProfileFormProps) {
  const [form, setForm] = useState({
    fullName: profile.fullName,
    phoneNumber: profile.phoneNumber ?? "",
    specialization: profile.specialization,
    qualification: profile.qualification,
    experience: profile.experience,
    hospitalAffiliation: profile.hospitalAffiliation ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <User className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Profile Information</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full rounded-lg border bg-muted px-3 py-2 text-sm text-muted-foreground"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Phone Number
            </label>
            <input
              type="text"
              value={form.phoneNumber}
              onChange={(e) =>
                setForm({ ...form, phoneNumber: e.target.value })
              }
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Registration Number
            </label>
            <input
              type="text"
              value={profile.registrationNumber}
              disabled
              className="w-full rounded-lg border bg-muted px-3 py-2 text-sm text-muted-foreground"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Specialization
            </label>
            <input
              type="text"
              value={form.specialization}
              onChange={(e) =>
                setForm({ ...form, specialization: e.target.value })
              }
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Qualification
            </label>
            <input
              type="text"
              value={form.qualification}
              onChange={(e) =>
                setForm({ ...form, qualification: e.target.value })
              }
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Experience (years)
            </label>
            <input
              type="number"
              value={form.experience}
              onChange={(e) =>
                setForm({ ...form, experience: parseInt(e.target.value) || 0 })
              }
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Hospital Affiliation
            </label>
            <input
              type="text"
              value={form.hospitalAffiliation}
              onChange={(e) =>
                setForm({ ...form, hospitalAffiliation: e.target.value })
              }
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
