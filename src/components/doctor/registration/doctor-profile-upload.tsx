"use client";

import { useState, useRef, useCallback } from "react";
import { Camera, Upload, X, Loader2, User, Pen } from "lucide-react";
import api from "@/lib/api";

interface ProfilePhotoUploadProps {
  value: string;
  onChange: (url: string) => void;
  error?: string;
}

export function ProfilePhotoUpload({
  value,
  onChange,
  error,
}: ProfilePhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      try {
        setUploading(true);
        setUploadError(null);

        // Validate file size (5MB max for photos)
        if (file.size > 5 * 1024 * 1024) {
          setUploadError("Photo size must be less than 5MB");
          return;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
          setUploadError("Please upload an image file");
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        const key = `uploads/doctor-profiles/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        formData.append("key", key);

        const res = await api.post("/upload/direct", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data.success) {
          onChange(res.data.data.url);
        } else {
          setUploadError("Upload failed. Try again.");
        }
      } catch {
        setUploadError("Upload failed. Try again.");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  const removePhoto = useCallback(() => {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }, [onChange]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div
          className={`h-28 w-28 rounded-full border-2 border-dashed ${
            error ? "border-red-500" : "border-muted-foreground/30"
          } flex items-center justify-center overflow-hidden bg-muted/50`}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : value ? (
            <img
              src={value}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-12 w-12 text-muted-foreground/50" />
          )}
        </div>
        
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors"
        >
          <Camera className="h-4 w-4" />
        </button>
        
        {value && (
          <button
            type="button"
            onClick={removePhoto}
            className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
      
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <p className="text-xs text-muted-foreground">
        Upload profile photo (Max 5MB)
      </p>
      
      {(uploadError || error) && (
        <p className="text-xs text-red-500">{uploadError || error}</p>
      )}
    </div>
  );
}

interface SignatureUploadProps {
  value: string;
  onChange: (url: string) => void;
  error?: string;
}

export function SignatureUpload({
  value,
  onChange,
  error,
}: SignatureUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      try {
        setUploading(true);
        setUploadError(null);

        // Validate file size (2MB max for signatures)
        if (file.size > 2 * 1024 * 1024) {
          setUploadError("Signature file must be less than 2MB");
          return;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
          setUploadError("Please upload an image file");
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        const key = `uploads/doctor-signatures/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        formData.append("key", key);

        const res = await api.post("/upload/direct", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data.success) {
          onChange(res.data.data.url);
        } else {
          setUploadError("Upload failed. Try again.");
        }
      } catch {
        setUploadError("Upload failed. Try again.");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  const removeSignature = useCallback(() => {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }, [onChange]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        Signature <span className="text-red-500">*</span>
      </label>
      
      <div
        onClick={() => !value && inputRef.current?.click()}
        className={`relative flex min-h-[100px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed ${
          error ? "border-red-500" : "border-muted-foreground/30"
        } bg-muted/30 p-4 transition-colors hover:border-primary/50`}
      >
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        ) : value ? (
          <div className="relative w-full">
            <img
              src={value}
              alt="Signature"
              className="mx-auto max-h-20 object-contain"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeSignature();
              }}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Pen className="h-8 w-8" />
            <span className="text-sm">Click to upload signature</span>
          </div>
        )}
      </div>
      
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <p className="text-xs text-muted-foreground">
        Upload your signature image (PNG/JPG, Max 2MB)
      </p>
      
      {(uploadError || error) && (
        <p className="text-xs text-red-500">{uploadError || error}</p>
      )}
    </div>
  );
}

interface DocumentUploadFieldProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  error?: string;
  accept?: string;
}

export function DocumentUploadField({
  label,
  required,
  value,
  onChange,
  hint,
  error,
  accept = "image/*,application/pdf",
}: DocumentUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      try {
        setUploading(true);
        setUploadError(null);

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          setUploadError("File size must be less than 10MB");
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        const key = `uploads/doctor-documents/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        formData.append("key", key);

        const res = await api.post("/upload/direct", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data.success) {
          onChange(res.data.data.url);
          setFileName(file.name);
        } else {
          setUploadError("Upload failed. Try again.");
        }
      } catch {
        setUploadError("Upload failed. Try again.");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  const removeFile = useCallback(() => {
    onChange("");
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
  }, [onChange]);

  if (value) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center gap-3 rounded-lg border bg-green-50 p-3 dark:bg-green-900/20">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/40">
            <Upload className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-green-700 dark:text-green-400">
              {fileName || "Document uploaded"}
            </p>
            <p className="text-xs text-green-600/70">Upload complete</p>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-green-200 dark:hover:bg-green-800"
          >
            <X className="h-4 w-4 text-green-700" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`flex min-h-[80px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed ${
          error ? "border-red-500" : "border-muted-foreground/30"
        } bg-muted/30 p-4 transition-colors hover:border-primary/50`}
      >
        {uploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        ) : (
          <>
            <Upload className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Click or drag file to upload
            </span>
          </>
        )}
      </div>
      
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      
      {(uploadError || error) && (
        <p className="text-xs text-red-500">{uploadError || error}</p>
      )}
    </div>
  );
}
