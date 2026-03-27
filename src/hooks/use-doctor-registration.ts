"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";

export interface DoctorRegistrationFormData {
  // Profile Information
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  profilePhotoUrl: string;

  // Professional Credentials
  registrationNumber: string;
  medicalCouncil: string;
  registrationYear: string;
  specialization: string;
  qualification: string;
  experience: string;

  // Practice Details
  hospitalAffiliation: string;
  address: string;
  city: string;
  state: string;
  pincode: string;

  // Documents
  medicalLicenseUrl: string;
  govtIdProofUrl: string;
  degreeCertificateUrl: string;
  signatureUrl: string;

  // About
  bio: string;

  // Account Security
  password: string;
  confirmPassword: string;

  // Terms Acceptance
  serviceAgreementAccepted: boolean;
  ethicsAccepted: boolean;
  dataProtectionAccepted: boolean;
  platformTermsAccepted: boolean;
}

export interface ValidationErrors {
  [key: string]: string;
}

const initialFormData: DoctorRegistrationFormData = {
  fullName: "",
  email: "",
  phoneNumber: "",
  gender: "",
  dateOfBirth: "",
  profilePhotoUrl: "",
  registrationNumber: "",
  medicalCouncil: "",
  registrationYear: "",
  specialization: "",
  qualification: "",
  experience: "",
  hospitalAffiliation: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  medicalLicenseUrl: "",
  govtIdProofUrl: "",
  degreeCertificateUrl: "",
  signatureUrl: "",
  bio: "",
  password: "",
  confirmPassword: "",
  serviceAgreementAccepted: false,
  ethicsAccepted: false,
  dataProtectionAccepted: false,
  platformTermsAccepted: false,
};

export function useDoctorRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState<DoctorRegistrationFormData>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = useCallback(
    (updates: Partial<DoctorRegistrationFormData>) => {
      setFormData((prev) => ({ ...prev, ...updates }));
      // Clear validation errors for updated fields
      const updatedKeys = Object.keys(updates);
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        updatedKeys.forEach((key) => delete newErrors[key]);
        return newErrors;
      });
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    // Profile Information
    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    }
    if (!formData.gender) {
      errors.gender = "Please select your gender";
    }

    // Professional Credentials
    if (!formData.registrationNumber.trim()) {
      errors.registrationNumber = "Registration number is required";
    }
    if (!formData.medicalCouncil) {
      errors.medicalCouncil = "Please select your medical council";
    }
    if (!formData.specialization) {
      errors.specialization = "Specialization is required";
    }
    if (!formData.qualification) {
      errors.qualification = "Qualification is required";
    }
    if (!formData.experience.trim()) {
      errors.experience = "Experience is required";
    } else if (isNaN(parseInt(formData.experience)) || parseInt(formData.experience) < 0) {
      errors.experience = "Please enter valid years of experience";
    }

    // Documents
    if (!formData.medicalLicenseUrl) {
      errors.medicalLicenseUrl = "Medical license document is required";
    }
    if (!formData.govtIdProofUrl) {
      errors.govtIdProofUrl = "Government ID proof is required";
    }
    if (!formData.degreeCertificateUrl) {
      errors.degreeCertificateUrl = "Degree certificate is required";
    }
    if (!formData.signatureUrl) {
      errors.signatureUrl = "Signature is required";
    }

    // Account Security
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Terms Acceptance
    if (!formData.serviceAgreementAccepted) {
      errors.serviceAgreementAccepted = "Please accept the service agreement";
    }
    if (!formData.ethicsAccepted) {
      errors.ethicsAccepted = "Please accept the code of ethics";
    }
    if (!formData.dataProtectionAccepted) {
      errors.dataProtectionAccepted = "Please accept the data protection agreement";
    }
    if (!formData.platformTermsAccepted) {
      errors.platformTermsAccepted = "Please accept the platform terms";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const submitRegistration = useCallback(async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      // Scroll to first error
      const firstErrorKey = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstErrorKey);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return false;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber || undefined,
        profilePhotoUrl: formData.profilePhotoUrl || undefined,
        gender: formData.gender || undefined,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : undefined,
        bio: formData.bio || undefined,
        registrationNumber: formData.registrationNumber,
        medicalCouncil: formData.medicalCouncil || undefined,
        registrationYear: formData.registrationYear ? parseInt(formData.registrationYear, 10) || undefined : undefined,
        specialization: formData.specialization,
        qualification: formData.qualification,
        experience: parseInt(formData.experience, 10) || 0,
        hospitalAffiliation: formData.hospitalAffiliation || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        pincode: formData.pincode || undefined,
        medicalLicenseUrl: formData.medicalLicenseUrl || undefined,
        govtIdProofUrl: formData.govtIdProofUrl || undefined,
        degreeCertificateUrl: formData.degreeCertificateUrl || undefined,
        signatureUrl: formData.signatureUrl || undefined,
        termsAccepted: true,
      };

      await api.post("/auth/doctor/register", payload);
      toast.success("Registration submitted successfully!");
      router.push(`/doctor/pending-approval?email=${encodeURIComponent(formData.email)}`);
      return true;
    } catch (error: unknown) {
      const { getErrorMessage } = await import("@/lib/utils");
      toast.error(getErrorMessage(error, "Registration failed. Please try again."));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, validationErrors, router]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setValidationErrors({});
  }, []);

  return {
    formData,
    validationErrors,
    isSubmitting,
    updateFormData,
    validateForm,
    submitRegistration,
    resetForm,
  };
}
