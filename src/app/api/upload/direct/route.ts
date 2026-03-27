import { NextRequest, NextResponse } from "next/server";
import { uploadToImageKit, isImageKitConfigured } from "@/lib/imagekit";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// POST - File upload handler
// Uses ImageKit when configured, falls back to local storage
export async function POST(request: NextRequest) {
  try {
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
    const uploadDir = path.join(process.cwd(), "public", path.dirname(fileKey));
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(process.cwd(), "public", fileKey);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      data: {
        fileKey,
        url: `/${fileKey}`,
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
