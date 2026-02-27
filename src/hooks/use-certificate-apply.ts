"use client";

import { useState, useCallback, useMemo } from "react";
import api from "@/lib/api";
import type {
  CertificateApplyFormData,
  CouponValidation,
  RazorpayOrderData,
} from "@/types";
import {
  PAYMENT_OPTIONS,
  SPECIAL_FORMAT_FEE,
  getCertificateGroup,
} from "@/lib/certificate-types";
import {
  personalDetailsSchema,
  groupADetailsSchema,
  groupBDetailsSchema,
  caretakerDetailsSchema,
  groupDDetailsSchema,
  paymentSectionSchema,
} from "@/lib/schemas/certificate-apply";

// Declare Razorpay on window for TS
declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: () => void) => void;
    };
  }
}

const INITIAL_FORM_DATA: CertificateApplyFormData = {
  // Step 0 — Certificate type
  certificateType: "sick_leave",
  // Step 1 — Personal
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  otpVerified: false,
  guardianRelationship: "",
  guardianName: "",
  gender: "",
  dateOfBirth: "",
  age: 0,
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  organizationName: "",
  organizationLocatedIn: "",
  // Step 2 — Group A
  medicalProblem: "",
  medicalProblemOther: "",
  leaveDuration: "",
  leaveDurationOther: "",
  certificateStartDate: "",
  // Step 2 — Group B
  height: "",
  weight: "",
  bpPulseDeclaration: false,
  walkingVideoDeclaration: false,
  // Step 2 — Group C (caretaker)
  caretakerFirstName: "",
  caretakerLastName: "",
  caretakerDob: "",
  caretakerRelationship: "",
  caretakerStreet: "",
  caretakerCity: "",
  caretakerState: "",
  caretakerPostalCode: "",
  caretakerCountry: "India",
  caretakerGovtIdUrl: "",
  // Travel
  travelDate: "",
  travelDestination: "",
  // Common payment & document
  govtIdProofUrl: "",
  specialFormatAttestation: false,
  specialFormatFileUrl: "",
  documentFormat: "digital",
  paymentTier: "",
  termsAccepted: false,
  totalAmount: 0,
};

export function useCertificateApply() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Form data
  const [formData, setFormData] =
    useState<CertificateApplyFormData>(INITIAL_FORM_DATA);

  // Payment state
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [coupon, setCoupon] = useState<CouponValidation | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Derived price
  const selectedTier = useMemo(
    () => PAYMENT_OPTIONS.find((t) => t.id === formData.paymentTier),
    [formData.paymentTier]
  );

  const baseFee = selectedTier?.price ?? 0;
  const specialFee =
    formData.specialFormatAttestation && formData.documentFormat === "handwritten"
      ? SPECIAL_FORMAT_FEE
      : 0;
  const couponDiscount =
    coupon?.valid ? coupon.originalAmount - coupon.discountedAmount : 0;
  const finalAmount = Math.max(0, baseFee + specialFee - couponDiscount);

  const certGroup = useMemo(
    () => getCertificateGroup(formData.certificateType),
    [formData.certificateType]
  );

  // ─── Helpers ────────────────────────────────────────

  const updateFormData = useCallback(
    (updates: Partial<CertificateApplyFormData>) => {
      setFormData((prev) => ({ ...prev, ...updates }));
      // Clear validation errors for updated fields
      setValidationErrors((prev) => {
        const next = { ...prev };
        for (const key of Object.keys(updates)) delete next[key];
        return next;
      });
    },
    []
  );

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  // ─── Validation ─────────────────────────────────────

  const validateStep = useCallback(
    (step: number): boolean => {
      setValidationErrors({});

      if (step === 0) {
        return !!formData.certificateType;
      }

      if (step === 1) {
        const result = personalDetailsSchema.safeParse(formData);
        if (!result.success) {
          const errs: Record<string, string> = {};
          for (const issue of result.error.issues) {
            const key = issue.path.join(".");
            if (!errs[key]) errs[key] = issue.message;
          }
          setValidationErrors(errs);
          return false;
        }
        return true;
      }

      if (step === 2) {
        // Validate certificate-specific fields + govt ID upload
        let certValid = true;
        const group = getCertificateGroup(formData.certificateType);
        let certResult;
        if (group === "A") {
          certResult = groupADetailsSchema.safeParse(formData);
        } else if (group === "B") {
          certResult = groupBDetailsSchema.safeParse(formData);
        } else if (group === "C") {
          certResult = caretakerDetailsSchema.safeParse(formData);
        } else {
          certResult = groupDDetailsSchema.safeParse(formData);
        }
        if (certResult && !certResult.success) {
          const errs: Record<string, string> = {};
          for (const issue of certResult.error.issues) {
            const key = issue.path.join(".");
            if (!errs[key]) errs[key] = issue.message;
          }
          setValidationErrors((prev) => ({ ...prev, ...errs }));
          certValid = false;
        }

        // Validate govt ID upload
        if (!formData.govtIdProofUrl) {
          setValidationErrors((prev) => ({
            ...prev,
            govtIdProofUrl: "Government ID proof is required",
          }));
          certValid = false;
        }

        return certValid;
      }

      if (step === 3) {
        // Validate payment section
        const payResult = paymentSectionSchema.safeParse(formData);
        if (!payResult.success) {
          const errs: Record<string, string> = {};
          for (const issue of payResult.error.issues) {
            const key = issue.path.join(".");
            if (!errs[key]) errs[key] = issue.message;
          }
          setValidationErrors(errs);
          return false;
        }
        return true;
      }

      return true;
    },
    [formData]
  );

  // ─── Coupon ─────────────────────────────────────────

  const applyCoupon = useCallback(
    async (couponCode: string) => {
      try {
        setCouponLoading(true);
        setError(null);
        const tierPrice = baseFee + specialFee;
        const res = await api.post("/payments/apply-coupon", {
          couponCode,
          amount: tierPrice,
        });
        setCoupon(res.data.data);
        return res.data.data as CouponValidation;
      } catch {
        setError("Failed to apply coupon");
        return null;
      } finally {
        setCouponLoading(false);
      }
    },
    [baseFee, specialFee]
  );

  const removeCoupon = useCallback(() => {
    setCoupon(null);
  }, []);

  // ─── Submit ─────────────────────────────────────────

  const submitApplication = useCallback(async () => {
    try {
      setSubmitting(true);
      setError(null);

      const res = await api.post("/certificates/apply", {
        certificateType: formData.certificateType,
        formData: {
          ...formData,
          totalAmount: finalAmount,
        },
      });

      const appId = res.data.data.id;
      setApplicationId(appId);
      return appId as string;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to submit application";
      setError(msg);
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [formData, finalAmount]);

  // ─── Payment ────────────────────────────────────────

  const initiatePayment = useCallback(
    async (appId: string) => {
      try {
        setPaying(true);
        setError(null);

        // Create order — server recalculates price from paymentTier
        const orderRes = await api.post("/payments/create-order", {
          applicationId: appId,
          amount: finalAmount,
          paymentTier: formData.paymentTier,
          specialFormatRequested: formData.specialFormatAttestation,
          couponCode: coupon?.valid ? coupon.couponCode : undefined,
          discount: couponDiscount,
        });

        const orderData: RazorpayOrderData = orderRes.data.data;

        // Open Razorpay checkout
        return new Promise<boolean>((resolve) => {
          if (typeof window === "undefined" || !window.Razorpay) {
            setError("Razorpay SDK not loaded. Please refresh and try again.");
            setPaying(false);
            resolve(false);
            return;
          }

          const displayName = `${formData.firstName} ${formData.lastName}`.trim();

          const rzp = new window.Razorpay({
            key: orderData.key,
            amount: Math.round(orderData.amount * 100),
            currency: orderData.currency,
            name: "MediProofDocs",
            description: `Certificate — ${formData.certificateType.replace(/_/g, " ")}`,
            order_id: orderData.orderId,
            handler: async (response: {
              razorpay_order_id: string;
              razorpay_payment_id: string;
              razorpay_signature: string;
            }) => {
              try {
                await api.post("/payments/verify", {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                });
                setPaymentComplete(true);
                setPaying(false);
                resolve(true);
              } catch {
                setError("Payment verification failed. Contact support.");
                setPaying(false);
                resolve(false);
              }
            },
            prefill: {
              name: displayName,
              email: formData.email,
              contact: formData.phoneNumber,
            },
            theme: { color: "#16a34a" },
            modal: {
              ondismiss: () => {
                setPaying(false);
                resolve(false);
              },
            },
          });

          rzp.open();
        });
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to initiate payment";
        setError(msg);
        setPaying(false);
        return false;
      }
    },
    [
      finalAmount,
      coupon,
      couponDiscount,
      formData.certificateType,
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.phoneNumber,
      formData.paymentTier,
      formData.specialFormatAttestation,
    ]
  );

  return {
    currentStep,
    formData,
    applicationId,
    coupon,
    baseFee,
    specialFee,
    couponDiscount,
    finalAmount,
    certGroup,
    selectedTier,
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
  };
}
