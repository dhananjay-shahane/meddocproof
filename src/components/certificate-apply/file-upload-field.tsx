"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText, Image, Loader2 } from "lucide-react";
import api from "@/lib/api";

interface FileUploadFieldProps {
  label: string;
  required?: boolean;
  value: string; // URL of uploaded file
  onChange: (url: string) => void;
  category: string; // idProof, specialFormat, caretakerGovtId
  accept?: string;
  hint?: string;
}

export function FileUploadField({
  label,
  required,
  value,
  onChange,
  category,
  accept = "image/*,application/pdf",
  hint,
}: FileUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      try {
        setUploading(true);
        setError(null);

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          setError("File size must be less than 10MB");
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        const key = `uploads/${category}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        formData.append("key", key);

        const res = await api.post("/upload/direct", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data.success) {
          onChange(res.data.data.url);
          setFileName(file.name);
        } else {
          setError("Upload failed. Try again.");
        }
      } catch {
        setError("Upload failed. Try again.");
      } finally {
        setUploading(false);
      }
    },
    [category, onChange]
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
    const isPdf = value.endsWith(".pdf") || fileName.endsWith(".pdf");
    return (
      <div>
        <label className="mb-1 block text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center gap-3 rounded-lg border bg-green-50 p-3 dark:bg-green-900/20">
          {isPdf ? (
            <FileText className="h-8 w-8 text-red-500" />
          ) : (
            <Image className="h-8 w-8 text-blue-500" />
          )}
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium">
              {fileName || "Uploaded file"}
            </p>
            <p className="text-xs text-green-600">Uploaded successfully</p>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/30 p-6 transition-colors hover:border-primary/50 hover:bg-muted/50"
      >
        {uploading ? (
          <>
            <Loader2 className="mb-2 h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </>
        ) : (
          <>
            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">
              Click or drag to upload
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              PDF or Image (max 10MB)
            </p>
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
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
