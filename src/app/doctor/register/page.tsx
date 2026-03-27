"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import {
  DOCTOR_SERVICE_AGREEMENT,
  INDIAN_MEDICAL_COUNCILS,
} from "@/lib/doctor-terms";

// ============ Signature Pad Component ============
function SignaturePad({
  value,
  onChange,
}: {
  value: string;
  onChange: (dataUrl: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set drawing styles
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Draw baseline
    ctx.beginPath();
    ctx.strokeStyle = "#ccc";
    ctx.moveTo(10, canvas.height - 20);
    ctx.lineTo(canvas.width - 10, canvas.height - 20);
    ctx.stroke();
    ctx.strokeStyle = "#000";
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        onChange(canvas.toDataURL("image/png"));
      }
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw baseline
    ctx.beginPath();
    ctx.strokeStyle = "#ccc";
    ctx.moveTo(10, canvas.height - 20);
    ctx.lineTo(canvas.width - 10, canvas.height - 20);
    ctx.stroke();
    ctx.strokeStyle = "#000";

    setHasSignature(false);
    onChange("");
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-28 border border-gray-300 rounded cursor-crosshair bg-white"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasSignature && (
          <span className="absolute left-3 top-3 text-gray-400 text-sm pointer-events-none">
            Draw your signature...
          </span>
        )}
        <button
          type="button"
          onClick={clearSignature}
          className="absolute right-2 top-2 text-sm text-blue-600 hover:text-blue-800"
        >
          [Clear]
        </button>
      </div>
    </div>
  );
}

// ============ File Upload with Drag & Drop + Preview ============
function FileUploadField({
  label,
  required,
  value,
  onChange,
  category,
  accept = "image/*,application/pdf",
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (url: string) => void;
  category: string;
  accept?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileType, setFileType] = useState<"image" | "pdf" | "other">("other");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true);
    setFileName(file.name);
    
    // Determine file type for preview
    if (file.type.startsWith("image/")) {
      setFileType("image");
    } else if (file.type === "application/pdf") {
      setFileType("pdf");
    } else {
      setFileType("other");
    }
    
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("key", `uploads/doctor-registration/${category}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`);
      fd.append("fileType", category); // For ImageKit folder mapping
      const res = await api.post("/upload/direct", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        onChange(res.data.data.url);
      }
    } catch {
      setFileName("");
      setFileType("other");
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }, [category, onChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setFileName("");
    setFileType("other");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Check if URL is an image
  const isImageUrl = value && (value.match(/\.(jpg|jpeg|png|gif|webp)$/i) || fileType === "image");

  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm font-medium text-[#1e3a5f]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* Upload Area */}
      {!value ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative flex items-center justify-between rounded-lg border-2 border-dashed ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          } bg-gray-50 px-4 py-4 cursor-pointer transition-all shadow-sm hover:shadow-md`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <Upload className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">
                {uploading ? "Uploading..." : "Click to upload or drag & drop"}
              </span>
              <p className="text-xs text-gray-500">
                {accept.includes("image") ? "PNG, JPG, PDF up to 5MB" : "PDF, DOC up to 5MB"}
              </p>
            </div>
          </div>
          {uploading && (
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        /* Preview Area */
        <div className="relative rounded-lg border border-gray-200 bg-gray-50 p-3 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Preview Thumbnail */}
            {isImageUrl ? (
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border bg-white">
                <img
                  src={value}
                  alt={fileName || "Preview"}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-red-50 border border-red-100">
                <svg className="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/>
                  <path d="M8 12h8v2H8v-2zm0 4h8v2H8v-2z"/>
                </svg>
              </div>
            )}
            
            {/* File Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {fileName || "Document uploaded"}
              </p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Uploaded successfully
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-200 transition-colors"
                title="View file"
              >
                <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </a>
              <button
                type="button"
                onClick={handleRemove}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-red-100 transition-colors"
                title="Remove file"
              >
                <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isDragging && !value && (
        <p className="mt-1 text-xs text-blue-600">Drop file here to upload</p>
      )}
    </div>
  );
}

// ============ Main Page Component ============
export default function DoctorRegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    prefix: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    profilePhotoUrl: "",
    email: "",
    countryCode: "+91",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    medicalCouncil: "",
    registrationYear: "",
    qualification: "",
    experience: "",
    hospitalAffiliation: "",
    specialization: "",
    registrationNumber: "",
    // Document uploads
    medicalLicenseUrl: "",
    govtIdProofUrl: "",
    degreeCertificateUrl: "",
    wantLeads: "",
    wantApp: "",
    termsAccepted: false,
    signatureDataUrl: "",
  });

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName || !formData.lastName) {
      toast.error("Please enter your full name");
      return;
    }
    if (!formData.gender) {
      toast.error("Please select your gender");
      return;
    }
    if (!formData.dateOfBirth) {
      toast.error("Please enter your date of birth");
      return;
    }
    // Age validation - minimum 18 years for doctors
    const dob = new Date(formData.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    if (age < 18) {
      toast.error("You must be at least 18 years old to register as a doctor");
      return;
    }
    if (age > 100) {
      toast.error("Please enter a valid date of birth");
      return;
    }
    if (!formData.email) {
      toast.error("Please enter your email");
      return;
    }
    if (!formData.phoneNumber) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!formData.specialization) {
      toast.error("Please enter your specialization");
      return;
    }
    if (!formData.registrationNumber) {
      toast.error("Please enter your registration number");
      return;
    }
    if (!formData.qualification) {
      toast.error("Please enter your qualification");
      return;
    }
    if (!formData.experience) {
      toast.error("Please enter your years of experience");
      return;
    }
    // Document validations
    if (!formData.medicalLicenseUrl) {
      toast.error("Please upload your medical license");
      return;
    }
    if (!formData.govtIdProofUrl) {
      toast.error("Please upload your government ID proof");
      return;
    }
    if (!formData.degreeCertificateUrl) {
      toast.error("Please upload your degree certificate");
      return;
    }
    if (!formData.termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    if (!formData.signatureDataUrl) {
      toast.error("Please provide your signature");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload signature as image
      let signatureUrl = "";
      if (formData.signatureDataUrl) {
        const blob = await fetch(formData.signatureDataUrl).then(r => r.blob());
        const signatureFile = new File([blob], "signature.png", { type: "image/png" });
        const fd = new FormData();
        fd.append("file", signatureFile);
        fd.append("key", `uploads/doctor-signatures/${Date.now()}_signature.png`);
        const res = await api.post("/upload/direct", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data.success) {
          signatureUrl = res.data.data.url;
        }
      }

      // Generate a secure temporary password (doctor will reset after approval)
      const tempPassword = `Doc${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}!`;
      
      const payload = {
        fullName: `${formData.prefix} ${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: tempPassword,
        phoneNumber: `${formData.countryCode}${formData.phoneNumber}`.replace(/\s/g, ""),
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        profilePhotoUrl: formData.profilePhotoUrl || undefined,
        address: `${formData.addressLine1}${formData.addressLine2 ? ", " + formData.addressLine2 : ""}`.trim() || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        pincode: formData.postalCode || undefined,
        specialization: formData.specialization,
        qualification: formData.qualification,
        experience: parseInt(formData.experience, 10) || 1,
        registrationNumber: formData.registrationNumber,
        medicalCouncil: formData.medicalCouncil || undefined,
        registrationYear: formData.registrationYear ? parseInt(formData.registrationYear, 10) : undefined,
        hospitalAffiliation: formData.hospitalAffiliation || undefined,
        // Document URLs
        medicalLicenseUrl: formData.medicalLicenseUrl,
        govtIdProofUrl: formData.govtIdProofUrl,
        degreeCertificateUrl: formData.degreeCertificateUrl,
        signatureUrl: signatureUrl || undefined,
        termsAccepted: true,
      };

      await api.post("/auth/doctor/register", payload);
      toast.success("Registration submitted successfully!");
      router.push(`/doctor/pending-approval?email=${encodeURIComponent(formData.email)}`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      prefix: "",
      firstName: "",
      lastName: "",
      gender: "",
      dateOfBirth: "",
      profilePhotoUrl: "",
      email: "",
      countryCode: "+91",
      phoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      medicalCouncil: "",
      registrationYear: "",
      qualification: "",
      experience: "",
      hospitalAffiliation: "",
      specialization: "",
      registrationNumber: "",
      medicalLicenseUrl: "",
      govtIdProofUrl: "",
      degreeCertificateUrl: "",
      wantLeads: "",
      wantApp: "",
      termsAccepted: false,
      signatureDataUrl: "",
    });
  };

  // Styles
  const labelClass = "mb-2 block text-sm font-medium text-[#1e3a5f]";
  const inputClass = "w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
  const selectClass = "w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
  const subLabelClass = "mt-1 text-xs text-gray-500";

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-normal text-[#1e3a5f]">Doctor Onboarding Form</h1>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl px-6 py-6">
        
        {/* ========== Profile Information ========== */}
        <div className="mb-8">
          <h2 className="mb-6 text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">
            Profile Information
          </h2>

          {/* Name of the Doctor */}
          <div className="mb-5">
            <label className={labelClass}>
              Name of the Doctor <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-[100px_1fr_1fr] gap-3">
              <div>
                <div className="relative">
                  <select
                    value={formData.prefix}
                    onChange={(e) => updateFormData({ prefix: e.target.value })}
                    className={selectClass}
                  >
                    <option value="">None</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Mrs.">Mrs.</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
                <p className={subLabelClass}>Prefix</p>
              </div>
              <div>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateFormData({ firstName: e.target.value })}
                  className={inputClass}
                />
                <p className={subLabelClass}>First Name</p>
              </div>
              <div>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateFormData({ lastName: e.target.value })}
                  className={inputClass}
                />
                <p className={subLabelClass}>Last Name</p>
              </div>
            </div>
          </div>

          {/* Profile Photo */}
          <FileUploadField
            label="Profile Photo"
            required
            value={formData.profilePhotoUrl}
            onChange={(url) => updateFormData({ profilePhotoUrl: url })}
            category="profilePhoto"
            accept="image/*"
          />

          {/* Gender */}
          <div className="mb-5">
            <label className={labelClass}>
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4 mt-2">
              {["Male", "Female", "Other"].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={formData.gender === option}
                    onChange={(e) => updateFormData({ gender: e.target.value })}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date of Birth */}
          <div className="mb-5">
            <label className={labelClass}>
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
              min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]}
              className={inputClass}
            />
            <p className="text-xs text-gray-500 mt-1">You must be at least 18 years old to register</p>
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className={labelClass}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Phone Number */}
          <div className="mb-5">
            <label className={labelClass}>
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative w-28">
                <div className="flex items-center gap-1 rounded-md border border-gray-300 px-2 py-2.5">
                  <span className="text-lg">🇮🇳</span>
                  <select
                    value={formData.countryCode}
                    onChange={(e) => updateFormData({ countryCode: e.target.value })}
                    className="appearance-none bg-transparent text-sm focus:outline-none"
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                  </select>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </div>
              </div>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
                placeholder="81234 56789"
                className={inputClass + " flex-1"}
              />
            </div>
          </div>

          {/* Address of Clinic/Work */}
          <div className="mb-5">
            <label className={labelClass}>
              Address of Clinic/Work <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => updateFormData({ addressLine1: e.target.value })}
                  className={inputClass}
                />
                <p className={subLabelClass}>Address Line 1</p>
              </div>
              <div>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => updateFormData({ addressLine2: e.target.value })}
                  className={inputClass}
                />
                <p className={subLabelClass}>Address Line 2</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateFormData({ city: e.target.value })}
                    className={inputClass}
                  />
                  <p className={subLabelClass}>City / District</p>
                </div>
                <div>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => updateFormData({ state: e.target.value })}
                    className={inputClass}
                  />
                  <p className={subLabelClass}>State / Province</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => updateFormData({ postalCode: e.target.value })}
                    className={inputClass}
                  />
                  <p className={subLabelClass}>Postal Code</p>
                </div>
                <div>
                  <div className="relative">
                    <select
                      value={formData.country}
                      onChange={(e) => updateFormData({ country: e.target.value })}
                      className={selectClass}
                    >
                      <option value="">-Select-</option>
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                  <p className={subLabelClass}>Country</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== Professional Information ========== */}
        <div className="mb-8">
          <h2 className="mb-6 text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">
            Professional Information
          </h2>

          {/* Specialization */}
          <div className="mb-5">
            <label className={labelClass}>
              Specialization <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => updateFormData({ specialization: e.target.value })}
              placeholder="e.g., General Medicine, Cardiology"
              className={inputClass}
            />
          </div>

          {/* Qualification */}
          <div className="mb-5">
            <label className={labelClass}>
              Qualification <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.qualification}
              onChange={(e) => updateFormData({ qualification: e.target.value })}
              placeholder="e.g., MBBS, MD, MS"
              className={inputClass}
            />
          </div>

          {/* Experience */}
          <div className="mb-5">
            <label className={labelClass}>
              Years of Experience <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              value={formData.experience}
              onChange={(e) => updateFormData({ experience: e.target.value })}
              placeholder="e.g., 5"
              className={inputClass}
            />
          </div>

          {/* Registration Number */}
          <div className="mb-5">
            <label className={labelClass}>
              Medical Registration Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.registrationNumber}
              onChange={(e) => updateFormData({ registrationNumber: e.target.value })}
              placeholder="e.g., MCI-12345"
              className={inputClass}
            />
          </div>

          {/* Medical Council */}
          <div className="mb-5">
            <label className={labelClass}>
              Medical Council
            </label>
            <div className="relative">
              <select
                value={formData.medicalCouncil}
                onChange={(e) => updateFormData({ medicalCouncil: e.target.value })}
                className={selectClass}
              >
                <option value="">-Select Medical Council-</option>
                {INDIAN_MEDICAL_COUNCILS.map((council) => (
                  <option key={council.value} value={council.value}>{council.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Registration Year */}
          <div className="mb-5">
            <label className={labelClass}>
              Registration Year
            </label>
            <input
              type="number"
              min="1950"
              max={new Date().getFullYear()}
              value={formData.registrationYear}
              onChange={(e) => updateFormData({ registrationYear: e.target.value })}
              placeholder="e.g., 2015"
              className={inputClass}
            />
          </div>

          {/* Hospital Affiliation */}
          <div className="mb-5">
            <label className={labelClass}>
              Hospital/Clinic Affiliation
            </label>
            <input
              type="text"
              value={formData.hospitalAffiliation}
              onChange={(e) => updateFormData({ hospitalAffiliation: e.target.value })}
              placeholder="e.g., Apollo Hospital, Delhi"
              className={inputClass}
            />
          </div>
        </div>

        {/* ========== Document Uploads ========== */}
        <div className="mb-8">
          <h2 className="mb-6 text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">
            Document Uploads
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Please upload the following documents for verification. All documents must be clear and legible.
          </p>

          {/* Medical License */}
          <FileUploadField
            label="Medical License / Registration Certificate"
            required
            value={formData.medicalLicenseUrl}
            onChange={(url) => updateFormData({ medicalLicenseUrl: url })}
            category="medicalLicense"
          />

          {/* Government ID Proof */}
          <FileUploadField
            label="Government ID Proof (Aadhaar/PAN/Passport)"
            required
            value={formData.govtIdProofUrl}
            onChange={(url) => updateFormData({ govtIdProofUrl: url })}
            category="govtIdProof"
          />

          {/* Degree Certificate */}
          <FileUploadField
            label="Degree Certificate"
            required
            value={formData.degreeCertificateUrl}
            onChange={(url) => updateFormData({ degreeCertificateUrl: url })}
            category="degreeCertificate"
          />
        </div>

        {/* ========== Preferences ========== */}
        <div className="mb-8">
          <h2 className="mb-6 text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">
            Preferences
          </h2>

          {/* Do you want to get leads/cases from us? */}
          <div className="mb-5">
            <label className={labelClass}>
              Do you want to get leads/cases from us? <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="wantLeads"
                  value="yes"
                  checked={formData.wantLeads === "yes"}
                  onChange={(e) => updateFormData({ wantLeads: e.target.value })}
                  className="h-4 w-4 border-gray-300 text-blue-600"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="wantLeads"
                  value="no"
                  checked={formData.wantLeads === "no"}
                  onChange={(e) => updateFormData({ wantLeads: e.target.value })}
                  className="h-4 w-4 border-gray-300 text-blue-600"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>

          {/* Are you looking for an app? */}
          <div className="mb-5">
            <label className={labelClass}>
              Are you looking for an app to run your own Medical Certificate business? <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="wantApp"
                  value="yes"
                  checked={formData.wantApp === "yes"}
                  onChange={(e) => updateFormData({ wantApp: e.target.value })}
                  className="h-4 w-4 border-gray-300 text-blue-600"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="wantApp"
                  value="no"
                  checked={formData.wantApp === "no"}
                  onChange={(e) => updateFormData({ wantApp: e.target.value })}
                  className="h-4 w-4 border-gray-300 text-blue-600"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>
        </div>

        {/* ========== Terms and Conditions ========== */}
        <div className="mb-8">
          <h2 className="mb-4 text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">
            Terms and Conditions
          </h2>
          
          <div className="h-64 overflow-y-auto border border-gray-200 bg-gray-50 p-4 mb-4 text-sm text-gray-700 leading-relaxed">
            <p className="mb-4">
              This agreement is made with effect from today between the Registered Medical Practitioner (RMP) ___ ___ and the company Arupal SuperDocs Technology LLP ("Company"). Following are the terms and conditions of this collaboration.
            </p>
            
            <h3 className="font-semibold mb-2">REGISTERED MEDICAL PRACTITIONER UNDERTAKING</h3>
            <p className="mb-4">
              The RMP agrees to provide medical consultation services through the Company's platform in accordance with applicable medical regulations and ethical standards.
            </p>

            <h3 className="font-semibold mb-2">Confidentiality</h3>
            <p className="mb-4">
              Both parties agree to maintain strict confidentiality regarding patient information, proprietary systems, and business practices disclosed during the course of this collaboration.
            </p>

            <h3 className="font-semibold mb-2">Intellectual Property</h3>
            <p className="mb-4">
              All intellectual property developed during the collaboration, including but not limited to software, documentation, and processes, shall remain the property of the Company unless otherwise agreed in writing.
            </p>

            <h3 className="font-semibold mb-2">Effects of Termination</h3>
            <p className="mb-2">Upon termination of this Agreement for any reason:</p>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>All rights granted to the RMP to access and use the System and Services shall immediately cease;</li>
              <li>The RMP shall immediately return or permanently delete, as instructed, any confidential or proprietary information belonging to the Intermediary;</li>
              <li>Each party shall promptly settle any outstanding financial obligations due to the other party as of the date of termination;</li>
              <li>Any patient-related records or data shall be retained or transferred in accordance with applicable laws and data privacy requirements.</li>
            </ul>

            <h3 className="font-semibold mb-2">Survival of Terms</h3>
            <p className="mb-4">
              Notwithstanding the termination or expiration of this Agreement, the following provisions shall survive: <strong>Confidentiality, Intellectual Property, Limitation of Liability, Indemnification.</strong>
            </p>

            <h3 className="font-semibold mb-2">Amendment and Updates</h3>
            <p className="mb-4">
              We reserve the right to amend, modify, or update these RMP Terms, the System, or any related policies at any time. Any such changes will be communicated to You through reasonable means, including but not limited to email notification or posting updated terms on the website.
            </p>
            <p className="mb-4">
              Your continued access to or use of the System and/or Services after the effective date of any such changes shall constitute Your acceptance of the amended terms. If You do not agree to any modification, Your sole remedy is to discontinue using the Services.
            </p>
            <p>
              It is your responsibility to review the applicable terms regularly to ensure continued compliance.
            </p>
          </div>

          {/* Accept Terms Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer mb-6">
            <input
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={(e) => updateFormData({ termsAccepted: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-[#1e3a5f]">
              I accept the Terms and Conditions. <span className="text-red-500">*</span>
            </span>
          </label>

          {/* Signature */}
          <div className="mb-6">
            <label className={labelClass}>
              Signature of the Registered Medical Practitioner <span className="text-red-500">*</span>
            </label>
            <SignaturePad
              value={formData.signatureDataUrl}
              onChange={(dataUrl) => updateFormData({ signatureDataUrl: dataUrl })}
            />
          </div>
        </div>

        {/* ========== Footer Buttons ========== */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Submit
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
