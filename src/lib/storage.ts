/**
 * Storage utility for MedDocProof
 * Primary: ImageKit (images, PDFs, documents)
 * Fallback: Local filesystem (development) or S3-compatible storage
 */

import { isImageKitUrl, getOptimizedImageUrl } from "./imagekit";

// ImageKit configuration (primary storage)
const IMAGEKIT_CONFIG = {
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
};

// Legacy S3 configuration (fallback)
const STORAGE_CONFIG = {
  endpoint: process.env.STORAGE_ENDPOINT || "",
  bucket: process.env.STORAGE_BUCKET || "meddocproof",
  accessKey: process.env.STORAGE_ACCESS_KEY || "",
  secretKey: process.env.STORAGE_SECRET_KEY || "",
  region: process.env.STORAGE_REGION || "auto",
  publicUrl: process.env.STORAGE_PUBLIC_URL || "",
};

const ALLOWED_FILE_TYPES: Record<string, string[]> = {
  idProof: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  photo: ["image/jpeg", "image/png", "image/webp"],
  walkingVideo: ["video/mp4", "video/webm", "video/quicktime"],
  document: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  additionalDocument: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  specialFormat: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  caretakerGovtId: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
};

const MAX_FILE_SIZES: Record<string, number> = {
  idProof: 5 * 1024 * 1024, // 5MB
  photo: 5 * 1024 * 1024,
  walkingVideo: 50 * 1024 * 1024, // 50MB
  document: 10 * 1024 * 1024,
  additionalDocument: 10 * 1024 * 1024,
  specialFormat: 10 * 1024 * 1024, // 10MB
  caretakerGovtId: 5 * 1024 * 1024, // 5MB
};

/**
 * Generate a unique file key for storage
 */
export function generateFileKey(
  userId: string,
  fileType: string,
  originalName: string
): string {
  const timestamp = Date.now();
  const ext = originalName.split(".").pop() || "bin";
  const sanitizedName = originalName
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .substring(0, 50);
  return `uploads/${userId}/${fileType}/${timestamp}_${sanitizedName}.${ext}`;
}

/**
 * Validate file type and size
 */
export function validateFile(
  fileType: string,
  contentType: string,
  fileSize?: number
): { valid: boolean; error?: string } {
  const allowedTypes = ALLOWED_FILE_TYPES[fileType];
  if (!allowedTypes) {
    return { valid: false, error: `Invalid file type category: ${fileType}` };
  }

  if (!allowedTypes.includes(contentType)) {
    return {
      valid: false,
      error: `File type ${contentType} not allowed for ${fileType}. Allowed: ${allowedTypes.join(", ")}`,
    };
  }

  const maxSize = MAX_FILE_SIZES[fileType];
  if (fileSize && maxSize && fileSize > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit`,
    };
  }

  return { valid: true };
}

/**
 * Get a public or optimized URL for a stored file
 * Handles ImageKit URLs, S3 URLs, and local files
 */
export function getFileUrl(fileKey: string): string {
  // If it's already a full URL (ImageKit or other), return optimized version
  if (fileKey.startsWith("http://") || fileKey.startsWith("https://")) {
    if (isImageKitUrl(fileKey)) {
      // Return optimized ImageKit URL with auto format
      return getOptimizedImageUrl(fileKey, { format: "auto", quality: 80 });
    }
    return fileKey;
  }

  // Legacy S3 storage support
  if (STORAGE_CONFIG.publicUrl) {
    return `${STORAGE_CONFIG.publicUrl}/${fileKey}`;
  }
  if (STORAGE_CONFIG.endpoint) {
    return `${STORAGE_CONFIG.endpoint}/${STORAGE_CONFIG.bucket}/${fileKey}`;
  }
  
  // Fallback: serve via our API route (local files)
  return `/api/documents/signed-url?key=${encodeURIComponent(fileKey)}`;
}

/**
 * Check if S3 storage is configured (legacy)
 */
export function isStorageConfigured(): boolean {
  return !!(STORAGE_CONFIG.endpoint && STORAGE_CONFIG.accessKey && STORAGE_CONFIG.secretKey);
}

/**
 * Check if ImageKit is configured
 */
export function isImageKitStorageConfigured(): boolean {
  return !!IMAGEKIT_CONFIG.urlEndpoint;
}

export { STORAGE_CONFIG, IMAGEKIT_CONFIG, ALLOWED_FILE_TYPES, MAX_FILE_SIZES };
