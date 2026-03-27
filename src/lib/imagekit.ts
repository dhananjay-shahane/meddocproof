/**
 * ImageKit integration for MedDocProof
 * Handles file uploads (images, PDFs, documents) to ImageKit CDN
 */

import ImageKit from "imagekit";

// ImageKit configuration
const IMAGEKIT_CONFIG = {
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
};

// Initialize ImageKit instance (server-side only)
let imagekitInstance: ImageKit | null = null;

function getImageKit(): ImageKit {
  if (!imagekitInstance) {
    if (!IMAGEKIT_CONFIG.publicKey || !IMAGEKIT_CONFIG.privateKey || !IMAGEKIT_CONFIG.urlEndpoint) {
      throw new Error("ImageKit configuration is missing. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT environment variables.");
    }
    imagekitInstance = new ImageKit({
      publicKey: IMAGEKIT_CONFIG.publicKey,
      privateKey: IMAGEKIT_CONFIG.privateKey,
      urlEndpoint: IMAGEKIT_CONFIG.urlEndpoint,
    });
  }
  return imagekitInstance;
}

/**
 * Check if ImageKit is configured
 */
export function isImageKitConfigured(): boolean {
  return !!(IMAGEKIT_CONFIG.publicKey && IMAGEKIT_CONFIG.privateKey && IMAGEKIT_CONFIG.urlEndpoint);
}

/**
 * Folder mapping for organized storage
 */
const FOLDER_MAP: Record<string, string> = {
  idProof: "applications/id-proofs",
  photo: "doctors/profile-photos",
  walkingVideo: "applications/walking-videos",
  document: "doctors/documents",
  additionalDocument: "applications/additional-docs",
  specialFormat: "applications/special-formats",
  caretakerGovtId: "applications/caretaker-ids",
  profilePhoto: "doctors/profile-photos",
  medicalLicense: "doctors/medical-licenses",
  govtIdProof: "doctors/govt-ids",
  degreeCertificate: "doctors/degree-certificates",
  signature: "doctors/signatures",
};

/**
 * Get the ImageKit folder path for a file type
 */
export function getImageKitFolder(fileType: string, userId?: string): string {
  const baseFolder = FOLDER_MAP[fileType] || "uploads";
  if (userId) {
    return `${baseFolder}/${userId}`;
  }
  return baseFolder;
}

/**
 * Upload result from ImageKit
 */
export interface ImageKitUploadResult {
  success: boolean;
  url?: string;
  fileId?: string;
  name?: string;
  filePath?: string;
  thumbnailUrl?: string;
  error?: string;
}

/**
 * Upload a file to ImageKit
 * @param file - File buffer or base64 string
 * @param fileName - Original file name
 * @param fileType - Type category (idProof, photo, document, etc.)
 * @param userId - Optional user ID for folder organization
 */
export async function uploadToImageKit(
  file: Buffer | string,
  fileName: string,
  fileType: string,
  userId?: string
): Promise<ImageKitUploadResult> {
  try {
    const imagekit = getImageKit();
    const folder = getImageKitFolder(fileType, userId);
    
    // Generate unique file name with timestamp
    const timestamp = Date.now();
    const sanitizedName = fileName
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .substring(0, 50);
    const uniqueFileName = `${timestamp}_${sanitizedName}`;

    const response = await imagekit.upload({
      file: file, // Buffer or base64 string
      fileName: uniqueFileName,
      folder: folder,
      useUniqueFileName: false, // We handle uniqueness with timestamp
      tags: [fileType, userId || "anonymous"].filter(Boolean),
    });

    return {
      success: true,
      url: response.url,
      fileId: response.fileId,
      name: response.name,
      filePath: response.filePath,
      thumbnailUrl: response.thumbnailUrl,
    };
  } catch (error) {
    console.error("ImageKit upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Delete a file from ImageKit
 * @param fileId - ImageKit file ID
 */
export async function deleteFromImageKit(fileId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const imagekit = getImageKit();
    await imagekit.deleteFile(fileId);
    return { success: true };
  } catch (error) {
    console.error("ImageKit delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    };
  }
}

/**
 * Get authentication parameters for client-side uploads
 * These can be used with ImageKit's client SDK for direct uploads
 */
export function getImageKitAuthParams(): {
  token: string;
  expire: number;
  signature: string;
} {
  const imagekit = getImageKit();
  return imagekit.getAuthenticationParameters();
}

/**
 * Image transformation options
 */
export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  blur?: number;
  grayscale?: boolean;
  crop?: "at_max" | "at_least" | "maintain_ratio" | "force" | "pad_resize";
}

/**
 * Get an optimized URL for an ImageKit image
 * @param originalUrl - Original ImageKit URL
 * @param options - Transformation options
 */
export function getOptimizedImageUrl(
  originalUrl: string,
  options: ImageTransformOptions = {}
): string {
  if (!originalUrl || !originalUrl.includes("imagekit.io")) {
    return originalUrl;
  }

  const transformations: string[] = [];

  if (options.width) transformations.push(`w-${options.width}`);
  if (options.height) transformations.push(`h-${options.height}`);
  if (options.quality) transformations.push(`q-${options.quality}`);
  if (options.format) transformations.push(`f-${options.format}`);
  if (options.blur) transformations.push(`bl-${options.blur}`);
  if (options.grayscale) transformations.push("e-grayscale");
  if (options.crop) transformations.push(`c-${options.crop}`);

  if (transformations.length === 0) {
    // Default optimization: auto format, quality 80
    transformations.push("f-auto", "q-80");
  }

  // Insert transformations into URL
  // ImageKit URL format: https://ik.imagekit.io/your_id/path/to/file.jpg
  // Transformed URL: https://ik.imagekit.io/your_id/tr:w-300,h-300/path/to/file.jpg
  const urlObj = new URL(originalUrl);
  const pathParts = urlObj.pathname.split("/");
  
  // Find the position after the account ID (first path segment after /)
  if (pathParts.length >= 2) {
    const accountId = pathParts[1];
    const restPath = pathParts.slice(2).join("/");
    urlObj.pathname = `/${accountId}/tr:${transformations.join(",")}/${restPath}`;
  }

  return urlObj.toString();
}

/**
 * Get thumbnail URL for an image
 */
export function getThumbnailUrl(originalUrl: string, size: number = 150): string {
  return getOptimizedImageUrl(originalUrl, {
    width: size,
    height: size,
    crop: "at_max",
    quality: 70,
    format: "auto",
  });
}

/**
 * Check if a URL is an ImageKit URL
 */
export function isImageKitUrl(url: string): boolean {
  return url?.includes("imagekit.io") || url?.includes("ik.imagekit.io");
}

/**
 * Extract file ID from ImageKit URL (if available in metadata)
 * Note: ImageKit URLs don't contain file IDs, use database to store fileId
 */
export function getFileIdFromUrl(url: string): string | null {
  // ImageKit URLs don't directly contain file IDs
  // You need to store the fileId separately when uploading
  return null;
}

// Export config for reference
export { IMAGEKIT_CONFIG, FOLDER_MAP };
