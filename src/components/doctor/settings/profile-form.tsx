"use client";

import { useState, useRef } from "react";
import {
  User,
  Loader2,
  Camera,
  Stethoscope,
  Phone,
  Settings,
  Calendar,
  FileText,
  Building2,
  Award,
  IdCard,
  X,
  Mail,
  Info,
  CheckCircle2,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import type { DoctorSettingsFormData } from "@/types";

interface ProfileFormProps {
  profile: DoctorSettingsFormData & {
    id: string;
    status: string;
    isActive: boolean;
    isEmailVerified: boolean;
    avgRating: number;
    totalRatings: number;
    completedCertificates: number;
    createdAt: string;
    updatedAt?: string;
    consultationFee?: number;
  };
  onSave: (data: Partial<DoctorSettingsFormData>) => Promise<boolean>;
  saving: boolean;
}

type Tab = "professional" | "contact" | "account";

export function ProfileForm({ profile, onSave, saving }: ProfileFormProps) {
  const [activeTab, setActiveTab] = useState<Tab>("professional");
  const [form, setForm] = useState({
    fullName: profile.fullName ?? "",
    phoneNumber: profile.phoneNumber ?? "",
    profilePhotoUrl: profile.profilePhotoUrl ?? "",
    gender: profile.gender ?? "",
    dateOfBirth: profile.dateOfBirth
      ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
      : "",
    bio: profile.bio ?? "",
    medicalCouncil: profile.medicalCouncil ?? "",
    registrationYear: profile.registrationYear
      ? profile.registrationYear.toString()
      : "",
    specialization: profile.specialization ?? "",
    qualification: profile.qualification ?? "",
    experience: profile.experience ?? 0,
    hospitalAffiliation: profile.hospitalAffiliation ?? "",
    address: profile.address ?? "",
    city: profile.city ?? "",
    state: profile.state ?? "",
    pincode: profile.pincode ?? "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    profile.profilePhotoUrl
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setForm({ ...form, profilePhotoUrl: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData: Partial<DoctorSettingsFormData> = {
      ...form,
      experience: Number(form.experience),
      registrationYear: form.registrationYear
        ? parseInt(form.registrationYear)
        : null,
      phoneNumber: form.phoneNumber || null,
      profilePhotoUrl: form.profilePhotoUrl || null,
      gender: form.gender || null,
      dateOfBirth: form.dateOfBirth || null,
      bio: form.bio || null,
      medicalCouncil: form.medicalCouncil || null,
      hospitalAffiliation: form.hospitalAffiliation || null,
      address: form.address || null,
      city: form.city || null,
      state: form.state || null,
      pincode: form.pincode || null,
    };
    await onSave(submitData);
  };

  const tabs = [
    { id: "professional" as Tab, label: "Professional Profile" },
    { id: "contact" as Tab, label: "Contact Information" },
    { id: "account" as Tab, label: "Account Details" },
  ];

  const inputClasses =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-gray-300";
  const labelClasses =
    "mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700";
  const disabledInputClasses =
    "w-full rounded-lg border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Doctor Profile Settings
            </h3>
            <p className="text-sm text-gray-500">
              Update your professional information and account settings
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-100">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 px-4 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6">
          {/* Profile Photo Section - Only on Professional tab */}
          {activeTab === "professional" && (
            <div className="mb-8 flex flex-col items-center">
              <div className="relative">
                <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-gray-100 bg-gray-100 shadow-inner">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Profile"
                      width={112}
                      height={112}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-700 hover:scale-105"
                >
                  <Camera className="h-4 w-4" />
                </button>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setForm({ ...form, profilePhotoUrl: "" });
                    }}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-all hover:bg-red-600 hover:scale-105"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <p className="mt-3 text-sm font-medium text-gray-900">
                Profile Photo
              </p>
              <p className="text-xs text-gray-500">
                Click the camera icon to update your photo
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          )}

          {/* Professional Profile Tab */}
          {activeTab === "professional" && (
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClasses}>
                    <User className="h-4 w-4 text-gray-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    className={inputClasses}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className={labelClasses}>
                    <Stethoscope className="h-4 w-4 text-gray-400" />
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={form.specialization}
                    onChange={(e) =>
                      setForm({ ...form, specialization: e.target.value })
                    }
                    className={inputClasses}
                    placeholder="e.g., General Physician"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClasses}>
                    <Award className="h-4 w-4 text-gray-400" />
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={form.experience}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        experience: parseInt(e.target.value) || 0,
                      })
                    }
                    className={inputClasses}
                    placeholder="Enter years of experience"
                  />
                </div>
                <div>
                  <label className={labelClasses}>
                    <IdCard className="h-4 w-4 text-gray-400" />
                    Medical Registration Number
                  </label>
                  <input
                    type="text"
                    value={profile.registrationNumber}
                    disabled
                    className={disabledInputClasses}
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClasses}>
                    <Calendar className="h-4 w-4 text-gray-400" />
                    Registration Year
                  </label>
                  <input
                    type="number"
                    value={form.registrationYear}
                    onChange={(e) =>
                      setForm({ ...form, registrationYear: e.target.value })
                    }
                    className={inputClasses}
                    placeholder="e.g., 2015"
                  />
                </div>
                <div>
                  <label className={labelClasses}>
                    <Building2 className="h-4 w-4 text-gray-400" />
                    Hospital Affiliation
                  </label>
                  <input
                    type="text"
                    value={form.hospitalAffiliation}
                    onChange={(e) =>
                      setForm({ ...form, hospitalAffiliation: e.target.value })
                    }
                    className={inputClasses}
                    placeholder="Enter hospital name"
                  />
                </div>
              </div>

              <div>
                <label className={labelClasses}>
                  <FileText className="h-4 w-4 text-gray-400" />
                  Qualifications
                </label>
                <input
                  type="text"
                  value={form.qualification}
                  onChange={(e) =>
                    setForm({ ...form, qualification: e.target.value })
                  }
                  className={inputClasses}
                  placeholder="e.g., MBBS, MD"
                />
              </div>

              <div>
                <label className={labelClasses}>
                  <Building2 className="h-4 w-4 text-gray-400" />
                  Medical Council
                </label>
                <input
                  type="text"
                  value={form.medicalCouncil}
                  onChange={(e) =>
                    setForm({ ...form, medicalCouncil: e.target.value })
                  }
                  className={inputClasses}
                  placeholder="e.g., APMC, MCI"
                />
              </div>

              <div>
                <label className={labelClasses}>
                  <FileText className="h-4 w-4 text-gray-400" />
                  Professional Bio
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={4}
                  className={`${inputClasses} resize-none`}
                  placeholder="Write a brief description about yourself and your practice..."
                />
              </div>
            </div>
          )}

          {/* Contact Information Tab */}
          {activeTab === "contact" && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className={labelClasses}>
                    <Mail className="h-4 w-4 text-gray-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className={disabledInputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>
                    <Phone className="h-4 w-4 text-gray-400" />
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select className="w-24 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                    </select>
                    <input
                      type="tel"
                      value={form.phoneNumber?.replace(/^\+91/, "") || ""}
                      onChange={(e) =>
                        setForm({ ...form, phoneNumber: e.target.value })
                      }
                      className={`flex-1 ${inputClasses}`}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Update Phone
                  </button>
                  <p className="mt-2 flex items-start gap-1.5 text-xs text-amber-600">
                    <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                    Phone number changes require OTP verification via WhatsApp. Your current verified number: {form.phoneNumber || "Not set"}
                  </p>
                </div>
              </div>

              {/* Info Notice */}
              <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
                <p className="flex items-start gap-2 text-sm text-blue-700">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  Your contact information is used for important notifications and patient communications. Please ensure it&apos;s accurate and up to date.
                </p>
              </div>
            </div>
          )}

          {/* Account Details Tab */}
          {activeTab === "account" && (
            <div className="space-y-6">
              {/* Account Status Section */}
              <div className="rounded-xl border border-gray-100 bg-gray-50/30 p-5">
                <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Settings className="h-4 w-4 text-blue-600" />
                  Account Status
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-blue-600 font-medium mb-1">Account Status</p>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                      profile.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : profile.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      <CheckCircle2 className="h-3 w-3" />
                      {profile.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium mb-1">Approval Status</p>
                    <span className="text-sm text-gray-500">
                      {profile.isActive ? "Active" : "Not Set"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Information Section */}
              <div className="rounded-xl border border-gray-100 bg-gray-50/30 p-5">
                <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <User className="h-4 w-4 text-blue-600" />
                  Account Information
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-blue-600 font-medium mb-1">Doctor ID</p>
                    <p className="text-sm text-gray-700 font-mono">{profile.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium mb-1">Registration Number</p>
                    <p className="text-sm text-gray-700">{profile.registrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Registration Year</p>
                    <p className="text-sm text-gray-700">{form.registrationYear || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Consultation Fee</p>
                    <p className="text-sm text-gray-700">₹{profile.consultationFee || 200}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium mb-1">Account Created</p>
                    <p className="text-sm text-gray-700">
                      {new Date(profile.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium mb-1">Last Updated</p>
                    <p className="text-sm text-gray-700">
                      {profile.updatedAt
                        ? new Date(profile.updatedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : new Date().toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Summary Section */}
              <div className="rounded-xl border border-gray-100 bg-gray-50/30 p-5">
                <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Professional Summary
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-xs text-blue-600 font-medium mb-1">Specialization</p>
                    <p className="text-sm text-gray-700">{form.specialization || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium mb-1">Experience</p>
                    <p className="text-sm text-gray-700">{form.experience} years</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium mb-1">Hospital</p>
                    <p className="text-sm text-gray-700">{form.hospitalAffiliation || "Not specified"}</p>
                  </div>
                </div>
              </div>

              {/* Info Notice */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="flex items-start gap-2 text-sm text-gray-600">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
                  Your account information is automatically managed by the system. If you need to update your registration details or have verification issues, please contact our support team.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
