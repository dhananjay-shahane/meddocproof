import { NextRequest, NextResponse } from "next/server";
import { uploadToImageKit, isImageKitConfigured } from "@/lib/imagekit";
import { validateUserRequest, isAuthError } from "@/lib/api-auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// POST - File upload handler
// Uses ImageKit when configured, falls back to local storage
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const auth = await validateUserRequest(request);
    if (isAuthError(auth)) return auth;

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const fileKey = formData.get("key") as string | null;
    const fileType = formData.get("fileType") as string | null;

    if (!file || !fileKey) {
      return NextResponse.json(
        { success: false, message: "File and key are required" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "File size exceeds 50MB limit" },
        { status: 413 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: `File type "${file.type}" is not allowed` },
        { status: 400 }
      );
    }

    // Get file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Try ImageKit upload first (production)
    if (isImageKitConfigured()) {
      // Extract userId from key: uploads/{folder}/{fileType}/{timestamp}_{filename}
      const keyParts = fileKey.split("/");
      const userId = keyParts[1] || "unknown";
      // Use fileType from form data first, then from key path
      const extractedFileType = fileType || keyParts[2] || "document";

      const result = await uploadToImageKit(
        buffer,
        file.name,
        extractedFileType,
        userId
      );

      if (result.success && result.url) {
        return NextResponse.json({
          success: true,
          data: {
            fileKey: result.filePath || fileKey,
            url: result.url,
            fileId: result.fileId,
            thumbnailUrl: result.thumbnailUrl,
          },
        });
      }

      // If ImageKit upload fails, log and fall back to local
      console.error("ImageKit upload failed, falling back to local:", result.error);
    }

    // Fallback: Local file storage (development)
    // Sanitize fileKey to prevent path traversal
    const normalizedKey = path.normalize(fileKey).replace(/\\/g, "/");
    if (
      normalizedKey.includes("..") ||
      normalizedKey.startsWith("/") ||
      normalizedKey.startsWith("\\")
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid file path" },
        { status: 400 }
      );
    }

    const publicDir = path.resolve(path.join(process.cwd(), "public"));
    const filePath = path.resolve(path.join(publicDir, normalizedKey));

    // Ensure resolved path stays within public directory
    if (!filePath.startsWith(publicDir + path.sep)) {
      return NextResponse.json(
        { success: false, message: "Invalid file path" },
        { status: 400 }
      );
    }

    const uploadDir = path.dirname(filePath);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      data: {
        fileKey: normalizedKey,
        url: `/${normalizedKey}`,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}
