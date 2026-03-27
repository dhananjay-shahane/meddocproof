"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ClipboardList,
  CreditCard,
  Eye,
  Loader2,
  ShieldCheck,
  Sparkles,
  Tag,
  X,
} from "lucide-react";

import { useAuth } from "@/contexts/auth-context";
import { useCertificateApply } from "@/hooks/use-certificate-apply";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ALL_CERTIFICATE_TYPES,
  MEDICAL_PROBLEMS,
  LEAVE_DURATIONS,
  LEAVE_DURATION_MESSAGE,
  GUARDIAN_RELATIONSHIPS,
  CARETAKER_RELATIONSHIPS,
  COUNTRIES,
  getLabelFromEnum,
} from "@/lib/certificate-types";
import type { CertificateType, DocumentFormat, PaymentTierId } from "@/types";

import { OtpVerification } from "@/components/certificate-apply/otp-verification";
import { FileUploadField } from "@/components/certificate-apply/file-upload-field";
import { DocumentFormatSelector } from "@/components/certificate-apply/document-format-selector";
import { PaymentTierSelector } from "@/components/certificate-apply/payment-tier-selector";

// Pre-computed at module load to avoid impure function calls during render
const MAX_DOB_18 = new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0];

const CERT_SVG_MAP: Record<string, string> = {
  sick_leave: "/svg/CertificatesIcons/SickLeavecertificatesvg.svg",
  work_from_home: "/svg/CertificatesIcons/WorkfromHomecertificate.svg",
  caretaker: "/svg/CertificatesIcons/CareTakerCertificate.svg",
  recovery: "/svg/CertificatesIcons/Recoverycertificate.svg",
  fitness: "/svg/CertificatesIcons/MedicalFitnessCertificate.svg",
  fit_to_fly: "/svg/CertificatesIcons/FittoFly.svg",
  unfit_to_work: "/svg/CertificatesIcons/Unfit%20to%20WorkCertificate.svg",
  unfit_to_travel: "/svg/CertificatesIcons/UnfittiTravel.svg",
  medical_diagnosis: "/svg/CertificatesIcons/DiagnosisCertificate.svg",
};
import { SpecialAttestationField } from "@/components/certificate-apply/special-attestation-field";
import { TermsCheckbox } from "@/components/certificate-apply/terms-checkbox";
import { PriceBreakdown } from "@/components/certificate-apply/price-breakdown";

// ─── Indian States ────────────────────────────────────
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Chandigarh", "Puducherry", "Ladakh", "Jammu & Kashmir",
  "Andaman & Nicobar Islands", "Dadra & Nagar Haveli and Daman & Diu", "Lakshadweep",
];

// ─── Step Labels ──────────────────────────────────────
const STEPS = [
  { label: "Certificate Type", icon: ClipboardList },
  { label: "Personal Details", icon: ShieldCheck },
  { label: "Certificate Details", icon: Sparkles },
  { label: "Review & Payment", icon: CreditCard },
];

// ─── Helper: Validation Error Display ─────────────────
function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="mt-1 text-xs text-red-500">{error}</p>;
}

export default function CertificateApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <CertificateApplyForm />
    </Suspense>
  );
}

function CertificateApplyForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const {
    currentStep,
    formData,
    applicationId,
    coupon,
    couponDiscount,
    finalAmount,
    certGroup,
    submitting,
    paying,
    couponLoading,
    paymentComplete,
    error,
    validationErrors,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    setCurrentStep,
    validateStep,
    applyCoupon,
    removeCoupon,
    submitApplication,
    initiatePayment,
  } = useCertificateApply();

  const [couponInput, setCouponInput] = useState("");
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // Pre-compute the max DOB for 18+ age requirement (computed once at module load)
  const maxDob18 = MAX_DOB_18;

  // Pre-select certificate type from URL param (stay on step 0 so user sees their selection)
  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam) {
      const cert = ALL_CERTIFICATE_TYPES.find(
        (c) => c.slug === typeParam || c.enumValue === typeParam
      );
      if (cert) {
        updateFormData({ certificateType: cert.enumValue as CertificateType });
      }
    }
  }, [searchParams, updateFormData]);

  // ─── Handlers ─────────────────────────────────────────

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      // If user is not logged in, show login popup instead of proceeding
      if (!isAuthenticated && !authLoading) {
        setShowLoginDialog(true);
        return;
      }
      nextStep();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    prevStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePayAndSubmit = async () => {
    if (!validateStep(3)) return;
    const appId = await submitApplication();
    if (appId) {
      await initiatePayment(appId);
    }
  };

  const handleApplyCoupon = async () => {
    if (couponInput.trim()) {
      await applyCoupon(couponInput.trim());
    }
  };

  // ─── Success State ────────────────────────────────────

  if (paymentComplete) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-16">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">Application Submitted!</h2>
        <p className="max-w-md text-center text-muted-foreground">
          Your certificate application has been submitted and payment received.
          A doctor will review your request shortly. You can track the status
          from your profile.
        </p>
        {applicationId && (
          <p className="rounded-lg bg-muted px-4 py-2 text-sm font-mono">
            Application ID: {applicationId}
          </p>
        )}
        <div className="mt-4 flex gap-3">
          <Link
            href="/profile"
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            View My Applications
          </Link>
          <Link
            href="/"
            className="rounded-xl border px-6 py-2.5 text-sm font-semibold hover:bg-muted"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // ─── Main Form ────────────────────────────────────────

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="mx-auto max-w-6xl px-4 pt-24 lg:pt-28 pb-10">
        {/* Stepper */}
        <nav className="mb-10">
          <ol className="flex items-center gap-2">
            {STEPS.map((step, idx) => {
              const isActive = idx === currentStep;
              const isCompleted = idx < currentStep;
              const StepIcon = step.icon;
              return (
                <li key={idx} className="flex flex-1 items-center gap-2">
                  <button
                    onClick={() => idx < currentStep && goToStep(idx)}
                    disabled={idx > currentStep}
                    className={`flex flex-1 items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : isCompleted
                          ? "border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/20 dark:text-green-400 cursor-pointer"
                          : "border-muted text-muted-foreground opacity-50 cursor-default"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : isCompleted
                            ? "bg-green-600 text-white"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        idx + 1
                      )}
                    </span>
                    <span className="hidden sm:inline">{step.label}</span>
                    <StepIcon className="h-4 w-4 sm:hidden" />
                  </button>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`hidden h-0.5 w-6 sm:block ${
                        idx < currentStep ? "bg-green-500" : "bg-muted"
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Global Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* ─── STEP 0: Certificate Type Selection ─── */}
        {currentStep === 0 && (
          <div>
            <h2 className="text-2xl font-bold">
              Select Certificate Type
            </h2>
            <p className="mt-1 text-muted-foreground">
              Choose the type of medical certificate you need.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ALL_CERTIFICATE_TYPES.map((cert) => {
                const isSelected =
                  formData.certificateType === cert.enumValue;
                return (
                  <button
                    key={cert.enumValue}
                    onClick={() => {
                      updateFormData({
                        certificateType: cert.enumValue as CertificateType,
                      });
                    }}
                    className={`group relative flex flex-col items-start rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-lg ring-1 ring-primary/20"
                        : "border-border bg-card hover:border-primary/40 hover:shadow-md"
                    }`}
                  >
                    {/* Selected indicator */}
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                          <CheckCircle className="h-4 w-4 text-primary-foreground" />
                        </div>
                      </div>
                    )}

                    <div
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                        isSelected
                          ? "bg-primary/10"
                          : "bg-muted group-hover:bg-primary/10"
                      }`}
                    >
                      <Image
                        src={CERT_SVG_MAP[cert.enumValue] ?? "/svg/Certificatesvg/Sickleave-svgrepo-com.svg"}
                        alt={cert.name}
                        width={20}
                        height={20}
                        className="h-5 w-5 object-contain"
                      />
                    </div>
                    <h3 className="mt-3 font-semibold text-foreground">{cert.name}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                      {cert.description}
                    </p>
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">Starting from</span>
                      <span className="text-sm font-bold text-foreground">{cert.startingPrice}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleNextStep}
                disabled={!formData.certificateType}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 1: Personal & Organization Details ─── */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold">
                Personal & Organization Details
              </h2>
              <p className="mt-1 text-muted-foreground">
                Please provide accurate information. All fields marked with * are required.
              </p>
            </div>

            {/* Name */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateFormData({ firstName: e.target.value })}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Enter first name"
                />
                <FieldError error={validationErrors.firstName} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateFormData({ lastName: e.target.value })}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Enter last name"
                />
                <FieldError error={validationErrors.lastName} />
              </div>
            </div>

            {/* Phone + OTP */}
            <OtpVerification
              phoneNumber={formData.phoneNumber}
              onPhoneChange={(phone) => updateFormData({ phoneNumber: phone })}
              otpVerified={formData.otpVerified}
              onVerified={() => updateFormData({ otpVerified: true })}
            />
            <FieldError error={validationErrors.phoneNumber} />

            {/* Guardian */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Guardian Relationship <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.guardianRelationship}
                  onChange={(e) =>
                    updateFormData({ guardianRelationship: e.target.value as typeof formData.guardianRelationship })
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select relationship</option>
                  {GUARDIAN_RELATIONSHIPS.map((rel) => (
                    <option key={rel.value} value={rel.value}>
                      {rel.label}
                    </option>
                  ))}
                </select>
                <FieldError error={validationErrors.guardianRelationship} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Guardian&apos;s Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.guardianName}
                  onChange={(e) =>
                    updateFormData({ guardianName: e.target.value })
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Enter guardian's name"
                />
                <FieldError error={validationErrors.guardianName} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData({ email: e.target.value })}
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="your@email.com"
              />
              <FieldError error={validationErrors.email} />
            </div>

            {/* Gender + DOB */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4 pt-1">
                  {["male", "female", "other"].map((g) => (
                    <label key={g} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={(e) =>
                          updateFormData({ gender: e.target.value })
                        }
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="capitalize">{g}</span>
                    </label>
                  ))}
                </div>
                <FieldError error={validationErrors.gender} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    updateFormData({ dateOfBirth: e.target.value })
                  }
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <FieldError error={validationErrors.dateOfBirth} />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="font-semibold">Address</h3>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => updateFormData({ street: e.target.value })}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Street address"
                />
                <FieldError error={validationErrors.street} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateFormData({ city: e.target.value })}
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="City"
                  />
                  <FieldError error={validationErrors.city} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => updateFormData({ state: e.target.value })}
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <FieldError error={validationErrors.state} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) =>
                      updateFormData({ postalCode: e.target.value })
                    }
                    maxLength={6}
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Postal code"
                  />
                  <FieldError error={validationErrors.postalCode} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) =>
                      updateFormData({ country: e.target.value })
                    }
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <FieldError error={validationErrors.country} />
                </div>
              </div>
            </div>

            {/* Organization */}
            <div className="space-y-4">
              <h3 className="font-semibold">Organization Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Organization Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.organizationName}
                    onChange={(e) =>
                      updateFormData({ organizationName: e.target.value })
                    }
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Company / college / institution name"
                  />
                  <FieldError error={validationErrors.organizationName} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Organisation Located In{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6 pt-1">
                    {[
                      { value: "india", label: "India" },
                      { value: "outside_india", label: "Outside India" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="radio"
                          name="organizationLocatedIn"
                          value={opt.value}
                          checked={
                            formData.organizationLocatedIn === opt.value
                          }
                          onChange={(e) =>
                            updateFormData({
                              organizationLocatedIn: e.target.value as "india" | "outside_india",
                            })
                          }
                          className="h-4 w-4 accent-primary"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                  <FieldError
                    error={validationErrors.organizationLocatedIn}
                  />
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <button
                onClick={handlePrevStep}
                className="inline-flex items-center gap-2 rounded-xl border px-6 py-2.5 text-sm font-semibold hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                onClick={handleNextStep}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 2: Certificate Details & Payment ─── */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold">
                Certificate Details
              </h2>
              <p className="mt-1 text-muted-foreground">
                Fill in the details specific to your certificate type and upload required documents.
              </p>
            </div>

            {/* ─── Group A: Sick Leave / WFH / Unfit to Work / Unfit to Travel ─── */}
            {certGroup === "A" && (
              <div className="space-y-6 rounded-xl border p-6">
                <h3 className="font-semibold">Medical Certificate Details</h3>

                {/* Medical Problem */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Details of Medical Problem{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.medicalProblem}
                    onChange={(e) =>
                      updateFormData({
                        medicalProblem: e.target.value as typeof formData.medicalProblem,
                      })
                    }
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select medical problem</option>
                    {MEDICAL_PROBLEMS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                  <FieldError error={validationErrors.medicalProblem} />
                  {formData.medicalProblem === "other" && (
                    <textarea
                      value={formData.medicalProblemOther}
                      onChange={(e) =>
                        updateFormData({ medicalProblemOther: e.target.value })
                      }
                      className="mt-2 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      rows={3}
                      placeholder="Please describe your medical problem..."
                    />
                  )}
                </div>

                {/* Leave Duration */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    How many days of leave / WFH / medical note do you need?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.leaveDuration}
                    onChange={(e) =>
                      updateFormData({
                        leaveDuration: e.target.value as typeof formData.leaveDuration,
                      })
                    }
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select duration</option>
                    {LEAVE_DURATIONS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                  <FieldError error={validationErrors.leaveDuration} />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {LEAVE_DURATION_MESSAGE}
                  </p>
                  {formData.leaveDuration === "other" && (
                    <textarea
                      value={formData.leaveDurationOther}
                      onChange={(e) =>
                        updateFormData({ leaveDurationOther: e.target.value })
                      }
                      className="mt-2 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      rows={2}
                      placeholder="Specify the duration needed..."
                    />
                  )}
                </div>

                {/* Certificate Start Date */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Certificate Start Date{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.certificateStartDate}
                    onChange={(e) =>
                      updateFormData({ certificateStartDate: e.target.value })
                    }
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <FieldError error={validationErrors.certificateStartDate} />
                </div>
              </div>
            )}

            {/* ─── Group B: Fitness / Recovery / Fit-to-Fly ─── */}
            {certGroup === "B" && (
              <div className="space-y-6 rounded-xl border p-6">
                <h3 className="font-semibold">Fitness Assessment Details</h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Height (cm) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) =>
                        updateFormData({ height: e.target.value })
                      }
                      className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="e.g. 170"
                      min={50}
                      max={250}
                    />
                    <FieldError error={validationErrors.height} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Weight (kg) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) =>
                        updateFormData({ weight: e.target.value })
                      }
                      className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="e.g. 70"
                      min={10}
                      max={300}
                    />
                    <FieldError error={validationErrors.weight} />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.bpPulseDeclaration}
                      onChange={(e) =>
                        updateFormData({
                          bpPulseDeclaration: e.target.checked,
                        })
                      }
                      className="mt-0.5 h-4 w-4 accent-primary"
                    />
                    <span className="text-sm">
                      I declare that I will provide a photo of my BP/Pulse
                      reading if requested by the doctor during consultation.{" "}
                      <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <FieldError error={validationErrors.bpPulseDeclaration} />

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.walkingVideoDeclaration}
                      onChange={(e) =>
                        updateFormData({
                          walkingVideoDeclaration: e.target.checked,
                        })
                      }
                      className="mt-0.5 h-4 w-4 accent-primary"
                    />
                    <span className="text-sm">
                      I declare that I will provide a 15-second walking video if
                      requested by the doctor during consultation.{" "}
                      <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <FieldError
                    error={validationErrors.walkingVideoDeclaration}
                  />
                </div>
              </div>
            )}

            {/* ─── Group C: Caretaker ─── */}
            {certGroup === "C" && (
              <div className="space-y-6">
                {/* Medical details — same as Group A */}
                <div className="space-y-6 rounded-xl border p-6">
                  <h3 className="font-semibold">Patient Medical Details</h3>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Details of Medical Problem{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.medicalProblem}
                      onChange={(e) =>
                        updateFormData({
                          medicalProblem: e.target.value as typeof formData.medicalProblem,
                        })
                      }
                      className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Select medical problem</option>
                      {MEDICAL_PROBLEMS.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <FieldError error={validationErrors.medicalProblem} />
                    {formData.medicalProblem === "other" && (
                      <textarea
                        value={formData.medicalProblemOther}
                        onChange={(e) =>
                          updateFormData({
                            medicalProblemOther: e.target.value,
                          })
                        }
                        className="mt-2 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        rows={3}
                        placeholder="Please describe the medical problem..."
                      />
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      How many days of leave needed?{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.leaveDuration}
                      onChange={(e) =>
                        updateFormData({
                          leaveDuration: e.target.value as typeof formData.leaveDuration,
                        })
                      }
                      className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Select duration</option>
                      {LEAVE_DURATIONS.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                    <FieldError error={validationErrors.leaveDuration} />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {LEAVE_DURATION_MESSAGE}
                    </p>
                    {formData.leaveDuration === "other" && (
                      <textarea
                        value={formData.leaveDurationOther}
                        onChange={(e) =>
                          updateFormData({
                            leaveDurationOther: e.target.value,
                          })
                        }
                        className="mt-2 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        rows={2}
                        placeholder="Specify the duration needed..."
                      />
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Certificate Start Date{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.certificateStartDate}
                      onChange={(e) =>
                        updateFormData({
                          certificateStartDate: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <FieldError
                      error={validationErrors.certificateStartDate}
                    />
                  </div>
                </div>

                {/* Caretaker-specific section */}
                <div className="space-y-6 rounded-xl border p-6">
                  <h3 className="font-semibold">Caretaker Details</h3>
                  <p className="text-xs text-muted-foreground">
                    Note: The consulting doctor may request to speak with the
                    patient, ask for a 15-second patient video, or initiate a
                    video call, as per their discretion.
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Caretaker First Name{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.caretakerFirstName}
                        onChange={(e) =>
                          updateFormData({
                            caretakerFirstName: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="First name"
                      />
                      <FieldError
                        error={validationErrors.caretakerFirstName}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Caretaker Last Name{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.caretakerLastName}
                        onChange={(e) =>
                          updateFormData({
                            caretakerLastName: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="Last name"
                      />
                      <FieldError
                        error={validationErrors.caretakerLastName}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Date of Birth (18+){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.caretakerDob}
                        onChange={(e) =>
                          updateFormData({ caretakerDob: e.target.value })
                        }
                        max={maxDob18}
                        className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                      <FieldError error={validationErrors.caretakerDob} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Relationship with Patient{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-4 pt-1">
                        {CARETAKER_RELATIONSHIPS.map((rel) => (
                          <label
                            key={rel.value}
                            className="flex items-center gap-2 text-sm"
                          >
                            <input
                              type="radio"
                              name="caretakerRelationship"
                              value={rel.value}
                              checked={
                                formData.caretakerRelationship === rel.value
                              }
                              onChange={(e) =>
                                updateFormData({
                                  caretakerRelationship: e.target.value as typeof formData.caretakerRelationship,
                                })
                              }
                              className="h-4 w-4 accent-primary"
                            />
                            {rel.label}
                          </label>
                        ))}
                      </div>
                      <FieldError
                        error={validationErrors.caretakerRelationship}
                      />
                    </div>
                  </div>

                  {/* Caretaker Address */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Caretaker Address</h4>
                    <input
                      type="text"
                      value={formData.caretakerStreet}
                      onChange={(e) =>
                        updateFormData({ caretakerStreet: e.target.value })
                      }
                      className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Street address"
                    />
                    <FieldError error={validationErrors.caretakerStreet} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <input
                          type="text"
                          value={formData.caretakerCity}
                          onChange={(e) =>
                            updateFormData({ caretakerCity: e.target.value })
                          }
                          className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          placeholder="City"
                        />
                        <FieldError error={validationErrors.caretakerCity} />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={formData.caretakerState}
                          onChange={(e) =>
                            updateFormData({ caretakerState: e.target.value })
                          }
                          className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          placeholder="State / Region"
                        />
                        <FieldError error={validationErrors.caretakerState} />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <input
                          type="text"
                          value={formData.caretakerPostalCode}
                          onChange={(e) =>
                            updateFormData({
                              caretakerPostalCode: e.target.value,
                            })
                          }
                          maxLength={10}
                          className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          placeholder="Postal / ZIP code"
                        />
                        <FieldError
                          error={validationErrors.caretakerPostalCode}
                        />
                      </div>
                      <div>
                        <select
                          value={formData.caretakerCountry}
                          onChange={(e) =>
                            updateFormData({
                              caretakerCountry: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <FieldError
                          error={validationErrors.caretakerCountry}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Caretaker Govt ID */}
                  <FileUploadField
                    label="Government ID Proof of Caretaker"
                    required
                    value={formData.caretakerGovtIdUrl}
                    onChange={(url) =>
                      updateFormData({ caretakerGovtIdUrl: url })
                    }
                    category="caretakerGovtId"
                    hint="Upload PDF or image of caretaker's government ID"
                  />
                  <FieldError error={validationErrors.caretakerGovtIdUrl} />
                </div>
              </div>
            )}

            {/* ─── Group D: Medical Diagnosis ─── */}
            {certGroup === "D" && (
              <div className="space-y-6 rounded-xl border p-6">
                <h3 className="font-semibold">Diagnosis Certificate Details</h3>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Certificate Start Date{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.certificateStartDate}
                    onChange={(e) =>
                      updateFormData({ certificateStartDate: e.target.value })
                    }
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <FieldError error={validationErrors.certificateStartDate} />
                </div>
              </div>
            )}

            {/* ─── Common: Government ID Upload ─── */}
            <div className="space-y-6 rounded-xl border p-6">
              <h3 className="font-semibold">Documents</h3>

              {/* Govt ID Upload */}
              <FileUploadField
                label="Government ID Proof"
                required
                value={formData.govtIdProofUrl}
                onChange={(url) => updateFormData({ govtIdProofUrl: url })}
                category="idProof"
                hint="Upload PDF or image of your government-issued ID (Aadhaar, PAN, Passport, etc.)"
              />
              <FieldError error={validationErrors.govtIdProofUrl} />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={handlePrevStep}
                className="inline-flex items-center gap-2 rounded-xl border px-6 py-2.5 text-sm font-semibold hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                onClick={handleNextStep}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Eye className="h-4 w-4" /> View Details & Payment
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 3: Review Details & Payment ─── */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold">Review Details & Payment</h2>
              <p className="mt-1 text-muted-foreground">
                Review the details you provided, then choose your document format and complete payment.
              </p>
            </div>

            {/* Login prompt for unauthenticated users */}
            {!authLoading && !isAuthenticated && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-6 flex flex-col items-center gap-4 text-center">
                <ShieldCheck className="h-12 w-12 text-amber-500" />
                <h3 className="text-lg font-semibold">Login Required to Complete Payment</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  You&apos;re almost there! Please log in or create an account to submit your application and complete payment. Your filled details will be preserved.
                </p>
                <Link
                  href={`/login?redirect=${encodeURIComponent("/certificates/apply?type=" + (ALL_CERTIFICATE_TYPES.find(c => c.enumValue === formData.certificateType)?.slug || ""))}`}
                  className="mt-1 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <ShieldCheck className="h-4 w-4" /> Login to Continue
                </Link>
              </div>
            )}

            {/* ─── Application Preview ─── */}
            <div className="space-y-6">
              {/* Certificate Type */}
              <div className="rounded-xl border p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">Certificate Type</h3>
                  <button
                    onClick={() => setCurrentStep(0)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-sm">{getLabelFromEnum(formData.certificateType)}</p>
              </div>

              {/* Personal Details */}
              <div className="rounded-xl border p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">Personal Details</h3>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                  <div>
                    <span className="text-muted-foreground">Name:</span>{" "}
                    <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>{" "}
                    <span className="font-medium">{formData.phoneNumber}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Gender:</span>{" "}
                    <span className="font-medium capitalize">{formData.gender}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date of Birth:</span>{" "}
                    <span className="font-medium">{formData.dateOfBirth}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Guardian:</span>{" "}
                    <span className="font-medium capitalize">{formData.guardianRelationship} — {formData.guardianName}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-muted-foreground">Address:</span>{" "}
                    <span className="font-medium">
                      {formData.street}, {formData.city}, {formData.state} {formData.postalCode}, {formData.country}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Organization:</span>{" "}
                    <span className="font-medium">{formData.organizationName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Org. Location:</span>{" "}
                    <span className="font-medium capitalize">{formData.organizationLocatedIn?.replace("_", " ")}</span>
                  </div>
                </div>
              </div>

              {/* Certificate-specific Details */}
              <div className="rounded-xl border p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">Certificate Details</h3>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                  {/* Group A fields */}
                  {(certGroup === "A" || certGroup === "C") && (
                    <>
                      <div>
                        <span className="text-muted-foreground">Medical Problem:</span>{" "}
                        <span className="font-medium capitalize">
                          {formData.medicalProblem === "other"
                            ? formData.medicalProblemOther || "Other"
                            : MEDICAL_PROBLEMS.find((p) => p.value === formData.medicalProblem)?.label || formData.medicalProblem}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Leave Duration:</span>{" "}
                        <span className="font-medium">
                          {formData.leaveDuration === "other"
                            ? formData.leaveDurationOther || "Other"
                            : LEAVE_DURATIONS.find((d) => d.value === formData.leaveDuration)?.label || formData.leaveDuration}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Start Date:</span>{" "}
                        <span className="font-medium">{formData.certificateStartDate}</span>
                      </div>
                    </>
                  )}

                  {/* Group B fields */}
                  {certGroup === "B" && (
                    <>
                      <div>
                        <span className="text-muted-foreground">Height:</span>{" "}
                        <span className="font-medium">{formData.height} cm</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Weight:</span>{" "}
                        <span className="font-medium">{formData.weight} kg</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">BP/Pulse Declaration:</span>{" "}
                        <span className="font-medium">{formData.bpPulseDeclaration ? "Yes" : "No"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Walking Video Declaration:</span>{" "}
                        <span className="font-medium">{formData.walkingVideoDeclaration ? "Yes" : "No"}</span>
                      </div>
                    </>
                  )}

                  {/* Group C extra — caretaker details */}
                  {certGroup === "C" && (
                    <>
                      <div className="sm:col-span-2 mt-2 pt-2 border-t">
                        <span className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Caretaker Details</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Caretaker Name:</span>{" "}
                        <span className="font-medium">{formData.caretakerFirstName} {formData.caretakerLastName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">DOB:</span>{" "}
                        <span className="font-medium">{formData.caretakerDob}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Relationship:</span>{" "}
                        <span className="font-medium capitalize">{formData.caretakerRelationship}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-muted-foreground">Address:</span>{" "}
                        <span className="font-medium">
                          {formData.caretakerStreet}, {formData.caretakerCity}, {formData.caretakerState} {formData.caretakerPostalCode}, {formData.caretakerCountry}
                        </span>
                      </div>
                    </>
                  )}

                  {/* Group D fields */}
                  {certGroup === "D" && (
                    <div>
                      <span className="text-muted-foreground">Start Date:</span>{" "}
                      <span className="font-medium">{formData.certificateStartDate}</span>
                    </div>
                  )}

                  {/* Government ID */}
                  <div>
                    <span className="text-muted-foreground">Government ID:</span>{" "}
                    <span className="font-medium text-green-600">Uploaded ✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Payment Selection ─── */}
            <div className="space-y-6 rounded-xl border p-6">
              <h3 className="font-semibold">Choose Format & Pay</h3>

              {/* Document Format */}
              <DocumentFormatSelector
                value={formData.documentFormat as DocumentFormat | ""}
                onChange={(format) =>
                  updateFormData({
                    documentFormat: format,
                    paymentTier: "", // Reset tier when format changes
                  })
                }
              />
              <FieldError error={validationErrors.documentFormat} />

              {/* Payment Tier */}
              <PaymentTierSelector
                selectedTier={formData.paymentTier as PaymentTierId | ""}
                documentFormat={formData.documentFormat as DocumentFormat | ""}
                onSelect={(tierId) =>
                  updateFormData({ paymentTier: tierId })
                }
              />
              <FieldError error={validationErrors.paymentTier} />

              {/* Special Attestation */}
              <SpecialAttestationField
                requested={formData.specialFormatAttestation}
                onRequestedChange={(v) =>
                  updateFormData({ specialFormatAttestation: v })
                }
                fileUrl={formData.specialFormatFileUrl}
                onFileChange={(url) =>
                  updateFormData({ specialFormatFileUrl: url })
                }
                documentFormat={formData.documentFormat}
              />

              {/* Coupon */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Coupon Code{" "}
                  <span className="text-xs text-muted-foreground">
                    (optional)
                  </span>
                </label>
                {coupon?.valid ? (
                  <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 dark:border-green-800 dark:bg-green-900/20">
                    <Tag className="h-4 w-4 text-green-600" />
                    <span className="flex-1 text-sm font-medium text-green-700 dark:text-green-400">
                      {coupon.couponCode} applied — ₹
                      {couponDiscount} off
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="rounded p-1 text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-800/30"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) =>
                        setCouponInput(e.target.value.toUpperCase())
                      }
                      className="flex-1 rounded-lg border bg-background px-3 py-2.5 text-sm uppercase outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Enter coupon code"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponInput.trim()}
                      className="rounded-lg bg-muted px-4 py-2.5 text-sm font-medium hover:bg-muted/80 disabled:opacity-50"
                    >
                      {couponLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <PriceBreakdown
                paymentTier={formData.paymentTier as PaymentTierId | ""}
                documentFormat={
                  (formData.documentFormat as DocumentFormat) || "digital"
                }
                specialFormatRequested={formData.specialFormatAttestation}
                couponDiscount={couponDiscount}
                couponCode={coupon?.valid ? coupon.couponCode : ""}
              />

              {/* Terms */}
              <TermsCheckbox
                checked={formData.termsAccepted}
                onChange={(checked) =>
                  updateFormData({ termsAccepted: checked })
                }
              />
              <FieldError error={validationErrors.termsAccepted} />
            </div>

            {/* Navigation + Pay */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={handlePrevStep}
                className="inline-flex items-center gap-2 rounded-xl border px-6 py-2.5 text-sm font-semibold hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                onClick={handlePayAndSubmit}
                disabled={
                  submitting ||
                  paying ||
                  !isAuthenticated ||
                  !formData.termsAccepted ||
                  !formData.paymentTier ||
                  !formData.documentFormat ||
                  !formData.govtIdProofUrl
                }
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : paying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Processing
                    Payment...
                  </>
                ) : (
                  <>Pay ₹{finalAmount} Now</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Login Required Dialog ─── */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader className="items-center text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-xl">Login to Continue</DialogTitle>
            <DialogDescription className="text-center">
              Please log in or create an account to proceed with your certificate application. Your selected certificate will be preserved.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex flex-col gap-3">
            <Link
              href={`/login?redirect=${encodeURIComponent("/certificates/apply?type=" + (ALL_CERTIFICATE_TYPES.find(c => c.enumValue === formData.certificateType)?.slug || ""))}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ShieldCheck className="h-4 w-4" /> Login
            </Link>
            <Link
              href={`/register?redirect=${encodeURIComponent("/certificates/apply?type=" + (ALL_CERTIFICATE_TYPES.find(c => c.enumValue === formData.certificateType)?.slug || ""))}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary px-6 py-3 font-semibold text-primary hover:bg-primary/5 transition-colors"
            >
              Create Account
            </Link>
            <button
              onClick={() => setShowLoginDialog(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
